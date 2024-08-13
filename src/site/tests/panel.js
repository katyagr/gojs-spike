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

  var paneltests = new TestCollection('Panels');
  TestRoot.add(paneltests);

  paneltests.add(new Test('Spot Panel offsetX/Y', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
      $(go.Node, "Spot",
        {
          background: 'rgba(255,255,0, .1)'
        },
        $(go.Shape, "Rectangle", { strokeWidth: 0, width: 60, height: 60, fill: 'rgba(255,0,0, .3)' }), // red

        $(go.Shape, "Rectangle", { strokeWidth: 0, width: 40, height: 40, fill: 'rgba(0,255,0, .3)', // green
          alignment: new go.Spot(0, 0, 0, 0),
          alignmentFocus: new go.Spot(1, 1, 0, 10)
        }),
        $(go.Shape, "Rectangle", { strokeWidth: 0, width: 20, height: 20, fill: 'rgba(0,0,255, .3)' , // blue
          alignment: new go.Spot(1, 0.5, 0, 0),
          alignmentFocus: new go.Spot(0, 0.5, 0, -10)
        }),
        $(go.Shape, "Rectangle", { strokeWidth: 0, width: 20, height: 20, fill: 'rgba(255,0,255, .3)' , // pink
          alignment: new go.Spot(1, 1, 0, 0),
          alignmentFocus: new go.Spot(0, 0.5, 10, 0)
        })
      );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha" }
      ], [ ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;

      var arr = [];
      diagram.nodes.each(function(n) {
        walktree(n, arr);
      });
      // console.log(arr);

      function walktree(panel, arr) {
        arr.push(panel.actualBounds.toString());
        if (panel instanceof go.Panel) {
          panel.elements.each(function(e) { walktree(e, arr) });
        }
      }

      var expected =   [
        "Rect(0,0,120,120)",
        "Rect(40,50,60,60)",
        "Rect(0,0,40,40)",
        "Rect(100,80,20,20)",
        "Rect(90,100,20,20)"
      ];

      for (var i = 0; i < arr.length; i++) {
        test.assert(arr[i] === expected[i]);
      }
    }
  )); // end test

  paneltests.add(new Test('Spot Panel stretch 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
      $(go.Node, "Spot",
        {
          resizable: true,
          resizeObjectName: 'mainshape'
        },
        $(go.Shape, "Rectangle", { name: 'mainshape', strokeWidth: 0,width: 60, height: 60, fill: 'rgba(255,0,0, .3)' },  // red
          new go.Binding('width'),
          new go.Binding('height')
        ),

        $(go.Shape, "Rectangle", { stretch: go.GraphObject.Vertical, strokeWidth: 0, width: 20, fill: 'rgba(0,255,0, .3)', // green
          alignment: go.Spot.Left,
          alignmentFocus: go.Spot.Right
        }),
        $(go.Shape, "Rectangle", { stretch: go.GraphObject.Vertical, strokeWidth: 0, width: 20, fill: 'rgba(0,0,255, .3)' , // blue
          alignment: go.Spot.Right,
          alignmentFocus: go.Spot.Left
        }),
        $(go.Shape, "Rectangle", { stretch: go.GraphObject.Horizontal, strokeWidth: 0, height: 20, fill: 'rgba(255,0,255, .3)' , // pink
          alignment: go.Spot.Bottom,
          alignmentFocus: go.Spot.Top
        })
      );


      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha" },
        { key: "Beta", width: 100, height: 30 }
      ], [ ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var arr = [];
      diagram.nodes.each(function(n) {
        walktree(n, arr);
      });
      // console.log(arr);

      function walktree(panel, arr) {
        arr.push(panel.actualBounds.toString());
        if (panel instanceof go.Panel) {
          panel.elements.each(function(e) { walktree(e, arr) });
        }
      }

      var expected =   [
      "Rect(0,0,100,80)",
      "Rect(20,0,60,60)",
      "Rect(0,0,20,60)",
      "Rect(80,0,20,60)",
      "Rect(20,60,60,20)",
      "Rect(120,0,140,50)",
      "Rect(20,0,100,30)",
      "Rect(0,0,20,30)",
      "Rect(120,0,20,30)", "Rect(20,30,100,20)"
      ];

      for (var i = 0; i < arr.length; i++) {
        test.assert(arr[i] === expected[i]);
      }
    }
  )); // end test

  function parseType(s) {
    if (s === "H") return go.Panel.Horizontal;
    return go.Panel.Vertical;
  }

  function stringifyType(t) {
    if (t === go.Panel.Horizontal) return "H";
    return "V";
  }

  paneltests.add(new Test("binding Panel.type", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Vertical",
          new go.Binding("type", "type", parseType).makeTwoWay(stringifyType),
          $(go.Shape, { fill: "white" },
            new go.Binding("height"),
            new go.Binding("width"),
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            new go.Binding("text").makeTwoWay()),
          $("Button",
            {
              name: "BUTTON",
              "ButtonBorder.figure": "Circle",
              width: 12, height: 12, alignment: go.Spot.TopRight,
              click: function(e, but) {
                e.diagram.commit(function(d) {
                  but.part.type = (but.part.type === go.Panel.Horizontal) ? go.Panel.Vertical : go.Panel.Horizontal;
                }, "toggle panel type");
              }
            })
        );

      diagram.groupTemplate =
        $(go.Group, "Auto",
          { layout: $(go.LayeredDigraphLayout, { columnSpacing: 10 }) },
          $(go.Shape, { fill: null }),
          $(go.Panel, "Vertical",
            $(go.Panel, "Table",
              { background: "darkblue", stretch: go.GraphObject.Horizontal, height: 20 },
              $(go.TextBlock,
                { font: "bold 10pt sans-serif", stroke: "white" },
                new go.Binding("text"))
            ),
            $(go.Placeholder, { padding: 5 })
          )
        );

      diagram.model = new go.GraphLinksModel(
        [
          { key: 0, text: "G1", isGroup: true },
          { key: 1, text: "Alpha", color: "lightblue", group: 5, width: 80, height: 30, type: "H" },
          { key: 2, text: "Beta", color: "orange", group: 5, width: 100, height: 100 },
          { key: 3, text: "Gamma", color: "lightgreen", group: 0, width: 80, height: 30 },
          { key: 4, text: "Delta", color: "pink", group: 5, width: 80, height: 30, type: "H" },
          { key: 5, text: "G2", isGroup: true, group: 0 }
        ],
        [
          //{ from: 1, to: 2 },
          //{ from: 3, to: 4 },
          //{ from: 4, to: 2 }
          { from: 2, to: 1 },
          { from: 4, to: 3 },
          { from: 2, to: 4 }
        ]);

    },
    function(test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey(1);
      var beta = diagram.findNodeForKey(2);
      var gamma = diagram.findNodeForKey(3);
      var delta = diagram.findNodeForKey(4);
      test.assert(alpha && alpha.actualBounds.width > 111, "alpha width is: " + alpha.actualBounds.width);
      test.assert(beta && test.isApprox(beta.actualBounds.width, 101), "beta width is: " + beta.actualBounds.width);
      test.assert(gamma && test.isApprox(gamma.actualBounds.width, 81), "gamma width is: " + gamma.actualBounds.width);
      test.assert(delta && delta.actualBounds.width > 111, "delta width is: " + delta.actualBounds.width);

      test.diagram.model.commit(function(m) {
        m.nodeDataArray.forEach(function(d) {
          m.set(d, "type", (d.type === "H") ? "V" : "H");
        })
      }, "switch all panel types");

      test.assert(alpha && test.isApprox(alpha.actualBounds.width, 81), "alpha width is: " + alpha.actualBounds.width);
      test.assert(beta && beta.actualBounds.width > 111, "beta width is: " + beta.actualBounds.width);
      test.assert(gamma && gamma.actualBounds.width > 111, "gamma width is: " + gamma.actualBounds.width);
      test.assert(delta && test.isApprox(delta.actualBounds.width, 81), "delta width is: " + delta.actualBounds.width);
    },
    function(test) {
      var diagram = test.diagram;
      var alpha = diagram.findNodeForKey(1);
      var beta = diagram.findNodeForKey(2);
      var gamma = diagram.findNodeForKey(3);
      var delta = diagram.findNodeForKey(4);

      var but = beta.findObject("BUTTON");
      test.mouseDown(but.getDocumentPoint(go.Spot.Center));
      test.mouseUp(but.getDocumentPoint(go.Spot.Center));

      but = gamma.findObject("BUTTON");
      test.mouseDown(but.getDocumentPoint(go.Spot.Center));
      test.mouseUp(but.getDocumentPoint(go.Spot.Center));

      test.assert(alpha && test.isApprox(alpha.actualBounds.width, 81), "alpha width is: " + alpha.actualBounds.width);
      test.assert(beta && test.isApprox(beta.actualBounds.width, 101), "beta width is: " + beta.actualBounds.width);
      test.assert(gamma && test.isApprox(gamma.actualBounds.width, 81), "gamma width is: " + gamma.actualBounds.width);
      test.assert(delta && test.isApprox(delta.actualBounds.width, 81), "delta width is: " + delta.actualBounds.width);
    }
  ));

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

  // new for 2.2 feature
  // This tests alignment with the Spot Panel's main element being set to another Shape (or not)
  // This does not test more complex cases, such as margins (2 below), nesting, scale, angle
  paneltests.add(new Test('Spot Panel main alignObj 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
      $(go.Node, "Spot",
        $(go.Panel, "Horizontal",
          { alignmentFocusName: "BODY" },
          new go.Binding("alignmentFocusName"),
          $(go.Shape, "RoundedRectangle", { name: 'left', width: 40, height: 40, fill: 'lime', alignment: go.Spot.Right, alignmentFocus: go.Spot.Left }),
          $(go.Shape, {  name: 'body', fill: "lightblue" }),
          $(go.Shape, "RoundedRectangle", { name: 'right', width: 40, height: 40, fill: 'lime', alignment: go.Spot.Right, alignmentFocus: go.Spot.Left })
        ),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Left }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Bottom }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Top }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Right })
      );

       diagram.model = new go.GraphLinksModel(
       [
         { key: 1, alignmentFocusName: "left" },
         { key: 2, alignmentFocusName: "body" },
         { key: 3, alignmentFocusName: "right" },
         { key: 4, alignmentFocusName: "" }
       ]);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.findNodeForKey(1)) ===
      'Rect(0,0,193.5,101)Rect(10.5,0,183,101)Rect(0,30,41,41)Rect(41,0,101,101)Rect(142,30,41,41)Rect(0,40,21,21)Rect(20.5,60.5,21,21)Rect(20.5,19.5,21,21)Rect(41,40,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(2)) ===
      'Rect(213.5,0,183,122)Rect(0,10.5,183,101)Rect(0,30,41,41)Rect(41,0,101,101)Rect(142,30,41,41)Rect(30.5,50.5,21,21)Rect(81,101,21,21)Rect(81,0,21,21)Rect(131.5,50.5,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(3)) ===
      'Rect(0,142,193.5,101)Rect(0,0,183,101)Rect(0,30,41,41)Rect(41,0,101,101)Rect(142,30,41,41)Rect(131.5,40,21,21)Rect(152,60.5,21,21)Rect(152,19.5,21,21)Rect(172.5,40,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(4)) ===
      'Rect(213.5,142,204,122)Rect(10.5,10.5,183,101)Rect(0,30,41,41)Rect(41,0,101,101)Rect(142,30,41,41)Rect(0,50.5,21,21)Rect(91.5,101,21,21)Rect(91.5,0,21,21)Rect(183,50.5,21,21)'
      );
    }
  )); // end test


  // This time, with margin
  paneltests.add(new Test('Spot Panel main alignObj 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
      $(go.Node, "Spot",
        $(go.Panel, "Horizontal",
          { alignmentFocusName: "BODY", background: 'coral' },  // ??? has no effect
          new go.Binding("alignmentFocusName"),
          $(go.Shape, "RoundedRectangle", { margin: 20, name: 'left', width: 40, height: 40, fill: 'lime', alignment: go.Spot.Right, alignmentFocus: go.Spot.Left }),
          $(go.Shape, {  margin: 20, name: 'body', fill: "lightblue" }),
          $(go.Shape, "RoundedRectangle", { margin: 20, name: 'right', width: 40, height: 40, fill: 'lime', alignment: go.Spot.Right, alignmentFocus: go.Spot.Left })
        ),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Left }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Bottom }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Top }),
        $(go.Shape, { fill: 'red', width: 20, height: 20, alignment: go.Spot.Right })
      );

       diagram.model = new go.GraphLinksModel(
       [
         { key: 1, alignmentFocusName: "left" },
         { key: 2, alignmentFocusName: "body" },
         { key: 3, alignmentFocusName: "right" },
         { key: 4, alignmentFocusName: "" }
       ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.findNodeForKey(1)) ===
      'Rect(0,0,303,141)Rect(0,0,303,141)Rect(20,50,41,41)Rect(101,20,101,101)Rect(242,50,41,41)Rect(9.5,60,21,21)Rect(30,80.5,21,21)Rect(30,39.5,21,21)Rect(50.5,60,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(2)) ===
      'Rect(323,0,303,141)Rect(0,0,303,141)Rect(20,50,41,41)Rect(101,20,101,101)Rect(242,50,41,41)Rect(90.5,60,21,21)Rect(141,110.5,21,21)Rect(141,9.5,21,21)Rect(191.5,60,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(3)) ===
      'Rect(0,161,303,141)Rect(0,0,303,141)Rect(20,50,41,41)Rect(101,20,101,101)Rect(242,50,41,41)Rect(231.5,60,21,21)Rect(252,80.5,21,21)Rect(252,39.5,21,21)Rect(272.5,60,21,21)'
      );
      test.assert(dumpAB(diagram.findNodeForKey(4)) ===
      'Rect(323,161,324,162)Rect(10.5,10.5,303,141)Rect(20,50,41,41)Rect(101,20,101,101)Rect(242,50,41,41)Rect(0,70.5,21,21)Rect(151.5,141,21,21)Rect(151.5,0,21,21)Rect(303,70.5,21,21)'
      );
    }
  )); // end test

  // Simple test to ensure stroke width and margin are correctly respected on both main and other elements
  paneltests.add(new Test('Spot Panel SW+Margin', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    diagram.nodeTemplate =
      $(go.Node, "Spot", { background: 'lightblue'},
        $(go.Shape, { margin: 10, width: 25, height: 25, fill: 'rgba(0, 0, 255, 0.5)', strokeWidth: 10 }),
        $(go.Shape, { margin: 20, width: 25, height: 25, fill: 'rgba(255, 0, 0, 0.5)', strokeWidth: 10
        ,alignment: go.Spot.TopLeft
        ,alignmentFocus: go.Spot.BottomRight }));

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, ], [ ]);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.findNodeForKey("Alpha")) === "Rect(0,0,100,100)Rect(55,55,35,35)Rect(20,20,35,35)");

    }
  )); // end test

  // Ensure Spot panel with child that has negative margin + stretch expands correctly
  paneltests.add(new Test('Spot Neg Margin+Stretch', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate = new go.Node('Spot')
        .add(
          new go.Shape('Triangle', {
            strokeWidth: 0,
            background: 'lime',
            width: 100,
            height: 100,
          }).bind('fill', 'color')
        )
        .add(new go.Shape(
          {
            stretch: go.GraphObject.Fill, margin: -4,
            fill: 'rgba(255,0,0,.1)', stroke: "rgba(55,0,255,.5)", strokeWidth: 4
          }))

          // positive margin instead, should be smaller
          diagram.nodeTemplateMap.add('2', new go.Node('Spot')
          .add(
            new go.Shape('Triangle', {
              strokeWidth: 0,
              background: 'lime',
              width: 100,
              height: 100,
            }).bind('fill', 'color')
          )
          .add(new go.Shape(
            {
              stretch: go.GraphObject.Fill, margin: 4,
              fill: 'rgba(255,0,0,.1)', stroke: "rgba(55,0,255,.5)", strokeWidth: 4
            })))

      diagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'pink' },
          { key: 'Beta', color: 'red', category: '2' }
      ], []
      );
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.findNodeForKey("Alpha")) === "Rect(0,0,108,108)Rect(4,4,100,100)Rect(0,0,108,108)");
      console.log(dumpAB(diagram.findNodeForKey("Beta")) === "Rect(128,0,100,100)Rect(0,0,100,100)Rect(4,4,92,92)");
    }
  )); // end test

  // This time, with scale and strokeWidth
  paneltests.add(new Test('Spot Panel main alignObj 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplateMap.add('2',
      $(go.Node, "Spot", { background: 'lightblue'},
        // $(go.Shape, { name: 's', scale: 2, width: 90, height: 90, fill: 'rgba(0, 0, 255, 0.5)', strokeWidth: 40 }),
        $(go.Panel, "Horizontal", {  }, new go.Binding('alignmentFocusName'),
          $(go.Shape, { name:'a', scale: 1, width: 50, height: 50, fill: 'rgba(0, 255, 255, 0.5)', strokeWidth: 0 }),
          $(go.Shape, { name: 's', scale: 2, width: 90, height: 90, fill: 'rgba(0, 0, 255, 0.5)', strokeWidth: 20 }) ),

        $(go.Shape, { width: 25, height: 25, fill: 'rgba(255, 0, 0, 0.5)', strokeWidth: 1
        ,alignment: go.Spot.Left
      }))
      );

    diagram.nodeTemplate =
      $(go.Node, "Spot", { background: 'lightblue'},
        $(go.Panel, { alignmentFocusName: 's' },
          $(go.Shape, { name: 's', scale: 2, width: 50, height: 50, fill: 'rgba(0, 0, 255, 0.5)', strokeWidth: 20 })
        ),
        $(go.Shape, { width: 25, height: 25, fill: 'rgba(255, 0, 0, 0.5)', strokeWidth: 1
        ,alignment: go.Spot.Left }));

     diagram.model = new go.GraphLinksModel( [
      { key: "1", color: "lightblue" },
      { key: "2", category: "2" },
      { key: "3", category: "2", alignmentFocusName: 'a' },
      { key: "4", category: "2", alignmentFocusName: 's' },
      ], [ ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.findNodeForKey("1")) ===
      'Rect(0,0,153,140)Rect(13,0,140,140)Rect(0,0,140,140)Rect(0,57,26,26)')
      test.assert(dumpAB(diagram.findNodeForKey("2")) ===
      'Rect(173,0,283,220)Rect(13,0,270,220)Rect(0,85,50,50)Rect(50,0,220,220)Rect(0,97,26,26)')
      test.assert(dumpAB(diagram.findNodeForKey("3")) ===
      'Rect(0,240,283,220)Rect(13,0,270,220)Rect(0,85,50,50)Rect(50,0,220,220)Rect(0,97,26,26)')
      test.assert(dumpAB(diagram.findNodeForKey("4")) ===
      'Rect(303,240,270,220)Rect(0,0,270,220)Rect(0,85,50,50)Rect(50,0,220,220)Rect(37,97,26,26)')
    }
  )); // end test



    paneltests.add(new Test('Spot Panel main alignObj 3', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Spot",
          {  },
          $(go.Shape,
            { width: 30, height: 200, strokeWidth: 0, fill: "red" }
          ),
          // Farenheit scale, on the left:
          $(go.Panel, "Horizontal",
            {
              background: "lime",
              alignmentFocusName: "PROBLEM"
            },
            $(go.Shape, { fill: 'gray', strokeWidth: 0 }),
            $(go.Shape, { name: "PROBLEM", strokeWidth: 0 })
          )
        ); // end node template

      diagram.model = new go.GraphLinksModel(
        [
          { height: 400, celsius: 20 }
        ]);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      test.assert(dumpAB(diagram.nodes.first()) ===
      'Rect(0,0,200,200)Rect(135,0,30,200)Rect(0,50,200,100)Rect(0,0,100,100)Rect(100,0,100,100)')
    }
  )); // end test

  // This test was added because Spot panel elements were
  // modifying the width/height passed to the routine,
  // which would change how text wrapped in subsequent elements
  paneltests.add(new Test('Spot Panel text no wrap', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();

    diagram.nodeTemplate =
  $(go.Node, "Spot",  // the whole node panel
    {
      selectionAdorned: true
      , resizable: true
      , resizeObjectName: "PORTSHAPE"
    }
    , $(go.Shape, "Rectangle",
      {
        name: "PORTSHAPE"
        , fill: "lightgray"
        , strokeWidth: 2
        , portId: ""
        , cursor: "crosshair"
        , fromLinkable: true, fromLinkableDuplicates: true
        , toLinkable: true, toLinkableDuplicates: true
        , fromSpot: go.Spot.AllSides
        , toSpot: go.Spot.AllSides
      }
    )
    , $(go.Shape,
      { fill: null, strokeWidth: 0,
          name: "CONTENTPANEL"
        , background: "red"
        , stretch: go.GraphObject.Fill
        , margin: 10
      }
    )
    , $(go.TextBlock,
      {
        name: "TitleTextBlock"
        , alignment: new go.Spot(.5, 1, 0, 5)
        , alignmentFocus: go.Spot.Top
        , textAlign: "center"
        , font: "bold 16px sans-serif"
        , editable: true
        , text: "some node title long"
        , background: "white"
      }
      , new go.Binding("text", "title")
    )
  );  // end Node

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" } ]);
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    var node = diagram.nodes.first();
    test.assert(test.isApproxSize(node.elt(0).actualBounds.size, new go.Size(102,102)), node.elt(0).actualBounds.size.toString() + " isn't Size(102,102)");
    test.assert(test.isApproxSize(node.elt(1).actualBounds.size, new go.Size(82,82)), node.elt(1).actualBounds.size + " isn't Size(82,82)");
    // Text should not be constrained by the width of the shapes
    test.assert(node.elt(2).actualBounds.width > 105, node.elt(2).actualBounds.width + " should be > 105");

  }
)); // end test


  // Added because Shapes had a natural bounds that were not respecting min and max
  // This would present itself when an object was rotated, since the naturalbounds
  // is needed to correctly rotate the transform
  paneltests.add(new Test('Spot min/max angles', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate = $(go.Node, 'Spot',
        $(go.Shape, "Diamond", // the inside
          {
            desiredSize: new go.Size(30, 30),
            strokeWidth: 0,
            fill: 'lime',
            cursor: "move",
          },
        ),
        $(go.Shape, "RoundedRectangle",
          {
            fill: 'red',
            stroke: '#FF62AD',
            maxSize: new go.Size(23, 23),
            desiredSize: new go.Size(55, 55),
          },
          new go.Binding('scale'),
          new go.Binding('angle'),
          new go.Binding('minSize')
        )
      )

      diagram.model = new go.GraphLinksModel(
        [
          { key: 'Alpha', color: 'lightblue' },
          { key: 'Beta', angle: 95 },
          { key: 'Gamma', angle: 95, scale: 2 },
          { key: 'Delta', scale: 2.2 },
          { key: '1', minSize: new go.Size(44, 44) },
          { key: '2', minSize: new go.Size(44, 44), angle: 95 },
        ],
        []
      );
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    const a = diagram.findNodeForKey('Alpha');
    const b = diagram.findNodeForKey('Beta');
    const c = diagram.findNodeForKey('Gamma');
    const d = diagram.findNodeForKey('Delta');
    const e = diagram.findNodeForKey('1');
    const f = diagram.findNodeForKey('2');
    // as opposed to 55,55
    test.assert(a.elt(1).naturalBounds.toString() === 'Rect(0,0,23,23)');
    test.assert(b.elt(1).naturalBounds.toString() === 'Rect(0,0,23,23)');
    test.assert(c.elt(1).naturalBounds.toString() === 'Rect(0,0,23,23)');
    test.assert(d.elt(1).naturalBounds.toString() === 'Rect(0,0,23,23)');
    // as opposed to 23!
    test.assert(e.elt(1).naturalBounds.toString() === 'Rect(0,0,44,44)');
    test.assert(f.elt(1).naturalBounds.toString() === 'Rect(0,0,44,44)');
  })); // end test


})(); // End test system


/*
  paneltests.add(new Test('Spot Panel offsetX/Y', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    diagram.nodeTemplate =
      $(go.Node, "Spot", { background: 'lightblue'},
        $(go.Shape, { margin: 10, width: 25, height: 25, fill: 'rgba(0, 0, 255, 0.5)', strokeWidth: 10 }),
        $(go.Shape, { margin: 20, width: 25, height: 25, fill: 'rgba(255, 0, 0, 0.5)', strokeWidth: 10
        ,alignment: go.Spot.TopLeft
        ,alignmentFocus: go.Spot.BottomRight }));

    diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" }, ], [ ]);

  } // end init

  window.click = function() {
    console.log(dumpAB(diagram.findNodeForKey("Alpha")) === "Rect(0,0,100,100)Rect(55,55,35,35)Rect(20,20,35,35)");
  }
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;

    }
  )); // end test
*/