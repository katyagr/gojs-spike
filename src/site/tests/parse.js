﻿/*
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
  var parse = new TestCollection("Geometry.parse");
  var std = new TestCollection("Standard Inputs");
  var nsp = new TestCollection("No spaces");
  var whsp = new TestCollection("Extra whitespace");
  var paramnum = new TestCollection("Too many parameters");
  var format = new TestCollection("Various number formats");
  var fill = new TestCollection("Fill commands");
  var lower = new TestCollection("Lower Case Commands");
  var misc = new TestCollection("Misc.");

  parse.add(std);
  parse.add(nsp);
  parse.add(whsp);
  parse.add(paramnum);
  parse.add(format);
  parse.add(fill);
  parse.add(lower);
  parse.add(misc);

  TestRoot.add(parse);

  var letters = "abcdefghijklmnopqrstuvwxyz";
  function isletter(c) {
    return letters.indexOf(c.toLowerCase()) >= 0;
  }
  function comparefigs(figs, str, t) {
    var fignum = 0, segnum = 0;
    var fig = figs.elt(fignum);;
    var ind;
    var first = true;
    for (ind = 0; ind < str.length; ind++) {
      var c = str.charAt(ind);
      if (!isletter(c)) { continue; }
      var type;
      switch (c.toLowerCase()) {
        case 'm': type = go.PathSegment.Move; break;
        case 'z':
          if (fignum >= 1) {
            // z is no longer the end of a figure
            //t.assert(fig.segments.count === segnum, fig.segments.count + " segments existed, " + segnum + " specified");
            t.assert(fig.segments.elt(segnum-1).isClosed === (c.toLowerCase() === 'z'), "The figure had wrong closedness despite its ending ending");
          }
          // z is no longer the end of a figure
          //fignum++;
          //if (fignum === figs.count) { return; }
          //fig = figs.elt(fignum);
          //segnum = 0;
          continue;
        case 'l':
        case 'v':
        case 'h': type = go.PathSegment.Line; break;
        case 's':
        case 'c': type = go.PathSegment.Bezier; break;
        case 't':
        case 'q': type = go.PathSegment.QuadraticBezier; break;
        case 'a': type = go.PathSegment.Arc; break;
      }

      if (fig !== null) {
        if (first) {
          // first move command is special
          if (type === go.PathSegment.Move) first = false;
        } else {
          t.assert(type === fig.segments.elt(segnum).type, "Specified type was " + type + ", actual type was " + fig.segments.elt(segnum).type);
          segnum++;
        }
      }


    }
    if (fig !== null) {
      t.assert(fig.segments.count === segnum, fig.segments.count + " segments existed, " + segnum + " specified");
    }
  }
  function countfigs(str) {
    var cnt = 1; // 1 is default, used to be zero
    for (var i = 0; i < str.length - 1; i++) {
      var c = str.charAt(i);
      // We can no longer use moves or closes to count figures
      //if (c === 'M' || c === 'm' || c === 'Z' || c === 'z') { cnt++; }
    }
    return cnt;
  }
  function stdTests(geom, str, t) {
    comparefigs(geom.figures, str, t);
    var fignum = countfigs(str);
    var actnum = geom.figures.count;
    t.assert(fignum === actnum, fignum + " figs were specified, " + actnum + " figs were produced");
  }

  function comparePoints(geom, t, coords) {
    var c = 0;
    for (var i = 0; i < geom.figures.count; i++) {
      var fig = geom.figures.elt(i);
      t.assert(fig.startX === coords[c] && fig.startY === coords[c + 1], "Start coords. of fig were " + fig.startX + ", " + fig.startY + ".  Specified were " + coords[c] + ", " + coords[c + 1]);
      c += 2;
      for (var j = 0; j < fig.segments.count; j++) {
        var seg = fig.segments.elt(j);
        switch (seg.type) {
          case go.PathSegment.Move:
          case go.PathSegment.Line:
            t.assert(seg.endX === coords[c] && seg.endY === coords[c + 1], seg.endX + ", " + seg.endY + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            break;
          case go.PathSegment.Bezier:
            t.assert(seg.point1X === coords[c] && seg.point1Y === coords[c + 1], seg.point1X + ", " + seg.point1Y + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            t.assert(seg.point2X === coords[c] && seg.point2Y === coords[c + 1], seg.point2X + ", " + seg.point2Y + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            t.assert(seg.endX === coords[c] && seg.endY === coords[c + 1], seg.endX + ", " + seg.endY + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            break;
          case go.PathSegment.QuadraticBezier:
            t.assert(seg.point1X === coords[c] && seg.point1Y === coords[c + 1], seg.point1X + ", " + seg.point1Y + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            t.assert(seg.endX === coords[c] && seg.endY === coords[c + 1], seg.endX + ", " + seg.endY + " instead of specified point: " + coords[c] + ", " + coords[c + 1]); c += 2;
            break;
        }
      }
    }
  }

  function display(test, s) {
    test.diagram.startTransaction("display");

    var node = new go.Node("Vertical");

    var arr = Array.isArray(s) ? s : [s];
    for (var i = 0; i < arr.length; i++) {
      var shape;
      if (arr[i] instanceof go.Shape) { shape = arr[i]; }
      else {
        shape = new go.Shape();
        shape.geometry = arr[i];
      }
      if (s.strokeWidth === 0) { s.strokeWidth = 1; }
      if (!s.stroke) { s.stroke = "Black"; }
      node.add(shape);
    }

    test.diagram.nodeTemplate = node;
    test.diagram.model = new go.GraphLinksModel();
    test.diagram.model.nodeDataArray = [{ key: 1}];
    test.diagram.model.linkDataArray = new Array();

    test.diagram.commitTransaction("display");
  }



  std.add(new Test("Single Figure, open", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
  }
  ));

  std.add(new Test("Single Figure, closed", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 Z";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
  }
  ));

  std.add(new Test("Multiple Figures, open", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 M 5,5 L 5,10 L 10,10";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
  }
  ));

  std.add(new Test("Multiple Figures, closed", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 Z M 5,5 L 5,10 L 10,10 Z";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
  }
  ));



  nsp.add(new Test("Single Figure, open", null, null, null, function(t) {
    var s = "M0,0C0,20 20,20 20,0Q40,-10 20,-20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20]);
  }
  ));

  nsp.add(new Test("Single Figure, closed", null, null, null, function(t) {
    var s = "M0,0C0,20 20,20 20,0Q40,-10 20,-20Z";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20]);
  }
  ));

  nsp.add(new Test("Multiple Figures, open", null, null, null, function(t) {
    var s = "M0,0C0,20 20,20 20,0Q40,-10 20,-20M5,5L5,10L10,10";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 5, 5, 5, 10, 10, 10]);
  }
  ));

  nsp.add(new Test("Multiple Figures, closed", null, null, null, function(t) {
    var s = "M0,0C0,20 20,20 20,0Q40,-10 20,-20ZM5,5L5,10L10,10Z";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 5, 5, 5, 10, 10, 10]);
  }
  ));



  paramnum.add(new Test("M command", null, null, null, function(t) {
    var s = "M 0,0 5,5 L 10,10 L 20,10 M 20,20 25,20 L 35,35 L 55,35";
    var g = go.Geometry.parse(s);
    comparePoints(g, t, [0, 0,5,5, 10, 10, 20, 10, 20, 20,25,20, 35, 35, 55, 35]);
  }
  ));

  paramnum.add(new Test("Z command", null, null, null, function(t) {
    var s = "M 0,0 L 10,10 L 20,10 Z M 20,20 25,20 L 35,35 L 55,35";
    var g = go.Geometry.parse(s);
    comparePoints(g, t, [0, 0, 10, 10, 20, 10, 20, 20,25,20, 35, 35, 55, 35]);
  }
  ));

  paramnum.add(new Test("L command", null, null, null, function(t) {
    var s = "M 0,0 L 10,10 50,40 L 20,10 Z M 20,20 L 35,35 85,15 L 55,35";
    var g = go.Geometry.parse(s);
    t.assert(g.figures.elt(0).segments.count === 7, "Fig 0 should have 7 segs, actually had " + g.figures.elt(0).segments.count);
    comparePoints(g, t, [0, 0, 10, 10, 50, 40, 20, 10, 20, 20, 35, 35, 85, 15, 55, 35]);
  }
  ));

  paramnum.add(new Test("H command", null, null, null, function(t) {
    var s = "M 0,10 H 10,20 L 30,0";
    var g = go.Geometry.parse(s);
    comparePoints(g, t, [0, 10, 10, 10, 20, 10, 30, 0]);
  }
  ));

  paramnum.add(new Test("V command", null, null, null, function(t) {
    var s = "M 10,0 V 20,10 L 30,30";
    var g = go.Geometry.parse(s);
    comparePoints(g, t, [10, 0, 10, 20, 10, 10, 30, 30]);
  }
  ));

//  paramnum.add(new Test("Q command", null, null, null, function(t) {
//    var s = "M 0,0 Q 0,20 20,20 20,0 L 30,30";
//    try {
//      var g = go.Geometry.parse(s);
//      t.assert("Should have thrown exception");
//    }
//    finally { }
//  }
//  ));

//  paramnum.add(new Test("C command", null, null, null, function(t) {
//    var s = "M 0,0 C 0,20 20,20 20,0 90,90 L 30,30";
//    try {
//      var g = go.Geometry.parse(s);
//      t.assert("Should have thrown exception");
//    }
//    finally { }
//  }
//  ));



  format.add(new Test("Decimal point", null, null, null, function(t) {
    var s = "M 5.5,5.5 L 15.5,15.5";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [5.5, 5.5, 15.5, 15.5]);
  }
  ));

//  format.add(new Test("Hex", null, null, null, function(t) {
//    var s = "M 0x1F,0x1F L 0x2e1,0x2e1";
//    var g = go.Geometry.parse(s);
//    stdTests(g, s, t);
//    comparePoints(g, t, [31, 31, 737, 737]);
//  }
//  ));

//  format.add(new Test("Oct", null, null, null, function(t) {
//    var s = "M o10,o10 L o22,o22";
//    var g = go.Geometry.parse(s);
//    stdTests(g, s, t);
//    comparePoints(g, t, [8, 8, 18, 18]);
//  }
//  ));

//  format.add(new Test("Scientific", null, null, null, function(t) {
//    var s = "M 6e1,6e1 L 2E2,2E2";
//    var g = go.Geometry.parse(s);
//    stdTests(g, s, t);
//    comparePoints(g, t, [60, 60, 200, 200]);
//  }
//  ));



  fill.add(new Test("No fill", null, null, null, function(t) {
    var s = "M 5,5 L 15,15 L 15,5 Z";
    var g = go.Geometry.parse(s, false);
    t.assert(!g.figures.elt(0).isFilled, "The figure was filled");
  }
  ));

  fill.add(new Test("F", null, null, null, function(t) {
    var s = "F M 5,5 L 15,15 L 15,5 Z M 10,10 L 30,30";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [5, 5, 15, 15, 15, 5, 10, 10, 30, 30]);
    t.assert(g.figures.elt(0).isFilled, "Figure 0 was not filled filled");
    }
  ));

  fill.add(new Test("F1", null, null, null, function(t) {
    var s = "F1 M 5,5 L 15,15 L 15,5 Z M 10,10 L 30,30";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [5, 5, 15, 15, 15, 5, 10, 10, 30, 30]);
    t.assert(g.figures.elt(0).isFilled, "Figure 0 was not filled filled");
  }
  ));

  fill.add(new Test("F2", null, null, null, function(t) {
    var s = "F2 M 5,5 L 15,15 L 15,5 Z M 10,10 L 30,30";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [5, 5, 15, 15, 15, 5, 10, 10, 30, 30]);
    t.assert(g.figures.elt(0).isFilled, "Figure 0 was not filled filled");
  }
  ));



  whsp.add(new Test("Multiple Spaces", null, null, null, function(t) {
    var s = "M     0,0     C     0,20     20,20     20,0     Q     40,-10     20,-20     M     5,5     L     5,10     L     10,10     Z";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 5, 5, 5, 10, 10, 10]);
  }
  ));

  whsp.add(new Test("Tabs", null, null, null, function(t) {
    var s =
    "M\t0,0\tC\t0,20\t20,20\t20,0\tQ\t40,-10\t20,-20\tM\t5,5\tL\t5,10\tL\t10,10\tZ";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 5, 5, 5, 10, 10, 10]);
  }
  ));

  whsp.add(new Test("\\n's", null, null, null, function(t) {
    var s =
    "M\n0,0\nC\n0,20\n20,20\n20,0\nQ\n40,-10\n20,-20\nM\n5,5\nL\n5,10\nL\n10,10\nZ";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 5, 5, 5, 10, 10, 10]);
  }
  ));



  lower.add(new Test("All caps", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 L 30,-30 M 5,5 L 15,5 L 15,15 Z M 10,10 L 30,20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 30, -30, 5, 5, 15, 5, 15, 15, 10, 10, 30, 20]);
  }
  ));

  lower.add(new Test("m command", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 L 30,-30 m 5,5 L 15,5 L 15,15 Z M 10,10 L 30,20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 30, -30, 35, -25, 15, 5, 15, 15, 10, 10, 30, 20]);
  }
  ));

  lower.add(new Test("z command", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 L 30,-30 M 5,5 L 15,5 L 15,15 z m 10,10 L 30,20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 30, -30, 5,5, 15, 5, 15, 15, 15, 15, 30, 20]);
  }
  ));

  lower.add(new Test("l command (1)", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 l 10,-10 M 5,5 L 15,5 L 15,15 Z  M 10,10 L 30,20";
    var g = go.Geometry.parse(s);
    stdTests(g, s, t);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 30, -30, 5, 5, 15, 5, 15, 15, 10, 10, 30, 20]);
  }
  ));

  lower.add(new Test("l command(2)", null, null, null, function(t) {
    var s = "M 0,0 C 0,20 20,20 20,0 Q 40,-10 20,-20 L 30,-30 M 5,5 l 10,0 0,10 Z M 10,10 L 30,20";
    var g = go.Geometry.parse(s);
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0, 40, -10, 20, -20, 30, -30, 5, 5, 15, 5, 15, 15, 10, 10, 30, 20]);
  }
  ));



  misc.add(new Test("Multiple Points after M command", null, null, null, function(t) {
    var s = "M 0,0 0,20 20,20 20,0";
    var g = go.Geometry.parse(s);
    var len = g.figures.elt(0).segments.count;
    t.assert(len === 3, "Should be three figs, actually " + len + " figs.");
    for (var i = 0; i < len; i++) {
      t.assert(g.figures.elt(0).segments.elt(i).type === go.PathSegment.Line,
      "Figure " + i + " should have been a line, but was actually a " + g.figures.elt(0).segments.elt(i).type);
    }
    comparePoints(g, t, [0, 0, 0, 20, 20, 20, 20, 0]);
  }
  ));

  function makeShape() {
    var s = new go.Shape();
    s.stroke = null;
    return s;
  }

  function svgshapes() {
    var tiger = new go.Part();
    var s;
    s = makeShape(); s.name = "path482"; s.fill = null; s.geometry = go.Geometry.parse("M184.013,144.428", true); tiger.add(s);
    s = makeShape(); s.name = "path6"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M108.956,403.826c0,0,0.178,3.344-1.276,3.311  c-1.455-0.033-30.507-84.917-66.752-80.957C40.928,326.18,72.326,313.197,108.956,403.826z", true); tiger.add(s);
    s = makeShape(); s.name = "path10"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M115.189,398.488c0,0-0.97,3.207-2.327,2.679  c-1.356-0.526,0.203-90.231-35.227-98.837C77.635,302.33,111.576,300.804,115.189,398.488z", true); tiger.add(s);
    s = makeShape(); s.name = "path14"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M163.727,473.225c0,0,2.888,1.695,2.059,2.892  c-0.832,1.194-87.655-21.408-104.35,11.003C61.436,487.118,67.931,453.771,163.727,473.225z", true); tiger.add(s);
    s = makeShape(); s.name = "path18"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M158.767,491.254c0,0,3.277,0.699,2.864,2.096  c-0.411,1.396-89.935,7.298-95.567,43.318C66.063,536.668,61.723,502.971,158.767,491.254z", true); tiger.add(s);
    s = makeShape(); s.name = "path22"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M151.332,481.498c0,0,3.139,1.171,2.528,2.492  c-0.611,1.319-90.037-5.899-100.864,28.915C52.996,512.905,53.617,478.938,151.332,481.498z", true); tiger.add(s);
    s = makeShape(); s.name = "path26"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M132.43,449.356c0,0,2.31,2.427,1.181,3.347  c-1.128,0.919-78.363-44.729-103.341-18.171C30.27,434.532,45.704,404.264,132.43,449.356z", true); tiger.add(s);
    s = makeShape(); s.name = "path30"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M119.108,456.757c0,0,2.571,2.148,1.554,3.192  c-1.017,1.041-82.921-35.576-104.734-6.36C15.928,453.589,27.837,421.769,119.108,456.757z", true); tiger.add(s);
    s = makeShape(); s.name = "path34"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M114.518,463.946c0,0,2.839,1.778,1.974,2.95  c-0.865,1.171-86.997-23.942-104.623,7.974C11.869,474.87,19.329,441.724,114.518,463.946z", true); tiger.add(s);
    s = makeShape(); s.name = "path38"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M133.47,465.03c0,0,1.981,2.703,0.743,3.472  c-1.237,0.768-71.985-54.405-100.161-31.267C34.052,437.235,53.236,409.195,133.47,465.03z", true); tiger.add(s);
    s = makeShape(); s.name = "path42"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M98.546,413.917c0,0,1.06,3.178-0.353,3.531  c-1.413,0.353-51.91-73.804-85.812-60.385C12.381,357.063,39.22,336.229,98.546,413.917z", true); tiger.add(s);
    s = makeShape(); s.name = "path46"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M99.773,426.239c0,0,1.722,2.876,0.417,3.523  c-1.303,0.649-66.605-60.873-96.813-40.458C3.376,389.306,25.088,363.174,99.773,426.239z", true); tiger.add(s);
    s = makeShape(); s.name = "path50"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.172; s.geometry = go.Geometry.parse("M99.57,433.955c0,0,1.981,2.703,0.744,3.472  c-1.238,0.767-71.985-54.405-100.162-31.267C0.152,406.16,19.335,378.12,99.57,433.955z", true); tiger.add(s);
    s = makeShape(); s.name = "path54"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M95.668,436.985c0.888,10.678,2.632,22.275,5.703,27.783  c0,0-6.356,21.895,9.181,45.2c0,0-0.707,12.712,2.119,18.362c0,0,7.063,14.832,15.538,16.244c6.858,1.143,22.26,6.561,39.67,9.04  c0,0,30.249,24.859,24.599,47.461c0,0-0.706,28.956-7.063,31.781c0,0,20.481-19.775,3.531,9.888l-7.769,33.192  c0,0,45.201-38.138,17.657-5.648l-17.657,45.906c0,0,34.607-32.487,21.894-17.656l-5.65,15.538c0,0,76.276-48.025,21.894,4.237  c0,0,14.125-6.356,21.894-1.412c0,0,12.006-2.119,10.594,0.706c0,0-36.726,18.361-43.082,50.851c0,0,14.831-17.657,9.181,1.412  l0.706,20.48c0,0,7.063-38.138,6.356,28.25c0,0,33.9-31.78,13.419,4.944v29.662c0,0,26.838-28.956,15.538-6.354  c0,0,17.656-15.538,10.594,11.3c0,0-1.413,18.361,6.356-1.412c0,0,28.25-54.029,17.656-7.771c0,0-1.412,33.9,7.063,7.771  c0,0,0.706,18.362,16.95,31.075c0,0-2.119-89.695,20.48-26.133l7.063,28.957c0,0,4.943-16.244,4.237-25.426  c0,0,26.132-28.957,14.125,14.125c0,0,26.838-40.257,21.188-16.95c0,0-13.419,28.251-10.594,36.727c0,0,29.663-61.444,31.782-64.271  c0,0-3.531,74.865,15.537,11.3c0,0,9.888,21.188,4.943,28.957c0,0,14.125-14.125,12.712-19.774c0,0,8.122-14.479,13.066,9.534  c0,0,3.178,16.598,6.003,10.946c0,0,7.063,42.377,9.182,2.119c0,0,2.825-24.013-9.888-44.494c0,0,1.412-5.649-3.531-12.713  c0,0,24.014,38.139,11.3-12.713c0,0,19.777,14.125,21.896,14.125c0,0-24.015-40.963-8.477-32.487c0,0-9.183-18.362,22.602,2.825  c0,0-28.252-28.251,2.825-11.301c0,0,14.125,11.301,0.706-6.356c0,0-25.428-28.25,13.419,3.532c0,0,20.48,28.956,21.895,33.9  c0,0-17.655-51.559-25.426-56.501c0,0,14.832-64.271,87.576-36.727c0,0,12.007,30.369,19.774-2.118c0,0,22.602-11.301,42.375,37.432  c0,0,7.063-24.013,5.65-28.956c0,0,12.007,2.119,10.594,0c0,0,23.308,7.769,25.427,6.356c0,0,12.006,12.006,12.712,5.648  c0,0,16.244,4.944,12.713-1.412c0,0,15.538,27.544,16.244,33.9l4.236-24.719l3.531,4.942c0,0,2.825-13.419,1.413-15.537  c-1.413-2.119,35.313,12.006,43.787,48.731l3.531,14.831c0,0,10.594-26.131,7.77-33.193c0,0,9.181,1.412,9.888,9.181  c0,0,7.063-40.963-1.412-51.557c0,0,7.769-1.412,9.888,4.944V714.78c0,0,12.713,1.411,12.713-2.825c0,0,7.769-7.063,11.3,1.412  c0,0-21.894-62.15,10.594-28.25c0,0,12.714,19.068,6.356-14.125c-6.357-33.194-13.419-36.021-4.943-36.727  c0,0,1.412-6.355-2.118-9.181c-3.531-2.825,2.118,0,2.118,0s8.476,7.063-0.707-31.782c0,0,11.302,2.825-9.888-48.73  c0,0,4.944-4.237-2.118-19.069c0,0,14.125,7.77,19.069,4.944c0,0-0.707-2.825-6.356-9.889c0,0-38.139-96.759-2.118-57.913  c0,0,20.923,23.925,9.623-16.332c0,0-16.088-42.394-14.716-49.979L95.668,436.985z", true); tiger.add(s);
    s = makeShape(); s.name = "path58"; s.fill = "#CC7226"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M854.095,396.693c1.108,0.32,5.004,2.304,7.211,5.217  c0,0,12.006,19.068,2.825-13.418c0,0-16.244-50.851-0.707-31.076c0,0,10.594,12.713,4.944-11.3  c-6.824-29.004-11.301-40.257-11.301-40.257s20.48,8.475-26.837-61.444l15.536,6.356c0,0-34.605-69.919-72.743-79.101  l-14.125-10.594c0,0,67.8-67.094,45.199-132.07c0,0-12.007-9.182-28.957,7.063c0,0-11.3,8.475-21.894,5.65  c0,0-54.382,2.119-57.913,2.119S630.359-21.844,514.533,9.231c0,0-9.183,3.531-16.95,1.413c0,0-32.489-28.25-118.653,12.006  c0,0-17.655,3.531-20.48,3.531s-7.77,0-21.895,11.3c-14.125,11.3-14.832,12.712-18.362,15.538c0,0-28.957,19.775-37.432,21.188  c0,0-20.481,11.3-28.25,28.957l-6.356,2.119c0,0-2.825,12.713-3.532,14.832c0,0-8.475,6.356-9.887,16.244  c0,0-15.538,10.594-14.832,18.362c0,0-2.825,9.182-4.238,17.657c0,0-12.712,8.475-11.3,13.419c0,0-13.419,24.719-11.3,36.725  c0,0-11.3-0.706-16.244,3.531c0,0-1.413,8.475-4.238,9.182c0,0-4.944,2.119-0.706,9.181c0,0-2.825,4.944-3.531,7.769  c0,0,1.412,4.944-6.356,14.831c0,0-11.3,33.194-7.769,42.375c0,0,0.707,8.475-4.237,11.3c0,0-6.356-0.707,8.475,20.481  c0,0,1.413,2.119-4.238,6.356c0,0-30.369,6.356-34.606,35.313c0,0-24.013,26.131-24.013,35.313c0,4.069,0.479,9.626,1.713,17.771  c0,0-1.007,14.718,47.725,16.131C191.772,453.469,854.095,396.693,854.095,396.693z", true); tiger.add(s);
    s = makeShape(); s.name = "path62"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M120.793,436.164c-44.141-69.566-18.716,30.018-18.716,30.018  c15.538,60.738,244.365-5.649,244.365-5.649s298.042-53.677,317.816-60.739c19.775-7.063,187.864,4.237,187.864,4.237l-9.888-29.663  c-114.414-81.926-148.314-40.963-172.327-48.025c-24.013-7.062-19.774,9.888-25.425,11.3c-5.651,1.412-74.863-42.375-86.163-40.963  c-11.301,1.413-56.045-40.523-29.663,15.538c28.25,60.032-103.115,69.213-132.778,49.438  c-29.663-19.775,12.713,32.488,12.713,32.488c32.487,35.313-28.25,5.65-28.25,5.65c-60.737-22.601-103.114,22.6-108.764,24.013  c-5.65,1.412-14.125,7.063-15.538-4.237c-1.412-11.301-14.672-40.789-70.625,5.649c-35.313,29.313-59.679-9.534-59.679-9.534  L120.793,436.164z", true); tiger.add(s);
    s = makeShape(); s.name = "path66"; s.fill = "#E87F3A"; s.geometry = go.Geometry.parse("M560.632,299.761c-11.3,1.413-56.089-40.502-29.662,15.538  c29.311,62.151-103.113,69.213-132.775,49.438c-29.665-19.775,12.712,32.488,12.712,32.488c32.488,35.313-28.252,5.649-28.252,5.649  c-60.737-22.6-103.113,22.601-108.763,24.013c-5.65,1.413-14.125,7.063-15.538-4.236c-1.413-11.301-14.441-40.494-70.626,5.649  c-37.495,30.627-61.315-7.255-61.315-7.255l-5.65,17.849c-44.141-70.271-17.529,32.682-17.529,32.682  c15.54,60.739,245.521-7.962,245.521-7.962s298.043-53.676,317.817-60.738c19.774-7.062,186.325,4.109,186.325,4.109l-9.762-30.563  c-114.413-81.926-146.9-39.935-170.914-46.998c-24.013-7.063-19.774,9.888-25.425,11.3  C641.146,342.136,571.933,298.349,560.632,299.761z", true); tiger.add(s);
    s = makeShape(); s.name = "path70"; s.fill = "#EA8C4D"; s.geometry = go.Geometry.parse("M562.943,302.842c-11.301,1.413-54.973-41.014-29.663,15.538  c28.604,63.918-103.113,69.215-132.776,49.44c-29.662-19.775,12.713,32.488,12.713,32.488c32.488,35.313-28.25,5.649-28.25,5.649  c-60.738-22.6-103.115,22.601-108.766,24.013c-5.65,1.413-14.125,7.063-15.538-4.236c-1.413-11.301-14.21-40.198-70.625,5.649  c-39.68,31.942-62.952-4.976-62.952-4.976l-6.356,15.216c-42.022-68.86-16.341,35.345-16.341,35.345  c15.538,60.738,246.678-10.271,246.678-10.271s298.04-53.677,317.814-60.738c19.775-7.063,184.783,3.979,184.783,3.979l-9.63-31.46  c-114.415-81.926-145.49-38.909-169.503-45.972c-24.014-7.063-19.775,9.888-25.427,11.302  C643.457,345.219,574.243,301.429,562.943,302.842z", true); tiger.add(s);
    s = makeShape(); s.name = "path74"; s.fill = "#EC9961"; s.geometry = go.Geometry.parse("M565.255,305.925c-11.301,1.413-54.963-41.02-29.663,15.538  c29.663,66.311-104.057,68.586-132.775,49.438c-29.663-19.775,12.713,32.488,12.713,32.488c32.486,35.313-28.25,5.649-28.25,5.649  c-60.738-22.6-103.114,22.601-108.764,24.013c-5.65,1.413-14.125,7.063-15.538-4.236c-1.413-11.301-13.979-39.9-70.627,5.649  c-41.862,33.259-64.591-2.696-64.591-2.696l-7.063,12.584c-38.491-64.976-15.151,38.012-15.151,38.012  c15.538,60.736,247.833-12.586,247.833-12.586s298.04-53.677,317.817-60.738c19.773-7.063,183.24,3.853,183.24,3.853l-9.502-32.358  c-114.414-81.928-144.076-37.882-168.09-44.945c-24.015-7.063-19.775,9.888-25.427,11.3  C645.766,348.301,576.555,304.512,565.255,305.925z", true); tiger.add(s);
    s = makeShape(); s.name = "path78"; s.fill = "#EEA575"; s.geometry = go.Geometry.parse("M567.567,309.008c-11.303,1.412-54.07-41.412-29.664,15.538  c29.664,69.213-103.114,69.213-132.776,49.438c-29.663-19.775,12.713,32.487,12.713,32.487c32.487,35.313-28.251,5.65-28.251,5.65  c-60.738-22.6-103.113,22.601-108.763,24.013c-5.65,1.412-14.125,7.063-15.538-4.237s-13.746-39.604-70.626,5.649  c-44.046,34.575-66.229-0.418-66.229-0.418l-7.769,9.953c-34.96-61.446-13.964,40.673-13.964,40.673  c15.538,60.74,248.989-14.895,248.989-14.895s298.043-53.677,317.816-60.738c19.775-7.063,181.701,3.724,181.701,3.724  l-9.374-33.259c-114.414-81.926-142.664-36.853-166.677-43.915c-24.014-7.062-19.775,9.888-25.426,11.3  C648.081,351.383,578.868,307.595,567.567,309.008z", true); tiger.add(s);
    s = makeShape(); s.name = "path82"; s.fill = "#F1B288"; s.geometry = go.Geometry.parse("M569.879,312.089c-11.3,1.412-57.144-39.994-29.663,15.538  c33.9,68.507-103.115,69.213-132.778,49.438c-29.661-19.775,12.714,32.487,12.714,32.487c32.487,35.313-28.25,5.65-28.25,5.65  c-60.738-22.6-103.114,22.601-108.764,24.013c-5.65,1.412-14.125,7.063-15.538-4.237c-1.413-11.3-13.514-39.309-70.626,5.649  c-46.228,35.893-67.866,1.863-67.866,1.863l-8.475,7.317c-31.782-58.619-12.776,43.341-12.776,43.341  C123.394,553.887,358,475.94,358,475.94s298.042-53.677,317.817-60.738c19.774-7.063,180.158,3.595,180.158,3.595l-9.244-34.156  c-114.413-81.926-141.251-35.827-165.265-42.889c-24.013-7.062-19.774,9.888-25.426,11.3  C650.393,354.464,581.179,310.676,569.879,312.089z", true); tiger.add(s);
    s = makeShape(); s.name = "path86"; s.fill = "#F3BF9C"; s.geometry = go.Geometry.parse("M572.19,315.169c-11.303,1.413-57.813-39.656-29.665,15.538  c36.021,70.627-103.113,69.214-132.776,49.439s12.713,32.488,12.713,32.488c32.487,35.313-28.25,5.65-28.25,5.65  c-60.738-22.601-103.114,22.6-108.764,24.013c-5.65,1.412-14.125,7.063-15.538-4.237c-1.412-11.301-13.283-39.014-70.625,5.649  c-48.412,37.208-69.503,4.141-69.503,4.141l-9.181,4.688c-28.25-53.322-11.59,46.004-11.59,46.004  c15.538,60.738,251.301-19.519,251.301-19.519s298.041-53.677,317.816-60.738c19.775-7.063,178.619,3.466,178.619,3.466  l-9.117-35.055c-114.414-81.926-139.84-34.799-163.853-41.862c-24.014-7.064-19.774,9.888-25.425,11.3  C652.702,357.546,583.49,313.757,572.19,315.169z", true); tiger.add(s);
    s = makeShape(); s.name = "path90"; s.fill = "#F5CCB0"; s.geometry = go.Geometry.parse("M574.501,318.252c-11.3,1.413-59.753-38.624-29.662,15.538  c38.844,69.92-103.115,69.213-132.778,49.438c-29.662-19.775,12.714,32.488,12.714,32.488c32.486,35.313-28.251,5.65-28.251,5.65  c-60.737-22.602-103.113,22.6-108.764,24.013c-5.65,1.412-14.125,7.063-15.538-4.237c-1.413-11.301-13.05-38.716-70.626,5.649  c-50.594,38.524-71.14,6.422-71.14,6.422l-9.887,2.054c-25.427-50.145-10.401,48.668-10.401,48.668  c15.538,60.74,252.455-21.829,252.455-21.829s298.043-53.677,317.816-60.738c19.775-7.063,177.078,3.339,177.078,3.339  l-8.987-35.956c-114.414-81.926-138.428-33.771-162.439-40.834c-24.013-7.063-19.774,9.888-25.425,11.3  C655.015,360.628,585.802,316.84,574.501,318.252z", true); tiger.add(s);
    s = makeShape(); s.name = "path94"; s.fill = "#F8D8C4"; s.geometry = go.Geometry.parse("M576.813,321.335c-11.3,1.413-59.753-38.625-29.662,15.538  c38.845,69.919-103.113,69.213-132.776,49.438c-29.662-19.775,12.713,32.488,12.713,32.488c32.488,35.313-28.25,5.65-28.25,5.65  c-60.74-22.602-103.115,22.6-108.766,24.013c-5.65,1.412-14.125,7.063-15.538-4.238c-1.413-11.3-12.817-38.42-70.625,5.65  c-52.777,39.84-72.776,8.701-72.776,8.701l-10.594-0.579c-24.015-46.615-9.213,51.332-9.213,51.332  c15.538,60.738,253.609-24.143,253.609-24.143s298.042-53.675,317.817-60.736c19.775-7.063,175.538,3.21,175.538,3.21l-8.859-36.854  c-114.416-81.926-137.016-32.744-161.027-39.807c-24.013-7.063-19.775,9.888-25.427,11.3  C657.326,363.711,588.112,319.923,576.813,321.335z", true); tiger.add(s);
    s = makeShape(); s.name = "path98"; s.fill = "#FAE5D7"; s.geometry = go.Geometry.parse("M579.124,324.417c-11.301,1.413-59.068-38.998-29.663,15.538  c38.844,72.038-103.113,69.213-132.776,49.438c-29.662-19.775,12.714,32.488,12.714,32.488c32.486,35.313-28.251,5.65-28.251,5.65  c-60.737-22.602-103.113,22.6-108.764,24.013c-5.652,1.412-14.127,7.063-15.54-4.238c-1.412-11.3-12.585-38.123-70.625,5.65  c-54.959,41.157-74.413,10.979-74.413,10.979l-11.302-3.212c-22.954-42.375-8.025,53.999-8.025,53.999  c15.538,60.738,254.769-26.455,254.769-26.455s298.04-53.675,317.814-60.736c19.775-7.063,173.997,3.082,173.997,3.082  l-8.732-37.752c-114.413-81.928-135.602-31.718-159.613-38.781c-24.014-7.063-19.774,9.888-25.426,11.3  S590.424,323.004,579.124,324.417z", true); tiger.add(s);
    s = makeShape(); s.name = "path102"; s.fill = "#FCF2EB"; s.geometry = go.Geometry.parse("M581.435,327.498c-11.3,1.412-57.161-39.981-29.661,15.538  c37.432,75.571-103.114,69.215-132.776,49.439c-29.663-19.775,12.713,32.488,12.713,32.488c32.487,35.313-28.251,5.649-28.251,5.649  c-60.738-22.601-103.113,22.601-108.763,24.013c-5.65,1.413-14.125,7.063-15.538-4.237c-1.413-11.3-12.354-37.827-70.626,5.65  c-57.145,42.473-76.053,13.258-76.053,13.258l-12.006-5.842c-22.6-40.964-6.836,56.661-6.836,56.661  c15.538,60.736,255.921-28.766,255.921-28.766s298.043-53.676,317.817-60.737c19.775-7.063,172.454,2.951,172.454,2.951  l-8.604-38.65c-114.415-81.926-134.188-30.688-158.2-37.751c-24.014-7.064-19.775,9.887-25.426,11.3  C661.948,369.875,592.735,326.085,581.435,327.498z", true); tiger.add(s);
    s = makeShape(); s.name = "path106"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M120.44,466.182c-22.601-38.846-5.65,59.325-5.65,59.325  c15.538,60.738,257.078-31.075,257.078-31.075s298.042-53.677,317.816-60.738c19.775-7.063,170.914,2.823,170.914,2.823  l-8.475-39.55c-114.414-81.926-132.776-29.663-156.789-36.726c-24.013-7.063-19.775,9.888-25.426,11.3  c-5.649,1.413-74.862-42.375-86.163-40.963c-11.3,1.412-55.829-40.623-29.663,15.538c39.245,84.232-107.28,66.436-132.777,49.438  c-29.663-19.775,12.712,32.488,12.712,32.488c32.488,35.313-28.25,5.65-28.25,5.65c-60.737-22.602-103.113,22.602-108.764,24.014  c-5.65,1.413-14.125,7.063-15.538-4.237c-1.413-11.302-12.121-37.532-70.625,5.65c-59.326,43.788-77.688,15.537-77.688,15.537  L120.44,466.182z", true); tiger.add(s);
    s = makeShape(); s.name = "path110"; s.geometry = go.Geometry.parse("M193.891,519.15c0,0-12.713,20.48,24.013,43.788c0,0,2.472,2.473-29.31-4.943c0,0-10.947-3.531-13.771-21.896  c0,0-8.475-7.769-16.95-17.655C149.397,508.557,193.891,519.15,193.891,519.15z", true); tiger.add(s);
    s = makeShape(); s.name = "path114"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M441.08,435.104c0,0,31.249,47.356,30.193,55.797c-2.297,18.362-2.648,35.313,3.001,42.376  c5.651,7.063,21.188,65.682,21.188,65.682s-0.706,2.119,21.188-64.976c0,0,20.48-28.25-14.831-60.738  C501.82,473.244,439.668,422.392,441.08,435.104z", true); tiger.add(s);
    s = makeShape(); s.name = "path118"; s.geometry = go.Geometry.parse("M229.204,566.47c0,0,19.775,12.713-5.65,67.802l11.3-4.237c0,0-1.413,19.774-7.063,24.013l12.712-5.65  c0,0,8.475,14.127,1.413,22.602c0,0,29.663,14.125,28.25,25.425c0,0,11.3-14.125,4.237-25.425s-19.775-4.237-18.363-36.727  l-15.538,5.65c0,0,9.888-15.538,9.888-26.838l-14.125,4.237c0,0,27.313-46.928,8.475-49.438  C234.147,566.47,229.204,566.47,229.204,566.47z", true); tiger.add(s);
    s = makeShape(); s.name = "path122"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M286.41,596.133c0,0,4.944-7.769,0-6.355c-4.944,1.413-60.032,27.544-70.625,44.494  C215.785,634.271,276.522,591.189,286.41,596.133z", true); tiger.add(s);
    s = makeShape(); s.name = "path126"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M304.773,610.258c0,0,4.944-7.769,0-6.355s-60.032,27.544-70.625,44.494  C234.147,648.396,294.885,605.314,304.773,610.258z", true); tiger.add(s);
    s = makeShape(); s.name = "path130"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M328.079,583.42c0,0,4.944-7.769,0-6.355c-4.943,1.412-60.032,27.545-70.625,44.494  C257.454,621.559,318.191,578.477,328.079,583.42z", true); tiger.add(s);
    s = makeShape(); s.name = "path134"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M287.117,660.402c0,0,0-10.595-4.944-9.183c-4.944,1.413-68.507,32.488-79.101,49.438  C203.072,700.659,277.229,655.458,287.117,660.402z", true); tiger.add(s);
    s = makeShape(); s.name = "path138"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M289.235,641.333c0,0,2.119-8.475-2.825-7.063c-3.531,0-50.144,20.481-60.738,37.433  C225.672,671.702,277.935,633.564,289.235,641.333z", true); tiger.add(s);
    s = makeShape(); s.name = "path142"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M263.81,725.378l-17.656,13.419c0,0,18.362-13.419,24.719-11.3  c0,0-12.006,19.774-13.419,28.956c0,0,18.363-22.602,28.25-21.895c0,0,13.419,0.706,13.419,19.774c0,0,9.888-18.362,15.537-17.656  c0,0,2.119,11.302,0,23.308c0,0,7.063-13.419,14.125-10.595c0,0,11.301-3.53,9.888,16.95c0,0,0,18.362-1.412,23.308  c0,0,9.889-46.613,14.125-47.319c0,0,14.125-2.119,22.602,13.419c0,0-7.063-13.419,1.412-9.888c0,0,19.068,2.824,24.719,14.831  c0,0-12.006-21.188-2.118-15.537c0,0,12.006,0,14.125,11.3c0,0,14.831,37.432,18.362,40.257c0,0-13.419-38.138-10.595-38.138  c0,0-3.53-21.188,5.65,4.942c0,0-5.65-24.719,4.237-23.307c9.888,1.413,17.655,19.069,32.487,14.832  c0,0,16.952,9.888,20.483-112.295L263.81,725.378z", true); tiger.add(s);
    s = makeShape(); s.name = "path146"; s.geometry = go.Geometry.parse("M272.285,561.526c0,0,26.131-10.595,96.757,0c0,0,12.713,0.706,24.72-14.831  c12.006-15.538,59.325-28.251,70.625-24.721l16.952,11.302l1.413,2.118c0,0,21.895,18.362,22.6,31.781  c0.706,13.418-25.425,98.169-42.377,126.42c-16.949,28.25-33.899,50.145-67.801,45.906c0,0-36.726-7.063-81.926,0  c0,0-51.557-2.825-56.5-16.95s19.775-40.963,19.775-40.963s7.769-14.831,5.65-40.257C280.054,615.908,280.76,566.47,272.285,561.526  z", true); tiger.add(s);
    s = makeShape(); s.name = "path150"; s.fill = "#E5668C"; s.geometry = go.Geometry.parse("M311.129,565.058c14.832,32.487-37.431,147.607-37.431,147.607  c-3.531,2.825,22.353,13.499,40.256,9.182c19.327-4.657,90.401,2.825,90.401,2.825c41.669-27.544,64.27-105.938,64.27-105.938  s18.364-42.376-12.713-48.025C424.837,565.058,311.129,565.058,311.129,565.058z", true); tiger.add(s);
    s = makeShape(); s.name = "path154"; s.fill = "#B23259"; s.geometry = go.Geometry.parse("M307.543,619.608c5.873-22.582,8.67-43.419,3.586-54.552c0,0,110.177,11.301,129.951-25.426  c7.488-13.904,33.55,40.257,32.842,57.207c0,0-111.236,25.426-137.367,5.65L307.543,619.608z", true); tiger.add(s);
    s = makeShape(); s.name = "path158"; s.fill = "#A5264C"; s.geometry = go.Geometry.parse("M315.367,648.396c0,0,3.531,12.713-0.707,19.774c0,0-2.824,1.413-4.943,2.119  c0,0,2.119,6.356,12.713,9.182c0,0,3.531,7.77,7.77,8.476s12.713,10.594,19.774,8.475c7.063-2.118,26.839-9.181,26.839-9.181  s9.888-5.65,25.425,0.706c0,0,4.192-1.416,4.942-8.476c0.884-8.299,6.356-14.832,9.889-18.362  c3.531-3.531,20.48-26.133,18.362-26.838C433.313,633.564,315.367,648.396,315.367,648.396z", true); tiger.add(s);
    s = makeShape(); s.name = "path162"; s.fill = "#FF727F"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M307.598,562.938c0,0-4.943,39.552,0.707,54.383  c5.649,14.832,4.237,18.362,2.824,25.426c-1.412,7.063,6.356,24.719,16.244,35.313l21.188,2.825c0,0,26.839-6.355,43.082-1.412  c0,0,15.881,2.371,21.895-24.014c0,0,8.476-11.3,21.188-16.243c12.713-4.943,25.426-78.395,18.362-92.52  c-7.063-14.126-32.488-21.896-60.738,5.648S360.567,550.227,307.598,562.938z", true); tiger.add(s);
    s = makeShape(); s.name = "path166"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M310.423,695.009c0,0-1.412-3.531-9.181-4.237  c0,0-39.55-6.355-54.382-28.25c0,0-12.006-9.888-4.238,10.595c0,0,18.363,36.019,30.369,40.963  C272.991,714.078,301.948,721.141,310.423,695.009z", true); tiger.add(s);
    s = makeShape(); s.name = "path170"; s.fill = "#CC3F4C"; s.geometry = go.Geometry.parse("M451.572,582.058c1.163-13.96,4.61-29.169,1.515-35.361  c-11.382-22.768-41.35-13.253-60.738,5.648c-28.25,27.544-31.78-2.118-84.751,10.595c0,0-3.081,24.653-1.598,42.332  c0,0,65.867-20.438,67.28-10.551c0,0,2.823-5.649,19.067-5.649S448.747,587.001,451.572,582.058z", true); tiger.add(s);
    s = makeShape(); s.name = "path174"; s.stroke = "#A51926"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M375.398,564.352c0,0,8.476,8.476,2.118,25.426  c0,0-25.426,28.25-21.895,52.97", true); tiger.add(s);
    s = makeShape(); s.name = "path178"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M290.648,714.078c0,0-7.769-22.602,7.769-10.594  c0,0,8.475,3.53,6.356,6.354C302.654,712.665,292.767,719.729,290.648,714.078z", true); tiger.add(s);
    s = makeShape(); s.name = "path182"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M299.547,716.196c0,0-6.215-18.08,6.215-8.476  c0,0,7.806,4.322,5.084,5.085C302.795,715.066,310.847,719.587,299.547,716.196z", true); tiger.add(s);
    s = makeShape(); s.name = "path186"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M308.021,716.196c0,0-6.215-18.08,6.215-8.476  c0,0,7.725,4.078,5.086,5.085C313.39,715.066,319.322,719.587,308.021,716.196z", true); tiger.add(s);
    s = makeShape(); s.name = "path190"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M319.675,716.55c0,0-6.215-18.08,6.215-8.476  c0,0,7.739,4.118,5.087,5.085C325.749,715.066,330.977,719.939,319.675,716.55z", true); tiger.add(s);
    s = makeShape(); s.name = "path194"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M331.116,716.408c0,0-6.215-18.08,6.217-8.476  c0,0,6.78,2.825,5.085,5.085C340.723,715.278,342.418,719.799,331.116,716.408z", true); tiger.add(s);
    s = makeShape(); s.name = "path198"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M342.911,717.609c0,0-8.477-21.896,7.769-10.595  c0,0,8.476,3.531,6.356,6.355C354.917,716.196,357.036,721.847,342.911,717.609z", true); tiger.add(s);
    s = makeShape(); s.name = "path202"; s.stroke = "#A5264C"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M292.767,687.24c0,0,23.307-4.944,33.9,0.706  c0,0,10.594,2.119,12.713,1.412c2.118-0.706,7.77-1.412,7.77-1.412", true); tiger.add(s);
    s = makeShape(); s.name = "path206"; s.stroke = "#A5264C"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M352.799,702.777c0,0,21.188-24.014,42.375-16.243  c12.389,4.543,10.594-1.413,12.006-6.356c1.413-4.943,1.768-12.358,10.596-17.656", true); tiger.add(s);
    s = makeShape(); s.name = "path210"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M383.168,674.527c0,0-7.063-19.069-12.007,3.53  c-4.944,22.602-10.594,28.957-13.419,33.9c0,0,0,9.182,14.831,8.476c0,0,19.068-0.707,19.774-5.649  C393.055,709.84,390.23,689.358,383.168,674.527z", true); tiger.add(s);
    s = makeShape(); s.name = "path214"; s.stroke = "#A5264C"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M407.887,687.24c0,0,6.356-4.237,10.594-2.119", true); tiger.add(s);
    s = makeShape(); s.name = "path218"; s.stroke = "#A5264C"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M419.363,658.283c0,0,5.12-8.651,13.596-10.063", true); tiger.add(s);
    s = makeShape(); s.name = "path222"; s.fill = "#B2B2B2"; s.geometry = go.Geometry.parse("M279.348,723.259c0,0,31.781,5.65,39.551,2.825c0,0,15.536,0,0.706,3.531  c0,0-22.602,0-36.727-2.118C282.879,727.497,262.397,717.609,279.348,723.259z", true); tiger.add(s);
    s = makeShape(); s.name = "path226"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M304.066,558.701c0,0,31.075,0,34.606,1.412  c0,0,12.713,54.382,6.356,67.801c0,0-2.118,4.944-7.063-4.943c0,0-32.488-57.913-38.138-61.443  C294.177,557.996,301.948,558.701,304.066,558.701z", true); tiger.add(s);
    s = makeShape(); s.name = "path230"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M167.936,553.934c0,0,15.714,3.002,37.961,7.594  c0,0,8.475,39.551,14.125,48.024c5.65,8.475-0.706,8.476-7.063,3.531s-32.488-29.663-36.019-37.432  C173.409,567.882,167.936,553.934,167.936,553.934z", true); tiger.add(s);
    s = makeShape(); s.name = "path234"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M206.534,561.909c0,0,10.241,2.732,12.022,6.645  c1.78,3.909-2.123,9.73-2.123,9.73s-1.766,5.835-3.888,2.018C210.424,576.483,205.353,562.958,206.534,561.909z", true); tiger.add(s);
    s = makeShape(); s.name = "path238"; s.geometry = go.Geometry.parse("M206.603,561.526c0,0,6.356,9.182,12.713,9.182c6.356,0,7.031-0.729,12.006,0.353  c8.122,1.767,7.416-1.766,19.069,0.354c4.661,0.848,9.181-0.706,14.125,1.412c4.944,2.119,10.594,0.706,12.713-2.825  s10.594-10.946,10.594-10.946s-22.6,3.179-27.544,4.591C260.279,563.645,220.729,565.764,206.603,561.526z", true); tiger.add(s);
    s = makeShape(); s.name = "path242"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M285.351,561.879c0,0-11.389,6.182-12.095,10.418  c-0.707,4.237,9.27,10.771,9.27,10.771s4.855,8.122,5.915,3.884C289.5,582.714,286.763,562.586,285.351,561.879z", true); tiger.add(s);
    s = makeShape(); s.name = "path246"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M219.166,571.527c0,0,12.372,19.754,12.755-0.041  c0,0,0.983-2.223-2.124-2.261C219.07,569.092,221.756,561.85,219.166,571.527z", true); tiger.add(s);
    s = makeShape(); s.name = "path250"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M231.839,571.967c0,0,13.986,19.752,12.863-0.164  c0,0,0.012-0.587-3.083-0.855C233.238,570.215,233.847,562.238,231.839,571.967z", true); tiger.add(s);
    s = makeShape(); s.name = "path254"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M244.575,571.98c0,0,14.054,18.766,12.873,1.697  c0,0,0.21-2.177-2.71-2.708C247.866,569.725,247.494,563.987,244.575,571.98z", true); tiger.add(s);
    s = makeShape(); s.name = "path258"; s.fill = "#FFFFCC"; s.stroke = "#000000"; s.strokeWidth = 0.5; s.geometry = go.Geometry.parse("M256.716,572.122c0,0,13.948,20.412,14.563,3.143  c0,0,2.903-2.433-0.18-2.824C260.826,571.133,262.235,563.269,256.716,572.122z", true); tiger.add(s);
    s = makeShape(); s.name = "path262"; s.fill = "#E5E5B2"; s.geometry = go.Geometry.parse("M192.845,578.354l-13.521-2.702c-4.591-8.828-8.299-19.688-8.299-19.688  s11.212,1.767,33.282,6.709c0,0,1.547,5.858,4.146,16.091L192.845,578.354z", true); tiger.add(s);
    s = makeShape(); s.name = "path266"; s.fill = "#E5E5B2"; s.geometry = go.Geometry.parse("M307.732,570.123c-2.942-4.425-5.268-7.528-6.416-8.245c-5.32-3.325,1.995-2.659,3.989-2.659  c0,0,29.258,0,32.583,1.329c0,0,0.926,3.959,2.134,9.946C340.022,570.494,322.21,566.945,307.732,570.123z", true); tiger.add(s);
    s = makeShape(); s.name = "path270"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M402.378,326.201c48.945,6.992,94.004-55.936,97.112-73.028  c3.106-17.092-14.762-38.067-14.762-38.067c2.33-5.438-6.216-30.298-15.537-46.613c-9.322-16.314-37.398-14.595-68.367-16.314  c-27.968-1.554-60.599,39.621-62.928,42.729c-2.331,3.108,8.546,70.698,10.876,80.798s-2.33,56.712-2.33,56.712  C406.897,316.349,353.434,319.209,402.378,326.201z", true); tiger.add(s);
    s = makeShape(); s.name = "path274"; s.fill = "#EA8E51"; s.geometry = go.Geometry.parse("M339.182,196.051c-2.288,3.051,8.392,69.413,10.68,79.328  c2.288,9.916-2.288,55.682-2.288,55.682c57.687-15.679,6.864-12.967,54.918-6.102c48.056,6.865,92.296-54.918,95.347-71.701  c3.051-16.781-14.492-37.375-14.492-37.375c2.288-5.339-6.103-29.748-15.255-45.766c-9.153-16.018-36.717-14.328-67.125-16.018  C373.506,152.573,341.47,193,339.182,196.051z", true); tiger.add(s);
    s = makeShape(); s.name = "path278"; s.fill = "#EFAA7C"; s.geometry = go.Geometry.parse("M340.467,197.195c-2.245,2.995,8.235,68.127,10.481,77.859s-2.246,54.65-2.246,54.65  c55.448-16.173,6.737-12.727,53.9-5.989c47.166,6.738,90.587-53.901,93.581-70.373c2.994-16.47-14.224-36.683-14.224-36.683  c2.245-5.24-5.989-29.197-14.973-44.918c-8.984-15.721-36.037-14.063-65.882-15.721C374.155,154.522,342.713,194.2,340.467,197.195z  ", true); tiger.add(s);
    s = makeShape(); s.name = "path282"; s.fill = "#F4C6A8"; s.geometry = go.Geometry.parse("M341.753,198.339c-2.204,2.938,8.079,66.842,10.282,76.391  c2.204,9.548-2.203,53.619-2.203,53.619c51.974-15.961,6.61-12.487,52.885-5.876c46.275,6.611,88.877-52.884,91.815-69.043  c2.938-16.161-13.956-35.993-13.956-35.993c2.203-5.142-5.876-28.646-14.69-44.07c-8.813-15.425-35.355-13.799-64.638-15.425  C374.806,156.472,343.956,195.401,341.753,198.339z", true); tiger.add(s);
    s = makeShape(); s.name = "path286"; s.fill = "#F9E2D3"; s.geometry = go.Geometry.parse("M343.038,199.483c-2.161,2.881,7.924,65.557,10.085,74.921  c2.161,9.365-2.161,52.588-2.161,52.588c49.205-15.75,6.483-12.246,51.868-5.763c45.386,6.483,87.168-51.868,90.049-67.718  c2.882-15.849-13.687-35.299-13.687-35.299c2.161-5.042-5.765-28.095-14.408-43.223c-8.646-15.128-34.677-13.534-63.396-15.128  C375.455,158.421,345.199,196.602,343.038,199.483z", true); tiger.add(s);
    s = makeShape(); s.name = "path290"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M402.942,319.984c44.493,6.356,85.459-50.85,88.283-66.388  c2.825-15.538-13.419-34.606-13.419-34.606c2.119-4.944-5.65-27.544-14.127-42.375c-8.475-14.831-33.995-13.267-62.149-14.831  c-25.427-1.413-55.088,36.019-57.207,38.844c-2.119,2.825,7.769,64.27,9.888,73.451c2.119,9.182-2.119,51.557-2.119,51.557  C397.116,310.45,358.448,313.628,402.942,319.984z", true); tiger.add(s);
    s = makeShape(); s.name = "path294"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M484.87,259.953c0,0-49.087,13.419-69.568,10.594c0,0-27.896-11.653-43.435,26.838  c0,0-6.356,12.713-9.889,16.244C358.447,317.16,484.87,259.953,484.87,259.953z", true); tiger.add(s);
    s = makeShape(); s.name = "path298"; s.geometry = go.Geometry.parse("M491.58,256.068c0,0-51.206,21.541-68.862,20.834c0,0-28.956-8.122-43.788,17.656  c0,0-14.831,16.244-20.48,19.069c0,0-0.706,2.825,10.594-4.238l18.363,9.182c0,0,26.131,16.95,43.081-11.3  c0,0,7.063-19.775,7.063-23.307c0-3.532,37.433-13.419,40.259-14.125C480.633,269.134,492.286,261.718,491.58,256.068z", true); tiger.add(s);
    s = makeShape(); s.name = "path302"; s.fill = "#99CC32"; s.geometry = go.Geometry.parse("M407.887,319.479c-12.134,0-26.918-6.824-26.918-17.857c0-11.032,14.784-22.094,26.918-22.094  c12.138,0,21.976,8.943,21.976,19.975C429.861,310.537,420.023,319.479,407.887,319.479z", true); tiger.add(s);
    s = makeShape(); s.name = "path306"; s.fill = "#659900"; s.geometry = go.Geometry.parse("M401.489,290.021c-8.557,1.275-17.541,3.929-17.414,3.547  c2.719-8.156,13.95-14.041,23.812-14.041c7.585,0,14.273,3.493,18.222,8.807C426.107,288.335,416.722,287.753,401.489,290.021z", true); tiger.add(s);
    s = makeShape(); s.name = "path310"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M422.718,289.616c0,0-7.769-5.65-7.769-1.766C414.949,287.85,421.306,295.619,422.718,289.616z  ", true); tiger.add(s);
    s = makeShape(); s.name = "path314"; s.geometry = go.Geometry.parse("M405.063,303.963c-4.412,0-7.989-3.577-7.989-7.991c0-4.412,3.577-7.989,7.989-7.989  c4.413,0,7.99,3.577,7.99,7.989C413.053,300.386,409.476,303.963,405.063,303.963z", true); tiger.add(s);
    s = makeShape(); s.name = "path318"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M221.435,280.434c0,0-5.65-37.432-1.413-45.2c0,0,19.069-17.657,18.363-24.013  c0,0-0.706-31.782-2.825-33.194c-2.119-1.413-15.538-12.006-26.131-0.706c0,0-18.363,31.781-16.95,43.082v3.531  c0,0-13.419-0.706-16.244,2.825c0,0-2.119,9.181-4.238,9.888c0,0-4.944,4.237-1.413,9.181c0,0-3.531,4.237-2.825,11.3l13.419,7.063  c0,0,3.531,25.425,22.601,34.606C212.317,302.909,217.903,291.028,221.435,280.434z", true); tiger.add(s);
    s = makeShape(); s.name = "path322"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M219.669,277.186c0,0-5.085-33.688-1.271-40.681c0,0,17.162-15.891,16.527-21.611  c0,0-0.636-28.604-2.543-29.875c-1.907-1.271-13.984-10.806-23.518-0.636c0,0-16.526,28.604-15.255,38.773v3.178  c0,0-12.077-0.636-14.62,2.542c0,0-1.907,8.263-3.813,8.899c0,0-4.45,3.813-1.271,8.263c0,0-3.178,3.813-2.542,10.17l12.077,6.356  c0,0,3.178,22.883,20.34,31.146C211.462,297.411,216.491,286.72,219.669,277.186z", true); tiger.add(s);
    s = makeShape(); s.name = "path326"; s.fill = "#EB955C"; s.geometry = go.Geometry.parse("M234.765,179.775c-1.924-1.519-15.149-11.706-25.478-0.688c0,0-17.904,30.987-16.526,42.004  v3.443c0,0-13.083-0.688-15.838,2.754c0,0-2.066,8.952-4.132,9.641c0,0-4.82,4.132-1.377,8.952c0,0-3.443,4.132-2.754,11.018  l13.083,6.886c0,0,3.443,24.79,22.035,33.741c8.323,4.008,13.772-7.574,17.215-17.903c0,0-5.509-36.496-1.377-44.07  c0,0,18.592-17.215,17.903-23.413C237.52,212.139,236.831,181.152,234.765,179.775z", true); tiger.add(s);
    s = makeShape(); s.name = "path330"; s.fill = "#F2B892"; s.geometry = go.Geometry.parse("M233.971,181.523c-1.73-1.625-14.761-11.406-24.825-0.671c0,0-17.444,30.192-16.103,40.927  v3.355c0,0-12.748-0.671-15.432,2.684c0,0-2.013,8.722-4.026,9.394c0,0-4.696,4.025-1.342,8.722c0,0-3.354,4.025-2.684,10.735  l12.748,6.709c0,0,3.354,24.154,21.47,32.876c8.111,3.906,13.419-7.38,16.773-17.445c0,0-5.368-35.56-1.342-42.94  c0,0,18.115-16.773,17.444-22.812C236.654,213.057,235.983,182.865,233.971,181.523z", true); tiger.add(s);
    s = makeShape(); s.name = "path334"; s.fill = "#F8DCC8"; s.geometry = go.Geometry.parse("M233.176,183.271c-1.536-1.73-14.373-11.106-24.172-0.653c0,0-16.985,29.398-15.679,39.851  v3.266c0,0-12.413-0.653-15.026,2.613c0,0-1.96,8.493-3.919,9.146c0,0-4.573,3.92-1.307,8.493c0,0-3.267,3.92-2.613,10.453  l12.413,6.533c0,0,3.266,23.518,20.905,32.011c7.897,3.803,13.065-7.186,16.332-16.985c0,0-5.227-34.624-1.307-41.811  c0,0,17.639-16.332,16.985-22.211C235.789,213.976,235.136,184.578,233.176,183.271z", true); tiger.add(s);
    s = makeShape(); s.name = "path338"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M219.669,277.009c0,0-5.085-33.512-1.271-40.504c0,0,17.162-15.891,16.527-21.611  c0,0-0.636-28.604-2.543-29.875c-1.342-1.836-13.984-10.806-23.518-0.636c0,0-16.526,28.604-15.255,38.773v3.178  c0,0-12.077-0.636-14.62,2.542c0,0-1.907,8.263-3.813,8.899c0,0-4.45,3.813-1.271,8.263c0,0-3.178,3.813-2.542,10.17l12.077,6.356  c0,0,3.178,22.883,20.34,31.146C211.462,297.411,216.491,286.543,219.669,277.009z", true); tiger.add(s);
    s = makeShape(); s.name = "path342"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M214.195,265.956c0,0-38.138-18.01-39.727-19.422c0,0,16.067,14.479,17.48,14.479  C193.361,261.013,214.195,265.956,214.195,265.956z", true); tiger.add(s);
    s = makeShape(); s.name = "path346"; s.geometry = go.Geometry.parse("M184.003,255.009c0,0,32.488,6.356,32.488,14.125c0,5.141-0.429,28.834-9.888,26.131  C191.772,291.028,198.128,265.603,184.003,255.009z", true); tiger.add(s);
    s = makeShape(); s.name = "path350"; s.fill = "#99CC32"; s.geometry = go.Geometry.parse("M198.834,261.718c0,0,15.852,2.603,17.656,7.416c1.06,2.825,2.23,17.494-7.416,19.422  C201.038,290.165,197.101,272.118,198.834,261.718z", true); tiger.add(s);
    s = makeShape(); s.name = "path354"; s.geometry = go.Geometry.parse("M350.671,336.845c-0.878-3.076,1.438-2.845,4.601-3.794c3.53-1.06,25.071-7.769,26.483-12.359  c1.413-4.591,24.719,3.178,24.719,3.178c3.18,1.412,10.947,6.003,10.947,6.003c8.476,2.119,20.128,2.825,20.128,2.825  c4.238,1.766,10.241,6.709,10.241,6.709c25.778,18.009,47.674,5.297,47.674,5.297c35.313-11.653,24.72-42.022,24.72-42.022  c-5.298-15.891,0.354-21.894,0.354-21.894c0.354-6.709,13.064,4.591,13.064,4.591c4.592,7.416,6.005,16.244,6.005,16.244  c14.125,19.775,8.122-11.653,8.122-11.653c0.353-1.766-4.592-8.122-4.592-10.241s-3.179-8.122-3.179-8.122  c-5.297-6.003-1.06-18.363-1.06-18.363c3.179-24.366-0.706-21.188-0.706-21.188c-2.118-3.178-18.362,14.478-18.362,14.478  c-3.885,6.003-14.479,8.828-14.479,8.828c-4.942,3.178-10.946,0.707-10.946,0.707c-4.59-0.707-14.479,11.653-14.479,11.653  c4.943-0.354,9.182,7.416,13.419,7.769c4.237,0.354,7.415-4.237,10.24-5.297c2.825-1.059,7.769,9.182,7.769,9.182  c0.707,4.59-9.181,13.065-9.181,13.065c-0.707,8.122-3.531,5.297-3.531,5.297c-5.297-1.059-7.415,5.65-9.182,13.772  c-1.766,8.122-9.182,8.829-9.182,8.829c-2.825,13.065-4.945,7.769-4.945,7.769c-0.354-9.888-10.947,0.353-10.947,0.353  c-2.118,3.531-10.239-0.353-10.239-0.353c-12.008-3.531-7.77-7.063-7.77-7.063c3.178-3.884,22.953,0,22.953,0  c3.884-2.825-10.241-9.888-10.241-9.888c-1.06-3.178,0.706-10.947,0.706-10.947c2.119-5.65,14.126-15.538,14.126-15.538  c16.599-2.119,11.654-4.944,11.654-4.944c-10.946-9.182-21.189,4.237-21.189,4.237c-3.884,10.947-34.605,37.432-34.605,37.432  c-8.476,6.003-3.884-6.003-10.947,0c-7.063,6.003-43.435-9.888-43.435-9.888c-20.414-2.106-25.238,25.688-31.47,20.18  C343.93,331.689,353.496,346.732,350.671,336.845z", true); tiger.add(s);
    s = makeShape(); s.name = "path358"; s.geometry = go.Geometry.parse("M694.629,43.132c0,0-45.201,14.125-50.145,47.319c0,0-4.237,40.256,31.78,71.332c0,0,0.707,11.3,4.238,16.95  c0,0-2.825,8.475,30.368-4.944l48.025-14.832c0,0,11.301-4.238,20.481-19.775c9.181-15.538,36.019-48.731,29.662-93.226  c0,0,2.119-19.775-8.475-20.481c0,0-14.832-2.825-27.544,10.594c0,0-12.008,5.65-16.244,4.944L694.629,43.132z", true); tiger.add(s);
    s = makeShape(); s.name = "path362"; s.geometry = go.Geometry.parse("M791.069,41.384c0,0,3.708-15.767-4.837-7.222c0,0-12.432,10.1-25.641,10.1c0,0-25.637,3.884-33.404,27.191  c0,0-6.992,47.39,6.99,57.489c0,0,8.546,13.207,20.978,1.554C767.587,118.843,794.954,65.467,791.069,41.384z", true); tiger.add(s);
    s = makeShape(); s.name = "path366"; s.fill = "#323232"; s.geometry = go.Geometry.parse("M790.409,42.016c0,0,3.689-15.438-4.7-7.048c0,0-12.204,9.916-25.173,9.916  c0,0-25.171,3.814-32.798,26.697c0,0-6.865,46.528,6.863,56.444c0,0,8.392,12.967,20.596,1.525  C767.403,118.108,794.224,65.661,790.409,42.016z", true); tiger.add(s);
    s = makeShape(); s.name = "path370"; s.fill = "#666666"; s.geometry = go.Geometry.parse("M789.749,42.648c0,0,3.673-15.11-4.563-6.875c0,0-11.978,9.732-24.705,9.732  c0,0-24.705,3.743-32.191,26.202c0,0-6.738,45.667,6.737,55.399c0,0,8.234,12.727,20.213,1.497  C767.22,117.374,793.492,65.855,789.749,42.648z", true); tiger.add(s);
    s = makeShape(); s.name = "path374"; s.fill = "#999999"; s.geometry = go.Geometry.parse("M789.089,43.28c0,0,3.654-14.782-4.425-6.703c0,0-11.752,9.549-24.24,9.549  c0,0-24.239,3.672-31.584,25.708c0,0-6.609,44.805,6.61,54.354c0,0,8.08,12.487,19.832,1.469  C767.036,116.639,792.762,66.05,789.089,43.28z", true); tiger.add(s);
    s = makeShape(); s.name = "path378"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M788.429,43.912c0,0,3.638-14.454-4.287-6.529c0,0-11.527,9.365-23.773,9.365  c0,0-23.772,3.602-30.978,25.213c0,0-6.482,43.943,6.483,53.309c0,0,7.924,12.247,19.45,1.441  C766.851,115.904,792.03,66.244,788.429,43.912z", true); tiger.add(s);
    s = makeShape(); s.name = "path382"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M787.767,44.544c0,0,3.619-14.125-4.148-6.356c0,0-11.301,9.181-23.308,9.181  c0,0-23.307,3.531-30.368,24.719c0,0-6.356,43.082,6.355,52.263c0,0,7.77,12.006,19.069,1.412  C766.667,115.17,791.298,66.438,787.767,44.544z", true); tiger.add(s);
    s = makeShape(); s.name = "path386"; s.fill = "#992600"; s.geometry = go.Geometry.parse("M414.243,403.323c0,0-36.021-33.901-50.146-35.313c0,0-60.738-7.063-86.87,24.719  c0,0,31.076-36.019,79.807-26.131c0,0-38.138-7.769-60.032-2.119c0,0-29.663,0-46.613,24.719l-4.944,8.475  c0,0,7.063-26.131,39.55-36.726c0,0,40.256-8.475,59.326,0c0,0-38.138-12.006-55.794-8.475c0,0-53.675-4.237-76.275,42.375  c0,0,7.063-25.425,33.194-38.138c0,0,24.013-15.538,60.032-10.594c0,0,25.425,5.65,34.607,9.888  c9.182,4.237,7.063-0.707-7.769-9.182c0,0-9.889-17.656-34.607-16.95c0,0-75.57,6.356-93.932,27.544  c0,0,24.013-19.775,42.375-24.719c0,0,39.55-14.125,54.381-12.713c0,0,43.788,1.766,57.207-5.297c0,0-19.775,8.828-14.125,14.479  c5.649,5.65,17.656,19.069,17.656,21.188s42.729,41.14,49.085,48.908L414.243,403.323z", true); tiger.add(s);
    s = makeShape(); s.name = "path390"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M658.607,745.857c0,0-27.367-64.445-49.438-81.221c0,0,45.906,28.251,52.086,60.032  C661.256,724.67,661.256,742.326,658.607,745.857z", true); tiger.add(s);
    s = makeShape(); s.name = "path394"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M741.593,759.1c0,0-46.789-97.109-79.454-139.484c0,0,76.807,66.212,85.635,113.001  l0.883,9.711l-5.297-4.414C743.358,737.912,742.476,753.803,741.593,759.1z", true); tiger.add(s);
    s = makeShape(); s.name = "path398"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M841.352,673.466c0,0-110.353-105.056-113.001-109.47c0,0,106.821,116.533,112.118,129.775  C840.469,693.771,836.938,677.88,841.352,673.466z", true); tiger.add(s);
    s = makeShape(); s.name = "path402"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M508.528,750.271c0,0,34.43-91.813,67.977-52.087c0,0,26.485,17.656,25.604,22.953  c0,0-7.063-11.477-38.846-10.594C563.263,710.545,529.716,705.248,508.528,750.271z", true); tiger.add(s);
    s = makeShape(); s.name = "path406"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M844.883,525.152c0,0-79.454-50.321-92.695-52.971c-20.848-4.168,87.398,51.204,96.228,69.743  C848.414,541.926,851.945,537.512,844.883,525.152z", true); tiger.add(s);
    s = makeShape(); s.name = "path410"; s.geometry = go.Geometry.parse("M578.803,713.371c0,0,36.02-3.531,48.025-15.537l7.769,6.356l31.075-67.802l6.356,9.183  c0,0,25.426-26.132,24.013-40.257c-1.412-14.125,22.601,10.594,22.601,10.594s-1.413-20.481,11.301-8.477  c0,0-4.237-27.544,10.594-13.419c0,0-18.604-53.246,21.188-7.769c9.889,11.3,2.119-0.706,2.119-0.706s-45.905-84.751-7.769-59.325  c0,0,3.531-40.257,1.412-48.026c-2.118-7.769-5.649-47.319-14.125-56.502c-8.477-9.182,0.706-12.006,10.594-2.824  c0,0-19.775-42.375,3.531-21.188c0,0-6.356-26.838-14.125-31.782c0,0-9.889-30.369,16.949-11.3c0,0-7.769-21.894-13.419-27.544  c0,0-20.48-48.732-7.769-40.257l7.769,6.356c0,0-12.007-24.719-0.706-16.95s11.301,7.063,11.301,7.063s-37.433-58.62-1.412-27.544  c0,0-14.406-24.574-20.481-36.726c0,0-33.193-36.019-7.77-24.719l8.476,2.825c0,0-15.538-17.656-29.663-20.481  c-14.125-2.825,4.237-14.125,15.538-10.594c11.3,3.531,38.844,16.95,38.844,16.95s22.602,33.194,29.663,33.9  c0,0-35.313-13.419-24.719,0.706c0,0,25.425,24.719,12.712,24.013c0,0-10.594,12.713-2.118,28.25c0,0-32.592-32.472-6.355,12.712  l12.006,28.957c0,0-43.081-43.788-23.306-4.944c0,0,30.369,41.669,33.899,42.375c3.531,0.707,11.3,16.244,11.3,16.244l-7.769-3.531  l9.181,15.538c0,0-19.774-21.188-9.181,2.119l9.887,25.425c0,0-36.019-38.844-12.006,13.42c0,0-28.957-9.183-13.419,21.188  c0,0-2.825,28.252-2.119,37.434c0.707,9.183,2.825,59.325-4.942,73.451c-7.77,14.125,10.594,48.025,14.125,55.088  c3.53,7.063,9.888,26.131-5.65,9.889c-15.537-16.244-7.769-6.356-4.237,9.181c3.531,15.538,14.125,43.082,12.713,52.97  c0,0-2.118,2.119-7.769-4.236c0,0-26.132-40.258-23.307-14.832c0,0-2.119,14.125-7.77,29.663c0,0-5.649,19.068-5.649,3.53  c0,0-5.65-29.663-10.595-16.244c-4.943,13.42-11.301,24.014-16.244,28.251c-4.942,4.237-14.125-36.02-16.243-17.656  c0,0-21.188-21.895-29.662,7.063l-20.482,28.957c0,0-0.706-21.894-2.824-11.3C650.135,710.547,597.165,721.141,578.803,713.371z", true); tiger.add(s);
    s = makeShape(); s.name = "path414"; s.geometry = go.Geometry.parse("M518.064,83.389c0,0-20.481-14.125-27.545-13.419c-7.063,0.706,48.731-15.538,121.477,33.194  c0,0,8.476,4.944,14.832,4.238c0,0,5.648,4.237,0.706,10.594c0,0-15.538,16.95,4.237,36.725c0,0,32.487,12.006,22.601-3.531  c0,0,19.069,7.063,23.307,14.125c4.238,7.062,2.118,0,2.118,0s-11.3-12.713-21.894-21.894c0,0-9.183-3.531-14.125-18.363  c-4.944-14.832-9.183-32.488-1.413-38.138c0,0-7.063,7.769-5.649,0.706c1.412-7.063,7.77-13.419,10.594-14.125  c2.825-0.707,31.781-28.604,43.788-29.31c0,0-16.244,2.472-21.541,0.706S617.293,23.003,606.7,20.884c0,0-29.662-11.653-8.476-8.122  c0,0,63.211,6.709,95.346,30.016c0,0-12.713-14.832-45.2-27.191c0,0-39.197-22.247-101.349-13.419c0,0-31.429,5.65-45.2,8.828  c0,0-4.591-1.06-5.65-1.766c-1.059-0.706-21.896-16.597-70.627-4.237c0,0-30.016,8.122-45.2,16.597c0,0-26.838,2.119-33.193,7.769  c0,0-32.842,25.778-36.372,27.191c-3.531,1.413-23.66,14.831-25.072,15.538c0,0,43.435-11.653,47.672-15.891  c4.238-4.237,34.96-8.828,39.197-6.356c4.238,2.472,19.069,1.413,2.119,2.472c0,0,133.483,26.132,134.896,29.663  C511.002,85.507,518.064,83.389,518.064,83.389z", true); tiger.add(s);
    s = makeShape(); s.name = "path418"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M644.131,67.145c0,0-18.009-13.066-21.54-13.066c-3.532,0-25.426-18.009-32.842-17.303  c-7.415,0.707-28.956-16.95-77.335-2.472c0,0-1.061-3.531,5.297-4.944c0,0,11.301-3.884,12.007-4.944c0,0,35.666-7.416,48.378-1.06  c0,0,16.244,4.591,27.191,15.538c0,0,19.775,5.65,25.425,3.885c0,0,15.538,3.884,16.244,7.063c0,0,10.241,5.297,7.063,9.888  C654.019,59.729,654.725,62.554,644.131,67.145z", true); tiger.add(s);
    s = makeShape(); s.name = "path422"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M622.112,63.421c1.425,1.116,3.224,1.289,4.292,2.717c0.413,0.554-0.099,1.13-0.653,1.301  c-1.842,0.56-3.706-0.447-5.723,0.591c-0.71,0.366-1.844,0.044-2.819-0.219c-2.882-0.779-6.111-0.823-9.097,0.392  c-3.505-1.994-7.672-0.962-11.348-2.73c-0.102-0.047-0.493,0.563-0.625,0.516c-5.378-2.021-11.985-1.522-16.278-5.555  c-4.286-0.728-8.448-1.543-12.735-2.744c-3.21-0.899-5.697-2.645-8.558-4.114c-2.433-1.25-5.004-2.171-7.713-2.828  c-3.289-0.798-6.521-0.601-9.864-1.519c-0.164-0.044-0.503,0.563-0.648,0.516c-0.57-0.191-1.084-1.22-1.386-1.127  c-2.968,0.922-5.595-0.794-8.533-0.19c-2.08-2.161-5.131-1.729-7.859-2.509c-5.233-1.498-10.804,0.745-16.152-1.022  c7.262-3.252,15.538-1.077,22.71-4.73c4.11-2.094,8.811-0.148,13.348-1.49c0.86-0.254,2.08-0.611,2.786,0.57  c0.237-0.239,0.56-0.661,0.661-0.611c4.325,2.042,8.413,4.292,12.795,6.174c0.604,0.258,1.542-0.152,1.986,0.205  c2.684,2.147,6.114,1.965,8.569,4.119c2.998-0.886,6.164-0.215,9.218-1.317c0.137-0.048,0.55,0.554,0.606,0.516  c1.995-1.321,4.035-0.842,5.609-0.306c0.597,0.203,1.768,0.639,2.307,0.77c1.987,0.487,3.499,1.335,5.581,1.658  c0.201,0.032,0.527-0.568,0.655-0.519c1.982,0.773,3.822,0.674,4.979,2.729c0.238-0.238,0.529-0.658,0.676-0.611  c1.813,0.597,2.959,1.93,4.901,2.355c0.856,0.187,1.938,1.292,2.954,1.603c4.224,1.291,7.479,3.991,11.353,5.571  C619.447,62.132,620.994,62.545,622.112,63.421z", true); tiger.add(s);
    s = makeShape(); s.name = "path426"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M486.804,38.296c-4.445-3.046-8.627-4.999-12.938-8.152c-0.32-0.235-0.955,0.065-1.313-0.15  c-1.776-1.075-3.346-2.101-5.079-3.33c-0.952-0.674-2.4-0.655-3.299-1.11c-4.491-2.281-9.134-3.267-13.56-5.375  c1.204-1.126,3.185-0.695,4.236-2.119c0.346,0.495,0.766,0.996,1.389,0.659c2.963-1.596,6.229-1.866,9.188-1.708  c3.01,0.163,6.046,0.701,9.181,1.181c0.542,0.083,0.894,1.006,1.464,1.178c3.934,1.171,8.15,0.244,11.894,1.723  c2.81,1.111,5.581,2.564,7.77,4.815c0.444,0.459-0.13,0.991-0.623,1.333c0.685-0.193,1.167,0.171,1.361,0.724  c0.148,0.422,0.148,0.955,0,1.377c-0.196,0.551-0.689,0.729-1.351,0.819c-2.484,0.336,0.645-2.101-0.591-1.31  c-2.248,1.438-0.932,3.92-2.246,6.159c-0.494-0.342-0.9-0.728-0.706-1.413c0.413,0.922-0.65,1.434-0.947,1.992  C489.953,36.869,488.366,39.367,486.804,38.296z", true); tiger.add(s);
    s = makeShape(); s.name = "path430"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M429.424,51.27c-5.568-1.402-10.954-1.199-16.279-3.452c-0.117-0.049-0.512,0.563-0.625,0.516  c-2.411-1.049-4.032-2.754-5.933-4.602c-1.612-1.568-4.539-0.884-6.789-1.744c-0.572-0.219-0.931-1.123-1.462-1.192  c-2.152-0.277-3.789-1.953-5.634-2.961c4.124-1.404,8.381-1.349,12.729-2.027c0.199-0.031,0.455,0.535,0.69,0.535  c0.24,0,0.47-0.39,0.706-0.627c0.345,0.495,0.878,1.07,1.331,0.622c0.968-0.953,1.949-0.618,2.902-0.547  c0.255,0.018,0.476,0.553,0.709,0.553c0.24,0,0.473-0.549,0.707-0.549c0.239,0.001,0.472,0.549,0.706,0.549  c0.24,0,0.471-0.39,0.706-0.627c1.223,1.381,2.784,0.403,4.235,0.719c1.833,0.401,2.305,2.428,4.201,2.954  c8.324,2.302,15.629,6.09,23.333,9.774c0.542,0.26,0.912,0.698,0.719,1.384c0.471,0,1.023-0.155,1.359,0.078  c1.867,1.292,3.706,2.26,4.937,4.199c0.381,0.599-0.199,1.317-0.61,1.226C444.243,54.292,437.17,53.219,429.424,51.27z", true); tiger.add(s);
    s = makeShape(); s.name = "path434"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M404.952,129.332c-2.813-2.152-3.842-5.738-5.834-8.902c-0.378-0.6,0.105-1.154,0.666-1.312  c0.987-0.281,1.946,0.563,2.669,0.92c3.081,1.522,5.792,3.715,9.316,3.96c3.515,3.945,11.036,4.625,11.049,10.594  c0.002,1.517-2.521-0.104-3.278,1.412c-4.328-1.771-8.546-1.589-12.748-4.179C405.702,131.152,406.285,130.353,404.952,129.332z", true); tiger.add(s);
    s = makeShape(); s.name = "path438"; s.fill = "#CC7226"; s.geometry = go.Geometry.parse("M356.33,36.5c0.238,0.002,12.652,0.413,12.622,0.614c-0.079,0.546-13.729,2.398-14.37,2.098  c-0.29-0.134-13.554,4.156-13.79,3.92C341.266,42.894,355.86,36.5,356.33,36.5z", true); tiger.add(s);
    s = makeShape(); s.name = "path442"; s.geometry = go.Geometry.parse("M383.521,53.726c0,0-26.133,3.178-33.9,5.297c-7.77,2.119-40.609,15.538-45.907,19.069  c0,0-23.66,9.535-53.675,44.848c0,0,13.419-6.003,17.303-10.947c0,0,24.013-22.247,23.66-17.656c0,0,21.541-15.185,20.481-11.3  c0,0,43.082-19.775,39.551-14.125c0,0,38.138-8.122,36.372-4.591c0,0,33.192,7.769,28.25,8.122c0,0-10.241,2.119,1.06,8.475  c0,0-6.003,7.769-15.538,0.707c-9.534-7.063-4.236-3.178-13.064-1.413c0,0-4.592,1.413-12.713-5.65c0,0-9.889-8.122-25.426-1.766  c0,0-54.029,22.247-57.56,23.307c0,0-6.356,4.944-10.594,11.3c0,0-10.241,7.769-15.538,10.241c0,0-22.6,20.481-24.719,22.953  c0,0-6.003,9.181-7.416,9.888c0,0,11.3-6.709,14.831-10.241c0,0,24.719-17.656,34.253-19.069c0,0,7.769-5.297,9.182-7.769  c0,0,25.425-16.244,32.84-16.244c0,0,16.244,9.181,20.482-3.178c0,0,10.239-3.178,20.128-1.06c0,0,5.649-4.591,4.236-8.475  c0,0,2.825-3.178,4.592,3.531c0,0,6.003,6.356,14.479,2.825c0,0,7.063-0.353,3.531,3.884c0,0-7.77,6.709-28.604,7.063  c0,0-21.895,1.06-50.851,14.479c0,0-52.616,18.363-68.86,36.725c0,0-11.3,15.538-20.834,17.657c0,0-10.241,1.412-20.834,14.478  c0,0,17.303-10.241,33.194-10.241c0,0,7.063-4.237,0.353,2.119c0,0-6.356,13.418-3.531,22.953c0,0-1.06,9.181-2.472,12.006  c0,0-13.772,22.6-13.772,26.838c0,4.237,2.119,21.541,2.825,22.6c0.706,1.06-1.766-2.825,4.944,1.413  c6.709,4.237,11.653,7.063,13.065,12.006c1.413,4.944-3.531-9.535-3.884-12.713c-0.353-3.178-7.769-15.891-6.356-20.128  c0,0,1.766,1.766,3.178,4.237c0,0-1.059-1.06,0-7.416c0,0,1.413-9.182,3.885-14.832s6.003-12.359,6.709-13.772  c0.707-1.413,0.707-11.653,3.178-7.063l6.003,4.59c0,0-4.944-4.59-1.06-8.475c0,0-1.766-9.888,1.413-14.479  c0,0,12.359-14.832,15.185-16.597c2.826-1.765,0.353-1.059,0.353-1.059s10.594-7.416,0.353-4.591c0,0-7.063,2.825-12.359,2.825  c0,0-13.419,3.531-6.356-3.885s24.719-16.95,31.429-16.597l1.413,2.825l19.775-4.237l-2.119,1.413c0,0-0.353-0.354,7.063-1.06  s17.656,1.766,20.128-1.413c2.473-3.178,8.477-4.944,7.771-2.472c-0.706,2.472-1.061,6.003-1.061,6.003s8.828-10.241,7.77-6.356  c-1.061,3.884-15.537,13.065-18.011,24.013l18.363-14.479l6.356-5.297c0,0,6.355,3.884,6.709,1.06  c0.354-2.825,8.476-13.066,10.594-12.713c2.119,0.353,5.649-4.591,5.297,0c-0.353,4.591,13.066,14.125,13.066,14.125  s5.648-3.178,8.122-0.706c2.472,2.472,9.887-34.96,9.887-34.96l44.142-18.716l76.983-6.003l-30.017-12.006L383.521,53.726z", true); tiger.add(s);
    s = makeShape(); s.name = "path446"; s.fill = null; s.stroke = "#4C0000"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M415.655,405.089c0,0-26.484-29.663-41.316-34.254  c0,0-23.659-12.006-67.094,1.766", true); tiger.add(s);
    s = makeShape(); s.name = "path450"; s.fill = null; s.stroke = "#4C0000"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M368.689,368.363c0,0-44.494-14.125-71.687-6.709  c0,0-32.488,3.531-47.319,27.897", true); tiger.add(s);
    s = makeShape(); s.name = "path454"; s.fill = null; s.stroke = "#4C0000"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M362.333,366.245c0,0-30.016-12.713-56.147-16.597  c0,0-29.31-4.591-58.62,8.122c0,0-21.541,10.594-31.075,28.603", true); tiger.add(s);
    s = makeShape(); s.name = "path458"; s.fill = null; s.stroke = "#4C0000"; s.strokeWidth = 2; s.geometry = go.Geometry.parse("M364.099,366.951c0,0-27.19-19.422-28.957-21.894  c0,0-12.358-19.422-35.313-20.128c0,0-37.785,1.413-68.154,15.538", true); tiger.add(s);
    s = makeShape(); s.name = "path462"; s.geometry = go.Geometry.parse("M361.794,351.072c2.723,2.583,50.33,53.664,50.33,53.664c62.15,64.624,12.713,4.236,12.713,4.236  c-13.419-8.475-29.663-41.669-29.663-41.669c-2.119-4.944,24.719,12.713,24.719,12.713c7.063,1.412,31.075,35.313,31.075,35.313  c-12.006-4.237-3.53,8.476-3.53,8.476c4.943,3.531,40.965,31.077,40.965,31.077c6.355,7.063,13.419,9.888,13.419,9.888  c24.719-9.182,13.419,14.125,13.419,14.125c4.236,12.007,14.125-8.476,14.125-8.476c19.774-29.664-9.182-25.425-9.182-25.425  c-52.972,4.942-64.978-23.31-64.978-23.31c-4.238-4.236,11.3,0,11.3,0c14.833,3.531-12.713-21.894-12.713-21.894  c4.237,0,20.481,12.006,20.481,12.006c18.363,16.244,21.896,12.713,21.896,12.713c31.782-15.538,50.146-2.119,50.146-2.119  c3.53,2.825-6.356,14.832-3.531,24.016c2.825,9.182,11.3,31.075,11.3,31.075c-4.237,2.824-3.531,21.895-3.531,21.895  c29.663,40.963,12.713,37.432,12.713,37.432c-27.544-0.707-1.411,12.712-1.411,12.712c5.648,3.531,21.188,16.244,21.188,16.244  c-4.944-2.119-7.769,7.063-7.769,7.063c8.475,7.063,3.53,15.538,3.53,15.538c-10.594,2.118-12.713,9.181-12.713,9.181  c12.006,14.126-5.649,14.832-5.649,14.832c6.355,7.769-2.118,28.956-2.118,28.956c-8.477,0-19.775,9.888-19.775,9.888  c4.237,8.477-14.125,18.363-14.125,18.363c-14.832,2.824-9.888,14.831-9.888,14.831c-14.125,10.594-18.363,38.844-18.363,38.844  c-1.412,18.363-5.648,24.014,3.531,20.481c9.182-3.531,7.77-25.425,7.77-25.425c-8.476-27.545,67.095-55.795,67.095-55.795  c7.063-2.824,8.476-12.007,8.476-12.007c3.531,0.706,19.069,14.125,19.069,14.125c13.418,19.775,14.125,3.531,14.125,3.531  c2.118-6.356-0.707-16.95-0.707-16.95c10.595-38.138-14.125-49.438-14.125-49.438c-17.656-59.326,7.063-44.494,7.063-44.494  c4.944,9.888,24.014,19.068,24.014,19.068l6.355-4.237c-2.824-8.477,12.007-19.069,12.007-19.069  c4.943,11.301,15.537-2.824,15.537-2.824c6.356-43.082,28.251-17.656,28.251-17.656c7.063,2.119,9.182-9.889,9.182-9.889  c6.355-18.361,0-42.375,0-42.375c6.355-0.706,23.307,9.889,23.307,9.889c4.944-6.356-11.3-36.021-4.237-31.781  c7.063,4.237,14.831,7.063,14.831,7.063c1.413-3.53-16.243-25.426-16.243-25.426c-7.77-4.945-16.949-40.965-16.949-40.965  c12.712,6.356-4.944-20.481-4.944-20.481c0-5.65,10.594-25.425,10.594-25.425c-1.412-12.006,0-11.3,0-11.3  c4.944,2.119,19.069,4.944,7.063-6.356c-12.006-11.3,1.413-19.775,1.413-19.775c7.769-4.944-16.244-4.238-16.244-4.238  c-9.183-7.769-8.477-14.831-8.477-14.831c14.126,3.531-11.3-21.894-15.536-28.25c-4.237-6.356,12.713-15.538,12.713-15.538  c23.307-6.356,2.823-12.006,2.823-12.006c-34.605,0.706-15.536-18.363-15.536-18.363c10.594,0.707,7.769-3.531,7.769-3.531  c-9.181-2.119-26.132-13.419-26.132-13.419c-7.063-6.356-0.706-4.944-0.706-4.944c29.663,2.119-21.188-17.656-21.188-17.656  c14.125,0-17.655-18.363-17.655-18.363c-3.531-2.825-9.183-16.244-9.183-16.244c-10.594-9.182-19.067-21.188-19.067-21.188  c-0.707-7.769-9.183-16.244-9.183-16.244c-20.48-24.013-30.369-23.307-30.369-23.307c-26.132-6.356-35.313-4.944-35.313-4.944  l-93.229,7.769c-46.612,22.6-32.842,59.679-32.842,59.679c11.301,14.831,27.544,8.122,27.544,8.122  c8.122-10.947,28.604-7.063,28.604-7.063c36.021,5.65,31.431-0.706,31.431-0.706c-4.237-8.122-32.843-19.069-33.196-20.128  c-0.353-1.06-15.891-7.063-15.891-7.063c-5.297-2.119-13.065-18.363-13.065-18.363c-5.649-6.003,22.247,4.238,22.247,4.238  c-2.119,1.766,10.947,8.828,10.947,8.828c30.724-1.766,49.439,17.303,49.439,17.303c19.068,29.31,19.422,14.832,19.422,14.832  c4.943-16.597-15.892-54.029-15.892-54.029c0.706-3.531,15.186,8.122,15.186,8.122c2.472-3.531,3.885,6.709,3.885,6.709  c0.353,4.237,7.063,18.362,7.063,18.362c4.942,22.954,11.3,9.888,11.3,9.888l8.122,16.597c2.472,4.591-8.122,18.01-8.122,18.01  c-0.354,4.944,1.06,4.59-8.828,18.009s-3.885,21.188-3.885,21.188c-2.473,11.653,13.064,10.947,13.064,10.947  c4.591,3.884,10.595,3.884,10.595,3.884c3.179,3.531,7.415,2.472,7.415,2.472c2.825-6.709,13.772-3.178,13.772-3.178  c2.472-4.238,16.95-4.944,16.95-4.944c1.766-4.591,2.472-7.416,8.475-8.475c6.004-1.06-37.432-76.982-37.432-76.982  c11.301-1.413-3.179-23.307-3.179-23.307c-3.885-11.653,16.244,14.125,20.128,16.597c3.886,2.472,5.65,6.356,2.825,6.003  s-6.003,3.532-3.531,3.885c2.473,0.354,25.427,26.837,31.43,44.847c6.003,18.01,16.597,25.072,27.544,35.666  c10.947,10.594,9.534,53.322,9.534,53.322c-0.706,15.538,9.888,34.253,9.888,34.253c3.531,6.709-3.885,38.844-3.885,38.844  c-3.531,3.884-1.06,5.297-1.06,5.297c1.767,2.119,13.771,25.425,13.771,25.425c-3.178-0.353,3.179,6.003,3.179,6.003  c9.181,10.594-2.119,5.297-2.119,5.297c-10.594-2.825,1.767,14.479,1.767,14.479c2.119,3.178-13.772-4.944-13.772-4.944  c-16.243-1.06,4.238,11.653,4.238,11.653c15.185,12.713-4.944,4.943-4.944,4.943c-8.122-3.179-2.472,8.828-2.472,8.828  c5.649,2.824,36.02,15.186,36.02,15.186c0.706,6.711-4.591,15.539-4.591,15.539c0.706,7.063-3.179,13.064-3.179,13.064  c-2.118,14.479-3.178,15.891-3.178,15.891c-7.416,0.354-20.481,24.721-20.481,24.721c-3.179,4.591-21.188,25.777-21.188,25.777  c-3.531,12.359-35.313-0.354-35.313-0.354c-11.653,6.003-8.122,0-8.122,0c-0.706-3.884,7.771-14.479,7.771-14.479  c12.358-4.59,7.769-23.658,7.769-23.658c7.063-2.473-12.713-7.416-12.359-9.534c0.354-2.119,10.595-4.591,10.595-4.591  c14.125-3.531,6.355-7.77,6.355-7.77c-1.06-7.063,4.237-16.95,4.237-16.95c20.48-1.413,0-30.019,0-30.019  c-19.068-13.418-20.835-23.659-20.835-23.659c22.247-14.478,7.77-36.372,8.122-42.729c0.354-6.356,2.473-44.494,2.473-44.494  c-3.531-10.947-8.828-34.96-8.828-34.96c3.885-9.181,16.949-31.428,16.949-31.428c4.944-7.416,20.481-15.891,16.598-21.188  c-3.885-5.297-17.655-2.119-17.655-2.119c-13.772-2.472-12.713,6.709-12.713,6.709c-2.825,1.766-4.237,10.594-4.237,10.594  c-1.273,14.007-16.95,25.072-16.95,25.072c-19.775,10.947-3.531,18.01-3.531,18.01c10.595,11.653-6.71,12.006-6.71,12.006  c-19.422-3.178-4.942,14.831-4.942,14.831c19.067,22.601,13.771,27.544,13.771,27.544c-18.009,1.766,4.237,18.009,4.237,18.009  s-1.412-3.531-1.06-0.353c0.354,3.178,5.649,10.594,7.063,14.125c1.412,3.531-5.65,3.885-5.65,3.885  c1.061,16.95-26.132,9.534-26.132,9.534s0,0-2.824,0.353c-2.824,0.354-22.601-1.059-32.841-4.944  c-10.241-3.884-22.248-3.884-22.248-3.884s-7.063,3.178-20.481,2.825s-27.544,4.59-27.544,4.59  c-7.771-0.706,7.415-8.475,7.769-8.122s10.24-9.535-3.885-8.475c-38.485,2.887-57.561-15.185-57.561-15.185  c-3.53-2.472-8.122-7.416-8.122-7.416c-17.655-3.531,2.473,21.894,2.473,21.894c2.119,2.472-0.354,4.238-0.354,4.238  c-1.413-2.825-15.185-12.359-15.185-12.359C368.316,357.817,365.91,355.461,361.794,351.072z", true); tiger.add(s);
    s = makeShape(); s.name = "path466"; s.fill = "#4C0000"; s.geometry = go.Geometry.parse("M319.604,330.579c0,0,20.481,9.887,25.072,14.831c4.591,4.944,29.311,25.072,29.311,25.072  s-9.535-3.531-14.125-6.709c-4.592-3.178-23.66-17.656-23.66-17.656S329.492,335.522,319.604,330.579z", true); tiger.add(s);
    s = makeShape(); s.name = "path470"; s.fill = "#99CC32"; s.geometry = go.Geometry.parse("M217.181,275.496c0.595-0.261-0.33-5.05-0.69-6.008c-1.804-4.813-17.656-7.416-17.656-7.416  c-0.401,2.41-0.498,5.229-0.311,8.121C198.523,270.192,207.119,279.936,217.181,275.496z", true); tiger.add(s);
    s = makeShape(); s.name = "path474"; s.fill = "#659900"; s.geometry = go.Geometry.parse("M217.181,275.143c-0.793,0.279-0.026-4.827-0.337-5.655  c-1.804-4.813-18.009-7.592-18.009-7.592c-0.401,2.41-0.498,5.228-0.311,8.12C198.523,270.015,206.06,279.053,217.181,275.143z", true); tiger.add(s);
    s = makeShape(); s.name = "path478"; s.geometry = go.Geometry.parse("M209.428,275.395c-1.104,0-1.997-2.013-1.997-4.495c0-2.481,0.894-4.494,1.997-4.494  c1.104,0,1.999,2.013,1.999,4.494C211.427,273.382,210.532,275.395,209.428,275.395z", true); tiger.add(s);
    s = makeShape(); s.name = "path486"; s.geometry = go.Geometry.parse("M128.915,448.525c0,0-9.888,17.655,33.9,7.063c0,0,24.719-2.119,28.957-6.355  c2.119,1.411,16.89,6.591,21.894,7.769c12.006,2.825,26.838-14.833,26.838-14.833s8.122-18.539,13.066-18.539  c4.944,0-0.707,2.825-0.707,2.825s-11.653,17.834-10.947,20.659c0,0-9.181,35.313-37.432,36.726c0,0-28.515,1.678-26.131,12.007  c0,0,15.538-4.237,19.775,0c0,0,19.069-0.707,4.944,10.595l-12.006,20.48c0,0,0.247,6.918-17.656,0.706  c-17.303-6.003-35.489-28.78-35.489-28.78S109.758,473.156,128.915,448.525z", true); tiger.add(s);
    s = makeShape(); s.name = "path490"; s.fill = "#E59999"; s.geometry = go.Geometry.parse("M126.796,455.588c0,0-3.531,16.95,61.444-1.413c0,0,7.769,0,12.007,1.413  c4.237,1.412,25.425,6.356,28.957,4.237c0,0-12.713,24.013-33.194,21.188c0,0-23.307,2.825-22.6,11.302  c0,0,7.063,12.712,15.538,16.949c0,0,4.944,4.237,4.237,9.888c-0.706,5.649-5.65,8.476-9.181,9.888  c-3.531,1.413-9.181-4.237-12.006-4.237s-17.656-11.3-25.425-19.774c-7.769-8.476-22.6-29.662-21.894-34.606  C125.384,465.476,126.796,455.588,126.796,455.588z", true); tiger.add(s);
    s = makeShape(); s.name = "path494"; s.fill = "#B26565"; s.geometry = go.Geometry.parse("M132.446,486.398c4.591,6.974,10.241,14.39,14.125,18.627  c7.769,8.476,22.6,19.774,25.425,19.774c2.825,0,8.475,5.65,12.006,4.237c3.531-1.412,8.475-4.237,9.181-9.888  c0.707-5.649-4.237-9.888-4.237-9.888c-5.414-2.707-10.251-8.873-13.04-12.975c0,0,0.327,4.499-8.854,3.087  c-9.181-1.413-18.363-6.356-21.188-12.007c-2.825-5.65-7.063-9.888-4.238-3.531s7.063,12.713,9.888,13.419  c2.825,0.706,2.119,2.825-2.119,2.119c-4.238-0.707-9.182-1.413-16.95-10.594L132.446,486.398L132.446,486.398z", true); tiger.add(s);
    s = makeShape(); s.name = "path498"; s.fill = "#992600"; s.geometry = go.Geometry.parse("M127.855,449.231c0,0,3.178-24.016,5.297-31.077c0,0-1.413-12.007,2.825-19.422  c4.237-7.417,7.769-18.363,13.066-27.897s5.65-16.597,12.712-19.422c7.062-2.825,17.656-18.01,22.6-19.775  c4.944-1.765,4.591-0.353,4.591-0.353s12.006-26.131,36.019-19.069c0,0-28.604-4.944-0.706-21.541c0,0-8.475,1.942-2.648-10.417  c3.886-8.242,3.001,3.708-16.421,24.542c0,0-8.828,15.185-18.009,20.481c-9.181,5.297-30.369,17.657-32.488,24.366  c-2.119,6.709-7.769,16.95-11.3,19.775c-3.531,2.825-8.475,10.241-9.181,16.244c0,0-2.119,7.063-4.591,9.181  c-2.472,2.119-2.825,7.769-2.825,11.299c0,3.532-3.531,8.477-3.178,12.714c0,0,1.412,33.549,0.706,37.079L127.855,449.231z", true); tiger.add(s);
    s = makeShape(); s.name = "path502"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M112.671,457.354c0,0-3.531-2.472-11.3,8.122c0,0,12.889,58.267,12.889,60.738  c0,0,1.942-3.708-0.354-16.421c-2.295-12.713-3.884-35.137-3.884-35.137L112.671,457.354z", true); tiger.add(s);
    s = makeShape(); s.name = "path506"; s.fill = "#992600"; s.geometry = go.Geometry.parse("M150.809,350.354c0,0-31.076,5.65-30.369,57.207l-1.413,43.79c0,0-2.119-45.202-4.238-48.026  c-2.119-2.825,4.944-22.601-0.706-12.007c0,0-24.719,24.719-10.594,62.152c0,0,2.648,5.827-2.648-2.295  c0,0-8.122-22.249-6.18-33.549c0,0,0.353-3.885,3.708-8.828c0,0,15.185-20.659,19.952-24.72c0,0,3.178-25.425,30.369-34.606  C148.69,349.471,158.754,345.41,150.809,350.354z", true); tiger.add(s);
    s = makeShape(); s.name = "path510"; s.geometry = go.Geometry.parse("M396.939,233.468c1.164-0.625,1.148-2.338,2.174-2.644c2.027-0.607,2.317-2.491,3.231-3.875  c1.542-2.329,1.883-5.036,2.91-7.668c0.48-1.236,0.527-2.922-0.024-4.087c-2.072-4.381-3.313-8.705-5.858-12.988  c-0.473-0.794-0.937-2.196-1.29-3.252c-0.817-2.443-3.037-4.193-4.556-6.524c-0.51-0.779,0.419-2.412-0.847-2.56  c-1.584-0.186-4.143-1.209-4.554,0.602c-1.038,4.568,0.747,9.022,2.456,13.334c-1.381,1.222-0.791,2.848-0.522,4.202  c1.255,6.367-0.86,12.286-2.204,18.419c-0.041,0.184,0.563,0.533,0.514,0.643c-2.158,4.743-4.722,9.06-7.935,13.264  c-1.338,1.751-2.878,3.369-3.755,5.246c-0.649,1.39-1.37,3.095-0.929,4.84c-6.065,4.908-10.038,11.697-14.647,18.488  c-0.815,1.201-0.303,3.335,0.672,3.811c1.435,0.703,3.123-1.105,3.953-2.599c0.687-1.232,1.31-2.38,2.177-3.516  c0.233-0.309-0.081-1.049,0.157-1.262c4.647-4.144,7.596-9.328,11.927-13.509c3.442-0.581,6.157-2.343,9.243-4.131  c0.544-0.316,1.469,0.124,1.98-0.221c3.095-2.078,3.091-5.673,3.278-9.045C394.58,236.872,394.927,234.547,396.939,233.468z", true); tiger.add(s);
    s = makeShape(); s.name = "path514"; s.geometry = go.Geometry.parse("M381.329,225.583c0.22-0.136-0.055-0.883,0.138-1.264c0.286-0.572,0.998-0.904,1.284-1.476  c0.192-0.381-0.096-1.052,0.146-1.303c4.118-4.321,4.572-9.66,2.743-14.909c1.809-1.095,1.915-3.323,1.165-4.818  c-1.506-3.002-1.847-6.402-3.567-9.127c-1.416-2.24-4.202-4.437-6.623-2.136c-0.743,0.706-1.311,2.096-0.819,3.353  c0.113,0.288,0.616,0.545,0.568,0.69c-0.188,0.572-1.152,0.967-1.163,1.448c-0.053,2.641-1.737,5.309-0.625,7.656  c1.363,2.876,2.809,6.155,4.003,9.291c-2.179,3.736-0.355,8.06-3.45,11.374c-0.24,0.258-0.225,0.939-0.009,1.296  c0.516,0.858,1.231,1.575,2.09,2.091c0.357,0.213,0.972,0.217,1.324-0.002C379.553,227.106,380.256,226.247,381.329,225.583z", true); tiger.add(s);
    s = makeShape(); s.name = "path518"; s.geometry = go.Geometry.parse("M492.233,207.377c2.451,3.164,2.964,8.099-0.653,10.554c0.971,5.842,6.888,2.348,10.594,1.412  c-0.191-0.685,0.208-1.292,0.708-1.301c1.866-0.026,3.066-1.849,4.941-1.523c0.767-2.75,3.659-3.989,4.796-6.425  c3.048-6.524,2.004-14.069-2.559-19.8c-0.356-0.449,0.025-1.361-0.192-2c-1.335-3.904-4.986-4.46-8.401-5.675  c-2.078-6.842-3.245-13.959-6.354-20.481c-2.851-0.441-4.082-3.512-6.443-4.783c-2.354-1.27-3.355,1.519-3.284,3.365  c0.014,0.362,0.812,0.757,0.512,1.402c-0.136,0.29-0.595,0.486-0.595,0.722c0.002,0.238,0.394,0.47,0.629,0.707  c-1.62,1.448-4.134,2.29-4.653,4.312c-1.686,6.55,2.857,12.068,5.804,17.72c1.044,2.004-0.256,4.249-1.598,6.381  c-0.773,1.227-0.583,3.217-0.097,4.729C486.714,200.806,489.521,203.876,492.233,207.377z", true); tiger.add(s);
    s = makeShape(); s.name = "path522"; s.geometry = go.Geometry.parse("M426.622,239.84c-2.626,3.268-8.65,7.804-3.5,11.208c0.343,0.228,0.996,0.234,1.302-0.002  c3.568-2.763,7.104-4.357,11.405-5.385c0.22-0.051,0.703,0.773,1.354,0.489c2.849-1.242,6.397-1.139,8.487-3.501  c6.651,0.396,12.946-1.575,18.934-3.884c2.051-0.791,4.293-1.778,6.412-2.665c2.431-1.017,4.557-2.655,6.521-4.67  c0.233-0.24,0.858-0.082,1.331-0.082c-0.07-1.523,1.628-1.748,2.063-2.846c0.163-0.41-0.102-1.109,0.133-1.289  c3.775-2.878,5.399-6.441,3.336-10.638c-0.504-1.021-0.942-2.112-1.941-2.952c-1.916-1.608-3.862-0.101-5.711-0.637  c-0.28,1.108-1.567,0.805-2.249,1.155c-1.517,0.775-3.87-0.258-5.387,0.515c-2.405,1.227-4.598,1.526-7.106,2.191  c-0.552,0.145-1.925-0.025-2.208,1.083c-0.236-0.237-0.497-0.65-0.685-0.611c-3.369,0.699-5.595,1.077-7.892,4.064  c-0.182,0.235-0.962-0.081-1.243,0.157c-1.688,1.427-2.403,3.605-4.349,4.792c-0.354,0.217-0.977-0.079-1.319,0.148  c-1.141,0.761-1.787,1.893-2.922,2.682c-0.581,0.404-1.287-0.169-1.229-0.622c0.433-3.438,1.585-6.593,0.569-9.905  c3.667-4.449,8.111-7.891,11.301-12.713c0.025-3.824,1.248-7.613,1.049-11.28c-0.019-0.341-0.526-1.635-0.748-2.248  c-0.552-1.508,1.049-3.39-0.441-4.668c-2.479-2.124-4.761-0.578-6.216,1.953c-3.245,0.688-6.893,1.912-9.679-0.267  c-1.778-1.39-2.799-2.989-4.21-4.854c-1.738-2.299-1.147-4.834-1.023-7.596c0.011-0.226-0.546-0.466-0.546-0.703  c0.002-0.238,0.391-0.47,0.627-0.706c-1.246-1.105-1.731-2.974-3.531-3.532c0.538-1.928-0.654-3.489-2.192-4.022  c-3.522-1.22-6.483,2.156-9.823,2.285c-0.908,0.034-1.732-1.799-2.878-2.373c-0.764-0.381-2.006-0.439-2.646,0.03  c-1.215,0.89-2.255,1.091-3.593,1.453c-2.854,0.77-5.11,2.701-7.725,4.211c-2.622,1.513-4.31,4.05-6.216,6.381  c-1.661,2.034-1.901,6.296,0.605,7.179c3.254,1.148,5.557-3.625,9.027-3.049c0.551,0.09,0.915,0.639,0.721,1.324  c0.688,0.193,1.071-0.212,1.412-0.706c1.515,1.799,3.57,2.394,5.227,3.936c1.714,1.596,4.796,0.858,6.589,2.619  c2.698,2.652,1.712,7.386,5.136,9.69c-1.034,2.318-2.106,4.573-2.698,7.092c-0.497,2.129,1.258,4.243,3.396,4.082  c2.222-0.166,2.684-1.506,3.54-3.406c0.472,0.472,1.3,0.996,1.228,1.377c-0.807,4.214-2.62,7.733-3.429,12.025  c-0.104,0.56-0.644,0.917-1.33,0.722c-0.826,7.326-7.98,11.553-12.475,17.141c-0.712,0.886-0.719,3.092,0.004,3.803  c2.478,2.449,5.938-0.281,8.938-1.169c0.376-2.129,1.893-3.792,4.245-3.694c0.452,0.018,0.866-0.939,1.438-1.169  c0.614-0.244,1.501,0.152,2.007-0.198c3.053-2.11,5.539-4.063,8.606-6.162c0.339-0.231,0.946,0.05,1.328-0.141  c0.574-0.286,0.904-0.969,1.475-1.296c0.614-0.353,1.041,0.159,1.383,0.653c-1.142,0.616-1.147,2.306-2.176,2.663  c-1.367,0.473-2.358,1.379-3.549,2.168c-0.516,0.341-1.68-0.097-1.862,0.219C429.966,237.508,427.875,238.281,426.622,239.84z", true); tiger.add(s);
    s = makeShape(); s.name = "path526"; s.geometry = go.Geometry.parse("M328.785,152.602c0,0-16.312-5.071-36.019,40.257c0,0-4.238,9.181-8.475,12.712  c-4.238,3.531-24.013,9.888-27.544,16.95l-18.363,28.25c0,0,26.131-28.25,31.782-32.488c0,0,14.125-14.832,8.475-2.825  c0,0-24.719,19.069-22.601,35.313c0,0-9.887,25.425-11.3,28.957c0,0,28.25-56.5,32.488-58.62c4.237-2.119,6.356-2.119,4.237,4.238  c-2.119,6.357-2.825,35.313-7.769,38.844c0,0,14.125-36.02,12.712-41.669c0,0,5.65-6.356,9.888,2.825l-2.119,28.25l7.769,21.188  c0,0-4.237-19.775-1.413-47.319c0,0-3.531-18.363,3.531-8.475c7.062,9.888,24.013,20.481,24.013,28.957  c0,0-9.181-31.075-25.425-39.55l-7.063,10.594l-2.119-3.531c0,0-6.356-1.413,1.413-13.419c7.769-12.006,7.063-13.419,7.063-13.419  s11.3,12.713,14.125,12.713c0,0,23.307-13.419,25.425,29.663c0,0,12.007-25.425-4.237-37.432c0,0-26.132-3.531-24.013-12.712  l12.713-21.894c6.356-9.182,3.531-4.238,3.531-4.238L328.785,152.602z", true); tiger.add(s);
    s = makeShape(); s.name = "path530"; s.geometry = go.Geometry.parse("M293.473,181.558c0,0-22.6,0-28.25,9.181l-12.713,16.95c0,0,30.369-17.656,37.432-19.775  S293.473,181.558,293.473,181.558z", true); tiger.add(s);
    s = makeShape(); s.name = "path534"; s.geometry = go.Geometry.parse("M222.847,192.858c0,0-3.531,2.119-4.238,7.063c-0.706,4.944-4.944,5.65-3.531,10.594  c1.413,4.944,4.944,9.182,4.944,2.119c0-7.063,2.825-10.594,4.238-12.712C225.672,197.802,228.497,190.033,222.847,192.858z", true); tiger.add(s);
    s = makeShape(); s.name = "path538"; s.geometry = go.Geometry.parse("M207.31,300.916c0,0-14.832-7.063-20.481-13.419c-5.65-6.356-4.852,2.765-13.419,2.119  c-10.324-0.779-8.475-28.957-8.475-28.957l-7.063,13.418c0,0-2.119,25.425,12.006,21.188c6.898-2.069,9.181,0.706,6.356,2.119  c-2.825,1.413,9.887,2.119,4.943,4.944c-4.943,2.825,20.481-6.356,16.244,12.006L207.31,300.916z", true); tiger.add(s);
    s = makeShape(); s.name = "path542"; s.geometry = go.Geometry.parse("M185.063,326.341c0,0-27.191,7.769-33.547-9.181c0,0-8.475,4.237-4.591,9.534  c3.885,5.297,6.003,6.003,6.003,6.003s9.534,2.119,8.475,3.531c-1.06,1.413-5.297,7.416-5.297,7.416S174.115,333.05,185.063,326.341  z", true); tiger.add(s);
    s = makeShape(); s.name = "path546"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M588.337,464.416c-0.754,3.768-3.704,5.182-7.063,6.355c-3.386-1.69-7.973-7.176-11.301-3.53  c-0.837-0.849-2.213-0.954-2.819-2.123c-0.82-1.585-0.342-3.433-0.944-4.841c-0.962-2.246-2.214-4.658-1.886-7.161  c3.188-1.258,4.239-4.623,3.401-7.735c-0.122-0.454-0.879-0.802-0.525-1.418c0.329-0.57,0.89-0.972,1.36-1.441  c-0.237,0.237-0.493,0.648-0.689,0.613c-1.077-0.188-0.857-1.313-0.628-1.995c1.032-3.083,4.589-3.549,6.969-1.443  c0.452-0.998,1.352-0.655,2.118-0.706c-0.088-1.022,0.633-1.953,0.982-2.694c0.913-1.938,3.791,0.014,5.197-1.065  c1.899-1.457,3.776-2.691,5.681-1.628c3.193,1.789,6.212,3.93,8.327,7.004c1.017,1.473,1.439,3.733,1.338,5.426  c-0.067,1.143-2.507,0.521-3.111,2.161c-1.139,3.086,2.095,4.003,3.43,6.364c0.35,0.616-0.117,1.153-0.673,1.326  c-0.726,0.227-2.11-0.107-1.866,0.691C597.351,462.212,592.484,463.409,588.337,464.416z", true); tiger.add(s);
    s = makeShape(); s.name = "path550"; s.fill = "#FFFFFF"; s.geometry = go.Geometry.parse("M571.385,499.022c-0.012-3.068-2.839-6.17-0.704-9.183c0.238,0.237,0.471,0.627,0.706,0.627  c0.238,0,0.471-0.39,0.706-0.627c2.641,3.913,9.088,5.552,8.837,10.576c-0.038,0.79-1.958,2.41-0.36,3.55  c-3.201,2.38-3.3,6.564-4.944,9.887c-2.186-0.505-4.325-1.146-6.356-2.117c0.622-2.624,0.415-5.599,1.863-7.929  C571.896,502.575,571.391,500.67,571.385,499.022z", true); tiger.add(s);
    s = makeShape(); s.name = "path554"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M277.935,483.132c0,0-29.765,17.896-4.944-9.182c15.538-16.95,33.194-26.838,33.194-26.838  s18.362-7.771,24.719-9.89c6.355-2.119,33.193-11.301,38.845-12.007c5.649-0.706,22.6-7.769,34.606-0.706  c12.006,7.063,26.131,14.831,26.131,14.831s-28.956-14.831-35.313-10.594c-6.356,4.237-19.069,3.531-29.663,9.182  c0,0-26.131,7.771-31.781,11.303c-5.649,3.53-24.013,24.013-26.837,22.601c-2.825-1.413,0.706-2.119,2.825-7.063  c2.119-4.943-1.412-7.77-15.538,3.531C280.054,479.601,277.935,483.132,277.935,483.132z", true); tiger.add(s);
    s = makeShape(); s.name = "path558"; s.geometry = go.Geometry.parse("M291.01,472.596c0,0,2.49-23.022,17.459-20.084c0,0,14.523-7.361,19.33-10.837c0,0,14.37-3.006,16.685-4.095  c32.627-15.361,58.614-7.383,59.581-9.359c0.965-1.977,35.614,10.59,41.986,17.806c0.69,0.781-18.063-9.884-35.188-13.223  c-14.607-2.85-52.748,0.438-72.005,10.211c-5.249,2.664-21.043,12.877-25.513,12.682C308.878,455.498,291.01,472.596,291.01,472.596  z", true); tiger.add(s);
    s = makeShape(); s.name = "path562"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M284.292,517.738c0,0-26.838-4.237,2.825-7.063c0,0,31.782-3.531,38.844-12.713  c0,0,24.013-16.244,28.956-16.95c4.944-0.706,57.913-13.419,58.619-17.656c0.707-4.236,10.595-4.236,13.419-2.824  c2.825,1.413,1.413,3.53-3.531,4.943c-4.943,1.412-60.031,30.369-71.332,32.487c-11.3,2.119-31.781,15.538-40.256,17.656  C303.36,517.738,284.292,517.738,284.292,517.738z", true); tiger.add(s);
    s = makeShape(); s.name = "path566"; s.geometry = go.Geometry.parse("M318.757,504.676c0,0-15.153-1.464,0.033-2.909c0,0,15.566-6.046,19.183-10.748c0,0,12.296-8.316,14.826-8.678  c2.531-0.362,27.18-6.872,27.542-9.04c0.362-2.17,60.51-24.384,68.314-18.751c5.14,3.709-12.343,0.748-29.354,8.535  c-2.393,1.095-62.164,26.85-67.95,27.934c-5.785,1.087-16.271,7.956-20.611,9.04C326.402,501.145,318.757,504.676,318.757,504.676z", true); tiger.add(s);
    s = makeShape(); s.name = "path570"; s.geometry = go.Geometry.parse("M304.773,508.557c0,0,9.181-0.706,7.063,2.119c-2.119,2.825-6.357,1.412-6.357,1.412L304.773,508.557z", true); tiger.add(s);
    s = makeShape(); s.name = "path574"; s.geometry = go.Geometry.parse("M292.061,511.382c0,0,9.181-0.706,7.063,2.119c-2.119,2.825-6.356,1.412-6.356,1.412L292.061,511.382z", true); tiger.add(s);
    s = makeShape(); s.name = "path578"; s.geometry = go.Geometry.parse("M273.698,514.207c0,0,9.181-0.706,7.063,2.119c-2.119,2.824-6.356,1.412-6.356,1.412L273.698,514.207z", true); tiger.add(s);
    s = makeShape(); s.name = "path582"; s.geometry = go.Geometry.parse("M260.279,515.619c0,0,9.181-0.706,7.063,2.119c-2.118,2.825-6.356,1.412-6.356,1.412L260.279,515.619z", true); tiger.add(s);
    s = makeShape(); s.name = "path586"; s.geometry = go.Geometry.parse("M328.079,445.7c0,0,7.77,0,5.649,2.825c-2.119,2.824-7.769,2.117-7.769,2.117L328.079,445.7z", true); tiger.add(s);
    s = makeShape(); s.name = "path590"; s.geometry = go.Geometry.parse("M310.423,455.588c0,0,11.487-3.78,7.063,2.118c-2.118,2.825-6.356,1.413-6.356,1.413L310.423,455.588z", true); tiger.add(s);
    s = makeShape(); s.name = "path594"; s.geometry = go.Geometry.parse("M290.648,464.063c0,0,9.181-0.705,7.063,2.119c-2.118,2.825-6.356,1.412-6.356,1.412L290.648,464.063z", true); tiger.add(s);
    s = makeShape(); s.name = "path598"; s.geometry = go.Geometry.parse("M277.229,474.656c0,0,9.181-0.706,7.063,2.119c-2.118,2.824-6.356,1.411-6.356,1.411L277.229,474.656z", true); tiger.add(s);
    s = makeShape(); s.name = "path602"; s.geometry = go.Geometry.parse("M265.223,483.132c0,0,9.181-0.706,7.063,2.118c-2.119,2.825-6.356,1.413-6.356,1.413L265.223,483.132z", true); tiger.add(s);
    s = makeShape(); s.name = "path606"; s.geometry = go.Geometry.parse("M334.228,494.427c0,0,12.221-0.938,9.4,2.819c-2.82,3.761-8.461,1.881-8.461,1.881L334.228,494.427z", true); tiger.add(s);
    s = makeShape(); s.name = "path610"; s.geometry = go.Geometry.parse("M352.59,485.951c0,0,12.221-0.939,9.4,2.82c-2.819,3.761-8.461,1.88-8.461,1.88L352.59,485.951z", true); tiger.add(s);
    s = makeShape(); s.name = "path614"; s.geometry = go.Geometry.parse("M371.659,478.183c0,0,12.22-0.938,9.399,2.819c-2.819,3.761-8.461,1.881-8.461,1.881L371.659,478.183z", true); tiger.add(s);
    s = makeShape(); s.name = "path618"; s.geometry = go.Geometry.parse("M390.021,469.708c0,0,12.221-0.939,9.399,2.819c-2.819,3.761-8.461,1.88-8.461,1.88L390.021,469.708z", true); tiger.add(s);
    s = makeShape(); s.name = "path622"; s.geometry = go.Geometry.parse("M341.29,437.926c0,0,12.22-0.938,9.4,2.82c-2.82,3.761-9.874,3.293-9.874,3.293L341.29,437.926z", true); tiger.add(s);
    s = makeShape(); s.name = "path626"; s.geometry = go.Geometry.parse("M358.946,432.276c0,0,12.22-0.939,9.399,2.818c-2.818,3.762-10.58,3.293-10.58,3.293L358.946,432.276z", true); tiger.add(s);
    s = makeShape(); s.name = "path630"; s.geometry = go.Geometry.parse("M318.898,502.907c0,0,9.181-0.706,7.063,2.118c-2.119,2.824-6.355,1.413-6.355,1.413L318.898,502.907z", true); tiger.add(s);
    s = makeShape(); s.name = "path634"; s.fill = "#992600"; s.geometry = go.Geometry.parse("M189.653,327.753c0,0-7.769,15.538-8.475,21.188c0,0,1.413-15.538,3.531-19.069  C186.828,326.341,189.653,327.753,189.653,327.753z", true); tiger.add(s);
    s = makeShape(); s.name = "path638"; s.fill = "#992600"; s.geometry = go.Geometry.parse("M157.165,352.472c0,0-5.65,25.425-4.944,30.369c0,0-2.119-20.481-1.412-22.6  C151.515,358.123,157.165,352.472,157.165,352.472z", true); tiger.add(s);
    s = makeShape(); s.name = "path642"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M193.891,220.755l-0.353,5.65l-3.885,0.354c0,0,25.072,22.247,26.132,35.666  C215.785,262.425,217.197,247.946,193.891,220.755z", true); tiger.add(s);
    s = makeShape(); s.name = "path646"; s.geometry = go.Geometry.parse("M200.925,222.989c-0.761-0.734-0.374-2.05-1.095-2.509c-1.428-0.911,2.292-1.012,1.889-2.276  c-0.676-2.129-0.346-2.167-0.562-4.419c-0.101-1.056,0.938-3.775,1.618-4.552c2.553-2.917,0.215-8.094,3.111-10.833  c0.537-0.51,1.201-1.485,1.704-2.223c1.164-1.7,3.254-2.562,4.931-4.024c0.562-0.487,0.207-1.948,1.211-1.785  c1.261,0.203,3.452-0.026,3.373,1.458c-0.2,3.743-2.546,6.78-4.806,9.725c0.796,1.243-0.013,2.364-0.514,3.348  c-2.357,4.626-2.023,9.642-2.331,14.657c-0.009,0.15-0.551,0.288-0.537,0.381c0.623,4.123,1.654,8.005,3.207,11.941  c0.646,1.642,1.478,3.222,1.743,4.859c0.196,1.211,0.378,2.682-0.343,3.927c3.593,5.103,1.282,9.783,3.346,16.018  c0.365,1.104,3.353,4.483,2.535,4.199c-4.437-1.538-4.635-2.241-4.947-3.57c-0.258-1.1-0.84-3.531-1.259-4.594  c-0.113-0.29-0.415-3.616-0.553-3.832c-2.671-4.206-0.274-3.895-2.692-8.059c-2.521-1.201-4.227-3.15-6.21-5.202  c-0.35-0.36,1.668-1.638,1.349-2.014c-1.928-2.276-3.964-3.63-3.371-6.267C201.997,226.126,202.238,224.26,200.925,222.989z", true); tiger.add(s);
    s = makeShape(); s.name = "path650"; s.geometry = go.Geometry.parse("M194.597,226.052c0,0,0.707,12.006,4.944,14.832c4.238,2.825,2.119,1.413-3.531-0.706  c-5.65-2.119-3.531-3.531-3.531-3.531s-4.944,0.706-0.706,4.237c4.237,3.531,10.594,7.769,7.769,7.769s-16.244-7.063-16.244-12.006  c0-4.944-1.766-12.183-1.766-12.183s1.942-1.413,10.417-1.236C191.948,223.228,194.42,224.463,194.597,226.052z", true); tiger.add(s);
    s = makeShape(); s.name = "path654"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M193.184,258.894c0,0-15.043-4.928-47.672,1.059  c0,0,15.946-3.669,49.085,0.353C212.783,262.513,193.184,258.894,193.184,258.894z", true); tiger.add(s);
    s = makeShape(); s.name = "path658"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M196.889,258.768c0,0-14.56-6.211-47.586-3.067  c0,0,16.205-2.276,48.871,4.596C216.103,264.068,196.889,258.768,196.889,258.768z", true); tiger.add(s);
    s = makeShape(); s.name = "path662"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M200.045,258.932c0,0-14.058-7.276-47.226-6.596  c0,0,16.329-1.066,48.395,8.217C218.811,265.647,200.045,258.932,200.045,258.932z", true); tiger.add(s);
    s = makeShape(); s.name = "path666"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M202.288,259.326c0,0-12.049-7.604-41.842-9.543  c0,0,14.724,0.3,42.764,11.086C218.599,266.789,202.288,259.326,202.288,259.326z", true); tiger.add(s);
    s = makeShape(); s.name = "path670"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M405.838,277.894c0,0-1.642,1.137-1.264-0.948  c0.38-2.085,50.185-25.339,56.564-24.897C461.14,252.048,407.732,275.365,405.838,277.894z", true); tiger.add(s);
    s = makeShape(); s.name = "path674"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M399.846,279.021c0,0-1.547,1.263-1.333-0.846  c0.214-2.108,48.04-29.202,54.436-29.262C452.947,248.914,401.537,276.354,399.846,279.021z", true); tiger.add(s);
    s = makeShape(); s.name = "path678"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M394.044,281.449c0,0-1.462,1.363-1.388-0.755  c0.074-2.117,35.063-29.479,52.389-32.788C445.045,247.906,413.21,262.255,394.044,281.449z", true); tiger.add(s);
    s = makeShape(); s.name = "path682"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M388.966,284.739c0,0-1.314,1.226-1.248-0.68  c0.066-1.907,31.557-26.532,47.147-29.509C434.865,254.55,406.216,267.464,388.966,284.739z", true); tiger.add(s);
    s = makeShape(); s.name = "path686"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M333.023,545.988c0,0-26.838-4.237,2.824-7.063c0,0,31.781-3.531,38.845-12.712  c0,0,24.013-16.244,28.956-16.95c4.943-0.707,33.899-7.063,34.606-11.301c0.706-4.237,11.3-8.475,14.125-7.063  c2.825,1.413,2.825,17.655-2.119,19.068c-4.942,1.412-38.138,14.125-49.438,16.244c-11.301,2.118-31.782,15.537-40.257,17.656  C352.092,545.988,333.023,545.988,333.023,545.988z", true); tiger.add(s);
    s = makeShape(); s.name = "path690"; s.geometry = go.Geometry.parse("M461.915,479.953c0,0-5.297,2.825-7.416,7.416c0,0-11.3,18.716-36.372,24.366c0,0-40.609,15.891-54.382,19.422  c0,0-23.659,8.828-36.727,7.416c0,0-12.358,0.353-1.411,3.178c0,0,35.666-3.531,41.669-6.709c0,0,27.544-9.182,32.841-13.772  c5.297-4.59,37.432-13.419,41.315-16.949C445.317,500.789,462.621,485.957,461.915,479.953z", true); tiger.add(s);
    s = makeShape(); s.name = "path694"; s.geometry = go.Geometry.parse("M358.24,535.589c0,0,9.231-0.398,7.195,2.336c-2.034,2.737-6.356,1.193-6.356,1.193L358.24,535.589z", true); tiger.add(s);
    s = makeShape(); s.name = "path698"; s.geometry = go.Geometry.parse("M345.523,537.977c0,0,9.23-0.398,7.196,2.336c-2.036,2.736-6.357,1.195-6.357,1.195L345.523,537.977z", true); tiger.add(s);
    s = makeShape(); s.name = "path702"; s.geometry = go.Geometry.parse("M327.11,540.18c0,0,9.231-0.399,7.195,2.336c-2.034,2.735-6.356,1.193-6.356,1.193L327.11,540.18z", true); tiger.add(s);
    s = makeShape(); s.name = "path706"; s.geometry = go.Geometry.parse("M313.631,541.141c0,0,9.232-0.398,7.197,2.336c-2.036,2.736-6.358,1.193-6.358,1.193L313.631,541.141z", true); tiger.add(s);
    s = makeShape(); s.name = "path710"; s.geometry = go.Geometry.parse("M387.432,522.526c0,0,12.289-0.531,9.578,3.108c-2.708,3.642-8.463,1.59-8.463,1.59L387.432,522.526z", true); tiger.add(s);
    s = makeShape(); s.name = "path714"; s.geometry = go.Geometry.parse("M405.645,514.714c0,0,10.521-5.828,9.578,3.109c-0.477,4.513-8.463,1.589-8.463,1.589L405.645,514.714z", true); tiger.add(s);
    s = makeShape(); s.name = "path718"; s.geometry = go.Geometry.parse("M421.768,509.745c0,0,12.642-6.534,9.579,3.108c-1.374,4.326-8.465,1.59-8.465,1.59L421.768,509.745z", true); tiger.add(s);
    s = makeShape(); s.name = "path722"; s.geometry = go.Geometry.parse("M438.566,501.226c0,0,7.695-8.652,9.578,3.109c0.717,4.481-8.464,1.59-8.464,1.59L438.566,501.226z", true); tiger.add(s);
    s = makeShape(); s.name = "path726"; s.geometry = go.Geometry.parse("M372.28,530.444c0,0,9.23-0.401,7.196,2.336c-2.035,2.733-6.359,1.192-6.359,1.192L372.28,530.444z", true); tiger.add(s);
    s = makeShape(); s.name = "path730"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M435.138,316.105c0,0-1.282,1.174-1.284-0.717  c0-1.889,30.871-25.309,46.484-27.752C480.338,287.636,451.913,299.517,435.138,316.105z", true); tiger.add(s);
    s = makeShape(); s.name = "path734"; s.geometry = go.Geometry.parse("M440.374,428.748c0,0,38.847,39.553,55.09,45.908c0,0,16.244,19.774,9.183,65.683  c0,0-5.65,13.419-11.301-23.307c0,0,5.649-44.494-14.125-16.244c0,0-14.834-17.479-3.533-16.95c0,0,5.651,3.531,6.357,0.706  c0.707-2.825-13.42-26.838-43.789-52.265C407.887,406.854,440.374,428.748,440.374,428.748z", true); tiger.add(s);
    s = makeShape(); s.name = "path738"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M337.261,497.257c0,0-0.354-3.178,2.825-1.766  c3.178,1.412,169.503,12.358,225.298,54.734C565.384,550.227,485.576,509.264,337.261,497.257z", true); tiger.add(s);
    s = makeShape(); s.name = "path742"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M355.623,489.488c0,0-0.354-3.18,2.825-1.767  c3.179,1.412,244.367-0.354,286.036,56.854C644.484,544.576,605.641,500.082,355.623,489.488z", true); tiger.add(s);
    s = makeShape(); s.name = "path746"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M376.104,482.426c0,0-0.353-3.179,2.825-1.766  c3.18,1.412,309.343-21.541,351.013,35.666C729.941,516.326,712.991,471.125,376.104,482.426z", true); tiger.add(s);
    s = makeShape(); s.name = "path750"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M393.762,473.95c0,0-0.354-3.178,2.824-1.767  c3.179,1.413,218.941-66.742,260.611-9.533C657.197,462.65,633.537,419.214,393.762,473.95z", true); tiger.add(s);
    s = makeShape(); s.name = "path754"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M291.354,514.207c0,0-0.353-3.178,2.825-1.766  c3.178,1.412,34.606,5.297,38.138,73.804C332.317,586.245,319.604,512.088,291.354,514.207z", true); tiger.add(s);
    s = makeShape(); s.name = "path758"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M275.816,517.032c0,0-0.353-3.18,2.825-1.767  c3.178,1.412,28.25-6.71,23.306,61.797C301.948,577.063,304.066,514.913,275.816,517.032z", true); tiger.add(s);
    s = makeShape(); s.name = "path762"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M261.691,517.738c0,0-0.354-3.179,2.825-1.767  c3.179,1.412,30.369,2.473,8.475,42.022C272.991,557.995,289.941,515.619,261.691,517.738z", true); tiger.add(s);
    s = makeShape(); s.name = "path766"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M345.252,439.457c0,0-0.784,3.529,1.951,1.381  c28.37-22.292,85.65-126.292,183.971-136.239C531.174,304.599,463.536,283.217,345.252,439.457z", true); tiger.add(s);
    s = makeShape(); s.name = "path770"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M365.027,436.278c0,0-2.406-2.106,0.892-3.21  c3.298-1.104,201.831-129.115,271.194-115.05C637.113,318.018,589.252,304.758,365.027,436.278z", true); tiger.add(s);
    s = makeShape(); s.name = "path774"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M328.229,447.053c0,0-0.897,2.823,2.122,1.101  c15.848-9.04,22.229-110.054,99.171-112.271C429.521,335.882,372.297,309.903,328.229,447.053z", true); tiger.add(s);
    s = makeShape(); s.name = "path778"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M293.053,466.521c0,0-1.902,2.271,1.546,1.821  c18.091-2.352,55.884-75.222,134.348-66.254C428.947,402.089,372.507,376.759,293.053,466.521z", true); tiger.add(s);
    s = makeShape(); s.name = "path782"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M312.895,455.704c0,0-1.432,2.594,1.868,1.49  c17.303-5.78,40.403-84.549,119.13-90.813C433.893,366.382,373.639,352.357,312.895,455.704z", true); tiger.add(s);
    s = makeShape(); s.name = "path786"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M280.623,475.559c0,0-1.542,1.841,1.252,1.478  c14.653-1.905,45.265-60.929,108.822-53.665C390.696,423.37,344.979,402.854,280.623,475.559z", true); tiger.add(s);
    s = makeShape(); s.name = "path790"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M267.206,485.992c0,0-1.775,1.845,1.035,1.637  c7.359-0.546,61.455-58.951,94.063-31.58C362.303,456.049,341.089,422.99,267.206,485.992z", true); tiger.add(s);
    s = makeShape(); s.name = "path794"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M389.974,429.627c0,0-2.12-2.392,1.291-3.071  c3.411-0.679,216.529-102.579,283.56-79.862C674.823,346.693,629.021,327.494,389.974,429.627z", true); tiger.add(s);
    s = makeShape(); s.name = "path798"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M330.904,543.164c0,0-0.354-3.179,2.824-1.768  c3.179,1.413,30.369,2.474,8.476,42.022C342.204,583.42,359.154,541.045,330.904,543.164z", true); tiger.add(s);
    s = makeShape(); s.name = "path802"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M349.268,540.339c0,0-0.354-3.179,2.824-1.766  c3.18,1.412,34.607,5.297,38.14,73.804C390.23,612.377,377.518,538.22,349.268,540.339z", true); tiger.add(s);
    s = makeShape(); s.name = "path806"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M361.273,537.514c0,0-0.354-3.179,2.824-1.766  c3.179,1.412,46.613,7.416,88.282,64.622C452.381,600.37,389.523,535.395,361.273,537.514z", true); tiger.add(s);
    s = makeShape(); s.name = "path810"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M374.736,533.931c0,0-0.771-3.104,2.564-2.125  c3.337,0.979,39.416-2.375,106.684,57.969C483.984,589.773,402.455,528.076,374.736,533.931z", true); tiger.add(s);
    s = makeShape(); s.name = "path814"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M393.1,526.162c0,0-0.771-3.104,2.565-2.126  c3.337,0.979,64.841,8.926,156.119,70.681C551.784,594.717,420.818,520.308,393.1,526.162z", true); tiger.add(s);
    s = makeShape(); s.name = "path818"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M321.723,505.732c0,0-0.353-3.18,2.825-1.767  c3.179,1.412,97.464,6.003,151.14,53.322C475.688,557.289,414.064,513.545,321.723,505.732z", true); tiger.add(s);
    s = makeShape(); s.name = "path822"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M304.066,512.795c0,0-0.353-3.179,2.825-1.766  c3.179,1.412,46.613,7.415,88.282,64.622C395.174,575.651,332.317,510.676,304.066,512.795z", true); tiger.add(s);
    s = makeShape(); s.name = "path826"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M412.306,518.021c0,0-0.997-3.037,2.403-2.308  s65.321,4.147,160.88,59.049C575.589,574.764,438.462,514.036,412.306,518.021z", true); tiger.add(s);
    s = makeShape(); s.name = "path830"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M427.138,513.785c0,0-0.998-3.039,2.402-2.309  c3.401,0.729,65.322,4.147,160.88,59.049C590.42,570.525,454.354,509.092,427.138,513.785z", true); tiger.add(s);
    s = makeShape(); s.name = "path834"; s.fill = "#FFFFFF"; s.stroke = "#000000"; s.strokeWidth = 0.1; s.geometry = go.Geometry.parse("M444.088,504.957c0,0-0.998-3.039,2.402-2.308  c3.399,0.729,79.447,8.385,237.863,68.936C684.354,571.585,471.303,500.264,444.088,504.957z", true); tiger.add(s);
    s = makeShape(); s.name = "path838"; s.geometry = go.Geometry.parse("M247.566,517.032c0,0,9.182-0.706,7.063,2.118s-6.356,1.412-6.356,1.412L247.566,517.032z", true); tiger.add(s);
    s = makeShape(); s.name = "path842"; s.geometry = go.Geometry.parse("M301.948,541.751c0,0,9.181-0.706,7.063,2.119c-2.119,2.825-6.356,1.412-6.356,1.412L301.948,541.751z", true); tiger.add(s);
    s = makeShape(); s.name = "path846"; s.geometry = go.Geometry.parse("M286.41,541.045c0,0,9.182-0.706,7.063,2.119c-2.119,2.824-6.356,1.412-6.356,1.412L286.41,541.045z", true); tiger.add(s);
    s = makeShape(); s.name = "path850"; s.geometry = go.Geometry.parse("M118.022,520.177c0,0,8.908,2.336,5.98,4.313c-2.926,1.978-6.469-0.745-6.469-0.745L118.022,520.177z", true); tiger.add(s);
    s = makeShape(); s.name = "path854"; s.geometry = go.Geometry.parse("M121.554,503.227c0,0,8.908,2.336,5.98,4.313c-2.926,1.978-6.469-0.745-6.469-0.745L121.554,503.227z", true); tiger.add(s);
    s = makeShape(); s.name = "path858"; s.geometry = go.Geometry.parse("M108.841,495.458c0,0,8.908,2.336,5.98,4.312c-2.925,1.979-6.469-0.744-6.469-0.744L108.841,495.458z", true); tiger.add(s);
    s = makeShape(); s.name = "path862"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M249.685,627.914c0,0-2.825,0-9.888,3.531c-3.531,0-23.307,6.355-33.194,24.013  C206.603,655.458,228.497,638.508,249.685,627.914z", true); tiger.add(s);
    s = makeShape(); s.name = "path866"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M404.56,791.494c0.249,0.456,0.348,1.197,0.862,1.228c1.161,0.07,3.339,0.603,3.118-0.521  c-1.497-7.604-3.041-16.319-10.338-19.51c-1.129-0.493-3.675,0.235-3.806,1.797c-0.225,2.69-0.432,5.072,0.114,7.661  c0.529,2.509,4.34,2.525,5.959,0.083C402.123,785.184,402.886,788.438,404.56,791.494z", true); tiger.add(s);
    s = makeShape(); s.name = "path870"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M385,799.854c1.321,2.494,1.097,5.776,3.595,6.771c1.308,0.519,4.573-1.202,3.835-3.099  c-1.416-3.64-2.101-7.594-4.554-10.79c-0.353-0.463,0.071-1.403-0.212-1.982c-1.048-2.154-3.07-3.452-5.556-2.871  c-1.97,3.891,0.058,7.648,2.744,10.666C385.094,798.816,384.801,799.48,385,799.854z", true); tiger.add(s);
    s = makeShape(); s.name = "path874"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M315.077,790.689c-0.19-0.666-0.258-1.483,0.033-2.052c0.938-1.822,2.338-3.805,1.742-5.608  c-0.613-1.864-2.585-1.543-3.731-0.538c-2.004,1.755-2.091,4.979-3.312,7.379c-0.347,0.682-0.256,1.692-1.034,2.383  c-0.838,0.744-1.613,3.435-1.444,4.442c0.094,0.553-0.229,18.047,0.163,17.583c1.093-1.295,6.478-18.481,6.6-20.058  C314.194,792.932,315.487,792.11,315.077,790.689z", true); tiger.add(s);
    s = makeShape(); s.name = "path878"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M269.81,778.697c4.651-4.413,9.577-9.642,8.796-16.195c-0.205-1.723-3.339-0.792-3.669,0.701  c-1.416,6.4-5.016,11.099-9.55,15.322c-3.877,3.613-7.165,14.814-7.58,15.713C264.334,784.958,268.319,780.109,269.81,778.697z", true); tiger.add(s);
    s = makeShape(); s.name = "path882"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M245.843,768.167c0.923-0.653,0.39-1.521,0.773-2.106c1.683-2.574,3.979-4.773,4.012-7.844  c0.005-0.489-0.662-1.034-1.254-0.639c-0.489,0.324-1.093,0.555-1.284,0.784c-3.584,4.322-6.056,9.04-8.604,14.005  c-0.323,0.63-2.343,8.56-1.79,8.756c0.422,0.148,3.459-7.232,3.83-7.434C243.756,772.479,243.777,769.627,245.843,768.167z", true); tiger.add(s);
    s = makeShape(); s.name = "path886"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M275.387,802.674c0.784-1.534,3.567-3.656,3.367-5.226c-0.208-1.64,0.618-4.188-0.992-2.973  c-2.22,1.675-8.309,4.057-8.786,14.312C268.93,809.795,274.182,805.04,275.387,802.674z", true); tiger.add(s);
    s = makeShape(); s.name = "path890"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M300.889,772.344c0.706-1.179,1.956-0.344,2.767-0.809c1.144-0.656,2.223-1.643,2.738-2.788  c1.713-3.794,4.836-7.008,5.089-11.234c-2.634-2.479-3.831,1.121-4.944,2.825c-2.336-2.908-4.1,0.4-6.395,1.316  c-0.124,0.05-0.5-0.563-0.632-0.516c-2.078,0.776-3.279,2.687-5.041,4.064c-0.302,0.236-1.017-0.082-1.276,0.158  c-1.151,1.064-2.869,1.639-3.364,2.843c-1.959,4.78-7.504,8.479-10.835,21.795c0.672,1.604,7.966-11.728,8.826-12.959  c1.476-2.112,1.685,2.933,3.938,1.757c0.09-0.048,0.418,0.372,0.655,0.608c0.342-0.494,0.727-0.898,1.413-0.706  c0-0.706-0.237-1.688,0.118-1.969c2.184-1.726,2.036-3.61,3.413-5.801C298.166,772.324,300.039,771.055,300.889,772.344z", true); tiger.add(s);
    s = makeShape(); s.name = "path894"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M406.474,868.395c0,0,13.066-36.019,5.298-55.794c0,0,20.129,38.139,12.007,57.913  c0,0-0.706-18.361-7.77-27.189C416.009,843.323,408.946,865.923,406.474,868.395z", true); tiger.add(s);
    s = makeShape(); s.name = "path898"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M380.343,863.805c0,0,9.534-15.538-4.591-48.024c0,0-1.413,36.019-13.419,55.439  C362.333,871.22,387.405,835.554,380.343,863.805z", true); tiger.add(s);
    s = makeShape(); s.name = "path902"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M362.686,860.273c0,0-0.353-35.313,0.354-40.61c0,0-6.709,29.31-24.719,46.26  C338.32,865.923,363.745,844.735,362.686,860.273z", true); tiger.add(s);
    s = makeShape(); s.name = "path906"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M345.736,803.771c0,0,10.594,24.014-7.063,56.502c0,0,11.301-21.541,2.825-33.9  C341.498,826.373,346.089,820.369,345.736,803.771z", true); tiger.add(s);
    s = makeShape(); s.name = "path910"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M311.836,859.566c0,0-1.766-27.545,1.412-31.429c0,0,0.354-11.301-0.354-13.065  c0,0,7.063-10.946,7.416,2.119c0,0,2.473,13.771,7.416,21.894c0,0,6.356,9.535,6.003,20.835  C333.729,859.92,316.073,806.598,311.836,859.566z", true); tiger.add(s);
    s = makeShape(); s.name = "path914"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M305.479,810.835c0,0-11.653,19.069-14.831,52.616c0,0-2.472-10.947,4.237-36.372  C294.885,827.079,302.301,799.888,305.479,810.835z", true); tiger.add(s);
    s = makeShape(); s.name = "path918"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M266.988,845.795c0,0,8.828-9.535,11.3-18.363c0,0,6.356-27.896-4.943-12.712  c0,0,0.353,14.125-14.125,27.19C259.219,841.91,267.694,837.673,266.988,845.795z", true); tiger.add(s);
    s = makeShape(); s.name = "path922"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M256.748,836.967c0,0,6.003-30.723,7.416-32.135c0,0,3.178-6.003-1.766-0.354  c0,0-15.538,33.9-22.6,45.555C239.797,850.032,253.922,833.788,256.748,836.967z", true); tiger.add(s);
    s = makeShape(); s.name = "path926"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M246.507,807.657c0,0,20.481-39.552-18.01,6.003  C228.497,813.66,247.919,796.356,246.507,807.657z", true); tiger.add(s);
    s = makeShape(); s.name = "path930"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M219.316,781.879c0,0,8.475-33.193,13.065-32.842c0,0,14.479-15.891,2.825,2.825  c0,0-10.594,16.95-9.535,34.254C225.672,786.116,224.613,769.166,219.316,781.879z", true); tiger.add(s);
    s = makeShape(); s.name = "path934"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M802.508,761.748c0,0-21.188-17.656-25.602-23.836c0,0,23.836,32.664,23.836,45.023  C800.742,782.938,805.156,769.693,802.508,761.748z", true); tiger.add(s);
    s = makeShape(); s.name = "path938"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M812.219,722.904c0,0-37.078-26.484-43.259-39.728c0,0,46.79,52.086,46.79,60.031  C815.75,743.209,816.633,727.318,812.219,722.904z", true); tiger.add(s);
    s = makeShape(); s.name = "path942"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M842.234,450.995c0,0-21.188-14.125-23.836-10.594c0,0,18.539,11.477,22.952,26.483  C841.352,466.886,838.703,450.995,842.234,450.995z", true); tiger.add(s);
    s = makeShape(); s.name = "path946"; s.fill = "#CCCCCC"; s.geometry = go.Geometry.parse("M857.242,593.13l-30.898-21.188c0,0,33.547,30.017,34.431,37.079L857.242,593.13z", true); tiger.add(s);
    s = makeShape(); s.name = "path950"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M167.317,553.402l38.844,8.387", true); tiger.add(s);
    s = makeShape(); s.name = "path954"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M256.041,839.438c0,0-0.883-6.181-16.773,12.358", true); tiger.add(s);
    s = makeShape(); s.name = "path958"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M265.752,848.265c0,0,3.531-11.477-7.946-3.53", true); tiger.add(s);
    s = makeShape(); s.name = "path962"; s.stroke = "#000000"; s.geometry = go.Geometry.parse("M361.097,863.271c0,0,2.648-19.422-17.655,3.531", true); tiger.add(s);
    return tiger;
  }

misc.add(new Test('SVG arcs', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    var $ = go.GraphObject.make;  // for conciseness in defining templates
diagram.nodeTemplate =
  $(go.Node, "Vertical", {position: new go.Point(0,0)},
    $(go.Shape,
    { name: 's', strokeWidth: 3 },
    new go.Binding("geometry", "geo"))
  );

    // create the model data that will be represented by Nodes and Links
    var nodeDataArray = [
      { key: 1, geo: go.Geometry.parse("M 000 50 a 150 50 0 0 0 250 50", false) },
      { key: 2,  geo: go.Geometry.parse("M 000 200 a 150 50 0 0 1 250 50", false) },
      { key: 3, geo: go.Geometry.parse("M 400 50 a 150 50 0 1 0 250 50", false) },
      { key: 4, geo: go.Geometry.parse("M 400 200 a 150 50 0 1 1 250 50", false) }
    ];
    var linkDataArray = [
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


d.model.addNodeData({ key: 5, geo: go.Geometry.parse(d.findNodeForKey(1).findObject('s').geometry.toString(), false) })
d.model.addNodeData({ key: 6, geo: go.Geometry.parse(d.findNodeForKey(2).findObject('s').geometry.toString(), false) })
d.model.addNodeData({ key: 7, geo: go.Geometry.parse(d.findNodeForKey(3).findObject('s').geometry.toString(), false) })
d.model.addNodeData({ key: 8, geo: go.Geometry.parse(d.findNodeForKey(4).findObject('s').geometry.toString(), false) })



test.assert(d.findNodeForKey(1).findObject('s').geometry.equalsApprox(d.findNodeForKey(5).findObject('s').geometry))
test.assert(d.findNodeForKey(2).findObject('s').geometry.equalsApprox(d.findNodeForKey(6).findObject('s').geometry))
test.assert(d.findNodeForKey(3).findObject('s').geometry.equalsApprox(d.findNodeForKey(7).findObject('s').geometry))
test.assert(d.findNodeForKey(4).findObject('s').geometry.equalsApprox(d.findNodeForKey(8).findObject('s').geometry))

test.assert(d.findNodeForKey(1).findObject('s').geometry.toString() == d.findNodeForKey(5).findObject('s').geometry.toString())
test.assert(d.findNodeForKey(2).findObject('s').geometry.toString() == d.findNodeForKey(6).findObject('s').geometry.toString())
test.assert(d.findNodeForKey(3).findObject('s').geometry.toString() == d.findNodeForKey(7).findObject('s').geometry.toString())
test.assert(d.findNodeForKey(4).findObject('s').geometry.toString() == d.findNodeForKey(8).findObject('s').geometry.toString())

test.assert(d.findNodeForKey(1).findObject('s').geometry.toString() === "M0 50 A150 50 0 0 0 250 100")
test.assert(d.findNodeForKey(2).findObject('s').geometry.toString() === "M0 200 A150 50 0 0 1 250 250")
test.assert(d.findNodeForKey(3).findObject('s').geometry.toString() === "M400 50 A150 50 0 1 0 650 100")
test.assert(d.findNodeForKey(4).findObject('s').geometry.toString() === "M400 200 A150 50 0 1 1 650 250")

test.assert(d.findNodeForKey(5).findObject('s').geometry.equalsApprox(
  go.Geometry.parse(d.findNodeForKey(5).findObject('s').geometry.toString(), false)))
test.assert(d.findNodeForKey(6).findObject('s').geometry.equalsApprox(
  go.Geometry.parse(d.findNodeForKey(6).findObject('s').geometry.toString(), false)))
test.assert(d.findNodeForKey(7).findObject('s').geometry.equalsApprox(
  go.Geometry.parse(d.findNodeForKey(7).findObject('s').geometry.toString(), false)))
test.assert(d.findNodeForKey(8).findObject('s').geometry.equalsApprox(
  go.Geometry.parse(d.findNodeForKey(8).findObject('s').geometry.toString(), false)))

    }, // END TEST
    null
));

misc.add(new Test('Geometry.parse and geometryString differences', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

  var $ = go.GraphObject.make;  // for conciseness in defining templates


  var $ = go.GraphObject.make;
  d.nodeTemplate =
    $(go.Node, "Position", {},
      $(go.Shape,
        { name: 's'},
      new go.Binding("geometryString", "geoString"),
      new go.Binding("geometry", "geo"),
      new go.Binding("fill", "fill"),
      new go.Binding("stroke", "stroke"),
      new go.Binding("strokeWidth", "sw")
      )
      );

  d.nodeTemplateMap.add("vert",
    $(go.Node, "Vertical", {},
      $(go.Shape,
        { name: 's'},
      new go.Binding("geometryString", "geoString"),
      new go.Binding("geometry", "geo"),
      new go.Binding("fill", "fill"),
      new go.Binding("stroke", "stroke"),
      new go.Binding("strokeWidth", "sw")
      )
      ));

  var m = new go.Model();
  m.nodeDataArray = [
      { key: 1, stroke: "#FF0000", fill: null, sw: 5,
        geoString: "M 50 50 l 20 20 l 0 10 l -10 0" },
      { key: 2, stroke: "#FF008F", fill: null, sw: 5,
        geo: go.Geometry.parse("M 50 50 l 20 20 l 0 10 l -10 0") },

      { key: 3, category: 'vert', stroke: "#FF0000", fill: null, sw: 5,
        geoString: "M 50 50 l 20 20 l 0 10 l -10 0" },
      { key: 4, category: 'vert', stroke: "#FF000F", fill: null, sw: 5,
        geo: go.Geometry.parse("M 50 50 l 20 20 l 0 10 l -10 0") },

      { key: 5, stroke: "#00FF00", fill: null, sw: 5,
        geoString: "M -50 -50 l 20 20 l 0 10 l -10 0" },
      { key: 6, stroke: "#00FF0F", fill: null, sw: 5,
        geo: go.Geometry.parse("M -50 -50 l 20 20 l 0 10 l -10 0") },

      { key: 7,  category: 'vert',stroke: "#F00FF0", fill: null, sw: 5,
        geoString: "M -50 -50 l 20 20 l 0 10 l -10 0" },
      { key: 8,  category: 'vert',stroke: "#F00FFF", fill: null, sw: 5,
        geo: go.Geometry.parse("M -50 -50 l 20 20 l 0 10 l -10 0") },

  ];
  d.model = m;

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
d.startTransaction('a');
d.commitTransaction('a');
test.assert(d.findNodeForKey(1).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)")
test.assert(d.findNodeForKey(1).findObject('s').position.equals(new go.Point(50, 50)))

test.assert(d.findNodeForKey(2).findObject('s').geometry.bounds.toString() === "Rect(0,0,70,80)")
test.assert(!d.findNodeForKey(2).findObject('s').position.isReal()) // unreal

test.assert(d.findNodeForKey(3).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)")
test.assert(d.findNodeForKey(3).findObject('s').position.equals(new go.Point(50, 50)))
// Smaller, since its using geoString and is a vertical panel
test.assert(d.findNodeForKey(3).actualBounds.width === 25);
test.assert(d.findNodeForKey(3).actualBounds.height === 35);

test.assert(d.findNodeForKey(4).findObject('s').geometry.bounds.toString() === "Rect(0,0,70,80)")
test.assert(!d.findNodeForKey(4).findObject('s').position.isReal()) // unreal

test.assert(d.findNodeForKey(1).actualBounds.width === 75);
test.assert(d.findNodeForKey(2).actualBounds.width === 75);
test.assert(d.findNodeForKey(4).actualBounds.width === 75);
test.assert(d.findNodeForKey(1).actualBounds.height === 85);
test.assert(d.findNodeForKey(2).actualBounds.height === 85);
test.assert(d.findNodeForKey(4).actualBounds.height === 85);


test.assert(d.findNodeForKey(5).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)"); // norm!
test.assert(d.findNodeForKey(6).findObject('s').geometry.bounds.toString() === "Rect(-50,-50,50,50)");
test.assert(d.findNodeForKey(7).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)"); // norm!
test.assert(d.findNodeForKey(8).findObject('s').geometry.bounds.toString() === "Rect(-50,-50,50,50)");

test.assert(d.findNodeForKey(5).findObject('s').position.toString() === "Point(-50,-50)"); // norm!
test.assert(d.findNodeForKey(6).findObject('s').position.toString() === "Point(NaN,NaN)");
test.assert(d.findNodeForKey(7).findObject('s').position.toString() === "Point(-50,-50)"); // norm!
test.assert(d.findNodeForKey(8).findObject('s').position.toString() === "Point(NaN,NaN)");

test.assert(d.findNodeForKey(5).findObject('s').actualBounds.toString() === "Rect(0,0,25,35)");
test.assert(d.findNodeForKey(6).findObject('s').actualBounds.toString() === "Rect(0,0,55,55)");
test.assert(d.findNodeForKey(7).findObject('s').actualBounds.toString() === "Rect(0,0,25,35)");
test.assert(d.findNodeForKey(8).findObject('s').actualBounds.toString() === "Rect(0,0,55,55)");

    }, // END TEST
    null
));


misc.add(new Test('isGeometryPositioned', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    var $ = go.GraphObject.make;  // for conciseness in defining templates

  d.nodeTemplate =
    $(go.Node, "Position", {},
      $(go.TextBlock,
        { position: new go.Point(50, 50), width: 20, height: 20, background: 'lime' }),
      $(go.Shape,
        { name: 's', background: 'rgba(0,0,255,.1)' },
      new go.Binding("geometryString", "geoString"),
      new go.Binding("geometry", "geo"),
      new go.Binding("figure", "figure"),
      new go.Binding("fill", "fill"),
      new go.Binding("stroke", "stroke"),
      new go.Binding("isGeometryPositioned", "isGeo"),
      new go.Binding("strokeWidth", "sw")
      )
      );

  var m = new go.Model();
  m.nodeDataArray = [
      { key: 1, stroke: "#FF0000", fill: null, sw: 10, geoString: "M 50 50 l 20 20 l 0 10 l -10 0", isGeo: true },
      { key: 2, stroke: "#FF008F", fill: null, sw: 10, geo: go.Geometry.parse("M 50 50 l 20 20 l 0 10 l -10 0"), isGeo: true },
      //{ key: 3, stroke: "#FF008F", fill: 'lime', sw: 5, figure: "Ethernet" }
      { key: 3, stroke: "#FF0000", fill: null, sw: 10, geoString: "M 50 50 l 20 20 l 0 10 l -10 0"  },
      { key: 4, stroke: "#FF008F", fill: null, sw: 10, geo: go.Geometry.parse("M 50 50 l 20 20 l 0 10 l -10 0")  },
  ];
  d.model = m;
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

d.startTransaction('a');
d.commitTransaction('a');

// ---------------------------------------- isGeo = true:

//Smaller width and height by 5:
test.assert(d.findNodeForKey(1).actualBounds.toString() === "Rect(0,0,75,85)");
// No change in w/h becaues not normalized:
test.assert(d.findNodeForKey(2).actualBounds.toString() === "Rect(95,0,80,90)");

// even though position is 50,50, it is placed at 45, 45
test.assert(d.findNodeForKey(1).findObject('s').actualBounds.toString() === "Rect(45,45,30,40)");
test.assert(d.findNodeForKey(2).findObject('s').actualBounds.toString() === "Rect(0,0,80,90)");
test.assert(d.findNodeForKey(1).findObject('s').position.toString() === "Point(50,50)");
test.assert(d.findNodeForKey(2).findObject('s').position.toString() === "Point(NaN,NaN)");

// ---------------------------------------- isGeo = false:


test.assert(d.findNodeForKey(3).actualBounds.toString() === "Rect(0,110,80,90)");
test.assert(d.findNodeForKey(4).actualBounds.toString() === "Rect(100,110,80,90)");

// position is 50,50 and it is placed at 50,50
test.assert(d.findNodeForKey(3).findObject('s').actualBounds.toString() === "Rect(50,50,30,40)");
test.assert(d.findNodeForKey(4).findObject('s').actualBounds.toString() === "Rect(0,0,80,90)");
test.assert(d.findNodeForKey(3).findObject('s').position.toString() === "Point(50,50)");
test.assert(d.findNodeForKey(4).findObject('s').position.toString() === "Point(NaN,NaN)");

// ----------------------------------------
// Regardless of isGeo, the bounds of the Geometries should NOT have changed
test.assert(d.findNodeForKey(1).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)");
test.assert(d.findNodeForKey(3).findObject('s').geometry.bounds.toString() === "Rect(0,0,20,30)");

test.assert(d.findNodeForKey(2).findObject('s').geometry.bounds.toString() === "Rect(0,0,70,80)");
test.assert(d.findNodeForKey(4).findObject('s').geometry.bounds.toString() === "Rect(0,0,70,80)");


    }, // END TEST
    null
));


misc.add(new Test('negative geometries', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    var $ = go.GraphObject.make;  // for conciseness in defining templates

  d.nodeTemplate =
    $(go.Node, "Position", {},
      $(go.Shape,
        { name: 's', background: 'rgba(0,0,255,.1)' },
      new go.Binding("geometryString", "geoString"),
      new go.Binding("geometry", "geo"),
      new go.Binding("figure", "figure"),
      new go.Binding("fill", "fill"),
      new go.Binding("stroke", "stroke"),
      new go.Binding("isGeometryPositioned", "isGeo"),
      new go.Binding("strokeWidth", "sw")
      ),
      $(go.TextBlock,
        { width: 20, height: 20, background: 'lime' },
          new go.Binding("position", "ps"))
      );

  var m = new go.Model();
  m.nodeDataArray = [
      { key: 1, stroke: "#FF0000", fill: null, sw: 10, geoString: "M 50 50 c 50,100,100,100,150,00",
        isGeo: true, ps: new go.Point(50, 50) }
     ,{ key: 2, stroke: "#FF008F", fill: null, sw: 10, geoString: "M -50 -50 c 50,-100,100,-100,150,-00",
        isGeo: true, ps: new go.Point(-50, -50) },
      //geo: go.Geometry.parse

      { key: 3, stroke: "#FF0000", fill: null, sw: 10, geo: go.Geometry.parse("M 50 50 c 50,100,100,100,150,00"),
        isGeo: true, ps: new go.Point(50, 50) }
        // @@@ temp, isGeo is off:

     ,
     { key: 4, stroke: "#FF008F", fill: null, sw: 10, geo: go.Geometry.parse("M -50 -50 c 50,-100,100,-100,150,-00"),
        isGeo: true, ps: new go.Point(-50, -50) },

  ];
  d.model = m;

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

d.startTransaction('a');
d.commitTransaction('a');
 // test normalized, no space at top or bottom:
test.assert(d.findNodeForKey(1).findObject('s').position.toString() === "Point(50,50)")
test.assert(d.findNodeForKey(1).findObject('s').geometry.bounds.toString() === "Rect(0,0,150,75)")
test.assert(d.findNodeForKey(1).findObject('s').actualBounds.toString() === "Rect(45,45,160,85)") // 45,45 instead of 50,50 because of isGeo

test.assert(d.findNodeForKey(2).findObject('s').position.toString() === "Point(-50,-125)");
test.assert(d.findNodeForKey(2).findObject('s').geometry.bounds.toString() === "Rect(0,0,150,75)");
test.assert(d.findNodeForKey(2).findObject('s').actualBounds.toString() === "Rect(0,0,160,85)");

// test not normalized, extra space at top or bottom:

test.assert(d.findNodeForKey(3).findObject('s').position.toString() === "Point(NaN,NaN)")
test.assert(d.findNodeForKey(3).findObject('s').geometry.bounds.toString() === "Rect(0,0,200,125)")
test.assert(d.findNodeForKey(3).findObject('s').actualBounds.toString() === "Rect(0,0,210,135)")

// Lots of empty space BELOW the geometric shape because the geometry's defacto origin is -50,-50, so adding the origin adds 50 to the bottom
test.assert(d.findNodeForKey(4).findObject('s').position.toString() === "Point(NaN,NaN)")
test.assert(d.findNodeForKey(4).findObject('s').geometry.bounds.toString() === "Rect(-50,-125,150,125)")
test.assert(d.findNodeForKey(4).findObject('s').actualBounds.toString() === "Rect(45,45,160,135)")

    }, // END TEST
    null
));


misc.add(new Test('Parsing multiple figures (filled+unfilled)', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    var $ = go.GraphObject.make;  // for conciseness in defining templates

  d.nodeTemplate =
    $(go.Node, "Position", {},
      new go.Binding("layerName", "layerName"),
      $(go.Shape,
        { name: 's', background: 'rgba(0,0,255,.1)' },
      new go.Binding("geometryString", "geoString"),
      new go.Binding("geometry", "geo"),
      new go.Binding("figure", "figure"),
      new go.Binding("fill", "fill"),
      new go.Binding("stroke", "stroke"),
      new go.Binding("isGeometryPositioned", "isGeo"),
      new go.Binding("strokeWidth", "sw")
      )
      );

  var m = new go.Model();
  m.nodeDataArray = [
  /*
      { key: 1, stroke: "#FF0000", fill: null, sw: 10, geoString: "M 50 50 c 50,100,100,100,150,00",
        isGeo: true, ps: new go.Point(50, 50) },
      { key: 2, stroke: "#FF008F", fill: null, sw: 10, geoString: "M -50 -50 c 50,-100,100,-100,150,-00",
        isGeo: true, ps: new go.Point(-50, -50) },*/


