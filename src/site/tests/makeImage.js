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
var intro = new TestCollection('Image tests');
TestRoot.add(intro);
var $ = go.GraphObject.make;
var allDiags = [];
var allDivs = [];

  var dataurl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAACHUlEQVR4Xu2csQ6CQADFDn/7/HeMk4sm2lhykDLzqrSgG9s+xj4ucNwucRVjbAVZ624syFo9ekIW61GQgkgG+lOXxFJsQag5aVcQSSzFFoSak3YFkcRSbEGoOWlXEEksxRaEmpN2BZHEUmxBqDlpVxBJLMUWhJqTdgWRxFJsQag5aVcQSSzFFoSak3YFkcRSbEGoOWlXEEksxRaEmpN2BZHEUmxBqDlpVxBJLMUWhJqTdgWRxFJsQag5aVcQSSzFFoSak3YFkcRSbEGoOWlXEEksxRaEmpN2BZHEUmxBqDlpVxBJLMUWhJqTdgWRxFJsQag5aVcQSSzFFoSak3YFkcRSbEGouT/utg+s5xt1znqc+m1ABVnstrtkkDH2Mz/gb2+ROedit873X2cryPeyjjizIEdY/uEzTh7kdaVz3n+47HVPLchibQpSEMdAP1mOV0wtCFbnDAvieMXUgmB1zrAgjldMLQhW5wwL4njF1IJgdc6wII5XTC0IVucMC+J4xdSCYHXOsCCOV0wtCFbnDAvieMXUgmB1zrAgjldMLQhW5wwL4njF1IJgdc6wII5XTC0IVucMC+J4xdSCYHXOsCCOV0wtCFbnDAvieMXUgmB1zrAgjldMLQhW5wwL4njF1IJgdc6wII5XTC0IVucMC+J4xdSCYHXOsCCOV0wtCFbnDAvieMXUgmB1zrAgjldMLQhW5wwL4njF1KsEeQCJGkIipiIvGgAAAABJRU5ErkJggg==';
  window.oneGlobalImage  = new Image();
  oneGlobalImage.src = dataurl;


function setupTestDiagram(id) {
  allDivs[id] = document.createElement('div');
  allDivs[id].innerHTML = '<div id="yep' +id+ '" style="border: solid 1px black; width: 400px; height: 400px"></div>';
  document.body.appendChild(allDivs[id]);
  allDiags[id] = $(go.Diagram, ("yep" +id), {
    "animationManager.isEnabled":false
  });

  return allDiags[id];
}
function getTestDiagram(id) {
  return allDiags[id];
}
function tearDownTestDiagram(id) {
  allDiags[id].div = null;
  allDiags[id] = null;
  document.body.removeChild(allDivs[id]);
  allDivs[id] = null;
}

