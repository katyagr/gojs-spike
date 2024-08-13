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

  // this stuff is for image tests setup/teardown
  var allDiags = [];
  var allDivs = [];
  var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAOUlEQVQ4T+2TsQ0AAAjCyv9H6wUkjJrAbBhqETAEiY4AtdDSLEOL5oM2ky0FZX8WLfQ+lKFhc1+bBW14Me1YdHkhAAAAAElFTkSuQmCC";
  window.globalImage1  = new Image();
  globalImage1.src = img;

  function setupTestDiagram(id) {
    allDivs[id] = document.createElement('div');
    allDivs[id].innerHTML = '<div id="yep' +id+ '" style="border: solid 1px black; width: 400px; height: 400px"></div>';
    document.body.appendChild(allDivs[id]);
    allDiags[id] = $(go.Diagram, ("yep" +id), {
      "animationManager.isEnabled":false
    });

    return allDiags[id];
  }
  function getTestDiagram(id) {
    return allDiags[id];
  }
  function tearDownTestDiagram(id) {
    allDiags[id].div = null;
    allDiags[id] = null;
    document.body.removeChild(allDivs[id]);
    allDivs[id] = null;
  }


  var oneseven = new TestCollection('1.7 features');
  TestRoot.add(oneseven);

  oneseven.add(new Test('isClipping area sizes', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          new go.Binding("isClipping"),
          $(go.Shape, "Triangle"),
          $(go.Shape, "None",
            {
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Left,
              width: 50,
              height: 100,
              fill: 'red' } ),
          $(go.Shape, "None",
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Right,
              width: 50,
              height: 200,
              fill: 'lime' } )
        );

      diagram.nodeTemplateMap.add('a',
        $(go.Node, "Spot",
          new go.Binding("isClipping"),
          $(go.Shape, "None",
            {
              width: 80,
              height: 100,
              fill: 'lime' } ),
          $(go.Shape, "None",
            {
              width: 50,
              height: 100,
              fill: 'red' } )
        ));

      diagram.nodeTemplateMap.add('b',
        $(go.Node, "Spot",
          new go.Binding("isClipping"),
          $(go.Shape, "None",
            {
              width: 80,
              height: 100,
              fill: 'lime' } ),
          $(go.Shape, "None",
            {
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Right,
              width: 50,
              height: 100,
              fill: 'red' } )
        ));

      diagram.nodeTemplateMap.add('c',
        $(go.Node, "Spot",
          new go.Binding("isClipping"),
          $(go.Shape, "Circle",
            {
              width: 80,
              height: 80,
              fill: 'lime' } ),
          $(go.Shape, "None",
            {
              width: 50,
              height: 100,
              fill: 'rgba(255,0,0,.3)' } )
        ));


      diagram.nodeTemplateMap.add('d',
        $(go.Node, "Spot",
          new go.Binding("isClipping"),
          $(go.Shape, "Rectangle",
            {
              width: 80,
              height: 80,
              fill: 'lime' } ),
          $(go.Shape, "Triangle",
            {
              width: 30,
              height: 30,
              fill: 'rgba(255,0,0,.3)' } ),
          $(go.Shape, "None",
            {
              alignment: go.Spot.TopLeft,
              width: 30,
              height: 30,
              fill: 'rgba(255,0,0,.3)' } ),
          $(go.Shape, "Circle",
            {
              alignment: go.Spot.BottomLeft,
              width: 30,
              height: 30,
              fill: 'rgba(255,0,0,.3)' } )
        ));

      diagram.model = new go.GraphLinksModel(
      [

        { key: "Alpha", isClipping: true },
        { key: "Beta", isClipping: false },

        { key: "Alpha2", category: 'a', isClipping: true },
        { key: "Beta2",  category: 'a', isClipping: false },
        { key: "Alpha3", category: 'b', isClipping: true },
        { key: "Beta3",  category: 'b', isClipping: false },

        { key: "Alpha4", category: 'c', isClipping: true },
        { key: "Beta4",  category: 'c', isClipping: false },


        { key: "Alpha5", category: 'd', isClipping: true },
        { key: "Beta5",  category: 'd', isClipping: false }

      ], []);




    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var i = 0;
      var arr = [101, 101, 101, 201, 51, 101, 81, 101, 0, 101, 132, 101, 51, 81, 81, 101, 56, 81, 96.5, 112];
      diagram.nodes.each(function(n) {
       test.assert(n.actualBounds.width === arr[i++]);
       test.assert(n.actualBounds.height === arr[i++]);
      });
    }
  )); // end test

  oneseven.add(new Test('isClipping link length', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          new go.Binding('location'),
          new go.Binding("isClipping"),
          $(go.Shape, "Triangle"),
          $(go.Shape, "None",
            {
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Left,
              width: 50,
              height: 100,
              fill: 'red' } ),
          $(go.Shape, "None",
            {
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Right,
              width: 50,
              height: 200,
              fill: 'lime' } )
        );


      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", isClipping: true, location: new go.Point(0, 0) },
        { key: "Beta", isClipping: false, location: new go.Point(200, 0) },
      ],
      [
        {from: "Alpha", to: "Beta"},
      ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(diagram.links.first().actualBounds.width === 125);
    }
  )); // end test

  // This tests TextBlock.verticalAlginment and the new returnType from makeImageData
  oneseven.add(new Test('verticalAlign & imageData', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding('position'),
          $(go.TextBlock,
            {
              width: 100,
              height: 150
            },
            new go.Binding("text"),
            new go.Binding("verticalAlignment")
            )
        );

      diagram.model = new go.GraphLinksModel(
      [
        { key: '3', position: new go.Point(0, 200), text: "One Two Three\nFour Five\n Six \n Seven Eight Nine", verticalAlignment: go.Spot.Bottom }
      ],
      []);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var dataString = diagram.makeImageData( { parts: diagram.nodes } );
      test.assert(typeof dataString === "string");
      var imageData = diagram.makeImageData( { parts: diagram.nodes, returnType: 'ImageData' } );
          test.assert(imageData instanceof ImageData);

      test.assert(imageData.width === 102);
      test.assert(imageData.height === 152);
      function clearPixel(arr) { return (arr[0] === 0 && arr[1] === 0 && arr[2] === 0 && arr[3] === 0); };

      row = 10;
      var found = false;
      // This row of pixels should be clear
      for (var i = 0; i < imageData.width; i++){
        var arr = getRowCol(row,i);
        if (!clearPixel(arr)) { found = true; break; }
      }
      test.assert(!found);
      // this row should contain something
      row = imageData.height - 10;
      var unclear = 0;
      for (var i = 0; i < imageData.width; i++){
        var arr = getRowCol(row,i);
        if (!clearPixel(arr)) unclear++;
      }
      test.assert(unclear > 5);

      function getRowCol(row, col) {
        return [
          imageData.data[((row*(imageData.width*4)) + (col*4))],
          imageData.data[((row*(imageData.width*4)) + (col*4)) + 1],
          imageData.data[((row*(imageData.width*4)) + (col*4)) + 2],
          imageData.data[((row*(imageData.width*4)) + (col*4)) + 3]
        ];
      }
    }
  )); // end test




