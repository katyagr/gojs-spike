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
var intro = new TestCollection('intro');
TestRoot.add(intro);
var $ = go.GraphObject.make;
var diagram = null;

var can = document.createElement('canvas');
var ctx = can.getContext('2d');
ctx.font = '13px sans-serif';

//console.log(ctx.measureText('A Text').width);
//console.log(ctx.measureText('Block').width);
//console.log(ctx.measureText('a Text Block').width);
/* Chrome
  38
  33
  73
*/

/* FireFox
  37
  33
  72
*/

/* IE
  38
  32
  72
*/

if (ctx.measureText('A Text').width === 38 &&
    ctx.measureText('Block').width === 33 &&
    ctx.measureText('a Text Block').width === 73) {
  window.text = 'Chrome';
} else if (ctx.measureText('A Text').width === 37 &&
          ctx.measureText('Block').width === 33 &&
          ctx.measureText('a Text Block').width === 72) {
  window.text = 'FF';
} else if (ctx.measureText('A Text').width === 38 &&
          ctx.measureText('Block').width === 32 &&
          ctx.measureText('a Text Block').width === 72) {
  window.text = 'IE';
} else {
  window.text = null; // none of the above
}


var t1 = new TestCollection('Textblocks');
intro.add(t1);

t1.add(new Test('Sizing and Clipping', diagram,
function (test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2 }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 100, height: 33 }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 60, height: 33 }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 50, height: 22 }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 40, height: 9 }) ));
},
null,
function (test) {
    var diagram = test.diagram;

var it = diagram.nodes; it.next(); n = it.value;
var elem = [];
var e = n.elements;
while (e.next()) elem.push(e.value);
window.elem = elem;

if (window.text === 'Chrome') {
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(15.5,2,73,14.3)))
  test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,100,33)));
  test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(22,57.3,60,33)));
  test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(27,94.3,50,22)));
  test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(32,120.3,40,9)));
} else if (window.text === 'FF') {
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(16,2,72,14.3)));
  test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,100,33)));
  test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(22,57.3,60,33)));
  test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(27,94.3,50,22)));
  test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(32,120.3,40,9)));
} else if (window.text === 'IE') {
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(16,2,72,14.3)));
  test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,100,33)));
  test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(22,57.3,60,33)));
  test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(27,94.3,50,22)));
  test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(32,120.3,40,9)));
} else {
  // welp
}

}
));

t1.add(new Test('Text Alignment', diagram,
function (test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 150, height: 20, textAlign: "left" }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 150, height: 20, textAlign: "center" }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 150, height: 20, textAlign: "right" }) ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

  if (window.text === 'Chrome') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,150,20)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,26,150,20)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(2,50,150,20)));
  } else if (window.text === 'FF') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,150,20)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,26,150,20)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(2,50,150,20)));
  } else if (window.text === 'IE') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,150,20)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,26,150,20)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(2,50,150,20)));
  } else {
    // welp
  }

}
));

t1.add(new Test('Wrapping', diagram,
function (test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 50, wrap: go.TextBlock.None }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 50, wrap: go.TextBlock.WrapDesiredSize }),
        $(go.TextBlock, { text: "a Text Block", background: "lightgreen", margin: 2,
                          width: 50, wrap: go.TextBlock.WrapFit }) ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);
  window.elem = elem;

  if (window.text === 'Chrome') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,50,14.3)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,50,28.6)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(9,52.900000000000006,36,28.6)))
  } else if (window.text === 'FF') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,50,14.3)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,50,28.6)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(9.5,52.900000000000006,35,28.6)));
  } else if (window.text === 'IE') {
    test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,50,14.3)));
    test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,50,28.6)));
    test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(9,52.900000000000006,36,28.6)));

  } else {
    // welp
  }

}
));

var t2 = new TestCollection('Shapes');
intro.add(t2);

t2.add(new Test('Shapes1', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node, "Horizontal",
      $(go.Shape, { figure: "Club", width: 30, height: 50 }),
      $(go.Shape, { figure: "Club", width: 30, height: 50,
                    fill: "green" }),
      $(go.Shape, { figure: "Club", width: 30, height: 50,
                    fill: "green", stroke: null }),
      $(go.Shape, { figure: "Club", width: 30, height: 50,
                    fill: null, stroke: "green" }),
      $(go.Shape, { figure: "Club", width: 30, height: 50,
                    fill: null, stroke: "green", strokeWidth: 3 }),
      $(go.Shape, { figure: "Club", width: 30, height: 50,
                    fill: null, stroke: "green", strokeWidth: 6 }) ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,2.5,31,51)));
  test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(31,2.5,31,51)));
  test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(62,2.5,31,51)));
  test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(93,2.5,31,51)));
  test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(124,1.5,33,53)));
  test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(157,0,36,56)));
}
));


t2.add(new Test('Shapes2', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node, "Horizontal",
      $(go.Shape, { figure: "Club", fill: "green", width: 40, height: 40 }),
      $(go.Shape, { figure: "Club", fill: "green", width: 40, height: 40,
                    angle: 30 }),
      $(go.Shape, { figure: "Club", fill: "green", width: 40, height: 40,
                    scale: 1.5 }),
      $(go.Shape, { figure: "Club", fill: "green", width: 40, height: 40,
                    angle: 30, scale: 1.5 }) ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,21.50528116637149,41,41)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(41,14.001760388790498,56.00704155516198,56.00704155516198)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(97.00704155516198,11.25528116637149,61.5,61.5)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(158.50704155516198,0,84.01056233274298,84.01056233274298)));
}
));

go.Shape.defineFigureGenerator("W", function(shape, w, h) {
  return $(go.Geometry,
           $(go.PathFigure, { isFilled: false, startX: 0, startY: 0 },
             $(go.PathSegment, go.PathSegment.Line, { endX: w * 1 / 4, endY: h }),
             $(go.PathSegment, go.PathSegment.Line, { endX: w * 2 / 4, endY: h / 4 }),
             $(go.PathSegment, go.PathSegment.Line, { endX: w * 3 / 4, endY: h }),
             $(go.PathSegment, go.PathSegment.Line, { endX: w, endY: 0 })));
});

t2.add(new Test('Custom', diagram,
  function(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.add(
      $(go.Node,
        $(go.Shape, { figure: "W", stroke: "blue", strokeWidth: 2, width: 50, height: 60 })));
  },
  null,
  function(test) {
    var diagram = test.diagram;
    test.assert(diagram.nodes.count > 0, "should be a Node");
    var node = diagram.nodes.first();
    test.assert(node !== null && node.elt(0) instanceof go.Shape, "Node should contain a Shape");
    var geo = node.elt(0).geometry;
    test.assert(geo !== null && geo.bounds.equals(new go.Rect(0, 0, 50, 60)), "Geometry should be 50x60");
    test.assert(geo.figures.count === 1 && geo.figures.first().segments.count == 4, "Geometry should contain for segments");
  }
));

go.Shape.defineArrowheadGeometry("A", "F1 M0 0 L12 3 0 6 M4 1 L4 5");

t2.add(new Test('Arrowhead', diagram,
  function(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.linkTemplateMap.add("CustomA",
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: "A", stroke: "red", fill: "orange", scale: 2 })
      ));
    diagram.model.nodeDataArray = [{key: 1}, {key: 2}];
    diagram.model.linkDataArray = [{from: 1, to: 2, category: "CustomA" }];
  },
  null,
  function(test) {
    //??? how to test this
  }
));

var t3 = new TestCollection('Pictures');
intro.add(t3);

t3.add(new Test('Pictures1', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node, "Horizontal",
      $(go.Picture, { source: "images/50x40.png",
                      width: 50, height: 40 }),
      $(go.Picture, { source: "images/50x40.png",
                      width: 100, height: 80 }),
      $(go.Picture, { source: "images/100x80.png",
                      width: 50, height: 40 }),
      $(go.Picture, { source: "images/100x80.png",
                      width: 30, height: 60 }),
      $(go.Picture, { source: "images/100x80.png",
                      width: 30, height: 60, imageStretch: go.GraphObject.None }),
      $(go.Picture, { source: "images/100x80.png",
                      width: 30, height: 60, imageStretch: go.GraphObject.Uniform }),
      $(go.Picture, { source: "images/100x80.png",
                      width: 30, height: 60, imageStretch: go.GraphObject.UniformToFill })
      ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,20,50,40)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(50,0,100,80)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(150,20,50,40)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(200,10,30,60)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(230,10,30,60)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(260,10,30,60)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(290,10,30,60)));
}
));

t1.add(new Test('Textagain', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node, "Vertical",
      { position: new go.Point(0, 0), background: "lightgray" },
      $(go.TextBlock, { text: "a longer string", background: "lightgreen", margin: 2 }),
      $(go.TextBlock, { text: "left", background: "lightgreen", margin: 2, alignment: go.Spot.Left }),
      $(go.TextBlock, { text: "center", background: "lightgreen", margin: 2, alignment: go.Spot.Center }),
      $(go.TextBlock, { text: "right", background: "lightgreen", margin: 2, alignment: go.Spot.Right }),
      $(go.TextBlock, { text: "stretch", background: "lightgreen", margin: 2, stretch: go.GraphObject.Fill }) ));
  diagram.add(
    $(go.Node, "Vertical",
      { position: new go.Point(100, 0), width: 140, background: "lightgray" },
      $(go.TextBlock, { text: "a longer string", background: "lightgreen", margin: 2 }),
      $(go.TextBlock, { text: "left", background: "lightgreen", margin: 2, alignment: go.Spot.Left }),
      $(go.TextBlock, { text: "center", background: "lightgreen", margin: 2, alignment: go.Spot.Center }),
      $(go.TextBlock, { text: "right", background: "lightgreen", margin: 2, alignment: go.Spot.Right }),
      $(go.TextBlock, { text: "stretch", background: "lightgreen", margin: 2, stretch: go.GraphObject.Fill }) ));
  diagram.add(
    $(go.Node, "Vertical",
      { position: new go.Point(250, 0), width: 50, background: "lightgray" },
      $(go.TextBlock, { text: "a longer string", background: "lightgreen", margin: 2 }),
      $(go.TextBlock, { text: "left", background: "lightgreen", margin: 2, alignment: go.Spot.Left }),
      $(go.TextBlock, { text: "center", background: "lightgreen", margin: 2, alignment: go.Spot.Center }),
      $(go.TextBlock, { text: "right", background: "lightgreen", margin: 2, alignment: go.Spot.Right }),
      $(go.TextBlock, { text: "stretch", background: "lightgreen", margin: 2, stretch: go.GraphObject.Fill }) ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n;
  var it = diagram.nodes; it.next(); n = it.value;
var elem = [];
var e = n.elements;
while (e.next()) elem.push(e.value);
window.elem = elem;


if (window.text === 'Chrome') {
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(25,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(59,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,82,14.3)));

it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(29,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(52,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(113,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,136,14.3)));

it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(7.5,2,35,42.900000000000006)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,48.900000000000006,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(7,67.2,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(23,85.5,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,103.8,46,14.3)));
} else if (window.text === 'FF') {
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(25,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(59,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,82,14.3)));
it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(29,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(52,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(113,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,136,14.3)));
it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(7.5,2,35,42.900000000000006)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,48.900000000000006,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(7,67.2,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(23,85.5,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,103.8,46,14.3)));
} else if (window.text === 'IE') {
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(2,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(25,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(59,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,82,14.3)));
it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(29,2,82,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,20.3,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(52,38.6,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(113,56.900000000000006,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,75.2,136,14.3)));
it.next(); n = it.value; var elem = []; var e = n.elements; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(7,2,36,42.900000000000006)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(2,48.900000000000006,17,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(7,67.2,36,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(23,85.5,25,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(2,103.8,46,14.3)));
} else {
  // welp
}

}
));

t1.add(new Test('ensure wrap', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
 diagram.nodeTemplate =
    $(go.Node, "Table",
      { position: new go.Point(0, 0), background: "lightgray" },
      $(go.TextBlock, {
        row: 0, column: 0,
        name: 'txt',
        text: "Two Words", background: "lightgreen", stretch: go.GraphObject.Fill }),
      $(go.Shape, {
        row: 1, column: 0,
        width: 40, height: 20, fill: "lightgreen" })/*,
      $(go.Shape, {
        row: 0, column: 1,
        width: 20, height: 20, fill: "lightgreen" })*/
    );

  diagram.model.nodeDataArray = [
    { key: 1 }
  ];


},
null,
function (test) {
  var diagram = test.diagram;
  var n;
  var it = diagram.nodes; it.next(); n = it.value;
var elem = [];
var e = n.elements;
while (e.next()) elem.push(e.value);
window.elem = elem;
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;

diagram.startTransaction('a');
diagram.commitTransaction('a');
var n = diagram.findNodeForKey(1).findObject('txt');
test.assert(n.actualBounds.height > 20);
test.assert(n.actualBounds.width === 41);
diagram.startTransaction('a');
n.stretch = go.GraphObject.None;
diagram.commitTransaction('a');
test.assert(n.actualBounds.height < 20);
test.assert(n.actualBounds.width > 42);


}
));

var t4 = new TestCollection('Panels');
intro.add(t4);

t4.add(new Test('Auto1', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.Shape,
          { row: 0, column: 0, figure: "Rectangle", fill: "green",
            height: 14.3, width: 100, height: 20 }),
        $(go.TextBlock, { height: 14.3, width: 242, row: 0, column: 2, text: "desired: 100x20, no minSize, no maxSize" }),
        $(go.Shape,
          { row: 1, column: 0, figure: "Rectangle", fill: "red",
            height: 14.3, width: 100, height: 20,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { height: 14.3, width: 171, row: 1, column: 2, text: "desired: 100x20, min: 150x10" }),
        $(go.Shape,
          { row: 2, column: 0, figure: "Rectangle", fill: "yellow",
            height: 14.3, width: 100, height: 20,
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { height: 14.3, width: 175, row: 2, column: 2, text: "desired: 100x20, max: 50x200" }),
        $(go.Shape,
          { row: 3, column: 0, figure: "Rectangle", fill: "red",
            height: 14.3, width: 100, height: 20,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { height: 14.3, width: 254, row: 3, column: 2, text: "desired: 100x20, min: 150x10, max: 50x200" }),
        $(go.Shape,
          { row: 4, column: 0, figure: "Rectangle", fill: "red",
            height: 14.3, width: 100, height: 20, stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { height: 14.3, width: 225, row: 4, column: 2, text: "desired, min, max & ignore stretch: Fill" }),
        $(go.Shape,
          { row: 5, column: 0, figure: "Rectangle", fill: "green",
            stretch: go.GraphObject.Fill }),
        $(go.TextBlock, { height: 14.3, width: 215, row: 5, column: 2, text: "stretch: Fill, no minSize, no maxSize" }),
        $(go.Shape,
          { row: 6, column: 0, figure: "Rectangle", fill: "red",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { height: 14.3, width: 144, row: 6, column: 2, text: "stretch: Fill, min: 150x10" }),
        $(go.Shape,
          { row: 7, column: 0, figure: "Rectangle", fill: "yellow",
            stretch: go.GraphObject.Fill, name: "14",
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { height: 14.3, width: 148, row: 7, column: 2, text: "stretch: Fill, max: 50x200" }),
        $(go.Shape,
          { row: 8, column: 0, figure: "Rectangle", fill: "red",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { height: 14.3, width: 227, row: 8, column: 2, text: "stretch: Fill, min: 150x10, max: 50x200" })
        )));

},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);


  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,162.20000000000002)));
var e = elem[0].elements; var elem = []; while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new  go.Rect(0,0,101,21)), '[0]expected: 0,0,101,21, got: ' + elem[0].actualBounds.toString());
test.assert(test.isApproxRect(elem[1].actualBounds, new  go.Rect(215,3.3499999999999996,242,14.3)), '[1]expected: 215,3.3499999999999996,242,14.3, got: ' + elem[1].actualBounds.toString());
test.assert(test.isApproxRect(elem[2].actualBounds, new  go.Rect(0,21,151,21)), '[2]expected: 0,21,151,21, got: ' + elem[2].actualBounds.toString());
test.assert(test.isApproxRect(elem[3].actualBounds, new  go.Rect(215,24.35,171,14.3)), '[3]expected: 215,24.35,171,14.3, got: ' + elem[3].actualBounds.toString());
test.assert(test.isApproxRect(elem[4].actualBounds, new  go.Rect(0,42,50,21)), '[4]expected: 0,42,50,21, got: ' + elem[4].actualBounds.toString());
test.assert(test.isApproxRect(elem[5].actualBounds, new  go.Rect(215,45.35,175,14.3)), '[5]expected: 215,45.35,175,14.3, got: ' + elem[5].actualBounds.toString());
test.assert(test.isApproxRect(elem[6].actualBounds, new  go.Rect(0,63,150,21)), '[6]expected: 0,63,150,21, got: ' + elem[6].actualBounds.toString());
test.assert(test.isApproxRect(elem[7].actualBounds, new  go.Rect(215,66.35,254,14.3)), '[7]expected: 215,66.35,254,14.3, got: ' + elem[7].actualBounds.toString());
test.assert(test.isApproxRect(elem[8].actualBounds, new  go.Rect(0,84,150,21)), '[8]expected: 0,84,150,21, got: ' + elem[8].actualBounds.toString());
test.assert(test.isApproxRect(elem[9].actualBounds, new  go.Rect(215,87.35,225,14.3)), '[9]expected: 215,87.35,225,14.3, got: ' + elem[9].actualBounds.toString());
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,105,200,14.3)), '[10]expected: 0,105,200,14.3, got: ' + elem[10].actualBounds.toString());
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,105,215,14.3)), '[11]expected: 215,105,215,14.3, got: ' + elem[11].actualBounds.toString());
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,119.3,200,14.3)), '[12]expected: 0,119.3,200,14.3, got: ' + elem[12].actualBounds.toString());
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,119.3,144,14.3)), '[13]expected: 215,119.3,144,14.3, got: ' + elem[13].actualBounds.toString());
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,133.6,50,14.3)), '[14]expected: 0,133.6,50,14.3, got: ' + elem[14].actualBounds.toString());
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,133.6,148,14.3)), '[15]expected: 215,133.6,148,14.3, got: ' + elem[15].actualBounds.toString());
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,147.9,150,14.3)), '[16]expected: 0,147.9,150,14.3, got: ' + elem[16].actualBounds.toString());
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(215,147.9,227,14.3)), '[17]expected: 215,147.9,227,14.3, got: ' + elem[17].actualBounds.toString());


}

));

