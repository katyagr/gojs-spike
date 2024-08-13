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
    // Define a custom DraggingTool
    class SnappingTool extends go.DraggingTool {
      constructor() {
        super();
      }
    // This predicate checks to see if the ports can snap together.
    // The first letter of the port id should be "U", "F", or "M" to indicate which kinds of port may connect.
    // The second letter of the port id should be a digit to indicate which direction it may connect.
    // The ports also need to not already have any link connections and need to face opposite directions.
    compatiblePorts(p1, p2) {
      // already connected?
      var part1 = p1.part;
      var id1 = p1.portId;
      if (id1 === null || id1 === "") return false;
      if (part1.findLinksConnected(id1).filter(function(l) { return l.category === ""; }).count > 0) return false;
      var part2 = p2.part;
      var id2 = p2.portId;
      if (id2 === null || id2 === "") return false;
      if (part2.findLinksConnected(id2).filter(function(l) { return l.category === ""; }).count > 0) return false;
      // compatible fittings?
      if ((id1[0] === 'U' && id2[0] === 'U') ||
          (id1[0] === 'F' && id2[0] === 'M') ||
          (id1[0] === 'M' && id2[0] === 'F')) {
        // find their effective sides, after rotation
        var a1 = this.effectiveAngle(id1, part1.angle);
        var a2 = this.effectiveAngle(id2, part2.angle);
        // are they in opposite directions?
        if (a1-a2 === 180 || a1-a2 === -180) return true;
      }
      return false;
    };

    // At what angle can a port connect, adjusting for the node's rotation
    effectiveAngle(id, angle) {
      var dir = id[1];
      var a = 0;
      if (dir === '1') a = 45;
      else if (dir === '2') a = 90;
      else if (dir === '3') a = 135;
      else if (dir === '4') a = 180;
      else if (dir === '5') a = 225;
      else if (dir === '6') a = 270;
      else if (dir === '7') a = 315;
      a += angle;
      if (a < 0) a += 360;
      else if (a >= 360) a -= 360;
      return a;
    };

    // Override this method to find the offset such that a moving port can
    // be snapped to be coincident with a compatible stationary port,
    // then move all of the parts by that offset.
    moveParts(parts, offset, check) {
      // when moving an actually copied collection of Parts, use the offset that was calculated during the drag
      if (this._snapOffset && this.isActive && this.diagram.lastInput.up && parts === this.copiedParts) {
        go.DraggingTool.prototype.moveParts.call(this, parts, this._snapOffset, check);
        this._snapOffset = undefined;
        return;
      }

      var commonOffset = offset;

      // find out if any snapping is desired for any Node being dragged
      var sit = parts.iterator;
      while (sit.next()) {
        var node = sit.key;
        if (!(node instanceof go.Node)) continue;
        var info = sit.value;
        var newloc = info.point.copy().add(offset);

        // now calculate snap point for this Node
        var snapoffset = newloc.copy().subtract(node.location);
        var nearbyports = null;
        var closestDistance = 20*20;  // don't bother taking sqrt
        var closestPort = null;
        var closestPortPt = null;
        var nodePort = null;
        var mit = node.ports;
        while (mit.next()) {
          var port = mit.value;
          if (node.findLinksConnected(port.portId).filter(function(l) { return l.category === ""; }).count > 0) continue;
          var portPt = port.getDocumentPoint(go.Spot.Center);
          portPt.add(snapoffset);  // where it would be without snapping

          if (nearbyports === null) {
            // this collects the Nodes that intersect with the NODE's bounds,
            // excluding nodes that are being dragged (i.e. in the PARTS collection)
            var nearbyparts = this.diagram.findObjectsIn(node.actualBounds,
                                      function(x) { return x.part; },
                                      function(p) { return !parts.has(p); },
                                      true);

            // gather a collection of GraphObjects that are stationary "ports" for this NODE
            nearbyports = new go.Set(/*go.GraphObject*/);
            nearbyparts.each(function(n) {
              if (n instanceof go.Node) {
                nearbyports.addAll(n.ports);
              }
            });
          }

          var pit = nearbyports.iterator;
          while (pit.next()) {
            var p = pit.value;
            if (!this.compatiblePorts(port, p)) continue;
            var ppt = p.getDocumentPoint(go.Spot.Center);
            var d = ppt.distanceSquaredPoint(portPt);
            if (d < closestDistance) {
              closestDistance = d;
              closestPort = p;
              closestPortPt = ppt;
              nodePort = port;
            }
          }
        }

        // found something to snap to!
        if (closestPort !== null) {
          // move the node so that the compatible ports coincide
          var noderelpt = nodePort.getDocumentPoint(go.Spot.Center).subtract(node.location);
          var snappt = closestPortPt.copy().subtract(noderelpt);
          // save the offset, to ensure everything moves together
          commonOffset = snappt.subtract(newloc).add(offset);
          // ignore any node.dragComputation function
          // ignore any node.minLocation and node.maxLocation
          break;
        }
      }

      // now do the standard movement with the single (perhaps snapped) offset
      this._snapOffset = commonOffset.copy();  // remember for mouse-up when copying
      go.DraggingTool.prototype.moveParts.call(this, parts, commonOffset, check);
    };

    // Establish links between snapped ports,
    // and remove obsolete links because their ports are no longer coincident.
    doDropOnto = function(pt, obj) {
      go.DraggingTool.prototype.doDropOnto.call(this, pt, obj);
      var tool = this;
      // Need to iterate over all of the dropped nodes to see which ports happen to be snapped to stationary ports
      var coll = this.copiedParts || this.draggedParts;
      var it = coll.iterator;
      while (it.next()) {
        var node = it.key;
        if (!(node instanceof go.Node)) continue;
        // connect all snapped ports of this NODE (yes, there might be more than one) with links
        var pit = node.ports;
        while (pit.next()) {
          var port = pit.value;
          // maybe add a link -- see if the port is at another port that is compatible
          var portPt = port.getDocumentPoint(go.Spot.Center);
          if (!portPt.isReal()) continue;
          var nearbyports =
              this.diagram.findObjectsAt(portPt,
                        function(x) {  // some GraphObject at portPt
                          var o = x;
                          // walk up the chain of panels
                          while (o !== null && o.portId === null) o = o.panel;
                          return o;
                        },
                        function(p) {  // a "port" Panel
                          // the parent Node must not be in the dragged collection, and
                          // this port P must be compatible with the NODE's PORT
                          if (coll.has(p.part)) return false;
                          var ppt = p.getDocumentPoint(go.Spot.Center);
                          if (portPt.distanceSquaredPoint(ppt) >= 0.25) return false;
                          return tool.compatiblePorts(port, p);
                        });
          // did we find a compatible port?
          var np = nearbyports.first();
          if (np !== null) {
            // connect the NODE's PORT with the other port found at the same point
            this.diagram.toolManager.linkingTool.insertLink(node, port, np.part, np);
          }
        }
      }
    };

    // Just move selected nodes when SHIFT moving, causing nodes to be unsnapped.
    // When SHIFTing, must disconnect all links that connect with nodes not being dragged.
    // Without SHIFT, move all nodes that are snapped to selected nodes, even indirectly.
    computeEffectiveCollection = function(parts) {
      if (this.diagram.lastInput.shift) {
        var links = new go.Set(/*go.Link*/);
        var coll = go.DraggingTool.prototype.computeEffectiveCollection.call(this, parts);
        coll.iteratorKeys.each(function(node) {
          // disconnect all links of this node that connect with stationary node
          if (!(node instanceof go.Node)) return;
          node.findLinksConnected().each(function(link) {
            if (link.category !== "") return;
            // see if this link connects with a node that is being dragged
            var othernode = link.getOtherNode(node);
            if (othernode !== null && !coll.has(othernode)) {
              links.add(link);  // remember for later deletion
            }
          });
        });
        // outside of nested loops we can actually delete the links
        links.each(function(l) { l.diagram.remove(l); });
        return coll;
      } else {
        var map = new go.Map(/*go.Part, Object*/);
        if (parts === null) return map;
        var tool = this;
        parts.iterator.each(function(n) {
          tool.gatherConnecteds(map, n);
        });
        return map;
      }
    };

    // Find other attached nodes.
    gatherConnecteds = function(map, node) {
      if (!(node instanceof go.Node)) return;
      if (map.has(node)) return;
      // record the original Node location, for relative positioning and for cancellation
      map.add(node, new go.DraggingInfo(node.location.copy()));
      // now recursively collect all connected Nodes and the Links to them
      var tool = this;
      node.findLinksConnected().each(function(link) {
        if (link.category !== "") return;  // ignore comment links
        map.add(link, new go.DraggingInfo());
        tool.gatherConnecteds(map, link.getOtherNode(node));
      });
    };
  }
    // end SnappingTool class

  // define the Node templates
  var $ = go.GraphObject.make;

  var commonNodeTemplate =
    $(go.Node, "Vertical",
      { locationSpot: go.Spot.Center,
        locationObjectName: "shape",
        rotatable: true,
        rotateObjectName: "shape",
        resizable: true,
        resizeObjectName: "shape"
      },
      new go.Binding("location", "loc"),
      { contextMenu: $(go.Adornment, "Vertical",
           $("Button",
             $(go.TextBlock, { text: "Toggle Color" }),
             { stretch: go.GraphObject.Horizontal,
               click: function(e, obj) {
                 e.diagram.startTransaction("toggle color");
                 var node = obj.part.adornedObject.part;
                 var shape = node.findObject("shape");
                 if (shape.fill === "gray") {
                   shape.fill = "orange";
                 } else {
                   shape.fill = "gray";
                 }

                 var test = TestCollection.Current;
                 if (test !== null) {
                   var curmenu = e.diagram.toolManager.contextMenuTool.currentContextMenu;
                   test.assert(curmenu !== null && e.diagram.currentTool === e.diagram.toolManager.contextMenuTool, "should be executing a context menu");
                   var button = obj;
                   test.assert(button instanceof go.Panel && typeof button.click === "function", "should have clicked a button");
                   var nodemenu = button.part;
                   test.assert(nodemenu instanceof go.Adornment, "button should be in a context menu");
                   test.assert(nodemenu.adornedPart instanceof go.Node, "context menu should be bound to a Node");
                 }

                 e.diagram.commitTransaction("toggle color");
               }
             }),
           $("Button",
             $(go.TextBlock, { text: "Shift" }),
             { stretch: go.GraphObject.Horizontal,
               click: function(e, obj) {
                 e.diagram.startTransaction("shift");
                 var node = obj.part.adornedObject.part;
                 var loc = node.location.copy();
                 loc.x += 10;
                 loc.y += 10;
                 node.location = loc;
                 e.diagram.commitTransaction("shift");
               }
             })
         )
      },
  // the top object of the node is a panel
      $(go.Panel, "Spot",
  // it holds two concentric rectangular shapes
        $(go.Shape,
          { name: "shape",
            fill: "gray",
            stroke: null,
            desiredSize: new go.Size(30, 30),
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer"
          }),
        $(go.Shape,
          { fill: "lightblue",
            stroke: null,
            desiredSize: new go.Size(20, 20)
          })),
  // the bottom object of the node is a label
      $(go.TextBlock,
        new go.Binding("text")));

  var simpleNodeTemplate =
    $(go.Node, "Vertical",
      { locationSpot: go.Spot.Center,
        locationObjectName: "shape",
        rotatable: true,
        rotateObjectName: "shape",
        resizable: true,
        resizeObjectName: "shape"
      },
      new go.Binding("location", "loc"),
      $(go.Shape,
        { name: "shape",
          fill: "gray",
          stroke: "lightgray",
          desiredSize: new go.Size(50, 50)
        }));

  var nestedLocationNodeTemplate =
    $(go.Node, "Spot",
      { locationSpot: go.Spot.Center,
        locationObjectName: "locationShape",
        rotatable: true,
        rotateObjectName: "",
        resizable: true,
        resizeObjectName: "",
      },
      new go.Binding("location", "loc"),
      $(go.Shape,
        { name: "shape",
          fill: "gray",
          stroke: null,
          angle: 0,
          desiredSize: new go.Size(50, 50)
        }),
      $(go.Panel, "Vertical",
        { angle: 0,
          alignment: go.Spot.TopCenter,
          alignmentFocus: go.Spot.TopCenter
        },
        $(go.Shape,
        { name: "locationShape",
          fill: "lightblue",
          stroke: null,
          angle: 0,
          desiredSize: new go.Size(50, 25)
        }))
      );

  // use the default Link template

  // the ContextMenu for the whole Diagram, not for any particular GraphObject
  var diagramContextMenu =
    $("Adornment", "Vertical",
      $("Button",
        { stretch: go.GraphObject.Horizontal },
        $(go.TextBlock, { text: "Cut" }),
        { click: function(e) { e.diagram.commandHandler.cutSelection(); } }),
      $("Button",
        { stretch: go.GraphObject.Horizontal },
        $(go.TextBlock, { text: "Copy" }),
        { click: function(e) { e.diagram.commandHandler.copySelection(); } }),
      $("Button",
        { stretch: go.GraphObject.Horizontal },
        $(go.TextBlock, { text: "Paste" }),
        { click: function(e) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); } }),
      $("Button",
        { stretch: go.GraphObject.Horizontal },
        $(go.TextBlock, { text: "Delete" }),
        { click: function(e) { e.diagram.commandHandler.deleteSelection(); } }),
      $("Button",
        { stretch: go.GraphObject.Horizontal },
        $(go.TextBlock, { text: "Select All" }),
        { click: function(e) { e.diagram.commandHandler.selectAll(); } })
    );

  function SetupCustomToolHandles(test) {
    var $ = go.GraphObject.make;
    test.diagram.toolManager.relinkingTool.fromHandleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Diamond", { desiredSize: new go.Size(11, 11), fill: "pink", stroke: "red" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
    test.diagram.toolManager.relinkingTool.toHandleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Diamond", { desiredSize: new go.Size(11, 11), fill: "lightgreen", stroke: "green" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
    test.diagram.toolManager.linkReshapingTool.handleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Circle", { desiredSize: new go.Size(11, 11), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
    test.diagram.toolManager.linkReshapingTool.midHandleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Diamond", { desiredSize: new go.Size(11, 11), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
    test.diagram.toolManager.resizingTool.handleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Circle", { desiredSize: new go.Size(11, 11), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
    test.diagram.toolManager.rotatingTool.handleArchetype =
        $(go.Panel, "Auto",
          $(go.Shape, { stroke: "red", strokeWidth: 0, fill: "lightgreen" }),
          $(go.Panel, "Spot",
            $(go.Shape, "Circle", { desiredSize: new go.Size(11, 11), fill: "lightblue", stroke: "deepskyblue" }),
            $(go.Shape, { desiredSize: new go.Size(2, 2) })
          )
        );
  }

  function CommonSetupGraphLinks(test) {
    //test.diagram.reset();
    SetupCustomToolHandles(test);
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.nodeTemplate = commonNodeTemplate;
    test.diagram.toolManager.resizingTool.cellSize = new go.Size(NaN, NaN);
    test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(10, 10);
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1", loc: new go.Point(0, 50) },  // these locations are used in the tests!
      {key: 2, text: "n2", loc: new go.Point(100, 0) },
      { key: 3, text: "n3", loc: new go.Point(100, 100) }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 }
    ];
    test.diagram.model = m;
    test.diagram.undoManager.isEnabled = true;
  }

  function SimpleSetupGraphLinks(test) {
    //test.diagram.reset();
    SetupCustomToolHandles(test);
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.nodeTemplate = simpleNodeTemplate;
    test.diagram.toolManager.resizingTool.cellSize = new go.Size(NaN, NaN);
    test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(10, 10);
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, loc: new go.Point(100, 100) },  // these locations are used in the tests!
      { key: 2, loc: new go.Point(200, 200) }
    ];
    test.diagram.model = m;
    test.diagram.undoManager.isEnabled = true;
  }

  function NestedSetupGraphLinks(test) {
    //test.diagram.reset();
    SetupCustomToolHandles(test);
    test.diagram.contentAlignment = go.Spot.Center;
    test.diagram.nodeTemplate = nestedLocationNodeTemplate;
    test.diagram.toolManager.resizingTool.cellSize = new go.Size(NaN, NaN);
    test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(10, 10);
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, loc: new go.Point(100, 100) },  // this location is used in the tests!
      { key: 2, loc: new go.Point(200, 200) }
    ];
    test.diagram.model = m;
    test.diagram.undoManager.isEnabled = true;
  }

  var tcroot = new TestCollection("Tools");
  TestRoot.add(tcroot);

  var tm = new TestCollection("ToolManager");
  tcroot.add(tm);

  tm.add(new Test("properties", null, null, null,
    function(test) {
      var mgr = test.diagram.toolManager;
      test.assert(mgr !== null, "ToolManager should be standard");
      test.assert(mgr.actionTool !== null && mgr.findTool("Action") === mgr.actionTool, "missing standard tool: Action");
      test.assert(mgr.clickCreatingTool !== null && mgr.findTool("ClickCreating") === mgr.clickCreatingTool, "missing standard tool: ClickCreating");
      test.assert(mgr.clickSelectingTool !== null && mgr.findTool("ClickSelecting") === mgr.clickSelectingTool, "missing standard tool: ClickSelecting");
      test.assert(mgr.contextMenuTool !== null && mgr.findTool("ContextMenu") === mgr.contextMenuTool, "missing standard tool: ContextMenu");
      test.assert(mgr.draggingTool !== null && mgr.findTool("Dragging") === mgr.draggingTool, "missing standard tool: Dragging");
      test.assert(mgr.dragSelectingTool !== null && mgr.findTool("DragSelecting") === mgr.dragSelectingTool, "missing standard tool: DragSelecting");
      test.assert(mgr.linkingTool !== null && mgr.findTool("Linking") === mgr.linkingTool, "missing standard tool: Linking");
      test.assert(mgr.linkReshapingTool !== null && mgr.findTool("LinkReshaping") === mgr.linkReshapingTool, "missing standard tool: LinkReshaping");
      test.assert(mgr.panningTool !== null && mgr.findTool("Panning") === mgr.panningTool, "missing standard tool: Panning");
      test.assert(mgr.relinkingTool !== null && mgr.findTool("Relinking") === mgr.relinkingTool, "missing standard tool: Relinking");
      test.assert(mgr.resizingTool !== null && mgr.findTool("Resizing") === mgr.resizingTool, "missing standard tool: Resizing");
      test.assert(mgr.rotatingTool !== null && mgr.findTool("Rotating") === mgr.rotatingTool, "missing standard tool: Rotating");
      test.assert(mgr.textEditingTool !== null && mgr.findTool("TextEditing") === mgr.textEditingTool, "missing standard tool: TextEditing");
    }
  ));

  tm.add(new Test("mouseDownTools", null, null, null,
    function(test) {
      var mgr = test.diagram.toolManager;
      var list = mgr.mouseDownTools;
      test.assert(list instanceof go.List && list.count > 2, "mouseDownTools not initialized?");
      test.assert(list.contains(mgr.actionTool), "should hold actionTool");
      test.assert(list.contains(mgr.relinkingTool), "should hold relinkingTool");
      test.assert(list.contains(mgr.linkReshapingTool), "should hold linkReshapingTool");
      test.assert(list.contains(mgr.resizingTool), "should hold resizingTool");
      test.assert(list.contains(mgr.rotatingTool), "should hold rotatingTool");
    }
  ));

  tm.add(new Test("mouseMoveTools", null, null, null,
    function(test) {
      var mgr = test.diagram.toolManager;
      var list = mgr.mouseMoveTools;
      test.assert(list instanceof go.List && list.count > 2, "mouseMoveTools not initialized?");
      test.assert(list.contains(mgr.linkingTool), "should hold linkingTool");
      test.assert(list.contains(mgr.draggingTool), "should hold draggingTool");
      test.assert(list.contains(mgr.dragSelectingTool), "should hold dragSelectingTool");
      test.assert(list.contains(mgr.panningTool), "should hold panningTool");
    }
  ));

  tm.add(new Test("mouseUpTools", null, null, null,
    function(test) {
      var mgr = test.diagram.toolManager;
      var list = mgr.mouseUpTools;
      test.assert(list instanceof go.List && list.count > 2, "mouseUpTools not initialized?");
      test.assert(list.contains(mgr.contextMenuTool), "should hold contextMenuTool");
      test.assert(list.contains(mgr.textEditingTool), "should hold textEditingTool");
      test.assert(list.contains(mgr.clickCreatingTool), "should hold clickCreatingTool");
      test.assert(list.contains(mgr.clickSelectingTool), "should hold clickSelectingTool");
    }
  ));



  tm.add(new Test("mouseover viewpoint/documentpoint", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.position= new go.Point(-205, -30);
      test.works = 0;
      diagram.nodeTemplate =
      $(go.Node, "Auto",
      {
      mouseEnter: function mouseEnter(e, obj) {
        test.works++;
      }
      },
      new go.Binding('position'),
      $(go.Shape, "Rectangle",
      { strokeWidth: 2, stroke: null, name: "SHAPE" },
      new go.Binding("fill", "color")),
      $(go.TextBlock,
      { margin: 10, width: 40, height:25, font: "bold 18px Verdana", name: "TEXT" },
      new go.Binding("text", "key"))
      );

      diagram.model = new go.GraphLinksModel( [
        { key: "Alpha", position: new go.Point(0,0), color: "lightblue" },
        { key: "Beta",  position: new go.Point(0,0), color: "orange" },
        { key: "Gamma", position: new go.Point(0,0), color: "lightgreen" },
        { key: "Delta", position: new go.Point(5000,50), color: "pink" }
      ], [ ]);


    },null,
    function(test) {
      var diagram = test.diagram;
      diagram.scrollToRect(diagram.findNodeForKey('Delta').actualBounds);
      diagram.click = function(e)  { console.log(e.documentPoint) }
      var pt = new go.Point(5010, 75);
      var input = diagram.lastInput;
      input.viewPoint = diagram.transformDocToView(pt);
      input.documentPoint = pt;
      diagram.toolManager.standardMouseOver();
      test.assert(test.works === 1, "standardMouseOver did not fire mouseEnter");
    }
  ));


  var tc = new TestCollection("Selecting Tools");
  tcroot.add(tc);

  tc.add(new Test("click select", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3),
                  "selected Node isn't N3");
    }
  ));

  tc.add(new Test("double click", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var nit = test.diagram.nodes;
      while (nit.next()) {
        var node = nit.value;
        node.doubleClick = function() { test.flag = true; };  // double-click causes side-effect
      }
    },
    function(test) {
      test.flag = false;
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 100), { timestamp: 100 });
      test.mouseDown(new go.Point(100, 100), { timestamp: 200 });  // at N3 location
      test.mouseUp(new go.Point(100, 100), { timestamp: 300, clickCount: 2 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3),
                  "selected Node isn't N3");
      test.assert(test.flag === true, "doubleClick function on node didn't execute");
    }
  ));

  tc.add(new Test("click twice", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(0, 50), { timestamp: 1000 });  // at N1 location
      test.mouseUp(new go.Point(0, 50), { timestamp: 1200 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(1),
                  "selected Node isn't N1");
    }
  ));

  tc.add(new Test("click twice clear", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(50, 50), { timestamp: 1000 });  // not in any node
      test.mouseUp(new go.Point(50, 50), { timestamp: 1200 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 0, "should have selected nothing");
      test.assert(!test.diagram.findNodeForKey(3).isSelected, "node N3 is selected, but shouldn't be");
    }
  ));

  tc.add(new Test("click twice control", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(0, 50), { timestamp: 1000, control: true });  // at N1 location
      test.mouseUp(new go.Point(0, 50), { timestamp: 1200, control: true });  // with Control-modifier
    },
    function(test) {
      test.assert(test.diagram.selection.count === 2, "should have selected two nodes");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(test.diagram.findNodeForKey(3).isSelected, "node N3 isn't selected");
    }
  ));

  tc.add(new Test("click thrice control", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(0, 50), { timestamp: 1000, control: true });  // at N1 location
      test.mouseUp(new go.Point(0, 50), { timestamp: 1200, control: true });  // with Control-modifier
      test.mouseDown(new go.Point(100, 102), { timestamp: 2000, control: true });  // at N3 location
      test.mouseUp(new go.Point(100, 102), { timestamp: 2200, control: true });  // with Control-modifier
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected only one node");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(!test.diagram.findNodeForKey(3).isSelected, "node N3 is selected, but shouldn't be");
    }
  ));

  tc.add(new Test("click twice shift", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(0, 50), { timestamp: 1000, modifiers: 4 });  // at N1 location
      test.mouseUp(new go.Point(0, 50), { timestamp: 1200, modifiers: 4 });  // with Shift-modifier
    },
    function(test) {
      test.assert(test.diagram.selection.count === 2, "should have selected two nodes");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(test.diagram.findNodeForKey(3).isSelected, "node N3 isn't selected");
    }
  ));

  tc.add(new Test("click thrice shift", null, CommonSetupGraphLinks,
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.mouseDown(new go.Point(0, 50), { timestamp: 1000, modifiers: 4 });  // at N1 location
      test.mouseUp(new go.Point(0, 50), { timestamp: 1200, modifiers: 4 });  // with Control-modifier
      test.mouseDown(new go.Point(100, 102), { timestamp: 2000, modifiers: 4 });  // at N3 location
      test.mouseUp(new go.Point(100, 102), { timestamp: 2200, modifiers: 4 });  // with Control-modifier
    },
    function(test) {
      test.assert(test.diagram.selection.count === 2, "should have selected two nodes");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(test.diagram.findNodeForKey(3).isSelected, "node N3 isn't selected");
    }
  ));

  tc.add(new Test("drag select two & link", null, CommonSetupGraphLinks,
    function(test) {
      var p = new go.Point(0 - 40, 50 + 31);  // below-left of N1 location
      var endp = new go.Point(100 + 40, 0 - 30);  // above-right of N2
      var dx = (endp.x - p.x) / 10;
      var dy = (endp.y - p.y) / 10;
      test.mouseDown(p, { timestamp: 0 });
      for (var i = 0; i < 10; i++) {
        p.x += dx;
        p.y += dy;
        test.mouseMove(p, { timestamp: 200 + i * 50 });
      }
      test.mouseUp(p, { timestamp: 200 + i * 50 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 3, "should have selected two nodes and one link");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(test.diagram.findNodeForKey(2).isSelected, "node N2 isn't selected");
      test.assert(test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]).isSelected,
                  "link isn't selected");
    }
  ));

  tc.add(new Test("drag partial node", null, CommonSetupGraphLinks,
    function(test) {
      var p = new go.Point(0 - 40, 50 + 31);  // below-left of N1 location
      var endp = new go.Point(100, 0);  // middle of N2
      var dx = (endp.x - p.x) / 10;
      var dy = (endp.y - p.y) / 10;
      test.mouseDown(p, { timestamp: 0 });
      for (var i = 0; i < 10; i++) {
        p.x += dx;
        p.y += dy;
        test.mouseMove(p, { timestamp: 200 + i * 50 });
      }
      test.mouseUp(p, { timestamp: 200 + i * 50 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 2, "should have selected one node and one link");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(!test.diagram.findNodeForKey(2).isSelected, "node N2 is selected");
      test.assert(test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]).isSelected,
                  "link isn't selected");
    }
  ));

  tc.add(new Test("drag partial no link", null, CommonSetupGraphLinks,
    function(test) {
      var p = new go.Point(0 - 40, 50 + 31);  // below-left of N1 location
      var endp = new go.Point(100 - 40, 0 + 30);  // below left of N2
      var dx = (endp.x - p.x) / 10;
      var dy = (endp.y - p.y) / 10;
      test.mouseDown(p, { timestamp: 0 });
      for (var i = 0; i < 10; i++) {
        p.x += dx;
        p.y += dy;
        test.mouseMove(p, { timestamp: 200 + i * 50 });
      }
      test.mouseUp(p, { timestamp: 200 + i * 50 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected only one node");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(!test.diagram.findNodeForKey(2).isSelected, "node N2 is selected");
      test.assert(!test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]).isSelected,
                  "link is selected, but shouldn't be");
    }
  ));

  tc.add(new Test("drag partial with link", null, CommonSetupGraphLinks,
    function(test) {
      test.assert(!test.diagram.toolManager.dragSelectingTool.isPartialInclusion,
                  "by default not isPartialInclusion");
      test.diagram.toolManager.dragSelectingTool.isPartialInclusion = true;
      var p = new go.Point(0 - 40, 50 + 30);  // below-left of N1 location
      var endp = new go.Point(100 - 40, 0 + 30);  // below left of N2
      var dx = (endp.x - p.x) / 10;
      var dy = (endp.y - p.y) / 10;
      test.mouseDown(p, { timestamp: 0 });
      for (var i = 0; i < 10; i++) {
        p.x += dx;
        p.y += dy;
        test.mouseMove(p, { timestamp: 200 + i * 50 });
      }
      test.mouseUp(p, { timestamp: 200 + i * 50 });
    },
    function(test) {
      test.diagram.toolManager.dragSelectingTool.isPartialInclusion = false;
      test.assert(test.diagram.selection.count === 2, "should have selected one node and one link");
      test.assert(test.diagram.findNodeForKey(1).isSelected, "node N1 isn't selected");
      test.assert(!test.diagram.findNodeForKey(2).isSelected, "node N2 is selected");
      test.assert(test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]).isSelected,
                  "link isn't selected");
    }
  ));

  tc.add(new Test("panning, not drag-selecting", null, CommonSetupGraphLinks,
    function(test) {
      test.assert(test.diagram.toolManager.dragSelectingTool.delay > 20,
                  "default DragSelectingTool.delay is too short?");
      test.diagram.contentAlignment = go.Spot.Default;
      test.originalViewport = test.diagram.viewportBounds.copy();
      var p = new go.Point(0 - 40, 50 + 30);  // below-left of N1 location
      var endp = new go.Point(100 + 40, 0 - 30);  // above-right of N2
      var dx = (endp.x - p.x) / 10;
      var dy = (endp.y - p.y) / 10;
      test.mouseDown(p, { timestamp: 0 });
      for (var i = 0; i < 10; i++) {
        p.x += dx;
        p.y += dy;
        test.mouseMove(p, { timestamp: 20 + i * 20 });  // less than DragSelectingTool.delay
      }
      test.mouseUp(p, { timestamp: 20 + i * 20 });
    },
    function(test) {
      test.assert(test.diagram.selection.count === 0, "should have selected nothing");
      test.assert(!test.originalViewport.equals(test.diagram.viewportBounds),
                  "should have scrolled; viewport stayed at: " + test.originalViewport.toString());
      test.diagram.contentAlignment = go.Spot.Center;  // restore to test value
    }
  ));

  /*  //??? these don't work!
  var tc = new TestCollection("Wheel Tools");
  tcroot.add(tc);

  tc.add(new Test("wheel scroll vert", null,
  function(test) {
  CommonSetupGraphLinks(test);
  test.diagram.model.addNodeData({key: 4, text: "n4", loc: new go.Point(1000, 1000) });
  test.diagram.model.addNodeData({key: 5, text: "n5", loc: new go.Point(-1000, -1000) });
  test.diagram.model.addLinkData({from: 2, to: 4});
  test.diagram.model.addLinkData({from: 3, to: 5});
  test.diagram.centerRect(new go.Rect(0, 0, 0, 0));
  test.diagram.scale = 1;
  },
  function(test) {
  test.originalViewport = test.diagram.viewportBounds.copy();
  test.mouseMove(new go.Point(50, 50));
  test.mouseWheel(1);  // with no modifier
  test.mouseWheel(1);
  test.mouseWheel(1);
  },
  function(test) {
  test.assert(test.diagram.scale === 1, "mouse wheel zoomed in or out");
  var newview = test.diagram.viewportBounds.copy();
  test.assert(!test.originalViewport.equals(newview), "didn't scroll");
  test.assert(newview.y < test.originalViewport.y, "didn't scroll up");
  test.assert(newview.x === test.originalViewport.x, "scrolled horizontally?");
  }
  ));
  */
  /*
  tc.add(new Test("wheel scroll horiz", null,
  function(test) {
  CommonSetupGraphLinks(test);
  test.diagram.model.addNodeData({key: 4, text: "n4", loc: new go.Point(1000, 1000) });
  test.diagram.model.addNodeData({key: 5, text: "n5", loc: new go.Point(-1000, -1000) });
  test.diagram.model.addLinkData({from: 2, to: 4});
  test.diagram.model.addLinkData({from: 3, to: 5});
  test.diagram.centerRect(new go.Rect(0, 0, 0, 0));
  test.diagram.scale = 1;
  },
  function(test) {
  test.originalViewport = test.diagram.viewportBounds.copy();
  test.mouseMove(new go.Point(50, 50));
  test.mouseWheel(1, { modifiers: 4 });  // with Shift modifier
  test.mouseWheel(1, { modifiers: 4 });
  test.mouseWheel(1, { modifiers: 4 });
  },
  function(test) {
  test.assert(test.diagram.scale === 1, "mouse wheel zoomed in or out");
  var newview = test.diagram.viewportBounds.copy();
  test.assert(!test.originalViewport.equals(newview), "didn't scroll");
  test.assert(newview.x < test.originalViewport.x, "didn't scroll left");
  test.assert(newview.y === test.originalViewport.y, "scrolled vertically?");
  }
  ));
  */
  /*
  tc.add(new Test("wheel zooming", null, CommonSetupGraphLinks,
  function(test) {
  test.assert(test.diagram.scale === 1, "initial diagram scale isn't one");
  test.mouseMove(new go.Point(50, 50));

  test.mouseWheel(1, { control: true });  // with Control-modifier ??? which does not work
  test.mouseWheel(1, { control: true });
  test.mouseWheel(1, { control: true });
  },
  function(test) {
  test.assert(test.diagram.scale > 1.1, "mouse wheel did not zoom in");
  test.diagram.scale = 1;  // back to normal
  }
  ));
  */

  var tc = new TestCollection("ClickCreatingTool");
  tcroot.add(tc);

  tc.add(new Test("no archetype", null,
    function(test) {
      test.diagram.model = new go.GraphLinksModel();  // clear out all old data
    },
    function(test) {
      test.mouseDown(new go.Point(200, 200), { timestamp: 0 });  // there are no nodes!
      test.mouseUp(new go.Point(200, 200), { timestamp: 100 });
      test.mouseDown(new go.Point(200, 200), { timestamp: 200 });
      test.mouseUp(new go.Point(200, 200), { timestamp: 300, clickCount: 2 });
    },
    function(test) {
      test.assert(test.diagram.nodes.count === 0, "created a node?");
    }
  ));

  tc.add(new Test("archetype", null,
    function(test) {
      test.diagram.model = new go.GraphLinksModel();  // clear out all old data
      test.diagram.toolManager.clickCreatingTool.archetypeNodeData =
          { text: "clicked", loc: new go.Point(100, 100) };
    },
    function(test) {
      test.assert(test.diagram.toolManager.clickCreatingTool.isDoubleClick,
                  "ClickCreatingTool.isDoubleClick should default to true");
      test.mouseDown(new go.Point(200, 200), { timestamp: 0 });  // there are no nodes!
      test.mouseUp(new go.Point(200, 200), { timestamp: 100 });
      test.mouseDown(new go.Point(200, 200), { timestamp: 200 });
      test.mouseUp(new go.Point(200, 200), { timestamp: 300, clickCount: 2 });
    },
    function(test) {
      test.assert(test.diagram.nodes.count === 1, "did not create a node");
      test.diagram.toolManager.clickCreatingTool.archetypeNodeData = null;
    }
  ));

  tc.add(new Test("archetype single click", null,
    function(test) {
      test.diagram.model = new go.GraphLinksModel();  // clear out all old data
      test.diagram.toolManager.clickCreatingTool.archetypeNodeData =
          { text: "clicked", loc: new go.Point(100, 100) };
      test.diagram.toolManager.clickCreatingTool.isDoubleClick = false;
    },
    function(test) {
      test.mouseDown(new go.Point(200, 200), { timestamp: 0 });  // there are no nodes!
      test.mouseUp(new go.Point(200, 200), { timestamp: 100 });
    },
    function(test) {
      test.assert(test.diagram.nodes.count === 1, "did not create a node");
      test.diagram.toolManager.clickCreatingTool.isDoubleClick = true;
      test.diagram.toolManager.clickCreatingTool.archetypeNodeData = null;
    }
  ));


  var tc = new TestCollection("ContextMenuTool");
  tcroot.add(tc);

  tc.add(new Test("context menu is set up", null,
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.defaultTouchContextMenu !== undefined);
      test.assert(test.diagram.toolManager.contextMenuTool.defaultTouchContextMenu !== null);
    },
    function(test) {

    },
    function(test) {

    }
  ));

  tc.add(new Test("context click", null,
    function(test) {

      function checkContextClick(e) {
        test.assert(e instanceof go.DiagramEvent, "didn't get DiagramEvent?");
        test.assert(e.name === "ObjectContextClicked", "wasn't ObjectContextClicked");
      }
      test.checkContextClick = checkContextClick;

      CommonSetupGraphLinks(test);
      test.diagram.contextMenu = diagramContextMenu;
      test.diagram.addDiagramListener("ObjectContextClicked", checkContextClick);

      var node = test.diagram.findNodeForKey(3);
      node.findObject("shape").fill = "gray";
      test.mouseDown(new go.Point(100, 100), { timestamp: 0, button: 2 });  // right mouse button on node N3
      test.mouseUp(new go.Point(100, 100), { timestamp: 100, button: 2 });
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu !== null, "there should be a context menu");
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu !== diagramContextMenu, "and it should not be the diagram's");
      test.mouseDown(new go.Point(135, 110), { timestamp: 1000 });  // left click on first context menu button
      test.mouseUp(new go.Point(135, 110), { timestamp: 1200 });
      test.diagram.removeDiagramListener("ObjectContextClicked", test.checkContextClick);
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu === null, "still has a context menu?");
      var node = test.diagram.findNodeForKey(3);
      test.assert(node.findObject("shape").fill === "orange",
                  "context menu command hasn't changed Shape.fill from gray to orange");
    }
  ));

  tc.add(new Test("context click handled", null,
    function(test) {

      function checkContextClick(e) {
        test.assert(e instanceof go.DiagramEvent, "didn't get DiagramEvent?");
        test.assert(e.name === "ObjectContextClicked", "wasn't ObjectContextClicked");
        e.diagram.lastInput.handled = true;  // don't show context menu Adornment
      }
      test.checkContextClick = checkContextClick;

      CommonSetupGraphLinks(test);
      test.diagram.contextMenu = diagramContextMenu;
      test.diagram.addDiagramListener("ObjectContextClicked", checkContextClick);

      var node = test.diagram.findNodeForKey(3);
      node.findObject("shape").fill = "gray";
      test.mouseDown(new go.Point(100, 100), { timestamp: 0, button: 2 });  // right mouse button on node N3
      test.mouseUp(new go.Point(100, 100), { timestamp: 100, button: 2 });
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu === null, "there should not be a context menu");
      test.diagram.removeDiagramListener("ObjectContextClicked", test.checkContextClick);
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu === null, "still has a context menu?");
    }
  ));

  tc.add(new Test("background context click", null,
    function(test) {

      function checkContextClick(e) {
        test.assert(e instanceof go.DiagramEvent, "didn't get DiagramEvent?");
        test.assert(e.name === "ObjectContextClicked", "wasn't ObjectContextClicked");
      }
      test.checkContextClick = checkContextClick;

      CommonSetupGraphLinks(test);
      test.diagram.contextMenu = diagramContextMenu;
      test.diagram.addDiagramListener("ObjectContextClicked", checkContextClick);

      var node = test.diagram.findNodeForKey(1);
      node.isSelected = true;
      test.mouseDown(new go.Point(0, 90), { timestamp: 0, button: 2 });  // right mouse button in background
      test.mouseUp(new go.Point(0, 90), { timestamp: 100, button: 2 });
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu !== null, "there should be a context menu");
      test.mouseDown(new go.Point(15, 97), { timestamp: 1000 });  // left click on first context menu button
      test.mouseUp(new go.Point(15, 97), { timestamp: 1200 });
      test.diagram.removeDiagramListener("ObjectContextClicked", test.checkContextClick);
    },
    function(test) {
      test.assert(test.diagram.toolManager.contextMenuTool.currentContextMenu === null, "still has a context menu?");
      test.assert(test.diagram.nodes.count === 2 && test.diagram.findNodeForKey(1) === null,
                  "context menu Cut command should have deleted N1");
    }
  ));

  var tc = new TestCollection("ResizingTool");
  tcroot.add(tc);

  tc.add(new Test("updating", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.diagram.select(node);
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(node.adornments.count === 3, "expecting three kinds of Adornments, not:  " + node.adornments.count);

      test.diagram.commit(function() {
        node.resizable = false;
      });
      test.assert(node.adornments.count === 2, "expecting two kinds of Adornments for not-resizable Node, not:  " + node.adornments.count);

      test.diagram.commit(function() {
        node.resizable = true;
        test.diagram.allowResize = false;
      });
      test.assert(node.adornments.count === 2, "expecting two kinds of Adornments for not-allowResize Diagram, not:  " + node.adornments.count);

      test.diagram.commit(function() {
        test.diagram.allowResize = true;
        node.visible = false;
      });
      test.assert(node.adornments.count === 0, "expecting zero Adornments for not-visible Node, not: " + node.adornments.count);
    }
  ));

  tc.add(new Test("top left handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(-15, 35), { timestamp: 1000 });  // resize node N1 with top left corner resize adornment
      test.mouseMove(new go.Point(-25, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(-25, 15), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(node.findAdornment("Resizing") !== null, "no Resizing Adornment");
      test.assert(test.isApproxPoint(node.location, new go.Point(-5, 40)), "node's location is " + node.location + "instead of (-5,40)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 50)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,50)");
    }
  ));

  tc.add(new Test("top right handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(15, 35), { timestamp: 1000 });  // resize node N1 with top right corner resize adornment
      test.mouseMove(new go.Point(25, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(25, 15), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(4.75, 40)), "node's location is " + node.location + "instead of (4.75,40)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 50)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,50)");
    }
  ));

  tc.add(new Test("bottom right handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(15, 65), { timestamp: 1000 });  // resize node N1 with bottom right corner resize adornment
      test.mouseMove(new go.Point(25, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(25, 85), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(5, 60)), "node's location is " + node.location + "instead of (5,60)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 50)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,50)");
    }
  ));

  tc.add(new Test("bottom left handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(-15, 65), { timestamp: 1000 });  // resize node N1 with bottom left corner resize adornment
      test.mouseMove(new go.Point(-25, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(-25, 85), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(-5, 60)), "node's location is " + node.location + "instead of (-5,60)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 50)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,50)");
    }
  ));

  tc.add(new Test("uniform left handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      node.resizeObject.geometryStretch = go.GraphObject.Uniform;
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(-15, 50), { timestamp: 1000 });  // resize node N1 with left side resize adornment
      test.mouseMove(new go.Point(-25, 55), { timestamp: 1200 });
      test.mouseUp(new go.Point(-25, 55), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(-5.25, 50)), "node's location is " + node.location + "instead of (-5.25,50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40, 40)");
    }
  ));

  tc.add(new Test("uniform top handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      node.resizeObject.geometryStretch = go.GraphObject.Uniform;
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(0, 35), { timestamp: 1000 });  // resize node N1 with top side resize adornment
      test.mouseMove(new go.Point(5, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(5, 25), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(0, 44.75)), "node's location is " + node.location + "instead of (0,44.75)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40, 40)");
    }
  ));

  tc.add(new Test("uniform right handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      node.resizeObject.geometryStretch = go.GraphObject.Uniform;
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(15, 50), { timestamp: 1000 });  // resize node N1 with right side resize adornment
      test.mouseMove(new go.Point(25, 55), { timestamp: 1200, modifiers: 4 });  // use shift key to dictate uniform
      test.mouseUp(new go.Point(25, 55), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(4.75, 50)), "node's location is " + node.location + "instead of (4.75,50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40, 40)");
    }
  ));

  tc.add(new Test("uniform bottom handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      node.resizeObject.geometryStretch = go.GraphObject.Uniform;
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(0, 65), { timestamp: 1000 });  // resize node N1 with bottom side resize adornment
      test.mouseMove(new go.Point(5, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(5, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(0, 54.75)), "node's location is " + node.location + "instead of (0,54.75)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40, 40)");
    }
  ));

  tc.add(new Test("uniform bottom right handle", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      node.resizeObject.geometryStretch = go.GraphObject.Uniform;
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(15, 65), { timestamp: 1000 });  // resize node N1 with bottom side resize adornment
      test.mouseMove(new go.Point(25, 80), { timestamp: 1200 });
      test.mouseUp(new go.Point(25, 80), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(4.75, 54.75)), "node's location is " + node.location + "instead of (4.75,54.75)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,40)");
    }
  ));

  tc.add(new Test("bottom right handle no reshape", null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.toolManager.resizingTool.computeReshape = function() { return false; };
      test.mouseDown(new go.Point(0, 50), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(0, 50), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(15, 65), { timestamp: 1000 });  // resize node N1 with bottom side resize adornment
      test.mouseMove(new go.Point(25, 80), { timestamp: 1200 });
      test.mouseUp(new go.Point(25, 80), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(4.75, 54.75)), "node's location is " + node.location + "instead of (4.75,54.75)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,40)");
    }
  ));

  function CommonSetupNoReshapeMinMaxSizes(test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node,
        { resizable: true, resizeObjectName: "SHAPE", location: new go.Point(50, 50) },
        $(go.Shape, "Rectangle",
          {
            name: "SHAPE", strokeWidth: 0, fill: "red",
            desiredSize: new go.Size(100, 50), minSize: new go.Size(50, 40), maxSize: new go.Size(110, 80)
          }
        )
      );
    diagram.model = new go.GraphLinksModel([{ key: 1 }],[]);
    diagram.toolManager.resizingTool.computeReshape = function() { return false; };
  }

  tc.add(new Test("top left, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(70, 60)), "node's location is " + node.location + "instead of (70, 60)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("top left, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(0, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(0, 25), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(40, 45)), "node's location is " + node.location + "instead of (40, 45)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("top middle, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(100, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(60, 60)), "node's location is " + node.location + "instead of (60, 60)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("top middle, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(100, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 25), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(45, 45)), "node's location is " + node.location + "instead of (45, 45)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("top right, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 60)), "node's location is " + node.location + "instead of (50, 60)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("top right, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 50), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(200, 25), { timestamp: 1200 });
      test.mouseUp(new go.Point(200, 25), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 45)), "node's location is " + node.location + "instead of (50, 45)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("right middle, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 75), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 55)), "node's location is " + node.location + "instead of (50, 55)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("right middle, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 75), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(200, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(200, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 47.5)), "node's location is " + node.location + "instead of (50, 47.5)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("bottom right, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 50)), "node's location is " + node.location + "instead of (50, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("bottom right, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(200, 125), { timestamp: 1200 });
      test.mouseUp(new go.Point(200, 125), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(50, 50)), "node's location is " + node.location + "instead of (50, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("bottom middle, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(60, 50)), "node's location is " + node.location + "instead of (60, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("bottom middle, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(100, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 125), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 125), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(45, 50)), "node's location is " + node.location + "instead of (45, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("bottom left, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(70, 50)), "node's location is " + node.location + "instead of (70, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("bottom left, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 100), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(0, 125), { timestamp: 1200 });
      test.mouseUp(new go.Point(0, 125), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(40, 50)), "node's location is " + node.location + "instead of (40, 50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("left middle, no reshape, minSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 75), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(100, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(70, 55)), "node's location is " + node.location + "instead of (70, 55)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(80, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (80, 40)");
    }
  ));

  tc.add(new Test("left middle, no reshape, maxSize", null,
    function(test) {
      CommonSetupNoReshapeMinMaxSizes(test);
      var node = test.diagram.findNodeForKey(1);
      var shape = node.resizeObject;
      test.assert(shape instanceof go.Shape, "Node " + node + "'s resizeObject is not a Shape.");
      test.mouseDown(new go.Point(100, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(50, 75), { timestamp: 1000 });  // resize node N1 with top left resize adornment
      test.mouseMove(new go.Point(0, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(0, 75), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(40, 47.5)), "node's location is " + node.location + "instead of (40, 47.5)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(110, 55)), "node's size is " + node.resizeObject.desiredSize + "instead of (110, 55)");
    }
  ));

  tc.add(new Test("resizing when rotated", null,
    function(test) {
      SimpleSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.Center;
      node.location = new go.Point(100, 100);
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(100, 100), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(175, 100), { timestamp: 1000 });  // rotate node N1 to 90 degrees
      test.mouseMove(new go.Point(100, 200), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 200), { timestamp: 1400 });
      test.mouseDown(new go.Point(75, 75), { timestamp: 1000 });  // resize node N1 using the topleft handle
      test.mouseMove(new go.Point(50, 50), { timestamp: 1200 });
      test.mouseUp(new go.Point(50, 50), { timestamp: 1400 });
      test.mouseDown(new go.Point(125, 125), { timestamp: 1000 });  // resize node N1 using the bottomright handle
      test.mouseMove(new go.Point(150, 150), { timestamp: 1200 });
      test.mouseUp(new go.Point(150, 150), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApprox(node.angle, 0), "Node " + node + "'s angle is " + node.angle + " instead of 0");
      test.assert(test.isApprox(node.rotateObject.angle, 90), "Node " + node + "'s rotateObject's angle is " + node.angle + " instead of 90");
      test.assert(test.isApproxPoint(node.location, new go.Point(100, 100)), "node's location is " + node.location + " instead of (100,100)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(100, 100)), "node's size is " + node.resizeObject.desiredSize + " instead of (100,100)");
    }
  ));

  tc.add(new Test("resizing with nested location", null,
    function(test) {
      NestedSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.BottomLeft;
      node.location = new go.Point(100, 100);
      test.mouseDown(new go.Point(125, 100), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(125, 100), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(200, 100), { timestamp: 1000 });  // rotate node N1 to 90 degrees
      test.mouseMove(new go.Point(100, 200), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 200), { timestamp: 1400 });
      test.mouseDown(new go.Point(75, 100), { timestamp: 1000 });  // resize node N1 using the topleft handle
      test.mouseMove(new go.Point(50, 75), { timestamp: 1200 });
      test.mouseUp(new go.Point(50, 75), { timestamp: 1400 });
      test.mouseDown(new go.Point(125, 150), { timestamp: 1000 });  // resize node N1 using the bottomright handle
      test.mouseMove(new go.Point(150, 175), { timestamp: 1200 });
      test.mouseUp(new go.Point(150, 175), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApprox(node.rotateObject.angle, 90), "Node " + node + "'s rotateObject's angle is " + node.angle + " instead of 90");
      test.assert(test.isApproxPoint(node.location, new go.Point(124, 75)), "node's location is " + node.location + " instead of (124,75)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(100, 100)), "node's size is " + node.resizeObject.desiredSize + " instead of (100,100)");
    }
  ));

  tc.add(new Test("cell size on Part", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.resizeCellSize = new go.Size(10, 10); // this should be prioritized
      test.diagram.toolManager.resizingTool.cellSize = new go.Size(3, 3); // this should be ignored
      test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(4, 4); // this should be ignored
      node.isSelected = true;
    },
    function(test) {
      test.mouseDown(new go.Point(15, 50), { timestamp: 1000 });  // resize node N1 with MiddleRight handle
      test.mouseMove(new go.Point(22, 50), { timestamp: 1200 });
      test.mouseUp(new go.Point(22, 50), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(5, 50)), "node's location is " + node.location + "instead of (5,50)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(40, 30)), "node's size is " + node.resizeObject.desiredSize + "instead of (40,30)");
    }
  ));

  tc.add(new Test("cell size on resizingTool", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.diagram.toolManager.resizingTool.cellSize = new go.Size(10, 10); // this should be prioritized
      test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(4, 4); // this should be ignored
      node.isSelected = true;
    },
    function(test) {
      test.mouseDown(new go.Point(0, 65), { timestamp: 1000 });  // resize node N1 with MiddleRight handle
      test.mouseMove(new go.Point(0, 77), { timestamp: 1200 });
      test.mouseUp(new go.Point(0, 77), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(0, 55)), "node's location is " + node.location + "instead of (0,55)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(30, 40)), "node's size is " + node.resizeObject.desiredSize + "instead of (30,40)");
    }
  ));

  tc.add(new Test("cell size on draggingTool", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      test.diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(10, 10);
      node.isSelected = true;
    },
    function(test) {
      test.mouseDown(new go.Point(0, 65), { timestamp: 1000 });  // resize node N1 with MiddleRight handle
      test.mouseMove(new go.Point(0, 77), { timestamp: 1200 });
      test.mouseUp(new go.Point(0, 77), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxPoint(node.location, new go.Point(0, 56)), "node's location is " + node.location + "instead of (0,56)");
      test.assert(test.isApproxSize(node.resizeObject.desiredSize, new go.Size(30, 42)), "node's size is " + node.resizeObject.desiredSize + "instead of (30,42)");
    }
  ));


  tc.add(new Test("resizing group when gridsnap", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.layout = $(go.TreeLayout);
      diagram.toolManager.draggingTool.isGridSnapEnabled = true;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Rectangle",
            { fill: "white", portId: "", cursor: "pointer", fromLinkable: true, toLinkable: true }),
          $(go.TextBlock, { margin: 5 },
            new go.Binding("text", "key"))
        );

      // each Group is a "swimlane" with a header on the left and a resizable lane on the right
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          { resizable: true, resizeObjectName: "BODY", selectionObjectName: "BODY" },
          { layout: $(go.TreeLayout) },
          $(go.Shape, { height: 14.3, fill: "green", stretch: go.GraphObject.Horizontal }),
          $(go.Panel, "Auto", { name: "BODY" },
            $(go.Shape, { fill: "lightgray" }),
            $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 10 })
          ),
          $(go.TextBlock, new go.Binding("text"))
        );

      diagram.model = new go.GraphLinksModel(
        [ // node data
          { key: 0, text: "Zero", loc: "0 0", group: 11 },
          { key: 1, text: "One", loc: "200 50", group: 11 },
          { key: 11, text: "Inner Group", isGroup: true, group: 12 },
          { key: 12, text: "Outer Group", isGroup: true }
        ],
        [ // link data
          { from: 0, to: 1 },
        ]);

      diagram.findNodeForKey(11).isSelected = true;
    },
    function(test) {
      var diagram = test.diagram;
      var group = diagram.findNodeForKey(11);
      var origGroupBottom = group.selectionObject.getDocumentPoint(go.Spot.Bottom);

      var link = diagram.findNodeForKey(0).linksConnected.first();
      var origLink0 = link.getPoint(0).copy();

      test.mouseDown(new go.Point(64.5, 86.9), { timestamp: 1000 });  // resize GROUP with MiddleBottom handle
      test.mouseMove(new go.Point(64.5, 96.9), { timestamp: 1100 });
      test.mouseMove(new go.Point(64.5, 106.9), { timestamp: 1200 });
      test.mouseMove(new go.Point(64.5, 96.9), { timestamp: 1300 });
      test.mouseMove(new go.Point(64.5, 116.9), { timestamp: 1350 });
      test.mouseMove(new go.Point(64.5, 126.9), { timestamp: 1400 });
      test.mouseMove(new go.Point(64.5, 116.9), { timestamp: 1425 });
      test.mouseMove(new go.Point(64.5, 106.9), { timestamp: 1450 });
      test.mouseMove(new go.Point(64.5, 96.9), { timestamp: 1500 });
      test.mouseMove(new go.Point(64.5, 116.9), { timestamp: 1525 });
      test.mouseMove(new go.Point(64.5, 126.9), { timestamp: 1550 });
      test.mouseUp(new go.Point(64.5, 146.9), { timestamp: 1600 });

      var newLink0 = link.getPoint(0).copy();
      test.assert(this.isApproxPoint(origLink0, newLink0), "link point 0 moved");
    }
  ));

  tc.add(new Test("resizing group undo redo", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.initialContentAlignment = go.Spot.Center;
      diagram.toolManager.draggingTool.isGridSnapEnabled = true;

      diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          locationSpot: go.Spot.Center, locationObjectName: "SHAPE",
          desiredSize: new go.Size(120, 60), minSize: new go.Size(40, 40),
          resizable: true, resizeCellSize: new go.Size(20, 20)
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.Shape,
          { // the border
            name: "SHAPE", fill: "white",
            portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true,
            fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
          },
          new go.Binding("figure"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")),
        // this Shape prevents mouse events from reaching the middle of the port
        $(go.Shape, { width: 100, height: 40, strokeWidth: 0, fill: "transparent" }),
        $(go.TextBlock,
          { margin: 1, textAlign: "center", overflow: go.TextBlock.OverflowEllipsis, editable: true },
          // this Binding is TwoWay due to the user editing the text with the TextEditingTool
          new go.Binding("text").makeTwoWay(),
          new go.Binding("stroke", "color"))
      );
      // each Group is a "swimlane" with a header on the left and a resizable lane on the right
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          { resizable: true, resizeObjectName: "BODY", selectionObjectName: "BODY" },
          { layout: $(go.TreeLayout) },
          $(go.Shape, { height: 14.3, fill: "green", stretch: go.GraphObject.Horizontal }),
          $(go.Panel, "Auto", { name: "BODY" },
            $(go.Shape, { fill: "lightgray" }),
            $(go.Placeholder, { alignment: go.Spot.TopLeft, padding: 10 })
          ),
          $(go.TextBlock, new go.Binding("text"))
        );

      diagram.model = new go.GraphLinksModel(
        [ // node data
          {"key":3, "loc":"0 100", "text":"Gamma", "color":"green", "figure":"Cylinder1"}
        ],
        [
        ]);
        diagram.findNodeForKey(3).isSelected = true;
    },
    function(test) {
      var diagram = test.diagram;
      var d = test.diagram;
      var m = test.diagram.model;
      var mgr = m.undoManager;
      mgr.isEnabled = true;
      // var group = diagram.findNodeForKey(11);
      // var origGroupBottom = group.selectionObject.getDocumentPoint(go.Spot.Bottom);

      var node = diagram.findNodeForKey(3);

      test.assert(node.position.toString() === "Point(-60,70)");
      test.assert(node.location.toString() === "Point(0,100)");
      test.assert(node.desiredSize.toString() === "Size(120,60)");
      test.mouseDown(new go.Point(60, 100), { timestamp: 1000 });  // resize node with mid right handle
      test.mouseMove(new go.Point(80, 100), { timestamp: 1100 });
      test.mouseUp(new go.Point(80, 100), { timestamp: 1200 });
      test.assert(node.position.toString() === "Point(-60,70)");
      test.assert(node.location.toString() === "Point(10,100)");
      test.assert(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo();
      test.assert(node.position.toString() === "Point(-60,70)");
      test.assert(node.location.toString() === "Point(0,100)");
      test.assert(node.desiredSize.toString() === "Size(120,60)");
      mgr.redo();
      test.assert(node.position.toString() === "Point(-60,70)");
      test.assert(node.location.toString() === "Point(10,100)");
      test.assert(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo(); // now start over:

      test.mouseDown(new go.Point(-60, 100), { timestamp: 1000 }); // resize node with mid left handle
      test.mouseMove(new go.Point(-80, 100), { timestamp: 1100 });
      test.mouseUp(new go.Point(-80, 100), { timestamp: 1200 });
      test.assert(node.position.toString() === "Point(-80,70)");
      test.assert(node.location.toString() === "Point(-10,100)");
      test.assert(node.desiredSize.toString() === "Size(140,60)");
      mgr.undo();
      test.assert(node.position.toString() === "Point(-60,70)");
      test.assert(node.location.toString() === "Point(0,100)");
      test.assert(node.desiredSize.toString() === "Size(120,60)");
      mgr.redo();
      test.assert(node.position.toString() === "Point(-80,70)");
      test.assert(node.location.toString() === "Point(-10,100)");
      test.assert(node.desiredSize.toString() === "Size(140,60)");

    }
  ));


  var tc = new TestCollection("RotatingTool");
  tcroot.add(tc);

  tc.add(new Test("simulated user rotation", null,
    function(test) {
      SimpleSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.BottomLeft;
      node.location = new go.Point(100, 100);
      test.mouseDown(new go.Point(125, 75), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(125, 75), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(200, 100), { timestamp: 1000 });  // drag the rotate adornment
      test.mouseMove(new go.Point(100, 200), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 200), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(node.findAdornment("Rotating") !== null, "no Rotating Adornment");
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(100, 100, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (100,100,51,51)");
    }
  ));

  tc.add(new Test("custom locationSpot", null,
    function(test) {
      SimpleSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = new go.Spot(1, 0.5, -50, 0);
      node.location = new go.Point(100, 100);
      test.mouseDown(new go.Point(125, 100), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(125, 100), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(200, 100), { timestamp: 1000 });  // drag the rotate adornment
      test.mouseMove(new go.Point(100, 200), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 200), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      // not 75, 99 because the -50 offset doesn't account for strokewidth!
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 99, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,100,51,51)");
    }
  ));

  tc.add(new Test("nested locationObject", null,
    function(test) {
      NestedSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.BottomRight;
      node.location = new go.Point(100, 100);
      test.mouseDown(new go.Point(75, 87.5), { timestamp: 0 });  // select node N1
      test.mouseUp(new go.Point(75, 87.5), { timestamp: 100 });
    },
    function(test) {
      test.mouseDown(new go.Point(150, 100), { timestamp: 1000 });  // drag the rotate adornment
      test.mouseMove(new go.Point(100, 200), { timestamp: 1200 });
      test.mouseUp(new go.Point(100, 200), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(75, 49, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,49,51,51)");
    }
  ));

  tc.add(new Test("snap angle before multiple", null,
    function(test) {
      SimpleSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.TopLeft;
      node.location = new go.Point(100, 100);
      var rotatingTool = test.diagram.toolManager.rotatingTool;
      rotatingTool.snapAngleMultiple = 90;
      rotatingTool.snapAngleEpsilon = 30;
      node.isSelected = true;  // select node N1
    },
    function(test) {
      test.mouseDown(new go.Point(200, 100), { timestamp: 1000 });  // drag the rotate adornment slightly before the snap multiple
      test.mouseMove(new go.Point(90, 250), { timestamp: 1200 });
      test.mouseUp(new go.Point(90, 250), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApprox(node.rotateObject.angle, 90), "Node " + node + "'s rotateObject's angle is " + node.angle + " instead of 90");
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(49, 100, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (49,100,51,51)");
    }
  ));

  tc.add(new Test("snap angle after multiple", null,
    function(test) {
      SimpleSetupGraphLinks(test);
      var node = test.diagram.findNodeForKey(1);
      node.locationSpot = go.Spot.TopLeft;
      node.location = new go.Point(100, 100);
      var rotatingTool = test.diagram.toolManager.rotatingTool;
      rotatingTool.snapAngleMultiple = 90;
      rotatingTool.snapAngleEpsilon = 30;
      node.isSelected = true;  // select node N1
    },
    function(test) {
      test.mouseDown(new go.Point(200, 100), { timestamp: 1000 });  // drag the rotate adornment slightly after the snap multiple
      test.mouseMove(new go.Point(110, 250), { timestamp: 1200 });
      test.mouseUp(new go.Point(110, 250), { timestamp: 1400 });
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApprox(node.rotateObject.angle, 90), "Node " + node + "'s rotateObject's angle is " + node.angle + " instead of 90");
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(49, 100, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (49,100,51,51)");
    }
  ));

  function setupRotationSpots(test) {
    var diag = test.diagram;
    diag.reset();
    diag.nodeTemplate =
      $(go.Node, "Auto",
        { rotatable: true, resizable: true, width: 60, height: 40 },
        new go.Binding("locationObjectName"),
        new go.Binding("location"),
        new go.Binding("locationSpot"),
        new go.Binding("rotateObjectName"),
        new go.Binding("resizeObjectName"),
        new go.Binding("rotationSpot"),
        $(go.Shape, { name: "SHAPE", fill: "lightgray" }),
        $(go.TextBlock, { name: "TEXTBLOCK" }, new go.Binding("text"))
      );

    diag.model = new go.GraphLinksModel([
      { key: 1, text: "(default)", location: new go.Point(  0, 0) },
      { key: 2, text: "lC", location: new go.Point(200, 0), locationSpot: go.Spot.Center },
      { key: 3, text: "rBL", location: new go.Point(400, 0), rotationSpot: go.Spot.BottomLeft },
      { key: 4, text: "lC rBL", location: new go.Point(0, 100), locationSpot: go.Spot.Center, rotationSpot: go.Spot.BottomLeft },
      { key: 5, text: "lBR rTL", location: new go.Point(200, 100), locationSpot: go.Spot.BottomRight, rotationSpot: go.Spot.TopLeft },
      { key: 6, text: "rCust", location: new go.Point(400, 100), rotationSpot: new go.Spot(0.75, 0.25, -2, 2) },
      { key: 7, text: "(default)", location: new go.Point(0, 200), locationObjectName: "SHAPE" },
      { key: 8, text: "lC", location: new go.Point(200, 200), locationSpot: go.Spot.Center, locationObjectName: "SHAPE" },
      { key: 9, text: "rBL", location: new go.Point(400, 200), rotationSpot: go.Spot.BottomLeft, locationObjectName: "SHAPE" },
      { key: 10, text: "lC rBL", location: new go.Point(0, 300), locationSpot: go.Spot.Center, rotationSpot: go.Spot.BottomLeft, locationObjectName: "SHAPE" },
      { key: 11, text: "lBR rTL", location: new go.Point(200, 300), locationSpot: go.Spot.BottomRight, rotationSpot: go.Spot.TopLeft, locationObjectName: "SHAPE" },
      { key: 12, text: "rCust", location: new go.Point(400, 300), rotationSpot: new go.Spot(0.75, 0.25, -2, 2), locationObjectName: "SHAPE" },
    ]);
  }

  tc.add(new Test("rotationSpot", null,
    function(test) {
      var diag = test.diagram;
      setupRotationSpots(test);
      diag.commandHandler.selectAll();
      test.adpts = [
        new go.Point(110, 0), new go.Point(280, 0), new go.Point(510, 40),
        new go.Point(80, 120), new go.Point(250, 60), new go.Point(510, 112),
        new go.Point(110, 200), new go.Point(280, 200), new go.Point(510, 240),
        new go.Point(80, 320), new go.Point(250, 260), new go.Point(510, 312)
      ];
    },
    function(test) {
      var diag = test.diagram;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i];
        var a1 = diag.findNodeForKey(i+1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "before " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }

      var t = 0;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i].copy();
        test.mouseDown(p, { timestamp: t });
        t += 100;
        p.x -= 25;
        p.y += 62;
        test.mouseMove(p, { timestamp: t });
        t += 100;
        p.x -= 25;
        p.y += 124;
        test.mouseUp(p, { timestamp: t });
        t += 100;
      }
    },
    function(test) {
      var diag = test.diagram;
      //for (var i = 0; i < test.adpts.length; i++) {
      //  var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
      //  console.log(a1.location.toString())
      //}
      var rotpts = [
        new go.Point(34, 105), new go.Point(213, 79), new go.Point(434, 145),
        new go.Point(4, 225), new go.Point(174, 165), new go.Point(449, 179),
        new go.Point(34, 305), new go.Point(213, 279), new go.Point(434, 345),
        new go.Point(4, 425), new go.Point(174, 365), new go.Point(449, 379)
      ];
      for (var i = 0; i < rotpts.length; i++) {
        var p = rotpts[i];
        var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "after " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }
    }
  ));

  tc.add(new Test("RotatingTool.handleAngle", null,
    function(test) {
      var diag = test.diagram;
      setupRotationSpots(test);
      diag.toolManager.rotatingTool.handleAngle = -90;
      diag.commandHandler.selectAll();
      test.adpts = [
        new go.Point(0, -50), new go.Point(200, -70), new go.Point(400, -50),
        new go.Point(-30, 30), new go.Point(140, 10), new go.Point(443, 50),
        new go.Point(0, 150), new go.Point(200, 130), new go.Point(400, 150),
        new go.Point(-30, 230), new go.Point(140, 210), new go.Point(443, 250)
      ];
      //for (var i = 0; i < test.adpts.length; i++) {
      //  var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
      //  console.log(a1.location.toString())
      //}
    },
    function(test) {
      var diag = test.diagram;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i];
        var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "before " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }

      var t = 0;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i].copy();
        test.mouseDown(p, { timestamp: t });
        t += 100;
        p.x += 62;
        p.y += 25;
        test.mouseMove(p, { timestamp: t });
        t += 100;
        p.x += 124;
        p.y += 25;
        test.mouseUp(p, { timestamp: t });
        t += 100;
      }
    },
    function(test) {
      var diag = test.diagram;
      //for (var i = 0; i < test.adpts.length; i++) {
      //  var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
      //  console.log(a1.location.toString())
      //}
      var rotpts = [
        new go.Point(50, 0), new go.Point(269.6, -7.5), new go.Point(488, 21),
        new go.Point(58, 101), new go.Point(190, 60), new go.Point(505, 108),
        new go.Point(50, 200), new go.Point(269.6, 192.5), new go.Point(488, 221),
        new go.Point(58, 301), new go.Point(190, 260), new go.Point(505, 308)
      ];
      for (var i = 0; i < rotpts.length; i++) {
        var p = rotpts[i];
        var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "after " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }
    }
  ));

  tc.add(new Test("RotatingTool.handleDistance", null,
    function(test) {
      var diag = test.diagram;
      setupRotationSpots(test);
      diag.toolManager.rotatingTool.handleAngle = -90;
      diag.toolManager.rotatingTool.handleDistance = 30;
      diag.commandHandler.selectAll();
      test.adpts = [
        new go.Point(0, -30), new go.Point(200, -50), new go.Point(400, -30),
        new go.Point(-30, 50), new go.Point(140, 30), new go.Point(443, 70),
        new go.Point(0, 170), new go.Point(200, 150), new go.Point(400, 170),
        new go.Point(-30, 250), new go.Point(140, 230), new go.Point(443, 270)
      ];
      //for (var i = 0; i < test.adpts.length; i++) {
      //  var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
      //  console.log(a1.location.toString())
      //}
    },
    function(test) {
      var diag = test.diagram;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i];
        var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "before " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }

      var t = 0;
      for (var i = 0; i < test.adpts.length; i++) {
        var p = test.adpts[i].copy();
        test.mouseDown(p, { timestamp: t });
        t += 100;
        p.x += 62;
        p.y += 15;
        test.mouseMove(p, { timestamp: t });
        t += 100;
        p.x += 124;
        p.y += 15;
        test.mouseUp(p, { timestamp: t });
        t += 100;
      }
    },
    function(test) {
      var diag = test.diagram;
      //for (var i = 0; i < test.adpts.length; i++) {
      //  var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
      //  console.log(a1.location.toString())
      //}
      var rotpts = [
        new go.Point(30, 0), new go.Point(249.6, -5), new go.Point(468, 25),
        new go.Point(38, 105), new go.Point(170, 60), new go.Point(485, 109),
        new go.Point(30, 200), new go.Point(249.6, 194.5), new go.Point(468.4, 225),
        new go.Point(38.4, 305), new go.Point(170, 260), new go.Point(485, 309)
      ];
      for (var i = 0; i < rotpts.length; i++) {
        var p = rotpts[i];
        var a1 = diag.findNodeForKey(i + 1).findAdornment("Rotating");
        test.assert(a1 && a1.location.equalsApprox(p), "after " + i + ", rotate handle at " + a1.location.toString() + ", should be at " + p.toString())
      }
    }
  ));


  var tc = new TestCollection("LinkReshapingTool");
  tcroot.add(tc);

  tc.add(new Test("Unreshapable Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad === null, "there should be no LinkReshapingTool Adornment on the link: " + link);
    },
    function(test) {
    }
  ));

  tc.add(new Test("Resegmentable straight Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.reshapable = true;
      link.resegmentable = true;
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 1, "there should be a LinkReshapingTool Adornment on the link, with one handle: " + link);
      test.mouseDown(new go.Point(50, 25), { timestamp: 500 });
      test.mouseMove(new go.Point(70, 45), { timestamp: 600 });
      test.mouseUp(new go.Point(100, 75), { timestamp: 700 });
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment on the link, with three handles: " + link);
      test.assert(link.points.length === 3, "route isn't three points two segments");
    }
  ));

  tc.add(new Test("Remove segment from crooked Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.startTransaction("setup");
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.reshapable = true;
      link.resegmentable = true;
      link.isSelected = true;
      test.diagram.commitTransaction("setup");
      test.diagram.startTransaction("change route");
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      var pts = link.points.copy();
      pts.insertAt(1, new go.Point(100, 75));
      link.points = pts;
      test.diagram.commitTransaction("change route");
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.clearAdornments();
      link.updateAdornments();
      test.assert(link.points.length === 3, "route isn't three points two segments");
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment on the link, with three handles: " + link);
      test.mouseDown(new go.Point(100, 75), { timestamp: 500 });
      test.mouseMove(new go.Point(70, 45), { timestamp: 600 });
      test.mouseUp(new go.Point(51, 26), { timestamp: 700 });
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.length === 2, "route isn't two points one segment");
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 1, "there should be a LinkReshapingTool Adornment on the link, with one handle: " + link);
    }
  ));

  tc.add(new Test("Resegmentable ortho Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.routing = go.Link.Orthogonal;
      link.reshapable = true;
      link.resegmentable = true;
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 6, "link does not have 6 points 5 segments");
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment with three handles: " + link);
      test.mouseDown(new go.Point(50, 0), { timestamp: 500 });
      test.mouseMove(new go.Point(60, 5), { timestamp: 600 });
      test.mouseUp(new go.Point(70, 10), { timestamp: 700 });
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 6, "link no longer has 6 points 5 segments");
      test.assertLinkPoints(link, [new go.Point(15.5, 50), new go.Point(25.5, 50),
                                   new go.Point(70, 50), new go.Point(70, 0),
                                   new go.Point(74.5, 0), new go.Point(84.5, 0)]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment with three handles: " + link);
    }
  ));


  tc.add(new Test("Add segment ortho Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.routing = go.Link.Orthogonal;
      link.reshapable = true;
      link.resegmentable = true;
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 6, "link does not have 6 points 5 segments");
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment with three handles: " + link);
      test.mouseDown(new go.Point(50, 25), { timestamp: 500 });
      test.mouseMove(new go.Point(60, 5), { timestamp: 600 });
      test.mouseUp(new go.Point(20, 80), { timestamp: 700 });
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 8, "link should have 8 points 7 segments");
      test.assertLinkPoints(link, [new go.Point(15.5, 50), new go.Point(25.5, 50),
                                   new go.Point(50, 50), new go.Point(50, 80),
                                   new go.Point(20, 80), new go.Point(20, 0),
                                   new go.Point(74.5, 0), new go.Point(84.5, 0)]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 7, "there should be a LinkReshapingTool Adornment with seven handles: " + link);
    }
  ));

  tc.add(new Test("Remove segment ortho Link", null,
    function(test) {
      CommonSetupGraphLinks(test);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.routing = go.Link.Orthogonal;
      link.reshapable = true;
      link.resegmentable = true;
      link.isSelected = true;
      var pts = new go.List();
      pts.addAll([new go.Point(16, 50.5), new go.Point(26, 50.5),
                                   new go.Point(50.5, 50.5), new go.Point(50.5, 80),
                                   new go.Point(20, 80), new go.Point(20, 0.5),
                                   new go.Point(75, 0.5), new go.Point(85, 0.5)]);
      link.points = pts;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 8, "link does not have 8 points 6 segments");
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 7, "there should be a LinkReshapingTool Adornment with seven handles: " + link);
      test.mouseDown(new go.Point(20, 80), { timestamp: 500 });
      test.mouseMove(new go.Point(60, 5), { timestamp: 600 });
      test.mouseUp(new go.Point(51, 26), { timestamp: 700 });
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.points.count === 6, "link should have 6 points 5 segments");
      test.assertLinkPoints(link, [new go.Point(16, 50.5), new go.Point(26, 50.5),
                                   new go.Point(50.5, 50.5), new go.Point(50.5, 0.5),
                                   new go.Point(75, 0.5), new go.Point(85, 0.5)]);
      var ad = link.findAdornment("LinkReshaping");
      test.assert(ad !== null && ad.elements.count === 3, "there should be a LinkReshapingTool Adornment with three handles: " + link);
    }
  ));

  tc.add(new Test("Move Link Check sel Adornment", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          {width:90, height: 30},
          new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color")),
          $(go.TextBlock, { margin: 3 }, new go.Binding("text", "key"))
        );

      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          { selectable: true },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          { routing: go.Link.AvoidsNodes, curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4 },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape, { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );
      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [{ key: "Alpha", color: "lightblue", pos:"27 296" } ],
      [  { from: "Alpha", points:[117,311,127,311,158.5,311,158.5,359,190,359,200,359] } ]);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.diagram.select(link);

    },
    function(test) {
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.actualBounds.equals(new go.Rect(116, 310, 84, 53.5)));
      test.assert(link.adornments.first().actualBounds.equals(new go.Rect(115.5,309.5,84.5,51)));
      // move the link and make sure both its selection adornment and real geometry are in the right place
      test.mouseDown(new go.Point(160,310), { timestamp: 500 });
      test.mouseMove(new go.Point(245,307), { timestamp: 600 });
      test.mouseUp(new go.Point(245,307), { timestamp: 700 });
      test.assert(link.actualBounds.equals(new go.Rect(116,310,130,53.5)));
      test.assert(link.adornments.first().actualBounds.equals(new go.Rect(115.5,309.5,131,51)));
    }
  ));

  tc.add(new Test("Relink Check sel Adornment", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.toolManager.relinkingTool.isUnconnectedLinkValid = true;

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          {width:90, height: 30},
          new go.Binding('position', 'pos', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color")),
          $(go.TextBlock, { margin: 3 }, new go.Binding("text", "key"))
        );

      diagram.linkTemplate =
        $(go.Link,  // the whole link panel
          { selectable: true },
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          { routing: go.Link.AvoidsNodes, curve: go.Link.JumpOver,
            corner: 5, toShortLength: 4 },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape, { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );
      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [{ key: "Alpha", color: "lightblue", pos:"27 296" } ],
      [  { from: "Alpha", points:[117,311,127,311,158.5,311,158.5,359,190,359,200,359] } ]);
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.diagram.select(link);

    },
    function(test) {
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(link.actualBounds.equals(new go.Rect(116, 310, 84, 53.5)));
      test.assert(link.findAdornment("RelinkFrom") !== null && link.findAdornment("RelinkTo") !== null, "missing RelinkFrom and/or RelinkTo Adornment");
      test.assert(link.adornments.first().actualBounds.equals(new go.Rect(115.5,309.5,84.5,51)));
      // move the link and make sure both its selection adornment and real geometry are in the right place
      test.mouseDown(new go.Point(204,359), { timestamp: 500 });
      test.mouseMove(new go.Point(270,361), { timestamp: 600 });
      test.mouseUp(new go.Point(270,361), { timestamp: 700 });
      test.assert(link.actualBounds.equals(new go.Rect(116,310,154,55.5)));
      test.assert(link.adornments.first().actualBounds.equals(new go.Rect(115.5,309.5,154.5,53)));
    }
  ));

  tc.add(new Test("relinking disco toIncrementalData", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var $ = go.GraphObject.make;  // for conciseness in defining templates

      diag.toolManager.draggingTool.dragsLink = true;
      diag.toolManager.draggingTool.isGridSnapEnabled = true;
      diag.toolManager.linkingTool.archetypeLinkData = { color: "green" };
      diag.toolManager.linkingTool.isUnconnectedLinkValid = true;
      diag.toolManager.linkingTool.portGravity = 20;
      diag.toolManager.relinkingTool.isUnconnectedLinkValid = true;
      diag.toolManager.relinkingTool.portGravity = 20;
      diag.undoManager.isEnabled = true;
      diag.undoManager.maxHistoryLimit = 0;

      diag.nodeTemplate =
        $(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // the main object is a Panel that surrounds a TextBlock with a Shape
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",  // default figure
              {
                portId: "", // the default port: if no spot on link data, use closest side
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  // default color
                strokeWidth: 2
              },
              new go.Binding("fill")),
            $(go.TextBlock,
              {
                font: "bold 11pt Helvetica, Arial, sans-serif",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit
              },
              new go.Binding("text"))
          )
        );

      diag.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,
            { isPanelMain: true, strokeWidth: 2 },
            new go.Binding("stroke", "color")),
          $(go.Shape,
            { toArrow: "Standard", stroke: null },
            new go.Binding("fill", "color"))
        );

      diag.model = $(go.GraphLinksModel,
        {
          "linkKeyProperty": "key",
          "nodeDataArray": [ {"text":"Step", "key":-2, "loc":"-50 -120"} ],
          "linkDataArray": [ {"color":"green", "from":-2, "fromPort":"", "toPort":"", "key":-1, "points":[-50,-102.54999999999998,-50,-92.54999999999998,-50,-62.108335876464835,26.333328247070312,-62.108335876464835,26.333328247070312,-31.666671752929688,26.333328247070312,-21.666671752929688]} ]
        });

      diag.links.first().isSelected = true;

      test._listened = false;
    },
    function(test) {
      var diag = test.diagram;
      diag.addModelChangedListener(function(e) {
        if (e.isTransactionFinished && e.oldValue === "Relinking") {
          test._listened = true;
          var json = e.model.toIncrementalData(e);
          test.assert(json && json.modifiedLinkData && json.modifiedLinkData.length === 1, "should have json.modifiedLinkData[0]");
        }
      });

      var p = diag.links.first().points.last().copy();
      test.mouseDown(p, { timestamp: 500 });
      p.offset(20, 20);
      test.mouseMove(p, { timestamp: 600 });
      p.offset(20, 20);
      test.mouseUp(p, { timestamp: 700 });
    },
    function(test) {
      test.assert(test._listened, " should have called model changed listener for Relinking")
    }
  ));


  var tc = new TestCollection("GeometryReshapingTool");
  tcroot.add(tc);

  tc.add(new Test("Reshape after resize", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.toolManager.mouseDownTools.insertAt(3, new GeometryReshapingTool());

      diagram.nodeTemplate =
        $(go.Node,
          { resizable: true, resizeObjectName: "SHAPE" },
          { reshapable: true },  // GeometryReshapingTool assumes nonexistent Part.reshapeObjectName would be "SHAPE"
          $(go.Shape,
            { name: "SHAPE", fill: "lightgray", strokeWidth: 0 },
            new go.Binding("geometryString", "geo").makeTwoWay()
          )
        );

      diagram.model = new go.GraphLinksModel(
          [ { key:1, geo:"F M0 0 L75 0 L100 50 L125 0 L200 0 L200 200 L0 200z" } ]
        );
    },
    function(test) {
      // Resize the node, then grab reshape handle and move it
      var node = test.diagram.findNodeForKey(1);
      node.findObject("SHAPE").width = 100;
      test.diagram.select(node);
      var p = new go.Point(50, 50);
      test.mouseDown(p, { timestamp: 0 });
      p.y += 50;
      test.mouseMove(p, { timestamp: 100 });
      test.mouseUp(p, { timestamp: 200 });
    },
    function(test) {
      // Ensure when we reshaped that our node retained its size
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxSize(node.actualBounds.size, new go.Size(100, 200)), "node's size is " + node.actualBounds.size.toString() + " instead of Size(100,200)");
    }
  ));


  var tc = new TestCollection("TextEditingTool");
  tcroot.add(tc);

  tc.add(new Test("single click selected", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(150, 50) },
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diagram.model = $(go.TreeModel,
        {
          nodeDataArray: [
            { text: "initial" }
          ]
        });

      diagram.select(diagram.findNodeForData(diagram.model.nodeDataArray[0]));
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.findObjectAt(new go.Point(75, 25)) instanceof go.TextBlock);
      test.assert(diagram.selection.count === 1);

      test.mouseDown(new go.Point(75, 25), { timestamp: 0 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 100 });

      var node = diagram.nodes.first();
      var tool = diagram.currentTool;
      test.assert(tool instanceof go.TextEditingTool && tool == diagram.toolManager.textEditingTool, "TextEditingTool isn't running");
      test.assert(tool.isActive && tool.currentTextEditor instanceof go.HTMLInfo, "should be editing now");
      test.assert(tool.currentTextEditor.mainElement instanceof HTMLTextAreaElement, "haven't started in-place editing with a textarea")
      tool.currentTextEditor.mainElement.value = "edited";
      test.assert(node.isSelected, "node should be selected");

      test.mouseDown(new go.Point(300, 300));

      test.assert(!tool.isActive && diagram.currentTool instanceof go.ToolManager, "didn't finish editing");
      test.assert(node !== null && node.isSelected && node.elt(1) instanceof go.TextBlock && node.elt(1).text === "edited", "unsuccessful edit");
      test.assert(diagram.model.nodeDataArray[0].text === "edited", "editing didn't update model data");
    }
  ));

  tc.add(new Test("single click", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(150, 50) },
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diagram.model = $(go.TreeModel,
        {
          nodeDataArray: [
            { text: "initial" }
          ]
        });
      // don't select Node
    },
    function(test) {
      var diagram = test.diagram;
      diagram.toolManager.textEditingTool.starting = go.TextEditingTool.SingleClick;
      test.assert(diagram.selection.count === 0);

      test.mouseDown(new go.Point(75, 25), { timestamp: 0 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 100 });

      var node = diagram.nodes.first();
      var tool = diagram.currentTool;
      test.assert(tool instanceof go.TextEditingTool && tool == diagram.toolManager.textEditingTool, "TextEditingTool isn't running");
      test.assert(tool.isActive && tool.currentTextEditor instanceof go.HTMLInfo, "should be editing now");
      test.assert(tool.currentTextEditor.mainElement instanceof HTMLTextAreaElement, "haven't started in-place editing with a textarea")
      tool.currentTextEditor.mainElement.value = "edited";
      test.assert(!node.isSelected, "node should not be selected");

      test.mouseDown(new go.Point(300, 300));

      test.assert(!tool.isActive && diagram.currentTool instanceof go.ToolManager, "didn't finish editing");
      test.assert(node !== null && node.elt(1) instanceof go.TextBlock && node.elt(1).text === "edited", "unsuccessful edit");
      test.assert(diagram.model.nodeDataArray[0].text === "edited", "editing didn't update model data");

      diagram.toolManager.textEditingTool.starting = go.TextEditingTool.SingleClickSelected;
    }
  ));

  tc.add(new Test("double click", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(150, 50) },
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diagram.model = $(go.TreeModel,
        {
          nodeDataArray: [
            { text: "initial" }
          ]
        });
      // don't select Node
    },
    function(test) {
      var diagram = test.diagram;
      diagram.toolManager.textEditingTool.starting = go.TextEditingTool.DoubleClick;
      test.assert(diagram.selection.count === 0);

      test.mouseDown(new go.Point(75, 25), { timestamp: 0 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 50 });

      test.mouseDown(new go.Point(75, 25), { timestamp: 100 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 150, clickCount: 2 });

      var node = diagram.nodes.first();
      var tool = diagram.currentTool;
      test.assert(tool instanceof go.TextEditingTool && tool == diagram.toolManager.textEditingTool, "TextEditingTool isn't running");
      test.assert(tool.isActive && tool.currentTextEditor instanceof go.HTMLInfo, "should be editing now");
      test.assert(tool.currentTextEditor.mainElement instanceof HTMLTextAreaElement, "haven't started in-place editing with a textarea")
      tool.currentTextEditor.mainElement.value = "edited";
      test.assert(node.isSelected, "node should be selected");

      test.mouseDown(new go.Point(300, 300));

      test.assert(!tool.isActive && diagram.currentTool instanceof go.ToolManager, "didn't finish editing");
      test.assert(node !== null && node.isSelected && node.elt(1) instanceof go.TextBlock && node.elt(1).text === "edited", "unsuccessful edit");
      test.assert(diagram.model.nodeDataArray[0].text === "edited", "editing didn't update model data");

      diagram.toolManager.textEditingTool.starting = go.TextEditingTool.SingleClickSelected;
    }
  ));

  tc.add(new Test("single click escaped", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(150, 50) },
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diagram.model = $(go.TreeModel,
        {
          nodeDataArray: [
            { text: "initial" }
          ]
        });

      diagram.select(diagram.findNodeForData(diagram.model.nodeDataArray[0]));
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.findObjectAt(new go.Point(75, 25)) instanceof go.TextBlock);
      test.assert(diagram.selection.count === 1);

      test.mouseDown(new go.Point(75, 25), { timestamp: 0 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 100 });

      var node = diagram.nodes.first();
      var tool = diagram.currentTool;
      test.assert(tool instanceof go.TextEditingTool && tool == diagram.toolManager.textEditingTool, "TextEditingTool isn't running");
      test.assert(tool.isActive && tool.currentTextEditor instanceof go.HTMLInfo, "should be editing now");
      test.assert(tool.currentTextEditor.mainElement instanceof HTMLTextAreaElement, "haven't started in-place editing with a textarea")
      test.assert(node.isSelected, "node should be selected");

      test.keyDown("Escape");

      test.assert(!tool.isActive && diagram.currentTool instanceof go.ToolManager, "didn't finish editing");
      test.assert(node !== null && node.isSelected && node.elt(1) instanceof go.TextBlock && node.elt(1).text === "initial", "successful edit");
      test.assert(diagram.model.nodeDataArray[0].text === "initial", "canceled editing saved to model somehow");
    }
  ));

  tc.add(new Test("single click occluded", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(150, 50) },
          $(go.Shape, { fill: "lightyellow" }),
          $(go.TextBlock, { editable: true },
            new go.Binding("text").makeTwoWay())
        );

      diagram.model = $(go.TreeModel,
        {
          nodeDataArray: [
            { text: "initial" }
          ]
        });

      diagram.add(
        $(go.Part,
          { position: new go.Point(30, 10) },
          $(go.Shape, { fill: "pink", desiredSize: new go.Size(70, 30) })
        ));

      diagram.select(diagram.findNodeForData(diagram.model.nodeDataArray[0]));
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.selection.count === 1);

      test.mouseDown(new go.Point(75, 25), { timestamp: 0 });
      test.mouseUp(new go.Point(75, 25), { timestamp: 100 });

      var node = diagram.nodes.first();
      var tool = diagram.currentTool;
      test.assert(!(tool instanceof go.TextEditingTool), "TextEditingTool should not be running");
      test.assert(!node.isSelected, "node should not be selected");
    }
  ));


  var tc = new TestCollection("Adornments");
  tcroot.add(tc);

  tc.add(new Test("standard", null, SimpleSetupGraphLinks,
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,75,51,51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(71.5, 71.5, 57, 57)), "adornment's bounds are " + ad.actualBounds + "instead of (72,72,57,57)");
    }
  ));

  tc.add(new Test("thicker padding", null, SimpleSetupGraphLinks,
    function(test) {
      test.diagram.nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 6 }),
          $(go.Placeholder, { padding: 3 }));
      var node = test.diagram.findNodeForKey(1);
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,75,51,51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(68.5, 68.5, 63, 63)), "adornment's bounds are " + ad.actualBounds + "instead of (69,69,63,63)");
      test.assert(test.isApproxRect(ad.placeholder.actualBounds, new go.Rect(3, 3, 57, 57)), "adornment's placeholder bounds are " + ad.placeholder.actualBounds + "instead of (3,3,57,57)");
    }
  ));

  tc.add(new Test("thicker margin", null, SimpleSetupGraphLinks,
    function(test) {
      test.diagram.nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 6 }),
          $(go.Placeholder, { margin: 3 }));
      var node = test.diagram.findNodeForKey(1);
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,75,51,51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(68.5, 68.5, 63, 63)), "adornment's bounds are " + ad.actualBounds + "instead of (69,69,63,63)");
      test.assert(test.isApproxRect(ad.placeholder.actualBounds, new go.Rect(6, 6, 51, 51)), "adornment's placeholder bounds are " + ad.placeholder.actualBounds + "instead of (6,6,51,51)");
    }
  ));

  tc.add(new Test("thicker individual", null, SimpleSetupGraphLinks,
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      node.selectionAdornmentTemplate =
        $(go.Adornment, "Auto",
          $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 6 }),
          $(go.Placeholder, { margin: 3 }));
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,75,51,51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(68.5, 68.5, 63, 63)), "adornment's bounds are " + ad.actualBounds + "instead of (69,69,63,63)");
    }
  ));

  tc.add(new Test("spots", null, SimpleSetupGraphLinks,
    function(test) {
      test.diagram.nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Spot",
          $(go.Placeholder),
          $(go.Shape, "XLine", { name: "TL", alignment: go.Spot.TopLeft, width: 10, height: 10, stroke: "cyan" }),
          $(go.Shape, "XLine", { name: "BR", alignment: go.Spot.BottomRight, width: 10, height: 10, stroke: "red" })
        );
      var node = test.diagram.findNodeForKey(1);
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (75,75,51,51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      var tl = ad.findObject("TL");
      test.assert(test.isApproxPoint(tl.getDocumentPoint(go.Spot.TopLeft), new go.Point(69, 69)), "handle's position is " + tl.getDocumentPoint(go.Spot.TopLeft) + "instead of (69.5,69.5)");
      var br = ad.findObject("BR");
      test.assert(test.isApproxPoint(br.getDocumentPoint(go.Spot.TopLeft), new go.Point(120, 120)), "handle's position is " + br.getDocumentPoint(go.Spot.TopLeft) + "instead of (120.5,120.5)");
    }
  ));

  tc.add(new Test("vertical", null, SimpleSetupGraphLinks,
    function(test) {
      test.diagram.nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Vertical",
          $(go.Shape, "XLine", { name: "TL", width: 10, height: 10, stroke: "cyan" }),
          $(go.Placeholder),
          $(go.Shape, "XLine", { name: "BR", width: 10, height: 10, stroke: "red" })
        );
      var node = test.diagram.findNodeForKey(1);
      node.resizable = false;
      node.rotatable = false;
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForKey(1);
      test.assert(test.isApproxRect(node.actualBounds, new go.Rect(74.5, 74.5, 51, 51)), "node's bounds are " + node.actualBounds + "instead of (74.5, 74.5, 51, 51)");
      test.assert(node.adornments.count > 0, "selected Node should have some Adornments");
      var ad = node.findAdornment("Selection");
      test.assert(ad !== null, "selected Node should have a selection Adornment");
      var tl = ad.findObject("TL");
      test.assert(test.isApproxPoint(tl.getDocumentPoint(go.Spot.TopLeft), new go.Point(94.5, 63.5)), "handle's position is " + tl.getDocumentPoint(go.Spot.TopLeft) + "instead of (94.5, 63.5)");
      var br = ad.findObject("BR");
      test.assert(test.isApproxPoint(br.getDocumentPoint(go.Spot.TopLeft), new go.Point(94.5, 125.5)), "handle's position is " + br.getDocumentPoint(go.Spot.TopLeft) + "instead of (94.5, 125.5)");
    }
  ));

  tc.add(new Test("standard link", null, CommonSetupGraphLinks,
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(test.isApproxRect(link.actualBounds, new go.Rect(15,4.17,71.29,38.58)), "link's bounds are " + link.actualBounds + "instead of (15,4.17,71.29,38.58)");
      test.assert(link.adornments.count > 0, "selected Link should have some Adornments");
      var ad = link.findAdornment("Selection");
      test.assert(ad !== null, "selected Link should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(14,6.25,72,37.5)), "adornment's bounds are " + ad.actualBounds + "instead of (14,6.25,72,37.5)");
    }
  ));


  tc.add(new Test("mid link", null, CommonSetupGraphLinks,
    function(test) {
      test.diagram.linkSelectionAdornmentTemplate =
        $(go.Adornment, "Link",
          $(go.Placeholder),
          $(go.Shape, "XLine", { name: "MID", width: 10, height: 10, stroke: "red" })
        );
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(test.isApproxRect(link.actualBounds, new go.Rect(15,4.17,71.29,38.58)), "link's bounds are " + link.actualBounds + "instead of (15,4.17,71.29,38.58)");
      test.assert(link.adornments.count > 0, "selected Link should have some Adornments");
      var ad = link.findAdornment("Selection");
      test.assert(ad !== null, "selected Link should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(15,7.25,70,35.5)), "adornment's bounds are " + ad.actualBounds + "instead of (15,7.25,70,35.5)");
      var mid = ad.findObject("MID");
      test.assert(test.isApproxPoint(mid.getDocumentPoint(go.Spot.TopLeft), new go.Point(44.5,19.5)), "handle's position is " + mid.getDocumentPoint(go.Spot.TopLeft) + "instead of (44.5,19.5)");
    }
  ));

  tc.add(new Test("custom link", null, CommonSetupGraphLinks,
    function(test) {
      test.diagram.linkSelectionAdornmentTemplate =
        $(go.Adornment, "Link",
          $(go.Placeholder),
          $(go.Shape, { name: "MID", toArrow: "Standard", fill: "red" })
        );
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(test.isApproxRect(link.actualBounds, new go.Rect(15,4.17,71.29,38.58)), "link's bounds are " + link.actualBounds + "instead of (15,4.17,71.29,38.58)");
      test.assert(link.adornments.count > 0, "selected Link should have some Adornments");
      var ad = link.findAdornment("Selection");
      test.assert(ad !== null, "selected Link should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(15,3.73,71.51,39.02)), "adornment's bounds are " + ad.actualBounds + "instead of (15,3.73,71.51,39.02)");
      var mid = ad.findObject("MID");
      test.assert(test.isApproxPoint(mid.getDocumentPoint(go.Spot.TopLeft), new go.Point(74.44,7.75)), "handle's position is " + mid.getDocumentPoint(go.Spot.TopLeft) + "instead of (74.44,7.75)");
    }
  ));
  tc.add(new Test("box link", null, function(test) {
    // Make another isPanelMain shape in the link and use it as the selection object
    test.diagram.linkTemplate.add( go.GraphObject.make(go.Shape, { name: 'link', isPanelMain: true }));
    test.diagram.linkTemplate.selectionObjectName = "link";
    CommonSetupGraphLinks(test);
    },
    function(test) {
      test.diagram.linkSelectionAdornmentTemplate =
        $(go.Adornment, "Auto",
          $(go.Shape, { fill: null, stroke: "red" }),
          $(go.Placeholder)
        );
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      link.isSelected = true;
    },
    function(test) {
      var link = test.diagram.findLinkForData(test.diagram.model.linkDataArray[0]);
      test.assert(test.isApproxRect(link.actualBounds, new go.Rect(15,4.17,71.29,38.58)), "link's bounds are " + link.actualBounds + "instead of (15,4.17,71.29,38.58)");
      test.assert(link.adornments.count > 0, "selected Link should have some Adornments");
      var ad = link.findAdornment("Selection");
      test.assert(ad !== null, "selected Link should have a selection Adornment");
      test.assert(test.isApproxRect(ad.actualBounds, new go.Rect(14.5,6.75,71,36.5)), "adornment's bounds are " + ad.actualBounds + "instead of (14.5,6.75,71,36.5)");
    }
  ));

  tc.add(new Test("Adornment update", null,
    function(test) {
      CommonSetupGraphLinks(test);
      test.diagram.nodeSelectionAdornmentTemplate =
        $(go.Adornment, "Vertical",
          $(go.Panel, "Auto",
            $(go.Shape, { fill: null, stroke: "red" }),
            $(go.Placeholder)
          ),
          $(go.TextBlock, { name: "ATB", stroke: "dodgerblue" },
            new go.Binding("text", "", function(ad) { return ad.adornedPart.location.toString(); }).ofObject())
        );
      var node = test.diagram.findNodeForData(test.diagram.model.nodeDataArray[0]);
      node.isSelected = true;
    },
    function(test) {
      var node = test.diagram.findNodeForData(test.diagram.model.nodeDataArray[0]);
      test.assert(node.location.equals(new go.Point(0, 50)), "Node n1 isn't at 0, 50");
      test.assert(node.location.toString() === node.findAdornment("Selection").findObject("ATB").text, "Adornment text wasn't updated with Node.location");
      test.diagram.startTransaction("move");
      var coll = new go.Set();
      coll.add(node);
      test.diagram.moveParts(coll, new go.Point(60, 80), false);
      test.diagram.commitTransaction("move");
    },
    function(test) {
      var node = test.diagram.findNodeForData(test.diagram.model.nodeDataArray[0]);
      test.assert(node.location.equals(new go.Point(60, 130)), "didn't move node?");
      test.assert(node.location.toString() === node.findAdornment("Selection").findObject("ATB").text, "Adornment text wasn't updated with Node.location");
    }
  ));


  var tc = new TestCollection("Focus");
  tcroot.add(tc);

  function createExtraDiv(test) {
    test.extraDiv = document.createElement('div');
    test.extraDiv.style = "border: solid 1px green; width: 300px; height: 2700px";
    test.extraTextArea = document.createElement('textarea');
    test.extraTextArea.style = "width: 200px; height: 2600px";
    test.extraDiv.appendChild(test.extraTextArea);
    document.body.appendChild(test.extraDiv);
  }

  function cleanupExtraDiv(test) {
    document.body.removeChild(test.extraDiv);
    test.extraDiv = null;
    test.extraTextArea = null;
  }

  function isDiagramFocus(test) {
    var elt = document.activeElement;
    return elt instanceof HTMLElement && elt.tagName.toLowerCase() == "canvas";
  }

  tc.add(new Test("click focus", null,
    function(test) {
      CommonSetupGraphLinks(test);
      createExtraDiv(test);
      test.extraTextArea.focus();
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "didn't change focus to extra TextArea");
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should not have changed focus yet");
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.assert(isDiagramFocus(test), "should be focused on diagram");
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3), "selected Node isn't N3");
      cleanupExtraDiv(test);
    }
  ));

  tc.add(new Test("click focus scroll page", null,
    function(test) {
      CommonSetupGraphLinks(test);
      createExtraDiv(test);
      test.extraTextArea.focus();
      window.scrollTo(0, 2000);  //?? not sure this is actually working
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "didn't change focus to extra TextArea");
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should not have changed focus yet");
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
      test.assert(isDiagramFocus(test), "should be focused on diagram");
    },
    function(test) {
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3), "selected Node isn't N3");
      cleanupExtraDiv(test);
    }
  ));

  tc.add(new Test("click focus change", null,
    function(test) {
      CommonSetupGraphLinks(test);
      createExtraDiv(test);
      test.extraTextArea.focus();
      test.diagram.nodes.each(function(n) {
        n.click = function(e, obj) {
          test.extraTextArea.focus();
          test.extraTextArea.textContent = e.documentPoint.toString();
          test.focusClick = e.documentPoint.copy();
        }
      });
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "didn't change focus to extra TextArea");
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should not have changed focus yet");
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should NOT be focused on diagram after click changed focus");
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3), "selected Node isn't N3");
      test.assert(test.focusClick.equalsApprox(new go.Point(100, 101)), "didn't click within N3");
      cleanupExtraDiv(test);
    }
  ));

  tc.add(new Test("click focus change scroll page", null,
    function(test) {
      CommonSetupGraphLinks(test);
      createExtraDiv(test);
      test.extraTextArea.focus();
      test.diagram.nodes.each(function(n) {
        n.click = function(e, obj) {
          test.extraTextArea.focus();
          test.extraTextArea.textContent = e.documentPoint.toString();
          test.focusClick = e.documentPoint.copy();
        }
      });
      window.scrollTo(0, 2000);  //?? not sure this is actually working
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "didn't change focus to extra TextArea");
      test.mouseDown(new go.Point(100, 100), { timestamp: 0 });  // at N3 location
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should not have changed focus yet");
      test.mouseUp(new go.Point(100, 101), { timestamp: 200 });
    },
    function(test) {
      test.assert(document.activeElement === test.extraTextArea && !isDiagramFocus(test), "should NOT be focused on diagram after click changed focus");
      test.assert(test.diagram.selection.count === 1, "should have selected one node");
      test.assert(test.diagram.selection.first() === test.diagram.findNodeForKey(3), "selected Node isn't N3");
      test.assert(test.focusClick.equalsApprox(new go.Point(100, 101)), "didn't click within N3");
      cleanupExtraDiv(test);
    }
  ));


  var tc = new TestCollection("Custom tools");
  tcroot.add(tc);

  tc.add(new Test("SnappingTool", null,
  function(test) {
    var d = test.diagram;
    d.reset();
    d.toolManager.draggingTool = new SnappingTool();
    d.nodeTemplate =
      $(go.Node, "Spot",
        {
          locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          selectionAdorned: false,  // use a Binding on the Shape.stroke to show selection
          itemTemplate:
            // each port is an "X" shape whose alignment spot and port ID are given by the item data
            $(go.Panel,
              new go.Binding("portId", "id"),
              new go.Binding("alignment", "spot", go.Spot.parse),
              $(go.Shape, "XLine",
                { width: 6, height: 6, background: "transparent", fill: null, stroke: "gray" },
                new go.Binding("figure", "id", portFigure),  // portFigure converter is defined below
                new go.Binding("angle", "angle"))
            ),
          // hide a port when it is connected
          linkConnected: function(node, link, port) {
            if (link.category === "") port.visible = false;
          },
          linkDisconnected: function(node, link, port) {
            if (link.category === "") port.visible = true;
          }
        },
        // this creates the variable number of ports for this Spot Panel, based on the data
        new go.Binding("itemArray", "ports"),
        // remember the location of this Node
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // remember the angle of this Node
        new go.Binding("angle", "angle").makeTwoWay(),
        // move a selected part into the Foreground layer, so it isn't obscured by any non-selected parts
        new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
        $(go.Shape,
          {
            name: "SHAPE",
            // the following are default values;
            // actual values may come from the node data object via data binding
            geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
            fill: "rgba(128, 128, 128, 0.5)"
          },
          // this determines the actual shape of the Shape
          new go.Binding("geometryString", "geo"),
          // selection causes the stroke to be blue instead of black
          new go.Binding("stroke", "isSelected", function(s) { return s ? "dodgerblue" : "black"; }).ofObject())
      );

    // Show different kinds of port fittings by using different shapes in this Binding converter
    function portFigure(pid) {
      if (pid === null || pid === "") return "XLine";
      if (pid[0] === 'F') return "CircleLine";
      if (pid[0] === 'M') return "PlusLine";
      return "XLine";  // including when the first character is 'U'
    }
    d.linkTemplate = $(go.Link, { visible: false });

    // this model needs to know about particular ports
    d.model = go.Model.fromJSON(
   '   { "class": "GraphLinksModel",' +
   '   "copiesArrays": true,' +
   '   "copiesArrayObjects": true,' +
   '   "linkFromPortIdProperty": "fid",' +
   '   "linkToPortIdProperty": "tid",' +
   '   "nodeDataArray": [' +
   ' {"key":-7, "geo":"F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z", "ports":[ {"id":"U0", "spot":"1 0.25 -0.5 0.25"},{"id":"U2", "spot":"0.25 1 0.25 -0.5"} ], "loc":"-123.3333333333333 8.666666666666675", "angle":0},' +
   ' {"key":-8, "angle":90, "geo":"F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z", "ports":[ {"id":"U0", "spot":"1 0.25 -0.5 0.25"},{"id":"U2", "spot":"0.25 1 0.25 -0.5"} ], "loc":"-83.3333333333333 8.666666666666675"},' +
   ' {"key":-9, "angle":180, "geo":"F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z", "ports":[ {"id":"U0", "spot":"1 0.25 -0.5 0.25"},{"id":"U2", "spot":"0.25 1 0.25 -0.5"} ], "loc":"-83.3333333333333 48.666666666666686"},' +
   ' {"key":-10, "angle":270, "geo":"F1 M0 40 L0 30 Q0 0 30 0 L40 0 40 20 30 20 Q20 20 20 30 L20 40z", "ports":[ {"id":"U0", "spot":"1 0.25 -0.5 0.25"},{"id":"U2", "spot":"0.25 1 0.25 -0.5"} ], "loc":"-123.3333333333333 48.666666666666686"},' +
   ' {"key":7, "angle":90, "geo":"F1 M0 0 L20 0 20 60 0 60z", "ports":[ {"id":"U6", "spot":"0.5 0 0 0.5"},{"id":"U2", "spot":"0.5 1 0 -0.5"} ], "loc":"-132.78472900390634 -64.3333333333334"},' +
   ' {"key":-6, "angle":90, "geo":"F1 M0 0 L20 0 20 60 0 60z", "ports":[ {"id":"U6", "spot":"0.5 0 0 0.5"},{"id":"U2", "spot":"0.5 1 0 -0.5"} ], "loc":"-72.61806233723959 -40.000000000000014"}' +
   '  ],' +
   '   "linkDataArray": [' +
   ' {"from":-8, "to":-7, "fid":"U2", "tid":"U0"},' +
   ' {"from":-9, "to":-8, "fid":"U2", "tid":"U0"},' +
   ' {"from":-10, "to":-7, "fid":"U0", "tid":"U2"},' +
   ' {"from":-10, "to":-9, "fid":"U2", "tid":"U0"}' +
   '  ]}');



  },
  function(test) {
  },
  function(test) {
    var d = test.diagram;
    // Custom tool should snap and create a link:
    test.assert(d.links.count === 4);
    test.mouseDown(new go.Point(-77, -40), { timestamp: 0 });  // at N3 location
    test.mouseMove(new go.Point(-74, -53), { timestamp: 200 });
    test.mouseUp(new go.Point(-74, -53), { timestamp: 210 });
    test.assert(d.links.count === 5);

    // Custom tool should move 4 parts:
    var othernode  = d.findNodeForKey(-7);
    test.assert(othernode.position.x < -140 && othernode.position.x > -145);
    test.mouseDown(new go.Point(-80, 9), { timestamp: 0 });  // at N3 location
    test.mouseMove(new go.Point(0, 9), { timestamp: 200 });
    test.mouseUp(new go.Point(0, 9), { timestamp: 210 });
    test.assert(othernode.position.x < -60 && othernode.position.x > -65 );

  }
  )); // end custom tool test


  var tm = new TestCollection("Dragging Tool");
  tcroot.add(tm);


  tm.add(new Test("Dragging group don't re-route interior avoid link", null,
  function(test) {
    var d = test.diagram;
    d.reset();
    d.nodeTemplate =
    $(go.Node, "Auto",
      { width: 100, height: 50, locationSpot: go.Spot.Center },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, { fill: "white" }),
      $(go.TextBlock, new go.Binding("text"))
    );

  d.linkTemplate =
    $(go.Link,
      new go.Binding('points').makeTwoWay(),
      { routing: go.Link.AvoidsNodes, reshapable: true },
      $(go.Shape)
    );

  d.model = go.Model.fromJSON(
    '    { "class": "GraphLinksModel",' +
    '  "nodeDataArray": [ ' +
    '{"key":1, "text":"Alpha", "loc":"0 0", "group":11},' +
    '{"key":2, "text":"Beta", "loc":"90.99999999999997 129.00000000000003", "group":11},' +
    '{"key":3, "text":"Gamma", "loc":"0 200", "group":11},' +
    '{"key":11, "text":"Group", "isGroup":true}' +
    ' ],' +
    '  "linkDataArray": [ ' +
    '{"from":1, "to":2, "points":[0,25,0,35,0,87,91,87,91,94,91,104]}' +
    ' ]}');

  },
  function(test) {
  },
  function(test) {
    var d = test.diagram;
    var link = d.links.first();

    test.assert(link.getPoint(0).equals(new go.Point(0, 25)));
    test.assert(link.getPoint(1).equals(new go.Point(0, 35)));
    test.assert(link.getPoint(2).equals(new go.Point(0, 87)));
    test.assert(link.getPoint(3).equals(new go.Point(91, 87)));
    test.assert(link.getPoint(4).equals(new go.Point(91, 94)));
    test.assert(link.getPoint(5).equals(new go.Point(91, 104)));
    // Shift everything, including the link points, by -20

    test.mouseDown(new go.Point(40, -40), { timestamp: 0 });  // at N3 location
    test.mouseMove(new go.Point(20, -40), { timestamp: 200 });
    test.mouseUp(new go.Point(20, -40), { timestamp: 210 });
    // check to make sure link is shifted, but not re-routed
    test.assert(link.getPoint(0).equals(new go.Point  (-20, 25)));
    test.assert(link.getPoint(1).equals(new go.Point(-20, 35)));
    test.assert(link.getPoint(2).equals(new go.Point(-20, 87)));
    test.assert(link.getPoint(3).equals(new go.Point(71,  87)));
    test.assert(link.getPoint(4).equals(new go.Point(71,  94)));
    test.assert(link.getPoint(5).equals(new go.Point(71,  104)));

  }
  )); // end drag test

  tm.add(new Test("Dragging don't re-route custom link", null,
    function (test) {
      var d = test.diagram;
      d.reset();
      function makePort(name, spot, output, input) {
        // the port is basically just a small transparent circle
        return $(go.Shape, "Circle",
          {
            fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
            stroke: null,
            desiredSize: new go.Size(7, 7),
            alignment: spot,  // align the port on the main Shape
            alignmentFocus: spot,  // just inside the Shape
            portId: name,  // declare this object to be a "port"
            fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
            fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
            cursor: "pointer"  // show a different cursor to indicate potential link point
          });
      }


      d.nodeTemplate =
        $(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          new go.Binding("angle").makeTwoWay(),
          // the main object is a Panel that surrounds a TextBlock with a Shape
          $(go.Panel, "Auto",
            { name: "PANEL" },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
            $(go.Shape, "Rectangle",  // default figure
              {
                portId: "", // the default port: if no spot on link data, use closest side
                fromLinkable: true, toLinkable: true, cursor: "pointer",
                fill: "white",  // default color
                strokeWidth: 2
              },
              new go.Binding("figure"),
              new go.Binding("fill")),
            $(go.TextBlock,
              {
                font: "bold 10pt Helvetica, Arial, sans-serif",
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.Wrap.Fit,
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          ),
          // four small named ports, one on each side:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false)
        );
      d.linkTemplate =
        $(go.Link,  // the whole link panel
          { relinkableFrom: true, relinkableTo: true, reshapable: true },
          {
            routing: go.Routing.AvoidsNodes,
            curve: go.Curve.JumpOver,
            corner: 5,
            toShortLength: 4
          },
          new go.Binding("points").makeTwoWay(),
          $(go.Shape,  // the link path shape
            { isPanelMain: true, strokeWidth: 2 }),
          $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null }),
          $(go.Panel, "Auto",
            new go.Binding("visible", "isSelected").ofObject(),
            $(go.Shape, "RoundedRectangle",  // the link shape
              { fill: "#F8F8F8", stroke: null }),
            $(go.TextBlock,
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#919191",
                margin: 2,
                minSize: new go.Size(10, NaN),
                editable: true
              },
              new go.Binding("text").makeTwoWay())
          )
        );

      d.model = go.Model.fromJSON(`
      { "class": "GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "modelData": {"position":"-421 -310"},
  "nodeDataArray": [
{"text":"Comment","figure":"RoundedRectangle","fill":"lightyellow","key":-1,"loc":"-40 -70"},
{"text":"Comment","figure":"RoundedRectangle","fill":"lightyellow","key":-2,"loc":"100 -150"}
],
  "linkDataArray": [{"from":-1,"to":-2,"fromPort":"R","toPort":"L","points":[2,-70,12,-70,11,-70,11,-150,47,-150,57,-150]}]}
      `)
    },
    function (test) {
    },
    function (test) {
      var d = test.diagram;
      d.commandHandler.selectAll()
      d.currentTool = d.toolManager.draggingTool;
      d.firstInput.documentPoint = new go.Point(-40, -70)
      d.currentTool.doActivate();
      d.lastInput.documentPoint = new go.Point(-40, -60)
      d.currentTool.doMouseMove();
      d.currentTool.doMouseUp();
      const l = d.links.first();
      // bad: Point(2.4958903018883376,-60),Point(12.495890301888338,-60),Point(29.999999999999996,-60),Point(29.999999999999996,-140),Point(47.504109698111655,-140),Point(57.504109698111655,-140)
      // good:Point(2,-60),Point(12,-60),Point(11,-60),Point(11,-140),Point(47,-140),Point(57,-140)
      test.assert(l.points.toArray().join(',') === 'Point(2,-60),Point(12,-60),Point(11,-60),Point(11,-140),Point(47,-140),Point(57,-140)')
    }
  )); // end drag test

  tm.add(new Test("Dragging don't re-route avoid link", null,
    function (test) {
      var d = test.diagram;
      d.reset();
      d.nodeTemplate =
        $(go.Node, "Spot",
          new go.Binding('position'),
          $(go.Shape, "RoundedRectangle", { width: 60, height: 24, strokeWidth: 0 },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            {},
            new go.Binding("text", "key"))
        );

      d.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, resegmentable: true, relinkableTo: true, reshapable: true },
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

      d.model = new go.GraphLinksModel(
        [
          { key: "Alpha", position: new go.Point(-166, -51), color: "lightblue" },
          { key: "Beta", position: new go.Point(120, 119), color: "orange" },
          { key: "Gamma", position: new go.Point(22, 0), color: "lightgreen" }
        ],
        [
          {
            from: "Alpha", to: "Beta",
            points: [-106, -39, -96, -39, -81, -39, -81, 94, -42, 94, -42, 131, 110, 131, 120, 131]
          }]);

    },
    function (test) {
    },
    function (test) {
      var d = test.diagram;
      var link = d.links.first();

      test.assert(link.points.count === 8);

      test.mouseDown(new go.Point(52, 12), { timestamp: 0 });  // at N3 location
      test.mouseMove(new go.Point(58, 12), { timestamp: 200 });
      test.mouseUp(new go.Point(58, 12), { timestamp: 210 });

      test.assert(link.points.count === 8); // should be the same
      test.mouseDown(new go.Point(58, 12), { timestamp: 0 });  // at N3 location
      test.mouseMove(new go.Point(-17, 90), { timestamp: 200 });
      test.mouseUp(new go.Point(-17, 90), { timestamp: 210 });

      test.assert(link.points.count === 6); // should be different!!

    }
  )); // end drag test

})(); // end test system
