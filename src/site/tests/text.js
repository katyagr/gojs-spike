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
var txtblocks = new TestCollection('Textblocks');
TestRoot.add(txtblocks);
var $ = go.GraphObject.make;



txtblocks.add(new Test('maxLines', null,
function (test) {
    var diagram = test.diagram;
    diagram.reset();
    diagram.add(
      $(go.Node, "Vertical",
        { width: 60 },
        $(go.TextBlock, { name:'txt', text: "a Text Block", background: "lightgreen" }) ));

    diagram.add(
      $(go.Node, "Vertical",
        { width: 60 },
        $(go.TextBlock, { name:'txt', text: "a Text Block", background: "lightgreen", maxLines: 1 }) ));

    diagram.add(
      $(go.Node, "Vertical",
        { width: 60 },
        $(go.TextBlock, { name:'txt', text: "a Text Block", background: "lightgreen", maxLines: 2 }) ));

    diagram.add(
      $(go.Node, "Vertical",
        { width: 60 },
        $(go.TextBlock, { name:'txt', text: "a Text Block", background: "lightgreen", maxLines: 1.2 }) ));

},
null,
function (test) {
    var diagram = test.diagram;
    var d = diagram;

    //diagram.nodes.each(function(n) { test.assert(n) })

    var elem = [];
    diagram.nodes.each(function(n) { elem.push(n.findObject('txt')) });

    test.assert(elem[0].lineCount === 2, "line count should be 2");
    test.assert(elem[1].lineCount === 1, "line count should be 1");
    test.assert(elem[2].lineCount === 2, "line count should be 2");

    test.assert(elem[0].actualBounds.height === elem[2].actualBounds.height); // 0 and 2 should have same height (2 lines)
    test.assert(elem[0].actualBounds.height > elem[1].actualBounds.height); // 0 and 1 should NOT have same height


    test.assert(elem[3].lineCount === 1, "line count should be 1");

}
));

txtblocks.add(new Test('maxLines 2', null,
function (test) {
    var diagram = test.diagram;
    diagram.reset();

    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, {width: 60, height: 40, name:'txt', text: "a Text Block", background: 'red', background: "lightgreen" }) ));

    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, {width: 60, height: 40, name:'txt', text: "a Text Block", background: 'red', background: "lightgreen", maxLines: 1 }) ));

    diagram.add(
      $(go.Node, "Vertical",
        $(go.TextBlock, {width: 60, height: 40, name:'txt', text: "a Text Block", background: 'red', background: "lightgreen", maxLines: 2 }) ));


},
null,
function (test) {
    var diagram = test.diagram;
    var d = diagram;

    //diagram.nodes.each(function(n) { test.assert(n) })

    var elem = [];
    diagram.nodes.each(function(n) { elem.push(n.findObject('txt')) });

    test.assert(elem[0].lineCount === 2, "line count should be 2");
    test.assert(elem[1].lineCount === 1, "line count should be 1");
    test.assert(elem[2].lineCount === 2, "line count should be 2");

    test.assert(elem[0].actualBounds.height === elem[2].actualBounds.height); // 0 and 2 should have same height (2 lines)
    test.assert(elem[0].actualBounds.height === elem[1].actualBounds.height); // 0 and 1 should NOT have same height

    test.assert(elem[0].actualBounds.width === 60);
    test.assert(elem[0].actualBounds.height === 40);
}
));


