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
var v1 = new TestCollection('Visibility');
TestRoot.add(v1);
var $ = go.GraphObject.make;



function setup(animation, model) {
  window.D2Div = document.createElement('div');
  window.D2Div.innerHTML = '<div id="yep" style="border: solid 1px black; width: 400px; height: 400px"></div>';

  document.body.appendChild(window.D2Div);
  window.D2 =
    $(go.Diagram, "yep", {
      "animationManager.isEnabled": animation,
      initialContentAlignment: go.Spot.Center
    });
    D2.model = model;

  return D2;
}

function teardown() {
  window.D2.div = null;
  document.body.removeChild(D2Div);
  window.D2 = null;
  window.D2Div = null;
}


function setup3(animation, model, template) {
  window.D3Div = document.createElement('div');
  window.D3Div.innerHTML = '<div id="yep3" style="border: solid 1px black; width: 400px; height: 400px"></div>';

  document.body.appendChild(window.D3Div);
  window.D3 =
    $(go.Diagram, "yep3", {
      "animationManager.isEnabled": animation,
      initialContentAlignment: go.Spot.Center
    });
    if (template) D3.nodeTemplate = template;
    D3.model = model;

  return D3;
}

function teardown3() {
  window.D3.div = null;
  document.body.removeChild(D3Div);
  window.D3 = null;
  window.D3Div = null;
}

