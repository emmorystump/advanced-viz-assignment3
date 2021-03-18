
function Timeline(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}
Timeline.prototype.initVis = function () {
	var vis = this; // read about the this
	vis.margin = {top: 0, right: 60, bottom: 30, left: 60};
	vis.width = 2000 - vis.margin.left - vis.margin.right,
    vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
	    .attr("width", vis.width + vis.margin.left + vis.margin.right)
	    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


// Scales and axes
vis.dateToString = d3.timeFormat('%Y-%m-%dT%H:%M:%S')
 vis.timeFormatter = d3.timeParse('%Y-%m-%dT%H:%M:%S');
  let domain = [vis.timeFormatter('2011-04-30T00:00:00'), vis.timeFormatter('2011-05-21T00:00:00')]
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(domain)
        .nice()

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);


  // TO-DO: Initialize brush component
  // Initialize time scale (x-axis)
var xContext = d3.scaleTime()
.range([0, vis.width])
.domain(domain);

// Initialize brush component
// var brush = d3.brushX()
// .extent([[0, 0], [vis.width, vis.height]])
// .on("brush", brushed);


  // TO-DO: Append brush component here
// vis.svg.append("g")
//       .attr("class", "x brush")
//       .call(brush)
//     .selectAll("rect")
//       .attr("y", -6)
//       .attr("height", vis.height + 7);

  vis.svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + vis.height + ")")
      .call(vis.xAxis);
  vis.updateVis()

}

Timeline.prototype.addData = function(point) {
  let vis = this;
  
  let pointDate = new Date(point.date);

  // let newDatum = {times: [{"starting_time": pointDate, "display":"circle"}, ]}
  let convertedDate = pointDate/100000000000
  point.date = pointDate
  vis.data.push(point)
  vis.updateVis()




}

Timeline.prototype.wrangleData = function () {

  


}

Timeline.prototype.updateVis = function () {
    let vis = this
    var i = 0;

  
    var nodes = vis.svg.selectAll(".node")
        .data(vis.data)

    nodes.enter().append("circle")
        .attr("class", "node")
        .merge(nodes)
        .transition()
        .attr("cx", function(d){
          console.log(d)
            return vis.x(d.date)
        })
        .attr("cy", function(d, index){
            return 20
        })
        .attr("r", 5)
    
    // var chart = d3.timeline();
    // vis.svg.datum(vis.data).call(chart);


  // Compute the new tree layout.


}
