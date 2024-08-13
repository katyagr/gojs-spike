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
  var $ = go.GraphObject.make;

  var geom = new TestCollection('graphObjectTests');
    TestRoot.add(geom);

    // Point :
    var points = new TestCollection('Panel');
    geom.add(points);

    points.add(new Test('alignment', null,
    function (test) {
        var d = test.diagram;
        d.clear();
        d.startTransaction('stuff');

        var node1 = new go.Node(go.Panel.Vertical);
        node1.desiredSize = new go.Size(100, NaN);
        node1.location = new go.Point(20, 20);
        node1.background = 'lightblue';

        var node2 = new go.Node(go.Panel.Vertical);
        node2.desiredSize = new go.Size(100, NaN);
        node2.location = new go.Point(124, 20);
        node2.background = 'lightblue';

        var node3 = new go.Node(go.Panel.Horizontal);
        node3.desiredSize = new go.Size(NaN, 100);
        node3.location = new go.Point(228, 20);
        node3.background = 'lightblue';

        var node4 = new go.Node(go.Panel.Horizontal);
        node4.desiredSize = new go.Size(NaN, 100);
        node4.location = new go.Point(228, 124);
        node4.background = 'lightblue';

        var node5 = new go.Node(go.Panel.Table);
        node5.desiredSize = new go.Size(240, 240);
        node5.location = new go.Point(228, 228);
        node5.background = 'lightblue';
        node5.getColumnDefinition(0).width = 80;
        node5.getColumnDefinition(1).width = 80;
        node5.getColumnDefinition(2).width = 80;
        node5.getRowDefinition(0).height = 80;
        node5.getRowDefinition(1).height = 80;
        node5.getRowDefinition(2).height = 80;


        //Vertical test panels
        var s11 = new go.Shape();
        s11.figure = 'Triangle';
        s11.fill = 'rgba(90,90,90,.4)';
        s11.stretch = go.GraphObject.None;
        s11.desiredSize = new go.Size(20, 20);
        node1.add(s11);

        var s12 = s11.copy();
        s12.stretch = go.GraphObject.Default;
        node1.add(s12);

        var s15 = s11.copy();
        s15.stretch = go.GraphObject.Fill;
        s15.desiredSize = new go.Size(NaN, 20);
        node1.add(s15);

        var s16 = s11.copy();
        s16.stretch = go.GraphObject.Horizontal;
        s16.desiredSize = new go.Size(NaN, 20);
        node1.add(s16);

        var s17 = s11.copy();
        s17.stretch = go.GraphObject.Vertical;
        node1.add(s17);

        var s21 = s11.copy();
        s21.alignment = go.Spot.BottomLeft
        s21.stretch = go.GraphObject.None;
        node2.add(s21);

        var s22 = s11.copy();
        s22.alignment = go.Spot.BottomLeft
        s22.stretch = go.GraphObject.Default;
        node2.add(s22);

        var s25 = s11.copy();
        s25.alignment = go.Spot.BottomLeft
        s25.stretch = go.GraphObject.Fill;
        s25.desiredSize = new go.Size(NaN, 20);
        node2.add(s25);

        var s26 = s11.copy();
        s26.alignment = go.Spot.BottomLeft
        s26.stretch = go.GraphObject.Horizontal;
        s26.desiredSize = new go.Size(NaN, 20);
        node2.add(s26);

        var s27 = s11.copy();
        s27.alignment = go.Spot.BottomLeft
        s27.stretch = go.GraphObject.Vertical;
        node2.add(s27);

        //Horizontal test panels
        var s31 = s11.copy();
        s31.stretch = go.GraphObject.None;
        node3.add(s31);

        var s32 = s11.copy();
        s32.stretch = go.GraphObject.Default;
        node3.add(s32);

        var s35 = s11.copy();
        s35.stretch = go.GraphObject.Fill;
        s35.desiredSize = new go.Size(20, NaN);
        node3.add(s35);

        var s36 = s11.copy();
        s36.stretch = go.GraphObject.Horizontal;
        node3.add(s36);

        var s37 = s11.copy();
        s37.stretch = go.GraphObject.Vertical;
        s37.desiredSize = new go.Size(20, NaN);
        node3.add(s37);

        var s41 = s11.copy();
        s41.alignment = go.Spot.BottomLeft
        s41.stretch = go.GraphObject.None;
        node4.add(s41);

        var s42 = s11.copy();
        s42.alignment = go.Spot.BottomLeft
        s42.stretch = go.GraphObject.Default;
        node4.add(s42);

        var s45 = s11.copy();
        s45.alignment = go.Spot.BottomLeft
        s45.stretch = go.GraphObject.Fill;
        s45.desiredSize = new go.Size(20, NaN);
        node4.add(s45);

        var s46 = s11.copy();
        s46.alignment = go.Spot.BottomLeft
        s46.stretch = go.GraphObject.Horizontal;
        node4.add(s46);

        var s47 = s11.copy();
        s47.alignment = go.Spot.BottomLeft
        s47.stretch = go.GraphObject.Vertical;
        s47.desiredSize = new go.Size(20, NaN);
        node4.add(s47);

        //Table test panel
        var s53 = s11.copy();
        s53.column = 2;
        s53.row = 0;
        s53.stretch = go.GraphObject.None;
        node5.add(s53);

        var s54 = s11.copy();
        s54.column = 0;
        s54.row = 1;
        s54.stretch = go.GraphObject.Default;
        node5.add(s54);

        var s57 = s11.copy();
        s57.column = 0;
        s57.row = 2;
        s57.desiredSize = new go.Size(NaN, NaN);
        s57.stretch = go.GraphObject.Fill;
        node5.add(s57);

        var s58 = s11.copy();
        s58.column = 1;
        s58.row = 2;
        s58.desiredSize = new go.Size(NaN, 20);
        s58.stretch = go.GraphObject.Horizontal;
        node5.add(s58);

        var s59 = s11.copy();
        s59.column = 2;
        s59.row = 2;
        s59.desiredSize = new go.Size(20, NaN);
        s59.stretch = go.GraphObject.Vertical;
        node5.add(s59);

        d.add(node1);
        d.add(node2);
        d.add(node3);
        d.add(node4);
        d.add(node5);

        d.commitTransaction('stuff');
    },
    null,
    function (test) {
        var d = test.diagram;
        //Vertical Panel 1
        test.assert(!(d.findObjectAt(new go.Point(115, 150)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(25, 250)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(115, 250)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(20, 280)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(120, 280)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(20, 300)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(120, 300)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(60, 318)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(80, 318)) instanceof go.Shape));

        //Vertical Panel 1 actualBounds
        test.assert((d.findObjectAt(new go.Point(70, 30)).actualBounds).equals(new go.Rect(39.5, 0, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(70, 51)).actualBounds).equals(new go.Rect(39.5, 21, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(70, 72)).actualBounds).equals(new go.Rect(0, 42, 100, 21)));


        //Vertical  Panel 2
        test.assert(!(d.findObjectAt(new go.Point(125, 37)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(127, 37)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(140, 37)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(143, 37)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(125, 57)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(127, 57)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(140, 57)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(143, 57)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(125, 160)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(225, 160)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(125, 260)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(225, 260)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(130, 280)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(220, 280)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(125, 318)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(145, 318)) instanceof go.Shape));


        //Vertical Panel 1 actualBounds
        test.assert((d.findObjectAt(new go.Point(135, 30)).actualBounds).equals(new go.Rect(0, 0, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(135, 51)).actualBounds).equals(new go.Rect(0, 21, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(175, 72)).actualBounds).equals(new go.Rect(0, 42, 100, 21)));



        //Horizontal Panel 1
        test.assert(!(d.findObjectAt(new go.Point(228, 75)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(232, 75)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(244, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(248, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(250, 75)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(254, 75)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(266, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(270, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(270, 115)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(275, 115)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(370, 115)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(470, 115)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(492, 115)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(490, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(512, 75)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(510, 115)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(534, 115)) instanceof go.Shape));

        //Horizontal Panel 1 actualBounds
        test.assert((d.findObjectAt(new go.Point(240, 70)).actualBounds).equals(new go.Rect(0, 39.5, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(260, 70)).actualBounds).equals(new go.Rect(21, 39.5, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(320, 70)).actualBounds).equals(new go.Rect(84, 0, 21, 100)));


        //Horizontal Panel 2
        test.assert(!(d.findObjectAt(new go.Point(228, 220)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(232, 220)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(244, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(248, 220)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(252, 220)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(266, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(270, 220)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(275, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(370, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(470, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(491, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(511, 220)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(534, 115)) instanceof go.Shape));


        //Horizontal Panel 2 actualBounds
        test.assert((d.findObjectAt(new go.Point(240, 220)).actualBounds).equals(new go.Rect(0, 79, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(260, 220)).actualBounds).equals(new go.Rect(21, 79, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(320, 220)).actualBounds).equals(new go.Rect(84, 0, 21, 100)));

        //Table Panel 1
        test.assert(!(d.findObjectAt(new go.Point(417, 275)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(420, 275)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(435, 275)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(438, 275)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(257, 355)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(260, 355)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(275, 355)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(278, 355)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(308, 385)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(388, 385)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(467, 385)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(228, 465)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(231, 465)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(304, 465)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(307, 465)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(310, 435)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(315, 435)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(380, 435)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(385, 435)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(417, 465)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(419, 465)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(436, 465)) instanceof go.Shape));
        test.assert(!(d.findObjectAt(new go.Point(438, 465)) instanceof go.Shape));

        //Table Panel 1 actualBounds
        test.assert((d.findObjectAt(new go.Point(428, 270))).actualBounds.equals(new go.Rect(189.5, 29.5, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(268, 350))).actualBounds.equals(new go.Rect(29.5, 109.5, 21, 21)));
        test.assert((d.findObjectAt(new go.Point(268, 428))).actualBounds.equals(new go.Rect(0, 160, 80, 80)));
        test.assert((d.findObjectAt(new go.Point(349, 428))).actualBounds.equals(new go.Rect(80, 189.5, 80, 21)));
        test.assert((d.findObjectAt(new go.Point(428, 428))).actualBounds.equals(new go.Rect(189.5, 160, 21, 80)));
    }
    ));

    points.add(new Test('margins', null,
    function (test) {
        var d = test.diagram;
        d.clear();
        d.startTransaction('stuff');

        //Nodes
        var node1 = new go.Node(go.Panel.Vertical);
        node1.location = new go.Point(100, 100);
        node1.background = 'lightblue';

        var node2 = new go.Node(go.Panel.Horizontal);
        node2.location = new go.Point(150, 100);
        node2.background = 'lightblue';

        var node3 = new go.Node(go.Panel.Table);
        node3.location = new go.Point(200, 100);
        node3.background = 'lightblue';

        var node4 = new go.Node(go.Panel.Spot);
        node4.location = new go.Point(300, 100);
        node4.background = 'lightblue';

        var node5 = new go.Node(go.Panel.Spot);
        node5.location = new go.Point(400, 100);
        node5.background = 'lightblue';

        var node6 = new go.Node(go.Panel.Spot);
        node6.location = new go.Point(500, 100);
        node6.background = 'lightblue';

        var node7 = new go.Node(go.Panel.Position);
        node7.location = new go.Point(600, 100);
        node7.background = 'lightblue';

        var node8 = new go.Node(go.Panel.Auto);
        node8.location = new go.Point(675, 100);
        node8.background = 'lightblue';

        var node9 = new go.Node(go.Panel.Auto);
        node9.location = new go.Point(750, 100);
        node9.background = 'lightblue';

        var node10 = new go.Node(go.Panel.Auto);
        node10.location = new go.Point(675, 200);
        node10.background = 'lightblue';

        var node11 = new go.Node(go.Panel.Auto);
        node11.location = new go.Point(750, 200);
        node11.background = 'lightblue';

        //Vertical panel test with margins
        var s1 = new go.Shape();
        s1.desiredSize = new go.Size(25, 25);
        s1.margin = 10;
        s1.fill = "rgba(255, 0, 0, .5)";
        node1.add(s1);

        //Horizontal panel test with margins
        var s2 = s1.copy();
        node2.add(s2);

        //Table panel test with margins
        var s3 = s1.copy();
        node3.add(s3);

        //Spot panel 1 test with margins
        // Second object has a margin
        var s41 = s1.copy();
        s41.margin = 0;
        s41.fill = "rgba(0, 0, 255, .5)";
        var s42 = s1.copy();
        s41.alignment = go.Spot.TopLeft;
        s42.alignment = go.Spot.TopLeft;
        s42.alignmentFocus = go.Spot.BottomRight;
        node4.add(s41);
        node4.add(s42);

        //Spot panel 2 test with margins
        // Main object has a margin
        var s51 = s1.copy();
        var s52 = s1.copy();
        s52.margin = 0;
        s51.alignment = go.Spot.TopLeft;
        s51.fill = "rgba(0, 0, 255, .5)";
        s52.alignment = go.Spot.TopLeft;
        s52.alignmentFocus = go.Spot.BottomRight;
        node5.add(s51);
        node5.add(s52);

        //Spot panel 3 test with margins
        // Both objects have a margin
        var s61 = s1.copy();
        var s62 = s1.copy();
        s61.alignment = go.Spot.TopLeft;
        s61.fill = "rgba(0, 0, 255, .5)";
        s62.alignment = go.Spot.TopLeft;
        s62.alignmentFocus = go.Spot.BottomRight;
        node6.add(s61);
        node6.add(s62);

        //Position panel test with margins
        var s7 = s1.copy();
        node7.add(s7);

        //Auto panel test with margins
        var s81 = new go.Shape();
        s81.figure = 'Circle';

        s81.margin = 0;
        s81.fill = "rgba(0, 0, 255, .5)";
        node8.add(s81);

        var s82 = s1.copy();
        s82.margin = 0;
        node8.add(s82);

        var s91 = s81.copy();
        s91.margin = 0;
        node9.add(s91);

        var s92 = s1.copy();
        s92.margin = 10;
        node9.add(s92);

        var s101 = s91.copy(); // no margin
        s101.desiredSize = new go.Size(45, 45);
        node10.add(s101);

        var s111 = s81.copy(); // margin
        s111.margin = 10;
        s111.desiredSize = new go.Size(45, 45);
        node11.add(s111);

        //add nodes to diagram
        d.add(node1);
        d.add(node2);
        d.add(node3);
        d.add(node4);
        d.add(node5);
        d.add(node6);
        d.add(node7);
        d.add(node8);
        d.add(node9);
        d.add(node10);
        d.add(node11);

        d.commitTransaction('stuff');
    },
    null,
    function (test) {
        var d = test.diagram;

        //Test cases for each node
        //Vertical Panel
        //Spot Panel 1

        test.assert(!(d.findObjectAt(new go.Point(325, 105)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(325, 115)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(325, 125)).actualBounds).equals(new go.Rect(10, 10, 26, 26)));

        test.assert((d.findObjectAt(new go.Point(360, 140)) instanceof go.Shape));

        test.assert((d.findObjectAt(new go.Point(360, 150)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(360, 160)).actualBounds).equals(new go.Rect(36, 36, 26, 26)));
        //Spot Panel 2
        test.assert(!(d.findObjectAt(new go.Point(415, 95)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(415, 105)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(415, 115)).actualBounds).equals(new go.Rect(0, 0, 26, 26)));
        test.assert((d.findObjectAt(new go.Point(450, 130)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(450, 140)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(450, 150)).actualBounds).equals(new go.Rect(26, 26, 26, 26)));
        //Spot Panel 3
        test.assert(!(d.findObjectAt(new go.Point(525, 105)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(525, 115)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(525, 125)).actualBounds).equals(new go.Rect(10, 10, 26, 26)));
        test.assert(!(d.findObjectAt(new go.Point(570, 150)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(570, 160)) instanceof go.Node));
        test.assert((d.findObjectAt(new go.Point(543, 149)).actualBounds).equals(new go.Rect(36, 36, 26, 26)));
        //Position Panel
        test.assert(!(d.findObjectAt(new go.Point(625, 105)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(625, 115)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(625, 125)).actualBounds).equals(new go.Rect(10, 10, 26, 26)));
        //Auto Panel 1
        test.assert((d.findObjectAt(new go.Point(705, 105)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(705, 115)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(705, 120)) instanceof go.Shape));
        //Auto Panel 2
        test.assert(!(d.findObjectAt(new go.Point(755, 110)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(785, 110)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(785, 130)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(785, 110)).actualBounds).equals(new go.Rect(0, 0, 67.86046511627907, 67.86046511627907)));
        test.assert((d.findObjectAt(new go.Point(785, 130)).actualBounds).equals(new go.Rect(20.930232558139537,20.930232558139537, 26, 26)));
        //Auto Panel 3
        test.assert(!(d.findObjectAt(new go.Point(678, 205)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(698, 205)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(698, 205)).actualBounds).equals(new go.Rect(0, 0, 46, 46)));
        //Auto Panel 4
        test.assert(!(d.findObjectAt(new go.Point(782, 205)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(782, 215)) instanceof go.Shape));
        test.assert((d.findObjectAt(new go.Point(782, 215)).actualBounds).equals(new go.Rect(10, 10, 46, 46)));

    }
    ));

    points.add(new Test('visibility', null,
    function (test) {
        var d = test.diagram;
        d.clear();

        d.startTransaction('stuff');

        //Nodes
        var node1 = new go.Node(go.Panel.Spot);
        node1.location = new go.Point(100, 100);
        node1.background = 'lightblue';

        var node2 = new go.Node(go.Panel.Spot);
        node2.location = new go.Point(200, 100);
        node2.background = 'lightblue';

        var node3 = new go.Node(go.Panel.Vertical);
        node3.location = new go.Point(100, 200);
        node3.background = 'lightblue';

        var node4 = new go.Node(go.Panel.Horizontal);
        node4.location = new go.Point(200, 200);
        node4.background = 'lightblue';

        var node5 = new go.Node(go.Panel.Table);
        node5.location = new go.Point(300, 100);
        node5.background = 'lightblue';

        //Spot panel tests with visibility
        var s11 = new go.Shape();
        s11.desiredSize = new go.Size(50, 50);
        s11.alignment = go.Spot.TopLeft;
        s11.fill = "rgba(255, 0, 0, .5)";
        node1.add(s11);

        var s12 = new go.Shape();
        s12.desiredSize = new go.Size(25, 25);
        s12.alignment = go.Spot.TopLeft;
        s12.alignmentFocus = go.Spot.BottomRight;
        s12.fill = "rgba(0, 0, 255, .5)";
        node1.add(s12);

        s12.visible = false;

        var s21 = s11.copy();
        node2.add(s21);

        var s22 = s12.copy();
        s22.visible = true;
        node2.add(s22);

        s21.visible = false;

        //Horizontal panel tests with visibility
        var s31 = new go.Shape();
        s31.desiredSize = new go.Size(50, 50);
        s31.fill = "rgba(255, 0, 0, .5)";

        var s32 = new go.Shape();
        s32.desiredSize = new go.Size(25, 25);
        s32.fill = "rgba(0, 0, 255, .5)";

        node3.add(s31);
        node3.add(s32);
        node3.add(s31.copy());

        s32.visible = false;

        //Vertical panel tests with visibility
        var s41 = s31.copy();

        var s42 = s32.copy();

        node4.add(s41);
        node4.add(s42);
        node4.add(s41.copy());

        //Table panel test with visibililty
        var s51 = s31.copy();

        var s52 = s32.copy();
        s52.desiredSize = new go.Size(200, 200);
        s52.column = 1;

        node5.add(s51);
        node5.add(s52);

        //add nodes to diagram
        d.add(node1);
        d.add(node2);
        d.add(node3);
        d.add(node4);
        d.add(node5);

        s42.visible = false;

        d.commitTransaction('stuff');
    },
    null,
    function (test) {
        var d = test.diagram;

        //Visibility Tests
        //Spot Panel 1
        test.assert((d.findObjectAt(new go.Point(125, 125)).actualBounds).equals(new go.Rect(0, 0, 51, 51)));
        //Spot Panel 2
        test.assert((d.findObjectAt(new go.Point(225, 125)).actualBounds).equals(new go.Rect(0, 0, 26, 26)));
        //Vertical Panel
        test.assert((d.findObjectAt(new go.Point(125, 225)).actualBounds).equals(new go.Rect(0, 0, 51, 51)));
        test.assert((d.findObjectAt(new go.Point(125, 275)).actualBounds).equals(new go.Rect(0, 51, 51, 51)));
        //Horizontal Panel
        test.assert((d.findObjectAt(new go.Point(225, 225)).actualBounds).equals(new go.Rect(0, 0, 51, 51)));
        test.assert((d.findObjectAt(new go.Point(275, 225)).actualBounds).equals(new go.Rect(51, 0, 51, 51)));
        //Table Panel
        test.assert((d.findObjectAt(new go.Point(325, 125)).actualBounds).equals(new go.Rect(0, 0, 51, 51)));
    }
    ));

    points.add(new Test('fill', null,
    function (test) {
        var d = test.diagram;
        d.clear();

        d.startTransaction('stuff');

        //Nodes
        var node1 = new go.Node(go.Panel.Vertical);
        node1.location = new go.Point(100, 100);
        node1.background = 'lightblue';

        var node2 = new go.Node(go.Panel.Horizontal);
        node2.location = new go.Point(405, 100);
        node2.background = 'lightblue';

        var node3 = new go.Node(go.Panel.Table);
        node3.location = new go.Point(100, 405);
        node3.background = 'lightblue';

        //Vertical panel test with changing stretch values
        var s11 = new go.Shape();
        s11.figure = 'Ellipse';
        //s11.desiredSize = new go.Size(100, 100);
        s11.alignment = new go.Spot(.5, .5, 0, 0);
        s11.stretch = go.GraphObject.Fill;

        var s12 = s11.copy();
        s12.desiredSize = new go.Size(300, 100);
        s12.fill = 'gray';

        node1.add(s11);
        node1.add(s12);
        node1.add(s11.copy());

        //Horizontal panel test with changing stretch values
        var s21 = s11.copy();

        var s22 = s12.copy();
        s22.desiredSize = new go.Size(100, 300);

        node2.add(s21);
        node2.add(s22);
        node2.add(s21.copy());

        //Table panel test with changing stretch values
        var s31 = s11.copy();
        s31.row = 0;
        s31.column = 0;

        var s32 = s12.copy();
        s32.row = 1;
        s32.column = 0;

        var s33 = s22.copy();
        s33.desiredSize = new go.Size(200, 300);
        s33.row = 0;
        s33.column = 1;

        var s34 = s31.copy();
        s34.row = 1;
        s34.column = 1;

        node3.add(s31);
        node3.add(s32);
        node3.add(s33);
        node3.add(s34);

        //add nodes to diagram
        d.add(node1);
        d.add(node2);
        d.add(node3);

        d.commitTransaction('stuff');
    },
    null,
    function (test) {
        var d = test.diagram;

        //Vertical Panel with changing stretch values tests
        test.assert((d.findObjectAt(new go.Point(250, 150)).actualBounds))//.equals(new go.Rect(0, 0, 300, 100)));
        test.assert((d.findObjectAt(new go.Point(250, 350)).actualBounds))//.equals(new go.Rect(0, 200, 300, 100)));

        test.assert((d.findObjectAt(new go.Point(455, 250)).actualBounds))//.equals(new go.Rect(0, 0, 100, 300)));
        test.assert((d.findObjectAt(new go.Point(655, 250)).actualBounds))//.equals(new go.Rect(200, 0, 100, 300)));

        test.assert((d.findObjectAt(new go.Point(250, 555)).actualBounds))//.equals(new go.Rect(0, 0, 300, 300)));
        test.assert((d.findObjectAt(new go.Point(450, 755)).actualBounds))//.equals(new go.Rect(300, 300, 200, 200)));
    }
    ));

    points.add(new Test('geometryHitTesting', null,
    function (test) {
      var $ = go.GraphObject.make;
      var d = test.diagram;
      d.clear();
      d.startTransaction('stuff');

      var temprect = new go.Geometry(go.Geometry.Rectangle);
      temprect.startX = 0;
      temprect.startY = 0;
      temprect.endX = 40;
      temprect.endY = 40;

      var tempellipse = new go.Geometry(go.Geometry.Ellipse);
      tempellipse.startX = 0;
      tempellipse.startY = 0;
      tempellipse.endX = 40;
      tempellipse.endY = 40;

      var templine = new go.Geometry(go.Geometry.Line);
      templine.startX = 0;
      templine.startY = 0;
      templine.endX = 40;
      templine.endY = 40;

      var vert1 =
        $(go.Node, "Vertical",
        { location: new go.Point(0,0) },
          test.vert1s = $(go.Shape,
            { geometry: temprect,
              fill: null,
              //stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert1);

      var vert2 =
        $(go.Node, "Vertical",
        { location: new go.Point(50,0) },
          test.vert2s = $(go.Shape,
            { geometry: tempellipse,
              fill: null,
              //stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert2);

      var vert3 =
        $(go.Node, "Vertical",
        { location: new go.Point(100,0) },
          test.vert3s = $(go.Shape,
            { geometry: templine,
              fill: null,
              //stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert3);

  // Second row:

      var vert4 =
        $(go.Node, "Vertical",
        { location: new go.Point(0,50) },
          test.vert4s = $(go.Shape,
            { geometry: temprect,
              //fill: null,
              stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert4);

      var vert5 =
        $(go.Node, "Vertical",
        { location: new go.Point(50,50) },
          test.vert5s = $(go.Shape,
            { geometry: tempellipse,
              //fill: null,
              stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert5);

      var vert6 =
        $(go.Node, "Vertical",
        { location: new go.Point(100,50) },
          test.vert6s = $(go.Shape,
            { geometry: templine,
              //fill: null,
              stroke: null,
              strokeWidth: 8
            })
        );
      d.add(vert6);

      d.commitTransaction('stuff');
    },
    null,
    function (test) {
      var d = test.diagram;


      test.assert(d.findObjectAt(new go.Point(1,1)) === test.vert1s);
      test.assert(d.findObjectAt(new go.Point(7.9,7.9)) === test.vert1s);
      test.assert(d.findObjectAt(new go.Point(8,8)) === test.vert1s);
      test.assert(d.findObjectAt(new go.Point(10,10)) === null);
      test.assert(d.findObjectAt(new go.Point(61,7)) === test.vert2s);
      test.assert(d.findObjectAt(new go.Point(62,41)) === test.vert2s);
      test.assert(d.findObjectAt(new go.Point(66,17)) === null);
      test.assert(d.findObjectAt(new go.Point(122,21)) === test.vert3s);
      test.assert(d.findObjectAt(new go.Point(104,4)) === test.vert3s);
      test.assert(d.findObjectAt(new go.Point(118,28)) === null);

      // All of the above with 50 added to the Y direction should hit nothing

      test.assert(d.findObjectAt(new go.Point(1,1+50)) === null);
      test.assert(d.findObjectAt(new go.Point(3,8+50)) === null);
      test.assert(d.findObjectAt(new go.Point(10,10+50)) === test.vert4s);
      test.assert(d.findObjectAt(new go.Point(61,7+50)) === null);
      test.assert(d.findObjectAt(new go.Point(62,41+50)) === null);
      test.assert(d.findObjectAt(new go.Point(66,17+50)) === test.vert5s);
      test.assert(d.findObjectAt(new go.Point(122,21+50)) === null);
      test.assert(d.findObjectAt(new go.Point(104,4+50)) === null);
      test.assert(d.findObjectAt(new go.Point(118,28+50)) === null);
    }
    ));

    points.add(new Test("transforms", null,
      function(test) {
        var diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate =
          $(go.Node, "Auto",
            { scale: 1.1, angle: 10 },
            $(go.Shape, { fill: "lightgray", strokeWidth: 2 }),
            $(go.Panel, "Table",
              { name: "P1", margin: 1 },
              $(go.Panel, "TableRow", { name: "P2", row: 2 },
                $(go.Shape, "Triangle", { column: 0, width: 20, height: 20, fill: "orange" }),
                $(go.TextBlock, "row 0 col 1", { name: "TB1", column: 1, scale: 0.7, angle: 123, background: "pink" })
              ),
              $(go.Panel, "Vertical", { name: "P3", row: 1, column: 0, padding: 20, angle: -20, background: "cyan" },
                $(go.TextBlock, "row 1 col 0", { name: "TB2", scale: 0.5, angle: 234, background: "yellow" }),
                $(go.TextBlock, "row 1 col 0", { name: "TB3", scale: 0.6, angle: 234, background: "lightgreen" })
              )
            )
          );

        diagram.model = $(go.GraphLinksModel, {
          nodeDataArray: [
            { key: 1 },
            { key: 2 }
          ],
          linkDataArray: [
            { from: 1, to: 2 }
          ]
        });
      },
      function(test) {
        var diagram = test.diagram;
        var node1 = diagram.findNodeForKey(1);
        var node2 = diagram.findNodeForKey(2);
        var diffx = node2.location.x - node1.location.x;
        var tb31 = node1.findObject("TB3");
        var tb32 = node2.findObject("TB3");
        var tb31p = tb31.getDocumentPoint(go.Spot.BottomLeft);
        var tb32p = tb32.getDocumentPoint(go.Spot.BottomLeft);
        test.assert(Math.abs(tb31p.x - (tb32p.x - diffx)) < 0.01, "two different textblocks should not be at same doc point");
        var tb31l = tb31.getLocalPoint(tb31p);
        var tb32l = tb32.getLocalPoint(tb32p);
        test.assert(tb31l.equalsApprox(tb32l), "local points within two different nodes should be about the same")
        var tb31q = tb31.getDocumentPoint(tb31l);
        var tb32q = tb32.getDocumentPoint(tb32l);
        test.assert(Math.abs(tb31q.x - (tb32q.x - diffx)) < 0.01, "two different textblocks should not be at same doc point after inverse transform");
      }
    ));

  points.add(new Test("getDocumentBounds", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();


      var $ = go.GraphObject.make;  // for conciseness in defining templates

      diagram.findLayer('').opacity = 0.5;

      // define a simple Node template
      diagram.nodeTemplate =
        $(go.Node, "Vertical",  // the Shape will go around the TextBlock
          $(go.Shape, "Rectangle", { fill:'lime', width: 20, height: 30, strokeWidth: 3 }),
          $(go.Panel, "Horizontal", { angle: 30, background: 'rgba(255,0,255,.1)' },
            new go.Binding('angle', 'angle1'),
            $(go.Shape, "Rectangle", { fill:'lightcoral', angle: 30, width: 40, height: 40, strokeWidth: 0 },
              new go.Binding('angle', 'angle2'))
          ),
          $(go.Shape, "Rectangle", { fill:'red', width: 20, height: 30, strokeWidth: 0 })
        );

      diagram.nodeTemplateMap.add('t2',
        $(go.Node, "Vertical",  // the Shape will go around the TextBlock
          $(go.Shape, "Rectangle", { fill:'red', width: 20, height: 30, strokeWidth: 0 }),
          $(go.Panel, "Horizontal", { angle: 30, background: 'rgba(0,255,255,.1)', scale: 3 },
            new go.Binding('angle', 'angle1'),
            new go.Binding('scale', 'scale1'),
            $(go.Shape, "Rectangle", { fill:'blue', angle: 30, width: 40, height: 40, strokeWidth: 0 },
              new go.Binding('angle', 'angle2'),
              new go.Binding('scale', 'scale2')
            )
          ),
          $(go.Shape, "Rectangle", { fill:'red', width: 10, height: 40, angle: 90, strokeWidth: 0 })
        )
      );

      // create the model data that will be represented by Nodes and Links
      diagram.model = new go.GraphLinksModel(
      [
        { key: "Alpha", angle1: 30, angle2: 45 },
        { key: "Beta", angle1: 10, angle2: 5 },
        { key: "Gamma", angle1: 0, angle2: -45 },
        { key: "Delta", angle1: 0, angle2: 0 },
        { category: 't2', key: "1", angle1: 0, angle2: 0, scale1: 0.5, scale2: 2 },
        { category: 't2', key: "1", angle1: -20, angle2: 20, scale1: 1.2, scale2: 1.2 },
      ],
      [
      ]);

    },
    function(test) {
      var diagram = test.diagram;
      // make sure the main elemnet isn't a textblock:

      var arr = [];
      diagram.nodes.each(function(n) {
        flatten(n, arr);
        test.assert(n.getDocumentBounds().equals(n.actualBounds));
        test.assert(n.getDocumentBounds() !== (n.actualBounds)); // but we are not copying
        var r = new go.Rect();
        test.assert(n.getDocumentBounds(r).equals(n.actualBounds));
        test.assert(n.getDocumentBounds(r) !== (n.actualBounds)); // but we are not copying
      })
      // console.log(arr);

      function flatten(panel, arr) {
        var b = panel.getDocumentBounds();
        arr.push(b.x);
        arr.push(b.y);
        arr.push(b.width);
        arr.push(b.height);
        if (panel instanceof go.Panel) {
          panel.elements.each(function(c) { flatten(c, arr) });
        }
        return arr;
      }

      toCheck = [0, 0, 77.27406610312546, 140.27406610312545, 27.13703305156273, 0, 23, 33, 3.552713678800501e-15, 32.99999999999999, 77.27406610312548,
        77.27406610312545, 14.142135623730951, 47.14213562373094, 48.98979485566356, 48.98979485566356, 28.63703305156273, 110.27406610312545, 20, 30,
        97.27406610312546, 0, 50.20054972777064, 113.20054972777064, 110.87434096701078, 0, 22.999999999999986, 33, 97.27406610312546, 33, 50.20054972777065,
        50.200549727770635, 97.879443539179, 33.605377436053544, 48.989794855663575, 48.98979485566355, 112.37434096701078, 83.20054972777064, 19.999999999999986,
        30, 167.47461583089608, 0, 56.568542494923804, 119.5685424949238, 184.258887078358, 0, 23, 33, 167.47461583089608, 33, 56.568542494923804, 56.568542494923804,
        167.47461583089608, 33, 56.568542494923804, 56.568542494923804, 185.758887078358, 89.5685424949238, 20, 30, 0, 160.27406610312545, 40, 103, 8.5,
        160.27406610312545, 23, 33, 0, 193.27406610312545, 40, 40, 0, 193.27406610312545, 40, 40, 10, 233.27406610312545, 20, 30, 70, 160.27406610312545, 40, 80,
        80, 160.27406610312545, 20, 30, 70, 190.27406610312545, 40, 40, 70, 190.27406610312545, 40, 40, 70, 230.27406610312545, 40, 10, 140, 160.27406610312545,
        94.62456631794464, 134.62456631794464, 177.31228315897232, 160.27406610312545, 20, 30, 140, 190.27406610312545, 94.62456631794464, 94.62456631794464,
        158.51228315897234, 208.7863492620978, 57.599999999999994, 57.599999999999994, 167.31228315897232, 284.8986324210701, 40, 10];

      for (var i = 0; i < arr.length; i++) {
      //  test.assert(test.isApproxEqual(arr[i], toCheck[i]));
      if (!test.isApproxEqual(arr[i], toCheck[i])) console.log(arr[i], toCheck[i])
      }

      // Visual aid for debugging

      // var ctx = diagram._canvas._domElement.getContext('2d');
      // ctx.fillStyle = 'rgba(0,255,0,.3)';
      // var pos = diagram.position;
      // ctx.translate(-pos.x, -pos.y);
      // for (var i = 0; i < arr.length; i+=4) {
      //   ctx.fillRect(arr[i], arr[i + 1], arr[i + 2], arr[i + 3])
      // }

    }
  ));

    points.add(new Test("findMainElement", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();

      // define a simple Node template
      diagram.nodeTemplate =
      $(go.Node, "Spot",
        { background: "lightgray" },
        $(go.TextBlock, "TL", { /*width: 20, height: 15, */ background: "yellow", alignment: go.Spot.TopLeft }),
        $(go.TextBlock, "TR", { /*width: 20, height: 15, */ background: "yellow", alignment: go.Spot.TopRight }),
        $(go.TextBlock, "BL", { /*width: 20, height: 15, */ background: "yellow", alignment: go.Spot.BottomLeft }),
        $(go.TextBlock, "BR", { /*width: 20, height: 15, */ background: "yellow", alignment: go.Spot.BottomRight }),

        // NOTE: the main element isn't first, so it must be declared by setting isPanelMain to true
        $(go.Shape, "Rectangle",
          { isPanelMain: true },
          { fill: "lightgreen", width: 100, height: 50 })
      );

      diagram.model = new go.GraphLinksModel( [ { key: "Alpha", color: "lightblue" } ], [ ]);
    },
    function(test) {
      var diagram = test.diagram;
      // make sure the main elemnet isn't a textblock:
      test.assert(diagram.nodes.first().actualBounds.width > 101);
      test.assert(diagram.nodes.first().actualBounds.height > 51);
      test.assert(diagram.nodes.first().findMainElement() instanceof go.Shape);
    }
  ));

  // visible :
    var visibles = new TestCollection('Visible');
    geom.add(visibles);

    visibles.add(new Test('move node with visible link', null,
      function(test) {
        var d = test.diagram;
        d.reset();
        d.startTransaction("init");
        d.nodeTemplate =
          $(go.Node,
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Panel, "Auto",
              $(go.Shape, { fill: "white" }),
              $(go.TextBlock,
                { margin: 6 },
                new go.Binding("text", "key"))));
        d.model.nodeDataArray = [{ key: "Alpha", loc: "0 0" }, { key: "Beta", loc: "200 0" }];
        d.model.linkDataArray = [{ from: "Alpha", to: "Beta" }];
        d.commitTransaction("init");
      },
      function(test) {
        var d = test.diagram;
        d.startTransaction("move");
        var nodeA = d.findNodeForKey("Alpha");
        var nodeB = d.findNodeForKey("Beta");
        test.assert(nodeA.location.equals(new go.Point(0, 0)));
        test.assert(nodeB.location.equals(new go.Point(200, 0)));
        var link = d.findLinkForData(d.model.linkDataArray[0]);
        var pathbounds = link.geometry.bounds;
        test.assert(pathbounds.width > 130, "link route should extend from Alpha to Beta");
        test.assert(pathbounds.height < 10, "link route should be horizontal");
        nodeB.location = new go.Point(200, 150);
        d.commitTransaction("move");
      },
      function(test) {
        var d = test.diagram;
        var nodeA = d.findNodeForKey("Alpha");
        var nodeB = d.findNodeForKey("Beta");
        test.assert(nodeA.location.equals(new go.Point(0, 0)));
        test.assert(nodeB.location.equals(new go.Point(200, 150)));
        var link = d.findLinkForData(d.model.linkDataArray[0]);
        var pathbounds = link.geometry.bounds;
        test.assert(pathbounds.width > 130, "link route should extend from Alpha to Beta");
        test.assert(pathbounds.height > 100, "link route should extend from Alpha to Beta");
      }
    ));

    visibles.add(new Test('move node with not visible link', null,
      function(test) {
        var d = test.diagram;
        d.reset();
        d.startTransaction("init");
        d.nodeTemplate =
          $(go.Node,
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Panel, "Auto",
              $(go.Shape, { fill: "white" }),
              $(go.TextBlock,
                { margin: 6 },
                new go.Binding("text", "key"))));
        d.model.nodeDataArray = [{ key: "Alpha", loc: "0 0" }, { key: "Beta", loc: "200 0" }];
        d.model.linkDataArray = [{ from: "Alpha", to: "Beta" }];
        d.commitTransaction("init");
      },
      function(test) {
        var d = test.diagram;
        d.startTransaction("hide");
        var nodeA = d.findNodeForKey("Alpha");
        var nodeB = d.findNodeForKey("Beta");
        test.assert(nodeA.location.equals(new go.Point(0, 0)));
        test.assert(nodeB.location.equals(new go.Point(200, 0)));
        var link = d.findLinkForData(d.model.linkDataArray[0]);
        var pathbounds = link.geometry.bounds;
        test.assert(pathbounds.width > 130, "link route should extend from Alpha to Beta (1)");
        test.assert(pathbounds.height < 10, "link route should be horizontal");
        link.visible = false;
        d.commitTransaction("hide");
        d.startTransaction("move");
        nodeB.location = new go.Point(200, 150);
        d.commitTransaction("move");
      },
      function(test) {
        var d = test.diagram;
        var nodeA = d.findNodeForKey("Alpha");
        var nodeB = d.findNodeForKey("Beta");
        test.assert(nodeA.location.equals(new go.Point(0, 0)));
        test.assert(nodeB.location.equals(new go.Point(200, 150)));
        var link = d.findLinkForData(d.model.linkDataArray[0]);
        d.startTransaction("show");
        link.visible = true;
        d.commitTransaction("show");
        var pathbounds = link.geometry.bounds;
        test.assert(pathbounds.width > 130, "link route should extend from Alpha to Beta (2)");
        test.assert(pathbounds.height > 100, "link route should extend from Alpha to Beta (3)");
      }
    ));

  var brushes = new TestCollection("Brushes");
  geom.add(brushes);

  brushes.add(new Test("constructors", null,
      function(test) {
        var d = test.diagram;
        d.reset();
        d.startTransaction("stuff");
        var $ = go.GraphObject.make;
        d.add($(go.Node, "Auto", { angle: 30, rotatable: true },
                $(go.Shape, "Diamond", { strokeWidth: 5 }),
                $(go.TextBlock, "asdfghjkl;\nqwertyuiop\nzxcvbnm,.", { stroke: "white" })));
        d.commitTransaction("stuff");
      },
      function(test) {
        var d = test.diagram;
        d.startTransaction("stuff");
        var node = d.nodes.first();
        var shape = node.elt(0);

        node.background = new go.Brush("gray");
        var b = new go.Brush(go.Brush.Linear);
        b.addColorStop(0.0, "white");
        b.addColorStop(0.5, "lightgray");
        b.addColorStop(1.0, "black");
        node.background = b;

        var s = new go.Brush(go.Brush.Radial);
        s.addColorStop(1.0, "red");
        s.addColorStop(0.75, "orange");
        s.addColorStop(0.5, "yellow");
        s.addColorStop(0.25, "lightgreen");
        s.addColorStop(0.0, "white");
        shape.stroke = s;
        var f = new go.Brush(go.Brush.Linear);
        f.start = go.Spot.TopRight;
        f.end = go.Spot.BottomLeft;
        var cs = new go.Map(/*'number', 'string'*/);
        cs.add(1.0, "green");
        cs.add(0.5, "orange");
        cs.add(0.0, "blue");
        f.colorStops = cs;
        shape.fill = f;

        d.commitTransaction("stuff");
      }, null
    ));

    brushes.add(new Test("bad colors", null,
      function(test) {
        var d = test.diagram;
        d.reset();
        d.startTransaction("stuff");
        var $ = go.GraphObject.make;
        d.add($(go.Node, "Auto", { angle: 30, rotatable: true },
                $(go.Shape, "Diamond", { strokeWidth: 5 }),
                $(go.TextBlock, "asdfghjkl;\nqwertyuiop\nzxcvbnm,.", { stroke: "white" })));
        d.commitTransaction("stuff");
      },
      function(test) {
        var d = test.diagram;
        d.startTransaction("stuff");
        var node = d.nodes.first();

        try {
          node.background = "BADCOLOR";
          if (go.Debug) test.assert(true, "should have detected that 'BADCOLOR' is not a valid CSS color string");
        } catch (ex) {
        }

        try {
          var bad = new go.Brush("BADCOLOR");
          if (go.Debug) test.assert(true, "should have detected that 'BADCOLOR' is not a valid CSS color string");
        } catch (ex) {
        }

          var b = new go.Brush(go.Brush.Linear);
          try {
            b.addColorStop(0.0, "");
            if (go.Debug) test.assert(true, "should have detected that '' is not valid CSS color strings");
          } catch (ex) {
          }
          try {
            b.addColorStop(0.5, "#XYZ");
            if (go.Debug) test.assert(true, "should have detected that '#XYZ' is not valid CSS color strings");
          } catch (ex) {
          }
          try {
            b.addColorStop(1.0, "rgba(1234,0,0,4)");
            if (go.Debug) test.assert(true, "should have detected that 'rgba(1234,0,0,4)' is not valid CSS color strings");
          } catch (ex) {
          }

        d.commitTransaction("stuff");
      }, null
    ));


    geom.add(new Test('Custom geometryString resize', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();
        diagram.undoManager.isEnabled = true;

        var geometryString = 'F M81.039,41.02c-0.341-2.899-1.448-5.562-3.115-7.779l-7.779,7.779H81.039 z M66.917,14.77v7.598c4.154,0.391,7.953,2.009,11.028,4.489l4.941-4.941l3.182,3.182l-4.946,4.946 c2.46,3.068,4.062,6.848,4.441,10.977h6.854v4.5h-6.928c-0.492,3.91-2.082,7.483-4.453,10.401l5.01,5.01l-3.182,3.182l-5.026-5.026 c-3.056,2.432-6.814,4.018-10.921,4.403v6.78h-4.5v-6.844c-3.879-0.475-7.428-2.024-10.338-4.34l-5.005,5.004l-3.182-3.182 l4.988-4.988c-2.37-2.918-3.961-6.49-4.452-10.4h-6.012v-4.5h5.937c0.38-4.129,1.981-7.908,4.441-10.977l-4.924-4.924l3.182-3.182 l4.919,4.919c2.931-2.363,6.519-3.945,10.445-4.427v-7.66H66.917L66.917,14.77z M66.917,26.893v10.991l7.83-7.83 C72.519,28.368,69.839,27.244,66.917,26.893z M66.917,48.166v10.799c2.874-0.345,5.515-1.438,7.721-3.078L66.917,48.166z M62.417,58.885V48.749l-7.138,7.137C57.335,57.415,59.768,58.469,62.417,58.885z M62.417,37.302V26.974 c-2.695,0.423-5.169,1.507-7.248,3.081L62.417,37.302z M70.635,45.52l7.206,7.207c1.58-2.065,2.672-4.524,3.104-7.207H70.635 L70.635,45.52z M48.878,41.02H59.77l-7.777-7.778C50.327,35.459,49.219,38.121,48.878,41.02L48.878,41.02z M59.281,45.52H48.972 c0.432,2.682,1.523,5.141,3.103,7.206L59.281,45.52z M81.039,41.02c-0.341-2.899-1.448-5.562-3.115-7.779l-7.779,7.779H81.039z M66.917,14.77v7.598 c4.154,0.391,7.953,2.009,11.028,4.489l4.941-4.941l3.182,3.182l-4.946,4.946c2.46,3.068,4.062,6.848,4.441,10.977h6.854v4.5 h-6.928c-0.492,3.91-2.082,7.483-4.453,10.401l5.01,5.01l-3.182,3.182l-5.026-5.026c-3.056,2.432-6.814,4.018-10.921,4.403v6.78 h-4.5v-6.844c-3.879-0.475-7.428-2.024-10.338-4.34l-5.005,5.004l-3.182-3.182l4.988-4.988c-2.37-2.918-3.961-6.49-4.452-10.4 h-6.012v-4.5h5.937c0.38-4.129,1.981-7.908,4.441-10.977l-4.924-4.924l3.182-3.182l4.919,4.919 c2.931-2.363,6.519-3.945,10.445-4.427v-7.66H66.917L66.917,14.77z M66.917,26.893v10.991l7.83-7.83 C72.519,28.368,69.839,27.244,66.917,26.893z M66.917,48.166v10.799c2.874-0.345,5.515-1.438,7.721-3.078L66.917,48.166z M62.417,58.885V48.749l-7.138,7.137C57.335,57.415,59.768,58.469,62.417,58.885z M62.417,37.302V26.974 c-2.695,0.423-5.169,1.507-7.248,3.081L62.417,37.302z M70.635,45.52l7.206,7.207c1.58-2.065,2.672-4.524,3.104-7.207H70.635 L70.635,45.52z M48.878,41.02H59.77l-7.777-7.778C50.327,35.459,49.219,38.121,48.878,41.02L48.878,41.02z M59.281,45.52H48.972 c0.432,2.682,1.523,5.141,3.103,7.206L59.281,45.52z';
        var $ = go.GraphObject.make;  // for conciseness in defining templates

        diagram.nodeTemplate =
          $(go.Node, "Vertical",
            { resizable: true, resizeObjectName: 'shape'},
              $(go.Shape, {
                name: 'shape',
                stroke: 'black',
                fill: 'tomato',
                geometryString: geometryString
              })
          );

        diagram.model = new go.GraphLinksModel(
        [
          {
            "key": "Alpha",
            "color": "lightblue",
            "loc": "209 -151"
          } ], []);


      }, // END SETUP
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

        var a = diagram.nodes.first();
        var b = diagram.nodes.first().findObject('shape');

        test.assert(a.actualBounds.width > 55);
        diagram.startTransaction();
        diagram.nodes.first().findObject('shape').width = 10;
        diagram.commitTransaction();

        test.assert(a.actualBounds.width === 11);

        // Make sure this resets the width to the natural object size (about 55)
        diagram.startTransaction();
        diagram.nodes.first().findObject('shape').width = NaN;
        diagram.commitTransaction();

        test.assert(a.actualBounds.width > 55);

        diagram.undoManager.undo();
        test.assert(a.actualBounds.width === 11);
        diagram.undoManager.undo();
        test.assert(a.actualBounds.width > 55);
        diagram.undoManager.redo();
        test.assert(a.actualBounds.width === 11);
        diagram.undoManager.redo();
        test.assert(a.actualBounds.width > 55);

      }, // END TEST
      null
    ));


  var patterns = new TestCollection('patterns');
  geom.add(patterns);

  patterns.add(new Test('pathPattern', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node,
          $(go.Shape, "Circle",
            { desiredSize: new go.Size(2, 2), fill: "transparent", strokeWidth: 0, portId: "" },
            new go.Binding("figure"))
        );

      diagram.linkTemplate =
        $(go.Link, go.Link.Bezier,  // slightly curved, by default
          { reshapable: true },  // users can reshape the link route
          $(go.Shape,  // the link's path shape
            {
              stroke: "transparent",
              pathPattern: $(go.Shape,
                             { // this shape is drawn repeatedly along the path
                               geometryString: "M0 3 L1 0 3 6 4 3 M0 9 L1 6 3 12 4 9",
                               fill: "transparent",
                               stroke: "blue",
                               strokeCap: "square"
                             })
            }),
          $(go.Shape,  // the "to" arrowhead
            { toArrow: "OpenTriangle", fill: null, scale: 1.2, stroke: "blue" })
        );

      diagram.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1 },
            { key: 2 }
          ],
          linkDataArray: [
            { from: 1, to: 2 }
          ]
        });
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var d = diagram;

      scanImageData(diagram.makeImageData({ scale: 1.0 }),
        function(counts) {
          test.assert(Array.isArray(counts), "scanImageData hasn't returned an Array yet");
          var w = counts[4];
          var h = counts[5];
          var total = w * h;
          test.assert(counts[0] / total < 0.01 && counts[1] / total < 0.01, "too much red or green in rendered image, total: " + total + " counts: " + counts.join(", ").toString());
          test.assert(counts[2] / total > 0.45, "not enough blue in rendered image, total: " + total + " counts: " + counts.join(", ").toString());
        });
    } // END TEST
  ));

  var BlueRedCanvas = document.createElement("canvas");
  BlueRedCanvas.width = 20;
  BlueRedCanvas.height = 100;
  var ctx = BlueRedCanvas.getContext("2d");
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, 20, 30);
  ctx.fillStyle = "red";  // red will show if the Link's curve is too great
  ctx.fillRect(0, 30, 20, 70);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 70, 20, 100);

  patterns.add(new Test('Pattern Brush', null,
    function(test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
        $(go.Node,
          $(go.Shape, "Circle",
            { desiredSize: new go.Size(2, 2), fill: "transparent", strokeWidth: 0, portId: "" },
            new go.Binding("figure"))
        );

      diagram.linkTemplate =
        $(go.Link, go.Link.Bezier,  // slightly curved, by default
          { reshapable: true },  // users can reshape the link route
          $(go.Shape,  // the link's path shape
            {
              stroke: $(go.Brush, "Pattern", { pattern: BlueRedCanvas }), strokeWidth: 10
            })
        );

      diagram.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1 },
            { key: 2 }
          ],
          linkDataArray: [
            { from: 1, to: 2 }
          ]
        });
    }, // END SETUP
    function(test) {
      var diagram = test.diagram;
      var d = diagram;

      scanImageData(diagram.makeImageData({ scale: 1.0 }),
        function(counts) {
          test.assert(Array.isArray(counts), "scanImageData hasn't returned an Array yet");
          var w = counts[4];
          var h = counts[5];
          var total = w * h;
          test.assert(counts[0] / total < 0.01 && counts[1] / total < 0.01, "too much red or green in rendered image, total: " + total + " counts: " + counts.join(", ").toString());
          test.assert(counts[2] / total > 0.4, "not enough blue in rendered image, total: " + total + " counts: " + counts.join(", ").toString());
        });
    } // END TEST
  ));

  function scanImageData(str, callback) {
    var img = new Image();
    document.body.appendChild(img);
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var arr = data.data;
      var counts = [0, 0, 0, 0, data.width, data.height, arr.length];
      for (var j = 0; j < data.height; j++) {
        for (var i = 0; i < data.width; i++) {
          var c = (j * data.width + i) * 4;
          for (var k = 0; k < 4; k++) {
            if (arr[c + k] !== 0) counts[k]++;
          }
        }
      }

      document.body.removeChild(img);

      callback(counts);
    }
    img.src = str;
  }

  var shapeGeometry = new TestCollection('shapeGeometry');
  geom.add(shapeGeometry);

    shapeGeometry.add(new Test('Shape geometry resize', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();

        d.nodeTemplate =
          $(go.Node,
            $(go.Shape,
            {
              geometryString: "F M0 140 L60 0 L100 80 L160 0 L200 140z",
              strokeWidth: 0,
              fill: 'lightblue'
            })
          );

        d.model = new go.GraphLinksModel([{ key: "Alpha", color: "lightblue" } ], []);
      }, // END SETUP
      function (test) {}, // END TEST
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

        var shape = d.nodes.first().elt(0);
        d.startTransaction();
        d.commitTransaction();
        var g = shape.geometry;
        test.assert(g.bounds.toString() === "Rect(0,0,200,140)");

        d.startTransaction();
        shape.width = 100;
        d.commitTransaction();
        var g = shape.geometry;
        window.g = g;
        // The geometry should be halved, width wise
        //                      old: 'F M0 140 L60 0 L100 80 L160 0 L200 140z'
        test.assert(g.toString() === 'F M0 140 L30 0 L50 80 L80 0 L100 140z');
        test.assert(g.bounds.toString() === "Rect(0,0,100,140)");
        var g2 = g.copy();
        var fig = g2.figures.elt(0);

        test.assert(fig.segments.elt(1).endX === 50);
        test.assert(fig.segments.elt(1).endY === 80);

        fig.segments.elt(1).endY = 10;
        //                      old: 'F M0 140 L30 0 L50 80 L80 0 L100 140z'
        test.assert(g2.toString() === 'F M0 140 L30 0 L50 10 L80 0 L100 140z');
        test.assert(g2.bounds.toString() === "Rect(0,0,100,140)");

        d.startTransaction();
        shape.geometry = g2;
        d.commitTransaction();

        // Nothing should change:
        test.assert(shape.geometry.toString() === 'F M0 140 L30 0 L50 10 L80 0 L100 140z');
        test.assert(shape.geometry.bounds.toString() === "Rect(0,0,100,140)");

        d.startTransaction();
        shape.width = NaN;
        d.commitTransaction();

        // Nothing should change:
        test.assert(shape.geometry.toString() === 'F M0 140 L30 0 L50 10 L80 0 L100 140z');
        test.assert(shape.geometry.bounds.toString() === "Rect(0,0,100,140)");

      } // END CHECK
    ));

})();


/*

    shapeGeometry.add(new Test('NEW TEST NAME', null,
      function (test) {
        var diagram = test.diagram;
        var d = diagram;
        diagram.reset();

      }, // END SETUP
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

      }, // END TEST
      function (test) {
        var diagram = test.diagram;
        var d = diagram;

      } // END CHECK
    ));

*/