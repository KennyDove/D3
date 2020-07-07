// @TODO: YOUR CODE HERE!
var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 50,
  bottom: 70,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Chart holding
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Appending group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing data
var csvFile = "assets/data/data.csv"
d3.csv(csvFile)
  .then(function(newsData) {

    // Parse Data
    newsData.forEach(function(data) {
      data.poverty = +data.poverty
      data.healthcare = +data.healthcare;
    });

    // scaling 
    var xLinearScale= d3.scaleLinear()
      .domain([
        d3.min(newsData, d => d.poverty)*0.9, 
        d3.max(newsData, d => d.poverty)*1.1
      ])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([
        d3.min(newsData, d => d.healthcare)*0.9,
        d3.max(newsData, d => d.healthcare)*1.1
      ])
      .range([height, 0]);

    // axis 
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Appending Axis
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    
    chartGroup.append("g")
      .call(yAxis);

    // Creating Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue");

    // Adding State abbreviations
    chartGroup.selectAll()
      .data(newsData)
      .enter()
      .append("text")
      .text(d => (d.abbr))
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare)+4)
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("font-weight", "700")
      .style('fill', 'black');

    // Initialize tooltip
    var tooltip = d3.tip()
      .attr("class", "tooltip")
      .offset([35, -75])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Creating tooltip chart call
    chartGroup.call(tooltip);

    // Creating event listeners 
    circlesGroup.on("mouseover", function(d) {
      tooltip.show(d, this);
      d3.select(this).style("stroke", "black");
    })
      .on("mouseout", function(d) {
        tooltip.hide(d);
        d3.select(this).style("stroke", "white");
      });

    // Creating axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .style("font-weight", "400");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.0}, ${height + margin.top - 5})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .style("font-weight", "500");
  });