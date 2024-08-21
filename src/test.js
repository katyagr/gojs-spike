var myDiagram = new go.Diagram("myDiagramDiv");


var myRouter = new AvoidsLinksRouter();
myRouter.epsilonDistance = 1;
myRouter.linkSpacing = 10;

myDiagram.routers.add(myRouter)

myDiagram.layout = new go.LayeredDigraphLayout({
  columnSpacing: 70,
  layerSpacing: 70,
  direction: 90,
  setsPortSpots: false,
})

const tjunction = new go.Node("Vertical")
  .add(
    go.GraphObject.build("Button", {
      margin: 2,
      click: (_, button) => { nodeTB = button.findObject("label"); console.log(nodeTB.text); navigator.clipboard.writeText(nodeTB.text) },
      "ButtonBorder.fill": "white",
      "ButtonBorder.strokeWidth": 0,
    })
      .bind("height", "toLabel", (toLabel) => toLabel == "" ? 0 : "auto")
      .add(
        new go.TextBlock({ name: "label" })
          .bind("text"),
      ),
    new go.Shape({ width: 20, height: 20, figure: "diamond", portId: "" })
  )


const other = new go.Node("Spot", {
  locationSpot: go.Spot.Center,
  toSpot: go.Spot.AllSides, fromSpot: go.Spot.AllSides,
})
  .add(
    new go.Shape({ width: 200, height: 100 })
      .bind("figure", "category", (category) => (category === "GSP" ? "ChamferedRectangle" : category === "BSP" ? "Ellipse" : "Rectangle"))
      .bind("fill", "category", (category) => (category === "GSP" ? "darkgreen" : category === "BSP" ? "lightgreen" : "lightgrey")),
    new go.Panel("Vertical")
      .add(
        new go.TextBlock()
          .bind("text"),
        new go.Panel("Auto")
          .add(
            new go.Shape({ strokeWidth: 0, fill: "lightYellow" }),
            new go.TextBlock("Demand mva", { margin: 4 })
          ),
      )
  );

myDiagram.nodeTemplateMap.add("tjunction", tjunction)
myDiagram.nodeTemplateMap.add("", other)


myDiagram.linkTemplate =
  new go.Link({
    // curve: go.Curve.Bezier,
    // curviness: 40,
    // reshapable: true,
    //   relinkableFrom: true,
    //   relinkableTo: true,
    //   fromShortLength: 8,
    //   toShortLength: 10,

    routing: go.Link.AvoidsNodes,
    // routing: go.Link.Orthogonal,
    reshapable: true,
    adjusting: go.LinkAdjusting.Stretch,
    relinkableFrom: true,
    relinkableTo: true,
  })
    .add(
      new go.Shape()
        .bind('strokeDashArray', 'type', (type) => (type == "Underground" ? [5, 6] : []))
        .bind('stroke', 'voltage', (voltage) => voltage === 400 ? "blue" : voltage === 275 ? "red" : voltage === 132 ? "black" :
          voltage === 66 ? "green" : voltage === 33 ? "orange" : "grey"),
      new go.Panel({ segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN) })
        .add(
          // new go.Shape({ strokeWidth: 0, fill: "white", height: 15, width: 50 }),
          // new go.TextBlock({ margin: 2, name: "label" })
          // .bind("text", "fromLabel"),
          // new go.Panel("Vertical", { margin: 3 })
          //   .add(
          go.GraphObject.build("Button", {
            margin: 2,
            click: (_, button) => { nodeTB = button.findObject("label"); console.log(nodeTB.text); navigator.clipboard.writeText(nodeTB.text) },
            "ButtonBorder.fill": "white",
            "ButtonBorder.strokeWidth": 0,
            // mouseHover: (e, obj) => {
            //   console.log(obj.part);
            //   var node = obj.part;
            //   x = node.findObject("label")
            //   console.log(x)
            //   a.adornedObject = x;
            //   console.log(a)
            //   node.addAdornment('mouseHover', a);
            // },

          })
            .bind("height", "fromLabel", (fromLabel) => fromLabel == "" ? 0 : "auto")
            .add(
              new go.TextBlock({
                name: "label",
                tooltip: go.GraphObject.build("ToolTip")
                  .add(
                    new go.Shape(),
                    // new go.TextBlock("test", { margin: 4 })
                  )
              })
                .bind("text", "fromLabel"),
            )
        ),
      new go.Panel({ segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN), selectionObjectName: "nodeName" })
        .add(
          go.GraphObject.build("Button", {
            margin: 2,
            click: (_, button) => { nodeTB = button.findObject("label"); console.log(nodeTB.text); navigator.clipboard.writeText(nodeTB.text) },
            "ButtonBorder.fill": "white",
            "ButtonBorder.strokeWidth": 0,
          })
            .bind("height", "toLabel", (toLabel) => toLabel == "" ? 0 : "auto")
            .add(
              new go.TextBlock({ name: "label" })
                .bind("text", "toLabel"),
            )
        ),
      new go.Shape("Circle", { width: 10, segmentIndex: -1 })
        .bind("height", "toLabel", (toLabel) => toLabel == "" ? 0 : 10),
      new go.Shape("circle", { width: 10, segmentIndex: 0 })
        .bind("height", "fromLabel", (fromLabel) => fromLabel == "" ? 0 : 10),
      new go.Panel("Vertical")
        .add(
          new go.Panel("Auto")
            .add(
              new go.Shape({ strokeWidth: 0, fill: "lightblue" }),
              new go.TextBlock({ margin: 2 })
                .bind("text", "winterRating"),
            ),
          new go.Panel("Auto")
            .add(
              new go.Shape({ strokeWidth: 0, fill: "white" }),
              new go.TextBlock({ margin: 2 })
                .bind("text", "circuitLength"),
            )
        ),
    )


