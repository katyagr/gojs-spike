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
var intro = new TestCollection('Table tests');
TestRoot.add(intro);
var $ = go.GraphObject.make;



var t1 = new TestCollection('Tables');
intro.add(t1);

t1.add(new Test('All but stretch and span', null,
function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.clear();

  var nodes = [];
  window.nodes = nodes;

  diagram.startTransaction('testing')

  nodes.push(
    $(go.Node, "Table",  { location: new go.Point(0,0), background: 'rgba(255,255,0,.3)' },
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 0, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 0, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push(
    $(go.Node, "Table",  { location: new go.Point(30,0), background: 'rgba(255,255,0,.3)' },
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push(
    $(go.Node, "Table",  { location: new go.Point(30,70) },
      $(go.RowColumnDefinition, { column: 2, minimum: 32 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[3]
    $(go.Node, "Table",  { location: new go.Point(30,140) },
      $(go.RowColumnDefinition, { column: 2, maximum: 10 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[4]
    $(go.Node, "Table",  { location: new go.Point(30,210) },
      $(go.RowColumnDefinition, { column: 2, maximum: 15, minimum: 40 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[5]
    $(go.Node, "Table",  { location: new go.Point(30,210) },
      $(go.RowColumnDefinition, { column: 2, maximum: 15, minimum: 40, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[6]
    $(go.Node, "Table",  { location: new go.Point(100,0) },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[7]
    $(go.Node, "Table",  { location: new go.Point(100,70), width: 75 },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[8]
    $(go.Node, "Table",  { location: new go.Point(100,140), width: 99 },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add


  nodes.push( // nodes[9]
    $(go.Node, "Table",  { location: new go.Point(100,210), width: 40 },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[10]
    $(go.Node, "Table",  { location: new go.Point(100,210), maxSize: new go.Size(40, NaN) },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[11]
    $(go.Node, "Table",  { location: new go.Point(100,280), maxSize: new go.Size(40, NaN) },
      $(go.RowColumnDefinition, { column: 1, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[12]
    $(go.Node, "Table",  { location: new go.Point(200,0), maxSize: new go.Size(40, NaN) },
      $(go.RowColumnDefinition, { column: 2, width: 33 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      //$(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[13]
    $(go.Node, "Table",  { location: new go.Point(200,70) },
      $(go.RowColumnDefinition, { column: 0, width: 15 }),
      $(go.RowColumnDefinition, { column: 1, minimum: 33 }),
      $(go.RowColumnDefinition, { column: 2, maximum: 13 }),
      $(go.Shape, { row: 0, column: 0, width: 20, height: 20, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, width: 20, height: 20, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, width: 20, height: 20, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  nodes.push( // nodes[14]
    $(go.Node, "Table",  { location: new go.Point(200,140) },
      $(go.RowColumnDefinition, { column: 0, width: 21 }),
      $(go.RowColumnDefinition, { column: 1, width: 21 }),
      $(go.RowColumnDefinition, { column: 2, width: 21 }),
      $(go.RowColumnDefinition, { row: 0,   height: 21 }),
      $(go.RowColumnDefinition, { row: 1,   height: 21 }),
      $(go.RowColumnDefinition, { row: 2,   height: 21 }),
      $(go.Shape, { row: 0, column: 0, stretch: go.GraphObject.Fill, fill: 'rgba(0,0,200,.3)' }),
      $(go.Shape, { row: 1, column: 1, stretch: go.GraphObject.Fill, fill: 'rgba(0,200,0,.3)' }),
      $(go.Shape, { row: 2, column: 2, stretch: go.GraphObject.Fill, fill: 'rgba(200,0,0,.3)' })
    ) // end node
  ); // end diagram add

  for (var i = 0; i < nodes.length; i++) {
    diagram.add(nodes[i])
  }

  test.nodes = nodes;

  diagram.commitTransaction('testing')
},
null,
function (test) {
  var diagram = test.diagram;
  var d = diagram;

  var nodes = test.nodes;
  var elem, e;

  var nodes = test.nodes;
  test.assert(nodes[0].actualBounds.equals(new go.Rect(0,0,21,63)));

  test.assert(nodes[1].actualBounds.equals(new go.Rect(30,0,63,63)));
  elem = [];e=nodes[1].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(42,42,21,21)));

  test.assert(nodes[2].actualBounds.equals(new go.Rect(30,70,74,63))); // wider
  test.assert(nodes[2].getColumnDefinition(2).actual === 32);
  elem = [];e=nodes[2].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(47.5,42,21,21)));

  test.assert(nodes[3].actualBounds.equals(new go.Rect(30,140,52,63))); // less wide
  test.assert(nodes[3].getColumnDefinition(2).actual === 10);
  elem = [];e=nodes[3].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(36.5,42,21,21)));

  test.assert(nodes[4].actualBounds.equals(new go.Rect(30,210,82,63))); // less wide
  test.assert(nodes[4].getColumnDefinition(2).actual === 40); // minimum precedence
  elem = [];e=nodes[4].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(51.5,42,21,21)));

  test.assert(nodes[5].actualBounds.equals(nodes[4].actualBounds)); // better be identical to 4
  test.assert(nodes[5].actualBounds.equals(new go.Rect(30,210,82,63))); // better be identical to 4
  test.assert(nodes[5].getColumnDefinition(2).actual === 40); // minimum precedence

  test.assert(nodes[6].actualBounds.equals(new go.Rect(100,0,75,63))); // 75 width normally
  test.assert(nodes[6].getColumnDefinition(2).actual === 33); // set width
  elem = [];e=nodes[6].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(48,42,21,21)));

  test.assert(nodes[7].actualBounds.equals(new go.Rect(100,70,75,63))); // 75 width set hard
  test.assert(nodes[7].getColumnDefinition(2).actual === nodes[6].getColumnDefinition(2).actual); // set width should be same as 6
  test.assert(nodes[7].getColumnDefinition(2).actual === 33); // set width should be same as 6
  elem = [];e=nodes[7].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(48,42,21,21)));

  test.assert(nodes[8].actualBounds.equals(new go.Rect(100,140,99,63))); // 93 width normally
  test.assert(nodes[8].getColumnDefinition(0).actual === 33); // set width
  test.assert(nodes[8].getColumnDefinition(1).actual === 33); // set width
  test.assert(nodes[8].getColumnDefinition(2).actual === 33); // set width
  elem = [];e=nodes[8].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(6,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(39,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(72,42,21,21)));

  test.assert(nodes[9].actualBounds.equals(new go.Rect(100,210,40,63))); // 40 width set hard
  test.assert(nodes[9].getColumnDefinition(0).actual === 21); // naturally
  test.assert(nodes[9].getColumnDefinition(1).actual === 19); // not enough space for 21
  test.assert(nodes[9].getColumnDefinition(2).actual === 33); // set width, but completely cropped!
  elem = [];e=nodes[9].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(20,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(46,42,21,21)));

  test.assert(nodes[10].actualBounds.equals(new go.Rect(100,210,40,63))); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[10].actualBounds.equals(nodes[9].actualBounds)); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[10].getColumnDefinition(0).actual === 21); // naturally
  test.assert(nodes[10].getColumnDefinition(1).actual === 19); // not enough space for 21
  test.assert(nodes[10].getColumnDefinition(2).actual === 33); // set width, but completely cropped!
  elem = [];e=nodes[10].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(20,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(46,42,21,21)));

  test.assert(nodes[11].actualBounds.equals(new go.Rect(100,280,40,63))); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[11].getColumnDefinition(0).actual === 21); // naturally
  test.assert(nodes[11].getColumnDefinition(1).actual === 33); // not enough space for 21
  test.assert(nodes[11].getColumnDefinition(2).actual === 19); // set width, but completely cropped!
  elem = [];e=nodes[11].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(27,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(53,42,21,21)));

  test.assert(nodes[12].actualBounds.equals(new go.Rect(200,0,40,42))); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[12].getColumnDefinition(0).actual === 21); // naturally
  test.assert(nodes[12].getColumnDefinition(1).actual === 0);  // nothing in this column
  test.assert(nodes[12].getColumnDefinition(2).actual === 33); // set width, partially clipped
  elem = [];e=nodes[12].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));    // 1st shape blue
  test.assert(elem[1].actualBounds.equals(new go.Rect(27,21,21,21)));  // 3rd shape red

  test.assert(nodes[13].actualBounds.equals(new go.Rect(200,70,61,63))); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[13].getColumnDefinition(0).actual === 15); // naturally
  test.assert(nodes[13].getColumnDefinition(1).actual === 33); // not enough space for 21
  test.assert(nodes[13].getColumnDefinition(2).actual === 13); // set width, but completely cropped!
  elem = [];e=nodes[13].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(-3,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(44,42,21,21)));

  test.assert(nodes[14].actualBounds.equals(new go.Rect(200,140,63,63))); // 40 width set by max, should otherwise be identical to 9
  test.assert(nodes[14].getColumnDefinition(0).actual === 21); // naturally
  test.assert(nodes[14].getColumnDefinition(1).actual === 21); // not enough space for 21
  test.assert(nodes[14].getColumnDefinition(2).actual === 21); // set width, but completely cropped!
  elem = [];e=nodes[14].elements; while (e.next()) elem.push(e.value);
  test.assert(elem[0].actualBounds.equals(new go.Rect(0,0,21,21)));
  test.assert(elem[1].actualBounds.equals(new go.Rect(21,21,21,21)));
  test.assert(elem[2].actualBounds.equals(new go.Rect(42,42,21,21)));

}
));

t1.add(new Test('Hexagons', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 diagram.nodeTemplate =
$(go.Node, "Table", {  },
  $(go.Shape, "Triangle",
    { name: 'shape0', fill: 'red', width: 30, height: 30,
      row: 0, column: 0 }),
  $(go.Panel, "TableRow", { name: 'tr',row: 1, column: 1  },
    $(go.Shape, "Triangle", { name: 'shape1', fill: 'whitesmoke', width: 50, height: 30 }),
    $(go.Shape, "Triangle", { name: 'shape2', fill: 'rgba(0,0,255,.3)', width: 20, height: 30 }),
    $(go.Shape, "Triangle", { name: 'shape3', fill: 'rgba(0,255,105,.6)', width: 40, height: 30, column: 1 }),
    $(go.Shape, "Triangle", { name: 'shape4', fill: 'rgba(255,0,0,.3)', width: 50, height: 30, column: 1, row: 0 })
  ),
  $(go.Panel, "TableColumn", { name: 'tc',row: 1, column: 1  },
    $(go.Shape, "Hexagon", { name: 'shape5', fill: 'lime', width: 50, height: 30, row: 2 }),
    $(go.Shape, "Hexagon", { name: 'shape6', fill: 'rgba(0,0,255,.3)', width: 20, height: 30, row: 2 }),
    $(go.Shape, "Hexagon", { name: 'shape7', fill: 'rgba(0,255,105,.6)', width: 40, height: 30, column: 1, row: 2 }),
    $(go.Shape, "Hexagon", { name: 'shape8', fill: 'rgba(255,0,0,.3)', width: 50, height: 30, column: 1, row: 2 })
  )
)

  diagram.model.nodeDataArray = [
    {key:1}
  ];
    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (must do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
diagram.startTransaction('a');
diagram.commitTransaction('a');

var n1 = (diagram.findNodeForKey(1))
var s0 = n1.findObject('shape0');
var s1 = n1.findObject('shape1');
var s2 = n1.findObject('shape2');
var s3 = n1.findObject('shape3');
var s4 = n1.findObject('shape4');

test.assert(s0.row === 0)
test.assert(s0.column === 0)

test.assert(s1.row === 1)
test.assert(s1.column === 0) // Even though TableRow set it to 1, it does not inherit from TR

test.assert(s2.row === 1)
test.assert(s2.column === 0)

test.assert(s3.row === 1)
test.assert(s3.column === 1)

test.assert(s4.row === 1) // Even though it was set to zero, its in a TableRow = 1
test.assert(s4.column === 1)

    }, // END TEST
    null
));



var t2 = new TestCollection('Panels');
intro.add(t2);

  // http://www.w3.org/TR/CSS2/box.html
  //<HEAD>
  //  <TITLE>Examples of margins, padding, and borders</TITLE>
  //  <STYLE type="text/css">
  //    UL {
  //  background: yellow;
  //  margin: 12px 12px 12px 12px;
  //  padding: 3px 3px 3px 3px;
  //      /* No borders set */
  //}
  //LI {
  //  color: white;                /* text color is white */
  //  background: blue;            /* Content, padding will be blue */
  //  margin: 12px 12px 12px 12px;
  //  padding: 12px 0px 12px 12px; /* Note 0px padding right */
  //  list-style: none             /* no glyphs before a list item */
  //  /* No borders set */
  //}
  //LI.withborder {
  //  border-style: dashed;
  //  border-width: medium;        /* sets border width on all sides */
  //  border-color: lime;
  //}
  //</STYLE>
  //</HEAD>
  //<BODY>
  //<UL>
  //  <LI>First element of list
  //  <LI class="withborder">Second element of list is
  //a bit longer to illustrate wrapping.
  //</UL>
  //</BODY>
t2.add(new Test('Box model', null,
    null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      var sw = 10;  // stroke width around second item
      diagram.add(
        $(go.Part, "Vertical",
          { background: "yellow", margin: 10, padding: 10,  // BUT: margin has no effect for Parts
            defaultStretch: go.GraphObject.Horizontal, maxSize: new go.Size(200, NaN) },
          $(go.Panel,  // change LI padding to content (here a TextBlock) margin
            { background: "blue", margin: 10 },
            $(go.TextBlock, "First element of list",
              { stroke: "white", margin: new go.Margin(10, 0, 10, 10) })),
          $(go.Panel, "Auto",  // this is how we implement borders
            { background: "blue", margin: 10 },
            $(go.Shape, { fill: null, stroke: "lime", strokeWidth: sw, spot1: new go.Spot(0, 0, sw, sw), spot2: new go.Spot(1, 1, -sw, -sw) }),
            $(go.TextBlock, "Second element of list is a bit longer to illustrate wrapping.",
              { stroke: "white", margin: new go.Margin(10, 0, 10, 10) }))));
    }, // END TEST
    function (test) {
      var diagram = test.diagram;
      var it = diagram.parts;
      it.next();
      var part = it.value;
      var item0 = part.elt(0);
      test.assert(test.isApprox(item0.actualBounds.x, 20), "Item 0 isn't at X=20");
      var txt0 = item0.elt(0);
      test.assert(test.isApprox(txt0.actualBounds.x, 10), "TextBlock 0 isn't at X=10");
      var item1 = part.elt(1);
      test.assert(test.isApprox(item1.actualBounds.x, 20), "Item 1 isn't at X=20");
      var txt1 = item1.elt(1);
      //??? test.assert(test.isApprox(txt1.actualBounds.x, 20), "TextBlock 1 isn't at X=20");
    }  // END CHECK
));

t2.add(new Test('Box model 2', null,
    null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      var sw = 10;  // stroke width around second item
      diagram.add(
        $(go.Part, "Vertical",
          { background: "yellow", margin: 10, padding: 10,  // BUT: margin has no effect for Parts
            defaultStretch: go.GraphObject.Horizontal, maxSize: new go.Size(200, NaN) },
          $(go.Panel,  // change LI padding to content (here a TextBlock) margin
            { background: "blue", margin: 10 },
            $(go.TextBlock, "First element of list",
              { stroke: "white", margin: new go.Margin(10, 0, 10, 10) })),
          $(go.Panel, "Auto",  // this is how we implement borders
            { background: "blue", margin: 10 },
            $(go.Shape, { fill: null, stroke: "lime", strokeWidth: sw, spot1: new go.Spot(0, 0, sw, sw), spot2: new go.Spot(1, 1, -sw, -sw) }),
            $(go.Shape,  // replace TextBlock with Shape
              { width: 140, height: 43, fill: "white",
                stroke: null, strokeWidth: 0, margin: new go.Margin(10, 0, 10, 10) }))));
    }, // END TEST
    function (test) {
      var diagram = test.diagram;

    }  // END CHECK
));


t1.add(new Test('Spacing1', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
var $ = go.GraphObject.make;
  diagram.nodeTemplate =
    $(go.Node, "Table",
      {height: 130 },
      $(go.RowColumnDefinition, { row: 1, separatorStrokeWidth: 45, separatorStroke: 'lightblue',
        separatorDashArray: [1, 1, 2, 3, 5, 8, 13] }),
    //  $(go.RowColumnDefinition, { column: 1, separatorStrokeWidth: 10, separatorStroke: 'red',
    //    separatorDashArray: [3, 5, 4, 1, 2, 9] }),

      $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lightcoral',
         background: 'rgba(0,0,0,.4)',
         row: 0, column: 0
      }),

      $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lime',
         background: 'rgba(0,0,0,.4)',
         stretch: go.GraphObject.Fill,
         row: 1, column: 0
      }),

      $(go.Shape, { figure: 'Ellipse', strokeWidth: 1, stroke: 'orange',
         background: 'rgba(0,0,0,.4)', name: 'orange',
         height: 300,
         row: 0, column: 1, rowSpan: 2
      })

      );

  var m = new go.Model();
  var nodes = [];
  for (var i = 0; i < 1; i++) {
    nodes.push({});
  }



  m.nodeDataArray = nodes;

  diagram.model = m;

diagram.layout = $(go.GridLayout, {  });

diagram.startTransaction('a');
diagram.commitTransaction('a');


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
var n = diagram.nodes.first();
test.assert(n.actualBounds.width === 207);
test.assert(n.actualBounds.height === 130);
var o = n.findObject('orange')
test.assert(o.actualBounds.toString() === "Rect(106,0,101,301)")
    }, // END TEST
    null
));






t1.add(new Test('Spacing2', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Table",
         // {height: 150 },
          $(go.RowColumnDefinition, { row: 1, separatorStrokeWidth: 45, separatorStroke: 'lightblue',
            separatorDashArray: [1, 1, 2, 3, 5, 8, 13] }),
        //  $(go.RowColumnDefinition, { column: 1, separatorStrokeWidth: 10, separatorStroke: 'red',
        //    separatorDashArray: [3, 5, 4, 1, 2, 9] }),

          $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lightcoral',
             background: 'rgba(0,0,0,.4)', name: 'coral',  fill: ('rgba(255,0,100,.3)'),
             row: 0, column: 0
          }),

          $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lime',
             background: 'rgba(0,0,0,.4)', name: 'lime',  fill: ('rgba(0,255,0,.3)'),
             stretch: go.GraphObject.Fill,
             row: 1, column: 0
          }),

         /* $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'orange',
             background: 'rgba(0,0,0,.4)',
             row: 1, column: 1
          }),*/

          $(go.Shape, { figure: 'Ellipse', strokeWidth: 1, stroke: 'orange',
             background: 'rgba(0,0,0,.4)', name: 'orange', fill: ('rgba(255,0,0,.3)'),
             height: 300,
             row: 0, column: 1, rowSpan: 2
          }));

      var m = new go.Model();
      var nodes = [];
      for (var i = 0; i < 1; i++) {
        nodes.push({});
      }

      m.nodeDataArray = nodes;

      diagram.model = m;

      diagram.layout = $(go.GridLayout, {  });

      diagram.startTransaction('a');
      diagram.commitTransaction('a');

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();
      test.assert(n.actualBounds.width === 207);
      test.assert(n.actualBounds.height === 301);
      var o = n.findObject('orange')
      test.assert(o.actualBounds.toString() === "Rect(106,0,101,301)");

      var o = n.findObject('lime')
      test.assert(o.actualBounds.toString() === "Rect(0,151,106,150)");

      var o = n.findObject('coral')
      test.assert(o.actualBounds.toString() === "Rect(0,0,106,106)");
    }, // END TEST
    null
));

