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
  var colls = new TestCollection('Detection');
  TestRoot.add(colls);

  function addTests(part) {

  // FindObjectAt:
  var collname = 'FindObjects on Nodes';
  if (part) collname = 'FindObjects on Parts';

  var fobjects = new TestCollection(collname);
  colls.add(fobjects);

  var name1 = 'Diagram.findObject with a node of zero size';
  if (part) name1 = 'Diagram.findObject with a Part of zero size';

  fobjects.add(new Test(name1, null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');
      var node1;
      if (part)
        node1 = new go.Part(go.Panel.Vertical);
      else
        node1 = new go.Node(go.Panel.Vertical);
      node1.location = new go.Point(80,80);
      test.diagram.add(node1);
      test.diagram.commitTransaction('stuff');
      test.node1 = node1;
    },
    function(test) { // execute

    },
    function(test) { // test
      // without a background:
      test.assert(test.node1.background === null);
      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) === null); // cant get it - no background

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 0); // cant get it - no background
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 1);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 1);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 1);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 1);

      test.assert(test.node1.measuredBounds.equals(new go.Rect(0,0,0,0)));
      test.assert(test.node1.actualBounds.equals(new go.Rect(80,80,0,0)));
      test.assert(test.node1.naturalBounds.equals(new go.Rect(0, 0, 0,0)));


      // give it a background
      test.node1.background = 'blue';

      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) !== null);

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 1);
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 1);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 1);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 1);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 1);

      test.assert(test.node1.measuredBounds.equals(new go.Rect(0,0,0,0)));
      test.assert(test.node1.actualBounds.equals(new go.Rect(80,80,0,0)));
      test.assert(test.node1.naturalBounds.equals(new go.Rect(0, 0, 0,0)));

      //now get rid of it
      test.diagram.remove(test.node1);

      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) === null);

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 0);
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 0);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 0);
    }
  ));

  var name2 = 'Diagram.findObject a zero-node and zero-GraphObject inside';
  if (part) name2 = 'Diagram.findObject a zero-Part and zero-GraphObject inside'
  fobjects.add(new Test(name2, null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');
      var node1;
      if (part)
        node1 = new go.Part(go.Panel.Vertical);
      else
        node1 = new go.Node(go.Panel.Vertical);
      node1.location = new go.Point(80,80);

      var tb1 = new go.TextBlock();
      tb1.desiredSize = new go.Size(0,0);
      node1.add(tb1);

      test.diagram.add(node1);
      test.diagram.commitTransaction('stuff');
      test.node1 = node1;
      test.tb1 = tb1;
    },
    function(test) { // execute

    },
    function(test) { // test
      // without a background:
      test.assert(test.node1.background === null);
      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) === test.tb1); // will get the TextBlock

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 1); // just one object - no background
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 2);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 2);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 2);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 2);

      test.assert(test.node1.measuredBounds.equals(new go.Rect(0,0,0,0)));
      test.assert(test.node1.actualBounds.equals(new go.Rect(80,80,0,0)));
      test.assert(test.node1.naturalBounds.equals(new go.Rect(0, 0, 0,0)));


      // give it a background
      test.node1.background = 'blue';

      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) !== null);

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 2);
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 2);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 2);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 2);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 2);

      test.assert(test.node1.measuredBounds.equals(new go.Rect(0,0,0,0)));
      test.assert(test.node1.actualBounds.equals(new go.Rect(80,80,0,0)));
      test.assert(test.node1.naturalBounds.equals(new go.Rect(0, 0, 0,0)));

      //now get rid of it
      test.diagram.remove(test.node1);

      test.assert(test.diagram.findObjectAt(new go.Point(80, 80), null, null) === null);

      test.assert(test.diagram.findObjectsAt(new go.Point(80, 80), null, null).count === 0);
      test.assert(test.diagram.findObjectsAt(new go.Point(80, 81), null, null).count === 0);

      test.assert(test.diagram.findObjectsIn(new go.Rect(80,80, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 0, 0), null, null, true).count === 0);
      test.assert(test.diagram.findObjectsIn(new go.Rect(79,79, 1, 1), null, null, true).count === 0);

      test.assert(test.diagram.findObjectsNear(new go.Point(80, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 0, null, null, true).count === 0);
      test.assert(test.diagram.findObjectsNear(new go.Point(79, 80), 1, null, null, true).count === 0);

    }
  ));

  var name3 = 'Diagram.findObject when a node is cropping child due to small desiredSize';
  if (part) name3 = 'Diagram.findObject when a Part is cropping child due to small desiredSize';

  fobjects.add(new Test(name3, null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');

      var nodevert;
      if (part)
        nodevert = new go.Part(go.Panel.Vertical);
      else
        nodevert = new go.Node(go.Panel.Vertical);

      nodevert.location = new go.Point(200,100);
      var tb2 = new go.TextBlock();
      tb2.desiredSize = new go.Size(100,200);
      nodevert.desiredSize = new go.Size(100,100);
      nodevert.add(tb2);

      var s = new go.Shape();
      s.position = new go.Point(20,20);
      s.desiredSize = new go.Size(20,20);
      s.fill = 'blue';
      nodevert.add(s);
      test.s = s;
      test.tb2 = tb2;
      test.nodevert = nodevert;
      test.diagram.add(nodevert);

      test.diagram.commitTransaction('stuff');
    },
    function(test) { // execute

    },
    function(test) { // test

      //test.assert(test.diagram.findObjectsNear(new go.Point(250, 250), 100, null, null).count === 2) // NOT the small shape because Panel.findObjectsNear excludes objects completely outside of the Panel's actualBounds
      test.assert(test.diagram.findObjectsIn(new go.Rect(250 - 100, 250 - 100, 200, 200), null, null, true).count === 2)

      test.assert(test.diagram.findObjectAt(new go.Point(250, 250), null, null) === null);
      test.assert(test.diagram.findObjectAt(new go.Point(250, 199), null, null) instanceof go.TextBlock);
      test.assert(test.diagram.findObjectsAt(new go.Point(250, 199), null, null).count === 1);

      test.nodevert.background = 'gray';
      test.assert(test.diagram.findObjectsAt(new go.Point(250, 199), null, null).count === 2);
    }
  ));
  var name4 ='Diagram.findObject margin tests';
  if (part) name4 ='Diagram.findObject margin tests on Part';
  fobjects.add(new Test(name4, null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');

      var nodevert;
      if (part)
        nodevert = new go.Part(go.Panel.Vertical);
      else
        nodevert = new go.Node(go.Panel.Vertical);

      nodevert.location = new go.Point(20,20);
      nodevert.background = 'lime';

      var s = new go.Shape();
      s.position = new go.Point(20,20);
      s.desiredSize = new go.Size(20,20);
      s.fill = 'blue';
      s.margin = 10;
      nodevert.add(s);

      test.s = s;
      test.nodevert = nodevert;
      test.diagram.add(nodevert);

      test.diagram.commitTransaction('stuff');
    },
    function(test) { // execute

    },
    function(test) { // test

      test.assert(test.diagram.findObjectsAt(new go.Point(22,22), null, null).count === 1);
      test.assert(test.diagram.findObjectsAt(new go.Point(32,32), null, null).count === 2);

      test.assert(test.diagram.findObjectAt(new go.Point(22,22), null, null) instanceof go.Part);
      test.assert(test.diagram.findObjectAt(new go.Point(29.99,30), null, null) instanceof go.Part); // right on the edge of shape outside // ####

      test.assert(test.diagram.findObjectAt(new go.Point(30,30), null, null) instanceof go.Shape); // right on the edge of shape inside
      test.assert(test.diagram.findObjectAt(new go.Point(42,42), null, null) instanceof go.Shape);
      test.assert(test.diagram.findObjectAt(new go.Point(52,52), null, null) instanceof go.Part);

     // test.assert(test.diagram.findObjectsIn(new go.Rect(20,20, 0, 0), null, null, true).count);
    }
  ));

  } // end function addTests(part) {

  addTests(false);
  addTests(true);


  var fobjects2 = new TestCollection("Alignment tests");
  colls.add(fobjects2);

  fobjects2.add(new Test("align and alignFocus", null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');
      var d = test.diagram;

      var np4 = new go.Node(go.Panel.Spot)
      np4.location = new go.Point(60,60);


      var s = new go.Shape();
      s.desiredSize = new go.Size(60,50);
      s.fill = 'lime';
      s.name = "main"

      var s2 = new go.Shape();
      s2.position = new go.Point(20,20);
      s2.desiredSize = new go.Size(20,20);
      s2.fill = 'pink';
      s2.name = 's2';

      s2.alignment = go.Spot.TopLeft;
      s2.alignmentFocus = go.Spot.TopLeft;

      //np4.add(pic2);
      np4.locationObjectName = "main";
      np4.add(s); //instead of tempThing
      np4.add(s2);

      d.add(np4);
      test.s = s;
      test.s2 = s2;
      test.np4 = np4;
      test.diagram.commitTransaction('stuff');
    },
    function(test) { // execute

    },
    function(test) { // test
      var d = test.diagram;
      var s = test.s
      var s2 = test.s2;
      var np4 = test.np4;

test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(80,80), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(81.1,81), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === null);
// location and position are equal
test.assert(np4.location.equals(new go.Point(60,60)))
test.assert(np4.position.equals(new go.Point(60,60)))

d.startTransaction('stuff2');
s2.alignmentFocus = go.Spot.Center;
d.commitTransaction('stuff2');

test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(74,54), null, null) === null);
test.assert(test.diagram.findObjectAt(new go.Point(54,74), null, null) === null);
test.assert(test.diagram.findObjectAt(new go.Point(50,50), null, null) === s2);
// position is offset by 10.5,10.5
test.assert(np4.location.equals(new go.Point(60,60)))
test.assert(np4.position.equals(new go.Point(49.5,49.5)))

d.startTransaction('stuff2');
s2.alignment = go.Spot.Center;
s2.alignmentFocus = go.Spot.TopLeft;
d.commitTransaction('stuff2');

test.assert(test.diagram.findObjectAt(new go.Point(90.5,85.4), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(90.5,85.5), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(89.9,85), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(115,102), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(80,80), null, null) === s);
test.assert(np4.location.equals(new go.Point(60,60)))
test.assert(np4.position.equals(new go.Point(60,60)))

d.startTransaction('stuff2');
s2.alignment = go.Spot.Center;
s2.alignmentFocus = go.Spot.Center;
d.commitTransaction('stuff2');