var data

fetch("ukpn.json")
  .then(response => response.json())
  .then(json => data = json)

handleChange = (elem) => {
  gsp = elem.value
  nodes = []
  edges = []
  for (const node of data.nodes) {
    if (node.gspAreas.includes(gsp)) { nodes.push(node) }
  }
  for (const edge of data.edges) {
    if (edge.gspAreas.includes(gsp)) { edges.push(edge) }
  }
  myDiagram.model = new go.GraphLinksModel(nodes, edges)
}

// myDiagram.model = new go.GraphLinksModel(

// BARKING GRID
// [
// { key: 0, text: "Barking Grid 132kV GSP", voltage: "132KV", type: "GSP" },
// { key: 1, text: "Barking 132kV", voltage: "132KV", type: "switch" },
// { key: 2, text: "Crowlands Grid 33kV BSP", voltage: "33KV", type: "BSP" }
// ],
//   [
//     { from: 0, to: 1, fromLabel: "BARG11", toLabel: "BARK11", text: "132 kV - 205.54 MVA - 0.176 km" },
//     { from: 2, to: 1, fromLabel: "CROW11", toLabel: "BARK11", text: "132 kV - 108.83 MVA - 9.024 km" },
//     { from: 2, to: 1, fromLabel: "CROW12", toLabel: "BARK11", text: "132 kV - 108.83 MVA - 9.066 km" }
//   ]

// EATON SOCON
//   [
//     { key: 0, text: "Eaton Socon Grid 132kV GSP", voltage: "132kV", category: "GSP" },
//     { key: 1, text: "Little Barford 132kV", voltage: "132kV", category: "switch" },
//     { key: 2, text: "LBGS1F", category: "tjunction" },
//     { key: 3, text: "HUNT1B", category: "tjunction" },
//     { key: 4, text: "ESLS1A", category: "tjunction" },
//     { key: 5, text: "Corby Grid 132kV GSP", voltage: "132kV", category: "GSP" },
//     { key: 6, text: "HUNT1A", category: "tjunction" },
//     { key: 7, text: "Huntingdon Grid 33kV BSP", voltage: "33kV", category: "BSP" },
//     { key: 8, text: "Little Barford 11kV BSP", voltage: "11kV", category: "BSP" },
//     { key: 9, text: "Little Barford 132kV GIS", voltage: "132kV", category: "switch" }
//   ],
//   [
//     { from: 3, to: 4, fromLabel: "", toLabel: "", underground: true, voltage: 132, winterRating: "155.24 MVA", circuitLength: "3.760 km" },
//     { from: 0, to: 4, fromLabel: "EATO11", toLabel: "", voltage: 132, winterRating: "155.24 MVA", circuitLength: "8.255 km" },
//     { from: 3, to: 5, toLabel: "CORG10", fromLabel: "", voltage: 132, winterRating: "108.83 MVA", circuitLength: "32.869 km" },
//     { from: 6, to: 5, toLabel: "CORG10", fromLabel: "", voltage: 132, winterRating: "108.83 MVA", circuitLength: "32.868 km" },
//     { from: 0, to: 6, fromLabel: "EATO12", toLabel: "", voltage: 132, winterRating: "155.24 MVA", circuitLength: "12.015 km" },
//     { from: 7, to: 3, fromLabel: "HUNT12", toLabel: "", voltage: 132, winterRating: "186.79 MVA", circuitLength: "11.024 km" },
//     { from: 7, to: 6, fromLabel: "HUNT11", toLabel: "", voltage: 132, winterRating: "186.79 MVA", circuitLength: "11.008 km" },
//     { from: 0, to: 1, toLabel: "LBGD11", fromLabel: "EATO11", voltage: 132, winterRating: "218.80 MVA", circuitLength: "2.540 km" },
//     { from: 0, to: 1, toLabel: "LBGD11", fromLabel: "EATO12", voltage: 132, winterRating: "218.80 MVA", circuitLength: "2.590 km" },
//     { from: 1, to: 8, fromLabel: "LBGD11", toLabel: "LBGD1A", voltage: 132, winterRating: "99.45 MVA", circuitLength: "0.090 km" },
//     { from: 1, to: 8, fromLabel: "LBGD11", toLabel: "LBGD1B", voltage: 132, winterRating: "108.83 MVA", circuitLength: "0.056 km" },
//     { from: 0, to: 9, toLabel: "LBGS11", fromLabel: "EATO13", voltage: 132, winterRating: "185.19 MVA", circuitLength: "2.500 km" },
//     { from: 9, to: 2, fromLabel: "LBGS12", toLabel: "", voltage: 132, winterRating: "185.19 MVA", circuitLength: "0.268 km" },
//     { from: 9, to: 1, fromLabel: "LBGS11", toLabel: "LBGD11", voltage: 132, winterRating: "272.30 MVA", circuitLength: "0.030 km" }
//   ]
// )
