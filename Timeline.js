
function Timeline(_parentElement, _data) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.initVis();
}
Timeline.prototype.initVis = function () {
  var vis = this; // read about the this
  vis.margin = { top: 0, right: 60, bottom: 30, left: 60 };
  vis.width = 2000 - vis.margin.left - vis.margin.right,
    vis.height = 400 - vis.margin.top - vis.margin.bottom;

  vis.div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
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

  vis.y = d3.scaleTime()
    .range([0, vis.height])
    .domain(domain)
    .nice()



  var xContext = d3.scaleTime()
    .range([0, vis.width])
    .domain(domain);


  vis.svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + vis.height + ")")
    .call(vis.xAxis);
  vis.updateVis()

}

Timeline.prototype.addData = function (point) {
  let vis = this;
  let pointDate = new Date(point.date);
  // let newDatum = {times: [{"starting_time": pointDate, "display":"circle"}, ]}
  let convertedDate = pointDate / 100000000000
  point.date = pointDate
  vis.data.push(point)
  vis.updateVis()




}

Timeline.prototype.wrangleData = function () {



}

Timeline.prototype.removePoint=function(point) {
  let vis= this
  let deletedItems = vis.data.splice(point)
  vis.updateVis()
}
//Help with tooltips: https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
Timeline.prototype.updateVis = function () {

  let vis = this
  var nodes = vis.svg.selectAll(".node")
    .data(vis.data)

  nodes.enter().append("circle")
    .attr("class", "node")
    .attr("cx", function (d) {
      console.log(d)
      return vis.x(d.date)
    })
    .on("click", function (event, d) {
      console.log(event.pageX + ", " + event.pageY)
      vis.div.html("<strong>" + 
      d.date + "</strong>" + "br" + "</br>" + 
      (d.latitude) + ", " + (d.longitude) + " br" + "<br/>" + (d.post_text)
      +"<br></br><button id='but1'>Remove point</button><br></br><button id='but2'>Close Tooltip</button>")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px")
        .style("opacity", 1);
        d3.select("#but1").on("click", function(){ 
          vis.removePoint(d)
          vis.div.html("")
          .style("opacity", 0)

         });
        d3.select("#but2").on("click", function(){ 
          vis.div.html("")
        .style("opacity", 0)

        });
    })
    .attr("cy", function (d) {
      return vis.y(d.date)
    })
    .attr("r", 10)
    let nodesRemove = nodes.exit().remove()


}
