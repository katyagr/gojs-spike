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
var intro = new TestCollection('init');
TestRoot.add(intro);
var $ = go.GraphObject.make;
var diagram = null;

function isAbout(x, y) {
  var d = x - y;
  return d < 2 && d > -2;
}

function teardown() {
  window.D1.div = null;
  document.body.removeChild(window.initD1);
  window.D1 = null;
  window.initD1 = null;
}

function commonSetup(test) {
  var $ = go.GraphObject.make;
    //test.diagram.contentAlignment = go.Spot.Center;
    //test.diagram.initialContentAlignment = go.Spot.Right;
    // define a simple Node template (but use the default Link template)
    test.diagram.nodeTemplate =
      $(go.Node, "Vertical",
        { },
        $(go.Shape, {
          figure: "RoundedRectangle",
          width: 40,
          height: 40
        },
        new go.Binding("fill", "color")),
      new go.Binding("location", "loc"));

    // create the model data that will be represented by Nodes and Links
    var model = new go.GraphLinksModel();
    model.nodeDataArray = [
    { key: "Alpha", color: "lightblue", loc: new go.Point(40,40) }
    ];
    model.linkDataArray = [];
    test.diagram.model = model;
    test.diagram.undoManager.isEnabled = true;
}

intro.add(new Test('topLeftInitial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)

    }, // END SETUP
    function (test) {
var d = test.diagram;

d.startTransaction('a');
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
test.assert(d.position.equals(new go.Point(35, 35)))
d.commitTransaction('a');

    }, // END TEST
    null
));

intro.add(new Test('topRightInitial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)
d.initialContentAlignment = go.Spot.TopRight;
    }, // END SETUP
    function (test) {
var d = test.diagram;

d.startTransaction('a');
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
test.assert(d.position.y === 35)
var canWidth = d.div.firstChild.width
var dist = (n.position.x - d.position.x) + d.padding.left + n.actualBounds.width;
test.assert(isAbout(dist * d.computePixelRatio(), canWidth))
d.commitTransaction('a');

    }, // END TEST
    null
));

intro.add(new Test('bottomRightInitial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)
d.initialContentAlignment = go.Spot.BottomRight;
    }, // END SETUP
    function (test) {
var d = test.diagram;
d.startTransaction('a');
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
var canWidth = d.div.firstChild.width
var distw = (n.position.x - d.position.x) + d.padding.left + n.actualBounds.width;
test.assert(isAbout(distw * d.computePixelRatio(), canWidth))
var canHeight = d.div.firstChild.height
var disth = (n.position.y - d.position.y) + d.padding.top + n.actualBounds.height;
test.assert(isAbout(disth * d.computePixelRatio(), canHeight))
d.commitTransaction('a');

    }, // END TEST
    null
));

intro.add(new Test('BottomRight but set too late', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)
      d.startTransaction('a'); // This causes initial actions!
      d.commitTransaction('a');
      d.initialContentAlignment = go.Spot.BottomRight; // So this has no effect! (intentional)
    }, // END SETUP
    function (test) {
var d = test.diagram;
// Should be the same as topLeftInitial because we set the initial alignment AFTER
d.startTransaction('a');
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
test.assert(d.position.equals(new go.Point(35, 35)))
d.commitTransaction('a');

    }, // END TEST
    null
));

intro.add(new Test('BottomRight standard, no initial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      commonSetup(test)
      // Since initial is not defined, this should be the same as initial.
      d.contentAlignment = go.Spot.BottomRight;
    }, // END SETUP
    function (test) {
var d = test.diagram;
// Should be the same as topLeftInitial because we set the initial alignment AFTER
d.startTransaction('a');
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
var canWidth = d.div.firstChild.width
var distw = (n.position.x - d.position.x) + d.padding.left + n.actualBounds.width;
test.assert(isAbout(distw * d.computePixelRatio(), canWidth))
var canHeight = d.div.firstChild.height
var disth = (n.position.y - d.position.y) + d.padding.top + n.actualBounds.height;
test.assert(isAbout(disth * d.computePixelRatio(), canHeight))
d.commitTransaction('a');

    }, // END TEST
    null
));


