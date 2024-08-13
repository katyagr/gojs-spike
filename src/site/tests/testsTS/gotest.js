/*
 *  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
 *
 *  Restricted Rights: Use, duplication, or disclosure by the U.S.
 *  Government is subject to restrictions as set forth in subparagraph
 *  (c) (1) (ii) of DFARS 252.227-7013, or in FAR 52.227-19, or in FAR
 *  52.227-14 Alt. III, as applicable.
 *
 *  This software is proprietary to and embodies the confidential
 *  technology of Northwoods Software Corporation. Possession, use, or
 *  copying of this software and media is authorized only pursuant to a
 *  valid written license from Northwoods or an authorized sublicensor.
 */
/*
  Test class
  TestCollection class
  TestRoot global variable
  initTree function
*/
// This code assumes there's a "myDiagram" div for test diagrams,
// a "myTestTree" div for holding the tree of test cases,
// and a "myStatus" div for showing status messages.
const isMac = false; //??? (this.navigator !== undefined && this.navigator.platform !== undefined && this.navigator.platform.toUpperCase().indexOf('MAC') >= 0);
import * as go from 'gojs';
/**
 * @constructor
 * @param {string} name
 * @param {string | Diagram | null} diagram
 * @param {function(Test)} setup
 * @param {function(Test)} execute
 * @param {function(Test)} check
 * @class
 * A Test is a named object that can be {@link #run} to execute the test.
 * Tests are grouped in {@link TestCollection}s.
 * TestCollections and Tests form a tree structure, with Tests being the leaves.
 * <p/>
 * For convenience in defining tests, there are separate functions
 * for setting up a known state, for performing the actions that are being tested,
 * and for checking the side-effects of the test.
 * The setup functions are often shared by multiple Tests, and to a lesser extent,
 * so are the check functions.
 */
