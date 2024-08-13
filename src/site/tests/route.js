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
(function() {

/* Tests of getNearestIntersectionPoint functions */

var IN = 0;
var BY = 1;
var INTER = 2;

var nearestinter = new TestCollection("Nearest Intersection");
var containspoint = new TestCollection("Contains Point");
var isclosed = new TestCollection("Closing Figures");
var containment = new TestCollection("Containment");
var containmentrot = new TestCollection("Rotated");
containment.add(containmentrot);
var linkpoint = new TestCollection("getLinkPoint");
var findobjects = new TestCollection("Find Objects");
var objectsin = new TestCollection("Objects In");
var objectsnear = new TestCollection("Objects Near");
findobjects.add(objectsin);
findobjects.add(objectsnear);
var misc = new TestCollection("Misc.");

var geometric = new TestCollection("Geometric");
geometric.add(nearestinter);
geometric.add(containspoint);
geometric.add(isclosed);
geometric.add(containment);
geometric.add(linkpoint);
geometric.add(findobjects);
geometric.add(misc);

TestRoot.add(geometric);

var geom = new go.Geometry(go.Geometry.Rectangle);
geom.startX = 0;
geom.startY = 0;
geom.endX = 20;
geom.endY = 20;

var hline = new go.Geometry(go.Geometry.Line);
hline.startX = 0;
hline.startY = 0;
hline.endX = 20;
hline.endY = 0;

var vline = new go.Geometry(go.Geometry.Line);
vline.startX = 0;
vline.startY = 0;
vline.endX = 0;
vline.endY = 20;

var ellipse = new go.Geometry(go.Geometry.Ellipse);
ellipse.startX = -20;
ellipse.startY = -20;
ellipse.endX = 20;
ellipse.endY = 20;

var rectshape = new go.Shape();
rectshape.geometry = geom;

var ellshape = new go.Shape();
ellshape.geometry = go.Geometry.parse("M 0,0 L 30,0 L 30,10 L 10,10 L 10,30 L 0,30 Z", false);

var openbezier = go.Geometry.parse("M 0,10 Q -15,0 0,-10", false);
var openbezier2 = go.Geometry.parse("M 15,20 Q 0,10 15,0", false);

var openbezierfilled = new go.Shape();
openbezierfilled.geometry = go.Geometry.parse("M 15,20 Q 0,10 15,0", false);
openbezierfilled.fill = "Green";

var openpath = go.Geometry.parse("M 0,10 L 10,10 L 10,-10 L 0,-10", false);
var closedpath = go.Geometry.parse("M 0,10 L 10,10 L 10,0 L 0,0 Z", false);
var cbezier = go.Geometry.parse("M 20,0 C 0,0 0,20 20,20", false);

var shape = new go.Shape();
shape.geometry = go.Geometry.parse("M 0,0 L 0,20 L 20,20 L 20,0 Z", false);

var trshape = new go.Shape();
trshape.geometry = go.Geometry.parse("M -10,-10 L -10,10 L 10,10 L 10,-10 Z", false);

var pnl = new go.Panel();
pnl.background = "Green";
pnl.add(shape);

//var prnt = new go.Panel();
//prnt.add(ellshape);
//prnt.add(shape);

var originrect = new go.Shape();
var geo = new go.Geometry(go.Geometry.Rectangle);
geo.startX = 0;
geo.startY = 0;
geo.endX = 20;
geo.endY = 20;
originrect.geometry = geo;

var emptyrect = new go.Shape();
geo = new go.Geometry(go.Geometry.Rectangle);
geo.startX = 0;
geo.startY = 0;
geo.endX = 20;
geo.endY = 20;
emptyrect.geometry = geo;
emptyrect.fill = null;

var emptyell = new go.Shape();
geo = new go.Geometry(go.Geometry.Ellipse);
geo.startX = 0;
geo.startY = 0;
geo.endX = 20;
geo.endY = 20;
emptyell.geometry = geo;
emptyell.fill = null;

var emptypath = new go.Shape();
emptypath.geometry = go.Geometry.parse("M 0,0 L 0,20 L 20,20 L 20,0 Z");
emptypath.fill = null;

var filledrect = new go.Shape();
filledrect.geometry = emptyrect.geometry;
filledrect.fill = "Lime";

var filledell = new go.Shape();
filledell.geometry = emptyell.geometry;
filledell.fill = "Lime";

var filledpath = new go.Shape();
var geo = emptypath.geometry.copy();
filledpath.fill = "Lime";
geo.figures.elt(0).isFilled = true;
filledpath.geometry = geo;

var dline = new go.Geometry(go.Geometry.Line);
dline.startX = 0;
dline.startY = 0;
dline.endX = 20;
dline.endY = 10;

var thickellipse = new go.Shape();
thickellipse.geometry = ellipse;
thickellipse.stroke = "Green";
thickellipse.strokeWidth = 30;

var temprect = new go.Geometry(go.Geometry.Rectangle);
temprect.startX = -20;
temprect.startY = -20;
temprect.endX = 20;
temprect.endY = 20;

var thickrect = new go.Shape();
thickrect.geometry = temprect;
thickrect.stroke = "Yellow";
thickrect.strokeWidth = 30;

var thickpath = new go.Shape();
thickpath.geometry = go.Geometry.parse("M -20,-20 L 20,-20 L 20,20 L -20,20 Z");
thickpath.fill = "Yellow"
thickpath.stroke = "Green";
thickpath.strokeWidth = 30;

var thickvline = new go.Shape();
var geo = new go.Geometry(go.Geometry.Line);
geo.startX = 0;
geo.startY = -20;
geo.endX = 0;
geo.endY = 20;
thickvline.geometry = geo;
thickvline.stroke = "Yellow";
thickvline.strokeWidth = 30;

var thickhline = new go.Shape();
geo = new go.Geometry(go.Geometry.Line);
geo.startX = -20;
geo.startY = 0;
geo.endX = 20;
geo.endY = 0;
thickhline.geometry = geo;
thickhline.stroke = "Yellow";
thickhline.strokeWidth = 30;

var squareblock = new go.TextBlock();
squareblock.stroke = "Orange";
squareblock.background = "Pink";
squareblock.desiredSize = new go.Size(20, 20)

var ellipseshape = new go.Shape();
geo = new go.Geometry(go.Geometry.Ellipse);
geo.startX = -10;
geo.startY = -10;
geo.endX = 10;
geo.endY = 10;
ellipseshape.geometry = geo;

var diagline = new go.Shape();
geo = new go.Geometry(go.Geometry.Line);
geo.startX = -10;
geo.startY = -10;
geo.endX = 10;
geo.endY = 10;
diagline.geometry = geo;

var diaglinerotated = new go.Shape();
diaglinerotated.geometry = diagline.geometry;
diaglinerotated.angle = 45;
diaglinerotated.stroke = "Red";

var zerorect = new go.Shape();
geo = new go.Geometry(go.Geometry.Rectangle);
geo.startX = 0;
geo.startY = 0;
geo.endX = 0;
geo.endY = 0;
zerorect.geometry = geo;

var zeroell = new go.Shape();
geo = new go.Geometry(go.Geometry.Ellipse);
geo.startX = 0;
geo.startY = 0;
geo.endX = 0;
geo.endY = 0;
zeroell.geometry = geo;

var zerowell = new go.Shape();
geo = new go.Geometry(go.Geometry.Ellipse);
geo.startX = 0;
geo.startY = -20;
geo.endX = 0;
geo.endY = 20;
zerowell.geometry = geo;

var zerohell = new go.Shape();
geo = new go.Geometry(go.Geometry.Ellipse);
geo.startX = -20;
geo.startY = 0;
geo.endX = 20;
geo.endY = 0;
zerohell.geometry = geo;

var zeropath = new go.Shape();
zeropath.geometry = go.Geometry.parse("M 0,0 Z");

var multifigs = go.Geometry.parse("M 0,0 L 0,10 L 10,10 L 10,40 L 20,40 L 20,10 L 30,10 L 30,0 M 0,20 L 30,20 L 30,30 L 0,30 Z", false);
var retracing = go.Geometry.parse("M 10,0 L 20,0 L 20,20 L 10,20 L 10,10 L 0,10 L 10,10 Z", false);
var degen = go.Geometry.parse("M 0,0 L 0,10 L 0,10 L 0,20 L 20,10 Z", false);
var concave = go.Geometry.parse("M 0,0 L 0,20 L 10,10 L 20,20 L 20,0 Z", false);
var pentagram = go.Geometry.parse("M 0,0 L 10,20 L 20,0 L 0,20 L 20,20 Z", false);
var nested = go.Geometry.parse("M 0,0 L 0,25 L 45,25 L 45,0 Z M 5,5 L 5,20 L 20,20 L 20,5 Z M 25,5 L 40,5 L 40,20 L 25,20 Z", false);
var ushape = go.Geometry.parse("M 0,0 L 0,20 L 5,20 L 5,5 L 15,5 L 15,20 L 20,20 L 20,0 Z", false);
var opentri = go.Geometry.parse("M 0,0 L 20,20 L 40,0", false);
var singQ = go.Geometry.parse("M 0,0 Q 10,20 20,0 Z", false);
var singQShape = new go.Shape();
var geo = singQ.copy();
var fig = geo.figures.elt(0);
fig.isFilled = true;
singQShape.geometry = geo;
singQShape.fill = "Orange";

var singC = go.Geometry.parse("M 0,0 C 0,20 20,20 20,0 Z");
var singCShape = new go.Shape();
geo = singC.copy();
var fig = geo.figures.elt(0);
fig.isFilled = true;
singCShape.geometry = geo;
singCShape.fill = "Orange";

var comppath = go.Geometry.parse("M 0,0 L 0,40 L 10,40 L 10,10 L 20,10 L 20,40 L 50,40 L 50,0 L 40,0 L 40,30 L 30,30 L 30,0 Z");
var comppathShape = new go.Shape();
geo = comppath.copy();
var fig = geo.figures.elt(0);
fig.isFilled = true;
comppathShape.geometry = geo;
comppathShape.fill = "Orange";

var tempbezier = go.Geometry.parse("M 0,0 Q 10,-20 20,0 L 20,20 C 20,30 0,30 0,20 Z");
var bezierShape = new go.Shape();
geo = tempbezier.copy();
var fig = geo.figures.elt(0);
fig.isFilled = true;
bezierShape.geometry = geo;
bezierShape.fill = "Orange";

var ellipticalArc = go.Geometry.parse("M100 25 B0 270 50 25 50 25", false);




// beginning of tests
//NearestIntersection tests
test1("Horizontal line", hline, new go.Point(-100, -100), new go.Point(10, 10), new go.Point(0, 0));
test1("Vertical line", vline, new go.Point(-100, -100), new go.Point(10, 10), new go.Point(0, 0));
test1("Vertical Line 2", vline, new go.Point(-100, 5), new go.Point(10, 5), new go.Point(0, 5));
test1("Oblique + rectangle", geom, new go.Point(-100, -100), new go.Point(10, 10), new go.Point(0, 0));
test1("Axial + rectangle", geom, new go.Point(-100, 5), new go.Point(10, 5), new go.Point(0, 5));
test1("Ellipse", ellipse, new go.Point(-100, -100), new go.Point(0, 0), new go.Point(-20 * Math.SQRT1_2, -20 * Math.SQRT1_2));
test1("Open bezier (- coords)", openbezier, new go.Point(-100, 0), new go.Point(100, 0), new go.Point(-7.5, 0));
test1("Open bezier (empty)", openbezier2, new go.Point(-100, 10), new go.Point(100, 10), new go.Point(7.5, 10));
test1("Open bezier (empty) other dir.", openbezier2, new go.Point(99, 10), new go.Point(-99, 10), new go.Point(7.5, 10));
test1("Open bezier (filled)", openbezierfilled, new go.Point(99, 10), new go.Point(-99, 10), new go.Point(7.5, 10));
test1("Cubic bezier", cbezier, new go.Point(-100, 10), new go.Point(100, 10), new go.Point(5, 10));
test1("Open path", openpath, new go.Point(-100, 0), new go.Point(100, 0), new go.Point(10, 0));
test1("closed path", closedpath, new go.Point(-99, 5), new go.Point(99, 5), new go.Point(0, 5));
test1("Shape", shape, new go.Point(-100, 5), new go.Point(10, 5), new go.Point(0, 5));
//test1("Panel (axial)", pnl, new go.Point(-100, 5), new go.Point(10, 5), new go.Point(0, 5));
//test1("Panel (oblique)", pnl, new go.Point(-99,-99), new go.Point(99,99), new go.Point(0, 0));
//test1("Panel has children", prnt, new go.Point(100, 15), new go.Point(-100, 15), new go.Point(20, 15));
test1("Vertical stack", [ellshape, ellshape], new go.Point(-99, 40), new go.Point(99, 40), new go.Point(0, 40));
test1("Multiple figures", multifigs, new go.Point(-99, 25), new go.Point(99, 25), new go.Point(0, 25));
test1("rotation 1", trshape, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(10, 0), undefined, 45);
test1("rotation 2", trshape, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-10, 0), undefined, 45);
test1("Rotated rectangle (1)", originrect, new go.Point(-99, 10), new go.Point(99, 10), new go.Point(0, 10), undefined, 45);
test1("Rotated rectangle (2)", originrect, new go.Point(99, 10), new go.Point(-99, 10), new go.Point(20, 10), undefined, 45);
test1("Scaled up 1", trshape, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(10, 0), 2.5);
test1("Scaled up 2", trshape, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-10, 0), 2.5);
test1("scaled rectangle (1)", originrect, new go.Point(-99, 10), new go.Point(99, 10), new go.Point(0, 10), 2.5);
test1("scaled rectangle (2)", originrect, new go.Point(99, 10), new go.Point(-99, 10), new go.Point(20, 10), 2.5);
test1("Thick Ellipse 1", thickellipse, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-35, 0));
test1("Thick Ellipse 2", thickellipse, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(35, 0));
test1("Thick Rectangle 1", thickrect, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-35, 0));
test1("Thick Rectangle 2", thickrect, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(35, 0));
test1("Thick Path 1", thickpath, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-35, 0));
test1("Thick Path 2", thickpath, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(35, 0));
test1("Thick Horizontal line 1", thickhline, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-20, 0));
test1("Thick Horizontal line 2", thickhline, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(20, 0));
test1("Thick vertical line 1", thickvline, new go.Point(-99, 0), new go.Point(99, 0), new go.Point(-15, 0));
test1("Thick vertical line 2", thickvline, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(15, 0));
test1("Elliptical arc", ellipticalArc, new go.Point(99, 0), new go.Point(-99, 0), new go.Point(50.5, 0));


