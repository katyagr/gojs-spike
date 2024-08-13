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
  var v1 = new TestCollection('Animation');
  TestRoot.add(v1);
  var $ = go.GraphObject.make;

  // These tests are async by nature and need unique names

  var uid = 100;
  function newTestName() {
    return 'gojsDiagramB' + uid++;
  }

  function setup(name, width, height, options) {
    var namediv = name + 'div';
    window[namediv] = document.createElement('div');
    window[namediv].innerHTML = '<div id="' + namediv + '" style="border: solid 1px black; width: ' + width + 'px; height: ' + height + 'px"></div>';

    document.body.appendChild(window[namediv]);
    window[name] = $(go.Diagram, namediv, options);
    return window[name];
  }

  function teardown(name) {
    var namediv = name + 'div';
    document.body.removeChild(window[namediv]);
    window[name].div = null;
    window[name] = null;
    window[namediv] = null;
  }


  // Make sure AnimationStarting fires
  v1.addAnimated(new Test('AnimationStarting', null,
  function (test) {
      test.name = newTestName();
      var diagram = test.diagram;
      diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;
      diagram.animationManager.defaultAnimation.duration = 300;
      diagram.layout = new go.TreeLayout();

      diagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', color: 'orange' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' }
        ],
        [
          { from: 'Alpha', to: 'Beta' },
          { from: 'Alpha', to: 'Gamma' },
          { from: 'Beta', to: 'Beta' },
          { from: 'Gamma', to: 'Delta' },
          { from: 'Delta', to: 'Alpha' }
        ]);
        diagram.startTransaction();
        diagram.commitTransaction();
        diagram.nodes.first().position = new go.Point(0,1);
  },
  null,
  function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        expectation++;
      });
      diagram.addDiagramListener('AnimationFinished', function() {
        test.assert(expectation === 1);
        test.unblock(); // Required!
      });

  }
  )); // end test



  v1.addAnimated(new Test('A2', null,
  function (test) {
      test.name = newTestName();
      var diagram = test.diagram;
      diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;
      diagram.animationManager.defaultAnimation.duration = 300;
      diagram.layout = new go.TreeLayout();
      diagram.nodeTemplate = $(go.Node, "Spot",
        $(go.TextBlock, { width: 40, height: 15 },
          new go.Binding('text', 'key'))
      )

      diagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', color: 'orange' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' }
        ],
        [
        ]);
        diagram.startTransaction();
        diagram.commitTransaction();
        diagram.nodes.first().position = new go.Point(0,1);
  },
  null,
  function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;

      var expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        // test.assert('starting');
        diagram.animationManager.defaultAnimation.suspend();

        diagram.animationManager.defaultAnimation.advanceTo(0);
        test.assert(diagram.documentBounds.toString() === "Rect(-5,-5,50,25)"); // small doc bounds
        test.assert(diagram.findNodeForKey('Delta').position.y === 0); // top of doc bounds
        diagram.animationManager.defaultAnimation.advanceTo(0, true);
      });
      diagram.addDiagramListener('AnimationFinished', function() {
        // test.assert('done');
        test.assert(diagram.documentBounds.toString() === "Rect(-5,-4,50,249)"); // big doc bounds
        test.assert(diagram.findNodeForKey('Delta').position.y === 225); // bottom of doc bounds (except node size + padding)
        test.unblock(); // Required!
      });

  }
  )); // end test



  v1.addAnimated(new Test('Data Viz', null,
  function (test) {
      test.name = newTestName();
      var diagram = test.diagram;
      diagram.reset();
      diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;

      diagram = setup('DataViz', 400, 400, {
        contentAlignment: go.Spot.Center,  // content is always centered in the viewport
        autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
      });
      diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          {
            selectable: false
          },
          new go.Binding("location", "", function(_nothing, elt) {
            return new go.Point(elt.data[myLocation.x] * 200,
              elt.data[myLocation.y] * 200)
          }),
          new go.AnimationTrigger("position", null, go.AnimationTrigger.Bundled),

          $(go.Shape, "Hexagon",
            {
              name: "SHAPE",
              width: 20, height: 20,
              strokeWidth: 4, stroke: null
            },
            new go.Binding("fill", "species", function(name) {
              switch (name) {
                case "Iris-setosa": return "rgba(240, 120,  50, .6)";
                case "Iris-versicolor": return "rgba(240, 230, 120, .6)";
                case "Iris-virginica": return "rgba(125, 200, 120, .6)";
              }
              return "black";
            }))
        );
      var myLocation = {  // this controls the data properties used by data binding conversions
        x: "sepalLength",
        y: "sepalWidth"
      }
      var s = ["Iris-setosa","Iris-versicolor","Iris-virginica" ]
      var irisData = [
        [5.1, 3.5, 1.4, 0.2, s[0]], [4.9, 3.0, 1.4, 0.2, s[0]], [4.7, 3.2, 1.3, 0.2, s[0]], [4.6, 3.1, 1.5, 0.2, s[0]], [5.0, 3.6, 1.4, 0.2, s[0]], [5.4, 3.9, 1.7, 0.4, s[0]],
        [4.6, 3.4, 1.4, 0.3, s[0]], [5.0, 3.4, 1.5, 0.2, s[0]], [4.4, 2.9, 1.4, 0.2, s[0]], [4.9, 3.1, 1.5, 0.1, s[0]], [5.4, 3.7, 1.5, 0.2, s[0]], [4.8, 3.4, 1.6, 0.2, s[0]],
        [4.8, 3.0, 1.4, 0.1, s[0]], [4.3, 3.0, 1.1, 0.1, s[0]], [5.8, 4.0, 1.2, 0.2, s[0]], [5.7, 4.4, 1.5, 0.4, s[0]], [5.4, 3.9, 1.3, 0.4, s[0]], [5.1, 3.5, 1.4, 0.3, s[0]],
        [5.7, 3.8, 1.7, 0.3, s[0]], [5.1, 3.8, 1.5, 0.3, s[0]], [5.4, 3.4, 1.7, 0.2, s[0]], [5.1, 3.7, 1.5, 0.4, s[0]], [4.6, 3.6, 1.0, 0.2, s[0]], [5.1, 3.3, 1.7, 0.5, s[0]],
        [4.8, 3.4, 1.9, 0.2, s[0]], [5.0, 3.0, 1.6, 0.2, s[0]], [5.0, 3.4, 1.6, 0.4, s[0]], [5.2, 3.5, 1.5, 0.2, s[0]], [5.2, 3.4, 1.4, 0.2, s[0]], [4.7, 3.2, 1.6, 0.2, s[0]],
        [4.8, 3.1, 1.6, 0.2, s[0]], [5.4, 3.4, 1.5, 0.4, s[0]], [5.2, 4.1, 1.5, 0.1, s[0]], [5.5, 4.2, 1.4, 0.2, s[0]], [4.9, 3.1, 1.5, 0.2, s[0]], [5.0, 3.2, 1.2, 0.2, s[0]],
        [5.5, 3.5, 1.3, 0.2, s[0]], [4.9, 3.6, 1.4, 0.1, s[0]], [4.4, 3.0, 1.3, 0.2, s[0]], [5.1, 3.4, 1.5, 0.2, s[0]], [5.0, 3.5, 1.3, 0.3, s[0]], [4.5, 2.3, 1.3, 0.3, s[0]],
        [4.4, 3.2, 1.3, 0.2, s[0]], [5.0, 3.5, 1.6, 0.6, s[0]], [5.1, 3.8, 1.9, 0.4, s[0]], [4.8, 3.0, 1.4, 0.3, s[0]], [5.1, 3.8, 1.6, 0.2, s[0]], [4.6, 3.2, 1.4, 0.2, s[0]],
        [5.3, 3.7, 1.5, 0.2, s[0]], [5.0, 3.3, 1.4, 0.2, s[0]], [7.0, 3.2, 4.7, 1.4, s[1]], [6.4, 3.2, 4.5, 1.5, s[1]], [6.9, 3.1, 4.9, 1.5, s[1]], [5.5, 2.3, 4.0, 1.3, s[1]],
        [6.5, 2.8, 4.6, 1.5, s[1]], [5.7, 2.8, 4.5, 1.3, s[1]], [6.3, 3.3, 4.7, 1.6, s[1]], [4.9, 2.4, 3.3, 1.0, s[1]], [6.6, 2.9, 4.6, 1.3, s[1]], [5.2, 2.7, 3.9, 1.4, s[1]],
        [5.0, 2.0, 3.5, 1.0, s[1]], [5.9, 3.0, 4.2, 1.5, s[1]], [6.0, 2.2, 4.0, 1.0, s[1]], [6.1, 2.9, 4.7, 1.4, s[1]], [5.6, 2.9, 3.6, 1.3, s[1]], [6.7, 3.1, 4.4, 1.4, s[1]],
        [5.6, 3.0, 4.5, 1.5, s[1]], [5.8, 2.7, 4.1, 1.0, s[1]], [6.2, 2.2, 4.5, 1.5, s[1]], [5.6, 2.5, 3.9, 1.1, s[1]], [5.9, 3.2, 4.8, 1.8, s[1]], [6.1, 2.8, 4.0, 1.3, s[1]],
        [6.3, 2.5, 4.9, 1.5, s[1]], [6.1, 2.8, 4.7, 1.2, s[1]], [6.4, 2.9, 4.3, 1.3, s[1]], [6.6, 3.0, 4.4, 1.4, s[1]], [6.8, 2.8, 4.8, 1.4, s[1]], [6.7, 3.0, 5.0, 1.7, s[1]],
        [6.0, 2.9, 4.5, 1.5, s[1]], [5.7, 2.6, 3.5, 1.0, s[1]], [5.5, 2.4, 3.8, 1.1, s[1]], [5.5, 2.4, 3.7, 1.0, s[1]], [5.8, 2.7, 3.9, 1.2, s[1]],
        [6.0, 2.7, 5.1, 1.6, s[1]], [5.4, 3.0, 4.5, 1.5, s[1]], [6.0, 3.4, 4.5, 1.6, s[1]], [6.7, 3.1, 4.7, 1.5, s[1]], [6.3, 2.3, 4.4, 1.3, s[1]], [5.6, 3.0, 4.1, 1.3, s[1]],
        [5.5, 2.5, 4.0, 1.3, s[1]], [5.5, 2.6, 4.4, 1.2, s[1]], [6.1, 3.0, 4.6, 1.4, s[1]], [5.8, 2.6, 4.0, 1.2, s[1]], [5.0, 2.3, 3.3, 1.0, s[1]], [5.6, 2.7, 4.2, 1.3, s[1]],
        [5.7, 3.0, 4.2, 1.2, s[1]], [5.7, 2.9, 4.2, 1.3, s[1]], [6.2, 2.9, 4.3, 1.3, s[1]], [5.1, 2.5, 3.0, 1.1, s[1]], [5.7, 2.8, 4.1, 1.3, s[1]], [6.3, 3.3, 6.0, 2.5, s[2]],
        [5.8, 2.7, 5.1, 1.9, s[2]], [7.1, 3.0, 5.9, 2.1, s[2]], [6.3, 2.9, 5.6, 1.8, s[2]], [6.5, 3.0, 5.8, 2.2, s[2]], [7.6, 3.0, 6.6, 2.1, s[2]], [4.9, 2.5, 4.5, 1.7, s[2]],
        [7.3, 2.9, 6.3, 1.8, s[2]], [6.7, 2.5, 5.8, 1.8, s[2]], [7.2, 3.6, 6.1, 2.5, s[2]], [6.5, 3.2, 5.1, 2.0, s[2]], [6.4, 2.7, 5.3, 1.9, s[2]], [6.8, 3.0, 5.5, 2.1, s[2]],
        [5.7, 2.5, 5.0, 2.0, s[2]], [5.8, 2.8, 5.1, 2.4, s[2]], [6.4, 3.2, 5.3, 2.3, s[2]], [6.5, 3.0, 5.5, 1.8, s[2]], [7.7, 3.8, 6.7, 2.2, s[2]], [7.7, 2.6, 6.9, 2.3, s[2]],
        [6.0, 2.2, 5.0, 1.5, s[2]], [6.9, 3.2, 5.7, 2.3, s[2]], [5.6, 2.8, 4.9, 2.0, s[2]], [7.7, 2.8, 6.7, 2.0, s[2]], [6.3, 2.7, 4.9, 1.8, s[2]], [6.7, 3.3, 5.7, 2.1, s[2]],
        [7.2, 3.2, 6.0, 1.8, s[2]], [6.2, 2.8, 4.8, 1.8, s[2]], [6.1, 3.0, 4.9, 1.8, s[2]], [6.4, 2.8, 5.6, 2.1, s[2]], [7.2, 3.0, 5.8, 1.6, s[2]], [7.4, 2.8, 6.1, 1.9, s[2]],
        [7.9, 3.8, 6.4, 2.0, s[2]], [6.4, 2.8, 5.6, 2.2, s[2]], [6.3, 2.8, 5.1, 1.5, s[2]], [6.1, 2.6, 5.6, 1.4, s[2]], [7.7, 3.0, 6.1, 2.3, s[2]], [6.3, 3.4, 5.6, 2.4, s[2]],
        [6.4, 3.1, 5.5, 1.8, s[2]], [6.0, 3.0, 4.8, 1.8, s[2]], [6.9, 3.1, 5.4, 2.1, s[2]], [6.7, 3.1, 5.6, 2.4, s[2]], [6.9, 3.1, 5.1, 2.3, s[2]], [5.8, 2.7, 5.1, 1.9, s[2]],
        [6.8, 3.2, 5.9, 2.3, s[2]], [6.7, 3.3, 5.7, 2.5, s[2]], [6.7, 3.0, 5.2, 2.3, s[2]], [6.3, 2.5, 5.0, 1.9, s[2]], [6.5, 3.0, 5.2, 2.0, s[2]], [6.2, 3.4, 5.4, 2.3, s[2]],
        [5.9, 3.0, 5.1, 1.8, "Iris-virginica"]
      ];

      // now convert that data into an Array of JavaScript Objects,
      // to be used as the Model.nodeDataArray
      var array = [];
      for (var i = 0; i < irisData.length; i++) {
        var line = irisData[i];
        var data = {
          sepalLength: line[0],
          sepalWidth: line[1],
          petalLength: line[2],
          petalWidth: line[3],
          species: line[4]
        };
        array.push(data);
      }

      // create the Model for the Diagram to display
      diagram.model = new go.Model(array);


  },
  null,
  function (test) {
      var diagram = window['DataViz'];

      diagram.addDiagramListener('AnimationStarting', function() {
        // console.log('starting');
        diagram.animationManager.defaultAnimation.suspend();
        diagram.animationManager.defaultAnimation.advanceTo(1);
        test.assert(diagram.scale === 1);
        diagram.animationManager.defaultAnimation.advanceTo(590);
        test.assert(diagram.scale < 0.6 && diagram.scale > 0.5);
        diagram.animationManager.defaultAnimation.advanceTo(2, true);
      });
      diagram.addDiagramListener('AnimationFinished', function() {
        // console.log('done');
        test.assert(diagram.scale < 0.6 && diagram.scale > 0.5);
        teardown('DataViz');
        test.unblock(); // Required!
      });

  }
  )); // end test

  // Ensure the document bounds update correctly during animation
  // Ensure that the Diagram.position stays
  v1.addAnimated(new Test('DocumentboundsTest', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE1', 400, 400, {
    });
    diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Spot",  // the Shape will go around the TextBlock
        $(go.Shape, "RoundedRectangle", { width: 70, height: 50,  strokeWidth: 0, fill: "white" },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue" },
        { key: "Beta", color: "orange" },
        { key: "Gamma", color: "lightgreen" },
        { key: "Delta", color: "pink" }
      ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE1'];

    diagram.addDiagramListener('AnimationStarting', function() {
      // console.log('starting');
      var anim = diagram.animationManager.defaultAnimation;
      anim.suspend();
      anim.advanceTo(1);

      //console.log(diagram.position); // Point {_x: -164.99975, _y: -174.99980555555555, _isFrozen: true}
      test.assert(test.isApprox(diagram.position.x, -164.99975));
      test.assert(test.isApprox(diagram.position.y, -174.99980555555555));
      //console.log(diagram.documentBounds.toString()); // Rect(-5,-5,80.0005,60.00038888888889)
      test.assert(diagram.documentBounds.x === -5);
      test.assert(diagram.documentBounds.y === -5);
      test.assert(test.isApprox(diagram.documentBounds.width, 80));
      test.assert(test.isApprox(diagram.documentBounds.height, 60));
      anim.advanceTo(300);
      //console.log(diagram.documentBounds.toString()); // Rect(-5,-5,125,95)
      //console.log(diagram.position); // Point {_x: -142.5, _y: -157.5, _isFrozen: true}
      test.assert(test.isApprox(diagram.position.x, -142));
      test.assert(test.isApprox(diagram.position.y, -157));
      test.assert(diagram.documentBounds.x === -5);
      test.assert(diagram.documentBounds.y === -5);
      test.assert(test.isApprox(diagram.documentBounds.width, 125));
      test.assert(test.isApprox(diagram.documentBounds.height, 95));
      anim.advanceTo(550);
      //console.log(diagram.position); // Point {_x: -120.625, _y: -140.48611111111111, _isFrozen: true}
      test.assert(test.isApprox(diagram.position.x, -120.625));
      test.assert(test.isApprox(diagram.position.y, -140.48));

      //console.log(diagram.documentBounds.toString()); // Rect(-5,-5,168.75,129.02777777777777)
      test.assert(diagram.documentBounds.x === -5);
      test.assert(diagram.documentBounds.y === -5);
      test.assert(test.isApprox(diagram.documentBounds.width, 168.75));
      test.assert(test.isApprox(diagram.documentBounds.height, 129.02));
      anim.advanceTo(250, true);
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      //console.log('done');
      test.assert(diagram.position.x === -120);
      test.assert(diagram.position.y === -140);
      //console.log(diagram.documentBounds.toString()); // Rect(-5,-5,170,130)
      test.assert(diagram.documentBounds.x === -5);
      test.assert(diagram.documentBounds.y === -5);
      test.assert(diagram.documentBounds.width === 170);
      test.assert(diagram.documentBounds.height === 130);

      teardown('EXAMPLE1');
      test.unblock(); // Required!
    });

  }
  )); // end test



  // ensure diagram is positioned correct when
  // initialDocumentSpot: go.Spot.TopCenter,
  // initialViewportSpot: go.Spot.TopCenter,
  // are set
  v1.addAnimated(new Test('initialSpot', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE2', 500, 300, {
      padding: 0,
      initialDocumentSpot: go.Spot.TopCenter,
      initialViewportSpot: go.Spot.TopCenter,
      layout:
        $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
          {
            treeStyle: go.TreeLayout.StyleLastParents,
            angle: 90, layerSpacing: 80, alternateAngle: 0, alternateAlignment: go.TreeLayout.AlignmentStart,
            alternateNodeIndent: 20, alternateNodeIndentPastParent: 1, alternateNodeSpacing: 20, alternateLayerSpacing: 40,
            alternateLayerSpacingParentOverlap: 1, alternatePortSpot: new go.Spot(0.001, 1, 20, 0), alternateChildPortSpot: go.Spot.Left
          })
    });
    diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;


  // define the Node template
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      // the outer shape for the node, surrounding the Table
      $(go.Shape, "Rectangle",
        { stroke: null, strokeWidth: 0 },
        /* reddish if highlighted, blue otherwise */
        new go.Binding("fill", "isHighlighted", function(h) { return h ? "#F44336" : "#A7E7FC"; }).ofObject()),
      // a table to contain the different parts of the node
      $(go.Panel, "Table",
        { margin: 6, maxSize: new go.Size(200, NaN) },
        // the two TextBlocks in column 0 both stretch in width
        // but align on the left side
        $(go.RowColumnDefinition,
          {
            column: 0,
            stretch: go.GraphObject.Horizontal,
            alignment: go.Spot.Left
          }),
        // the name
        $(go.TextBlock,
          {
            row: 0, column: 0,
            maxSize: new go.Size(160, NaN), margin: 2,
            font: "500 16px Roboto, sans-serif",
            alignment: go.Spot.Top
          },
          new go.Binding("text", "name")),
        // the country flag
        $(go.Picture,
          {
            row: 0, column: 1, margin: 2,
            imageStretch: go.GraphObject.Uniform,
            alignment: go.Spot.TopRight,
            background: 'red',
            desiredSize: new go.Size(34, 26)
          }),
        // the additional textual information
        $(go.TextBlock,
          {
            row: 1, column: 0, columnSpan: 2,
            font: "12px Roboto, sans-serif"
          })
      )  // end Table Panel
    );  // end Node


  // set up the nodeDataArray, describing each person/position
  var nodeDataArray = [
    { key: 0, name: "Ban Ki-moon 반기문", nation: "South Korea", title: "Secretary-General of the United Nations", headOf: "Secretariat" },
    { key: 1, boss: 0, name: "Patricia O'Brien", nation: "Ireland", title: "Under-Secretary-General for Legal Affairs and United Nations Legal Counsel", headOf: "Office of Legal Affairs" },
    { key: 3, boss: 1, name: "Peter Taksøe-Jensen", nation: "Denmark", title: "Assistant Secretary-General for Legal Affairs" },
    { key: 9, boss: 3, name: "Other Employees" },
    { key: 4, boss: 1, name: "Maria R. Vicien - Milburn", nation: "Argentina", title: "General Legal Division Director", headOf: "General Legal Division" },
    { key: 10, boss: 4, name: "Other Employees" },
    { key: 5, boss: 1, name: "Václav Mikulka", nation: "Czech Republic", title: "Codification Division Director", headOf: "Codification Division" },
    { key: 11, boss: 5, name: "Other Employees" },
    { key: 6, boss: 1, name: "Sergei Tarassenko", nation: "Russia", title: "Division for Ocean Affairs and the Law of the Sea Director", headOf: "Division for Ocean Affairs and the Law of the Sea" },
    { key: 12, boss: 6, name: "Alexandre Tagore Medeiros de Albuquerque", nation: "Brazil", title: "Chairman of the Commission on the Limits of the Continental Shelf", headOf: "The Commission on the Limits of the Continental Shelf" },
    { key: 17, boss: 12, name: "Peter F. Croker", nation: "Ireland", title: "Chairman of the Committee on Confidentiality", headOf: "The Committee on Confidentiality" },
    { key: 31, boss: 17, name: "Michael Anselme Marc Rosette", nation: "Seychelles", title: "Vice Chairman of the Committee on Confidentiality" },
    { key: 32, boss: 17, name: "Kensaku Tamaki", nation: "Japan", title: "Vice Chairman of the Committee on Confidentiality" },
    { key: 33, boss: 17, name: "Osvaldo Pedro Astiz", nation: "Argentina", title: "Member of the Committee on Confidentiality" },
    { key: 34, boss: 17, name: "Yuri Borisovitch Kazmin", nation: "Russia", title: "Member of the Committee on Confidentiality" },
    { key: 18, boss: 12, name: "Philip Alexander Symonds", nation: "Australia", title: "Chairman of the Committee on provision of scientific and technical advice to coastal States", headOf: "Committee on provision of scientific and technical advice to coastal States" },
    { key: 35, boss: 18, name: "Emmanuel Kalngui", nation: "Cameroon", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
    { key: 36, boss: 18, name: "Sivaramakrishnan Rajan", nation: "India", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
    { key: 37, boss: 18, name: "Francis L. Charles", nation: "Trinidad and Tobago", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
    { key: 38, boss: 18, name: "Mihai Silviu German", nation: "Romania", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
    { key: 19, boss: 12, name: "Lawrence Folajimi Awosika", nation: "Nigeria", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
    { key: 20, boss: 12, name: "Harald Brekke", nation: "Norway", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
    { key: 21, boss: 12, name: "Yong-Ahn Park", nation: "South Korea", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
    { key: 22, boss: 12, name: "Abu Bakar Jaafar", nation: "Malaysia", title: "Chairman of the Editorial Committee", headOf: "Editorial Committee" },
    { key: 23, boss: 12, name: "Galo Carrera Hurtado", nation: "Mexico", title: "Chairman of the Training Committee", headOf: "Training Committee" },
    { key: 24, boss: 12, name: "Indurlall Fagoonee", nation: "Mauritius", title: "Member of the Commission on the Limits of the Continental Shelf" },
    { key: 25, boss: 12, name: "George Jaoshvili", nation: "Georgia", title: "Member of the Commission on the Limits of the Continental Shelf" },
    { key: 26, boss: 12, name: "Wenzhang Lu", nation: "China", title: "Member of the Commission on the Limits of the Continental Shelf" },
    { key: 27, boss: 12, name: "Isaac Owusu Orudo", nation: "Ghana", title: "Member of the Commission on the Limits of the Continental Shelf" },
    { key: 28, boss: 12, name: "Fernando Manuel Maia Pimentel", nation: "Portugal", title: "Member of the Commission on the Limits of the Continental Shelf" },
    { key: 7, boss: 1, name: "Renaud Sorieul", nation: "France", title: "International Trade Law Division Director", headOf: "International Trade Law Division" },
    { key: 13, boss: 7, name: "Other Employees" },
    { key: 8, boss: 1, name: "Annebeth Rosenboom", nation: "Netherlands", title: "Treaty Section Chief", headOf: "Treaty Section" },
    { key: 14, boss: 8, name: "Bradford Smith", nation: "United States", title: "Substantive Legal Issues Head", headOf: "Substantive Legal Issues" },
    { key: 29, boss: 14, name: "Other Employees" },
    { key: 15, boss: 8, name: "Andrei Kolomoets", nation: "Russia", title: "Technical/Legal Issues Head", headOf: "Technical/Legal Issues" },
    { key: 30, boss: 15, name: "Other Employees" },
    { key: 16, boss: 8, name: "Other Employees" },
    { key: 2, boss: 0, name: "Heads of Other Offices/Departments" }
  ];

  // create the Model with data for the tree, and assign to the Diagram
  diagram.model =
    $(go.TreeModel,
      {
        nodeParentKeyProperty: "boss",  // this property refers to the parent node data
        nodeDataArray: nodeDataArray
      });

  }, null, function (test) {
    var diagram = window['EXAMPLE2'];
    function within20(a, b) {
      return Math.abs(a - b) < 20;
    }
    diagram.addDiagramListener('AnimationStarting', function() {
      // console.log('starting');
      var anim = diagram.animationManager.defaultAnimation;
      anim.suspend();
      anim.advanceTo(1);
      //console.log(diagram.position.toString());
      //console.log(diagram.documentBounds.toString());
      anim.advanceTo(350);
      test.assert(diagram.position.y === 0, "position off 1");
      test.assert(within20((diagram.documentBounds.width /2 ) - (diagram.viewportBounds.width / 2), diagram.position.x), "not within 20px 1");
      //console.log(diagram.position.toString());
      //console.log(diagram.documentBounds.toString());
      anim.advanceTo(550);
      test.assert(diagram.position.y === 0, "position off 2");
      test.assert(within20((diagram.documentBounds.width /2 ) - (diagram.viewportBounds.width / 2), diagram.position.x), "not within 20px 2");
      //console.log(diagram.position.toString());
      //console.log(diagram.documentBounds.toString());
      //anim.advanceTo(551);
    anim.advanceTo(250, true);
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      //console.log('done');
      //console.log(diagram.documentBounds.toString()); // Rect(-5,-5,170,130)
      test.assert(diagram.position.y === 0, "position off 3");
      test.assert(within20((diagram.documentBounds.width /2 ) - (diagram.viewportBounds.width / 2), diagram.position.x), "not within 20px 3");
      teardown('EXAMPLE2');
      test.unblock(); // Required!
    });

  }
  )); // end test


  v1.addAnimated(new Test('New Default Animation', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 200;
    diagram = setup('EXAMPLE3', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
    });

    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
        { key: 'Gamma', color: 'lightgreen' },
        { key: 'Delta', color: 'pink' }
      ],
      [
      ]);


  }, null, function (test) {
    var diagram = window['EXAMPLE3'];

    diagram.addDiagramListener('AnimationStarting', function() {
      // console.log('starting');
      diagram.animationManager.defaultAnimation.suspend();
      setTimeout(function() {

        diagram.animationManager.defaultAnimation.advanceTo(1);
                // Make sure document bounds start larger than they would if they were all nodes atop each other:
        test.assert(diagram.documentBounds.width > 80);
        test.assert(diagram.documentBounds.height > 80);
        test.assert(diagram.documentBounds.x === -5); // default padding
        test.assert(diagram.documentBounds.y === -5);
        var docb =(diagram.documentBounds.toString());
        var posy = (diagram.position.y);

        // Finally make sure scrollbars are not appearing:
        test.assert(diagram.div.firstElementChild.clientHeight === test.SIZE); // must match div made above
        test.assert(diagram.div.firstElementChild.clientWidth === test.SIZE); // must match div made above
        test.assert(diagram.scrollMode === go.Diagram.InfiniteScroll);


        diagram.animationManager.defaultAnimation.advanceTo(100);
        // doc bounds should remain the same:
        test.assert(diagram.documentBounds.width > 80);
        test.assert(diagram.documentBounds.height > 80);
        test.assert(diagram.documentBounds.x === -5); // default padding
        test.assert(diagram.documentBounds.y === -5);
        test.assert(diagram.documentBounds.toString() === docb);
        test.assert(diagram.position.y > posy); // make sure its moving up

        diagram.animationManager.defaultAnimation.advanceTo(590);
        test.assert(diagram.documentBounds.width > 80);
        diagram.animationManager.defaultAnimation.advanceTo(591);
        diagram.animationManager.defaultAnimation.advanceTo(2, true);
      }, 1);

      //test.assert(diagram.scale < 0.6 && diagram.scale > 0.5);

    });
    diagram.addDiagramListener('AnimationFinished', function() {
      // Make sure this gets set back:
      test.assert(diagram.scrollMode === go.Diagram.DocumentScroll);
      // still should have no scrollbars:
      test.assert(diagram.div.firstElementChild.clientHeight === test.SIZE); // must match div made above
      test.assert(diagram.div.firstElementChild.clientWidth === test.SIZE); // must match div made above
      teardown('EXAMPLE3');
      test.unblock(); // Required!
    });

  }
  )); // end test



  v1.addAnimated(new Test('Too small = scrollbars', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    test.SIZE = 200;
    diagram = setup('EXAMPLE4', test.SIZE, test.SIZE, { });
    diagram.animationManager.defaultAnimation.duration = 300;
    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "RoundedRectangle", { strokeWidth: 0 }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 8 }, new go.Binding("text", "key")));

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" }, { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);


  }, null, function (test) {
    var diagram = window['EXAMPLE4'];

    diagram.addDiagramListener('AnimationStarting', function() {
      diagram.animationManager.defaultAnimation.suspend();
      setTimeout(function() {
        diagram.animationManager.defaultAnimation.advanceTo(1);
        if (navigator.platform === 'Win32') { // scrollbar size check will only work on systems that have scrollbars that take up space
          // must NOT match div made above
          test.assert(diagram.div.firstElementChild.clientHeight !== test.SIZE);
          test.assert(diagram.div.firstElementChild.clientWidth !== test.SIZE);
          diagram.animationManager.defaultAnimation.advanceTo(100);
          test.assert(diagram.div.firstElementChild.clientHeight !== test.SIZE);
          test.assert(diagram.div.firstElementChild.clientWidth !== test.SIZE);
          diagram.animationManager.defaultAnimation.advanceTo(591);
        }
        diagram.animationManager.defaultAnimation.advanceTo(2, true);
      }, 1);
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      // still should have no scrollbars:
      if (navigator.platform === 'Win32') { // scrollbar size check will only work on systems that have scrollbars that take up space
        test.assert(diagram.div.firstElementChild.clientHeight !== test.SIZE); // must NOT match div made above
        test.assert(diagram.div.firstElementChild.clientWidth !== test.SIZE); // must NOT match div made above
      }
      // let any other updates happen to scrollbar and check again
      setTimeout(() => {
        if (navigator.platform === 'Win32') { // scrollbar size check will only work on systems that have scrollbars that take up space
          test.assert(diagram.div.firstElementChild.clientHeight !== test.SIZE); // must NOT match div made above
          test.assert(diagram.div.firstElementChild.clientWidth !== test.SIZE); // must NOT match div made above
        }
        teardown('EXAMPLE4');
        test.unblock(); // Required!
      }, 300);
    });
  }
  )); // end test



  v1.addAnimated(new Test('just right = no scrollbars', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    test.SIZE = 200;
    diagram = setup('EXAMPLE5', test.SIZE, test.SIZE, { });
    diagram.animationManager.defaultAnimation.duration = 300;

    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "RoundedRectangle", { width: 84, height: 85, strokeWidth: 0 }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 1 }, new go.Binding("text", "key")));

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" }, { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);


  }, null, function (test) {
    var diagram = window['EXAMPLE5'];

    diagram.addDiagramListener('AnimationStarting', function() {
      diagram.animationManager.defaultAnimation.suspend();
      setTimeout(function() {
        diagram.animationManager.defaultAnimation.advanceTo(1);
        if (navigator.platform === 'Win32') { // scrollbar size check will only work on systems that have scrollbars that take up space
          test.assert(diagram.div.firstElementChild.clientHeight === test.SIZE);
          test.assert(diagram.div.firstElementChild.clientWidth === test.SIZE);

          diagram.animationManager.defaultAnimation.advanceTo(100);
          test.assert(diagram.div.firstElementChild.clientHeight === test.SIZE);
          test.assert(diagram.div.firstElementChild.clientWidth === test.SIZE);
          diagram.animationManager.defaultAnimation.advanceTo(591);
        }
        diagram.animationManager.defaultAnimation.advanceTo(2, true);
      }, 1);
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      // still should have no scrollbars:
      if (navigator.platform === 'Win32') { // scrollbar size check will only work on systems that have scrollbars that take up space
        test.assert(diagram.div.firstElementChild.clientHeight === test.SIZE); // must match div made above
        test.assert(diagram.div.firstElementChild.clientWidth === test.SIZE); // must match div made above
      }
      teardown('EXAMPLE5');
      test.unblock(); // Required!
    });
  }
  )); // end test



  // Test for making sure animation.finished works,
  // and that the animated value is actually changed
  // and that AnimationStarting and AnimationFinished do not fire when there's no default animation
  v1.addAnimated(new Test('Animate position', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE6', 400, 400, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport

    });
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
    { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE6'];
    var alpha = diagram.findNodeForKey('Alpha')
    diagram.addDiagramListener('AnimationStarting', function() {
      test.assert(false, "Should never happen, no default animation occurs here");
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      test.assert(false, "Should never happen, no default animation occurs here");
    });

    function animate() {
      var anim = new go.Animation();
      anim.add(alpha, "position", alpha.position, new go.Point(150, 150));
      anim.finished = function(animation) {
        test.assert(alpha.position.equals(new go.Point(150, 150)));
        teardown('EXAMPLE6');
        test.unblock(); // Required!
      }
      anim.start();
    }
    animate();

  }
  )); // end test


  // reversible = true, make sure value does not change
  // Also make sure it takes longer than the duration
  v1.addAnimated(new Test('Animate position+reverse', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE7', 400, 400, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport

    });
    diagram.animationManager.defaultAnimation.duration = 300;
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
    { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE7'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      var anim = new go.Animation();
      anim.add(alpha, "position", alpha.position, new go.Point(150, 150));
      anim.finished = function(animation) {
        var date2 = +new Date();
        test.assert((date2 - date1) >= 1200); // Should be much longer than 600ms single duration
        test.assert(alpha.position.equals(new go.Point(0, 0)));

        teardown('EXAMPLE7');
        test.unblock(); // Required!
      }
      anim.reversible = true;
      var date1 = +new Date();
      anim.start();
    }
    animate();

  }
  )); // end test



  // reversible = true, make sure value does not change
  // Make sure value is "correct" halfway through
  // make sure animateTo works with increased (doubled) duration of reversible animations
  // make sure anim.isAnimating is true during the animation and is false in the finished() func
  v1.addAnimated(new Test('Animate position+reverse2', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE8', 400, 400, {
      //contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      //autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport

    });
    diagram.animationManager.isInitial = false;
    diagram.animationManager.defaultAnimation.duration = 300;
    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
    { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE8'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      var anim = new go.Animation();
      anim.add(alpha, "position", alpha.position, new go.Point(150, 150));
      anim.finished = function(animation) {
        test.assert(alpha.position.equals(new go.Point(0, 0)));
        test.assert(!anim.isAnimating);
        teardown('EXAMPLE8');
        test.unblock(); // Required!
      }
      anim.reversible = true;
      anim.start();
      anim.suspend();
      anim.advanceTo(600);
      test.assert(anim.isAnimating);
      test.assert(alpha.position.equals(new go.Point(150, 150)));
      anim.advanceTo(1000);
      test.assert(alpha.position.x < 100);
      test.assert(alpha.position.y < 100);
      anim.advanceTo(1001, true);
    }
    setTimeout(function() { animate(); }, 15);


  }
  )); // end test


  go.AnimationManager.defineAnimationEffect('bounceDelete',
  function (obj, startValue, endValue, easing, currentTime, duration, animation) {
    var animationState = animation.getTemporaryState(obj);
    if (animationState.initial === undefined) {
      animationState.yPos = obj.location.y; animationState.xPos = obj.location.x;
      animationState.yVelo = 0; animationState.xVelo = 0;
      animationState.newTime = 0; animationState.oldTime = 0; animationState.initial = true;
    }
    obj.location = getPointBounceDelete(currentTime, obj, animationState, obj.diagram);
  }
);