export class Test {
    constructor(name, diagram, setup, execute, check) {
        this.parent = null;
        this.name = name;
        this.diagramId = typeof diagram === 'string' ? diagram : '';
        this.diagram = diagram instanceof go.Diagram ? diagram : null;
        this.preSetup = null;
        this.setup = setup || null;
        this.exec = execute || null;
        this.check = check || null;
        this.animated = false;
        this.savedEvent = null;
    }
    /**
     * Returns a string of names, starting with the root {@link TestCollection},
     * going down to this particular Test.
     * @this {Test}
     * @return {string}
     */
    getPath() {
        let str = this.name;
        let t = this;
        while (t && t.parent) {
            str = t.parent.name + '|' + str;
            t = t.parent;
        }
        return str;
    }
    /**
     * reset current test to null, so the next test can run in TestCollection.run
     * @this {Test}
     */
    unblock() {
        TestCollection.Current = null;
    }
    /**
     * Execute the three parts of each test: the setup, the execution, and the check.
     * @this {Test}
     */
    run() {
        if (TestCollection.LogTestName)
            this.log(this.getPath());
        // find or reuse a Diagram
        if (this.diagramId !== '') {
            this.diagram = go.Diagram.fromDiv(this.diagramId);
            // don't reset() this!
        }
        else {
            if (this.diagram === null) {
                this.diagram = TestCollection.GlobalDiagram;
                if (!this.diagram)
                    return;
                // make sure it's hosted in the DOM
                if (this.diagram.div === null) {
                    let div = document.getElementById('myDiagramDiv');
                    if (!div)
                        div = document.getElementById('myDiagram');
                    if (div instanceof HTMLDivElement)
                        this.diagram.div = div;
                }
            }
            this.diagram.reset();
            if (this.diagram.reset === go.Diagram.prototype.reset) {
                const test = this;
                this.diagram.reset = function () {
                    go.Diagram.prototype.reset.call(this);
                    this.skipsUndoManager = true;
                    this.initialContentAlignment = go.Spot.None; // forward compatible with 2.0
                    this.animationManager.isEnabled = test.animated;
                    this.skipsUndoManager = false;
                };
            }
            if (!this.animated) {
                this.diagram.animationManager.stopAnimation();
                this.diagram.animationManager.isEnabled = false;
            }
            else {
                this.diagram.animationManager.isEnabled = true;
                // Tests MUST end with test.unblock(), unless we uncomment this
                // this.diagram.addDiagramListener('AnimationFinished', function() {
                //   TestCollection.Current = null; // reset this so the next test can run in TestCollection.run
                // })
            }
            let currentParent = this.parent;
            while (currentParent && currentParent.parent) {
                currentParent = currentParent.parent;
                if (currentParent.preSetup)
                    currentParent.preSetup(this);
            }
        }
        if (TestCollection.Catch) {
            try {
                if (this.setup)
                    this.setup(this);
                if (this.diagram === null && this.diagramId !== '') {
                    this.diagram = go.Diagram.fromDiv(this.diagramId);
                }
            }
            catch (ex) {
                this.error(ex.toString());
            }
            if (this.diagram !== null) {
                this.diagram.maybeUpdate();
            }
            try {
                if (this.exec)
                    this.exec(this);
            }
            catch (ex) {
                this.error(ex.toString());
            }
            if (this.diagram !== null) {
                this.diagram.maybeUpdate();
            }
            try {
                if (this.check)
                    this.check(this);
            }
            catch (ex) {
                this.error(ex.toString());
            }
        }
        else {
            if (this.setup)
                this.setup(this);
            if (this.diagram !== null)
                this.diagram.maybeUpdate();
            if (this.exec)
                this.exec(this);
            if (this.diagram !== null)
                this.diagram.maybeUpdate();
            if (this.check)
                this.check(this);
        }
        if (this.diagramId !== '') {
            if (this.diagram !== null)
                this.diagram.div = null;
        }
        if (this.savedEvent) {
            this.savedEvent = null; // events.js specific teardown
        }
    }
    /**
     * Log a message to the console, as a warning
     * @this {Test}
     * @param {string} msg
     */
    log(msg) {
        if (window) {
            TestCollection.TotalWarnings++;
            if (window.console)
                window.console.log(msg);
        }
    }
    /**
     * Log an error message to the console, including this Test's full path/name.
     * If TestCollection.Alerts is true, also put up a JavaScript alert box.
     * @this {Test}
     * @param {string} msg
     */
    error(msg) {
        if (window) {
            TestCollection.TotalErrors++;
            const str = this.getPath() + '\n  ' + msg;
            this.log(str);
            if (TestCollection.Alerts)
                window.alert(str);
        }
    }
    /**
     * This is the basic checking function.
     * @this {Test}
     * @param {boolean} pred
     * @param {string} msg
     */
    assert(pred, msg) {
        if (!pred) {
            this.error(msg);
        }
    }
    /**
     * Dump the locations of all Nodes as Points in an Array, as a string.
     */
    dumpAllNodeLocations() {
        const diagram = this.diagram;
        if (!diagram)
            return;
        const datas = diagram.model.nodeDataArray;
        if (!window.console)
            return;
        let msg = this.name + ' [';
        for (let i = 0; i < datas.length; i++) {
            const node = diagram.findPartForData(datas[i]);
            if (!node)
                continue;
            const pos = node.location;
            if (i > 0)
                msg += ', ';
            msg += 'new go.Point(' + pos.x.toFixed(1) + ',' + pos.y.toFixed(1) + ')';
        }
        window.console.log(msg + ']');
    }
    /**
     * Dump the Points of all of the links in an Array, as a string.
     * @this {Test}
     */
    dumpLinkPoints() {
        const diagram = this.diagram;
        if (!diagram)
            return;
        if (window.console) {
            const datas = diagram.model.linkDataArray;
            for (let i = 0; i < datas.length; i++) {
                const link = diagram.findLinkForData(datas[i]);
                if (!link)
                    continue;
                const points = link.points;
                let msg = '  [';
                for (let j = 0; j < points.length; j++) {
                    if (j > 0)
                        msg += ', ';
                    msg +=
                        'new go.Point(' + points.elt(j).x.toFixed(1) + ',' + points.elt(j).y.toFixed(1) + ')';
                }
                window.console.log(msg + ']');
            }
        }
    }
    /**
     * Dump the Geometries of all of the links.
     * @this {Test}
     */
    dumpLinkGeometries() {
        const diagram = this.diagram;
        if (!diagram)
            return;
        const datas = diagram.model.linkDataArray;
        for (let i = 0; i < datas.length; i++) {
            const link = diagram.findLinkForData(datas[i]);
            if (link) {
                const msg = this.name + ' ' + link.geometry.toString(1);
                window.console.log(msg);
            }
        }
    }
    // various useful methods for checking state
    /**
     * Check that all of the Nodes are at given locations.
     * @this {Test}
     * @param {Array} ptarr an Array of Points, the location of each Node corresponding to the data objects in model.nodeDataArray.
     */
    assertAllNodeLocations(ptarr) {
        if (!Array.isArray(ptarr))
            throw new Error('first arg is not an Array: ' + ptarr);
        if (!this.diagram)
            return;
        const model = this.diagram.model;
        const datas = model.nodeDataArray;
        for (let i = 0; i < ptarr.length; i++) {
            const expected = ptarr[i];
            const node = this.diagram.findNodeForData(datas[i]);
            const actual = node.location;
            this.assert(this.isApproxPoint(expected, actual), 'Node is at location ' + actual + ' instead of at ' + expected);
        }
    }
    /**
     * Check that all Links have specific routes.
     * This checks all Links in the order of the model.linkDataArray.
     * @this {Test}
     * @param {Array.Array.<Point>} testArrayPoints
     */
    assertAllLinkPoints(testArrayPoints) {
        if (!Array.isArray(testArrayPoints))
            throw new Error('first arg is not an Array: ' + testArrayPoints);
        if (!this.diagram)
            return;
        const model = this.diagram.model;
        const datas = model.linkDataArray;
        this.assert(Array.isArray(datas), 'model.linkDataArray is not an Array: ' + datas);
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const link = this.diagram.findLinkForData(data);
            this.assert(link !== null, 'Did not find Link for link data: ' + data);
            if (link)
                this.assertLinkPoints(link, testArrayPoints[i]);
        }
    }
    /**
     * Check that a particular Link has a particular route, i.e. array of Points.
     * @this {Test}
     * @param {Link} link
     * @param {Array.<Point>} testPoints
     */
    assertLinkPoints(link, testPoints) {
        if (!(link instanceof go.Link))
            throw new Error('first arg is not a link: ' + link);
        const linkPoints = link.points;
        if (!linkPoints || !testPoints)
            return;
        this.assert(linkPoints.length === testPoints.length, 'The number of points of ' +
            link +
            ' is incorrect. Got: ' +
            linkPoints.length +
            '. Expected: ' +
            testPoints.length);
        if (linkPoints.length === testPoints.length) {
            let msg = '';
            for (let i = 0; i < testPoints.length; i++) {
                const linkPt = linkPoints.elt(i);
                const testPt = testPoints[i];
                if (!this.isApproxPoint(linkPt, testPt)) {
                    msg +=
                        '\nPoint ' +
                            i +
                            ' of ' +
                            link +
                            ' has a value of (' +
                            linkPt.x +
                            ', ' +
                            linkPt.y +
                            '), instead of (' +
                            testPt.x +
                            ', ' +
                            testPt.y +
                            '), its expected value.';
                }
            }
            this.assert(msg.length === 0, msg);
        }
    }
    /**
     * Check the Geometry of every Link.
     * Unlike assertLinkPoints, this checks the path geometries, not just the Points of the routes.
     * @this {Test}
     * @param {Array.string} testArrayGeometries
     */
    assertAllLinkGeometries(testArrayGeometries) {
        if (!Array.isArray(testArrayGeometries))
            throw new Error('first arg is not an Array: ' + testArrayGeometries);
        if (!this.diagram)
            return;
        const model = this.diagram.model;
        const datas = model.linkDataArray;
        this.assert(Array.isArray(datas), 'model.linkDataArray is not an Array: ' + datas);
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            const link = this.diagram.findLinkForData(data);
            this.assert(link !== null, 'Did not find Link for link data: ' + data);
            if (link)
                this.assertLinkGeometry(link, testArrayGeometries[i]);
        }
    }
    /**
     * Check the Geometry of a single Link.
     * @this {Test}
     * @param {Link} link
     * @param {Geometry | string} testGeom
     */
    assertLinkGeometry(link, testGeom) {
        const linkgeo = link.geometry;
        const geomstr = linkgeo.toString(1);
        const teststr = typeof testGeom === 'string' ? testGeom : testGeom.toString(1);
        const testgeo = testGeom instanceof go.Geometry ? testGeom : go.Geometry.parse(testGeom);
        const same = linkgeo.equalsApprox(testgeo) || geomstr === teststr; //?? still depending on precise string comparisons when there are multiple PathFigures
        this.assert(same, 'The geometry of ' + link + ' is incorrect. Got: ' + geomstr + '.\n  Expected: ' + teststr);
    }
    /**
     * Returns a list of every point that would be used in the drawing of the geometry
     * [x, y, x, y, x, y, x, y]
     * Making no distinction between control points or end points
     * Used for consistency/regression testing
     * @param {Geometry} geom
     * @this {Test}
     */
    pathToPointArray(geom) {
        if (geom.type !== go.Geometry.Path)
            return null;
        const arr = [];
        const figs = geom.figures.iterator;
        // for each PathFigure:
        while (figs.next()) {
            const fig = figs.value;
            arr.push(fig.startX);
            arr.push(fig.startY);
            // for each segment of the PathFigure:
            const segments = fig.segments.iterator;
            let lastpointX = fig.startX;
            let lastpointY = fig.startY;
            while (segments.next()) {
                const seg = segments.value;
                switch (seg.type) {
                    case go.PathSegment.Line:
                    case go.PathSegment.Move:
                        arr.push(seg.endX);
                        arr.push(seg.endY);
                        lastpointX = seg.endX;
                        lastpointY = seg.endY;
                        break;
                    case go.PathSegment.Bezier:
                        arr.push(seg.point1X);
                        arr.push(seg.point1Y);
                        arr.push(seg.point2X);
                        arr.push(seg.point2Y);
                        arr.push(seg.endX);
                        arr.push(seg.endY);
                        lastpointX = seg.endX;
                        lastpointY = seg.endY;
                        break;
                    case go.PathSegment.QuadraticBezier:
                        arr.push(seg.point1X);
                        arr.push(seg.point1Y);
                        arr.push(seg.endX);
                        arr.push(seg.endY);
                        lastpointX = seg.endX;
                        lastpointY = seg.endY;
                        break;
                    case go.PathSegment.Arc:
                    case go.PathSegment.SvgArc: {
                        const curves = seg.type === go.PathSegment.Arc
                            ? seg.buildBeziers(fig)
                            : seg.buildSVGBeziers(fig, lastpointX, lastpointY);
                        const clen = curves.length;
                        let c = null;
                        for (let k = 0; k < clen; k++) {
                            c = curves[k];
                            arr.push(c.x2);
                            arr.push(c.y2);
                            arr.push(c.x3);
                            arr.push(c.y3);
                            arr.push(c.x4);
                            arr.push(c.y4);
                        }
                        if (c !== null) {
                            lastpointX = c.x4;
                            lastpointY = c.y4;
                        }
                        break;
                    }
                    default:
                        throw new Error('Unknown Segment type: ' + seg.type);
                        break;
                }
            } // end segments
        } // end figures
        return arr;
    }
    /**
     * True if the difference between X and Y is less than 0.00000005.
     * @this {Test}
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isApproxEqual(x, y) {
        const d = x - y;
        return d < 0.00000005 && d > -0.00000005;
    }
    /**
     * True if the difference between X and Y is less than 0.5.
     * @this {Test}
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isApprox(x, y) {
        const d = x - y;
        return d < 0.5 && d > -0.5;
    }
    /**
     * Check that both X and Y of each Point are approximately equal (< 0.5).
     * @this {Test}
     * @param {Point} a
     * @param {Point} b
     * @return {boolean}
     */
    isApproxPoint(a, b) {
        return this.isApprox(a.x, b.x) && this.isApprox(a.y, b.y);
    }
    /**
     * Check that both Width and Height of each Size are approximately equal (< 0.5).
     * @this {Test}
     * @param {Size} a
     * @param {Size} b
     * @return {boolean}
     */
    isApproxSize(a, b) {
        return this.isApprox(a.width, b.width) && this.isApprox(a.height, b.height);
    }
    /**
     * Check that X, Y, Width, and Height of each Rect are approximately equal (< 0.5).
     * @this {Test}
     * @param {Rect} a
     * @param {Rect} b
     * @return {boolean}
     */
    isApproxRect(a, b) {
        return (this.isApprox(a.x, b.x) &&
            this.isApprox(a.y, b.y) &&
            this.isApprox(a.width, b.width) &&
            this.isApprox(a.height, b.height));
    }
    // other useful functions
    /**
     * Simulate a mouse down event.
     * @this {Test}
     * @param {Point} pt a point in document coordinates.
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    mouseDown(pt, eventprops, optionalDiagram) {
        let diagram = optionalDiagram || this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        if (eventprops && eventprops.sourceDiagram)
            diagram = eventprops.sourceDiagram;
        if (!diagram || !diagram.isEnabled)
            return;
        const n = new go.InputEvent();
        n.diagram = diagram;
        n.documentPoint = pt;
        n.viewPoint = diagram.transformDocToView(pt);
        n.down = true;
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.firstInput = n.copy();
        diagram.currentTool.doMouseDown();
    }
    /**
     * Simulate a mouse move event.
     * @this {Test}
     * @param {Point} pt a point in document coordinates.
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    mouseMove(pt, eventprops, optionalDiagram) {
        let diagram = optionalDiagram || this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        if (eventprops && eventprops.sourceDiagram)
            diagram = eventprops.sourceDiagram;
        if (!diagram || !diagram.isEnabled)
            return;
        const n = new go.InputEvent();
        n.diagram = diagram;
        n.documentPoint = pt;
        n.viewPoint = diagram.transformDocToView(pt);
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.currentTool.doMouseMove();
    }
    /**
     * Simulate a mouse up event.
     * @this {Test}
     * @param {Point} pt a point in document coordinates.
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    mouseUp(pt, eventprops, optionalDiagram) {
        let diagram = optionalDiagram || this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        if (eventprops && eventprops.sourceDiagram)
            diagram = eventprops.sourceDiagram;
        if (!diagram || !diagram.isEnabled)
            return;
        let n = new go.InputEvent();
        n.diagram = diagram;
        n.documentPoint = pt;
        n.viewPoint = diagram.transformDocToView(pt);
        n.up = true;
        if (diagram.firstInput.documentPoint.equals(pt))
            n.clickCount = 1; // at least??
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.currentTool.doMouseUp();
    }
    /**
     * Simulate a mouse wheel event.
     * @this {Test}
     * @param {number} delta non-zero turn
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    mouseWheel(delta, eventprops) {
        const diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        const n = diagram.lastInput.copy();
        n.diagram = diagram;
        n.delta = delta;
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.currentTool.doMouseWheel();
    }
    /**
     * Simulate a key down event.
     * @this {Test}
     * @param {string|number} keyorcode
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    keyDown(keyorcode, eventprops) {
        const diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        const n = diagram.lastInput.copy();
        n.diagram = diagram;
        if (typeof keyorcode === 'string') {
            n.key = keyorcode;
        }
        else if (typeof keyorcode === 'number') {
            n.key = String.fromCharCode(keyorcode);
        }
        n.down = true;
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.currentTool.doKeyDown();
    }
    /**
     * Simulate a key up event.
     * @this {Test}
     * @param {string|number} keyorcode
     * @param {object=} eventprops an optional argument providing properties for the InputEvent.
     */
    keyUp(keyorcode, eventprops) {
        const diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        const n = diagram.lastInput.copy();
        n.diagram = diagram;
        if (typeof keyorcode === 'string') {
            n.key = keyorcode;
        }
        else if (typeof keyorcode === 'number') {
            n.key = String.fromCharCode(keyorcode);
        }
        n.up = true;
        if (eventprops) {
            for (const p in eventprops) {
                n[p] = eventprops[p];
                // If mac instead of control: true, switch to alt: true for drag-copy
                if (p === 'control' && isMac) {
                    n.alt = eventprops[p];
                    n.meta = eventprops[p];
                }
            }
        }
        diagram.lastInput = n;
        diagram.currentTool.doKeyUp();
    }
} // end of Test class
/**
 * @constructor
 * @param {string} name
 * @class
 * A TestCollection is a named collection of {@link Test}s and "child" TestCollections.
 * TestCollections and Tests form a tree structure,
 * with TestCollection as the root and the internal nodes and with Tests being the leaf nodes.
 * <p/>
 * The TestRoot global variable holds the root TestCollection.
 */