intro.add(new Test('making images', null,
    function (test) {
      var diagram = setupTestDiagram(0);
      diagram.reset();

    var $ = go.GraphObject.make;  // for conciseness in defining templates

    diagram.grid.visible = true,  // display a grid in the background of the diagram

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape,
          {
            figure: "RoundedRectangle"
        },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 3, name:'text', height: 14.3 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key")));

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    var nodeDataArray = [
      { key: "Alpha", color: "rgba(255,0,0,.3)" },
      { key: "Beta", color: "orange" },
      { key: "Aamma", color: "rgba(0,0,255,.3)" },
      { key: "Delta", color: "pink" }
    ];
    for (var i = 0; i < 100; i++) {
      var c = (i % 3 === 0) ? "pink" : "lightgreen";
      if (i > 28) c = "lightblue"
      nodeDataArray.push({ key: "Delta" + i, color: c })
    };
    var linkDataArray = [
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // enable Ctrl-Z to undo and Ctrl-Y to redo
    // (should do this after assigning Diagram.model)
    diagram.undoManager.isEnabled = true;
diagram.scale = 4.5;


    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(0);

  var myPartsList = new go.List();

  myPartsList.add(diagram.findNodeForKey("Beta"));
  myPartsList.add(diagram.findNodeForKey("Delta"));
  myPartsList.add(diagram.findNodeForKey("Aamma"));
  myPartsList.add(diagram.findNodeForKey("Aamma"));
  myPartsList.add(diagram.findNodeForKey("Aamma"));
  // myPartsList.add(diagram.grid); // don't want this, it's not a Part

  var times = 0;
  function tfinished() {
    times++;
    if (times === 5) tearDownTestDiagram(0);
  }

  function done(img, exist, size){
    var tempcan = document.createElement('canvas');
    var tempctx = tempcan.getContext('2d');
    tempcan.width = img.width;
    tempcan.height = img.height;
    if (size) {
      test.assert(Math.abs(size.width - img.width) < 3, "width off, wanted: " + size.width + ' got: ' +img.width);
      test.assert(size.height === img.height, "size height off, wanted: " + size.height + ' got: ' +img.height);
    }
    tempctx.drawImage(img, 0, 0);
    var l = exist.length;
    for (var i = 0; i < l; i++) {
      var x = exist[i][0];
      var y = exist[i][1];
      var hit = exist[i][2];
      var color = exist[i][3];
      var data = tempctx.getImageData(x, y, 1, 1).data;
      if (color === undefined) {
        // test if pixel is NOT transparent
        test.assert((data[3] > 0) === hit, "expected " + hit + "but got " + (data[3] > 0) + "- at " + x +","+y);
        //if (hit) {tempctx.fillStyle = 'red'; tempctx.fillRect(x,y,1,1); }
        //else {tempctx.fillStyle = 'blue';  tempctx.fillRect(x,y,1,1); }
      } else {
        // tests a specific color
        test.assert(
          data[0] === color[0] &&
          data[1] === color[1] &&
          data[2] === color[2] &&
          within1(data[3], color[3])
          )
      }
    }
    tfinished();
  }

  function within1(a, b) {
    return (a+1 >= b && a-1 <= b)
  }


  // 1
  var img1 = new Image();
  img1.onload = function() {
    done(img1, [[50,50, true] ,[200,50, true] ,[325,50, true] ,[113,50, false] ,[53,14, false] ,[1,31, false] ], new go.Size(390,94))
  }
  img1.src = diagram.makeImageData({parts: myPartsList, scale: 2, padding: new go.Margin(20, 5, 20, 5), omitTemporary: false})

  // 2
  var img2 = new Image();
  img2.onload = function() {
    done(img2, [[21,15, true] ,[100,15, true] ,[180,15, true] ], new go.Size(192,29))
  }
  img2.src =diagram.makeImageData({parts: myPartsList})


diagram.startTransaction('a');
diagram.findNodeForKey("Beta").position = new go.Point(-50,-50)
diagram.commitTransaction('a');


  // 3
  var img3 = new Image();
  img3.onload = function() {
    done(img3, [[15,15, true] ,[218,60, true] ,[50,50, false] ], new go.Size(312,79))
  }
  img3.src = diagram.makeImageData({parts: myPartsList});


//40 to 190
var list =   [[20,15, true] ,[67,57, true] ,[67,130, true] ,[67,195, true] ];
  for (var i = 40; i < 190; i++){list.push([25,i, false]); }
  list.push([19,22, true,[255, 165, 0, 255]]);
  list.push([61,71, true,[255, 0, 0, 76]]);

  // 4
  var img4 = new Image();
  img4.onload = function() {
    done(img4, list, new go.Size(100,200))
  }
  img4.src =diagram.makeImageData({scale: 1, size: new go.Size(100,200)})


  // 5
  var img5 = new Image();
  img5.onload = function() {
    done(img5, [[22,50, true] ,[24,50, true] ], new go.Size(100,100))
  }
  img5.src =diagram.makeImageData({scale: 1, size: new go.Size(100,100), showTemporary: true })




  }, // END TEST
  null
));



function commonSetup(diagram) {
  diagram.initialContentAlignment = go.Spot.Center;

  // define a simple Node template
  diagram.nodeTemplate =
    $(go.Node, "Table",
      { width: 100, height: 30, background: 'lightblue' },
      new go.Binding('background')
    );

  diagram.model = new go.GraphLinksModel(
  [ { key: "1", background: "RGB(255,0,0)" },
    { key: "2", background: "RGB(0,255,0)" },
    { key: "3", background: "RGB(0,0,255)" },
    { key: "4", background: "RGB(0,0,0)" }
  ], []);

}

function arrayEquals(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  var l = arr1.length;
  for (var i = 0; i < l; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function getimg(ctx, x, y) {
  return ctx.getImageData(x, y, 1, 1).data;
}

intro.add(new Test('Scale: 1', null,
    function (test) {
      var diagram = setupTestDiagram(1);
      diagram.reset();

      commonSetup(diagram);

    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(1);

      var img = new Image();
      img.onload = function() {
        // test that the scale:1 image is the right size
        test.assert(img.width === 222);
        test.assert(img.height === 102);

        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);


        // "White" space (remember: white on the canvas is really fully transparent black)
        test.assert(arrayEquals(getimg(ctx, 0, 0), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 221, 101), [0, 0, 0, 0]));
        // red
        test.assert(arrayEquals(getimg(ctx, 2, 2), [255, 0, 0, 255]));
        // green
        test.assert(arrayEquals(getimg(ctx, 122, 2), [0, 255, 0, 255]));
        // blue
        test.assert(arrayEquals(getimg(ctx, 2, 90), [0, 0, 255, 255]));
        // Black node
        test.assert(arrayEquals(getimg(ctx, 211, 91), [0, 0, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 220, 100), [0, 0, 0, 255]));
        tearDownTestDiagram(1);
      }
      img.src = diagram.makeImageData( { scale: 1 } );

    }, // END TEST
    null
));



intro.add(new Test('Size: 100x100', null,
    function (test) {
      var diagram = setupTestDiagram(2);
      diagram.reset();

      commonSetup(diagram);

    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(2);

      var img = new Image();
      img.onload = function() {
        // test that the go.Size(100,100) is really 100x100
        test.assert(img.width === 100);
        test.assert(img.height === 100);

        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        // red
        test.assert(arrayEquals(getimg(ctx, 7, 6), [255, 0, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 40, 10), [255, 0, 0, 255]));

        // green
        test.assert(arrayEquals(getimg(ctx, 57, 3), [0, 255, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 96, 11), [0, 255, 0, 255]));

        // blue
        test.assert(arrayEquals(getimg(ctx, 2, 34), [0, 0, 255, 255]));
        test.assert(arrayEquals(getimg(ctx, 41, 42), [0, 0, 255, 255]));

        // black
        test.assert(arrayEquals(getimg(ctx, 60, 35), [0, 0, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 95, 41), [0, 0, 0, 255]));

        // empty
        test.assert(arrayEquals(getimg(ctx, 43, 18), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 57, 18), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 99, 00), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 99, 10), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 25, 50), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 75, 50), [0, 0, 0, 0]));
        tearDownTestDiagram(2);
      }
      img.src = diagram.makeImageData( { size: new go.Size(100,100) } );

    }, // END TEST
    null
));


