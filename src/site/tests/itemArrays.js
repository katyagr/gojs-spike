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

  // define the templates
  var valueItemTemplate =
    $(go.Panel, "Auto",
      { name: "ITEM" },
      new go.Binding("background", "itemIndex",
                     function(i) { return (i%2 == 0) ? "lightgreen" : "lightyellow"; }).ofObject(),
      $(go.Shape, "Parallelogram1",
        { fill: "transparent" }),
      $(go.TextBlock,
        { margin: 3, name: "TB" },
        new go.Binding("text", "", go.Binding.toString)));

  var objectItemTemplate =
    $(go.Panel, "Auto",
      { name: "ITEM" },
      new go.Binding("background", "itemIndex",
                     function(i) { return (i % 2 == 0) ? "lightgreen" : "lightyellow"; }).ofObject(),
      new go.Binding("alignment"),
      $(go.Shape, "Trapezoid",
        { fill: "transparent" },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { name: "TB", margin: 3, editable: true },
        new go.Binding("text").makeTwoWay()));

  var tableItemTemplate =
    $(go.Panel, "TableRow",
      { name: "ITEM" },
      new go.Binding("background", "itemIndex",
                     function(i) { return (i % 2 == 0) ? "lightgreen" : "lightyellow"; }).ofObject(),
      new go.Binding("alignment"),
      $(go.Shape, "Trapezoid",
        { column: 0, fill: "transparent" },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { column: 1, name: "TB", margin: 3, editable: true },
        new go.Binding("text").makeTwoWay()));

  var linkItemTemplate =
    $(go.Panel,
      { segmentIndex: 0, background: "darkcyan" },
      new go.Binding("segmentFraction"),
      $(go.TextBlock,
        { stroke: "white", font: "bold 12pt sans-serif" },
        new go.Binding("text"))
    );

  var verticalValuesNodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, { fill: null, stroke: "green" }),
      $(go.Panel, "Vertical",
        { name: "ITEMPANEL", margin: 5 },
        { itemTemplate: valueItemTemplate },
        new go.Binding("itemArray", "items")));

  var verticalObjectsNodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, { fill: null, stroke: "green" }),
      $(go.Panel, "Vertical",
        { name: "ITEMPANEL", margin: 5 },
        { itemTemplate: objectItemTemplate },
        new go.Binding("itemArray", "items")));

  var spotObjectsNodeTemplate =
    $(go.Node, "Spot",
      $(go.Shape, { fill: "lightgray", width: 150, height: 100, name: "SHAPE" }),
      { name: "ITEMPANEL" },
      { itemTemplate: objectItemTemplate },
      new go.Binding("itemArray", "items"));

  var tableObjectsNodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, { fill: "lightgray" }),
      $(go.Panel, "Table",
        { name: "ITEMPANEL" },
        { itemTemplate: tableItemTemplate },
        new go.Binding("itemArray", "items"),
        $(go.Panel, "TableRow",
          { isPanelMain: true }, // needed for literal header TableRow
          $(go.Shape, "Circle",
            { column: 0 }),
          $(go.Shape, "Triangle",
            { column: 1, name: "SHAPE" })
        )
      )
    );

  var labelsLinkTemplate =
    $(go.Link,
      $(go.Shape, { isPanelMain: true, stroke: "orange", strokeWidth: 10 }),
      $(go.Shape, { isPanelMain: true, stroke: "cyan", strokeWidth: 6 }),
      $(go.Shape, { isPanelMain: true, stroke: "darkcyan", strokeWidth: 2 }),
      new go.Binding("itemArray", "labels"),
      {
        itemTemplate: linkItemTemplate
      }
    );

  function makeValuesArray(num, base) {
    if (base === undefined) base = 0;
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr.push(i * i + base);
    }
    return arr;
  }

  function SetupVerticalValues(test, num) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate = verticalValuesNodeTemplate;
    diagram.model.nodeDataArray = [
      { items: makeValuesArray(num) }  // just a single node
    ];
    diagram.model.undoManager.isEnabled = true;
  }

  function ReplaceValues(test, num) {
    var diagram = test.diagram;
    var model = diagram.model;
    model.startTransaction("replace itemArray");
    model.setDataProperty(model.nodeDataArray[0], "items", makeValuesArray(num, 100));
    model.commitTransaction("replace itemArray");
  }

  function CheckValues(test, num, base) {
    if (base === undefined) base = 0;
    var diagram = test.diagram;
    var node = diagram.nodes.first();
    test.assert(node.findObject("ITEM") === null, "should never find ITEM");
    test.assert(node.findObject("TB") === null, "should never find ITEM");

    var itempanel = node.findObject("ITEMPANEL");
    if (itempanel !== null) {
      var itemarray = itempanel.itemArray;
      test.assert(Array.isArray(itemarray) && itempanel.elements.count >= itemarray.length, "not an Array, or wrong # elements for itemArray: " + itemarray.length);
      var msg = "";
      itempanel.elements.each(function(e) {
        if (e instanceof go.Panel) {
          if (e.data === null) {
            if (!isNaN(e.itemIndex)) msg += "  no item data but itemIndex is not NaN: " + e.itemIndex;
          } else {
            if (isNaN(e.itemIndex) || itemarray[e.itemIndex] !== e.data) msg += "  item data doesn't match corresponding item in array: " + e.itemIndex + " " + e.data;
          }
        }
      });
      test.assert(msg === "", msg);
    }
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr.push((i*i+base).toString());
    }
    checkTexts(test, node, arr);
  }

  function makeObjectsArray(num, base) {
    if (base === undefined) base = 0;
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr.push({
        text: (i * i + base).toString(),
        color: getColor(i),
        alignment: getAlignment(i)
      });
    }
    return arr;
  }

  function getColor(idx) {
    switch (idx) {
      case 0: return "lightblue";
      case 1: return "lightgreen";
      case 2: return "yellow";
      case 3: return "orange";
      default: return "pink";
    }
  }

  function getAlignment(idx) {
    switch (idx) {
      case 0: return go.Spot.TopLeft;
      case 1: return go.Spot.TopRight;
      case 2: return go.Spot.BottomRight;
      case 3: return go.Spot.BottomLeft;
      default: return go.Spot.Center;
    }
  }

  function SetupVerticalObjects(test, num) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate = verticalObjectsNodeTemplate;
    diagram.model.nodeDataArray = [
      { items: makeObjectsArray(num)}  // just a single node
    ];
    diagram.model.undoManager.isEnabled = true;
  }

  function SetupSpotObjects(test, num) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate = spotObjectsNodeTemplate;
    diagram.model.nodeDataArray = [
      { items: makeObjectsArray(num)}  // just a single node
    ];
    diagram.model.undoManager.isEnabled = true;
  }

  function SetupTableObjects(test, num) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate = tableObjectsNodeTemplate;
    diagram.model.nodeDataArray = [
      { items: makeObjectsArray(num)}  // just a single node
    ];
    diagram.model.undoManager.isEnabled = true;
  }

  function ReplaceObjects(test, num) {
    var diagram = test.diagram;
    var model = diagram.model;
    model.startTransaction("replace itemArray");
    model.setDataProperty(model.nodeDataArray[0], "items", makeObjectsArray(num, 100));
    model.commitTransaction("replace itemArray");
  }

  function ReplaceObjectsNoModel(test, num) {
    var diagram = test.diagram;
    var model = diagram.model;
    model.startTransaction("modify Array");
    var newarr = makeObjectsArray(num, 100);
    var oldarr = model.nodeDataArray[0].items;
    var max = Math.max(newarr.length, oldarr.length);
    for (var i = 0; i < max; i++) {
      oldarr[i] = newarr[i];
    }
    oldarr.length = newarr.length;
    model.updateTargetBindings(model.nodeDataArray[0], "items");
    model.commitTransaction("modify Array");
  }

  function CheckObjects(test, num, base) {
    if (base === undefined) base = 0;
    var diagram = test.diagram;
    var node = diagram.nodes.first();
    test.assert(node.findObject("ITEM") === null, "should never find ITEM");
    test.assert(node.findObject("TB") === null, "should never find ITEM");

    var itempanel = node.findObject("ITEMPANEL");
    test.assert(itempanel, "missing ITEMPANEL");
    if (itempanel !== null) {
      var shape = node.findObject("SHAPE");
      if (shape) {
        test.assert(itempanel.type === go.Panel.Spot || itempanel.type === go.Panel.Table || itempanel.type === go.Panel.Auto || itempanel.type === go.Panel.Link,
                    "couldn't find SHAPE within node, due to its being a main element of an items panel");
      } else {
        test.assert(itempanel.type !== go.Panel.Spot && itempanel.type !== go.Panel.Table && itempanel.type !== go.Panel.Auto && itempanel.type !== go.Panel.Link,
                    "shouldn't have found any object named SHAPE");
      }
      var itemarray = itempanel.itemArray;
      test.assert(Array.isArray(itemarray) && itempanel.elements.count >= itemarray.length, "not an Array, or wrong # elements for itemArray: " + itemarray.length);
      for (var i = 0; i < itemarray.length; i++) {
        var pan = itempanel.findItemPanelForData(itemarray[i]);
        test.assert(pan !== null && pan.panel === itempanel && pan.data === itemarray[i], "didn't find Panel for item " + itemarray[i]);
      }
      var msg = "";
      itempanel.elements.each(function(e) {
        if (e instanceof go.Panel) {
          if (e.data === null) {
            if (!isNaN(e.itemIndex)) msg += "  no item data but itemIndex is not NaN: " + e.itemIndex;
          } else {
            if (isNaN(e.itemIndex) || itemarray[e.itemIndex] !== e.data) msg += "  item data doesn't match corresponding item in array: " + e.itemIndex + " " + e.data;
          }
        }
      });
      test.assert(msg === "", msg);
    }
    var arr = [];
    for (var i = 0; i < num; i++) {
      arr.push((i * i + base).toString());
    }
    checkTexts(test, node, arr);
  }

  function checkTexts(test, node, arr) {
    var texts = allTexts(node);
    test.assert(texts.length === arr.length, "wrong # TextBlocks: found " + texts.length + " instead of " + arr.length);
    var probs = "";
    for (var i = 0; i < texts.length; i++) {
      if (texts[i] !== arr[i]) {
        probs += "[" + i + "]: '" + texts[i] + "' instead of '" + arr[i] + "'\n";
      }
    }
    test.assert(probs === "", "some string did not match; found these problems: " + probs);
  }

  function allTexts(grobj, arr) {
    if (arr === undefined) arr = [];
    if (grobj instanceof go.TextBlock) {
      arr.push(grobj.text);
    } else if (grobj instanceof go.Panel) {
      for (var it = grobj.elements; it.next();) {
        allTexts(it.value, arr);
      }
    }
    return arr;
  }

  var fd = new TestCollection('Item Arrays');
  TestRoot.add(fd);

  var tc = new TestCollection('Values');
  fd.add(tc);

  tc.add(new Test('vertical values 0', null,
    function(test) { SetupVerticalValues(test, 0); },
    function(test) { CheckValues(test, 0, 0); ReplaceValues(test, 4); },
    function(test) { CheckValues(test, 4, 100); }));

  tc.add(new Test('vertical values 1', null,
    function(test) { SetupVerticalValues(test, 1); },
    function(test) { CheckValues(test, 1, 0); ReplaceValues(test, 0); },
    function(test) { CheckValues(test, 0, 100); }));

  tc.add(new Test('vertical values 3', null,
    function(test) { SetupVerticalValues(test, 3); },
    function(test) { CheckValues(test, 3, 0); ReplaceValues(test, 5); },
    function(test) { CheckValues(test, 5, 100); }));

  tc = new TestCollection('Objects');
  fd.add(tc);

  tc.add(new Test('vertical objects 0', null,
    function(test) { SetupVerticalObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjects(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('vertical objects 1', null,
    function(test) { SetupVerticalObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('vertical objects 3', null,
    function(test) { SetupVerticalObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjects(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));

  tc.add(new Test('spot objects 0', null,
    function(test) { SetupSpotObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjects(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('spot objects 1', null,
    function(test) { SetupSpotObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('spot objects 3', null,
    function(test) { SetupSpotObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjects(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));

  tc.add(new Test('table objects 0', null,
    function(test) { SetupTableObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjects(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('table objects 1', null,
    function(test) { SetupTableObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('table objects 3', null,
    function(test) { SetupTableObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjects(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));


  tc.add(new Test('vertical objects 0 NoMod', null,
    function(test) { SetupVerticalObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjectsNoModel(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('vertical objects 1 NoMod', null,
    function(test) { SetupVerticalObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjectsNoModel(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('vertical objects 3 NoMod', null,
    function(test) { SetupVerticalObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjectsNoModel(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));

  tc.add(new Test('spot objects 0 NoMod', null,
    function(test) { SetupSpotObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjectsNoModel(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('spot objects 1 NoMod', null,
    function(test) { SetupSpotObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjectsNoModel(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('spot objects 3 NoMod', null,
    function(test) { SetupSpotObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjectsNoModel(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));

  tc.add(new Test('table objects 0 NoMod', null,
    function(test) { SetupTableObjects(test, 0); },
    function(test) { CheckObjects(test, 0, 0); ReplaceObjectsNoModel(test, 4); },
    function(test) { CheckObjects(test, 4, 100); }));

  tc.add(new Test('table objects 1 NoMod', null,
    function(test) { SetupTableObjects(test, 1); },
    function(test) { CheckObjects(test, 1, 0); ReplaceObjectsNoModel(test, 0); },
    function(test) { CheckObjects(test, 0, 100); }));

  tc.add(new Test('table objects 3 NoMod', null,
    function(test) { SetupTableObjects(test, 3); },
    function(test) { CheckObjects(test, 3, 0); ReplaceObjectsNoModel(test, 5); },
    function(test) { CheckObjects(test, 5, 100); }));


  tc = new TestCollection('Changes');
  fd.add(tc);

  tc.add(new Test('insert vertical', null,
    function(test) { SetupVerticalObjects(test, 2); },
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      model.startTransaction("insert itemArray");
      var nodedata = model.nodeDataArray[0];
      model.insertArrayItem(nodedata.items, 0, {
          text: "44",
          color: getColor(4),
          alignment: getAlignment(4)
        });
      model.commitTransaction("insert itemArray");

      checkTexts(test, test.diagram.nodes.first(), ["44", "0", "1"]);
      var itempanel = test.diagram.nodes.first().findObject("ITEMPANEL");
      test.assert(itempanel && itempanel.elements.count === 3 &&
                  itempanel.elt(0).background === "lightgreen" &&
                  itempanel.elt(1).background === "lightyellow" &&
                  itempanel.elt(2).background === "lightgreen",
                 "no ITEMPANEL or wrong background color from itemIndex binding");

      model.undoManager.undo();
    },
    function(test) { CheckObjects(test, 2, 0); }));

  tc.add(new Test('remove vertical', null,
    function(test) { SetupVerticalObjects(test, 4); },
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      model.startTransaction("remove itemArray");
      var nodedata = model.nodeDataArray[0];
      model.removeArrayItem(nodedata.items, 1);
      model.commitTransaction("remove itemArray");

      checkTexts(test, test.diagram.nodes.first(), ["0", "4", "9"]);
      var itempanel = test.diagram.nodes.first().findObject("ITEMPANEL");
      test.assert(itempanel && itempanel.elements.count === 3 &&
                  itempanel.elt(0).background === "lightgreen" &&
                  itempanel.elt(1).background === "lightyellow" &&
                  itempanel.elt(0).background === "lightgreen",
                 "no ITEMPANEL or wrong background color from itemIndex binding");

      model.undoManager.undo();
    },
    function(test) { CheckObjects(test, 4, 0); }));


  tc.add(new Test('insert table', null,
    function(test) { SetupTableObjects(test, 2); },
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      model.startTransaction("insert itemArray");
      var nodedata = model.nodeDataArray[0];
      model.insertArrayItem(nodedata.items, 0, {
        text: "44",
        color: getColor(4),
        alignment: getAlignment(4)
      });
      model.commitTransaction("insert itemArray");

      checkTexts(test, test.diagram.nodes.first(), ["44", "0", "1"]);
      var itempanel = test.diagram.nodes.first().findObject("ITEMPANEL");
      test.assert(itempanel && itempanel.elements.count === 4 &&
                  itempanel.elt(0).data === null && isNaN(itempanel.elt(0).itemIndex) &&
                  itempanel.elt(1).background === "lightgreen" &&
                  itempanel.elt(2).background === "lightyellow" &&
                  itempanel.elt(3).background === "lightgreen",
                 "no ITEMPANEL or wrong background color from itemIndex binding");

      model.undoManager.undo();
    },
    function(test) { CheckObjects(test, 2, 0); }));

  tc.add(new Test('remove table', null,
    function(test) { SetupTableObjects(test, 4); },
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      model.startTransaction("remove itemArray");
      var nodedata = model.nodeDataArray[0];
      model.removeArrayItem(nodedata.items, 1);
      model.commitTransaction("remove itemArray");

      checkTexts(test, test.diagram.nodes.first(), ["0", "4", "9"]);
      var itempanel = test.diagram.nodes.first().findObject("ITEMPANEL");
      test.assert(itempanel && itempanel.elements.count === 4 &&
                  itempanel.elt(0).data === null && isNaN(itempanel.elt(0).itemIndex) &&
                  itempanel.elt(1).background === "lightgreen" &&
                  itempanel.elt(2).background === "lightyellow" &&
                  itempanel.elt(1).background === "lightgreen",
                 "no ITEMPANEL or wrong background color from itemIndex binding");

      model.undoManager.undo();
    },
    function(test) { CheckObjects(test, 4, 0); }));


  var sharedNodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, { fill: null, stroke: "green" }),
      $(go.Panel, "Horizontal",
        $(go.Panel, "Vertical",
          { name: "ITEMPANEL", margin: 5, background: "azure" },
          { itemTemplate: objectItemTemplate },
          new go.Binding("itemArray", "items")),
        $(go.Panel, "Vertical",
          { name: "PANEL2", margin: 5, background: "beige" },
          { itemTemplate: objectItemTemplate },
          new go.Binding("itemArray", "items"))
      ));

  tc.add(new Test('shared array', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate = sharedNodeTemplate;
      var arr = [
        { text: "first", color: getColor(0), alignment: getAlignment(0) },
        { text: "second", color: getColor(1), alignment: getAlignment(1) },
        { text: "third", color: getColor(2), alignment: getAlignment(2) }
      ];
      diagram.model.nodeDataArray = [
        { items: arr },  // two nodes, a single shared Array,
        { items: arr }   // and each node uses that Array twice!
      ];
      diagram.model.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var it = diagram.nodes;  // check both Nodes
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);

      var model = diagram.model;
      model.startTransaction("insert itemArray");
      var arr = model.nodeDataArray[0].items;
      model.addArrayItem(arr, {
        text: "fourth",
        color: getColor(4),
        alignment: getAlignment(4)
      });
      model.commitTransaction("insert itemArray");

      it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "fourth", "first", "second", "third", "fourth"]);
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "fourth", "first", "second", "third", "fourth"]);

      model.startTransaction("remove itemArray");
      model.removeArrayItem(arr, 1);
      model.commitTransaction("remove itemArray");

      it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "third", "fourth", "first", "third", "fourth"]);
      checkTexts(test, (it.next(), it.value), ["first", "third", "fourth", "first", "third", "fourth"]);

      model.undoManager.undo();
      it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "fourth", "first", "second", "third", "fourth"]);
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "fourth", "first", "second", "third", "fourth"]);

      model.undoManager.undo();
      it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);

      model.undoManager.redo();
      model.undoManager.redo();
    },
    function(test) {
      var diagram = test.diagram;
      var it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "third", "fourth", "first", "third", "fourth"]);
      checkTexts(test, (it.next(), it.value), ["first", "third", "fourth", "first", "third", "fourth"]);
    }));

  tc.add(new Test('modified shared array', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate = sharedNodeTemplate;
      var arr = [
        { text: "first", color: getColor(0), alignment: getAlignment(0) },
        { text: "second", color: getColor(1), alignment: getAlignment(1) },
        { text: "third", color: getColor(2), alignment: getAlignment(2) }
      ];
      diagram.model.nodeDataArray = [
        { items: arr },  // two nodes, a single shared Array,
        { items: arr }   // and each node uses that Array twice!
      ];
      diagram.model.undoManager.isEnabled = true;
    },
    function(test) {
      var diagram = test.diagram;
      var model = diagram.model;
      model.startTransaction("modify item");
      // modify the item data
      var data = model.nodeDataArray[0].items[1];
      model.setDataProperty(data, "text", "YIKES");
      // modify the item's TextBlock's text directly, since it has a TwoWay Binding
      var node = diagram.nodes.first();
      var pan2 = node.findObject("PANEL2");
      var tb = pan2.elt(2).findObject("TB");
      tb.text = "3rd";
      model.commitTransaction("modify item");

      var it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "YIKES", "3rd", "first", "YIKES", "3rd"]);
      checkTexts(test, (it.next(), it.value), ["first", "YIKES", "3rd", "first", "YIKES", "3rd"]);

      model.undoManager.undo();
      it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);
      checkTexts(test, (it.next(), it.value), ["first", "second", "third", "first", "second", "third"]);

      model.undoManager.redo();
    },
    function(test) {
      var diagram = test.diagram;
      var it = diagram.nodes;
      checkTexts(test, (it.next(), it.value), ["first", "YIKES", "3rd", "first", "YIKES", "3rd"]);
      checkTexts(test, (it.next(), it.value), ["first", "YIKES", "3rd", "first", "YIKES", "3rd"]);
    }));

  tc = new TestCollection('TableRows');
  fd.add(tc);

  var rowtemplate =
    $(go.Panel, "TableRow",
      $(go.Shape,
        { column: 0, stroke: null, strokeWidth: 0, width: 20, height: 20 },
        new go.Binding("fill")),
      $(go.Shape,
        { column: 1, stroke: null, strokeWidth: 0, width: 20, height: 20 },
        new go.Binding("fill", "other")));

  function CheckSizes(test, arr) {
    var i = 0;
    for (var it = test.diagram.parts; it.next() ;) {
      var panel = it.value.findObject("PANEL");
      test.assert(test.isApproxRect(panel.actualBounds, arr[i]), i + "- wrong size for itemsArray Panel, expected: " + arr[i] + "got: " + panel.actualBounds);
      i++;
    }
  }

  tc.add(new Test('use TableRows', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Part, "Vertical",
          $(go.TextBlock,
            { height: 14.3 },
            new go.Binding("text", "itemArray", function(arr) { return arr.length; })),
          $(go.Panel, "Auto",
            { name: "PANEL" },
            $(go.Shape, { fill: "orange", stroke: "gray", strokeWidth: 4 }),
            $(go.Panel, "Table",
              { name: "ITEMPANEL", itemTemplate: rowtemplate },
              new go.Binding("itemArray"))));


      diagram.model.nodeDataArray = [
        { itemArray: [] },
        { itemArray: [{ fill: "green", other: "lightgreen" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }, { fill: "red", other: "pink" }] },
      ];
    },
    function(test) {
    },
    function(test) {
      CheckSizes(test, [new go.Rect(1.5,14.3,4,4), new go.Rect(0,14.3,44,24), new go.Rect(0,14.3,44,44), new go.Rect(0,14.3,44,64)]);
    }));

  tc.add(new Test('modify TableRows', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Part, "Vertical",
          $(go.TextBlock,
            { height: 14.3 },
            new go.Binding("text", "itemArray", function(arr) { return arr.length; })),
          $(go.Panel, "Auto",
            $(go.Shape, { fill: "orange", stroke: "gray", strokeWidth: 4 }),
            $(go.Panel, "Table",
              { name: "ITEMPANEL" },
              { itemTemplate: rowtemplate },
              new go.Binding("itemArray"))));


      diagram.model.nodeDataArray = [
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }, { fill: "red", other: "pink" }] }
      ];
    },
    function(test) {
      var diagram = test.diagram;
      var items = diagram.model.nodeDataArray[0].itemArray;
      var red = items[2];
      diagram.startTransaction("reordered");
      diagram.model.removeArrayItem(items, 2);
      diagram.model.insertArrayItem(items, 0, red);
      diagram.commitTransaction("reordered");
    },
    function(test) {
      var diagram = test.diagram;
      var items = diagram.model.nodeDataArray[0].itemArray;
      test.assert(items[0].fill === "red" && items[1].fill === "green" && items[2].fill === "blue", "item data should have been reordered");
      var panel = diagram.parts.first().findObject("ITEMPANEL");
      test.assert(panel.elt(0).data === items[0] && panel.elt(1).data === items[1] && panel.elt(2).data === items[2], "panel elements should be bound to corresponding item data");
      test.assert(panel.elt(0).row === 0 && panel.elt(1).row === 1 && panel.elt(2).row === 2, "panel elements should have increasing rows");
      var pos = diagram.parts.first().position;
      var obj = diagram.findObjectAt(new go.Point(pos.x + 10, pos.y + 50));
      while (obj !== null && obj.type !== go.Panel.TableRow) obj = obj.panel;
      test.assert(obj !== null && obj.type === go.Panel.TableRow && obj.data !== null && obj.data.fill === "green", "findObjectAt should be finding the item panel with the 'red' fill");
    }));

  tc.add(new Test('with spacing', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Part, "Vertical",
          $(go.TextBlock,
            { height: 14.3 },
            new go.Binding("text", "itemArray", function(arr) { return arr.length; })),
          $(go.Panel, "Auto",
            { name: "PANEL" },
            $(go.Shape, { fill: "orange", stroke: "gray", strokeWidth: 4 }),
            $(go.Panel, "Table",
              { name: "ITEMPANEL", itemTemplate: rowtemplate, defaultRowSeparatorStrokeWidth: 2, defaultRowSeparatorStroke: "cyan" },
              //$(go.RowColumnDefinition, { row: 0, separatorStrokeWidth: 2, separatorStroke: "cyan" }),
              new go.Binding("itemArray"))));

      diagram.model.nodeDataArray = [
        { itemArray: [] },
        { itemArray: [{ fill: "green", other: "lightgreen" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }, { fill: "red", other: "pink" }] },
      ];
    },
    function(test) {
    },
    function(test) {
      CheckSizes(test, [new go.Rect(1.5,14.3,4,4), new go.Rect(0,14.3,44,24), new go.Rect(0,14.3,44,46), new go.Rect(0,14.3,44,68)]);
    }));

  tc.add(new Test('with spacing and padding', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Part, "Vertical",
          $(go.TextBlock,
            { height: 14.3 },
            new go.Binding("text", "itemArray", function(arr) { return arr.length; })),
          $(go.Panel, "Auto",
            { name: "PANEL" },
            $(go.Shape, { fill: "orange", stroke: "gray", strokeWidth: 4 }),
            $(go.Panel, "Table",
              { name: "ITEMPANEL", itemTemplate: rowtemplate, padding: 4, defaultRowSeparatorStrokeWidth: 2, defaultRowSeparatorStroke: "cyan" },
              $(go.RowColumnDefinition, { row: 0, separatorStrokeWidth: 2, separatorStroke: "cyan" }),
              new go.Binding("itemArray"))));

      diagram.model.nodeDataArray = [
        { itemArray: [] },
        { itemArray: [{ fill: "green", other: "lightgreen" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }] },
        { itemArray: [{ fill: "green", other: "lightgreen" }, { fill: "blue", other: "lightblue" }, { fill: "red", other: "pink" }] },
      ];
    },
    function(test) {
    },
    function(test) {
      CheckSizes(test, [new go.Rect(0,14.3,12,12), new go.Rect(0,14.3,52,32), new go.Rect(0,14.3,52,54), new go.Rect(0,14.3,52,76)]);
    }));

  function SetupListOfPorts(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Vertical",
        $(go.TextBlock, new go.Binding("text", "key")),
        $(go.Panel, "Table",
          new go.Binding("itemArray"),
          {
            itemTemplate:
            $(go.Panel, "TableRow",
              $(go.Panel, "Auto", { margin: 2 },
                $(go.Shape, { fill: "lightgray", fromLinkable: true, toLinkable: true, cursor: "pointer" },
                  new go.Binding("portId", "text"),
                  new go.Binding("fill", "color")),
                $(go.TextBlock, { margin: 2 },
                  new go.Binding("text"))
              )
            )
          }
        )
      );
    diagram.model = go.GraphObject.make(go.GraphLinksModel,
      {
        linkFromPortIdProperty: "fp",
        linkToPortIdProperty: "tp",
        nodeDataArray: [
          {
            key: 1, itemArray: [
              { text: "A" },
              { text: "B", color: "yellow" },
              { text: "C" }
            ]
          },
          {
            key: 2, itemArray: [
              { text: "X", color: "yellow" },
              { text: "Y", color: "orange", category: "nonexistant" },
              { text: "Z" }
            ]
          }
        ],
        linkDataArray: [
          { from: 1, to: 2, fp: "A", tp: "Y" },
          { from: 1, to: 2, fp: "B", tp: "X" },
          { from: 1, to: 2, fp: "C", tp: "Z" }
        ]
      }
    );
    diagram.undoManager.isEnabled = true;
  }

  tc.add(new Test('replace list of ports', null, SetupListOfPorts,
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      var pan = diagram.findNodeForKey(1).elt(1).elt(1);  // "B"
      test.assert(pan && pan.type === go.Panel.TableRow && pan.elt(0).type === go.Panel.Auto && pan.elt(0).elt(0).fill === "yellow", "second port isn't yellow");
      var model = diagram.model;

      model.startTransaction();
      model.setDataProperty(model.nodeDataArray[0], "itemArray", [
        { text: "A" },
        { text: "B", color: "cyan" },
        { text: "C" }
      ]);
      model.commitTransaction("replaced itemArray");
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      pan = diagram.findNodeForKey(1).elt(1).elt(1);  // "B", gotten find it again, because it's been replaced
      test.assert(pan && pan.type === go.Panel.TableRow && pan.elt(0).type === go.Panel.Auto && pan.elt(0).elt(0).fill === "cyan", "second port isn't cyan");

      var pan2 = diagram.findNodeForKey(2).elt(1).elt(1);
      test.assert(pan2 && pan2.elt(0).elt(0).fill === "orange", "second item of node 2 isn't an orange shape because wasn't using empty-string named item template");

      diagram.commandHandler.undo();
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      pan = diagram.findNodeForKey(1).elt(1).elt(1);  // "B"
      test.assert(pan && pan.type === go.Panel.TableRow && pan.elt(0).type === go.Panel.Auto && pan.elt(0).elt(0).fill === "yellow", "second port isn't yellow");
      diagram.commandHandler.redo();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      pan = diagram.findNodeForKey(1).elt(1).elt(1);  // "B", gotten find it again, because it's been replaced
      test.assert(pan && pan.type === go.Panel.TableRow && pan.elt(0).type === go.Panel.Auto && pan.elt(0).elt(0).fill === "cyan", "second port isn't cyan");
    }));

  tc.add(new Test('delete port', null, SetupListOfPorts,
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      var model = diagram.model;

      model.startTransaction();
      model.removeArrayItem(model.nodeDataArray[0].itemArray, 2);  // delete "C", should delete link
      model.commitTransaction("removed item");

      diagram.commandHandler.undo();
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      diagram.commandHandler.redo();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 2, "should have two links between the two nodes");
    }));

  tc.add(new Test('replace port', null, SetupListOfPorts,
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      var model = diagram.model;

      model.startTransaction();
      model.removeArrayItem(model.nodeDataArray[0].itemArray, 2);  // delete "C", should delete link
      model.insertArrayItem(model.nodeDataArray[0].itemArray, 2, { text: "C", color: "chartreuse" });  // insert a new "C"
      //??? really need a Model.replaceArrayItem in order to keep the old link(s) connecting with "C" ???
      model.commitTransaction("removed item");

      diagram.commandHandler.undo();
      test.assert(diagram.links.count === 3, "should have three links between the two nodes");
      diagram.commandHandler.redo();
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.links.count === 2, "should have two links between the two nodes");
    }));

  tc = new TestCollection('Link Labels');
  fd.add(tc);

  tc.add(new Test("link labels", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node,
          new go.Binding("location"),
          $(go.Shape, { fill: "yellow" })
        );
      diag.linkTemplate = labelsLinkTemplate;

      diag.model = new go.GraphLinksModel([
          { key: 1, location: new go.Point(0, 0) },
          { key: 2, location: new go.Point(200, 100) }
        ], [
          {
            from: 1, to: 2, labels: [
              { text: "1/4", segmentFraction: 0.25},
              { text: "1/2", segmentFraction: 0.5 },
              { text: "3/4", segmentFraction: 0.75 }
            ]
          }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var link = diag.links.first();
      test.assert(link.elt(0) instanceof go.Shape && link.elt(0).stroke === "orange", "outer link path should be orange");
      test.assert(link.elt(1) instanceof go.Shape && link.elt(1).stroke === "cyan", "intermediate link path should be cyan");
      test.assert(link.elt(2) instanceof go.Shape && link.elt(2).stroke === "darkcyan", "inner link path should be darkcyan");
      var lab1 = link.elt(3); var lab1p = lab1.getDocumentPoint(go.Spot.Center);
      var lab2 = link.elt(4); var lab2p = lab2.getDocumentPoint(go.Spot.Center);
      var lab3 = link.elt(5); var lab3p = lab3.getDocumentPoint(go.Spot.Center);
      test.assert(lab1 instanceof go.Panel && lab1.elt(0).text === "1/4", "first label should be 1/4");
      test.assert(lab2 instanceof go.Panel && lab2.elt(0).text === "1/2", "second label should be 1/2");
      test.assert(lab3 instanceof go.Panel && lab3.elt(0).text === "3/4", "third label should be 3/4");
      test.assert(lab1p.x < lab2p.x < lab3p.x && lab1p.y < lab2p.y < lab3p.y, "labels should be separated");

      diag.model.commit(function(m) {
        m.set(link.data, "labels", [
          { text: "1/3", segmentFraction: 0.3333 },
          { text: "2/3", segmentFraction: 0.6667 }
        ]);
      });
    },
    function(test) {
      var diag = test.diagram;
      var link = diag.links.first();
      test.assert(link.elt(0) instanceof go.Shape && link.elt(0).stroke === "orange", "outer link path should be orange");
      test.assert(link.elt(1) instanceof go.Shape && link.elt(1).stroke === "cyan", "intermediate link path should be cyan");
      test.assert(link.elt(2) instanceof go.Shape && link.elt(2).stroke === "darkcyan", "inner link path should be darkcyan");
      var lab1 = link.elt(3); var lab1p = lab1.getDocumentPoint(go.Spot.Center);
      var lab2 = link.elt(4); var lab2p = lab2.getDocumentPoint(go.Spot.Center);
      test.assert(lab1 instanceof go.Panel && lab1.elt(0).text === "1/3", "first label should be 1/3");
      test.assert(lab2 instanceof go.Panel && lab2.elt(0).text === "2/3", "second label should be 2/3");
      test.assert(link.elements.count === 5, "should be no third label");
      test.assert(lab1p.x < lab2p.x && lab1p.y < lab2p.y, "labels should be separated");
    }
  ));

  tc.add(new Test("switch template", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node,
          new go.Binding("location"),
          $(go.Shape, { fill: "yellow" })
        );
      diag.linkTemplate = labelsLinkTemplate;
      diag.linkTemplateMap.add("alternate",
        $(go.Link,
          $(go.Shape, { isPanelMain: true, stroke: "lightgreen", strokeWidth: 10 }),
          $(go.Shape, { isPanelMain: true, stroke: "green", strokeWidth: 5 }),
          new go.Binding("itemArray", "labels"),
          {
            itemTemplate: linkItemTemplate
          }
        ));

      diag.model = new go.GraphLinksModel([
        { key: 1, location: new go.Point(0, 0) },
        { key: 2, location: new go.Point(200, 100) }
      ], [
          {
            from: 1, to: 2, labels: [
              { text: "1/4", segmentFraction: 0.25 },
              { text: "1/2", segmentFraction: 0.5 },
              { text: "3/4", segmentFraction: 0.75 },
            ]
          }
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var link = diag.links.first();
      test.assert(link.elt(0) instanceof go.Shape && link.elt(0).stroke === "orange", "outer link path should be orange");
      test.assert(link.elt(1) instanceof go.Shape && link.elt(1).stroke === "cyan", "intermediate link path should be cyan");
      test.assert(link.elt(2) instanceof go.Shape && link.elt(2).stroke === "darkcyan", "inner link path should be darkcyan");
      var lab1 = link.elt(3); var lab1p = lab1.getDocumentPoint(go.Spot.Center);
      var lab2 = link.elt(4); var lab2p = lab2.getDocumentPoint(go.Spot.Center);
      var lab3 = link.elt(5); var lab3p = lab3.getDocumentPoint(go.Spot.Center);
      test.assert(lab1 instanceof go.Panel && lab1.elt(0).text === "1/4", "first label should be 1/4");
      test.assert(lab2 instanceof go.Panel && lab2.elt(0).text === "1/2", "second label should be 1/2");
      test.assert(lab3 instanceof go.Panel && lab3.elt(0).text === "3/4", "third label should be 3/4");
      test.assert(lab1p.x < lab2p.x < lab3p.x && lab1p.y < lab2p.y < lab3p.y, "labels should be separated");

      diag.model.commit(function(m) {
        m.setCategoryForLinkData(link.data, "alternate");
      });

      test.assert(link.elt(0) instanceof go.Shape && link.elt(0).stroke === "lightgreen", "outer link path should be lightgreen");
      test.assert(link.elt(1) instanceof go.Shape && link.elt(1).stroke === "green", "inner link path should be green");
      lab1 = link.elt(2); lab1p = lab1.getDocumentPoint(go.Spot.Center);
      lab2 = link.elt(3); lab2p = lab2.getDocumentPoint(go.Spot.Center);
      lab3 = link.elt(4); lab3p = lab3.getDocumentPoint(go.Spot.Center);
      test.assert(lab1 instanceof go.Panel && lab1.elt(0).text === "1/4", "first label should be 1/4");
      test.assert(lab2 instanceof go.Panel && lab2.elt(0).text === "1/2", "second label should be 1/2");
      test.assert(lab3 instanceof go.Panel && lab3.elt(0).text === "3/4", "third label should be 3/4");
      test.assert(lab1p.x < lab2p.x < lab3p.x && lab1p.y < lab2p.y < lab3p.y, "labels should be separated");
    }
  ));


  tc = new TestCollection('Merge');
  fd.add(tc);

  function setupMergeTest(test, ITEMOBJECTS) {
    var $ = go.GraphObject.make;
    var diag = test.diagram;
    diag.reset();
    diag.initialContentAlignment = go.Spot.Center;

    var ITM = new go.Map();
    ITM.add("",
      $(go.Panel, "TableRow",
        { background: "yellow" },  // checked by flattenColors
        $(go.TextBlock, { column: 0 },  // checked by flattenText
          new go.Binding("text", "itemIndex", function(i) { return i + ":"; }).ofObject()),
        $(go.TextBlock, { column: 1 },  // checked by flattenText
          { name: "TB", margin: 2, editable: true },
          new go.Binding("text", ITEMOBJECTS ? "text" : "").makeTwoWay()),
        new go.Binding("portId", ITEMOBJECTS ? "text" : "")
      ));
    ITM.add("A",
      $(go.Panel, "TableRow",
        { background: "lightgreen", padding: 5 },  // checked by flattenColors
        $(go.TextBlock, { column: 0 },  // checked by flattenText
          new go.Binding("text", "itemIndex", function(i) { return i + ":"; }).ofObject()),
        $(go.TextBlock, { column: 1 },  // checked by flattenText
          { name: "TB", margin: 2, editable: true },
          new go.Binding("text", ITEMOBJECTS ? "text" : "").makeTwoWay()),
        new go.Binding("portId", ITEMOBJECTS ? "text" : "")
      ));

    diag.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, { fill: "white" }),
        $(go.Panel, "Vertical",
          { name: "ALL", margin: 8 },
          $(go.Panel, "Table",
            new go.Binding("itemArray"),
            { name: "LIST", itemTemplateMap: ITM },
            $(go.Panel, "TableRow", { isPanelMain: true },
              $(go.TextBlock, "Header", { columnSpan: 2, font: "bold 11pt sans-serif" })
            )
          ),
          $(go.Panel, "Horizontal",
            new go.Binding("itemArray"),
            {
              itemTemplate:
                $(go.Panel,
                  $(go.TextBlock,
                    { name: "TB", margin: 1 },
                    new go.Binding("text", ITEMOBJECTS ? "text" : ""))
                )
            }
          )
        )
      );

    diag.model = $(go.GraphLinksModel, {
      linkFromPortIdProperty: "fpid",
      linkToPortIdProperty: "tpid",
      nodeDataArray: [
        {
          key: 1,
          itemArray:
            ITEMOBJECTS
              ? [{ text: "A" }, { text: "B" }, { text: "C" }]
              : ["A", "B", "C"]
        },
        {
          key: 2,
          itemArray:
            ITEMOBJECTS
              ? [{ text: "X" }, { text: "Y", category: "A" }, { text: "Z" }]
              : ["X", "Y", "Z"]
        }
      ],
      linkDataArray: [
        { from: 1, to: 2, fpid: "A", tpid: "X" },
        { from: 1, to: 2, fpid: "B", tpid: "Y" },
        { from: 1, to: 2, fpid: "B", tpid: "Z" },
      ]
    });

    diag.undoManager.isEnabled = true;
  }

  function newItem(ITEMOBJECTS, val) {
    return ITEMOBJECTS
      ? { text: val.toString(), category: val < 500 ? "A" : "" }
      : val.toString();
  }

  function flattenText(panel) {
    var str = "";
    panel.elements.each(function(child) {
      if (child instanceof go.TextBlock) str += child.text + " ";
      if (child instanceof go.Panel) {
        child.elements.each(function(grand) {
          if (grand instanceof go.TextBlock) str += grand.text + " ";
          if (grand instanceof go.Panel) {
            grand.elements.each(function(great) {
              if (great instanceof go.TextBlock) str += great.text + " ";
            });
          }
        });
      }
    });
    return str.trim();
  }

  function flattenColors(panel) {
    var str = "";
    if (panel.background !== null) str += panel.background + " ";
    panel.elements.each(function(child) {
      if (child instanceof go.Panel) {
        if (child.background !== null) str += child.background + " ";
        child.elements.each(function(grand) {
          if (grand instanceof go.Panel) {
            if (grand.background !== null) str += grand.background + " ";
            grand.elements.each(function(great) {
              if (great instanceof go.Panel) {
                if (great.background !== null) str += great.background + " ";
              }
            });
          }
        });
      }
    });
    return str.trim();
  }

  tc.add(new Test("ItemArray strings", null,
  function(test) {
    setupMergeTest(test, false);
    var n2 = test.diagram.findNodeForKey(2);
    test.assert(n2.data.itemArray.length === 3, "items array isn't of length 3");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 4, "4 elements should include 3 from items array plus header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
  },
  function(test) {
    test.diagram.model.commit(function(m) {
      var nda = m.cloneDeep(m.nodeDataArray);
      var a = nda[1].itemArray;
      a.unshift(newItem(false, 123));
      a.push(newItem(false, 234));
      m.mergeNodeDataArray(nda);
    });
    var n2 = test.diagram.findNodeForKey(2);
    test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 6, "6 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");
  },
  function(test) {
    test.diagram.model.commit(function(m) {
      var nda = m.cloneDeep(m.nodeDataArray);
      var a = nda[1].itemArray;
      a.shift();
      a.pop();
      m.mergeNodeDataArray(nda);
    });
    var n2 = test.diagram.findNodeForKey(2);
    test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 4, "4 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");

    test.diagram.undoManager.undo();
    test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 6, "6 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");

    test.diagram.undoManager.undo();
    test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 4, "4 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");

    test.diagram.undoManager.redo();
    test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 6, "6 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");

    test.diagram.undoManager.redo();
    test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
    var list = n2.findObject("LIST");
    test.assert(list.elements.count === 4, "4 elements should include header");
    var ftext = flattenText(n2.findObject("ALL"));
    test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
  }
));

  tc.add(new Test("ItemArray objects", null,
    function(test) {
      setupMergeTest(test, true);
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n2.data.itemArray.length === 3, "items array isn't of length 3");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 4, "4 elements should include 3 from items array plus header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "yellow lightgreen yellow", "wrong colors: '" + ctext + "'");
    },
    function(test) {
      test.diagram.model.commit(function(m) {
        var nda = m.cloneDeep(m.nodeDataArray);
        var a = nda[1].itemArray;
        a.unshift(newItem(true, 123));
        a.push(newItem(true, 234));
        m.mergeNodeDataArray(nda);
      });
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 6, "6 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "lightgreen yellow lightgreen yellow lightgreen", "wrong colors: '" + ctext + "'");
    },
    function(test) {
      test.diagram.model.commit(function(m) {
        var nda = m.cloneDeep(m.nodeDataArray);
        var a = nda[1].itemArray;
        a.shift();
        a.pop();
        m.mergeNodeDataArray(nda);
      });
      var n2 = test.diagram.findNodeForKey(2);
      test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 4, "4 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "yellow lightgreen yellow", "wrong colors: '" + ctext + "'");

      test.diagram.undoManager.undo();
      test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 6, "6 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "lightgreen yellow lightgreen yellow lightgreen", "wrong colors: '" + ctext + "'");

      test.diagram.undoManager.undo();
      test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 4, "4 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "yellow lightgreen yellow", "wrong colors: '" + ctext + "'");

      test.diagram.undoManager.redo();
      test.assert(n2.data.itemArray.length === 5, "after adding two items array isn't of length 5");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 6, "6 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: 123 1: X 2: Y 3: Z 4: 234 123 X Y Z 234", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "lightgreen yellow lightgreen yellow lightgreen", "wrong colors: '" + ctext + "'");

      test.diagram.undoManager.redo();
      test.assert(n2.data.itemArray.length === 3, "after removing two items array isn't of length 3");
      var list = n2.findObject("LIST");
      test.assert(list.elements.count === 4, "4 elements should include header");
      var ftext = flattenText(n2.findObject("ALL"));
      test.assert(ftext === "Header 0: X 1: Y 2: Z X Y Z", "wrong text shown in node 2: '" + ftext + "'");
      var ctext = flattenColors(list);
      test.assert(ctext === "yellow lightgreen yellow", "wrong colors: '" + ctext + "'");
    }
  ));


  tc = new TestCollection('Templates');
  fd.add(tc);

  var ITM2 = new go.Map();
  ITM2.add("", $(go.Panel, $(go.TextBlock, new go.Binding("text"))));
  ITM2.add("A", $(go.Panel, $(go.Shape, new go.Binding("fill"), { width: 40, height: 40 })));

  tc.add(new Test("Changing template", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("itemArray", "items"),
          {
            itemTemplate: ITM2.get("")  // default template
          }
        );
      diag.model = new go.Model([
        {
          items: [
            { text: "one", fill: "lightblue" },
            { text: "two", fill: "lightgreen" }
          ]
        }]);
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.TextBlock, "first element isn't a TextBlock");

      diag.commit(function(diag) {
        node.itemTemplate = ITM2.get("A");
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.Shape, "first element isn't a Shape");
    }
  ));

  tc.add(new Test("Changing data & template", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("itemArray", "items"),
          {
            itemTemplate: ITM2.get("")  // default template
          }
        );
      diag.model = new go.Model([
        {
          items: [
            { text: "one", fill: "lightblue" },
            { text: "two", fill: "lightgreen" }
          ]
        }]);
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.TextBlock, "first element isn't a TextBlock");

      diag.commit(function(diag) {
        diag.model.set(node.data, "items", [
          { text: "three", fill: "pink" },
        ]);
        node.itemTemplate = ITM2.get("A");
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node.elements.count === 1, "should be only one element in Panel");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.Shape, "first element isn't a Shape");
    }
  ));

  tc.add(new Test("Changing template & data", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("itemArray", "items"),
          {
            itemTemplate: ITM2.get("")  // default template
          }
        );
      diag.model = new go.Model([
        {
          items: [
            { text: "one", fill: "lightblue" },
            { text: "two", fill: "lightgreen" }
          ]
        }]);
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.TextBlock, "first element isn't a TextBlock");

      diag.commit(function(diag) {
        node.itemTemplate = ITM2.get("A");
        diag.model.set(node.data, "items", [
          { text: "three", fill: "pink" },
        ]);
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node.elements.count === 1, "should be only one element in Panel");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.Shape, "first element isn't a Shape");
    }
  ));

  tc.add(new Test("Changing item category", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("itemArray", "items"),
          {
            itemTemplateMap: ITM2
          }
        );
      diag.model = new go.Model([
        {
          items: [
            { text: "one", fill: "lightblue", category: "BOGUS" },
            { text: "two", fill: "lightgreen", category: "A" }
          ]
        }]);
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.data.items[0].category !== "A", "first item isn't of default category");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.TextBlock, "first element isn't a TextBlock");

      diag.model.commit(function(m) {
        m.set(m.nodeDataArray[0].items[0], "category", "A");
        // ??? there's no API for modifying the category of an itemArray item
        node.rebuildItemElements();
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.data.items[0].category === "A", "first item isn't of category A");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.Shape, "first element isn't a Shape");
    }
  ));

  tc.add(new Test("Changing item category 2", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("itemArray", "items"),
          {
            itemTemplateMap: ITM2
          }
        );
      diag.model = new go.Model([
        {
          items: [
            { text: "one", fill: "lightblue", category: "BOGUS" },
            { text: "two", fill: "lightgreen", category: "A" }
          ]
        }]);
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.data.items[0].category !== "A", "first item isn't of default category");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.TextBlock, "first element isn't a TextBlock");

      diag.model.commit(function(m) {
        var newarr = m.nodeDataArray[0].items.slice();
        newarr[0] = { text: "one", fill: "lightblue", category: "A" },
        m.set(m.nodeDataArray[0], "items", newarr);
      });
    },
    function(test) {
      var diag = test.diagram;
      var node = diag.nodes.first();
      test.assert(node && node.data.items[0].category === "A", "first item isn't of category A");
      test.assert(node.elt(0) instanceof go.Panel && node.elt(0).elt(0) instanceof go.Shape, "first element isn't a Shape");
    }
  ));

})();
