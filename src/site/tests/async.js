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
  var v1 = new TestCollection('Async');
  TestRoot.add(v1);
  var $ = go.GraphObject.make;

  // These tests are async by nature and need unique names

  var uid = 1000; // anim1.js uses 100
  function newTestName() {
    return 'gojsDiagram' + uid++;
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

  //
  v1.addAnimated(new Test('success/errorFunction', null, // add animated for async
  function (test) {
    test.name = 'ASYNC1';
    if (window.async1HasFired) {
      // due to the nature of gojs image caching, this test is not idempotent
      test.unblock(); // Required!
      return;
    }
    window.async1HasFired = true;
    var diagram = setup('ASYNC1', 400, 400, {
      "animationManager.isEnabled":false
    });
    var successCount = 0;
    var failureCount = 0;
    function checkDone() {
      if (successCount === 3 && failureCount === 4) {

        // next step: copy/paste one of each, twice
        // and look for 5 success and 6 failure total
        diagram.commit(function() {
          // two more success
          diagram.select(diagram.findNodeForKey(1));
          diagram.commandHandler.copySelection();
          diagram.commandHandler.pasteSelection();
          diagram.commandHandler.pasteSelection();

          // two more fails
          diagram.select(diagram.findNodeForKey(2));
          diagram.commandHandler.copySelection();
          diagram.commandHandler.pasteSelection();
          diagram.commandHandler.pasteSelection();
        }, null);
        if (successCount === 5 && failureCount === 6) {
          teardown('ASYNC1');
          test.unblock(); // Required!
        }
      }
    }
    setTimeout(function() {
      if ( successCount !== 5) { test.assert(false, "successFunction did not fire 5x!, but " + successCount) }
      if ( failureCount !== 6) { test.assert(false, "errorFunction did not fire 6x!, but " + failureCount) }
    }, 1000);
    diagram.nodeTemplate =
    $(go.Node, { },
        $(go.Picture, {
            desiredSize: new go.Size(100, 100),
            successFunction: function(pic, e) {
              successCount++;
              checkDone();
            },
            errorFunction: function(pic, e) {
              failureCount++;
              checkDone();
            }
          },
          new go.Binding("source", "image"))
      );

      diagram.model = new go.GraphLinksModel(
      [
        { key: 1, image: "images/50x40.png" },
        { key: 2, image: "non-existent.jpg" },
        { key: 2, image: "non-existent.jpg" },
        { key: 2, image: "non-existent.jpg" },
        { key: 3, image: "non-existent.jpg" },
        { key: 4, image: "images/50x40.png" },
        { key: 4, image: "images/50x40.png" }
      ], [ ]);

  }, null, function (test) {

  }
  )); // end test


  // Ensure a default binding image loads, and the data bound one loads too
  v1.addAnimated(new Test('binding/no-bind', null,
  function (test) {
    test.name = 'ASYNC2';
    if (window.async2HasFired) {
      // due to the nature of gojs image caching, this test is not idempotent
      test.unblock(); // Required!
      return;
    }
    window.async2HasFired = true;
    var diagram = setup('ASYNC2', 400, 400, {
      "animationManager.isEnabled":false
    });

    setTimeout(function() {
      // ensure they loaded *and* measured correctly
      test.assert(diagram.findNodeForKey('Alpha').actualBounds.width === 55);
      test.assert(diagram.findNodeForKey('Beta').actualBounds.width === 50);
      teardown('ASYNC2');
      test.unblock(); // Required!
    }, 1000);
    diagram.nodeTemplate =
    $(go.Node, "Auto",
       $(go.Picture, { source: "images/55x55.png"
       },
       new go.Binding('source'))
     )

      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue", selectedColor: 'red' },
        { key: "Beta", color: "orange", source: "images/50x40.png" },

      ], [ ]);

  }, null, function (test) { }
  )); // end test

  // Ensure initial position is correct when a diagram's DIV size is set
  // immediately after it is created
  v1.addAnimated(new Test('inital position', null,
  function (test) {
    test.name = 'ASYNC3';
    if (window.async3HasFired) {
      // due to the nature of gojs image caching, this test is not idempotent
      test.unblock(); // Required!
      return;
    }
    window.async3HasFired = true;

    var thisDiagram = new go.Diagram({ "animationManager.isEnabled":false });
    thisDiagram.layout = new go.Layout();
    const div = document.createElement('div');
    div.style.position = 'absolute';
    document.body.appendChild(div);
    thisDiagram.div = div;

    div.style.width = "300px";
    div.style.height = "300px";
    div.style.backgroundColor = "whitesmoke";

    thisDiagram.nodeTemplate = new go.Node({background: 'lime', width: 20, height: 20})
    thisDiagram.model = new go.GraphLinksModel();
    thisDiagram.model.addNodeData({ key: "1", text: "1", loc: "0 0" });
    thisDiagram.addDiagramListener('InitialLayoutCompleted', (e) => {
      test.assert(e.diagram.position.toString() === 'Point(-140,-140)');
      thisDiagram.div = null;
      thisDiagram = null;
      div.remove();
      test.unblock(); // Required!
    }
    );


  }, null, function (test) { }
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