intro.add(new Test('Size: 100xNaN', null,
    function (test) {
      var diagram =  setupTestDiagram(3);
      diagram.reset();

      commonSetup(diagram);

    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(3);

      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 100);
        test.assert(img.height === 47);
        tearDownTestDiagram(3);
      }
      img.src = diagram.makeImageData( { size: new go.Size(100,NaN) } );

    }, // END TEST
    null
));

intro.add(new Test('Size: NaNx100', null,
    function (test) {
      var diagram =setupTestDiagram(4);
      diagram.reset();

      commonSetup(diagram);

    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(4);

      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 218);
        test.assert(img.height === 100);
        tearDownTestDiagram(4);
      }
      img.src = diagram.makeImageData( { size: new go.Size(NaN,100) } );

    }, // END TEST
    null
));




intro.add(new Test('Parts 1 and 2', null,
    function (test) {
      var diagram = setupTestDiagram(5);
      diagram.reset();
      commonSetup(diagram);
    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(5);
      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 222);
        test.assert(img.height === 32);
        tearDownTestDiagram(5);
      }
      var s = new go.Set();
      s.add(diagram.findNodeForKey('1'));
      s.add(diagram.findNodeForKey('2'));
      img.src = diagram.makeImageData( { parts: s } );

    }, // END TEST
    null
));