t1.add(new Test('Spacing3', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
  var $ = go.GraphObject.make;
  diagram.nodeTemplate =
    $(go.Node, "Table",
     // {height: 150 },
      $(go.RowColumnDefinition, { row: 1, separatorStrokeWidth: 45, separatorStroke: 'lightblue',
        separatorDashArray: [1, 1, 2, 3, 5, 8, 13] }),
    //  $(go.RowColumnDefinition, { column: 1, separatorStrokeWidth: 10, separatorStroke: 'red',
    //    separatorDashArray: [3, 5, 4, 1, 2, 9] }),

      $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lightcoral',
         background: 'rgba(0,0,0,.4)', name: 'coral',
         row: 0, column: 0
      }),

      $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'lime',
         background: 'rgba(0,0,0,.4)', name: 'lime',
         stretch: go.GraphObject.Fill,
         row: 1, column: 0
      }),

      $(go.Shape, { figure: 'Triangle', strokeWidth: 6, stroke: 'orange',
         background: 'rgba(0,0,0,.4)', name: 'tri',
         row: 1, column: 1
      }),

      $(go.Shape, { figure: 'Ellipse', strokeWidth: 1, stroke: 'orange',
         background: 'rgba(0,0,0,.4)', name: 'orange',
         height: 300,
         row: 0, column: 1, rowSpan: 2
      })

      );

  var m = new go.Model();
  var nodes = [];
  for (var i = 0; i < 1; i++) {
    nodes.push({});
  }



  m.nodeDataArray = nodes;

  diagram.model = m;

diagram.layout = $(go.GridLayout, {  });

diagram.startTransaction('a');
diagram.commitTransaction('a');



    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
var n = diagram.nodes.first();
test.assert(n.actualBounds.width === 212);
test.assert(n.actualBounds.height === 301);
var o = n.findObject('orange')
test.assert(o.actualBounds.toString() === "Rect(108.5,0,101,301)");

var o = n.findObject('lime')
test.assert(o.actualBounds.toString() === "Rect(0,151,106,150)");

var o = n.findObject('coral')
test.assert(o.actualBounds.toString() === "Rect(0,0,106,106)");

// importantly this is pushed down the right amount (y = 173)
// so as to be "centered" in the logical space of the cell, which excludes the spacing
var o = n.findObject('tri')
test.assert(o.actualBounds.toString() === "Rect(106,173,106,106)");
    }, // END TEST
    null
));


var t3 = new TestCollection('TableRows');
intro.add(t3);
t3.add(new Test('TableRows1', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      // This template is a Panel that is used to represent each item in a Panel.itemArray.
      // The Panel is data bound to the item object.
      var fieldTemplate =
        $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
          new go.Binding("portId", "name"),  // this Panel is a "port"
          { background: "transparent",  // so this port's background can be picked by the mouse
            fromSpot: go.Spot.Right,  // links only go from the right side to the left side
            toSpot: go.Spot.Left,
            fromLinkable: true, toLinkable: true },  // allow drawing links from or to this port
          $(go.Shape,
            { width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
              fromLinkable: false, toLinkable: false },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color"))
        );

      // This template represents a whole "record".
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { movable: false,
            copyable: false,
            deletable: false },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape,
            { fill: "#EEEEEE" }),
          $(go.Panel, "Vertical",
            $(go.Panel, "Auto",
              { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
              $(go.Shape,
                { fill: "#1570A6", stroke: null }),
              $(go.TextBlock,
                { alignment: go.Spot.Center,
                  margin: 3,
                  desiredSize: new go.Size(70,15),
                  stroke: "white",
                  textAlign: "center",
                  font: "bold 12pt sans-serif" },
                new go.Binding("text", "key"))),
            $(go.Panel, "Table",
              { padding: 2, name: 'table',
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                itemTemplate: fieldTemplate },
              new go.Binding("itemArray", "fields")
            )  // end Table Panel of items
          )  // end Vertical Panel
        );  // end Node


      diagram.model =
        $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              { key: "Record1",
                fields: [
                  { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                  { name: "field2", info: "the second one", color: "#F25022", figure: "Ellipse" }
                ],
                loc: "0 0" },
              { key: "Record2",
                fields: [
                  { name: "fieldA", info: "",       color: "#FFB900", figure: "Diamond" },
                  { name: "fieldB", info: "",       color: "#F25022", figure: "Rectangle" },
                  { name: "fieldC", info: "",       color: "#7FBA00", figure: "Diamond" },
                  { name: "fieldD", info: "fourth", color: "#00BCF2",  figure: "Rectangle" },
                  { name: "fieldD", info: "fourth", color: "#00BCF2",  figure: "Rectangle" }
                ],
                loc: "250 0" }
            ],
            linkDataArray: [ ]
          });

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;



  var a = diagram.findNodeForKey('Record1');
  var b = diagram.findNodeForKey('Record2');
  test.assert(test.isApproxRect(a.actualBounds, new go.Rect(0,0,105,71)))
  test.assert(test.isApproxRect(b.actualBounds, new go.Rect(250,0,105,137)))
  var ta = a.findObject('table');
  var tb = b.findObject('table');
  test.assert(ta.rowCount    === 2);
  test.assert(ta.columnCount === 1);
  test.assert(tb.rowCount    === 5);
  test.assert(tb.columnCount === 1);

    }, // END TEST
    null
));




t3.add(new Test('TableRows invis', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      // This template is a Panel that is used to represent each item in a Panel.itemArray.
      // The Panel is data bound to the item object.
      var fieldTemplate =
        $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
          new go.Binding("portId", "name"),  // this Panel is a "port"
          new go.Binding("visible", "visible"),
          { background: "transparent",  // so this port's background can be picked by the mouse
            fromSpot: go.Spot.Right,  // links only go from the right side to the left side
            toSpot: go.Spot.Left,
            fromLinkable: true, toLinkable: true },  // allow drawing links from or to this port
          $(go.Shape,
            { width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
              fromLinkable: false, toLinkable: false },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color"))
        );

      // This template represents a whole "record".
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { movable: false,
            copyable: false,
            deletable: false },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape,
            { fill: "#EEEEEE" }),
          $(go.Panel, "Vertical",
            $(go.Panel, "Auto",
              { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
              $(go.Shape,
                { fill: "#1570A6", stroke: null }),
              $(go.TextBlock,
                { alignment: go.Spot.Center,
                  margin: 3,
                  desiredSize: new go.Size(70,15),
                  stroke: "white",
                  textAlign: "center",
                  font: "bold 12pt sans-serif" },
                new go.Binding("text", "key"))),
            $(go.Panel, "Table",
              { padding: 2, name: 'table',
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                itemTemplate: fieldTemplate },
              new go.Binding("itemArray", "fields")
            )  // end Table Panel of items
          )  // end Vertical Panel
        );  // end Node


      diagram.model =
        $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              { key: "Record1",
                fields: [
                  { name: "field1", info: "", color: "#F7B84B", figure: "Ellipse" },
                  { name: "field2", info: "the second one", color: "#F25022", figure: "Ellipse" }
                ],
                loc: "0 0" },
              { key: "Record2",
                fields: [
                  { visible: false, name: "fieldA", info: "",       color: "#FFB900", figure: "Diamond" },
                  { visible: false, name: "fieldB", info: "",       color: "#F25022", figure: "Rectangle" },
                  { visible: false, name: "fieldC", info: "",       color: "#7FBA00", figure: "Diamond" },
                  { name: "fieldD", info: "fourth", color: "#00BCF2",  figure: "Rectangle" },
                  { name: "fieldD", info: "fourth", color: "#00BCF2",  figure: "Rectangle" }
                ],
                loc: "250 0" }
            ],
            linkDataArray: [ ]
          });
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
  var a = diagram.findNodeForKey('Record1');
  var b = diagram.findNodeForKey('Record2');


  var ta = a.findObject('table');
  var tb = b.findObject('table');
  test.assert(ta.rowCount    === 2);
  test.assert(ta.columnCount === 1);
  test.assert(tb.rowCount    === 5);
  test.assert(tb.columnCount === 1);
  test.assert(test.isApproxRect(a.actualBounds, new go.Rect(0,0,105,71)))
  test.assert(test.isApproxRect(b.actualBounds, new go.Rect(250,0,105,71)))
    }, // END TEST
    null
));

var t4 = new TestCollection('More Table Tests');
intro.add(t4);

t4.add(new Test('Spacing', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          desiredSize: new go.Size(120, 80),
          background: 'rgba(250,0,0,.3)', resizable: true
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("position", "pos"),
        $(go.TextBlock,
          {
            row: 0, column: 0, width: 60, height: 14,
            angle: 0, background: "lightgreen",
            editable: true, textAlign: "center"
          },
          new go.Binding("text").makeTwoWay()
        ),
        // drawn before column 1:
        $(go.RowColumnDefinition, { column: 1, maximum: 40, separatorStrokeWidth: 30, separatorStroke: "black" }),
        $(go.Shape, "Rectangle",
          {
            row: 0, column: 1,
            stroke: 'red', fill: "rgba(0,0,255,0.3)", strokeWidth: 4,
            portId: "", fromLinkable: true, toLinkable: true,
            fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
            stretch: go.GraphObject.Fill
          })
        );


    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Gamma", pos: new go.Point(0, 0), color: "lightgreen" },
      { key: "Gamma", pos: new go.Point(140, 0), color: "lightgreen", size: "100, 80" },
      { key: "Gamma", pos: new go.Point(140, 100), color: "lightgreen", size: "180, 80" },
      { key: "Gamma", pos: new go.Point(0, 100), color: "lightgreen", size: "90, 80" }
    ],
    [
    ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
var abs = ['Rect(0,33,60,14)Rect(90,0,30,80)Rect(0,0,120,80)',
'Rect(0,33,60,14)Rect(90,0,10,80)Rect(140,0,100,80)',
'Rect(11.53846153846154,33,60,14)Rect(113.07692307692308,0,40,80)Rect(140,100,180,80)',
'Rect(15,33,60,14)Rect(90,0,0,80)Rect(0,100,90,80)'];
var i = 0;

  var nodes = diagram.nodes;
  while (nodes.next()) {
    var n = nodes.value;
    test.assert(abtree(n) === abs[i]);
    i++;
  }

function abtree(node, str) {
  if (str === undefined) str = '';
  var elems = node.elements;
  while (elems.next()) {
    var e = elems.value;
    if (e instanceof go.Panel) str += abtree(e, '');
    str += e.actualBounds.toString();
  }
  str += node.actualBounds.toString();
  return str;
}
    }, // END TEST
    null
));