// Test created for C20867
// Selecting a link and setting one node's visible = false
// Would cause the link adornment to remain visible
v1.add(new Test('node vis with link selected', null,
function (test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" }
    ],
    [
      { from: "Alpha", to: "Beta" }
    ]);

},
null,
function (test) {
    var diagram = test.diagram;
    var d = diagram;

    diagram.startTransaction('');
    diagram.links.first().isSelected = true;
    diagram.commitTransaction('');

    diagram.startTransaction('');
    diagram.findNodeForKey('Alpha').visible = false;
    diagram.commitTransaction('');

    test.assert(diagram.links.first().adornments.count === 0);
}
));

  v1.add(new Test("limit # Adornments", null,
    function(test) {
      var d = test.diagram;
      d.reset();
      d.anim
      d.layout = new go.GridLayout();
      d.layout.wrappingWidth = Infinity;

      var m = new go.Model();
      var narr = [];
      for (var i = 0; i < 100; i++) narr.push({});
      m.nodeDataArray = narr;
      d.model = m;
    },
    function(test) {
      var d = test.diagram;
      d.commandHandler.selectAll();
    },
    function(test) {
      var d = test.diagram;
      var adlay = d.findLayer("Adornment");
      test.assert(adlay && adlay.parts.count > 4 && adlay.parts.count < d.model.nodeDataArray.length,
        "selectAll() created too many Adornments " + adlay.parts.count);
    }
  ));

  v1.add(new Test("Adornment correctly positioned after node moved off", null,
    function(test) {
      var m = new go.GraphLinksModel(
        [
          { key: "Alpha" },
          { key: "Beta" },
          { key: "Gamma" },
          { key: "Delta" }
        ]);
      setup(false, m);
    },
    function(test) {
      var diag = window.D2;

      var beta = diag.findNodeForKey("Beta");
      diag.select(beta);
      diag.redraw();
      diag.selection.first().position = new go.Point(270, 0);
      diag.selection.first().position = new go.Point(270, 20);
      diag.redraw();

      var adorn = beta.adornments.first();
      test.assert(beta.actualBounds.center.equalsApprox(adorn.actualBounds.center), "Adornment isn't correctly positioned");
      teardown();
    }
  ));

  v1.add(new Test("Adornment visible after node moved off", null,
    function(test) {
      var m = new go.Model();
      var narr = [];
      for (var i = 0; i < 100; i++) narr.push({});
      m.nodeDataArray = narr;
      setup(true, m);
    },
    function(test) {
      var diag = window.D2;

      function checkNumAdornments(e) {
        var d = window.D2;
        var adlay = d.findLayer("Adornment");
        test.assert(adlay && adlay.parts.count <= 1, "wrong # Adornments " + adlay.parts.count);
        var ad = adlay.parts.first();
        if (ad) {
          test.assert(!ad.actualBounds.intersectsRect(d.viewportBounds),
            "selection Adornment should be outside of viewport, not at " + ad.actualBounds.toString());
        } else {
          //console.log("no Adornment");
        }
        d.removeDiagramListener("AnimationFinished", checkNumAdornments);
        teardown();
      }
      diag.addDiagramListener("AnimationFinished", checkNumAdornments);

      diag.commit(function(d) {
        var data = {};
        d.model.addNodeData(data);
        d.select(d.findNodeForData(data));
      }, "added node");
    }
  ));


  v1.add(new Test("Manually add adornment", null,
    function(test) {
      var d = test.diagram;
      d.reset();
      var $ = go.GraphObject.make;
    // define a simple Node template
    d.nodeTemplate =
      $(go.Node, "Spot",
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
          new go.Binding('width'),
          new go.Binding('height'),
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 0 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );
    test.nodeHoverAdornment =
      $(go.Adornment, "Spot",
        {
          background: "transparent"
        },
        $(go.Placeholder,
          {
            background: "red",  // to allow this Placeholder to be "seen" by mouse events
            isActionable: true,  // needed because this is in a temporary Layer
            click: function(e, obj) {
              var node = obj.part.adornedPart;
              node.diagram.select(node);
            }
          })
      );
      // create the model data that will be represented by Nodes and Links
      d.model = new go.GraphLinksModel(
        [
          { key: "Alpha", width: 200, height: 25, color: "lightblue" },
          { key: "Beta",  width: 100, height: 35, color: "orange" }
        ],
        [
        ]);
    },
    function(test) {
      var d = test.diagram;
      var ad = test.nodeHoverAdornment;

      d.startTransaction();
      var node = d.findNodeForKey('Alpha');
      ad.adornedObject = node;
      node.addAdornment("mouseHover", ad);
      d.commitTransaction();
      test.assert(ad.actualBounds.equalsApprox(new go.Rect(0,0,200,25)), "not 0,0,200,25: " + ad.actualBounds.toString());

      d.startTransaction();
      var node = d.findNodeForKey('Beta');
      ad.adornedObject = node;
      node.addAdornment("mouseHover", ad);
      d.commitTransaction();
      test.assert(ad.actualBounds.equalsApprox(new go.Rect(220,0,100,35)), "not 220,0,100,35: " + ad.actualBounds.toString());
    }
  ));


  /*
  v1.add(new Test("Adornment visible 2", null,
    function(test) {
      var d = test.diagram;
      d.reset();

      var $ = go.GraphObject.make;

      var template = $(go.Node, "Auto",  // the Shape will go around the TextBlock
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: "white" },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );
      var m = new go.GraphLinksModel(
        [
          { key: "Alpha", color: "lightblue" },
          { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen" },
          { key: "Delta", color: "pink" }
        ],
        [
          { from: "Alpha", to: "Beta" },
          { from: "Alpha", to: "Gamma" },
          { from: "Beta", to: "Beta" },
          { from: "Gamma", to: "Delta" },
          { from: "Delta", to: "Alpha" }
        ]);
      setup3(false, m, template);
    },
    function(test) {
      var diag = window.D3;
      var old = test.diagram;

      diag.startTransaction();
      diag.commitTransaction();
      test.diagram = diag;
      test.mouseDown(new go.Point(75, 15), { timestamp: 0 });
      test.mouseMove(new go.Point(365, 15), { timestamp: 1000 });
      test.mouseUp(new go.Point(400, 15), { timestamp: 2000 });

      test.diagram = old;
      teardown3();
    }
  ));
  */
})();