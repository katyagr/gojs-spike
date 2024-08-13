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
var intro = new TestCollection('undo/redo');
TestRoot.add(intro);
var $ = go.GraphObject.make;

function commonSetup(test) {
  var $ = go.GraphObject.make;
  test.diagram.nodeTemplate =
$(go.Node, "Auto",
  new go.Binding("layerName", "ln"),
  $(go.Shape,
    { figure: "RoundedRectangle", fill: 'lime' },
    // Shape.fill is bound to Node.data.color
    new go.Binding("fill", "color")),
  $(go.TextBlock,
    { margin: 3 },  // some room around the text
    // TextBlock.text is bound to Node.data.key
    new go.Binding("text", "key")));
  test.diagram.undoManager.isEnabled = false;
}

intro.add(new Test('Simple undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        //{key: 1, text: "n1"}
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    },
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      test.assert(d.nodes.count === 0)
      m.addNodeData( { key:1, text: "1" } )
      test.assert(d.nodes.count === 1)

      m.startTransaction(test.name);
      m.addNodeData( { key:2, text: "2" } )
      m.commitTransaction(test.name);
      test.assert(d.nodes.count === 2)

      mgr.undo();
      test.assert(d.nodes.count === 0)

      mgr.redo();
      test.assert(d.nodes.count === 2)
    }, // END TEST
    null
));


intro.add(new Test('undo/redo 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      commonSetup(test)
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        //{key: 1, text: "n1"}
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    },// END SETUP
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      test.assert(d.nodes.count === 0)
      m.addNodeData( { key:1, text: "1" } )
      test.assert(d.nodes.count === 1)

      m.startTransaction(test.name);
      m.addNodeData( { key:2, text: "2", ln: 'Background' } )
      m.commitTransaction(test.name);

      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName)
      test.assert(d.findNodeForKey(2).layer.name == 'Background')
      test.assert(d.findLayer('Background').parts.count === 1)
      test.assert(d.nodes.count === 2);
      mgr.undo();
      test.assert(d.findNodeForKey(2) === null);
      test.assert(d.findLayer('Background').parts.count === 0)
      test.assert(d.nodes.count === 0);
      mgr.redo();
      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName)
      test.assert(d.findNodeForKey(2).layer.name == 'Background')
      test.assert(d.findLayer('Background').parts.count === 1)
      test.assert(d.nodes.count === 2);
    }, // END TEST
    null
));


intro.add(new Test('switch layer undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      commonSetup(test)
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        //{key: 1, text: "n1"}
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    }, // END SETUP
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      test.assert(d.nodes.count === 0)
      m.addNodeData( { key:1, text: "1" } )
      test.assert(d.nodes.count === 1)

      d.maybeUpdate();

      m.startTransaction(test.name);
      m.addNodeData( { key:2, text: "2", ln: 'Background' } )
      m.commitTransaction(test.name);

      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName)
      test.assert(d.findNodeForKey(2).layer.name == 'Background')
      test.assert(d.findLayer('Background').parts.count === 1)
      test.assert(d.nodes.count === 2);
      m.startTransaction(test.name);
      m.setDataProperty(d.findNodeForKey(2).data, 'ln', 'Foreground');
      m.commitTransaction(test.name);
      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName);
      test.assert(d.findNodeForKey(2).layer.name == 'Foreground');
      test.assert(d.nodes.count === 2);
      mgr.undo();
      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName) // Will fail if layer is inconsistent with layerName
      test.assert(d.findNodeForKey(2).layer.name == 'Background')
      mgr.redo();
      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName);
      test.assert(d.findNodeForKey(2).layer.name == 'Foreground');
      test.assert(d.nodes.count === 2);
    }, // END TEST
    null
));


intro.add(new Test('switchlayer2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        //{key: 1, text: "n1"}
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    }, // END SETUP
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      test.assert(d.nodes.count === 0)
      m.startTransaction(test.name);
      m.addNodeData( { key:1, text: "1" } )
      test.assert(d.nodes.count === 1)
      m.addNodeData( { key:2, text: "2", ln: 'Background' } )
      m.commitTransaction(test.name);

      m.startTransaction(test.name);
      m.removeNodeData(d.findNodeForKey(2).data);
      m.commitTransaction(test.name);
      test.assert(d.findNodeForKey(2) === null);
      mgr.undo();
      test.assert(d.findNodeForKey(2).layer.name == d.findNodeForKey(2).layerName)
      test.assert(d.findNodeForKey(2).layer.name == 'Background')
    }, // END TEST
    null
));

intro.add(new Test('Change link category', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $("Node", "Horizontal",
          new go.Binding("location", "loc", go.Point.parse),
          $("Shape",
            { width: 5, height: 5, fill: null,
              portId: "in", toSpot: go.Spot.Left }),
          $("TextBlock",
            { width: 30, textAlign: "center" },
            new go.Binding("text", "key")),
          $("Shape",
            { width: 5, height: 5, fill: null,
              portId: "out", fromSpot: go.Spot.Right }));
      diagram.linkTemplate =
        $("Link",
          $("Shape"));
      diagram.linkTemplateMap.add("thick",
        $("Link",
          $("Shape", { strokeWidth: 4, stroke: "blue" })));
      var m =
        $("GraphLinksModel",
          { linkFromPortIdProperty: "o",
            linkToPortIdProperty: "i" });
      m.nodeDataArray = [
        { key: 1, text: "n1", loc: "0 0" },
        { key: 2, text: "n2", loc: "0 100" },
      ];
      m.linkDataArray = [
        { from: 1, o: "out", to: 2, i: "in" }
      ];
      test.diagram.model = m;
    }, // END SETUP
    function(test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      d.maybeUpdate();

      var link = d.findLinkForData(m.linkDataArray[0]);
      test.assert(link.fromPortId === "out" && link.data.o === "out", "link should be coming out of 'out' port");
      test.assert(link.toPortId === "in" && link.data.i === "in", "link should be going into 'in' port");
      test.assertLinkPoints(link, [new go.Point(42, 7), new go.Point(52, 7), new go.Point(-10, 107), new go.Point(0, 107)]);

      d.startTransaction("change link category");
      link.category = "thick";
      d.commitTransaction();
    }, // END TEST
    function(test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var link = d.findLinkForData(m.linkDataArray[0]);
      test.assert(link.fromPortId === "out" && link.data.o === "out", "link should be coming out of 'out' port");
      test.assert(link.toPortId === "in" && link.data.i === "in", "link should be going into 'in' port");
      test.assertLinkPoints(link, [new go.Point(42, 7), new go.Point(52, 7), new go.Point(-10, 107), new go.Point(0, 107)]);
      test.assert(link.category === "thick", "didn't change Link.category to 'thick'");
      test.assert(link.data.category === "thick", "didn't change Link.data.category to 'thick'");
      var mgr = test.diagram.undoManager;
      test.assert(mgr.transactionToUndo !== null && mgr.transactionToUndo.name === "change link category", "Transaction.name isn't 'change link category'");
    }
));

intro.add(new Test('Change link category undo', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $("Node", "Horizontal",
          new go.Binding("location", "loc", go.Point.parse),
          $("Shape",
            { width: 5, height: 5, fill: null,
              portId: "in", toSpot: go.Spot.Left
            }),
          $("TextBlock",
            { width: 30, textAlign: "center" },
            new go.Binding("text", "key")),
          $("Shape",
            { width: 5, height: 5, fill: null,
              portId: "out", fromSpot: go.Spot.Right
            }));
      diagram.linkTemplate =
        $("Link",
          $("Shape"));
      diagram.linkTemplateMap.add("thick",
        $("Link",
          $("Shape", { strokeWidth: 4, stroke: "blue" })));
      var m =
        $("GraphLinksModel",
          { linkFromPortIdProperty: "o",
            linkToPortIdProperty: "i"
          });
      m.nodeDataArray = [
        { key: 1, text: "n1", loc: "0 0" },
        { key: 2, text: "n2", loc: "0 100" },
      ];
      m.linkDataArray = [
        { from: 1, o: "out", to: 2, i: "in" }
      ];
      test.diagram.model = m;
    }, // END SETUP
    function(test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      d.maybeUpdate();

      var link = d.findLinkForData(m.linkDataArray[0]);
      test.assertLinkPoints(link, [new go.Point(42, 7), new go.Point(52, 7), new go.Point(-10, 107), new go.Point(0, 107)]);

      d.startTransaction();
      link.category = "thick";
      d.commitTransaction("change link category");

      mgr.undo();
    }, // END TEST
    function(test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var link = d.findLinkForData(m.linkDataArray[0]);
      test.assertLinkPoints(link, [new go.Point(42, 7), new go.Point(52, 7), new go.Point(-10, 107), new go.Point(0, 107)]);
      test.assert(link.category === "", "didn't change Link.category back to default");
      test.assert(link.data.category === "", "didn't change Link.data.category back to default");
      var mgr = test.diagram.undoManager;
      test.assert(mgr.transactionToRedo !== null && mgr.transactionToRedo.name === "change link category", "Transaction.name isn't 'change link category'");
      }
));

intro.add(new Test('Expand collapse while changing categories', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // replace standard node template:
      d.nodeTemplate =
        $(go.Node,
          $(go.TextBlock,
            { name: 'TextBlock' },
            new go.Binding('text', 't', go.Binding.toString))
          //, new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
          );

      // replace standard Group template:
      d.groupTemplate =
        $(go.Group, "Vertical",
          { ungroupable: true,
            locationObjectName: 'GPH',
            fromSpot: go.Spot.Right, toSpot: go.Spot.Left,
            defaultAlignment: go.Spot.Left },
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("locationObjectName", "isSubGraphExpanded", function(exp) { return exp ? "GPH" : ""; }).ofObject(),
          {  },
          { isSubGraphExpanded: true,  // this is also the default value
            subGraphExpandedChanged: function(g) { g.category = "Collapsed"; }
          },
          $(go.Panel, "Horizontal",  // group header
            { defaultAlignment: go.Spot.Center },
            $("SubGraphExpanderButton"),
            $(go.TextBlock,  // group title
              { font: 'Bold 16pt Sans-Serif' },
              new go.Binding('text', 't'))),  // end group header
          $(go.Placeholder,
            { name: 'GPH', padding: 5, background: 'rgba(0, 0, 0, 0.1)' },
            new go.Binding("visible", "isSubGraphExpanded").ofObject()));

      d.groupTemplateMap.add("Collapsed",
        $(go.Group, "Horizontal",
          { locationSpot: go.Spot.BottomLeft,
            background: 'rgba(0, 0, 0, 0.1)' },
          { isSubGraphExpanded: false,
            subGraphExpandedChanged: function(g) { g.category = ""; } },
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $("SubGraphExpanderButton"),
          $(go.TextBlock,  // group title
            { font: '16pt Sans-Serif' },
            new go.Binding('text', 't'))));

      d.commandHandler.archetypeGroupData = { id: 12, t: "New Group", isGroup: true, loc: "50 50" };

      var m = new go.GraphLinksModel();
      m.nodeKeyProperty = 'id';
      m.linkFromKeyProperty = 'f';
      m.linkToKeyProperty = 't';

      d.model = m;

      m.nodeDataArray = [
        {id: 11, t: "Group1", isGroup: true, group: 0 },
        {id: 2, t: "second", loc: "100 100", group: 11 },
        {id: 22, t: "Group2", isGroup: true, group: 0 },
        {id: 4, t: "fourth", loc: "150 250", group:22 },
        {id: 0, t: "GroupZero", isGroup: true }
      ];

      m.linkDataArray = [
        {f: 2, t: 4 }
      ];

      d.undoManager.isEnabled = true;

    }, // END SETUP
    null,
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      var g0 = d.findNodeForKey(0)
      var g1 = d.findNodeForKey(11)
      var g2 = d.findNodeForKey(22)
      var l = d.links; l.next(); l = l.value;
      test.assert(l.actualBounds.width > 60 && l.actualBounds.width < 71.525, "link width not within expected range");


      d.startTransaction('a');
      g1.collapseSubGraph(); //g2.collapseSubGraph();
      d.commitTransaction('a');
/*
      test.assert(!g1.isSubGraphExpanded && !g2.isSubGraphExpanded) // should both be collapsed
      test.assert(l.actualBounds.width < 30 && l.actualBounds.width > 23); // link should be small


      d.startTransaction('a');
      g1.expandSubGraph(); g2.expandSubGraph();
      d.commitTransaction('a');

      test.assert(l.actualBounds.width > 60 && l.actualBounds.width < 70);
      test.assert(g1.isSubGraphExpanded && g2.isSubGraphExpanded) // link should be larger again

      d.startTransaction('a');
      g0.collapseSubGraph();
      d.commitTransaction('a');

      test.assert(!g1.isSubGraphExpanded && !g2.isSubGraphExpanded) // should both be collapsed
      test.assert(!g0.isSubGraphExpanded) // should also be collapsed
      d.startTransaction('a');
      g0.expandSubGraph();
      d.commitTransaction('a');

      test.assert(!g1.isSubGraphExpanded && !g2.isSubGraphExpanded) // should STILL both be collapsed
      test.assert(g0.isSubGraphExpanded) // should no longer be collaposed
      test.assert(l.actualBounds.width < 30 && l.actualBounds.width > 23); // link should be small
      d.startTransaction('a');
      g1.expandSubGraph(); g2.expandSubGraph();
      d.commitTransaction('a');

      test.assert(l.actualBounds.width > 60 && l.actualBounds.width < 70);
      test.assert(g1.isSubGraphExpanded && g2.isSubGraphExpanded) // link should be larger again*/
    } // END TEST
));

  // this function changes the category of the node data to cause the Node to be replaced