test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(80,74.9), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(80,75), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(80+20,75+20), null, null) === s2);
test.assert(test.diagram.findObjectAt(new go.Point(80+21,75+21.1), null, null) === s);
test.assert(test.diagram.findObjectAt(new go.Point(80+21.1,75+21), null, null) === s);

    }
  ));

  fobjects2.add(new Test("Spot Panel - align and alignFocus", null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');
      var d = test.diagram;

      var np4 = new go.Node(go.Panel.Spot)
      np4.location = new go.Point(60,60);


      var s = new go.Shape();
      s.desiredSize = new go.Size(60,50);
      s.fill = 'lime';
      s.name = "main"

      var s2 = new go.Shape();
      s2.position = new go.Point(20,20);
      s2.desiredSize = new go.Size(20,20);
      s2.fill = 'pink';
      s2.name = 's2';


      var tempThing = new go.Panel(go.Panel.Vertical);
      var s3 = s2.copy(); s3.name = "s3";
      tempThing.add(s3);
      tempThing.add(s);

      s2.alignment = go.Spot.TopLeft;
      s2.alignmentFocus = go.Spot.TopLeft;

      //np4.add(pic2);
      np4.locationObjectName = "main";
      //np4.locationSpot = new go.Spot(1, 0);
      np4.add(tempThing); //instead of tempThing
      np4.add(s2);


      d.add(np4);

      test.s = s;
      test.s2 = s2;
      test.s3 = s3;
      test.np4 = np4;
      test.diagram.commitTransaction('stuff');
    },
    function(test) { // execute

    },
    function(test) { // test
      var d = test.diagram;
      var s = test.s
      var s2 = test.s2;
      var s3 = test.s3;
      var np4 = test.np4;

    test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(60,40), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(80,60), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(81,81), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(80,40), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(82,42), null, null) === s3);
    test.assert(test.diagram.findObjectAt(new go.Point(85,45), null, null) === s3);

    test.assert(test.diagram.findObjectAt(new go.Point(99,59), null, null) === s3);
    // location and position are equal
    test.assert(np4.location.equals(new go.Point(60,60)))
    test.assert(np4.position.equals(new go.Point(60,39)))

    d.startTransaction('stuff2');
    s2.alignmentFocus = go.Spot.Center;
    d.commitTransaction('stuff2');

    test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(74,54), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(54,74), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(76,45), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(66,54), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(50,50), null, null) === null);
    test.assert(test.diagram.findObjectAt(new go.Point(49.5,28.5), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(80,40), null, null) === s3);
    test.assert(test.diagram.findObjectAt(new go.Point(99,59), null, null) === s3);
    // location and position are offset by 10,10
    test.assert(np4.location.equals(new go.Point(60,60)))
    test.assert(np4.position.equals(new go.Point(49.5,28.5)))
    test.assert(np4.actualBounds.equals(new go.Rect(49.5,28.5,71.5,82.5)))

    d.startTransaction('stuff2');
    s2.alignment = go.Spot.Center;
    s2.alignmentFocus = go.Spot.TopLeft;
    d.commitTransaction('stuff2');

    test.assert(test.diagram.findObjectAt(new go.Point(90.5,76), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(89.9,85), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(115,102), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(80,80), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(80,40), null, null) === s3);
    test.assert(test.diagram.findObjectAt(new go.Point(99,59), null, null) === s3);
    test.assert(np4.location.equals(new go.Point(60,60)))
    test.assert(np4.position.equals(new go.Point(60,39)))

    d.startTransaction('stuff2');
    s2.alignment = go.Spot.Center;
    s2.alignmentFocus = go.Spot.Center;
    d.commitTransaction('stuff2');

    test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s);
    test.assert(test.diagram.findObjectAt(new go.Point(60+20,40+25), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(60+20+20,40+25+20), null, null) === s2);
    test.assert(test.diagram.findObjectAt(new go.Point(80+20.1,75+20), null, null) === s);
    }
  ));

  // ??? do some isMain testing?


  var fobjects3 = new TestCollection("Location tests");
  colls.add(fobjects3);


  fobjects3.add(new Test("Location/Spot/Object", null,
    function(test) { // setup
      test.diagram.clear();
      test.diagram.startTransaction('stuff');
      var d = test.diagram;

      var np4 = new go.Node(go.Panel.Spot)
      np4.location = new go.Point(60,60);

      var s = new go.Shape();
      s.desiredSize = new go.Size(60,60);
      s.fill = 'lime';
      s.name = "s"
      s.angle = 45;

      var s2 = new go.Shape();
      s2.position = new go.Point(20,20);
      s2.desiredSize = new go.Size(20,20);
      s2.fill = 'pink';
      s2.name = 's2';

      s2.alignment = go.Spot.TopLeft;
      s2.alignmentFocus = go.Spot.TopLeft;

      np4.add(s); //instead of tempThing
      np4.add(s2);

      d.add(np4);

      test.s = s;
      test.s2 = s2;
      test.np4 = np4;
      test.diagram.commitTransaction('stuff');
    },
    function(test) { // execute

    },
    function(test) { // test
      var d = test.diagram;
      var s = test.s
      var s2 = test.s2;

      var np4 = test.np4;


  // make sure the pink square is in place
  test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(65,85), null, null) === null); // nothing down
  test.assert(test.diagram.findObjectAt(new go.Point(85,65), null, null) === null); // nothing right
  test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === null); // nothing top-left

  // green rotated object
  test.assert(test.diagram.findObjectAt(new go.Point(103,63), null, null) === s); // top
  test.assert(test.diagram.findObjectAt(new go.Point(65,103), null, null) === s); // left
  test.assert(test.diagram.findObjectAt(new go.Point(103,139), null, null) === s); // bottom
  test.assert(test.diagram.findObjectAt(new go.Point(140,103), null, null) === s); // right

  test.assert(np4.location.equals(np4.position));
  test.assert(np4.location.equals(new go.Point(60,60)));


  d.startTransaction('stuff2');
  np4.angle = 180;
  d.commitTransaction('stuff2');

  test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(55,33), null, null) === null);
  test.assert(test.diagram.findObjectAt(new go.Point(33,55), null, null) === null);

  //green rotated object
  test.assert(test.diagram.findObjectAt(new go.Point(17,53), null, null) === s);
  test.assert(test.diagram.findObjectAt(new go.Point(17,-18), null, null) === s);
  test.assert(test.diagram.findObjectAt(new go.Point(-18, 17), null, null) === s);
  test.assert(test.diagram.findObjectAt(new go.Point(54, 17), null, null) === s);

  d.startTransaction('stuff2');
  np4.angle = 0;
  np4.scale = 2;
  d.commitTransaction('stuff2');

  // make sure the pink square is in place
  test.assert(test.diagram.findObjectAt(new go.Point(60,60), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(65,85), null, null) === s2); // something there now
  test.assert(test.diagram.findObjectAt(new go.Point(85,65), null, null) === s2); // something there now
  test.assert(test.diagram.findObjectAt(new go.Point(108,73), null, null) === null); // nothing right
  test.assert(test.diagram.findObjectAt(new go.Point(73,108), null, null) === null); // nothing right
  test.assert(test.diagram.findObjectAt(new go.Point(59,59), null, null) === null); // nothing top-left

  // green rotated object
  test.assert(test.diagram.findObjectAt(new go.Point(143,64), null, null) === s); // top
  test.assert(test.diagram.findObjectAt(new go.Point(66,147), null, null) === s); // left
  test.assert(test.diagram.findObjectAt(new go.Point(143,223), null, null) === s); // bottom
  test.assert(test.diagram.findObjectAt(new go.Point(224,147), null, null) === s); // right

  test.assert(np4.location.equals(np4.position));
  test.assert(np4.location.equals(new go.Point(60,60)));

  d.startTransaction('stuff2');
  np4.locationSpot = new go.Spot(1, 0); // make it appear to move 120 to the left
  d.commitTransaction('stuff2');

  var w = np4.actualBounds.width;
  test.assert(w > 172 && w < 173);
  // make sure the pink square is in place
  test.assert(test.diagram.findObjectAt(new go.Point(60-w,60), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(65-w,85), null, null) === s2); // something there now
  test.assert(test.diagram.findObjectAt(new go.Point(85-w,65), null, null) === s2); // something there now
  test.assert(test.diagram.findObjectAt(new go.Point(108-w,73), null, null) === null); // nothing right
  test.assert(test.diagram.findObjectAt(new go.Point(73-w,108), null, null) === null); // nothing right
  test.assert(test.diagram.findObjectAt(new go.Point(59-w,59), null, null) === null); // nothing top-left

  // green rotated object
  test.assert(test.diagram.findObjectAt(new go.Point(143-w,64), null, null) === s); // top
  test.assert(test.diagram.findObjectAt(new go.Point(66-w,147), null, null) === s); // left
  test.assert(test.diagram.findObjectAt(new go.Point(143-w,223), null, null) === s); // bottom
  test.assert(test.diagram.findObjectAt(new go.Point(224-w,147), null, null) === s); // right

  test.assert(!np4.location.equals(np4.position));
  test.assert(np4.location.equals(new go.Point(60,60)));
  test.assert(np4.position.equals(new go.Point(60-w,60)));

  d.startTransaction('stuff2');
  // Spot at 1,0 and locationObject = s means that the middle-right corner of np4 will be 60,60
  np4.scale = 1
  np4.locationObjectName = 's';
  d.commitTransaction('stuff2');

  test.assert(test.diagram.findObjectAt(new go.Point(59,60), null, null) === s);
  test.assert(test.diagram.findObjectAt(new go.Point(-22,60), null, null) === s);
  test.assert(test.diagram.findObjectAt(new go.Point(61,60), null, null) === null);
  test.assert(test.diagram.findObjectAt(new go.Point(60,62), null, null) === null);
  test.assert(test.diagram.findObjectAt(new go.Point(60,59), null, null) === null);

  var w = np4.actualBounds.width;

  test.assert((w | 0) === 86);
  test.assert(test.diagram.findObjectAt(new go.Point(60-w,60-(w/2)), null, null) === null);
  test.assert(test.diagram.findObjectAt(new go.Point(61-w+1,61-(w/2)+1), null, null) === s2);
  test.assert(test.diagram.findObjectAt(new go.Point(60-w+19,60-(w/2)+19), null, null) === s2);

  test.assert(test.diagram.findObjectAt(new go.Point(0, 25), null, null) === null);
  test.assert(test.diagram.findObjectAt(new go.Point(25, 0), null, null) === null);


    }
  ));

  var fobjects4 = new TestCollection("Hit tests");
  colls.add(fobjects4);

  fobjects4.add(new Test("Pixel Hit Test", null,
    function(test) { // setup
      var d = test.diagram;
      d.clear();
      d.startTransaction('stuff');
      d.padding  = 0;

      var s = new go.Shape();
      s.figure = 'triangle';
      s.desiredSize = new go.Size(60,60);
      s.fill = 'yellow';
      s.stroke = null;
      s.strokeWidth = 0;
      // do NOT set the background

      var n = new go.Node();
      n.add(s);
      n.position = new go.Point(100, 100);
      d.add(n);

      test.s = s;  // remember the Shape, so the test can set its figure
      d.commitTransaction('stuff');
      d.position = new go.Point(0,0);
    },
    function(test) { // execute
    },
    function(test) { // test

      if (!TestCollection.RunSlowTests) {
        test.log("***!!!???@@@ skipping Pixel Hit Test of all figures");
        return;
      }

      var d = test.diagram;

      function paintResults(missList, hitList) {
        var ctx = test.diagram._ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'red';
        p = missList;
        for (var i = 0; i < p.length; i++) {
          var coord = p[i];
          ctx.fillRect(coord[0], coord[1], 1, 1);
        }
        ctx.fillStyle = 'blue';
        p = hitList;
        for (var i = 0; i < p.length; i++) {
          var coord = p[i];
          ctx.fillRect(coord[0], coord[1], 1, 1);
        }
        ctx.fillStyle = 'yellow';
      }

      var badList = "";
      for (var it = go.Shape.getFigureGenerators().iterator; it.next();) {
        var k = it.key;
        //if (k !== "Diamond") continue;

        //change the shape of the figure for each iteration
        d.startTransaction('shape');
        var shape = test.s;
        shape.figure = k;
        d.commitTransaction('shape');

        var missList = [];
        var hitList = [];
        var ctx = test.diagram._ctx;

        var px = shape.part.position.x;
        var py = shape.part.position.y;
        var x = 0;
        var y = 0;
        var w = 60;
        var h = 60;
        var imData = ctx.getImageData(x + px, y + py, w, h).data;
        for (var i = 0; i < imData.length; i += 4) {
          var alpha = imData[i + 3];
          if (alpha === 255 && test.diagram.findObjectAt(new go.Point(x + px, y + py)) === null)  {
            missList.push([x + px, y + py]);
          } else if (alpha === 0 && test.diagram.findObjectAt(new go.Point(x + px, y + py)) !== null) {
            hitList.push([x + px, y + py]);
          }
          x++;
          if (x >= w) {
            x = 0;
            y++;
          }
        }

        if (missList.length > 0 /* || hitList.length > 0 */) {
          badList += "  " + k + " " + missList.length + " " + hitList.length + "\n";
          paintResults(missList, hitList);
          alert(k + " " + missList.length + "  " + hitList.length);
        }
      }
      test.assert(badList === "", "hit test errors for " + badList);
    }
  ));

  fobjects4.add(new Test("degenerate geometries with stroke", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      // zero-area rectangles
      diagram.add(
        $(go.Part, { position: new go.Point(0, 0) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Rectangle, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 0) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Rectangle, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 0) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Rectangle) })
        ));
      // zero-area ellipses
      diagram.add(
        $(go.Part, { position: new go.Point(0, 200) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Ellipse, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 200) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Ellipse, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 200) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Ellipse) })
        ));
      // zero-area lines
      diagram.add(
        $(go.Part, { position: new go.Point(0, 400) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Line, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 400) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Line, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 400) },
          $(go.Shape,
            { fill: "red", geometry: $(go.Geometry, go.Geometry.Line) })
        ));
      // zero-area quadratic curves
      diagram.add(
        $(go.Part, { position: new go.Point(0, 600) },
          $(go.Shape,  // straight line Quadratic Bezier
            {
              fill: "red",
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, 100, 100, 50, 50).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 600) },
          $(go.Shape,  // straight line Bezier
            {
              fill: "red",
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.Bezier, 100, 100, 25, 25, 75, 75).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 600) },
          $(go.Shape,  // zero sweep Arc
            {
              fill: "red",
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.Line, 100, 100))
                .add(new go.PathSegment(go.PathSegment.Arc, 45, 0, 0, 0, 100, 100).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(600, 600) },
          $(go.Shape,  // zero radius SvgArc
            {
              fill: "red",
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.SvgArc, 100, 100, 50, 0, 45, true, true).close()))
            })
        ));
    },
    function(test) {
      var diagram = test.diagram;
      diagram.parts.each(function(part) {
        var pt = part.elt(0).getDocumentPoint(go.Spot.Center);
        var shape = diagram.findObjectAt(pt);
        test.assert(shape !== null, "didn't hit " + part.elt(0).geometry.toString() + " pt: " + pt.toString() + " position: " + part.position.toString());
        if (shape) {
          var b = shape.measuredBounds;
          test.assert((b.width === 101 || b.width === 1) && (b.height === 101 || b.height === 1), "bad size for " + part.elt(0).geometry.toString() + " measured: " + b.toString());
        }
      })
    }
  ));

  fobjects4.add(new Test("degenerate geometries no stroke", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      // zero-area rectangles
      diagram.add(
        $(go.Part, { position: new go.Point(0, 0) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Rectangle, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 0) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Rectangle, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 0) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Rectangle) })
        ));
      // zero-area ellipses
      diagram.add(
        $(go.Part, { position: new go.Point(0, 200) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Ellipse, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 200) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Ellipse, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 200) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Ellipse) })
        ));
      // zero-area lines
      diagram.add(
        $(go.Part, { position: new go.Point(0, 400) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Line, { endX: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 400) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Line, { endY: 100 }) })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 400) },
          $(go.Shape,
            { fill: "red", strokeWidth: 0, geometry: $(go.Geometry, go.Geometry.Line) })
        ));
      // zero-area quadratic curves
      diagram.add(
        $(go.Part, { position: new go.Point(0, 600) },
          $(go.Shape,  // straight line Quadratic Bezier
            {
              fill: "red", strokeWidth: 0,
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.QuadraticBezier, 100, 100, 50, 50).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(200, 600) },
          $(go.Shape,  // straight line Bezier
            {
              fill: "red", strokeWidth: 0,
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.Bezier, 100, 100, 25, 25, 75, 75).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(400, 600) },
          $(go.Shape,  // zero sweep Arc
            {
              fill: "red", strokeWidth: 0,
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.Line, 100, 100))
                .add(new go.PathSegment(go.PathSegment.Arc, 45, 0, 0, 0, 100, 100).close()))
            })
        ));
      diagram.add(
        $(go.Part, { position: new go.Point(600, 600) },
          $(go.Shape,  // zero radius SvgArc
            {
              fill: "red", strokeWidth: 0,
              geometry: new go.Geometry().add(new go.PathFigure()
                .add(new go.PathSegment(go.PathSegment.SvgArc, 100, 100, 50, 0, 45, true, true).close()))
            })
        ));
    },
    function(test) {
      var diagram = test.diagram;
      diagram.parts.each(function(part) {
        var pt = part.elt(0).getDocumentPoint(go.Spot.Center);
        var shape = diagram.findObjectAt(pt);
        test.assert(shape !== null, "didn't hit " + part.elt(0).geometry.toString() + " pt: " + pt.toString() + " position: " + part.position.toString());
        if (shape) {
          var b = shape.measuredBounds;
          test.assert((b.width === 100 || b.width === 0) && (b.height === 100 || b.height === 0), "bad size for " + part.elt(0).geometry.toString() + " measured: " + b.toString());
        }
      })
    }
  ));


  var findobjectsin = new TestCollection("findObjectsIn Complete");
  colls.add(findobjectsin);

  function SetupFindObjects(test) {
    var $ = go.GraphObject.make;
    test.diagram.clear();
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.add(
      $(go.Node,
        { background: "lightgray", position: new go.Point(0, 0) },
        $(go.Panel,
          { background: "yellow", position: new go.Point(100, 50) },
          $(go.Shape,
            { fill: "rgba(200, 0, 0, 0.5)", position: new go.Point(100, 100), width: 100, height: 100 }),
          $(go.Shape,
            { fill: "rgba(0, 200, 0, 0.5)", position: new go.Point(150, 150), width: 100, height: 100 })),
        $(go.Panel,
          { background: "rgba(0, 0, 200, 0.5)", position: new go.Point(50, 100) },
          $(go.Shape,
            { fill: "rgba(200, 100, 0, 0.5)", position: new go.Point(100, 100), width: 100, height: 100 }),
          $(go.Shape,
            { fill: "rgba(200, 0, 200, 0.5)", position: new go.Point(150, 150), width: 100, height: 100 }))
         /* , $(go.Shape, { fill: null, position: new go.Point(210, 310), width: 10, height: 10 }) */
        ));
  }

  findobjectsin.add(new Test("everything", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, -10, 999, 999));
      test.assert(coll.count === 7, "should have found all objects, not: " + coll.count);
    },
    null));

  findobjectsin.add(new Test("all but Node", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 10, 999, 999));
      test.assert(coll.count === 6, "should have found all objects except Node, not: " + coll.count);
    },
    null));

  findobjectsin.add(new Test("all but Node & yellow panel", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 60, 999, 999));
      test.assert(coll.count === 5, "should have found all objects except Node & yellow panel, not: " + coll.count);
    },
    null));

  findobjectsin.add(new Test("all but Node & yellow & blue panels", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 110, 999, 999));
      test.assert(coll.count === 4, "should have found all objects except Node/yellow/blue, not: " + coll.count);
      var it = coll.iterator;
      while (it.next()) test.assert(it.value.actualBounds.height < 150, "found a big object? " + it.value);
    },
    null));

  findobjectsin.add(new Test("just orange/magenta/green", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, 160, 999, 999));
      test.assert(coll.count === 3, "should have found only orange/magenta/green, not: " + coll.count);
    },
    null));

  findobjectsin.add(new Test("just orange", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 160, 310, 160));
      test.assert(coll.count === 1, "should have found only orange, not: " + coll.count);
    },
    null));

  findobjectsin.add(new Test("nothing", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 210, 999, 40));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  var findobjectsinpartial = new TestCollection("findObjectsIn Partial");
  colls.add(findobjectsinpartial);

  findobjectsinpartial.add(new Test("everything partial", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(210, 210, 80, 80), null, null, true);
      test.assert(coll.count === 7, "should have found all objects, not: " + coll.count);
    },
    null));

  findobjectsinpartial.add(new Test("panels, partial", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(10, 10, 120, 120), null, null, true);
      test.assert(coll.count === 3, "should have found three top panels, not: " + coll.count);
    },
    null));

  findobjectsinpartial.add(new Test("green & above, partial", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(310, 290, 10, 10), null, null, true);
      test.assert(coll.count === 3, "should have found green and its two containing panels, not: " + coll.count);
    },
    null));

  findobjectsinpartial.add(new Test("rotated hourglass shape partial", null, function(test){
    var $ = go.GraphObject.make;
    test.diagram.clear();
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.add(
      $(go.Node,
        { name: 'node', background: "lightgray", position: new go.Point(0, 0) },
        $(go.Panel,
          { name: 'yellowpanel',  background: "yellow", position: new go.Point(100, 50), angle: 25 },
          $(go.Shape,
            { name: 'hourglass', fill: "rgba(200, 0, 0, 0.5)", position: new go.Point(100, 100), width: 100, height: 100, angle: 25, figure: "Hourglass" }))
          //, $(go.Shape, { fill: null, position: new go.Point(210, 310), width: 10, height: 10 }) // panel and node
          //, $(go.Shape, { fill: null, position: new go.Point(292, 292), width: 10, height: 10 }) // hourglass elbow but not touching
          //, $(go.Shape, { fill: null, position: new go.Point(260, 250), width: 20, height: 20 }) // hourglass eblow partial touch
          //, $(go.Shape, { fill: null, position: new go.Point(200, 195), width: 200, height: 200 }) // all of them, completely encompass hourglass
        ));
   }, function(test) {

      function collHasName(coll, name) {
        var itr = coll.iterator;
        while (itr.next()) {
          //test.assert(itr.value.name)
          if (itr.value.name === name) return true;
        }
        return false;
      }

      var coll = test.diagram.findObjectsIn(new go.Rect(210, 310, 10, 10), null, null, true);
      test.assert(coll.count === 2, "should have found 2 objects, not: " + coll.count);
      test.assert(collHasName(coll, 'node'))
      test.assert(collHasName(coll, 'yellowpanel'))

      coll = test.diagram.findObjectsIn(new go.Rect(292, 292, 10, 10), null, null, true);
      test.assert(coll.count === 2, "should have found 2 objects, not: " + coll.count);
      test.assert(collHasName(coll, 'node'))
      test.assert(collHasName(coll, 'yellowpanel'))
      coll = test.diagram.findObjectsIn(new go.Rect(260, 250, 20, 20), null, null, true);
      test.assert(coll.count === 3, "should have found 3 objects, not: " + coll.count);
      test.assert(collHasName(coll, 'node'))
      test.assert(collHasName(coll, 'yellowpanel'))
      test.assert(collHasName(coll, 'hourglass'))

      var coll = test.diagram.findObjectsIn(new go.Rect(200, 195, 200, 200), null, null, true);
      test.assert(coll.count === 3, "should have found 3 objects, not: " + coll.count);
      test.assert(collHasName(coll, 'node'))
      test.assert(collHasName(coll, 'yellowpanel'))
      test.assert(collHasName(coll, 'hourglass'))
    }, null));

  var findobjectsinfringe = new TestCollection("findObjectsIn Fringe Cases");
  colls.add(findobjectsinfringe);

  var findobjectsinfringecomp = new TestCollection("Complete");
  findobjectsinfringe.add(findobjectsinfringecomp);

  findobjectsinfringecomp.add(new Test("0x0 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(225, 225, 0, 0));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("0x999 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(225, -10, 0, 999));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("999x0 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, 225, 999, 0));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("0x0 node", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, -10, 999, 999));
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("0x0 node, 0x0 search", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(0, 0, 0, 0));
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("100x0 node, 0x0 search", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(100, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(50, 0, 0, 0));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsinfringecomp.add(new Test("weird geometry", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0) },
          $(go.Shape,
            { geometryString: "M0 0 Q0 0 50 50 Q90 70 100 60 L110 60 L110 37 L155 42 L220 142" }
          )
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(110, 60, 1, 1));
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  var findobjectsinfringepart = new TestCollection("Partial");
  findobjectsinfringe.add(findobjectsinfringepart);

  findobjectsinfringepart.add(new Test("0x0 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(225, 225, 0, 0), null, null, true);
      test.assert(coll.count === 5, "should have found 5 objects, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("0x999 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(225, -10, 0, 999), null, null, true);
      test.assert(coll.count === 6, "should have found 6 objects, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("999x0 search", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, 225, 999, 0), null, null, true);
      test.assert(coll.count === 6, "should have found 6 objects, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("0x0 node", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(-10, -10, 999, 999), null, null, true);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("0x0 node, 0x0 search", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(0, 0, 0, 0), null, null, true);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("100x0 node, 0x0 search", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(100, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(50, 0, 0, 0), null, null, true);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsinfringepart.add(new Test("weird geometry", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0) },
          $(go.Shape,
            { geometryString: "M0 0 Q0 0 50 50 Q90 70 100 60 L110 60 L110 37 L155 42 L220 142" }
          )
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsIn(new go.Rect(110, 60, 1, 1), null, null, true);
      test.assert(coll.count === 2, "should have found both, not: " + coll.count);
    },
    null));

    findobjectsinfringepart.add(new Test("jump link", null,
      function(test) {
        var $ = go.GraphObject.make;
        var diagram = test.diagram;
        diagram.clear();

        diagram.contentAlignment = go.Spot.Center;

        diagram.nodeTemplate =
          $(go.Node,
            new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape, { strokeWidth: 0, desiredSize: new go.Size(30, 30) })
          );

        diagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.AvoidsNodes,  // may be either Orthogonal or AvoidsNodes
              curve: go.Link.JumpGap },
            $(go.Shape, { stroke: "green" })
          );

        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, loc: "0 50" },
            { key: 2, loc: "100 50" },
            { key: 3, loc: "50 0" },
            { key: 4, loc: "50 100" }
          ],
          [
            { from: 1, to: 2 },
            { from: 3, to: 4 }
          ]
        );
      },
      function(test) {
        var coll = test.diagram.findObjectsIn(new go.Rect(65, 115, 1, 1), null, null, true);
        test.assert(coll.count === 2, "should have found just one link/shape pair, not: " + coll.count);
      },
      null));

  var findobjectsat = new TestCollection("findObjectsAt");
  colls.add(findobjectsat);

  findobjectsat.add(new Test("overlapping Shapes diff Panels", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 210));
      test.assert(coll.count === 5, "should have found orange & above & red & above, not: " + coll.count);
    },
    null));

  findobjectsat.add(new Test("overlapping Shapes same Panel", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 260));
      test.assert(coll.count === 5, "should have found orange & magenta & above & yellow, not: " + coll.count);
    },
    null));

  findobjectsat.add(new Test("magenta and above", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 310));
      test.assert(coll.count === 3, "should have found magenta & above, not: " + coll.count);
    },
    null));


  function returnPanel(x) {
    if (!(x instanceof go.Panel)) x = x.panel;
    return x;
  }

  findobjectsat.add(new Test("multiple, diff Panels, navig Panel", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 210), returnPanel);
      test.assert(coll instanceof go.Set, "findObjectsAt result should be a Set, not: " + coll);
      test.assert(coll.count === 3, "should have found orange & above & red & above, not: " + coll.count);
    },
    null));

  findobjectsat.add(new Test("multiple, same Panel, navig Panel", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 260), returnPanel);
      test.assert(coll.count === 3, "should have found orange & magenta & above & yellow, not: " + coll.count);
    },
    null));

  findobjectsat.add(new Test("magenta, navig Panel", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(210, 310), returnPanel);
      test.assert(coll.count === 2, "should have found magenta & above, not: " + coll.count);
    },
    null));

  // Test that a Link with two isPanelMain elements is correctly updating the actualBounds of both of them.
  findobjectsat.add(new Test("multiple main elements", null,
    function SetupFindObjects(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      var diagram = test.diagram;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding('position'),
          { locationSpot: go.Spot.Center },
          $(go.Shape, "RoundedRectangle",
            {
              fill: "white", portId: "", cursor: "pointer",
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
            }, new go.Binding("fill", "color")),
          $(go.TextBlock, {
            font: "bold 14px sans-serif", stroke: '#333', margin: 6,
            isMultiline: false, editable: true
          }, new go.Binding("text", "text").makeTwoWay()));


      diagram.linkTemplate =
        $(go.Link, $(go.Shape, { strokeWidth: 1.5, isPanelMain: true }),
          $(go.Shape, {
            isPanelMain: true, stroke: 'rgba(255,0,0,0.1)', strokeWidth: 150
          }));

      var nodeDataArray = [
        { key: 1, text: "Alpha", position: new go.Point(0, 0), color: "lightblue" },
        { key: 2, text: "Beta", position: new go.Point(40, 0), color: "orange" }
      ];
      var linkDataArray = [
        { from: 1, to: 2 },
      ];
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }, function (test) {
      test.diagram.startTransaction();
      test.diagram.commitTransaction();

      test.diagram.startTransaction();
      test.diagram.findNodeForKey(2).position = new go.Point(400, 0);
      test.diagram.commitTransaction();

      test.assert(test.diagram.findPartAt(new go.Point(230, 65)) !== null);
    },
    null));

  function SetupFindObjects2(test) {
    var $ = go.GraphObject.make;
    test.diagram.clear();
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.add(
      $(go.Node, "Horizontal",
        { position: new go.Point(0, 0) },
        $(go.Shape,
          { fill: "rgba(200, 0, 0, 0.5)", width: 10, height: 10 }),
        $(go.Shape,
          { fill: "rgba(0, 200, 0, 0.5)", width: 100, height: 100 }),
        $(go.Panel,
          $(go.Shape,
            { fill: "rgba(0, 0, 200, 0.5)", width: 10, height: 10 }))
        ));
    test.diagram.add(
      $(go.Node, "Horizontal",
        { position: new go.Point(110, 0) },
        $(go.Shape,
          { fill: "rgba(200, 0, 0, 0.5)", width: 10, height: 10 }),
        $(go.Shape,
          { fill: "rgba(0, 200, 0, 0.5)", width: 100, height: 100 }),
        $(go.Shape,
          { fill: "rgba(0, 0, 200, 0.5)", width: 10, height: 10 })
        ));
  }

  var findobjectsat2 = new TestCollection("findObjectsAt2");
  colls.add(findobjectsat2);

  findobjectsat2.add(new Test("two ports", null, SetupFindObjects2,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(115, 50));
      test.assert(coll.count === 2, "should have found two ports, not: " + coll.count);
      var it = coll.iterator;
      while (it.next()) test.assert(it.value instanceof go.Shape, "expected port, not: " + it.value);
    },
    null));

  findobjectsat2.add(new Test("two nodes", null, SetupFindObjects2,
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(115, 50), function(x) { return x.part; });
      test.assert(coll.count === 2, "should have found two nodes, not: " + coll.count);
      var it = coll.iterator;
      while (it.next()) test.assert(it.value instanceof go.Node, "expected Node, not: " + it.value);
    },
    null));

  findobjectsat2.add(new Test("two nodes findPartAt", null, SetupFindObjects2,
    function(test) {
      var node = test.diagram.findPartAt(new go.Point(115, 50));
      test.assert(node !== null && node !== test.diagram.nodes.first(), "should have found one node, the second one");
    },
    null));

  findobjectsat2.add(new Test("node2 in unpickable Layer", null, SetupFindObjects2,
    function(test) {
      var node2 = test.diagram.findPartAt(new go.Point(115, 50));
      node2.layerName = "Foreground";
      var lay = test.diagram.findLayer("Foreground");
      lay.pickable = false;
    },
    function(test) {
      var node = test.diagram.findPartAt(new go.Point(115, 50));
      test.assert(node !== null && node === test.diagram.nodes.first(), "should have found one node, the first one");
      var lay = test.diagram.findLayer("Foreground");
      lay.pickable = true;
    }));

  findobjectsat2.add(new Test("node not pickable", null, SetupFindObjects2,
    function(test) {
      var node2 = test.diagram.findPartAt(new go.Point(115, 50));
      node2.pickable = false;
    },
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(115, 50));
      test.assert(coll.count === 1, "should have found only one port, not: " + coll.count);
      var it = coll.iterator;
      while (it.next()) test.assert(it.value instanceof go.Shape, "expected port, not: " + it.value);
    }));

  findobjectsat2.add(new Test("port not pickable", null, SetupFindObjects2,
    function(test) {
      var port2 = test.diagram.findObjectAt(new go.Point(115, 50));
      port2.pickable = false;  // Node remains pickable, but not the Shape
    },
    function(test) {
      var coll = test.diagram.findObjectsAt(new go.Point(115, 50));
      test.assert(coll.count === 1, "should have found only one port, not: " + coll.count);
      var it = coll.iterator;
      while (it.next()) test.assert(it.value instanceof go.Shape, "expected port, not: " + it.value);
    }));