t4.add(new Test('Auto2', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.TextBlock,
          { row: 0, column: 0, text: "Text Block", background: "green",
            width: 100, height: 20 }),
        $(go.TextBlock, { width: 242, row: 0, column: 2, text: "desired: 100x20, no minSize, no maxSize" }),
        $(go.TextBlock,
          { row: 1, column: 0, text: "Text Block", background: "red",
            width: 100, height: 20,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { width: 171, row: 1, column: 2, text: "desired: 100x20, min: 150x10" }),
        $(go.TextBlock,
          { row: 2, column: 0, text: "Text Block", background: "yellow",
            width: 100, height: 20,
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { width: 175, row: 2, column: 2, text: "desired: 100x20, max: 50x200" }),
        $(go.TextBlock,
          { row: 3, column: 0, text: "Text Block", background: "red",
            width: 100, height: 20,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { width: 254, row: 3, column: 2, text: "desired: 100x20, min: 150x10, max: 50x200" }),
        $(go.TextBlock,
          { row: 4, column: 0, text: "Text Block", background: "red",
            width: 100, height: 20, stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { width: 225, row: 4, column: 2, text: "desired, min, max & ignore stretch: Fill" }),
        $(go.TextBlock,
          { row: 5, column: 0, text: "Text Block", background: "green",
            stretch: go.GraphObject.Fill }),
        $(go.TextBlock, { width: 215, row: 5, column: 2, text: "stretch: Fill, no minSize, no maxSize" }),
        $(go.TextBlock,
          { row: 6, column: 0, text: "Text Block", background: "red",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { width: 144, row: 6, column: 2, text: "stretch: Fill, min: 150x10" }),
        $(go.TextBlock,
          { row: 7, column: 0, text: "Text Block", background: "yellow",
            stretch: go.GraphObject.Fill,
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { width: 148, row: 7, column: 2, text: "stretch: Fill, max: 50x200", stretch: go.GraphObject.Fill }),
        $(go.TextBlock,
          { row: 8, column: 0, text: "Text Block", background: "red",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { width: 227, row: 8, column: 2, text: "stretch: Fill, min: 150x10, max: 50x200" })
        )));

},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);
if (window.text === null) return;


test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,171.5)));
  var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);

test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,242,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,175,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,254,14.3)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,80,150,20)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(215,82.85,225,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,100,200,14.3)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,100,215,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,114.3,200,14.3)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,114.3,144,14.3)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,128.6,50,28.6)));
//test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,135.75,148,14.3)));
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,157.2,150,14.3)));
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(215,157.2,227,14.3)));


}
));


t4.add(new Test('PicturePanel', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
       $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.Picture,
          { row: 0, column: 0, source: "images/100x20.png",
            width: 100, height: 20 }),
        $(go.TextBlock, { row: 0, column: 2, text: "desired: 100x20, no minSize, no maxSize" }),
        $(go.Picture,
          { row: 1, column: 0, source: "images/100x20.png",
            width: 100, height: 20,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { row: 1, column: 2, text: "desired: 100x20, min: 150x10" }),
        $(go.Picture,
          { row: 2, column: 0, source: "images/100x20.png",
            width: 100, height: 20,
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { row: 2, column: 2, text: "desired: 100x20, max: 50x200" }),
        $(go.Picture,
          { row: 3, column: 0, source: "images/100x20.png",
            width: 100, height: 20,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { row: 3, column: 2, text: "desired: 100x20, min: 150x10, max: 50x200" }),
        $(go.Picture,
          { row: 4, column: 0, source: "images/100x20.png",
            width: 100, height: 20, stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { row: 4, column: 2, text: "desired, min, max & ignore stretch: Fill" }),
        $(go.Picture,
          { row: 5, column: 0, source: "images/100x20.png",
            stretch: go.GraphObject.Fill }),
        $(go.TextBlock, { row: 5, column: 2, text: "stretch: Fill, no minSize, no maxSize" }),
        $(go.Picture,
          { row: 6, column: 0, source: "images/100x20.png",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10) }),
        $(go.TextBlock, { row: 6, column: 2, text: "stretch: Fill, min: 150x10" }),
        $(go.Picture,
          { row: 7, column: 0, source: "images/100x20.png",
            stretch: go.GraphObject.Fill,
            maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { row: 7, column: 2, text: "stretch: Fill, max: 50x200" }),
        $(go.Picture,
          { row: 8, column: 0, source: "images/100x20.png",
            stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) }),
        $(go.TextBlock, { row: 8, column: 2, text: "stretch: Fill, min: 150x10, max: 50x200" })
        )));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);





if (window.text === 'Chrome') {
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,157.20000000000002)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,242,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,175,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,254,14.3)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,80,150,20)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(215,82.85,225,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,100,200,14.3)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,100,215,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,114.3,200,14.3)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,114.3,144,14.3)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,128.6,50,14.3)));
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,128.6,148,14.3)));
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,142.9,150,14.3)));
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(215,142.9,227,14.3)));
} else if (window.text === 'FF') {
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,157.20000000000002)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,242,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,175,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,254,14.3)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,80,150,20)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(215,82.85,225,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,100,200,14.3)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,100,215,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,114.3,200,14.3)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,114.3,144,14.3)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,128.6,50,14.3)));
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,128.6,148,14.3)));
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,142.9,150,14.3)));
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(215,142.9,227,14.3)));
} else if (window.text === 'IE') {
  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,467,157.20000000000002)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,239,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,174,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,252,14.3)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,80,150,20)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(215,82.85,221,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,100,200,14.3)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,100,210,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,114.3,200,14.3)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,114.3,141,14.3)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,128.6,50,14.3)));
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,128.6,144,14.3)));
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,142.9,150,14.3)));
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(215,142.9,223,14.3)));
} else {
  // welp
}

}
));

t4.add(new Test('Sizing of Auto Panels', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.Panel, "Auto",
          { row: 0, column: 0, width: 100, height: 20, background: "#EEE" },
          $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 0, column: 2, width: 242, text: "desired: 100x20, no minSize, no maxSize" }),
        $(go.Panel, "Auto",
          { row: 1, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 1, column: 2, width: 171, text: "desired: 100x20, min: 150x10" }),
        $(go.Panel, "Auto",
          { row: 2, column: 0, width: 100, height: 20, background: "#EEE",
            maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "yellow" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 2, column: 2, width: 175, text: "desired: 100x20, max: 50x200" }),
        $(go.Panel, "Auto",
          { row: 3, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 3, column: 2, width: 254, text: "desired: 100x20, min: 150x10, max: 50x200" }),
        $(go.Panel, "Auto",
          { row: 4, column: 0, background: "#EEE", stretch: go.GraphObject.Fill },
          $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 4, column: 2, width: 215, text: "stretch: Fill, no minSize, no maxSize" }),
        $(go.Panel, "Auto",
          { row: 5, column: 0, background: "#EEE", stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 5, column: 2, width: 144, text: "stretch: Fill, min: 150x10" }),
        $(go.Panel, "Auto",
          { row: 6, column: 0, background: "#EEE", stretch: go.GraphObject.Fill,
            maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "yellow" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 6, column: 2, width: 148, text: "stretch: Fill, max: 50x200" }),
        $(go.Panel, "Auto",
          { row: 7, column: 0, background: "#EEE", stretch: go.GraphObject.Fill,
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel", width: 64 })),
        $(go.TextBlock, { row: 7, column: 2, width: 227, text: "stretch: Fill, min: 150x10, max: 50x200" })
        )));



},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);
if (window.text === null) return;



test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,137.2)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);

test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,242,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,175,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,254,14.3)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,80,200,14.3)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(215,80,215,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(0,94.3,200,14.3)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(215,94.3,144,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,108.6,50,14.3)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(215,108.6,148,14.3)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(0,122.89999999999999,150,14.3)));
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(215,122.89999999999999,227,14.3)));


}
));



t4.add(new Test('Spot1', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.Panel, "Spot",
          { row: 0, column: 0, width: 100, height: 20, background: "#EEE" },
          $(go.Shape, { figure: "Diamond", fill: "green" }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 242, row: 0, column: 2, text: "desired: 100x20, no minSize, no maxSize" }),
        $(go.Panel, "Spot",
          { row: 1, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10) },
          $(go.Shape, { figure: "Diamond", fill: "red" }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 171, row: 1, column: 2, text: "desired: 100x20, min: 150x10" }),
        $(go.Panel, "Spot",
          { row: 2, column: 0, width: 100, height: 20, background: "#EEE",
            maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "Diamond", fill: "yellow" }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 175, row: 2, column: 2, text: "desired: 100x20, max: 50x200" }),
        $(go.Panel, "Spot",
          { row: 3, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "Diamond", fill: "red" }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 254, row: 3, column: 2, text: "desired: 100x20, min: 150x10, max: 50x200" })
        )));

},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);


test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,469,80)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,242,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,171,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,175,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,254,14.3)));


}
));




t4.add(new Test('SpotNone', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
     $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 200 }),
        $(go.RowColumnDefinition, { column: 1, width: 15 }),
        $(go.Panel, "Spot",
          { row: 0, column: 0, width: 100, height: 20, background: "#EEE" },
          $(go.Shape, { figure: "Diamond", fill: "green", stretch: go.GraphObject.None }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, {  height: 14.3,width: 280, row: 0, column: 2, text: "None; desired: 100x20, no minSize, no maxSize" }),
        $(go.Panel, "Spot",
          { row: 1, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10) },
          $(go.Shape, { figure: "Diamond", fill: "red", stretch: go.GraphObject.None }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 209, row: 1, column: 2, text: "None; desired: 100x20, min: 150x10" }),
        $(go.Panel, "Spot",
          { row: 2, column: 0, width: 100, height: 20, background: "#EEE",
            maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "Diamond", fill: "yellow", stretch: go.GraphObject.None }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3,width: 213, row: 2, column: 2, text: "None; desired: 100x20, max: 50x200" }),
        $(go.Panel, "Spot",
          { row: 3, column: 0, width: 100, height: 20, background: "#EEE",
            minSize: new go.Size(150, 10), maxSize: new go.Size(50, 200) },
          $(go.Shape, { figure: "Diamond", fill: "red", stretch: go.GraphObject.None }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Left }),
          $(go.Shape, { figure: "Ellipse", fill: null, width: 10, height: 10, alignment: go.Spot.Right})),
        $(go.TextBlock, { height: 14.3, width: 292, row: 3, column: 2, text: "None; desired: 100x20, min: 150x10, max: 50x200" })
        )));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);


  test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,507,80)));
var e = elem[0].elements;var elem = [];while (e.next()) elem.push(e.value);
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,100,20)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(215,2.8499999999999996,280,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(0,20,150,20)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(215,22.85,209,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,40,50,20)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(215,42.85,213,14.3)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(0,60,150,20)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(215,62.85,292,14.3)));


}
));



t4.add(new Test('TableColumnSizing', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Left },
        $(go.RowColumnDefinition, { column: 0, width: 100 }),
        $(go.RowColumnDefinition, { column: 1, width: 100, minimum: 150 }),
        $(go.RowColumnDefinition, { column: 2, width: 100, maximum: 50 }),
        $(go.RowColumnDefinition, { column: 3, width: 100, minimum: 150, maximum: 50 }),
        $(go.TextBlock,
          { row: 0, column: 0, text: "Text Block", background: "green" }),
        $(go.TextBlock,
          { row: 0, column: 1, text: "Text Block", background: "red" }),
        $(go.TextBlock,
          { row: 0, column: 2, text: "Text Block", background: "yellow" }),
        $(go.TextBlock,
          { row: 0, column: 3, text: "Text Block", background: "red" }),
        $(go.Panel, "Auto",
          { row: 1, column: 0, background: "#EEE" },
          $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 1, column: 1, background: "#EEE" },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 1, column: 2, background: "#EEE" },
          $(go.Shape, { figure: "RoundedRectangle", fill: "yellow" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 1, column: 3, background: "#EEE" },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        // elem[8]:
        $(go.TextBlock,
          { row: 2, column: 0, text: "Text Block", background: "green", stretch: go.GraphObject.Horizontal }),
        $(go.TextBlock,
          { row: 2, column: 1, text: "Text Block", background: "red", stretch: go.GraphObject.Horizontal }),
        $(go.TextBlock,
          { row: 2, column: 2, text: "Text Block", background: "yellow", stretch: go.GraphObject.Horizontal }),
        $(go.TextBlock,
          { row: 2, column: 3, text: "Text Block", background: "red", stretch: go.GraphObject.Horizontal }),

        $(go.Panel, "Auto",
          { row: 3, column: 0, background: "#EEE", stretch: go.GraphObject.Horizontal },
          $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 3, column: 1, background: "#EEE", stretch: go.GraphObject.Horizontal },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 3, column: 2, background: "#EEE", stretch: go.GraphObject.Horizontal },
          $(go.Shape, { figure: "RoundedRectangle", fill: "yellow" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.Panel, "Auto",
          { row: 3, column: 3, background: "#EEE", stretch: go.GraphObject.Horizontal },
          $(go.Shape, { figure: "RoundedRectangle", fill: "red" }),
          $(go.TextBlock, { text: "Auto Panel" })),
        $(go.TextBlock, { row: 4, column: 0, text: "width: 100" }),
        $(go.TextBlock, { row: 4, column: 1, text: "min: 150" }),
        $(go.TextBlock, { row: 4, column: 2, text: "max: 50" }),
        $(go.TextBlock, { row: 4, column: 3, text: "min & max" })
        )));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

if (window.text === null) return;

test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,450,113.14569499661586)));
  var e = elem[0].elements;
  var elem = [];
  while (e.next()) elem.push(e.value);


if (window.text === 'Chrome') {
test.assert(test.isApproxRect(elem[0].actualBounds, new go.Rect(0,0,62,14.3)));
test.assert(test.isApproxRect(elem[1].actualBounds, new go.Rect(100,0,62,14.3)));
test.assert(test.isApproxRect(elem[2].actualBounds, new go.Rect(250,0,62,14.3)));
test.assert(test.isApproxRect(elem[3].actualBounds, new go.Rect(300,0,62,14.3)));
test.assert(test.isApproxRect(elem[4].actualBounds, new go.Rect(0,14.3,70.52284749830794,20.822847498307937)));
test.assert(test.isApproxRect(elem[5].actualBounds, new go.Rect(100,14.3,70.52284749830794,20.822847498307937)));
test.assert(test.isApproxRect(elem[6].actualBounds, new go.Rect(250,14.3,70.52284749830794,20.822847498307937)));
test.assert(test.isApproxRect(elem[7].actualBounds, new go.Rect(300,14.3,70.52284749830794,20.822847498307937)));
test.assert(test.isApproxRect(elem[8].actualBounds, new go.Rect(0,42.27284749830793,100,14.3)));
test.assert(test.isApproxRect(elem[9].actualBounds, new go.Rect(100,42.27284749830793,150,14.3)));
test.assert(test.isApproxRect(elem[10].actualBounds, new go.Rect(250,35.122847498307934,50,28.6)));
test.assert(test.isApproxRect(elem[11].actualBounds, new go.Rect(300,42.27284749830793,150,14.3)));
test.assert(test.isApproxRect(elem[12].actualBounds, new go.Rect(0,70.87284749830793,100,20.822847498307937)));
test.assert(test.isApproxRect(elem[13].actualBounds, new go.Rect(100,70.87284749830793,150,20.822847498307937)));
test.assert(test.isApproxRect(elem[14].actualBounds, new go.Rect(250,63.722847498307935,50,35.122847498307934)));
test.assert(test.isApproxRect(elem[15].actualBounds, new go.Rect(300,70.87284749830793,150,20.822847498307937)));
test.assert(test.isApproxRect(elem[16].actualBounds, new go.Rect(0,98.84569499661586,59,14.3)));
test.assert(test.isApproxRect(elem[17].actualBounds, new go.Rect(100,98.84569499661586,50,14.3)));
test.assert(test.isApproxRect(elem[18].actualBounds, new go.Rect(250,98.84569499661586,47,14.3)));
test.assert(test.isApproxRect(elem[19].actualBounds, new go.Rect(300,98.84569499661586,63,14.3)));
}




}
));




