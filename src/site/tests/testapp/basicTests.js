/*
*  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
*/
(function () {
  var $ = go.GraphObject.make;

  var tc = new TestCollection('Context Menus');
  TestRoot.add(tc);

  function findContextMenuButton(cm, name) {
    var it = cm.elements;
    while (it.next()) {
      var button = it.value;
      var textblock = button.elt(1);
      if (textblock instanceof go.TextBlock && textblock.text === name) return button;
    }
    return null;
  }

  tc.add(new Test('Node', null,
    function(test) {
      var olddiag = go.Diagram.fromDiv('myDiagramDiv');
      if (olddiag) olddiag.div = null;
      init();
      test.diagram = go.Diagram.fromDiv('myDiagramDiv');
    },
    function (test) {
      var diagram = test.diagram;
      var node = diagram.findNodeForKey(1);
      test.assert(node !== null, "didn't find node 1");
      test.mouseDown(node.actualBounds.center, { timestamp: 0, button: 2 });
      test.mouseUp(node.actualBounds.center, { timestamp: 100, button: 2 });

      var cm = node.findAdornment("ContextMenu");
      test.assert(cm !== null && cm.elements.count >= 5, "no context menu for node 1");
      var delbutton = findContextMenuButton(cm, "Delete");
      test.assert(delbutton !== null, "no Delete button");
      test.mouseDown(delbutton.getDocumentPoint(go.Spot.Center), { timestamp: 1000 });
      test.mouseUp(delbutton.getDocumentPoint(go.Spot.Center), { timestamp: 1100 });
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.findNodeForKey(1) === null, "node 1 wasn't deleted");
    }  // END CHECK
  ));


  tc = new TestCollection('Linking');
  TestRoot.add(tc);

  tc.add(new Test('Link', null,
    function(test) {
      var olddiag = go.Diagram.fromDiv('myDiagramDiv');
      if (olddiag) olddiag.div = null;
      init();
      test.diagram = go.Diagram.fromDiv('myDiagramDiv');
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 4, "should start off with 4 links");

      var beta = diagram.findNodeForKey(2);
      var delta = diagram.findNodeForKey(4);
      test.assert(beta !== null && delta !== null, "missing Beta and/or Delta nodes");
      var p = beta.getDocumentPoint(new go.Spot(0.5, 1, -5, -5));
      var q = delta.getDocumentPoint(new go.Spot(0.5, 0, 5, 5));
      test.mouseDown(p, { timestamp: 0 });
      p.offset(10, 10);
      test.mouseMove(p, { timestamp: 100 });
      p.offset(10, 10);
      test.mouseMove(p, { timestamp: 200 });
      q.offset(-20, -20);
      test.mouseMove(q, { timestamp: 300 });
      q.offset(10, 10);
      test.mouseMove(q, { timestamp: 400 });
      q.offset(10, 10);
      test.mouseUp(q, { timestamp: 500 });
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 5, "should have drawn a new link");
      var beta = diagram.findNodeForKey(2);
      var delta = diagram.findNodeForKey(4);
      test.assert(beta.findLinksConnected().count === 3 && delta.findLinksConnected().count === 2, "wrong number of links at Beta and/or Delta");
    }
  ));

})();