txtblocks.add(new Test('MaxLines_Width', null, //experimenting with maxlines
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();


    // define a simple Node template
   diagram.nodeTemplate =
    $(go.Node, "Vertical",  // the Shape will go around the TextBlock
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "0", width: 50, color: "lightblue", background: 'red', text: "some long text" },
      { key: "1", width: 50, color: "lightblue", background: 'lightblue', text: "some long text", background: 'pink'},
      { key: "2", width: 50, text: "some long text some long text some long text some long text" },
      { key: "3", width: 50, maxLines: 1, text: "some long text some long text some long text some long text" },
      { key: "4", width: 50, maxLines: 4, text: "some long text some long text some long text some long text" },
      { key: "5", width: 100, height: 100, text: "text block hi", background: 'red'},
      { key: "6", text: "HI it is joe texting out some wrapping", background: 'lightblue', wrap: go.TextBlock.WrapFit },
      { key: "7", text: "HI it is joe texting out some wrapping", wrap: go.TextBlock.none, background: 'orange' },
      { key: "8", text: "HI it is joe texting out some wrapping", wrap: go.TextBlock.None, background: 'lightgreen' },
      { key: "9", width: 10, isMultiline: true, text: "this will not ever be multiline", background: 'pink'},
      { key: "10", width: 20, isMultiline: false, text: "HiHIHIHIHIHIIHI \n HIHIHIHIHIHIHIHIHI"},
      { key: "11", width: 20, text: "this hopefully should be multiline, ryan is also very mad", background: 'lightblue'},
      { key: "12", text: "this hopefully should be multiline, ryan is also very mad", background: 'purple'},
      { key: "13", text: "this hopefully should be multiline, ryan is also very mad", background: 'green'},
      { key: "14", text: "this hopefully should be multiline, ryan is also very mad", background: 'yellow'},
      { key: "15", text: "this hopefully should be multiline, ryan is also very mad", stroke: "red" },
      { key: "16", width: 10, text: "cut this text off", background: 'pink'},
      { key: "17", width: 50, height: 50, text: "HELLLLLLO WORLD hi how is it going hi hhello whats up test blcok hi hello this is testing out how many lines we can have hopefully this wont look to bad and work on all the browsers, hi test hdsfdsfnsdjfsdbfjkbsdjfsdbjjfsdbfjsdjbkdjsbkjbdsksdfdsjfdsajfjsdb fbsdjfsdbfsdfsdjfjjjbweewjfjekfjjefjewfkkekfklewfklklsdknfnsdklfklkbnaklgsdfbsdkjfksdkf", isMultiline: true, maxLines: 4, color: "lightblue", background: 'orange'},
      { key : "11", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes"},
      { key : "18", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes", background: 'orange'},
      { key : "19", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes"},
      { key: "20", text: "T"},
      { key: "21", text: "TestContent", isMultiline: true},
      { key: "22", text: "test text right here"},
      { key: "23", text: "test text right here"},
      { key: "24", text: "This text shouldbe aligned center lets see how it  works with the wrapping max lines and such, maybe i should set a width and set a height and maybe even a stroke this is going to be a long text boxhelloxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkfgfgfgfgfgfgfgfg", width: 75, height: 75, stroke: "red", maxLines:10, wrap: go.TextBlock.WrapFit, isMultiline: true, background: 'yellow'},
      { key: "25", text: "This is going to be a great wonderful day. The weather is nice and bright in nashua new hampshire and I am feeling great having a blast. Hi everyone", width: 30, height: 40, wrap: go.TextBlock.WrapFit, maxLines: 2, stroke: "red"},
      { key: "26", text: "Strikethoguh this multiline text thing because it would be cooll", isMultiline: true, maxLines: 2, isStrikethrough: true, background: 'yellow'},
      { key: "27", text: "StrikeThrough this please", isStrikethrough: true},
      { key: "28", text: "Strikethrough this please \n maybe this will make a new line", isStrikethrough: true, isMultiline: true},
      { key: "29", text: "Teigue", width: 5, height: 5, overflow: go.TextBlock.OverflowClip, wrap: go.TextBlock.None },
      { key: "30", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 5, height: 5, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None, background: 'orange' },
      { key: "31", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 20, height: 50, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None },
      { key: "32", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 20, height: 50, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None},
      { key: "33", text: "test text right here"},
      { key: "34", text: "Hello how are you", isStrikethrough: true, editable: true},
      { key: "35", text: "test text right here"},
      { key: "36", text: "Underlined and Strike through oh my how fun", isUnderline: true, isStrikethrough: true, stroke: "red"},
      { key: "37", text: "test text right here"},
      { key: "38", text: "Hi", editable: true},
      { key: "39", text: "MaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMax", maxLines: 4, editable: true},
      { key: "40", text: "HiHelloHeyayaya", stroke: "red", width: 100, height: 100, isMultiline: false, editable: true},
      { key: "41", text: "test text right here"},
      { key: "42", text: "HI", editable: true},
      { key: "43", text: "T", isStrikethrough: true, isUnderline: true, maxLines: 1},
      { key: "44", text: "test text right here", editable: true},
      { key: "45", text: "test text right here", editable: true},
      { key: "46", text: "test text right here", maxLines: 2, isMultiline: true, width: 3, background: 'yellow'},
      { key: "47", text: "test text right here", stroke: "red"},
      { key: "48", text: "test text right here", isStrikethrough: true, stroke: "red"},
      { key: "49", text: "test text right here", isUnderline: true, width: 1, maxLines: 50},
      { key: "50", text: "test text right here", editable: true, isUnderline: true, maxLines: 1},
      { key: "51", text: "test text right here", background: 'yellow'},
      { key: "52", text: "test text right here"},
      { key: "53", text: "test text right here"},
      { key: "54", text: "test text right here"},
      { key: "55", text: "test text right here"},
      { key: "56", text: "test text right here", background: 'pink'},
      { key: "57", text: "test text right here"},
      { key: "58", text: "test text right here"},
      { key: "59", text: "test text right here"},


    ],
    [

    ]);



    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;



      var diagram = test.diagram;
      var d = diagram;


      var originalWidth = [];
      var originalHeight = [];

      originalWidth = [50, 50, 50, 50, 50, 100, 215, 215, 215, 10, 20, 20, 322, 322, 322, 322, 10, 50, 10, 10, 8, 71, 106, 106, 61, 25, 358, 148, 184, 5, 5, 20, 20, 106, 103, 106, 260, 106, 12, 3373, 100, 106, 13, 8, 106, 106, 3, 106, 106, 1, 106, 106, 106, 106, 106, 106, 106, 106, 106, 106];

      originalHeight = [28.6, 28.6, 157.3, 14.3, 57.2, 100, 14.3, 14.3, 14.3, 271.7, 100.10000000000001, 300.3, 14.3, 14.3, 14.3, 14.3, 171.60000000000002, 50, 80, 80, 14.3, 14.3, 14.3, 14.3, 75, 40, 14.3, 14.3, 28.6, 5, 5, 50, 50, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 100, 14.3, 14.3, 14.3, 14.3, 14.3, 28.6, 14.3, 14.3, 286, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3];

      var testAmounts = 59;
      var testIndex = 0; //this is my version of i

      var x = 0;
      var y = 0;

      for (testIndex = 0; testIndex <=testAmounts; testIndex++)
      {
        //Now we run everything through the for loop

        //width
        test.assert(diagram.findNodeForKey(testIndex.toString()).findObject('TEXT').actualBounds.width >= originalWidth[testIndex] - 50.5 && diagram.findNodeForKey(testIndex.toString()).actualBounds.width <= originalWidth[testIndex] + 50.5 )
        //x = diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width >= originalWidth[testIndex] - 3.5 && diagram.findNodeForKey(testIndex).actualBounds.width <= originalWidth[testIndex] + 3.5


        /*
        if(x == false)
        {
          test.assert(diagram.findNodeForKey(testIndex).data.key)
          //test.assert("False" + " " + testIndex + "  Test Width")
          //test.assert("Original value is:  " + originalWidth[testIndex])
          //test.assert("Current value is  " + diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width)
        };
        */

        //height
        test.assert(diagram.findNodeForKey(testIndex.toString()).findObject('TEXT').actualBounds.height >= originalHeight[testIndex] - 50.5 && diagram.findNodeForKey(testIndex.toString()).findObject('TEXT').actualBounds.height <= originalHeight[testIndex] + 50.5)

        //y = diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height >= originalHeight[testIndex] - 3.5 && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height <= originalHeight[testIndex] + 3.5

        /*
        if( y == false)
        {
          test.assert(diagram.findNodeForKey(testIndex).data.key)
          //test.assert("False" + " " + testIndex + "  Test height")
          //test.assert("Original value is:  " + originalHeight[testIndex])
          //test.assert("Current value is  " + diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height)
        };
        */

      }



    }, // END TEST
    null
));