t4.add(new Test('Nested Auto', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node,
      $(go.Panel, "Table",
        { defaultAlignment: go.Spot.Center },
        $(go.Panel, "Auto",
          { row: 0, column: 0 },
          $(go.Shape, { figure: "RoundedRectangle", fill: "orange" }),
          $(go.Panel, "Auto",
            $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
            $(go.Panel, "Auto",
              $(go.Shape, { figure: "RoundedRectangle", fill: "purple" }),
              $(go.TextBlock, { text: "Auto Panel" })))),
        $(go.TextBlock, { row: 1, column: 0, text: "auto" }),
        $(go.Panel, "Auto",
          { row: 0, column: 1, width: 100 },
          $(go.Shape, { figure: "RoundedRectangle", fill: "orange" }),
          $(go.Panel, "Auto",
            $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
            $(go.Panel, "Auto",
              $(go.Shape, { figure: "RoundedRectangle", fill: "purple" }),
              $(go.TextBlock, { text: "Auto Panel" })))),
        $(go.TextBlock, { row: 1, column: 1, text: "des 100" }),
        $(go.Panel, "Auto",
          { row: 0, column: 2, minSize: new go.Size(150, NaN) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "orange" }),
          $(go.Panel, "Auto",
            $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
            $(go.Panel, "Auto",
              $(go.Shape, { figure: "RoundedRectangle", fill: "purple" }),
              $(go.TextBlock, { text: "Auto Panel" })))),
        $(go.TextBlock, { row: 1, column: 2, text: "min 150" }),
        $(go.Panel, "Auto",
          { row: 0, column: 3, maxSize: new go.Size(50, NaN) },
          $(go.Shape, { figure: "RoundedRectangle", fill: "orange" }),
          $(go.Panel, "Auto",
            $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
            $(go.Panel, "Auto",
              $(go.Shape, { figure: "RoundedRectangle", fill: "purple" }),
              $(go.TextBlock, { text: "Auto Panel" })))),
        $(go.TextBlock, { row: 1, column: 3, text: "max 50" }),
        $(go.Panel, "Auto",
          { row: 0, column: 4, width: 100 },
          $(go.Shape, { figure: "RoundedRectangle", fill: "orange" }),
          $(go.Panel, "Auto",
            { maxSize: new go.Size(50, NaN) },
            $(go.Shape, { figure: "RoundedRectangle", fill: "green" }),
            $(go.Panel, "Auto",
              { minSize: new go.Size(150, NaN) },
              $(go.Shape, { figure: "RoundedRectangle", fill: "purple" }),
              $(go.TextBlock, { text: "Auto Panel" })))),
        $(go.TextBlock, { row: 1, column: 4, text: "all" })
        )));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

var masterList = [];
var c = 0;
function recurse(item){
  var e = item.elements;
  var elem = [];
  while (e.next()) elem.push(e.value);

  for (var i = 0; i < elem.length; i++) {
    masterList.push(elem[i].actualBounds);
    c++; // ha ha.
    if (elem[i] instanceof go.Panel) recurse(elem[i]);
  }
}
recurse(n);
if (window.text === null) return;
test.assert(masterList[0].equals(new go.Rect(0,0,483.5685424949238,48.16854249492381)));
test.assert(masterList[1].equals(new go.Rect(0,0,83.56854249492382,33.86854249492381)));
test.assert(masterList[2].equals(new go.Rect(0,0,83.56854249492382,33.86854249492381)));
test.assert(masterList[3].equals(new go.Rect(3.261423749153975,3.261423749153966,77.04569499661588,27.345694996615872)));
test.assert(masterList[4].equals(new go.Rect(0,0,77.04569499661588,27.345694996615872)));
test.assert(masterList[5].equals(new go.Rect(3.261423749153975,3.261423749153968,70.52284749830794,20.822847498307937)));
test.assert(masterList[6].equals(new go.Rect(0,0,70.52284749830794,20.822847498307937)));
test.assert(masterList[7].equals(new go.Rect(3.261423749153975,3.261423749153967,64,14.3)));
test.assert(masterList[8].equals(new go.Rect(29.28427124746191,33.86854249492381,25,14.3)));
test.assert(masterList[9].equals(new go.Rect(83.56854249492382,0,100,33.86854249492381)));
test.assert(masterList[10].equals(new go.Rect(0,0,100,33.86854249492381)));
test.assert(masterList[11].equals(new go.Rect(11.477152501692066,3.261423749153966,77.04569499661588,27.345694996615872)));
test.assert(masterList[12].equals(new go.Rect(0,0,77.04569499661588,27.345694996615872)));
test.assert(masterList[13].equals(new go.Rect(3.261423749153975,3.261423749153968,70.52284749830794,20.822847498307937)));
test.assert(masterList[14].equals(new go.Rect(0,0,70.52284749830794,20.822847498307937)));
test.assert(masterList[15].equals(new go.Rect(3.261423749153975,3.261423749153967,64,14.3)));
test.assert(masterList[16].equals(new go.Rect(110.56854249492382,33.86854249492381,46,14.3)));
test.assert(masterList[17].equals(new go.Rect(183.5685424949238,0,150,33.86854249492381)));
test.assert(masterList[18].equals(new go.Rect(0,0,150,33.86854249492381)));
test.assert(masterList[19].equals(new go.Rect(36.47715250169205,3.261423749153966,77.04569499661588,27.345694996615872)));
test.assert(masterList[20].equals(new go.Rect(0,0,77.04569499661588,27.345694996615872)));
test.assert(masterList[21].equals(new go.Rect(3.261423749153975,3.261423749153968,70.52284749830794,20.822847498307937)));
test.assert(masterList[22].equals(new go.Rect(0,0,70.52284749830794,20.822847498307937)));
test.assert(masterList[23].equals(new go.Rect(3.261423749153975,3.261423749153967,64,14.3)));
test.assert(masterList[24].equals(new go.Rect(235.5685424949238,33.86854249492381,46,14.3)));
test.assert(masterList[25].equals(new go.Rect(333.5685424949238,0,50,33.86854249492381)));
test.assert(masterList[26].equals(new go.Rect(0,0,50,33.86854249492381)));
test.assert(masterList[27].equals(new go.Rect(-13.522847498307941,3.261423749153966,77.04569499661588,27.345694996615872)));
test.assert(masterList[28].equals(new go.Rect(0,0,77.04569499661588,27.345694996615872)));
test.assert(masterList[29].equals(new go.Rect(3.261423749153975,3.261423749153968,70.52284749830794,20.822847498307937)));
test.assert(masterList[30].equals(new go.Rect(0,0,70.52284749830794,20.822847498307937)));
test.assert(masterList[31].equals(new go.Rect(3.261423749153975,3.261423749153967,64,14.3)));
test.assert(masterList[32].equals(new go.Rect(337.0685424949238,33.86854249492381,43,14.3)));
test.assert(masterList[33].equals(new go.Rect(383.5685424949238,0,100,33.86854249492381)));
test.assert(masterList[34].equals(new go.Rect(0,0,100,33.86854249492381)));
test.assert(masterList[35].equals(new go.Rect(25.000000000000007,3.261423749153966,50,27.345694996615872)));
test.assert(masterList[36].equals(new go.Rect(0,0,50,27.345694996615872)));
test.assert(masterList[37].equals(new go.Rect(-50,3.261423749153968,150,20.822847498307937)));
test.assert(masterList[38].equals(new go.Rect(0,0,150,20.822847498307937)));
test.assert(masterList[39].equals(new go.Rect(42.99999999999999,3.261423749153967,64,14.3)));
test.assert(masterList[40].equals(new go.Rect(427.0685424949238,33.86854249492381,13,14.3)));
}
));

t4.add(new Test('Nested Table', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
    $(go.Node, "Table",
      { resizable: true },
      $(go.TextBlock, { row: 0, text: "Part" }),
      $(go.Panel, "Table",
        { row: 1, margin: 5, background: "pink" },
        $(go.TextBlock, { row: 0, text: "outer" }),
        $(go.Panel, "Table",
          { row: 1, margin: 5, background: "orange" },
          $(go.TextBlock, { row: 0, text: "middle" }),
          $(go.Panel, "Table",
            { row: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 }))),
          $(go.Panel, "Table",
            { row: 0, column: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 })))
          ),
        $(go.Panel, "Table",
          { row: 0, column: 1, margin: 5, background: "orange" },
          $(go.TextBlock, { row: 0, text: "middle" }),
          $(go.Panel, "Table",
            { row: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 }))),
          $(go.Panel, "Table",
            { row: 0, column: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 })))
          )
        ),
      $(go.Panel, "Table",
        { row: 0, column: 1, margin: 5, background: "pink" },
        { width: 250, height: 150 },
        $(go.TextBlock, { row: 0, text: "outer" }),
        $(go.Panel, "Table",
          { row: 1, margin: 5, background: "orange" },
          $(go.TextBlock, { row: 0, text: "middle" }),
          $(go.Panel, "Table",
            { row: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 }))),
          $(go.Panel, "Table",
            { row: 0, column: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", stretch: go.GraphObject.Fill })))
          ),
        $(go.Panel, "Table",
          { row: 0, column: 1, margin: 5, background: "orange" },
          $(go.TextBlock, { row: 0, text: "middle" }),
          $(go.Panel, "Table",
            { row: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 }))),
          $(go.Panel, "Table",
            { row: 0, column: 1, margin: 5, background: "yellow" },
            $(go.TextBlock, { row: 0, text: "inner" }),
            $(go.Panel, "Table",
              { row: 1, margin: 5, background: "lightgreen" },
              $(go.Shape, { row: 0, figure: "triangle", width: 10, height: 10 })))
          )
        )
      ));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);

if (window.text === 'Chrome') {
var masterList = [];
var c = 0;
function recurse(item){
  var e = item.elements;
  var elem = [];
  while (e.next()) elem.push(e.value);

  for (var i = 0; i < elem.length; i++) {
    masterList.push(elem[i].actualBounds);
    c++; // ha ha.
    if (elem[i] instanceof go.Panel) recurse(elem[i]);
  }
}
recurse(n);
test.assert(masterList[0].equals(new go.Rect(79,72.85,24,14.3)));
test.assert(masterList[1].equals(new go.Rect(5,165,172,201.2)));
test.assert(masterList[2].equals(new go.Rect(28.5,43.15,29,14.3)));
test.assert(masterList[3].equals(new go.Rect(5,105.6,76,90.6)));
test.assert(masterList[4].equals(new go.Rect(0,15.499999999999998,38,14.3)));
test.assert(masterList[5].equals(new go.Rect(5,50.3,28,35.3)));
test.assert(masterList[6].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[7].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[8].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[9].equals(new go.Rect(43,5,28,35.3)));
test.assert(masterList[10].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[11].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[12].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[13].equals(new go.Rect(91,5,76,90.6)));
test.assert(masterList[14].equals(new go.Rect(0,15.499999999999998,38,14.3)));
test.assert(masterList[15].equals(new go.Rect(5,50.3,28,35.3)));
test.assert(masterList[16].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[17].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[18].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[19].equals(new go.Rect(43,5,28,35.3)));
test.assert(masterList[20].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[21].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[22].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[23].equals(new go.Rect(187,5,250,150)));
test.assert(masterList[24].equals(new go.Rect(67.5,43.15,29,14.3)));
test.assert(masterList[25].equals(new go.Rect(2.5,34.99999999999997,159,180.60000000000002)));
test.assert(masterList[26].equals(new go.Rect(0,60.50000000000001,38,14.3)));
test.assert(masterList[27].equals(new go.Rect(5,140.3,28,35.3)));
test.assert(masterList[28].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[29].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[30].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[31].equals(new go.Rect(43,5,111,125.3)));
test.assert(masterList[32].equals(new go.Rect(41.5,0,28,14.3)));
test.assert(masterList[33].equals(new go.Rect(5,19.3,101,101)));
test.assert(masterList[34].equals(new go.Rect(0,0,101,101)));
test.assert(masterList[35].equals(new go.Rect(169,5,76,90.6)));
test.assert(masterList[36].equals(new go.Rect(0,15.499999999999998,38,14.3)));
test.assert(masterList[37].equals(new go.Rect(5,50.3,28,35.3)));
test.assert(masterList[38].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[39].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[40].equals(new go.Rect(0,0,11,11)));
test.assert(masterList[41].equals(new go.Rect(43,5,28,35.3)));
test.assert(masterList[42].equals(new go.Rect(0,0,28,14.3)));
test.assert(masterList[43].equals(new go.Rect(8.5,19.3,11,11)));
test.assert(masterList[44].equals(new go.Rect(0,0,11,11)));
}
}
));

t4.add(new Test('Auto with minSize shape', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.add(
          $(go.Node, "Auto",
        $(go.Shape,
          { figure: "RoundedRectangle", minSize: new go.Size(200,200) } )));
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
test.assert(n.actualBounds.width === 201)
test.assert(n.actualBounds.height === 201)
}
));


/*

t4.add(new Test('Auto1', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  ...
},
null,
function (test) {
  var diagram = test.diagram;
  var n = diagram.nodes; n.next(); n = n.value;
  var elem = [];
  var e = n.elements;
  while (e.next()) elem.push(e.value);


  var e = elem[0].elements;
  var elem = [];
  while (e.next()) elem.push(e.value);

}
));

*/

var t5 = new TestCollection('Routes');
intro.add(t5);

t5.add(new Test('Straight', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,       // the whole link panel
      $(go.Shape));  // the link shape, default black stroke

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(48.7, 27.7), new go.Point(100.3, 54.4)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0L51.6 26.6"
  ]);
}
));

t5.add(new Test('Routings', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("routing", "routing"),
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "50 50" },
    { key: "Gamma", size: new go.Size(62.52284749830794,30.822847498307937), loc: "100 25" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta", routing: go.Routing.Normal },
    { from: "Alpha", to: "Gamma", routing: go.Routing.Orthogonal }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(39.1, 30.7), new go.Point(57.4, 50.1)],
    [new go.Point(49.5, 15.4), new go.Point(59.5, 15.4), new go.Point(74.8, 15.4), new go.Point(74.8, 40.4), new go.Point(90.0, 40.4), new go.Point(100.0, 40.4)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0L18.3 19.4",
    "M0.0 0.0 L25.2 0.0 L25.2 25.0 L50.5 25.0"
  ]);
}
));

t5.add(new Test('AvoidsNodes', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.AvoidsNodes },  // link route should avoid nodes
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "250 40" },
    { key: "Gamma", size: new go.Size(62.52284749830794,30.822847498307937), loc: "100 0" },
    { key: "Delta", size: new go.Size(46.52284749830794,30.822847498307937), loc: "75 50" },
    { key: "Epsilon", size: new go.Size(59.52284749830794,30.822847498307937), loc: "150 30" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(49.5, 15.4), new go.Point(59.5, 15.4), new go.Point(60.0, 15.4), new go.Point(60.0, 44.0), new go.Point(132.0, 44.0), new go.Point(132.0, 68.0), new go.Point(220.0, 68.0), new go.Point(220.0, 55.4), new go.Point(240.0, 55.4), new go.Point(250.0, 55.4)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0 L10.5 0.0 L10.5 28.6 L82.5 28.6 L82.5 52.6 L170.5 52.6 L170.5 40.0 L200.5 40.0"
  ]);
}
));

t5.add(new Test('BezierCurve', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { curve: go.Link.Bezier },  // Bezier curve
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(49.5, 19.0), new go.Point(73.2, 22.4), new go.Point(90.4, 31.2), new go.Point(107.7, 50.1)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0 C23.7 3.4 40.9 12.3 58.2 31.2"
  ]);
}
));

t5.add(new Test('MultipleBezierCurves', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { curve: go.Link.Bezier },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // multiple links between the same nodes
    { from: "Alpha", to: "Beta" },
    { from: "Alpha", to: "Beta" },
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(49.5, 16.6), new go.Point(75.7, 17.9), new go.Point(92.7, 26.8), new go.Point(110.2, 50.1)],
    [new go.Point(49.5, 23.8), new go.Point(69.0, 30.3), new go.Point(86.3, 39.3), new go.Point(102.6, 51.2)],
    [new go.Point(45.4, 30.3), new go.Point(62.7, 42.8), new go.Point(79.9, 51.7), new go.Point(100.0, 58.3)],
    [new go.Point(36.8, 30.7), new go.Point(56.2, 55.3), new go.Point(73.5, 64.1), new go.Point(100.0, 64.8)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0 C26.0 1.3 43.2 10.2 60.7 33.5",
    "M0.0 0.0 C19.6 6.6 36.8 15.5 53.1 27.5",
    "M0.0 0.0 C17.3 12.5 34.5 21.4 54.6 27.9",
    "M0.0 0.0 C19.4 24.6 36.6 33.4 63.1 34.1"
  ]);
}
));

t5.add(new Test('MultipleStraights', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // multiple links between the same nodes
    {from: "Alpha", to: "Beta" },
    { from: "Alpha", to: "Beta" },
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(48.7, 27.7), new go.Point(84.2, 22.4), new go.Point(100.3, 54.4)],
    [new go.Point(48.7, 27.7), new go.Point(77.7, 34.8), new go.Point(100.3, 54.4)],
    [new go.Point(48.7, 27.7), new go.Point(71.2, 47.2), new go.Point(100.3, 54.4)],
    [new go.Point(48.7, 27.7), new go.Point(64.8, 59.7), new go.Point(100.3, 54.4)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 5.4 L35.4 0.0 L51.6 32.0",
    "M0.0 0.0 L29.0 7.1 L51.6 26.6",
    "M0.0 0.0 L22.6 19.5 L51.6 26.6",
    "M0.0 0.0 L16.2 32.0 L51.6 26.6"
  ]);
}
));