t4.add(new Test('Spreadsheet', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

    function textStyle(big) {
      return {
        stroke: "white",
        font: (big ? "16pt sans-serif" : "10pt sans-serif"),
        alignment: go.Spot.Left,
        height: (big ? 22 : 14)
      };
    }

    function borderStyle() {
      return {
        fill: "cornflowerblue",
        stroke: "blue",
        strokeWidth: 2
      };
    }

    var aggregatedValue =
      $(go.Panel, "Auto",
        { margin: 5 },
        $(go.Shape, borderStyle()),
        $(go.TextBlock, textStyle(),
          { margin: 10, width: 50 },
          new go.Binding("text", "")));  // assume just a number or a string

    var aggregatedListH =
      $(go.Panel, "Auto",
        { margin: 4, stretch: go.GraphObject.Fill },
        $(go.Shape, borderStyle()),
        $(go.Panel, "Table",
          { padding: 5, alignment: go.Spot.Left, stretch: go.GraphObject.Fill,
            defaultAlignment: go.Spot.Left, defaultStretch: go.GraphObject.Horizontal },
          $(go.TextBlock, textStyle(),
            { row: 0, width: 150 },
            new go.Binding("text", "header")),
          $(go.Panel, "Horizontal",
            { row: 1, itemTemplate: aggregatedValue },
            new go.Binding("itemArray", "values"))));

    var aggregatedListV =
      $(go.Panel, "Auto",
        { margin: 4, stretch: go.GraphObject.Fill },
        $(go.Shape, borderStyle()),
        $(go.Panel, "Vertical",
          { padding: 5, alignment: go.Spot.Top, defaultAlignment: go.Spot.Left },
          $(go.TextBlock, textStyle(),
            { width: 70 },
            new go.Binding("text", "header")),
          $(go.Panel, "Vertical",
            { itemTemplate: aggregatedValue },
            new go.Binding("itemArray", "values"))));

    var checkBoxTemplate =
      $("CheckBox", "checked",
        $(go.TextBlock, textStyle(),
          { width: 90 },
          new go.Binding("text", "label")
        )
      );

    diagram.nodeTemplate =
      $(go.Node, "Table",
        // the title
        $(go.Panel, "Auto",
          { row: 0, column: 0, columnSpan: 3, stretch: go.GraphObject.Fill },
          $(go.Shape, borderStyle()),
          $(go.TextBlock, textStyle(true),
            { margin: 10, width: 127, alignment: go.Spot.Center },
            new go.Binding("text", "title"))),

        // insert an empty row and an empty column
        $(go.RowColumnDefinition, { row: 1, height: 8 }),
        $(go.RowColumnDefinition, { column: 1, width: 8 }),

        // the aggregated values
        $(go.Panel, "Auto",
          { row: 2, column: 0, stretch: go.GraphObject.Fill },
          $(go.Shape, borderStyle()),
          $(go.Panel, "Table",
            { padding: 4 },
            $(go.TextBlock, textStyle(true),
              { width: 150 },
              new go.Binding("text", "aggTitle")),

            // The B Aggregated Values
            $(go.Panel, "Auto",
              { column: 0, row: 1, stretch: go.GraphObject.Fill, margin: new go.Margin(10, 0) },
              $(go.Shape, borderStyle()),
              $(go.Panel, "Table",
                { padding: 4, stretch: go.GraphObject.Fill, defaultStretch: go.GraphObject.Fill },
                $(go.TextBlock, textStyle(true),
                  { width: 250 },
                  { row: 0 },
                  new go.Binding("text", "aggHeaderB")),
                $(go.Panel, "Horizontal",
                  { row: 1 },
                  { itemTemplate: aggregatedValue },
                  new go.Binding("itemArray", "aggValuesB")))),

            // Now the C Aggregated Values
            $(go.Panel, "Auto",
              { column: 0, row: 2, alignment: go.Spot.TopLeft },
              $(go.Shape, borderStyle()),
              $(go.Panel, "Table",
                { padding: 4, stretch: go.GraphObject.Fill, defaultStretch: go.GraphObject.Fill },
                $(go.TextBlock, textStyle(true),
                  { width: 250 },
                  { row: 0, column: 0, columnSpan: 2 },
                  new go.Binding("text", "aggSubtitle")),
                $(go.Panel, "Vertical",
                  { row: 1, column: 0, alignment: go.Spot.Left },
                  { itemTemplate: aggregatedListH },
                  new go.Binding("itemArray", "aggValuesH")),
                $(go.Panel, "Horizontal",
                  { row: 1, column: 1, alignment: go.Spot.Left },
                  { itemTemplate: aggregatedListV },
                  new go.Binding("itemArray", "aggValuesV")))))),

        // the checkboxes
        $(go.Panel, "Auto",
          { row: 2, column: 2, stretch: go.GraphObject.Fill },
          $(go.Shape, borderStyle()),
          $(go.Panel, "Vertical",
            { padding: 4, defaultAlignment: go.Spot.Left, stretch: go.GraphObject.Vertical, alignment: go.Spot.Top },
            $(go.TextBlock, textStyle(true),
              { width: 100 },
              new go.Binding("text", "choices")),
            $(go.Panel, "Vertical",
              { itemTemplate: checkBoxTemplate },
              new go.Binding("itemArray", "checkBoxes"))))
        );

    diagram.model.nodeDataArray = [
      {
        title: "The Main Title",

        aggTitle: "A-Aggregated Values (from B and C)",

        aggHeaderB: "B-Aggregated Values (from B1-B2)",
        aggValuesB: [101.01, 102.02],

        aggSubtitle: "C-Aggregated Values (from D, E, F, and G)",
        aggValuesH: [
          {
            header: "D-Aggregated Values (from D1..Dx)",
            values: [1.01, 2.02, 3.03, 4.04]
          },
          {
            header: "E-Aggregated Values (from E1..Ex)",
            values: [11.01, 12.02]
          },
          {
            header: "F-Aggregated Values (from F1..Fx)",
            values: [21.01, 22.02, 23.03, 24.04, 25.05]
          }
        ],

        aggValuesV: [
          {
            header: "G-Aggregated Values (from G1..Gx)",
            values: [31.01, 32.02, 33.03]
          }
        ],

        choices: "Check Boxes",
        checkBoxes: [
          { label: "Checkbox 1", checked: true },
          { label: "Checkbox 2", checked: false },
          { label: "Checkbox 3", checked: true },
          { label: "Checkbox 4" }
        ]
      }
    ];




    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var abs = ['Rect(0,0,677,44)Rect(275,11,127,22)Rect(0,0,677,44)Rect(0,0,677,44)Rect(0,0,552,402)Rect(4,4,150,22)Rect(0,0,542,78)Rect(4,4,250,22)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,5,72,36)Rect(5,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(87,5,72,36)Rect(87,5,72,36)Rect(4,26,532,46)Rect(4,26,532,46)Rect(1,1,540,76)Rect(1,1,540,76)Rect(4,36,542,78)Rect(4,36,542,78)Rect(0,0,542,272)Rect(4,4,250,22)Rect(0,0,422,72)Rect(5,5,150,14)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,5,72,36)Rect(5,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(87,5,72,36)Rect(87,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(169,5,72,36)Rect(169,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(251,5,72,36)Rect(251,5,72,36)Rect(5,19,410,46)Rect(5,19,410,46)Rect(0,1,420,70)Rect(0,1,420,70)Rect(4,4,422,72)Rect(4,4,422,72)Rect(0,0,422,72)Rect(5,5,150,14)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,5,72,36)Rect(5,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(87,5,72,36)Rect(87,5,72,36)Rect(5,19,410,46)Rect(5,19,410,46)Rect(0,1,420,70)Rect(0,1,420,70)Rect(4,84,422,72)Rect(4,84,422,72)Rect(0,0,422,72)Rect(5,5,150,14)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,5,72,36)Rect(5,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(87,5,72,36)Rect(87,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(169,5,72,36)Rect(169,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(251,5,72,36)Rect(251,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(333,5,72,36)Rect(333,5,72,36)Rect(5,19,410,46)Rect(5,19,410,46)Rect(0,1,420,70)Rect(0,1,420,70)Rect(4,164,422,72)Rect(4,164,422,72)Rect(4,26,430,240)Rect(4,26,430,240)Rect(0,0,94,232)Rect(5,5,70,14)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,5,72,36)Rect(5,5,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,51,72,36)Rect(5,51,72,36)Rect(0,0,72,36)Rect(10,11,50,14)Rect(5,97,72,36)Rect(5,97,72,36)Rect(5,19,82,138)Rect(5,19,82,138)Rect(1,0,92,162)Rect(1,0,92,162)Rect(4,4,94,232)Rect(4,4,94,232)Rect(434,26,102,240)Rect(434,26,102,240)Rect(1,1,540,270)Rect(1,1,540,270)Rect(4,124,542,272)Rect(4,124,542,272)Rect(1,1,550,400)Rect(1,1,550,400)Rect(0,52,552,402)Rect(0,52,552,402)Rect(0,0,117,402)Rect(4,4,100,22)Rect(0,0,14,14)Rect(1.5,1.5,11,11)Rect(0,0,14,14)Rect(0,0,14,14)Rect(15,0,90,14)Rect(1,1,105,14)Rect(1,1,105,14)Rect(0,0,14,14)Rect(NaN,NaN,NaN,NaN)Rect(0,0,14,14)Rect(0,0,14,14)Rect(15,0,90,14)Rect(1,17,105,14)Rect(1,17,105,14)Rect(0,0,14,14)Rect(1.5,1.5,11,11)Rect(0,0,14,14)Rect(0,0,14,14)Rect(15,0,90,14)Rect(1,33,105,14)Rect(1,33,105,14)Rect(0,0,14,14)Rect(NaN,NaN,NaN,NaN)Rect(0,0,14,14)Rect(0,0,14,14)Rect(15,0,90,14)Rect(1,49,105,14)Rect(1,49,105,14)Rect(4,26,107,64)Rect(4,26,107,64)Rect(1,0,115,400)Rect(1,0,115,400)Rect(560,52,117,402)Rect(560,52,117,402)Rect(0,0,677,454)'];
var i = 0;

  var nodes = diagram.nodes;
  while (nodes.next()) {
    var n = nodes.value;
console.log(abtree(n))
    test.assert(abtree(n) === abs[i]);
    //test.assert(abtree(n));
    i++;
  }



function abtree(node, str) {
  if (str === undefined) str = '';
  var elems = node.elements;
  while (elems.next()) {
    var e = elems.value;
    if (e instanceof go.Panel) str += abtree(e, '');
    str += e.actualBounds.toString();
  }
  str += node.actualBounds.toString();
  return str;
}
    }, // END TEST
    null
));



t4.add(new Test('hard width', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          // *********************************************** //
          // *********************************************** //
          desiredSize: new go.Size(120, 80),
          // *********************************************** //
          // *********************************************** //
          background: 'rgba(250,0,0,.3)', resizable: true
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("position", "pos"),
        $(go.Shape,
          {
            row: 0, column: 0, width: 50, height: 14, name: 'first',
            angle: 0, background: "lightgreen", fill: 'lightgreen'
          }
        ),
        // drawn before column 1:
        $(go.RowColumnDefinition, { column: 1, width: 40, separatorStrokeWidth: 20, separatorStroke: "black" }),
        $(go.Shape, "Rectangle",
          {
            row: 0, column: 1, name: 'second',
            stroke: 'red', fill: "rgba(0,0,255,0.3)", strokeWidth: 4,
            portId: "", fromLinkable: true, toLinkable: true,
            fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
            stretch: go.GraphObject.Fill
          })
        );


    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Gamma", pos: new go.Point(0, 0), color: "lightgreen" },
      { key: "Gamma", pos: new go.Point(140, 0), color: "lightgreen", size: "100, 80" },
      { key: "Gamma", pos: new go.Point(140, 100), color: "lightgreen", size: "180, 80" },
      { key: "Gamma", pos: new go.Point(0, 100), color: "lightgreen", size: "90, 80" }
    ],
    [
    ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
var abs = ['Rect(4.5,32.5,51,15)Rect(80,0,40,80)Rect(0,0,120,80)',
'Rect(0,32.5,51,15)Rect(71,0,40,80)Rect(140,0,100,80)',
'Rect(34.5,32.5,51,15)Rect(140,0,40,80)Rect(140,100,180,80)',
'Rect(0,32.5,51,15)Rect(71,0,40,80)Rect(0,100,90,80)'
];


var i = 0;

  var nodes = diagram.nodes;
  while (nodes.next()) {
    var n = nodes.value;
    test.assert(abtree(n) === abs[i], i + ": Got " + abtree(n).toString() + " expected: " + abs[i].toString());
    //test.assert(abtree(n));
    i++;
  }



function abtree(node, str) {
  if (str === undefined) str = '';
  var elems = node.elements;
  while (elems.next()) {
    var e = elems.value;
    if (e instanceof go.Panel) str += abtree(e, '');
    str += e.actualBounds.toString();
  }
  str += node.actualBounds.toString();
  return str;
}

    }, // END TEST
    null
));

t4.add(new Test('proportional extra', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          height: 150,
          background: 'lightblue',
          rowSizing: go.RowColumnDefinition.None

        },
        $(go.Shape, "Rectangle", { name: '1', fill: 'lime', height: 15, background: 'red', margin: 3, row: 0 }),
        $(go.Shape, "Rectangle", { name: '2', fill: 'lime', stretch:go.GraphObject.Fill, background: 'lime', margin: 3, row: 1 }),
        $(go.Shape, "Rectangle", { name: '3', fill: 'lime', stretch:go.GraphObject.Fill, background: 'blue', margin: 3, row: 2 }),
        $(go.Shape, "Rectangle", { name: '4', fill: 'lime', height: 15, background: 'magenta', margin: 3, row: 3 }),
        new go.Binding("topIndex")
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "A", color: "lightblue", topIndex: 0 },
      { key: "B", color: "lightblue", topIndex: 1 },
      { key: "C", color: "orange", topIndex: 2 },
      { key: "D", color: "orange", topIndex: 3 }
    ]);




    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var nodes = [diagram.findNodeForKey('A'), diagram.findNodeForKey('B'), diagram.findNodeForKey('C'), diagram.findNodeForKey('D')];
      var nodeAB = ["Rect(0,0,107,150)", "Rect(3,3,101,16)", "Rect(3,25,101,47)", "Rect(3,78,101,47)",
                    "Rect(3,131,101,16)", "Rect(127,0,107,150)", "Rect(3,-8,101,16)", "Rect(3,3,101,58)",
                    "Rect(3,67,101,58)", "Rect(3,131,101,16)", "Rect(0,170,107,150)", "Rect(3,-8,101,16)",
                    "Rect(3,0,101,0)", "Rect(3,3,101,122)", "Rect(3,131,101,16)", "Rect(127,170,107,150)",
                    "Rect(3,-8,101,16)", "Rect(3,0,101,0)", "Rect(3,0,101,0)", "Rect(3,3,101,16)"]
      var ni = 0;
      for (var i = 0; i < 4; i++) {
        test.assert(nodes[i].actualBounds.toString() === nodeAB[ni]);
        ni++;
        for (var j = 1; j < 5; j++) {
          test.assert(nodes[i].findObject((j).toString()).actualBounds.toString()  === nodeAB[ni]);
          ni++;
        }
      }
    }, // END TEST
    null
)); // END .ADD

t4.add(new Test('Fill + Half Desired', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          height: 100,
          background: 'lightblue',
          rowSizing: go.RowColumnDefinition.None

        },
        $(go.TextBlock, "Rectangle", { name: '1', width: 75, height: 15, background: 'red', margin: 3, row: 0 }),
        $(go.TextBlock, "Rectangle", { name: '1', stretch:go.GraphObject.Fill, height: 15, background: 'red', margin: 3, row: 1 }),
        $(go.Shape, "Rectangle", { name: '2', fill: 'lime', stretch:go.GraphObject.Fill, background: 'lime', margin: 3, row: 2}),
       $(go.Shape, "Rectangle", { name: '3', fill: 'lime', stretch:go.GraphObject.Fill, background: 'blue', margin: 3, row: 3 }),
        $(go.Shape, "Rectangle", { name: '4', fill: 'lime', height: 15, background: 'magenta', margin: 3, row: 4 }),
        new go.Binding("topIndex")
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "A", color: "lightblue", topIndex: 0 },
      { key: "B", color: "lightblue", topIndex: 1 },
      { key: "C", color: "lightblue", topIndex: 2 },
      { key: "D", color: "lightblue", topIndex: 3 },
      { key: "E", color: "lightblue", topIndex: 4 }
    ]);


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var diagram = test.diagram;
      var itr = diagram.nodes;
      var nodes = [];
      while (itr.next()) {
        nodes.push(itr.value);
      }
      var nodeAB = ["Rect(0,0,107,100)", "Rect(16,3,75,15)", "Rect(3,45,101,12)", "Rect(3,63,101,12)",
 "Rect(3,81,101,16)", "Rect(127,0,107,100)", "Rect(16,-7.5,75,15)", "Rect(3,24,101,22.5)", "Rect(3,52.5,101,22.5)",
"Rect(3,81,101,16)", "Rect(254,0,107,100)", "Rect(16,-7.5,75,15)", "Rect(3,3,101,33)", "Rect(3,42,101,33)",
"Rect(3,81,101,16)", "Rect(0,120,107,100)", "Rect(16,-7.5,75,15)", "Rect(3,0,101,0)", "Rect(3,3,101,72)", "Rect(3,81,101,16)"]

      var ni = 0;
      for (var i = 0; i < 4; i++) {
        test.assert(nodes[i].actualBounds.toString() === nodeAB[ni]);
        //test.assert(nodes[i].actualBounds.toString());
        ni++;
        for (var j = 1; j < 5; j++) {
          test.assert(nodes[i].findObject((j).toString()).actualBounds.toString()  === nodeAB[ni]);
          //test.assert(nodes[i].findObject((j).toString()).actualBounds.toString());
          ni++;
        }
      }
    }, // END TEST
    null
)); // END .ADD