function changeCategory(e, obj) {
  var node = obj.part;
  if (node) {
    var diagram = node.diagram;
    diagram.startTransaction("changeCategory");
    var cat = diagram.model.getCategoryForNodeData(node.data);
    if (cat === "simple")
      cat = "detailed";
    else
      cat = "simple";
    diagram.model.setCategoryForNodeData(node.data, cat);
    diagram.commitTransaction("changeCategory");
  }
}

function setupSimpleDetailTemplates(test) {
  var diagram = test.diagram;
  diagram.reset();

  // The "simple" template just shows the key string and the color in the background.
  // There is a Button to invoke the changeCategory function.
  var simpletemplate =
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "Ellipse",
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      ),
      $("Button",
        { alignment: go.Spot.TopRight },
        $(go.Shape, "AsteriskLine", { width: 8, height: 8 }),
        { click: changeCategory })
    );

  // The "detailed" template shows all of the information in a Table Panel.
  // There is a Button to invoke the changeCategory function.
  var detailtemplate =
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          new go.Binding("fill", "color")),
        $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
          $(go.TextBlock, { row: 1, column: 0 }, "Description:"),
          $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "desc")),
          $(go.TextBlock, { row: 2, column: 0 }, "Color:"),
          $(go.TextBlock, { row: 2, column: 1, editable: true, name: "COLORFIELD" }, new go.Binding("text", "color").makeTwoWay())
        )
      ),
      $("Button",
        { alignment: go.Spot.TopRight },
        $(go.Shape, "AsteriskLine", { width: 8, height: 8 }),
        { click: changeCategory })
    );

  var templmap = new go.Map(/*"string", go.Node*/);
  templmap.add("simple", simpletemplate);
  templmap.add("detailed", detailtemplate);
  diagram.nodeTemplateMap = templmap;

  diagram.layout = $(go.TreeLayout);

  diagram.model.nodeDataArray = [
    { key: "Beta", desc: "second letter", color: "lightblue", category: "simple" },
    { key: "Gamma", desc: "third letter", color: "pink", category: "detailed" },
    { key: "Delta", desc: "fourth letter", color: "cyan", category: "detailed" }
  ];
  diagram.model.linkDataArray = [
    { from: "Beta", to: "Gamma" },
    { from: "Gamma", to: "Delta" }
  ];

  diagram.undoManager.isEnabled = true;
}