t5.add(new Test('RoundedCorners', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.AvoidsNodes,
        corner: 10 },                  // rounded corners
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "250 40" },
    { key: "Gamma", size: new go.Size(62.52284749830794,30.822847498307937), loc: "100 0" },
    { key: "Delta", size: new go.Size(46.52284749830794,30.822847498307937), loc: "75 50" },
    { key: "Epsilon", size: new go.Size(59.52284749830794,30.822847498307937), loc: "150 30" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(49.5, 15.4), new go.Point(59.5, 15.4), new go.Point(60.0, 15.4), new go.Point(60.0, 44.0), new go.Point(132.0, 44.0), new go.Point(132.0, 68.0), new go.Point(220.0, 68.0), new go.Point(220.0, 55.4), new go.Point(240.0, 55.4), new go.Point(250.0, 55.4)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0 L5.2 0.0 Q10.5 0.0 10.5 5.2 L10.5 18.6 Q10.5 28.6 20.5 28.6 L72.5 28.6 Q82.5 28.6 82.5 38.6 L82.5 42.6 Q82.5 52.6 92.5 52.6 L164.2 52.6 Q170.5 52.6 170.5 46.3 L170.5 46.3 Q170.5 40.0 176.8 40.0 L200.5 40.0"
  ]);
}
));

t5.add(new Test('JumpOver', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { locationSpot: go.Spot.Center },
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5, width: 40, height: 14.3 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal,  // may be either Orthogonal or AvoidsNodes
        curve: go.Link.JumpOver },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 50" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" },
    { key: "Alpha2", loc: "50 0" },
    { key: "Beta2", loc: "50 100" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // these two links will cross
    { from: "Alpha2", to: "Beta2" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(24.8, 50.0), new go.Point(34.8, 50.0), new go.Point(51.5, 50.0), new go.Point(51.5, 50.0), new go.Point(68.2, 50.0), new go.Point(78.2, 50.0)],
    [new go.Point(50.0, 15.4), new go.Point(50.0, 25.4), new go.Point(50.0, 50.0), new go.Point(50.0, 50.0), new go.Point(50.0, 74.6), new go.Point(50.0, 84.6)]
  ]);
  test.assertAllLinkGeometries([
    "M0.0 0.0 L53.5 0.0",
    "M0.0 0.0 L0.0 29.6 C-10.0 29.6 -10.0 39.6 0.0 39.6 L0.0 69.2"
  ]);
}
));

t5.add(new Test('JumpGap', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { locationSpot: go.Spot.Center },
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal,  // may be either Orthogonal or AvoidsNodes
        curve: go.Link.JumpGap
      },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 50" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "100 50" },
    { key: "Alpha2", loc: "50 0", size: new go.Size(57.00185140455794, 30.600679529557937) },
    { key: "Beta2", loc: "50 100", size: new go.Size(50.49550374830794,30.600679529557937) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // these two links will cross
    { from: "Alpha2", to: "Beta2" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(24.8, 50.0), new go.Point(34.8, 50.0), new go.Point(51.5, 50.0), new go.Point(51.5, 50.0), new go.Point(68.2, 50.0), new go.Point(78.2, 50.0)],
    [new go.Point(50.0, 15.4), new go.Point(50.0, 25.4), new go.Point(50.0, 50.0), new go.Point(50.0, 50.0), new go.Point(50.0, 74.6), new go.Point(50.0, 84.6)]
  ]);
  var link0 = diagram.findLinkForData(diagram.model.linkDataArray[0]);
  test.assertLinkGeometry(link0, "M0.0 0.0 L53.5 0.0");
  var link1 = diagram.findLinkForData(diagram.model.linkDataArray[1]);
  test.assert(link1.geometry.figures.count === 2, "Link.geometry that has a jumpgap should have two PathFigures");
  //test.assertAllLinkGeometries([
  //  "M0.0 0.0 L53.5 0.0",
  //  "M0.0 0.0 L0.0 29.6 M0.0 39.6 L0.0 69.2"  // this fails because only one PathFigure results from Geometry.parse
  //]);
}
));


// useful for test development

function dumplabelpositions(test) {
  var diagram = test.diagram
  var datas = diagram.model.linkDataArray;
  for (var i = 0; i < datas.length; i++) {
    var link = diagram.findLinkForData(datas[i]);
    if (window.console) {
      var msg = test.name + ' [';
      for (var j = 0; j < link.elements.count; j++) {
        var elt = link.elt(j);
        if (elt.isPanelMain || elt === link.path) continue;
        if (elt instanceof go.Shape && (elt.toArrow !== 'None' || elt.fromArrow !== 'None')) continue;
        var pos = elt.getDocumentPoint(go.Spot.TopLeft);
        msg += 'new go.Point(' + pos.x.toFixed(1) + ',' + pos.y.toFixed(1) + ')';
      }
      window.console.log(msg + ']');
    }
  }
}

// useful for testing

function assertLabelPositions(test, points) {
  var diagram = test.diagram
  var datas = diagram.model.linkDataArray;
  for (var i = 0; i < datas.length; i++) {
    var link = diagram.findLinkForData(datas[i]);
    test.assert(link !== null, 'no Link for link data: ' + datas[i]);
    var k = 0;
    for (var j = 0; j < link.elements.count; j++) {
      var elt = link.elt(j);
      if (elt.isPanelMain || elt === link.path) continue;
      if (elt instanceof go.Shape && (elt.toArrow !== 'None' || elt.fromArrow !== 'None')) continue;
      var pos = elt.getDocumentPoint(go.Spot.TopLeft);
      test.assert(test.isApproxPoint(pos, points[k]), 'Label at: ' + pos.toString() + ' instead of at: ' + points[k].toString());
      k++;
    }
  }
}

var t6 = new TestCollection('Labels');
intro.add(t6);

t6.add(new Test('Simple', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),                           // this is the link shape (the line)
      $(go.Shape, { toArrow: "Standard" }),  // this is an arrowhead
      $(go.TextBlock,      { height: 14.3, width: 50 },                  // this is a Link label
        new go.Binding("text", "text")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta", text: "a label" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(99.76,33.64)]);
}
));

t6.add(new Test('Burst', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.Panel, "Auto",  // this whole Panel is a link label
      {height: 42.68, width: 82.45},
        $(go.Shape, { figure: "TenPointedStar", fill: "yellow", stroke: "gray" }),
        $(go.TextBlock,
          { margin: 3, height: 14.3, width: 50 },
          new go.Binding("text", "text"))));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta", text: "hello!" }  // added information for link label
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(83.5, 19.4)]);
}
));

t6.add(new Test('Orthogonal', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock,
        { height: 42.9, width: 53, textAlign: "center" },  // centered multi-line text
        new go.Binding("text", "text")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta", text: "a label\non an\northo link" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(98.26, 18.96)]);
}
));

t6.add(new Test('SegmentFraction', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5, width: 50, height: 14.3 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { text: "from", width: 25, height: 14.3, segmentIndex: 0, segmentFraction: 0.2 }),
      $(go.TextBlock, { text: "mid", width: 21, height: 14.3, segmentIndex: 0, segmentFraction: 0.5 }),
      $(go.TextBlock, { text: "to", width: 11, height: 14.3, segmentIndex: 0, segmentFraction: 0.8 }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(66.7,22.2), new go.Point(112.76,33.26), new go.Point(161.86,44.45)]);
}
));

t6.add(new Test('SegmentIndex', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { text: "from", width: 25, height: 14.3, segmentIndex: 1, segmentFraction: 0.5 }),
      $(go.TextBlock, { text: "mid", width: 21, height: 14.3, segmentIndex: 2, segmentFraction: 0.5 }),
      $(go.TextBlock, { text: "to", width: 11, height: 14.3, segmentIndex: 3, segmentFraction: 0.5 }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(79.5,8.3), new go.Point(114.3,33.3), new go.Point(151.9,58.3)]);
}
));

t6.add(new Test('SegmentOffset', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { text: "left", width: 17, height: 14.3, segmentOffset: new go.Point(0, -10) }),
      $(go.TextBlock, { text: "right", width: 25, height: 14.3, segmentOffset: new go.Point(0, 10) }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(118.7,23.9), new go.Point(109.8,43.3)]);
}
));

t6.add(new Test('AlignmentFocus', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { text: "left", width: 17, height: 14.3, alignmentFocus: new go.Spot(1, 0.5, 3, 0) }),
      $(go.TextBlock, { text: "right", width: 25, height: 14.3, alignmentFocus: new go.Spot(0, 0.5, -3, 0) }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(104.8,33.6), new go.Point(127.8,33.6)]);
}
));

t6.add(new Test('SegmentOrientation', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { text: "left", segmentOffset: new go.Point(0, -10),
                        segmentOrientation: go.Link.OrientUpright
                        , width: 17,height: 14.3 }),
      $(go.TextBlock, { text: "middle", segmentOffset: new go.Point(0, 0),
                        segmentOrientation: go.Link.OrientUpright
                        , width: 38,height: 14.3 }),
      $(go.TextBlock, { text: "right", segmentOffset: new go.Point(0, 10),
                        segmentOrientation: go.Link.OrientUpright
                        , width: 25,height: 14.3 }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(120.7,22.1), new go.Point(108.1,29.2), new go.Point(111.9,40.5)]);
}
));

t6.add(new Test('NearEnds', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { background: 'lime', text: "from", height: 14.3, width: 40, segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }),
      $(go.TextBlock, { background: 'lime', text: "to", height: 14.3, width: 20, segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49,31), loc: "0 0" },
    { key: "Beta", size: new go.Size(43,31), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(56.148,5.684), new go.Point(181.978,37.6205)]);
}
));


t6.add(new Test('LongLabels segmentOffset NaN', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { background: 'lime', text: "from", height: 14.3, width: 140, segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }),
      $(go.TextBlock, { background: 'lime', text: "to", height: 141.3, width: 20, segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49,31), loc: "0 0" },
    { key: "Beta", size: new go.Size(43,31), loc: "300 150" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(58.8706,13.4777), new go.Point(344.7204,15.5679)]);
}
));

// Should appear shifted "20"
t6.add(new Test('LL segOffset NaN + Alignoffset', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { alignmentFocus: new go.Spot(0.5, 0.5, 20, 0), background: 'lime', text: "from", height: 14.3, width: 140,
        segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }),
      $(go.TextBlock, { alignmentFocus: new go.Spot(0.5, 0.5, 20, 0), background: 'lime', text: "to", height: 141.3, width: 20,
        segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
                        segmentOrientation: go.Link.OrientUpright }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49,31), loc: "0 0" },
    { key: "Beta", size: new go.Size(43,31), loc: "300 150" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;

  assertLabelPositions(test, [new go.Point(41.0183,4.4613), new go.Point(326.8681,6.5516)]);
}
));

// They should look "cenetered" at the endpoints of the link
t6.add(new Test('LongLabels segmentOffset 0,0', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock, { background: 'lime', text: "from", height: 14.3, width: 140, segmentIndex: 0, segmentOffset: new go.Point(0, 0),
                        segmentOrientation: go.Link.OrientUpright }),
      $(go.TextBlock, { background: 'lime', text: "to", height: 141.3, width: 20, segmentIndex: -1, segmentOffset: new go.Point(0, 0),
                        segmentOrientation: go.Link.OrientUpright }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49,31), loc: "0 0" },
    { key: "Beta", size: new go.Size(43,31), loc: "300 150" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(-10.8661,-10.3718), new go.Point(323.1218,87.1697)]);
}
));

// When the labelled segment has overlapping points, we should be using other points to determine angle
t6.add(new Test('Overlapping points -> vert label', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 50, height: 30, locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("points"),
      $(go.Shape),
      $(go.TextBlock, { text: "label", segmentIndex: 2, segmentFraction: .5,
                        segmentOrientation: go.Link.OrientAlong }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "0 100" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta",
      points: new go.List(/*go.Point*/).addAll([new go.Point(0, 15), new go.Point(0, 25), new go.Point(0, 50), new go.Point(0, 50), new go.Point(0, 75), new go.Point(0, 85)]) }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(7.15, 36.5)]);
}
));

t6.add(new Test('Overlapping points -> horiz label', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 50, height: 30, locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("points"),
      $(go.Shape),
      $(go.TextBlock, { text: "label", segmentIndex: 2, segmentFraction: .5,
                        segmentOrientation: go.Link.OrientAlong }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "100 0" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta",
      points: new go.List(/*go.Point*/).addAll([new go.Point(25, 0), new go.Point(35, 0), new go.Point(50, 0), new go.Point(50, 0), new go.Point(65, 0), new go.Point(75, 0)]) }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(36.5, -7.15)]);
}
));

t6.add(new Test('Overlapping points at end', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 50, height: 30, locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("points"),
      $(go.Shape),
      $(go.TextBlock, { text: "label", segmentIndex: -1, segmentFraction: .5,
                        segmentOrientation: go.Link.OrientAlong }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "100 100" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta",
      points: new go.List(/*go.Point*/).addAll([new go.Point(0, 15), new go.Point(0, 25), new go.Point(100, 85), new go.Point(100, 85)]) }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(92.1, 71.9)]);
}
));

t6.add(new Test('Non-center Focus + Orientation', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 50, height: 30, locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.TextBlock,
        {
          background: 'lime', height: 14.3, width: 140,
          text: "label", alignmentFocus: go.Spot.TopLeft,
          segmentOrientation: go.Link.OrientPlus90
        }
      ),
      $(go.TextBlock,
        {
          background: 'lime', height: 14.3, width: 140,
          text: "label", alignmentFocus: go.Spot.TopLeft,
          segmentOrientation: go.Link.OrientMinus90
        }
      ),
      $(go.TextBlock,
        {
          background: 'lime', height: 14.3, width: 140,
          text: "label", alignmentFocus: go.Spot.TopLeft,
          segmentOrientation: go.Link.OrientPlus90Upright
        }
      ),
      $(go.TextBlock,
        {
          background: 'lime', height: 14.3, width: 140,
          text: "label", alignmentFocus: go.Spot.TopLeft,
          segmentOrientation: go.Link.OrientMinus90Upright
        }
      ),
      $(go.TextBlock,
        {
          background: 'lime', height: 14.3, width: 140,
          text: "label", alignmentFocus: go.Spot.TopLeft,
          segmentOrientation: go.Link.OrientUpright45
        }
      )
    );

  diagram.model.nodeDataArray = [
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "50 100" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertLabelPositions(test, [new go.Point(25, 50), new go.Point(25, 50), new go.Point(-106.6, 99.8), new go.Point(25, 50), new go.Point(25, 50)]);
}
));

// setup helper function
function makeGraph(diagram) {
  var $ = go.GraphObject.make;

  diagram.layout =
    $(go.LayeredDigraphLayout,  // this will be discussed in a later section
      { columnSpacing: 5,
        setsPortSpots: false });

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(44,25.3) },
    { key: "Beta", size: new go.Size(38,25.3) },
    { key: "Gamma", size: new go.Size(57,25.3) },
    { key: "Delta", size: new go.Size(41,25.3) },
    { key: "Epsilon", size: new go.Size(54,25.3) },
    { key: "Zeta", size: new go.Size(36,25.3) },
    { key: "Eta", size: new go.Size(31,25.3) },
    { key: "Theta", size: new go.Size(43,25.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Beta", to: "Alpha" },
    { from: "Gamma", to: "Alpha" },
    { from: "Delta", to: "Alpha" },
    { from: "Alpha", to: "Epsilon" },
    { from: "Alpha", to: "Zeta" },
    { from: "Alpha", to: "Eta" },
    { from: "Alpha", to: "Theta" }
  ];
}

var t7 = new TestCollection('PortSpots');
intro.add(t7);

t7.add(new Test('NoSpots', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { width: 90, height: 90,
        selectionAdorned: false },
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "FivePointedStar", fill: "lightgray" }),
      $(go.TextBlock,
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape,   // the "from" end arrowhead
        { fromArrow: "Chevron" }),
      $(go.Shape,   // the "to" end arrowhead
        { toArrow: "StretchedDiamond", fill: "red" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", loc: "0 0" },
    { key: "Beta", loc: "100 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 0.0L54.3 27.2"
  ]);
}
));

t7.add(new Test('Spots', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { fromSpot: go.Spot.Right,  // coming out from middle-right
        toSpot: go.Spot.Left },   // going into at middle-left
        new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5},
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  makeGraph(diagram);
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 0.0 L10.0 0.0 L44.5 30.3 L54.5 30.3",
    "M0.0 0.0 L45.0 0.0",
    "M0.0 30.3 L10.0 30.3 L43.0 0.0 L53.0 0.0",
    "M0.0 45.5 L10.0 45.4 L35.0 0.0 L45.0 0.0",
    "M0.0 15.0 L10.0 15.0 L44.0 0.0 L54.0 0.0",
    "M0.0 0.0 L10.0 0.0 L46.5 15.1 L56.5 15.1",
    "M0.0 0.0 L10.0 0.0 L40.5 45.5 L50.5 45.5"
  ]);
}
));

t7.add(new Test('Sides', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { fromSpot: go.Spot.RightSide,  // coming out from right side
        toSpot: go.Spot.LeftSide },   // going into at left side
        new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5},
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  makeGraph(diagram);
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 0.0 L10.0 0.0 L44.5 24.0 L54.5 24.0",
    "M0.0 0.0 L45.0 0.0",
    "M0.0 24.0 L10.0 24.0 L43.0 0.0 L53.0 0.0",
    "M0.0 37.9 L10.0 37.9 L35.0 0.0 L45.0 0.0",
    "M0.0 12.5 L10.0 12.5 L44.0 0.0 L54.0 0.0",
    "M0.0 0.0 L10.0 0.0 L46.5 12.6 L56.5 12.6",
    "M0.0 0.0 L10.0 0.0 L40.5 37.9 L50.5 37.9"
  ]);
}
));

