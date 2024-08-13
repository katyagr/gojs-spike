/*
*  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
*
*  Restricted Rights: duplication, or disclosure by the U.S.
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

  var staticTests = new TestCollection('Basic');
  TestRoot.add(staticTests);

  staticTests.add(new Test('Existence of static props', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
    }, // END SETUP
    null,
    function (test) {

        test.assert(go.Brush.Solid !== undefined);
        test.assert(go.GraphObject.None !== undefined);
        test.assert(go.GraphObject.Default !== undefined);
        test.assert(go.GraphObject.Vertical !== undefined);
        test.assert(go.GraphObject.Horizontal !== undefined);
        test.assert(go.GraphObject.Fill !== undefined);
        test.assert(go.GraphObject.Uniform !== undefined);
        test.assert(go.GraphObject.make !== undefined);


        test.assert(go.Margin.parse !== undefined);

        test.assert(go.Picture.clearCache !== undefined);
        test.assert(go.Rect.parse !== undefined)
        test.assert(go.Rect.stringify !== undefined)
        test.assert(go.Rect.contains !== undefined)
        test.assert(go.Point.distanceLineSegmentSquared !== undefined);
        test.assert(go.Point.distanceSquared !== undefined);
        test.assert(go.Point.direction !== undefined);
        test.assert(go.Rect.intersects !== undefined)

      /* we dont expose these
        test.assert(go.Margin.ZeroMargin !== undefined);
        test.assert(go.Point.Origin !== undefined);
        test.assert(go.Point.NoPoint !== undefined);
        test.assert(go.Rect.ZeroRect !== undefined)
        test.assert(go.Rect.NoRect !== undefined)
        test.assert(go.Size.ZeroSize !== undefined)
        test.assert(go.Size.OneSize !== undefined)
        test.assert(go.Size.SixSize !== undefined)
        test.assert(go.Size.EightSize !== undefined)
        test.assert(go.Size.TenSize !== undefined)
        test.assert(go.Size.InfiniteSize !== undefined)
        test.assert(go.Size.NoSize !== undefined)
      */

        test.assert(go.Size.parse !== undefined)
        test.assert(go.Size.stringify !== undefined)
        test.assert(go.Spot.NotLeftSide !== undefined)
        test.assert(go.Spot.NotRightSide !== undefined)
        test.assert(go.Spot.NotBottomSide !== undefined)
        test.assert(go.Spot.AllSides !== undefined)
        test.assert(go.Spot.parse !== undefined)
        test.assert(go.Spot.stringify !== undefined)
        test.assert(go.TextBlock.getEllipsis !== undefined);
        test.assert(go.TextBlock.setEllipsis !== undefined);
        test.assert(go.TextBlock.isValidFont !== undefined);
        test.assert(go.Model.fromJSON !== undefined);
        test.assert(go.Model.fromJson === go.Model.fromJSON);

        test.assert(typeof go.Diagram.prototype.makeSVG === "function")
        test.assert(typeof go.Diagram.prototype.makeSvg === "function")
        test.assert(typeof go.Model.prototype.applyIncrementalJson === "function")
        test.assert(typeof go.Model.prototype.applyIncrementalJSON === "function")


    }


  )); // end test

  staticTests.add(new Test('Proper classNames', null,
    function (test) {
      var diagram = test.diagram;
      diagram.reset();
    }, // END SETUP
    null,
    function (test) {
      function assertName(cls, name) {
        if (name !== 'Set' && name !== 'Map') {  // but exported as Set and Map
          test.assert(cls.name === name, 'Wrong classname for ' + name + ', got ' + cls.name);
        }
      }

      for (var cls in go) {
        if (go.hasOwnProperty(cls)) {
          switch (cls) {
            case 'Group': assertName(go[cls], 'Group'); break;
            case 'Util': assertName(go[cls], 'Util'); break;
            case 'List': assertName(go[cls], 'List'); break;
            case 'Set': assertName(go[cls], 'Set'); break;
            case 'Map': assertName(go[cls], 'Map'); break;
            case 'Point': assertName(go[cls], 'Point'); break;
            case 'Size': assertName(go[cls], 'Size'); break;
            case 'Rect': assertName(go[cls], 'Rect'); break;
            case 'Margin': assertName(go[cls], 'Margin'); break;
            case 'Spot': assertName(go[cls], 'Spot'); break;
            case 'Geometry': assertName(go[cls], 'Geometry'); break;
            case 'PathFigure': assertName(go[cls], 'PathFigure'); break;
            case 'PathSegment': assertName(go[cls], 'PathSegment'); break;
            case 'InputEvent': assertName(go[cls], 'InputEvent'); break;
            case 'DiagramEvent': assertName(go[cls], 'DiagramEvent'); break;
            case 'ChangedEvent': assertName(go[cls], 'ChangedEvent'); break;
            case 'Model': assertName(go[cls], 'Model'); break;
            case 'GraphLinksModel': assertName(go[cls], 'GraphLinksModel'); break;
            case 'TreeModel': assertName(go[cls], 'TreeModel'); break;
            case 'GraphModel': assertName(go[cls], 'GraphModel'); break;
            case 'Binding': assertName(go[cls], 'Binding'); break;
            case 'ThemeBinding': assertName(go[cls], 'ThemeBinding'); break;
            case 'Transaction': assertName(go[cls], 'Transaction'); break;
            case 'UndoManager': assertName(go[cls], 'UndoManager'); break;
            case 'CommandHandler': assertName(go[cls], 'CommandHandler'); break;
            case 'Tool': assertName(go[cls], 'Tool'); break;
            case 'DraggingTool': assertName(go[cls], 'DraggingTool'); break;
            case 'DraggingInfo': assertName(go[cls], 'DraggingInfo'); break;
            case 'DraggingOptions': assertName(go[cls], 'DraggingOptions'); break;
            case 'LinkingBaseTool': assertName(go[cls], 'LinkingBaseTool'); break;
            case 'LinkingTool': assertName(go[cls], 'LinkingTool'); break;
            case 'RelinkingTool': assertName(go[cls], 'RelinkingTool'); break;
            case 'LinkReshapingTool': assertName(go[cls], 'LinkReshapingTool'); break;
            case 'ResizingTool': assertName(go[cls], 'ResizingTool'); break;
            case 'RotatingTool': assertName(go[cls], 'RotatingTool'); break;
            case 'ClickSelectingTool': assertName(go[cls], 'ClickSelectingTool'); break;
            case 'ActionTool': assertName(go[cls], 'ActionTool'); break;
            case 'ClickCreatingTool': assertName(go[cls], 'ClickCreatingTool'); break;
            case 'HTMLInfo': assertName(go[cls], 'HTMLInfo'); break;
            case 'ContextMenuTool': assertName(go[cls], 'ContextMenuTool'); break;
            case 'DragSelectingTool': assertName(go[cls], 'DragSelectingTool'); break;
            case 'PanningTool': assertName(go[cls], 'PanningTool'); break;
            case 'TextEditingTool': assertName(go[cls], 'TextEditingTool'); break;
            case 'ToolManager': assertName(go[cls], 'ToolManager'); break;
            case 'Animation': assertName(go[cls], 'Animation'); break;
            case 'AnimationManager': assertName(go[cls], 'AnimationManager'); break;
            case 'AnimationTrigger': assertName(go[cls], 'AnimationTrigger'); break;
            case 'Layer': assertName(go[cls], 'Layer'); break;
            case 'Diagram': assertName(go[cls], 'Diagram'); break;
            case 'Palette': assertName(go[cls], 'Palette'); break;
            case 'Overview': assertName(go[cls], 'Overview'); break;
            case 'Brush': assertName(go[cls], 'Brush'); break;
            case 'GraphObject': assertName(go[cls], 'GraphObject'); break;
            case 'Panel': assertName(go[cls], 'Panel'); break;
            case 'RowColumnDefinition': assertName(go[cls], 'RowColumnDefinition'); break;
            case 'Shape': assertName(go[cls], 'Shape'); break;
            case 'TextBlock': assertName(go[cls], 'TextBlock'); break;
            case 'TextBlockMetrics': assertName(go[cls], 'TextBlockMetrics'); break;
            case 'Picture': assertName(go[cls], 'Picture'); break;
            case 'Part': assertName(go[cls], 'Part'); break;
            case 'Adornment': assertName(go[cls], 'Adornment'); break;
            case 'Node': assertName(go[cls], 'Node'); break;
            case 'Link': assertName(go[cls], 'Link'); break;
            case 'Placeholder': assertName(go[cls], 'Placeholder'); break;
            case 'Layout': assertName(go[cls], 'Layout'); break;
            case 'LayoutNetwork': assertName(go[cls], 'LayoutNetwork'); break;
            case 'LayoutVertex': assertName(go[cls], 'LayoutVertex'); break;
            case 'LayoutEdge': assertName(go[cls], 'LayoutEdge'); break;
            case 'GridLayout': assertName(go[cls], 'GridLayout'); break;
            case 'PanelLayout': assertName(go[cls], 'PanelLayout'); break;
            case 'CircularLayout': assertName(go[cls], 'CircularLayout'); break;
            case 'CircularNetwork': assertName(go[cls], 'CircularNetwork'); break;
            case 'CircularVertex': assertName(go[cls], 'CircularVertex'); break;
            case 'CircularEdge': assertName(go[cls], 'CircularEdge'); break;
            case 'ForceDirectedLayout': assertName(go[cls], 'ForceDirectedLayout'); break;
            case 'ForceDirectedNetwork': assertName(go[cls], 'ForceDirectedNetwork'); break;
            case 'ForceDirectedVertex': assertName(go[cls], 'ForceDirectedVertex'); break;
            case 'ForceDirectedEdge': assertName(go[cls], 'ForceDirectedEdge'); break;
            case 'LayeredDigraphLayout': assertName(go[cls], 'LayeredDigraphLayout'); break;
            case 'LayeredDigraphNetwork': assertName(go[cls], 'LayeredDigraphNetwork'); break;
            case 'LayeredDigraphVertex': assertName(go[cls], 'LayeredDigraphVertex'); break;
            case 'LayeredDigraphEdge': assertName(go[cls], 'LayeredDigraphEdge'); break;
            case 'TreeLayout': assertName(go[cls], 'TreeLayout'); break;
            case 'TreeNetwork': assertName(go[cls], 'TreeNetwork'); break;
            case 'TreeVertex': assertName(go[cls], 'TreeVertex'); break;
            case 'TreeEdge': assertName(go[cls], 'TreeEdge'); break;
            case 'AnimationStyle':
            case 'AutoScale':
            case 'CycleMode':
            case 'Flip':
            case 'TextFormat':
            case 'ImageStretch':
            case 'LayoutConditions':
            case 'LinkAdjusting':
            case 'Curve':
            case 'Routing':
            case 'Orientation':
            case 'TextOverflow':
            case 'Panel':
            case 'PortSpreading':
            case 'ScrollMode':
            case 'Sizing':
            case 'TriggerStart':
            case 'Stretch':
            case 'ViewboxStretch':
            case 'Wrap':
            case 'BrushType':
            case 'ColorSpace':
            case 'GeometryStretch':
            case 'GeometryType':
            case 'SegmentType':
            case 'BindingMode':
            case 'ChangeType':
            case 'CircularArrangement':
            case 'CircularDirection':
            case 'CircularNodeDiameterFormula':
            case 'CircularSorting':
            case 'GridAlignment':
            case 'GridArrangement':
            case 'GridSorting':
            case 'LayeredDigraphAggressive':
            case 'LayeredDigraphAlign':
            case 'LayeredDigraphCycleRemove':
            case 'LayeredDigraphInit':
            case 'LayeredDigraphLayering':
            case 'LayeredDigraphPack':
            case 'TreeAlignment':
            case 'TreeArrangement':
            case 'TreeCompaction':
            case 'TreeLayerStyle':
            case 'TreePath':
            case 'TreeSorting':
            case 'TreeStyle':
            case 'GestureMode':
            case 'LinkingDirection':
            case 'ReshapingBehavior':
            case 'TextEditingAccept':
            case 'TextEditingStarting':
            case 'TextEditingState':
            case 'WheelMode':
            case 'ThemeManager':
            case 'Themes':
            case 'Router':
            case 'PositionArray':
            case 'AvoidsNodesRouter':
            case 'CollapsePolicy':
            case 'Debug':
            case 'licenseKey':
            case 'version': break;
            default:   test.assert(false, 'unknown class: ' + cls); break;
          }
        }
      }

      test.assert(
        go.AnimationStyle.Default === 1 &&
        go.AnimationStyle.AnimateLocations === 2 &&
        go.AnimationStyle.None === 3 &&
        Object.keys(go.AnimationStyle).length === 6, 'Incorrect AnimationStyle enum');
      test.assert(
        go.AutoScale.None === 1 &&
        go.AutoScale.Uniform === 2 &&
        go.AutoScale.UniformToFill === 3 &&
        Object.keys(go.AutoScale).length === 6, 'Incorrect AutoScale enum');
      test.assert(
        go.BindingMode.OneWay === 1 &&
        go.BindingMode.TwoWay === 2 &&
        Object.keys(go.BindingMode).length === 4, 'Incorrect BindingMode enum');
      test.assert(
        go.BrushType.Solid === 1 &&
        go.BrushType.Linear === 2 &&
        go.BrushType.Radial === 3 &&
        go.BrushType.Pattern === 4 &&
        Object.keys(go.BrushType).length === 8, 'Incorrect BrushType enum');
      test.assert(
        go.ChangeType.Transaction === 1 &&
        go.ChangeType.Property === 2 &&
        go.ChangeType.Insert === 3 &&
        go.ChangeType.Remove === 4 &&
        Object.keys(go.ChangeType).length === 8, 'Incorrect ChangeType enum');
      test.assert(
        go.CircularArrangement.ConstantSpacing === 0 &&
        go.CircularArrangement.ConstantDistance === 1 &&
        go.CircularArrangement.ConstantAngle === 2 &&
        go.CircularArrangement.Packed === 3 &&
        Object.keys(go.CircularArrangement).length === 8, 'Incorrect CircularArrangement enum');
      test.assert(
        go.CircularDirection.Clockwise === 10 &&
        go.CircularDirection.Counterclockwise === 11 &&
        go.CircularDirection.BidirectionalLeft === 12 &&
        go.CircularDirection.BidirectionalRight === 13 &&
        Object.keys(go.CircularDirection).length === 8, 'Incorrect CircularDirection enum');
      test.assert(
        go.CircularNodeDiameterFormula.Pythagorean === 30 &&
        go.CircularNodeDiameterFormula.Circular === 31 &&
        Object.keys(go.CircularNodeDiameterFormula).length === 4, 'Incorrect CircularNodeDiameterFormula enum');
      test.assert(
        go.CircularSorting.Forwards === 20 &&
        go.CircularSorting.Reverse === 21 &&
        go.CircularSorting.Ascending === 22 &&
        go.CircularSorting.Descending === 23 &&
        go.CircularSorting.Optimized === 24 &&
        Object.keys(go.CircularSorting).length === 10, 'Incorrect CircularSorting enum');
      test.assert(
        go.ColorSpace.Lab === 1 &&
        go.ColorSpace.HSL === 2 &&
        go.ColorSpace.Oklch === 3 &&
        Object.keys(go.ColorSpace).length === 6, 'Incorrect ColorSpace enum');
      test.assert(
        go.CycleMode.All === 1 &&
        go.CycleMode.NotDirected === 2 &&
        go.CycleMode.NotDirectedFast === 3 &&
        go.CycleMode.NotUndirected === 4 &&
        go.CycleMode.DestinationTree === 5 &&
        go.CycleMode.SourceTree === 6 &&
        Object.keys(go.CycleMode).length === 12, 'Incorrect CycleMode enum');
      test.assert(
        go.Flip.None === 0 &&
        go.Flip.Vertical === 1 &&
        go.Flip.Horizontal === 2 &&
        go.Flip.Both === 3 &&
        Object.keys(go.Flip).length === 8, 'Incorrect Flip enum');
      test.assert(
        go.TextFormat.Trim === 0 &&
        go.TextFormat.None === 1 &&
        Object.keys(go.TextFormat).length === 4, 'Incorrect TextFormat enum');
      test.assert(
        go.GeometryStretch.None === 0 &&
        go.GeometryStretch.Default === 1 &&
        go.GeometryStretch.Fill === 2 &&
        go.GeometryStretch.Uniform === 6 &&
        Object.keys(go.GeometryStretch).length === 8, 'Incorrect GeometryStretch enum');
      test.assert(
        go.GeometryType.Line === 1 &&
        go.GeometryType.Rectangle === 2 &&
        go.GeometryType.Ellipse === 3 &&
        go.GeometryType.Path === 4 &&
        Object.keys(go.GeometryType).length === 8, 'Incorrect GeometryType enum');
      test.assert(
        go.GestureMode.Zoom === 1 &&
        go.GestureMode.Cancel === 2 &&
        go.GestureMode.None === 3 &&
        Object.keys(go.GestureMode).length === 6, 'Incorrect GestureMode enum');
      test.assert(
        go.GridAlignment.Position === 0 &&
        go.GridAlignment.Location === 1 &&
        Object.keys(go.GridAlignment).length === 4, 'Incorrect GridAlignment enum');
      test.assert(
        go.GridArrangement.LeftToRight === 10 &&
        go.GridArrangement.RightToLeft === 11 &&
        Object.keys(go.GridArrangement).length === 4, 'Incorrect GridArrangement enum');
      test.assert(
        go.GridSorting.Forwards === 20 &&
        go.GridSorting.Reverse === 21 &&
        go.GridSorting.Ascending === 22 &&
        go.GridSorting.Descending === 23 &&
        Object.keys(go.GridSorting).length === 8, 'Incorrect GridSorting enum');
      test.assert(
        go.ImageStretch.None === 0 &&
        go.ImageStretch.Fill === 2 &&
        go.ImageStretch.Uniform === 6 &&
        go.ImageStretch.UniformToFill === 7 &&
        Object.keys(go.ImageStretch).length === 8, 'Incorrect ImageStretch enum');
      test.assert(
        go.LayeredDigraphAggressive.None === 30 &&
        go.LayeredDigraphAggressive.Less === 31 &&
        go.LayeredDigraphAggressive.More === 32 &&
        Object.keys(go.LayeredDigraphAggressive).length === 6, 'Incorrect LayeredDigraphAggressive enum');
      test.assert(
        go.LayeredDigraphAlign.None === 0 &&
        go.LayeredDigraphAlign.UpperLeft === 1 &&
        go.LayeredDigraphAlign.UpperRight === 2 &&
        go.LayeredDigraphAlign.LowerLeft === 4 &&
        go.LayeredDigraphAlign.LowerRight === 8 &&
        go.LayeredDigraphAlign.All === 15 &&
        Object.keys(go.LayeredDigraphAlign).length === 12, 'Incorrect LayeredDigraphAlign enum');
      test.assert(
        go.LayeredDigraphCycleRemove.DepthFirst === 0 &&
        go.LayeredDigraphCycleRemove.Greedy === 1 &&
        go.LayeredDigraphCycleRemove.FromLayers === 2 &&
        Object.keys(go.LayeredDigraphCycleRemove).length === 6, 'Incorrect LayeredDigraphCycleRemove enum');
      test.assert(
        go.LayeredDigraphInit.DepthFirstOut === 20 &&
        go.LayeredDigraphInit.DepthFirstIn === 21 &&
        go.LayeredDigraphInit.Naive === 22 &&
        Object.keys(go.LayeredDigraphInit).length === 6, 'Incorrect LayeredDigraphInit enum');
      test.assert(
        go.LayeredDigraphLayering.OptimalLinkLength === 10 &&
        go.LayeredDigraphLayering.LongestPathSink === 11 &&
        go.LayeredDigraphLayering.LongestPathSource === 12 &&
        Object.keys(go.LayeredDigraphLayering).length === 6, 'Incorrect LayeredDigraphLayering enum');
      test.assert(
        go.LayeredDigraphPack.None === 0 &&
        go.LayeredDigraphPack.Expand === 1 &&
        go.LayeredDigraphPack.Straighten === 2 &&
        go.LayeredDigraphPack.Median === 4 &&
        go.LayeredDigraphPack.MaybeExpand === 8 &&
        go.LayeredDigraphPack.All === 15 &&
        Object.keys(go.LayeredDigraphPack).length === 12, 'Incorrect LayeredDigraphPack enum');
      test.assert(
        go.LayoutConditions.None === 0 &&
        go.LayoutConditions.Added === 1 &&
        go.LayoutConditions.Removed === 2 &&
        go.LayoutConditions.Shown === 4 &&
        go.LayoutConditions.Hidden === 8 &&
        go.LayoutConditions.NodeSized === 16 &&
        go.LayoutConditions.GroupLayout === 32 &&
        go.LayoutConditions.NodeReplaced === 64 &&
        go.LayoutConditions.Standard === 127 &&
        go.LayoutConditions.All === 16777215 &&
        Object.keys(go.LayoutConditions).length === 20, 'Incorrect LayoutConditions enum');
      test.assert(
        go.LinkAdjusting.None === 0 &&
        go.LinkAdjusting.End === 17 &&
        go.LinkAdjusting.Scale === 18 &&
        go.LinkAdjusting.Stretch === 19 &&
        Object.keys(go.LinkAdjusting).length === 8, 'Incorrect LinkAdjusting enum');
      test.assert(
        go.Curve.None === 0 &&
        go.Curve.Bezier === 9 &&
        go.Curve.JumpGap === 10 &&
        go.Curve.JumpOver === 11 &&
        Object.keys(go.Curve).length === 8, 'Incorrect Curve enum');
      test.assert(
        go.Routing.Normal === 1 &&
        go.Routing.Orthogonal === 2 &&
        go.Routing.AvoidsNodes === 6 &&
        go.Routing.AvoidsNodesStraight === 7 &&
        Object.keys(go.Routing).length === 8, 'Incorrect Routing enum');
      test.assert(
        go.LinkingDirection.Either === 1 &&
        go.LinkingDirection.ForwardsOnly === 2 &&
        go.LinkingDirection.BackwardsOnly === 3 &&
        Object.keys(go.LinkingDirection).length === 6, 'Incorrect LinkingDirection enum');
      test.assert(
        go.Orientation.None === 0 &&
        go.Orientation.Along === 21 &&
        go.Orientation.Plus90 === 22 &&
        go.Orientation.Minus90 === 23 &&
        go.Orientation.Opposite === 24 &&
        go.Orientation.Upright === 25 &&
        go.Orientation.Plus90Upright === 26 &&
        go.Orientation.Minus90Upright === 27 &&
        go.Orientation.Upright45 === 28 &&
        Object.keys(go.Orientation).length === 18, 'Incorrect Orientation enum');
      test.assert(
        go.TextOverflow.Clip === 0 &&
        go.TextOverflow.Ellipsis === 1 &&
        Object.keys(go.TextOverflow).length === 4, 'Incorrect TextOverflow enum');
      // test.assert(
      //   go.Panel.Position === 0 &&
      //   go.Panel.Spot === 1 &&
      //   go.Panel.Auto === 2 &&
      //   go.Panel.Table === 3 &&
      //   go.Panel.Vertical === 4 &&
      //   go.Panel.Horizontal === 5 &&
      //   go.Panel.Viewbox === 6 &&
      //   go.Panel.TableRow === 7 &&
      //   go.Panel.TableColumn === 8 &&
      //   go.Panel.Link === 9 &&
      //   go.Panel.Grid === 10 &&
      //   go.Panel.Graduated === 11 &&
      //   Object.keys(go.Panel).length === 24, 'Incorrect Panel enum');
      test.assert(
        go.PortSpreading.None === 0 &&
        go.PortSpreading.Evenly === 1 &&
        go.PortSpreading.Packed === 2 &&
        Object.keys(go.PortSpreading).length === 6, 'Incorrect PortSpreading enum');
      test.assert(
        go.ReshapingBehavior.None === 0 &&
        go.ReshapingBehavior.Horizontal === 1 &&
        go.ReshapingBehavior.Vertical === 2 &&
        go.ReshapingBehavior.All === 3 &&
        Object.keys(go.ReshapingBehavior).length === 8, 'Incorrect ReshapingBehavior enum');
      test.assert(
        go.ScrollMode.Document === 1 &&
        go.ScrollMode.Infinite === 2 &&
        Object.keys(go.ScrollMode).length === 4, 'Incorrect ScrollMode enum');
      test.assert(
        go.SegmentType.Move === 1 &&
        go.SegmentType.Line === 2 &&
        go.SegmentType.Bezier === 3 &&
        go.SegmentType.QuadraticBezier === 4 &&
        go.SegmentType.Arc === 5 &&
        go.SegmentType.SvgArc === 6 &&
        Object.keys(go.SegmentType).length === 12, 'Incorrect SegmentType enum');
      test.assert(
        go.Sizing.Default === 1 &&
        go.Sizing.None === 2 &&
        go.Sizing.ProportionalExtra === 3 &&
        Object.keys(go.Sizing).length === 6, 'Incorrect Sizing enum');
      test.assert(
        go.TriggerStart.Default === 1 &&
        go.TriggerStart.Immediate === 2 &&
        go.TriggerStart.Bundled === 3 &&
        Object.keys(go.TriggerStart).length === 6, 'Incorrect TriggerStart enum');
      test.assert(
        go.Stretch.None === 0 &&
        go.Stretch.Default === 1 &&
        go.Stretch.Vertical === 4 &&
        go.Stretch.Horizontal === 5 &&
        go.Stretch.Fill === 2 &&
        Object.keys(go.Stretch).length === 10, 'Incorrect Stretch enum');
      test.assert(
        go.TextEditingAccept.LostFocus === 1 &&
        go.TextEditingAccept.MouseDown === 2 &&
        go.TextEditingAccept.Tab === 3 &&
        go.TextEditingAccept.Enter === 4 &&
        Object.keys(go.TextEditingAccept).length === 8, 'Incorrect TextEditingAccept enum');
      test.assert(
        go.TextEditingStarting.SingleClick === 1 &&
        go.TextEditingStarting.SingleClickSelected === 2 &&
        go.TextEditingStarting.DoubleClick === 3 &&
        Object.keys(go.TextEditingStarting).length === 6, 'Incorrect TextEditingStarting enum');
      test.assert(
        go.TextEditingState.None === 1 &&
        go.TextEditingState.Active === 2 &&
        go.TextEditingState.Editing === 3 &&
        go.TextEditingState.Validating === 4 &&
        go.TextEditingState.Invalid === 5 &&
        go.TextEditingState.Validated === 6 &&
        Object.keys(go.TextEditingState).length === 12, 'Incorrect TextEditingState enum');
      test.assert(
        go.TreeAlignment.CenterSubtrees === 20 &&
        go.TreeAlignment.CenterChildren === 21 &&
        go.TreeAlignment.Start === 22 &&
        go.TreeAlignment.End === 23 &&
        go.TreeAlignment.Bus === 24 &&
        go.TreeAlignment.BusBranching === 25 &&
        go.TreeAlignment.TopLeftBus === 26 &&
        go.TreeAlignment.BottomRightBus === 27 &&
        go.TreeAlignment.Custom === 28 &&
        Object.keys(go.TreeAlignment).length === 18, 'Incorrect TreeAlignment enum');
      test.assert(
        go.TreeArrangement.Vertical === 50 &&
        go.TreeArrangement.Horizontal === 51 &&
        go.TreeArrangement.FixedRoots === 52 &&
        Object.keys(go.TreeArrangement).length === 6, 'Incorrect TreeArrangement enum');
      test.assert(
        go.TreeCompaction.None === 30 &&
        go.TreeCompaction.Block === 31 &&
        Object.keys(go.TreeCompaction).length === 4, 'Incorrect TreeCompaction enum');
      test.assert(
        go.TreeLayerStyle.Individual === 60 &&
        go.TreeLayerStyle.Siblings === 61 &&
        go.TreeLayerStyle.Uniform === 62 &&
        Object.keys(go.TreeLayerStyle).length === 6, 'Incorrect TreeLayerStyle enum');
      test.assert(
        go.TreePath.Default === 0 &&
        go.TreePath.Destination === 1 &&
        go.TreePath.Source === 2 &&
        Object.keys(go.TreePath).length === 6, 'Incorrect TreePath enum');
      test.assert(
        go.TreeSorting.Forwards === 10 &&
        go.TreeSorting.Reverse === 11 &&
        go.TreeSorting.Ascending === 12 &&
        go.TreeSorting.Descending === 13 &&
        Object.keys(go.TreeSorting).length === 8, 'Incorrect TreeSorting enum');
      test.assert(
        go.TreeStyle.Layered === 40 &&
        go.TreeStyle.LastParents === 41 &&
        go.TreeStyle.Alternating === 42 &&
        go.TreeStyle.RootOnly === 43 &&
        Object.keys(go.TreeStyle).length === 8, 'Incorrect TreeStyle enum');
      test.assert(
        go.ViewboxStretch.Uniform === 6 &&
        go.ViewboxStretch.UniformToFill === 7 &&
        Object.keys(go.ViewboxStretch).length === 4, 'Incorrect ViewboxStretch enum');
      test.assert(
        go.WheelMode.Scroll === 1 &&
        go.WheelMode.Zoom === 2 &&
        go.WheelMode.None === 3 &&
        Object.keys(go.WheelMode).length === 6, 'Incorrect WheelMode enum');
      test.assert(
        go.Wrap.None === 0 &&
        go.Wrap.Fit === 1 &&
        go.Wrap.DesiredSize === 2 &&
        go.Wrap.BreakAll === 3 &&
        Object.keys(go.Wrap).length === 8, 'Incorrect Wrap enum');
    }
  )); // end test

})(); // End test system


