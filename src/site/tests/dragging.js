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
  var tcroot = new TestCollection('Dragging');
  TestRoot.add(tcroot);
  var $ = go.GraphObject.make;


  function CommonSetupNodes(test) {
    //test.diagram.reset();
    test.diagram.toolManager.draggingTool = new go.DraggingTool();
    test.diagram.nodeTemplate =
    $(go.Node,
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape, { fill: "lightblue" }));
    test.diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal, reshapable: true },
      $(go.Shape));
    test.diagram.model.nodeDataArray = [
    { key: 1, loc: "0 0" },
    { key: 2, loc: "200 0" },
    { key: 3, loc: "50 200" }
  ];
    test.diagram.model.linkDataArray = [
    { from: 1, to: 3 }
  ];
  }

  var tc = new TestCollection("Moves and Copies");
  tcroot.add(tc);

  tc.add(new Test('Simple Move', null, CommonSetupNodes,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('Move despite initial Control', null, CommonSetupNodes,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, control: true });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });  // Control
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });  // no Control!
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('Shift Move', null, CommonSetupNodes,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, modifiers: 4 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, modifiers: 4 });  // Shift
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, modifiers: 4 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('Single Move despite other selection', null, CommonSetupNodes,
  function(test) {
    test.diagram.findNodeForKey(3).isSelected = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('Simple Copy', null, CommonSetupNodes,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, control: true });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 4, "should have copied one node");
    var n4 = test.diagram.findNodeForData(diagram.model.nodeDataArray[3]);
    test.assert(test.isApproxPoint(n4.location, new go.Point(100, 100)), "didn't copy Node 1 to 100,100");
  }));

  tc.add(new Test('Multiple Move', null, function(test) {
    CommonSetupNodes(test);
    test.diagram.findNodeForKey(3).isSelected = true;
    test.diagram.links.first().isSelected = true;
  },
  function(test) {
    test.mouseDown(new go.Point(53, 153), { timestamp: 500 });  // drag the first reshape handle
    test.mouseMove(new go.Point(53, 163), { timestamp: 600 });
    test.mouseUp(new go.Point(53, 173), { timestamp: 700 });
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, modifiers: 4 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, modifiers: 4 });  // Shift
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, modifiers: 4 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(150, 300)), "didn't move Node 3 also");
    test.assert(test.isApproxPoint(diagram.links.first().points.elt(2), new go.Point(150.5, 273)), "lost shape of moved Link?");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(diagram.links.count === 1, "should not have copied any links");
  }));

  tc.add(new Test('Multiple Copy', null, function(test) {
    CommonSetupNodes(test);
    test.diagram.findNodeForKey(3).isSelected = true;
    test.diagram.links.first().isSelected = true;
  },
  function(test) {
    test.mouseDown(new go.Point(53, 153), { timestamp: 500 });  // drag the first reshape handle
    test.mouseMove(new go.Point(53, 163), { timestamp: 600 });
    test.mouseUp(new go.Point(53, 173), { timestamp: 700 });
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, control: true });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });  // Control
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, control: true });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(test.isApproxPoint(diagram.links.first().points.elt(2), new go.Point(50.5, 173)), "lost shape of original Link?");
    // NOTE: this does not check that the copied Link has the "same" shape as the original one
    test.assert(diagram.nodes.count === 5, "should have copied two nodes");
    test.assert(diagram.links.count === 2, "should have copied the link between the two copied nodes");
  }));

  tc.add(new Test('Multiple Move cancelled', null, CommonSetupNodes,
  function(test) {
    test.diagram.findNodeForKey(3).isSelected = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, modifiers: 4 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, modifiers: 4 });  // Shift
    test.keyDown("Escape");
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
  }));

  tc.add(new Test('Multiple Copy cancelled', null, CommonSetupNodes,
  function(test) {
    test.diagram.findNodeForKey(3).isSelected = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, control: true });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });
    test.keyDown("Escape");
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
  }));

  tc.add(new Test('Multiple Move disallowed', null, CommonSetupNodes,
  function(test) {
    test.diagram.allowMove = false;
    test.diagram.findNodeForKey(3).isSelected = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, modifiers: 4 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, modifiers: 4 });  // Shift
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, modifiers: 4 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
  }));

  tc.add(new Test('Multiple Copy and Move disallowed', null, CommonSetupNodes,
  function(test) {
    test.diagram.allowCopy = false;
    test.diagram.allowMove = false;
    test.diagram.findNodeForKey(3).isSelected = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0, control: true });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, modifiers: 4 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
  }));

  tc.add(new Test('Diagram.isReadOnly', null, CommonSetupNodes,
  function(test) {
    test.diagram.isReadOnly = true;
    test.diagram.isModified = false;
    test.diagram.undoManager.clear();  // in case there are changes left over from setup
    test.diagram.undoManager.isEnabled = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(diagram.undoManager.history.count === 0 && diagram.isModified === false && diagram.undoManager.currentTransaction === null, "should not have executed a Dragging transaction")
  }));

  // Collapse a group, move it via drag, and expand it. Make sure the member parts's adornment is moved with the item
  // This makes sure that not only is the member part moved, but that its .transforms are correctly updated too
  tc.add(new Test('Collapse+Drag+Expand', null, function(test) {
    var diagram = test.diagram;
    diagram.groupTemplateMap.add("OfNodes",
      $(go.Group, "Auto",
        $(go.Panel, "Vertical",
          $(go.Panel, "Horizontal",
            { stretch: go.GraphObject.Horizontal, background: "#33D3E5" },
            $("SubGraphExpanderButton",
              { alignment: go.Spot.Right, margin: 2 }),
            $(go.TextBlock, "Group A",
              { width: 80, height: 20, margin: 5,
                font: "bold 16px sans-serif", stroke: "#006080"})
      ),  // end Horizontal Panel
      $(go.Placeholder,
        { padding: 5, alignment: go.Spot.TopLeft },
        new go.Binding("background", "isHighlighted", function(h) { return h ? "red" : "transparent"; }).ofObject())
    ),  // end Vertical Panel
    $(go.Shape, "Rectangle",
      {
        isPanelMain: true,
        fill: null,
        stroke: "#0099CC",
        strokeWidth: 2,
      })
    ));

    diagram.model =  new go.GraphLinksModel(
      [
      {"key":1, "text":"Group A", "isGroup":true, "category":"OfNodes"},
      {"text":"first A", "group":1, "key":2}]
    );
  },
  function(test) {},
  function(test) {
    var diagram = test.diagram;
    var group = diagram.findNodeForKey(1);
    var two = diagram.findNodeForKey(2);

    diagram.startTransaction();
    diagram.select(two);
    diagram.commitTransaction();
    var adorn = two.adornments.first();
    var first = (adorn.position.x);
    diagram.commandHandler.collapseSubGraph(group)
    diagram.startTransaction();
    diagram.moveParts(diagram.nodes, (new go.Point(group.position.x+100, group.position.y)), true);
    diagram.commitTransaction();
    diagram.startTransaction();
    diagram.commandHandler.expandSubGraph(group)
    diagram.commitTransaction();
    var adorn = two.adornments.first();
    var second = (adorn.position.x);
    test.assert(second > first)

  }));

  // Same as Collapse+Drag+Expand but with part.move (group.move)
  tc.add(new Test('Collapse+Drag+Expand 2', null, function(test) {
    var diagram = test.diagram;
    diagram.groupTemplateMap.add("OfNodes",
      $(go.Group, "Auto",
        $(go.Panel, "Vertical",
          $(go.Panel, "Horizontal",
            { stretch: go.GraphObject.Horizontal, background: "#33D3E5" },
            $("SubGraphExpanderButton",
              { alignment: go.Spot.Right, margin: 2 }),
            $(go.TextBlock, "Group A",
              { width: 80, height: 20, margin: 5,
                font: "bold 16px sans-serif", stroke: "#006080"})
      ),  // end Horizontal Panel
      $(go.Placeholder,
        { padding: 5, alignment: go.Spot.TopLeft },
        new go.Binding("background", "isHighlighted", function(h) { return h ? "red" : "transparent"; }).ofObject())
    ),  // end Vertical Panel
    $(go.Shape, "Rectangle",
      {
        isPanelMain: true,
        fill: null,
        stroke: "#0099CC",
        strokeWidth: 2,
      })
    ));

    diagram.model =  new go.GraphLinksModel(
      [
      {"key":1, "text":"Group A", "isGroup":true, "category":"OfNodes"},
      {"text":"first A", "group":1, "key":2}]
    );
  },
  function(test) {},
  function(test) {
    var diagram = test.diagram;
    var group = diagram.findNodeForKey(1);
    var two = diagram.findNodeForKey(2);

    diagram.startTransaction();
    diagram.select(two);
    diagram.commitTransaction();
    var adorn = two.adornments.first();
    var first = (adorn.position.x);
    diagram.commandHandler.collapseSubGraph(group)
    diagram.startTransaction();
    group.move(new go.Point(group.position.x+100, group.position.y));
    diagram.commitTransaction();
    diagram.startTransaction();
    diagram.commandHandler.expandSubGraph(group)
    diagram.commitTransaction();
    var adorn = two.adornments.first();
    var second = (adorn.position.x);
    test.assert(second > first)

  }));


  // Same as Collapse+Drag+Expand but with part.move (group.move)
  tc.add(new Test('drag group with unmovable node', null, function(test) {
    var myDiagram = test.diagram;
    myDiagram.reset();

  // Each node in a tree is defined using the default nodeTemplate.
  myDiagram.nodeTemplate =
    $(go.Node,
    new go.Binding("position", "xy", go.Point.parse).makeTwoWay(go.Point.stringify),
      { movable: false, copyable: false, deletable: false },
      { selectionAdorned: false, background: 'lightblue' },
      $(go.Panel, "Horizontal",
        { position: new go.Point(16, 0) },
        $(go.TextBlock, "item", { width: 40, height: 20 })
      )
    );  // end Node


  myDiagram.groupTemplate =
    $(go.Group, "Auto",
      new go.Binding("position", "xy", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        deletable: false,
        layout:
          $(go.TreeLayout,
            {
              alignment: go.TreeLayout.AlignmentStart,
              angle: 0,
              compaction: go.TreeLayout.CompactionNone,
              layerSpacing: 16,
              layerSpacingParentOverlap: 1,
              nodeIndentPastParent: 1.0,
              nodeSpacing: 0,
              setsPortSpot: false,
              setsChildPortSpot: false
            })
      },
      $(go.Shape, { fill: "white", stroke: "lightgray" }),
      $(go.Panel, "Vertical",
        { defaultAlignment: go.Spot.Left },
        $(go.TextBlock,
          { font: "bold 14pt sans-serif", width: 80, height: 30, background: 'lime',
          margin: new go.Margin(5, 5, 0, 5) },
          new go.Binding("text")),
        $(go.Placeholder, { padding: 5 })
      )
    );

  var nodeDataArray = [
    { isGroup: true, key: -1, text: "Left Side", xy: "0 0" }
  ];
  var linkDataArray = [
  ];

  // initialize tree on left side
  var root = { key: 0, group: -1 };
  nodeDataArray.push(root);
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  },
  function(test) {},
  function(test) {
    var diagram = test.diagram;
    var group = diagram.findNodeForKey(-1);
    var node = diagram.findNodeForKey(0);
    var nodex = node.position.x;
    test.assert(nodex === 5.5);
    diagram.startTransaction();
    diagram.moveParts([group], (new go.Point(group.position.x+100, group.position.y)), true);
    diagram.commitTransaction();
    var nodex2 = node.position.x;
    console.log(nodex, nodex2);
    test.assert(test.isApprox(nodex2, 5.5 + 100)); // node should have moved
  }));

  // Same as above but with drag options
  tc.add(new Test('drag group with unmovable node disallow', null, function(test) {
    var myDiagram = test.diagram;
    myDiagram.reset();

  // Each node in a tree is defined using the default nodeTemplate.
  myDiagram.nodeTemplate =
    $(go.Node,
    new go.Binding("position", "xy", go.Point.parse).makeTwoWay(go.Point.stringify),
      { movable: false, copyable: false, deletable: false },
      { selectionAdorned: false, background: 'lightblue' },
      $(go.Panel, "Horizontal",
        { position: new go.Point(16, 0) },
        $(go.TextBlock, "item", { width: 40, height: 20 })
      )
    );  // end Node


  myDiagram.groupTemplate =
    $(go.Group, "Auto",
      new go.Binding("position", "xy", go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        deletable: false,
        layout:
          $(go.TreeLayout,
            {
              alignment: go.TreeLayout.AlignmentStart,
              angle: 0,
              compaction: go.TreeLayout.CompactionNone,
              layerSpacing: 16,
              layerSpacingParentOverlap: 1,
              nodeIndentPastParent: 1.0,
              nodeSpacing: 0,
              setsPortSpot: false,
              setsChildPortSpot: false
            })
      },
      $(go.Shape, { fill: "white", stroke: "lightgray" }),
      $(go.Panel, "Vertical",
        { defaultAlignment: go.Spot.Left },
        $(go.TextBlock,
          { font: "bold 14pt sans-serif", width: 80, height: 30, background: 'lime',
          margin: new go.Margin(5, 5, 0, 5) },
          new go.Binding("text")),
        $(go.Placeholder, { padding: 5 })
      )
    );

  var nodeDataArray = [
    { isGroup: true, key: -1, text: "Left Side", xy: "0 0" }
  ];
  var linkDataArray = [
  ];

  // initialize tree on left side
  var root = { key: 0, group: -1 };
  nodeDataArray.push(root);
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  },
  function(test) {},
  function(test) {
    var diagram = test.diagram;
    var group = diagram.findNodeForKey(-1);
    var node = diagram.findNodeForKey(0);
    var nodex = node.position.x;
    test.assert(nodex === 5.5);
    diagram.startTransaction();
    diagram.moveParts([group], (new go.Point(group.position.x+100, group.position.y)), true);
    diagram.commitTransaction();
    var nodex2 = node.position.x;
    console.log(nodex, nodex2);
    test.assert(test.isApprox(nodex2, 5.5 + 100)); // node should have moved
  }));


  tc = new TestCollection("Limits");
  tcroot.add(tc);

  tc.add(new Test('maxLocation', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.maxLocation = new go.Point(70, 60);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(70, 60)), "Node 1 move not limited to 70,60");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('minLocation', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.minLocation = new go.Point(170, 160);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(170, 160)), "Node 1 move not limited to 170,160");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('maxLocation NaN X', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.maxLocation = new go.Point(NaN, Infinity);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 100)), "Node 1 move not limited to 0,anything");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('maxLocation NaN Y', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.maxLocation = new go.Point(Infinity, NaN);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 0)), "Node 1 move not limited to anything,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('minLocation NaN X', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.minLocation = new go.Point(NaN, -Infinity);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(0, 0), { timestamp: 100 });
    test.mouseUp(new go.Point(-50, -50), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, -100)), "Node 1 move not limited to 0,anything");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('minLocation NaN Y', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.minLocation = new go.Point(-Infinity, NaN);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(0, 0), { timestamp: 100 });
    test.mouseUp(new go.Point(-50, -50), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(-100, 0)), "Node 1 move not limited to anything,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));


  tc = new TestCollection("Computation");
  tcroot.add(tc);

  tc.add(new Test('simple fixed', null, CommonSetupNodes,
  function(test) {
    var n1 = test.diagram.findNodeForKey(1);
    n1.dragComputation = function(n, loc, snap) {
      return new go.Point(-30, -40);
    };
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(-30, -40)), "didn't move Node 1 to -30,-40");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('grid snap', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(97, 103), { timestamp: 100 });
    test.mouseUp(new go.Point(153, 147), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100, but to: " + diagram.findNodeForKey(1).location);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('grid snap to grid', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.grid.gridCellSize = new go.Size(25, 20);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(97, 103), { timestamp: 100 });
    test.mouseUp(new go.Point(161, 141), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100, but to: " + diagram.findNodeForKey(1).location);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('grid snap to tool', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 20);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(97, 103), { timestamp: 100 });
    test.mouseUp(new go.Point(161, 141), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100, but to: " + diagram.findNodeForKey(1).location);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('grid snap to grid offset', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.grid.gridCellSize = new go.Size(25, 20);
    diagram.grid.gridOrigin = new go.Point(3, 4);
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(97, 103), { timestamp: 100 });
    test.mouseUp(new go.Point(161, 141), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(103, 84)), "didn't move Node 1 to 103,84, but to: " + diagram.findNodeForKey(1).location);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('grid snap to tool offset', null, CommonSetupNodes,
    function (test) {
      var diagram = test.diagram;
      diagram.toolManager.draggingTool.isGridSnapEnabled = true;
      diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(25, 20);
      diagram.toolManager.draggingTool.gridSnapOrigin = new go.Point(3, 4);
      test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
      test.mouseMove(new go.Point(97, 103), { timestamp: 100 });
      test.mouseUp(new go.Point(161, 141), { timestamp: 300 });
    },
    function (test) {
      var diagram = test.diagram;
      test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(103, 84)), "didn't move Node 1 to 103,84, but to: " + diagram.findNodeForKey(1).location);
      test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
      test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    }));

  tc.add(new Test('grid snap diff comp', null, function (test) {
    var diagram = test.diagram;
    diagram.reset();
    function nodeDragComputation(node, proposedPoint, snappedPoint) {
      var pt = new go.Point(proposedPoint.x, proposedPoint.y);
      if (node.data.key == "Alpha") {
        pt = new go.Point(Math.round(proposedPoint.x / 50) * 50, proposedPoint.y);
      }
      return pt;
    }

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 8, width: 50, height: 25 }, new go.Binding("text", "key"))
      );

    diagram.groupTemplate =
      $(go.Group, "Vertical", { dragComputation: nodeDragComputation },
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle", { fill: "rgba(128,128,128,0.33)" }),
          $(go.Placeholder, { padding: 25 })));

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", isGroup: true },
        { key: "Beta", isGroup: true },
        { key: "Gamma", color: "lightgreen", group: "Beta" },
      ], []);
  },
  function(test) {

  },
  function(test) {
    var diagram = test.diagram;
    diagram.startTransaction();
    diagram.findNodeForKey('Beta').isSelected = true;
    diagram.findNodeForKey('Alpha').isSelected = true;
    diagram.commitTransaction();
    diagram.startTransaction();
    diagram.moveParts(diagram.selection, new go.Point(-25, 0), true)
    diagram.commitTransaction();
    diagram.startTransaction();
    diagram.moveParts(diagram.selection, new go.Point(-25, 0), true)
    diagram.commitTransaction();
    // Make sure Alpha does not move, Beta does, and Gamma moves accordingly with Beta
    test.assert(test.isApprox(diagram.findNodeForKey('Beta').actualBounds.left, 21), "21")
    test.assert(test.isApprox(diagram.findNodeForKey('Beta').actualBounds.right, 143.52284749830795), "143.*")
    test.assert(test.isApprox(diagram.findNodeForKey('Alpha').actualBounds.right, 50.5), "50.5")
    test.assert(test.isApprox(diagram.findNodeForKey('Alpha').actualBounds.left, -0.5), "-0.5")
    test.assert(test.isApprox(diagram.findNodeForKey('Gamma').actualBounds.left, 46.5), "46.5")
    test.assert(test.isApprox(diagram.findNodeForKey('Gamma').actualBounds.right, 118.02284749830794), "118.*")
  }));

  tc = new TestCollection("dragsTree");
  tcroot.add(tc);

  function CommonSetupTree(test) {
    CommonSetupNodes(test);
    test.diagram.model.linkDataArray = [
    { from: 1, to: 2 },
    { from: 1, to: 3 }
  ];
    test.diagram.toolManager.draggingTool.dragsTree = true;
  }

  tc.add(new Test('Simple Move Tree', null, CommonSetupTree,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(diagram.links.count === 2, "should not have copied any links");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(100, 100)), "didn't move Node 1 to 100,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(300, 100)), "didn't move Node 2 to 300,100");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(150, 300)), "didn't move Node 3 to 100,300");
  }));

  tc.add(new Test('Simple Copy Tree', null, CommonSetupTree,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300, control: true });
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
    test.assert(diagram.nodes.count === 6, "should have copied three nodes");
    var n4 = test.diagram.findNodeForData(diagram.model.nodeDataArray[3]);
    test.assert(test.isApproxPoint(n4.location, new go.Point(100, 100)), "didn't copy Node 1 to 100,100");
    test.assert(n4.isSelected, "copied node should be selected");
    var n5 = test.diagram.findNodeForData(diagram.model.nodeDataArray[4]);
    test.assert(test.isApproxPoint(n5.location, new go.Point(300, 100)), "didn't copy Node 2 to 300,100");
    test.assert(n5.isSelected, "copied node should be selected");
    var n6 = test.diagram.findNodeForData(diagram.model.nodeDataArray[5]);
    test.assert(test.isApproxPoint(n6.location, new go.Point(150, 300)), "didn't copy Node 3 to 150,300");
    test.assert(n6.isSelected, "copied node should be selected");
    test.assert(diagram.links.count === 4, "should have copied two links");
    var l3 = test.diagram.findLinkForData(diagram.model.linkDataArray[2]);
    test.assert(l3 !== null && l3.isSelected && l3.fromNode === n4 && l3.toNode === n5, "copied link 3 should be selected");
    var l4 = test.diagram.findLinkForData(diagram.model.linkDataArray[3]);
    test.assert(l4 !== null && l4.isSelected && l4.fromNode === n4 && l4.toNode === n6, "copied link 4 should be selected");
  }));

  tc.add(new Test('Simple Move Tree cancelled', null, CommonSetupTree,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100 });
    test.keyDown("Escape");
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(diagram.links.count === 2, "should not have copied any links");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));

  tc.add(new Test('Simple Copy Tree cancelled', null, CommonSetupTree,
  function(test) {
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });  // at first Node center
    test.mouseMove(new go.Point(100, 100), { timestamp: 100, control: true });
    test.keyDown("Escape");
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 3, "should not have copied any nodes");
    test.assert(diagram.links.count === 2, "should not have copied any links");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "moved Node 1");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "moved Node 2");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "moved Node 3");
  }));


  tc = new TestCollection("Diagram.moveParts");
  tcroot.add(tc);

  tc.add(new Test('simple', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    // note: this Part will not be included in diagram.nodes, because it is a simple Part rather than a Node or a Group (or a Link)
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), true);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "didn't leave Node 2 at 200,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
  }));

  tc.add(new Test('nocheck', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), false);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(212, 28)), "didn't move Node 2 to 212,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
  }));

  tc.add(new Test('grid', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), true);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(10, 30)), "didn't move Node 1 to 10,30");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "didn't leave Node 2 at 200,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(60, 230)), "didn't move Node 3 to 60,230");
  }));

  tc.add(new Test('zero grid nocheck', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), false);
    diagram.commitTransaction('moveParts');
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('align Parts');
    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.moveParts(diagram.nodes, new go.Point(0, 0), false);
    diagram.commitTransaction('align Parts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(10, 30)), "didn't move Node 1 to 10,30");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(210, 30)), "didn't move Node 2 to 210,30");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(60, 230)), "didn't move Node 3 to 60,230");
  }));

  tc.add(new Test('group', null,
  function(test) {
    CommonSetupNodes(test);
    var model = test.diagram.model;
    model.setGroupKeyForNodeData(model.findNodeDataForKey(2), 11);
    model.addNodeData({ key: 11, isGroup: true });
    model.addNodeData({ key: 4, group: 11, loc: "303 33" });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    test.grouplocation = diagram.findNodeForKey(11).location.copy();
    test.groupposition = diagram.findNodeForKey(11).position.copy();
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), true);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(212, 28)), "didn't leave Node 2 at 212,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(4).location, new go.Point(315, 61)), "didn't move Node 4 to 315,61");  // no double-move!
    var gloc = test.grouplocation.copy();
    gloc.offset(12, 28);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(11).location, gloc), "didn't move Group 11 to " + gloc);

    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).position, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).position, new go.Point(212, 28)), "didn't leave Node 2 at 212,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).position, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(4).position, new go.Point(315, 61)), "didn't move Node 4 to 315,61");  // no double-move!
    var gpos = test.groupposition.copy();
    gpos.offset(12, 28);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(11).position, gpos), "didn't move Group 11 to " + gpos);
  }));

  tc.add(new Test('group collapsed', null,
  function(test) {
    CommonSetupNodes(test);
    var model = test.diagram.model;
    model.setGroupKeyForNodeData(model.findNodeDataForKey(2), 11);
    model.addNodeData({ key: 11, isGroup: true });
    model.addNodeData({ key: 4, group: 11, loc: "303 33" });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).movable = false;
    test.grouplocation = diagram.findNodeForKey(11).location.copy();
    test.groupposition = diagram.findNodeForKey(11).position.copy();
    diagram.commandHandler.collapseSubGraph(diagram.findNodeForKey(11));  // executes transaction
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('moveParts');
    diagram.moveParts(diagram.nodes, new go.Point(12, 28), true);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.redo();
    diagram.commandHandler.expandSubGraph(diagram.findNodeForKey(11));  // executes transaction
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(212, 28)), "didn't leave Node 2 at 212,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(4).location, new go.Point(315, 61)), "didn't move Node 4 to 315,61");  // no double-move!
    var gloc = test.grouplocation.copy();
    gloc.offset(12, 28);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(11).location, gloc), "didn't move Group 11 to location " + gloc);

    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).position, new go.Point(12, 28)), "didn't move Node 1 to 12,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).position, new go.Point(212, 28)), "didn't leave Node 2 at 212,28");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).position, new go.Point(62, 228)), "didn't move Node 3 to 62,228");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(4).position, new go.Point(315, 61)), "didn't move Node 4 to 315,61");  // no double-move!
    var gpos = test.groupposition.copy();
    gpos.offset(12, 28);
    test.assert(test.isApproxPoint(diagram.findNodeForKey(11).position, gpos), "didn't move Group 11 to position " + gpos);
  }));


  tc = new TestCollection("Diagram.copyParts");
  tcroot.add(tc);

  tc.add(new Test('simple', null, CommonSetupNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).copyable = false;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('copyParts');
    test.map = diagram.copyParts(new go.Set().addAll(diagram.nodes), null, true);
    diagram.commitTransaction('copyParts');
    mgr.undo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;

    test.assert(test.isApproxPoint(diagram.findNodeForKey(1).location, new go.Point(0, 0)), "didn't leave Node 1 at 0,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(2).location, new go.Point(200, 0)), "didn't leave Node 2 at 200,0");
    test.assert(test.isApproxPoint(diagram.findNodeForKey(3).location, new go.Point(50, 200)), "didn't leave Node 3 at 50,200");

    test.assert(test.map.count === 2, "should have copied 2 nodes");
    var it = test.map.iterator;
    while (it.next()) {
      var node = it.key;
      var copy = it.value;
      test.assert(node instanceof go.Node && copy instanceof go.Node && node.location.equals(copy.location), copy.data.key + " copy isn't at same location: " + node.location + " " + copy.location);
    }

  }));

  tc.add(new Test('group and label node', null,
  function(test) {
    CommonSetupNodes(test);
    var model = test.diagram.model;
    model.linkLabelKeysProperty = "labels";
    model.setGroupKeyForNodeData(model.findNodeDataForKey(2), 11);
    model.addNodeData({ key: 11, isGroup: true });
    model.addNodeData({ key: 4, group: 11, loc: "303 33" });
    model.addLinkData({ from: 4, to: 5, labels: [6] });
    model.addNodeData({ key: 5, group: 11, loc: "355 277" });
    model.addLinkData({ from: 1, to: 6 });
    model.addNodeData({ key: 6, category: "LinkLabel" });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).copyable = false;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('copyParts');
    test.map = diagram.copyParts(new go.Set().addAll(diagram.nodes).addAll(diagram.links), diagram, true);
    //??? cannot call diagram.moveParts here because copied Groups and label Nodes do not have real Part.locations
    diagram.commitTransaction('copyParts');
    diagram.startTransaction('moveParts');
    diagram.moveParts(test.map, new go.Point(0, 300), false);
    diagram.commitTransaction('moveParts');
    mgr.undo();
    mgr.undo();
    mgr.redo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(test.map.count === 9, "should have copied 6 nodes and 3 links");
    test.assert(diagram.nodes.count === 13, "should have 7 original nodes and 6 copied nodes");
    test.assert(diagram.links.count === 6, "should have 3 original links and 3 copied links");
    var it = test.map.iterator;
    while (it.next()) {
      var orig = it.key;
      var copy = it.value;
      test.assert(copy.containingGroup === null || !test.map.contains(copy.containingGroup), "copied Parts should not be member of an original group");
      if (orig instanceof go.Link) {
        test.assert(copy instanceof go.Link && !test.map.contains(copy.fromNode) && !test.map.contains(copy.toNode), "copied Links should not have references to original nodes");
        for (var lit = copy.labelNodes; lit.next(); ) {
          var labnode = lit.value;
          test.assert(labnode instanceof go.Node && !test.map.contains(labnode), "copied Links should not have references to original nodes");
        }
      } else if (orig instanceof go.Node) {
        test.assert(copy instanceof go.Node);
        for (var lit = copy.linksConnected; lit.next(); ) {
          var link = lit.value;
          test.assert(link instanceof go.Link && !test.map.contains(link), "copied Nodes should not have references to original links");
        }
        if (orig instanceof go.Group) {
          test.assert(copy instanceof go.Group);
          for (var mit = copy.memberParts; mit.next(); ) {
            var mem = mit.value;
            test.assert(!test.map.contains(mem), "copied Groups should not contain original Parts");
          }
        }
      }
    }
  }));


  tc = new TestCollection("Diagram.removeParts");
  tcroot.add(tc);

  tc.add(new Test('group and label node', null,
  function(test) {
    CommonSetupNodes(test);
    var model = test.diagram.model;
    model.linkLabelKeysProperty = "labels";
    model.setGroupKeyForNodeData(model.findNodeDataForKey(2), 11);
    model.addNodeData({ key: 11, isGroup: true });
    model.addNodeData({ key: 4, group: 11, loc: "303 33" });
    model.addLinkData({ from: 4, to: 5, labels: [6] });
    model.addNodeData({ key: 5, group: 11, loc: "355 277" });
    model.addLinkData({ from: 1, to: 6 });
    model.addNodeData({ key: 6, category: "LinkLabel" });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.add(go.GraphObject.make(go.Part, { locationSpot: go.Spot.Center, location: new go.Point(0, 0) },
                                    go.GraphObject.make(go.Shape, "Circle", { width: 10, height: 10, fill: "red", stroke: null })));
    diagram.findNodeForKey(2).deletable = false;
    var mgr = diagram.undoManager;
    mgr.isEnabled = true;
    diagram.startTransaction('copyParts');
    test.map = diagram.copyParts(new go.Set().addAll(diagram.nodes).addAll(diagram.links), null, true);
    diagram.commitTransaction('copyParts');
    diagram.startTransaction('removeParts');
    diagram.removeParts(test.map, true);
    diagram.commitTransaction('removeParts');
    mgr.undo();
    mgr.undo();
    mgr.redo();
    mgr.redo();
  },
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 7, "should have 7 original nodes");
    test.assert(diagram.links.count === 3, "should have 3 original links");
    for (var it = test.map.iterator; it.next(); ) {
      test.assert(it.value.diagram === null, "copied Parts should no longer be in the Diagram");
    }
  }));


  function CommonSetupLinkingNodes(test) {
    //test.diagram.reset();
    test.diagram.toolManager.draggingTool = new go.DraggingTool();
    test.diagram.toolManager.draggingTool.dragsLink = true;
    test.diagram.toolManager.linkingTool.isUnconnectedLinkValid = true;
    test.diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    test.diagram.toolManager.relinkingTool.portGravity = 10;
    test.diagram.nodeTemplate =
    $(go.Node, "Spot",
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape, { fill: "lightblue", portId: "", fromLinkable: true, toLinkable: true }),
      $(go.TextBlock, new go.Binding("text", "key")));
    test.diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal, reshapable: true },
      $(go.Shape, { strokeWidth: 3 }));
    test.diagram.model.nodeDataArray = [
    { key: 1, loc: "0 0" },
    { key: 2, loc: "200 0" },
    { key: 3, loc: "50 200" },
    { key: 4, loc: "250 200" },
    { key: 5, loc: "100 400" }
  ];
    test.diagram.model.linkDataArray = [
    { from: 1, to: 2 }
  ];
  }

  tc = new TestCollection("dragsLink");
  tcroot.add(tc);

  tc.add(new Test('disconnect', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(150, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === null && link.data.from === undefined && link.data.to === undefined, "Link should have been completely disconnected");
  }));

  tc.add(new Test('reconnect original', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(175, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 50), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(1) && link.toNode === diagram.findNodeForKey(2) && link.data.from === 1 && link.data.to === 2, "Link should have been completely restored between 1 and 2");
  }));

  tc.add(new Test('reconnect both', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    test.reconnectedPorts = [];
    diagram.addDiagramListener("LinkRelinked", function(e) { test.reconnectedPorts.push(e.parameter); });
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(175, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(200, 250), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(3) && link.toNode === diagram.findNodeForKey(4) && link.data.from === 3 && link.data.to === 4, "Link should have been completely reconnected between 3 and 4");
    test.assert(test.reconnectedPorts.length === 2, "didn't raise LinkRelinked for both ends of link");
  }));

  tc.add(new Test('reconnect to', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(125, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === diagram.findNodeForKey(5) && link.data.from === undefined && link.data.to === 5, "Link should have reconnected to with 5");
  }));

  tc.add(new Test('reconnect from', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(125, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(250, 450), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(5) && link.toNode === null && link.data.from === 5 && link.data.to === undefined, "Link should have reconnected from with 5");
  }));

  tc.add(new Test('reconnect both invalid', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.linkValidation = function(n1, p1, n2, p2) {
      return false;
    };
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(175, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(200, 250), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === null && link.data.from === undefined && link.data.to === undefined, "Link should have been completely disconnected due to invalidity");
    diagram.toolManager.relinkingTool.linkValidation = null;
  }));


  tc.add(new Test('move disconnected', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(150, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    test.mouseDown(new go.Point(150, 150), { timestamp: 1000 });  // at Link center
    test.mouseMove(new go.Point(170, 170), { timestamp: 1100 });
    test.mouseUp(new go.Point(180, 180), { timestamp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === null && link.data.from === undefined && link.data.to === undefined, "Link should remain completely disconnected");
    test.assert(test.isApproxPoint(link.points.elt(0), new go.Point(131, 180.5)), "Link should have been moved down");
  }));

  tc.add(new Test('reconnect disconnected both', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(150, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    test.mouseDown(new go.Point(150, 150), { timestamp: 1000 });  // at Link center
    test.mouseMove(new go.Point(170, 170), { timestamp: 1100 });
    test.mouseUp(new go.Point(200, 250), { timestamp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(3) && link.toNode === diagram.findNodeForKey(4) && link.data.from === 3 && link.data.to === 4, "Link should have been completely reconnected between 3 and 4");
  }));

  tc.add(new Test('reconnect disconnected to', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(150, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    test.mouseDown(new go.Point(150, 150), { timestamp: 1000 });  // at Link center
    test.mouseMove(new go.Point(170, 170), { timestamp: 1100 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === diagram.findNodeForKey(5) && link.data.from === undefined && link.data.to === 5, "Link should have reconnected to with 5");
  }));

  tc.add(new Test('reconnect disconnected from', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(150, 100), { timestamp: 100 });
    test.mouseUp(new go.Point(150, 150), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    test.mouseDown(new go.Point(150, 150), { timestamp: 1000 });  // at Link center
    test.mouseMove(new go.Point(170, 170), { timestamp: 1100 });
    test.mouseUp(new go.Point(250, 450), { timestamp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(5) && link.toNode === null && link.data.from === 5 && link.data.to === undefined, "Link should have reconnected from with 5");
  }));


  tc = new TestCollection("move node disco");
  tcroot.add(tc);

  tc.add(new Test('no from', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(125, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    var link = diagram.links.first();
    test.assert(link !== null && link.points.count === 6, "haven't yet routed only Link");
    test.origPoint = link.points.elt(0).copy();
    test.mouseDown(new go.Point(150, 450), { timestamp: 1000 });  // at center of Node 5
    test.mouseMove(new go.Point(160, 460), { timestamp: 1100 });
    test.mouseUp(new go.Point(200, 550), { timestammp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === null && link.toNode === diagram.findNodeForKey(5) && link.data.from === undefined && link.data.to === 5, "Link should have reconnected to with 5");
    test.assert(test.isApproxPoint(test.origPoint, new go.Point(1, 450.5)), "from end of link route should not have moved");
  }));

  tc.add(new Test('no to', null, CommonSetupLinkingNodes,
  function(test) {
    var diagram = test.diagram;
    diagram.animationManager.isEnabled = false;
    test.mouseDown(new go.Point(150, 50), { timestamp: 0 });  // at Link center
    test.mouseMove(new go.Point(125, 125), { timestamp: 100 });
    test.mouseUp(new go.Point(250, 450), { timestamp: 300 });
    diagram.clearSelection(); diagram.maybeUpdate();
    var link = diagram.links.first();
    test.assert(link !== null && link.points.count === 6, "haven't yet routed only Link");
    test.origPoint = link.points.elt(5).copy();
    test.mouseDown(new go.Point(150, 450), { timestamp: 1000 });  // at center of Node 5
    test.mouseMove(new go.Point(160, 460), { timestamp: 1100 });
    test.mouseUp(new go.Point(100, 550), { timestammp: 1300 });
  },
  function(test) {
    var diagram = test.diagram;
    var link = diagram.links.first();
    test.assert(diagram.links.count === 1, "still should have just one link");
    test.assert(link.fromNode === diagram.findNodeForKey(5) && link.toNode === null && link.data.from === 5 && link.data.to === undefined, "Link should have reconnected to with 5");
    test.assert(test.isApproxPoint(test.origPoint, new go.Point(300, 450.5)), "from end of link route should not have moved");
  }));


  tc = new TestCollection("palette");
  tcroot.add(tc);

  function CommonSetupPalette(test) {
    var diagram = test.diagram;  // target diagram
    diagram.reset();
    diagram.allowDrop = true;
    diagram.undoManager.isEnabled = true;

    // initialize the Palette
    if (!window.paletteDiv) {
      window.paletteDiv = document.createElement('div');
      window.paletteDiv.innerHTML = '<div id="myPalette" style="border: solid 1px black; width: 60px; height: 200px"></div>';
      window.paletteDiv.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
      document.body.appendChild(window.paletteDiv);

      var pal = window.palette = $(go.Palette, "myPalette");
      pal.layout.wrappingColumn = 1;
      pal.animationManager.isEnabled = false;

      // share the templates with the main Diagram
      pal.nodeTemplate = diagram.nodeTemplate;
      pal.groupTemplate = diagram.groupTemplate;

      pal.model.nodeDataArray = [
        { key: "g", color: "green" },
        { key: "b", color: "blue" },
        { key: "y", color: "yellow" }
      ];
      pal.maybeUpdate();
    } else {
      document.body.appendChild(window.paletteDiv);
    }
    test.palette = window.palette;
    test.paletteDiv = window.paletteDiv;

    test.assert(diagram.nodes.count === 0 && window.palette.nodes.count === 3, "Palette doesn't have three nodes");
  }

  function CommonCleanupPalette(test) {
    if (test.palette) {
      test.palette.div = null;
      test.palette = null;
    }
    if (test.paletteDiv) {
      document.body.removeChild(test.paletteDiv);
      test.paletteDiv = null;
      window.paletteDiv = null;
    }
  }

  function CheckNoDropOrPaste(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count === 0, "should have no dropped or pasted nodes");
    var dataarr = diagram.model.nodeDataArray;
    test.assert(dataarr.length === 0, "dropped or pasted data should not have been added");
    test.assert(diagram.undoManager.history.count === 0, "UndoManager should have 0 Transactions");
  }

  tc.add(new Test('simple drag-and-drop', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(100, 50), dragdrop);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 1, "should have dropped 1 node");
      var dataarr = diagram.model.nodeDataArray;
      test.assert(dataarr.length === 1 && dataarr[0].color === "blue", "dropped data should have blue color");
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('copy-and-paste', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      bpal.isSelected = true;
      if (palette.commandHandler.canCopySelection()) palette.commandHandler.copySelection();
      if (diagram.commandHandler.canPasteSelection()) diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 1, "should have pasted 1 node");
      var dataarr = diagram.model.nodeDataArray;
      test.assert(dataarr.length === 1 && dataarr[0].color === "blue", "pasted data should have blue color");
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('no allowDrop', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      diagram.allowDrop = false;
      diagram.undoManager.clear();
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(100, 50), dragdrop);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      CheckNoDropOrPaste(test);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('no allowClipboard', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      diagram.allowClipboard = false;
      diagram.undoManager.clear();
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      bpal.isSelected = true;
      if (palette.commandHandler.canCopySelection()) palette.commandHandler.copySelection();
      if (diagram.commandHandler.canPasteSelection()) diagram.commandHandler.pasteSelection();
    },
    function(test) {
      CheckNoDropOrPaste(test);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('no allowInsert', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      diagram.allowInsert = false;
      diagram.undoManager.clear();
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      bpal.isSelected = true;
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(100, 50), dragdrop);
      test.mouseUp(new go.Point(200, 100), dragdrop);

      if (palette.commandHandler.canCopySelection()) palette.commandHandler.copySelection();
      if (diagram.commandHandler.canPasteSelection()) diagram.commandHandler.pasteSelection();
    },
    function(test) {
      CheckNoDropOrPaste(test);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('incompatible dataFormat', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      diagram.model.dataFormat = "incompatible";
      diagram.undoManager.clear();
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      bpal.isSelected = true;
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(100, 50), dragdrop);
      test.mouseUp(new go.Point(200, 100), dragdrop);

      if (palette.commandHandler.canCopySelection()) palette.commandHandler.copySelection();
      if (diagram.commandHandler.canPasteSelection()) diagram.commandHandler.pasteSelection();
    },
    function(test) {
      CheckNoDropOrPaste(test);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('layerName binding', null, CommonSetupPalette,
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
          $(go.Shape, "Rectangle",
            { desiredSize: new go.Size(50, 20) },
            new go.Binding("fill", "color")
          ),
          $(go.TextBlock,
            new go.Binding("text", "key")
          )
        );
      diagram.model.copiesKey = true;
      palette.model.copiesKey = true;

      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      var bpal = palette.findNodeForKey("b");
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(100, 50), dragdrop);
      var bdia = diagram.findNodeForKey("b");
      bdia.isSelected = true; // force layerName binding update
      test.assert(diagram.partManager.addsToTemporaryLayer && bdia.layerName === "Tool", "Part.layerName should remain 'Tool' during drag");
      test.mouseMove(new go.Point(150, 75), dragdrop);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test('link drag grid snap', null,
    function(test) {
      var diagram = test.diagram;  // target diagram
      diagram.reset();
      diagram.allowDrop = true;
      diagram.grid = $(go.Panel, "Grid",
        $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
        $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
        $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
      );
      diagram.toolManager.draggingTool.dragsLink = true;
      diagram.toolManager.draggingTool.isGridSnapEnabled = true;
      diagram.undoManager.isEnabled = true;
      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          {
            corner: 5,
            dragComputation: function (part, pt, gridpt) { return gridpt; }
          },
          new go.Binding("points"),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null })
        );

      // initialize the Palette
      window.linkPaletteDiv = document.createElement('div');
      window.linkPaletteDiv.innerHTML = '<div id="myPalette" style="border: solid 1px black; width: 60px; height: 200px"></div>';
      window.linkPaletteDiv.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
      document.body.appendChild(window.linkPaletteDiv);

      window.linkPalette =
        $(go.Palette, "myPalette",  // must name or refer to the DIV HTML element
          {
            maxSelectionCount: 1,
            linkTemplate: // simplify the link template, just in this Palette
              $(go.Link,
                { corner: 5 },
                new go.Binding("points"),
                $(go.Shape,  // the link path shape
                  { isPanelMain: true, strokeWidth: 2 }),
                $(go.Shape,  // the arrowhead
                  { toArrow: "Standard", stroke: null })
              ),
            model: new go.GraphLinksModel([], [
              // the Palette also has a disconnected Link, which the user can drag-and-drop
              { points: new go.List().addAll([new go.Point(60, 40), new go.Point(30, 40), new go.Point(30, 0), new go.Point(0, 0)]) }
            ])
          });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.undoManager.clear();
      var palette = linkPalette;

      var pallink = palette.links.first();
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };
      test.mouseDown(pallink.getPoint(0), dragdrop);
      test.mouseMove(new go.Point(63, 42), dragdrop);
      test.mouseMove(new go.Point(86, 91), dragdrop);
      test.mouseUp(new go.Point(103, 107), dragdrop);

      var link = diagram.selection.first();
      test.assertLinkPoints(link, [
        new go.Point(130, 130),
        new go.Point(100, 130),
        new go.Point(100, 90),
        new go.Point(70, 90)
      ]);

      test.mouseDown(new go.Point(100, 110));
      test.mouseMove(new go.Point(103, 110));
      test.mouseMove(new go.Point(106, 113));
      test.mouseUp(new go.Point(109, 116));
      test.assertLinkPoints(link, [
        new go.Point(140, 140),
        new go.Point(110, 140),
        new go.Point(110, 100),
        new go.Point(80, 100)
      ]);
    },
    function(test) {
      // cleanup
      window.linkPalette.div = null;
      document.body.removeChild(linkPaletteDiv);
      window.linkPalette = null;
      window.linkPaletteDiv = null;
    }
  ));

  tc = new TestCollection("groups cursors");
  tcroot.add(tc);

  function SetupExternalDragDropDiagram(diag, AllowTopLevelDrops) {
    diag.reset();
    diag.handlesDragDropForTopLevelParts = true;
    diag.mouseDragOver = function(e) {
      if (AllowTopLevelDrops) {
        e.diagram.currentCursor = "";
      } else {
        e.diagram.currentCursor = "no-drop";
      }
    };
    diag.mouseDrop = function(e) {
      if (AllowTopLevelDrops) {
        // when the selection is dropped in the diagram's background,
        // make sure the selected Parts no longer belong to any Group
        var ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
        if (!ok) e.diagram.currentTool.doCancel();
      } else {
        e.diagram.currentTool.doCancel();
      }
    };
    diag.commandHandler.memberValidation = function(grp, node) {
      if (grp === null) return AllowTopLevelDrops;  // maybe allow dropping Nodes in diagram's background
      if (node instanceof go.Group) return false;  // cannot add Groups to Groups
      return grp.data.color === node.data.color;  // only OK if node's color matches the group's color
    };

    diag.nodeTemplate =
      $("Node", "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location"),
        // mouseDragEnter, mouseDragLeave, and mouseDrop handled by the group template
        // because Group.handlesDragDropForMembers is true
        $("Shape", "RoundedRectangle",
          { fill: "white" },
          new go.Binding("fill", "color")),
        $("TextBlock",
          { margin: 8 },  // make some extra space for the shape around the text
          new go.Binding("text", "key")));  // the label shows the node data's key

    var groupFill = "rgba(128,128,128,0.2)";
    var dropFill = "chartreuse";

    diag.groupTemplate =
      $(go.Group, "Vertical",
        {
          handlesDragDropForMembers: true,  // don't need to define handlers on Nodes and Links
          computesBoundsAfterDrag: true,  // allow dragging out of a Group that uses a Placeholder
          selectionObjectName: "SHAPE",  // selection handle goes around shape, not label
          locationSpot: go.Spot.Center
        },
        new go.Binding("location"),
        { // what to do when a drag-over or a drag-drop occurs on a Group
          mouseDragEnter: function(e, grp, prev) {
            if (grp.canAddMembers(grp.diagram.toolManager.draggingTool.draggingParts)) {
              var shape = grp.findObject("SHAPE");
              if (shape) shape.fill = dropFill;
              grp.diagram.currentCursor = "";
            } else {
              grp.diagram.currentCursor = "no-drop";
            }
          },
          mouseDragLeave: function(e, grp, next) {
            var shape = grp.findObject("SHAPE");
            if (shape) shape.fill = groupFill;
            grp.diagram.currentCursor = "";
          },
          mouseDrop: function(e, grp) {
            var ok = grp.addMembers(grp.diagram.selection, true);
            if (!ok) grp.diagram.currentTool.doCancel();
          }
        },
        $(go.Panel, "Horizontal",
          { alignment: go.Spot.Left },
          $("SubGraphExpanderButton"),
          $(go.TextBlock,
            { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key"),
            new go.Binding("stroke", "color"))),
        $(go.Panel, "Auto",
          { name: "BODY" },
          $(go.Shape,
            { name: "SHAPE", fill: groupFill, stroke: "gray", strokeWidth: 3 },
            new go.Binding("stroke", "color")),
          $(go.Placeholder, { padding: 10 })));

    diag.model.nodeDataArray = [
      { key: "g1", color: "green", location: new go.Point(24, 24) },  // needed to make sure the Diagram.position is near (0,0)
      { key: "y1", color: "yellow", location: new go.Point(275, 100) },
      { key: "Green2", isGroup: true, color: "green", location: new go.Point(200, 100) },
      { key: "Blue2", isGroup: true, color: "blue", location: new go.Point(350, 100) }
    ];
  }

  tc.add(new Test("drop blue not top", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, false);  // disallow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("b");  // blue
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);

      test.assert(palette.currentTool instanceof go.DraggingTool, "not dragging from Palette");

      test.mouseMove(new go.Point(150, 100), dragdrop);

      test.assert(diagram.lastInput.documentPoint.equals(new go.Point(150, 100)),
        "not at 150,100 but at " + diagram.lastInput.documentPoint.toString());

      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 150,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 200,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 275,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 350,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(350, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 1 && G2.memberParts.count === 0, "only Blue2 should have a new member");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green not top", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, false);  // disallow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 400,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 350,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 275,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 200,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 1, "only Green2 should have a new member");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green on blue not top", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, false);  // disallow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 400,100");
      test.mouseUp(new go.Point(350, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "should not have added green to Blue2");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green on back not top", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, false);  // disallow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 400,100");
      test.mouseUp(new go.Point(350, 200), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "should not have added green to Blue2");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop yellow on green not top", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, false);  // disallow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("y");  // yellow
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 400,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 350,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 275,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 200,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));


  tc.add(new Test("drop blue top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("b");  // blue
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(150, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 150,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 200,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 275,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 350,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(350, 100), dragdrop);
    },
    function(test) {
      test.assert(test.diagram.currentCursor === "auto", "cursor should be auto after mouseUp, not " + test.diagram.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 400,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 350,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 275,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 200,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      test.assert(test.diagram.currentCursor === "auto", "cursor should be auto after mouseUp, not " + test.diagram.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green on blue top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be no-drop at 400,100");
      test.mouseUp(new go.Point(350, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "should not have added green to Blue2");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop green on back top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("g");  // green
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be no-drop at 400,100");
      test.mouseUp(new go.Point(350, 200), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "should not have added green to Blue2");
      test.assert(diag.nodes.count === 5, "diagram should have 5 nodes");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop yellow on green top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("y");  // yellow
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 400,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 350,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 275,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 200,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(200, 100), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));

  tc.add(new Test("drop yellow on back top OK", null,
    function(test) {
      var diag = test.diagram;
      CommonSetupPalette(test);
      SetupExternalDragDropDiagram(diag, true);  // allow top-level drops
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 4, "diagram should have 4 nodes");
    },
    function(test) {
      var diagram = test.diagram;
      var palette = test.palette;
      var dragdrop = { sourceDiagram: palette, targetDiagram: diagram };

      diagram.position = new go.Point(0, 0);
      test.assert(diagram.defaultCursor === "auto", "defaultCursor should be auto");

      var bpal = palette.findNodeForKey("y");  // yellow
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      test.mouseMove(new go.Point(400, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 400,100");
      test.mouseMove(new go.Point(350, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 350,100");
      test.mouseMove(new go.Point(275, 100), dragdrop);
      test.assert(diagram.currentCursor === "auto", "cursor should be auto at 275,100");
      test.mouseMove(new go.Point(200, 100), dragdrop);
      test.assert(diagram.currentCursor === "no-drop", "cursor should be no-drop at 200,100, not " + diagram.currentCursor);
      test.mouseUp(new go.Point(275, 200), dragdrop);
    },
    function(test) {
      var diag = test.diagram;
      var B2 = diag.findNodeForKey("Blue2");
      var G2 = diag.findNodeForKey("Green2");
      test.assert(B2.memberParts.count === 0 && G2.memberParts.count === 0, "no group should have a member");
      test.assert(diag.nodes.count === 5, "diagram should have 5 nodes");
      test.assert(diag.currentCursor === "auto", "cursor should be auto after mouseUp, not " + diag.currentCursor);
      CommonCleanupPalette(test);
    }
  ));


  tc = new TestCollection("groups");
  tcroot.add(tc);

  function CommonSetupGroups(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.layout = $(go.TreeLayout, { angle: 90 });
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100, height: 50 },
        $(go.Shape, { fill: "lightgray" }),
        $(go.TextBlock, { width: 36, height: 14.3 }, new go.Binding("text"))
      );
    diagram.groupTemplate =
      $(go.Group, "Vertical",
        $(go.TextBlock, { width: 36, height: 14.3 }, new go.Binding("text")),
        $(go.Panel, "Auto",
          $(go.Shape, { fill: 'lightgray' }),
          $(go.Placeholder, { margin: 5 })
        )
      );
    diagram.model = new go.GraphLinksModel([
      { key: 1, text: "One" },
      { key: -2, text: "Group", isGroup: true },
      { key: 2, text: "Two", group: -2 }
    ], [
      { from: 1, to: -2 }  // to group, not to member node
    ]);
  }

  tc.add(new Test("move group", null, CommonSetupGroups,
    function(test) {
      var d = test.diagram;
      d.startTransaction();
      var g = d.findNodeForKey(-2);
      test.assert(g instanceof go.Group);
      g.move(new go.Point(g.location.x + 100, g.location.y));
      d.commitTransaction("moved group");
    },
    function(test) {
      var d = test.diagram;
      var g = d.findNodeForKey(-2);
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      test.assert(n1.location.equalsApprox(new go.Point(5.5, 0)), "moved N1 unexpectedly " + n1.location.toString());
      test.assert(n2.location.equalsApprox(new go.Point(111, 140)), "moved N2 wrong " + n2.location.toString());
      test.assert(g.location.equalsApprox(new go.Point(111, 140)), "moved G wrong " + g.location.toString());
      var l = d.links.first();
      test.assertLinkPoints(l, [new go.Point(55.5, 50.0), new go.Point(55.5, 60.0), new go.Point(161.0, 110), new go.Point(161.0, 120)]);
    }
    ));

  tc.add(new Test("move member node", null, CommonSetupGroups,
    function(test) {
      var d = test.diagram;
      d.startTransaction();
      var n2 = d.findNodeForKey(2);
      n2.move(new go.Point(n2.location.x + 100, n2.location.y));
      d.commitTransaction("moved member node");
    },
    function(test) {
      var d = test.diagram;
      var g = d.findNodeForKey(-2);
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      test.assert(n1.location.equalsApprox(new go.Point(5.5, 0)), "moved N1 unexpectedly " + n1.location.toString());
      test.assert(n2.location.equalsApprox(new go.Point(105.5, 120)), "moved N2 wrong " + n2.location.toString());
      test.assert(g.location.equalsApprox(new go.Point(105.5, 120)), "moved G wrong " + g.location.toString());
      var l = d.links.first();
      test.assertLinkPoints(l, [new go.Point(55.5, 50.0), new go.Point(55.5, 60.0), new go.Point(155.5, 90.0), new go.Point(155.5, 100.0)]);
    }
    ));

  tc.add(new Test("relocate group", null, CommonSetupGroups,  // move group without moving member node
    function(test) {
      var d = test.diagram;
      d.startTransaction();
      var g = d.findNodeForKey(-2);
      test.assert(g instanceof go.Group);
      g.location = new go.Point(g.location.x + 100, g.location.y);
      d.commitTransaction("relocated group");
    },
    function(test) {
      var d = test.diagram;
      var g = d.findNodeForKey(-2);
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      test.assert(n1.location.equalsApprox(new go.Point(5.5, 0)), "moved N1 unexpectedly " + n1.location.toString());
      test.assert(n2.location.equalsApprox(new go.Point(5.5, 120)), "moved N2 unexpectedly " + n2.location.toString());
      test.assert(g.location.equalsApprox(new go.Point(105.5, 120)), "moved G wrong" + g.location.toString());
      var l = d.links.first();
      test.assertLinkPoints(l, [new go.Point(55.5, 50.0), new go.Point(55.5, 60.0), new go.Point(155.5, 90.0), new go.Point(155.5, 100.0)]);
    }
    ));

  tc.add(new Test("ensure placeholder updates", null,

    function(test) {
      var diagram = test.diagram;
      diagram.reset();

      var $ = go.GraphObject.make;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, "Rectangle",
            { fill: "white" }),
          $(go.TextBlock, { margin: 5, width: 40, height: 15 },
            new go.Binding("text", "key"))
        );

      diagram.groupTemplate =
        $(go.Group, "Horizontal",
          {
            layout: $(go.LayeredDigraphLayout,  // automatically lay out the lane's subgraph
                      { isOngoing: false, direction: 0, columnSpacing: 10,
                        layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
                      }),
            computesBoundsAfterDrag: true,  // needed to prevent recomputing Group.placeholder bounds too soon
            computesBoundsIncludingLinks: false,  // to reduce occurrences of links going briefly outside the lane
            computesBoundsIncludingLocation: true,  // to support empty space at top-left corner of lane
            handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
          },
          $(go.Panel, "Auto",  // the lane consisting of a background Shape and a Placeholder representing the subgraph
            $(go.Shape, "Rectangle",  // this is the resized object
              { name: "SHAPE", fill: "white" },
              new go.Binding("fill", "color"),
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
            $(go.Placeholder,
              { padding: 12, alignment: go.Spot.TopLeft, background: 'lime' }),
            $(go.TextBlock,  // this TextBlock is only seen when the swimlane is collapsed
              { name: "LABEL",
                font: "bold 13pt sans-serif", editable: true,
                angle: 0, alignment: go.Spot.TopLeft, margin: new go.Margin(2, 0, 0, 4) },
              new go.Binding("visible", "isSubGraphExpanded", function(e) { return !e; }).ofObject(),
              new go.Binding("text", "text").makeTwoWay())
          )  // end Auto Panel
        );  // end Group

      diagram.model = new go.GraphLinksModel(
      [
        { key: "Lane1", text: "Lane1", isGroup: true, group: "Pool1", color: "lightblue" },
        { key: "oneA", group: "Lane1" },
        { key: "oneB", group: "Lane1" },
        { key: "oneC", group: "Lane1" },
        { key: "oneD", group: "Lane1" }
      ], []);
    },
    function(test) {
      //
    },
    function(test) {
      var d = test.diagram;
      var oneA = d.findNodeForKey('oneA');
      var L1 = d.findNodeForKey('Lane1');

      test.assert(L1.actualBounds.width === 76);
      test.mouseDown(new go.Point(20, 20), { timestamp: 0 });  // at first Node center
      test.mouseMove(new go.Point(100, 20), { timestamp: 100 });
      test.mouseUp(new go.Point(100, 20), { timestamp: 300 });
      test.assert(L1.actualBounds.width === 156); // it should have changed

    }
    ));

  tc = new TestCollection("Diagram.mouseDrop");
  tcroot.add(tc);

  function CommonSetupMouseDrop(test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("layerName"),
        $(go.Shape,
          { fill: "rgb(255, 0, 0)" },
          new go.Binding("fill")
        ),
        $(go.TextBlock,
          { margin: 10 },
          new go.Binding("text", "key")
        )
      );

    diagram.nodeTemplateMap.add("mouseDrop",
      $(go.Node, "Auto",
        { mouseDrop: function(e, obj) { updateFill(e, "#000000"); } },
        $(go.Shape, { fill: "rgb(0, 255, 0)" }),
        $(go.TextBlock,
          { margin: 10 },
          new go.Binding("text", "key")
        )
      )
    );

    // define the group template
    diagram.groupTemplate =
      $(go.Group, "Auto",
        $(go.Shape, { fill: "rgb(85, 0, 0)" }),
        $(go.Panel, "Vertical",
          { margin: 10 },
          $("SubGraphExpanderButton"),
          $(go.Placeholder)
        )
      );

    diagram.groupTemplateMap.add("childGroup",
      $(go.Group, "Auto",
        $(go.Shape, { fill: "rgb(170, 0, 0)" }),
        $(go.Panel, "Vertical",
          { margin: 10 },
          $("SubGraphExpanderButton"),
          $(go.Placeholder)
        )
      )
    );

    diagram.groupTemplateMap.add("Group mouseDrop",
      $(go.Group, "Auto",
        {
          mouseDrop: function(e, obj) { updateFill(e, "#888888"); },
          handlesDragDropForMembers: true
        },
        $(go.Shape, { fill: "rgb(0, 85, 0)" }),
        $(go.Panel, "Vertical",
          { margin: 10 },
          $("SubGraphExpanderButton"),
          $(go.Placeholder)
        )
      )
    );

    diagram.groupTemplateMap.add("childGroup mouseDrop",
      $(go.Group, "Auto",
        {
          mouseDrop: function(e, obj) { updateFill(e, "#444444"); },
          handlesDragDropForMembers: true
        },
        $(go.Shape, { fill: "rgb(0, 170, 0)" }),
        $(go.Panel, "Vertical",
          { margin: 10 },
          $("SubGraphExpanderButton"),
          $(go.Placeholder)
        )
      )
    );

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: 0, fill: "#FFFFFF", layerName: "Foreground" },
      { key: 1, category: "mouseDrop" },
      { key: 2 },
      { key: 15, isGroup: true, category: "Group mouseDrop" },
        { key: 3, group: 15, category: "mouseDrop" },
        { key: 4, group: 15 },
        { key: 16, group: 15, isGroup: true, category: "childGroup mouseDrop" },
          { key: 5, group: 16, category: "mouseDrop" },
          { key: 6, group: 16 },
        { key: 17, group: 15, isGroup: true, category: "childGroup" },
          { key: 7, group: 17, category: "mouseDrop" },
          { key: 8, group: 17 },
      { key: 18, isGroup: true },
        { key: 9, group: 18, category: "mouseDrop" },
        { key: 10, group: 18 },
        { key: 19, group: 18, isGroup: true, category: "childGroup mouseDrop" },
          { key: 11, group: 19, category: "mouseDrop" },
          { key: 12, group: 19 },
        { key: 20, group: 18, isGroup: true, category: "childGroup" },
          { key: 13, group: 20, category: "mouseDrop" },
          { key: 14, group: 20 }
    ],
    []);
  }

  function updateFill(evt, color) {
    var d = evt.diagram;
    var model = d.model;
    var nodedata = d.selection.first().data;
    model.startTransaction("set fill");
    model.setDataProperty(nodedata, "fill", color);
    model.commitTransaction("set fill");
  }

  function simulateAndAssertDrop(test, node, dropKey, fill) {
    var data = node.data;
    var diagram = node.diagram;
    var dropLoc = dropKey !== null ? diagram.findNodeForKey(dropKey).actualBounds.center : new go.Point(300, 300);
    data.fill = "#FFFFFF"; // reset fill
    test.mouseDown(node.actualBounds.center, { timestamp: 0 });
    test.mouseMove(dropLoc, { timestamp: 100 });
    test.mouseUp(dropLoc, { timestamp: 200 });
    test.assert(data.fill === fill, dropKey + ": expected fill = " + fill + ", actual fill = " + data.fill);
  }

  tc.add(new Test("handlesDragDrop = true", null, CommonSetupMouseDrop,
    function(test) {
      var d = test.diagram;
      d.mouseDrop = function(e, obj) { updateFill(e, "#BBBBBB"); };
      d.handlesDragDropForTopLevelParts = true;
    },
    function(test) {
      var n0 = test.diagram.findNodeForKey(0);

      // drop on diagram background
      simulateAndAssertDrop(test, n0, null, "#BBBBBB");

      // drop on top level node with mouseDrop
      simulateAndAssertDrop(test, n0, 1, "#BBBBBB");

      // drop on top level node without mouseDrop
      simulateAndAssertDrop(test, n0, 2, "#BBBBBB");

      // drop on group with mouseDrop
      simulateAndAssertDrop(test, n0, 15, "#888888");

      // drop on node with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 3, "#888888");

      // drop on node without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 4, "#888888");

      // drop on child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 16, "#444444");

      // drop on node with mouseDrop in child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 5, "#444444");

      // drop on node without mouseDrop child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 6, "#444444");

      // drop on child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 17, "#FFFFFF");

      // drop on node with mouseDrop in child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 7, "#000000");

      // drop on node without mouseDrop child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 8, "#FFFFFF");

      // drop on group without mouseDrop
      simulateAndAssertDrop(test, n0, 18, "#FFFFFF");

      // drop on node with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 9, "#000000");

      // drop on node without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 10, "#FFFFFF");

      // drop on child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 19, "#444444");

      // drop on node with mouseDrop in child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 11, "#444444");

      // drop on node without mouseDrop child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 12, "#444444");

      // drop on child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 20, "#FFFFFF");

      // drop on node with mouseDrop in child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 13, "#000000");

      // drop on node without mouseDrop child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 14, "#FFFFFF");
    }
  ));

  tc.add(new Test("handlesDragDrop = false", null, CommonSetupMouseDrop,
    function(test) {
      var d = test.diagram;
      d.mouseDrop = function(e, obj) { updateFill(e, "#BBBBBB"); };
      d.handlesDragDropForTopLevelParts = false;
    },
    function(test) {
      var n0 = test.diagram.findNodeForKey(0);

      // drop on diagram background
      simulateAndAssertDrop(test, n0, null, "#BBBBBB");

      // drop on top level node with mouseDrop
      simulateAndAssertDrop(test, n0, 1, "#000000");

      // drop on top level node without mouseDrop
      simulateAndAssertDrop(test, n0, 2, "#FFFFFF");

      // drop on group with mouseDrop
      simulateAndAssertDrop(test, n0, 15, "#888888");

      // drop on node with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 3, "#888888");

      // drop on node without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 4, "#888888");

      // drop on child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 16, "#444444");

      // drop on node with mouseDrop in child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 5, "#444444");

      // drop on node without mouseDrop child group with mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 6, "#444444");

      // drop on child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 17, "#FFFFFF");

      // drop on node with mouseDrop in child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 7, "#000000");

      // drop on node without mouseDrop child group without mouseDrop in group with mouseDrop
      simulateAndAssertDrop(test, n0, 8, "#FFFFFF");

      // drop on group without mouseDrop
      simulateAndAssertDrop(test, n0, 18, "#FFFFFF");

      // drop on node with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 9, "#000000");

      // drop on node without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 10, "#FFFFFF");

      // drop on child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 19, "#444444");

      // drop on node with mouseDrop in child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 11, "#444444");

      // drop on node without mouseDrop child group with mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 12, "#444444");

      // drop on child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 20, "#FFFFFF");

      // drop on node with mouseDrop in child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 13, "#000000");

      // drop on node without mouseDrop child group without mouseDrop in group without mouseDrop
      simulateAndAssertDrop(test, n0, 14, "#FFFFFF");
    }
  ));


  tc = new TestCollection("2 diagrams");
  tcroot.add(tc);

  function CommonSetupDiagram2(test) {
    var diagram = test.diagram;  // target diagram
    diagram.reset();
    diagram.allowDrop = true;
    diagram.toolManager.draggingTool.dragsLink = true;
    diagram.toolManager.linkingTool.isUnconnectedLinkValid = true;
    diagram.toolManager.linkingTool.portGravity = 10;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.toolManager.relinkingTool.portGravity = 10;
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { width: 50, height: 25 },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, { fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );
    diagram.linkTemplate =
      $(go.Link,
        { relinkableFrom: true, relinkableTo: true, reshapable: true, resegmentable: true, adjusting: go.Link.Stretch },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape, { strokeWidth: 3 }),
        $(go.Shape, { toArrow: "Standard" })
      );

    diagram.undoManager.isEnabled = true;

    // initialize the second Diagram
    if (!window.diagramDiv2) {
      window.diagramDiv2 = document.createElement('div');
      window.diagramDiv2.innerHTML = '<div id="myDiagram2" style="border: solid 1px black; width: 120px; height: 200px"></div>';
      window.diagramDiv2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
      document.body.appendChild(window.diagramDiv2);

      var pal = window.diagram2 = $(go.Diagram, "myDiagram2",
        {
          initialScale: 0.8,
          allowDragOut: true,
          "draggingTool.dragsLink": true,
          "linkingTool.isUnconnectedLinkValid": true,
          "linkingTool.portGravity": 10,
          "relinkingTool.isUnconnectedLinkValid": true,
          "relinkingTool.portGravity": 10,
          nodeTemplate: diagram.nodeTemplate,
          linkTemplate: diagram.linkTemplate,
          "animationManager.isEnabled": false,
          "undoManager.isEnabled": true
        });
      pal.model.nodeDataArray = [
        { key: "g", color: "lightgreen", loc: "0 0" },
        { key: "b", color: "lightblue", loc: "0 60" },
        { key: "y", color: "yellow", loc: "0 120" }
      ];
      pal.model.linkDataArray = [
        { from: "g", points: [50, 25, 75, 25, 100, 75] },
        { to: "g", points: [-25, 50, 0, 25] },
        { points: [25, 150, -5, 170, 55, 190] },
        { points: [35, 160, 5, 180, 65, 200] }
      ];
      pal.maybeUpdate();
    }
    test.diagram2 = window.diagram2;
    test.diagramDiv2 = window.diagramDiv2;

    test.assert(diagram.nodes.count === 0 && window.diagram2.nodes.count === 3, "Diagram2 doesn't have three nodes");
  }

  function CommonCleanupDiagram2(test) {
    if (test.diagram2) {
      test.diagram2.div = null;
      test.diagram2 = null;
    }
    if (test.diagramDiv2) {
      document.body.removeChild(test.diagramDiv2);
      test.diagramDiv2 = null;
      window.diagramDiv2 = null;
    }
  }

  tc.add(new Test('simple drag-and-drop', null, CommonSetupDiagram2,
    function(test) {
      var diagram = test.diagram;
      var diagram2 = test.diagram2;
      var dragdrop = { sourceDiagram: diagram2, targetDiagram: diagram };

      var bpal = diagram2.findNodeForKey("b");
      var bpos = bpal.actualBounds.center;
      test.mouseDown(bpos, dragdrop);
      bpos.x += 10; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      bpos.x += 150; bpos.y += 10;
      test.mouseMove(bpos, dragdrop);
      bpos.x += 10;
      test.mouseUp(bpos, dragdrop);
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 1, "should have dropped 1 node");
      var dataarr = diagram.model.nodeDataArray;
      test.assert(dataarr.length === 1 && dataarr[0].color === "lightblue", "dropped data should have blue color");
      CommonCleanupDiagram2(test);
    }
  ));

  tc.add(new Test('drag-and-drop-with-links', null, CommonSetupDiagram2,
    function(test) {
      var diagram = test.diagram;
      var diagram2 = test.diagram2;
      var dragdrop = { sourceDiagram: diagram2, targetDiagram: diagram };
      diagram.model.copiesKey = true;
      diagram2.model.copiesKey = true;

      var bpal = diagram2.findNodeForKey("g");
      if (bpal) {
        bpal.isSelected = true;
        bpal.linksConnected.each(function(l) { l.isSelected = true; });
        var bpos = bpal.actualBounds.center;
        test.mouseDown(bpos, dragdrop);
        bpos.x += 10; bpos.y += 10;
        test.mouseMove(bpos, dragdrop);
        bpos.x += 150; bpos.y += 10;
        test.mouseMove(bpos, dragdrop);
        bpos.x += 10;
        test.mouseUp(bpos, dragdrop);
      }
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 1, "should have dropped 1 node");
      var dataarr = diagram.model.nodeDataArray;
      test.assert(dataarr.length === 1 && dataarr[0].color === "lightgreen", "dropped data should have green color");
      var linkarr = diagram.model.linkDataArray;
      var ld = linkarr[0];
      var ld2 = linkarr[1];
      test.assert(linkarr.length === 2 && ld.from === "g" && ld.to === undefined && ld2.from === undefined && ld2.to === "g", "should have two half-disconnected links");
      test.assertAllLinkPoints([
        [new go.Point(234.0,45.8), new go.Point(259.0,45.8), new go.Point(284.0,95.8)],
        [new go.Point(159.0,70.8), new go.Point(184.0,45.8)]
      ]);
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupDiagram2(test);
    }
  ));

  tc.add(new Test('drag link alone', null, CommonSetupDiagram2,
    function(test) {
      var diagram = test.diagram;
      var diagram2 = test.diagram2;
      var dragdrop = { sourceDiagram: diagram2, targetDiagram: diagram };

      var disco = diagram2.findLinkForData(diagram2.model.linkDataArray[2]);
      if (disco) {
        disco.isSelected = true;
        var dpos = disco.getPoint(1).copy();
        test.mouseDown(dpos, dragdrop);
        dpos.x += 10; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 150; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 10;
        test.mouseUp(dpos, dragdrop);
      }
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 0, "should have dropped no nodes");
      var linkarr = diagram.model.linkDataArray;
      var ld = linkarr[0];
      test.assert(linkarr.length === 1 && ld.from === undefined && ld.to === undefined, "should have a copy of the fully-disconnected link");
      test.assertAllLinkPoints([[new go.Point(165.0,170.0), new go.Point(135.0,190.0), new go.Point(195.0,210.0)]]);
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupDiagram2(test);
    }
  ));

  tc.add(new Test('drag 4 links, 2 disconnected', null, CommonSetupDiagram2,
    function(test) {
      var diagram = test.diagram;
      var diagram2 = test.diagram2;
      var dragdrop = { sourceDiagram: diagram2, targetDiagram: diagram };

      diagram2.selectCollection(diagram2.links);
      var disco = diagram2.findLinkForData(diagram2.model.linkDataArray[2]);
      if (disco) {
        var dpos = disco.getPoint(1).copy();
        test.mouseDown(dpos, dragdrop);
        dpos.x += 10; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 150; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 10;
        test.mouseUp(dpos, dragdrop);
      }
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 0, "should have dropped no nodes");
      var linkarr = diagram.model.linkDataArray;
      var ld = linkarr[0];
      var ld2 = linkarr[1];
      test.assert(linkarr.length === 2 && ld.from === undefined && ld.to === undefined && ld2.from === undefined && ld2.to === undefined, "should have a copies of the fully-disconnected links");
      test.assertAllLinkPoints([
        [new go.Point(191.5,186.5), new go.Point(161.5,206.5), new go.Point(221.5,226.5)],
        [new go.Point(201.5,196.5), new go.Point(171.5,216.5), new go.Point(231.5,236.5)]
      ]);
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupDiagram2(test);
    }
  ));

  tc.add(new Test('drag node & 1 disconnected', null, CommonSetupDiagram2,
    function(test) {
      var diagram = test.diagram;
      var diagram2 = test.diagram2;
      var dragdrop = { sourceDiagram: diagram2, targetDiagram: diagram };

      diagram2.clearSelection();
      var nodeb = diagram2.findNodeForKey("b");
      if (nodeb) nodeb.isSelected = true;
      var disco = diagram2.findLinkForData(diagram2.model.linkDataArray[2]);
      if (disco) {
        disco.isSelected = true;
        var dpos = disco.getPoint(1).copy();
        test.mouseDown(dpos, dragdrop);
        dpos.x += 10; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 150; dpos.y += 10;
        test.mouseMove(dpos, dragdrop);
        dpos.x += 10;
        test.mouseUp(dpos, dragdrop);
      }
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 1, "should have dropped one node");
      var linkarr = diagram.model.linkDataArray;
      var ld = linkarr[0];
      test.assert(linkarr.length === 1 && ld.from === undefined && ld.to === undefined, "should have a copy of the fully-disconnected link");
      test.assertAllLinkPoints([[new go.Point(193.3,235.8), new go.Point(163.3,255.8), new go.Point(223.3,275.8)]]);
      test.assert(diagram.undoManager.history.count === 1, "UndoManager should have 1 Transaction");
      CommonCleanupDiagram2(test);
    }
  ));

})();