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

function simulateMouseEvent(type, element) {
  var evt = null;
  try {
    evt = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window
    });
  } catch(e) {
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  element.dispatchEvent(evt);
}



(function() {
  var $ = go.GraphObject.make;

  var viewportTests = new TestCollection('viewport');
  TestRoot.add(viewportTests);

  function setup(w, h) {
    window.D1Div = document.createElement('div');
    if (w === undefined) {
      window.D1Div.innerHTML = '<div id="yep" style="border: solid 1px black; width: 400px; height: 400px"></div>';
    } else {
      window.D1Div.innerHTML = '<div id="yep" style="border: solid 1px black; width: ' + w + 'px; height: ' + h + 'px"></div>';
    }

    document.body.appendChild(window.D1Div);
    window.D1 =
      $(go.Diagram, "yep", {
        "animationManager.isEnabled": false
      });
    return D1;
  }

  function teardown() {
    window.D1.div = null;
    document.body.removeChild(D1Div);
    window.D1 = null;
    window.D1Div = null;
  }


  // unlike setup, this one returns D1Div and you must use window.D1 to access D1
  function setup2() {
    window.D1Div = document.createElement('div');
    D1Div.id = 'dcontainer';
    window.D1Div.innerHTML = '<div id="yep" style="border: solid 1px black; width: 400px; height: 400px"></div>';

    document.body.appendChild(window.D1Div);
    window.D1 =
      $(go.Diagram, "yep", {
        "animationManager.isEnabled": false
      });
    return D1Div;
  }


  // 390x390 node in 400x400 space; no other options; must not have scrollbars
  viewportTests.add(new Test('viewport >= document', null,
    function (test) {
      var D1 = setup();

      // define a simple Node template
      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 390, height: 390 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );
      D1.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      test.assert(D1.div.children[1].children[0].style.width === "1px", "shouldn't have horizontal scrollbar");
      test.assert(D1.div.children[1].children[0].style.height === "1px", "shouldn't have vertical scrollbar");
      teardown();
  })); // end test

  // 400x400 node in 400x400 space; no other options; must have scrollbars
  viewportTests.add(new Test('viewport < document', null,
    function (test) {
      var D1 = setup();

      // define a simple Node template
      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 400, height: 400 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );
      D1.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      test.assert(D1.div.children[1].children[0].style.width !== "1px", "should have horizontal scrollbar");
      test.assert(D1.div.children[1].children[0].style.height !== "1px", "should have vertical scrollbar");
      teardown();
  })); // end test

  // 400x400 node in 400x400 space; uniform autoscale; must not have scrollbars
  viewportTests.add(new Test('viewport < document, uniform autoscale', null,
    function (test) {
      var D1 = setup();

      D1.autoScale = go.Diagram.Uniform;

      // define a simple Node template
      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 400, height: 400 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );
      D1.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      test.assert(D1.div.children[1].children[0].style.width === "1px", "shouldn't have horizontal scrollbar");
      test.assert(D1.div.children[1].children[0].style.height === "1px", "shouldn't have vertical scrollbar");
      teardown();
  })); // end test

  // 400x390 node in 400x400 space; no other options; must have horizontal scrollbar, which causes vertical scrollbar
  viewportTests.add(new Test('horiz scrollbar requires vert scrollbar', null,
    function (test) {
      var D1 = setup();

      // define a simple Node template
      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 400, height: 390 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );
      D1.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      if (D1.viewportBounds.width !== 400) {
        test.assert(D1.div.children[1].children[0].style.width !== "1px", "should have horizontal scrollbar");
        test.assert(D1.div.children[1].children[0].style.height !== "1px", "should have vertical scrollbar");
      }
      teardown();
  })); // end test

  // 390x400 node in 400x400 space; no other options; must have vertical scrollbar, which causes horizontal scrollbar
  viewportTests.add(new Test('vert scrollbar requires horiz scrollbar', null,
    function (test) {
      var D1 = setup();

      // define a simple Node template
      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 390, height: 400 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );
      D1.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      if (D1.viewportBounds.height !== 400) {
        test.assert(D1.div.children[1].children[0].style.width !== "1px", "should have horizontal scrollbar");
        test.assert(D1.div.children[1].children[0].style.height !== "1px", "should have vertical scrollbar");
      }
      teardown();
  })); // end test

  // modified org chart editor; make sure there's no vertical scrollbar
  viewportTests.add(new Test('modified org chart', null,
    function (test) {
      var D1 = setup(500,500);

      D1.initialContentAlignment = go.Spot.Center,
      D1.validCycle = go.Diagram.CycleDestinationTree,
      D1.layout =
        $(go.TreeLayout,
          {
            treeStyle: go.TreeLayout.StyleLastParents,
            arrangement: go.TreeLayout.ArrangementHorizontal,
            // properties for most of the tree:
            angle: 90,
            layerSpacing: 35,
            // properties for the "last parents":
            alternateAngle: 90,
            alternateLayerSpacing: 35,
            alternateAlignment: go.TreeLayout.AlignmentBus,
            alternateNodeSpacing: 20
          });

    // This function provides a common style for most of the TextBlocks.
    // Some of these values may be overridden in a particular TextBlock.
    function textStyle() {
      return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
    }

    // define the Node template
    D1.nodeTemplate =
      $(go.Node, "Auto",
        // for sorting, have the Node.text be the data.name
        new go.Binding("text", "name"),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding("layerName", "isSelected", function(sel) { return sel ? "Foreground" : ""; }).ofObject(),
        // define the node's outer shape
        $(go.Shape, "Rectangle",
          {
            name: "SHAPE", fill: "red", stroke: null,
            // set the port properties:
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
          }),
        $(go.Panel, "Horizontal",
          $(go.Picture,
            {
              name: 'Picture',
              desiredSize: new go.Size(39, 50),
              margin: new go.Margin(6, 8, 6, 10),
            }),
          // define the panel where the text will appear
          $(go.Panel, "Table",
            {
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(6, 10, 0, 3),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, { column: 2, width: 4 }),
            $(go.TextBlock, textStyle(),  // the name
              {
                row: 0, column: 0, columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding("text", "name").makeTwoWay()),
            $(go.TextBlock, "Title: ", textStyle(),
              { row: 1, column: 0 }),
            $(go.TextBlock, textStyle(),
              {
                row: 1, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "title").makeTwoWay()),
            $(go.TextBlock, textStyle(),
              { row: 2, column: 0 },
              new go.Binding("text", "key", function(v) {return "ID: " + v;})),
            $(go.TextBlock, textStyle(),
              { row: 2, column: 3, },
              new go.Binding("text", "parent", function(v) {return "Boss: " + v;})),
            $(go.TextBlock, textStyle(),  // the comments
              {
                row: 3, column: 0, columnSpan: 5,
                font: "italic 9pt sans-serif",
                wrap: go.TextBlock.WrapFit,
                editable: true,  // by default newlines are allowed
                minSize: new go.Size(10, 14)
              },
              new go.Binding("text", "comments").makeTwoWay())
          )  // end Table Panel
        ) // end Horizontal Panel
      );  // end Node

    // define the Link template
    D1.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        { corner: 5, relinkableFrom: true, relinkableTo: true },
        $(go.Shape, { strokeWidth: 4, stroke: "#00a4a4" }));  // the link shape

    D1.model = go.Model.fromJson(
'{ "class": "go.TreeModel",'+
'  "nodeDataArray": [ '+
'{"key":"1", "name":"Stella Payne Diaz", "title":"CEO"},'+
'{"key":"2", "name":"Luke Warm", "title":"VP Marketing/Sales", "parent":"1"},'+
'{"key":"3", "name":"Meg Meehan Hoffa", "title":"Sales", "parent":"2"},'+
'{"key":"4", "name":"Peggy Flaming", "title":"VP Engineering", "parent":"1"},'+
'{"key":"5", "name":"Saul Wellingood", "title":"Manufacturing", "parent":"4"},'+
'{"key":"6", "name":"Al Ligori", "title":"Marketing", "parent":"2"},'+
'{"key":"7", "name":"Dot Stubadd", "title":"Sales Rep", "parent":"3"},'+
'{"key":"8", "name":"Les Ismore", "title":"Project Mgr", "parent":"5"},'+
'{"key":"9", "name":"April Lynn Parris", "title":"Events Mgr", "parent":"6"},'+
'{"key":"10", "name":"Xavier Breath", "title":"Engineering", "parent":"4"},'+
'{"key":"11", "name":"Anita Hammer", "title":"Process", "parent":"5"},'+
'{"key":"12", "name":"Billy Aiken", "title":"Software", "parent":"10"},'+
'{"key":"13", "name":"Stan Wellback", "title":"Testing", "parent":"10"},'+
'{"key":"14", "name":"Marge Innovera", "title":"Hardware", "parent":"10"},'+
'{"key":"15", "name":"Evan Elpus", "title":"Quality", "parent":"5"},'+
'{"key":"16", "name":"Lotta B. Essen", "title":"Sales Rep", "parent":"3"}'+
' ]}'
      );

    }, // END SETUP
    null,
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      test.assert(D1.div.children[1].children[0].style.width !== "1px", "should have horizontal scrollbar");
      test.assert(D1.div.children[1].children[0].style.height === "1px", "shouldn't have vertical scrollbar");
      teardown();
  })); // end test

  // test for being within 1 pixel (okay, 2)
  function withinOnePoint(a, b) {
    return withinOne(a.x, b.x) && withinOne(a.y, b.y);
  }

  function withinOne(x, y) {
    var d = x - y;
    return d < 2 && d > -2;
  };

  // scroll past left, ensure diagram is positioned properly
  viewportTests.add(new Test('scroll left edge', null,
    function (test) {
      var D1 = setup();

      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 200, height: 200 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );

      D1.model = new go.Model(
        [
          { key: 1, color: "lightblue" },
          { key: 2, color: "orange" },
          { key: 3, color: "lightgreen" },
          { key: 4, color: "pink" }
        ]
      );

    }, // END SETUP
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      var scrollDiv = D1.div.children[1];
      // simulate starting and ending a scroll at left
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollLeft = 50;
      D1.diagramScroll(scrollDiv);
      scrollDiv.scrollLeft = 0;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
    }, // END EXECUTE
    function (test) {
      test.assert(withinOnePoint(D1.position, new go.Point(D1.documentBounds.x, D1.documentBounds.y)), "diagram not properly scrolled");
      teardown();
    } // END CHECK
  ));

  // scroll past right, ensure diagram is positioned properly
  viewportTests.add(new Test('scroll right edge', null,
    function (test) {
      var D1 = setup();

      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 200, height: 200 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );

      D1.model = new go.Model(
        [
          { key: 1, color: "lightblue" },
          { key: 2, color: "orange" },
          { key: 3, color: "lightgreen" },
          { key: 4, color: "pink" }
        ]
      );

    }, // END SETUP
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      var scrollDiv = D1.div.children[1];
      var scrollMax = scrollDiv.scrollWidth - scrollDiv.clientWidth; // the end of the scrollbar
      // scroll to right edge
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollLeft = scrollMax;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
      // simulate starting and ending a scroll at right
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollLeft = 20;
      D1.diagramScroll(scrollDiv);
      scrollDiv.scrollLeft = scrollMax;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
    }, // END EXECUTE
    function (test) {
      var scrollMax = D1.div.children[1].scrollWidth - D1.div.children[1].clientWidth;
      test.assert(withinOnePoint(D1.position, new go.Point(scrollMax + D1.documentBounds.x, D1.documentBounds.y)), "diagram not properly scrolled");
      teardown();
    } // END CHECK
  ));

  // scroll past top, ensure diagram is positioned properly
  viewportTests.add(new Test('scroll top edge', null,
    function (test) {
      var D1 = setup();

      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 200, height: 200 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );

      D1.model = new go.Model(
        [
          { key: 1, color: "lightblue" },
          { key: 2, color: "orange" },
          { key: 3, color: "lightgreen" },
          { key: 4, color: "pink" }
        ]
      );

    }, // END SETUP
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      var scrollDiv = D1.div.children[1];
      // simulate starting and ending a scroll at top
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollTop = 50;
      D1.diagramScroll(scrollDiv);
      scrollDiv.scrollTop = 0;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
    }, // END EXECUTE
    function (test) {
      test.assert(withinOnePoint(D1.position, new go.Point(D1.documentBounds.x, D1.documentBounds.y)), "diagram not properly scrolled");
      teardown();
    } // END CHECK
  ));

  // scroll past bottom, ensure diagram is positioned properly
  viewportTests.add(new Test('scroll bottom edge', null,
    function (test) {
      var D1 = setup();

      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 200, height: 200 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );

      D1.model = new go.Model(
        [
          { key: 1, color: "lightblue" },
          { key: 2, color: "orange" },
          { key: 3, color: "lightgreen" },
          { key: 4, color: "pink" }
        ]
      );

    }, // END SETUP
    function (test) {
      D1.startTransaction();
      D1.commitTransaction();
      var scrollDiv = D1.div.children[1];
      var scrollMax = scrollDiv.scrollHeight - scrollDiv.clientHeight; // the end of the scrollbar
      // scroll to bottom edge
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollTop = scrollMax;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
      // simulate starting and ending a scroll at bottom
      simulateMouseEvent("mousedown", scrollDiv);
      scrollDiv.scrollTop = 20;
      D1.diagramScroll(scrollDiv);
      scrollDiv.scrollTop = scrollMax;
      D1.diagramScroll(scrollDiv);
      simulateMouseEvent("mouseup", scrollDiv);
    }, // END EXECUTE
    function (test) {
      var scrollMax = D1.div.children[1].scrollHeight - D1.div.children[1].clientHeight;
      test.assert(withinOnePoint(D1.position, new go.Point(D1.documentBounds.x, scrollMax + D1.documentBounds.y)), "diagram not properly scrolled");
      teardown();
    } // END CHECK
  )); // end test




  // Make sure a keydown on the diagram does not bubble
  viewportTests.add(new Test('keydown on diagram', null,
    function (test) {
      var D1Div = setup2();
      test.addev = function(e) {
          test.assert(false, "the keydown event bubbled when it shouldn't have");
          e.preventDefault();
        };
      D1Div.addEventListener('keydown', test.addev);

      var D1 = window.D1;

      D1.nodeTemplate =
        $(go.Node, "Auto",
          { width: 200, height: 200 },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "color"))
        );

      D1.model = new go.Model(
        [
          { key: 1, color: "lightblue" },
          { key: 2, color: "orange" },
          { key: 3, color: "lightgreen" },
          { key: 4, color: "pink" }
        ]
      );

    }, // END SETUP
    function (test) {}, // END EXECUTE
    function (test) {
      // TODO

      D1.startTransaction();
      D1.commitTransaction();
      D1.isMouseOverDiagram = true;
      try {
        var event = new KeyboardEvent("keydown", {
          bubbles : true,
          cancelable : true,
          key : "ArrowDown",
          code : "ArrowDown"
        });
        Object.defineProperty(event, 'which', {get:function(){return 40; }})
        Object.defineProperty(event, 'keyCode', {get:function(){return 40; }})

        D1Div.firstChild.firstChild.dispatchEvent(event);
      } catch (ex) {

      }


      D1Div.removeEventListener('keydown', test.addev);
      teardown();
    } // END CHECK
  )); // end test

  // this test cannot be run multiple times in quick succession, due to modifying the diagram's div and asynchronous event handling
  viewportTests.add(new Test("ResizeObserver", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      var ws = window.getComputedStyle(diag.div);
      var w = parseInt(ws["width"]);

      diag.layout = new go.GridLayout();
      diag.layout.isViewportSized = true;  // just to be sure
      diag.startTransaction();
      diag.commitTransaction(); // clear the initial layout
      diag.layout.isValidLayout = true;    // also to be sure
      var numlayouts = 0;
      diag.addDiagramListener("LayoutCompleted", function(e) { numlayouts++; });

      diag.div.style.width = (w-20) + "px";
      if (!("ResizeObserver" in window)) diag.requestUpdate();

      setTimeout(function() {
        var ws2 = window.getComputedStyle(diag.div);
        var w2 = parseInt(ws2["width"]);
        console.log(w2, diag.viewportBounds.size);
        test.assert(Math.abs(w2 - (w - 20)) <= 1, "narrowing DIV didn't make viewport narrower; should be " + w + "-20 but now is " + w2);
        test.assert(numlayouts === 1, "Diagram.layout if Layout.isViewportSized should now be invalid");

        // restore the DIV width
        diag.div.style.width = w + "px";
      }, 300);  // must be greater than the debounce window for ResizeObserver events, plus time to settle
    }
  ));

})(); // End test system