{ key: 3, stroke: "#FF0000", fill: 'orange', sw: 10,
  geo: go.Geometry.parse("F M 50 50 l 50,100,10,10,35,00 00,-35 x  m 0 -50 l 0,-50 10,0 35,35 x f m 0 -50 l 0,-50 10,0 35,35"),
  isGeo: true, ps: new go.Point(50, 50) },

// key 4 created dynamically below

{ key: 5, stroke: "#FF008F", fill: 'lime', sw: 10,
  geo: go.Geometry.parse("M 50 50 l 50,100,10,10,35,00 00,-35 x f m 0 -50 l 0,-50 10,0 35,35 X m 0 -50 l 0,-50 10,0 35,35"),
  isGeo: true, ps: new go.Point(-50, -50) },

  // no arg, all should be filled
{ key: 6, stroke: "#FF008F", fill: 'lime', sw: 10,
  geo: go.Geometry.parse("M 50 50 l 50,100,10,10,35,00 00,-35 x f m 0 -50 l 0,-50 10,0 35,35 X m 0 -50 l 0,-50 10,0 35,35", true),
  isGeo: true, ps: new go.Point(-50, -50) },

  ];
  d.model = m;

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

d.startTransaction('a');
d.commitTransaction('a');

d.model.addNodeData({ key: 4, stroke: "#FF0000", fill: 'orange', sw: 10,
  geo: go.Geometry.parse(d.nodes.first().findObject('s').geometry.toString(), false),
  isGeo: true, ps: new go.Point(50, 50) })