findobjectsat2.add(new Test('Multi-figure', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
 var $ = go.GraphObject.make;
      // replace standard node template:
      d.nodeTemplate =
        $(go.Node,
          $(go.Shape,
            { name: "SHAPE",
              fill: 'lightcoral', strokeWidth: 2 },
            new go.Binding('figure', 'fig'),
            new go.Binding('geometry', 'geom')
            ),
        new go.Binding('position', 'pos')
        );


      var m = new go.GraphLinksModel();

      m.nodeDataArray = [
        { key: 1, pos: new go.Point(0, 0), fig: 'YinYang' },
        { key: 2, pos: new go.Point(100, 0), fig: 'NotAllowed' },
        { key: 3, pos: new go.Point(200, 0), geom: go.Geometry.parse("M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30", true) },
      ];

      m.linkDataArray = [
      ];
      d.model = m;

    }, // END SETUP
    function (test) {

var d = test.diagram;
d.maybeUpdate();

var s = d.findNodeForKey(1).findObject('SHAPE')

//test.assert(d.findObjectAt(new go.Point(52,27)) === null)
test.assert(d.findObjectAt(new go.Point(67,43)) === s)
/* @@@@@@@@@@@
test.assert(d.findObjectAt(new go.Point(32,58)) === null)
test.assert(d.findObjectAt(new go.Point(50,75)) === s)

var s2 = d.findNodeForKey(2).findObject('SHAPE')
test.assert(d.findObjectAt(new go.Point(115,07)) === null);
test.assert(d.findObjectAt(new go.Point(124,13)) === s2);
test.assert(d.findObjectAt(new go.Point(132,31)) === null);
test.assert(d.findObjectAt(new go.Point(151,49)) === s2);
test.assert(d.findObjectAt(new go.Point(164,66)) === null);
test.assert(d.findObjectAt(new go.Point(181,81)) === s2);
test.assert(d.findObjectAt(new go.Point(189,90)) === null);


test.assert(d.findObjectAt(new go.Point(208.64374411710435,0.5557474829507036)) === null);
test.assert(d.findObjectAt(new go.Point(230.36166609591163,0.5557474829507036)) === null);
test.assert(d.findObjectAt(new go.Point(210.66401592908642,19.74832969678041)) === null);
test.assert(d.findObjectAt(new go.Point(229.8565981429161,20.253397649775927)) === null);
test.assert(d.findObjectAt(new go.Point(223.7957827069699,27.829416944708704)) === null);
test.assert(d.findObjectAt(new go.Point(216.72483136503263,27.324348991713187)) === null);

var s3 = d.findNodeForKey(3).findObject('SHAPE')
test.assert(d.findObjectAt(new go.Point(203.59306458714917,6.616562918896927)) === s3);
test.assert(d.findObjectAt(new go.Point(204.6032004931402,14.192582213829706)) === s3);
test.assert(d.findObjectAt(new go.Point(235.91741357886235,6.616562918896927)) === s3);
test.assert(d.findObjectAt(new go.Point(235.91741357886235,14.192582213829706)) === s3);
test.assert(d.findObjectAt(new go.Point(220.7653749889968,18.233125837793853)) === s3);
test.assert(d.findObjectAt(new go.Point(223.7957827069699,30.3547567096863)) === s3);
*/
    }, // END TEST
    null
));


