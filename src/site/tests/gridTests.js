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
  // #region Diagram Initialization

  // define the Node template
  var archnode = new go.Node(go.Panel.Spot);
  archnode.desiredSize = new go.Size(20, 20);
  archnode.locationSpot = go.Spot.Center;
  var ns = new go.Shape();
  ns.figure = 'Ellipse';
  ns.fill = 'lightgray';
  ns.stroke = 'black';
  ns.stretch = go.GraphObject.Fill;
  ns.alignment = go.Spot.Center;
  archnode.add(ns);
  var nt = new go.TextBlock();
  nt.alignment = go.Spot.Center;
  nt.bind(new go.Binding('text', 'text'));
  archnode.add(nt);
  archnode.bind(new go.Binding('desiredSize', 'size', theDataSizeConverter));
  archnode.bind(new go.Binding('text', 'text'));

  // #endregion

  // #region Setup
  function CommonSetup(test) {
    test.diagram.nodeTemplateMap.add('', archnode);
    var m = new go.Model();
    m.nodeDataArray = [
      { key: 7, text: "n7" },
      { key: 5, text: "n5" },
      { key: 2, text: "n2" },
      { key: 4, text: "n4" },
      { key: 3, text: "n3" },
      { key: 6, text: "n6" },
      { key: 1, text: "n1" },
      { key: 8, text: "n8" }
    ];
    test.diagram.model = m;
  };

  function VariedSizeSetup(test) {
    test.diagram.nodeTemplateMap.add('', archnode);
    var m = new go.Model();
    m.nodeDataArray = [
      { key: 7, text: "n7", size: [100, 100] },
      { key: 5, text: "n5", size: [120, 140] },
      { key: 2, text: "n2", size: [130, 40] },
      { key: 4, text: "n4", size: [20, 110] },
      { key: 3, text: "n3", size: [70, 50] },
      { key: 6, text: "n6", size: [20, 20] },
      { key: 1, text: "n1", size: [30, 40] },
      { key: 8, text: "n8", size: [60, 90] }
    ];
    test.diagram.model = m;
  };

  function theDataSizeConverter(size) {
    var desSize = new go.Size();
    desSize.width = size[0];
    desSize.height = size[1];
    return desSize;
  }
  // #endregion

  // #region Alignment Tests
  function LocationRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.wrappingWidth = Infinity;
    layout.alignment = go.GridLayout.Location;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function PositionRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.wrappingWidth = Infinity;
    layout.alignment = go.GridLayout.Position;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function LocationCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(50, 20),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function PositionCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(30, 0),
      new go.Point(60, 0),
      new go.Point(90, 0),
      new go.Point(0, 30),
      new go.Point(30, 30),
      new go.Point(60, 30),
      new go.Point(90, 30)
    ];
    CheckNodes(points, test);
  }

  function LocationVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(75, -20),
      new go.Point(245, -25),
      new go.Point(410, -55),
      new go.Point(-60, 65),
      new go.Point(130, 125),
      new go.Point(230, 85),
      new go.Point(390, 90)
    ];
    /*
      Node n5 at Point(-60,65), not Point(-60,80)
      Node n6 at Point(130,125), not Point(130,140)
      Node n7 at Point(230,85), not Point(230,100)
      Node n8 at Point(390,90), not Point(390,105)
    */
    CheckNodes(points, test);
  }

  function PositionVSCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(140, 0),
      new go.Point(280, 0),
      new go.Point(420, 0),
      new go.Point(0, 150),
      new go.Point(140, 150),
      new go.Point(280, 150),
      new go.Point(420, 150)
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Arrangement Tests
  function LTRRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.wrappingWidth = Infinity;
    layout.arrangement = go.GridLayout.LeftToRight;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function RTLRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.arrangement = go.GridLayout.RightToLeft;
    //layout.diagram = test.diagram;  // test that it works without assigning to Diagram.layout
    layout.doLayout(test.diagram);
  }

  function LTRCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(50, 20),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function RTLCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(-40, -10),
      new go.Point(-70, -10),
      new go.Point(-100, -10),
      new go.Point(-10, 20),
      new go.Point(-40, 20),
      new go.Point(-70, 20),
      new go.Point(-100, 20)
    ];
    CheckNodes(points, test);
  }

  function LTRVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(75, -20),
      new go.Point(245, -25),
      new go.Point(410, -55),
      new go.Point(-60, 65),
      new go.Point(130, 125),
      new go.Point(230, 85),
      new go.Point(390, 90)
      /*
      Node n5 at Point(-60,65), not Point(-60,80)
      Node n6 at Point(130,125), not Point(130,140)
      Node n7 at Point(230,85), not Point(230,100)
      Node n8 at Point(390,90), not Point(390,105)
      */
    ];
    CheckNodes(points, test);
  }

  function RTLVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(-205, -20),
      new go.Point(-315, -25),
      new go.Point(-430, -55),
      new go.Point(-60, 65),
      new go.Point(-150, 125),
      new go.Point(-330, 85),
      new go.Point(-450, 90)
      /*
      Node n5 at Point(-60,65), not Point(-60,80)
      Node n6 at Point(-150,125), not Point(-150,140)
      Node n7 at Point(-330,85), not Point(-330,100)
      Node n8 at Point(-450,90), not Point(-450,105)
      */
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Wrapping Tests
  function WrapViewboundsRun(test) {
    var layout = new go.GridLayout();
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function WrapWidthRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingWidth = 60;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function WrapColumnRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 2;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function WrapViewboundsCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(110, -10),
      new go.Point(140, -10),
      new go.Point(170, -10),
      new go.Point(200, -10)
    ];
    CheckNodes(points, test);
  }

  function WrapWidthCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(-10, 50),
      new go.Point(20, 50),
      new go.Point(-10, 80),
      new go.Point(20, 80)
    ];
    CheckNodes(points, test);
  }

  function WrapColumnCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(-10, 50),
      new go.Point(20, 50),
      new go.Point(-10, 80),
      new go.Point(20, 80)
    ];
    CheckNodes(points, test);
  }

  function WrapViewboundsVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(75, -20),
      new go.Point(245, -25),
      new go.Point(410, -55),
      new go.Point(500, -70),
      new go.Point(690, -10),
      new go.Point(790, -50),
      new go.Point(950, -45)
    ];
    CheckNodes(points, test);
  }

  function WrapWidthVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(-65, 30),
      new go.Point(-35, 80),
      new go.Point(-10, 140),
      new go.Point(-60, 260),
      new go.Point(-10, 410),
      new go.Point(-50, 440),
      new go.Point(-30, 550)
      /*
      Node n2 at Point(-65,30), not Point(-65,130)
      Node n3 at Point(-35,80), not Point(-35,275)
      Node n4 at Point(-10,140), not Point(-10,395)
      Node n5 at Point(-60,260), not Point(-60,530)
      Node n6 at Point(-10,410), not Point(-10,740)
      Node n7 at Point(-50,440), not Point(-50,850)
      Node n8 at Point(-30,550), not Point(-30,1005)
      */

    ];
    CheckNodes(points, test);
  }

  function WrapColumnVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(75, -20),
      new go.Point(-35, 60),
      new go.Point(130, 30),
      new go.Point(-60, 150),
      new go.Point(130, 210),
      new go.Point(-50, 300),
      new go.Point(110, 305)
      /*
      Node n3 at Point(-35,60), not Point(-35,125)
      Node n4 at Point(130,30), not Point(130,95)
      Node n5 at Point(-60,150), not Point(-60,230)
      Node n6 at Point(130,210), not Point(130,290)
      Node n7 at Point(-50,300), not Point(-50,400)
      Node n8 at Point(110,305), not Point(110,405)
      */
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region CellSize Tests
  function NoSizeRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function BiggerSizeRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.cellSize = new go.Size(30, 30);
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function SmallerSizeRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.cellSize = new go.Size(10, 10);
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function NoSizeCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(50, 20),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function BiggerSizeCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(30, -10),
      new go.Point(70, -10),
      new go.Point(110, -10),
      new go.Point(-10, 30),
      new go.Point(30, 30),
      new go.Point(70, 30),
      new go.Point(110, 30)
    ];
    CheckNodes(points, test);
  }

  function SmallerSizeCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(30, -10),
      new go.Point(70, -10),
      new go.Point(110, -10),
      new go.Point(-10, 20),
      new go.Point(30, 20),
      new go.Point(70, 20),
      new go.Point(110, 20)
    ];
    CheckNodes(points, test);
  }

  function CSVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(35, -20),
      new go.Point(185, -25),
      new go.Point(270, -55),
      new go.Point(-60, 65),
      new go.Point(70, 125),
      new go.Point(110, 85),
      new go.Point(230, 90)
      /*
        was:
        Node n5 at Point(-60,65), not Point(-60,80)
        Node n6 at Point(70,125), not Point(70,140)
        Node n7 at Point(110,85), not Point(110,100)
        Node n8 at Point(230,90), not Point(230,105)
      */
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Spacing Tests
  function DefaultSpacingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.wrappingWidth = Infinity;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function ExtraSpacingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.wrappingWidth = Infinity;
    layout.spacing = new go.Size(20, 20);
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function DefaultSpacingCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(50, 20),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function ExtraSpacingCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(30, -10),
      new go.Point(70, -10),
      new go.Point(110, -10),
      new go.Point(-10, 30),
      new go.Point(30, 30),
      new go.Point(70, 30),
      new go.Point(110, 30)
    ];
    CheckNodes(points, test);
  }

  function DefaultSpacingVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(75, -20),
      new go.Point(245, -25),
      new go.Point(410, -55),
      new go.Point(-60, 65),
      new go.Point(130, 125),
      new go.Point(230, 85),
      new go.Point(390, 90)
      /*
      Node n5 at Point(-60,65), not Point(-60,80)
      Node n6 at Point(130,125), not Point(130,140)
      Node n7 at Point(230,85), not Point(230,100)
      Node n8 at Point(390,90), not Point(390,105)
      */

    ];
    CheckNodes(points, test);
  }

  function ExtraSpacingVSCheck(test) {
    var points = [
      new go.Point(-15, -20),
      new go.Point(85, -20),
      new go.Point(265, -25),
      new go.Point(440, -55),
      new go.Point(-60, 75),
      new go.Point(140, 135),
      new go.Point(250, 95),
      new go.Point(420, 100)
      /*
      Node n5 at Point(-60,75), not Point(-60,90)
      Node n6 at Point(140,135), not Point(140,150)
      Node n7 at Point(250,95), not Point(250,110)
      Node n8 at Point(420,100), not Point(420,115)
      */

    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Sorting Tests
  function ForwardSortingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.sorting = go.GridLayout.Forward;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function ReverseSortingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.sorting = go.GridLayout.Reverse;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function AscendingSortingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.sorting = go.GridLayout.Ascending;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function DescendingSortingRun(test) {
    var layout = new go.GridLayout();
    layout.wrappingColumn = 4;
    layout.sorting = go.GridLayout.Descending;
    layout.diagram = test.diagram;
    layout.doLayout(test.diagram);
  }

  function ForwardSortingCheck(test) {
    var points = [
      new go.Point(50, 20),
      new go.Point(50, -10),
      new go.Point(-10, 20),
      new go.Point(80, -10),
      new go.Point(20, -10),
      new go.Point(20, 20),
      new go.Point(-10, -10),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function ReverseSortingCheck(test) {
    var points = [
      new go.Point(20, -10),
      new go.Point(20, 20),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(50, 20),
      new go.Point(50, -10),
      new go.Point(80, 20),
      new go.Point(-10, -10)
    ];
    CheckNodes(points, test);
  }

  function AscendingSortingCheck(test) {
    var points = [
      new go.Point(-10, -10),
      new go.Point(20, -10),
      new go.Point(50, -10),
      new go.Point(80, -10),
      new go.Point(-10, 20),
      new go.Point(20, 20),
      new go.Point(50, 20),
      new go.Point(80, 20)
    ];
    CheckNodes(points, test);
  }

  function DescendingSortingCheck(test) {
    var points = [
      new go.Point(80, 20),
      new go.Point(50, 20),
      new go.Point(20, 20),
      new go.Point(-10, 20),
      new go.Point(80, -10),
      new go.Point(50, -10),
      new go.Point(20, -10),
      new go.Point(-10, -10)
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Helper Functions
  function CheckNodes(points, test) {
    var nodes = [];
    var i;
    for (i = 0; i < points.length; i++) {
      nodes[i] = N((i + 1), test);
      CheckNodeLoc(nodes[i], points[i], 'Node n' + (i + 1).toString() + ' at ' + nodes[i].position.toString() + ', not ' + points[i].toString(), test);
    }
  };

  function N(key, test) {
    var model = test.diagram.model;
    var d = model.findNodeDataForKey(key);
    return test.diagram.findNodeForData(d, model);
  };

  function CheckNodeLoc(n, p, msg, test) {
    test.assert(test.isApproxPoint(n.position, p), msg);
  };
  // #endregion

  // GridLayout:
  var root = new TestCollection('GridLayout');
  TestRoot.add(root);

  // #region Alignment TestCollection
  var alignment = new TestCollection('Alignment');
  root.add(alignment);

  alignment.add(new Test('Location', null, CommonSetup, LocationRun, LocationCheck));
  alignment.add(new Test('Position', null, CommonSetup, PositionRun, PositionCheck));

  alignment.add(new Test('Location, varied sizes', null, VariedSizeSetup, LocationRun, LocationVSCheck));
  alignment.add(new Test('Position, varied sizes', null, VariedSizeSetup, PositionRun, PositionVSCheck));
  // #endregion

  // #region Arrangement TestCollection
  var arrangement = new TestCollection('Arrangement');
  root.add(arrangement);

  arrangement.add(new Test('Left to right', null, CommonSetup, LTRRun, LTRCheck));
  arrangement.add(new Test('Right to left', null, CommonSetup, RTLRun, RTLCheck));

  arrangement.add(new Test('Left to right, varied sizes', null, VariedSizeSetup, LTRRun, LTRVSCheck));
  arrangement.add(new Test('Right to left, varied sizes', null, VariedSizeSetup, RTLRun, RTLVSCheck));
  // #endregion

  // #region Wrapping TestCollection
  var wrapping = new TestCollection('Wrapping');
  root.add(wrapping);

  // can't really test no wrappingWidth/Column as it depends on viewportBounds which change

  //wrapping.add(new Test('No wrappingWidth/Column', null, CommonSetup, WrapViewboundsRun, WrapViewboundsCheck));
  wrapping.add(new Test('Width wrapping', null, CommonSetup, WrapWidthRun, WrapWidthCheck));
  wrapping.add(new Test('Column wrapping', null, CommonSetup, WrapColumnRun, WrapColumnCheck));

  function GroupsSetup(test, alignment, arrangement) {
    var diag = test.diagram;
    diag.reset();
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 50, height: 50, locationSpot: go.Spot.Center },
        $(go.Shape, { fill: "lightgray", strokeWidth: 0 }),
        $(go.TextBlock, new go.Binding("text", "key"))
      );
    diag.groupTemplate =
      $(go.Group, "Vertical",
        {
          layout: $(go.GridLayout,
            {
              alignment: alignment,
              arrangement: arrangement,
              wrappingWidth: 100 + ((alignment === go.GridLayout.Location) ? 50 / 2 : 0),  // ??? include the locationSpot offset
              cellSize: new go.Size(5, 5),
              spacing: new go.Size(0, 0)
            })
        },
        $(go.TextBlock, new go.Binding("text", "key")),
        $(go.Placeholder, { padding: 0 },
          new go.Binding("background", "color"))
      );
    diag.layout =
      $(go.GridLayout,
        {
          wrappingWidth: Infinity,
          cellSize: new go.Size(100, 100)
        });
    var nodeDataArray = [
      { key: "G0", isGroup: true, color: "blue" },
      { key: "G1", isGroup: true, color: "green" },
      { key: "G2", isGroup: true, color: "orange" },
      { key: "G3", isGroup: true, color: "red" },
      { group: "G0" }, { group: "G0" }, { group: "G0" }, { group: "G0" }, { group: "G0" },
      { group: "G1" },
      { group: "G2" }, { group: "G1" }, { group: "G1" },
      { group: "G3" }, { group: "G3" }, { group: "G3" }, { group: "G3" }, { group: "G3" }
    ];
    diag.model.nodeDataArray = nodeDataArray;
  }

  function GroupsCheck(test) {
    var diag = test.diagram;
    test.assert(diag.documentBounds.height < 200, "not wrapping all rows within groups?");
    test.assert(diag.findTopLevelGroups().all(function (g) { return g.actualBounds.width <= 100; }), "groups are too wide?");
  }

  wrapping.add(new Test("in Groups location", null,
    function (test) { GroupsSetup(test, go.GridLayout.Location, go.GridLayout.LeftToRight); },
    GroupsCheck
  ));
  wrapping.add(new Test("in Groups location R-L", null,
    function (test) { GroupsSetup(test, go.GridLayout.Location, go.GridLayout.RightToLeft); },
    GroupsCheck
  ));
  wrapping.add(new Test("in Groups position", null,
    function (test) { GroupsSetup(test, go.GridLayout.Position, go.GridLayout.LeftToRight); },
    GroupsCheck
  ));
  wrapping.add(new Test("in Groups position R-L", null,
    function (test) { GroupsSetup(test, go.GridLayout.Position, go.GridLayout.RightToLeft); },
    GroupsCheck
  ));

  //wrapping.add(new Test('No wrappingWidth/Column, varied sizes', null, VariedSizeSetup, WrapViewboundsRun, WrapViewboundsVSCheck));
  wrapping.add(new Test('Width wrapping, varied sizes', null, VariedSizeSetup, WrapWidthRun, WrapWidthVSCheck));
  wrapping.add(new Test('Column wrapping, varied sizes', null, VariedSizeSetup, WrapColumnRun, WrapColumnVSCheck));
  // #endregion

  // #region CellSize TestCollection
  var cellsize = new TestCollection('Cell Size');
  root.add(cellsize);

  cellsize.add(new Test('No cellSize', null, CommonSetup, NoSizeRun, NoSizeCheck));
  cellsize.add(new Test('CellSize greater than node size', null, CommonSetup, BiggerSizeRun, BiggerSizeCheck));
  cellsize.add(new Test('CellSize less than node size', null, CommonSetup, SmallerSizeRun, SmallerSizeCheck));
  cellsize.add(new Test('CellSize with varied node sizes', null, VariedSizeSetup, SmallerSizeRun, CSVSCheck));
  // #endregion

  // #region Spacing TestCollection
  var spacing = new TestCollection('Spacing');
  root.add(spacing);

  spacing.add(new Test('Default', null, CommonSetup, DefaultSpacingRun, DefaultSpacingCheck));
  spacing.add(new Test('Extra', null, CommonSetup, ExtraSpacingRun, ExtraSpacingCheck));

  spacing.add(new Test('Default, varied sizes', null, VariedSizeSetup, DefaultSpacingRun, DefaultSpacingVSCheck));
  spacing.add(new Test('Extra, varied sizes', null, VariedSizeSetup, ExtraSpacingRun, ExtraSpacingVSCheck));
  // #endregion

  // #region Sorting TestCollection
  var sorting = new TestCollection('Sorting');
  root.add(sorting);

  sorting.add(new Test('Forward', null, CommonSetup, ForwardSortingRun, ForwardSortingCheck));
  sorting.add(new Test('Reverse', null, CommonSetup, ReverseSortingRun, ReverseSortingCheck));
  sorting.add(new Test('Ascending', null, CommonSetup, AscendingSortingRun, AscendingSortingCheck));
  sorting.add(new Test('Descending', null, CommonSetup, DescendingSortingRun, DescendingSortingCheck));
  // #endregion

  var layoutBounds = new TestCollection("LayoutBounds");
  root.add(layoutBounds);

  function SetupBounds(test, wrap) {
    var diag = test.diagram;
    diag.reset();
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center, locationObjectName: "BODY" },
        $(go.Panel, "Auto", { name: "BODY", height: 32 },
          new go.Binding("width"),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8, editable: true },
            new go.Binding("text").makeTwoWay())
        ),
        $(go.TextBlock, "top", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom }),
        $(go.TextBlock, "left", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right }),
        $(go.TextBlock, "rightright", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left }),
        $(go.TextBlock, "bottom\nbottom", { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top })
      );
    diag.layout =
      $(go.GridLayout,
        {
          cellSize: new go.Size(1, 1),
          spacing: new go.Size(0, 0),
          wrappingColumn: wrap,
          //layout: $(go.TreeLayout, {
          //  angle: 0,
          //  nodeSpacing: 0,
          //  layerSpacing: 0,
          boundsComputation: function (part, lay) {
            return part.findObject("BODY").getDocumentBounds();
          }
        });
    diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", width: 51 },
        { key: 2, text: "Beta", color: "orange", width: 45 },
        { key: 3, text: "Gamma", color: "lightgreen", width: 63 },
        { key: 4, text: "Delta", color: "pink", width: 48 },
        { key: 5, text: "Epsilon", color: "yellow", width: 61 }
      ]);
  }


  layoutBounds.add(new Test("overlap vert", null,
    function (test) {
      SetupBounds(test, 1);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0, 0), new go.Point(0, 32), new go.Point(0, 64), new go.Point(0, 96), new go.Point(0, 128)])
    }));

  layoutBounds.add(new Test("overlap horiz", null,
    function (test) {
      SetupBounds(test, 100);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0, 0), new go.Point(48, 0), new go.Point(102, 0), new go.Point(158, 0), new go.Point(213, 0)])
    }));

})();
