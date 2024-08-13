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

  var diagramReset = new TestCollection('diagram.reset');
  TestRoot.add(diagramReset);

  //create function to tear down extra div with second diagram
  function teardown() {
	window.D1.div = null;
	document.body.removeChild(window.initD1);
	window.D1 = null;
	window.initD1 = null;
	window.D2.div = null;
	document.body.removeChild(window.initD2);
	window.D2 = null;
	window.initD2 = null;
  }

  function compare(a, b, m1, m2, ar) {
  	//check to see if a and b have already been compared
   	if (m1.contains(a) && m1.getValue(a) === b || m1.contains(b) && m1.getValue(b) === a) {
   	  if (m2.getValue(m1) !== true || m2.getValue(m1) !== false) {
   	  	return true;
   	  } else {
   	  	return m2.getValue(m1);
   	  }
   	//check for null
   	} else if (a ===  null && b !== null || a !== null &&  b === null) {
	  ar.push(a+" is not equal to "+b);
	  return false;
	} else if (a === null && b === null) {
   	  return true;
   	//check for undefined
   	} else if (a === undefined && b !== undefined || a !== undefined && b === undefined) {
   	  ar.push(a+" is not equal to "+b);
   	  return false;
   	} else if (a === undefined && b === undefined) {
   	  return true;
   	//check if a and b are equal if they are numbers
	} else if (typeof a === 'number' && typeof b === 'number') {
	  return number_compare(a, b, m1, m2, ar);
	//ignore __gohashid for strings
	} else if (typeof a === 'string' && typeof b === 'string') {
	  return string_compare(a, b, m1, m2, ar);
	//compare for goJS sets
	} else if (a instanceof go.Set && b instanceof go.Set) {
	  return set_compare(a, b, m1, m2, ar);
	//check if both values are functions
	} else if (typeof a === 'function' && b === null || a === null && typeof b === 'function') {
	  ar.push(a+" is "+typeof a+" and "+b+" is "+typeof b);
	  return false;
	} else if (typeof a === 'function' && typeof b === 'function') {
   	  return true;
	//check if a and b are equal if they are objects
	} else if (typeof a === 'object' && typeof b === 'object') {
	  return object_compare(a, b, m1, m2, ar);
	//otherwise just use ===
	} else {
	  /*if (!(a instanceof go.Rect) && !(a instanceof go.Margin) && !(a instanceof go.Spot) && !(a instanceof go.Size) && !(a instanceof go.Point)) {
	  	s.add(a}
	  if (!(b instanceof go.Rect) && !(b instanceof go.Margin) && !(b instanceof go.Spot) && !(b instanceof go.Size) && !(b instanceof go.Point)) {
	  	s.add(b}*/
	  if (a === b) {
	  	if (m1.contains(a) && !m1.contains(b)) {
   	  	  m1.add(b, a);
   	  	} else {
   	  	  m1.add(a, b);
   	  	}
	  	m2.add(m1, true);
	  	return true;
	  } else {
	  	if (m1.contains(a) && !m1.contains(b)) {
   	  	  m1.add(b, a);
   	  	} else {
   	  	  m1.add(a, b);
   	  	}
	  	m2.add(m1, false);
	  	ar.push(a+" is not equal to "+b)
	  	return false;
	  }
	}
	if (m1.contains(a) && !m1.contains(b)) {
   	  m1.add(b, a);
   	} else {
   	  m1.add(a, b);
   	}
   	m2.add(m1, false);
	ar.push("unknown "+a+" is not equal to unknown "+b);
	return false;
  }

  //two maps, map1 is map1(a, b). map2 is map2(map1, true/false)
  //IF (1) map1 contains a (2) b === map1.getValue(a), then return the saved value

  function object_compare(a, b, m1, m2, ar) {
	//compare for two arrays
	if (a instanceof Array && b instanceof Array) {
	  return array_compare(a, b, m1, m2, ar);
	//compare for two iterators
	} else if (a.iterator === a && typeof a.next === 'function' && b.iterator === b && typeof b.next === 'function') {
	  return iterator_compare(a, b, m1, m2, ar);
	//compare for rect
	} else if (a instanceof go.Rect && b instanceof go.Rect) {
      return rect_compare(a, b, m1, m2, ar);
    //compare for margin
    } else if (a instanceof go.Margin && b instanceof go.Margin) {
      return margin_compare(a, b, m1, m2, ar);
    //compare for Spot
    } else if (a instanceof go.Spot && b instanceof go.Spot) {
      return spot_compare(a, b, m1, m2, ar);
    //compare for Point
    } else if (a instanceof go.Point && b instanceof go.Point) {
      return point_compare(a, b, m1, m2, ar);
    //compare for size
    } else if (a instanceof go.Size && b instanceof go.Size) {
      return size_compare(a, b, m1, m2, ar);
	//compare for objects
	} else if (typeof a === 'object' && typeof b === 'object') {
	  if (m1.contains(a) && !m1.contains(b)) {
   	  	m1.add(b, a);
   	  } else {
   	  	m1.add(a, b);
   	  }
   	  m2.add(m1);
	   //check both p in a and p in b in case they are different lengths
	  for (var p in a) {
	  	if (a instanceof Element ||
	  	  a.length <= 2 && a !== 'x' && a !== 'y' && a !== 'up' || p[0] === '_' || p.indexOf('__gohashid') >= 0 || p instanceof Element ||
	  	  p.length <= 2 && p !== 'x' && p !== 'y' && p !== 'up') { continue; }
	  	if (!compare(a[p], b[p], m1, m2, ar)) {
	  	  m2.add(m1, false);
	  	  ar.push("object "+a+" is not equal to object "+b+ " for property " + p);
	  	  return false;
	  	}
	  }
	  for (var p in b) {
	  	if (b instanceof Element ||
	  	  b.length <= 2 && b !== 'x' && b !== 'y' && b !== 'up' || p[0] === '_' || p.indexOf('__gohashid') >= 0 || p instanceof Element ||
   	  	  p.length <= 2 && p !== 'x' && p !== 'y' && p !== 'up') { continue; }
	  	if (!compare(a[p], b[p], m1, m2, ar)) {
	  	  m2.add(m1, false);
	  	  ar.push("object "+a+" is not equal to object "+b+ " for property " + p);
	  	  return false;
	  	}
	  }
	  m2.add(m1, true);
	  return true;
	} else {
	  if (m1.contains(a) && !m1.contains(b)) {
   	  	m1.add(b, a);
   	  } else {
   	  	m1.add(a, b);
   	  }
   	  m2.add(m1, false);
	  ar.push("unknown object "+a+" is not equal to unknown object "+b);
	  return false;
	}
  }

  function array_compare(a, b, m1, m2, ar) {
	// add a and b to the set 's'.
	if (m1.contains(a) && !m1.contains(b)) {
   	  m1.add(b, a);
   	} else {
   	  m1.add(a, b);
   	}
	if (a.length !== b.length) {
	  m2.add(m1, false);
	  ar.push("arrays"+a+" and "+b+" are of different lengths"); //alert('arrays '+a+' and '+b+' have different lengths');
	  return false;
	}
	for (var i = 0; i < a.length; i++) {
	  if (!compare(a[i], b[i], m1, m2, ar)) {
	  	m2.add(m1, false);
	  	ar.push('arrays '+a+' and '+b+' are not equal'); //alert('arrays '+a+' and '+b+' are not equal');
	  	return false;
	  }
	}
	m2.add(m1, true);
	return true;
  }

  function iterator_compare(a, b, m1, m2, ar) {
	it1 = a;
	it2 = b;
	if (it1.next() === false && it2.next() === false) {
	  return true;
	} else {
	  it1.reset();
	  it2.reset();
	  while (it1.next()) {
	  	var lay1 = it1.value;
      	if (it2.next()) {
      	  var lay2 = it2.value;
      	  if (!compare(lay1, lay2, m1, m2, ar)) {
      	  	ar.push("iterator "+a+" is not equal to iterator "+b);
      	  	return false;
      	  } else {
      	  	return true;
      	  }
      	} else {
      	  ar.push("iterator "+a+" is not equal to iterator "+b);
      	  return false;
      	}
      }
  	}

  }

  function rect_compare(a, b, m1, m2, ar) {
	if (compare(a.x, b.x, m1, m2, ar) && compare(a.y, b.y, m1, m2, ar) && compare(a.width, b.width, m1, m2, ar)  && compare(a.height, b.height, m1, m2, ar)) {
      return true;
    } else {
      ar.push("rect "+a+" is not equal to rect "+b);
      return false;
    }
  }

  function margin_compare(a, b, m1, m2, ar) {
	if (compare(a.t, b.t, m1, m2, ar) && compare(a.r, b.r, m1, m2, ar) && compare(a.b, b.b, m1, m2, ar)  && compare(a.l, b.l, m1, m2, ar)) {
      return true;
    } else {
      ar.push("margin "+a+" is not equal to margin "+b);
      return false;
    }
  }

  function spot_compare(a, b, m1, m2, ar) {
	if (compare(a.x, b.x, m1, m2, ar) && compare(a.y, b.y, m1, m2, ar) && compare(a.offx, b.offx, m1, m2, ar)  && compare(a.offy, b.offy, m1, m2, ar)) {
      return true;
    } else {
      ar.push("spot "+a+" is not equal to spot "+b);
      return false;
    }
  }

  function point_compare(a, b, m1, m2, ar) {
	if (compare(a.x, b.x, m1, m2, ar) && compare(a.y, b.y, m1, m2, ar)) {
      return true;
    } else {
      ar.push("point "+a+" is not equal to point "+b);
      return false;
    }
  }

  function size_compare(a, b, m1, m2, ar) {
	if (compare(a.w, b.w, m1, m2, ar) && compare(a.h, b.h, m1, m2, ar)) {
      return true;
    } else {
      ar.push("size "+a+" is not equal to size"+b);
      return false;
    }
  }

  function string_compare(a, b, m1, m2, ar) {
	if (a.indexOf('__gohashid') >= 0 || b.indexOf('__gohashid') >= 0) {
	  return true;
	} else {
	  if (a === b) {
	  	return true;
	  } else {
	  	ar.push("string "+a+" is not equal to string "+b);
	  	return false;
	  }
	}
  }

  function set_compare(a, b, m1, m2, ar) {
	if (m1.contains(a) && !m1.contains(b)) {
   	  m1.add(b, a);
   	} else {
   	  m1.add(a, b);
   	}
	if (a.size !== b.size) {
	  m2.add(m1, false);
	  ar.push("sets "+a+" and "+b+" are different sizes"); //alert('goJS sets '+a+' and '+b+' have different sizes');
	  return false;
	}
	a.all(function(item) {
	  if (!b.has(item)) {
	  	m2.add(m1, false);
	  	ar.push("sets "+a+" and "+b+" are not equal"); //alert('goJS sets '+a+' and '+b+' are not equal');
	  	return false;
	  }
	})
	m2.add(m1, true);
	return true;
  }


  function number_compare(a, b, m1, m2, ar) {
	if (a === b || (isNaN(b) && isNaN(b))) {
	  return true;
	} else {
	  ar.push("Numbers "+a+" and "+b+" are not equal");
	  return false;
	}
  }

  //function for diagram 1
  //uses groupTemplate and initialContentAlignment, linkSelectionAdornmentTemplate, layout, model
  function group_template(diagram) {
  	diagram.allowCopy = false;
  	diagram.allowDelete = false;
  	diagram.allowInsert = false;
  	diagram.allowLink = false;
    diagram.groupTemplate =
	  $(go.Group, "Auto",
		// declare the Group.layout:
		{ layout: $(go.LayeredDigraphLayout,
		  { direction: 0, columnSpacing: 10 }) },
		$(go.Shape, "RoundedRectangle",  // surrounds everything
		  { parameter1: 10, fill: "rgba(128,128,128,0.33)" }),
		$(go.Panel, "Vertical",  // position header above the subgraph
		  $(go.TextBlock,     // group title near top, next to button
		    { font: "Bold 12pt Sans-Serif" },
		    new go.Binding("text", "key")),
		  $(go.Placeholder,     // represents area for all member parts
		    { padding: 5, background: "white" })
		)
	  );

	// declare the Diagram.layout:
	diagram.layout = $(go.LayeredDigraphLayout,
			            { direction: 90, layerSpacing: 10 });

  diagram.initialContentAlignment = go.Spot.Center;
  diagram.animationManager.isEnabled = false;

	var nodeDataArray = [
	  { key: "Alpha" },
	  { key: "Omega", isGroup: true },
	  { key: "Beta", group: "Omega" },
	  { key: "Gamma", group: "Omega" },
	  { key: "Epsilon", group: "Omega" },
	  { key: "Zeta", group: "Omega" },
	  { key: "Delta" }
	];
	var linkDataArray = [
	  { from: "Alpha", to: "Omega" }, // from a Node to the Group
	  { from: "Beta", to: "Gamma" },  // this link is a member of the Group
	  { from: "Beta", to: "Epsilon" },  // this link is a member of the Group
	  { from: "Gamma", to: "Zeta" },  // this link is a member of the Group
	  { from: "Epsilon", to: "Zeta" },  // this link is a member of the Group
	  { from: "Omega", to: "Delta" }  // from the Group to a Node
	];

	diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

	diagram.linkSelectionAdornmentTemplate =
	  $(go.Adornment, "Link",
	    $(go.Placeholder),
	    $(go.Shape, "XLine", { name: "MID", width: 10, height: 10, stroke: "red" })
	);
	var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
	link.isSelected = true;

	return diagram;


  }

  //function for diagram 2
  //uses nodeTemplate, contextMenu, initialPosition, model and autoScale
  function nodeTemp_contMenu(diagram) {
  	diagram.allowDragOut = true;
  	diagram.allowDrop = true;
  	diagram.initialPosition = new go.Point(-10, -10);
  	diagram.autoScale = go.Diagram.Uniform;
  	diagram.undoManager.isEnabled = true;

  	diagram.nodeTemplate =
  	  $(go.Node, "Auto",
  	  	$(go.Shape, "RoundedRectangle",
  	  		new go.Binding("fill", "color")),
  	  	$(go.TextBlock,
  	  		{ margin: 3 },
  	  		new go.Binding("text", "key"))
  	  );

  	diagram.model = new go.GraphLinksModel(
  	  [ // a JavaScript Array of JavaScript objects, one per node;
		// the "color" property is added specifically for this app
		{ key: "Alpha", color: "lightblue" },
		{ key: "Beta", color: "orange" },
		{ key: "Gamma", color: "lightgreen" },
		{ key: "Delta", color: "pink" }
	  ],
	  [ // a JavaScript Array of JavaScript objects, one per link
		{ from: "Alpha", to: "Beta" },
		{ from: "Alpha", to: "Gamma" },
		{ from: "Beta", to: "Beta" },
		{ from: "Gamma", to: "Delta" },
		{ from: "Delta", to: "Alpha" }
	  ]);

  	diagram.contextMenu =
  	  $(go.Adornment, "Vertical",
  	  	$("ContextMenuButton",
  	  	  $(go.TextBlock, "Undo"),
  	  	  { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
  	  	  new go.Binding("visible", "", function(o) {
  	  	  	return o.diagram.commandHandler.canUndo();
  	  	   }).ofObject()),
  	  	$("ContextMenuButton",
  	  	  $(go.TextBlock, "Redo"),
  	  	  { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
  	  	  new go.Binding("visible", "", function(o) {
  	  	  	return o.diagram.commandHandler.canRedo();
  	  	   }).ofObject())
  	  );

  	return diagram;
  }

  //function for diagram 3
  //uses nodeTemplate, linkTemplate, layout, model
  function nodeTemp_linkTemp(diagram) {
  	diagram.allowGroup = false;
  	diagram.allowHorizontalScroll = false;
  	diagram.allowMove = false;
  	diagram.allowRelink = false;
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Ellipse", { fill: "white" }),
        $(go.TextBlock,
          new go.Binding("text", "key"))
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape));

    var nodeDataArray = [
      { key: "Alpha" },
      { key: "Beta", parent: "Alpha" },
      { key: "Gamma", parent: "Beta" },
      { key: "Delta", parent: "Beta" },
      { key: "Epsilon", parent: "Alpha" },
      { key: "Zeta", parent: "Epsilon" },
      { key: "Eta", parent: "Epsilon" },
      { key: "Theta", parent: "Epsilon" }
    ];
    diagram.model = new go.TreeModel(nodeDataArray);

  	diagram.layout = $(go.TreeLayout);  // automatic tree layout

  	return diagram;
  }

  //function for diagram 4
  //uses nodeTemplate, toolTip, initialContentAlignment, model
  function nodeTemp_toolTip(diagram) {
  	diagram.allowReshape = false;
  	diagram.allowResize = false;
  	diagram.allowRotate = false;
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle",
          { fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 5 },
          new go.Binding("text", "key")),
        {
          toolTip:                       // define a tooltip for each node
            $(go.Adornment, "Spot",      // that has several labels around it
              { background: "transparent" },  // avoid hiding tooltip when mouse moves
              $(go.Placeholder, { padding: 5 }),
              $(go.TextBlock,
                { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: "red" },
                new go.Binding("text", "key", function(s) { return "key: " + s; })),
              $(go.TextBlock, "Bottom",
                { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: "red" },
                new go.Binding("text", "color", function(s) { return "color: " + s; }))
            )  // end Adornment
        }
      );
    diagram.initialContentAlignment = go.Spot.Center;
    diagram.animationManager.isEnabled = false;
    var nodeDataArray = [
      { key: "Alpha", color: "lightyellow" },
      { key: "Beta", color: "orange" }
    ];
    var linkDataArray = [
      { from: "Alpha", to: "Beta" }
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    return diagram;
  }

  //function for diagram5
  //uses CommandHandler, groupTemplate, model
  function command_groupTemp(diagram) {
  	diagram.allowClipBoard = false;
  	diagram.allowSelect = false;
  	diagram.allowTextEdit = false;
  	diagram.allowUndo = false;
  	diagram.allowUngroup = false;
  	  // allow the group command to execute
    diagram.commandHandler.archetypeGroupData =
      { key: "Group", isGroup: true, color: "blue" };
    // modify the default group template to allow ungrouping
    diagram.groupTemplate.ungroupable = true;

    var nodeDataArray = [
      { key: "Alpha" },
      { key: "Beta" },
      { key: "Delta", group: "Epsilon" },
      { key: "Gamma", group: "Epsilon" },
      { key: "Epsilon", isGroup: true }
    ];
    var linkDataArray = [
      { from: "Alpha", to: "Beta" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // enable or disable a particular button
    function enable(name, ok) {
      var button = document.getElementById(name);
      if (button) button.disabled = !ok;
    }
    // enable or disable all command buttons
    function enableAll() {
      var cmdhnd = diagram.commandHandler;
      enable("SelectAll", cmdhnd.canSelectAll());
      enable("Cut", cmdhnd.canCutSelection());
      enable("Copy", cmdhnd.canCopySelection());
      enable("Paste", cmdhnd.canPasteSelection());
      enable("Delete", cmdhnd.canDeleteSelection());
      enable("Group", cmdhnd.canGroupSelection());
      enable("Ungroup", cmdhnd.canUngroupSelection());
      enable("Undo", cmdhnd.canUndo());
      enable("Redo", cmdhnd.canRedo());
    }
    // notice whenever the selection may have changed
    diagram.addDiagramListener("ChangedSelection", function(e) {
      enableAll();
    });
    // notice when the Paste command may need to be reenabled
    diagram.addDiagramListener("ClipboardChanged", function(e) {
      enableAll();
    });
    // notice whenever a transaction or undo/redo has occurred
    diagram.addModelChangedListener(function(e) {
      if (e.isTransactionFinished) enableAll();
    });
    // perform initial enablements after everything has settled down
    setTimeout(enableAll, 1);

    return diagram;

  }

  //function for diagram 6
  //uses nodeTemplateMap, model
  function nodeTempMap(diagram) {
  	diagram.allowVerticalScroll = false;
  	diagram.allowZoom = false;
  	var simpletemplate =
      $(go.Node, "Auto",
        $(go.Shape, "Ellipse",
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text", "key")),
        {
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },
                new go.Binding("text", "desc"))
            )
        }
      );

    // the "detailed" template shows all of the information in a Table Panel
    var detailtemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle",
          new go.Binding("fill", "color")),
        $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
          $(go.TextBlock, { row: 1, column: 0 }, "Description:"),
          $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "desc")),
          $(go.TextBlock, { row: 2, column: 0 }, "Color:"),
          $(go.TextBlock, { row: 2, column: 1 }, new go.Binding("text", "color"))
        )
      );

    // create the nodeTemplateMap, holding three node templates:
    var templmap = new go.Map(/*"string", go.Node*/);
    // for each of the node categories, specify which template to use
    templmap.add("simple", simpletemplate);
    templmap.add("detailed", detailtemplate);
    // for the default category, "", use the same template that Diagrams use by default;
    // this just shows the key value as a simple TextBlock
    templmap.add("", diagram.nodeTemplate);

    diagram.nodeTemplateMap = templmap;

    diagram.model.nodeDataArray = [
      { key: "Alpha", desc: "first letter", color: "green" },  // uses default category: ""
      { key: "Beta", desc: "second letter", color: "lightblue", category: "simple" },
      { key: "Gamma", desc: "third letter", color: "pink", category: "detailed" },
      { key: "Delta", desc: "fourth letter", color: "cyan", category: "detailed" }
    ];

    return diagram;
  }

  //function for diagram 7
  //uses grid, toolManager, initialContentAlignment, nodeSelectionAdornmentTemplate, nodeTemplate, model
  function grid_toolMan(diagram) {
    diagram.grid =
	  $(go.Panel, "Grid",
	  { gridCellSize: new go.Size(100, 100) },
	    $(go.Shape, "BarV", { fill: "rgba(255,0,0,0.1)", width: 50 }),
	    $(go.Shape, "BarH", { fill: "rgba(255,0,0,0.1)", height: 50 })
	    );

  diagram.initialContentAlignment = go.Spot.Center;
  diagram.animationManager.isEnabled = false;
	diagram.toolManager.draggingTool.isGridSnapEnabled = true;

	diagram.nodeTemplate =
	  $(go.Node, "Auto",
		{ width: 50, height: 50 },
		$(go.Shape, "Rectangle", { fill: "lightgray" }),
		$(go.TextBlock, { margin: 5},
		  new go.Binding("text", "key"))
	  );
	var nodeDataArray = [
	  { key: "Alpha" }
	];
	diagram.model = new go.GraphLinksModel(nodeDataArray);
	diagram.nodeSelectionAdornmentTemplate =
	  $(go.Adornment, "Auto",
	    $(go.Shape, { fill: null, stroke: "dodgerblue", strokeWidth: 6 }),
	    $(go.Placeholder, { margin: 3 }));
	var node = diagram.findNodeForKey("Alpha");
	node.resizable = false;
	node.rotatable = false;
	node.isSelected = true;

	return diagram;
  }

  //function for diagram 8
  //uses group template map, model
  function groupTempMap(diagram) {
  	diagram.groupTemplateMap.add("OfNodes",
      $(go.Group, "Auto",
        $(go.Panel, "Vertical",
          $(go.Panel, "Horizontal",
            { stretch: go.GraphObject.Horizontal, background: "#33D3E5" },
            $("SubGraphExpanderButton",
              { alignment: go.Spot.Right, margin: 2 }),
            $(go.TextBlock, "Group A",
              { width: 80, height: 20, margin: 5,
                font: "bold 16px sans-serif", stroke: "#006080"})
      ),  // end Horizontal Panel
      $(go.Placeholder,
        { padding: 5, alignment: go.Spot.TopLeft },
        new go.Binding("background", "isHighlighted", function(h) { return h ? "red" : "transparent"; }).ofObject())
    ),  // end Vertical Panel
    $(go.Shape, "Rectangle",
      {
        isPanelMain: true,
        fill: null,
        stroke: "#0099CC",
        strokeWidth: 2,
      })
    ));

    diagram.model =  new go.GraphLinksModel(
      [
      {"key":1, "text":"Group A", "isGroup":true, "category":"OfNodes"},
      {"text":"first A", "group":1, "key":2}]
    );

    return diagram;
  }

  //function for diagram 9
  // uses nodeTemplateMap, linkTemplateMap, model
  function TempMap(diagram) {
  	var bluegrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
    var greengrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
    var redgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
    var yellowgrad = $(go.Brush, go.Brush.Linear, { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
    var lightgrad = $(go.Brush, go.Brush.Linear, { 1: "#E6E6FA", 0: "#FFFAF0" });

    // the template for each attribute in a node's array of item data
    var itemTempl =
      $(go.Panel, "TableRow",
        new go.Binding("portId", "name", function(n) { return n + "ITEMPANEL"; }),
        new go.Binding("background", "row", function(i) { return (i === 2) ? "lightgreen" : "transparent"; }).ofObject(),
        $(go.Shape,
          new go.Binding("portId", "name", function(n) { return n + "SHAPE"; }),
          { column: 0, desiredSize: new go.Size(10, 10) },
          new go.Binding("figure", "figure"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            width: 120, height: 20,
            column: 1,
            stroke: "#333333",
            font: "bold 14px sans-serif"
          },
          new go.Binding("text", "name"),
          new go.Binding("portId", "name", function(n) { return n + "TEXTBLOCK"; }))
      );

    // define the Node template, representing an entity
    diagram.nodeTemplateMap.add("Complex",
      $(go.Node, "Auto",  // the whole node panel
        {
          locationSpot: go.Spot.Center,
          scale: 1.5,
          selectionAdorned: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          isShadowed: true,
          shadowColor: "#C5C1AA"
        },
        new go.Binding("location", "loc", go.Point.parse),
        // define the node's outer shape, which will surround the Table
        $(go.Shape, "Rectangle",
          { portId: "RECTANGLE" },
          { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
        $(go.Panel, "Table",
          { margin: 8, stretch: go.GraphObject.Fill },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          // the table header
          $(go.TextBlock,
            { portId: "HEADER", width: 80, height: 10 },
            {
              row: 0, alignment: go.Spot.Center,
              margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "key")),
          // the collapse/expand button
          $("Button",
            { portId: "BUTTON" },
            {
              row: 0, alignment: go.Spot.TopRight,
              "ButtonBorder.stroke": null,
              click: function(e, but) {
                var list = but.part.findObject("LIST");
                if (list !== null) {
                  list.diagram.startTransaction("collapse/expand");
                  list.visible = !list.visible;
                  var shape = but.findObject("SHAPE");
                  if (shape !== null) shape.figure = (list.visible ? "TriangleUp" : "TriangleDown");
                  list.diagram.commitTransaction("collapse/expand");
                }
              }
            },
            $(go.Shape, "TriangleUp",
              { name: "SHAPE", width: 6, height: 4 })),
          // the list of Panels, each showing an attribute
          $(go.Panel, "Table",
            {
              name: "LIST", background: "pink", portId: "LIST",
              row: 1,
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              itemTemplate: itemTempl
            },
            new go.Binding("itemArray", "items"))
        )  // end Table Panel
      ));  // end Node

    // annotations -- brown text
    diagram.nodeTemplateMap.add("Comment",
      $(go.Node,
        new go.Binding("location", "loc", go.Point.parse),
        { locationSpot: go.Spot.Center },
        $(go.TextBlock,
          { stroke: "brown", width: 80, height: 50 },
          new go.Binding("text"),
          new go.Binding("font", "bold", function(b) { return b ? "bold 10pt sans-serif" : "10pt sans-serif"; }))
      ));

    // so that comments can point at any named GraphObject in a Link
    diagram.nodeTemplateMap.add("LinkLabel",
      $(go.Node,
        new go.Binding("segmentIndex"),
        new go.Binding("segmentOffset")
      ));

    // brown curved links connecting with a Comment node
    diagram.linkTemplateMap.add("Comment",
      $(go.Link,
        {  },
        new go.Binding("curviness"),
        $(go.Shape, { stroke: "brown" }),
        $(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
      ));

    var model = new go.GraphLinksModel();
    model.linkToPortIdProperty = "pid";
    model.linkLabelKeysProperty = "labs";
    model.nodeDataArray = [


      { key: 11, category: "Complex", loc: "0 230",
         items: [{ name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
                  { name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
                  { name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
                  { name: "Address", iskey: false, figure: "Cube1", color: bluegrad }]
      },

      { key: -17, text: "a TableRow Panel\nfor item #2\nwith lightgreen\nbackground", category: "Comment", loc: "-200 250" }
    ];
    model.linkDataArray = [
      { from: -17, category: "Comment", to: 11, pid: "ContactNameITEMPANEL" }
    ];
    diagram.model = model;

    return diagram;
  }

  //test 1
  diagramReset.add(new Test('group_template', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = group_template(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = group_template(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = group_template(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();


  })); // end test

  //test 2
  diagramReset.add(new Test('nodeTemp_contMenu', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = nodeTemp_contMenu(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = nodeTemp_contMenu(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = nodeTemp_contMenu(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();


  })); // end test

  //test 3
  diagramReset.add(new Test('nodeTemp_linkTemp', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = nodeTemp_linkTemp(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = nodeTemp_linkTemp(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = nodeTemp_linkTemp(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 4
  diagramReset.add(new Test('nodeTemp_toolTip', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = nodeTemp_toolTip(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = nodeTemp_toolTip(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = nodeTemp_toolTip(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 5
  diagramReset.add(new Test('command_groupTemp', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = command_groupTemp(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = command_groupTemp(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = command_groupTemp(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 6
  diagramReset.add(new Test('nodeTempMap', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = nodeTempMap(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = nodeTempMap(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = nodeTempMap(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 7
  diagramReset.add(new Test('grid_toolMan', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = grid_toolMan(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = grid_toolMan(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = grid_toolMan(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 8
  diagramReset.add(new Test('groupTempMap', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = groupTempMap(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = groupTempMap(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = groupTempMap(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test

  //test 9
  diagramReset.add(new Test('TempMap', null,
    function (test) {
      window.initD1 = document.createElement('div');
	  window.initD1.innerHTML = '<div id="DiagramDiv1" style="border: solid 1px black; width: 200px; height: 200px"></div>';
      window.initD1.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD1);
	  window.D1 = $(go.Diagram, "DiagramDiv1", { "animationManager.isEnabled": false });
      var diagram1 = TempMap(D1);
      //create new div
      window.initD2 = document.createElement('div');
	  window.initD2.innerHTML = '<div id="DiagramDiv2" style="border: solid 2px black; width: 200px; height: 200px"></div>';
      window.initD2.setAttribute('style', "position: absolute; top: 0px; left: 0px; width: 60; height: 200px; background-color: paleTurquoise;");
	  document.body.appendChild(window.initD2);
	  window.D2 = $(go.Diagram, "DiagramDiv2", { "animationManager.isEnabled": false });
      var diagram2 = TempMap(D2);
      diagram1.reset(); diagram1.animationManager.isEnabled = false;
      diagram1 = TempMap(D1);
      test.diagram1 = diagram1;
      test.diagram2 = diagram2;

    }, // END SETUP
    null,
    function (test) {
      var diagram1 = test.diagram1;
      var diagram2 = test.diagram2;
      var map1 = new go.Map();
      var map2 = new go.Map();
      var array = [];
      if (compare(diagram1, diagram2, map1, map2, array)) {
      	test.assert(true);
      } else {
      	test.assert(false, array);
      }

      teardown();

  })); // end test


  diagramReset.add(new Test("Clear Diagram", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      diagram.model = new go.GraphLinksModel(
        [{ key: "Alpha", color: "lightblue" }, { key: "Beta", color: "orange" }, { key: "Gamma", color: "lightgreen" }, { key: "Delta", color: "pink" }],
        [{ from: "Alpha", to: "Beta" }, { from: "Alpha", to: "Gamma" }, { from: "Beta", to: "Beta" },
        { from: "Gamma", to: "Delta" }, { from: "Delta", to: "Alpha" }]);
      diagram.undoManager.isEnabled = true;
    },
    function (test) {
      var diagram = test.diagram;

      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(alpha, "Alpha should exist");
      alpha.isSelected = true;
      var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(link, "should have found a Link");
      link.isSelected = true;

      test.assert(diagram.undoManager.history.count === 0, "should have no history now");
      diagram.model.commit(function(m) {
        m.set(m.nodeDataArray[0], "color", "cyan");
      });
    },
    function (test) {
      var diagram = test.diagram;
      var layer = diagram.findLayer("");

      test.assert(diagram.model.nodeDataArray.length === 4, "should have node data");
      test.assert(diagram.model.linkDataArray.length === 5, "should have link data");
      test.assert(diagram.nodes.count === 4, "should have four nodes");
      test.assert(diagram.links.count === 5, "should have five links");
      test.assert(layer.parts.count === 9);
      var alpha = diagram.findNodeForKey("Alpha");
      test.assert(alpha !== null && alpha.isSelected && alpha.adornments.count === 1 && alpha.findAdornment("Selection") instanceof go.Adornment, "Alpha should have a selection Adornment");
      var link = diagram.findLinkForData(diagram.model.linkDataArray[0]);
      test.assert(link !== null && link.isSelected && link.adornments.count === 1 && link.findAdornment("Selection") instanceof go.Adornment, "link should be selected");
      test.assert(diagram.documentBounds.width > 50, "documentBounds should be significant");
      test.assert(diagram.undoManager.history.count > 0, "should have some history now");

      diagram.clear();

      test.assert(diagram.model.nodeDataArray.length === 0, "should be no node data");
      test.assert(diagram.model.linkDataArray.length === 0, "should be no link data");
      test.assert(diagram.nodes.count === 0, "should have no nodes");
      test.assert(diagram.links.count === 0, "should have no links");
      test.assert(layer.parts.count === 0, "should not have any nodes or links in the layer");
      alpha = diagram.findNodeForKey("Alpha");
      test.assert(alpha === null, "Alpha should not be found any more");
      test.assert(diagram.documentBounds.width < 20, "documentBounds should be insignificant");
      test.assert(diagram.undoManager.history.count === 0, "undoManager.history should be clear");
    }
  ));


})();




