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
  var SVGTests = new TestCollection('SVG');
  TestRoot.add(SVGTests);

  SVGTests.add(new Test('makeSVG arc', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      var geo = new go.Geometry();
      var radius = 30;
      var deg = 55;

      fig = new go.PathFigure(radius, 0, false);
      fig.add(new go.PathSegment(go.PathSegment.Arc, 0, deg, 0, 0, radius, radius));
      geo.add(fig);

      fig = new go.PathFigure(radius, 0, false);
      fig.add(new go.PathSegment(go.PathSegment.Arc, 0, -deg, 0, 0, radius, radius));
      geo.add(fig);

      geo.normalize();

      var geo2 = new go.Geometry();
      fig = new go.PathFigure(radius, 0, false);
      fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, 0, 0, radius, radius));
      geo2.add(fig);

      // define a simple Node template
      diagram.add(
        $(go.Node,
          { },
          $(go.Shape,
            {
              geometry: geo,
              fill: "gray"
            }))
          );
      diagram.add(
      $(go.Node,
        { },
        $(go.Shape,
          {
            geometry: geo2,
            stroke: "red"
          }))
        );

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var shapeList = [];
      var svg = diagram.makeSvg({
          //scale:1

          elementFinished: function(graphObject, SVGElement) {
            // set something on every SVG element that represents a GoJS TextBlock
            if (graphObject instanceof go.Shape) shapeList.push(SVGElement);
          }

        });
        /* for debugging test, maybe add to DOM.
      svg.style.border = "1px solid black";
      obj = document.getElementById("SVGArea");
      obj.appendChild(svg);
      if (obj.childNodes.length > 0) {
        obj.replaceChild(svg, obj.childNodes[0]);
      }
      */
      // Make sure there's one arc that's well formed:
      var path = shapeList[0].childNodes[1].getAttribute('d');
      test.assert(path.indexOf("A 30,30 0 0,0 0,0") > -1 || path.indexOf("A 30 30 0 0 0 0 0") > -1);
      // Two arcs (whole circle) well formed:
      path = shapeList[1].getAttribute('d');
      test.assert(path.indexOf("M 30,0 A 30,30 0 1,1 -30,0 A 30,30 0 1,1 30,0") > -1 || path.indexOf("A 30 30 0 1 1 -30 0 A 30 30 0 1 1 30 0") > -1);
    }




  )); // end test

  // Arcs with no lines before them were drawn incorrectly. The total SVG path should be much longer, so easy to test that
  SVGTests.add(new Test('makeSVG arc 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, "Vertical",
        $(go.Shape,
          { geometryString: "F M50 50 B0 120 50 50 50z", fill: "lightgreen", isGeometryPositioned: true }
        )
      ),
      diagram.model = new go.GraphLinksModel([   { }  ], [  ])
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      // 102.xx in failing version, 204.xx in correct version
      test.assert(diagram.makeSVG( { parts: diagram.nodes }).childNodes[0].childNodes[0].childNodes[0].childNodes[0].getTotalLength() > 200);
    }


  )); // end test


  SVGTests.add(new Test('Opacity setting', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Vertical",
        { height: 100 },
        new go.Binding("background"),
        $(go.Shape, "RoundedRectangle", { height: 50, strokeWidth: 15 },
          new go.Binding("fill"),
          new go.Binding("stroke")
          )
      );


    diagram.model = new go.GraphLinksModel(
    [
      { key: "1", fill: "red", stroke: "lime", background: "blue" },
      { key: "2", fill: "rgba(255, 0, 0, .4)", stroke: "rgba(0, 255, 0, .4)", background: "rgba(0, 0, 255, .4)" },
      { key: "3", fill: "rgba(255, 0, 0, .3)", stroke: "rgba(0, 255, 0, .3)", background: "rgba(0, 0, 255, .3)" },
    ], [ ]);
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var i = 0;
    diagram.makeSVG({ scale: 1, elementFinished: function(a, b) {
      // shape node, shape node, shape node
      // test.assert(a.toString());
      // test.assert(b);
      if (i === 0) { // shape 1
        test.assert(b.getAttribute("stroke").replace(/\s/g, '') === "lime");
        test.assert(b.getAttribute("stroke-opacity") === null);
        test.assert(b.getAttribute("fill").replace(/\s/g, '') === "red");
        test.assert(b.getAttribute("fill-opacity") === null);
      }else if (i === 2) { // shape 2
        test.assert(b.getAttribute("stroke").replace(/\s/g, '') === "rgb(0,255,0)");
        test.assert(b.getAttribute("stroke-opacity") === ".4" || b.getAttribute("stroke-opacity") === "0.4");
        test.assert(b.getAttribute("fill").replace(/\s/g, '') === "rgb(255,0,0)");
        test.assert(b.getAttribute("fill-opacity") === ".4" || b.previousElementSibling.getAttribute("fill-opacity") === "0.4");
      } else if (i === 4) { // shape 3
        // test.assert(b.getAttribute("stroke").replace(/\s/g, '') === "rgb(0,255,0)");
        // test.assert(b.getAttribute("stroke-opacity").replace(/\s/g, '') === ".3" || b.getAttribute("stroke-opacity").replace(/\s/g, '') === "0.3");
        // test.assert(b.getAttribute("fill").replace(/\s/g, '') === "rgb(255,0,0)");
        // test.assert(b.getAttribute("fill-opacity").replace(/\s/g, '') === ".3" || b.previousElementSibling.getAttribute("fill-opacity").replace(/\s/g, '') === "0.3");
      } else if (i === 3) { // node 2 (background)
        // first child =  background
        //test.assert(b.firstChild.getAttribute("fill").replace(/\s/g, '') === "rgb(0,0,255)"); // ???
        test.assert(b.firstChild.getAttribute("fill-opacity") === ".4" || b.firstChild.getAttribute("fill-opacity") === "0.4");
      } else if (i === 5) { // node 3 (area background)
        // previousElementSibling = area background
        //test.assert(b.firstChild.getAttribute("fill").replace(/\s/g, '') === "rgb(0,0,255)"); // ???
        test.assert(b.firstChild.getAttribute("fill-opacity").replace(/\s/g, '') === ".3" || b.previousElementSibling.getAttribute("fill-opacity").replace(/\s/g, '') === "0.3");
      }
      i++;
    }})
  }
)); // end test

