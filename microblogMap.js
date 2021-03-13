MicroblogMap = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    console.log(this.data)
    this.mapPosition = [42.22717, 93.33772];
    this.zoomLevel = 12

    this.initVis();
}

MicroblogMap.prototype.initVis = function() {
    var vis = this;

    vis.map =  L.map(this.parentElement).setView(vis.mapPosition, vis.zoomLevel);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vis.map);

    $.getJSON('cse557_option1_sick_microblogs_sampled.json', (jsonData) => {
        vis.sampled_ids = jsonData;
        vis.updateVis();
    });

}


MicroblogMap.prototype.updateVis = function() {
    var vis = this;

    microblogs = L.layerGroup().addTo(vis.map);
    samples = JSON.parse(vis.sampled_ids)
    num_data = samples.length;

    let locations = vis.data.location;
    let dates = vis.data.post_date_time;
    let microblog_text = vis.data.text;
    let user = vis.data.user_id;

    for (var i = 0; i < num_data; i++) {
        post_id = samples[i];
        loc = locations[post_id].split(" ");
        let latitude = loc[0];
        let longitude = loc[1];
        let post_text = microblog_text[post_id];
        
        // Split date information for when we have a timeline input
        let date = dates[post_id];
        date = date.split(" ");
        month_day_year = date[0].split("/");
        month = month_day_year[0];
        day = month_day_year[1];
        yar = month_day_year[2];
        hour_minute = date[1].split(":");
        hour = hour_minute[0];
        minute = hour_minute[1]


        var post = L.marker([latitude, longitude]).bindPopup(post_text)
        microblogs.addLayer(post);

    }
}