// rudimentary image align test
oneseven.add(new Test('image alignment', null,
    function (test) {
      var diagram =  setupTestDiagram(0);
      diagram.reset();

      var timesLoaded = 0;

      diagram.nodeTemplate =
        $(go.Node, "Vertical",  // the Shape will go around the TextBlock
          $(go.Picture,
            {
              element: globalImage1,
              imageStretch: go.GraphObject.None
            },
            new go.Binding('imageAlignment'),
            //new go.Binding('imageStretch'),
            new go.Binding('width'),
            new go.Binding('height')
            )
        );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "1", height: 50, width: 100, imageAlignment: go.Spot.Top },
        { key: "2", height: 50, width: 100, imageAlignment: go.Spot.Bottom }
      ], []);

      setTimeout(function() {
        var diagram = getTestDiagram(0);
        diagram.startTransaction();
        diagram.commitTransaction();
        if (!diagram.findNodeForKey('1').actualBounds.isReal()) {
          setTimeout(function() {
            doTest()
          }, 20);
          return;
        }

        function getRowCol(row, col, data) {
          return [
            data.data[((row*(data.width*4)) + (col*4))],
            data.data[((row*(data.width*4)) + (col*4)) + 1],
            data.data[((row*(data.width*4)) + (col*4)) + 2],
            data.data[((row*(data.width*4)) + (col*4)) + 3]
          ];
        }
        function clearPixel(arr) { return (arr[0] === 0 && arr[1] === 0 && arr[2] === 0 && arr[3] === 0); };
        function exists(arr) { return (arr[0] !== 0 || arr[1] !== 0 || arr[2] !== 0 || arr[3] !== 0); };
        /*
        var img = new Image();
        img.src = diagram.makeImageData( { parts: set } );
        document.body.appendChild(img);
        */

        // object 1
        var set = new go.Set();
        set.add(diagram.findNodeForKey('1'));
        var imageData = diagram.makeImageData( { parts: set, returnType: 'ImageData' } );

        row = imageData.height - 10;
        var found = false;
        // This row of pixels should be clear
        for (var i = 0; i < imageData.width; i++){
          var arr = getRowCol(row, i, imageData);
          if (exists(arr)) { found = true; break; }
        }
        test.assert(!found);
        // this row should contain something
        row = 10;
        var unclear = 0;
        for (var i = 0; i < imageData.width; i++){
          var arr = getRowCol(row, i, imageData);
          if (exists(arr)) unclear++;
        }
        test.assert(unclear > 5);


        // object 2
        var set = new go.Set();
        set.add(diagram.findNodeForKey('2'));
        var imageData = diagram.makeImageData( { parts: set, returnType: 'ImageData' } );
        row = 10;
        var found = false;
        // This row of pixels should be clear
        for (var i = 0; i < imageData.width; i++){
          var arr = getRowCol(row, i, imageData);
          if (exists(arr)) { found = true; break; }
        }
        test.assert(!found);
        // this row should contain something
        row = imageData.height - 10;
        var unclear = 0;
        for (var i = 0; i < imageData.width; i++){
          var arr = getRowCol(row, i, imageData);
          if (exists(arr)) unclear++;
        }
        test.assert(unclear > 5);


        tearDownTestDiagram(0);
      }, 200);

    }, // END SETUP
    function (test) {




    }, // END TEST
    null
));

