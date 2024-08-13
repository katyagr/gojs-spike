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

      // #endregion

      // #region Setups

      function TwoNodeTestSetup(test, toNodeSpot) {
        var m = new go.GraphLinksModel();
        m.nodeDataArray = [
          { key: 1, text: "n1", location: new go.Point(50, 50) },
          { key: 2, text: "n2", location: new go.Point(100 * toNodeSpot.x, 100 * toNodeSpot.y) }
        ];
        m.linkDataArray = [
          { from: 1, to: 2 }
        ];
        test.diagram.model = m;
      }

      function SelfNodeSetup(test, num) {
        var m = new go.GraphLinksModel();
        m.nodeDataArray = [
          { key: 1, text: "n1", location: new go.Point(50, 50) },
        ];
        var linkArray = [];
        for (var i = 0; i < num; i++) {
          var link = { from: 1, to: 1 };
          linkArray.push(link);
        }
        m.linkDataArray = linkArray;
        test.diagram.model = m;
      }

      // #endregion

      // #region Direction Tests

      function OrthoBezier_TwoNodes_Check(test, toNodeSpot) {
        var x = toNodeSpot.x;
        var y = toNodeSpot.y;

        var linkPoints = [];
        var nextX;
        if (y === 0) {
          linkPoints.push(new go.Point(50, 40));
          linkPoints.push(new go.Point(50, 30));
          linkPoints.push(new go.Point(50, 25));
          nextX = 100 * x;
          linkPoints.push(new go.Point(nextX, 25));
          linkPoints.push(new go.Point(nextX, 20));
          linkPoints.push(new go.Point(nextX, 10));
        } else if (y === 0.5) {
          if (x === 0) {
            linkPoints.push(new go.Point(40, 50));
            linkPoints.push(new go.Point(30, 50));
            linkPoints.push(new go.Point(25, 50));
            linkPoints.push(new go.Point(25, 50));
            linkPoints.push(new go.Point(20, 50));
            linkPoints.push(new go.Point(10, 50));
          } else if (x === 1) {
            linkPoints.push(new go.Point(60, 50));
            linkPoints.push(new go.Point(70, 50));
            linkPoints.push(new go.Point(75, 50));
            linkPoints.push(new go.Point(75, 50));
            linkPoints.push(new go.Point(80, 50));
            linkPoints.push(new go.Point(90, 50));
          }
        } else if (y === 1) {
          linkPoints.push(new go.Point(50, 60));
          linkPoints.push(new go.Point(50, 70));
          linkPoints.push(new go.Point(50, 75));
          nextX = 100 * x;
          linkPoints.push(new go.Point(nextX, 75));
          linkPoints.push(new go.Point(nextX, 80));
          linkPoints.push(new go.Point(nextX, 90));
        }
        var linkIter = test.diagram.links;
        linkIter.next();
        test.assertLinkPoints(linkIter.value, linkPoints);
      };

      // #endregion

      // #region Helper Functions
      function CheckNodes(points, test) {
        var nodes = [];
        var i;
        for (i = 0; i < points.length; i++) {
          nodes[i] = N(test,(i + 1).toString());
          CheckNodeLoc(nodes[i], points[i], 'Node n' + (i + 1).toString() + ' at ' + nodes[i].location.toString() + ', not ' + points[i].toString(), test);
        }
      };

      function N(test,key) {
        var model = test.diagram.model;
        var d = model.findNodeDataForKey(key);
        return test.diagram.findNodeForData(d, model);
      };

      function CheckNodeLoc(n, p, msg, test) {
        test.assert(test.isApproxPoint(n.location, p), msg);
      };
      // #endregion

      var LinkRoutingGeometryRoot = new TestCollection("Links");
      LinkRoutingGeometryRoot.preSetup = function(test) {
        // define the Node template
        var archnode = new go.Node("Spot");
        archnode.desiredSize = new go.Size(20, 20);
        var ns = new go.Shape();
        ns.figure = 'Rectangle';
        ns.fill = 'lightgray';
        ns.stroke = 'black';
        //  ns.strokeWidth = 10;
        ns.stretch = go.GraphObject.Fill;
        ns.portId = '';
        ns.alignment = go.Spot.Center;
        archnode.add(ns);
        var nt = new go.TextBlock();
        nt.alignment = go.Spot.Center;
        nt.bind(new go.Binding('text', 'text'));
        archnode.add(nt);
        archnode.locationSpot = go.Spot.Center;
        archnode.bind(new go.Binding('location', 'location'));
        // replace the default Node template in the nodeTemplateMap
        test.diagram.nodeTemplate = archnode;

        // define the Link Template
        var archlink = new go.Link();
        var archpath = new go.Shape();
        archlink.routing = go.Link.Orthogonal;
        archlink.curve = go.Link.Bezier;
        archpath.isPanelMain = true;
        archlink.add(archpath);
        test.diagram.linkTemplate = archlink;

        var $ = go.GraphObject.make;

        test.diagram.linkTemplateMap.add("TEST",
          $(go.Link,
            { relinkableFrom: true, relinkableTo: true, reshapable: true, resegmentable: true },
            new go.Binding("adjusting"),
            new go.Binding("corner"),
            new go.Binding("curve"),
            new go.Binding("curviness"),
            new go.Binding("routing"),
            new go.Binding("fromPortId"),
            new go.Binding("fromEndSegmentLength"),
            new go.Binding("fromShortLength"),
            new go.Binding("fromSpot"),
            new go.Binding("smoothness"),
            new go.Binding("toPortId"),
            new go.Binding("toEndSegmentLength"),
            new go.Binding("toShortLength"),
            new go.Binding("toSpot"),
            $(go.Shape,
              new go.Binding("stroke"),
              new go.Binding("strokeWidth")),
            $(go.Shape, { toArrow: "Standard" },
              new go.Binding("visible", "visibleArrowhead"))
          ));

        test.diagram.nodeTemplateMap.add("TwoSidePorts",
            $(go.Node, "Table",
              new go.Binding('location', 'location'),
              { minSize: new go.Size(NaN, 60) },
              new go.Binding("background", "color"),
              $(go.TextBlock,
                { column: 1, margin: 8, alignment: go.Spot.Center },
                new go.Binding("text", "text")),
              $(go.Shape,
                {
                  column: 0, width: 5, stretch: go.GraphObject.Vertical, alignment: go.Spot.Left,
                  strokeWidth: 0, fill: "transparent", cursor: "pointer",
                  portId: "in", toLinkable: true, toSpot: go.Spot.LeftSide
                }),
              $(go.Shape,
                {
                  column: 2, width: 5, stretch: go.GraphObject.Vertical, alignment: go.Spot.Right,
                  strokeWidth: 0, fill: "transparent", cursor: "pointer",
                  portId: "out", fromLinkable: true, fromSpot: go.Spot.RightSide
                })
            ));

        test.diagram.toolManager.linkingTool.archetypeLinkData = {
          category: "TEST", fromPortId: "out", fromSpot: go.Spot.RightSide, toPortId: "in", toSpot: go.Spot.LeftSide
        };

      } // end presetup

      TestRoot.add(LinkRoutingGeometryRoot);


      var Reflexives = new TestCollection("Reflexives");
      LinkRoutingGeometryRoot.add(Reflexives);

      Reflexives.add(new Test("Normal None None", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.None, toSpot: go.Spot.None }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M14.8 0.0 C29.8 26.0 -11.8 26.0 3.2 0.0");
        }
        ));

      Reflexives.add(new Test("Normal B B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M4.2 0.0 C19.2 26.0 -10.8 26.0 4.2 0.0");
        }
        ));

      Reflexives.add(new Test("Normal B T", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M0.0 25.6 C15.0 51.6 15.0 -20.4 0.0 5.6");
        }
        ));

      Reflexives.add(new Test("Normal R B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Right, toSpot: go.Spot.Bottom }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M10.0 0.0 C40.0 0.0 0.0 40.0 0.0 10.0");
        }
        ));

      Reflexives.add(new Test("Normal R L", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Right, toSpot: go.Spot.Left }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M25.6 11.3 C51.6 -3.8 -20.4 -3.7 5.6 11.3");
      }
        ));

      Reflexives.add(new Test("Orthogonal None None", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.None, toSpot: go.Spot.None, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M10.0 0.0 L30.0 0.0 L30.0 30.0 L0.0 30.0 L0.0 10.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal R B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray =[{ key : 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Right, toSpot: go.Spot.Bottom, routing: go.Link.Orthogonal
          }];
          test.diagram.model = m;
          },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M10.0 0.0 L30.0 0.0 L30.0 30.0 L0.0 30.0 L0.0 10.0");
          }
        ));

      Reflexives.add(new Test("Orthogonal B R", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray =[{
            key: 1, text: "n1" }];
            m.linkDataArray =[{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Right, routing: go.Link.Orthogonal }];
            test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M0.0 10.0 L0.0 30.0 L30.0 30.0 L30.0 0.0 L10.0 0.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal R B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{
            from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Right, toSpot: go.Spot.Bottom, routing: go.Link.Orthogonal
          }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M10.0 0.0 L30.0 0.0 L30.0 30.0 L0.0 30.0 L0.0 10.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal R L", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Right, toSpot: go.Spot.Left, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M40.0 0.0 L60.0 0.0 L60.0 18.0 L0.0 18.0 L0.0 0.0 L20.0 0.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal B T", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{ key: 1, text: "n1" }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M0.0 40.0 L0.0 60.0 L18.0 60.0 L18.0 0.0 L0.0 0.0 L0.0 20.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal B L", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{
            key: 1, text: "n1"
          }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Left, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M30.0 10.0 L30.0 30.0 L0.0 30.0 L0.0 0.0 L20.0 0.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal L B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{
            key: 1, text: "n1"
          }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Left, toSpot: go.Spot.Bottom, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M20.0 0.0 L0.0 0.0 L0.0 30.0 L30.0 30.0 L30.0 10.0");
        }
        ));

      Reflexives.add(new Test("Orthogonal B B", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [{
            key: 1, text: "n1"
          }];
          m.linkDataArray = [{ from: 1, to: 1, category: "TEST", curviness: 10, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom, routing: go.Link.Orthogonal }];
          test.diagram.model = m;
        },
        null,
        function(test) {
          test.assertLinkGeometry(test.diagram.links.first(), "M0.0 0.0 L20.0 0.0 L20.0 20.0 L0.0 20.0 L0.0 0.0");
        }
        ));


      var OrthoBezierRoot = new TestCollection('OrthoBezier');
      LinkRoutingGeometryRoot.add(OrthoBezierRoot);

      // #region Direction TestCollection

      var orthoBezier_Direction = new TestCollection('Direction');
      OrthoBezierRoot.add(orthoBezier_Direction);

      orthoBezier_Direction.add(new Test('To TopLeft Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.TopLeft) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.TopLeft);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M50.0 30.0 C50.0 22.5 52.5 17.5 50.0 15.0 C41.7 6.7 8.3 23.3 0.0 15.0 C-2.5 12.5 0.0 7.5 0.0 0.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To TopCenter Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.TopCenter) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.TopCenter);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M0.0 30.0 C0.0 0.0 0.0 15.0 0.0 0.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To TopRight Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.TopRight) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.TopRight);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M0.0 30.0 C0.0 22.5 -2.5 17.5 0.0 15.0 C8.3 6.7 41.7 23.3 50.0 15.0 C52.5 12.5 50.0 7.5 50.0 0.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To MiddleRight Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.MiddleRight) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.MiddleRight);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M0.0 0.0 C0.0 0.0 15.0 0.0 30.0 0.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To BottomRight Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.BottomRight) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.BottomRight);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M0.0 0.0 C0.0 7.5 -2.5 12.5 0.0 15.0 C8.3 23.3 41.7 6.7 50.0 15.0 C52.5 17.5 50.0 22.5 50.0 30.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To BottomCenter Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.BottomCenter) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.BottomCenter);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M0.0 0.0 C0.0 0.0 0.0 15.0 0.0 30.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To BottomLeft Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.BottomLeft) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.BottomLeft);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M50.0 0.0 C50.0 7.5 52.5 12.5 50.0 15.0 C41.7 23.3 8.3 6.7 0.0 15.0 C-2.5 17.5 0.0 22.5 0.0 30.0');
        }
      ));

      orthoBezier_Direction.add(new Test('To MiddleLeft Test', null,
        function(test) { TwoNodeTestSetup(test, go.Spot.MiddleLeft) },
        function(test) { },
        function(test) {
          OrthoBezier_TwoNodes_Check(test, go.Spot.MiddleLeft);
          var linkIter = test.diagram.links;
          linkIter.next();
          test.assertLinkGeometry(linkIter.value, 'M30.0 0.0 C0.0 0.0 15.0 0.0 0.0 0.0');
        }
      ));

      // #endregion

      // #region SelfTestCollection

      var orthoBezier_Self = new TestCollection('Self');
      OrthoBezierRoot.add(orthoBezier_Self);

      orthoBezier_Self.add(new Test('One Self Link', null,
        function(test) { SelfNodeSetup(test, 1) },
        function(test) { },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60.0, 50.0), new go.Point(86.0, 50.0), new go.Point(86.0, 86.0), new go.Point(68.0, 86.0), new go.Point(50.0, 86.0), new go.Point(50.0, 60.0)]
          ]);
        }
      ));

      orthoBezier_Self.add(new Test('Two Self Links', null,
        function(test) { SelfNodeSetup(test, 2) },
        function(test) { },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60.0, 50.0), new go.Point(77.0, 50.0), new go.Point(77.0, 77.0), new go.Point(63.5, 77.0), new go.Point(50.0, 77.0), new go.Point(50.0, 60.0)],
            [new go.Point(40.0, 50.0), new go.Point(23.0, 50.0), new go.Point(23.0, 23.0), new go.Point(36.5, 23.0), new go.Point(50.0, 23.0), new go.Point(50.0, 40.0)]
          ]);
        }
      ));

      orthoBezier_Self.add(new Test('Three Self Links', null,
        function(test) { SelfNodeSetup(test, 3) },
        function(test) { },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60.0, 50.0), new go.Point(84.0, 50.0), new go.Point(84.0, 84.0), new go.Point(67.0, 84.0), new go.Point(50.0, 84.0), new go.Point(50.0, 60.0)],
            [new go.Point(60.0, 50.0), new go.Point(70.0, 50.0), new go.Point(70.0, 70.0), new go.Point(60.0, 70.0), new go.Point(50.0, 70.0), new go.Point(50.0, 60.0)],
            [new go.Point(40.0, 50.0), new go.Point(16.0, 50.0), new go.Point(16.0, 16.0), new go.Point(33.0, 16.0), new go.Point(50.0, 16.0), new go.Point(50.0, 40.0)]
          ]);
        }
      ));

      orthoBezier_Self.add(new Test('Four Self Links', null,
        function(test) { SelfNodeSetup(test, 4) },
        function(test) { },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60.0,50.0), new go.Point(91.0,50.0), new go.Point(91.0,91.0), new go.Point(70.5,91.0), new go.Point(50.0,91.0), new go.Point(50.0,60.0)],
            [new go.Point(60.0, 50.0), new go.Point(77.0, 50.0), new go.Point(77.0, 77.0), new go.Point(63.5, 77.0), new go.Point(50.0, 77.0), new go.Point(50.0, 60.0)],
            [new go.Point(40.0, 50.0), new go.Point(23.0, 50.0), new go.Point(23.0, 23.0), new go.Point(36.5, 23.0), new go.Point(50.0, 23.0), new go.Point(50.0, 40.0)],
            [new go.Point(40.0, 50.0), new go.Point(9.0, 50.0), new go.Point(9.0, 9.0), new go.Point(29.5, 9.0), new go.Point(50.0, 9.0), new go.Point(50.0, 40.0)]
          ]);
        }
      ));

      // #endregion



      function CommonSetup2(test, props) {
        var m = new go.GraphLinksModel();
        m.nodeDataArray = [
          { key: 1, text: "n1", location: new go.Point(50, 50) },
          { key: 2, text: "n2", location: new go.Point(150, 50) }
        ];
        m.linkDataArray = [
          { from: 1, to: 2, category: "TEST" },
          { from: 1, to: 2, category: "TEST" }
        ];
        if (props) {
          // copy any properties to each link data object
          for (var i = 0; i < m.linkDataArray.length; i++) {
            var data = m.linkDataArray[i];
            for (var p in props) {
              data[p] = props[p];
            }
          }
        }
        test.diagram.model = m;
      }

      function CommonSetup3(test, props) {
        var $ = go.GraphObject.make;
        test.diagram.layout = $(go.LayeredDigraphLayout, { setsPortSpots: false });
        test.diagram.nodeTemplate =
          $(go.Node, "Auto",
            { width: 100, height: 120 },
            $(go.Shape, { fill: "lightgray", portId: "", fromSpot: go.Spot.LeftRightSides, toSpot: go.Spot.LeftRightSides }),
            $(go.TextBlock, new go.Binding("text", "key"))
          );

        var m = new go.GraphLinksModel();
        m.nodeDataArray = [
          { key: 1 },
          { key: 2 },
          { key: 3 }
        ];
        m.linkDataArray = [
          { category: "TEST", text: "1-2a", from: 1, to: 2, visibleArrowhead: false, visibleLabel: true },
          { category: "TEST", text: "1-2b", from: 1, to: 2, visibleArrowhead: false, visibleLabel: true },
          { category: "TEST", text: "1-3", from: 1, to: 3, visibleArrowhead: false, visibleLabel: true },
          { category: "TEST", text: "3-2", from: 3, to: 2, visibleArrowhead: false, visibleLabel: true }
        ];
        if (props) {
          // copy any properties to each link data object
          for (var i = 0; i < m.linkDataArray.length; i++) {
            var data = m.linkDataArray[i];
            for (var p in props) {
              data[p] = props[p];
            }
          }
        }
        test.diagram.model = m;
      }

      var StraightColl = new TestCollection("Straight");
      LinkRoutingGeometryRoot.add(StraightColl);

      StraightColl.add(new Test("simple 2", null,
        function(test) { CommonSetup2(test); },
        null,
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 50), new go.Point(100, 43), new go.Point(140, 50)],
            [new go.Point(60, 50), new go.Point(100, 57), new go.Point(140, 50)]
          ]);
        }
      ));

      StraightColl.add(new Test("simple 2 move", null,
        function(test) { CommonSetup2(test); },
        function(test) {
          var d2 = test.diagram.model.nodeDataArray[1];
          test.diagram.model.setDataProperty(d2, "location", new go.Point(150, 150));
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 60), new go.Point(105.0, 95.0), new go.Point(140, 140)],
            [new go.Point(60, 60), new go.Point(95.0, 105.0), new go.Point(140, 140)]
          ]);
        }
      ));

      StraightColl.add(new Test("simple 2 stretch", null,
        function(test) { CommonSetup2(test, { adjusting: go.Link.Stretch }); },
        null,
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 50), new go.Point(100, 43), new go.Point(140, 50)],
            [new go.Point(60, 50), new go.Point(100, 57), new go.Point(140, 50)]
          ]);
        }
      ));

      StraightColl.add(new Test("simple 2 stretch move", null,
        function(test) { CommonSetup2(test, { adjusting: go.Link.Stretch }); },
        function(test) {
          var d2 = test.diagram.model.nodeDataArray[1];
          test.diagram.model.setDataProperty(d2, "location", new go.Point(150, 150));
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 56.8), new go.Point(106.5, 93.5), new go.Point(143.0, 140.0)],
            [new go.Point(59.3, 60), new go.Point(94.7, 105.2), new go.Point(140.0, 140.6)]
          ]);
        }
      ));

      StraightColl.add(new Test("jumpOver with only 2 points", null,
        function(test) {
          var $ = go.GraphObject.make;
          var diagram = test.diagram;
          diagram.reset();

          diagram.nodeTemplate =
            $(go.Node,
              { locationSpot: go.Spot.Center },
              new go.Binding("location"),
              $(go.Shape, { fill: "white", width: 30, height: 30 })
            );

          diagram.linkTemplate =
            $(go.Link,
              { curve: go.Link.JumpOver },
              $(go.Shape)
            );

          diagram.model = new go.GraphLinksModel([
            { key: 1, location: new go.Point(0, 0) },
            { key: 2, location: new go.Point(100, 0) },
            { key: 3, location: new go.Point(50, -50) },
            { key: 4, location: new go.Point(50, 50) }
          ], [
            { from: 1, to: 2 },
            { from: 3, to: 4 }
          ]);
        },
        function(test) {
          var diagram = test.diagram;
          var link0 = diagram.findLinkForData(diagram.model.linkDataArray[0]);
          var link1 = diagram.findLinkForData(diagram.model.linkDataArray[1]);
          var g0 = link0.path.geometry;
          var g1 = link1.path.geometry;
          test.assert(g0.type === go.Geometry.Path || g1.type === go.Geometry.Path, "at least one Link.path Geometry must be of type Path");
          if (g0.type === go.Geometry.Path || g1.type === go.Geometry.Path) {
            var segs0 = g0.figures.first().segments.count;
            var segs1 = g1.figures.first().segments.count;
            test.assert(segs0 >= 3 || segs1 >= 3, "at least one Geometry PathFigure must have multiple segments");
          }
        }
      ));

      StraightColl.add(new Test("dups 3 move", null,
        function(test) { CommonSetup3(test, { stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          //test.dumpLinkPoints();
          test.assertAllLinkPoints([
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      StraightColl.add(new Test("dups 3 Stretch", null,
        function(test) { CommonSetup3(test, { adjusting: go.Link.Stretch, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      StraightColl.add(new Test("dups 3 Scale", null,
        function(test) { CommonSetup3(test, { adjusting: go.Link.Scale, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      StraightColl.add(new Test("dups 3 End", null,
        function(test) { CommonSetup3(test, { adjusting: go.Link.End, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(135.0,145.0), new go.Point(255.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(135.0,180.0), new go.Point(255.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      var CurvedColl = new TestCollection("Curved");
      LinkRoutingGeometryRoot.add(CurvedColl);

      CurvedColl.add(new Test("simple 2", null,
        function(test) { CommonSetup2(test, { curve: go.Link.Bezier }); },
        null,
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 48.1), new go.Point(86.7, 43), new go.Point(113.3, 43), new go.Point(140, 48.1)],
            [new go.Point(60, 51.9), new go.Point(86.7, 57), new go.Point(113.3, 57), new go.Point(140, 51.9)]
          ]);
        }
      ));

      CurvedColl.add(new Test("simple 2 move", null,
        function(test) { CommonSetup2(test, { curve: go.Link.Bezier }); },
        function(test) {
          var d2 = test.diagram.model.nodeDataArray[1];
          test.diagram.model.setDataProperty(d2, "location", new go.Point(150, 150));
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 57.6), new go.Point(91.6, 81.7), new go.Point(118.3, 108.4), new go.Point(142.4, 140)],
            [new go.Point(57.6, 60), new go.Point(81.7, 91.6), new go.Point(108.4, 118.3), new go.Point(140, 142.4)]
          ]);
        }
      ));

      CurvedColl.add(new Test("simple 2 stretch", null,
        function(test) { CommonSetup2(test, { curve: go.Link.Bezier, adjusting: go.Link.Stretch }); },
        null,
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 48.1), new go.Point(86.7, 43), new go.Point(113.3, 43), new go.Point(140, 48.1)],
            [new go.Point(60, 51.9), new go.Point(86.7, 57), new go.Point(113.3, 57), new go.Point(140, 51.9)]
          ]);
        }
      ));

      CurvedColl.add(new Test("simple 2 stretch move", null,
        function(test) { CommonSetup2(test, { curve: go.Link.Bezier, adjusting: go.Link.Stretch }); },
        function(test) {
          var d2 = test.diagram.model.nodeDataArray[1];
          test.diagram.model.setDataProperty(d2, "location", new go.Point(150, 150));
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(60, 55.9), new go.Point(91.5, 80.4), new go.Point(119.3, 108.4), new go.Point(143.5, 140)],
            [new go.Point(60, 59.9), new go.Point(83.0, 90.3), new go.Point(109.7, 117.0), new go.Point(140, 140.1)]
          ]);
        }
      ));

      CurvedColl.add(new Test("dups 3 move", null,
        function(test) { CommonSetup3(test, { curve: go.Link.Bezier, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      CurvedColl.add(new Test("dups 3 Stretch", null,
        function(test) { CommonSetup3(test, { curve: go.Link.Bezier, adjusting: go.Link.Stretch, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      CurvedColl.add(new Test("dups 3 Scale", null,
        function(test) { CommonSetup3(test, { curve: go.Link.Bezier, adjusting: go.Link.Scale, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));

      CurvedColl.add(new Test("dups 3 End", null,
        function(test) { CommonSetup3(test, { curve: go.Link.Bezier, adjusting: go.Link.End, stroke: "rgba(0,200,100,0.5)", strokeWidth: 30 }); },
        function(test) {
          var diag = test.diagram;
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ]);

          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y + 20);
          diag.commitTransaction("moved node down");
          diag.startTransaction();
          var n = diag.findNodeForKey(2);
          n.location = new go.Point(n.location.x, n.location.y - 20);
          diag.commitTransaction("moved node down");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0,145.0), new go.Point(110.0,145.0), new go.Point(110.0,145.0), new go.Point(147.5,145.0), new go.Point(195.0,145.0), new go.Point(195.0,145.0), new go.Point(242.5,145.0), new go.Point(280.0,145.0), new go.Point(280.0,145.0), new go.Point(290.0,145.0)],
            [new go.Point(100.0,175.0), new go.Point(110.0,175.0), new go.Point(110.0,180.0), new go.Point(147.5,180.0), new go.Point(195.0,180.0), new go.Point(195.0,180.0), new go.Point(242.5,180.0), new go.Point(280.0,180.0), new go.Point(280.0,175.0), new go.Point(290.0,175.0)],
            [new go.Point(100.0,115.0), new go.Point(110.0,115.0), new go.Point(135.0,60.0), new go.Point(145.0,60.0)],
            [new go.Point(245.0,60.0), new go.Point(255.0,60.0), new go.Point(280.0,115.0), new go.Point(290.0,115.0)]
          ])
        }
      ));


      var SidesRoot = new TestCollection("Sides");
      LinkRoutingGeometryRoot.add(SidesRoot);

      SidesRoot.add(new Test("spread", null,
        function(test) { CommonSetup2(test, { fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide }); },
        function(test) { },
        function(test) {
          var it = test.diagram.links;
          it.next(); var l1pts = it.value.points;
          it.next(); var l2pts = it.value.points;
          // the two links should be horizontal and parallel but not coinciding
          test.assert(
              l1pts.length === 4 && l2pts.length === 4 &&
              l1pts.elt(0).x === l2pts.elt(0).x && Math.abs(l1pts.elt(0).y - l2pts.elt(0).y) > 2 &&
              l1pts.elt(3).x === l2pts.elt(3).x && Math.abs(l1pts.elt(3).y - l2pts.elt(3).y) > 2
            );
        }
      ));

      SidesRoot.add(new Test("straight", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [
            { key: 1, text: "n1", location: new go.Point(50, 50) },
            { key: 2, text: "n2", location: new go.Point(150, 50) },
            { key: 3, text: "n3", location: new go.Point(250, 50) }
          ];
          m.linkDataArray = [
            { from: 1, to: 2, category: "TEST", fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide },
            { from: 2, to: 3, category: "TEST", fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide }
          ];
          test.diagram.model = m;
        },
        function(test) { },
        function(test) {
          var it = test.diagram.links;
          it.next(); var l1pts = it.value.points;
          it.next(); var l2pts = it.value.points;
          // the two links should be horizontal and at the same Y
          test.assert(
              l1pts.length === 4 && l2pts.length === 4 &&
              Math.abs(l1pts.elt(0).y - l2pts.elt(0).y) < 0.5 &&
              Math.abs(l1pts.elt(3).y - l2pts.elt(3).y) < 0.5
            );
        }
      ));

      SidesRoot.add(new Test("straight, two Side ports", null,
        function(test) {
          var m = new go.GraphLinksModel();
          m.nodeDataArray = [
            { key: 1, text: "n1", location: new go.Point(50, 50), category: "TwoSidePorts", color: "orange" },
            { key: 2, text: "n2", location: new go.Point(150, 50), category: "TwoSidePorts", color: "lightyellow" },
            { key: 3, text: "n3", location: new go.Point(250, 50), category: "TwoSidePorts", color: "lightgreen" }
          ];
          m.linkDataArray = [
            { from: 1, to: 2, category: "TEST", fromPortId: "out", fromSpot: go.Spot.RightSide, toPortId: "in", toSpot: go.Spot.LeftSide },
            { from: 2, to: 3, category: "TEST", fromPortId: "out", fromSpot: go.Spot.RightSide, toPortId: "in", toSpot: go.Spot.LeftSide }
          ];
          test.diagram.model = m;
        },
        function(test) { },
        function(test) {
          var it = test.diagram.links;
          it.next(); var l1pts = it.value.points;
          it.next(); var l2pts = it.value.points;
          // the two links should be horizontal and at the same Y
          test.assert(
              l1pts.length === 4 && l2pts.length === 4 &&
              Math.abs(l1pts.elt(0).y - l2pts.elt(0).y) < 0.5 &&
              Math.abs(l1pts.elt(3).y - l2pts.elt(3).y) < 0.5
            );
        }
      ));


      function SetupSides(test, spot, reverse) {
        test.diagram.reset();

        test.diagram.nodeTemplate =
          $(go.Node, "Auto",
            { width: 50, height: 50, locationSpot: go.Spot.Center },
            new go.Binding("location"),
            $(go.Shape, { fill: "lightgray" }),
            $(go.TextBlock, new go.Binding("text"))
          );

        test.diagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.Orthogonal, corner: 10 },
            reverse ? { toSpot: spot } : { fromSpot: spot },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" })
          );

        var links = [];
        for (var i = 2; i <= 9; i++) links.push(reverse ? { from: i, to: 1 } : { from: 1, to: i });

        test.diagram.model = new go.GraphLinksModel(
          [
            { key: 1, text: "root", location: new go.Point(0, 0) },
            { key: 2, text: "T1", location: new go.Point(-40, -100) },
            { key: 3, text: "T2", location: new go.Point(40, -100) },
            { key: 4, text: "L1", location: new go.Point(-100, -40) },
            { key: 5, text: "L2", location: new go.Point(-100, 40) },
            { key: 6, text: "R1", location: new go.Point(100, -40) },
            { key: 7, text: "R2", location: new go.Point(100, 40) },
            { key: 8, text: "B1", location: new go.Point(-40, 100) },
            { key: 9, text: "B2", location: new go.Point(40, 100) }
          ],
          links);
      }

      function DumpSidesEnds(test) {
        var str = "[";
        test.diagram.links.each(function(l) {
          if (str.length > 2) str += ",";
          var p0 = l.getPoint(0);
          var p5 = l.getPoint(5);
          str += "[\"" + p0.x.toFixed(1) + " " + p0.y.toFixed(1) + "\",\"" + p5.x.toFixed(1) + " " + p5.y.toFixed(1) + "\"]";
        });
        str += "]";
        test.assert(str);
      }

      function CheckSidesEnds(test, ends, reverse) {
        var msg = "";
        var i = 0;
        test.diagram.links.each(function(l) {
          if (l.pointsCount !== 6) msg += "\nwrong number of points in route, should be 6, is: " + l.pointsCount;
          var p0 = l.getPoint(reverse ? 5 : 0);
          var p5 = l.getPoint(reverse ? 0 : 5);
          var q0 = go.Point.parse(ends[i][0]);
          var q5 = go.Point.parse(ends[i][1]);
          if (!test.isApproxPoint(p0, q0)) msg += "\np(0) should be " + q0.toString() + " but is " + p0.toString();
          if (!test.isApproxPoint(p5, q5)) msg += "\np(5) should be " + q5.toString() + " but is " + p5.toString();
          i++;
        });
        if (msg) test.assert(false, msg);
      }


      SidesRoot.add(new Test("None", null,
        function(test) { SetupSides(test, go.Spot.None); },
        function(test) { CheckSidesEnds(test, [["0.0 -25.0","-40.0 -75.0"],["0.0 -25.0","40.0 -75.0"],["-25.0 0.0","-75.0 -40.0"],["-25.0 0.0","-75.0 40.0"],["25.0 0.0","75.0 -40.0"],["25.0 0.0","75.0 40.0"],["0.0 25.0","-40.0 75.0"],["0.0 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("TopSide", null,
        function(test) { SetupSides(test, go.Spot.TopSide); },
        function(test) { CheckSidesEnds(test, [["-2.8 -25.0","-40.0 -75.0"],["2.8 -25.0","40.0 -75.0"],["-8.3 -25.0","-75.0 -40.0"],["-13.9 -25.0","-75.0 40.0"],["8.3 -25.0","75.0 -40.0"],["13.9 -25.0","75.0 40.0"],["-19.4 -25.0","-40.0 75.0"],["19.4 -25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("LeftSide", null,
        function(test) { SetupSides(test, go.Spot.LeftSide); },
        function(test) { CheckSidesEnds(test, [["-25.0 -8.3","-40.0 -75.0"],["-25.0 -13.9","40.0 -75.0"],["-25.0 -2.8","-75.0 -40.0"],["-25.0 2.8","-75.0 40.0"],["-25.0 -19.4","75.0 -40.0"],["-25.0 19.4","75.0 40.0"],["-25.0 8.3","-40.0 75.0"],["-25.0 13.9","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("RightSide", null,
        function(test) { SetupSides(test, go.Spot.RightSide); },
        function(test) { CheckSidesEnds(test, [["25.0 -13.9","-40.0 -75.0"],["25.0 -8.3","40.0 -75.0"],["25.0 -19.4","-75.0 -40.0"],["25.0 19.4","-75.0 40.0"],["25.0 -2.8","75.0 -40.0"],["25.0 2.8","75.0 40.0"],["25.0 13.9","-40.0 75.0"],["25.0 8.3","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("BottomSide", null,
        function(test) { SetupSides(test, go.Spot.BottomSide); },
        function(test) { CheckSidesEnds(test, [["-19.4 25.0","-40.0 -75.0"],["19.4 25.0","40.0 -75.0"],["-13.9 25.0","-75.0 -40.0"],["-8.3 25.0","-75.0 40.0"],["13.9 25.0","75.0 -40.0"],["8.3 25.0","75.0 40.0"],["-2.8 25.0","-40.0 75.0"],["2.8 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("TopBottomSides", null,
        function(test) { SetupSides(test, go.Spot.TopBottomSides); },
        function(test) { CheckSidesEnds(test, [["-5.0 -25.0","-40.0 -75.0"],["5.0 -25.0","40.0 -75.0"],["-15.0 -25.0","-75.0 -40.0"],["-15.0 25.0","-75.0 40.0"],["15.0 -25.0","75.0 -40.0"],["15.0 25.0","75.0 40.0"],["-5.0 25.0","-40.0 75.0"],["5.0 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("LeftRightSides", null,
        function(test) { SetupSides(test, go.Spot.LeftRightSides); },
        function(test) { CheckSidesEnds(test, [["-25.0 -15.0","-40.0 -75.0"],["25.0 -15.0","40.0 -75.0"],["-25.0 -5.0","-75.0 -40.0"],["-25.0 5.0","-75.0 40.0"],["25.0 -5.0","75.0 -40.0"],["25.0 5.0","75.0 40.0"],["-25.0 15.0","-40.0 75.0"],["25.0 15.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("NotTopSide", null,
        function(test) { SetupSides(test, go.Spot.NotTopSide); },
        function(test) { CheckSidesEnds(test, [["-25.0 -12.5","-40.0 -75.0"],["25.0 -12.5","40.0 -75.0"],["-25.0 0.0","-75.0 -40.0"],["-25.0 12.5","-75.0 40.0"],["25.0 0.0","75.0 -40.0"],["25.0 12.5","75.0 40.0"],["-8.3 25.0","-40.0 75.0"],["8.3 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("NotLeftSide", null,
        function(test) { SetupSides(test, go.Spot.NotLeftSide); },
        function(test) { CheckSidesEnds(test, [["0.0 -25.0","-40.0 -75.0"],["12.5 -25.0","40.0 -75.0"],["-12.5 -25.0","-75.0 -40.0"],["-12.5 25.0","-75.0 40.0"],["25.0 -8.3","75.0 -40.0"],["25.0 8.3","75.0 40.0"],["0.0 25.0","-40.0 75.0"],["12.5 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("NotRightSide", null,
        function(test) { SetupSides(test, go.Spot.NotRightSide); },
        function(test) { CheckSidesEnds(test, [["-12.5 -25.0","-40.0 -75.0"],["0.0 -25.0","40.0 -75.0"],["-25.0 -8.3","-75.0 -40.0"],["-25.0 8.3","-75.0 40.0"],["12.5 -25.0","75.0 -40.0"],["12.5 25.0","75.0 40.0"],["-12.5 25.0","-40.0 75.0"],["0.0 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("NotBottomSide", null,
        function(test) { SetupSides(test, go.Spot.NotBottomSide); },
        function(test) { CheckSidesEnds(test, [["-8.3 -25.0","-40.0 -75.0"],["8.3 -25.0","40.0 -75.0"],["-25.0 -12.5","-75.0 -40.0"],["-25.0 0.0","-75.0 40.0"],["25.0 -12.5","75.0 -40.0"],["25.0 0.0","75.0 40.0"],["-25.0 12.5","-40.0 75.0"],["25.0 12.5","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("AllSides", null,
        function(test) { SetupSides(test, go.Spot.AllSides); },
        function(test) { CheckSidesEnds(test, [["-8.3 -25.0","-40.0 -75.0"],["8.3 -25.0","40.0 -75.0"],["-25.0 -8.3","-75.0 -40.0"],["-25.0 8.3","-75.0 40.0"],["25.0 -8.3","75.0 -40.0"],["25.0 8.3","75.0 40.0"],["-8.3 25.0","-40.0 75.0"],["8.3 25.0","40.0 75.0"]]); }
      ));

      SidesRoot.add(new Test("None", null,
        function(test) { SetupSides(test, go.Spot.None, true); },
        function(test) { CheckSidesEnds(test, [["0.0 -25.0","-40.0 -75.0"],["0.0 -25.0","40.0 -75.0"],["-25.0 0.0","-75.0 -40.0"],["-25.0 0.0","-75.0 40.0"],["25.0 0.0","75.0 -40.0"],["25.0 0.0","75.0 40.0"],["0.0 25.0","-40.0 75.0"],["0.0 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("TopSide", null,
        function(test) { SetupSides(test, go.Spot.TopSide, true); },
        function(test) { CheckSidesEnds(test, [["-2.8 -25.0","-40.0 -75.0"],["2.8 -25.0","40.0 -75.0"],["-8.3 -25.0","-75.0 -40.0"],["-13.9 -25.0","-75.0 40.0"],["8.3 -25.0","75.0 -40.0"],["13.9 -25.0","75.0 40.0"],["-19.4 -25.0","-40.0 75.0"],["19.4 -25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("LeftSide", null,
        function(test) { SetupSides(test, go.Spot.LeftSide, true); },
        function(test) { CheckSidesEnds(test, [["-25.0 -8.3","-40.0 -75.0"],["-25.0 -13.9","40.0 -75.0"],["-25.0 -2.8","-75.0 -40.0"],["-25.0 2.8","-75.0 40.0"],["-25.0 -19.4","75.0 -40.0"],["-25.0 19.4","75.0 40.0"],["-25.0 8.3","-40.0 75.0"],["-25.0 13.9","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("RightSide", null,
        function(test) { SetupSides(test, go.Spot.RightSide, true); },
        function(test) { CheckSidesEnds(test, [["25.0 -13.9","-40.0 -75.0"],["25.0 -8.3","40.0 -75.0"],["25.0 -19.4","-75.0 -40.0"],["25.0 19.4","-75.0 40.0"],["25.0 -2.8","75.0 -40.0"],["25.0 2.8","75.0 40.0"],["25.0 13.9","-40.0 75.0"],["25.0 8.3","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("BottomSide", null,
        function(test) { SetupSides(test, go.Spot.BottomSide, true); },
        function(test) { CheckSidesEnds(test, [["-19.4 25.0","-40.0 -75.0"],["19.4 25.0","40.0 -75.0"],["-13.9 25.0","-75.0 -40.0"],["-8.3 25.0","-75.0 40.0"],["13.9 25.0","75.0 -40.0"],["8.3 25.0","75.0 40.0"],["-2.8 25.0","-40.0 75.0"],["2.8 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("TopBottomSides", null,
        function(test) { SetupSides(test, go.Spot.TopBottomSides, true); },
        function(test) { CheckSidesEnds(test, [["-5.0 -25.0","-40.0 -75.0"],["5.0 -25.0","40.0 -75.0"],["-15.0 -25.0","-75.0 -40.0"],["-15.0 25.0","-75.0 40.0"],["15.0 -25.0","75.0 -40.0"],["15.0 25.0","75.0 40.0"],["-5.0 25.0","-40.0 75.0"],["5.0 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("LeftRightSides", null,
        function(test) { SetupSides(test, go.Spot.LeftRightSides, true); },
        function(test) { CheckSidesEnds(test, [["-25.0 -15.0","-40.0 -75.0"],["25.0 -15.0","40.0 -75.0"],["-25.0 -5.0","-75.0 -40.0"],["-25.0 5.0","-75.0 40.0"],["25.0 -5.0","75.0 -40.0"],["25.0 5.0","75.0 40.0"],["-25.0 15.0","-40.0 75.0"],["25.0 15.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("NotTopSide", null,
        function(test) { SetupSides(test, go.Spot.NotTopSide, true); },
        function(test) { CheckSidesEnds(test, [["-25.0 -12.5","-40.0 -75.0"],["25.0 -12.5","40.0 -75.0"],["-25.0 0.0","-75.0 -40.0"],["-25.0 12.5","-75.0 40.0"],["25.0 0.0","75.0 -40.0"],["25.0 12.5","75.0 40.0"],["-8.3 25.0","-40.0 75.0"],["8.3 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("NotLeftSide", null,
        function(test) { SetupSides(test, go.Spot.NotLeftSide, true); },
        function(test) { CheckSidesEnds(test, [["0.0 -25.0","-40.0 -75.0"],["12.5 -25.0","40.0 -75.0"],["-12.5 -25.0","-75.0 -40.0"],["-12.5 25.0","-75.0 40.0"],["25.0 -8.3","75.0 -40.0"],["25.0 8.3","75.0 40.0"],["0.0 25.0","-40.0 75.0"],["12.5 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("NotRightSide", null,
        function(test) { SetupSides(test, go.Spot.NotRightSide, true); },
        function(test) { CheckSidesEnds(test, [["-12.5 -25.0","-40.0 -75.0"],["0.0 -25.0","40.0 -75.0"],["-25.0 -8.3","-75.0 -40.0"],["-25.0 8.3","-75.0 40.0"],["12.5 -25.0","75.0 -40.0"],["12.5 25.0","75.0 40.0"],["-12.5 25.0","-40.0 75.0"],["0.0 25.0","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("NotBottomSide", null,
        function(test) { SetupSides(test, go.Spot.NotBottomSide, true); },
        function(test) { CheckSidesEnds(test, [["-8.3 -25.0","-40.0 -75.0"],["8.3 -25.0","40.0 -75.0"],["-25.0 -12.5","-75.0 -40.0"],["-25.0 0.0","-75.0 40.0"],["25.0 -12.5","75.0 -40.0"],["25.0 0.0","75.0 40.0"],["-25.0 12.5","-40.0 75.0"],["25.0 12.5","40.0 75.0"]], true); }
      ));

      SidesRoot.add(new Test("AllSides", null,
        function(test) { SetupSides(test, go.Spot.AllSides, true); },
        function(test) { CheckSidesEnds(test, [["-8.3 -25.0","-40.0 -75.0"],["8.3 -25.0","40.0 -75.0"],["-25.0 -8.3","-75.0 -40.0"],["-25.0 8.3","-75.0 40.0"],["25.0 -8.3","75.0 -40.0"],["25.0 8.3","75.0 40.0"],["-8.3 25.0","-40.0 75.0"],["8.3 25.0","40.0 75.0"]], true); }
      ));


      function CommonSetupLabels(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplate =
          $(go.Node,
            { fromLinkable: true, toLinkable: true },
            new go.Binding("location", "loc", go.Point.parse),
            new go.Binding("fromSpot"),
            new go.Binding("toSpot"),
            $(go.Shape, { fill: "lightblue" }));
        test.diagram.linkTemplate =
          $(go.Link,
            { reshapable: true, relinkableFrom: true, relinkableTo: true },
            new go.Binding("routing"),
            new go.Binding("curve"),
            $(go.Shape, new go.Binding("stroke")),
            $(go.TextBlock, "mid", { textAlign: "center", background: "gray", width: 25, height: 15 },
              new go.Binding("width")));
        test.diagram.model.nodeDataArray = [
          { key: 1, loc: "0 0" },
          { key: 2, loc: "200 0" },
          { key: 3, loc: "50 200" }
        ];
        test.diagram.model.linkDataArray = [
          { from: 1, to: 3 }
        ];
        test.diagram.undoManager.isEnabled = true;
      }

      var OverlappingRoot = new TestCollection("Overlapping Ports");
      LinkRoutingGeometryRoot.add(OverlappingRoot);

      OverlappingRoot.add(new Test("ports overlap 75", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("position"),
              { width: 100, height: 50 },
              $(go.Shape, { fill: "lightgray" }),
              $(go.TextBlock,
                new go.Binding("text", "key"))
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "F", position: new go.Point(0, 0) },
              { key: "T", position: new go.Point(75, 0) }
            ],
            [
              { from: "F", to: "T" }
            ]);
        },
        function(test) {
          var diag = test.diagram;
          var link = diag.links.first();
          test.assert(link.getPoint(0).x < link.getPoint(1).x, "link isn't pointing rightwards");
        }));

      OverlappingRoot.add(new Test("ports overlap 50", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("position"),
              { width: 100, height: 50 },
              $(go.Shape, { fill: "lightgray" }),
              $(go.TextBlock,
                new go.Binding("text", "key"))
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "F", position: new go.Point(0, 0) },
              { key: "T", position: new go.Point(50, 0) }
            ],
            [
              { from: "F", to: "T" }
            ]);
        },
        function(test) {
          var diag = test.diagram;
          var link = diag.links.first();
          test.assert(link.getPoint(0).x < link.getPoint(1).x, "link isn't pointing rightwards");
        }));

      OverlappingRoot.add(new Test("ports overlap 25", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("position"),
              { width: 100, height: 50 },
              $(go.Shape, { fill: "lightgray" }),
              $(go.TextBlock,
                new go.Binding("text", "key"))
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "F", position: new go.Point(0, 0) },
              { key: "T", position: new go.Point(25, 0) }
            ],
            [
              { from: "F", to: "T" }
            ]);
        },
        function(test) {
          var diag = test.diagram;
          var link = diag.links.first();
          test.assert(link.getPoint(0).x < link.getPoint(1).x, "link isn't pointing rightwards");
        }));

      OverlappingRoot.add(new Test("ports overlap zero", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("position"),
              { width: 100, height: 50 },
              $(go.Shape, { fill: "lightgray" }),
              $(go.TextBlock,
                new go.Binding("text", "key"))
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "F", position: new go.Point(0, 0) },
              { key: "T", position: new go.Point(0, 0) }
            ],
            [
              { from: "F", to: "T" }
            ]);
        },
        function(test) {
          var diag = test.diagram;
          var link = diag.links.first();
          test.assert(link.getPoint(0).x <= link.getPoint(1).x, "link is pointing leftwards");
        }));

      OverlappingRoot.add(new Test("epsilon dx", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              new go.Binding("position"),
              { width: 100, height: 50 },
              $(go.Shape, "RoundedRectangle", { fill: "lightgray" }),
              $(go.TextBlock,
                new go.Binding("text", "key"))
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "F", position: new go.Point(0, 0) },
              { key: "T", position: new go.Point(-1e-13, 0) }
            ],
            [
              { from: "F", to: "T" }
            ]);
        },
        function(test) {
          test.assert(true, "avoided extremely long iteration");
          var diag = test.diagram;
          var link = diag.links.first();
          //test.assert(link.getPoint(0).x < link.getPoint(1).x, "link isn't pointing rightwards");
        }));


      var AvoidsRoot = new TestCollection("AvoidsNodes");
      LinkRoutingGeometryRoot.add(AvoidsRoot);

      function AvoidsNodesSetup(test) {
        var $ = go.GraphObject.make;
        var diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate =
          $(go.Node,
            new go.Binding("position"),
            new go.Binding("avoidableMargin"),
            $(go.Shape, { strokeWidth: 0, fill: "lightgray" },
              new go.Binding("desiredSize"))
          );
        diagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.AvoidsNodes },
            new go.Binding("adjusting"),
            $(go.Shape)
          );

        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, position: new go.Point(100, 0), desiredSize: new go.Size(50, 50) },
            { key: 2, position: new go.Point(0, 200), desiredSize: new go.Size(250, 50) },
            { key: 3, position: new go.Point(120, 400), desiredSize: new go.Size(50, 50) }
          ],
          [
            { from: 1, to: 3 }
          ]
        );
      }

      AvoidsRoot.add(new Test("simple", null, AvoidsNodesSetup,
        null,
        function(test) {
          test.assertAllLinkPoints([[new go.Point(125.0, 50.0), new go.Point(125.0, 60.0), new go.Point(125.0, 60.0), new go.Point(260.0, 60.0), new go.Point(260.0, 260.0), new go.Point(145.0, 260.0), new go.Point(145.0, 390.0), new go.Point(145.0, 400.0)]]);
        }
      ));

      AvoidsRoot.add(new Test("bigger margin", null, AvoidsNodesSetup,
        function(test) {
          var d = test.diagram;
          d.startTransaction();
          d.model.setDataProperty(d.model.findNodeDataForKey(2), "avoidableMargin", new go.Margin(40));
          d.links.each(function(l) { l.invalidateRoute(); });
          d.commitTransaction("bigger margin for blocking node");
        },
        function(test) {
          test.assertAllLinkPoints([[new go.Point(125.0, 50.0), new go.Point(125.0, 60.0), new go.Point(125.0, 60.0), new go.Point(300.0, 60.0), new go.Point(300.0, 300.0), new go.Point(145.0, 300.0), new go.Point(145.0, 390.0), new go.Point(145.0, 400.0)]]);
        }
      ));

      AvoidsRoot.add(new Test("move", null, AvoidsNodesSetup,
        function(test) {
          var d = test.diagram;
          d.startTransaction();
          var link = d.links.first();
          var pts = link.points.copy();
          pts.setElt(2, new go.Point(125.0, 123.0));
          pts.setElt(3, new go.Point(300.0, 123.0));
          link.points = pts;
          d.commitTransaction("manually routed link");
          d.startTransaction();
          d.model.setDataProperty(d.model.findNodeDataForKey(3), "position", new go.Point(140, 400));
          d.commitTransaction("moved target node");
        },
        function(test) {
          // this should recalculate the whole route, losing the explicitly set points near the source node
          test.assertAllLinkPoints([[new go.Point(125.0, 50.0), new go.Point(125.0, 60.0), new go.Point(125.0, 60.0), new go.Point(260.0, 60.0), new go.Point(260.0, 260.0), new go.Point(165.0, 260.0), new go.Point(165.0, 390.0), new go.Point(165.0, 400.0)]]);
        }
      ));

      AvoidsRoot.add(new Test("move adjusting", null,
        function(test) {
          AvoidsNodesSetup(test);
          var d = test.diagram;
          d.startTransaction();
          d.model.setDataProperty(d.model.linkDataArray[0], "adjusting", go.Link.End);
          d.commitTransaction("link now adjusts");
        },
        function(test) {
          var d = test.diagram;
          d.startTransaction();
          var link = d.links.first();
          var pts = link.points.copy();
          pts.setElt(2, new go.Point(125.0, 123.0));
          pts.setElt(3, new go.Point(260.0, 123.0));
          link.points = pts;
          d.commitTransaction("manually routed link");
          d.startTransaction();
          d.model.setDataProperty(d.model.findNodeDataForKey(3), "position", new go.Point(140, 400));
          d.commitTransaction("moved target node");
        },
        function(test) {
          // the manually set route points near the source node should no longer be lost due to AvoidsNodes recalculation of the whole route
          test.assertAllLinkPoints([[new go.Point(125.0, 50.0), new go.Point(125.0, 60.0), new go.Point(125.0, 123.0), new go.Point(260.0, 123.0), new go.Point(260.0, 260.0), new go.Point(165.0, 260.0), new go.Point(165.0, 390.0), new go.Point(165.0, 400.0)]]);
        }
      ));

      AvoidsRoot.add(new Test("45 dir", null,
        function(test) {
          var diag = test.diagram;
          diag.reset();

          diag.nodeTemplate =
            $(go.Node, "Auto",
              { width: 100, height: 50 },
              new go.Binding("location", "loc", go.Point.parse),
              $(go.Shape,
                { fill: "lightblue" }),
              $(go.TextBlock,
                { margin: 8 },
                new go.Binding("text"))
            );

          diag.linkTemplate =
            $(go.Link,
              { routing: go.Link.AvoidsNodes, corner: 5 },
              { fromSpot: go.Spot.Bottom, toSpot: go.Spot.Top },
              new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
              new go.Binding("toSpot", "toSpot", go.Spot.parse),
              $(go.Shape),
              $(go.Shape, { toArrow: "Standard", scale: 0.5})
            );

          diag.model = new go.GraphLinksModel(
            [
              { key: "21", text: "21", loc: "70 0" },
              { key: "E", text: "E", loc: "0 95" },
              { key: "F", text: "F", loc: "140 95" },
              { key: "22", text: "22", loc: "70 190" },
            ],
            [
              { from: "21", to: "E", fromSpot: "0 0", toSpot: "0 0" },
              { from: "E", to: "22", fromSpot: "0 1", toSpot: "0 1" },
              { from: "F", to: "22", fromSpot: "1 0", toSpot: "1 0" },
              { from: "21", to: "22", fromSpot: "1 1", toSpot: "1 1" },
            ]);
        },
        function(test) {
          var diag = test.diagram;
          //test.dumpLinkPoints();
          test.assertAllLinkPoints([
            [new go.Point(70.0,0.0), new go.Point(62.9,-7.1), new go.Point(-7.1,-7.1), new go.Point(-7.1,40.4), new go.Point(-7.1,87.9), new go.Point(0.0,95.0)],
            [new go.Point(0.0,145.0), new go.Point(-7.1,152.1), new go.Point(-7.1,247.1), new go.Point(27.9,247.1), new go.Point(62.9,247.1), new go.Point(70.0,240.0)],
            [new go.Point(240.0,95.0), new go.Point(247.1,87.9), new go.Point(244.0,87.9), new go.Point(244.0,87.9), new go.Point(252.0,87.9), new go.Point(252.0,182.9), new go.Point(177.1,182.9), new go.Point(170.0,190.0)],
            [new go.Point(170.0,50.0), new go.Point(177.1,57.1), new go.Point(177.1,60.0), new go.Point(132.0,60.0), new go.Point(132.0,156.0), new go.Point(177.1,156.0), new go.Point(177.1,247.1), new go.Point(170.0,240.0)]
          ]);
        }
      ));

      // should route around Delta node
      AvoidsRoot.add(new Test("insert avoid link", null, AvoidsNodesSetup,
        function(test) {
          var d = test.diagram;

          d.nodeTemplate =
          $(go.Node, "Table",
            {
              locationObjectName: "BODY", locationSpot: go.Spot.Center,
              selectionObjectName: "BODY"
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

            // the body
            $(go.Panel, "Auto",
              { row: 1, column: 1, name: "BODY", stretch: go.GraphObject.Fill, width: 60 },
              $(go.Shape, "Rectangle",
                { fill: "darkred", strokeWidth: 0, minSize: new go.Size(60, 60) }),
              $(go.TextBlock,
                {
                  margin: 10, textAlign: "center",
                  font: "14px Segoe UI,sans-serif", stroke: "white", editable: true
                },
                new go.Binding("text").makeTwoWay())
            ),  // end Auto Panel body

            // the Panel holding the left port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.leftPorts
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "leftPorts"),
              {
                row: 1, column: 0,
                itemTemplate:
                  $(go.Panel,
                    {
                      fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                      fromLinkable: true, toLinkable: true, cursor: "pointer",
                    },
                    new go.Binding("portId", "id"),
                    $(go.Shape, "Rectangle",
                      { strokeWidth: 0, desiredSize: new go.Size(10, 10), margin: new go.Margin(1, 0) })
                  )  // end itemTemplate
              }
            ),  // end Vertical Panel

            // the Panel holding the right port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.rightPorts
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "rightPorts"),
              {
                row: 1, column: 2,
                itemTemplate:
                  $(go.Panel,
                    {
                      fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                      fromLinkable: true, toLinkable: true, cursor: "pointer",
                    },
                    new go.Binding("portId", "id"),
                    $(go.Shape, "Rectangle",
                      { strokeWidth: 0, desiredSize: new go.Size(10, 10), margin: new go.Margin(1, 0) })
                  )  // end itemTemplate
              }
            )  // end Vertical Panel
          );  // end Node

        d.linkTemplate =
          $(go.Link,
            { routing: go.Link.AvoidsNodes },
            $(go.Shape),
            $(go.Shape, { toArrow: "OpenTriangle" })
          );

        function scrollToPort(port) {
          port.diagram.commandHandler.scrollToPart(port.part);
          port.part.isSelected = true;
        }

        d.linkTemplateMap.add("Remote",
          $(go.Link,
            {
              routing: go.Link.AvoidsNodes,
              selectionAdorned: false
            },
            $(go.Shape, { visible: false }),
            $(go.Panel, "Auto",
              {
                segmentIndex: 0, segmentOffset: new go.Point(NaN, 0),
                doubleClick: (e, conn) => scrollToPort(conn.part.toPort)
              },
              $(go.Shape, { fill: "white" },
                new go.Binding("fill", "isSelected", s => s ? "dodgerblue" : "white").ofObject()),
              $(go.TextBlock, { margin: new go.Margin(0, 2, -2, 2), isMultiline: false },
                new go.Binding("text"))
            ),
            $(go.Panel, "Auto",
              {
                segmentIndex: -1, segmentOffset: new go.Point(NaN, 0),
                doubleClick: (e, conn) => scrollToPort(conn.part.fromPort)
              },
              $(go.Shape, { fill: "white" },
                new go.Binding("fill", "isSelected", s => s ? "dodgerblue" : "white").ofObject()),
              $(go.TextBlock, { margin: new go.Margin(0, 2, -2, 2), isMultiline: false },
                new go.Binding("text"))
            )
          ));

        d.model = new go.GraphLinksModel(
          {
            linkFromPortIdProperty: "fp",
            linkToPortIdProperty: "tp",
            nodeDataArray: [
              {
                key: 1, text: "Alpha", color: "lightblue", loc: "0 0",
                leftPorts: [{ id: "L0" }, { id: "L1" }],
                rightPorts: [{ id: "R0" }, { id: "R1" }]
              },
              {
                key: 2, text: "Beta", color: "orange", loc: "250 0",
                leftPorts: [{ id: "L0" }, { id: "L1" }],
                rightPorts: [{ id: "R0" }, { id: "R1" }]
              },
              {
                key: 3, text: "Gamma", color: "lightgreen", loc: "0 150",
                leftPorts: [{ id: "L0" }, { id: "L1" }],
                rightPorts: [{ id: "R0" }, { id: "R1" }]
              },
              {
                key: 4, text: "Delta", color: "pink", loc: "130 90",
                leftPorts: [{ id: "L0" }, { id: "L1" }],
                rightPorts: [{ id: "R0" }, { id: "R1" }]
              }
            ],
            linkDataArray: [
            ]
          }
        );

        },
        function(test) {
          const d = test.diagram;
          const from = d.findNodeForKey(3)
          const to = d.findNodeForKey(2)
          d.startTransaction();
          d.toolManager.linkingTool.insertLink(from, from.findPort('R0'), to, to.findPort('L0'))
          d.commitTransaction();
          test.assertAllLinkPoints([
            [new go.Point(40.0,144.0), new go.Point(50.0,144.0), new go.Point(52.0,144.0), new go.Point(52.0,-6.0), new go.Point(200.0,-6.0), new go.Point(210.0,-6.0)]
          ]);
        }
      ));

      function AvoidsLinksSetup(test, props) {
        var diagram = test.diagram;
        diagram.reset();
        const avoidsLinks = new AvoidsLinksRouter(props);
        diagram.routers.push(avoidsLinks);

        function makeInPort(id) {
          return new go.Shape({ width: 10, height: 10, portId: id, toSpot: go.Spot.Top, fromSpot: go.Spot.Top, fill: "white", margin: 1 });
        }
        function makeOutPort(id) {
          return new go.Shape({ width: 10, height: 10, portId: id, fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom, fill: "white", margin: 1 });
        }

        diagram.nodeTemplate =
          $(go.Node, "Table",
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc"),
            $(go.Panel, "Horizontal",
              { row: 0 },
              makeInPort("1"),
              makeInPort("2"),
              makeInPort("3")
            ),
            $(go.Panel, "Auto",
              { row: 1, width: 100, height: 60 },
              $(go.Shape, { fill: "white" },
                new go.Binding("fill", "color")),
              $(go.TextBlock,
                new go.Binding("text"))
            ),
            $(go.Panel, "Horizontal",
              { row: 2 },
              makeOutPort("a"),
              makeOutPort("b"),
              makeOutPort("c")
            )
          );

        diagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.AvoidsNodes, corner: 4 },
            $(go.Shape, { strokeWidth: 1.5 })
          );

        diagram.model = new go.GraphLinksModel(
          {
            linkFromPortIdProperty: "fpid",
            linkToPortIdProperty: "tpid",
            nodeDataArray:
              [
                { key: 1, text: "Alpha", color: "lightblue", loc: new go.Point(0, 0) },
                { key: 2, text: "Beta", color: "orange", loc: new go.Point(150, 150) }
              ],
            linkDataArray:
              [
                { from: 1, to: 2, fpid: "a", tpid: "1" },
                { from: 1, to: 2, fpid: "b", tpid: "2" },
                { from: 1, to: 2, fpid: "c", tpid: "3" }
              ]
          });
      }

      var AvoidsLinksRoot = new TestCollection("AvoidsLinks");
      LinkRoutingGeometryRoot.add(AvoidsLinksRoot);

      AvoidsLinksRoot.add(new Test('simple', null,
      function(test) {
        AvoidsLinksSetup(test, {
          linkSpacing: 4,
          avoidsNodes: true
        });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(-13.0, 42.0), new go.Point(-13.0, 52.0), new go.Point(-13.0, 79.0), new go.Point(137.0, 79.0), new go.Point(137.0, 98.0), new go.Point(137.0, 108.0)],
          [new go.Point(0.0, 42.0), new go.Point(0.0, 52.0), new go.Point(0.0, 75.0), new go.Point(150.0, 75.0), new go.Point(150.0, 98.0), new go.Point(150.0, 108.0)],
          [new go.Point(13.0, 42.0), new go.Point(13.0, 52.0), new go.Point(13.0, 71.0), new go.Point(163.0, 71.0), new go.Point(163.0, 98.0), new go.Point(163.0, 108.0)]
        ]);
      }));

      AvoidsLinksRoot.add(new Test('idempotent', null,
      function(test) {
        AvoidsLinksSetup(test, {
          linkSpacing: 4,
          avoidsNodes: true,
          iterations: 5
        });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(-13.0, 42.0), new go.Point(-13.0, 52.0), new go.Point(-13.0, 79.0), new go.Point(137.0, 79.0), new go.Point(137.0, 98.0), new go.Point(137.0, 108.0)],
          [new go.Point(0.0, 42.0), new go.Point(0.0, 52.0), new go.Point(0.0, 75.0), new go.Point(150.0, 75.0), new go.Point(150.0, 98.0), new go.Point(150.0, 108.0)],
          [new go.Point(13.0, 42.0), new go.Point(13.0, 52.0), new go.Point(13.0, 71.0), new go.Point(163.0, 71.0), new go.Point(163.0, 98.0), new go.Point(163.0, 108.0)]
        ]);
      }));

      AvoidsLinksRoot.add(new Test('works inside groups', null,
      function(test) {
        AvoidsLinksSetup(test, {
          linkSpacing: 4,
          avoidsNodes: true
        });
        myDiagram.model = new go.GraphLinksModel(
          {
            linkFromPortIdProperty: "fpid",
            linkToPortIdProperty: "tpid",
            nodeDataArray:
              [
                { key: 1, text: "Alpha", color: "lightblue", loc: new go.Point(0, 0), group: 3 },
                { key: 2, text: "Beta", color: "orange", loc: new go.Point(150, 150), group: 3 },
                { key: 3, isGroup: true }
              ],
            linkDataArray:
              [
                { from: 1, to: 2, fpid: "a", tpid: "1" },
                { from: 1, to: 2, fpid: "b", tpid: "2" },
                { from: 1, to: 2, fpid: "c", tpid: "3" }
              ]
          });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(-13.0, 42.0), new go.Point(-13.0, 52.0), new go.Point(-13.0, 79.0), new go.Point(137.0, 79.0), new go.Point(137.0, 98.0), new go.Point(137.0, 108.0)],
          [new go.Point(0.0, 42.0), new go.Point(0.0, 52.0), new go.Point(0.0, 75.0), new go.Point(150.0, 75.0), new go.Point(150.0, 98.0), new go.Point(150.0, 108.0)],
          [new go.Point(13.0, 42.0), new go.Point(13.0, 52.0), new go.Point(13.0, 71.0), new go.Point(163.0, 71.0), new go.Point(163.0, 98.0), new go.Point(163.0, 108.0)]
        ]);
      }));

      var LabelsRoot = new TestCollection("Labels");
      LinkRoutingGeometryRoot.add(LabelsRoot);

      LabelsRoot.add(new Test('simple mid', null,
      function(test) {
        CommonSetupLabels(test);
      },
      null,
      function(test) {
        var link = test.diagram.links.first();
        var lab = link.elt(1);
        var r = new go.Rect(lab.getDocumentPoint(go.Spot.TopLeft), lab.getDocumentPoint(go.Spot.BottomRight));
        test.assert(test.isApproxPoint(r.center, new go.Point(75.5, 150.5)), "link label center isn't at mid point");
      }));

      // Make sure the angle and location are both correct for a label at the midpoint of a multisegmented link
      LabelsRoot.add(new Test('Mid along multisegmented', null,
      function(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplate =
          $(go.Node,
            new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape, { fill: "lightblue" }));
        test.diagram.linkTemplate =
          $(go.Link,
            new go.Binding("points", "pts"),
            $(go.Shape),
            $(go.TextBlock, "mid",
              {
                textAlign: "center", background: "gray",
                segmentOrientation: go.Link.OrientAlong, width: 25, height: 15
              }
            )
          );
        test.diagram.model.nodeDataArray = [
          { key: 1, loc: "0 0" },
          { key: 2, loc: "200 200" }
        ];
        test.diagram.model.linkDataArray = [
          { from: 1, to: 2, pts: [36, 101, -12, 270, 131, 223, 247, 374, 249, 301] }
        ];

      },
      null,
      function(test) {
        var link = test.diagram.links.first();
        var lab = link.elt(1);
        test.assert(test.isApproxPoint(lab.actualBounds.position, new go.Point(99.47, 121.27)), "multisegment link label at incorrect position");
        test.assert(test.isApprox(lab.angle, 341.81), "multisegment link label at incorrect angle");
      }));

      // Make sure the angle and location are both correct for a label at the midpoint of a multisegmented link
      LabelsRoot.add(new Test('Mid along small orthogonal', null,
      function(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplate =
          $(go.Node,
            new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape, { fill: "lightblue" }));
        test.diagram.linkTemplate =
          $(go.Link,
            new go.Binding("points", "pts"),
            $(go.Shape),
            $(go.TextBlock, "mid",
              {
                textAlign: "center", background: "gray",
                segmentOrientation: go.Link.OrientAlong, width: 25, height: 15
              }
            )
          );
        test.diagram.model.nodeDataArray = [
          { key: 1, loc: "0 0" },
          { key: 2, loc: "200 200" }
        ];
        test.diagram.model.linkDataArray = [
          { from: 1, to: 2, pts: [50, 100, 50, 150, 150, 150, 150, 150.25, 250, 150.25, 250, 200] }
        ];

      },
      null,
      function(test) {
        var link = test.diagram.links.first();
        var lab = link.elt(1);
        test.assert(test.isApproxPoint(lab.actualBounds.position, new go.Point(87.99, 42.98)), "small orthogonal link label at incorrect position");
        test.assert(test.isApprox(lab.angle, .0716), "small orthogonal link label at incorrect angle");
      }));

      LabelsRoot.add(new Test('label node', null,
      function(test) {
        CommonSetupLabels(test);
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplateMap.add("LinkLabel",
            $(go.Node, "Spot",
              { background: "lightcyan" },
              { locationSpot: go.Spot.Center, locationObjectName: "X" },
              $(go.Shape, "XLine", { name: "X", width: 30, height: 30 }),
              $(go.TextBlock, "whole label should remain centered on link",
                { alignment: go.Spot.BottomRight, alignmentFocus: go.Spot.TopLeft })
            ));
        var model = test.diagram.model;
        model.linkLabelKeysProperty = "labs";
        var labdata = { category: "LinkLabel" };
        model.addNodeData(labdata);
        var linkdata = model.linkDataArray[0];
        model.addLabelKeyForLinkData(linkdata, model.getKeyForNodeData(labdata));
      },
      null,
      function(test) {
        var link = test.diagram.links.first();
        var lab = link.labelNodes.first();
        var r = lab.actualBounds;
        test.assert(test.isApproxPoint(r.center, new go.Point(75.5, 150.5)), "link label center isn't at mid point");
      }));

      LabelsRoot.add(new Test('label node alignmentFocus None', null,
      function(test) {
        CommonSetupLabels(test);
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplateMap.add("LinkLabel",
            $(go.Node, "Spot",
              { alignmentFocus: go.Spot.None },  // new in 1.6
              { locationSpot: go.Spot.Center, locationObjectName: "X" },
              $(go.Shape, "XLine", { name: "X", width: 30, height: 30 }),
              $(go.TextBlock, "X should remain centered on link",
                { alignment: go.Spot.BottomRight, alignmentFocus: go.Spot.TopLeft })
            ));
        var model = test.diagram.model;
        model.linkLabelKeysProperty = "labs";
        var labdata = { category: "LinkLabel" };
        model.addNodeData(labdata);
        var linkdata = model.linkDataArray[0];
        model.addLabelKeyForLinkData(linkdata, model.getKeyForNodeData(labdata));
      },
      null,
      function(test) {
        var link = test.diagram.links.first();
        var lab = link.labelNodes.first();
        test.assert(lab !== null && test.isApproxPoint(lab.location, new go.Point(75.5, 150.5)), "link label location isn't at mid point");
      }));

      LabelsRoot.add(new Test('label node avoidsNodes + bezier', null,
      function(test) {
        CommonSetupLabels(test);
        var $ = go.GraphObject.make;
        var d = test.diagram;
        d.nodeTemplate =
         $(go.Node, "Spot",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape,
              { fill: "white", portId: "", width: 40, height: 40 },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              { margin: 8, width: 30, height: 15 },
              new go.Binding("text"))
          );

        d.linkTemplate =
          $(go.Link,
            { routing: go.Link.AvoidsNodes, curve: go.Link.Bezier, reshapable: true },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape),
            $(go.Shape, { toArrow: "OpenTriangle" }),
            $(go.TextBlock, "ABC",  { background: 'red', width: 30, height: 15 })
          );

        d.model = go.Model.fromJSON(
  '          { "class": "go.GraphLinksModel",' +
  '  "nodeDataArray": [ ' +
  '{"key":1, "text":"Alpha", "color":"lightblue", "loc":"79.78259396460942 50.23348508882813"},' +
  '{"key":2, "text":"Beta", "color":"orange", "loc":"362.3743462133986 -70.77455443789063"},' +
  '{"key":3, "text":"Gamma", "color":"lightgreen", "loc":"0 51"},' +
  '{"key":4, "text":"Delta", "color":"pink", "loc":"57 191"},' +
  '{"key":5, "text":"Delta", "color":"pink", "loc":"152.77210869847664 264.7109405326172"},' +
  '{"key":6, "text":"Delta", "color":"pink", "loc":"166 97"}' +
   '],' +
  '  "linkDataArray": [ ' +
  '{"from":1, "to":2, "points":[123.28259396460942,70.73348508882813,133.28259396460942,70.73348508882813,86.18487082878741,70.73348508882813,86.18487082878741,-50.27455443789063,354.8743462133986,-50.27455443789063,364.8743462133986,-50.27455443789063]},' +
  '{"from":3, "to":4, "points":[43.5,71.5,53.5,71.5,53.5,308,49.5,308,49.5,211.5,59.5,211.5]},' +
  '{"from":5, "to":6, "points":[175.77210869847664,264.7109405326172,175.77210869847664,254.7109405326172,175.77210869847664,70.91786130187504,189,70.91786130187504,189,148,189,138]}' +
   ']}'
   );

      },
      null,
      function(test) {
        var d = test.diagram;

        // Test the document coordinates of the labels to make sure they are in the right place
        var itr = d.links;
        var results = [];
        while( itr.next()) {
          var link = itr.value;
          // test.assert(link.elt(2).getDocumentPoint(go.Spot.Center));
          results.push(link.elt(2).getDocumentPoint(go.Spot.Center));
        }

        test.assert(test.isApproxPoint(results[0], new go.Point(141.06642656584225, -70.69179175346628)));
        test.assert(test.isApproxPoint(results[1], new go.Point(79.0844526968007, 242.27240361282466)));
        test.assert(test.isApproxPoint(results[2], new go.Point(161.977757719129, 125.23808207784415)));
      }));


      var BundlesRoot = new TestCollection("Bundles");
      LinkRoutingGeometryRoot.add(BundlesRoot);

      BundlesRoot.add(new Test('straight, 2 small labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.addLinkData({ from: 1, to: 3, stroke: "red" });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(63.1, 101.0), new go.Point(89.5, 147.0), new go.Point(87.9, 200.0)],
          [new go.Point(63.1, 101.0), new go.Point(61.5, 154.0), new go.Point(87.9, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('straight, 2 wide labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.setDataProperty(model.linkDataArray[0], "width", 50);
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 50 });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(63.1, 101.0), new go.Point(101.3, 144.1), new go.Point(87.9, 200.0)],
          [new go.Point(63.1, 101.0), new go.Point(49.7, 156.9), new go.Point(87.9, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('straight, 3 varying labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 10 });
        model.addLinkData({ from: 1, to: 3, stroke: "green", width: 50 });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(63.1,101.0), new go.Point(108.2,142.3), new go.Point(87.9,200.0)],
          [new go.Point(63.1,101.0), new go.Point(87.3,147.6), new go.Point(87.9,200.0)],
          [new go.Point(63.1,101.0), new go.Point(54.5,155.7), new go.Point(87.9,200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('curved, 2 small labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.setDataProperty(model.linkDataArray[0], "curve", go.Link.Bezier);
        model.addLinkData({ from: 1, to: 3, stroke: "red", curve: go.Link.Bezier });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(75.8,101.0), new go.Point(90.1,129.3), new go.Point(98.3,162.3), new go.Point(99.2,200.0)],
          [new go.Point(51.8,101.0), new go.Point(52.7,138.7), new go.Point(60.9,171.7), new go.Point(75.2,200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('curved, 2 wide labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.setDataProperty(model.linkDataArray[0], "width", 50);
        model.setDataProperty(model.linkDataArray[0], "curve", go.Link.Bezier);
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 50, curve: go.Link.Bezier });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(87.7,101.0), new go.Point(105.7,125.4), new go.Point(114.0,158.4), new go.Point(107.9,200.0)],
          [new go.Point(43.1,101.0), new go.Point(37.0,142.6), new go.Point(45.3,175.6), new go.Point(63.3,200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('curved, 3 varying labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        model.setDataProperty(model.linkDataArray[0], "curve", go.Link.Bezier);
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 10, curve: go.Link.Bezier });
        model.addLinkData({ from: 1, to: 3, stroke: "green", width: 50, curve: go.Link.Bezier });
      },
      null,
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(95.4,101.0), new go.Point(115.0,123.1), new go.Point(123.3,156.1), new go.Point(112.7,200.0)],
          [new go.Point(73.7,101.0), new go.Point(87.1,130.1), new go.Point(95.3,163.1), new go.Point(97.5,200.0)],
          [new go.Point(46.5,101.0), new go.Point(43.4,141.0), new go.Point(51.7,174.0), new go.Point(68.3,200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('straight, AllSides, 2 labels, invalidateRoute 1', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        for (var i = 0; i < model.nodeDataArray.length; i++) {
          model.setDataProperty(model.nodeDataArray[i], "fromSpot", go.Spot.AllSides);
          model.setDataProperty(model.nodeDataArray[i], "toSpot", go.Spot.AllSides);
        }
        model.addLinkData({ from: 1, to: 3, stroke: "red" });
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
        var diagram = test.diagram;
        diagram.startTransaction();
        diagram.findLinkForData(diagram.model.linkDataArray[0]).invalidateRoute();
        diagram.commitTransaction("inv route");
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('straight, AllSides, 2 labels, invalidateRoute 2', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        for (var i = 0; i < model.nodeDataArray.length; i++) {
          model.setDataProperty(model.nodeDataArray[i], "fromSpot", go.Spot.AllSides);
          model.setDataProperty(model.nodeDataArray[i], "toSpot", go.Spot.AllSides);
        }
        model.addLinkData({ from: 1, to: 3, stroke: "red" });
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
        var diagram = test.diagram;
        diagram.startTransaction();
        diagram.findLinkForData(diagram.model.linkDataArray[1]).invalidateRoute();
        diagram.commitTransaction("inv route");
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('curved, AllSides, 2 labels, invalidateRoute 1', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        for (var i = 0; i < model.nodeDataArray.length; i++) {
          model.setDataProperty(model.nodeDataArray[i], "fromSpot", go.Spot.AllSides);
          model.setDataProperty(model.nodeDataArray[i], "toSpot", go.Spot.AllSides);
        }
        model.setDataProperty(model.linkDataArray[0], "curve", go.Link.Bezier);
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 10, curve: go.Link.Bezier });
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
        var diagram = test.diagram;
        diagram.startTransaction();
        diagram.findLinkForData(diagram.model.linkDataArray[0]).invalidateRoute();
        diagram.commitTransaction("inv route");
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('curved, AllSides, 2 labels, invalidateRoute 2', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        for (var i = 0; i < model.nodeDataArray.length; i++) {
          model.setDataProperty(model.nodeDataArray[i], "fromSpot", go.Spot.AllSides);
          model.setDataProperty(model.nodeDataArray[i], "toSpot", go.Spot.AllSides);
        }
        model.setDataProperty(model.linkDataArray[0], "curve", go.Link.Bezier);
        model.addLinkData({ from: 1, to: 3, stroke: "red", width: 10, curve: go.Link.Bezier });
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
        var diagram = test.diagram;
        diagram.startTransaction();
        diagram.findLinkForData(diagram.model.linkDataArray[1]).invalidateRoute();
        diagram.commitTransaction("inv route");
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(67.3, 101.0), new go.Point(67.3, 111.0), new go.Point(117.3, 190.0), new go.Point(117.3, 200.0)],
          [new go.Point(33.7, 101.0), new go.Point(33.7, 111.0), new go.Point(83.7, 190.0), new go.Point(83.7, 200.0)]
        ]);
      }));


      BundlesRoot.add(new Test('ortho, AllSides, 3 labels', null,
      function(test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        for (var i = 0; i < model.nodeDataArray.length; i++) {
          model.setDataProperty(model.nodeDataArray[i], "fromSpot", go.Spot.AllSides);
          model.setDataProperty(model.nodeDataArray[i], "toSpot", go.Spot.AllSides);
        }
        model.setDataProperty(model.linkDataArray[0], "routing", go.Link.Orthogonal);
        model.addLinkData({ from: 1, to: 3, stroke: "red", routing: go.Link.Orthogonal });
        model.addLinkData({ from: 1, to: 3, stroke: "green", routing: go.Link.Orthogonal });
      },
      null,
      function(test) {
        //test.dumpLinkPoints();
        test.assertAllLinkPoints([
          [new go.Point(75.8,101.0), new go.Point(75.8,111.0), new go.Point(75.8,142.5), new go.Point(125.8,142.5), new go.Point(125.8,174.0), new go.Point(125.8,200.0)],
          [new go.Point(50.5,101.0), new go.Point(50.5,119.0), new go.Point(50.5,150.5), new go.Point(100.5,150.5), new go.Point(100.5,182.0), new go.Point(100.5,200.0)],
          [new go.Point(25.3,101.0), new go.Point(25.3,127.0), new go.Point(25.3,158.5), new go.Point(75.3,158.5), new go.Point(75.3,190.0), new go.Point(75.3,200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('removing from, adding to bundle', null,
      function (test) {
        CommonSetupLabels(test);
        var model = test.diagram.model;
        test.diagram.startTransaction();
        model.addLinkData({ from: 1, to: 3, stroke: "red" });
        model.addLinkData({ from: 1, to: 3, stroke: "green" });
        test.diagram.commitTransaction("three links");
        test.diagram.startTransaction();
        test.diagram.findLinkForData(model.linkDataArray[0]).points = [new go.Point(63.1, 101.0), new go.Point(103.5, 143.5), new go.Point(87.9, 200.0)];
        test.diagram.findLinkForData(model.linkDataArray[1]).points = [new go.Point(24.4, 101.0), new go.Point(-4.0, 156.0), new go.Point(50.0, 204.8)];
        test.diagram.findLinkForData(model.linkDataArray[2]).points = [new go.Point(99.8, 101.0), new go.Point(177.0, 180.0), new go.Point(151.0, 204.0)];
        test.diagram.commitTransaction("manually routed three links");
      },
      function (test) {
        var model = test.diagram.model;
        test.diagram.startTransaction();
        test.diagram.findLinkForData(model.linkDataArray[0]).toNode = test.diagram.findNodeForKey(2);
        test.diagram.commitTransaction("relinked red link");
        // should reroute not only the red link but also the other two links that used to be in the bundle
        test.assertAllLinkPoints([
          [new go.Point(101.0,50.5), new go.Point(200.0,50.5)],
          [new go.Point(63.1,101.0), new go.Point(89.5,147.0), new go.Point(87.9,200.0)],
          [new go.Point(63.1,101.0), new go.Point(61.5,154.0), new go.Point(87.9,200.0)]
        ]);
      },
      function (test) {
        var model = test.diagram.model;
        // restore to manually set link routes
        test.diagram.commandHandler.undo();
        test.assertAllLinkPoints([
          [new go.Point(63.1,101.0), new go.Point(103.5,143.5), new go.Point(87.9,200.0)],
          [new go.Point(24.4,101.0), new go.Point(-4.0,156.0), new go.Point(50.0,204.8)],
          [new go.Point(99.8,101.0), new go.Point(177.0,180.0), new go.Point(151.0,204.0)]
        ]);
        test.diagram.commandHandler.redo();
        test.assertAllLinkPoints([
          [new go.Point(101.0, 50.5), new go.Point(200.0, 50.5)],
          [new go.Point(63.1, 101.0), new go.Point(89.5, 147.0), new go.Point(87.9, 200.0)],
          [new go.Point(63.1, 101.0), new go.Point(61.5, 154.0), new go.Point(87.9, 200.0)]
        ]);
      }));

      BundlesRoot.add(new Test('port bundles', null,
      function (test) {
        var $ = go.GraphObject.make;
        var diagram = test.diagram;
        diagram.nodeTemplate =
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse),
            $(go.Shape, { fill: "lightblue" }),
            $(go.Shape, { desiredSize: new go.Size(6, 6), alignment: go.Spot.Top, portId: "T" }),
            $(go.Shape, { desiredSize: new go.Size(6, 6), alignment: go.Spot.Right, portId: "R" }),
            $(go.Shape, { desiredSize: new go.Size(6, 6), alignment: go.Spot.Bottom, portId: "B" }),
            $(go.Shape, { desiredSize: new go.Size(6, 6), alignment: go.Spot.Left, portId: "L" })
          );
        diagram.linkTemplate =
          $(go.Link,
            $(go.Shape, new go.Binding("stroke"))
          );
        diagram.undoManager.isEnabled = true;
        var model = test.diagram.model;
        model.linkFromPortIdProperty = "fromPort";
        model.linkToPortIdProperty = "toPort";
        model.nodeDataArray = [
          { key: 1, loc: "0 0" },
          { key: 2, loc: "200 0" },
          { key: 3, loc: "0 200" }
        ];
        model.linkDataArray = [
          { from: 1, to: 2, fromPort: "R", toPort: "L", stroke: "red" },
          { from: 1, to: 2, fromPort: "R", toPort: "L", stroke: "green" },
          { from: 1, to: 2, fromPort: "B", toPort: "B", stroke: "orange" },
          { from: 1, to: 2, fromPort: "B", toPort: "B", stroke: "pink" },
        ];

        diagram.startTransaction();
        diagram.findLinkForData(model.linkDataArray[0]).points = [new go.Point(108, 54), new go.Point(154, 44), new go.Point(200, 54)];
        diagram.findLinkForData(model.linkDataArray[1]).points = [new go.Point(108, 54), new go.Point(154, 64), new go.Point(200, 54)];
        diagram.findLinkForData(model.linkDataArray[2]).points = [new go.Point(54, 104.5), new go.Point(54, 114.5), new go.Point(254, 114.5), new go.Point(254, 104.5)];
        diagram.findLinkForData(model.linkDataArray[3]).points = [new go.Point(54, 104.5), new go.Point(54, 124.5), new go.Point(254, 124.5), new go.Point(254, 104.5)];
        diagram.commitTransaction("manually routed four links");
      },
      function (test) {
        var model = test.diagram.model;
        test.diagram.startTransaction();
        test.diagram.findLinkForData(model.linkDataArray[0]).toPortId = "T";
        test.diagram.commitTransaction("relinked red link");
        // should reroute red and green, but not others since they're in another bundle
        test.assertAllLinkPoints([
          [new go.Point(108, 52.82), new go.Point(250.5, 4.68)],
          [new go.Point(108, 54), new go.Point(200, 54)],
          [new go.Point(54, 104.5), new go.Point(54, 114.5), new go.Point(254, 114.5), new go.Point(254, 104.5)]
          [new go.Point(54, 104.5), new go.Point(54, 124.5), new go.Point(254, 124.5), new go.Point(254, 104.5)]
        ]);
      },
      function (test) {
        var model = test.diagram.model;
        // restore to manually set link routes
        test.diagram.commandHandler.undo();
        test.assertAllLinkPoints([
          [new go.Point(108, 54), new go.Point(154, 44), new go.Point(200, 54)],
          [new go.Point(108, 54), new go.Point(154, 64), new go.Point(200, 54)],
          [new go.Point(54, 104.5), new go.Point(54, 114.5), new go.Point(254, 114.5), new go.Point(254, 104.5)]
          [new go.Point(54, 104.5), new go.Point(54, 124.5), new go.Point(254, 124.5), new go.Point(254, 104.5)]
        ]);
        test.diagram.commandHandler.redo();
        test.assertAllLinkPoints([
          [new go.Point(108, 52.82), new go.Point(250.5, 4.68)],
          [new go.Point(108, 54), new go.Point(200, 54)],
          [new go.Point(54, 104.5), new go.Point(54, 114.5), new go.Point(254, 114.5), new go.Point(254, 104.5)]
          [new go.Point(54, 104.5), new go.Point(54, 124.5), new go.Point(254, 124.5), new go.Point(254, 104.5)]
        ]);
      }));


  BundlesRoot.add(new Test('reflexive', null,
    function(test) {
      CommonSetupLabels(test);
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          { reshapable: true, relinkableFrom: true, relinkableTo: true },
          new go.Binding("routing"),
          new go.Binding("curve"),
          $(go.Shape, new go.Binding("stroke")),
          $(go.TextBlock, "mid", { textAlign: "center", background: "gray", width: 25, height: 15 },
            new go.Binding("height", "width")));

      var model = test.diagram.model;
      model.commit(function(model) {
        model.addLinkData({ from: 3, to: 3, stroke: "red", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "green", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "blue", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "orange", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "purple", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "lightgray", width: 50 });
      }, "add 6");
    },
    null,
    function(test) {
      test.assertAllLinkPoints([
        [new go.Point(63.1, 101.0), new go.Point(87.9, 200.0)],
        [new go.Point(129.7, 301.0), new go.Point(225.2, 466.4), new go.Point(-24.2, 466.4), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(192.7, 410.1), new go.Point(8.3, 410.1), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(160.2, 353.8), new go.Point(40.8, 353.8), new go.Point(71.3, 301.0)],
        [new go.Point(71.3, 200.0), new go.Point(59.3, 179.2), new go.Point(141.7, 179.2), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(26.8, 122.9), new go.Point(174.2, 122.9), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(-5.7, 66.6), new go.Point(206.7, 66.6), new go.Point(129.7, 200.0)]
      ]);
    }));

  BundlesRoot.add(new Test('reflexive add/remove', null,
    function(test) {
      CommonSetupLabels(test);
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          { reshapable: true, relinkableFrom: true, relinkableTo: true },
          new go.Binding("routing"),
          new go.Binding("curve"),
          $(go.Shape, new go.Binding("stroke")),
          $(go.TextBlock, "mid", { textAlign: "center", background: "gray", width: 25, height: 15 },
            new go.Binding("height", "width")));

      var model = test.diagram.model;
      model.commit(function(model) {
        model.addLinkData({ from: 3, to: 3, stroke: "red", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "green", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "blue", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "orange", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "purple", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "lightgray", width: 50 });
      }, "add 6");
    },
    function(test) {
      var model = test.diagram.model;
      model.commit(function(m) {
        m.removeLinkData(m.linkDataArray[5]);
        m.removeLinkData(m.linkDataArray[5]);
        m.addLinkData({ from: 3, to: 3, stroke: "purple", width: 10 });
        m.addLinkData({ from: 3, to: 3, stroke: "lightgray", width: 50 });
      });
    },
    function(test) {
      test.assertAllLinkPoints([
        [new go.Point(63.1, 101.0), new go.Point(87.9, 200.0)],
        [new go.Point(129.7, 301.0), new go.Point(225.2, 466.4), new go.Point(-24.2, 466.4), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(192.7, 410.1), new go.Point(8.3, 410.1), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(160.2, 353.8), new go.Point(40.8, 353.8), new go.Point(71.3, 301.0)],
        [new go.Point(71.3, 200.0), new go.Point(59.3, 179.2), new go.Point(141.7, 179.2), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(26.8, 122.9), new go.Point(174.2, 122.9), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(-5.7, 66.6), new go.Point(206.7, 66.6), new go.Point(129.7, 200.0)]
      ]);
    }));

  // test when Link.adjusting is not None that adding/removing reflexive links doesn't invalidate existing reflexive link routes
  BundlesRoot.add(new Test('reflexive add/remove adjusting', null,
    function(test) {
      CommonSetupLabels(test);
      var $ = go.GraphObject.make;
      test.diagram.linkTemplate =
        $(go.Link,
          { reshapable: true, relinkableFrom: true, relinkableTo: true, adjusting: go.Link.Scale },
          new go.Binding("routing"),
          new go.Binding("curve"),
          $(go.Shape, new go.Binding("stroke")),
          $(go.TextBlock, "mid", { textAlign: "center", background: "gray", width: 25, height: 15 },
            new go.Binding("height", "width")));

      var model = test.diagram.model;
      model.commit(function(model) {
        model.addLinkData({ from: 3, to: 3, stroke: "red", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "green", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "blue", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "orange", width: 50 });
        model.addLinkData({ from: 3, to: 3, stroke: "purple", width: 10 });
        model.addLinkData({ from: 3, to: 3, stroke: "lightgray", width: 50 });
      }, "add 6");
    },
    function(test) {
      var model = test.diagram.model;
      test.diagram.commit(function(d) {
        var link3 = d.findLinkForData(d.model.linkDataArray[3]);
        var link4 = d.findLinkForData(d.model.linkDataArray[4]);
        // mess up one of the control points in two of the links
        link3.points = new go.List(/*go.Point*/).addAll([new go.Point(129.7, 301.0), new go.Point(260.2, 453.8), new go.Point(40.8, 353.8), new go.Point(71.3, 301.0)]);
        link4.points = new go.List(/*go.Point*/).addAll([new go.Point(71.3, 200.0), new go.Point(159.3, 279.2), new go.Point(141.7, 179.2), new go.Point(129.7, 200.0)]);
      });
      model.commit(function(m) {
        m.removeLinkData(m.linkDataArray[5]);
        m.removeLinkData(m.linkDataArray[5]);
        m.addLinkData({ from: 3, to: 3, stroke: "purple", width: 10 });
        m.addLinkData({ from: 3, to: 3, stroke: "lightgray", width: 50 });
      });
    },
    function(test) {
      test.assertAllLinkPoints([
        [new go.Point(63.1, 101.0), new go.Point(87.9, 200.0)],
        [new go.Point(129.7, 301.0), new go.Point(225.2, 466.4), new go.Point(-24.2, 466.4), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(192.7, 410.1), new go.Point(8.3, 410.1), new go.Point(71.3, 301.0)],
        [new go.Point(129.7, 301.0), new go.Point(260.2, 453.8), new go.Point(40.8, 353.8), new go.Point(71.3, 301.0)],
        [new go.Point(71.3, 200.0), new go.Point(159.3, 279.2), new go.Point(141.7, 179.2), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(26.8, 122.9), new go.Point(174.2, 122.9), new go.Point(129.7, 200.0)],
        [new go.Point(71.3, 200.0), new go.Point(-5.7, 66.6), new go.Point(206.7, 66.6), new go.Point(129.7, 200.0)]
      ]);
    }));


      var Invalidation = new TestCollection("Invalidation");
      LinkRoutingGeometryRoot.add(Invalidation);

      function CommonSetupInvalidation(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;
        test.diagram.nodeTemplate =
          $(go.Node, "Spot",
            new go.Binding("location").makeTwoWay(),
            $(go.Shape, "Rectangle", { strokeWidth: 0},
              new go.Binding("fill", "color")),
            $(go.Shape, "Rectangle", {
                fill: 'red',
                name: "A",
                portId: "A",
                width: 10, height: 10, strokeWidth: 0,
                alignment: new go.Spot(0, 1, 10, 5)
              }),
            $(go.Shape, "Rectangle", {
                fill: 'lime',
                name: "B",
                portId: "B",
                width: 10, height: 10, strokeWidth: 0,
                alignment: new go.Spot(0, 1, 30, 5)
              })
          );


        test.diagram.linkTemplate =
          $(go.Link,  // the whole link panel
            { relinkableFrom: true, relinkableTo: true, reshapable: true },
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5,
              toShortLength: 4
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the link path shape
              { isPanelMain: true, strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
              { toArrow: "Standard", stroke: null })
          );
    test.diagram.model.linkFromPortIdProperty = "fromPort";
    test.diagram.model.linkToPortIdProperty = "toPort";
        test.diagram.model.nodeDataArray = [
    {"key":"Alpha", "color":"lightblue", "location": new go.Point(0, 0) },
    {"key":"Beta", "color":"orange", "location": new go.Point(130, 10) }
        ];
        test.diagram.model.linkDataArray = [
          {"from":"Alpha", "to":"Beta", "fromPort":"A", "toPort":"A", "points":[15,105,25,105,44,105,44,147,108,147,108,115,125,115,135,115]}
        ];

      }

      Invalidation.add(new Test('Invalidation 1 - move spot A', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("A").alignment = new go.Spot(0,1,40,5);
        diagram.commitTransaction();
        test.assert(link.actualBounds.height !== 44);
      }));

      Invalidation.add(new Test('Invalidation 1 - move spot B', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var oldwidth = link.actualBounds.width;
        var oldheight = link.actualBounds.height;
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("B").alignment = new go.Spot(0,1,40,5);
        diagram.commitTransaction();
        test.assert(link.actualBounds.width === oldwidth);
        test.assert(link.actualBounds.height === oldheight);
      }));

      Invalidation.add(new Test('Invalidation 1 - enlargeSpotB', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var oldwidth = link.actualBounds.width;
        var oldheight = link.actualBounds.height;
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("B").height = 50;
        diagram.commitTransaction();
        // it should have changed
        test.assert(link.actualBounds.height !== oldheight);
      }));

      Invalidation.add(new Test('Invalidation 1 - moveNode', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").moveTo(diagram.findNodeForKey("Beta").position.x, diagram.findNodeForKey("Beta").position.y - 10);
        diagram.commitTransaction();
        test.assert(link.actualBounds.height !== 44);
      }));

      Invalidation.add(new Test('Invalidation 1 - moveNodeButMove', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var oldwidth = link.actualBounds.width;
        var oldheight = link.actualBounds.height;
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").moveTo(diagram.findNodeForKey("Beta").position.x, diagram.findNodeForKey("Beta").position.y + 100);
        diagram.findNodeForKey("Beta").findObject("A").alignment = new go.Spot(0,0,10,5);
        diagram.commitTransaction();
        test.assert(link.actualBounds.height !== oldheight);
      }));


      // Add a port to the specified side of the selected nodes.
      function addPort(side, diagram) {
        diagram.startTransaction("addPort");
        diagram.selection.each(function(node) {
          // skip any selected Links
          if (!(node instanceof go.Node)) return;
          // compute the next available index number for the side
          var i = 0;
          while (node.findPort(side + i.toString()) !== node) i++;
          // now this new port name is unique within the whole Node because of the side prefix
          var name = side + i.toString();
          // get the Array of port data to be modified
          var arr = node.data[side + "Array"];
          if (arr) {
            // create a new port data object
            var newportdata = {
              portId: name,
              portColor: go.Brush.randomColor()
              // if you add port data properties here, you should copy them in copyPortData above
            };
            // and add it to the Array of port data
            diagram.model.insertArrayItem(arr, -1, newportdata);
          }
        });
        diagram.commitTransaction("addPort");
      }

      Invalidation.add(new Test('Invalidation 2 - test port add/remove', null,
      function(test) {
        var diagram = test.diagram;
        var $ = go.GraphObject.make;

        // To simplify this code we define a function for creating a context menu button:
        function makeButton(text, action, visiblePredicate) {
          return $("ContextMenuButton",
                   $(go.TextBlock, text),
                   { click: action },
                   // don't bother with binding GraphObject.visible if there's no predicate
                   visiblePredicate ? new go.Binding("visible", "", function(o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
        }



        var portSize = new go.Size(8, 8);

        // the node template
        // includes a panel on each side with an itemArray of panels containing ports
        diagram.nodeTemplate =
          $(go.Node, "Table",
            { locationObjectName: "BODY",
              locationSpot: go.Spot.Center,
              selectionObjectName: "BODY"
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

            // the body
            $(go.Panel, "Auto",
              { row: 1, column: 1, name: "BODY",
                stretch: go.GraphObject.Fill },
              $(go.Shape, "Rectangle",
                { fill: "#AC193D", stroke: null, strokeWidth: 0,
                  minSize: new go.Size(56, 56) }),
              $(go.TextBlock,
                { margin: 10, textAlign: "center", font: "14px  Segoe UI,sans-serif", stroke: "white", editable: true },
                new go.Binding("text", "name").makeTwoWay())
            ),  // end Auto Panel body

            // the Panel holding the left port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.leftArray
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "leftArray"),
              { row: 1, column: 0,
                itemTemplate:
                  $(go.Panel,
                    { _side: "left",  // internal property to make it easier to tell which side it's on
                      fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                      fromLinkable: true, toLinkable: true, cursor: "pointer" },
                    new go.Binding("portId", "portId"),
                    $(go.Shape, "Rectangle",
                      { stroke: null, strokeWidth: 0,
                        desiredSize: portSize,
                        margin: new go.Margin(1,0) },
                      new go.Binding("fill", "portColor"))
                  )  // end itemTemplate
              }
            ),  // end Vertical Panel

            // the Panel holding the top port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.topArray
            $(go.Panel, "Horizontal",
              new go.Binding("itemArray", "topArray"),
              { row: 0, column: 1,
                itemTemplate:
                  $(go.Panel,
                    { _side: "top",
                      fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                      fromLinkable: true, toLinkable: true, cursor: "pointer" },
                    new go.Binding("portId", "portId"),
                    $(go.Shape, "Rectangle",
                      { stroke: null, strokeWidth: 0,
                        desiredSize: portSize,
                        margin: new go.Margin(0, 1) },
                      new go.Binding("fill", "portColor"))
                  )  // end itemTemplate
              }
            ),  // end Horizontal Panel

            // the Panel holding the right port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.rightArray
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "rightArray"),
              { row: 1, column: 2,
                itemTemplate:
                  $(go.Panel,
                    { _side: "right",
                      fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                      fromLinkable: true, toLinkable: true, cursor: "pointer" },
                    new go.Binding("portId", "portId"),
                    $(go.Shape, "Rectangle",
                      { stroke: null, strokeWidth: 0,
                        desiredSize: portSize,
                        margin: new go.Margin(1, 0) },
                      new go.Binding("fill", "portColor"))
                  )  // end itemTemplate
              }
            ),  // end Vertical Panel

            // the Panel holding the bottom port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.bottomArray
            $(go.Panel, "Horizontal",
              new go.Binding("itemArray", "bottomArray"),
              { row: 2, column: 1,
                itemTemplate:
                  $(go.Panel,
                    { _side: "bottom",
                      fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                      fromLinkable: true, toLinkable: true, cursor: "pointer" },
                    new go.Binding("portId", "portId"),
                    $(go.Shape, "Rectangle",
                      { stroke: null, strokeWidth: 0,
                        desiredSize: portSize,
                        margin: new go.Margin(0, 1) },
                      new go.Binding("fill", "portColor"))
                  )  // end itemTemplate
              }
            )  // end Horizontal Panel
          );  // end Node

        // an orthogonal link template, reshapable and relinkable
        diagram.linkTemplate =
          $(go.Link,  // defined below
            {
              routing: go.Link.AvoidsNodes,
              corner: 4,
              curve: go.Link.JumpGap,
              reshapable: true,
              resegmentable: true,
              relinkableFrom: true,
              relinkableTo: true
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
          );
        diagram.model = go.Model.fromJSON(
    '{ "class": "go.GraphLinksModel",'+
    '  "copiesArrays": true,'+
    '  "copiesArrayObjects": true,'+
    '  "linkFromPortIdProperty": "fromPort",'+
    '  "linkToPortIdProperty": "toPort",'+
    '  "nodeDataArray": ['+
    '{"key":1, "name":"unit One", "loc":"101 204", "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ], "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ], "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ], "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ]},'+
    '{"key":2, "name":"unit Two", "loc":"322.00000000000006 145.99999999999994", "leftArray":[ {"portColor":"#cc585c", "portId":"left1"} ], "topArray":[ {"portColor":"#14abef", "portId":"top0"},{"portId":"top1", "portColor":"#d3f2c1"} ], "bottomArray":[ {"portColor":"#995aa6", "portId":"bottom1"} ], "rightArray":[]}'+
    ' ],'+
    '  "linkDataArray": [ {"from":1, "to":2, "fromPort":"right0", "toPort":"left1", "points":[137,199,151,199,229,199,229,237,177,237,177,145,276,145,286,145]} ]}'
          )
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        diagram.undoManager.isEnabled = true;
        // Add a port to the specified side of the selected nodes.
        function addPort(side, diagram) {
          diagram.startTransaction("addPort");
          diagram.selection.each(function(node) {
            if (!(node instanceof go.Node)) return;
            var i = 0;
            while (node.findPort(side + i.toString()) !== node) i++;
            var name = side + i.toString();
            var arr = node.data[side + "Array"];
            if (arr) {
              var newportdata = {portId: name, portColor: go.Brush.randomColor() };
              diagram.model.insertArrayItem(arr, -1, newportdata);
            }
          });
          diagram.commitTransaction("addPort");
        }

        // Remove the clicked port from the node.
        // Links to the port will be redrawn to the node's shape.
        function removePort(port, diagram) {
          diagram.startTransaction("removePort");
          var pid = port.portId;
          var arr = port.panel.itemArray;
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].portId === pid) {
              diagram.model.removeArrayItem(arr, i);
              break;
            }
          }
          diagram.commitTransaction("removePort");
        }

        var n2 = diagram.findNodeForKey(2);
        diagram.select(n2);

        test.assert(link.points.count === 8)
        // no change
        addPort('top', diagram);
        test.assert(link.points.count === 8)
        // no change
        addPort('bottom', diagram);
        test.assert(link.points.count === 8)

        // change!
        addPort('left', diagram);
        test.assert(link.points.count === 6)

        diagram.commandHandler.undo();
        test.assert(link.points.count === 8)

        // change because the node became larger
        addPort('right', diagram);
        test.assert(link.points.count === 6)

        diagram.commandHandler.undo();
        test.assert(link.points.count === 8)

      }));



      Invalidation.add(new Test('Invalidation 1 - move spot A', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("A").alignment = new go.Spot(0,1,40,5);
        diagram.commitTransaction();
        test.assert(link.actualBounds.height !== 44);
      }));

      Invalidation.add(new Test('Invalidation 1 - move spot B', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var oldwidth = link.actualBounds.width;
        var oldheight = link.actualBounds.height;
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("B").alignment = new go.Spot(0,1,40,5);
        diagram.commitTransaction();
        test.assert(link.actualBounds.width === oldwidth);
        test.assert(link.actualBounds.height === oldheight);
      }));

      Invalidation.add(new Test('Invalidation 1 - enlargeSpotB', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var oldwidth = link.actualBounds.width;
        var oldheight = link.actualBounds.height;
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").findObject("B").height = 50;
        diagram.commitTransaction();
        // it should have changed
        test.assert(link.actualBounds.height !== oldheight);
      }));

      Invalidation.add(new Test('Invalidation 1 - moveNode', null,
      function(test) {
        CommonSetupInvalidation(test);
        var model = test.diagram.model;
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        diagram.startTransaction();
        diagram.findNodeForKey("Beta").moveTo(diagram.findNodeForKey("Beta").position.x, diagram.findNodeForKey("Beta").position.y - 10);
        diagram.commitTransaction();
        test.assert(link.actualBounds.height !== 44);
      }));


      // *************************************** //
      function CommonSetupInvalidation2(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;

        test.diagram.toolManager.draggingTool.dragsTree = true;

        test.diagram.nodeTemplate =
          $(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.Parse).makeTwoWay(go.Point.Stringify),
            $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: 'lime' }),
            $(go.TextBlock,
              { margin: 8 },
              new go.Binding("text", "key")),
            $("TreeExpanderButton")
          );


        test.diagram.linkTemplate =
          $(go.Link,
            {
              routing: go.Link.AvoidsNodes,
              corner: 4,
              curve: go.Link.JumpGap,
              reshapable: true,
              resegmentable: true,
              relinkableFrom: true,
              relinkableTo: true
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
          );

        test.diagram.model = go.Model.fromJSON(
    '{ "class": "go.GraphLinksModel",' +
    '  "copiesArrays": true,' +
    '  "copiesArrayObjects": true,' +
    '  "linkFromPortIdProperty": "fromPort",' +
    '  "linkToPortIdProperty": "toPort",' +
    '  "nodeDataArray": [' +
    '{"key":1, "name":"unit One", "loc":{"class":"go.Point", "x":-22, "y":-32}, "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ], "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ], "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ], "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ]},' +
    '{"key":2, "name":"unit Two", "loc":{"class":"go.Point", "x":114, "y":52}, "leftArray":[ {"portColor":"#cc585c", "portId":"left1"} ], "topArray":[ {"portColor":"#14abef", "portId":"top0"},{"portId":"top1", "portColor":"#d3f2c1"} ], "bottomArray":[ {"portColor":"#995aa6", "portId":"bottom1"} ], "rightArray":[]}' +
    ' ],' +
    '  "linkDataArray": [ {"from":1, "to":2, "fromPort":"right0", "toPort":"left1", "points":[7,-14,17,-14,108,-14,108,-63,60,-63,60,30,10,30,10,69,104,69,114,69]} ]}');
      } // end setup

      // Collapse, expand
      Invalidation.add(new Test('Link valid 1.0', null,
      function(test) {
        CommonSetupInvalidation2(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var node = diagram.findNodeForKey('1');
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseTree(node);
        checkPoints(test, old, link.points);
        diagram.commandHandler.expandTree(node);
        checkPoints(test, old, link.points);
      })); // end test

      // Move parts (don't expand collapse)
      Invalidation.add(new Test('Link valid 1.1', null,
      function(test) {
        CommonSetupInvalidation2(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var node = diagram.findNodeForKey('1');
        var old = link.points.copy();
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(node);
        var dragtool = diagram.toolManager.findTool('Dragging');
        diagram.currentTool = dragtool;
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(50, 100), false);
        diagram.commitTransaction();

        checkPoints(test, old, link.points);
      })); // end test

      // Collapse, move, expand
      Invalidation.add(new Test('Link valid 1.2', null,
      function(test) {
        CommonSetupInvalidation2(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;

        var link = diagram.links.first();
        var node = diagram.findNodeForKey('1');
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseTree(node);
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(node);
        var dragtool = diagram.toolManager.findTool('Dragging');
        diagram.currentTool = dragtool;
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(100, 50), false);
        diagram.commitTransaction();
        diagram.commandHandler.expandTree(node);
        checkPoints(test, old, link.points);
      })); // end test




      // *************************************** //
      function CommonSetupInvalidation3(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;

        test.diagram.nodeTemplate =
          $(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.Parse).makeTwoWay(go.Point.Stringify),
            $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: 'lime' }),
            $(go.TextBlock,
              { margin: 8 },
              new go.Binding("text", "key")),
            $("TreeExpanderButton")
          );

        test.diagram.groupTemplate =
          $(go.Group, "Auto",
            $(go.Shape, "Rectangle",
              { fill: null, stroke: "gray", strokeWidth: 2 }),
            $(go.Panel, "Vertical",
              { defaultAlignment: go.Spot.Left, margin: 4 },
              $(go.Panel, "Horizontal",
                { defaultAlignment: go.Spot.Top },
                // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
                $("SubGraphExpanderButton"),
                $(go.TextBlock,
                  { font: "Bold 18px Sans-Serif", margin: 4 },
                  new go.Binding("text", "key"))
              ),
              // create a placeholder to represent the area where the contents of the group are
              $(go.Placeholder,
                { padding: new go.Margin(0, 10) })
            )  // end Vertical Panel
          );  // end Group

        test.diagram.linkTemplate =
          $(go.Link,
            {
              routing: go.Link.Orthogonal,
              corner: 4,
              curve: go.Link.JumpGap,
              reshapable: true,
              resegmentable: true,
              relinkableFrom: true,
              relinkableTo: true
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
          );

        test.diagram.model = go.Model.fromJSON(
    '{ "class": "go.GraphLinksModel",'+
    '  "copiesArrays": true,'+
    '  "copiesArrayObjects": true,'+
    '  "linkFromPortIdProperty": "fromPort",'+
    '  "linkToPortIdProperty": "toPort",'+
    '  "nodeDataArray": ['+
    '{"key":1, "name":"unit One", "loc":{"class":"go.Point", "x":-22, "y":-32}, "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ], "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ], "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ], "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ], "group":"Group"},'+
    '{"key":2, "name":"unit Two", "loc":{"class":"go.Point", "x":114, "y":52}, "leftArray":[ {"portColor":"#cc585c", "portId":"left1"} ], "topArray":[ {"portColor":"#14abef", "portId":"top0"},{"portId":"top1", "portColor":"#d3f2c1"} ], "bottomArray":[ {"portColor":"#995aa6", "portId":"bottom1"} ], "rightArray":[], "group":"Group"},'+
    '{"key":"Group", "isGroup":true, "color":"blue"}'+
    ' ],'+
    '  "linkDataArray": [ {"from":1, "to":2, "fromPort":"right0", "toPort":"left1", "points":[7.522847498307936,-14.199660235221032,17.522847498307936,-14.199660235221032,60.76142374915397,-14.199660235221032,60.76142374915398,26.333328247070312,19.333333015441895,26.333328247070312,19.333333015441895,69.80033976477897,104,69.80033976477897,114,69.80033976477897]} ]}');


      } // end setup

      // Collapse, expand
      Invalidation.add(new Test('Link valid 2.0', null,
      function(test) {
        CommonSetupInvalidation3(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var group = diagram.findNodeForKey('Group');
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseSubGraph(group);
        checkPoints(test, old, link.points);
        diagram.commandHandler.expandSubGraph(group);
        checkPoints(test, old, link.points);
      })); // end test

      // Move parts (don't expand collapse)
      Invalidation.add(new Test('Link valid 2.1', null,
      function(test) {
        CommonSetupInvalidation3(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var group = diagram.findNodeForKey('Group');
        var old = link.points.copy();
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(group);
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(50, 100), false);
        diagram.commitTransaction();

        checkPoints(test, old, link.points);
      })); // end test

      // Collapse, move, expand
      Invalidation.add(new Test('Link valid 2.2', null,
      function(test) {
        CommonSetupInvalidation3(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var group = diagram.findNodeForKey('Group');
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseSubGraph(group);
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(group);
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(100, 50), false);
        diagram.commitTransaction();
        diagram.commandHandler.expandSubGraph(group);
        checkPoints(test, old, link.points);
      })); // end test



     // Dragstree is false this time, instead select both nodes to make sure link
     // route is kept, even when Node 2 is collapsed
     // *************************************** //
      function CommonSetupInvalidation4(test) {
        //test.diagram.reset();
        var $ = go.GraphObject.make;

        test.diagram.toolManager.draggingTool.dragsTree = false;

        test.diagram.nodeTemplate =
          $(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.Parse).makeTwoWay(go.Point.Stringify),
            $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: 'lime' }),
            $(go.TextBlock,
              { margin: 8 },
              new go.Binding("text", "key")),
            $("TreeExpanderButton")
          );


        test.diagram.linkTemplate =
          $(go.Link,
            {
              routing: go.Link.AvoidsNodes,
              corner: 4,
              curve: go.Link.JumpGap,
              reshapable: true,
              resegmentable: true,
              relinkableFrom: true,
              relinkableTo: true
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
          );

        test.diagram.model = go.Model.fromJSON(
    '{ "class": "go.GraphLinksModel",' +
    '  "copiesArrays": true,' +
    '  "copiesArrayObjects": true,' +
    '  "linkFromPortIdProperty": "fromPort",' +
    '  "linkToPortIdProperty": "toPort",' +
    '  "nodeDataArray": [' +
    '{"key":1, "name":"unit One", "loc":{"class":"go.Point", "x":-22, "y":-32}, "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ], "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ], "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ], "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ]},' +
    '{"key":2, "name":"unit Two", "loc":{"class":"go.Point", "x":114, "y":52}, "leftArray":[ {"portColor":"#cc585c", "portId":"left1"} ], "topArray":[ {"portColor":"#14abef", "portId":"top0"},{"portId":"top1", "portColor":"#d3f2c1"} ], "bottomArray":[ {"portColor":"#995aa6", "portId":"bottom1"} ], "rightArray":[]}' +
    ' ],' +
    '  "linkDataArray": [ {"from":1, "to":2, "fromPort":"right0", "toPort":"left1", "points":[7,-14,17,-14,108,-14,108,-63,60,-63,60,30,10,30,10,69,104,69,114,69]} ]}');
      } // end setup

      function checkPoints(test, oldpts, newpts) {
        test.assert(oldpts.count === newpts.count, "The link route was not preserved.");
      }

      // Collapse, expand
      Invalidation.add(new Test('Link valid 3.0', null,
      function(test) {
        CommonSetupInvalidation4(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var node = diagram.findNodeForKey(1);
        var node2 = diagram.findNodeForKey(2);
        node.isSelected = true;
        node2.isSelected = true;
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseTree(node);
        checkPoints(test, old, link.points);
        diagram.commandHandler.expandTree(node);
        checkPoints(test, old, link.points);
      })); // end test

      // Move parts (don't expand collapse)
      Invalidation.add(new Test('Link valid 3.1', null,
      function(test) {
        CommonSetupInvalidation4(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;
        var link = diagram.links.first();
        var node = diagram.findNodeForKey(1);
        var node2 = diagram.findNodeForKey(2);
        node.isSelected = true;
        node2.isSelected = true;
        var old = link.points.copy();
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(node);
        coll.add(node2);
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(50, 100), false);
        diagram.commitTransaction();

        checkPoints(test, old, link.points);
      })); // end test

      // Collapse, move, expand
      Invalidation.add(new Test('Link valid 3.2', null,
      function(test) {
        CommonSetupInvalidation4(test);
      },
      null,
      function(test) {
        var diagram = test.diagram;

        var link = diagram.links.first();
        var node = diagram.findNodeForKey(1);
        var node2 = diagram.findNodeForKey(2);
        node.isSelected = true;
        node2.isSelected = true;
        var old = link.points.copy();
        checkPoints(test, old, link.points);
        diagram.commandHandler.collapseTree(node);
        checkPoints(test, old, link.points);

        // Then move
        var tool = diagram.toolManager.draggingTool;
        var coll = new go.Set();
        coll.add(node);
        coll.add(node2);
        var coll2 = diagram.commandHandler.computeEffectiveCollection(coll);
        diagram.startTransaction();
        tool.moveParts(coll2, new go.Point(100, 50), false);
        diagram.commitTransaction();
        diagram.commandHandler.expandTree(node);
        checkPoints(test, old, link.points);
      })); // end test


      // Expand and collapse invalidates the route when there's a layout
      Invalidation.add(new Test('Link relayout reroute', null,
      function(test) {
        var diagram = test.diagram;
        var $ = go.GraphObject.make;
        diagram.layout = $(go.TreeLayout, { nodeSpacing: 5, layerSpacing: 30 });

        diagram.nodeTemplate =
          $(go.Node, "Horizontal",
            $(go.Panel, "Auto",
              $(go.Shape, { fill: "#1F4963", stroke: null }),
              $(go.TextBlock,
                { width: 45, height: 15, font: "bold 13px Helvetica, bold Arial, sans-serif",
                  stroke: "white", margin: 3 },
                new go.Binding("text", "key"))
            ),
            $("TreeExpanderButton")
          );

        diagram.linkTemplate =
          $(go.Link,
            { selectable: false },
            $(go.Shape));

        diagram.model =
          $(go.TreeModel, {
            isReadOnly: true,
            nodeDataArray:[
              { key: "Alpha" },
              { key: "Beta1", parent: "Alpha" },
              { key: "Beta2", parent: "Alpha" },
            ]
          });
      },
      null,
      function(test) {
          var diagram = test.diagram;
          diagram.startTransaction('');
          diagram.commitTransaction('');

          diagram.commandHandler.collapseTree(diagram.findNodeForKey('Alpha'));
          diagram.commandHandler.expandTree(diagram.findNodeForKey('Alpha'));

          test.assert(diagram.links.first().actualBounds.height !== 1);
      })); // end test

      Invalidation.add(new Test("extra move on drop", null,
        function(test) {
          var diagram = test.diagram;
          diagram.reset();
          var tool = diagram.toolManager.draggingTool;
          tool.doDropOnto = function(pt, obj) {
            var loc = pt.copy().offset(30, 70);
            var it = (tool.copiedParts || tool.draggedParts).iterator;
            while (it.next()) {
              var n = it.key;
              if (n instanceof go.Node) {
                n.location = loc;
              }
            }
          };
          var $ = go.GraphObject.make;
          diagram.nodeTemplate =
            $(go.Node,
              { locationSpot: go.Spot.Center },
              new go.Binding("location", "loc", go.Point.parse),
              $(go.Shape, { fill: "whitesmoke", width: 50, height: 50 })
            );
          diagram.model =
            $(go.GraphLinksModel, {
              nodeDataArray: [
                { key: 1, loc: "0 0" },
                { key: 2, loc: "100 0" }
              ],
              linkDataArray: [
                { from: 1, to: 2 },
                { from: 2, to: 2 }
              ]
            });
        },
        function(test) {
          test.mouseDown(new go.Point(100, 0), { timestamp: 0 });
          test.mouseMove(new go.Point(120, 20), { timestamp: 100 });
          test.mouseUp(new go.Point(140, 40), { timestamp: 200 });
        },
        function(test) {
          var diagram = test.diagram;
          var n2 = diagram.findNodeForKey(2);
          test.assert(n2.location.equalsApprox(new go.Point(170, 110)), "didn't shift node2 after drop " + n2.location.toString());
          var l2 = diagram.findLinkForData(diagram.model.linkDataArray[1]);
          test.assert(test.isApprox(l2.points.elt(0).y, 135.5) && test.isApprox(l2.points.elt(3).y, 135.5),
            "didn't re-route link points to be against bottom of moved node " + l2.points.elt(0).y);
        }));

      // This shows something fixed by reverting Changeset 24766
      // The fix changeset is Changeset 25234
      // When you moved a node in an expanded group and collapsed then expanded the group
      // the layout would reset the node positions, but the link would incorrectly point to the old location
      Invalidation.add(new Test("Link valid 4.1", null,
        function(test) {
          var diagram = test.diagram;
          diagram.reset();
          var $ = go.GraphObject.make;
          diagram.groupTemplate =
             $(go.Group, "Auto",
               { layout: $(go.TreeLayout) },
               $(go.Shape, "Rectangle", { fill: "orange", stroke: "darkorange" }),
               $(go.Panel, "Table",
                 { margin: 0.5 },  // avoid overlapping border with table contents
                 $(go.RowColumnDefinition, { row: 0, background: "white" }),  // header is white
                 $("SubGraphExpanderButton", { row: 0, column: 0, margin: 3 }),
                 $(go.TextBlock,  // title is centered in header
                   { row: 0, column: 1, width: 40, height: 15, font: "bold 14px Sans-Serif", stroke: "darkorange",
                     textAlign: "center", stretch: go.GraphObject.Horizontal },
                   new go.Binding("text")),
                 $(go.Placeholder,  // becomes zero-sized when Group.isSubGraphExpanded is false
                   { row: 1, columnSpan: 2, padding: 10, alignment: go.Spot.TopLeft },
                   new go.Binding("padding", "isSubGraphExpanded",
                                  function(exp) { return exp ? 10 : 0; } ).ofObject())
               )
             );

           // define a simple Node template
           diagram.nodeTemplate =
             $(go.Node, "Auto",  // the Shape will go around the TextBlock
               $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: 'white'}),
               $(go.TextBlock,
                 { margin: 8, width: 40, height: 15 },  // some room around the text
                 // TextBlock.text is bound to Node.data.key
                 new go.Binding("text", "key"))
             );

           diagram.layout = $(go.TreeLayout);

           diagram.model = new go.GraphLinksModel([

               { key: 2, text: "GROUP", isGroup: true },
               { key: 3, text: "Beta", group: 2 },
               { key: 4, text: "Gamma", group: 2 }

             ], [
               { from: 3, to: 4 }
             ]);

        },
        function(test) {},
        function(test) {
          var diagram = test.diagram;
          diagram.startTransaction('');
          diagram.commitTransaction('');

          diagram.startTransaction('');
          var l = diagram.findNodeForKey(4).location.copy();
          l.y += 50;
          diagram.findNodeForKey(4).location = l;
          diagram.commitTransaction('');

          diagram.commandHandler.collapseSubGraph(diagram.findNodeForKey(2))
          diagram.commandHandler.expandSubGraph(diagram.findNodeForKey(2))

          test.assert(diagram.links.first().actualBounds.height < 10);
        }));


      Invalidation.add(new Test('Invalidation RowColumn', null,
      function(test) {
        var $ = go.GraphObject.make;
        var diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate =
          $(go.Node, "Table",
            {
              selectionObjectName: "SCROLLING",
              resizable: true, resizeObjectName: "SCROLLING",
              portSpreading: go.Node.SpreadingNone
            },
            new go.Binding("location").makeTwoWay(),
                { stretch: go.GraphObject.Fill },
                new go.Binding("itemArray", "items"),
                new go.Binding("column", "left", function(left) { return left ? 2 : 0; }),
                new go.Binding("desiredSize", "size").makeTwoWay(),
                {
                  name: "SCROLLING",
                  desiredSize: new go.Size(NaN, 60),
                  "itemTemplate":
                    $(go.Panel, "TableRow",
                      {
                        defaultStretch: go.GraphObject.Horizontal,
                        fromSpot: go.Spot.LeftRightSides, toSpot: go.Spot.LeftRightSides,
                        fromLinkable: true, toLinkable: true
                      },
                      new go.Binding("portId", "name"),
                      $(go.TextBlock, { width: 30, height: 14, column: 0 }, new go.Binding("text", "name")),
                      $(go.TextBlock, { width: 30, height: 14, column: 1 }, new go.Binding("text", "value"))
                    ),
                  "defaultColumnSeparatorStroke": "gray",
                  "defaultColumnSeparatorStrokeWidth": 0.5,
                  "defaultRowSeparatorStroke": "gray",
                  "defaultRowSeparatorStrokeWidth": 0.5,
                  "defaultSeparatorPadding": new go.Margin(1, 3, 0, 3)
                }
              );

        diagram.model = $(go.GraphLinksModel,
          {
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: [
              {
                key: "Alpha", left: true, location: new go.Point(0, 0), size: new go.Size(100, 50),
                items:
                [
                  { name: "A", value: 1 }, { name: "B", value: 2 }, { name: "C", value: 3 },
                  { name: "D", value: 4 }, { name: "E", value: 5 }, { name: "F", value: 6 },
                  { name: "G", value: 7 } ]
              },
              {
                key: "Beta", location: new go.Point(150, 0),
                items:
                [
                  { name: "Aa", value: 1 }, { name: "Bb", value: 2 }, { name: "Cc", value: 3 }, { name: "Dd", value: 4 }, { name: "Ee", value: 5 },
                  { name: "Ff", value: 6 }, { name: "Gg", value: 7 }, { name: "Hh", value: 8 }, { name: "Ii", value: 9 }, { name: "Jj", value: 10 },
                  { name: "Kk", value: 11 }, { name: "Ll", value: 12 }, { name: "Mm", value: 13 }, { name: "Nn", value: 14 }
                ]
              }
            ],
            linkDataArray: [ { from: "Alpha", fromPort: "C", to: "Beta", toPort: "Nn" } ]
          });

      },
      null,
      function(test) {
        var diagram = test.diagram;
        var l = diagram.links.first();
        test.assert(l.actualBounds.height === 25.5);
        diagram.startTransaction();
        diagram.nodes.first().topIndex = 2
        diagram.commitTransaction();
        test.assert(test.isApprox(l.actualBounds.height, 56.42));

      }));


    // These test moving a link and making sure jumpovers appear/disappear
    Invalidation.add(new Test('Invalidation JumpOver1', null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, "Auto",
      new go.Binding('position').makeTwoWay(),
        $(go.Shape,
          {
            fill: "white", portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, width: 30, height: 15 },
          new go.Binding("text"))
      );

    diagram.linkTemplate =
      $(go.Link, { routing: go.Link.Orthogonal, curve: go.Link.JumpOver },
        $(go.Shape, { strokeWidth: 2 }),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    diagram.model = go.Model.fromJSON(
      '      { "class": "GraphLinksModel",' +
      '  "nodeDataArray": [' +
      '{"key":1, "text":"Alpha", "color":"lightblue", "position":{"class":"go.Point", "x":-8, "y":22}},' +
      '{"key":2, "text":"Beta", "color":"orange", "position":{"class":"go.Point", "x":122, "y":4}},' +
      '{"key":3, "text":"Gamma", "color":"lightgreen", "position":{"class":"go.Point", "x":0, "y":69}},' +
      '{"key":4, "text":"Delta", "color":"pink", "position":{"class":"go.Point", "x":111, "y":82}}' +
      ' ],' +
      '  "linkDataArray": [' +
      '{"from":1, "to":4},' +
      '{"from":2, "to":3}' +
      ' ]}'
          );


    },
    null,
    function(test) {
      var diagram = test.diagram;

      // These test moving a link and making sure jumpovers appear/disappear

      var alphaLink = diagram.findNodeForKey(1).linksConnected.first();
      var betaLink = diagram.findNodeForKey(2).linksConnected.first();
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 5);

      // Move delta, no more jump overs:
      // delta move to  47, -92
      diagram.startTransaction();
      diagram.findNodeForKey(4).position = new go.Point(47, -92);
      diagram.commitTransaction();
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 3);

      // Move Alpha, jump over again:
      // 49, _y: 203
      diagram.startTransaction();
      diagram.findNodeForKey(1).position = new go.Point(49, 203);
      diagram.commitTransaction();
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 5);
    })); // end test



    // These test moving a link via dragging and making sure jumpovers appear/disappear
    Invalidation.add(new Test('Invalidation JumpOver2', null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, "Auto",
      new go.Binding('position').makeTwoWay(),
        $(go.Shape,
          {
            fill: "white", portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, width: 30, height: 15 },
          new go.Binding("text"))
      );

    diagram.linkTemplate =
      $(go.Link, { routing: go.Link.Orthogonal, curve: go.Link.JumpOver },
        $(go.Shape, { strokeWidth: 2 }),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    diagram.model = go.Model.fromJSON(
      '      { "class": "GraphLinksModel",' +
      '  "nodeDataArray": [' +
      '{"key":1, "text":"Alpha", "color":"lightblue", "position":{"class":"go.Point", "x":-8, "y":22}},' +
      '{"key":2, "text":"Beta", "color":"orange", "position":{"class":"go.Point", "x":122, "y":4}},' +
      '{"key":3, "text":"Gamma", "color":"lightgreen", "position":{"class":"go.Point", "x":0, "y":69}},' +
      '{"key":4, "text":"Delta", "color":"pink", "position":{"class":"go.Point", "x":111, "y":82}}' +
      ' ],' +
      '  "linkDataArray": [' +
      '{"from":1, "to":4},' +
      '{"from":2, "to":3}' +
      ' ]}'
          );


    },
    null,
    function(test) {
      var diagram = test.diagram;

      // These test moving a link and making sure jumpovers appear/disappear

      var alphaLink = diagram.findNodeForKey(1).linksConnected.first();
      var betaLink = diagram.findNodeForKey(2).linksConnected.first();
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 5);

      // Move delta, no more jump overs:
      // delta is at 111, 82,
      // delta move to  47, -92
      var ctr = diagram.findNodeForKey(4).actualBounds.center;
      test.mouseDown(new go.Point(ctr.x, ctr.y), { timestamp: 0 });
      test.mouseMove(new go.Point(ctr.x - 50, ctr.y - 200), { timestamp: 200 });
      test.mouseUp(new go.Point(ctr.x - 70, ctr.y - 200), { timestamp: 300 });
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 3);

      // Move alpha for new jumpover
      var ctr1 = diagram.findNodeForKey(1).actualBounds.center;
      var ctr2 = diagram.findNodeForKey(2).actualBounds.center;
      test.mouseDown(new go.Point(ctr1.x, ctr1.y), { timestamp: 0 });
      test.mouseMove(new go.Point(ctr2.x - 50, ctr1.y + 80), { timestamp: 200 });
      test.mouseUp(new go.Point(ctr2.x - 50, ctr2.y + 90), { timestamp: 300 });
      test.assert(alphaLink.geometry.figures.first().segments.count === 3);
      test.assert(betaLink.geometry.figures.first().segments.count === 5);
    })); // end test


      var Rotated = new TestCollection("Rotated");
      LinkRoutingGeometryRoot.add(Rotated);

      function CommonSetupRotated(test, spots) {
        var diagram = test.diagram;
        diagram.reset();
        var $ = go.GraphObject.make;

        diagram.nodeTemplate =
          $(go.Node, "Auto",
            {
              width: 100, height: 80,
              rotatable: true, locationSpot: go.Spot.Center
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("angle").makeTwoWay(),
            $(go.Shape,
              { portId: "" },
              new go.Binding("fill", "color"),
              spots
            ),
            $(go.TextBlock,
              { margin: 8 },
              new go.Binding("text"))
          );

        diagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.Orthogonal },
            $(go.Shape),
            $(go.Shape, { toArrow: "OpenTriangle" })
          );

        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, text: "Alpha", color: "lightblue", loc: "50 40" },
            { key: 2, text: "Beta", color: "orange", loc: "240 240", angle: 150 },
            { key: 3, text: "Gamma", color: "lightblue", loc: "180 10" }
          ],
          [
            { from: 1, to: 2 },
            { from: 3, to: 2 }
          ]);
      }

      function CommonRotate180(test) {
        var diagram = test.diagram;
        diagram.startTransaction();
        var data = diagram.model.findNodeDataForKey(2);
        diagram.model.setDataProperty(data, "angle", -30);
        diagram.commitTransaction("rotated node");
      }

      function CommonRotate90(test) {
        var diagram = test.diagram;
        diagram.startTransaction();
        var data = diagram.model.findNodeDataForKey(2);
        diagram.model.setDataProperty(data, "angle", 240);
        diagram.commitTransaction("rotated node");
      }

      Rotated.add(new Test("No Spot", null,
        function(test) {
          CommonSetupRotated(test, {});
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 136.9), new go.Point(240.0, 136.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 121.9), new go.Point(240.0, 121.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 136.9), new go.Point(240.0, 136.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 121.9), new go.Point(240.0, 121.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 131.1), new go.Point(240.0, 131.1), new go.Point(240.0, 172.3), new go.Point(240.0, 182.3)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 116.1), new go.Point(240.0, 116.1), new go.Point(240.0, 172.3), new go.Point(240.0, 182.3)]
          ]);
        }
      ));

      Rotated.add(new Test("None", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.None, toSpot: go.Spot.None });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 136.9), new go.Point(240.0, 136.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 121.9), new go.Point(240.0, 121.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 136.9), new go.Point(240.0, 136.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 121.9), new go.Point(240.0, 121.9), new go.Point(240.0, 183.8), new go.Point(240.0, 193.8)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 131.1), new go.Point(240.0, 131.1), new go.Point(240.0, 172.3), new go.Point(240.0, 182.3)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 116.1), new go.Point(240.0, 116.1), new go.Point(240.0, 172.3), new go.Point(240.0, 182.3)]
          ]);
        }
      ));

      Rotated.add(new Test("Left-Right", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.Left, toSpot: go.Spot.Right });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 265.0), new go.Point(88.3, 265.0), new go.Point(186.7, 265.0), new go.Point(196.7, 265.0)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 265.0), new go.Point(153.3, 265.0), new go.Point(186.7, 265.0), new go.Point(196.7, 265.0)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 130.2), new go.Point(293.3, 130.2), new go.Point(293.3, 215.0), new go.Point(283.3, 215.0)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 115.2), new go.Point(293.3, 115.2), new go.Point(293.3, 215.0), new go.Point(283.3, 215.0)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 128.3), new go.Point(215.0, 128.3), new go.Point(215.0, 186.7), new go.Point(215.0, 196.7)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 113.3), new go.Point(215.0, 113.3), new go.Point(215.0, 186.7), new go.Point(215.0, 196.7)]
          ]);
        }
      ));

      Rotated.add(new Test("LeftSide-RightSide", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.LeftSide, toSpot: go.Spot.RightSide });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 276.5), new go.Point(91.7, 276.5), new go.Point(193.4, 276.5), new go.Point(203.4, 276.5)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 253.5), new go.Point(146.0, 253.5), new go.Point(172.0, 253.5), new go.Point(190.0, 253.5)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 130.2), new go.Point(286.6, 130.2), new go.Point(286.6, 203.5), new go.Point(276.6, 203.5)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 115.2), new go.Point(308.0, 115.2), new go.Point(308.0, 226.5), new go.Point(290.0, 226.5)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(0.0, 40.0), new go.Point(-10.0, 40.0), new go.Point(-10.0, 128.3), new go.Point(203.5, 128.3), new go.Point(203.5, 193.4), new go.Point(203.5, 203.4)],
            [new go.Point(130.0, 10.0), new go.Point(120.0, 10.0), new go.Point(120.0, 113.3), new go.Point(226.5, 113.3), new go.Point(226.5, 172.0), new go.Point(226.5, 190.0)]
          ]);
        }
      ));

      Rotated.add(new Test("LeftRightSides", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.LeftRightSides, toSpot: go.Spot.LeftRightSides });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0, 40.0), new go.Point(110.0, 40.0), new go.Point(148.3, 40.0), new go.Point(148.3, 265.0), new go.Point(186.7, 265.0), new go.Point(196.7, 265.0)],
            [new go.Point(230.0, 10.0), new go.Point(240.0, 10.0), new go.Point(293.3, 10.0), new go.Point(293.3, 112.5), new go.Point(293.3, 215.0), new go.Point(283.3, 215.0)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(100.0, 40.0), new go.Point(110.0, 40.0), new go.Point(148.3, 40.0), new go.Point(148.3, 265.0), new go.Point(186.7, 265.0), new go.Point(196.7, 265.0)],
            [new go.Point(230.0, 10.0), new go.Point(240.0, 10.0), new go.Point(293.3, 10.0), new go.Point(293.3, 112.5), new go.Point(293.3, 215.0), new go.Point(283.3, 215.0)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(100.0, 40.0), new go.Point(110.0, 40.0), new go.Point(203.5, 40.0), new go.Point(203.5, 116.7), new go.Point(203.5, 193.4), new go.Point(203.5, 203.4)],
            [new go.Point(230.0, 10.0), new go.Point(240.0, 10.0), new go.Point(240.0, 113.3), new go.Point(226.5, 113.3), new go.Point(226.5, 172.0), new go.Point(226.5, 190.0)]
          ]);
        }
      ));

      Rotated.add(new Test("AllSides", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 142.8), new go.Point(205.6, 142.8), new go.Point(205.6, 195.7), new go.Point(205.6, 213.7)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 123.5), new go.Point(234.4, 123.5), new go.Point(234.4, 187.0), new go.Point(234.4, 197.0)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 146.8), new go.Point(205.6, 146.8), new go.Point(205.6, 203.7), new go.Point(205.6, 213.7)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 119.5), new go.Point(234.4, 119.5), new go.Point(234.4, 179.0), new go.Point(234.4, 197.0)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(50.0, 80.0), new go.Point(50.0, 90.0), new go.Point(50.0, 141.7), new go.Point(203.5, 141.7), new go.Point(203.5, 193.4), new go.Point(203.5, 203.4)],
            [new go.Point(180.0, 50.0), new go.Point(180.0, 60.0), new go.Point(180.0, 116.0), new go.Point(226.5, 116.0), new go.Point(226.5, 172.0), new go.Point(226.5, 190.0)]
          ]);
        }
      ));

      Rotated.add(new Test("BottomLeft-TopRight", null,
        function(test) {
          CommonSetupRotated(test, { fromSpot: go.Spot.BottomLeft, toSpot: go.Spot.TopRight });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 80.0), new go.Point(-7.1, 87.1), new go.Point(-7.1, 306.7), new go.Point(101.3, 306.7), new go.Point(209.6, 306.7), new go.Point(216.7, 299.6)],
            [new go.Point(130.0, 50.0), new go.Point(122.9, 57.1), new go.Point(122.9, 306.7), new go.Point(166.3, 306.7), new go.Point(209.6, 306.7), new go.Point(216.7, 299.6)]
          ]);
          CommonRotate180(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(0.0, 80.0), new go.Point(-7.1, 87.1), new go.Point(-7.1, 130.2), new go.Point(270.4, 130.2), new go.Point(270.4, 173.3), new go.Point(263.3, 180.4)],
            [new go.Point(130.0, 50.0), new go.Point(122.9, 57.1), new go.Point(122.9, 115.2), new go.Point(270.4, 115.2), new go.Point(270.4, 173.3), new go.Point(263.3, 180.4)]
          ]);
          CommonRotate90(test);
          test.assertAllLinkPoints([
            [new go.Point(0.0, 80.0), new go.Point(-7.1, 87.1), new go.Point(-7.1, 128.3), new go.Point(173.3, 128.3), new go.Point(173.3, 209.6), new go.Point(180.4, 216.7)],
            [new go.Point(130.0, 50.0), new go.Point(122.9, 57.1), new go.Point(122.9, 113.3), new go.Point(173.3, 113.3), new go.Point(173.3, 209.6), new go.Point(180.4, 216.7)]
          ]);
        }
      ));


      var Groups = new TestCollection("Groups");
      LinkRoutingGeometryRoot.add(Groups);

      function CommonSetupGroups(test) {
        var diagram = test.diagram;
        diagram.reset();
        var $ = go.GraphObject.make;

        diagram.nodeTemplate =
          $(go.Node, "Auto",
            { width: 60, height: 40 },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape,
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              new go.Binding("text"))
          );

        diagram.linkTemplate =
          $(go.Link,
            { reshapable: true, resegmentable: true },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("routing", "ortho", function(o) { return o ? go.Link.Orthogonal : go.Link.Normal; }),
            $(go.Shape),
            $(go.Shape, { toArrow: "OpenTriangle" })
          );

        diagram.groupTemplate =
          $(go.Group, "Auto",
            { resizable: true },
            new go.Binding("desiredSize").makeTwoWay(),
            $(go.Shape, { fill: "#999999" }),
            $(go.Panel, "Vertical",
              $(go.TextBlock, new go.Binding("text"), { height: 15 }),
              $(go.Placeholder)
            )
          );

        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, text: "Alpha", color: "lightblue", loc: "0 0", group: 5 },
            { key: 2, text: "Beta", color: "orange", loc: "100 80", group: 5 },
            { key: 3, text: "Gamma", color: "lightgreen", loc: "70 220" },
            { key: 5, text: "Group", isGroup: true }
          ],
          [
            { from: 1, to: 2, points: [58.6, 40.0, 131.4, 20.0, 101.4, 80.0] },
            { from: 1, to: 1, points: [60.0, 25.0, 80.0, 25.0, 80.0, 60.0, 45.0, 60.0, 45.0, 40.0], ortho: true },
            { from: 3, to: 2 },
            { from: 3, to: 5 },
            { from: 5, to: 5, points: [0.0, 90.0, -20.0, 90.0, -20.0, 140.0, 20.0, 140.0, 20.0, 120.0], ortho: true }
          ]);
      }

      Groups.add(new Test("moved", null,
        function(test) {
          CommonSetupGroups(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
            [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
            [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
            [new go.Point(97.9, 220.0), new go.Point(87.3, 120.5)],
            [new go.Point(0.0, 90.0), new go.Point(-20.0, 90.0), new go.Point(-20.0, 140.0), new go.Point(20.0, 140.0), new go.Point(20.0, 120.0)]
          ]);

          var diagram = test.diagram;
          var g = diagram.findNodeForKey(5);
          diagram.startTransaction();
          diagram.moveParts(new go.Set().addAll([g]), new go.Point(20, 30), false);
          diagram.commitTransaction("moved");
          // resize group
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(78.6, 70.0), new go.Point(151.4, 50.0), new go.Point(121.4, 110.0)],
            [new go.Point(80.0, 55.0), new go.Point(100.0, 55.0), new go.Point(100.0, 90.0), new go.Point(65.0, 90.0), new go.Point(65.0, 70.0)],
            [new go.Point(109.1, 220.0), new go.Point(140.9, 150.0)],
            [new go.Point(100.0, 220.0), new go.Point(100.0, 150.5)],
            [new go.Point(20.0, 120.0), new go.Point(0.0, 120.0), new go.Point(0.0, 170.0), new go.Point(40.0, 170.0), new go.Point(40.0, 150.0)]
          ]);
        }
      ));

      Groups.add(new Test("dragged", null,
        function(test) {
          CommonSetupGroups(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
            [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
            [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
            [new go.Point(97.9, 220.0), new go.Point(87.3, 120.5)],
            [new go.Point(0.0, 90.0), new go.Point(-20.0, 90.0), new go.Point(-20.0, 140.0), new go.Point(20.0, 140.0), new go.Point(20.0, 120.0)]
          ]);

          test.mouseDown(new go.Point(60, 80), { timestamp: 0 });
          test.mouseMove(new go.Point(60 + 10, 80 + 10), { timestamp: 200 });
          test.mouseUp(new go.Point(60 + 20, 80 + 30), { timestamp: 300 });
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(78.6, 70.0), new go.Point(151.4, 50.0), new go.Point(121.4, 110.0)],
            [new go.Point(80.0, 55.0), new go.Point(100.0, 55.0), new go.Point(100.0, 90.0), new go.Point(65.0, 90.0), new go.Point(65.0, 70.0)],
            [new go.Point(109.1, 220.0), new go.Point(140.9, 150.0)],
            [new go.Point(100.0, 220.0), new go.Point(100.0, 150.5)],
            [new go.Point(20.0, 120.0), new go.Point(0.0, 120.0), new go.Point(0.0, 170.0), new go.Point(40.0, 170.0), new go.Point(40.0, 150.0)]
          ]);
        }
      ));

      Groups.add(new Test("sized", null,
        function(test) {
          CommonSetupGroups(test);
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
            [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
            [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
            [new go.Point(97.9, 220.0), new go.Point(87.3, 120.5)],
            [new go.Point(0.0, 90.0), new go.Point(-20.0, 90.0), new go.Point(-20.0, 140.0), new go.Point(20.0, 140.0), new go.Point(20.0, 120.0)]
          ]);

          var diagram = test.diagram;
          var g = diagram.findNodeForKey(5);
          diagram.startTransaction();
          // this should cause link from 5 to 5 to be rerouted
          g.desiredSize = new go.Size(160 + 30, 120 + 30);
          diagram.commitTransaction("sized");
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
            [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
            [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
            [new go.Point(97.9, 220.0), new go.Point(88.0, 127.5)],
            [new go.Point(175.0, 52.5), new go.Point(201.0, 52.5), new go.Point(201.0, 153.5), new go.Point(140.5, 153.5), new go.Point(80.0, 153.5), new go.Point(80.0, 127.5)]
          ]);
        }
      ));

      Groups.add(new Test("resized", null,
        function(test) {
          CommonSetupGroups(test);
          test.diagram.findNodeForKey(5).isSelected = true;
        },
        function(test) {
          test.assertAllLinkPoints([
            [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
            [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
            [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
            [new go.Point(97.9, 220.0), new go.Point(87.3, 120.5)],
            [new go.Point(0.0, 90.0), new go.Point(-20.0, 90.0), new go.Point(-20.0, 140.0), new go.Point(20.0, 140.0), new go.Point(20.0, 120.0)]
          ]);

          // this should cause link from 5 to 5 to be rerouted
          test.mouseDown(new go.Point(160, 120), { timestamp: 0 });
          test.mouseMove(new go.Point(160 + 10, 120 + 10), { timestamp: 200 });
          test.mouseUp(new go.Point(160 + 30, 120 + 30), { timestamp: 300 });
        },
        function(test) {
          //test.dumpLinkPoints();
          test.assertAllLinkPoints([
            [new go.Point(73.1, 54.5), new go.Point(145.9, 34.5), new go.Point(115.9, 94.5)],
            [new go.Point(74.5, 39.5), new go.Point(94.5, 39.5), new go.Point(94.5, 74.5), new go.Point(59.5, 74.5), new go.Point(59.5, 54.5)],
            [new go.Point(107.1, 220.0), new go.Point(137.4, 134.5)],
            [new go.Point(99.4, 220.0), new go.Point(97.1, 149.5)],
            [new go.Point(189.5, 67.0), new go.Point(215.5, 67.0), new go.Point(215.5, 175.5), new go.Point(155.0, 175.5), new go.Point(94.5, 175.5), new go.Point(94.5, 149.5)]
          ]);
        }
      ));

      Groups.add(new Test("moved", null,
      function(test) {
        CommonSetupGroups(test);
        test.diagram.findNodeForKey(5).isSelected = true;
      },
      function(test) {
        test.assertAllLinkPoints([
          [new go.Point(58.6, 40.0), new go.Point(131.4, 20.0), new go.Point(101.4, 80.0)],
          [new go.Point(60.0, 25.0), new go.Point(80.0, 25.0), new go.Point(80.0, 60.0), new go.Point(45.0, 60.0), new go.Point(45.0, 40.0)],
          [new go.Point(104.3, 220.0), new go.Point(125.7, 120.0)],
          [new go.Point(97.9, 220.0), new go.Point(87.3, 120.5)],
          [new go.Point(0.0, 90.0), new go.Point(-20.0, 90.0), new go.Point(-20.0, 140.0), new go.Point(20.0, 140.0), new go.Point(20.0, 120.0)]
        ]);

        var g = test.diagram.findNodeForKey(5);
        g.move(new go.Point(50, 50));

      },
      function(test) {
        //test.dumpLinkPoints();
        test.assertAllLinkPoints([
          [new go.Point(109.1,105.5), new go.Point(181.9,85.5), new go.Point(151.9,145.5)],
          [new go.Point(110.5,90.5), new go.Point(130.5,90.5), new go.Point(130.5,125.5), new go.Point(95.5,125.5), new go.Point(95.5,105.5)],
          [new go.Point(121.6,220.0), new go.Point(158.9,185.5)],
          [new go.Point(105.0,220.0), new go.Point(113.5,186.0)],
          [new go.Point(211.0,118.0), new go.Point(237.0,118.0), new go.Point(237.0,212.0), new go.Point(183.8,212.0), new go.Point(130.5,212.0), new go.Point(130.5,186.0)]
        ]);
      }
    ));

      function CommonSetupGroupsCollapsed(test, layout) {
        var diagram = test.diagram;
        diagram.reset();
        var $ = go.GraphObject.make;

        if (layout) {
          diagram.layout = layout;
        }

        diagram.nodeTemplate =
          $(go.Node, "Auto",
            $(go.Shape,
              { portId: "", fromSpot: go.Spot.Bottom/*Side*/, toSpot: go.Spot.Top/*Side*/ },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              { margin: 2 },
              new go.Binding("text", "key")))

        diagram.linkTemplate =
          $(go.Link,
            { curve: go.Link.Bezier },
            $(go.Shape,  // the link shape
              { strokeWidth: 1.5 }),
            $(go.Shape,   // the arrowhead
              { toArrow: "Standard", scale: 1.5, fill: null, stroke: null, strokeWidth: 0 }));

        diagram.groupTemplate =
          $(go.Group, "Table",
            {
              layout: $(go.GridLayout, { cellSize: new go.Size(100, 1) })
            },
            $(go.TextBlock,  // the title
              { alignment: go.Spot.Left, font: "bold 11pt sans-serif" },
              new go.Binding("text", "key"),
              new go.Binding("stroke", "color")),
            $("SubGraphExpanderButton", { alignment: go.Spot.Right }),
            $(go.Panel, "Auto",
              { name: "BODY", row: 1, portId: "", fromSpot: go.Spot.BottomSide, toSpot: go.Spot.TopSide },
              // surround the subgraph with this shape
              $(go.Shape,
                { fill: "lightgray", strokeWidth: 2 },
                new go.Binding("stroke", "color")),
              // hold the subgraph, with a little space around it
              $(go.Placeholder, { padding: 10, minSize: new go.Size(20, 20) })
            )
          );

        diagram.model = new go.GraphLinksModel(
            [
              { key: "Group1", isGroup: true, color: "blue" },
              { key: "Group2", isGroup: true, color: "darkred" },
              { key: "Group3", isGroup: true, color: "green" },
              { key: "Alpha", group: "Group1", color: "lightblue" },
              { key: "Beta", group: "Group1", color: "orange" },
              { key: "Delta", group: "Group2", color: "pink" },
              { key: "Gamma", group: "Group2", color: "lightgreen" },
              { key: "Epsilon", group: "Group2", color: "orange" },
              { key: "Zeta", group: "Group3", color: "yellow" },
              { key: "Eta", group: "Group3", color: "lightgreen" },
              { key: "Theta", group: "Group3", color: "pink" }
            ],
            [
              { from: "Alpha", to: "Gamma" },
              { from: "Alpha", to: "Delta" },
              { from: "Beta", to: "Epsilon" },
              { from: "Beta", to: "Gamma" },
              { from: "Delta", to: "Theta" },
              { from: "Delta", to: "Zeta" },
              { from: "Epsilon", to: "Zeta" },
              { from: "Gamma", to: "Eta" }
            ]);
      }

      Groups.add(new Test("different spots collapsed, LDLayout", null,
        function(test) {
          CommonSetupGroupsCollapsed(test,
            go.GraphObject.make(go.LayeredDigraphLayout,
              { direction: 90, layerSpacing: 50, setsPortSpots: false }));
        },
        function(test) {
          var diagram = test.diagram;
          diagram.selectCollection(diagram.findTopLevelGroups());
          diagram.commandHandler.collapseSubGraph();
          diagram.findTopLevelGroups().each(function(g) {
            var countout = 0;
            var allxout = new go.Set();
            var allyout = new go.Set();
            var countin = 0;
            var allxin = new go.Set();
            var allyin = new go.Set();
            g.findExternalLinksConnected().each(function(l) {
              if (l.fromNode === g || l.fromNode.isMemberOf(g)) {
                countout++;
                allxout.add(l.getPoint(0).x);
                allyout.add(l.getPoint(0).y);
              } else {
                countin++;
                allxin.add(l.getPoint(l.pointsCount-1).x);
                allyin.add(l.getPoint(l.pointsCount-1).y);
              }
            });
            test.assert(allyin.count <= 1, "all input link points Y should be the same, not #" + allyin.count);
            test.assert(allyout.count <= 1, "all output link points Y should be the same, not #" + allyin.count);
            test.assert(allxin.count === countin, "all input link points X should be different, not #" + allxin.count);
            test.assert(allxout.count === countout, "all output link points X should be different, not #" + allxout.count);
          });
        },
        function(test) {
        }
      ));

      Groups.add(new Test("different spots collapsed, LDLayout, no routing", null,
        function(test) {
          CommonSetupGroupsCollapsed(test,
            go.GraphObject.make(go.LayeredDigraphLayout,
              { direction: 90, layerSpacing: 50, isRouting: false, setsPortSpots: false }));
        },
        function(test) {
          var diagram = test.diagram;
          diagram.selectCollection(diagram.findTopLevelGroups());
          diagram.commandHandler.collapseSubGraph();
          diagram.findTopLevelGroups().each(function(g) {
            var countout = 0;
            var allxout = new go.Set();
            var allyout = new go.Set();
            var countin = 0;
            var allxin = new go.Set();
            var allyin = new go.Set();
            g.findExternalLinksConnected().each(function(l) {
              if (l.fromNode === g || l.fromNode.isMemberOf(g)) {
                countout++;
                allxout.add(l.getPoint(0).x);
                allyout.add(l.getPoint(0).y);
              } else {
                countin++;
                allxin.add(l.getPoint(l.pointsCount-1).x);
                allyin.add(l.getPoint(l.pointsCount-1).y);
              }
            });
            test.assert(allyin.count <= 1, "all input link points Y should be the same, not #" + allyin.count);
            test.assert(allyout.count <= 1, "all output link points Y should be the same, not #" + allyin.count);
            test.assert(allxin.count === countin, "all input link points X should be different, not #" + allxin.count);
            test.assert(allxout.count === countout, "all output link points X should be different, not #" + allxout.count);
          });
        },
        function(test) {
        }
      ));

      Groups.add(new Test("different spots collapsed, TreeLayout", null,
        function(test) {
          CommonSetupGroupsCollapsed(test,
            go.GraphObject.make(go.TreeLayout,
              { angle: 90, setsPortSpot: false, setsChildPortSpot: false }));
        },
        function(test) {
          var diagram = test.diagram;
          diagram.selectCollection(diagram.findTopLevelGroups());
          diagram.commandHandler.collapseSubGraph();
          diagram.findTopLevelGroups().each(function(g) {
            var countout = 0;
            var allxout = new go.Set();
            var allyout = new go.Set();
            var countin = 0;
            var allxin = new go.Set();
            var allyin = new go.Set();
            g.findExternalLinksConnected().each(function(l) {
              if (l.fromNode === g || l.fromNode.isMemberOf(g)) {
                countout++;
                allxout.add(l.getPoint(0).x);
                allyout.add(l.getPoint(0).y);
              } else {
                countin++;
                allxin.add(l.getPoint(l.pointsCount-1).x);
                allyin.add(l.getPoint(l.pointsCount-1).y);
              }
            });
            test.assert(allyin.count <= 1, "all input link points Y should be the same, not #" + allyin.count);
            test.assert(allyout.count <= 1, "all output link points Y should be the same, not #" + allyin.count);
            test.assert(allxin.count === countin, "all input link points X should be different, not #" + allxin.count);
            test.assert(allxout.count === countout, "all output link points X should be different, not #" + allxout.count);
          });
        },
        function(test) {
        }
      ));

      Groups.add(new Test("different spots collapsed, TreeLayout, no routing", null,
        function(test) {
          CommonSetupGroupsCollapsed(test,
            go.GraphObject.make(go.TreeLayout,
              { angle: 90, isRouting: false, setsPortSpot: false, setsChildPortSpot: false }));
        },
        function(test) {
          var diagram = test.diagram;
          diagram.selectCollection(diagram.findTopLevelGroups());
          diagram.commandHandler.collapseSubGraph();
          diagram.findTopLevelGroups().each(function(g) {
            var countout = 0;
            var allxout = new go.Set();
            var allyout = new go.Set();
            var countin = 0;
            var allxin = new go.Set();
            var allyin = new go.Set();
            g.findExternalLinksConnected().each(function(l) {
              if (l.fromNode === g || l.fromNode.isMemberOf(g)) {
                countout++;
                allxout.add(l.getPoint(0).x);
                allyout.add(l.getPoint(0).y);
              } else {
                countin++;
                allxin.add(l.getPoint(l.pointsCount-1).x);
                allyin.add(l.getPoint(l.pointsCount-1).y);
              }
            });
            test.assert(allyin.count <= 1, "all input link points Y should be the same, not #" + allyin.count);
            test.assert(allyout.count <= 1, "all output link points Y should be the same, not #" + allyin.count);
            test.assert(allxin.count === countin, "all input link points X should be different, not #" + allxin.count);
            test.assert(allxout.count === countout, "all output link points X should be different, not #" + allxout.count);
          });
        },
        function(test) {
        }
      ));

  Groups.add(new Test("adding members to small group", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();

      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, { fill: "lightgray", stroke: "white" }),
          $(go.TextBlock, { margin: 50 },
            new go.Binding("text"))
        );

      diagram.linkTemplate =
        $(go.Link, go.Link.AvoidsNodes,
          { corner: 5, selectable: false },
          $(go.Shape, { strokeWidth: 4, stroke: "#00a4a4" }));  // the link shape

      diagram.groupTemplate =
        $(go.Group, "Auto",
          {
            layout: $(go.TreeLayout,
              { arrangement: go.TreeLayout.ArrangementVertical, layerSpacing: 100 }
            ),
            avoidable: false,
            selectable: false
          },
          $(go.Shape, "Rectangle",
            { fill: null, stroke: "gray", strokeWidth: 2 }),
          $(go.Panel, "Vertical",
            { defaultAlignment: go.Spot.Left, margin: 30 },
            $(go.Panel, "Horizontal",
              { defaultAlignment: go.Spot.Top },
              // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
              $("SubGraphExpanderButton"),
              $(go.TextBlock,
                { font: "Bold 18px Sans-Serif", margin: 4 }
              ),
              // create a placeholder to represent the area where the contents of the group are
              $(go.Placeholder,
                { padding: new go.Margin(10, 30) })
            )
          ));

      diagram.model = new go.GraphLinksModel(
        [
          { key: 8, group: 66, text: "8" },
          { key: 66, isGroup: true }
        ]);
    },
    function(test) {
      var diagram = test.diagram;
      //to append nodes and links
      var thisemp = diagram.model.nodeDataArray[0];
      diagram.startTransaction("add employees");
      var newNodeList =
        [
          { key: 2, group: 66, text: "2" },
          { key: 3, group: 66, text: "3" },
          { key: 7, group: 66, text: "7" },
          { key: 1, group: 66, text: "1" }
        ];
      var newLinkList =
        [
          { from: 2, to: 3 },
          { from: 3, to: 1 },
          { from: 7, to: 1 },
          { from: 7, to: 8 },
          { from: 8, to: 9 }
        ];
      diagram.model.addNodeDataCollection(newNodeList);
      diagram.model.addLinkDataCollection(newLinkList);
      diagram.commitTransaction("add employees");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.links.each(function(l) {
        for (var i = 1; i < l.pointsCount - 2; i++) {
          var p = l.points.elt(i);
          test.assert(diagram.findPartAt(p, true) === null,
            "should not have found any Node at any link point, found index " + i + " of " + l);
        }
      })
    }
  ));



  Groups.add(new Test("Group moved to NaN", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.layout.isOngoing = false;

      diagram.nodeTemplate =
      $(go.Node, "Auto",
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },
          new go.Binding("text", "key"))
      );

    diagram.groupTemplate =
      $(go.Group, "Vertical",
        { selectionObjectName: "PANEL",  // selection handle goes around shape, not label
          ungroupable: true },  // enable Ctrl-Shift-G to ungroup a selected Group
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.TextBlock, { font: "bold 19px sans-serif", isMultiline: false, editable: true },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color")),
        $(go.Panel, "Auto",
          { name: "PANEL" },
          $(go.Shape, "Rectangle",  // the rectangular shape around the members
            {
              fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3
            })
        )
      );

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [
        { loc: "NaN NaN", key: "Alpha", group: 'Gamma', color: "lightblue" },
        { loc: "NaN NaN", key: "Beta", group: 'Gamma', color: "orange" },
        { loc: "NaN NaN", key: "Gamma", isGroup: true }
      ],
      [
        { from: "Alpha", to: "Beta" }
      ]);
    },
    function(test) {

    },
    function(test) {
      var diagram = test.diagram;
      try {
        diagram.findNodeForKey('Gamma').move(new go.Point(3,NaN));
        diagram.redraw();
      } catch (ex) {
        test.assert(false, "failed to stop erros when moving a group to NaN")
      }

    }
  ));


  var Focus = new TestCollection("Focus");
  LinkRoutingGeometryRoot.add(Focus);

  Focus.add(new Test("center focus", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, "Triangle",
            {
              fill: "white", portId: ""
            },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", loc: "0 0" },
          { key: 2, text: "Beta", color: "orange", loc: "150 50" },
          { key: 3, text: "Gamma", color: "lightgreen", loc: "300 100" }
        ],
        [
          { from: 1, to: 2 },
          { from: 2, to: 3 }
        ]);
    },
    function(test) {
      test.assertAllLinkPoints([
        [new go.Point(81.0, 60.7), new go.Point(178.6, 93.2)],
        [new go.Point(231.0, 110.7), new go.Point(328.6, 143.2)]
      ]);
    }
  ));

  Focus.add(new Test("non-center focus", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("location", "loc", go.Point.parse),
          $(go.Shape, "YinYang",
            {
              fill: "white", portId: "",
              fromSpot: new go.Spot(0.5, 0.5, 0, 25), toSpot: new go.Spot(0.5, 0.5, 0, -25)
            },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text"))
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 1, text: "Alpha", color: "lightblue", loc: "0 0" },
          { key: 2, text: "Beta", color: "orange", loc: "150 0" },
          { key: 3, text: "Gamma", color: "lightgreen", loc: "300 0" }
        ],
        [
          { from: 1, to: 2 },
          { from: 2, to: 3 }
        ]);
    },
    function(test) {
      test.assertAllLinkPoints([
        [new go.Point(100.1, 59.0), new go.Point(150.9, 42.0)],
        [new go.Point(250.1, 59.0), new go.Point(300.9, 42.0)]
      ]);
    }
  ));

  // 3 duplicate side links should not cross
  SidesRoot.add(new Test("Duplicate side links", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      var nodeTemplate = $(go.Node, "Auto",
        new go.Binding("location", "loc"), $(go.Shape, "Rectangle",
          {
            fill: "lightblue"
            , strokeWidth: 2
            , desiredSize: new go.Size(100, 100)
            , portId: ""
            , fromLinkable: true, fromLinkableDuplicates: true
            , toLinkable: true, toLinkableDuplicates: true
            , fromSpot: go.Spot.AllSides
            , toSpot: go.Spot.AllSides
          }));  // end Node
      var linkTemplate = $(go.Link , $(go.Shape, { strokeWidth: 2 } )
      , $(go.Shape, { toArrow: "Triangle", stroke: null, scale: 1.5 } )
      );
      var nodeDataArray = [
        { key: "1", loc: new go.Point(0, 0) },
        { key: "2", loc: new go.Point(300, 0) },
      ];
      var linkDataArray = [
        {from: '1', to: '2'},
        {from: '1', to: '2'}
      ];

      diagram.nodeTemplate = nodeTemplate;
      diagram.linkTemplate = linkTemplate;
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    },
    function(test) {
      var diagram = test.diagram;
      diagram.commit(function() {
        var one = diagram.findNodeForKey('1');
        var two = diagram.findNodeForKey('2');
        diagram.partManager.insertLink(one, one.elt(0), two, two.elt(0));
      });
      var correctLinks = [
        'Rect(101,68.82,200,15.36)',
        'Rect(101,43.32,200,15.36)',
        'Rect(101,17.82,200,15.36)'
      ]
      var i = 0;
      diagram.links.each(function(l) {
        test.assert(l.actualBounds.toString() === correctLinks[i]);
        i++;
      })
    }
  ));


