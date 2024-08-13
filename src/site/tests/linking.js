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
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1", loc: new go.Point(0, 50) },  // these locations are used in the tests!
      { key: 2, text: "n2", loc: new go.Point(100, 0) },
      { key: 3, text: "n3", loc: new go.Point(100, 100) }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 }
    ];
    test.diagram.model = m;
  }

  // CheckGraph(test, [id, #linksTotal, #linksIn, #linksOut], ...);
  function CheckGraph(test) {
    var msg = "";
    var diagram = test.diagram;
    for (var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
      var id = arg[0];
      var n = diagram.findNodeForKey(id);
      if (!(n !== null)) msg += "\n  couldn't find node " + id;
      if (n !== null) {
        if (n.port === null || !(n.port instanceof go.Shape)) msg += "\n  no or wrong port for node " + id;
        var it = n.ports;
        if (it.count !== 1) msg += "\n  ports.count != 1, got " + it.count;
        it.next(); if (!(it.value instanceof go.Shape)) msg += "\n  port is not a Shape; got " + it.value.toString();
        var tot = arg[1];
        if (!(n.linksConnected.count === tot)) msg += "\n  wrong # linksConnected of node " + id + "; got " + n.linksConnected.count + " expected " + tot;
        if (!(n.findLinksConnected().count === tot)) msg += "\n  wrong # findLinksConnected of node " + id + "; got " + n.findLinksConnected().count + " expected " + tot;
        if (!(n.findLinksConnected(null).count === tot)) msg += "\n  wrong # findLinksConnected of node " + id + "; got " + n.findLinksConnected(null).count + " expected " + tot;
        var into = arg[2];
        if (!(n.findLinksInto().count === into)) msg += "\n  wrong # findLinksInto node " + id + "; got " + n.findLinksInto().count + " expected " + into;
        if (!(n.findLinksInto(null).count === into)) msg += "\n  wrong # findLinksInto node " + id + "; got " + n.findLinksInto(null).count + " expected " + into;
        var outof = arg[3];
        if (!(n.findLinksOutOf().count === outof)) msg += "\n  wrong # findLinksOutOf node " + id + "; got " + n.findLinksOutOf().count + " expected " + outof;
        if (!(n.findLinksOutOf(null).count === outof)) msg += "\n  wrong # findLinksOutOf node " + id + "; got " + n.findLinksOutOf(null).count + " expected " + outof;
      }
    }
    test.assert(msg.length === 0, msg);
  }

  // CheckLinkData(test, 3, [from1, to1], [from2, to2], [from3, to3]);
  function CheckLinkData(test, numlinks) {
    var msg = "";
    var model = test.diagram.model;
    if (!(model.linkDataArray.length === numlinks)) msg += "\n  wrong # link data: " + model.linkDataArray.length + " expected " + numlinks;
    for (var i = 2; i < arguments.length; i++) {
      var arg = arguments[i];
      var data = model.linkDataArray[i - 2];
      if (!(data.from === arg[0])) msg += "\n  link data #" + (i - 2) + " coming from " + data.from + " expected " + arg[0];
      if (!(data.to === arg[1])) msg += "\n  link data #" + (i - 2) + " going to " + data.to + " expected " + arg[1];
    }
    test.assert(msg.length === 0, msg);
  }

  var gc = new TestCollection("Linking");
  gc.preSetup = function(test) {
    // define the Node template
    var $ = go.GraphObject.make;
    test.diagram.nodeTemplate =
      $(go.Node, "Vertical",
        { locationSpot: go.Spot.Center,
          locationObjectName: "shape",
          linkConnected: function(n, l, p) {
            if (!test.eventLog) test.eventLog = [];
            test.eventLog.push("Connected " + l + " (" + l.data.from + " " + l.data.to + ") to " + n + (p !== null ? " " + p : ""));
          },
          linkDisconnected: function(n, l, p) {
            if (!test.eventLog) test.eventLog = [];
            test.eventLog.push("Disconnected " + l + " (" + l.data.from + " " + l.data.to + ") from " + n + (p !== null ? " " + p : ""));
          }
        },
        new go.Binding("location", "loc"),
        $(go.Panel, "Spot",
          $(go.Shape,
            { fill: "gray",
              stroke: null,
              desiredSize: new go.Size(30, 30),
              name: "shape",
              portId: "",
              fromLinkable: true,
              toLinkable: true,
              cursor: "pointer"
            }),
          $(go.Shape,
            { fill: "lightblue",
              stroke: null,
              desiredSize: new go.Size(20, 20)
            })),
        $(go.TextBlock,
          new go.Binding("text")));
  }
  TestRoot.add(gc);

  var tc = new TestCollection("Linking");
  gc.add(tc);

  tc.add(new Test("init", null, CommonSetupGraphLinks,
    null,
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
    }
  ));

  tc.add(new Test("model new link", null, CommonSetupGraphLinks,
    function(test) {
      test.diagram.startTransaction("new link");
      test.diagram.model.addLinkData({ from: 1, to: 3 });
      test.diagram.commitTransaction("new link");
    },
    function(test) {
      CheckGraph(test, [1, 2, 0, 2], [2, 1, 1, 0], [3, 1, 1, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 3]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("draw new link", null, CommonSetupGraphLinks,
    function(test) {
      test.diagram.select(test.diagram.links.first()); // select first link so we can assure it's deselected upon creation of new link
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 75), { timestamp: 100 });
      test.mouseUp(new go.Point(100, 100), { timestamp: 200 });
    },
    function(test) {
      CheckGraph(test, [1, 2, 0, 2], [2, 1, 1, 0], [3, 1, 1, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 3]);
      test.assert(test.diagram.selection.count === 1, "should only have one selected link after drawing new link");
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 3,
                  "the link from 1 to 3 should be selected");
    }
  ));

  tc.add(new Test("draw new link cancel", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 75), { timestamp: 100 });
      test.keyDown('Escape');
    },
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("no new link", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(-50, -50), { timestamp: 100 });
      test.mouseUp(new go.Point(-100, -100), { timestamp: 200 });  // far away
    },
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("no new link at", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(100, 100), { timestamp: 100 });  // at a valid port
      test.mouseUp(new go.Point(-100, -100), { timestamp: 200 });  // but mouse-up far away
    },
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("no duplicate link", null, CommonSetupGraphLinks,
    function(test) {
      var oldgravity = test.diagram.toolManager.linkingTool.portGravity;
      test.diagram.toolManager.linkingTool.portGravity = 0;
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 50), { timestamp: 100 });
      test.mouseUp(new go.Point(100, 0), { timestamp: 200 });  // at an invalid port
      test.diagram.toolManager.linkingTool.portGravity = oldgravity;
    },
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("allow duplicate link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      // change N1 to allow duplicates links going out, and N2 to allow duplicate links coming in
      var nit = test.diagram.nodes;
      while (nit.next()) {
        var node = nit.value;
        var port = node.port;
        test.assert(port instanceof go.Shape, "node.port wasn't a Shape");
        if (node.data.key === 1) port.fromLinkableDuplicates = true;
        if (node.data.key === 2) port.toLinkableDuplicates = true;
      }
    },
    function(test) {
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 50), { timestamp: 100 });
      test.mouseUp(new go.Point(100, 0), { timestamp: 200 });  // at a valid port!
    },
    function(test) {
      CheckGraph(test, [1, 2, 0, 2], [2, 2, 2, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 2]);
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 2,
                  "the link from 1 to 2 should be selected");
      var n1 = test.diagram.findNodeForKey(1);
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n1.findLinksBetween(n2).count === 2, "should have two links between n1 & n2");
      test.assert(n2.findLinksBetween(n1).count === 2, "should have two links between n2 & n1");
      test.assert(n1.findLinksTo(n2).count === 2, "should have two links from n1 to n2");
      test.assert(n2.findLinksTo(n1).count === 0, "should have zero links from n2 to n1");
    }
  ));

  tc.add(new Test("no self link", null, CommonSetupGraphLinks,
    function(test) {
      var oldgravity = test.diagram.toolManager.linkingTool.portGravity;
      test.diagram.toolManager.linkingTool.portGravity = 0;
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 50), { timestamp: 100 });
      test.mouseUp(new go.Point(0, 50), { timestamp: 200 });  // at an invalid port
      test.diagram.toolManager.linkingTool.portGravity = oldgravity;
    },
    function(test) {
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      test.assert(test.diagram.selection.count === 0, "nothing should be selected");
    }
  ));

  tc.add(new Test("allow self link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      // change N1 to allow reflexive links
      var node = test.diagram.findNodeForKey(1);
      test.assert(node !== null && node.port instanceof go.Shape, "node.port wasn't a Shape");
      node.port.fromLinkableSelfNode = true;
      node.port.toLinkableSelfNode = true;
    },
    function(test) {
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(50, 50), { timestamp: 100 });
      test.mouseUp(new go.Point(0, 50), { timestamp: 200 });  // at a valid port!
    },
    function(test) {
      CheckGraph(test, [1, 2, 1, 2], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 1]);
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 1,
                  "the link from 1 to 1 should be selected");
      var n1 = test.diagram.findNodeForKey(1);
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n1.findLinksBetween(n1).count === 1, "should have one self-link on n1");
      test.assert(n1.findLinksBetween(n2).count === 1, "should have one link between n1 & n2");
      test.assert(n2.findLinksBetween(n1).count === 1, "should have one link between n2 & n1");
      test.assert(n1.findLinksTo(n2).count === 1, "should have one link from n1 to n2");
      test.assert(n2.findLinksTo(n1).count === 0, "should have zero links from n2 to n1");
    }
  ));

  tc.add(new Test("high gravity", null, CommonSetupGraphLinks,
    function(test) {
      test.diagram.toolManager.linkingTool.portGravity = 1000;
      test.mouseDown(new go.Point(12, 52), { timestamp: 0 });
      test.mouseMove(new go.Point(450, 475), { timestamp: 100 });
      test.mouseUp(new go.Point(500, 500), { timestamp: 200 });  // relatively far away, but within 1000
      test.diagram.toolManager.linkingTool.portGravity = 100;
    },
    function(test) {
      CheckGraph(test, [1, 2, 0, 2], [2, 1, 1, 0], [3, 1, 1, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 3]);
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 3,
                  "the link from 1 to 3 should be selected");
    }
  ));

  tc.add(new Test("draw new link backwards", null,
    function(test) {
      CommonSetupGraphLinks(test);
      // change N3 to disallow fromLinkable
      var node = test.diagram.findNodeForKey(3);
      test.assert(node !== null && node.port instanceof go.Shape, "node.port wasn't a Shape");
      node.port.fromLinkable = false;
    },
    function(test) {
      test.mouseDown(new go.Point(112, 102), { timestamp: 0 });  // start at N3 port
      test.mouseMove(new go.Point(50, 75), { timestamp: 100 });
      test.mouseUp(new go.Point(0, 50), { timestamp: 200 });  // end near N1
    },
    function(test) {
      // but new link should still go from N1 to N3
      CheckGraph(test, [1, 2, 0, 2], [2, 1, 1, 0], [3, 1, 1, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 3]);
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 3,
                  "the link from 1 to 3 should be selected");
    }
  ));

  tc.add(new Test("draw new backwards only", null, CommonSetupGraphLinks,
    function(test) {
      // change LinkingTool to allow only drawing links backwards
      test.diagram.toolManager.linkingTool.direction = go.LinkingTool.BackwardsOnly;
      test.mouseDown(new go.Point(112, 102), { timestamp: 0 });  // start at N3 port
      test.mouseMove(new go.Point(50, 75), { timestamp: 100 });
      test.mouseUp(new go.Point(0, 50), { timestamp: 200 });  // end near N1
      test.diagram.toolManager.linkingTool.direction = go.LinkingTool.Either;
    },
    function(test) {
      // but new link should still go from N1 to N3
      CheckGraph(test, [1, 2, 0, 2], [2, 1, 1, 0], [3, 1, 1, 0]);
      CheckLinkData(test, 2, [1, 2], [1, 3]);
      var link = test.diagram.selection.first();
      test.assert(link instanceof go.Link &&
                  link.fromNode.data.key === 1 &&
                  link.toNode.data.key === 3,
                  "the link from 1 to 3 should be selected");
    }
  ));

  tc.add(new Test("draw no new link forwards only", null,
    function(test) {
      CommonSetupGraphLinks(test);
      // change N3 to disallow fromLinkable
      var node = test.diagram.findNodeForKey(3);
      test.assert(node !== null && node.port instanceof go.Shape, "node.port wasn't a Shape");
      node.port.fromLinkable = false;
    },
    function(test) {
      // change LinkingTool to allow only drawing links forwards
      test.diagram.toolManager.linkingTool.direction = go.LinkingTool.ForwardsOnly;
      test.mouseDown(new go.Point(112, 102), { timestamp: 0 });  // start at N3 port
      test.mouseMove(new go.Point(50, 75), { timestamp: 100 });
      test.mouseUp(new go.Point(0, 50), { timestamp: 200 });  // end near N1
      test.diagram.toolManager.linkingTool.direction = go.LinkingTool.Either;
    },
    function(test) {
      // no new link: drawing backwards was disallowed by the tool,
      // but the port at N3 did not allow drawing a link that would come out from there
      CheckGraph(test, [1, 1, 0, 1], [2, 1, 1, 0], [3, 0, 0, 0]);
      CheckLinkData(test, 1, [1, 2]);
      // this will select the node, because no valid linking operation was possible at that port
      var node = test.diagram.selection.first();
      test.assert(node instanceof go.Node && node.data.key === 3, "node 3 should be selected");
    }
  ));


  var gtc = new TestCollection("Trees");
  gc.add(gtc);

  // 1 --> 2 --> 3
  //  \
  //   4
  gtc.add(new Test("subtree to children", null,
    function(test) {
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        { key: 1, text: "n1" },
        { key: 2, text: "n2" },
        { key: 3, text: "n3" },
        { key: 4, text: "n4" }
      ];
      m.linkDataArray = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 1, to: 4 }
      ];
      test.diagram.model = m;
    },
    null,
    function(test) {
      var n1 = test.diagram.findNodeForKey(1);
      var n2 = test.diagram.findNodeForKey(2);
      var n3 = test.diagram.findNodeForKey(3);
      var n4 = test.diagram.findNodeForKey(4);
      test.assert(n1.findLinksConnected().count === 2 && n1.findLinksInto().count === 0 && n1.findLinksOutOf().count === 2, "n1 should have two output links");
      test.assert(n2.findLinksConnected().count === 2 && n2.findLinksInto().count === 1 && n2.findLinksOutOf().count === 1, "n2 should have two links");
      test.assert(n3.findLinksConnected().count === 1 && n3.findLinksInto().count === 1 && n3.findLinksOutOf().count === 0, "n3 should have one input link");
      test.assert(n4.findLinksConnected().count === 1 && n4.findLinksInto().count === 1 && n4.findLinksOutOf().count === 0, "n4 should have one input link");
      test.assert(n1.findTreeParentChain().count === 1, "tree parent chain for n1 should have 1 nodes and links");
      test.assert(n2.findTreeParentChain().count === 3, "tree parent chain for n2 should have 3 nodes and links");
      test.assert(n3.findTreeParentChain().count === 5, "tree parent chain for n3 should have 5 nodes and links");
      test.assert(n4.findTreeParentChain().count === 3, "tree parent chain for n4 should have 3 nodes and links");
      var subtree = n1.findTreeParts();
      test.assert(subtree.count === 7, "subtree does not have 7 Parts: " + subtree.count);
      test.assert(!n1.isTreeLeaf, "n1 should not be isTreeLeaf");
      test.assert(!n2.isTreeLeaf, "n2 should not be isTreeLeaf");
      test.assert(n3.isTreeLeaf, "n3 should be isTreeLeaf");
      test.assert(n4.isTreeLeaf, "n4 should be isTreeLeaf");
      test.assert(!n1.isInTreeOf(n1), "n1 should not be in the tree of n1");
      test.assert(n2.isInTreeOf(n1), "n2 should be a child of n1");
      test.assert(n3.isInTreeOf(n1), "n3 should be a descendant of n1");
      test.assert(n4.isInTreeOf(n1), "n4 should be a child of n1");
      test.assert(n1.findTreeRoot() === n1, "n1 should be its own root");
      test.assert(n4.findTreeRoot() === n1, "n1 should be n4's root");
      test.assert(n3.findTreeRoot() === n1, "n1 should be n3's root");
      test.assert(n1.findCommonTreeParent(n1) === n1, "n1 should be common tree parent of itself");
      test.assert(n4.findCommonTreeParent(n2) === n1 && n2.findCommonTreeParent(n4) === n1, "n1 should be common tree parent of n2 and n4");
      test.assert(n4.findCommonTreeParent(n3) === n1 && n3.findCommonTreeParent(n4) === n1, "n1 should be common tree parent of n3 and n4");
      test.assert(n1.findCommonTreeParent(n3) === n1 && n3.findCommonTreeParent(n1) === n1, "n1 should be common tree parent of itself and n3");

      var newdata = { key: 0, text: "n0" };
      test.diagram.model.addNodeData(newdata);
      var n0 = test.diagram.findNodeForData(newdata);
      test.assert(n0 !== null && n0.findCommonTreeParent(n1) === null && n1.findCommonTreeParent(n0) === null, "n0 should not be related to n1");
      test.assert(n0.findCommonTreeParent(n3) === null && n3.findCommonTreeParent(n0) === null, "n0 should not be related to n3");
    }
  ));


  // 1 <-- 2 <-- 3
  //  \
  //   4
  gtc.add(new Test("subtree from children", null,
    function(test) {
      test.diagram.isTreePathToChildren = false;
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        { key: 1, text: "n1" },
        { key: 2, text: "n2" },
        { key: 3, text: "n3" },
        { key: 4, text: "n4" }
      ];
      m.linkDataArray = [
        { from: 2, to: 1 },
        { from: 3, to: 2 },
        { from: 4, to: 1 }
      ];
      test.diagram.model = m;
    },
    null,
    function(test) {
      var n1 = test.diagram.findNodeForKey(1);
      var n2 = test.diagram.findNodeForKey(2);
      var n3 = test.diagram.findNodeForKey(3);
      var n4 = test.diagram.findNodeForKey(4);
      test.assert(n1.findLinksConnected().count === 2 && n1.findLinksInto().count === 2 && n1.findLinksOutOf().count === 0, "n1 should have two input links");
      test.assert(n2.findLinksConnected().count === 2 && n2.findLinksInto().count === 1 && n2.findLinksOutOf().count === 1, "n2 should have two links");
      test.assert(n3.findLinksConnected().count === 1 && n3.findLinksInto().count === 0 && n3.findLinksOutOf().count === 1, "n3 should have one output link");
      test.assert(n4.findLinksConnected().count === 1 && n4.findLinksInto().count === 0 && n4.findLinksOutOf().count === 1, "n4 should have one output link");
      var subtree = n1.findTreeParts();
      test.assert(subtree.count === 7, "subtree does not have 7 Parts: " + subtree.count);
      test.assert(!n1.isTreeLeaf, "n1 should not be isTreeLeaf");
      test.assert(!n2.isTreeLeaf, "n2 should not be isTreeLeaf");
      test.assert(n3.isTreeLeaf, "n3 should be isTreeLeaf");
      test.assert(n4.isTreeLeaf, "n4 should be isTreeLeaf");
      test.assert(!n1.isInTreeOf(n1), "n1 should not be in the tree of n1");
      test.assert(n2.isInTreeOf(n1), "n2 should be a child of n1");
      test.assert(n3.isInTreeOf(n1), "n3 should be a descendant of n1");
      test.assert(n4.isInTreeOf(n1), "n4 should be a child of n1");
      test.assert(n1.findTreeRoot() === n1, "n1 should be its own root");
      test.assert(n4.findTreeRoot() === n1, "n1 should be n4's root");
      test.assert(n3.findTreeRoot() === n1, "n1 should be n3's root");
      test.assert(n1.findCommonTreeParent(n1) === n1, "n1 should be common tree parent of itself");
      test.assert(n4.findCommonTreeParent(n2) === n1 && n2.findCommonTreeParent(n4) === n1, "n1 should be common tree parent of n2 and n4");
      test.assert(n4.findCommonTreeParent(n3) === n1 && n3.findCommonTreeParent(n4) === n1, "n1 should be common tree parent of n3 and n4");
      test.assert(n1.findCommonTreeParent(n3) === n1 && n3.findCommonTreeParent(n1) === n1, "n1 should be common tree parent of itself and n3");

      var newdata = { key: 0, text: "n0" };
      test.diagram.model.addNodeData(newdata);
      var n0 = test.diagram.findNodeForData(newdata);
      test.assert(n0 !== null && n0.findCommonTreeParent(n1) === null && n1.findCommonTreeParent(n0) === null, "n0 should not be related to n1");
      test.assert(n0.findCommonTreeParent(n3) === null && n3.findCommonTreeParent(n0) === null, "n0 should not be related to n3");

      test.diagram.isTreePathToChildren = true;  // restore default value
    }
  ));

  gtc.add(new Test("TreeModel reconnect link", null,
    function(test) {
      var m = new go.TreeModel();
      m.nodeDataArray = [
        { key: 1, text: "n1" },
        { key: 2, text: "n2", parent: 1 },
        { key: 3, text: "n3" }
      ];
      test.diagram.model = m;
    },
    null,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      var l = diagram.links.first();

      diagram.commit(function() {
        l.toNode = n3;
      }, "reconnect link");

      test.assert(diagram.links.count === 1, "diagram should only contain one link");
      test.assert(l.toNode === n3, "link wasn't properly reconnected");
      test.assert(n2.data.parent === undefined, "node 2's data should no longer contain a parent");
      test.assert(n3.data.parent === 1, "node 3's data should have parent: 1");
    }
  ));


  var gtc2 = new TestCollection("Linking with TableRow/Column");
  gc.add(gtc2);

  // getNearestIntersectionPoint would fail with TableRows/Columns because of trueTransform() issues
  // test for C20828
  gtc2.add(new Test("getNearestIntersectionPoint inside TableRow", null,
    function(test) {
      var diagram = test.diagram;
      // the template for each item in a node's array of item data
      var $ = go.GraphObject.make;
      var itemTempl =
        $(go.Panel, "TableColumn",
          $(go.Shape,
            { row: 0, alignment: go.Spot.Bottom },
            { fill: "slateblue", stroke: null, width: 40 },
            new go.Binding("height", "val"),
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { row: 1, width: 30, height: 20 },
            new go.Binding("text"))
        );

      diagram.nodeTemplateMap.add('gtc2',
        $(go.Node, "Auto",
          $(go.Shape,
            { fill: "white" }),
          $(go.Panel, "Vertical",
            $(go.Panel, "Table",
              { margin: 6, itemTemplate: itemTempl },
              new go.Binding("itemArray", "items")),
            $(go.TextBlock,
              { font: "bold 12pt sans-serif", width: 40, height: 20 },
              new go.Binding("text"))
          )
        ));

      var nodeDataArray = [
        {
          category: 'gtc2',key: 1,
          text: "Before",
          items: [ { text: "first", val: 50 },
                   { text: "second", val: 70 } ]
        },
        {
          category: 'gtc2',key: 2,
          text: "After"
        }
      ];
      var linkDataArray = [
        { from: 1, to: 2 }
      ];
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    },
    null,
    function(test) {
      var diagram = test.diagram;
      var p = diagram.links.first().points
      var arr = p.toArray();
      test.assert(arr[0].equalsApprox(new go.Point(95, 37.44034090909091)))
      test.assert(arr[1].equalsApprox(new go.Point(115, 27.099431818181813)))

    }
  ));

  // getNearestIntersectionPoint would fail with TableRows/Columns because of trueTransform() issues
  // test for C20842
  gtc2.add(new Test("getNearestIntersectionPoint w/ TableRow itself", null,
    function(test) {
      var diagram = test.diagram;


    var $ = go.GraphObject.make;
    // define several shared Brushes
    var bluegrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
    var greengrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
    var redgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
    var yellowgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
    var lightgrad = $(go.Brush, go.Brush.Linear, { 1: "#E6E6FA", 0: "#FFFAF0" });

    // the template for each attribute in a node's array of item data
    var itemTempl =
      $(go.Panel, "TableRow",
        new go.Binding("portId", "name", function(n) { return n + "ITEMPANEL"; }),
        new go.Binding("background", "row", function(i) { return (i === 2) ? "lightgreen" : "transparent"; }).ofObject(),
        $(go.Shape,
          new go.Binding("portId", "name", function(n) { return n + "SHAPE"; }),
          { column: 0, desiredSize: new go.Size(10, 10) },
          new go.Binding("figure", "figure"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            width: 120, height: 20,
            column: 1,
            stroke: "#333333",
            font: "bold 14px sans-serif"
          },
          new go.Binding("text", "name"),
          new go.Binding("portId", "name", function(n) { return n + "TEXTBLOCK"; }))
      );

    // define the Node template, representing an entity
    diagram.nodeTemplateMap.add("Complex",
      $(go.Node, "Auto",  // the whole node panel
        {
          locationSpot: go.Spot.Center,
          scale: 1.5,
          selectionAdorned: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          isShadowed: true,
          shadowColor: "#C5C1AA"
        },
        new go.Binding("location", "loc", go.Point.parse),
        // define the node's outer shape, which will surround the Table
        $(go.Shape, "Rectangle",
          { portId: "RECTANGLE" },
          { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
        $(go.Panel, "Table",
          { margin: 8, stretch: go.GraphObject.Fill },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          // the table header
          $(go.TextBlock,
            { portId: "HEADER", width: 80, height: 10 },
            {
              row: 0, alignment: go.Spot.Center,
              margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "key")),
          // the collapse/expand button
          $("PanelExpanderButton", "LIST",
            {
              row: 0, alignment: go.Spot.TopRight,
              portId: "BUTTON"
            }
          ),
          // the list of Panels, each showing an attribute
          $(go.Panel, "Table",
            {
              name: "LIST", background: "pink", portId: "LIST",
              row: 1,
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              itemTemplate: itemTempl
            },
            new go.Binding("itemArray", "items"))
        )  // end Table Panel
      ));  // end Node

    // annotations -- brown text
    diagram.nodeTemplateMap.add("Comment",
      $(go.Node,
        new go.Binding("location", "loc", go.Point.parse),
        { locationSpot: go.Spot.Center },
        $(go.TextBlock,
          { stroke: "brown", width: 80, height: 50 },
          new go.Binding("text"),
          new go.Binding("font", "bold", function(b) { return b ? "bold 10pt sans-serif" : "10pt sans-serif"; }))
      ));

    // so that comments can point at any named GraphObject in a Link
    diagram.nodeTemplateMap.add("LinkLabel",
      $(go.Node,
        new go.Binding("segmentIndex"),
        new go.Binding("segmentOffset")
      ));

    // brown curved links connecting with a Comment node
    diagram.linkTemplateMap.add("Comment",
      $(go.Link,
        {  },
        new go.Binding("curviness"),
        $(go.Shape, { stroke: "brown" }),
        $(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
      ));

    var model = new go.GraphLinksModel();
    model.linkToPortIdProperty = "pid";
    model.linkLabelKeysProperty = "labs";
    model.nodeDataArray = [


      { key: 11, category: "Complex", loc: "0 230",
         items: [{ name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
                  { name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
                  { name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
                  { name: "Address", iskey: false, figure: "Cube1", color: bluegrad }]
      },

      { key: -17, text: "a TableRow Panel\nfor item #2\nwith lightgreen\nbackground", category: "Comment", loc: "-200 250" }
    ];
    model.linkDataArray = [
      { from: -17, category: "Comment", to: 11, pid: "ContactNameITEMPANEL" }
    ];
    diagram.model = model;


    },
    null,
    function(test) {
      var diagram = test.diagram;
      var p = diagram.links.first().points
      var arr = p.toArray();
      // Bad:
      //Point(-160,250.7284271247462)
      //Point(-102.75,187.35293649857311)
      // Good:
      //Point(-160,251.4784271247462)
      //Point(-98.25,253.76074899857312)
      test.assert(arr[0].equalsApprox(new go.Point(-160,251.4784271247462)))
      test.assert(arr[1].equalsApprox(new go.Point(-98.25,253.76074899857312)))
    }
  ));


  var tcl = new TestCollection("Events, Single Port");
  gc.add(tcl);

  function name(n) {
    if (!n) return "null";
    if (n instanceof go.Node) return n.data.key;
    if (n instanceof go.Link) return name(n.fromNode) + "-->" + name(n.toNode);
    if (n.name) return n.name + " in " + name(n.part);
    return "PORT in " + name(n.part);
  }

  function setupLinkingEventsTemplates(test) {
    // define the Node template
    var $ = go.GraphObject.make;
    test.diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          linkConnected: function (node, link, port) {
            if (test.eventLog === undefined) test.eventLog = [];
            test.eventLog.push("At: " + name(node) + "  connected: " + name(link) + " " + name(port) + " numLinks:" + node.linksConnected.count);
          },
          linkDisconnected: function (node, link, port) {
            if (test.eventLog === undefined) test.eventLog = [];
            test.eventLog.push("At: " + name(node) + "  disconnected: " + name(link) + " " + name(port) + " numLinks:" + node.linksConnected.count);
          }
        },
        $(go.Shape,
          {
            name: "PORT",
            fill: "white",
            /* ONE PORT */
            portId: "",
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true

          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },
          new go.Binding("text"))
      );

    test.diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 10 },
        { relinkableFrom: true, relinkableTo: true },
        {
          fromPortChanged: function (link, oldport, newport) {
            if (test.eventLog === undefined) test.eventLog = [];
            test.eventLog.push("For: " + name(link) + "  changed fromPort: " + name(oldport) + " " + name(newport));
          },
          toPortChanged: function (link, oldport, newport) {
            if (test.eventLog === undefined) test.eventLog = [];
            test.eventLog.push("For: " + name(link) + "  changed toPort: " + name(oldport) + " " + name(newport));
          }
        },
        $(go.Shape, { strokeWidth: 2 }),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );
  }

  function commonLinkingEventsSetup(test) {
    test.eventLog = [];
    setupLinkingEventsTemplates(test);
    var diagram = test.diagram;
    var model = new go.GraphLinksModel();
    model.nodeDataArray = [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" },
      { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
      { key: 4, text: "Delta", color: "pink", group: 5 },
      { key: 5, text: "Epsilon", color: "green", isGroup: true }
    ];
    model.linkDataArray = [
      { from: 2, to: 2 },
      { from: 1, to: 3 }
    ];
    diagram.model = model;
    diagram.undoManager.isEnabled = true;
  }

  function checkEventLog(test, expected) {
    var arr = test.eventLog;
    test.assert(Array.isArray(arr) && arr.length === expected.length, "test.eventLog [" + arr.length + "] is not an Array of length: " + expected.length);
    for (var i = 0; i < arr.length; i++) {
      test.assert(arr[i] === expected[i], "unexpected event log message: " + arr[i] + "\n    expected: " + expected[i]);
    }
    test.eventLog = [];  // reset log
  }

  function dumpEventLog(test) {
    var msg = "[";
    for (var i = 0; i < test.eventLog.length; i++) {
      if (i > 0) msg += ",";
      msg += '\n"' + test.eventLog[i] + '"';
    }
    msg += "\n]";
    console.log(msg);
    return msg;
  }

  tcl.add(new Test("init model", null, commonLinkingEventsSetup,
    null,
    function (test) {
      checkEventLog(test, [
"For: 2-->null  changed fromPort: null PORT in 2",
"At: 2  connected: 2-->null PORT in 2 numLinks:1",
"For: 2-->2  changed toPort: null PORT in 2",
"At: 2  connected: 2-->2 PORT in 2 numLinks:1",
"For: 1-->null  changed fromPort: null PORT in 1",
"At: 1  connected: 1-->null PORT in 1 numLinks:1",
"For: 1-->3  changed toPort: null PORT in 3",
"At: 3  connected: 1-->3 PORT in 3 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("remove link reflexive", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.removeLinkData(diagram.model.linkDataArray[0]);
      diagram.commitTransaction("deleted link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "At: 2  disconnected: 2-->2 PORT in 2 numLinks:0",
        "At: 2  connected: 2-->2 PORT in 2 numLinks:1",
        "At: 2  disconnected: 2-->2 PORT in 2 numLinks:0"
      ]);
    }
  ));

  tcl.add(new Test("remove link between nodes", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.removeLinkData(diagram.model.linkDataArray[1]);
      diagram.commitTransaction("deleted link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "At: 1  disconnected: 1-->3 PORT in 1 numLinks:0",
        "At: 3  disconnected: 1-->3 PORT in 3 numLinks:0",
        "At: 1  connected: 1-->3 PORT in 1 numLinks:1",
        "At: 3  connected: 1-->3 PORT in 3 numLinks:1",
        "At: 1  disconnected: 1-->3 PORT in 1 numLinks:0",
        "At: 3  disconnected: 1-->3 PORT in 3 numLinks:0"
      ]);
    }
  ));

  tcl.add(new Test("add link reflexive", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 4, to: 4 });
      diagram.commitTransaction("added link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 4-->null  changed fromPort: null PORT in 4",
        "At: 4  connected: 4-->null PORT in 4 numLinks:1",
        "For: 4-->4  changed toPort: null PORT in 4",
        "At: 4  connected: 4-->4 PORT in 4 numLinks:1",
        "At: 4  disconnected: 4-->4 PORT in 4 numLinks:0",
        "At: 4  connected: 4-->4 PORT in 4 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("add link between nodes", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 3, to: 4 });
      diagram.commitTransaction("added link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 3-->null  changed fromPort: null PORT in 3",
        "At: 3  connected: 3-->null PORT in 3 numLinks:2",
        "For: 3-->4  changed toPort: null PORT in 4",
        "At: 4  connected: 3-->4 PORT in 4 numLinks:1",
        "At: 3  disconnected: 3-->4 PORT in 3 numLinks:1",
        "At: 4  disconnected: 3-->4 PORT in 4 numLinks:0",
        "At: 3  connected: 3-->4 PORT in 3 numLinks:2",
        "At: 4  connected: 3-->4 PORT in 4 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("add link reflexive duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 2, to: 2 });
      diagram.commitTransaction("added link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 2-->null  changed fromPort: null PORT in 2",
        "At: 2  connected: 2-->null PORT in 2 numLinks:2",
        "For: 2-->2  changed toPort: null PORT in 2",
        "At: 2  connected: 2-->2 PORT in 2 numLinks:2",
        "At: 2  disconnected: 2-->2 PORT in 2 numLinks:1",
        "At: 2  connected: 2-->2 PORT in 2 numLinks:2"
      ]);
    }
  ));

  tcl.add(new Test("add link between nodes duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 1, to: 3 });
      diagram.commitTransaction("added link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 1-->null  changed fromPort: null PORT in 1",
        "At: 1  connected: 1-->null PORT in 1 numLinks:2",
        "For: 1-->3  changed toPort: null PORT in 3",
        "At: 3  connected: 1-->3 PORT in 3 numLinks:2",
        "At: 1  disconnected: 1-->3 PORT in 1 numLinks:1",
        "At: 3  disconnected: 1-->3 PORT in 3 numLinks:1",
        "At: 1  connected: 1-->3 PORT in 1 numLinks:2",
        "At: 3  connected: 1-->3 PORT in 3 numLinks:2"
      ]);
    }
  ));

  tcl.add(new Test("reconnect link from reflexive duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 2, to: 2 });
      diagram.commitTransaction("added link");

      test.eventLog = [];
      diagram.startTransaction();
      diagram.model.setFromKeyForLinkData(diagram.model.linkDataArray[2], 4);
      diagram.commitTransaction("reconnected link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 4-->2  changed fromPort: PORT in 2 PORT in 4",
        "At: 4  connected: 4-->2 PORT in 4 numLinks:1",
        "At: 4  disconnected: 4-->2 PORT in 4 numLinks:0",
        "For: 2-->2  changed fromPort: PORT in 4 PORT in 2",
        "For: 4-->2  changed fromPort: PORT in 2 PORT in 4",
        "At: 4  connected: 4-->2 PORT in 4 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("reconnect link from between nodes duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 1, to: 3 });
      diagram.commitTransaction("added link");

      test.eventLog = [];
      diagram.startTransaction();
      diagram.model.setFromKeyForLinkData(diagram.model.linkDataArray[2], 4);
      diagram.commitTransaction("reconnected link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "At: 1  disconnected: 1-->3 PORT in 1 numLinks:1",
        "For: 4-->3  changed fromPort: PORT in 1 PORT in 4",
        "At: 4  connected: 4-->3 PORT in 4 numLinks:1",
        "At: 4  disconnected: 4-->3 PORT in 4 numLinks:0",
        "For: 1-->3  changed fromPort: PORT in 4 PORT in 1",
        "At: 1  connected: 1-->3 PORT in 1 numLinks:2",
        "At: 1  disconnected: 1-->3 PORT in 1 numLinks:1",
        "For: 4-->3  changed fromPort: PORT in 1 PORT in 4",
        "At: 4  connected: 4-->3 PORT in 4 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("reconnect link to reflexive duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 2, to: 2 });
      diagram.commitTransaction("added link");

      test.eventLog = [];
      diagram.startTransaction();
      diagram.model.setToKeyForLinkData(diagram.model.linkDataArray[2], 4);
      diagram.commitTransaction("reconnected link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      checkEventLog(test, [
        "For: 2-->4  changed toPort: PORT in 2 PORT in 4",
        "At: 4  connected: 2-->4 PORT in 4 numLinks:1",
        "At: 4  disconnected: 2-->4 PORT in 4 numLinks:0",
        "For: 2-->2  changed toPort: PORT in 4 PORT in 2",
        "For: 2-->4  changed toPort: PORT in 2 PORT in 4",
        "At: 4  connected: 2-->4 PORT in 4 numLinks:1"
      ]);
    }
  ));

  tcl.add(new Test("reconnect link to between nodes duplicate", null, commonLinkingEventsSetup,
    function (test) {
      test.eventLog = [];
      var diagram = test.diagram;
      diagram.startTransaction();
      diagram.model.addLinkData({ from: 1, to: 3 });
      diagram.commitTransaction("added link");

      test.eventLog = [];
      diagram.startTransaction();
      diagram.model.setToKeyForLinkData(diagram.model.linkDataArray[2], 4);
      diagram.commitTransaction("reconnected link");

      diagram.commandHandler.undo();
      diagram.commandHandler.redo();
    },
    function (test) {
      //dumpEventLog(test);
      checkEventLog(test, [
        "At: 3  disconnected: 1-->3 PORT in 3 numLinks:1",
        "For: 1-->4  changed toPort: PORT in 3 PORT in 4",
        "At: 4  connected: 1-->4 PORT in 4 numLinks:1",
        "At: 4  disconnected: 1-->4 PORT in 4 numLinks:0",
        "For: 1-->3  changed toPort: PORT in 4 PORT in 3",
        "At: 3  connected: 1-->3 PORT in 3 numLinks:2",
        "At: 3  disconnected: 1-->3 PORT in 3 numLinks:1",
        "For: 1-->4  changed toPort: PORT in 3 PORT in 4",
        "At: 4  connected: 1-->4 PORT in 4 numLinks:1"
      ]);
    }
  ));


  var tcln = new TestCollection("Label Nodes");
  gc.add(tcln);

  function CommonSetupLabelNodes(test) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.reset();
    diagram.linkTemplate =
      $(go.Link,
        { selectionAdorned: false, relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );
    diagram.groupTemplate =
      $(go.Group, "Table",
        { ungroupable: true },
        $("SubGraphExpanderButton", { column: 0, alignment: go.Spot.Left }),
        $(go.TextBlock, { font: "bold 12pt sans-serif", column: 1 },
          new go.Binding("text", "key")),
        $(go.Panel, "Auto",
          { row: 1, columnSpan: 2 },
          $(go.Shape, { fill: "lightgray" }),
          $(go.Placeholder, { padding: 10 })
        )
      );
    diagram.commandHandler.archetypeGroupData = { isGroup: true };
    diagram.undoManager.isEnabled = true;
    diagram.initialScale = 3;
    var model = new go.GraphLinksModel();
    model.linkLabelKeysProperty = "labelKeys";
    model.nodeDataArray = [
      { "key": "Alpha", "color": "lightblue", "loc": "29 14" },
      { "key": "Beta", "color": "orange", "loc": "129 14" },
      { "key": "Gamma", "color": "lightgreen", "loc": "29 106" },
      { "key": "Delta", "color": "pink", "loc": "129 106" },
      { "key": "AB", "category": "LinkLabel" },
      { "key": "GD", "category": "LinkLabel" },
      { "key": "AG", "category": "LinkLabel" },
      { "key": "A-GD", "category": "LinkLabel" },
      { "key": "AB-GD", "category": "LinkLabel" },
      { "key": "A-GD-AB-GD", "category": "LinkLabel" }
    ];
    model.linkDataArray = [
      { "from": "Alpha", "to": "Beta", "labelKeys": ["AB"] },
      { "from": "Gamma", "to": "Delta", "labelKeys": ["GD"] },
      { "from": "Alpha", "to": "Gamma", "labelKeys": ["AG"] },
      { "from": "Alpha", "to": "GD", "labelKeys": ["A-GD"] },
      { "from": "AB", "to": "GD", "labelKeys": ["AB-GD"] },
      { "from": "A-GD", "to": "AB-GD", "labelKeys": ["A-GD-AB-GD"] }
    ];
    diagram.model = model;
  }

  function containsLabelNode(link, node) {
    return node.isLinkLabel &&
      node.labeledLink === link &&
      !node.isTopLevel &&
      link.isLabeledLink &&
      new go.Set().addAll(link.labelNodes).contains(node);
  }

  function containsMember(group, part) {
    return part.containingGroup === group &&
      !part.isTopLevel &&
      new go.Set().addAll(group.memberParts).contains(part);
  }

  function CheckLabelNodesUngrouped(test) {
    var diagram = test.diagram;
    var A = diagram.findNodeForKey("Alpha");
    var B = diagram.findNodeForKey("Beta");
    var G = diagram.findNodeForKey("Gamma");
    var D = diagram.findNodeForKey("Delta");
    var AB = diagram.findNodeForKey("AB");
    var GD = diagram.findNodeForKey("GD");
    var AG = diagram.findNodeForKey("AG");
    var A_GD = diagram.findNodeForKey("A-GD");
    var AB_GD = diagram.findNodeForKey("AB-GD");
    var A_GD_AB_GD = diagram.findNodeForKey("A-GD-AB-GD");
    var lAB = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    var lGD = diagram.findLinkForData(diagram.model.linkDataArray[1]);
    var lAG = diagram.findLinkForData(diagram.model.linkDataArray[2]);
    var lA_GD = diagram.findLinkForData(diagram.model.linkDataArray[3]);
    var lAB_GD = diagram.findLinkForData(diagram.model.linkDataArray[4]);
    var lA_GD_AB_GD = diagram.findLinkForData(diagram.model.linkDataArray[5]);
    test.assert(A && A.linksConnected.count === 3 && !A.isLinkLabel && A.labeledLink === null && A.isTopLevel && A.containingGroup === null, "A wrong");
    test.assert(B && B.linksConnected.count === 1 && !B.isLinkLabel && B.labeledLink === null && B.isTopLevel && B.containingGroup === null, "B wrong");
    test.assert(G && G.linksConnected.count === 2 && !G.isLinkLabel && G.labeledLink === null && G.isTopLevel && G.containingGroup === null, "G wrong");
    test.assert(D && D.linksConnected.count === 1 && !D.isLinkLabel && D.labeledLink === null && D.isTopLevel && D.containingGroup === null, "D wrong");
    test.assert(AB && AB.linksConnected.count === 1 && containsLabelNode(lAB, AB) && AB.containingGroup === null, "AB wrong");
    test.assert(GD && GD.linksConnected.count === 2 && containsLabelNode(lGD, GD) && GD.containingGroup === null, "GD wrong");
    test.assert(AG && AG.linksConnected.count === 0 && containsLabelNode(lAG, AG) && AG.containingGroup === null, "AG wrong");
    test.assert(A_GD && A_GD.linksConnected.count === 1 && containsLabelNode(lA_GD, A_GD) && A_GD.containingGroup === null, "A-GD wrong");
    test.assert(AB_GD && AB_GD.linksConnected.count === 1 && containsLabelNode(lAB_GD, AB_GD) && AB_GD.containingGroup === null, "AB-GD wrong");
    test.assert(A_GD_AB_GD && A_GD_AB_GD.linksConnected.count === 0 && containsLabelNode(lA_GD_AB_GD, A_GD_AB_GD) && A_GD_AB_GD.containingGroup === null, "A-GD-AB-GD wrong");
    test.assert(lAB && lAB.isTopLevel && lAB.containingGroup === null, "link A-B wrong");
    test.assert(lGD && lGD.isTopLevel && lGD.containingGroup === null, "link G-D wrong");
    test.assert(lAG && lAG.isTopLevel && lAG.containingGroup === null, "link A-G wrong");
    test.assert(lA_GD && lA_GD.isTopLevel && lA_GD.containingGroup === null, "link A-GD wrong");
    test.assert(lAB_GD && lAB_GD.isTopLevel && lAB_GD.containingGroup === null, "link AB-GD wrong");
    test.assert(lA_GD_AB_GD && lA_GD_AB_GD.isTopLevel && lA_GD_AB_GD.containingGroup === null, "link A-GD-AB-GD wrong");
  }

  function CheckLabelNodesGrouped(test) {
    var diagram = test.diagram;
    var A = diagram.findNodeForKey("Alpha");
    var B = diagram.findNodeForKey("Beta");
    var G = diagram.findNodeForKey("Gamma");
    var D = diagram.findNodeForKey("Delta");
    var AB = diagram.findNodeForKey("AB");
    var GD = diagram.findNodeForKey("GD");
    var AG = diagram.findNodeForKey("AG");
    var A_GD = diagram.findNodeForKey("A-GD");
    var AB_GD = diagram.findNodeForKey("AB-GD");
    var A_GD_AB_GD = diagram.findNodeForKey("A-GD-AB-GD");
    var lAB = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    var lGD = diagram.findLinkForData(diagram.model.linkDataArray[1]);
    var lAG = diagram.findLinkForData(diagram.model.linkDataArray[2]);
    var lA_GD = diagram.findLinkForData(diagram.model.linkDataArray[3]);
    var lAB_GD = diagram.findLinkForData(diagram.model.linkDataArray[4]);
    var lA_GD_AB_GD = diagram.findLinkForData(diagram.model.linkDataArray[5]);
    var GRP = diagram.findTopLevelGroups().first();
    test.assert(GRP && GRP instanceof go.Group, "no Group");
    test.assert(A && A.linksConnected.count === 3 && !A.isLinkLabel && A.labeledLink === null && containsMember(GRP, A), "A wrong");
    test.assert(B && B.linksConnected.count === 1 && !B.isLinkLabel && B.labeledLink === null && containsMember(GRP, B), "B wrong");
    test.assert(G && G.linksConnected.count === 2 && !G.isLinkLabel && G.labeledLink === null && containsMember(GRP, G), "G wrong");
    test.assert(D && D.linksConnected.count === 1 && !D.isLinkLabel && D.labeledLink === null && containsMember(GRP, D), "D wrong");
    test.assert(AB && AB.linksConnected.count === 1 && containsLabelNode(lAB, AB) && containsMember(GRP, AB), "AB wrong");
    test.assert(GD && GD.linksConnected.count === 2 && containsLabelNode(lGD, GD) && containsMember(GRP, GD), "GD wrong");
    test.assert(AG && AG.linksConnected.count === 0 && containsLabelNode(lAG, AG) && containsMember(GRP, AG), "AG wrong");
    test.assert(A_GD && A_GD.linksConnected.count === 1 && containsLabelNode(lA_GD, A_GD) && containsMember(GRP, A_GD), "A-GD wrong");
    test.assert(AB_GD && AB_GD.linksConnected.count === 1 && containsLabelNode(lAB_GD, AB_GD) && containsMember(GRP, AB_GD), "AB-GD wrong");
    test.assert(A_GD_AB_GD && A_GD_AB_GD.linksConnected.count === 0 && containsLabelNode(lA_GD_AB_GD, A_GD_AB_GD) && containsMember(GRP, A_GD_AB_GD), "A-GD-AB-GD wrong");
    test.assert(lAB && containsMember(GRP, lAB), "link A-B wrong");
    test.assert(lGD && containsMember(GRP, lGD), "link G-D wrong");
    test.assert(lAG && containsMember(GRP, lAG), "link A-G wrong");
    test.assert(lA_GD && containsMember(GRP, lA_GD), "link A-GD wrong");
    test.assert(lAB_GD && containsMember(GRP, lAB_GD), "link AB-GD wrong");
    test.assert(lA_GD_AB_GD && containsMember(GRP, lA_GD_AB_GD), "link A-GD-AB-GD wrong");
  }

  function CheckLabelNodesGroupedWithoutDelta(test) {
    var diagram = test.diagram;
    var A = diagram.findNodeForKey("Alpha");
    var B = diagram.findNodeForKey("Beta");
    var G = diagram.findNodeForKey("Gamma");
    var D = diagram.findNodeForKey("Delta");
    var AB = diagram.findNodeForKey("AB");
    var GD = diagram.findNodeForKey("GD");
    var AG = diagram.findNodeForKey("AG");
    var A_GD = diagram.findNodeForKey("A-GD");
    var AB_GD = diagram.findNodeForKey("AB-GD");
    var A_GD_AB_GD = diagram.findNodeForKey("A-GD-AB-GD");
    var lAB = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    var lGD = diagram.findLinkForData(diagram.model.linkDataArray[1]);
    var lAG = diagram.findLinkForData(diagram.model.linkDataArray[2]);
    var lA_GD = diagram.findLinkForData(diagram.model.linkDataArray[3]);
    var lAB_GD = diagram.findLinkForData(diagram.model.linkDataArray[4]);
    var lA_GD_AB_GD = diagram.findLinkForData(diagram.model.linkDataArray[5]);
    var GRP = diagram.findTopLevelGroups().first();
    test.assert(GRP && GRP instanceof go.Group, "no Group");
    test.assert(A && A.linksConnected.count === 3 && !A.isLinkLabel && A.labeledLink === null && containsMember(GRP, A), "A wrong");
    test.assert(B && B.linksConnected.count === 1 && !B.isLinkLabel && B.labeledLink === null && containsMember(GRP, B), "B wrong");
    test.assert(G && G.linksConnected.count === 2 && !G.isLinkLabel && G.labeledLink === null && containsMember(GRP, G), "G wrong");
    test.assert(D && D.linksConnected.count === 1 && !D.isLinkLabel && D.labeledLink === null && D.isTopLevel && D.containingGroup === null, "D wrong");
    test.assert(AB && AB.linksConnected.count === 1 && containsLabelNode(lAB, AB) && containsMember(GRP, AB), "AB wrong");
    test.assert(GD && GD.linksConnected.count === 2 && containsLabelNode(lGD, GD) && !containsMember(GRP, GD), "GD wrong");
    test.assert(AG && AG.linksConnected.count === 0 && containsLabelNode(lAG, AG) && containsMember(GRP, AG), "AG wrong");
    test.assert(A_GD && A_GD.linksConnected.count === 1 && containsLabelNode(lA_GD, A_GD) && !containsMember(GRP, A_GD), "A-GD wrong");
    test.assert(AB_GD && AB_GD.linksConnected.count === 1 && containsLabelNode(lAB_GD, AB_GD) && !containsMember(GRP, AB_GD), "AB-GD wrong");
    test.assert(A_GD_AB_GD && A_GD_AB_GD.linksConnected.count === 0 && containsLabelNode(lA_GD_AB_GD, A_GD_AB_GD) && !containsMember(GRP, A_GD_AB_GD), "A-GD-AB-GD wrong");
    test.assert(lAB && containsMember(GRP, lAB), "link A-B wrong");
    test.assert(lGD && !containsMember(GRP, lGD), "link G-D wrong");
    test.assert(lAG && containsMember(GRP, lAG), "link A-G wrong");
    test.assert(lA_GD && !containsMember(GRP, lA_GD), "link A-GD wrong");
    test.assert(lAB_GD && !containsMember(GRP, lAB_GD), "link AB-GD wrong");
    test.assert(lA_GD_AB_GD && !containsMember(GRP, lA_GD_AB_GD), "link A-GD-AB-GD wrong");
  }

  tcln.add(new Test("init", null, CommonSetupLabelNodes,
    null,
    CheckLabelNodesUngrouped
  ));

  tcln.add(new Test("group", null, CommonSetupLabelNodes,
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("Alpha");
      var B = diagram.findNodeForKey("Beta");
      var G = diagram.findNodeForKey("Gamma");
      var D = diagram.findNodeForKey("Delta");
      A.isSelected = true;
      B.isSelected = true;
      G.isSelected = true;
      D.isSelected = true;
      diagram.commandHandler.groupSelection();
      CheckLabelNodesGrouped(test);
      diagram.commandHandler.undo();
      CheckLabelNodesUngrouped(test);
      diagram.commandHandler.redo();
    },
    CheckLabelNodesGrouped
  ));

  tcln.add(new Test("group no Delta", null, CommonSetupLabelNodes,
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("Alpha");
      var B = diagram.findNodeForKey("Beta");
      var G = diagram.findNodeForKey("Gamma");
      var D = diagram.findNodeForKey("Delta");
      A.isSelected = true;
      B.isSelected = true;
      G.isSelected = true;
      D.isSelected = false;
      diagram.commandHandler.groupSelection();
      CheckLabelNodesGroupedWithoutDelta(test);
      diagram.commandHandler.undo();
      CheckLabelNodesUngrouped(test);
      diagram.commandHandler.redo();
    },
    function(test) {
      var diagram = test.diagram;
      CheckLabelNodesGroupedWithoutDelta(test);
      diagram.startTransaction();
      var D = diagram.findNodeForKey("Delta");
      var loc = D.location.copy();
      loc.x += 50;
      loc.y += 20;
      D.location = loc;
      var GRP = diagram.findTopLevelGroups().first();
      GRP.isSelected = true;
      diagram.commitTransaction("further changes");
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection(new go.Point(50, 175));
      var GRP2 = diagram.selection.first();
      test.assert(diagram.findTopLevelGroups().count === 2 && diagram.selection.count === 6 && GRP2 instanceof go.Group, "didn't copy Group without Delta");
      test.assert(GRP2.memberParts.count === 7, "copied group doesn't include label nodes");
    }
  ));

  tcln.add(new Test("group add Delta", null, CommonSetupLabelNodes,
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("Alpha");
      var B = diagram.findNodeForKey("Beta");
      var G = diagram.findNodeForKey("Gamma");
      var D = diagram.findNodeForKey("Delta");
      A.isSelected = true;
      B.isSelected = true;
      G.isSelected = true;
      D.isSelected = false;
      diagram.commandHandler.groupSelection();
      CheckLabelNodesGroupedWithoutDelta(test);
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction();
      var D = diagram.findNodeForKey("Delta");
      var loc = D.location.copy();
      loc.x += 50;
      loc.y += 20;
      D.location = loc;
      var GRP = diagram.findTopLevelGroups().first();
      test.assert(GRP && GRP.isSelected, "Group not still selected from groupSelection command");
      D.containingGroup = GRP;
      diagram.commitTransaction("insert Delta");
      CheckLabelNodesGrouped(test);
      diagram.commandHandler.undo();
      CheckLabelNodesGroupedWithoutDelta(test);
      diagram.commandHandler.redo();
      CheckLabelNodesGrouped(test);
    }
  ));

  tcln.add(new Test("group add link", null, CommonSetupLabelNodes,
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("Alpha");
      var B = diagram.findNodeForKey("Beta");
      var G = diagram.findNodeForKey("Gamma");
      var D = diagram.findNodeForKey("Delta");
      A.isSelected = true;
      B.isSelected = true;
      G.isSelected = true;
      D.isSelected = false;
      diagram.commandHandler.groupSelection();
      CheckLabelNodesGroupedWithoutDelta(test);
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction();
      var D = diagram.findNodeForKey("Delta");
      var loc = D.location.copy();
      loc.x += 50;
      loc.y += 20;
      D.location = loc;
      var AB = diagram.findNodeForKey("AB");
      var AG = diagram.findNodeForKey("AG");
      var GRP = diagram.findTopLevelGroups().first();
      var linkdata = { from: "AB", to: "AG" };
      diagram.model.addLinkData(linkdata);
      var newlink = diagram.findLinkForData(linkdata);
      diagram.commitTransaction("add link");
      test.assert(newlink && containsMember(GRP, newlink), "new link isn't in group");
    }
  ));


  var labels = new TestCollection("Labels");
  gc.add(labels);

  function CommonLabelsSetup(test, single) {
    var $ = go.GraphObject.make;
    var diag = test.diagram;
    diag.reset();

    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 60, height: 30, locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape,
          { fill: "white", portId: "" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text"))
      );

    if (single) {
      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" }),
          $(go.TextBlock, "middle",
            { width: 55, height: 18, textAlign: "center", background: "lavender" })
        );
    } else {
      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" }),
          $(go.TextBlock, "fromfrom",
            { width: 55, height: 18, textAlign: "center", background: "lime", segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN) }),
          $(go.TextBlock, "totototo",
            { width: 55, height: 18, textAlign: "center", background: "fuchsia", segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN) })
        );
    }

    diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", location: new go.Point(0, 0) },
        { key: 2, text: "Beta", color: "orange", location: new go.Point(180, 20) },
        { key: 3, text: "Gamma", color: "lightgreen", location: new go.Point(-20, 150) },
        { key: 4, text: "Delta", color: "pink", location: new go.Point(-180, -20) },
        { key: 5, text: "Epsilon", color: "yellow", location: new go.Point(20, -150) }
      ],
      [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 1, to: 5 }
      ]);
  }

  function logLabelCenters(test) {
    var diag = test.diagram;
    var msg = "[";
    diag.links.each(function(l) {
      var it = l.elements;
      it.next();  // skip path
      it.next();  // skip arrowhead
      if (msg.length > 1) msg += ", ";
      var first = true;
      msg += "[";
      while (it.next()) {
        var lab = it.value;
        var p = lab.getDocumentPoint(go.Spot.Center);
        if (!first) msg += ", ";
        msg += 'new go.Point(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')';
        first = false;
      }
      msg += "]";
    });
    msg += "]";
    console.log(msg);
  }

  function checkLabelCenters(test, expected) {
    var diag = test.diagram;
    var idx = 0;
    var msg = "";
    diag.links.each(function(l) {
      var it = l.elements;
      it.next();  // skip path
      it.next();  // skip arrowhead
      var ldx = 0;
      while (it.next()) {
        var lab = it.value;
        var p = lab.getDocumentPoint(go.Spot.Center);
        var exp = expected[idx][ldx];
        if (!p.equalsApprox(exp)) {
          msg += "label " + idx + " is at " + p.toString() + " rather than at " + exp.toString();
        }
        ldx++;
      }
      idx++;
    });
    if (msg) test.assert(false, msg);
  }

  function logLabelAngles(test) {
    var diag = test.diagram;
    var msg = "[";
    diag.links.each(function(l) {
      if (msg.length > 1) msg += ", ";
      msg += l.elt(2).angle.toFixed(2);
    });
    msg += "]";
    console.log(msg);
  }

  function checkMidLabelAngles(test, angles) {
    var i = 0;
    var msg = "";
    test.diagram.links.each(function(l) {
      if (!test.isApprox(l.elt(2).angle, angles[i])) {
        msg += "label " + i + " at angle " + l.elt(2).angle + ", expected " + angles[i] + "\n";
      }
      i++;
    })
    if (msg) test.assert(false, msg);
  }

  labels.add(new Test("default", null,
    function(test) {
      CommonLabelsSetup(test, true);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientAlong", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientAlong;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [6.34, 97.59, 186.34, 277.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientMinus90", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientMinus90;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [276.34, 7.59, 96.34, 187.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientMinus90Upright", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientMinus90Upright;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [276.34, 7.59, 276.34, 7.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientOpposite", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientOpposite;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [186.34, 277.59, 6.34, 97.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientPlus90", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientPlus90;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [96.34, 187.59, 276.34, 7.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientPlus90Upright", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientPlus90Upright;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [276.34, 7.59, 276.34, 7.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientUpright", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientUpright;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [6.34, 277.59, 6.34, 277.59]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));

  labels.add(new Test("OrientUpright45", null,
    function(test) {
      CommonLabelsSetup(test, true);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOrientation = go.Link.OrientUpright45;
      });
    },
    function(test) {
      checkMidLabelAngles(test, [6.34, 0.00, 6.34, 0.00]);
      checkLabelCenters(test, [[new go.Point(90.0,10.0)], [new go.Point(-10.0,75.0)], [new go.Point(-90.0,-10.0)], [new go.Point(10.0,-75.0)]]);
    }
  ));


  labels.add(new Test("segmentFraction", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentFraction = 0.333; l.elt(2).segmentOffset = new go.Point(0, 0);
        l.elt(3).segmentFraction = 0.667; l.elt(3).segmentOffset = new go.Point(0, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(70.0,7.8), new go.Point(70.0,7.8)], [new go.Point(-7.3,55.0), new go.Point(-7.3,55.0)], [new go.Point(-70.0,-7.8), new go.Point(-70.0,-7.8)], [new go.Point(7.3,-55.0), new go.Point(7.3,-55.0)]]);
    }
  ));

  labels.add(new Test("segmentIndex", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentIndex = 1; l.elt(2).segmentFraction = 0.5;
        l.elt(2).segmentOffset = new go.Point(0, 0);
        l.elt(3).segmentIndex = 3; l.elt(3).segmentFraction = 0.5;
        l.elt(3).segmentOffset = new go.Point(0, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(65.0,0.0), new go.Point(115.0,20.0)], [new go.Point(0.0,50.0), new go.Point(-20.0,100.0)], [new go.Point(-65.0,0.0), new go.Point(-115.0,-20.0)], [new go.Point(0.0,-50.0), new go.Point(20.0,-100.0)]]);
    }
  ));

  labels.add(new Test("segmentOffset", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentIndex = 2; l.elt(2).segmentFraction = 0.5;
        l.elt(2).segmentOffset = new go.Point(-10, -10);
        l.elt(3).segmentIndex = 2; l.elt(3).segmentFraction = 0.5;
        l.elt(3).segmentOffset = new go.Point(10, 10);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(100.0,0.0), new go.Point(80.0,20.0)], [new go.Point(0.0,85.0), new go.Point(-20.0,65.0)], [new go.Point(-100.0,0.0), new go.Point(-80.0,-20.0)], [new go.Point(0.0,-85.0), new go.Point(20.0,-65.0)]]);
    }
  ));

  labels.add(new Test("alignmentFocus", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentIndex = 2; l.elt(2).segmentFraction = 0.5;
        l.elt(2).segmentOffset = new go.Point(0, 0); l.elt(2).alignmentFocus = new go.Spot(1, 0.5, 3, 0);
        l.elt(3).segmentIndex = 2; l.elt(3).segmentFraction = 0.5;
        l.elt(3).segmentOffset = new go.Point(0, 0); l.elt(3).alignmentFocus = new go.Spot(0, 0.5, -3, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(59.5,10.0), new go.Point(120.5,10.0)], [new go.Point(-40.5,75.0), new go.Point(20.5,75.0)], [new go.Point(-120.5,-10.0), new go.Point(-59.5,-10.0)], [new go.Point(-20.5,-75.0), new go.Point(40.5,-75.0)]]);
    }
  ));

  labels.add(new Test("ends NaN NaN", null, CommonLabelsSetup,
    function(test) {
      checkLabelCenters(test, [[new go.Point(61.6,-5.2), new go.Point(121.0,1.4)], [new go.Point(28.5,27.0), new go.Point(12.5,123.0)], [new go.Point(-61.6,5.2), new go.Point(-121.0,-1.4)], [new go.Point(-28.5,-27.0), new go.Point(-12.5,-123.0)]]);
    }
  ));

  labels.add(new Test("ends 0 NaN", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOffset = new go.Point(0, NaN);
        l.elt(3).segmentOffset = new go.Point(0, NaN);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(31.3,-8.6), new go.Point(151.3,4.7)], [new go.Point(28.5,15.0), new go.Point(12.5,135.0)], [new go.Point(-31.3,8.6), new go.Point(-151.3,-4.7)], [new go.Point(-28.5,-15.0), new go.Point(-12.5,-135.0)]]);
    }
  ));

  labels.add(new Test("ends NaN 0", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOffset = new go.Point(NaN, 0);
        l.elt(3).segmentOffset = new go.Point(NaN, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.3,6.7), new go.Point(119.7,13.3)], [new go.Point(-2.0,27.0), new go.Point(-18.0,123.0)], [new go.Point(-60.3,-6.7), new go.Point(-119.7,-13.3)], [new go.Point(2.0,-27.0), new go.Point(18.0,-123.0)]]);
    }
  ));

  labels.add(new Test("ends 0 0", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.elt(2).segmentOffset = new go.Point(0, 0);
        l.elt(3).segmentOffset = new go.Point(0, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(30.0,3.3), new go.Point(150.0,16.7)], [new go.Point(-2.0,15.0), new go.Point(-18.0,135.0)], [new go.Point(-30.0,-3.3), new go.Point(-150.0,-16.7)], [new go.Point(2.0,-15.0), new go.Point(18.0,-135.0)]]);
    }
  ));

  labels.add(new Test("ends shifted", null,
    function(test) {
      CommonLabelsSetup(test);
      var diag = test.diagram;
      diag.findNodeForKey(2).location = new go.Point(180, -20);
      diag.findNodeForKey(3).location = new go.Point(20, 150);
      diag.findNodeForKey(4).location = new go.Point(-180, 20);
      diag.findNodeForKey(5).location = new go.Point(-20, -180);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(59.0,-18.6), new go.Point(118.4,-25.2)], [new go.Point(32.5,27.0), new go.Point(48.5,123.0)], [new go.Point(-59.0,18.6), new go.Point(-118.4,25.2)], [new go.Point(-32.2,-27.0), new go.Point(-48.8,-153.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho NaN NaN", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.5,-12.0), new go.Point(119.5,8.0)], [new go.Point(30.5,27.0), new go.Point(10.5,123.0)], [new go.Point(-60.5,12.0), new go.Point(-119.5,-8.0)], [new go.Point(-30.5,-27.0), new go.Point(-10.5,-123.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho 0 NaN", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentOffset = new go.Point(0, NaN);
        l.elt(3).segmentOffset = new go.Point(0, NaN);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(30.0,-12.0), new go.Point(150.0,8.0)], [new go.Point(30.5,15.0), new go.Point(10.5,135.0)], [new go.Point(-30.0,12.0), new go.Point(-150.0,-8.0)], [new go.Point(-30.5,-15.0), new go.Point(-10.5,-135.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho NaN 0", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentOffset = new go.Point(NaN, 0);
        l.elt(3).segmentOffset = new go.Point(NaN, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.5,0.0), new go.Point(119.5,20.0)], [new go.Point(0.0,27.0), new go.Point(-20.0,123.0)], [new go.Point(-60.5,0.0), new go.Point(-119.5,-20.0)], [new go.Point(0.0,-27.0), new go.Point(20.0,-123.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho 0 0", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentOffset = new go.Point(0, 0);
        l.elt(3).segmentOffset = new go.Point(0, 0);
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(30.0,0.0), new go.Point(150.0,20.0)], [new go.Point(0.0,15.0), new go.Point(-20.0,135.0)], [new go.Point(-30.0,0.0), new go.Point(-150.0,-20.0)], [new go.Point(0.0,-15.0), new go.Point(20.0,-135.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho shifted", null,
    function(test) {
      CommonLabelsSetup(test);
      var diag = test.diagram;
      diag.findNodeForKey(2).location = new go.Point(180, -20);
      diag.findNodeForKey(3).location = new go.Point(20, 150);
      diag.findNodeForKey(4).location = new go.Point(-180, 20);
      diag.findNodeForKey(5).location = new go.Point(-20, -180);
      diag.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.5,-12.0), new go.Point(119.5,-32.0)], [new go.Point(30.5,27.0), new go.Point(50.5,123.0)], [new go.Point(-60.5,12.0), new go.Point(-119.5,32.0)], [new go.Point(-30.5,-27.0), new go.Point(-50.5,-153.0)]]);
    }
  ));

  labels.add(new Test("ends Ortho, indexed", null,
    function(test) {
      CommonLabelsSetup(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.elt(2).segmentIndex = 1;
        l.elt(3).segmentIndex = -2;
      });
    },
    function(test) {
      //logLabelCenters(test);
      checkLabelCenters(test, [[new go.Point(70.5,-12.0), new go.Point(109.5,8.0)], [new go.Point(30.5,37.0), new go.Point(10.5,113.0)], [new go.Point(-70.5,12.0), new go.Point(-109.5,-8.0)], [new go.Point(-30.5,-37.0), new go.Point(-10.5,-113.0)]]);
    }
  ));

  function CommonLabelsSetupNaNIndex(test) {
    var $ = go.GraphObject.make;
    var diag = test.diagram;
    diag.reset();

    diag.nodeTemplate =
      $(go.Node, "Auto",
        { width: 60, height: 30, locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape,
          { fill: "white", portId: "" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text"))
      );

    diag.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" }),
        $(go.TextBlock, ".25",
          { width: 30, height: 18, textAlign: "center", background: "lime", segmentIndex: NaN, segmentFraction: .25 }),
        $(go.TextBlock, ".50",
          { width: 30, height: 18, textAlign: "center", background: "fuchsia", segmentIndex: NaN, segmentFraction: .50 }),
        $(go.TextBlock, ".75",
          { width: 30, height: 18, textAlign: "center", background: "aqua", segmentIndex: NaN, segmentFraction: .75 })
      );

    diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", location: new go.Point(0, 0) },
        { key: 2, text: "Beta", color: "orange", location: new go.Point(180, 20) },
        { key: 3, text: "Gamma", color: "lightgreen", location: new go.Point(-20, 150) },
        { key: 4, text: "Delta", color: "pink", location: new go.Point(-180, -20) },
        { key: 5, text: "Epsilon", color: "yellow", location: new go.Point(20, -150) }
      ],
      [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 1, to: 5 }
      ]);
  }

  labels.add(new Test("NaN index", null,
    function (test) {
      CommonLabelsSetupNaNIndex(test);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.0,6.7), new go.Point(90.0,10.0), new go.Point(120.0,13.3)], [new go.Point(-6.0,45.0), new go.Point(-10.0,75.0), new go.Point(-14.0,105.0)], [new go.Point(-60.0,-6.7), new go.Point(-90.0,-10.0), new go.Point(-120.0,-13.3)], [new go.Point(6.0,-45.0), new go.Point(10.0,-75.0), new go.Point(14.0,-105.0)]]);
    }
  ));

  labels.add(new Test("NaN index, bezier", null,
    function (test) {
      CommonLabelsSetupNaNIndex(test);
      test.diagram.links.each(function(l) {
        l.curve = go.Link.Bezier;
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(60.4,-5.2), new go.Point(90.7,-3.7), new go.Point(120.7,1.2)], [new go.Point(4.8,45.5), new go.Point(3.0,76.1), new go.Point(-3.1,106.2)], [new go.Point(-60.4,5.2), new go.Point(-90.7,3.7), new go.Point(-120.7,-1.2)], [new go.Point(-4.8,-45.5), new go.Point(-3.0,-76.1), new go.Point(3.1,-106.2)]]);
    }
  ));

  labels.add(new Test("NaN index, orthogonal", null,
    function (test) {
      CommonLabelsSetupNaNIndex(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(65.0,0.0), new go.Point(90.0,10.0), new go.Point(115.0,20.0)], [new go.Point(0.0,50.0), new go.Point(-10.0,75.0), new go.Point(-20.0,100.0)], [new go.Point(-65.0,0.0), new go.Point(-90.0,-10.0), new go.Point(-115.0,-20.0)], [new go.Point(0.0,-50.0), new go.Point(10.0,-75.0), new go.Point(20.0,-100.0)]]);
    }
  ));

  labels.add(new Test("NaN index, orthogonal bezier", null,
    function (test) {
      CommonLabelsSetupNaNIndex(test);
      test.diagram.links.each(function(l) {
        l.routing = go.Link.Orthogonal;
        l.curve = go.Link.Bezier;
      });
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(65.6,-3.5), new go.Point(90.0,10.0), new go.Point(114.4,23.5)], [new go.Point(3.5,50.6), new go.Point(-10.0,75.0), new go.Point(-23.5,99.4)], [new go.Point(-65.6,3.5), new go.Point(-90.0,-10.0), new go.Point(-114.4,-23.5)], [new go.Point(-3.5,-50.6), new go.Point(10.0,-75.0), new go.Point(23.5,-99.4)]]);
    }
  ));

  labels.add(new Test("NaN index, bezier mismatched end lengths", null,
    function (test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 60, height: 30, locationSpot: go.Spot.Center },
          new go.Binding("location"),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            new go.Binding("text"))
        );

      diag.linkTemplate =
        $(go.Link,
          {
            fromSpot: go.Spot.Right,
            toSpot: go.Spot.Left,
            fromEndSegmentLength: 20,
            toEndSegmentLength: 100,
            curve: go.Link.Bezier
          },
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" }),
          $(go.TextBlock, ".25",
            { width: 30, height: 18, textAlign: "center", background: "lime", segmentIndex: NaN, segmentFraction: .25 }),
          $(go.TextBlock, ".50",
            { width: 30, height: 18, textAlign: "center", background: "fuchsia", segmentIndex: NaN, segmentFraction: .50 }),
          $(go.TextBlock, ".75",
            { width: 30, height: 18, textAlign: "center", background: "aqua", segmentIndex: NaN, segmentFraction: .75 })
        );

      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", location: new go.Point(0, 0) },
          { key: 2, text: "Beta", color: "orange", location: new go.Point(200, 20) }
        ],
        [
          { from: 1, to: 2 }
        ]);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(64.4,8.4), new go.Point(99.2,15.5), new go.Point(134.5,19.0)]]);
    }
  ));

  labels.add(new Test("NaN index, reflexive", null,
    function (test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 60, height: 30, locationSpot: go.Spot.Center },
          new go.Binding("location"),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            new go.Binding("text"))
        );

      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" }),
          $(go.TextBlock, ".25",
            { width: 30, height: 18, textAlign: "center", background: "lime", segmentIndex: NaN, segmentFraction: .25 }),
          $(go.TextBlock, ".50",
            { width: 30, height: 18, textAlign: "center", background: "fuchsia", segmentIndex: NaN, segmentFraction: .50 }),
          $(go.TextBlock, ".75",
            { width: 30, height: 18, textAlign: "center", background: "aqua", segmentIndex: NaN, segmentFraction: .75 })
        );

      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue" }
        ],
        [
          { from: 1, to: 1 }
        ]);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(42.9,47.1), new go.Point(30.0,57.3), new go.Point(17.1,47.1)]]);
    }
  ));

  labels.add(new Test("NaN index, ends", null,
    function (test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 60, height: 30, locationSpot: go.Spot.Center },
          new go.Binding("location"),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            new go.Binding("text"))
        );

      diag.linkTemplate =
        $(go.Link,
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" }),
          $(go.TextBlock, "from",
            { width: 30, height: 18, textAlign: "center", background: "lime", segmentIndex: NaN, segmentFraction: 0, segmentOffset: new go.Point(NaN, NaN) }),
          $(go.TextBlock, "to",
            { width: 30, height: 18, textAlign: "center", background: "fuchsia", segmentIndex: NaN, segmentFraction: 1, segmentOffset: new go.Point(NaN, NaN) })
        );

      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", location: new go.Point(0, 0) },
          { key: 2, text: "Beta", color: "orange", location: new go.Point(200, 20) }
        ],
        [
          { from: 1, to: 2 }
        ]);
    },
    function(test) {
      checkLabelCenters(test, [[new go.Point(49.1,-7.1), new go.Point(153.3,3.3)]]);
    }
  ));

  labels.add(new Test("NaN index, shortLength", null,
    function (test) {
      var diag = test.diagram;
      diag.reset();

      diag.nodeTemplate =
        new go.Node("Auto", { width: 50, height: 30 })
          .bind("location", "loc", go.Point.parse)
          .add(
            new go.Shape({ fill: "white" })
              .bind("fill", "color"),
            new go.TextBlock()
              .bind("text")
          );
  
      diag.linkTemplate =
        new go.Link({
            routing: go.Link.AvoidsNodes,
            // when this is non-zero the label is arranged incorrectly:
            fromShortLength: 10,
            fromEndSegmentLength: 50,
            toEndSegmentLength: 50
          })
          .add(
            new go.Shape(),
            new go.Shape({ fromArrow: "Standard", segmentIndex: NaN, segmentFraction: 0.1 })
          );
  
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", loc: "30 -90" },
          { key: 3, text: "Gamma", color: "lightgreen", loc: "160 35" },
          { key: 4, text: "Delta", color: "pink", loc: "100 -30" }
        ],
        [
          { from: 1, to: 3 },
        ]);
    },
    function(test) {
      const diag = test.diagram;
      const link = diag.links.first();
      const lab = link.elt(1);
      test.assert(lab instanceof go.Shape, "label isn't a Shape");
      const cntr = lab.getDocumentPoint(go.Spot.Center);
      test.assert(cntr.equalsApprox(new go.Point(92, -53)), "label isn't at 92,-53 but at " + cntr.toString());
    }
  ));

})();