var textTests = new TestCollection("Text features");
oneseven.add(textTests);

  textTests.add(new Test('textEdited', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      d.nodeTemplate =
      $(go.Node, "Vertical",
        new go.Binding("isClipping"),
        $(go.TextBlock, "Test text", {
          textEdited: function(obj, previous, newstring) {
            test.assert(obj === d.nodes.first().elt(0));
            test.assert(previous === "Test text");
            test.assert(newstring === "aaa");
          }
        })
      );

      diagram.model.nodeDataArray = [{}];


    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var n = d.nodes.first();
      var t = n.elt(0);

      d.commandHandler.editTextBlock(t);
      d.toolManager.textEditingTool.currentTextEditor.mainElement.value = "aaa"
      d.toolManager.textEditingTool.acceptText(go.TextEditingTool.LostFocus);

      t.textEdited = function(obj, previous, newstring) {
        test.assert(obj === d.nodes.first().elt(0));
        test.assert(previous === "aaa");
        test.assert(newstring === "bbb");
      }

      d.commandHandler.editTextBlock(t);
      d.toolManager.textEditingTool.currentTextEditor.mainElement.value = "bbb"
      d.toolManager.textEditingTool.acceptText(go.TextEditingTool.LostFocus);

    }
  )); // end test

  // rudimentary image align test
  oneseven.add(new Test('link invalidation', null,
      function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    function init() {

      var $ = go.GraphObject.make;

      diagram.layout = $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10 })

      // determine the color for each attribute shape
      function attrFill(a) {
        switch (a) {
          default: return "transparent";
        }
      }
      // determine the geometry for each attribute shape in a male;
      // except for the slash these are all squares at each of the four corners of the overall square
      var tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z");
      var trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z");
      var brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z");
      var blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z");
      var slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
      function maleGeometry(a) {
        switch (a) {
          default: return tlsq;
        }
      }
      // determine the geometry for each attribute shape in a female;
      // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
      var tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
      var trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z");
      var brarc = go.Geometry.parse("F M20 20 B 0 90 20 20 19 19 z");
      var blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z");
      function femaleGeometry(a) {
        switch (a) {
          default: return tlarc;
        }
      }
      // two different node templates, one for each sex,
      // named by the category value in the node data object
      diagram.nodeTemplateMap.add("M",  // male
        $(go.Node, "Vertical",
          { locationSpot: go.Spot.Center, locationObjectName: "ICON" },
          $(go.Panel,
            { name: "ICON" },
            $(go.Shape, "Square",
              { width: 40, height: 40, strokeWidth: 2, fill: "white", portId: "" }),
            $(go.Panel,
              { // for each attribute show a Shape at a particular place in the overall square
                itemTemplate:
                  $(go.Panel,
                    $(go.Shape,
                      { stroke: null, strokeWidth: 0 },
                      new go.Binding("fill", "", attrFill),
                      new go.Binding("geometry", "", maleGeometry))
                  ),
                margin: 1
              },
              new go.Binding("itemArray", "a")
            )
          ),
          $(go.TextBlock,
            { textAlign: "center", desiredSize: new go.Size(80, 20) },
            new go.Binding("text", "n"))
        ));
      diagram.nodeTemplateMap.add("F",  // female
        $(go.Node, "Vertical",
          { locationSpot: go.Spot.Center, locationObjectName: "ICON" },
          $(go.Panel,
            { name: "ICON" },
            $(go.Shape, "Circle",
              { width: 40, height: 40, strokeWidth: 2, fill: "white", portId: "" }),
            $(go.Panel,
              { // for each attribute show a Shape at a particular place in the overall circle
                itemTemplate:
                  $(go.Panel,
                    $(go.Shape,
                      { stroke: null, strokeWidth: 0 },
                      new go.Binding("fill", "", attrFill),
                      new go.Binding("geometry", "", femaleGeometry))
                  ),
                margin: 1
              },
              new go.Binding("itemArray", "a")
            )
          ),
          $(go.TextBlock,
            { textAlign: "center", desiredSize: new go.Size(80, 20) },
            new go.Binding("text", "n"))
        ));
      // the representation of each label node -- nothing shows on a Marriage Link
      diagram.nodeTemplateMap.add("LinkLabel",
        $(go.Node, { selectable: false, width: 1, height: 1, fromEndSegmentLength: 20 }));
      diagram.linkTemplate =  // for parent-child relationships
        $(go.Link,
          {
            routing: go.Link.Orthogonal, curviness: 15,
            layerName: "Background", selectable: false,
            fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top
          },
          $(go.Shape, { strokeWidth: 2 })
        );
      diagram.linkTemplateMap.add("Marriage",  // for marriage relationships
        $(go.Link,
          { selectable: false },
          $(go.Shape, { strokeWidth: 2, stroke: "blue" })
      ));

      setupDiagram(diagram, [
        { key: 100306, n: "Mrs A", Dates: "1803 - ?", s: "F", vir: 100303 },
          { key: 100303, n: "Mr A", Dates: "1802 - 1842", s: "M", ux: 100306 },

          { key: 1346, n: "S1", Dates: "1834 - 1914", s: "M", ux: 100320, m: 100306, f: 100303 },
          { key: 100320, n: "W1", Dates: "? - 1863", s: "F", vir: 1346 },
          { key: 100470, n: "W2", Dates: "1862 - 1943", s: "F", m: 100320, f: 1346 },
          { key: 100473, n: "W3", Dates: "1863 - 1952", s: "F", m: 100320, f: 1346 }


      ]
       );

    }

    // create and initialize the Diagram.model given an array of node data representing people
    function setupDiagram(diagram, array, focusId) {
      diagram.model =
        go.GraphObject.make(go.GraphLinksModel,
          { // declare support for link label nodes
            linkLabelKeysProperty: "labelKeys",
            // this property determines which template is used
            nodeCategoryProperty: "s",
            // create all of the nodes for people
            nodeDataArray: array
          });
      setupMarriages(diagram);
      setupParents(diagram);
      var node = diagram.findNodeForKey(focusId);
      if (node !== null) {
        diagram.select(node);
      }
    }
    function findMarriage(diagram, a, b) {  // A and B are node keys
      var nodeA = diagram.findNodeForKey(a);
      var nodeB = diagram.findNodeForKey(b);
      if (nodeA !== null && nodeB !== null) {
        var it = nodeA.findLinksBetween(nodeB);  // in either direction
        while (it.next()) {
          var link = it.value;
          // Link.data.category === "Marriage" means it's a marriage relationship
          if (link.data !== null && link.data.category === "Marriage") return link;
        }
      }
      return null;
    }
    // now process the node data to determine marriages
    function setupMarriages(diagram) {
      var model = diagram.model;
      var nodeDataArray = model.nodeDataArray;
      for (var i = 0; i < nodeDataArray.length; i++) {
        var data = nodeDataArray[i];
        var key = data.key;
        var uxs = data.ux;
        if (uxs !== undefined) {
          if (typeof uxs === "number") uxs = [ uxs ];
          for (var j = 0; j < uxs.length; j++) {
            var wife = uxs[j];
            if (key === wife) {
              // or warn no reflexive marriages
              continue;
            }
            var link = findMarriage(diagram, key, wife);
            if (link === null) {
              // add a label node for the marriage link
              var mlab = { s: "LinkLabel" };
              model.addNodeData(mlab);
              // add the marriage link itself, also referring to the label node
              var mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
              model.addLinkData(mdata);
            }
          }
        }
        var virs = data.vir;
        if (virs !== undefined) {
          if (typeof virs === "number") virs = [ virs ];
          for (var j = 0; j < virs.length; j++) {
            var husband = virs[j];
            if (key === husband) {
              // or warn no reflexive marriages
              continue;
            }
            var link = findMarriage(diagram, key, husband);
            if (link === null) {
              // add a label node for the marriage link
              var mlab = { s: "LinkLabel" };
              model.addNodeData(mlab);
              // add the marriage link itself, also referring to the label node
              var mdata = { from: key, to: husband, labelKeys: [mlab.key], category: "Marriage" };
              model.addLinkData(mdata);
            }
          }
        }
      }
    }
    // process parent-child relationships once all marriages are known
    function setupParents(diagram) {
      var model = diagram.model;
      var nodeDataArray = model.nodeDataArray;
      for (var i = 0; i < nodeDataArray.length; i++) {
        var data = nodeDataArray[i];
        var key = data.key;
        var mother = data.m;
        var father = data.f;
        if (mother !== undefined && father !== undefined) {
          var link = findMarriage(diagram, mother, father);
          if (link === null) {
            // or warn no known mother or no known father or no known marriage between them
            //if (window.console) window.console.log("unknown marriage: " + mother + " & " + father);
            continue;
          }
          var mdata = link.data;
          var mlabkey = mdata.labelKeys[0];
          var cdata = { from: mlabkey, to: key };
          diagram.model.addLinkData(cdata);
        }
      }
    }
    // A custom layout that shows the two families related to a person's parents
    class GenogramLayout extends go.LayeredDigraphLayout {
      constructor() {
      super();
      this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
      this.spouseSpacing = 30;  // minimum space between spouses
    }


    makeNetwork(coll) {
      // generate LayoutEdges for each parent-child Link
      var net = this.createNetwork();
      if (coll instanceof go.Diagram) {
        this.add(net, coll.nodes, true);
        this.add(net, coll.links, true);
      } else if (coll instanceof go.Group) {
        this.add(net, coll.memberParts, false);
      } else if (coll.iterator) {
        this.add(net, coll.iterator, false);
      }
      return net;
    };
    // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
    // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
    add(net, coll, nonmemberonly) {
      var multiSpousePeople = new go.Set();
      // consider all Nodes in the given collection
      var it = coll.iterator;
      while (it.next()) {
        var node = it.value;
        if (!(node instanceof go.Node)) continue;
        if (!node.isLayoutPositioned || !node.isVisible()) continue;
        if (nonmemberonly && node.containingGroup !== null) continue;
        // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
        if (node.isLinkLabel) {
          // get marriage Link
          var link = node.labeledLink;
          var spouseA = link.fromNode;
          var spouseB = link.toNode;
          // create vertex representing both husband and wife
          var vertex = net.addNode(node);
          // now define the vertex size to be big enough to hold both spouses
          vertex.width = spouseA.actualBounds.width + this.spouseSpacing + spouseB.actualBounds.width;
          vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
          vertex.focus = new go.Point(spouseA.actualBounds.width + this.spouseSpacing / 2, vertex.height / 2);
        } else {
          // don't add a vertex for any married person!
          // instead, code above adds label node for marriage link
          // assume a marriage Link has a label Node
          var marriages = 0;
          node.linksConnected.each(function(l) { if (l.isLabeledLink) marriages++; });
          if (marriages === 0) {
            var vertex = net.addNode(node);
          } else if (marriages > 1) {
            multiSpousePeople.add(node);
          }
        }
      }
      // now do all Links
      it.reset();
      while (it.next()) {
        var link = it.value;
        if (!(link instanceof go.Link)) continue;
        if (!link.isLayoutPositioned || !link.isVisible()) continue;
        if (nonmemberonly && link.containingGroup !== null) continue;
        // if it's a parent-child link, add a LayoutEdge for it
        if (!link.isLabeledLink) {
          var parent = net.findVertex(link.fromNode);  // should be a label node
          var child = net.findVertex(link.toNode);
          if (child !== null) {  // an unmarried child
            net.linkVertexes(parent, child, link);
          } else {  // a married child
            link.toNode.linksConnected.each(function(l) {
              if (!l.isLabeledLink) return;  // if it has no label node, it's a parent-child link
              // found the Marriage Link, now get its label Node
              var mlab = l.labelNodes.first();
              // parent-child link should connect with the label node,
              // so the LayoutEdge should connect with the LayoutVertex representing the label node
              var mlabvert = net.findVertex(mlab);
              if (mlabvert !== null) {
                net.linkVertexes(parent, mlabvert, link);
              }
            });
          }
        }
      }
      while (multiSpousePeople.count > 0) {
        // find all collections of people that are indirectly married to each other
        var node = multiSpousePeople.first();
        var cohort = new go.Set();
        this.extendCohort(cohort, node);
        // then encourage them all to be the same generation by connecting them all with a common vertex
        var dummyvert = net.createVertex();
        net.addVertex(dummyvert);
        var marriages = new go.Set();
        cohort.each(function(n) {
          n.linksConnected.each(function(l) {
            marriages.add(l);
          })
        });
        marriages.each(function(link) {
          // find the vertex for the marriage link (i.e. for the label node)
          var mlab = link.labelNodes.first()
          var v = net.findVertex(mlab);
          if (v !== null) {
            net.linkVertexes(dummyvert, v, null);
          }
        });
        // done with these people, now see if there are any other multiple-married people
        multiSpousePeople.removeAll(cohort);
      }
    };
    // collect all of the people indirectly married with a person
    extendCohort(coll, node) {
      if (coll.contains(node)) return;
      coll.add(node);
      var lay = this;
      node.linksConnected.each(function(l) {
        if (l.isLabeledLink) {  // if it's a marriage link, continue with both spouses
          lay.extendCohort(coll, l.fromNode);
          lay.extendCohort(coll, l.toNode);
        }
      });
    };

    assignLayers() {
      go.LayeredDigraphLayout.prototype.assignLayers.call(this);
      var horiz = this.direction == 0.0 || this.direction == 180.0;
      // for every vertex, record the maximum vertex width or height for the vertex's layer
      var maxsizes = [];
      this.network.vertexes.each(function(v) {
        var lay = v.layer;
        var max = maxsizes[lay];
        if (max === undefined) max = 0;
        var sz = (horiz ? v.width : v.height);
        if (sz > max) maxsizes[lay] = sz;
      });
      // now make sure every vertex has the maximum width or height according to which layer it is in,
      // and aligned on the left (if horizontal) or the top (if vertical)
      this.network.vertexes.each(function(v) {
        var lay = v.layer;
        var max = maxsizes[lay];
        if (horiz) {
          v.focus = new go.Point(0, v.height / 2);
          v.width = max;
        } else {
          v.focus = new go.Point(v.width / 2, 0);
          v.height = max;
        }
      });
      // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
      // (other than the ones that are the widest or tallest in their respective layer).
    };

    commitNodes() {
      go.LayeredDigraphLayout.prototype.commitNodes.call(this);
      // position regular nodes
      this.network.vertexes.each(function(v) {
        if (v.node !== null && !v.node.isLinkLabel) {
          v.node.position = new go.Point(v.x, v.y);
        }
      });
      // position the spouses of each marriage vertex
      var layout = this;
      this.network.vertexes.each(function(v) {
        if (v.node === null) return;
        if (!v.node.isLinkLabel) return;
        var labnode = v.node;
        var lablink = labnode.labeledLink;
        // In case the spouses are not actually moved, we need to have the marriage link
        // position the label node, because LayoutVertex.commit() was called above on these vertexes.
        // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
        lablink.invalidateRoute();
        var spouseA = lablink.fromNode;
        var spouseB = lablink.toNode;
        // prefer fathers on the left, mothers on the right
        if (spouseA.data.s === "F") {  // sex is female
          var temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        // see if the parents are on the desired sides, to avoid a link crossing
        var aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
        var bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
        if (aParentsNode !== null && bParentsNode !== null && aParentsNode.position.x > bParentsNode.position.x) {
          // swap the spouses
          var temp = spouseA;
          spouseA = spouseB;
          spouseB = temp;
        }
        spouseA.position = new go.Point(v.x, v.y);
        spouseB.position = new go.Point(v.x + spouseA.actualBounds.width + layout.spouseSpacing, v.y);
        if (spouseA.opacity === 0) {
          var pos = new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
          spouseA.position = pos;
          spouseB.position = pos;
        } else if (spouseB.opacity === 0) {
          var pos = new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
          spouseA.position = pos;
          spouseB.position = pos;
        }
      });
      // position only-child nodes to be under the marriage label node
      this.network.vertexes.each(function(v) {
        if (v.node === null || v.node.linksConnected.count > 1) return;
        var mnode = layout.findParentsMarriageLabelNode(v.node);
        if (mnode !== null && mnode.linksConnected.count === 1) {  // if only one child
          var mvert = layout.network.findVertex(mnode);
          var newbnds = v.node.actualBounds.copy();
          newbnds.x = mvert.centerX - v.node.actualBounds.width / 2;
          // see if there's any empty space at the horizontal mid-point in that layer
          var overlaps = layout.diagram.findObjectsIn(newbnds, function(x) { return x.part; }, function(p) { return p !== v.node; }, true);
          if (overlaps.count === 0) {
            v.node.move(newbnds.position);
          }
        }
      });
    };
    findParentsMarriageLabelNode(node) {
      var it = node.findNodesInto();
      while (it.next()) {
        var n = it.value;
        if (n.isLinkLabel) return n;
      }
      return null;
    }
  }
    // end GenogramLayout class

        init();

      }, // END SETUP
      function (test) {
        // make sure a link is well formed
        // previously, poorly formed link will be very narrow
        var ab = test.diagram.findNodeForKey(1346).findLinksInto().first().actualBounds;
        test.assert(ab.width > 96);
        test.assert(ab.height > 90);
        test.assert(ab.height < 100);
        // bad: Rect(74,0,2.5,113)
        // good: Rect(74,20.5,97,92.5)
      }, // END TEST
      null
  ));

  var posLocTests = new TestCollection("Pos/Loc");
  oneseven.add(posLocTests);
  posLocTests.add(new Test('Pos/Loc reconciliation', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
        var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { selectionAdorned: false },
          $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("width"),
            new go.Binding("height"),
            new go.Binding("text", "key"),
            new go.Binding("stroke", "isSelected", function(s) { return s ? "red" : "black"; }).ofObject())
        );



        var BoxPart =
          $(go.Part,
            {
              layerName: "Tool",
              position: new go.Point(0, 0), visible: false,
              //??? not setting locationSpot DOES help
              locationSpot: go.Spot.Center,
              locationObjectName: "SHAPE",
              rotatable: true, rotateObjectName: "SHAPE",
              resizable: true, resizeObjectName: "SHAPE"
            },
            $(go.Shape,
              { name: "SHAPE", position: new go.Point(0, 0), fill: "transparent", stroke: "red" })
          );
        var BoxShape = BoxPart.findObject("SHAPE");

        diagram.add(BoxPart);



      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", width: 40, height: 15, color: "lightblue" },
        { key: "Beta",  width: 30, height: 15, color: "orange" },
        { key: "Gamma", width: 30, height: 15, color: "lightgreen" },
        { key: "Delta", width: 30, height: 15, color: "pink" }
      ],
      [
      ]);
      test.BoxPart = BoxPart;
      test.BoxShape = BoxShape;

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var BoxPart = test.BoxPart;
      var BoxShape = test.BoxShape;
      var coll = new go.Set();
      coll.add(diagram.findNodeForKey('Beta'));
      var b = diagram.computePartsBounds(coll);
      // these report the correct results

      diagram.startTransaction();
      if (b.isReal() && !b.isEmpty()) {
        BoxPart.visible = true;
        BoxShape.desiredSize = b.size;
        BoxPart.position = b.position;
      } else {
        BoxPart.visible = false;
      }
      diagram.commitTransaction("x");

      var coll = new go.Set();
      coll.add(diagram.findNodeForKey('Alpha'));
      var b = diagram.computePartsBounds(coll);
      // these report the correct results

      diagram.startTransaction();
      if (b.isReal() && !b.isEmpty()) {
        BoxPart.visible = true;
        BoxShape.desiredSize = b.size;
        BoxPart.position = b.position;
      } else {
        BoxPart.visible = false;
      }
      diagram.commitTransaction("x");

      // this test changes a position and a size,
      // and makes sure the location is the thing to change, not the position
      // this will pass if position and location are reconciled correctly
      // this will fail otherwise
      test.assert(BoxPart.actualBounds.x === 0);

    }
  )); // end test



  posLocTests.add(new Test('Pos/Loc reconciliation 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.layout = $(go.GridLayout);

      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          {
            locationSpot: go.Spot.Center,  // the location is the center of the Shape
            locationObjectName: "SHAPE",
            selectionAdorned: false,  // no selection handle when selected
            resizable: true, resizeObjectName: "SHAPE",  // user can resize the Shape
            rotatable: true, rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            // don't re-layout when node changes size
            layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
          },
          new go.Binding("layerName", "isHighlighted", function(h) { return h ? "Foreground" : ""; }).ofObject(),
          $(go.Shape,
            {
              name: "SHAPE",  // named so that the above properties can refer to this GraphObject
              width: 70, height: 70,
              stroke: "#C2185B",
              fill: "#F48FB1",
              strokeWidth: 3
            },
            // bind the Shape.figure to the figure name, which automatically gives the Shape a Geometry
            new go.Binding("figure", "key")),
          $(go.TextBlock,  // the label
            {
              margin: 4,
              font: "bold 18px sans-serif",
              background: 'white'
            },
            new go.Binding("visible", "isHighlighted").ofObject(),
            new go.Binding("text", "key"))
        );

      // initialize the model
      diagram.model.nodeDataArray = [go.Shape.getFigureGenerators().toArray()[0], go.Shape.getFigureGenerators().toArray()[1]];

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      diagram.startTransaction();
      diagram.commitTransaction();

      diagram.nodes.first().isHighlighted = true;

      diagram.startTransaction();
      diagram.commitTransaction();
      test.assert(diagram.nodes.first().location.x === 0);
    }
  )); // end test

  posLocTests.add(new Test('Pos/Loc reconciliation 3', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      diagram.nodeTemplate =
        $(go.Node,
          { locationSpot: go.Spot.Center },
          new go.Binding("position"),
          $(go.Shape, { strokeWidth: 0, width: 50, height: 50 },
            new go.Binding("fill", "color"))
        );
      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue", position: new go.Point(0, 0) },
        { key: "Beta", color: "orange", position: new go.Point(100, 0) },
        { key: "Gamma", color: "lightgreen", position: new go.Point(200, 0) }
      ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      diagram.startTransaction();
      var n = diagram.findNodeForKey("Beta");
      var shape = n.elt(0);
      shape.desiredSize = new go.Size(shape.width + 20, shape.height + 20);
      n.position = new go.Point(100, 0);
      diagram.commitTransaction();

      test.assert(n.position.x === 100);
      test.assert(n.position.y === 0);
    }
  )); // end test

  posLocTests.add(new Test('Pos/Loc reconciliation 4', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      diagram.layout = $(go.GridLayout);


      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          {
            locationSpot: go.Spot.Center,  // the location is the center of the Shape
            locationObjectName: "SHAPE",
            selectionAdorned: false,  // no selection handle when selected
            resizable: true, resizeObjectName: "SHAPE",  // user can resize the Shape
            rotatable: true, rotateObjectName: "SHAPE",  // rotate the Shape without rotating the label
            // don't re-layout when node changes size
            layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized
          },
          new go.Binding("layerName", "isHighlighted", function(h) { return h ? "Foreground" : ""; }).ofObject(),
          $(go.Shape,
            {
              name: "SHAPE",  // named so that the above properties can refer to this GraphObject
              width: 70, height: 70,
              stroke: "#C2185B",
              fill: "#F48FB1",
              strokeWidth: 3
            }),
          $(go.TextBlock,  // the label
            {
              margin: 4,
              font: "bold 18px sans-serif",
              background: 'white',
              width: 150, height: 20
            },
            new go.Binding("visible", "isHighlighted").ofObject(),
            new go.Binding("text", "key"))
        );

      diagram.model.nodeDataArray = [{ key: "Fig1" }, { key: "Fig2" }];

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var n1 = diagram.nodes.first();
      n1.position = n1.position.copy()

      diagram.startTransaction();
      diagram.commitTransaction();

      n1.isHighlighted = true;

      diagram.startTransaction();
      diagram.commitTransaction();
      test.assert(diagram.nodes.first().location.x === 0, "location is off");
    }
  )); // end test

  //
  posLocTests.add(new Test('Pos/Loc reconciliation 5', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.layout = $(go.GridLayout, { wrappingColumn: 1 });

      diagram.nodeTemplate = $(go.Node, $(go.Shape));

      diagram.linkTemplate =
        $(go.Link,
          { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
            // to line up the Link in the same manner we have to pretend the Link has the same location spot
            //locationSpot: go.Spot.Center,
            selectionAdornmentTemplate:
              $(go.Adornment, "Link",
                { locationSpot: go.Spot.Center },
                $(go.Shape,
                  { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }),
                $(go.Shape,  // the arrowhead
                  { toArrow: "Standard", stroke: null })
              )
          },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points"),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null })
        );
      diagram.model = new go.GraphLinksModel([  // specify the contents of the Palette
        { text: "Start", figure: "Circle", fill: "#00AD5F" }
      ], [
        // the Palette also has a disconnected Link, which the user can drag-and-drop
        { points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
      ]);




    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      test.assert(diagram.links.first().location.x === 0);
      test.assert(diagram.links.first().location.y === 111);
    }
  )); // end test



  var twooh = new TestCollection('2.0 features');
  TestRoot.add(twooh);

  twooh.add(new Test('Part.key, Link.key', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.model = go.GraphObject.make(go.GraphLinksModel,
      { linkKeyProperty: "key", nodeDataArray:    [
          { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ],
        linkDataArray:[ { from: "Alpha", to: "Beta" }, { from: "Alpha", to: "Gamma" }, { from: "Beta", to: "Beta" },
        { from: "Gamma", to: "Delta" }, { from: "Delta", to: "Alpha" } ]
      });
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var a = d.findNodeForKey('Alpha');
      test.assert(a.key === 'Alpha')
      test.assert(a.key === d.model.getKeyForNodeData(d.nodes.first().data));

      var l = d.links.first();
      test.assert(l.key === -1);
      test.assert(l.key === d.model.getKeyForLinkData(l.data));

    }
  )); // end test

  twooh.add(new Test('Model.commit', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.model = go.GraphObject.make(go.GraphLinksModel,
      { linkKeyProperty: "key", nodeDataArray:    [
          { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ],
        linkDataArray:[ { from: "Alpha", to: "Beta" }, { from: "Alpha", to: "Gamma" }, { from: "Beta", to: "Beta" },
        { from: "Gamma", to: "Delta" }, { from: "Delta", to: "Alpha" } ]
      });
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      test.assert(d.findNodeForKey('yep') === null);
      var histcount = d.undoManager.history.length;
      d.model.commit(function(m) { m.addNodeData({ key: 'yep' })}, "Added Node");
      test.assert(d.findNodeForKey('yep') !== null && d.undoManager.history.length === histcount+1);
      d.undoManager.undo();
      test.assert(d.findNodeForKey('yep') === null);

      // test temporary (skipsUndoManager) commit
      test.assert(d.findNodeForKey('second') === null);
      histcount = d.undoManager.history.length;
      d.model.commit(function(m) { m.addNodeData({ key: 'second' })}, null);
      test.assert(d.findNodeForKey('second') !== null && d.undoManager.history.length === histcount);

      // test failed action
      test.assert(d.findNodeForKey('third') === null);
      histcount = d.undoManager.history.length;
      try {
        d.model.commit(function(m) { m.addNodeData({ key: 'third' }); throw new Error("oops"); }, "Added Node");
      } catch (ex) {
        test.assert(d.findNodeForKey('third') === null && d.undoManager.history.length === histcount);
      }
    }
  )); // end test



  twooh.add(new Test('Group.move keep link routes', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();

    diagram.nodeTemplate = $(go.Node, "Auto",
      new go.Binding('position').makeTwoWay(),
      $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { margin: 8 },
        new go.Binding("text", "key"))
    );

    diagram.linkTemplate =
    $(go.Link, {
        routing: go.Link.Orthogonal
      },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape)
    )

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", group: "G", position: new go.Point(0, 0), color: "lightblue" },
      { key: "Beta",  group: "G", position: new go.Point(60, 50), color: "orange" },
      { key: "G", group: "G2", isGroup: true },
      { key: "G2", isGroup: true },


      { key: "Alpha2", group: "G3", position: new go.Point(200, 0), color: "lightblue" },
      { key: "Beta2",   position: new go.Point(309, -34), color: "orange" },
      { key: "G3", group: "G", isGroup: true }
    ],
    [
      // 7 points each
      { from: "Alpha", to: "Beta", "points": [54,17,64,17,74,27,64,42,50,42,50,67,60,67] },
      { from: "Alpha2", to: "Beta2", "points": [ 262,17,272,17, 282,50, 285,17,285,-16,299,-16,309,-16 ] }

    ]);

  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;

    var l = diagram.findNodeForKey('Alpha').findLinksOutOf().first();
    var l2 = diagram.findNodeForKey('Alpha2').findLinksOutOf().first();

    test.assert(l.points.count === 7);
    test.assert(l2.points.count === 7);

    var g = diagram.findNodeForKey('G2');
    diagram.startTransaction();
    g.move(new go.Point(g.position.x, g.position.y + 100))
    diagram.commitTransaction();

    test.assert(l.points.count === 7); // stayed the same
    test.assert(l2.points.count === 6); // this one changed
  }
)); // end test






