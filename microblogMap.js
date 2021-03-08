MicroblogMap = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = [42.22717, 93.33772];
    this.zoomLevel = 13

    this.initVis();
}

MicroblogMap.prototype.initVis = function() {
    var vis = this;

    vis.map =  L.map(this.parentElement).setView(vis.mapPosition, vis.zoomLevel);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

    $.getJSON('cse557_option1_microblogs.json', (jsonData) => {
        vis.data = jsonData;
        console.log(jsonData);
        let locations = jsonData.location;
        console.log(locations[0]);
        vis.updateVis();
    });

}

MicroblogMap.prototype.updateVis = function() {
    var vis = this;

    microblogs = L.layerGroup().addTo(vis.map);
    let locations = vis.data.location;
    num_data = Object.keys(locations).length;

    let dates = vis.data.post_date_time;
    let microblog_text = vis.data.text;
    let user = vis.data.user_id;

    for (var i = 0; i < 100; i++) {
        loc = locations[i].split(" ");
        let latitude = loc[0];
        let longitude = loc[1];
        let post_text = microblog_text[i];
        console.log(latitude)

        var post = L.marker([latitude, longitude]).bindPopup(post_text)
        microblogs.addLayer(post);

    }
}