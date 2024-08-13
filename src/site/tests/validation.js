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
  var troot = new TestCollection("Validation");
  TestRoot.add(troot);
  var $ = go.GraphObject.make;


  // Diagram.validCycle
  var cycles = new TestCollection("Cycles");
  troot.add(cycles);

  // create a diagram: A --> B --> C and unconnected D
  function SetupCycles(test, linkpred) {
    var d = test.diagram;
    d.reset();
    d.initialContentAlignment = go.Spot.Center;
    d.nodeTemplate =
      $(go.Node,
        $(go.TextBlock, new go.Binding("text", "key")));
    if (linkpred) d.nodeTemplate.linkValidation = linkpred;
    var model = new go.GraphLinksModel();
    model.nodeDataArray = [{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }];
    model.linkDataArray = [{ from: "A", to: "B" }, { from: "B", to: "C" }];
    d.model = model;
  }

  function SetupCyclesAll(test, linkpred) {
    SetupCycles(test, linkpred);
    var d = test.diagram;
    var it = d.nodes;
    while (it.next()) {
      var n = it.value;
      n.fromLinkableDuplicates = true;
      n.toLinkableDuplicates = true;
      n.fromLinkableSelfNode = true;
      n.toLinkableSelfNode = true;
    }
  }

  function CheckValidLink(test, from, to, OK) {
    if (OK === undefined/*notpresent*/) OK = true;
    var tool = test.diagram.toolManager.linkingTool;
    if (OK) {
      test.assert(tool.isValidLink(from, from, to, to), "should be OK to draw new link from " + from + " to " + to);
    } else {
      test.assert(!tool.isValidLink(from, from, to, to), "should not be OK to draw new link from " + from + " to " + to);
    }
  }

  cycles.add(new Test("default", null, SetupCycles,
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.validCycle === go.Diagram.CycleAll, "default validCycle should be All");
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      var tool = diagram.toolManager.linkingTool;
      test.assert(A !== null && B !== null && C !== null && D !== null && tool !== null, "missing nodes or LinkingTool?");
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("All", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.validCycle === go.Diagram.CycleAll, "default validCycle should be All");
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      var tool = diagram.toolManager.linkingTool;
      test.assert(A !== null && B !== null && C !== null && D !== null && tool !== null, "missing nodes or LinkingTool?");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D);
    },
    null));

  cycles.add(new Test("NotDirected", null, SetupCycles,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleNotDirected;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("NotDirectedAll", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleNotDirected;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("NotUndirected", null, SetupCycles,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleNotUndirected;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("NotUndirectedAll", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleNotUndirected;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("DestinationTree", null, SetupCycles,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleDestinationTree;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B, false);
      CheckValidLink(test, D, C, false);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("DestinationTreeAll", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleDestinationTree;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B, false);
      CheckValidLink(test, D, C, false);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("SourceTree", null, SetupCycles,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleSourceTree;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D, false);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D, false);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("SourceTreeAll", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleSourceTree;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, A, D, false);
      CheckValidLink(test, B, A, false);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, B, C, false);
      CheckValidLink(test, B, D, false);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, C, B, false);
      CheckValidLink(test, C, C, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    null));

  cycles.add(new Test("isTreeLink dest", null,
    function(test) {
      SetupCycles(test);
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleDestinationTree;
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B, false);
      CheckValidLink(test, D, C, false);
      CheckValidLink(test, A, C, false);
      CheckValidLink(test, C, A, false);
    },
    function(test) {
      var diagram = test.diagram;
      var $ = go.GraphObject.make;
      diagram.linkTemplate = $(go.Link, { isTreeLink: false }, $(go.Shape));
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleDestinationTree;
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, A, C);
      CheckValidLink(test, C, A);
    },
    null
  ));

  cycles.add(new Test("isTreeLink source", null,
    function(test) {
      SetupCycles(test);
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleSourceTree;
      CheckValidLink(test, A, D, false);
      CheckValidLink(test, B, D, false);
      CheckValidLink(test, C, D);
      CheckValidLink(test, C, A, false);
      CheckValidLink(test, A, C, false);
    },
    function(test) {
      var diagram = test.diagram;
      var $ = go.GraphObject.make;
      diagram.linkTemplate = $(go.Link, { isTreeLink: false }, $(go.Shape));
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      diagram.validCycle = go.Diagram.CycleSourceTree;
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, D);
      CheckValidLink(test, C, A);
      CheckValidLink(test, A, C);
    },
    null
  ));


  // LinkingBaseTool.linkValidation
  var linktests = new TestCollection("Link");
  troot.add(linktests);

  linktests.add(new Test("linkValidation", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      diagram.toolManager.linkingTool.linkValidation = function (from, fromport, to, toport, link) {
        return (from.data.key !== "D");
      };
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A, false);
      CheckValidLink(test, D, B, false);
      CheckValidLink(test, D, C, false);
      CheckValidLink(test, D, D, false);
    },
    function (test) {
      var diagram = test.diagram;
      // restore original value of tool property
      diagram.toolManager.linkingTool.linkValidation = null;
    }));

  linktests.add(new Test("linkValidation2", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      diagram.toolManager.linkingTool.linkValidation = function (from, fromport, to, toport, link) {
        return (to.data.key !== "D");
      };
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D, false);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D, false);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C);
      CheckValidLink(test, C, D, false);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    function (test) {
      var diagram = test.diagram;
      // restore original value of tool property
      diagram.toolManager.linkingTool.linkValidation = null;
    }));

  linktests.add(new Test("relinkValidation", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      diagram.toolManager.relinkingTool.linkValidation = function (from, fromport, to, toport, link) {
        return (link === null || to.data.key !== "D");
      };
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      var tool = diagram.toolManager.relinkingTool;
      test.assert(tool.isValidLink(B, B, D, D), "should be OK to draw new link from B to D");
      var BClink = diagram.findLinkForData(diagram.model.linkDataArray[1]);
      test.assert(BClink !== null, "unable to find Link from B to C");
      tool.originalLink = BClink;
      test.assert(!tool.isValidLink(B, B, D, D), "should not be OK to reconnect B-C link from B to D");
    },
    function (test) {
      var diagram = test.diagram;
      // restore original values of tool property
      var tool = diagram.toolManager.relinkingTool;
      tool.linkValidation = null;
      tool.originalLink = null;
    }));

  linktests.add(new Test("NodelinkValidation", null,
    function(test) {
      SetupCyclesAll(test, function(from, fromport, to, toport, link) {
        return (from.data.key !== "D");
      });
    },
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C);
      CheckValidLink(test, C, D);
      CheckValidLink(test, D, A, false);
      CheckValidLink(test, D, B, false);
      CheckValidLink(test, D, C, false);
      CheckValidLink(test, D, D, false);
    },
    function(test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("NodelinkValidation2", null,
    function(test) {
      SetupCyclesAll(test, function(from, fromport, to, toport, link) {
        return (to.data.key !== "D");
      });
    },
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      CheckValidLink(test, A, C);
      CheckValidLink(test, A, D, false);
      CheckValidLink(test, B, A);
      CheckValidLink(test, B, B);
      CheckValidLink(test, B, C);
      CheckValidLink(test, B, D, false);
      CheckValidLink(test, C, A);
      CheckValidLink(test, C, B);
      CheckValidLink(test, C, C);
      CheckValidLink(test, C, D, false);
      CheckValidLink(test, D, A);
      CheckValidLink(test, D, B);
      CheckValidLink(test, D, C);
      CheckValidLink(test, D, D, false);
    },
    function(test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("NoderelinkValidation", null,
    function(test) {
      SetupCyclesAll(test, function(from, fromport, to, toport, link) {
        return (link === null || to.data.key !== "D");
      });
    },
    function(test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      var tool = diagram.toolManager.relinkingTool;
      test.assert(tool.isValidLink(B, B, D, D), "should be OK to draw new link from B to D");
      var BClink = diagram.findLinkForData(diagram.model.linkDataArray[1]);
      test.assert(BClink !== null, "unable to find Link from B to C");
      tool.originalLink = BClink;
      test.assert(!tool.isValidLink(B, B, D, D), "should not be OK to reconnect B-C link from B to D");
    },
    function(test) {
      var diagram = test.diagram;
      var tool = diagram.toolManager.relinkingTool;
      tool.originalLink = null;
    }));

  linktests.add(new Test("maxLinks", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      A.fromMaxLinks = 2;
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(A, A, B, B);
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("maxLinks2", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      B.toMaxLinks = 2;
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, B, B);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(A, A, B, B);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("maxLinksReflexive", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      A.fromMaxLinks = 2;
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(A, A, A, A);
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("maxLinks2Reflexive", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      B.toMaxLinks = 2;
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, B, B);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(B, B, B, B);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("maxLinksBoth", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      A.fromMaxLinks = 2;
      A.toMaxLinks = 1;
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, A, A);
      A.toMaxLinks = 0;
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(A, A, B, B);
      CheckValidLink(test, A, A, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));

  linktests.add(new Test("maxLinks2Both", null, SetupCyclesAll,
    function (test) {
      var diagram = test.diagram;
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      B.fromMaxLinks = 2;
      B.toMaxLinks = 2;
      var C = diagram.findNodeForKey("C");
      var D = diagram.findNodeForKey("D");
      CheckValidLink(test, B, B);
      B.fromMaxLinks = 1;
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, A, B);
      var tool = diagram.toolManager.linkingTool;
      tool.insertLink(A, A, B, B);
      CheckValidLink(test, B, B, false);
      CheckValidLink(test, A, B, false);
    },
    function (test) {
      var diagram = test.diagram;
    }));


  // CommandHandler.memberValidation
  var grouptests = new TestCollection("Group");
  troot.add(grouptests);

  // create a diagram: A --> B --> C and unconnected D
  function SetupGroups(test) {
    var d = test.diagram;
    d.reset();
    d.initialContentAlignment = go.Spot.Center;
    var model = new go.GraphLinksModel();
    model.nodeDataArray = [{ key: "A" }, { key: "B" }, { key: "C" },
                           { key: "G", isGroup: true }, { key: "H", group: "G", isGroup: true }];
    model.linkDataArray = [{ from: "A", to: "B" }, { from: "B", to: "C" }];
    d.model = model;
  }

  grouptests.add(new Test("groupValidation", null, SetupGroups,
    function (test) {
      var diagram = test.diagram;
      diagram.commandHandler.memberValidation = function (group, part) {
        return (part.data.key !== "A");
      };
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var G = diagram.findNodeForKey("G");
      var H = diagram.findNodeForKey("H");
      test.assert(!diagram.commandHandler.isValidMember(G, G), "Should be able to add G to itself");
      test.assert(!diagram.commandHandler.isValidMember(H, G), "Should be able to add G to H when H is a member of G!");
      test.assert(!diagram.commandHandler.isValidMember(G, A), "Should not be able to add A to G");
      test.assert(diagram.commandHandler.isValidMember(G, B), "Should be able to add B to G");
      test.assert(diagram.commandHandler.isValidMember(H, B), "Should be able to add B to H");
    },
    null));

  grouptests.add(new Test("groupValidation2", null, SetupGroups,
    function (test) {
      var diagram = test.diagram;
      diagram.commandHandler.memberValidation = function (group, part) {
        return (part.data.key !== "A");
      };
      var A = diagram.findNodeForKey("A");
      var B = diagram.findNodeForKey("B");
      var C = diagram.findNodeForKey("C");
      var G = diagram.findNodeForKey("G");
      G.memberValidation = function (group, part) {
        return (part.data.key !== "B");
      };
      var H = diagram.findNodeForKey("H");
      test.assert(!diagram.commandHandler.isValidMember(G, A), "Should not be able to add A to G, due to CommandHandler.memberValidation");
      test.assert(!diagram.commandHandler.isValidMember(G, B), "Should not be able to add B to G, due to Group.memberValidation");
      test.assert(diagram.commandHandler.isValidMember(G, C), "Should be able to add C to G");
      test.assert(!diagram.commandHandler.isValidMember(H, A), "Should not be able to add A to H, due to CommandHandler.memberValidation");
      test.assert(diagram.commandHandler.isValidMember(H, B), "Should be able to add B to H, due to no Group.memberValidation");
      test.assert(diagram.commandHandler.isValidMember(H, C), "Should be able to add C to H");
    },
    function (test) {
      var diagram = test.diagram;
    }));

/*

  t1.add(new Test("Blank", null,
    function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.clear();
        diagram.startTransaction("stuff");

        diagram.commitTransaction("stuff");
    },
    null,
    function (test) {
        var diagram = test.diagram;
        var d = diagram;

    }
    ));

*/

})();