
function MicroblogMap(_parentElement, _timeline, _data, _fileName, _start, _end) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = [42.22717, 93.33772];
    this.zoomLevel = 12;
    this.fileName = _fileName
    this.startDate = _start;
    this.endDate = _end;
    this.markers = [];
    this.timeline = _timeline
    this.maxZoom = 20;
    this.imageBounds = [[42.3017, 93.5673], [42.1609, 93.1923]]
    this.initVis();
}

MicroblogMap.prototype.initVis = function () {
    var vis = this;

    vis.map = L.map(this.parentElement, {
        preferCanvas: true,
    }).setView(vis.mapPosition, vis.zoomLevel);

    L.imageOverlay('a3_data/Vastopolis_Map.png', vis.imageBounds).addTo(vis.map);

    vis.map.on('zoomend', function (e) {
        console.log("zoom")
        vis.updateVis(vis.startDate, vis.endDate)
    });


    $.getJSON(vis.fileName, (jsonData) => {
        vis.sampled_ids = jsonData;
        vis.updateVis(vis.startDate, vis.endDate);
    });




}

MicroblogMap.prototype.changeDataSet = function (newFileName) {
    var vis = this
    vis.fileName = newFileName
    $.getJSON(vis.fileName, (jsonData) => {
        vis.sampled_ids = jsonData;
        vis.changeMapForDate(vis.startDate, vis.endDate);
    });

}

MicroblogMap.prototype.checkDate = function (date, start, end) {

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

MicroblogMap.prototype.clearMarker = function (id) {
    var vis = this;
}

MicroblogMap.prototype.createMarkerLayer = function (point) {
    let vis = this
    var form = L.DomUtil.create('form', 'my-form');
    var id = point.id;
    form.innerHTML = '<p>' + point.post_text + '</p>' + '<p>' + point.date + '</p>';

    let timelineBtn = L.DomUtil.create('button', 'create-button', form);
    timelineBtn.textContent = "Add to Timeline"
    timelineBtn.onclick = function (e) {
        vis.timeline.addData(point)
    }
    let latlng = L.latLng(point.latitude, point.longitude)

    let marker = L.circleMarker(latlng, {
        draggable: false,
        color: '#3388ff',
        fillColor: '#3388ff',
    });

    marker._id = id

    var myPopup = marker.bindPopup(form, {
        closeButton: false
    });
    vis.markers.push(marker);

}
MicroblogMap.prototype.createMarkerWithPopUp = function (point) {
    var vis = this;
    var id = point.id;
    // if (vis.markers.length >= 1) {
    //     id = vis.markers[vis.markers.length-1]._id + 1;
    // }

    var form = L.DomUtil.create('form', 'my-form');
    form.innerHTML = '<p>' + point.post_text + '</p>' + '<p>' + point.date + '</p>';


    var btn = L.DomUtil.create('button', 'my-button', form);
    let timelineBtn = L.DomUtil.create('button', 'create-button', form);
    btn.textContent = 'Remove Marker';
    timelineBtn.textContent = "Add to Timeline"

    btn.onclick = function (e) {
        var new_markers = [];
        vis.markers.forEach(function (marker) {
            if (marker._id == point.id) {
                vis.map.removeLayer(marker);
            }
            else {
                new_markers.push(marker);
            }

        });

        vis.markers = new_markers;
    }
    timelineBtn.onclick = function (e) {
        vis.timeline.addData(point)
    }
    let latlng = L.latLng(point.latitude, point.longitude)

    let marker = L.circleMarker(latlng, {
        draggable: false,
        color: '#3388ff',
        fillColor: '#3388ff',
    });

    marker._id = id

    var myPopup = marker.bindPopup(form, {
        closeButton: false
    });


    vis.map.addLayer(marker);
    vis.markers.push(marker);


}



MicroblogMap.prototype.changeMapForDate = function (start, end) {
    var vis = this;
    if (vis.map != null) {
        vis.map.remove();
        vis.map = null;
        vis.markers = [];
    }

    vis.map = L.map(this.parentElement).setView(vis.mapPosition, vis.zoomLevel);

    L.imageOverlay('a3_data/Vastopolis_Map.png', vis.imageBounds).addTo(vis.map);

    vis.startDate = start;
    vis.endDate = end;
    vis.updateVis(start, end)

}

MicroblogMap.prototype.updateVis = function (start, end) {
    // microblogs = L.layerGroup().addTo(vis.map);
    let vis = this
    let samples = JSON.parse(vis.sampled_ids)
    let num_data = samples.length;
    let locations = vis.data.location;
    let dates = vis.data.post_date_time;
    let microblog_text = vis.data.text;
    let user = vis.data.user_id;
    let latlngs = []
    for (var i = 0; i < num_data; i++) {
        let post_id = samples[i];
        let loc = locations[post_id].split(" ");
        let post_latitude = loc[0];
        let post_longitude = loc[1];
        let post_text = microblog_text[post_id];
        let post_date = dates[post_id];
        let user_id = user[post_id];
        let date = dates[post_id];
        let addToMap = vis.checkDate(date, start, end);
        var latlng = L.latLng(post_latitude, post_longitude);
        latlngs.push(latlng)
        if (addToMap == true && vis.map.getBounds().contains(latlng)) {
            let addObj = { id: post_id, date: post_date, latitude: post_latitude, longitude: post_longitude, post_text: post_text, user: user_id }
            vis.createMarkerWithPopUp(addObj);
        }

    }

}
    

    // vis.heat = L.heatLayer(latlngs)
    // vis.heat.addTo(vis.map)




