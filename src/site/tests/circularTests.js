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
function dumpnodepositions(test) {
  var diagram = test.diagram
  var datas = diagram.model.nodeDataArray;
  if (!window.console) return;
  var msg = test.name + ' [';
  for (var i = 0; i < datas.length; i++) {
    var node = diagram.findPartForData(datas[i]);
    var pos = node.location;
    if (i > 0) msg += ", ";
    msg += 'new go.Point(' + pos.x.toFixed(1) + ',' + pos.y.toFixed(1) + ')';
  }
  window.console.log(msg + ']');
}

(function () {


  function theDataSizeConverter(size) {
    var desSize = new go.Size();
    desSize.width = size[0];
    desSize.height = size[1];
    return desSize;
  }

  function CommonSetup(test) {
    var m = new go.GraphLinksModel();
    var nodeArray = [
      { key: 3, text: "n3", size: [40, 40] },
      { key: 0, text: "n0", size: [25, 25] },
      { key: 9, text: "n9", size: [40, 25] },
      { key: 2, text: "n2", size: [20, 35] },
      { key: 7, text: "n7", size: [25, 20] },
      { key: 4, text: "n4", size: [20, 20] },
      { key: 5, text: "n5", size: [35, 25] },
      { key: 1, text: "n1", size: [35, 20] },
      { key: 8, text: "n8", size: [25, 40] },
      { key: 6, text: "n6", size: [30, 30] },
    ];
    m.nodeDataArray = nodeArray;

    var linkArray = [
      { from: 0, to: 3 },
      { from: 0, to: 9 },
      { from: 2, to: 2 },
      { from: 2, to: 7 },
      { from: 3, to: 1 },
      { from: 3, to: 6 },
      { from: 4, to: 0 },
      { from: 4, to: 9 },
      { from: 5, to: 2 },
      { from: 5, to: 3 },
      { from: 6, to: 1 },
      { from: 6, to: 8 },
      { from: 8, to: 3 },
      { from: 8, to: 7 },
      { from: 9, to: 5 }
    ];
    m.linkDataArray = linkArray;
    test.diagram.model = m;
  }

  function CommonRun(test, radius, asprat, arrange) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Optimized;
    layout.radius = radius;
    layout.aspectRatio = asprat;
    layout.arrangement = arrange;
    layout.doLayout(test.diagram);
  }

  function StartAngleRun(test, sa) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Ascending;
    layout.startAngle = sa;
    layout.doLayout(test.diagram);
  }

  function SweepAngleRun(test, sa) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Ascending;
    layout.sweepAngle = sa;
    layout.doLayout(test.diagram);
  }

  function SpacingRun(test, sp) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Ascending;
    layout.spacing = sp;
    layout.doLayout(test.diagram);
  }

  function NodeDiamRun(test, ndf) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Ascending;
    layout.nodeDiameterFormula = ndf;
    layout.doLayout(test.diagram);
  }

  function DirectionRun(test, dir) {
    var layout = new go.CircularLayout();
    layout.sorting = go.CircularLayout.Ascending;
    layout.direction = dir;
    layout.doLayout(test.diagram);
  }

  function SortingRun(test, sort) {
    var layout = new go.CircularLayout();
    layout.sorting = sort;
    layout.doLayout(test.diagram);
  }


  function C(ptarr) {
    return function(test) {
      test.assertAllNodeLocations(ptarr);
    }
  }


  // CircularLayout:
  var root = new TestCollection('CircularLayout');
  root.preSetup = function(test) {
    // define the Node template
    var archnode = new go.Node(go.Panel.Spot);
    archnode.desiredSize = new go.Size(30, 30);
    archnode.locationSpot = go.Spot.Center;
    var ns = new go.Shape();
    ns.figure = 'Rectangle';
    ns.fill = 'lightgray';
    ns.stroke = 'black';
    ns.stretch = go.GraphObject.Fill;
    ns.alignment = go.Spot.Center;
    archnode.add(ns);
    var nt = new go.TextBlock();
    nt.alignment = go.Spot.Center;
    nt.bind(new go.Binding('text', 'text'));
    archnode.add(nt);
    archnode.bind(new go.Binding('desiredSize', 'size', theDataSizeConverter));
    archnode.bind(new go.Binding('text', 'text'));
    // replace the default Node template in the nodeTemplateMap
    test.diagram.nodeTemplateMap.add('', archnode);
  }
  TestRoot.add(root);

  root.add(new Test('CircularVertex/Edge properties', null, null, null,
    function(test) {
      var net = new go.CircularNetwork(test.diagram.layout);
      var v = net.createVertex();
      test.assert(v.network === net);
      test.assert(v.node === null);
      test.assert(isNaN(v.diameter));
      test.assert(isNaN(v.actualAngle));

      var e = net.createEdge();
      test.assert(e.network === net);
      test.assert(e.link === null);
      test.assert(e.fromVertex === null);
      test.assert(e.toVertex === null);
    }
  ));

  // #region Multiple Properties
  {
    // #region Radius NaN
    var radnan = new TestCollection('Radius NaN');
    root.add(radnan);
    {
      // #region Aspect Ratio 1
      var asprat1 = new TestCollection('Aspect Ratio 1');
      radnan.add(asprat1);

      asprat1.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, NaN, 1, go.CircularLayout.ConstantDistance) },