twooh.add(new Test('Callback for makeImage', null,
function (test) {
  var diagram =  setupTestDiagram(1);
  diagram.reset();

  diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);
}, // END SETUP
null,
function (test) {
  var diagram = getTestDiagram(1);
  var x = 0;
  test.assert(diagram.makeImage({
    callback: function() {
      // success
      x++;
      tearDownTestDiagram(1);
    }
  }) === null, "make image with a callback should return null.");

  setTimeout(function() {
    test.assert(x !== 0, "3 seconds elapsed without makeImage callback getting called");
    test.assert(allDiags[1] === null, "3 seconds elapsed without makeSVG callback getting called");
  }, 3000)

}
)); // end test


twooh.add(new Test('Callback for makeSVG', null,
function (test) {
  var diagram =  setupTestDiagram(2);
  diagram.reset();

  diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);
}, // END SETUP
null,
function (test) {
  var diagram = getTestDiagram(2);
  var x = 0;
  test.assert(diagram.makeSVG({
    callback: function() {
      // success
      x++;
      tearDownTestDiagram(2);
    }
  }) === null, "make SVG with a callback should return null");

  setTimeout(function() {
    test.assert(x !== 0, "3 seconds elapsed without makeSVG callback getting called");
    test.assert(allDiags[2] === null, "3 seconds elapsed without makeSVG callback getting called");
  }, 3000)

}
)); // end test


})(); // End test system


/*
  twooh.add(new Test('TESTNAME', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();



    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


    }
  )); // end test
  */




