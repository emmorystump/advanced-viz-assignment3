
function coallocationScreen(_parentElement, _data, _start, _end) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.startDate = _start;
    this.endDate = _end;
    this.displayData=[]
    this.initVis();
}

coallocationScreen.prototype.initVis = function () {
    var vis = this;
    console.log(vis.data)
    vis.wrangleData();

}

coallocationScreen.prototype.wrangleData=function() {
    let vis = this
    function checkValidity(element) {
        if (element[0]=="") {
            return false
        }
        return true
    }
    for (var key in vis.data) {
        let arr=vis.data[key]
        let result = arr.filter(checkValidity)
        vis.data[key] = result
    }
    vis.getNewDateAndUpdate(this.startDate, this.endDate)
}

coallocationScreen.prototype.getNewDateAndUpdate=function(start, end) {
    let vis = this
    vis.displayData=[]
    var startDate = new Date(start)
    var endDate = new Date(end)
    var loop = new Date(start);
    var timeFormatter = d3.timeFormat('%m/%d/%Y')
    let newData=[]
    console.log(startDate)
    console.log(endDate)
    if (start==end) {
        let key = timeFormatter(startDate)
        key = key.substring(1).trim()
        if (key.charAt(2)=='0') {
            key = key.slice(0,2) + key.slice(3)
        }
        let items = vis.data[key]
        for (var j = 0; j < items.length;++j) {
            newData.push(items[j])
        }
    }
    else {
    while(loop < endDate){
        let key = timeFormatter(loop)
        key = key.substring(1).trim()
        if (key.charAt(2)=='0') {
            key = key.slice(0,2) + key.slice(3)
        }
        let items = vis.data[key]
        for (var j = 0; j < items.length;++j) {
            newData.push(items[j])
        }
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }
}
    Array.prototype.push.apply(vis.displayData, newData)
    vis.displayData = vis.displayData.sort((a, b) => b[1] - a[1]);
    vis.updateVis(start,end)

}

coallocationScreen.prototype.updateVis = function (start, end) {
    let vis = this
    parent = document.getElementById(vis.parentElement)
    parent.innerHTML=''
    for (var i = 0; i < vis.displayData.length; ++i) {
        let newDiv = document.createElement("div")
        let content = document.createTextNode(i + ". "  + vis.displayData[i][0][0]+ ", " +vis.displayData[i][0][1]+ "  Frequency: " + vis.displayData[i][1])
        newDiv.appendChild(content)
        parent.appendChild(newDiv)
    }

}