function getPointBounceDelete(currentTime, obj, animationState, diagram) {
  if (diagram === null) return new go.Point(animationState.xPos, animationState.yPos);
  var height = obj.actualBounds.height; animationState.newTime = currentTime;
  var delTime = (animationState.newTime - animationState.oldTime) / 3;
  animationState.yVelo += .05 * delTime;
  if (currentTime < 200) { animationState.xVelo = currentTime / 50; }
  animationState.yPos += animationState.yVelo * delTime;
  animationState.xPos += animationState.xVelo * delTime;
  if (animationState.yPos > diagram.viewportBounds.height / 2 - height) {
    animationState.yVelo = -.75 * animationState.yVelo;
    animationState.yPos = diagram.viewportBounds.height / 2 - height;
  }
  var myPoint = new go.Point(animationState.xPos, animationState.yPos)
  animationState.oldTime = animationState.newTime;
  return myPoint;
}
  // defines custom animation
  // does not use isViewportUnconstrained
  // Uses getTemporaryState but does not test
  // Uses addTemporaryPart and uses this part to do the diagram position change testing
  v1.addAnimated(new Test('Animate w/o isViewportUnconstrained', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE9', 300, 300, {
      //contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      //autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport

    });
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
    { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE9'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      var anim = new go.Animation();
      var part = alpha.copy();
      anim.addTemporaryPart(part, diagram);
      anim.add(part, "bounceDelete", part.location); // does't need an end value, bounceDelete determines one
      anim.add(part, "scale", part.scale, 0.01);
      anim.duration = 1000;
      //anim.isViewportUnconstrained = true;
      anim.finished = function(animation) {
        test.assert(diagram.position.equals(new go.Point(-5, -100)), diagram.position.toString());

        teardown('EXAMPLE9');
        test.unblock(); // Required!
      }
      test.assert(diagram.position.equals(new go.Point(-85, -100)), diagram.position.toString());
      anim.start();
    }
    setTimeout(function() { animate(); }, 15);

  }
  )); // end test

  // makes sure isViewportUnconstrained works (diagram position never changes)
  v1.addAnimated(new Test('Animate W/ isViewportUnconstrained', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE10', 300, 300, {
      //contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      //autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport

    });
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
      $(go.Node, "Spot", $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" },
    { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" } ], [ ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE10'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      var anim = new go.Animation();
      var part = alpha.copy();
      anim.addTemporaryPart(part, diagram);
      anim.add(part, "bounceDelete", part.location); // does't need an end value, bounceDelete determines one
      anim.add(part, "scale", part.scale, 0.01);
      anim.duration = 1000;
      anim.isViewportUnconstrained = true;
      anim.finished = function(animation) {
        // viewport did not move to -5, -100 because isViewportUnconstrained was set
        test.assert(diagram.position.equals(new go.Point(-85, -100)), diagram.position.toString());

        teardown('EXAMPLE10');
        test.unblock(); // Required!
      }
      test.assert(diagram.position.equals(new go.Point(-85, -100)), diagram.position.toString());
      anim.start();
    }
    setTimeout(function() { animate(); }, 50);

  }
  )); // end test








  // makes sure inital animation does not happen with triggers
  // Trigger, make sure 1 animation started
  // makes sure animation a trigger can be undone at the end of the animation
  // NOTE in 2.3 bundled animation triggers raised AnimationStarting/AnimationFinished
  // this test was adapted because in 3.0 they do not
  v1.addAnimated(new Test('Trigger undo', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE11', 300, 300, {
      //contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      //autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
      "undoManager.isEnabled": true
    });
    diagram.animationManager.isInitial = false;
    diagram.animationManager.defaultAnimation.duration = 300;
    test.doneInit = false;

    // starting animation: function(e) {
    //   if (!test.doneInit) test.assert(false, "Should never happen, no default animation occurs here");
    //   test.assert(e.subject.activeAnimations.count === 1, "Should be only one animation running");
    //   test.anim11Started = 1;
    //   var alpha = diagram.findNodeForKey('Alpha');
    //   //
    //   test.assert(alpha.position.equalsApprox(new go.Point(0, 0)), "must be at initial position within AnimationStarting, not: " + alpha.toString());
    // }

    diagram.animationManager.getBundleAnimation().finished = function(e) {
      if (!test.doneInit) test.assert(false, "Should never happen, no default animation occurs here");
      var alpha = diagram.findNodeForKey('Alpha');
      test.assert(alpha.position.equalsApprox(new go.Point(100, 100)), "must be at end position within AnimationFinished");
      test.assert(diagram.animationManager.activeAnimations.count === 0, "Should be zero animations running");
      setTimeout(function() {
        diagram.commandHandler.undo();
        test.assert(alpha.position.equalsApprox(new go.Point(0, 0)), "undo must put back to 0, 0, is at" + alpha.position.toString());

        teardown('EXAMPLE11');
        test.unblock(); // Required!
       }, 1);
    };


    diagram.nodeTemplate =
      $(go.Node, "Spot",
        new go.AnimationTrigger('location'),
      $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", location: new go.Point(0, 0), color: "lightblue" },
      { key: "Beta",  location: new go.Point(0, 100), color: "orange" },
      { key: "Gamma", location: new go.Point(100, 0), color: "lightgreen" },
      { key: "Delta", location: new go.Point(100, 100), color: "pink" }
    ], [ ]);
  }, null, function (test) {
    var diagram = window['EXAMPLE11'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      test.doneInit = true;
      test.anim11Started = 0;
      diagram.commit(function() {
        alpha.position = new go.Point(100,100);
      });

    }
    setTimeout(function() { animate(); }, 15);

  }
  )); // end test



  // makes sure animating a trigger can be undone in the middle of the animation
  // makes sure there are no running animations afterwards
  // NOTE in 2.3 bundled animation triggers raised AnimationStarting/AnimationFinished
  // this test was adapted because in 3.0 they do not
  v1.addAnimated(new Test('Trigger undo2', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE12', 300, 300, {
      //contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      //autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
      "undoManager.isEnabled": true
    });
    diagram.animationManager.isInitial = false;
    diagram.animationManager.defaultAnimation.duration = 350;
    test.doneInit = false;
    // diagram.addDiagramListener('AnimationStarting', function(e) {
    //   if (!test.doneInit) test.assert(false, "Should never happen, no default animation occurs here");
    //   test.assert(e.subject.activeAnimations.count === 1, "Should be only one animation running");
    //   test.anim11Started = 1;
    //   var alpha = diagram.findNodeForKey('Alpha');
    //   //
    //   test.assert(alpha.position.equalsApprox(new go.Point(0, 0)), "must be at origin within AnimationStarting, not: " + alpha.position.toString());
    // });
    // diagram.addDiagramListener('AnimationFinished', function(e) {
    diagram.animationManager.getBundleAnimation().finished = function(e) {
      // The undo should lead us here
      if (!test.doneInit) test.assert(false, "Should never happen, no default animation occurs here");
      var alpha = diagram.findNodeForKey('Alpha');
      test.assert(alpha.position.equalsApprox(new go.Point(100, 100)), "must be at end position within AnimationFinished: " + alpha.position.toString());
      test.assert(diagram.animationManager.activeAnimations.count === 0, "Should be zero animations running");

    };

    diagram.nodeTemplate =
      $(go.Node, "Spot",
        new go.AnimationTrigger('location'),
      $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", location: new go.Point(0, 0), color: "lightblue" },
      { key: "Beta",  location: new go.Point(0, 100), color: "orange" },
      { key: "Gamma", location: new go.Point(100, 0), color: "lightgreen" },
      { key: "Delta", location: new go.Point(100, 100), color: "pink" }
    ], [ ]);
  }, null, function (test) {
    var diagram = window['EXAMPLE12'];
    var alpha = diagram.findNodeForKey('Alpha')

    function animate() {
      test.doneInit = true;
      test.anim11Started = 0;
      diagram.commit(function() {
        alpha.position = new go.Point(100,100);
      });
      setTimeout(function() {
        diagram.animationManager.defaultAnimation.suspend();
        diagram.animationManager.defaultAnimation.advanceTo(300);
        diagram.undoManager.undo();
        diagram.undoManager.redo();

        // test.assert(alpha.position.equalsApprox(new go.Point(100, 100)), "Redo  must put back to 100, 100, is at" + alpha.position.toString());

        teardown('EXAMPLE12');
        test.unblock(); // Required!
       }, 20);

    }
    setTimeout(function() { animate(); }, 15);

  }
  )); // end test



  // Stop the Diagram fade up from happening, make sure opacity is always 1
  // Only animate scale instead
  // This ensures that the default initial does not happen, and that other initial animation happens instead
  v1.addAnimated(new Test('Custom Init Anim', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE13', 300, 300, {
      "undoManager.isEnabled": true,
      "animationManager.initialAnimationStyle": go.AnimationManager.None,
      "InitialAnimationStarting": function(e) {
          var animation = e.subject.defaultAnimation;
          animation.easing = go.Animation.EaseOutExpo;
          animation.duration = 300;
          animation.add(e.diagram, 'scale', 0.1, 2);
      }
    });



    diagram.addDiagramListener('AnimationStarting', function(e) {
      test.assert(e.subject.activeAnimations.count === 1, "Should be only one animation running");
      diagram.animationManager.defaultAnimation.suspend();
      diagram.animationManager.defaultAnimation.advanceTo(1);
      test.assert(diagram.scale < 0.5, "scale should be < 0.5 because we are animating from 0.1 to 2");
      test.assert(diagram.opacity === 1, "opacity should === 1 because we are not animating it");
      diagram.animationManager.defaultAnimation.advanceTo(1, true);
    });
    diagram.addDiagramListener('AnimationFinished', function(e) {

      var alpha = diagram.findNodeForKey('Alpha');
      test.assert(alpha.position.equalsApprox(new go.Point(0, 0)), "must be at end position within AnimationFinished");
      test.assert(e.subject.activeAnimations.count === 0, "Should be zero animations running");

      diagram.commandHandler.undo();

      teardown('EXAMPLE13');
      test.unblock(); // Required!
    });


    diagram.nodeTemplate =
      $(go.Node, "Spot",
        new go.AnimationTrigger('location'),
      $(go.Shape, "Rectangle", { width: 55, height: 30, strokeWidth: 0 },
          new go.Binding("fill", "color")), $(go.TextBlock, {  }, new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", location: new go.Point(0, 0), color: "lightblue" },
      { key: "Beta",  location: new go.Point(0, 100), color: "orange" },
      { key: "Gamma", location: new go.Point(100, 0), color: "lightgreen" },
      { key: "Delta", location: new go.Point(100, 100), color: "pink" }
    ], [ ]);
  }, null, function (test) {
    var diagram = window['EXAMPLE13'];
    var alpha = diagram.findNodeForKey('Alpha')

  }
  )); // end test




  v1.addAnimated(new Test('CanStart Prevents Default Animation', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 200;
    diagram = setup('EXAMPLE14', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
    });

    diagram.animationManager.canStart = function(reason) {
      if (reason === 'Model' || reason === "Layout") return false;
      return true;
    }

    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
        { key: 'Gamma', color: 'lightgreen' },
        { key: 'Delta', color: 'pink' }
      ],
      [
      ]);


  }, null, function (test) {
    var diagram = window['EXAMPLE14'];

    diagram.addDiagramListener('AnimationStarting', function() {
      test.assert(false, "No animation should start");
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      test.assert(false, "No animation should start or finish");
    });
    setTimeout(function() {
      teardown('EXAMPLE14');
      test.unblock(); // Required!
    }, 300);


  }
  )); // end test


  v1.addAnimated(new Test('Collapse/expand maintains real locations', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 300;
    diagram = setup('EXAMPLE15', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      "animationManager.isInitial":false,
    });


    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          { fill: "white", portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    diagram.groupTemplate =
      $(go.Group, "Auto",
        new go.Binding("isSubGraphExpanded"),
        { isSubGraphExpanded: false },
        $(go.Shape, { fill: "lightgray" }),
        $(go.Panel, "Vertical",
          $(go.Panel, "Horizontal",
            { margin: 4 },
            $("SubGraphExpanderButton"),
            $(go.TextBlock, new go.Binding("text"))
          ),
          $(go.Placeholder, { padding: 10 })
        )
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: 3, text: "Gamma", color: "lightgreen", group: 13 },
      { key: 4, text: "Delta", color: "pink", group: 15 },
      { key: 11, isGroup: true, text: "Top Level", isSubGraphExpanded: true },
      { key: 12, isGroup: true, group: 11, text: "Group 1" },
      { key: 13, isGroup: true, group: 12, text: "Member 1" },
      { key: 14, isGroup: true, group: 11, text: "Group 2", isSubGraphExpanded: true },
      { key: 15, isGroup: true, group: 14, text: "Member 2" },
    ]);

  }, null, function (test) {
    var diagram = window['EXAMPLE15'];

    // diagram.addDiagramListener('AnimationStarting', function() {
    //   test.assert(false, "No animation should start");
    // });
    var animationsDone = 0;
    diagram.addDiagramListener('AnimationFinished', function() {
      animationsDone++;
      if (animationsDone === 1) {
        setTimeout(function() { diagram.commandHandler.collapseSubGraph(tl); }, 110);
      } else if (animationsDone === 2) {
        setTimeout(function() { diagram.commandHandler.expandSubGraph(tl); }, 110);
      } else if (animationsDone === 3) {
        setTimeout(function() {
          test.assert(m2.location.isReal());
          teardown('EXAMPLE15');
          test.unblock(); // Required!
        }, 100);
      }
    });

    var tl = diagram.findNodeForKey(11);
    var g2 = diagram.findNodeForKey(14);
    var m2 = diagram.findNodeForKey(15);

    setTimeout(function() {
      diagram.commandHandler.collapseSubGraph(g2);
    }, 110);


  }
  )); // end test


  function scrollToNode(e) {
    //console.log('scroll to:')
    var node = e.diagram.findNodeForKey(20);
    if (!node) return;
    var b = node.actualBounds.copy();
    b.height = e.diagram.viewportBounds.height - 30;
    e.diagram.scrollToRect(b);
    //console.log(e.diagram.position.toString());
  }
  v1.addAnimated(new Test('Delay init change position', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    test.SIZE = 300;
    diagram = setup('EXAMPLE16', test.SIZE, test.SIZE, {
      layout:
      $(go.TreeLayout,  // use a TreeLayout to position all of the nodes
        {
          treeStyle: go.TreeLayout.StyleLastParents,
          // properties for most of the tree:
          angle: 90,
          layerSpacing: 80,
          // properties for the "last parents":
          alternateAngle: 0,
          alternateAlignment: go.TreeLayout.AlignmentStart,
          alternateNodeIndent: 15,
          alternateNodeIndentPastParent: 1,
          alternateNodeSpacing: 15,
          alternateLayerSpacing: 40,
          alternateLayerSpacingParentOverlap: 1,
          alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
          alternateChildPortSpot: go.Spot.Left
        }),
    "InitialLayoutCompleted": scrollToNode
    });

    var mt8 = new go.Margin(8, 0, 0, 0);
    var mr8 = new go.Margin(0, 8, 0, 0);
    var ml8 = new go.Margin(0, 0, 0, 8);
    var roundedRectangleParams = {
      parameter1: 2,  // set the rounded corner
      spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
    };

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle(field) {
      return [
        {
          font: "12px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
          visible: false  // only show textblocks when there is corresponding data for them
        },
        new go.Binding("visible", field, function(val) { return val !== undefined; })
      ];
    }
    // define the Node template
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          locationSpot: go.Spot.TopCenter,
          isShadowed: true, shadowBlur: 1,
          shadowOffset: new go.Point(0, 1),
          shadowColor: "rgba(0, 0, 0, .14)",
          selectionAdornmentTemplate:  // selection adornment to match shape of nodes
            $(go.Adornment, "Auto",
              $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { fill: null, stroke: "#7986cb", strokeWidth: 3 }
              ),
              $(go.Placeholder)
            )  // end Adornment
        },
        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
          { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
          // bluish if highlighted, white otherwise
          new go.Binding("fill", "isHighlighted", function(h) { return h ? "#e8eaf6" : "#ffffff"; }).ofObject()
        ),
        $(go.Panel, "Vertical",
          $(go.Panel, "Horizontal",
            { margin: 8 },
            $(go.Shape,  // flag image, only visible if a nation is specified
              { margin: mr8, desiredSize: new go.Size(50, 50) }
            ),
            $(go.Panel, "Table",
              $(go.TextBlock,
                {
                  row: 0, alignment: go.Spot.Left,
                  font: "16px Roboto, sans-serif",
                  stroke: "rgba(0, 0, 0, .87)",
                  desiredSize: new go.Size(160, 20)
                },
                new go.Binding("text", "name")
              ),
              $(go.TextBlock, textStyle("title"),
                {
                  row: 1, alignment: go.Spot.Left,
                  desiredSize: new go.Size(160, 20)
                },
                new go.Binding("text", "title")
              ),
              $("PanelExpanderButton", "INFO",
                { row: 0, column: 1, rowSpan: 2, margin: ml8 }
              )
            )
          ),
          $(go.Shape, "LineH",
            {
              stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
              height: 1, stretch: go.GraphObject.Horizontal
            },
            new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
          ),
          $(go.Panel, "Vertical",
            {
              name: "INFO",  // identify to the PanelExpanderButton
              stretch: go.GraphObject.Horizontal,  // take up whole available width
              margin: 8,
              defaultAlignment: go.Spot.Left,  // thus no need to specify alignment on each element
            }
          )
        )
      );

    // define the Link template, a simple orthogonal line
    diagram.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        { corner: 5, selectable: false },
        $(go.Shape, { strokeWidth: 3, stroke: "#424242" }));  // dark gray, rounded corner links


    // set up the nodeDataArray, describing each person/position
    var nodeDataArray = [
      { key: 0, name: "Ban Ki-moon 반기문", nation: "SouthKorea", title: "Secretary-General of the United Nations", headOf: "Secretariat" },
      { key: 1, boss: 0, name: "Patricia O'Brien", nation: "Ireland", title: "Under-Secretary-General for Legal Affairs and United Nations Legal Counsel", headOf: "Office of Legal Affairs" },
      { key: 3, boss: 1, name: "Peter Taksøe-Jensen", nation: "Denmark", title: "Assistant Secretary-General for Legal Affairs" },
      { key: 9, boss: 3, name: "Other Employees" },
      { key: 4, boss: 1, name: "Maria R. Vicien - Milburn", nation: "Argentina", title: "General Legal Division Director", headOf: "General Legal Division" },
      { key: 10, boss: 4, name: "Other Employees" },
      { key: 5, boss: 1, name: "Václav Mikulka", nation: "CzechRepublic", title: "Codification Division Director", headOf: "Codification Division" },
      { key: 11, boss: 5, name: "Other Employees" },
      { key: 6, boss: 1, name: "Sergei Tarassenko", nation: "Russia", title: "Division for Ocean Affairs and the Law of the Sea Director", headOf: "Division for Ocean Affairs and the Law of the Sea" },
      { key: 12, boss: 6, name: "Alexandre Tagore Medeiros de Albuquerque", nation: "Brazil", title: "Chairman of the Commission on the Limits of the Continental Shelf", headOf: "The Commission on the Limits of the Continental Shelf" },
      { key: 17, boss: 12, name: "Peter F. Croker", nation: "Ireland", title: "Chairman of the Committee on Confidentiality", headOf: "The Committee on Confidentiality" },
      { key: 31, boss: 17, name: "Michael Anselme Marc Rosette", nation: "Seychelles", title: "Vice Chairman of the Committee on Confidentiality" },
      { key: 32, boss: 17, name: "Kensaku Tamaki", nation: "Japan", title: "Vice Chairman of the Committee on Confidentiality" },
      { key: 33, boss: 17, name: "Osvaldo Pedro Astiz", nation: "Argentina", title: "Member of the Committee on Confidentiality" },
      { key: 34, boss: 17, name: "Yuri Borisovitch Kazmin", nation: "Russia", title: "Member of the Committee on Confidentiality" },
      { key: 18, boss: 12, name: "Philip Alexander Symonds", nation: "Australia", title: "Chairman of the Committee on provision of scientific and technical advice to coastal States", headOf: "Committee on provision of scientific and technical advice to coastal States" },
      { key: 35, boss: 18, name: "Emmanuel Kalngui", nation: "Cameroon", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
      { key: 36, boss: 18, name: "Sivaramakrishnan Rajan", nation: "India", title: "Vice Chairman of the Committee on provision of scientific and technical advice to coastal States" },
      { key: 37, boss: 18, name: "Francis L. Charles", nation: "TrinidadAndTobago", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
      { key: 38, boss: 18, name: "Mihai Silviu German", nation: "Romania", title: "Member of the Committee on provision of scientific and technical advice to costal States" },
      { key: 19, boss: 12, name: "Lawrence Folajimi Awosika", nation: "Nigeria", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
      { key: 20, boss: 12, name: "Harald Brekke", nation: "Norway", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
      { key: 21, boss: 12, name: "Yong-Ahn Park", nation: "SouthKorea", title: "Vice Chairman of the Commission on the Limits of the Continental Shelf" },
      { key: 22, boss: 12, name: "Abu Bakar Jaafar", nation: "Malaysia", title: "Chairman of the Editorial Committee", headOf: "Editorial Committee" },
      { key: 23, boss: 12, name: "Galo Carrera Hurtado", nation: "Mexico", title: "Chairman of the Training Committee", headOf: "Training Committee" },
      { key: 24, boss: 12, name: "Indurlall Fagoonee", nation: "Mauritius", title: "Member of the Commission on the Limits of the Continental Shelf" },
      { key: 25, boss: 12, name: "George Jaoshvili", nation: "Georgia", title: "Member of the Commission on the Limits of the Continental Shelf" },
      { key: 26, boss: 12, name: "Wenzhang Lu", nation: "China", title: "Member of the Commission on the Limits of the Continental Shelf" },
      { key: 27, boss: 12, name: "Isaac Owusu Orudo", nation: "Ghana", title: "Member of the Commission on the Limits of the Continental Shelf" },
      { key: 28, boss: 12, name: "Fernando Manuel Maia Pimentel", nation: "Portugal", title: "Member of the Commission on the Limits of the Continental Shelf" },
      { key: 7, boss: 1, name: "Renaud Sorieul", nation: "France", title: "International Trade Law Division Director", headOf: "International Trade Law Division" },
      { key: 13, boss: 7, name: "Other Employees" },
      { key: 8, boss: 1, name: "Annebeth Rosenboom", nation: "Netherlands", title: "Treaty Section Chief", headOf: "Treaty Section" },
      { key: 14, boss: 8, name: "Bradford Smith", nation: "UnitedStates", title: "Substantive Legal Issues Head", headOf: "Substantive Legal Issues" },
      { key: 29, boss: 14, name: "Other Employees" },
      { key: 15, boss: 8, name: "Andrei Kolomoets", nation: "Russia", title: "Technical/Legal Issues Head", headOf: "Technical/Legal Issues" },
      { key: 30, boss: 15, name: "Other Employees" },
      { key: 16, boss: 8, name: "Other Employees" },
      { key: 2, boss: 0, name: "Heads of Other Offices/Departments" }
    ];

    // create the Model with data for the tree, and assign to the Diagram
    diagram.model =
      $(go.TreeModel,
        {
          nodeDataArray: [],
          nodeParentKeyProperty: "boss"  // this property refers to the parent node data
        });

    diagram.delayInitialization(function() {

      diagram.model.commit(function(m) {
        m.mergeNodeDataArray(nodeDataArray);
      }, null);
    });

  }, null, function (test) {
    var diagram = window['EXAMPLE16'];

    diagram.addDiagramListener('AnimationFinished', function() {
      // make sure position is within 15px of where it should be:
      // for scrollbars on diff platforms etc
      test.assert((diagram.position.x - 906.82) < 15);
      test.assert((diagram.position.y - 645) < 15);
      teardown('EXAMPLE16');
      test.unblock(); // Required!
    });

  }
  )); // end test


  v1.addAnimated(new Test('AvoidsNodes during animation', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE17', 600, 600, {
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(30, 20),
      "draggingTool.isGridSnapEnabled": true,
      "resizingTool.isGridSnapEnabled": true,
      "rotatingTool.snapAngleMultiple": 90,
      "rotatingTool.snapAngleEpsilon": 45,
      "undoManager.isEnabled": true
    });
    diagram.animationManager.isInitial = false;
  diagram.nodeTemplateMap.add("Process",
    $(go.Node, "Auto",
      {
        locationSpot: new go.Spot(0.5, 0.5), locationObjectName: "SHAPE",
        resizable: true, resizeObjectName: "SHAPE"
      },
      new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Rectangle",
        {
          name: "SHAPE",
          strokeWidth: 2,
          fill: $(go.Brush, "Linear",
            {
              start: go.Spot.Left, end: go.Spot.Right,
              0: "gray", 0.5: "white", 1: "gray"
            }),
          minSize: new go.Size(50, 50),
          portId: "", fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
      $(go.TextBlock,
        {
          alignment: go.Spot.Center, textAlign: "center", margin: 5,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ));

  diagram.nodeTemplateMap.add("Valve",
    $(go.Node, "Vertical",
      {
        locationSpot: new go.Spot(0.5, 1, 0, -21), locationObjectName: "SHAPE",
        selectionObjectName: "SHAPE", rotatable: true
      },
      new go.Binding("angle").makeTwoWay(),
      new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.TextBlock,
        { alignment: go.Spot.Center, textAlign: "center", margin: 5, editable: true },
        new go.Binding("text").makeTwoWay(),
        // keep the text upright, even when the whole node has been rotated upside down
        new go.Binding("angle", "angle", function(a) { return a === 180 ? 180 : 0; }).ofObject()),
      $(go.Shape,
        {
          name: "SHAPE",
          geometryString: "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30",
          strokeWidth: 2,
          fill: $(go.Brush, "Linear", { 0: "gray", 0.35: "white", 0.7: "gray" }),
          portId: "", fromSpot: new go.Spot(1, 0.35), toSpot: new go.Spot(0, 0.35)
        })
    ));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, corner: 10, reshapable: true, toShortLength: 7 },
      new go.Binding("points").makeTwoWay(),
      // mark each Shape to get the link geometry with isPanelMain: true
      $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 7 }),
      $(go.Shape, { isPanelMain: true, stroke: "gray", strokeWidth: 5 }),
      $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [10, 10] }),
      $(go.Shape, { toArrow: "Triangle", scale: 1.3, fill: "gray", stroke: null })
    );
      diagram.model = go.Model.fromJson(
      '  { "class": "GraphLinksModel",' +
      '  "nodeDataArray": [' +
      '{"key":"P1", "category":"Process", "pos":"-30 220", "text":"Process"},' +
      '{"key":"V1", "category":"Valve", "pos":"270 120", "text":"V1"},' +
      '{"key":"P3", "category":"Process", "pos":"150 420", "text":"Pump"},' +
      '{"key":"V2", "category":"Valve", "pos":"60 160", "text":"VM", "angle":270}' +
      ' ],' +
      '  "linkDataArray": [' +
      '{"from":"P1", "to":"V1", "points":[-0,220,9,220,214,220,214,120,239,120,249,120]},' +
      '{"from":"P3", "to":"V2", "points":[150,394,150,384,150,287,60,287,60,191,60,181]}' +
      ' ]}'
      );

      // Animate the flow in the pipes
      var animation = new go.Animation();
      animation.easing = go.Animation.EaseLinear;
      diagram.links.each(function(link) {
        animation.add(link.findObject("PIPE"), "strokeDashOffset", 20, 0)
      });
      // Run indefinitely
      animation.runCount = Infinity;
      animation.start();

  }, null, function (test) {
    var diagram = window['EXAMPLE17'];

    setTimeout(function() {
      test.mouseDown(new go.Point(58, 147), { timestamp: 400 }, diagram);
      test.mouseMove(new go.Point(-28, 140), { timestamp: 600 }, diagram);
      test.mouseUp(new go.Point(-28, 140), { timestamp: 700 }, diagram);
      // 6 points in the link if there's no avoiding the node, so it should be more:
      test.assert(diagram.selection.first().linksConnected.first().points.count > 6, "Moved link should avoid the node");
      setTimeout(function() {
        teardown('EXAMPLE17');
        test.unblock(); // Required!
      }, 200);
    }, 600);


  }
  )); // end test


  v1.addAnimated(new Test('collapse/expand node keeps link route', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 300;
    diagram = setup('EXAMPLE18', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      "animationManager.isInitial":false,
    });


    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("position").makeTwoWay(),
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },
          new go.Binding("text", "key")),
          $("TreeExpanderButton")
      );

      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          { selectable: true },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Link.Orthogonal,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 })
        );

    diagram.model = go.Model.fromJSON(
      '{ "class": "GraphLinksModel",\n  "nodeDataArray": [\n{"key":"Alpha","color":"lightblue","position":{"class":"go.Point","x":0,"y":0}},\n{"key":"Beta","color":"orange","position":{"class":"go.Point","x":74.77187093580794,"y":0}},\n{"key":"Gamma","color":"lightgreen","position":{"class":"go.Point","x":0,"y":70}},\n{"key":"Delta","color":"pink","position":{"class":"go.Point","x":128.75282796705795,"y":140}}\n],\n  "linkDataArray": [{"from":"Gamma","to":"Delta","points":[67,87,77,87,200,50,197,87,197,157,118,157,128,157]}]}'
    )

  }, null, function (test) {
    var diagram = window['EXAMPLE18'];

    var gamma = diagram.findNodeForKey('Gamma')

    var animationsDone = 0;
    diagram.addDiagramListener('AnimationFinished', function() {
      animationsDone++;
      if (animationsDone === 1) {
        setTimeout(function() {  diagram.commandHandler.expandTree(gamma); }, 110);
      } else if (animationsDone === 2) {
        setTimeout(function() {
          test.assert(diagram.links.first().points.count === 7, "must have 7 points, not 6");
          teardown('EXAMPLE18');
          test.unblock(); // Required!
        }, 100);
      }
    });

    setTimeout(function() {
      setTimeout(function() { diagram.commandHandler.collapseTree(gamma); }, 110);
    }, 110);
  }
  )); // end test

  // move a node, then collapse
  // collapse should invalidate the link routes attached
  // because the node is also moving due to a re-layout
  // so expand should not restore routes saved from the collapse
  v1.addAnimated(new Test('collapse/expand node 2', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 300;
    diagram = setup('EXAMPLE18b', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      "animationManager.isInitial":false,
      layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30, arrangement: go.TreeLayout.ArrangementFixedRoots })
    });


  // Define a simple node template consisting of text followed by an expand/collapse button
  diagram.nodeTemplate =
    $(go.Node, "Horizontal",
      // { selectionChanged: nodeSelectionChanged },  // this event handler is defined below
      $(go.Panel, "Auto",
        $(go.Shape, { fill: "#1F4963", stroke: null }),
        $(go.TextBlock,
          {
            font: "bold 13px Helvetica, bold Arial, sans-serif",
            stroke: "white", margin: 3
          },
          new go.Binding("text", "key"))
      ),
      $("TreeExpanderButton")
    );

  // create the model data that will be represented by Nodes and Links
  diagram.model = new go.GraphLinksModel(
    [
      { key: 'alph', color: 'lightblue' },
      { key: 'Alpha', color: 'lightblue' },
      { key: 'Beta', color: 'orange' },
      { key: 'Gamma', color: 'lightgreen' },
      { key: 'Delta', color: 'pink' },
    ],
    [
      { from: 'alph', to: 'Alpha' },
      { from: 'Alpha', to: 'Beta' },
      { from: 'Alpha', to: 'Gamma' },
      { from: 'Alpha', to: 'Delta' }
    ]
  );

  }, null, function (test) {
    var diagram = window['EXAMPLE18b'];

    diagram.animationManager.duration = 200;
    var a = diagram.findNodeForKey('Alpha');
    a.moveTo(a.position.x + 20, a.position.y + 30);
    diagram.commandHandler.collapseTree(a);
    setTimeout(() => {
      diagram.commandHandler.expandTree(a);
      setTimeout(() => {
        test.isApprox(a.actualBounds.right, a.findLinksOutOf().first().getPoint(0).x)
        teardown('EXAMPLE18b');
        test.unblock(); // Required!
      }, 300);
    }, 300);
  }
  )); // end test

  // like prev test but one level deeper
  v1.addAnimated(new Test('collapse/expand node 3', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    test.SIZE = 300;
    diagram = setup('EXAMPLE18c', test.SIZE, test.SIZE, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      "animationManager.isInitial":false,
      layout: $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30, arrangement: go.TreeLayout.ArrangementFixedRoots })
    });


  // Define a simple node template consisting of text followed by an expand/collapse button
  diagram.nodeTemplate =
    $(go.Node, "Horizontal",
      // { selectionChanged: nodeSelectionChanged },  // this event handler is defined below
      $(go.Panel, "Auto",
        $(go.Shape, { fill: "#1F4963", stroke: null }),
        $(go.TextBlock,
          {
            font: "bold 13px Helvetica, bold Arial, sans-serif",
            stroke: "white", margin: 3
          },
          new go.Binding("text", "key"))
      ),
      $("TreeExpanderButton")
    );

  // create the model data that will be represented by Nodes and Links
  diagram.model = new go.GraphLinksModel(
    [
      { key: 'alph', color: 'lightblue' },
      { key: 'Alpha', color: 'lightblue' },
      { key: 'Beta', color: 'orange' },
      { key: 'Gamma', color: 'lightgreen' },
      { key: 'Delta', color: 'pink' },
    ],
    [
      { from: 'alph', to: 'Alpha' },
      { from: 'Alpha', to: 'Beta' },
      { from: 'Alpha', to: 'Gamma' },
      { from: 'Alpha', to: 'Delta' }
    ]
  );

  }, null, function (test) {
    var diagram = window['EXAMPLE18c'];

    diagram.animationManager.duration = 200;
    var a = diagram.findNodeForKey('Alpha');
    var aa = diagram.findNodeForKey('alph');
    a.moveTo(a.position.x + 20, a.position.y + 30);
    diagram.commandHandler.collapseTree(a);
    setTimeout(() => {
      diagram.commandHandler.collapseTree(aa);
    setTimeout(() => {
      diagram.commandHandler.expandTree(aa);
      setTimeout(() => {
        diagram.commandHandler.expandTree(a);
      setTimeout(() => {
        test.isApprox(a.actualBounds.right, a.findLinksOutOf().first().getPoint(0).x)
        teardown('EXAMPLE18c');
        test.unblock(); // Required!
      }, 300);
      }, 300);
    }, 300);
    }, 300);
  }
  )); // end test

  v1.addAnimated(new Test('moving diagram.pos keeps link route', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;


      // ===== PART ONE: custom layout =====
      class TestLayout extends go.Layout {
      constructor() {
        super();
      }
      doLayout() {
        var alpha = this.diagram.findNodeForKey("Alpha");
        var beta = this.diagram.findNodeForKey("Beta");
        if (!alpha || !beta) return;

        this.diagram.startTransaction("Test Layout");
        alpha.moveTo(100, 100);
        beta.moveTo(100, 300);
        var link = alpha.findLinksOutOf().first();
        if (link) {
          var pts = link.points.copy();
          pts.clear();
          pts.add(new go.Point(200, 125));
          pts.add(new go.Point(300, 125));
          pts.add(new go.Point(350, 155));
          pts.add(new go.Point(300, 165));
          pts.add(new go.Point(300, 195));
          pts.add(new go.Point(350, 255));
          pts.add(new go.Point(300, 325));
          pts.add(new go.Point(200, 325));
          link.points = pts;
        }
        this.diagram.commitTransaction("Test Layout");
      }
    }



      // ===== PART TWO: basic GoJS configuration =====
      test.SIZE = 300;
      diagram = setup('EXAMPLE19', 300, 800, {
        layout: $(TestLayout),
        "animationManager.isInitial":false,
      });

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, "Rectangle", { width: 100, height: 50, fill: "white" }),
          $(go.TextBlock, { margin: 5 }, new go.Binding("text", "key"))
        );

      diagram.linkTemplate =
        $(go.Link,
          { routing: go.Link.AvoidsNodes },
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      diagram.model = new go.GraphLinksModel(
        [{ key: "Alpha" }, { key: "Beta" }],
        [{ from: "Alpha", to: "Beta" }]
      );

      diagram.addDiagramListener("ChangedSelection", function(evt) {
        var selection = evt.subject.first();
        diagram.commandHandler.scrollToPart(selection);
      });



  }, null, function (test) {
    var diagram = window['EXAMPLE19'];

    var gamma = diagram.findNodeForKey('Gamma')

    var animationsDone = 0;
    diagram.addDiagramListener('AnimationFinished', function() {
      animationsDone++;
      if (animationsDone === 1) {
        test.assert(diagram.links.first().points.count === 8, "must have 8 points, not " + diagram.links.first().points.count);
        setTimeout(function() {  diagram.select(diagram.findNodeForKey('Beta')); }, 110);
      } else if (animationsDone === 2) {
        setTimeout(function() {
          // diagram.links.first().points.count === 8
          test.assert(diagram.links.first().points.count === 8, "must have 8 points, not " + diagram.links.first().points.count);
          teardown('EXAMPLE19');
          test.unblock(); // Required!
        }, 100);
      }
    });

    setTimeout(function() {
      setTimeout(function() { diagram.select(diagram.findNodeForKey('Alpha')); }, 110);
    }, 110);
  }
  )); // end test

  // based on extras/animatedMarqueeFocus
  v1.addAnimated(new Test('Concentric custom', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE20', 400, 400, {
      "animationManager.isInitial": false,
      "undoManager.isEnabled": true
    });

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          { fill: "white", portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay()),
        {
          selectionAdornmentTemplate:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 4, strokeDashArray: [8, 4] }),
              $(go.Placeholder, { margin: 2 })
            )
        }
      );

    var model = new go.GraphLinksModel();
    for (var i = 0; i < 25; i++) {
      model.addNodeData({ text: "Alpha", color: "lightblue" });
      model.addNodeData({ text: "Beta", color: "orange" });
      model.addNodeData({ text: "Gamma", color: "lightgreen" });
      model.addNodeData({ text: "Delta", color: "pink" });
    }
    diagram.model = model;

  }, null, function (test) {
    var diagram = window['EXAMPLE20'];

    diagram.addDiagramListener('AnimationStarting', function() {
      console.log('starting');
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      test.assert(focus1.location.equalsApprox(focus2.location))
      test.assert(focus1.location.equalsApprox(focus3.location))
      console.log('done');
      teardown('EXAMPLE20');
      test.unblock(); // Required!
    });

    diagram.select(diagram.findNodeForKey(-65));
    var part = diagram.selection.first();
    if (!part) return;
    diagram.redraw();

    var partdiam = Math.max(part.actualBounds.width, part.actualBounds.height) * 1.1;
    var viewdiam = Math.max(diagram.viewportBounds.width, diagram.viewportBounds.height);

    var $ = go.GraphObject.make;
    var focus1 =
      $(go.Part, "Auto",
        {
          layerName: "Tool",
          isInDocumentBounds: false,
          locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          location: part.actualBounds.center
        },
        $(go.Shape, "Circle",
          {
            name: "SHAPE",
            fill: null, stroke: "yellow",
            width: viewdiam, height: viewdiam
          })
      );
    var focus2 = focus1.copy();
    var focus3 = focus1.copy();

    var anim = new go.Animation();

    var shape1 = focus1.findObject("SHAPE");
    anim.addTemporaryPart(focus1, diagram);
    anim.add(shape1, "width", viewdiam, partdiam);
    anim.add(shape1, "height", viewdiam, partdiam);
    anim.add(shape1, "strokeWidth", 20/diagram.scale, 1);

    var shape2 = focus2.findObject("SHAPE");
    anim.addTemporaryPart(focus2, diagram);
    anim.add(shape2, "width", viewdiam*2/3, partdiam);
    anim.add(shape2, "height", viewdiam*2/3, partdiam);
    anim.add(shape2, "strokeWidth", 20/diagram.scale, 1);

    var shape3 = focus3.findObject("SHAPE");
    anim.addTemporaryPart(focus3, diagram);
    anim.add(shape3, "width", viewdiam/3, partdiam);
    anim.add(shape3, "height", viewdiam/3, partdiam);
    anim.add(shape3, "strokeWidth", 20/diagram.scale, 1);

    anim.duration = 700;
    anim.start();

    diagram.commandHandler.scrollToPart(part);

  }
  )); // end test



  // Regression test for a case where it was possible that
  // AvoidsNodes routing was not being done because the (finaly) model load was delayed
  // And the second initial animation did some work while the previous one was still ticking
  v1.addAnimated(new Test('link route on load', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    let hasLoaded = false;
    test.SIZE = 600;
    diagram = setup('EXAMPLE21', test.SIZE, test.SIZE, {
      scale: 0.8,
      // "animationManager.isEnabled":false,
      layout:
        $(go.LayeredDigraphLayout,
          {
            layerSpacing: 50,
            columnSpacing: 10,
            setsPortSpots: false
          }),
      "AnimationStarting": function(a) {
        // console.log('start');
      },
      "AnimationFinished": function(a) {
        // console.log('done')
        if (!hasLoaded) {
          hasLoaded = true;
          load();
        } else {
          // 6 means link avoidsNodes routing failed to occur
          // 7 means it succeeded
          test.assert(mylink.points.count === 7);
          teardown('EXAMPLE21');
          test.unblock(); // Required!
        }
      }
    });


    diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 30, height: 60 },
      $(go.Shape,
        { fill: "yellow" }),
      $(go.TextBlock,
        { margin: 8 },
        new go.Binding("text", "key"))
    );

  diagram.linkTemplate =
    $(go.Link,
      {
        routing: go.Link.AvoidsNodes, //go.Link.Orthogonal
        curve: go.Link.JumpOver
      },
      $(go.Shape,
        { isPanelMain: true, strokeWidth: 2 },
        new go.Binding("stroke", "stroke"),
        new go.Binding("strokeWidth", "strokeWidth"),
        new go.Binding("strokeDashArray", "strokeDashArray"),
        new go.Binding("stroke", "isHighlighted", function (h) { return h ? "red" : "grey" })
          .ofObject()
        // the Shape.strokeWidth depends on whether Link.isHighlighted is true
      ),
      $(go.Shape, { toArrow: "Standard" }, new go.Binding("stroke", "stroke"),
        new go.Binding("fill", "stroke"),
        { height: 40 }),
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
      new go.Binding("toSpot", "toSpot", go.Spot.parse)
    );

    function load() {
      diagram.model = go.Model.fromJson(
  `{ "class": "GraphLinksModel",
    "nodeDataArray": [
  {"class":"IT System","is_validated":"false","key":"2"},
  {"class":"IT System","is_validated":"false","key":"3"},
  {"class":"IT System","is_validated":"true","key":"4"},
  {"class":"IT System","is_validated":"false","key":"5"},
  {"class":"IT System","is_validated":"false","key":"6"},
  {"class":"IT System","is_validated":"true","key":"7"},
  {"class":"IT System","is_validated":"false","key":"8"},
  {"class":"IT System","is_validated":"false","key":"9"},
  {"class":"IT System","is_validated":"true","key":"10"},
  {"class":"IT System","is_validated":"false","key":"11"},
  {"class":"IT System","is_validated":"true","key":"12"},
  {"class":"IT System","is_validated":"true","key":"13"},
  {"class":"IT System","is_validated":"true","key":"14"},
  {"class":"IT System","is_validated":"false","key":"15"},
  {"class":"IT System","is_validated":"true","key":"16"},
  {"class":"IT System","is_validated":"false","key":"17"},
  {"class":"IT System","is_validated":"true","key":"18"},
  {"class":"IT System","is_validated":"false","key":"19"},
  {"class":"IT System","is_validated":"false","key":"20"},
  {"class":"IT System","is_validated":"false","key":"21"},
  {"class":"IT System","is_validated":"false","key":"22"},
  {"class":"IT System","is_validated":"true","key":"PROBLEM"},
  {"class":"IT System","is_validated":"true","key":"23"},
  {"class":"IT System","is_validated":"false","key":"24"}
  ],
    "linkDataArray": [
  {"from":"12","to":"7","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"9","to":"10","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"18","to":"9","fromSpot":"TopCenter","toSpot":"Left"},
  {"key":1, "from":"9","to":"PROBLEM","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"18","to":"10","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"12","to":"18","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"12","to":"21","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"18","to":"PROBLEM","fromSpot":"TopCenter","toSpot":"Left"},
  {"from":"16","to":"APECS","fromSpot":"Right","toSpot":"Left"},
  {"from":"APECS","to":"21","fromSpot":"Right","toSpot":"Left"},
  {"from":"18","to":"2","toArrow":"Standard","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"Project Identifier","to":"AWARD","toArrow":"Standard","fromSpot":"Right","toSpot":"Left"},
  {"from":"AWARD","to":"Salesforce BD","toArrow":"Standard","fromSpot":"Right","toSpot":"Left"},
  {"from":"9","to":"3","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"4","to":"21","fromSpot":"Right","toSpot":"Left"},
  {"from":"5","to":"22","fromSpot":"Right","toSpot":"Left"},
  {"from":"18","to":"6","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"21","to":"6","fromSpot":"Right","toSpot":"Left"},
  {"from":"7","to":"18","fromSpot":"Right","toSpot":"Left"},
  {"from":"18","to":"8","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"9","to":"19","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"20","to":"9","fromSpot":"Right","toSpot":"Left"},
  {"from":"21","to":"9","fromSpot":"Right","toSpot":"Left"},
  {"from":"9","to":"Resource Management System (RMS)","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"11","to":"10","fromSpot":"Right","toSpot":"Left"},
  {"from":"12","to":"10","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"21","to":"11","fromSpot":"Right","toSpot":"Left"},
  {"from":"12","to":"13","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"12","to":"Internal OMR","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"20","to":"12","fromSpot":"Right","toSpot":"Left"},
  {"from":"12","to":"PROBLEM","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"23","to":"13","fromSpot":"Right","toSpot":"Left"},
  {"from":"18","to":"14","fromSpot":"BottomCenter","toSpot":"Left"},
  {"from":"21","to":"14","fromSpot":"Right","toSpot":"Left"},
  {"from":"15","to":"21","fromSpot":"Right","toSpot":"Left"},
  {"from":"17","to":"21","fromSpot":"Right","toSpot":"Left"}
  ]}
  `);
    window.mynode = diagram.findNodeForKey('PROBLEM');
    window.mylink = mynode.findLinksInto().first();
    }

  }, null, function (test) {
    // var diagram = window['EXAMPLE21'];

  }
  )); // end test







  // Regression test for a case where it was possible that
  // AvoidsNodes routing was not being done because the (finaly) model load was delayed
  // And the second initial animation did some work while the previous one was still ticking
  v1.addAnimated(new Test('chained animations', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    let hasLoaded = false;
    test.SIZE = 600;
    diagram = setup('EXAMPLE22', test.SIZE, test.SIZE, { });
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
    $(go.Node, "Table",
      { locationSpot: go.Spot.Center, width: 100, height: 150 },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Panel, "Auto",
        { name: "FRONT", width: 100, height: 150 },
        $(go.Shape, { fill: "green", strokeWidth: 0 }),
        $(go.TextBlock, { stroke: "white", maxLines: 1 },
          new go.Binding("text"))
      ),
      $(go.Panel, "Auto",
        { name: "BACK", width: 0, height: 150 },
        $(go.Shape, { fill: "blue", strokeWidth: 0 }),
        $(go.TextBlock, { stroke: "white", maxLines: 1 },
          new go.Binding("text", "text2"))
      )
    );

    diagram.model = new go.GraphLinksModel(
      [ { text2: "text 2", text: "text 1", selectedColor: 'red' } ], [ ]);




  }, null, function (test) {
    var diagram = window['EXAMPLE22'];
    var node = diagram.nodes.first();
    const f = node.findObject("FRONT");
    const b = node.findObject("BACK")
    const an = new go.Animation();
    an.duration = 200;
    const toback = f.width > 0;
    if (toback) {
      an.add(f, "width", f.width, 0);
    } else {
      an.add(b, "width", b.width, 0);
    }
    an.finished = function(an) {
      const an2 = new go.Animation();
      an2.duration = 200;
      an2.finished = function() {
        teardown('EXAMPLE22');
        test.unblock(); // Required!
      }
      if (toback) {
        an2.add(b, "width", b.width, 100);
      } else {
        an2.add(f, "width", f.width, 100);
      }
      an2.start();
    };
    an.start();

  }
  )); // end test


  // ensure the positions of groups are consistent
  v1.addAnimated(new Test('expand collapse pos', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE23', 400, 400, {
      contentAlignment: go.Spot.Center,
      "animationManager.isInitial":false,
      layout: new go.GridLayout(
        { wrappingWidth: Infinity, alignment: go.GridLayout.Position, cellSize: new go.Size(1, 1) })
    });
    diagram.animationManager.isEnabled =true;
    diagram.animationManager.duration =300;

