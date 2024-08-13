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
  var $ = go.GraphObject.make;

  var tc = new TestCollection('temp');
  TestRoot.add(tc);

  tc.add(new Test("resizing group undo redo", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.toolManager.draggingTool.isGridSnapEnabled = true;

      diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          locationSpot: go.Spot.Center, locationObjectName: "SHAPE",
          desiredSize: new go.Size(120, 60), minSize: new go.Size(40, 40),
          resizable: true, resizeCellSize: new go.Size(20, 20)
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.Shape,
          { // the border
            name: "SHAPE", fill: "white",
            portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true,
            fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
          },
          new go.Binding("figure"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")),
        // this Shape prevents mouse events from reaching the middle of the port
        $(go.Shape, { width: 100, height: 40, strokeWidth: 0, fill: "transparent" }),
        $(go.TextBlock,
          { margin: 1, textAlign: "center", overflow: go.TextBlock.OverflowEllipsis, editable: true },
          // this Binding is TwoWay due to the user editing the text with the TextEditingTool
          new go.Binding("text").makeTwoWay(),
          new go.Binding("stroke", "color"))
      );
      // each Group is a "swimlane" with a header on the left and a resizable lane on the right
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          { resizable: true, resizeObjectName: "BODY", selectionObjectName: "BODY" },
          { layout: $(go.TreeLayout) },
          $(go.Shape, { height: 14.3, fill: "green", stretch: go.GraphObject.Horizontal }),
          $(go.Panel, "Auto", { name: "BODY" },
            $(go.Shape, { fill: "lightgray" }),
            $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 10 })
          ),
          $(go.TextBlock, new go.Binding("text"))
        );

      diagram.model = new go.GraphLinksModel(
        [ // node data
          {"key":3, "loc":"0 100", "text":"Gamma", "color":"green", "figure":"Cylinder1"}
        ],
        [
        ]);
        diagram.findNodeForKey(3).isSelected = true;
    },
    function(test) {
      var diagram = test.diagram;
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      // var group = diagram.findNodeForKey(11);
      // var origGroupBottom = group.selectionObject.getDocumentPoint(go.Spot.Bottom);

      var node = diagram.findNodeForKey(3);

      console.log(node.position.toString() === "Point(-60,70)");
      console.log(node.location.toString() === "Point(0,100)");
      console.log(node.desiredSize.toString() === "Size(120,60)");
      test.mouseDown(new go.Point(60, 100), { timestamp: 1000 });  // resize node with mid right handle
      test.mouseMove(new go.Point(80, 100), { timestamp: 1100 });
      test.mouseUp(new go.Point(80, 100), { timestamp: 1200 });
      console.log(node.position.toString() === "Point(-60,70)");
      console.log(node.location.toString() === "Point(10,100)");
      console.log(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo();
      console.log(node.position.toString() === "Point(-60,70)");
      console.log(node.location.toString() === "Point(0,100)");
      console.log(node.desiredSize.toString() === "Size(120,60)");
      mgr.redo();
      console.log(node.position.toString() === "Point(-60,70)");
      console.log(node.location.toString() === "Point(10,100)");
      console.log(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo(); // now start over:

      test.mouseDown(new go.Point(-60, 100), { timestamp: 1000 }); // resize node with mid left handle
      test.mouseMove(new go.Point(-80, 100), { timestamp: 1100 });
      test.mouseUp(new go.Point(-80, 100), { timestamp: 1200 });
      console.log(node.position.toString() === "Point(-80,70)");
      console.log(node.location.toString() === "Point(-10,100)");
      console.log(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo();
      console.log(node.position.toString() === "Point(-60,70)");
      console.log(node.location.toString() === "Point(0,100)");
      console.log(node.desiredSize.toString() === "Size(120,60)");
      mgr.redo();
      console.log(node.position.toString() === "Point(-80,70)");
      console.log(node.location.toString() === "Point(-10,100)");
      console.log(node.desiredSize.toString() === "Size(140,60)");

    }
  ));

})(); // End test system