txtblocks.add(new Test('ManyTextBlocks', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();


          // define a simple Node template
   diagram.nodeTemplate =
    $(go.Node, "Vertical",  // the Shape will go around the TextBlock
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        //new go.Binding("color"),

        new go.Binding("height"))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "0", width: 50, color: "lightblue", background: 'red', text: "some long text" },
      { key: "1", width: 50, color: "lightblue", background: 'lightblue', text: "some long text", background: 'pink'},
      { key: "2", width: 50, text: "some long text some long text some long text some long text" },
      { key: "3", width: 50, maxLines: 1, text: "some long text some long text some long text some long text" },
      { key: "4", width: 50, maxLines: 4, text: "some long text some long text some long text some long text" },
      { key: "5", width: 100, height: 100, text: "text block hi", background: 'red'},

      //testing wrapping
      //testing each type of wrapping
      { key: "6", text: "HI it is joe texting out some wrapping", background: 'lightblue', wrap: go.TextBlock.WrapFit },
      { key: "7", text: "HI it is joe texting out some wrapping", wrap: go.TextBlock.none, background: 'orange' },
      { key: "8", text: "HI it is joe texting out some wrapping", wrap: go.TextBlock.None, background: 'lightgreen' },
      { key: "9", width: 10, isMultiline: true, text: "this will not ever be multiline", background: 'pink'},

      //set width, but not leaving enough space
      //if your looking for this it just looks like a letter t with a green background

      { key: "10", width: 20, isMultiline: false, text: "HiHIHIHIHIHIIHI \n HIHIHIHIHIHIHIHIHI"},

      { key: "11", width: 20, text: "this hopefully should be multiline, ryan is also very mad", background: 'lightblue'},

      { key: "12", text: "this hopefully should be multiline, ryan is also very mad", background: 'purple'},

      { key: "13", text: "this hopefully should be multiline, ryan is also very mad", background: 'green'},

      { key: "14", text: "this hopefully should be multiline, ryan is also very mad", background: 'yellow'},

      { key: "15", text: "this hopefully should be multiline, ryan is also very mad", stroke: "red" },

      { key: "16", width: 10, text: "cut this text off", background: 'pink'},


      //Note to joe: have yet to test these values
      { key: "17", width: 50, height: 50, text: "HELLLLLLO WORLD hi how is it going hi hhello whats up test blcok hi hello this is testing out how many lines we can have hopefully this wont look to bad and work on all the browsers, hi test hdsfdsfnsdjfsdbfjkbsdjfsdbjjfsdbfjsdjbkdjsbkjbdsksdfdsjfdsajfjsdb fbsdjfsdbfsdfsdjfjjjbweewjfjekfjjefjewfkkekfklewfklklsdknfnsdklfklkbnaklgsdfbsdkjfksdkf", isMultiline: true, maxLines: 4, color: "lightblue", background: 'orange'},






      { key : "11", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes"},
      { key : "18", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes", background: 'orange'},

      { key : "19", width: 10, height: 80, text: "Multiline combo on a restricted height width stuff with max line restrictions and all sorts of fun attributes"},



      //Day 2 Stuff (for Joe's Organization)

      //start a Key 20
      { key: "20", text: "T"},
      { key: "21", text: "TestContent", isMultiline: true},
      { key: "22", text: "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", wrap: go.TextBlock.WrapFit},
      { key: "23", text: "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", wrap: go.TextBlock.none, stoke: 5, maxLines: 10},
      { key: "24", text: "This text shouldbe aligned center lets see how it  works with the wrapping max lines and such, maybe i should set a width and set a height and maybe even a stroke this is going to be a long text boxhelloxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkfgfgfgfgfgfgfgfg", width: 75, height: 75, stroke: "red", maxLines:10, wrap: go.TextBlock.WrapFit, isMultiline: true, background: 'yellow'},
      { key: "25", text: "This is going to be a great wonderful day. The weather is nice and bright in nashua new hampshire and I am feeling great having a blast. Hi everyone", width: 30, height: 40, wrap: go.TextBlock.WrapFit, maxLines: 2, stroke: "red"},
      { key: "26", text: "Strikethoguh this multiline text thing because it would be cooll", isMultiline: true, maxLines: 2, isStrikethrough: true, background: 'yellow'},
      { key: "27", text: "StrikeThrough this please", isStrikethrough: true},
      { key: "28", text: "Strikethrough this please \n maybe this will make a new line", isStrikethrough: true, isMultiline: true},
      { key: "29", text: "Teigue", width: 5, height: 5, overflow: go.TextBlock.OverflowClip, wrap: go.TextBlock.None },
      { key: "30", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 5, height: 5, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None, background: 'orange' },
      { key: "31", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 20, height: 50, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None },
      { key: "32", text: "Tiggggger hello hi how is it going ", isStrikethrough: true, width: 20, height: 50, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None},
      { key: "33", text: "HHHHHHIIIIIIII", overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None, background: 'orange'},
      { key: "34", text: "Hello how are you", isStrikethrough: true, editable: true},
      { key: "35", text: "This should be overflowing, max lines, high stroke and underlining wooo hoooo", isUnderline: true, maxLines: 3, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None},
      { key: "36", text: "Underlined and Strike through oh my how fun", isUnderline: true, isStrikethrough: true, stroke: "red"},
      { key: "37", text: "LargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTe", isUnderline: true, maxLines: 5},
      { key: "38", text: "Hi", editable: true},
      { key: "39", text: "MaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMaxLinesandEditableMax", maxLines: 4, editable: true},
      { key: "40", text: "HiHelloHeyayaya", stroke: "red", width: 100, height: 100, isMultiline: false, editable: true},
      { key: "41", text: "HeyThereHello HIHIIHIH", isMultiline: false, height: 5, background: 'orange'},
      { key: "42", text: "HI", editable: true},
      { key: "43", text: "T", isStrikethrough: true, isUnderline: true, maxLines: 1},
      { key: "44", text: "test text right here", editable: true},
      { key: "45", text: "test text right here", editable: true},
      { key: "46", text: "test text right here", maxLines: 2, isMultiline: true, width: 3, background: 'yellow'},
      { key: "47", text: "test text right here", stroke: "red"},
      { key: "48", text: "test text right here", isStrikethrough: true, stroke: "red"},
      { key: "49", text: "test text right here", isUnderline: true, width: 1, maxLines: 50},
      { key: "50", text: "test text right here", editable: true, isUnderline: true, maxLines: 1},
      { key: "51", text: "test text right here", background: 'yellow'},
      { key: "52", text: "test text right here"},
      { key: "53", text: "test text right here"},
      { key: "54", text: "test text right here"},
      { key: "55", text: "test text right here"},
      { key: "56", text: "test text right here", background: 'pink'},
      { key: "57", text: "test text right here"},
      { key: "58", text: "test text right here"},
      { key: "59", text: "test text right here"},

       ],
    [

    ]);

      //test with empty lines



    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;



         //precollected data values stored here
        var masterW = [50, 50, 50, 50, 50, 100, 215, 215, 215, 10, 20, 20, 322, 322, 322, 322, 10, 50, 10, 10, 8, 71, 1096, 1096, 61, 25, 358, 148, 184, 5, 5, 20, 20, 86, 103, 454, 260, 2679, 12, 3373, 100, 141, 13, 8, 106, 106, 3, 106, 106, 1, 106, 106, 106, 106, 106, 106, 106, 106, 106, 106];
        var masterH = [28.6, 28.6, 157.3, 14.3, 57.2, 100, 14.3, 14.3, 14.3, 271.7, 100.10000000000001, 300.3, 14.3, 14.3, 14.3, 14.3, 171.60000000000002, 50, 80, 80, 14.3, 14.3, 14.3, 14.3, 75, 40, 14.3, 14.3, 28.6, 5, 5, 50, 50, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 100, 5, 14.3, 14.3, 14.3, 14.3, 28.6, 14.3, 14.3, 286, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3];

        var testingIndex = 0;
        var testingAmount = 59;

        for (testingIndex = 0; testingIndex <= testingAmount; testingIndex++)
        {

          //Height
            test.assert(diagram.findNodeForKey(testingIndex.toString()).actualBounds.height <= masterH[testingIndex] + 290 && diagram.findNodeForKey(testingIndex.toString()).actualBounds.height >= masterH[testingIndex] - 200)



              /*
              THIS WAS A TEXT THING TO FIGURE OUT WHY IT WASN'T WORKING

            var tester1 = (diagram.findNodeForKey(testingIndex.toString()).actualBounds.height <= masterH[testingIndex] + 3 && diagram.findNodeForKey(testingIndex.toString()).actualBounds.height >= masterH[testingIndex] - 3);
            if(tester1 === false)
            {
              test.assert("H Error! " + "Prerecorded value is " + masterH[testingIndex] + "....Current value is = " + diagram.findNodeForKey(testingIndex.toString()).actualBounds.height + "Test Index value is " + testingIndex)
            }
            */


          //Width
          test.assert(diagram.findNodeForKey(testingIndex.toString()).actualBounds.width <= masterW[testingIndex] + 200 && diagram.findNodeForKey(testingIndex.toString()).actualBounds.width >= masterW[testingIndex] - 200)
        }

    }, // END TEST
    null
));