t4.add(new Test('Fill + full desired', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          height: 100,
          background: 'lightblue',
          rowSizing: go.RowColumnDefinition.None

        },
        $(go.TextBlock, "Rectangle", { name: '1', width: 75, height: 15, background: 'red', margin: 3, row: 0 }),
        $(go.TextBlock, "Rectangle", { name: '2', height: 15, width: 75, background: 'red', margin: 3, row: 1 }),
        $(go.Shape, "Rectangle", { name: '3', fill: 'lime', stretch:go.GraphObject.Fill, background: 'lime', margin: 3, row: 2}),
       $(go.Shape, "Rectangle", { name: '4', fill: 'lime', stretch:go.GraphObject.Fill, background: 'blue', margin: 3, row: 3 }),
        //$(go.Shape, "Rectangle", { name: '4', fill: 'lime', height: 15, background: 'magenta', margin: 3, row: 4 }),
        new go.Binding("topIndex")
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "A", color: "lightblue", topIndex: 0 },
      { key: "B", color: "lightblue", topIndex: 1 },
      { key: "C", color: "lightblue", topIndex: 2 },
      { key: "D", color: "lightblue", topIndex: 3 }
    ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var diagram = test.diagram;
      var itr = diagram.nodes;
      var nodes = [];
      while (itr.next()) {
        nodes.push(itr.value);
      }
      var nodeAB = ["Rect(0,0,81,100)", "Rect(3,3,75,15)", "Rect(3,24,75,15)", "Rect(3,45,75,23)",
"Rect(3,74,75,23)", "Rect(101,0,81,100)", "Rect(3,-7.5,75,15)", "Rect(3,3,75,15)", "Rect(3,24,75,33.5)",
"Rect(3,63.5,75,33.5)", "Rect(0,120,107,100)", "Rect(16,-7.5,75,15)", "Rect(16,-7.5,75,15)", "Rect(3,3,101,44)",
"Rect(3,53,101,44)", "Rect(127,120,107,100)", "Rect(16,-7.5,75,15)", "Rect(16,-7.5,75,15)", "Rect(3,0,101,0)", "Rect(3,3,101,94)"]

      var ni = 0;
      for (var i = 0; i < nodes.length; i++) {
        test.assert(nodes[i].actualBounds.toString() === nodeAB[ni]);
        //test.assert(nodes[i].actualBounds.toString());
        ni++;
        var elems = nodes[i].elements;
        while (elems.next()) {
          test.assert(elems.value.actualBounds.toString()  === nodeAB[ni]);
          //test.assert(elems.value.actualBounds.toString());
          ni++;
        }

      }
    }, // END TEST
    null
)); // END .ADD

t4.add(new Test('variable table height', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Table",
        new go.Binding("height"),
        {
          height: 100,
          background: 'lightblue',
          rowSizing: go.RowColumnDefinition.None

        },
       // $(go.TextBlock, "Rect", { name: '1', width: 75, height: 15, background: 'red', margin: 3, row: 0 }),
        $(go.TextBlock, "Rect", { name: '1', height: 15, background: 'lightblue', margin: 3, row: 0 }),
       // $(go.TextBlock, "Rectangle", { name: '2', height: 15, width: 75, background: 'red', margin: 3, row: 1 }),
        $(go.Shape, "Rectangle", { name: '3', fill: 'red', stretch:go.GraphObject.Fill, background: 'red', margin: 3, row: 1}),
       $(go.Shape, "Rectangle", { name: '4', fill: 'lightcoral', stretch:go.GraphObject.Fill, background: 'blue', margin: 3, row: 2 }),
        //$(go.Shape, "Rectangle", { name: '4', fill: 'lime', height: 15, background: 'magenta', margin: 3, row: 4 }),
        new go.Binding("topIndex")
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "A", color: "lightblue", topIndex: 0 },
      { key: "B", color: "lightblue", topIndex: 1 },
      { key: "C", color: "lightblue", topIndex: 2 },
      { key: "D", color: "lightblue", topIndex: 2, height: NaN }
    ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.findNodeForKey('A').actualBounds.width < 50);
      test.assert(diagram.findNodeForKey('A').actualBounds.height === 100);
      test.assert(diagram.findNodeForKey('B').actualBounds.width === 107);
      test.assert(diagram.findNodeForKey('B').actualBounds.height === 100);
      test.assert(diagram.findNodeForKey('C').actualBounds.width === 107);
      test.assert(diagram.findNodeForKey('C').actualBounds.height === 100);
      test.assert(diagram.findNodeForKey('D').actualBounds.width === 107);
      test.assert(diagram.findNodeForKey('D').actualBounds.height === 107);
    }, // END TEST
    null
)); // END .ADD


t4.add(new Test('rowSizing', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Table",
        new go.Binding("height"),
        new go.Binding("rowSizing"),
        {
          height: 100,
          background: 'lightblue',
//          rowSizing: go.RowColumnDefinition.None

        },

        $(go.Shape, "Rectangle", { row: 0, column: 0, margin: 3, fill: 'rgba(0, 255,0,.3)', width: 30, height: 30 }),
        $(go.Shape, "Rectangle", { row: 0, column: 0, margin: 3, fill: 'rgba(0, 255,0,.3)', stretch:go.GraphObject.Fill }),
        $(go.Shape, "Rectangle", { row: 0, column: 1, margin: 3, fill: 'rgba(0, 255,0,.3)', stretch:go.GraphObject.Fill }),
        new go.Binding("topIndex")
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "A", color: "lightblue", topIndex: 0 },
      { key: "C", color: "lightblue", topIndex: 0, height: NaN },
      { key: "A", color: "lightblue", rowSizing: go.RowColumnDefinition.None, topIndex: 0 },
      { key: "C", color: "lightblue", rowSizing: go.RowColumnDefinition.None, topIndex: 0, height: NaN }
    ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var itr = diagram.nodes;
      var nodes = [];
      while (itr.next()) {
        nodes.push(itr.value);
      }
      var nodeAB = ["Rect(0,0,144,100)", "Rect(3,34.5,31,31)", "Rect(3,3,31,94)", "Rect(40,3,101,94)",
"Rect(164,0,144,37)", "Rect(3,3,31,31)", "Rect(3,3,31,31)", "Rect(40,3,101,31)", "Rect(0,120,144,100)",
"Rect(3,3,31,31)", "Rect(3,3,31,31)", "Rect(40,3,101,31)", "Rect(164,120,144,37)", "Rect(3,3,31,31)",
"Rect(3,3,31,31)", "Rect(40,3,101,31)" ]

      var ni = 0;
      for (var i = 0; i < nodes.length; i++) {
        test.assert(nodes[i].actualBounds.toString() === nodeAB[ni]);
        //test.assert(nodes[i].actualBounds.toString());
        ni++;
        var elems = nodes[i].elements;
        while (elems.next()) {
          test.assert(elems.value.actualBounds.toString()  === nodeAB[ni]);
          //test.assert(elems.value.actualBounds.toString());
          ni++;
        }

      }
    }, // END TEST
    null
)); // END .ADD


t4.add(new Test('stretch margin', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",

        $(go.RowColumnDefinition, { column: 0, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),
        $(go.RowColumnDefinition, { column: 1, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 2          , separatorStroke: 'blue', background: 'rgba(255,0,0,.3)' }),
        $(go.RowColumnDefinition, { column: 3, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 4, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),

        // The "main" object, it spans all rows and 3 out of 5 columns
        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Fill,
          fill: 'rgba(0,0,255,.3)',
          stroke: 'gray',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          name: 'SHAPE'
        }),

        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Horizontal,
          fill: 'rgba(0,255,0,.6)',
          stroke: 'purple',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          margin: 20,
          name: 'SHAPE2'
        })


      ); // End Node

      diagram.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
          $(go.Shape, { strokeWidth: 1.5 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );

      diagram.model =
        $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              {  }
            ]
          });

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.first().actualBounds.toString() === "Rect(0,0,158,141)")
      test.assert(diagram.nodes.first().findObject('SHAPE').actualBounds.toString() === "Rect(9,0,140,141)")
      test.assert(diagram.nodes.first().findObject('SHAPE2').actualBounds.toString() === "Rect(29,20,100,101)")
    }, // END TEST
    null
)); // END .ADD

t4.add(new Test('stretch margin max size', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",

        $(go.RowColumnDefinition, { column: 0, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),
        $(go.RowColumnDefinition, { column: 1, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 2          , separatorStroke: 'blue', background: 'rgba(255,0,0,.3)' }),
        $(go.RowColumnDefinition, { column: 3, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 4, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),

        // The "main" object, it spans all rows and 3 out of 5 columns
        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Fill,
          fill: 'rgba(0,0,255,.3)',
          stroke: 'gray',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          maxSize: new go.Size(50, Infinity),
          name: 'SHAPE'
        }),

        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Horizontal,
          fill: 'rgba(0,255,0,.6)',
          stroke: 'purple',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          margin: 20,
          name: 'SHAPE2'
        })


      ); // End Node

      diagram.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
          $(go.Shape, { strokeWidth: 1.5 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );

      diagram.model =
        $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              {  }
            ]
          });

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.first().actualBounds.toString() === "Rect(0,0,158,141)")
      test.assert(diagram.nodes.first().findObject('SHAPE').actualBounds.toString() === "Rect(54,0,50,141)");
      test.assert(diagram.nodes.first().findObject('SHAPE2').actualBounds.toString() === "Rect(29,20,100,101)")
    }, // END TEST
    null
)); // END .ADD


t4.add(new Test('stretch margin min size', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Table",

        $(go.RowColumnDefinition, { column: 0, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),
        $(go.RowColumnDefinition, { column: 1, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 2          , separatorStroke: 'blue', background: 'rgba(255,0,0,.3)' }),
        $(go.RowColumnDefinition, { column: 3, width: 8, separatorStroke: 'blue', background: 'rgba(0,0,255,.3)' }),
        $(go.RowColumnDefinition, { column: 4, width: 8, separatorStroke: 'blue', background: 'rgba(0,255,0,.3)' }),

        // The "main" object, it spans all rows and 3 out of 5 columns
        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Fill,
          fill: 'rgba(0,0,255,.3)',
          stroke: 'gray',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          minSize: new go.Size(50, 200),
          name: 'SHAPE'
        }),

        $(go.Shape, "Rectangle", {
          stretch: go.GraphObject.Horizontal,
          fill: 'rgba(0,255,0,.6)',
          stroke: 'purple',
          strokeWidth: 1,
          rowSpan: 2,
          column: 1,
          columnSpan: 3,
          margin: 20,
          name: 'SHAPE2'
        })


      ); // End Node

      diagram.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, relinkableTo: true, toShortLength: 4 },  // let user reconnect links
          $(go.Shape, { strokeWidth: 1.5 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );

      diagram.model =
        $(go.GraphLinksModel,
          { linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              {  }
            ]
          });

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.first().actualBounds.toString() === "Rect(0,0,158,201)");
      test.assert(diagram.nodes.first().findObject('SHAPE').actualBounds.toString() === "Rect(9,0,140,201)");
      test.assert(diagram.nodes.first().findObject('SHAPE2').actualBounds.toString() === "Rect(29,50,100,101)");
    }, // END TEST
    null
)); // END .ADD


t4.add(new Test('spanning object respects addl columns', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Table", { rotatable: true, rotateObjectName: 'yep' },
          $(go.Shape, 'RoundedRectangle',
            {
              spot1: go.Spot.TopLeft,
              spot2: go.Spot.BottomRight,
              rowSpan: Infinity, columnSpan: Infinity,
              margin: new go.Margin(0, 0), stretch: go.GraphObject.Fill,
              strokeWidth: 1, stroke: 'lightgray', fill: 'red'
            }),
          $(go.Shape, "Ellipse", { column: 0, width: 20, height: 100 } ),
          $(go.Panel,
            { column: 1, angle: 90, name: 'yep' },
            $(go.TextBlock, "Another",
              {
                column: 1, width: 90, height: 25, textAlign: "center", font: "16pt sans-serif"
              } ) ),
          $(go.Shape, "None", { column: 2, width: 20, height: 100 } )
        );

      diagram.model = new go.GraphLinksModel(
        [ { key: "Alpha" } ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.first().actualBounds.toString() === "Rect(0,0,67,101)");
    }, // END TEST
    null
)); // END .ADD


t4.add(new Test("stretching Shape in stretched Table Panel", null,
  function(test) {
    const diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { resizable: true, minSize: new go.Size(50, 50) },
        new go.Binding("minSize", "minh", h => new go.Size(75, h)),
        $(go.Shape, "RoundedRectangle",
          { fill: "white" }),
        $(go.Panel, "Table",
          { stretch: go.GraphObject.Fill, defaultAlignment: go.Spot.TopLeft },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          $(go.TextBlock, "Head",
            { row: 0 }),
          $(go.Shape,
            { row: 1, name: "SHAPE", stretch: go.GraphObject.Fill, fill: "lightgray" })
        )
      );

    diagram.model = new go.GraphLinksModel([
      { key: 1 },
      { key: 2, minh: 275 }
    ])
  },
  function(test) {
    const diagram = test.diagram;
    const n1 = diagram.findNodeForKey(1);
    const n2 = diagram.findNodeForKey(2);
    test.assert(n1 && test.isApproxEqual(n1.actualBounds.width, 50), "n1 width not 50: " + n1.actualBounds.width);
    //??? in my opinion this is wrong -- it should be 50, not height of first row plus 100 plus outer strokeWidth
    //test.assert(n1 && test.isApproxEqual(n1.actualBounds.height, 50), "n1 height not 50: " + n1.actualBounds.height);
    test.assert(n2 && test.isApproxEqual(n2.actualBounds.width, 75), "n2 width not 75: " + n2.actualBounds.width);
    test.assert(n2 && test.isApproxEqual(n2.actualBounds.height, 275), "n2 height not 275: " + n2.actualBounds.height);
}
));








var t5 = new TestCollection('RowColDef tests');
intro.add(t5);

t5.add(new Test('separatorStrokeWidth changes', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { column: 0, width: 20, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, width: 20, background: "lime", separatorStroke: 'orange' }),
          $(go.RowColumnDefinition, { column: 2, width: 20, background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldw = n.actualBounds.width;
      diagram.startTransaction();
      n.getColumnDefinition(1).separatorStrokeWidth = 10
      diagram.commitTransaction();
      test.assert(n.actualBounds.width > oldw);

      diagram.undoManager.undo()
      test.assert(n.actualBounds.width === oldw);


    }, // END TEST
    null
)); // END .ADD