t7.add(new Test('SidesOrtho', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { fromSpot: go.Spot.RightSide,  // coming out from right side
        toSpot: go.Spot.LeftSide },   // going into at left side
        new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5},
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal,  // Orthogonal routing
        corner: 10 },                 // with rounded corners
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  makeGraph(diagram);
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 0.0 L17.3 0.0 Q27.3 0.0 27.3 10.0 L27.3 14.0 Q27.3 24.0 37.3 24.0 L54.5 24.0",
    "M0.0 0.0 L45.0 0.0",
    "M0.0 24.0 L16.5 24.0 Q26.5 24.0 26.5 14.0 L26.5 10.0 Q26.5 0.0 36.5 0.0 L53.0 0.0",
    "M0.0 37.9 L12.5 37.9 Q22.5 37.9 22.5 27.9 L22.5 10.0 Q22.5 0.0 32.5 0.0 L45.0 0.0",
    "M0.0 12.5 L24.8 12.5 Q31.0 12.5 31.0 6.2 L31.0 6.2 Q31.0 0.0 37.2 0.0 L54.0 0.0",
    "M0.0 0.0 L25.9 0.0 Q32.3 0.0 32.3 6.3 L32.3 6.3 Q32.3 12.6 38.6 12.6 L56.5 12.6",
    "M0.0 0.0 L15.3 0.0 Q25.3 0.0 25.3 10.0 L25.3 27.9 Q25.3 37.9 35.3 37.9 L50.5 37.9"
  ]);
}
));

t7.add(new Test('SidesBezier', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { fromSpot: go.Spot.RightSide,  // coming out from right side
        toSpot: go.Spot.LeftSide },   // going into at left side
        new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5},
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      { curve: go.Link.Bezier },  // Bezier curve
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  makeGraph(diagram);
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 0.0 C10.0 0.0 44.5 24.0 54.5 24.0",
    "M0.0 0.0 C10.0 0.0 35.0 0.0 45.0 0.0",
    "M0.0 24.0 C10.0 24.0 43.0 0.0 53.0 0.0",
    "M0.0 37.9 C10.0 37.9 35.0 0.0 45.0 0.0",
    "M0.0 12.5 C10.0 12.5 44.0 0.0 54.0 0.0",
    "M0.0 0.0 C10.0 0.0 46.5 12.6 56.5 12.6",
    "M0.0 0.0 C10.0 0.0 40.5 37.9 50.5 37.9"
  ]);
}
));

t7.add(new Test('LinkSpots', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5},
        new go.Binding("text", "key")));

  diagram.linkTemplate =
    $(go.Link,
      new go.Binding("fromSpot", "fromSpot", go.Spot.parse),  // get the link spots from the link data
      new go.Binding("toSpot", "toSpot", go.Spot.parse),
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(44,25.3) },
    { key: "Beta", size: new go.Size(38,25.3) },
    { key: "Gamma", size: new go.Size(57,25.3) },
    { key: "Delta", size: new go.Size(41,25.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta", fromSpot: "TopRight", toSpot: "Left" },
    { from: "Alpha", to: "Gamma", fromSpot: "Left", toSpot: "Left" },
    { from: "Alpha", to: "Delta", fromSpot: "None", toSpot: "Top" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkGeometries([
    "M0.0 7.1 L7.1 0.0 L16.0 19.7 L26.0 19.7",
    "M10.0 0.0 L0.0 0.0 L0.0 70.0 L10.0 70.0",
    "M0.0 0.0 L61.9 34.7 L61.9 44.7"
  ]);
}
));


var t8 = new TestCollection('Ports');
intro.add(t8);

t8.add(new Test('PortWhole', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Vertical",
      { fromSpot: go.Spot.Right, toSpot: go.Spot.Left },   // port properties on the node
      new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Ellipse", width: 30, height: 30, fill: "green" }),
      $(go.TextBlock,
        new go.Binding("text", "key")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,45.3) },
    { key: "Beta", size: new go.Size(31,45.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(33.0, 22.6), new go.Point(43.0, 22.6), new go.Point(60.0, 22.6), new go.Point(70.0, 22.6)]
  ]);
}
));

t8.add(new Test('PortShape', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Vertical",
      new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Ellipse", width: 30, height: 30, fill: "green",
          portId: "",                          // now the Shape is the port, not the whole Node
          fromSpot: go.Spot.Right, toSpot: go.Spot.Left }),  // port properties go on the port!
      $(go.TextBlock,
        new go.Binding("text", "key")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,45.3) },
    { key: "Beta", size: new go.Size(31,45.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  test.assertAllLinkPoints([
    [new go.Point(32.0, 15.5), new go.Point(42.0, 15.5), new go.Point(60.0, 15.5), new go.Point(70.0, 15.5)]
  ]);
}
));

t8.add(new Test('GeneralPorts', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("desiredSize", "size"),
      $(go.Shape,
        { figure: "Rectangle", fill: "lightgray" }),
      $(go.Panel, "Table",
        $(go.RowColumnDefinition,
          { column: 0, alignment: go.Spot.Left }),
        $(go.RowColumnDefinition,
          { column: 2, alignment: go.Spot.Right }),
        $(go.TextBlock,  // the node title
          {column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center, name: 's',
          font: "bold 10pt sans-serif", margin: new go.Margin(4, 2) },
          new go.Binding("text", "key"),
          new go.Binding("desiredSize", "s")
          ),
        $(go.Panel, "Horizontal",
          { column: 0, row: 1 },
          $(go.Shape,  // the "A" port
            {width: 6, height: 6, portId: "A", toSpot: go.Spot.Left }),
          $(go.TextBlock, "A", {desiredSize: new go.Size(9,14.3)})),  // "A" port label
        $(go.Panel, "Horizontal",
          { column: 0, row: 2 },
          $(go.Shape,  // the "B" port
            {width: 6, height: 6, portId: "B", toSpot: go.Spot.Left }),
          $(go.TextBlock, "B", {desiredSize: new go.Size(9,14.3)})),  // "B" port label
        $(go.Panel, "Horizontal",
          { column: 2, row: 1, rowSpan: 2 },
          $(go.TextBlock, "Out", {desiredSize: new go.Size(21,14.3)}),  // "Out" port label
          $(go.Shape,  // the "Out" port
            {width: 6, height: 6, portId: "Out", fromSpot: go.Spot.Right }))));

  diagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal, corner: 3 },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }));

  diagram.model =
    $(go.GraphLinksModel,
      { linkFromPortIdProperty: "fromPort",  // required information:
        linkToPortIdProperty: "toPort",      // identifies data property names
        nodeDataArray: [
          { key: "Add1", size: new go.Size(45,51.900000000000006), s: new go.Size(32,14.3) },
          { key: "Add2", size: new go.Size(45,51.900000000000006), s: new go.Size(32,14.3) },
          { key: "Subtract1", size: new go.Size(65,51.900000000000006), s: new go.Size(60,14.3) }
        ],
        linkDataArray: [
          { from: "Add1", fromPort: "Out", to: "Subtract1", toPort: "A" },
          { from: "Add2", fromPort: "Out", to: "Subtract1", toPort: "B" }
        ]
      });

  diagram.layout = $(go.LayeredDigraphLayout, { columnSpacing: 10 });
},
null,
function(test) {
  var diagram = test.diagram;
  var add1 = diagram.findNodeForKey("Add1");
  test.assert(add1 && add1.ports.count === 3, "Add1 node does not have 3 ports; got " + add1.ports.count);
  var portOut = add1.findPort("Out");
  test.assert(portOut !== null && portOut.portId === "Out" && portOut.panel.column === 2, "'Out' port not found or not in column 2");
  test.assertAllLinkPoints([
    [new go.Point(44.5,37.2), new go.Point(54.5,37.2), new go.Point(67.5,37.2), new go.Point(67.5,60.9), new go.Point(80.5,60.9), new go.Point(90.5,60.9)],
    [new go.Point(44.5,99.0), new go.Point(54.5,99.0), new go.Point(67.5,99.0), new go.Point(67.5,75.2), new go.Point(80.5,75.2), new go.Point(90.5,75.2)]
  ]);
}
));


function SetupSubTree(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Horizontal",
      $(go.Panel, "Auto",
        $(go.Shape,
          { figure: "Ellipse", fill: null }),
        $(go.TextBlock,
          new go.Binding("text", "key"))),
      $("TreeExpanderButton"));

  diagram.layout = $(go.TreeLayout);

  diagram.model.nodeDataArray = [
    { key: "Alpha" }, { key: "Beta" }, { key: "Gamma" }, { key: "Delta" },
    { key: "Epsilon" }, { key: "Zeta" }, { key: "Eta" }, { key: "Theta" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },
    { from: "Beta", to: "Gamma" },
    { from: "Beta", to: "Delta" },
    { from: "Alpha", to: "Epsilon" },
    { from: "Epsilon", to: "Zeta" },
    { from: "Epsilon", to: "Eta" },
    { from: "Theta", to: "Eta" }  // not a tree!
  ];
}

var t9 = new TestCollection('SubTrees');
intro.add(t9);

t9.add(new Test('SubTreeCollapseBeta', diagram, SetupSubTree,
function (test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
},
function (test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Beta should be visible but collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t9.add(new Test('SubTreeCollapseAlpha', diagram, SetupSubTree,
function (test) {
  var diagram = test.diagram;
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
},
function (test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Beta should be invisible and collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Epsilon should be invisible and collapsed");
}
));

t9.add(new Test('SubTreeCollapseAlphaExpand', diagram, SetupSubTree,
function (test) {
  var diagram = test.diagram;
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
},
function (test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Beta should be visible and expanded");
  node = diagram.findNodeForKey("Gamma");
  test.assert(node.isVisible() && node.isTreeExpanded, "Gamma should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t9.add(new Test('SubTreeCollapseBetaFirstExpand', diagram, SetupSubTree,
function (test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
},
function (test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Beta should be visible and collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t9.add(new Test('SubTreeCollapseBetaFirstExpand2', diagram, SetupSubTree,
function (test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
  betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 3000 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 3200 });
},
function (test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Beta should be visible and expanded");
  node = diagram.findNodeForKey("Gamma");
  test.assert(node.isVisible() && node.isTreeExpanded, "Gamma should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t9.add(new Test("SubTreeCollapseLevels3", diagram, SetupSubTree,
function(test) {
  var diagram = test.diagram;
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree(3);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next(); ) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 8, "should have all nodes visible after collapseTree(3)");
}
));

t9.add(new Test("SubTreeCollapseLevels", diagram, SetupSubTree,
function(test) {
  var diagram = test.diagram;
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree(2);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next(); ) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 4, "should have four nodes visible after collapseTree(2)");
}
));

t9.add(new Test("SubTreeExpandLevels3", diagram, SetupSubTree,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Beta");
  node.collapseTree();
  node = diagram.findNodeForKey("Epsilon");
  node.collapseTree();
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree();
  root.expandTree(3);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next(); ) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 8, "should have all nodes visible after expandTree(3)");
}
));

t9.add(new Test("SubTreeExpandLevels2", diagram, SetupSubTree,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Beta");
  node.collapseTree();
  node = diagram.findNodeForKey("Epsilon");
  node.collapseTree();
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree();
  root.expandTree(2);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next(); ) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 4, "should have four nodes visible after expandTree(2)");
}
));

t9.add(new Test('SubTreeCollapseEpsilon', diagram, SetupSubTree,
function(test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Epsilon").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Epsilon should be visible and collapsed");
  node = diagram.findNodeForKey("Eta");
  test.assert(!node.isVisible(), "Eta should be unseen");
  node = diagram.findNodeForKey("Theta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Theta should be visible and still expanded, even though a child has been collapsed independently");
  var link = node.linksConnected.first();
  test.assert(link !== null && !link.isVisible(), "Link from Theta to unseen Eta should not be visible");
}
));

  //       8
  //         \
  // 1 -- 2 -- 3
  //       \  /
  //        --
  //       /  \
  // 4 -- 5 -- 6
  //        \
  //          7
function SetupSharedTrees(test, policy) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.treeCollapsePolicy = policy;
  diagram.layout = new go.TreeLayout();
  diagram.model = new go.GraphLinksModel([
    { key: 1 },
    { key: 2 },
    { key: 3 },
    { key: 4 },
    { key: 5 },
    { key: 6 },
    { key: 7 },
    { key: 8 }
  ], [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 6 },
    { from: 4, to: 5 },
    { from: 5, to: 3 },
    { from: 5, to: 6 },
    { from: 5, to: 7 },
    { from: 8, to: 3 }
  ]);
}

function Collapse(test, key) {
  var diagram = test.diagram;
  diagram.startTransaction();
  diagram.findNodeForKey(key).isTreeExpanded = false;
  diagram.commitTransaction("collapsed");
}

function CheckVisible(test, visiblekeys, invisiblekeys, maybekeys) {
  visiblekeys.forEach(function(k) {
    var node = test.diagram.findNodeForKey(k);
    test.assert(node !== null && node.isVisible(), "either could not find node for key " + k + " or it is not isVisible()");
  });
  if (Array.isArray(invisiblekeys)) {
    invisiblekeys.forEach(function(k) {
      var node = test.diagram.findNodeForKey(k);
      test.assert(node !== null && !node.isVisible(), "either could not find node for key " + k + " or it is isVisible()");
    });
  }
  if (Array.isArray(maybekeys)) {  // just used for policy === TreeParentCollapsed, where it depends on which links form the tree structure
    maybekeys.forEach(function(k) {
      var node = test.diagram.findNodeForKey(k);
      var parent = node.findTreeParentNode();
      if (parent !== null) {
        test.assert(node.isVisible() === parent.isTreeExpanded, "node " + k + " should have same isVisible() value as its tree parent node's isTreeExpanded");
      }
    });
  }
}

t9.add(new Test("TreeParentCollapsed 1", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.TreeParentCollapsed); },
  function(test) { Collapse(test, 1); },
  function(test) { CheckVisible(test, [1, 4, 5, 7, 8], [2], [3, 6]); }));

t9.add(new Test("AllParentsCollapsed 1", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AllParentsCollapsed); },
  function(test) { Collapse(test, 1); },
  function(test) { CheckVisible(test, [1, 3, 4, 5, 6, 7, 8], [2]); }));

t9.add(new Test("AnyParentsCollapsed 1", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AnyParentsCollapsed); },
  function(test) { Collapse(test, 1); },
  function(test) { CheckVisible(test, [1, 4, 5, 7, 8], [2, 3, 6]); }));

t9.add(new Test("TreeParentCollapsed 2", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.TreeParentCollapsed); },
  function(test) { Collapse(test, 2); },
  function(test) { CheckVisible(test, [1, 2, 4, 5, 7, 8], [], [3, 6]); }));

t9.add(new Test("AllParentsCollapsed 2", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AllParentsCollapsed); },
  function(test) { Collapse(test, 2); },
  function(test) { CheckVisible(test, [1, 2, 3, 4, 5, 6, 7, 8]); }));

t9.add(new Test("AnyParentsCollapsed 2", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AnyParentsCollapsed); },
  function(test) { Collapse(test, 2); },
  function(test) { CheckVisible(test, [1, 2, 4, 5, 7, 8], [3, 6]); }));

t9.add(new Test("TreeParentCollapsed 5", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.TreeParentCollapsed); },
  function(test) { Collapse(test, 5); },
  function(test) { CheckVisible(test, [1, 2, 4, 5, 8], [], [3, 6, 7]); }));

t9.add(new Test("AllParentsCollapsed 5", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AllParentsCollapsed); },
  function(test) { Collapse(test, 5); },
  function(test) { CheckVisible(test, [1, 2, 3, 4, 5, 6, 8], [7]); }));

t9.add(new Test("AnyParentsCollapsed 5", diagram,
  function(test) { SetupSharedTrees(test, go.Diagram.AnyParentsCollapsed); },
  function(test) { Collapse(test, 5); },
  function(test) { CheckVisible(test, [1, 2, 4, 5, 8], [3, 6, 7]); }));

  t9.add(new Test("Collapse circle", diagram,
  function(test) {
    var d = test.diagram;
    d.reset();

    d.nodeTemplate =
      $(go.Node, "Auto",  // the Shape will go around the TextBlock
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          new go.Binding("text", "key"))
      );

    d.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Gamma" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);

    d.findNodeForKey('Alpha').isSelected = true;
   },
  function(test) {  },
  function(test) {
    var d = test.diagram;
    d.commandHandler.collapseTree(d.selection.first())
    d.nodes.each(function(n){
      test.assert(n.adornments.count === 0);
      test.assert(n.wasTreeExpanded === true);
    });
   })); // end collapse circle

function SetupSubTreeGroup(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Horizontal",
      $(go.Panel, "Auto",
        $(go.Shape,
          { figure: "Ellipse", fill: null }),
        $(go.TextBlock,
          new go.Binding("text", "key"))),
      $("TreeExpanderButton"));

  diagram.layout = $(go.TreeLayout);

  diagram.model.nodeDataArray = [
    { key: "aGroup", isGroup: true },
    { key: "Alpha", group: "aGroup" }, { key: "Beta", group: "aGroup" }, { key: "Gamma", group: "aGroup" }, { key: "Delta", group: "aGroup" },
    { key: "Epsilon", group: "aGroup" }, { key: "Zeta", group: "aGroup" }, { key: "Eta", group: "aGroup" }, { key: "Theta", group: "aGroup" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },
    { from: "Beta", to: "Gamma" },
    { from: "Beta", to: "Delta" },
    { from: "Alpha", to: "Epsilon" },
    { from: "Epsilon", to: "Zeta" },
    { from: "Epsilon", to: "Eta" },
    { from: "Theta", to: "Eta" }  // not a tree!
  ];
}

