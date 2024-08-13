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

  var stretchTests = new TestCollection('Stretch within Panels');
  TestRoot.add(stretchTests);

  stretchTests.add(new Test('Rotate and stretch 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    diagram.nodeTemplate =
      $(go.Node, "Table",
        { width: 150, height: 150, background: 'rgba(255,0,0,.2)' },
        $(go.Shape, "Triangle",
          {
            name: 'TEXT',
            background: 'rgba(0,255,0,.3)',
            //stretch: go.GraphObject.Fill,
            //width: 20,
            //height: 20,
            //angle: 90
          },
          new go.Binding('width'),
          new go.Binding('height'),
          new go.Binding('angle'),
          new go.Binding('stretch')
        )
    );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // the first 4 should all be 21-wide and 150 tall
    diagram.model = new go.GraphLinksModel(
    [
      { key: "1", width: 20, /*height: 20,*/ angle: 0, stretch: go.GraphObject.Fill  },
      { key: "2", width: 20, /*height: 20,*/ angle: 90, stretch: go.GraphObject.Fill  },
      { key: "3", width: 20, /*height: 20,*/ angle: 180, stretch: go.GraphObject.Fill  },
      { key: "4", width: 20, /*height: 20,*/ angle: 270, stretch: go.GraphObject.Fill  },
      // angle of 45 + no stretch
      { key: "5", width: 20, /*height: 20,*/ angle: 45, stretch: go.GraphObject.None  }
    ],
    [
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();

    var str = "";
    diagram.nodes.each(function(n) {
      n.elements.each(function(e) {
        str += Math.round(e.actualBounds.x);
        str += Math.round(e.actualBounds.y);
        str += Math.round(e.actualBounds.width);
        str += Math.round(e.actualBounds.height);
        test.assert(e.naturalBounds.width === 20);
        if (e.part.data.key === "5") {
          // angle of 45 + no stretch = height will be 100
          test.assert(e.naturalBounds.height === 100);
        } else {
          test.assert(e.naturalBounds.height === 149);
        }

      })
    })
    // expected:
    // "Rect(64.5,0,21,150)Rect(0,64.5,150,21)Rect(64.5,0,21,150)Rect(0,64.5,150,21)"+
    // "Rect(31.866486347620608,31.866486347620594,86.26702730475878,86.26702730475881)"
    // pure regression test:
    test.assert(str === "6502115006515021650211500651502132328686");


    }


  )); // end test


  stretchTests.add(new Test('Rotate and stretch 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Horizontal",
        { height: 150, background: 'rgba(255,0,0,.2)' },
        $(go.TextBlock, "Triangle",
          {
            name: 'TEXT1',
            background: 'rgba(0,255,0,.3)'
          }
        ),
        $(go.TextBlock, "Triangle",
          {
            name: 'TEXT2',
            background: 'rgba(0,255,0,.3)',
            stretch: go.GraphObject.Vertical,
            height: 20,
            angle: 90
          }
        )
        ,$(go.TextBlock, "Triangle",
          {
            name: 'TEXT3',
            background: 'rgba(0,255,0,.3)'
          }
        )
    );
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" }
    ], []);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();


    var node = diagram.nodes.first();
    var text = node.findObject('TEXT2');
    test.assert(text.naturalBounds.width === 150);
    test.assert(text.naturalBounds.height === 20);
    }
  )); // end test


  stretchTests.add(new Test('Rotate and stretch 3', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    diagram.nodeTemplate =
      $(go.Node, "Vertical",
        { width: 150, background: 'rgba(255,0,0,.2)' },
        $(go.TextBlock, "Triangle",
          {
            name: 'TEXT2',
            background: 'rgba(0,255,0,.3)',
            stretch: go.GraphObject.Horizontal,
            height: 20,

          }
        )
    );

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" }
    ], []);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();

    var node = diagram.nodes.first();
    var text = node.findObject('TEXT2');
    test.assert(text.naturalBounds.width === 150);
    test.assert(text.naturalBounds.height === 20);

    }
  )); // end test



  stretchTests.add(new Test('Rotate and stretch text 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      var swimlaneHorizontal = $(go.Group, "Auto",
          {
            locationSpot: go.Spot.Center,
          },
          new go.Binding("location", "location", go.Point.parse), //the initial location of the group
          $(go.Shape, "Rectangle", {fill: null }),
          $(go.Panel, "Table",
            { height: 80, width: 100, background: 'rgba(255,0,0,.2)' },
            //new go.Binding("width", "width"),
            //new go.Binding("height", "height"),
            $(go.RowColumnDefinition, { column: 0, minimum: 30 } ),
            $(go.TextBlock, new go.Binding("text", "text"), {
              margin: 4,
              column: 0, angle: 270,
              background: 'rgba(0,255,0,.3)',
              stretch: go.GraphObject.Vertical,
              textAlign: "center",
              name: 'TEXT'
            }),
            $(go.Panel,
              { column: 1, stretch: go.GraphObject.Fill, background: 'rgba(0, 0, 255, .3)' }//,
              //$(go.Placeholder)
            )
          )
      );

    diagram.groupTemplate = swimlaneHorizontal;
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha1", text: "short text", isGroup: true, width: 70 },
      { key: "Alpha2", text: "long long long long long long long long text", isGroup: true, width: 70  }
    ],
    [
    ]);

    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();


    var node = diagram.findNodeForKey('Alpha1');
    var text = node.findObject('TEXT');
    test.assert(text.naturalBounds.width === 72);
    test.assert(text.naturalBounds.height > 12 && text.naturalBounds.height < 16); // some variance for font size

    test.assert(text.actualBounds.width > 12 && text.actualBounds.width < 16);
    test.assert(text.actualBounds.height === 72);

    var node = diagram.findNodeForKey('Alpha2');
    var text = node.findObject('TEXT');
    test.assert(text.naturalBounds.width === 72); // 72
    test.assert(text.naturalBounds.height > 68 && text.naturalBounds.height < 75); // 73.7 on android chrome (moto x) 74.06 on another android chrome (samsung tablet)

    test.assert(text.actualBounds.width > 68 && text.actualBounds.width < 75); // 73.7 on android chrome (moto x) 74.06 on another android chrome (samsung tablet)
    test.assert(text.actualBounds.height === 72);

    }
  )); // end test

  stretchTests.add(new Test('Rotate and stretch text 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      var swimlaneHorizontal = $(go.Group, "Auto",
          {
            locationSpot: go.Spot.Center,
          },
          new go.Binding("location", "location", go.Point.parse), //the initial location of the group
          $(go.Shape, "Rectangle", {fill: null }),
          $(go.Panel, "Table",
            { height: 100, width: 200, background: 'rgba(255,0,0,.2)' },
            new go.Binding("width", "width"),
            new go.Binding("height", "height"),
            $(go.RowColumnDefinition, { row: 0, minimum: 30 } ),
              $(go.TextBlock, new go.Binding("text", "text"), {
                margin: 4,
                row: 0,
                // angle: 270,
                background: 'rgba(0,255,0,.3)',
                stretch: go.GraphObject.Horizontal,
                textAlign: "center",
                name: 'TEXT'
              }),
            $(go.Panel,
              { row: 1, stretch: go.GraphObject.Fill, background: 'rgba(0, 0, 255, .3)' },
              $(go.Placeholder)
            )
          )
      );



    diagram.groupTemplate = swimlaneHorizontal;

    // create the model data that will be represented by Nodes and Links
    //
    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha1", text: "short text", isGroup: true, width: 70 },
      { key: "Alpha2", text: "long long long long long long long long text", isGroup: true, width: 70  }
    ],
    [
    ]);


    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();
    var node = diagram.findNodeForKey('Alpha1');
    var text = node.findObject('TEXT');

    test.assert(text.naturalBounds.width === 62);
    test.assert(text.naturalBounds.height > 12 && text.naturalBounds.height < 16); // some variance for font size

    test.assert(text.actualBounds.width === 62);
    test.assert(text.actualBounds.height > 12 && text.actualBounds.height < 16);

    var node = diagram.findNodeForKey('Alpha2');
    var text = node.findObject('TEXT');
    test.assert(text.naturalBounds.width === 62);
    test.assert(text.naturalBounds.height > 68 && text.naturalBounds.height < 75, text.actualBounds.height);

    test.assert(text.actualBounds.width === 62);
    test.assert(text.actualBounds.height > 68 && text.actualBounds.height < 75, text.actualBounds.height);

    }
  )); // end test

  stretchTests.add(new Test('r+s simple panel 1', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node, "Table",
          { width: 150, height: 150, background: 'rgba(255,0,0,.2)' },
          $(go.Panel,
            {
              name: 'TEXT',
              background: 'rgba(0,255,0,.3)'
            },
            $(go.Shape, { width: 20, height: 25 }),
            new go.Binding('width'),
            new go.Binding('height'),
            new go.Binding('angle'),
            new go.Binding('stretch')
          )
      );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "1", width: 20, /*height: 20,*/ angle: 0, stretch: go.GraphObject.Fill  },
        { key: "2", width: 20, /*height: 20,*/ angle: 90, stretch: go.GraphObject.Fill  },
        { key: "3", width: 20, /*height: 20,*/ angle: 180, stretch: go.GraphObject.Fill  },
        { key: "4", width: 20, /*height: 20,*/ angle: 270, stretch: go.GraphObject.Fill  },
        // angle of 45 + no stretch
        { key: "5", width: 20, /*height: 20,*/ angle: 45, stretch: go.GraphObject.None  }
      ],
      [
      ]);


    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    diagram.startTransaction();
    diagram.commitTransaction();
    var str = "";

    function addToString(str, e) {
      if (e.elements) e.elements.each(function(elem) { str += addToString(str, elem) });
      str += Math.round(e.actualBounds.x);
      str += Math.round(e.actualBounds.y);
      str += Math.round(e.actualBounds.width);
      str += Math.round(e.actualBounds.height);
      return str;
    }
    var nodearr = [];
    diagram.nodes.each(function(n) {
      nodearr.push(addToString(str, n)); // log
    })

    test.assert(nodearr[0] === "0021266502015000150150");
    test.assert(nodearr[1] === "002126065150201700150150");
    test.assert(nodearr[2] === "002126650201503400150150");
    test.assert(nodearr[3] === "002126065150200170150150");
    test.assert(nodearr[4] === "00212659593333170170150150");

    }

  )); // end test


  stretchTests.add(new Test('Spot default stretch', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          { resizable: true },
          new go.Binding('width'),
          $(go.Shape, "Triangle", {
            strokeWidth: 0,
            name: 's1',
            fill: 'lightblue'
          },
            new go.Binding("stretch", "stretch", function(s) {
              if (s) return go.GraphObject.Fill;
              return go.GraphObject.Default;
            }),
            new go.Binding("fill", "color")),
          $(go.Shape,
            { name: 's2', height: 20, width: 50, alignment: go.Spot.Right })
        );

      // but use the default Link template, by not setting Diagram.linkTemplate

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [
        { key: "A", stretch: false },
        { key: "B", stretch: true },
        { key: "C", color: 'lime', width: 200, stretch: false },
        { key: "D", color: 'lime', width: 200, stretch: true },
      ], []);
    }, // END SETUP
    null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var a = diagram.findNodeForKey('A');
      var b = diagram.findNodeForKey('B');
      var c = diagram.findNodeForKey('C');
      var d = diagram.findNodeForKey('D');

      test.assert(a.findObject('s1').actualBounds.width === 100);
      test.assert(a.findObject('s1').actualBounds.height === 100);
      test.assert(a.findObject('s2').actualBounds.width === 51);
      test.assert(a.findObject('s2').actualBounds.height === 21);

      test.assert(b.findObject('s1').actualBounds.width === 100);
      test.assert(b.findObject('s1').actualBounds.height === 100);
      test.assert(b.findObject('s2').actualBounds.width === 51);
      test.assert(b.findObject('s2').actualBounds.height === 21);

      test.assert(c.findObject('s1').actualBounds.width === 200); // if spot panel didn't stretch main element by default, this would be 100
      test.assert(c.findObject('s1').actualBounds.height === 100);
      test.assert(c.findObject('s2').actualBounds.width === 51);
      test.assert(c.findObject('s2').actualBounds.height === 21);

      test.assert(d.findObject('s1').actualBounds.width === 200);
      test.assert(d.findObject('s1').actualBounds.height === 100);
      test.assert(d.findObject('s2').actualBounds.width === 51);
      test.assert(d.findObject('s2').actualBounds.height === 21);

    }

  )); // end test



  stretchTests.add(new Test('stretch min size', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
  $(go.Node, "Vertical",
    $(go.Panel, "Spot",
      $(go.Shape, "Circle", { width: 40, height: 40, fill: "lightgray" },
        new go.Binding("scale")),
      $(go.TextBlock, { font: "8pt sans-serif" },
        new go.Binding("text", "scale"))
    ),
    $(go.TextBlock,
      new go.Binding("text"))
  );

// show a different model
diagram.model = new go.GraphLinksModel(
  {
    nodeDataArray: [
      { key: 1, text: "Zeta", scale: 1 },
      { key: 2, text: "Eta", scale: .5 },
      { key: 3, text: "Eta3", scale: 1.5 }
    ],
    linkDataArray: [
      // { from: 1, to: 2 }
    ]
  });

    }, // END SETUP
    null,
    function (test) {
      console.log(test.diagram.findNodeForKey(1).elt(0).elt(0).measuredBounds.width === 41);
      console.log(test.diagram.findNodeForKey(1).elt(0).elt(0).measuredBounds.height === 41);
      test.assert(test.diagram.findNodeForKey(2).elt(0).elt(0).measuredBounds.width === 20.5);
      test.assert(test.diagram.findNodeForKey(2).elt(0).elt(0).measuredBounds.height === 20.5);
      console.log(test.diagram.findNodeForKey(3).elt(0).elt(0).measuredBounds.width);
      console.log(test.diagram.findNodeForKey(3).elt(0).elt(0).measuredBounds.height);
    }

  )); // end test

})(); // End test system