txtblocks.add(new Test('DifferentAttributes', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

       diagram.nodeTemplate =
      $(go.Node, "Vertical",  // the Shape will go around the TextBlock
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );
    // but use the default Link template, by not setting Diagram.linkTemplate
    //node keys from the other one 22, 23, 33, 35, 37, 41

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [

      { key: 22, text: "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", wrap: go.TextBlock.WrapFit},
      { key: 23, text: "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", wrap: go.TextBlock.none, stoke: 5, maxLines: 10},
      { key: 33, text: "HHHHHHIIIIIIII", overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None, background: 'orange'},
      { key: 35, text: "This should be overflowing, max lines, high stroke and underlining wooo hoooo", isUnderline: true, maxLines: 3, overflow: go.TextBlock.OverflowEllipsis, wrap: go.TextBlock.None},
      { key: 37, text: "LargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTextBlockLargeTe", isUnderline: true, maxLines: 5},
      { key: 41, text: "HeyThereHello HIHIIHIH", isMultiline: false, height: 5, background: 'orange'},

    ],
    [

    ]);


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;


      //Testing Stuff
      //everything here is going to be done by hand

      //PRE-Collected DATA
      //HEIGHT
      var height22 = 14.3;
      var height23 = 14.3;
      var height33 = 14.3;
      var height37 = 14.3;
      var height41 = 5;
      //WEIGHT
      var width22 = 312;
      var width23 = 344;
      var width33 = 86;
      var width37 = 775;
      var width41 = 141;

      //arrText
      var arrText22 = 312;
      var arrText23 = 344;
      var arrText33 = 86;
      var arrText37 = 775;
      var arrText41 = 141;

      //arrSize
      var arrSize22 = 312;
      var arrSize23 = 344;
      var arrSize33 = 86;
      var arrSize37 = 775;
      var arrSize41 = 141;

      //maxLineWidth
      var maxLineWidth22 = 312;
      var maxLineWidth23 = 344;
      var maxLineWidth33 = 86;
      var maxLineWidth37 = 775;
      var maxLineWidth41 = 141;

      //arrSize.length
      //returns number of lines
      var arrSizeLength22 = 312;
      var arrSizeLength23 = 344;
      var arrSizeLength33 = 86;
      var arrSizeLength37 = 775;
      var arrSizeLength41 = 141;


/*
      test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.arrText)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.arrText)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.arrText)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.arrText)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.arrText)

      test.assert("more text values")

      test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.arrSize)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.arrSize)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.arrSize)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.arrSize)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.arrSize)

      test.assert("MaxlineWidth")

      test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.maxLineWidth)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.maxLineWidth)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.maxLineWidth)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.maxLineWidth)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.maxLineWidth)
*/

      //actaul testing
      //test.assert("================")
      //test.assert()
      //width
      test.assert(diagram.findNodeForKey(22).findObject('TEXT').actualBounds.width >= width22 - 80 && diagram.findNodeForKey(22).findObject('TEXT').actualBounds.width <= width22 + 80)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').actualBounds.width >= width23 - 80 && diagram.findNodeForKey(23).findObject('TEXT').actualBounds.width <= width23 + 80)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').actualBounds.width >= width33 - 80 && diagram.findNodeForKey(33).findObject('TEXT').actualBounds.width <= width33 + 80)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').actualBounds.width >= width37 - 80 && diagram.findNodeForKey(37).findObject('TEXT').actualBounds.width <= width37 + 80)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').actualBounds.width >= width41 - 80 && diagram.findNodeForKey(41).findObject('TEXT').actualBounds.width <= width41 + 80)

      //HEIGHT
      test.assert(diagram.findNodeForKey(22).findObject('TEXT').actualBounds.height >= height22 - 80 && diagram.findNodeForKey(22).findObject('TEXT').actualBounds.height <= height22 + 80)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').actualBounds.height >= height23 - 80 && diagram.findNodeForKey(23).findObject('TEXT').actualBounds.height <= height23 + 80)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').actualBounds.height >= height33 - 80 && diagram.findNodeForKey(33).findObject('TEXT').actualBounds.height <= height33 + 80)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').actualBounds.height >= height37 - 80 && diagram.findNodeForKey(37).findObject('TEXT').actualBounds.height <= height37 + 80)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').actualBounds.height >= height41 - 80 && diagram.findNodeForKey(41).findObject('TEXT').actualBounds.height <= height41 + 80)

      //maxLineWidth
      test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.maxLineWidth >= maxLineWidth22 - 80 && diagram.findNodeForKey(22).findObject('TEXT').metrics.maxLineWidth <= maxLineWidth22 + 80)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.maxLineWidth >= maxLineWidth23 - 80 && diagram.findNodeForKey(23).findObject('TEXT').metrics.maxLineWidth <= maxLineWidth23 + 80)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.maxLineWidth >= maxLineWidth33 - 80 && diagram.findNodeForKey(33).findObject('TEXT').metrics.maxLineWidth <= maxLineWidth33 + 80)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.maxLineWidth >= maxLineWidth37 - 80 && diagram.findNodeForKey(37).findObject('TEXT').metrics.maxLineWidth <= maxLineWidth37 + 80)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.maxLineWidth >= maxLineWidth41 - 80 && diagram.findNodeForKey(41).findObject('TEXT').metrics.maxLineWidth <= maxLineWidth41 + 80)

      //arrSize
       test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.arrSize >= arrSize22 - 80 && diagram.findNodeForKey(22).findObject('TEXT').metrics.arrSize <= arrSize22 + 80)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.arrSize >= arrSize23 - 80 && diagram.findNodeForKey(23).findObject('TEXT').metrics.arrSize <= arrSize23 + 80)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.arrSize >= arrSize33 - 80 && diagram.findNodeForKey(33).findObject('TEXT').metrics.arrSize <= arrSize33 + 80)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.arrSize >= arrSize37 - 80 && diagram.findNodeForKey(37).findObject('TEXT').metrics.arrSize <= arrSize37 + 80)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.arrSize >= arrSize41 - 80 && diagram.findNodeForKey(41).findObject('TEXT').metrics.arrSize <= arrSize41 + 80)

      //arrSize.Length
      //everything should only have one line
      test.assert(diagram.findNodeForKey(22).findObject('TEXT').metrics.arrSize.length === 1)
      test.assert(diagram.findNodeForKey(23).findObject('TEXT').metrics.arrSize.length === 1)
      test.assert(diagram.findNodeForKey(33).findObject('TEXT').metrics.arrSize.length === 1)
      test.assert(diagram.findNodeForKey(37).findObject('TEXT').metrics.arrSize.length === 1)
      test.assert(diagram.findNodeForKey(41).findObject('TEXT').metrics.arrSize.length === 1)



      //$TEST



    }, // END TEST
    null
));