export class TestCollection {
    constructor(name) {
        this.parent = null;
        this.name = name;
        this.tests = new go.List( /*Test*/);
        this.collections = new go.List( /*TestCollection*/);
        this.preSetup = null;
    }
    /**
     * Add a {@link Test} or a {@link TestCollection} to this collection.
     * @this {TestCollection}
     * @param {Test|TestCollection} test
     */
    add(test) {
        if (test instanceof Test) {
            test.parent = this;
            this.tests.add(test);
        }
        else if (test instanceof TestCollection) {
            test.parent = this;
            this.collections.add(test);
        }
        else {
            throw new Error('not a Test or a TestCollection: ' + test);
        }
    }
    /**
     * Add a {@link Test} or a {@link TestCollection} to this collection.
     * @this {TestCollection}
     * @param {Test|TestCollection} test
     */
    addAnimated(test) {
        if (test instanceof Test) {
            test.parent = this;
            test.animated = true;
            this.tests.add(test);
        }
        else if (test instanceof TestCollection) {
            test.parent = this;
            this.collections.add(test);
        }
        else {
            throw new Error('not a Test or a TestCollection: ' + test);
        }
    }
    /**
     * Find a Test or a TestCollection that is directly in this collection.
     * @this {TestCollection}
     * @param {string} name
     * @return {Test|TestCollection}
     */
    find(name) {
        const tit = this.tests.iterator;
        while (tit.next()) {
            const t = tit.value;
            if (t.name === name)
                return t;
        }
        const cit = this.collections.iterator;
        while (cit.next()) {
            const tc = cit.value;
            if (tc.name === name)
                return tc;
        }
        return null;
    }
    /**
     * Search for a Test with the given name, anywhere in the test hierarchy starting at this collection.
     * @this {TestCollection}
     * @param {string} name
     * @return {Test}
     */
    findTest(name) {
        const tit = this.tests.iterator;
        while (tit.next()) {
            const t = tit.value;
            if (t.name === name)
                return t;
        }
        const cit = this.collections.iterator;
        while (cit.next()) {
            const tc = cit.value;
            const t = tc.findTest(name);
            if (t !== null)
                return t;
        }
        return null;
    }
    /**
     * Queue all of the tests in this collection, and all nested collections too.
     * @this {TestCollection}
     */
    queue() {
        let it = this.tests.iterator;
        while (it.next()) {
            const test = it.value;
            TestCollection.Queue.add(test);
        }
        const cit = this.collections.iterator;
        while (cit.next()) {
            const coll = cit.value;
            coll.queue();
        }
    }
    // Static methods and properties for controlling test runs
    /**
     * This static method starts running all Tests that are in the Queue.
     * It also puts out some statistics afterwards.
     */
    static run() {
        if (window) {
            if (TestCollection.Queue.length > 0) {
                TestCollection.setStatus('Tests remaining: ' + TestCollection.Queue.length.toString());
                if (TestCollection.Current === null ||
                    (TestCollection.Current !== null && TestCollection.Current.animated === false)) {
                    const first = TestCollection.Queue.elt(0);
                    TestCollection.Queue.removeAt(0);
                    TestCollection.Current = first;
                    if (first)
                        first.run();
                }
                let time = 1;
                if (TestCollection.Current !== null && TestCollection.Current.animated)
                    time = 100;
                window.setTimeout(TestCollection.run, time);
            }
            else {
                let tim = '';
                if (TestCollection.StartTime) {
                    const now = Date.now();
                    const duration = now - TestCollection.StartTime;
                    tim = ' in ' + (duration / 1000).toString() + ' seconds';
                    TestCollection.StartTime = undefined;
                }
                let num = '';
                if (TestCollection.TotalNumber)
                    num = TestCollection.TotalNumber.toString();
                let errs = '';
                if (TestCollection.TotalErrors)
                    errs = ' with ' + TestCollection.TotalErrors.toString() + ' errors ';
                let warns = '';
                if (TestCollection.TotalWarnings)
                    warns = ' and ' + TestCollection.TotalWarnings.toString() + ' warnings ';
                TestCollection.setStatus('finished running ' + num + ' tests ' + tim + errs);
                TestCollection.TotalNumber = 0;
                TestCollection.TotalErrors = 0;
            }
        }
    }
    /**
     * This static method updates a DIV named "myStatus" with a text message.
     * @param {string} msg
     */
    static setStatus(msg) {
        const status = document.getElementById(TestCollection.StatusId);
        if (status !== null) {
            status.innerHTML = msg.toString();
        }
    }
    /**
     * This static method finds a Test given a path of names.
     * @param {string} path
     * @return {Test}
     */
    static findTest(path) {
        const split = path.split('|');
        if (split.length === 1) {
            // search for a Test, anywhere in tree
            return TestRoot.findTest(split[0]);
        }
        else {
            let t = TestRoot;
            // ignore initial '|'
            for (let i = 1; i < split.length; i++) {
                const n = split[i];
                const c = t instanceof TestCollection ? t.find(n) : null;
                if (c === null)
                    return null;
                t = c;
            }
            return t;
        }
    }
    /**
     * This static method queues all tests in TestRoot, and then runs them all.
     */
    static runAll() {
        TestCollection.StartTime = Date.now();
        TestCollection.TotalErrors = 0;
        TestRoot.queue();
        TestCollection.TotalNumber = TestCollection.Queue.length;
        TestCollection.run();
    }
} // end TestCollection class
// Static variables for controlling how tests are run:
TestCollection.GlobalDiagram = new go.Diagram();
TestCollection.StatusId = 'myStatus';
/**
 * The list of Tests to be run.
 * @type {List}
 */