var Disconnected = new TestCollection("Disconnected");
LinkRoutingGeometryRoot.add(Disconnected);

Disconnected.add(new Test("link locationSpot", null,
  function(test) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.reset();
    diagram.layout = $(go.GridLayout, { wrappingColumn: 1 });
    diagram.nodeTemplate =
    $(go.Node, "Spot",
      { locationSpot: go.Spot.Center },
      $(go.Shape,
        { fill: "white" }),
      $(go.TextBlock,
        { margin: 6 },
        new go.Binding("text"))
    );

  diagram.linkTemplate =
    $(go.Link,
      {
        // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
        // to line up the Link in the same manner we have to pretend the Link has the same location spot
        selectionAdornmentTemplate:
          $(go.Adornment, "Link", //{locationSpot: go.Spot.Center } ,
            $(go.Shape,
              { isPanelMain: true, stroke: "rgba(255,0,0,.3)", strokeWidth: 8 })
          )
      },
      new go.Binding("locationSpot"),
      new go.Binding("points"),
      $(go.Shape, { strokeWidth: 1 }),
      $(go.Shape, { toArrow: "Standard" })
    );

  diagram.model = new go.GraphLinksModel(
  [
  ],
  [
    { points: [new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)] },
    { locationSpot: go.Spot.Center, points: [new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)] },
    { locationSpot: go.Spot.Right, points: [new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)] }
  ]);

  diagram.commandHandler.selectAll();
  },
  function(test) {
    var diagram = test.diagram;
    var l = diagram.findLinkForData(diagram.model.linkDataArray[0]);
    var ad = l.adornments.first();
    var l2 = diagram.findLinkForData(diagram.model.linkDataArray[1]);
    var ad2 = l2.adornments.first();
    var l3 = diagram.findLinkForData(diagram.model.linkDataArray[2]);
    var ad3 = l3.adornments.first();

    test.assert(l.position.toString() === 'Point(0,0)', 'wrong position for link 1');
    test.assert(l.location.toString() === 'Point(0,0)', 'wrong location for link 1');
    test.assert(l.routeBounds.toString() === 'Rect(0.5,0.5,60,40)', 'wrong routeBounds for link 1');
    test.assert(l.getPoint(0).toString() === 'Point(0.5,0.5)');
    test.assert(l.getPoint(1).toString() === 'Point(30.5,0.5)');
    test.assert(l.getPoint(2).toString() === 'Point(30.5,40.5)');
    test.assert(l.getPoint(3).toString() === 'Point(60.5,40.5)');
    test.assert(ad.position.toString() === 'Point(-3.5,-3.5)', 'wrong position for adornment 1');
    test.assert(ad.location.toString() === 'Point(-3.5,-3.5)', 'wrong location for adornment 1');

    test.assert(l2.position.toString() === 'Point(-30.5,55)', 'wrong position for link 2');
    test.assert(l2.location.toString() === 'Point(0,77.5)', 'wrong location for link 2');
    test.assert(l2.routeBounds.toString() === 'Rect(-30,55.5,60,40)', 'wrong routeBounds for link 2');
    test.assert(l2.getPoint(0).toString() === 'Point(-30,55.5)');
    test.assert(l2.getPoint(1).toString() === 'Point(0,55.5)');
    test.assert(l2.getPoint(2).toString() === 'Point(0,95.5)');
    test.assert(l2.getPoint(3).toString() === 'Point(30,95.5)');
    test.assert(ad2.position.toString() === 'Point(-34,51.5)', 'wrong position for adornment 2');
    test.assert(ad2.location.toString() === 'Point(-34,51.5)', 'wrong location for adornment 2');

    test.assert(l3.position.toString() === 'Point(-61,110)', 'wrong position for link 3');
    test.assert(l3.location.toString() === 'Point(0,132.5)', 'wrong location for link 3');
    test.assert(l3.routeBounds.toString() === 'Rect(-60.5,110.5,60,40)', 'wrong routeBounds for link 3');
    test.assert(l3.getPoint(0).toString() === 'Point(-60.5,110.5)');
    test.assert(l3.getPoint(1).toString() === 'Point(-30.5,110.5)');
    test.assert(l3.getPoint(2).toString() === 'Point(-30.5,150.5)');
    test.assert(l3.getPoint(3).toString() === 'Point(-0.5,150.5)');
    test.assert(ad3.position.toString() === 'Point(-64.5,106.5)', 'wrong position for adornment 3');
    test.assert(ad3.location.toString() === 'Point(-64.5,106.5)', 'wrong location for adornment 3');
  }
));

