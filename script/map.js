var container = d3.select("#map_container");
var choroButton = d3.select("#choropleth_button");
var svg = container.append("svg")
  .attr("width", 1200)
  .attr("height", 600)
  .attr("id", "usa");
var g = svg.append("g")
  .attr("id", "boundaries")


var projection = d3.geoMercator()
  .scale(1000)
  .rotate([96,-50])
  .translate([575, 90]);
var path = d3.geoPath()
  .projection(projection);


function zoomed(event) {
  var transform = event.transform;
  g.attr("transform", transform.toString());
}
var zoom = d3.zoom()
  .scaleExtent([0.7, 60])
  .on("zoom", zoomed);
svg.call(zoom).on("dblclick.zoom", null);




d3.json("../data/DRA_2022_USA_simplified[4.1].topo.json").then(function (data) {

  drawMap(function (d, i) {
    return choroMargins(d);
  });

  choroButton.on("click", () =>{
    if (choroButton._groups[0][0].className === "active") {

      g.selectAll("path").remove();
      drawMap(function (d, i) {
        return choroMargins(d);
      });

      choroButton.attr("class", null)
        .style("background-color", "white")
        .style("border-color", "#454545")
        .style("color", "#454545");

    } else {

      g.selectAll("path").remove();
      drawMap(function (d, i) {
        return choroDynamic(d);
      });

      choroButton.attr("class", "active")
        .style("background-color", "#454545")
        .style("border-color", "#454545")
        .style("color", "white");

    }
  });




  function drawMap(choro) {
    g.selectAll("path")
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




  function choroMargins(district) {
     var parties = [district.properties.DemPct, district.properties.RepPct];
     parties.sort(function(a, b) {
       return b - a;
     });

     var margin = parties[0] - parties[1];

     if (margin >= 0.15) {
       return 1;
     } else {
       if (margin >= 0.05) {
         return 0.75;
       } else {
         if (margin >= 0.01) {
           return 0.4;
         } else {
           if (margin <= 0.01) {
               return 0.2;
           }
         }
       }
     }
   }

   function choroDynamic(district) {
     var parties = [district.properties.DemPct, district.properties.RepPct];
     parties.sort(function(a, b) {
       return b - a;
     });

     var margin = parties[0] - parties[1];

     if (margin > 0.05) {
       return Math.pow(margin, 1.3) + 0.35;
     } else {
       return Math.pow(margin, 1.3) + 0.25;
     }
   }

});
