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

  function checkProp(test, obj, prop, val, msg) {
    test.assert(obj[prop] === val, msg ? msg : `Wrong ${prop}, expected '${val}', got '${obj[prop]}'`);
  }

  function checkPropEq(test, obj, prop, val, msg) {
    test.assert(obj[prop].equals(val), msg ? msg : `Wrong ${prop}, expected '${val}', got '${obj[prop]}'`);
  }

  function DefaultSetup(test) {
    var m = new go.GraphLinksModel([
      { key: 'Group', isGroup: true },
      { key: 'Alpha', group: 'Group' },
      { key: 'Beta', group: 'Group' },
      { key: 'Gamma' },
      { key: 'Delta' },
      { key: 'Comment', category: 'Comment' },
      { key: 'LinkLabel', category: 'LinkLabel' }
    ], [
      { key: -1, from: 'Alpha', to: 'Beta' },
      { key: -2, from: 'Alpha', to: 'Gamma' },
      { key: -3, from: 'Gamma', to: 'Delta' },
      { key: -4, from: 'Delta', to: 'Alpha' },
      { key: -5, from: 'Comment', to: 'Delta', category: 'Comment' },
    ]);
    m.linkKeyProperty = 'key';
    test.diagram.model = m;
  }

  function DefaultCheck(theme) {
    return (test) => {
      var g = test.diagram.findNodeForKey('Group');
      var a = test.diagram.findNodeForKey('Alpha');
      var c = test.diagram.findNodeForKey('Comment');
      var ll = test.diagram.findNodeForKey('LinkLabel');
      var l = test.diagram.findLinkForKey(-1);
      var cl = test.diagram.findLinkForKey(-5);

      var gtext = g.elt(0);
      var gshape = g.elt(1).elt(0);
      var gplc = g.elt(1).elt(1);
      checkProp(test, gtext, 'stroke', theme.colors.text, `Wrong group text stroke, expected '${theme.colors.text}', got '${gtext.stroke}'`);
      checkProp(test, gtext, 'font', theme.fonts.bold, `Wrong group font, expected '${theme.fonts.bold}', got '${gtext.font}'`);
      checkProp(test, gshape, 'fill', theme.colors.group, `Wrong group shape fill, expected '${theme.colors.group}', got '${gshape.fill}'`);
      checkProp(test, gshape, 'stroke', theme.colors.outline, `Wrong group shape stroke, expected '${theme.colors.outline}', got '${gshape.stroke}'`);
      checkProp(test, gshape, 'strokeWidth', theme.numbers.group, `Wrong group shape strokeWidth, expected ${theme.numbers.group}, got ${gshape.strokeWidth}`);
      checkPropEq(test, gplc, 'padding', theme.margins.group, `Wrong group placeholder padding, expected ${theme.margins.group}, got ${gplc.padding}`);

      var atext = a.elt(0);
      checkProp(test, atext, 'stroke', theme.colors.text, `Wrong node stroke, expected '${theme.colors.text}', got '${atext.stroke}'`);
      checkProp(test, atext, 'font', theme.fonts.normal, `Wrong node font, expected '${theme.fonts.normal}', got '${atext.font}'`);

      var ctext = c.elt(0);
      checkProp(test, ctext, 'stroke', theme.colors.comment, `Wrong comment stroke, expected '${theme.colors.comment}', got '${ctext.stroke}'`);
      checkProp(test, ctext, 'font', theme.fonts.normal, `Wrong comment font, expected '${theme.fonts.normal}', got '${ctext.font}'`);

      var llshape = ll.elt(0);
      checkProp(test, llshape, 'fill', theme.colors.link, `Wrong link label fill, expected '${theme.colors.link}', got '${llshape.fill}'`);

      var lshape = l.elt(0);
      var larrow = l.elt(1);
      checkProp(test, lshape, 'stroke', theme.colors.link, `Wrong link stroke, expected '${theme.colors.link}', got '${lshape.stroke}'`);
      checkProp(test, larrow, 'toArrow', theme.arrowheads.toArrow, `Wrong link arrowhead, expected '${theme.arrowheads.toArrow}', got ${larrow.toArrow}`);
      checkProp(test, larrow, 'fill', theme.colors.link, `Wrong link arrowhead fill, expected '${theme.colors.link}', got '${larrow.fill}'`);

      var clshape = cl.elt(0);
      checkProp(test, clshape, 'stroke', theme.colors.comment, `Wrong comment link stroke, expected '${theme.colors.comment}', got '${clshape.stroke}'`);
    };
  }



  // full theme (minus tools/handles)
  var rainbowTheme = {
    colors: {
      text: 'red',
      comment: 'orange',
      link: 'yellow',
      group: 'green',
      outline: 'blue',
      selection: 'indigo'
    },
    fonts: {
      normal: '10pt sans-serif',
      bold: 'bold 12pt sans-serif'
    },
    numbers: {
      group: 1,
      selection: 3
    },
    margins: {
      group: new go.Margin(5)
    },
    arrowheads: {
      toArrow: 'Standard'
    }
  }

  var root = new TestCollection('Theme');
  TestRoot.add(root);

  var defaults = new TestCollection('Default templates');
  root.add(defaults);

  defaults.add(new Test('Light', null,
    DefaultSetup,
    function (test) {
      var tm = test.diagram.themeManager;
      tm.changesDivBackground = true;
      tm.currentTheme = 'light';
    },
    DefaultCheck(go.Themes.Light)
  )); // end test

  defaults.add(new Test('Dark', null,
    DefaultSetup,
    function (test) {
      var tm = test.diagram.themeManager;
      tm.changesDivBackground = true;
      tm.currentTheme = 'dark';
    },
    DefaultCheck(go.Themes.Dark)
  )); // end test

  defaults.add(new Test('Rainbow', null,
    DefaultSetup,
    function (test) {
      var tm = test.diagram.themeManager;
      tm.changesDivBackground = true;
      tm.set('rainbow', rainbowTheme);
      tm.currentTheme = 'rainbow';
    },
    DefaultCheck(rainbowTheme)
  )); // end test

  var paths = new TestCollection('Paths');
  root.add(paths);

  paths.add(new Test('From target properties', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      // there are no default entries for points, sizes, spots
      tm.set('light', {
        numbers: { wh: 100, opacity: .5 },
        points: { seven: new go.Point(7, 7) },
        sizes: { seven: new go.Size(7, 7) },
        spots: { seven: new go.Spot(0, 0, 7, 7) }
      });
      tm.currentTheme = 'light';

      diagram.nodeTemplate =
        new go.Node('Auto')
          .theme('background', 'comment')
          .theme('defaultColumnSeparatorStroke', 'comment')
          .theme('defaultRowSeparatorStroke', 'comment')
          .theme('shadowColor', 'comment')
          .theme('angle', 'selection')
          .theme('fromEndSegmentLength', 'selection')
          .theme('fromShortLength', 'selection')
          .theme('opacity', 'opacity')
          .theme('scale', 'selection')
          .theme('toEndSegmentLength', 'selection')
          .theme('toShortLength', 'selection')
          .theme('defaultColumnSeparatorStrokeWidth', 'selection')
          .theme('defaultRowSeparatorStrokeWidth', 'selection')
          .theme('shadowBlur', 'selection')
          .theme('position', 'seven')
          .theme('shadowOffset', 'seven')
          .theme('desiredSize', 'seven')
          .theme('maxSize', 'seven')
          .theme('minSize', 'seven')
          .theme('margin', 'group')
          .theme('defaultSeparatorPadding', 'group')
          .theme('padding', 'group')
          .theme('alignment', 'seven')
          .theme('alignmentFocus', 'seven')
          .theme('fromSpot', 'seven')
          .theme('toSpot', 'seven')
          .theme('defaultAlignment', 'seven')
          .add(new go.Shape('RoundedRectangle', { strokeWidth: 0 })
            .theme('fill', 'comment')
            .theme('parameter1', 'selection')
            .theme('parameter2', 'selection')
            .theme('strokeWidth', 'selection')
            .theme('strokeDashOffset', 'selection')
            .theme('spot1', 'seven')
            .theme('spot2', 'seven')
          )
          .add(new go.Panel('Horizontal')
            .add(new go.Picture('images/50x40.png')
              .theme('height', 'wh')
              .theme('width', 'wh')
              .theme('imageAlignment', 'seven')
            )
            .add(new go.TextBlock()
              .bind('text', 'key')
              .theme('font', 'normal')
              .theme('maxLines', 'selection')
              .theme('spacingAbove', 'selection')
              .theme('spacingBelow', 'selection')
              .theme('verticalAlignment', 'seven')
            )
          );

      diagram.linkTemplate =
        new go.Link()
          .theme('corner', 'selection')
          .theme('curviness', 'selection')
          .theme('smoothness', 'selection')
          .add(new go.Shape())
          .add(new go.Shape()
            .theme('fromArrow', 'toArrow')
            .theme('toArrow', 'toArrow')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      checkProp(test, a, 'background', theme.colors.comment);
      checkProp(test, a, 'defaultColumnSeparatorStroke', theme.colors.comment);
      checkProp(test, a, 'defaultRowSeparatorStroke', theme.colors.comment);
      checkProp(test, a, 'shadowColor', theme.colors.comment);
      checkProp(test, a, 'angle', theme.numbers.selection);
      checkProp(test, a, 'fromEndSegmentLength', theme.numbers.selection);
      checkProp(test, a, 'fromShortLength', theme.numbers.selection);
      checkProp(test, a, 'opacity', theme.numbers.opacity);
      checkProp(test, a, 'scale', theme.numbers.selection);
      checkProp(test, a, 'toEndSegmentLength', theme.numbers.selection);
      checkProp(test, a, 'toShortLength', theme.numbers.selection);
      checkProp(test, a, 'defaultColumnSeparatorStrokeWidth', theme.numbers.selection);
      checkProp(test, a, 'defaultRowSeparatorStrokeWidth', theme.numbers.selection);
      checkProp(test, a, 'shadowBlur', theme.numbers.selection);
      checkPropEq(test, a, 'position', theme.points.seven);
      checkPropEq(test, a, 'shadowOffset', theme.points.seven);
      checkPropEq(test, a, 'desiredSize', theme.sizes.seven);
      checkPropEq(test, a, 'maxSize', theme.sizes.seven);
      checkPropEq(test, a, 'minSize', theme.sizes.seven);
      checkPropEq(test, a, 'margin', theme.margins.group);
      checkPropEq(test, a, 'defaultSeparatorPadding', theme.margins.group);
      checkPropEq(test, a, 'padding', theme.margins.group);
      checkPropEq(test, a, 'alignment', theme.spots.seven);
      checkPropEq(test, a, 'alignmentFocus', theme.spots.seven);
      checkPropEq(test, a, 'fromSpot', theme.spots.seven);
      checkPropEq(test, a, 'toSpot', theme.spots.seven);
      checkPropEq(test, a, 'defaultAlignment', theme.spots.seven);
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.comment);
      checkProp(test, ashape, 'parameter1', theme.numbers.selection);
      checkProp(test, ashape, 'parameter2', theme.numbers.selection);
      checkProp(test, ashape, 'strokeWidth', theme.numbers.selection);
      checkProp(test, ashape, 'strokeDashOffset', theme.numbers.selection);
      checkPropEq(test, ashape, 'spot1', theme.spots.seven);
      checkPropEq(test, ashape, 'spot2', theme.spots.seven);
      var apic = a.elt(1).elt(0);
      checkProp(test, apic, 'height', theme.numbers.wh);
      checkProp(test, apic, 'width', theme.numbers.wh);
      checkPropEq(test, apic, 'imageAlignment', theme.spots.seven);
      var atext = a.elt(1).elt(1);
      checkProp(test, atext, 'font', theme.fonts.normal);
      checkProp(test, atext, 'maxLines', theme.numbers.selection);
      checkProp(test, atext, 'spacingAbove', theme.numbers.selection);
      checkProp(test, atext, 'spacingBelow', theme.numbers.selection);
      checkPropEq(test, atext, 'verticalAlignment', theme.spots.seven);

      var l = test.diagram.findLinkForKey(-1);
      checkProp(test, l, 'corner', theme.numbers.selection);
      checkProp(test, l, 'curviness', theme.numbers.selection);
      checkProp(test, l, 'smoothness', theme.numbers.selection);
      var larrow = l.elt(1);
      checkProp(test, larrow, 'fromArrow', theme.arrowheads.toArrow);
      checkProp(test, larrow, 'toArrow', theme.arrowheads.toArrow);
    }
  ));

  paths.add(new Test('dot syntax', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('light', {
        colors: { red: [ '#fee2e2', '#ef4444', '#7f1d1d'] },
        arrs: { dash: [5, 3] }
      });
      tm.currentTheme = 'light';

      diagram.nodeTemplate =
        new go.Node('Auto')
          .add(new go.Shape('RoundedRectangle', { strokeWidth: 3 })
            .theme('fill', 'colors.red.0')
            .theme('stroke', 'colors.red.1')
            .theme('strokeDashArray', 'arrs.dash')
          )
          .add(new go.TextBlock({ margin: 8 })
            .bind('text', 'key')
            .theme('font', 'fonts.normal')
            .theme('stroke', 'colors.red.2')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.red[0]);
      checkProp(test, ashape, 'stroke', theme.colors.red[1]);
      checkProp(test, ashape, 'strokeDashArray', theme.arrs.dash);
      var atext = a.elt(1);
      checkProp(test, atext, 'font', theme.fonts.normal);
      checkProp(test, atext, 'stroke', theme.colors.red[2]);
    }
  ));

  paths.add(new Test('sourceName', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('light', {
        colors: { red: [ '#fee2e2', '#ef4444', '#7f1d1d'] },
        arrs: { dash: [5, 3] }
      });
      tm.currentTheme = 'light';

      diagram.nodeTemplate =
        new go.Node('Auto')
          .add(new go.Shape('RoundedRectangle', { strokeWidth: 3 })
            .theme('fill', 'red.0', 'colors')
            .theme('stroke', 'red.1', 'colors')
            .theme('strokeDashArray', 'dash', 'arrs')
          )
          .add(new go.TextBlock({ margin: 8 })
            .bind('text', 'key')
            .theme('font', 'normal', 'fonts')
            .theme('stroke', 'red.2', 'colors')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.red[0]);
      checkProp(test, ashape, 'stroke', theme.colors.red[1]);
      checkProp(test, ashape, 'strokeDashArray', theme.arrs.dash);
      var atext = a.elt(1);
      checkProp(test, atext, 'font', theme.fonts.normal);
      checkProp(test, atext, 'stroke', theme.colors.red[2]);
    }
  ));

  paths.add(new Test('targetPropertyMap', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        myColors: { primary: 'yellow' },
        targetPropertyMap: new go.Map([{ key: 'stroke', value: 'myColors' }])
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
          .add(new go.Shape('RoundedRectangle', { fill: 'orange', strokeWidth: 3 })
            .theme('stroke', 'primary')  // comes from myColors
          )
          .add(new go.TextBlock({ margin: 8 })
            .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'stroke', theme.myColors.primary);
    }
  ));

  var binding = new TestCollection('Binding');
  root.add(binding);

  binding.add(new Test('themeData', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          primary: 'lightblue',
          secondary: 'pink'
        }
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeData('fill', 'color')  // from data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha', color: 'primary' },
        { key: 'Beta', color: 'secondary' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.primary);
    }
  ));

  binding.add(new Test('themeData - sourceName', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        genders: {
          binary: {
            M: 'lightblue',
            F: 'pink'
          }
        },
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeData('fill', 'sex', 'genders.binary')  // from data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha', sex: 'M' },
        { key: 'Beta', sex: 'F' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.genders.binary.M);
    }
  ));

  binding.add(new Test('themeData - converter', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          male: 'lightblue',
          female: 'pink'
        }
      });
      tm.currentTheme = 'custom';

      function convertGenderToThemeProp(g) {
        if (g === 'M') return 'male';
        if (g === 'F') return 'female';
        return 'background';
      }

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeData('fill', 'sex', null, convertGenderToThemeProp)  // from data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha', sex: 'M' },
        { key: 'Beta', sex: 'F' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.male);
    }
  ));

  binding.add(new Test('themeObject', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          Alpha: 'lightblue',
          Beta: 'pink'
        }
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeObject('fill', 'key')  // from object
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.Alpha);
    }
  ));

  binding.add(new Test('themeObject - sourceName', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        genders: {
          binary: {
            Alpha: 'lightblue',
            Beta: 'pink'
          }
        },
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeObject('fill', 'key', 'genders.binary')  // from object
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.genders.binary.Alpha);
    }
  ));

  binding.add(new Test('themeObject - converter', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          male: 'lightblue',
          female: 'pink'
        }
      });
      tm.currentTheme = 'custom';

      function convertKeyToThemeProp(k) {
        if (k === 'Alpha') return 'male';
        if (k === 'Beta') return 'female';
        return 'background';
      }

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeData('fill', 'key', null, convertKeyToThemeProp)  // from data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' },
        { key: 'Beta' }
      ], [
        { key: -1, from: 'Alpha', to: 'Beta' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.male);
    }
  ));

  binding.add(new Test('themeModel', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: { primary: 'lightblue' }
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeModel('fill', 'color')  // from model data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
      diagram.model.modelData = { color: 'primary' };
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.primary);
    }
  ));

  binding.add(new Test('themeModel - sourceName', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        other: {
          primary: 'lightblue'
        }
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeModel('fill', 'color', 'other')  // from model data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
      diagram.model.modelData = { color: 'primary' };
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.other.primary);
    }
  ));

  binding.add(new Test('themeModel - converter', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          primary: 'lightblue'
        }
      });
      tm.currentTheme = 'custom';

      function convertColorToThemeProp(c) {
        if (c === 'convert') return 'primary';
        return 'background';
      }

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .themeModel('fill', 'color', null, convertColorToThemeProp)  // from model data
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
      diagram.model.modelData = { color: 'convert' };
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.primary);

      // reset background color after last test
      test.diagram.div.style.backgroundColor = 'transparent';
    }
  ));

  binding.add(new Test('themeConverter', null,
    function (test) {
      var diagram = test.diagram;
      var tm = diagram.themeManager;

      tm.set('custom', {
        colors: {
          primary: 'lightblue',
          secondary: 'pink'
        }
      });
      tm.currentTheme = 'custom';

      diagram.nodeTemplate =
        new go.Node('Auto')
            .add(new go.Shape('RoundedRectangle', { strokeWidth: 2 })
              .theme('fill', 'primary')
              .theme('stroke', 'primary', null, null, c => go.Brush.darken(c))
            )
            .add(new go.TextBlock({ margin: 8 })
              .bind('text', 'key')
          );

      var m = new go.GraphLinksModel([
        { key: 'Alpha' }
      ]);
      m.linkKeyProperty = 'key';
      diagram.model = m;
    },
    null,
    function (test) {
      var tm = test.diagram.themeManager;
      var theme = tm.findTheme(tm.currentTheme);

      var a = test.diagram.findNodeForKey('Alpha');
      var ashape = a.elt(0);
      checkProp(test, ashape, 'fill', theme.colors.primary);
      checkProp(test, ashape, 'stroke', go.Brush.darken(theme.colors.primary));
    }
  ));

})(); // End test system
