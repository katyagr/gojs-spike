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


  function setup(name, width, height, options) {
    var namediv = name + 'div';
    window[namediv] = document.createElement('div');
    window[namediv].innerHTML = '<div id="' + namediv + '" style="border: solid 1px black; width: ' + width + 'px; height: ' + height + 'px"></div>';

    document.body.appendChild(window[namediv]);
    window[name] = $(go.Diagram, namediv, options);
    return window[name];
  }
  function CheckZOrder(test) {
    var diag = test.diagram;
    var msg = "";
    diag.nodes.each(function (n) {
      if (!n.actualBounds.isReal() || !n.location.isReal()) {
        msg += "unreal node actualBounds and/or location for node " + n.key + " " + n.actualBounds.toString() + "\n";
      }
      // pick at where the TextBlock should be, which should not be occluded by any other Group
      var x = n.diagram.findPartAt(new go.Point().setRectSpot(n.actualBounds, new go.Spot(0.5, 0, 0, 4)));
      if (x !== n) msg += "found " + x.key + " in front of " + n.key + "\n";
    });
    test.assert(msg === "", msg);
  }
  function teardown(name) {
    var namediv = name + 'div';
    document.body.removeChild(window[namediv]);
    window[name].div = null;
    window[name] = null;
    window[namediv] = null;
  }

  var $ = go.GraphObject.make;
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
  var stateTests = new TestCollection('State');
  TestRoot.add(stateTests);


  // Ensure the nodes are measured before default layout can run
  // (this can be solved by the layout itself or the update loop)
  stateTests.add(new Test('default layout', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate = new go.Node('Vertical')
    .add(
      new go.Shape('RoundedRectangle', {
        strokeWidth: 0,
        fill: 'white',
        width: 50,
        height: 50,
      }).bind('fill', 'color')
    )
    .add(
      new go.TextBlock({
        margin: 8,
        width: 45, height: 15,
        textAlign: 'center',
        font: 'bold 14px sans-serif',
        stroke: '#333'
      }).bind('text', 'key')
    );

  diagram.groupTemplate = new go.Group('Vertical')
    .add(
      new go.TextBlock({
        width: 45, height: 18,
        font: 'bold 18px sans-serif',
        textAlign: 'center',
        stroke: '#333'
      }).bind('text', 'key')
    )
    .add(new go.Panel('Auto')
      .add(new go.Shape({ fill: 'lightgray' }))
      .add(new go.Placeholder({ margin: 4 }))
    )

  diagram.model = new go.GraphLinksModel(
    [
      { key: 'Alpha', color: 'lightblue' },
      { key: 'Beta', color: 'orange' },
      { key: 'Gamma', color: 'lightgreen' },
      { key: 'Delta', color: 'pink', group: 'B' },
      { key: 'B', isGroup: true },
      { key: 'A', isGroup: true },
    ],
    []
  );
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;

    const nodeAB = [
    'Rect(0,0,61,81)Rect(5.5,0,50,50)Rect(8,58,45,15)',
    'Rect(81,0,61,81)Rect(5.5,0,50,50)Rect(8,58,45,15)',
    'Rect(162,0,61,81)Rect(5.5,0,50,50)Rect(8,58,45,15)',
    'Rect(4.5,123.5,61,81)Rect(5.5,0,50,50)Rect(8,58,45,15)',
    'Rect(0,101,70,108)Rect(12.5,0,45,18)Rect(0,18,70,90)Rect(0,0,70,90)Rect(4.5,4.5,61,81)',
    'Rect(90,101,45,27)Rect(0,0,45,18)Rect(18,18,9,9)Rect(0,0,9,9)Rect(4.5,4.5,0,0)'
    ];
    let i = 0;
    for (const n of diagram.nodes)
      test.assert(dumpAB(n) === nodeAB[i++]);
  }
  )); // end test


  // single link should be perfectly centered in viewport
  stateTests.add(new Test('Single link', null,
  function (test) {
    var diagram = setup('SL', 400, 400, {
      contentAlignment: go.Spot.Center,
    });
    diagram.animationManager.isInitial = false;

    diagram.nodeTemplate =
    $(go.Node,
      $(go.Shape, "Circle",
        { desiredSize: new go.Size(2, 2), fill: "transparent", strokeWidth: 0, portId: "" },
        new go.Binding("figure"))
    );

  diagram.linkTemplate =
    $(go.Link, go.Link.Bezier,  // slightly curved, by default
      { reshapable: true },  // users can reshape the link route
      $(go.Shape,  // the link's path shape
        {
          stroke: "black",
          strokeWidth: 12,
        }),
      $(go.Shape,  // the "to" arrowhead
        { toArrow: "OpenTriangle", fill: null, scale: 1.2, stroke: "blue" })
    );

  diagram.model = $(go.GraphLinksModel,
    {
      nodeDataArray: [
        { key: 1 },
        { key: 2 }
      ],
      linkDataArray: [
        { from: 1, to: 2 }
      ]
    });
    diagram.addDiagramListener('InitialLayoutCompleted', () => {
      const msg = 'single link in viewport is not centered after InitialLayoutCompleted'
      let i = 0;
      diagram.nodes.each((n) => {
        if (i === 0) test.assert(n.actualBounds.toString() === 'Rect(0,0,2,2)')
        if (i === 1) test.assert(n.actualBounds.toString() === 'Rect(70,0,2,2)')
        i++;
      });
      // y value will be off by 0.3 because viewportBounds x/y are now rounded in 3.0
      test.assert(test.isApproxPoint(diagram.viewportBounds.center, diagram.links.first().actualBounds.center), msg);
      teardown('SL');
    })
  }, // END SETUP
  null,
  function (test) { }
  )); // end test

  // Add one group with no location, and one node inside the group with a location
  // The default layout shouldnot  position the group, instead its placeholder should locate the
  // group around the node.
  stateTests.add(new Test('group+node', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate =
    $(go.Node,
      new go.Binding("location", "loc", go.Point.parse),
      $(go.Shape, { fill: "lightblue" }));

    diagram.model.nodeDataArray = [
      { key: 1, loc: "0 0" },
      { key: 2, loc: "200 0" },
      { key: 3, loc: "50 200" },

      // { key: 11, isGroup: true },
      // { key: 4, group: 11, loc: "303 33" }
    ];
    diagram.model.linkDataArray = [
      { from: 1, to: 3 }
    ];
    var model = test.diagram.model;
    diagram.startTransaction();
    // model.setGroupKeyForNodeData(model.findNodeDataForKey(2), 11);
    model.addNodeData({ key: 11, isGroup: true });
    model.addNodeData({ key: 4, group: 11, loc: "303 33", desiredSize: new go.Size(5, 5) });
    diagram.commitTransaction();
    test.assert(diagram.findNodeForKey(11).position.x > 280, "group should be locate by node");
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;

  }
  )); // end test

  // Add a bunch of nested groups to the diagram
  // check their z-order but more importantly check their spacing

  stateTests.add(new Test('nested g', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    var diag = test.diagram;

    diag.initialAutoScale = go.Diagram.Uniform;
    diag.addDiagramListener("InitialLayoutCompleted", function (e) { CheckZOrder(test); });

    diag.groupTemplate =
      $(go.Group, "Auto",
        $(go.Shape, { fill: "white" }),
        $(go.Placeholder, { padding: new go.Margin(14, 4, 4, 4) }),
        $(go.TextBlock, { alignment: go.Spot.Top, width: 15, height: 15 }, new go.Binding("text", "key"))
      );

    diag.model = go.Model.fromJSON(`{ "class": "GraphLinksModel",
    "nodeDataArray": [
    {"key":1,"isGroup":true,"group":0},
    {"key":3,"isGroup":true,"group":1},
    {"key":8,"isGroup":true,"group":3},
    {"key":7,"isGroup":true,"group":5},
    {"key":6,"isGroup":true,"group":2},
    {"key":9,"isGroup":true,"group":0},
    {"key":2,"isGroup":true,"group":0},
    {"key":0,"isGroup":true},
    {"key":5,"isGroup":true,"group":1},
    {"key":4,"isGroup":true,"group":2}
    ],
    "linkDataArray": []}
    `)
  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;
    const expectedResults = [
      'Rect(4.5,14.5,104,57)Rect(0,0,104,57)Rect(0.5,0.5,103,56)Rect(44.5,0,15,15)',
      'Rect(9,29,25,38)Rect(0,0,25,38)Rect(0.5,0.5,24,37)Rect(5,0,15,15)',
      'Rect(13.5,43.5,16,19)Rect(0,0,16,19)Rect(4,0.5,8,18)Rect(0.5,0,15,15)',
      'Rect(83.5,43.5,16,19)Rect(0,0,16,19)Rect(4,0.5,8,18)Rect(0.5,0,15,15)',
      'Rect(9,106,16,19)Rect(0,0,16,19)Rect(4,0.5,8,18)Rect(0.5,0,15,15)',
      'Rect(128.5,14.5,16,19)Rect(0,0,16,19)Rect(4,0.5,8,18)Rect(0.5,0,15,15)',
      'Rect(4.5,91.5,95,38)Rect(0,0,95,38)Rect(0.5,0.5,94,37)Rect(40,0,15,15)',
      'Rect(0,0,149,134)Rect(0,0,149,134)Rect(0.5,0.5,148,133)Rect(67,0,15,15)',
      'Rect(79,29,25,38)Rect(0,0,25,38)Rect(0.5,0.5,24,37)Rect(5,0,15,15)',
      'Rect(79,106,16,19)Rect(0,0,16,19)Rect(4,0.5,8,18)Rect(0.5,0,15,15)',
    ]
    const results = [];
    diagram.nodes.each((n) => {
      // console.log(dumpAB(n));
      results.push(dumpAB(n));
    });
    for (var i = 0; i < expectedResults.length; i++) {
      test.assert(results[i] === expectedResults[i]);
    }
  }
  )); // end test

  // Added because of AvoidsNodesRouter, which relies on
  // _validateLinksOfCollection,
  // which relies on *all* relevant nodes being arranged before link routing,
  // which in the case of avoids nodes (at least) is actually all nodes in the subgraph,
  // not just the two end nodes
  stateTests.add(new Test('link routing timing', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
        diagram.layout = $(go.GridLayout, { wrappingColumn: 6, wrappingWidth: Infinity, spacing: new go.Size(100, 100) });
        diagram.scale = 0.1818;

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        { width: 300, height: 200 },
        $(go.Shape, { fill: "lightgray" },
          new go.Binding("fill", "color"))
      );

    diagram.linkTemplate =
      $(go.Link,  // needed for channel routing??
        {
          layerName: "Foreground", corner: 6,
          routing: go.Link.AvoidsNodes
        },
        $(go.Shape, { stroke: "green", strokeWidth: 2 }),
        $(go.Shape, { toArrow: "Standard", fill: "green", strokeWidth: 0 })
      );


    diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: 1139490 }, { key: 1211507 }, { key: 1209625 }, { key: 1351215 },
          { key: 1132455 }, { key: 1213615 }, { key: 1350943 }, { key: 1211680 }, { key: 1351088 },
          { key: 1400624 }, { key: 1132344 }, { key: 1351239 }, { key: 1211596 }, { key: 1211518 },
          { key: 1216406 }, { key: 1213600 }, { key: 1351123 }, { key: 1351110 }, { key: 1133017 },
          { key: 1401280 }, { key: 1211542 }, { key: 1350924 }, { key: 1213602 }, { key: 1350901 }, { key: 1350874 }, { key: 1213605 }, { key: 1400560 }, { key: 1351137 },
        ],
        linkDataArray: [
          { from: 1139490, to: 1400560 },
          //  { from: 1132450, to: 1351137 },
        ]
      });

  }, // END SETUP
  null,
  function (test) {
    var diagram = test.diagram;

    const arr = diagram.links.first().points.toArray();
    let str = '';
    for (const p of arr) {
      str += p.x + ',' + p.y + ' ';
    }
    // note space at end
    console.log(str === '150,200 150,210 150,212 308,212 308,1108 950,1108 950,1190 950,1200 ');
    }
  )); // end test






  class SillyRouter extends go.Router {
    canRoute(coll) {
      if (coll instanceof go.Diagram) return true;
      return false; // only perform routing on the whole Diagram, never on Groups
    }

    routeLinks(links) {
      links.each(link => {
        const label = link.findObject('label');
        label.alignmentFocus = new go.Spot(0.5, 0.5, 0, label.alignmentFocus.offsetY - 1)
      });
    }
  }
  // This router should not run indefinitely in a loop
  // This test is to ensure it never does
  stateTests.add(new Test('SillyRouter', null,
  function (test) {
    var diagram = setup('SillyRouter', 600, 400, {
      layout: $(go.LayeredDigraphLayout, { layerSpacing: 50 }),
      'animationManager.isEnabled': false,
      'undoManager.isEnabled': true,
    });
    diagram.animationManager.isInitial = false;

    diagram.routers.add(new SillyRouter())
    let layoutCompletedCount = 0;
    diagram.addDiagramListener('LayoutCompleted', (e) => {
      console.log('layout completed')
      layoutCompletedCount++;
      const link = diagram.links.first();
      const label = link.findObject('label');
      label.alignmentFocus = new go.Spot(0.5, 0.5, 0, label.alignmentFocus.offsetY - 1)
    })

    diagram.nodeTemplate = new go.Node('Vertical')
      .add(
        new go.Shape('RoundedRectangle', {
          strokeWidth: 0, fill: 'white', width: 50, height: 50,
        }).bind('fill', 'color')
      )
      .add(new go.TextBlock({ margin: 8, font: 'bold 14px sans-serif', stroke: '#333' }).bind('text', 'key')
      );

    diagram.linkTemplate = new go.Link()
      .add(new go.Shape())
      .add(new go.Shape("Triangle", { width: 15, height: 15, name: 'label', alignmentFocus: new go.Spot(0.5, 0.5, 0, 0) }))


    diagram.model = new go.GraphLinksModel(
      [
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
      ],
      [
        { from: 'Alpha', to: 'Beta' }
      ]
    );

    diagram.startTransaction();
    diagram.commitTransaction();

    setTimeout(() => {
      test.assert(layoutCompletedCount === 1, "layoutCompleted should only happen once, any more might mean infinite loop")
      teardown('SillyRouter');
    }, 700);

  }, // END SETUP
  null,
  function (test) { }
  )); // end test





  // position should be correct by end of initialization brought about by autoScale + scrollbar
  stateTests.add(new Test('autoScale', null,
  function (test) {
    var diagram = setup('autoScale', 400, 225,         {
      "animationManager.isEnabled": false,
      initialAutoScale: go.AutoScale.UniformToFill,
      layout:
        $(go.TreeLayout,
          {
            treeStyle: go.TreeStyle.LastParents,
            arrangement: go.TreeArrangement.Horizontal,
            // properties for most of the tree:
            angle: 90,
            layerSpacing: 35,
            // properties for the "last parents":
            alternateAngle: 90,
            alternateLayerSpacing: 35,
            alternateAlignment: go.TreeAlignment.Bus,
            alternateNodeSpacing: 20
          }),
      "undoManager.isEnabled": true, // enable undo & redo

    });
    diagram.animationManager.isInitial = false;
    diagram.nodeTemplate =
      $(go.Node,
        { height: 20 },
        $(go.TextBlock, new go.Binding("text", "name"))
      );
    // define the Link template
    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Routing.Orthogonal, layerName: "Background", corner: 5 },
        $(go.Shape, { strokeWidth: 2 },
          new go.ThemeBinding("stroke", "link")
        ));  // the link shape

    diagram.model = go.Model.fromJson(
      `{ "class": "go.TreeModel",
  "nodeDataArray": [
{"key":1, "name":"Stella Payne Diaz", "title":"CEO", "dept": "Management", "pic":"1.jpg", "email": "sdiaz@example.com", "phone": "(234) 555-6789" },
{"key":2, "name":"Luke Warm", "title":"VP Marketing/Sales", "dept": "Management", "pic":"2.jpg", "email": "lwarm@example.com", "phone": "(234) 555-6789", "parent":1},
{"key":3, "name":"Meg Meehan Hoffa", "title":"Sales", "dept": "Sales", "pic":"3.jpg", "email": "mhoffa@example.com", "phone": "(234) 555-6789", "parent":2},
{"key":4, "name":"Peggy Flaming", "title":"VP Engineering", "dept": "Management", "pic":"4.jpg", "email": "pflaming@example.com", "phone": "(234) 555-6789", "parent":1},
{"key":5, "name":"Saul Wellingood", "title":"Manufacturing", "dept": "Production", "pic":"5.jpg", "email": "swellingood@example.com", "phone": "(234) 555-6789", "parent":4},
{"key":6, "name":"Al Ligori", "title":"Marketing", "dept": "Marketing", "pic":"6.jpg", "email": "aligori@example.com", "phone": "(234) 555-6789", "parent":2},
{"key":7, "name":"Dot Stubadd", "title":"Sales Rep", "dept": "Sales", "pic":"7.jpg", "email": "dstubadd@example.com", "phone": "(234) 555-6789", "parent":3},
{"key":8, "name":"Les Ismore", "title":"Project Mgr", "dept": "Production", "pic":"8.jpg", "email": "lismore@example.com", "phone": "(234) 555-6789", "parent":5},
{"key":9, "name":"April Lynn Parris", "title":"Events Mgr", "dept": "Marketing", "pic":"9.jpg", "email": "aparris@example.com", "phone": "(234) 555-6789", "parent":6},
{"key":10, "name":"Xavier Breath", "title":"Engineering", "dept": "Engineering", "pic":"10.jpg", "email": "xbreath@example.com", "phone": "(234) 555-6789", "parent":4},
{"key":11, "name":"Anita Hammer", "title":"Process", "dept": "Production", "pic":"11.jpg", "email": "ahammer@example.com", "phone": "(234) 555-6789", "parent":5},
{"key":12, "name":"Billy Aiken", "title":"Software", "dept": "Engineering", "pic":"12.jpg", "email": "baiken@example.com", "phone": "(234) 555-6789", "parent":10},
{"key":13, "name":"Stan Wellback", "title":"Testing", "dept": "Engineering", "pic":"13.jpg", "email": "swellback@example.com", "phone": "(234) 555-6789", "parent":10},
{"key":14, "name":"Marge Innovera", "title":"Hardware", "dept": "Engineering", "pic":"14.jpg", "email": "minnovera@example.com", "phone": "(234) 555-6789", "parent":10},
{"key":15, "name":"Evan Elpus", "title":"Quality", "dept": "Production", "pic":"15.jpg", "email": "eelpus@example.com", "phone": "(234) 555-6789", "parent":5},
{"key":16, "name":"Lotta B. Essen", "title":"Sales Rep", "dept": "Sales", "pic":"16.jpg", "email": "lessen@example.com", "phone": "(234) 555-6789", "parent":3}
 ]
}`
    );
    diagram.startTransaction();
    diagram.commitTransaction();
      test.assert(diagram.position.x === -5, "Diagram.position.x isn't -5: " + diagram.position.x);
      test.assert(diagram.position.y === -5, "Diagram.position.y isn't -5: " + diagram.position.y);
      teardown('autoScale');
  }, // END SETUP
  null,
  function (test) { }
  )); // end test


})(); // End test system


/*
stateTests.add(new Test('', null,
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