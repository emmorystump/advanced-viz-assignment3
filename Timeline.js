//Special thanks to this source: https://bl.ocks.org/d3noob/8375092
//

function Timeline(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
}
Timeline.prototype.initVis = function () {
  console.log(data)
    // let vis = this;
    // vis.margin = { top: 20, right: 120, bottom: 20, left: 120 },
    //     vis.width = 960 - vis.margin.right - vis.margin.left,
    //     vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // var i = 0;



    // vis.svg = d3.select("#" + this.parentElement).append("svg")
    //     .attr("width", vis.width + vis.margin.right + vis.margin.left)
    //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // vis.root = d3.hierarchy(treeData, function(d) { return d.children; });
    // vis.root.x0 = vis.height / 2;
    // vis.root.y0 = 0;
    // vis.tree = d3.tree()
    // .size([vis.height, vis.width]);

    // console.log("hello????")
    // vis.updateVis(vis.root);

}

Timeline.prototype.addData = function(point) {
  console.log(point)
}

Timeline.prototype.wrangleData = function () {



}

Timeline.prototype.updateVis = function (source) {
    let vis = this
    var i = 0;
  // Compute the new tree layout.
  var computeTreeData = vis.tree(vis.root);
  var nodes = computeTreeData.descendants()
  var links = computeTreeData.descendants().slice(1);

  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes...
  var node = vis.svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    // .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      // .style("fill", function(d) {
      //     return d._children ? "lightsteelblue" : "#fff";
      // });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function(d) {
          return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);
  // Transition to the proper position for the node
  nodeUpdate.transition()
    // .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);
}
