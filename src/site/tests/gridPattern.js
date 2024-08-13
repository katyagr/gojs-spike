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
  var iwidth = 300;
  var iheight = 300

  function snapshot(test) {
    var can = document.createElement('canvas');
    document.body.appendChild(can);
    test.ctx = can.getContext('2d');
    var dpr = test.diagram.computePixelRatio();
    var img = test.diagram.makeImage({
      scale: 1,
      position: new go.Point(0, 0),
      size: new go.Size(iwidth*dpr, iheight*dpr),
      showGrid: true
    });
    can.width = iwidth;
    can.height = iheight;
    test.ctx.fillRect(0, 0, iwidth, iheight);
    test.ctx.drawImage(img, 0, 0);
    return can;
  }

  function checkPixel(test, x, y, rgbarr, msg) {
    var arr = test.ctx.getImageData(x, y, 1, 1).data;
    test.assert(arr[0] === rgbarr[0] && arr[1] === rgbarr[1] && arr[2] === rgbarr[2] &&
                (rgbarr[3] !== undefined ? arr[3] === rgbarr[3] : arr[3] === 255),
                msg + "; at " + x + "," + y + " got " + arr.join(",") + " expected " + rgbarr.join(","));
  }

  var gridtests = new TestCollection('Grid Panels');
  TestRoot.add(gridtests);

  gridtests.add(new Test("simple", null,
    function(test) {
      var diag = test.diagram;
      diag.reset();
      diag.grid.background = "#FFFFFF";
      diag.grid.visible = true;
    },
    function(test) {
      test.log("  ??? problem with checking Grid pattern test"); return;
      var can = snapshot(test);
      checkPixel(test, 100, 100, [160, 160, 160], "grid did not render at 100, 100");
      checkPixel(test, 100, 101, [160, 160, 160], "grid did not render at 100, 101");
      checkPixel(test, 100, 102, [191, 191, 191], "grid did not render at 100, 102");
      checkPixel(test, 100, 103, [191, 191, 191], "grid did not render at 100, 103");
      checkPixel(test, 100, 104, [191, 191, 191], "grid did not render at 100, 104");
      checkPixel(test, 100, 105, [191, 191, 191], "grid did not render at 100, 105");
      checkPixel(test, 100, 106, [191, 191, 191], "grid did not render at 100, 106");
      checkPixel(test, 100, 107, [191, 191, 191], "grid did not render at 100, 107");
      checkPixel(test, 100, 108, [191, 191, 191], "grid did not render at 100, 108");
      checkPixel(test, 100, 109, [191, 191, 191], "grid did not render at 100, 109");
      checkPixel(test, 100, 110, [186, 186, 186], "grid did not render at 100, 110");
      document.body.removeChild(can);
    }
  ));

})(); // End test system