findobjectsat2.add(new Test('Links negative toShortLength', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    var $ = go.GraphObject.make;
    diagram.nodeTemplate =
      $(go.Node, "Auto",  // the Shape will go around the TextBlock
        new go.Binding('location'),
        $(go.Shape, "RoundedRectangle",
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 3, height: 15, width: 50 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        {
          toShortLength: -130,
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver
         },
        $(go.Shape),
        $(go.Shape, { 'toArrow': 'standard' })

        )

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", location: new go.Point(0, 0), color: "lightblue" },
      { key: "Beta",  location: new go.Point(100, 0), color: "orange" },
      { key: "Gamma", location: new go.Point(70, -90), color: "lightgreen" },
      { key: "Delta", location: new go.Point(50, 80), color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Gamma", to: "Delta" }
    ]);

    }, // END SETUP
    function (test) {

var d = test.diagram;
    test.assert(d.findObjectAt(new go.Point(224, 12)) !== null);
    test.assert(d.findObjectAt(new go.Point(81, 142)) !== null);
    }, // END TEST
    null
));

// regression test for new behavior 1.6.7 and up
findobjectsat2.add(new Test('Links new bounds 1.6.7', null,
    function (test) {
      var diagram = test.diagram;

        var $ = go.GraphObject.make;  // for conciseness in defining templates

        function makePort(name, spot, output, input) {
            return $(go.Shape, "Circle",
                {
                    fill: "transparent",
                    stroke: null,
                    desiredSize: new go.Size(8, 8),
                    alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                    portId: name,  // declare this object to be a "port"
                    fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                    fromLinkable: output, toLinkable: input
                });
        }


        diagram.nodeTemplateMap.add("",  // the default category
            $(go.Node, "Spot",
                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Shape, "RoundedRectangle",
                    {fill: "#00A9C9", stroke: "white"},
                        new go.Binding("figure", "figure")),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, false, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false)
            ));

        diagram.linkTemplate =
            $(go.Link,
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.Bezier,
                    corner: 5, toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    resegmentable: true
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape, {isPanelMain: true, strokeWidth: 8, stroke: "orange", name: "HIGHLIGHT"})
            );

        diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    var data = { "class": "go.GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "nodeDataArray": [
{"text":"Eval", "figure":"RoundedRectangle", "type":"Flow.Eval", "key":-3, "loc":"0 0", "Expression":"locals.i > 10", "name":"Done?"},
{"text":"Script", "figure":"RoundedRectangle", "type":"Flow.Script", "key":-5, "loc":"-3 184", "Script":"locals.i = locals.i + 1;\nconsole.log(\"i=\" + locals.i);", "name":"Increment value"}
 ],
  "linkDataArray": [ {"from":-5, "to":-3, "fromPort":"L", "toPort":"L", "points":[-3,234.5,-13,234.5,-13,50.5,-11.5,50.5,-10,50.5,0,50.5]} ]}
      diagram.model = go.Model.fromJson(data);
      window.link = diagram.links.first();
      window.shape = link.elt(0);
      window.ab = link.actualBounds;

    }, // END SETUP
    function (test) {

    var d = test.diagram;
    test.assert(d.findObjectAt(new go.Point(-38, 137)) !== null);
    }, // END TEST
    null
));

