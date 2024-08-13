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

  var diagramInitial = new TestCollection('initial states');
  TestRoot.add(diagramInitial);



  //function for diagram 1
  function tall(diagram) {

    var width = 100;
    var height = 200;

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Shape, "Ellipse", { fill: "white" }),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5 },
          $(go.Shape));

    var nodeDataArray = [
      { key: "Alpha", loc: width*0.25+" "+height*0.25},
      { key: "Beta", loc: width*0.3+" "+height*0.4 },
      { key: "Gamma", loc: width*0.4+" "+height*1000 }
    ];

    var linkDataArray = [
      { from: "Alpha", to: "Beta" },
      { from: "Beta", to: "Gamma" },
      { from: "Alpha", to: "Gamma" }
    ];

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  }

  //function for diagram 2
  function wide(diagram) {

    var width = 200;
    var height = 100;

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse),
        $(go.Shape, "Ellipse", { fill: "white" }),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5 },
          $(go.Shape));

    var nodeDataArray = [
      { key: "Alpha", loc: width*0.2+" "+height*0.25},
      { key: "Beta", loc: width*0.5+" "+height*0.25 },
      { key: "Gamma", loc: width*1000+" "+height*0.35 }
    ];

    var linkDataArray = [
      { from: "Alpha", to: "Beta" },
      { from: "Beta", to: "Gamma" },
      { from: "Alpha", to: "Gamma" }
    ];

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  }

  //function for diagram 3
  function horizontal(diagram) {
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Ellipse", { fill: "white" }),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5 },
          $(go.Shape));

    var nodeDataArray = [
      { key: "Alpha"},
      { key: "Beta", parent: "Alpha" },
      { key: "Gamma", parent: "Beta" },
      { key: "Epsilon", parent: "Alpha" },
      { key: "Delta", parent: "Beta" },
      { key: "Zeta", parent: "Epsilon" },
      { key: "Eta", parent: "Epsilon" },
      { key: "Theta", parent: "Epsilon" }

    ];

    diagram.model = new go.TreeModel(nodeDataArray);
    diagram.layout = $(go.TreeLayout);

  }

  function vertical(diagram) {
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Ellipse", { fill: "white" }),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.AvoidsNodes, corner: 5 },
          $(go.Shape));

    var nodeDataArray = [
      { key: "Alpha"},
      { key: "Beta", parent: "Alpha" },
      { key: "Gamma", parent: "Beta" },
      { key: "Epsilon", parent: "Alpha" },
      { key: "Delta", parent: "Beta" },
      { key: "Zeta", parent: "Epsilon" },
      { key: "Eta", parent: "Epsilon" },
      { key: "Theta", parent: "Epsilon" }

    ];

    diagram.model = new go.TreeModel(nodeDataArray);
    diagram.layout = $(go.TreeLayout, {angle: 90});

  }

  //tests initialScale, initialDocumentSpot and initialViewportSpot, taller than viewport
  diagramInitial.add(new Test('Tall: longer than viewport', null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      diagram.reset();
      //diagram.initialPosition = new go.Point(width*0.2, height*0.23);
      diagram.initialScale = 3.2;
      diagram.initialDocumentSpot = go.Spot.TopCenter;
      diagram.initialViewportSpot = go.Spot.TopCenter;

      //calling function for diagram 1
      tall(diagram);

    }, // END SETUP
    null,
    function (test) {
      //var width = 100;
      //var height = 200;
      var diagram = test.diagram;
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.TopCenter),
        'Diagram Spot should be top center, but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.TopCenter),
        'Viewport Spot should be top center, but is '+diagram.initialViewportSpot);
      //test.assert(diagram.position.equals(
        //new go.Point(width*0.2, height*0.23)),
        //'Initial position is wrong, should be ('+width*0.2+', '+height*0.23+') but value is '+diagram.position);
      test.assert(diagram.scale === 3.2,
        'Diagram Scale is incorrect, should be 3.2 but value is '+diagram.scale);


  })); // end test

  //tests initialPosition and initialScale on infiniteScroll
  diagramInitial.add(new Test('Tall: Infinite scrollMode', null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      diagram.reset();
      diagram.scrollMode = go.Diagram.InfiniteScroll;
      diagram.initialPosition = new go.Point(-55, -55);
      diagram.initialScale = 2.2;
      tall(diagram);

    }, // END SETUP
    null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-55, -55)),
        'Initial position is wrong, should be (-55, -55) but value is '+diagram.position);
      test.assert(diagram.scale === 2.2,
        'Diagram Scale is incorrect, should be 2.2 but value is '+diagram.scale);


  })); // end test

  //tests initialPosition and autoScale
  diagramInitial.add(new Test('Tall: autoScale1', null,
    function (test) {

      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      diagram.reset();
      diagram.initialPosition = new go.Point(-width*0.1, -height*0.1);
      diagram.autoScale = go.Diagram.UniformToFill;
      //diagram.scale = 1.2;
      vertical(diagram);
    }, // END SETUP
    null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-width*0.1, -height*0.1)),
        'Initial position is wrong, should be ( -'+width*0.1+', -'+height*0.1+') but value is '+diagram.position);
      //test.assert(diagram.scale === 1.2,
        //'Diagram Scale is incorrect, should be 1.2 but value is '+diagram.scale);
      test.assert(diagram.autoScale === go.Diagram.UniformToFill,
        'Auto Scale should be uniform to fill but is '+diagram.autoScale);


  })); // end test

  //tests initialDocumentSpot, initialViewportSpot and autoScale
  diagramInitial.add(new Test('Tall: autoscale2', null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      diagram.reset();
      diagram.scrollMode = go.Diagram.InfiniteScroll;
      diagram.initialDocumentSpot = go.Spot.TopRight;
      diagram.initialViewportSpot = go.Spot.TopRight;
      diagram.autoScale = go.Diagram.Uniform;
      tall(diagram);

    }, // END SETUP
    null,
    function (test) {
      var width = 100;
      var height = 200;
      var diagram = test.diagram;
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.TopRight),
        'Initial DocumentSpot should be top right but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.TopRight),
        'Initial ViewportSpot should be top right but is '+diagram.initialViewportSpot);
      test.assert(diagram.autoScale === go.Diagram.Uniform,
        'Autoscale should be uniform but is '+diagram.autoScale);

  }));

  //tests initialPosition and initialScale, wider than viewport
  diagramInitial.add(new Test('Wide: wider than viewport', null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;
      diagram.reset();
      diagram.initialPosition = new go.Point(width*0.175, height*0.2);
      diagram.initialScale = 3.2;

      //calling function for diagram 2
      wide(diagram);

    }, // END SETUP
    null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(width*0.175, height*0.2)),
        'Initial position is wrong, should be ('+width*0.175+', '+height*0.2+') but value is '+diagram.position);
      test.assert(diagram.scale === 3.2,
        'Diagram Scale is incorrect, should be 3.2 but value is '+diagram.scale);


  })); // end test

  //tests initialDocumentSpot, initialViewportSpot and initialScale on infiniteScroll
  diagramInitial.add(new Test('Wide: Infinite scrollMode', null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;

      diagram.reset();

      diagram.scrollMode = go.Diagram.InfiniteScroll;
      //diagram.initialPosition = new go.Point(width*0.5, height*0.2);
      diagram.initialScale = 2.2;
      diagram.initialDocumentSpot = go.Spot.BottomRight;
      diagram.initialViewportSpot = go.Spot.BottomRight;
      wide(diagram);

    }, // END SETUP
    null,
    function (test) {
      //var width = 200;
      //var height = 100;
      var diagram = test.diagram;

      test.assert(diagram.initialDocumentSpot.equals(go.Spot.BottomRight),
        'Diagram Spot should be bottom right, but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.BottomRight),
        'Viewport Spot should be bottom right, but is '+diagram.initialViewportSpot);
      //test.assert(diagram.position.equals(new go.Point(width*0.5, height*0.2)),
        //'Initial position is wrong, should be ('+width*0.5+', '+height*0.2+') but value is '+diagram.position);
      test.assert(diagram.scale === 2.2,
        'Diagram Scale is incorrect, should be 2.2 but value is '+diagram.scale);


  })); // end test

  //tests initialPosition and initialScale
  diagramInitial.add(new Test('Wide: Small', null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;

      diagram.reset();

      diagram.initialPosition = new go.Point(-width*0.15, -height*0.2);
      diagram.initialScale = 0.5;

      horizontal(diagram);

    }, // END SETUP
    null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-width*0.15, -height*0.2)),
        'Initial position is wrong, should be ( -'+width*0.15+', -'+height*0.2+') but value is '+diagram.position);
      test.assert(diagram.scale === 0.5,
        'Diagram Scale is incorrect, should be 0.5 but value is '+diagram.scale);


  })); //end test

  //tests initial DiagramSpot, initialViewportSpot, initialPosition and autoScale on infinite scroll
  diagramInitial.add(new Test('Wide: autoscale', null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;
      diagram.reset();
      diagram.initialPosition = new go.Point(width*0.2, height*0.3);
      diagram.autoScale = go.Diagram.UniformToFill;
      diagram.initialDocumentSpot = go.Spot.BottomCenter;
      diagram.initialViewportSpot = go.Spot.BottomCenter;
      diagram.scrollMode = go.Diagram.InfiniteScroll;

      //calling function for diagram 2
      wide(diagram);

    }, // END SETUP
    null,
    function (test) {
      var width = 200;
      var height = 100;
      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(width*0.2, height*0.3)),
        'Initial position is wrong, should be ('+width*0.2+', '+height*0.3+') but value is '+diagram.position);
      test.assert(diagram.autoScale === go.Diagram.UniformToFill,
        'AutoScale should be uniform to fill but value is '+diagram.autoScale);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.BottomCenter),
        'Initial Viewport Spot should be bottom center but is '+diagram.initialViewportSpot);
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.BottomCenter),
        'Initial DocumentSpot should be bottom center but is '+diagram.initialDocumentSpot);


  })); // end test

  // tests initialPosition and initialScale which are larger than viewport in both directions
  diagramInitial.add(new Test('Horizontal Tree: Large', null,
    function (test) {
      var diagram = test.diagram;
      var width = 200;
      var height = 100;
      diagram.reset();
      diagram.initialPosition = new go.Point(-5, -5);
      diagram.initialScale = 10.3;

      //calling function for diagram 1
      horizontal(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      var width = 200;
      var height = 100;
      test.assert(diagram.position.equalsApprox(new go.Point(-5, -5)),
        'Initial position is wrong, should be (-5, -5) but value is '+diagram.position);
      test.assert(diagram.scale === 10.3,
        'Diagram Scale is incorrect, should be 10.3 but value is '+diagram.scale);


  })); // end test

  //tests initialPosition, initialAutoScale and initialScale
  diagramInitial.add(new Test('Infinite scrollMode+Uniform autoScale', null,
    function (test) {
      var diagram = test.diagram;
      var width = 200;
      var height = 100;
      diagram.reset();
      diagram.scrollMode = go.Diagram.InfiniteScroll;
      diagram.initialPosition = new go.Point(-100, -55);
      diagram.initialAutoScale = go.Diagram.Uniform;
      diagram.initialScale = 3.1;
      horizontal(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-100, -55)),
        'Initial position is wrong, should be (-100, -55) but value is '+diagram.position);
      test.assert(diagram.scale !== 3.1,
        'Diagram Scale is incorrect, should not be 3.1 but is '+diagram.scale);
      test.assert(diagram.initialAutoScale === go.Diagram.Uniform,
        'Auto scale should be uniform, but is '+diagram.initialAutoScale);


  })); // end test

  //tests initialDocumentSpot, initialViewportSpot, initialPosition and initialAutoScale
  diagramInitial.add(new Test('Horizontal Tree', null,
    function (test) {

      var diagram = test.diagram;
      var width = 200;
      var height = 100;
      diagram.reset();
      diagram.initialPosition = new go.Point(-100, -49);
      //diagram.initialScale = 0.5;
      diagram.initialDocumentSpot = go.Spot.Left;
      diagram.initialViewportSpot = go.Spot.Left;
      diagram.initialAutoScale = go.Diagram.UniformToFill;

      horizontal(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      //initialPosition overrides initialDocumentSpot and initialViewportSpot
      //visually looks wrong but those qualities are still what we have assigned them
      //no errors expected
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.Left),
        'The initialDocumentSpot should be left but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.Left),
        'The initialViewportSpot should be left but is '+diagram.initialViewportSpot);
      test.assert(diagram.position.equalsApprox(new go.Point(-100, -49)),
        'Initial position is wrong, should be (-100, -49) but value is '+diagram.position);
      //test.assert(diagram.scale === 0.5,
        //'Diagram Scale is incorrect, should be 0.5 but value is '+diagram.scale);
      test.assert(diagram.initialAutoScale === go.Diagram.UniformToFill,
        'Initial auto scale should be uniform to fill but is '+diagram.initialAutoScale);


  })); // end test

  //tests initialDocumentSpot, initialViewportSpot, initialPosition and initialAutoScale
  diagramInitial.add(new Test('Horizontal Tree: autoscale', null,
    function (test) {

      var diagram = test.diagram;
      var width = 200;
      var height = 100;
      diagram.reset();
      diagram.initialPosition = new go.Point(-100, -49);
      //diagram.initialScale = 0.5;
      diagram.initialDocumentSpot = go.Spot.Left;
      diagram.initialViewportSpot = go.Spot.Left;
      diagram.initialAutoScale = go.Diagram.UniformToFill;
      diagram.scrollMode = go.Diagram.InfiniteScroll;

      horizontal(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      //initialPosition overrides initialDocumentSpot and initialViewportSpot
      //visually looks wrong but those qualities are still what we have assigned them
      //no errors expected
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.Left),
        'The initialDocumentSpot should be left but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.Left),
        'The initialViewportSpot should be left but is '+diagram.initialViewportSpot);
      test.assert(diagram.position.equalsApprox(new go.Point(-100, -49)),
        'Initial position is wrong, should be (-100, -49) but value is '+diagram.position);
      //test.assert(diagram.scale === 0.5,
        //'Diagram Scale is incorrect, should be 0.5 but value is '+diagram.scale);
      test.assert(diagram.initialAutoScale === go.Diagram.UniformToFill,
        'Initial auto scale should be uniform to fill but is '+diagram.initialAutoScale);


  })); // end test

  //tests initialPosition and initialScale
  diagramInitial.add(new Test('Vertical Tree', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.initialPosition = new go.Point(-10, -15);
      diagram.initialScale = 1.1;

      //calling function for diagram 1
      vertical(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-10, -15)),
        'Initial position is wrong, should be (-10, -15) but value is '+diagram.position);
      test.assert(diagram.scale === 1.1,
        'Diagram Scale is incorrect, should be 1.1 but value is '+diagram.scale);


  })); // end test

  //Tests initialPosition and initialScale on infinite scrollMode
  diagramInitial.add(new Test('Vertical Tree: Infinite scrollMode', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.scrollMode = go.Diagram.InfiniteScroll;
      diagram.initialPosition = new go.Point(-55, -55);
      diagram.initialScale = 3.2;
      vertical(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-55, -55)),
        'Initial position is wrong, should be (-55, -55) but value is '+diagram.position);
      test.assert(diagram.scale === 3.2,
        'Diagram Scale is incorrect, should be 3.2 but value is '+diagram.scale);


  })); // end test

  //Testing initialDocumentSpot, initialViewportSpot and initialScale
  diagramInitial.add(new Test('Vertical Tree: Small', null,
    function (test) {

      var diagram = test.diagram;
      diagram.reset();
      diagram.initialDocumentSpot = go.Spot.Center;
      diagram.initialViewportSpot = go.Spot.Center;
      //diagram.initialPosition = new go.Point(-100, -49);
      diagram.initialScale = 0.5;

      vertical(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.Center),
        'The initialDocumentSpot should be centred but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.Center),
        'The initialViewportSpot should be centred but is '+diagram.initialViewportSpot);
      //test.assert(diagram.position.equals(new go.Point(-100, -49)),
        //'Initial position is wrong, should be (-100, -49) but value is '+diagram.position);
      test.assert(diagram.scale === 0.5,
        'Diagram Scale is incorrect, should be 0.5 but value is '+diagram.scale);
  })); // end test


  //Tests initialPosition, initial..Spots, autoScale and initialScale on infinite scrollMode
  diagramInitial.add(new Test('Vertical Tree: autoscale', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.scrollMode = go.Diagram.InfiniteScroll;
      diagram.initialPosition = new go.Point(-55, -55);
      diagram.initialScale = 2;
      diagram.initialDocumentSpot = go.Spot.LeftCenter;
      diagram.initialViewportSpot = go.Spot.LeftCenter;
      diagram.autoScale = go.Diagram.Uniform;
      vertical(diagram);

    }, // END SETUP
    null,
    function (test) {

      var diagram = test.diagram;
      test.assert(diagram.position.equalsApprox(new go.Point(-55, -55)),
        'Initial position is wrong, should be (-55, -55) but value is '+diagram.position);
      test.assert(diagram.initialDocumentSpot.equals(go.Spot.LeftCenter),
        'The initialDocumentSpot should be centre left but is '+diagram.initialDocumentSpot);
      test.assert(diagram.initialViewportSpot.equals(go.Spot.LeftCenter),
        'The initialViewportSpot should be centre left but is '+diagram.initialViewportSpot);
      test.assert(diagram.scale !== 2,
        'Initial autoscale should not be 2 but is '+diagram.scale);
      test.assert(diagram.autoScale === go.Diagram.Uniform,
        'AutoScale should be uniform but is '+diagram.autoScale);
  })); //end test



  // Tests that history is available in top level transaction if Initial Layout is nested
  diagramInitial.add(new Test('Top level delayed transaction', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.layout = $(go.ForceDirectedLayout);
      diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE', fill: 'white', strokeWidth: 0,
              // set the port properties:
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8, editable: true },  // some room around the text
            new go.Binding('text').makeTwoWay()
          )
        );
      diagram.model =
        $(go.GraphLinksModel,
          {
            nodeDataArray: [],
            linkDataArray: [],
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          });
      test.assert(diagram.isModified, "isModified should be true after setting model");
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      // set this up after setting diagram.model:
      diagram.addDiagramListener("InitialLayoutCompleted", function(e) {
        test.assert(e.diagram.undoManager.transactionLevel > 0, "transactionLevel should be > 0 during transaction");
        test._initialLayoutCompleted = true;
      });
      diagram.addModelChangedListener(function(e) {
        if (e.isTransactionFinished && e.oldValue === 'delaymerge') {
          test.assert(e.model.undoManager.transactionLevel === 0, "transactionLevel should be zero");
          test.assert(e.object instanceof go.Transaction, 'ChangedEvent should have non-null Transaction object.');
        }
      });
      test.assert(diagram.isModified, "isModified should still be true after the maybeUpdate");
      diagram.delayInitialization(function() {
        test.assert(!diagram.isModified, "isModified should be false after doUpdate");
        diagram.model.commit(function(m) {
          m.mergeNodeDataArray([
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          ]);
          m.mergeLinkDataArray([
            { key: -1, from: 0, to: 1 },
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 1, to: 1 },
            { key: -4, from: 2, to: 3 },
            { key: -5, from: 3, to: 0 }
          ]);
          test.assert(diagram.isModified, "isModified should become true during transaction");
        }, 'delaymerge');  // commit normal transaction
        test.assert(!diagram.isModified, "isModified should stay false after a commit");  // changed in v2.1.31
      });
    },
    function(test) {
      // can't test Diagram.isModified here because it happens too early!?
      setTimeout(function() {
        test.assert(!test.diagram.isModified, "isModified must be false after delayInitialization");
      }, 1);
    })); //end test

  // Tests that history is available in top level transaction if Initial Layout is nested
  diagramInitial.add(new Test('Top level delayed skips', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.layout = $(go.ForceDirectedLayout);
      diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE', fill: 'white', strokeWidth: 0,
              // set the port properties:
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8, editable: true },  // some room around the text
            new go.Binding('text').makeTwoWay()
          )
        );
      diagram.model =
        $(go.GraphLinksModel,
          {
            nodeDataArray: [],
            linkDataArray: [],
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          });
      test.assert(diagram.isModified, "isModified should be true after setting model");
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      // set this up after setting diagram.model:
      diagram.addDiagramListener("InitialLayoutCompleted", function(e) {
        test.assert(e.diagram.undoManager.transactionLevel > 0, "transactionLevel should be > 0 during transaction");
        test._initialLayoutCompleted = true;
      });
      diagram.addModelChangedListener(function(e) {
        if (e.isTransactionFinished) {
          test.assert(e.model.undoManager.transactionLevel === 0, "transactionLevel should be zero");
          test.assert(e.object === null,
                      'ChangedEvent should have a null Transaction object. ' + e.oldValue + " " + e.object);
        }
      });
      test.assert(diagram.isModified, "isModified should still be true after the maybeUpdate");
      diagram.delayInitialization(function() {
        test.assert(!diagram.isModified, "isModified should be false after doUpdate");
        diagram.model.commit(function(m) {
          m.mergeNodeDataArray([
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          ]);
          m.mergeLinkDataArray([
            { key: -1, from: 0, to: 1 },
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 1, to: 1 },
            { key: -4, from: 2, to: 3 },
            { key: -5, from: 3, to: 0 }
          ]);
          test.assert(!diagram.isModified, "isModified should not become true when skipsUndoManager");
        }, null);  // null means skipsUndoManager
        test.assert(!diagram.isModified, "isModified should stay false after a skipsUndoManager commit");
      });
    },
    function(test) {
      // can't test Diagram.isModified here because it happens too early!?
      setTimeout(function() {
        test.assert(!test.diagram.isModified, "isModified must be false after delayInitialization");
      }, 1);
    })); //end test


  // Tests that history is available in top level transaction if Initial Layout is nested
  diagramInitial.add(new Test('Initial model; delayed transaction', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.layout = $(go.ForceDirectedLayout);
      diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE', fill: 'white', strokeWidth: 0,
              // set the port properties:
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8, editable: true },  // some room around the text
            new go.Binding('text').makeTwoWay()
          )
        );
      diagram.model.linkKeyProperty = "key";  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      diagram.model.nodeDataArray = [{ key: 1, text: "ONE" }, { key: 2, text: "TWO" }];
      diagram.model.linkDataArray = [{ from: 1, to: 2 }];
      test.assert(diagram.isModified, "isModified should be true after modifying initial model");
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      // set this up after setting diagram.model:
      diagram.addDiagramListener("InitialLayoutCompleted", function(e) {
        test.assert(e.diagram.undoManager.transactionLevel > 0, "transactionLevel should be > 0 during transaction");
        test._initialLayoutCompleted = true;
      });
      diagram.addModelChangedListener(function(e) {
        if (e.isTransactionFinished && e.oldValue === 'delaymerge') {
          test.assert(e.model.undoManager.transactionLevel === 0, "transactionLevel should be zero");
          test.assert(e.object instanceof go.Transaction, 'ChangedEvent should have non-null Transaction object.');
        }
      });
      test.assert(diagram.isModified, "isModified should still be true after the maybeUpdate");
      diagram.delayInitialization(function() {
        test.assert(!diagram.isModified, "isModified should be false after doUpdate");
        diagram.model.commit(function(m) {
          m.mergeNodeDataArray([
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          ]);
          m.mergeLinkDataArray([
            { key: -1, from: 0, to: 1 },
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 1, to: 1 },
            { key: -4, from: 2, to: 3 },
            { key: -5, from: 3, to: 0 }
          ]);
          test.assert(diagram.isModified, "isModified should become true during transaction");
        }, 'delaymerge');  // commit normal transaction
        test.assert(!diagram.isModified, "isModified should stay false after a commit");  // changed in v2.1.31
      });
    },
    function(test) {
      // can't test Diagram.isModified here because it happens too early!?
      setTimeout(function() {
        test.assert(!test.diagram.isModified, "isModified must be false after delayInitialization");
      }, 1);
    })); //end test

  // Tests that history is available in top level transaction if Initial Layout is nested
  diagramInitial.add(new Test('Initial model; delayed skips', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.layout = $(go.ForceDirectedLayout);
      diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
          new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'SHAPE', fill: 'white', strokeWidth: 0,
              // set the port properties:
              portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
            },
            // Shape.fill is bound to Node.data.color
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            { margin: 8, editable: true },  // some room around the text
            new go.Binding('text').makeTwoWay()
          )
        );
      diagram.model.linkKeyProperty = "key";  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      diagram.model.nodeDataArray = [{ key: 1, text: "ONE" }, { key: 2, text: "TWO" }];
      diagram.model.linkDataArray = [{ from: 1, to: 2 }];
      test.assert(diagram.isModified, "isModified should be true after modifying initial model");
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      // set this up after setting diagram.model:
      diagram.addDiagramListener("InitialLayoutCompleted", function(e) {
        test.assert(e.diagram.undoManager.transactionLevel > 0, "transactionLevel should be > 0 during transaction");
        test._initialLayoutCompleted = true;
      });
      diagram.addModelChangedListener(function(e) {
        if (e.isTransactionFinished) {
          test.assert(e.model.undoManager.transactionLevel === 0, "transactionLevel should be zero");
          test.assert(e.object === null,
                      'ChangedEvent should have a null Transaction object. ' + e.oldValue + " " + e.object);
        }
      });
      test.assert(diagram.isModified, "isModified should still be true after the maybeUpdate");
      diagram.delayInitialization(function() {
        test.assert(!diagram.isModified, "isModified should be false after doUpdate");
        diagram.model.commit(function(m) {
          m.mergeNodeDataArray([
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          ]);
          m.mergeLinkDataArray([
            { key: -1, from: 0, to: 1 },
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 1, to: 1 },
            { key: -4, from: 2, to: 3 },
            { key: -5, from: 3, to: 0 }
          ]);
          test.assert(!diagram.isModified, "isModified should not become true when skipsUndoManager");
        }, null);  // null means skipsUndoManager
        test.assert(!diagram.isModified, "isModified should stay false after a skipsUndoManager commit");
      });
    },
    function(test) {
      // can't test Diagram.isModified here because it happens too early!?
      setTimeout(function() {
        test.assert(!test.diagram.isModified, "isModified must be false after delayInitialization");
      }, 1);
    })); //end test

})(); //end test system