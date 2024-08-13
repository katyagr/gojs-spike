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
var page = require('webpage').create();
page.viewportSize = { width: 880, height: 900 };
page.open('file:///C:/Canvas/main/tests/index.html', function () {

  page.evaluate(function() {
    document.body.style.backgroundColor = 'white';
    TestCollection.Alerts = false;
    TestCollection.runAll();
    return document.getElementById('myStatus').textContent;
  });

  // We want to ensure that the image is done loading before we render
  setInterval(function() {
    var complete = page.evaluate(function() {
      return document.getElementById('myStatus').textContent.indexOf("finished");
    });

    var text = page.evaluate(function() {
      return document.getElementById('myStatus').textContent;
    });
    console.log(text);

    if (complete >= 0) {

      // PhantomJS renders the entire page, and we just want to output the <img>,
      // so we must clip to its bounding rect:
      var text = page.evaluate(function() {
        return document.getElementById('myStatus').textContent;
      });
      console.log(text);
      //page.render('tests.png');
      phantom.exit();
    }
  }, 100);

});