t5.add(new Test('separatorStroke changes', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { column: 0, width: 20, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, width: 20, background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 20, background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldw = n.actualBounds.width;
      diagram.startTransaction();
      n.getColumnDefinition(1).separatorStroke = 'orange'
      diagram.commitTransaction();
      test.assert(n.actualBounds.width > oldw);

      diagram.undoManager.undo();
      test.assert(n.actualBounds.width === oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.width > oldw);


    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('width changes', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { column: 0, width: 20, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, width: 20, background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 20, background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldw = n.actualBounds.width;
      diagram.startTransaction();
      n.getColumnDefinition(1).width = 99;
      diagram.commitTransaction();
      test.assert(n.actualBounds.width > oldw);

      diagram.undoManager.undo();
      test.assert(n.actualBounds.width === oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.width > oldw);


    }, // END TEST
    null
)); // END .ADD


t5.add(new Test('column removal', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { column: 0, width: 20, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, width: 20, background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 20, background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, column: 1, background: "lightyellow" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();
      test.assert(n.columnCount === 3, "should have three columns");

      var oldw = n.actualBounds.width;
      diagram.startTransaction();
      n.removeColumnDefinition(1);
      diagram.commitTransaction();
      test.assert(n.actualBounds.width > oldw, "width should be greater");
      test.assert(n.columnCount === 3, "should STILL have three columns");

      diagram.undoManager.undo();
      test.assert(n.actualBounds.width === oldw, "width should be at original value " + n.actualBounds.width + " " + oldw);
      test.assert(n.columnCount === 3, "should STILL have three columns despite removal");
      diagram.undoManager.redo();
      test.assert(n.actualBounds.width > oldw, "width should be greater than original");
      test.assert(n.columnCount === 3, "should STILL have three columns after redo");
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();
      var oldw = n.actualBounds.width;
      var col2 = n.getColumnDefinition(2);
      var oldcw = col2.width;

      diagram.startTransaction();
      col2.width = 123;
      diagram.commitTransaction();
      var neww = n.actualBounds.width;
      test.assert(neww > oldw, "table should have gotten wider " + oldw + " " + neww);
      var col2a = n.getColumnDefinition(2);
      var newcw = col2a.width;
      test.assert(col2 === col2a, "should be same RowColumnDefintion object");
      test.assert(col2.width > oldcw, "column should be significantly wider");

      diagram.startTransaction();
      n.removeColumnDefinition(2);
      diagram.commitTransaction();
      test.assert(n.columnCount === 2, "should only have two column definitions left");
      var remw = n.actualBounds.width;
      test.assert(remw < oldw && remw < neww,
                  "table width should be narrower than originally" + oldw + " " + neww + " " + remw);

      diagram.undoManager.undo();
      test.assert(n.columnCount === 3, "should have three column definitions after undo")
      var undow = n.actualBounds.width;
      test.assert(undow === neww, "table width should be restored " + neww + " " + undow);
      var col2b = n.getColumnDefinition(2);
      test.assert(col2 === col2b, "should be original RowColumnDefinition object");
      test.assert(col2.width === newcw, "column.width should be restored " + newcw + " " + col2.width);
    }
)); // END .ADD



t5.add(new Test('column removal + modification', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { column: 0, width: 20, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, width: 20, background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 20, background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldw = n.actualBounds.width;
      diagram.startTransaction();
      var col = n.getColumnDefinition(1)
      n.removeColumnDefinition(1);
      diagram.commitTransaction();
      test.assert(n.actualBounds.width > oldw);

      diagram.startTransaction();
      col.width = 200;
      diagram.commitTransaction();

      diagram.undoManager.undo();
      test.assert(n.actualBounds.width > oldw);
      diagram.undoManager.undo();
      test.assert(n.actualBounds.width === oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.width > oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.width > oldw);


    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('row removal + modification', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { row: 0, height: 40, background: "red" }),
          $(go.RowColumnDefinition, { row: 1, height: 40, background: "lime" }),
          $(go.RowColumnDefinition, { row: 2, height: 40, background: "blue" }),
          $(go.RowColumnDefinition, { column: 0, width: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, row: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldw = n.actualBounds.height;
      diagram.startTransaction();
      var row = n.getRowDefinition(1)
      n.removeRowDefinition(1);
      diagram.commitTransaction();
      test.assert(n.actualBounds.height < oldw);

      diagram.startTransaction();
      row.height = 200;
      diagram.commitTransaction();

      diagram.undoManager.undo();
      test.assert(n.actualBounds.height < oldw);
      diagram.undoManager.undo();
      test.assert(n.actualBounds.height === oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.height < oldw);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.height < oldw);
    }, // END TEST
    function(test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();
      diagram.startTransaction();
      n.removeRowDefinition(2);
      diagram.commitTransaction();
      test.assert(n.rowCount === 2, "should only have two row definitions left");

      diagram.undoManager.undo();
      test.assert(n.rowCount === 3, "should have three row definitions after undo");
    }
)); // END .ADD


t5.add(new Test('row minimum+height+undo', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          $(go.RowColumnDefinition, { row: 0, height: 40, background: "red" }),
          $(go.RowColumnDefinition, { row: 1, height: 40, background: "lime" }),
          $(go.RowColumnDefinition, { row: 2, height: 40, background: "blue" }),
          $(go.RowColumnDefinition, { column: 0, width: 120 }),
          $(go.TextBlock, { margin: 3, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, row: 1, background: "whitesmoke" }, new go.Binding("text", "key"))
        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

      var oldh = n.actualBounds.height;
      diagram.startTransaction();
      var row = n.getRowDefinition(1)
      //n.removeRowDefinition(1);
      row.minimum = 200;
      diagram.commitTransaction();
      test.assert(n.actualBounds.height > oldh);

      var newh = n.actualBounds.height;
      diagram.startTransaction();
      row.height = 200;
      diagram.commitTransaction();
      test.assert(n.actualBounds.height === newh);

      diagram.undoManager.undo();
      test.assert(n.actualBounds.height === newh);
      diagram.undoManager.undo();
      test.assert(n.actualBounds.height < newh);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.height === newh);
      diagram.undoManager.redo();
      test.assert(n.actualBounds.height === newh);


    }, // END TEST
    null
)); // END .ADD


t5.add(new Test('col stretch', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          { width: 200 },
          $(go.RowColumnDefinition, { column: 0, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, /*stretch: go.GraphObject.Fill,*/ background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 40, background: "blue" }),
          $(go.RowColumnDefinition, { column: 3,  background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, width: 40, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, /*stretch: go.GraphObject.Fill,*/ column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))

        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();


      diagram.startTransaction();
      var col = n.getColumnDefinition(1)
      var old = col.actual;
      col.stretch = go.GraphObject.Fill;
      diagram.commitTransaction();
      test.assert(col.actual > old);

      diagram.undoManager.undo();
      test.assert(col.actual === old);
      diagram.undoManager.redo();
      test.assert(col.actual > old)


    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('col sizing', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.undoManager.isEnabled = true;
      diagram.nodeTemplate =
        $(go.Node, "Table",  // the Shape will go around the TextBlock
          { width: 200 },
          $(go.RowColumnDefinition, { column: 0, background: "red" }),
          $(go.RowColumnDefinition, { column: 1, /*stretch: go.GraphObject.Fill,*/ background: "lime" }),
          $(go.RowColumnDefinition, { column: 2, width: 40, background: "blue" }),
          $(go.RowColumnDefinition, { column: 3,  background: "blue" }),
          $(go.RowColumnDefinition, { row: 0, height: 120 }),
          $(go.TextBlock, { margin: 3, width: 40, background: "whitesmoke" }, new go.Binding("text", "key")),
          $(go.TextBlock, { margin: 3, /*stretch: go.GraphObject.Fill,*/ column: 1, background: "whitesmoke" }, new go.Binding("text", "key"))

        );
      diagram.model = new go.GraphLinksModel([ { key: "Alpha", color: "lightblue" } ], []);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();


      diagram.startTransaction();
      var col = n.getColumnDefinition(1)
      var old = col.actual;
      col.sizing = go.RowColumnDefinition.None;
      diagram.commitTransaction();
      test.assert(old > col.actual)

      diagram.undoManager.undo();
      test.assert(col.actual === old);
      diagram.undoManager.redo();
      test.assert(old > col.actual)


    }, // END TEST
    null
)); // END .ADD


// regression test for table layout's nodes
t5.add(new Test('table layout', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.layout = $(TableLayout, { isRealtime: false });

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { width: 100, height: 50 },
        new go.Binding("row"),
        new go.Binding("column", "col"),
        $(go.Shape, { fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { height: 14, width: 65 },
          new go.Binding("text", "key"))
      );

    diagram.nodeTemplateMap.add("Column",
      $(go.Part, "Table",
        { selectable: false, pickable: false, layerName: "Background" },
        { row: 0, rowSpan: 9999, stretch: go.GraphObject.Fill, minSize: new go.Size(100, 100), margin: 4 },
        new go.Binding("row"),
        new go.Binding("column", "col"),
        $(go.TextBlock,
          { height: 14, width: 65, row: 0, alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.BottomLeft,
            font: "10pt sans-serif" },
          new go.Binding("text")),
        $(go.Shape, { row: 1, fill: "lightgray", stretch: go.GraphObject.Fill },
          new go.Binding("fill", "color"))
      ));

    diagram.nodeTemplateMap.add("Header",
      $(go.Part, "Auto",
        { selectable: false, pickable: false },
        { column: 0, columnSpan: 9999, stretch: go.GraphObject.Horizontal, margin: 4 },
        new go.Binding("row"),
        $(go.Shape, { fill: "lightgray", height: 22 },
          new go.Binding("fill", "color")),
        $(go.TextBlock, { height: 14, width: 65, alignment: go.Spot.Left, stroke: "white", font: "bold 12pt sans-serif", margin: 2 },
          new go.Binding("text"))
      ));

    diagram.groupTemplate =
      $(go.Group, "Auto",
        { movable: false, deletable: false, copyable: false },
        { margin: 8, alignment: go.Spot.TopLeft },
        new go.Binding("row"),
        new go.Binding("column", "col"),
        // leave room for "Column" part's header TextBlock in first row;
        // the margin is double that of the "Column" part
        new go.Binding("margin", "row", function(r) { return new go.Margin((r === 1 ? 22 : 0), 8, 8, 8); }),
        $(go.Shape, { fill: "white" },
          new go.Binding("fill", "color"),
          new go.Binding("stroke", "isHighlighted", function(h) { return h ? "red" : "black"; }).ofObject()),
        $(go.Panel, "Vertical",
          { margin: 4 },
          $(go.TextBlock, { alignment: go.Spot.TopLeft, font: "bold 10pt sans-serif", height: 14, width: 65 },
            new go.Binding("text", "key"),
            new go.Binding("stroke", "isHighlighted", function(h) { return h ? "red" : "black"; }).ofObject()),
          $(go.Placeholder)
        ),
        {
          layout: $(go.GridLayout, { wrappingColumn: 1 }),
          handlesDragDropForMembers: true,  // don't need to define handlers on member Nodes and Links
          mouseDragEnter: function(e, group, prev) { group.isHighlighted = true; },
          mouseDragLeave: function(e, group, next) { group.isHighlighted = false; },
          mouseDrop: function(e, group) {
            var ok = group.addMembers(group.diagram.selection, true);
            if (!ok) group.diagram.currentTool.doCancel();
          }
        }
      );

    diagram.model = new go.GraphLinksModel([
      { text: "Title", color: "firebrick", row: 0, category: "Header" },
      { text: "Column 0", color: "lightyellow", row: 1, col: 0, category: "Column" },
      { text: "Column 1", color: "lightyellow", row: 1, col: 1, category: "Column" },
      { text: "Column 2", color: "lightyellow", row: 1, col: 2, category: "Column" },
      { key: "Group 1", color: "cyan", row: 1, col: 1, isGroup: true },
      { key: "Group 2", color: "lightgreen", row: 1, col: 2, isGroup: true },
      { key: "Group 3", color: "yellow", row: 2, col: 2, isGroup: true },
      { key: "Delta", color: "orange", size: "100 100", group: "Group 1" },
      { key: "Epsilon", color: "coral", size: "100 50", group: "Group 1" },
      { key: "Zeta", color: "tomato", size: "50 70", group: "Group 2" },
      { key: "Eta", color: "coral", size: "50 50", group: "Group 3" },
      { key: "Theta", color: "tomato", size: "100 50", group: "Group 3" }
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var n = diagram.nodes.first();

    var str = "";
    diagram.nodes.each(function(n) {
      str += (n.actualBounds.toString());
    });
    test.assert(str === "Rect(116,53,109,133)Rect(241,53,109,73)Rect(241,194,109,133)Rect(120.5,71.5,100,50)Rect(120.5,131.5,100,50)Rect(245.5,71.5,100,50)Rect(245.5,212.5,100,50)Rect(245.5,272.5,100,50)");
  }
)); // END .ADD


t5.add(new Test('findLocalRow/ColForX/Y', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Table",
          $(go.Shape, "RoundedRectangle", { fill:"red", strokeWidth: 0, width: 50, height: 50 }),
          $(go.Shape, "RoundedRectangle", { fill:"lime", row: 1, strokeWidth: 0, width: 50, height: 50 }),
          $(go.Shape, "RoundedRectangle", { fill:"blue", row: 2, strokeWidth: 0, width: 50, height: 50 })
        );

      diagram.nodeTemplateMap.add('second',
        $(go.Node, "Table",
          $(go.Shape, "RoundedRectangle", { fill:"red", strokeWidth: 0, width: 50, height: 50 }),
          $(go.Shape, "RoundedRectangle", { fill:"lime", column: 1, strokeWidth: 0, width: 50, height: 50 }),
          $(go.Shape, "RoundedRectangle", { fill:"blue", column: 2, strokeWidth: 0, width: 50, height: 50 }),
          $(go.Shape, "RoundedRectangle", { fill:"pink", row: 3, column: 33, strokeWidth: 0, width: 50, height: 50 })
        ));

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [ { key: "A", }, { key: "B", category: "second" } ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var a =diagram.findNodeForKey('A');
      var b =diagram.findNodeForKey('B');
      test.assert(a.findColumnForLocalX(1) === 0)
      test.assert(a.findColumnForLocalX(2) === 0)
      test.assert(a.findColumnForLocalX(25) === 0)
      // There's only one column, so after 50 it just sticks with 1:
      test.assert(a.findColumnForLocalX(55) === 1)
      test.assert(a.findColumnForLocalX(105) === 1)
      test.assert(a.findColumnForLocalX(155) === 1)
      test.assert(a.findColumnForLocalX(165) === 1)

      test.assert(a.findRowForLocalY(0) === 0)
      test.assert(a.findRowForLocalY(25) === 0)
      test.assert(a.findRowForLocalY(55) === 1)
      test.assert(a.findRowForLocalY(105) === 2)
      test.assert(a.findRowForLocalY(155) === 3)
      test.assert(a.findRowForLocalY(555) === 3)


      test.assert(b.findRowForLocalY(0) === 0)
      test.assert(b.findRowForLocalY(50) === 3)
      test.assert(b.findRowForLocalY(55) === 3)
      test.assert(b.findRowForLocalY(115) === 4)
      test.assert(b.findRowForLocalY(145) === 4)
      test.assert(b.findRowForLocalY(1145) === 4)

      test.assert(b.findColumnForLocalX(-10) === -1)
      test.assert(b.findColumnForLocalX(5) === 0)
      test.assert(b.findColumnForLocalX(55) === 1)
      test.assert(b.findColumnForLocalX(155) === 33)
      test.assert(b.findColumnForLocalX(2255) === 34)
    }, // END TEST
    null
)); // END .ADD


t5.add(new Test('no separator in first row/col', null,
function (test) {
  var diagram = test.diagram;
  diagram.reset();
  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, "Table",
      {
        desiredSize: new go.Size(NaN, 60),
        defaultColumnSeparatorStroke: "red",
        defaultColumnSeparatorStrokeWidth: 15,
      },
      $(go.Shape, "RoundedRectangle", { width: 50, height: 50, column: 2, strokeWidth: 0, fill: 'lightblue' }),
      $(go.Shape, "RoundedRectangle", { width: 50, height: 50, column: 3, strokeWidth: 0, fill: 'palegreen' })
    );
  diagram.nodeTemplateMap.add('2',
    $(go.Node, "Table",
      {
        desiredSize: new go.Size(60, NaN),
        defaultRowSeparatorStroke: "red",
        defaultRowSeparatorStrokeWidth: 15,
      },
      $(go.Shape, "RoundedRectangle", { width: 50, height: 50, row: 5, strokeWidth: 0, fill: 'lightblue' }),
      $(go.Shape, "RoundedRectangle", { width: 50, height: 50, row: 8, strokeWidth: 0, fill: 'palegreen' })
    ));
  diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", category: '2' }
    ],
    [
    ]);
},
function (test) {
  var diagram = test.diagram;
  var n = diagram.findNodeForKey('Alpha');
  test.assert(n.actualBounds.width === 115);
  test.assert(n.actualBounds.height === 60);
  n = diagram.findNodeForKey('Beta');
  test.assert(n.actualBounds.height === 115);
  test.assert(n.actualBounds.width === 60);
}, // END TEST
null
)); // END .ADD



  // A tablerow which stands for row 0, but row 0 has no height. It's only member is something that spans 2 rows.
  t5.add(new Test('degenerate TableRow', null,
  function (test) {
    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;
    diagram.nodeTemplate =
    $(go.Node, "Table",
        $(go.RowColumnDefinition, { column: 0, background: 'rgba(255,0,0,0.1)' }),
        $(go.RowColumnDefinition, { column: 1, background: 'rgba(0,255,0,0.1)' }),
        //$(go.RowColumnDefinition, { row: 0, height: 5, background: 'rgba(0,0,255,0.1)' }),
        {
          margin: 8,
          background: "transparent"
        },
        $(go.Shape, { row: 1, width: 15, height: 15, strokeWidth: 0 }),
        $(go.Panel, "TableRow",
          { row: 0 },
            $(go.Shape, "Circle",
            {
              column: 1,
              rowSpan: 2
            },
              { width: 15, height: 15, strokeWidth: 0 })
          )
    );

    diagram.model = new go.GraphLinksModel( [ { } ]);


  }, // END SETUP
  function (test) {
    var diagram = test.diagram;
    var p = diagram.nodes.first().position;
    var objs = diagram.findObjectsAt(new go.Point(p.x + 20, p.y + 10))
    test.assert(objs.count === 2); // Before, this would not detect the circle
  }, // END TEST
  null
)); // END .ADD