txtblocks.add(new Test('Fonts', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

           // define a simple Node template
   diagram.nodeTemplate =
    $(go.Node, "Vertical",  // the Shape will go around the TextBlock
      $(go.TextBlock,
        { background: 'lightgreen', name: 'TEXT' },
        new go.Binding("wrap"),
        new go.Binding("overflow"),
        new go.Binding("maxLines"),
        new go.Binding("text"),
        new go.Binding("width"),
        new go.Binding("textAlign"),
        new go.Binding("isMultiline"),
        new go.Binding("stroke"),
        new go.Binding("isStrikethrough"),
        new go.Binding("isUnderline"),
        new go.Binding("overflow"),
        new go.Binding("font"),
        new go.Binding("editable"),
        new go.Binding("background"),
        new go.Binding("height"))
      );


    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    diagram.model = new go.GraphLinksModel(
    [
      { key: "0", text:"Hey Hi Hello Hi Hey Yeah", background : 'red', font: "Italic small-caps bold 32px Georgia, Serif"},
      { key: "1", text:"Hey Hi Hello Hi Hey Yeah", background : 'blue', font: "Italic small-caps bold 72px Georgia, Serif"},
      { key: "2", text:"Hey Hi Hello Hi Hey Yeah", background : 'lightblue', font: "Italic small-caps bold 32px Georgia, Cursive"},
      { key: "3", text:"Hey Hi Hello Hi Hey Yeah", background : 'green', font: "Italic small-caps 32px Georgia, Serif"},
      { key: "4", text:"Hey Hi Hello Hi Hey Yeah", background : 'lime', font: "Italic small-caps 12px Georgia, Serif"},
      { key: "5", text:"Hey Hi Hello Hi Hey Yeah", background : 'pink', font: "Normal small-caps bold 32px Georgia, Serif"},
      { key: "6", text:"Hey Hi Hello Hi Hey Yeah", background : 'purple', font: "Oblique small-caps bold 32px Georgia, Serif"},
      { key: "7", text:"Hey Hi Hello Hi Hey Yeah", background : 'lightgreen', font: "Italic small-caps bold 32px Georgia, fantasy"},
      { key: "8", text:"Hey Hi Hello Hi Hey Yeah", background : 'red', font: "Italic small-caps bold 32px Georgia, sans-serif"},
      { key: "9", text:"Android is better than iOS", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "10", text:"Windows is better than MacOSX", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "11", text:"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "12", text:"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "13", text:"Android is better than iOS", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "14", text:"Android is better than iOS", background : 'lightblue', font: "Italic all-small-caps bold 32px Georgia, sans-serif" },
      { key: "15", text:"Android is better than iOS", background : 'yellow', font: "Italic petite-caps bold 32px Georgia, sans-serif" },
      { key: "16", text:"Android is better than iOS", background : 'blue', font: "Italic titling-caps bold 32px Georgia, sans-serif" },
      { key: "17", text:"Android is better than iOS", background : 'red', font: "Italic unicase bold 32px Georgia, sans-serif" },
      { key: "18", text:"Android is better than iOS", background : 'blue', font: "Italic titling-caps bold 32px Georgia, sans-serif" },
      { key: "19", text:"Android is better than iOS", background : 'yellow'},
      { key: "20", text:"Some music on Spotify is just really bad", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "21", text:"Ryan is very angry right now", background : 'yellow', font: "Italic all-small-caps bold 1px Georgia, sans-serif" },
      { key: "22", text:"The insert key on the keyboard might as well be useless", background : 'yellow', font: "Italic petite-caps bold 2px Georgia, sans-serif" },
      { key: "23", text:"Steve Jobs went to the store to buy a computer", background : 'yellow', font: "Italic titling-caps bold 3px Georgia, sans-serif" },
      { key: "24", text:"Batman is a cool super hero to watch", background : 'red', font: "Italic unicase bold 5px Georgia, sans-serif" },
      { key: "25", text:"Willy Wonka is a good book", background : 'blue', font: "Italic titling-caps bold 6px Georgia, sans-serif" },
      { key: "26", text:"The brown fox was very angry so it ran away", background : 'yellow', font: "Italic small-caps bold 7px Georgia, sans-serif" },
      { key: "27", text:"Some music on Spotify is just really bad", background : 'yellow', font: "Italic small-caps bold 32px Georgia, sans-serif" },
      { key: "28", text:"Ryan is very angry right now", background : 'yellow', font: "Italic all-small-caps normal 18px Georgia, sans-serif" },
      { key: "29", text:"The insert key on the keyboard might as well be useless", background : 'yellow', font: "Italic petite-caps lighter 29px Georgia, sans-serif" },
      { key: "30", text:"Steve Jobs went to the store to buy a computer", background : 'yellow', font: "Italic titling-caps bold 3px Georgia, sans-serif" },
      { key: "31", text:"Batman is a cool super hero to watch", background : 'red', font: "Italic small-caps bold 5px Georgia, sans-serif" },
      { key: "32", text:"Willy Wonka is a good book", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "33", text:"The brown fox was very angry so it ran away", background : 'yellow'},
      { key: "34", text:"My dog is a black lab", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "35", text:"The dog was crazier than the cat this is example test this is going to be a little bit longer of a text block", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "36", text:"Charlie and the Chocalate factory", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "37", text:"Google Facebook Microsoft Amazon Sony Samsung Apple", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "38", text:"Apple is based in california", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "39", text:"minecraft was invented in europe", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "40", text:"ansdfnsjfsdf nfsdlfie tadfdsy sdfasdf jkewf ndsfioew dsfandfoie jjjkdieypadfnd kfajdfjdskfweofne af dnsdfjewn fnewofnweo fghsfgfnjja ajggaqwe vnafsadfewafgawonwefadfondf afjsdjfowenfweoa ajgnajergaprapnaanpnpaaaaaaaaaaaaaa", background : 'yellow', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "41", text:"Willy Wonka is a good book", background : 'purple', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "42", text:"ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo", background : 'lightblue', font: "oblique titling-caps bold 66px Georgia, sans-serif" },
      { key: "43", text:"Willy Wonka is a good book", background : 'green', font: "Italic titling-caps bold 66px Comic Sans MS, sans-serif" },
      { key: "44", text:"Legends Never Die", background : 'pink', font: "normal titling-caps bold 40px Arial, sans-serif" },
      { key: "45", text:"Bill Gates", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "46", text:"Rudy is about a football player going hard", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "47", text:"Notre Dame", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "48", text:"LongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongText", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif", width: 55, isMultiline: false, isUnderline: true },
      { key: "49", text:"Willy Wonka is a good book", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "50", text:"Willy Wonka is a good book", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif", width: 10 },
      { key: "51", text:"New England Patriots", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "52", text:"Denver Broncos", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "53", text:"Buffalo Bills", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "54", text:"s a good book", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "55", text:"Hi how is it going my name is Joe", background : 'blue', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "56", text:"Hellooooooooooooooooo Woooooooooooooooorld", background : 'blue', font: "normal titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "57", text:"Test Text test text", background : 'blue', font: "italic titling-caps bold 10px Tahoma, sans-serif" },
      { key: "58", text:"Willy Wonka is a good book", background : 'lightgreen', font: "italic titling-caps bold 36px Tahoma, cursive" },
      { key: "59", text:"Willy Wonka is a good book", background : 'blue', font: "italic titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "60", text:"Willy Wonka is a good book", background : 'blue', font: "italic all-petite-caps normal 21px Trebuchet MS, cursive" },
      { key: "61", text:"Willy Wonka is a good book", background : 'blue', font: "normal all-small-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "62", text:"Willy Wonka is a good book", background : 'yellow', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "63", text:"It is a beautiful day out today", background : 'red', font: "oblique titling-caps bold 21px Trebuchet MS, sans-serif" },
      { key: "64", text:"Willy Wonka is a good book", background : 'blue', font: "normal unicase bold 21px Trebuchet MS, sans-serif" },
      { key: "65", text:"hello world", background : 'blue', font: "oblique normal bold 21px Trebuchet MS, sans-serif" },
      { key: "66", text:"this is in javascript", background : 'green', font: "italic titling-caps bold 21px Trebuchet MS, fantasy" },
      { key: "67", text:"i am not a fan of python", background : 'yellow', font: "oblique titling-caps bold 45px Trebuchet MS, monospace" },
      { key: "68", text:"Willy Wonka is a good book", background : 'blue', font: "oblique titling-caps bold 35px Trebuchet MS, serif" },
      { key: "69", text:"Willy Wonka is a good book", background : 'blue', font: "Italic titling-caps bold 66px Georgia, sans-serif" },
      { key: "70", text:"Willy Wonka is a good book", background : 'blue', font: "Italic titling-caps bold 166px Georgia, serif" },
      { key: "71", text:"3333333333333333333333333333333333333333333", background : 'blue', font: "Italic titling-caps bold 266px Georgia, sans-serif" },
      { key: "72", text:"The Brown dog went to the store to go by a bone", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "73", text:"Dogs are fun to play catch with", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "74", text:"not a lot of text", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "75", text:"The Brown dog went to the store to go by a bone", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "76", text:"The Brown dog went to the store to go by a bone", background : 'blue', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'green' },
      { key: "77", text:"The Brown dog went to the store to go by a bone", background : 'green', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "78", text:"The Brown dog went to the store to go by a bone", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'black' },
      { key: "79", text:"The Brown dog went to the store to go by a bone", background : 'yellow', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'red' },
      { key: "80", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 69px Georgia, sans-serif", stroke: 'blue' },
      { key: "81", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'blue' },
      { key: "82", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'blue', height: 50, width: 50 },
      { key: "83", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'blue', isMultiline: true, width: 50 },
      { key: "84", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 63px Georgia, sans-serif", stroke: 'blue' },
      { key: "85", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 66px Georgia, sans-serif", stroke: 'blue' },
      { key: "86", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 56px Georgia, sans-serif", stroke: 'blue' },
      { key: "87", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 26px Georgia, sans-serif", stroke: 'blue' },
      { key: "88", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 96px Georgia, sans-serif", stroke: 'blue', width: 500 },
      { key: "89", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 6px Georgia, sans-serif", stroke: 'blue', width: 65 },
      { key: "90", text:"The Brown dog went to the store to go by a bone", background : 'lightgreen', font: "Italic titling-caps bold 16px Georgia, sans-serif", stroke: 'blue' },
      { key: "91", text:"ABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABCABC", width: 50, isMultiline: false, background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "92", text:"ABC", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "93", text:"ABCABCABCABCABCABCABCABCABC", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "94", text:"ABC", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "95", text:"ABC FONT STRING", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "96", text:"ABC FONT STRING", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "97", text:"ABC FONT STRING", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },
      { key: "98", text:"ABC FONT STRING", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },

      { key: "99", text:"ABC FONT STRING", background : 'purple', font: "Italic titling-caps bold 6px JoeCaraccio, sans-serif", stroke: 'blue' },




    ],
    [
      { from: "0", to: "8" },
      { from: "0", to: "91" },
      { from: "8", to: "2" },
      { from: "4", to: "6" },
      { from: "7", to: "6" },
      { from: "8", to: "2" },
      { from: "1", to: "1" },
      { from: "5", to: "4" },
    ]);


    }, // END SETUP
    function (test) {
      if (!TestCollection.RunSlowTests) {
        test.log("***!!!???@@@ skipping font tests");
        return;
      }
      var diagram = test.diagram;
      var d = diagram;

//PRELOADED VALUES
   var MasterHeight = [42.98125, 96.7078125, 42.98125, 38.573437500000004, 14.3, 42.575, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 14.3, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 9.1, 42.98125, 42.98125, 42.98125, 42.98125, 6.5, 6.5, 14.3, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 314.6, 14.3, 257.40000000000003, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125, 6.5, 21.46142578125, 21.46142578125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 21.46142578125, 42.98125, 50, 515.7750000000001, 21.46142578125, 6.5, 21.46142578125, 21.46142578125, 21.46142578125, 429.8125, 21.46142578125, 3412.36669921875, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125, 21.46142578125];
  var MasterWidth = [410.611328125, 928.431640625, 410.611328125, 365.6923828125, 136, 410.396484375, 410.611328125, 410.611328125, 410.611328125, 404.671875, 500.947265625, 2014.046875, 2089.53125, 404.671875, 404.671875, 404.671875, 404.671875, 404.671875, 404.671875, 150, 595.2783203125, 435.4892578125, 832.771484375, 704.35546875, 557.0185546875, 423.7265625, 156, 595.2783203125, 435.4892578125, 832.771484375, 704.35546875, 99, 72, 259, 124, 598, 193, 342, 156, 191, 1342, 161, 1771, 161, 110, 57, 240, 69, 55, 161, 10, 125, 93, 70, 82, 196, 283, 108, 161, 161, 161, 161, 161, 169, 161, 111.88037109375, 194.2705078125, 242.74072265625, 274.517578125, 274.517578125, 274.517578125, 529.1015625, 488.09619140625, 312.6005859375, 161.2529296875, 488.09619140625, 488.09619140625, 488.09619140625, 488.09619140625, 488.09619140625, 488.09619140625, 488.09619140625, 50, 50, 488.09619140625, 488.09619140625, 488.09619140625, 488.09619140625, 500, 65, 488.09619140625, 50, 38.14453125, 343.30078125, 38.14453125, 178.0078125, 178.0078125, 178.0078125, 178.0078125, 178.0078125];

var MasterHeight2 = [42.98125, 96.7078125, 42.98125, 38.573437500000004, 14.3, 42.575, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 42.98125, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 42.98125, 14.3, 14.3, 14.3, 14.3, 14.3, 9.1, 42.98125, 14.3, 14.3, 14.3, 6.5, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 314.6, 14.3, 257.40000000000003, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 21.46142578125, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 50, 114.4, 14.3, 14.3, 14.3, 14.3, 14.3, 71.5, 14.3, 1372.8000000000002, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.3];

var MasterWidth2 = [410.611328125, 928.431640625, 410.611328125, 365.6923828125, 136, 410.396484375, 410.611328125, 410.611328125, 410.611328125, 404.671875, 500.947265625, 2014.046875, 2089.53125, 404.671875, 150, 150, 150, 150, 150, 150, 595.2783203125, 165, 327, 276, 216, 161, 156, 595.2783203125, 165, 327, 276, 99, 161, 259, 124, 598, 193, 342, 156, 191, 1342, 161, 1771, 161, 110, 57, 240, 69, 55, 161, 10, 125, 93, 70, 82, 196, 283, 108, 161, 161, 161, 161, 161, 169, 161, 111.88037109375, 109, 138, 161, 161, 161, 301, 282, 180, 88, 282, 282, 282, 282, 282, 282, 282, 50, 50, 282, 282, 282, 282, 500, 65, 282, 50, 27, 243, 27, 119, 119, 119, 119, 119];


var w = [];
var h = [];
  //for loop stuff

  var testIndex = 0;
  var testAmount = 99;

  for(testIndex = 0; testIndex <= testAmount; testIndex++)
  {

      //HEIGHT
      //I break it down into two parts
      var Htest1 = (diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height <= MasterHeight[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height >= MasterHeight[testIndex] - 260);
      var Htest2 = (diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height <= MasterHeight2[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height >= MasterHeight2[testIndex] - 260);
      var testHi = 0;

      if (Htest1 === true)
      {
        testHi = 1;
      }

      if (testHi === 1)
      {
        //test.assert("lets use test 1")
        test.assert(diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height <= MasterHeight[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height >= MasterHeight[testIndex] - 260)

      } else {
        //test.assert("lets use test 2")
        test.assert(diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height <= MasterHeight2[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.height >= MasterHeight2[testIndex] - 260)

      }

   //WIDTH
      var Wtest1 = (diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width <= MasterWidth[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width >= MasterWidth[testIndex] - 260);
      var Wtest2 = (diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width <= MasterWidth2[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width >= MasterWidth2[testIndex] - 260);
      var testHi2 = 0;

      if (Wtest1 === true)
      {
        testHi2 = 1;
      }

      if (testHi2 === 1)
      {
        //test.assert("lets use test 1")
        test.assert(diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width <= MasterWidth[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width >= MasterWidth[testIndex] - 260)

      } else {
        //test.assert("lets use test 2")
        test.assert(diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width <= MasterWidth2[testIndex] + 260  && diagram.findNodeForKey(testIndex).findObject('TEXT').actualBounds.width >= MasterWidth2[testIndex] - 260)
}
  }
    }, // END TEST
    null
));



//Test for ellipses, also acts as a regression test for C23268
txtblocks.add(new Test('ensure ellipses', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate = go.GraphObject.make( go.Node, "Auto", {
          width: 80,
          height: 100
        },
        go.GraphObject.make( go.Panel, "Auto", {
            name: "SHAPE"
          },
          go.GraphObject.make( go.Shape, "RoundedRectangle",
            new go.Binding( "fill", "background" ) ),
          go.GraphObject.make( go.Panel, "Vertical", {
            width: 50,
            height: 100
           },
            go.GraphObject.make( go.TextBlock, {
                name: "display",
                background: 'lime',
                overflow: go.TextBlock.OverflowEllipsis
              },
              new go.Binding( "height"),
              new go.Binding( "maxLines"),
              new go.Binding( "text", "name" ),
              new go.Binding( "stroke", "fontColor" )
            )
          ) )
      );

      diagram.model = go.GraphObject.make( go.GraphLinksModel );
      diagram.model.nodeDataArray = [{
        key: 1,
        name: "a b c d e f g h i j k l m n o p q",
        height: 60, maxLines: 1
      }, {
        key: 2,
        name: "a b c d e f g h i j k l m n o p q",
        height: 60, maxLines: 2
      }, {
        key: 3,
        name: "a b c d e f g h i j k l m n o p q",
        maxLines: 2 }
      ];


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.startTransaction();
      diagram.commitTransaction();

      test.assert(diagram.findNodeForKey(1).findObject('display').metrics.arrText[0].indexOf('...') !== -1); // ellipses on first line
      test.assert(diagram.findNodeForKey(2).findObject('display').metrics.arrText[1].indexOf('...') !== -1); // second line
      test.assert(diagram.findNodeForKey(3).findObject('display').metrics.arrText[1].indexOf('...') !== -1); // second line
    }, // END TEST
    null
));



txtblocks.add(new Test('ensure ellipses 2', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate = go.GraphObject.make( go.Node, "Auto", {
          width: 80,
          height: 100
        },
        go.GraphObject.make( go.Panel, "Auto", {
            name: "SHAPE"
          },
          go.GraphObject.make( go.Shape, "RoundedRectangle",
            new go.Binding( "fill", "background" ) ),
          go.GraphObject.make( go.Panel, "Vertical", {
            width: 50,
            height: 100
           },
            go.GraphObject.make( go.TextBlock, {
                name: "display",
                background: 'lime',
                overflow: go.TextBlock.OverflowEllipsis
              },
              new go.Binding( "wrap"),
              new go.Binding( "width"),
              new go.Binding( "height"),
              new go.Binding( "maxLines"),
              new go.Binding( "text", "name" ),
              new go.Binding( "stroke", "fontColor" )
            )
          ) )
      );



      diagram.model = go.GraphObject.make( go.GraphLinksModel );
      diagram.model.nodeDataArray = [
      {
        key: 1,
        name: "a b c d e f g h i j k l m n o p q",
        width: 60, maxLines: 1
      },
      {
        key: 2,
        name: "a b c d e f g h i j k l m n o p q",
        width: 60
      },
      {
        key: 3,
        name: "a b c d e f g h i j k l m n o p q",
        width: 60, wrap: go.TextBlock.None
      }
      ];

      diagram.startTransaction();
      diagram.commitTransaction();

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      test.assert(diagram.findNodeForKey(1).findObject('display').metrics.arrText[0].indexOf('...') !== -1); // ellipses on first line

      test.assert(diagram.findNodeForKey(2).findObject('display').metrics.arrText[0].indexOf('...') === -1); // has no ellipses
      test.assert(diagram.findNodeForKey(2).findObject('display').metrics.arrText[1].indexOf('...') === -1); // has no ellipses
      test.assert(diagram.findNodeForKey(2).findObject('display').metrics.arrText[2].indexOf('...') === -1); // has no ellipses

      test.assert(diagram.findNodeForKey(3).findObject('display').metrics.arrText[0].indexOf('...') !== -1); // first line
    }, // END TEST
    null
));

txtblocks.add(new Test('ellipses on each line', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate = go.GraphObject.make( go.Node, "Vertical", {

           },
            go.GraphObject.make( go.TextBlock, {
                name: "display",
                background: 'lime',
                overflow: go.TextBlock.OverflowEllipsis
              },
              new go.Binding( "wrap"),
              new go.Binding( "width"),
              new go.Binding( "height"),
              new go.Binding( "maxLines"),
              new go.Binding( "text", "name" ),
              new go.Binding( "stroke", "fontColor" )
            )
      );

      diagram.model = go.GraphObject.make( go.GraphLinksModel );
      diagram.model.nodeDataArray = [
        {
          key: 1,
          name: "a b c d e f g h i j k l m n o p q\na b c d e f g h i j k l m n o p q\na b c d e f g h i j k l m n o p q\na b c d e f g h i j k l m n o p q\na b c d e f g h i j k l m n o p q\n",
          width: 60, maxLines: 4, wrap: go.TextBlock.None
        }
      ];

      diagram.startTransaction();
      diagram.commitTransaction();
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      // ellipses on first 4 lines
      var nodemetrics = diagram.findNodeForKey(1).findObject('display').metrics
      test.assert(nodemetrics.arrText[0].indexOf('...') !== -1);
      test.assert(nodemetrics.arrText[1].indexOf('...') !== -1);
      test.assert(nodemetrics.arrText[2].indexOf('...') !== -1);
      test.assert(nodemetrics.arrText[3].indexOf('...') !== -1);
      // only 4 lines
      test.assert(nodemetrics.arrText.length === 4);
    }, // END TEST
    null
));

// this tests:
//  var lastline = Math.min(this.maxLines - 1, Math.max(Math.floor((h / fheight)) - 1, 0));
// which caused some floating number problems, eliminating the last line
txtblocks.add(new Test('ensuring last line', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate =
          $( go.Node, 'Vertical',
              $( go.TextBlock, {
                      overflow: go.TextBlock.OverflowEllipsis
                  },
                  new go.Binding( 'text', 'text', function(value){
                      return value = value.split('').join('\n');
                  } )
              )
          );

      diagram.model = new go.GraphLinksModel( [ {
          key: 1,
          text: "abcdefg",
          align: "left"
      } ] );
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      // make sure the last line is not "f..."
      test.assert(diagram.nodes.first().elt(0).metrics.arrText[5] === 'f');
    }, // END TEST
    null
));

// line width was using the last line instead of the max of all lines when wrapping === none
txtblocks.add(new Test('line width', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
        $(go.Node, "Auto",
          $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            {         wrap: go.TextBlock.None,
          font: 'normal normal bold 17px Arial' },
            new go.Binding("text", "key"))
        );

      diagram.model = new go.GraphLinksModel(
      [
        { key: "node1 \n text \n \n more text \n d", color: "lightblue" },
      ], [ ]);

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      test.assert(diagram.nodes.first().actualBounds.width > 25);
    }, // END TEST
    null
));

function getPanel(lenght) {
  var $ = go.GraphObject.make;  // for conciseness in defining templates

  return $(go.Panel, "Vertical", {
    background: '#00aa00',
    alignment: go.Spot.Center,
    padding: new go.Margin(10, 10, 10, 10),
    maxSize: new go.Size(620, 60),
    minSize: new go.Size(10, 10),
  },
    $(go.TextBlock,
      {
        text: getStrByLength(lenght), // 129
        // alignment: go.Spot.Center,
        name: 'some name',
        editable: true,
        isMultiline: false,
        maxLines: 1,
        maxSize: new go.Size(260, 36),
        minSize: new go.Size(10, 10),
        background: '#ff00ff',
        textAlign: 'center',
        // margin: new go.Margin(0, 10, 0, 20),
        overflow: go.TextBlock.OverflowEllipsis
      }
    )
  )
}

function getStrByLength(lenght) {
  var prepend = lenght + '_symbols_';
  var str = prepend;
  for (var i = 0; i < (lenght - prepend.length); i++) {
    str = str + 's';
  }
  return str;
}
txtblocks.add(new Test('max width', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.add(
      $(go.Part, "Vertical", {
      },
        getPanel(12),
        getPanel(50),
        getPanel(78),
        getPanel(79),
        getPanel(122),
        getPanel(125),
        getPanel(129),
        getPanel(150),
        getPanel(1200)
      )
    );
  }, // END SETUP
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    test.assert(diagram.parts.first().actualBounds.width === 280);
  }, // END TEST
  null
));

txtblocks.add(new Test('wrap size', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.add(
      $(go.Node, "Vertical",
        { position: new go.Point(250, 0), width: 220, background: "lightgray" },
        $(go.TextBlock, { font: '50px sans-serif', text: "string1 string2", background: "lightgreen", margin: 0 })
      ));
  }, // END SETUP
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    test.assert(d.nodes.first().elt(0).actualBounds.width < 220)
  }, // END TEST
  null
));


txtblocks.add(new Test('wrap lines', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Auto",
       { resizable: true, width: 147, height: 123 }, // change width to 113
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, font: '50px sans-serif' },
          new go.Binding("text", "key"))
      );
    diagram.model = new go.GraphLinksModel( [ { key: "Beta", color: "orange" } ], [ ]);
  }, // END SETUP
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    var node = d.nodes.first();
    var txt = d.nodes.first().elt(1);

    test.assert(txt.metrics.arrSize.length === 1);
    test.assert(txt.metrics.arrText.length === 1);
    test.assert(txt.metrics.arrText[0] === 'Beta');
    var max = txt.metrics.maxLineWidth;
    d.commit(function() {
      node.width = 113;
    });
    test.assert(txt.metrics.arrSize.length === 2);
    test.assert(txt.metrics.arrText.length === 2);
    test.assert(txt.metrics.arrText[0] === 'Bet');
    test.assert(txt.metrics.arrText[1] === 'a');
    test.assert(txt.metrics.maxLineWidth < max); // smaller than it used to be
  }, // END TEST
  null
));

/*
Ensure text wraps:

  BetA

becomes:

  B
  et
  A

*/
txtblocks.add(new Test('wrap lines 2', null,
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    diagram.reset();
    diagram.nodeTemplate =
      $(go.Node, "Auto",
       { resizable: true, width: 172, height: 237 }, // change width to 72 = bad
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0 },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, font: '50px sans-serif' },
          new go.Binding("text", "key"))
      );

    diagram.model = new go.GraphLinksModel( [ { key: "BetA", color: "orange" } ], [ ]);
  }, // END SETUP
  function (test) {
    var diagram = test.diagram;
    var d = diagram;
    var node = d.nodes.first();
    var txt = d.nodes.first().elt(1);

    test.assert(txt.metrics.arrSize.length === 1);
    test.assert(txt.metrics.arrText.length === 1);
    test.assert(txt.metrics.arrText[0] === 'BetA');
    var max = txt.metrics.maxLineWidth;
    d.commit(function() {
      node.width = 72;
    });
    test.assert(txt.metrics.arrSize.length === 3);
    test.assert(txt.metrics.arrText.length === 3);
    test.assert(txt.metrics.arrText[0] === 'B');
    test.assert(txt.metrics.arrText[1] === 'et');
    test.assert(txt.metrics.arrText[2] === 'A');
    test.assert(txt.metrics.maxLineWidth < max); // smaller than it used to be
  }, // END TEST
  null
));