//ContainsPoint tests
test2("Rectangle", geom, true, true, 20, 20, 20, 0, 0, 20, 0, 0, 0, 10, 10, 0, 10, 20, 20, 10, .3, 10, -.3, 10, 10, .3, 10, -.3, 10, 10);
test2("Rectangle", geom, true, false, -5, -5, 25, 25, 10, -5, 10, 25, -5, 10, 25, 10);
test2("Rectangle", geom, false, true, 20, 20, 20, 0, 0, 20, 0, 0, 0, 10, 10, 0, 10, 20, 20, 10, .3, 10, -.3, 10, 10, .3, 10, -.3);
test2("Rectangle", geom, false, false, 5, 5, 5, 10, 5, 15, 10, 5, 10, 10, 10, 15, 15, 5, 15, 10, 15, 15);
test2("Ellipse", ellipse, true, true, 0, 0, 0, 20, 0, -20, -20, 0, 20, 0, 20 * Math.SQRT1_2, 20 * Math.SQRT1_2, 20 * Math.SQRT1_2, -20 * Math.SQRT1_2, -20 * Math.SQRT1_2, 20 * Math.SQRT1_2, -20 * Math.SQRT1_2, -20 * Math.SQRT1_2);
test2("Ellipse", ellipse, true, false, 20, 20, 20, -20, -20, -20, -20, 20);
test2("Ellipse", ellipse, false, true, 20, 0, -20, 0, 0, 20, 0, -20, 20 * Math.SQRT1_2, 20 * Math.SQRT1_2, 20 * Math.SQRT1_2, -20 * Math.SQRT1_2, -20 * Math.SQRT1_2, 20 * Math.SQRT1_2, -20 * Math.SQRT1_2, -20 * Math.SQRT1_2);
test2("Ellipse", ellipse, false, false, 20, 20, 20, -20, -20, -20, -20, 20, 0, 0, 10, 0, -10, 0, 0, 10, 0, -10);
test2("Diag. line", dline, true, true, 0, 0, 10, 5, 20, 10);
test2("Diag. line", dline, true, false, -10, -5, 30, 15);
test2("Diag. line", dline, false, true, 0, 0, 10, 5, 20, 10);
test2("Diag. line", dline, false, false, -10, -5, 30, 15);
test2("Horizontal line", hline, true, true, 0, 0, 10, 0, 20, 0);
test2("Horizontal line", hline, true, false, -5, 0, 10, 5, 10, -5, 25, 0);
test2("Horizontal line", hline, false, true, 0, 0, 10, 0, 20, 0);
test2("Horizontal line", hline, false, false, -5, 0, 10, 5, 10, -5, 25, 0);
test2("Retracing path", retracing, true, true, 0, 10, 5, 10, 10, 10, 15, 10, 20, 10);
test2("Retracing path", retracing, true, false, -10, 10, 25, 10);
test2("Retracing path", retracing, false, true, 0, 10, 10, 10, 10, 0, 20, 0, 20, 20, 10, 20);
test2("Retracing path", retracing, false, false, 15, 10, 0, 0, 0, 20);
test2("Degenerate line seg.", degen, true, true, 0, 10, 10, 10, 20, 10);
test2("Degenerate line seg.", degen, true, false, -10, 10, 30, 10);
test2("Tangent on the inside", concave, true, true, 0, 10, 5, 10, 10, 10, 15, 10, 20, 10, 5, 5);
test2("Tangent on the inside", concave, true, false, -5, 10, 25, 10, 10, 15);
test2("Multiple figures", nested, true, true, 5, 15, 10, 15, 15, 15, 20, 15, 10, 24);
test2("Multiple figures", nested, true, false, -5, 15, 50, 15, 20, 30, 20, -5);
test2("Winding rule", pentagram, true, true, 10, 15, 10, 20, 10, 10);
test2("Winding rule", pentagram, true, false, 0, 10, 20, 10);
test2("Thick Ellipse", thickellipse, false, true, -20, 0, 20, 0, 0, 20, 0, -20, -26, 0, 26, 0, 0, 26, 0, -26, 14, 0, -14, 0, 0, 14, 0, -14);
test2("Thick Rectangle", thickrect, false, true, -20, 0, 20, 0, 0, 20, 0, -20, -26, 0, 26, 0, 0, 26, 0, -26, 14, 0, -14, 0, 0, 14, 0, -14);
test2("Thick Path", thickpath, false, true, -20, 0, 20, 0, 0, 20, 0, -20, -26, 0, 26, 0, 0, 26, 0, -26, 14, 0, -14, 0, 0, 14, 0, -14);
test2("Thick Horizontal line", thickhline, false, true, 0, 6, 0, -6, 0, 0, 20, 0, 20, 6, 20, -6, -20, 0, -20, 6, -20, -6);
test2("Thick vertical line", thickvline, false, true, 0, 0, 6, 0, -6, 0, 0, -20, 6, -20, -6, -20, 0, 20, 6, 20, -6, 20);
test2("Thick Ellipse", thickellipse, false, false, 0, 0, 39, 0, -39, 0, 0, 39, 0, -39);
test2("Thick Rectangle", thickrect, false, false, 0, 0, 39, 0, -39, 0, 0, 39, 0, -39);
test2("Thick Path", thickpath, false, false, 0, 0, 39, 0, -39, 0, 0, 39, 0, -39);
test2("Thick Horizontal line", thickhline, false, false, -25, 0, 25, 0, 0, 19, 0, -19);
test2("Thick vertical line", thickvline, false, false, 0, -25, 0, 25, 19, 0, -19, 0);
test2("Thick Path", thickpath, true, true, -25,0);
test2("Thin line", hline, false, true, 0, 1.5, 10, 1.5, 20, 1.5);
test2("Thin line", hline, false, false, 0, 3, 10, 3, 20, 3);
test2("Open Quadratic Bezier", openbezier, false, false, -1.5, 0);
test2("Open triangle", opentri, false, false, 20, 10);
test2("Single Q Bezier", singQShape, true, true, 10,7,10,3,10,9);
test2("Single Q Bezier", singQShape, true, false, 19, 7);
test2("Single C Bezier", singCShape, true, true, 7, 7, 7, 10, 7, 3, 7, 0);
test2("Single C Bezier", singCShape, true, false, 2, 18, 18, 18, 18, 11);
test2("comppath", comppathShape, true, true, 5, 20, 25, 20, 45, 20);
test2("comppath", comppathShape, true, false, 15, 20, 35, 20);
test2("Open Path", openpath, true, true, 5, 0);
test2("Open Path", openpath, false, false, 5, 0);
test2("Elliptical arc", ellipticalArc, true, true, 50, 25);
test2("Elliptical arc", ellipticalArc, false, false, 50, 25);

