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
  // use the default Link template

  function CommonSetupGraphLinks(test) {

    test.diagram.layout = new go.ForceDirectedLayout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      {key: 1, text: "n1"},
      {key: 2, text: "n2"},
      {key: 3, text: "n3"},
      {key: 4, text: "n4"},
      {key: 5, text: "n5"},
      {key: 6, text: "n6"},
      {key: 7, text: "n7"},
      {key: 8, text: "n8"}
    ];
    m.linkDataArray = [
      {from: 1, to: 2},
      {from: 1, to: 3},
      {from: 2, to: 4},
      {from: 2, to: 5},
      {from: 3, to: 6},
      {from: 5, to: 7},
      {from: 6, to: 8}
    ];
    test.diagram.model = m;
  }

  function AllNodesLocatedCheck(test) {
    var it = test.diagram.nodes;
    while (it.next()) {
      var n = it.value;
      var loc = n.location;
      test.assert(loc.isReal(), 'Unassigned location for node: ' + n.toString());
    }
  }

  function DifferentLocationsCheck(test) {
    var it = test.diagram.nodes;
    while (it.next()) {
      var n = it.value;
      var loc = n.location;
      var it2 = test.diagram.nodes;
      while (it2.next()) {
        var n2 = it2.value;
        if (n2 !== n) {
          test.assert(!n2.location.equals(loc), 'Two nodes with same location: ' + n.toString() + ' ' + n2.toString());
        }
      }
    }
  }

  // ForceDirectedLayout:
  var fd = new TestCollection('ForceDirectedLayout');
  fd.preSetup = function(test) {
    // define the Node template
    var $ = go.GraphObject.make;
    test.diagram.nodeTemplate =
      $(go.Node, "Vertical",
        //{background: 'lime'},
        $(go.Shape,
          { figure: "Ellipse",
            fill: "lightgray",
            desiredSize: new go.Size(30, 30) }),
        $(go.TextBlock,
          new go.Binding("text")));
  }
  TestRoot.add(fd);

  fd.add(new Test('ForceDirectedVertex/Edge properties', null, null, null,
    function(test) {
      var net = new go.ForceDirectedNetwork(test.diagram.layout);
      var v = net.createVertex();
      test.assert(v.network === net);
      test.assert(v.node === null);
      test.assert(v.isFixed === false);
      test.assert(isNaN(v.charge));
      test.assert(isNaN(v.mass));
      test.assert(v.forceX === 0);
      test.assert(v.forceY === 0);

      var e = net.createEdge();
      test.assert(e.network === net);
      test.assert(e.link === null);
      test.assert(e.fromVertex === null);
      test.assert(e.toVertex === null);
      test.assert(isNaN(e.stiffness));
      test.assert(isNaN(e.length));
    }
  ));

  fd.add(new Test('layout located all nodes', null, CommonSetupGraphLinks, null, AllNodesLocatedCheck));

  fd.add(new Test('nodes at different locations', null, CommonSetupGraphLinks, null, DifferentLocationsCheck));

  fd.add(new Test('invalidation on new node', null, CommonSetupGraphLinks,
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add node");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      diagram.model.addNodeData({ key: 9, text: "ADDED NODE" });
      test.assert(!diagram.layout.isValidLayout, "adding node should have invalidated the Diagram.layout");
      diagram.commitTransaction("add node");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));

  fd.add(new Test('invalidation on removing node', null, CommonSetupGraphLinks,
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("remove node");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      var node = diagram.findNodeForKey(1);
      test.assert(node !== null, "didn't find Node n1");
      node.isSelected = true;
      diagram.commandHandler.deleteSelection();
      test.assert(!diagram.layout.isValidLayout, "removing node should have invalidated the Diagram.layout");
      diagram.commitTransaction("remove node");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));

  fd.add(new Test('NO invalidation on new node', null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.nodeTemplate.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutAdded;
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add node");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      diagram.model.addNodeData({ key: 9, text: "ADDED NODE" });
      var node = diagram.findNodeForKey(9);
      test.assert(node !== null, "didn't find new node");
      test.assert(diagram.layout.isValidLayout, "adding node should NOT have invalidated the Diagram.layout");
      diagram.commitTransaction("add node");
      test.assert(!node.location.isReal(), "no layout means new node shouldn't have a real location, instead of " + node.location.toString());
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
      test.diagram.nodeTemplate.layoutConditions = go.Part.LayoutStandard;
    }
  ));

  fd.add(new Test('NO invalidation on removing node', null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.nodes.each(function(n) { n.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutRemoved });
      test.diagram.links.each(function(l) { l.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutRemoved });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("remove node");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      var node = diagram.findNodeForKey(1);
      test.assert(node !== null, "didn't find Node n1");
      node.isSelected = true;
      diagram.commandHandler.deleteSelection();
      test.assert(diagram.layout.isValidLayout, "removing node should NOT have invalidated the Diagram.layout");
      diagram.commitTransaction("remove node");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));


  fd.add(new Test('invalidation on new link', null, CommonSetupGraphLinks,
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add link");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      diagram.model.addLinkData({ from: 1, to: 6 });
      test.assert(!diagram.layout.isValidLayout, "adding link should have invalidated the Diagram.layout");
      diagram.commitTransaction("add link");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));

  fd.add(new Test('invalidation on removing link', null, CommonSetupGraphLinks,
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("remove link");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      var link = diagram.links.first();
      test.assert(link !== null, "didn't find a Link");
      link.isSelected = true;
      diagram.commandHandler.deleteSelection();
      test.assert(!diagram.layout.isValidLayout, "removing link should have invalidated the Diagram.layout");
      diagram.commitTransaction("remove link");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));

  fd.add(new Test('NO invalidation on new link', null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.linkTemplate.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutAdded;
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add link");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      diagram.model.addLinkData({ from: 1, to: 6 });
      test.assert(diagram.layout.isValidLayout, "adding link should NOT have invalidated the Diagram.layout");
      diagram.commitTransaction("add link");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
      test.diagram.linkTemplate.layoutConditions = go.Part.LayoutStandard;
    }
  ));

  fd.add(new Test('NO invalidation on removing link', null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.nodes.each(function(n) { n.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutRemoved });
      test.diagram.links.each(function(l) { l.layoutConditions = go.Part.LayoutStandard & ~go.Part.LayoutRemoved });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("remove link");
      test.assert(diagram.layout.isValidLayout, "should have started with a valid layout");
      var link = diagram.links.first();
      test.assert(link !== null, "didn't find a Link");
      link.isSelected = true;
      diagram.commandHandler.deleteSelection();
      test.assert(diagram.layout.isValidLayout, "removing link should NOT have invalidated the Diagram.layout");
      diagram.commitTransaction("remove link");
    },
    function(test) {
      test.assert(test.diagram.layout.isValidLayout, "after transaction Diagram.layout should be valid");
    }
  ));

  function SetupGraphLinksRepeatable(test) {

    var lay = new go.ForceDirectedLayout();
    lay.randomNumberGenerator = null;  // don't use Math.random
    test.diagram.layout = lay;
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 8 }
    ];
    test.diagram.model = m;
  }

  fd.add(new Test('repeatable results', null,
    function(test) {
      SetupGraphLinksRepeatable(test);
    },
    function(test) {
      var first = [];
      test.diagram.nodes.each(function(n) { first.push(n.location); });
      test.firstResults = first;
      SetupGraphLinksRepeatable(test);
    },
    function(test) {
      test.assertAllNodeLocations(test.firstResults);
    }
  ));

})();