intro.add(new Test('Parts 1 and 3', null,
    function (test) {
      var diagram = setupTestDiagram(6);
      diagram.reset();
      commonSetup(diagram);
    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(6);
      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 102);
        test.assert(img.height === 102);

        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        test.assert(arrayEquals(getimg(ctx, 0, 0), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 4, 4), [255, 0, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 50, 50), [0, 0, 0, 0]));
        test.assert(arrayEquals(getimg(ctx, 50, 90), [0, 0, 255, 255]));
        tearDownTestDiagram(6);
      }
      var s = new go.Set();
      s.add(diagram.findNodeForKey('1'));
      s.add(diagram.findNodeForKey('3'));
      img.src = diagram.makeImageData( { parts: s } );

    }, // END TEST
    null
));

intro.add(new Test('Parts 1 and 4', null,
    function (test) {
      var diagram = setupTestDiagram(7);
      diagram.reset();
      commonSetup(diagram);
    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(7);
      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 222);
        test.assert(img.height === 102);
        tearDownTestDiagram(7);
      }
      var s = new go.Set();
      s.add(diagram.findNodeForKey('1'));
      s.add(diagram.findNodeForKey('4'));
      img.src = diagram.makeImageData( { parts: s } );

    }, // END TEST
    null
));

intro.add(new Test('Padding zero', null,
    function (test) {
      var diagram = setupTestDiagram(8);
      diagram.reset();
      commonSetup(diagram);
    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(8);
      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 220);
        test.assert(img.height === 100);

        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);
        // top left should be red, bottom right should be black. No white border at all.
        test.assert(arrayEquals(getimg(ctx, 0, 0), [255, 0, 0, 255]));
        test.assert(arrayEquals(getimg(ctx, 219, 99), [0, 0, 0, 255]));
        tearDownTestDiagram(8);

      }
      img.src = diagram.makeImageData( { scale: 1, padding: 0 } );

    }, // END TEST
    null
));

