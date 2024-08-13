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
(function () {

var v1 = new TestCollection('Invalidation');
TestRoot.add(v1);
var $ = go.GraphObject.make;

function WithTransaction(test, func) {
  test.diagram.startTransaction("test");
  func(test);
  test.diagram.commitTransaction("test");
}

function CommonSetup(test) {
  var diagram = test.diagram;
  diagram.reset();
  var node1 =
    $(go.Node, "Auto",
      { position: new go.Point(0, 0) },
      $(go.Shape, { fill: "transparent" }),
      $(go.Shape, "Triangle", { fill: "green" }));

  var node2 =
    $(go.Node, "Auto",
      { position: new go.Point(200, 0) },
      $(go.Shape, { fill: "transparent" }),
      $(go.Shape, "Diamond", { fill: "red" }));

  var node3 =
    $(go.Node, "Auto",
      { position: new go.Point(400, 0) },
      $(go.Shape, { fill: "transparent" }),
      $(go.Shape, "Circle", { fill: "blue" }));

  var link1 =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  var link2 =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.add(node1);
  diagram.add(node2);
  diagram.add(node3);
  diagram.add(link1);
  link1.fromNode = node1;
  link1.toNode = node2;
  diagram.add(link2);
  link2.fromNode = node2;
  link2.toNode = node3;

  link1.points = new go.List(/*go.Point*/).addAll([new go.Point(50, 150), new go.Point(70, 140), new go.Point(80, 200), new go.Point(90, 160), new go.Point(100, 130), new go.Point(110, 170), new go.Point(120, 120)]);

  link2.points = new go.List(/*go.Point*/).addAll([new go.Point(250, 150), new go.Point(270, 140), new go.Point(280, 200), new go.Point(290, 160), new go.Point(300, 130), new go.Point(310, 170), new go.Point(320, 120)]);
}

function CommonCheck(test, routed1, routed2) {
  var diagram = test.diagram;
  var it = diagram.links;
  it.next();
  var link1 = it.value;
  if (routed1) {
    test.assert(link1.points.count === 2, "Link 1 points has not been rerouted to have 2 points in it: " + link1.points.count);
  } else {
    test.assert(link1.points.count === 7, "Link 1 points does not still have 7 points in it: " + link1.points.count);
  }
  it.next();
  var link2 = it.value;
  if (routed2) {
    test.assert(link2.points.count === 2, "Link 2 points has not been rerouted to have 2 points in it: " + link2.points.count);
  } else {
    test.assert(link2.points.count === 7, "Link 2 points does not still have 7 points in it: " + link2.points.count);
  }
}

var tc = new TestCollection("Link route");
v1.add(tc);

tc.add(new Test('nothing', null,
  CommonSetup,
  null,
  function(test) {
    CommonCheck(test, false, false);
  }
));

//"??? BUG" indicates a statement that ought to be able to be executed without causing a test error.
// commented out statements really are supposed to invalidate link routes, so we don't bother executing them.

tc.add(new Test('set unrelated properties', null,
  CommonSetup,
  function(test) {
    WithTransaction(test, function(t) {
      var n = t.diagram.nodes.first();
      // GraphObject properties
      n.actionCancel = function(e, o) { };
      n.actionDown = function(e, o) { };
      n.actionMove = function(e, o) { };
      n.actionUp = function(e, o) { };
      n.alignment = go.Spot.Bottom;  //??? BUG
      n.alignmentFocus = go.Spot.Top;  //??? BUG
      //n.angle = 47;
      n.background = "lightgreen";
      n.click = function(e, o) { };
      n.column = 3;  //??? BUG
      n.columnSpan = 4;  //??? BUG
      n.contextClick = function(e, o) { };
      n.contextMenu = $(go.Adornment, $(go.Placeholder));
      n.cursor = "pointer";
      //n.desiredSize = new go.Size(79, 97);
      n.doubleClick = function(e, o) { };
      //n.fromEndSegmentLength = 23;
      n.fromLinkable = true;
      n.fromLinkableDuplicates = true;
      n.fromLinkableSelfNode = true;
      n.fromMaxLinks = 3;
      n.fromShortLength = 7;
      //n.fromSpot = go.Spot.Top;
      //n.height = 79;
      n.isActionable = true;
      n.isPanelMain = true;  //??? BUG
      n.margin = new go.Margin(19, 18, 17, 16);  //??? BUG
      n.maxSize = new go.Size(987, 654);  //??? BUG
      n.minSize = new go.Size(9, 8);  //??? BUG
      n.mouseDragEnter = function(e, next, prev) { };
      n.mouseDragLeave = function(e, next, prev) { };
      n.mouseDrop = function(e, o) { };
      n.mouseEnter = function(e, next, prev) { };
      n.mouseHold = function(e, o) { };
      n.mouseHover = function(e, o) { };
      n.mouseLeave = function(e, next, prev) { };
      n.mouseOver = function(e, o) { };
      n.name = "TWEEDLEDEE";
      n.opacity = 0.9;
      n.pickable = false;
      n.portId = "hello";
      //n.position = ...
      n.row = 4;  //??? BUG
      n.rowSpan = 7;  //??? BUG
      //n.scale = 0.8;
      n.segmentFraction = 0.3;  //??? BUG
      n.segmentIndex = 2;  //??? BUG
      n.segmentOffset = new go.Point(12, 34);  //??? BUG
      n.segmentOrientation = go.Link.OrientPlus90;  //??? BUG
      n.shadowVisible = true;
      n.stretch = go.GraphObject.Horizontal;  //??? BUG
      //n.toEndSegmentLength = 23;
      n.toLinkable = true;
      n.toLinkableDuplicates = true;
      n.toLinkableSelfNode = true;
      n.toMaxLinks = 3;
      n.toShortLength = 7;
      //n.toSpot = go.Spot.Top;
      n.toolTip = $(go.Adornment, $(go.Placeholder));
      //n.visible = false;
      //n.width = 97;

      // Panel properties
      n.columnSizing = go.RowColumnDefinition.None;
      n.data = { someProp: 23 };
      n.defaultAlignment = go.Spot.Right;  //??? BUG
      n.defaultColumnSeparatorDashArray = [5, 10];
      n.defaultColumnSeparatorStroke = "cyan";
      n.defaultColumnSeparatorStrokeWidth = 23;
      n.defaultRowSeparatorDashArray = [5, 10];
      n.defaultRowSeparatorStroke = "cyan";
      n.defaultRowSeparatorStrokeWidth = 23;
      n.defaultSeparatorPadding = new go.Margin(1, 2, 3, 4);
      n.defaultStretch = go.GraphObject.Uniform;  //??? BUG
      n.gridCellSize = new go.Size(23, 34);
      n.gridOrigin = new go.Point(-32, -21);
      //n.itemArray = ["a", "b", "c"];  // this would replace the contents of the Node
      //n.itemCategoryProperty = ""; // must not change after setting itemArray
      //n.itemTemplate = $(go.Panel);  // this would replace the contents of the Node
      //n.itemTemplateMap = ...  // this would replace the contents of the Node
      n.leftIndex = 3;
      n.padding = new go.Margin(4, 3, 2, 1);  //??? BUG
      n.rowSizing = go.RowColumnDefinition.None;
      n.topIndex = 3;
      n.viewboxStretch = go.GraphObject.UniformToFill;

      // Part properties
      n.copyable = false;
      n.deletable = false;
      n.dragComputation = function(part, p, q) { return q; };
      n.groupable = false;
      n.isAnimated = false;
      n.isHighlighted = true;
      n.isInDocumentBounds = false;
      n.isLayoutPositioned = false;
      n.isSelected = true;
      n.isShadowed = true;
      n.layerChanged = function(part, l, m) { };
      n.layerName = "Background";
      n.layoutConditions = go.Part.LayoutNodeSized;
      n.maxLocation = new go.Point(-300, -400);
      n.minLocation = new go.Point(300, 400);
      n.movable = false;
      n.reshapable = true;
      n.resizable = true;
      n.resizeAdornmentTemplate = $(go.Adornment, $(go.Placeholder));
      n.resizeCellSize = new go.Size(3, 4);
      n.resizeObjectName = "DUMMY";
      n.rotatable = true;
      n.rotateAdornmentTemplate = $(go.Adornment, $(go.Placeholder));
      n.rotateObjectName = "DUMMY";
      n.selectable = false;
      n.selectionAdorned = false;
      n.selectionAdornmentTemplate = $(go.Adornment, $(go.Placeholder));
      n.selectionChanged = function(part) { };
      n.selectionObjectName = "DUMMY";
      n.shadowBlur = 123;
      n.shadowColor = "cyan";
      n.shadowOffset = new go.Point(-20, -30);
      n.text = "hello";
      n.textEditable = false;
      n.zOrder = 23;

      // Node properties
      n.avoidable = false;
      n.avoidableMargin = new go.Margin(1, 2, 3, 4);
      //n.isTreeExpanded = false;  // should be OK to set to false, ought to test separately
      n.linkConnected = function(node, link, port) { };
      n.linkDisconnected = function(node, link, port) { };
      n.linkValidation = function(node1, port1, node2, port2, link) { return true; };
      n.portSpreading = go.Node.SpreadingNone;  //??? BUG -- should only invalidate connected links for ports that are "...Side"
      n.treeExpandedChanged = function(node) { };
      n.wasTreeExpanded = true;
    })
  },
  function(test) {
    if (!TestCollection.RunSlowTests) {
      test.log("***!!!???@@@ skipping link route invalidation test");
      return;
    }
    CommonCheck(test, false, false);
  }
));

tc.add(new Test('simple move', null,
  CommonSetup,
  function(test) {
    WithTransaction(test, function(t) {
      var n = t.diagram.nodes.first();
      n.position = new go.Point(40, 50);
    })
  },
  function(test) {
    CommonCheck(test, true, false);
  }
));


function CommonSetupPorts(test) {
  var diagram = test.diagram;
  diagram.reset();

  diagram.nodeTemplate =
    $(go.Node, "Spot",
      new go.Binding("position"),
      $(go.Panel, "Auto",
        $(go.Shape, { fill: "transparent" }),
        $(go.Shape, "Circle", new go.Binding("fill"))),
      $(go.Shape, {
        alignment: go.Spot.Left, width: 10, height: 10,
        portId: "in", toSpot: go.Spot.Left, fill: "gray", strokeWidth: 0
      }),
      $(go.Shape, {
        alignment: go.Spot.Right, width: 10, height: 10,
        portId: "out", fromSpot: go.Spot.Right, fill: "gray", strokeWidth: 0
      })
    );

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("points"),
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model = $(go.GraphLinksModel, {
    linkFromPortIdProperty: "frompid",
    linkToPortIdProperty: "topid",
    nodeDataArray: [
      { key: 1, fill: "green", position: new go.Point(0, 0) },
      { key: 2, fill: "red", position: new go.Point(200, 0) },
      { key: 3, fill: "blue", position: new go.Point(400, 0) }
    ],
    linkDataArray: [
      {
        from: 1, frompid: "out", to: 2, topid: "in",
        points: new go.List(/*go.Point*/).addAll([new go.Point(50, 150), new go.Point(70, 140), new go.Point(80, 200), new go.Point(90, 160), new go.Point(100, 130), new go.Point(110, 170), new go.Point(120, 120)])
      },
      {
        from: 2, frompid: "out", to: 3, topid: "in",
        points: new go.List(/*go.Point*/).addAll([new go.Point(250, 150), new go.Point(270, 140), new go.Point(280, 200), new go.Point(290, 160), new go.Point(300, 130), new go.Point(310, 170), new go.Point(320, 120)])
      }
    ]
  });
}

function CommonCheckPorts(test, routed1, routed2) {
  var diagram = test.diagram;
  var it = diagram.links;
  it.next();
  var link1 = it.value;
  if (routed1) {
    test.assert(link1.points.count === 4, "Link 1 points has not been rerouted to have 4 points in it: " + link1.points.count);
  } else {
    test.assert(link1.points.count === 7, "Link 1 points does not still have 7 points in it: " + link1.points.count);
  }
  it.next();
  var link2 = it.value;
  if (routed2) {
    test.assert(link2.points.count === 4, "Link 2 points has not been rerouted to have 4 points in it: " + link2.points.count);
  } else {
    test.assert(link2.points.count === 7, "Link 2 points does not still have 7 points in it: " + link2.points.count);
  }
}

tc.add(new Test('nothing with ports', null,
  CommonSetupPorts,
  null,
  function(test) {
    CommonCheckPorts(test, false, false);
  }
));

tc.add(new Test('simple move with ports', null,
  CommonSetupPorts,
  function(test) {
    WithTransaction(test, function(t) {
      var n = t.diagram.nodes.first();
      n.position = new go.Point(40, 50);
    })
  },
  function(test) {
    CommonCheckPorts(test, true, false);
  }
));

tc.add(new Test('change in port height', null,
  CommonSetupPorts,
  function(test) {
    WithTransaction(test, function(t) {
      var n = t.diagram.findNodeForKey(2);
      var p = n.findPort("in");
      test.assert(p !== null, "missing 'in' port?");
      p.height = 25;
    })
  },
  function(test) {
    CommonCheckPorts(test, true, false);
  }
));

tc.add(new Test('change in port position', null,
  CommonSetupPorts,
  function(test) {
    WithTransaction(test, function(t) {
      var n = t.diagram.findNodeForKey(2);
      var p = n.findPort("in");
      test.assert(p !== null, "missing 'in' port?");
      p.alignment = new go.Spot(0, 0.9);
    })
  },
  function(test) {
    CommonCheckPorts(test, true, false);
  }
));


function stringifyPoints(points, o, m) {
  if (typeof o !== "object" || !o.from || !o.to) throw new Error("stringifyPoints back-converter was not passed a link data object as the second argument: " + o);
  if (!(m instanceof go.Model)) throw new Error("stringifyPoints back-converter was not passed a Model as the third argument: " + m);
  if (points && (points.length > 0)) {
    var string = null;
    for (var i = 0; i < points.length; i = i + 1) {
      var point = points.elt(i);
      if (string) {
        string = string + " ";
      } else {
        string = "";
      }
      //string = string + point.x.toFixed(3) + "," + point.y.toFixed(3);
      string = string + point.x.toString() + " " + point.y.toString();
    }
    return string;
  } else {
    return null;
  }
}

function parsePoints(string, o) {
  if (!(o instanceof go.Link)) throw new Error("parsePoints converter was not passed a Link as the second argument: " + o);
  if (string) {
    var points = new go.List(/*go.Point*/);
    var strings = string.split(" ");
    for (var i = 0; i < strings.length; i = i + 2) {
      var x = parseFloat(strings[i]);
      var y = parseFloat(strings[i + 1]);
      points.add(new go.Point(x, y));
    }
    return points;
  } else {
    return null;
  }
}

function SetupTwoWayRoute(test, withconv) {
  var diagram = test.diagram;
  diagram.reset();

  diagram.nodeTemplate =
    $(go.Node, "Spot",
      { locationSpot: go.Spot.Center },
      new go.Binding("location"),
      $(go.Shape, "Circle", { width: 50, height: 50 })
    );

  diagram.linkTemplate =
    $(go.Link,
      withconv ? new go.Binding("points", "points", parsePoints).makeTwoWay(stringifyPoints) : new go.Binding("points").makeTwoWay(),
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model = $(go.GraphLinksModel, {
    nodeDataArray: [
      { key: 1, location: new go.Point(0, 0) },
      { key: 2, location: new go.Point(200, 0) }
    ],
    linkDataArray: [
      {
        from: 1, to: 2,
        points: withconv ? "50 -50 200 200" : new go.List().addAll([new go.Point(50, -50), new go.Point(200, 200)])
      }
    ]
  });
}

function CommonCheckTwoWayRoute(test) {
  var diagram = test.diagram;
  var link = diagram.links.first();
  test.assert(link.points.count === 2 && link.points.elt(0).equalTo(50, -50) && link.points.elt(1).equalTo(200, 200), "Link does not have 2 points at 50 -50 200 200");
}

function CommonCheckTwoWayRouteMoved(test) {
  test.mouseDown(new go.Point(0, 0), { timestamp: 1000 });  // move node1 from 0,0, to 0,150
  test.mouseMove(new go.Point(0, 75), { timestamp: 1200 });
  test.mouseUp(new go.Point(0, 150), { timestamp: 1400 });

  var it = test.diagram.nodes;
  it.next(); var node1 = it.value;
  it.next(); var node2 = it.value;
  var link = test.diagram.links.first();
  test.assert(link.points.count === 2 && node1.actualBounds.containsPoint(link.points.elt(0)) && node2.actualBounds.containsPoint(link.points.elt(1)), "Link route was not updated after moving node 1");
}

tc.add(new Test("two way Link.points without conversions", null,
  function(test) { SetupTwoWayRoute(test, false); },
  CommonCheckTwoWayRoute,
  CommonCheckTwoWayRouteMoved
));

tc.add(new Test("two way Link.points with conversions", null,
  function(test) { SetupTwoWayRoute(test, true); },
  CommonCheckTwoWayRoute,
  CommonCheckTwoWayRouteMoved
));


  var layouts = new TestCollection("Layouts");
  v1.add(layouts);

  function CommonLayoutsSetup(test, props) {
    if (props === undefined) props = {};

    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;

    diagram.layout = new go.TreeLayout();

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100 },
        props,
        new go.Binding("location"),
        $(go.Shape, { fill: "white" }),
        $(go.TextBlock, new go.Binding("text"))
      );

    diagram.linkTemplate =
      $(go.Link,
        props,
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      )

    diagram.model = new go.TreeModel([
      { key: 1, text: "one" },
      { key: 2, text: "two", parent: 1, location: new go.Point(300, 300) },
      { key: 3, text: "three", parent: 2 }
    ]);
  }

  layouts.add(new Test("NodeSized", null, CommonLayoutsSetup,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      n2.width = 50;
      diagram.commitTransaction('narrowed n2');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 250, "didn't relayout tree with narrower N2");
    }
  ));

  layouts.add(new Test("Added node", null, CommonLayoutsSetup,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      diagram.model.addNodeData({ key: 4, text: "added", parent: 3 });
      diagram.commitTransaction('added 4');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      var n4 = diagram.findNodeForKey(4);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300 && n4.position.x === 450, "didn't relayout tree with extra node");
    }
  ));

  layouts.add(new Test("Removed node", null, CommonLayoutsSetup,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      diagram.model.removeNodeData(n1.data);
      diagram.model.setDataProperty(n2.data, "parent", undefined);
      diagram.commitTransaction('removed 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1 === null && n2.position.x === 0 && n3.position.x === 150, "didn't relayout tree with deleted node");
    }
  ));

  layouts.add(new Test("Hidden node", null, CommonLayoutsSetup,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      n1.visible = false;
      diagram.commitTransaction('hid 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 0 && n3.position.x === 150, "didn't relayout tree with invisible node");
    }
  ));

  layouts.add(new Test("Shown node", null,
    function(test) {
      CommonLayoutsSetup(test);
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      n1.visible = false;  // N1 won't have any position after initial layout
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(isNaN(n1.position.x) && n2.position.x === 0 && n3.position.x === 150, "didn't lay out tree without N1");

      diagram.startTransaction();
      n1.visible = true;
      diagram.commitTransaction('shown 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't relayout tree with now-visible node N1");
    }
  ));

  layouts.add(new Test("NodeSized layoutConditions", null, function(test) { CommonLayoutsSetup(test, { layoutConditions: go.Part.LayoutNone }); },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      n2.width = 50;
      diagram.commitTransaction('narrowed n2');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "should not have laid out tree");
    }
  ));

  layouts.add(new Test("Added node layoutConditions", null, function(test) { CommonLayoutsSetup(test, { layoutConditions: go.Part.LayoutNone }); },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      diagram.model.addNodeData({ key: 4, text: "added", parent: 3 });
      diagram.commitTransaction('added 4');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      var n4 = diagram.findNodeForKey(4);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300 && !n4.position.isReal(), "should not have laid out tree");
    }
  ));

  layouts.add(new Test("Removed node layoutConditions", null, function(test) { CommonLayoutsSetup(test, { layoutConditions: go.Part.LayoutNone }); },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      diagram.model.removeNodeData(n1.data);
      diagram.model.setDataProperty(n2.data, "parent", undefined);
      diagram.commitTransaction('removed 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1 === null && n2.position.x === 150 && n3.position.x === 300, "should not have laid out tree");
    }
  ));

  layouts.add(new Test("Hidden node layoutConditions", null, function(test) { CommonLayoutsSetup(test, { layoutConditions: go.Part.LayoutNone }); },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't lay out tree");

      diagram.startTransaction();
      n1.visible = false;
      diagram.commitTransaction('hid 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "should not have laid out tree");
    }
  ));

  layouts.add(new Test("Shown node layoutConditions", null, function(test) { CommonLayoutsSetup(test, { layoutConditions: go.Part.LayoutNone }); },
    function(test) {
      CommonLayoutsSetup(test);
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      n1.visible = false;  // N1 won't have any position after initial layout
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(isNaN(n1.position.x) && n2.position.x === 0 && n3.position.x === 150, "didn't lay out tree without N1");

      diagram.startTransaction();
      n1.visible = true;
      diagram.commitTransaction('shown 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "should not have laid out tree");
    }
  ));


  layouts.add(new Test("isLayoutPositioned", null,
    function(test) {
      CommonLayoutsSetup(test);
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      n1.isLayoutPositioned = false;  // N1 won't have any position after initial layout
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(isNaN(n1.position.x) && n2.position.x === 0 && n3.position.x === 150, "didn't lay out tree without N1");

      diagram.startTransaction();
      n1.isLayoutPositioned = true;
      diagram.commitTransaction('shown 1');
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n1.position.x === 0 && n2.position.x === 150 && n3.position.x === 300, "didn't relayout tree with now-visible node N1");
    }
  ));

  layouts.add(new Test("isInitial", null,
    function(test) {
      CommonLayoutsSetup(test);
      var diagram = test.diagram;
      diagram.layout.isInitial = false;  // no nodes get any positions except N2 via binding
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(!n1.position.isReal() && n2.location.equalTo(300, 300) && !n3.position.isReal(), "laid out tree when isInitial was false, except when had binding");
    }
  ));


  // define a custom Layout that scales member nodes to fit in their group (that has no Placeholder)
  class ScalingLayout extends go.Layout {
    constructor() {
    super();
    this.spacing = 10;
  }



  cloneProtected(copy) {
    super.cloneProtected(copy);
    copy.spacing = this.spacing;
  }

  doLayout(coll) {
    var parts = this.collectParts(coll);
    var needed = 0;
    var spaces = 0;
    parts.each(function(p) {
      if (p instanceof go.Link) return;
      // use naturalBounds, which is independent of scaling and rotation, not actualBounds
      needed += p.naturalBounds.width;
      spaces++;
    })
    if (needed <= 0) return;
    var avail =
      (this.group !== null) ?
        this.group.actualBounds.width :
        (this.isViewportSized) ?
          this.diagram.viewportBounds.width :
          this.diagram.documentBounds.width;
    if (isNaN(avail)) avail = 2000;
    var spacing = this.spacing;
    var scale = Math.max(0.01, (avail - spacing * (spaces + 1)) / needed);
    var tl = this.initialOrigin(this.arrangementOrigin);
    var x = tl.x + spacing;
    var y = tl.y + spacing;
    parts.each(function(p) {
      if (p instanceof go.Link) return;
      p.moveTo(x, y);
      p.scale = scale;
      x += p.naturalBounds.width * scale + spacing;
    })
  }
}
  // end ScalingLayout

  function CommonLayoutsSetupCustom(test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.groupTemplate =
      $(go.Group, "Spot",
        {
          resizable: true, resizeObjectName: "SHAPE",
          layout: new ScalingLayout()
        },
        $(go.Shape, { name: "SHAPE", fill: 'lightgray', minSize: new go.Size(50, 50) },
          new go.Binding("desiredSize", "size", function(s, shape) {
            //shape.part.layout.invalidateLayout();  // supports realtime relayout
            return s;
          }).makeTwoWay()),
        $(go.TextBlock, new go.Binding("text"))
      );

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { resizable: true },
        $(go.Shape,
          { portId: "", fromLinkable: true, toLinkable: true },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", group: 5 },
        { key: 2, text: "Beta", color: "orange", group: 5 },
        { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
        { key: 5, text: "GROUP", isGroup: true }
      ]);

    diagram.addDiagramListener("PartResized", function(e) {
      var g = e.subject.part;
      if (g instanceof go.Group) {
        g.layout.invalidateLayout();  // relayout at end of resizing operation
      }
    });

    diagram.undoManager.isEnabled = true;
  }

  layouts.add(new Test("custom", null, CommonLayoutsSetupCustom,
    function(test) {
      var diagram = test.diagram;
      var g1 = diagram.findNodeForKey(5);
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(g1.actualBounds.width === 101 && n1.actualBounds.width < 20 && n2.actualBounds.width < 18 && n3.actualBounds.width < 25, "nodes in group weren't shrunk by ScalingLayout");

      g1.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      var g2 = null;
      diagram.selection.each(function(p) { if (p instanceof go.Group) g2 = p; });
      test.assert(g2 !== null);

      diagram.startTransaction();
      g2.moveTo(100, 120);
      //diagram.model.setDataProperty(g2.data, "size", new go.Size(250, 100));  // when layout invalidation in binding
      g2.findObject("SHAPE").desiredSize = new go.Size(250, 100);  // when layout invalidation in "PartResized" listener
      g2.layout.invalidateLayout();
      diagram.commitTransaction("resized");

      var widths = [];
      g2.memberParts.each(function(p) { widths.push(p.actualBounds.width); });
      test.assert(g2.actualBounds.width === 251 && widths[0] > 65 && widths[1] > 55 && widths[2] > 80, "nodes in copied group weren't stretched by ScalingLayout");
    }
  ));


  layouts.add(new Test("num transactions", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout);
      diag.undoManager.isEnabled = true;
      diag.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse),
          { fromLinkable: true, toLinkable: true },
          $(go.Shape, "Circle",
            { width: 40, height: 40, cursor: "pointer"  })
        );
      diag.groupTemplate =
        $(go.Group, "Auto",
          { layout: $(go.TreeLayout) },
          $(go.Shape, { fill: "lightgray" }),
          $(go.Placeholder, { padding: 5 })
        );
      diag.model = $(go.GraphLinksModel, {
          nodeDataArray: [
            { key: "node1", loc: "100 0" },
            { key: "node2", loc: "200 0" },
            { key: "group1", loc: "0 0", isGroup: true },
            { key: "node11", loc: "100 100", group: "group1" },
            { key: "node12", loc: "200 100", group: "group1" },
            { key: "group2", loc: "0 200", isGroup: true },
            { key: "node21", loc: "100 200", group: "group2" },
            { key: "node22", loc: "200 200", group: "group2" },
            { key: "group3", loc: "0 200", isGroup: true, group: "group2" },
            { key: "node31", loc: "100 200", group: "group3" },
            { key: "node32", loc: "200 200", group: "group3" }
          ]
      });
      test._numTxn = 0;
      diag.model.addChangedListener(function(e) {
        if (e.propertyName === "CommittedTransaction" && e.object.name !== "Initial Layout") {
          test._numTxn++;
        }
      });
    },
    function(test) {
      var diag = test.diagram;
      var m = diag.model;
      m.commit(function(m) {
        m.addLinkData({ from: "node1", to: "node2" });
      });
      m.commit(function(m) {
        m.addLinkData({ from: "node11", to: "node12" });
      });
      m.commit(function(m) {
        m.addLinkData({ from: "node21", to: "node22" });
      });
      m.commit(function(m) {
        m.addLinkData({ from: "node31", to: "node32" });
      });
    },
    function(test) {
      test.assert(test._numTxn === 4, "wrong number of transactions committed, should be 4, not: " + test._numTxn);
    }));


  var props = new TestCollection("Properties");
  v1.add(props);

  props.add(new Test("padding", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node,
          { width: 40, height: 40, background: "lightgray" },
          $(go.TextBlock,
            new go.Binding("text", "key"))
        );
      diag.groupTemplate =
        $(go.Group, "Auto",
          $(go.Shape, { fill: "whitesmoke", strokeWidth: 0 }),
          $(go.Placeholder, { padding: 0 },
            new go.Binding("padding", "padding", go.Margin.parse))
        );
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, group: 10 },
          { key: 2, group: 10 },
          { key: 3, group: 10 },
          { key: 10, isGroup: true }
        ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var g = test.diagram.findNodeForKey(10);
      test.assert(g && g.actualBounds.width === 110 && g.actualBounds.height === 110, "group should be small when no padding");
      test.diagram.model.commit(function(m) {
        m.set(m.findNodeDataForKey(10), "padding", "22");
      });
    },
    function(test) {
      var g = test.diagram.findNodeForKey(10);
      test.assert(g && g.actualBounds.width === 154 && g.actualBounds.height === 154, "group should be bigger when padding 22");
      test.diagram.commandHandler.undo();
      test.assert(g && g.actualBounds.width === 110 && g.actualBounds.height === 110, "group should be small when no padding after undo");
      test.diagram.commandHandler.redo();
      test.assert(g && g.actualBounds.width === 154 && g.actualBounds.height === 154, "group should be bigger when padding 22 after redo");
    }
  ));


  var initTxns = new TestCollection("Initial Transactions");
  v1.add(initTxns);

  class NestedLayout extends go.Layout{
    constructor() {
    super();
  }

  doLayout(coll) {
    if (this.group !== null) {
      coll = this.collectParts(coll);
      //?? only lay out at most two Parts, one of category "top" and one of category "bottom"
      var top = null;
      var bot = null;
      coll.each(function(part) {
        if (part.category === "top") top = part;
        else if (part.category === "bottom") bot = part;
      });
      var sep = this.group.findObject("SEP");

      this.group.diagram.startTransaction("NestedLayout");
      var y = 0;
      var w = 0;
      var mid = 0;
      if (top) {
        top.moveTo(0, y);
        y += top.actualBounds.height;
        w = Math.max(w, top.actualBounds.width);
      }
      if (sep) mid = y;
      if (bot) {
        bot.moveTo(0, y);
        y += bot.actualBounds.height;
        w = Math.max(w, bot.actualBounds.width);
      }
      if (sep) {
        sep.width = 8 + w + 8;  // 8 == Placeholder.padding
        sep.alignment = new go.Spot(0.5, 0.5, 0, mid - y/2);
      }
      this.group.diagram.commitTransaction("NestedLayout");
    } else {  // default behavior
      super.doLayout(coll);
    }
  }
}

  initTxns.add(new Test("nested groups", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 80, height: 40 },
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );

      diag.groupTemplate =
        $(go.Group, "Auto",
          { layout: $(NestedLayout) },
          $(go.Shape, "RoundedRectangle",
            { fill: null, parameter1: 20, spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight }),
          $(go.Placeholder),
          $(go.Shape, "LineH", { name: "SEP" })
        );

      diag.groupTemplateMap.add("top",
        $(go.Group,
          { layout: $(go.TreeLayout), background: "lime" },
          $(go.Placeholder, { padding: 8 })
        ));

      diag.groupTemplateMap.add("bottom",
        $(go.Group,
          { layout: $(go.TreeLayout), background: "cyan" },
          $(go.Placeholder, { padding: 8 })
        ));

      diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", group: -2 },
        { key: 2, text: "Beta", color: "orange", group: -2 },
        { key: 3, text: "Gamma", color: "lightgreen", group: -3 },
        { key: 4, text: "Delta", color: "pink", group: -3 },
        { key: 5, text: "Epsilon", color: "yellow", group: -3 },
        { key: -1, text: "GROUP", isGroup: true },
        { key: -2, isGroup: true, group: -1, category: "top" },
        { key: -3, isGroup: true, group: -1, category: "bottom" }
      ],
      [
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 3, to: 5 }
      ]);

      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.history.count === 0, "should have no UndoManager history");

      var gamma = diag.findNodeForKey(3);
      test.assert(gamma && gamma.location.equalsApprox(new go.Point(17, 94.5)));
      diag.commit(function(diag) {
        gamma.location = new go.Point(-20, -50);  // does this invalidate the layout and cause the nested group to move?
      }, "moved gamma");
    },
    function(test) {
      var diag = test.diagram;
      var mgr = diag.undoManager;
      var gamma = diag.findNodeForKey(3);
      test.assert(gamma && gamma.location.equalsApprox(new go.Point(8, 64)), "outer group layout didn't run and reposition the bottom group");

      test.assert(mgr.history.count === 1, "should have only one Transaction in history");
      test.assert(mgr.history.get(0).name === "moved gamma", "transaction name should be 'moved gamma'")

      // diag.commit(function(diag) {
      //   gamma.location = new go.Point(300, 200);  // does this invalidate the layout and cause the nested group to move?
      // }, "moved gamma again");
      var start = gamma.actualBounds.center;
      var end = new go.Point(300 + gamma.actualBounds.width/2, 200 + gamma.actualBounds.height/2);
      test.mouseDown(start);
      test.mouseMove(new go.Point((end.x-start.x*3)/4, (end.y-start.y*3)/4));
      test.mouseMove(new go.Point((end.x-start.x)/2, (end.y-start.y)/2));
      test.mouseMove(new go.Point((end.x*3-start.x)/4, (end.y*3-start.y)/4));
      test.mouseUp(end);

      test.assert(gamma && gamma.location.equalsApprox(new go.Point(143.5, 85.5)), "outer group layout didn't run and reposition the bottom group again");

      test.assert(mgr.history.count === 2, "should have only one Transaction in history");
      test.assert(mgr.history.get(0).name === "moved gamma", "transaction name should be 'moved gamma'")
      test.assert(mgr.history.get(1).name === "Move", "transaction name should be 'Move'")
      test.assert(mgr.historyIndex === 1, "not at historyIndex 1")

      test.assert(mgr.canUndo() && !mgr.canRedo(), "should be able to undo")
      mgr.undo();
      test.assert(mgr.historyIndex === 0, "undo didn't set historyIndex 0")

      test.assert(mgr.canUndo() && mgr.canRedo(), "should be able to undo once more")
      mgr.undo();
      test.assert(mgr.historyIndex === -1, "undo didn't set historyIndex -1")

      test.assert(!mgr.canUndo() && mgr.canRedo(), "should be at start of history")
      mgr.undo();
      test.assert(mgr.historyIndex === -1, "undo didn't leave at historyIndex -1")

      test.assert(!mgr.canUndo() && mgr.canRedo(), "should still be at start of history")
      mgr.redo();
      test.assert(mgr.historyIndex === 0, "redo didn't set historyIndex 0")

      test.assert(mgr.canUndo() && mgr.canRedo(), "should be able to redo once more")
      mgr.redo();
      test.assert(mgr.historyIndex === 1, "redo didn't set historyIndex 1")

      test.assert(mgr.canUndo() && !mgr.canRedo(), "should be at end of history")
      mgr.redo();
      test.assert(mgr.historyIndex === 1, "redo didn't leave at historyIndex 1")

      test.assert(mgr.canUndo() && !mgr.canRedo(), "should still be at end of history")
    }
  ));

  initTxns.add(new Test("nested groups 2", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 80, height: 40 },
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );

      diag.groupTemplate =
        $(go.Group, "Auto",
          { layout: $(go.TreeLayout) },
          $(go.Shape, { fill: null }),
          $(go.Placeholder, { padding: 8 })
        );

      diag.undoManager.isEnabled = true;

      diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", group: -2 },
        { key: 2, text: "Beta", color: "orange", group: -2 },
        { key: 3, text: "Gamma", color: "lightgreen", group: -3 },
        { key: 4, text: "Delta", color: "pink", group: -3 },
        { key: 5, text: "Epsilon", color: "yellow", group: -3 },
        { key: -1, isGroup: true },
        { key: -2, isGroup: true, group: -1 },
        { key: -3, isGroup: true, group: -1 }
      ],
      [
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 3, to: 5 }
      ]);

      test.assert(diag.undoManager.history.count === 0, "should have no UndoManager history");
    },
    function(test) {
      var diag = test.diagram;
      var mgr = diag.undoManager;
      var gamma = diag.findNodeForKey(3);
      test.assert(gamma && gamma.location.equalsApprox(new go.Point(17, 114)), "didn't do initial layouts");
      test.assert(mgr.history.count === 0, "should have zero Transactions in history");
      diag.commit(function(diag) {
        diag.remove(diag.findNodeForKey(4));
      }, "removed Delta");
      test.assert(gamma && gamma.location.equalsApprox(new go.Point(17, 84)), "didn't do initial layouts");
      test.assert(mgr.history.count === 1 && mgr.history.get(0).name === "removed Delta", "should have one 'removed Delta' Transaction in history, not " + mgr.history.count + " with name: " + mgr.history.get(0).name);
    }
  ));

  initTxns.add(new Test("groups visible", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 80, height: 40 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
          $(go.Shape,
            { fill: "white", portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8, editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diag.groupTemplate =
        $(go.Group, "Spot",
          {
            selectionObjectName: "BODY",
            layout: $(go.GridLayout, { wrappingColumn: 1 }),
            computesBoundsAfterDrag: true
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Panel, "Auto",
            { name: "BODY" },
            $(go.Shape, //"RoundedRectangle",
              {
                fill: "gray",
                portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                parameter1: 20, spot1: new go.Spot(0, 0, 5, 5), spot2: new go.Spot(1, 1, -5, -5)
              }),
            $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 8 }),
            $(go.TextBlock,
              { font: "bold 14pt sans-serif", minSize: new go.Size(150, NaN), textAlign: "center" },
              new go.Binding("text"),
              new go.Binding("visible", "collapsed"))
          ),
          $("Button",
            {
              name: "BUTTON",
              alignment: go.Spot.TopRight, alignmentFocus: go.Spot.TopRight,
              click: function(e, button) {
                var g = button.part;
                e.diagram.commit(function(diag) {
                  var hide = !g.data.collapsed;
                  g.memberParts.each(function(mem) {
                    if (mem instanceof go.Group) mem.visible = !hide;
                  });
                  diag.model.set(g.data, "collapsed", hide);
                }, "toggle nested group visible")
              }
            },
            $(go.Shape, "TriangleUp", { width: 8, height: 6 },
              new go.Binding("figure", "collapsed", function(c) { return c ? "TriangleDown" : "TriangleUp"; }))
          )
        );

      diag.groupTemplateMap.add("top",
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout),
            selectable: false,
            computesBoundsIncludingLinks: false,
            computesBoundsAfterDrag: true,
            handlesDragDropForMembers: true,  // don't need to define handlers on Nodes and Links
            mouseDrop: function(e, grp) {  // add dropped nodes as members of the group
              var ok = grp.addMembers(grp.diagram.selection, true);
              if (!ok) grp.diagram.currentTool.doCancel();
            }
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("visible", "containingGroup", function(cg) { return cg ? !cg.data.collapsed : true; }).ofObject(),
          $(go.Shape, //"RoundedTopRectangle",
            { parameter1: 20, fill: "lightgreen" }),
          $(go.TextBlock,
            { alignment: go.Spot.Top },
            new go.Binding("text")),
          $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 4 })
        ));

      diag.groupTemplateMap.add("bottom",
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout),
            selectable: false,
            computesBoundsIncludingLinks: false,
            computesBoundsAfterDrag: true,
            handlesDragDropForMembers: true,  // don't need to define handlers on Nodes and Links
            mouseDrop: function(e, grp) {  // add dropped nodes as members of the group
              var ok = grp.addMembers(grp.diagram.selection, true);
              if (!ok) grp.diagram.currentTool.doCancel();
            }
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("visible", "containingGroup", function(cg) { return cg ? !cg.data.collapsed : true; }).ofObject(),
          $(go.Shape, //"RoundedBottomRectangle",
            { parameter1: 20, fill: "lightblue" }),
          $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 4 })
        ));

      diag.linkTemplate =
        $(go.Link,
          new go.Binding("points").makeTwoWay(),
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      diag.model = new go.GraphLinksModel(
      [
        { key: 0, text: "Zero", loc: "-80 -80" },
        { key: 1, text: "Alpha", color: "lightblue", group: -2 },
        { key: 2, text: "Beta", color: "orange", group: -2 },
        { key: 3, text: "Gamma", color: "lightgreen", group: -3 },
        { key: 4, text: "Delta", color: "pink", group: -3 },
        { key: 5, text: "Epsilon", color: "yellow", group: -3 },
        { key: -1, text: "GROUP", isGroup: true },
        { key: -2, text: "top", isGroup: true, group: -1, category: "top" },
        { key: -3, text: "bottom", isGroup: true, group: -1, category: "bottom" }
      ],
      [
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 3, to: 5 },
        { from: 0, to: 1 }
      ]);

      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var link = diag.findLinkForData(diag.model.linkDataArray[3]);
      test.assertLinkPoints(link, [new go.Point(-20, -40), new go.Point(37, 17)] );

      var group = diag.findNodeForKey(-1);
      var but = group.findObject("BUTTON");
      var butpt = but.getDocumentPoint(go.Spot.Center);
      test.mouseDown(butpt, { timestamp: 0 });  // click BUTTON
      test.mouseUp(butpt, { timestamp: 400 });
    },
    function(test) {
      var diag = test.diagram;
      var link = diag.findLinkForData(diag.model.linkDataArray[3]);

      test.assertLinkPoints(link, [new go.Point(-8, -40), new go.Point(55.5, 0)] );

      var group = diag.findNodeForKey(-1);
      var but = group.findObject("BUTTON");
      var butpt = but.getDocumentPoint(go.Spot.Center);

      test.mouseDown(butpt, { timestamp: 0 });  // click BUTTON again
      test.mouseUp(butpt, { timestamp: 400 });

      test.assertLinkPoints(link, [new go.Point(-20, -40), new go.Point(37, 17)] );
    }
  ));

  initTxns.add(new Test("collapsed groups", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 80, height: 40 },
          $(go.Shape,
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );

      diag.groupTemplate =
        $(go.Group, "Auto",
          { fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides },
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          $(go.Shape,
            new go.Binding("fill", "color")),
          $(go.Panel, "Vertical",
            $(go.Panel, "Horizontal",
              { margin: 5, width: 60, height: 30 },
              $("SubGraphExpanderButton"),
              $(go.TextBlock,
                new go.Binding("text"))
            ),
            $(go.Placeholder, { padding: 10, background: "white" })
          )
        );

      diag.model = new go.GraphLinksModel([
          { key: 91, text: "Grid2", color: "lightyellow", isGroup: true, isSubGraphExpanded: false },
          { key: 11, text: "11", color: "orange", isGroup:true, group: 91 },
          { key: 90, text: "Grid1", color: "lightblue", isGroup: true, isSubGraphExpanded: false },
          {  key: 2, text: "2", color: "lightgreen", isGroup:true, group: 90 },
          {  key: 7, text: "Node7", color: "pink", group: 2 },
          {  key: 9, text: "Node9", color: "lightblue", group: 11 }
        ],
        [
          { from: 7, to: 9 }
        ]);

    },
    function(test) {
      var diag = test.diagram;
      var g2 = diag.findNodeForKey(91);
      diag.commit(function(diag) {
        diag.moveParts([g2], new go.Point(-100, 100), false);
      }, "moved Grid2");
      var link = diag.links.first();
      test.assert(link && Math.abs(link.getPoint(0).x - link.getPoint(3).x) > 80, "link route isn't long enough")
    }
  ))


  var routeTests = new TestCollection("Routing");
  v1.add(routeTests);

  routeTests.add(new Test("collapsed group without links", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout);
      diag.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout),
            computesBoundsIncludingLinks: false
          },
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "lightgray" }),
          $(go.Panel, "Vertical", { margin: 4 },
            $("SubGraphExpanderButton"),
            $(go.Placeholder, { padding: 10 })
          )
        );

      diag.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock, { margin: 8 },
            new go.Binding("text"))
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray:
            [
              { key: 3, text: "Gamma", group: 5, loc: "0 0" },
              { key: 4, text: "Delta", group: 5, loc: "50 150"},
              { key: 5, text: "Group", isGroup: true, isSubGraphExpanded: false,
                loc: "-10 -10"
              },
            ],
          linkDataArray:
            [
              { from: 3, frompid: "out2", to: 4, topid: "in1" }
            ]
        });
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(group && !group.isSubGraphExpanded, "group should start off collapsed");
      test.assert(link && link.points.count === 0, "shouldn't have routed non-visible member link of collapsed group");

      diag.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(link.points.count > 0, "had better have routed the link when group was expanded")
      var n3 = diag.findNodeForKey(3);
      var n4 = diag.findNodeForKey(4);
      test.assert(n3 && n4 && Math.abs(n4.location.y - n3.location.y) < 1, "shouldn't have laid out the subgraph")
    }
  ));

  routeTests.add(new Test("collapsed group not isOngoing without links", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout, { isOngoing: false });
      diag.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout, { isOngoing: false }),
            computesBoundsIncludingLinks: false
          },
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "lightgray" }),
          $(go.Panel, "Vertical", { margin: 4 },
            $("SubGraphExpanderButton"),
            $(go.Placeholder, { padding: 10 })
          )
        );

      diag.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock, { margin: 8 },
            new go.Binding("text"))
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray:
            [
              { key: 3, text: "Gamma", group: 5, loc: "0 0" },
              { key: 4, text: "Delta", group: 5, loc: "50 150"},
              { key: 5, text: "Group", isGroup: true, isSubGraphExpanded: false,
                loc: "-10 -10"
              },
            ],
          linkDataArray:
            [
              { from: 3, frompid: "out2", to: 4, topid: "in1" }
            ]
        });
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(group && !group.isSubGraphExpanded, "group should start off collapsed");
      test.assert(link && link.points.count === 0, "shouldn't have routed non-visible member link of collapsed group");
      diag.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(link.points.count > 0, "had better have routed the link when group was expanded")
      var n3 = diag.findNodeForKey(3);
      var n4 = diag.findNodeForKey(4);
      test.assert(n3 && n4 && n4.location.y - n3.location.y >= 150, "shouldn't have laid out the subgraph")
    }
  ));

  routeTests.add(new Test("collapsed group", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout);
      diag.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout)
          },
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "lightgray" }),
          $(go.Panel, "Vertical", { margin: 4 },
            $("SubGraphExpanderButton"),
            $(go.Placeholder, { padding: 10 })
          )
        );

      diag.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock, { margin: 8 },
            new go.Binding("text"))
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray:
            [
              { key: 3, text: "Gamma", group: 5, loc: "0 0" },
              { key: 4, text: "Delta", group: 5, loc: "50 150"},
              { key: 5, text: "Group", isGroup: true, isSubGraphExpanded: false,
                loc: "-10 -10"
              },
            ],
          linkDataArray:
            [
              { from: 3, frompid: "out2", to: 4, topid: "in1" }
            ]
        });
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(group && !group.isSubGraphExpanded, "group should start off collapsed");
      test.assert(link && link.points.count === 0, "shouldn't have routed non-visible member link of collapsed group");

      diag.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(link.points.count > 0, "had better have routed the link when group was expanded")
      var n3 = diag.findNodeForKey(3);
      var n4 = diag.findNodeForKey(4);
      test.assert(n3 && n4 && Math.abs(n4.location.y - n3.location.y) < 1, "shouldn't have laid out the subgraph")
    }
  ));

  routeTests.add(new Test("collapsed group not isOngoing", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout, { isOngoing: false });
      diag.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout, { isOngoing: false })
          },
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "lightgray" }),
          $(go.Panel, "Vertical", { margin: 4 },
            $("SubGraphExpanderButton"),
            $(go.Placeholder, { padding: 10 })
          )
        );

      diag.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock, { margin: 8 },
            new go.Binding("text"))
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray:
            [
              { key: 3, text: "Gamma", group: 5, loc: "0 0" },
              { key: 4, text: "Delta", group: 5, loc: "50 150"},
              { key: 5, text: "Group", isGroup: true, isSubGraphExpanded: false,
                loc: "-10 -10"
              },
            ],
          linkDataArray:
            [
              { from: 3, frompid: "out2", to: 4, topid: "in1" }
            ]
        });
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(group && !group.isSubGraphExpanded, "group should start off collapsed");
      test.assert(link && link.points.count === 0, "shouldn't have routed non-visible member link of collapsed group");
      diag.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diag = test.diagram;
      var group = diag.findNodeForKey(5);
      var link = diag.links.first();
      test.assert(link.points.count > 0, "had better have routed the link when group was expanded")
      var n3 = diag.findNodeForKey(3);
      var n4 = diag.findNodeForKey(4);
      test.assert(n3 && n4 && n4.location.y - n3.location.y >= 150, "shouldn't have laid out the subgraph")
    }
  ));

  routeTests.add(new Test("collapsed group AllSides", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 50, height: 25, fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, { fill: "lightgray" }),
          $(go.TextBlock, new go.Binding("text", "key"))
        );
      diag.groupTemplate =
        $(go.Group, "Auto",
          { isSubGraphExpanded: false },
          { fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides },
          $(go.Shape, { fill: "whitesmoke" }),
          $(go.Placeholder, { padding: 20 }),
          $("SubGraphExpanderButton", { alignment: go.Spot.TopRight })
        );
      diag.linkTemplate.routing = go.Link.Orthogonal;
      diag.model = new go.GraphLinksModel([
        { key: 10, isGroup: true },
        { key: 1, group: 10, loc: "0 0" },
        { key: 2, loc: "100 100" }
      ], [
        { from: 1, to: 2 },
        { from: 1, to: 2 }
      ]);
    },
    function(test) {
      var diag = test.diagram;
      test.assertAllLinkPoints([
        [new go.Point(17.5,5.8), new go.Point(35.5,5.8), new go.Point(133.3,5.8), new go.Point(133.3,43.9), new go.Point(133.3,82.0), new go.Point(133.3,100.0)],
        [new go.Point(17.5,11.7), new go.Point(27.5,11.7), new go.Point(116.7,11.7), new go.Point(116.7,50.8), new go.Point(116.7,90.0), new go.Point(116.7,100.0)]
      ]);

      diag.commit(function(diag) {
        var n2 = diag.findNodeForKey(2);
        n2.location = new go.Point(-120, -80);
      });
      //test.dumpLinkPoints();
      test.assertAllLinkPoints([
        [new go.Point(0.0,5.8), new go.Point(-10.0,5.8), new go.Point(-86.7,5.8), new go.Point(-86.7,-19.6), new go.Point(-86.7,-45.0), new go.Point(-86.7,-55.0)],
        [new go.Point(0.0,11.7), new go.Point(-18.0,11.7), new go.Point(-103.3,11.7), new go.Point(-103.3,-12.7), new go.Point(-103.3,-37.0), new go.Point(-103.3,-55.0)]
      ]);
    }
  ));

  routeTests.add(new Test("JumpOver", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.layout = $(go.TreeLayout, { angle: 90, isOngoing: false, arrangement: go.TreeLayout.ArrangementHorizontal });

      diag.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout, { isOngoing: false})
          },
          new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle", { fill: "whitesmoke" }),
          $(go.Panel, "Vertical", { margin: 4 },
            $(go.Panel, "Horizontal",
              $("SubGraphExpanderButton"),
              $(go.TextBlock, { margin: 4 },
                new go.Binding("text", "key"))
            ),
            $(go.Placeholder, { padding: new go.Margin(0, 10) })
          )
        );

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(50, 30) },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle", { fill: "white" }),
          $(go.TextBlock, { margin: 7 },
            new go.Binding("text", "key"))
      );

      diag.linkTemplate =
        $(go.Link,
          // the JumpOver curve caused premature routing of nearby links
          { routing: go.Link.Orthogonal, curve: go.Link.JumpOver },
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      diag.model = $(go.GraphLinksModel,
        { nodeDataArray: [
          {
            "group": "12",
            "key": "8",
            "loc": "-985 488",
          },
          {
            "group": "14",
            "key": "15",
            "loc": "-967 668",
          },
          {
            "key": "7",
            "loc": "-675 338",
            "group": "11"
          },
          {
            "group": "13",
            "isGroup": true,
            "expanded": false,
            "key": "11",
            "loc": "-676 337",
          },
          {
            "group": "11",
            "key": "16",
            "loc": "-629 450",
          },
          {
            "group": "17",
            "key": "18",
            "loc": "-632 628",
          },
          {
            "group": "11",
            "isGroup": true,
            "expanded": false,
            "key": "17",
            "loc": "-633 627",
          },
          {
            "group": "17",
            "key": "19",
            "loc": "-605 787",
          },
          {
            "group": "17",
            "key": "9",
            "loc": "-579 975",
          }
        ],
        linkDataArray: [
          {
            "from": "18",
            "frompid": "out1",
            "to": "19",
            "topid": "in1"
          },
          {
            "from": "16",
            "frompid": "out1",
            "to": "18",
            "topid": "in1"
          },
          {
            "from": "8",
            "frompid": "out1",
            "to": "15",
            "topid": "in1"
          },
          {
            "from": "7",
            "frompid": "out2",
            "to": "16",
            "topid": "in1"
          }
        ]
      });
    },
    function(test) {
      var diag = test.diagram;
      var routed = 0;
      diag.links.each(function(l) { if (l.points.count > 0) routed++; });
      test.assert(routed === 1, "should not have routed any links within the collapsed groups");

      diag.commandHandler.expandSubGraph(diag.findNodeForKey('11'));
    },
    function(test) {
      var diag = test.diagram;
      var n7 = diag.findNodeForKey('7');
      var n16 = diag.findNodeForKey('16');
      var routed = 0;
      diag.links.each(function(l) { if (l.points.count > 0) routed++; });
      test.assert(routed === 3, "should not have routed any links within the remaining collapsed group");
      var link = n7.findLinksTo(n16).first();
      test.assert(link && link.points.count === 6 && link.points.elt(5).y-link.points.elt(0).y > 50, "didn't route inner link correctly");
    }
  ));

  routeTests.add(new Test("Bundle add", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node,
          { width: 50, height: 50, locationSpot: go.Spot.Center, background: "lightgray" },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock,
            { position: new go.Point(10, 10) },
            new go.Binding("text", "key"))
        );

      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          new go.Binding("points")
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1, loc: "0 0" },
            { key: 2, loc: "200 50" },
            { key: 3, loc: "100 100" }
          ],
          linkDataArray: [
            { from: 1, to: 3, points: [25.0,25.0, 35.0,65.0, 75.0,75.0] },
            { from: 1, to: 2, points: [25.0,6.3, 90.4,-11.4, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 100.0,25.0, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 196.6,98.6, 175.0,43.8] },
          ]
        });
    },
    function(test) {
      var diag = test.diagram;
      // make sure link routes are properly restored on loading
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(90.4,-11.4), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(100.0,25.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)]
      ]);

      // add a link
      diag.model.commit(function(m) {
        m.addLinkData({ from: 1, to: 2 });
      });

      // make sure all links in the bundle are re-routed,
      // but the link from 1 to 3 was not re-routed
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(105.1,4.6), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(101.7,18.2), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(98.3,31.8), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(94.9,45.4), new go.Point(175.0,43.8)]
      ]);
    }
  ));

  routeTests.add(new Test("Bundle add no invalidate", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node,
          { width: 50, height: 50, locationSpot: go.Spot.Center, background: "lightgray" },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock,
            { position: new go.Point(10, 10) },
            new go.Binding("text", "key"))
        );

      diag.linkTemplate =
        $(go.Link,
          { curviness: 0 },
          $(go.Shape),
          new go.Binding("points")
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1, loc: "0 0" },
            { key: 2, loc: "200 50" },
            { key: 3, loc: "100 100" }
          ],
          linkDataArray: [
            { from: 1, to: 3, points: [25.0,25.0, 35.0,65.0, 75.0,75.0] },
            { from: 1, to: 2, points: [25.0,6.3, 90.4,-11.4, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 110.0,15.0, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 196.6,98.6, 175.0,43.8] },
          ]
        });
    },
    function(test) {
      var diag = test.diagram;
      // make sure link routes are properly restored on loading
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(90.4,-11.4), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(110.0,15.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)]
      ]);

      // add a link
      diag.model.commit(function(m) {
        m.addLinkData({ from: 1, to: 2 });
      });

      // make sure no other links in the bundle are re-routed
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(90.4,-11.4), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(110.0,15.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(100.0,25.0), new go.Point(175.0,43.8)]
      ]);
    }
  ));

  routeTests.add(new Test("Bundle remove", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node,
          { width: 50, height: 50, locationSpot: go.Spot.Center, background: "lightgray" },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock,
            { position: new go.Point(10, 10) },
            new go.Binding("text", "key"))
        );

      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          new go.Binding("points")
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1, loc: "0 0" },
            { key: 2, loc: "200 50" },
            { key: 3, loc: "100 100" }
          ],
          linkDataArray: [
            { from: 1, to: 3, points: [25.0,25.0, 35.0,65.0, 75.0,75.0] },
            { from: 1, to: 2, points: [25.0,6.3, 90.4,-11.4, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 100.0,25.0, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 196.6,98.6, 175.0,43.8] },
          ]
        });
    },
    function(test) {
      var diag = test.diagram;
      // make sure link routes are properly restored on loading
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(90.4,-11.4), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(100.0,25.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)]
      ]);

      // add a link
      diag.model.commit(function(m) {
        m.removeLinkData(m.linkDataArray[1]);
      });

      // make sure all links in the bundle are re-routed,
      // but the link from 1 to 3 was not re-routed
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(101.7,18.2), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(98.3,31.8), new go.Point(175.0,43.8)]
      ]);
    }
  ));

  routeTests.add(new Test("Bundle remove no invalidate", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node,
          { width: 50, height: 50, locationSpot: go.Spot.Center, background: "lightgray" },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock,
            { position: new go.Point(10, 10) },
            new go.Binding("text", "key"))
        );

      diag.linkTemplate =
        $(go.Link,
          { curviness: 0 },
          $(go.Shape),
          new go.Binding("points")
        );

      diag.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1, loc: "0 0" },
            { key: 2, loc: "200 50" },
            { key: 3, loc: "100 100" }
          ],
          linkDataArray: [
            { from: 1, to: 3, points: [25.0,25.0, 35.0,65.0, 75.0,75.0] },
            { from: 1, to: 2, points: [25.0,6.3, 90.4,-11.4, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 110.0,15.0, 175.0,43.8] },
            { from: 1, to: 2, points: [25.0,6.3, 196.6,98.6, 175.0,43.8] },
          ]
        });
    },
    function(test) {
      var diag = test.diagram;
      // make sure link routes are properly restored on loading
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(90.4,-11.4), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(110.0,15.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)]
      ]);

      // add a link
      diag.model.commit(function(m) {
        m.removeLinkData(m.linkDataArray[1]);
      });

      // make sure no other links in the bundle are re-routed
      test.assertAllLinkPoints([
        [new go.Point(25.0,25.0), new go.Point(35.0,65.0), new go.Point(75.0,75.0)],
        [new go.Point(25.0,6.3), new go.Point(110.0,15.0), new go.Point(175.0,43.8)],
        [new go.Point(25.0,6.3), new go.Point(196.6,98.6), new go.Point(175.0,43.8)]
      ]);
    }
  ));

  // because of https://github.com/NorthwoodsSoftware/GoJS/issues/211
  routeTests.add(new Test("ensure links invalidate", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      function getLinkTemplate() {
        return new go.Link({
          toShortLength: 3,
        })
          .bind(twoWayBindingPointsWithClonePoints())
          .add(
            new go.Shape({
              strokeWidth: 2,
            }).bind('stroke', 'color')
          )
          .add(
            new go.Shape({
              toArrow: 'Standard',
              stroke: null,
            }).bind('fill', 'color')
          );
      }

      function simpleBindingPoints() {
        return new go.Binding('points', 'points');
      }

      function twoWayBindingPoints() {
        return new go.Binding('points', 'points').makeTwoWay();
      }

      function twoWayBindingPointsWithClonePoints() {
        return new go.Binding('points', 'points', (points) => {
          if (points == null || points.length < 1) {
            return [];
          }

          return points.map((point) => new go.Point(point.x, point.y));
        }).makeTwoWay((points) => {
          if (points == null || points.length < 1) {
            return [];
          }

          return points.map((point) => new go.Point(point.x, point.y));
        });
      }

      function getNodeTemplate() {
        return new go.Node('Vertical').add(
          new go.Panel('Auto', {})
            .add(
              new go.Shape('RoundedRectangle', {
                strokeWidth: 0,
                width: 50,
                height: 50,
              }).bind('fill', 'color')
            )
            .add(
              new go.TextBlock({
                margin: 8,
                width: 50,
                height: 15,
                font: 'bold 14px sans-serif',
                stroke: '#333',
              }).bind('text', 'key')
            )
        );
      }

      function getGroupTemplate() {
        return new go.Group('Vertical', {
          computesBoundsIncludingLinks: false,
        })
          .add(new go.TextBlock().bind('text', 'text'))
          .add(
            new go.Panel('Auto')
              .add(
                new go.Shape('Rectangle', {
                  fill: null,
                  stroke: 'gray',
                  strokeWidth: 3,
                  portId: '',
                })
              )
              .add(
                new go.Placeholder({
                  margin: 10,
                  background: null,
                })
              )
          );
      }

      diag.nodeTemplate = getNodeTemplate();
      diag.linkTemplate = getLinkTemplate();
      diag.groupTemplate = getGroupTemplate();
      const groupKey = 'group';

      const points = undefined;
      const nodeGroupData = [
        {
          key: 'nodeA',
          group: groupKey,
          category: 'standard',
          color: 'green',
        },
        {
          key: 'nodeB',
          group: groupKey,
          category: 'standard',
          color: 'red',
        },
        {
          key: 'nodeC',
          group: groupKey,
          category: 'standard',
          color: 'yellow',
        },
        {
          key: groupKey,
          isGroup: true,
        },
      ];
      const linkData = [
        {
          key: 'linkAB',
          color: 'red',
          from: 'nodeA',
          to: 'nodeB',
          points: points,
        },
        {
          key: 'linkBC',
          color: 'yellow',
          from: 'nodeB',
          to: 'nodeC',
          points: points,
        },
        {
          key: 'linkCA',
          color: 'green',
          from: 'nodeC',
          to: 'nodeA',
          points: points,
        },
      ];

      diag.startTransaction('initialize_data');
      diag.model.addNodeDataCollection(nodeGroupData);
      diag.model.addLinkDataCollection(linkData);
      diag.commitTransaction('initialize_data');


    },
    function(test) {
      var diag = test.diagram;
      const groupKey = 'group';
      function applyCircularLayout() {
        setGroupLayout(new go.CircularLayout({ spacing: 100 }));
      }
      function setGroupLayout(layout) {
        const transactionName = 'set_group_layout';
        const group = diag.findNodeForKey(groupKey);
        diag.startTransaction(transactionName);
        group.layout = layout;
        group.layout.isValidLayout = false;
        diag.commitTransaction(transactionName);
      }

      applyCircularLayout();

      // test.dumpLinkPoints();
      // // make sure no other links in the bundle are re-routed
      test.assertAllLinkPoints([
        [new go.Point(36.5,75.6), new go.Point(36.5,166.8)],
        [new go.Point(61.5,177.3), new go.Point(133.8,135.6)],
        [new go.Point(133.8,106.7), new go.Point(61.5,65.0)]
      ]);
    }
  ));

})();