// rectangle containment tests
testcont("Text Block", squareblock, true, IN, 1, 0, 0, 0, 20, 20, 3, 3, 14, 14, 5, 5, 2, 2);
testcont("Text Block", squareblock, false, IN, 1, 0, -3, -3, 26, 26, -3, -3, 20, 20, 3, 3, 20, 20);
testcont("Text Block", squareblock, true, BY, 1, 0, -3, -3, 26, 26);
testcont("Text Block", squareblock, false, BY, 1, 0, -3, -3, 20, 20, 3, 3, 20, 20, 3, 3, 14, 14);
testcont("Text Block", squareblock, true, INTER, 1, 0, 20, 20, 10, 10, 18, 18, 10, 10, 0, 0, 0, 0, -10, -10, 10, 10, -10, -10, 12, 12, 0, 0, 20, 20, 3, 3, 14, 14, -3, 13, 26, 26);
testcont("Text Block", squareblock, false, INTER, 1, 0, -10, -10, 7, 7, 23, 23, 10, 10, NaN, NaN, NaN, NaN);
testcont("Text Block (scaled up)", squareblock, true, IN, 2.5, 0, 0, 0, 20, 20, 3, 3, 14, 14, 5, 5, 2, 2);
testcont("Text Block (scaled up)", squareblock, false, IN, 2.5, 0, -3, -3, 26, 26, -3, -3, 20, 20, 3, 3, 20, 20);
testcont("Text Block (scaled up)", squareblock, true, BY, 2.5, 0, -3, -3, 26, 26);
testcont("Text Block (scaled up)", squareblock, false, BY, 2.5, 0, -3, -3, 20, 20, 3, 3, 20, 20, 3, 3, 14, 14);
testcont("Text Block (scaled up)", squareblock, true, INTER, 2.5, 0, 20, 20, 10, 10, 18, 18, 10, 10, 0, 0, 0, 0, -10, -10, 10, 10, -10, -10, 12, 12, 0, 0, 20, 20, 3, 3, 14, 14, -3, 13, 26, 26);
testcont("Text Block (scaled up)", squareblock, false, INTER, 2.5, 0, -10, -10, 7, 7, 23, 23, 10, 10, NaN, NaN, NaN, NaN);
testcont("Text Block (scaled down)", squareblock, true, IN, .6, 0, 0, 0, 20, 20, 3, 3, 14, 14, 5, 5, 2, 2);
testcont("Text Block (scaled down)", squareblock, false, IN, .6, 0, -3, -3, 26, 26, -3, -3, 20, 20, 3, 3, 20, 20);
testcont("Text Block (scaled down)", squareblock, true, BY, .6, 0, -3, -3, 26, 26);
testcont("Text Block (scaled down)", squareblock, false, BY, .6, 0, -3, -3, 20, 20, 3, 3, 20, 20, 3, 3, 14, 14);
testcont("Text Block (scaled down)", squareblock, true, INTER, .6, 0, 20, 20, 10, 10, 18, 18, 10, 10, 0, 0, 0, 0, -10, -10, 10, 10, -10, -10, 12, 12, 0, 0, 20, 20, 3, 3, 14, 14, -3, 13, 26, 26);
testcont("Text Block (scaled down)", squareblock, false, INTER, .6, 0, -10, -10, 7, 7, 23, 23, 10, 10, NaN, NaN, NaN, NaN);
testcont("Text Block", squareblock, true, IN, 1, 45, 8, 8, 12, 12);
testcont("Text Block", squareblock, false, IN, 1, 45, 5.5, 5.5, 17, 17);
testcont("Text Block", squareblock, true, BY, 1, 45, -2, -2, 33, 33);
testcont("Text Block", squareblock, false, BY, 1, 45, 5.5, 5.5, 17, 17);
testcont("Text Block", squareblock, true, INTER, 1, 45, 5.5, 5.5, 17, 17);
testcont("Text Block", squareblock, false, INTER, 1, 45, 1, 1, 3, 3);
testcont("U shape", ushape, true, INTER, 1, 0, -5, -5, 30, 30, 8, -5, 4, 15, -5, 10, 30, 5);

// new thickness rules dont allow
// testcont("U shape", ushape, false, INTER, 1, 0, 8, 8, 4, 12);
testcont("U shape", ushape, false, INTER, 1, 0, 10, 10, .1, 12);

testcont("U shape", ushape, true, INTER, 2.5, 0, -5, -5, 30, 30, 8, -5, 4, 15, -5, 10, 30, 5);
testcont("U shape", ushape, false, INTER, 2.5, 0, 8, 8, 4, 12);
testcont("U shape", ushape, false, INTER, 1, 45, 14.14, 5.657, 1, 1);
//testcont("U shape", ushape, false, INTER, 1, 45, 15.5, 12.5, .5, .5);
testcont("U shape", ushape, true, BY, 1, 0, -5, -5, 30, 30);
testcont("U shape", ushape, false, BY, 1, 0, 5, 5, 20, 20);
testcont("U shape", ushape, true, BY, 2.5, 0, -5, -5, 50, 50);
testcont("U shape", ushape, false, BY, 2.5, 0, 5, 5, 40, 40);
testcont("U shape", ushape, true, BY, 1, 45, -5, -5, 38, 38);
testcont("U shape", ushape, false, BY, 1, 45, -5, -5, 30, 30);
testcont("Case that fails in FindObjects", originrect, true, INTER, 1, 0, -5, -5, 30, 10);
testcont("Shape contained by rect", ushape, true, INTER, 1, 0, -5, -5, 30, 30);

/* ***** invalid: shape class needs it's own rectangle functions *
testcont("Rectangle (Rotated)", trshape, true, IN, 1, 45, 15.5,15.5,6,6);
testcont("Rectangle (Rotated)", trshape, false, IN, 1, 45, 5.5, 5.5, 17, 17);
testcont("Rectangle (Rotated)", trshape, true, BY, 1, 45, -2, -2, 33, 33);
testcont("Rectangle (Rotated)", trshape, false, BY, 1, 45, 5.5, 5.5, 17, 17);
testcont("Rectangle (Rotated)", trshape, true, INTER, 1, 45, 5.5, 5.5, 17, 17);
testcont("Rectangle (Rotated)", trshape, false, INTER, 1, 45, 1, 1, 3, 3);
/**/