var t10 = new TestCollection('SubTrees in Group');
intro.add(t10);

t10.add(new Test('SubTreeCollapseBeta', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Beta should be visible but collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t10.add(new Test('SubTreeCollapseAlpha', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Beta should be invisible and collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Epsilon should be invisible and collapsed");
}
));

t10.add(new Test('SubTreeCollapseAlphaExpand', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Beta should be visible and expanded");
  node = diagram.findNodeForKey("Gamma");
  test.assert(node.isVisible() && node.isTreeExpanded, "Gamma should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t10.add(new Test('SubTreeCollapseBetaFirstExpand', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Beta should be visible and collapsed");
  node = diagram.findNodeForKey("Gamma");
  test.assert(!node.isVisible() && !node.isTreeExpanded, "Gamma should be invisible and collapsed");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t10.add(new Test('SubTreeCollapseBetaFirstExpand2', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
  var alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 1000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 1200 });
  alphapt = diagram.findNodeForKey("Alpha").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(alphapt, { timestamp: 2000 });  // click Alpha's TreeExpanderButton
  test.mouseUp(alphapt, { timestamp: 2200 });
  betapt = diagram.findNodeForKey("Beta").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 3000 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 3200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Beta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Beta should be visible and expanded");
  node = diagram.findNodeForKey("Gamma");
  test.assert(node.isVisible() && node.isTreeExpanded, "Gamma should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && node.isTreeExpanded, "Epsilon should be visible and expanded");
}
));

t10.add(new Test('SubTreeCollapseEpsilon', diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var betapt = diagram.findNodeForKey("Epsilon").elt(1).getDocumentPoint(go.Spot.Center);
  test.mouseDown(betapt, { timestamp: 0 });  // click Beta's TreeExpanderButton
  test.mouseUp(betapt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Alpha");
  test.assert(node.isVisible() && node.isTreeExpanded, "Alpha should be visible and expanded");
  node = diagram.findNodeForKey("Epsilon");
  test.assert(node.isVisible() && !node.isTreeExpanded, "Epsilon should be visible and collapsed");
  node = diagram.findNodeForKey("Eta");
  test.assert(!node.isVisible(), "Eta should be unseen");
  node = diagram.findNodeForKey("Theta");
  test.assert(node.isVisible() && node.isTreeExpanded, "Theta should be visible and still expanded, even though a child has been collapsed independently");
  var link = node.linksConnected.first();
  test.assert(link !== null && !link.isVisible(), "Link from Theta to unseen Eta should not be visible");
}
));

t10.add(new Test("SubTreeCollapseLevels3", diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree(3);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next() ;) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 9, "should have all nodes visible after collapseTree(3)");
}
));

t10.add(new Test("SubTreeCollapseLevels", diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree(2);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next() ;) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 5, "should have five nodes visible after collapseTree(2)");
}
));

t10.add(new Test("SubTreeExpandLevels3", diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Beta");
  node.collapseTree();
  node = diagram.findNodeForKey("Epsilon");
  node.collapseTree();
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree();
  root.expandTree(3);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next() ;) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 9, "should have all nodes visible after expandTree(3)");
}
));

t10.add(new Test("SubTreeExpandLevels2", diagram, SetupSubTreeGroup,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findNodeForKey("Beta");
  node.collapseTree();
  node = diagram.findNodeForKey("Epsilon");
  node.collapseTree();
  var root = diagram.findNodeForKey("Alpha");
  root.collapseTree();
  root.expandTree(2);
},
function(test) {
  var diagram = test.diagram;
  var vis = 0;
  for (var it = diagram.nodes; it.next() ;) {
    if (it.value.isVisible()) vis++;
  }
  test.assert(vis === 5, "should have five nodes visible after expandTree(2)");
}
));

  // useful for test development

function dumpnodepositions(test) {
  var diagram = test.diagram
  var datas = diagram.model.nodeDataArray;
  if (!window.console) return;
  var msg = test.name + ' [';
  for (var i = 0; i < datas.length; i++) {
    var node = diagram.findPartForData(datas[i]);
    var pos = node.position;
    if (i > 0) msg += ", ";
    msg += 'new go.Point(' + pos.x.toFixed(1) + ',' + pos.y.toFixed(1) + ')';
  }
  window.console.log(msg + ']');
}

function assertAllNodePositions(test, points) {
  var diagram = test.diagram
  var datas = diagram.model.nodeDataArray;
  var msg = "";
  for (var i = 0; i < datas.length; i++) {
    var node = diagram.findPartForData(datas[i]);
    var pos = node.position;
    if (!test.isApproxPoint(pos, points[i])) msg += "Node " + node + " is at: " + pos.toString(2) + ", expected: " + points[i].toString(2) + "\n";
  }
  test.assert(msg === "", msg);
}

var t10 = new TestCollection('Groups');
intro.add(t10);

t10.add(new Test('SimpleGroups', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));

  var archgrp = new go.Group();
  archgrp.selectionObjectName = 'GROUPPANEL';
  archgrp.type = go.Panel.Vertical;
  var grpt = new go.TextBlock();
  grpt.font = 'bold 12pt sans-serif';
  grpt.desiredSize = new go.Size(NaN, 16.9);
  grpt.bind(new go.Binding('text', '', go.Binding.toString));
  archgrp.add(grpt);
  var grppan = new go.Panel("Auto");
  grppan.name = 'GROUPPANEL';
  var grpbord = new go.Shape();
  grpbord.figure = 'Rectangle';
  grpbord.fill = 'rgba(128,128,128,0.2)';
  grpbord.stroke = 'black';
  grppan.add(grpbord);
  var phold = new go.Placeholder();
  phold.padding = new go.Margin(5, 5, 5, 5);
  grppan.add(phold);
  archgrp.add(grppan);

diagram.groupTemplate = archgrp;

  diagram.model.nodeDataArray = [
    { key: "Alpha", isGroup: true, size: new go.Size(205,140.1) },
    { key: "Beta", size: new go.Size(27,14.3), group: "Alpha" },
    { key: "Gamma", group: "Alpha", isGroup: true, size: new go.Size(124,42.2) },
    { key: "Delta", size: new go.Size(30,14.3), group: "Gamma" },
    { key: "Epsilon", size: new go.Size(43,14.3), group: "Gamma" },
    { key: "Zeta", size: new go.Size(25,14.3), group: "Alpha" },
    { key: "Eta", group: "Alpha", isGroup: true, size: new go.Size(43,42.2) },
    { key: "Theta", size: new go.Size(32,14.3), group: "Eta" }
  ];
},
null,
function (test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(0.0, 0.0), new go.Point(5.5, 22.4), new go.Point(75.5, 22.4), new go.Point(81.0, 45.2), new go.Point(151.0, 45.2), new go.Point(5.5, 92.4), new go.Point(75.5, 92.4), new go.Point(81.0, 115.2)]);
  test.assert(diagram.findTopLevelGroups().count === 1 && diagram.findTopLevelGroups().first().data.key === "Alpha", "diagram should have one top-level group: Alpha");
}
));

t10.add(new Test('GroupAndLinks', diagram,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));

  var archgrp = new go.Group();
  archgrp.selectionObjectName = 'GROUPPANEL';
  archgrp.type = go.Panel.Vertical;
  var grpt = new go.TextBlock();
  grpt.font = 'bold 12pt sans-serif';
  grpt.desiredSize = new go.Size(NaN, 16.9);
  grpt.bind(new go.Binding('text', '', go.Binding.toString));
  archgrp.add(grpt);
  var grppan = new go.Panel("Auto");
  grppan.name = 'GROUPPANEL';
  var grpbord = new go.Shape();
  grpbord.figure = 'Rectangle';
  grpbord.fill = 'rgba(128,128,128,0.2)';
  grpbord.stroke = 'black';
  grppan.add(grpbord);
  var phold = new go.Placeholder();
  phold.padding = new go.Margin(5, 5, 5, 5);
  grppan.add(phold);
  archgrp.add(grppan);
  diagram.groupTemplate = archgrp;

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,14.3) },
    { key: "Beta", size: new go.Size(27,14.3), group: "Omega" },
    { key: "Gamma", size: new go.Size(46,14.3), group: "Omega" },
    { key: "Omega", isGroup: true },
    { key: "Delta", size: new go.Size(30,14.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // from outside the Group to inside it
    { from: "Beta", to: "Gamma" },  // this link is a member of the Group
    { from: "Omega", to: "Delta" }  // from the Group to a Node
  ];
},
null,
function (test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(0.0, 0.0), new go.Point(75.5, 22.4), new go.Point(145.5, 22.4), new go.Point(70.0, 0.0), new go.Point(0.0, 70.0)]);
}
));

t10.add(new Test('GroupTemplates', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, { figure: "Ellipse", fill: "white" }),
      $(go.TextBlock, {height: 14.3, width: 50},
        new go.Binding("text", "key")));

  diagram.groupTemplate =
    $(go.Group, "Vertical",
      $(go.TextBlock,         // group title
        {alignment: go.Spot.Left, font: "Bold 12pt Sans-Serif", height: 16.9 },
        new go.Binding("text", "key")),
      $(go.Panel, "Auto",
        $(go.Shape,           // surrounds the Placeholder
          {figure: "RoundedRectangle", parameter1: 14,
          fill: "rgba(128,128,128,0.33)"
        }),
        $(go.Placeholder,    // represents the area of all member parts,
          {padding: 5 })));  // with some extra padding around them

  diagram.model.nodeDataArray = [
    { key: "Alpha" },
    { key: "Beta", group: "Omega" },
    { key: "Gamma", group: "Omega" },
    { key: "Omega", isGroup: true },
    { key: "Delta" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" },  // from outside the Group to inside it
    {from: "Beta", to: "Gamma" },  // this link is a member of the Group
    {from: "Omega", to: "Delta"}  // from the Group to a Node
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(0.0,0.0), new go.Point(106.91,30.1), new go.Point(200.58,30.13), new go.Point(93.67,0.0), new go.Point(0.0,85.1)]);
}
));


t10.add(new Test('SubGraph', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));
  diagram.groupTemplate =
    $(go.Group, "Auto",
      { layout: $(go.LayeredDigraphLayout,
                  { direction: 0, columnSpacing: 10 })
      },
      $(go.Shape,             // surrounds everything
        { figure: "RoundedRectangle", parameter1: 10,
          fill: "rgba(128,128,128,0.33)" }),
      $(go.Panel, "Vertical",  // position header above the subgraph
        $(go.Panel, "Horizontal",  // the header
          { alignment: go.Spot.Left, defaultAlignment: go.Spot.Top },
          $("SubGraphExpanderButton"),  // this Panel acts as a Button
          $(go.TextBlock,     // group title near top, next to button
            { font: "Bold 12pt Sans-Serif", height: 16.9 },
            new go.Binding("text", "key"))),
        $(go.Placeholder,     // represents area for all member parts
          { padding: new go.Margin(0, 10), background: "white" })));

  diagram.layout = $(go.LayeredDigraphLayout,
                     { direction: 90, layerSpacing: 10 });

  diagram.initialContentAlignment = go.Spot.Center;

//, size: new go.Size(220.04569499661588,73.24569499661587)

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,14.3) },
    { key: "Omega", isGroup: true },
    { key: "Beta", size: new go.Size(27,14.3), group: "Omega" },
    { key: "Gamma", size: new go.Size(46,14.3), group: "Omega" },
    { key: "Epsilon", size: new go.Size(43,14.3), group: "Omega" },
    { key: "Zeta", size: new go.Size(25,14.3), group: "Omega" },
    { key: "Delta", size: new go.Size(30,14.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Omega" }, // from a Node to the Group
    {from: "Beta", to: "Gamma" },  // this link is a member of the Group
    {from: "Beta", to: "Epsilon" },  // this link is a member of the Group
    {from: "Gamma", to: "Zeta" },  // this link is a member of the Group
    {from: "Epsilon", to: "Zeta" },  // this link is a member of the Group
    {from: "Omega", to: "Delta"}  // from the Group to a Node
  ];
},
null,
function(test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(93.5,0.0), new go.Point(0,44.3), new go.Point(16.0,79.4), new go.Point(87.6,67.2), new go.Point(89.5,91.5), new go.Point(179.0,79.4), new go.Point(95.0,141.8)]);
}
));

t10.add(new Test('SubGraphCollapsed', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));
  diagram.groupTemplate =
    $(go.Group, "Auto",
      { layout: $(go.LayeredDigraphLayout,
                  { direction: 0, columnSpacing: 10 })
      },
      $(go.Shape,             // surrounds everything
        {figure: "RoundedRectangle", parameter1: 10,
        fill: "rgba(128,128,128,0.33)"
      }),
      $(go.Panel, "Vertical",  // position header above the subgraph
        {defaultAlignment: go.Spot.Left },
        $(go.Panel, "Horizontal",  // the header
          {defaultAlignment: go.Spot.Top },
          $("SubGraphExpanderButton", { name: "BUTTON" }),  // this Panel acts as a Button
          $(go.TextBlock,     // group title near top, next to button
            {font: "Bold 12pt Sans-Serif", height: 16.9, width: 54 },
            new go.Binding("text", "key"))),
        $(go.Placeholder,     // represents area for all member parts
          {padding: new go.Margin(0, 10), background: "white" })));

  diagram.layout = $(go.LayeredDigraphLayout,
                     { direction: 90, layerSpacing: 10 });

  diagram.initialContentAlignment = go.Spot.Center;

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,14.3) },
    { key: "Omega", isGroup: true },
    { key: "Beta", size: new go.Size(27,14.3), group: "Omega" },
    { key: "Gamma", size: new go.Size(46,14.3), group: "Omega" },
    { key: "Epsilon", size: new go.Size(43,14.3), group: "Omega" },
    { key: "Zeta", size: new go.Size(25,14.3), group: "Omega" },
    { key: "Delta", size: new go.Size(30,14.3) }
  ];

  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Omega" }, // from a Node to the Group
    {from: "Beta", to: "Gamma" },  // this link is a member of the Group
    {from: "Beta", to: "Epsilon" },  // this link is a member of the Group
    {from: "Gamma", to: "Zeta" },  // this link is a member of the Group
    {from: "Epsilon", to: "Zeta" },  // this link is a member of the Group
    {from: "Omega", to: "Delta"}  // from the Group to a Node
  ];
},
function(test) {
  var diagram = test.diagram;
  var group = diagram.findPartForKey("Omega");
  var buttonpt = group.findObject("BUTTON").getDocumentPoint(go.Spot.Center);
  test.mouseDown(buttonpt, { timestamp: 0 });  // click Omega's SubGraphExpanderButton
  test.mouseUp(buttonpt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(24.8, 0.0), new go.Point(0.2, 44.3), new go.Point(16.0, 79.4), new go.Point(88.2, 67.2), new go.Point(89.5, 91.5), new go.Point(179.0, 79.4), new go.Point(26.3, 103.2)]);
}
));

t10.add(new Test('SubGraphCollapsedPadding', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));
  diagram.groupTemplate =
    $(go.Group, "Auto",
      {
        background: "transparent",
        // Groups containing Nodes lay out their members vertically
        layout:
          $(go.GridLayout,
            { wrappingColumn: 1, alignment: go.GridLayout.Position,
              cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4) })
      },
      $(go.Shape, "Rectangle",
        { fill: null, stroke: "#33D3E5", strokeWidth: 2 }),
      $(go.Panel, "Vertical",  // title above Placeholder
        $(go.Panel, "Horizontal",  // button next to TextBlock
          { stretch: go.GraphObject.Horizontal, background: "#33D3E5" },
          $("SubGraphExpanderButton",
            { name: "BUTTON", alignment: go.Spot.Right, margin: 5 }),
          $(go.TextBlock,
            {
              alignment: go.Spot.Left,
              desiredSize: new go.Size(100, 20),
              background: "limegreen",
              margin: 5,
              font: "bold 16px sans-serif",
              opacity: 0.75,
              stroke: "#404040"
            },
            new go.Binding("text", "key").makeTwoWay())
        ),  // end Horizontal Panel
        $(go.Placeholder,
          { padding: 5, alignment: go.Spot.TopLeft })
      )  // end Vertical Panel
    );

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "Rectangle", { fill: "#ACE600", stroke: null }),
      $(go.TextBlock,
        {
          margin: 5,
          font: "bold 13px sans-serif",
          opacity: 0.75,
          stroke: "#404040"
        },
        new go.Binding("text", "key").makeTwoWay())
    );

  diagram.layout = $(go.LayeredDigraphLayout,
                     { direction: 90, layerSpacing: 10 });

  diagram.initialContentAlignment = go.Spot.Center;

  diagram.model.nodeDataArray = [
    { key: "Alpha", isGroup: true },
    { key: "Beta", group: "Alpha" },
    { key: "Gamma", group: "Alpha" }
  ];
},
function(test) {
  var diagram = test.diagram;
  var group = diagram.findPartForKey("Alpha");
  var buttonpt = group.findObject("BUTTON").getDocumentPoint(go.Spot.Center);
  test.mouseDown(buttonpt, { timestamp: 0 });  // click Omega's SubGraphExpanderButton
  test.mouseUp(buttonpt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  var group = diagram.findPartForKey("Alpha");
  test.assert(test.isApproxPoint(group.position, new go.Point(0, 0)), "expected group to be positioned at (0, 0)");
  test.assert(test.isApproxPoint(group.location, new go.Point(1, 31)), "expected group to be located at (0, 0)");
  test.assert(test.isApproxSize(group.actualBounds.size, new go.Size(138.52, 32)), "expected group bounds to be 138.52x32");
}
));

