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
  var events = new TestCollection('events');
  TestRoot.add(events);
  var $ = go.GraphObject.make;
  var diagram = null;


  function SimpleCommonSetup(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));
    diagram.model = new go.GraphLinksModel([
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "100 50" }
  ], [
    { from: "Alpha", to: "Beta" }
  ]);
  }

  function SimpleCommonSetupUndoEnabled(test) {
    SimpleCommonSetup(test);
    var diagram = test.diagram;
    diagram.undoManager.isEnabled = true;
  }

  function CheckDiagramEvent(e, name, test) {
    test.assert(e instanceof go.DiagramEvent, "DiagramEvent listener did not receive a DiagramEvent: " + e);
    test.assert(e.diagram === test.diagram, "DiagramEvent.diagram is not the test's Diagram: " + e.diagram);
    test.assert(e.name === name, "Wrong DiagramEvent.name, got: " + e.name + " expected: " + name);
  }

  function AddSelectionListeners(test, inTrans) {
    var diagram = test.diagram;
    test.changingCount = 0;
    diagram.addDiagramListener("ChangingSelection", test.changingSelListener = function(e) {
      test.changingCount++;
      if (!inTrans) test.assert(!diagram.undoManager.isInTransaction, "ChangingSelection should not be inside a transaction");
    });

    diagram.addDiagramListener("ChangedSelection", test.changedSelListener = function(e) {
      test.assert(test.changingCount > 0, "ChangedSelection should follow ChangingSelection");
      if (!inTrans) test.assert(!diagram.undoManager.isInTransaction, "ChangedSelection should not be inside a transaction");
      test.changingCount--;
    });
  }

  function RemoveSelectionListeners(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("ChangingSelection", test.changingSelListener);
    diagram.removeDiagramListener("ChangedSelection", test.changedSelListener);
    test.assert(test.changingCount === 0, "Mismatched amount of ChangingSelection and ChangedSelection events");
  }

  function DefineAllEventsTests(collname, setupfunc) {
    var t14 = new TestCollection(collname);
    events.add(t14);

  //  var allDiags = [];
  //  var allDivs = [];
  //  function setupTestDiagram(id) {
  //    allDivs[id] = document.createElement('div');
  //    allDivs[id].innerHTML = '<div id="yep' + id + '" style="border: solid 1px black; width: 400px; height: 400px"></div>';
  //    document.body.appendChild(allDivs[id]);
  //    allDiags[id] = $(go.Diagram, ("yep" + id), {
  //      "animationManager.isEnabled": true
  //    });
  //    return allDiags[id];
  //  }
  //  function getTestDiagram(id) {
  //    return allDiags[id];
  //  }
  //  function tearDownTestDiagram(id) {
  //    allDiags[id].div = null;
  //    allDiags[id] = null;
  //    document.body.removeChild(allDivs[id]);
  //    allDivs[id] = null;
  //  }

  // THIS ANIMATION TEST DOESN"T WORK YET

  //  t14.add(new Test("Animation", null,
  //  function(test) {
  //    var diagram = setupTestDiagram(0);
  //    diagram.animationManager.isEnabled = true;
  //    diagram.nodeTemplate =
  //    $(go.Node, "Auto",
  //      new go.Binding("location", "loc", go.Point.parse),
  //      $(go.Shape,
  //        { figure: "RoundedRectangle", fill: "lightgray" }),
  //      $(go.TextBlock,
  //        { margin: 5 },
  //        new go.Binding("text", "key")));
  //    diagram.model = new go.GraphLinksModel([
  //    { key: "Alpha", loc: "0 0" },
  //    { key: "Beta", loc: "100 50" }
  //    ], [
  //    { from: "Alpha", to: "Beta" }
  //    ]);
  //  },
  //  function(test) {
  //    var diagram = getTestDiagram(0);
  //    test.starting = false;
  //    test.finished = false;
  //    diagram.addDiagramListener("AnimationStarting", test.listener1 = function(e) {
  //      //CheckDiagramEvent(e, "AnimationStarting", test);
  //      test.starting = true;
  //      test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
  //      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
  //      var beta = diagram.findNodeForKey("Beta");
  //      test.assert(beta !== null && beta.location.equalsApprox(new go.Point(99.5, 0)), "shouldn't have moved Beta yet");
  //      diagram.removeDiagramListener("AnimationStarting", test.listener1);
  //    });
  //    diagram.addDiagramListener("AnimationFinished", test.listener = function(e) {
  //      //CheckDiagramEvent(e, "AnimationFinished", test);
  //      test.finished = true;
  //      test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
  //      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
  //      var beta = diagram.findNodeForKey("Beta");
  //      test.assert(beta !== null && beta.location.equalsApprox(new go.Point(99.5, 0)), "should have finished moving Beta");
  //      diagram.removeDiagramListener("AnimationFinished", test.listener);
  //    });
  //    diagram.startTransaction();
  //    diagram.layout = new go.TreeLayout();
  //    diagram.commitTransaction("layout");
  //  },
  //  function(test) {
  //    var diagram = getTestDiagram(0);
  //    test.assert(!test.starting && !test.finished, "no time yet to have called Animation... DiagramEvent listeners");
  //    window.setTimeout(function() {
  //      test.assert(test.starting && test.finished, "should have called Animation... DiagramEvent listeners " + test.starting + " " + test.finished);
  //      tearDownTestDiagram(0);
  //    }, diagram.animationManager.duration + 100);
  //  }
  //));

    t14.add(new Test("BackgroundSingleClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("BackgroundSingleClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("BackgroundSingleClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "BackgroundSingleClicked", test);
      test.assert(e.subject === null, "subject is not null");
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("BackgroundDoubleClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("BackgroundDoubleClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
      test.mouseDown(pt, { timestamp: 400 });
      test.mouseUp(pt, { timestamp: 600, clickCount: 2 });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("BackgroundDoubleClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "BackgroundDoubleClicked", test);
      test.assert(e.subject === null, "subject is not null");
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("BackgroundContextClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("BackgroundContextClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0, button: 2 });  // right mouse button
      test.mouseUp(pt, { timestamp: 200, button: 2 });
    },
    function(test) {
      if ('ontouchstart' in window) {
        test.log("***!!!???@@@ skipping context click event check");
        return;
      }
      var diagram = test.diagram;
      diagram.removeDiagramListener("BackgroundContextClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "BackgroundContextClicked", test);
      test.assert(e.subject === null, "subject is not null");
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("ObjectSingleClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("ObjectSingleClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test);
      var pt = new go.Point(12, 12);  // TextBlock of Alpha Node should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
    },
    function(test) {
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("ObjectSingleClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "ObjectSingleClicked", test);
      test.assert(e.subject instanceof go.TextBlock, "subject is not a TextBlock, but: " + e.subject);
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("ObjectDoubleClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("ObjectDoubleClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test);
      var pt = new go.Point(12, 12);  // TextBlock of Alpha Node should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
      test.mouseDown(pt, { timestamp: 400 });
      test.mouseUp(pt, { timestamp: 600, clickCount: 2 });
    },
    function(test) {
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("ObjectDoubleClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "ObjectDoubleClicked", test);
      test.assert(e.subject instanceof go.TextBlock, "subject is not a TextBlock, but: " + e.subject);
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("ObjectContextClicked", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("ObjectContextClicked", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test);
      var pt = new go.Point(12, 12);  // TextBlock of Alpha Node should be here
      test.mouseDown(pt, { timestamp: 0, button: 2 });  // right mouse button
      test.mouseUp(pt, { timestamp: 200, button: 2 });
    },
    function(test) {
      if ('ontouchstart' in window) {
        test.log("***!!!???@@@ skipping context click event check");
        return;
      }
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("ObjectContextClicked", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "ObjectContextClicked", test);
      test.assert(e.subject instanceof go.TextBlock, "subject is not a TextBlock, but: " + e.subject);
      test.assert(e.parameter === null, "parameter is not null");
    }
  ));

    t14.add(new Test("ChangedSelection", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.clearSelection();
      diagram.addDiagramListener("ChangingSelection", test.listener1 = function(e) {
        CheckDiagramEvent(e, "ChangingSelection", test);
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(diagram.selection.count === 0, "still no selection in ChangingSelection event");
      });
      diagram.addDiagramListener("ChangedSelection", test.listener = function(e) {
        CheckDiagramEvent(e, "ChangedSelection", test);
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(diagram.selection.count === 1, "should be one selected Part in ChangedSelection event");
      });
      var pt = new go.Point(12, 12);  // TextBlock of Alpha Node should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("ChangingSelection", test.listener1);
      diagram.removeDiagramListener("ChangedSelection", test.listener);
    }
  ));

    t14.add(new Test("ClipboardChanged", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("ClipboardChanged", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test);
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      // test.assert(diagram.nodes.count === 2, "should have same number of nodes, not: " + diagram.nodes.count);
      // test.assert(diagram.links.count === 1, "should have same number of links, not: " + diagram.links.count);
    },
    function(test) {
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("ClipboardChanged", test.listener);
      // var e = test.savedEvent;
      // CheckDiagramEvent(e, "ClipboardChanged", test);
      // test.assert(e.subject !== null && e.subject.count === 3, "subject is null or does not contain 3 parts");
      // test.assert(diagram.nodes.count === 2, "should have same number of nodes, not: " + diagram.nodes.count);
      // test.assert(diagram.links.count === 1, "should have same number of links, not: " + diagram.links.count);
      diagram.commandHandler.pasteSelection();
      // test.assert(diagram.nodes.count === 4, "should have twice as many nodes, not: " + diagram.nodes.count);
      // test.assert(diagram.links.count === 2, "should have twice as many links, not: " + diagram.links.count);
    }
  ));

    t14.add(new Test("ClipboardPasted", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("ClipboardPasted", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test);
      diagram.select(diagram.findNodeForKey("Alpha"));
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection(new go.Point(20, 50));  // center copied node at 20,50
    },
    function(test) {
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("ClipboardPasted", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "ClipboardPasted", test);
      test.assert(diagram.nodes.count === 3, "should have one more node, not: " + diagram.nodes.count);
      var alpha2 = diagram.findPartAt(new go.Point(20, 50), true);
      test.assert(alpha2 !== null, "found no copied/pasted Node at 25,55");
    }
  ));

    t14.add(new Test("DocumentBoundsChanged", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      test.savedDocumentBounds = diagram.computeBounds().copy();
      diagram.addDiagramListener("DocumentBoundsChanged", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      diagram.startTransaction("move node");
      diagram.findNodeForKey("Alpha").position = new go.Point(-100, -100);
      diagram.commitTransaction("move node");
      // transaction is needed in order to update the documentBounds & cause
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("DocumentBoundsChanged", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "DocumentBoundsChanged", test);
      test.assert(e.parameter instanceof go.Rect && e.parameter.equals(test.savedDocumentBounds),
                  "parameter does not equal saved documentBounds; got: " + e.parameter + ", expected: " + test.savedDocumentBounds);
      test.assert(test.isApprox(diagram.documentBounds.width, test.savedDocumentBounds.width + 100), "document should be wider after moving node");
      test.assert(test.isApprox(diagram.documentBounds.height, test.savedDocumentBounds.height + 100), "document should be taller after moving node");
    }
  ));

    //??? ExternalObjectsDropped

    t14.add(new Test("LayoutCompleted", diagram,
    function(test) {
      setupfunc(test);
      var diagram = test.diagram;
      test.diagram.addDiagramListener("InitialLayoutCompleted", test.listener1 = function(e) {
        test.savedEvent1 = e;
        //test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      test.diagram.addDiagramListener("LayoutCompleted", test.listener = function(e) {
        test.savedEvent = e;
        //test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
    },
    null,
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("InitialLayoutCompleted", test.listener1);
      diagram.removeDiagramListener("LayoutCompleted", test.listener);
      var e = test.savedEvent1;
      CheckDiagramEvent(e, "InitialLayoutCompleted", test);
      e = test.savedEvent;
      CheckDiagramEvent(e, "LayoutCompleted", test);
      test.savedEvent1 = null;
    }
  ));

    t14.add(new Test("LayoutCompleted2", diagram,
    function(test) {
      setupfunc(test);
      test.history = [];
      var diagram = test.diagram;
      diagram.addDiagramListener("InitialLayoutCompleted", test.listener1 = function(e) {
        test.history.push(e);
        //test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      diagram.addDiagramListener("LayoutCompleted", test.listener = function(e) {
        test.history.push(e);
        //test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("set layout");
      diagram.layout = new go.TreeLayout();
      diagram.commitTransaction("set layout");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("InitialLayoutCompleted", test.listener1);
      diagram.removeDiagramListener("LayoutCompleted", test.listener);
      test.assert(test.history.length === 3, "should have been three layout events, not: " + test.history.length);
      CheckDiagramEvent(test.history[0], "InitialLayoutCompleted", test);
      CheckDiagramEvent(test.history[1], "LayoutCompleted", test);
      CheckDiagramEvent(test.history[2], "LayoutCompleted", test);
    }
  ));


    t14.add(new Test("ViewportBoundsChanged", diagram, setupfunc,
    function(test) {
      var diagram = test.diagram;
      test.oldvbounds = diagram.viewportBounds.copy();
      diagram.addDiagramListener("ViewportBoundsChanged", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      diagram.startTransaction("move a node");
      var node = diagram.findNodeForKey("Alpha");
      node.position = new go.Point(-300, 0);
      diagram.commitTransaction("move a node");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("ViewportBoundsChanged", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "ViewportBoundsChanged", test);
      test.assert(typeof e.subject.scale === "number" && e.subject.scale === 1, "subject['scale'] should be a number");
      test.assert(e.subject.position instanceof go.Point, "subject['position'] should be a Point");
      test.assert(e.subject.bounds instanceof go.Rect, "subject['bounds'] should be a Rect");
      test.assert(e.subject.canvasSize instanceof go.Size, "subject['canvasSize'] should be a Size");
      test.assert(e.subject.newCanvasSize instanceof go.Size, "subject['newCanvasSize'] should be a Size");
      test.assert(typeof e.subject.isScroll === "boolean", "subject['isScroll'] should be a boolean");
      test.assert(e.parameter instanceof go.Rect, "parameter must be the old Rect");
      test.assert(e.parameter.x > -10, "old viewportBounds should start near zero");
      test.assert(diagram.viewportBounds.x < -300, "current viewportBounds should start under -300 due to moved node");
    }
  ));
  }

  DefineAllEventsTests("DiagramListeners no undo", SimpleCommonSetup);
  DefineAllEventsTests("DiagramListeners undo enabled", SimpleCommonSetupUndoEnabled);  // with UndoManager enabled


  function SetupForTool(test) {
    test.savedEvent = null;
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
    $(go.Node, "Vertical",
      { locationObjectName: "SHAPE",
        resizable: true, resizeObjectName: "SHAPE",
        rotatable: true, rotateObjectName: "SHAPE"
      },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { name: "SHAPE", figure: "RoundedRectangle", fill: "lightgray",
          width: 80, height: 80, portId: "", fromLinkable: true, toLinkable: true
        }),
      $(go.TextBlock,
        { editable: true },
        new go.Binding("text", "key")));
    diagram.linkTemplate =
    $(go.Link, go.Link.Orthogonal,
      { reshapable: true, relinkableFrom: true, relinkableTo: true },
      $(go.Shape));
    diagram.groupTemplate =
    $(go.Group, "Vertical",
      { selectionObjectName: "PANEL",
        ungroupable: true
      },
      $(go.TextBlock,
        { font: "bold 12pt sans-serif" },
        new go.Binding("text", "", go.Binding.toString)),
      $(go.Panel, "Auto",
        { name: "PANEL" },
        $(go.Shape, "Rectangle",
          { fill: "rgba(128,128,128,0.2)" }),
        $(go.Placeholder,
          { padding: new go.Margin(5) })));
    diagram.model = new go.GraphLinksModel([
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "200 100" }
  ], [
    { from: "Alpha", to: "Beta" }
  ]);

    var node = diagram.findNodeForKey("Alpha");
    node.isSelected = true;
  }

  var t15 = new TestCollection("Manipulation Tools");
  events.add(t15);

  t15.add(new Test("LinkDrawn", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    if (diagram.model.linkDataArray.length > 0) diagram.model.removeLinkData(diagram.model.linkDataArray[0]);
  },
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("LinkDrawn", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    AddSelectionListeners(test, true);  // ChangingSelection event is inside transaction during link drawing
    test.assert(diagram.model.linkDataArray.length === 0, "should be no link data");
    test.assert(diagram.links.count === 0, "should be no Links");
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });
    test.mouseMove(new go.Point(100, 75), { timestamp: 100 });  // mouse move needed for mouseMoveTools
    test.mouseUp(new go.Point(230, 130), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    RemoveSelectionListeners(test);
    diagram.removeDiagramListener("LinkDrawn", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkDrawn", test);
    test.assert(diagram.model.linkDataArray.length === 1, "ought to have one link data");
    test.assert(diagram.links.count === 1, "ought to have one Link");
    test.assert(e.subject instanceof go.Link, "subject should be the new Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "new Link should be bound to link data");
  }
));

  t15.add(new Test("LinkNotDrawn", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    if (diagram.model.linkDataArray.length > 0) diagram.model.removeLinkData(diagram.model.linkDataArray[0]);
  },
  function(test) {
    var diagram = test.diagram;
    test.savedNoEvent = null;
    diagram.addDiagramListener("LinkDrawn", test.listener = function(e) {
      test.savedNoEvent = e;
    });
    AddSelectionListeners(test, true);
    test.nolink = false;
    diagram.toolManager.linkingTool.doNoLink = function() {
      test.nolink = true;
    };
    test.assert(diagram.model.linkDataArray.length === 0, "should be no link data");
    test.assert(diagram.links.count === 0, "should be no Links");
    test.mouseDown(new go.Point(50, 50), { timestamp: 0 });
    test.mouseMove(new go.Point(20, 20), { timestamp: 100 });  // mouse move needed for mouseMoveTools
    test.mouseUp(new go.Point(0, 0), { timestamp: 1600 });  // far away
  },
  function(test) {
    var diagram = test.diagram;
    RemoveSelectionListeners(test);
    diagram.removeDiagramListener("LinkDrawn", test.listener);
    test.assert(test.savedNoEvent === null, "should not have raised LinkDrawn");
    test.assert(test.nolink, "should have called doNoLink");
    test.assert(diagram.model.linkDataArray.length === 0, "ought to have no link data");
    test.assert(diagram.links.count === 0, "ought to still have no Links");
  }
));

  t15.add(new Test("LinkRelinkedTo", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(200, 140), { timestamp: 0 });
    test.mouseUp(new go.Point(150, 250), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Beta"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkNotRelinkedTo", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    test.savedEvent = null;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
    });
    test.norelink = false;
    diagram.toolManager.relinkingTool.doNoRelink = function() {
      test.norelink = true;
    };
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(200, 140), { timestamp: 0 });
    test.mouseUp(new go.Point(-150, -250), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    test.assert(test.savedEvent === null, "should not have raised LinkRelinked");
    test.assert(test.norelink, "should have called doNoRelink");
  }
));

  t15.add(new Test("LinkRelinkedFrom", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var gamma = diagram.findNodeForKey("Gamma");
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.toNode = gamma;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(40, 80), { timestamp: 0 });
    test.mouseUp(new go.Point(250, 150), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.to === "Gamma", "modified Link should be connected to node Gamma");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Alpha"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkNotRelinkedFrom", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    test.savedEvent = null;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
    });
    test.norelink = false;
    diagram.toolManager.relinkingTool.doNoRelink = function() {
      test.norelink = true;
    };
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var gamma = diagram.findNodeForKey("Gamma");
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.toNode = gamma;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(40, 80), { timestamp: 0 });
    test.mouseUp(new go.Point(-250, -150), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    test.assert(test.savedEvent === null, "should not have raised LinkRelinked");
    test.assert(test.norelink, "should have called doNoRelink");
  }
));

  t15.add(new Test("LinkRelinkedTo nothing", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(200, 140), { timestamp: 0 });
    test.mouseUp(new go.Point(150, 450), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.to === undefined, "modified Link should not be connected to anything");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Beta"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedFrom nothing", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var gamma = diagram.findNodeForKey("Gamma");
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.toNode = gamma;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(40, 80), { timestamp: 0 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === undefined, "modified Link should come from nothing");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Alpha"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedTo nothing both", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var gamma = diagram.findNodeForKey("Gamma");
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.toNode = gamma;
    diagram.select(link);
  },
  function(test) {  // disconnect both ends
    test.mouseDown(new go.Point(40, 80), { timestamp: 0 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 1600 });
    test.mouseDown(new go.Point(140.5, 281), { timestamp: 2000 });
    test.mouseUp(new go.Point(150, 450), { timestamp: 2600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === undefined && e.subject.data.to === undefined, "modified Link should not be connected to anything");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Gamma"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedFrom nothing both", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    diagram.model.addNodeData({ key: "Gamma", loc: "100 200" });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    diagram.select(link);
  },
  function(test) {  // disconnect both ends
    test.mouseDown(new go.Point(200, 140), { timestamp: 0 });
    test.mouseUp(new go.Point(150, 450), { timestamp: 1600 });
    test.mouseDown(new go.Point(40, 80), { timestamp: 2000 });
    test.mouseUp(new go.Point(50, 450), { timestamp: 2600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === undefined && e.subject.data.to === undefined, "modified Link should come from nothing");
    test.assert(e.parameter instanceof go.Shape && e.parameter.part instanceof go.Node &&
                e.parameter.part === diagram.findNodeForKey("Alpha"),
                "parameter isn't Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedTo was nothing", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.fromNode = diagram.findNodeForKey("Alpha");
    link.toNode = null;
    var list = new go.List(/*go.Point*/);
    list.add(new go.Point(30, 350));
    list.add(new go.Point(40, 350));
    list.add(new go.Point(130, 400));
    list.add(new go.Point(140, 400));
    link.points = list;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(140, 400), { timestamp: 0 });
    test.mouseUp(new go.Point(150, 250), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === "Alpha" && e.subject.data.to === "Beta", "modified Link should connect from Alpha to Beta");
    test.assert(e.parameter === null,
                "parameter is Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedFrom was nothing", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.fromNode = null;
    link.toNode = diagram.findNodeForKey("Beta");
    var list = new go.List(/*go.Point*/);
    list.add(new go.Point(30, 350));
    list.add(new go.Point(40, 350));
    list.add(new go.Point(130, 400));
    list.add(new go.Point(140, 400));
    link.points = list;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(30, 350), { timestamp: 0 });
    test.mouseUp(new go.Point(20, 20), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === "Alpha" && e.subject.data.to === "Beta", "modified Link should connect from Alpha to Beta");
    test.assert(e.parameter === null,
                "parameter is Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedTo was nothing both", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.fromNode = null;
    link.toNode = null;
    var list = new go.List(/*go.Point*/);
    list.add(new go.Point(30, 350));
    list.add(new go.Point(40, 350));
    list.add(new go.Point(130, 400));
    list.add(new go.Point(140, 400));
    link.points = list;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(140, 400), { timestamp: 0 });
    test.mouseUp(new go.Point(150, 250), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === undefined && e.subject.data.to === "Beta", "modified Link should connect from nothing to Beta");
    test.assert(e.parameter === null,
                "parameter is Shape in old node?");
  }
));

  t15.add(new Test("LinkRelinkedFrom was nothing both", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;
    diagram.addDiagramListener("LinkRelinked", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    link.fromNode = null;
    link.toNode = null;
    var list = new go.List(/*go.Point*/);
    list.add(new go.Point(30, 350));
    list.add(new go.Point(40, 350));
    list.add(new go.Point(130, 400));
    list.add(new go.Point(140, 400));
    link.points = list;
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(30, 350), { timestamp: 0 });
    test.mouseUp(new go.Point(20, 20), { timestamp: 1600 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkRelinked", test.listener);
    diagram.toolManager.relinkingTool.isUnconnectedLinkValid = false;
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkRelinked", test);
    test.assert(e.subject instanceof go.Link, "relinked object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.subject.data.from === "Alpha" && e.subject.data.to === undefined, "modified Link should connect from Alpha to nothing");
    test.assert(e.parameter === null,
                "parameter is Shape in old node?");
  }
));

  t15.add(new Test("LinkReshaped", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.addDiagramListener("LinkReshaped", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    diagram.select(link);
  },
  function(test) {
    test.mouseDown(new go.Point(140, 40), { timestamp: 0 });
    test.mouseUp(new go.Point(120, -20), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("LinkReshaped", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "LinkReshaped", test);
    test.assert(e.subject instanceof go.Link, "reshape object should be a Link");
    test.assert(e.subject.data === diagram.model.linkDataArray[0], "modified Link should still be bound to link data");
    test.assert(e.parameter instanceof go.List && e.parameter.elt(0) instanceof go.Point, "LinkReshaped parameter isnt the List of Points");
  }
));

  t15.add(new Test("PartCreated", diagram,
  function(test) {
    //test.diagram.reset();
    test.diagram.toolManager.clickCreatingTool.archetypeNodeData =
        { text: "clicked", loc: new go.Point(100, 100) };
  },
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("PartCreated", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    AddSelectionListeners(test);
    test.assert(diagram.toolManager.clickCreatingTool.isDoubleClick,
                "ClickCreatingTool.isDoubleClick should default to true");
    test.mouseDown(new go.Point(200, 200), { timestamp: 0 });  // there are no nodes!
    test.mouseUp(new go.Point(200, 200), { timestamp: 100 });
    test.mouseDown(new go.Point(200, 200), { timestamp: 200 });
    test.mouseUp(new go.Point(200, 200), { timestamp: 300, clickCount: 2 });
  },
  function(test) {
    var diagram = test.diagram;
    RemoveSelectionListeners(test);
    diagram.removeDiagramListener("PartCreated", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "PartCreated", test);
    test.assert(diagram.nodes.count === 1, "did not create a node");
    var node = diagram.findPartAt(new go.Point(200, 200), true);
    test.assert(node instanceof go.Node, "Did not create Node at 200,200");
    test.assert(node == e.subject, "Created Node is not the subject?");
    diagram.toolManager.clickCreatingTool.archetypeNodeData = null;
  }
));

  t15.add(new Test("PartResized", diagram, SetupForTool,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("PartResized", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    test.mouseDown(new go.Point(0, 0), { timestamp: 0 });
    test.mouseUp(new go.Point(-20, -20), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("PartResized", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "PartResized", test);
    test.assert(e.subject instanceof go.Shape, "resize object should be a Shape");
    //??? shouldn't this be 100x100, not 101x101?
    test.assert(e.parameter instanceof go.Size &&
                test.isApprox(e.parameter.width, 80) && test.isApprox(e.parameter.height, 80) &&
                test.isApprox(e.subject.desiredSize.width, 101) && test.isApprox(e.subject.desiredSize.height, 101),
                "Object resized should be a 101x101 Shape that used to be 80x80");
  }
));

  t15.add(new Test("PartRotated", diagram, SetupForTool,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("PartRotated", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    test.mouseDown(new go.Point(80 + 50, 0), { timestamp: 0 });
    test.mouseUp(new go.Point(200, 200), { timestamp: 300 });
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("PartRotated", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "PartRotated", test);
    test.assert(e.subject instanceof go.Shape, "rotate object should be a Shape");
    test.assert(typeof e.parameter === 'number' &&
                test.isApprox(e.parameter, 0) &&
                test.isApprox(e.subject.angle, 45),
                "Object rotated should be a Shape that used to be at angle 0");
  }
));

  t15.add(new Test("SelectionMoved", diagram,
    function(test) {
      SetupForTool(test);
      test.diagram.clearSelection();
      var linkdata = { from: "Beta", to: "Beta" };
      test.diagram.model.addLinkData(linkdata);
      test.diagram.findLinkForData(linkdata).curviness = -50;
    },
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("SelectionMoved", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      test.mouseDown(new go.Point(200 + 40, 100 + 90), { timestamp: 0 });
      test.mouseMove(new go.Point(200 + 50, 100 + 100), { timestamp: 100 });
      test.mouseUp(new go.Point(200 + 140, 100 + 190), { timestamp: 300 });
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("SelectionMoved", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "SelectionMoved", test);
      var coll = e.subject;
      test.assert(coll instanceof go.Set, "moved collection should be a Set");
      test.assert(coll.count === 2, "should have moved a Node and a Link, not " + coll.count);
    }
  ));

  t15.add(new Test("SelectionCopied", diagram,
    function(test) {
      SetupForTool(test);
      test.diagram.clearSelection();
      var linkdata = { from: "Beta", to: "Beta" };
      test.diagram.model.addLinkData(linkdata);
      test.diagram.findLinkForData(linkdata).curviness = -50;
    },
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("SelectionCopied", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      AddSelectionListeners(test, true);  // ChangingSelection happens within transaction
      test.mouseDown(new go.Point(200 + 40, 100 + 90), { timestamp: 0 });
      test.mouseMove(new go.Point(200 + 50, 100 + 100), { timestamp: 100, control: true });
      test.mouseUp(new go.Point(200 + 140, 100 + 190), { timestamp: 300, control: true });
    },
    function(test) {
      var diagram = test.diagram;
      RemoveSelectionListeners(test);
      diagram.removeDiagramListener("SelectionCopied", test.listener);
      var e = test.savedEvent;
      CheckDiagramEvent(e, "SelectionCopied", test);
      var coll = e.subject;
      test.assert(coll instanceof go.Set, "copied collection should be a Set");
      test.assert(coll.count === 2, "should have copied a Node and a Link, not " + coll.count);
    }
  ));

  t15.add(new Test("SelectionDeletingYes", diagram, SetupForTool,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("SelectionDeleting", test.listener1 = function(e) {
        test.savedEvent1 = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      diagram.addDiagramListener("SelectionDeleted", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(e.subject instanceof go.Set && e.subject.count === 2 && e.subject.any(function(p) { return p instanceof go.Link; }),
          "DiagramEvent.subject should be a Set containing the Node and the Link");
      });
      AddSelectionListeners(test);
      var node = diagram.findNodeForKey("Alpha");
      diagram.select(node);
      diagram.commandHandler.deleteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("SelectionDeleting", test.listener1);
      diagram.removeDiagramListener("SelectionDeleted", test.listener);
      RemoveSelectionListeners(test);
      var e = test.savedEvent1;
      CheckDiagramEvent(e, "SelectionDeleting", test);
      e = test.savedEvent;
      CheckDiagramEvent(e, "SelectionDeleted", test);
      test.assert(diagram.nodes.count === 1, "1 node should remain");
      test.assert(diagram.model.nodeDataArray.length === 1, "1 node data should remain");
      test.assert(diagram.links.count === 0, "no links should remain");
      test.assert(diagram.model.linkDataArray.length === 0, "no link data should remain");
      test.savedEvent1 = null;
    }
  ));

  t15.add(new Test("SelectionDeletingNo", diagram, SetupForTool,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("SelectionDeleting", test.listener1 = function(e) {
        test.savedEvent1 = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(diagram.nodes.count === 2, "2 node should remain");
        test.assert(diagram.model.nodeDataArray.length === 2, "2 node data should remain");
        test.assert(diagram.links.count === 1, "link should not have been deleted");
        test.assert(diagram.model.linkDataArray.length === 1, "link data should not have been deleted");
        diagram.clearSelection();
      });
      diagram.addDiagramListener("SelectionDeleted", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(e.subject instanceof go.Set && e.subject.count === 0, "DiagramEvent.subject should be an empty Set");
      });
      AddSelectionListeners(test, true);  // we clear selection during the transaction, so don't check that
      var node = diagram.findNodeForKey("Alpha");
      diagram.select(node);
      diagram.commandHandler.deleteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("SelectionDeleting", test.listener1);
      diagram.removeDiagramListener("SelectionDeleted", test.listener);
      RemoveSelectionListeners(test);
      var e = test.savedEvent1;
      CheckDiagramEvent(e, "SelectionDeleting", test);
      test.assert(test.savedEvent !== undefined, "didn't call the SelectionDeleted event handler");
      test.assert(diagram.nodes.count === 2, "2 node should remain");
      test.assert(diagram.model.nodeDataArray.length === 2, "2 node data should remain");
      test.assert(diagram.links.count === 1, "link should not have been deleted");
      test.assert(diagram.model.linkDataArray.length === 1, "link data should not have been deleted");
      test.savedEvent1 = null;
    }
  ));

  t15.add(new Test("SelectionDeletedNoConnectedLinks", diagram, SetupForTool,
    function(test) {
      var diagram = test.diagram;
      diagram.commandHandler.deletesConnectedLinks = false;
      diagram.addDiagramListener("SelectionDeleted", test.listener = function(e) {
        test.savedEvent = e;
        test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
        test.assert(e.subject instanceof go.Set && e.subject.count === 1 && !e.subject.any(function(p) { return p instanceof go.Link; }),
          "DiagramEvent.subject should be a Set containing only the Node, not any Link");
      });
      AddSelectionListeners(test);
      var node = diagram.findNodeForKey("Alpha");
      diagram.select(node);
      diagram.commandHandler.deleteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      diagram.removeDiagramListener("SelectionDeleted", test.listener);
      RemoveSelectionListeners(test);
      e = test.savedEvent;
      CheckDiagramEvent(e, "SelectionDeleted", test);
      test.assert(diagram.nodes.count === 1, "1 node should remain");
      test.assert(diagram.model.nodeDataArray.length === 1, "1 node data should remain");
      test.assert(diagram.links.count === 1, "one link should remain");
      test.assert(diagram.model.linkDataArray.length === 1, "one link data should remain");
      test.savedEvent1 = null;
      diagram.commandHandler.deletesConnectedLinks = true;
    }
  ));

  t15.add(new Test("SelectionGrouped", diagram, SetupForTool,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("SelectionGrouped", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    AddSelectionListeners(test);
    diagram.commandHandler.archetypeGroupData = { key: "G1", isGroup: true };
    diagram.commandHandler.selectAll();
    diagram.commandHandler.groupSelection();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("SelectionGrouped", test.listener);
    RemoveSelectionListeners(test);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "SelectionGrouped", test);
    test.assert(e.subject instanceof go.Group, "the subject should be the new Group");
    test.assert(diagram.nodes.count === 3, "3 nodes including the new Group");
    test.assert(diagram.model.nodeDataArray.length === 3, "3 node data including the new Group");
    test.assert(diagram.findNodeForKey("Alpha").containingGroup === e.subject, "Alpha should be a member of G1");
    test.assert(e.subject.memberParts.count === 3, "G1 should contain two nodes and one link");
  }
));

  t15.add(new Test("SelectionUngrouped", diagram,
  function(test) {
    SetupForTool(test);
    var diagram = test.diagram;
    diagram.addDiagramListener("SelectionUngrouped", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    AddSelectionListeners(test);
    diagram.commandHandler.archetypeGroupData = { key: "G1", isGroup: true };
    diagram.commandHandler.selectAll();
    diagram.commandHandler.groupSelection();
  },
  function(test) {
    var diagram = test.diagram;
    var grp = diagram.findNodeForKey("G1");
    diagram.select(grp);
    diagram.commandHandler.ungroupSelection();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("SelectionUngrouped", test.listener);
    RemoveSelectionListeners(test);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "SelectionUngrouped", test);
    var it = e.parameter.iterator;
    test.assert(it !== undefined, "the parameter should be a collection of Parts that were former members");
    test.assert(it.count === 3, "there should be three Parts in the collection");
    it = e.subject.iterator;
    test.assert(it !== undefined, "the subject should be a collection of Groups that were ungrouped");
    test.assert(it.count === 1, "there should be one Group in the collection");
    it.next();
    var grp = it.value;
    test.assert(grp.diagram === null, "ungrouped Group should not belong to the Diagram");
    test.assert(grp.data !== null && !diagram.model.containsNodeData(grp.data), "ungrouped data should not be in model");
    test.assert(diagram.nodes.count === 2, "2 nodes should remain");
    test.assert(diagram.model.nodeDataArray.length === 2, "2 node data should remain");
    test.assert(diagram.links.count === 1, "link should not have been deleted");
    test.assert(diagram.model.linkDataArray.length === 1, "link data should not have been deleted");
  }
));

  function SetupSubGraph(test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.model.nodeDataArray = [
    { key: "Alpha", group: "G1" }, { key: "Beta", group: "G1" }, { key: "G1", isGroup: true }
  ];
    diagram.model.linkDataArray = [
  { from: "Alpha", to: "Beta" }
];

    var node = diagram.findNodeForKey("G1");
    node.isSelected = true;
  }

  t15.add(new Test("SubGraphCollapsed", diagram, SetupSubGraph,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("SubGraphCollapsed", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    // G1 is selected
    diagram.commandHandler.collapseSubGraph();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("SubGraphCollapsed", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "SubGraphCollapsed", test);
    var it = e.subject.iterator;
    test.assert(it !== undefined, "the subject should be a collection of Groups");
    test.assert(it.count === 1, "there should be one Group in the collection");
    it.next();
    var subj = it.value;
    var node = diagram.findNodeForKey("G1");
    test.assert(subj === node, "collapsed node should be G1");
    test.assert(!node.isSubGraphExpanded, "G1 should be collapsed");
  }
));

  t15.add(new Test("SubGraphExpanded", diagram, SetupSubGraph,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("SubGraphExpanded", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    // G1 is selected
    diagram.commandHandler.collapseSubGraph();
    diagram.commandHandler.expandSubGraph();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("SubGraphExpanded", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "SubGraphExpanded", test);
    var it = e.subject.iterator;
    test.assert(it !== undefined, "the subject should be a collection of Groups");
    test.assert(it.count === 1, "there should be one Group in the collection");
    it.next();
    var subj = it.value;
    var node = diagram.findNodeForKey("G1");
    test.assert(subj === node, "expanded node should be G1");
    test.assert(node.isSubGraphExpanded, "G1 should be expanded");
  }
));

  //??? TextEdited

  function SetupSubTree(test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.layout = $(go.TreeLayout);

    diagram.model.nodeDataArray = [
    { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }, { key: "Delta" },
    { key: "Epsilon" }, { key: "Zeta" }, { key: "Eta" }, { key: "Theta" }
  ];
    diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },
    { from: "Beta", to: "Gamma" },
    { from: "Beta", to: "Delta" },
    { from: "Alpha", to: "Epsilon" },
    { from: "Epsilon", to: "Zeta" },
    { from: "Epsilon", to: "Eta" },
    { from: "Epsilon", to: "Theta" }
  ];

    var node = diagram.findNodeForKey("Alpha");
    node.isSelected = true;
  }

  t15.add(new Test("TreeCollapsed", diagram, SetupSubTree,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("TreeCollapsed", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    // Alpha is selected
    diagram.commandHandler.collapseTree();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("TreeCollapsed", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "TreeCollapsed", test);
    var it = e.subject.iterator;
    test.assert(it !== undefined, "the subject should be a collection of Nodes");
    test.assert(it.count === 1, "there should be one Node in the collection");
    it.next();
    var subj = it.value;
    var node = diagram.findNodeForKey("Alpha");
    test.assert(subj === node, "collapsed node should be Alpha");
    test.assert(!node.isTreeExpanded, "Alpha should be collapsed");
  }
));

  t15.add(new Test("TreeExpanded", diagram, SetupSubTree,
  function(test) {
    var diagram = test.diagram;
    diagram.addDiagramListener("TreeExpanded", test.listener = function(e) {
      test.savedEvent = e;
      test.assert(diagram.undoManager.isInTransaction, "should be inside a transaction");
      test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
    });
    // Alpha is selected
    diagram.commandHandler.collapseTree();
    diagram.commandHandler.expandTree();
  },
  function(test) {
    var diagram = test.diagram;
    diagram.removeDiagramListener("TreeExpanded", test.listener);
    var e = test.savedEvent;
    CheckDiagramEvent(e, "TreeExpanded", test);
    var it = e.subject.iterator;
    test.assert(it !== undefined, "the subject should be a collection of Nodes");
    test.assert(it.count === 1, "there should be one Node in the collection");
    it.next();
    var subj = it.value;
    var node = diagram.findNodeForKey("Alpha");
    test.assert(subj === node, "expanded node should be Alpha");
    test.assert(node.isTreeExpanded, "Alpha should be expanded");
  }
));


  function SetupForClipboard(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.initialContentAlignment = go.Spot.Center;
    diagram.layout = new go.TreeLayout();
    diagram.model = new go.GraphLinksModel([
    { key: "Alpha" },
    { key: "Beta" }
  ], [
    { from: "Alpha", to: "Beta" }
  ]);

    test.assert(diagram.nodes.count === 2, "Should start with 2 nodes, not: " + diagram.nodes.count);
    test.assert(diagram.links.count === 1, "Should start with 1 link, not: " + diagram.links.count);
  }

  var t16 = new TestCollection("Clipboard");
  events.add(t16);

  t16.add(new Test("Simple", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 4, "Should have twice as many nodes: 4, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 2, "Should have twice as many links: 2, not: " + diagram.links.count);
    }
  ));

  t16.add(new Test("Simple3 after deletion", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      diagram.commandHandler.deleteSelection();
      diagram.commandHandler.pasteSelection();
      diagram.commandHandler.pasteSelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 6, "Should have thrice as many nodes: 6, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 3, "Should have thrice as many links: 3, not: " + diagram.links.count);
    }
  ));

  t16.add(new Test("One Node", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n = diagram.findNodeForKey("Alpha");
      test.assert(n !== null, "missing Alpha Node?");
      diagram.select(n);  // select and de-select everything else
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3, "Should have 3 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should have 1 link, not: " + diagram.links.count);
    }
  ));

  t16.add(new Test("One Link", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(l);  // select and de-select everything else
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 2, "Should have 2 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should not have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("One Link, One Node", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n = diagram.findNodeForKey("Alpha");
      test.assert(n !== null, "missing Alpha Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(l);  // select and de-select everything else
      n.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3, "Should have 3 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should not have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("One Link, One Other Node", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n = diagram.findNodeForKey("Beta");
      test.assert(n !== null, "missing Beta Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(l);  // select and de-select everything else
      n.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3, "Should have 3 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should not have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("One Node, One Link", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n = diagram.findNodeForKey("Alpha");
      test.assert(n !== null, "missing Alpha Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(n);  // select and de-select everything else
      l.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3, "Should have 3 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should not have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("One Other Node, One Link", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n = diagram.findNodeForKey("Beta");
      test.assert(n !== null, "missing Beta Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(n);  // select and de-select everything else
      l.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 3, "Should have 3 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 1, "Should not have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("Link First", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey("Alpha");
      test.assert(n1 !== null, "missing Alpha Node?");
      var n2 = diagram.findNodeForKey("Beta");
      test.assert(n2 !== null, "missing Beta Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(l);  // select and de-select everything else
      n1.isSelected = true;
      n2.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 4, "Should have 4 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 2, "Should have copied link, not have " + diagram.links.count + " links");
    }
  ));

  t16.add(new Test("Node First, then Link", diagram, SetupForClipboard,
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey("Alpha");
      test.assert(n1 !== null, "missing Alpha Node?");
      var n2 = diagram.findNodeForKey("Beta");
      test.assert(n2 !== null, "missing Beta Node?");
      var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(l !== null, "missing link?");
      diagram.select(n1);  // select and de-select everything else
      l.isSelected = true;
      n2.isSelected = true;
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 4, "Should have 4 nodes, not: " + diagram.nodes.count);
      test.assert(diagram.links.count === 2, "Should have copied link, not have " + diagram.links.count + " links");
    }
  ));


  function SetupForClipboardCopyTree(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.initialContentAlignment = go.Spot.Center;
    diagram.layout = new go.TreeLayout();
    diagram.model = new go.TreeModel([
      { key: "Alpha" },
      { key: "Beta", parent: "Alpha" },
      { key: "Gamma", parent: "Alpha" }
    ]);

    test.assert(diagram.nodes.count === 3, "Should start with 3 nodes, not: " + diagram.nodes.count);
    test.assert(diagram.links.count === 2, "Should start with 2 links, not: " + diagram.links.count);
    test.assert(diagram.findNodeForKey("Alpha").findTreeChildrenLinks().count === 2, "Alpha should start with two children");
  }

  t16.add(new Test("CommandHandler.copiesParentKey true", null,
    function(test) { SetupForClipboardCopyTree(test); test.diagram.commandHandler.copiesParentKey = true; },
    function(test) {
      var diagram = test.diagram;
      diagram.select(diagram.findNodeForKey("Gamma"));
      test.assert(diagram.selection.count === 1, "should select Gamma");
      test.assert(diagram.commandHandler.canCopySelection(), "should be copyable");
      diagram.commandHandler.copySelection();
      test.assert(diagram.commandHandler.canPasteSelection(), "should be able to paste");
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.selection.count === 1, "should have only new node selected");
      var newnode = diagram.selection.first();
      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(newnode.findTreeParentNode() === alpha && newnode.data.parent === "Alpha", "new node should be child of Alpha");
      test.assert(alpha.findTreeChildrenLinks().count === 3, "Alpha should now have three children");
      test.diagram.model.copiesParentKey = false;
    }
  ));

  t16.add(new Test("CommandHandler.copiesParentKey false", null,
    function(test) { SetupForClipboardCopyTree(test); test.diagram.commandHandler.copiesParentKey = false; },
    function(test) {
      var diagram = test.diagram;
      diagram.select(diagram.findNodeForKey("Gamma"));
      test.assert(diagram.selection.count === 1, "should select Gamma");
      test.assert(diagram.commandHandler.canCopySelection(), "should be copyable");
      diagram.commandHandler.copySelection();
      test.assert(diagram.commandHandler.canPasteSelection(), "should be able to paste");
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.diagram.model.copiesParentKey = false;
      test.assert(diagram.selection.count === 1, "should have only new node selected");
      var newnode = diagram.selection.first();
      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(newnode.findTreeParentNode() === null && newnode.data.parent === undefined, "new node should be unrelated to Alpha");
      test.assert(alpha.findTreeChildrenLinks().count === 2, "Alpha should now have two children");
      test.diagram.model.copiesParentKey = false;
    }
  ));


  function SetupForClipboardCopyGroup(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.initialContentAlignment = go.Spot.Center;
    diagram.layout = new go.TreeLayout();
    diagram.model = new go.GraphLinksModel([
      { key: "Alpha", isGroup: true },
      { key: "Beta", group: "Alpha" },
      { key: "Gamma", group: "Alpha" }
    ]);

    test.assert(diagram.nodes.count === 3, "Should start with 3 nodes, not: " + diagram.nodes.count);
    test.assert(diagram.links.count === 0, "Should start with 0 links, not: " + diagram.links.count);
    test.assert(diagram.findNodeForKey("Alpha").memberParts.count === 2, "Alpha should start with two members");
  }

  t16.add(new Test("CommandHandler.copiesGroupKey true", null,
    function(test) { SetupForClipboardCopyGroup(test); test.diagram.commandHandler.copiesGroupKey = true; },
    function(test) {
      var diagram = test.diagram;
      diagram.select(diagram.findNodeForKey("Gamma"));
      test.assert(diagram.selection.count === 1, "should select Gamma");
      test.assert(diagram.commandHandler.canCopySelection(), "should be copyable");
      diagram.commandHandler.copySelection();
      test.assert(diagram.commandHandler.canPasteSelection(), "should be able to paste");
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.selection.count === 1, "should have only new node selected");
      var newnode = diagram.selection.first();
      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(newnode.containingGroup === alpha && newnode.data.group === "Alpha", "new node should be member of Alpha");
      test.assert(alpha.memberParts.count === 3, "Alpha should now have three members");
      test.diagram.model.copiesGroupKey = false;
    }
  ));

  t16.add(new Test("CommandHandler.copiesGroupKey false", null,
    function(test) { SetupForClipboardCopyGroup(test); test.diagram.commandHandler.copiesGroupKey = false; },
    function(test) {
      var diagram = test.diagram;
      diagram.select(diagram.findNodeForKey("Gamma"));
      test.assert(diagram.selection.count === 1, "should select Gamma");
      test.assert(diagram.commandHandler.canCopySelection(), "should be copyable");
      diagram.commandHandler.copySelection();
      test.assert(diagram.commandHandler.canPasteSelection(), "should be able to paste");
      diagram.commandHandler.pasteSelection();
    },
    function(test) {
      var diagram = test.diagram;
      test.diagram.model.copiesGroupKey = false;
      test.assert(diagram.selection.count === 1, "should have only new node selected");
      var newnode = diagram.selection.first();
      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(newnode.containingGroup === null && newnode.data.group === undefined, "new node should be unrelated to Alpha");
      test.assert(alpha.memberParts.count === 2, "Alpha should now have two members");
      test.diagram.model.copiesGroupKey = false;
    }
  ));


  var t17 = new TestCollection("Miscellaneous");
  events.add(t17);

  t17.add(new Test("ModifyListeners", null, SimpleCommonSetup,
    function(test) {
      var diagram = test.diagram;
      diagram.addDiagramListener("BackgroundSingleClicked", test.listener = function(e) {
        test.savedEvent = e;
        diagram.removeDiagramListener("BackgroundSingleClicked", test.listener);
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
    },
    function(test) {
      var diagram = test.diagram;
      var e = test.savedEvent;
      CheckDiagramEvent(e, "BackgroundSingleClicked", test);
      test.assert(e.subject === null, "subject is not null");
      test.assert(e.parameter === null, "parameter is not null");
      test.savedEvent = null;

      // click again -- this time there should be no BackgroundSingleClicked event listener
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
      // make sure the listener did not get called
      test.assert(test.savedEvent === null, "removed BackgroundSingleClicked event listener got called");
    }
  ));

  t17.add(new Test("ModifyListenersMultiple", diagram, SimpleCommonSetup,
    function(test) {
      var diagram = test.diagram;
      // define 3 listeners for the one DiagramEvent; 2 are no-ops
      diagram.addDiagramListener("BackgroundSingleClicked", function(e) { });  // no-op
      diagram.addDiagramListener("BackgroundSingleClicked", test.listener = function(e) {
        test.savedEvent = e;
        diagram.removeDiagramListener("BackgroundSingleClicked", test.listener);
        test.assert(!diagram.undoManager.isInTransaction, "should not be inside a transaction");
        test.assert(!diagram.undoManager.isUndoingRedoing, "should not be undoing or redoing");
      });
      diagram.addDiagramListener("BackgroundSingleClicked", function(e) { });  // no-op
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
    },
    function(test) {
      var diagram = test.diagram;
      var e = test.savedEvent;
      CheckDiagramEvent(e, "BackgroundSingleClicked", test);
      test.assert(e.subject === null, "subject is not null");
      test.assert(e.parameter === null, "parameter is not null");
      test.savedEvent = null;

      // click again -- this time there should be no BackgroundSingleClicked event listener
      var pt = new go.Point(0, 100);  // nothing should be here
      test.mouseDown(pt, { timestamp: 0 });
      test.mouseUp(pt, { timestamp: 200 });
      // make sure the listener did not get called
      test.assert(test.savedEvent === null, "removed BackgroundSingleClicked event listener got called");
    }
  ));


  var t18 = new TestCollection("Highlighting");
  events.add(t18);

  function HighlightSetup(test) {
    test._highlightCounter = 0;
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { highlightedChanged: function(node) { test._highlightCounter++; } },
        $(go.Shape,
          { figure: "RoundedRectangle", fill: "lightgray" },
          new go.Binding("fill", "isHighlighted", function(h) { return h ? "red" : "lightgray"; }).ofObject()),
        $(go.TextBlock,
          { margin: 5 },
          new go.Binding("text", "key")));
    diagram.model = new go.GraphLinksModel([
      { key: "Alpha" },
      { key: "Beta" },
      { key: "Gamma" },
      { key: "Delta" }
    ], [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Alpha", to: "Delta" }
    ]);
  }

  t18.add(new Test("Highlight", diagram, HighlightSetup,
    function (test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var delta = diagram.findNodeForKey("Delta");
      alpha.isHighlighted = true;
      beta.isHighlighted = true;
      alpha.isSelected = true;
      gamma.isSelected = true;
    },
    function (test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var delta = diagram.findNodeForKey("Delta");
      test.assert(alpha && alpha.isHighlighted && alpha.isSelected && alpha.elt(0).fill === "red" && alpha.adornments.count === 1, "Alpha is not highlighted");
      test.assert(beta && beta.isHighlighted && !beta.isSelected && beta.elt(0).fill === "red" && beta.adornments.count === 0, "Beta is not highlighted");
      test.assert(gamma && !gamma.isHighlighted && gamma.isSelected && gamma.elt(0).fill === "lightgray" && gamma.adornments.count === 1, "Gamma is highlighted");
      test.assert(delta && !delta.isHighlighted && !delta.isSelected && delta.elt(0).fill === "lightgray" && delta.adornments.count === 0, "Delta is highlighted");
      test.assert(diagram.highlighteds.count === 2 && diagram.selection.count === 2, "Diagram.highlighteds.count !== 2");
      test.assert(diagram.highlighteds.contains(alpha) && diagram.highlighteds.contains(beta) && !diagram.highlighteds.contains(gamma) && !diagram.highlighteds.contains(delta), "Alpha or Beta not in Diagram.highlighteds");
      diagram.clearHighlighteds();
      test.assert(diagram.highlighteds.count === 0, "clearHighlighteds didn't clear");
      test.assert(test._highlightCounter === 4, "test._highlightCounter !== 4 " + test._highlightCounter);
    }
  ));

  t18.add(new Test("Highlight collection", diagram, HighlightSetup,
    function (test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var delta = diagram.findNodeForKey("Delta");
      diagram.highlight(alpha);
      diagram.highlight(beta);  // de-highlight Alpha, highlight Beta
      test.assert(diagram.highlighteds.count === 1, "only Beta should be highlighted");
      diagram.highlightCollection([gamma, delta, alpha]);  // de-highlight Beta
      beta.isSelected = true;
      test.assert(test._highlightCounter === 7, "test._highlightCounter !== 7 " + test._highlightCounter);
      diagram.rebuildParts();  // should restore both Part.isSelected and Part.isHighlighted
    },
    function (test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey("Alpha");
      var beta = diagram.findNodeForKey("Beta");
      var gamma = diagram.findNodeForKey("Gamma");
      var delta = diagram.findNodeForKey("Delta");
      test.assert(alpha && alpha.isHighlighted && alpha.elt(0).fill === "red", "Alpha is not highlighted");
      test.assert(beta && !beta.isHighlighted && beta.elt(0).fill === "lightgray", "Beta is highlighted");
      test.assert(gamma && gamma.isHighlighted && gamma.elt(0).fill === "red", "Gamma is not highlighted");
      test.assert(delta && delta.isHighlighted && delta.elt(0).fill === "red", "Delta is not highlighted");
      test.assert(beta && beta.isSelected, "rebuildParts didn't restore selection");
      test.assert(diagram.highlighteds.count === 3 && diagram.selection.count === 1, "rebuildParts didn't restore selection or highlighteds");
    }
  ));


  var t19 = new TestCollection("ContextMenu");
  events.add(t19);

  function SetupCM(test) {
    test._clickedCount = 0;
    test._enabledCount = 0;
    var diagram = test.diagram;
    diagram.reset();
    diagram.contextMenu =
      $(go.Adornment, "Vertical",
        $("ContextMenuButton",
          $(go.TextBlock, "Command ++", { click: function(e, obj) { test._clickedCount++; }})
        ),
        $("ContextMenuButton",
          $(go.TextBlock, "Command --", { click: function(e, obj) { test._clickedCount--; }})
        )
      );
    diagram.nodeTemplate =
      $(go.Node, "Spot",
        new go.Binding("location", "loc", go.Point.parse),
        {
          locationSpot: go.Spot.Center,
          contextMenu:
            $(go.Adornment, "Vertical",
              $("ContextMenuButton",
                $(go.TextBlock, "Node ++", { click: function(e, obj) { obj.part.data._clickedCount++; } })
              ),
              $("ContextMenuButton",
                $(go.TextBlock, "Node --", { click: function(e, obj) { obj.part.data._clickedCount--; } })
              )
            )
        },
        $(go.Panel, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.TextBlock,
            { margin: 10 },
            new go.Binding("text", "key"))
        ),
        $("Button",
          {
            name: "BUTTON",
            alignment: go.Spot.TopRight,
            click: function(e, obj) {
              e.diagram.commandHandler.showContextMenu(obj.part);
            }
          },
          new go.Binding("isEnabled"),
          $(go.Shape, "FivePointedBurst", { width: 6, height: 6 },
            { enabledChanged: function(shape, enabled) { test._enabledCount++; } })
        )
      );

    diagram.model.nodeDataArray = [
      { key: 1, loc: "0 0", _clickedCount: 0 },
      { key: 2, loc: "100 50", _clickedCount: 0 }
    ];
    diagram.model.linkDataArray = [
      { from: 1, to: 2 }
    ];
  }

  t19.add(new Test("showContextMenu sel", diagram, SetupCM,
    function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      node2.isSelected = true;
      diagram.commandHandler.showContextMenu();
    }, function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      test.assert(node2 !== null && node2.findAdornment("ContextMenu") !== null, "missing context menu for node 2");
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === node2.contextMenu, "wrong context menu");
      test.assert(node2.actualBounds.containsPoint(node2.contextMenu.position), "context menu isn't near node");
    }
  ));

  t19.add(new Test("showContextMenu no sel", diagram, SetupCM,
    function(test) {
      var diagram = test.diagram;
      diagram.clearSelection();
      diagram.commandHandler.showContextMenu();
    }, function(test) {
      var diagram = test.diagram;
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === diagram.contextMenu, "wrong context menu");
    }
  ));

  t19.add(new Test("showContextMenu node", diagram, SetupCM,
    function(test) {
      var diagram = test.diagram;
      diagram.clearSelection();
      var node2 = diagram.findNodeForKey(2);
      diagram.commandHandler.showContextMenu(node2);
    }, function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      test.assert(node2 !== null && node2.findAdornment("ContextMenu") !== null, "missing context menu for node 2");
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === node2.contextMenu, "wrong context menu");
    }
  ));

  t19.add(new Test("showContextMenu diagram", diagram, SetupCM,
    function(test) {
      var diagram = test.diagram;
      diagram.clearSelection();
      diagram.commandHandler.showContextMenu(diagram);
    }, function(test) {
      var diagram = test.diagram;
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === diagram.contextMenu, "wrong context menu");
    }
  ));

  t19.add(new Test("click button", diagram, SetupCM,
    function(test) {
      var diagram = test.diagram;

      var nit = test.diagram.nodes;
      while (nit.next()) {
        var n = nit.value;
        test.assert(n instanceof go.Node);
        var but = n.findObject("BUTTON");
        test.assert(but !== null && but.isEnabled && but.elt(0).isEnabledObject(), "button is disabled " + n.data.key);
      }
      test.assert(test._enabledCount === 0, "changed Panel.isEnabled " + test._enabledCount);

      var node2 = diagram.findNodeForKey(2);
      var pt = new go.Point().setRectSpot(node2.actualBounds, go.Spot.TopRight);
      pt.x -= 3;
      pt.y += 3;
      test.mouseDown(pt);
      test.mouseUp(pt);
    }, function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      test.assert(node2 !== null && node2.findAdornment("ContextMenu") !== null, "missing context menu for node 2");
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === node2.contextMenu, "wrong context menu");
      test.assert(node2.data._clickedCount === 0, "didn't initialize _clickedCount");
      var pt = node2.contextMenu.position.copy();
      pt.x += 6;
      pt.y += 7;
      test.mouseDown(pt);
      test.mouseUp(pt);
      test.assert(node2.data._clickedCount === 1, "didn't execute context menu command to increment data counter");
    }
  ));

  t19.add(new Test("click disabled button", diagram,
    function(test) {
      SetupCM(test);
      test.diagram.startTransaction();
      var arr = test.diagram.model.nodeDataArray;
      for (var i = 0; i < arr.length; i++) {
        test.diagram.model.setDataProperty(arr[i], "isEnabled", false);
      }
      test.diagram.commitTransaction("disabled buttons");
      var nit = test.diagram.nodes;
      while (nit.next()) {
        var n = nit.value;
        test.assert(n instanceof go.Node);
        var but = n.findObject("BUTTON");
        test.assert(but !== null && !but.isEnabled && !but.elt(0).isEnabledObject(), "button isn't disabled " + n.data.key);
      }
      test.assert(test._enabledCount === 2, "changed Panel.isEnabled wrong # " + test._enabledCount);
    },
    function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      var pt = new go.Point().setRectSpot(node2.actualBounds, go.Spot.TopRight);
      pt.x -= 3;
      pt.y += 3;
      test.mouseDown(pt);
      test.mouseUp(pt);
    }, function(test) {
      var diagram = test.diagram;
      var node2 = diagram.findNodeForKey(2);
      test.assert(node2 !== null && node2.findAdornment("ContextMenu") === null, "created context menu for node 2 anyway");
      test.assert(diagram.toolManager.contextMenuTool.currentContextMenu === null, "should be no context menu");
      test.assert(node2.data._clickedCount === 0, "didn't initialize _clickedCount");
    }
  ));


  var scrolls = new TestCollection("Scrolling Commands");
  events.add(scrolls);

  function SetupBigDocument(test) {
    var diagram = test.diagram;
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { desiredSize: new go.Size(100, 100), locationSpot: go.Spot.Center },
        new go.Binding("location"),
        $(go.Shape, "Circle", { fill: "lightgray" }),
        $(go.TextBlock, new go.Binding("text", "key"))
      );

    diagram.model = new go.GraphLinksModel([
      { key: 1, location: new go.Point(-3000, -3000) },
      { key: 2, location: new go.Point(0, -3000) },
      { key: 3, location: new go.Point(3000, -3000) },
      { key: 4, location: new go.Point(-3000, 0) },
      { key: 5, location: new go.Point(0, 0) },
      { key: 6, location: new go.Point(3000, 0) },
      { key: 7, location: new go.Point(-3000, 3000) },
      { key: 8, location: new go.Point(0, 3000) },
      { key: 9, location: new go.Point(3000, 3000) }
    ], [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
      { from: 1, to: 4 },
      { from: 4, to: 7 },
      { from: 2, to: 5 },
      { from: 5, to: 8 },
      { from: 3, to: 6 },
      { from: 6, to: 9 }
    ]);
  }

  scrolls.add(new Test("ScrollToPart no sel no hi", null, SetupBigDocument,
    function(test) {
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.originalPoint = test.diagram.position.copy();
      test.diagram.commandHandler.scrollToPart();
    },
    function(test) {
      test.assert(test.originalPoint.equals(test.diagram.position), "shouldn't have scrolled when no arg and no selection and no highlighteds");
    }
  ));

  scrolls.add(new Test("ScrollToPart 8", null, SetupBigDocument,
    function(test) {
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.originalPoint = test.diagram.position.copy();
      var n8 = test.diagram.findNodeForKey(8);
      test.assert(n8 !== null && n8.location.y > 500, "node 8 should be at bottom of document");
      test.diagram.commandHandler.scrollToPart(n8);
    },
    function(test) {
      var n8 = test.diagram.findNodeForKey(8);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n8.actualBounds), "should have scrolled to node 8");
    }
  ));

  scrolls.add(new Test("ScrollToPart sel 9 no hi", null, SetupBigDocument,
    function(test) {
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(n9 !== null && n9.location.x > 500 && n9.location.y > 500, "node 9 should be at bottom right of document")
      n9.isSelected = true;
      test.originalPoint = test.diagram.position.copy();
      test.diagram.commandHandler.scrollToPart();
    },
    function(test) {
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n9.actualBounds), "should have scrolled to show node 9");
    }
  ));

  scrolls.add(new Test("ScrollToPart no sel hi 9", null, SetupBigDocument,
    function(test) {
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(n9 !== null && n9.location.x > 500 && n9.location.y > 500, "node 9 should be at bottom right of document")
      n9.isHighlighted = true;
      test.originalPoint = test.diagram.position.copy();
      test.diagram.commandHandler.scrollToPart();
    },
    function(test) {
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n9.actualBounds), "should have scrolled to show node 9");
    }
  ));

  scrolls.add(new Test("ScrollToPart sel 7 hi 9", null, SetupBigDocument,
    function(test) {
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      var n7 = test.diagram.findNodeForKey(7);
      test.assert(n7 !== null && n7.location.x < -500 && n7.location.y > 500, "node 7 should be at bottom left of document")
      n7.isSelected = true;
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(n9 !== null && n9.location.x > 500 && n9.location.y > 500, "node 9 should be at bottom right of document")
      n9.isHighlighted = true;
      test.originalPoint = test.diagram.position.copy();
      test.diagram.commandHandler.scrollToPart();
    },
    function(test) {
      var n9 = test.diagram.findNodeForKey(9);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n9.actualBounds), "should have scrolled to show node 9, not node 7");
    }
  ));

  scrolls.add(new Test("ScrollToPart hi 9 6 3", null, SetupBigDocument,
    function(test) {
      test.originalPoint = test.diagram.position.copy();
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.diagram.findNodeForKey(9).isHighlighted = true;
      test.diagram.findNodeForKey(6).isHighlighted = true;
      test.diagram.findNodeForKey(3).isHighlighted = true;
      test.diagram.commandHandler.scrollToPart();  // to 9
      test.diagram.commandHandler.scrollToPart();  // to 6
    },
    function(test) {
      test.diagram.commandHandler.scrollToPart();  // to 3
      var n3 = test.diagram.findNodeForKey(3);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n3.actualBounds), "should have scrolled to show node 3");
    }
  ));

  scrolls.add(new Test("ScrollToPart sel 9 6 3", null, SetupBigDocument,
    function(test) {
      test.originalPoint = test.diagram.position.copy();
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.diagram.findNodeForKey(9).isSelected = true;
      test.diagram.findNodeForKey(6).isSelected = true;
      test.diagram.findNodeForKey(3).isSelected = true;
      test.diagram.commandHandler.scrollToPart();  // to 9
      test.diagram.commandHandler.scrollToPart();  // to 6
    },
    function(test) {
      test.diagram.commandHandler.scrollToPart();  // to 3
      var n3 = test.diagram.findNodeForKey(3);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n3.actualBounds), "should have scrolled to show node 3");
    }
  ));

  scrolls.add(new Test("ScrollToPart sel 9 6 3 DELETED", null, SetupBigDocument,
    function(test) {
      test.originalPoint = test.diagram.position.copy();
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.diagram.findNodeForKey(9).isSelected = true;
      test.diagram.findNodeForKey(6).isSelected = true;
      test.diagram.findNodeForKey(3).isSelected = true;
      test.diagram.commandHandler.scrollToPart();  // to 9
      test.diagram.commandHandler.scrollToPart();  // to 6
      test.diagram.commandHandler.deleteSelection();  // gotta reset upon next scrollToPart with no arg
    },
    function(test) {
      test.diagram.commandHandler.scrollToPart();  // to 3 -- can't!
      var n3 = test.diagram.findNodeForKey(3);
      test.assert(n3 === null && !test.originalPoint.equals(test.diagram.position) && test.diagram.position.x < 0, "should have scrolled after deleting nodes, shrinking documentBounds");
    }
  ));

  scrolls.add(new Test("ScrollToPart sel 9 6 3 DELETED to 7", null, SetupBigDocument,
    function(test) {
      test.originalPoint = test.diagram.position.copy();
      test.assert(test.diagram.documentBounds.width > 2000 && test.diagram.documentBounds.height > 2000, "didn't set up big document");
      test.diagram.findNodeForKey(9).isSelected = true;
      test.diagram.findNodeForKey(6).isSelected = true;
      test.diagram.findNodeForKey(3).isSelected = true;
      test.diagram.commandHandler.scrollToPart();  // to 9
      test.diagram.commandHandler.scrollToPart();  // to 6
      test.diagram.commandHandler.deleteSelection();  // gotta reset upon next scrollToPart with no arg
    },
    function(test) {
      var n7 = test.diagram.findNodeForKey(7);
      test.diagram.commandHandler.scrollToPart(n7);
      test.assert(!test.originalPoint.equals(test.diagram.position) && test.diagram.viewportBounds.containsRect(n7.actualBounds), "should have scrolled to show node 7");
    }
  ));

  var canvasevt = new TestCollection("Canvas events");
  events.add(canvasevt);

  canvasevt.add(new Test("Diagram.mouseEnter/mouseLeave", null,
    SimpleCommonSetup,
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      // add mouseenter and mouseleave functions on the diagram
      diagram.startTransaction("mouse functions");
      diagram.mouseEnter = function (e) {
        model.startTransaction("add node");
        model.addNodeData({ key: "Delta", loc: "100 100"});
        model.commitTransaction("add node");
      };
      diagram.mouseLeave = function (e) {
        model.startTransaction("remove node");
        model.removeNodeData(model.findNodeDataForKey("Delta"));
        model.commitTransaction("remove node");
      };
      diagram.commitTransaction("mouse functions");
    },
    function(test) {
      var diagram = test.diagram;
      var canvas = diagram.div.firstChild;

      // IE doesn't have Event constructor...
      function newEvent(evtType) {
        if (typeof(Event) === "function") {
          return new Event(evtType);
        } else {
          var event = document.createEvent("Event");
          event.initEvent(evtType, true, true);
          return event;
        }
      }
      canvas.dispatchEvent(newEvent("pointerenter"));
      diagram.isMouseOverDiagram = true;
      test.assert(diagram.nodes.count === 3, "Diagram should have three nodes after mouseEnter");
      canvas.dispatchEvent(newEvent("pointerleave"));
      diagram.isMouseOverDiagram = false;
      test.assert(diagram.nodes.count === 2, "Diagram should have two nodes after mouseLeave");
    }
  ));

  canvasevt.add(new Test("mouseLeave on mouse out", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.add(
        $(go.Part,
          {
            location: new go.Point(0, 0),
            mouseEnter: function(e, node) {
              node.elt(0).fill = "red";
            },
            mouseLeave: function(e, node) {
              node.elt(0).fill = "lightgreen";
            }
          },
          $(go.Shape,
            { width: 100, height: 100, fill: "lightgreen" })
        ));
    },
    function(test) {
      var diag = test.diagram;
      var part = diag.parts.first();
      test.assert(part instanceof go.Part && part.elt(0).fill === "lightgreen", "initial state doesn't include light gray unmodeled Part");
      test.mouseMove(new go.Point(-50, -50), { timestamp: 0 });
      test.mouseMove(new go.Point(20, 20), { timestamp: 100 });
      test.assert(part.elt(0).fill === "red", "mouse enter into Part didn't change its fill to red");
      test.mouseMove(new go.Point(120, -20), { timestamp: 200 });
      test.assert(part.elt(0).fill === "lightgreen", "mouse leave out of Part didn't change its fill back to lightgreen");
      test.mouseMove(new go.Point(40, 50), { timestamp: 300 });
      test.assert(part.elt(0).fill === "red", "mouse re-enter into Part didn't change its fill to red");

      var vb = diag.viewportBounds.copy();
      vb.inflate(1000, 1000);  // bigger than whole viewport
      part.elt(0).desiredSize = vb.size;
      part.position = vb.position;
    },
    function(test) {
      var diag = test.diagram;
      var part = diag.parts.first();

      // see if a mouse out of the viewport results in a mouseLeave event
      var vb = diag.viewportBounds;
      test.assert(part.actualBounds.containsRect(vb), "Part isn't much bigger than the viewport");
      test.mouseMove(new go.Point(vb.right + 100, vb.bottom + 100), { timestamp: 500 });
      test.assert(part.elt(0).fill === "lightgreen", "mouseLeave event didn't get called on mouse out of viewport");
    }
  ));


  canvasevt.add(new Test("Diagram.focus/blur", null,
    SimpleCommonSetup,
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      test.aaaFocus = 0;
      test.aaaFocus2 = 0;
      var canvas = diagram.div.firstChild;
      canvas.blur();
      diagram.startTransaction("focus/blur functions");
      diagram.addDiagramListener("GainedFocus", function(e) {
        test.aaaFocus++;
      });
      diagram.addDiagramListener("LostFocus", function(e) {
        test.aaaFocus2++;
      });
      diagram.commitTransaction("focus/blur functions");
    },
    function(test) {
      var diagram = test.diagram;
      var canvas = diagram.div.firstChild;
      if (document.hasFocus()) { // can only reliably test if the tab has focus
        canvas.focus();
        var isIE11 = (navigator.userAgent.indexOf('Trident/7') > 0);
        if (isIE11) return;
        test.assert(test.aaaFocus === 1, 'gainedFocus did not fire');
        canvas.blur();
        test.assert(test.aaaFocus2 === 1, 'lostFocus did not fire');
        canvas.blur();
        test.assert(test.aaaFocus === 1, 'focus happened more than once');
        test.assert(test.aaaFocus2 === 1, 'blur happened more than onace');
      }
    }
  ));


  var keyboard = new TestCollection("keyboard");
  events.add(keyboard);

  function CommonKeyboardSetup(test) {
    var diag = test.diagram;
    diag.reset();
    diag.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          { fill: "white", portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay()),
        {
          contextMenu:
            $("ContextMenu",
              $("ContextMenuButton",
                $(go.TextBlock, "command 1"),
                {
                  click: function(e, button) {
                    e.diagram.model.commit(function(m) {
                      m.set(button.part.adoredPart.data, "lastCommand", 1);
                    })
                  }
                }),
              $("ContextMenuButton",
                $(go.TextBlock, "command 2"),
                {
                  click: function(e, button) {
                    e.diagram.model.commit(function(m) {
                      m.set(button.part.adoredPart.data, "lastCommand", 2);
                    })
                  }
                })
            )
        }
      );
    diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue" },
        { key: 2, text: "Beta", color: "orange" },
        { key: 3, text: "Gamma", color: "lightgreen" },
        { key: 4, text: "Delta", color: "pink" }
      ]);
  }

  keyboard.add(new Test("select by mouse", null,
    CommonKeyboardSetup,
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(delta, "Delta must exist");
      var loc = delta.location;
      test.mouseDown(new go.Point(loc.x+10, loc.y+10), { timestamp: 0 });
      test.mouseUp(new go.Point(loc.x+10, loc.y+10), { timestamp: 100 });
    },
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(diag.selection.count === 1 && delta.isSelected && diag.selection.first() === delta, "Delta isn't selected");
    }
  ));

  keyboard.add(new Test("selectAll", null,
    CommonKeyboardSetup,
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(delta, "Delta must exist");
      var loc = delta.location;
      test.keyDown("A", { control: true });
    },
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(diag.selection.count === 4 && delta.isSelected, "Delta isn't selected");
    }
  ));

  keyboard.add(new Test("F2 edit", null,
    function(test) {
      CommonKeyboardSetup(test);
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(delta, "Delta must exist");
      diag.maybeUpdate();

      var loc = delta.location;
      test.mouseDown(new go.Point(loc.x+10, loc.y+10), { timestamp: 0 });
      test.mouseUp(new go.Point(loc.x+10, loc.y+10), { timestamp: 100 });
    },
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.keyDown("F2");
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.currentTool instanceof go.TextEditingTool, "not editing Delta's text");
      diag.currentTool.doCancel();
    }
  ));

  keyboard.add(new Test("ContextMenu key", null,
    function(test) {
      CommonKeyboardSetup(test);
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.assert(delta, "Delta must exist");
      diag.maybeUpdate();

      var loc = delta.location;
      test.mouseDown(new go.Point(loc.x+10, loc.y+10), { timestamp: 0 });
      test.mouseUp(new go.Point(loc.x+10, loc.y+10), { timestamp: 100 });
    },
    function(test) {
      var diag = test.diagram;
      var delta = diag.findNodeForKey(4);  // Delta
      test.keyDown("ContextMenu");
    },
    function(test) {
      var diag = test.diagram;
      test.assert(diag.currentTool instanceof go.ContextMenuTool, "didn't start ContextMenuTool");
      test.assert(diag.currentTool.currentContextMenu, "not showing contextMenu");
      test.assert(diag.currentTool.currentObject.part.data.text === "Delta", "not showing Delta's contextMenu");
      diag.currentTool.doCancel();
    }
  ));

})();