// Ensure links retain the jumpover in their actual bounds before and after
// 1. setting the points manually (to the same points)
// 2. removing and adding the link back to diagram
Disconnected.add(new Test("JumpOver", null,
  function(test) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.reset();
    diagram.linkTemplate = $(go.Link,
      {
        background: 'lime',
        // selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
        reshapable: true,
        relinkableFrom: true, relinkableTo: true, reshapable: true,
        curve: go.Link.JumpOver,
        routing: go.Link.AvoidsNodes
      },
      new go.Binding('points').makeTwoWay(),
        $(go.Shape,
          {
            name: 'LINK_SHAPE',
            stroke: 'black',
            strokeWidth: 2,
            isPanelMain: true,
            background: 'red'
          })
      )


    diagram.model = new go.GraphLinksModel([], [])

  },
  function(test) {
    let points1 = [{ x: 200, y: 380 }, { x: 700, y: 380 }]
    let points2 =[ { x: 360, y: 160 }, { x: 360, y: 170 }, { x: 360, y: 476 }, { x: 377, y: 476 }, { x: 377, y: 783 }, { x: 377, y: 793 }]
    var diagram = test.diagram;
    diagram.startTransaction();
    diagram.model.addLinkData({ points: points1 })
    var l2 = { points: points2 };
    diagram.model.addLinkData(l2);
    diagram.commitTransaction();

    var link = diagram.findLinkForData(l2);
    var AB = link.actualBounds;
    diagram.startTransaction();
    link.points = points2;
    diagram.commitTransaction();
    test.assert(link.actualBounds.equals(AB));
    diagram.commit(() => {
      diagram.model.removeLinkData(l2);
    });
    diagram.commit(() => {
      diagram.model.addLinkData(l2);
    })
    test.assert(link.actualBounds.equals(AB));
  }
));









})(); // end test root

/*

Disconnected.add(new Test("NAME", null,
  function(test) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.reset();

  },
  function(test) {
    var diagram = test.diagram;

  }
));

*/