// 3+4
test.assert(d.findNodeForKey(3).findObject('s').geometry.toString() === d.findNodeForKey(4).findObject('s').geometry.toString())
var n = go.Geometry.parse(d.findNodeForKey(4).findObject('s').geometry.toString(), false);
test.assert(n.toString() === d.findNodeForKey(4).findObject('s').geometry.toString());

// 5+6

var fivestring = d.findNodeForKey(5).findObject('s').geometry.toString();
test.assert(fivestring.split("F").length - 1 === 1); // only 1 F
window.fivegeo =  d.findNodeForKey(5).findObject('s').geometry;
var itr = fivegeo.figures.iterator;
var fills = [false, true, false];
var i = 0;
while(itr.next()) {
  var pf = itr.value;
  test.assert(pf.isFilled === fills[i]);
  i++;
}
test.assert(i === 3);


//6 has geometry with unfilled parts but all of them should have been filled
var sixstring = d.findNodeForKey(6).findObject('s').geometry.toString();
test.assert(sixstring.split("F").length - 1 === 3); // 3 F's



    }, // END TEST
    null
));


misc.add(new Test('All Segments', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

  var $ = go.GraphObject.make;
  d.nodeTemplate =
    $(go.Node, "Position", $(go.Shape, { geometry: go.Geometry.parse(
      // startAngle, sweepAngle, centerX, centerY, radiusX
     "M0 0 C 20,60,40,180,240,20 L 280 20 C 200,100,150,200,230,240 L 0 300 a25,25 -30 0,1 50,-25 Q 50 50 150 20"
      ), strokeWidth: 6, stroke: 'lightcoral', background: 'gray', name: 'shape'}) );

  var m = new go.Model();
  m.nodeDataArray = [
  {key: 1}
  ];
  d.model = m;

    }, // END SETUP
    function (test) {
var d = test.diagram;
test.log("  ??? problem with All Segments test"); return;
var geo = d.findNodeForKey(1).findObject('shape').geometry;
test.assert(geo.toString() === "M0 0 C20 60 40 180 240 20 L280 20 C200 100 150 200 230 240 L0 300 A25 25 330 0 1 50 275 Q50 50 150 20");

var pathDrawn = [0, 0, 20, 60, 40, 180, 240, 20, 280, 20, 200, 100, 150, 200, 230, 240, 0, 300, -6.903559372499995, 286.19288125500003, -1.307118745000004, 269.4035593725, 12.499999999999986, 262.5, 26.307118744999972, 255.59644062750002, 43.09644062749998, 261.192881255, 49.999999999999986, 275, 50, 50, 150, 20];

var arr = test.pathToPointArray(geo);
var l = pathDrawn.length;
test.assert(l === arr.length)
for (var i =0; i < l; i++) {
  test.assert(test.isApproxEqual(arr[i], pathDrawn[i]));
}
    }, // END TEST
    null
));