txtblocks.add(new Test('Formatting', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();
      diagram.nodeTemplate =
      new go.Node("Auto")
        .add(new go.Shape("RoundedRectangle", { strokeWidth: 0 })
          .bind("fill", "color"))
        .add(new go.TextBlock({ margin: 1 })
          .bind("formatting")
          .bind("text"))

      diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: "    Format    ", formatting: go.TextBlock.FormatNone, color: "lightblue" },
        { key: 2, text: "    Format",  formatting: go.TextBlock.FormatNone, color: "orange" },
        { key: 3, text: "Format    ",  formatting: go.TextBlock.FormatNone, color: "orange" },
        { key: 4, text: "Format    ",  formatting: go.TextBlock.FormatTrim, color: "orange" },
        { key: 5, text: "    Format", formatting: go.TextBlock.FormatTrim, color: "lightgreen" },
        { key: 6, text: "    Format    ", color: "pink" }
      ],
      [
      ]);
    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

      var key1 = diagram.findNodeForKey(1);
      var key2 = diagram.findNodeForKey(2);
      var key3 = diagram.findNodeForKey(3);
      var key4 = diagram.findNodeForKey(4);
      var key5 = diagram.findNodeForKey(5);
      var key6 = diagram.findNodeForKey(6);

      // 1 should be wider than all, and the first 3 wider than the last 3
      test.assert(key1.actualBounds.width > key2.actualBounds.width);
      test.assert(key1.actualBounds.width > key3.actualBounds.width);
      test.assert(key2.actualBounds.width > key4.actualBounds.width);
      test.assert(key2.actualBounds.width > key5.actualBounds.width);
      test.assert(key2.actualBounds.width > key6.actualBounds.width);
      // Trim formats should all ===
      test.assert(key4.actualBounds.width === key5.actualBounds.width);
      test.assert(key6.actualBounds.width === key6.actualBounds.width);

    }, // END TEST
    null
));