t10.add(new Test('SubGraphCollapsedExpanded', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));
  diagram.groupTemplate =
    $(go.Group, "Auto",
      { layout: $(go.LayeredDigraphLayout,
                  { direction: 0, columnSpacing: 10 })
      },
      $(go.Shape,             // surrounds everything
        {figure: "RoundedRectangle", parameter1: 10,
        fill: "rgba(128,128,128,0.33)"
      }),
      $(go.Panel, "Vertical",  // position header above the subgraph
        {defaultAlignment: go.Spot.Left },
        $(go.Panel, "Horizontal",  // the header
          {defaultAlignment: go.Spot.Top },
          $("SubGraphExpanderButton", { name: "BUTTON" }),  // this Panel acts as a Button
          $(go.TextBlock,     // group title near top, next to button
            {font: "Bold 12pt Sans-Serif", height: 16.9 },
            new go.Binding("text", "key"))),
        $(go.Placeholder,     // represents area for all member parts
          {padding: new go.Margin(0, 10), background: "white" })));

  diagram.layout = $(go.LayeredDigraphLayout,
                     { direction: 90, layerSpacing: 10 });

  diagram.initialContentAlignment = go.Spot.Center;

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(33,14.3) },
    { key: "Omega", isGroup: true },
    { key: "Beta", size: new go.Size(27,14.3), group: "Omega" },
    { key: "Gamma", size: new go.Size(46,14.3), group: "Omega" },
    { key: "Epsilon", size: new go.Size(43,14.3), group: "Omega" },
    { key: "Zeta", size: new go.Size(25,14.3), group: "Omega" },
    { key: "Delta", size: new go.Size(30,14.3) }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Omega" }, // from a Node to the Group
    {from: "Beta", to: "Gamma" },  // this link is a member of the Group
    {from: "Beta", to: "Epsilon" },  // this link is a member of the Group
    {from: "Gamma", to: "Zeta" },  // this link is a member of the Group
    {from: "Epsilon", to: "Zeta" },  // this link is a member of the Group
    {from: "Omega", to: "Delta"}  // from the Group to a Node
  ];
},
function(test) {
  var diagram = test.diagram;
  var group = diagram.findPartForKey("Omega");
  var buttonpt = group.findObject("BUTTON").getDocumentPoint(go.Spot.Center);
  test.mouseDown(buttonpt, { timestamp: 0 });  // click Omega's SubGraphExpanderButton
  test.mouseUp(buttonpt, { timestamp: 200 });
  buttonpt = group.findObject("BUTTON").getDocumentPoint(go.Spot.Center);
  test.mouseDown(buttonpt, { timestamp: 1000 });  // click Omega's SubGraphExpanderButton
  test.mouseUp(buttonpt, { timestamp: 1200 });
},
function(test) {
  var diagram = test.diagram;
  assertAllNodePositions(test, [new go.Point(93.5, 0.0), new go.Point(0, 44.3), new go.Point(16.0, 79.4), new go.Point(87.6, 67.2), new go.Point(89.5, 91.5), new go.Point(179.0, 79.4), new go.Point(95.0, 141.8)]);
}
));


var t11 = new TestCollection('Selection');
intro.add(t11);

t11.add(new Test('Adornments', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")),
      { selectionAdornmentTemplate:
        $(go.Adornment, "Auto",
          $(go.Shape, "RoundedRectangle",
            { fill: null, stroke: "dodgerblue", strokeWidth: 8 }),
          $(go.Placeholder)) }
      );

  diagram.linkTemplate =
    $(go.Link,
      $(go.Shape, { strokeWidth: 2 }),
      $(go.Shape, { toArrow: "Standard" }),
      { selectionAdornmentTemplate:
        $(go.Adornment,
          $(go.Shape,
            { isPanelMain: true, stroke: "dodgerblue", strokeWidth: 8 }),
          $(go.Shape,
            { toArrow: "Standard", fill: "dodgerblue", stroke: null, scale: 2.5 })) });

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  diagram.commandHandler.selectAll();
},
null,
function(test) {
  var diagram = test.diagram;
  var it = diagram.nodes;
  while (it.next()) {
    var ad = it.value.findAdornment("Selection");
    test.assert(ad !== null && ad.elt(0).strokeWidth === 8, "No Adornment or its Shape.strokeWidth !== 8");
  }
  var it = diagram.links;
  while (it.next()) {
    var ad = it.value.findAdornment("Selection");
    test.assert(ad !== null && ad.elt(0).strokeWidth === 8, "No Adornment or its Shape.strokeWidth !== 8");
  }
}
));

t11.add(new Test('ComplexAdornments', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  function addNodeAndLink(e, b) {
    // take a button panel in an Adornment, get its Adornment, and then get its adorned Node
    var node = b.part.adornedPart;
    // we are modifying the model, so conduct a transaction
    var diagram = node.diagram;
    diagram.startTransaction("add node and link");
    // have the Model add the node data
    var newnode = { key: "N" };
    diagram.model.addNodeData(newnode);
    // and then add a link data connecting the original node with the new one
    var newlink = { from: node.data.key, to: newnode.key };
    diagram.model.addLinkData(newlink);
    // finish the transaction
    diagram.commitTransaction("add node and link");
  }

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray" }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")),
      { selectionAdornmentTemplate:
        $(go.Adornment, "Spot",
          $(go.Panel, "Auto",
            // this Adornment has a rectangular blue Shape around the selected node
            $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 3 }),
            $(go.Placeholder)),
          // and this Adornment has a Button to the right of the selected node
          $("Button", { name: "BUTTON" },
            { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left,
              click: addNodeAndLink },  // define click behavior for this Button in the Adornment
            $(go.TextBlock, "ADD",  // the Button content
              { font: "bold 6pt sans-serif" }))) }
      );

  diagram.layout = $(go.TreeLayout);

  diagram.model.nodeDataArray = [
    { key: "Alpha" },
    { key: "Beta" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  diagram.commandHandler.selectAll();
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Beta");
  var ad = node.findAdornment("Selection");
  var buttonpt = ad.findObject("BUTTON").getDocumentPoint(go.Spot.Center);
  test.mouseDown(buttonpt, { timestamp: 0 });  // click Beta's SubGraphExpanderButton
  test.mouseUp(buttonpt, { timestamp: 200 });
},
function(test) {
  var diagram = test.diagram;
  test.assert(diagram.nodes.count === 3, "Did not create a new node by clicking Button");
  test.assert(diagram.links.count === 2, "Did not create a new link by clicking Button");
}
));

t11.add(new Test('DataBinding', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray", strokeWidth: 2 },
        new go.Binding("stroke", "color")),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")),
      { selectionAdornmentTemplate:
        $(go.Adornment, "Auto",
          $(go.Shape,
            { fill: null, stroke: "dodgerblue", strokeWidth: 6 },
            new go.Binding("stroke", "color")),
          $(go.Placeholder)) }
      );

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0", color: "blue" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50", color: "red" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  diagram.commandHandler.selectAll();
},
null,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Beta");
  var ad = node.findAdornment("Selection");
  test.assert(ad.elt(0).stroke === node.data.color, "adornment's stroke color did not get bound to node data color");
}
));

t11.add(new Test('AppearanceChangesBinding', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { selectionAdorned: false },  // don't bother with any selection adornment
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "lightgray", strokeWidth: 2 },
        // when this Part.isSelected changes value, change this Shape.fill value:
        new go.Binding("fill", "isSelected", function(sel) {
          if (sel) return "cyan"; else return "lightgray";
        }).ofObject("")),  // The object named "" is the root visual element, the Node itself
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  var beta = diagram.findNodeForKey("Beta");
  beta.isSelected = true;
},
null,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Alpha");
  test.assert(!node.isSelected && node.elt(0).fill === "lightgray", "node was selected or its color was not lightgray");
  var ad = node.findAdornment("Selection");
  test.assert(ad === null, "should have no selection adornment");
  node = diagram.findPartForKey("Beta");
  test.assert(node.isSelected && node.elt(0).fill === "cyan", "node was not selected or its color was not cyan");
  ad = node.findAdornment("Selection");
  test.assert(ad === null, "should have no selection adornment");
}
));

t11.add(new Test('AppearanceChangesEvent', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  function onSelectionChanged(node) {
    var icon = node.findObject("Icon");
    if (icon !== null) {
      if (node.isSelected)
        icon.fill = "cyan";
      else
        icon.fill = "lightgray";
    }
  }

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      { selectionAdorned: false,  // don't bother with any selection adornment
        selectionChanged: onSelectionChanged
      },  // executed when Part.isSelected has changed
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape,
        { name: "Icon", figure: "RoundedRectangle", fill: "lightgray", strokeWidth: 2 }),
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key")));

  diagram.model.nodeDataArray = [
    { key: "Alpha", size: new go.Size(49.52284749830794,30.822847498307937), loc: "0 0" },
    { key: "Beta", size: new go.Size(43.52284749830794,30.822847498307937), loc: "200 50" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  var beta = diagram.findNodeForKey("Beta");
  beta.isSelected = true;
},
null,
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Alpha");
  test.assert(!node.isSelected && node.elt(0).fill === "lightgray", "node was selected or its color was not lightgray");
  var ad = node.findAdornment("Selection");
  test.assert(ad === null, "should have no selection adornment");
  node = diagram.findPartForKey("Beta");
  test.assert(node.isSelected && node.elt(0).fill === "cyan", "node was not selected or its color was not cyan");
  ad = node.findAdornment("Selection");
  test.assert(ad === null, "should have no selection adornment");
}
));


var t12 = new TestCollection('Tooltips');
intro.add(t12);

