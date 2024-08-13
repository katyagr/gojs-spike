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


  var brushtests = new TestCollection('Brush');
  TestRoot.add(brushtests);

  // Darken a solid color
  brushtests.add(new Test('Static Brush.darken', null,
    null,
    null,
    function (test) {
      var c = "rgba(180, 0, 0, 1)";
      test.assert(c === "rgba(180, 0, 0, 1)", "Wrong color");
      test.assert(go.Brush.darken(c) === "rgba(110, 0, 0, 1)", "Wrong darkened color");
    }
  )); // end test

  // Darken a solid color brush
  brushtests.add(new Test('Instance Brush.darken', null,
    null,
    null,
    function (test) {
      var b = $(go.Brush, { color: "rgba(180, 0, 0, 1)" });
      var b2 = b.copy().darkenBy(.2, go.ColorSpace.Lab);
      var b3 = b.copy().darkenBy(.2, go.ColorSpace.HSL);
      var b4 = b.copy().darkenBy(.2, go.ColorSpace.Oklch);
      test.assert(b.color === "rgba(180, 0, 0, 1)", "Wrong color");
      test.assert(b2.color === "rgba(119, 0, 0, 1)", "Wrong darkened color, Lab");
      test.assert(b3.color === "hsla(0, 100%, 15%, 1)", "Wrong darkened color, HSL");
      test.assert(b4.color === "rgba(110, 0, 0, 1)", "Wrong darkened color, Oklch");
    }
  )); // end test

  // Darken a gradient brush
  brushtests.add(new Test('Gradient Brush.darken', null,
    null,
    null,
    function (test) {
      var b = $(go.Brush, "Linear", { 0: "rgba(0, 0, 180, 1)", 1: "rgba(180, 0, 0, 1)" });
      var b2 = b.copy().darkenBy(.2, go.ColorSpace.Lab);
      var b3 = b.copy().darkenBy(.2, go.ColorSpace.HSL);
      var b4 = b.copy().darkenBy(.2, go.ColorSpace.Oklch);
      test.assert(b.colorStops.getValue(0) === "rgba(0, 0, 180, 1)", "Wrong color stop 0");
      test.assert(b.colorStops.getValue(1) === "rgba(180, 0, 0, 1)", "Wrong color stop 1");
      test.assert(b2.colorStops.getValue(0) === "rgba(0, 0, 125, 1)", "Wrong darkened color stop 0, Lab");
      test.assert(b2.colorStops.getValue(1) === "rgba(119, 0, 0, 1)", "Wrong darkened color stop 1, Lab");
      test.assert(b3.colorStops.getValue(0) === "hsla(240, 100%, 15%, 1)", "Wrong darkened color stop 0, HSL");
      test.assert(b3.colorStops.getValue(1) === "hsla(0, 100%, 15%, 1)", "Wrong darkened color stop 1, HSL");
      test.assert(b4.colorStops.getValue(0) === "rgba(25, 0, 112, 1)", "Wrong darkened color stop 0, Oklch");
      test.assert(b4.colorStops.getValue(1) === "rgba(110, 0, 0, 1)", "Wrong darkened color stop 1, Oklch");
    }
  )); // end test

  // Lighten a solid color
  brushtests.add(new Test('Static Brush.lighten', null,
    null,
    null,
    function (test) {
      var c = "rgba(180, 0, 0, 1)";
      test.assert(c === "rgba(180, 0, 0, 1)", "Wrong color");
      test.assert(go.Brush.lighten(c) === "rgba(252, 92, 75, 1)", "Wrong lightened color");
    }
  )); // end test

  // Lighten a solid color brush
  brushtests.add(new Test('Instance Brush.lighten', null,
    null,
    null,
    function (test) {
      var b = $(go.Brush, { color: "rgba(180, 0, 0, 1)" });
      var b2 = b.copy().lightenBy(.2, go.ColorSpace.Lab);
      var b3 = b.copy().lightenBy(.2, go.ColorSpace.HSL);
      var b4 = b.copy().lightenBy(.2, go.ColorSpace.Oklch);
      test.assert(b.color === "rgba(180, 0, 0, 1)", "Wrong color");
      test.assert(b2.color === "rgba(245, 79, 49, 1)", "Wrong lightened color, Lab");
      test.assert(b3.color === "hsla(0, 100%, 55%, 1)", "Wrong lightened color, HSL");
      test.assert(b4.color === "rgba(252, 92, 75, 1)", "Wrong lightened color, Oklch");
    }
  )); // end test

  // Lighten a gradient brush
  brushtests.add(new Test('Gradient Brush.lighten', null,
    null,
    null,
    function (test) {
      var b = $(go.Brush, "Linear", { 0: "rgba(0, 0, 180, 1)", 1: "rgba(180, 0, 0, 1)" });
      var b2 = b.copy().lightenBy(.2, go.ColorSpace.Lab);
      var b3 = b.copy().lightenBy(.2, go.ColorSpace.HSL);
      var b4 = b.copy().lightenBy(.2, go.ColorSpace.Oklch);
      test.assert(b.colorStops.getValue(0) === "rgba(0, 0, 180, 1)", "Wrong color stop 0");
      test.assert(b.colorStops.getValue(1) === "rgba(180, 0, 0, 1)", "Wrong color stop 1");
      test.assert(b2.colorStops.getValue(0) === "rgba(99, 59, 237, 1)", "Wrong lightened color stop 0, Lab");
      test.assert(b2.colorStops.getValue(1) === "rgba(245, 79, 49, 1)", "Wrong lightened color stop 1, Lab");
      test.assert(b3.colorStops.getValue(0) === "hsla(240, 100%, 55%, 1)", "Wrong lightened color stop 0, HSL");
      test.assert(b3.colorStops.getValue(1) === "hsla(0, 100%, 55%, 1)", "Wrong lightened color stop 1, HSL");
      test.assert(b4.colorStops.getValue(0) === "rgba(34, 93, 250, 1)", "Wrong lightened color stop 0, Oklch");
      test.assert(b4.colorStops.getValue(1) === "rgba(252, 92, 75, 1)", "Wrong lightened color stop 1, Oklch");
    }
  )); // end test

  // Mix two colors together
  brushtests.add(new Test('Brush.mix', null,
    null,
    null,
    function (test) {
      test.assert(go.Brush.mix("red", "blue") === "rgba(128, 0, 128, 1)", "Brush.mix should return rgba(128, 0, 128, 1) for 'red and 'blue'");
      test.assert(go.Brush.mix("red", "blue", .25) === "rgba(191, 0, 64, 1)", "Brush.mix should return rgba(191, 0, 64, 1) for 'red and 'blue' at .25");
    }
  )); // end test

  // Determine whether a solid color is dark
  brushtests.add(new Test('Static Brush.isDark', null,
    null,
    null,
    function (test) {
      test.assert(!(go.Brush.isDark("white")), "Brush.isDark should return false for 'white'");
      test.assert(go.Brush.isDark("black"), "Brush.isDark should return true for 'black'");
      test.assert(go.Brush.isDark("red"), "Brush.isDark should return true for 'red'");
      test.assert(go.Brush.isDark("blue"), "Brush.isDark should return true for 'blue'");
      test.assert(!(go.Brush.isDark("yellow")), "Brush.isDark should return false for 'yellow'");
    }
  )); // end test

  // Determine whether a brush is dark, for both solid color and gradient
  brushtests.add(new Test('Instance Brush.isDark', null,
    null,
    null,
    function (test) {
      // solid brush
      var b = $(go.Brush, { color: "red" });
      test.assert(b.isDark(), "Brush.isDark should return true for red brush");
      // radial gradient
      b = $(go.Brush, "Radial", { 0: "black", 1: "white" });
      test.assert(b.isDark(), "Brush.isDark should return true for radial brush with black center");
      // linear gradient, mid color specified
      b = $(go.Brush, "Linear", { 0: "black", .5: "red", 1: "white" });
      test.assert(b.isDark(), "Brush.isDark should return true for linear brush with red center");
      // linear gradient, two colors at ends
      b = $(go.Brush, "Linear", { 0: "black", 1: "white" });
      test.assert(!(b.isDark()), "Brush.isDark should return false for linear brush from black to white");
      // linear gradient, mix two colors closest to center
      b = $(go.Brush, "Linear", { 0: "black", .4: "black", .7: "white", 1: "white" });
      test.assert(b.isDark(), "Brush.isDark should return true for linear brush with black closer to center");
    }
  )); // end test

  brushtests.add(new Test('brush setters OK', null,
    null,
    null,
    function (test) {
      // setting brush to random object should fail, so assert(false) should never happen:
      var shape = new go.Shape();
      try {
        shape.fill = {};
        test.assert(false);
      } catch(ex) {}
      try {
        shape.stroke = {};
        test.assert(false);
      } catch(ex) {}
      var text = new go.TextBlock();
      try {
        text.stroke = {};
        test.assert(false);
      } catch(ex) {}
      var panel = new go.Panel();
      try { panel.background = {}; test.assert(false); } catch(ex) {}
      var row = new go.RowColumnDefinition();
      try { row.background = {}; test.assert(false); } catch(ex) {}
      try { row.separatorStroke = {}; test.assert(false); } catch(ex) {}
    }
  )); // end test

})(); // End test system
