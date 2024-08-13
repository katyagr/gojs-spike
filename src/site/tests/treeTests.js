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
  // #region Setups
  function Common2Setup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 8 }
    ];
    test.diagram.model = m;
  };

  function ArrangementSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1", x: 0, y: 0 },
      { key: 2, text: "n2" },
      { key: 3, text: "n3", x: 100, y: 100 },
      { key: 4, text: "n4" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 3, to: 4 }
    ];
    test.diagram.model = m;
  };

  function CommentMarginSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5", category: "Comment" },
      { key: 6, text: "n6", category: "Comment" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 5 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 6 }
    ];
    test.diagram.model = m;
  };

  function CommentSpacingSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3", category: "Comment" },
      { key: 4, text: "n4", category: "Comment" },
      { key: 5, text: "n5", category: "Comment" },
      { key: 6, text: "n6", category: "Comment" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 }
    ];
    test.diagram.model = m;
  };

  function CommentCoverageSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5", category: "Comment" },
      { key: 6, text: "n6", category: "Comment" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 5 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 6 }
    ];
    test.diagram.model = m;
  };

  function CommonSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 }
    ];
    test.diagram.model = m;
  };

  function PortSpotsSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 }
    ];
    test.diagram.model = m;
  };

  function SortSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 4, text: "n4" },
      { key: 3, text: "n3" },
      { key: 7, text: "n7" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 4 },
      { from: 1, to: 3 },
      { from: 2, to: 7 },
      { from: 2, to: 5 },
      { from: 2, to: 6 }
    ];
    test.diagram.model = m;
  };

  function StyleSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 }
    ];
    test.diagram.model = m;
  };

  function CycleSetup(test) {
    test.diagram.layout = new go.TreeLayout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 8 },
      { from: 8, to: 1 }
    ];
    test.diagram.model = m;
  };

  function RingSetup(test) {
    test.diagram.layout = new go.TreeLayout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 3 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 5 }
    ];
    test.diagram.model = m;
  };

  function DAGSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 8 },
      { from: 8, to: 5 }
    ];
    test.diagram.model = m;
  };

  function SourceSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 2, to: 1 },
      { from: 3, to: 1 },
      { from: 4, to: 2 },
      { from: 5, to: 2 },
      { from: 6, to: 3 },
      { from: 7, to: 5 },
      { from: 8, to: 6 }
    ];
    test.diagram.model = m;
  };

  function BezierSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2, category: "Bezier" },
      { from: 1, to: 3, category: "Bezier" },
      { from: 2, to: 4, category: "Bezier" },
      { from: 2, to: 5, category: "Bezier" },
      { from: 2, to: 6, category: "Bezier" }
    ];
    test.diagram.model = m;
  };

  function OrthogonalSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5" },
      { key: 6, text: "n6" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2, category: "Orthogonal" },
      { from: 1, to: 3, category: "Orthogonal" },
      { from: 2, to: 4, category: "Orthogonal" },
      { from: 2, to: 5, category: "Orthogonal" },
      { from: 2, to: 6, category: "Orthogonal" }
    ];
    test.diagram.model = m;
  };

  function BigParentSetup(test) {
    test.diagram.layout = new go.Layout();
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3" },
      { key: 4, text: "n4" },
      { key: 5, text: "n5", category: "2" },
      { key: 6, text: "n6" },
      { key: 7, text: "n7" },
      { key: 8, text: "n8" }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 6, to: 8 }
    ];
    test.diagram.model = m;
  };
  // #endregion

  // #region Multiple Properties Tests
  function CommonRun(test, compaction, angle, alignment, breadthLimit) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.compaction = compaction;
    layout.alternateCompaction = compaction;
    layout.angle = angle;
    layout.alternateAngle = angle;
    layout.alignment = alignment;
    layout.alternateAlignment = alignment;
    layout.breadthLimit = breadthLimit;
    layout.alternateBreadthLimit = breadthLimit;
    layout.doLayout(test.diagram);
  };

  // #region Block Compaction Checks
  // #region Angle 0
  function B0S1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 10),
      new go.Point(325, 10),
      new go.Point(140, 20),
      new go.Point(185, 20),
      new go.Point(230, 20)
    ];
    CheckNodes(points, test);
  };
  function B0S0Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(70, 40),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80)
    ];
    CheckNodes(points, test);
  };
  function B0CC1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(325, 0),
      new go.Point(140, 0),
      new go.Point(185, 0),
      new go.Point(230, 0)
    ];
    CheckNodes(points, test);
  };
  function B0CC0Check(test) {
    var points = [
      new go.Point(0, 60),
      new go.Point(70, 40),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80)
    ];
    CheckNodes(points, test);
  };
  function B0CSCheck(test) {
    var points = [
      new go.Point(0, 40),
      new go.Point(70, 40),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80)
    ];
    CheckNodes(points, test);
  };
  function B0ECheck(test) {
    var points = [
      new go.Point(0, 120),
      new go.Point(70, 80),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80)
    ];
    CheckNodes(points, test);
  };
  function B0BCheck(test) {
    var points = [
      new go.Point(0, 60),
      new go.Point(70, 20),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(185, 20)
    ];
    CheckNodes(points, test);
  };
  function B0BBCheck(test) {
    var points = [
      new go.Point(0, 135),
      new go.Point(90, 115),
      new go.Point(70, 155),
      new go.Point(70, 45),
      new go.Point(110, 45),
      new go.Point(90, 0)
    ];
    CheckNodes(points, test);
  };
  function B0TLBCheck(test) {
    var points = [
      new go.Point(0, 40),
      new go.Point(70, 20),
      new go.Point(275, 20),
      new go.Point(140, 0),
      new go.Point(185, 0),
      new go.Point(230, 0)
    ];
    CheckNodes(points, test);
  };
  function B0BRBCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 20),
      new go.Point(275, 20),
      new go.Point(140, 40),
      new go.Point(185, 40),
      new go.Point(230, 40)
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 90
  function B90S1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(10, 70),
      new go.Point(10, 325),
      new go.Point(20, 140),
      new go.Point(20, 185),
      new go.Point(20, 230)
    ];
    CheckNodes(points, test);
  };
  function B90S0Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 70),
      new go.Point(40, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140)
    ];
    CheckNodes(points, test);
  };
  function B90CC1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 70),
      new go.Point(0, 325),
      new go.Point(0, 140),
      new go.Point(0, 185),
      new go.Point(0, 230)
    ];
    CheckNodes(points, test);
  };
  function B90CC0Check(test) {
    var points = [
      new go.Point(60, 0),
      new go.Point(40, 70),
      new go.Point(80, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140)
    ];
    CheckNodes(points, test);
  };
  function B90CSCheck(test) {
    var points = [
      new go.Point(40, 0),
      new go.Point(40, 70),
      new go.Point(80, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140)
    ];
    CheckNodes(points, test);
  };
  function B90ECheck(test) {
    var points = [
      new go.Point(120, 0),
      new go.Point(80, 70),
      new go.Point(120, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140)
    ];
    CheckNodes(points, test);
  };
  function B90BCheck(test) {
    var points = [
      new go.Point(60, 0),
      new go.Point(20, 70),
      new go.Point(80, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(20, 185)
    ];
    CheckNodes(points, test);
  };
  function B90BBCheck(test) {
    var points = [
      new go.Point(135, 0),
      new go.Point(115, 90),
      new go.Point(155, 70),
      new go.Point(45, 70),
      new go.Point(45, 110),
      new go.Point(0, 90)
    ];
    CheckNodes(points, test);
  };
  function B90TLBCheck(test) {
    var points = [
      new go.Point(40, 0),
      new go.Point(20, 70),
      new go.Point(20, 275),
      new go.Point(0, 140),
      new go.Point(0, 185),
      new go.Point(0, 230)
    ];
    CheckNodes(points, test);
  };
  function B90BRBCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(20, 70),
      new go.Point(20, 275),
      new go.Point(40, 140),
      new go.Point(40, 185),
      new go.Point(40, 230)
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 180
  function B180S1Check(test) {
    var points = [
      new go.Point(375, 0),
      new go.Point(305, 10),
      new go.Point(50, 10),
      new go.Point(235, 20),
      new go.Point(190, 20),
      new go.Point(145, 20),
    ];
    CheckNodes(points, test);
  };
  function B180S0Check(test) {
    var points = [
      new go.Point(140, 0),
      new go.Point(70, 0),
      new go.Point(70, 40),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function B180CC1Check(test) {
    var points = [
      new go.Point(375, 0),
      new go.Point(305, 0),
      new go.Point(50, 0),
      new go.Point(235, 0),
      new go.Point(190, 0),
      new go.Point(145, 0),
    ];
    CheckNodes(points, test);
  };
  function B180CC0Check(test) {
    var points = [
      new go.Point(140, 60),
      new go.Point(70, 40),
      new go.Point(70, 80),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function B180CSCheck(test) {
    var points = [
      new go.Point(140, 40),
      new go.Point(70, 40),
      new go.Point(70, 80),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function B180ECheck(test) {
    var points = [
      new go.Point(140, 120),
      new go.Point(70, 80),
      new go.Point(70, 120),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function B180BCheck(test) {
    var points = [
      new go.Point(185, 60),
      new go.Point(115, 20),
      new go.Point(115, 80),
      new go.Point(45, 0),
      new go.Point(45, 40),
      new go.Point(0, 20),
    ];
    CheckNodes(points, test);
  };
  function B180BBCheck(test) {
    var points = [
      new go.Point(110, 135),
      new go.Point(20, 115),
      new go.Point(40, 155),
      new go.Point(0, 45),
      new go.Point(40, 45),
      new go.Point(20, 0),
    ];
    CheckNodes(points, test);
  };
  function B180TLBCheck(test) {
    var points = [
      new go.Point(275, 40),
      new go.Point(205, 20),
      new go.Point(0, 20),
      new go.Point(135, 0),
      new go.Point(90, 0),
      new go.Point(45, 0),
    ];
    CheckNodes(points, test);
  };
  function B180BRBCheck(test) {
    var points = [
      new go.Point(275, 0),
      new go.Point(205, 20),
      new go.Point(0, 20),
      new go.Point(135, 40),
      new go.Point(90, 40),
      new go.Point(45, 40),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 270
  function B270S1Check(test) {
    var points = [
      new go.Point(0, 375),
      new go.Point(10, 305),
      new go.Point(10, 50),
      new go.Point(20, 235),
      new go.Point(20, 190),
      new go.Point(20, 145),
    ];
    CheckNodes(points, test);
  };
  function B270S0Check(test) {
    var points = [
      new go.Point(0, 140),
      new go.Point(0, 70),
      new go.Point(40, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function B270CC1Check(test) {
    var points = [
      new go.Point(0, 375),
      new go.Point(0, 305),
      new go.Point(0, 50),
      new go.Point(0, 235),
      new go.Point(0, 190),
      new go.Point(0, 145),
    ];
    CheckNodes(points, test);
  };
  function B270CC0Check(test) {
    var points = [
      new go.Point(60, 140),
      new go.Point(40, 70),
      new go.Point(80, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function B270CSCheck(test) {
    var points = [
      new go.Point(40, 140),
      new go.Point(40, 70),
      new go.Point(80, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function B270ECheck(test) {
    var points = [
      new go.Point(120, 140),
      new go.Point(80, 70),
      new go.Point(120, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function B270BCheck(test) {
    var points = [
      new go.Point(60, 185),
      new go.Point(20, 115),
      new go.Point(80, 115),
      new go.Point(0, 45),
      new go.Point(40, 45),
      new go.Point(20, 0),
    ];
    CheckNodes(points, test);
  };
  function B270BBCheck(test) {
    var points = [
      new go.Point(135, 110),
      new go.Point(115, 20),
      new go.Point(155, 40),
      new go.Point(45, 0),
      new go.Point(45, 40),
      new go.Point(0, 20),
    ];
    CheckNodes(points, test);
  };
  function B270TLBCheck(test) {
    var points = [
      new go.Point(40, 275),
      new go.Point(20, 205),
      new go.Point(20, 0),
      new go.Point(0, 135),
      new go.Point(0, 90),
      new go.Point(0, 45),
    ];
    CheckNodes(points, test);
  };
  function B270BRBCheck(test) {
    var points = [
      new go.Point(0, 275),
      new go.Point(20, 205),
      new go.Point(20, 0),
      new go.Point(40, 135),
      new go.Point(40, 90),
      new go.Point(40, 45),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #endregion
  // #region None Compaction Checks
  // #region Angle 0
  function N0S1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 10),
      new go.Point(325, 10),
      new go.Point(140, 20),
      new go.Point(185, 20),
      new go.Point(230, 20),
    ];
    CheckNodes(points, test);
  };
  function N0S0Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
    ];
    CheckNodes(points, test);
  };
  function N0CC1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(325, 0),
      new go.Point(140, 0),
      new go.Point(185, 0),
      new go.Point(230, 0),
    ];
    CheckNodes(points, test);
  };
  function N0CC0Check(test) {
    var points = [
      new go.Point(0, 80),
      new go.Point(70, 40),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
    ];
    CheckNodes(points, test);
  };
  function N0CSCheck(test) {
    var points = [
      new go.Point(0, 60),
      new go.Point(70, 40),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
    ];
    CheckNodes(points, test);
  };
  function N0ECheck(test) {
    var points = [
      new go.Point(0, 120),
      new go.Point(70, 80),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
    ];
    CheckNodes(points, test);
  };
  function N0BCheck(test) {
    var points = [
      new go.Point(0, 60),
      new go.Point(70, 20),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(185, 20),
    ];
    CheckNodes(points, test);
  };
  function N0BBCheck(test) {
    var points = [
      new go.Point(0, 135),
      new go.Point(90, 115),
      new go.Point(70, 155),
      new go.Point(70, 45),
      new go.Point(110, 45),
      new go.Point(90, 0),
    ];
    CheckNodes(points, test);
  };
  function N0TLBCheck(test) {
    var points = [
      new go.Point(0, 40),
      new go.Point(70, 20),
      new go.Point(275, 20),
      new go.Point(140, 0),
      new go.Point(185, 0),
      new go.Point(230, 0),
    ];
    CheckNodes(points, test);
  };
  function N0BRBCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 20),
      new go.Point(275, 20),
      new go.Point(140, 40),
      new go.Point(185, 40),
      new go.Point(230, 40),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 90
  function N90S1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(10, 70),
      new go.Point(10, 325),
      new go.Point(20, 140),
      new go.Point(20, 185),
      new go.Point(20, 230),
    ];
    CheckNodes(points, test);
  };
  function N90S0Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 70),
      new go.Point(120, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140),
    ];
    CheckNodes(points, test);
  };
  function N90CC1Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 70),
      new go.Point(0, 325),
      new go.Point(0, 140),
      new go.Point(0, 185),
      new go.Point(0, 230),
    ];
    CheckNodes(points, test);
  };
  function N90CC0Check(test) {
    var points = [
      new go.Point(80, 0),
      new go.Point(40, 70),
      new go.Point(120, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140),
    ];
    CheckNodes(points, test);
  };
  function N90CSCheck(test) {
    var points = [
      new go.Point(60, 0),
      new go.Point(40, 70),
      new go.Point(120, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140),
    ];
    CheckNodes(points, test);
  };
  function N90ECheck(test) {
    var points = [
      new go.Point(120, 0),
      new go.Point(80, 70),
      new go.Point(120, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(80, 140),
    ];
    CheckNodes(points, test);
  };
  function N90BCheck(test) {
    var points = [
      new go.Point(60, 0),
      new go.Point(20, 70),
      new go.Point(80, 70),
      new go.Point(0, 140),
      new go.Point(40, 140),
      new go.Point(20, 185),
    ];
    CheckNodes(points, test);
  };
  function N90BBCheck(test) {
    var points = [
      new go.Point(135, 0),
      new go.Point(115, 90),
      new go.Point(155, 70),
      new go.Point(45, 70),
      new go.Point(45, 110),
      new go.Point(0, 90),
    ];
    CheckNodes(points, test);
  };
  function N90TLBCheck(test) {
    var points = [
      new go.Point(40, 0),
      new go.Point(20, 70),
      new go.Point(20, 275),
      new go.Point(0, 140),
      new go.Point(0, 185),
      new go.Point(0, 230),
    ];
    CheckNodes(points, test);
  };
  function N90BRBCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(20, 70),
      new go.Point(20, 275),
      new go.Point(40, 140),
      new go.Point(40, 185),
      new go.Point(40, 230),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 180
  function N180S1Check(test) {
    var points = [
      new go.Point(375, 0),
      new go.Point(305, 10),
      new go.Point(50, 10),
      new go.Point(235, 20),
      new go.Point(190, 20),
      new go.Point(145, 20),
    ];
    CheckNodes(points, test);
  };
  function N180S0Check(test) {
    var points = [
      new go.Point(140, 0),
      new go.Point(70, 0),
      new go.Point(70, 120),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function N180CC1Check(test) {
    var points = [
      new go.Point(375, 0),
      new go.Point(305, 0),
      new go.Point(50, 0),
      new go.Point(235, 0),
      new go.Point(190, 0),
      new go.Point(145, 0),
    ];
    CheckNodes(points, test);
  };
  function N180CC0Check(test) {
    var points = [
      new go.Point(140, 80),
      new go.Point(70, 40),
      new go.Point(70, 120),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function N180CSCheck(test) {
    var points = [
      new go.Point(140, 60),
      new go.Point(70, 40),
      new go.Point(70, 120),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function N180ECheck(test) {
    var points = [
      new go.Point(140, 120),
      new go.Point(70, 80),
      new go.Point(70, 120),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
    ];
    CheckNodes(points, test);
  };
  function N180BCheck(test) {
    var points = [
      new go.Point(185, 60),
      new go.Point(115, 20),
      new go.Point(115, 80),
      new go.Point(45, 0),
      new go.Point(45, 40),
      new go.Point(0, 20),
    ];
    CheckNodes(points, test);
  };
  function N180BBCheck(test) {
    var points = [
      new go.Point(110, 135),
      new go.Point(20, 115),
      new go.Point(40, 155),
      new go.Point(0, 45),
      new go.Point(40, 45),
      new go.Point(20, 0),
    ];
    CheckNodes(points, test);
  };
  function N180TLBCheck(test) {
    var points = [
      new go.Point(275, 40),
      new go.Point(205, 20),
      new go.Point(0, 20),
      new go.Point(135, 0),
      new go.Point(90, 0),
      new go.Point(45, 0),
    ];
    CheckNodes(points, test);
  };
  function N180BRBCheck(test) {
    var points = [
      new go.Point(275, 0),
      new go.Point(205, 20),
      new go.Point(0, 20),
      new go.Point(135, 40),
      new go.Point(90, 40),
      new go.Point(45, 40),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #region Angle 270
  function N270S1Check(test) {
    var points = [
      new go.Point(0, 375),
      new go.Point(10, 305),
      new go.Point(10, 50),
      new go.Point(20, 235),
      new go.Point(20, 190),
      new go.Point(20, 145),
    ];
    CheckNodes(points, test);
  };
  function N270S0Check(test) {
    var points = [
      new go.Point(0, 140),
      new go.Point(0, 70),
      new go.Point(120, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function N270CC1Check(test) {
    var points = [
      new go.Point(0, 375),
      new go.Point(0, 305),
      new go.Point(0, 50),
      new go.Point(0, 235),
      new go.Point(0, 190),
      new go.Point(0, 145),
    ];
    CheckNodes(points, test);
  };
  function N270CC0Check(test) {
    var points = [
      new go.Point(80, 140),
      new go.Point(40, 70),
      new go.Point(120, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function N270CSCheck(test) {
    var points = [
      new go.Point(60, 140),
      new go.Point(40, 70),
      new go.Point(120, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function N270ECheck(test) {
    var points = [
      new go.Point(120, 140),
      new go.Point(80, 70),
      new go.Point(120, 70),
      new go.Point(0, 0),
      new go.Point(40, 0),
      new go.Point(80, 0),
    ];
    CheckNodes(points, test);
  };
  function N270BCheck(test) {
    var points = [
      new go.Point(60, 185),
      new go.Point(20, 115),
      new go.Point(80, 115),
      new go.Point(0, 45),
      new go.Point(40, 45),
      new go.Point(20, 0),
    ];
    CheckNodes(points, test);
  };
  function N270BBCheck(test) {
    var points = [
      new go.Point(135, 110),
      new go.Point(115, 20),
      new go.Point(155, 40),
      new go.Point(45, 0),
      new go.Point(45, 40),
      new go.Point(0, 20),
    ];
    CheckNodes(points, test);
  };
  function N270TLBCheck(test) {
    var points = [
      new go.Point(40, 275),
      new go.Point(20, 205),
      new go.Point(20, 0),
      new go.Point(0, 135),
      new go.Point(0, 90),
      new go.Point(0, 45),
    ];
    CheckNodes(points, test);
  };
  function N270BRBCheck(test) {
    var points = [
      new go.Point(0, 275),
      new go.Point(20, 205),
      new go.Point(20, 0),
      new go.Point(40, 135),
      new go.Point(40, 90),
      new go.Point(40, 45),
    ];
    CheckNodes(points, test);
  };
  // #endregion
  // #endregion
  // #endregion

  // #region Arrangement Tests
  function ArrangementFixedRootsRun(test) {
    var layout = new go.TreeLayout();
    layout.arrangement = go.TreeLayout.ArrangementFixedRoots;
    layout.doLayout(test.diagram);
  };

  function ArrangementHorizontalRun(test) {
    var layout = new go.TreeLayout();
    layout.arrangement = go.TreeLayout.ArrangementHorizontal;
    layout.doLayout(test.diagram);
  };

  function ArrangementVerticalRun(test) {
    var layout = new go.TreeLayout();
    layout.arrangement = go.TreeLayout.ArrangementVertical;
    layout.doLayout(test.diagram);
  };

  function ArrangementMoreSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.arrangement = go.TreeLayout.ArrangementVertical;
    layout.arrangementSpacing = new go.Size(40, 40);
    layout.doLayout(test.diagram);
  };

  function ArrangementFixedRootsCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(100, 100),
      new go.Point(170, 100)
    ];
    CheckNodes(points, test);
  };

  function ArrangementHorizontalCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(100, 0),
      new go.Point(170, 0)
    ];
    CheckNodes(points, test);
  };

  function ArrangementVerticalCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(0, 30),
      new go.Point(70, 30)
    ];
    CheckNodes(points, test);
  };

  function ArrangementMoreSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(0, 60),
      new go.Point(70, 60)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  // #region Comment Tests
  function CommentMarginRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.commentMargin = 40;
    layout.alternateCommentMargin = 40;
    layout.doLayout(test.diagram);
  };

  function NegativeCommentMarginRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.commentMargin = -40;
    layout.alternateCommentMargin = -40;
    layout.doLayout(test.diagram);
  };

  function CommentSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.commentSpacing = 40;
    layout.alternateCommentSpacing = 40;
    layout.doLayout(test.diagram);
  };

  function NegativeCommentSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.commentSpacing = -40;
    layout.alternateCommentSpacing = -40;
    layout.doLayout(test.diagram);
  };

  function NegDirPosMargRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 270;
    layout.doLayout(test.diagram);
  }

  function NegDirNegMargRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 270;
    layout.commentMargin = -25;
    layout.doLayout(test.diagram);
  }

  function CommentMarginCheck(test) {
    var points = [
      new go.Point(0, 20),
      new go.Point(70, 20),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(0, 80),
      new go.Point(200, 0)
    ];
    CheckNodes(points, test);
  };

  function NegativeCommentMarginCheck(test) {
    var points = [
      new go.Point(0, 20),
      new go.Point(70, 20),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(0, -40),
      new go.Point(80, 0)
    ];
    CheckNodes(points, test);
  };

  function CommentSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(130, 0),
      new go.Point(0, 40),
      new go.Point(60, 40),
      new go.Point(170, 0),
      new go.Point(170, 60)
    ];
    CheckNodes(points, test);
  };

  function NegativeCommentSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(130, 0),
      new go.Point(0, 40),
      new go.Point(-60, 40),
      new go.Point(170, 0),
      new go.Point(170, -60)
    ];
    CheckNodes(points, test);
  };

  function NegDirPosMargCheck(test) {
    var points = [
      new go.Point(20, 180),
      new go.Point(20, 110),
      new go.Point(0, 40),
      new go.Point(40, 40),
      new go.Point(-20, 110),
      new go.Point(0, 0)
    ];
    CheckNodes(points, test);
  }

  function NegDirNegMargCheck(test) {
    var points = [
      new go.Point(20, 185),
      new go.Point(20, 115),
      new go.Point(0, 45),
      new go.Point(40, 45),
      new go.Point(65, 115),
      new go.Point(0, 90)
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region NodeIndent Tests
  function NodeIndentRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alignment = go.TreeLayout.AlignmentStart;
    layout.alternateAlignment = go.TreeLayout.AlignmentStart;
    layout.nodeIndent = 30;
    layout.alternateNodeIndent = 30;
    layout.doLayout(test.diagram);
  };

  function NodeIndentPastParentRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alignment = go.TreeLayout.AlignmentStart;
    layout.alternateAlignment = go.TreeLayout.AlignmentStart;
    layout.nodeIndentPastParent = 1;
    layout.alternateNodeIndentPastParent = 1;
    layout.doLayout(test.diagram);
  };

  function NodeIndentCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 30),
      new go.Point(70, 110),
      new go.Point(140, 60),
      new go.Point(140, 100),
      new go.Point(140, 140),
      new go.Point(210, 130),
      new go.Point(210, 170)
    ];
    CheckNodes(points, test);
  };

  function NodeIndentPastParentCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 20),
      new go.Point(70, 100),
      new go.Point(140, 40),
      new go.Point(140, 80),
      new go.Point(140, 120),
      new go.Point(210, 100),
      new go.Point(210, 140)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  // #region PortSpots Tests
  function PortSpotsRun(test) {
    var layout = new go.TreeLayout();
    layout.portSpot = go.Spot.BottomCenter;
    layout.childPortSpot = go.Spot.TopCenter;
    layout.doLayout(test.diagram);
  };

  function SetsPortSpotsRun(test) {
    var layout = new go.TreeLayout();
    layout.setsPortSpot = false;
    layout.setsChildPortSpot = false;
    layout.doLayout(test.diagram);
  };

  function PortSpotsCheck(test) {
    var lpoints = [
      new go.Point(10, 20),
      new go.Point(10, 30),
      new go.Point(80, -10),
      new go.Point(80, 0)
    ];
    var lit = test.diagram.links;
    lit.next();
    var link = lit.value;
    test.assertLinkPoints(link, lpoints);
  };

  function SetsPortSpotsCheck(test) {
    var lit = test.diagram.links;
    lit.next();
    var link = lit.value;
    test.assert(link.fromSpot.equals(go.Spot.Default), 'portSpot is not default.');
    test.assert(link.toSpot.equals(go.Spot.Default), 'childPortSpot is not default.');
  };
  // #endregion

  // #region Roots Tests
  function RootsRun(test) {
    var layout = new go.TreeLayout();
    layout.doLayout(test.diagram);
  };

  function RootsCheck(test) {
    // how do we check roots when it is set to null after doLayout??
  };
  // #endregion

  // #region Row Tests
  function RowSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alignment = go.TreeLayout.AlignmentStart;
    layout.alternateAlignment = go.TreeLayout.AlignmentStart;
    layout.breadthLimit = 15;
    layout.alternateBreadthLimit = 15;
    layout.rowSpacing = 50;
    layout.alternateRowSpacing = 50;
    layout.doLayout(test.diagram);
  };

  function NegativeRowSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alignment = go.TreeLayout.AlignmentStart;
    layout.alternateAlignment = go.TreeLayout.AlignmentStart;
    layout.breadthLimit = 15;
    layout.alternateBreadthLimit = 15;
    layout.rowSpacing = -50;
    layout.alternateRowSpacing = -50;
    layout.doLayout(test.diagram);
  };

  function RowIndentRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alignment = go.TreeLayout.AlignmentStart;
    layout.alternateAlignment = go.TreeLayout.AlignmentStart;
    layout.breadthLimit = 15;
    layout.alternateBreadthLimit = 15;
    layout.rowIndent = 30;
    layout.alternateRowIndent = 30;
    layout.doLayout(test.diagram);
  };

  function RowSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 10),
      new go.Point(400, 10),
      new go.Point(140, 20),
      new go.Point(210, 20),
      new go.Point(470, 10),
      new go.Point(280, 20),
      new go.Point(540, 10)
    ];
    CheckNodes(points, test);
  };

  function NegativeRowSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 10),
      new go.Point(200, 10),
      new go.Point(140, 20),
      new go.Point(110, 20),
      new go.Point(270, 10),
      new go.Point(180, 20),
      new go.Point(340, 10)
    ];
    CheckNodes(points, test);
  };

  function RowIndentCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 30),
      new go.Point(350, 30),
      new go.Point(140, 60),
      new go.Point(185, 60),
      new go.Point(420, 30),
      new go.Point(255, 60),
      new go.Point(490, 30)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  // #region Sort Tests
  function Sort_ForwardsRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.sorting = go.TreeLayout.SortingForwards;
    layout.alternateSorting = go.TreeLayout.SortingForwards;
    layout.doLayout(test.diagram);
  };

  function Sort_ReverseRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.sorting = go.TreeLayout.SortingReverse;
    layout.alternateSorting = go.TreeLayout.SortingReverse;
    layout.doLayout(test.diagram);
  };

  function Sort_AscendingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.sorting = go.TreeLayout.SortingAscending;
    layout.alternateSorting = go.TreeLayout.SortingAscending;
    layout.doLayout(test.diagram);
  };

  function Sort_DescendingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.sorting = go.TreeLayout.SortingDescending;
    layout.alternateSorting = go.TreeLayout.SortingDescending;
    layout.doLayout(test.diagram);
  };

  function Sort_ForwardsCheck(test) {
    var points = [
      new go.Point(0, 80),
      new go.Point(70, 40),
      new go.Point(70, 120),
      new go.Point(70, 80),
      new go.Point(140, 40),
      new go.Point(140, 80),
      new go.Point(140, 0)
    ];
    CheckNodes(points, test);
  }

  function Sort_ReverseCheck(test) {
    var points = [
      new go.Point(0, 40),
      new go.Point(70, 80),
      new go.Point(70, 0),
      new go.Point(70, 40),
      new go.Point(140, 80),
      new go.Point(140, 40),
      new go.Point(140, 120)
    ];
    CheckNodes(points, test);
  }

  function Sort_AscendingCheck(test) {
    var points = [
      new go.Point(0, 80),
      new go.Point(70, 40),
      new go.Point(70, 80),
      new go.Point(70, 120),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80)
    ];
    CheckNodes(points, test);
  }

  function Sort_DescendingCheck(test) {
    var points = [
      new go.Point(0, 40),
      new go.Point(70, 80),
      new go.Point(70, 40),
      new go.Point(70, 0),
      new go.Point(140, 120),
      new go.Point(140, 80),
      new go.Point(140, 40)
    ];
    CheckNodes(points, test);
  }
  // #endregion

  // #region Spacing Tests
  function LayerSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.layerSpacing = 20;
    layout.alternateLayerSpacing = 20;
    layout.doLayout(test.diagram);
  };

  function NegativeLayerSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.layerSpacing = -20;
    layout.alternateLayerSpacing = -20;
    layout.doLayout(test.diagram);
  };

  function LayerSpacingParentOverlapRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.layerSpacingParentOverlap = 1;
    layout.alternateLayerSpacingParentOverlap = 1;
    layout.doLayout(test.diagram);
  };

  function NodeSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.nodeSpacing = 50;
    layout.alternateNodeSpacing = 50;
    layout.doLayout(test.diagram);
  };

  function NegativeNodeSpacingRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.nodeSpacing = -50;
    layout.alternateNodeSpacing = -50;
    layout.doLayout(test.diagram);
  };

  function LayerSpacingCheck(test) {
    var points = [
      new go.Point(0, 50),
      new go.Point(40, 20),
      new go.Point(40, 80),
      new go.Point(80, 0),
      new go.Point(80, 40),
      new go.Point(80, 80),
      new go.Point(120, 40),
      new go.Point(120, 80)
    ];
    CheckNodes(points, test);
  };

  function NegativeLayerSpacingCheck(test) {
    var points = [
      new go.Point(0, 50),
      new go.Point(0, 20),
      new go.Point(0, 80),
      new go.Point(0, 0),
      new go.Point(0, 40),
      new go.Point(0, 80),
      new go.Point(0, 40),
      new go.Point(0, 80)
    ];
    CheckNodes(points, test);
  };

  function LayerSpacingParentOverlapCheck(test) {
    var points = [
      new go.Point(0, 50),
      new go.Point(50, 20),
      new go.Point(50, 80),
      new go.Point(100, 0),
      new go.Point(100, 40),
      new go.Point(100, 80),
      new go.Point(150, 40),
      new go.Point(150, 80)
    ];
    CheckNodes(points, test);
  };

  function NodeSpacingCheck(test) {
    var points = [
      new go.Point(0, 87.5),
      new go.Point(70, 35),
      new go.Point(70, 140),
      new go.Point(140, 0),
      new go.Point(140, 70),
      new go.Point(140, 140),
      new go.Point(210, 70),
      new go.Point(210, 140)
    ];
    CheckNodes(points, test);
  };

  function NegativeNodeSpacingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 15),
      new go.Point(70, -15),
      new go.Point(140, 30),
      new go.Point(140, 0),
      new go.Point(140, -15),
      new go.Point(210, 0),
      new go.Point(210, -15)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  // #region Style Tests
  function StyleLayeredRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 0;
    layout.alternateAngle = 90;
    layout.treeStyle = go.TreeLayout.StyleLayered;
    layout.doLayout(test.diagram);
  };

  function StyleAlternatingRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 0;
    layout.alternateAngle = 90;
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.doLayout(test.diagram);
  };

  function StyleLastParentsRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 0;
    layout.alternateAngle = 90;
    layout.treeStyle = go.TreeLayout.StyleLastParents;
    layout.doLayout(test.diagram);
  };

  function StyleRootOnlyRun(test) {
    var layout = new go.TreeLayout();
    layout.angle = 0;
    layout.alternateAngle = 90;
    layout.treeStyle = go.TreeLayout.StyleRootOnly;
    layout.doLayout(test.diagram);
  };

  function StyleLayeredCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(140, 0),
      new go.Point(210, 0)
    ];
    CheckNodes(points, test);
  };

  function StyleAlternatingCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(70, 70),
      new go.Point(140, 70)
    ];
    CheckNodes(points, test);
  };

  function StyleLastParentsCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(140, 0),
      new go.Point(140, 70)
    ];
    CheckNodes(points, test);
  };

  function StyleRootOnlyCheck(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(70, 0),
      new go.Point(70, 70),
      new go.Point(70, 140)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  function LayerStyleSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = [
      { key: 1, text: "n1" },
      { key: 2, text: "n2" },
      { key: 3, text: "n3", size: new go.Size(80, 80) },
      { key: 21, text: "21" },
      { key: 22, text: "22", size: new go.Size(80, 80) },
      { key: 31, text: "31" },
      { key: 32, text: "32" },
      { key: 41, text: "41" },
      { key: 42, text: "42", size: new go.Size(80, 80) },
      { key: 51, text: "51" },
      { key: 52, text: "52", size: new go.Size(80, 80) },
      { key: 61, text: "61" },
      { key: 62, text: "62", size: new go.Size(80, 80) },
      { key: 71, text: "71" },
      { key: 72, text: "72", size: new go.Size(80, 80) }
    ];
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 21 },
      { from: 2, to: 22 },
      { from: 3, to: 31 },
      { from: 3, to: 32 },
      { from: 21, to: 41 },
      { from: 21, to: 42 },
      { from: 22, to: 51 },
      { from: 22, to: 52 },
      { from: 31, to: 61 },
      { from: 31, to: 62 },
      { from: 32, to: 71 },
      { from: 32, to: 72 }
    ];
    test.diagram.model = m;
    test.diagram.layout = new go.TreeLayout();
  }

  function LayerIndividualCheck(test) {
    switch (test.diagram.layout.angle) {
      case 0: test.assertAllNodeLocations([new go.Point(0, 282.5), new go.Point(70, 135), new go.Point(70, 370), new go.Point(140, 50), new go.Point(140, 160), new go.Point(200, 330), new go.Point(200, 470), new go.Point(210, 0), new go.Point(210, 40), new go.Point(270, 140), new go.Point(270, 180), new go.Point(270, 280), new go.Point(270, 320), new go.Point(270, 420), new go.Point(270, 460)]); break;
      case 90: test.assertAllNodeLocations([new go.Point(282.5, 0), new go.Point(135, 70), new go.Point(370, 70), new go.Point(50, 140), new go.Point(160, 140), new go.Point(330, 200), new go.Point(470, 200), new go.Point(0, 210), new go.Point(40, 210), new go.Point(140, 270), new go.Point(180, 270), new go.Point(280, 270), new go.Point(320, 270), new go.Point(420, 270), new go.Point(460, 270)]); break;
      case 180: test.assertAllNodeLocations([new go.Point(330, 282.5), new go.Point(260, 135), new go.Point(200, 370), new go.Point(190, 50), new go.Point(130, 160), new go.Point(130, 330), new go.Point(130, 470), new go.Point(120, 0), new go.Point(60, 40), new go.Point(60, 140), new go.Point(0, 180), new go.Point(60, 280), new go.Point(0, 320), new go.Point(60, 420), new go.Point(0, 460)]); break;
      case 270: test.assertAllNodeLocations([new go.Point(282.5, 330), new go.Point(135, 260), new go.Point(370, 200), new go.Point(50, 190), new go.Point(160, 130), new go.Point(330, 130), new go.Point(470, 130), new go.Point(0, 120), new go.Point(40, 60), new go.Point(140, 60), new go.Point(180, 0), new go.Point(280, 60), new go.Point(320, 0), new go.Point(420, 60), new go.Point(460, 0)]); break;
    }
  }

  function LayerSiblingsCheck(test) {
    switch (test.diagram.layout.angle) {
      case 0: test.assertAllNodeLocations([new go.Point(0, 282.5), new go.Point(70, 135), new go.Point(70, 370), new go.Point(200, 50), new go.Point(200, 160), new go.Point(200, 330), new go.Point(200, 470), new go.Point(330, 0), new go.Point(330, 40), new go.Point(330, 140), new go.Point(330, 180), new go.Point(270, 280), new go.Point(270, 320), new go.Point(270, 420), new go.Point(270, 460)]); break;
      case 90: test.assertAllNodeLocations([new go.Point(282.5, 0), new go.Point(135, 70), new go.Point(370, 70), new go.Point(50, 200), new go.Point(160, 200), new go.Point(330, 200), new go.Point(470, 200), new go.Point(0, 330), new go.Point(40, 330), new go.Point(140, 330), new go.Point(180, 330), new go.Point(280, 270), new go.Point(320, 270), new go.Point(420, 270), new go.Point(460, 270)]); break;
      case 180: test.assertAllNodeLocations([new go.Point(390, 282.5), new go.Point(320, 135), new go.Point(260, 370), new go.Point(190, 50), new go.Point(130, 160), new go.Point(190, 330), new go.Point(190, 470), new go.Point(60, 0), new go.Point(0, 40), new go.Point(60, 140), new go.Point(0, 180), new go.Point(120, 280), new go.Point(60, 320), new go.Point(120, 420), new go.Point(60, 460)]); break;
      case 270: test.assertAllNodeLocations([new go.Point(282.5, 390), new go.Point(135, 320), new go.Point(370, 260), new go.Point(50, 190), new go.Point(160, 130), new go.Point(330, 190), new go.Point(470, 190), new go.Point(0, 60), new go.Point(40, 0), new go.Point(140, 60), new go.Point(180, 0), new go.Point(280, 120), new go.Point(320, 60), new go.Point(420, 120), new go.Point(460, 60)]); break;
    }
  }

  function LayerUniformCheck(test) {
    switch (test.diagram.layout.angle) {
      case 0: test.assertAllNodeLocations([new go.Point(0, 282.5), new go.Point(70, 135), new go.Point(70, 370), new go.Point(200, 50), new go.Point(200, 160), new go.Point(200, 330), new go.Point(200, 470), new go.Point(330, 0), new go.Point(330, 40), new go.Point(330, 140), new go.Point(330, 180), new go.Point(330, 280), new go.Point(330, 320), new go.Point(330, 420), new go.Point(330, 460)]); break;
      case 90: test.assertAllNodeLocations([new go.Point(282.5, 0), new go.Point(135, 70), new go.Point(370, 70), new go.Point(50, 200), new go.Point(160, 200), new go.Point(330, 200), new go.Point(470, 200), new go.Point(0, 330), new go.Point(40, 330), new go.Point(140, 330), new go.Point(180, 330), new go.Point(280, 330), new go.Point(320, 330), new go.Point(420, 330), new go.Point(460, 330)]); break;
      case 180: test.assertAllNodeLocations([new go.Point(390, 282.5), new go.Point(320, 135), new go.Point(260, 370), new go.Point(190, 50), new go.Point(130, 160), new go.Point(190, 330), new go.Point(190, 470), new go.Point(60, 0), new go.Point(0, 40), new go.Point(60, 140), new go.Point(0, 180), new go.Point(60, 280), new go.Point(0, 320), new go.Point(60, 420), new go.Point(0, 460)]); break;
      case 270: test.assertAllNodeLocations([new go.Point(282.5, 390), new go.Point(135, 320), new go.Point(370, 260), new go.Point(50, 190), new go.Point(160, 130), new go.Point(330, 190), new go.Point(470, 190), new go.Point(0, 60), new go.Point(40, 0), new go.Point(140, 60), new go.Point(180, 0), new go.Point(280, 60), new go.Point(320, 0), new go.Point(420, 60), new go.Point(460, 0)]); break;
    }
  }

  // #region Coverage Tests
  function CycleRemovalPickRootRun(test) {
    var layout = new go.TreeLayout();
    layout.doLayout(test.diagram);
  };

  function DAGHandlingRun(test) {
    var layout = new go.TreeLayout();
    layout.doLayout(test.diagram);
  };

  function SourceRun(test) {
    var layout = new go.TreeLayout();
    layout.path = go.TreeLayout.PathSource;
    layout.doLayout(test.diagram);
  };

  function BezierRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alternateAngle = 90;
    layout.doLayout(test.diagram);
  };

  function OrthogonalRun(test) {
    var layout = new go.TreeLayout();
    layout.treeStyle = go.TreeLayout.StyleAlternating;
    layout.alternateAngle = 90;
    layout.doLayout(test.diagram);
  };

  function BigParentRun(test) {
    var layout = new go.TreeLayout();
    layout.doLayout(test.diagram);
  };

  function CycleRemovalPickRootCheck(test) {
    var points = [
      new go.Point(0, 50),
      new go.Point(70, 20),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
      new go.Point(210, 40),
      new go.Point(210, 80)
    ];
    CheckNodes(points, test);
  };

  function DAGHandlingCheck(test) {
    var points = [
      new go.Point(0, 20),
      new go.Point(70, 0),
      new go.Point(70, 40),
      new go.Point(140, 0),
      new go.Point(280, 40),
      new go.Point(140, 40),
      new go.Point(350, 40),
      new go.Point(210, 40)
    ];
    CheckNodes(points, test);
  };

  function SourceCheck(test) {
    var points = [
      new go.Point(0, 50),
      new go.Point(70, 20),
      new go.Point(70, 80),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 80),
      new go.Point(210, 40),
    ];
    CheckNodes(points, test);
  };

  function BezierCheck(test) {
    var lpoints = [
      [
        new go.Point(20, 65),
        new go.Point(25, 65),
        new go.Point(25, 10),
        new go.Point(45, 10),
        new go.Point(65, 10),
        new go.Point(100, 10),
        new go.Point(110, 10)
      ],
      [
        new go.Point(20, 65),
        new go.Point(30, 65),
        new go.Point(60, 120),
        new go.Point(70, 120)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(80, 60),
        new go.Point(80, 70)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(120, 60),
        new go.Point(120, 70)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(160, 60),
        new go.Point(160, 70)
      ]
    ];
    var lit = test.diagram.links;
    var i = 0;
    while (lit.next()) {
      var link = lit.value;
      test.assertLinkPoints(link, lpoints[i]);
      i++;
    }
  };

  function OrthogonalCheck(test) {
    var lpoints = [
      [
        new go.Point(20, 65),
        new go.Point(30, 65),
        new go.Point(45, 65),
        new go.Point(45, 10),
        new go.Point(100, 10),
        new go.Point(110, 10)
      ],
      [
        new go.Point(20, 65),
        new go.Point(30, 65),
        new go.Point(45, 65),
        new go.Point(45, 120),
        new go.Point(60, 120),
        new go.Point(70, 120)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(120, 45),
        new go.Point(80, 45),
        new go.Point(80, 60),
        new go.Point(80, 70)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(120, 45),
        new go.Point(120, 45),
        new go.Point(120, 60),
        new go.Point(120, 70)
      ],
      [
        new go.Point(120, 20),
        new go.Point(120, 30),
        new go.Point(120, 45),
        new go.Point(160, 45),
        new go.Point(160, 60),
        new go.Point(160, 70)
      ]
    ];
    var lit = test.diagram.links;
    var i = 0;
    while (lit.next()) {
      var link = lit.value;
      test.assertLinkPoints(link, lpoints[i]);
      i++;
    }
  };

  function BigParentCheck(test) {
    var points = [
      new go.Point(0, 72.5),
      new go.Point(70, 35),
      new go.Point(70, 110),
      new go.Point(140, 0),
      new go.Point(140, 40),
      new go.Point(140, 110),
      new go.Point(240, 55),
      new go.Point(210, 110)
    ];
    CheckNodes(points, test);
  };
  // #endregion

  // #region Helper Functions
  function CheckNodes(points, test) {
    var nodes = [];
    var i;
    for (i = 0; i < points.length; i++) {
      nodes[i] = N(test, (i + 1));
      CheckNodeLoc(nodes[i], points[i], 'Node n' + (i + 1).toString() + ' at ' + nodes[i].location.toString() + ', not ' + points[i].toString(), test);
    }
  };

  function N(test, key) {
    var model = test.diagram.model;
    var d = model.findNodeDataForKey(key);
    return test.diagram.findNodeForData(d, model);
  };

  function CheckNodeLoc(n, p, msg, test) {
    test.assert(test.isApproxPoint(n.location, p), msg);
  };
  // #endregion

  // TreeLayout:
  var root = new TestCollection('TreeLayout');
  root.preSetup = function (test) {

    // define the Node template
    var archnode = new go.Node(go.Panel.Spot);
    archnode.desiredSize = new go.Size(20, 20);
    archnode.bind(new go.Binding("desiredSize", "size"));
    var ns = new go.Shape();
    ns.figure = 'Ellipse';
    ns.fill = 'lightgray';
    ns.stroke = 'black';
    ns.stretch = go.GraphObject.Fill;
    ns.portId = '';
    ns.alignment = go.Spot.Center;
    archnode.add(ns);
    var nt = new go.TextBlock();
    nt.alignment = go.Spot.Center;
    nt.bind(new go.Binding('text', 'text'));
    archnode.add(nt);
    archnode.bind(new go.Binding('text', 'text'));
    var toLocation = function (data, node) {
      return new go.Point(data.x, data.y);
    };
    archnode.bind(new go.Binding('location', '', toLocation));
    archnode.bind(new go.Binding('category', 'category'));
    // replace the default Node template in the nodeTemplateMap
    test.diagram.nodeTemplateMap.add('', archnode);

    var bignode = new go.Node(go.Panel.Spot);
    bignode.desiredSize = new go.Size(50, 50);
    var bns = new go.Shape();
    bns.figure = 'Ellipse';
    bns.fill = 'lightgray';
    bns.stroke = 'black';
    bns.stretch = go.GraphObject.Fill;
    bns.portId = '';
    bns.alignment = go.Spot.Center;
    bignode.add(bns);
    var bnt = new go.TextBlock();
    bnt.alignment = go.Spot.Center;
    bnt.bind(new go.Binding('text', 'text'));
    bignode.add(bnt);
    bignode.bind(new go.Binding('text', 'text'));
    // replace the default Node template in the nodeTemplateMap
    test.diagram.nodeTemplateMap.add('2', bignode);

    // set a binding for text on Comment nodes
    var commentNode = new go.Node(go.Panel.Spot);
    commentNode.desiredSize = new go.Size(20, 20);
    var cs = new go.Shape();
    cs.figure = 'Ellipse';
    cs.fill = 'orange';
    cs.stroke = 'black';
    cs.stretch = go.GraphObject.Fill;
    cs.portId = '';
    cs.alignment = go.Spot.Center;
    commentNode.add(cs);
    var ct = new go.TextBlock();
    ct.alignment = go.Spot.Center;
    ct.bind(new go.Binding('text', 'text'));
    commentNode.add(ct);
    test.diagram.nodeTemplateMap.add('Comment', commentNode);

    // define Link templates
    var bezlink = new go.Link();
    bezlink.curve = go.Link.Bezier;
    var bs = new go.Shape();
    bs.isPanelMain = true;
    bs.stroke = 'black';
    bs.strokeWidth = 1;
    bezlink.add(bs);
    test.diagram.linkTemplateMap.add('Bezier', bezlink);

    var orthlink = new go.Link();
    orthlink.routing = go.Link.Orthogonal;
    var os = new go.Shape();
    os.isPanelMain = true;
    os.stroke = 'black';
    os.strokeWidth = 1;
    orthlink.add(os);
    test.diagram.linkTemplateMap.add('Orthogonal', orthlink);
    // #endregion
  }
  TestRoot.add(root);

  root.add(new Test('TreeVertex/Edge properties', null, null, null,
    function (test) {
      var net = new go.TreeNetwork(test.diagram.layout);
      var v = net.createVertex();
      test.assert(v.network === net);
      test.assert(v.node === null);
      test.assert(v.initialized === false);
      test.assert(v.parent === null);
      test.assert(Array.isArray(v.children) && v.children.length === 0);
      test.assert(v.level === 0);
      test.assert(v.descendantCount === 0);
      test.assert(v.maxChildrenCount === 0);
      test.assert(v.maxGenerationCount === 0);
      test.assert(v.comments === null);
      test.assert(v.relativePosition.equals(new go.Point()));
      test.assert(v.subtreeSize.equals(new go.Size()));
      test.assert(v.subtreeOffset.equals(new go.Point()));
      test.assert(v.sorting === go.TreeLayout.SortingForwards);
      test.assert(v.comparer === go.LayoutVertex.standardComparer);
      test.assert(v.angle === 0);
      test.assert(v.alignment === go.TreeLayout.AlignmentCenterChildren);
      test.assert(v.nodeIndent === 0);
      test.assert(v.nodeIndentPastParent === 0);
      test.assert(v.nodeSpacing === 20);
      test.assert(v.layerSpacing === 50);
      test.assert(v.layerSpacingParentOverlap === 0);
      test.assert(v.compaction === go.TreeLayout.CompactionBlock);
      test.assert(v.breadthLimit === 0);
      test.assert(v.rowSpacing === 25);
      test.assert(v.rowIndent === 10);
      test.assert(v.commentSpacing === 10);
      test.assert(v.commentMargin === 20);
      test.assert(v.setsPortSpot === true);
      test.assert(v.portSpot.equals(go.Spot.Default));
      test.assert(v.setsChildPortSpot === true);
      test.assert(v.childPortSpot.equals(go.Spot.Default));

      var e = net.createEdge();
      test.assert(e.network === net);
      test.assert(e.link === null);
      test.assert(e.fromVertex === null);
      test.assert(e.toVertex === null);
      test.assert(e.relativePoint.equals(new go.Point()));
    }
  ));

  // #region Multiple Properties Collection
  {
    // #region Block
    var block = new TestCollection('Compaction Block');
    root.add(block);
    {
      // #region Angle 0
      var angle0 = new TestCollection('Angle 0');
      block.add(angle0);
      {
        var start = new TestCollection('Start');
        angle0.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentStart, 1) },
            B0S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentStart, 0) },
            B0S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle0.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentCenterChildren, 1) },
            B0CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentCenterChildren, 0) },
            B0CC0Check));
        }
        angle0.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          B0CSCheck));
        angle0.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentEnd, 0) },
          B0ECheck));
        angle0.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentBus, 0) },
          B0BCheck));
        angle0.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentBusBranching, 0) },
          B0BBCheck));
        angle0.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentTopLeftBus, 0) },
          B0TLBCheck));
        angle0.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 0, go.TreeLayout.AlignmentBottomRightBus, 0) },
          B0BRBCheck));
      }
      // #endregion
      // #region Angle 90
      var angle90 = new TestCollection('Angle 90');
      block.add(angle90);
      {
        var start = new TestCollection('Start');
        angle90.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentStart, 1) },
            B90S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentStart, 0) },
            B90S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle90.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentCenterChildren, 1) },
            B90CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentCenterChildren, 0) },
            B90CC0Check));
        }
        angle90.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          B90CSCheck));
        angle90.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentEnd, 0) },
          B90ECheck));
        angle90.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentBus, 0) },
          B90BCheck));
        angle90.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentBusBranching, 0) },
          B90BBCheck));
        angle90.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentTopLeftBus, 0) },
          B90TLBCheck));
        angle90.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 90, go.TreeLayout.AlignmentBottomRightBus, 0) },
          B90BRBCheck));
      }
      // #endregion
      // #region Angle 180
      var angle180 = new TestCollection('Angle 180');
      block.add(angle180);
      {
        var start = new TestCollection('Start');
        angle180.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentStart, 1) },
            B180S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentStart, 0) },
            B180S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle180.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentCenterChildren, 1) },
            B180CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentCenterChildren, 0) },
            B180CC0Check));
        }
        angle180.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          B180CSCheck));
        angle180.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentEnd, 0) },
          B180ECheck));
        angle180.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentBus, 0) },
          B180BCheck));
        angle180.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentBusBranching, 0) },
          B180BBCheck));
        angle180.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentTopLeftBus, 0) },
          B180TLBCheck));
        angle180.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 180, go.TreeLayout.AlignmentBottomRightBus, 0) },
          B180BRBCheck));
      }
      // #endregion
      // #region Angle 270
      var angle270 = new TestCollection('Angle 270');
      block.add(angle270);
      {
        var start = new TestCollection('Start');
        angle270.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentStart, 1) },
            B270S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentStart, 0) },
            B270S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle270.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentCenterChildren, 1) },
            B270CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentCenterChildren, 0) },
            B270CC0Check));
        }
        angle270.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          B270CSCheck));
        angle270.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentEnd, 0) },
          B270ECheck));
        angle270.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentBus, 0) },
          B270BCheck));
        angle270.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentBusBranching, 0) },
          B270BBCheck));
        angle270.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentTopLeftBus, 0) },
          B270TLBCheck));
        angle270.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionBlock, 270, go.TreeLayout.AlignmentBottomRightBus, 0) },
          B270BRBCheck));
      }
      // #endregion
    }
    // #endregion
    // #region None
    var none = new TestCollection('Compaction None');
    root.add(none);
    {
      // #region Angle 0
      var angle0 = new TestCollection('Angle 0');
      none.add(angle0);
      {
        var start = new TestCollection('Start');
        angle0.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentStart, 1) },
            N0S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentStart, 0) },
            N0S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle0.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentCenterChildren, 1) },
            N0CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentCenterChildren, 0) },
            N0CC0Check));
        }
        angle0.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          N0CSCheck));
        angle0.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentEnd, 0) },
          N0ECheck));
        angle0.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentBus, 0) },
          N0BCheck));
        angle0.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentBusBranching, 0) },
          N0BBCheck));
        angle0.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentTopLeftBus, 0) },
          N0TLBCheck));
        angle0.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 0, go.TreeLayout.AlignmentBottomRightBus, 0) },
          N0BRBCheck));
      }
      // #endregion
      // #region Angle 90
      var angle90 = new TestCollection('Angle 90');
      none.add(angle90);
      {
        var start = new TestCollection('Start');
        angle90.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentStart, 1) },
            N90S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentStart, 0) },
            N90S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle90.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentCenterChildren, 1) },
            N90CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentCenterChildren, 0) },
            N90CC0Check));
        }
        angle90.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          N90CSCheck));
        angle90.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentEnd, 0) },
          N90ECheck));
        angle90.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentBus, 0) },
          N90BCheck));
        angle90.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentBusBranching, 0) },
          N90BBCheck));
        angle90.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentTopLeftBus, 0) },
          N90TLBCheck));
        angle90.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 90, go.TreeLayout.AlignmentBottomRightBus, 0) },
          N90BRBCheck));
      }
      // #endregion
      // #region Angle 180
      var angle180 = new TestCollection('Angle 180');
      none.add(angle180);
      {
        var start = new TestCollection('Start');
        angle180.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentStart, 1) },
            N180S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentStart, 0) },
            N180S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle180.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentCenterChildren, 1) },
            N180CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentCenterChildren, 0) },
            N180CC0Check));
        }
        angle180.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          N180CSCheck));
        angle180.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentEnd, 0) },
          N180ECheck));
        angle180.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentBus, 0) },
          N180BCheck));
        angle180.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentBusBranching, 0) },
          N180BBCheck));
        angle180.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentTopLeftBus, 0) },
          N180TLBCheck));
        angle180.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 180, go.TreeLayout.AlignmentBottomRightBus, 0) },
          N180BRBCheck));
      }
      // #endregion
      // #region Angle 270
      var angle270 = new TestCollection('Angle 270');
      none.add(angle270);
      {
        var start = new TestCollection('Start');
        angle270.add(start);
        {
          start.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentStart, 1) },
            N270S1Check));
          start.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentStart, 0) },
            N270S0Check));
        }
        var cc = new TestCollection('CenterChildren');
        angle270.add(cc);
        {
          cc.add(new Test('BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentCenterChildren, 1) },
            N270CC1Check));
          cc.add(new Test('No BreadthLimit', null, CommonSetup,
            function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentCenterChildren, 0) },
            N270CC0Check));
        }
        angle270.add(new Test('CenterSubtrees', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentCenterSubtrees, 0) },
          N270CSCheck));
        angle270.add(new Test('End', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentEnd, 0) },
          N270ECheck));
        angle270.add(new Test('Bus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentBus, 0) },
          N270BCheck));
        angle270.add(new Test('BusBranching', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentBusBranching, 0) },
          N270BBCheck));
        angle270.add(new Test('TopLeftBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentTopLeftBus, 0) },
          N270TLBCheck));
        angle270.add(new Test('BottomRightBus', null, CommonSetup,
          function (test) { CommonRun(test, go.TreeLayout.CompactionNone, 270, go.TreeLayout.AlignmentBottomRightBus, 0) },
          N270BRBCheck));
      }
      // #endregion
    }
    // #endregion
  }
  // #endregion

  // #region Arrangement TestCollection
  var arrangement = new TestCollection('Arrangement');
  root.add(arrangement);

  arrangement.add(new Test('FixedRoots arrangement', null, ArrangementSetup, ArrangementFixedRootsRun, ArrangementFixedRootsCheck));
  arrangement.add(new Test('Horizontal arrangement', null, ArrangementSetup, ArrangementHorizontalRun, ArrangementHorizontalCheck));
  arrangement.add(new Test('Vertical arrangement', null, ArrangementSetup, ArrangementVerticalRun, ArrangementVerticalCheck));
  arrangement.add(new Test('More arrangementSpacing', null, ArrangementSetup, ArrangementMoreSpacingRun, ArrangementMoreSpacingCheck));

  function ArrangementCompactionSetup(test, compact) {
    var diag = test.diagram;
    diag.reset();

    diag.layout = go.GraphObject.make(go.TreeLayout,
      {
        arrangement: go.TreeLayout.ArrangementHorizontal,
        arrangementSpacing: new go.Size(125, 25),
        compaction: compact ? go.TreeLayout.CompactionBlock : go.TreeLayout.CompactionNone,
        angle: 0,
        alignment: go.TreeLayout.AlignmentStart,
        nodeIndent: 20,
        nodeIndentPastParent: 1.0,
        layerSpacing: 40,
        layerSpacingParentOverlap: 1.0,
        setsPortSpot: false
      })

    diag.nodeTemplate =
      $(go.Node, 'Auto',
        { width: 60, height: 30 },
        new go.Binding("width", "wide", function (w) { return w ? 200 : 60; }),
        { fromSpot: new go.Spot(0.0001, 1, 18, 0) },
        $(go.Shape, { fill: "lightgray" }),
        $(go.Panel, 'Horizontal',
          $("TreeExpanderButton"),
          $(go.TextBlock, new go.Binding('text'))
        )
      );

    diag.linkTemplate =
      $(go.Link, go.Link.Orthogonal,
        $(go.Shape)
      );

    diag.model = new go.TreeModel(
      [
        { key: 1, text: "Alpha", wide: true },
        { key: 2, text: "Beta", parent: 1 },
        { key: 11, text: "Alpha1" }
      ]);
  }

  arrangement.add(new Test("CompactNone width", null,
    function (test) {
      ArrangementCompactionSetup(test, false);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(325.0, 0.0)]);

      var n2 = test.diagram.findNodeForKey(2);
      test.diagram.model.set(n2.data, "wide", true);
      test.diagram.layoutDiagram();
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(365.0, 0.0)]);

      var r1 = test.diagram.findNodeForKey(1);
      test.diagram.commandHandler.collapseTree(r1);

      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(325.0, 0.0)]);
    }
  ));

  arrangement.add(new Test("CompactBlock width", null,
    function (test) {
      ArrangementCompactionSetup(test, true);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(325.0, 0.0)]);

      var n2 = test.diagram.findNodeForKey(2);
      test.diagram.model.set(n2.data, "wide", true);
      test.diagram.layoutDiagram();
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(365.0, 0.0)]);

      var r1 = test.diagram.findNodeForKey(1);
      test.diagram.commandHandler.collapseTree(r1);

      test.assertAllNodeLocations([new go.Point(0.0, 0.0), new go.Point(40.0, 50.0), new go.Point(325.0, 0.0)]);
      //test.dumpAllNodeLocations();
    }
  ));
  // #endregion

  // #region Comment TestCollection
  var comment = new TestCollection('Comment');
  root.add(comment);

  comment.add(new Test('Positive commentMargin', null, CommentMarginSetup, CommentMarginRun, CommentMarginCheck));
  comment.add(new Test('Negative commentMargin', null, CommentMarginSetup, NegativeCommentMarginRun, NegativeCommentMarginCheck));
  comment.add(new Test('Positive commentSpacing', null, CommentSpacingSetup, CommentSpacingRun, CommentSpacingCheck));
  comment.add(new Test('Negative commentSpacing', null, CommentSpacingSetup, NegativeCommentSpacingRun, NegativeCommentSpacingCheck));
  comment.add(new Test('Negative direction, postitive margin', null, CommentCoverageSetup, NegDirPosMargRun, NegDirPosMargCheck));
  comment.add(new Test('Negative direction, negative margin', null, CommentCoverageSetup, NegDirNegMargRun, NegDirNegMargCheck));
  // #endregion

  // #region NodeIndent TestCollection
  var nodeIndent = new TestCollection('NodeIndent');
  root.add(nodeIndent);

  nodeIndent.add(new Test('NodeIndent', null, Common2Setup, NodeIndentRun, NodeIndentCheck));
  nodeIndent.add(new Test('NodeIndentPastParent', null, Common2Setup, NodeIndentPastParentRun, NodeIndentPastParentCheck));
  // #endregion

  // #region PortSpots TestCollection
  var portSpots = new TestCollection('PortSpots');
  root.add(portSpots);

  portSpots.add(new Test('PortSpots', null, PortSpotsSetup, PortSpotsRun, PortSpotsCheck));
  portSpots.add(new Test('SetsPortSpots', null, PortSpotsSetup, SetsPortSpotsRun, SetsPortSpotsCheck));
  // #endregion

  // #region Roots TestCollection
  var roots = new TestCollection('Roots');
  root.add(roots);

  roots.add(new Test('One root', null, Common2Setup, RootsRun, RootsCheck));
  roots.add(new Test('Two root', null, ArrangementSetup, RootsRun, RootsCheck));
  //#endregion

  // #region Rows TestCollection
  var rows = new TestCollection('Rows');
  root.add(rows);

  rows.add(new Test('RowSpacing', null, Common2Setup, RowSpacingRun, RowSpacingCheck));
  rows.add(new Test('Negative rowSpacing', null, Common2Setup, NegativeRowSpacingRun, NegativeRowSpacingCheck));
  rows.add(new Test('RowIndent', null, Common2Setup, RowIndentRun, RowIndentCheck));
  // #endregion

  // #region Sort TestCollection
  var sort = new TestCollection('Sort');
  root.add(sort);

  sort.add(new Test('Forwards sorting', null, SortSetup, Sort_ForwardsRun, Sort_ForwardsCheck));
  sort.add(new Test('Reverse sorting', null, SortSetup, Sort_ReverseRun, Sort_ReverseCheck));
  sort.add(new Test('Ascending sorting', null, SortSetup, Sort_AscendingRun, Sort_AscendingCheck));
  sort.add(new Test('Descending sorting', null, SortSetup, Sort_DescendingRun, Sort_DescendingCheck));
  // #endregion

  // #region Spacing TestCollection
  var spacing = new TestCollection('Spacing');
  root.add(spacing);

  spacing.add(new Test('Positive layerSpacing', null, Common2Setup, LayerSpacingRun, LayerSpacingCheck));
  spacing.add(new Test('Negative layerSpacing', null, Common2Setup, NegativeLayerSpacingRun, NegativeLayerSpacingCheck));
  spacing.add(new Test('LayerSpacingParentOverlap', null, Common2Setup, LayerSpacingParentOverlapRun, LayerSpacingParentOverlapCheck));
  spacing.add(new Test('Positive nodeSpacing', null, Common2Setup, NodeSpacingRun, NodeSpacingCheck));
  spacing.add(new Test('Negative nodeSpacing', null, Common2Setup, NegativeNodeSpacingRun, NegativeNodeSpacingCheck));
  // #endregion

  // #region Style TestCollection
  var style = new TestCollection('Style');
  root.add(style);

  style.add(new Test('Layered style', null, StyleSetup, StyleLayeredRun, StyleLayeredCheck));
  style.add(new Test('Alternating style', null, StyleSetup, StyleAlternatingRun, StyleAlternatingCheck));
  style.add(new Test('LastParents style', null, StyleSetup, StyleLastParentsRun, StyleLastParentsCheck));
  style.add(new Test('RootOnly style', null, StyleSetup, StyleRootOnlyRun, StyleRootOnlyCheck));
  // #endregion

  // #region Coverage TestCollection
  var coverage = new TestCollection('Coverage');
  root.add(coverage);

  coverage.add(new Test('DAG handling', null, DAGSetup, DAGHandlingRun, DAGHandlingCheck));
  coverage.add(new Test('Source path', null, SourceSetup, SourceRun, SourceCheck));
  coverage.add(new Test('Bezier links', null, BezierSetup, BezierRun, BezierCheck));
  coverage.add(new Test('Orthogonal links', null, OrthogonalSetup, OrthogonalRun, OrthogonalCheck));
  coverage.add(new Test('Parent bigger than child', null, BigParentSetup, BigParentRun, BigParentCheck));
  coverage.add(new Test('Cycle handling', null, CycleSetup, CycleRemovalPickRootRun, CycleRemovalPickRootCheck));
  coverage.add(new Test('Ring handling', null, RingSetup,
    function (test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey(1);  // just 1 --> 2
      var n2 = diagram.findNodeForKey(2);
      var n3 = diagram.findNodeForKey(3);  // both 3 --> 4 and 4 --> 3
      var n4 = diagram.findNodeForKey(4);
      var n5 = diagram.findNodeForKey(5);  // 5 --> 6 and 6 --> 7 and 7 --> 5
      var n6 = diagram.findNodeForKey(6);
      var n7 = diagram.findNodeForKey(7);
      test.assert(n1.location.x + 20 < n2.location.x, "didn't lay out N1 and N2");
      test.assert((n3.location.x + 20 < n4.location.x) || (n4.location.x + 20 < n3.location.x), "didn't lay out N3 and N4 in either order");
      test.assert(
        ((n5.location.x + 20 < n6.location.x) && (n6.location.x + 20 < n7.location.x)) ||
        ((n6.location.x + 20 < n7.location.x) && (n7.location.x + 20 < n5.location.x)) ||
        ((n7.location.x + 20 < n5.location.x) && (n5.location.x + 20 < n6.location.x)),
        "didn't lay out N5, N6, and N7 starting with any of the three");
    },
    function (test) {
    }));
  // #endregion

  var layerStyle = new TestCollection("layerStyle");
  root.add(layerStyle);

  function runLayerAngle(test, ls, a) {
    test.diagram.layout.layerStyle = ls;
    test.diagram.layout.angle = a;
    test.diagram.layoutDiagram();
  }
  layerStyle.add(new Test("Individual 0", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerIndividual, 0); }, LayerIndividualCheck));
  layerStyle.add(new Test("Siblings 0", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerSiblings, 0); }, LayerSiblingsCheck));
  layerStyle.add(new Test("Uniform 0", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerUniform, 0); }, LayerUniformCheck));

  layerStyle.add(new Test("Individual 90", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerIndividual, 90); }, LayerIndividualCheck));
  layerStyle.add(new Test("Siblings 90", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerSiblings, 90); }, LayerSiblingsCheck));
  layerStyle.add(new Test("Uniform 90", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerUniform, 90); }, LayerUniformCheck));

  layerStyle.add(new Test("Individual 180", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerIndividual, 180); }, LayerIndividualCheck));
  layerStyle.add(new Test("Siblings 180", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerSiblings, 180); }, LayerSiblingsCheck));
  layerStyle.add(new Test("Uniform 180", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerUniform, 180); }, LayerUniformCheck));

  layerStyle.add(new Test("Individual 270", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerIndividual, 270); }, LayerIndividualCheck));
  layerStyle.add(new Test("Siblings 270", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerSiblings, 270); }, LayerSiblingsCheck));
  layerStyle.add(new Test("Uniform 270", null, LayerStyleSetup, function (test) { runLayerAngle(test, go.TreeLayout.LayerUniform, 270); }, LayerUniformCheck));

  var tc = new TestCollection("focus");
  root.add(tc);

  var $ = go.GraphObject.make;


  tc.add(new Test("focus alignment", null,
    function (test) {
      test.diagram.nodeTemplate =
        $(go.Node, "Horizontal",
          { locationObjectName: "BOX" },
          $(go.TextBlock, new go.Binding("text", "l")),
          $(go.Shape, { name: "BOX", width: 50, height: 30, fill: "white", portId: "" }),
          $(go.TextBlock, new go.Binding("text", "r")));
      test.diagram.layout =
        $(go.TreeLayout,
          { angle: 90 });

      var m = new go.TreeModel();
      m.nodeDataArray = [
        { key: 1, l: "left", r: "right" },
        { key: 2, parent: 1, l: "a very long string", r: "short" },
        { key: 3, parent: 2, l: "left", r: "" },
        { key: 4, parent: 3, l: "", r: "right" }
      ];
      test.diagram.model = m;
    },
    null,
    function (test) {
      var first = test.diagram.nodes.first();
      var p = first.findObject("BOX").getDocumentPoint(go.Spot.TopLeft);
      var it = test.diagram.nodes;
      while (it.next()) {
        var n = it.value;
        var q = n.findObject("BOX").getDocumentPoint(go.Spot.TopLeft);
        test.assert(test.isApprox(p.x, q.x), "X of node " + n.data.key + " is at " + q + " instead of at " + p);
      }
    }
  ));


  var layoutBounds = new TestCollection("LayoutBounds");
  root.add(layoutBounds);

  function SetupBounds(test, wrap, margin) {
    var diag = test.diagram;
    diag.reset();
    var $ = go.GraphObject.make;
    diag.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center, locationObjectName: "BODY" },
        { margin: margin },
        $(go.Panel, "Auto", { name: "BODY", height: 32 },
          new go.Binding("width"),
          $(go.Shape,
            { fill: "white", portId: "" },
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: 8, editable: true },
            new go.Binding("text").makeTwoWay())
        )
      );
    if (margin === 0) {
      diag.nodeTemplate.add(
        $(go.TextBlock, "top", { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, width: 30, height: 20 }));
      diag.nodeTemplate.add(
        $(go.TextBlock, "left", { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right, width: 40, height: 20 }));
      diag.nodeTemplate.add(
        $(go.TextBlock, "rightright", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, width: 80, height: 20 }));
      diag.nodeTemplate.add(
        $(go.TextBlock, "bottom\nbottom", { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, width: 60, height: 45 }));
    }
    diag.layout =
      $(go.TreeLayout,
        {
          angle: wrap,
          nodeSpacing: 0,
          layerSpacing: 0,
        });
    if (margin === 0) {
      diag.layout.boundsComputation = (part, lay) => part.findObject("BODY").getDocumentBounds();
    }
    diag.model = new go.GraphLinksModel(
      [
        { key: 1, text: "Alpha", color: "lightblue", width: 51 },
        { key: 2, text: "Beta", color: "orange", width: 45 },
        { key: 3, text: "Gamma", color: "lightgreen", width: 63 },
        { key: 4, text: "Delta", color: "pink", width: 48 },
        { key: 5, text: "Epsilon", color: "yellow", width: 61 }
      ],
      [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 3, to: 4 },
        { from: 2, to: 5 }
      ]);
  }

  layoutBounds.add(new Test("overlap angle 0", null,
    function (test) {
      SetupBounds(test, 0, 0);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(65.5,52.0), new go.Point(113.5,36.0), new go.Point(122.5,68.0), new go.Point(178.0,68.0), new go.Point(166.5,36.0)])
    }));

  layoutBounds.add(new Test("overlap angle 90", null,
    function (test) {
      SetupBounds(test, 90, 0);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(106.0,36.0), new go.Point(70.5,68.0), new go.Point(132.5,68.0), new go.Point(132.5,100.0), new go.Point(70.5,100.0)])
    }));

  layoutBounds.add(new Test("overlap angle 0 margin 5", null,
    function (test) {
      SetupBounds(test, 0, 5);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(25.5,37.0), new go.Point(83.5,16.0), new go.Point(92.5,58.0), new go.Point(158.0,58.0), new go.Point(146.5,16.0)])
    }));

  layoutBounds.add(new Test("overlap angle 90 margin 5", null,
    function (test) {
      SetupBounds(test, 90, 5);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(71.0,16.0), new go.Point(30.5,58.0), new go.Point(102.5,58.0), new go.Point(102.5,100.0), new go.Point(30.5,100.0)])
    }));

  layoutBounds.add(new Test("overlap angle 0 margin -5", null,
    function (test) {
      SetupBounds(test, 0, -5);
    },
    function (test) {
      test.assertAllNodeLocations([new go.Point(25.5,27.0), new go.Point(63.5,16.0), new go.Point(72.5,38.0), new go.Point(118.0,38.0), new go.Point(106.5,16.0)])
    }));

  layoutBounds.add(new Test("overlap angle 90 margin -5", null,
    function (test) {
      SetupBounds(test, 90, -5);
    },
    function (test) {
      //test.dumpAllNodeLocations();
      test.assertAllNodeLocations([new go.Point(61.0,16.0), new go.Point(30.5,38.0), new go.Point(82.5,38.0), new go.Point(82.5,60.0), new go.Point(30.5,60.0)])
    }));

})();