function setupToolTipDiagram(diagram) {
  diagram.reset();
  diagram.tooltipConversions = 0;
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "white" },
        new go.Binding("fill", "color")),
      $(go.Panel, "Vertical",
        $(go.TextBlock, { margin: 5 },
          new go.Binding("text", "key")),
        $(go.Panel, "Horizontal",
          new go.Binding("itemArray", "items"),
          { // each item is a colored square with its own tooltip showing the color name
            name: "PANEL",
            alignment: go.Spot.Left,
            height: 10,
            itemTemplate:
              $(go.Panel,
                $(go.Shape,
                  { width: 10, height: 10, strokeWidth: 0 },
                  new go.Binding("fill", "")),
                {
                  toolTip:
                    $(go.Adornment, "Auto",
                      { background: "yellow" },
                      $(go.TextBlock,
                        new go.Binding("text", "", function(t) { diagram.tooltipConversions++; return t; }))
                    )
                }
              )
          })
      ),
      {
        toolTip:  // define a tooltip for each node that displays the color as text
        $(go.Adornment, "Auto",
          $(go.Shape, { fill: "#FFFFCC" }),
          $(go.TextBlock, { margin: 4 },
            new go.Binding("text", "color")))
      });

  // a function that produces the content of the diagram tooltip
  function diagramInfo(model) {
    return "Model:\n" + model.nodeDataArray.length + " nodes, " + model.linkDataArray.length + " links";
  }

  // provide a tooltip for the background of the Diagram, when not over any Part
  diagram.toolTip =
    $(go.Adornment, "Auto",
      $(go.Shape, { fill: "#CCFFCC" }),
      $(go.TextBlock, { margin: 4 },
        // use a converter to display information about the diagram model
        new go.Binding("text", "", diagramInfo)));

  diagram.model.nodeDataArray = [
    { key: "Alpha", color: "lightblue", items: ["blue", "green", "red"] },
    { key: "Beta", color: "pink" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
}

t12.add(new Test('Node', diagram,
function(test) {
  var diagram = test.diagram;
  setupToolTipDiagram(diagram);
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Beta");
  test.assert(node.adornments.count === 0, "new node should not have any Adornments");
  var pt = node.getDocumentPoint(go.Spot.Center);
  test.mouseMove(pt, { timestamp: 0 });
  diagram.currentTool.doWaitAfter(diagram.lastInput);  // simulate standardWaitAfter timeout
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Beta");
  var adslayer = diagram.findLayer("Tool");
  test.assert(adslayer !== null && adslayer.parts.count === 1, "diagram should have a ToolTip Adornment " + adslayer.parts.count);
  test.assert(node.adornments.count === 1, "new node should have a ToolTip Adornment");
  var tt = node.adornments.first();
  test.assert(tt !== null && tt === node.toolTip, "node should be showing its .toolTip");
  test.assert(tt.elt(1).text === "pink", "tooltip should be showing the color name, pink");
}
));

t12.add(new Test('Array Item', diagram,
  function(test) {
    var diagram = test.diagram;
    setupToolTipDiagram(diagram);
  },
  function(test) {
    var diagram = test.diagram;
    var node = diagram.findPartForKey("Alpha");
    test.assert(node.adornments.count === 0, "new node should not have any Adornments");
    var panel = node.findObject("PANEL");
    var element = panel.elt(1);
    test.assert(element instanceof go.Panel && element.elt(0) instanceof go.Shape && element.elt(0).fill === "green", "second item isn't green");
    var pt = element.getDocumentPoint(go.Spot.Center);
    test.mouseMove(pt, { timestamp: 0 });
    diagram.currentTool.doWaitAfter(diagram.lastInput);  // simulate standardWaitAfter timeout
  },
  function(test) {
    var diagram = test.diagram;
    var node = diagram.findPartForKey("Alpha");
    var adslayer = diagram.findLayer("Tool");
    test.assert(adslayer !== null && adslayer.parts.count === 1, "diagram should have a ToolTip Adornment " + adslayer.parts.count);
    test.assert(node.adornments.count === 1, "new node should have a ToolTip Adornment");
    var tt = node.adornments.first();
    test.assert(tt !== null && tt !== node.toolTip, "node should be showing its .toolTip");
    test.assert(tt.elt(0).text === "green", "tooltip should be showing the color name, green");
    test.assert(diagram.tooltipConversions === 1, "tooltip should have been data bound only once");
  }
));

t12.add(new Test('Node element removed', diagram,
function(test) {
  var diagram = test.diagram;
  setupToolTipDiagram(diagram);
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Alpha");
  node.toolTip = null;  // no tooltip for whole node, to avoid accidentally getting this tooltip after removing the item element
  test.assert(node.adornments.count === 0, "new node should not have any Adornments");
  var pt = node.findObject("PANEL").elt(2).getDocumentPoint(go.Spot.Center);
  test.mouseMove(pt, { timestamp: 0 });
  diagram.currentTool.doWaitAfter(diagram.lastInput);

  var node = diagram.findPartForKey("Alpha");
  var adslayer = diagram.findLayer("Tool");
  test.assert(adslayer !== null && adslayer.parts.count === 1, "diagram should have a ToolTip Adornment " + adslayer.parts.count);
  test.assert(node.adornments.count === 1, "new node should have a ToolTip Adornment");
  var tt = node.adornments.first();
  test.assert(tt !== null && tt !== node.toolTip, "node should not be showing its Node.toolTip");
  test.assert(tt.elt(0).text === "red", "tooltip should be showing the color name, red");

  diagram.startTransaction("removing red item");
  diagram.model.removeArrayItem(node.data.items, 2);
  diagram.commitTransaction("removing red item");
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Alpha");
  var adslayer = diagram.findLayer("Tool");
  test.assert(node.adornments.count === 0, "should have removed tooltip in Node.adornments");
  test.assert(adslayer.parts.count === 0, "should have removed tooltip in Tool Layer");
}
));

t12.add(new Test('Diagram', diagram,
function(test) {
  var diagram = test.diagram;
  setupToolTipDiagram(diagram);
},
function(test) {
  var diagram = test.diagram;
  var pt = new go.Point(300, 100);
  var part = diagram.findPartAt(pt, false);
  test.assert(part === null, "oops, found a Part at 300,100");
  test.mouseMove(pt, { timestamp: 0 });
  diagram.currentTool.doWaitAfter(diagram.lastInput);
},
function(test) {
  var diagram = test.diagram;
  var adslayer = diagram.findLayer("Tool");
  test.assert(adslayer !== null && adslayer.parts.count === 1, "diagram should have a ToolTip Adornment " + adslayer.parts.count);
  var tt = adslayer.parts.first();
  test.assert(tt !== null && tt == diagram.toolTip, "should be showing the Diagram.toolTip");
  test.assert(tt.data === diagram.model, "diagram tooltip should be bound to Model");
  test.assert(tt.elt(1).text.indexOf("2 nodes, 1 links") > 0, "diagram tooltip should be showing '2 nodes, 1 links'");
}
));


var t13 = new TestCollection('ContextMenus');
intro.add(t13);

t13.add(new Test('ShiftUndo', diagram,
function(test) {
  var diagram = test.diagram;
  diagram.reset();
  // move all of the selected parts by a small offset
  function shiftSelection(e, obj) {
    diagram.startTransaction("shifted selection");
    var it = diagram.selection.iterator;
    while (it.next()) {
      var part = it.value;
      var pos = part.position.copy();
      part.position = pos.offset(5, 5);
    }
    diagram.commitTransaction("shifted selection");
  }

  // this is a normal Node template that also has a contextMenu defined for it
  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape,
        { figure: "RoundedRectangle", fill: "white" },
        new go.Binding("fill", "color")),
      $(go.TextBlock, { margin: 5 },
        new go.Binding("text", "key")),
      { contextMenu:     // define a context menu for each node
        $(go.Adornment, "Vertical",  // that has one button
          $("ContextMenuButton",
            $(go.TextBlock, "Shift"),
            { click: shiftSelection }))
      });

  // also define a context menu for the diagram's background
  diagram.contextMenu =
    $(go.Adornment, "Vertical",
      $("ContextMenuButton",
        $(go.TextBlock, "Undo"),
        { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
        new go.Binding("visible", "", function(o) { return o.diagram.commandHandler.canUndo(); }).ofObject()),
      $("ContextMenuButton",
        $(go.TextBlock, "Redo"),
        { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
        new go.Binding("visible", "", function(o) { return o.diagram.commandHandler.canRedo(); }).ofObject()));

  diagram.model.nodeDataArray = [
    { key: "Alpha", color: "lightblue" },
    { key: "Beta", color: "pink" }
  ];
  diagram.model.linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  diagram.undoManager.isEnabled = true;
},
function(test) {
  var diagram = test.diagram;
  var node = diagram.findPartForKey("Beta");
  var pt = node.getDocumentPoint(go.Spot.Center);
  test.mouseDown(pt, { timestamp: 0, button: 2 });  // right mouse button on Node
  test.mouseUp(pt, { timestamp: 200, button: 2 });
  test.log("??? NYI ContextMenus ShiftUndo");
  //var ad = node.findAdornment("ContextMenu");
  //test.assert(ad !== null, "Beta node should have a ContextMenu");
  //pt = ad.position.copy();
  //pt.x += ad.actualBounds.width / 2;
  //pt.y += 10;
  //var cm = diagram.findPartAt(pt, false);
  //test.assert(cm === ad, "Beta's ContextMenu is not found at: " + pt);
},
function(test) {
  var diagram = test.diagram;
  //??? ...
}
));




t4.add(new Test('Panel Padding', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    // define a simple Node template (but use the default Link template)
    diagram.nodeTemplate =
          $(go.Node,
            { defaultStretch: go.GraphObject.Horizontal, padding: 8, background: 'gray' },
             new go.Binding("type", "type"),
            $(go.Shape,
              { stroke: "lime", width: 50, height: 20 })
            );


    // create the model data that will be represented by Nodes and Links
    var nodeDataArray = [
      { key: "1", text: "LightBlue", type: go.Panel.Horizontal },
      { key: "2", text: "LightBlue", type: go.Panel.Vertical },
      { key: "3", text: "LightBlue", type: go.Panel.Auto },
      { key: "4", text: "LightBlue", type: go.Panel.Spot },
      { key: "5", text: "LightBlue", type: go.Panel.Viewbox },
      { key: "6", text: "LightBlue", type: go.Panel.Table },
      { key: "7", text: "LightBlue", type: go.Panel.Position },
    ];
    var linkDataArray = [
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
diagram.startTransaction('a');
diagram.commitTransaction('a');
for (var i = 1; i < 8; i++) {
  var n = diagram.findNodeForKey(i.toString());
  test.assert(n.actualBounds.width === 67);
  test.assert(n.actualBounds.height === 37);
  var elems = n.elements;
  elems.next();
  var e = elems.value;
  test.assert(e.actualBounds.equals(new go.Rect(8,8,51,21)));
}
    }, // END TEST
    null
));

t4.add(new Test("maxSize", null, function(test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightgreen" }),
        $(go.Picture, { minSize: new go.Size(20, 20) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightgreen" }),
        $(go.Picture, { minSize: new go.Size(20, 20), maxSize: new go.Size(210, 180) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightgreen" }),
        $(go.Picture, { minSize: new go.Size(20, 20), maxSize: new go.Size(Infinity, 300) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightgreen" }),
        $(go.Picture, { maxSize: new go.Size(210, 180) })
      ));


    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightblue" }),
        $(go.Shape, { minSize: new go.Size(20, 20) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightblue" }),
        $(go.Shape, { minSize: new go.Size(20, 20), maxSize: new go.Size(210, 180) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightblue" }),
        $(go.Shape, { minSize: new go.Size(20, 20), maxSize: new go.Size(Infinity, 300) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightblue" }),
        $(go.Shape, { maxSize: new go.Size(210, 180) })
      ));


    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightyellow" }),
        $(go.TextBlock, { minSize: new go.Size(20, 20) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightyellow" }),
        $(go.TextBlock, { minSize: new go.Size(20, 20), maxSize: new go.Size(210, 180) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightyellow" }),
        $(go.TextBlock, { minSize: new go.Size(20, 20), maxSize: new go.Size(Infinity, 300) })
      ));

    diagram.add(
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightyellow" }),
        $(go.TextBlock, { maxSize: new go.Size(210, 180) })
      ));
  },
  function(test) {
    var diagram = test.diagram;
    var n = new go.List().addAll(diagram.nodes).toArray();
    test.assert(n[0].actualBounds.size.equalsApprox(new go.Size(21, 21)), "Picture no maxSize isn't 21x21");
    test.assert(n[1].actualBounds.size.equalsApprox(new go.Size(21, 21)), "Picture large maxSize isn't 21x21");
    test.assert(n[2].actualBounds.size.equalsApprox(new go.Size(21, 21)), "Picture Infinite maxSize isn't 21x21");
    test.assert(n[3].actualBounds.size.equalsApprox(new go.Size(1, 1)), "Picture no minSize isn't 1x1");
    test.assert(n[4].actualBounds.size.equalsApprox(new go.Size(102, 102)), "Shape no maxSize isn't 102, 102");
    test.assert(n[5].actualBounds.size.equalsApprox(new go.Size(102, 102)), "Shape large maxSize isn't 102, 102");
    test.assert(n[6].actualBounds.size.equalsApprox(new go.Size(102, 102)), "Shape Infinite maxSize isn't 102, 102");
    test.assert(n[7].actualBounds.size.equalsApprox(new go.Size(102, 102)), "Shape no minSize isn't 102, 102");
    test.assert(n[8].actualBounds.size.equalsApprox(new go.Size(21, 21)), "TextBlock no maxSize isn't 21x21");
    test.assert(n[9].actualBounds.size.equalsApprox(new go.Size(21, 21)), "TextBlock large maxSize isn't 21x21");
    test.assert(n[10].actualBounds.size.equalsApprox(new go.Size(21, 21)), "TextBlock Infinite maxSize isn't 21x21");
    test.assert(n[11].actualBounds.size.equalsApprox(new go.Size(1, 15.3)), "TextBlock no minSize isn't 1x15.3");
  }));



intro.add(new Test('Panel TableRow/Column visibility', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
diagram.nodeTemplate =
  $(go.Node, "Table",
    { },
    $(go.Shape, "RoundedRectangle",
      { fill: "red"}),
    $(go.Shape, "RoundedRectangle",
      { fill: "palegreen", column: 1}),

    $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
      new go.Binding("portId", "name"),  // this Panel is a "port"
      {
        name: "ROW",
        //visible: false,
        row: 1
      },
      $(go.Shape,
        { width: 8, height: 8, column: 0,
          fromLinkable: false, toLinkable: false },
        new go.Binding("figure", "figure"),
        new go.Binding("fill", "color")),
      $(go.Shape, "RoundedRectangle",
      { fill: "palegreen", column: 1 }),
      $(go.Shape, "RoundedRectangle",
      { fill: "palegreen", column: 2 })
    )
  );






diagram.nodeTemplate.bind(new go.Binding("desiredSize", "size"));
diagram.model.nodeDataArray = [
{ key: "Beta"}
];
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

var beta = diagram.findNodeForKey('Beta');
var row = diagram.findNodeForKey('Beta').findObject('ROW');

test.assert(beta.rowCount === 2)
test.assert(beta.columnCount === 3)
test.assert(beta.actualBounds.toString() === "Rect(0,0,303,202)") // big

diagram.startTransaction('a');
row.visible = false;
diagram.commitTransaction('a');

test.assert(beta.rowCount === 2)
test.assert(beta.columnCount === 3)
test.assert(beta.actualBounds.toString() === "Rect(0,0,202,101)") // small

diagram.startTransaction('a');
row.visible = true;
diagram.commitTransaction('a');

test.assert(beta.rowCount === 2)
test.assert(beta.columnCount === 3)
test.assert(beta.actualBounds.toString() === "Rect(0,0,303,202)") // big

    }, // END TEST
    null
));


intro.add(new Test('LayoutRealtime', diagram,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.layout = new go.GridLayout();
      window.test = new Test('blah', diagram);
      var diagram = diagram;
      var d = diagram;
      // the layout for the entire diagram
      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          { selectable: true },
          {
            routing: go.Link.Orthogonal,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
        //   new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 })
        );

    diagram.model = go.Model.fromJSON(
        { "class": "GraphLinksModel",
  "nodeDataArray": [
  {"key":"A2","category":"Appliance","alertCount":0,"isGroup":true,"group":"g2"},
{"key":"A1","isGroup":true,"group":"g2"},
{"key":"2","group":"A1"},
{"key":"3","group":"A2"},
{"key":"4","group":"A2"},
{"key":"g2","isGroup":true,"group":"topLevel"}
],
  "linkDataArray": [
  {"from":"3","to":"4"}
]}
    )
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      var g = d.findNodeForKey('A2');
      d.maybeUpdate();
      g.isSelected = true;
      var tool = diagram.toolManager.draggingTool;
      var coll = new go.Set();
      coll.add(g);
      var oldWidth = g.actualBounds.width;
      var oldHeight = g.actualBounds.height;
      var dragtool = diagram.toolManager.findTool('Dragging');
      diagram.currentTool = dragtool;
      var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
      // diagram.startTransaction();
      tool.doActivate();
      tool.moveParts(coll2, new go.Point(50, -10), false);
      d.maybeUpdate();
      tool.moveParts(coll2, new go.Point(70, -50), false);
      d.maybeUpdate();
      tool.moveParts(coll2, new go.Point(80, -130), false);
      diagram.commitTransaction();
      tool.doDeactivate();
      test.assert(test.isApprox(g.actualBounds.width, oldWidth))
      test.assert(test.isApprox(g.actualBounds.height, oldHeight))

    }, // END TEST
    null
));

intro.add(new Test('LayoutRealtime2', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // the layout for the entire diagram
      d.layout = $(go.LayeredDigraphLayout
        , {isRealtime: false}
        );

      // define the node template for non-groups
      d.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, "Ellipse",
            new go.Binding("fill", "key")),
          $(go.TextBlock,
            //the text, color, and key are all bound to the same property in the node data
            new go.Binding("text", "key")));

      // define the group template
      d.groupTemplate =
        $(go.Group, "Auto",
          { // define the group's internal layout
            layout: $(go.LayeredDigraphLayout,
                      { direction: 90, columnSpacing: 10
                        ,isRealtime: false,

                       }),
            // the group begins unexpanded;
            // upon expansion, a Diagram Listener will generate contents for the group
          //  isSubGraphExpanded: false
          },
          $(go.Shape, "RoundedRectangle",
            { fill: null }),
          $(go.Panel, "Vertical",
            { defaultAlignment: go.Spot.Left },
            $(go.Panel, "Horizontal",
              { defaultAlignment: go.Spot.Top },
              // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
              $("SubGraphExpanderButton"),
              $(go.TextBlock,
                { font: "Bold 12pt Sans-Serif" },
                new go.Binding("text", "key"))),
            // create a placeholder to represent the area where the contents of the group are
            $(go.Placeholder,
              { padding: new go.Margin(0, 10) })));

        d.undoManager.isEnabled = true;

        d.model.addNodeData({ key: 'G1', isGroup: true });
        d.model.addNodeData({ key: 'lime', group: 'G1' });
        d.model.addNodeData({ key: 'G3', isGroup: true, group: 'G1' });
        d.model.addNodeData({ key: 'gray', group: 'G3' });
        d.model.addNodeData({ key: 'lightcoral', group: 'G3' });
        d.model.addNodeData({ key: 'G4', isGroup: true, group: 'G1' });
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var c = d.findNodeForKey('lightcoral');
      var pt = c.actualBounds.center;
      var g2 = d.findNodeForKey('G4');
      test.y = g2.actualBounds.center.y;

      // non-Realtime must be first, then realtime, or else test system has trouble

      d.maybeUpdate();
      c.isSelected = true;
      test.mouseDown(pt, { timestamp: 0 });  // at first Node center
      pt.y = 237;
      test.mouseMove(pt, { timestamp: 100 });  // should move "lightcoral" node
      d.maybeUpdate();
      // G2 did not move:
      test.assert(g2.actualBounds.center.y === test.y, "G4 should not have moved during the moving of 'lightcoral'");
      test.mouseUp(pt, { timestamp: 150 });
    }, // END TEST
    function(test) {
      var d = test.diagram;
      // G2 ended up in a different location:
      var g2 = d.findNodeForKey('G4');
      test.assert(g2.actualBounds.center.y !== test.y, "G4 should have been moved from y=" + test.y + " to something different due to group.layout");
    }
));

intro.add(new Test('Auto Panel', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { resizable: true, background: "rgb(0,0,255)", padding: 4, width: 60, height: 40 },
          $(go.Shape,
            { name: 'a', fill: "rgb(0,255,0)", stroke: "rgba(255,0,0,0.5)", strokeWidth: 4 }),
          $(go.TextBlock,
            { name: 'b', portId: "" },
            { stretch: go.GraphObject.Fill, background: "rgb(255,255,0)", margin: 6 },
            new go.Binding("text", "key"))
        );

      diagram.model = new go.GraphLinksModel([{ key: "Alpha" } ],[]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n1 = diagram.nodes.first();
      var a = n1.findObject('a');
      var b = n1.findObject('b');

      test.assert(n1.actualBounds.equals(new go.Rect(0, 0, 60, 40)));
      test.assert(a.actualBounds.equals(new go.Rect(4, 4, 52, 32)));
      test.assert(b.actualBounds.equals(new go.Rect(12, 12, 36, 16)));
    }, // END TEST
    null
));

intro.add(new Test('isOpposite', diagram,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding('isOpposite'),
          $(go.Shape, "RoundedRectangle", { width: 50, height: 50, strokeWidth: 0},
            new go.Binding("fill", "color")),
          $(go.TextBlock, { width: 60, height: 15, margin: 1 }, new go.Binding("text")),
          $(go.Shape, "Triangle", { fill: 'lime', height: 30, width: 60, strokeWidth: 1}),
          $(go.Shape, "Triangle", { fill: 'lime', height: 30, width: 60, strokeWidth: 1})
        );

      diagram.nodeTemplateMap.add('h',
        $(go.Node, "Horizontal",
          new go.Binding('isOpposite'),
          $(go.Shape, "RoundedRectangle", { width: 50, height: 50, strokeWidth: 0},
            new go.Binding("fill", "color")),
          $(go.TextBlock, { width: 60, height: 15, margin: 1 }, new go.Binding("text")),
          $(go.Shape, "Triangle", { fill: 'lime', height: 30, width: 60, strokeWidth: 1}),
          $(go.TextBlock, "Second txt", { width: 60, height: 30, margin: 1, stroke: 'red' })
        ));

      diagram.nodeTemplateMap.add('h2',
        $(go.Node, "Horizontal",
          { width: 300, height: 120, background: 'rgba(0,0,0,.2)' },
          new go.Binding('isOpposite'),
          $(go.Shape, "RoundedRectangle", { width: 50, height: 50, strokeWidth: 0},
            new go.Binding("fill", "color")),
          $(go.TextBlock, { width: 60, height: 15, margin: 1 }, new go.Binding("text")),
          $(go.Shape, "Triangle", { fill: 'lime', height: 30, width: 60, strokeWidth: 1}),
          $(go.TextBlock, "Second txt", { width: 60, height: 30, margin: 1, stroke: 'red' })
        ));

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue" },
        { key: 2, text: "Alpha",  isOpposite: true, color: "lightblue" },
        { key: 3, text: "Alpha", category: 'h', isOpposite: false, color: "lightblue" },
        { key: 4, text: "Alpha", category: 'h', isOpposite: true, color: "lightblue" },
        { key: 5, text: "Alpha", category: 'h2', isOpposite: false, color: "lightblue" },
        { key: 6, text: "Alpha", category: 'h2', isOpposite: true, color: "lightblue" },
      ],
      [
      ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var arr = [];
      for (var i = 1; i < diagram.nodes.count+1; i++) {
        var node = diagram.findNodeForKey(i);
        arr.push(node.elt(0).actualBounds.toString());
        arr.push(node.elt(1).actualBounds.toString());
        arr.push(node.elt(2).actualBounds.toString());
        arr.push(node.elt(3).actualBounds.toString());
      }

      var arr2 = ["Rect(6,0,50,50)", "Rect(1,51,60,15)", "Rect(0.5,67,61,31)", "Rect(0.5,98,61,31)",
      "Rect(6,79,50,50)", "Rect(1,63,60,15)", "Rect(0.5,31,61,31)", "Rect(0.5,0,61,31)", "Rect(0,0,50,50)",
      "Rect(51,17.5,60,15)", "Rect(112,9.5,61,31)", "Rect(174,10,60,30)", "Rect(185,0,50,50)", "Rect(124,17.5,60,15)",
      "Rect(62,9.5,61,31)", "Rect(1,10,60,30)", "Rect(0,35,50,50)", "Rect(51,52.5,60,15)", "Rect(112,44.5,61,31)",
      "Rect(174,45,60,30)", "Rect(250,35,50,50)", "Rect(189,52.5,60,15)", "Rect(127,44.5,61,31)", "Rect(66,45,60,30)"];
      for (var i = 0; i < arr2.length; i++) {
        test.assert(arr[i] === arr2[i]);
      }

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