intro.add(new Test("change category undo", null, setupSimpleDetailTemplates,
  function(test) {
    var diagram = test.diagram;
    var beta = diagram.findNodeForKey("Beta");
    test.assert(beta !== null && beta.category === "simple" && beta.actualBounds.width < 100, "Beta should be simple and narrow");
    var gamma = diagram.findNodeForKey("Gamma");
    test.assert(gamma !== null && gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");
    test.assert(gamma.data.color === "pink" && !gamma.resizable, "Gamma should still have default values");

    diagram.startTransaction("change color");
    var colorfield = gamma.findObject("COLORFIELD");
    test.assert(colorfield instanceof go.TextBlock);
    colorfield.text = "lightgreen";
    gamma.resizable = true;
    diagram.commitTransaction("change color");
    test.assert(gamma.data.color === "lightgreen" && gamma.resizable, "didn't update data.color to lightgreen")

    changeCategory(null, beta);
    test.assert(beta.category === "detailed" && beta.actualBounds.width > 100, "Beta isn't detailed or wide");
    test.assert(gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");
    test.assert(gamma.data.color === "lightgreen" && gamma.resizable, "data.color changed")

    changeCategory(null, gamma);
    test.assert(beta.category === "detailed" && beta.actualBounds.width > 100, "Beta isn't detailed or wide");
    test.assert(gamma.category === "simple" && gamma.actualBounds.width < 100, "Gamma should be simple and narrow");
    test.assert(gamma.data.color === "lightgreen" && !gamma.resizable, "data.color changed or didn't default resizable back to true")
  },
  function(test) {
    var diagram = test.diagram;
    var beta = diagram.findNodeForKey("Beta");
    var gamma = diagram.findNodeForKey("Gamma");

    diagram.undoManager.undo();
    test.assert(beta.category === "detailed" && beta.actualBounds.width > 100, "Beta isn't detailed or wide");
    test.assert(gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");

    diagram.undoManager.undo();
    test.assert(beta.category === "simple" && beta.actualBounds.width < 100, "Beta should be simple and narrow");
    test.assert(gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");
    test.assert(gamma.data.color === "lightgreen" && gamma.resizable, "Gamma should still be lightgreen and resizable");

    diagram.undoManager.undo();
    test.assert(beta.category === "simple" && beta.actualBounds.width < 100, "Beta should be simple and narrow");
    test.assert(gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");
    test.assert(gamma.data.color === "pink" && !gamma.resizable, "didn't undo back to pink background for Gamma");

    diagram.undoManager.redo();
    test.assert(gamma.data.color === "lightgreen" && gamma.resizable, "didn't restore data.color to lightgreen & resizable");

    diagram.undoManager.redo();
    test.assert(gamma.data.color === "lightgreen" && gamma.resizable, "didn't restore data.color to lightgreen & resizable");
    test.assert(beta.category === "detailed" && beta.actualBounds.width > 100, "Beta isn't detailed or wide");
    test.assert(gamma.category === "detailed" && gamma.actualBounds.width > 100, "Gamma isn't detailed or wide");

    diagram.undoManager.redo();
    test.assert(gamma.data.color === "lightgreen" || !gamma.resizable, "data.color changed or didn't restore resizable to default from template");
    test.assert(beta.category === "detailed" && beta.actualBounds.width > 100, "Beta isn't detailed or wide");
    test.assert(gamma.category === "simple" && gamma.actualBounds.width < 100, "Gamma should be simple and narrow");
  }
));

intro.add(new Test('change category out of model', null, setupSimpleDetailTemplates,
  function(test) {
    var diagram = test.diagram;
    var model = diagram.model;
    var gamma = diagram.findNodeForKey("Gamma");
    test.assert(gamma !== null && gamma.category === "detailed", "Gamma should be detailed");

    diagram.startTransaction("change category");
    var gammadata = gamma.data;
    model.removeNodeData(gammadata);
    gammadata.category = "simple";
    model.addNodeData(gammadata);
    diagram.commitTransaction("change category");
    // need to refetch the Gamma Node, because it was deleted and then recreated anew as "simple"
    gamma = diagram.findNodeForKey("Gamma");
    test.assert(gamma !== null && gamma.category === "simple" && gammadata.category === "simple", "Gamma should now be simple");
    test.assert(model.nodeDataArray.length === 3 && model.linkDataArray.length === 2 &&
                diagram.nodes.count === 3 && diagram.links.count === 2, "should still have 3 nodes and 2 links");
  },
  function(test) {
    var diagram = test.diagram;
    var model = diagram.model;

    diagram.undoManager.undo();
    var gamma = diagram.findNodeForKey("Gamma");
    test.assert(gamma !== null && gamma.category === "detailed" && gamma.data.category === "simple", "Gamma should be detailed, but data remains simple because it was modified without notification");
    test.assert(model.nodeDataArray.length === 3 && model.linkDataArray.length === 2 &&
                diagram.nodes.count === 3 && diagram.links.count === 2, "should still have 3 nodes and 2 links");

    diagram.undoManager.redo();
    // need to refetch the Gamma Node, because it was deleted and then recreated anew as "simple"
    gamma = diagram.findNodeForKey("Gamma");
    test.assert(gamma !== null && gamma.category === "simple" && gamma.data.category === "simple", "Gamma should now be simple");
    test.assert(model.nodeDataArray.length === 3 && model.linkDataArray.length === 2 &&
                diagram.nodes.count === 3 && diagram.links.count === 2, "should still have 3 nodes and 2 links");
  }
));

intro.add(new Test('undo/redo linkpoints', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      // replace standard node template:
      d.nodeTemplate =
        $(go.Node,
          $(go.TextBlock,
            { name: 'TextBlock', width: 40, height: 14, background: 'palegreen' },
            new go.Binding('text', 't', go.Binding.toString))
          //, new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify)
          );

      // replace standard Group template:
      d.groupTemplate =
        $(go.Group, "Vertical",
          { ungroupable: true,
            locationObjectName: 'GPH',
            fromSpot: go.Spot.Right, toSpot: go.Spot.Left,
            defaultAlignment: go.Spot.Left },
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("locationObjectName", "isSubGraphExpanded", function(exp) { return exp ? "GPH" : ""; }).ofObject(),
          {  },
          { isSubGraphExpanded: true,  // this is also the default value
            subGraphExpandedChanged: function(g) { g.category = "Collapsed"; }
          },
          $(go.Panel, "Horizontal",  // group header
            { defaultAlignment: go.Spot.Center },
            $("SubGraphExpanderButton"),
            $(go.TextBlock,  // group title
              { font: 'Bold 16pt Sans-Serif' },
              new go.Binding('text', 't'))),  // end group header
          $(go.Placeholder,
            { name: 'GPH', padding: 5, background: 'rgba(0, 0, 0, 0.1)' },
            new go.Binding("visible", "isSubGraphExpanded").ofObject()));

      d.groupTemplateMap.add("Collapsed",
        $(go.Group, "Horizontal",
          { locationSpot: go.Spot.BottomLeft,
            background: 'rgba(0, 0, 0, 0.1)' },
          { isSubGraphExpanded: false,
            subGraphExpandedChanged: function(g) { g.category = ""; } },
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $("SubGraphExpanderButton"),
          $(go.TextBlock,  // group title
            { font: '16pt Sans-Serif' },
            new go.Binding('text', 't'))));

      d.commandHandler.archetypeGroupData = { id: 12, t: "New Group", isGroup: true, loc: "50 50" };

      var m = new go.GraphLinksModel();
      m.nodeKeyProperty = 'id';
      m.linkFromKeyProperty = 'f';
      m.linkToKeyProperty = 't';

      d.model = m;

      m.nodeDataArray = [
        //{id: 11, t: "Group1", isGroup: true, group: 0 },
        {id: 2, t: "second", loc: "100 100", group: 11 },
        //{id: 22, t: "Group2", isGroup: true, group: 0 },
        {id: 4, t: "fourth", loc: "150 250", group:22 },
        //{id: 0, t: "GroupZero", isGroup: true }
      ];

      m.linkDataArray = [
        {f: 2, t: 4 }
      ];

      d.startTransaction('mgr');
          d.undoManager.isEnabled = true;
      d.commitTransaction('mgr');

    }, // END SETUP
    function (test) {
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      var l = d.links; l.next(); l = l.value;

      function mouseDown(pt, ctrl) {
        test.mouseDown(pt);
      };

      function mouseMove(pt, ctrl) {
        test.mouseMove(pt, { modifiers: (ctrl ? 1 : 0) });
      };

      function mouseUp(pt, ctrl) {
        test.mouseUp(pt, { modifiers: (ctrl ? 1 : 0) });
      }
      window.l = l;

      d.startTransaction('move');
      mouseDown(new go.Point(80,10))
      mouseMove(new go.Point(80,40))
      mouseUp(new go.Point(80,40))
      d.commitTransaction('move');

      //d.startTransaction('del');
      d.commandHandler.deleteSelection();
      //d.commitTransaction('del');

      mgr.undo(); // undo delete
      mgr.undo(); // undo move
      mgr.redo(); // redo move

      mouseDown(new go.Point(80,40))
      mouseMove(new go.Point(180,40))
      mouseUp(new go.Point(180,40))

      mgr.undo(); // undo 2ndmove
      mgr.undo(); // undo 1stmove
      mgr.redo(); // redo 1stmove

      test.assert(l.actualBounds.width < 44 && l.actualBounds.width > 38);
      test.assert(l.actualBounds.height < 24 && l.actualBounds.height > 18);
      test.assert(test.isApproxPoint(l.points.elt(0), new go.Point(36.33333333333333, 14)));
      test.assert(test.isApproxPoint(l.points.elt(1), new go.Point(73.66666666666667, 30)));
    }, // END TEST
    null
));


intro.add(new Test('Palette and Group add/remove tests', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // control the overall behavior when dragging-over or dropping onto the diagram background
      var AllowTopLevelDrops = false;

      d.nodeTemplate =
        $(go.Node, "Auto",
          { locationSpot: go.Spot.Center },
          { // what to do when a drag-over or a drag-drop occurs on a Node
            mouseDragEnter: function(e, node, prev) {
              var grp = node.containingGroup;
              if (grp === null) return;
              if (grp.canAddMembers(grp.diagram.selection)) {
                var shape = grp.findObject("SHAPE");
                if (shape) shape.fill = dropFill;
                grp.diagram.currentCursor = "";
              } else {
                grp.diagram.currentCursor = "not-allowed";
              }
            },
            mouseDragLeave: function(e, node, next) {
              var grp = node.containingGroup;
              if (grp === null) return;
              var shape = grp.findObject("SHAPE");
              if (shape) shape.fill = groupFill;
              grp.diagram.currentCursor = "";
            },
            mouseDrop: function(e, node) {
              var grp = node.containingGroup;
              if (grp !== null) {
                var ok = grp.addMembers(grp.diagram.selection, true);
                if (!ok) grp.diagram.currentTool.doCancel();
              }
            }
          },
          $(go.Shape,
            { figure: "RoundedRectangle", fill: "white" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 4 },  // make some extra space for the shape around the text
            new go.Binding("text", "key")));  // the label shows the node data's key

      var groupFill = "rgba(128,128,128,0.2)";
      var dropFill = "chartreuse";

      d.groupTemplate =
        $(go.Group, "Vertical",
          { selectionObjectName: "SHAPE",  // selection handle goes around shape, not label
            resizable: true, resizeObjectName: "SHAPE" },
          { // what to do when a drag-over or a drag-drop occurs on a Group
            mouseDragEnter: function(e, grp, prev) {
              if (grp.canAddMembers(grp.diagram.selection)) {
                var shape = grp.findObject("SHAPE");
                if (shape) shape.fill = dropFill;
                grp.diagram.currentCursor = "";
              } else {
                grp.diagram.currentCursor = "not-allowed";
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
          $(go.TextBlock,
            { font: "bold 12pt sans-serif" },
            new go.Binding("text", "key"),
            new go.Binding("stroke", "color")),
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",  // the rectangular shape around the members
              { name: "SHAPE",
                fill: groupFill, stroke: "gray", strokeWidth: 3,
                minSize: new go.Size(100, 100) },
              new go.Binding("stroke", "color"))));

      // decide what kinds of Parts can be added to a Group or to top-level
      d.commandHandler.memberValidation = function(grp, node) {
        if (grp === null) return AllowTopLevelDrops;  // maybe allow dropping Nodes in diagram's background
        if (node instanceof go.Group) return false;  // cannot add Groups to Groups
        return grp.data.color === node.data.color;  // only OK if node's color matches the group's color
      };

      // what to do when a drag-over occurs in the Diagram's background
      d.mouseDragOver = function(e) {
        if (AllowTopLevelDrops) {
          d.currentCursor = "";
        } else {
          d.currentCursor = "not-allowed";
        }
      };

      // what to do when a drag-drop occurs in the Diagram's background
      d.mouseDrop = function(e) {
        if (AllowTopLevelDrops) {
          // when the selection is dropped in the diagram's background,
          // make sure the selected Parts no longer belong to any Group
          var ok = d.commandHandler.addTopLevelParts(d.selection, true);
          if (!ok) d.currentTool.doCancel();
        } else {
          d.currentTool.doCancel();
        }
      };

      d.allowDrop = true;  // handle drag-and-drop from the Palette

      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        { key: "Green1", isGroup: true, color: "green" },
        { key: "Blue1", isGroup: true, color: "blue" },
        { key: "Green2", isGroup: true, color: "green" },
        // { key: "Blue2", isGroup: true, color: "blue" }
      ];
      m.copiesKey = true;
      d.model = m;
      d.commandHandler.selectAll();
      d.undoManager.isEnabled = true;

      // initialize the Palette


        test.ch = document.createElement('div');
        test.ch.innerHTML = '<div id="myPalette" style="border: solid 1px black; width: 60px; height: 200px"></div>';
              test.ch.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
        document.body.appendChild(test.ch);

          test.pal =
            $(go.Palette, "myPalette");
          var pal = test.pal;
          pal.layout.wrappingColumn = 1;
          pal.animationManager.isEnabled = false;

          // share the templates with the main Diagram
          pal.nodeTemplate = d.nodeTemplate;
          pal.groupTemplate = d.groupTemplate;

          pal.model.nodeDataArray = [
            { key: "g", color: "green" },
            { key: "b", color: "blue" },
            { key: "y", color: "yellow" }
          ];
          pal.model.copiesKey = true;
        pal.maybeUpdate();

    }, // END SETUP
    function (test) {
      var d = test.diagram;
      var pal = test.pal;
      var ch = test.ch;

      test.assert(d.selection.count === 1+2);

      var g1 = d.findNodeForKey('Green1');
      var g2 = d.findNodeForKey('Green2');
      var b1 = d.findNodeForKey('Blue1');
      var b2 = d.findNodeForKey('Blue2');

      test.assert(g1.memberParts.count === 0)
      test.assert(d.nodes.count === 1+2)
      // Successfully move green node to Green1

      // provide these args for drag-and-drop between Diagrams
      var dragdrop = { sourceDiagram: pal, targetDiagram: d };

      d.startTransaction('a');
      test.mouseDown(new go.Point(0, 0), dragdrop);
      test.mouseMove(new go.Point(75,50), dragdrop);
      test.mouseUp(new go.Point(75, 50), dragdrop);
      d.commitTransaction('a');

      test.assert(g1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(d.nodes.count === 1+3)

      // Move green node onto air (fail)
      test.mouseDown(new go.Point(0, 0), dragdrop);
      test.mouseMove(new go.Point(275, 50), dragdrop);
      test.mouseUp(new go.Point(275, 50), dragdrop);

      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 0)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(d.nodes.count === 1+3)

      // Move green node onto blue group (fail)
      test.mouseDown(new go.Point(0, 0), dragdrop);
      test.mouseMove(new go.Point(160, 50), dragdrop);
      test.mouseUp(new go.Point(160, 50), dragdrop);

      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 0)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(d.nodes.count === 1+3)

      // Move a blue node onto blue group
      test.mouseDown(new go.Point(0, 40), dragdrop);
      test.mouseMove(new go.Point(160, 50), dragdrop);
      test.mouseUp(new go.Point(160, 50), dragdrop);
      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(d.nodes.count === 1+4)

      // Move green node internally
      var old = d.findNodeForKey('g').position.copy();
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old))
      test.mouseDown(new go.Point(75,50));
      test.mouseMove(new go.Point(75,80)); // last arg is target
      test.mouseUp(new go.Point(75,80));
      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(!this.isApproxPoint(d.findNodeForKey('g').position, old)) // it has moved

      // try to move green node externally (should fail)
      var old = d.findNodeForKey('g').position.copy();
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old))
      test.mouseDown(new go.Point(75,80));
      test.mouseMove(new go.Point(75,380)); // last arg is target
      test.mouseUp(new go.Point(75,380));
      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old)) // it stays in the same place

      // try to move green node to blue group (should fail)
      var old = d.findNodeForKey('g').position.copy();
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old))
      test.mouseDown(new go.Point(75,80));
      test.mouseMove(new go.Point(160,50)); // last arg is target
      test.mouseUp(new go.Point(160,50));
      test.assert(g1.memberParts.count === 1)
      test.assert(b1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g1)
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old)) // it stays in the same place

      // try to move green node to other green group (should fail)
      var old = d.findNodeForKey('g').position.copy();
      test.assert(this.isApproxPoint(d.findNodeForKey('g').position, old))
      test.mouseDown(new go.Point(75,80));
      test.mouseMove(new go.Point(75,190)); // last arg is target
      test.mouseUp(new go.Point(75,190));
      test.assert(g1.memberParts.count === 0)
      test.assert(g2.memberParts.count === 1)
      test.assert(b1.memberParts.count === 1)
      test.assert(d.findNodeForKey('g').containingGroup === g2)
      test.assert(d.findNodeForKey('g').containingGroup !== g1)
      test.assert(!this.isApproxPoint(d.findNodeForKey('g').position, old)) // it does not stay in same place

      // what to do when a drag-over occurs in the Diagram's background
      d.mouseDragOver = null;

      // what to do when a drag-drop occurs in the Diagram's background
      d.mouseDrop = null;

      // at the very end:
      if (test.pal) {
        test.pal.div = null;
        test.pal = null;
      }
      if (test.ch) {
        document.body.removeChild(test.ch);
        test.ch = null;
      }

    }, // END TEST
    null
));

intro.add(new Test('panel add', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 diagram.nodeTemplate =
$(go.Node, "Vertical",
  {  },
  $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 }))


  diagram.model.nodeDataArray = [
    { key: 1 }
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;


    }, // END SETUP
    function (test) {
var s1 = $(go.Shape, "Triangle", { fill: 'green', width: 30, height: 30 })
var s2 = $(go.Shape, "Triangle", { fill: 'blue', width: 30, height: 30 })

var n = (test.diagram.findNodeForKey(1))
test.assert(n.elements.count === 1)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');
n.insertAt(0,s1)
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'green');
n.insertAt(0,s1)
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'green');
n.insertAt(40,s1)
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');
n.insertAt(40,s1)
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');
n.add(s1)
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');

    }, // END TEST
    null
));

intro.add(new Test('panel undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 diagram.nodeTemplate =
$(go.Node, "Vertical",
  {  },
  $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 }))


  diagram.model.nodeDataArray = [
    { key: 1 },
    { key: 2 }
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
    test.diagram.undoManager.isEnabled = true;
var mgr = test.diagram.undoManager;

var s1 = $(go.Shape, "Triangle", { fill: 'green', width: 30, height: 30 })
var s2 = $(go.Shape, "Triangle", { fill: 'blue', width: 30, height: 30 })

var n = (diagram.findNodeForKey(1))
test.assert(n.elements.count === 1)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');
diagram.startTransaction('a');
n.insertAt(0,s1)
diagram.commitTransaction('a');
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'green');
mgr.undo();
test.assert(n.elements.count === 1)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'red');
test.assert(s1.panel === null)
mgr.redo();
test.assert(n.elements.count === 2)
var el = n.elements; el.next(); el = el.value; test.assert(el.fill === 'green');
test.assert(s1.panel !== null)