intro.add(new Test('BottomRight standard, TopLeft initial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


    }, // END SETUP
    function (test) {
var d = test.diagram;
      d.reset();

commonSetup(test)
      d.initialContentAlignment = go.Spot.TopLeft;
      d.contentAlignment = go.Spot.BottomRight;

// only once a transaction is complete
d.startTransaction('a');
d.commitTransaction('a');

// AFTER TRANSACTION, BOTTOM RIGHT:
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
var canWidth = d.div.firstChild.width
var distw = (n.position.x - d.position.x) + d.padding.left + n.actualBounds.width;
test.assert(isAbout(distw * d.computePixelRatio(), canWidth))
var canHeight = d.div.firstChild.height
var disth = (n.position.y - d.position.y) + d.padding.top + n.actualBounds.height;
test.assert(isAbout(disth * d.computePixelRatio(), canHeight))

    }, // END TEST
    null
));


intro.add(new Test('new Diagram - BottomRight standard, TopLeft initial', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


    }, // END SETUP
    function (test) {
//var d = test.diagram;

  window.initD1 = document.createElement('div');
  window.initD1.innerHTML = '<div id="yep" style="border: solid 1px black; width: 200px; height: 200px"></div>';
        window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
  document.body.appendChild(window.initD1);
    window.D1 =
      $(go.Diagram, "yep", {
        "animationManager.isEnabled": false
      });

    D1.nodeTemplate =
      $(go.Node, "Vertical",
        { },
        $(go.Shape, {
          figure: "RoundedRectangle",
          width: 40,
          height: 40
        },
        new go.Binding("fill", "color")),
      new go.Binding("location", "loc"));

    // create the model data that will be represented by Nodes and Links
    var model = new go.GraphLinksModel();
    model.nodeDataArray = [
    { key: "Alpha", color: "lightblue", loc: new go.Point(40,40) }
    ];
    model.linkDataArray = [];
    D1.model = model;
    D1.undoManager.isEnabled = true;


  var d = window.D1;

d.initialContentAlignment = go.Spot.TopLeft;
d.contentAlignment = go.Spot.BottomRight;

// only once a transaction is complete
d.startTransaction('a');

d.commitTransaction('a');

// AFTER TRANSACTION, BOTTOM RIGHT:
var n = d.findNodeForKey('Alpha');
test.assert(n.location.equals(n.position))
test.assert(n.location.equals(new go.Point(40,40)))
var canWidth = d.div.firstChild.width
var distw = (n.position.x - d.position.x) + d.padding.left + n.actualBounds.width;
test.assert(isAbout(distw * d.computePixelRatio(), canWidth))
var canHeight = d.div.firstChild.height
var disth = (n.position.y - d.position.y) + d.padding.top + n.actualBounds.height;
test.assert(isAbout(disth * d.computePixelRatio(), canHeight))

teardown();

    }, // END TEST
    null
));



intro.add(new Test('new Diagram - initialAutoScale/autoScale', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


    }, // END SETUP
    function (test) {

window.initD1 = document.createElement('div');
window.initD1.innerHTML = '<div id="yep" style="border: solid 1px black; width: 200px; height: 100px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
document.body.appendChild(window.initD1);
window.D1 =
      $(go.Diagram, "yep", {
        "animationManager.isEnabled": false
      });

// define a simple Node template (but use the default Link template)
D1.nodeTemplate =
  $(go.Node, "Vertical",
    { },
    $(go.Shape, {
      figure: "RoundedRectangle",
      width: 400,
      height: 400
    },
    new go.Binding("fill", "color")),
  new go.Binding("location", "loc"));

// create the model data that will be represented by Nodes and Links
var model = new go.GraphLinksModel();
model.nodeDataArray = [
{ color: "red" }, { color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },
{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },
{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },
{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },
{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },
{ color: "lightblue" },{ color: "lightblue" },{ color: "lightblue" },{ color: "green" }
];
model.linkDataArray = [];
D1.model = model;
D1.undoManager.isEnabled = true;

document.body.appendChild(window.initD1);

var d = window.D1;
d.contentAlignment = go.Spot.BottomRight;
d.autoScale = go.Diagram.Uniform;
d.initialAutoScale = go.Diagram.UniformToFill;

// Scale needs to be 1 before transaction, nothing is done
test.assert(d.scale === 1);
d.startTransaction('a');
d.commitTransaction('a');

// transaction complete, normal autoScale should replace (and be smaller than) initial
test.assert(d.scale < 1);
test.assert(d.scale)

teardown();
}, // END TEST
null
));


