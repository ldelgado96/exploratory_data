/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
* APPLICATION STATE
* */
let state = {
 // + INITIALIZE STATE
};

/**
* LOAD DATA
* */
d3.json("../../data/flare.json", d3.autotype).then(data => {
 state.data = data;
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */

// Since we are trying to make circles, we are going to use the pack() function
function init() {
 const colorScale = d3.scaleOrdinal(d3.schemeSet3)

 const container = d3.select("#d3-container").style("position", "relative");

 svg = container
   .append("svg")
   .attr("width", width)
   .attr("height", height);

 tooltip = container
   .append("div")
   .style("position", "absolute")
   .style("top", 0)
   .style("left", 0)
   .style("background-color", "white")


   color = d3.scaleSequential([8, 0], d3.interpolateMagma)
// Use the hierarchy function to be able to create the object and see that we have a node class
 
  const pack = data => d3.pack()
 .size([width - 2, height - 2])
 .padding(5)
(d3.hierarchy(data)
 .sum(d => d.value)
 .sort((a, b) => b.value - a.value))

 const root = pack(state.data)
  
  const node = svg.selectAll("g")
  .data(d3.group(root.descendants(), d => d.height))
  .join("g")
    .attr("fill", "#fddde6")
  .selectAll("g")
  .data(d => d[1])
  .join("g")
  .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  node.append("circle")
  .attr("r", d=>d.r) 
  .attr("fill", d => color(d.height)) // have to define color spectrum before using it
  .attr("opacity", 0.25)
  .attr("stroke", "#aaaaaa")

  console.log(node)


 const leaves = d3.pack.descendants()

  // + CREATE YOUR GRAPHICAL ELEMENTS
  const leafGroup = svg.selectAll("g")
      .data(leaves)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
  

  // + ADD MOUSEOVER
  leafGroup.on("mouseenter", (event, d) => {
    statePack.hover = {
      position: [d.x, d.y],
      name: d.data.name,
      value: d.data.value,
      ancestorsPath: d.ancestors()
          .reverse()
          .map(d => d.data.name)
          .join("/")
  }
        draw()
      })
      //.on("mouseleave", () => {
      //  state.hover = null
      //  draw();
      //})

  draw(); // calls the draw function

    }

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function draw() {
  // check if there is something saved to `state.hover`
  if (state.hover) {
    tooltip
      .html(
        `
    <div>Name: ${state.hover.name}</div>
    <div>Value: ${state.hover.value}</div>
    <div>Hierarchy Path: ${state.hover.anscestorsPath}</div>
    `
      ).transition()
      .duration(500)
      .style("transform", `translate(${state.hover.position[0]}px, ${state.hover.position[1]}px )`)
  }

  // hide/show tooltip depending on whether state.hover exists
  // hint: look at the css to see what this is doing
  // ref: https://github.com/d3/d3-selection#selection_classed
  tooltip.classed("visible", state.hover)
}