var n2 = (diagram.findNodeForKey(2))
test.assert(n.elements.count === 2)
test.assert(n2.elements.count === 1)
var broke;
try {
// insert the object currently in s1 into s2 (should break)
n2.insertAt(0,s1)
broke = false;
} catch(ex) {
broke = true;
}
test.assert(broke)
test.assert(n.elements.count === 2)
test.assert(n2.elements.count === 1)

// insert it correctly by taking it out of n
diagram.startTransaction('a');
n.remove(s1)
n2.insertAt(0,s1)
diagram.commitTransaction('a');
test.assert(n.elements.count === 1)
test.assert(n2.elements.count === 2)
    }, // END TEST
    null
));

intro.add(new Test('Error on add to two diagrams', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

 diagram.nodeTemplate =
$(go.Node, "Vertical",
  {  },
  $(go.Shape, "Triangle", { name: 'shape', fill: 'red', width: 30, height: 30 }))


  diagram.model.nodeDataArray = [
    { key: 1 }
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;



window.initD1 = document.createElement('div');
window.initD1.innerHTML = '<div id="yep" style="border: solid 1px black; width: 200px; height: 100px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
document.body.appendChild(window.initD1);
window.D1 =
  $(go.Diagram, "yep", {
    "animationManager.isEnabled": false
  });

document.body.appendChild(window.initD1);


var mgr = diagram.undoManager;
var n = (diagram.findNodeForKey(1))
var nc = n.copy();
diagram.add(nc)
try {
  window.D1.add(nc)
  test.assert(false)
} catch (ex) {
  test.assert(true)
}


  window.D1.div = null;
  document.body.removeChild(window.initD1);
  window.D1 = null;
  window.initD1 = null;




    }, // END TEST
    null
));

intro.add(new Test('panel insert undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
diagram.nodeTemplate =
$(go.Node, "Vertical", {  },
  $(go.Shape, "Triangle", { name: 'shape', fill: 'gray', width: 30, height: 30 }))

diagram.model.nodeDataArray = [
  { key: 1 }
];
// enable Ctrl-Z to undo and Ctrl-Y to redo
// (must do this after assigning Diagram.model)
diagram.undoManager.isEnabled = true;
    }, // END SETUP
    function (test) {
var diagram = test.diagram;
var d = diagram;
var mgr = diagram.undoManager;
var s1 = $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })
var s2 = $(go.Shape, "Triangle", { fill: 'green', width: 30, height: 30 })
var s3 = $(go.Shape, "Triangle", { fill: 'blue', width: 30, height: 30 })
var s4 = $(go.Shape, "Triangle", { fill: 'purple', width: 30, height: 30 })

var n = (diagram.findNodeForKey(1))
var s0 = n.findObject('shape')
test.assert(n.elements.count === 1)
diagram.startTransaction('a');
n.add(s4);
diagram.commitTransaction('a');

test.assert(checkorder(n, [s0, s4]))

diagram.startTransaction('a');
n.insertAt(1,s1)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s0, s1, s4]))
diagram.startTransaction('a');
n.insertAt(1,s2)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s0, s2, s1, s4]))
diagram.startTransaction('a');
n.insertAt(1,s3)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s0, s3, s2, s1, s4]))
test.assert(n.elements.count === 5)
mgr.undo();
test.assert(n.elements.count === 4)
test.assert(s1.panel !== null && s2.panel !== null && s3.panel === null && s4.panel !== null)
test.assert(checkorder(n, [s0, s2, s1, s4]))
mgr.redo();
test.assert(checkorder(n, [s0, s3, s2, s1, s4]))
mgr.undo();
test.assert(checkorder(n, [s0, s2, s1, s4]))

mgr.undo();
test.assert(checkorder(n, [s0, s1, s4]))
test.assert(n.elements.count === 3)
mgr.undo();
test.assert(n.elements.count === 2)
test.assert(s1.panel === null && s2.panel === null && s3.panel === null && s4.panel !== null)
test.assert(checkorder(n, [s0, s4]))

function checkorder(node, elems) {
  var elts = node.elements;
  var i = 0;
  while (elts.next()) {
    var e = elts.value;
    if (elems[i] !== e) return false;
    i++;
  }
  return true;
}

    }, // END TEST
    null
));


intro.add(new Test('panel reorder undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 diagram.nodeTemplate =
$(go.Node, "Vertical",
  {  },
  $(go.Shape, "Triangle", { name: 'shape', fill: 'gray', width: 30, height: 30 }))


  diagram.model.nodeDataArray = [
    { key: 1 }
    //,{ key: 2 }
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
var mgr = diagram.undoManager;


var s1 = $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })
var s2 = $(go.Shape, "Triangle", { fill: 'lime', width: 30, height: 30 })
var s3 = $(go.Shape, "Triangle", { fill: 'blue', width: 30, height: 30 })
var s4 = $(go.Shape, "Triangle", { fill: 'black', width: 30, height: 30 })

var n = (diagram.findNodeForKey(1))
var s0 = n.findObject('shape')
test.assert(n.elements.count === 1)
n.add(s1);
n.add(s2);
n.add(s3);
n.add(s4);

test.assert(checkorder(n, [s0, s1, s2, s3, s4]))
diagram.startTransaction('a');
n.insertAt(1,s1)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s0, s1, s2, s3, s4]))
//mgr.undo(); // no change
test.assert(checkorder(n, [s0, s1, s2, s3, s4]))
diagram.startTransaction('a');
n.insertAt(999,s1)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s0, s2, s3, s4, s1]))
mgr.undo();
test.assert(checkorder(n, [s0, s1, s2, s3, s4]))

diagram.startTransaction('a');
n.insertAt(0,s1)
n.insertAt(0,s1)
n.insertAt(0,s1)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))
mgr.undo();
test.assert(checkorder(n, [s0, s1, s2, s3, s4]))
mgr.redo();
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))

// nothing changes
diagram.startTransaction('a');
n.remove(s1)
n.insertAt(0,s1)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))
mgr.undo();
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))
mgr.redo();
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))

//remove from center
diagram.startTransaction('a');
n.remove(s2)
diagram.commitTransaction('a');
test.assert(checkorder(n, [s1, s0, s3, s4]))
mgr.undo();
test.assert(checkorder(n, [s1, s0, s2, s3, s4]))
test.assert(!checkorder(n, [s1, s0, s3, s4]))
mgr.redo();
test.assert(checkorder(n, [s1, s0, s3, s4]))


function checkorder(node, elems) {
  var elts = node.elements;
  var i = 0;
  while (elts.next()) {
    var e = elts.value;
    if (elems[i] !== e) return false;
    i++;
  }
  return true;
}

    }, // END TEST
    null
));

intro.add(new Test('item order', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 diagram.nodeTemplate =
$(go.Node, "Vertical", {  }, $(go.Shape, "Triangle", { name: 'shape', fill: 'gray', width: 30, height: 30 }, new go.Binding("fill", "fill")))


  diagram.model.nodeDataArray = [
    { key: 1, fill: 'red'},
    { key: 2, fill: 'lime'},
    { key: 3, fill: 'blue'}
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
var mgr = diagram.undoManager;

var n1 = (diagram.findNodeForKey(1))
var n2 = (diagram.findNodeForKey(2))
var n3 = (diagram.findNodeForKey(3))


var l1 = diagram.findLayer('')
var l2 = diagram.findLayer('Foreground')

test.assert(l1.parts.count === 3)
test.assert(checkorder(l1, [n1, n2, n3]))
test.assert(!checkorder(l1, [n2, n1, n3]))

diagram.startTransaction('a');
diagram.remove(n1);
n1.layerName = 'Foreground'
diagram.add(n1);
diagram.commitTransaction('a');
test.assert(checkorder(l1, [n2, n3]))
test.assert(checkorder(l2, [n1]))
mgr.undo();
test.assert(!checkorder(l1, [n2, n3]))
test.assert(!checkorder(l2, [n1]))
test.assert(checkorder(l1, [n1, n2, n3]))
mgr.redo();
test.assert(checkorder(l1, [n2, n3]))
test.assert(checkorder(l2, [n1]))
test.assert(!checkorder(l1, [n1, n2, n3]))
diagram.startTransaction('a');
n1.layerName = '';
diagram.commitTransaction('a');
test.assert(!checkorder(l1, [n2, n3]))
test.assert(!checkorder(l2, [n1]))
test.assert(checkorder(l1, [n2, n3, n1]))
mgr.undo();
test.assert(checkorder(l1, [n2, n3]))
test.assert(checkorder(l2, [n1]))
test.assert(!checkorder(l1, [n1, n2, n3]))
mgr.undo();
test.assert(checkorder(l1, [n1, n2, n3]))
test.assert(checkorder(l2, []))





function checkorder(layer, elems) {
  var elts = layer.parts;
  var i = 0;
  while (elts.next()) {
    var e = elts.value;
    if (elems[i] !== e) return false;
    i++;
  }
  if (elems.length > 0 && i == 0) return false;
  return true;
}

    }, // END TEST
    null
));






intro.add(new Test('remove layer', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();


      commonSetup(test)
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        {key: "fore", ln: 'Foreground'},
        {key: "default", ln: ''},
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    },// END SETUP
    function (test) {
var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

d.startTransaction('a');
d.commitTransaction('a');
d.maybeUpdate();

test.assert(d.layers.count === 8)

d.startTransaction('a');
d.removeLayer(d.findLayer('Foreground'))
d.commitTransaction('a');

test.assert(d.findNodeForKey('fore').layerName === '')
test.assert(d.findLayer('Foreground') === null)
test.assert(d.layers.count === 7)

mgr.undo();

test.assert(d.findNodeForKey('fore').layerName === 'Foreground')
test.assert(d.findLayer('Foreground') !== null)
test.assert(d.layers.count === 8)
    }, // END TEST
    null
));

intro.add(new Test('add layer', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      commonSetup(test)
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        {key: "fore", ln: 'Foreground'},
        {key: "default", ln: ''},
      ];
      m.linkDataArray = [
        //{from: 1, to: 2}
      ];
      test.diagram.model = m;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      d.startTransaction('a');
      d.commitTransaction('a');
      d.maybeUpdate();

      test.assert(d.layers.count === 8)

      // should fail
      d.startTransaction('a');
      try {
        d.addLayer(d.findLayer('Foreground'))
        test.assert(false);
      } catch (e) {
        test.assert(true);
      }
      d.commitTransaction('a');

      test.assert(d.findNodeForKey('fore').layerName === 'Foreground')
      test.assert(d.findLayer('Foreground') !== null)
      test.assert(d.layers.count === 8)

      d.startTransaction('a');
      var lala = new go.Layer();
      lala.name = 'lala';
      d.addLayer(lala);
      d.commitTransaction('a');

      test.assert(d.findLayer('lala') !== null)
      test.assert(d.layers.count === 9)

      mgr.undo();

      test.assert(d.findLayer('lala') === null)
      test.assert(d.layers.count === 8)

      d.startTransaction('a');
      var lala = new go.Layer();
      lala.name = 'lala';
      try {
        d.addLayerBefore(lala, lala);
        test.assert(false)
      } catch (ex) {
        test.assert(true)
      }
      try {
        d.addLayerBefore(lala);
        test.assert(false)
      } catch (ex) {
        test.assert(true)
      }
      d.commitTransaction('a');

      test.assert(d.findLayer('lala') === null)
      test.assert(d.layers.count === 8)

      d.startTransaction('a');
      var lala = new go.Layer();
      lala.name = 'lala';
      d.addLayerBefore(lala, d.layers.first());
      d.commitTransaction('a');

      test.assert(d.layers.first().name === 'lala');
      test.assert(d.layers.count === 9)
      mgr.undo();
      test.assert(d.layers.first().name === 'Grid');
      test.assert(d.layers.count === 8)
      mgr.redo(); // make sure it re-inserts it into the first place
      test.assert(d.layers.first().name === 'lala');
      test.assert(d.layers.count === 9)

    }, // END TEST
    null
));