// test getLinkPoint
testlink("Rectangle", trshape, 100, 0, -10, 0, 1, 0);
testlink("Rectangle", trshape, 100, 100, -10, -10, 1, 0);
testlink("Rectangle", trshape, -100, 100, 10, -10, 1, 0);
testlink("Rectangle (scaled up)", trshape, 100, 0, -10, 0, 2.5, 0);
testlink("Rectangle (scaled up)", trshape, 100, 100, -10, -10, 2.5, 0);
testlink("Rectangle (scaled up)", trshape, -100, 100, 10, -10, 2.5, 0);
// rotated + ab
// testlink("Rectangle (Rotated)", trshape, 100, 0, -10, 0, 1, 30, true);
// testlink("Rectangle (Rotated)", trshape, 100, 100, -10, -10, 1, 30, true);
// testlink("Rectangle (Rotated)", trshape, -100, 100, 10, -10, 1, 30, true);
// testlink("Rectangle (Rotated pi/4)", trshape, 100, 0, -10, 0, 1, 45, true);
// testlink("Rectangle (Rotated pi/4)", trshape, 100, 100, -10, -10, 1, 45, true);
// testlink("Rectangle (Rotated pi/4)", trshape, -100, 100, 10, -10, 1, 45, true);
// rotated, no ab
testlink("Rectangle (Rotated)", trshape, 100, 0, -10, 0, 1, 30);
testlink("Rectangle (Rotated)", trshape, 100, 100, -10, -10, 1, 30); // ???
testlink("Rectangle (Rotated)", trshape, -100, 100, 10, -10, 1, 30);
testlink("Rectangle (Rotated pi/4)", trshape, 100, 0, -10, 0, 1, 45);
testlink("Rectangle (Rotated pi/4)", trshape, 100, 100, -10, -10, 1, 45);
testlink("Rectangle (Rotated pi/4)", trshape, -100, 100, 10, -10, 1, 45);

linkpoint.add(new Test("invisible port", null,
  function(test) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Vertical",
        $(go.Panel, "Auto",
          { visible: false },
          $(go.Shape, "Triangle", { fill: "white", portId: "" }),
          $(go.TextBlock, new go.Binding("text", "key"))
        ),
        $(go.TextBlock, new go.Binding("text", "key"))
      );

    diagram.model = new go.GraphLinksModel(
        [{ key: 1 }, { key: 2 }],
        [{ from: 1, to: 2 }]
      );
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(link instanceof go.Link, "should have one link in diagram");
    test.assert(link.points.count === 2, "there should be a route -- even though the port's Panel is not visible")
  },
  function(test) {
  }
));

linkpoint.add(new Test("inside group", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { locationSpot: go.Spot.Center, desiredSize: new go.Size(30, 20) },
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Shape, { fill: "white" }),
        $(go.TextBlock, new go.Binding("text", "key"))
      );
    diag.groupTemplate =
      $(go.Group,
        new go.Binding("position", "loc", go.Point.parse),
        $(go.Shape, "RoundedRectangle",
          { parameter1: 30, fill: "lightgray", portId: "" },
          new go.Binding("desiredSize", "size", go.Size.parse))
      );
    diag.model = new go.GraphLinksModel(
      [
        { key: 10, isGroup: true, loc: "0 0", size: "300 400" },
        { key: 1, loc: "100 100" },
        { key: 2, loc: "200 100" }
      ],
      [
        { from: 1, to: 10 },
        { from: 10, to: 2 }
      ]
    );
  },
  function(test) {
    var diag = test.diagram;
    test.assertAllLinkPoints([
      [new go.Point(95.0,90.0), new go.Point(49.8,0.1)],
      [new go.Point(249.2,0.1), new go.Point(204.9,90.0)]
    ]);
  }
));

// test findObjectsNear/In
testfind("Three rectangular objects (1)", [trshape, originrect, shape], go.Panel.Vertical, true, NaN, new go.Rect(-5, 15, 30, 10), trshape, originrect);
testfind("Three rectangular objects (2)", [originrect, trshape, shape], go.Panel.Vertical, true, NaN, new go.Rect(-5, 15, 30, 10), trshape, originrect);
testfind("Three rectangular objects (3)", [trshape, shape, originrect], go.Panel.Vertical, true, NaN, new go.Rect(-5, 15, 30, 10), trshape, shape);
testfind("Three rectangular objects (4)", [shape, trshape, originrect], go.Panel.Vertical, true, NaN, new go.Rect(-5, 15, 30, 10), trshape, shape);
testfind("Ellipse", [shape, ellipseshape, squareblock, trshape], go.Panel.Vertical, true, NaN, new go.Rect(-5, 15, 7, 7), shape);
testfind("Diag line", [shape, diagline, squareblock, trshape], go.Panel.Vertical, true, NaN, new go.Rect(15, 15, 10, 10), shape);
testfind("Rotated diagonal line", [diaglinerotated, ellipseshape], go.Panel.Horizontal, true, NaN, new go.Rect(-5, -5, 10, 10));
testfind("Zero size rect (T)", [zerorect], go.Panel.Vertical, true, NaN, new go.Rect(-5, -5, 15, 15), zerorect);
testfind("Zero size rect (F)", [zerorect], go.Panel.Vertical, true, NaN, new go.Rect(5, 5, 15, 15));
testfind("Thick Rect", [thickrect], go.Panel.Vertical, true, NaN, new go.Rect(45, 45, 10, 10), thickrect);
// non-partial
testfind("Three rectangular objects (1)", [squareblock, originrect, shape], go.Panel.Vertical, false, NaN, new go.Rect(-5, 15, 30, 10));
testfind("Three rectangular objects (2)", [originrect, squareblock, shape], go.Panel.Vertical, false, NaN, new go.Rect(-5, 15, 30, 10));
testfind("Three rectangular objects (3)", [squareblock, shape, originrect], go.Panel.Vertical, false, NaN, new go.Rect(-5, 15, 30, 10));
testfind("Three rectangular objects (4)", [shape, squareblock, originrect], go.Panel.Vertical, false, NaN, new go.Rect(-5, 15, 30, 10));
testfind("Ellipse", [shape, ellipseshape, squareblock, trshape], go.Panel.Vertical, false, NaN, new go.Rect(-5, 15, 7, 7));
testfind("Diag line", [shape, diagline, squareblock, trshape], go.Panel.Vertical, false, NaN, new go.Rect(15, 15, 10, 10));
testfind("Rotated diagonal line", [diaglinerotated, ellipseshape], go.Panel.Horizontal, false, NaN, new go.Rect(-5, -5, 10, 10));
testfind("Two rectangular objects", [trshape, originrect], go.Panel.Horizontal, false, NaN, new go.Rect(-5, -5, 30, 30), trshape);
testfind("Rectangular and Circular (1)", [ellipseshape, originrect], go.Panel.Horizontal, false, NaN, new go.Rect(-5, -5, 30, 30), ellipseshape);
testfind("Rectangular and Circular (2)", [originrect, ellipseshape], go.Panel.Horizontal, false, NaN, new go.Rect(-5, -5, 30, 30), originrect);
testfind("Rectangular and Circular (3)", [ellipseshape, originrect], go.Panel.Horizontal, false, NaN, new go.Rect(15, -5, 30, 30), originrect);
testfind("Rectangular and Circular (4)", [originrect, ellipseshape], go.Panel.Horizontal, false, NaN, new go.Rect(15, -5, 30, 30), ellipseshape);
testfind("Thick Rect", [thickrect], go.Panel.Vertical, false, NaN, new go.Rect(-5, -5, 50, 50));
// findObjectsNear

testfind("Three rectangular objects (A)", [trshape, originrect, shape], go.Panel.Horizontal, true, 20, new go.Point(10, 10), trshape, originrect);
testfind("Three rectangular objects (B)", [trshape, originrect, shape], go.Panel.Horizontal, true, 20, new go.Point(50, 10), shape, originrect);
testfind("Three rectangular objects (C)", [rectshape, originrect, shape], go.Panel.Horizontal, true, 20, new go.Point(50, 10), shape, originrect);
testfind("Three rectangular objects (D)", [squareblock, originrect, shape], go.Panel.Horizontal, true, 20, new go.Point(50, 10), shape, originrect);
testfind("Diag line (A)(1)", [squareblock, diagline], go.Panel.Horizontal, true, 8, new go.Point(22, 18), squareblock); // dist too small
testfind("Diag line (B)(1)", [squareblock, diagline], go.Panel.Horizontal, true, 8, new go.Point(38, 2));
testfind("Diag line (A)(2)", [squareblock, diagline], go.Panel.Horizontal, true, 15, new go.Point(22, 18), squareblock, diagline); // dist big enough
testfind("Diag line (B)(2)", [squareblock, diagline], go.Panel.Horizontal, true, 15, new go.Point(38, 2), diagline);
testfind("Ellipse", [ellipseshape, diagline], go.Panel.Vertical, true, 3, new go.Point(-1, -1));
testfind("Ellipse", [ellipseshape, diagline], go.Panel.Vertical, true, 10, new go.Point(-1, -1), ellipseshape);
testfind("Zero rect (T)", [zerorect], go.Panel.Vertical, true, 10, new go.Point(5, 5), zerorect);
testfind("Zero rect (F)", [zerorect], go.Panel.Vertical, true, 10, new go.Point(15, 15));