//
findobjectsat2.add(new Test('Shape background', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      const icon = 'M32 18.451l-16-12.42-16 12.42v-5.064l16-12.42 16 12.42zM28 18v12h-8v-8h-8v8h-8v-12l12-9z';
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { background: "cyan" },
          $(go.Shape,
            {
              width: 14, height: 14,
              background: 'magenta', fill: 'black', strokeWidth: 0,
              geometry: go.Geometry.parse(icon, true),
              cursor: 'pointer'
            })
        );
      diagram.model = new go.GraphLinksModel( [ { key: 1 } ], [ ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(diagram.findObjectAt(new go.Point(1, 1)) instanceof go.Shape, "should find the Shape")
    }, // END TEST
    null
));


/* ************************************************ */

var tc = new TestCollection("near");
colls.add(tc);

tc.add(new Test("rectangles navig", null,
  function(test) {
    var $ = go.GraphObject.make;
    var d = test.diagram;
    d.reset();
    d.add($(go.Part,
            { position: new go.Point(0, 0) },
            $(go.Shape, "Rectangle",
              { width: 1000, height: 10, fill: "lightgreen", stroke: null, strokeWidth: 0 })));
  },
  function(test) {
    var d = test.diagram;
    var found = d.findObjectsNear(new go.Point(5, 5), 10, function(o) { if (o instanceof go.Shape) return o; else return null; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,5");
    found = d.findObjectsNear(new go.Point(5, -5), 10, function(o) { if (o instanceof go.Shape) return o; else return null; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,-5");
    found = d.findObjectsNear(new go.Point(-6, 0), 10, function(o) { if (o instanceof go.Shape) return o; else return null; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near -6,0");
    found = d.findObjectsNear(new go.Point(0, -11), 10, function(o) { if (o instanceof go.Shape) return o; else return null; });
    test.assert(found.count === 0, "a Shape near 0,-11");
    found = d.findObjectsNear(new go.Point(-11, 0), 10, function(o) { if (o instanceof go.Shape) return o; else return null; });
    test.assert(found.count === 0, "a Shape near -11,0");
  },
  function(test) {
  }));

  tc.add(new Test("rectangles pred", null,
  function(test) {
    var $ = go.GraphObject.make;
    var d = test.diagram;
    d.reset();
    d.add($(go.Part,
            { position: new go.Point(0, 0) },
            $(go.Shape, "Rectangle",
              { width: 1000, height: 10, fill: "lightgreen", stroke: null, strokeWidth: 0 })));
  },
  function(test) {
    var d = test.diagram;
    var found = d.findObjectsNear(new go.Point(5, 5), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,5");
    found = d.findObjectsNear(new go.Point(5, -5), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,-5");
    found = d.findObjectsNear(new go.Point(-6, 0), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near -6,0");
    found = d.findObjectsNear(new go.Point(0, -11), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 0, "a Shape near 0,-11");
    found = d.findObjectsNear(new go.Point(-11, 0), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 0, "a Shape near -11,0");
  },
  function(test) {
  }));

tc.add(new Test("ellipses pred", null,
  function(test) {
    var $ = go.GraphObject.make;
    var d = test.diagram;
    d.reset();
    d.add($(go.Part,
            { position: new go.Point(0, 0) },
            $(go.Shape, "Ellipse",
              { width: 1000, height: 10, fill: "lightgreen", stroke: null, strokeWidth: 0 })));
  },
  function(test) {
    var d = test.diagram;
    var found = d.findObjectsNear(new go.Point(5, 5), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,5");
    found = d.findObjectsNear(new go.Point(5, -5), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near 5,-5");
    found = d.findObjectsNear(new go.Point(-6, 0), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 1 && found.first() instanceof go.Shape, "no Shape near -6,0");
    found = d.findObjectsNear(new go.Point(0, -9.5), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 0, "a Shape near 0,-9.5");
    found = d.findObjectsNear(new go.Point(-9.5, 0), 10, null, function(o) { return o instanceof go.Shape; });
    test.assert(found.count === 0, "a Shape near -9.5,0");
  },
  function(test) {
  }));




tc.add(new Test("lots of find near", null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
  d.nodeTemplate =
    $(go.Node, "Vertical",
      {name: 'node'},
      new go.Binding('position', 'position'),
      $(go.Shape, {width: 50, height: 50, figure: 'Rectangle', name: 'blue', fill: 'blue'},
        new go.Binding('figure', 'figure')),
      $(go.Shape, {width: 50, height: 50, figure: 'Rectangle', name: 'red', fill: 'red'},
        new go.Binding('figure', 'figure'))

    );

  var m = new go.Model();
  var nodes = [];
  //for (var i = 0; i < 1; i++) {
  nodes.push({ figure: 'Rectangle', position: new go.Point(0,0) });
  nodes.push({ figure: 'Rectangle', position: new go.Point(100,0) });
  nodes.push({ figure: 'Rectangle', position: new go.Point(200,0) });
  nodes.push({ figure: 'Rectangle', position: new go.Point(300,0) });

  nodes.push({ figure: 'Ellipse', position: new go.Point(000,200) });
  nodes.push({ figure: 'Ellipse', position: new go.Point(100,200) });
  nodes.push({ figure: 'Ellipse', position: new go.Point(200,200) });
  nodes.push({ figure: 'Ellipse', position: new go.Point(300,200) });

  nodes.push({ figure: 'Triangle', position: new go.Point(000+410,0) });
  nodes.push({ figure: 'Triangle', position: new go.Point(100+410,0) });
  nodes.push({ figure: 'Triangle', position: new go.Point(200+410,0) });
  nodes.push({ figure: 'Triangle', position: new go.Point(300+410,0) });


  nodes.push({ figure: 'PiePiece', position: new go.Point(000+410,200) });
  nodes.push({ figure: 'PiePiece', position: new go.Point(100+410,200) });
  nodes.push({ figure: 'PiePiece', position: new go.Point(200+410,200) });
  nodes.push({ figure: 'PiePiece', position: new go.Point(300+410,200) });
  //}

  m.nodeDataArray = nodes;

  d.model = m;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

  d.startTransaction('a');
  d.commitTransaction('a');

  function findObjects(x, y, r, partial) {
    var set = d.findObjectsNear(new go.Point(x, y), r, null, null, partial);
    var itr = set.iterator;
    var f = '';
    while (itr.next()) {
      f += itr.value.name + ' ';
    }
    return f.trim();
  }

  // d._ctx.translate(5,5); // Because of padding

var responses = [];
responses.push('complete:');
responses.push('partial:red blue node');
responses.push('complete:');
responses.push('partial:red node');
responses.push('complete:red');
responses.push('partial:red blue node');
responses.push('complete:red blue node');
responses.push('partial:red blue node');

var arr = [];

  var x = 25;
  var y = 60;
  var r = 44;
  arr.push('complete:' + findObjects(x, y, r, false));
  arr.push('partial:' + findObjects(x, y, r, true));
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2);
  // d._ctx.fill();

  var x = 125;
  var y = 70;
  var r = 11;
  arr.push('complete:' + findObjects(x, y, r, false));
  arr.push('partial:' + findObjects(x, y, r, true));
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2);
  // d._ctx.fill();

  var x = 225;
  var y = 70;
  var r = 61;
  arr.push('complete:' + findObjects(x, y, r, false));
  arr.push('partial:' + findObjects(x, y, r, true));
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2);
  // d._ctx.fill();

  var x = 335;
  var y = 60;
  var r = 71;
  arr.push('complete:' + findObjects(x, y, r, false));
  arr.push('partial:' + findObjects(x, y, r, true));
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2);
  // d._ctx.fill();

  var l = arr.length;
  for (var i = 0; i < l; i++) {
    test.assert(arr[i] === responses[i], 'rect ' + Math.floor(i / 2) + ' - ' + arr[i] + ' should be ' + responses[i]);
  }

// *************** NEXT ROW ************************

var responses = [];
responses.push('complete:red')
responses.push('partial:red blue node')
responses.push('complete:')
responses.push('partial:red node')
responses.push('complete:red')
responses.push('partial:red blue node')
responses.push('complete:red blue node')
responses.push('partial:red blue node')
var arr = [];

  var x = 25;
  var y = 260;
  var r = 44;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 125;
  var y = 270;
  var r = 11;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 225;
  var y = 270;
  var r = 61;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 335;
  var y = 260;
  var r = 71;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();



  var l = arr.length;
  for (var i = 0; i < l; i++) {
    test.assert(arr[i] === responses[i], 'circle ' + Math.floor(i / 2) + ' - ' + arr[i] + ' should be ' + responses[i]);
  }

// *************** NEXT COL ************************


var responses = []
responses.push('complete:')
responses.push('partial:red blue node')
responses.push('complete:')
responses.push('partial:red node')
responses.push('complete:red')
responses.push('partial:red blue node')
responses.push('complete:red blue node')
responses.push('partial:red blue node')
var arr = [];

  var x = 410+25;
  var y = 60;
  var r = 44;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 410+125;
  var y = 70;
  var r = 11;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 410+225;
  var y = 70;
  var r = 61;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var x = 410+335;
  var y = 60;
  var r = 71;
  arr.push('complete:' + findObjects(x, y, r, false))
  arr.push('partial:' + findObjects(x, y, r, true))
  // d._ctx.beginPath();
  // d._ctx.fillStyle = 'rgba(0,255,0,.5)';
  // d._ctx.arc(x, y, r, 0, Math.PI*2)
  // d._ctx.fill();

  var l = arr.length;
  for (var i = 0; i < l; i++) {
    test.assert(arr[i] === responses[i], 'triangle ' + Math.floor(i / 2) + ' - ' + arr[i] + ' should be ' + responses[i]);
  }

// *************** BOTTOM RIGHT ************************


var responses = []
responses.push('complete:blue')
responses.push('partial:red blue node')
responses.push('complete:')
responses.push('partial:red node')
responses.push('complete:red blue')
responses.push('partial:red blue node')
responses.push('complete:red blue node')
responses.push('partial:red blue node')
var arr = [];

var x = 410+25;
var y = 250;
var r = 44;
arr.push('complete:' + findObjects(x, y, r, false))
arr.push('partial:' + findObjects(x, y, r, true))
// d._ctx.beginPath();
// d._ctx.fillStyle = 'rgba(0,255,0,.5)';
// d._ctx.arc(x, y, r, 0, Math.PI*2)
// d._ctx.fill();

var x = 410+125;
var y = 270;
var r = 11;
arr.push('complete:' + findObjects(x, y, r, false))
arr.push('partial:' + findObjects(x, y, r, true))
// d._ctx.beginPath();
// d._ctx.fillStyle = 'rgba(0,255,0,.5)';
// d._ctx.arc(x, y, r, 0, Math.PI*2)
// d._ctx.fill();

var x = 410+225;
var y = 270;
var r = 61;
arr.push('complete:' + findObjects(x, y, r, false))
arr.push('partial:' + findObjects(x, y, r, true))
// d._ctx.beginPath();
// d._ctx.fillStyle = 'rgba(0,255,0,.5)';
// d._ctx.arc(x, y, r, 0, Math.PI*2)
// d._ctx.fill();

var x = 410+335;
var y = 260;
var r = 71;
arr.push('complete:' + findObjects(x, y, r, false))
arr.push('partial:' + findObjects(x, y, r, true))
// d._ctx.beginPath();
// d._ctx.fillStyle = 'rgba(0,255,0,.5)';
// d._ctx.arc(x, y, r, 0, Math.PI*2)
// d._ctx.fill();

var l = arr.length;
for (var i = 0; i < l; i++) {
  test.assert(arr[i] === responses[i], 'pie ' + Math.floor(i / 2) + ' - ' + arr[i] + ' should be ' + responses[i]);
}
    }, // END TEST
    null
));


  tc.add(new Test("in TableRows", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      function nodeStyle() {
        return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("isShadowed", "isSelected").ofObject(),
        {
          selectionAdorned: false,
          shadowOffset: new go.Point(0, 0),
          shadowBlur: 15,
          shadowColor: "blue",
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "lightyellow" }),
              $(go.TextBlock, { margin: 4 },
                new go.Binding("text", "", function(d) {
                  var msg = d.key + ": " + d.category;
                  if (d.text) msg += "\n" + d.text;
                  return msg;
                }))
            )
        }];
      }

      function shapeStyle() {
        return [
          {
            name: "NODESHAPE",
            fill: "lightgray",
            stroke: "darkslategray",
            desiredSize: new go.Size(40, 40),
            strokeWidth: 2
          },
          new go.Binding("fill").makeTwoWay()
        ];
      }

      function portStyle(input) {
        return {
          desiredSize: new go.Size(6, 6),
          fill: "black",
          fromSpot: go.Spot.Right,
          fromLinkable: !input,
          toSpot: go.Spot.Left,
          toLinkable: input,
          toMaxLinks: 1,
          cursor: "pointer",
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "lightyellow" }),
              $(go.TextBlock, { margin: 4 },
                new go.Binding("text", "adornedObject", function(obj) {
                  return obj.portId + " on " + obj.part.data.key;
                }).ofObject())
            )
        };
      }

      diagram.nodeTemplate =
        $(go.Node, "Spot", nodeStyle(),
          $(go.Panel, "Table",
            $(go.Shape, "AndGate", shapeStyle(), { margin: new go.Margin(0, 0, 0, 3) }),
            $(go.Panel, "Table",
              new go.Binding("itemArray", "inputPorts"),
              {
                margin: new go.Margin(4, 0),
                alignment: go.Spot.Left,
                stretch: go.GraphObject.Vertical,
                rowSizing: go.RowColumnDefinition.ProportionalExtra,
                itemTemplate:
                  $(go.Panel, "TableRow",
                    $(go.Shape, "Rectangle", portStyle(true), new go.Binding("portId"))
                  )
              }
            )
          ),
          $(go.Shape, "Rectangle", portStyle(false),
            { portId: "out", alignment: new go.Spot(1, 0.5) })
        );

      diagram.model = $(go.GraphLinksModel,
        {
          "linkFromPortIdProperty": "fromPort",
          "linkToPortIdProperty": "toPort",
          "copiesArrays": true,
          "copiesArrayObjects": true,
          "nodeDataArray": [
            { "key": "input1", "loc": "-150 -80" },
            { "key": "and1", "inputPorts": [{ "portId": "in1" }, { "portId": "in2" }], "loc": "-20 -120" }
          ]
        }
      );
    },
    function(test) {
      var diagram = test.diagram;
      var input1 = diagram.findNodeForKey("input1");
      var and1 = diagram.findNodeForKey("and1");
      test.assert(input1 && and1 &&
        diagram.toolManager.linkingTool.isValidLink(input1, input1.findPort("out"), and1, and1.findPort("in1")) &&
        diagram.toolManager.linkingTool.isValidLink(input1, input1.findPort("out"), and1, and1.findPort("in2")),
        "didn't create nodes with linkable ports");
      var tool = diagram.toolManager.linkingTool;
      var nearby = diagram.findObjectsNear(new go.Point(0, -100), 100, function(x) { return tool.findValidLinkablePort(x, true); }, null, true, new go.Set());
      test.assert(nearby.count == 2 && nearby.contains(and1.findPort("in1")) && nearby.contains(and1.findPort("in2")), "didn't find both 'in1' and 'in2' ports on 'and1'");
    }));


  var findobjectsnearfringe = new TestCollection("findObjectsNear Fringe Cases");
  colls.add(findobjectsnearfringe);

  var findobjectsnearfringecomp = new TestCollection("Complete");
  findobjectsnearfringe.add(findobjectsnearfringecomp);

  findobjectsnearfringecomp.add(new Test("0 distance", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(225, 225), 0, null, null, false);
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsnearfringecomp.add(new Test("0x0 node", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(0, 0), 999, null, null, false);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsnearfringecomp.add(new Test("0x0 node, 0 distance", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(0, 0), 0, null, null, false);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsnearfringecomp.add(new Test("100x0 node, 0 distance", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(100, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(50, 0), 0, null, null, false);
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  findobjectsnearfringecomp.add(new Test("weird geometry", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0) },
          $(go.Shape,
            { geometryString: "M0 0 Q0 0 50 50 Q90 70 100 60 L110 60 L110 37 L155 42 L220 142" }
          )
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(110, 60), 1, null, null, false);
      test.assert(coll.count === 0, "should have found nothing, not: " + coll.count);
    },
    null));

  var findobjectsnearfringepart = new TestCollection("Partial");
  findobjectsnearfringe.add(findobjectsnearfringepart);

  findobjectsnearfringepart.add(new Test("0 distance", null, SetupFindObjects,
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(225, 225), 0);
      test.assert(coll.count === 5, "should have found 5 objects, not: " + coll.count);
    },
    null));

  findobjectsnearfringepart.add(new Test("0x0 node", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(0, 0), 999);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsnearfringepart.add(new Test("0x0 node, 0 distance", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(0, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(0, 0), 0);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsnearfringepart.add(new Test("100x0 node, 0 distance", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0), desiredSize: new go.Size(100, 0) }
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(50, 0), 0);
      test.assert(coll.count === 1, "should have found the node, not: " + coll.count);
    },
    null));

  findobjectsnearfringepart.add(new Test("weird geometry", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.clear();
      test.diagram.contentAlignment = go.Spot.Center;
      test.diagram.add(
        $(go.Node,
          { background: "lightgray", position: new go.Point(0, 0) },
          $(go.Shape,
            { geometryString: "M0 0 Q0 0 50 50 Q90 70 100 60 L110 60 L110 37 L155 42 L220 142" }
          )
        )
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(110, 60), 1);
      test.assert(coll.count === 2, "should have found both, not: " + coll.count);
    },
    null));

  findobjectsnearfringepart.add(new Test("jump link", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.clear();

      diagram.contentAlignment = go.Spot.Center;

      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, { strokeWidth: 0, desiredSize: new go.Size(30, 30) })
        );

      diagram.linkTemplate =
        $(go.Link,
          { routing: go.Link.AvoidsNodes,  // may be either Orthogonal or AvoidsNodes
            curve: go.Link.JumpGap },
          $(go.Shape, { stroke: "green" })
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, loc: "0 50" },
          { key: 2, loc: "100 50" },
          { key: 3, loc: "50 0" },
          { key: 4, loc: "50 100" }
        ],
        [
          { from: 1, to: 2 },
          { from: 3, to: 4 }
        ]
      );
    },
    function(test) {
      var coll = test.diagram.findObjectsNear(new go.Point(65, 115), 1);
      test.assert(coll.count === 2, "should have found just one link/shape pair, not: " + coll.count);
    },
    null));