// Testing horizontal stretch gives proper row apportioning
t5.add(new Test('Text Stretch', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.add(
        $(go.Part, "Auto",
          { resizable: true, minSize: new go.Size(162, 62), width: 200, height: 100 },
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Table",
            { name: "TABLE", stretch: go.GraphObject.Fill, margin: 0.5 },
            $(go.RowColumnDefinition,
              { column: 0, sizing: go.RowColumnDefinition.None, background: "white", coversSeparators: true }),
            $(go.RowColumnDefinition,
              { column: 1,
                minimum: 100,
                separatorStroke: "black" }),
            $(go.RowColumnDefinition,
              { row: 0
               // , sizing: go.RowColumnDefinition.Non
               }),
            $(go.RowColumnDefinition,
              { row: 1, separatorStroke: "black" }),
            $(go.Picture, // "../samples/images/hs2.jpg",
              { row: 0, column: 0, rowSpan: 2, width: 48, height: 48, margin: 6, background: 'red' }),
            $(go.TextBlock, "more more description here that wraps",
              { row: 0, column: 1,
                //width: 125, // instead of stretch horizontal
                stretch: go.GraphObject.Horizontal,

                margin: 2, textAlign: "center", background: 'lime' }),
            $(go.TextBlock, "relatively short",
              { row: 1, column: 1, stretch: go.GraphObject.Fill, margin: 2, textAlign: "center", background: 'lightblue' })
          )
        ));

        diagram.add(
        $(go.Part, "Auto",
          { resizable: true, width: 120, height: 100 },
          $(go.Shape, { fill: "white", strokeWidth: 4 }),
          $(go.Panel, "Table",
            { name: "TABLE", stretch: go.GraphObject.Fill },
            $(go.RowColumnDefinition,
              { row: 1,  separatorStroke: "black" }), // minimum: 10,
            $(go.TextBlock, "more more description here that wraps",
              { row: 0, column: 0,
                stretch: go.GraphObject.Horizontal,
                 textAlign: "center", background: 'lime' }),
            $(go.Shape, "Rectangle",
              { row: 1, column: 0, stretch: go.GraphObject.Fill, fill: 'red', strokeWidth: 0
            })
          )
        ));



        diagram.add(
        $(go.Part, "Auto",
          { resizable: true, width: 120, height: 100 },
          $(go.Shape, { fill: "white", strokeWidth: 4 }),
          $(go.Panel, "Table",
            { name: "TABLE", stretch: go.GraphObject.Fill },
            $(go.RowColumnDefinition,
              { row: 1, separatorStroke: "black" }),
              $(go.Shape, "Ellipse",
              { row: 0, column: 0, stretch: go.GraphObject.Fill, fill: 'lime', strokeWidth: 0
            }),
            $(go.Shape, "Rectangle",
              { row: 1, column: 0, stretch: go.GraphObject.Fill, fill: 'red', strokeWidth: 0
            }),
            $(go.Shape, "Triangle",
              { row: 2, column: 0, stretch: go.GraphObject.Fill, fill: 'blue', strokeWidth: 0
            })
          )
        ));

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var tables = [];
      diagram.parts.each(function(p){
        tables.push(p.findObject('TABLE'));
      });
      var t0 = tables[0];
      // Because text can be differently sized on different platforms:
      function approx(a, b) {
        return Math.abs(a - b) < 2;
      }
      // Picture, text, text
      test.assert(t0.elt(0).actualBounds.toString() === "Rect(6,25,48,48)"); // Picture
      // test.assert(t0.elt(1).toString()); // Upper text
      test.assert(approx(t0.elt(1).actualBounds.width, 133));
      test.assert(approx(t0.elt(1).actualBounds.height, 28));
      // test.assert(t0.elt(2).toString()); // Lower text 133x60.8
      test.assert(approx(t0.elt(2).actualBounds.width, 133));
      test.assert(approx(t0.elt(2).actualBounds.height, 60.8));
      //test.assert('t1');
      var t1 = tables[1];
      // test.assert(t1.elt(0).toString()); // text 116x42.2
      test.assert(approx(t1.elt(0).actualBounds.width, 116));
      test.assert(approx(t1.elt(0).actualBounds.height, 42.2));
      // test.assert(t1.elt(1).toString()); // shape 116x52.76
      test.assert(approx(t1.elt(1).actualBounds.width, 116));
      test.assert(approx(t1.elt(1).actualBounds.height, 52.76));

      // These should have identical width and height
      // The middle one may be off by one because of a potential bug with double-counting separators
      var t2 = tables[2];
      test.assert(t2.elt(0).actualBounds.toString() === "Rect(0,0,116,32)");
      test.assert(t2.elt(1).actualBounds.toString() === "Rect(0,33,116,31)");
      test.assert(t2.elt(2).actualBounds.toString() === "Rect(0,64,116,32)");
    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('Span+Stretch + r/c minimums', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      function labelStyle() {
        return [
          { alignment: go.Spot.TopLeft, margin: 2, font: "8pt sans-serif" }
        ];
      }
      function fieldStyle(prop) {
        return [
          { alignment: go.Spot.TopLeft, margin: new go.Margin(12, 2, 2, 2), editable: true },
          new go.Binding("text", prop).makeTwoWay()
        ];
      }
      diagram.add(
        $(go.Part, "Auto",
          { resizable: true },
          $(go.Shape, { fill: "white" }),
          $(go.Panel, 'Table',
            { margin: 0.5, stretch: go.GraphObject.Fill },

            $(go.RowColumnDefinition, { row: 0, minimum: 60, background: "white", coversSeparators: true }),
            $(go.RowColumnDefinition, { row: 1, minimum: 50, separatorStroke: "black" }),
            $(go.RowColumnDefinition, { row: 2, minimum: 50, separatorStroke: "black" }),
            $(go.RowColumnDefinition, { row: 3, minimum: 50, separatorStroke: "black" }),
            $(go.RowColumnDefinition, { row: 4, minimum: 50, separatorStroke: "black" }),
            $(go.RowColumnDefinition, { column: 0, minimum: 200 }),
            $(go.RowColumnDefinition, { column: 1, minimum: 200, separatorStroke: "black" }),
            $(go.RowColumnDefinition, { column: 2, minimum: 200, separatorStroke: "black" }),

            $(go.Picture, { row: 0, column: 0, width: 100, height: 40, background: "dodgerblue" }),
            $(go.Panel, "Vertical", { row: 0, column: 1 },
              $(go.TextBlock, "PlantDesigner", { font: "bold 18pt sans-serif" }),
              $(go.TextBlock, "Flow Sheet Calculations")
            ),
            $(go.TextBlock, { row: 0, column: 2, stroke: "red", font: "bold 14pt sans-serif" },
              new go.Binding("text")),

            // Left column for date, drawn by, revised by and approved by
            $(go.TextBlock, 'Date:', { row: 1, column: 0 }, labelStyle()),
            $(go.TextBlock, '2021-02-19', { row: 1, column: 0 }, fieldStyle("date")),
            $(go.TextBlock, 'Drawn by:', { row: 2, column: 0 }, labelStyle()),
            $(go.TextBlock, 'Gustav Lilja', { row: 2, column: 0 }, fieldStyle("drawnby")),
            $(go.TextBlock, 'Revised by:', { row: 3, column: 0 }, labelStyle()),
            $(go.TextBlock, 'Martin Nordin', { row: 3, column: 0 }, fieldStyle("revisedby")),
            $(go.TextBlock, 'Approved by:', { row: 4, column: 0 }, labelStyle()),
            $(go.TextBlock, 'Oscar Rydh', { row: 4, column: 0 }, fieldStyle("appprovedby")),

            // Table for customer, project, project no and flowsheet no
            $(go.TextBlock, 'Customer:', { row: 1, column: 1, columnSpan: 2 }, labelStyle()),
            $(go.TextBlock, '2021-02-19', { row: 1, column: 1, columnSpan: 2 }, fieldStyle("customer")),
            $(go.Shape,
              { name: 'fillShape', row: 2, column: 1,
              rowSpan: 2, columnSpan: 2,
              stretch: go.GraphObject.Fill,
              fill: "red" }
            ),
            $(go.TextBlock, 'Project no:', { row: 4, column: 1 }, labelStyle()),
            $(go.TextBlock, '123123', { row: 4, column: 1 }, fieldStyle("projectno")),
            $(go.TextBlock, 'Flowsheet no:', { row: 4, column: 2 }, labelStyle()),
            $(go.TextBlock, '178263', { row: 4, column: 2 }, fieldStyle("flowsheetno"))
          )
        ));

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var p = diagram.parts.first();

      // Because text can be differently sized on different platforms:
      function approx(a, b) {
        return Math.abs(a - b) < 2;
      }
      var shape = p.findObject('fillShape');
      test.assert(shape.actualBounds.toString() === "Rect(201,112,401,101)");
      diagram.startTransaction();
      p.height = 600;
      diagram.commitTransaction();
      var ab = shape.actualBounds;
      test.assert(ab.x === 201);
      test.assert(approx(ab.y, 251.16666666666666));
      test.assert(ab.width === 401);
      test.assert(approx(ab.height, 227.5151515151515));
    }, // END TEST
    null
)); // END .ADD

// Make sure equally apportions leftover space
t5.add(new Test('stretch + index', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      function txt() {
        return {
          stretch: go.GraphObject.Horizontal,
          background: 'red'
        }
      }
      function txt2() {
        return {
          stretch: go.GraphObject.Vertical,
          width: 13, // problems measuring on different systems if we don't
          background: 'lime',
          font: '20px sans-serif'
        }
      }
      diagram.add(
          $(go.Part, 'Table',
            {
              resizable: true,
              //topIndex: 4,
              stretch: go.GraphObject.Fill,
              width: 50, height: 100,
              defaultRowSeparatorStroke: "gray",
              background: 'lightblue'
            },

            $(go.TextBlock, 'A:', { name: 'A', row: 0, column: 0 }, txt()),
            $(go.TextBlock, 'B:', { name: 'B', row: 1, column: 0 }, txt()),
            $(go.TextBlock, 'C:', { name: 'C', row: 2, column: 0 }, txt())
          )
        );

        diagram.add(
          $(go.Part, 'Table',
            {
              resizable: true,
              topIndex: 4,
              stretch: go.GraphObject.Fill,
              width: 50, height: 100,
              defaultRowSeparatorStroke: "gray",
              background: 'lightblue'
            },

            $(go.TextBlock, 'A:', { name: 'A', row: 0, column: 0 }, txt()),
            $(go.TextBlock, 'B:', { name: 'B', row: 1, column: 0 }, txt()),
            $(go.TextBlock, 'C:', { name: 'C', row: 2, column: 0 }, txt()),
            $(go.TextBlock, 'D:', { name: 'D', row: 3, column: 0 }, txt()),
            $(go.TextBlock, 'E:', { name: 'E', row: 4, column: 0 }, txt()),
            $(go.TextBlock, 'F:', { name: 'F', row: 5, column: 0 }, txt()),
            $(go.TextBlock, 'G:', { name: 'G', row: 6, column: 0 }, txt())
          )
        );

        diagram.add(
          $(go.Part, 'Table',
            {
              resizable: true,
              stretch: go.GraphObject.Fill,
              width: 50, height: 50,
              defaultRowSeparatorStroke: "gray",
              background: 'lightblue'
            },

            $(go.TextBlock, 'A', { name: 'A', row: 0, column: 0 }, txt2()),
            $(go.TextBlock, 'B', { name: 'B', row: 0, column: 1 }, txt2()),
            $(go.TextBlock, 'C', { name: 'C', row: 0, column: 2 }, txt2()),
            $(go.TextBlock, 'D', { name: 'D', row: 0, column: 3 }, txt2()),
            $(go.TextBlock, 'E', { name: 'E', row: 0, column: 4 }, txt2()),
            $(go.TextBlock, 'F', { name: 'F', row: 0, column: 5 }, txt2()),
            $(go.TextBlock, 'G', { name: 'G', row: 0, column: 6 }, txt2())
          )
        );
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;

      var p = [];
      diagram.parts.each(function(part) { p.push(part); })
      // Because text can be differently sized on different platforms:
      function approx(a, b) { return Math.abs(a - b) < 2; }

      var part = p[0];
      test.assert(Math.round(part.getRowDefinition(0).actual) === 32);
      test.assert(Math.round(part.getRowDefinition(1).actual) === 32);
      test.assert(Math.round(part.getRowDefinition(2).actual) === 32);
      // all rows equal:
      test.assert(part.getRowDefinition(0).actual === part.getRowDefinition(1).actual);
      test.assert(part.getRowDefinition(1).actual === part.getRowDefinition(2).actual);
      part = p[1];
      test.assert(part.getRowDefinition(0).actual === 0);
      test.assert(part.getRowDefinition(1).actual === 0);
      test.assert(part.getRowDefinition(2).actual === 0);
      test.assert(part.getRowDefinition(3).actual === 0);
      test.assert(Math.round(part.getRowDefinition(4).actual) === 32); // 32 because of separator
      test.assert(Math.round(part.getRowDefinition(5).actual) === 32); // 32 because of separator
      test.assert(Math.round(part.getRowDefinition(6).actual) === 32); // 32 because of separator
      test.assert(part.getRowDefinition(4).actual === part.getRowDefinition(5).actual);
      test.assert(part.getRowDefinition(5).actual === part.getRowDefinition(6).actual);

      part = p[2];
      test.assert(part.getColumnDefinition(0).actual === 13);
      test.assert(part.getColumnDefinition(1).actual === 13);
      test.assert(part.getColumnDefinition(2).actual === 13);
      test.assert(part.getColumnDefinition(3).actual === 11);
      test.assert(part.getColumnDefinition(4).actual === 0);
      test.assert(part.getColumnDefinition(5).actual === 0);
      test.assert(part.getColumnDefinition(6).actual === 0);
    }, // END TEST
    null
)); // END .ADD

// Make sure a row with no visible items does not produce a separator
t5.add(new Test('visible = false items in row', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          { fill: "white", stroke: "rgba(255,0,0,.8)", portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" },
          new go.Binding("fill", "color")),
        $(go.Panel, "Table",
          new go.Binding("itemArray"),
          {
            defaultRowSeparatorStroke: "rgba(0,255,0,.7)",
            defaultRowSeparatorStrokeWidth: 5,
            defaultColumnSeparatorStrokeWidth: 2,
            defaultColumnSeparatorStroke: "gray",
            // defaultSeparatorPadding: new go.Margin(2, 3, 2, 3),
            itemTemplate:
              $(go.Panel, "TableRow",
                new go.Binding("visible"),
                $(go.TextBlock, { width: 16, height: 15, column: 1 },  // column 0 makes the initial vertical stroke disappear
                  new go.Binding("text", "itemIndex").ofObject()),
                $(go.TextBlock, { width: 40, height: 15, column: 2 },
                  new go.Binding("text"))
              )
          }
        )
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", color: "lightblue",
        itemArray: [
          { text: "Aaaaaa", visible: false },
          { text: "Bbbbbb", visible: true },
          { text: "Cccccccc", visible: true }
        ]
      }
      ,{ key: 2, text: "Alpha", color: "lightblue",
        itemArray: [
          { text: "Aaaaaa", visible: true },
          { text: "Bbbbbb", visible: true },
          { text: "Cccccccc", visible: true }
        ]
      }
    ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var a = diagram.findNodeForKey(1);
      var b = diagram.findNodeForKey(2);
      test.assert(a.actualBounds.toString() === 'Rect(0,0,59,36)');
      test.assert(b.actualBounds.toString() === 'Rect(79,0,59,56)');
    }, // END TEST
    null
)); // END .ADD