//testfind("Zero path (T)", [zeropath], go.Panel.Vertical, true, 10, new go.Point(5, 5), zeropath); // ***** may be valid
testfind("Zero path (F)", [zeropath], go.Panel.Vertical, true, 10, new go.Point(15, 15));
testfind("Ellipse: w===0&&h===0 (T)", [zeroell], go.Panel.Vertical, true, 10, new go.Point(5, 5), zeroell);
testfind("Ellipse: w===0&&h===0 (F)", [zeroell], go.Panel.Vertical, true, 10, new go.Point(15, 15));
testfind("Ellipse: h===0 (T)", [zerohell], go.Panel.Vertical, true, 10, new go.Point(20, 5), zeroell);
testfind("Ellipse: h===0 (F)", [zerohell], go.Panel.Vertical, true, 10, new go.Point(20, 15));
testfind("Ellipse: w===0 (T)", [zerowell], go.Panel.Vertical, true, 10, new go.Point(5, 20), zeroell);
testfind("Ellipse: w===0 (F)", [zerowell], go.Panel.Vertical, true, 10, new go.Point(15, 20));
testfind("Thick Rect (a)", [thickrect], go.Panel.Vertical, true, 20, new go.Point(75, 75), thickrect);
testfind("Thick Rect (b)", [thickrect], go.Panel.Vertical, true, 10, new go.Point(20, 7), thickrect);
testfind("Thick Ellipse (a)", [thickellipse], go.Panel.Vertical, true, 10, new go.Point(40 + 35 * Math.SQRT1_2, 40 + 35 * Math.SQRT1_2), thickellipse);
testfind("Thick Ellipse (b)", [thickellipse], go.Panel.Vertical, true, 5, new go.Point(35 + 27 * Math.SQRT1_2, 35 + 27 * Math.SQRT1_2), thickellipse);
testfind("Thick Ellipse (c)", [thickellipse], go.Panel.Vertical, true, 5, new go.Point(35, 7), thickellipse);
testfind("Thick Path", [thickpath], go.Panel.Vertical, true, 10, new go.Point(35, 75), thickpath);
testfind("Thick H Line (a)", [thickhline], go.Panel.Vertical, true, 10, new go.Point(20, 35), thickhline);
testfind("Thick H Line (b)", [thickhline], go.Panel.Vertical, true, 5, new go.Point(20, 7), thickhline);
testfind("Thick H Line (c)", [thickhline], go.Panel.Vertical, true, 10, new go.Point(45, 15), thickhline);
testfind("Thick H Line (d)", [thickhline], go.Panel.Vertical, true, 10, new go.Point(75, 15));
testfind("Rect with no fill (t)", [emptyrect], go.Panel.Vertical, true, 15, new go.Point(10, 10), emptyrect);
testfind("Rect with no fill (f)", [emptyrect], go.Panel.Vertical, true, 5, new go.Point(10, 10));
testfind("Ellipse with no fill (t)", [emptyell], go.Panel.Vertical, true, 15, new go.Point(10, 10), emptyell);
testfind("Ellipse with no fill (f)", [emptyell], go.Panel.Vertical, true, 5, new go.Point(10, 10));
testfind("Path with no fill (t)", [emptypath], go.Panel.Vertical, true, 15, new go.Point(10, 10), emptypath);
testfind("Path with no fill (f)", [emptypath], go.Panel.Vertical, true, 5, new go.Point(10, 10));
testfind("Rect with fill (t)", [filledrect], go.Panel.Vertical, true, 15, new go.Point(10, 10), filledrect);
testfind("Rect with fill (f)", [filledrect], go.Panel.Vertical, true, 5, new go.Point(10, 10), filledrect);
testfind("Ellipse with fill (t)", [filledell], go.Panel.Vertical, true, 15, new go.Point(10, 10), filledell);
testfind("Ellipse with fill (f)", [filledell], go.Panel.Vertical, true, 5, new go.Point(10, 10), filledell);
testfind("Path with fill (t)", [filledpath], go.Panel.Vertical, true, 15, new go.Point(10, 10), filledpath);
testfind("Path with fill (f)", [filledpath], go.Panel.Vertical, true, 5, new go.Point(10, 10), filledpath);


// Misc. tests
misc.add(new Test("Bounds of ellipse when top left !== (0,0)", null,
    function(t) {
      displaynode(t,ellipse);
    }, null,
    function(t) {
      var n = t.diagram.findNodeForKey(1);
      var w = n.elt(0).geometry.bounds.width;
      var h = n.elt(0).geometry.bounds.height;

      t.assert(Math.abs(w - 40) < .5, "Width should be 40 but was " + w);
      t.assert(Math.abs(h - 40) < .5, "Height should be 40 but was " + h);
    }
    ));
misc.add(new Test("Bounds of bezier (-coords.) when top left !== (0,0)", null,
    function(t) {
      displaynode(t,openbezier);
    }, null,
    function(t) {
      var n = t.diagram.findNodeForKey(1);
      var w = n.elt(0).geometry.bounds.width;
      var h = n.elt(0).geometry.bounds.height;

      t.assert(Math.abs(w - 7.5) < .5, "Width should be 7.5 but was " + w);
      t.assert(Math.abs(h - 20) < .5, "Height should be 20 but was " + h);
    }
    ));
misc.add(new Test("Inverse Multiply Point", null, null, null,
    function(ts) {
      var p = new go.Point(15, 15);
      if (p.transform) {
        var t = new Transform(2, 4, 6, 8, 10, 12);
        var pt = p.copy().transform(t);
        var punt = t.invertedTransformPoint(pt);

        ts.assert(Math.abs(p.x - punt.x) < .2 && Math.abs(p.y - punt.y) < .2,
          "Original was " + p + ", after transforms was " + punt);
      } else {
        ts.assert(true);
      }
    }
    ));
misc.add(new Test("Actual bounds of rotated object", null,
    function(t) {
      displaynode(t,diaglinerotated);
    }, null,
    function(t) {
      var bounds = t.diagram.findNodeForKey(1).actualBounds;
      t.assert(bounds.width < 30, "Bounds was " + bounds);
    }
    ));

  misc.add(new Test('Zero radius arc', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      go.Shape.defineFigureGenerator("RoundedTopRectangle", function(shape, w, h) {
        // this figure takes one parameter, the size of the corner
        var p1 = 5;  // default corner size
        if (shape !== null) {
          var param1 = shape.parameter1;
          if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
        }
        p1 = Math.min(p1, w / 2);
        p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
        var geo = new go.Geometry();
        // a single figure consisting of straight lines and quarter-circle arcs
        geo.add(new go.PathFigure(0, p1)
                 .add(new go.PathSegment(go.PathSegment.Arc, 180, 90, p1, p1, p1, p1))
                 .add(new go.PathSegment(go.PathSegment.Line, w - p1, 0))
                 .add(new go.PathSegment(go.PathSegment.Arc, 270, 90, w - p1, p1, p1, p1))
                 .add(new go.PathSegment(go.PathSegment.Line, w, h))
                 .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
        // don't intersect with two top corners when used in an "Auto" Panel
        geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0.3 * p1);
        geo.spot2 = new go.Spot(1, 1, -0.3 * p1, 0);
        return geo;
      });

      go.Shape.defineFigureGenerator("RoundedBottomRectangle", function(shape, w, h) {
        // this figure takes one parameter, the size of the corner
        var p1 = 5;  // default corner size
        if (shape !== null) {
          var param1 = shape.parameter1;
          if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
        }
        p1 = Math.min(p1, w / 2);
        p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
        var geo = new go.Geometry();
        // a single figure consisting of straight lines and quarter-circle arcs
        geo.add(new go.PathFigure(0, 0)
                 .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                 .add(new go.PathSegment(go.PathSegment.Line, w, h - p1))
                 .add(new go.PathSegment(go.PathSegment.Arc, 0, 90, w - p1, h - p1, p1, p1))
                 .add(new go.PathSegment(go.PathSegment.Line, p1, h))
                 .add(new go.PathSegment(go.PathSegment.Arc, 90, 90, p1, h - p1, p1, p1).close()));
        // don't intersect with two bottom corners when used in an "Auto" Panel
        geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0);
        geo.spot2 = new go.Spot(1, 1, -0.3 * p1, -0.3 * p1);
        return geo;
      });

      diagram.nodeTemplate =
          $(go.Part, "Spot",
            {
              selectionAdorned: false,  // don't show the standard selection handle
              resizable: true, resizeObjectName: "SHAPE",  // user can resize the Shape
              rotatable: true, rotateObjectName: "SHAPE",  // user can rotate the Shape
                                                           // without rotating the label
            },
            $(go.Shape,
              {
                name: "SHAPE",
                fill: $(go.Brush, "Linear", { 0.0: "white", 1.0: "gray" }),
                desiredSize: new go.Size(100, 50)
              },
              new go.Binding("figure", "fig"),
              new go.Binding("parameter1", "p1"))
          );

      diagram.model = new go.Model([
        { fig: "RoundedTopRectangle", p1: 0 }
      ]);


    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var p = d.parts.first();
      // make sure its the correct size
      test.assert(p.actualBounds.width === 101);
      test.assert(p.actualBounds.height === 51);
  })); // end test

  misc.add(new Test('interescting the end of an arc', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      go.Shape.defineFigureGenerator("Ring2", function(shape, w, h) {
        var param1 = shape ? shape.parameter1 : NaN;
        if (isNaN(param1) || param1 < 0) param1 = 8;
        var rad = w / 2;
        var geo = new go.Geometry();
        var fig = new go.PathFigure(w, w / 2, true);  // clockwise
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, rad, rad, rad, rad));//.close());
        geo.spot1 = GeneratorEllipseSpot1;
        geo.spot2 = GeneratorEllipseSpot2;
        geo.defaultStretch = go.GraphObject.Uniform;
        return geo;
      });
      var gridSize = 25;
      d.nodeTemplate =
        $(go.Node, "Spot",
        new go.Binding("position"),
          $(go.Shape, "Ring2", {
                portId: "",
                fromLinkable: true,
                toLinkable: true,
                cursor: "crosshair",
                margin: new go.Margin(0, 2, 4, 0),
                minSize: new go.Size(gridSize * 2, gridSize * 2),
                maxSize: new go.Size(gridSize * 21, gridSize * 21),
                desiredSize: new go.Size(gridSize * 2, gridSize * 2),
                fill: 'red',
                strokeWidth: 2 +2 ,
                stroke: 'lime',
                background:"lightblue",
                name: "MARK"
            },
            new go.Binding("figure"))
        );


      d.model = new go.GraphLinksModel(
      [
        { key: "Alpha", position: new go.Point(0, 0), color: "lightblue" },
        { key: "Beta", figure: 'None', position: new go.Point(200, 0), color: "orange" }
      ],
      [
        { from: "Alpha", to: "Beta" }
      ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var l = d.links.first();
      var pt = l.points.elt(0);
      test.assert(test.isApproxPoint(pt, new go.Point(54.000000000000036, 27)));
  })); // end test