function makeLayout(horiz) {  // a Binding conversion function
  if (horiz) {
    return new go.GridLayout(
      {
        wrappingWidth: Infinity, alignment: go.GridLayout.Position,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
      });
  } else {
    return new go.GridLayout(
      {
        wrappingColumn: 1, alignment: go.GridLayout.Position,
        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
      });
  }
}

function defaultColor(horiz) {  // a Binding conversion function
  return horiz ? "rgba(255, 221, 51, 0.55)" : "rgba(51,211,229, 0.5)";
}

function defaultFont(horiz) {  // a Binding conversion function
  return horiz ? "bold 20px sans-serif" : "bold 16px sans-serif";
}

// this function is used to highlight a Group that the selection may be dropped into
function highlightGroup(e, grp, show) {
  if (!grp) return;
  e.handled = true;
  if (show) {
    // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
    // instead depend on the DraggingTool.draggedParts or .copiedParts
    var tool = grp.diagram.toolManager.draggingTool;
    var map = tool.draggedParts || tool.copiedParts;  // this is a Map
    // now we can check to see if the Group will accept membership of the dragged Parts
    if (grp.canAddMembers(map.toKeySet())) {
      grp.isHighlighted = true;
      return;
    }
  }
  grp.isHighlighted = false;
}

diagram.groupTemplate =
  new go.Group("Auto",
    {
      background: "blue",
      ungroupable: true,
      // highlight when dragging into the Group
      mouseDragEnter: (e, grp, prev) => highlightGroup(e, grp, true),
      mouseDragLeave: (e, grp, next) => highlightGroup(e, grp, false),
      computesBoundsAfterDrag: true,
      computesBoundsIncludingLocation: true,
      handlesDragDropForMembers: true,
      layout: makeLayout(false)
    })
    .bind("layout", "horiz", makeLayout)
    .bind(new go.Binding("background", "isHighlighted", h => h ? "rgba(255,0,0,0.2)" : "transparent").ofObject())
    .add(new go.Shape("Rectangle",
      { fill: null, stroke: defaultColor(false), fill: defaultColor(false), strokeWidth: 2 })
      .bind("stroke", "horiz", defaultColor)
      .bind("fill", "horiz", defaultColor))
    .add(
      new go.Panel("Vertical")  // title above Placeholder
        .add(new go.Panel("Horizontal",  // button next to TextBlock
          { stretch: go.GraphObject.Horizontal, background: defaultColor(false) })
          .bind("background", "horiz", defaultColor)
          .add(go.GraphObject.make("SubGraphExpanderButton", { alignment: go.Spot.Right, margin: 5 }))
          .add(new go.TextBlock(
            {
              alignment: go.Spot.Left,
              editable: true,
              margin: 5,
              font: defaultFont(false),
              opacity: 0.95,  // allow some color to show through
              stroke: "#404040"
            })
            .bind("font", "horiz", defaultFont)
            .bind("text", "text", null, null)) // `null` as the fourth argument makes this a two-way binding
        )  // end Horizontal Panel
        .add(new go.Placeholder({ padding: 5, alignment: go.Spot.TopLeft }))
    )  // end Vertical Panel