intro.add(new Test('isModified', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.isModified = false;  // might be true initially, force it to be false

      var mgr = diagram.undoManager;
      test.assert(!diagram.isModified, "initializign: should not yet be modified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 0, "initializing: should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "initializing: should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "initializing: no transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "initializing: cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "initializing: cannot redo");

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history

    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add red");

      test.assert(!diagram.isModified, "should not yet be modified while adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  mgr.isInTransaction && !mgr.isUndoingRedoing, "should be inside a transaction, but no currentTransaction yet");
      test.assert(mgr.history.length === 0, "should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 1 && mgr.nestedTransactionNames.elt(0) === "add red" && mgr.transactionLevel === 1, "add red transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })));

      test.assert(diagram.isModified, "should be modified while adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction instanceof go.Transaction &&
                  mgr.isInTransaction && !mgr.isUndoingRedoing, "should be inside a transaction");
      test.assert(mgr.history.length === 0, "should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 1 && mgr.transactionLevel === 1, "a transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      diagram.commitTransaction("add red");

      test.assert(diagram.isModified, "should be modified after adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1 && mgr.history.elt(0).name === "add red", "should have add red Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      // now Undo
      diagram.commandHandler.undo();
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === false, "undo should restore diagram to be not isModified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToRedo instanceof go.Transaction && mgr.canRedo(), "might redo");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");

      // now Redo
      diagram.commandHandler.redo();

      test.assert(diagram.isModified, "should be modified after adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1 && mgr.history.elt(0).name === "add red", "should have add red Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

intro.add(new Test('isModified saved', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      //??? whether diagram.isModified is unspecified at this time !?
      var mgr = diagram.undoManager;
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 0, "initializing: should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "initializing: should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "initializing: no transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "initializing: cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "initializing: cannot redo");

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history

    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add red");

      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  mgr.isInTransaction && !mgr.isUndoingRedoing, "should be inside a transaction, but no currentTransaction yet");
      test.assert(mgr.history.length === 0, "should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 1 && mgr.nestedTransactionNames.elt(0) === "add red" && mgr.transactionLevel === 1, "add red transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })));

      test.assert(diagram.isModified, "should be modified while adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction instanceof go.Transaction &&
                  mgr.isInTransaction && !mgr.isUndoingRedoing, "should be inside a transaction");
      test.assert(mgr.history.length === 0, "should not yet have added a Transaction to UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 1 && mgr.transactionLevel === 1, "a transaction should be ongoing");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      diagram.commitTransaction("add red");

      test.assert(diagram.isModified, "should be modified after adding a Part");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1 &&  mgr.history.elt(0).name === "add red", "should have add red Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      // pretend to Save
      diagram.isModified = false;

      test.assert(!diagram.isModified, "had set isModified to false");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");

      // now Undo
      diagram.commandHandler.undo();
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === true, "undo should modify diagram");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === -1, "should have no Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToRedo instanceof go.Transaction && mgr.canRedo(), "might redo");
      test.assert(mgr.transactionToUndo === null && !mgr.canUndo(), "cannot undo");

      // now Redo
      diagram.commandHandler.redo();

      test.assert(!diagram.isModified, "had set isModified to false");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

intro.add(new Test('isModified deleted saved', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add red");
      var part = $(go.Part, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 }));
      diagram.add(part);
      diagram.commitTransaction("add red");
      // and delete it
      part.isSelected = true;
      diagram.commandHandler.deleteSelection();
      // pretend to Save
      diagram.isModified = false;

      test.assert(diagram.isModified === false, "diagram.isModified should be false after save");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 1, "should have two Transactions to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // now Undo
      diagram.commandHandler.undo();

      test.assert(diagram.isModified === true, "undo followed by add should remain diagram.isModified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo instanceof go.Transaction && mgr.canRedo(), "might redo");

      // now Redo
      diagram.commandHandler.redo();

      test.assert(diagram.isModified === false, "diagram.isModified should be false after save");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 1, "should have two Transactions to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

intro.add(new Test('isModified inserted saved', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add blue");
      diagram.add($(go.Part, { location: new go.Point(0, 0) }, $(go.Shape, "Circle", { fill: 'blue', width: 30, height: 30 })));
      diagram.commitTransaction("add blue");
      // make another change
      diagram.startTransaction("add red");
      diagram.add($(go.Part, { location: new go.Point(100, 0) }, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })));
      diagram.commitTransaction("add red");
      // pretend to Save
      diagram.isModified = false;

      test.assert(diagram.isModified === false, "diagram.isModified should be false after save");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 1, "should have two Transactions to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // now Undo
      diagram.commandHandler.undo();

      test.assert(diagram.isModified === true, "undo followed by add should remain diagram.isModified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo instanceof go.Transaction && mgr.canRedo(), "might redo");

      // now Redo
      diagram.commandHandler.redo();

      test.assert(diagram.isModified === false, "diagram.isModified should be false after save");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 2, "should have two Transactions in UndoManager.history");
      test.assert(mgr.historyIndex === 1, "should have two Transactions to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

intro.add(new Test('isModified Discard', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add red");
      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })));
      diagram.commitTransaction("add red");

      // now Undo
      diagram.commandHandler.undo();

      // discard addition #1
      diagram.startTransaction("add green");
      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'green', width: 30, height: 30 })));
      diagram.commitTransaction("add green");
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === true, "undo followed by add should remain diagram.isModified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

intro.add(new Test('isModified saved Discard', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      // make a change
      diagram.startTransaction("add red");
      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'red', width: 30, height: 30 })));
      diagram.commitTransaction("add red");

      // pretend to Save
      diagram.isModified = false;

      // now Undo
      diagram.commandHandler.undo();

      // discard addition #1
      diagram.startTransaction("add green");
      diagram.add($(go.Part, $(go.Shape, "Triangle", { fill: 'green', width: 30, height: 30 })));
      diagram.commitTransaction("add green");
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === true, "undo followed by add should remain diagram.isModified");
      test.assert(mgr.isEnabled && mgr.currentTransaction === null &&
                  !mgr.isInTransaction && !mgr.isUndoingRedoing, "should be between transactions");
      test.assert(mgr.history.length === 1, "should have one Transaction in UndoManager.history");
      test.assert(mgr.historyIndex === 0, "should have one Transaction to be undone");
      test.assert(mgr.nestedTransactionNames.length === 0 && mgr.transactionLevel === 0, "no transaction should be ongoing");
      test.assert(mgr.transactionToUndo instanceof go.Transaction && mgr.canUndo(), "might undo");
      test.assert(mgr.transactionToRedo === null && !mgr.canRedo(), "cannot redo");
    }
));

  intro.add(new Test('isModified model', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      diagram.model = new go.GraphLinksModel([
          { key: 1, text: "one" },
          { key: 2, text: "two" }
        ], [
          { from: 1, to: 2 }
        ]);

      diagram.isModified = false;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;

      test.assert(diagram.isModified === false, "initialized diagram should not already be isModified");

      // make a change
      diagram.startTransaction("add three");
      diagram.model.addNodeData({ text: "three" });
      diagram.commitTransaction("add three");

      test.assert(diagram.isModified === true, "modified diagram by adding a node, so isModified should be true");

      // pretend to Save
      diagram.isModified = false;

      test.assert(diagram.isModified === false, "isModified set to false");

      // now Undo
      diagram.commandHandler.undo();
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === true, "undo should make diagram.isModified");

      diagram.commandHandler.redo();

      test.assert(diagram.isModified === false, "redo should restore back to !isModified");
    }
  ));

  intro.add(new Test('isModified model only', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;

      diagram.model = new go.GraphLinksModel([
        { key: 1, text: "one" },
        { key: 2, text: "two" }
      ], [
          { from: 1, to: 2 }
        ]);

      diagram.isModified = false;

      // cannot record changes before InitialLayoutCompleted, since the latter clears the UndoManager history
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;

      test.assert(diagram.isModified === false, "initialized diagram should not already be isModified");

      // make a change
      diagram.startTransaction("change new property, unused by diagram");
      diagram.model.set(diagram.model.nodeDataArray[0], "unusedProp", "extra");
      diagram.commitTransaction("change new property, unused by diagram");

      test.assert(diagram.isModified === true, "diagram was not modified??, only the model, so isModified should be true??");

      // pretend to Save
      diagram.isModified = false;

      test.assert(diagram.isModified === false, "isModified set to false");

      // now Undo
      diagram.commandHandler.undo();
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var mgr = diagram.undoManager;
      test.assert(diagram.isModified === false, "undo should not?? make diagram.isModified");

      diagram.commandHandler.redo();

      test.assert(diagram.isModified === false, "redo should restore back to !isModified");
    }
  ));

intro.add(new Test('adornment doesnt disappear', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Auto",  // the Shape will go around the TextBlock
          $(go.Shape, "RoundedRectangle",
            // Shape.fill is bound to Node.data.color
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 3 },  // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "key"))
        );
diagram.undoManager.isEnabled =true;
      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue" },
        { key: "Beta", color: "orange" }
      ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      d.select(d.findNodeForKey('Beta'))
      d.startTransaction('a');
      d.selection.first().move(new go.Point(100,100));
      d.commitTransaction('a');
      d.undoManager.undo()

      test.assert(d.findNodeForKey('Beta').adornments.count !== 0);
    }, // END TEST
    null
));

// relink undo redo when
intro.add(new Test('relink undo redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    diagram.layout = $(go.TreeLayout, {});
    diagram.undoManager.isEnabled = true;
    diagram.nodeTemplate =
      $(go.Node, "Vertical",
        $(go.TextBlock, "test",
          { background:'lime', name: 'SHAPE', height: 40, width: 40 }
            // !!! comment out this line and it works:
            // This binding
            ,new go.Binding("text", "parent", function(v) {return "Boss: " + v;})
          )
      );  // end Node
    diagram.model = go.Model.fromJson(
      '{ "class": "go.TreeModel",\
        "nodeDataArray": [\
      {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
      {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales", "parent":1},\
      {"key":3, "name":"Meg Meehan Hoffa", "title":"Sales", "parent":2}\
       ]\
      }');


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      diagram.startTransaction('');
      diagram.commitTransaction('');

      diagram.startTransaction('');
      var link = diagram.findNodeForKey(3).findTreeParentLink();
      if (link !== null) {  // reconnect any existing link
        link.fromNode = diagram.findNodeForKey(1);
      }
      diagram.commitTransaction('');
      diagram.undoManager.undo();
      diagram.undoManager.redo();

      test.assert(diagram.findNodeForKey(3).position.equals(new go.Point(90, 60)))


    }, // END TEST
    null
));

intro.add(new Test('relink undo, category changed, side spot', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false });
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          $(go.Shape, "RoundedRectangle",
            {
              desiredSize: new go.Size(75, 25),
              strokeWidth: 0, portId: "",
              fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
            },
            new go.Binding("fill", "color")
          ),
          $(go.TextBlock,
            new go.Binding("text", "key")
          )
        );

      diagram.linkTemplate =
        $(go.Link,
          $(go.Shape,
            new go.Binding("stroke", "color")),
          $(go.Shape, { toArrow: "Standard" })
        );

      diagram.linkTemplateMap.add("typeTwo",
        $(go.Link,
          $(go.Shape, { stroke: "red" }),
          $(go.Shape, { toArrow: "Standard" })
        ));

      diagram.model = new go.TreeModel([
          { key: "Alpha", color: "lightblue" },
          { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen", parent: "Alpha", parentLinkCategory: "typeTwo" }
        ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var link = diagram.links.first();
      diagram.commit(function() {
        link.fromNode = diagram.findNodeForKey("Beta");
      });
      diagram.commit(function() {
        link.toNode = diagram.findNodeForKey("Alpha");
      });
      diagram.undoManager.undo();
    }, // END TEST
    function (test) {
      var diagram = test.diagram;
      var link = diagram.links.first();
      var points = link.points.toArray();
      test.assert(points[0].x === 75 && points[0].y === 47.5 &&
                  points[1].x === 85 && points[1].y === 47.5 &&
                  points[2].x === 115 && points[2].y === 47.5 &&
                  points[3].x === 125 && points[3].y === 47.5, "link has incorrect route");
    }
));