// end of tests
function createnode(object) {
  var objarr = Array.isArray(object) ? object : [object];
  var n = new go.Node(go.Panel.Vertical);
  for (var i = 0; i < objarr.length; i++) {
    var obj = objarr[i];
    if (obj instanceof go.Geometry) {
      var s = new go.Shape();
      s.geometry = obj;
      s.fill = "Green";
      n.add(s);
    }
    else {
      if (obj instanceof go.Shape) obj.fill = "Blue";
      n.add(obj.copy());
    }
  }
  return n;
}

function displaynode(t, obj) {
  t.diagram.nodeTemplate = createnode(obj);
  t.diagram.model = new go.GraphLinksModel();
  t.diagram.model.nodeDataArray = [{ key: 1}];
  t.diagram.model.linkDataArray = new Array();
}

// used with nearestIntersection tests
function test1(name, obj, src, dest, desiredres, scale, angle) {
  nearestinter.add(
    new Test(
    name, null,
    function(test) {


      var n = createnode(obj);
      test.diagram.nodeTemplate = n;
      test.diagram.model = new go.GraphLinksModel();
      test.diagram.model.nodeDataArray = [{ key: 1 }, { key: 2}]
      test.diagram.model.linkDataArray = new Array({ from: 1, to: 2 });



      test.diagram.startTransaction("position");

      var n1 = test.diagram.findNodeForKey(1);
      var n2 = test.diagram.findNodeForKey(2);
      n1.location = new go.Point(0, 0);
      n2.location = new go.Point(200, 0);
      if (scale !== undefined) { n1.scale = scale; n2.scale = scale; }
      if (angle !== undefined) { n1.angle = angle; n2.angle = angle; }

      test.diagram.commitTransaction("position");
    },
    null,
    function(t) {
      var objact = t.diagram.findNodeForKey(1);
      var p = new go.Point(NaN, NaN);
      if (objact.elt(0).allTransforms && p.transform) {
        var tt = objact.elt(0).allTransforms;
        var ttinv = tt.copy();
        ttinv.invert();

        // convert to document coords.
        var srct = src.copy().transform(tt);
        var destt = dest.copy().transform(tt);
        objact.getNearestIntersectionPoint(srct, destt, p);

        // convert back to shape coords.
        p.transform(ttinv);

        var pass = Math.abs(p.x - desiredres.x) < 1.1 && Math.abs(p.y - desiredres.y) < 1.1;
        t.assert(pass, "Result was " + p + ", desired was " + desiredres);
      } else {
        t.assert(true);
      }
    }
));
}

// used for containsPoint tests
function test2(name, obj, filled, shouldbein) {
  var args = arguments;
  containspoint.add(new Test(name + (filled ? " (filled)" : " (empty)") + (shouldbein ? " (in)" : " (out)"), null,
    function (test) {


      var n = createnode(obj);
      var sh = n.elt(0);
      sh.fill = filled ? "Red" : null;
      var geo = sh.geometry.copy();
      for (var i = 0; i < geo.figures.length; i++) {
        var fig = geo.figures.elt(i);
        fig.isFilled = true;
      }
      sh.geometry = geo;

      test.diagram.nodeTemplate = n;
      test.diagram.model = new go.GraphLinksModel();
      test.diagram.model.nodeDataArray = [{ key: 1}]
      test.diagram.model.linkDataArray = new Array();


      test.diagram.findNodeForKey(1).location = new go.Point(110, 110);
    },
    null, function (t) {
      var shape = t.diagram.findNodeForKey(1).elt(0);

      for (var i = 4; ; i += 2) {
        if (i + 1 >= args.length) { break; }
        var p = new go.Point(args[i], args[i + 1]);
        var res = shape.containsPoint(p); // Protected
        t.assert(shouldbein === res,
            "The point " + p + (shouldbein ? " should have been in but wasn't" : "shouldn't have been in but was"));
      }
    }
    ));
}

// pass in LC for non-rotation, CC for rotation
function testcont(name, obj, descontainment, by, scale, angle) {
  var offx = 100;
  var offy = 100;
  var args = arguments;
  var rotation = angle !== undefined && angle !== 0;
  (angle == 0 ? containment : containmentrot).add(new Test(
    name + ", desired containment = " + descontainment + (by === BY ? " (by)" : (by === IN ? " (in)" : " (inter)")), null,
    function(t) {
      displaynode(t,obj);

      t.diagram.startTransaction("modify");

      var n = t.diagram.findNodeForKey(1);
      n.location = new go.Point(offx, offy);
      var sh = n.elt(0);
      if (scale !== undefined) { sh.scale = scale; }
      if (rotation) { sh.angle = angle; }

      t.diagram.commitTransaction("modify");
    }, null,
    function(t) {
      var objact = t.diagram.findNodeForKey(1).elt(0);
      var tt = objact.transform;
      if (tt) {
        for (var i = 6; i + 3 < args.length; i += 4) {
          var r = new go.Rect(args[i], args[i + 1], args[i + 2], args[i + 3]);
          // convert from object coords. to container coords.
          var r2 = r.copy();
          if (!rotation) {
            tt.transformRect(r2);
          }
          var res;
          switch (by) {
            case IN: res = objact.containsRect(r2); break;
            case BY: res = objact.containedInRect(r2); break;
            default: res = objact.intersectsRect(r2); break;
          }
          t.assert(res === descontainment, "The containment was wrong.  Rect was " + r);
        }
      } else {
        t.assert(true);
      }
    }
    ));
}

function testlink(name, obj, x, y, desxoff0, desyoff0, scale, angle) {
  var cos = Math.cos(angle * Math.PI / 180);
  var sin = Math.sin(angle * Math.PI / 180)

  var xpos = 100;
  var ypos = 100;

  var xx = (cos * x - sin * y);
  var yy = (sin * x + cos * y);

  var n1x = xpos - xx;
  var n1y = ypos - yy;

  linkpoint.add(new Test(
    name + "relative pos. = (" + x + ", " + y + "), scale=" + scale + ", angle = " + angle + (""),
    null,
    function (t) {
      var n = createnode(obj);

      t.diagram.nodeTemplate = n;
      t.diagram.model = new go.GraphLinksModel();
      t.diagram.model.nodeDataArray = [{ key: 1 }, { key: 2}]
      t.diagram.model.linkDataArray = new Array({ from: 1, to: 2 });

      t.diagram.startTransaction("position");

      var n1 = t.diagram.findNodeForKey(1);
      var n2 = t.diagram.findNodeForKey(2);
      n1.scale = scale;
      n2.scale = scale;
      n1.angle = angle;
      n2.angle = angle;
      n1.location = new go.Point(n1x, n1y);
      n2.location = new go.Point(xpos, ypos);

      t.diagram.commitTransaction("position");
    },
        null,
        function (t) {
          var n = t.diagram.findNodeForKey(2);

          var p2 = n.actualBounds.center;
          var p1 = new go.Point(p2.x + n1x - xpos, p2.y + n1y - ypos);

          var p = go.Link.prototype.getLinkPointFromPoint(n, n, p2, p1, false);
          var xx = p.x; // used for the ab cases; should be equal to x coord. then.
          var yy = p.y;
          if (n.elt(0).allTransforms && p.transform) {
            // revert to shape coords.
            var tt = n.elt(0).allTransforms.copy();
            tt.invert();
            p.transform(tt);
            t.assert(
              (Math.abs(p.x - desxoff0) <= 1 && Math.abs(p.y - desyoff0) <= 1),
              "Desired offset was (" + desxoff0 + ", " + desyoff0 + ").  Actual was (" + p.x + ", " + p.y + ").     (linktest)"
              );
          } else {
            t.assert(true);
          }
        }
        ));
}

// the additional arguments MUST be contained within objects as well
function testfind(name, objects, arrangement, partial, dist, rp) {

  var node = new go.Node(arrangement);
  node.name = "node";
  for (var i = 0; i < objects.length; i++) {
    var o = objects[i];
    o.name = i.toString();
    //if (objects[i].panel) objects[i].panel.remove(objects[i])
    //node.add(o);
    node.add(o.copy());
  }

  var desired = new Array();
  for (var i = 6; i < arguments.length; i++) {
    desired.push(arguments[i].copy());
  }

  var name2 = name + " (";
  name2 += (partial ? "partial, " : "total, ") + rp + (rp instanceof go.Rect ? ")" : ", dist=" + dist + ")");
  (rp instanceof go.Rect ? objectsin : objectsnear).add(new Test(name2, null,
    function(t) {
      t.diagram.nodeTemplate = node;
      t.diagram.model = new go.GraphLinksModel();
      t.diagram.model.nodeDataArray = [{ key: 1}]
      t.diagram.model.linkDataArray = new Array();
      t.diagram.findNodeForKey(1).location = new go.Point(0, 0);
    }, null,
    function(t) {
      var n = t.diagram.findNodeForKey(1);
      if (n.findObjectsIn) {
      var list = new go.List();
      if (rp instanceof go.Rect) {
        n.findObjectsIn(rp, null, null, partial, list);
      } else {
        n.findObjectsNear(rp, new go.Point(rp.x + dist, rp.y), null, null, true, list);
      }
      found = list.toArray();

      for (var i = 0; i < found.length; i++) {
        t.assert(contains(found[i], desired),
            found[i].name + " was found but was not desired"
            );
      }
      for (var i = 0; i < desired.length; i++) {
        t.assert(contains(desired[i], found),
            desired[i].name + " was desired but was not found"
            );
      }
      } else {
        t.assert(true);
      }
    }
    ));
}
function contains(obj, arr) {
  if (obj.name === "node") { return true; } // ignore the node
  for (var i = 0; i < arr.length; i++) {
    var elem = arr[i];
    if (elem.name === obj.name) { return true; }
  }
  return false;
}