// test for degenerate table
t5.add(new Test('empty table', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate = $(go.Node, $( go.Panel, "Table", $( go.TextBlock, { visible: false } ) ) );

      diagram.model = new go.GraphLinksModel(
      [ { key: "Alpha", color: "lightblue" },
        { key: "Beta", color: "orange" }
      ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      // should not produce uncaught exceptions
    }, // END TEST
    null
)); // END .ADD

// A table within a table
// Where the second one has one explicitly sized col, and another col with one H stretch element
// The result should be an inner table that is exactly as wide as the outer table
t5.add(new Test('Nested tables stretch', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplateMap.add('',
      $(go.Node, "Table",
        { background: 'cyan', name: 'T1' },  // [wvr:] cyan shouldn't be visible if row 1 table panel has correct width
        $(go.Shape,
          { // just to give the table a width
            row: 0, width: 210, height: 40, fill: "lightgray", name:"lightgray", strokeWidth: 0
          }
        ),
        $(go.Panel, "Table",
          {
            name: 'T2', row: 1, background: 'magenta',
            stretch: go.GraphObject.Horizontal,  // [wvr:] so the nested table should have width 210, yes?
          },
          $(go.Shape, { column: 0, height: 24, width: 24, fill: "yellow", name:"yellow", strokeWidth: 0 } ),
          $(go.Shape,
            {
              column: 1, height: 24,
              // [wvr:] comment out this stretch and the panel width is OK
              stretch: go.GraphObject.Horizontal,
              fill: "lime", name:"lime", strokeWidth: 0
            }
          ),
          // [wvr:] but comment out the RowColumnDefinition, and the width is what I would expect;
          // with the definition, the panel is that much wider than it should be
          $(go.RowColumnDefinition, { column: 0 , width: 30 })
        )
      ));

      // same as above but commented out row col def
      diagram.nodeTemplateMap.add('b',
      $(go.Node, "Table",
        { background: 'cyan', name: 'T1' },  // [wvr:] cyan shouldn't be visible if row 1 table panel has correct width
        $(go.Shape,
          { // just to give the table a width
            row: 0, width: 210, height: 40, fill: "lightgray", name:"lightgray", strokeWidth: 0
          }
        ),
        $(go.Panel, "Table",
          {
            name: 'T2', row: 1, background: 'magenta',
            stretch: go.GraphObject.Horizontal,  // [wvr:] so the nested table should have width 210, yes?
          },
          $(go.Shape, { column: 0, height: 24, width: 24, fill: "yellow", name:"yellow", strokeWidth: 0 } ),
          $(go.Shape,
            {
              column: 1, height: 24,
              // [wvr:] comment out this stretch and the panel width is OK
              stretch: go.GraphObject.Horizontal,
              fill: "lime", name:"lime", strokeWidth: 0
            }
          ),
          // [wvr:] but comment out the RowColumnDefinition, and the width is what I would expect;
          // with the definition, the panel is that much wider than it should be
          //$(go.RowColumnDefinition, { column: 0 , width: 30 })
        )
      ));

      // same as first but no stretch on lime
      diagram.nodeTemplateMap.add('c',
      $(go.Node, "Table",
        { background: 'cyan', name: 'T1' },  // [wvr:] cyan shouldn't be visible if row 1 table panel has correct width
        $(go.Shape,
          { // just to give the table a width
            row: 0, width: 210, height: 40, fill: "lightgray", name:"lightgray", strokeWidth: 0
          }
        ),
        $(go.Panel, "Table",
          {
            name: 'T2', row: 1, background: 'magenta',
            stretch: go.GraphObject.Horizontal,  // [wvr:] so the nested table should have width 210, yes?
          },
          $(go.Shape, { column: 0, height: 24, width: 24, fill: "yellow", name:"yellow", strokeWidth: 0 } ),
          $(go.Shape,
            {
              column: 1, height: 24,
              // [wvr:] comment out this stretch and the panel width is OK
              //stretch: go.GraphObject.Horizontal,
              fill: "lime", name:"lime", strokeWidth: 0
            }
          ),
          // [wvr:] but comment out the RowColumnDefinition, and the width is what I would expect;
          // with the definition, the panel is that much wider than it should be
          $(go.RowColumnDefinition, { column: 0 , width: 30 })
        )
      ));

      // both modifications from b and c
      diagram.nodeTemplateMap.add('d',
      $(go.Node, "Table",
        { background: 'cyan', name: 'T1' },  // [wvr:] cyan shouldn't be visible if row 1 table panel has correct width
        $(go.Shape,
          { // just to give the table a width
            row: 0, width: 210, height: 40, fill: "lightgray", name:"lightgray", strokeWidth: 0
          }
        ),
        $(go.Panel, "Table",
          {
            name: 'T2', row: 1, background: 'magenta',
            stretch: go.GraphObject.Horizontal,  // [wvr:] so the nested table should have width 210, yes?
          },
          $(go.Shape, { column: 0, height: 24, width: 24, fill: "yellow", name:"yellow", strokeWidth: 0 } ),
          $(go.Shape,
            {
              column: 1, height: 24,
              // [wvr:] comment out this stretch and the panel width is OK
              //stretch: go.GraphObject.Horizontal,
              fill: "lime", name:"lime", strokeWidth: 0
            }
          ),
          // [wvr:] but comment out the RowColumnDefinition, and the width is what I would expect;
          // with the definition, the panel is that much wider than it should be
          // $(go.RowColumnDefinition, { column: 0 , width: 30 })
        )
      ));

      diagram.model = new go.GraphLinksModel([
        { key: 'a', },
        { key: 'b',  category: 'b' },
        { key: 'c',  category: 'c' },
        { key: 'd',  category: 'd' },
    ]);

    }, // END SETUP
    function (test) {
      function dumpAB(panel) {
        var str = panel.actualBounds.toString();
        var itr = panel.elements;
        while (itr.next()) {
          var obj = itr.value;
          if (obj instanceof go.Panel) str += dumpAB(obj, str);
          else str += obj.actualBounds.toString();
        }
        return str;
      }
      var diagram = test.diagram;
      var a = diagram.findNodeForKey('a');
      var b = diagram.findNodeForKey('b');
      var c = diagram.findNodeForKey('c');
      var d = diagram.findNodeForKey('d');
      test.assert(dumpAB(a) === 'Rect(0,0,210,64)Rect(0,0,210,40)Rect(0,40,210,24)Rect(3,0,24,24)Rect(30,0,180,24)');
      test.assert(dumpAB(b) === 'Rect(230,0,210,64)Rect(0,0,210,40)Rect(0,40,210,24)Rect(0,0,24,24)Rect(24,0,186,24)');
      test.assert(dumpAB(c) === 'Rect(0,84,210,64)Rect(0,0,210,40)Rect(0,40,210,24)Rect(3,0,24,24)Rect(70,0,100,24)');
      test.assert(dumpAB(d) === 'Rect(230,84,210.00000000000003,64)Rect(1.4210854715202004e-14,0,210,40)Rect(0,40,210.00000000000003,24)Rect(8.322580645161292,0,24,24)Rect(75.32258064516131,0,100,24)');
    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('Span+Stretch + r/c minimums 2', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, 'Vertical',
        {
          minSize: new go.Size(100, 0),
          isShadowed: true,
          shadowOffset: new go.Point(2, 2),
          shadowColor: "#ccc",
          selectionObjectName: "Shape",
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          isTreeExpanded: false,
          // selectionChanged: (node) => {
          //   this._store.dispatch(SelectResourceAction({ uri: node.data.id }));
          // }
        },
        new go.Binding("location", "location").makeTwoWay(),
        new go.Binding("isTreeLeaf", "hasSubClasses", v => !v),
        $(go.Panel, 'Auto',
          $(go.Shape, 'RoundedRectangle',
            { name: "Shape", stroke: '#e0e0e0', fill: '#fff' }
          ),
          $(go.Panel, "Table",
            { stretch: go.GraphObject.Fill },
            $(go.RowColumnDefinition,
              { row: 0, sizing: go.RowColumnDefinition.None }
            ),
            $(go.Panel, "Vertical",
              {
                row: 1,
                itemTemplate:
                  $(go.Panel, "Horizontal",
                    $(go.Picture,
                      { width: 210,
                        height: 75, background: "chartreuse",
                        imageStretch: go.GraphObject.UniformToFill
                      },
                      new go.Binding("source", "url")
                    )
                  )
              },
              new go.Binding("itemArray", "images")
            ),
            $(go.Panel, "Horizontal",
              {
                row: 2,
                margin: 5
              },
              $(go.Shape,
                {
                  figure: "Circle",
                  desiredSize: new go.Size(14, 14),
                  stroke: null,
                  margin: 5
                },
                new go.Binding("fill", "color")),
              $(go.TextBlock,
                {
                  name: "ClassNameBlock",
                  editable: true,
                  alignment: go.Spot.Center
                },
                new go.Binding("text", "label").makeTwoWay())
            ),
            $(go.Panel, "Table",
              {
                row: 4,
                name: "Attributes",
                alignment: go.Spot.TopLeft,
                defaultAlignment: go.Spot.Left,
                defaultRowSeparatorStroke: "#f0f0f0",
                stretch: go.GraphObject.Horizontal,
                margin: 5,
                itemTemplate: $(go.Panel, "TableRow",
                  $(go.TextBlock,
                    {
                      column: 0,
                      font: "20px 'XSD Icons'",
                      stroke: "#7a7a7a",
                      height: 24,
                      width: 24,
                      verticalAlignment: go.Spot.LeftCenter,
                      spacingAbove: 4.2,
                      // Todo: Add editing behavior
                    },
                    new go.Binding("text", "icon").makeTwoWay()
                  ),
                  $(go.TextBlock,
                    {
                      column: 1,
                      name: "EditAttributeBlock",
                      stroke: "#333333",
                      height: 24,
                      editable: true,
                      isMultiline: false,
                      verticalAlignment: go.Spot.LeftCenter,
                      stretch: go.GraphObject.Horizontal,
                      // Todo: Add hover behavior
                    },
                    new go.Binding("text", "label").makeTwoWay(),
                  ),
                  $("Button",
                    {
                      column: 3,
                      margin: 2,
                      width: 20,
                      click: (e, obj) => {
                        const classUri = obj.part.data.id;
                        const propertyUri = obj.part.data.attributes[obj.row]?.id;

                        // Todo: Implement attribute removal business logic.
                        console.warn(classUri, propertyUri);

                        diagram.model.removeArrayItem(obj.part.data.attributes, obj.row);
                      }
                    },
                    $(go.TextBlock, {
                      font: "bold 14px 'Material Icons'",
                      text: "",
                      stroke: '#424242',
                      height: 14,
                      width: 14,
                      verticalAlignment: go.Spot.Center,
                      spacingAbove: 1.3
                    })
                  ),
                )
              },
              new go.Binding("itemArray", "attributes"),
              // Note: The stretching behavior of the table is a bit weird. It will compute the required size
              // for all children in the row and the sum of these values is the table width. Because we have
              // one clumn that will stretch horizontally, the resulting table size is 100% (available space)
              // + 2 * 30px. That means the table will use up 60px more horizontal size than given by the
              // container. To fix this, we add a padding to the stretched column and move all adjacent columns
              // into that column via a negative padding. Hacky, but it works.
              $(go.RowColumnDefinition, { column: 0, width: 30 }),
              $(go.RowColumnDefinition, { column: 1 }),
              $(go.RowColumnDefinition, { column: 2, width: 30 }),
            )
          ),
        ),
        $("TreeExpanderButton",
          {
            name: 'InsertSubClassButton',
            width: 20,
            height: 20,
            alignment: go.Spot.BottomCenter,
            alignmentFocus: go.Spot.Center,
            click: (e, button) => {
              const node = button.part;

              if (node != null) {
                e.handled = true;

                // this.insertSubClassNodes(node);
              }
            }
          },
          new go.Binding("visible", "info.hasSubClasses")
        )
      );


    diagram.model = new go.GraphLinksModel(
    [
      {
        key: 1, label: "Alpha", color: "lightblue",
        images: [
          {  },
          {  }
        ],
        attributes: [
          { icon: "1", label: "label" },
          { icon: "2", label: "label two" }
        ]
      }
    ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var a = diagram.nodes.first();
      // bad width: ~276
      // good width: ~216
      // use approx values because of text
      test.assert(a.actualBounds.width < 220);
    }, // END TEST
    null
)); // END .ADD

// Items added by TableRows/Columns should be identical to items with the same specified rows
// Additionally, this tests to ensure separators are not improperly added at the start of the Table panel,
// Even if the table panel's starting rows and columns are not zero
t5.add(new Test('RowCol Consistency', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.layout = new go.GridLayout({wrappingColumn: 1});
      diagram.nodeTemplateMap.add('aa',
          $(go.Node, "Table",
            $(go.RowColumnDefinition,
              { row: 1, background: "lime" }),
            $(go.RowColumnDefinition,
              { row: 11, background: "cyan" }),
            {
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5,
              defaultRowSeparatorStroke: "purple",
              defaultRowSeparatorStrokeWidth: 3
            },
            $(go.Panel, "TableRow", { row: 1 },
              $(go.Shape, { name: 'A', fill: 'rgba(255,255,255,.9)', width: 40, height: 20, strokeWidth: 0, column: 1 }),
              $(go.Shape, { name: 'B', fill: 'rgba(255,0,0,.4)', width: 25, height: 20, strokeWidth: 0, column: 11 }),
            ),
            $(go.Panel, "TableRow", { row: 11 },
              $(go.Shape, { name: 'C', fill: 'rgba(255,55,255,.7)', width: 50, height: 20, strokeWidth: 0, column: 1 }),
              $(go.Shape, { name: 'D', fill: 'rgba(255,0,0,.4)', width: 20, height: 20, strokeWidth: 0, column: 11 }),
            ),
        ));

        diagram.nodeTemplateMap.add('bb',
          $(go.Node, "Table",
            $(go.RowColumnDefinition,
              { row: 1, background: "lime" }),
            $(go.RowColumnDefinition,
              { row: 11, background: "cyan" }),
            {
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5,
              defaultRowSeparatorStroke: "purple",
              defaultRowSeparatorStrokeWidth: 3
            },
              $(go.Shape, { name: 'A', fill: 'rgba(255,255,255,.9)', width: 40, height: 20, strokeWidth: 0, row: 1, column: 1 }),
              $(go.Shape, { name: 'B', fill: 'rgba(255,0,0,.4)', width: 25, height: 20, strokeWidth: 0, row: 1, column: 11 }),
              $(go.Shape, { name: 'C', fill: 'rgba(255,55,255,.7)', width: 50, height: 20, strokeWidth: 0, row: 11, column: 1 }),
              $(go.Shape, { name: 'D', fill: 'rgba(255,0,0,.4)', width: 20, height: 20, strokeWidth: 0,  row: 11, column: 11 })
          )
        );

        diagram.nodeTemplateMap.add('cc',
        $(go.Node, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Table",
            $(go.RowColumnDefinition,
              { column: 1, background: "lime" }),
            $(go.RowColumnDefinition,
              { column: 11, background: "cyan" }),
            {
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5,
              defaultRowSeparatorStroke: "purple",
              defaultRowSeparatorStrokeWidth: 3
            },
            $(go.Panel, "TableRow", { row: 1 },
              $(go.TextBlock, "Alice", { width: 30, height: 15, column: 1 }),
              $(go.TextBlock, "123456", { width: 50, height: 15, column: 11 })
            ),
            $(go.Panel, "TableRow", { row: 11 },
              $(go.TextBlock, "Alice", {  width: 45, height: 12, column: 1 }),
              $(go.TextBlock, "123456", { width: 45, height: 12, column: 11 })
            ),
          )
        ))

        diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Table",
            //{ margin: 0.5 },
            // THIS IS DRAWN INCORRECTLY -- with a gap on the left side,
            // which is probably just an initialization bug determining where to draw
            $(go.RowColumnDefinition,
              { row: 1, background: "lime" }),
            $(go.RowColumnDefinition,
              { row: 11, background: "cyan" }),
            {
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5,
              defaultRowSeparatorStroke: "purple",
              defaultRowSeparatorStrokeWidth: 3
            },
            $(go.Panel, "TableRow", { row: 1 },
              $(go.TextBlock, "Alice", { width: 50, height: 25, column: 1 }),
              $(go.TextBlock, "123456", { width: 60, height: 15, column: 11 })
            ),
            $(go.Panel, "TableRow", { row: 11 },
              $(go.TextBlock, "Lambda", {  width: 60, height: 15, column: 1 }, new go.Binding("text")),
              $(go.TextBlock, "9999999", { width: 60, height: 15,  column: 11 })
            ),
          )
        );

      diagram.model = new go.GraphLinksModel([
          { key: 1, category: 'aa' },
          { key: 2, category: 'bb' },
          { key: 3, category: 'cc' },
          { key: 4,  }
        ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB2(diagram.findNodeForKey(1)) === ':Rect(0,0,80,43):Rect(0,0,80,20)A:Rect(5,0,40,20)B:Rect(55,0,25,20):Rect(0,23,80,20)C:Rect(0,23,50,20)D:Rect(57.5,23,20,20)');
      test.assert(dumpAB2(diagram.findNodeForKey(2)) === ':Rect(0,53,80,43)A:Rect(5,0,40,20)B:Rect(55,0,25,20)C:Rect(0,23,50,20)D:Rect(57.5,23,20,20)');
      test.assert(dumpAB2(diagram.findNodeForKey(3)) === ':Rect(0,106,101,31):Rect(0,0,101,31):Rect(0.5,0.5,100,30):Rect(0,0,100,15):Rect(7.5,0,30,15):Rect(50,0,50,15):Rect(0,18,100,12):Rect(0,18,45,12):Rect(52.5,18,45,12)');
      test.assert(dumpAB2(diagram.findNodeForKey(4)) === ':Rect(0,147,126,44):Rect(0,0,126,44):Rect(0.5,0.5,125,43):Rect(0,0,125,25):Rect(5,0,50,25):Rect(65,5,60,15):Rect(0,28,125,15):Rect(0,28,60,15):Rect(65,28,60,15)');

    }, // END TEST
    null
)); // END .ADD
function dumpAB2(panel) {
  var str = panel.name + ':' + panel.actualBounds.toString();
  var itr = panel.elements;
  while (itr.next()) {
    var obj = itr.value;
    if (obj instanceof go.Panel) str += dumpAB2(obj, str);
    else str += obj.name + ':' + obj.actualBounds.toString();
  }
  return str;
}

