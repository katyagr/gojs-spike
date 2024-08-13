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
  var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAOUlEQVQ4T+2TsQ0AAAjCyv9H6wUkjJrAbBhqETAEiY4AtdDSLEOL5oM2ky0FZX8WLfQ+lKFhc1+bBW14Me1YdHkhAAAAAElFTkSuQmCC";
  window.globalImage1  = new Image();
  globalImage1.src = img;

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

  function CommonSetup(test, template) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate = template;
    diagram.model = new go.GraphLinksModel([{ key: 1 }]);
  }

  function GeoFracPtCheck(test, checkfrac, arr) {
    var diagram = test.diagram;
    var node = diagram.nodes.iterator.first();
    var geo = node.findMainElement().geometry;

    for (var i = 0; i < arr.length; i++) {
      var fraction = arr[i][0];
      var pt = arr[i][1];
      if (checkfrac) {
        var geofraction = geo.getFractionForPoint(pt);
        test.assert(
          test.isApprox(geofraction * 100, fraction * 100),
          "point: " + pt.toString() + " - expected = " + fraction + ", actual = " + geofraction
        );
      } else {
        var geopt = geo.getPointAlongPath(fraction);
        test.assert(
          test.isApproxPoint(geopt, pt),
          "fraction: " + fraction + " - expected = " + pt.toString() + ", actual = " + geopt.toString()
        );
      }

    }
  }

  function GradValPtCheck(test, checkval, arr) {
    var diagram = test.diagram;
    var node = diagram.nodes.iterator.first();

    for (var i = 0; i < arr.length; i++) {
      var val = arr[i][0];
      var pt = arr[i][1];
      if (checkval) {
        var gradval = node.graduatedValueForPoint(pt);
        test.assert(
          test.isApprox(gradval, val),
          "point: " + pt.toString() + " - expected = " + val + ", actual = " + gradval
        );
      } else {
        var gradpt = node.graduatedPointForValue(val);
        test.assert(
          test.isApproxPoint(gradpt, pt),
          "fraction: " + val + " - expected = " + pt.toString() + ", actual = " + gradpt.toString()
        );
      }

    }
  }

  function MeasArrCheck(test, arr) {
    var diagram = test.diagram;
    var node = diagram.nodes.iterator.first();
    var main = node.findMainElement();
    var nab = node.actualBounds;
    var mab = main.actualBounds;

    test.assert(test.isApproxEqual(nab.width, arr[0]), "node width: expected = " + arr[0] + ", actual = " + nab.width);
    test.assert(test.isApproxEqual(nab.height, arr[1]), "node height: expected = " + arr[1] + ", actual = " + nab.height);
    test.assert(test.isApproxEqual(mab.x, arr[2]), "main x: expected = " + arr[2] + ", actual = " + mab.x);
    test.assert(test.isApproxEqual(mab.y, arr[3]), "main y: expected = " + arr[3] + ", actual = " + mab.y);
  }

  function MeasArrRangeCheck(test, arr) {
    var diagram = test.diagram;
    var node = diagram.nodes.iterator.first();
    var main = node.findMainElement();
    var nab = node.actualBounds;
    var mab = main.actualBounds;

    test.assert(arr[0][0] <= nab.width && nab.width <= arr[0][1], "node width: expected range = " + arr[0][0] + "-" + arr[0][1] + ", actual = " + nab.width);
    test.assert(arr[1][0] <= nab.height && nab.height <= arr[1][1], "node height: expected range = " + arr[1][0] + "-" + arr[1][1] + ", actual = " + nab.height);
    test.assert(arr[2][0] <= mab.x && mab.x <= arr[2][1], "main x: expected range = " + arr[2][0] + "-" + arr[2][1] + ", actual = " + mab.x);
    test.assert(arr[3][0] <= mab.y && mab.y <= arr[3][1], "main y: expected range = " + arr[3][0] + "-" + arr[3][1] + ", actual = " + mab.y);
  }

  var gradgeo = new TestCollection('Grad panels/Geo fns');
  TestRoot.add(gradgeo);

  var geotests = new TestCollection("Geometry functions");
  gradgeo.add(geotests);

  var geopoint = new TestCollection("getPointAlongPath");
  geotests.add(geopoint);

  geopoint.add(new Test('horiz', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(100, 0)],
          [1, new go.Point(200, 0)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('vert', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 V200" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(0, 100)],
          [1, new go.Point(0, 200)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('diag', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 L100 100" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(50, 50)],
          [1, new go.Point(100, 100)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('curve', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Curve1")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(70.5, 29.5)],
          [1, new go.Point(100, 100)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('rectangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 100) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(150, 0)],
          [.5, new go.Point(200, 100)],
          [.75, new go.Point(50, 100)],
          [1, new go.Point(0, 0)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('square', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Square")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(100, 0)],
          [.5, new go.Point(100, 100)],
          [.75, new go.Point(0, 100)],
          [1, new go.Point(0, 0)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('ellipse', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Ellipse", { desiredSize: new go.Size(200, 100) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(200, 50)],
          [.25, new go.Point(100, 100)],
          [.5, new go.Point(0, 50)],
          [.75, new go.Point(100, 0)],
          [1, new go.Point(200, 50)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('circle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Circle")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(100, 50)],
          [.25, new go.Point(50, 100)],
          [.5, new go.Point(0, 50)],
          [.75, new go.Point(50, 0)],
          [1, new go.Point(100, 50)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('triangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Triangle")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          // figures.js triangle:
          [0, new go.Point(100, 100)],
          [.25, new go.Point(19, 100)],
          [.5, new go.Point(27.5, 44.5)],
          [.75, new go.Point(64, 27.5)],
          [1, new go.Point(100, 100)]
          // 1.7 triangle:
          /*
          [0, new go.Point(50, 0)],
          [.25, new go.Point(14, 72.5)],
          [.5, new go.Point(50, 100)],
          [.75, new go.Point(86, 72.5)],
          [1, new go.Point(50, 0)]
          */
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('star', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "FivePointedStar")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(49, 0)],
          [.25, new go.Point(81, 40.5)],
          [.5, new go.Point(49, 62.5)],
          [.75, new go.Point(16.5, 40.5)],
          [1, new go.Point(49, 0)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('club', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Club")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [

          // figures.js + 2.0 club:
          [0, new go.Point(40,60)],
          [.25, new go.Point(82.5,100)],
          [.5, new go.Point(97.5,40)],
          [.75, new go.Point(30.5,24.5)],
          [1, new go.Point(40,60)]

          // 1.7 club:
          /*
          [0, new go.Point(40, 60)],
          [.25, new go.Point(80.5, 100)],
          [.5, new go.Point(99, 43.5)],
          [.75, new go.Point(30, 19)],
          [1, new go.Point(40, 60)]*/
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('multi-figure', null,
    function (test) {
      var geo = new go.Geometry()
                    .add(new go.PathFigure()
                      .add(new go.PathSegment(go.PathSegment.Line, 0, 100))
                      .add(new go.PathSegment(go.PathSegment.Move, 50, 0))
                      .add(new go.PathSegment(go.PathSegment.Line, 50, 50)))
                    .add(new go.PathFigure(100, 0)
                      .add(new go.PathSegment(go.PathSegment.Line, 100, 100)));

      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometry: geo })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(0, 62.5)],
          [.5, new go.Point(50, 25)],
          [.75, new go.Point(100, 37.5)],
          [1, new go.Point(100, 100)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('zero-side rectangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 0) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(100, 0)],
          [.5, new go.Point(200, 0)],
          [.75, new go.Point(100, 0)],
          [1, new go.Point(0, 0)]
        ]
      )
    }
  )); // end test

  geopoint.add(new Test('arc', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 A120 120 0 0 1 200 0" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, false,
        [
          [0, new go.Point(0, 53.5)],
          [.25, new go.Point(43.5, 14.5)],
          [.5, new go.Point(100, 0)],
          [.75, new go.Point(156.5, 14.5)],
          [1, new go.Point(200, 53.5)]
        ]
      )
    }
  )); // end test

  var geofrac = new TestCollection("getFractionAlongPath");
  geotests.add(geofrac);

  geofrac.add(new Test('horiz', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(100, 0)],
          [1, new go.Point(200, 0)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('vert', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 V200" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(0, 100)],
          [1, new go.Point(0, 200)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('diag', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 L100 100" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(50, 50)],
          [1, new go.Point(100, 100)],
          [.5, new go.Point(100, 0)]  // also check a point that doesn't fall on the line
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('curve', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Curve1")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.5, new go.Point(70.5, 29.5)],
          [1, new go.Point(100, 100)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('rectangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 100) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(150, 0)],
          [.5, new go.Point(200, 100)],
          [.75, new go.Point(50, 100)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('square', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Square")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(100, 0)],
          [.5, new go.Point(100, 100)],
          [.75, new go.Point(0, 100)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('ellipse', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Ellipse", { desiredSize: new go.Size(200, 100) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(200, 50)],
          [.25, new go.Point(100, 100)],
          [.5, new go.Point(0, 50)],
          [.75, new go.Point(100, 0)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('circle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Circle")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(100, 50)],
          [.25, new go.Point(50, 100)],
          [.5, new go.Point(0, 50)],
          [.75, new go.Point(50, 0)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('triangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Triangle")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          // figures.js and new 2.0 triangle:
          [0,  new go.Point(100,100)],
          [.25, new go.Point(19.,100)],
          [.5, new go.Point(27.5,44.5)],
          [.75, new go.Point(63.5,27.5)]
          // 1.7 triangle
          /*
          [0, new go.Point(50, 0)],
          [.25, new go.Point(14, 72.5)],
          [.5, new go.Point(50, 100)],
          [.75, new go.Point(86, 72.5)]
          */
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('star', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "FivePointedStar")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(49, 0)],
          [.25, new go.Point(81, 40.5)],
          [.5, new go.Point(49, 62.5)],
          [.75, new go.Point(16.5, 40.5)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('club', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Club")
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          // figures.js and 2.0
          [.25, new go.Point(82.5,100)],
          [.5, new go.Point(97.3,40.2)],
          [.75, new go.Point(30.5,24.75)]
          // new 1.7:
          /*
          [.25, new go.Point(80.5, 100)],
          [.5, new go.Point(99, 43.5)],
          [.75, new go.Point(30, 19)]
          */
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('multi-figure', null,
    function (test) {
      var geo = new go.Geometry()
                    .add(new go.PathFigure()
                      .add(new go.PathSegment(go.PathSegment.Line, 0, 100))
                      .add(new go.PathSegment(go.PathSegment.Move, 50, 0))
                      .add(new go.PathSegment(go.PathSegment.Line, 50, 50)))
                    .add(new go.PathFigure(100, 0)
                      .add(new go.PathSegment(go.PathSegment.Line, 100, 100)));

      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometry: geo })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(0, 62.5)],
          [.5, new go.Point(50, 25)],
          [.75, new go.Point(100, 37.5)],
          [1, new go.Point(100, 100)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('zero-side rectangle', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 0) })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 0)],
          [.25, new go.Point(100, 0)],
          [.5, new go.Point(200, 0)]
        ]
      )
    }
  )); // end test

  geofrac.add(new Test('arc', null,
    function (test) {
      CommonSetup(test,
        $(go.Node,
          $(go.Shape, { geometryString: "M0 0 A120 120 0 0 1 200 0" })
        )
      )
    },
    null,
    function (test) {
      GeoFracPtCheck(test, true,
        [
          [0, new go.Point(0, 53.5)],
          [.25, new go.Point(43.5, 14.5)],
          [.5, new go.Point(100, 0)],
          [.75, new go.Point(156.5, 14.5)],
          [1, new go.Point(200, 53.5)]
        ]
      )
    }
  )); // end test

  var graduatedtests = new TestCollection("Graduated panels");
  gradgeo.add(graduatedtests);

  var gradarrange = new TestCollection("measure/arrange");
  graduatedtests.add(gradarrange);

  gradarrange.add(new Test('horiz', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 11.5, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('horiz bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 11.5, 0, 10.5]);
    }
  )); // end test

  gradarrange.add(new Test('horiz center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 11, 0, 5]);
    }
  )); // end test

  gradarrange.add(new Test('vert', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 V200" }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [11.5, 201, 10.5, 0]);
    }
  )); // end test

  gradarrange.add(new Test('vert bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 V200" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [11.5, 201, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('vert center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 V200" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [11, 201, 5, 0]);
    }
  )); // end test

  gradarrange.add(new Test('rect', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 51, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('rect bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [216.2634559672906, 72, 7.631727983645298, 10.5]);
    }
  )); // end test

  gradarrange.add(new Test('rect center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [208.48528137423858, 61, 3.7426406871192857, 5]);
    }
  )); // end test

  gradarrange.add(new Test('ellipse', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Ellipse", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 51, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('ellipse bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Ellipse", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [222, 70.808567968791, 10.5, 9.904283984395496]);
    }
  )); // end test

  gradarrange.add(new Test('ellipse center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Ellipse", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [211, 59.82511812779076, 5, 4.412559063895382]);
    }
  )); // end test

  gradarrange.add(new Test('curve', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Curve1", { desiredSize: new go.Size(100, 100) }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [101.55410915784886, 101.55410915784887, 0.5541091578488586, 0]);
    }
  )); // end test

  gradarrange.add(new Test('curve bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Curve1", { desiredSize: new go.Size(100, 100) }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [111.51121850092017, 111.51121850092017, 0, 10.51121850092017]);
    }
  )); // end test

  gradarrange.add(new Test('curve center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Curve1", { desiredSize: new go.Size(100, 100) }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [106.29495356109688, 106.29495356109689, 0.2767364607695586, 5.018217100327327]);
    }
  )); // end test

  gradarrange.add(new Test('svg arc', null,
    function (test) {
      var geo = new go.Geometry()
                  .add(new go.PathFigure()
                    .add(new go.PathSegment(go.PathSegment.SvgArc, 100, 100, 50, 50, 0, 1, 0)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo, fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [138.39631480456944, 138.39631621631918, 9.438690812360472, 7.2469466401933795]);
    }
  )); // end test

  gradarrange.add(new Test('svg arc bottom ticks', null,
    function (test) {
      var geo = new go.Geometry()
                  .add(new go.PathFigure()
                    .add(new go.PathSegment(go.PathSegment.SvgArc, 100, 100, 50, 50, 0, 1, 0)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo, fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [121.71067750830319, 121.71067872900632, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('svg arc middle ticks', null,
    function (test) {
      var geo = new go.Geometry()
                  .add(new go.PathFigure()
                    .add(new go.PathSegment(go.PathSegment.SvgArc, 100, 100, 50, 50, 0, 1, 0)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo, fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [129.23339795936897, 129.23339927150266, 3.963780341757598, 3.5589401659797613]);
    }
  )); // end test

  gradarrange.add(new Test('sweep arc', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 100 M-70.7 70.7 B135 270 0 0 100 100", fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 201, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('sweep arc bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 100 M-70.7 70.7 B135 270 0 0 100 100", fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [219.2264151208178, 211.49986798778573, 9.112519429561635, 10.499867987785732]);
    }
  )); // end test

  gradarrange.add(new Test('sweep arc middle ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 100 M-70.7 70.7 B135 270 0 0 100 100", fill: null }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [208.3605585159114, 205.99986798778573, 3.6795993491182477, 4.999867987785732]);
    }
  )); // end test

  gradarrange.add(new Test('multi-figure geometry', null,
    function (test) {
      var geo = new go.Geometry()
                    .add(new go.PathFigure()
                      .add(new go.PathSegment(go.PathSegment.Line, 0, 100))
                      .add(new go.PathSegment(go.PathSegment.Move, 50, 0))
                      .add(new go.PathSegment(go.PathSegment.Line, 50, 50)))
                    .add(new go.PathFigure(100, 0)
                      .add(new go.PathSegment(go.PathSegment.Line, 100, 100)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [111.5, 101, 10.5, 0]);
    }
  )); // end test

  gradarrange.add(new Test('multi-figure geometry bottom ticks', null,
    function (test) {
      var geo = new go.Geometry()
                    .add(new go.PathFigure()
                      .add(new go.PathSegment(go.PathSegment.Line, 0, 100))
                      .add(new go.PathSegment(go.PathSegment.Move, 50, 0))
                      .add(new go.PathSegment(go.PathSegment.Line, 50, 50)))
                    .add(new go.PathFigure(100, 0)
                      .add(new go.PathSegment(go.PathSegment.Line, 100, 100)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [111.5, 101, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('multi-figure geometry center ticks', null,
    function (test) {
      var geo = new go.Geometry()
                    .add(new go.PathFigure()
                      .add(new go.PathSegment(go.PathSegment.Line, 0, 100))
                      .add(new go.PathSegment(go.PathSegment.Move, 50, 0))
                      .add(new go.PathSegment(go.PathSegment.Line, 50, 50)))
                    .add(new go.PathFigure(100, 0)
                      .add(new go.PathSegment(go.PathSegment.Line, 100, 100)));

      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometry: geo }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [111, 101, 5, 0]);
    }
  )); // end test

  gradarrange.add(new Test('club', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Club", { desiredSize: new go.Size(100, 100), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10" })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [117.40776584786542, 117.83497420918351, 9.682035652807262, 6.334974209183511]);
    }
  )); // end test

  gradarrange.add(new Test('club bottom ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Club", { desiredSize: new go.Size(100, 100), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Bottom })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [101, 109.36941117563603, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('club center ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Club", { desiredSize: new go.Size(100, 100), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [107.32117483425978, 107.50112815465891, 4.4292906937262195, 1.5011281546589075]);
    }
  )); // end test

  gradarrange.add(new Test('angled ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", angle: 45, alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [211, 61, 5, 5]);
    }
  )); // end test

  gradarrange.add(new Test('scaled ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, "Rectangle", { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { geometryString: "M0 0 V10", scale: 2, alignmentFocus: go.Spot.Center })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [216.97056274847716, 72, 7.985281374238571, 10.5]);
    }
  )); // end test

  gradarrange.add(new Test('large stroke ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { background: "transparent" },
          $(go.Shape, { desiredSize: new go.Size(200, 50), fill: "transparent" }),
          $(go.Shape, { desiredSize: new go.Size(4, 8), strokeWidth: 10 })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [209.8994949366117, 59.89949493661166, 4.449747468305834, 4.449747468305834]);
    }
  )); // end test

  gradarrange.add(new Test('always draw with graduatedSkip', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedTickUnit: 0.1 },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10", graduatedSkip: function(v) { return false; } })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [201, 11.5, 0, 0]);
    }
  )); // end test

  gradarrange.add(new Test('draw large max values', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMax: 10000000000, graduatedTickUnit: 1000000000 },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10", strokeWidth: 3 })
        )
      )
    },
    null,
    function (test) {
      MeasArrCheck(test, [203, 13.5, 1, 0]);
    }
  )); // end test

  var gradtxtmeas = new TestCollection("text measure/arrange");
  gradarrange.add(gradtxtmeas);

  gradtxtmeas.add(new Test('horiz text along', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.TextBlock, { segmentOrientation: go.Link.OrientAlong, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[210.5, 213.5], [10.5, 12.75], [2, 3], [0, 0]]);
      // makeSVG and test that text actually has correct values
      var idx = 0;
      test.diagram.makeSVG({
        elementFinished: function(obj, svg) {
          if (obj instanceof go.TextBlock) {
            test.assert(parseInt(svg.textContent) === idx * 10, "incorrect text, expected: " + idx * 10 + ", actual: " + svg.textContent);
            idx++;
          }
        }
      });
      test.assert(idx === 11, "incorrect number of textblocks rendered, expected: 11, actual: " + idx);
    }
  )); // end test

  gradtxtmeas.add(new Test('horiz text minus 90', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.TextBlock, { segmentOrientation: go.Link.OrientMinus90, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[210.5, 212.75], [15.75, 18.75], [0, 0], [7.5, 9]]);
    }
  )); // end test

  gradtxtmeas.add(new Test('vert text along', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 V200" }),
          $(go.TextBlock, { segmentOrientation: go.Link.OrientAlong, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[10.5, 12.75], [210, 212.5], [9.5, 11.75], [2, 3]]);
    }
  )); // end test

  gradtxtmeas.add(new Test('vert text minus 90', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 V200" }),
          $(go.TextBlock, { segmentOrientation: go.Link.OrientMinus90, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[15.75, 18.75], [210.5, 212.75], [7.5, 9], [0, 0]]);
    }
  )); // end test

  gradtxtmeas.add(new Test('angled text', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H-200" }),
          $(go.TextBlock, { angle: 45, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[216, 217], [19.73, 20.73], [13.38, 14.38], [4.88, 5.88]]);
    }
  )); // end test

  gradtxtmeas.add(new Test('angled text along', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H-200" }),
          $(go.TextBlock, { angle: 45, segmentOrientation: go.Link.OrientAlong, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[216, 217], [19.73, 20.73], [4.88, 5.88], [13.38, 14.38]]);
    }
  )); // end test

  gradtxtmeas.add(new Test('angled text upright', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H-200" }),
          $(go.TextBlock, { angle: 45, segmentOrientation: go.Link.OrientUpright, font: "10px Georgia" })
        )
      )
    },
    null,
    function (test) {
      MeasArrRangeCheck(test, [[216, 217], [19.73, 20.73], [4.88, 5.88], [13.38, 14.38]]);
    }
  )); // end test

  var gradticks = new TestCollection("tick placement");
  graduatedtests.add(gradticks);

  // function to test colors at a particular pixel
  function arrayEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    var l = arr1.length;
    for (var i = 0; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  function getimg(ctx, x, y) {
    return ctx.getImageData(x, y, 1, 1).data;
  }

  // test that ticks get drawn at correct locations by checking pixel colors
  gradticks.add(new Test('color test 1', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "F M0 0 L0 5 L4 5 L4 0 Z", fill: "rgb(255,0,0)", stroke: "rgb(255,0,0)" }),
          $(go.Shape, { geometryString: "F M0 0 L0 10 L4 10 L4 0 Z", fill: "rgb(0,255,0)", stroke: "rgb(0,255,0)", interval: 2 }),
          $(go.Shape, { geometryString: "F M0 0 L0 15 L4 15 L4 0 Z", fill: "rgb(0,0,255)", stroke: "rgb(0,0,255)", interval: 4 })
        )
      )
    },
    null,
    function (test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 28, 9), [255, 0, 0, 255]), "expected red pixel at (28, 9)");
        test.assert(arrayEquals(getimg(ctx, 68, 9), [255, 0, 0, 255]), "expected red pixel at (68, 9)");
        test.assert(arrayEquals(getimg(ctx, 108, 9), [255, 0, 0, 255]), "expected red pixel at (108, 9)");
        test.assert(arrayEquals(getimg(ctx, 148, 9), [255, 0, 0, 255]), "expected red pixel at (148, 9)");
        test.assert(arrayEquals(getimg(ctx, 188, 9), [255, 0, 0, 255]), "expected red pixel at (188, 9)");
        // green
        test.assert(arrayEquals(getimg(ctx, 48, 14), [0, 255, 0, 255]), "expected green pixel at (48, 14)");
        test.assert(arrayEquals(getimg(ctx, 128, 14), [0, 255, 0, 255]), "expected green pixel at (128, 14)");
        test.assert(arrayEquals(getimg(ctx, 208, 14), [0, 255, 0, 255]), "expected green pixel at (208, 14)");
        // blue
        test.assert(arrayEquals(getimg(ctx, 8, 19), [0, 0, 255, 255]), "expected blue pixel at (8, 19)");
        test.assert(arrayEquals(getimg(ctx, 88, 19), [0, 0, 255, 255]), "expected blue pixel at (88, 19)");
        test.assert(arrayEquals(getimg(ctx, 168, 19), [0, 0, 255, 255]), "expected blue pixel at (168, 19)");
      }
      img.src = diagram.makeImageData();
    }
  )); // end test

  gradticks.add(new Test('color test 2', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          {
            graduatedMin: -23, graduatedMax: 77,
            graduatedTickBase: 1.2, graduatedTickUnit: 5
          },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "F M0 0 L0 5 L4 5 L4 0 Z", fill: "rgb(255,0,0)", stroke: "rgb(255,0,0)" }),
          $(go.Shape, { geometryString: "F M0 0 L0 10 L4 10 L4 0 Z", fill: "rgb(0,255,0)", stroke: "rgb(0,255,0)", interval: 4 })
        )
      )
    },
    null,
    function (test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 24, 9), [255, 0, 0, 255]), "expected red pixel at (24, 9)");
        test.assert(arrayEquals(getimg(ctx, 34, 9), [255, 0, 0, 255]), "expected red pixel at (34, 9)");
        test.assert(arrayEquals(getimg(ctx, 44, 9), [255, 0, 0, 255]), "expected red pixel at (44, 9)");
        test.assert(arrayEquals(getimg(ctx, 64, 9), [255, 0, 0, 255]), "expected red pixel at (64, 9)");
        test.assert(arrayEquals(getimg(ctx, 74, 9), [255, 0, 0, 255]), "expected red pixel at (74, 9)");
        test.assert(arrayEquals(getimg(ctx, 84, 9), [255, 0, 0, 255]), "expected red pixel at (84, 9)");
        test.assert(arrayEquals(getimg(ctx, 104, 9), [255, 0, 0, 255]), "expected red pixel at (104, 9)");
        test.assert(arrayEquals(getimg(ctx, 114, 9), [255, 0, 0, 255]), "expected red pixel at (114, 9)");
        test.assert(arrayEquals(getimg(ctx, 124, 9), [255, 0, 0, 255]), "expected red pixel at (124, 9)");
        test.assert(arrayEquals(getimg(ctx, 144, 9), [255, 0, 0, 255]), "expected red pixel at (144, 9)");
        test.assert(arrayEquals(getimg(ctx, 154, 9), [255, 0, 0, 255]), "expected red pixel at (154, 9)");
        test.assert(arrayEquals(getimg(ctx, 164, 9), [255, 0, 0, 255]), "expected red pixel at (164, 9)");
        test.assert(arrayEquals(getimg(ctx, 184, 9), [255, 0, 0, 255]), "expected red pixel at (184, 9)");
        test.assert(arrayEquals(getimg(ctx, 194, 9), [255, 0, 0, 255]), "expected red pixel at (194, 9)");
        test.assert(arrayEquals(getimg(ctx, 204, 9), [255, 0, 0, 255]), "expected red pixel at (204, 9)");
        // green
        test.assert(arrayEquals(getimg(ctx, 14, 14), [0, 255, 0, 255]), "expected green pixel at (14, 14)");
        test.assert(arrayEquals(getimg(ctx, 54, 14), [0, 255, 0, 255]), "expected green pixel at (54, 14)");
        test.assert(arrayEquals(getimg(ctx, 94, 14), [0, 255, 0, 255]), "expected green pixel at (94, 14)");
        test.assert(arrayEquals(getimg(ctx, 134, 14), [0, 255, 0, 255]), "expected green pixel at (134, 14)");
        test.assert(arrayEquals(getimg(ctx, 174, 14), [0, 255, 0, 255]), "expected green pixel at (174, 14)");
      }
      img.src = diagram.makeImageData();
    }
  )); // end test

  gradticks.add(new Test('skip ticks', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          {
            graduatedMin: -23, graduatedMax: 77,
            graduatedTickBase: 1.2, graduatedTickUnit: 5
          },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape,
            {
              geometryString: "F M0 0 L0 5 L4 5 L4 0 Z",
              fill: "rgb(255,0,0)", stroke: "rgb(255,0,0)",
              graduatedSkip: function (v) { return v === -13.8; }
            }
          ),
          $(go.Shape, { geometryString: "F M0 0 L0 10 L4 10 L4 0 Z", fill: "rgb(0,255,0)", stroke: "rgb(0,255,0)", interval: 4 })
        )
      )
    },
    null,
    function (test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 24, 9), [255, 255, 255, 255]), "expected white pixel at (24, 9)"); // skipped
        test.assert(arrayEquals(getimg(ctx, 34, 9), [255, 0, 0, 255]), "expected red pixel at (34, 9)");
        test.assert(arrayEquals(getimg(ctx, 44, 9), [255, 0, 0, 255]), "expected red pixel at (44, 9)");
        test.assert(arrayEquals(getimg(ctx, 64, 9), [255, 0, 0, 255]), "expected red pixel at (64, 9)");
        test.assert(arrayEquals(getimg(ctx, 74, 9), [255, 0, 0, 255]), "expected red pixel at (74, 9)");
        test.assert(arrayEquals(getimg(ctx, 84, 9), [255, 0, 0, 255]), "expected red pixel at (84, 9)");
        test.assert(arrayEquals(getimg(ctx, 104, 9), [255, 0, 0, 255]), "expected red pixel at (104, 9)");
        test.assert(arrayEquals(getimg(ctx, 114, 9), [255, 0, 0, 255]), "expected red pixel at (114, 9)");
        test.assert(arrayEquals(getimg(ctx, 124, 9), [255, 0, 0, 255]), "expected red pixel at (124, 9)");
        test.assert(arrayEquals(getimg(ctx, 144, 9), [255, 0, 0, 255]), "expected red pixel at (144, 9)");
        test.assert(arrayEquals(getimg(ctx, 154, 9), [255, 0, 0, 255]), "expected red pixel at (154, 9)");
        test.assert(arrayEquals(getimg(ctx, 164, 9), [255, 0, 0, 255]), "expected red pixel at (164, 9)");
        test.assert(arrayEquals(getimg(ctx, 184, 9), [255, 0, 0, 255]), "expected red pixel at (184, 9)");
        test.assert(arrayEquals(getimg(ctx, 194, 9), [255, 0, 0, 255]), "expected red pixel at (194, 9)");
        test.assert(arrayEquals(getimg(ctx, 204, 9), [255, 0, 0, 255]), "expected red pixel at (204, 9)");
        // green
        test.assert(arrayEquals(getimg(ctx, 14, 14), [0, 255, 0, 255]), "expected green pixel at (14, 14)");
        test.assert(arrayEquals(getimg(ctx, 54, 14), [0, 255, 0, 255]), "expected green pixel at (54, 14)");
        test.assert(arrayEquals(getimg(ctx, 94, 14), [0, 255, 0, 255]), "expected green pixel at (94, 14)");
        test.assert(arrayEquals(getimg(ctx, 134, 14), [0, 255, 0, 255]), "expected green pixel at (134, 14)");
        test.assert(arrayEquals(getimg(ctx, 174, 14), [0, 255, 0, 255]), "expected green pixel at (174, 14)");
      }
      img.src = diagram.makeImageData({ background: "white" });
    }
  )); // end test

  gradticks.add(new Test('update interval', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "F M0 0 L0 5 L4 5 L4 0 Z", fill: "rgb(255,0,0)", stroke: "rgb(255,0,0)" }),
          $(go.Shape, { geometryString: "F M0 0 L0 10 L4 10 L4 0 Z", fill: "rgb(0,255,0)", stroke: "rgb(0,255,0)", interval: 4 })
        )
      )
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.iterator.first();
      diagram.startTransaction("update interval");
      node.elt(2).interval = 2;
      diagram.commitTransaction("update interval");
    },
    function (test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 28, 9), [255, 0, 0, 255]), "expected red pixel at (28, 9)");
        test.assert(arrayEquals(getimg(ctx, 68, 9), [255, 0, 0, 255]), "expected red pixel at (68, 9)");
        test.assert(arrayEquals(getimg(ctx, 108, 9), [255, 0, 0, 255]), "expected red pixel at (108, 9)");
        test.assert(arrayEquals(getimg(ctx, 148, 9), [255, 0, 0, 255]), "expected red pixel at (148, 9)");
        test.assert(arrayEquals(getimg(ctx, 188, 9), [255, 0, 0, 255]), "expected red pixel at (188, 9)");
        // green
        test.assert(arrayEquals(getimg(ctx, 8, 14), [0, 255, 0, 255]), "expected green pixel at (8, 14)");
        test.assert(arrayEquals(getimg(ctx, 48, 9), [0, 255, 0, 255]), "expected green pixel at (48, 14)");
        test.assert(arrayEquals(getimg(ctx, 88, 14), [0, 255, 0, 255]), "expected green pixel at (88, 14)");
        test.assert(arrayEquals(getimg(ctx, 128, 9), [0, 255, 0, 255]), "expected green pixel at (128, 14)");
        test.assert(arrayEquals(getimg(ctx, 168, 14), [0, 255, 0, 255]), "expected green pixel at (168, 14)");
        test.assert(arrayEquals(getimg(ctx, 208, 9), [0, 255, 0, 255]), "expected green pixel at (208, 14)");
      }
      img.src = diagram.makeImageData();
    }
  )); // end test

  gradticks.add(new Test('add interval', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "F M0 0 L0 5 L4 5 L4 0 Z", fill: "rgb(255,0,0)", stroke: "rgb(255,0,0)" })
        )
      )
    },
    function(test) {
      var diagram = test.diagram;
      var node = diagram.nodes.iterator.first();
      diagram.startTransaction("add interval");
      node.add($(go.Shape, { geometryString: "F M0 0 L0 10 L4 10 L4 0 Z", fill: "rgb(0,255,0)", stroke: "rgb(0,255,0)", interval: 2 }))
      diagram.commitTransaction("add interval");
    },
    function (test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 28, 9), [255, 0, 0, 255]), "expected red pixel at (28, 9)");
        test.assert(arrayEquals(getimg(ctx, 68, 9), [255, 0, 0, 255]), "expected red pixel at (68, 9)");
        test.assert(arrayEquals(getimg(ctx, 108, 9), [255, 0, 0, 255]), "expected red pixel at (108, 9)");
        test.assert(arrayEquals(getimg(ctx, 148, 9), [255, 0, 0, 255]), "expected red pixel at (148, 9)");
        test.assert(arrayEquals(getimg(ctx, 188, 9), [255, 0, 0, 255]), "expected red pixel at (188, 9)");
        // green
        test.assert(arrayEquals(getimg(ctx, 8, 14), [0, 255, 0, 255]), "expected green pixel at (8, 14)");
        test.assert(arrayEquals(getimg(ctx, 48, 9), [0, 255, 0, 255]), "expected green pixel at (48, 14)");
        test.assert(arrayEquals(getimg(ctx, 88, 14), [0, 255, 0, 255]), "expected green pixel at (88, 14)");
        test.assert(arrayEquals(getimg(ctx, 128, 9), [0, 255, 0, 255]), "expected green pixel at (128, 14)");
        test.assert(arrayEquals(getimg(ctx, 168, 14), [0, 255, 0, 255]), "expected green pixel at (168, 14)");
        test.assert(arrayEquals(getimg(ctx, 208, 9), [0, 255, 0, 255]), "expected green pixel at (208, 14)");
      }
      img.src = diagram.makeImageData();
    }
  )); // end test

  var skipCalls = 0;
  gradticks.add(new Test('skip call count, floating point', null,
    function (test) {
      skipCalls = 0;
      CommonSetup(test,
        $(go.Node, "Graduated",
          {
            graduatedMin: 0, graduatedMax: 0.0000000001, graduatedTickUnit: (0.0000000001 - 0) / 10
          },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.Shape, { geometryString: "M0 0 V10", graduatedSkip: v => { skipCalls++; } })
        )
      )
    },
    null,
    function (test) {
      test.assert(skipCalls == 11, "expected 11 calls to graduatedSkip function");
    }
  )); // end test

  var gradshadows = new TestCollection("graduated shadows");
  graduatedtests.add(gradshadows);

  gradshadows.add(new Test('unshadowed labels', null,
    function(test) {
      CommonSetup(test,
        $(go.Node, "Graduated", { isShadowed: true },
          $(go.Shape, { geometryString: "M0 0 H200" }),
          $(go.TextBlock, { segmentOffset: new go.Point(0, 12), shadowVisible: false })
        )
      )
    },
    null,
    function(test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // main shape should have shadow
        test.assert(!arrayEquals(getimg(ctx, 30, 10), [255, 255, 255, 255]), "expected non-white pixel at (30, 10)");
        // textblock shouldn't have shadow
        test.assert(arrayEquals(getimg(ctx, 10, 26), [255, 255, 255, 255]), "expected white pixel at (10, 26)");
      }
      img.src = diagram.makeImageData({ background: "white", size: new go.Size(300, 100), position: new go.Point(0, 0) });
    }
  )); // end test

  gradshadows.add(new Test('unshadowed when nested', null,
    function(test) {
      CommonSetup(test,
        $(go.Part, "Auto", { isShadowed: true },
          $(go.Shape, { fill: "white" }),
          $(go.Panel, "Graduated", { margin: 5 },
            $(go.Shape, { geometryString: "M0 0 H400" }), // the main shape
            $(go.TextBlock, { segmentOffset: new go.Point(0, 12) })
          )
        )
      )
    },
    null,
    function(test) {
      var diagram = test.diagram;

      var img = new Image();
      img.onload = function() {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // part should have shadow
        test.assert(!arrayEquals(getimg(ctx, 30, 46), [255, 255, 255, 255]), "expected shadowed pixel at (30, 46)");
        // textblock shouldn't have shadow
        test.assert(arrayEquals(getimg(ctx, 15, 32), [255, 255, 255, 255]), "expected white pixel at (15, 32)");
      }
      img.src = diagram.makeImageData({ background: "white", size: new go.Size(300, 100), position: new go.Point(0, 0) });
    }
  )); // end test

  var gradfunctions = new TestCollection("graduated functions");
  graduatedtests.add(gradfunctions);

  var gradptforval = new TestCollection("graduatedPointForValue");
  gradfunctions.add(gradptforval);

  gradptforval.add(new Test('min 0 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 0, graduatedMax: 100 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [0, new go.Point(.5, .5)],
          [50, new go.Point(100.5, .5)],
          [100, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradptforval.add(new Test('min 0 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 0, graduatedMax: 200 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [0, new go.Point(.5, .5)],
          [100, new go.Point(100.5, .5)],
          [200, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradptforval.add(new Test('min -10 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: -10, graduatedMax: 90 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [-10, new go.Point(.5, .5)],
          [40, new go.Point(100.5, .5)],
          [90, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradptforval.add(new Test('min -10 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: -10, graduatedMax: 190 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [-10, new go.Point(.5, .5)],
          [90, new go.Point(100.5, .5)],
          [190, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradptforval.add(new Test('min 10 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 10, graduatedMax: 110 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [10, new go.Point(.5, .5)],
          [60, new go.Point(100.5, .5)],
          [110, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradptforval.add(new Test('min 10 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 10, graduatedMax: 210 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, false,
        [
          [10, new go.Point(.5, .5)],
          [110, new go.Point(100.5, .5)],
          [210, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  var gradvalforpt = new TestCollection("graduatedValueForPoint");
  gradfunctions.add(gradvalforpt);

  gradvalforpt.add(new Test('min 0 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 0, graduatedMax: 100 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [0, new go.Point(.5, .5)],
          [50, new go.Point(100.5, .5)],
          [100, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradvalforpt.add(new Test('min 0 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 0, graduatedMax: 200 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [0, new go.Point(.5, .5)],
          [100, new go.Point(100.5, .5)],
          [200, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradvalforpt.add(new Test('min -10 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: -10, graduatedMax: 90 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [-10, new go.Point(.5, .5)],
          [40, new go.Point(100.5, .5)],
          [90, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradvalforpt.add(new Test('min -10 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: -10, graduatedMax: 190 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [-10, new go.Point(.5, .5)],
          [90, new go.Point(100.5, .5)],
          [190, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradvalforpt.add(new Test('min 10 range 100', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 10, graduatedMax: 110 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [10, new go.Point(.5, .5)],
          [60, new go.Point(100.5, .5)],
          [110, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

  gradvalforpt.add(new Test('min 10 range 200', null,
    function (test) {
      CommonSetup(test,
        $(go.Node, "Graduated",
          { graduatedMin: 10, graduatedMax: 210 },
          $(go.Shape, { geometryString: "M0 0 H200" })
        )
      )
    },
    null,
    function (test) {
      GradValPtCheck(test, true,
        [
          [10, new go.Point(.5, .5)],
          [110, new go.Point(100.5, .5)],
          [210, new go.Point(200.5, .5)]
        ]
      )
    }
  )); // end test

})(); // End test system