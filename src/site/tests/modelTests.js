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
  function CommonCheckSimpleTwoNodes(test) {
    var d = test.diagram;
    var m = d.model;
    test.assert(m.nodeDataArray.length === 2, 'should have two node data');
    var d3 = m.findNodeDataForKey(3);
    test.assert(d3 === null, 'should not have node data 3');
    var d4 = m.findNodeDataForKey(4);
    test.assert(d4 === null, 'should not have node data 4');

    if (m instanceof go.GraphLinksModel || m instanceof go.TreeModel)
      test.assert(d.nodes.count === 2, 'should have two nodes');
    else
      test.assert(d.parts.count === 2, 'should have two parts');
    var n3 = d.findPartForKey(3);
    test.assert(n3 === null, 'node 3 should not exist');
    var n4 = d.findPartForKey(4);
    test.assert(n4 === null, 'node 4 should not exist');
  }

  function CommonCheckSimpleThreeNodes(test) {
    var d = test.diagram;
    var m = d.model;
    test.assert(m.nodeDataArray.length === 3, 'should have three node data');
    var d3 = m.findNodeDataForKey(3);
    test.assert(d3 !== null, 'should have node data 3');

    if (m instanceof go.GraphLinksModel || m instanceof go.TreeModel)
      test.assert(d.nodes.count === 3, 'should have three nodes');
    else
      test.assert(d.parts.count === 3, 'should have three parts');
    var n1 = d.findPartForKey(1);
    test.assert(n1 !== null, 'node 1 should exist');
    var n4 = d.findPartForKey(4);
    test.assert(n4 === null, 'node 4 should not exist');
  }

  function CommonCheckSimpleFourNodes(test) {
    var d = test.diagram;
    var m = d.model;
    test.assert(m.nodeDataArray.length === 4, 'should have four node data');
    var d3 = m.findNodeDataForKey(3);
    test.assert(d3 !== null, 'should have node data 3');
    var d4 = m.findNodeDataForKey(4);
    test.assert(d4 !== null, 'should have node data 4');

    if (m instanceof go.GraphLinksModel || m instanceof go.TreeModel)
      test.assert(d.nodes.count === 4, 'should have four nodes');
    else
      test.assert(d.parts.count === 4, 'should have four parts');
    var n3 = d.findPartForKey(3);
    test.assert(n3 !== null, 'node 3 should exist');
    var n4 = d.findPartForKey(4);
    test.assert(n4 !== null, 'node 4 should exist');
  }

  function CommonSetupModelNone(test) {  // create three Parts and no links
    var m = new go.Model();
    m.nodeDataArray = [
      {key: 1, text: "n1", loc: new go.Point(10, 10) },
      {key: 2, text: "n2", loc: new go.Point(50, 10) },
      {key: 3, text: "n3", loc: new go.Point(90, 10) }
    ];
    test.diagram.model = m;
  }

  function CommonSetupGraphLinksNone(test) {  // create three nodes and no links
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" }
    ];
    m.linkDataArray = [
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonSetupTreeNone(test) {  // create three nodes and no links
    test.diagram.initialContentAlignment = go.Spot.Center;
    var m = new go.TreeModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" }
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonCheckNoLink(test) {
    var d = test.diagram;
    var m = d.model;
    if (m instanceof go.GraphLinksModel) {
      test.assert(m.linkDataArray.length === 0, 'should have no link data');
    }

    test.assert(d.links.count === 0, 'should have no links');
    CheckLinks(test, 1, 0, 0, 0, [], [], []);
    CheckLinks(test, 2, 0, 0, 0, [], [], []);
    CheckLinks(test, 3, 0, 0, 0, [], [], []);
  }

  function CommonSetupGraphLinksOne(test) {  // create three nodes and one link from 1 to 2
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 }
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonSetupTreeOne(test) {  // create three nodes and one link from 1 to 2
    test.diagram.initialContentAlignment = go.Spot.Center;
    var m = new go.TreeModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2", parent: 1 },
      { key: 3, text: "n3" }
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonSetupGraphLinksOneReverse(test) {  // create three nodes and one link from 1 to 2
    var m = new go.GraphLinksModel();
    m.linkDataArray = [
      { from: 1, to: 2 }
    ];
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" }
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonSetupTreeOneReverse(test) {  // create three nodes and one link from 1 to 2
    test.diagram.initialContentAlignment = go.Spot.Center;
    var m = new go.TreeModel();
    m.nodeDataArray = [
      { key: 2, text: "n2", parent: 1 },
      { key: 1, text: "n1" },
      { key: 3, text: "n3" }
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonCheckGraph1to2(test) {  // assume there's just one link, from node 1 to node 2
    var d = test.diagram;
    var n1 = d.findNodeForKey(1);
    var n2 = d.findNodeForKey(2);

    var linkdata = undefined;
    if (d.model instanceof go.GraphLinksModel) {
      test.assert(d.model.linkDataArray.length === 1, 'should have one link data');
      linkdata = d.model.linkDataArray[0];
      test.assert(linkdata !== undefined && linkdata.from === 1 && linkdata.to === 2, 'existing link data should connect 1 to 2');
    }

    test.assert(d.links.count === 1, 'should have one link');
    var lit = test.diagram.links;
    var link = lit.next() ? lit.value : null;
    test.assert(link !== null, 'cannot find only link');
    if (d.model instanceof go.GraphLinksModel) {
      test.assert(link.data === linkdata, 'bound to model link data');
    } else if (d.model instanceof go.TreeModel) {
      test.assert(link.data === n2.data, 'bound to model child data');
    }

    var from = link.fromNode;
    test.assert(from !== null && from === n1 && from.data !== null && from.data.key === 1, 'link is not coming from 1');

    var to = link.toNode;
    test.assert(to !== null && to === n2 && to.data !== null && to.data.key === 2, 'link is not going to node 2');

    CheckLinks(test, 1, 1, 1, 0, [2], [2], []);
    CheckLinks(test, 2, 1, 0, 1, [1], [], [1]);
    CheckLinks(test, 3, 0, 0, 0, [], [], []);
  }

  function CommonCheckGraph1to3(test) {  // assume there's just one link, from node 1 to node 3
    var d = test.diagram;
    var n1 = d.findNodeForKey(1);
    var n3 = d.findNodeForKey(3);

    var linkdata = undefined;
    if (d.model instanceof go.GraphLinksModel) {
      test.assert(d.model.linkDataArray.length === 1, 'should have one link data');
      var linkdata = d.model.linkDataArray[0];
      test.assert(linkdata !== undefined && linkdata.from === 1 && linkdata.to === 3, 'modified link data should connect 1 to 3');
    }

    test.assert(d.links.count === 1, 'should have one link');
    var lit = test.diagram.links;
    var link = lit.next() ? lit.value : null;
    test.assert(link !== null, 'cannot find only link');
    if (d.model instanceof go.GraphLinksModel) {
      test.assert(link.data === linkdata, 'bound to model link data');
    } else if (d.model instanceof go.TreeModel) {
      test.assert(link.data === n3.data, 'bound to model child data');
    }

    var from = link.fromNode;
    test.assert(from !== null && from === n1 && from.data !== null && from.data.key === 1, 'link is not coming from 1');

    var to = link.toNode;
    test.assert(to !== null && to === n3 && to.data !== null && to.data.key === 3, 'link is not going to node 3');

    CheckLinks(test, 1, 1, 1, 0, [3], [3], []);
    CheckLinks(test, 2, 0, 0, 0, [], [], []);
    CheckLinks(test, 3, 1, 0, 1, [1], [], [1]);
  }

  function makeSetFromIterator(it) {
    var s = new go.Set();
    while (it.next()) {
      var x = it.value;
      if (x instanceof go.Node) {
        s.add(x.data.key);
      } else if (typeof x === 'object') {
        s.add(x.key);
      } else {
        s.add(x);
      }
    }
    return s;
  }

  function makeSetFromArray(a) {
    if (a === null) {
      return new go.Set();
    } else if (Array.isArray(a)) {
      var s = new go.Set();
      for (var i = 0; i < a.length; i++) {
        var key = a[i];
        s.add(key);
      }
      return s;
    } else {
      test.error('makeSetFromArray expected an Array');
      return null;
    }
  }

  function CheckLinks(test, nodedatakey,
                      linkstotal, linksout, linksin,  // numbers
                      nodesall, nodesto, nodesfrom) { // Arrays of keys
    var d = test.diagram;
    var m = d.model;
    var nodedata = m.findNodeDataForKey(nodedatakey);
    test.assert(nodedata !== null, 'expect node data for key ' + nodedatakey);
    test.assert(m.containsNodeData(nodedata), 'model should contain ' + nodedata);
    var node = d.findNodeForData(nodedata);
    test.assert(node !== null && node.data === nodedata, 'no node for nodedata ' + nodedata);

    var lit = node.linksConnected;
    test.assert(lit.count === linkstotal, 'unexpected # linksConnected: ' + lit.count + ' instead of ' + linkstotal);
    lit = node.findLinksOutOf();
    test.assert(lit.count === linksout, 'unexpected # linksOutOf(): ' + lit.count + ' instead of ' + linksout);
    lit = node.findLinksInto();
    test.assert(lit.count === linksin, 'unexpected # linksInto(): ' + lit.count + ' instead of ' + linksin);

    var nit = node.findNodesConnected();
    var nodes = makeSetFromIterator(nit);
    var exp = makeSetFromArray(nodesall);
    test.assert(nit.count === nodes.count && nodes.count === exp.count, 'unexpected # nodesConnected(): ' + nit.count + ' instead of ' + nodes.count + ' and ' + exp.count);
    test.assert(nodes.containsAll(exp) && exp.containsAll(nodes), 'did not contain all expected nodesConnected');

    nit = node.findNodesOutOf();
    nodes = makeSetFromIterator(nit);
    exp = makeSetFromArray(nodesto);
    test.assert(nit.count === nodes.count && nodes.count === exp.count, 'unexpected # nodesOutOf(): ' + nit.count + ' instead of ' + nodes.count + ' and ' + exp.count);
    test.assert(nodes.containsAll(exp) && exp.containsAll(nodes), 'did not contain all expected nodesOutOf');

    nit = node.findNodesInto();
    nodes = makeSetFromIterator(nit);
    exp = makeSetFromArray(nodesfrom);
    test.assert(nit.count === nodes.count && nodes.count === exp.count, 'unexpected # nodesInto(): ' + nit.count + ' instead of ' + nodes.count + ' and ' + exp.count);
    test.assert(nodes.containsAll(exp) && exp.containsAll(nodes), 'did not contain all expected nodesInto');
  }


  class CountingTreeLayout extends go.TreeLayout {
    constructor() {
      super();
      this.numLayouts = 0;
    }
    doLayout(coll) {
      this.numLayouts++;
      super.doLayout(coll);
    }
  }



  function CommonSetupSubGraph(test) {
    //test.diagram.reset();
    var m = new go.GraphLinksModel();

    var archgrp = new go.Group();
    archgrp.layout = new CountingTreeLayout();
    archgrp.type = go.Panel.Vertical;
    var grpt = new go.TextBlock();
    grpt.name = 'TB';  // needed for later checking
    grpt.font = 'bold 16pt sans-serif';
    grpt.bind(new go.Binding('text', '', go.Binding.toString));
    archgrp.add(grpt);
    var archgrpph = new go.Placeholder();
    archgrpph.padding = new go.Margin(5, 5, 5, 5);
    archgrpph.background = 'rgba(0,0,0,.2)';
    archgrp.add(archgrpph);
    test.diagram.groupTemplate = archgrp;

    m.nodeDataArray = [
      {key: -1, text: "g1", isGroup: true},
      {key: 1, text: "n1", group: -1},
      {key: 2, text: "n2", group: -1},
      {key: 3, text: "n3"}
    ];
    m.linkDataArray = [
      {from: 1, to: 2},
      {from: 2, to: 3}
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonSetupSubGraphReverse(test) {
    //test.diagram.reset();
    var m = new go.GraphLinksModel();

    var archgrp = new go.Group();
    archgrp.layout = new CountingTreeLayout();
    archgrp.type = go.Panel.Vertical;
    var grpt = new go.TextBlock();
    grpt.name = 'TB';  // needed for later checking
    grpt.font = 'bold 16pt sans-serif';
    grpt.bind(new go.Binding('text', '', go.Binding.toString));
    archgrp.add(grpt);
    var archgrpph = new go.Placeholder();
    archgrpph.padding = new go.Margin(5, 5, 5, 5);
    archgrpph.background = 'rgba(0,0,0,.2)';
    archgrp.add(archgrpph);
    test.diagram.groupTemplate = archgrp;

    m.linkDataArray = [
      {from: 1, to: 2},
      {from: 2, to: 3}
    ];
    m.nodeDataArray = [
      {key: 1, text: "n1", group: -1},
      {key: 3, text: "n3"},
      {key: -1, text: "g1", isGroup: true},
      {key: 2, text: "n2", group: -1}
    ];
    test.diagram.model = m;

    var layout = new go.ForceDirectedLayout();
    layout.doLayout(test.diagram);
  }

  function CommonCheckSubGraph(test) {
    var d = test.diagram;
    var n1 = d.findNodeForKey(1);
    var n2 = d.findNodeForKey(2);
    var n3 = d.findNodeForKey(3);
    var g1 = d.findNodeForKey(-1);
    var g2 = d.findNodeForKey(-2);

    test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group');
    test.assert(n2 !== null && n2.containingGroup === g1 && n2.isMemberOf(g1), 'node 2 should be a member of group');
    test.assert(n3 !== null && n3.containingGroup === null && !n3.isMemberOf(g1), 'node 3 should not be a member of group');
    test.assert(g1 !== null && g2 === null, 'should have only one group');

    var mems = new go.Set(/*go.Part*/);
    mems.addAll(g1.memberParts);
    test.assert(mems.contains(n1), 'node 1 should be in Group.memberParts');
    test.assert(mems.contains(n2), 'node 2 should be in Group.memberParts');
    test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

    var lit = n1.linksConnected;
    test.assert(lit.next(), 'node 1 should have a link');
    var link = lit.value;
    test.assert(link !== null, 'node 1 should have at least one link');
    test.assert(link.containingGroup === g1 && link.isMemberOf(g1), 'link 1-2 should be a member of group');
    test.assert(mems.contains(link), 'link should be in Group.memberParts');
  }


  function CommonSetupTwoSubGraphs(test) {
    CommonSetupSubGraph(test);
    var m = test.diagram.model;

    m.startTransaction(test.name);
    var sg2 = { key: -2, text: "g2", isGroup: true };
    m.addNodeData(sg2);
    var d3 = m.findNodeDataForKey(3);
    m.setGroupKeyForNodeData(d3, -2);
    var sg1 = m.findNodeDataForKey(-1);
    m.setGroupKeyForNodeData(sg1, -2);
    m.addLinkData({ from: 3, to: 3 });
    m.addLinkData({ from: 3, to: -2 });
    m.commitTransaction(test.name);
  }

  function CommonCheckTwoSubGraphs(test, changedKeys) {
    var d = test.diagram;
    var n1 = d.findNodeForKey(1);
    var n2 = d.findNodeForKey(2);
    if (!n2) {
      var alt = changedKeys ? changedKeys[2] : undefined;
      if (alt !== undefined) {
        n2 = d.findNodeForKey(alt);  // handle a change of node key from 2 to 23
        test.assert(n2, "couldn't find node with changed key: " + alt);
      } else {
        test.assert(false, "couldn't find node with key 2");
      }
    }
    var n3 = d.findNodeForKey(3);
    var g1 = d.findNodeForKey(-1);
    if (!g1) {
      var alt = changedKeys ? changedKeys[-1] : undefined;
      if (alt !== undefined) {
        g1 = d.findNodeForKey(alt);  // handle a change of node key from -1 to -23
        test.assert(g1, "couldn't find group with changed key: " + alt);
      } else {
        test.assert(false, "couldn't find group with key -1");
      }
    }
    var g2 = d.findNodeForKey(-2);

    test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group 1');
    test.assert(n2 !== null && n2.containingGroup === g1 && n2.isMemberOf(g1), 'node 2 should be a member of group 1');
    test.assert(n3 !== null && n3.containingGroup === g2 && !n3.isMemberOf(g1), 'node 3 should not be a member of group 1 (but of group 2)');
    var mems1 = new go.Set(/*go.Part*/);
    mems1.addAll(g1.memberParts);
    test.assert(mems1.contains(n1), 'node 1 should be in Group 1 memberParts');
    test.assert(mems1.contains(n2), 'node 2 should be in Group 1 memberParts');
    test.assert(!mems1.contains(n3), 'node 3 should not be in Group 1 memberParts');

    var lit = n1.linksConnected;
    test.assert(lit.next(), 'node 1 should have a link');
    var link1 = lit.value;
    test.assert(link1 !== null, 'node 1 should have at least one link');
    test.assert(link1.containingGroup === g1 && link1.isMemberOf(g1), 'link 1-2 should be a member of group 1');
    test.assert(mems1.contains(link1), 'link 1 should be in Group 1 memberParts');

    var mems2 = new go.Set(/*go.Part*/);
    mems2.addAll(g2.memberParts);
    test.assert(!mems2.contains(n1), 'node 1 should not be in Group 2 memberParts');
    test.assert(!mems2.contains(n2), 'node 2 should not be in Group 2 memberParts');
    test.assert(mems2.contains(n3), 'node 3 should be in Group 2 memberParts');

    lit = n2.findLinksOutOf();
    test.assert(lit.next(), 'node 2 should have a link going out');
    var link2 = lit.value;
    test.assert(link2 !== null, 'node 2 should have at least one link going out');
    test.assert(link2.containingGroup === g2 && link2.isMemberOf(g2), 'link 2-3 should be a member of group 2');
    test.assert(mems2.contains(link2), 'link 2 should be in Group 2 memberParts');

    test.assert(n3.linksConnected.count === 3, 'node 3 should have three links');
    test.assert(n3.findLinksBetween(n2).count === 1, 'should have a link between 3 and 2');
    var link23 = n3.findLinksBetween(n2).first();
    test.assert(link23 !== null && link23.containingGroup === g2, 'link 2-3 should be a member of Group 2');

    test.assert(n3.findLinksBetween(n3).count === 1, 'should have a reflexive link on 3');
    var link33 = n3.findLinksBetween(n3).first();
    test.assert(link33 !== null && link33.containingGroup === g2, 'link 3-3 should be a member of Group 2');

    test.assert(n3.findLinksBetween(g2).count === 1, 'should have a link between 3 and Group 2');
    var link3g = n3.findLinksBetween(g2).first();
    test.assert(link3g !== null && link3g.containingGroup === g2, 'link 3 - Group 2 should be a member of Group 2');

    test.assert(g2.memberParts.count === 5, 'Group 2 should have 5 members (2 nodes, 3 links), not ' + g2.memberParts.count);

    test.assert(n1.findTopLevelPart() === g2 && n1.isMemberOf(g2), 'node 1 should be inside group 2');
    test.assert(n2.findTopLevelPart() === g2 && n2.isMemberOf(g2), 'node 2 should be inside group 2');
    test.assert(n3.findTopLevelPart() === g2 && n3.isMemberOf(g2), 'node 3 should be inside group 2');
    test.assert(link1.findTopLevelPart() === g2 && link1.isMemberOf(g2), 'link 1 should be inside group 2');
    test.assert(link2.findTopLevelPart() === g2 && link2.isMemberOf(g2), 'link 2 should be inside group 2');
    test.assert(g2.findSubGraphLevel() === 0, "group 2 should be level 0");
    test.assert(g1.findSubGraphLevel() === 1, "group 1 should be level 1");
    test.assert(n1.findSubGraphLevel() === 2, "node 1 should be level 2");
    test.assert(n1.findCommonContainingGroup(n2) === g1 && n2.findCommonContainingGroup(n1) === g1, "node 1 and node 2 closest container should be group 2");
    test.assert(n1.findCommonContainingGroup(link1) === g1 && link1.findCommonContainingGroup(n1) === g1, "link 1 and node 2 closest container should be group 2");
    test.assert(n1.findCommonContainingGroup(g1) === g1 && g1.findCommonContainingGroup(n1) === g1, "node 1 and group 1 closest container should be group 1");
    test.assert(n1.findCommonContainingGroup(n3) === g2 && n3.findCommonContainingGroup(n1) === g2, "node 1 and node 3 closest container should be group 2");
  }


  // Model:
  var modeltests = new TestCollection('Model');
  modeltests.preSetup = function(test) {
    test.diagram.nodeTemplate = archnode;
  }
  TestRoot.add(modeltests);

  var myDiagram = null;

  var archnode = new go.Part();
  var nodet = new go.TextBlock();
  nodet.name = 'TB';  // needed for later checking
  nodet.bind(new go.Binding('text', '', go.Binding.toString));
  archnode.add(nodet);
  archnode.bind(new go.Binding('location', 'loc'));
  //myDiagram.nodeTemplate = archnode;

  var fd = new TestCollection('Nodes Only');


  modeltests.add(fd);

  fd.add(new Test('no added node', myDiagram, CommonSetupModelNone,
    null,
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('add node', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleFourNodes
  ));

  fd.add(new Test('add node no key', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addNodeData({text: "n4"});
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var m = d.model;
      test.assert(m.nodeDataArray.length === 4, 'should have four node data');
      var d3 = m.findNodeDataForKey(3);
      test.assert(d3 !== null, 'should have node data 3');
      var d4 = null;
      for (var i = 0; i < m.nodeDataArray.length; i++) {
        if (m.nodeDataArray[i].text === "n4") {
          d4 = m.nodeDataArray[i];
          break;
        }
      }
      test.assert(d4 !== null && m.findNodeDataForKey(d4.key) === d4, 'should have fourth node data, with new key');

      if (m instanceof go.GraphLinksModel || m instanceof go.TreeModel)
        test.assert(d.nodes.count === 4, 'should have four nodes');
      else
        test.assert(d.parts.count === 4, 'should have four parts');
      var n3 = d.findPartForKey(3);
      test.assert(n3 !== null, 'node 3 should exist');
      var n4 = d.findPartForKey(d4.key);
      test.assert(n4 !== null, 'node 4 should exist');
    }
  ));

  fd.add(new Test('add node duplicate key', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addNodeData({key: 3, text: "n3dup"});
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var m = d.model;
      test.assert(m.nodeDataArray.length === 4, 'should have four node data');
      var d3 = m.findNodeDataForKey(3);
      test.assert(d3 !== null, 'should have node data 3');
      var d4 = m.findNodeDataForKey(4);
      test.assert(d4 === null, 'should NOT have node data 4');
      var dup = null;
      for (var i = 0; i < m.nodeDataArray.length; i++) {
        if (m.nodeDataArray[i].text === "n3dup") {
          dup = m.nodeDataArray[i];
          break;
        }
      }
      test.assert(dup !== null && dup.key !== 3, 'should have duplicate node data, with different key');

      if (m instanceof go.GraphLinksModel || m instanceof go.TreeModel)
        test.assert(d.nodes.count === 4, 'should have four nodes');
      else
        test.assert(d.parts.count === 4, 'should have four parts');
      var n3 = d.findPartForKey(3);
      test.assert(n3 !== null, 'node 3 should exist');
      var n4 = d.findPartForKey(4);
      test.assert(n4 === null, 'node 4 should NOT exist');
      var ndup = d.findPartForKey(dup.key);
      test.assert(ndup !== null, 'duplicate node should exist');
    }
  ));

  fd.add(new Test('add node undo', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('add node undo redo', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleFourNodes
  ));

  fd.add(new Test('remove node', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleTwoNodes
  ));

  fd.add(new Test('remove node undo', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('remove node undo redo', myDiagram, CommonSetupModelNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleTwoNodes
  ));

    fd.add(new Test('copy node data shallow', myDiagram, null,
    function(test) {
      var m = new go.Model();
      var array1 = ["abc"];
      var item1 = { p: 97, q: array1 };
      var array2 = ["xyz"];
      var item2 = { p: 297, q: array2 };
      var array3 = [item1, item2];
      var first = { a: 17, b: array3 };
      var second = m.copyNodeData(first);
      test.assert(first !== second, "didn't copy data object: " + first);
      test.assert(second.a === 17 && second.b === array3, "should have been shallow copy only: " + second);
      array1[0] = false;
      test.assert(first.b[0] === second.b[0] && first.b[0].q === second.b[0].q && second.b[0].q[0] === false, "should have shared structures all the way down");
    },
    null
  ));

  fd.add(new Test('copy node data copiesArrays', myDiagram, null,
    function(test) {
      var m = new go.Model();
      m.copiesArrays = true;
      var array1 = ["abc"];
      var item1 = { p: 97, q: array1 };
      var array2 = ["xyz"];
      var item2 = { p: 297, q: array2 };
      var array3 = [item1, item2];
      var first = { a: 17, b: array3 };
      var second = m.copyNodeData(first);
      test.assert(first !== second, "didn't copy data object: " + first);
      test.assert(second.a === 17 && second.b !== array3, "should have copied B array: " + second.b);
      test.assert(first.b[0] === second.b[0], "should have shared first item in B array: " + second.b[0]);
      test.assert(first.b[1] === second.b[1], "should have shared second item in B array: " + second.b[1]);
      array1[0] = false;
      test.assert(first.b[0].q === second.b[0].q && second.b[0].q[0] === false, "should have shared structures all the way down");
    },
    null
  ));

  fd.add(new Test('copy node data copiesArrays copiesArrayObjects', myDiagram, null,
    function(test) {
      var m = new go.Model();
      m.copiesArrays = true;
      m.copiesArrayObjects = true;
      var array1 = ["abc"];
      var item1 = { p: 97, q: array1 };
      var array2 = ["xyz"];
      var item2 = { p: 297, q: array2 };
      var array3 = [item1, item2];
      var first = { a: 17, b: array3 };
      var second = m.copyNodeData(first);
      test.assert(first !== second, "didn't copy data object: " + first);
      test.assert(second.a === 17 && second.b !== array3, "should have copied B array: " + second.b);
      test.assert(first.b[0] !== second.b[0], "should have copied first item in B array: " + second.b[0]);
      test.assert(first.b[1] !== second.b[1], "should have copied second item in B array: " + second.b[1]);
      array1[0] = false;
      test.assert(first.b[0].q !== second.b[0].q && second.b[0].q[0] === "abc", "should have copied structures all the way down");
    },
    null
  ));

  fd.add(new Test('copy node data copiesKey', myDiagram, null,
    function(test) {
      var m = new go.Model();
      test.assert(m.copiesKey === false, "Model.copiesKey should default to false");
      m.copiesKey = true;
      var orig = { key: "first", a: 17 };
      var copy = m.copyNodeData(orig);
      test.assert(orig !== copy, "didn't copy data object: " + orig);
      test.assert(orig.key === "first" && copy.key === "first", "should have copied key: " + copy.key);

      m.copiesKey = false;
      var orig2 = { key: "first2", a: 17 };
      var copy2 = m.copyNodeData(orig2);
      test.assert(orig2 !== copy2, "didn't copy data object: " + orig2);
      test.assert(orig2.key === "first2" && copy2.key !== "first2", "shouldn't have copied key: " + copy2.key);

      m.nodeKeyProperty = "id";
      m.copiesKey = false;
      var orig3 = { a: 17, id: "first3" };
      var copy3 = m.copyNodeData(orig3);
      test.assert(orig3 !== copy3, "didn't copy data object: " + orig2);
      test.assert(orig3.id === "first3" && copy3.id !== "first3", "shouldn't have copied id/key: " + copy3.id);
    },
    null
  ));

  fd.add(new Test("undo setkey", myDiagram,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        go.GraphObject.make(go.Node,
          go.GraphObject.make(go.TextBlock, new go.Binding("text"))
        );
      diag.model = new go.GraphLinksModel(
        [ { key: "test1", text: "test1" },
          { key: 2, text: "Beta" } ],
        [ { from: "test1", to: 2 } ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var testData = diag.model.nodeDataArray[0];

      test.assert(testData.key === "test1" && diag.findNodeForKey("test1") && !diag.findNodeForKey("test2"), "should find test1 but not test2");

      diag.model.commit(function(m) {
        var data = m.findNodeDataForKey("test1");
        test.assert(testData === data, "should have found that data by key");
        m.setKeyForNodeData(testData, "test2")
        m.set(testData, "text", "test2");
      }, "updateKey");

      test.assert(testData.key === "test2" && diag.findNodeForKey("test2") && !diag.findNodeForKey("test1"), "should find test2 but not test1");

      diag.commandHandler.undo();
    },
    function(test) {
      var diag = test.diagram;
      var testData = diag.model.nodeDataArray[0];

      test.assert(testData.key === "test1" && diag.findNodeForKey("test1") && !diag.findNodeForKey("test2"), "should find test1 but not test2");
    }
  ));


  // GraphLinksModel:
  var glmtests = new TestCollection('GraphLinksModel');
  TestRoot.add(glmtests);

  myDiagram = null;

  fd = new TestCollection('Nodes Only');
  glmtests.add(fd);

  fd.add(new Test('no added node', myDiagram, CommonSetupGraphLinksNone,
    null,
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('add node', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleFourNodes
  ));

  fd.add(new Test('add node undo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('add node undo redo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({key: 4, text: "n4"});
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleFourNodes
  ));

  fd.add(new Test('remove node', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleTwoNodes
  ));

  fd.add(new Test('remove node undo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  fd.add(new Test('remove node undo redo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleTwoNodes
  ));


  fd = new TestCollection('Links');
  glmtests.add(fd);

  fd.add(new Test('no links', myDiagram, CommonSetupGraphLinksNone,
    null,
    CommonCheckNoLink
  ));

  fd.add(new Test('add link', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addLinkData({from: 1, to: 2});
      m.commitTransaction(test.name);
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('add link undo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addLinkData({from: 1, to: 2});
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckNoLink
  ));

  fd.add(new Test('add link undo redo', myDiagram, CommonSetupGraphLinksNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addLinkData({from: 1, to: 2});
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('one link', myDiagram, CommonSetupGraphLinksOne,
    null,
    CommonCheckGraph1to2
  ));

  fd.add(new Test('one link reverse', myDiagram, CommonSetupGraphLinksOneReverse,
    null,
    CommonCheckGraph1to2
  ));

  fd.add(new Test('remove link', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.removeLinkData(linkdata);
      m.commitTransaction(test.name);
    },
    CommonCheckNoLink
  ));

  fd.add(new Test('remove link undo', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.removeLinkData(linkdata);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('remove link undo redo', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.removeLinkData(linkdata);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckNoLink
  ));

  fd.add(new Test('reconnect link to', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, 3);
      m.commitTransaction(test.name);
    },
    CommonCheckGraph1to3
  ));

  fd.add(new Test('reconnect link from', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, 3);
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      test.assert(d.model.linkDataArray.length === 1, 'should have one link data');
      var linkdata = d.model.linkDataArray[0];
      test.assert(linkdata !== undefined && linkdata.from === 3 && linkdata.to === 2, 'modified link data should connect 3 to 2');

      test.assert(d.links.count === 1, 'should have one link');
      var lit = test.diagram.links;
      var link = lit.next() ? lit.value : null;
      test.assert(link !== null && link.data === linkdata, 'cannot find only link, bound to model link data');
      var nit;

      var from = link.fromNode;
      test.assert(from !== null && from === n3 && from.data !== null && from.data.key === 3, 'link is not coming from 3');
      lit = from.findLinksOutOf();
      test.assert(lit.count === 1, 'should have 1 link coming out of node 3');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = from.findNodesOutOf();
      test.assert(nit.count === 1, 'should have 1 node coming out of node 3');
      test.assert(nit.next() && nit.value === n2, 'should be connecting to node 2');

      var to = link.toNode;
      test.assert(to !== null && to === n2 && to.data !== null && to.data.key === 2, 'link is not going to node 2');
      lit = to.findLinksInto();
      test.assert(lit.count === 1, 'should have 1 link going into node 2');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = to.findNodesInto();
      test.assert(nit.count === 1, 'should have 1 node going into node 2');
      test.assert(nit.next() && nit.value === n3, 'should be connecting from node 3');

      CheckLinks(test, 1, 0, 0, 0, [], [], []);
      CheckLinks(test, 2, 1, 0, 1, [3], [], [3]);
      CheckLinks(test, 3, 1, 1, 0, [2], [2], []);
    }
  ));

  fd.add(new Test('reconnect link to self', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, 1);
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      test.assert(d.model.linkDataArray.length === 1, 'should have one link data');
      var linkdata = d.model.linkDataArray[0];
      test.assert(linkdata !== undefined && linkdata.from === 1 && linkdata.to === 1, 'modified link data should connect 1 to 1');

      test.assert(d.links.count === 1, 'should have one link');
      var lit = test.diagram.links;
      var link = lit.next() ? lit.value : null;
      test.assert(link !== null && link.data === linkdata, 'cannot find only link, bound to model link data');
      var nit;

      var from = link.fromNode;
      test.assert(from !== null && from === n1 && from.data !== null && from.data.key === 1, 'link is not coming from 1');
      lit = from.findLinksOutOf();
      test.assert(lit.count === 1, 'should have 1 link coming out of node 1');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = from.findNodesOutOf();
      test.assert(nit.count === 1, 'should have 1 node coming out of node 1');
      test.assert(nit.next() && nit.value === n1, 'should be connecting to node 1');

      var to = link.toNode;
      test.assert(to !== null && to === n1 && to.data !== null && to.data.key === 1, 'link is not going to node 1');
      lit = to.findLinksInto();
      test.assert(lit.count === 1, 'should have 1 link going into node 1');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = to.findNodesInto();
      test.assert(nit.count === 1, 'should have 1 node going into node 1');
      test.assert(nit.next() && nit.value === n1, 'should be connecting from node 1');

      CheckLinks(test, 1, 1, 1, 1, [1], [1], [1]);
      CheckLinks(test, 2, 0, 0, 0, [], [], []);
      CheckLinks(test, 3, 0, 0, 0, [], [], []);
    }
  ));

  fd.add(new Test('reconnect link from self', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, 2);
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      test.assert(d.model.linkDataArray.length === 1, 'should have one link data');
      var linkdata = d.model.linkDataArray[0];
      test.assert(linkdata !== undefined && linkdata.from === 2 && linkdata.to === 2, 'modified link data should connect 2 to 2');

      test.assert(d.links.count === 1, 'should have one link');
      var lit = test.diagram.links;
      var link = lit.next() ? lit.value : null;
      test.assert(link !== null && link.data === linkdata, 'cannot find only link, bound to model link data');
      var nit;

      var from = link.fromNode;
      test.assert(from !== null && from === n2 && from.data !== null && from.data.key === 2, 'link is not coming from 2');
      lit = from.findLinksOutOf();
      test.assert(lit.count === 1, 'should have 1 link coming out of node 2');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = from.findNodesOutOf();
      test.assert(nit.count === 1, 'should have 1 node coming out of node 2');
      test.assert(nit.next() && nit.value === n2, 'should be connecting to node 2');

      var to = link.toNode;
      test.assert(to !== null && to === n2 && to.data !== null && to.data.key === 2, 'link is not going to node 2');
      lit = to.findLinksInto();
      test.assert(lit.count === 1, 'should have 1 link going into node 2');
      test.assert(lit.next() && lit.value === link, 'only link is not the known link');
      nit = to.findNodesInto();
      test.assert(nit.count === 1, 'should have 1 node going into node 2');
      test.assert(nit.next() && nit.value === n2, 'should be connecting from node 2');

      CheckLinks(test, 1, 0, 0, 0, [], [], []);
      CheckLinks(test, 2, 1, 1, 1, [2], [2], [2]);
      CheckLinks(test, 3, 0, 0, 0, [], [], []);
    }
  ));

  fd.add(new Test('reconnect link to self and 3', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, 1);
      m.commitTransaction(test.name);

      m.startTransaction(test.name);
      m.setToKeyForLinkData(linkdata, 3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
      mgr.redo();
      mgr.redo();
    },
    CommonCheckGraph1to3
  ));

  fd.add(new Test('reconnect link from self and 3 and 1', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, 2);
      m.commitTransaction(test.name);

      m.startTransaction(test.name);
      m.setToKeyForLinkData(linkdata, 3);
      m.setFromKeyForLinkData(linkdata, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
      mgr.redo();
      mgr.redo();
    },
    CommonCheckGraph1to3
  ));

  fd.add(new Test('reconnect link and undo', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, 2);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.setToKeyForLinkData(linkdata, 3);
      m.setFromKeyForLinkData(linkdata, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('reconnect link', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, 2);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.setToKeyForLinkData(linkdata, 3);
      m.setFromKeyForLinkData(linkdata, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
      mgr.redo();
      mgr.redo();
    },
    CommonCheckGraph1to3
  ));

  fd.add(new Test('double link', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addLinkData({from: 1, to: 2});
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      CheckLinks(test, 1, 2, 2, 0, [2], [2], []);
      CheckLinks(test, 2, 2, 0, 2, [1], [], [1]);
      CheckLinks(test, 3, 0, 0, 0, [], [], []);
    }
  ));

  fd.add(new Test('double link undo', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata2 = {from: 1, to: 2};
      m.addLinkData(linkdata2);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('double link remove', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var linkdata1 = m.linkDataArray[0];

      m.startTransaction(test.name);
      var linkdata2 = {from: 1, to: 2};
      m.addLinkData(linkdata2);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.removeLinkData(linkdata1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckGraph1to2
  ));

  fd.add(new Test('double link remove/add undo', myDiagram, CommonSetupGraphLinksOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var linkdata1 = m.linkDataArray[0];

      m.startTransaction(test.name);
      var linkdata2 = {from: 1, to: 2};
      m.addLinkData(linkdata2);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.removeLinkData(linkdata2);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.addLinkData(linkdata2);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  function makePort(name, input, frac) {
    var port = $(go.Panel, "Horizontal",
      {
        alignment: new go.Spot(input ? 0 : 1, frac),
        alignmentFocus: go.Spot.Center,
        alignmentFocusName: "CIRCLE",
        portId: name, cursor: "pointer",
        toLinkable: input,
        fromLinkable: !input
      }
    );
    var shape =
      $(go.Shape, "Circle",
        {
          name: "CIRCLE",
          width: 8, height: 8,
          fill: "white"
        });
    var text =
      $(go.TextBlock, name,
        {
          stroke: "white",
          maxSize: new go.Size(24, 30)
        });
    if (input) {
      port.add(shape);
      port.add(text);
    } else {
      port.add(text);
      port.add(shape);
    }
    return port;
  }

  fd.add(new Test('findLinks', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          $(go.Panel, "Auto",
            $(go.Shape,
              { fill: "white" },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              {
                margin: new go.Margin(8, 24),
                font: "bold 14pt sans-serif",
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          makePort("i1", true, 0.25),
          makePort("i2", true, 0.5),
          makePort("i3", true, 0.75),
          makePort("o1", false, 0.33333),
          makePort("o2", false, 0.66667)
        );
      diagram.model = go.Model.fromJson(
        '{\
          "class": "GraphLinksModel",\
          "linkFromPortIdProperty": "fp",\
          "linkToPortIdProperty": "tp",\
          "nodeDataArray": [\
            { "key": 1, "text": "Alpha", "color": "lightblue", "group": "G1" },\
            { "key": 2, "text": "Beta", "color": "orange", "group": "G1" },\
            { "key": "G1", "text": "Group 1", "isGroup": true },\
            { "key": 3, "text": "Gamma", "color": "lightgreen", "group": "G2" },\
            { "key": 4, "text": "Delta", "color": "pink", "group": "G2" },\
            { "key": "G2", "text": "Group 2", "isGroup": true }\
          ],\
          "linkDataArray": [\
            { "from": 1, "fp": "o1", "to": 2, "tp": "i1" },\
            { "from": 3, "fp": "o2", "to": 4, "tp": "i1" },\
            { "from": 2, "to": 4, "fp": "o1", "tp": "i1" },\
            { "from": 2, "to": 3, "fp": "o2", "tp": "i1" },\
            { "from": 2, "to": 3, "fp": "o2", "tp": "i2" },\
            { "from": 2, "to": 3, "fp": "o2", "tp": "i2" }\
          ]\
        }');
    },
    function(test) {
      var diagram = test.diagram;
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n2 && n3 && n2.findLinksBetween(n3).count === 3 && n2.findLinksTo(n3).count === 3 && n3.findLinksTo(n2).count === 0, "should have two links between N2 and N3");
      test.assert(n2.findLinksBetween(n3, "o2", "i1").count === 1, "wrong numbers of links between N2o2 and N3i1");
      test.assert(n2.findLinksBetween(n3, "o2", "i2").count === 2, "wrong numbers of links between N2o2 and N3i2");
      test.assert(n2.findLinksBetween(n3, "o2", "i3").count === 0, "wrong numbers of links between N2o2 and N3i3");
      test.assert(n3.findLinksBetween(n2, "i1", "o2").count === 1, "wrong numbers of links between N3i1 and N2o2");
      test.assert(n3.findLinksBetween(n2, "i2", "o2").count === 2, "wrong numbers of links between N3i2 and N2o2");
      test.assert(n3.findLinksBetween(n2, "i3", "o2").count === 0, "wrong numbers of links between N3i3 and N2o2");
      test.assert(n2.findLinksTo(n3, "o2", "i1").count === 1, "wrong numbers of links from N2o2 to N3i1");
      test.assert(n2.findLinksTo(n3, "o2", "i2").count === 2, "wrong numbers of links from N2o2 to N3i2");
      test.assert(n2.findLinksTo(n3, "o2", "i3").count === 0, "wrong numbers of links from N2o2 to N3i3");
      test.assert(n3.findLinksTo(n2, "i1", "o2").count === 0, "wrong numbers of links from N3i1 to N2o2");
      test.assert(n3.findLinksTo(n2, "i2", "o2").count === 0, "wrong numbers of links from N3i2 to N2o2");
      test.assert(n3.findLinksTo(n2, "i3", "o2").count === 0, "wrong numbers of links from N3i3 to N2o2");
    }
  ))


    function CommonSetupGLMTree(test, reverse) {
      if (reverse === undefined) reverse = false;
      var m = new go.GraphLinksModel();
      m.nodeDataArray = [
        { key: 1, text: "n1" },
        { key: 2, text: "n2" },
        { key: 3, text: "n3" },
        { key: 4, text: "n4" }
      ];
      if (reverse) {
        m.linkDataArray = [
          { from: 2, to: 1 },
          { from: 3, to: 1 },
          { from: 4, to: 3 },
          { from: 2, to: 3, isTreeLink: false },
          { from: 4, to: 2, isTreeLink: false }
        ];
      } else {
        m.linkDataArray = [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 3, to: 4 },
          { from: 3, to: 2, isTreeLink: false },
          { from: 2, to: 4, isTreeLink: false }
        ];
      }
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          new go.Binding("isTreeLink"),
          new go.Binding("isLayoutPositioned", "isTreeLink"),
          $(go.Shape,
            new go.Binding("strokeDashArray", "isTreeLink", function(b) { return b ? null : [0, 0, 2, 4]; })),
          $(go.Shape, { toArrow: "Standard" },
            new go.Binding("toArrow", "isTreeLink", function(b) { return b ? "Standard" : "OpenTriangle"; }))
        );
      test.diagram.isTreePathToChildren = !reverse;
      test.diagram.model = m;

      var layout = new go.TreeLayout();
      // don't set this, to see if TreeLayout.path === TreeLayout.PathDefault works
      //layout.path = (reverse ? go.TreeLayout.PathSource : go.TreeLayout.PathDestination);
      layout.doLayout(test.diagram);
    }

    function CommonSetupGLMTreeReverse(test) { CommonSetupGLMTree(test, true); }

    function CommonCheckGLMTree(test, reverse) {
      if (reverse === undefined) reverse = false;
      var d = test.diagram;
      test.assert(d.nodes.count === 4, "should have four nodes");
      test.assert(d.links.count === 5, "should have three links");
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      if (!n3) n3 = d.findNodeForKey(-3);  // handle node key change from 3 to -3
      var n4 = d.findNodeForKey(4);
      test.assert(n1 !== null && n2 !== null && n3 !== null && n4 !== null, "should be able to find all nodes");
      var l2 = n2.linksConnected.first();
      if (reverse)
        test.assert(l2 !== null && l2.fromNode === n2 && l2.toNode === n1, "should have link from n2 to n1");
      else
        test.assert(l2 !== null && l2.fromNode === n1 && l2.toNode === n2, "should have link from n1 to n2");
      var l3 = (reverse ? n3.findLinksOutOf().first() : n3.findLinksInto().first());
      if (reverse)
        test.assert(l3 !== null && l3.fromNode === n3 && l3.toNode === n1, "should have link from n3 to n1");
      else
        test.assert(l3 !== null && l3.fromNode === n1 && l3.toNode === n3, "should have link from n1 to n3");
      var l4 = n4.linksConnected.first();
      if (reverse)
        test.assert(l4 !== null && l4.fromNode === n4 && l4.toNode === n3, "should have link from n4 to n3");
      else
        test.assert(l4 !== null && l4.fromNode === n3 && l4.toNode === n4, "should have link from n3 to n4");
      test.assert(n1.findTreeParentLink() === null && n1.findTreeParentNode() === null, "n1 should have no parent");
      test.assert(n2.findTreeParentLink() === l2 && n2.findTreeParentNode() === n1, "n2 should have parent n1");
      test.assert(n3.findTreeParentLink() === l3 && n3.findTreeParentNode() === n1, "n3 should have parent n1");
      test.assert(n4.findTreeParentLink() === l4 && n4.findTreeParentNode() === n3, "n4 should have parent n3");
      test.assert(n1.findTreeChildrenLinks().count === 2 && n1.findTreeChildrenNodes().count === 2, "n1 should have two children");
      test.assert(n2.findTreeChildrenLinks().count === 0 && n2.findTreeChildrenNodes().count === 0, "n2 should have no children");
      test.assert(n3.findTreeChildrenLinks().count === 1 && n3.findTreeChildrenNodes().count === 1, "n3 should have one child");
      test.assert(n3.findTreeChildrenLinks().first() === l4 && n3.findTreeChildrenNodes().first() === n4, "n3 should have one child");
      test.assert(n4.findTreeChildrenLinks().count === 0 && n4.findTreeChildrenNodes().count === 0, "n4 should have no children");
      test.assert(n4.findTreeChildrenLinks().first() === null && n4.findTreeChildrenNodes().first() === null, "n4 should have no children");
      test.assert(!n1.isTreeLeaf, "n1 is not a leaf");
      test.assert(n2.isTreeLeaf, "n2 is a leaf");
      test.assert(!n3.isTreeLeaf, "n3 is not a leaf");
      test.assert(n4.isTreeLeaf, "n4 is a leaf");
      test.assert(n1.isTreeRoot, "n1 is not a root");
      test.assert(!n2.isTreeRoot, "n2 is a root");
      test.assert(!n3.isTreeRoot, "n3 is a root");
      test.assert(!n4.isTreeRoot, "n4 is a root");
      test.assert(n1.findTreeRoot() === n1, "n1 should be tree root");
      test.assert(n2.findTreeRoot() === n1, "n1 should be tree root of n2");
      test.assert(n3.findTreeRoot() === n1, "n1 should be tree root of n3");
      test.assert(n4.findTreeRoot() === n1, "n1 should be tree root of n4");
      test.assert(d.findTreeRoots().count === 1 && d.findTreeRoots().first() === n1, "diagram should have one root: n1");
      test.assert(n1.findTreeLevel() === 0, "n1 should be level 0");
      test.assert(n2.findTreeLevel() === 1 && n3.findTreeLevel() === 1, "n2 and n3 should be level 1");
      test.assert(n4.findTreeLevel() === 2, "n4 should be level 2");
    }

    function CommonCheckGLMTreeReverse(test) { CommonCheckGLMTree(test, true); }

  fd = new TestCollection("Tree");
  glmtests.add(fd);

  fd.add(new Test('toChildren', myDiagram, CommonSetupGLMTree,
    null,
    CommonCheckGLMTree
  ));

  fd.add(new Test('toParent', myDiagram, CommonSetupGLMTreeReverse,
    null,
    CommonCheckGLMTreeReverse
  ));


  fd = new TestCollection('Groups');
  glmtests.add(fd);

  fd.add(new Test('simple group', myDiagram, CommonSetupSubGraph,
    null,
    CommonCheckSubGraph
  ));

  fd.add(new Test('simple group reverse', myDiagram, CommonSetupSubGraphReverse,
    null,
    CommonCheckSubGraph
  ));

  fd.add(new Test('simple group add node', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({ key: 4, text: "n4", group: -1 });
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n4 = d.findNodeForKey(4);
      var g1 = d.findNodeForKey(-1);

      test.assert(n4 !== null && n4.containingGroup === g1 && n4.isMemberOf(g1), 'node 4 should be a member of group');
      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(g1 !== null && mems.contains(n4), 'node 4 should be in Group.memberParts');
    }
  ));

  fd.add(new Test('simple group add node undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({ key: 4, text: "n4", group: -1 });
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('simple group removeNodeData', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var d2 = m.findNodeDataForKey(2);
      test.numLayouts = test.diagram.findNodeForKey(-1).layout.numLayouts;

      m.startTransaction(test.name);
      m.removeNodeData(d2); // this does not produce cascading deletes, so links should remain partly unresolved
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var m = d.model;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      test.assert(d.findNodeForKey(-1).layout.numLayouts == test.numLayouts + 1, "didn't do another layout after Model.removeNodeData " + test.numLayouts + " " + d.findNodeForKey(-1).layout.numLayouts);

      test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group');
      test.assert(n2 === null, 'node 2 should not exist');
      test.assert(n3 !== null && n3.containingGroup === null && !n3.isMemberOf(g1), 'node 3 should not be a member of group');
      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(g1 !== null && mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      test.assert(m.linkDataArray.length === 2 && d.links.count === 2, "should still have both link data in model");
      test.assert(m.linkDataArray[0].to === 2 && m.linkDataArray[1].from === 2, "link data should still refer to node/key 2");
      var lit = n1.linksConnected;
      var link = lit.first();
      test.assert(link !== null && link.toNode.data.key === 2, 'node 1 should have still have a link, linking with node 2');
      lit = n3.linksConnected;
      link = lit.first();
      test.assert(link !== null && link.fromNode.data.key === 2, 'node 3 should have still have a link, linking with node 2');
      }
  ));

  fd.add(new Test('simple group removeNodeData removeLinkData', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var d2 = m.findNodeDataForKey(2);
      test.numLayouts = test.diagram.findNodeForKey(-1).layout.numLayouts;

      m.startTransaction(test.name);
      m.removeNodeData(d2); // this does not produce cascading deletes, so need to remove links manually
      m.removeLinkData(m.linkDataArray[1]);
      m.removeLinkData(m.linkDataArray[0]);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      test.assert(d.findNodeForKey(-1).layout.numLayouts == test.numLayouts + 1, "didn't do another layout after Model.removeNodeData " + test.numLayouts + " " + d.findNodeForKey(-1).layout.numLayouts);

      test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group');
      test.assert(n2 === null, 'node 2 should not exist');
      test.assert(n3 !== null && n3.containingGroup === null && !n3.isMemberOf(g1), 'node 3 should not be a member of group');
      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(g1 !== null && mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      var lit = n1.linksConnected;
      test.assert(!lit.next() && d.links.count === 0, 'node 1 should have no link');
    }
  ));

  fd.add(new Test('simple group remove node', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var n2 = test.diagram.findNodeForKey(2);
      //NOT: var d2 = m.findNodeDataForKey(2);
      test.numLayouts = test.diagram.findNodeForKey(-1).layout.numLayouts;

      m.startTransaction(test.name);
      test.diagram.remove(n2);
      //NOT: m.removeNodeData(d2); because this does not produce cascading deletes
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      test.assert(d.findNodeForKey(-1).layout.numLayouts == test.numLayouts + 1, "didn't do another layout after Model.removeNodeData " + test.numLayouts + " " + d.findNodeForKey(-1).layout.numLayouts);

      test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group');
      test.assert(n2 === null, 'node 2 should not exist');
      test.assert(n3 !== null && n3.containingGroup === null && !n3.isMemberOf(g1), 'node 3 should not be a member of group');
      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(g1 !== null && mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      var lit = n1.linksConnected;
      test.assert(!lit.next() && d.links.count === 0, 'node 1 should have no link');
    }
  ));

  fd.add(new Test('simple group remove node undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var d2 = m.findNodeDataForKey(2);

      m.startTransaction(test.name);
      m.removeNodeData(d2);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('reparent node', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var d2 = m.findNodeDataForKey(2);

      m.startTransaction(test.name);
      m.setGroupKeyForNodeData(d2, undefined);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var g1 = d.findNodeForKey(-1);
      test.assert(n2.containingGroup === null && n2.isTopLevel, 'node 2 should be toplevel');

      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(!mems.contains(n2), 'node 2 should not be in Group.memberParts');

      var lit = n1.linksConnected;
      test.assert(lit.next(), 'node 1 should have a link');
      var link = lit.value;
      test.assert(link !== null, 'node 1 should have at least one link');
      test.assert(link.containingGroup === null && !link.isMemberOf(g1), 'link 1-2 should be not a member of group');
      test.assert(!mems.contains(link), 'link should not be in Group.memberParts');
    }
  ));

  fd.add(new Test('reparent node undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      var d2 = m.findNodeDataForKey(2);

      m.startTransaction(test.name);
      m.setGroupKeyForNodeData(d2, undefined);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('reconnect link', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, 3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(mems.contains(n2), 'node 2 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      test.assert(d.model.linkDataArray.length === 2, 'model should have two links');
      test.assert(d.links.count === 2, 'diagram should have two links');

      var lit = n1.linksConnected;
      test.assert(lit.next(), 'node 1 should have a link');
      var link = lit.value;
      test.assert(link !== null, 'node 1 should have at least one link');
      test.assert(link.containingGroup === null && !link.isMemberOf(g1), 'link 1-3 should be not a member of group');
      test.assert(!mems.contains(link), 'link should not be in Group.memberParts');
    }
  ));

  fd.add(new Test('reconnect link undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, 3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('connect to container', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setToKeyForLinkData(linkdata, -1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(mems.contains(n2), 'node 2 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      test.assert(d.model.linkDataArray.length === 2, 'model should have two links');
      test.assert(d.links.count === 2, 'diagram should have two links');

      var lit = g1.linksConnected;
      test.assert(lit.next(), 'group G should have a link');
      var link = lit.value;
      test.assert(link !== null, 'group G should have at least one link');
      test.assert(link.containingGroup === g1 && link.isMemberOf(g1), 'link 1-G should be a member of group G');
      test.assert(mems.contains(link), 'link should be in Group.memberParts');
    }
  ));

  fd.add(new Test('connect from container', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var linkdata = m.linkDataArray[0];
      m.setFromKeyForLinkData(linkdata, -1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);

      var mems = new go.Set(/*go.Part*/);
      mems.addAll(g1.memberParts);
      test.assert(mems.contains(n1), 'node 1 should be in Group.memberParts');
      test.assert(mems.contains(n2), 'node 2 should be in Group.memberParts');
      test.assert(!mems.contains(n3), 'node 3 should not be in Group.memberParts');

      test.assert(d.model.linkDataArray.length === 2, 'model should have two links');
      test.assert(d.links.count === 2, 'diagram should have two links');

      var lit = g1.linksConnected;
      test.assert(lit.next(), 'group G should have a link');
      var link = lit.value;
      test.assert(link !== null, 'group G should have at least one link');
      test.assert(link.containingGroup === g1 && link.isMemberOf(g1), 'link 1-G should be a member of group G');
      test.assert(mems.contains(link), 'link should be in Group.memberParts');
    }
  ));

  fd.add(new Test('make group', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      var sg1 = m.findNodeDataForKey(-1);
      m.setGroupKeyForNodeData(sg1, -2);
      m.addLinkData({ from: 3, to: 3 });
      m.addLinkData({ from: 3, to: -2 });
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckTwoSubGraphs
  ));

  fd.add(new Test('make group undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      var sg1 = m.findNodeDataForKey(-1);
      m.setGroupKeyForNodeData(sg1, -2);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('make group delete', myDiagram,
    function(test) {
      CommonSetupSubGraph(test);
      var m = test.diagram.model;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      var sg1 = m.findNodeDataForKey(-1);
      m.setGroupKeyForNodeData(sg1, -2);
      m.commitTransaction(test.name);
    },
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var g1 = test.diagram.findNodeForKey(-1);
      test.diagram.remove(g1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);
      var g2 = d.findNodeForKey(-2);

      test.assert(n1 === null && n2 === null && g1 === null, 'should have deleted group 1 and its members');
      test.assert(n3 !== null && g2 !== null, 'should have kept group 2 and independent node 3');
      test.assert(n3.isMemberOf(g2) && n3.containingGroup === g2, 'node 3 should be in group 2');

      var mems2 = new go.Set(/*go.Part*/);
      mems2.addAll(g2.memberParts);
      test.assert(mems2.count === 1 && mems2.contains(n3), 'node 3 should be only member of group 2');
    }
  ));

  fd.add(new Test('make group delete undo', myDiagram,
    function(test) {
      CommonSetupSubGraph(test);
      var m = test.diagram.model;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      var sg1 = m.findNodeDataForKey(-1);
      m.setGroupKeyForNodeData(sg1, -2);
      m.addLinkData({ from: 3, to: 3 });
      m.addLinkData({ from: 3, to: -2 });
      m.commitTransaction(test.name);
    },
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var g1 = test.diagram.findNodeForKey(-1);
      test.diagram.remove(g1);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTwoSubGraphs
  ));

  function assertSameSets(test, a, b, msg) {
    var seta = (a instanceof go.Set) ? a : null;
    if (Array.isArray(a)) {
      seta = new go.Set();
      a.forEach(function(x) { seta.add(x); });
    } else if (a instanceof go.List) {
      seta = a.toSet();
    } else if (a.iterator) {
      seta = new go.Set(a);
    }
    var setb = (b instanceof go.Set) ? b : null;
    if (Array.isArray(b)) {
      setb = new go.Set();
      b.forEach(function(x) { setb.add(x); });
    } else if (b instanceof go.List) {
      setb = b.toSet();
    } else if (b.iterator) {
      setb = new go.Set(b);
    }
    msg += "\n  got: " + seta.toArray().map(function(p) { return p.key; }).join(",");
    msg += "\n  expected: " + setb.toArray().map(function(p) { return p.key; }).join(",");
    test.assert(seta && setb && seta.count === setb.count && seta.containsAll(setb), msg);
  }

  function partsFromKeys(arrayOfKeys, diagram) {
    var set = new go.Set();
    arrayOfKeys.forEach(function(k) { set.add(diagram.findPartForKey(k)); });
    return set;
  }

  fd.add(new Test('reparent group', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d2 = m.findNodeDataForKey(2);
      m.setGroupKeyForNodeData(d2, -2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      m.commitTransaction(test.name);

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([-1, -2], test.diagram, "should have two top-level groups"));
      mgr.undo();
      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([-1], test.diagram, "should have just one original top-level group"));
      mgr.redo();
      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([-1, -2], test.diagram, "should have two top-level groups"));
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);
      var g2 = d.findNodeForKey(-2);

      var mems1 = new go.Set(/*go.Part*/);
      mems1.addAll(g1.memberParts);
      test.assert(mems1.contains(n1), 'node 1 should be in Group 1 memberParts');
      test.assert(!mems1.contains(n2), 'node 2 should not be in Group 1 memberParts');
      test.assert(!mems1.contains(n3), 'node 3 should not be in Group 1 memberParts');

      var mems2 = new go.Set(/*go.Part*/);
      mems2.addAll(g2.memberParts);
      test.assert(!mems2.contains(n1), 'node 1 should not be in Group 2 memberParts');
      test.assert(mems2.contains(n2), 'node 2 should not be in Group 2 memberParts');
      test.assert(mems2.contains(n3), 'node 3 should be in Group 2 memberParts');

      test.assert(n1 !== null && n1.containingGroup === g1 && n1.findTopLevelPart() === g1 && n1.isMemberOf(g1) && !n1.isMemberOf(g2), 'node 1 should be a member of group 1');
      test.assert(n2 !== null && n2.containingGroup === g2 && n2.findTopLevelPart() === g2 && !n2.isMemberOf(g1) && n2.isMemberOf(g2), 'node 2 should not be a member of group 2 (but of group 2)');
      test.assert(n3 !== null && n3.containingGroup === g2 && n3.findTopLevelPart() === g2 && !n3.isMemberOf(g1) && n3.isMemberOf(g2), 'node 3 should not be a member of group 1 (but of group 2)');

      var lit = n1.linksConnected;
      test.assert(lit.next(), 'node 1 should have a link going out');
      var link1 = lit.value;
      test.assert(link1 !== null, 'node 1 should have at least one link');
      test.assert(link1.containingGroup === null && !link1.isMemberOf(g1), 'link 1-2 should be top-level');
      test.assert(!mems1.contains(link1), 'link 1 should not be in Group 1 memberParts');
      test.assert(link1.findTopLevelPart() === link1 && !link1.isMemberOf(g2), 'link 1 should be inside group 2');

      lit = n2.findLinksOutOf();
      test.assert(lit.next(), 'node 2 should have a link going out');
      var link2 = lit.value;
      test.assert(link2 !== null, 'node 2 should have at least one link going out');
      test.assert(link2.containingGroup === g2 && link2.isMemberOf(g2), 'link 2-3 should be a member of group 2');
      test.assert(mems2.contains(link2), 'link 2 should be in Group 2 memberParts');
      test.assert(link2.findTopLevelPart() === g2 && link2.isMemberOf(g2), 'link 2 should be inside group 2');
    }
  ));

  fd.add(new Test('reparent group undo', myDiagram, CommonSetupSubGraph,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var sg2 = { key: -2, text: "g2", isGroup: true };
      m.addNodeData(sg2);
      var d2 = m.findNodeDataForKey(2);
      m.setGroupKeyForNodeData(d2, -2);
      var d3 = m.findNodeDataForKey(3);
      m.setGroupKeyForNodeData(d3, -2);
      m.commitTransaction(test.name);

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([-1, -2], test.diagram, "should have two top-level groups"));
      mgr.undo();
      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([-1], test.diagram, "should have just one top-level group"));
    },
    CommonCheckSubGraph
  ));

  fd.add(new Test('collapsed group default layout', myDiagram,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location").makeTwoWay(),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          { isSubGraphExpanded: false },
          new go.Binding("location").makeTwoWay(),
          $(go.TextBlock,
            { font: "bold 16pt sans-serif" },
            new go.Binding("text")),
          $(go.Placeholder, { padding: 5, background: "lightgray" })
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, text: "n1", location: new go.Point(0, 0) },
          { key: 2, text: "n2", group: 11 },  // no location for member nodes in collapsed group!
          { key: 3, text: "n3", group: 11 },
          { key: 11, text: "g1", isGroup: true, location: new go.Point(200, 200) }
        ]
      );
    },
    function(test) {
      var group = test.diagram.findNodeForKey(11);
      test.diagram.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diagram = test.diagram;
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      test.assert(n2.location.isReal() && n2.location.x >= 200 && n2.location.y >= 200, "n2 isn't near where collapsed group g1 was " + n2.location);
      test.assert(n3.location.isReal() && n3.location.x >= 200 && n3.location.y >= 200, "n3 isn't near where collapsed group g1 was " + n3.location);
    }
  ));

  fd.add(new Test('collapsed group default layout add node', myDiagram,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location").makeTwoWay(),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          new go.Binding("isSubGraphExpanded").makeTwoWay(),
          new go.Binding("location").makeTwoWay(),
          $(go.TextBlock,
            { font: "bold 16pt sans-serif" },
            new go.Binding("text")),
          $(go.Placeholder, { padding: 5, background: "lightgray" })
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, text: "n1", location: new go.Point(0, 0) },
          { key: 2, text: "n2", group: 11 },  // no location for member nodes in collapsed group!
          { key: 3, text: "n3", group: 11 },
          { key: 11, text: "g1", isGroup: true, location: new go.Point(200, 200) }
        ]
      );
    },
    function(test) {
      var group = test.diagram.findNodeForKey(11);
      test.diagram.commandHandler.collapseSubGraph(group);

      // see if adding a new member node will get it positioned reasonably within the group after expansion
      test.diagram.startTransaction();
      test.diagram.model.addNodeData({ key: 4, text: "n4", group: 11 });  // again, no location
      test.diagram.commitTransaction();

      test.diagram.commandHandler.expandSubGraph(group);
    },
    function(test) {
      var diagram = test.diagram;
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);
      var n4 = diagram.findNodeForKey(4);
      test.assert(n2.location.isReal() && n2.location.x >= 200 && n2.location.y >= 200, "n2 isn't near where collapsed group g1 was " + n2.location);
      test.assert(n3.location.isReal() && n3.location.x >= 200 && n3.location.y >= 200, "n3 isn't near where collapsed group g1 was " + n3.location);
      test.assert(n4.location.isReal() && n4.location.distanceSquaredPoint(n2.location) < 16, "n4 isn't near where n2 is " + n4.location);
    }
  ));

  fd.add(new Test("reparenting groups", myDiagram,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, isGroup: true },
          { key: 2, isGroup: true, group: 1 },
          { key: 3, isGroup: true, group: 1 },
          { key: 4, isGroup: true, group: 2 },
          { key: 5, isGroup: true, group: 2 },
          { key: 6, isGroup: true, group: 3 },
          { key: 7, isGroup: true },
        ]);

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 7], diag), "should have two top-level groups");
    },
    function(test) {
      var diag = test.diagram;
      diag.commit(function(diag) {
        diag.commandHandler.addTopLevelParts(new go.List().add(diag.findNodeForKey(4)));
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 7, 4], diag), "wrong top-level groups");

      diag.commit(function(diag) {
        var seven = diag.findNodeForKey(7);
        seven.containingGroup = diag.findNodeForKey(3);
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 4], diag), "wrong top-level groups");

      diag.commit(function(diag) {
        var two = diag.findNodeForKey(2);
        two.containingGroup = null;
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 2, 4], diag), "wrong top-level groups");

      diag.commit(function(diag) {
        var two = diag.findNodeForKey(2);
        var four = diag.findNodeForKey(4);
        two.addMembers(new go.List().add(four));
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 2], diag), "wrong top-level groups");

      diag.commit(function(diag) {
        var two = diag.findNodeForKey(2);
        var four = diag.findNodeForKey(4);
        two.addMembers(new go.List().add(four));
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 2], diag), "wrong top-level groups");

      diag.commit(function(diag) {
        var one = diag.findNodeForKey(1);
        var four = diag.findNodeForKey(4);
        var five = diag.findNodeForKey(5);
        one.addMembers(new go.List().add(four).add(five));
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 2], diag), "wrong top-level groups");
    },
    function(test) {
      var diag = test.diagram;
      diag.model.commit(function(m) {
        var two = m.findNodeDataForKey(2);
        var four = m.findNodeDataForKey(4);
        var five = m.findNodeDataForKey(5);
        m.set(two, "group", 1);
        m.set(four, "group", 2);
        m.set(five, "group", 2);
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1], diag), "wrong top-level groups");
      assertSameSets(test, test.diagram.findNodeForKey(1).memberParts, partsFromKeys([2, 3], diag), "wrong members");
      assertSameSets(test, test.diagram.findNodeForKey(2).memberParts, partsFromKeys([4, 5], diag), "wrong members");

      diag.model.commit(function(m) {
        var three = m.findNodeDataForKey(3);
        m.set(three, "group", undefined);
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 3], diag), "wrong top-level groups");

      diag.model.commit(function(m) {
        var two = m.findNodeDataForKey(2);
        var three = m.findNodeDataForKey(3);
        m.set(three, "group", 2);
        m.set(two, "group", undefined);
      });

      assertSameSets(test, test.diagram.findTopLevelGroups(), partsFromKeys([1, 2], diag), "wrong top-level groups");
    }
  ));


  fd = new TestCollection('Arrays');
  glmtests.add(fd);

  fd.add(new Test('replace linkDataArray', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.linkDataArray = [
        {from: 2, to: 1},
        {from: 3, to: 1},
        {from: 3, to: 3},
        {from: 3, to: -2}
      ];
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);
      var g1 = d.findNodeForKey(-1);
      var g2 = d.findNodeForKey(-2);

      test.assert(n1 !== null && n1.containingGroup === g1 && n1.isMemberOf(g1), 'node 1 should be a member of group 1');
      test.assert(n2 !== null && n2.containingGroup === g1 && n2.isMemberOf(g1), 'node 2 should be a member of group 1');
      test.assert(n3 !== null && n3.containingGroup === g2 && !n3.isMemberOf(g1), 'node 3 should not be a member of group 1 (but of group 2)');
      var mems1 = new go.Set(/*go.Part*/);
      mems1.addAll(g1.memberParts);
      test.assert(mems1.contains(n1), 'node 1 should be in Group 1 memberParts');
      test.assert(mems1.contains(n2), 'node 2 should be in Group 1 memberParts');
      test.assert(!mems1.contains(n3), 'node 3 should not be in Group 1 memberParts');

      var lit = n1.linksConnected;
      test.assert(lit.count === 2, 'node 1 should have two links');
      lit = n1.findLinksInto();
      test.assert(lit.count === 2, 'node 1 should have both links coming in');
      lit.next();
      var link1 = lit.value;
      test.assert(link1 !== null, 'node 1 should have at least one link in');
      test.assert(link1.containingGroup === g1 && link1.isMemberOf(g1), 'link 2-1 should be a member of group 1');
      test.assert(mems1.contains(link1), 'link 2-1 should be in Group 1 memberParts');

      var mems2 = new go.Set(/*go.Part*/);
      mems2.addAll(g2.memberParts);
      test.assert(!mems2.contains(n1), 'node 1 should not be in Group 2 memberParts');
      test.assert(!mems2.contains(n2), 'node 2 should not be in Group 2 memberParts');
      test.assert(mems2.contains(n3), 'node 3 should be in Group 2 memberParts');

      lit = n3.findLinksOutOf();
      test.assert(lit.count === 3, 'node 3 should have three links going out');
      lit.next();
      var link2 = lit.value;
      test.assert(link2 !== null, 'node 3 should have at least one link going out');
      test.assert(link2.containingGroup === g2 && link2.isMemberOf(g2), 'link 3-1 should be a member of group 2');
      test.assert(mems2.contains(link2), 'link 3-1 should be in Group 2 memberParts');

      test.assert(n1.findTopLevelPart() === g2 && n1.isMemberOf(g2), 'node 1 should be inside group 2');
      test.assert(n2.findTopLevelPart() === g2 && n2.isMemberOf(g2), 'node 2 should be inside group 2');
      test.assert(n3.findTopLevelPart() === g2 && n3.isMemberOf(g2), 'node 3 should be inside group 2');
      test.assert(link1.findTopLevelPart() === g2 && link1.isMemberOf(g2), 'link 1 should be inside group 2');
      test.assert(link2.findTopLevelPart() === g2 && link2.isMemberOf(g2), 'link 2 should be inside group 2');
    }
  ));

  fd.add(new Test('replace linkDataArray undo', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.linkDataArray = [
        {from: 2, to: 1},
        {from: 3, to: 1}
      ];
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTwoSubGraphs
  ));

  fd.add(new Test('replace nodeDataArray', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.nodeDataArray = [
        {key: -2, text: "g2", isGroup: true},
        {key: -1, text: "g1", isGroup: true, group: -2},
        {key: 1, text: "n1", group: -1},
        {key: 2, text: "n2", group: -1},
        {key: 3, text: "n3", group: -2}
      ];
      m.linkDataArray = [
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 3, to: 3},
        {from: 3, to: -2}
      ];
      var layout = new go.ForceDirectedLayout();
      layout.doLayout(test.diagram);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckTwoSubGraphs
  ));

  fd.add(new Test('replace nodeDataArray undo', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.nodeDataArray = [
        {key: -2, text: "g2", isGroup: true},
        {key: -1, text: "g1", isGroup: true, group: -2},
        {key: 1, text: "n1", group: -1},
        {key: 2, text: "n2", group: -1},
        {key: 3, text: "n3", group: -2}
      ];
      m.linkDataArray = [
        {from: 1, to: 2},
        {from: 2, to: 3}
      ];
      var layout = new go.ForceDirectedLayout();
      layout.doLayout(test.diagram);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTwoSubGraphs
  ));

  fd.add(new Test('replace nodeDataArray reverse', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.linkDataArray = [
        {from: 1, to: 2},
        {from: 2, to: 3},
        {from: 3, to: 3},
        {from: 3, to: -2}
      ];
      m.nodeDataArray = [
        {key: -1, text: "g1", isGroup: true, group: -2},
        {key: 1, text: "n1", group: -1},
        {key: -2, text: "g2", isGroup: true},
        {key: 2, text: "n2", group: -1},
        {key: 3, text: "n3", group: -2}
      ];
      var layout = new go.ForceDirectedLayout();
      layout.doLayout(test.diagram);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckTwoSubGraphs
  ));


  fd.add(new Test('change node key', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setKeyForNodeData(d2, 23);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) { CommonCheckTwoSubGraphs(test, { 2: 23 }); }
  ));

  fd.add(new Test('change node key undo', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setKeyForNodeData(d2, 23);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTwoSubGraphs
  ));

  fd.add(new Test('change group key', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var g1 = m.findNodeDataForKey(-1);
      m.setKeyForNodeData(g1, -23);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    function(test) { var alt = {}; alt[-1] = -23; CommonCheckTwoSubGraphs(test, alt); }
  ));

  fd.add(new Test('change group key undo', myDiagram, CommonSetupTwoSubGraphs,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var g1 = m.findNodeDataForKey(-1);
      m.setKeyForNodeData(g1, -23);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTwoSubGraphs
  ));


  fd = new TestCollection('Binding');
  glmtests.add(fd);

  fd.add(new Test('binding', null,
    function(test) {
      var m = new go.GraphLinksModel();
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      var archnode = new go.Node();
      archnode.type = go.Panel.Table;
      var nodesh = new go.Shape();
      nodesh.name = 'NS';
      nodesh.row = 0;
      nodesh.column = 0;
      nodesh.figure = 'Diamond';
      nodesh.fill = 'green';
      nodesh.stretch = go.GraphObject.Fill;
      archnode.add(nodesh);
      var nodet = new go.TextBlock();
      nodet.name = 'TB';
      nodet.row = 1;
      nodet.column = 1;
      nodet.bind(new go.Binding('text', '', go.Binding.toString));
      nodet.bind(new go.Binding('stroke', 'stroke'));
      archnode.add(nodet);
      archnode.getColumnDefinition(0).bind(new go.Binding('width', 'colwidth'));
      archnode.getRowDefinition(0).bind(new go.Binding('height', 'colwidth'));
      archnode.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.nodeTemplate = archnode;

      var archgrp = new go.Group();
      archgrp.type = go.Panel.Vertical;
      var grpt = new go.TextBlock();
      grpt.name = 'TB';  // needed for later checking
      grpt.font = 'bold 16pt sans-serif';
      grpt.bind(new go.Binding('text', '', go.Binding.toString));
      grpt.bind(new go.Binding('stroke', 'stroke'));
      archgrp.add(grpt);
      var archgrpph = new go.Placeholder();
      archgrpph.padding = new go.Margin(5, 5, 5, 5);
      archgrpph.bind(new go.Binding('background', 'background'));
      archgrp.add(archgrpph);
      archgrp.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.groupTemplate = archgrp;

      var archlink = new go.Link();
      archlink.selectionObjectName = 'P';
      var archpath = new go.Shape();
      archpath.isPanelMain = true;
      archpath.name = 'P';
      archpath.bind(new go.Binding('stroke', 'stroke'));
      archlink.add(archpath);
      var archarrow = new go.Shape();
      archarrow.name = 'AH';  // needed for later checking
      archarrow.bind(new go.Binding('stroke', 'stroke'));
      archarrow.bind(new go.Binding('fill', 'fill'));
      archarrow.bind(new go.Binding('toArrow', 'toArrow'));
      archlink.add(archarrow);
      archlink.bind(new go.Binding('toSpot', 'toSpot', go.Spot.parse));
      archlink.bind(new go.Binding('toEndSegmentLength', 'toSegLen'));
      archlink.bind(new go.Binding('curve', 'curve', go.Binding.parseEnum(go.Link, go.Link.None)));
      archlink.bind(new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.Normal)));
      archlink.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.linkTemplate = archlink;

      m.nodeDataArray = [
        {key: -1, text: "g1", isGroup: true,
         stroke: "blue", background: "rgba(0,0,255,.2)" },
        {key: 1, text: "n1", group: -1,
         stroke: "blue", colwidth: 10 },
        {key: -2, text: "g2", group: -1, isGroup: true,
         stroke: "chartreuse", background: "rgba(0,255,0,.4)", deletable: false },
        {key: 2, text: "n2", group: -2,
         stroke: "green", colwidth: 20 },
        {key: 3, text: "n3",
         stroke: "purple", colwidth: 15 }
      ];
      m.linkDataArray = [
        {from: 1, to: 2, toArrow: "OpenTriangle",
         deletable: false },
        {from: 2, to: 3,
         stroke: "blue", fill: "cyan", toArrow: "Triangle",
         toSpot: "MiddleLeft", toSegLen: 20, curve: "Bezier" },
        {from: 3, to: 3,
         stroke: "green", fill: "cyan", toArrow: "Standard",
         toSpot: "MiddleLeft", toSegLen: 20, routing: "Orthogonal" }
      ];
      test.diagram.model = m;

      var layout = new go.ForceDirectedLayout();
      layout.setsPortSpots = false;
      layout.doLayout(test.diagram);
    },
    null,
    function(test) {
      var it;
      var n1 = test.diagram.findNodeForKey(1);
      var n1tb = n1.findObject('TB');
      var n1ns = n1.findObject('NS');
      test.assert(n1tb instanceof go.TextBlock && n1tb.text === 'n1' && n1tb.stroke === 'blue',
                  'node 1 TextBlock should have text=n1 and stroke=blue');
      test.assert(n1ns instanceof go.Shape && n1ns.actualBounds.width === 10 && n1ns.actualBounds.height === 10,
                  'node 1 Shape is not size 10x10');

      var n2 = test.diagram.findNodeForKey(2);
      var n2tb = n2.findObject('TB');
      var n2ns = n2.findObject('NS');
      test.assert(n2tb instanceof go.TextBlock && n2tb.text === 'n2' && n2tb.stroke === 'green',
                  'node 2 TextBlock should have text=n2 and stroke=green');
      test.assert(n2ns instanceof go.Shape && n2ns.actualBounds.width === 20 && n2ns.actualBounds.height === 20,
                  'node 2 Shape is not size 20x20');

      var n3 = test.diagram.findNodeForKey(3);
      var n3tb = n3.findObject('TB');
      var n3ns = n3.findObject('NS');
      test.assert(n3tb instanceof go.TextBlock && n3tb.text === 'n3' && n3tb.stroke === 'purple',
                  'node 3 TextBlock should have text=n3 and stroke=blue');
      test.assert(n3ns instanceof go.Shape && n3ns.actualBounds.width === 15 && n3ns.actualBounds.height === 15,
                  'node 3 Shape is not size 15x15');

      var g1 = test.diagram.findNodeForKey(-1);
      test.assert(g1 !== null && g1.deletable, 'group 1 should be present and deletable');
      it = g1.elements; it.next();
      var g1tb = it.value;
      test.assert(g1tb instanceof go.TextBlock && g1tb.text === 'g1' && g1tb.stroke === 'blue',
                  'group 1 TextBlock should have text=g1 and stroke=blue');

      var g2 = test.diagram.findNodeForKey(-2);
      test.assert(g2 !== null && !g2.deletable, 'group 2 should be present but not deletable');
      it = g2.elements; it.next();
      var g2tb = it.value;
      test.assert(g2tb instanceof go.TextBlock && g2tb.text === 'g2' && g2tb.stroke === 'chartreuse',
                  'group 2 TextBlock should have text=g2 and stroke=chartreuse');

      it = n1.findLinksOutOf(); it.next();
      var l1 = it.value;
      test.assert(l1 instanceof go.Link && !l1.deletable, 'link 1-2 should not be deletable');
      test.assert(l1.toSpot.equals(go.Spot.Default), 'wrong default toSpot value for link 1-2');
      test.assert(isNaN(l1.toEndSegmentLength), 'wrong default toEndSegmentLength value for link 1-2');
      test.assert(l1.curve === go.Link.None, 'wrong default curve value for link 1-2');
      test.assert(l1.routing === go.Link.Normal, 'wrong default routing value for link 1-2');
      var l1ah = l1.findObject('AH');
      test.assert(l1ah !== null && l1ah.toArrow === 'OpenTriangle', 'wrong toArrow for link 1-2 arrowhead');
      test.assert(l1ah.stroke === 'black' && l1ah.fill === 'black', 'wrong default value for link 1-2 arrowhead');

      it = n2.findLinksOutOf(); it.next();
      var l2 = it.value;
      test.assert(l2.toSpot.equals(go.Spot.Left), 'wrong toSpot value for link 2-3');
      test.assert(l2.toEndSegmentLength === 20, 'wrong toEndSegmentLength value for link 2-3');
      test.assert(l2.curve === go.Link.Bezier, 'wrong curve value for link 2-3');
      test.assert(l2.routing === go.Link.Normal, 'wrong default routing value for link 2-3');
      var l2ah = l2.findObject('AH');
      test.assert(l2ah !== null && l2ah.toArrow === 'Triangle', 'wrong toArrow for link 2-3 arrowhead');
      test.assert(l2ah.stroke === 'blue' && l2ah.fill === 'cyan', 'wrong brush values for link 2-3 arrowhead');

      it = n3.findLinksOutOf(); it.next();
      var l3 = it.value;
      test.assert(l3.toSpot.equals(go.Spot.Left), 'wrong toSpot value for link 3-3');
      test.assert(l3.toEndSegmentLength === 20, 'wrong toEndSegmentLength value for link 3-3');
      test.assert(l3.curve === go.Link.None, 'wrong default curve value for link 3-3');
      test.assert(l3.routing === go.Link.Orthogonal, 'wrong routing value for link 3-3');
      var l3ah = l3.findObject('AH');
      test.assert(l3ah !== null && l3ah.toArrow === 'Standard', 'wrong toArrow for link 3-3 arrowhead');
      test.assert(l3ah.stroke === 'green' && l3ah.fill === 'cyan', 'wrong brush values for link 3-3 arrowhead');
    }
  ));

  fd.add(new Test('binding alternate', null,
    function(test) {
      var m = new go.GraphLinksModel();
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      var archnode = new go.Node();
      archnode.type = go.Panel.Table;
      var nodesh = new go.Shape();
      nodesh.name = 'NS';
      nodesh.row = 0;
      nodesh.column = 0;
      nodesh.figure = 'Diamond';
      nodesh.fill = 'green';
      nodesh.stretch = go.GraphObject.Fill;
      archnode.add(nodesh);
      var nodet = new go.TextBlock();
      nodet.name = 'TB';  // needed for later checking
      nodet.row = 1;
      nodet.column = 1;
      nodet.bind(new go.Binding('text', '', go.Binding.toString));
      nodet.bind(new go.Binding('stroke', 'stroke'));
      archnode.add(nodet);
      archnode.getColumnDefinition(0).bind(new go.Binding('width', 'colwidth'));
      archnode.getRowDefinition(0).bind(new go.Binding('height', 'colwidth'));
      archnode.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.nodeTemplate = archnode;

      var archgrp = new go.Group();
      archgrp.type = go.Panel.Vertical;
      var grpt = new go.TextBlock();
      grpt.name = 'TB';  // needed for later checking
      grpt.font = 'bold 16pt sans-serif';
      grpt.bind(new go.Binding('text', '', go.Binding.toString));
      grpt.bind(new go.Binding('stroke', 'stroke'));
      archgrp.add(grpt);
      var archgrpph = new go.Placeholder();
      archgrpph.padding = new go.Margin(5, 5, 5, 5);
      archgrpph.bind(new go.Binding('background', 'background'));
      archgrp.add(archgrpph);
      archgrp.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.groupTemplate = archgrp;

      var archlink = new go.Link();
      archlink.selectionObjectName = 'P';
      var archpath = new go.Shape();
      archpath.isPanelMain = true;
      archpath.name = 'P';
      archpath.bind(new go.Binding('stroke', 'stroke'));
      archlink.add(archpath);
      var archarrow = new go.Shape();
      archarrow.name = 'AH';  // needed for later checking
      archarrow.bind(new go.Binding('stroke', 'stroke'));
      archarrow.bind(new go.Binding('fill', 'fill'));
      archarrow.bind(new go.Binding('toArrow', 'toArrow'));
      archlink.add(archarrow);
      archlink.bind(new go.Binding('toSpot', 'toSpot', go.Spot.parse));
      archlink.bind(new go.Binding('toEndSegmentLength', 'toSegLen'));
      archlink.bind(new go.Binding('curve', 'curve', go.Binding.parseEnum(go.Link, go.Link.None)));
      archlink.bind(new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.Normal)));
      archlink.bind(new go.Binding('deletable', 'deletable'));
      test.diagram.linkTemplate = archlink;

      m.nodeKeyProperty = function(x) { return x['k']; };
      m.linkFromKeyProperty = 'f';
      m.linkToKeyProperty = 't';
      m.nodeGroupKeyProperty = 'g';
      m.nodeIsGroupProperty = 'isg';
      m.nodeDataArray = [
        {k: -1, text: "g1", isg: true, stroke: "blue", background: "rgba(0,0,255,.2)" },
        {k: 1,  text: "n1", g: -1, stroke: "blue", colwidth: 10 },
        {k: -2, text: "g2", g: -1, isg: true, stroke: "chartreuse", background: "rgba(0,255,0,.4)", deletable: false },
        {k: 2,  text: "n2", g: -2, stroke: "green", colwidth: 20 },
        {k: 3,  text: "n3", stroke: "purple", colwidth: 15 }
      ];
      m.linkDataArray = [
        {f: 1, t: 2, toArrow: "OpenTriangle", deletable: false },
        {f: 2, t: 3, stroke: "blue", fill: "cyan", toArrow: "Triangle", toSpot: "MiddleLeft", toSegLen: 20, curve: "Bezier" },
        {f: 3, t: 3, stroke: "green", fill: "cyan", toArrow: "Standard", toSpot: "MiddleLeft", toSegLen: 20, routing: "Orthogonal" }
      ];
      test.diagram.model = m;

      var layout = new go.ForceDirectedLayout();
      layout.setsPortSpots = false;
      layout.doLayout(test.diagram);
    },
    null,
    function(test) {
      var it;
      var n1 = test.diagram.findNodeForKey(1);
      var n1tb = n1.findObject('TB');
      var n1ns = n1.findObject('NS');
      test.assert(n1tb instanceof go.TextBlock && n1tb.text === 'n1' && n1tb.stroke === 'blue',
                  'node 1 TextBlock should have text=n1 and stroke=blue');
      test.assert(n1ns instanceof go.Shape && n1ns.actualBounds.width === 10 && n1ns.actualBounds.height === 10,
                  'node 1 Shape is not size 10x10');

      var n2 = test.diagram.findNodeForKey(2);
      var n2tb = n2.findObject('TB');
      var n2ns = n2.findObject('NS');
      test.assert(n2tb instanceof go.TextBlock && n2tb.text === 'n2' && n2tb.stroke === 'green',
                  'node 2 TextBlock should have text=n2 and stroke=green');
      test.assert(n2ns instanceof go.Shape && n2ns.actualBounds.width === 20 && n2ns.actualBounds.height === 20,
                  'node 2 Shape is not size 20x20');

      var n3 = test.diagram.findNodeForKey(3);
      var n3tb = n3.findObject('TB');
      var n3ns = n3.findObject('NS');
      test.assert(n3tb instanceof go.TextBlock && n3tb.text === 'n3' && n3tb.stroke === 'purple',
                  'node 3 TextBlock should have text=n3 and stroke=blue');
      test.assert(n3ns instanceof go.Shape && n3ns.actualBounds.width === 15 && n3ns.actualBounds.height === 15,
                  'node 3 Shape is not size 15x15');

      var g1 = test.diagram.findNodeForKey(-1);
      test.assert(g1 !== null && g1.deletable, 'group 1 should be present and deletable');
      it = g1.elements; it.next();
      var g1tb = it.value;
      test.assert(g1tb instanceof go.TextBlock && g1tb.text === 'g1' && g1tb.stroke === 'blue',
                  'group 1 TextBlock should have text=g1 and stroke=blue');

      var g2 = test.diagram.findNodeForKey(-2);
      test.assert(g2 !== null && !g2.deletable, 'group 2 should be present but not deletable');
      it = g2.elements; it.next();
      var g2tb = it.value;
      test.assert(g2tb instanceof go.TextBlock && g2tb.text === 'g2' && g2tb.stroke === 'chartreuse',
                  'group 2 TextBlock should have text=g2 and stroke=chartreuse');

      it = n1.findLinksOutOf(); it.next();
      var l1 = it.value;
      test.assert(l1 instanceof go.Link && !l1.deletable, 'link 1-2 should not be deletable');
      test.assert(l1.toSpot.equals(go.Spot.Default), 'wrong default toSpot value for link 1-2');
      test.assert(isNaN(l1.toEndSegmentLength), 'wrong default toEndSegmentLength value for link 1-2');
      test.assert(l1.curve === go.Link.None, 'wrong default curve value for link 1-2');
      test.assert(l1.routing === go.Link.Normal, 'wrong default routing value for link 1-2');
      var l1ah = l1.findObject('AH');
      test.assert(l1ah !== null && l1ah.toArrow === 'OpenTriangle', 'wrong toArrow for link 1-2 arrowhead');
      test.assert(l1ah.stroke === 'black' && l1ah.fill === 'black', 'wrong default value for link 1-2 arrowhead');

      it = n2.findLinksOutOf(); it.next();
      var l2 = it.value;
      test.assert(l2.toSpot.equals(go.Spot.Left), 'wrong toSpot value for link 2-3');
      test.assert(l2.toEndSegmentLength === 20, 'wrong toEndSegmentLength value for link 2-3');
      test.assert(l2.curve === go.Link.Bezier, 'wrong curve value for link 2-3');
      test.assert(l2.routing === go.Link.Normal, 'wrong default routing value for link 2-3');
      var l2ah = l2.findObject('AH');
      test.assert(l2ah !== null && l2ah.toArrow === 'Triangle', 'wrong toArrow for link 2-3 arrowhead');
      test.assert(l2ah.stroke === 'blue' && l2ah.fill === 'cyan', 'wrong brush values for link 2-3 arrowhead');

      it = n3.findLinksOutOf(); it.next();
      var l3 = it.value;
      test.assert(l3.toSpot.equals(go.Spot.Left), 'wrong toSpot value for link 3-3');
      test.assert(l3.toEndSegmentLength === 20, 'wrong toEndSegmentLength value for link 3-3');
      test.assert(l3.curve === go.Link.None, 'wrong default curve value for link 3-3');
      test.assert(l3.routing === go.Link.Orthogonal, 'wrong routing value for link 3-3');
      var l3ah = l3.findObject('AH');
      test.assert(l3ah !== null && l3ah.toArrow === 'Standard', 'wrong toArrow for link 3-3 arrowhead');
      test.assert(l3ah.stroke === 'green' && l3ah.fill === 'cyan', 'wrong brush values for link 3-3 arrowhead');
    }
  ));

  fd.add(new Test('binding empty string', null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.Shape, { width: 100, height: 50 },
            new go.Binding("fill", "", function(x) { return x.color; }),
            new go.Binding("stroke", "color")),
          $(go.TextBlock,
            { font: "bold 14pt sans-serif" },
            new go.Binding("text", "", function(x) { return x.color; }),
            new go.Binding("background", "color"))
        );
      test.diagram.model.nodeDataArray = [
        { key: 0, color: "green" },
        { key: 1, color: "blue" },
        { key: 2, color: "orange" }
      ];
      test.diagram.model.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var node0 = diagram.findNodeForKey(0);
      test.assert(node0 && node0.elt(0).fill === "green" && node0.elt(0).stroke === "green" && node0.elt(1).text === "green" && node0.elt(1).background === "green",
                  "Initial bindings failed");
      diagram.startTransaction("change color");
      diagram.model.setDataProperty(diagram.model.nodeDataArray[0], "color", "red");
      diagram.model.setDataProperty(diagram.model.nodeDataArray[1], "other", "red");
      diagram.model.nodeDataArray[2].color = "red";
      diagram.model.updateTargetBindings(diagram.model.nodeDataArray[2], "color");
      diagram.commitTransaction("change color");
    },
    function(test) {
      var diagram = test.diagram;
      var node0 = diagram.findNodeForKey(0);
      test.assert(node0 && node0.data.color === "red" && node0.elt(0).fill === "red" && node0.elt(0).stroke === "red" && node0.elt(1).text === "red" && node0.elt(1).background === "red",
                  "Bindings failed");
      var node1 = diagram.findNodeForKey(1);
      test.assert(node1 && node1.data.color === "blue" && node1.elt(0).fill === "blue" && node1.elt(0).stroke === "blue" && node1.elt(1).text === "blue" && node1.elt(1).background === "blue",
                  "Bindings should have remained unchanged");
      test.assert(node1 && node1.data.other === "red", "Changing unbound property should have had no effect");
      var node2 = diagram.findNodeForKey(2);
      test.assert(node2 && node2.data.color === "red" && node2.elt(0).fill === "red" && node2.elt(0).stroke === "red" && node2.elt(1).text === "red" && node2.elt(1).background === "red",
                  "Binding update failed");

      diagram.commandHandler.undo();

      test.assert(node0.data.color === "green" && node1.data.color === "blue" && node2.data.color === "red",
                  "undo should have restored green BUT NOT orange data.color, even though shape/text is orange");
    }
  ));


  function CommonSetupUplevelBindings(test) {
    var d = test.diagram;
    d.reset();
    d.initialContentAlignment = go.Spot.Center;

    d.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("text").makeTwoWay(),  // bind Node.txt with data.text
        $(go.Shape, { fill: "white" }),
        $(go.Panel, "Table",
          { margin: 0.5 },
          $(go.RowColumnDefinition, { row: 0, background: "lightgray" }),
          $(go.TextBlock, { column: 0, margin: new go.Margin(2, 2, 0, 2) },
            new go.Binding("text", "key")),
          $(go.TextBlock, { column: 1, name: "TEXT", stroke: "gray", editable: true },
            new go.Binding("text").ofObject().makeTwoWay()),  // bind TextBlock.text with Node.text
          $("PanelExpanderButton", { column: 2, background: "lightgray", alignment: go.Spot.Right }),
          $(go.Panel, "Table",
            { name: "COLLAPSIBLE", row: 1, columnSpan: 3 },
            new go.Binding("itemArray", "items"),
            {
              itemTemplate:
                $(go.Panel, "TableColumn",
                  $(go.Panel, "Horizontal", { row: 0, stretch: go.GraphObject.Fill },
                    $(go.TextBlock, { column: 0 },
                      new go.Binding("text", "name")),
                    $("PanelExpanderButton", { column: 1 }),
                    $("Button", { column: 2, visible: false },
                      new go.Binding("visible", "isSelected").ofObject("/"),
                      $(go.Shape, "XLine", { width: 15, height: 15 }),
                      {
                        click: function(e, obj) {
                          e.diagram.startTransaction();
                          var itempanel = obj.findBindingPanel();
                          e.diagram.model.removeArrayItem(itempanel.part.data.items, itempanel.column);
                          //if (itempanel.data.details.length > 0) {
                          //  e.diagram.model.removeArrayItem(itempanel.data.details, 0);
                          //}
                          e.diagram.commitTransaction("deleted item");
                        }
                      }
                    ),
                    $(go.TextBlock, { name: "SUBTEXT", editable: true },
                      new go.Binding("text").ofObject("/").makeTwoWay()),  // bind TextBlock.text with Node.text (NOT item.data.text)
                    $(go.TextBlock, { stroke: "green", font: "6pt sans-serif" },
                      new go.Binding("text", "column").ofObject("")),
                    $(go.Shape, "Circle", { column: 3, fill: "orange", width: 20, height: 20 },
                      new go.Binding("figure").ofModel())
                  ),
                  $(go.Panel, "Table", { name: "COLLAPSIBLE", row: 1, alignment: go.Spot.Top },
                    new go.Binding("itemArray", "details"),
                    {
                      itemTemplate:
                        $(go.Panel, "TableRow",
                          $(go.TextBlock, new go.Binding("text", ""),
                            new go.Binding("stroke", "isSelected", function(b) { return b ? "blue" : "black" }).ofObject("/"))
                        )
                    }
                  )
                )
            }
          )
        )
      );

    d.model = go.GraphObject.make(go.GraphLinksModel,
      {
        //modelData: { figure: "Triangle" },  // don't set this, initially
        nodeDataArray: [
          {
            key: "Alpha",
            text: "TXT",
            items: [
              {
                name: "A",
                details: [
                  "alpha",
                  "apple",
                  "active"
                ]
              },
              {
                name: "B",
                details: [
                  "beta",
                  "boat"
                ]
              }
            ]
          },
          {
            key: "Beta",
            text: "TXT",
            items: [
              {
                name: "C",
                details: [
                  "cat",
                  "car",
                  "computer",
                  "cough"
                ]
              }
            ]
          }
        ],
        linkDataArray: [
            { from: "Alpha", to: "Beta" }
        ]
      });
  }

  fd.add(new Test('binding uplevel', null, CommonSetupUplevelBindings,
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      test.assert(n1 !== null && n1.findObject("COLLAPSIBLE").elements.count === 2 && n1.findObject("COLLAPSIBLE").elements.all(function(e) { return (e instanceof go.Panel && e.data !== null); }),
                  "COLLAPSIBLE panel must exist in first node and have two elements that are item panels");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text, "first item panel should be a TableColumn for A");
      test.assert(pan.elt(0).elt(0).elt(2).visible === false, "checking for invisible Button when not selected");
      test.assert(pan.elt(0).elt(0).elt(4).stroke === "green" && pan.elt(0).elt(0).elt(4).text === "0", "checking for green column counter 0");
      test.assert(pan.elt(0).findObject("COLLAPSIBLE") !== pan && pan.elt(0).findObject("COLLAPSIBLE").elements.count === n1.data.items[0].details.length, "wrong number of elements for 0 details");
      test.assert(pan.elt(0).findObject("COLLAPSIBLE").elements.all(function(e) { return e.elt(0) instanceof go.TextBlock && e.elt(0).stroke === "black"; }), "all details text should be black");
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text, "second item panel should be a TableColumn for B");
      test.assert(pan.elt(1).elt(0).elt(2).visible === false, "checking for invisible Button when not selected");
      test.assert(pan.elt(1).elt(0).elt(4).stroke === "green" && pan.elt(1).elt(0).elt(4).text === "1", "checking for green column counter 1");
      test.assert(pan.elt(1).findObject("COLLAPSIBLE") !== pan && pan.elt(1).findObject("COLLAPSIBLE").elements.count === n1.data.items[1].details.length, "wrong number of elements for 1 details");
      test.assert(pan.elt(1).findObject("COLLAPSIBLE").elements.all(function(e) { return e.elt(0) instanceof go.TextBlock && e.elt(0).stroke === "black"; }), "all details text should be black");

      test.node1bounds = n1.actualBounds.copy();  // before selection
      n1.isSelected = true;
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      var newbnds = n1.actualBounds.copy();
      test.assert(newbnds.width > test.node1bounds.width + 2*20, "after selection node 1 should have gotten wider because elements appeared inside item panels due to Binding('visible', 'isSelected').ofObject('/')")
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).elt(0).elt(2).visible === true, "checking for visible Button when selected");
      test.assert(pan.elt(0).findObject("COLLAPSIBLE").elements.all(function(e) { return e.elt(0) instanceof go.TextBlock && e.elt(0).stroke === "blue"; }), "all details text should be blue");
      test.assert(pan.elt(1).elt(0).elt(2).visible === true, "checking for visible Button when selected");
      test.assert(pan.elt(1).findObject("COLLAPSIBLE").elements.all(function(e) { return e.elt(0) instanceof go.TextBlock && e.elt(0).stroke === "blue"; }), "all details text should be blue");
    }
  ));

  fd.add(new Test('binding uplevel 2way Node.text', null, CommonSetupUplevelBindings,
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      n1.isSelected = true;
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);

      d.startTransaction();
      tb.text = "CHANGED";
      d.commitTransaction("modify Node.text");
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);
    }
  ));

  fd.add(new Test('binding uplevel 2way data.text', null, CommonSetupUplevelBindings,
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      n1.isSelected = true;
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);

      d.startTransaction();
      d.model.setDataProperty(n1.data, "text", "DATA");
      d.commitTransaction("modify Node.text");
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);
    }
  ));

  fd.add(new Test('binding uplevel 2way nested text', null, CommonSetupUplevelBindings,
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      n1.isSelected = true;
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);

      d.startTransaction();
      pan.elt(1).findObject("SUBTEXT").text = "SubText";
      d.commitTransaction("modify Node.text");
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey("Alpha");
      var tb = n1.findObject("TEXT");
      test.assert(tb.text === n1.text && n1.text === n1.data.text, "didn't evaluate bindings for text");
      var pan = n1.findObject("COLLAPSIBLE");
      test.assert(pan.elt(0).type === go.Panel.TableColumn && pan.elt(0).data.name === "A" && pan.elt(0).findObject("SUBTEXT").text === n1.text);
      test.assert(pan.elt(1).type === go.Panel.TableColumn && pan.elt(1).data.name === "B" && pan.elt(1).findObject("SUBTEXT").text === n1.text);
    }
  ));

  fd.add(new Test('binding nested modelData', null, CommonSetupUplevelBindings,
    function(test) {
      var d = test.diagram;

      var n1 = d.findNodeForKey("Alpha");
      var pan1 = n1.findObject("COLLAPSIBLE");
      var n2 = d.findNodeForKey("Beta");
      var pan2 = n2.findObject("COLLAPSIBLE");
      test.assert(pan1.elt(0).elt(0).elt(5).fill === "orange", "checking for orange Circle");
      test.assert(pan1.elt(1).elt(0).elt(5).fill === "orange", "checking for orange Circle");
      test.assert(pan2.elt(0).elt(0).elt(5).fill === "orange", "checking for orange Circle");
      test.assert(pan1.elt(0).elt(0).elt(5).figure === "Circle", "checking for orange Circle");
      test.assert(pan1.elt(1).elt(0).elt(5).figure === "Circle", "checking for orange Circle");
      test.assert(pan2.elt(0).elt(0).elt(5).figure === "Circle", "checking for orange Circle");

      var m = d.model;
      m.startTransaction();
      m.setDataProperty(m.modelData, "figure",
                        (m.modelData.figure === "Triangle") ? "Diamond" : "Triangle");
      m.commitTransaction("changed Model.modelData");

      test.assert(pan1.elt(0).elt(0).elt(5).figure === "Triangle", "checking for orange Triangle");
      test.assert(pan1.elt(1).elt(0).elt(5).figure === "Triangle", "checking for orange Triangle");
      test.assert(pan2.elt(0).elt(0).elt(5).figure === "Triangle", "checking for orange Triangle");
    },
    function(test) {
      var d = test.diagram;
      var m = d.model;
      m.startTransaction();
      m.setDataProperty(m.modelData, "figure",
                        (m.modelData.figure === "Triangle") ? "Diamond" : "Triangle");
      m.commitTransaction("changed Model.modelData");

      var n1 = d.findNodeForKey("Alpha");
      var pan1 = n1.findObject("COLLAPSIBLE");
      var n2 = d.findNodeForKey("Beta");
      var pan2 = n2.findObject("COLLAPSIBLE");
      test.assert(pan1.elt(0).elt(0).elt(5).figure === "Diamond", "checking for orange Diamond");
      test.assert(pan1.elt(1).elt(0).elt(5).figure === "Diamond", "checking for orange Diamond");
      test.assert(pan2.elt(0).elt(0).elt(5).figure === "Diamond", "checking for orange Diamond");
    }
  ));

  fd = new TestCollection('JSON');
  glmtests.add(fd);

  function checkDataTypes(test, obj) {
    //size: new go.Size(1, 2),
    const size = obj.size;
    test.assert(size && size instanceof go.Size && size.width === 1 && size.height === 2, "bad serialized Size " + size.toString());
    //rect: new go.Rect(1, 2, 3, 4),
    const rect = obj.rect;
    test.assert(rect && rect instanceof go.Rect && rect.x === 1 && rect.y === 2 && rect.width === 3 && rect.height === 4, "bad serialized Rect " + rect.toString());
    //margin: new go.Margin(1, 2, 3, 4),
    const margin = obj.margin;
    test.assert(margin && margin instanceof go.Margin && margin.top === 1 && margin.right === 2 && margin.bottom === 3 && margin.left === 4, "bad serialization of Margin " + margin.toString());
    //spot1: new go.Spot(0, 1, 2, 3),
    const spot1 = obj.spot1;
    test.assert(spot1 && spot1 instanceof go.Spot && spot1.x === 0 && spot1.y === 1 && spot1.offsetX === 2 && spot1.offsetY === 3, "bad serialized Spot " + spot1.toString());
    //spot2: go.Spot.LeftRightSides,
    const spot2 = obj.spot2;
    test.assert(spot2 && spot2 instanceof go.Spot && spot2.equals(go.Spot.LeftRightSides), "bad serialized Spot " + spot2.toString());
    //spot3: go.Spot.None,
    const spot3 = obj.spot3;
    test.assert(spot3 && spot3 instanceof go.Spot && spot3.equals(go.Spot.None), "bad serialized Spot " + spot3.toString());
    //spot4: go.Spot.Default,
    const spot4 = obj.spot4;
    test.assert(spot4 && spot4 instanceof go.Spot && spot4.equals(go.Spot.Default), "bad serialized Spot " + spot4.toString());
    //date: new Date("Thu Nov 23 2023 09:36:17"),
    const date = obj.date;
    test.assert(date && date instanceof Date && date.getFullYear() === 2023 && date.getMonth() === 10 && date.getDate() === 23 && date.getHours() === 9 && date.getMinutes() === 36 && date.getSeconds() === 17, "bad serialized Date " + date.toString());
    //geo1: new go.Geometry(go.Geometry.Ellipse),
    const geo1 = obj.geo1;
    test.assert(geo1 && geo1 instanceof go.Geometry && geo1.type === go.Geometry.Ellipse, "bad serialized Geometry " + geo1.toString());
    // geo2: new go.Geometry().add(new go.PathFigure(0, 1)
    //   .add(new go.PathSegment(go.SegmentType.Arc, -2/2, 2, 0, 0, 3+4, 3+4))
    //   .add(new go.PathSegment(go.SegmentType.Line, 5, 6))
    //   .add(new go.PathSegment(go.SegmentType.Arc, 2/2, -2, 0, 0, 3, 3).close())),
    const geo2 = obj.geo2;
    test.assert(geo2 && geo2 instanceof go.Geometry && geo2.type === go.Geometry.Path, "bad serialized Geometry " + geo2.toString());
    const fig = geo2.figures.first();
    test.assert(fig && fig.startX === 0 && fig.startY === 1 && fig.segments.count === 3, "bad serialized PathFigure " + fig.toString());
    const seg0 = fig.segments.elt(0);
    test.assert(seg0 && seg0 instanceof go.PathSegment && seg0.type === go.PathSegment.Arc && seg0.startAngle === 359 /*-1*/ && seg0.sweepAngle === 2 && seg0.centerX === 0 && seg0.centerY === 0 && seg0.radiusX === 7 && seg0.radiusY === 7, "bad serialized PathSegment 0 " + seg0.toString());
    const seg1 = fig.segments.elt(1);
    test.assert(seg1 && seg1 instanceof go.PathSegment && seg1.type === go.PathSegment.Line && seg1.endX === 5 && seg1.endY === 6, "bad serialized PathSegment 1 " + seg1.toString());
    const seg2 = fig.segments.elt(2);
    test.assert(seg2 && seg2 instanceof go.PathSegment && seg2.type === go.PathSegment.Arc && seg2.startAngle === 1 && seg2.sweepAngle === -2 && seg2.centerX === 0 && seg2.centerY === 0 && seg2.radiusX === 3 && seg2.radiusY === 3, "bad serialized PathSegment 2 " + seg2.toString());
  }

  fd.add(new Test('data types', null,
    function(test) {
      var $ = go.GraphObject.make;
      var lgrad =
        $(go.Brush, go.Brush.Linear,
          { 0: "white", 1: "black",
            start: go.Spot.TopRight, end: go.Spot.BottomLeft });
      var rgrad =
        $(go.Brush, go.Brush.Radial,
          { 0: "white", 1: "black",
            start: new go.Spot(0.4, 0.4), end: new go.Spot(0.6, 0.6),
            startRadius: 20, endRadius: 150 });
      test.diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("location"),
          $(go.Shape,
            { width: 200, height: 200 },
            new go.Binding("fill"),
            new go.Binding("stroke")),
          $(go.TextBlock,
            new go.Binding("text", "n")));
      test.diagram.model.nodeDataArray = [
        { key: 0, fill: lgrad, stroke: "red", location: new go.Point(0, 0), n: Infinity, text: '-\"-\\-\b-\f-\n-\r-\t-' },
        // ?? used to be the following line, but doesn't work when the file is UTF-8 (does work when it is UTF-8 with BOM or UTF-16):
        //{ key: 1, fill: rgrad, stroke: lgrad, location: new go.Point(250, 10), n: NaN, text: "-\u000b-\u0017-\u2028-\u2029=\u1234=" }
        { key: 1, fill: rgrad, stroke: lgrad, location: new go.Point(250, 10), n: NaN, text: "-\u000b-\u0017-\u2028-\u2029=" },
        {
          key: 2,
          size: new go.Size(1, 2), rect: new go.Rect(1, 2, 3, 4), margin: new go.Margin(1, 2, 3, 4),
          spot1: new go.Spot(0, 1, 2, 3), spot2: go.Spot.LeftRightSides, spot3: go.Spot.None, spot4: go.Spot.Default,
          date: new Date("Thu Nov 23 2023 09:36:17"),
          geo1: new go.Geometry(go.Geometry.Ellipse),
          geo2: new go.Geometry().add(new go.PathFigure(0, 1)
            .add(new go.PathSegment(go.SegmentType.Arc, -2/2, 2, 0, 0, 3+4, 3+4))
            .add(new go.PathSegment(go.SegmentType.Line, 5, 6))
            .add(new go.PathSegment(go.SegmentType.Arc, 2/2, -2, 0, 0, 3, 3).close())),
          data: [
            [],
            { class: "garbage", value: 23 },  // these two Objects should be preserved uninterpreted
            { class: { prop1: 1, prop2: 2 } },
            { size: new go.Size(1, 2), rect: new go.Rect(1, 2, 3, 4), margin: new go.Margin(1, 2, 3, 4),
              spot1: new go.Spot(0, 1, 2, 3), spot2: go.Spot.LeftRightSides, spot3: go.Spot.None, spot4: go.Spot.Default,
              date: new Date("Thu Nov 23 2023 09:36:17"),
              geo1: new go.Geometry(go.Geometry.Ellipse),
              geo2: new go.Geometry().add(new go.PathFigure(0, 1)
                .add(new go.PathSegment(go.SegmentType.Arc, -2/2, 2, 0, 0, 3+4, 3+4))
                .add(new go.PathSegment(go.SegmentType.Line, 5, 6))
                .add(new go.PathSegment(go.SegmentType.Arc, 2/2, -2, 0, 0, 3, 3).close()))
            }
          ]
        }
      ];
      test.diagram.model.modelData.EXTRAnumber = 17;
      test.diagram.model.modelData.EXTRAarray = [{ first: "FIRST" }, { second: 2.0 }];
    },
    function(test) {
      var json = test.diagram.model.toJson();
      var text0 = json.indexOf('"text":');
      test.assert(text0 > 0, 'should have found ""text":" in JSON output');
      test.assert(json.substr(text0 + 7, 24) === '"-\\"-\\\\-\\b-\\f-\\n-\\r-\\t-"', "incorrectly quoted common control characters in JSON");
      var text1 = json.lastIndexOf('"text":');
      test.assert(text1 > 0, 'should have found second ""text":" in JSON output');
      // ?? used to be: (see comment above)
      //test.assert(json.substr(text1 + 7, 33) === '"-\\u000b-\\u0017-\\u2028-\\u2029=ሴ="', "incorrectly quoted obscure control characters in JSON or did not pass through Unicode character");
      test.assert(json.substr(text1 + 7, 31) === '"-\\u000b-\\u0017-\\u2028-\\u2029="', "incorrectly quoted obscure control characters in JSON or did not pass through Unicode character");
      test.diagram.model = go.Model.fromJson(json);
      test.assert(test.diagram.model.nodeDataArray[0].text === '-\"-\\-\b-\f-\n-\r-\t-', "fromJson didn't parse correct 1st string");
      // ?? used to be: (see comment above)
      //test.assert(test.diagram.model.nodeDataArray[1].text === "-\u000b-\u0017-\u2028-\u2029=ሴ=", "fromJson didn't parse correct 2nd string");
      test.assert(test.diagram.model.nodeDataArray[1].text === "-\u000b-\u0017-\u2028-\u2029=", "fromJson didn't parse correct 2nd string");
      test.assert(test.diagram.model.nodeDataArray.length === 3, "don't have three nodes in model");
      checkDataTypes(test, test.diagram.model.nodeDataArray[2]);
      checkDataTypes(test, test.diagram.model.nodeDataArray[2].data[3]);
    },
    function(test) {
      var n0 = test.diagram.findNodeForKey(0);
      test.assert(n0 !== null, 'no Node 0');
      test.assert(n0.data.n === Infinity, 'Node 0 data.n is not Infinity');
      var s0 = n0.elt(0);
      test.assert(s0 instanceof go.Shape, 'no Shape in Node 0');
      test.assert(s0.fill instanceof go.Brush && s0.fill.type === go.Brush.Linear, 'no Linear brush in Shape 0');
      test.assert(s0.fill.start.equals(go.Spot.TopRight), 'not starting at TopRight');
      test.assert(s0.fill.end.equals(go.Spot.BottomLeft), 'not ending at BottomLeft');
      test.assert(s0.fill.colorStops.getValue(0) === "white", 'not starting white');
      test.assert(s0.fill.colorStops.getValue(1) === "black", 'not ending black');

      var n1 = test.diagram.findNodeForKey(1);
      test.assert(n1 !== null, 'no Node 1');
      test.assert(isNaN(n1.data.n), 'Node 1 data.n is not NaN');
      var s1 = n1.elt(0);
      test.assert(s1 instanceof go.Shape, 'no Shape in Node 1');
      test.assert(s1.fill instanceof go.Brush && s1.fill.type === go.Brush.Radial, 'no Radial brush in Shape 1');
      test.assert(s1.fill.start.x == 0.4, 'not starting at 0.4,0.4');
      test.assert(s1.fill.end.x == 0.6, 'not ending at 0.6,0.6');
      test.assert(s1.fill.colorStops.getValue(0) === "white", 'not starting white');
      test.assert(s1.fill.colorStops.getValue(1) === "black", 'not ending black');
      test.assert(s1.fill.startRadius == 20, 'wrong startRadius');
      test.assert(s1.fill.endRadius == 150, 'wrong endRadius');

      var md = test.diagram.model.modelData;
      test.assert(md !== null && typeof md === 'object', 'Model.modelData should be an Object');
      test.assert(md.EXTRAnumber === 17, 'Model.modelData did not save and restore EXTRAnumber: 17');
      var mda = md.EXTRAarray;
      test.assert(Array.isArray(mda) && mda.length === 2, 'Model.modelData did not save and restore EXTRAarray of length 2');
      test.assert(typeof mda[0] === 'object' && mda[0].first === "FIRST", '1st obj in EXTRAarray does not hold "first" property with value "FIRST"');
      test.assert(typeof mda[1] === 'object' && mda[1].second === 2.0, '2nd obj in EXTRAarray does not hold "second" property with value 2.0');
    }
  ));

  fd.add(new Test('points', null,
    function (test) {
      var $ = go.GraphObject.make;
      test.diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location"),
          $(go.Shape,
            { width: 30, height: 20, fill: "white" }),
          $(go.TextBlock,
            new go.Binding("text", "key")));
      test.diagram.linkTemplate =
        $(go.Link,
          { routing: go.Link.Orthogonal },
          new go.Binding("points", "points").makeTwoWay(),
          $(go.Shape));
      test.diagram.model.nodeDataArray = [
        { key: 0, location: new go.Point(0, 0) },
        { key: 1, location: new go.Point(250, 100) }
      ];
      test.diagram.model.linkDataArray = [
        { from: 0, to: 1 }
      ];
    },
    function (test) {
      test.diagram.startTransaction("reshape link");
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      var oldpts = link.points;
      var newpts = new go.List(/*go.Point*/);
      for (var i = 0; i < oldpts.length; i++) {
        var opt = oldpts.elt(i);
        var npt = opt.copy();
        if (i === 2 || i === 3) {
          npt.y += 1000;
        }
        newpts.add(npt);
      }
      link.points = newpts;
      test.diagram.commitTransaction("reshape link");

      test.assert(link !== null && link.points.length > 3, "link should have at least 4 points");
      test.assert(link.points.elt(2).y > 1000 && link.points.elt(3).y > 1000, "middle points should have been shifted down to below Y=1000");
      var json = test.diagram.model.toJson();
      var m = go.Model.fromJson(json);
      test.assert(m.linkDataArray[0].points instanceof go.List, "Model.fromJson did not convert points: Array into a List");
      test.diagram.model = m;
    },
    function (test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link !== null && link.points.length > 3, "link should have at least 4 points");
      test.assert(link.points.elt(2).y > 1000 && link.points.elt(3).y > 1000, "middle points should have been shifted down to below Y=1000");
    }
  ));

  fd.add(new Test('fromJson EnumValue', null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          new go.Binding('curve', 'curve', go.Binding.parseEnum(go.Link, go.Link.None)).makeTwoWay(go.Binding.toString),
          new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.Normal)).makeTwoWay(go.Binding.toString),
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      test.diagram.model.nodeDataArray = [
        { key: "Alpha" },
        { key: "Beta" },
        { key: "Gamma" }
      ];
      test.diagram.model.linkDataArray = [
        { from: "Alpha", to: "Beta" }
      ];
    },
    function(test) {
      var link = test.diagram.links.first();
      test.assert(link.fromNode.data.key === "Alpha" && link.toNode.data.key === "Beta", "Link should go from Alpha to Beta");

      var json = '{ "class": "go.GraphLinksModel", "nodeDataArray": [ {"key":"Alpha"}, {"key":"Beta"}, {"key":"Gamma"} ],\
      "linkDataArray": [ {"from":"Alpha", "to":"Gamma", "curve":"JumpOver", "routing":"Orthogonal"} ]}';
      go.Model.fromJson(json, test.diagram.model);
    },
    function(test) {
      var link = test.diagram.links.first();
      test.assert(link.fromNode.data.key === "Alpha" && link.toNode.data.key === "Gamma", "Link should go from Alpha to Gamma, not Beta");
      test.assert(link.curve === go.Link.JumpOver && link.routing === go.Link.Orthogonal, "loaded Link should have JumpOver curve and Orthogonal routing");
    }
  ));

  fd.add(new Test('fromJson EnumValue no conversions', null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          new go.Binding('curve').makeTwoWay(),
          new go.Binding('routing').makeTwoWay(),
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      test.diagram.model.nodeDataArray = [
        { key: "Alpha" },
        { key: "Beta" },
        { key: "Gamma" }
      ];
      test.diagram.model.linkDataArray = [
        { from: "Alpha", to: "Beta" }
      ];
    },
    function(test) {
      var link = test.diagram.links.first();
      test.assert(link.fromNode.data.key === "Alpha" && link.toNode.data.key === "Beta", "Link should go from Alpha to Beta");

      var json = '{ "class": "GraphLinksModel",\
      "nodeDataArray": [ {"key":"Alpha"}, {"key":"Beta"}, {"key":"Gamma"} ],\
      "linkDataArray": [ {"from":"Alpha", "to":"Gamma", "curve":{"class":"go.EnumValue", "classType":"Link", "name":"JumpOver"}, "routing":{"class":"go.EnumValue", "classType":"Link", "name":"Orthogonal"}} ]}';
      go.Model.fromJson(json, test.diagram.model);
    },
    function(test) {
      var link = test.diagram.links.first();
      test.assert(link.fromNode.data.key === "Alpha" && link.toNode.data.key === "Gamma", "Link should go from Alpha to Gamma, not Beta");
      test.assert(link.curve === go.Link.JumpOver && link.routing === go.Link.Orthogonal, "loaded Link should have JumpOver curve and Orthogonal routing");
    }
  ));

  function commonSetupIncremental(test) {
    var model = new go.GraphLinksModel();
    model.linkKeyProperty = "k";
    model.nodeDataArray = [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" },
      { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
      { key: 4, text: "Delta", color: "pink", group: 5 },
      { key: 5, text: "Epsilon", color: "green", isGroup: true }
    ];
    model.linkDataArray = [
      { k: "1-2", from: 1, to: 2, color: "blue" },
      { k: "2-2", from: 2, to: 2 },
      { k: "3-4", from: 3, to: 4, color: "green" },
      { k: "3-1", from: 3, to: 1, color: "purple" }
    ];
    test.diagram.model = model;
  }

  function checkNodesLinks(test, nodekeyspresent, nodekeysabsent, linkkeyspresent, linkkeysabsent) {
    var model = test.diagram.model;
    var msg = "";
    nodekeyspresent.forEach(function(k) {
      if (!model.findNodeDataForKey(k)) msg += "expecting node key " + k + " to still be a node in the model\n";
    })
    nodekeysabsent.forEach(function(k) {
      if (model.findNodeDataForKey(k)) msg += "expecting node key " + k + " to be gone from the model\n";
    })
    linkkeyspresent.forEach(function(k) {
      if (!model.findLinkDataForKey(k)) msg += "expecting link key " + k + " to still be a link in the model\n";
    })
    linkkeysabsent.forEach(function(k) {
      if (model.findLinkDataForKey(k)) msg += "expecting link key " + k + " to be gone from the model\n";
    })
  }

  fd.add(new Test('incremental empty', null, commonSetupIncremental,
    function(test) {
      test.diagram.model.applyIncrementalJson({
        incremental: 1,
        nodeKeyProperty: "key",
        linkKeyProperty: "k",
        insertedNodeKeys: [],
        modifiedNodeData: [],
        removedNodeKeys: [],
        insertedLinkKeys: [],
        modifiedLinkData: [],
        removedLinkKeys: []
      });
    },
    function(test) {
      checkNodesLinks(test, [1, 2, 3, 4, 5], [], ["1-2", "2-2", "3-4", "3-1"], []);
    }
  ));

  fd.add(new Test('incremental add', null, commonSetupIncremental,
    function(test) {
      test.diagram.model.applyIncrementalJson({
        incremental: 1,
        nodeKeyProperty: "key",
        linkKeyProperty: "k",
        insertedNodeKeys: [66, 55],
        modifiedNodeData: [
          { key: 66, text: "Omega", color: "red", group: 55 },
          { key: 55, text: "New Group", color: "pink", isGroup: true }
        ],
        removedNodeKeys: [],
        insertedLinkKeys: ["2-66", "2-55"],
        modifiedLinkData: [
          { k: "2-55", from: 2, to: 55 },
          { k: "2-66", from: 2, to: 66 }
        ],
        removedLinkKeys: []
      });
    },
    function(test) {
      checkNodesLinks(test, [1, 2, 3, 4, 5, 55, 66], [], ["1-2", "2-2", "3-4", "3-1", "2-55", "2-66"], []);
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n2 !== null && n2.linksConnected.count === 4, "Node 2 doesn't have 4 links connected");
    }
  ));

  fd.add(new Test('incremental modify', null, commonSetupIncremental,
    function(test) {
      test.diagram.model.applyIncrementalJson({
        incremental: 1,
        nodeKeyProperty: "key",
        insertedNodeKeys: [55],
        modifiedNodeData: [
          { key: 2, text: "Beta", color: "purple" },
          { key: 3, text: "Gamma", color: "lightgreen", group: 55 },
          { key: 55, text: "New Group", color: "pink", isGroup: true }
        ],
        modifiedLinkData: [{ k: "3-1", from: 3, to: 2, color: "purple" }],
        linkKeyProperty: "k",
      });
    },
    function(test) {
      checkNodesLinks(test, [1, 2, 3, 4, 5, 55], [], ["1-2", "2-2", "3-4", "3-1"], []);
      var n2 = test.diagram.findNodeForKey(2);
      var n3 = test.diagram.findNodeForKey(3);
      var g5 = test.diagram.findNodeForKey(5);
      var g55 = test.diagram.findNodeForKey(55);
      test.assert(n2 !== null && n3 !== null && g5 !== null && g55 !== null, "missing nodes?");
      test.assert(n2.data.text === "Beta" && n2.data.color === "purple", "didn't change Beta.data.color to purple");
      test.assert(n3.data.text === "Gamma" && n3.data.color === "lightgreen" &&
                  n3.data.group === 55 && n3.containingGroup === g55, "node 3 should now belong to new Group 55");
      test.assert(g5.memberParts.count === 1 && !n3.isMemberOf(g5), "group 5 should no longer have node 3");
      test.assert(g55.memberParts.count === 1 && n3.isMemberOf(g55), "new group 55 should have node 3");
      var linkdata = test.diagram.model.findLinkDataForKey("3-1");
      var link = test.diagram.findLinkForData(linkdata);
      test.assert(linkdata !== null && link !== null && link.fromNode === n3 && link.toNode === n2, "didn't reconnect link from Gamma to Beta");
    }
  ));

  fd.add(new Test('incremental remove', null, commonSetupIncremental,
    function(test) {
      test.diagram.model.applyIncrementalJson({
        incremental: 1,
        nodeKeyProperty: "key",
        linkKeyProperty: "k",
        removedNodeKeys: [2],
        removedLinkKeys: ["1-2", "2-2"]
      });
    },
    function(test) {
      checkNodesLinks(test, [1, 3, 4, 5], [2], ["3-4", "3-1"], ["1-2", "2-2"]);
    }
  ));


  fd = new TestCollection('keys');
  glmtests.add(fd);

  fd.add(new Test('assign keys', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { text: "zero" },
        { text: "one" },
        { text: "two" }
      ];
      model.linkDataArray = [
        { },
        { }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray.every(function(d) { return typeof d.id === "number"; }), "didn't assign new ids to node data");
      test.assert(model.nodeDataArray.every(function(d) { return model.getKeyForNodeData(d) === d.id; }), "didn't assign new ids to node data");
      test.assert(model.linkDataArray.every(function(d) { return typeof d.id === "number"; }), "didn't assign new ids to link data");
      test.assert(model.linkDataArray.every(function(d) { return model.getKeyForLinkData(d) === d.id; }), "didn't assign new ids to link data");
      test.assert(model.nodeDataArray.every(function(d) { return test.diagram.findNodeForKey(d.id).data === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return test.diagram.findLinkForKey(d.id).data === d; }), "inconsistent link data");
      test.assert(model.nodeDataArray.every(function(d) { return model.findNodeDataForKey(d.id) === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return model.findLinkDataForKey(d.id) === d; }), "inconsistent link data");
      var lid = test.diagram.links.iterator; lid.next();
      var link1 = lid.value; lid.next();
      var link2 = lid.value;
      test.assert(link1 !== null && link1.fromNode === null && link1.toNode === null && link2 !== null && link1.data !== link2.data);
      test.assert(model.containsLinkData(link1.data) && model.containsLinkData(link2.data), "unmodeled links?");

      var ndata = {};
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "number", "makeNodeDataKeyUnique didn't work on new data object");
      ndata = { id: "HELLO" };
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "string", "makeNodeDataKeyUnique didn't work with supplied id");

      model.startTransaction();
      model.addNodeData(ndata);
      model.commitTransaction("new node");
      ndata = { id: "HELLO" };
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "string" && ndata.id !== "HELLO", "makeNodeDataKeyUnique didn't work with duplicate id");

      var ldata = {};
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "number", "makeLinkDataKeyUnique didn't work on new data object");
      ldata = { id: "HELLO" };
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "string", "makeLinkDataKeyUnique didn't work with supplied id");

      model.startTransaction();
      model.addLinkData(ldata);
      model.commitTransaction("new link");

      ldata = { id: "HELLO" };
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "string" && ldata.id !== "HELLO", "makeLinkDataKeyUnique didn't work with duplicate id");

      model.startTransaction();
      ldata.from = -2;
      ldata.to = -3;
      model.addLinkData(ldata);
      model.commitTransaction("new link 2");
      var newid = ldata.id;
      test.assert(model.findLinkDataForKey(newid) !== null, "didn't find link data in model for key " + newid);
      var newlink = test.diagram.findPartForKey(newid);
      test.assert(newlink instanceof go.Link, "didn't find Link via Diagram.findPartForKey: " + newid);

      // -1 is a key for both a link and node
      test.assert(test.diagram.findPartForKey(-1) instanceof go.Node, "didn't find Node via Diagram.findPartForKey(-1)");
      test.assert(test.diagram.findLinkForKey(-1) instanceof go.Link, "didn't find Link via Diagram.findLinkForKey(-1)");
    }
  ));

  fd.add(new Test('assign linkKeyProperty late', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.nodeDataArray = [
        { text: "zero" },
        { text: "one" },
        { text: "two" }
      ];
      model.linkDataArray = [
        {},
        {}
      ];
      model.linkKeyProperty = "id";
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray.every(function(d) { return typeof d.id === "number"; }), "didn't assign new ids to node data");
      test.assert(model.nodeDataArray.every(function(d) { return model.getKeyForNodeData(d) === d.id; }), "didn't assign new ids to node data");
      test.assert(model.linkDataArray.every(function(d) { return typeof d.id === "number"; }), "didn't assign new ids to link data");
      test.assert(model.linkDataArray.every(function(d) { return model.getKeyForLinkData(d) === d.id; }), "didn't assign new ids to link data");
      test.assert(model.nodeDataArray.every(function(d) { return test.diagram.findNodeForKey(d.id).data === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return test.diagram.findLinkForKey(d.id).data === d; }), "inconsistent link data");
      test.assert(model.nodeDataArray.every(function(d) { return model.findNodeDataForKey(d.id) === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return model.findLinkDataForKey(d.id) === d; }), "inconsistent link data");
      var lid = test.diagram.links.iterator; lid.next();
      var link1 = lid.value; lid.next();
      var link2 = lid.value;
      test.assert(link1 !== null && link1.fromNode === null && link1.toNode === null && link2 !== null && link1.data !== link2.data);
      test.assert(model.containsLinkData(link1.data) && model.containsLinkData(link2.data), "unmodeled links?");

      var ndata = {};
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "number", "makeNodeDataKeyUnique didn't work on new data object");
      ndata = { id: "HELLO" };
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "string", "makeNodeDataKeyUnique didn't work with supplied id");

      model.startTransaction();
      model.addNodeData(ndata);
      model.commitTransaction("new node");
      ndata = { id: "HELLO" };
      model.makeNodeDataKeyUnique(ndata);
      test.assert(typeof ndata.id === "string" && ndata.id !== "HELLO", "makeNodeDataKeyUnique didn't work with duplicate id");

      var ldata = {};
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "number", "makeLinkDataKeyUnique didn't work on new data object");
      ldata = { id: "HELLO" };
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "string", "makeLinkDataKeyUnique didn't work with supplied id");

      model.startTransaction();
      model.addLinkData(ldata);
      model.commitTransaction("new link");

      ldata = { id: "HELLO" };
      model.makeLinkDataKeyUnique(ldata);
      test.assert(typeof ldata.id === "string" && ldata.id !== "HELLO", "makeLinkDataKeyUnique didn't work with duplicate id");

      model.startTransaction();
      ldata.from = -2;
      ldata.to = -3;
      model.addLinkData(ldata);
      model.commitTransaction("new link 2");
      var newid = ldata.id;
      test.assert(model.findLinkDataForKey(newid) !== null, "didn't find link data in model for key " + newid);
      var newlink = test.diagram.findPartForKey(newid);
      test.assert(newlink instanceof go.Link, "didn't find Link via Diagram.findPartForKey: " + newid);

      // -1 is a key for both a link and node
      test.assert(test.diagram.findPartForKey(-1) instanceof go.Node, "didn't find Node via Diagram.findPartForKey(-1)");
      test.assert(test.diagram.findLinkForKey(-1) instanceof go.Link, "didn't find Link via Diagram.findLinkForKey(-1)");
    }
  ));

  fd.add(new Test('accept keys number', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: 10, text: "zero" },
        { id: 11, text: "one" },
        { id: 12, text: "two" }
      ];
      model.linkDataArray = [
        { id: 20, from: 10, to: 11 },
        { id: 21, from: 10, to: 12 }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray.every(function(d) { return model.findNodeDataForKey(d.id) === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return model.findLinkDataForKey(d.id) === d; }), "inconsistent link data");
      test.assert(model.nodeDataArray[0].id === 10 && model.nodeDataArray[1].id === 11 && model.nodeDataArray[2].id === 12, "modified node data.id");
      test.assert(model.linkDataArray[0].id === 20 && model.linkDataArray[1].id === 21, "modified link data.id");
      var node10 = test.diagram.findNodeForKey(10);
      var node11 = test.diagram.findNodeForKey(11);
      var link20 = test.diagram.findLinkForKey(20);
      test.assert(link20.fromNode === node10 && link20.toNode === node11, "link20 doesn't connect node10 and node11");
    }
  ));

  fd.add(new Test('duplicate keys number', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: 10, text: "zero" },
        { id: 10, text: "one" },
        { id: 10, text: "two" }
      ];
      model.linkDataArray = [
        { id: 3, from: 10, to: 10 },
        { id: 3, from: 10, to: 10 }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      var n0 = model.nodeDataArray[0];
      var n1 = model.nodeDataArray[1];
      var n2 = model.nodeDataArray[2];
      test.assert(n0.id === 10 && n1.id !== 10 && n2.id !== 10 && n2.id !== n1.id, "didn't assign unique node data.id");
      var l0 = model.linkDataArray[0];
      var l1 = model.linkDataArray[1];
      test.assert(l0.id === 3 && l1.id !== 3, "didn't assign unique link data.id");
      var node0 = test.diagram.nodes.first();
      test.assert(test.diagram.links.all(function(l) { return l.fromNode === l.toNode && l.fromNode === node0; }), "didn't create self links on node 0");
    }
  ));

  fd.add(new Test('change keys number', null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: 10, text: "zero" },
        { id: 11, text: "one" },
        { id: 12, text: "two" }
      ];
      model.linkDataArray = [
        { id: 20, from: 10, to: 11 },
        { id: 21, from: 10, to: 12 }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      var node10 = test.diagram.findNodeForKey(10);
      var node11 = test.diagram.findNodeForKey(11);
      var node12 = test.diagram.findNodeForKey(12);
      var link20 = test.diagram.findLinkForKey(20);
      var link21 = test.diagram.findLinkForKey(21);
      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "wrong graph");

      model.startTransaction("change keys");
      model.setKeyForNodeData(model.nodeDataArray[0], 123);
      model.setKeyForLinkData(model.linkDataArray[0], 234);
      model.commitTransaction("change keys");

      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "changed graph");
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray[0].id === 123 && model.linkDataArray[0].id === 234, "didn't change keys");

      var node10 = test.diagram.findNodeForKey(123);
      var node11 = test.diagram.findNodeForKey(11);
      var node12 = test.diagram.findNodeForKey(12);
      var link20 = test.diagram.findLinkForKey(234);
      var link21 = test.diagram.findLinkForKey(21);
      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "wrong graph");
      test.assert(link20.data.from === 123 && link20.data.to === 11, "didn't change link data #1");
      test.assert(link21.data.from === 123 && link21.data.to === 12, "didn't change link data #2");
      test.assert(model.findNodeDataForKey(10) === null && model.findLinkDataForKey(20) === null, "didn't forget about old keys");
    }
  ));

  fd.add(new Test('accept keys string', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: "ten", text: "zero" },
        { id: "eleven", text: "one" },
        { id: "twelve", text: "two" }
      ];
      model.linkDataArray = [
        { id: "twenty", from: "ten", to: "eleven" },
        { id: "twentyone", from: "ten", to: "twelve" }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray.every(function(d) { return model.findNodeDataForKey(d.id) === d; }), "inconsistent node data");
      test.assert(model.linkDataArray.every(function(d) { return model.findLinkDataForKey(d.id) === d; }), "inconsistent link data");
      test.assert(model.nodeDataArray[0].id === "ten" && model.nodeDataArray[1].id === "eleven" && model.nodeDataArray[2].id === "twelve", "modified node data.id");
      test.assert(model.linkDataArray[0].id === "twenty" && model.linkDataArray[1].id === "twentyone", "modified link data.id");
      var node10 = test.diagram.findNodeForKey("ten");
      var node11 = test.diagram.findNodeForKey("eleven");
      var link20 = test.diagram.findLinkForKey("twenty");
      test.assert(link20.fromNode === node10 && link20.toNode === node11, "link20 doesn't connect node10 and node11");
    }
  ));

  fd.add(new Test('duplicate keys string', null,
    null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: "ten", text: "zero" },
        { id: "ten", text: "one" },
        { id: "ten", text: "two" }
      ];
      model.linkDataArray = [
        { id: "three", from: "ten", to: "ten" },
        { id: "three", from: "ten", to: "ten" }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      var n0 = model.nodeDataArray[0];
      var n1 = model.nodeDataArray[1];
      var n2 = model.nodeDataArray[2];
      test.assert(n0.id === "ten" && n1.id !== "ten" && n2.id !== "ten" && n2.id !== n1.id, "didn't assign unique node data.id");
      var l0 = model.linkDataArray[0];
      var l1 = model.linkDataArray[1];
      test.assert(l0.id === "three" && l1.id !== "three", "didn't assign unique link data.id");
      var node0 = test.diagram.nodes.first();
      test.assert(test.diagram.links.all(function(l) { return l.fromNode === l.toNode && l.fromNode === node0; }), "didn't create self links on node 0");
    }
  ));

  fd.add(new Test('change keys string', null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: "ten", text: "zero" },
        { id: "eleven", text: "one" },
        { id: "twelve", text: "two" }
      ];
      model.linkDataArray = [
        { id: "twenty", from: "ten", to: "eleven" },
        { id: "twentyone", from: "ten", to: "twelve" }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var model = test.diagram.model;
      var node10 = test.diagram.findNodeForKey("ten");
      var node11 = test.diagram.findNodeForKey("eleven");
      var node12 = test.diagram.findNodeForKey("twelve");
      var link20 = test.diagram.findLinkForKey("twenty");
      var link21 = test.diagram.findLinkForKey("twentyone");
      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "wrong graph");

      model.startTransaction("change keys");
      model.setKeyForNodeData(model.nodeDataArray[0], 123);
      model.setKeyForLinkData(model.linkDataArray[0], 234);
      model.commitTransaction("change keys");

      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "changed graph");
    },
    function(test) {
      var model = test.diagram.model;
      test.assert(model.nodeDataArray[0].id === 123 && model.linkDataArray[0].id === 234, "didn't change keys");

      var node10 = test.diagram.findNodeForKey(123);
      var node11 = test.diagram.findNodeForKey("eleven");
      var node12 = test.diagram.findNodeForKey("twelve");
      var link20 = test.diagram.findLinkForKey(234);
      var link21 = test.diagram.findLinkForKey("twentyone");
      test.assert(link20.fromNode == node10 && link20.toNode === node11 && link21.fromNode === node10 && link21.toNode === node12, "wrong graph");
      test.assert(link20.data.from === 123 && link20.data.to === "eleven", "didn't change link data #1");
      test.assert(link21.data.from === 123 && link21.data.to === "twelve", "didn't change link data #2");
      test.assert(model.findNodeDataForKey("ten") === null && model.findLinkDataForKey("twenty") === null, "didn't forget about old keys");
    }
  ));

  fd.add(new Test('updateAllReferencesFromData', null,
    function(test) {
      var model = new go.GraphLinksModel();
      model.nodeKeyProperty = "id";
      model.linkKeyProperty = "id";
      model.nodeDataArray = [
        { id: "ten", text: "zero" },
        { id: "eleven", text: "one" },
        { id: "twelve", text: "two" }
      ];
      model.linkDataArray = [
        { id: "twenty", from: "ten", to: "eleven" },
        { id: "twentyone", from: "ten", to: "twelve" }
      ];
      test.diagram.model = model;
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction();
      var nodeArray = diagram.model.nodeDataArray;
      nodeArray.splice(1, 1);  // remove id: "eleven"
      nodeArray.push({ id: "eleven", text: "another one" });  // same id as removed data, but new node data object
      nodeArray.push({ id: "thirteen", text: "three" });  // new node
      var linkArray = diagram.model.linkDataArray;
      linkArray.pop();
      linkArray.push({ id: "twenty", from: "eleven", to: "twelve" });  // duplicate id as other link data -- needs to make unique
      diagram.updateAllRelationshipsFromData();
      diagram.commitTransaction("modify nodeDataArray and linkDataArray");
    },
    function(test) {
      var diagram = test.diagram;
      var nArr = diagram.model.nodeDataArray;
      test.assert(nArr.length === 4 && diagram.nodes.count === 4, "should have four data in nodeDataArray");
      test.assert(nArr[0].id === "ten" && nArr[1].id === "twelve" && nArr[2].id === "eleven" && nArr[3].id === "thirteen", "wrong ids (or wrong order) in nodeDataArray, not: " + nArr[0].id + " " + nArr[1].id + " " + nArr[2].id + " " + nArr[3].id);
      var node10 = diagram.findPartForKey("ten");
      test.assert(node10 !== null && node10.linksConnected.count === 1, "node ten should exist and have one link");
      var node11 = diagram.findPartForKey("eleven");
      test.assert(node11 !== null && node11.linksConnected.count === 2, "node eleven should exist and have two links connected");
      var node12 = diagram.findPartForKey("twelve");
      test.assert(node12 !== null && node12.linksConnected.count === 1, "node twelve should exist and have one link");
      var node13 = diagram.findPartForKey("thirteen");
      test.assert(node13 !== null && node13.linksConnected.count === 0, "node thirteen should exist and have no links");
      var lArr = diagram.model.linkDataArray;
      test.assert(lArr.length === 2 && diagram.links.count === 2, "should have two data in linkDataArray");
      test.assert(lArr[0].id === "twenty" && lArr[1].id === "twenty2", "wrong ids (or wrong order) in linkDataArray, not: " + lArr[0].id + " " + lArr[1].id);
    }
  ));

  fd.add(new Test("undo setkey", myDiagram,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.linkTemplate =
        go.GraphObject.make(go.Link,
          go.GraphObject.make(go.Shape),
          go.GraphObject.make(go.TextBlock, new go.Binding("text"))
        );
      diag.model = new go.GraphLinksModel();
      diag.model.linkKeyProperty = "key";
      diag.model.nodeDataArray =
        [ { key: 1, text: "Alpha" },
          { key: 2, text: "Beta" } ];
      diag.model.linkDataArray =
        [ { key: "test1", from: 1, to: 2, text: "test1" } ];
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var testData = diag.model.linkDataArray[0];

      test.assert(testData.key === "test1" && diag.findLinkForKey("test1") && !diag.findLinkForKey("test2"), "should find test1 but not test2");

      diag.model.commit(function(m) {
        var data = m.findLinkDataForKey("test1");
        test.assert(testData === data, "should have found that data by key");
        m.setKeyForLinkData(testData, "test2");
        m.set(testData, "text", "test2");
      }, "updateKey");

      test.assert(testData.key === "test2" && diag.findLinkForKey("test2") && !diag.findLinkForKey("test1"), "should find test2 but not test1");

      diag.commandHandler.undo();
    },
    function(test) {
      var diag = test.diagram;
      var testData = diag.model.linkDataArray[0];

      test.assert(testData.key === "test1" && diag.findLinkForKey("test1") && !diag.findLinkForKey("test2"), "should find test1 but not test2");
    }
  ));


  fd = new TestCollection('label nodes');
  glmtests.add(fd);

  fd.add(new Test("simple", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: [
          { key: 1, text: "one", loc: "136 376" },
          { key: 2, text: "two", loc: "263 -32" },
          { key: 3, text: "three" },
          { key: 4, text: "four", loc: "400 100" }
        ],
        linkDataArray: [
          { from: 1, to: 2, labelKeys: [3] },
          { from: 3, to: 4 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 4 && diagram.links.count === 2, "wrong number of nodes or links");
      var node1 = diagram.findNodeForKey(1);
      var node2 = diagram.findNodeForKey(2);
      var node3 = diagram.findNodeForKey(3);
      var node4 = diagram.findNodeForKey(4);
      var link = diagram.links.first();
      test.assert(link.fromNode === node1 && link.toNode === node2 && node3.labeledLink === link && link.labelNodes.count === 1 && link.labelNodes.first() === node3, "didn't set up link with label node");
      var link2 = node4.linksConnected.first();
      test.assert(link2 !== null && link2.fromNode == node3 && link2.toNode == node4, "didn't set up link2 correctly");
    }
    ));

  fd.add(new Test("copy", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: [
          { key: 1, text: "one", loc: "136 376" },
          { key: 2, text: "two", loc: "263 -32" },
          { key: 3, text: "three" },
          { key: 4, text: "four", loc: "400 100" }
        ],
        linkDataArray: [
          { from: 1, to: 2, labelKeys: [3] },
          { from: 3, to: 4 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      var node1 = diagram.findNodeForKey(1);
      var node2 = diagram.findNodeForKey(2);
      var link = diagram.links.first();
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
      diagram.startTransaction();
      diagram.moveParts(diagram.selection, new go.Point(50, 50), false);
      diagram.commitTransaction("moved copied parts");

      test.assert(diagram.nodes.count === 8 && diagram.links.count === 4, "didn't copy everything");
      test.assert(link.labelNodes.count === 1, "copied label node left on original link");
      var copy3 = null;
      diagram.selection.each(function(n) { if (n instanceof go.Node && n.data.text === "three") copy3 = n; });
      test.assert(copy3 !== null && copy3.isLinkLabel && copy3.labeledLink.isLabeledLink && copy3.labeledLink.labelNodes.count === 1 && copy3.labeledLink.labelNodes.first() === copy3, "didn't copy everything correctly");

      diagram.clearSelection();
      node1.isSelected = true;
      node2.isSelected = true;
      link.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
      diagram.startTransaction();
      diagram.moveParts(diagram.selection, new go.Point(100, 100), false);
      diagram.commitTransaction("moved copied parts");

      test.assert(diagram.nodes.count === 11 && diagram.links.count === 5, "didn't copy labeled link correctly");
    }
    ));

  fd.add(new Test("change label node", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: [
          { key: 1, text: "one", loc: "136 376" },
          { key: 2, text: "two", loc: "263 -32" },
          { key: 3, text: "three" },
          { key: 4, text: "four", loc: "400 100" }
        ],
        linkDataArray: [
          { from: 1, to: 2, labelKeys: [3] },
          { from: 3, to: 4 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction();
      var node1 = diagram.findNodeForKey(1);
      var node3 = diagram.findNodeForKey(3);
      var link = diagram.links.first();
      test.assert(node3.isLinkLabel && node3.labeledLink === link, "didn't set up labeled node");
      test.assert(link.isLabeledLink && link.labelNodes.count === 1 && link.labelNodes.first() === node3, "didn't set up labeled link");
      node3.labeledLink = null;
      node1.location = new go.Point(200, 400);
      diagram.commitTransaction("no longer a label node");
    },
    function(test) {
      var diagram = test.diagram;
      var node3 = diagram.findNodeForKey(3);
      var link = diagram.links.first();
      test.assert(!node3.isLinkLabel && node3.labeledLink === null, "node is still a link label");
      test.assert(!link.isLabeledLink && link.labelNodes.count === 0, "link still has label node");
    }
  ));

  fd.add(new Test("replace label node array with same keys", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: [
          { key: 1, text: "one", loc: "136 376" },
          { key: 2, text: "two", loc: "263 -32" },
          { key: 3, text: "three" },
          { key: 4, text: "four", loc: "400 100" }
        ],
        linkDataArray: [
          { from: 1, to: 2, labelKeys: [3] },
          { from: 3, to: 4 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction();
      var link = diagram.findNodeForKey(3).labeledLink;
      diagram.model.setDataProperty(link.data, "labelKeys", [3]);
      diagram.commitTransaction("same label node array contents");
    },
    function(test) {
      var diagram = test.diagram;
      var node3 = diagram.findNodeForKey(3);
      var link = diagram.links.first();
      test.assert(node3.isLinkLabel && node3.labeledLink === link, "node should still be a link label");
    }
  ));

  fd.add(new Test("nonsensical: toNode inside label Group", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.TextBlock, new go.Binding("text"))
        );
      diagram.groupTemplate =
        $(go.Group, "Auto",
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, "RoundedRectangle", { strokeWidth: 3, fill: "white" }),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text", "text"))
        );
      diagram.model = $(go.GraphLinksModel, {
        linkLabelKeysProperty: "labelKeys",
        nodeDataArray: [
          { key: 1, text: "New Idea", isGroup: true, loc: "136 376" },
          { key: -2, text: "Idea", isGroup: true, loc: "263 -32" },
          { key: -3, text: "Relationship Idea", group: -2, loc: "42 -17" }
        ],
        linkDataArray: [
          { "type": "noArrows", "from": 1, "to": -3, "labelKeys": [-2] }  // label node is a Group, toNode is member of that Group
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3 && diagram.links.count === 1, "wrong number of nodes or links");
      var node1 = diagram.findNodeForKey(1);
      var node2 = diagram.findNodeForKey(-2);
      var node3 = diagram.findNodeForKey(-3);
      var link = diagram.links.first();
      test.assert(link.fromNode === node1 && link.toNode === node3 && node2.labeledLink === link, "didn't set up link with label group");
    },
    function(test) {

    }
    ));


  fd = new TestCollection('references');
  glmtests.add(fd);

  fd.add(new Test("remove and re-add node", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", group: 5 },
          { key: 2, text: "Beta", color: "orange", group: 5 },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", isGroup: true }
        ],
        [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 1 }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var beta = diag.findNodeForKey(2);
      test.betaloc = beta.location.copy();
      diag.model.commit(function(m) {
        m.removeNodeData(beta.data);
        m.addNodeData(beta.data);
      }, "removed and re-added");
    },
    function(test) {
      var diag = test.diagram;
      var beta = diag.findNodeForKey(2);
      var grp = diag.findNodeForKey(5);
      test.assert(diag.model.nodeDataArray[diag.model.nodeDataArray.length - 1] === beta.data, "didn't add node data to end of nodeDataArray");
      test.assert(beta instanceof go.Node && !test.betaloc.equals(beta.location), "missing Beta node that should have moved when re-created");
      test.assert(beta.linksConnected.count === 2, "missing links connected with Beta node");
      test.assert(grp instanceof go.Group && beta.containingGroup === grp, "Beta node isn't member of Group Epsilon");
    }
  ));

  fd.add(new Test("remove and re-add link", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", group: 5 },
          { key: 2, text: "Beta", color: "orange", group: 5 },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", isGroup: true }
        ],
        [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 1 }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var ldata = diag.model.linkDataArray[2];
      diag.model.commit(function(m) {
        m.removeLinkData(ldata);
        m.addLinkData(ldata);
      }, "removed and re-added");
    },
    function(test) {
      var diag = test.diagram;
      var beta = diag.findNodeForKey(2);
      var link = beta.findLinksOutOf().first();
      var grp = diag.findNodeForKey(5);
      test.assert(diag.model.linkDataArray[diag.model.linkDataArray.length - 1] === link.data, "didn't add link data to end of linkDataArray");
      test.assert(link instanceof go.Link, "missing link that should have been re-created");
      test.assert(beta !== null && link.fromNode === beta && link.toNode === beta, "link not connected with Beta node");
      test.assert(grp instanceof go.Group && link.containingGroup === grp, "link isn't member of Group Epsilon");
    }
  ));

  fd.add(new Test("remove and re-add multiport node", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, new go.Binding("text")),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray"),
            {
              itemTemplate:
                $(go.Panel,
                  new go.Binding("portId", "t"),
                  $(go.TextBlock, new go.Binding("text", "t")))
            }
          )
        );
      var model = new go.GraphLinksModel();
      model.linkFromPortIdProperty = "fp";
      model.linkToPortIdProperty = "tp";
      model.nodeDataArray =
        [
          { key: 1, text: "Alpha", color: "lightblue", group: 5, itemArray: [{ t: "A" }, { t: "B" }, { t: "C" }] },
          { key: 2, text: "Beta", color: "orange", group: 5 },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", isGroup: true }
        ];
      model.linkDataArray =
        [
          { from: 1, to: 2, fp: "B" },
          { from: 1, to: 3, fp: "C" },
          { from: 2, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 1, tp: "B" }
        ];
      diag.model = model;
    },
    function(test) {
      var diag = test.diagram;
      var alpha = diag.findNodeForKey(1);
      diag.model.commit(function(m) {
        m.removeNodeData(alpha.data);
        m.addNodeData(alpha.data);
      }, "removed and re-added");
    },
    function(test) {
      var diag = test.diagram;
      var alpha = diag.findNodeForKey(1);
      var grp = diag.findNodeForKey(5);
      test.assert(diag.model.nodeDataArray[diag.model.nodeDataArray.length - 1] === alpha.data, "didn't add node data to end of nodeDataArray");
      test.assert(alpha instanceof go.Node, "missing Alpha node that should have moved when re-created");
      test.assert(alpha.linksConnected.count === 3, "missing links connected with Alpha node");
      test.assert(grp instanceof go.Group && alpha.containingGroup === grp, "Alpha node isn't member of Group Epsilon");
    }
  ));

  fd.add(new Test("remove and re-add port", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock, new go.Binding("text")),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray"),
            {
              itemTemplate:
                $(go.Panel,
                  new go.Binding("portId", "t"),
                  $(go.TextBlock, new go.Binding("text", "t")))
            }
          )
        );
      var model = new go.GraphLinksModel();
      model.linkFromPortIdProperty = "fp";
      model.linkToPortIdProperty = "tp";
      model.nodeDataArray =
        [
          { key: 1, text: "Alpha", color: "lightblue", group: 5, itemArray: [{ t: "A" }, { t: "B" }, { t: "C" }] },
          { key: 2, text: "Beta", color: "orange", group: 5 },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", isGroup: true }
        ];
      model.linkDataArray =
        [
          { from: 1, to: 2, fp: "B" },
          { from: 1, to: 3, fp: "C" },
          { from: 2, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 1, tp: "B" }
        ];
      diag.model = model;
    },
    function(test) {
      var diag = test.diagram;
      var alpha = diag.findNodeForKey(1);
      diag.model.commit(function(m) {
        var item = alpha.data.itemArray[1];
        test.item = item;
        m.removeArrayItem(alpha.data.itemArray, 1);
        m.addArrayItem(alpha.data.itemArray, item);
      }, "removed and re-added");
    },
    function(test) {
      var diag = test.diagram;
      var alpha = diag.findNodeForKey(1);
      var item = test.item;
      var grp = diag.findNodeForKey(5);
      test.assert(alpha.data.itemArray.indexOf(item) === 2, "didn't add item data to end of itemArray");
      test.assert(alpha.linksConnected.count === 1 /* ??? 3 */, "missing links connected with Alpha node");
      test.assert(alpha.findLinksConnected("B").count === 0 /* ??? 2 */, "missing links connected with Alpha port B");
      console.log("intentional bug: removing port removes connected links");
    }
  ));

  fd.add(new Test("have ref, then add node", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var model = new go.GraphLinksModel();
      model.linkLabelKeysProperty = "labelKeys";
      model.nodeDataArray = [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange" },
          { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
          // Three kinds of nodes that are referenced but not added to the model until
          // a later transaction: a simple Node, a Group with members, and a label Node
          //{ key: 4, text: "Delta", color: "pink", group: 5 },
          //{ key: 5, text: "Group", isGroup: true },
          //{ key: 6, text: "Label" }
        ];
      model.linkDataArray = [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 1, labelKeys: [6] }
        ];
      diag.model = model;
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.nodes.count === 3 && diag.links.count === 5, "should have 5 links");
      var alpha = diag.findNodeForKey(1);
      var gamma = diag.findNodeForKey(3);
      test.assert(gamma.containingGroup === null, "Gamma isn't in a group yet");
      var link1 = diag.findLinkForData(diag.model.linkDataArray[1]);
      var link3 = diag.findLinkForData(diag.model.linkDataArray[3]);
      var link4 = diag.findLinkForData(diag.model.linkDataArray[4]);
      test.assert(link3.fromNode === gamma && link3.toNode === null, "link3 only has fromNode");
      test.assert(link4.fromNode === null && link4.toNode === alpha, "link4 only has toNode");
      test.assert(link1.pointsCount > 0 && link3.pointsCount === 0 && link4.pointsCount === 0, "two links shouldn't have routes because connected node doesn't exist yet");
      test.assert(link4.labelNodes.count === 0, "haven't added any label Nodes yet");

      diag.model.commit(function(m) {
        m.addNodeData({ key: 4, text: "Delta", color: "pink", group: 5 });
        m.addNodeData({ key: 5, text: "Group", isGroup: true});
        m.addNodeData({ key: 6, text: "Label" });
      });
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.nodes.count === 6 && diag.links.count === 5, "added 3 nodes for total of 6");
      var alpha = diag.findNodeForKey(1);
      var gamma = diag.findNodeForKey(3);
      var delta = diag.findNodeForKey(4);
      var group = diag.findNodeForKey(5);
      var label = diag.findNodeForKey(6);
      test.assert(gamma.containingGroup === group, "Gamma should be in the group");
      test.assert(delta.containingGroup === group, "Delta should be in the group");
      var link1 = diag.findLinkForData(diag.model.linkDataArray[1]);
      var link3 = diag.findLinkForData(diag.model.linkDataArray[3]);
      var link4 = diag.findLinkForData(diag.model.linkDataArray[4]);
      test.assert(link3.fromNode === gamma && link3.toNode === delta, "link3 should have toNode");
      test.assert(link4.fromNode === delta && link4.toNode === alpha, "link4 should have fromNode");
      test.assert(link1.pointsCount > 0 && link3.pointsCount > 0 && link4.pointsCount > 0, "two links should have routes now");
      test.assert(link4.labelNodes.count === 1 && link4.labelNodes.first() === label, "added label Node");
    }
  ));


  fd = new TestCollection('subclass');
  glmtests.add(fd);

  class CustomModel extends go.GraphLinksModel{
    constructor(nda, lda) {
    super();
    this.nodeCategoryProperty = function (obj, str) { if (arguments.length > 1) obj.d.category = str; return obj.d.category; };
    this.nodeKeyProperty = function (obj, key) { if (arguments.length > 1) obj.d.key = key; return obj.d.key; };
    this.linkCategoryProperty = function (obj, str) { if (arguments.length > 1) obj.d.category = str; return obj.d.category; };
    this.linkFromKeyProperty = function (obj, str) { if (arguments.length > 1) obj.d.from = str; return obj.d.from; };
    this.linkFromPortIdProperty = function (obj, str) { if (arguments.length > 1) obj.d.fromPort = str; return obj.d.fromPort; };
    this.linkToKeyProperty = function (obj, str) { if (arguments.length > 1) obj.d.to = str; return obj.d.to; };
    this.linkToPortIdProperty = function (obj, str) { if (arguments.length > 1) obj.d.toPort = str; return obj.d.toPort; };
    this.linkKeyProperty = function (obj, key) { if (arguments.length > 1) obj.d.key = key; return obj.d.key; };
    this.nodeGroupKeyProperty = function (obj, key) { if (arguments.length > 1) obj.d.group = key; return obj.d.group; };
    this.nodeIsGroupProperty = function (obj, isg) { if (arguments.length > 1) obj.d.isGroup = isg; return obj.d.isGroup; };
    this.copyNodeDataFunction = function (obj) {
      var copy = {};
      copy.d = {
        category: obj.d.category,
        key: obj.d.key,
        group: obj.d.group,
        isGroup: obj.d.isGroup
      };
      copy.loc = obj.loc;
      copy.text = obj.text;
      return copy;
    };
    this.copyLinkDataFunction = function (obj) {
      var copy = {};
      copy.d = {
        category: obj.d.category,
        from: obj.d.from,
        fromPort: obj.d.fromPort,
        to: obj.d.to,
        toPort: obj.d.toPort
      };
      return copy;
    };
    this.nodeDataArray = nda;
    this.linkDataArray = lda;
  }
}


  fd.add(new Test("GraphLinksModel", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, { width: 4, height: 4, portId: "T"}),
          $(go.TextBlock, new go.Binding("text")),
          $(go.Shape, { width: 4, height: 4, portId: "B"})
        );
      diag.model = new CustomModel(
        [
          {"d": {"category":"Comment", "key":-13}, "loc":"360 -10", "text":"Kookie Brittle"},
          {"d": {"key":-1, "category":"Start"}, "loc":"175 0", "text":"Start"},
          {"d": {"key":0}, "loc":"0 77", "text":"Preheat oven to 375 F"},
          {"d": {"key":1}, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
          {"d": {"key":2}, "loc":"175 190", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
          {"d": {"key":3}, "loc":"175 270", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
          {"d": {"key":4}, "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan"},
          {"d": {"key":5}, "loc":"352 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
          {"d": {"key":6}, "loc":"175 440", "text":"Sprinkle nuts on top"},
          {"d": {"key":7}, "loc":"175 500", "text":"Bake for 25 minutes and let cool"},
          {"d": {"key":8}, "loc":"175 570", "text":"Cut into rectangular grid"},
          {"d": {"key":-2, "category":"End"}, "loc":"175 640", "text":"Enjoy!"}
        ],
        [
          {"d": {"from":1, "to":2, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":2, "to":3, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":3, "to":4, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":4, "to":6, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":6, "to":7, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":7, "to":8, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":8, "to":-2, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":-1, "to":0, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":-1, "to":1, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":-1, "to":5, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":5, "to":4, "fromPort":"B", "toPort":"T"}},
          {"d": {"from":0, "to":4, "fromPort":"B", "toPort":"T"}}
        ]
      );
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.nodes.count === 12, "should be 12 Nodes in Diagram, not: " + diag.nodes.count);
      test.assert(diag.links.count === 12, "should be 12 Links in Diagram, not: " + diag.links.count);
      var start = diag.findNodeForKey(-1);
      test.assert(start && start.linksConnected.count === 3, "Start should have 3 connected links");
      var press = diag.findNodeForKey(4);
      test.assert(press && press.findLinksInto().count === 3 && press.findLinksOutOf().count === 1, "should have 3 inputs and 1 output");
      test.assert(press.findLinksInto("T").count === 3 && press.findLinksOutOf("B").count === 1, "should have 3 inputs and 1 output");
      var link = press.findLinksOutOf("B").first();
      test.assert(link && link.fromNode && link.fromNode.key === press.key && link.fromPort.portId === "B", "should be coming from PRESS");
      test.assert(link && link.toNode && link.toNode.key === 6 && link.toPort.portId === "T", "should be going to SPRINKLE");
    }
  ));

  fd = new TestCollection('disconnected links');
  glmtests.add(fd);

  fd.add(new Test("tree", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange" },
          { key: 3, text: "Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" }
        ],
        [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 3, to: 4 },
          { from: -17, to: 1 },
          { from: 4, to: -17 }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var root = diag.findNodeForKey(1);
      var four = diag.findNodeForKey(4);
      var three = diag.findNodeForKey(3);
      var two = diag.findNodeForKey(2);
      test.assert(diag.nodes.count === 4 && diag.links.count === 5, "wrong number of links when some are disconnected");
      test.assert(root.findTreeParentNode() === null, "root should have no parent");
      test.assert(root.findTreeParentLink() !== null, "root should have no parent link");
      test.assert(four.findTreeChildrenNodes().count === 0, "4 should have no child node");
      test.assert(four.findTreeChildrenLinks().count === 1, "4 should have one child link");
      test.assert(root.findNodesConnected().count === 2, "root has only 2 children");
      test.assert(root.findNodesInto().count === 0, "should have no parent");
      test.assert(root.findNodesOutOf().count === 2, "should have 2 children");
      test.assert(root.findLinksConnected().count === 3, "root has only 2 children links, but one disconnected link");
      test.assert(root.findLinksInto().count === 1, "should have a disconnected parent link");
      test.assert(root.findLinksOutOf().count === 2, "should have links to 2 children");
      test.assert(three.findLinksBetween(four).count === 1, "should have only one link between 3 and 4");
      test.assert(four.findLinksBetween(three).count === 1, "shoudl have only one link between 4 and 3");
      test.assert(three.findLinksTo(four).count === 1, "should have one link from 3 to 4");
      test.assert(four.findLinksTo(three).count === 0, "should have no links from 4 to 3");
      test.assert(root && four && four.findTreeRoot() === root, "root of 4 should be 1");
      test.assert(four.isInTreeOf(root) && new go.Set(root.findTreeParts()).has(four), "4 should be in tree of root");
      test.assert(root.findTreeLevel() === 0, "root should be level zero");
      test.assert(four.findTreeLevel() === 2, "4 should be level 2");
      test.assert(root.findTreeParts().count === 9, "root's tree should include 9 nodes and links, including two partly disconnected links");
      test.assert(four.findTreeParentChain().count === 6, "4's tree chain should have 6 in it -- 3 nodes and 3 links (one partly disconnected)");
      test.assert(four.findCommonTreeParent(two) === root, "root is common parent of 4 and 2");

      diag.commit(function(diag) {
        root.isTreeExpanded = false;
      });
      diag.commit(function(diag) {
        root.isTreeExpanded = true;
      });
    }
  ));

  fd.add(new Test("collapse/expand", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange" },
          { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
          { key: 4, text: "Delta", color: "pink", group: 5 },
          { key: 5, text: "Group", isGroup: true }
        ],
        [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 3, to: 4 },
          { from: 4, to: 1 },
          { from: -17, to: 3 },
          { from: 4, to: -17 }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var grp = diag.findNodeForKey(5);
      diag.commit(function(diag) {
        grp.isSubGraphExpanded = false;
      });
      diag.commit(function(diag) {
        grp.isSubGraphExpanded = true;
      });
    },
    function(test) {
      var diag = test.diagram;
      var grp = diag.findNodeForKey(5);
      diag.commit(function(diag) {
        diag.commandHandler.collapseSubGraph(grp);
      });
      diag.commit(function(diag) {
        diag.commandHandler.expandSubGraph(grp);
      });
    }
  ));


  // TreeModel:
  var treetests = new TestCollection('TreeModel');
  TestRoot.add(treetests);

  function CommonSetupTree(test, reverse) {  // create three nodes and no links
    test.diagram.initialContentAlignment = go.Spot.Center;
    if (reverse === undefined) reverse = false;
    var m = new go.TreeModel();
    m.nodeParentKeyProperty = "parentKey";
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, parentKey: 1, text: "n2" },
      { key: 3, parentKey: 1, text: "n3" },
      { key: 4, parentKey: 3, text: "n4" }
    ];
    test.diagram.isTreePathToChildren = !reverse;
    test.diagram.model = m;

    var layout = new go.TreeLayout();
    // don't set this, to see if TreeLayout.path === TreeLayout.PathDefault works
    //layout.path = (reverse ? go.TreeLayout.PathSource : go.TreeLayout.PathDestination);
    layout.doLayout(test.diagram);
  }

  function CommonSetupTreeReverse(test) { CommonSetupTree(test, true); }

  function CommonCheckTree(test, reverse) {
    if (reverse === undefined) reverse = false;
    var d = test.diagram;
    test.assert(d.nodes.count === 4, "should have four nodes");
    test.assert(d.links.count === 3, "should have three links");
    var n1 = d.findNodeForKey(1);
    var n2 = d.findNodeForKey(2);
    var n3 = d.findNodeForKey(3);
    if (!n3) n3 = d.findNodeForKey(-3);  // handle node key change from 3 to -3
    var n4 = d.findNodeForKey(4);
    test.assert(n1 !== null && n2 !== null && n3 !== null && n4 !== null, "should be able to find all nodes");
    var l2 = d.findLinkForKey(2);
    if (reverse)
      test.assert(l2 !== null && l2.fromNode === n2 && l2.toNode === n1, "should have link from n2 to n1");
    else
      test.assert(l2 !== null && l2.fromNode === n1 && l2.toNode === n2, "should have link from n1 to n2");
    var l3 = d.findLinkForKey(3);
    if (!l3) l3 = d.findLinkForKey(-3);  // handle node key change from 3 to -3
    if (reverse)
      test.assert(l3 !== null && l3.fromNode === n3 && l3.toNode === n1, "should have link from n3 to n1");
    else
      test.assert(l3 !== null && l3.fromNode === n1 && l3.toNode === n3, "should have link from n1 to n3");
    var l4 = d.findLinkForKey(4);
    if (reverse)
      test.assert(l4 !== null && l4.fromNode === n4 && l4.toNode === n3, "should have link from n4 to n3");
    else
      test.assert(l4 !== null && l4.fromNode === n3 && l4.toNode === n4, "should have link from n3 to n4");
    test.assert(n1.findTreeParentLink() === null && n1.findTreeParentNode() === null, "n1 should have no parent");
    test.assert(n2.findTreeParentLink() === l2 && n2.findTreeParentNode() === n1, "n2 should have parent n1");
    test.assert(n3.findTreeParentLink() === l3 && n3.findTreeParentNode() === n1, "n3 should have parent n1");
    test.assert(n4.findTreeParentLink() === l4 && n4.findTreeParentNode() === n3, "n4 should have parent n3");
    test.assert(n1.findTreeChildrenLinks().count === 2 && n1.findTreeChildrenNodes().count === 2, "n1 should have two children");
    test.assert(n2.findTreeChildrenLinks().count === 0 && n2.findTreeChildrenNodes().count === 0, "n2 should have no children");
    test.assert(n3.findTreeChildrenLinks().count === 1 && n3.findTreeChildrenNodes().count === 1, "n3 should have one child");
    test.assert(n3.findTreeChildrenLinks().first() === l4 && n3.findTreeChildrenNodes().first() === n4, "n3 should have one child");
    test.assert(n4.findTreeChildrenLinks().count === 0 && n4.findTreeChildrenNodes().count === 0, "n4 should have no children");
    test.assert(n4.findTreeChildrenLinks().first() === null && n4.findTreeChildrenNodes().first() === null, "n4 should have no children");
    test.assert(!n1.isTreeLeaf, "n1 is not a leaf");
    test.assert(n2.isTreeLeaf, "n2 is a leaf");
    test.assert(!n3.isTreeLeaf, "n3 is not a leaf");
    test.assert(n4.isTreeLeaf, "n4 is a leaf");
    test.assert(n1.findTreeRoot() === n1, "n1 should be tree root");
    test.assert(n2.findTreeRoot() === n1, "n1 should be tree root of n2");
    test.assert(n3.findTreeRoot() === n1, "n1 should be tree root of n3");
    test.assert(n4.findTreeRoot() === n1, "n1 should be tree root of n4");
    test.assert(d.findTreeRoots().count === 1 && d.findTreeRoots().first() === n1, "diagram should have one root: n1");
  }

  function CommonCheckTreeReverse(test) { CommonCheckTree(test, true); }

  var tc = new TestCollection('ToChildren');
  treetests.add(tc);

  tc.add(new Test('setup', null, CommonSetupTree,
    null,
    CommonCheckTree
  ));

  tc.add(new Test('change node key', null, CommonSetupTree,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.setKeyForNodeData(d3, -3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckTree
  ));

  tc.add(new Test('change node key undo', null, CommonSetupTree,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.setKeyForNodeData(d3, -3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTree
  ));

  tc.add(new Test("ignore non-isTreeLink", null,
    function(test) {
      CommonSetupTree(test);
      var nonTreeLink = new go.Link();
      nonTreeLink.add(new go.Shape().set({ stroke: "red", strokeWidth: 3 }));
      nonTreeLink.isTreeLink = false;
      nonTreeLink.fromNode = test.diagram.findNodeForKey(4);
      nonTreeLink.toNode = test.diagram.findNodeForKey(1);
      test.diagram.add(nonTreeLink);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.links.count === 4, "should have four links initially");
      var newdata = { text: "new root" };
      var newkey = null;
      diag.model.commit(m => {
        m.addNodeData(newdata);
        newkey = m.getKeyForNodeData(newdata);
        test.assert(newkey === newdata.key, "new key doesn't match " + newkey);
        var oldrootdata = m.findNodeDataForKey(1);
        m.setParentKeyForNodeData(oldrootdata, newkey);
        test.assert(newkey === oldrootdata.parentKey, "didn't change parent key " + oldrootdata.parentKey);
      });
      test.assert(diag.nodes.count === 5, "didn't create new Node");
      test.assert(diag.links.count === 5, "didn't create new Link");
      var oldroot = diag.findNodeForKey(1);
      test.assert(oldroot && oldroot.linksConnected.count === 4, "old root should now have four links");
      var newroot = diag.findNodeForKey(newkey);
      test.assert(newroot && newroot.linksConnected.count === 1, "new root doesn't have a child");
      test.assert(newroot.findLinksTo(oldroot).count === 1, "should be one link going from newroot to oldroot");
      test.assert(oldroot.findLinksTo(newroot).count === 0, "should be no link going from oldroot to newroot");
    }
  ));

  tc = new TestCollection('ToParent');
  treetests.add(tc);

  tc.add(new Test('setup', null, CommonSetupTreeReverse,
    null,
    CommonCheckTreeReverse
  ));

  tc.add(new Test('change node key', null, CommonSetupTreeReverse,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.setKeyForNodeData(d3, -3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckTreeReverse
  ));

  tc.add(new Test('change node key undo', null, CommonSetupTreeReverse,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.setKeyForNodeData(d3, -3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckTreeReverse
  ));

  tc.add(new Test("ignore non-isTreeLink", null,
    function(test) {
      CommonSetupTreeReverse(test);
      var nonTreeLink = new go.Link();
      nonTreeLink.add(new go.Shape().set({ stroke: "red", strokeWidth: 3 }));
      nonTreeLink.isTreeLink = false;
      nonTreeLink.fromNode = test.diagram.findNodeForKey(1);
      nonTreeLink.toNode = test.diagram.findNodeForKey(4);
      test.diagram.add(nonTreeLink);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.links.count === 4, "should have four links initially");
      var newdata = { text: "new root" };
      var newkey = null;
      diag.model.commit(m => {
        m.addNodeData(newdata);
        newkey = m.getKeyForNodeData(newdata);
        test.assert(newkey === newdata.key, "new key doesn't match " + newkey);
        var oldrootdata = m.findNodeDataForKey(1);
        m.setParentKeyForNodeData(oldrootdata, newkey);
        test.assert(newkey === oldrootdata.parentKey, "didn't change parent key " + oldrootdata.parentKey);
      });
      test.assert(diag.nodes.count === 5, "didn't create new Node");
      test.assert(diag.links.count === 5, "didn't create new Link");
      var oldroot = diag.findNodeForKey(1);
      test.assert(oldroot && oldroot.linksConnected.count === 4, "old root should now have four links");
      var newroot = diag.findNodeForKey(newkey);
      test.assert(newroot && newroot.linksConnected.count === 1, "new root doesn't have a child");
      test.assert(newroot.findLinksTo(oldroot).count === 0, "should be one link going from newroot to oldroot");
      test.assert(oldroot.findLinksTo(newroot).count === 1, "should be no link going from oldroot to newroot");
    }
  ));



  tc = new TestCollection('Nodes Only');
  treetests.add(tc);

  tc.add(new Test('no added node', myDiagram, CommonSetupTreeNone,
    null,
    CommonCheckSimpleThreeNodes
  ));

  tc.add(new Test('add node', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      m.addNodeData({ key: 4, text: "n4" });
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleFourNodes
  ));

  tc.add(new Test('add node undo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({ key: 4, text: "n4" });
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  tc.add(new Test('add node undo redo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      m.addNodeData({ key: 4, text: "n4" });
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleFourNodes
  ));

  tc.add(new Test('remove node', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);
    },
    CommonCheckSimpleTwoNodes
  ));

  tc.add(new Test('remove node undo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckSimpleThreeNodes
  ));

  tc.add(new Test('remove node undo redo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.removeNodeData(d3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckSimpleTwoNodes
  ));


  tc = new TestCollection('Links');
  treetests.add(tc);

  tc.add(new Test('no links', myDiagram, CommonSetupTreeNone,
    null,
    CommonCheckNoLink
  ));

  tc.add(new Test('add link', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 1);
      m.commitTransaction(test.name);
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('add link undo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 1);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckNoLink
  ));

  tc.add(new Test('add link undo redo', myDiagram, CommonSetupTreeNone,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('one link', myDiagram, CommonSetupTreeOne,
    null,
    CommonCheckGraph1to2
  ));

  tc.add(new Test('one link reverse', myDiagram, CommonSetupTreeOneReverse,
    null,
    CommonCheckGraph1to2
  ));

  tc.add(new Test('remove link', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, undefined);
      m.commitTransaction(test.name);
    },
    CommonCheckNoLink
  ));

  tc.add(new Test('remove link undo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, undefined);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('remove link undo redo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, undefined);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();
    },
    CommonCheckNoLink
  ));

  tc.add(new Test('reconnect link to', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, undefined);
      var d3 = m.findNodeDataForKey(3);
      m.setParentKeyForNodeData(d3, 1);
      m.commitTransaction(test.name);
    },
    CommonCheckGraph1to3
  ));

  tc.add(new Test('reconnect link from', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 3);
      m.commitTransaction(test.name);
    },
    function(test) {
      var d = test.diagram;
      var n1 = d.findNodeForKey(1);
      var n2 = d.findNodeForKey(2);
      var n3 = d.findNodeForKey(3);

      test.assert(d.links.count === 1, 'should have one link');
      var lit = test.diagram.links;
      var link = lit.next() ? lit.value : null;
      test.assert(link !== null, 'cannot find only link');
      test.assert(link.data === n2.data, 'bound to model child data');

      var from = link.fromNode;
      test.assert(from !== null && from === n3 && from.data !== null && from.data.key === 3, 'link is not coming from 3');

      var to = link.toNode;
      test.assert(to !== null && to === n2 && to.data !== null && to.data.key === 2, 'link is not going to node 2');

      CheckLinks(test, 1, 0, 0, 0, [], [], []);
      CheckLinks(test, 2, 1, 0, 1, [3], [], [3]);
      CheckLinks(test, 3, 1, 1, 0, [2], [2], []);
    }
  ));

  tc.add(new Test('reconnect link to undo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, undefined);
      var d3 = m.findNodeDataForKey(3);
      m.setParentKeyForNodeData(d3, 1);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('reconnect link from undo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 3);
      m.commitTransaction(test.name);

      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('reconnect link and undo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      var d3 = m.findNodeDataForKey(3);
      m.setParentKeyForNodeData(d3, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
    },
    CommonCheckGraph1to2
  ));

  tc.add(new Test('reconnect link undo redo', myDiagram, CommonSetupTreeOne,
    function(test) {
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;

      m.startTransaction(test.name);
      var d2 = m.findNodeDataForKey(2);
      m.setParentKeyForNodeData(d2, 3);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.redo();

      m.startTransaction(test.name);
      m.setParentKeyForNodeData(d2, undefined);
      var d3 = m.findNodeDataForKey(3);
      m.setParentKeyForNodeData(d3, 1);
      m.commitTransaction(test.name);

      mgr.undo();
      mgr.undo();
      mgr.redo();
      mgr.redo();
    },
    CommonCheckGraph1to3
  ));

  tc.add(new Test("updateAllReferencesFromData", myDiagram,
    function(test) {
      test.diagram.layout = new go.TreeLayout();
      test.diagram.model = new go.TreeModel([
        { key: "Alpha" },
        { key: "Omega" },  // must be second
        { key: "Beta" },
        { key: "Gamma", parent: "Alpha" }
      ]);
      test.diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var delta = diagram.findNodeForKey("Delta");
      var omega = diagram.findNodeForKey("Omega");
      test.assert(diagram.nodes.count === 4 && diagram.links.count === 1 && omega instanceof go.Node && delta === null, "should have four nodes and one link");
      var link = diagram.links.first();
      test.assert(link.fromNode === alpha && link.toNode === gamma, "link doesn't go from Alpha to Gamma");

      var model = diagram.model;
      model.startTransaction();
      var bdata = model.findNodeDataForKey("Beta");
      bdata.parent = "Alpha";
      var gdata = model.findNodeDataForKey("Gamma");
      gdata.parent = undefined;
      model.nodeDataArray.splice(1, 1);  // take out the second object, "Omega"
      model.nodeDataArray.push({ key: "Delta", parent: "Beta" })  // add "Delta", child of "Beta"
      test.diagram.updateAllRelationshipsFromData();
      model.commitTransaction();

      alpha = diagram.findNodeForKey("Alpha");
      beta = diagram.findNodeForKey("Beta");
      gamma = diagram.findNodeForKey("Gamma");
      delta = diagram.findNodeForKey("Delta");
      omega = diagram.findNodeForKey("Omega");
      test.assert(diagram.nodes.count === 4 && diagram.links.count === 2 && omega === null && delta instanceof go.Node, "should have four nodes and two links");
      var link = alpha.linksConnected.first();
      test.assert(link.fromNode === alpha && link.toNode === beta, "link doesn't go from Alpha to Beta");
      var link2 = delta.linksConnected.first();
      test.assert(link2.fromNode === beta && link2.toNode === delta, "link2 doesn't go from Beta to Delta");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.commandHandler.undo();

      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var omega = diagram.findNodeForKey("Omega");
      test.assert(diagram.nodes.count === 4 && diagram.links.count === 1, "should have four nodes and one link");
      var link = diagram.links.first();
      test.assert(link.fromNode === alpha && link.toNode === gamma, "link doesn't go from Alpha to Gamma");
    }
  ));


  tc = new TestCollection('Node Order');
  treetests.add(tc);

  tc.add(new Test("reversed nodeDataArray", myDiagram,
    function(test) {
      var m = new go.TreeModel();
      m.nodeParentKeyProperty = "parentKey";
      m.nodeDataArray = [
        { key: 4, parentKey: 3, text: "n4" },
        { key: 3, parentKey: 1, text: "n3" },
        { key: 2, parentKey: 1, text: "n2" },
        { key: 1, text: "n1" }
      ];
      test.diagram.model = m;

      var layout = new go.TreeLayout();
      layout.doLayout(test.diagram);
    },
    null,
    CommonCheckTree
  ));

  tc.add(new Test("reversed data split", myDiagram,
    function(test) {
      var m = new go.TreeModel();
      m.nodeParentKeyProperty = "parentKey";
      m.nodeDataArray = [
        { key: 4, parentKey: 3, text: "n4" },
        { key: 3, parentKey: 1, text: "n3" }
      ];
      test.diagram.model = m;

      var layout = new go.TreeLayout();
      layout.doLayout(test.diagram);
    },
    function(test) {
      var m = test.diagram.model;
      m.startTransaction();
      m.addNodeDataCollection([
        { key: 2, parentKey: 1, text: "n2" },
        { key: 1, text: "n1" }
      ]);
      test.diagram.updateAllRelationshipsFromData();
      var layout = new go.TreeLayout();
      layout.doLayout(test.diagram);
      m.commitTransaction("added two");
    },
    CommonCheckTree
  ));


  var fd = new TestCollection('build/bind');
  modeltests.add(fd);
  var $ = go.GraphObject.make;

  go.GraphObject.defineBuilder("BorderedText", function(args) {
    var srcpropname = go.GraphObject.takeBuilderArgument(args, "text");
    return $(go.Panel, "Auto",
             $(go.Shape, { name: "SHAPE", fill: "white" }),
             $(go.TextBlock, { name: "TEXTBLOCK", margin: 4 },
               new go.Binding("text", srcpropname))
           );
  });

  go.GraphObject.defineBuilder("FancyPanel", function(args) {
    return $(go.Panel, "Auto",
             $(go.Shape, { name: "SHAPE", fill: "orange" }),
             $(go.Panel, "Horizontal",
               { margin: 2 },
               $("BorderedText", "left"),
               $("BorderedText", "middle",
                 { "SHAPE.fill": "red" },
                 new go.Binding("SHAPE.stroke", "midstroke"),
                 new go.Binding("SHAPE.strokeWidth", "midstroke", function(s) { return s ? 3 : 1; })),
               $("BorderedText", "right",
                 { name: "TEXTPANEL" })
             )
           );
  });

  fd.add(new Test('builder', null,
    function(test) {
      var diagram = test.diagram;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          { background: "lightgray" },
          $(go.TextBlock,
            { name: "TEXTBLOCK" },  // make sure this name doesn't interfere with set/bind of same name inside FancyPanel
            new go.Binding("text")),
          $("FancyPanel", { name: "P1" }),
          $("FancyPanel", { name: "P2" },
            // these object names resolve to the first object found -- no way to distinguish between names in BorderedText instances
            {
              "SHAPE.fill": "lightgreen",
              "TEXTPANEL.angle": 30,
              "TEXTBLOCK.font": "bold italic 15pt sans-serif"
            },
            new go.Binding("TEXTPANEL.scale", "rscale"),
            new go.Binding("TEXTBLOCK.stroke", "rstroke")
          )
        );
      diagram.model.nodeDataArray = [
        { key: 1, text: "Node #1", left: "Left Text", middle: "Mid Text", midstroke: "blue", right: "Right Text" },
        { key: 2, text: "Node #2", left: "left", middle: "mid", midstroke: "green", right: "right", rscale: 2, rstroke: "blue" }
      ];
    },
    function(test) {
      var diagram = test.diagram;
      var n2 = diagram.findNodeForKey(2);
      test.assert(n2 !== null && n2.elements.count === 3, "Node should have three elements");

      test.assert(n2.elt(0) instanceof go.TextBlock && n2.elt(0).text === "Node #2", "third element should be a TextBlock showing 'Node #2'");

      var first = n2.elt(1).elt(1);
      test.assert(first.elements.count === 3, "first panel should have three elements inside Auto Panel");
      var firstmiddle = first.elt(1);
      test.assert(firstmiddle.elt(0) instanceof go.Shape &&
                  firstmiddle.elt(0).stroke === "green" &&
                  firstmiddle.elt(0).strokeWidth === 3,
                  "middle border should be green and thick");
      test.assert(firstmiddle.elt(1) instanceof go.TextBlock &&
                  firstmiddle.elt(1).text === "mid",
                  "middle text should be 'mid'");

      var second = n2.elt(2).elt(1);
      test.assert(second.elements.count === 3, "second panel should have three elements inside Auto Panel");
      var secondleft = second.elt(0);
      test.assert(secondleft.elt(1) instanceof go.TextBlock &&
                  secondleft.elt(1).text === "left" &&
                  secondleft.elt(1).stroke === "blue",
                  "left text should be 'left' and blue");
      var secondright = second.elt(2);
      test.assert(secondright.elt(1) instanceof go.TextBlock &&
                  secondright.elt(1).text === "right" &&
                  secondright.elt(1).stroke === "black" &&
                  secondright.angle === 30 &&
                  secondright.scale === 2,
                  "right text should be 'right' and scaled to 2 at angle of 30");
    },
    function(test) {
    }
  ));

  fd.add(new Test('modelData', null,
    function(test) {
      var diagram = test.diagram;
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          $(go.TextBlock,
            { font: "bold 14pt sans-serif", stroke: "green" },  // default text color
            new go.Binding("text"),
            new go.Binding("stroke", "tcolor").ofModel(),  // but may be overridden by model property
            new go.Binding("stroke", "tcolor"),  // and that may be overridden by node-specific data property
            new go.Binding("font").ofModel()),
          $(go.Panel, "Horizontal",
            new go.Binding("itemArray"),
            { itemTemplate: $(go.Panel, "Auto",
                              $(go.Shape, { fill: "white" },
                                new go.Binding("fill", "fcolor").ofModel().makeTwoWay()),
                              $(go.TextBlock, { margin: 3 },
                                new go.Binding("text", ""))
                            )
            })
        );

      diagram.model = $(go.GraphLinksModel,
        {
          modelData: { fcolor: "cyan" },  // no tcolor, no font
          nodeDataArray: [
            { key: 1, text: "Node 1", itemArray: ["A", "B", "C"] },  // no tcolor
            { key: 2, text: "Node 2", itemArray: ["x", "y"], tcolor: "red" }
          ]
        }
      );
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      test.assert(n1.elt(0).stroke === "green", "Node 1 text should be green");
      test.assert(n2.elt(0).stroke === "red", "Node 2 text should be red");
      var n1item2 = n1.elt(1).elt(1);
      test.assert(n1item2.elt(0).fill === "cyan", "Node 1 second item fill should be cyan");

      diagram.startTransaction("modify modelData");
      diagram.model.setDataProperty(diagram.model.modelData, "tcolor", "blue");
      diagram.model.setDataProperty(diagram.model.modelData, "fcolor", "orange");
      diagram.commitTransaction("modify modelData");
      test.assert(n1.elt(0).stroke === "blue", "Node 1 text should be blue");
      test.assert(n2.elt(0).stroke === "red", "Node 2 text should be red");
      test.assert(n1item2.elt(0).fill === "orange", "Node 1 second item fill should be orange");

      diagram.startTransaction("modify modelData");
      n1item2.elt(0).fill = "yellow";  // test TwoWay Binding in itemTemplate to modelData
      diagram.commitTransaction("modify modelData");
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);
      var n2 = diagram.findNodeForKey(2);
      test.assert(n1.elt(0).stroke === "blue", "Node 1 text should be blue");
      test.assert(n2.elt(0).stroke === "red", "Node 2 text should be red");
      var n1item2 = n1.elt(1).elt(1);
      test.assert(n1item2.elt(0).fill === "yellow", "Node 1 second item fill should be yellow");
      test.assert(n1.elt(1).elt(2).elt(0).fill === "yellow", "Node 1 third item fill should be yellow");
      test.assert(n2.elt(1).elt(1).elt(0).fill === "yellow", "Node 2 second item fill should be yellow");
      test.assert(diagram.model.modelData.fcolor === "yellow", "modelData.fcolor should have been modified to be yellow due to TwoWay Binding");

      // ensure ofModel bindigns don't break with clipboard
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
      test.assert(diagram.nodes.count === 4);
    }
  ));


  fd.add(new Test("change item property", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "items"),
            {
              margin: 5,
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock, { editable: true },
                    new go.Binding("text").makeTwoWay()))
            }
          )
        );

      diagram.model = new go.Model([
        { key: 1, items: [{text:"zero"}, {text:"one"}, {text:"two"}] },
        { key: 2, items: [{text: "alone"}] }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      var item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      var tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      diagram.startTransaction();
      tb1.text = "111";
      diagram.commitTransaction();
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111", "didn't replace item in itemArray");
      var item = panel.elt(1);
      test.assert(item.data.text === "111", "didn't replace Panel.data for item");
      var tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't change TextBlock.text");

      diagram.commandHandler.undo();

      panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "one", "didn't restore item in itemArray");
      item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      diagram.commandHandler.redo();

      panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111", "didn't replace item in itemArray");
      item = panel.elt(1);
      test.assert(item.data.text === "111" && item.itemIndex === 1, "didn't replace Panel.data for item");
      tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't restore TextBlock.text edit");
    }));

  fd.add(new Test("change item property converted", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "items"),
            {
              margin: 5,
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock, { editable: true },
                    new go.Binding("text", "text", function(s) { return "WWW" + s; })
                        .makeTwoWay(function(s) { return s.substring(3); })))
            }
          )
        );

      diagram.model = new go.Model([
        { key: 1, items: [{ text: "zero" }, { text: "one" }, { text: "two" }] },
        { key: 2, items: [{ text: "alone" }] }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      var item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      var tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "WWWone", "textblock #1 isn't 'one'");

      diagram.startTransaction();
      tb1.text = "WWW111";
      diagram.commitTransaction();
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111", "didn't replace item in itemArray");
      var item = panel.elt(1);
      test.assert(item.data.text === "111", "didn't replace Panel.data for item");
      var tb1 = item.elt(0);
      test.assert(tb1.text === "WWW111", "didn't change TextBlock.text");

      diagram.commandHandler.undo();

      panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "one", "didn't restore item in itemArray");
      item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "WWWone", "textblock #1 isn't 'one'");

      diagram.commandHandler.redo();

      panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111", "didn't replace item in itemArray");
      item = panel.elt(1);
      test.assert(item.data.text === "111" && item.itemIndex === 1, "didn't replace Panel.data for item");
      tb1 = item.elt(0);
      test.assert(tb1.text === "WWW111", "didn't restore TextBlock.text edit");
    }));


  fd.add(new Test("replace item value directly", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "items"),
            {
              margin: 5,
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock, { editable: true },
                    new go.Binding("text", "").makeTwoWay()))
            }
          )
        );

      diagram.model = new go.Model([
        { key: 1, items: ["zero", "one", "two"] },
        { key: 2, items: ["alone"] }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      var item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      var tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      diagram.startTransaction();
      tb1.text = "111";
      diagram.commitTransaction();
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0] === "zero" && panel.itemArray[2] === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1] === "111", "didn't replace item in itemArray");
      var item = panel.elt(1);
      test.assert(item.data === "111", "didn't replace Panel.data for item");
      var tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't change TextBlock.text");

      diagram.commandHandler.undo();

      panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      diagram.commandHandler.redo();

      panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0] === "zero" && panel.itemArray[2] === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1] === "111", "didn't replace item in itemArray");
      item = panel.elt(1);
      test.assert(item.data === "111", "didn't replace Panel.data for item");
      tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't change TextBlock.text");
    }));

  fd.add(new Test("replace item value directly converted", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "items"),
            {
              margin: 5,
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock, { editable: true },
                    new go.Binding("text", "", function(s) { return "WWW" + s; })
                        .makeTwoWay(function(s) { return s.substring(3); })))
            }
          )
        );

      diagram.model = new go.Model([
        { key: 1, items: ["zero", "one", "two"] },
        { key: 2, items: ["alone"] }
      ]);
      diagram.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      var item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      var tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "WWWone", "textblock #1 isn't 'one'");

      diagram.startTransaction();
      tb1.text = "WWW111";
      diagram.commitTransaction();
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0] === "zero" && panel.itemArray[2] === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1] === "111", "didn't replace item in itemArray");
      var item = panel.elt(1);
      test.assert(item.data === "111", "didn't replace Panel.data for item");
      var tb1 = item.elt(0);
      test.assert(tb1.text === "WWW111", "didn't change TextBlock.text");

      diagram.commandHandler.undo();

      panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "WWWone", "textblock #1 isn't 'one'");

      diagram.commandHandler.redo();

      panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0] === "zero" && panel.itemArray[2] === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1] === "111", "didn't replace item in itemArray");
      item = panel.elt(1);
      test.assert(item.data === "111", "didn't replace Panel.data for item");
      tb1 = item.elt(0);
      test.assert(tb1.text === "WWW111", "didn't change TextBlock.text");
    }));


  fd.add(new Test("replace object item", null,  // requires the backConverter to return a new Object
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            new go.Binding("itemArray", "items"),
            {
              margin: 5,
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock, { editable: true },
                    new go.Binding("text", "", function(d) { return d.text; })
                        .makeTwoWay(function(s) { return { text: s, created: true }; })))  // note: this object should replace original item in itemArray
            }
          )
        );

      diagram.model = new go.Model([
        { key: 1, items: [{ text: "zero" }, { text: "one" }, { text: "two" }] },
        { key: 2, items: [{ text: "alone" }] }
      ]);
      diagram.undoManager.isEnabled = true;

      test.savedItem = diagram.model.nodeDataArray[0].items[1];
      test.assert(test.savedItem.text === "one");
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      var item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      var tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      diagram.startTransaction();
      tb1.text = "111";
      diagram.commitTransaction();
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.first();
      var panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111" && panel.itemArray[1].created, "didn't replace item in itemArray");
      var item = panel.elt(1);
      test.assert(item.data.text === "111" && item.data.created, "didn't replace Panel.data for item");
      var tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't change TextBlock.text");

      test.assert(test.savedItem !== diagram.model.nodeDataArray[0].items[1] && test.savedItem.text === "one", "modified original item?");

      diagram.commandHandler.undo();

      panel = node.elt(1);
      test.assert(panel instanceof go.Panel && panel.elements.count === 3, "don't have three panels for the three items");
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "one" && !panel.itemArray[1].created, "didn't restore item in itemArray");
      item = panel.elt(1);
      test.assert(item instanceof go.Panel && item.data.text === "one" && !item.data.created && item.itemIndex === 1, "panel #1 isn't bound to 'one'");
      tb1 = item.elt(0);
      test.assert(tb1 instanceof go.TextBlock && tb1.text === "one", "textblock #1 isn't 'one'");

      // back to original item object
      test.assert(test.savedItem === diagram.model.nodeDataArray[0].items[1] && test.savedItem.text === "one", "modified original item?");

      diagram.commandHandler.redo();

      panel = node.elt(1);
      test.assert(panel.itemArray.length === 3 && panel.itemArray[0].text === "zero" && panel.itemArray[2].text === "two", "didn't leave existing items alone");
      test.assert(panel.itemArray[1].text === "111" && panel.itemArray[1].created, "didn't replace item in itemArray");
      item = panel.elt(1);
      test.assert(item.data.text === "111" && item.data.created && item.itemIndex === 1, "didn't replace Panel.data for item");
      tb1 = item.elt(0);
      test.assert(tb1.text === "111", "didn't restore TextBlock.text edit");

      test.assert(test.savedItem !== diagram.model.nodeDataArray[0].items[1] && test.savedItem.text === "one", "modified original item?");
    }));

  fd.add(new Test("ofModel Adornment", null,
    function(test) {
	  var diag = test.diagram;
	  diag.reset();
	  var $ = go.GraphObject.make
	  diag.initialContentAlignment = go.Spot.Top;
	  diag.padding = 20;
	  diag.nodeTemplate =
	    $(go.Node, "Auto",
		  { width: 100, height: 50 },
		  new go.Binding("location"),
		  $(go.Shape, { fill: "lightgray" }),
		  $(go.TextBlock, new go.Binding("text")),
		  {
		  	selectionAdornmentTemplate:
			  $(go.Adornment, "Spot",
				$(go.Placeholder),
				$(go.TextBlock, "count", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right },
					new go.Binding("text", "count")),
				$(go.TextBlock, "counter", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left },
					new go.Binding("text", "counter").ofModel()),
				$(go.TextBlock, { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top },
				    new go.Binding("text", "location", function(l) { return l.toString(); }).ofObject())
			  )
		  }
		);
	  // only SelectAll after all of the nodes are in their correct locations, especially N2 out of viewport
	  diag.addDiagramListener("InitialLayoutCompleted", function(e) { e.diagram.commandHandler.selectAll(); });
	  diag.model = new go.GraphLinksModel([
	    { key: 1, text: "One", location: new go.Point(0, 0), count: -12 },
	    { key: 2, text: "Two", location: new go.Point(100, 2000) }
	  ]);
	  diag.model.modelData.counter = 1;
	},
    function(test) {
	  var diag = test.diagram;
	  var n1 = diag.findNodeForKey(1);
	  var n2 = diag.findNodeForKey(2);
	  test.assert(n1 !== null && n1.adornments.count === 1, "N1 doesn't have a selection Adornment");
	  test.assert(n2 !== null && n2.adornments.count === 0, "N2 does have a selection Adornment, but shouldn't because it's out of viewport");
	  var a1 = n1.adornments.first();
	  test.assert(a1.elt(1).text === "-12" && a1.elt(2).text === "1" && a1.elt(3).text === "Point(0,0)", "N1's Adornment didn't get data bindings");

	  diag.commandHandler.scrollToPart(n2);
	},
    function(test) {
	  var diag = test.diagram;
	  var n1 = diag.findNodeForKey(1);
	  var n2 = diag.findNodeForKey(2);
	  test.assert(n2 !== null && n2.adornments.count === 1, "N2 doesn't have a selection Adornment, but should now that it's in viewport");
	  var a2 = n2.adornments.first();
	  test.assert(a2.elt(1).text === "count" && a2.elt(2).text === "1" && a2.elt(3).text === "Point(100,2000)", "N2's Adornment didn't get data bindings");
	}
  ));

  fd.add(new Test("ofModel Adornment modified", null,
    function(test) {
	  var diag = test.diagram;
	  diag.reset();
	  var $ = go.GraphObject.make
	  diag.initialContentAlignment = go.Spot.Top;
	  diag.padding = 20;
	  diag.nodeTemplate =
	    $(go.Node, "Auto",
		  { width: 100, height: 50 },
		  new go.Binding("location"),
		  $(go.Shape, { fill: "lightgray" }),
		  $(go.TextBlock, new go.Binding("text")),
		  {
		  	selectionAdornmentTemplate:
			  $(go.Adornment, "Spot",
				$(go.Placeholder),
				$(go.TextBlock, "count", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right },
					new go.Binding("text", "count")),
				$(go.TextBlock, "counter", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left },
					new go.Binding("text", "counter").ofModel()),
				$(go.TextBlock, { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top },
				    new go.Binding("text", "location", function(l) { return l.toString(); }).ofObject())
			  )
		  }
		);
	  // only SelectAll after all of the nodes are in their correct locations, especially N2 out of viewport
	  diag.addDiagramListener("InitialLayoutCompleted", function(e) { e.diagram.commandHandler.selectAll(); });
	  diag.model = new go.GraphLinksModel([
	    { key: 1, text: "One", location: new go.Point(0, 0), count: -12 },
	    { key: 2, text: "Two", location: new go.Point(100, 2000) }
	  ]);
	  diag.model.modelData.counter = 1;
	},
    function(test) {
	  var diag = test.diagram;
	  var n1 = diag.findNodeForKey(1);
	  test.assert(n1 !== null && n1.adornments.count === 1, "N1 doesn't have a selection Adornment");
	  var a1 = n1.adornments.first();
	  test.assert(a1.elt(1).text === "-12" && a1.elt(2).text === "1" && a1.elt(3).text === "Point(0,0)", "N1's Adornment didn't get initial bindings");

	  diag.model.commit(function(m) {
	      var c = m.modelData.counter+1;
		  m.set(m.modelData, "counter", c);
		  m.nodeDataArray.forEach(function(d) {
			m.set(d, "count", c.toString());
		  });
      });
	},
    function(test) {
	  var diag = test.diagram;
	  var n1 = diag.findNodeForKey(1);
	  test.assert(n1 !== null && n1.adornments.count === 1, "N1 doesn't have a selection Adornment");
	  var a1 = n1.adornments.first();
	  test.assert(a1.elt(1).text === "2" && a1.elt(2).text === "2" && a1.elt(3).text === "Point(0,0)", "N1's Adornment didn't get updated");
	}
  ));

  fd.add(new Test("parseEnum", null,
    null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var $ = go.GraphObject.make;
      diag.linkTemplate =
        $(go.Link,
          new go.Binding('curve', 'curve', go.Binding.parseEnum(go.Link, go.Link.None)).makeTwoWay(go.Binding.toString),
          new go.Binding('routing', 'routing', go.Binding.parseEnum(go.Link, go.Link.Normal)).makeTwoWay(go.Binding.toString),
          $(go.Shape)
        );
      diag.model = new go.GraphLinksModel(
        [{ key: 1 }, { key: 2 }],
        [{ from: 1, to: 2, curve: "JumpOver", routing: "Orthogonal" }]
      );
      var n = diag.findNodeForKey(2);
      if (n !== null) n.position = new go.Point(100, 100);
    },
    function(test) {
      var diag = test.diagram;
      var n = diag.findNodeForKey(2);
      test.assert(n, "missing node 2");
      var l = n.linksConnected.first();
      test.assert(l && l.curve === go.Link.JumpOver && l.routing === go.Link.Orthogonal, "didn't parse and apply Enum values for Link.curve and Link.routing");
      diag.commit(function(d) {
        l.curve = go.Link.JumpGap;
        l.routing = go.Link.Normal;
      });
      // since 3.0, enums are now written out as number strings via Binding.toString
      // these are properly handled by parseEnum
      test.assert(l && l.data.curve === "10" && l.data.routing === "1", "didn't stringify new Enum values for Link.curve and Link.routing");
      diag.model.commit(function(m) {
        m.set(m.linkDataArray[0], "curve", "Bezier");
        m.set(m.linkDataArray[0], "routing", "AvoidsNodes");
      });
      test.assert(l && l.curve === go.Link.Bezier && l.routing === go.Link.AvoidsNodes, "didn't handle new values for Link.curve and Link.routing");
    }
  ));

  // Next 2 tests: Ensure position and location two way bindings show up as model changes
  fd.add(new Test("position binding model change", null,
  null,
  function(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.undoManager.isEnabled = true;
    var $ = go.GraphObject.make;
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding('position', 'pos', function(data) {
            return new go.Point(data.x, data.y);
          }).makeTwoWay(function(val, data, model) {
            return { x: val.x, y: val.y };
          }),
        $(go.Shape,
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange" }
    ], [ ]);
  },
  function(test) {
    var diagram = test.diagram;
    diagram.addModelChangedListener(function(e) {
      if (!e.isTransactionFinished) return;
      var modelChange = 0;
      e.object.changes.each(function(c) {
        if (c.model !== null) {
          modelChange++;
          test.assert(c.propertyName === "pos", "should be a model change with property name 'pos'");
        }
      });
      test.assert(modelChange === 1, "should have had one model change")
    });
    diagram.startTransaction('test');
    var coll = [];
    coll.push(diagram.nodes.first());
    diagram.moveParts(coll, new go.Point(50, 0));
    diagram.commitTransaction('test');
  }
));