intro.add(new Test('position undo/redo 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, {});
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, "test",
            { background:'lime', name: 'SHAPE', height: 40, width: 40 }
            )
        );  // end Node
      diagram.model = go.Model.fromJson(
        '{ "class": "go.TreeModel", "nodeDataArray": [\
        {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
        {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales"} ] }')
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      diagram.startTransaction('');
      var b = diagram.findNodeForKey(2)
      diagram.startTransaction('');
      diagram.commitTransaction('');
      b.location = new go.Point(150, 50);
      b.findObject('SHAPE').text = 'lala'
      diagram.commitTransaction('');
      diagram.undoManager.undo();
      test.assert(b.location.equals(new go.Point(0, 50)))
    }, // END TEST
    null
));

intro.add(new Test('position undo/redo 1 ^z', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, {});
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, "test",
            { background: 'lime', name: 'SHAPE', height: 40, width: 40 }
            )
        );  // end Node
      diagram.model = go.Model.fromJson(
        '{ "class": "go.TreeModel", "nodeDataArray": [\
        {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
        {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales"} ] }')
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction('');
      var b = diagram.findNodeForKey(2)
      diagram.startTransaction('');
      diagram.commitTransaction('');
      b.location = new go.Point(150, 50);
      b.findObject('SHAPE').text = 'lala'
      diagram.commitTransaction('');
      test.keyDown("Z", { control: true });
      test.assert(b.location.equals(new go.Point(0, 50)))
    }, // END TEST
    null
));

intro.add(new Test('position undo/redo 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, {});
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, "test",
            { background:'lime', name: 'SHAPE', height: 40, width: 40 }
            )
        );  // end Node
      diagram.model = go.Model.fromJson(
        '{ "class": "go.TreeModel", "nodeDataArray": [\
        {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
        {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales"} ] }')
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      diagram.startTransaction('');
      var b = diagram.findNodeForKey(2)
      diagram.startTransaction('');
      diagram.commitTransaction('');
      b.findObject('SHAPE').text = 'lala'
      b.position = new go.Point(150, 50);
      diagram.commitTransaction('');
      diagram.undoManager.undo();
      diagram.undoManager.redo();
      test.assert(b.location.equals(new go.Point(150, 50)))
    }, // END TEST
    null
));

intro.add(new Test('position undo/redo 3', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, {});
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, "test",
            { background:'lime', name: 'SHAPE', height: 40, width: 40 }
            )
        );  // end Node
      diagram.model = go.Model.fromJson(
        '{ "class": "go.TreeModel", "nodeDataArray": [\
        {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
        {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales"} ] }')
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      diagram.startTransaction('');
      var b = diagram.findNodeForKey(2)
      diagram.startTransaction('');
      diagram.commitTransaction('');
      b.location = new go.Point(150, 0);
      b.position = new go.Point(150, 50);
      b.findObject('SHAPE').text = 'lala'
      diagram.commitTransaction('');
      diagram.undoManager.undo();
      diagram.undoManager.redo();
      test.assert(b.location.equals(new go.Point(150, 50)))
    }, // END TEST
    null
));

intro.add(new Test('position undo/redo 4', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.TreeLayout, {});
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, "test",
            { background:'lime', name: 'SHAPE', height: 40, width: 40 }
            )
        );  // end Node
      diagram.model = go.Model.fromJson(
        '{ "class": "go.TreeModel", "nodeDataArray": [\
        {"key":1, "name":"Stella Payne Diaz", "title":"CEO"},\
        {"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales"} ] }')
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var b = diagram.findNodeForKey(2)
      diagram.startTransaction('');
      diagram.commitTransaction('');
      diagram.startTransaction('');
      b.location = new go.Point(150, 0);
      b.findObject('SHAPE').text = 'lala'
      b.position = new go.Point(150, 50);
      diagram.commitTransaction('');
      diagram.undoManager.undo();
      diagram.undoManager.redo();
      test.assert(b.location.equals(new go.Point(150, 50)))
    }, // END TEST
    null
));


intro.add(new Test('rebuildParts', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location").makeTwoWay(),
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true, margin: 10 }, new go.Binding("text").makeTwoWay())  // must be TwoWay
        );
      diagram.model = new go.GraphLinksModel([
        { key: "Alpha", text: "alpha text", location: new go.Point(-123, -45) },
        { key: "Beta" }
      ], [
        { from: "Alpha", to: "Beta" }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      d.startTransaction();
      d.rebuildParts();
      d.commitTransaction("rebuild");

      d.undoManager.undo();
    },
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var node = d.findNodeForKey("Alpha");
      test.assert(d.nodes.count === 2 && node.elt(1).text === "alpha text" && node.data.text === "alpha text", "undo of rebuildParts messed up model data text");
      test.assert(node.location.equals(new go.Point(-123, -45)) && node.data.location.equals(new go.Point(-123, -45)), "undo of rebuildParts messed up model data location");
    }
));

intro.add(new Test('dragging', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location").makeTwoWay(),
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true, margin: 10 }, new go.Binding("text").makeTwoWay())  // must be TwoWay
        );
      diagram.linkTemplate =
        $(go.Link,
          new go.Binding("points").makeTwoWay(),
          $(go.Shape),
          $(go.Shape, { toArrow: "OpenTriangle" })
        );
      diagram.model = new go.GraphLinksModel([
        { key: "Alpha", text: "alpha text", location: new go.Point(-123, -45) },
        { key: "Beta" }
      ], [
        { from: "Alpha", to: "Beta" }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      test.mouseDown(new go.Point(-113, -35));
      test.mouseMove(new go.Point(-113, -15));
      test.mouseMove(new go.Point(-113, +5));
      test.mouseUp(new go.Point(-113, +35));
      var link = d.links.first();
      test.savedPoints = link.points.toArray();
    },
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      d.commandHandler.undo();
      d.commandHandler.redo();
      var node = d.findNodeForKey("Alpha");
      test.assert(node.location.equalsApprox(new go.Point(-123, 25)), "did not move Alpha correctly " + node.location.toString());
      var link = d.links.first();
      test.assertLinkPoints(link, test.savedPoints);
    }
));

intro.add(new Test("non-model data", null,
  function(test) {
    var model = new go.Model();
    var data1 = { a: 1, b: "two" };
    model.nodeDataArray = [data1];
    var dataExt = { z: 99, y: [1, 2, 3] };
    test.assert(data1.b === "two" && dataExt.z === 99, "initial values for data1 and dataExt");

    model.undoManager.isEnabled = true;

    model.startTransaction();
    model.setDataProperty(data1, "b", "BBB");
    var oldval = dataExt.z;
    dataExt.z = 101;
    model.raiseDataChanged(dataExt, "z", oldval, dataExt.z);
    model.commitTransaction("mod1");
    test.assert(data1.b === "BBB" && dataExt.z === 101, "didn't change data1.b or dataExt.z");

    test.assert(model.undoManager.canUndo(), "can't undo?");
    model.undoManager.undo();
    test.assert(data1.b === "two" && dataExt.z === 99, "did not undo to initial values for data1 and dataExt");

    test.assert(model.undoManager.canRedo(), "can't redo after undo?");
    model.undoManager.redo();
    test.assert(data1.b === "BBB" && dataExt.z === 101, "didn't change data1.b or dataExt.z");

    model.startTransaction();
    var oldvalX = dataExt.x;
    dataExt.x = "new prop";
    model.raiseDataChanged(dataExt, "x", oldvalX, dataExt.x);
    model.commitTransaction("mod2");

    test.assert(model.undoManager.canUndo(), "can't undo?");
    model.undoManager.undo();
    test.assert(dataExt.x === undefined, "did not undo to undefined value for dataExt.x");

    test.assert(model.undoManager.canRedo(), "can't redo after undo?");
    model.undoManager.redo();
    test.assert(dataExt.x === "new prop", "didn't set dataExt.x");

    model.undoManager.undo();  // discard mod2

    model.startTransaction();
    var newval = 4;
    dataExt.y.push(newval);
    model.raiseChangedEvent(go.ChangedEvent.Insert, "y", dataExt, null, newval, null, 3);
    model.commitTransaction("mod3");
    test.assert(model.undoManager.history.count === 2, "should have exactly two transactions in undomanger.history");

    test.assert(model.undoManager.canUndo(), "can't undo?");
    model.undoManager.undo();
    test.assert(dataExt.y.length === 3, "did not undo by popping dataExt.y");

    test.assert(model.undoManager.canRedo(), "can't redo after undo?");
    model.undoManager.redo();
    test.assert(dataExt.y.length === 4 && dataExt.y[3] === 4, "didn't re-push dataExt.y");
  }
  ));

intro.add(new Test("selected non-existent parts", null,
  function(test) {
    var diagram = test.diagram;
    diagram.reset();
    commonSetup(test);
    diagram.layout = new go.TreeLayout();
    diagram.model.clear();
    diagram.undoManager.isEnabled = true;
  },
  function(test) {
    var diagram = test.diagram;

    diagram.startTransaction();
    var d1 = { key: 1, color: "lightyellow" };
    var d2 = { key: 2, color: "lightgreen" };
    diagram.model.addNodeData(d1);
    diagram.model.addNodeData(d2);
    var n1 = diagram.findNodeForData(d1);
    var n2 = diagram.findNodeForData(d2);
    test.assert(n1 !== null && n2 !== null, "no node 1 or 2?");
    n1.isSelected = true;
    n2.isSelected = true;
    diagram.commitTransaction("first");

    test.assert(diagram.undoManager.canUndo(), "should be able to undo");

    diagram.startTransaction();
    var d3 = { key: 3, color: "lightblue" };
    diagram.model.addNodeData(d3);
    var n3 = diagram.findNodeForData(d3);
    test.assert(n3 !== null, "no node 3?");
    n3.isSelected = true;
    diagram.commitTransaction("second");
  },
  function(test) {
    var diagram = test.diagram;
    var n1 = diagram.findNodeForKey(1);
    var n2 = diagram.findNodeForKey(2);
    var n3 = diagram.findNodeForKey(3);
    test.assert(diagram.selection.count === 3 && n1.isSelected && n2.isSelected && n3.isSelected, "should have three nodes selected");

    var mgr = diagram.undoManager;
    mgr.undo();
    test.assert(diagram.selection.count === 2 && n1.isSelected && n2.isSelected && !n3.isSelected, "should have first two nodes selected after one undo");
    test.assert(mgr.canUndo() && mgr.canRedo(), "should be able to undo and redo");

    mgr.undo();
    test.assert(diagram.selection.count === 0 && !n1.isSelected && !n2.isSelected && !n3.isSelected, "should have no nodes selected after two undos");
    test.assert(!mgr.canUndo() && mgr.canRedo(), "should be able to redo but not undo");

    mgr.redo();
    test.assert(diagram.selection.count === 0 && !n1.isSelected && !n2.isSelected && !n3.isSelected, "should have no nodes selected after one redo");
    test.assert(mgr.canUndo() && mgr.canRedo(), "should be able to undo and redo");

    mgr.redo();
    test.assert(diagram.selection.count === 0 && !n1.isSelected && !n2.isSelected && !n3.isSelected, "should have no nodes selected after two redos");
    test.assert(mgr.canUndo() && !mgr.canRedo(), "should be able to undo but not redo");
  }
  ));

  intro.add(new Test("link adorned after undo of ungroupSelection", null,
    function(test) {
      var d = test.diagram;
      d.reset();
      d.undoManager.isEnabled = true;
      d.model.nodeDataArray =
        [
          { key: 1, text: "Alpha", color: "lightblue", group: 4 },
          { key: 2, text: "Beta", color: "orange", group: 4 },
          { key: 4, text: "Delta", color: "pink", isGroup: true }
        ];
      d.model.linkDataArray =
        [
          { from: 1, to: 2 }
        ];
      d.nodes.each(function(n) { n.isSelected = true; });
      d.links.each(function(l) { l.isSelected = true; });
      d.findNodeForKey(4).ungroupable = true;
    },
    function(test) {
      var d = test.diagram;
      test.assert(d.nodes.all(function(n) { return n.adornments.count > 0; }));
      test.assert(d.links.all(function(l) { return l.adornments.count > 0; }));

      d.commit(function(d) {
        d.findNodeForKey(4).isSubGraphExpanded = false;
      }, "collapsed");

      test.assert(d.nodes.all(function(n) { return n instanceof go.Group || n.adornments.count === 0; }), "regular nodes should have no Adornments");
      test.assert(d.links.all(function(l) { return l.adornments.count === 0; }), "links should have no Adornments");
      test.assert(d.findNodeForKey(4).adornments.count > 0, "group should still have an Adornment");

      d.commandHandler.ungroupSelection();
      test.assert(d.nodes.all(function(n) { return n.adornments.count > 0; }), "nodes should be selected");
      test.assert(d.links.all(function(l) { return l.adornments.count > 0; }), "links should be selected");
      test.assert(d.findNodeForKey(4) === null, "group should be gone");
    },
    function(test) {
      var d = test.diagram;

      d.commandHandler.undo();
      test.assert(d.nodes.all(function(n) { return n.adornments.count === 0; }), "all nodes should be hidden and have no adornments");
      test.assert(d.links.all(function(l) { return l.adornments.count === 0; }), "all links should be hidden and have no adornments");
      test.assert(d.findNodeForKey(4) !== null, "group should exist again");
    }
  ))


