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

  var dts = new TestCollection('.d.ts test');
  TestRoot.add(dts);

  dts.add(new Test('Test methods/props exposure', null,
  function (test) {
    var allClasses = {
      %REPLACEME%
    }

    for (var k in allClasses) {
      var methods = allClasses[k];
      // console.log(k);
      for (var i = 0; i < methods.length; i++) {
        var methodName = methods[i];
        if (methodName === "length" || methodName === "count") continue; // go.List.prototype.length DNE, inexplicably
        // These switch from get/set properties to literal properties on compilation
        switch (methodName) {
          case "x":
          case "y":
          case "width":
          case "height":
          case "offsetX":
          case "offsetY":
          case "top":
          case "left":
          case "bottom":
          case "right":
            continue;
        }

        // DraggingOptions uses real properties and not getters/setters do they don't show up in getOwnPropertyNames
        if (k === "DraggingOptions") {
          var instance = new go[k]();
          test.assert(instance[methodName] !== undefined, 'property ' + k + ' does not seem to have ' + methodName)
          continue;
        }

        if (methodName.indexOf('static ') === 0) {
          // static method k.methodName
          test.assert((go[k][methodName.split(' ')[1]] !== undefined), "Class " + k + " does not expose " + methodName);
        } else {
          // console.log(go[k].prototype[methodName] !== undefined);
          test.assert(Object.getOwnPropertyNames(go[k].prototype).indexOf(methodName) >= 0, 'property ' + k + ' does not seem to have ' + methodName);
        }
        // console.log('  ' + methods[i]);
      }

    }

  }, null, function (test) { }
  )); // end test

  })(); // end test system

