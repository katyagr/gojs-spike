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

import * as go from 'gojs';
import {
  PackedLayout,
  PackMode,
  PackShape,
  SortMode,
  SortOrder,
} from '../../extensionsJSM/PackedLayout.js';
import { Test, TestCollection, TestRoot } from './gotest.js';

// simplified Park-Miller PRNG
let seed = 1347861; // hardcoded seed for repeatable tests
function simpleRandom(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

interface INode {
  width: number;
  height: number;
  fill?: string;
  figure: string;
  text?: string;
}

interface GraphGenerationParams {
  numNodes: number;
  minSide: number;
  maxSide: number;
  scaleFactor?: number; // for width and height
  wideNodes?: boolean;
  wideAndTallNodes?: boolean;
  squareNodes?: boolean;
  nodeShape?: string;
}

(function () {
  function AllNodesLocatedCheck(test: Test & any) {
    const it = test.diagram.nodes;
    while (it.next()) {
      const n = it.value;
      const loc = n.location;
      test.assert(loc.isReal(), 'Unassigned location for node: ' + n.key);
    }
  }

  function NoIntersectionsCheck(test: Test & any) {
    const it = test.diagram.nodes;
    const nodes = new Array<Node>();
    outer: while (it.next()) {
      const n = it.value;
      const r1 = n.actualBounds;
      const it2 = test.diagram.nodes;
      while (it2.next()) {
        const n2 = it2.value;
        if (n2.data.isPackedNode && n2 !== n) {
          const r2 = n2.actualBounds;
          let intersects: boolean;
          if (test.circles) {
            const ar = r1.height / 2;
            const br = r2.height / 2;
            const dist = Math.sqrt(r1.center.distanceSquaredPoint(r2.center));
            const difference = dist - (ar + br);
            intersects = difference < -0.0000001;
          } else {
            intersects = !(
              r2.left >= r1.right ||
              r2.right <= r1.left ||
              r2.top >= r1.bottom ||
              r2.bottom <= r1.top
            );
          }
          test.assert(!intersects, 'Two (or more!) nodes intersect: ' + n.key + ' ' + n2.key);
          if (intersects) {
            // avoid spamming alerts
            break outer;
          }
        }
      }
    }
  }

  function NodePositionsCheck(test: Test & any, positions: any) {
    const it = test.diagram.nodes;
    while (it.next()) {
      const n = it.value;
      const pos = positions[n.key];
      test.assert(
        n.actualBounds.x === pos.x && n.actualBounds.y === pos.y,
        'Position for ' + n.key + ' should be ' + pos + ', not ' + n.actualBounds.position
      );
    }
  }

  function SetupGraph(
    test: Test & any,
    genParams: GraphGenerationParams | null,
    layoutParams?: Object,
    nodeSizes?: Array<go.Size>
  ) {
    if (!genParams) genParams = { numNodes: 0, minSide: 0, maxSide: 0 };

    // define the Node template
    const $ = go.GraphObject.make;
    test.diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(
        go.Shape,
        { strokeWidth: 0 },
        new go.Binding('figure', 'figure'),
        new go.Binding('width', 'width'),
        new go.Binding('height', 'height'),
        new go.Binding('fill', 'fill')
      ),
      $(
        go.TextBlock,
        { font: '10pt sans-serif' },
        new go.Binding('text', 'key'),
        new go.Binding('stroke', 'textColor'),
        new go.Binding('font', 'textFont')
      ),
      {
        toolTip: $(
          go.Adornment,
          'Auto',
          $(go.Shape, { fill: '#FFFFCC' }),
          $(go.TextBlock, { margin: 4 }, new go.Binding('text', 'key'))
        ), // end of Adornment
      }
    );

    const layout = new PackedLayout();
    layout.arrangesToOrigin = false; // all hardcoded positions were written with this set to false, so to avoid redoing them all we set it to false here too
    if (layoutParams) {
      for (const k in layoutParams) {
        (layout as any)[k] = (layoutParams as any)[k];
      }
    }
    test.diagram.layout = layout;
    const m = new go.GraphLinksModel();
    const nodeArray = new Array<INode>();

    // generate a seed based on the test name for repeatibility on individual tests
    let hash = 0;
    for (let i = 0; i < test.name.length; i++) {
      const character = test.name.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash = hash & hash; // convert to integer
    }
    seed = Math.abs(hash);

    for (let i = 0; i < (nodeSizes ? nodeSizes.length : genParams.numNodes); i++) {
      let width: number;
      let height: number;
      if (nodeSizes) {
        width = nodeSizes[i].width;
        height = nodeSizes[i].height;
      } else {
        width =
          Math.floor(simpleRandom() * (genParams.maxSide - genParams.minSide + 1)) +
          genParams.minSide;
        height =
          Math.floor(simpleRandom() * (genParams.maxSide - genParams.minSide + 1)) +
          genParams.minSide;
      }
      const node = {
        key: i + 1,
        width: width,
        height: height,
        figure: genParams ? (genParams.nodeShape ? genParams.nodeShape : 'Rectangle') : 'Rectangle',
        fill: go.Brush.randomColor(),
        isPackedNode: true, // only check intersections on nodes that were created by us
      };

      if (genParams) {
        if (genParams.scaleFactor) {
          node.width *= genParams.scaleFactor;
          node.height *= genParams.scaleFactor;
        }

        if (genParams.wideNodes) {
          node.height /= 5;
          node.height = Math.floor(node.height);
        } else if (genParams.wideAndTallNodes) {
          if (simpleRandom() > 0.5) {
            node.width /= 5;
            node.width = Math.floor(node.width);
          } else {
            node.height /= 5;
            node.height = Math.floor(node.height);
          }
        } else if (genParams.squareNodes) {
          node.width = node.height;
        }
      }

      nodeArray.push(node);
    }

    m.nodeDataArray = nodeArray;
    test.diagram.model = m;
  }

  const packedTests = new TestCollection('PackedLayout');
  // not working in typescript?
  // uncomment this + remove node template definition in SetupGraph() if this starts working again
  // packedTests.preSetup = function(test: Test & any) {
  //   // define the Node template
  //   const $ = go.GraphObject.make;
  //   test.diagram.nodeTemplate =
  //     $(go.Node, 'Auto',
  //       $(go.Shape,
  //         {strokeWidth: 0},
  //         new go.Binding('figure', 'figure'),
  //         new go.Binding('width', 'width'),
  //         new go.Binding('height', 'height'),
  //         new go.Binding('fill', 'fill')),
  //       $(go.TextBlock, {font: '12pt'}, new go.Binding('text', 'text'), new go.Binding('stroke', 'textColor'), new go.Binding('font', 'textFont'))
  //     );
  //   };
  TestRoot.add(packedTests);

  packedTests.add(
    new Test(
      'Aspect ratio',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            aspectRatio: 3,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        const actualAspectRatio =
          test.diagram.documentBounds.width / test.diagram.documentBounds.height;
        test.assert(
          Math.round(actualAspectRatio) === 3,
          'Actual aspect ratio should be 3, not ' + actualAspectRatio
        );
      }
    )
  );

  const fixedSizeAcceptableError = 60;

  packedTests.add(
    new Test(
      'Fit (compress)',
      null,
      function (test: Test & any) {
        test.width = 200;
        test.height = 400;
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            packMode: PackMode.Fit,
            size: new go.Size(test.width, test.height),
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        const width = test.diagram.documentBounds.width;
        const height = test.diagram.documentBounds.height;
        test.assert(
          width > test.width - fixedSizeAcceptableError &&
            width < test.width + fixedSizeAcceptableError,
          'Width ' + width + ' is not within acceptable range of ' + test.width
        );
        test.assert(
          height > test.height - fixedSizeAcceptableError &&
            height < test.height + fixedSizeAcceptableError,
          'Height ' + height + ' is not within acceptable range of ' + test.height
        );
      }
    )
  );

  packedTests.add(
    new Test(
      'Fit (expand)',
      null,
      function (test: Test & any) {
        test.width = 600;
        test.height = 800;
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            packMode: PackMode.Fit,
            size: new go.Size(test.width, test.height),
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        test.assert(
          test.diagram.layout._fixedSizeModeSpacing !== undefined,
          'Cannot find _fixedSizeModeSpacing property on PackedLayout'
        );
        test.assert(
          test.diagram.layout._fixedSizeModeSpacing === 0,
          '_fixedSizeModeSpacing should be 0, packMode.Fit should not ever cause the layout to expand'
        );
      }
    )
  );

  packedTests.add(
    new Test(
      'ExpandToFit (compress)',
      null,
      function (test: Test & any) {
        test.width = 300;
        test.height = 400;
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            packMode: PackMode.ExpandToFit,
            size: new go.Size(test.width, test.height),
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        const width = test.diagram.documentBounds.width;
        const height = test.diagram.documentBounds.height;
        test.assert(
          width > test.width - fixedSizeAcceptableError &&
            width < test.width + fixedSizeAcceptableError,
          'Width ' + width + ' is not within acceptable range of ' + test.width
        );
        test.assert(
          height > test.height - fixedSizeAcceptableError &&
            height < test.height + fixedSizeAcceptableError,
          'Height ' + height + ' is not within acceptable range of ' + test.height
        );
      }
    )
  );

  packedTests.add(
    new Test(
      'ExpandToFit (expand)',
      null,
      function (test: Test & any) {
        test.width = 800;
        test.height = 1000;
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            packMode: PackMode.ExpandToFit,
            size: new go.Size(test.width, test.height),
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        const width = test.diagram.documentBounds.width;
        const height = test.diagram.documentBounds.height;
        test.assert(
          width > test.width - fixedSizeAcceptableError &&
            width < test.width + fixedSizeAcceptableError,
          'Width ' + width + ' is not within acceptable range of ' + test.width
        );
        test.assert(
          height > test.height - fixedSizeAcceptableError &&
            height < test.height + fixedSizeAcceptableError,
          'Height ' + height + ' is not within acceptable range of ' + test.height
        );
      }
    )
  );

  packedTests.add(
    new Test(
      'ExpandToFit (expand to viewport)',
      null,
      function (test: Test & any) {
        test.width = test.diagram.viewportBounds.width;
        test.height = test.diagram.viewportBounds.height;
        SetupGraph(
          test,
          {
            numNodes: 100,
            minSide: 40,
            maxSide: 60,
          },
          {
            packMode: PackMode.ExpandToFit,
            size: new go.Size(Number.NaN, Number.NaN),
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        const width = test.diagram.documentBounds.width;
        const height = test.diagram.documentBounds.height;
        test.assert(
          width > test.width - fixedSizeAcceptableError &&
            width < test.width + fixedSizeAcceptableError,
          'Width ' + width + ' is not within acceptable range of ' + test.width
        );
        test.assert(
          height > test.height - fixedSizeAcceptableError &&
            height < test.height + fixedSizeAcceptableError,
          'Height ' + height + ' is not within acceptable range of ' + test.height
        );
      }
    )
  );

  packedTests.add(
    new Test(
      'sortMode none',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            sortMode: SortMode.None,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(30, 20),
          3: new go.Point(-40, 5),
          4: new go.Point(30, -10),
          5: new go.Point(-10, 50),
          6: new go.Point(40, 30),
          7: new go.Point(0, -40),
          8: new go.Point(-35, 80),
          9: new go.Point(-30, -25),
          10: new go.Point(50, -10),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'sortMode max side',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            sortMode: SortMode.MaxSide,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(35, -50),
          2: new go.Point(15, 40),
          3: new go.Point(65, -40),
          4: new go.Point(5, 10),
          5: new go.Point(25, 10),
          6: new go.Point(75, 10),
          7: new go.Point(35, 40),
          8: new go.Point(0, 0),
          9: new go.Point(65, 40),
          10: new go.Point(-15, -40),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'sortMode area',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            sortMode: SortMode.Area,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(50, -5),
          2: new go.Point(50, 45),
          3: new go.Point(5, -40),
          4: new go.Point(45, -35),
          5: new go.Point(0, 40),
          6: new go.Point(-40, 5),
          7: new go.Point(-25, -40),
          8: new go.Point(-25, 70),
          9: new go.Point(-30, 35),
          10: new go.Point(0, 0),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'sortOrder ascending',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            sortMode: SortMode.Area,
            sortOrder: SortOrder.Ascending,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          2: new go.Point(0, 0),
          4: new go.Point(0, -30),
          9: new go.Point(-5, 10),
          8: new go.Point(-40, 40),
          6: new go.Point(20, -20),
          7: new go.Point(-30, -30),
          1: new go.Point(-60, -10),
          5: new go.Point(25, 10),
          3: new go.Point(20, -60),
          10: new go.Point(-30, -70),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'Custom comparer',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            sortMode: SortMode.Area,
            comparer: (a: go.Node, b: go.Node): number => {
              return a.actualBounds.height - b.actualBounds.height;
            },
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(-45, -60),
          2: new go.Point(0, 0),
          3: new go.Point(20, 30),
          4: new go.Point(0, 10),
          5: new go.Point(-15, -40),
          6: new go.Point(20, 0),
          7: new go.Point(-30, 30),
          8: new go.Point(-40, -10),
          9: new go.Point(-30, 0),
          10: new go.Point(-15, -80),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'packShape Elliptical',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 21,
            minSide: 40,
            maxSide: 40,
          },
          {
            packShape: PackShape.Elliptical,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(0, -40),
          3: new go.Point(40, 0),
          4: new go.Point(0, 40),
          5: new go.Point(-40, 0),
          6: new go.Point(40, -40),
          7: new go.Point(40, 40),
          8: new go.Point(-40, 40),
          9: new go.Point(-40, -40),
          10: new go.Point(80, 0),
          11: new go.Point(0, 80),
          12: new go.Point(-80, 0),
          13: new go.Point(0, -80),
          14: new go.Point(80, -40),
          15: new go.Point(80, 40),
          16: new go.Point(40, 80),
          17: new go.Point(-40, 80),
          18: new go.Point(-80, 40),
          19: new go.Point(-80, -40),
          20: new go.Point(-40, -80),
          21: new go.Point(40, -80),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'packShape Rectangular',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 16,
            minSide: 40,
            maxSide: 40,
          },
          {
            packShape: PackShape.Rectangular,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(0, -40),
          3: new go.Point(40, -40),
          4: new go.Point(40, 0),
          5: new go.Point(40, 40),
          6: new go.Point(0, 40),
          7: new go.Point(-40, 40),
          8: new go.Point(-40, 0),
          9: new go.Point(-40, -40),
          10: new go.Point(-40, -80),
          11: new go.Point(0, -80),
          12: new go.Point(40, -80),
          13: new go.Point(80, -80),
          14: new go.Point(80, -40),
          15: new go.Point(80, 0),
          16: new go.Point(80, 40),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  packedTests.add(
    new Test(
      'Enclosing circle around rectangles',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 30,
          minSide: 40,
          maxSide: 40,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        const c = test.diagram.layout.enclosingCircle;

        // only test size and position to three decimal places of precision in order to account for imprecise algorithms
        function round(num: number): number {
          return Math.round(num * 1000) / 1000;
        }

        // hardcoded correct values
        const d = 293.471;
        const x = -121.735;
        const y = -129.235;
        test.assert(
          round(c.width) === d && round(c.height) === d,
          'Enclosing circle size not correct, should be ' +
            d +
            ' instead of ' +
            round(c.width) +
            ', ' +
            round(c.height)
        );
        test.assert(
          round(c.x) === x && round(c.y) === y,
          'Enclosing circle position not correct, should be ' +
            x +
            ', ' +
            y +
            ' instead of ' +
            round(c.x) +
            ', ' +
            round(c.y)
        );

        // show the enclosing circle as a node on the diagram (to more easily see if it's correct)
        const $ = go.GraphObject.make;
        const n = $(
          go.Node,
          'Auto',
          {
            width: c.width,
            height: c.height,
            location: new go.Point(c.x, c.y),
            isLayoutPositioned: false,
          },
          $(go.Shape, { figure: 'Circle', fill: null, stroke: 'black' })
        );
        test.diagram.add(n);
      }
    )
  );

  packedTests.add(
    new Test(
      'Enclosing circle around circles',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 30,
            minSide: 30,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        const c = test.diagram.layout.enclosingCircle;

        // only test size and position to three decimal places of precision in order to account for imprecise algorithms
        function round(num: number): number {
          return Math.round(num * 1000) / 1000;
        }

        // hardcoded correct values
        const d = 332.214;
        const x = -171.081;
        const y = -148.851;
        test.assert(
          round(c.width) === d && round(c.height) === d,
          'Enclosing circle size not correct, should be ' +
            d +
            ' instead of ' +
            round(c.width) +
            ', ' +
            round(c.height)
        );
        test.assert(
          round(c.x) === x && round(c.y) === y,
          'Enclosing circle position not correct, should be ' +
            x +
            ', ' +
            y +
            ' instead of ' +
            round(c.x) +
            ', ' +
            round(c.y)
        );

        // show the enclosing circle as a node on the diagram (to more easily see if it's correct)
        const $ = go.GraphObject.make;
        const n = $(
          go.Node,
          'Auto',
          {
            width: c.width,
            height: c.height,
            location: new go.Point(c.x, c.y),
            isLayoutPositioned: false,
          },
          $(go.Shape, { figure: 'Circle', fill: null, stroke: 'black' })
        );
        test.diagram.add(n);
      }
    )
  );

  /***************************
   * RECTANGLE PACKING TESTS *
   ***************************/

  const rectanglePackingTests = new TestCollection('Rectangle packing');
  packedTests.add(rectanglePackingTests);

  rectanglePackingTests.add(
    new Test(
      'Zero nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 0,
          minSide: 40,
          maxSide: 60,
        });
      },
      null,
      null
    )
  );

  rectanglePackingTests.add(
    new Test(
      'One node',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 1,
          minSide: 40,
          maxSide: 60,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Two nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 2,
          minSide: 40,
          maxSide: 60,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Three nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 3,
          minSide: 40,
          maxSide: 60,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Basic pregenerated',
      null,
      function (test: Test & any) {
        SetupGraph(test, null, undefined, [
          new go.Size(40, 40),
          new go.Size(60, 40),
          new go.Size(50, 40),
          new go.Size(60, 50),
          new go.Size(60, 50),
          new go.Size(60, 60),
          new go.Size(60, 50),
          new go.Size(50, 60),
          new go.Size(60, 40),
          new go.Size(40, 50),
          new go.Size(60, 40),
          new go.Size(50, 60),
          new go.Size(40, 50),
          new go.Size(50, 50),
          new go.Size(50, 60),
        ]);
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      '500 nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 40,
          maxSide: 60,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      '500 wide nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 40,
          maxSide: 60,
          wideNodes: true,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      '500 wide or tall nodes',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 40,
          maxSide: 60,
          wideAndTallNodes: true,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Nodes with 0 width/height',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 25,
          minSide: 0,
          maxSide: 2,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Odd starting shape',
      null,
      function (test: Test & any) {
        SetupGraph(test, null, undefined, [
          new go.Size(12, 40),
          new go.Size(50, 10),
          new go.Size(50, 10),
          new go.Size(10, 60),
        ]);
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Slightly varied wide nodes',
      null,
      function (test: Test & any) {
        const sizes = new Array<go.Size>(75);
        for (let i = 0; i < 50; i++) {
          sizes[i] = new go.Size(160 + Math.floor(simpleRandom() * 5), 5);
        }
        for (let i = 50; i < 75; i++) {
          sizes[i] = new go.Size(5, 220);
        }
        SetupGraph(test, null, undefined, sizes);
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Floating point stability',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 20,
            maxSide: 60,
          },
          {
            spacing: 0.634517826124,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Positive spacing',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            spacing: 10,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(40, 20),
          3: new go.Point(-50, 5),
          4: new go.Point(40, -20),
          5: new go.Point(-10, 60),
          6: new go.Point(50, 40),
          7: new go.Point(0, -50),
          8: new go.Point(-35, 100),
          9: new go.Point(-40, -35),
          10: new go.Point(70, -10),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Small negative spacing',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            spacing: -5,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(25, 20),
          3: new go.Point(-35, 5),
          4: new go.Point(25, -5),
          5: new go.Point(-10, 45),
          6: new go.Point(5, -30),
          7: new go.Point(35, 25),
          8: new go.Point(-70, -5),
          9: new go.Point(40, 0),
          10: new go.Point(-40, -40),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Medium negative spacing',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            spacing: -30,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-0.1, 9.95),
          3: new go.Point(0.1, 5),
          4: new go.Point(-0.1, 10.049999999999999),
          5: new go.Point(-9.95, -0.1),
          6: new go.Point(-10, 9.85),
          7: new go.Point(-0.2, 9.95),
          8: new go.Point(-34.95, 20),
          9: new go.Point(-0.1, 10.149999999999999),
          10: new go.Point(-20.2, 10),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Huge negative spacing',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          null,
          {
            spacing: -1000,
          },
          [
            new go.Size(30, 50),
            new go.Size(20, 10),
            new go.Size(40, 40),
            new go.Size(20, 30),
            new go.Size(50, 30),
            new go.Size(40, 30),
            new go.Size(30, 40),
            new go.Size(100, 10),
            new go.Size(30, 30),
            new go.Size(50, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(0, -0.1),
          3: new go.Point(-0.1, 0),
          4: new go.Point(0.1, 0),
          5: new go.Point(0, 0.1),
          6: new go.Point(0.1, -0.1),
          7: new go.Point(-0.1, 0.1),
          8: new go.Point(-0.1, -0.1),
          9: new go.Point(0.1, 0.1),
          10: new go.Point(0.2, 0),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      '500 nodes with huge negative spacing',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 20,
            maxSide: 60,
          },
          {
            spacing: -1000,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Extreme variation',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 1,
          maxSide: 60,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Extreme variation #2',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 1,
          maxSide: 90,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Extreme variation #3',
      null,
      function (test: Test & any) {
        SetupGraph(test, {
          numNodes: 500,
          minSide: 1,
          maxSide: 120,
        });
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Extreme variation (area sorted desc.)',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 1,
            maxSide: 60,
          },
          {
            sortMode: SortMode.Area,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  rectanglePackingTests.add(
    new Test(
      'Extreme variation (area sorted asc.)',
      null,
      function (test: Test & any) {
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 1,
            maxSide: 60,
          },
          {
            sortMode: SortMode.Area,
            sortOrder: SortOrder.Ascending,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  /************************
   * CIRCLE PACKING TESTS *
   ************************/

  const circlePackingTests = new TestCollection('Circle packing');
  packedTests.add(circlePackingTests);

  circlePackingTests.add(
    new Test(
      'Zero nodes',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 0,
            minSide: 40,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      null
    )
  );

  circlePackingTests.add(
    new Test(
      'One node',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 1,
            minSide: 40,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Two nodes',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 2,
            minSide: 40,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Three nodes',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 3,
            minSide: 40,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      '500 nodes',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 40,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Nodes with 0 width/height',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 25,
            minSide: 0,
            maxSide: 2,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Floating point stability',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 30,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
            spacing: 0.6172386721,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Spiral packing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          null,
          {
            packShape: PackShape.Spiral,
          },
          [
            new go.Size(60, 60),
            new go.Size(60, 60),
            new go.Size(60, 60),
            new go.Size(60, 60),
            new go.Size(60, 60),
            new go.Size(60, 60),
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(40, 40),
            new go.Size(40, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-60, 0),
          3: new go.Point(-30, -51.96152422706632),
          4: new go.Point(-30, 51.96152422706632),
          5: new go.Point(30.000000000000007, 51.96152422706632),
          6: new go.Point(60, -3.552713678800501e-15),
          7: new go.Point(35, -41.09772228646444),
          8: new go.Point(17.479279794784652, -75.05689529409392),
          9: new go.Point(-18.780016630315295, -91.94663841696982),
          10: new go.Point(-55.82010241201345, -76.84590845830749),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Positive spacing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          null,
          {
            spacing: 10,
            hasCircularNodes: true,
          },
          [
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-50, 5),
          3: new go.Point(-27.272727272727273, -39.536177141512326),
          4: new go.Point(-38.18181818181818, 50.892458723415984),
          5: new go.Point(21.517378658943528, -56.00894942460215),
          6: new go.Point(-77.20582442835715, -36.95048411131159),
          7: new go.Point(-27.593438909805364, -108.75029181687842),
          8: new go.Point(-76.4204644247657, -86.94431582748192),
          9: new go.Point(-119.36548763816835, 3.702808597371387),
          10: new go.Point(58.79010593167081, -6.472772283089821),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Small negative spacing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          null,
          {
            spacing: -5,
            hasCircularNodes: true,
          },
          [
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-35, 5),
          3: new go.Point(-19.6875, -26.47264437173972),
          4: new go.Point(-30.9375, 37.74629918191749),
          5: new go.Point(13.651625429015624, -42.87928547849013),
          6: new go.Point(-54.59985955019994, -23.997336181319078),
          7: new go.Point(-28.398693551609483, -81.45418478487572),
          8: new go.Point(-61.440034095479994, -58.32242922110708),
          9: new go.Point(-89.14753121554011, 3.7175390777965838),
          10: new go.Point(43.33912542901562, -6.4066411067504045),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Medium negative spacing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          null,
          {
            spacing: -40,
            hasCircularNodes: true,
          },
          [
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-0.1, 4.95),
          3: new go.Point(-0.09900990099009885, 4.850004901600365),
          4: new go.Point(-19.8019801980198, -2.570723931408841),
          5: new go.Point(-4.81622456087107, -8.763788049654227),
          6: new go.Point(-3.7940023386488524, -0.6396642763279513),
          7: new go.Point(4.985755637148733, -16.19306411824539),
          8: new go.Point(-3.8560831168978593, -0.7180605579489548),
          9: new go.Point(-22.049509518292233, -22.44403799712309),
          10: new go.Point(0.16490649064906954, 6.564118987797242),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Huge negative spacing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          null,
          {
            spacing: -1000,
            hasCircularNodes: true,
          },
          [
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(50, 50),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
            new go.Size(60, 60),
            new go.Size(40, 40),
          ]
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        // hardcoded positions
        const positions = {
          1: new go.Point(0, 0),
          2: new go.Point(-0.1, 0),
          3: new go.Point(-0.05, -0.08660254037844388),
          4: new go.Point(-0.05, 0.08660254037844388),
          5: new go.Point(-0.15000000000000002, -0.08660254037844388),
          6: new go.Point(0.05, -0.08660254037844388),
          7: new go.Point(0, -0.17320508075688776),
          8: new go.Point(-0.1, -0.17320508075688773),
          9: new go.Point(0.10000000000000002, 0),
          10: new go.Point(-0.2, 0),
        };
        NodePositionsCheck(test, positions);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      '500 nodes with huge negative spacing',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 20,
            maxSide: 60,
            squareNodes: true,
          },
          {
            spacing: -1000,
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Extreme variation',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 1,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Extreme variation (area sorted desc.)',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 1,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
            sortMode: SortMode.Area,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );

  circlePackingTests.add(
    new Test(
      'Extreme variation (area sorted asc.)',
      null,
      function (test: Test & any) {
        test.circles = true;
        SetupGraph(
          test,
          {
            numNodes: 500,
            minSide: 1,
            maxSide: 60,
            squareNodes: true,
            nodeShape: 'Ellipse',
          },
          {
            hasCircularNodes: true,
            sortMode: SortMode.Area,
            sortOrder: SortOrder.Ascending,
          }
        );
      },
      null,
      function (test: Test & any) {
        AllNodesLocatedCheck(test);
        NoIntersectionsCheck(test);
      }
    )
  );
})();