fd.add(new Test("location binding model change", null,
null,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.undoManager.isEnabled = true;
  var $ = go.GraphObject.make;
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding('location', 'pos', function(data) {
          return new go.Point(data.x, data.y);
        }).makeTwoWay(function(val, data, model) {
          return { x: val.x, y: val.y };
        }),
      $(go.Shape,
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text").makeTwoWay())
    );

  diagram.model = new go.GraphLinksModel(
  [
    { key: 1, text: "Alpha", color: "lightblue" },
    { key: 2, text: "Beta", color: "orange" }
  ], [ ]);
},
function(test) {
  var diagram = test.diagram;
  diagram.addModelChangedListener(function(e) {
    if (!e.isTransactionFinished) return;
    var modelChange = 0;
    e.object.changes.each(function(c) {
      if (c.model !== null) {
        modelChange++;
        test.assert(c.propertyName === "pos", "should be a model change with property name 'pos'");
      }
    });
    test.assert(modelChange === 1, "should have had one model change")
  });
  diagram.startTransaction('test');
  var coll = [];
  coll.push(diagram.nodes.first());
  diagram.moveParts(coll, new go.Point(50, 0));
  diagram.commitTransaction('test');
}
));








  var fc = new TestCollection('category');
  modeltests.add(fc);

  function setupCategories(test) {
    var diag = test.diagram;
    diag.reset();
    diag.nodeTemplateMap.add("", $(go.Node, $(go.Shape, { name: "DEFAULT", fill: "blue" })));
    diag.nodeTemplateMap.add("CAT2", $(go.Node, $(go.Shape, "Circle", { name: "DEFAULT", fill: "red" })));
    diag.model = new go.GraphLinksModel([{ key: 1 }, { key: 2, category: "CAT2" }]);
    diag.findNodeForKey(2).isSelected = true;
  }

  fc.add(new Test("simple", null, setupCategories,
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "None", "node 1's Shape isn't figure None: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "Circle", "node 2's Shape isn't figure Circle: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");

      diag.model.commit(function(m) {
        m.set(n2.data, "category", "");
      }, "changed category for n2");
    },
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "None", "node 1's Shape isn't figure None: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "None", "node 2's Shape isn't figure None: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");
    }
  ));

  fc.add(new Test("simple 2", null, setupCategories,
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "None", "node 1's Shape isn't figure None: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "Circle", "node 2's Shape isn't figure Circle: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");

      diag.model.commit(function(m) {
        m.set(n1.data, "category", "CAT2");
      }, "changed category for n2");
    },
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "Circle", "node 1's Shape isn't figure Circle: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "Circle", "node 2's Shape isn't figure Circle: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");
    }
  ));

  fc.add(new Test("default category", null, setupCategories,
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "None", "node 1's Shape isn't figure None: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "Circle", "node 2's Shape isn't figure Circle: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");

      diag.model.commit(function(m) {
        m.set(n2.data, "category", "BOGUS CATEGORY");
      }, "changed category for n2");
    },
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var n2 = diag.findNodeForKey(2);
      test.assert(n1 && n1.elt(0).figure === "None", "node 1's Shape isn't figure None: " + n1.elt(0).figure);
      test.assert(n2 && n2.elt(0).figure === "None", "node 2's Shape isn't figure None: " + n2.elt(0).figure);
      test.assert(n2.isSelected && n2.findAdornment("Selection") !== null, "missing selection Adornment");
    }
  ));

  fc.add(new Test("unmodeled", null, setupCategories,
    function(test) {
      var diag = test.diagram;
      var newnode = $(go.Node, $(go.Shape, "Triangle", { name: "DEFAULT", fill: "green" }));
      test.assert(newnode instanceof go.Node && newnode.elt(0).figure === "Triangle" &&
        newnode.diagram === null && newnode.category === "", "didn't copy second template");
      newnode.category = "NONEXISTENT";
      test.newnode = newnode;
    },
    function(test) {
      var n3 = test.newnode;
      test.assert(n3 && n3.elt(0).figure === "Triangle" && n3.category === "NONEXISTENT", "unmodeled category isn't NONEXISTENT");
    }
  ));

  var copytests = new TestCollection('Deep Copying');
  modeltests.add(copytests);

  copytests.add(new Test('no nesting', null,
    // setup
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.model = new go.Model([
        { key: 0, text: "Alpha" }
      ])
      diagram.undoManager.isEnabled = true;
    },
    null,
    // check
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      var listener = function(e) {
        if (e.isTransactionFinished) {
          var changes = e.model.toIncrementalData(e); // toIncrementalData does copying
          if (changes !== null) {
            test.assert(changes.modifiedNodeData.length === 1, "expected one changed node");
            var orig = e.model.nodeDataArray[0];
            var copy = changes.modifiedNodeData[0];
            test.assert(copy !== orig, "modified node should be a copy");
            test.assert(copy.__gohashid === undefined, "copy should not contain __gohashid");
          }
        }
      };
      diagram.addModelChangedListener(listener);
      var data = model.findNodeDataForKey(0);
      model.commit(function(m) {
        m.set(data, "text", "Beta");
      }, "update property");
      diagram.removeModelChangedListener(listener);
    }
  ));

  copytests.add(new Test('update nested', null,
    // setup
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.model = new go.Model([
        { key: 0, obj: { text: "one", color: "red" } }
      ])
      diagram.undoManager.isEnabled = true;
    },
    null,
    // check
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      var listener = function(e) {
        if (e.isTransactionFinished) {
          var changes = e.model.toIncrementalData(e); // toIncrementalData does copying
          if (changes !== null) {
            test.assert(changes.modifiedNodeData.length === 1, "expected changed data");
            var orig = e.model.nodeDataArray[0];
            var copy = changes.modifiedNodeData[0];
            test.assert(copy !== orig, "modified node should be a copy");
            test.assert(copy.obj !== orig.obj, "nested object should be a copy");
          }
        }
      };
      diagram.addModelChangedListener(listener);
      var data = model.findNodeDataForKey(0).obj;
      model.commit(function(m) {
        m.set(data, "text", "test");
      }, "update property");
      diagram.removeModelChangedListener(listener);
    }
  ));

  // @@ no immutable updates yet, so copies are all full copies for now
  // copytests.add(new Test('update only one nested', null,
  //   // setup
  //   function(test) {
  //     var diagram = test.diagram;
  //     diagram.reset();
  //     diagram.model = new go.Model([
  //       { key: 0, obj: { text: "one", color: "red" }, obj2: { text: "two", color: "blue" } }
  //     ])
  //     diagram.undoManager.isEnabled = true;
  //   },
  //   null,
  //   // check
  //   function(test) {
  //     var diagram = test.diagram;
  //     var model = diagram.model;
  //     var listener = function(e) {
  //       if (e.isTransactionFinished) {
  //         var changes = e.model.toIncrementalData(e); // toIncrementalData does copying
  //         if (changes !== null) {
  //           test.assert(changes.modifiedNodeData.length === 1, "expected one changed node");
  //           var orig = e.model.nodeDataArray[0];
  //           var copy = changes.modifiedNodeData[0];
  //           test.assert(copy !== orig, "modified node should be a copy");
  //           test.assert(copy.obj !== orig.obj, "nested data 1 should be a copy");
  //           test.assert(copy.obj2 === orig.obj2, "nested data 2 should not be a copy");
  //         }
  //       }
  //     };
  //     diagram.addModelChangedListener(listener);
  //     var data = model.findNodeDataForKey(0).obj;
  //     model.commit(function(m) {
  //       m.set(data, "text", "test");
  //     }, "update property");
  //     diagram.removeModelChangedListener(listener);
  //   }
  // ));

  copytests.add(new Test('update shared', null,
    // setup
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var shared = { share: 1 };
      diagram.model = new go.Model([
        { key: 0, obj: shared, obj2: shared }
      ])
      diagram.undoManager.isEnabled = true;
    },
    null,
    // check
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      var listener = function(e) {
        if (e.isTransactionFinished) {
          var changes = e.model.toIncrementalData(e); // toIncrementalData does copying
          if (changes !== null) {
            test.assert(changes.modifiedNodeData.length === 1, "expected one changed node");
            var orig = e.model.nodeDataArray[0];
            var copy = changes.modifiedNodeData[0];
            test.assert(copy !== orig, "modified node should be a copy");
            test.assert(copy.obj === copy.obj2, "modified node should have shared object");
          }
        }
      };
      diagram.addModelChangedListener(listener);
      var data = model.findNodeDataForKey(0).obj;
      model.commit(function(m) {
        m.set(data, "share", 999);
      }, "update property");
      diagram.removeModelChangedListener(listener);
    }
  ));

  copytests.add(new Test('update cycle', null,
    // setup
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var cyc1 = { a: 1, c: 2 };
      var cyc2 = { b: 1 };
      cyc1.a = cyc2;
      cyc2.b = cyc1;
      diagram.model = new go.Model([
        { key: 0, obj: cyc1 }
      ])
      diagram.undoManager.isEnabled = true;
    },
    null,
    // check
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      var listener = function(e) {
        if (e.isTransactionFinished) {
          var changes = e.model.toIncrementalData(e); // toIncrementalData does copying
          if (changes !== null) {
            test.assert(changes.modifiedNodeData.length === 1, "expected one changed node");
            var orig = e.model.nodeDataArray[0];
            var copy = changes.modifiedNodeData[0];
            test.assert(copy !== orig, "modified node should be a copy");
            test.assert(copy.obj === copy.obj.a.b, "modified node should have cycle");
          }
        }
      };
      diagram.addModelChangedListener(listener);
      var data = model.findNodeDataForKey(0).obj;
      model.commit(function(m) {
        m.set(data, "c", 999);
      }, "update property");
      diagram.removeModelChangedListener(listener);
    }
  ));

  copytests.add(new Test("merge of cloneDeep", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.layout = $(go.TreeLayout);
      diag.nodeTemplate =
        $(go.Node, "Auto",
          { width: 100, height: 50 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, { fill: "lightgray" }),
            //??? new go.Binding("strokeDashArray")
          $(go.TextBlock, new go.Binding("text"))
          //??? $(go.Panel, new go.Binding("itemArray"))
        );
      diag.model = new go.TreeModel([
        { key: 0, text: "root" },
        { key: 1, text: "one", parent: 0 },
        { key: 2, text: "two", parent: 0 }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      test._changes = "";
      diag.model.addChangedListener(function(e) {
        if (e.isTransactionFinished) {
          test._changes = "";
          if (e.object) test._changes = e.object.toString(1);
        }
      });
      diag.model.commit(function(m) {
        m.mergeNodeDataArray(m.cloneDeep(m.nodeDataArray));
      });
      test.assert(test._changes === "", "transaction should not have recorded any changes due to setting strokeDashArray to a new Array with same numbers, \n" + test._changes)
    }
  ));


  var rt = new TestCollection('replacing');
  modeltests.add(rt);

  rt.add(new Test("isSelected binding", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node,
          new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
          new go.Binding("background", "isHighlighted", function(h) { return h ? "cyan" : null; }).ofObject(),
          new go.Binding("isSelected").makeTwoWay(),
          new go.Binding("isHighlighted").makeTwoWay(),
          $(go.TextBlock, new go.Binding("text", "key"))
        );
      diag.model = new go.Model([
        { key: "Alpha" },
        { key: "Beta", isSelected: true },
        { key: "Gamma", isHighlighted: true },
        { key: "Delta", isSelected: true, isHighlighted: true }
      ]);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.selection.count === 2 && diag.highlighteds.count === 2, "didn't select 2 and highlight 2");
      diag.commit(function(d) {
        d.findNodeForKey("Beta").isSelected = false;
        d.findNodeForKey("Beta").isHighlighted = true;
        d.findNodeForKey("Gamma").isHighlighted = false;
        d.findNodeForKey("Gamma").isSelected = true;
      });
      test.assert(diag.selection.count === 2 && diag.highlighteds.count === 2, "didn't select 2 and highlight 2");
      var mod = diag.model;
      test.assert(mod.findNodeDataForKey("Beta").isSelected === false && mod.findNodeDataForKey("Gamma").isSelected === true, "isSelected not in data");
      test.assert(mod.findNodeDataForKey("Beta").isHighlighted === true && mod.findNodeDataForKey("Gamma").isHighlighted === false, "isHighlighted not in data");
      var beta = diag.findNodeForKey("Beta");
      var gamma = diag.findNodeForKey("Gamma");
      test.assert(beta.layerName === "" && gamma.layerName === "Foreground", "selectionChanged didn't update layerName");
      test.assert(diag.findLayer("").parts.count === 2 && diag.findLayer("Foreground").parts.count === 2, "should have 2 in each Layer");
      test.assert(new go.Set(diag.findLayer("").parts).has(beta), "wrong node in default Layer");
      test.assert(new go.Set(diag.findLayer("Foreground").parts).has(gamma), "wrong node in Foreground");
      test.assert(beta.background === "cyan" && gamma.background === null, "wrong node with cyan background");

      diag.model = new go.Model([
        { key: "Zeta", isSelected: true, isHighlighted: true },
        { key: "Eta" }
      ]);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.nodes.count === 2, "didn't get new model?");
      test.assert(diag.selection.count === 1 && diag.highlighteds.count === 1, "didn't select 1 and highlight 1");
      test.assert(diag.findLayer("").parts.count === 1 && diag.findLayer("Foreground").parts.count === 1, "should have 1 in each Layer");
    }
  ));

  rt.add(new Test("selectionChanged", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node,
          {
            selectionChanged: function(node) { node.layerName = node.isSelected ? "Foreground" : ""; },
            highlightedChanged: function(node) { node.background = node.isHighlighted ? "cyan" : null; }
          },
          new go.Binding("isSelected").makeTwoWay(),
          new go.Binding("isHighlighted").makeTwoWay(),
          $(go.TextBlock, new go.Binding("text", "key"))
        );
      diag.model = new go.Model([
        { key: "Alpha" },
        { key: "Beta", isSelected: true },
        { key: "Gamma", isHighlighted: true },
        { key: "Delta", isSelected: true, isHighlighted: true }
      ]);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.selection.count === 2 && diag.highlighteds.count === 2, "didn't select 2 and highlight 2");
      diag.commit(function(d) {
        d.findNodeForKey("Beta").isSelected = false;
        d.findNodeForKey("Beta").isHighlighted = true;
        d.findNodeForKey("Gamma").isHighlighted = false;
        d.findNodeForKey("Gamma").isSelected = true;
      });
      test.assert(diag.selection.count === 2 && diag.highlighteds.count === 2, "didn't select 2 and highlight 2");
      var mod = diag.model;
      test.assert(mod.findNodeDataForKey("Beta").isSelected === false && mod.findNodeDataForKey("Gamma").isSelected === true, "isSelected not in data");
      test.assert(mod.findNodeDataForKey("Beta").isHighlighted === true && mod.findNodeDataForKey("Gamma").isHighlighted === false, "isHighlighted not in data");
      var beta = diag.findNodeForKey("Beta");
      var gamma = diag.findNodeForKey("Gamma");
      test.assert(beta.layerName === "" && gamma.layerName === "Foreground", "selectionChanged didn't update layerName");
      test.assert(diag.findLayer("").parts.count === 2 && diag.findLayer("Foreground").parts.count === 2, "should have 2 in each Layer");
      test.assert(new go.Set(diag.findLayer("").parts).has(beta), "wrong node in default Layer");
      test.assert(new go.Set(diag.findLayer("Foreground").parts).has(gamma), "wrong node in Foreground");
      test.assert(beta.background === "cyan" && gamma.background === null, "wrong node with cyan background");

      diag.model = new go.Model([
        { key: "Zeta", isSelected: true, isHighlighted: true },
        { key: "Eta" }
      ]);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.nodes.count === 2, "didn't get new model?");
      test.assert(diag.selection.count === 1 && diag.highlighteds.count === 1, "didn't select 1 and highlight 1");
      test.assert(diag.findLayer("").parts.count === 1 && diag.findLayer("Foreground").parts.count === 1, "should have 1 in each Layer");
    }
  ));

  function makeCloneObj() {
    var sharedPorts = [{ portColor: '#d488a2', portId: 'top0' }];
    var greet = function() { console.log('Hello world'); };
    var nda = [
      { key: 1, name: 'unit One', loc: '101 204',
        func: greet,
        test: { foo: { bar: 'baz' } },
        leftArray: [ { portColor: '#425e5c', portId: 'left0' } ],
        topArray: sharedPorts,
        bottomArray: [ { portColor: '#316571', portId: 'bottom0' } ],
        rightArray: [ { portColor: '#923951', portId: 'right0' }, { portColor: '#ef3768', portId: 'right1' } ]
      },
      { key: 2, name: 'unit Two', loc: '320 152',
        func: greet,
        leftArray: [ { portColor: '#7d4bd6', portId: 'left0' }, { portColor: '#cc585c', portId: 'left1' },
                     { portColor: '#b1273a', portId: 'left2' } ],
        topArray: sharedPorts,
        bottomArray: [ { portColor: '#dd45c7', portId: 'bottom0' }, { portColor: '#995aa6', portId: 'bottom1' },
                       { portColor: '#6b95cb', portId: 'bottom2' } ],
        rightArray: [  ] },
      { key: 3, name: 'unit Three', loc: '384 319',
        leftArray: [ { portColor: '#bd8f27', portId: 'left0' }, { portColor: '#c14617', portId: 'left1' },
                     { portColor: '#47fa60', portId: 'left2' } ],
        topArray: [ { portColor: '#d08154', portId: 'top0' } ],
        bottomArray: [ { portColor: '#6cafdb', portId: 'bottom0' } ],
        rightArray: [  ] },
      { key: 4, name: 'unit Four', loc: '138 351',
        leftArray: [ { portColor: '#491389', portId: 'left0' } ],
        topArray: [ { portColor: '#77ac1e', portId: 'top0' } ],
        bottomArray: [ { portColor: '#e9701b', portId: 'bottom0' } ],
        rightArray: [ { portColor: '#24d05e', portId: 'right0' }, { portColor: '#cfabaa', portId: 'right1' } ] }
    ];
    return nda;
  }

  var clonetests = new TestCollection('cloneDeep');
  modeltests.add(clonetests);

  clonetests.add(new Test("basic case", null, null, null,
    function(test) {
      var diag = test.diagram;

      var nda = makeCloneObj();

      var nda2 = diag.model.cloneDeep(nda);
      test.assert(nda !== nda2, "nda2 shouldn't be same as original");
      test.assert(nda[0] !== nda2[0], "nda2[0] shouldn't be same as original");
      test.assert(nda[0].test.foo !== nda2[0].test.foo, "nda[2].test.foo shouldn't be same as original");
      test.assert(nda[0].topArray !== nda2[0].topArray, "nda2[0].topArray shouldn't be same as original");
      test.assert(nda[0].func === nda[1].func, "func should be shared in original");
      test.assert(nda2[0].func === nda2[1].func, "func should be shared in clone");
      test.assert(nda[0].topArray === nda[1].topArray, "topArray should be shared in original");
      test.assert(nda2[0].topArray === nda2[1].topArray, "topArray should be shared in clone");
    }
  ));

  clonetests.add(new Test("inextensible objects", null, null, null,
    function(test) {
      var diag = test.diagram;

      var nda = makeCloneObj();
      Object.preventExtensions(nda);
      Object.preventExtensions(nda[0]);
      Object.preventExtensions(nda[0].func);
      Object.preventExtensions(nda[0].topArray);

      var nda2 = diag.model.cloneDeep(nda);
      test.assert(nda !== nda2, "nda2 shouldn't be same as original");
      test.assert(nda[0] !== nda2[0], "nda2[0] shouldn't be same as original");
      test.assert(nda[0].test.foo !== nda2[0].test.foo, "nda[2].test.foo shouldn't be same as original");
      test.assert(nda[0].topArray !== nda2[0].topArray, "nda2[0].topArray shouldn't be same as original");
      test.assert(nda[0].func === nda[1].func, "func should be shared in original");
      test.assert(nda2[0].func === nda2[1].func, "func should be shared in clone");
      test.assert(nda[0].topArray === nda[1].topArray, "topArray should be shared in original");
      test.assert(nda2[0].topArray === nda2[1].topArray, "topArray should be shared in clone");
    }
  ));


  var posloctests = new TestCollection("pos & loc");
  modeltests.add(posloctests);

  function checkPosLocInitial(test, state) {
    if (!state) state = "";
    var diag = test.diagram;
    var d0 = diag.model.nodeDataArray[0];
    var d1 = diag.model.nodeDataArray[1];
    var n0 = diag.findNodeForData(d0);
    var n1 = diag.findNodeForData(d1);
    if (d0.pos) test.assert(d0.pos === "0 0" && d1.pos === "200 0",
                            state + ": pos should be at 0 0 and 200 0");
    if (d0.loc) test.assert(d0.loc === "40.5 91.5" && d1.loc === "240.5 91.5",
                            state + ": loc should be at 40.5 91.5 and 240.5 91.5");
    test.assert(n0.position.equalsApprox(new go.Point(0, 0)) && n1.position.equalsApprox(new go.Point(200, 0)),
                state + ": position should be at 0 0 and 200 0  actually: " + n0.position.toString() + " " + n1.position.toString());
    test.assert(n0.location.equalsApprox(new go.Point(40.5, 91.5)) && n1.location.equalsApprox(new go.Point(240.5, 91.5)),
                state + ": location should be at 40.5 91.5 and 240.5 91.5  actually: " + n0.location.toString() + " " + n1.location.toString());
  }

  function checkPosLocMoved(test) {
    var diag = test.diagram;
    var d0 = diag.model.nodeDataArray[0];
    var d1 = diag.model.nodeDataArray[1];
    var n0 = diag.findNodeForData(d0);
    var n1 = diag.findNodeForData(d1);
    if (d0.pos) test.assert(d0.pos === "20 30" && d1.pos === "200 0",
                            "pos should be at 20 30 and 200 0");
    if (d0.loc) test.assert(d0.loc === "60.5 121.5" && d1.loc === "240.5 91.5",
                            "loc should be at 60.5 121.5 and 240.5 91.5");
    test.assert(n0.position.equalsApprox(new go.Point(20, 30)) && n1.position.equalsApprox(new go.Point(200, 0)),
                "pos should be at 20 30 and 200 0  actually: " + n0.position.toString() + " " + n1.position.toString());
    test.assert(n0.location.equalsApprox(new go.Point(60.5, 121.5)) && n1.location.equalsApprox(new go.Point(240.5, 91.5)),
                "loc should be at 60.5 121.5 and 240.5 91.5  actually: " + n0.location.toString() + " " + n1.location.toString());

    var txn = diag.undoManager.history.last();
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0,
      propertyName: "position",
      oldValue: new go.Point(0, 0),
      newValue: new go.Point(20, 30)
    }), txn), "d n0 position");
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0,
      propertyName: "location",
      oldValue: new go.Point(40.5, 91.5),
      newValue: new go.Point(60.5, 121.5)
    }), txn), "d n0 location");
    if (d0.pos) {
      test.assert(findChanged($(go.ChangedEvent, {
        change: go.ChangedEvent.Property,
        model: diag.model,
        object: d0,
        propertyName: "pos",
        oldValue: "0 0",
        newValue: "20 30"
      }), txn), "m d0 pos");
    }
    if (d0.loc) {
      test.assert(findChanged($(go.ChangedEvent, {
        change: go.ChangedEvent.Property,
        model: diag.model,
        object: d0,
        propertyName: "loc",
        oldValue: "40.5 91.5",
        newValue: "60.5 121.5"
      }), txn), "m d0 loc");
    }
  }

  function checkPosLocResized(test) {
    var diag = test.diagram;
    var d0 = diag.model.nodeDataArray[0];
    var d1 = diag.model.nodeDataArray[1];
    var n0 = diag.findNodeForData(d0);
    var n1 = diag.findNodeForData(d1);
    if (d0.pos) test.assert(d0.pos === "-10 10" && d1.pos === "200 0",
                            "pos should be at -10 10 and 200 0");
    if (d0.loc) test.assert(d0.loc === "40.5 91.5" && d1.loc === "240.5 91.5",
                            "loc should be at 40.5 91.5 and 240.5 91.5");  // unchanged
    test.assert(n0.position.equalsApprox(new go.Point(-10, 10)) && n1.position.equalsApprox(new go.Point(200, 0)),
                "pos should be at -10 10 and 200 0");
    test.assert(n0.location.equalsApprox(new go.Point(40.5, 91.5)) && n1.location.equalsApprox(new go.Point(240.5, 91.5)),
                "loc should be at 40.5 91.5 and 240.5 91.5 " + n0.location.toString() + " " + n1.location.toString());

    var txn = diag.undoManager.history.last();
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0.resizeObject,
      propertyName: "desiredSize",
      oldValue: new go.Size(50, 50),
      newValue: new go.Size(100, 40)
    }), txn), "d n0 desiredSize");
    if (d0.sz) {
      test.assert(findChanged($(go.ChangedEvent, {
        change: go.ChangedEvent.Property,
        model: diag.model,
        object: d0,
        propertyName: "sz",
        oldValue: undefined, //??? "50 50",
        newValue: "100 40"
      }), txn), "m d0 sz");
    }
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0,
      propertyName: "position",
      oldValue: new go.Point(0, 0),
      newValue: new go.Point(-10, 10)
    }), txn), "d n0 position");
    // test.assert(findChanged($(go.ChangedEvent, {  // location should be unchanged
    //   change: go.ChangedEvent.Property,
    //   diagram: diag,
    //   object: n0,
    //   propertyName: "location",
    //   oldValue: new go.Point(40.5, 91.5),
    //   newValue: new go.Point(60.5, 121.5)
    // }), txn), "d n0 location");
    if (d0.pos) {
      test.assert(findChanged($(go.ChangedEvent, {
        change: go.ChangedEvent.Property,
        model: diag.model,
        object: d0,
        propertyName: "pos",
        oldValue: "0 0",
        newValue: "-10 10"
      }), txn), "m d0 pos");
    }
    // if (d0.loc) {  // loc should be unchanged
    //   test.assert(findChanged($(go.ChangedEvent, {
    //     change: go.ChangedEvent.Property,
    //     model: diag.model,
    //     object: d0,
    //     propertyName: "loc",
    //     oldValue: "40.5 91.5",
    //     newValue: "60.5 121.5"
    //   }), txn), "m d0 loc");
    // }
  }

  function checkPosLocRotated(test) {
    var diag = test.diagram;
    var d0 = diag.model.nodeDataArray[0];
    var d1 = diag.model.nodeDataArray[1];
    var n0 = diag.findNodeForData(d0);
    var n1 = diag.findNodeForData(d1);
    if (d0.pos) test.assert(d0.pos === "0 -18.667295593006372" && d1.pos === "200 0",
                            "pos should be at 0 -18+ and 200 0");
    if (d0.loc) test.assert(d0.loc === "40.5 91.5" && d1.loc === "240.5 91.5",
                            "loc should be at 40.5 91.5 and 240.5 91.5");  // unchanged
    test.assert(n0.position.equalsApprox(new go.Point(0, -18.667295593006372)) && n1.position.equalsApprox(new go.Point(200, 0)),
                "pos should be at 0 -18+ and 200 0");
    test.assert(n0.location.equalsApprox(new go.Point(40.5, 91.5)) && n1.location.equalsApprox(new go.Point(240.5, 91.5)),
                "loc should be at 40.5 91.5 and 240.5 91.5 " + n0.location.toString() + " " + n1.location.toString());

    var txn = diag.undoManager.history.last();
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0,
      propertyName: "position",
      oldValue: new go.Point(0, 0),
      newValue: new go.Point(0, -18.667295593006372)
    }), txn), "d n0 position");
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      diagram: diag,
      object: n0.rotateObject,
      propertyName: "angle",
      oldValue: 0,
      newValue: 30
    }), txn), "d n0 angle");
    test.assert(findChanged($(go.ChangedEvent, {
      change: go.ChangedEvent.Property,
      model: diag.model,
      object: d0,
      propertyName: "ang",
      oldValue: undefined,
      newValue: 30
    }), txn), "m d0 ang");
    if (d0.pos) {
      test.assert(findChanged($(go.ChangedEvent, {
        change: go.ChangedEvent.Property,
        model: diag.model,
        object: d0,
        propertyName: "pos",
        oldValue: "0 0",
        newValue: "0 -18.667295593006372"
      }), txn), "m d0 pos");
    }
    // if (d0.loc) {  // loc should be unchanged
    //   test.assert(findChanged($(go.ChangedEvent, {
    //     change: go.ChangedEvent.Property,
    //     model: diag.model,
    //     object: d0,
    //     propertyName: "loc",
    //     oldValue: "40.5 91.5",
    //     newValue: "60.5 121.5"
    //   }), txn), "m d0 loc");
    // }
  }

  function findChanged(e, txn) {
    var it = txn.changes.iterator;
    while (it.next()) {
      var c = it.value;
      if (c.change === e.change && c.diagram === e.diagram && c.model === e.model &&
          c.modelChange === e.modelChange && c.object === e.object &&
          c.propertyName === e.propertyName &&
          (!c.oldValue ? c.oldValue === e.oldValue :
           (c.oldValue.equalsApprox ? c.oldValue.equalsApprox(e.oldValue) : c.oldValue === e.oldValue)) &&
          c.oldParam === e.oldParam &&
          (!c.newValue ? c.newValue === e.newValue :
           (c.newValue.equalsApprox ? c.newValue.equalsApprox(e.newValue) : c.newValue === e.newValue)) &&
          c.newParam === e.newParam) {
            return c;
          }
    }
    return null;
  }

  posloctests.add(new Test("pos binding position", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.position = new go.Point(20, 30);
      }, "moved n0 to 20,30");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    }
  ));

  posloctests.add(new Test("pos binding size", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

//console.log(diag.undoManager.history.last().toString(3))

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocResized(test);
    }
  ));

  posloctests.add(new Test("pos binding angle", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.rotateObject.angle = 30;
      }, "rotated n0 to 30");

      checkPosLocRotated(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

//console.log(diag.undoManager.history.last().toString(3))

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocRotated(test);
    }
  ));


  posloctests.add(new Test("loc binding location", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.location = new go.Point(60.5, 121.5);
      }, "moved n0 to 60.5,121.5");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    }
  ));

  posloctests.add(new Test("loc binding size", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

//console.log(diag.undoManager.history.last().toString(3))

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocResized(test);
    }
  ));

  posloctests.add(new Test("loc binding angle", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.rotateObject.angle = 30;
      }, "rotated n0 to 30");

      checkPosLocRotated(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

//console.log(diag.undoManager.history.last().toString(3))

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocRotated(test);
    }
  ));


  posloctests.add(new Test("pos loc binding position", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.position = new go.Point(20, 30);
      }, "moved n0 to 20,30");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  posloctests.add(new Test("pos loc binding location", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.location = new go.Point(60.5, 121.5);
      }, "moved n0 to 60.5,121.5");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  posloctests.add(new Test("loc pos binding position", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.position = new go.Point(20, 30);
      }, "moved n0 to 20,30");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  posloctests.add(new Test("loc pos binding location", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.location = new go.Point(60.5, 121.5);
      }, "moved n0 to 60.5,121.5");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  posloctests.add(new Test("init loc pos loc binding position", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, loc: "40.5 91.5" },
        { key: 2, loc: "240.5 91.5" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.position = new go.Point(20, 30);
      }, "moved n0 to 20,30");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  posloctests.add(new Test("init pos loc pos binding location", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          { locationObjectName: "BOTTOM", locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          { resizable: true, resizeObjectName: "TOP" },
          { rotatable: true, rotateObjectName: "TOP" },
          $(go.Shape, { name: "TOP", fill: "lightgray", width: 50, height: 50 },
            new go.Binding("desiredSize", "sz", go.Size.parse).makeTwoWay(go.Size.stringify),
            new go.Binding("angle", "ang").makeTwoWay()),
          $(go.Panel, "Spot",
            $(go.Shape, { name: "BOTTOM", fill: "lightyellow", width: 80, height: 80 }),
            $(go.TextBlock, new go.Binding("text", "key"))
          )
        );

      diag.model = new go.Model([
        { key: 1, pos: "0 0" },
        { key: 2, pos: "200 0" }
      ]);
      diag.undoManager.isEnabled = true;
    },
    function(test) {
      var diag = test.diagram;
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test);

      diag.commit(function(diag) {
        n0.location = new go.Point(60.5, 121.5);
      }, "moved n0 to 60.5,121.5");

      checkPosLocMoved(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");

      test.assert(diag.undoManager.canRedo(), "should be able to redo");
      diag.undoManager.redo();

      checkPosLocMoved(test);
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();
      var n0 = diag.findNodeForKey(1);
      checkPosLocInitial(test)

      diag.commit(function(diag) {
        n0.resizeObject.desiredSize = new go.Size(100, 40);
      }, "resized n0 to 100x40");

      checkPosLocResized(test);

      test.assert(diag.undoManager.canUndo(), "should be able to undo");
      diag.undoManager.undo();

      checkPosLocInitial(test, "undo");
    }
  ));

  // Make sure changing the location changes the node.location, data.location, and shows up in the incremental JSON
  posloctests.add(new Test("incremental JSON change loc", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc" /*, go.Point.parse*/).makeTwoWay(/*go.Point.stringify*/),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );
      diagram.model = $(go.GraphLinksModel, {
          //linkKeyProperty: "key",  // v3.0: toIncremental... sets this property to "key" if it's ""
          nodeDataArray: [ { key: 1, text: "Alpha", color: "lightblue" }, ]
        });
    },
    null,
    function(test) {
      var diagram = test.diagram;
      diagram.addModelChangedListener(function(e) {
        if (e.isTransactionFinished) {
          test.assert(e.model.toIncrementalJson(e).indexOf('"class":"go.Point","x":2,"y":3') >= 0);
          // v3.0: instead of signaling error when linkKeyProperty === "", it's automatically set to "key"
          test.assert(e.model.toIncrementalJson(e).search(/"linkKeyProperty" *: *"key"/) >= 0);
        }
      });
      diagram.commit(function(diag) {
        diagram.moveParts(diagram.nodes, new go.Point(2, 3));
      }, "move");
      var n = diagram.nodes.first();
      test.assert(n.location.equals(new go.Point(2, 3)));
      test.assert(n.data.loc.equals(new go.Point(2, 3)));

    }
  ));


})(); // end tests