diagram.nodeTemplate =
  new go.Node("Auto")
    .add(new go.Shape("RoundedRectangle", { fill: "rgba(172, 230, 0, 0.9)", stroke: "white", strokeWidth: 0.5 }))
    .add(new go.TextBlock(
      {
        witdth: 130, height:10,
        margin: 7,
        editable: true,
        font: "bold 13px sans-serif",
        opacity: 0.90
      })
      .bind("text", "text", null, null));  // `null` as the fourth argument makes this a two-way binding


diagram.model = go.Model.fromJson(`{ "class": "go.GraphLinksModel",
"nodeDataArray": [

{"key":2, "isGroup":true, "text":"Main 2", "horiz":true},

{"key":5, "isGroup":true, "text":"Group C", "group":2},
{"key":6, "isGroup":true, "text":"Group D", "group":2},
{"key":7, "isGroup":true, "text":"Group E", "group":6},

{"text":"first C", "group":5, "key":-12},
{"text":"second C", "group":5, "key":-13},
{"text":"first D", "group":6, "key":-14},
{"text":"first E", "group":7, "key":-15}
],
"linkDataArray": [  ]}`)


  }, null, function (test) {
    var diagram = window['EXAMPLE23'];
    const D = diagram.findNodeForKey(6);
    const main = diagram.findNodeForKey(2);
    setTimeout(() => {
      diagram.commandHandler.collapseSubGraph(D);
    }, 300);
    let animationsCompleted = 0;

    diagram.addDiagramListener('AnimationStarting', function() {
      console.log('starting');
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      animationsCompleted++;
      if (animationsCompleted === 1) diagram.commandHandler.expandSubGraph(D);
      if (animationsCompleted === 2) {
        test.assert(D.actualBounds.height < 150, "group D should be less than 150 high")
        diagram.commandHandler.collapseSubGraph(main);
      }
      if (animationsCompleted === 3) { diagram.commandHandler.expandSubGraph(main); }
      if (animationsCompleted === 4) {
        test.assert(main.actualBounds.height < 190, "main group should be less than 190 high")
        test.assert(D.actualBounds.height < 150, "group D should be less than 150 high")
        // console.log('done');
        teardown('EXAMPLE23');
        test.unblock(); // Required!
      }
    });
  }
  )); // end test

  // Nodes during a collapse animation should remain visible
  v1.addAnimated(new Test('Remain viz', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();
    test.SIZE = 200;

    diagram.animationManager.isInitial = false;
    diagram.animationManager.isEnabled = true;
    diagram.animationManager.defaultAnimation.duration = 200;

    diagram.nodeTemplate = new go.Node('Vertical')
      .add(
        new go.Shape('RoundedRectangle', {
          strokeWidth: 0,
          fill: 'white',
          width: 50,
          height: 50,
        }).bind('fill', 'color'),
        $("TreeExpanderButton"),
        new go.TextBlock({ margin: 8, font: 'bold 14px sans-serif', stroke: '#333' }).bind(
          'text',
          'key'
        )
      );


    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
      ],
      [
        { from: 'Alpha', to: 'Beta' }
      ]
    );
    diagram.addDiagramListener('AnimationStarting', function () {
      diagram.animationManager.defaultAnimation.suspend();
      diagram.animationManager.defaultAnimation.advanceTo(50);
      const b = diagram.findNodeForKey('Beta');
      test.assert(b.isVisible() === true, "should remain visible during the animation");
      diagram.animationManager.defaultAnimation.advanceTo(50, true);
    });
    diagram.addDiagramListener('AnimationFinished', function () {
      const b = diagram.findNodeForKey('Beta');
      test.assert(b.isVisible() === false, "should be invisible post animation");
      test.unblock(); // Required!
    });
  }, null, function (test) {
    const diagram = test.diagram;
    diagram.startTransaction();
    diagram.commitTransaction();
    const a = diagram.findNodeForKey('Alpha');
    diagram.commandHandler.collapseTree(a);
  }
  )); // end test


})(); // end test system


