
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
var $ = go.GraphObject.make;
function setup2(name, width, height, options) {
  var namediv = name + 'div';
  window[namediv] = document.createElement('div');
  window[namediv].innerHTML = '<div id="' + namediv + '" style="border: solid 1px black; width: ' + width + 'px; height: ' + height + 'px"></div>';

  document.body.appendChild(window[namediv]);
  window[name] = $(go.Diagram, namediv, options);
  return window[name];
}

function teardown2(name) {
  var namediv = name + 'div';
  document.body.removeChild(window[namediv]);
  window[name].div = null;
  window[name] = null;
  window[namediv] = null;
}

(function() {
  var $ = go.GraphObject.make;


  function setup(model) {
    window.D1Div = document.createElement('div');
    window.D1Div.innerHTML = '<div id="yep" style="border: solid 1px black; width: 400px; height: 400px"></div>';

    document.body.appendChild(window.D1Div);
    window.D1 =
      $(go.Diagram, "yep", {
        "animationManager.isEnabled": false,
        initialContentAlignment: go.Spot.Center,
        nodeTemplate:
          $(go.Node, "Auto",
            new go.Binding("position", "pos", go.Point.parse),
            $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              { margin: 1 },
              new go.Binding("text", "key"))
          )
      });
    if (model === undefined)  {
      D1.model = new go.GraphLinksModel(
      [
        { pos: "0 00", key: "Alpha", color: "lightblue" },
        { pos: "0 20", key: "Beta", color: "orange" },
        { pos: "0 40", key: "Gamma", color: "lightgreen" },
        { pos: "00 60", key: "Delta", color: "pink" }
      ], []);
    } else {
       D1.model = model;
    }
    return D1;
  }

  function teardown() {
    window.D1.div = null;
    document.body.removeChild(D1Div);
    window.D1 = null;
    window.D1Div = null;
  }

  var positiontests = new TestCollection('Diagram position');
  TestRoot.add(positiontests);

  positiontests.add(new Test('position bounded', null,
    function(test) {
      var d = setup();
    },
    null,
    function(test) {
      D1.redraw(); // force update
      test.assert(D1.position.x < -100);
      test.assert(D1.position.y < -100);

      // Set it to 100, 100 but it will be bounded so it cannot go past -5, -5
      D1.position = new go.Point(100, 100);
      test.assert(D1.position.equalTo(-5, -5))
      // Does not have scrollbars (?? wont work on mobile)
      //test.assert(D1.viewportBounds.width === 400);
      //test.assert(D1.viewportBounds.height === 400);

      teardown();
    }
  )); // end test

  positiontests.add(new Test('position unbounded (inf scroll)', null,
    function(test) {
      var d = setup();
      d.scrollMode = go.Diagram.InfiniteScroll;
    },
    null,
    function(test) {
      D1.redraw(); // force update
      test.assert(D1.position.x < -100);
      test.assert(D1.position.y < -100);

      // Set it to 100, 100 and infinite scroll allows it to exist
      D1.position = new go.Point(100, 100);
      test.assert(D1.position.equalTo(100, 100))
      // Has scrollbars (?? wont work on mobile)
      //test.assert(D1.viewportBounds.width < 400);
      //test.assert(D1.viewportBounds.height < 400);

      teardown();
    }
  )); // end test

  positiontests.add(new Test('position bounded + margin small', null,
    function(test) {
      var d = setup();
      d.scrollMargin = 200;
    },
    null,
    function(test) {
      D1.redraw(); // force update
      test.assert(D1.position.x < -100);
      test.assert(D1.position.y < -100);

      // Set it to 100, 100 but it will be bounded so it cannot go past -5, -5
      D1.position = new go.Point(100, 100);
      test.assert(D1.position.equalTo(-5, -5))
      // Does not have scrollbars (?? wont work on mobile)
      //test.assert(D1.viewportBounds.width === 400);
      //test.assert(D1.viewportBounds.height === 400);

      teardown();
    }
  )); // end test

  positiontests.add(new Test('position bounded + margin large', null,
    function(test) {
      var d = setup();
      d.scrollMargin = 500;
    },
    null,
    function(test) {
      D1.redraw(); // force update
      test.assert(D1.position.x < -100);
      test.assert(D1.position.y < -100);

      // Set it to 100, 100 and the large scroll margin will allow it to be off screen
      D1.position = new go.Point(100, 100);
      test.assert(D1.position.equalTo(100, 100))
      // Has scrollbars (?? wont work on mobile)
      //test.assert(D1.viewportBounds.width < 400, D1.viewportBounds.width);
      //test.assert(D1.viewportBounds.height < 400, D1.viewportBounds.height);


      teardown();
    }
  )); // end test

  positiontests.add(new Test('ScrollMargin 3: + contentAlignment', null,
    function(test) {
      var d = setup();
      d.contentAlignment = go.Spot.Center;
      d.scrollMargin = 500;
    },
    null,
    function(test) {
      D1.redraw(); // force update
      test.assert(D1.position.x < -100);
      test.assert(D1.position.y < -100);

      // Set it to 100, 100 and the large scroll margin will allow it to be off screen
      var old = D1.position.copy();
      D1.position = new go.Point(100, 100);
      // The position will refuse to move, contentAlignment still takes precedence!
      test.assert(D1.position.equals(old))
      teardown();
    }
  )); // end test

  positiontests.add(new Test('ScrollMargin 4: TODO', null,
    function(test) {

      var model = new go.GraphLinksModel(
      [
        { pos: "0 00", key: "Alpha", color: "lightblue" },
        { pos: "0 20", key: "Beta", color: "orange" },
        { pos: "0 40", key: "Gamma", color: "lightgreen" },
        { pos: "600 60", key: "Delta", color: "pink" }
      ], []);

      var d = setup(model);
      d.contentAlignment = go.Spot.Center;
      d.scrollMargin = 500;
    },
    null,
    function(test) {
      D1.redraw(); // force update

      // Set it to 100, 100 and the large scroll margin will allow it to be off screen
      var old = D1.position.copy();
      D1.position = new go.Point(100, 100);
      // The position will move, because the doc bounds is larger than the viewport
      test.assert(!D1.position.equals(old))
       teardown();
    }
  )); // end test

  positiontests.add(new Test('make sure position is bounded', null,
    function(test) {
      test.diagram.reset();

    test.diagram.model = new go.GraphLinksModel(
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


    },
    null,
    function(test) {
      var d= test.diagram;
      d.scale = 2;
      d.position = new go.Point(99999,99999);
      test.assert(!d.position.equals(new go.Point(99999,99999)), "onPositionChanged failed for some reason")
    }
  )); // end test

  // Make sure changing scrollVerticalLineChange and Horizontal... work
  positiontests.add(new Test('scrollVertical/Horizontal', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram = setup2('EXAMPLE13', 300, 300, {
        "animationManager.isEnabled": false
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



    },
    null,
    function(test) {
      var diagram = window['EXAMPLE13'];

        // Extremely phony event:
        var e = new go.InputEvent();
        e.delta = 1
        // Mock browser scroll up event:
        e.event = {
          deltaMode: 0,
          deltaX: -0,
          deltaY: -150
        };
        diagram.startTransaction();
        diagram.commitTransaction();

        test.assert(diagram.position.equalsApprox(new go.Point(-85,-100)));
        diagram.scrollVerticalLineChange = 2;
        diagram.lastInput = e;
        diagram.toolManager.standardMouseWheel();
        test.assert(diagram.position.equalsApprox(new go.Point(-85,-118.75)));
        // Extremely phony event deux:
        var e = new go.InputEvent();
        e.delta = 1
        // Mock browser scroll down event:
        e.event = {
          deltaMode: 0,
          deltaX: 0,
          deltaY: 150
        };
        diagram.scrollVerticalLineChange = 16;
        diagram.lastInput = e;
        diagram.toolManager.standardMouseWheel();
        test.assert(diagram.position.equalsApprox(new go.Point(-85,-5)));


        // Extremely phony event deux:
        var e = new go.InputEvent();
        e.delta = 1
        // Mock browser scroll left event:
        e.event = {
          deltaMode: 0,
          deltaX: -150,
          deltaY: 0
        };
        diagram.scrollHorizontalLineChange = 1;
        diagram.lastInput = e;
        diagram.toolManager.standardMouseWheel();
        test.assert(diagram.position.equalsApprox(new go.Point(-94.375,-5)));

        // Extremely phony event deux:
        var e = new go.InputEvent();
        e.delta = 1
        // Mock browser scroll right event:
        e.event = {
          deltaMode: 0,
          deltaX: 150,
          deltaY: 00
        };
        diagram.scrollHorizontalLineChange = 16;
        diagram.lastInput = e;
        diagram.toolManager.standardMouseWheel();
        test.assert(diagram.position.equalsApprox(new go.Point(-5,-5)));

      teardown2('EXAMPLE13');
    }
  )); // end test

})(); // End test system

