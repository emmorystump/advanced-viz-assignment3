MicroblogMap = function(_parentElement, _data, _start, _end) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = [42.22717, 93.33772];
    this.zoomLevel = 12;
    this.startDate = _start;
    this.endDate = _end;

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
        vis.updateVis(vis.startDate, vis.endDate);
    });

    

}

MicroblogMap.prototype.checkDate = function(date, start, end) {

    start = start.split("/");
    end = end.split("/");

    start_day = parseInt(start[1]);
    start_month = parseInt(start[0]);
    start_year = parseInt(start[2]);

    end_day = parseInt(end[1]);
    end_month = parseInt(end[0]);
    end_year = parseInt(end[2]);

    date = date.split(" ");
    month_day_year = date[0].split("/");
    month = parseInt(month_day_year[0]);
    day = parseInt(month_day_year[1]);
    year = parseInt(month_day_year[2]);

    if (start_year < year && end_year > year) {
        return true;
    }
    
    if (start_year > year || end_year < year) {
        return false;
    }

    if (start_year == year && end_year == year) {

        if (start_month < month && end_month > month) {
            return true;
        }
        
        if (start_month > month || end_month < month) {
            return false;
        }

        if (start_month == month && end_month == month) {
            if (start_day <= day && end_day >= day) {
                return true;
            }

            return false;
        }

        if (start_month == month) {
            if (start_day <= day) {
                return true;
            }

            return false;
        }
    
        if (end_month == month) {
            if (end_day >= day) {
                return true;
            }

            return false;
        }
    }

    if (start_year == year) {
        if (start_month == month) {
            if (start_day <= day) {
                return true;
            }

            return false;
        }
        if (start_month < month) {
            return true;
        }
    }

    if (end_year == year) {
        if (end_month == month) {
            if (end_day >= day) {
                return true;
            }

            return false;
        }

        if (end_month > month) {
            return true;
        }

        return false;
    }

    return false;

}


MicroblogMap.prototype.updateVis = function(start, end) {
    var vis = this;

    vis.startDate = start;
    vis.endDate = end;

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
        addToMap = vis.checkDate(date, start, end);
        console.log(addToMap);


        
        if (addToMap == true) {
            console.log(dates[post_id]);
            var post = L.marker([latitude, longitude]).bindPopup(post_text)
            microblogs.addLayer(post);
        }

    }
}