/*
  v1.addAnimated(new Test('ExampleSetupTeardown', null,
  function (test) {
    test.name = newTestName();
    var diagram = test.diagram;
    diagram.reset();

    diagram = setup('EXAMPLE1', 400, 400, {
      contentAlignment: go.Spot.Center,  // content is always centered in the viewport
      autoScale: go.Diagram.Uniform  // scale always has all content fitting in the viewport
    });
    diagram.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;

  }, null, function (test) {
    var diagram = window['EXAMPLE1'];

    diagram.addDiagramListener('AnimationStarting', function() {
      // console.log('starting');
      diagram.animationManager.defaultAnimation.suspend();
      diagram.animationManager.defaultAnimation.advanceTo(1);
      test.assert(diagram.scale === 1);
      diagram.animationManager.defaultAnimation.advanceTo(590);
      test.assert(diagram.scale < 0.6 && diagram.scale > 0.5);
      diagram.animationManager.defaultAnimation.advanceTo(2, true);
    });
    diagram.addDiagramListener('AnimationFinished', function() {
      // console.log('done');
      test.assert(diagram.scale < 0.6 && diagram.scale > 0.5);
      teardown('EXAMPLE1');
      test.unblock(); // Required!
    });

  }
  )); // end test

  */





  /*
  v1.addAnimated(new Test('A2', null,
  function (test) {
      test.name = newTestName();
      var diagram = test.diagram;

      diagram.layout = new go.TreeLayout();
      diagram.nodeTemplate = $(go.Node, "Spot",
        $(go.TextBlock, { width: 40, height: 15 },
          new go.Binding('text', 'key'))
      )

      diagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', color: 'orange' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' }
        ],
        [
        ]);
        diagram.startTransaction();
        diagram.commitTransaction();
        diagram.nodes.first().position = new go.Point(0,1);
  },
  null,
  function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        // test.assert('starting');

      });
      diagram.addDiagramListener('AnimationFinished', function() {
        // test.assert('done');

        test.unblock(); // Required!
      });

  }
  )); // end test

  */