C([new go.Point(160.6, 36.6), new go.Point(116.2, 4.3), new go.Point(61.4, 4.3), new go.Point(160.6, 141.0), new go.Point(116.2, 173.2), new go.Point(17.0, 36.6), new go.Point(177.6, 88.8), new go.Point(0.0, 88.8), new go.Point(61.4, 173.2), new go.Point(17.0, 141.0)])
        ));
      asprat1.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, NaN, 1, go.CircularLayout.ConstantAngle) },
C([new go.Point(160.6,36.6), new go.Point(116.2,4.3), new go.Point(61.4,4.3), new go.Point(160.6,141.0), new go.Point(116.2,173.2), new go.Point(17.0,36.6), new go.Point(177.6,88.8), new go.Point(0.0,88.8), new go.Point(61.4,173.2), new go.Point(17.0,141.0)])
        ));
      asprat1.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, NaN, 1, go.CircularLayout.ConstantSpacing) },
C([new go.Point(130.7,24.4), new go.Point(85.6,0.7), new go.Point(39.8,8.9), new go.Point(135.8,119.8), new go.Point(102.9,145.2), new go.Point(9.2,39.2), new go.Point(150.4,75.2), new go.Point(0.0,77.9), new go.Point(58.1,148.5), new go.Point(16.1,121.7)])
        ));
      asprat1.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, NaN, 1, go.CircularLayout.Packed) },
C([new go.Point(101.8,17.8), new go.Point(63.3,1.0), new go.Point(24.8,12.8), new go.Point(107.7,96.4), new go.Point(79.2,116.8), new go.Point(4.1,41.3), new go.Point(119.8,60.4), new go.Point(1.4,67.3), new go.Point(48.2,118.5), new go.Point(14.7,98.3)])
        ));
      // #endregion
      // #region AspectRatio .5
      var asprat5 = new TestCollection('Aspect Ratio .5');
      radnan.add(asprat5);

      asprat5.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, NaN, .5, go.CircularLayout.ConstantDistance) },
C([new go.Point(196.1, 16.6), new go.Point(142.6, 1.7), new go.Point(87.1, 1.7), new go.Point(196.4, 98.3), new go.Point(142.9, 113.4), new go.Point(33.7, 16.9), new go.Point(230.2, 57.6), new go.Point(0.0, 57.7), new go.Point(87.4, 113.4), new go.Point(34.0, 98.4)])
        ));
      asprat5.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, NaN, .5, go.CircularLayout.ConstantAngle) },
C([new go.Point(139.1,7.8), new go.Point(103.0,0.6), new go.Point(74.6,0.6), new go.Point(139.1,81.0), new go.Point(103.0,88.2), new go.Point(38.5,7.8), new go.Point(177.6,44.4), new go.Point(0.0,44.4), new go.Point(74.6,88.2), new go.Point(38.5,81.0)])
        ));
      asprat5.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, NaN, .5, go.CircularLayout.ConstantSpacing) },
C([new go.Point(158.5,10.7), new go.Point(107.8,0.3), new go.Point(60.9,3.6), new go.Point(166.0,83.5), new go.Point(125.7,95.4), new go.Point(20.2,19.0), new go.Point(195.0,48.8), new go.Point(0.2,51.5), new go.Point(80.3,96.7), new go.Point(31.3,84.5)])
        ));
      asprat5.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, NaN, .5, go.CircularLayout.Packed) },
