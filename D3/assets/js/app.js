var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(data){

    data.forEach(function(d){
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    //Creating scale functions
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty) * 0.8,
    d3.max(data, d => d.poverty) * 1.2])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Creating axes function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending Axes to the chart
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);


    //Creating circles
    var circles = chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".25");

    //Adding text to circles
    chart
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(w){return w.abbr})
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("text-anchor", 'middle')
    .attr("font-size", "12px")
    .attr("fill", "white");

    // Create axes labels
    var labels = chart.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    labels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .classed("active", true)
        .text("In Poverty(%)")
        .attr("fill", "blue");


    // append y axis
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .text("Lacks Health Care(%)")
        .attr("fill", "blue");
    
        
    //Creating Tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state}<br>Poverty: ${d.poverty}<br>Health Care: ${d.healthcare}`);
      });

    chart.call(toolTip);

    circles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

}).catch(function(error){
    console.log(error);
});