TestCollection.Queue = new go.List( /*Test*/);
/**
 * Gets or sets whether very slow tests are run
 * @type {boolean}
 */
TestCollection.RunSlowTests = false;
/**
 * Gets or sets whether Test.run logs the name of the test.
 * @type {boolean}
 */
TestCollection.LogTestName = true;
/**
 * Gets or sets whether Test.error() will show an alert().
 * @type {boolean}
 */
TestCollection.Alerts = true;
/**
 * Gets or sets whether the test system will catch the exceptions from running tests.
 * Useful to turn off when debugging.
 * @type {boolean}
 */
TestCollection.Catch = true;
/**
 * Gets the currently running Test, if any.
 * @type {Test}
 */
TestCollection.Current = null;
// variables holding test results:
TestCollection.StartTime = Date.now();
/**
 * Keep track of how many Tests have been run by runAll.
 * @type {number}
 */
TestCollection.TotalNumber = 0;
/**
 * Keep track of how many errors occurred during runAll.
 * @type {number}
 */
TestCollection.TotalErrors = 0;
/**
 * Keep track of how many warnings occurred during runAll.
 * @type {number}
 */
TestCollection.TotalWarnings = 0;
// Global variable:
/**
 * The root of the hierarchy of defined Tests.
 * @type {TestCollection}
 */