function checkEnableds(test) {
  var cmdhnd = test.diagram.commandHandler;
  var commands = [
    "CollapseSubGraph",
    "CollapseTree",
    "CopySelection",
    "CutSelection",
    "DecreaseZoom",
    "DeleteSelection",
    "EditTextBlock",
    "ExpandSubGraph",
    "ExpandTree",
    "GroupSelection",
    "IncreaseZoom",
    "PasteSelection",
    "Redo",
    "ResetZoom",
    "ScrollToPart",
    "SelectAll",
    "ShowContextMenu",
    "Undo",
    "UngroupSelection",
    "ZoomToFit"
  ];
  // now call and remember all command predicates
  var state = {};
  for (var i = 0; i < commands.length; i++) {
    var cmdname = commands[i];
    state[cmdname] = cmdhnd["can" + cmdname]();
  }
  // now check for all of those that should be enabled
  var enabledcmdnames = test.enableds;
  for (var i = 0; i < enabledcmdnames.length; i++) {
    var cmdname = enabledcmdnames[i];
    test.assert(state[cmdname], "command " + cmdname + " should be enabled, but isn't for " + currentTxn(test));
  }
  // now check for all of those that should be disabled
  var disabledcmdnames = test.disableds;
  for (var i = 0; i < disabledcmdnames.length; i++) {
    var cmdname = disabledcmdnames[i];
    test.assert(!state[cmdname], "command " + cmdname + " should be disabled, but is enabled for " + currentTxn(test));
  }
}

function currentTxn(test) {
  var mgr = test.diagram.undoManager;
  if (mgr.isUndoingRedoing) {
    if (mgr.transactionToUndo || mgr.transactionToRedo) {
      return "'" + (mgr.transactionToUndo ? mgr.transactionToUndo.name : "") + " -- " + (mgr.transactionToRedo ? mgr.transactionToRedo.name : "") + "'";
    }
  } else if (mgr.isInTransaction) {
    if (mgr.currentTransaction) return mgr.currentTransaction.name;
    if (mgr.nestedTransactionNames.length > 0) return mgr.nestedTransactionNames.elt(0);
    return test.reason;
  }
  return test.reason;
}