function SetupFindParts(test) {
  var $ = go.GraphObject.make;
  var diagram = test.diagram;
  diagram.clear();

  diagram.contentAlignment = go.Spot.Center;
  diagram.addLayerBefore($(go.Layer, { name: "temp", isTemporary: true }), diagram.findLayer("Foreground"));

  // diagram.add($(go.Part,
  //   { location: new go.Point(-10, -10), locationObjectName: "RECT", layerName: "temp" },
  //   $(go.Shape, "Rectangle", { name: "RECT", desiredSize: new go.Size(180, 999), fill: null })
  // ));

  // diagram.add($(go.Part,
  //   { location: new go.Point(-10, -10), locationObjectName: "CIRCLE", locationSpot: go.Spot.Center, layerName: "temp" },
  //   $(go.Shape, "Circle", { name: "CIRCLE", desiredSize: new go.Size(370, 370), fill: null })
  // ));

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      new go.Binding("layerName"),
      new go.Binding("location", "loc", go.Point.parse),
      new go.Binding("selectable"),
      $(go.Shape, "Rectangle",
        { strokeWidth: 0 },
        new go.Binding("fill", "color")
      ),
      $(go.TextBlock,
        { margin: 15, width: 50, height: 15, textAlign: "center", background: "limegreen" },
        new go.Binding("text", "key")
      )
    );

  diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue", loc: "0 0", selectable: false },
      { key: "Beta", color: "orange", loc: "100 0" },
      { key: "Gamma", color: "lightgreen", loc: "0 50", layerName: "temp" } // should never be found
    ],
    [
      { from: "Alpha", to: "Beta" }
    ]
  );
}

  var findpartsat = new TestCollection("findPartsAt");
  colls.add(findpartsat);

  findpartsat.add(new Test("selectable", null, SetupFindParts,
    function(test) {
      var diag = test.diagram;
      diag.commit(function(d) {
        var beta = d.findNodeForKey("Beta");
        beta.position = new go.Point(40, 25);
      });

      diag.nodes.each(function(n) { console.log(n.actualBounds.toString()) });

      var coll = diag.findPartsAt(new go.Point(70, 35));
      test.assert(coll.count === 1, "should have found one node at 70,35 , not: " + coll.count);

      coll = diag.findPartsAt(new go.Point(110, 60));
      test.assert(coll.count === 1, "should have found one node at 110,60 , not: " + coll.count);

      coll = diag.findPartsAt(new go.Point(70, 65));
      test.assert(coll.count === 1, "should have found one node at 70,65 , not: " + coll.count);
    }
  ));

  findpartsat.add(new Test("non-selectable", null, SetupFindParts,
    function(test) {
      var diag = test.diagram;
      diag.commit(function(d) {
        var beta = d.findNodeForKey("Beta");
        beta.position = new go.Point(40, 25);
      });

      var coll = diag.findPartsAt(new go.Point(70, 35), false);
      test.assert(coll.count === 2, "should have found two nodes at 70,35 , not: " + coll.count);

      coll = diag.findPartsAt(new go.Point(110, 60), false);
      test.assert(coll.count === 1, "should have found one node at 110,60 , not: " + coll.count);

      coll = diag.findPartsAt(new go.Point(70, 65), false);
      test.assert(coll.count === 1, "should have found one node at 70,65 , not: " + coll.count);
    }
  ));

