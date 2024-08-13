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
import { Test, TestCollection, TestRoot } from './gotest.js';

(function () {
  const $ = go.GraphObject.make;

  const paneltests = new TestCollection('Panels');
  TestRoot.add(paneltests);

  const dirPanels = new TestCollection('Directional Panels');
  paneltests.add(dirPanels);

  const spotPanels = new TestCollection('Spot Panels');
  paneltests.add(spotPanels);

  const tablePanels = new TestCollection('Table Panels');
  paneltests.add(tablePanels);

  const gridPanels = new TestCollection('Grid Panels');
  paneltests.add(gridPanels);

  const viewboxPanels = new TestCollection('Viewbox');
  paneltests.add(viewboxPanels);

  // horizontal tests =========================================================================================
  dirPanels.add(
    new Test(
      'Horizontal adjust size',
      null,
      function (test: Test & any): void {
        // setup
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(255,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      }, // end setup
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        panel.elt(2).height = 100;
        panel.elt(3).width = 200;
        panel.elt(1).alignment = new go.Spot(0, 1, 10, 0);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.elements.count === 4, 'Not right amount of shapes');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 320, 100)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(70, 60, 40, 40)),
          'Shape 2 not expected bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(100, 0, 20, 100)),
          'Shape 3 not expeted bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(120, 40, 200, 20)),
          'Shape 4 not expected bounds'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Horizontal add',
      null,
      function (test: Test & any): void {
        // setup
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      }, // end setup
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.add(
          $(
            go.Panel,
            'Spot',
            {
              background: 'rgba(255,0,0, .5)',
              desiredSize: new go.Size(60, 110), // adds 1 extra pixel if not set desiredsize?
            },
            $(go.Shape, 'Rectangle', { width: 40, height: 10 }),
            $(go.Shape, 'Rectangle', { width: 20, height: 100, alignment: new go.Spot(1, 0, 0, 0) })
          )
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 4, 'Did not add a new element');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 250, 110)),
          'Panel not correct bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(0, 25, 60, 60)),
          'Shape 1 not correct bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(60, 35, 40, 40)),
          'Shape 2 not correct bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(100, 45, 90, 20)),
          'Shape 3 not correct bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(190, 0, 60, 110)),
          'Shape 4 not correct bounds'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Horizontal insertAt',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.insertAt(
          2,
          $(
            go.Panel,
            'Spot',
            {
              background: 'rgba(255,0,0, .5)',
            },
            $(go.Shape, 'Rectangle', { width: 40, height: 10 }),
            $(go.Shape, 'Rectangle', { width: 20, height: 100, alignment: new go.Spot(1, 0, 0, 0) })
          )
        );
      },
      function (test: Test & any): void {
        function walktree(walkpanel: go.GraphObject, walkarr: Array<string>): void {
          walkarr.push(walkpanel.actualBounds.toString());
          if (walkpanel instanceof go.Panel) {
            walkpanel.elements.each(function (e: go.GraphObject): void {
              walktree(e, walkarr);
            });
          }
        }

        const expected = [
          'Rect(0,0,241.5,101)',
          'Rect(0,20.5,60,60)',
          'Rect(60,30.5,40,40)',
          'Rect(100,0,51.5,101)',
          'Rect(0,50.5,41,11)',
          'Rect(30.5,0,21,101)',
          'Rect(151.5,40.5,90,20)',
        ];

        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 4, "Didn't add the new panel");
        test.assert(panel.elt(2) instanceof go.Panel, 'Element 2 is not a panel');
        test.assert(
          panel.elt(2).elements.count === 2,
          'There is not 2 elements in the internal panel'
        );

        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Panel): void {
          walktree(n, arr);
        });

        for (let i = 0; i < arr.length; i++) {
          test.assert(arr[i] === expected[i]);
        }

        test.assert(panel.actualBounds.width === 241.5, 'Width was not adjusted to expected value'); // bug? 1.5 extra pixels
        test.assert(panel.actualBounds.height === 101, 'Height was not adjusted to expected value'); // bug? adds 1 extra pixel on add
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Horiztonal remove',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        const shape = panel.elt(1);
        panel.remove(shape);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 2, 'There isnt 2 elements after the remove');
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(60, 20, 90, 20)),
          'Shape 3 did not become shape 2'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Horizontal removeAt',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 0,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.removeAt(1);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 2, 'There isnt 2 elements after the removeAt');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 50, 60)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(50, 10, 0, 40)),
          'Shape 3 did not become shape 2'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Horizontal isOpposite',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          {
            background: 'rgba(100,255,0, .4)',
            isOpposite: true,
          },
          $(go.Shape, 'RoundedRectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0, 0, 255, 0.3)',
            name: '1',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0, 255, 0, 0.3)',
            name: '2',
          }),
          $(go.Shape, 'RoundedRectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255, 0, 0, 0.3)',
            name: '3',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255, 0, 255, 0.3)',
            name: '4',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        const it = panel.elements;
        let count = 1;
        let prev = 0;
        while (it.next()) {
          test.assert(it.value.name === count.toString(), 'Objects not in correct order');
          if (prev !== 0) {
            test.assert(prev > it.value.actualBounds.x, 'Object is not left of the previous shape'); // higher x means to the right of
          }
          prev = it.value.actualBounds.x;
          count++;
        }
      }
    )
  ); // end test

  // VERTICAL TESTS ==================================================================================================================================================================
  dirPanels.add(
    new Test(
      'Vertical adjust size',
      null,
      function (test: Test & any): void {
        // setup
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(255,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      }, // end setup
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        panel.elt(2).height = 100;
        panel.elt(3).width = 200;
        panel.elt(1).alignment = new go.Spot(1, 0, 10, 0);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 200, 220)),
          'Panel not adjusted to expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(170, 60, 40, 40)),
          'Shape 2 not adjusted to expected bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(90, 100, 20, 100)),
          'Shape 3 not adjusted to expected bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(0, 200, 200, 20)),
          'Shape 4 not adjusted to expected bounds'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Vertical add',
      null,
      function (test: Test & any): void {
        // setup
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      }, // end setup
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.add(
          $(
            go.Panel,
            'Spot',
            {
              background: 'rgba(255,0,0, .5)',
            },
            $(go.Shape, 'Rectangle', { width: 40, height: 10 }),
            $(go.Shape, 'Rectangle', { width: 20, height: 100, alignment: new go.Spot(1, 0, 0, 0) })
          )
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 4, 'Not right amount of shapes');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 90, 221)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(15, 0, 60, 60)),
          'Shape 1 not correct bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(25, 60, 40, 40)),
          'Shape 2 not correct bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(0, 100, 90, 20)),
          'Shape 3 not correct bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(19.25, 120, 51.5, 101)),
          'Shape 4 not correct bounds'
        );

        test.assert(panel.actualBounds.width === 90, 'Width was not adjusted to expected value');
        test.assert(panel.actualBounds.height === 221, 'Height was not adjusted to expected value'); // bug? adds 1 extra pixel on add
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Vertical insertAt',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.insertAt(
          2,
          $(
            go.Panel,
            'Spot',
            {
              background: 'rgba(255,0,0, .5)',
            },
            $(go.Shape, 'Rectangle', { width: 40, height: 10 }),
            $(go.Shape, 'Rectangle', { width: 20, height: 100, alignment: new go.Spot(1, 0, 0, 0) })
          )
        );
      },
      function (test: Test & any): void {
        function walktree(walkpanel: go.GraphObject, walkarr: Array<string>) {
          walkarr.push(walkpanel.actualBounds.toString());
          if (walkpanel instanceof go.Panel) {
            walkpanel.elements.each(function (e: go.GraphObject) {
              walktree(e, walkarr);
            });
          }
        }

        const expected = [
          'Rect(0,0,90,221)',
          'Rect(15,0,60,60)',
          'Rect(25,60,40,40)',
          'Rect(19.25,100,51.5,101)',
          'Rect(0,50.5,41,11)',
          'Rect(30.5,0,21,101)',
          'Rect(0,201,90,20)',
        ];

        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 4, 'Not the expected amount of elements in the panel');
        test.assert(
          panel.elt(2).elements.count === 2,
          'Not the expected amount of elements in the panel inside the node'
        );

        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Node): void {
          walktree(n, arr);
        });

        for (let i = 0; i < arr.length; i++) {
          test.assert(arr[i] === expected[i], 'Not expected bounds');
        }

        test.assert(panel.actualBounds.width === 90, 'Width was not adjusted to expected value'); // bug? 1.5 extra pixels
        test.assert(panel.actualBounds.height === 221, 'Height was not adjusted to expected value'); // bug? adds 1 extra pixel on add
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Vertical remove',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 100,
            height: 100,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 90,
            height: 20,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        const shape = panel.elt(1);
        panel.remove(shape);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 2, 'Failed to remove an element correctly');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 90, 80)),
          'Panel is not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(0, 60, 90, 20)),
          'Shape 3 did not become shape 2'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Vertical removeAt',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 40,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 0,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        panel.removeAt(1);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(panel.elements.count === 2, 'There isnt 2 elements after remove');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 50, 100)),
          'Panel is not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(25, 60, 0, 40)),
          'Shape 3 did not become shape 2'
        );
      }
    )
  ); // end test

  dirPanels.add(
    new Test(
      'Vertical isOpposite',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          {
            background: 'rgba(100,255,0, .4)',
            isOpposite: true,
          },
          $(go.Shape, 'RoundedRectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0, 0, 255, 0.3)',
            name: '1',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0, 255, 0, 0.3)',
            name: '2',
          }),
          $(go.Shape, 'RoundedRectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255, 0, 0, 0.3)',
            name: '3',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255, 0, 255, 0.3)',
            name: '4',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        const it = panel.elements;
        let count = 1;
        let prev = 0;
        while (it.next()) {
          test.assert(it.value.name === count.toString(), 'Objects not in correct order');
          if (prev !== 0) {
            test.assert(prev > it.value.actualBounds.y, 'Object is not stacked above'); // higher y means below
          }
          prev = it.value.actualBounds.y;
          count++;
        }
      }
    )
  ); // end test

  // SPOT TESTS =======================================================================================================================
  spotPanels.add(
    new Test(
      'desiredSize',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            background: 'rgba(255,255,0, .1)',
            desiredSize: new go.Size(100, 100),
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,0,255, .3)',
            alignment: new go.Spot(1.5, 1.5, 0, 0),
            name: 'adjust',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 0 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(
          panel.findObject('adjust'),
          "findObject not working, couldn't find the shape with the name 'adjust'"
        );
        panel.findObject('adjust').width = 75;
        panel.findObject('adjust').height = 75;
        panel.add(
          $(go.Panel, {
            background: 'rgba(0, 255, 255, 0.3)',
            desiredSize: new go.Size(150, 150),
          })
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(0);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 100, 100)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(50, 50, 50, 50)),
          'Shape not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(87.5, 87.5, 75, 75)),
          'Shape not expected bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(0, 0, 150, 150)),
          'Shape not expected bounds'
        );
      }
    )
  ); // end test

  spotPanels.add(
    new Test(
      'OffsetX/Y',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const d = diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            background: 'rgba(255,255,0, .1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }), // red

          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,255,0, .3)', // green
            alignment: new go.Spot(0, 0, 0, 0),
            alignmentFocus: new go.Spot(1, 1, 0, 10),
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(0,0,255, .3)', // blue
            alignment: new go.Spot(1, 0.5, 0, 0),
            alignmentFocus: new go.Spot(0, 0.5, 0, -10),
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 20,
            height: 20,
            fill: 'rgba(255,0,255, .3)', // pink
            alignment: new go.Spot(1, 1, 0, 0),
            alignmentFocus: new go.Spot(0, 0.5, 10, 0),
          })
        );

        diagram.model = new go.GraphLinksModel([{ key: 'Alpha' }], []);
      }, // end setup
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;

        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Node): void {
          walktree(n, arr);
        });
        // console.log(arr);

        function walktree(panel: go.GraphObject, walkarr: Array<string>): void {
          arr.push(panel.actualBounds.toString());
          if (panel instanceof go.Panel) {
            panel.elements.each(function (e) {
              walktree(e, walkarr);
            });
          }
        }

        const expected = [
          'Rect(0,0,120,120)',
          'Rect(40,50,60,60)',
          'Rect(0,0,40,40)',
          'Rect(100,80,20,20)',
          'Rect(90,100,20,20)',
        ];

        for (let i = 0; i < arr.length; i++) {
          test.assert(arr[i] === expected[i]);
        }
      }
    )
  ); // end test

  spotPanels.add(
    new Test(
      'Stretch Horizontal/Vertical',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const d = diagram;
        diagram.reset();

        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            resizable: true,
            resizeObjectName: 'mainshape',
          },
          $(
            go.Shape,
            'Rectangle',
            { name: 'mainshape', strokeWidth: 0, width: 60, height: 60, fill: 'rgba(255,0,0, .3)' }, // red
            new go.Binding('width'),
            new go.Binding('height')
          ),

          $(go.Shape, 'Rectangle', {
            stretch: go.GraphObject.Vertical,
            strokeWidth: 0,
            width: 20,
            fill: 'rgba(0,255,0, .3)', // green
            alignment: go.Spot.Left,
            alignmentFocus: go.Spot.Right,
          }),
          $(go.Shape, 'Rectangle', {
            stretch: go.GraphObject.Vertical,
            strokeWidth: 0,
            width: 20,
            fill: 'rgba(0,0,255, .3)', // blue
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Left,
          }),
          $(go.Shape, 'Rectangle', {
            stretch: go.GraphObject.Horizontal,
            strokeWidth: 0,
            height: 20,
            fill: 'rgba(255,0,255, .3)', // pink
            alignment: go.Spot.Bottom,
            alignmentFocus: go.Spot.Top,
          })
        );

        diagram.model = new go.GraphLinksModel(
          [{ key: 'Alpha' }, { key: 'Beta', width: 100, height: 30 }],
          []
        );
      }, // end setup
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Node) {
          walktree(n, arr);
        });
        // console.log(arr);

        function walktree(panel: go.GraphObject, walkarr: Array<string>): void {
          arr.push(panel.actualBounds.toString());
          if (panel instanceof go.Panel) {
            panel.elements.each(function (e) {
              walktree(e, walkarr);
            });
          }
        }

        const expected = [
          'Rect(0,0,100,80)',
          'Rect(20,0,60,60)',
          'Rect(0,0,20,60)',
          'Rect(80,0,20,60)',
          'Rect(20,60,60,20)',
          'Rect(120,0,140,50)',
          'Rect(20,0,100,30)',
          'Rect(0,0,20,30)',
          'Rect(120,0,20,30)',
          'Rect(20,30,100,20)',
        ];

        for (let i = 0; i < arr.length; i++) {
          test.assert(arr[i] === expected[i]);
        }
      }
    )
  ); // end test

  spotPanels.add(
    new Test(
      'Stretch Fill',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const d = diagram;
        diagram.reset();

        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            resizable: true,
            resizeObjectName: 'mainshape',
            desiredSize: new go.Size(200, 200),
          },
          $(
            go.Shape,
            'Rectangle',
            {
              name: 'mainshape',
              strokeWidth: 0,
              fill: 'rgba(255,0,0, .3)',
              stretch: go.GraphObject.None,
            },
            new go.Binding('stretch')
          )
        );
        diagram.model = new go.GraphLinksModel(
          [{ key: 1, stretch: go.GraphObject.Fill }, { key: 2 }],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = test.diagram.findNodeForKey(1);
        const beta = test.diagram.findNodeForKey(2);
        test.assert(
          alpha.actualBounds.toString() === alpha.elt(0).actualBounds.toString(),
          'Panel and shape should have the same bounds'
        );
        test.assert(
          alpha.actualBounds.equalsApprox(new go.Rect(0, 0, 200, 200)),
          'Panel not expected bounds'
        );
        test.assert(
          beta.actualBounds.toString() !== beta.elt(0).actualBounds.toString(),
          'Panel and shape should not have the same bounds'
        );
        test.assert(
          beta.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 100, 100)),
          'Shape not expected bounds'
        );
      }
    )
  );

  spotPanels.add(
    new Test(
      'Padding',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            background: 'rgba(0,0,255,0.3)',
            desiredSize: new go.Size(65, 65),
          },
          new go.Binding('padding'),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          })
        );
        diagram.model = new go.GraphLinksModel(
          [
            { key: 1 },
            { key: 2, padding: new go.Margin(4, 2, 2, 6) },
            { key: 3, padding: new go.Margin(2.5) },
          ],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = diagram.findNodeForKey(1);
        const beta = diagram.findNodeForKey(2);
        const gamma = diagram.findNodeForKey(3);

        test.assert(
          alpha.actualBounds.equalsApprox(new go.Rect(0, 0, 65, 65)),
          'Panel not expected bounds'
        );
        test.assert(
          alpha.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 60, 60)),
          'Shape not shifted for padding'
        );
        test.assert(alpha.padding.toString() === 'Margin(0,0,0,0)', 'Paddding isnt default 0');
        test.assert(
          beta.actualBounds.equalsApprox(new go.Rect(85, 0, 65, 65)),
          'Padding changed the size of the panel'
        );
        test.assert(
          beta.elt(0).actualBounds.equalsApprox(new go.Rect(6, 4, 60, 60)),
          'Shape not shifted for padding'
        );
        test.assert(beta.padding.toString() === 'Margin(4,2,2,6)', 'Padding not set correctly');
        test.assert(
          gamma.actualBounds.equalsApprox(new go.Rect(0, 85, 65, 65)),
          'Padding changed the size of the panel'
        );
        test.assert(
          gamma.elt(0).actualBounds.equalsApprox(new go.Rect(2.5, 2.5, 60, 60)),
          'Shape not shifted for padding'
        );
        test.assert(
          gamma.padding.toString() === 'Margin(2.5,2.5,2.5,2.5)',
          'Padding not set correctly'
        );
      }
    )
  );

  spotPanels.add(
    new Test(
      'isClipping',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          {
            background: 'rgba(0,0,255,0.3)',
            desiredSize: new go.Size(200, 200),
          },
          new go.Binding('isClipping'),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,255,0, .3)',
            alignment: new go.Spot(1, 0, 0, 0),
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,0,255, .3)',
            alignment: new go.Spot(0, 1, 0, 0),
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1, isClipping: true }, { key: 2 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = diagram.findNodeForKey(1);
        const beta = diagram.findNodeForKey(2);
        test.assert(alpha.isClipping, 'isClipping is not true');
        test.assert(
          alpha.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 60, 60)),
          'Not expected bounds'
        );
        test.assert(
          alpha.elt(1).actualBounds.equalsApprox(new go.Rect(30, -30, 60, 60)),
          'Not expected bounds'
        );
        test.assert(
          alpha.elt(2).actualBounds.equalsApprox(new go.Rect(-30, 30, 60, 60)),
          'Not expected bounds'
        );
        test.assert(!beta.isClipping, 'isClipping is not false by default');
        test.assert(!alpha.findMainElement.stroke, 'Main element when isClipping is not undefined');
      }
    )
  );

  // table tests =============================================================================================================================
  tablePanels.add(
    new Test(
      'Basic Table',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(100,255,0, .4)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 1,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 70,
            height: 70,
            fill: 'rgba(255,0,255, .3)',
            row: 1,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 80,
            height: 80,
            fill: 'rgba(255,255,0, .3)',
            row: 2,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,255,255, .3)',
            row: 2,
            column: 2,
          })
        );

        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.elements.count === 6, 'Not 6 shapes in the table');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 190, 210)),
          'Table not expected bounds'
        );
        test.assert(panel.rowCount === 3, 'More or less than 3 rows');
        test.assert(panel.columnCount === 3, 'More or less than 3 columns');
        test.assert(panel.findColumnForLocalX(100) === 1, "Didn't find the right column");
        test.assert(panel.findRowForLocalY(150) === 2, "Didn't find the right row");
        test.assert(panel.findColumnForLocalX(-100) === -1, "Not -1 when can't find the column");
        test.assert(panel.findRowForLocalY(-150) === -1, "Not -1 when can't find the row");
      }
    )
  ); // end test

  function getimg(ctx: CanvasRenderingContext2D, x: number, y: number): Uint8ClampedArray {
    return ctx.getImageData(x, y, 1, 1).data;
  }

  // function to test colors at a particular pixel
  function arrayEquals(arr1: Uint8ClampedArray, arr2: Array<number>): boolean {
    if (arr1.length !== arr2.length) return false;
    const l = arr1.length;
    for (let i = 0; i < l; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  tablePanels.add(
    new Test(
      'defaultRowSeparatorDashArray',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,255,0)',
            defaultRowSeparatorStroke: 'rgba(0,0,255,1)',
            defaultRowSeparatorStrokeWidth: 10,
            defaultRowSeparatorDashArray: [2, 6],
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 104,
            height: 1,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 104,
            height: 1,
            fill: 'rgba(0,255,0,1)',
            row: 1,
            column: 0,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);

          for (let x = 6; x < 110; x++) {
            test.assert(
              arrayEquals(getimg(ctx, x, 6), [0, 255, 0, 255]),
              'expected green pixel at point(' + x + ', 6)'
            );
          }
          for (let x = 6; x < 109; x += 8) {
            test.assert(arrayEquals(getimg(ctx, x, 10), [0, 0, 255, 255]), 'expected blue pixel');
            test.assert(
              arrayEquals(getimg(ctx, x + 1, 10), [0, 0, 255, 255]),
              'expected blue pixel'
            );
            for (let j = 2; j <= 7; j++) {
              const msg =
                'expected green pixel at pixel(' +
                (x + j).toString() +
                ', 10), skipping rest of errors';
              test.assert(arrayEquals(getimg(ctx, x + j, 10), [0, 255, 0, 255]), msg);
              if (!arrayEquals(getimg(ctx, x + j, 10), [0, 255, 0, 255])) return;
            }
          }
          for (let x = 6; x < 110; x++) {
            test.assert(
              arrayEquals(getimg(ctx, x, 17), [0, 255, 0, 255]),
              'expected green pixel at point(' + x + ', 17)'
            );
          }
        };
        img.src = diagram.makeImageData();
      }
    )
  );

  tablePanels.add(
    new Test(
      'separatorDashArray: Row',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,255,0,1)',
          },
          $(go.RowColumnDefinition, {
            row: 1,
            separatorStrokeWidth: 10,
            separatorStroke: 'rgba(0,0,255,1)',
            separatorDashArray: [2, 6],
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 104,
            height: 1,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 104,
            height: 1,
            fill: 'rgba(0,255,0,1)',
            row: 1,
            column: 0,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);

          for (let x = 6; x < 110; x++) {
            test.assert(
              arrayEquals(getimg(ctx, x, 6), [0, 255, 0, 255]),
              'expected green pixel at point(' + x + ', 6)'
            );
          }
          for (let x = 6; x < 109; x += 8) {
            test.assert(arrayEquals(getimg(ctx, x, 10), [0, 0, 255, 255]), 'expected blue pixel');
            test.assert(
              arrayEquals(getimg(ctx, x + 1, 10), [0, 0, 255, 255]),
              'expected blue pixel'
            );
            for (let j = 2; j <= 7; j++) {
              const msg =
                'expected green pixel at pixel(' +
                (x + j).toString() +
                ', 10), skipping rest of errors';
              test.assert(arrayEquals(getimg(ctx, x + j, 10), [0, 255, 0, 255]), msg);
              if (!arrayEquals(getimg(ctx, x + j, 10), [0, 255, 0, 255])) return;
            }
          }
          for (let x = 6; x < 110; x++) {
            test.assert(
              arrayEquals(getimg(ctx, x, 17), [0, 255, 0, 255]),
              'expected green pixel at point(' + x + ', 17)'
            );
          }
        };
        img.src = diagram.makeImageData();
      }
    )
  );

  tablePanels.add(
    new Test(
      'defaultColumnSeparatorDashArray',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,255,0)',
            defaultColumnSeparatorStroke: 'rgba(0,0,255,1)',
            defaultColumnSeparatorStrokeWidth: 10,
            defaultColumnSeparatorDashArray: [2, 6],
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 1,
            height: 104,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 1,
            height: 104,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 1,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);

          for (let y = 6; y < 110; y++) {
            test.assert(
              arrayEquals(getimg(ctx, 6, y), [0, 255, 0, 255]),
              'expected green pixel at point(6, ' + y + ')'
            );
          }
          for (let y = 6; y < 109; y += 8) {
            test.assert(arrayEquals(getimg(ctx, 10, y), [0, 0, 255, 255]), 'expected blue pixel');
            test.assert(
              arrayEquals(getimg(ctx, 10, y + 1), [0, 0, 255, 255]),
              'expected blue pixel'
            );
            for (let j = 2; j <= 7; j++) {
              const msg =
                'expected green pixel at pixel(10, ' +
                (y + j).toString() +
                '), skipping rest of errors';
              test.assert(arrayEquals(getimg(ctx, 10, y + j), [0, 255, 0, 255]), msg);
              if (!arrayEquals(getimg(ctx, 10, y + j), [0, 255, 0, 255])) return;
            }
          }
          for (let y = 6; y < 110; y++) {
            test.assert(
              arrayEquals(getimg(ctx, 17, y), [0, 255, 0, 255]),
              'expected green pixel at point(17, ' + y + ')'
            );
          }
        };
        img.src = diagram.makeImageData();
      }
    )
  );

  tablePanels.add(
    new Test(
      'separatorDashArray: Column',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,255,0,1)',
          },
          $(go.RowColumnDefinition, {
            column: 1,
            separatorStrokeWidth: 10,
            separatorStroke: 'rgba(0,0,255,1)',
            separatorDashArray: [2, 6],
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 1,
            height: 104,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 1,
            height: 104,
            fill: 'rgba(0,255,0,1)',
            row: 0,
            column: 1,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);

          for (let y = 6; y < 110; y++) {
            test.assert(
              arrayEquals(getimg(ctx, 6, y), [0, 255, 0, 255]),
              'expected green pixel at point(6, ' + y + ')'
            );
          }
          for (let y = 6; y < 109; y += 8) {
            test.assert(arrayEquals(getimg(ctx, 10, y), [0, 0, 255, 255]), 'expected blue pixel');
            test.assert(
              arrayEquals(getimg(ctx, 10, y + 1), [0, 0, 255, 255]),
              'expected blue pixel'
            );
            for (let j = 2; j <= 7; j++) {
              const msg =
                'expected green pixel at pixel(10, ' +
                (y + j).toString() +
                '), skipping rest of errors';
              test.assert(arrayEquals(getimg(ctx, 10, y + j), [0, 255, 0, 255]), msg);
              if (!arrayEquals(getimg(ctx, 10, y + j), [0, 255, 0, 255])) return;
            }
          }
          for (let y = 6; y < 110; y++) {
            test.assert(
              arrayEquals(getimg(ctx, 17, y), [0, 255, 0, 255]),
              'expected green pixel at point(17, ' + y + ')'
            );
          }
        };
        img.src = diagram.makeImageData();
      }
    )
  );

  tablePanels.add(
    new Test(
      'Row Definitions',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(100,255,0, .4)',
            defaultRowSeparatorStroke: 'gray',
            defaultRowSeparatorStrokeWidth: 10, // ,
          },
          $(go.RowColumnDefinition, {
            row: 1,
            separatorStrokeWidth: 30,
            separatorStroke: 'black',
            separatorDashArray: [3, 3, 2, 1, 5, 5, 1],
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 1,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,255,255, .3)',
            row: 2,
            column: 2,
          })
        );

        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);

        test.assert(panel.actualBounds.equalsApprox(new go.Rect(0, 0, 170, 130)));

        const row2 = panel.getRowDefinition(1);
        row2.height = 100;
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.elements.count === 4, 'Not the correct amount of elements');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 170, 260)),
          'Table not expected size'
        );
        test.assert(panel.rowCount === 3, 'More or less than 3 rows');
        test.assert(panel.columnCount === 3, 'More or less than 3 columns');
      }
    )
  ); // end test

  tablePanels.add(
    new Test(
      'Column Definitions',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(100,255,0, .4)',
            defaultColumnSeparatorStroke: new go.Brush('gray'),
            defaultColumnSeparatorStrokeWidth: 5,
          },
          $(go.RowColumnDefinition, {
            column: 1,
            separatorStroke: 'lightblue',
            separatorDashArray: [5, 10],
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 1,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 70,
            height: 70,
            fill: 'rgba(255,0,255, .3)',
            row: 1,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,255,255, .3)',
            row: 2,
            column: 2,
          })
        );

        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);

        test.assert(panel.actualBounds.equalsApprox(new go.Rect(0, 0, 190, 180)));
        const column3 = panel.getColumnDefinition(2);
        column3.height = 30;
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.elements.count === 4, 'Not the right amount of elements');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 160, 180)),
          'Table not expected size'
        );
        test.assert(panel.rowCount === 3, 'More or less than 3 rows');
        test.assert(panel.columnCount === 3, 'More or less than 3 columns');
      }
    )
  ); // end test

  tablePanels.add(
    new Test(
      'leftIndex',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,0,255,0.3)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 1,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 70,
            height: 70,
            fill: 'rgba(255,0,255, .3)',
            row: 1,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 80,
            height: 80,
            fill: 'rgba(255,255,0, .3)',
            row: 2,
            column: 2,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        panel.leftIndex = 1;
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 130, 130)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(-30, -5, 60, 60)),
          'Column 1 not pushed out'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(0, 0, 50, 50)),
          'Column 2 not column 1 now'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(70, 5, 40, 40)),
          'Column 3 not column 2 now'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(-35, 15, 70, 70)),
          'Column 1 not pushed out'
        );
        test.assert(
          panel.elt(4).actualBounds.equalsApprox(new go.Rect(50, 50, 80, 80)),
          'Column 3 not column 2 now'
        );
      }
    )
  );

  tablePanels.add(
    new Test(
      'topIndex',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(0,255,0, 0.3)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(255,0,0, .3)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 1,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 40,
            height: 40,
            fill: 'rgba(0,0,255, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 70,
            height: 70,
            fill: 'rgba(255,0,255, .3)',
            row: 1,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 80,
            height: 80,
            fill: 'rgba(255,255,0, .3)',
            row: 2,
            column: 0,
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        panel.topIndex = 1; // pushes the top row into the negatives
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.elements.count === 5, 'Shapes got deleted instead of pushed');
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 80, 150)),
          'Panel is not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(10, -30, 60, 60)),
          'Row 1 not pushed out'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(55, -25, 50, 50)),
          'Row 1 not pushed out'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(60, -20, 40, 40)),
          'Row 1 not pushed out'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(5, 0, 70, 70)),
          'Row 2 not row 1 now'
        );
        test.assert(
          panel.elt(4).actualBounds.equalsApprox(new go.Rect(0, 70, 80, 80)),
          'Row 3 not row 2 now'
        );
      }
    )
  ); // end test

  tablePanels.add(
    new Test(
      'Row/Column Sizing',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(255,255,0,0.1)',
            desiredSize: new go.Size(200, 200),
          },
          new go.Binding('rowSizing'),
          new go.Binding('columnSizing'),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255,0,0, .3)',
            row: 0,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
            row: 0,
            column: 2,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,0,255, .3)',
            row: 2,
            column: 0,
          }),
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,255, .3)',
            row: 2,
            column: 2,
          })
        );
        diagram.model = new go.GraphLinksModel(
          [
            {
              key: 1,
              rowSizing: go.RowColumnDefinition.None,
              columnSizing: go.RowColumnDefinition.None,
            },
            { key: 2 },
          ],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        let panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 200, 200)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 50, 50)),
          'Shape 1 not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(50, 0, 50, 50)),
          'Shape 2 not expected bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(0, 50, 50, 50)),
          'Shape 3 not expected bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(50, 50, 50, 50)),
          'Shape 4 not expected bounds'
        );
        test.assert(panel.findColumnForLocalX(150) === 3, 'Incorrect column');
        test.assert(panel.findRowForLocalY(120) === 3, 'Incorrect row');
        panel = diagram.findNodeForKey(2);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(220, 0, 200, 200)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(25, 25, 50, 50)),
          'Shape 1 not expected bounds'
        );
        test.assert(
          panel.elt(1).actualBounds.equalsApprox(new go.Rect(125, 25, 50, 50)),
          'Shape 2 not expected bounds'
        );
        test.assert(
          panel.elt(2).actualBounds.equalsApprox(new go.Rect(25, 125, 50, 50)),
          'Shape 3 not expected bounds'
        );
        test.assert(
          panel.elt(3).actualBounds.equalsApprox(new go.Rect(125, 125, 50, 50)),
          'Shape 4 not expected bounds'
        );
        test.assert(panel.findColumnForLocalX(150) === 2, 'Incorrect column');
        test.assert(panel.findRowForLocalY(120) === 2, 'Incorrect row');
      }
    )
  );

  tablePanels.add(
    new Test(
      'Table Row',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(255,255,0,0.1)',
          },
          $(
            go.Panel,
            'TableRow',
            { row: 0 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,0,0, .3)',
              column: 0,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,255,0, .3)',
              column: 1,
            })
          ),
          $(
            go.Panel,
            'TableRow',
            { row: 1 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,0,255, .3)',
              column: 0,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,255,0, .3)',
              column: 2,
            })
          ),
          $(
            go.Panel,
            'TableRow',
            { row: 2 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,255,255, .3)',
              column: 1,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,0,255, .3)',
              column: 2,
            })
          )
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 150, 150)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 50, 50)),
          'Row 1 Column 1 not expected bounds'
        );
        test.assert(
          panel.elt(0).elt(1).actualBounds.equalsApprox(new go.Rect(50, 0, 50, 50)),
          'Row 1 Column 2 not expected bounds'
        );
        test.assert(
          panel.elt(1).elt(0).actualBounds.equalsApprox(new go.Rect(0, 50, 50, 50)),
          'Row 2 Column 1 not expected bounds'
        );
        test.assert(
          panel.elt(1).elt(1).actualBounds.equalsApprox(new go.Rect(100, 50, 50, 50)),
          'Row 2 Column 3 not expected bounds'
        );
        test.assert(
          panel.elt(2).elt(0).actualBounds.equalsApprox(new go.Rect(50, 100, 50, 50)),
          'Row 3 Column 2 not expected bounds'
        );
        test.assert(
          panel.elt(2).elt(1).actualBounds.equalsApprox(new go.Rect(100, 100, 50, 50)),
          'Row 3 Column 3 not expected bounds'
        );
      }
    )
  );

  tablePanels.add(
    new Test(
      'Table Column',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Table',
          {
            background: 'rgba(255,255,0,0.1)',
          },
          $(
            go.Panel,
            'TableColumn',
            { column: 0 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,0,0, .3)',
              row: 0,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,255,0, .3)',
              row: 1,
            })
          ),
          $(
            go.Panel,
            'TableColumn',
            { column: 1 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,0,255, .3)',
              row: 0,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,255,0, .3)',
              row: 2,
            })
          ),
          $(
            go.Panel,
            'TableColumn',
            { column: 2 },
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(0,255,255, .3)',
              row: 1,
            }),
            $(go.Shape, 'Rectangle', {
              strokeWidth: 0,
              width: 50,
              height: 50,
              fill: 'rgba(255,0,255, .3)',
              row: 2,
            })
          )
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 150, 150)),
          'Panel not expected bounds'
        );
        test.assert(
          panel.elt(0).elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 50, 50)),
          'Column 1 Row 1 not expected bounds'
        );
        test.assert(
          panel.elt(0).elt(1).actualBounds.equalsApprox(new go.Rect(0, 50, 50, 50)),
          'Column 1 Row 2 not expected bounds'
        );
        test.assert(
          panel.elt(1).elt(0).actualBounds.equalsApprox(new go.Rect(50, 0, 50, 50)),
          'Column 2 Row 1 not expected bounds'
        );
        test.assert(
          panel.elt(1).elt(1).actualBounds.equalsApprox(new go.Rect(50, 100, 50, 50)),
          'Column 2 Row 3 not expected bounds'
        );
        test.assert(
          panel.elt(2).elt(0).actualBounds.equalsApprox(new go.Rect(100, 50, 50, 50)),
          'Column 3 Row 2 not expected bounds'
        );
        test.assert(
          panel.elt(2).elt(1).actualBounds.equalsApprox(new go.Rect(100, 100, 50, 50)),
          'Column 3 Row 3 not expected bounds'
        );
      }
    )
  );

  // viewbox tests =====================================================================================================
  viewboxPanels.add(
    new Test(
      'Viewbox Uniform',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Viewbox',
          {
            desiredSize: new go.Size(100, 120),
            background: 'rgba(255,255,255,1)',
          },
          new go.Binding('desiredSize'),
          $(
            go.Shape,
            'Rectangle',
            { strokeWidth: 0, width: 60, height: 60, fill: 'rgba(255,255,0, .7)' },
            new go.Binding('figure')
          )
        );
        diagram.model = new go.GraphLinksModel(
          [
            { key: 1 },
            { key: 2, desiredSize: new go.Size(120, 100) },
            { key: 3, figure: 'Triangle', desiredSize: new go.Size(135, 132.5) },
            { key: 4, figure: 'Ellipse', desiredSize: new go.Size(150, 100) },
            { key: 5, figure: 'Circle', desirsedSize: new go.Size(150, 150) },
          ],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = [
          'Rect(0,10,100,100)',
          'Rect(0,0,100,120)',
          'Rect(10,0,100,100)',
          'Rect(120,0,120,100)',
          'Rect(1.25,0,132.5,132.5)',
          'Rect(260,0,135,132.5)',
          'Rect(25,0,100,100)',
          'Rect(0,152.5,150,100)',
          'Rect(0,10,100,100)',
          'Rect(170,152.5,100,120)',
        ];
        // let panel = diagram.findNodeForKey(1);
        for (let i = 1; i < 6; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.elt(0).actualBounds.toString() === expected[2 * i - 2],
            'Shape not change size to match the viewbox size'
          );
          test.assert(
            panel.actualBounds.toString() === expected[2 * i - 1],
            'Viewbox changed size'
          );
        }
      }
    )
  ); // end test

  viewboxPanels.add(
    new Test(
      'Viewbox UniformToFill',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Viewbox',
          {
            desiredSize: new go.Size(120, 100),
            background: 'rgba(255,255,255,1)',
            viewboxStretch: go.GraphObject.UniformToFill,
          },
          new go.Binding('desiredSize'),
          $(
            go.Shape,
            'Rectangle',
            { strokeWidth: 0, fill: 'rgba(255,0,255,.7)' },
            new go.Binding('figure'),
            new go.Binding('width'),
            new go.Binding('height')
          )
        );
        diagram.model = new go.GraphLinksModel(
          [
            { key: 1 },
            { key: 2 },
            { key: 3, figure: 'Triangle', height: 100 },
            { key: 4, figure: 'Ellipse', desiredSize: new go.Size(150, 100), width: 20 },
            {
              key: 5,
              figure: 'Circle',
              desirsedSize: new go.Size(100, 100),
              height: NaN,
              width: NaN,
            },
          ],
          []
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(2);
        panel.desiredSize = new go.Size(100, 120);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = [];
        for (let i = 1; i < 6; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.actualBounds.toString().height === panel.elt(0).actualBounds.toString().height,
            "Shape's height not change size to match the viewbox size"
          );
          test.assert(
            panel.actualBounds.toString().width === panel.elt(0).actualBounds.toString().width,
            "Shape's width not change size to match the viewbox size"
          );
        }
      }
    )
  ); // end test

  viewboxPanels.add(
    new Test(
      'Viewbox adjust size',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Viewbox',
          {
            desiredSize: new go.Size(100, 100),
            background: 'rgba(255,255,255,1)',
          },
          $(go.Shape, 'Rectangle', {
            strokeWidth: 0,
            width: 60,
            height: 60,
            fill: 'rgba(0,255,255,.7)',
          })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }, { key: 2 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        let panel = diagram.findNodeForKey(1);
        panel.desiredSize = new go.Size(120, 120);
        panel = diagram.findNodeForKey(2);
        panel.desiredSize = new go.Size(150, 80);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        let panel = diagram.findNodeForKey(1);
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 120, 120)),
          'Shape not expected bounds'
        );
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 120, 120)),
          'Panel not expected bounds'
        );
        panel = diagram.findNodeForKey(2);
        test.assert(
          panel.elt(0).actualBounds.equalsApprox(new go.Rect(35, 0, 80, 80)),
          'Shape not expected bounds'
        );
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(120, 0, 150, 80)),
          'Panel not expected bounds'
        );
      }
    )
  );

  // grid tests ================================================================================================================
  gridPanels.add(
    new Test(
      'Grid Defaults',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Grid',
          {
            width: 400,
            height: 400,
          },
          $(go.Shape, 'LineV', { stroke: 'red' }),
          $(go.Shape, 'LineH', { stroke: 'green' })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 400, 400)),
          'Panel not expected bounds'
        );
        test.assert(panel.elements.count === 2, 'Not 2 shapes (LineV and LineH)');
        test.assert(panel.gridOrigin.toString() === 'Point(0,0)', 'Not correct default gridOrigin');
        test.assert(
          panel.gridCellSize.toString() === 'Size(10,10)',
          'Not correct default gridCellSize'
        );
        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);
          const redgreen = (a: Uint8ClampedArray) => a[0] > 50 && a[1] > 50 && a[2] === 0;
          test.assert(redgreen(getimg(ctx, 6, 6)), 'Expected red/green pixel at pixel (6,6)');
          test.assert(redgreen(getimg(ctx, 6, 26)), 'Expected red/green pixel at pixel (26,6)');
          test.assert(redgreen(getimg(ctx, 26, 6)), 'Expected red/green pixel at pixel (26,6)');
        };
        img.src = diagram.makeImageData();
      }
    )
  ); // end test

  gridPanels.add(
    new Test(
      'Rows only',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Grid',
          {
            width: 400,
            height: 400,
          },
          $(go.Shape, 'LineH', { stroke: 'green' })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 400, 400)),
          'Panel not expected bounds'
        );
        test.assert(panel.elements.count === 1, 'Not 1 shape (LineH)');
        test.assert(panel.gridOrigin.toString() === 'Point(0,0)', 'Not correct default gridOrigin');
        test.assert(
          panel.gridCellSize.toString() === 'Size(10,10)',
          'Not correct default gridCellSize'
        );
        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);
          const green = (a: Uint8ClampedArray) => a[0] === 0 && a[1] > 100 && a[2] === 0;
          test.assert(
            green(getimg(ctx, 6, 6)),
            'Expected green pixel at pixel (6,6), got: ' + getimg(ctx, 6, 6).toString()
          );
          test.assert(
            green(getimg(ctx, 6, 16)),
            'Expected green pixel at pixel (16,6), got: ' + getimg(ctx, 6, 16).toString()
          );
          test.assert(
            green(getimg(ctx, 6, 26)),
            'Expected green pixel at pixel (26,6), got: ' + getimg(ctx, 6, 26).toString()
          );
          test.assert(
            green(getimg(ctx, 88, 66)),
            'Expected green pixel at pixel (66,88), got: ' + getimg(ctx, 88, 66).toString()
          );
          test.assert(
            arrayEquals(getimg(ctx, 88, 67), [0, 0, 0, 0]),
            'Expected white pixel at (67,88), got: ' + getimg(ctx, 88, 67).toString()
          );
        };
        img.src = diagram.makeImageData();
      }
    )
  ); // end test

  gridPanels.add(
    new Test(
      'Columns only',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Grid',
          {
            width: 400,
            height: 400,
          },
          $(go.Shape, 'LineV', { stroke: 'red' })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 400, 400)),
          'Panel not expected bounds'
        );
        test.assert(panel.elements.count === 1, 'Not 1 shape (LineV)');
        test.assert(panel.gridOrigin.toString() === 'Point(0,0)', 'Not correct default gridOrigin');
        test.assert(
          panel.gridCellSize.toString() === 'Size(10,10)',
          'Not correct default gridCellSize'
        );
        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);

          const red = (a: Uint8ClampedArray) => a[0] > 200 && a[1] === 0 && a[2] === 0;
          test.assert(red(getimg(ctx, 6, 6)), 'Expected red pixel at pixel (6,6)');
          test.assert(red(getimg(ctx, 16, 6)), 'Expected red pixel at pixel (16,6)');
          test.assert(red(getimg(ctx, 26, 6)), 'Expected red pixel at pixel (26,6)');
          test.assert(red(getimg(ctx, 66, 88)), 'Expected red pixel at pixel (66,88)');
          test.assert(
            arrayEquals(getimg(ctx, 67, 88), [0, 0, 0, 0]),
            'Expected white pixel at (67,88)'
          );
        };
        img.src = diagram.makeImageData();
      }
    )
  ); // end test

  gridPanels.add(
    new Test(
      'Grid Cell Size/Origin',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Grid',
          {
            gridCellSize: new go.Size(40, 40),
            width: 400,
            height: 400,
            gridOrigin: new go.Point(20, 20),
          },
          $(go.Shape, 'BarV', { fill: 'red', width: 10 }),
          $(go.Shape, 'BarH', { fill: 'green', height: 10 })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        panel.gridCellSize = new go.Size(1000, 20);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 400, 400)),
          'Panel not correct bounds'
        );
        test.assert(panel.elements.count === 2, 'Not 2 shapes (BarV and BarH)');
        test.assert(panel.gridCellSize.toString() === 'Size(1000,20)', 'Not correct gridCellSize');
        test.assert(panel.gridOrigin.toString() === 'Point(20,20)', 'Not correct grid origin');

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);
          test.assert(
            arrayEquals(getimg(ctx, 28, 56), [255, 0, 0, 255]),
            'Expected red pixel at pixel(28,56)'
          );
          test.assert(
            arrayEquals(getimg(ctx, 6, 16), [0, 0, 0, 0]),
            'Expected white pixel at pixel(6, 16)'
          );
          test.assert(
            arrayEquals(getimg(ctx, 6, 35), [0, 128, 0, 255]),
            'Expected green pixel at pixel(6,35)'
          );
        };
        img.src = diagram.makeImageData();
      }
    )
  ); // end test

  gridPanels.add(
    new Test(
      'Line intervals',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Grid',
          {
            width: 400,
            height: 400,
          },
          $(go.Shape, 'LineH', { stroke: 'red' }),
          $(go.Shape, 'LineV', { stroke: 'green' }),
          $(go.Shape, 'BarH', { fill: 'orange', interval: 5 }),
          $(go.Shape, 'BarV', { fill: 'purple', interval: 10 })
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(
          panel.actualBounds.equalsApprox(new go.Rect(0, 0, 400, 400)),
          'Panel not expected bounds'
        );
        test.assert(panel.elements.count === 4, 'Not 4 shapes');

        const img = new Image();
        img.onload = function () {
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          if (!ctx) return;
          can.width = img.width;
          can.height = img.height;
          ctx.drawImage(img, 0, 0);
          const red = (a: Uint8ClampedArray) => a[0] > 200 && a[1] === 0 && a[2] === 0;
          const green = (a: Uint8ClampedArray) => a[0] === 0 && a[1] > 100 && a[2] === 0;
          test.assert(
            arrayEquals(getimg(ctx, 6, 6), [128, 0, 128, 255]),
            'Expected purple pixel at pixel (6,6)'
          );
          test.assert(
            arrayEquals(getimg(ctx, 100, 6), [255, 165, 0, 255]),
            'Expected orange pixel at pixel (100, 6)'
          );
          test.assert(red(getimg(ctx, 50, 16)), 'Expected red pixel at pixel (50,16)');
          test.assert(
            green(getimg(ctx, 95, 17)),
            'Expected green pixel at pixel (95,17), got: ' + getimg(ctx, 95, 17).toString()
          );
        };
        img.src = diagram.makeImageData();
      }
    )
  ); // end test

  // misc tests ========================================================================================================================
  function parseType(s: string): go.PanelLayout {
    if (s === 'H') {
      return go.Panel.Horizontal;
    }
    return go.Panel.Vertical;
  }

  function stringifyType(t: go.PanelLayout): string {
    if (t === go.Panel.Horizontal) {
      return 'H';
    }
    return 'V';
  }

  paneltests.add(
    new Test(
      'binding Panel.type',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();

        diagram.nodeTemplate = $(
          go.Node,
          'Vertical',
          new go.Binding('type', 'type', parseType).makeTwoWay(stringifyType),
          $(
            go.Shape,
            { fill: 'white' },
            new go.Binding('height'),
            new go.Binding('width'),
            new go.Binding('fill', 'color')
          ),
          $(go.TextBlock, new go.Binding('text').makeTwoWay()),
          $('Button', {
            name: 'BUTTON',
            'ButtonBorder.figure': 'Circle',
            width: 12,
            height: 12,
            alignment: go.Spot.TopRight,
            click: function (e: go.InputEvent & any, but: go.GraphObject): void {
              e.diagram.commit(function (d: go.Diagram): void {
                but.part!.type =
                  but.part!.type === go.Panel.Horizontal ? go.Panel.Vertical : go.Panel.Horizontal;
              }, 'toggle panel type');
            },
          })
        );

        diagram.groupTemplate = $(
          go.Group,
          'Auto',
          { layout: $(go.LayeredDigraphLayout, { columnSpacing: 10 }) },
          $(go.Shape, { fill: null }),
          $(
            go.Panel,
            'Vertical',
            $(
              go.Panel,
              'Table',
              { background: 'darkblue', stretch: go.GraphObject.Horizontal, height: 20 },
              $(
                go.TextBlock,
                { font: 'bold 10pt sans-serif', stroke: 'white' },
                new go.Binding('text')
              )
            ),
            $(go.Placeholder, { padding: 5 })
          )
        );

        diagram.model = new go.GraphLinksModel(
          [
            { key: 0, text: 'G1', isGroup: true },
            {
              key: 1,
              text: 'Alpha',
              color: 'lightblue',
              group: 5,
              width: 80,
              height: 30,
              type: 'H',
            },
            { key: 2, text: 'Beta', color: 'orange', group: 5, width: 100, height: 100 },
            { key: 3, text: 'Gamma', color: 'lightgreen', group: 0, width: 80, height: 30 },
            { key: 4, text: 'Delta', color: 'pink', group: 5, width: 80, height: 30, type: 'H' },
            { key: 5, text: 'G2', isGroup: true, group: 0 },
          ],
          [
            // { from: 1, to: 2 },
            // { from: 3, to: 4 },
            // { from: 4, to: 2 }
            { from: 2, to: 1 },
            { from: 4, to: 3 },
            { from: 2, to: 4 },
          ]
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = diagram.findNodeForKey(1);
        const beta = diagram.findNodeForKey(2);
        const gamma = diagram.findNodeForKey(3);
        const delta = diagram.findNodeForKey(4);
        test.assert(
          alpha && alpha.actualBounds.width > 111,
          'alpha width is: ' + alpha.actualBounds.width
        );
        test.assert(
          beta && test.isApprox(beta.actualBounds.width, 101),
          'beta width is: ' + beta.actualBounds.width
        );
        test.assert(
          gamma && test.isApprox(gamma.actualBounds.width, 81),
          'gamma width is: ' + gamma.actualBounds.width
        );
        test.assert(
          delta && delta.actualBounds.width > 111,
          'delta width is: ' + delta.actualBounds.width
        );

        test.diagram.model.commit(function (m: go.Diagram & any): void {
          m.nodeDataArray.forEach(function (d: Object & any): void {
            m.set(d, 'type', d.type === 'H' ? 'V' : 'H');
          });
        }, 'switch all panel types');

        test.assert(
          alpha && test.isApprox(alpha.actualBounds.width, 81),
          'alpha width is: ' + alpha.actualBounds.width
        );
        test.assert(
          beta && beta.actualBounds.width > 111,
          'beta width is: ' + beta.actualBounds.width
        );
        test.assert(
          gamma && gamma.actualBounds.width > 111,
          'gamma width is: ' + gamma.actualBounds.width
        );
        test.assert(
          delta && test.isApprox(delta.actualBounds.width, 81),
          'delta width is: ' + delta.actualBounds.width
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = diagram.findNodeForKey(1);
        const beta = diagram.findNodeForKey(2);
        const gamma = diagram.findNodeForKey(3);
        const delta = diagram.findNodeForKey(4);

        let but = beta.findObject('BUTTON');
        test.mouseDown(but.getDocumentPoint(go.Spot.Center));
        test.mouseUp(but.getDocumentPoint(go.Spot.Center));

        but = gamma.findObject('BUTTON');
        test.mouseDown(but.getDocumentPoint(go.Spot.Center));
        test.mouseUp(but.getDocumentPoint(go.Spot.Center));

        test.assert(
          alpha && test.isApprox(alpha.actualBounds.width, 81),
          'alpha width is: ' + alpha.actualBounds.width
        );
        test.assert(
          beta && test.isApprox(beta.actualBounds.width, 101),
          'beta width is: ' + beta.actualBounds.width
        );
        test.assert(
          gamma && test.isApprox(gamma.actualBounds.width, 81),
          'gamma width is: ' + gamma.actualBounds.width
        );
        test.assert(
          delta && test.isApprox(delta.actualBounds.width, 81),
          'delta width is: ' + delta.actualBounds.width
        );
      }
    )
  ); // end test

  paneltests.add(
    new Test(
      'Margin',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          { background: 'rgba(0,255,0,.6)', desiredSize: new go.Size(100, 100) },
          $(
            go.Shape,
            'Rectangle',
            { height: 50, width: 50, fill: 'blue', position: new go.Point(0, 0) },
            new go.Binding('margin'),
            new go.Binding('figure')
          ),
          $(
            go.Shape,
            'Rectangle',
            { height: 50, width: 50, fill: 'green', position: new go.Point(50, 50) },
            new go.Binding('figure')
          )
        );
        diagram.model = new go.GraphLinksModel([
          { key: 1, margin: 10 },
          { key: 2, margin: new go.Margin(10) },
          { key: 3, margin: new go.Margin(10, 20) },
          { key: 4, margin: new go.Margin(10, 20, 30, 40) },
          { key: 5 },
          { key: 6, margin: -10 },
          { key: 7, margin: new go.Margin(20), figure: 'Triangle' },
          { key: 8, margin: new go.Margin(-10, 10), figure: 'Circle' },
          { key: 9, margin: new go.Margin(25) },
          { key: 10 },
        ]);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const p9 = diagram.findNodeForKey(9);
        p9.elt(1).position = new go.Point(0, 0);
        p9.elt(1).width = 70;
        p9.elt(1).height = 70;
        p9.elt(1).margin = new go.Margin(15);
        p9.elt(1).fill = 'rgba(0,0,255,.3)';
        p9.elt(1).figure = 'Circle';

        const p10 = diagram.findNodeForKey(10);
        p10.add(
          $(
            go.Panel,
            'Auto',
            {
              margin: new go.Margin(25),
              background: 'rgba(255,0,0,.5)',
              desiredSize: new go.Size(50, 50),
            },
            $(go.Shape, 'Triangle', { margin: new go.Margin(10), desiredSize: new go.Size(30, 30) })
          )
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expectedMargin = [
          'Margin(10,10,10,10)',
          'Margin(10,10,10,10)',
          'Margin(10,20,10,20)',
          'Margin(10,20,30,40)',
          'Margin(0,0,0,0)',
          'Margin(-10,-10,-10,-10)',
          'Margin(20,20,20,20)',
          'Margin(-10,10,-10,10)',
        ];
        const expectedBounds = [
          'Rect(10,10,51,51)',
          'Rect(10,10,51,51)',
          'Rect(20,10,51,51)',
          'Rect(40,10,51,51)',
          'Rect(0,0,51,51)',
          'Rect(-10,-10,51,51)',
          'Rect(20,20,51,51)',
          'Rect(10,-10,51,51)',
        ];
        for (let i = 1; i < 9; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.elt(0).margin.toString() === expectedMargin[i - 1],
            'Margin not set correctly'
          );
          test.assert(
            panel.elt(0).actualBounds.toString() === expectedBounds[i - 1],
            'Shape position not adjusted correctly for margins'
          );
        }
        const p9 = diagram.findNodeForKey(9);
        test.assert(
          p9.elt(0).margin.toString() === 'Margin(25,25,25,25)',
          'Margin not set correctly'
        );
        test.assert(
          p9.elt(0).actualBounds.equalsApprox(new go.Rect(25, 25, 51, 51)),
          'Shape position not adjusted correctly for margin'
        );
        test.assert(
          p9.elt(1).margin.toString() === 'Margin(15,15,15,15)',
          'Margin not set correctly'
        );
        test.assert(
          p9.elt(1).actualBounds.equalsApprox(new go.Rect(15, 15, 71, 71)),
          'Shape position not adjusted correctly for margin'
        );
        const p10 = diagram.findNodeForKey(10);
        const p102 = p10.elt(2);
        test.assert(
          p102.margin.toString() === 'Margin(25,25,25,25)',
          'Panel margin not set correctly'
        );
        test.assert(
          p102.actualBounds.equalsApprox(new go.Rect(25, 25, 50, 50)),
          'Panel actual bounds not expected'
        );
        test.assert(
          p102.elt(0).margin.toString() === 'Margin(10,10,10,10)',
          'Shape inside panel margin not set correctly'
        );
        test.assert(
          p102.elt(0).actualBounds.equalsApprox(new go.Rect(10, 10, 31, 31)),
          'Shape inside panel not expected bounds'
        );
      }
    )
  );

  paneltests.add(
    new Test(
      'Panel Position',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          { background: 'rgba(0,255,0,.6)', desiredSize: new go.Size(100, 100) },
          new go.Binding('position'),
          $(go.Shape, 'Circle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(go.Shape, 'Triangle', {
            height: 50,
            width: 50,
            fill: 'green',
            position: new go.Point(50, 50),
          })
        );
        diagram.model = new go.GraphLinksModel([
          { key: 1 },
          { key: 2, position: new go.Point(0, 0) },
          { key: 3, position: new go.Point(1000, 1000) },
          { key: 4, position: new go.Point(-10, -10) },
          { key: 5, position: new go.Point(NaN, NaN) },
          { key: 6, position: new go.Point(Infinity, Infinity) },
        ]);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = [
          'Point(0,0)',
          'Point(0,0)',
          'Point(1000,1000)',
          'Point(-10,-10)',
          'Point(120,0)',
          'Point(0,120)',
        ];
        for (let i = 1; i < 7; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(panel.position.toString() === expected[i - 1], 'Position not set correctly');
        }
      }
    )
  );

  paneltests.add(
    new Test(
      'Shape Position',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          { background: 'rgba(0,255,0,.6)', desiredSize: new go.Size(100, 100) },
          $(
            go.Shape,
            'Rectangle',
            { height: 50, width: 50, fill: 'blue' },
            new go.Binding('position')
          ),
          $(
            go.Shape,
            'Rectangle',
            { height: 50, width: 50, fill: 'green' },
            new go.Binding('position')
          )
        );
        diagram.model = new go.GraphLinksModel([
          { key: 1 },
          { key: 2, position: new go.Point(0, 0) },
          { key: 3, position: new go.Point(1000, 1000) },
          { key: 4, position: new go.Point(-10, -10) },
        ]);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = ['Point(NaN,NaN)', 'Point(0,0)', 'Point(1000,1000)', 'Point(-10,-10)'];
        for (let i = 1; i < 5; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.elt(0).position.toString() === expected[i - 1],
            'Position of shape 1 not set correctly'
          );
          test.assert(
            panel.elt(1).position.toString() === expected[i - 1],
            'Position of shape 2 not set correctly'
          );
        }
      }
    )
  );

  paneltests.add(
    new Test(
      'Background',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          { desiredSize: new go.Size(100, 100) },
          new go.Binding('background'),
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'green',
            position: new go.Point(50, 50),
          })
        );
        diagram.model = new go.GraphLinksModel([
          { key: 1, background: 'rgba(0,255,0,.6)' },
          { key: 2, background: 'blue' },
          { key: 3, background: 'transparent' },
          { key: 4, background: new go.Brush('orange') },
          { key: 5, background: null },
          { key: 6 },
        ]);
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = ['rgba(0,255,0,.6)', 'blue', 'transparent', 'Brush(orange)'];
        for (let i = 1; i < 5; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.background.toString() === expected[i - 1],
            'Background not set correctly'
          );
        }
        test.assert(!diagram.findNodeForKey(5).background, 'Not null background');
        test.assert(!diagram.findNodeForKey(6).background, 'Not default null background');
        test.assert(
          !diagram.findObjectAt(new go.Point(250, 200)),
          "Found an object when there shouldn't be one"
        );
        test.assert(
          diagram.findObjectAt(new go.Point(250, 130)) instanceof go.Shape,
          "Didn't find a shape where there should be one"
        );
        test.assert(
          diagram.findObjectAt(new go.Point(250, 10)) instanceof go.Shape,
          "Didn't find a shape where there should be one"
        );
        test.assert(!(diagram.findObjectAt(new go.Point(250, 75)) instanceof go.Shape), 'Shape');
        test.assert(diagram.findObjectAt(new go.Point(250, 75)) instanceof go.Node, 'Not node');
      }
    )
  );

  paneltests.add(
    new Test(
      'pickable',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          { desiredSize: new go.Size(100, 100), pickable: false, background: 'orange' },
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(
            go.Panel,
            'Vertical',
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'purple',
              position: new go.Point(50, 50),
            }),
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'green',
              position: new go.Point(50, 50),
            })
          )
        );
        diagram.model = new go.GraphLinksModel([{ key: 1 }], []);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.mouseDown(panel.actualBounds.center, { timestamp: 0 });
        test.mouseMove(new go.Point(-50, -50), { timestamp: 100 });
        test.mouseUp(new go.Point(-100, -100), { timestamp: 200 }); // far away
        test.mouseDown(panel.elt(0).actualBounds.center, { timestamp: 300 });
        test.mouseMove(new go.Point(50, 50), { timestamp: 400 });
        test.mouseUp(new go.Point(100, 100), { timestamp: 500 }); // far away
        test.mouseDown(panel.elt(1).elt(0).actualBounds.center, { timestamp: 600 });
        test.mouseMove(new go.Point(-50, -50), { timestamp: 700 });
        test.mouseUp(new go.Point(-100, -100), { timestamp: 800 }); // far away
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(panel.actualBounds.center.toString() === 'Point(50,50)', 'Panel moved');
        test.assert(!panel.isActionable, 'Panel is still actionable');
        test.assert(diagram.findObjectAt(new go.Point(50, 50)) === null, 'Panel is pickable');
        test.assert(
          diagram.findObjectAt(new go.Point(-100, -100)) === null,
          'Panel is pickable at the move to location'
        );
      }
    )
  );

  paneltests.add(
    new Test(
      'opacity',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        const opacityPanel = $(
          go.Node,
          'Horizontal',
          { desiredSize: new go.Size(100, 100), opacity: 0, background: 'orange' },
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(
            go.Panel,
            'Vertical',
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'purple',
              position: new go.Point(50, 50),
            }),
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'green',
              position: new go.Point(50, 50),
            })
          )
        );
        const opacityShape = $(
          go.Node,
          'Horizontal',
          { background: 'orange' },
          $(go.Shape, 'Rectangle', {
            height: 200,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(go.Shape, 'Circle', {
            height: 25,
            width: 25,
            fill: 'purple',
            margin: new go.Margin(10),
            opacity: 0,
          }),
          $(go.Shape, 'Square', { height: 25, width: 25, fill: 'cyan', margin: new go.Margin(10) }),
          $(go.Shape, 'Diamond', {
            height: 25,
            width: 25,
            fill: 'green',
            margin: new go.Margin(10),
            opacity: 0,
          }),
          $(go.Shape, 'Square', { height: 25, width: 25, fill: 'red', margin: new go.Margin(10) })
        );
        diagram.add(opacityPanel);
        diagram.add(opacityShape);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findObjectAt(new go.Point(50, 50));
        test.mouseDown(panel.actualBounds.center, { timestamp: 0 });
        test.mouseMove(new go.Point(50, 100), { timestamp: 100 });
        test.mouseUp(new go.Point(50, 300), { timestamp: 200 }); // far away
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        test.assert(
          diagram.findObjectAt(new go.Point(50, 300)),
          'Panel not moved to expected location 50,300'
        );
        test.assert(!diagram.findObjectAt(new go.Point(50, 50)), 'Panel not moved from 50,50');
        const it = diagram.nodes;
        it.next();
        const alpha = it.value;
        test.assert(
          alpha.actualBounds.equalsApprox(new go.Rect(24.5, 250, 100, 100)),
          "Didn't move to expected position 24.5,250"
        );
        it.next();
        const beta = it.value;
        test.assert(
          beta.elt(1).actualBounds.equalsApprox(new go.Rect(61, 87.5, 26, 26)),
          'Bounds changed'
        );
        test.assert(
          beta.elt(2).actualBounds.equalsApprox(new go.Rect(107, 87.5, 26, 26)),
          'Bounds changed'
        );
        test.assert(
          beta.elt(3).actualBounds.equalsApprox(new go.Rect(153, 87.5, 26, 26)),
          'Bounds changed'
        );
        test.assert(
          beta.elt(4).actualBounds.equalsApprox(new go.Rect(199, 87.5, 26, 26)),
          'Bounds changed'
        );
      }
    )
  );

  paneltests.add(
    new Test(
      'visible',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        const visiblePanel = $(
          go.Node,
          'Horizontal',
          { desiredSize: new go.Size(100, 100), visible: false, background: 'orange' },
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(
            go.Panel,
            'Vertical',
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'purple',
              position: new go.Point(50, 50),
            }),
            $(go.Shape, 'Rectangle', {
              height: 50,
              width: 50,
              fill: 'green',
              position: new go.Point(50, 50),
            })
          )
        );
        const visibleShape = $(
          go.Node,
          'Horizontal',
          { background: 'orange' },
          $(go.Shape, 'Rectangle', {
            height: 200,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(go.Shape, 'Circle', {
            height: 25,
            width: 25,
            fill: 'purple',
            margin: new go.Margin(10),
            visible: false,
          }),
          $(go.Shape, 'Square', { height: 25, width: 25, fill: 'cyan', margin: new go.Margin(10) }),
          $(go.Shape, 'Diamond', {
            height: 25,
            width: 25,
            fill: 'green',
            margin: new go.Margin(10),
            visible: false,
          }),
          $(go.Shape, 'Square', { height: 25, width: 25, fill: 'red', margin: new go.Margin(10) })
        );
        diagram.add(visiblePanel);
        diagram.add(visibleShape);
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.nodes.first();
        test.mouseDown(panel.actualBounds.center, { timestamp: 0 });
        test.mouseMove(new go.Point(-50, -50), { timestamp: 100 });
        test.mouseUp(new go.Point(-100, -100), { timestamp: 200 }); // far away
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        const panel = diagram.findNodeForKey(1);
        test.assert(diagram.nodes.count === 2, 'Deleted one of the panels');
        const it = diagram.nodes;
        it.next();
        const alpha = it.value;
        test.assert(
          alpha.actualBounds.toString() === 'Rect(NaN,NaN,100,100)',
          'Invisible panel not expected bounds'
        );
        it.next();
        const beta = it.value;
        test.assert(
          beta.elt(1).actualBounds.toString() === 'Rect(NaN,NaN,NaN,NaN)',
          'Invisible bounds not expected'
        );
        test.assert(
          beta.elt(2).actualBounds.equalsApprox(new go.Rect(61, 87.5, 26, 26)),
          'Visible bounds not expected'
        );
        test.assert(
          beta.elt(3).actualBounds.toString() === 'Rect(NaN,NaN,NaN,NaN)',
          'Invisible bounds not expected'
        );
        test.assert(
          beta.elt(4).actualBounds.equalsApprox(new go.Rect(107, 87.5, 26, 26)),
          'Visible bounds not expected'
        );
      }
    )
  );

  paneltests.add(
    new Test(
      'minSize/maxSize',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          {
            resizable: true,
            minSize: new go.Size(80, 80),
            maxSize: new go.Size(120, 120),
            background: 'rgba(255,165,0,.5)',
          },
          new go.Binding('desiredSize'),
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            position: new go.Point(0, 0),
          }),
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'green',
            position: new go.Point(50, 50),
          })
        );
        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, desiredSize: new go.Size(100, 100) },
            { key: 2, desiredSize: new go.Size(150, 100) },
            { key: 3, desiredSize: new go.Size(100, 150) },
            { key: 4, desiredSize: new go.Size(50, 100) },
            { key: 5, desiredSize: new go.Size(100, 50) },
            { key: 6, desiredSize: new go.Size(Infinity, Infinity) },
            { key: 7 },
          ],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const expected = [
          'Rect(0,0,100,100)',
          'Rect(120,0,120,100)',
          'Rect(260,0,100,120)',
          'Rect(0,140,80,100)',
          'Rect(100,140,100,80)',
          'Rect(220,140,101,101)', // extra pixel?
          'Rect(0,261,101,101)',
        ];
        for (let i = 1; i < 8; i++) {
          const panel = diagram.findNodeForKey(i);
          test.assert(
            panel.actualBounds.toString() === expected[i - 1],
            'Not correctly following mixsize/maxsize'
          );
          test.assert(
            panel.elt(0).actualBounds.equalsApprox(new go.Rect(0, 0, 51, 51)),
            'Shape 1 changed bounds'
          );
          test.assert(
            panel.elt(1).actualBounds.equalsApprox(new go.Rect(50, 50, 51, 51)),
            'Shape 2 changed bounds'
          );
        }
      }
    )
  );

  paneltests.add(
    new Test(
      'Main Panel',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Spot',
          { background: 'rgba(255,165,0,.5)' },
          $(go.Shape, 'Rectangle', {
            height: 50,
            width: 50,
            fill: 'blue',
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Left,
          }),
          $(
            go.Shape,
            'Rectangle',
            { height: 50, width: 50, fill: 'green' },
            new go.Binding('isPanelMain', 'isPanelMain1')
          ),
          $(
            go.Shape,
            'Rectangle',
            {
              height: 50,
              width: 50,
              fill: 'blue',
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Right,
            },
            new go.Binding('isPanelMain', 'isPanelMain2')
          )
        );
        diagram.model = new go.GraphLinksModel(
          [
            { key: 1, isPanelMain1: true },
            { key: 2, isPanelMain1: true, isPanelMain2: true },
            { key: 3 },
          ],
          []
        );
      },
      undefined,
      function (test: Test & any): void {
        const diagram = test.diagram;
        const alpha = diagram.findNodeForKey(1);
        const beta = diagram.findNodeForKey(2);
        const delta = diagram.findNodeForKey(3);
        test.assert(
          alpha.elt(1) === alpha.findMainElement(),
          'Did not correctly find the right panel main'
        );
        test.assert(!alpha.elt(0).isPanelMain, 'Not false isPanelMain');
        test.assert(!alpha.elt(2).isPanelMain, 'Not false isPanelMain');

        test.assert(
          beta.elt(1) === beta.findMainElement(),
          'Did not correctly find the right panel main'
        );
        test.assert(
          beta.elt(2) !== beta.findMainElement(),
          'Choose the first shape as a main element'
        );
        test.assert(!beta.elt(0).isPanelMain, 'Not false isPanelMain');
        test.assert(beta.elt(2).isPanelMain, 'Not true isPanelMain');

        test.assert(
          delta.elt(0) === delta.findMainElement(),
          'Did not correctly find the right panel main'
        );
        test.assert(!delta.elt(0).isPanelMain, 'Not false isPanelMain');
        test.assert(!delta.elt(1).isPanelMain, 'Not false isPanelMain');
        test.assert(!delta.elt(2).isPanelMain, 'Not false isPanelMain');
      }
    )
  );

  paneltests.add(
    new Test(
      'Copy',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();
        diagram.nodeTemplate = $(
          go.Node,
          'Horizontal',
          { background: 'rgba(0,255,0,.3)', desiredSize: new go.Size(150, 200) },
          $(go.Shape, 'Rectangle', { height: 50, width: 50, fill: 'blue' })
        );
        diagram.model = new go.GraphLinksModel(
          [{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }],
          []
        );
      },
      function (test: Test & any): void {
        const diagram = test.diagram;
        let p1 = diagram.findNodeForKey(1);
        let p2 = diagram.findNodeForKey(2);
        const panel = $(
          go.Panel,
          'Vertical',
          { background: 'rgba(255,0,0,.5)' },
          $(go.Shape, 'Rectangle', { height: 50, width: 50, fill: 'rgba(255,0,255,.3)' }),
          $(go.Shape, 'Rectangle', { height: 50, width: 50, fill: 'rgba(0,255,255,.3)' })
        );
        p1.add(panel);
        try {
          // try to take the same panel object from panel 1
          p2.add(p1.elt(1));
        } catch (e) {
          test.assert(e, 'Did not throw an error when tried adding a panel in another panel');
        }
        let error;
        try {
          // try to take the same panel variable used for panel 1
          p2.add(panel);
        } catch (e) {
          error = e;
        }
        test.assert(error, 'Did not throw and error when tried adding a panel in another panel');
        p1 = diagram.findNodeForKey(3);
        p2 = diagram.findNodeForKey(4);
        p1.add(
          $(
            go.Panel,
            'Vertical',
            { background: 'rgba(255,0,0,.5)' },
            $(go.Shape, 'Rectangle', { height: 50, width: 50, fill: 'rgba(255,0,255,.3)' }),
            $(go.Shape, 'Rectangle', { height: 50, width: 50, fill: 'rgba(0,255,255,.3)' })
          )
        );
        p2.add(p1.elt(1).copy());
        p2.elt(1).elt(1).height = 100;
        p2.elt(1).elt(0).width = 100;
      },
      function (test: Test & any): void {
        function walktree(walkpanel: go.GraphObject, walkarr: Array<string>): void {
          walkarr.push(walkpanel.actualBounds.toString());
          if (walkpanel instanceof go.Panel) {
            walkpanel.elements.each(function (e: go.GraphObject): void {
              walktree(e, walkarr);
            });
          }
        }

        const diagram = test.diagram;
        const expected = [
          'Rect(0,0,150,200)',
          'Rect(0,74.5,51,51)',
          'Rect(51,49,51,102)',
          'Rect(0,0,51,51)',
          'Rect(0,51,51,51)',
          'Rect(170,0,150,200)',
          'Rect(0,74.5,51,51)',
          'Rect(0,220,150,200)',
          'Rect(0,74.5,51,51)',
          'Rect(51,49,51,102)',
          'Rect(0,0,51,51)',
          'Rect(0,51,51,51)',
          'Rect(170,220,150,200)',
          'Rect(0,74.5,51,51)',
          'Rect(51,24,101,152)',
          'Rect(0,0,101,51)',
          'Rect(25,51,51,101)',
        ];
        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Node): void {
          walktree(n, arr);
        });
        for (let i = 0; i < arr.length; i++) {
          test.assert(arr[i] === expected[i]);
        }
        const alpha = diagram.findNodeForKey(1);
        test.assert(alpha.elements.count === 2, 'Not the correct amount of elements');
        test.assert(alpha.elt(1).elements.count === 2, 'Not the correct amount of elements');
        const beta = diagram.findNodeForKey(2);
        test.assert(beta.elements.count === 1, 'Not the correct amount of elements');
        const delta = diagram.findNodeForKey(3);
        test.assert(delta.elements.count === 2, 'Not the correct amount of elements');
        test.assert(delta.elt(1).elements.count === 2, 'Not the correct amount of elements');
        const gamma = diagram.findNodeForKey(4);
        test.assert(gamma.elements.count === 2, 'Not the correct amount of elemeents');
        test.assert(gamma.elt(1).elements.count === 2, 'Not the correct amount of elements');
        test.assert(
          !delta.elt(1).elt(0).measuredBounds.equals(gamma.elt(1).elt(0).measuredBounds),
          "Bounds aren't different"
        );
        test.assert(
          !delta.elt(1).elt(1).measuredBounds.equals(gamma.elt(1).elt(1).measuredBounds),
          "Bounds aren't different"
        );
      }
    )
  );

  paneltests.add(
    new Test(
      'Shapes',
      null,
      function (test: Test & any): void {
        const diagram = test.diagram;
        diagram.reset();

        const horizontal = $(
          go.Node,
          'Horizontal',
          {
            position: new go.Point(0, 0),
          },
          $(go.Shape, 'TriangleRight', {
            strokeWidth: 0,
            width: 50,
            height: 20,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Chevron', {
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Hexagon', {
            strokeWidth: 0,
            width: 50,
            height: 70,
            fill: 'rgba(0,0,255, .3)',
          })
        );

        const vertical = $(
          go.Node,
          'Vertical',
          {
            position: new go.Point(200, 0),
          },
          $(go.Shape, 'Ellipse', {
            strokeWidth: 0,
            width: 50,
            height: 20,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Circle', {
            strokeWidth: 0,
            width: 50,
            height: 30,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Square', {
            strokeWidth: 0,
            width: 100,
            height: 50,
            fill: 'rgba(0,0,255, .3)',
          }),
          $(go.Shape, 'RoundedRectangle', {
            strokeWidth: 0,
            width: 50,
            height: 70,
            fill: 'rgba(255,255,0, .3)',
          })
        );

        const table = $(
          go.Node,
          'Table',
          {
            position: new go.Point(0, 200),
          },
          $(go.Shape, 'Pentagon', {
            row: 0,
            column: 0,
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255,0,0, .3)',
          }),
          $(go.Shape, 'Hexagon', {
            row: 0,
            column: 1,
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,255,0, .3)',
          }),
          $(go.Shape, 'Heptagon', {
            row: 1,
            column: 0,
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(0,0,255, .3)',
          }),
          $(go.Shape, 'Octagon', {
            row: 1,
            column: 1,
            strokeWidth: 0,
            width: 50,
            height: 50,
            fill: 'rgba(255,0,255, .3)',
          })
        );

        const auto = $(
          go.Node,
          'Auto',
          {
            position: new go.Point(200, 200),
          },
          $(go.Shape, 'Line1', {
            strokeWidth: 10,
            width: 100,
            height: 100,
            stroke: 'rgba(255,0,0, .7)',
          }),
          $(go.Shape, 'Line2', {
            strokeWidth: 10,
            width: 50,
            height: 50,
            stroke: 'rgba(0,255,0, .7)',
          }),
          $(go.Shape, 'LineH', {
            strokeWidth: 10,
            width: 80,
            height: 70,
            stroke: 'rgba(0,0,255, .7)',
          }),
          $(go.Shape, 'LineV', {
            strokeWidth: 10,
            width: 50,
            height: 70,
            stroke: 'rgba(0,255,255, .7)',
          })
        );

        diagram.add(horizontal);
        diagram.add(vertical);
        diagram.add(table);
        diagram.add(auto);
      },
      undefined,
      function (test: Test & any): void {
        function walktree(walkpanel: go.GraphObject, walkarr: Array<string>): void {
          walkarr.push(walkpanel.actualBounds.toString());
          if (walkpanel instanceof go.Panel) {
            walkpanel.elements.each(function (e: go.GraphObject): void {
              walktree(e, walkarr);
            });
          }
        }

        const diagram = test.diagram;
        const expected = [
          'Rect(0,0,150,70)',
          'Rect(0,25,50,20)',
          'Rect(50,10,50,50)',
          'Rect(100,0,50,70)',
          'Rect(200,0,100,170)',
          'Rect(25,0,50,20)',
          'Rect(25,20,50,30)',
          'Rect(0,50,100,50)',
          'Rect(25,100,50,70)',
          'Rect(0,200,100,100)',
          'Rect(0,0,50,50)',
          'Rect(50,0,50,50)',
          'Rect(0,50,50,50)',
          'Rect(50,50,50,50)',
          'Rect(200,200,110,110)',
          'Rect(0,0,110,110)',
          'Rect(25,25,60,60)',
          'Rect(10,15,90,80)',
          'Rect(25,15,60,80)',
        ];
        const arr: Array<string> = [];
        diagram.nodes.each(function (n: go.Node): void {
          walktree(n, arr);
        });
        for (let i = 0; i < arr.length; i++) {
          test.assert(expected[i] === arr[i]);
        }
        // hit tests
        test.assert(!diagram.findObjectAt(new go.Point(60, 35)), 'Found an object at the location');
        test.assert(
          diagram.findObjectAt(new go.Point(110, 35)),
          'Did not find an object at the location'
        );
        test.assert(
          !diagram.findObjectAt(new go.Point(270, 75)),
          'Found an object at the location'
        );
        test.assert(
          diagram.findObjectAt(new go.Point(250, 10)),
          'Did not find an object at the location'
        );
        test.assert(
          !diagram.findObjectAt(new go.Point(50, 250)),
          'Found an object at the location'
        );
        test.assert(
          diagram.findObjectAt(new go.Point(250, 250)),
          'Did not find an object at the location'
        );
        test.assert(
          !diagram.findObjectAt(new go.Point(250, 210)),
          'Found an object at the location'
        );
      }
    )
  ); // end test
})(); // end test system

/*
  paneltests.add(new Test('Spot Panel offsetX/Y', null,
    function (test: Test & any): void {
      let diagram = test.diagram;
      var d = diagram;
      diagram.reset();


    }, // end setup
    undefined,
    function (test: Test & any): void {
      let diagram = test.diagram;

    }
  )); // end test
*/

// spotPanels.add(new Test('Misc', null,
// 	function (test: Test & any): void {
// 		let diagram = test.diagram;
// 		diagram.nodeTemplate =
// 		$(go.Node, 'Spot');
// 		diagram.model = new go.GraphLinksModel(
//     [
//       { key: 1 }
//     ], [ ]);
// 	},
// 	undefined,
// 	function (test: Test & any): void {

// 	})
// );