intro.add(new Test("command enablements at end of transaction", null,
  function(test) {
    var diagram = test.diagram;
    diagram.reset();

    // allow the TextBlock to be edited
    diagram.nodeTemplate.elt(0).editable = true;
    // add an empty context menu on the nodes
    diagram.nodeTemplate.contextMenu = go.GraphObject.make("ContextMenu");
    // allow the group command to execute
    diagram.commandHandler.archetypeGroupData =
      { key: "Group", isGroup: true, color: "blue" };
    // modify the default group template to allow ungrouping
    diagram.groupTemplate.ungroupable = true;

    var nodeDataArray = [
      { key: "Alpha" },
      { key: "Beta" },
      { key: "Delta", group: "Epsilon" },
      { key: "Gamma", group: "Epsilon" },
      { key: "Epsilon", isGroup: true }
    ];
    var linkDataArray = [
      { from: "Alpha", to: "Beta" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    diagram.undoManager.isEnabled = true;

    test.enableds = [];
    test.disableds = [];
    test.reason = "";

    // notice whenever the selection may have changed
    diagram.addDiagramListener("ChangedSelection", function(e) {
      test.reason = "ChangedSelection";
      if (!test.ignoreChangedSelection) checkEnableds(test);
    });
    // notice when the Paste command may need to be reenabled
    diagram.addDiagramListener("ClipboardChanged", function(e) {
      test.reason = "ClipboardChanged";
      checkEnableds(test);
    });
    // notice whenever a transaction or undo/redo has occurred
    diagram.addModelChangedListener(function(e) {
      if (e.isTransactionFinished) {
        test.reason = currentTxn(test);
        checkEnableds(test);
      }
    });
  },
  function(test) {
    var diagram = test.diagram;
    var alpha = diagram.findNodeForKey("Alpha");
    var beta = diagram.findNodeForKey("Beta");
    var gamma = diagram.findNodeForKey("Gamma");
    var delta = diagram.findNodeForKey("Delta");
    var epsilon = diagram.findNodeForKey("Epsilon");

    // by default, with nothing selected:
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit"];
    test.disableds = ["CollapseSubGraph", "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock", "ExpandSubGraph", "ExpandTree",
      "GroupSelection", "PasteSelection", "Redo", "ScrollToPart", "ShowContextMenu", "Undo", "UngroupSelection"];
    test.reason = "initial default";
    checkEnableds(test);

    // with a regular node selected:
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock",
      "GroupSelection", "ScrollToPart", "ShowContextMenu"];
    test.disableds = ["CollapseSubGraph", "ExpandSubGraph", "ExpandTree", "PasteSelection", "Redo", "Undo", "UngroupSelection"];
    test.reason = "selecting Alpha";
    diagram.select(alpha);

    // collapsed tree
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock", "ExpandTree",
      "GroupSelection", "ScrollToPart", "ShowContextMenu", "Undo"];
    test.disableds = ["CollapseTree", "CollapseSubGraph", "ExpandSubGraph", "PasteSelection", "Redo", "UngroupSelection"];
    diagram.commandHandler.collapseTree();

    // selected group
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseSubGraph", "CopySelection", "CutSelection", "DeleteSelection",
      "GroupSelection", "ScrollToPart", "Undo", "UngroupSelection"];
    test.disableds = ["CollapseTree", "EditTextBlock", "ExpandSubGraph", "ExpandTree", "PasteSelection", "Redo", "ShowContextMenu"];
    test.reason = "deselecting node, selecting group";
    diagram.select(epsilon);

    // collapsed group
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CopySelection", "CutSelection", "DeleteSelection", "ExpandSubGraph",
      "GroupSelection", "ScrollToPart", "Undo", "UngroupSelection"];
    test.disableds = ["CollapseTree", "CollapseSubGraph", "EditTextBlock", "ExpandTree", "PasteSelection", "Redo", "ShowContextMenu"];
    diagram.commandHandler.collapseSubGraph();

    // undo collapsed group
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseSubGraph", "CopySelection", "CutSelection", "DeleteSelection",
      "GroupSelection", "Redo", "ScrollToPart", "Undo", "UngroupSelection"];
    test.disableds = ["CollapseTree", "EditTextBlock", "ExpandSubGraph", "ExpandTree", "PasteSelection", "ShowContextMenu"];
    diagram.commandHandler.undo();

    // undo collapsed tree
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseSubGraph", "CopySelection", "CutSelection", "DeleteSelection",
      "GroupSelection", "Redo", "ScrollToPart", "UngroupSelection"];
    test.disableds = ["CollapseTree", "EditTextBlock", "ExpandSubGraph", "ExpandTree", "PasteSelection", "ShowContextMenu", "Undo"];
    diagram.commandHandler.undo();

    // select another regular node
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock",
      "GroupSelection", "Redo", "ScrollToPart", "ShowContextMenu"];
    test.disableds = ["CollapseSubGraph", "ExpandSubGraph", "ExpandTree", "PasteSelection", "Undo", "UngroupSelection"];
    test.reason = "selecting Beta";
    diagram.select(beta);

    // move the node
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock",
      "GroupSelection", "ScrollToPart", "ShowContextMenu", "Undo"];
    test.disableds = ["CollapseSubGraph", "ExpandSubGraph", "ExpandTree", "PasteSelection", "Redo", "UngroupSelection"];
    diagram.commit(function(d) {
      beta.move(new go.Point(200, 50));
    }, "moved Beta");

    test.ignoreChangedSelection = true;

    // copy beta and link
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock",
      "GroupSelection", "PasteSelection", "ScrollToPart", "ShowContextMenu", "Undo"];
    test.disableds = ["CollapseSubGraph", "ExpandSubGraph", "ExpandTree", "Redo", "UngroupSelection"];
    diagram.commandHandler.copySelection();

    // paste beta and link
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock",
      "GroupSelection", "PasteSelection", "ScrollToPart", "ShowContextMenu", "Undo"];
    test.disableds = ["CollapseSubGraph", "ExpandSubGraph", "ExpandTree", "Redo", "UngroupSelection"];
    diagram.commandHandler.pasteSelection();

    // delete selection -- nothing will be selected
    test.enableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "PasteSelection", "Undo"];
    test.disableds = ["CollapseSubGraph", "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock", "ExpandSubGraph", "ExpandTree",
      "GroupSelection", "Redo", "ScrollToPart", "ShowContextMenu", "UngroupSelection"];
    diagram.commandHandler.deleteSelection();

    test.enableds = ["ResetZoom", "SelectAll", "ZoomToFit",
      "PasteSelection", "Undo"];
    test.disableds = ["DecreaseZoom", "IncreaseZoom",
      "CollapseSubGraph", "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock", "ExpandSubGraph", "ExpandTree",
      "GroupSelection", "Redo", "ScrollToPart", "ShowContextMenu", "UngroupSelection"];
    test.reason = "scale must be 1.0";
    diagram.minScale = 1.0;
    diagram.maxScale = 1.0;
    checkEnableds(test);

    test.enableds = [];
    test.disableds = ["DecreaseZoom", "IncreaseZoom", "ResetZoom", "SelectAll", "ZoomToFit",
      "CollapseSubGraph", "CollapseTree", "CopySelection", "CutSelection", "DeleteSelection", "EditTextBlock", "ExpandSubGraph", "ExpandTree",
      "GroupSelection", "PasteSelection", "Redo", "ScrollToPart", "ShowContextMenu", "Undo", "UngroupSelection"];
    diagram.isEnabled = false;

    test.enableds = [];
    test.disableds = [];
  }));

  intro.add(new Test("maxHistoryLength 2", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
    },  // need to wait for diagram init to finish
    function(test) {
      var diag = test.diagram;
      var mgr = diag.undoManager;
      mgr.isEnabled = true;
      mgr.maxHistoryLength = 2;
      var saved = [];
      var recordTransaction = function(c) {
        if (c.isTransactionFinished && c.object instanceof go.Transaction) saved.push(c.object);
      };
      diag.addModelChangedListener(recordTransaction);
      test.assert(mgr.history.count === 0 && saved.length === 0, "expected no history: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 1 }); }, "one");
      test.assert(mgr.history.count === 1 && saved.length === 1, "expected history at 1: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 2 }); }, "two");
      test.assert(mgr.history.count === 2 && saved.length === 2, "expected history at 2: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 3 }); }, "three");
      test.assert(mgr.history.count === 2 && saved.length === 3, "expected history stay at 2: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 4 }); }, "four");
      test.assert(mgr.history.count === 2 && saved.length === 4, "expected history stay at 2: " + mgr.history.count + " " + saved.length);
      diag.removeModelChangedListener(recordTransaction);
    }));

  intro.add(new Test("maxHistoryLength 0", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
    },  // need to wait for diagram init to finish
    function(test) {
      var diag = test.diagram;
      var mgr = diag.undoManager;
      mgr.isEnabled = true;
      mgr.maxHistoryLength = 0;
      var saved = [];
      var recordTransaction = function(c) {
        if (c.isTransactionFinished && c.object instanceof go.Transaction) saved.push(c.object);
      };
      diag.addModelChangedListener(recordTransaction);
      test.assert(mgr.history.count === 0 && saved.length === 0, "expected no history: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 1 }); }, "one");
      test.assert(mgr.history.count === 0 && saved.length === 1, "expected no history but 1 transaction: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 2 }); }, "two");
      test.assert(mgr.history.count === 0 && saved.length === 2, "expected no history but 2 transactions: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 3 }); }, "three");
      test.assert(mgr.history.count === 0 && saved.length === 3, "expected no history but 3 transactions: " + mgr.history.count + " " + saved.length);
      diag.model.commit(function(m) { m.addNodeData({ key: 4 }); }, "four");
      test.assert(mgr.history.count === 0 && saved.length === 4, "expected no history but 4 transactions: " + mgr.history.count + " " + saved.length);
      diag.removeModelChangedListener(recordTransaction);
    }
  ));

  intro.add(new Test("change category", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var $ = go.GraphObject.make;
      diag.maxSelectionCount = 1;
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock, new go.Binding("text"))
        );
      diag.nodeTemplateMap.add("Other",
        $(go.Node, "Horizontal",
          $(go.Shape, { width: 20, height: 20 }),
          $(go.TextBlock, new go.Binding("text"))
        ));

      diag.model = new go.TreeModel([
        { key: 1, text: "One" },
        { key: 2, text: "Two" }
      ]);

      diag.model.undoManager.isEnabled = true;
      diag.select(diag.findNodeForKey(1));
    },
    function(test) {
      var diag = test.diagram;
      var one = diag.findNodeForKey(1);
      var two = diag.findNodeForKey(2);
      test.savedLocations = [ one.location.copy(), two.location.copy() ];
      diag.commit(function(d) {
        one.category = "Other";
        two.category = "Other";
      });
      test.assert(one.category === "Other" && two.category === "Other", "didn't change categories");
      test.assert(one.location.equals(test.savedLocations[0]), "node One moved " + test.savedLocations[0].toString() + " " + one.location.toString());
      test.assert(two.location.equals(test.savedLocations[1]), "node Two moved " + test.savedLocations[1].toString() + " " + two.location.toString());
      test.assert(one.isSelected && diag.selection.count === 1 && diag.selection.has(one), "node One should be selected");
    },
    function(test) {
      var diag = test.diagram;
      var one = diag.findNodeForKey(1);
      var two = diag.findNodeForKey(2);
      diag.undoManager.undo();

      test.assert(one.category === "" && two.category === "", "didn't restore categories");
      test.assert(one.type === go.Panel.Vertical && two.type === go.Panel.Vertical, "didn't restore panel types");
      test.assert(one.location.equals(test.savedLocations[0]), "node One moved " + test.savedLocations[0].toString() + " " + one.location.toString());
      test.assert(two.location.equals(test.savedLocations[1]), "node Two moved " + test.savedLocations[1].toString() + " " + two.location.toString());
      test.assert(one.isSelected && diag.selection.count === 1 && diag.selection.has(one), "node One should be selected");

      diag.undoManager.redo();
      test.assert(one.category === "Other" && two.category === "Other", "didn't change categories");
      test.assert(one.type === go.Panel.Horizontal && two.type === go.Panel.Horizontal, "didn't restore panel types");
      test.assert(one.location.equals(test.savedLocations[0]), "node One moved " + test.savedLocations[0].toString() + " " + one.location.toString());
      test.assert(two.location.equals(test.savedLocations[1]), "node Two moved " + test.savedLocations[1].toString() + " " + two.location.toString());
      test.assert(one.isSelected && diag.selection.count === 1 && diag.selection.has(one), "node One should be selected");
    }
  ));

  intro.add(new Test("geometry size reshape", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var $ = go.GraphObject.make;

      // this test doesn't need to use the actual GeometryReshapingTool or the ResizingTool
      diag.nodeTemplate =
        $(go.Node,
          { selectionObjectName: "SHAPE" },
          { reshapable: true },  // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
          { resizable: true, resizeObjectName: "SHAPE" },
          { rotatable: true, rotateObjectName: "SHAPE" },
          $(go.Shape,
            { name: "SHAPE", fill: "lightgray", strokeWidth: 1.5 },
            new go.Binding("geometryString", "geo").makeTwoWay(),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle").makeTwoWay())
        );

      diag.model = new go.GraphLinksModel([{ geo: "F M0 145 L75 12 L131 87 L195 0 L249 130z", key: -1 }], []);

      diag.model.undoManager.isEnabled = true;
      diag.select(diag.findNodeForKey(-1));
    },
    function(test) {
      var diag = test.diagram;

      var node = diag.nodes.first();
      var shape = node.findObject("SHAPE");
      diag.commit(function(d) {
        // as if ResizingTool resizing somewhat bigger
        shape.desiredSize = new go.Size(300, 200);
      });

      test.IntermediateGeometry = shape.geometry.toString();

      diag.commit(function(d) {
        // as if GeometryReshapingTool moving a point
        shape.desiredSize = new go.Size(NaN, NaN);
        var geo = shape.geometry.copy();
        var seg = geo.figures.first().segments.elt(1);
        seg.endX -= 30;
        seg.endY -= 20;
        shape.geometry = geo;
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      var shape = node.findObject("SHAPE");
      diag.commandHandler.undo();

      test.assert(shape.geometry.type === go.Geometry.Path, "undo after setting desiredSize to NaNxNaN and setting geometry had better not be a Rectangle Geometry")
      test.assert(shape.geometry.toString() === test.IntermediateGeometry, "should be second Geometry")
    }
  ));

  intro.add(new Test('loc bind undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      // define a simple Node template
      diagram.nodeTemplate = new go.Node("Auto")
          .bind(new go.Binding("location", "loc").makeTwoWay())
          // .bind(new go.Binding("location", "loc").makeTwoWay(function(p) { return p.copy(); }))
          // .bind(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify))
          .add(new go.Shape("RoundedRectangle",
            { strokeWidth: 0, fill: "white" })
            .bind("fill", "color")
          )
          .add(new go.TextBlock( { margin: 8, font: "bold 14px sans-serif", stroke: '#333' })
            .bind("text", "key"));


      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
        [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
        { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var orig = new go.Point(0,0);
      var moved = new go.Point(100,100);
      const n = diagram.nodes.first();
      test.assert(n.location.equals(orig));
      test.assert(n.data.loc.equals(orig));
      diagram.commit(() => {
        n.moveTo(100, 100);
      }, "Move");
      test.assert(n.location.equals(moved));
      test.assert(n.data.loc.equals(moved));

      diagram.undoManager.undo();
      test.assert(n.location.equals(orig));
      test.assert(n.data.loc.equals(orig));
    }, // END TEST
    null
  ));

  intro.add(new Test('pos bind undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      // define a simple Node template
      diagram.nodeTemplate = new go.Node("Auto")
          .bind(new go.Binding("position", "pos").makeTwoWay())
          .add(new go.Shape("RoundedRectangle",
            { strokeWidth: 0, fill: "white" })
            .bind("fill", "color")
          )
          .add(new go.TextBlock( { margin: 8, font: "bold 14px sans-serif", stroke: '#333' })
            .bind("text", "key"));

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
        [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" }
        ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var orig = new go.Point(0,0);
      var moved = new go.Point(100,100);
      const n = diagram.nodes.first();
      test.assert(n.position.equals(orig));
      test.assert(n.data.pos.equals(orig));
      diagram.commit(() => {
        n.moveTo(100, 100);
      }, "Move");
      test.assert(n.position.equals(moved));
      test.assert(n.data.pos.equals(moved));

      diagram.undoManager.undo();
      test.assert(n.position.equals(orig));
      test.assert(n.data.pos.equals(orig));
    }, // END TEST
    null
  ));


intro.add(new Test('discard', null,
  function (test) {
    var diag = test.diagram;
    diag.reset();
    diag.nodeTemplate = new go.Node()
      .add(new go.TextBlock({ font: "20pt sans-serif"})
          .bind("text", "val"));
    diag.undoManager.isEnabled = true;

    diag.model = new go.GraphLinksModel([ { key: 0, val: 0 }]);
  }, // END SETUP
  function (test) {
    var diag = test.diagram;
    var data = diag.model.nodeDataArray[0];
    diag.model.commit(m => m.set(data, "val", 1));
    diag.model.commit(m => m.set(data, "val", 2));
    diag.model.commit(m => m.set(data, "val", 3));
    diag.model.commit(m => m.set(data, "val", 4));
    diag.model.commit(m => m.set(data, "val", 5));
  },
  function (test) {
    var diag = test.diagram;
    var mgr = diag.undoManager;
    var data = diag.model.nodeDataArray[0];
    test.assert(data.val === 5 && mgr.history.count === 5 && mgr.historyIndex === 4, "isn't 5")
    test.assert(mgr.canUndo() && !mgr.canRedo(), "should be undoable and but not redoable")
    diag.undoManager.undo()
    diag.undoManager.undo()
    diag.undoManager.undo()
    test.assert(data.val === 2 && mgr.history.count === 5 && mgr.historyIndex === 1, "isn't 2")
    test.assert(mgr.canUndo() && mgr.canRedo(), "should be undoable and redoable")

    diag.undoManager.discardHistoryAfterIndex();
    test.assert(data.val === 2 && mgr.history.count === 2 && mgr.historyIndex === 1, "history count should be 2")
    test.assert(mgr.canUndo() && !mgr.canRedo(), "should be undoable and but not redoable")
  }, // END TEST
  null
));

intro.add(new Test('discard not, nothing', null,
  function (test) {
    var diag = test.diagram;
    diag.reset();
    diag.nodeTemplate = new go.Node()
      .add(new go.TextBlock({ font: "20pt sans-serif"})
          .bind("text", "val"));
    diag.undoManager.isEnabled = true;

    diag.model = new go.GraphLinksModel([ { key: 0, val: 0 }]);
  }, // END SETUP
  function (test) {
    var diag = test.diagram;
    var data = diag.model.nodeDataArray[0];
    diag.model.commit(m => m.set(data, "val", 1));
    diag.model.commit(m => m.set(data, "val", 2));
    diag.model.commit(m => m.set(data, "val", 3));
    diag.model.commit(m => m.set(data, "val", 4));
    diag.model.commit(m => m.set(data, "val", 5));
  },
  function (test) {
    var diag = test.diagram;
    var mgr = diag.undoManager;
    var data = diag.model.nodeDataArray[0];
    test.assert(data.val === 5 && mgr.history.count === 5 && mgr.historyIndex === 4, "isn't 5")
    test.assert(mgr.canUndo() && !mgr.canRedo(), "should be undoable and but not redoable")

    // this should fail
    diag.undoManager.discardHistoryAfterIndex();
    test.assert(data.val === 5 && mgr.history.count === 5 && mgr.historyIndex === 4, "isn't 5")
    test.assert(mgr.canUndo() && !mgr.canRedo(), "should be undoable and but not redoable")

    // completely unwind the history
    while (diag.undoManager.historyIndex >= 0) diag.undoManager.undo()
    test.assert(data.val === 0 && mgr.history.count === 5 && mgr.historyIndex === -1, "isn't 0")
    test.assert(!mgr.canUndo() && mgr.canRedo(), "should be not undoable but should be redoable")

    // this should leave an empty history
    diag.undoManager.discardHistoryAfterIndex();
    test.assert(data.val === 0 && mgr.history.count === 0 && mgr.historyIndex === -1, "isn't 0")
    test.assert(!mgr.canUndo() && !mgr.canRedo(), "should be not undoable and not redoable")
  }, // END TEST
  null
));

})();

/*
  intro.add(new Test('loc bind undo/redo', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;

    }, // END TEST
    null
  ));
  */