intro.add(new Test('position data bind', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { locationSpot: go.Spot.Center },
          new go.Binding("position", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 3 },
            new go.Binding("text", "key"))
        );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue", pos: "10 10" }
      ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(diagram.nodes.first().position.x === 10);
      test.assert(diagram.nodes.first().position.y === 10);
    }, // END TEST
    null
));



intro.add(new Test('location data bind', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 3 },
            new go.Binding("text", "key"))
        );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", color: "lightblue", loc: "10 10" }
      ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(diagram.nodes.first().location.x === 10);
      test.assert(diagram.nodes.first().location.y === 10);
    }, // END TEST
    null
));



intro.add(new Test('DiagramSettings0', diagram,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


       MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
      MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings1', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.allowHorizontalScroll = false;
      diagram.allowVerticalScroll = false;
      diagram.allowZoom = false;
      diagram.maxScale = 5;
      diagram.allowMove = true;
      diagram.gridCellSize = new go.Size(5, 5);
      diagram.grid.visible = true;


         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings2', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));


intro.add(new Test('DiagramSettings3', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.undoManager.isEnabled = true;
      diagram.allowZoom = false;
      diagram.grid.gridCellSize = new go.Size(100,100);



         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));
intro.add(new Test('DiagramSettings4', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
      diagram.allowVerticalScroll = false;

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings5', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
      diagram.scrollVerticalLineChange = 6;
      diagram.allowHorizontalScroll = true;
      diagram.allowHorizontalScroll = true;

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings6', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
      diagram.allowZoom = false;

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings7', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings8', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
      diagram.scrollHorizontalLineChange = 32;

         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


 MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
  MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
     var testingIndex = 0;
     var testingAmount = 29;
    //ones basic For loop

    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)

}


    } // END TEST

));

