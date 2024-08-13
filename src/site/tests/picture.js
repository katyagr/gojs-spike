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
  var pictures = new TestCollection('Pictures');
  TestRoot.add(pictures);
  var $ = go.GraphObject.make;



  pictures.add(new Test('picture cache test, allow data:image/svg', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();

        try {
          diagram.nodeTemplate =
          $(go.Node, "Spot",
            $(go.Picture,
              {
                width: 16, height: 16,
                source: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2VlZSIgZD0iTTIxIDMuNzA3VjhoNC4yOTN6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwMDU5YjIiIGQ9Ik0yIDE1aDIxdjExSDJ6Ii8+PHBhdGggZD0iTTkgMjNINnYtNWgzdjFoMXYzSDl2MXptMC0xdi0zSDd2M2gyek0xMiAyMmgtMXYtM2gxdi0xaDJ2MWgxdjNoLTF2MWgtMnYtMXptMiAwdi0zaC0ydjNoMnpNMTcgMjJoLTF2LTNoMXYzem0wLTN2LTFoMnYxaC0yem0wIDR2LTFoMnYxaC0yeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMC41IDlhLjUuNSAwIDAgMS0uNS0uNVYzSDd2MTFoMTd2MTNIN3YyaDE5VjloLTUuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjAuNzUgMkg2djEyaDFWM2gxM3Y1LjVhLjUuNSAwIDAgMCAuNS41SDI2djIwSDd2LTJINnYzaDIxVjguMjVMMjAuNzUgMnpNMjEgOFYzLjcwN0wyNS4yOTMgOEgyMXoiIGZpbGw9IiM3MjcyNzIiLz48L3N2Zz4="
              })
          );

          diagram.nodeTemplate =
            $(go.Node, "Spot",
              $(go.Picture,
                {
                  width: 16, height: 16,
                  source: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2VlZSIgZD0iTTIxIDMuNzA3VjhoNC4yOTN6Ii8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwMDU5YjIiIGQ9Ik0yIDE1aDIxdjExSDJ6Ii8+PHBhdGggZD0iTTkgMjNINnYtNWgzdjFoMXYzSDl2MXptMC0xdi0zSDd2M2gyek0xMiAyMmgtMXYtM2gxdi0xaDJ2MWgxdjNoLTF2MWgtMnYtMXptMiAwdi0zaC0ydjNoMnpNMTcgMjJoLTF2LTNoMXYzem0wLTN2LTFoMnYxaC0yem0wIDR2LTFoMnYxaC0yeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMC41IDlhLjUuNSAwIDAgMS0uNS0uNVYzSDd2MTFoMTd2MTNIN3YyaDE5VjloLTUuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMjAuNzUgMkg2djEyaDFWM2gxM3Y1LjVhLjUuNSAwIDAgMCAuNS41SDI2djIwSDd2LTJINnYzaDIxVjguMjVMMjAuNzUgMnpNMjEgOFYzLjcwN0wyNS4yOTMgOEgyMXoiIGZpbGw9IiM3MjcyNzIiLz48L3N2Zz4="
                })
            );

          diagram.model = new go.GraphLinksModel(
          [
            { key: "Alpha", color: "lightblue" }
          ]);
        } catch(ex) {
          test.assert(false, "failure with Picture cache image map")
        }

      }, // END SETUP
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

      },
      null
  )); // END TEST

  // Makes sure two images with the same (relative) URL are still cached as the same element
  pictures.add(new Test('picture cache, ensure cache on non-absolute url', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();

        diagram.nodeTemplate =
        $(go.Node, "Spot",
          $(go.Picture,
            {
              width: 12, height: 12 // has to be real small to hit picture cache
            },
            new go.Binding('source')
            )
        );

        diagram.model = new go.GraphLinksModel(
          [
            { key: "Alpha", source: 'images/120x160.png' },
            { key: "Beta", source: 'images/120x160.png' }
          ]);

      }, // END SETUP
      null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        var a = d.findNodeForKey('Alpha');
        var b = d.findNodeForKey('Beta');
        test.assert(a.elt(0).element === b.elt(0).element);
        test.assert(a.elt(0).element.__goCache === b.elt(0).element.__goCache);
      }
  )); // END TEST

  /*

  pictures.add(new Test('TESTNAME', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();

      }, // END SETUP
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

      },
      null
  )); // END TEST


  */


  })();