intro.add(new Test('strikethrough image', null,
    function (test) {
      var diagram = setupTestDiagram(9);
      diagram.reset();

        diagram.layout = $( go.TreeLayout, {
            angle: 90
        } );

        diagram.nodeTemplate =
            $( go.Node, 'Position', {
                    selectionObjectName: "SHAPE"
                },
                $( go.Shape, "Rectangle", {
                    fill: null,
                    stroke: null,
                    position: new go.Point( 0, 0 ),
                    width: 150,
                    height: 50
                } ),
                $( go.TextBlock, {
                        font: 'bold 32px Georgia, Serif',
                        position: new go.Point( 0, 0 ),
                        width: 150,
                        isStrikethrough: true,
                    },
                    new go.Binding( 'text', 'text' ),
                    new go.Binding( "textAlign", "align" )
                )
            );

        diagram.model = new go.GraphLinksModel( [ {
            key: 2,
            text: "I  I",
            align: "left"
        }, {
            key: 3,
            text: "I  I",
            align: "center"
        }, {
            key: 1,
            text: "I  I",
            align: "right"
        } ] );
    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(9);

var a = new go.Set();
var b = new go.Set();
var c = new go.Set();
a.add(diagram.findNodeForKey(2))
b.add(diagram.findNodeForKey(3))
c.add(diagram.findNodeForKey(1))
//document.body.appendChild(diagram.makeImage({ parts: a, background: 'lime' }))
//document.body.appendChild(diagram.makeImage({ parts: b, background: 'lime' }))
//document.body.appendChild(diagram.makeImage({ parts: c, background: 'lime' }))

var can = document.createElement('canvas');
var ctx = can.getContext('2d');

window.d1 = diagram.makeImageData({ parts: a })
window.d2 = diagram.makeImageData({ parts: b })
window.d3 = diagram.makeImageData({ parts: c })
can.width = 153;
can.height = 53;

//document.body.appendChild(can);

var times = 0;
function tfinished() {
  times++;
  if (times === 3) tearDownTestDiagram(9);
}

// FIRST IMAGE:
var img1 = new Image();
img1.onload = function() {
  ctx.clearRect(0,0,can.width, can.height);
  ctx.drawImage(img1, 0, 0);
  // Find pixels in #1 but not #2 or 3.
  var foundPixels = false;
  var data = ctx.getImageData(22, 0, 1, can.height).data; // #1
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(74, 0, 1, can.height).data; // #2
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(127, 0, 1, can.height).data; // #3
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);
  tfinished();
}
img1.src = d1;

// SECOND IMAGE:
var img2 = new Image();
img2.onload = function() {
  ctx.clearRect(0,0,can.width, can.height);
  ctx.drawImage(img2, 0, 0)
  // Find pixels in #2 but not #1 or 3.
  var foundPixels = false;
  var data = ctx.getImageData(22, 0, 1, can.height).data; // #1
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(74, 0, 1, can.height).data; // #2
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(127, 0, 1, can.height).data; // #3
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);
  tfinished();
}
img2.src = d2;

// THIRD IMAGE:
var img3 = new Image();
img3.onload = function() {
  ctx.clearRect(0,0,can.width, can.height);
  ctx.drawImage(img3, 0, 0)
  // Find pixels in #3 but not #1 or 2.
  var foundPixels = false;
  var data = ctx.getImageData(22, 0, 1, can.height).data; // #1
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(74, 0, 1, can.height).data; // #2
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(!foundPixels);

  var foundPixels = false;
  var data = ctx.getImageData(127, 0, 1, can.height).data; // #3
  for (var i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // alpha
      foundPixels = true; break;
    }
  }
  test.assert(foundPixels);
  tfinished();
}
img3.src = d3;


    },
    null
)); // END TEST


