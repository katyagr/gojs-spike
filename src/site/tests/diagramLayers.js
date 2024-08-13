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


  // define the Node template
  function SetupTemplates(test) {
    var $ = go.GraphObject.make;
    test.diagram.nodeTemplate =
      $(go.Node,
        { position: new go.Point(0, 0) },
        new go.Binding("layerName", "layer"),
        $(go.Shape,
          { fill: "lightgray" },
          new go.Binding("fill", "layer")));
    test.diagram.undoManager.isEnabled = true;
  }

  // use the default Link template

  function CheckLayers(test, arr) {
    var diagram = test.diagram;
    var layers = diagram.layers.iterator;
    test.assert(layers.count == arr.length, '# layers, ' + layers.count + ', does not match ' + arr.length);
    var i = 0;
    while (layers.next()) {
      var layer = layers.value;
      test.assert(layer.name == arr[i], 'Diagram Layer name ' + layer.name + ' does not match ' + arr[i] + ' at index ' + i);
      i++;
    }
  }

  function CheckOrder(test, arr) {
    var diagram = test.diagram;
    var parts = diagram.findObjectsAt(new go.Point(50, 50), function(o) { return o.part; }).iterator;
    test.assert(parts.count == arr.length, '# objects,' + parts.count + ', found does not match ' + arr.length);
    var i = 0;
    while (parts.next()) {
      var node = parts.value;
      test.assert(node.data.layer == arr[i], 'Diagram.findObjectsAt found ' + node.data.layer + ' instead of ' + arr[i] + ' at index ' + i);
      i++;
    }
  }

  // layers:
  var layertests = new TestCollection('Layers');
  TestRoot.add(layertests);

  layertests.add(new Test('initial Layers', null,
    function(test) {
      //test.diagram.reset();
      SetupTemplates(test);
    },
    null,
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, []);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('invalid operations', null,
    SetupTemplates,
    function(test) {
      var diagram = test.diagram;
      var myLayer = diagram.findLayer("Foreground");
      test.assert(myLayer, "Diagram doesn't have Foreground layer?");

      var otherDiagram = new go.Diagram();
      var otherLayer = otherDiagram.findLayer("Foreground");
      test.assert(otherLayer, "couldn't create other Diagram with layers?");

      diagram.startTransaction("failures");
      try {
        diagram.addLayer(myLayer);
        test.assert(false, "Diagram.addLayer should not have been able to add an existing layer: " + diagram.findLayer("Foreground"));
      } catch (ex) {
      }
      try {
        diagram.addLayer(otherLayer);
        test.assert(false, "Diagram.addLayer should not have been able to add a layer of another Diagram: " + otherLayer);
      } catch (ex) {
      }
      try {
        var lay = new go.Layer();
        lay.name = "";
        diagram.addLayer(lay);
        test.assert(false, "Diagram.addLayer should not have been able to add a layer with a duplicate name: " + lay);
      } catch (ex) {
      }
      try {
        diagram.addLayerAfter(otherLayer, myLayer);
        test.assert(false, "Diagram.addLayerAfter should not have been able to move a layer of another Diagram: " + otherLayer);
      } catch (ex) {
      }
      try {
        diagram.addLayerAfter(myLayer, otherLayer);
        test.assert(false, "Diagram.addLayerAfter should not have been able to reorder a layer relative to another Diagram: " + otherLayer);
      } catch (ex) {
      }
      try {
        var lay = new go.Layer();
        lay.name = "Foreground";
        diagram.addLayer(lay);
        diagram.addLayerAfter(lay, myLayer);
        test.assert(false, "Diagram.addLayerAfter should not have been able to add a layer with a duplicate name: " + lay);
      } catch (ex) {
      }
      try {
        diagram.addLayerBefore(otherLayer, myLayer);
        test.assert(false, "Diagram.addLayerBefore should not have been able to move a layer of another Diagram: " + otherLayer);
      } catch (ex) {
      }
      try {
        diagram.addLayerBefore(myLayer, otherLayer);
        test.assert(false, "Diagram.addLayerBefore should not have been able to reorder a layer relative to another Diagram: " + otherLayer);
      } catch (ex) {
      }
      try {
        var lay = new go.Layer();
        lay.name = "Foreground";
        diagram.addLayer(lay);
        diagram.addLayerAfter(lay, myLayer);
        test.assert(false, "Diagram.addLayerBefore should not have been able to add a layer with a duplicate name: " + lay);
      } catch (ex) {
      }
      diagram.commitTransaction("failures");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, []);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('addLayer temporary', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layer");
      var lay = new go.Layer();
      lay.name = "blue";
      lay.isTemporary = true;
      diagram.addLayer(lay);
      diagram.commitTransaction("add layer");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add node");
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add node");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "ViewportForeground", "Adornment", "Tool", "blue"]);
      CheckOrder(test, ["blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('addLayer', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layer");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layer");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add node");
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add node");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('addLayer undo', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add layer");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layer");

      diagram.startTransaction("add node");
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add node");
      diagram.commandHandler.undo();
      diagram.commandHandler.undo();
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, []);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('addLayers', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "green", "red", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["red", "green", "blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('addLayers undo', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
    },
    function(test) {
      var diagram = test.diagram;

      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");

      diagram.commandHandler.undo();
      diagram.commandHandler.undo();
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, []);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('reorder after', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("move layer");
      diagram.addLayerAfter(diagram.findLayer("blue"), diagram.findLayer("red"));
      diagram.commitTransaction("move layer");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "green", "red", "blue", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["blue", "red", "green"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('reorder after undo', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("move layer");
      diagram.addLayerAfter(diagram.findLayer("blue"), diagram.findLayer("red"));
      diagram.commitTransaction("move layer");

      diagram.commandHandler.undo();
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "green", "red", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["red", "green", "blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('reorder before', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("move layer");
      diagram.addLayerBefore(diagram.findLayer("red"), diagram.findLayer("green"));
      diagram.commitTransaction("move layer");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "red", "green", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["green", "red", "blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('reorder before undo', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("move layer");
      diagram.addLayerBefore(diagram.findLayer("red"), diagram.findLayer("green"));
      diagram.commitTransaction("move layer");

      diagram.commandHandler.undo();
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "green", "red", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["red", "green", "blue"]);
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('remove', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      SetupTemplates(test);
      diagram.startTransaction("add layers");
      var lay = new go.Layer();
      lay.name = "blue";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "green";
      diagram.addLayer(lay);
      lay = new go.Layer();
      lay.name = "red";
      diagram.addLayer(lay);
      diagram.commitTransaction("add layers");

      diagram.startTransaction("add nodes");
      diagram.model.addNodeData({ layer: "red" });
      diagram.model.addNodeData({ layer: "green" });
      diagram.model.addNodeData({ layer: "blue" });
      diagram.commitTransaction("add nodes");
    },
    function(test) {
      var diagram = test.diagram;
      diagram.startTransaction("remove layer");
      diagram.removeLayer(diagram.findLayer("green"));
      diagram.commitTransaction("remove layer");
    },
    function(test) {
      CheckLayers(test, ["Grid", "ViewportBackground", "Background", "", "Foreground", "blue", "red", "ViewportForeground", "Adornment", "Tool"]);
      CheckOrder(test, ["red", "blue", "green"]);
      test.assert(test.diagram.findLayer("green") === null, "should have removed green layer");
      var greennode = test.diagram.findLayer("").parts.first();
      test.assert(greennode !== null && greennode.layer.name === "" && greennode.data.layer === "green",
                  "node in removed layer should have been transferred to default layer");
      //test.diagram.reset();
    }
  ));

  layertests.add(new Test('switch layers', null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      test.eventLog = [];
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node,
          new go.Binding("layerName", "layer").makeTwoWay(),
          new go.Binding("location"),
          { fromSpot: go.Spot.Center, toSpot: go.Spot.Center },
          {
            layerChanged: function(part, oldlay, newlay) {
              test.eventLog.push("layered " + part + " " + oldlay + " " + newlay);
            },
            linkConnected: function(node, link, port) {
              test.eventLog.push("connected " + node.data.key + " " + link.toString());
            },
            linkDisconnected: function(node, link, port) {
              test.eventLog.push("disconnected " + node.data.key + " " + link.toString());
            },
            containingGroupChanged: function(member, oldgrp, newgrp) {
              test.eventLog.push("grouped " + member.data.key + " " + oldgrp + " " + newgrp);
            }
          },
          $(go.Shape, { fill: "lightgreen" }));
      diagram.groupTemplate =
        $(go.Group, "Auto",
          new go.Binding("layerName", "layer").makeTwoWay(),
          {
            layerChanged: function(part, oldlay, newlay) {
              test.eventLog.push("layered " + part + " " + oldlay + " " + newlay);
            },
            linkConnected: function(node, link, port) {
              test.eventLog.push("connected " + node.data.key + " " + link.toString());
            },
            linkDisconnected: function(node, link, port) {
              test.eventLog.push("disconnected " + node.data.key + " " + link.toString());
            },
            containingGroupChanged: function(member, oldgrp, newgrp) {
              test.eventLog.push("grouped " + member.data.key + " " + oldgrp + " " + newgrp);
            },
            memberAdded: function(group, part) {
              test.eventLog.push("member added " + group.data.key + " " + part.data.key);
            },
            memberRemoved: function(group, part) {
              test.eventLog.push("member removed " + group.data.key + " " + part.data.key);
            }
          },
          $(go.Shape, { fill: "rgba(200, 200, 200, 0.5)" }),
          $(go.Placeholder, { padding: 20 }));
      diagram.linkTemplate =
        $(go.Link,
          new go.Binding("layerName", "layer").makeTwoWay(),
          {
            layerChanged: function(part, oldlay, newlay) {
              test.eventLog.push("layered " + part + " " + oldlay + " " + newlay);
            },
            containingGroupChanged: function(member, oldgrp, newgrp) {
              test.eventLog.push("grouped " + member.data.key + " " + oldgrp + " " + newgrp);
            }
          },
          $(go.Shape, { isPanelMain: true, stroke: "blue", strokeWidth: 7 }),
          $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 5 }));
      diagram.model = new go.GraphLinksModel([
        { key: "G", isGroup: true },
        { key: "A", group: "G", location: new go.Point(0,0) },
        { key: "B", location: new go.Point(150, 50) }
      ], [
        { from: "A", to: "B" }
      ]);
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(test.eventLog.length === 12, "should have 12 eventlog entries on init, not " + test.eventLog.length);
      test.eventLog = [];
      var dataA = diagram.model.findNodeDataForKey("A");
      var dataL = diagram.model.linkDataArray[0];
      diagram.startTransaction("change layer");
      diagram.model.setDataProperty(dataA, "layer", "Background");
      diagram.model.setDataProperty(dataL, "layer", "Background");
      diagram.commitTransaction("change layer");
      test.assert(test.eventLog.length === 2, "should have 2 new eventlog entries after layer change, not " + test.eventLog.length);
    },
    function(test) {
      var diagram = test.diagram;
      test.eventLog = [];
      var dataA = diagram.model.findNodeDataForKey("A");
      var dataB = diagram.model.findNodeDataForKey("B");
      var dataL = diagram.model.linkDataArray[0];
      diagram.startTransaction("change membership & connection");
      diagram.model.setDataProperty(dataA, "group", null);
      diagram.model.setDataProperty(dataL, "from", null);
      diagram.commitTransaction("change membership & connection");
      test.assert(test.eventLog.length === 3, "should have 3 new eventlog entries after removals, not " + test.eventLog.length);
      diagram.startTransaction("change membership & connection");
      diagram.model.setDataProperty(dataB, "group", "G");
      diagram.model.setDataProperty(dataL, "from", "A");
      diagram.commitTransaction("change membership & connection");
      test.assert(test.eventLog.length === 10, "should have 10 new eventlog entries after additions, not " + test.eventLog.length);
    }
  ));

})();