SVGTests.add(new Test('Opacity text gradient', null,
function (test) {
  var diagram = test.diagram;
  var d = diagram;
  diagram.reset();
  diagram.nodeTemplate =
  $(go.Node, "Vertical",
    new go.Binding("background"),
    $(go.TextBlock, "Test", {
      font: '62px Georgia', width: 100, height: 60,
      stroke: $(go.Brush, "Linear", { 0: "rgb(255, 255, 255)", 0.5: "rgb(255, 255, 255)", 1: "rgba(0, 0, 0, 0)" })
    }),
    $(go.Shape, "RoundedRectangle", { height: 50, strokeWidth: 15 },
      new go.Binding("fill"),
      new go.Binding("stroke")
      )
  );


diagram.model = new go.GraphLinksModel(
[
  { key: "1", fill: "red", stroke: "lime", background: "blue" },
], [ ]);
}, // END SETUP
null,
function (test) {
  var diagram = test.diagram;
  var i = 0;
  var gradID;

  var node = diagram.makeSVG({ scale: 1, elementFinished: function(a, b) {
    if (a instanceof go.TextBlock) {
      var grad = b.firstChild.getAttribute("fill");
      test.assert(grad.indexOf("url(#GRAD") === 0);
      gradID = grad.slice(5,-1);
    }
    i++;
  }});
  document.body.appendChild(node);
  test.assert(document.getElementById(gradID));
  var g = document.getElementById(gradID);
  test.assert(g.childElementCount === 3); // 3 stops
  test.assert(g.childNodes[0].getAttribute("stop-color").replace(/\s/g, '') === "rgb(255,255,255)");
  test.assert(g.childNodes[1].getAttribute("stop-color").replace(/\s/g, '') === "rgb(255,255,255)");
  test.assert(g.childNodes[2].getAttribute("stop-color").replace(/\s/g, '') === "rgb(0,0,0)");
  test.assert(g.childNodes[2].getAttribute("stop-opacity") === "0");
  document.body.removeChild(node);
}
)); // end test

  // Fixed in 2.1.44
  // Fixed a regression from 2.1.28 with some <a>Shape.geometryString</a> paths.
  // If a path contained an arc command that was closed, a relative move command afterwards would be at
  // the wrong coordinates.
  SVGTests.add(new Test('geo parse svg arc with z', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var geo = "F M 0,0 A 3,3 0 0 0 7,7 z m 0,0 l 5 5 5 -5 ";
    var geo2 = " F M 10.383813,2.3872578 A 5.6128716,5.6128716 0 0 0 4.8110328,7.358658 H 0.64147104 a 0.64147105,0.64147105 0 0 0 0,1.2829421 H 4.8110328 A 5.6128716,5.6128716 0 1 0 10.383813,2.3872578 Z m 0,9.9428012 a 4.3299295,4.3299295 0 1 1 4.329929,-4.32993 4.3299295,4.3299295 0 0 1 -4.329929,4.32993 Z ";
    diagram.nodeTemplate =
    $(go.Node,
      $(go.Shape, { fill: "black", stroke: 'red' },
      new go.Binding('geometryString')));
    diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: [
        { key: 1, geometryString : geo },
        { key: 2, geometryString : geo2 }
      ]
    })
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    test.assert(diagram.findNodeForKey(1).actualBounds.equalsApprox(new go.Rect(0,0,12.449747468305834,9.449747434246039)));
    test.assert(diagram.findNodeForKey(2).actualBounds.equalsApprox(new go.Rect(70,0,16.963223917972147,14.576223979843228)));
    // bad, larger geometries as example of bad values:
    // Rect(0,0,19.449747468305834,13)
    // Rect(70,0,16.963223917972147,18.3014592)
  }
  )); // end test

  // SVG arcs with zero radius in X or Y must become lines
  SVGTests.add(new Test('arc with zero radius', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node,
        { resizable: true, resizeObjectName: "GEOM" },
        $(go.Shape,
          { name: "GEOM", fill: "lightgray",
          },
          new go.Binding("geometryString", "geo"),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
        )
      );

    diagram.model = new go.GraphLinksModel([
      // good:
     { key: 1, geo: "F M0 0 A 0.001 0.001 0 1 1 00 150" },
     { key: 2, geo: "F M0 0 A 10 10 0 1 1 00 150" },
     // degenerate, vertical lines instead of arcs
     { key: 3, geo: "F M0 0 A 10 0 0 1 1 00 150" },
     { key: 4, geo: "F M0 0 A 0 10 0 1 1 00 150" },
     { key: 5, geo: "F M0 0 A 0 0 0 1 1 00 150" }
    ]);
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    test.assert(diagram.findNodeForKey(1).elt(0).actualBounds.equalsApprox(new go.Rect(0,0,76,151)));
    test.assert(diagram.findNodeForKey(1).elt(0).geometry.bounds.equalsApprox(new go.Rect(0,0,75,150)));
    test.assert(diagram.findNodeForKey(2).elt(0).actualBounds.equalsApprox(new go.Rect(0,0,76,151)));
    test.assert(diagram.findNodeForKey(2).elt(0).geometry.bounds.equalsApprox(new go.Rect(0,0,75,150)));
    // 1 (shape) or 0 (geo) width degenerate arcs
    test.assert(diagram.findNodeForKey(3).elt(0).actualBounds.equalsApprox(new go.Rect(0,0,1,151)));
    test.assert(diagram.findNodeForKey(3).elt(0).geometry.bounds.equalsApprox(new go.Rect(0,0,0,150)));
    test.assert(diagram.findNodeForKey(4).elt(0).actualBounds.equalsApprox(new go.Rect(0,0,1,151)));
    test.assert(diagram.findNodeForKey(4).elt(0).geometry.bounds.equalsApprox(new go.Rect(0,0,0,150)));
    test.assert(diagram.findNodeForKey(5).elt(0).actualBounds.equalsApprox(new go.Rect(0,0,1,151)));
    test.assert(diagram.findNodeForKey(5).elt(0).geometry.bounds.equalsApprox(new go.Rect(0,0,0,150)));
  }
  )); // end test

  SVGTests.add(new Test('SVG clipping', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();

    var photo = function(size) {
        return $(
          go.Node,
          go.Panel.Spot,
          {
              isClipping: true,
          },
          $(go.Shape, 'Circle', {
              desiredSize: new go.Size(size - 1, size - 1),
          }),
          //$( go.Shape, {fill: 'red', desiredSize: new go.Size(size - 1, size - 1), } )
          $( go.Picture, { background: 'red', desiredSize: new go.Size(size - 1, size - 1), } )
      );
    };

    diagram.nodeTemplate =  photo(100)

    diagram.model = new go.Model([
        { key: 1 },
    ]);


  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var svg = diagram.makeSvg({
    });
    //document.body.appendChild(svg);
    // Test the order of groups and that a clip path exists
    var g1 = svg.firstChild;
    test.assert(g1.nodeName === "g");
    var g2 = g1.firstChild;
    test.assert(g2.nodeName === "g");
    var g3 = g2.firstChild;
    test.assert(g3.nodeName === "g");
    var rect = g3.firstChild.firstChild;
    test.assert(rect.nodeName === "rect");
    test.assert(rect.getAttribute("fill") === "red");
    // test for clip
    var clipPath = g3.getAttribute('clip-path');
    // var clipURL = g3.getAttribute('clip-path').match(/#.*\)/)[0].slice(1, -1);
    // var clipObj = svg.getElementById(clipURL); // fails in safari?
    // clipObj = svg.lastChild; // so do this instead. But if we ever re-order SVG elements in the output, this line may fail.
    // console.log(clipObj.firstChild.nodeName === "path");
  }
  )); // end test

  SVGTests.add(new Test('clipping + group order', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var getNode = function (params) {
      return $( "Node", "Horizontal",
        {
          background: 'lightblue'
        },
          $( "Shape", "Rectangle",
            {
              fill: null,
              name: "HIGHLIGHT",
              desiredSize: new go.Size(150, 150),
            }
          ),
          $( "Panel", "Vertical", { background: 'green', alignment: go.Spot.Center, },
            getNodeBase(params),
              $(go.Shape, {
                fill:'lime'
              })
          )
      );
    };

    var getNodeBase = function (params) {
      return $( "Panel", "Spot",
          { isClipping: true, },
          $( "Shape", "Rectangle", { fill: 'red', width: 10, height: 10 } ),
          $( "Shape", "Rectangle", { fill: 'red', width: 10, height: 10 } )
      );
    };

    diagram.nodeTemplate = getNode();
    diagram.model = new go.GraphLinksModel( [ { key: "Alpha" } ], [ ] );
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
      var i = 0;
      var svg = diagram.makeSVG(
          {
            elementFinished: function(graphObject, SVGElement) {
             SVGElement.setAttribute("name", i++);
          }
        });
      var arr = [];
      traverseNodes(arr, svg);
      test.assert(arr.length === 13);
      // Test order of groups
      // It is possible this test changes in the future (LOL)
      // If new <g> are added or redundant ones are removed.
      var reference = ['g', 'g', 'g', 'rect', 'path', 'g', 'rect', 'g', 'path',
      'path', 'g', 'clipPath', 'rect'];
      var refName = [6, 0, 5, 3, 1, 2, 4]; // order that the groups appear
      var refIndex = 0;
      for (var i = 0; i < arr.length; i++) {
        test.assert(arr[i].nodeName === reference[i]);
        // var name = arr[i].getAttribute("name");
        // if (name !== null) {
        //   test.assert(name === refName[refIndex++].toString());
        // }
      }
    function traverseNodes(arr, svg) {
      for (var i = 0; i < svg.childNodes.length; i++) {
        arr.push(svg.childNodes[i]);
        traverseNodes(arr, svg.childNodes[i]);
      }
    }
  }
  )); // end test


  SVGTests.add(new Test('table spacer', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var propertyTemplate =
    $(go.Panel, "Horizontal",
      $(go.TextBlock,
        { isMultiline: false, editable: true },
        new go.Binding("text", "name").makeTwoWay(),
        new go.Binding("isUnderline", "scope", s => s[0] === 'c')),
    );
  diagram.nodeTemplate =
      $(go.Node, "Table",
        { defaultRowSeparatorStroke: "black" },
        $(go.TextBlock,
          {
            row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
            font: "bold 12pt sans-serif",
            isMultiline: false, editable: true
          },
          new go.Binding("text", "name").makeTwoWay()),
        $(go.TextBlock, "Properties",
          { row: 1, font: "italic 10pt sans-serif" })

      )


  // setup a few example class nodes and relationships
  var nodedata = [
    {
      key: 1,
      name: "BankAccount"
    }
  ];
  var linkdata = [
  ];
  diagram.model = new go.GraphLinksModel(
    {
      copiesArrays: true,
      copiesArrayObjects: true,
      nodeDataArray: nodedata,
      linkDataArray: linkdata
    });
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var i = 0;
    var svg = diagram.makeSVG(
        {
          elementFinished: function(graphObject, SVGElement) {
           SVGElement.setAttribute("name", i++);
        }
      });
    var arr = [];
    traverseNodes(arr, svg);
    // Test existence of path at the beginning of final nested group (2nd to last group)
    var reference = ['g', 'g', 'g', 'g', 'path', 'text', '#text', 'text', '#text', 'g', 'clipPath', 'rect'];
    let a = '[';
    for (var i = 0; i < arr.length; i++) {
      test.assert(arr[i].nodeName === reference[i]);
    }
  function traverseNodes(arr, svg) {
    for (var i = 0; i < svg.childNodes.length; i++) {
      arr.push(svg.childNodes[i]);
      traverseNodes(arr, svg.childNodes[i]);
    }
  }
  }
  )); // end test


  SVGTests.add(new Test('makeSVG w/ SVG context', null,
  function (test) {
    // var diagram = test.diagram;
    var diagram = setup('svg1', 300, 300, {});
    diagram.reset();
    diagram.renderer = 'svg';
    diagram.model = new go.GraphLinksModel([ { }, { }  ], [  ])
  }, // END SETUP
  null,
  function (test) {
    var diagram = window['svg1'];
    diagram.makeSVG();
    teardown('svg1');
    test.unblock(); // Required!
  }
  )); // end test





})(); // End test system


/*
SVGTests.add(new Test('', null,
function (test) {
  var diagram = test.diagram;
  var d = diagram;
  diagram.reset();

}, // END SETUP
null,
function (test) {
  var diagram = test.diagram;

}
)); // end test
*/