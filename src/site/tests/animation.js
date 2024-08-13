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
    return 'gojsDiagramA' + uid++;
  }

  function setup(name, options) {
    var namediv = name + 'div';
    window[namediv] = document.createElement('div');
    window[namediv].innerHTML = '<div id="' + namediv + '" style="border: solid 1px black; width: 400px; height: 400px"></div>';

    document.body.appendChild(window[namediv]);
    window[name] =
      $(go.Diagram, namediv, {
        "animationManager.isEnabled": true,
        initialContentAlignment: go.Spot.Center
      });
    for (var k in options) {
      window[name][k] = options[k];
    }


    return window[name];
  }

  function teardown(name) {
    var namediv = name + 'div';
    document.body.removeChild(window[namediv]);
    window[name].div = null;
    window[name] = null;
    window[namediv] = null;
  }


  v1.addAnimated(new Test('Ensure animation 1', null,
  function (test) {
      test.name = newTestName();
      test.diagram = setup(test.name, {});
      var diagram = test.diagram;

      diagram.animationManager.isEnabled = false;
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
      diagram.animationManager.isEnabled = true;
      var expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        expectation++;
      });
      diagram.layoutDiagram(true);
      diagram.startTransaction();
      diagram.commitTransaction();

      setTimeout(function() {
        // After JS thread is finished this will execute
        test.assert(expectation === 1);
        teardown(test.name);
        test.unblock(); // Required!
      }, (100));
  }
  )); // end test

  v1.addAnimated(new Test('Ensure animation 2', null, // same but sandwiched in transaction
  function (test) {
      test.name = newTestName();
      test.diagram = setup(test.name, {});
      var diagram = test.diagram;

      diagram.animationManager.isEnabled = false;
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
      diagram.animationManager.isEnabled = true;
      var expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        expectation++;
      });
      diagram.startTransaction();
      diagram.layoutDiagram(true);
      diagram.commitTransaction();

      setTimeout(function() {
        // After JS thread is finished this will execute
        test.assert(expectation === 1);
        teardown(test.name);
        test.unblock(); // Required!
      }, (100));
  }
  )); // end test

  v1.addAnimated(new Test('Ensure initial animation', null,
  function (test) {
      test.name = newTestName();
      test.diagram = setup(test.name, {});
      var diagram = test.diagram;
      test.expectation = 0;
      diagram.addDiagramListener('AnimationStarting', function() {
        test.expectation++;
      });
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
  },
  null,
  function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.animationManager.isEnabled = true;

      setTimeout(function() {
        // After JS thread is finished this will execute, animation should have started
        test.assert(test.expectation === 1);
        teardown(test.name);
        test.unblock(); // Required!
      }, (100));
  }
  )); // end test

  })(); // end test system


  /*
  v1.add(new Test('Ensure animation 1', null,
  function (test) {
      test.name = newTestName();
      test.diagram = setup(test.name, {});
      var diagram = test.diagram;

      diagram.layout = new go.TreeLayout();
      diagram.addDiagramListener('AnimationFinished', function() {
        diagram.nodes.first().position = new go.Point(0,1);
      })
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

  },
  null,
  function (test) {
      var diagram = test.diagram;
      var d = diagram;

      //teardown(test.name);
  }
  )); // end test
  */