C([new go.Point(126.7,4.7), new go.Point(88.2,0.0), new go.Point(49.7,4.3), new go.Point(136.9,79.7), new go.Point(108.4,86.1), new go.Point(2.8,32.8), new go.Point(174.7,43.7), new go.Point(5.4,58.8), new go.Point(77.4,87.1), new go.Point(43.9,81.6)])
        ));
      // #endregion
      // #region Aspect Ratio 2
      var asprat2 = new TestCollection('Aspect Ratio 2');
      radnan.add(asprat2);

      asprat2.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, NaN, 2, go.CircularLayout.ConstantDistance) },
C([new go.Point(108.1, 59.9), new go.Point(82.3, 11.2), new go.Point(32.7, 11.3), new go.Point(108.1, 170.2), new go.Point(82.4, 219.0), new go.Point(7.0, 60.0), new go.Point(115.1, 115.1), new go.Point(0.0, 115.1), new go.Point(32.8, 219.0), new go.Point(7.0, 170.3)])
        ));
      asprat2.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, NaN, 2, go.CircularLayout.ConstantAngle) },
C([new go.Point(172.2,117.0), new go.Point(137.2,28.7), new go.Point(40.4,28.7), new go.Point(172.2,238.2), new go.Point(137.2,326.5), new go.Point(5.3,117.0), new go.Point(177.6,177.6), new go.Point(0.0,177.6), new go.Point(40.4,326.5), new go.Point(5.3,238.2)])
        ));
      asprat2.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, NaN, 2, go.CircularLayout.ConstantSpacing) },
C([new go.Point(89.0,42.6), new go.Point(58.8,2.1), new go.Point(19.3,19.8), new go.Point(91.5,144.6), new go.Point(73.0,182.1), new go.Point(3.7,60.3), new go.Point(97.5,97.5), new go.Point(0.0,100.3), new go.Point(32.7,189.6), new go.Point(6.7,147.0)])
        ));
      asprat2.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, NaN, 2, go.CircularLayout.Packed) },
C([new go.Point(73.6,40.7), new go.Point(48.5,2.2), new go.Point(10.0,26.2), new go.Point(74.1,114.5), new go.Point(57.5,148.0), new go.Point(1.8,54.7), new go.Point(78.5,78.5), new go.Point(0.0,80.7), new go.Point(26.5,152.7), new go.Point(3.7,111.7)])
        ));
      // #endregion
    }
    // #endregion
    // #region Radius Large
    var radl = new TestCollection('Radius Large');
    root.add(radl);
    {
      // #region Aspect Ratio 1
      var asprat1 = new TestCollection('Aspect Ratio 1');
      radl.add(asprat1);

      asprat1.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, 150, 1, go.CircularLayout.ConstantDistance) },
C([new go.Point(271.4, 61.8), new go.Point(196.4, 7.3), new go.Point(103.6, 7.3), new go.Point(271.4, 238.2), new go.Point(196.4, 292.7), new go.Point(28.6, 61.8), new go.Point(300.0, 150.0), new go.Point(0.0, 150.0), new go.Point(103.6, 292.7), new go.Point(28.6, 238.2)])
        ));
      asprat1.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, 150, 1, go.CircularLayout.ConstantAngle) },
C([new go.Point(271.4,61.8), new go.Point(196.4,7.3), new go.Point(103.6,7.3), new go.Point(271.4,238.2), new go.Point(196.4,292.7), new go.Point(28.6,61.8), new go.Point(300.0,150.0), new go.Point(0.0,150.0), new go.Point(103.6,292.7), new go.Point(28.6,238.2)])
        ));
      asprat1.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, 150, 1, go.CircularLayout.ConstantSpacing) },
C([new go.Point(266.1,55.1), new go.Point(183.6,3.8), new go.Point(91.3,12.0), new go.Point(271.1,238.5), new go.Point(200.8,291.1), new go.Point(23.2,69.9), new go.Point(300.0,150.0), new go.Point(0.0,152.7), new go.Point(109.7,294.5), new go.Point(30.3,240.4)])
        ));
      asprat1.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, 150, 1, go.CircularLayout.Packed) },
C([new go.Point(101.8,17.8), new go.Point(63.3,1.0), new go.Point(24.8,12.8), new go.Point(107.7,96.4), new go.Point(79.2,116.8), new go.Point(4.1,41.3), new go.Point(119.8,60.4), new go.Point(1.4,67.3), new go.Point(48.2,118.5), new go.Point(14.7,98.3)])
        ));
      // #endregion
      // #region AspectRatio .5
      var asprat5 = new TestCollection('Aspect Ratio .5');
      radl.add(asprat5);

      asprat5.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, 150, .5, go.CircularLayout.ConstantDistance) },