go.Shape.defineFigureGenerator("RoundedTriangle", function(shape, w, h) {
  var p = shape ? shape.parameter1 : NaN;
  var s = shape ? shape.parameter2 : 0;
  if (isNaN(p) || p < 0) p = 20;
  p = Math.min(p, w/4);
  p = Math.min(p, h/4);
  var a = Math.atan2(h, w/2);
  var ix = Math.cos(a)*p;
  var iy = Math.sin(a)*p;
  if (s === 0) {
    return new go.Geometry().add(
      new go.PathFigure(p, h, true)  // Bezier works
        .add(new go.PathSegment(go.PathSegment.Bezier, ix, h-iy, 0, h, 0, h))
        .add(new go.PathSegment(go.PathSegment.Line, w/2-ix, iy))
        .add(new go.PathSegment(go.PathSegment.Bezier, w/2+ix, iy, w/2, 0, w/2, 0))
        .add(new go.PathSegment(go.PathSegment.Line, w-ix, h-iy))
        .add(new go.PathSegment(go.PathSegment.Bezier, w-p, h, w, h, w, h).close()));
  } else if (s === 1) {
    return new go.Geometry().add(
      new go.PathFigure(p, h, true)  // QuadraticBezier NEAREST INTERSECTION FAILS
        .add(new go.PathSegment(go.PathSegment.QuadraticBezier, ix, h-iy, 0, h))
        .add(new go.PathSegment(go.PathSegment.Line, w/2-ix, iy))
        .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w/2+ix, iy, w/2, 0))
        .add(new go.PathSegment(go.PathSegment.Line, w-ix, h-iy))
        .add(new go.PathSegment(go.PathSegment.QuadraticBezier, w-p, h, w, h).close()));
  } else {
    var r2 = p;
    var fig = new go.PathFigure(p, h, true);
    fig.add(new go.PathSegment(go.PathSegment.SvgArc, ix, h-iy, r2, r2, 0, false, true));
    if (iy < 0.5) {
      fig.add(new go.PathSegment(go.PathSegment.Line, w/2, 0));
    } else {
      var r = p * ix/iy;
      fig.add(new go.PathSegment(go.PathSegment.Line, w/2-ix, iy));
      fig.add(new go.PathSegment(go.PathSegment.SvgArc, w/2+ix, iy, r, r, 0, false, true));
    }
    fig.add(new go.PathSegment(go.PathSegment.Line, w-ix, h-iy));
    fig.add(new go.PathSegment(go.PathSegment.SvgArc, w-p, h, r2, r2, 0, false, true).close());
    return new go.Geometry().add(fig);
  }
});

nearestinter.add(new Test("rounded triangle cubic bezier", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100, height: 100, resizable: true },
        new go.Binding("location"),
        $(go.Shape, "RoundedTriangle",
          { fill: "white", portId: "" },
          new go.Binding("parameter1", "corner"),
          new go.Binding("parameter2", "s")),
        $(go.TextBlock,
          { alignment: new go.Spot(0.5, 0.75) },
          new go.Binding("text"))
      );
    diag.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", location: new go.Point(0, 0), s: 0  },
      { key: 2, text: "Beta", location: new go.Point(150, -150), s: 0  },
      { key: 3, text: "Gamma", location: new go.Point(150, -10), s: 0  },
      { key: 4, text: "Delta", location: new go.Point(0, 150), s: 0  },
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    test.assertAllLinkPoints([
      [new go.Point(66.9,33.1), new go.Point(153.6,-53.6)],
      [new go.Point(74.5,48.4), new go.Point(173.9,41.7)],
      [new go.Point(50.0,100.0), new go.Point(50.0,154.5)]
    ]);
  }
));

nearestinter.add(new Test("rounded triangle quad bezier", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100, height: 100, resizable: true },
        new go.Binding("location"),
        $(go.Shape, "RoundedTriangle",
          { fill: "white", portId: "" },
          new go.Binding("parameter1", "corner"),
          new go.Binding("parameter2", "s")),
        $(go.TextBlock,
          { alignment: new go.Spot(0.5, 0.75) },
          new go.Binding("text"))
      );
    diag.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", location: new go.Point(0, 0), s: 1  },
      { key: 2, text: "Beta", location: new go.Point(150, -150), s: 1  },
      { key: 3, text: "Gamma", location: new go.Point(150, -10), s: 1  },
      { key: 4, text: "Delta", location: new go.Point(0, 150), s: 1  },
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    test.assertAllLinkPoints([
      [new go.Point(66.9,33.1), new go.Point(156.6,-56.6)],
      [new go.Point(74.5,48.4), new go.Point(173.9,41.7)],
      [new go.Point(50.0,100.0), new go.Point(50.0,158.9)]
    ]);
  }
));

nearestinter.add(new Test("rounded triangle svg arc", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100, height: 100, resizable: true },
        new go.Binding("location"),
        $(go.Shape, "RoundedTriangle",
          { fill: "white", portId: "" },
          new go.Binding("parameter1", "corner"),
          new go.Binding("parameter2", "s")),
        $(go.TextBlock,
          { alignment: new go.Spot(0.5, 0.75) },
          new go.Binding("text"))
      );
    diag.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", location: new go.Point(0, 0), s: 2  },
      { key: 2, text: "Beta", location: new go.Point(150, -150), s: 2  },
      { key: 3, text: "Gamma", location: new go.Point(150, -10), s: 2  },
      { key: 4, text: "Delta", location: new go.Point(0, 150), s: 2  },
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    //test.dumpLinkPoints();
    test.assertAllLinkPoints([
      [new go.Point(66.9,33.1), new go.Point(160.7,-60.7)],
      [new go.Point(74.5,48.4), new go.Point(173.9,41.7)],
      [new go.Point(50.0,100.0), new go.Point(50.0,162.5)]
    ]);
  }
));

nearestinter.add(new Test("cubic bezier curve", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node,
        { locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape, "Circle", { width: 4, height: 4 })
      );
    diag.nodeTemplateMap.add("Shape",
      $(go.Node,
        new go.Binding("location"),
        $(go.Shape,
          { geometryString: "M0 0 c200 50 -100 50 100 0", fill: null, stroke: "blue" })
    ));
  diag.model = new go.GraphLinksModel(
    [
      { key: 1, category: "Shape", location: new go.Point(0, 0) },
      { key: 2, location: new go.Point(150, -150) },
      { key: 3, location: new go.Point(150, -10) },
      { key: 4, location: new go.Point(0, 150) }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    //test.dumpLinkPoints();
    test.assertAllLinkPoints([
      [new go.Point(53.4,14.3), new go.Point(148.7,-147.8)],
      [new go.Point(56.1,17.6), new go.Point(147.6,-9.3)],
      [new go.Point(43.3,38.0), new go.Point(0.9,147.7)]
    ]);
  }
));

nearestinter.add(new Test("cubic bezier curve 2", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node,
        { locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape, "Circle", { width: 4, height: 4 })
      );
    diag.nodeTemplateMap.add("Shape",
      $(go.Node,
        new go.Binding("location"),
        $(go.Shape,
          { geometryString: "M0 100 c200 50 -100 50 100 0", fill: null, stroke: "blue" })
    ));
  diag.model = new go.GraphLinksModel(
    [
      { key: 1, category: "Shape", location: new go.Point(0, 0) },
      { key: 2, location: new go.Point(150, -150) },
      { key: 3, location: new go.Point(150, -10) },
      { key: 4, location: new go.Point(0, 150) }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    test.assertAllLinkPoints([
      [new go.Point(50.5,69.3), new go.Point(149.0,-147.7)],
      [new go.Point(50.5,69.3), new go.Point(148.0,-8.4)],
      [new go.Point(26.2,108.1), new go.Point(1.3,147.9)]
    ]);
  }
));

nearestinter.add(new Test("quad bezier curve", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node,
        { locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape, "Circle", { width: 4, height: 4 })
      );
    diag.nodeTemplateMap.add("Shape",
      $(go.Node,
        new go.Binding("location"),
        $(go.Shape,
          { geometryString: "M0 0 q200 50 100 0", fill: null, stroke: "blue" })
    ));
  diag.model = new go.GraphLinksModel(
    [
      { key: 1, category: "Shape", location: new go.Point(0, 0) },
      { key: 2, location: new go.Point(150, -150) },
      { key: 3, location: new go.Point(150, -10) },
      { key: 4, location: new go.Point(0, 150) }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    // test.dumpLinkPoints();
    test.assertAllLinkPoints([
      [new go.Point(67.2,13.0), new go.Point(148.9,-147.8)],
      [new go.Point(105.0,2.5), new go.Point(147.6,-9.3)],
      [new go.Point(65.6,16.2), new go.Point(1.1,147.8)]
    ]);
  }
));

