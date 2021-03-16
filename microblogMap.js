
function MicroblogMap(_parentElement, _timeline, _data, _start, _end) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = [42.22717, 93.33772];
    this.zoomLevel = 12;
    this.startDate = _start;
    this.endDate = _end;
    this.markers = [];
    this.timeline = _timeline
    this.imageBounds = [[42.3017, 93.5673],[42.1609, 93.1923]]
    this.initVis();
}

MicroblogMap.prototype.initVis = function() {
    var vis = this;

    vis.map =  L.map(this.parentElement).setView(vis.mapPosition, vis.zoomLevel);

    L.imageOverlay('a3_data/Vastopolis_Map.png', vis.imageBounds).addTo(vis.map);

    $.getJSON('cse557_option1_sick_microblogs_sampled.json', (jsonData) => {
        vis.sampled_ids = jsonData;
        vis.updateVis(vis.startDate, vis.endDate);
    });


    

}

MicroblogMap.prototype.checkDate = function(date, start, end) {

    start = start.split("/");
    end = end.split("/");

    let start_day = parseInt(start[1]);
    let start_month = parseInt(start[0]);
    let start_year = parseInt(start[2]);

    let end_day = parseInt(end[1]);
    let end_month = parseInt(end[0]);
    let end_year = parseInt(end[2]);

    let date_split = date.split(" ");
    let month_day_year = date_split[0].split("/");
    let month = parseInt(month_day_year[0]);
    let day = parseInt(month_day_year[1]);
    let year = parseInt(month_day_year[2]);

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

MicroblogMap.prototype.clearMarker = function(id) {
    var vis = this;
}

MicroblogMap.prototype.createMarker = function(point) {
    var vis = this;
    var id = point.id;
    // if (vis.markers.length >= 1) {
    //     id = vis.markers[vis.markers.length-1]._id + 1;
    // }

    var form = L.DomUtil.create('form', 'my-form');
    form.innerHTML = '<p>' + point.post_text + '</p>';


    var btn = L.DomUtil.create('button', 'my-button', form);
    let timelineBtn = L.DomUtil.create('button', 'create-button', form);
    btn.textContent = 'Remove Marker';
    timelineBtn.textContent="Add to Timeline"

    btn.onclick = function(e) {
        var new_markers = [];
        vis.markers.forEach(function(marker) {
            if (marker._id == point.id) {
                vis.map.removeLayer(marker);
            }
            else {
                new_markers.push(marker);
            }

        });

        vis.markers = new_markers;
    }
    timelineBtn.onclick = function(e) {
        vis.timeline.addData(point)
    }

    let marker = L.marker([point.latitude, point.longitude], {
        draggable: false
    });

    marker._id = id

    var myPopup = marker.bindPopup(form, {
        closeButton: false
    });

    vis.map.addLayer(marker);
    vis.markers.push(marker);

}


MicroblogMap.prototype.updateVis = function(start, end) {
    var vis = this;

    if (vis.map != null) {
        vis.map.remove();
        vis.map = null;
        vis.markers = [];
    }
    vis.map =  L.map(this.parentElement).setView(vis.mapPosition, vis.zoomLevel);

    L.imageOverlay('a3_data/Vastopolis_Map.png', vis.imageBounds).addTo(vis.map);

    vis.startDate = start;
    vis.endDate = end;

    // microblogs = L.layerGroup().addTo(vis.map);
    let samples = JSON.parse(vis.sampled_ids)
    let num_data = samples.length;

    let locations = vis.data.location;
    let dates = vis.data.post_date_time;
    let microblog_text = vis.data.text;
    let user = vis.data.user_id;

    for (var i = 0; i < num_data; i++) {
        let post_id = samples[i];
        let loc = locations[post_id].split(" ");
        let post_latitude = loc[0];
        let post_longitude = loc[1];
        let post_text = microblog_text[post_id];
        let user_id = user[post_id];
        // Split date information for when we have a timeline input
        let date = dates[post_id];
        let addToMap = vis.checkDate(date, start, end);
        
        if (addToMap == true) {
            let addObj = {id: post_id, latitude: post_latitude, longitude: post_longitude, post_text: post_text, user: user_id }
            vis.createMarker(addObj);
        }

    }
}