var findpartsin = new TestCollection("findPartsIn");
colls.add(findpartsin);

findpartsin.add(new Test("default (partial = false, selectable = true)", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsIn(new go.Rect(-10, -10, 180, 999));
    test.assert(coll.count === 1, "should have found link, not: " + coll.count);
  },
  null
));

findpartsin.add(new Test("partial = true", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsIn(new go.Rect(-10, -10, 180, 999), true, true);
    test.assert(coll.count === 2, "should have found Beta and link, not: " + coll.count);
  },
  null
));

findpartsin.add(new Test("selectable = false", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsIn(new go.Rect(-10, -10, 180, 999), false, false);
    test.assert(coll.count === 2, "should have found Alpha and link, not: " + coll.count);
  },
  null
));

findpartsin.add(new Test("partial = true, selectable = false", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsIn(new go.Rect(-10, -10, 180, 999), true, false);
    test.assert(coll.count === 3, "should have found Alpha, Beta, and link, not: " + coll.count);
  },
  null
));

findpartsin.add(new Test("add to existing collection", null, SetupFindParts,
  function(test) {
    var coll = new go.Set(/*go.Part*/);
    coll.add(go.GraphObject.make(go.Node));
    test.diagram.findPartsIn(new go.Rect(-10, -10, 180, 999), true, false, coll);
    test.assert(coll.count === 4, "should have added 3 parts to collection" + coll.count);
  },
  null
));

var findpartsnear = new TestCollection("findPartsNear");
colls.add(findpartsnear);

findpartsnear.add(new Test("default (partial = true, selectable = true)", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsNear(new go.Point(-10, -10), 185);
    test.assert(coll.count === 2, "should have found Beta and link, not: " + coll.count);
  },
  null
));

findpartsnear.add(new Test("partial = false", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsNear(new go.Point(-10, -10), 185, false, true);
    test.assert(coll.count === 1, "should have found link, not: " + coll.count);
  },
  null
));

findpartsnear.add(new Test("selectable = false", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsNear(new go.Point(-10, -10), 185, true, false);
    test.assert(coll.count === 3, "should have found Alpha, Beta, and link, not: " + coll.count);
  },
  null
));

findpartsnear.add(new Test("partial = false, selectable = false", null, SetupFindParts,
  function(test) {
    var coll = test.diagram.findPartsNear(new go.Point(-10, -10), 185, false, false);
    test.assert(coll.count === 2, "should have found Alpha and link, not: " + coll.count);
  },
  null
));

findpartsnear.add(new Test("add to existing collection", null, SetupFindParts,
  function(test) {
    var coll = new go.Set(/*go.Part*/);
    coll.add(go.GraphObject.make(go.Node));
    test.diagram.findPartsNear(new go.Point(-10, -10), 185, true, false, coll);
    test.assert(coll.count === 4, "should have added 3 parts to collection" + coll.count);
  },
  null
));

function SetupExamples(test) {
  var diagram = test.diagram;
  diagram.reset();
  diagram.model = new go.GraphLinksModel([
    { key: 0, text: "bat", val: 7, arr: [] },
    { key: 1, text: "cat", val: 6, arr: [11] },
    { key: 2, text: "hat", val: 12, arr: [11, 22] },
    { key: 3, text: "bat", val: 3, arr: [11, 22, 33] },
    { key: 4, text: "dog", val: 5, arr: [12, 23, 34, 45] },
    { key: 5, text: "achat", val: 5, arr: ["eleven", "twelve"] },
    { key: 6, arr: [11, 23] }
  ], [
    { from: 0, to: 1, val: 7 },
    { from: 0, to: 1, val: 6 },
    { from: 0, to: 2, val: 12 },
    { from: 2, to: 3, val: 3 },
    { from: 3, to: 4 },
    { from: 3, to: 5 }
  ]);
}

var examples = new TestCollection("ByExample");
colls.add(examples);

examples.add(new Test("nodes bat", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ text: "bat" })); },
  function(test) {
    test.assert(test.diagram.selection.count === 2, "should have found 2 bats, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes ^[c|h]at", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ text: /^[c|h]at/ })); },
  function(test) {
    test.assert(test.diagram.selection.count === 2, "should have found cat and hat, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes predicate", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ val: function(v) { return v%2===1; } })); },
  function(test) {
    test.assert(test.diagram.selection.count === 4, "should have found bat, bat, dog, achat; found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes undefined", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ text: undefined })); },
  function(test) {
    test.assert(test.diagram.selection.count === 1 && test.diagram.selection.first().data.key === 6, "should have found #6, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes *hat and pred", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ text: /hat/, val: function(v) { return v % 2 === 1; } })); },
  function(test) {
    test.assert(test.diagram.selection.count === 1, "should have found only achat, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes *hat and pred OR bat and 3", null, SetupExamples,
  function(test) { test.diagram.selectCollection(test.diagram.findNodesByExample({ text: /hat/, val: function(v) { return v % 2 === 1; } },
                                                                                     { text: "bat", val: 3 })); },
  function(test) {
    test.assert(test.diagram.selection.count === 2, "should have found only achat and bat, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("nodes with arr[1] == 11 && arr.length >= 2", null, SetupExamples,
  function(test) {
    test.diagram.selectCollection(test.diagram.findNodesByExample({ arr: [11, undefined] }));
  },
  function(test) {
    test.assert(test.diagram.selection.count === 3, "should have found only hat and bat and 6, found: " + test.diagram.selection.count);
  }
));

examples.add(new Test("links from 0 and even OR from 3", null, SetupExamples,
  function(test) {
    test.diagram.selectCollection(test.diagram.findLinksByExample({ from: 0, val: function(v) { return v % 2 === 0; } },
                                                                  { from: 3 }));
  },
  function(test) {
    test.assert(test.diagram.selection.count === 4, "should have found links from 0 (except val=7) and from 3, found: " + test.diagram.selection.count);
  }
));

// These tests make sure transformed Parts correctly update their transforms when
// locationSpot and locationObjectName are changed
var examples = new TestCollection("locationSpot");
colls.add(examples);

examples.add(new Test("locationSpot", null, SetupExamples,
  function(test) {
    //test.diagram.reset();
    var diagram = test.diagram;
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    diagram.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Left , angle: 90 },
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 ,width: 100, height: 50
      }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 8, width: 30, height: 20, name: 'TEXT' },
          new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" }
    ], [ ]);
  },
  function(test) {
    var diagram = test.diagram;
    var b = diagram.findNodeForKey('Beta');
    diagram.startTransaction();
    b.locationSpot = go.Spot.Center;
    diagram.commitTransaction();

    test.assert(diagram.findPartAt(new go.Point(95, 47)) === b);
    test.assert(diagram.findPartAt(new go.Point(95, -47)) === b);
    test.assert(diagram.findPartAt(new go.Point(155, -60)) === null);
  }
));


examples.add(new Test("locationObjectName", null, SetupExamples,
  function(test) {
    //test.diagram.reset();
    var diagram = test.diagram;
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    diagram.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Left , angle: 90 },
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 ,width: 100, height: 50
      }, new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 8, width: 30, height: 20, name: 'TEXT' },
          new go.Binding("text", "key")) );

    diagram.model = new go.GraphLinksModel( [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" }
    ], [ ]);
  },
  function(test) {
    var diagram = test.diagram;
    var b = diagram.findNodeForKey('Beta');
    diagram.startTransaction();
    b.locationObjectName = "TEXT";
    diagram.commitTransaction();

    test.assert(diagram.findPartAt(new go.Point(55, -45)) === null);
    test.assert(diagram.findPartAt(new go.Point(115, 61)) === b);
  }
));

class LineReshapingTool extends go.Tool {
  constructor() {
    super();
    this.name = "LineReshaping";

    var h = new go.Shape();
    h.desiredSize = new go.Size(6, 6);
    h.fill = "lightblue";
    h.stroke = "dodgerblue";
    h.cursor = "move";
    this._handleArchetype = h;

    this._handle = null;
    this._adornedShape = null;
    this._otherPoint = null;
    this._originalLocation = null;
    this._originalGeometry = null;
  }

  /**
  * Show an {@link Adornment} with a reshape handle at each point of the geometry.
  * Don't show anything if "SHAPE" doesn't identify a {@link Shape}
  * that has a {@link Shape#geometry} of type {@link Geometry#Line}.
  * @this {LineReshapingTool}
  * @param {Part} part the part.
  */
  updateAdornments(part) {
    if (part === null) return;
    if (part.isSelected && !this.diagram.isReadOnly) {
      var selelt = part.findObject("SHAPE");
      if (selelt instanceof go.Shape && selelt.actualBounds.isReal() && selelt.isVisibleObject() &&
        part.canReshape() && part.actualBounds.isReal() && part.isVisible() &&
        selelt.geometry.type === go.GeometryType.Line) {
        var adornment = part.findAdornment(this.name);
        if (adornment === null) {
          adornment = this.makeAdornment(selelt);
        }
        if (adornment !== null) {
          // update the position/alignment of each handle
          var geo = selelt.geometry;
          var h0 = adornment.elt(1);
          h0.alignment = new go.Spot(0, 0, geo.startX, geo.startY);
          var h1 = adornment.elt(2);
          h1.alignment = new go.Spot(0, 0, geo.endX, geo.endY);
          part.addAdornment(this.name, adornment);
          adornment.location = selelt.getDocumentPoint(go.Spot.TopLeft);
          adornment.angle = selelt.getDocumentAngle();
          return;
        }
      }
    }
    part.removeAdornment(this.name);
  }

  /*
  * @this {LineReshapingTool}
  * @param {Shape} selelt
  */
  makeAdornment(selelt) {
    var adornment = new go.Adornment();
    adornment.type = go.Panel.Spot;
    adornment.locationObjectName = "BODY";
    adornment.locationSpot = new go.Spot(0, 0, -selelt.strokeWidth / 2, -selelt.strokeWidth / 2);
    var h = new go.Shape();
    h.name = "BODY";
    h.fill = null;
    h.stroke = null;
    h.strokeWidth = 0;
    adornment.add(h);

    var h = this.handleArchetype.copy();
    h.segmentIndex = 0;
    adornment.add(h);

    h = this.handleArchetype.copy();
    h.segmentIndex = 1;
    adornment.add(h);

    adornment.category = this.name;
    adornment.adornedObject = selelt;
    return adornment;
  };

  /*
  * @this {LineReshapingTool}
  */
  canStart() {
    if (!this.isEnabled) return false;

    var diagram = this.diagram;
    if (diagram === null || diagram.isReadOnly) return false;
    if (!diagram.allowReshape) return false;
    if (!diagram.lastInput.left) return false;
    var h = this.findToolHandleAt(diagram.firstInput.documentPoint, this.name);
    return (h !== null);
  };

  /**
  * @this {LineReshapingTool}
  */
  doActivate() {
    var diagram = this.diagram;
    if (diagram === null) return;
    this._handle = this.findToolHandleAt(diagram.firstInput.documentPoint, this.name);
    if (this._handle === null) return;
    var shape = this._handle.part.adornedObject;
    if (!shape) return;
    this._adornedShape = shape;
    diagram.isMouseCaptured = true;
    this.startTransaction(this.name);
    var loc = shape.part.location.copy();
    var geo = shape.geometry;
    this._otherPoint = (this._handle.index > 0) ?
      new go.Point(loc.x + geo.startX, loc.y + geo.startY) :
      new go.Point(loc.x + geo.endX, loc.y + geo.endY);
    this._originalLocation = loc;
    this._originalGeometry = geo;
    this.isActive = true;
  };

  /**
  * @this {LineReshapingTool}
  */
  doDeactivate() {
    this.stopTransaction();

    this._handle = null;
    this._adornedShape = null;
    var diagram = this.diagram;
    if (diagram !== null) diagram.isMouseCaptured = false;
    this.isActive = false;
  };

  /**
  * @this {LineReshapingTool}
  */
  doCancel() {
    var shape = this._adornedShape;
    if (shape !== null) {
      // explicitly restore the original route, in case !UndoManager.isEnabled
      shape.geometry = this._originalGeometry;
      shape.part.location = this._originalLocation;
    }
    this.stopTool();
  };