C([new go.Point(255.5, 21.7), new go.Point(185.9, 2.2), new go.Point(113.5, 2.3), new go.Point(255.9, 128.1), new go.Point(186.3, 147.8), new go.Point(43.9, 22.0), new go.Point(300.0, 75.0), new go.Point(0.0, 75.2), new go.Point(113.9, 147.8), new go.Point(44.3, 128.2)])
        ));
      asprat5.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, 150, .5, go.CircularLayout.ConstantAngle) },
C([new go.Point(235.0,13.2), new go.Point(174.1,1.0), new go.Point(125.9,1.0), new go.Point(235.0,136.8), new go.Point(174.1,149.0), new go.Point(65.0,13.2), new go.Point(300.0,75.0), new go.Point(0.0,75.0), new go.Point(125.9,149.0), new go.Point(65.0,136.8)])
        ));
      asprat5.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, 150, .5, go.CircularLayout.ConstantSpacing) },
C([new go.Point(247.9,18.2), new go.Point(172.8,0.9), new go.Point(100.5,4.2), new go.Point(255.5,128.3), new go.Point(190.9,147.2), new go.Point(35.5,26.6), new go.Point(300.0,75.0), new go.Point(0.1,77.9), new go.Point(120.2,148.5), new go.Point(46.8,129.4)])
        ));
      asprat5.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, 150, .5, go.CircularLayout.Packed) },