intro.add(new Test('DiagramSettings9', diagram,
    function (test) {
      var diagram = test.diagram;
      //var d = diagram;
      diagram.reset();
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.undoManager.isEnabled = true;
      diagram.toolManager.hoverDelay = 100;
      diagram.commandHandler.copiesTree = true;
      diagram.deletesTree = true;
         diagram.nodeTemplate =
    $(go.Node, "Auto",  // the Shape will go around the TextBlock
      $(go.Shape, "RoundedRectangle",
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
     diagram.model = new go.GraphLinksModel(
    [
      { key: "0", background: 'blue', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 3, margin: 30, width: 250, height: 250, textAlign: "center" },
      { key: "1", background: 'red', text: "some long text", font: "30px monospace" },
      { key: "2", background: 'green', text: "some long text \n some long text \n some long text \n some long text \n some long text \n some long text" },
      { key: "3", background: 'red', text: "Brown Fox \n Jumped \n Over The \n Lazy Dog", font: "30px monospace", isMultiline: true, maxLines: 4, margin: 30, editable: true},
      { key: "4", background: 'yellow', text: "Red Blue Maroon Purple \n Green Pink Magenta Rainbow \n Gray Black White Gold Silver", alignment: go.Spot.Left },
      { key: "5", background: 'Purple', text: "some long text" },
      { key: "6", background: 'Blue', text: "some long text" },
      { key: "7", background: 'red', text: "a single line of centered text that should" +
                              " wrap because we will limit the width",
                        background: "lightgreen", margin: 2, width: 50,
                        wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "8", background: 'red', text: "Welcome to Joe's \n Example Test \n Playground", font: "30px monospace", maxLines: 3, height: 50, width: 80},
      { key: "9", background: 'green', text: "The great big brown fox went running on the field because it was hungry and wanted something to do.", font: "30px monospace", wrap: go.TextBlock.WrapFit, textAlign: "center" },
      { key: "10", background: 'red', text: "Hi \n Hi \n Hi \n Hi \n Hi \ Hi", font: "30px monospace", maxLines: 4, alignment: go.Spot.Left, textAlign: "center", width: 300 },
      { key: "11", background: 'yellow', text: "some long text \n ryan is mad", font: "30px monospace", margin: 30 },
      { key: "12", background: 'blue', text: "some long text", font: "30px monospace", margin: 10, alignment: go.Spot.Right, width: 150 },
      { key: "13", background: 'green', text: "The Black car was looking really fast. \n The red car looked really slow", font: "30px monospace" },
      { key: "14", background: 'Purple', text: "Very Big Text", font: "60px monospace", wrap: go.TextBlock.WrapFit, width: 40 },
      { key: "15", background: 'yellow', text: "some long text", font: "30px monospace" },
      { key: "16", background: 'red', text: "Q", font: "30px monospace" },
      { key: "17", background: 'blue', text: "This is a longer block of text so i can test out how a longer block of text looks in a few different browsers... oh wait this still neeeds to be a bit longer so i am going to type out a bit more to make it look a bit better wowowo i am so creative", font: "30px monospace" },
      { key: "18", background: 'red', text: "Hi Everyone", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 25, margin: 10, width: 5 },
      { key: "19", background: 'lightblue', text: "some long text", font: "30px monospace" },
      { key: "20", background: 'lime', text: "Example Test", font: "30px monospace" },
      { key: "21", background: 'lightblue', text: "TEST", font: "130px monospace" },
      { key: "22", background: 'pink', text: "some long text", font: "30px monospace" },
      { key: "23", background: 'lightgreen', text: "Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi \n Hi", font: "30px monospace" },
      { key: "24", background: 'red', text: "Northwoods Software is a cool place", font: "10px monospace", width: 30, wrap: go.TextBlock.WrapFit},
      { key: "25", background: 'lime', text: "I am writing Code", font: "30px monospace", wrap : go.TextBlock.WrapFit, width: 100 },
      { key: "26", background: 'orange', text: "SouthCarolina", font: "30px monospace", width: 30 },
      { key: "27", background: 'green', text: "Summer is very nice weather \n it is a very nice out \n hi \n i feel like playing poker", font: "30px monospace", wrap: go.TextBlock.WrapFit, maxLines: 3 },
      { key: "28", background: 'yellow', text: "It is very hot out", font: "30px monospace", width: 20, wrap: go.TextBlock.WrapFit },
      { key: "29", background: 'Purple', text: "some long text", font: "30px monospace" },
      { key: "30", background: 'blue', text: "I love life", font: "30px monospace" },
      ],
    [
        ]);

    },
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


    MasterOriginalHeight = [250, 14.3, 85.8, 57.2, 42.900000000000006, 14.3, 14.3, 143, 50, 14.3, 57.2, 28.6, 14.3, 28.6, 42.900000000000006, 14.3, 14.3, 14.3, 143, 14.3, 14.3, 14.3, 14.3, 114.39999999999999, 128.70000000000002, 28.6, 42.900000000000006, 42.900000000000006, 85.80000000000001, 14.3, 14.3];
    MasterOriginalWidth = [250, 86, 86, 62, 172, 86, 86, 50, 80, 586, 300, 86, 150, 218, 27, 86, 10, 1375, 9, 86, 81, 34, 86, 12, 30, 67, 30, 169, 18, 86, 53];
    var testingIndex = 0;
    var testingAmount = 29;
    //ones basic For loop
    for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++){
    //HEIGHT
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height >= MasterOriginalHeight[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.height <= MasterOriginalHeight[testingIndex] + 100.5)
    //WIDTH
    test.assert(diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width >= MasterOriginalWidth[testingIndex] - 100.5 && diagram.findNodeForKey(testingIndex.toString()).findObject('TEXT').actualBounds.width <= MasterOriginalWidth[testingIndex] + 100.5)
  }
} // END TEST
));



intro.add(new Test('layout complete', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      test.layoutComplete = 0;
      d.addDiagramListener("LayoutCompleted", function(){
        // console.log("LayoutCompleted~~~", new Date().toLocaleString());
        test.layoutComplete++;
      });
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(test.layoutComplete === 1);
      d.layoutDiagram(true);
      test.assert(test.layoutComplete === 2);

    }, // END TEST
    null
));






















/*

intro.add(new Test('TESTNAME', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    }, // END TEST
    null
));

*/

})();