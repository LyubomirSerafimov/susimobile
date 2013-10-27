var stats = {}; //name, totalStrenght, numScans
var points = false;
var networks = null;
var distances = null;

function makeArray(howMany, value){
    var output = [];
    while(howMany--){
        output.push(value);
    }
    return output;
}

$.getJSON('data/points.json', function (data) {
    points = data;
    networks = {};
    var id = 1;
    for (var i in data) {
        var point = data[i];
        for (var j in point.networks) {
            var network = point.networks[j];
            if (!networks[network.name]) {
                networks[network.name] = id;
                id += 1;
            }
        }
    }
    //console.log(networks);
    distances = {};
    for (var i in data) {
        var point = data[i];
        var distance = makeArray(30, 0);
        for (var j in point.networks) {
            var network = point.networks[j];
            var ind = networks[network.name];
            distance[ind] = parseFloat(network.strenght);
        }
        distances[point.point] = distance;
    }
    //console.log(distances);
});

var drawResutls = function (data) {
    $('#testDiv').replaceWith('');
    var str = '{"point": "' + selectedPoint + '", "networks": [';
    for (var i in data) {
        var net = data[i];
        str += '{"name": "' + i + '",';
        str += '"strenght": "' + (net.totalStrenght / net.numScans) + '"},'
    }
    str = str.slice(0, -1);
    str += ']}';
    console.log(str);
    $('#testDiv').replaceWith(str);
};

var findDist = function (dist) {
    var sum = 0;
    for (var i = 0; i < 30; i++) {
        sum += Math.pow(dist[i], 2);
    }
}

var findSpot = function (dist) {
    var minP = '';
    var minD = 1000000;
    for (point in distances) {
        var pDist = distances[point];
        var sum = 0;
        sum = 0;
        for (var i = 0; i < 30; i++) {
            var a = Math.pow(Math.E, dist[i]);
            var b = Math.pow(Math.E, pDist[i]);
            sum += Math.pow(a - b, 2);
        }

        var fDistance = Math.sqrt(sum);
        if (fDistance < minD) {
            minD = fDistance;
            minP = point;
        }
    }

    var p = JSON.parse(minP);
    Pts = [[p[0],p[1]];
    console.log(p);
    return point;
}

var wifiScanCallback = function(data) {
    if (!networks) {
        return;
    }
    var obj = JSON.parse(data);
    var dist = makeArray(30, 0);
    for (var i in obj) {
        var network = obj[i];
        var name = network.name;
        var strenght = network.strenght;
        dist[networks[name]] = parseFloat(strenght);
    }
    findSpot(dist);
};

setTimeout(function () {
    wifiScanCallback('[{"name": "515","strenght": "-75.91666666666667"},{"name": "FMI-AIR-316","strenght": "-83.33333333333333"},{"name": "Az sum simo .. priqtno mi e","strenght": "-58.166666666666664"},{"name": "innovationlab1","strenght": "-70.25"},{"name": "innovationlab2","strenght": "-85"},{"name": "51_420","strenght": "-62.833333333333336"},{"name": "FMI-AIR-211","strenght": "-78"},{"name": "Musala","strenght": "-82.6"},{"name": "R4o2","strenght": "-81.16666666666667"},{"name": "HackFMI","strenght": "-86"},{"name": "laser_laboratory","strenght": "-90"}]');
}, 500)
