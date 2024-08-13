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

import { Point, Rect, Size } from 'gojs';
import { Quadtree } from '../../extensionsJSM/Quadtree.js';
import { Test, TestCollection, TestRoot } from './gotest.js';

(function () {
  const quadtests = new TestCollection('Quadtree');
  TestRoot.add(quadtests);

  quadtests.add(
    new Test(
      'basic insert',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();
        /*
         * Quadtree (that should be) created by the below rect array
         *   __________________________________
         *  |   |   |   |    |        |        |
         *  |___|_0_|_2_|__3_|   11   |   13   |
         *  |   |   |   |    |        |        |
         *  |_1_|_4_|_5_|__6_|________|________|
         *  |       |   |    |        |        |
         *  |       |_7_|__8_|   12   |   14   |
         *  |       |   |    |        |        |
         *  |_______|_9_|_10_|________|________|
         *  |                |                 |
         *  |                |                 |
         *  |                |                 |
         *  |       15       |                 |
         *  |                |                 |
         *  |                |                 |
         *  |                |                 |
         *  |________________|_________________|
         *
         */

        test.rects = [
          [new Rect(1, 0, 1, 1), '0'],
          [new Rect(0, 1, 1, 1), '1'],
          [new Rect(2, 0, 1, 1), '2'],
          [new Rect(3, 0, 1, 1), '3'],
          [new Rect(1, 1, 1, 1), '4'],
          [new Rect(2, 1, 1, 1), '5'],
          [new Rect(3, 1, 1, 1), '6'],
          [new Rect(2, 2, 1, 1), '7'],
          [new Rect(3, 2, 1, 1), '8'],
          [new Rect(2, 3, 1, 1), '9'],
          [new Rect(3, 3, 1, 1), '10'],
          [new Rect(4, 0, 2, 2), '11'],
          [new Rect(4, 2, 2, 2), '12'],
          [new Rect(6, 0, 2, 2), '13'],
          [new Rect(6, 2, 2, 2), '14'],
          [new Rect(2, 6, 1, 1), '15'],
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        // init tests
        test.assert(
          test.tree.bounds.x === 0 &&
            test.tree.bounds.y === 0 &&
            test.tree.bounds.width === 8 &&
            test.tree.bounds.height === 8,
          'root bounds not initialized correctly'
        );

        // for convenience
        const tr = test.tree.root.nodes[0]; // top right quadrant
        const tl = test.tree.root.nodes[1]; // top left quadrant
        const bl = test.tree.root.nodes[2]; // bottom left quadrant
        const br = test.tree.root.nodes[3]; // bottom right quadrant

        // root node tests
        test.assert(test.tree.root.objects.length === 0, 'root should have no objects');

        // top right quadrant tests
        test.assert(tr.objects.length === 0, 'tr should have no objects');
        test.assert(tr.nodes[0].nodes[0] === null, 'tr.nodes[0] should not be split');
        test.assert(tr.nodes[0].objects.length === 1, 'tr.nodes[0] should have one object');
        test.assert(
          tr.nodes[0].objects[0] === test.rects[13][1],
          'tr.nodes[0].objects[0] should be rects[13]'
        );
        test.assert(tr.nodes[1].objects.length === 1, 'tr.nodes[1] should have one object');
        test.assert(
          tr.nodes[1].objects[0] === test.rects[11][1],
          'tr.nodes[1].objects[0] should be rects[11]'
        );
        test.assert(tr.nodes[2].objects.length === 1, 'tr.nodes[2] should have one object');
        test.assert(
          tr.nodes[2].objects[0] === test.rects[12][1],
          'tr.nodes[2].objects[0] should be rects[12]'
        );
        test.assert(tr.nodes[3].objects.length === 1, 'tr.nodes[3] should have one object');
        test.assert(
          tr.nodes[3].objects[0] === test.rects[14][1],
          'tr.nodes[3].objects[0] should be rects[14]'
        );

        // top left quadrant tests
        test.assert(tl.objects.length === 0, 'tl should have no objects');
        test.assert(
          tl.nodes[0].nodes[0].nodes[0] === null,
          'tl.nodes[0].nodes[0] should not be split'
        );
        test.assert(
          tl.nodes[0].nodes[0].objects.length === 1,
          'tl.nodes[0].nodes[0] should have one object'
        );
        test.assert(
          tl.nodes[0].nodes[0].objects[0] === test.rects[3][1],
          'tl.nodes[0].nodes[0].objects[0] should be rects[2]'
        );
        test.assert(
          tl.nodes[0].nodes[1].objects.length === 1,
          'tl.nodes[0].nodes[1] should have one object'
        );
        test.assert(
          tl.nodes[0].nodes[1].objects[0] === test.rects[2][1],
          'tl.nodes[0].nodes[0].objects[0] should be rects[1]'
        );
        test.assert(
          tl.nodes[0].nodes[2].objects.length === 1,
          'tl.nodes[0].nodes[2] should have one object'
        );
        test.assert(
          tl.nodes[0].nodes[2].objects[0] === test.rects[5][1],
          'tl.nodes[0].nodes[0].objects[0] should be rects[5]'
        );
        test.assert(
          tl.nodes[0].nodes[3].objects.length === 1,
          'tl.nodes[0].nodes[3] should have one object'
        );
        test.assert(
          tl.nodes[0].nodes[3].objects[0] === test.rects[6][1],
          'tl.nodes[0].nodes[0].objects[0] should be rects[6]'
        );
        test.assert(
          tl.nodes[1].nodes[0].nodes[0] === null,
          'tl.nodes[1].nodes[0] should not be split'
        );
        test.assert(
          tl.nodes[1].nodes[0].objects.length === 1,
          'tl.nodes[1].nodes[0] should have one object'
        );
        test.assert(
          tl.nodes[1].nodes[0].objects[0] === test.rects[0][1],
          'tl.nodes[1].nodes[0].objects[0] should be rects[0]'
        );
        test.assert(
          tl.nodes[1].nodes[1].objects.length === 0,
          'tl.nodes[1].nodes[1] should have no objects'
        );
        test.assert(
          tl.nodes[1].nodes[2].objects.length === 1,
          'tl.nodes[1].nodes[2] should have one object'
        );
        test.assert(
          tl.nodes[1].nodes[2].objects[0] === test.rects[1][1],
          'tl.nodes[1].nodes[0].objects[0] should be rects[3]'
        );
        test.assert(
          tl.nodes[1].nodes[3].objects.length === 1,
          'tl.nodes[1].nodes[3] should have one object'
        );
        test.assert(
          tl.nodes[1].nodes[3].objects[0] === test.rects[4][1],
          'tl.nodes[1].nodes[0].objects[0] should be rects[4]'
        );
        test.assert(tl.nodes[2].nodes[0] === null, 'tl.nodes[2] should not be split');
        test.assert(tl.nodes[2].objects.length === 0, 'tl.nodes[2] should not have any objects');

        // bottom left quadrant tests
        test.assert(br.nodes[0] === null, 'bl should not be split');
        test.assert(bl.objects.length === 1, 'bl should have one object');
        test.assert(bl.objects[0] === test.rects[15][1], 'bl should have rects[15]');

        // bottom right quadrant tests
        test.assert(br.nodes[0] === null, 'br should not be split');
        test.assert(br.objects.length === 0, 'br should have no objects');
      }
    )
  );

  quadtests.add(
    new Test(
      'overlapping insert',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(1, 1, 5, 3), '0'],
          [new Rect(3, 2, 2, 1), '1'],
          [new Rect(5, 5, 1, 1), '2'],
          [new Rect(4, 4, 4, 1), '3'],
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 1, 'tree root should have one object');
        test.assert(
          test.tree.root.objects[0] === test.rects[3][1],
          'root.objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects.length === 0,
          'root.nodes[0] should not have any objects'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(
          test.tree.root.nodes[1].objects.length === 2,
          'root.nodes[1] should have 2 objects'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].objects[0] should be rects[0]'
        );
        test.assert(
          test.tree.root.nodes[1].objects[1] === test.rects[1][1],
          'root.nodes[1].objects[1] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].objects.length === 0,
          'root.nodes[1].nodes[0] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].nodes[0] === null,
          'root.nodes[1].nodes[0] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects.length === 0,
          'root.nodes[1].nodes[1] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].nodes[0] === null,
          'root.nodes[1].nodes[1] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects.length === 0,
          'root.nodes[1].nodes[2] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].nodes[0] === null,
          'root.nodes[1].nodes[2] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects.length === 1,
          'root.nodes[1].nodes[3] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects[0] === test.rects[2][1],
          'root.nodes[1].nodes[3].objects[0] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].nodes[0] === null,
          'root.nodes[1].nodes[3] should not be split'
        );
        test.assert(
          test.tree.root.nodes[2].objects.length === 0,
          'root.nodes[2] should not have any objects'
        );
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(
          test.tree.root.nodes[3].objects.length === 0,
          'root.nodes[3] should not have any objects'
        );
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test('NaN/Infinity insert', null, null, null, function (test: Test & any) {
      const tree = new Quadtree<null>();
      try {
        tree.add(null, new Rect(1, NaN, 4, 2));
        test.assert(false, 'inserting a NaN rectangle should trigger an error');
      } catch (err) {}
      try {
        tree.add(null, new Rect(Infinity, 2, 4, 2));
        test.assert(false, 'inserting an Infinity rectangle should trigger an error');
      } catch (err) {}
      try {
        tree.add(null, new Rect(Infinity, NaN, 4, 2));
        test.assert(false, 'inserting a NaN or Infinity rectangle should trigger an error');
      } catch (err) {}
    })
  );

  quadtests.add(
    new Test(
      'negative coordinate insert',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        // same rects & tests as overlapping insert, but 5 is subtracted from every coordinate
        test.rects = [
          [new Rect(-4, -4, 5, 3), '0'], // 0
          [new Rect(-2, -3, 2, 1), '1'], // 1
          [new Rect(0, 0, 1, 1), '2'], // 2
          [new Rect(-1, -1, 4, 1), '3'], // 3
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 1, 'tree root should have one object');
        test.assert(
          test.tree.root.objects[0] === test.rects[3][1],
          'root.objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects.length === 0,
          'root.nodes[0] should not have any objects'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(
          test.tree.root.nodes[1].objects.length === 2,
          'root.nodes[1] should have 2 objects'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].objects[0] should be rects[0]'
        );
        test.assert(
          test.tree.root.nodes[1].objects[1] === test.rects[1][1],
          'root.nodes[1].objects[1] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].objects.length === 0,
          'root.nodes[1].nodes[0] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].nodes[0] === null,
          'root.nodes[1].nodes[0] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects.length === 0,
          'root.nodes[1].nodes[1] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].nodes[0] === null,
          'root.nodes[1].nodes[1] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects.length === 0,
          'root.nodes[1].nodes[2] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].nodes[0] === null,
          'root.nodes[1].nodes[2] should not be split'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects.length === 1,
          'root.nodes[1].nodes[3] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects[0] === test.rects[2][1],
          'root.nodes[1].nodes[3].objects[0] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].nodes[0] === null,
          'root.nodes[1].nodes[3] should not be split'
        );
        test.assert(
          test.tree.root.nodes[2].objects.length === 0,
          'root.nodes[2] should not have any objects'
        );
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(
          test.tree.root.nodes[3].objects.length === 0,
          'root.nodes[3] should not have any objects'
        );
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test(
      'basic removal',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(1, 1, 5, 3), '0'], // 0
          [new Rect(3, 2, 2, 1), '1'], // 1
          [new Rect(5, 5, 1, 1), '2'], // 2
          [new Rect(4, 4, 4, 1), '3'], // 3
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      function (test: Test & any) {
        test.tree.remove(test.rects[2][1]);
        test.tree.remove(test.rects[0][1]);
      },
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 1, 'tree root should have one object');
        test.assert(
          test.tree.root.objects[0] === test.rects[3][1],
          'root.objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects.length === 0,
          'root.nodes[0] should not have any objects'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(
          test.tree.root.nodes[1].objects.length === 1,
          'root.nodes[1] should have 2 objects'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[1][1],
          'root.nodes[1].objects[0] should be rects[0]'
        );
        test.assert(test.tree.root.nodes[1].nodes[0] === null, 'root.nodes[1] should not be split');
        test.assert(
          test.tree.root.nodes[2].objects.length === 0,
          'root.nodes[2] should not have any objects'
        );
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(
          test.tree.root.nodes[3].objects.length === 0,
          'root.nodes[3] should not have any objects'
        );
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test(
      'very large insert',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'],
          [new Rect(50, 50, 4000, 100), '1'],
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 1, 'tree root should have one object');
        test.assert(
          test.tree.root.objects[0] === test.rects[1][1],
          'root.objects[0] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[1].objects.length === 1,
          'root.nodes[1] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].objects[0] should be rects[0]'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(test.tree.root.nodes[1].nodes[0] === null, 'root.nodes[1] should not be split');
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test(
      'node capacity >1',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>(2); // node capacity 2

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(0, 1, 1, 1), '2'], // 2
          [new Rect(3, 0, 1, 1), '3'], // 3
          [new Rect(3, 1, 1, 1), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 0, 'tree root should not have any objects');
        test.assert(
          test.tree.root.nodes[0].objects.length === 2,
          'root.nodes[0] should have 2 objects'
        );
        test.assert(
          test.tree.root.nodes[0].objects[0] === test.rects[3][1],
          'root.nodes[0].objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects[1] === test.rects[4][1],
          'root.nodes[0].objects[1] should be rects[4]'
        );
        test.assert(
          test.tree.root.nodes[1].objects.length === 0,
          'root.nodes[1] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].objects.length === 0,
          'root.nodes[1].nodes[0] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects.length === 1,
          'root.nodes[1].nodes[1] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].nodes[1].objects[0] should be rects[0]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects.length === 1,
          'root.nodes[1].nodes[2] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects[0] === test.rects[2][1],
          'root.nodes[1].nodes[2].objects[0] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects.length === 1,
          'root.nodes[1].nodes[3] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects[0] === test.rects[1][1],
          'root.nodes[1].nodes[3].objects[0] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[2].objects.length === 0,
          'root.nodes[2] should not have any objects'
        );
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(
          test.tree.root.nodes[3].objects.length === 0,
          'root.nodes[3] should not have any objects'
        );
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test(
      'max level <Infinity',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>(undefined, 1); // default node capacity, max level 1

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(0, 1, 1, 1), '2'], // 2
          [new Rect(3, 0, 1, 1), '3'], // 3
          [new Rect(3, 1, 1, 1), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 0, 'tree root should not have any objects');
        test.assert(
          test.tree.root.nodes[0].objects.length === 2,
          'root.nodes[0] should have two objects'
        );
        test.assert(
          test.tree.root.nodes[0].objects[0] === test.rects[3][1],
          'root.nodes[0].objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects[1] === test.rects[4][1],
          'root.nodes[0].objects[1] should be rects[4]'
        );
        test.assert(
          test.tree.root.nodes[1].objects.length === 3,
          'root.nodes[1] should have three objects'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].objects[0] should be rects[0]'
        );
        test.assert(
          test.tree.root.nodes[1].objects[1] === test.rects[2][1],
          'root.nodes[1].objects[1] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].objects[2] === test.rects[1][1],
          'root.nodes[1].objects[2] should be rects[1]'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(test.tree.root.nodes[1].nodes[0] === null, 'root.nodes[1] should not be split');
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  // helper function for arrayEquals()
  function inArray(array: Array<any>, el: any) {
    for (let i = array.length; i--; ) {
      if (array[i] === el) return true;
    }
    return false;
  }

  // array equality, ignores order of arrays. used for quicker assert statements
  function arrayEquals(arr1: Array<any>, arr2: Array<any>) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = arr1.length; i--; ) {
      if (!inArray(arr2, arr1[i])) {
        return false;
      }
    }
    return true;
  }

  quadtests.add(
    new Test(
      'intersecting',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(0, 0, 2, 4), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(4, 0, 2, 2), '2'], // 2
          [new Rect(0, 4, 2, 2), '3'], // 3
          [new Rect(2, 6, 2, 2), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(0, 0, 1, 1)), [test.rects[0][1]]),
          'should intersect rects[0]'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(1, 1, 1, 1)), [
            test.rects[0][1],
            test.rects[1][1],
          ]),
          'should intersect rects[0] and rects[1]'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(3, 1, 1, 2)), []),
          'should have no intersections'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(1, 5, 2, 2)), [
            test.rects[3][1],
            test.rects[4][1],
          ]),
          'should intersect rects[3] and rects[4]'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(6, 1, 0, 0)), []),
          'should have no intersections'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Rect(4, 6, 1, 1)), []),
          'should have no intersections'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Point(1.5, 1.5)), [
            test.rects[0][1],
            test.rects[1][1],
          ]),
          'should intersect rects[0] and rects[1]'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Point(1.5, 1.5)), [
            test.rects[0][1],
            test.rects[1][1],
          ]),
          'should intersect rects[0] and rects[1]'
        );
        test.assert(
          arrayEquals(test.tree.intersecting(new Point(4, 4)), []),
          'should have no intersections'
        );
      }
    )
  );

  quadtests.add(
    new Test(
      'containing',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(0, 0, 2, 4), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(4, 0, 2, 2), '2'], // 2
          [new Rect(0, 4, 2, 2), '3'], // 3
          [new Rect(2, 6, 2, 2), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(
          arrayEquals(test.tree.containing(new Rect(1, 1, 1, 1)), [
            test.rects[0][1],
            test.rects[1][1],
          ]),
          'should be contained by rects[0] and rects[1]'
        );
        test.assert(
          arrayEquals(test.tree.containing(new Rect(0, 0, 2, 2)), [test.rects[0][1]]),
          'should be contained by rects[0]'
        );
        test.assert(
          arrayEquals(test.tree.containing(new Rect(1, 5, 2, 2)), []),
          'should not have any containing rectangles'
        );
      }
    )
  );

  quadtests.add(
    new Test(
      'find/has',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>(2); // node capacity 2

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(0, 1, 1, 1), '2'], // 2
          [new Rect(3, 0, 1, 1), '3'], // 3
          [new Rect(3, 1, 1, 1), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      null,
      function (test: Test & any) {
        test.assert(
          test.tree.find(test.rects[0][1]) === test.tree.root.nodes[1].nodes[1],
          'rects[0] should be at root.nodes[1].nodes[1]'
        );
        test.assert(
          test.tree.find(test.rects[1][1]) === test.tree.root.nodes[1].nodes[3],
          'rects[1] should be at root.nodes[1].nodes[3]'
        );
        test.assert(
          test.tree.find(test.rects[2][1]) === test.tree.root.nodes[1].nodes[2],
          'rects[2] should be at root.nodes[1].nodes[2]'
        );
        test.assert(
          test.tree.find(test.rects[3][1]) === test.tree.root.nodes[0],
          'rects[3] should be at root.nodes[0]'
        );
        test.assert(
          test.tree.find(test.rects[4][1]) === test.tree.root.nodes[0],
          'rects[4] should be at root.nodes[0]'
        );
        test.assert(test.tree.has(test.rects[0][1]), 'tree should have rects[0]');
        test.assert(test.tree.has(test.rects[1][1]), 'tree should have rects[1]');
        test.assert(test.tree.has(test.rects[2][1]), 'tree should have rects[2]');
        test.assert(test.tree.has(test.rects[3][1]), 'tree should have rects[3]');
        test.assert(test.tree.has(test.rects[4][1]), 'tree should have rects[4]');
        test.assert(test.tree.find('-1') === null, 'tree.find should not find -1');
        test.assert(test.tree.find('5') === null, 'tree.find should not find 5');
        test.assert(test.tree.find('6000') === null, 'tree.find should not find 6000');
      }
    )
  );

  quadtests.add(
    new Test(
      'move',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>(2); // node capacity 2

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(2, 0, 1, 1), '2'], // 2
          [new Rect(2, 1, 1, 1), '3'], // 3
          [new Rect(3, 0, 1, 1), '4'], // 4
          [new Rect(3, 1, 1, 1), '5'], // 5
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      function (test: Test & any) {
        test.assert(test.tree.move(test.rects[2][1], 0, 1), 'should return true on success');
        test.assert(
          test.tree.move(test.rects[3][1], new Point(1, 0)),
          'should return true on success'
        );
        test.assert(!test.tree.move('6', 0, 0), 'should return false for a nonexistant object');
      },
      function (test: Test & any) {
        // essentially the same tests as in 'node capacity >1' with a few different indexes, because the resultant trees should be almost the same
        test.assert(test.tree.root.objects.length === 0, 'tree root should not have any objects');
        test.assert(
          test.tree.root.nodes[0].objects.length === 2,
          'root.nodes[0] should have 2 objects'
        );
        test.assert(
          test.tree.root.nodes[0].objects[0] === test.rects[4][1],
          'root.nodes[0].objects[0] should be rects[4]'
        );
        test.assert(
          test.tree.root.nodes[0].objects[1] === test.rects[5][1],
          'root.nodes[0].objects[1] should be rects[5]'
        );
        test.assert(
          test.tree.root.nodes[1].objects.length === 0,
          'root.nodes[1] should not have any objects'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].objects.length === 1,
          'root.nodes[1].nodes[0] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[0].objects[0] === test.rects[3][1],
          'root.nodes[1].nodes[0].objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects.length === 1,
          'root.nodes[1].nodes[1] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[1].objects[0] === test.rects[0][1],
          'root.nodes[1].nodes[1].objects[0] should be rects[0]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects.length === 1,
          'root.nodes[1].nodes[2] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[2].objects[0] === test.rects[2][1],
          'root.nodes[1].nodes[2].objects[0] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects.length === 1,
          'root.nodes[1].nodes[3] should have one object'
        );
        test.assert(
          test.tree.root.nodes[1].nodes[3].objects[0] === test.rects[1][1],
          'root.nodes[1].nodes[3].objects[0] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[2].objects.length === 0,
          'root.nodes[2] should not have any objects'
        );
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(
          test.tree.root.nodes[3].objects.length === 0,
          'root.nodes[3] should not have any objects'
        );
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');

        test.assert(
          test.rects[2][0].x !== 0 && test.rects[2][0].y !== 1,
          'tree should make copies of original bounds'
        );
        test.assert(
          test.rects[3][0].x !== 1 && test.rects[3][0].y !== 0,
          'tree should make copies of original bounds'
        );
      }
    )
  );

  quadtests.add(
    new Test(
      'resize',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>(2); // node capacity 2

        test.rects = [
          [new Rect(0, 0, 1, 1), '0'], // 0
          [new Rect(1, 1, 1, 1), '1'], // 1
          [new Rect(0, 1, 1, 1), '2'], // 2
          [new Rect(3, 0, 1, 1), '3'], // 3
          [new Rect(3, 1, 1, 1), '4'], // 4
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      function (test: Test & any) {
        test.assert(test.tree.resize(test.rects[1][1], 2, 2), 'should return true on success');
        test.assert(
          test.tree.resize(test.rects[0][1], new Size(2, 2), 'should return true on success')
        );
        test.assert(!test.tree.resize('5', 2, 2), 'should return false for nonexistant object');
      },
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 1, 'tree root should have one object');
        test.assert(
          test.tree.root.objects[0] === test.rects[1][1],
          'root.objects[0] should be rects[1]'
        );
        test.assert(
          test.tree.root.nodes[0].objects.length === 2,
          'root.nodes[0] should have two objects'
        );
        test.assert(
          test.tree.root.nodes[0].objects[0] === test.rects[3][1],
          'root.nodes[0].objects[0] should be rects[3]'
        );
        test.assert(
          test.tree.root.nodes[0].objects[1] === test.rects[4][1],
          'root.nodes[0].objects[1] should be rects[4]'
        );
        test.assert(
          test.tree.root.nodes[1].objects.length === 2,
          'root.nodes[1] should have two objects'
        );
        test.assert(
          test.tree.root.nodes[1].objects[0] === test.rects[2][1],
          'root.nodes[1].objects[0] should be rects[2]'
        );
        test.assert(
          test.tree.root.nodes[1].objects[1] === test.rects[0][1],
          'root.nodes[1].objects[1] should be rects[0]'
        );
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[0] should not be split');
        test.assert(test.tree.root.nodes[0].nodes[0] === null, 'root.nodes[1] should not be split');
        test.assert(test.tree.root.nodes[2].nodes[0] === null, 'root.nodes[2] should not be split');
        test.assert(test.tree.root.nodes[3].nodes[0] === null, 'root.nodes[3] should not be split');
      }
    )
  );

  quadtests.add(
    new Test(
      'clear',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(1, 1, 5, 3), '0'], // 0
          [new Rect(3, 2, 2, 1), '1'], // 1
          [new Rect(5, 5, 1, 1), '2'], // 2
          [new Rect(4, 4, 4, 1), '3'], // 3
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      function (test: Test & any) {
        test.tree.clear();
      },
      function (test: Test & any) {
        test.assert(test.tree.root.objects.length === 0, 'root should have no objects');
        test.assert(test.tree.root.totalObjects === 0, 'root should have totalObjects === 0');
        test.assert(test.tree.root.nodes[0] === null, 'root should not be split');
      }
    )
  );

  // moves and resizes a bunch of nodes all over the place and ensures that they can then still be found using .find()
  quadtests.add(
    new Test(
      'move/resize+find',
      null,
      function (test: Test & any) {
        test.tree = new Quadtree<string>();

        test.rects = [
          [new Rect(1, 1, 5, 3), '0'], // 0
          [new Rect(3, 2, 2, 1), '1'], // 1
          [new Rect(5, 5, 1, 1), '2'], // 2
          [new Rect(4, 4, 4, 1), '3'], // 3
          [new Rect(4, 1, 2, 7), '4'], // 4
          [new Rect(4, 4, 1, 1), '5'], // 5
          [new Rect(9, 2, 1, 3), '6'], // 6
          [new Rect(5, 0, 0, 2), '7'], // 7
        ];
        for (const rect of test.rects) {
          test.tree.add(rect[1], rect[0]);
        }
      },
      function (test: Test & any) {
        function assertHasAll(): void {
          for (const node of test.rects) {
            const key: string = node[1];
            test.assert(test.tree.has(key), 'tree missing node ' + key);
          }
        }
        assertHasAll();
        test.assert(
          test.tree.move(test.rects[0][1], 1, 10),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.move(test.rects[1][1], 20, 0),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.move(test.rects[3][1], 0, 0),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.move(test.rects[5][1], 2, 4),
          'move to random coordinates should be successful'
        );
        assertHasAll();
        test.assert(
          test.tree.resize(test.rects[2][1], 1, 1),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[4][1], 7, 5),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[5][1], 3, 2),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[6][1], 8, 4),
          'resize to random dimensions should be successful'
        );
        assertHasAll();
        test.assert(
          test.tree.move(test.rects[2][1], -5, 3),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[0][1], 3, 6),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.move(test.rects[1][1], 0, 0),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[2][1], 5, 2),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.move(test.rects[3][1], 0, 4),
          'move to random coordinates should be successful'
        );
        test.assert(
          test.tree.resize(test.rects[2][1], 3, 0),
          'resize to random dimensions should be successful'
        );
        test.assert(
          test.tree.move(test.rects[5][1], 10, 5),
          'move to random coordinates should be successful'
        );
        assertHasAll();
        test.assert(test.tree.move(test.rects[0][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[1][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[2][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[3][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[4][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[5][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[6][1], 0, 0), 'move to 0,0 should be successful');
        test.assert(test.tree.move(test.rects[7][1], 0, 0), 'move to 0,0 should be successful');
        assertHasAll();
        test.assert(test.tree.resize(test.rects[0][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[1][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[2][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[3][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[4][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[5][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[6][1], 0, 0), 'resize to 0,0 should be successful');
        test.assert(test.tree.resize(test.rects[7][1], 0, 0), 'resize to 0,0 should be successful');
        assertHasAll();
        for (const rect of test.rects) {
          test.tree.remove(rect[1]);
        }
        test.assert(
          test.tree.root.totalObjects === 0,
          'tree total object count should be 0 after every object is removed'
        );
        test.assert(
          test.tree.root.objects.length === 0,
          'tree should not have any objects after every object is removed'
        );
        test.assert(
          test.tree.root.nodes[0] === null,
          'tree should not be split when it has no objects'
        );
      },
      null
    )
  );
})();