C([new go.Point(126.7,4.7), new go.Point(88.2,0.0), new go.Point(49.7,4.3), new go.Point(136.9,79.7), new go.Point(108.4,86.1), new go.Point(2.8,32.8), new go.Point(174.7,43.7), new go.Point(5.4,58.8), new go.Point(77.4,87.1), new go.Point(43.9,81.6)])
        ));
      // #endregion
      // #region Aspect Ratio 2
      var asprat2 = new TestCollection('Aspect Ratio 2');
      radl.add(asprat2);

      asprat2.add(new Test('Constant Distance', null, CommonSetup, function (test) { CommonRun(test, 150, 2, go.CircularLayout.ConstantDistance) },
C([new go.Point(281.6, 156.2), new go.Point(214.5, 29.1), new go.Point(85.3, 29.4), new go.Point(281.7, 443.6), new go.Point(214.7, 570.6), new go.Point(18.3, 156.4), new go.Point(300.0, 300.0), new go.Point(0.0, 300.0), new go.Point(85.5, 570.9), new go.Point(18.4, 443.8)])
        ));
      asprat2.add(new Test('Constant Angle', null, CommonSetup, function (test) { CommonRun(test, 150, 2, go.CircularLayout.ConstantAngle) },
C([new go.Point(291.0,197.6), new go.Point(231.7,48.4), new go.Point(68.3,48.4), new go.Point(291.0,402.4), new go.Point(231.7,551.6), new go.Point(9.0,197.6), new go.Point(300.0,300.0), new go.Point(0.0,300.0), new go.Point(68.3,551.6), new go.Point(9.0,402.4)])
        ));
      asprat2.add(new Test('Constant Spacing', null, CommonSetup, function (test) { CommonRun(test, 150, 2, go.CircularLayout.ConstantSpacing) },
C([new go.Point(279.2,147.5), new go.Point(204.2,20.3), new go.Point(76.0,39.1), new go.Point(281.6,444.1), new go.Point(218.0,567.4), new go.Point(15.8,166.0), new go.Point(300.0,300.0), new go.Point(0.0,303.0), new go.Point(90.2,575.1), new go.Point(19.1,446.6)])
        ));
      asprat2.add(new Test('Packed', null, CommonSetup, function (test) { CommonRun(test, 150, 2, go.CircularLayout.Packed) },
C([new go.Point(73.6,40.7), new go.Point(48.5,2.2), new go.Point(10.0,26.2), new go.Point(74.1,114.5), new go.Point(57.5,148.0), new go.Point(1.8,54.7), new go.Point(78.5,78.5), new go.Point(0.0,80.7), new go.Point(26.5,152.7), new go.Point(3.7,111.7)])
        ));
      // #endregion
    }
    // #endregion
  }
  // #endregion

  // #region Start Angle
  var start = new TestCollection('Start Angle');
  root.add(start);

  start.add(new Test('Angle 0', null, CommonSetup, function (test) { StartAngleRun(test, 0) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  start.add(new Test('Angle 90', null, CommonSetup, function (test) { StartAngleRun(test, 90) },
C([new go.Point(4.6,49.3), new go.Point(75.2,150.4), new go.Point(119.4,136.1), new go.Point(5.2,102.6), new go.Point(145.3,48.0), new go.Point(34.3,12.1), new go.Point(73.6,0.0), new go.Point(33.8,138.0), new go.Point(148.4,92.8), new go.Point(119.3,14.3)])
    ));
  start.add(new Test('Angle -90', null, CommonSetup, function (test) { StartAngleRun(test, -90) },
C([new go.Point(145.8,101.1), new go.Point(75.2,0.0), new go.Point(31.0,14.4), new go.Point(145.3,47.9), new go.Point(5.1,102.5), new go.Point(116.2,138.3), new go.Point(76.9,150.4), new go.Point(116.6,12.4), new go.Point(2.1,57.7), new go.Point(31.2,136.2)])
    ));
  start.add(new Test('Angle NaN', null, CommonSetup, function (test) { StartAngleRun(test, NaN) },
C([new go.Point(49.3,145.8), new go.Point(150.4,75.2), new go.Point(136.1,31.0), new go.Point(102.6,145.3), new go.Point(48.0,5.1), new go.Point(12.1,116.2), new go.Point(0.0,76.9), new go.Point(138.0,116.6), new go.Point(92.8,2.1), new go.Point(14.3,31.2)])
    ));
  // #endregion

  // #region Sweep Angle
  var sweep = new TestCollection('Sweep Angle');
  root.add(sweep);

  sweep.add(new Test('Angle 360', null, CommonSetup, function (test) { SweepAngleRun(test, 360) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  sweep.add(new Test('Angle 90', null, CommonSetup, function (test) { SweepAngleRun(test, 90) },
C([new go.Point(503.9,408.6), new go.Point(541.6,270.8), new go.Point(270.8,541.6), new go.Point(526.7,359.3), new go.Point(367.4,523.8), new go.Point(475.7,447.9), new go.Point(446.1,477.2), new go.Point(538.0,314.4), new go.Point(323.6,536.4), new go.Point(406.4,505.2)])
    ));
  sweep.add(new Test('Angle 180', null, CommonSetup, function (test) { SweepAngleRun(test, 180) },
C([new go.Point(200.7,254.0), new go.Point(270.8,135.4), new go.Point(0.0,135.4), new go.Point(241.9,219.0), new go.Point(34.5,225.6), new go.Point(155.0,269.4), new go.Point(113.5,269.0), new go.Point(263.8,178.5), new go.Point(10.3,187.2), new go.Point(67.9,252.8)])
    ));
  sweep.add(new Test('Angle NaN', null, CommonSetup, function (test) { SweepAngleRun(test, NaN) },
C([new go.Point(49.3,145.8), new go.Point(150.4,75.2), new go.Point(136.1,31.0), new go.Point(102.6,145.3), new go.Point(48.0,5.1), new go.Point(12.1,116.2), new go.Point(0.0,76.9), new go.Point(138.0,116.6), new go.Point(92.8,2.1), new go.Point(14.3,31.2)])
    ));
  sweep.add(new Test('Angle -90', null, CommonSetup, function (test) { SweepAngleRun(test, -90) },
C([new go.Point(49.3,145.8), new go.Point(150.4,75.2), new go.Point(136.1,31.0), new go.Point(102.6,145.3), new go.Point(48.0,5.1), new go.Point(12.1,116.2), new go.Point(0.0,76.9), new go.Point(138.0,116.6), new go.Point(92.8,2.1), new go.Point(14.3,31.2)])
    ));
  sweep.add(new Test('Angle 450', null, CommonSetup, function (test) { SweepAngleRun(test, 450) },
C([new go.Point(49.3,145.8), new go.Point(150.4,75.2), new go.Point(136.1,31.0), new go.Point(102.6,145.3), new go.Point(48.0,5.1), new go.Point(12.1,116.2), new go.Point(0.0,76.9), new go.Point(138.0,116.6), new go.Point(92.8,2.1), new go.Point(14.3,31.2)])
    ));
  // #endregion

  // #region Spacing
  var spacing = new TestCollection('Spacing');
  root.add(spacing);

  spacing.add(new Test('Spacing 6', null, CommonSetup, function (test) { SpacingRun(test, 6) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  spacing.add(new Test('Spacing 30', null, CommonSetup, function (test) { SpacingRun(test, 30) },
C([new go.Point(75.7,220.4), new go.Point(226.8,113.4), new go.Point(205.2,46.8), new go.Point(152.6,219.9), new go.Point(74.4,6.9), new go.Point(19.4,176.8), new go.Point(0.0,115.1), new go.Point(207.1,177.3), new go.Point(142.8,3.9), new go.Point(21.5,46.9)])
    ));
  spacing.add(new Test('Spacing -30', null, CommonSetup, function (test) { SpacingRun(test, -30) },
C([new go.Point(9.8,33.9), new go.Point(35.8,17.9), new go.Point(32.4,7.4), new go.Point(27.4,33.1), new go.Point(8.5,2.6), new go.Point(1.5,25.0), new go.Point(0.1,19.6), new go.Point(34.2,25.5), new go.Point(17.6,0.0), new go.Point(3.3,7.5)])
    ));
  spacing.add(new Test('Spacing NaN', null, CommonSetup, function (test) { SpacingRun(test, NaN) },
C([new go.Point(49.3,145.8), new go.Point(150.4,75.2), new go.Point(136.1,31.0), new go.Point(102.6,145.3), new go.Point(48.0,5.1), new go.Point(12.1,116.2), new go.Point(0.0,76.9), new go.Point(138.0,116.6), new go.Point(92.8,2.1), new go.Point(14.3,31.2)])
    ));
  // #endregion

  // #region Node Diameter Formula
  var ndf = new TestCollection('Node Diameter Formula');
  root.add(ndf);

  ndf.add(new Test('Pythagorean', null, CommonSetup, function (test) { NodeDiamRun(test, go.CircularLayout.Pythagorean) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  ndf.add(new Test('Circular', null, CommonSetup, function (test) { NodeDiamRun(test, go.CircularLayout.Circular) },
C([new go.Point(37.7,117.8), new go.Point(122.5,61.3), new go.Point(110.8,25.3), new go.Point(80.2,119.6), new go.Point(35.4,5.7), new go.Point(10.3,95.2), new go.Point(0.1,63.8), new go.Point(112.3,95.2), new go.Point(73.0,1.1), new go.Point(10.3,27.3)])
    ));
  // #endregion

  // #region Direction
  var direction = new TestCollection('Direction');
  root.add(direction);

  direction.add(new Test('Clockwise', null, CommonSetup, function (test) { DirectionRun(test, go.CircularLayout.Clockwise) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  direction.add(new Test('Counterclockwise', null, CommonSetup, function (test) { DirectionRun(test, go.CircularLayout.Counterclockwise) },
C([new go.Point(49.3, 4.6), new go.Point(150.4, 75.2), new go.Point(136.1, 119.4), new go.Point(102.6, 5.2), new go.Point(48.0, 145.3), new go.Point(12.1, 34.3), new go.Point(0.0, 73.6), new go.Point(138.0, 33.8), new go.Point(92.8, 148.4), new go.Point(14.3, 119.3)])
    ));
  direction.add(new Test('BidirectionalLeft', null, CommonSetup, function (test) { DirectionRun(test, go.CircularLayout.BidirectionalLeft) },
C([new go.Point(94.9, 147.8), new go.Point(150.4, 75.2), new go.Point(0.3, 68.4), new go.Point(138.0, 33.8), new go.Point(9.8, 112.3), new go.Point(108.1, 7.6), new go.Point(40.7, 142.0), new go.Point(138.0, 116.6), new go.Point(22.7, 21.4), new go.Point(67.9, 0.4)])
    ));
  direction.add(new Test('BidirectionalRight', null, CommonSetup, function (test) { DirectionRun(test, go.CircularLayout.BidirectionalRight) },
C([new go.Point(131.6, 25.4), new go.Point(138.0, 116.6), new go.Point(8.9, 39.7), new go.Point(104.9, 144.3), new go.Point(40.9, 8.3), new go.Point(65.4, 149.8), new go.Point(83.1, 0.4), new go.Point(150.4, 75.2), new go.Point(1.7, 91.3), new go.Point(27.9, 133.7)])
    ));
  // #endregion

  // #region Sorting
  var sorting = new TestCollection('Sorting');
  root.add(sorting);

  sorting.add(new Test('Forwards', null, CommonSetup, function (test) { SortingRun(test, go.CircularLayout.Forwards) },
C([new go.Point(150.4, 75.2), new go.Point(133.2, 123.1), new go.Point(94.0, 148.1), new go.Point(45.3, 144.2), new go.Point(13.2, 117.7), new go.Point(0.5, 84.2), new go.Point(7.0, 43.6), new go.Point(38.9, 9.3), new go.Point(87.0, 0.9), new go.Point(130.9, 24.6)])
    ));
  sorting.add(new Test('Reverse', null, CommonSetup, function (test) { SortingRun(test, go.CircularLayout.Reverse) },
C([new go.Point(130.9, 24.6), new go.Point(85.9, 0.8), new go.Point(40.1, 8.7), new go.Point(6.6, 44.3), new go.Point(0.7, 85.5), new go.Point(13.9, 118.8), new go.Point(46.0, 144.5), new go.Point(92.7, 148.4), new go.Point(133.9, 122.2), new go.Point(150.4, 75.2)])
    ));
  sorting.add(new Test('Ascending', null, CommonSetup, function (test) { SortingRun(test, go.CircularLayout.Ascending) },
C([new go.Point(49.3, 145.8), new go.Point(150.4, 75.2), new go.Point(136.1, 31.0), new go.Point(102.6, 145.3), new go.Point(48.0, 5.1), new go.Point(12.1, 116.2), new go.Point(0.0, 76.9), new go.Point(138.0, 116.6), new go.Point(92.8, 2.1), new go.Point(14.3, 31.2)])
    ));
  sorting.add(new Test('Descending', null, CommonSetup, function (test) { SortingRun(test, go.CircularLayout.Descending) },
C([new go.Point(12.8, 33.3), new go.Point(136.1, 31.0), new go.Point(150.4, 75.2), new go.Point(56.2, 2.5), new go.Point(94.4, 148.0), new go.Point(0.1, 79.2), new go.Point(13.4, 118.1), new go.Point(101.7, 4.8), new go.Point(132.4, 124.1), new go.Point(51.8, 146.7)])
    ));
  sorting.add(new Test('Optimized', null, CommonSetup, function (test) { SortingRun(test, go.CircularLayout.Optimized) },
C([new go.Point(130.7, 24.4), new go.Point(85.6, 0.7), new go.Point(39.8, 8.9), new go.Point(135.8, 119.8), new go.Point(102.9, 145.2), new go.Point(9.2, 39.2), new go.Point(150.4, 75.2), new go.Point(0.0, 77.9), new go.Point(58.1, 148.5), new go.Point(16.1, 121.7)])
    ));
  // #endregion

  var groups = new TestCollection("groups");
  root.add(groups);

  function CommonSetupGroup(test) {
    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;
    diagram.groupTemplate =
      $(go.Group, 'Spot',
        {
          background: 'rgba(0,255,0,.1)',
          layout: $(go.CircularLayout, { spacing: NaN, radius: 100 }),
          //layout: $(go.TreeLayout),
          //layout: $(go.LayeredDigraphLayout),
          //layout: $(go.GridLayout, { wrappingColumn: 1 }),
          locationSpot: go.Spot.Center
          //location: new go.Point(),  // to avoid Diagram.layout moving the Group
        },
        $(go.Panel,
          $(go.Placeholder, { position: new go.Point(0, 0) },
            new go.Binding("position", "placeholderOffset"))
        ),
        $(go.Panel, "Vertical", { alignmentFocusName: 'CENTER' },
          $(go.Shape, "Circle",
            { name: 'CENTER', portId: "", width: 60, height: 60, fill: "lightblue" }
          ),
          $(go.TextBlock,
            new go.Binding("text")
          ),
          $("SubGraphExpanderButton")
        )
      );

    diagram.model = new go.GraphLinksModel(
    [
      { key: 1, text: "Alpha", color: "lightblue" },
      { key: 2, text: "Beta", color: "orange", group: 5 },
      { key: 3, text: "Gamma", color: "lightgreen", group: 5 },
      { key: 4, text: "Delta", color: "pink", group: 5 },
      { key: 5, text: "Group", isGroup: true },
      { key: 12, text: "Beta", color: "orange", group: 15 },
      { key: 13, text: "Gamma", color: "lightgreen", group: 15 },
      { key: 15, text: "Group2", isGroup: true },
    ],
    [
      { from: 1, to: 2 },
      { from: 5, to: 2 },
      { from: 5, to: 3 },
      { from: 5, to: 4 },
      { from: 1, to: 12 },
      { from: 15, to: 12 },
      { from: 15, to: 13 }
    ]);
  }

  groups.add(new Test("repeated layouts", null, CommonSetupGroup,
    function(test) {
      var diagram = test.diagram;
      var g1 = diagram.findNodeForKey(5);
      var g1pos = g1.position.copy();
      var g1loc = g1.location.copy();
      var g2 = diagram.findNodeForKey(15);
      var g2pos = g2.position.copy();
      var g2loc = g2.location.copy();

      g1.layout.invalidateLayout();
      g2.layout.invalidateLayout();
      diagram.layoutDiagram();

      g1.layout.invalidateLayout();
      g2.layout.invalidateLayout();
      diagram.layoutDiagram();

      test.assert(g1.location.equalsApprox(g1loc), "Group 1 location shouldn't have moved after expand");
      test.assert(g2.location.equalsApprox(g2loc), "Group 2 location shouldn't have moved after expand");
    }
  ));

  groups.add(new Test("collapse/expand by location", null, CommonSetupGroup,
    function(test) {
      var diagram = test.diagram;
      var g1 = diagram.findNodeForKey(5);
      var g1pos = g1.position.copy();
      var g1loc = g1.location.copy();
      var g2 = diagram.findNodeForKey(15);
      var g2pos = g2.position.copy();
      var g2loc = g2.location.copy();

      diagram.commandHandler.collapseSubGraph(g1);
      diagram.commandHandler.collapseSubGraph(g2);
      test.assert(g1.location.equalsApprox(g1loc), "Group 1 location shouldn't have moved after collapse");
      test.assert(g2.location.equalsApprox(g2loc), "Group 2 location shouldn't have moved after collapse");

      diagram.commandHandler.expandSubGraph(g1);
      diagram.commandHandler.expandSubGraph(g2);
      test.assert(g1.location.equalsApprox(g1loc), "Group 1 location shouldn't have moved after expand");
      test.assert(g2.location.equalsApprox(g2loc), "Group 2 location shouldn't have moved after expand");
    }
  ));

  groups.add(new Test("move expanded group", null, CommonSetupGroup,
    function(test) {
      var diagram = test.diagram;
      var g2 = diagram.findNodeForKey(15);
      var g2pos = g2.position.copy();
      var g2loc = g2.location.copy();

      diagram.startTransaction();
      g2.moveTo(g2pos.x + 200, g2pos.y + 100);
      diagram.commitTransaction("moved Group");

      test.assert(g2.position.equalsApprox(new go.Point(g2pos.x+200, g2pos.y+100)), "didn't move Group 2 position after expansion " + g2pos.toString() + "  " + g2.position.toString());
      test.assert(g2.location.equalsApprox(new go.Point(g2loc.x+200, g2loc.y+100)), "didn't move Group 2 location after expansion " + g2loc.toString() + "  " + g2.location.toString());

      test.assert(g2.memberParts.all(function(p) { return p instanceof go.Link || g2.actualBounds.containsPoint(p.location); }), "not all members are inside moved group");
    }
  ));

  groups.add(new Test("move collapsed group", null, CommonSetupGroup,
    function(test) {
      var diagram = test.diagram;
      var g2 = diagram.findNodeForKey(15);
      var g2pos = g2.position.copy();
      var g2loc = g2.location.copy();

      diagram.commandHandler.collapseSubGraph(g2);

      diagram.startTransaction();
      var g2posC = g2.position.copy();
      g2.moveTo(g2posC.x + 200, g2posC.y + 100);
      diagram.commitTransaction("moved Group");

      diagram.commandHandler.expandSubGraph(g2);

      test.assert(g2.position.equalsApprox(new go.Point(g2pos.x+200, g2pos.y+100)), "didn't move Group 2 position after expansion " + g2pos.toString() + "  " + g2.position.toString());
      test.assert(g2.location.equalsApprox(new go.Point(g2loc.x+200, g2loc.y+100)), "didn't move Group 2 location after expansion " + g2loc.toString() + "  " + g2.location.toString());

      test.assert(g2.memberParts.all(function(p) { return p instanceof go.Link || g2.actualBounds.containsPoint(p.location); }), "not all members are inside moved group");
    }
  ));

})();
