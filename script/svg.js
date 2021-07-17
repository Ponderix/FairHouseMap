var mapContainer = d3.select("#map_container");
var chartContainer = d3.select("#chart_container");
var seatCounter = d3.select("#seat_counter");

var choroButton = d3.select("#choropleth_button");
var marginsContent = d3.select("#margins_content");

var mapSvg = mapContainer.append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .attr("id", "usa");
var map = mapSvg.append("g")
    .attr("id", "boundaries");

var chartSvg = chartContainer.append("svg")
    .attr("width", 1000)
    .attr("height", 100)
    .attr("id", "chart");
var graph = chartSvg.append("g")
    .attr("id", "graph");


var projection = d3.geoMercator()
    .scale(1000)
    .rotate([96, -50])
    .translate([575, 90]);
var path = d3.geoPath()
    .projection(projection);


function zoomed(event) {
    var transform = event.transform;
    map.attr("transform", transform.toString());
}
var zoom = d3.zoom()
    .scaleExtent([0.7, 60])
    .on("zoom", zoomed);
mapSvg.call(zoom).on("dblclick.zoom", null);




d3.json("./data/DRA_2022_USA_simplified[4.1].topo.json").then(function(data) {

    var democratic = [];
    var republican = [];
    var districts = data.objects.boundaries.geometries;

    var seats = [
        ["democratic"],
        ["republican"]
    ];

    for (var i = 0; i < districts.length; i++) {
        if (districts[i].properties.DemPct > districts[i].properties.RepPct) {
            democratic.push(districts[i]);
        } else {
            republican.push(districts[i]);
        }
    }

    seats[0].push(democratic.length);
    seats[1].push(republican.length);




    drawMap(function(d, i) {
        return choropleths.choroMargins(d);
    });

    chart.drawBar(data, graph, seats, seatCounter);

    choroButton.on("click", () => {
        if (choroButton._groups[0][0].className === "active") {

            map.selectAll("path").remove();
            drawMap(function(d, i) {
                return choropleths.choroMargins(d);
            });

            marginsContent.style("display", "inline");
            choroButton.attr("class", "inactive");

        } else {

            map.selectAll("path").remove();
            drawMap(function(d, i) {
                return choropleths.choroDynamic(d);
            });

            marginsContent.style("display", "none");
            choroButton.attr("class", "active");

        }
    });




    function drawMap(choro) {
        map.selectAll("path")
            .data(topojson.feature(data, data.objects.boundaries).features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d, i) {
                if (d.properties.TotalPop == 737068) {
                    return "Alaska";
                } else {
                    if (d.properties.TotalPop == 712119) {
                        return "Hawaii South";
                    } else {
                        if (d.properties.TotalPop == 709975) {
                            return "Hawaii North";
                        }
                    }
                }
            })
            .attr("class", function(d, i) {
                if (d.properties.TotalPop == 712119 || d.properties.TotalPop == 709975) {

                    if (d.properties.DemPct > d.properties.RepPct) {
                        return "district hawaii democratic";
                    } else {
                        return "district hawaii republican";
                    }

                } else {

                    if (d.properties.DemPct > d.properties.RepPct) {
                        return "district democratic";
                    } else {
                        return "district republican";
                    }

                }
            })
            .attr("opacity", choro);
    }

});