nearestinter.add(new Test("quad bezier curve 2", null,
  function(test) {
    var diag = test.diagram;
    diag.reset();
    diag.initialScale = 2.0;
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node,
        { locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape, "Circle", { width: 4, height: 4 })
      );
    diag.nodeTemplateMap.add("Shape",
      $(go.Node,
        new go.Binding("location"),
        $(go.Shape,
          { geometryString: "M0 100 q200 50 100 0", fill: null, stroke: "blue" })
    ));
  diag.model = new go.GraphLinksModel(
    [
      { key: 1, category: "Shape", location: new go.Point(0, 0) },
      { key: 2, location: new go.Point(150, -150) },
      { key: 3, location: new go.Point(150, -10) },
      { key: 4, location: new go.Point(0, 150) }
    ],
    [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 }
    ]);
  },
  function(test) {
    // test.dumpLinkPoints();
    test.assertAllLinkPoints([
      [new go.Point(67.2,63.0), new go.Point(149.1,-147.7)],
      [new go.Point(67.2,63.0), new go.Point(148.1,-8.3)],
      [new go.Point(32.0,108.6), new go.Point(1.5,148.0)]
    ]);
  }
));

  // Two links should not have any gap in their connection to the "to" Parts
  misc.add(new Test('Degenerate bezier intersect', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var $ = go.GraphObject.make;

    var CheckGlyph = go.Geometry.parse(
      "F\
      M5.795 10.875\
      L2.325 7.40501\
      C2.13817 7.21776 1.88452 7.11252 1.62 7.11252\
\
      C1.35548 7.11252 1.10183 7.21776 0.914998 7.40501\
      C0.524998 7.79501 0.524998 8.42501 0.914998 8.81501\
\
      L5.095 12.995\
      C5.485 13.385 6.115 13.385 6.505 12.995\
      L17.085 2.41501\
\
      C17.475 2.02501 17.475 1.39501 17.08501 1.00501\
      C16.8982 0.817757 16.6445 0.712524 16.38 0.712524\
      C16.1155 0.712524 15.8618 0.817757 15.675 1.00501\
      L5.795 10.875\
      Z"
    );

    var CheckGlyph2 = go.Geometry.parse(
      "F\
      M0 0\
      L3 12.995\
      C5 13 6.1 13 8.5 12.995\
      Z"
    );

         diagram.nodeTemplateMap.add('',
           $(go.Node,
           new go.Binding('position').makeTwoWay(),
             $(go.Shape, { fill: 'lime', scale: 5, strokeWidth: 1, geometry: CheckGlyph })
           ));

           diagram.nodeTemplateMap.add('2',
           $(go.Node,
           new go.Binding('position').makeTwoWay(),
             $(go.Shape, { fill: 'red', scale: 5, strokeWidth: 1, geometry: CheckGlyph2})
           ));

           diagram.nodeTemplateMap.add('rect',
           $(go.Node,
           new go.Binding('position').makeTwoWay(),
             $(go.Shape, "Circle", { fill: 'red', scale: 0.5, strokeWidth: 1 })
           ));

         diagram.model = go.Model.fromJSON(
      '{ "class": "GraphLinksModel",  "nodeDataArray": [{"key":"Alpha","category":"rect","position":{"class":"go.Point","x":-29,"y":94}},{"key":"Beta","position":{"class":"go.Point","x":70.5,"y":0}},{"key":"Gamma","category":"rect","position":{"class":"go.Point","x":-8,"y":183.975}},{"key":"Delta","category":"2","position":{"class":"go.Point","x":70.5,"y":89.975}}],  "linkDataArray": [{"from":"Alpha","to":"Beta"},{"from":"Gamma","to":"Delta"}]}');

  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var l0 = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    test.assert(l0.points.count === 2);
    test.assert(l0.getPoint(0).equalsApprox(new go.Point(16.883644217436306, 104.69612675923494)));
    test.assert(l0.getPoint(1).equalsApprox(new go.Point(84.51126178307177, 56.99520862508067)));
    var l1 = diagram.findLinkForData(diagram.model.linkDataArray[1]);
    test.assert(l1.points.count === 2);
    test.assert(l1.getPoint(0).equalsApprox(new go.Point(34.28310213362562, 190.5853666424074)));
    test.assert(l1.getPoint(1).equalsApprox(new go.Point(81.58666832766029, 138.8202140914354)));

  })); // end test




  go.Shape.defineFigureGenerator("YinYang2", function (shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(w * 0.5, 0, true);
    geo.add(fig);
    // Right semi-circle
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25));
    return geo;
  });

  go.Shape.defineFigureGenerator("YinYang3", function (shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(w * 0.5, 0, true);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, w * 0.5, w * 0.25, w * 0.25, w * 0.25));
    return geo;
  });

  go.Shape.defineFigureGenerator("YinYang4", function (shape, w, h) {
    var geo = new go.Geometry();
    var fig = new go.PathFigure(w * 0.5, 0, true);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, w * 0.5, w * 0.25, w * 0.25, w * 0.25));

    var radius = .1;  // of the small circles
    var centerx = .5;
    var centery = .25;
    // Top small circle, goes counter-clockwise
    fig.add(new go.PathSegment(go.PathSegment.Move, (centerx + radius) * w, (centery) * h));
    fig.add(new go.PathSegment(go.PathSegment.Arc, 0, -360, w * centerx, h * centery, radius * w, radius * w).close()); // Right semi-circle
    // Left semi-circle
    fig = new go.PathFigure(w * 0.5, 0, false);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Arc, 270, -180, w * 0.5, w * 0.5, w * 0.5, w * 0.5));
    centery = .75;
    // Bottom small circle
    fig = new go.PathFigure((centerx + radius) * w, (centery) * h, true); // Not a subpath
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, w * centerx, h * centery, radius * w, radius * w).close()); // Right semi-circle
    geo.defaultStretch = go.GraphObject.Uniform;
    return geo;
  });

  // YinYangs when connected vertically have a bezier connected to a starting point (or start of next bezier)
  // that acts as a degenerate line segment
  misc.add(new Test('YinYang degen', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var $ = go.GraphObject.make;
      // LinkTemplate ---------------------------------------------
      function makeLinkTemplate() {
        return $go(go.Link,  // the whole link panel
          {
            //curve: go.Link.Bezier,
            adjusting: go.Link.Scale,
            reshapable: true, relinkableFrom: true, relinkableTo: true,
            toShortLength: 6.4, fromShortLength: 0,
          },
          new go.Binding("fromSpot", "linkFromSpot", go.Spot.parse),
          new go.Binding("toSpot", "linkToSpot", go.Spot.parse),
          new go.Binding("points").makeTwoWay(),
          $go(go.Shape,  // the link shape
            { strokeWidth: 1.5 },
          ),
          $go(go.Shape,  // the arrowhead
            { fromArrow: "Backward", visible: true },
          ),
          $go(go.Shape,  // the arrowhead
            { toArrow: "Standard" },
          ),

        );
      };

      var $go = go.GraphObject.make;  // for conciseness in defining templates
      // define the Node template
      var nodeTemplate = $go(go.Node, "Auto", { resizable: true },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $go(go.Shape,
          {
            parameter1: 20,  // the corner has a large radius
            fill: "lightgreen", stroke: "black", strokeWidth: 1.5,
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
            cursor: "pointer"
          },
          new go.Binding("figure", "fig").makeTwoWay()
        ),
        $go(go.TextBlock,
          { width: 10, height: 20,
            font: "bold 11pt helvetica, bold arial, sans-serif",
            editable: true,  // editing the text automatically updates the model data
            "margin": 18
          },
          new go.Binding("text").makeTwoWay())
      );
      diagram.nodeTemplate = nodeTemplate;

      var ltemplt = makeLinkTemplate();

      diagram.linkTemplate = ltemplt;


      let diagramJSON = `{ "class": "go.GraphLinksModel",
		"nodeKeyProperty": "key",
		"nodeDataArray": [
		{"key":0, "loc":"69.68559364834277 54.26528785342265", "fig":"YinYang2", "text":""},
		{"key":1, "loc":"69.68559364834277 119.54762486049151", "fig":"YinYang2", "text":""},

		{"key":2, "loc":"169.68559364834277 54.26528785342265", "fig":"YinYang3", "text":""},
		{"key":3, "loc":"169.68559364834277 119.54762486049151", "fig":"YinYang3", "text":""},

		{"key":4, "loc":"269.68559364834277 54.26528785342265", "fig":"YinYang4", "text":""},
		{"key":5, "loc":"269.68559364834277 119.54762486049151", "fig":"YinYang4", "text":""}
		],
		"linkDataArray": [

		]
	}`;

      diagram.model = go.Model.fromJson(diagramJSON);

      diagram.model.linkKeyProperty = "key";
      diagram.model.nodeKeyProperty = "key";
      diagram.startTransaction();
      diagram.model.addLinkData({ "from": 0, "to": 1 })
      diagram.model.addLinkData({ "from": 2, "to": 3 })
      diagram.model.addLinkData({ "from": 4, "to": 5 })
      diagram.commitTransaction();
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    test.assertAllLinkPoints([
      [new go.Point(93.4,101.8), new go.Point(93.4,119.5)],
      [new go.Point(193.4,101.8), new go.Point(193.4,119.5)],
      [new go.Point(298.4,111.8), new go.Point(298.4,119.5)]
    ]);

  })); // end test





  })();


  // misc.add(new Test('TESTNAME', null,
  // function (test) {
  //   var diagram = test.diagram;
  //   var d = diagram;
  //   diagram.reset();
  //   var $ = go.GraphObject.make;

  // }, // END SETUP
  // null,
  // function (test) {
  //   var diagram = test.diagram;

  // })); // end test