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
  // #region Setups

  function DirectionTestSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 6);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 }
    ];
    test.diagram.model = m;
  };

  function SpacingTestSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 8);
    m.linkDataArray = [
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 4, to: 7 },
      { from: 6, to: 8 }
    ];
    test.diagram.model = m;
  };

  function PackingTestSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 10);
    m.linkDataArray = [
      { from: 1, to: 4 },
      { from: 1, to: 7 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 9 },
      { from: 4, to: 7 },
      { from: 4, to: 8 },
      { from: 5, to: 7 },
      { from: 5, to: 8 },
      { from: 5, to: 9 },
      { from: 7, to: 10 },
      { from: 9, to: 10 }
    ];
    test.diagram.model = m;
  };

  function AlignTestSetup1(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: 1 },
          { key: 2 },
          { key: 3, w: 15 },
          { key: 4 },
          { key: 5, w: 80 },
          { key: 6 },
          { key: 7 },
          { key: 8 },
          { key: 9, w: 100 },
          { key: 10 },
          { key: 11, w: 120 },
          { key: 12 },
          { key: 13 },
          { key: 14 },
          { key: 15 },
          { key: 16 },
          { key: 17 },
          { key: 18 },
          { key: 19 },
          { key: 20 },
          { key: 21 },
          { key: 22 },
          { key: 23, w: 120 },
          { key: 24 },
        ],
        linkDataArray: [
          { from: 16, to: 17 },
          { from: 17, to: 4 },
          { from: 21, to: 2 },
          { from: 18, to: 2 },
          { from: 24, to: 23 },
          { from: 4, to: 23 },
          { from: 7, to: 23 },
          { from: 7, to: 20 },
          { from: 2, to: 0 },
          { from: 2, to: 12 },
          { from: 3, to: 10 },
          { from: 13, to: 10 },
          { from: 23, to: 10 },
          { from: 0, to: 20 },
          { from: 10, to: 5 },
          { from: 20, to: 5 },
          { from: 20, to: 22 },
          { from: 6, to: 12 },
          { from: 8, to: 9 },
          { from: 14, to: 1 },
          { from: 5, to: 22 },
          { from: 12, to: 22 },
          { from: 9, to: 19 },
          { from: 1, to: 19 },
          { from: 15, to: 11 },
          { from: 22, to: 11 },
          { from: 19, to: 11 },
        ]
      }
    );
  }

  function AlignTestSetup2(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: GenerateNodesArray(1, 4),
        linkDataArray: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 4, to: 1 }
        ]
      }
    );
  }

  function AlignTestSetup3(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: 1, category: "ports" },
          { key: 2, category: "ports" },
          { key: 3, w: 90, category: "ports" }
        ],
        linkDataArray: [
          { from: 1, to: 2, fromPort: "BL", toPort: "TR" },
          { from: 2, to: 3, fromPort: "BL", toPort: "TL"}
        ]
      }
    );
  }

  function AlignTestSetup4(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: GenerateNodesArray(1, 8),
        linkDataArray: [
          { from: 1, to: 2 },
          { from: 2, to: 5 },
          { from: 3, to: 5 },
          { from: 4, to: 6 },
          { from: 4, to: 7 },
          { from: 5, to: 8 },
          { from: 6, to: 8 }
        ]
      }
    );
  }

  function AlignTestSetup5(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: 1, w: 200, category: "ports" },
          { key: 2 },
          { key: 3 },
          { key: 4 },
          { key: 5, w: 100 },
          { key: 6 },
          { key: 7, w: 100 },
          { key: 8 }
        ],
        linkDataArray: [
          { from: 1, to: 2, fromPort: "BL" },
          { from: 2, to: 5 },
          { from: 3, to: 5 },
          { from: 4, to: 6 },
          { from: 4, to: 7 },
          { from: 5, to: 8 },
          { from: 6, to: 8 }
        ]
      }
    );
  }

  function AlignTestSetup6(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: -1, isGroup: true },
          { key: -2, isGroup: true },
          { key: 1, w: 200, category: "ports", group: -1 },
          { key: 2 },
          { key: 3 },
          { key: 4 },
          { key: 5, w: 100 },
          { key: 6, group: -2 },
          { key: 7, w: 100, group: -2 },
          { key: 8 }
        ],
        linkDataArray: [
          { from: -1, to: 2 },
          { from: 2, to: 5 },
          { from: 3, to: 5 },
          { from: 4, to: -2 },
          { from: 5, to: 8 },
          { from: -2, to: 8 }
        ]
      }
    );
  }

  function AlignTestSetup7(test) {
    var $ = go.GraphObject.make;

    test.diagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: [
          { key: -1, isGroup: true },
          { key: -2, isGroup: true },
          { key: 1, w: 200, category: "ports", group: -1 },
          { key: 2 },
          { key: 3 },
          { key: 4 },
          { key: 5, w: 100 },
          { key: 6, group: -2 },
          { key: 7, w: 100, group: -2 },
          { key: 8 }
        ],
        linkDataArray: [
          { from: 1, to: 2, fromPort: "BL" },
          { from: 2, to: 5 },
          { from: 3, to: 5 },
          { from: 4, to: 6 },
          { from: 4, to: 7 },
          { from: 5, to: 8 },
          { from: 6, to: 8 }
        ]
      }
    );
  }

  function CyclicTestSetup1(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 3);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup2(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 5);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 5, to: 1 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup3(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 6);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 2 },
      { from: 3, to: 6 },
      { from: 6, to: 1 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup4(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 6);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 5, to: 4 },
      { from: 2, to: 5 },
      { from: 6, to: 3 },
      { from: 1, to: 6 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup5(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 4);
    m.linkDataArray = [
      { from: 1, to: 4 },
      { from: 2, to: 1 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 4, to: 1 },
      { from: 4, to: 2 },
      { from: 4, to: 3 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup6(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 7);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 5, to: 7 },
      { from: 7, to: 1 }
    ];
    test.diagram.model = m;
  };

  function CyclicTestSetup7(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 6);
    m.linkDataArray = [
      { from: 1, to: 6 },
      { from: 1, to: 2 },
      { from: 2, to: 5 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 1 },
      { from: 4, to: 3 },
      { from: 4, to: 6 },
      { from: 5, to: 2 },
      { from: 5, to: 4 },
      { from: 6, to: 5 },
      { from: 6, to: 1 }
    ];
    test.diagram.model = m;
  };

  function CommonSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 10);
    m.linkDataArray = [
      { from: 1, to: 4 },
      { from: 1, to: 7 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 9 },
      { from: 4, to: 7 },
      { from: 4, to: 8 },
      { from: 5, to: 7 },
      { from: 5, to: 8 },
      { from: 5, to: 9 },
      { from: 7, to: 10 },
      { from: 9, to: 10 }
    ];
    test.diagram.model = m;
  };

  function RoutingAndCurveSetup(test) {
    var m = new go.GraphLinksModel();
    m.nodeDataArray = GenerateNodesArray(1, 3);
    m.linkDataArray = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 1, to: 3 }
    ];
    test.diagram.model = m;
  };

  // #endregion

  // #region Common Run Functions
  function LD_Default_Run(test, routing, curve, spot) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
      if (spot !== undefined) {
        if (spot.equals(go.Spot.RightSide)) {
          link.fromSpot = go.Spot.RightSide;
          link.toSpot = go.Spot.LeftSide;
        } else if (spot.equals(go.Spot.LeftRightSides)) {
          link.fromSpot = go.Spot.LeftRightSides;
          link.toSpot = go.Spot.LeftRightSides;
        }
      }
    }
    var layout = new go.LayeredDigraphLayout();
    if (spot !== undefined) {
      layout.setsPortSpots = false;
    }
    layout.doLayout(test.diagram);
  };
  // #endregion

  // #region Direction Tests
  function LD_Direction_Run(test, direction, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.direction = direction;
    layout.doLayout(test.diagram);
  };

  function LD_Direction_0_Check(test) {
    var points = [
      new go.Point(0, 45),
      new go.Point(65, 22.5),
      new go.Point(65, 90),
      new go.Point(130, 0),
      new go.Point(130, 45),
      new go.Point(130, 90)
    ];
    CheckNodes(points, test);
  };

  function LD_Direction_90_Check(test) {
    var points = [
      new go.Point(45, 0),
      new go.Point(22.5, 65),
      new go.Point(90, 65),
      new go.Point(0, 130),
      new go.Point(45, 130),
      new go.Point(90, 130)
    ];
    CheckNodes(points, test);
  };

  function LD_Direction_180_Check(test) {
    var points = [
      new go.Point(130, 45),
      new go.Point(65, 22.5),
      new go.Point(65, 90),
      new go.Point(0, 0),
      new go.Point(0, 45),
      new go.Point(0, 90)
    ];
    CheckNodes(points, test);
  };

  function LD_Direction_270_Check(test) {
    var points = [
      new go.Point(45, 130),
      new go.Point(22.5, 65),
      new go.Point(90, 65),
      new go.Point(0, 0),
      new go.Point(45, 0),
      new go.Point(90, 0)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region Spacing Tests
  function LD_Spacing_Run(test, layerSpacing, columnSpacing, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.layerSpacing = layerSpacing;
    layout.columnSpacing = columnSpacing;
    layout.doLayout(test.diagram);
  };

  function LD_Layer25_Column50_Check(test) {
    var points = [
      new go.Point(0, 35),
      new go.Point(0, 105),
      new go.Point(65, 70),
      new go.Point(130, 0),
      new go.Point(130, 70),
      new go.Point(130, 140),
      new go.Point(195, 0),
      new go.Point(195, 140)
    ];
    CheckNodes(points, test);
  };

  function LD_Layer50_Column25_Check(test) {
    var points = [
      new go.Point(0, 22.5),
      new go.Point(0, 67.5),
      new go.Point(90, 45),
      new go.Point(180, 0),
      new go.Point(180, 45),
      new go.Point(180, 90),
      new go.Point(270, 0),
      new go.Point(270, 90)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region CycleRemoval Tests
  function LD_CycleRemoval_Run(test, cycleRemoveOption, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.cycleRemoveOption = cycleRemoveOption;
    layout.doLayout(test.diagram);
  };

  function LD_CycleRemoveDepthFirst_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(0, 62.5),
      new go.Point(0, 125),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 170),
      new go.Point(130, 35),
      new go.Point(130, 80),
      new go.Point(130, 125),
      new go.Point(195, 85)
    ];
    CheckNodes(points, test);
  };

  function LD_CycleRemoveGreedy_Check(test) {
    LD_CycleRemoveDepthFirst_Check(test); //Same as DepthFirst
  };

  // #endregion

  // #region Layering Tests

  function LD_Layering_Run(test, layeringOption, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.layeringOption = layeringOption;
    layout.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
    layout.doLayout(test.diagram);
  };

  function LD_LayeringOptimalLength_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(0, 62.5),
      new go.Point(0, 125),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 170),
      new go.Point(130, 35),
      new go.Point(130, 80),
      new go.Point(130, 125),
      new go.Point(195, 85)
    ];
    CheckNodes(points, test);
  };

  // Same as Optimal
  function LD_LayeringLongestSource_Check(test) {
    LD_LayeringOptimalLength_Check(test);
  };

  function LD_LayeringLongestSink_Check(test) {
    var points = [
      new go.Point(0, 35),
      new go.Point(0, 80),
      new go.Point(0, 147.5),
      new go.Point(65, 40),
      new go.Point(65, 102.5),
      new go.Point(195, 125),
      new go.Point(130, 62.5),
      new go.Point(195, 62.5),
      new go.Point(130, 187.5),
      new go.Point(195, 170)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region Initialization Tests

  function LD_Initialization_Run(test, initializeOption, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.initializeOption = initializeOption;
    layout.doLayout(test.diagram);
  };

  function LD_InitializationDepthFirstIn_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(0, 62.5),
      new go.Point(0, 125),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 170),
      new go.Point(130, 35),
      new go.Point(130, 80),
      new go.Point(130, 125),
      new go.Point(195, 85)
    ];
    CheckNodes(points, test);
  };

  // Same as InitDepthFirstIn
  function LD_InitializationDepthFirstOut_Check(test) {
    LD_InitializationDepthFirstIn_Check(test);
  };

  function LD_InitializationNaive_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(0, 62.5),
      new go.Point(0, 130),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 130),
      new go.Point(130, 35),
      new go.Point(130, 80),
      new go.Point(130, 165),
      new go.Point(195, 102.5)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region Aggressive Tests

  function LD_Aggressive_Run(test, aggressiveOption, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.aggressiveOption = aggressiveOption;
    layout.doLayout(test.diagram);
  };

  function LD_AggressiveNone_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(0, 62.5),
      new go.Point(0, 125),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 170),
      new go.Point(130, 35),
      new go.Point(130, 80),
      new go.Point(130, 125),
      new go.Point(195, 85)
    ];
    CheckNodes(points, test);
  };

  // Same points as AggressiveNone
  function LD_AggressiveLess_Check(test) {
    LD_AggressiveNone_Check(test);
  };

  // Same points as AggressiveNone
  function LD_AggressiveMore_Check(test) {
    LD_AggressiveNone_Check(test);
  };

  // #endregion

  // #region PackOption Tests

  function LD_Packing_Run(test, packOption, routing, curve) {
    if (routing === undefined) routing = go.Link.Normal;
    if (curve === undefined) curve = go.Link.None;
    var links = test.diagram.links;
    while (links.next()) {
      var link = links.value;
      link.routing = routing;
      link.curve = curve;
    }

    var layout = new go.LayeredDigraphLayout();
    layout.alignOption = go.LayeredDigraphLayout.AlignNone;
    layout.packOption = packOption;
    layout.doLayout(test.diagram);
  };

  function LD_PackNone_Check(test) {
    var points = [
      new go.Point(0, 20),
      new go.Point(0, 95),
      new go.Point(0, 170),
      new go.Point(65, 45),
      new go.Point(65, 120),
      new go.Point(65, 220),
      new go.Point(130, 20),
      new go.Point(130, 95),
      new go.Point(130, 170),
      new go.Point(195, 20)
    ];
    CheckNodes(points, test);
  };

  function LD_PackExpand_Check(test) {
    var points = [
      new go.Point(0, 45),
      new go.Point(0, 120),
      new go.Point(0, 195),
      new go.Point(65, 45),
      new go.Point(65, 120),
      new go.Point(65, 220),
      new go.Point(130, 45),
      new go.Point(130, 120),
      new go.Point(130, 195),
      new go.Point(195, 120)
    ];
    CheckNodes(points, test);
  };

  function LD_PackExpandStraighten_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 100),
      new go.Point(0, 175),
      new go.Point(65, 50),
      new go.Point(65, 125),
      new go.Point(65, 225),
      new go.Point(130, 0),
      new go.Point(130, 100),
      new go.Point(130, 175),
      new go.Point(195, 100)
    ];
    CheckNodes(points, test);
  };

  function LD_PackAll_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 75),
      new go.Point(0, 175),
      new go.Point(65, 50),
      new go.Point(65, 125),
      new go.Point(65, 225),
      new go.Point(130, 0),
      new go.Point(130, 100),
      new go.Point(130, 175),
      new go.Point(195, 100)
    ];
    CheckNodes(points, test);
  };

  function LD_PackExpandMedian_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 125),
      new go.Point(0, 250),
      new go.Point(65, 50),
      new go.Point(65, 125),
      new go.Point(65, 250),
      new go.Point(130, 25),
      new go.Point(130, 125),
      new go.Point(130, 200),
      new go.Point(195, 175)
    ];
    CheckNodes(points, test);
  };

  function LD_PackStraighten_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 100),
      new go.Point(0, 175),
      new go.Point(65, 50),
      new go.Point(65, 125),
      new go.Point(65, 225),
      new go.Point(130, 0),
      new go.Point(130, 100),
      new go.Point(130, 175),
      new go.Point(195, 75)
    ];
    CheckNodes(points, test);
  };

  function LD_PackStraightenMedian_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(0, 100),
      new go.Point(0, 175),
      new go.Point(65, 50),
      new go.Point(65, 125),
      new go.Point(65, 225),
      new go.Point(130, 0),
      new go.Point(130, 100),
      new go.Point(130, 175),
      new go.Point(195, 100)
    ];
    CheckNodes(points, test);
  };

  function LD_PackMedian_Check(test) {
    var points = [
      new go.Point(0, 20),
      new go.Point(0, 95),
      new go.Point(0, 170),
      new go.Point(65, 45),
      new go.Point(65, 120),
      new go.Point(65, 220),
      new go.Point(130, 20),
      new go.Point(130, 95),
      new go.Point(130, 170),
      new go.Point(195, 95)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region Align Tests

  function LD_Align_Run(test, alignOption) {
    var $ = go.GraphObject.make;
    var diagram = test.diagram;
    diagram.nodeTemplate =
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Rectangle", { fill: "lightgray", stroke: null, desiredSize: new go.Size(30, 30) },
          new go.Binding("width", "w")
        ),
        $(go.TextBlock, { textAlign: "center" }, new go.Binding("text", "key"), new go.Binding("width", "w"))
      );

    diagram.nodeTemplateMap.add("ports",
      $(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Rectangle", { portId: "", fill: "lightgray", stroke: null, desiredSize: new go.Size(30, 30) },
          new go.Binding("width", "w")
        ),
        $(go.Shape, { portId: "TL", desiredSize: new go.Size(3, 3), alignment: new go.Spot(.25, 0, 0, 0) }),
        $(go.Shape, { portId: "TR", desiredSize: new go.Size(3, 3), alignment: new go.Spot(.75, 0, 0, 0) }),
        $(go.Shape, { portId: "BL", desiredSize: new go.Size(3, 3), alignment: new go.Spot(.25, 1, 0, 0) }),
        $(go.Shape, { portId: "BR", desiredSize: new go.Size(3, 3), alignment: new go.Spot(.75, 1, 0, 0) }),
        $(go.TextBlock, { textAlign: "center" }, new go.Binding("text", "key"), new go.Binding("width", "w"))
      ));

    diagram.groupTemplate =
      $(go.Group, "Vertical",
        { selectionObjectName: "GROUPPANEL", layout: new go.GridLayout() },
        $(go.TextBlock, { font: "bold 12pt sans-serif"}, new go.Binding('text', '', go.Binding.toString)),
        $(go.Panel, "Auto",
          { name: "GROUPPANEL"},
          $(go.Shape, "Rectangle", { fill: "rgba(128,128,128,0.2)" }),
          $(go.Placeholder, { padding: new go.Margin(5, 5, 5, 5) })
        )
      );

    diagram.linkTemplate =
      $(go.Link,
        new go.Binding("fromPortId", "fromPort"),
        new go.Binding("toPortId", "toPort"),
        $(go.Shape, { strokeWidth: 3, stroke: "#333" }));

    var layout = new go.LayeredDigraphLayout();
    layout.direction = 90;
    layout.layerOption = go.LayeredDigraphLayout.LayerLongestPathSink;
    layout.alignOption = alignOption;
    diagram.layout = layout;
    // layout.doLayout(diagram);
  }

  function LD_AlignAll1_Check(test) {
    var points = [
      new go.Point(517.75, 395.5),
      new go.Point(353.25, 319.5),
      new go.Point(204.5, 243.5),
      new go.Point(111, 167.5),
      new go.Point(206.25, 395.5),
      new go.Point(297.25, 319.5),
      new go.Point(15.5, 167.5),
      new go.Point(426.75, 319.5),
      new go.Point(426.75, 395.5),
      new go.Point(206.25, 319.5),
      new go.Point(204.5, 547.5),
      new go.Point(318.5, 395.5),
      new go.Point(253, 243.5),
      new go.Point(517.75, 319.5),
      new go.Point(148.5, 471.5),
      new go.Point(111, 15.5),
      new go.Point(111, 91.5),
      new go.Point(325.25, 243.5),
      new go.Point(484, 471.5),
      new go.Point(15.5, 319.5),
      new go.Point(381.25, 243.5),
      new go.Point(204.5, 471.5),
      new go.Point(111, 243.5),
      new go.Point(167, 167.5)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL1_Check(test) {
    var points = [
      new go.Point(488.50, 395.50),
      new go.Point(341.50, 319.50),
      new go.Point(204.50, 243.50),
      new go.Point(111.00, 167.50),
      new go.Point(204.50, 395.50),
      new go.Point(285.50, 319.50),
      new go.Point(15.50, 167.50),
      new go.Point(397.50, 319.50),
      new go.Point(397.50, 395.50),
      new go.Point(204.50, 319.50),
      new go.Point(204.50, 547.50),
      new go.Point(285.50, 395.50),
      new go.Point(253.00, 243.50),
      new go.Point(488.50, 319.50),
      new go.Point(148.50, 471.50),
      new go.Point(111.00, 15.50),
      new go.Point(111.00, 91.50),
      new go.Point(341.50, 243.50),
      new go.Point(397.50, 471.50),
      new go.Point(15.50, 319.50),
      new go.Point(397.50, 243.50),
      new go.Point(204.50, 471.50),
      new go.Point(111.00, 243.50),
      new go.Point(167.00, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR1_Check(test) {
    var points = [
      new go.Point(547.00, 395.50),
      new go.Point(365.00, 319.50),
      new go.Point(204.50, 243.50),
      new go.Point(111.00, 167.50),
      new go.Point(204.50, 395.50),
      new go.Point(309.00, 319.50),
      new go.Point(15.50, 167.50),
      new go.Point(456.00, 319.50),
      new go.Point(456.00, 395.50),
      new go.Point(204.50, 319.50),
      new go.Point(204.50, 547.50),
      new go.Point(365.00, 395.50),
      new go.Point(253.00, 243.50),
      new go.Point(547.00, 319.50),
      new go.Point(148.50, 471.50),
      new go.Point(111.00, 15.50),
      new go.Point(111.00, 91.50),
      new go.Point(309.00, 243.50),
      new go.Point(547.00, 471.50),
      new go.Point(15.50, 319.50),
      new go.Point(365.00, 243.50),
      new go.Point(204.50, 471.50),
      new go.Point(111.00, 243.50),
      new go.Point(167.00, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignLL1_Check(test) {
    var points = [
      new go.Point(557.00, 395.50),
      new go.Point(410.00, 319.50),
      new go.Point(305.50, 243.50),
      new go.Point(212.00, 167.50),
      new go.Point(212.00, 395.50),
      new go.Point(293.00, 319.50),
      new go.Point(116.50, 167.50),
      new go.Point(466.00, 319.50),
      new go.Point(466.00, 395.50),
      new go.Point(212.00, 319.50),
      new go.Point(60.50, 547.50),
      new go.Point(293.00, 395.50),
      new go.Point(354.00, 243.50),
      new go.Point(557.00, 319.50),
      new go.Point(60.50, 471.50),
      new go.Point(212.00, 15.50),
      new go.Point(212.00, 91.50),
      new go.Point(410.00, 243.50),
      new go.Point(466.00, 471.50),
      new go.Point(116.50, 319.50),
      new go.Point(466.00, 243.50),
      new go.Point(116.50, 471.50),
      new go.Point(212.00, 243.50),
      new go.Point(268.00, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignLR1_Check(test) {
    var points = [
      new go.Point(563.50, 395.50),
      new go.Point(381.50, 319.50),
      new go.Point(221.00, 243.50),
      new go.Point(71.50, 167.50),
      new go.Point(269.50, 395.50),
      new go.Point(325.50, 319.50),
      new go.Point(15.50, 167.50),
      new go.Point(472.50, 319.50),
      new go.Point(472.50, 395.50),
      new go.Point(269.50, 319.50),
      new go.Point(563.50, 547.50),
      new go.Point(381.50, 395.50),
      new go.Point(269.50, 243.50),
      new go.Point(563.50, 319.50),
      new go.Point(325.50, 471.50),
      new go.Point(71.50, 15.50),
      new go.Point(71.50, 91.50),
      new go.Point(325.50, 243.50),
      new go.Point(563.50, 471.50),
      new go.Point(15.50, 319.50),
      new go.Point(381.50, 243.50),
      new go.Point(381.50, 471.50),
      new go.Point(127.50, 243.50),
      new go.Point(127.50, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll2_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(106.50, 91.50),
      new go.Point(15.50, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL2_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(106.50, 91.50),
      new go.Point(15.50, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR2_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(106.50, 91.50),
      new go.Point(15.50, 167.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll3_Check(test) {
    var points = [
      new go.Point(46.00, 17.50),
      new go.Point(30.50, 97.50),
      new go.Point(45.50, 177.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll4_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(71.50, 91.50),
      new go.Point(155.50, 91.50),
      new go.Point(43.50, 167.50),
      new go.Point(127.50, 167.50),
      new go.Point(183.50, 167.50),
      new go.Point(71.50, 243.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL4_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(71.50, 91.50),
      new go.Point(127.50, 91.50),
      new go.Point(15.50, 167.50),
      new go.Point(127.50, 167.50),
      new go.Point(183.50, 167.50),
      new go.Point(15.50, 243.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR4_Check(test) {
    var points = [
      new go.Point(15.50, 15.50),
      new go.Point(15.50, 91.50),
      new go.Point(71.50, 91.50),
      new go.Point(183.50, 91.50),
      new go.Point(71.50, 167.50),
      new go.Point(127.50, 167.50),
      new go.Point(183.50, 167.50),
      new go.Point(127.50, 243.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll5_Check(test) {
    var points = [
      new go.Point(100.50, 17.50),
      new go.Point(50.25, 95.50),
      new go.Point(106.25, 95.50),
      new go.Point(225.25, 95.50),
      new go.Point(78.25, 171.50),
      new go.Point(179.75, 171.50),
      new go.Point(270.75, 171.50),
      new go.Point(123.75, 247.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL5_Check(test) {
    var points = [
      new go.Point(100.75, 17.50),
      new go.Point(50.50, 95.50),
      new go.Point(106.50, 95.50),
      new go.Point(162.50, 95.50),
      new go.Point(50.50, 171.50),
      new go.Point(162.50, 171.50),
      new go.Point(253.50, 171.50),
      new go.Point(50.50, 247.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR5_Check(test) {
    var points = [
      new go.Point(100.50, 17.50),
      new go.Point(50.25, 95.50),
      new go.Point(106.25, 95.50),
      new go.Point(288.25, 95.50),
      new go.Point(106.25, 171.50),
      new go.Point(197.25, 171.50),
      new go.Point(288.25, 171.50),
      new go.Point(197.25, 247.50)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll6_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(210.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(303.50, 123.83),
      new go.Point(134.00, 213.99),
      new go.Point(230.50, 222.65),
      new go.Point(341.50, 222.65),
      new go.Point(218.75, 304.15)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL6_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(182.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(275.50, 123.83),
      new go.Point(106.00, 213.99),
      new go.Point(202.50, 222.65),
      new go.Point(313.50, 222.65),
      new go.Point(106.00, 304.15)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR6_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(238.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(331.50, 123.83),
      new go.Point(162.00, 213.99),
      new go.Point(258.50, 222.65),
      new go.Point(369.50, 222.65),
      new go.Point(331.50, 304.15)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignAll7_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(210.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(303.50, 123.83),
      new go.Point(134.00, 213.99),
      new go.Point(230.50, 222.65),
      new go.Point(341.50, 222.65),
      new go.Point(218.75, 304.15)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUL7_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(182.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(275.50, 123.83),
      new go.Point(106.00, 213.99),
      new go.Point(202.50, 222.65),
      new go.Point(313.50, 222.65),
      new go.Point(106.00, 304.15)
    ];
    CheckNodes(points, test);
  }

  function LD_AlignUR7_Check(test) {
    var g1 = test.diagram.findNodeForKey(-1);
    var gp1 = new go.Point(0.50, 17.83);
    var g2 = test.diagram.findNodeForKey(-2);
    var gp2 = new go.Point(238.00, 202.15);
    CheckNodeLoc(g1, gp1, 'Node n' + (-1).toString() + ' at ' + g1.location.toString() + ', not ' + gp1.toString(), test);
    CheckNodeLoc(g2, gp2, 'Node n' + (-2).toString() + ' at ' + g2.location.toString() + ', not ' + gp2.toString(), test);
    var points = [
      new go.Point(106.00, 40.33),
      new go.Point(106.00, 123.83),
      new go.Point(162.00, 123.83),
      new go.Point(331.50, 123.83),
      new go.Point(162.00, 213.99),
      new go.Point(258.50, 222.65),
      new go.Point(369.50, 222.65),
      new go.Point(331.50, 304.15)
    ];
    CheckNodes(points, test);
  }

  // #endregion

  // #region Cyclic Tests

  function LD_Cyclic1_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(65, 0),
      new go.Point(130, 0)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic2_Check(test) {
    var points = [
      new go.Point(0, 85),
      new go.Point(65, 40),
      new go.Point(65, 85),
      new go.Point(65, 130),
      new go.Point(130, 85)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic3_Check(test) {
    var points = [
      new go.Point(0, 0),
      new go.Point(65, 0),
      new go.Point(130, 0),
      new go.Point(195, 0),
      new go.Point(260, 0),
      new go.Point(195, 80)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic4_Check(test) {
    var points = [
      new go.Point(0, 22.5),
      new go.Point(65, 0),
      new go.Point(130, 45),
      new go.Point(195, 22.5),
      new go.Point(130, 0),
      new go.Point(65, 45)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic5_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(130, 0),
      new go.Point(195, 17.5),
      new go.Point(65, 17.5)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic6_Check(test) {
    var points = [
      new go.Point(0, 22.5),
      new go.Point(65, 0),
      new go.Point(65, 45),
      new go.Point(130, 0),
      new go.Point(130, 45),
      new go.Point(130, 125),
      new go.Point(195, 45)
    ];
    CheckNodes(points, test);
  };

  function LD_Cyclic7_Check(test) {
    var points = [
      new go.Point(0, 132.5),
      new go.Point(195, 110),
      new go.Point(260, 110),
      new go.Point(325, 132.5),
      new go.Point(130, 155),
      new go.Point(65, 155)
    ];
    CheckNodes(points, test);
  };

  // #endregion

  // #region RoutingAndCurve Tests
  function LD_RCNormalNone_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(65, 0),
      new go.Point(130, 17.5)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(20, 27.5),
        new go.Point(30, 27.5),
        new go.Point(55, 10),
        new go.Point(65, 10)
      ],
      [
        new go.Point(85, 10),
        new go.Point(95, 10),
        new go.Point(120, 27.5),
        new go.Point(130, 27.5)
      ],
      [
        new go.Point(20, 27.5),
        new go.Point(30, 27.5),
        new go.Point(55, 45),
        new go.Point(95, 45),
        new go.Point(120, 27.5),
        new go.Point(130, 27.5)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCNormalBezier_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(65, 0),
      new go.Point(130, 17.5)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(20, 27.5),
        new go.Point(30, 27.5),
        new go.Point(55, 10),
        new go.Point(65, 10)
      ],
      [
        new go.Point(85, 10),
        new go.Point(95, 10),
        new go.Point(120, 27.5),
        new go.Point(130, 27.5)
      ],
      [new go.Point(20.0,27.5), new go.Point(30.0,27.5), new go.Point(30.0,45.0), new go.Point(67.5,45.0), new go.Point(75.0,45.0), new go.Point(75.0,45.0), new go.Point(82.5,45.0), new go.Point(120.0,45.0), new go.Point(120.0,27.5), new go.Point(130.0,27.5)]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCOrthogonalNone_Check(test) {
    var points = [
      new go.Point(0, 17.5),
      new go.Point(65, 0),
      new go.Point(130, 17.5)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(20, 27.5),
        new go.Point(30, 27.5),
        new go.Point(42.5, 27.5),
        new go.Point(42.5, 10),
        new go.Point(55, 10),
        new go.Point(65, 10),
      ],
      [
        new go.Point(85, 10),
        new go.Point(95, 10),
        new go.Point(107.5, 10),
        new go.Point(107.5, 27.5),
        new go.Point(120, 27.5),
        new go.Point(130, 27.5)
      ],
      [
        new go.Point(20.0,27.5),
        new go.Point(30.0,27.5),
        new go.Point(42.5,27.5),
        new go.Point(42.5,45.0),
        new go.Point(107.5,45.0),
        new go.Point(107.5,27.5),
        new go.Point(120.0,27.5),
        new go.Point(130.0,27.5)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCOrthogonal_Dir0_Check(test) {
    var points = [
      new go.Point(0, 45),
      new go.Point(65, 22.5),
      new go.Point(65, 90),
      new go.Point(130, 0),
      new go.Point(130, 45),
      new go.Point(130, 90)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(20, 55),
        new go.Point(30, 55),
        new go.Point(42.5, 55),
        new go.Point(42.5, 32.5),
        new go.Point(55, 32.5),
        new go.Point(65, 32.5)
      ],
      [
        new go.Point(20, 55),
        new go.Point(30, 55),
        new go.Point(42.5, 55),
        new go.Point(42.5, 100),
        new go.Point(55, 100),
        new go.Point(65, 100)
      ],
      [
        new go.Point(85, 32.5),
        new go.Point(95, 32.5),
        new go.Point(107.5, 32.5),
        new go.Point(107.5, 10),
        new go.Point(120, 10),
        new go.Point(130, 10)
      ],
      [
        new go.Point(85, 32.5),
        new go.Point(95, 32.5),
        new go.Point(107.5, 32.5),
        new go.Point(107.5, 55),
        new go.Point(120, 55),
        new go.Point(130, 55)
      ],
      [
        new go.Point(85, 100),
        new go.Point(95, 100),
        new go.Point(107.5, 100),
        new go.Point(107.5, 100),
        new go.Point(120, 100),
        new go.Point(130, 100)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCOrthogonal_Dir270_Check(test) {
    var points = [
      new go.Point(45, 130),
      new go.Point(22.5, 65),
      new go.Point(90, 65),
      new go.Point(0, 0),
      new go.Point(45, 0),
      new go.Point(90, 0)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(55, 130),
        new go.Point(55, 120),
        new go.Point(55, 107.5),
        new go.Point(32.5, 107.5),
        new go.Point(32.5, 95),
        new go.Point(32.5, 85),
      ],
      [
        new go.Point(55, 130),
        new go.Point(55, 120),
        new go.Point(55, 107.5),
        new go.Point(100, 107.5),
        new go.Point(100, 95),
        new go.Point(100, 85)
      ],
      [
        new go.Point(32.5, 65),
        new go.Point(32.5, 55),
        new go.Point(32.5, 42.5),
        new go.Point(10, 42.5),
        new go.Point(10, 30),
        new go.Point(10, 20)
      ],
      [
        new go.Point(32.5, 65),
        new go.Point(32.5, 55),
        new go.Point(32.5, 42.5),
        new go.Point(55, 42.5),
        new go.Point(55, 30),
        new go.Point(55, 20)
      ],
      [
        new go.Point(100, 65),
        new go.Point(100, 55),
        new go.Point(100, 42.5),
        new go.Point(100, 42.5),
        new go.Point(100, 30),
        new go.Point(100, 20)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCBezier_Dir90_Check(test) {
    var points = [
      new go.Point(45, 0),
      new go.Point(22.5, 65),
      new go.Point(90, 65),
      new go.Point(0, 130),
      new go.Point(45, 130),
      new go.Point(90, 130)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(55, 20),
        new go.Point(55, 30),
        new go.Point(32.5, 55),
        new go.Point(32.5, 65)
      ],
      [
        new go.Point(55, 20),
        new go.Point(55, 30),
        new go.Point(100, 55),
        new go.Point(100, 65)
      ],
      [
        new go.Point(32.5, 85),
        new go.Point(32.5, 95),
        new go.Point(10, 120),
        new go.Point(10, 130)
      ],
      [
        new go.Point(32.5, 85),
        new go.Point(32.5, 95),
        new go.Point(55, 120),
        new go.Point(55, 130)
      ],
      [
        new go.Point(100, 85),
        new go.Point(100, 95),
        new go.Point(100, 120),
        new go.Point(100, 130)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  function LD_RCBezier_Dir180_Check(test) {
    var points = [
      new go.Point(130, 45),
      new go.Point(65, 22.5),
      new go.Point(65, 90),
      new go.Point(0, 0),
      new go.Point(0, 45),
      new go.Point(0, 90)
    ];
    CheckNodes(points, test);

    var linkPoints = [
      [
        new go.Point(130, 55),
        new go.Point(120, 55),
        new go.Point(95, 32.5),
        new go.Point(85, 32.5)
      ],
      [
        new go.Point(130, 55),
        new go.Point(120, 55),
        new go.Point(95, 100),
        new go.Point(85, 100)
      ],
      [
        new go.Point(65, 32.5),
        new go.Point(55, 32.5),
        new go.Point(30, 10),
        new go.Point(20, 10)
      ],
      [
        new go.Point(65, 32.5),
        new go.Point(55, 32.5),
        new go.Point(30, 55),
        new go.Point(20, 55)
      ],
      [
        new go.Point(65, 100),
        new go.Point(55, 100),
        new go.Point(30, 100),
        new go.Point(20, 100)
      ]
    ];
    CheckLinks(test, linkPoints);
  };

  // #endregion

  // #region Helper Functions
  function GenerateNodesArray(startIndex, num) {
    var nodeArray = [];
    for (i = startIndex; i < startIndex + num; i++) {
      var obj = { key: i, text: "n" + i.toString() };
      nodeArray.push(obj);
    }
    return nodeArray;
  };

  function CheckNodes(points, test) {
    var nodes = [];
    var i;
    for (i = 0; i < points.length; i++) {
      nodes[i] = N(test, (i + 1));
      CheckNodeLoc(nodes[i], points[i], 'Node n' + (i + 1).toString() + ' at ' + nodes[i].location.toString() + ', not ' + points[i].toString(), test);
    }
  };

  function CheckLinks(test, pointsArray) {
    var links = test.diagram.links;
    var i = 0;
    while (links.next()) {
      test.assertLinkPoints(links.value, pointsArray[i]);
      i++;
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

  var LDRoot = new TestCollection('LayeredDigraphLayout');
  LDRoot.preSetup = function(test) {
    // define the Node template
    var archnode = new go.Node(go.Panel.Spot);
    archnode.desiredSize = new go.Size(20, 20);
    var ns = new go.Shape();
    ns.name = 'Shape';  // for data-bindings
    ns.figure = 'Rectangle';
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
    // replace the default Node template in the nodeTemplateMap
    test.diagram.nodeTemplate = archnode;

    // define the Link Template
    var archlink = new go.Link();
    var archpath = new go.Shape();
    archlink.routing = go.Link.Normal;
    archlink.curve = go.Link.None;
    archpath.isPanelMain = true;
    archlink.add(archpath);
    var archarrow = new go.Shape();
    archarrow.toArrow = "Standard";
    archarrow.scale = 0.5;
    archlink.add(archarrow);
    test.diagram.linkTemplate = archlink;
  }
  TestRoot.add(LDRoot);

  LDRoot.add(new Test('LayeredDigraphVertex/Edge properties', null, null, null,
    function(test) {
      var net = new go.LayeredDigraphNetwork(test.diagram.layout);
      var v = net.createVertex();
      test.assert(v.network === net);
      test.assert(v.node === null);
      test.assert(v.layer === -1);
      test.assert(v.column === -1);
      test.assert(v.index === -1);
      test.assert(isNaN(v.component));
      test.assert(v.near === null);

      var e = net.createEdge();
      test.assert(e.network === net);
      test.assert(e.link === null);
      test.assert(e.fromVertex === null);
      test.assert(e.toVertex === null);
      test.assert(e.valid === false);
      test.assert(e.rev === false);
      test.assert(e.forest === false);
      test.assert(isNaN(e.portFromPos));
      test.assert(isNaN(e.portToPos));
      test.assert(e.portFromColOffset === 0);
      test.assert(e.portToColOffset === 0);
    }
  ));

  // #region Direction TestCollection

  var ld_Direction = new TestCollection('Direction');
  LDRoot.add(ld_Direction);

  ld_Direction.add(new Test('Direction 0 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 0)
  },
  LD_Direction_0_Check));

  ld_Direction.add(new Test('Direction 90 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 90)
  },
  LD_Direction_90_Check));

  ld_Direction.add(new Test('Direction 180 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 180)
  },
  LD_Direction_180_Check));

  ld_Direction.add(new Test('Direction 270 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 270)
  },
  LD_Direction_270_Check));

  // #endregion

  // #region Spacing TestCollection

  var ld_Spacing = new TestCollection('Spacing');
  LDRoot.add(ld_Spacing);

  ld_Spacing.add(new Test('Layer 25 Column 50 Test', null, SpacingTestSetup, function(test) {
    LD_Spacing_Run(test, 25, 50)
  },
  LD_Layer25_Column50_Check));

  ld_Spacing.add(new Test('Layer 50 Column 25 Test', null, SpacingTestSetup, function(test) {
    LD_Spacing_Run(test, 50, 25)
  },
  LD_Layer50_Column25_Check));

  // #endregion

  // #region CycleRemoval TestCollection

  var ld_CycleRemoval = new TestCollection('CycleRemove');
  LDRoot.add(ld_CycleRemoval);

  ld_CycleRemoval.add(new Test('CycleRemoval CycleDepthFirst', null, CommonSetup, function(test) {
    LD_CycleRemoval_Run(test, go.LayeredDigraphLayout.CycleDepthFirst)
  },
  LD_CycleRemoveDepthFirst_Check));

  ld_CycleRemoval.add(new Test('CycleRemoval CycleGreedy', null, CommonSetup, function(test) {
    LD_CycleRemoval_Run(test, go.LayeredDigraphLayout.CycleGreedy)
  },
  LD_CycleRemoveGreedy_Check));

  // #endregion

  // #region Layering TestCollection

  var ld_Layering = new TestCollection('Layering');
  LDRoot.add(ld_Layering);

  ld_Layering.add(new Test('Layering LongestSink', null, CommonSetup, function(test) {
    LD_Layering_Run(test, go.LayeredDigraphLayout.LayerLongestPathSink)
  },
  LD_LayeringLongestSink_Check));

  ld_Layering.add(new Test('Layering OptimalLength', null, CommonSetup, function(test) {
    LD_Layering_Run(test, go.LayeredDigraphLayout.LayerOptimalLinkLength)
  },
  LD_LayeringOptimalLength_Check));

  ld_Layering.add(new Test('Layering LongestSource', null, CommonSetup, function(test) {
    LD_Layering_Run(test, go.LayeredDigraphLayout.LayerLongestPathSource)
  },
  LD_LayeringLongestSource_Check));

  // #endregion

  // #region Initialization TestCollection

  var ld_Initialization = new TestCollection('Initialization');
  LDRoot.add(ld_Initialization);

  ld_Initialization.add(new Test('Initialization InitDepthFirstOut', null, CommonSetup, function(test) {
    LD_Initialization_Run(test, go.LayeredDigraphLayout.InitDepthFirstOut)
  },
  LD_InitializationDepthFirstOut_Check));

  ld_Initialization.add(new Test('Layering InitDepthFirstIn', null, CommonSetup, function(test) {
    LD_Initialization_Run(test, go.LayeredDigraphLayout.InitDepthFirstIn)
  },
  LD_InitializationDepthFirstIn_Check));

  ld_Initialization.add(new Test('Layering InitNaive', null, CommonSetup, function(test) {
    LD_Initialization_Run(test, go.LayeredDigraphLayout.InitNaive)
  },
  LD_InitializationNaive_Check));

  // #endregion

  // #region Aggressive TestCollection

  var ld_Aggressive = new TestCollection('Aggressive');
  LDRoot.add(ld_Aggressive);

  ld_Aggressive.add(new Test('Aggressive None', null, CommonSetup, function(test) {
    LD_Aggressive_Run(test, go.LayeredDigraphLayout.AggressiveNone)
  },
  LD_AggressiveNone_Check));

  ld_Aggressive.add(new Test('Aggressive Less', null, CommonSetup, function(test) {
    LD_Aggressive_Run(test, go.LayeredDigraphLayout.AggressiveLess)
  },
  LD_AggressiveLess_Check));

  ld_Aggressive.add(new Test('Aggressive More', null, CommonSetup, function(test) {
    LD_Aggressive_Run(test, go.LayeredDigraphLayout.AggressiveMore)
  },
  LD_AggressiveMore_Check));

  // #endregion

  // #region Packing TestCollection

  var ld_Packing = new TestCollection('Packing');
  LDRoot.add(ld_Packing);

  ld_Packing.add(new Test('PackNone Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackNone)
  },
  LD_PackNone_Check));

  ld_Packing.add(new Test('PackExpand Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackExpand)
  },
  LD_PackExpand_Check));

  ld_Packing.add(new Test('PackExpandStraighten Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackExpand + go.LayeredDigraphLayout.PackStraighten)
  },
  LD_PackExpandStraighten_Check));

  ld_Packing.add(new Test('PackAll Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackAll)
  },
  LD_PackAll_Check));

  ld_Packing.add(new Test('PackExpandMedian Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackExpand + go.LayeredDigraphLayout.PackMedian)
  },
  LD_PackExpandMedian_Check));

  ld_Packing.add(new Test('PackStraighten Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackStraighten)
  },
  LD_PackStraighten_Check));

  ld_Packing.add(new Test('PackStraightenMedian Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackStraighten + go.LayeredDigraphLayout.PackMedian)
  },
  LD_PackStraightenMedian_Check));

  ld_Packing.add(new Test('PackMedian Test', null, PackingTestSetup, function(test) {
    LD_Packing_Run(test, go.LayeredDigraphLayout.PackMedian)
  },
  LD_PackMedian_Check));

  // #endregion

  // #region Align TestCollection

  var ld_Align = new TestCollection('alignOption');
  LDRoot.add(ld_Align);

  ld_Align.add(new Test('AlignAll 1', null,
    AlignTestSetup1,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll1_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 1', null,
    AlignTestSetup1,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL1_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 1', null,
    AlignTestSetup1,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR1_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 1', null,
    AlignTestSetup1,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignLL1_Check
  ));

  ld_Align.add(new Test('AlignLowerRight 1', null,
    AlignTestSetup1,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignLR1_Check
  ));

  ld_Align.add(new Test('AlignAll 2', null,
    AlignTestSetup2,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll2_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 2', null,
    AlignTestSetup2,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL2_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 2', null,
    AlignTestSetup2,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR2_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 2', null,
    AlignTestSetup2,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignUL2_Check  // same as UpperLeft
  ));

  ld_Align.add(new Test('AlignLowerRight 2', null,
    AlignTestSetup2,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignUR2_Check  // same as UpperRight
  ));

  ld_Align.add(new Test('AlignAll 3', null,
    AlignTestSetup3,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll3_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 3', null,
    AlignTestSetup3,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignAll3_Check  // same as All
  ));

  ld_Align.add(new Test('AlignUpperRight 3', null,
    AlignTestSetup3,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignAll3_Check  // same as All
  ));

  ld_Align.add(new Test('AlignLowerLeft 3', null,
    AlignTestSetup3,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignAll3_Check  // same as All
  ));

  ld_Align.add(new Test('AlignLowerRight 3', null,
    AlignTestSetup3,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignAll3_Check  // same as All
  ));

  ld_Align.add(new Test('AlignAll 4', null,
    AlignTestSetup4,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll4_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 4', null,
    AlignTestSetup4,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL4_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 4', null,
    AlignTestSetup4,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR4_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 4', null,
    AlignTestSetup4,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignUL4_Check  // same as UpperLeft
  ));

  ld_Align.add(new Test('AlignLowerRight 4', null,
    AlignTestSetup4,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignUR4_Check  // same as UpperRight
  ));

  ld_Align.add(new Test('AlignAll 5', null,
    AlignTestSetup5,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll5_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 5', null,
    AlignTestSetup5,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL5_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 5', null,
    AlignTestSetup5,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR5_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 5', null,
    AlignTestSetup5,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignUL5_Check  // same as UpperLeft
  ));

  ld_Align.add(new Test('AlignLowerRight 5', null,
    AlignTestSetup5,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignUR5_Check  // same as UpperRight
  ));

  ld_Align.add(new Test('AlignAll 6', null,
    AlignTestSetup6,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll6_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 6', null,
    AlignTestSetup6,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL6_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 6', null,
    AlignTestSetup6,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR6_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 6', null,
    AlignTestSetup6,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignUL6_Check  // same as UpperLeft
  ));

  ld_Align.add(new Test('AlignLowerRight 6', null,
    AlignTestSetup6,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignUR6_Check  // same as UpperRight
  ));

  ld_Align.add(new Test('AlignAll 7', null,
    AlignTestSetup7,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignAll),
    LD_AlignAll7_Check
  ));

  ld_Align.add(new Test('AlignUpperLeft 7', null,
    AlignTestSetup7,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperLeft),
    LD_AlignUL7_Check
  ));

  ld_Align.add(new Test('AlignUpperRight 7', null,
    AlignTestSetup7,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignUpperRight),
    LD_AlignUR7_Check
  ));

  ld_Align.add(new Test('AlignLowerLeft 7', null,
    AlignTestSetup7,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerLeft),
    LD_AlignUL7_Check  // same as UpperLeft
  ));

  ld_Align.add(new Test('AlignLowerRight 7', null,
    AlignTestSetup7,
    (test) => LD_Align_Run(test, go.LayeredDigraphLayout.AlignLowerRight),
    LD_AlignUR7_Check  // same as UpperRight
  ));

  // #endregion

  // #region Cyclic TestCollection

  var ld_Cyclic = new TestCollection('Cyclic');
  LDRoot.add(ld_Cyclic);

  ld_Cyclic.add(new Test('Cyclic 1 Test', null, CyclicTestSetup1, function(test) { LD_Default_Run(test) }, LD_Cyclic1_Check));

  ld_Cyclic.add(new Test('Cyclic 2 Test', null, CyclicTestSetup2, function(test) { LD_Default_Run(test) }, LD_Cyclic2_Check));

  ld_Cyclic.add(new Test('Cyclic 3 Test', null, CyclicTestSetup3, function(test) { LD_Default_Run(test) }, LD_Cyclic3_Check));

  ld_Cyclic.add(new Test('Cyclic 4 Test', null, CyclicTestSetup4, function(test) { LD_Default_Run(test) }, LD_Cyclic4_Check));

  ld_Cyclic.add(new Test('Cyclic 5 Test', null, CyclicTestSetup5, function(test) { LD_Default_Run(test) }, LD_Cyclic5_Check));

  ld_Cyclic.add(new Test('Cyclic 6 Test', null, CyclicTestSetup6, function(test) { LD_Default_Run(test) }, LD_Cyclic6_Check));

  ld_Cyclic.add(new Test('Cyclic 7 Test', null, CyclicTestSetup7, function(test) { LD_Default_Run(test) }, LD_Cyclic7_Check));

  // #endregion

  // #region RoutingAndCurve TestCollection

  var ld_RoutingAndCurve = new TestCollection('RoutingAndCurve');
  LDRoot.add(ld_RoutingAndCurve);

  // #region Default Properties

  var RoutingAndCurve_DefaultProperties = new TestCollection('DefaultProperties');
  ld_RoutingAndCurve.add(RoutingAndCurve_DefaultProperties);

  RoutingAndCurve_DefaultProperties.add(new Test('NormalRoutingNoneCurve Test', null, RoutingAndCurveSetup, function(test) {
    LD_Default_Run(test, go.Link.Normal, go.Link.None)
  },
  LD_RCNormalNone_Check));

  RoutingAndCurve_DefaultProperties.add(new Test('BezierCurve Test', null, RoutingAndCurveSetup, function(test) {
    LD_Default_Run(test, go.Link.Normal, go.Link.Bezier)
  },
  LD_RCNormalBezier_Check));

  RoutingAndCurve_DefaultProperties.add(new Test('OrthogonalRouting Test', null, RoutingAndCurveSetup, function(test) {
    LD_Default_Run(test, go.Link.Orthogonal, go.Link.None)
  },
  LD_RCOrthogonalNone_Check));

  // #endregion

  // #region Direction

  var RoutingAndCurve_Direction = new TestCollection('Direction');
  ld_RoutingAndCurve.add(RoutingAndCurve_Direction);

  RoutingAndCurve_Direction.add(new Test('Orthogonal 0 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 0, go.Link.Orthogonal, go.Link.None)
  },
  LD_RCOrthogonal_Dir0_Check));

  RoutingAndCurve_Direction.add(new Test('Orthogonal 270 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 270, go.Link.Orthogonal, go.Link.None)
  },
  LD_RCOrthogonal_Dir270_Check));

  RoutingAndCurve_Direction.add(new Test('Bezier 90 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 90, go.Link.Normal, go.Link.Bezier)
  },
  LD_RCBezier_Dir90_Check));

  RoutingAndCurve_Direction.add(new Test('Bezier 180 Test', null, DirectionTestSetup, function(test) {
    LD_Direction_Run(test, 180, go.Link.Normal, go.Link.Bezier)
  },
  LD_RCBezier_Dir180_Check));

  RoutingAndCurve_Direction.add(new Test('Bezier from undirected, setsPortSpots = false', null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.nodeTemplate =
        $(go.Node,
          $(go.Shape, { width: 50, height: 30, fill: "gray" })
        );

      test.diagram.linkTemplate =
        $(go.Link,
          {
            curve: go.Link.Bezier,
            toEndSegmentLength: 30,
            fromSpot: go.Spot.Center,
            toSpot: go.Spot.Top
          },
          $(go.Shape),
          $(go.Shape, { toArrow: "Standard" })
        );

      test.diagram.layout =
        $(go.LayeredDigraphLayout,
          { direction: 90, setsPortSpots: false });

      test.diagram.model = new go.GraphLinksModel(
        [
          { key: 1 },
          { key: 2 },
          { key: 3 },
          { key: 4 }
        ],
        [
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 1, to: 4 },
          { from: 3, to: 4 },
          { from: 2, to: 4 }
        ]
      );
    },
    null,
    function(test) {
      var linkPoints = [
        [
          new go.Point(70.85, 31),
          new go.Point(50.5, 46),
          new go.Point(50.5, 76),
        ],
        [
          new go.Point(45.4, 107),
          new go.Point(25.5, 122),
          new go.Point(25.5, 152),
        ],
        [new go.Point(76.0,31.0), new go.Point(118.75,41.0), new go.Point(118.75,78.5), new go.Point(118.75,91.5), new go.Point(118.75,91.5), new go.Point(118.75,104.5), new go.Point(118.75,142.0), new go.Point(118.75,117.0), new go.Point(118.75,154.5), new go.Point(118.75,167.5), new go.Point(118.75,167.5), new go.Point(118.75,180.5), new go.Point(118.75,218.0), new go.Point(76,198.0), new go.Point(76,228.0)],
        [
          new go.Point(35.8, 183),
          new go.Point(76, 198),
          new go.Point(76, 228),
        ],
        [new go.Point(53.3,107), new go.Point(76,117.0), new go.Point(76,154.5), new go.Point(76,167.5), new go.Point(76,167.5), new go.Point(76,180.5), new go.Point(76,218.0), new go.Point(76,198.0), new go.Point(76,228.0)]
      ];
      CheckLinks(test, linkPoints);
    }));

  // #endregion

  // #endregion

  var tc = new TestCollection("focus");
  LDRoot.add(tc);



  tc.add(new Test("focus alignment", null,
    function(test) {
      var $ = go.GraphObject.make;
      test.diagram.nodeTemplate =
        $(go.Node, "Horizontal",
          { locationObjectName: "BOX" },
          $(go.TextBlock, new go.Binding("text", "l")),
          $(go.Shape, { name: "BOX", width: 50, height: 30, fill: "white", portId: "" }),
          $(go.TextBlock, new go.Binding("text", "r")));
      test.diagram.layout =
        $(go.LayeredDigraphLayout,
          { direction: 90 });

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
    function(test) {
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

  // #region Backwards TestCollection

  var ld_Backwards = new TestCollection('Backwards Straight');
  LDRoot.add(ld_Backwards);

  ld_Backwards.add(new Test('Cyclic 1 Test', null, CyclicTestSetup1,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,17.5), new go.Point(65,0), new go.Point(130,17.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 2 Test', null, CyclicTestSetup2,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,67.5), new go.Point(65,0), new go.Point(65,45), new go.Point(65,90), new go.Point(130,67.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 3 Test', null, CyclicTestSetup3,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,57.5), new go.Point(65,40), new go.Point(130,22.5), new go.Point(195,0), new go.Point(260,40), new go.Point(195,45)], test); }));

  ld_Backwards.add(new Test('Cyclic 4 Test', null, CyclicTestSetup4,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,22.5), new go.Point(65,0), new go.Point(130,45), new go.Point(195,22.5), new go.Point(130,0), new go.Point(65,45)], test); }));

  ld_Backwards.add(new Test('Cyclic 5 Test', null, CyclicTestSetup5,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,17.5), new go.Point(130,40), new go.Point(195,0), new go.Point(65,0)], test); }));

  ld_Backwards.add(new Test('Cyclic 6 Test', null, CyclicTestSetup6,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,67.5), new go.Point(65,0), new go.Point(65, 67.5), new go.Point(130,0), new go.Point(130,45), new go.Point(130,90), new go.Point(195,85)], test); }));

  ld_Backwards.add(new Test('Cyclic 7 Test', null, CyclicTestSetup7,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0,40), new go.Point(195,35), new go.Point(260,57.5), new go.Point(325,75), new go.Point(130,40), new go.Point(65,40)], test); }));


  ld_Backwards = new TestCollection('Backwards Orthogonal');
  LDRoot.add(ld_Backwards);

  ld_Backwards.add(new Test('Cyclic 1 Test', null, CyclicTestSetup1,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 17.5), new go.Point(65, 0), new go.Point(130, 17.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 2 Test', null, CyclicTestSetup2,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 67.5), new go.Point(65, 0), new go.Point(65, 45), new go.Point(65, 90), new go.Point(130, 67.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 3 Test', null, CyclicTestSetup3,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 57.5), new go.Point(65, 40), new go.Point(130, 22.5), new go.Point(195, 0), new go.Point(260, 40), new go.Point(195, 45)], test); }));

  ld_Backwards.add(new Test('Cyclic 4 Test', null, CyclicTestSetup4,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 22.5), new go.Point(65, 0), new go.Point(130, 45), new go.Point(195, 22.5), new go.Point(130, 0), new go.Point(65, 45)], test); }));

  ld_Backwards.add(new Test('Cyclic 5 Test', null, CyclicTestSetup5,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 17.5), new go.Point(130, 40), new go.Point(195, 0), new go.Point(65, 0)], test); }));

  ld_Backwards.add(new Test('Cyclic 6 Test', null, CyclicTestSetup6,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 67.5), new go.Point(65, 0), new go.Point(65, 67.5), new go.Point(130, 0), new go.Point(130, 45), new go.Point(130, 90), new go.Point(195, 85)], test); }));

  ld_Backwards.add(new Test('Cyclic 7 Test', null, CyclicTestSetup7,
    function(test) { LD_Default_Run(test, go.Link.Orthogonal, go.Link.None, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 40), new go.Point(195, 35), new go.Point(260, 57.5), new go.Point(325, 75), new go.Point(130, 40), new go.Point(65, 40)], test); }));

  ld_Backwards = new TestCollection('Backwards Bezier');
  LDRoot.add(ld_Backwards);

  ld_Backwards.add(new Test('Cyclic 1 Test', null, CyclicTestSetup1,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 17.5), new go.Point(65, 0), new go.Point(130, 17.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 2 Test', null, CyclicTestSetup2,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 67.5), new go.Point(65, 0), new go.Point(65, 45), new go.Point(65, 90), new go.Point(130, 67.5)], test); }));

  ld_Backwards.add(new Test('Cyclic 3 Test', null, CyclicTestSetup3,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 57.5), new go.Point(65, 40), new go.Point(130, 22.5), new go.Point(195, 0), new go.Point(260, 40), new go.Point(195, 45)], test); }));

  ld_Backwards.add(new Test('Cyclic 4 Test', null, CyclicTestSetup4,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 22.5), new go.Point(65, 0), new go.Point(130, 45), new go.Point(195, 22.5), new go.Point(130, 0), new go.Point(65, 45)], test); }));

  ld_Backwards.add(new Test('Cyclic 5 Test', null, CyclicTestSetup5,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 17.5), new go.Point(130, 40), new go.Point(195, 0), new go.Point(65, 0)], test); }));

  ld_Backwards.add(new Test('Cyclic 6 Test', null, CyclicTestSetup6,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 67.5), new go.Point(65, 0), new go.Point(65, 67.5), new go.Point(130, 0), new go.Point(130, 45), new go.Point(130, 90), new go.Point(195, 85)], test); }));

  ld_Backwards.add(new Test('Cyclic 7 Test', null, CyclicTestSetup7,
    function(test) { LD_Default_Run(test, go.Link.Normal, go.Link.Bezier, go.Spot.LeftRightSides) },
    function(test) { CheckNodes([new go.Point(0, 40), new go.Point(195, 35), new go.Point(260, 57.5), new go.Point(325, 75), new go.Point(130, 40), new go.Point(65, 40)], test); }));

  var bugcoll = new TestCollection("bug")
  LDRoot.add(bugcoll);

  bugcoll.add(new Test("infinite bendStraighten", null,
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto", { resizable: true },
          $(go.Shape, "Rectangle", { fill: "lightgray" }),
          $(go.Panel, "Table",
            $(go.RowColumnDefinition,
              { column: 0, alignment: go.Spot.Left }),
            $(go.RowColumnDefinition,
              { column: 2, alignment: go.Spot.Right }),
            $(go.TextBlock,  // the node title
              {
                column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center,
                font: "bold 10pt sans-serif", margin: new go.Margin(4, 2)
              },
              new go.Binding("text", "key")),
            $(go.Panel, "Horizontal",
              { column: 0, row: 1 },
              $(go.Shape,  // the "A" port
                {
                  width: 6, height: 6, portId: "A", toSpot: go.Spot.Left,
                  toLinkable: true, toLinkableDuplicates: true
                }),  // allow user-drawn links from here
              $(go.TextBlock, "A")  // "A" port label
            ),
            $(go.Panel, "Horizontal",
              { column: 0, row: 2 },
              $(go.Shape,  // the "B" port
                {
                  width: 6, height: 6, portId: "B", toSpot: go.Spot.Left,
                  toLinkable: true, toLinkableDuplicates: true
                }),  // allow user-drawn links from here
              $(go.TextBlock, "B")  // "B" port label
            ),
            $(go.Panel, "Horizontal",
              { column: 2, row: 1 },
              $(go.TextBlock, "X"),  // "Out" port label
              $(go.Shape,  // the "Out" port
                {
                  width: 6, height: 6, portId: "X", fromSpot: go.Spot.Right,
                  fromLinkable: true, fromLinkableDuplicates: true
                })  // allow user-drawn links to here
            ),
            $(go.Panel, "Horizontal",
              { column: 2, row: 2 },
              $(go.TextBlock, "Y"),  // "Out" port label
              $(go.Shape,  // the "Out" port
                {
                  width: 6, height: 6, portId: "Y", fromSpot: go.Spot.Right,
                  fromLinkable: true, fromLinkableDuplicates: true
                })  // allow user-drawn links to here
            )
          )
        );
      diagram.model = $(go.GraphLinksModel,
          {
            linkFromPortIdProperty: "fromPort",  // required information:
            linkToPortIdProperty: "toPort",      // identifies data property names
            nodeDataArray: [
              { key: "Add1" },
              { key: "Add2" }
            ],
            linkDataArray: [
              { from: "Add1", fromPort: "X", to: "Add2", toPort: "A" }
            ]
          });
      diagram.layout = $(go.LayeredDigraphLayout, { columnSpacing: 10 });
    },
    function(test) {
      var diagram = test.diagram;
      test.assert(diagram.nodes.count === 2 && diagram.links.count === 1, "should have two nodes and one link");
      diagram.startTransaction();
      diagram.model.addLinkData({ from: "Add1", fromPort: "X", to: "Add2", toPort: "B" });
      diagram.commitTransaction("infinite layout?");
    },
    function(test) {
      var diagram = test.diagram;
      var n1 = diagram.findNodeForKey("Add1");
      var n2 = diagram.findNodeForKey("Add2");
      test.assert(n1.location.isReal() && n2.location.isReal() && n2.location.x > n1.location.x && Math.abs(n1.location.y - n2.location.y) < 20, "should have reasonable locations for the nodes after layout");
    }
    ));

  bugcoll.add(new Test("collapsing/expanding shift of group", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          {
            layout: $(go.LayeredDigraphLayout)
          },
          $(go.Panel, "Horizontal",
            $("SubGraphExpanderButton"),
            $(go.TextBlock, new go.Binding("text", "key"))
          ),
          $(go.Panel, "Auto",
            $(go.Shape, { fill: "whitesmoke" }),
            $(go.Placeholder)
          )
        );

      diagram.model = $(go.GraphLinksModel, {
        nodeDataArray: [
          { key: -1, isGroup: true },
          { key: -2, isGroup: true, group: -1 },
          { key: 0 },
          { key: 1, group: -1 },
          { key: 2, group: -1 },
          { key: 3, group: -1 },
          { key: 4, group: -1 },
          { key: 5, group: -1 },
          { key: 11, group: -2 },
          { key: 12, group: -2 },
          { key: 13, group: -2 }
        ],
        linkDataArray: [
          { from: 1, to: 11 },
          { from: 2, to: 3 },
          { from: 2, to: 4 },
          { from: 5, to: 4 },
          { from: 5, to: 3 },
          { from: 2, to: 3 },
          { from: 11, to: 12 },
          { from: 13, to: 12 },
          { from: 12, to: 2 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      var g1 = diagram.findNodeForKey(-1);
      var g2 = diagram.findNodeForKey(-2);
      test.g1pos = g1.position.copy();
      test.g2pos = g2.position.copy();
      diagram.commandHandler.collapseSubGraph(g2);
      diagram.commandHandler.expandSubGraph(g2);
      diagram.commandHandler.collapseSubGraph(g2);
    },
    function(test) {
      var diagram = test.diagram;
      var g1 = diagram.findNodeForKey(-1);
      test.assert(test.g1pos.equalsApprox(g1.position), "collapsing & expanding group 2 shouldn't have moved group 1");
      diagram.commandHandler.collapseSubGraph(g1);
      diagram.commandHandler.expandSubGraph(g1);
      test.assert(test.g1pos.equalsApprox(g1.position), "collapsing & expanding group 1 shouldn't have moved group 1");
    }
    ));

  bugcoll.add(new Test("collapsing/expanding hanging link", null,
    function(test) {
      var diagram = test.diagram;
      diagram.reset();
      var $ = go.GraphObject.make;

      diagram.layout = $(go.LayeredDigraphLayout);

      diagram.nodeTemplate =
        $(go.Node, "Auto",
          { desiredSize: new go.Size(30, 30) },
          $(go.Shape, "RoundedRectangle", { strokeWidth: 0, fill: "lightgray" }),
          $(go.TextBlock, { margin: 5 }, new go.Binding("text", "key"))

        )
      diagram.groupTemplate =
        $(go.Group, "Vertical",
          $("SubGraphExpanderButton"),
          $(go.Panel, "Auto",
            $(go.Shape, { strokeWidth: 0, fill: "gray" }),
            $(go.Placeholder)
          )
        );

      diagram.linkTemplate =
        $(go.Link, { curve: go.Link.Bezier },
          $(go.Shape)
        );

      diagram.model = $(go.GraphLinksModel, {
        nodeDataArray: [
          { key: 0, isGroup: true },
          { key: 1 },
          { key: 2, group: 0 }
        ],
        linkDataArray: [
          { from: 1, to: 2 }
        ]
      });
    },
    function(test) {
      var diagram = test.diagram;
      var g = diagram.findNodeForKey(0);
      diagram.commandHandler.collapseSubGraph(g);
    },
    function(test) {
      CheckLinks(test, [[
        new go.Point(30, 15),
        new go.Point(40, 15),
        new go.Point(65, 15),
        new go.Point(75, 15)
      ]]);
    }
  ));

  bugcoll.add(new Test("alignOption custom layering", null,
    function(test) {
      var $ = go.GraphObject.make;

      test.diagram.model = $(go.GraphLinksModel,
        {
          nodeDataArray: [
            { key: 1 },
            { key: 2, layer: 2 },
            { key: 3 }
          ],
          linkDataArray: [
            { from: 1, to: 2 },
            { from: 2, to: 3 }
          ]
        }
      );
    },
    function(test) {
      var $ = go.GraphObject.make;
      var diagram = test.diagram;
      diagram.nodeTemplate =
        $(go.Node, "Spot",
          { locationSpot: go.Spot.Center },
          $(go.Shape, "Rectangle", { fill: "lightgray", stroke: null, desiredSize: new go.Size(30, 30) },
            new go.Binding("width", "w")
          ),
          $(go.TextBlock, { textAlign: "center" }, new go.Binding("text", "key"), new go.Binding("width", "w"))
        );

      diagram.linkTemplate =
        $(go.Link,
          $(go.Shape, { strokeWidth: 3, stroke: "#333" }));

      var layout = new CustomLDLayout();
      layout.direction = 90;
      diagram.layout = layout;
    },
    function(test) {
      CheckNodes([
        new go.Point(15.5, 15.5),
        new go.Point(71.5, 15.5),
        new go.Point(71.5, 91.5)
      ], test);
    }
  ));


  var groupcoll = new TestCollection("with members")
  LDRoot.add(groupcoll);

  function setupGroups(test) {
    var diagram = test.diagram;
    diagram.reset();
    var $ = go.GraphObject.make;

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("height"),
        new go.Binding("width"),
        $(go.Shape, { fill: "white" },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          new go.Binding("text").makeTwoWay())
      );

    diagram.groupTemplate =
      $(go.Group, "Auto",
        { layout: $(go.LayeredDigraphLayout, { columnSpacing: 10 }) },
        $(go.Shape, { fill: null }),
        $(go.Panel, "Vertical",
          $(go.Panel, "Table",
            { background: "darkblue", stretch: go.GraphObject.Horizontal, height: 20 },
            $(go.TextBlock,
              { font: "bold 10pt sans-serif", stroke: "white" },
              new go.Binding("text"))
          ),
          $(go.Placeholder, { padding: 10 })
        )
      );
  }

  groupcoll.add(new Test("out of groups", null, setupGroups,
    function(test) {
      test.diagram.model = new go.GraphLinksModel(
        [
          { key: 0, text: "G1", isGroup: true },
          { key: 1, text: "Alpha", color: "lightblue", group: 5, width: 80, height: 30 },
          { key: 2, text: "Beta", color: "orange", group: 5, width: 100, height: 100 },
          { key: 3, text: "Gamma", color: "lightgreen", group: 0, width: 80, height: 30 },
          { key: 4, text: "Delta", color: "pink", group: 5, width: 80, height: 30 },
          { key: 5, text: "G2", isGroup: true, group: 0 }
        ],
        [
          { from: 2, to: 1 },
          { from: 4, to: 3 },
          { from: 2, to: 4 }
        ]);
    },
    function(test) {
      test.assertAllNodeLocations([new go.Point(0.5, 20.5), new go.Point(166.0, 76.0), new go.Point(21.0, 61.0), new go.Point(301.5, 86.0), new go.Point(166.0, 116.0), new go.Point(11.0, 51.0)]);
    }
  ));

  groupcoll.add(new Test("into groups", null, setupGroups,
    function(test) {
      test.diagram.model = new go.GraphLinksModel(
        [
          { key: 0, text: "G1", isGroup: true },
          { key: 1, text: "Alpha", color: "lightblue", group: 5, width: 80, height: 30 },
          { key: 2, text: "Beta", color: "orange", group: 5, width: 100, height: 100 },
          { key: 3, text: "Gamma", color: "lightgreen", group: 0, width: 80, height: 30 },
          { key: 4, text: "Delta", color: "pink", group: 5, width: 80, height: 30 },
          { key: 5, text: "G2", isGroup: true, group: 0 }
        ],
        [
          { from: 1, to: 2 },
          { from: 3, to: 4 },
          { from: 4, to: 2 }
        ]);
    },
    function(test) {
      //test.dumpAllNodeLocations();
      test.assertAllNodeLocations([new go.Point(0.5, 20.5), new go.Point(146.0, 76.0), new go.Point(271.0, 61.0), new go.Point(10.5, 86.0), new go.Point(146.0, 116.0), new go.Point(136.0, 51.0)]);
    }
  ));

})();

class CustomLDLayout extends go.LayeredDigraphLayout {
  constructor() {
    super();
    this.alignOption = go.LayeredDigraphLayout.AlignAll;
  }

  assignLayers() {
    super.assignLayers();
    var maxlayer = this.maxLayer;
    // now assign specific layers
    var it = this.network.vertexes.iterator;
    while (it.next()) {
      var v = it.value;
      if (v.node !== null) {
        var lay = v.node.data.layer;
        if (typeof lay === "number" && lay >= 0 && lay <= maxlayer) {
          v.layer = lay;
        }
      }
    }
  }
}