// see last test comment
t5.add(new Test('RowCol Consistency 2', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.layout = new go.GridLayout({wrappingColumn: 1});
      diagram.nodeTemplateMap.add('aa',
      $(go.Node, "Table",
        $(go.RowColumnDefinition,
          { row: 1, background: "lime" }),
        $(go.RowColumnDefinition,
          { row: 11, background: "cyan" }),
        {
          defaultColumnSeparatorStroke: "orange",
          defaultColumnSeparatorStrokeWidth: 5,
          defaultRowSeparatorStroke: "purple",
          defaultRowSeparatorStrokeWidth: 3
        },
        $(go.Panel, "TableColumn", { column: 1 },
          $(go.Shape, { name: 'A', fill: 'rgba(255,255,255,.9)', width: 40, height: 20, strokeWidth: 0, row: 1 }),
          $(go.Shape, { name: 'B', fill: 'rgba(255,0,0,.4)', width: 25, height: 20, strokeWidth: 0, row: 11 }),
        ),
        $(go.Panel, "TableColumn", { column: 11 },
          $(go.Shape, { name: 'C', fill: 'rgba(255,55,255,.7)', width: 50, height: 20, strokeWidth: 0, row: 1 }),
          $(go.Shape, { name: 'D', fill: 'rgba(255,0,0,.4)', width: 20, height: 20, strokeWidth: 0, row: 11 }),
        ),
    ));

    diagram.nodeTemplateMap.add('bb',
      $(go.Node, "Table",
        $(go.RowColumnDefinition,
          { row: 1, background: "lime" }),
        $(go.RowColumnDefinition,
          { row: 11, background: "cyan" }),
        {
          defaultColumnSeparatorStroke: "orange",
          defaultColumnSeparatorStrokeWidth: 5,
          defaultRowSeparatorStroke: "purple",
          defaultRowSeparatorStrokeWidth: 3
        },
          $(go.Shape, { name: 'A', fill: 'rgba(255,255,255,.9)', width: 40, height: 20, strokeWidth: 0, column: 1, row: 1 }),
          $(go.Shape, { name: 'B', fill: 'rgba(255,0,0,.4)', width: 25, height: 20, strokeWidth: 0, column: 1, row: 11 }),
          $(go.Shape, { name: 'C', fill: 'rgba(255,55,255,.7)', width: 50, height: 20, strokeWidth: 0, column: 11, row: 1 }),
          $(go.Shape, { name: 'D', fill: 'rgba(255,0,0,.4)', width: 20, height: 20, strokeWidth: 0,  column: 11, row: 11 })
      )
    );

  diagram.model = new go.GraphLinksModel([
      { key: 1, category: 'aa' },
      { key: 2, category: 'bb' }
    ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB2(diagram.findNodeForKey(1)) === ':Rect(0,0,95,43):Rect(0,0,40,43)A:Rect(0,0,40,20)B:Rect(7.5,23,25,20):Rect(45,0,50,43)C:Rect(45,0,50,20)D:Rect(60,23,20,20)');
      test.assert(dumpAB2(diagram.findNodeForKey(2)) === ':Rect(0,53,95,43)A:Rect(0,0,40,20)B:Rect(7.5,23,25,20)C:Rect(45,0,50,20)D:Rect(60,23,20,20)');
    }, // END TEST
    null
)); // END .ADD

// When spanning multiple columns or rows, some objects would be the wrong size if those rows/cols didn't exist
// eg column 6 + 11 existing, but none of the cols in between, while having separator sizing
t5.add(new Test('RowColSpan', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      function txtSize() {
        return { width: 50, height: 15, background: 'lightgray' };
      }

      diagram.layout = new go.GridLayout({wrappingColumn: 1});
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Table",
            { margin: 0.5 },
            { // with these two property settings, the "red" Shape is mis-aligned across the two columns
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5
            },
            $(go.Panel, "TableRow", { row: 1 },
              $(go.TextBlock, "Alice", txtSize(), { column: 1 }),
              $(go.Shape, { column: 11, width: 40, height: 20, strokeWidth: 0, fill: "green" })
            ),
            $(go.Panel, "TableRow", { row: 11 },
              $(go.TextBlock, "Lambda", txtSize(), { column: 1 }),
              $(go.Shape, { column: 11, width: 80, height: 40, strokeWidth: 0, fill: "blue" })
            ),
            $(go.Panel, "TableColumn", { column: 6 },
              $(go.TextBlock, "Omega", txtSize(), { row: 1 }),
              $(go.Shape, { row: 11, columnSpan: 9, height: 30, height: 30, strokeWidth: 0, fill: "red" })
            )
          )
        );

        diagram.nodeTemplateMap.add('b',
        $(go.Node, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Table",
            { margin: 0.5 },
            { // with these two property settings, the "red" Shape is mis-aligned across the two columns
              defaultColumnSeparatorStroke: "orange",
              defaultColumnSeparatorStrokeWidth: 5
            },
            $(go.Panel, "TableRow", { row: 1 },
              $(go.TextBlock, "Alice", txtSize(), { column: 1 }),
              $(go.Shape, { column: 11, width: 40, height: 20, strokeWidth: 0, fill: "green" })
            ),
            $(go.Panel, "TableRow", { row: 11 },
              $(go.TextBlock, "Lambda", txtSize(), { column: 1 }),
              $(go.Shape, { column: 11, width: 80, height: 40, strokeWidth: 0, fill: "blue" })
            ),
            $(go.Panel, "TableColumn", { column: 6 },
              $(go.TextBlock, "Omega", txtSize(), { row: 1 }),
              $(go.Shape, { row: 11, columnSpan: 9, height: 30, strokeWidth: 0, fill: "red" })
              ),
            $(go.Panel, "TableColumn", { column: 3 },
              $(go.TextBlock, "Beta", txtSize(), { row: 1 }),
              $(go.Shape, { row: 16, columnSpan: 19, height: 30, strokeWidth: 0, fill: "yellow", stretch: go.GraphObject.Horizontal })
            )
          )
        ));

      diagram.model = new go.GraphLinksModel([
          { key: 1, },
          { key: 2, category: 'b' }
        ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB2(diagram.findNodeForKey(1)) === ':Rect(0,0,192,62):Rect(0,0,192,62):Rect(1,1,190,60):Rect(0,0,190,20):Rect(0,2.5,50,15):Rect(130,0,40,20):Rect(0,20,190,40):Rect(0,32.5,50,15):Rect(110,20,80,40):Rect(55,0,50,60):Rect(55,2.5,50,15):Rect(72.5,25,100,30)');
      test.assert(dumpAB2(diagram.findNodeForKey(2)) === ':Rect(0,72,247,92):Rect(0,0,247,92):Rect(1,1,245,90):Rect(0,0,245,20):Rect(0,2.5,50,15):Rect(185,0,40,20):Rect(0,20,245,40):Rect(0,32.5,50,15):Rect(165,20,80,40):Rect(110,0,50,90):Rect(110,2.5,50,15):Rect(127.5,25,100,30):Rect(55,0,50,90):Rect(55,2.5,50,15):Rect(55,60,190,30)');
    }, // END TEST
    null
)); // END .ADD

// Ensure tables made with two different methods measure the same
t5.add(new Test('Chaining', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

        // define a simple Node template
        diagram.nodeTemplate = new go.Node('Table')
          .addRowColumnDefinition(
            new go.RowColumnDefinition({ column: 0, width: 50, background: 'lightblue' }).bind(
              'background'
            )
          )
          .addRowColumnDefinition(
            new go.RowColumnDefinition({ column: 1, width: 50, background: 'green' })
          )
          .addRowColumnDefinition(new go.RowColumnDefinition({ row: 2, height: 30 }))
          .add(new go.Shape({ fill: 'red', width: 20, height: 20 }))
          .add(new go.Shape({ column: 1, fill: 'lime', width: 20, height: 20 }))
          .add(
            new go.Shape({
              column: 0,
              columnSpan: 2,
              row: 2,
              fill: 'orange',
              width: 20,
              height: 20,
            })
          );

        diagram.nodeTemplateMap.add(
          'make',
          $(
            go.Node,
            'Table',
            $(
              go.RowColumnDefinition,
              { column: 0, width: 50, background: 'lightblue' },
              new go.Binding('background')
            ),
            $(go.RowColumnDefinition, { column: 1, width: 50, background: 'green' }),
            $(go.RowColumnDefinition, { row: 2, height: 30 })
          )
            .add(new go.Shape({ fill: 'red', width: 20, height: 20 }))
            .add(new go.Shape({ column: 1, fill: 'lime', width: 20, height: 20 }))
            .add(
              new go.Shape({
                column: 0,
                columnSpan: 2,
                row: 2,
                fill: 'orange',
                width: 20,
                height: 20,
              })
            )
        );

        // create the model data that will be represented by Nodes and Links
        diagram.model = new go.GraphLinksModel([
          { key: 'Alpha', background: 'red' },
          { key: 'Beta', category: 'make', background: 'red' },
        ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      const a = diagram.findNodeForKey('Alpha');
      const b = diagram.findNodeForKey('Beta');
      // make sure properties and bindings are set
      test.assert(a.getColumnDefinition(0).background === b.getColumnDefinition(0).background);
      test.assert(a.getColumnDefinition(0).background === 'red');
      test.assert(a.getColumnDefinition(0).width === b.getColumnDefinition(0).width);
      test.assert(a.getColumnDefinition(1).width === b.getColumnDefinition(1).width);
      test.assert(a.getRowDefinition(2).height === b.getRowDefinition(2).height);
      test.assert(a.actualBounds.width === b.actualBounds.width);
      test.assert(a.actualBounds.height === b.actualBounds.height);
    }, // END TEST
    null
)); // END .ADD

// new methods added in 2.3.5
t5.add(new Test('TESTNAME', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      function shape(row, col) {
        return new go.Shape('RoundedRectangle', {
          row: row, column: col,
          strokeWidth: 0,
          fill: 'white',
          width: 50,
          height: 50,
        }).bind('fill', 'color')
      }
      diagram.nodeTemplate = new go.Node('Table')
        .addColumnDefinition(0, { width: 60 })
        .addColumnDefinition(1, { width: 60 })
        .addRowDefinition(1, { height: 20 })
        .add(shape(1, 0))
        .add(shape(1, 1))
        .add(shape(0, 1))

      diagram.model = new go.GraphLinksModel([{ key: 'Alpha', color: 'lightblue' }]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      const n = diagram.nodes.first();
      test.assert(n.getRowDefinition(1).total === 20)
      test.assert(n.getRowDefinition(0).total === 50)
      test.assert(n.getColumnDefinition(0).total === 60)
      test.assert(n.getColumnDefinition(1).total === 60)
    }, // END TEST
    null
)); // END .ADD

// ensures that rowLeft accounts for extra padding value only once when
t5.add(new Test('rowLeft', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
      new go.Node("Vertical", {

      })
        .bind("location", "loc", go.Point.parse)
        .add(
          new go.Panel("Vertical", {
            stretch: go.Stretch.Fill
          })
            .add(
              new go.Shape({ width: 100, height: 10, fill: "gray", strokeWidth: 0 })
                .bind("fill", "color")
            ),
          new go.Panel("Table", {
            stretch: go.Stretch.Fill,
            row: 1, column: 0, //columnSpan: 3, //stretch: go.Stretch.Fill,
            background: 'purple',
            name: "myTree",
            defaultRowSeparatorStrokeWidth: 15,
            defaultRowSeparatorStroke: "orange",
            portId: "", fromSpot: go.Spot.Right, toSpot: go.Spot.Left,
            itemTemplate: new go.Panel("TableRow", {
              fromSpot: go.Spot.Right, toSpot: go.Spot.Left, background: 'red'
            })
              .add(
                new go.Shape("TriangleRight", { column: 0, width: 12, height: 4, strokeWidth: 0 }),
                new go.TextBlock({
                  height: 15, width: 30,
                  column: 1,
                  background: 'lime',
                  stretch: go.GraphObject.None
                }).bind("text"),
              )

          })
            .bind("itemArray", "ports")
        );


    diagram.model = new go.GraphLinksModel({
      linkFromPortIdProperty: "fp",
      linkToPortIdProperty: "tp",
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray:
        [
          {
            key: 3, text: "Gamma Gamma", color: "green", loc: "200 100",
            ports: [
              { id: "a", text: "First Port" },
              { id: "b", text: "Second Port" },
              // { id: "c", text: "Third Port" },
            ]
          },
        ],
      linkDataArray: [ ]
    });
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.first().elt(1).getRowDefinition(1).actual === 15)

    }, // END TEST
    null
)); // END .ADD

t5.add(new Test('span and stretch', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.add(
        $(go.Part,
          $(go.Panel, "Table",
            $(go.TextBlock, "Three Col Header",  // spans all three columns
              {
                row: 0, column: 0, columnSpan: 3, stretch: go.GraphObject.Horizontal,
                margin: 2, background: "lightgray"
              }),
            $(go.TextBlock, "row 1\ncol 0",
              { row: 1, column: 0, margin: 2, background: "lightgray" }),
            $(go.TextBlock, "row 1\ncol 1",
              { row: 1, column: 1, margin: 2, background: "lightgray" })
          )
        ));
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      const p = diagram.parts.first();
      // extra approx because of text
      const approxeq = (v1, v2, epsilon = 2) => Math.abs(v1 - v2) <= epsilon;
      test.assert(approxeq(p.elt(0).actualBounds.width, 71.578125))
      test.assert(approxeq(p.elt(0).actualBounds.height, 64.311328125))
    }, // END TEST
    null
)); // END .ADD


/*
t5.add(new Test('TESTNAME', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;

    }, // END TEST
    null
)); // END .ADD

*/

})();