misc.add(new Test('Arc', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

  var $ = go.GraphObject.make;
  d.nodeTemplate =
    $(go.Node, "Position", $(go.Shape, { geometry: go.Geometry.parse(
      // startAngle, sweepAngle, centerX, centerY, radiusX
     "F M 50 60 50 148 A 2 2 0 0 1 48 150 L 2 150 A 2 2 0 0 1 0 148 L 0 50 A 25 50 0 0 1 50 30  "
      ), strokeWidth: 6, stroke: 'lightcoral', background: 'gray', name: 'shape'}) );

  var m = new go.Model();
  m.nodeDataArray = [
  {key: 1}
  ];
  d.model = m;

    }, // END SETUP
    function (test) {
var d = test.diagram;

var geo = d.findNodeForKey(1).findObject('shape').geometry;
test.log("  ??? problem with Arc test"); return;
var pathDrawn = [50, 60, 50, 148, 50, 149.1045694996, 49.104569499600004, 150, 48, 150, 2, 150, 0.8954305004000003, 150, 0, 149.1045694996, 0, 148, 0, 50, -2.7614237489999987, 22.38576251, 6.192881255000007, -4.47715250200001, 20.000000000000004, -10, 33.807118745, -15.522847497999997, 47.238576251000005, 2.3857625100000135, 50, 30.000000000000004];
var arr = test.pathToPointArray(geo);
var l = pathDrawn.length;
test.assert(l === arr.length)
for (var i =0; i < l; i++) {
  test.assert(test.isApproxEqual(arr[i], pathDrawn[i]));
}
    }, // END TEST
    null
));

  misc.add(new Test("Consecutive '.'s", null,
    function(test) {
      test.geo1 = go.Geometry.parse("M0 .5 L.99.25.01.01.01.99"); // consecutive '.'s
    },
    null,
    function(test) {
      var geo = new go.Geometry()
                  .add(new go.PathFigure(0, .5)
                    .add(new go.PathSegment(go.PathSegment.Line, .99, .25))
                    .add(new go.PathSegment(go.PathSegment.Line, .01, .01))
                    .add(new go.PathSegment(go.PathSegment.Line, .01, .99)));
      test.assert(test.geo1.equalsApprox(geo), "Geometry 1 doesn't match");
    }
  ));

  misc.add(new Test("E is not a command", null,
  function(test) {
    test.okIcon = go.Geometry.parse(
      "M384.004,0 C595.687,-4E-06 768,172.266 768,384.004 768,595.737 595.687,768 384.004,768 172.219,768 -4E-06,595.737 0,384.004 -4E-06,172.266 172.219,-4E-06 384.004,0",
      false
    );
  },
  null,
  function(test) {
    test.assert(test.okIcon.figures.elt(0).segments.count === 4);
  }
  ));


  misc.add(new Test("razrfalcon.github.io", null,
    function(test) {
      test.assert(go.Geometry.parse("M10-20A5.5.3-4 110-.1").toString() === go.Geometry.parse("M10 -20 A5.5 0.3 356 1 1 0 -0.1").toString(), "didn't parse correctly");
      test.assert(go.Geometry.parse("M 10 20 H 10 20 30 V 40").toString() === go.Geometry.parse("M 10 20 H 10 H 20 H 30 V 40").toString(), "bad simplification");
//??? go.Geometry.parse("M 10 20 M 30 40").toString() // should not and does not draw anything
      test.assert(go.Geometry.parse("M 10 20 30 40").toString() === go.Geometry.parse("M 10 20 L 30 40").toString(), "treat implicit moves as line to");
      test.assert(go.Geometry.parse("m 10 20 30 40").toString() === go.Geometry.parse("m 10 20 l 30 40").toString(), "treat implicit moves as line to respecting relative");
//??? test.assert(go.Geometry.parse("M 10 20 L 30 40 Z L 50 60").toString() === go.Geometry.parse("M 10 20 L 30 40 Z M 10 20 L 50 60").toString(), "implicit move after close");  // draws correctly
      test.assert(go.Geometry.parse("M 10 20 L 30 40 m 50 60 L 70 80 Z m 90 100 L 110 120").toString() === go.Geometry.parse("M10 20 L30 40 M80 100 L70 80z M170 200 L110 120").toString(), "relative move after close must be relative to previous absolute move");
      test.assert(go.Geometry.parse("M 0 0 A 5 5 30 1110 20").toString() === go.Geometry.parse("M 0 0 A 5 5 30 1 1 10 20").toString(), "no space needed for flags");
      test.assert(go.Geometry.parse("M 10 20 C 30 40 50 60 70 80 S 90 100 110 120").toString() === go.Geometry.parse("M 10 20 C 30 40 50 60 70 80 C 90 100 90 100 110 120").toString(), "curve shorthand");
      test.assert(go.Geometry.parse("M 10 20 L 30 40 abcdef").toString() === go.Geometry.parse("M 10 20 L 30 40").toString(), "stop parsing on invalid syntax");
      test.assert(go.Geometry.parse("M 0 50 L 50 0 L 100 50 Z Z Z Z Z Z").toString() === go.Geometry.parse("M 0 50 L 50 0 L 100 50 Z").toString(), "ignore duplicate closes");
    }
  ));

  misc.add(new Test("similar curves", null,
    function(test) {
      const s1 = new go.Shape({ geometryString: "M 30 30 T 40 170 S 170 170 170 30" });
      const s2 = new go.Shape({ geometryString: "M 30 30 Q 40 170 40 170 S 170 170 170 30" });
      const s3 = new go.Shape({ geometryString: "M 30 30 Q 30 30 40 170 C 40 170 170 170 170 30" });

      const f1 = s1.geometry.figures.first();
      const f2 = s2.geometry.figures.first();
      const f3 = s3.geometry.figures.first();
      const seg1 = f1.segments;
      const seg2 = f2.segments;
      const seg3 = f3.segments;
      test.assert(seg1.elt(0).toString() === 'Q0 0 10 140')
       // different control point but should look the same (straight line)
      test.assert(seg2.elt(0).toString() === 'Q10 140 10 140')
      test.assert(seg3.elt(0).toString() === 'Q0 0 10 140')
      test.assert(seg1.elt(1).toString() === 'C10 140 140 140 140 0')
      test.assert(seg2.elt(1).toString() === 'C10 140 140 140 140 0')
      test.assert(seg3.elt(1).toString() === 'C10 140 140 140 140 0')
    }
  ));

  // this should be the last test, so it's easy to tell when running all tests has finished
  misc.add(new Test("SVG tiger", null, function(t) {
      //t.diagram.reset();
      t.diagram.startTransaction("tiger");
      var tiger = svgshapes();
      tiger.position = new go.Point(0, 0);
      t.diagram.add(tiger);
      t.diagram.commitTransaction("tiger");
    }, null, null
  ));

})();