  /**
  * @this {LineReshapingTool}
  */
  doMouseMove() {
    var diagram = this.diagram;
    if (this.isActive && diagram !== null) {
      var newpt = this.computeReshape(diagram.lastInput.documentPoint);
      this.reshape(newpt);
    }
  };

  /**
  * @this {LineReshapingTool}
  */
  doMouseUp() {
    var diagram = this.diagram;
    if (this.isActive && diagram !== null) {
      var newpt = this.computeReshape(diagram.lastInput.documentPoint);
      this.reshape(newpt);
      this.transactionResult = this.name;  // success
    }
    this.stopTool();
  };

  /**
  * @expose
  * @this {LineReshapingTool}
  * @param {Point} newPoint the value of the call to {@link #computeReshape}.
  */
  reshape(newPoint) {
    var part = this._adornedShape.part;
    var loc = part.location;
    var geo = this._adornedShape.geometry;
    // figure out the new two Points
    var start = newPoint;
    var end = newPoint;
    if (this.handle.segmentIndex === 0) {  // moving the "start" -- keep the "end"
      end = new go.Point(loc.x + geo.endX, loc.y + geo.endY);
    } else {  // moving the "end" -- keep the "start"
      start = new go.Point(loc.x + geo.startX, loc.y + geo.startY);
    }
    LineReshapingTool.updateLineGeometry(start, end, part);
    this.updateAdornments(part);  // update any Adornments of the Part
    this.diagram.maybeUpdate();  // force more frequent drawing for smoother looking behavior
  };


  /**
  * @expose
  * @this {LineReshapingTool}
  * @param {Point} p the point where the handle is being dragged.
  * @return {Point}
  */
  computeReshape(p) {
    return p;  // no constraints on the points
  };

  /**
  * This static function updates the geometry of the main Shape in the given Part and set the part's location.
  * This depends on the structure of both the tempLine and the part template.
  * This is used by both LineDrawingTool and LineReshapingTool.
  * @param {Point} start
  * @param {Point} end
  * @param {Part} part
  */
  static updateLineGeometry(start, end, part) {
    var shape = part.findObject("SHAPE");
    if (shape === null) shape = part.findMainElement();
    var x = Math.min(start.x, end.x);
    var y = Math.min(start.y, end.y);
    var geo = new go.Geometry(go.GeometryType.Line);
    geo.startX = start.x - x;
    geo.startY = start.y - y;
    geo.endX = end.x - x;
    geo.endY = end.y - y;
    shape.geometry = geo;
    part.location = new go.Point(x, y);
  }
  /*
  * A small GraphObject used as a reshape handle for each segment.
  * The default GraphObject is a small blue diamond.
  * @name LineReshapingTool#handleArchetype
  * @return {GraphObject}
  */
  get handleArchetype() { return this._handleArchetype; }
  set handleArchetype(val) { this._handleArchetype = value; }

  /*
  * This read-only property returns the {@link GraphObject} that is the tool handle being dragged by the user.
  * This will be contained by an {@link Adornment} whose category is "LineReshaping".
  * Its {@link Adornment#adornedObject} is the same as the {@link #adornedShape}.
  * @name LineReshapingTool#handle
  * @return {GraphObject}
  */
  get handle() { return this._handle; }
}
// end LineReshapingTool

// the "Line" template conversion functions
function makeGeo(pts) {
  var geo = new go.Geometry(go.GeometryType.Line);
  geo.startX = pts[0];
  geo.startY = pts[1];
  geo.endX = pts[2];
  geo.endY = pts[3];
  return geo;
}

function saveGeo(geo) {
  return [geo.startX, geo.startY, geo.endX, geo.endY];
}

examples.add(new Test("Adornment handles", null,
  function(test) {
    const diag = test.diagram;
    diag.reset();
    diag.initialContentAlignment = go.Spot.Center;
    diag.initialScale = 4;
    // Install the LineReshapingTool as a regular mouse-down tool.
    diag.toolManager.mouseDownTools.add(new LineReshapingTool());

    diag.nodeTemplateMap.add("Line",
      $(go.Node,
        { reshapable: true, selectionAdorned: false },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { locationObjectName: "SHAPE", locationSpot: new go.Spot(0, 0, 0.5, 0.5) },  // account for strokeWidth, default == 1
        new go.Binding("locationSpot", "strokeWidth", sw => new go.Spot(0, 0, sw / 2, sw / 2)).ofObject("SHAPE"),
        $(go.Shape, { name: "SHAPE", stroke: "blue", strokeWidth: 1 },
          new go.Binding("geometry", "pts", makeGeo).makeTwoWay(saveGeo))
      ));

    diag.model = new go.GraphLinksModel(
      [
        { key: -5, category: "Line", pts: [0, 0, 58.41786984531504, 53.51830656796604], loc: "127.89116260461242 -34.17131503077773" },
        { key: -6, category: "Line", pts: [0, 40.70406415028404, 40.70406415028404, 0], loc: "159.5498791659446 -45.477999516967714" }
      ]);

    diag.commandHandler.selectAll();
  },
  function(test) {
    const diag = test.diagram;
    test.assertAllNodeLocations([new go.Point(127.9,-34.2), new go.Point(159.5,-45.5)]);
    const line5 = diag.findNodeForKey(-5);
    const a5 = line5.data.pts;
    test.assert(test.isApproxPoint(new go.Point(a5[0], a5[1]), new go.Point(0, 0)));
    test.assert(test.isApproxPoint(new go.Point(a5[2], a5[3]), new go.Point(58.4, 53.5)));
    const line6 = diag.findNodeForKey(-6);
    const a6 = line6.data.pts;
    test.assert(test.isApproxPoint(new go.Point(a6[0], a6[1]), new go.Point(0, 40.7)));
    test.assert(test.isApproxPoint(new go.Point(a6[2], a6[3]), new go.Point(40.7, 0)));

    // perform a LineReshaping
    test.mouseDown(new go.Point(159.55, -4.78));
    test.mouseMove(new go.Point(130, 10));
    test.mouseMove(new go.Point(110, 20));
    test.mouseUp(new go.Point(100, 30));
  },
  function(test) {
    const diag = test.diagram;
    test.assertAllNodeLocations([new go.Point(127.9,-34.2), new go.Point(100.0,-45.5)]);
    const line5 = diag.findNodeForKey(-5);
    const a5 = line5.data.pts;
    test.assert(test.isApproxPoint(new go.Point(a5[0], a5[1]), new go.Point(0, 0)));
    test.assert(test.isApproxPoint(new go.Point(a5[2], a5[3]), new go.Point(58.4, 53.5)));
    const line6 = diag.findNodeForKey(-6);
    const a6 = line6.data.pts;
    test.assert(test.isApproxPoint(new go.Point(a6[0], a6[1]), new go.Point(0, 75.5)), "didn't move left point of line pt1");
    test.assert(test.isApproxPoint(new go.Point(a6[2], a6[3]), new go.Point(100.25, 0)), "didn't move left point of line pt2");
  }
));


  var groups = new TestCollection("groups");
  colls.add(groups);

  function CheckZOrder(test) {
    var diag = test.diagram;
    var msg = "";
    diag.nodes.each(function(n) {
      if (!n.actualBounds.isReal() || !n.location.isReal()) {
        msg += "unreal node actualBounds and/or location for node " + n.key + " " + n.actualBounds.toString() + "\n";
      }
      // pick at where the TextBlock should be, which should not be occluded by any other Group
      var x = n.diagram.findPartAt(new go.Point().setRectSpot(n.actualBounds, new go.Spot(0.5, 0, 0, 4)));
      if (x !== n) msg += "found " + x.key + " in front of " + n.key + "\n";
    });
    test.assert(msg === "", msg);
  }

  groups.add(new Test("nested z-ordering", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.initialAutoScale = go.Diagram.Uniform;
      diag.addDiagramListener("InitialLayoutCompleted", function(e) { CheckZOrder(test); });

      diag.groupTemplate =
        $(go.Group, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Placeholder, { padding: new go.Margin(14, 4, 4, 4) }),
          $(go.TextBlock, { alignment: go.Spot.Top }, new go.Binding("text", "key"))
        );

      var nodeArray = [];
      for (var i = 0; i < 100; i++) {
        var g = (i > 0) ? Math.floor(Math.random() * i) : undefined;
        nodeArray.push({ key: i, isGroup: true, group: g });
      }
      // randomize the node data
      for (i = 0; i < nodeArray.length; i++) {
        var swap = Math.floor(Math.random() * nodeArray.length);
        var temp = nodeArray[swap];
        nodeArray[swap] = nodeArray[i];
        nodeArray[i] = temp;
      }
      diag.model = new go.GraphLinksModel(nodeArray);
    },
    CheckZOrder
  ));

  groups.add(new Test("Group.locationObject", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.layout = new go.LayeredDigraphLayout({ direction: 90 });

      diag.nodeTemplate =
        $(go.Node, "Horizontal",
          {
            background: "lightgray",
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE"
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape,
            { name: "SHAPE", fill: "white", width: 30, height: 30, portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 4) },
            new go.Binding("text"))
        );

      diag.groupTemplate =
        $(go.Group, "Horizontal",
          {
            background: "whitesmoke",
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE",
            layout: $(go.GridLayout, { wrappingColumn: 1 }),
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Circle",
            { name: "SHAPE", fill: "green", width: 30, height: 30, portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 4) },
            new go.Binding("text")),
          $(go.Placeholder,
            { //visible: false,
              background: "cyan",
              padding: 10
            }),
          $("SubGraphExpanderButton")
        );
      
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange", isGroup: true },
          { key: 3, text: "Gamma Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", group: 2 },
          { key: 51, text: "Epsilon 2", color: "yellow", group: 2 },
        ],
        [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var g2 = diag.findNodeForKey(2);
      test.assert(n1.position.x === 0 && n1.location.x < 20, "node Alpha location.x should be < 20");
      test.assert(g2.position.x === 0 && g2.location.x > 100, "group Beta location.x should be < 20");
      test.assert(g2.hasPlaceholder() && g2.locationObject == g2.placeholder, "group placeholder should be locationObject");
    }
  ));

  groups.add(new Test("Group.locationObject invisible Placeholder", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diag = test.diagram;
      diag.reset();

      diag.layout = new go.LayeredDigraphLayout({ direction: 90 });

      diag.nodeTemplate =
        $(go.Node, "Horizontal",
          {
            background: "lightgray",
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE"
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape,
            { name: "SHAPE", fill: "white", width: 30, height: 30, portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 4) },
            new go.Binding("text"))
        );

      diag.groupTemplate =
        $(go.Group, "Horizontal",
          {
            background: "whitesmoke",
            locationSpot: go.Spot.Center,
            locationObjectName: "SHAPE",
            layout: $(go.GridLayout, { wrappingColumn: 1 }),
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Circle",
            { name: "SHAPE", fill: "green", width: 30, height: 30, portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 4) },
            new go.Binding("text")),
          $(go.Placeholder,
            { visible: false,
              background: "cyan",
              padding: 10
            }),
          $("SubGraphExpanderButton")
        );
      
      diag.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue" },
          { key: 2, text: "Beta", color: "orange", isGroup: true },
          { key: 3, text: "Gamma Gamma", color: "lightgreen" },
          { key: 4, text: "Delta", color: "pink" },
          { key: 5, text: "Epsilon", color: "yellow", group: 2 },
          { key: 51, text: "Epsilon 2", color: "yellow", group: 2 },
        ],
        [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 4 },
        ]);
    },
    function(test) {
      var diag = test.diagram;
      var n1 = diag.findNodeForKey(1);
      var g2 = diag.findNodeForKey(2);
      test.assert(n1.position.x === 0 && n1.location.x < 20, "node Alpha location.x should be < 20");
      test.assert(g2.position.x === 0 && g2.location.x < 20, "group Beta location.x should be < 20");
      test.assert(!g2.hasPlaceholder() && g2.locationObject == g2.findObject("SHAPE"), "group placeholder should be Shape");
    }
  ));

})();


