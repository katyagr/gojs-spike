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

  var zOrderTests = new TestCollection('z order');
  TestRoot.add(zOrderTests);

  // define a simple Node template
  function standardTemplate() {
    return $(go.Node, "Auto",
        new go.Binding('location', 'loc', go.Point.parse),
        new go.Binding('zOrder'),
        $(go.Shape, "Rectangle",
          {stroke: 'red', strokeWidth: 2, fill: 'lightblue' },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 3, font: '8px sans-serif', width: 26, height: 43  },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "", function(a, b) { return 'k:'+a.key + '\nz:' + a.zOrder} ))
      );
  }
  function standardGroupTemplate() {
      return $(go.Group, "Spot",
      new go.Binding('zOrder'),
      $(go.Panel, "Auto",
        $(go.Shape, "Rectangle",  // surrounds the Placeholder
          { parameter1: 14,
            fill: "rgba(0,0,255,.9)" }),
        $(go.Placeholder,    // represents the area of all member parts,
          { padding: 15})  // with some extra padding around them
      ),
      $(go.TextBlock,         // group title
        {  width: 26, height: 14, alignment: go.Spot.Right, alignmentFocus: go.Spot.Right, font: "Bold 7px Sans-Serif", stroke: 'whitesmoke' },
        new go.Binding("text", "", function(a, b) { return a.key + ' ' + a.zOrder} ))
    );
  }

  // should never be any order except ascending
  function checkZOrder(diagram, test) {
    var smallest = -99999;
    diagram.findLayer('').parts.each(function(n) {
      var z = n.zOrder;
      if (isFinite(z)) {
        if (z >= smallest) {
          smallest = z; //console.log(z +' is >= '+ smallest)
        } else {
          test.assert(false);
        }
      }
    });
  }

  // checks to make sure all nodes in groups are displayed above those groups in the parts list
  // won't always assert true if zOrdering is explicit, eg group-zOrder:5 / node-zOrder:6
  function ensureGroupsBehind(diagram, test) {
    var groupmap = {};
    diagram.findLayer('').parts.each(function(n) {
      var d = n.data; // console.log(n.data);
      if (d.isGroup) { // group:
        groupmap[d.key] = true;
      } else { // node:
        if (d.group !== undefined && isNaN(diagram.findNodeForKey(d.group).zOrder)) test.assert(groupmap[d.group] !== undefined);
      }
    });
  }

  // returns true if a is in front of b
  function firstInFront(t, diagram, a, b) {
    t.assert(a.diagram === diagram, "node not in diagram being tested")
    t.assert(b.diagram === diagram, "node not in diagram being tested")
    var aFound = false;
    var itr = diagram.findLayer('').parts;
    while (itr.next()) {
      var n = itr.value;
      if (n === b) break;
      if (n === a) aFound = true;
    }
    return (!aFound);
  }

  zOrderTests.add(new Test('simple z order', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
    // define a simple Node template
    diagram.nodeTemplate = standardTemplate();
    diagram.groupTemplate = standardGroupTemplate();

    diagram.model = new go.GraphLinksModel(
    [
      { key: 'G1', isGroup: true, zOrder: 5 },
      { key: 'G2', isGroup: true, zOrder: 5 },
      { key: "Alpha", zOrder: 4, loc: "0 0",   color: "lightblue" },
      { key: "Beta",  zOrder: 9, loc: "10 10", group: 'G1', color: "orange" },
      { key: "Gamma", zOrder: 8, loc: "20 20", group: 'G2', color: "lightgreen" },
      { key: "Delta", zOrder: 1, loc: "30 30", color: "pink" },
    ],
    [
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

  })); // end test

  zOrderTests.add(new Test('simple z order 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "Beta",  zOrder: 5, loc: "10 10",  color: "orange" },
        { key: "Gamma", zOrder: 4, loc: "20 20",  color: "lightgreen" },
        { key: 'G1', isGroup: true, zOrder: 3 },
        { key: 'G2', isGroup: true, zOrder: 2 },
        //{ key: "Alpha", zOrder: NaN, loc: "0 0",   color: "lightblue" },
        { key: "Beta",  zOrder: 1, loc: "10 10", color: "orange" },
        { key: "Gamma", zOrder: 0, loc: "20 20", color: "lightgreen" },
        //{ key: "Delta", zOrder: NaN, loc: "30 30", color: "pink" },
      ],
      [
      ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

  })); // end test

  zOrderTests.add(new Test('simple z order 3', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
    // define a simple Node template
    diagram.nodeTemplate = standardTemplate();
    diagram.groupTemplate = standardGroupTemplate();

    diagram.model = new go.GraphLinksModel(
    [
      { key: 'G1', isGroup: true, zOrder: NaN },
      { key: 'G2', isGroup: true, zOrder: NaN },
      { key: "Alpha", zOrder: NaN, loc: "0 0",   color: "lightblue" },
      { key: "Beta",  zOrder: NaN, loc: "10 10", group: 'G1', color: "orange" },
      { key: "Gamma", zOrder: NaN, loc: "20 20", group: 'G2', color: "lightgreen" },
      { key: "Delta", zOrder: NaN, loc: "30 30", color: "pink" },
    ],
    [
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);
      ensureGroupsBehind(diagram, test);

  })); // end test

  zOrderTests.add(new Test('simple z order 4', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
    // define a simple Node template
    diagram.nodeTemplate = standardTemplate();
    diagram.groupTemplate = standardGroupTemplate();

    diagram.model = new go.GraphLinksModel(
    [

      { key: "Alpha", zOrder: NaN, loc: "0 0",  group: 'G1', color: "lightblue" },
      { key: "Beta",  zOrder: NaN, loc: "10 10", group: 'G1', color: "orange" },
      { key: "Gamma", zOrder: NaN, loc: "20 20", group: 'G2', color: "lightgreen" },
      { key: "Delta", zOrder: NaN, loc: "30 30", group: 'G2', color: "pink" },
      { key: 'G1', isGroup: true, zOrder: NaN },
      { key: 'G2', isGroup: true, zOrder: NaN },
      { key: "Alpha", zOrder: NaN, loc: "0 0",  group: 'G1', color: "lightblue" },
      { key: "Beta",  zOrder: NaN, loc: "10 10", group: 'G1', color: "orange" },
      { key: "Gamma", zOrder: NaN, loc: "20 20", group: 'G2', color: "lightgreen" },
      { key: "Delta", zOrder: NaN, loc: "30 30", group: 'G2', color: "pink" },
    ],
    [
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);
      ensureGroupsBehind(diagram, test);
      // The first 4 parts added are nodes, but the first part in the layer should be a Group, since
      // all nodes are in groups so the groups must come first
      test.assert(diagram.findLayer('').parts.first() instanceof go.Group);

  })); // end test

  // two NaN z-ordered nodes, remove the back one and re-add it, it should be in the front.
  zOrderTests.add(new Test('NaN z del add', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "1",  zOrder: NaN, loc: "10 10",  color: "orange" },
        { key: "2", zOrder: NaN,  loc: "20 20",  color: "lightgreen" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var data = a.data;
      var b = diagram.findNodeForKey('2');
      test.assert(firstInFront(test, diagram, b, a))
      diagram.startTransaction();
      diagram.model.removeNodeData(data);
      diagram.model.addNodeData(data);
      diagram.commitTransaction();
      a = diagram.findNodeForKey('1');
      test.assert(firstInFront(test, diagram, a, b))

  })); // end test


  // two 1/2 z-ordered nodes, remove the back one and re-add it, it should stay in the back
  zOrderTests.add(new Test('1 2 z del add', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "1",  zOrder: 1, loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var data = a.data;
      var b = diagram.findNodeForKey('2');
      test.assert(firstInFront(test, diagram, b, a))
      diagram.startTransaction();
      diagram.model.removeNodeData(data);
      diagram.model.addNodeData(data);
      diagram.commitTransaction();
      a = diagram.findNodeForKey('1');
      test.assert(!firstInFront(test, diagram, a, b))
      test.assert(firstInFront(test, diagram, b, a))
  })); // end test

  // two 1/2 z-ordered nodes, add a node with zOrder 1.5, should be between
  zOrderTests.add(new Test('1 2 z add 1.5', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "1",  zOrder: 1, loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      test.assert(firstInFront(test, diagram, b, a))
      diagram.startTransaction();
      diagram.model.addNodeData({ key: '3', zOrder: 1.5});
      diagram.commitTransaction();
      c = diagram.findNodeForKey('3');

      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, b, c))
      test.assert(firstInFront(test, diagram, c, a))
  })); // end test

  // two 1/2 z-ordered nodes, add a node with zOrder -1, should be behind the original two
  zOrderTests.add(new Test('1 2 z add -1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "1",  zOrder: 1, loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      test.assert(firstInFront(test, diagram, b, a))
      diagram.startTransaction();
      diagram.model.addNodeData({ key: '3', zOrder: -1});
      diagram.commitTransaction();
      c = diagram.findNodeForKey('3');

      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, b, c))
      test.assert(firstInFront(test, diagram, a, c))
  })); // end test

  // two 1/2 z-ordered nodes, select all copy paste = copies should be next to originals z-wise
  zOrderTests.add(new Test('copy paste', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [

        { key: "1",  zOrder: 1, loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
      ], []);
      diagram.model.copiesKey = true;
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      test.assert(firstInFront(test, diagram, b, a))
      diagram.startTransaction();
      diagram.commandHandler.selectAll();
      diagram.commandHandler.copySelection();
      diagram.commandHandler.pasteSelection();
      diagram.commitTransaction();
      var aa = diagram.findNodeForKey('12');
      var bb = diagram.findNodeForKey('22');
      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, b, aa))
      test.assert(firstInFront(test, diagram, bb, a))
      test.assert(firstInFront(test, diagram, bb, aa))
      // make sure firstInFront isn't giving false positives!
      test.assert(!firstInFront(test, diagram, a, b))
      test.assert(!firstInFront(test, diagram, aa, b))
      test.assert(!firstInFront(test, diagram, a, b))
      test.assert(!firstInFront(test, diagram, aa, bb))
  })); // end test



  // two 1/2 z-ordered nodes, group z-ordere 3 adds zOrder 1 node, maintain
  zOrderTests.add(new Test('group sandwich', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [
        { key: "1",  zOrder: 1, group: 'G1',  loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
        { key: 'G1', isGroup: true, zOrder: 3 },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      var g = diagram.findNodeForKey('G1');

      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, g, b))
      test.assert(firstInFront(test, diagram, g, a))
  })); // end test



  zOrderTests.add(new Test('undo deletion NaN', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [
        { key: "1", zOrder: NaN,  loc: "10 10",  color: "orange" },
        { key: "2", zOrder: NaN,  loc: "20 20",  color: "lightgreen" },
        { key: "3", zOrder: NaN,  loc: "30 30",  color: "lightblue" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);
      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      var c = diagram.findNodeForKey('3');

      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, c, a))
      test.assert(firstInFront(test, diagram, c, b))
      diagram.startTransaction();
      diagram.remove(b);
      diagram.commitTransaction();
      diagram.undoManager.undo();
      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, c, a))
      test.assert(firstInFront(test, diagram, c, b))
  })); // end test


  zOrderTests.add(new Test('undo deletion numbered', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.scale = 2;
      diagram.nodeTemplate = standardTemplate();
      diagram.groupTemplate = standardGroupTemplate();
      diagram.model = new go.GraphLinksModel(
      [
        { key: "1", zOrder: 1,  loc: "10 10",  color: "orange" },
        { key: "2", zOrder: 2,  loc: "20 20",  color: "lightgreen" },
        { key: "3", zOrder: 3,  loc: "30 30",  color: "lightblue" },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);
      var a = diagram.findNodeForKey('1');
      var b = diagram.findNodeForKey('2');
      var c = diagram.findNodeForKey('3');

      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, c, a))
      test.assert(firstInFront(test, diagram, c, b))
      diagram.startTransaction()
      diagram.remove(b);
      diagram.commitTransaction()
      diagram.undoManager.undo();
      test.assert(firstInFront(test, diagram, b, a))
      test.assert(firstInFront(test, diagram, c, a))
      test.assert(firstInFront(test, diagram, c, b))
  })); // end test


  // move a group from default layer to Foreground and back
  zOrderTests.add(new Test('group layer change', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.groupTemplateMap.add("OfNodes",
        $(go.Group, "Auto",
           new go.Binding('layerName', 'isSelected', function(sel, groupPart) {
             groupPart.memberParts.each(function(vmPart) {
               vmPart.layerName = sel ? 'Foreground' : '';
             });
             return sel ? 'Foreground' : '';
           }).ofObject(),

          {
            background: "rgba(20,20,20,0.3)",
          },
          $(go.Shape, "Circle",
            { fill: null, stroke: null, strokeWidth: 2 })
        ));  // end Group and call to add to template Map

      diagram.model = new go.GraphLinksModel([{"key":3, "text":"Group A", "isGroup":true, "category":"OfNodes", "group":1},
        {"text":"first A", "group":3, "key":-7},
        {"text":"second A", "group":3, "key":-8}])
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);

      var group = diagram.findNodeForKey(3);
      var layer = diagram.findLayer('');
      diagram.startTransaction();
      group.layerName = 'Foreground';
      diagram.commitTransaction();
      diagram.startTransaction();
      group.layerName = '';
      diagram.commitTransaction();

      var arr = [];
      layer.parts.each(function(n) {arr.push(n) })
      // If any of these are false then re-adding hte group back into its default layer has been broken
      test.assert(arr.length === 3)
      test.assert(arr[0] instanceof go.Group);
      test.assert(!(arr[1] instanceof go.Group));
      test.assert(!(arr[2] instanceof go.Group));
      test.assert(arr[0] !== arr[2]);
      test.assert(arr[0] !== arr[1]);
      test.assert(arr[1] !== arr[2]);
  })); // end test








})(); // End test system

/*


  zOrderTests.add(new Test('simple z order', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();


    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      checkZOrder(diagram, test);


  })); // end test



*/