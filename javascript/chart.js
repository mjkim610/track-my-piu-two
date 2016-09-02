var data = [{
    "sale": "202",
    "year": "2000"
}, {
    "sale": "215",
    "year": "2001"
}, {
    "sale": "179",
    "year": "2002"
}, {
    "sale": "199",
    "year": "2003"
}, {
    "sale": "134",
    "year": "2003"
}, {
    "sale": "176",
    "year": "2010"
}];

var data2 = [{
    "sale": "152",
    "year": "2000"
}, {
    "sale": "189",
    "year": "2002"
}, {
    "sale": "179",
    "year": "2004"
}, {
    "sale": "199",
    "year": "2006"
}, {
    "sale": "134",
    "year": "2008"
}, {
    "sale": "176",
    "year": "2010"
}];

var visits = [];
var visitCount = [];

var min, max;

function getData() {
    chrome.storage.sync.get(null, function (result) {
        // count the number of entries
        var row, cellUrl, cellUsername, cellPassword, cellTime,
            timeConverted, yyyy, mm, dd, hh, minute, ss, ampm;

        var entryCount = result.urls.length;
        var i;

        for (i=0; i<entryCount; i++) {
            var jsonDatum = {};
            jsonDatum["url"] = result.urls[i];
            jsonDatum["date"] = Number(new Date(result.times[i]));
            visits.push(jsonDatum);
        }

        min = visits[0].date;
        max = visits[i-1].date;
        console.log("Min: "+min);
        console.log("Max: "+max);

        getVisitCount();
        // start rest of the javascript functions
        initialize();
    });
}

function getVisitCount() {
    console.log("#####################");
    console.log("In getVisitCount()");
    var visitEntry = {};
    for (var key in visits) {
        currentUrl = visits[key].url;
        if (!(currentUrl in visitEntry)) {
            visitEntry[currentUrl] = 1;
            visitCount.push(currentUrl);
        } else {
            visitEntry[currentUrl]++;
        }
    }
    console.log(visitCount);
    console.log("#####################");
}

function initialize() {
    drawChart();
    console.log(visits);
}

function drawChart() {
    var vis = d3.select("#visualization"),
        WIDTH = 1000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        // xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([min, max]),
        xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2010]),
        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([134, 215]),
        xAxis = d3.svg.axis()
        .scale(xScale),
        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    vis.append("svg:g")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);

    vis.append("svg:g")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);

    var lineGen = d3.svg.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.sale);
        });

    vis.append('svg:path')
        .attr('d', lineGen(data))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    vis.append('svg:path')
      .attr('d', lineGen(data2))
      .attr('stroke', 'pink')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
}

document.body.onload = getData;