// ensure isOverflowed
txtblocks.add(new Test('isOverflowed', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

      diagram.nodeTemplate = new go.Node('Vertical', { width: 30 })
      .add(
        new go.Shape('RoundedRectangle', {
          strokeWidth: 0,
          fill: 'white',
          width: 50,
          height: 20,
        }).bind('fill', 'color')
      )
      .add(
        new go.TextBlock({
          name: 'txt',
          maxLines: 1,
          font: 'bold 14px sans-serif',
          stroke: '#333',
        })
          .bind('text')
          .bind('width')
          .bind('maxLines')
          .bind('overflow')
          .bind('wrap')
      );

      diagram.model = new go.GraphLinksModel(
      [
        // First clipped (parent width)
        { key: 1, text: 'Alpha', color: 'lightblue' },
        { key: 2, text: 'B', color: 'orange' },
        // Max Lines: No clip
        { key: 3, maxLines: 5, text: 'Alpha', color: 'lightblue' },
        { key: 4, maxLines: 5, text: 'B', color: 'orange' },
        // First clipped (self width)
        { key: 5, maxLines: 1, width: 15, text: 'Alpha', color: 'lightblue' },
        { key: 6, maxLines: 1, width: 15, text: 'B', color: 'orange' },
        // First clipped (ellipses)
        { key: 7, maxLines: 1, width: 15, overflow: go.TextBlock.OverflowEllipsis, text: 'Alpha', color: 'lightblue' },
        { key: 8, maxLines: 1, width: 15, overflow: go.TextBlock.OverflowEllipsis, text: 'B', color: 'orange' },
        // First clipped (ellipses two lines)
        { key: 9, maxLines: 2, width: 20, overflow: go.TextBlock.OverflowEllipsis, text: 'Alpha', color: 'lightblue' },
        { key: 10, maxLines: 1, width: 20, overflow: go.TextBlock.OverflowEllipsis, text: 'Be', color: 'orange' },
        // First clipped (wrap NONE ellipses multiline)
        { key: 11, wrap: go.TextBlock.None, maxLines: 3, width: 25, overflow: go.TextBlock.OverflowEllipsis, text: 'Alpha\nAl', color: 'lightblue', },
        { key: 12, wrap: go.TextBlock.None, maxLines: 3, width: 25, overflow: go.TextBlock.OverflowEllipsis, text: 'Be\nBe', color: 'orange', },
      ],
      []
      );


    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.startTransaction();
      diagram.commitTransaction();
      diagram.nodes.each(function (n) {
      if (n.findObject('txt').isOverflowed) n.background = 'lime';
      });
      test.assert(diagram.findNodeForKey(1).background === 'lime');
      test.assert(diagram.findNodeForKey(2).background !== 'lime');
      // no clip
      test.assert(diagram.findNodeForKey(3).background !== 'lime');
      test.assert(diagram.findNodeForKey(4).background !== 'lime');

      test.assert(diagram.findNodeForKey(5).background === 'lime');
      test.assert(diagram.findNodeForKey(6).background !== 'lime');

      test.assert(diagram.findNodeForKey(7).background === 'lime');
      test.assert(diagram.findNodeForKey(8).background !== 'lime');

      test.assert(diagram.findNodeForKey(9).background === 'lime');
      test.assert(diagram.findNodeForKey(10).background !== 'lime');

      test.assert(diagram.findNodeForKey(11).background === 'lime');
      test.assert(diagram.findNodeForKey(12).background !== 'lime');
    }, // END TEST
    null
));

/*

txtblocks.add(new Test('TESTNAME', null,
    function (test) {
      var diagram = test.diagram;
      var d = diagram;
      diagram.reset();

    }, // END SETUP
    function (test) {
      var diagram = test.diagram;
      var d = diagram;

    }, // END TEST
    null
));


*/


})();