export var TestRoot = new TestCollection('TestRoot');
// Initialize the tree of tests
var myTreeDiagram;
export function initTree(divid, statusid) {
    if (statusid)
        TestCollection.StatusId = statusid;
    const $ = go.GraphObject.make;
    // this is the Diagram showing all of the tests
    myTreeDiagram = $(go.Diagram, divid ? divid : 'myTestTree', {
        isModelReadOnly: true,
        padding: new go.Margin(70, 10, 10, 10),
        initialContentAlignment: go.Spot.TopLeft,
        layout: $(go.TreeLayout, { nodeSpacing: 5, alignment: go.TreeLayout.AlignmentStart }),
    });
    // create Node template for each Test or TestCollection
    myTreeDiagram.nodeTemplateMap.add('TestCollection', $(go.Node, go.Panel.Horizontal, $(go.TextBlock, new go.Binding('text', '', go.Binding.toString), {
        click: function (e, obj) {
            const node = obj.part;
            const data = node.data;
            if (data instanceof Test) {
                TestCollection.Queue.add(data);
                TestCollection.TotalNumber = TestCollection.Queue.length;
                TestCollection.run();
            }
            else if (data instanceof TestCollection) {
                data.queue();
                TestCollection.TotalNumber = TestCollection.Queue.length;
                TestCollection.run();
            }
        },
    }), $('TreeExpanderButton')));
    myTreeDiagram.nodeTemplateMap.add('', // Tests don't have any tree children
    $(go.Node, go.Panel.Horizontal, $(go.TextBlock, new go.Binding('text', '', go.Binding.toString), {
        click: function (e, obj) {
            const node = obj.part;
            const data = node.data;
            if (data instanceof Test) {
                TestCollection.Queue.add(data);
                TestCollection.TotalNumber = TestCollection.Queue.length;
                TestCollection.run();
            }
            else if (data instanceof TestCollection) {
                data.queue();
                TestCollection.TotalNumber = TestCollection.Queue.length;
                TestCollection.run();
            }
        },
    })));
    // define very simple Link template
    myTreeDiagram.linkTemplate = $(go.Link, { selectable: false }, $(go.Shape, { isPanelMain: true }));
    // setup model data
    const nodedata = [];
    const linkdata = [];
    walkTests(TestRoot, nodedata, linkdata);
    myTreeDiagram.model = new go.GraphLinksModel(nodedata, linkdata);
    return myTreeDiagram;
}
function walkTests(tc /*TestCollection*/, nodes, links) {
    if (!tc)
        return;
    tc.category = 'TestCollection';
    nodes.push(tc);
    tc.key = nodes.length;
    let it = tc.tests.iterator;
    while (it.next()) {
        const t = it.value;
        nodes.push(t);
        t.key = nodes.length;
        links.push({ from: tc.key, to: t.key });
    }
    it = tc.collections.iterator;
    while (it.next()) {
        const c = it.value;
        walkTests(c, nodes, links);
        links.push({ from: tc.key, to: c.key });
    }
}
function collapseTree(levels) {
    const before = Date.now();
    myTreeDiagram.startTransaction('collapsing tree');
    if (levels === undefined)
        levels = 3;
    const root = myTreeDiagram.findNodeForData(TestRoot);
    if (root)
        root.collapseTree(levels);
    const after = Date.now();
    const duration = after - before;
    myTreeDiagram.commitTransaction('collapsed tree');
    TestCollection.setStatus('collapsed tree in ' + (duration / 1000).toString() + ' seconds');
}
function expandTree() {
    myTreeDiagram.startTransaction('expanding tree');
    const root = myTreeDiagram.findNodeForData(TestRoot);
    if (root)
        root.expandTree(4);
    myTreeDiagram.commitTransaction('expanded tree');
}
