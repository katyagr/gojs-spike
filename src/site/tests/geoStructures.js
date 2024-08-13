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
    var geom = new TestCollection('Geometry');
    TestRoot.add(geom);

    // Point :
    var points = new TestCollection('Point');
    geom.add(points);

    //constructor tests
    points.add(new Test('constructor', null,
    function (test) {
        test.point1 = new go.Point();
        test.point2 = new go.Point(0, 0);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point(-5, -5);
    },
    null,
    function (test) {
        test.assert(test.point1.x === 0 && test.point1.y === 0, 'default constructor doesn\'t create a point at location(0, 0)');
        test.assert(test.point2.x === 0 && test.point2.y === 0, 'constructor input (0, 0) doesn\'t create a point at location(0, 0)');
        test.assert(test.point3.x === 5 && test.point3.y === 5, 'constructor input (5, 5) doesn\'t create a point at location(5, 5)');
        test.assert(test.point4.x === -5 && test.point4.y === -5, 'constructor input (-5, -5) doesn\'t create a point at location(-5, -5)');
        try {
            test.point5 = new go.Point(NaN, e);
            if (go.Debug) test.assert(false, 'constructor doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //add Point test
    points.add(new Test('add', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point();
        test.point5 = new go.Point(-5, -5);
    },
    function (test) {
        test.point1.add(new go.Point(5, 5));
        test.point2.add(new go.Point());
        test.point3.add(new go.Point(-10, -10));
        test.point4.add(new go.Point(5, 5));
        test.point5.add(new go.Point(10, 10));
    },
    function (test) {
        test.assert(test.point1.equalTo(10, 10), 'add does not properly add positive point to point');
        test.assert(test.point2.equalTo(5, 5), 'add does not properly add zero point(0, 0) to point');
        test.assert(test.point3.equalTo(-5, -5), 'add does not properly add negative point to point');
        test.assert(test.point4.equalTo(5, 5), 'add does not properly add positive point to zero point(0, 0)');
        test.assert(test.point5.equalTo(5, 5), 'add does not properly add positive point to negative point');
    }
    ));

    //copy test
    points.add(new Test('copy', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = test.point1.copy();
        test.point3 = new go.Point(10, 10);
        test.point4 = test.point3.copy();
    },
    function (test) {
        test.point1.x = 7;
        test.point1.y = 7;
        test.point4.x = 13;
        test.point4.y = 13;
    },
    function (test) {
        test.assert(test.point2.x === 5 && test.point2.y === 5,
            'copy changes when original is changed');
        test.assert(test.point3.x === 10 && test.point3.y === 10,
            'original changes when copy is changed');
    }
    ));

    //direction test
    points.add(new Test('direction', null,
    function (test) {
        test.point1 = new go.Point(0, 0);
    },
    null,
    function (test) {
        test.assert(test.point1.directionPoint(new go.Point(0, 0)) === 0,
        'directionPoint doesn\'t provide correct direction of 0 for same point');
        test.assert(test.point1.direction(0, 0) === 0,
        'direction doesn\'t provide correct direction of 0 for same coordinates');
        test.assert(test.point1.directionPoint(new go.Point(1, 0)) === 0,
        'directionPoint doesn\'t provide correct direction for point along the same y axis');
        test.assert(test.point1.direction(1, 0) === 0,
        'direction doesn\'t provide correct direction for coordinates along the same y axis');
        test.assert(test.point1.directionPoint(new go.Point(0, 1)) === 90,
        'directionPoint doesn\'t provide correct direction for point along the same x axis');
        test.assert(test.point1.direction(0, 1) === 90,
        'direction doesn\'t provide correct direction for coordinates along the same x axis');
        test.assert(test.point1.directionPoint(new go.Point(1, 1)) === 45,
        'directionPoint doesn\'t provide correct direction for point with positive coordinates');
        test.assert(test.point1.direction(1, 1) === 45,
        'direction doesn\'t provide correct direction for positive coordinates');
        test.assert(test.point1.directionPoint(new go.Point(-1, -1)) === 225,
        'directionPoint doesn\'t provide correct direction for point with negative coordinates');
        test.assert(test.point1.direction(-1, -1) === 225,
        'direction doesn\'t provide correct direction for negative coordinates');
        try {
            test.point1.direction(a, e);
            if (go.Debug) test.assert(false, 'direction doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Point.direction test
    points.add(new Test('Point.direction', null,
    null,
    null,
    function (test) {
        test.assert(go.Point.direction(0, 0, 0, 0) === 0,
        'Point.direction doesn\'t provide correct direction of 0 for same coordinates');
        test.assert(go.Point.direction(0, 0, 1, 0) === 0,
        'Point.direction doesn\'t provide correct direction for coordinates along the same y axis');
        test.assert(go.Point.direction(0, 0, 0, 1) === 90,
        'Point.direction doesn\'t provide correct direction for coordinates along the same x axis');
        test.assert(go.Point.direction(0, 0, 1, 1) === 45,
        'Point.direction doesn\'t provide correct direction for positive coordinates');
        test.assert(go.Point.direction(0, 0, -1, -1) === 225,
        'Point.direction doesn\'t provide correct direction for negative coordinates');
        try {
            go.Point.direction(a, e, i, o);
            if (go.Debug) test.assert(false, 'direction doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //distance Squared test
    points.add(new Test('distanceSquared', null,
    function (test) {
        test.point1 = new go.Point(0, 0);
    },
    null,
    function (test) {
        test.assert(test.point1.distanceSquaredPoint(new go.Point(0, 0)) === 0,
        'distanceSquaredPoint method doesn\'t provide correct squared distance of 0 for same point');
        test.assert(test.point1.distanceSquared(0, 0) === 0,
        'distanceSquared method doesn\'t provide correct squared distance of 0 for same coordinates');
        test.assert(test.point1.distanceSquaredPoint(new go.Point(0.5, 0)) === 0.25,
        'distanceSquaredPoint method doesn\'t provide correct squared distance for point less than 1 unit away');
        test.assert(test.point1.distanceSquared(0.5, 0) === 0.25,
        'distanceSquared method doesn\'t provide correct squared distance for coordinates less than 1 unit away');
        test.assert(test.point1.distanceSquaredPoint(new go.Point(1, 0)) === 1,
        'distanceSquaredPoint method doesn\'t provide correct squared distance for point 1 unit away');
        test.assert(test.point1.distanceSquared(1, 0) === 1,
        'distanceSquared method doesn\'t provide correct squared distance for coordinates 1 unit away');
        test.assert(test.point1.distanceSquaredPoint(new go.Point(3, 4)) === 25,
        'distanceSquaredPoint method doesn\'t provide correct squared distance for point with positive coordinates');
        test.assert(test.point1.distanceSquared(3, 4) === 25,
        'distanceSquared method doesn\'t provide correct squared distance for positive coordinates');
        test.assert(test.point1.distanceSquaredPoint(new go.Point(-5, -12)) === 169,
        'distanceSquaredPoint method doesn\'t provide correct squared distance for point with negative coordinates');
        test.assert(test.point1.distanceSquared(-5, -12) === 169,
        'distanceSquared method doesn\'t provide correct squared distance for negative coordinates');
        try {
            test.point1.distanceSquared(a, e);
            if (go.Debug) test.assert(false, 'distanceSquared method doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Point.distanceSquared test
    points.add(new Test('Point.distanceSquared', null,
    null,
    null,
    function (test) {
        test.assert(go.Point.distanceSquared(0, 0, 0, 0) === 0,
        'Point.distanceSquared method doesn\'t provide correct distance of 0 for same coordinates');
        test.assert(go.Point.distanceSquared(0, 0, 0.5, 0) === 0.25,
        'Point.distanceSquared method doesn\'t provide correct squared distance for coordinates less than 1 unit away');
        test.assert(go.Point.distanceSquared(0, 0, 1, 0) === 1,
        'Point.distanceSquared method doesn\'t provide correct distance for coordinates 1 unit away');
        test.assert(go.Point.distanceSquared(0, 0, 3, 4) === 25,
        'Point.distanceSquared method doesn\'t provide correct distance for positive coordinates');
        test.assert(go.Point.distanceSquared(0, 0, -5, -12) === 169,
        'Point.distanceSquared method doesn\'t provide correct distance for negative coordinates');
        try {
            go.Point.distanceSquared(a, e, i, o);
            if (go.Debug) test.assert(false, 'Point.distanceSquared method doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Point.distanceLineSegmentSquared test
    points.add(new Test('Point.distanceLineSegmentSquared', null,
    null,
    null,
    function (test) {
        test.assert(go.Point.distanceLineSegmentSquared(3, 0, 0, 0, 5, 0) === 0,
        'Point.distanceLineSegmentSquared method doesn\'t provide correct squared distance of 0 for point on the line segment');
        test.assert(go.Point.distanceLineSegmentSquared(3, 0.5, 0, 0, 5, 0) === 0.25,
        'Point.distanceLineSegmentSquared method doesn\'t provide correct squared distance ' +
        'for coordinates less than 1 unit away from line segment');
        test.assert(go.Point.distanceLineSegmentSquared(6, 0, 0, 0, 5, 0) === 1,
        'Point.distanceLineSegmentSquared method doesn\'t provide correct squared distance ' +
        'for coordinates 1 unit away in line with segment');
        test.assert(go.Point.distanceLineSegmentSquared(3, 3, 0, 0, 5, 0) === 9,
        'Point.distanceLineSegmentSquared method doesn\'t provide correct squared distance ' +
        'for coordinates perpendicular to line segment');
        test.assert(go.Point.distanceLineSegmentSquared(-5, 12, 0, 0, 5, 0) === 169,
        'Point.distanceLineSegmentSquared method doesn\'t provide correct squared distance ' +
        'for coordinates not perpendicular to line segment');
        try {
            go.Point.distanceLineSegmentSquared(a, e, i, o, u, y);
            if (go.Debug) test.assert(false, 'Point.distanceLineSegmentSquared method doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //equals test
    points.add(new Test('equals', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
    },
    null,
    function (test) {
        test.assert(test.point1.equals(new go.Point(5, 5)),
            'equals does not properly identify two identical points as equal');
        test.assert(test.point1.equalTo(5, 5),
            'equalTo does not identify two identical points as equal');
        test.assert(test.point1.equals(test.point1),
            'equals does not identify itself as an equal size');
        test.assert(!test.point1.equals(new go.Point(10, 10)),
            'equals identifies two different sizes as equal');
        test.assert(!test.point1.equalTo(10, 10),
            'equalTo identifies two different sizes as equal');
    }
    ));

    //normalize test
    points.add(new Test('normalize', null,
    function (test) {
        test.point1 = new go.Point(0, 0);
        test.point2 = new go.Point(2, 0);
        test.point3 = new go.Point(0, 1);
        test.point4 = new go.Point(0.5, 0.5);
        test.point5 = new go.Point(5, 5);
        test.point6 = new go.Point(-2, -2);
    },
    function (test) {
        test.point1.normalize();
        test.point2.normalize();
        test.point3.normalize();
        test.point4.normalize();
        test.point5.normalize();
        test.point6.normalize();
    },
    function (test) {
        test.assert(test.point1.equalTo(0, 0),
        'normalize should not change the location of coordinates at 0, 0');
        test.assert(test.point2.equalTo(1, 0),
        'normalize doesn\'t properly change the location of coordinates that lies on the axis');
        test.assert(test.point3.equalTo(0, 1),
        'normalize should not change the location of coordinates that are 1 unit away from 0, 0');
        test.assert(test.isApproxEqual(test.point4.x, Math.cos(Math.PI / 4)) && test.isApproxEqual(test.point4.y, Math.sin(Math.PI / 4)),
        'normalize doesn\'t properly change the location of coordinates that are less than 1 unit away from 0, 0 ');
        test.assert(test.isApproxEqual(test.point5.x, Math.cos(Math.PI / 4)) && test.isApproxEqual(test.point5.y, Math.sin(Math.PI / 4)),
        'normalize doesn\'t properly change the location of coordinates that are greater than 1 unit away from 0, 0');
        test.assert(test.isApproxEqual(test.point6.x, Math.cos(Math.PI / 4) * -1) && test.isApproxEqual(test.point6.y, Math.sin(Math.PI / 4) * -1),
        'normalize doesn\'t properly change the location of negative coordinates that are greater than 1 unit away from 0, 0');
    }
    ));

    //offset test
    points.add(new Test('offset', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
    },
    function (test) {
        test.point1.offset(0, 0);
        test.point2.offset(2, 2);
        test.point3.offset(-3, -3);
    },
    function (test) {
        test.assert(test.point1.equalTo(5, 5), 'offset should not move point with offset values 0, 0');
        test.assert(test.point2.equalTo(7, 7), 'offset incorrectly moves point with positive offset values');
        test.assert(test.point3.equalTo(2, 2), 'offset incorrectly moves point with negative offset values');
        try {
            test.point1.offset(a, e);
            if (go.Debug) test.assert(false, 'offset doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Point.parse test
    points.add(new Test('Point.parse', null,
    function (test) {
        test.point1 = new go.Point();
    },
    null,
    function (test) {
        test.assert(go.Point.parse("5 5").equalTo(5, 5),
        'Point.parse does not create proper point from given string with positive point coordinates');
        test.assert(go.Point.parse("-5 -5").equalTo(-5, -5),
        'Point.parse does not create proper point from given string with negative point coordinates');
        test.assert(go.Point.parse("5").equalTo(5, 0),
        'Point.parse does not create proper point from given string with Point(5, 0)');
        test.assert(go.Point.parse("").equalTo(0, 0),
        'Point.parse does not create proper point from given string with Point(0, 0)');
        //        try {
        //            go.Size.parse("5");
        //            test.assert(false, 'Size.parse doesn\'t throw error for having incorrect string input');
        //        }
        //        catch (err) {
        //        }
        try {
            test.point1.set(go.Point.parse("a e"));
            if (go.Debug) test.assert(!test.point1.isReal(), 'Point.parse doesn\'t throw error for non-numbers');
        }
        catch (err) {
        }
    }
    ));

    //projectOntoLineSegment test
    points.add(new Test('projectOntoLineSegment', null,
    function (test) {
      test.P = new go.Point(10, 20);
      test.Q = new go.Point(20, 30);
    },
    function(test) {
      test.p1 = new go.Point(-3, -4); test.p1.projectOntoLineSegmentPoint(test.P, test.Q);
      test.p2 = new go.Point(10, 20); test.p2.projectOntoLineSegmentPoint(test.P, test.Q);
      test.p3 = new go.Point(20, 20); test.p3.projectOntoLineSegmentPoint(test.P, test.Q);
      test.p4 = new go.Point(20, 30); test.p4.projectOntoLineSegmentPoint(test.P, test.Q);
      test.p5 = new go.Point(9e99, 9e99); test.p5.projectOntoLineSegmentPoint(test.P, test.Q);
      test.p6 = new go.Point(-5, 45); test.p6.projectOntoLineSegment(test.P.x, test.P.y, test.Q.x, test.Q.y);
    },
    function (test) {
      test.assert(test.P.equalTo(10, 20), 'projectOntoLineSegment should not change given point P');
      test.assert(test.Q.equalTo(20, 30), 'projectOntoLineSegment should not change given point Q');
      test.assert(test.p1.equalTo(10, 20), 'projectOntoLineSegment should result in 10,20; not ' + test.p1.toString());
      test.assert(test.p2.equalTo(10, 20), 'projectOntoLineSegment should result in 10,20; not ' + test.p2.toString());
      test.assert(test.p3.equalTo(15, 25), 'projectOntoLineSegment should result in 15,25; not ' + test.p3.toString());
      test.assert(test.p4.equalTo(20, 30), 'projectOntoLineSegment should result in 20,30; not ' + test.p4.toString());
      test.assert(test.p5.equalTo(20, 30), 'projectOntoLineSegment should result in 20,30; not ' + test.p5.toString());
      test.assert(test.p6.equalTo(15, 25), 'projectOntoLineSegment should result in 15,25; not ' + test.p6.toString());
    }
    ));

    //rotate test
    points.add(new Test('rotate', null,
    function (test) {
        test.point1 = new go.Point(5, 0);
        test.point2 = new go.Point(5, 0);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point(5, 5);
        test.point5 = new go.Point(5, 5);
    },
    function (test) {
        test.point1.rotate(0);
        test.point2.rotate(45);
        test.point3.rotate(180);
        test.point4.rotate(360);
        test.point5.rotate(-90);
    },
    function (test) {
        test.assert(test.point1.equalTo(5, 0), 'rotate with 0 degrees rotation should not change given point');
        test.assert(test.isApproxEqual(test.point2.x, Math.cos(Math.PI / 4) * 5) &&
        test.isApproxEqual(test.point2.y, Math.sin(Math.PI / 4) * 5),
        'rotate does not yield proper location for given point and angle rotation');
        test.assert(test.isApproxEqual(test.point3.x, -5) && test.isApproxEqual(test.point3.y, -5),
        'rotate does not yield proper location for given point and 180 degree rotation');
        test.assert(test.isApproxEqual(test.point4.x, 5) && test.isApproxEqual(test.point4.y, 5),
        'rotate does not yield proper location for given point and 360 degree rotation');
        test.assert(test.point5.equalTo(5, -5),
        'rotate does not yield proper location for given point and negative rotation');
        try {
            test.point1.rotate(a);
            if (go.Debug) test.assert(false, 'rotate doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //scale test
    points.add(new Test('scale', null,
    function (test) {
        test.point1 = new go.Point(0, 0);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point(5, 5);
        test.point5 = new go.Point(5, 5);
    },
    function (test) {
        test.point1.scale(5, 5);
        test.point2.scale(0, 0);
        test.point3.scale(1, 1);
        test.point4.scale(5, 5);
        test.point5.scale(-5, -5);
    },
    function (test) {
        test.assert(test.point1.equalTo(0, 0), 'scale should not move point at (0, 0)');
        test.assert(test.point2.equalTo(0, 0), 'scale of (0, 0) should always move point to (0, 0)');
        test.assert(test.point3.equalTo(5, 5), 'scale of (1, 1) should not move any point');
        test.assert(test.point4.equalTo(25, 25), 'scale of positive values improperly moving point');
        test.assert(test.point5.equalTo(-25, -25), 'scale of negative values improperly moving point');
        try {
            test.point1.scale(a, e);
            if (go.Debug) test.assert(false, 'scale doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //set test
    points.add(new Test('set', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point(5, 5);
    },
    function (test) {
        test.point1.set(new go.Point(10, 10));
        test.point2.set(new go.Point(0, 0));
        test.point3.set(new go.Point(-5, -5));
        test.point4.set(new go.Point(5, 5));
    },
    function (test) {
        test.assert(test.point1.equals(new go.Point(10, 10)),
            'set method with positive point coordinates did not work correctly');
        test.assert(test.point2.equals(new go.Point(0, 0)),
            'set method with point (0,0) did not work correctly');
        test.assert(test.point3.equals(new go.Point(-5, -5)),
            'set method with negative point coordinates did not work correctly');
        test.assert(test.point4.equals(new go.Point(5, 5)),
            'set method with same coordinates did not work correctly');
    }
    ));

    //set Spot test
    points.add(new Test('setSpot', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point(5, 5);
        test.point5 = new go.Point(5, 5);
        test.point6 = new go.Point(5, 5);
        test.point7 = new go.Point(5, 5);
        test.point8 = new go.Point(5, 5);
    },
    function (test) {
        test.point1.setRectSpot(new go.Rect(5, 5, 10, 10), new go.Spot(.5, .5, 0, 0));
        test.point2.setSpot(5, 5, 10, 10, new go.Spot(.5, .5, 0, 0));
        test.point3.setRectSpot(new go.Rect(-5, -5, 10, 10), new go.Spot(.5, .5, 0, 0));
        test.point4.setSpot(-5, -5, 10, 10, new go.Spot(.5, .5, 0, 0));
        test.point5.setRectSpot(new go.Rect(-10, -10, 10, 10), new go.Spot(.5, .5, 0, 0));
        test.point6.setSpot(-10, -10, 10, 10, new go.Spot(.5, .5, 0, 0));
        test.point7.setRectSpot(new go.Rect(0, 0, 10, 10), new go.Spot(.5, .5, 0, 0));
        test.point8.setSpot(0, 0, 10, 10, new go.Spot(.5, .5, 0, 0));
    },
    function (test) {
        test.assert(test.point1.equals(new go.Point(10, 10)),
            'setRectSpot method with positive rect spot position did not work correctly');
        test.assert(test.point2.equals(new go.Point(10, 10)),
            'setSpot method with positive rect spot position did not work correctly');
        test.assert(test.point3.equals(new go.Point(0, 0)),
            'setRectSpot method with rect spot position (0,0) did not work correctly');
        test.assert(test.point4.equals(new go.Point(0, 0)),
            'setSpot method with rect spot position (0,0) did not work correctly');
        test.assert(test.point5.equals(new go.Point(-5, -5)),
            'setRectSpot method with negative rect spot position did not work correctly');
        test.assert(test.point6.equals(new go.Point(-5, -5)),
            'setSpot method with negative rect spot position did not work correctly');
        test.assert(test.point7.equals(new go.Point(5, 5)),
            'setRectSpot method with same rect spot position did not work correctly');
        test.assert(test.point8.equals(new go.Point(5, 5)),
            'setSpot method with same rect spot position did not work correctly');
        try {
            test.point8.setSpot(0, 0, -5, -5, new go.Spot(.5, .5, 0, 0));
            if (go.Debug) test.assert(false, 'SetSpot doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.point8.setSpot(a, e, i, o, new go.Spot(.5, .5, 0, 0));
            if (go.Debug) test.assert(false, 'SetSpot doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //snapToGrid test
    points.add(new Test('snapToGrid', null,
    function(test) {
      test.P = new go.Point(5, 10);
      test.S = new go.Size(20, 30);
    },
    function(test) {
      test.p1 = new go.Point(0, 0); test.p1.snapToGridPoint(test.P, test.S);
      test.p2 = new go.Point(5, 10); test.p2.snapToGridPoint(test.P, test.S);
      test.p3 = new go.Point(10, 10); test.p3.snapToGridPoint(test.P, test.S);
      test.p4 = new go.Point(200, 300); test.p4.snapToGridPoint(test.P, test.S);
      test.p5 = new go.Point(-200, -300); test.p5.snapToGrid(test.P.x, test.P.y, test.S.width, test.S.height);
    },
    function(test) {
      test.assert(test.P.equalTo(5, 10), 'snapToGrid should not change given point P');
      test.assert(test.S.equalTo(20, 30), 'snapToGrid should not change given size S');
      test.assert(test.p1.equalTo(5, 10), 'snapToGrid should result in 5,10; not ' + test.p1.toString());
      test.assert(test.p2.equalTo(5, 10), 'snapToGrid should result in 5,10; not ' + test.p2.toString());
      test.assert(test.p3.equalTo(5, 10), 'snapToGrid should result in 5,10; not ' + test.p3.toString());
      test.assert(test.p4.equalTo(205, 310), 'snapToGrid should result in 205,310; not ' + test.p4.toString());
      test.assert(test.p5.equalTo(-195, -290), 'snapToGrid should result in -195,-290; not ' + test.p5.toString());
    }
    ));

    //Point.stringify test
    points.add(new Test('Point.stringify', null,
    null,
    null,
    function (test) {
        test.assert(go.Point.stringify(new go.Point(5, 5)) === "5 5",
        'Stringify does not return proper string for standard point');
        test.assert(go.Point.stringify(new go.Point(-5, -5)) === "-5 -5",
        'Stringify does not return proper string for negative point');
        test.assert(go.Point.stringify(new go.Point()) === "0 0",
        'Stringify does not return proper string for Point()');
    }
    ));

    //Point.stringifyFixed test
    points.add(new Test('Point.stringifyFixed', null,
    null,
    function (test) {
        test.assert(go.Point.stringifyFixed(0)(new go.Point(5.1, -5.1)) === "5 -5",
        'StringifyFixed does not return proper string for 0 digits');
        test.assert(go.Point.stringifyFixed(1)(new go.Point(5.01, -5.01)) === "5.0 -5.0",
        'StringifyFixed does not return proper string for 1 digit');
        test.assert(go.Point.stringifyFixed(2)(new go.Point(3.456, 2.345)) === "3.46 2.35",
        'StringifyFixed does not return proper string for 2 digits');
    }
    ));

    //subtract Point test
    points.add(new Test('subtract', null,
    function (test) {
        test.point1 = new go.Point(5, 5);
        test.point2 = new go.Point(5, 5);
        test.point3 = new go.Point(5, 5);
        test.point4 = new go.Point();
        test.point5 = new go.Point(-5, -5);
    },
    function (test) {
        test.point1.subtract(new go.Point(5, 5));
        test.point2.subtract(new go.Point());
        test.point3.subtract(new go.Point(-5, -5));
        test.point4.subtract(new go.Point(5, 5));
        test.point5.subtract(new go.Point(5, 5));
    },
    function (test) {
        test.assert(test.point1.equalTo(0, 0), 'subtract does not properly subtract positive point from point');
        test.assert(test.point2.equalTo(5, 5), 'subtract does not properly subtract zero point(0, 0) from point');
        test.assert(test.point3.equalTo(10, 10), 'subtract does not properly subtract negative point from point');
        test.assert(test.point4.equalTo(-5, -5), 'subtract does not properly subtract positive point from zero point(0, 0)');
        test.assert(test.point5.equalTo(-10, -10), 'subtract does not properly subtract positive point from negative point');
    }
    ));

    points.add(new Test("intersectingLineSegments", null, null,
      function(test) {
        const tl = new go.Point(-3, -13);
        const tr = new go.Point(-1, -13);
        const bl = new go.Point(-3, -11);
        const br = new go.Point(-1, -11);
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, tr.x, tr.y, bl.x, bl.y) === true, "X");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, bl.x, bl.y, tr.x, tr.y) === true, "X 2");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, tr.x, tr.y, bl.x, bl.y) === true, "X 3");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, bl.x, bl.y, tr.x, tr.y) === true, "X 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tr.x, tr.y, tl.x+1, tl.y-1, tl.x+1, tl.y+1) === true, "+");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tr.x, tr.y, tl.x+1, tl.y+1, tl.x+1, tl.y-1) === true, "+ 2");
        test.assert(go.Point.intersectingLineSegments(tr.x, tr.y, tl.x, tl.y, tl.x+1, tl.y-1, tl.x+1, tl.y+1) === true, "+ 3");
        test.assert(go.Point.intersectingLineSegments(tr.x, tr.y, tl.x, tl.y, tl.x+1, tl.y+1, tl.x+1, tl.y-1) === true, "+ 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tr.x, tr.y, tl.x+1, tl.y, tl.x+1, bl.y) === true, "T");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tr.x, tr.y, tl.x+1, bl.y, tl.x+1, tl.y) === true, "T 2");
        test.assert(go.Point.intersectingLineSegments(tr.x, tr.y, tl.x, tl.y, tl.x+1, tl.y, tl.x+1, bl.y) === true, "T 3");
        test.assert(go.Point.intersectingLineSegments(tr.x, tr.y, tl.x, tl.y, tl.x+1, bl.y, tl.x+1, tl.y) === true, "T 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, br.x, br.y, br.x+99, br.y-99) === true, "V");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, br.x+99, br.y-99, br.x, br.y) === true, "V 2");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, br.x, br.y, br.x+99, br.y-99) === true, "V 3");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, br.x+99, br.y-99, br.x, br.y) === true, "V 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, tr.x, tr.y, tr.x+2, tr.y+2) === false, "parallel");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, tr.x+2, tr.y+2, tr.x, tr.y) === false, "parallel 2");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, tr.x, tr.y, tr.x+2, tr.y+2) === false, "parallel 3");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, tr.x+2, tr.y+2, tr.x, tr.y) === false, "parallel 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, tl.x+1.1, tl.y+1, tr.x, tr.y) === false, "doesn't quite intersect");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, br.x, br.y, tr.x, tr.y, tl.x+1.1, tl.y+1) === false, "doesn't quite intersect 2");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, tl.x+1.1, tl.y+1, tr.x, tr.y) === false, "doesn't quite intersect 3");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, tl.x, tl.y, tr.x, tr.y, tl.x+1.1, tl.y+1) === false, "doesn't quite intersect 4");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tl.x, tl.y, tl.x, tl.y, br.x, br.y) === true, "degenerate at start");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, br.x, br.y, tr.x, tr.y, br.x, br.y) === true, "degenerate at end");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tl.x, tl.y, br.x, br.y, tl.x, tl.y) === true, "degenerate at start 2");
        test.assert(go.Point.intersectingLineSegments(br.x, br.y, br.x, br.y, br.x, br.y, tr.x, tr.y) === true, "degenerate at end 2");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tl.x, tl.y, tl.x, tl.y, tl.x, tl.y) === true, "both degenerate same point");
        test.assert(go.Point.intersectingLineSegments(tl.x, tl.y, tl.x, tl.y, bl.x, bl.y, bl.x, bl.y) === false, "both degenerate different point");
      }
    ));


    // Rect:
    var rects = new TestCollection('Rect');
    geom.add(rects);

    //constructor tests
    rects.add(new Test('constructor', null,
    function (test) {
        test.rect1 = new go.Rect();
        test.rect2 = new go.Rect(new go.Point(1, 1), new go.Point(10, 20));
        test.rect3 = new go.Rect(new go.Point(1, 1), new go.Size(9, 19));
        test.rect4 = new go.Rect(1, 1, 9, 19);
    },
    null,
    function (test) {
        test.assert(test.rect1.isEmpty(), 'default constructor doesn\'t create empty rectangle');
        test.assert(test.rect2.x === 1 && test.rect2.y === 1, 'incorrect top-left point from constructor 2');
        test.assert(test.rect2.width === 9 && test.rect2.height === 19, 'incorrect width or height from constructor 3');
        test.assert(test.rect3.x === 1 && test.rect3.y === 1, 'incorrect top-left point from constructor 3');
        test.assert(test.rect3.width === 9 && test.rect3.height === 19, 'incorrect width or height from constructor 3');
        test.assert(test.rect4.x === 1 && test.rect4.y === 1, 'incorrect top-left point from constructor 4');
        test.assert(test.rect4.width === 9 && test.rect4.height === 19, 'incorrect width or height from constructor 4');
        try {
            new go.Rect(5, 5, -5, -5);
            if (go.Debug) test.assert(false, 'constructor doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            new go.Rect(5, 5, a, e);
            if (go.Debug) test.assert(false, 'constructor doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //add Margin test
    rects.add(new Test('addMargin', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 0, 0);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
        test.rect4 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.addMargin(new go.Margin(3, 3, 3, 3));
        test.rect2.addMargin(new go.Margin(3, 3, 3, 3));
        test.rect3.addMargin(new go.Margin(-1, -1, -1, -1));
        test.rect4.addMargin(new go.Margin(-3, -3, -3, -3));
    },
    function (test) {
        test.assert(test.rect1.equalTo(2, 2, 6, 6), 'margin not properly added to rect size 0,0');
        test.assert(test.rect2.equalTo(2, 2, 11, 11), 'margin not properly added to rect size 5,5');
        test.assert(test.rect3.equalTo(6, 6, 3, 3), 'negative margin not properly added to rect');
        test.assert(test.rect4.equalTo(7.5, 7.5, 0, 0), 'rectangle should not be shrunk beyond (0, 0) when adding negative margin');
    }
    ));

    //Rect.contains test
    rects.add(new Test('Rect.contains', null,
    null,
    null,
    function (test) {
        test.assert(go.Rect.contains(1, 1, 9, 19, 5, 5), 'test point coordinates not included when inside rect');
        test.assert(!go.Rect.contains(1, 1, 9, 19, 50, 50), 'test point coordinates included when outside rect');
        test.assert(go.Rect.contains(1, 1, 9, 19, 1, 1), 'test point coordinates not included when on the top-left corner');
        test.assert(go.Rect.contains(1, 1, 9, 19, 10, 20), 'test point coordingats not included when on the bottom-right corner');
        test.assert(go.Rect.contains(1, 1, 0, 0, 1, 1), 'test point coordinates not included when on rect with width and height of 0');
        test.assert(go.Rect.contains(1, 1, 9, 19, 2, 2, 5, 5), 'test rect coordinates not included when inside rect');
        test.assert(!go.Rect.contains(1, 1, 9, 19, 20, 30, 5, 5), 'test rect coordinates included when outside rect');
        test.assert(go.Rect.contains(1, 1, 9, 19, 1, 1, 5, 5), 'test rect coordinates not included when on the top-left corner');
        test.assert(go.Rect.contains(1, 1, 9, 19, 5, 15, 5, 5), 'test rect coordingats not included when on the bottom-right corner');
        test.assert(go.Rect.contains(1, 1, 9, 19, 1, 1, 9, 19), 'test rect coordinates not included when same siae and pos as rect');
        test.assert(!go.Rect.contains(1, 1, 9, 19, 2, 2, 15, 15), 'test rect coordinates included when overlaping rect');
        test.assert(!go.Rect.contains(1, 1, 9, 19, 0, 0, 11, 21), 'test rect coordinates included when it contains rect');
        test.assert(go.Rect.contains(1, 1, 0, 0, 1, 1, 0, 0), 'test rect coordinates not included when on rect with width and height of 0');
        try {
            go.Rect.contains(1, 1, -1, -1, 0, 0, -1, -1);
            if (go.Debug) test.assert(false, 'Rect.contains doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            go.Rect.contains(5, 5, a, e, 5, 5, i, o);
            if (go.Debug) test.assert(false, 'Rect.contains doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //contains Point test
    rects.add(new Test('containsPoint', null,
    function (test) {
        test.rect1 = new go.Rect(1, 1, 9, 19);
        test.rect2 = new go.Rect(1, 1, 0, 0);
    },
    null,
    function (test) {
        test.assert(test.rect1.containsPoint(new go.Point(5, 5)), 'test point not included when inside rect');
        test.assert(test.rect1.contains(5, 5), 'test point coordinates not included when inside rect');
        test.assert(!test.rect1.containsPoint(new go.Point(50, 50)), 'test point included when outside rect');
        test.assert(!test.rect1.contains(50, 50), 'test point coordinates included when outside rect');
        test.assert(test.rect1.containsPoint(new go.Point(1, 1)), 'test point not included when on the top-left corner');
        test.assert(test.rect1.contains(1, 1), 'test point coordinates not included when on the top-left corner');
        test.assert(test.rect1.containsPoint(new go.Point(10, 20)), 'test point not included when on the bottom-right corner');
        test.assert(test.rect1.contains(10, 20), 'test point coordingats not included when on the bottom-right corner');
        test.assert(test.rect2.containsPoint(new go.Point(1, 1)), 'test point not included when on rect with width and height of 0');
        test.assert(test.rect2.contains(1, 1), 'test point coordinates not included when on rect with width and height of 0');
        try {
            test.rect1.contains(a, e);
            if (go.Debug) test.assert(false, 'containsPoint doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //contains Rect test
    rects.add(new Test('containsRect', null,
    function (test) {
        test.rect1 = new go.Rect(1, 1, 9, 19);
        test.rect2 = new go.Rect(1, 1, 0, 0);
    },
    null,
    function (test) {
        test.assert(test.rect1.containsRect(new go.Rect(2, 2, 5, 5)), 'test rect not included when inside rect');
        test.assert(test.rect1.contains(2, 2, 5, 5), 'test rect coordinates not included when inside rect');
        test.assert(!test.rect1.containsRect(new go.Rect(20, 30, 5, 5)), 'test rect included when outside rect');
        test.assert(!test.rect1.contains(20, 30, 5, 5), 'test rect coordinates included when outside rect');
        test.assert(test.rect1.containsRect(new go.Rect(1, 1, 5, 5)), 'test rect not included when on the top-left corner');
        test.assert(test.rect1.contains(1, 1, 5, 5), 'test rect coordinates not included when on the top-left corner');
        test.assert(test.rect1.containsRect(new go.Rect(5, 15, 5, 5)), 'test rect not included when on the bottom-right corner');
        test.assert(test.rect1.contains(5, 15, 5, 5), 'test rect coordingats not included when on the bottom-right corner');
        test.assert(test.rect1.containsRect(new go.Rect(1, 1, 9, 19)), 'test rect not included when same size and pos as rect');
        test.assert(test.rect1.contains(1, 1, 9, 19), 'test rect coordinates not included when same size and pos as rect');
        test.assert(!test.rect1.containsRect(new go.Rect(2, 2, 15, 15)), 'test rect included when overlaping rect');
        test.assert(!test.rect1.contains(2, 2, 15, 15), 'test rect coordinates included when overlaping rect');
        test.assert(!test.rect1.containsRect(new go.Rect(0, 0, 11, 21)), 'test rect included when it contains rect');
        test.assert(!test.rect1.contains(0, 0, 11, 21), 'test rect coordinates included when it contains rect');
        test.assert(test.rect2.containsRect(new go.Rect(1, 1, 0, 0)), 'test rect not included when on rect with width and height of 0');
        test.assert(test.rect2.contains(1, 1, 0, 0), 'test rect coordinates not included when on rect with width and height of 0');
        try {
            go.Rect.contains(1, 1, -1, -1);
            if (go.Debug) test.assert(false, 'containsRect doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.rect1.contains(a, e, i, o);
            if (go.Debug) test.assert(false, 'containsRect doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //copy test
    rects.add(new Test('copy', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = test.rect1.copy();
        test.rect3 = new go.Rect(10, 10, 10, 10);
        test.rect4 = test.rect3.copy();
    },
    function (test) {
        test.rect1.grow(3, 3, 3, 3);
        test.rect4.grow(3, 3, 3, 3);
    },
    function (test) {
        test.assert(test.rect2.width === 5 && test.rect2.height === 5,
            'copy changes when original is changed');
        test.assert(test.rect3.width === 10 && test.rect3.height === 10,
            'original changes when copy is changed');
    }
    ));

    //equals test
    rects.add(new Test('equals', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
    },
    null,
    function (test) {
        test.assert(test.rect1.equals(new go.Rect(5, 5, 5, 5)),
            'equals does not properly identify two identical rects as equal');
        test.assert(test.rect1.equalTo(5, 5, 5, 5),
            'equalTo does not identify two identical rects as equal');
        test.assert(test.rect1.equals(test.rect1),
            'equals does not identify itself as an equal rect');
        test.assert(!test.rect1.equals(new go.Rect(5, 5, 10, 10)),
            'equals identifies two different rects as equal');
        test.assert(!test.rect1.equalTo(5, 5, 10, 10),
            'equalTo identifies two different rects as equal');
    }
    ));

    //grow test
    rects.add(new Test('grow', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 0, 0);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
        test.rect4 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.grow(3, 3, 3, 3);
        test.rect2.grow(3, 3, 3, 3);
        test.rect3.grow(-1, -1, -1, -1);
        test.rect4.grow(-3, -3, -3, -3);

    },
    function (test) {
        test.assert(test.rect1.equalTo(2, 2, 6, 6), 'rect size 0,0 not properly grown on all sides');
        test.assert(test.rect2.equalTo(2, 2, 11, 11), 'rect size 5,5 not properly grown on all sides');
        test.assert(test.rect3.equalTo(6, 6, 3, 3), 'rect not properly shrunk on all sides');
        test.assert(test.rect4.equalTo(7.5, 7.5, 0, 0), 'rect should not be shrunk beyond (0, 0)');
        try {
            test.rect4.copy().grow(a, e, i, o);
            if (go.Debug) test.assert(false, 'grow doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //inflate test
    rects.add(new Test('inflate', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
        test.rect4 = new go.Rect(5, 5, 5, 5);
        test.rect5 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.inflate(4, 4);
        test.rect2.inflate(-2, -2);
        test.rect3.inflate(3.5, 3.5);
        test.rect4.inflate(0, 0);
        test.rect5.inflate(-4, -4);
    },
    function (test) {
        test.assert(test.rect1.equalTo(1, 1, 13, 13), 'rect not properly inflated');
        test.assert(test.rect2.equalTo(7, 7, 1, 1), 'rect not properly deflated');
        test.assert(test.rect3.equalTo(1.5, 1.5, 12, 12), 'rect not properly inflated with non-whole numbers');
        test.assert(test.rect4.equalTo(5, 5, 5, 5), 'rect size changes when inflated by (0, 0)');
        test.assert(test.rect5.equalTo(7.5, 7.5, 0, 0), 'rect should not be deflated beyond (0, 0)');
        try {
            test.rect5.inflate(a, e, i, o);
            if (go.Debug) test.assert(false, 'inflate doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //intersect test
    rects.add(new Test('intersect', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
    },
    null,
    function (test) {
        test.assert(test.rect1.copy().intersectRect(new go.Rect(8, 8, 5, 5)).equalTo(8, 8, 2, 2),
        'intersectRect method doesn\'t return proper intersection for intersecting rects');
        test.assert(test.rect1.copy().intersect(8, 8, 5, 5).equalTo(8, 8, 2, 2),
        'intersect method doesn\'t return proper intersection for intersecting rects');
        test.assert(test.rect1.copy().intersectRect(new go.Rect(15, 15, 5, 5)).equalTo(15, 15, 0, 0),
        'intersectRect method doesn\'t return proper intersection (rect size 0,0) for non-intersecting rects');
        test.assert(test.rect1.copy().intersect(15, 15, 5, 5).equalTo(15, 15, 0, 0),
        'intersect method doesn\'t return proper intersection (rect size 0,0) for non-intersecting rects');
        test.assert(test.rect1.copy().intersectRect(new go.Rect(10, 6, 5, 5)).equalTo(10, 6, 0, 4),
        'intersectRect method doesn\'t return proper intersection (border line) for rects whose borders touch');
        test.assert(test.rect1.copy().intersect(10, 6, 5, 5).equalTo(10, 6, 0, 4),
        'intersect method doesn\'t return proper intersection (border line) for rects whose borders touch');
        test.assert(test.rect1.copy().intersectRect(new go.Rect(10, 10, 5, 5)).equalTo(10, 10, 0, 0),
        'intersectRect method doesn\'t return proper intersection (corner point) for rects whose corners touch');
        test.assert(test.rect1.copy().intersect(10, 10, 5, 5).equalTo(10, 10, 0, 0),
        'intersect method doesn\'t return proper intersection (corner point) for rects whose corners touch');
        test.assert(test.rect1.copy().intersectRect(new go.Rect(4, 4, 7, 7)).equalTo(5, 5, 5, 5),
        'intersectRect method doesn\'t return proper intersection (original rect) for a rect that is contained by another');
        test.assert(test.rect1.copy().intersect(4, 4, 7, 7).equalTo(5, 5, 5, 5),
        'intersect method doesn\'t return proper intersection (original rect) for a rect that is contained by another');
        test.assert(test.rect1.copy().intersectRect(new go.Rect(6, 6, 3, 3)).equalTo(6, 6, 3, 3),
        'intersectRect method doesn\'t return proper intersection (smaller rect) for a rect that contains another');
        test.assert(test.rect1.copy().intersect(6, 6, 3, 3).equalTo(6, 6, 3, 3),
        'intersect method doesn\'t return proper intersection (smaller rect) for a rect that contains another');
        try {
            test.rect1.intersect(5, 5, -5, -5);
            if (go.Debug) test.assert(false, 'intersect doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.rect1.intersect(a, e, i, o);
            if (go.Debug) test.assert(false, 'intersect doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Rect.intersects test
    rects.add(new Test('Rect.intersects', null,
    null,
    null,
    function (test) {
        test.assert(go.Rect.intersects(5, 5, 5, 5, 8, 8, 5, 5),
        'intersects method states that intersecting rects don\'t intersect');
        test.assert(!go.Rect.intersects(5, 5, 5, 5, 15, 15, 5, 5),
        'intersects method states that non-intersecting rects do intersect');
        test.assert(go.Rect.intersects(5, 5, 5, 5, 10, 6, 5, 5),
        'intersects method states that rects whose borders touch don\'t intersect');
        test.assert(go.Rect.intersects(5, 5, 5, 5, 10, 10, 5, 5),
        'intersects method states that rects whose corners touch don\'t intersect');
        test.assert(go.Rect.intersects(5, 5, 5, 5, 4, 4, 7, 7),
        'intersects method states that a rect that is contained by another doesn\'t intersect it');
        test.assert(go.Rect.intersects(5, 5, 5, 5, 6, 6, 3, 3),
        'intersects method states that a rect that contains another doesn\'t intersect it');
        try {
            go.Rect.intersects(1, 1, -1, -1, 0, 0, -1, -1);
            if (go.Debug) test.assert(false, 'Rect.intersects doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            go.Rect.intersects(5, 5, a, e, 5, 5, i, o);
            if (go.Debug) test.assert(false, 'Rect.intersects doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //intersects test
    rects.add(new Test('intersects', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
    },
    null,
    function (test) {
        test.assert(test.rect1.intersectsRect(new go.Rect(8, 8, 5, 5)),
        'intersectsRect method states that intersecting rects don\'t intersect');
        test.assert(test.rect1.intersects(8, 8, 5, 5),
        'intersects method states that intersecting rects don\'t intersect');
        test.assert(!test.rect1.intersectsRect(new go.Rect(15, 15, 5, 5)),
        'intersectsRect method states that non-intersecting rects do intersect');
        test.assert(!test.rect1.intersects(15, 15, 5, 5),
        'intersects method states that non-intersecting rects do intersect');
        test.assert(test.rect1.intersectsRect(new go.Rect(10, 6, 5, 5)),
        'intersectsRect method states that rects whose borders touch don\'t intersect');
        test.assert(test.rect1.intersects(10, 6, 5, 5),
        'intersects method states that rects whose borders touch don\'t intersect');
        test.assert(test.rect1.intersectsRect(new go.Rect(10, 10, 5, 5)),
        'intersectsRect method states that rects whose corners touch don\'t intersect');
        test.assert(test.rect1.intersects(10, 10, 5, 5),
        'intersects method states that rects whose corners touch don\'t intersect');
        test.assert(test.rect1.intersectsRect(new go.Rect(4, 4, 7, 7)),
        'intersectsRect method states that a rect that is contained by another doesn\'t intersect it');
        test.assert(test.rect1.intersects(4, 4, 7, 7),
        'intersects method states that a rect that is contained by another doesn\'t intersect it');
        test.assert(test.rect1.intersectsRect(new go.Rect(6, 6, 3, 3)),
        'intersectsRect method states that a rect that contains another doesn\'t intersect it');
        test.assert(test.rect1.intersects(6, 6, 3, 3),
        'intersects method states that a rect that contains another doesn\'t intersect it');
        try {
            test.rect1.intersects(5, 5, -5, -5);
            if (go.Debug) test.assert(false, 'intersects doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.rect1.intersects(a, e, i, o);
            if (go.Debug) test.assert(false, 'intersects doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //offset test
    rects.add(new Test('offset', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
        test.rect4 = new go.Rect(5, 5, 5, 5);
        test.rect5 = new go.Rect(5, 5, 5, 5);

    },
    function (test) {
        test.rect1.offset(3, 3);
        test.rect2.offset(-3, -3);
        test.rect3.offset(3, -3);
        test.rect4.offset(0, 0);
        test.rect5.offset(3, 0);
    },
    function (test) {
        test.assert(test.rect1.position.equals(new go.Point(8, 8)),
            'offset method with positive numbers didn\'t move correctly');
        test.assert(test.rect2.position.equals(new go.Point(2, 2)),
            'offset method with negative numbers didn\'t move correctly');
        test.assert(test.rect3.position.equals(new go.Point(8, 2)),
            'offset method with positive and negative numbers didn\'t move correctly');
        test.assert(test.rect4.position.equals(new go.Point(5, 5)),
            'offset method with zero numbers didn\'t move correctly');
        test.assert(test.rect5.position.equals(new go.Point(8, 5)),
            'offset method with zero and positive numbers didn\'t move correctly');
        try {
            test.rect1.offset(a, e);
            if (go.Debug) test.assert(false, 'offset doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //Rect.parse test
    rects.add(new Test('parse', null,
    function (test) {
        test.rect1 = new go.Rect();
    },
    null,
    function (test) {
        test.assert(go.Rect.parse("5 5 5 5").equalTo(5, 5, 5, 5),
        'parse does not create proper rect from given string with size dimensions');
        test.assert(go.Rect.parse("5 5 0 0").equalTo(5, 5, 0, 0),
        'parse does not create proper rect from given string with size(0, 0)');
        //        try {
        //            go.Rect.parse("5 5");
        //            test.assert(false, 'Rect.parse doesn\'t throw error for having incorrect string input');
        //        }
        //        catch (err) {
        //        }
        try {
            go.Rect.parse("5 5 -5 -5");
            if (go.Debug) test.assert(false, 'Rect.parse doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.rect1.set(go.Rect.parse("a e i o"));
            if (go.Debug) test.assert(!test.rect1.isReal(), 'Rect.parse doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //set test
    rects.add(new Test('set', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.set(new go.Rect(10, 10, 10, 10));
        test.rect2.set(new go.Rect(10, 10, 0, 0));
        test.rect3.set(new go.Rect(5, 5, 5, 5));
    },
    function (test) {
        test.assert(test.rect1.equals(new go.Rect(10, 10, 10, 10)),
            'set method with all new values did not work correctly');
        test.assert(test.rect2.equals(new go.Rect(10, 10, 0, 0)),
            'set method with size (0,0) did not work correctly');
        test.assert(test.rect3.equals(new go.Rect(5, 5, 5, 5)),
            'set method with same values did not work correctly');
    }
    ));

    //setSpot test
    rects.add(new Test('setSpot', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
        test.rect4 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.setSpot(5, 5, new go.Spot(.5, .5, 0, 0));
        test.rect2.setSpot(5, 5, new go.Spot(.5, .5, 1.5, 1.5));
        test.rect3.setSpot(6, 6, new go.Spot(.2, .2, 0, 0));
        test.rect4.setSpot(7, 7, new go.Spot(0, 0, 0, 0));
    },
    function (test) {
        test.assert(test.rect1.equals(new go.Rect(2.5, 2.5, 5, 5)),
    'setSpot method does not end up in right location with no offset on spot');
        test.assert(test.rect2.equals(new go.Rect(1, 1, 5, 5)),
    'setSpot method does not end up in right location with offset on spot');
        test.assert(test.rect3.equals(new go.Rect(5, 5, 5, 5)),
    'setSpot method does not end up in same starting location');
        test.assert(test.rect4.equals(new go.Rect(7, 7, 5, 5)),
    'setSpot method does not end up in right location when given spot in top-left corner');
    }
    ));

    //Rect.stringify test
    rects.add(new Test('Rect.stringify', null,
    null,
    null,
    function (test) {
        test.assert(go.Rect.stringify(new go.Rect(5, 5, 5, 5)) === "5 5 5 5",
        'Stringify does not return proper string for standard rectangle');
        test.assert(go.Rect.stringify(new go.Rect(5, 5, 0, 0)) === "5 5 0 0",
        'Stringify does not return proper string for rectangle size 0x0');
    }
    ));

    //Rect.stringifyFixed test
    rects.add(new Test('Rect.stringifyFixed', null,
    null,
    function (test) {
        test.assert(go.Rect.stringifyFixed(0)(new go.Rect(-4.9, -5.1, 4.9, 5.1)) === "-5 -5 5 5",
        'StringifyFixed does not return proper string for 0 digits');
        test.assert(go.Rect.stringifyFixed(1)(new go.Rect(-4.99, -5.01, 4.99, 5.01)) === "-5.0 -5.0 5.0 5.0",
        'StringifyFixed does not return proper string for 1 digit');
        test.assert(go.Rect.stringifyFixed(2)(new go.Rect(-3.456, -2.345, 3.456, 2.345)) === "-3.46 -2.35 3.46 2.35",
        'StringifyFixed does not return proper string for 2 digits');
    }
    ));

    //subtract Margin test
    rects.add(new Test('subtractMargin', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
        test.rect2 = new go.Rect(5, 5, 5, 5);
        test.rect3 = new go.Rect(5, 5, 5, 5);
    },
    function (test) {
        test.rect1.subtractMargin(new go.Margin(3, 3, 3, 3));
        test.rect2.subtractMargin(new go.Margin(2, 2, 2, 2));
        test.rect3.subtractMargin(new go.Margin(-3, -3, -3, -3));
    },
    function (test) {
        test.assert(test.rect1.equalTo(7.5, 7.5, 0, 0), 'rect should not be shrunk beyond (0, 0) when subtracting margin');
        test.assert(test.rect2.equalTo(7, 7, 1, 1), 'margin not properly subtracted from rect');
        test.assert(test.rect3.equalTo(2, 2, 11, 11), 'negative margin not properly subrtacted from rect');
    }
    ));

    //unionPoint test
    rects.add(new Test('unionPoint', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
    },
    null,
    function (test) {
        test.assert(test.rect1.copy().unionPoint(new go.Point(13, 13)).equalTo(5, 5, 8, 8),
    'unionPoint does not modify rect to proper size when point is at a greater position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().union(13, 13).equalTo(5, 5, 8, 8),
    'union does not modify rect to proper size when point is at a greater position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().unionPoint(new go.Point(2, 2)).equalTo(2, 2, 8, 8),
    'unionPoint does not modify rect to proper size when point is at a lesser position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().union(2, 2).equalTo(2, 2, 8, 8),
    'union does not modify rect to proper size when point is at a lesser position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().unionPoint(new go.Point(13, 7)).equalTo(5, 5, 8, 5),
    'unionPoint does not modify rect to proper size when point is at a greater position in the X dimension outside rect');
        test.assert(test.rect1.copy().union(13, 7).equalTo(5, 5, 8, 5),
    'union does not modify rect to proper size when point is at a greater position in the X dimension outside rect');
        test.assert(test.rect1.copy().unionPoint(new go.Point(7, 13)).equalTo(5, 5, 5, 8),
    'unionPoint does not modify rect to proper size when point is at a greater position in the Y dimension outside rect');
        test.assert(test.rect1.copy().union(7, 13).equalTo(5, 5, 5, 8),
    'union does not modify rect to proper size when point is at a greater position in the Y dimension outside rect');
        test.assert(test.rect1.copy().unionPoint(new go.Point(7, 7)).equalTo(5, 5, 5, 5),
    'unionPoint does not stay the same size when the point is inside rect');
        test.assert(test.rect1.copy().union(7, 7).equalTo(5, 5, 5, 5),
    'union does not stay the same size when the point is inside rect');
        test.assert(test.rect1.copy().unionPoint(new go.Point(5, 5)).equalTo(5, 5, 5, 5),
    'unionPoint does not stay the same size when the point is on the corner of the rect');
        test.assert(test.rect1.copy().union(5, 5).equalTo(5, 5, 5, 5),
    'union does not stay the same size when the point is on the corner of the rect');
        try {
            test.rect1.copy().union(a, e);
            if (go.Debug) test.assert(false, 'union does not throw error for NaN');
        }
        catch (err) {
        }
    }));

    //unionRect test
    rects.add(new Test('unionRect', null,
    function (test) {
        test.rect1 = new go.Rect(5, 5, 5, 5);
    },
    null,
    function (test) {
        test.assert(test.rect1.copy().unionRect(new go.Rect(12, 12, 3, 3)).equalTo(5, 5, 10, 10),
    'unionRect does not modify rect to proper size when the new rect is at a greater position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().union(12, 12, 3, 3).equalTo(5, 5, 10, 10),
    'union does not modify rect to proper size when the new rect is at a greater position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().unionRect(new go.Rect(2, 2, 2, 2)).equalTo(2, 2, 8, 8),
    'unionRect does not modify rect to proper size when the new rect is at a lesser position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().union(2, 2, 2, 2).equalTo(2, 2, 8, 8),
    'union does not modify rect to proper size when the new rect is at a lesser position in 2 dimensions outside rect');
        test.assert(test.rect1.copy().unionRect(new go.Rect(12, 7, 3, 3)).equalTo(5, 5, 10, 5),
    'unionRect does not modify rect to proper size when the new rect is at a greater position in the X dimension outside rect');
        test.assert(test.rect1.copy().union(12, 7, 3, 3).equalTo(5, 5, 10, 5),
    'union does not modify rect to proper size when the new rect is at a greater position in the X dimension outside rect');
        test.assert(test.rect1.copy().unionRect(new go.Rect(7, 12, 3, 3)).equalTo(5, 5, 5, 10),
    'unionRect does not modify rect to proper size when the new rect is at a greater position in the Y dimension outside rect');
        test.assert(test.rect1.copy().union(7, 12, 3, 3).equalTo(5, 5, 5, 10),
    'union does not modify rect to proper size when the new rect is at a greater position in the Y dimension outside rect');
        test.assert(test.rect1.copy().unionRect(new go.Rect(7, 7, 2, 2)).equalTo(5, 5, 5, 5),
    'unionRect does not stay the same size when the new rect is inside rect');
        test.assert(test.rect1.copy().union(7, 7, 2, 2).equalTo(5, 5, 5, 5),
    'union does not stay the same size when the new rect is inside rect');
        test.assert(test.rect1.copy().unionRect(new go.Rect(2, 2, 12, 12)).equalTo(2, 2, 12, 12),
    'unionRect does not stay the same size when rect is inside the new rect');
        test.assert(test.rect1.copy().union(2, 2, 12, 12).equalTo(2, 2, 12, 12),
    'union does not stay the same size when rect is inside the new rect')
        test.assert(test.rect1.copy().unionRect(new go.Rect(7, 7, 5, 5)).equalTo(5, 5, 7, 7),
    'unionRect does not modify rect to proper size when the new rect is half-in half out of rect');
        test.assert(test.rect1.copy().union(7, 7, 5, 5).equalTo(5, 5, 7, 7),
    'union does not modify rect to proper size when the new rect is half-in half out of rect');
        try {
            test.rect1.copy().union(5, 5, -3, -3);
            if (go.Debug) test.assert(false, 'union does not throw error for negative width/height');
        }
        catch (err) {
        } try {
            test.rect1.copy().union(a, e, i, o);
            if (go.Debug) test.assert(false, 'union does not throw error for NaN');
        }
        catch (err) {
        }
    }));

    // Size:
    var sizes = new TestCollection('Size');
    geom.add(sizes);

    //constructor tests
    sizes.add(new Test('constructor', null,
    function (test) {
        test.size1 = new go.Size();
        test.size2 = new go.Size(0, 0);
        test.size3 = new go.Size(5, 5);
    },
    null,
    function (test) {
        test.assert(test.size1.width === 0 && test.size1.height === 0, 'default constructor doesn\'t create size(0, 0)');
        test.assert(test.size2.width === 0 && test.size2.height === 0, 'constructor input (0, 0) doesn\'t create size(0, 0)');
        test.assert(test.size3.width === 5 && test.size3.height === 5, 'constructor input (5, 5) doesn\'t create size(5, 5)');
        try {
            new go.Size(-5, -5);
            if (go.Debug) test.assert(false, 'constructor doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.size4 = new go.Rect(a, e);
            if (go.Debug) test.assert(false, 'constructor doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //copy test
    sizes.add(new Test('copy', null,
    function (test) {
        test.size1 = new go.Size(5, 5);
        test.size2 = test.size1.copy();
        test.size3 = new go.Size(10, 10);
        test.size4 = test.size3.copy();
    },
    function (test) {
        test.size1.width = 7;
        test.size1.height = 7;
        test.size4.width = 13;
        test.size4.height = 13;
    },
    function (test) {
        test.assert(test.size2.width === 5 && test.size2.height === 5,
            'copy changes when original is changed');
        test.assert(test.size3.width === 10 && test.size3.height === 10,
            'original changes when copy is changed');
    }
    ));

    //equals test
    sizes.add(new Test('equals', null,
    function (test) {
        test.size1 = new go.Size(5, 5);
    },
    null,
    function (test) {
        test.assert(test.size1.equals(new go.Size(5, 5)),
            'equals does not properly identify two identical sizes as equal');
        test.assert(test.size1.equalTo(5, 5),
            'equalTo does not identify two identical sizes as equal');
        test.assert(test.size1.equals(test.size1),
            'equals does not identify itself as an equal size');
        test.assert(!test.size1.equals(new go.Size(10, 10)),
            'equals identifies two different sizes as equal');
        test.assert(!test.size1.equalTo(10, 10),
            'equalTo identifies two different sizes as equal');
    }
    ));

    //Size.parse test
    sizes.add(new Test('parse', null,
    function (test) {
        test.size1 = new go.Size();
    },
    null,
    function (test) {
        test.assert(go.Size.parse("5 5").equalTo(5, 5),
        'Size.parse does not create proper size from given string with size dimensions');
        test.assert(go.Size.parse("0 0").equalTo(0, 0),
        'Size.parse does not create proper size from given string with size(0, 0)');
        //        try {
        //            go.Size.parse("5");
        //            test.assert(false, 'Size.parse doesn\'t throw error for having incorrect string input');
        //        }
        //        catch (err) {
        //        }
        try {
            go.Size.parse("-5 -5");
            if (go.Debug) test.assert(false, 'Size.parse doesn\'t throw error for negative width/height');
        }
        catch (err) {
        }
        try {
            test.size1.set(go.Size.parse("a e"));
            if (go.Debug) test.assert(!test.size1.isReal(), 'Size.parse doesn\'t throw error for NaN');
        }
        catch (err) {
        }
    }
    ));

    //set test
    sizes.add(new Test('set', null,
    function (test) {
        test.size1 = new go.Size(5, 5);
        test.size2 = new go.Size(5, 5);
        test.size3 = new go.Size(5, 5);
    },
    function (test) {
        test.size1.set(new go.Size(10, 10));
        test.size2.set(new go.Size(0, 0));
        test.size3.set(new go.Size(5, 5));
    },
    function (test) {
        test.assert(test.size1.equals(new go.Size(10, 10)),
            'set method with all new values did not work correctly');
        test.assert(test.size2.equals(new go.Size(0, 0)),
            'set method with size (0,0) did not work correctly');
        test.assert(test.size3.equals(new go.Size(5, 5)),
            'set method with same values did not work correctly');
    }
    ));

    //Size.stringify test
    sizes.add(new Test('Size.stringify', null,
    null,
    null,
    function (test) {
        test.assert(go.Size.stringify(new go.Size(5, 5)) === "5 5",
        'Stringify does not return proper string for standard size');
        test.assert(go.Size.stringify(new go.Size()) === "0 0",
        'Stringify does not return proper string for Size(0, 0)');
    }
    ));

    //Size.stringifyFixed test
    rects.add(new Test('Size.stringifyFixed', null,
    null,
    function (test) {
        test.assert(go.Size.stringifyFixed(0)(new go.Size(4.9, 5.1)) === "5 5",
        'StringifyFixed does not return proper string for 0 digits');
        test.assert(go.Size.stringifyFixed(1)(new go.Size(4.99, 5.01)) === "5.0 5.0",
        'StringifyFixed does not return proper string for 1 digit');
        test.assert(go.Size.stringifyFixed(2)(new go.Size(3.456, 2.345)) === "3.46 2.35",
        'StringifyFixed does not return proper string for 2 digits');
    }
    ));

    //inflate test
    sizes.add(new Test('inflate', null,
    function (test) {
        test.size1 = new go.Size(5, 5);
        test.size2 = new go.Size(5, 5);
        test.size3 = new go.Size(5, 5);
        test.size4 = new go.Size(5, 5);
        test.size5 = new go.Size(5, 5);
      },
    function (test) {
        test.size1.inflate(4, 4);
        test.size2.inflate(-2, -2);
        test.size3.inflate(3.5, 3.5);
        test.size4.inflate(0, 0);
        test.size5.inflate(-8, -8);
      },
    function (test) {
        test.assert(test.size1.equalTo(9, 9), 'size not properly inflated');
        test.assert(test.size2.equalTo(3, 3), 'size not properly deflated');
        test.assert(test.size3.equalTo(8.5, 8.5), 'size not properly inflated with non-whole numbers');
        test.assert(test.size4.equalTo(5, 5), 'size changes when inflated by (0, 0)');
        test.assert(test.size5.equalTo(0, 0), 'size should not be deflated beyond (0, 0)');
        try {
          test.size5.inflate(a, e);
          if (go.Debug) test.assert(false, 'inflate doesn\'t throw error for NaN');
        } catch (err) {
        }
      }
    ));


  // Margin :
  var margins = new TestCollection('Margin');
  geom.add(margins);

  //constructor tests
  margins.add(new Test('constructor', null,
    function(test) {
      test.margin1 = new go.Margin();
      test.margin2 = new go.Margin(1);
      test.margin3 = new go.Margin(2, 3);
      test.margin4 = new go.Margin(-4, -5, -6, -7);
    },
    null,
    function(test) {
      test.assert(test.margin1.top === 0 && test.margin1.right === 0 && test.margin1.bottom === 0 && test.margin1.left === 0, 'default constructor doesn\'t create a Margin of (0, 0, 0, 0)');
      test.assert(test.margin2.top === 1 && test.margin2.right === 1 && test.margin2.bottom === 1 && test.margin2.left === 1, 'constructor (1) doesn\'t create a Margin of (1, 1, 1, 1)');
      test.assert(test.margin3.top === 2 && test.margin3.right === 3 && test.margin3.bottom === 2 && test.margin3.left === 3, 'constructor (2, 3) doesn\'t create a Margin of (2, 3, 2, 3)');
      test.assert(test.margin4.top === -4 && test.margin4.right === -5 && test.margin4.bottom === -6 && test.margin4.left === -7, 'constructor (-4, -5, -6, -7) doesn\'t create a Margin of (-4, -5, -6, -7)');
    }
    ));

  //copy & set test
  margins.add(new Test('copy & set', null,
    function(test) {
      test.margin = new go.Margin(-4, -5, -6, -7);
    },
    null,
    function(test) {
      test.assert(test.margin.copy().set(new go.Margin(1, 2, 3, 4)).equalTo(1, 2, 3, 4),
        'Margin.set of a copy did not set values to 1, 2, 3, 4');
      test.assert(test.margin.copy().setTo(1, 2, 3, 4).equalTo(1, 2, 3, 4),
        'Margin.setTo of a copy did not set values to 1, 2, 3, 4');
      test.assert(test.margin.equalTo(-4, -5, -6, -7),
        'Margin.copy did not copy???');
    }
    ));

  //Margin.parse test
  margins.add(new Test('Margin.parse', null,
    null,
    null,
    function(test) {
      test.assert(go.Margin.parse("-4 -5 -6 -7").equalTo(-4, -5, -6, -7),
        'Margin.parse does not create proper Margin from given string -4, -5, -6, -7');
      test.assert(go.Margin.parse("2 3").equalTo(2, 3, 2, 3),
        'Margin.parse does not create proper Margin from given string 2 3');
      test.assert(go.Margin.parse("1").equalTo(1, 1, 1, 1),
        'Margin.parse does not create proper Margin from given string 1');
      test.assert(go.Margin.parse("").equalTo(0, 0, 0, 0),
        'Margin.parse does not create proper Margin from given empty string');
    }
    ));

  //Margin.stringify test
  margins.add(new Test('Margin.stringify', null,
    null,
    null,
    function(test) {
      test.assert(go.Margin.stringify(new go.Margin(-4, -5, -6, -7)) === "-4 -5 -6 -7",
        'Stringify does not return proper string for Margin(-4, -5, -6, -7)');
      test.assert(go.Margin.stringify(new go.Margin(2, 3)) === "2 3 2 3",
        'Stringify does not return proper string for Margin(2, 3)');
      test.assert(go.Margin.stringify(new go.Margin()) === "0 0 0 0",
        'Stringify does not return proper string for Margin()');
    }
    ));

    //Margin.stringifyFixed test
    rects.add(new Test('Margin.stringifyFixed', null,
    null,
    function (test) {
        test.assert(go.Margin.stringifyFixed(0)(new go.Margin(-4.9, -5.1, 4.9, 5.1)) === "-5 -5 5 5",
        'StringifyFixed does not return proper string for 0 digits');
        test.assert(go.Margin.stringifyFixed(1)(new go.Margin(-4.99, -5.01, 4.99, 5.01)) === "-5.0 -5.0 5.0 5.0",
        'StringifyFixed does not return proper string for 1 digit');
        test.assert(go.Margin.stringifyFixed(2)(new go.Margin(-3.456, -2.345, 3.456, 2.345)) === "-3.46 -2.35 3.46 2.35",
        'StringifyFixed does not return proper string for 2 digits');
    }
    ));


    // Spot:
    var spots = new TestCollection('Spot');
    geom.add(spots);

    //constructor tests
    spots.add(new Test('constructor', null,
    function(test) {
      test.spot1 = new go.Spot();
      test.spot2 = new go.Spot(0.1, 0.2);
      test.spot3 = new go.Spot(0.1, 0.2, 0.3, 0.4);
      test.spot4 = new go.Spot(0.1, 0.2, -3.4, -5.6);
    },
    null,
    function(test) {
      test.assert(test.spot1.x === 0 && test.spot1.y === 0 && test.spot1.offsetX === 0 && test.spot1.offsetY === 0, 'default constructor doesn\'t create a Spot of (0, 0, 0, 0)');
      test.assert(test.spot2.x === 0.1 && test.spot2.y === 0.2 && test.spot2.offsetX === 0 && test.spot2.offsetY === 0, 'constructor (0.1, 0.2) doesn\'t create a Spot of (0.1, 0.2, 0, 0)');
      test.assert(test.spot3.x === 0.1 && test.spot3.y === 0.2 && test.spot3.offsetX === 0.3 && test.spot3.offsetY === 0.4, 'constructor (0.1, 0.2, 0.3, 0.4) doesn\'t create a Spot of (0.1, 0.2, 0.3, 0.4)');
      test.assert(test.spot4.x === 0.1 && test.spot4.y === 0.2 && test.spot4.offsetX === -3.4 && test.spot4.offsetY === -5.6, 'constructor (0.1, 0.2, -3.4, -5.6) doesn\'t create a Spot of (0.1, 0.2, -3.4, -5.6)');
    }
    ));

    //copy & set test
    spots.add(new Test('copy & set', null,
    function(test) {
      test.spot = new go.Spot(0.1, 0.2, 0.3, 0.4);
    },
    null,
    function(test) {
      test.assert(test.spot.copy().set(new go.Spot(0.1, 0.2, -3.4, -5.6)).equals(new go.Spot(0.1, 0.2, -3.4, -5.6)),
        'spot.set of a copy did not set values to 1, 2, -3.4, -5.6');
      test.assert(test.spot.copy().setTo(0.1, 0.2, -3.4, -5.6).equals(new go.Spot(0.1, 0.2, -3.4, -5.6)),
        'spot.setTo of a copy did not set values to 0.1, 0.2, -3.4, -5.6');
      test.assert(test.spot.equals(new go.Spot(0.1, 0.2, 0.3, 0.4)),
        'spot.copy did not copy???');
    }
    ));

    //Spot.parse test
    spots.add(new Test('Spot.parse', null,
    null,
    null,
    function(test) {
      test.assert(go.Spot.parse("0.1 0.2 0.3 0.4").equals(new go.Spot(0.1, 0.2, 0.3, 0.4)),
        'Spot.parse does not create proper spot from given string 0.1, 0.2, 0.3, 0.4');
      test.assert(go.Spot.parse("0.1 0.2").equals(new go.Spot(0.1, 0.2)),
        'Spot.parse does not create proper spot from given string 0.1 0.2');
      test.assert(go.Spot.parse("").equals(new go.Spot()),
        'Spot.parse does not create proper spot from given empty string');
    }
    ));

    //Spot.stringify test
    spots.add(new Test('Spot.stringify', null,
    null,
    null,
    function(test) {
      test.assert(go.Spot.stringify(new go.Spot(0.1, 0.2, 0.3, 0.4)) === "0.1 0.2 0.3 0.4",
        'Spot.stringify does not return proper string for Spot(0.1, 0.2, 0.3, 0.4)');
      test.assert(go.Spot.stringify(new go.Spot(0.1, 0.2)) === "0.1 0.2 0 0",
        'Spot.stringify does not return proper string for Spot(0.1, 0.2)');
      test.assert(go.Spot.stringify(new go.Spot()) === "0 0 0 0",
        'Spot.stringify does not return proper string for Spot()');
    }
    ));

    //predicates test
    spots.add(new Test('predicates', null,
    null,
    null,
    function(test) {
      var s1 = new go.Spot(0.1, 0.2, 0.3, 0.4);
      test.assert(!s1.isDefault(), 'isDefault: ' + s1.toString());
      test.assert(!s1.isNoSpot(), 'isNoSpot: ' + s1.toString());
      test.assert(!s1.isSide(), 'isSide: ' + s1.toString());
      test.assert(s1.isSpot(), 'not isSpot: ' + s1.toString());
    }
    ));

    //constants test
    spots.add(new Test('constants', null,
    null,
    null,
    function(test) {
      var s;
      s = go.Spot.AllSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      test.assert(go.Spot.Bottom === go.Spot.BottomCenter, "Spot.Bottom is not a synonym for BottomCenter");
      s = go.Spot.BottomCenter; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.BottomLeft; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.BottomLeftSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.BottomRight; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.BottomRightSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.BottomSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.Center; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.Default; test.assert(s.isDefault() && s.isNoSpot() && !s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      test.assert(go.Spot.Left === go.Spot.LeftCenter, "Spot.Left is not a synonym for LeftCenter");
      s = go.Spot.LeftCenter; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.LeftRightSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.LeftSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      test.assert(go.Spot.MiddleBottom === go.Spot.BottomCenter, "Spot.MiddleBottom is not a synonym for BottomCenter");
      test.assert(go.Spot.MiddleLeft === go.Spot.LeftCenter, "Spot.LeftBottom is not a synonym for LeftCenter");
      test.assert(go.Spot.MiddleRight === go.Spot.RightCenter, "Spot.RightBottom is not a synonym for RightCenter");
      test.assert(go.Spot.MiddleTop === go.Spot.TopCenter, "Spot.TopBottom is not a synonym for TopCenter");
      s = go.Spot.None; test.assert(!s.isDefault() && s.isNoSpot() && !s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.NotBottomSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.NotLeftSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.NotRightSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.NotTopSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      test.assert(go.Spot.Right === go.Spot.RightCenter, "Spot.Right is not a synonym for RightCenter");
      s = go.Spot.RightCenter; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.RightSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      test.assert(go.Spot.Top === go.Spot.TopCenter, "Spot.Top is not a synonym for TopCenter");
      s = go.Spot.TopBottomSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopCenter; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopLeft; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopLeftSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopRight; test.assert(!s.isDefault() && !s.isNoSpot() && !s.isSide() && s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopRightSides; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
      s = go.Spot.TopSide; test.assert(!s.isDefault() && s.isNoSpot() && s.isSide() && !s.isSpot(), 'problem with: ' + s.toString());
    }
    ));

    //sides test
    spots.add(new Test('sides', null,
    null,
    null,
    function(test) {
      var s;
      function ins(x) { return s.includesSide(x); }
      s = go.Spot.AllSides; test.assert(ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.BottomLeftSides; test.assert(!ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.BottomRightSides; test.assert(!ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.BottomSide; test.assert(!ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.LeftRightSides; test.assert(!ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.LeftSide; test.assert(!ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.NotBottomSide; test.assert(ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.NotLeftSide; test.assert(ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.NotRightSide; test.assert(ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.NotTopSide; test.assert(!ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.RightSide; test.assert(!ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.TopBottomSides; test.assert(ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.TopLeftSides; test.assert(ins(go.Spot.TopSide) && ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.TopRightSides; test.assert(ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
      s = go.Spot.TopSide; test.assert(ins(go.Spot.TopSide) && !ins(go.Spot.LeftSide) && !ins(go.Spot.RightSide) && !ins(go.Spot.BottomSide), 'problem with: ' + s.toString());
    }
    ));

  //opposite test
  spots.add(new Test('opposite', null,
    null,
    null,
    function(test) {
      var s1 = new go.Spot(0.1, 0.2, 0.3, 0.4);
      test.assert(s1.opposite().equals(new go.Spot(0.9, 0.8, -0.3, -0.4)), "wrong opposite value: " + s1.opposite().toString());
    }
  ));


  // Geometry:
  var geometries = new TestCollection('Geometry');
  geom.add(geometries);

  //constructor tests
  geometries.add(new Test('constructor', null,
    function(test) {
      test.geo1 = new go.Geometry();
      test.geo2 = new go.Geometry(go.Geometry.Line);
    },
    null,
    function(test) {
      test.assert(test.geo1.type === go.Geometry.Path && test.geo1.figures.count === 0, "default Geometry constructor didn't produce empty Path Geometry");
      test.assert(test.geo2.type === go.Geometry.Line, "Geometry constructor didn't take type as argument");
    }
  ));

  geometries.add(new Test("rotate 30", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    function(test) {
      test.geo1.rotate(30);
      test.geo2.rotate(30);
      test.geo3.rotate(30);
      test.geo4.rotate(30);
      test.geo5.rotate(30);
      test.geo6.rotate(30);
    },
    function(test) {
      var result1 = go.Geometry.parse("F M0 0 L43.30127018922194 24.999999999999996 M0 0 L-49.99999999999999 86.60254037844388 M-24.999999999999996 43.30127018922194 L9.641016151377553 63.30127018922194");
      var result2 = go.Geometry.parse("F M0 0 L86.60254037844388 49.99999999999999 B75 90 71.60254037844388 75.98076211353316 45 L135.08330249197704 26.028856829700246");
      var result3 = go.Geometry.parse("F M0 0 L86.60254037844388 49.99999999999999 L90.08330249197704 103.97114317029973 A60 30 120 0 1 38.121778264910716 73.97114317029974 L86.60254037844388 49.99999999999999");
      var result4 = go.Geometry.parse("F M51.96152422706632 29.999999999999996 L69.2820323027551 39.99999999999999 B210 -180 77.94228634059948 44.99999999999999 10 L103.92304845413264 59.99999999999999 L109.6066411611138 81.21145675198156 B255 -180 112.44843751460436 91.81718512797234 10 L120.97382657507609 123.63437025594467 L110.97382657507609 140.95487833163344 B300 -180 105.97382657507609 149.61513236947783 10 L90.97382657507609 175.595894483011 L69.76236982309453 181.27948718999215 B345 -180 59.15664144710375 184.12128354348272 10 L27.339456319131386 192.6466726039544 L18.679202281287004 187.6466726039544 B29.999999999999996 -180 1.3586942055982263 177.6466726039544 20 L-24.622067907934927 162.64667260395444 L-27.463864261425513 152.04094422796365 B75 -180 -33.14745696840666 130.8294874759821 20 L-41.67284602887838 99.01230234800974 B120 -180 -26.672846028878386 73.03154023447658 30 L-11.67284602887839 47.05077812094342 B165 -180 20.144339099093955 38.525389060471696 30 L51.961524227066306 29.99999999999998z");
      var result5 = go.Geometry.parse("F M51.96152422706632 29.999999999999996 L69.2820323027551 39.99999999999999 A10 10 120 0 0 86.60254037844388 49.99999999999999 L103.92304845413264 59.99999999999999 L109.6066411611138 81.21145675198156 A10 10 165 0 0 115.29023386809494 102.42291350396313 L120.97382657507612 123.6343702559447 L110.97382657507612 140.95487833163347 A20 10 210 0 0 100.97382657507612 158.27538640732223 L90.97382657507612 175.59589448301102 L69.76236982309453 181.27948718999215 A20 10 255 0 0 48.55091307111297 186.9630798969733 L27.339456319131386 192.64667260395447 L10.018948243442622 182.64667260395447 A30 10 300 0 0 -7.301559832246156 172.64667260395447 L-24.622067907934934 162.64667260395447 L-30.30566061491607 141.43521585197288 A30 10 345 0 0 -35.98925332189722 120.22375909999133 L-41.67284602887837 99.01230234800975 L-31.672846028878368 81.69179427232099 A20 5 29.999999999999996 0 0 -21.672846028878368 64.37128619663221 L-11.672846028878372 47.05077812094343 L9.538610723103195 41.36718541396228 A20 5 75 0 0 30.750067475084762 35.68359270698114 L51.96152422706632 29.99999999999999z");
      var result6 = go.Geometry.parse("M-24.019237886466833 101.60254037844388 C18.301270189221942 68.30127018922194 50.62177826491071 52.320508075688764 36.602540378443884 136.60254037844388 C30.262794416288273 167.58330249197704 -36.028856829700246 152.4038105676658 6.291651245988525 119.10254037844388");
      test.assert(test.geo1.equalsApprox(result1), "rotate 30 failed for Geometry 1");
      test.assert(test.geo2.equalsApprox(result2), "rotate 30 failed for Geometry 2");
      test.assert(test.geo3.equalsApprox(result3), "rotate 30 failed for Geometry 3");
      test.assert(test.geo4.equalsApprox(result4), "rotate 30 failed for Geometry 4");
      test.assert(test.geo5.equalsApprox(result5), "rotate 30 failed for Geometry 5");
      test.assert(test.geo6.equalsApprox(result6), "rotate 30 failed for Geometry 6");
    }
  ));

  geometries.add(new Test("rotate -120", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    function(test) {
      test.geo1.rotate(-120);
      test.geo2.rotate(-120);
      test.geo3.rotate(-120);
      test.geo4.rotate(-120);
      test.geo5.rotate(-120);
      test.geo6.rotate(-120);
    },
    function(test) {
      var result1 = go.Geometry.parse("F M0 0 L-25.00000000000002 -43.30127018922192 M0 0 L86.60254037844383 -50.00000000000004 M43.30127018922192 -25.00000000000002 L23.3012701892219 -59.641016151377556");
      var result2 = go.Geometry.parse("F M0 0 L-50.00000000000004 -86.60254037844383 B104.99999999999994 90 -24.01923788646689 -101.60254037844385 45 L-103.97114317029978 -90.08330249197698");
      var result3 = go.Geometry.parse("F M0 0 L-50.00000000000004 -86.60254037844383 L-26.02885682970033 -135.083302491977 A60 30 149.99999999999994 0 1 3.9711431702996975 -83.12177826491072 L-50.00000000000004 -86.60254037844383");
      var result4 = go.Geometry.parse("F M-30.00000000000003 -51.961524227066306 L-40.000000000000036 -69.28203230275507 B239.99999999999994 -180 -45.00000000000004 -77.94228634059945 10 L-60.00000000000006 -103.92304845413261 L-54.31640729301892 -125.13450520611417 B284.99999999999994 -180 -51.47461093952835 -135.74023358210496 10 L-42.949221879056644 -167.55741871007731 L-25.62871380336788 -177.55741871007731 B329.99999999999994 -180 -16.96845976552349 -182.55741871007731 10 L9.012302348009655 -197.55741871007734 L30.223759099991227 -191.8738260030962 B15 -180 40.829487475982006 -189.03202964960565 10 L72.64667260395437 -180.50664058913392 L77.64667260395437 -171.84638655128953 B59.99999999999994 -180 87.64667260395439 -154.52587847560076 20 L102.6466726039544 -128.54511636206763 L99.80487625046382 -117.93938798607684 B104.99999999999994 -180 94.12128354348269 -96.72793123409525 20 L85.595894483011 -64.9107461061229 B149.99999999999994 -180 59.61513236947784 -49.91074610612289 30 L33.63437025594468 -34.91074610612288 B194.99999999999994 -180 1.81718512797233 -43.436135166594575 30 L-30.00000000000002 -51.96152422706628z");
      var result5 = go.Geometry.parse("F M-30.00000000000003 -51.961524227066306 L-40.000000000000036 -69.28203230275507 A10 10 149.99999999999994 0 0 -50.00000000000004 -86.60254037844383 L-60.00000000000006 -103.92304845413261 L-54.31640729301892 -125.13450520611417 A10 10 194.99999999999994 0 0 -48.632814586037796 -146.34596195809576 L-42.94922187905666 -167.55741871007734 L-25.628713803367894 -177.55741871007734 A20 10 239.99999999999994 0 0 -8.308205727679123 -187.55741871007734 L9.01230234800964 -197.55741871007737 L30.223759099991213 -191.8738260030962 A20 10 284.99999999999994 0 0 51.4352158519728 -186.19023329611508 L72.64667260395436 -180.50664058913395 L82.64667260395437 -163.18613251344516 A30 10 329.99999999999994 0 0 92.64667260395439 -145.86562443775642 L102.64667260395439 -128.54511636206763 L96.96307989697326 -107.33365961008606 A30 10 15 0 0 91.27948718999212 -86.1222028581045 L85.59589448301098 -64.91074610612293 L68.27538640732222 -54.910746106122915 A20 5 59.99999999999994 0 0 50.954878331633445 -44.9107461061229 L33.634370255944674 -34.9107461061229 L12.422913503963104 -40.59433881310403 A20 5 104.99999999999994 0 0 -8.788543248018465 -46.27793152008516 L-30.000000000000036 -51.9615242270663z");
      var result6 = go.Geometry.parse("M71.60254037844382 -75.98076211353319 C18.301270189221896 -68.30127018922194 -17.67949192431126 -70.6217782649107 36.60254037844379 -136.60254037844388 C57.583302491976944 -160.26279441628827 107.40381056766572 -113.9711431702998 54.102540378443805 -106.29165124598853");
      test.assert(test.geo1.equalsApprox(result1), "rotate -120 failed for Geometry 1");
      test.assert(test.geo2.equalsApprox(result2), "rotate -120 failed for Geometry 2");
      test.assert(test.geo3.equalsApprox(result3), "rotate -120 failed for Geometry 3");
      test.assert(test.geo4.equalsApprox(result4), "rotate -120 failed for Geometry 4");
      test.assert(test.geo5.equalsApprox(result5), "rotate -120 failed for Geometry 5");
      test.assert(test.geo6.equalsApprox(result6), "rotate -120 failed for Geometry 6");
    }
  ));

  geometries.add(new Test("scale -1 1", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    function(test) {
      test.geo1.scale(-1, 1);
      test.geo2.scale(-1, 1);
      test.geo3.scale(-1, 1);
      test.geo4.scale(-1, 1);
      test.geo5.scale(-1, 1);
      test.geo6.scale(-1, 1);
    },
    function(test) {
      var result1 = go.Geometry.parse("F M0 0 L-50 0 M0 0 L0 100 M0 50 L-40 50");
      var result2 = go.Geometry.parse("F M0 0 L-100 0 B135 -90 -100 30 45 L-130 -45");
      var result3 = go.Geometry.parse("F M0 0 L-100 0 L-130 45 A60 30 90 0 0 -70 45 L-100 0");
      var result4 = go.Geometry.parse("F M-60 0 L-80 0 B0 180 -90 0 10 L-120 0 L-135.52786404500043 15.52786404500042 B315 180 -143.29179606750063 23.29179606750063 10 L-166.58359213500125 46.58359213500126 L-166.58359213500125 66.58359213500125 B270 180 -166.58359213500125 76.58359213500125 10 L-166.58359213500125 106.58359213500125 L-151.05572809000083 122.11145618000168 B225 180 -143.29179606750063 129.87538820250188 10 L-119.99999999999999 153.1671842700025 L-109.99999999999999 153.1671842700025 B180 180 -89.99999999999999 153.1671842700025 20 L-59.999999999999986 153.1671842700025 L-52.23606797749977 145.4032522475023 B135 180 -36.70820393249935 129.87538820250188 20 L-13.416407864998718 106.58359213500125 B90 180 -13.416407864998718 76.58359213500125 30 L-13.416407864998718 46.583592135001254 B45 180 -36.708203932499345 23.291796067500623 30 L-59.99999999999998 -7.105427357601002e-15z");
      var result5 = go.Geometry.parse("F M-60 0 L-80 0 A10 10 90 0 1 -100 0 L-120 0 L-135.52786404500043 15.52786404500042 A10 10 45 0 1 -151.05572809000085 31.05572809000084 L-166.58359213500128 46.58359213500126 L-166.58359213500128 66.58359213500125 A20 10 0 0 1 -166.58359213500128 86.58359213500125 L-166.58359213500128 106.58359213500125 L-151.05572809000085 122.11145618000168 A20 10 315 0 1 -135.52786404500043 137.6393202250021 L-120 153.16718427000254 L-100 153.16718427000254 A30 10 270 0 1 -80 153.16718427000254 L-60 153.16718427000254 L-44.47213595499958 137.6393202250021 A30 10 225 0 1 -28.94427190999916 122.11145618000168 L-13.416407864998739 106.58359213500125 L-13.416407864998739 86.58359213500125 A20 5 180 0 1 -13.416407864998739 66.58359213500125 L-13.416407864998739 46.583592135001254 L-28.94427190999916 31.055728090000834 A20 5 135 0 1 -44.47213595499958 15.527864045000413 L-60 -7.105427357601002e-15z");
      var result6 = go.Geometry.parse("M-30 100 C-50 50 -70 20 -100 100 C-110 130 -45 150 -65 100");
      test.assert(test.geo1.equalsApprox(result1), "scale -1 1 failed for Geometry 1");
      test.assert(test.geo2.equalsApprox(result2), "scale -1 1 failed for Geometry 2");
      test.assert(test.geo3.equalsApprox(result3), "scale -1 1 failed for Geometry 3");
      test.assert(test.geo4.equalsApprox(result4), "scale -1 1 failed for Geometry 4");
      test.assert(test.geo5.equalsApprox(result5), "scale -1 1 failed for Geometry 5");
      test.assert(test.geo6.equalsApprox(result6), "scale -1 1 failed for Geometry 6");
    }
  ));

  geometries.add(new Test("scale 1 -1", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    function(test) {
      test.geo1.scale(1, -1);
      test.geo2.scale(1, -1);
      test.geo3.scale(1, -1);
      test.geo4.scale(1, -1);
      test.geo5.scale(1, -1);
      test.geo6.scale(1, -1);
    },
    function(test) {
      var result1 = go.Geometry.parse("F M0 0 L50 0 M0 0 L0 -100 M0 -50 L40 -50");
      var result2 = go.Geometry.parse("F M0 0 L100 0 B315 -90 100 -30 45 L130 45");
      var result3 = go.Geometry.parse("F M0 0 L100 0 L130 -45 A60 30 270 0 0 70 -45 L100 0");
      var result4 = go.Geometry.parse("F M60 0 L80 0 B180 180 90 0 10 L120 0 L135.52786404500043 -15.52786404500042 B135 180 143.29179606750063 -23.29179606750063 10 L166.58359213500125 -46.58359213500126 L166.58359213500125 -66.58359213500125 B90 180 166.58359213500125 -76.58359213500125 10 L166.58359213500125 -106.58359213500125 L151.05572809000083 -122.11145618000168 B45 180 143.29179606750063 -129.87538820250188 10 L119.99999999999999 -153.1671842700025 L109.99999999999999 -153.1671842700025 B0 180 89.99999999999999 -153.1671842700025 20 L59.999999999999986 -153.1671842700025 L52.23606797749977 -145.4032522475023 B315 180 36.70820393249935 -129.87538820250188 20 L13.416407864998718 -106.58359213500125 B270 180 13.416407864998718 -76.58359213500125 30 L13.416407864998718 -46.583592135001254 B225 180 36.708203932499345 -23.291796067500623 30 L59.99999999999998 7.105427357601002e-15z");
      var result5 = go.Geometry.parse("F M60 0 L80 0 A10 10 270 0 1 100 0 L120 0 L135.52786404500043 -15.52786404500042 A10 10 225 0 1 151.05572809000085 -31.05572809000084 L166.58359213500128 -46.58359213500126 L166.58359213500128 -66.58359213500125 A20 10 180 0 1 166.58359213500128 -86.58359213500125 L166.58359213500128 -106.58359213500125 L151.05572809000085 -122.11145618000168 A20 10 135 0 1 135.52786404500043 -137.6393202250021 L120 -153.16718427000254 L100 -153.16718427000254 A30 10 90 0 1 80 -153.16718427000254 L60 -153.16718427000254 L44.47213595499958 -137.6393202250021 A30 10 45 0 1 28.94427190999916 -122.11145618000168 L13.416407864998739 -106.58359213500125 L13.416407864998739 -86.58359213500125 A20 5 0 0 1 13.416407864998739 -66.58359213500125 L13.416407864998739 -46.583592135001254 L28.94427190999916 -31.055728090000834 A20 5 315 0 1 44.47213595499958 -15.527864045000413 L60 7.105427357601002e-15z");
      var result6 = go.Geometry.parse("M30 -100 C50 -50 70 -20 100 -100 C110 -130 45 -150 65 -100");
      test.assert(test.geo1.equalsApprox(result1), "scale 1 -1 failed for Geometry 1");
      test.assert(test.geo2.equalsApprox(result2), "scale 1 -1 failed for Geometry 2");
      test.assert(test.geo3.equalsApprox(result3), "scale 1 -1 failed for Geometry 3");
      test.assert(test.geo4.equalsApprox(result4), "scale 1 -1 failed for Geometry 4");
      test.assert(test.geo5.equalsApprox(result5), "scale 1 -1 failed for Geometry 5");
      test.assert(test.geo6.equalsApprox(result6), "scale 1 -1 failed for Geometry 6");
    }
  ));

  geometries.add(new Test("scale -1 -1 == rotate 180", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    null,
    function(test) {
      test.assert(test.geo1.copy().scale(-1, -1).equalsApprox(test.geo1.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 1");
      test.assert(test.geo2.copy().scale(-1, -1).equalsApprox(test.geo2.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 2");
      test.assert(test.geo3.copy().scale(-1, -1).equalsApprox(test.geo3.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 3");
      test.assert(test.geo4.copy().scale(-1, -1).equalsApprox(test.geo4.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 4");
      test.assert(test.geo5.copy().scale(-1, -1).equalsApprox(test.geo5.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 5");
      test.assert(test.geo6.copy().scale(-1, -1).equalsApprox(test.geo6.copy().rotate(180)), "scale -1 -1 not like rotate 180 for Geometry 6");
    }
  ));

  geometries.add(new Test("various operations", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers
    },
    null,
    function(test) {
      test.assert(test.geo1.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo1.copy().normalize()), "not like original for Geometry 1");
      test.assert(test.geo2.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo2.copy().normalize()), "not like original for Geometry 2");
      test.assert(test.geo3.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo3.copy().normalize()), "not like original for Geometry 3");
      test.assert(test.geo4.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo4.copy().normalize()), "not like original for Geometry 4");
      test.assert(test.geo5.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo5.copy().normalize()), "not like original for Geometry 5");
      test.assert(test.geo6.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo6.copy().normalize()), "not like original for Geometry 6");
    }
  ));

  geometries.add(new Test("stringifyFixed", null,
    function(test) {
      test.geo1 = go.Geometry.parse("f1 M0 0 h50 M0 0 v100 M0 50 h40");  // Line, an "F" shape
      test.geo2 = go.Geometry.parse("f1 M0 0 h100 b45 90 0 30 45 45 l30 -45");  // Arc
      test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");  // SvgArc
      test.geo4 = go.Geometry.parse("f1 M60 0 l20 0  b180 -180  10 0   10 10 l40 0l15.52786404500042 15.52786404500042 b225 -180  7.76393202250021 7.76393202250021  10 10 l31.05572809000084 31.05572809000084l0 20  b270 -180  0 10   10 10 l0 40l-15.52786404500042 15.52786404500042 b315 -180  -7.76393202250021 7.76393202250021  10 10 l-31.05572809000084 31.05572809000084l-10 0 b0 -180   -20 0   20 20 l-50 0l-7.76393202250021 -7.76393202250021 b45 -180  -15.52786404500042 -15.52786404500042  20 20 l-38.819660112501055 -38.819660112501055       b90 -180   0 -30  30 30 l0 -60 b135 -180  23.29179606750063 -23.29179606750063  30 30 l46.58359213500126 -46.58359213500126z");  // lots of Arcs
      test.geo5 = go.Geometry.parse("f1 M60 0 l20 0  a10 10 90    0 0  20 0  l20 0l15.52786404500042 15.52786404500042 a10 10 135  0 0  15.52786404500042 15.52786404500042 l15.52786404500042 15.52786404500042l0 20  a20 10 180   0 0  0 20  l0 20l-15.52786404500042 15.52786404500042 a20 10 225  0 0  -15.52786404500042 15.52786404500042 l-15.52786404500042 15.52786404500042l-20 0 a30 10 270  0 0  -20 0  l-20 0l-15.52786404500042 -15.52786404500042 a30 10 315  0 0  -15.52786404500042 -15.52786404500042 l-15.52786404500042 -15.52786404500042l0 -20 a20 5 0     0 0   0 -20 l0 -20l15.52786404500042 -15.52786404500042 a20 5 45  0 0  15.52786404500042 -15.52786404500042 l15.52786404500042 -15.52786404500042z");  // lots of SvgArcs
      test.geo6 = go.Geometry.parse("M30 100 C 50 50, 70 20, 100 100, 110, 130, 45, 150, 65, 100");  // Beziers

      test.geo1.normalize();
      test.geo2.normalize();
      test.geo3.normalize();
      test.geo4.normalize();
      test.geo5.normalize();
      test.geo6.normalize();

      const CNV = go.Geometry.stringifyFixed(0);
      test.geo1s = CNV(test.geo1);
      test.geo2s = CNV(test.geo2);
      test.geo3s = CNV(test.geo3);
      test.geo4s = CNV(test.geo4);
      test.geo5s = CNV(test.geo5);
      test.geo6s = CNV(test.geo6);
    },
    null,
    function(test) {
      test.assert(test.geo1.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo1.copy().normalize()), "not like original for Geometry 1");
      test.assert(test.geo2.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo2.copy().normalize()), "not like original for Geometry 2");
      test.assert(test.geo3.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo3.copy().normalize()), "not like original for Geometry 3");
      test.assert(test.geo4.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo4.copy().normalize()), "not like original for Geometry 4");
      test.assert(test.geo5.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo5.copy().normalize()), "not like original for Geometry 5");
      test.assert(test.geo6.copy().offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize().equalsApprox(test.geo6.copy().normalize()), "not like original for Geometry 6");

      // the above transformations on Geometry cause enough round-off that stringifyFixed(1) won't produce the same results
      const CNV = go.Geometry.stringifyFixed(0);
      const geo1c = test.geo1.copy();
      geo1c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo2c = test.geo2.copy();
      geo2c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo3c = test.geo3.copy();
      geo3c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo4c = test.geo4.copy();
      geo4c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo5c = test.geo5.copy();
      geo5c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo6c = test.geo6.copy();
      geo6c.offset(23, -17).scale(1.1, 0.9).rotate(111).rotate(-111).scale(1 / 1.1, 1 / 0.9).offset(-23, 17).normalize();
      const geo1t = CNV(geo1c);
      const geo2t = CNV(geo2c);
      const geo3t = CNV(geo3c);
      const geo4t = CNV(geo4c);
      const geo5t = CNV(geo5c);
      const geo6t = CNV(geo6c);
      test.assert(geo1t === test.geo1s, "not like original string for Geometry 1\n  " + test.geo1s + "\n  " + geo1t);
      test.assert(geo2t === test.geo2s, "not like original string for Geometry 2\n  " + test.geo2s + "\n  " + geo2t);
      test.assert(geo3t === test.geo3s, "not like original string for Geometry 3\n  " + test.geo3s + "\n  " + geo3t);
      test.assert(geo4t === test.geo4s, "not like original string for Geometry 4\n  " + test.geo4s + "\n  " + geo4t);
      test.assert(geo5t === test.geo5s, "not like original string for Geometry 5\n  " + test.geo5s + "\n  " + geo5t);
      test.assert(geo6t === test.geo6s, "not like original string for Geometry 6\n  " + test.geo6s + "\n  " + geo6t);
    }
  ));

  // test to make sure flags can combine with the other params in SVG A arcs
  geometries.add(new Test("SVG arc shorthands", null,
  function(test) {
    test.geo1 = go.Geometry.parse("f1 M40 40 a.5.5 0 0171 71z");
    test.geo2 = go.Geometry.parse("f1 M40 40 a.5.5 0 01 71 71z");
    test.geo3 = go.Geometry.parse("f1 M0 0 h100 l30 45 a60 30 90 0 1 -60 0 l30 -45");
  },
  null,
  function(test) {
    test.assert(test.geo1.equalsApprox(test.geo2));
    test.assert(test.geo1.toString() === "F M40 40 A0.5 0.5 0 0 1 111 111z");
    test.assert(test.geo3.toString() === "F M0 0 L100 0 L130 45 A60 30 90 0 1 70 45 L100 0");
  }
));

})();