intro.add(new Test('scale 1 sourceRect', null,
    function (test) {
      var diagram = setupTestDiagram(10);
      diagram.reset();




    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Position",  // the Shape will go around the TextBlock
        { width: 50, height: 50 },
        new go.Binding("position", "pos", go.Point.parse),
        new go.Binding("width"),
        new go.Binding("height"),
        $(go.Picture, {
             element: window.oneGlobalImage
           },
          new go.Binding('sourceRect'),
          new go.Binding('scale'))

      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "1", pos: "0 0", sourceRect: new go.Rect(0, 0, 50, 50) },
      { key: "2", pos: "100 0", sourceRect: new go.Rect(50, 0, 50, 50) },
      { key: "3", pos: "200 0", sourceRect: new go.Rect(0, 50, 50, 50) },
      { key: "4", pos: "300 0", sourceRect: new go.Rect(50, 50, 50, 50) },
      { key: "5", pos: "0 100", scale: 0.5 },
     { key: "6", pos: "100 100", width: 100, height: 100 }
    ],
    [
    ]);


    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(10);

      diagram.startTransaction();
      diagram.commitTransaction();

      var can = document.createElement('canvas');
      var ctx = can.getContext('2d');

      can.width = 352;
      can.height = 202;

      // FIRST IMAGE:
      var img1 = new Image();
      img1.onload = function() {
        ctx.drawImage(img1, 0, 0);
        // Find pixels in #1 but not #2 or 3.
        var foundPixels = false;

        test.assert(ctx.getImageData(25, 25, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(125, 25, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(225, 25, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(325, 25, 1, 1).data[0] === 123); // gray

        test.assert(ctx.getImageData(12, 112, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(35, 112, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(12, 137, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(35, 137, 1, 1).data[0] === 123); // gray

        test.assert(ctx.getImageData(128, 128, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(177, 128, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(128, 177, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(177, 177, 1, 1).data[0] === 123); // gray

        tearDownTestDiagram(10);
      }
      img1.src = diagram.makeImageData({ parts: diagram.nodes })



    },
    null
)); // END TEST




intro.add(new Test('scale 0.24 sourceRect', null,
    function (test) {
      var diagram = setupTestDiagram(11);
      diagram.reset();


diagram.scale = 0.24;

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, "Position",  // the Shape will go around the TextBlock
        { width: 50, height: 50 },
        new go.Binding("position", "pos", go.Point.parse),
        new go.Binding("width"),
        new go.Binding("height"),
        $(go.Picture, {
          element: window.oneGlobalImage
          },
          new go.Binding('sourceRect'),
          new go.Binding('scale'))

      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "1", pos: "0 0", sourceRect: new go.Rect(0, 0, 50, 50) },
      { key: "2", pos: "100 0", sourceRect: new go.Rect(50, 0, 50, 50) },
      { key: "3", pos: "200 0", sourceRect: new go.Rect(0, 50, 50, 50) },
      { key: "4", pos: "300 0", sourceRect: new go.Rect(50, 50, 50, 50) },
      { key: "5", pos: "0 100", scale: 0.5 },
     { key: "6", pos: "100 100", width: 100, height: 100 }
    ],
    [
    ]);


    }, // END SETUP
    function (test) {
      var diagram = getTestDiagram(11);
      diagram.startTransaction();
      diagram.commitTransaction();
      var can = document.createElement('canvas');
      var ctx = can.getContext('2d');
      can.width = 352;
      can.height = 202;

      diagram.redraw();
      var img1 = new Image();
      img1.onload = function() {

        ctx.drawImage(img1, 0, 0);

        test.assert(ctx.getImageData(25, 25, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(125, 25, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(225, 25, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(325, 25, 1, 1).data[0] === 123); // gray

        test.assert(ctx.getImageData(12, 112, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(35, 112, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(12, 137, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(35, 137, 1, 1).data[0] === 123); // gray

        test.assert(ctx.getImageData(128, 128, 1, 1).data[0] === 255);  // red
        test.assert(ctx.getImageData(177, 128, 1, 1).data[1] === 255); // green
        test.assert(ctx.getImageData(128, 177, 1, 1).data[2] === 255); // blue
        test.assert(ctx.getImageData(177, 177, 1, 1).data[0] === 123); // gray

        tearDownTestDiagram(11);
      }
      img1.src = diagram.makeImageData({ parts: diagram.nodes });



    },
    null
)); // END TEST








/* // for testing

intro.add(new Test('TODO', null,
    function (test) {
      var diagram = globaldia;
      diagram.reset();
      commonSetup(diagram);
    }, // END SETUP
    function (test) {
      var diagram = globaldia;
      var img = new Image();
      img.onload = function() {
        test.assert(img.width === 100);
        test.assert(img.height === 100);

        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);

        test.assert(arrayEquals(getimg(ctx, 0, 0), [0, 0, 0, 0]));

      }
      img.src = diagram.makeImageData( { TODO } );

    }, // END TEST
    null
));

window.open(diagram.makeImage(
  {
   scale: 1,
   showTemporary: false,
   showGrid: true
  }).src)

*/

/*
intro.add(new Test('TESTNAME', null,
    function (test) {
      var diagram = globaldia;
      diagram.reset();

    }, // END SETUP
    function (test) {
      var diagram = globaldia;

    }, // END TEST
    null
));

*/

})();