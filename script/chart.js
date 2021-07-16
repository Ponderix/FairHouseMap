var chart = {
  drawBar : function(data, graph, results, result_div) {

     graph.selectAll("rect")
       .data(results)
       .enter()
       .append("rect")
         .attr("class", function(d, i) {
           return d[0];
         })
         .attr("height", 30)
         .attr("x", function(d, i) {
           if (d[0] == "democratic") {
             return 0;
           } else {
             return 1000 - (1000 * results[1][1] / (results[0][1] + results[1][1]));
           }
         })
         .attr("width", function(d, i) {
           return 1000 * d[1] / (results[0][1] + results[1][1]);
         })
         .attr("y", 0);

     result_div.selectAll("span")
        .data(results)
        .enter()
        .append("span")
          .attr("id", function(d, i) {
             return d[0] + "Result";
          })
          .html(function(d, i) {
            if (d[0] == "democratic") {
              return `${d[1]}<span>DEMOCRATIC</span>`;
            } else {
              return `<span>REPUBLICAN</span>${d[1]}`;
            }
          });

     graph.append("rect")
       .attr("id", "majority")
       .attr("height", 30)
       .attr("width", 1)
       .attr("x", 217/434 * 1000)
       .attr("y", 0);

     var majority_div = result_div.append("div")
       .attr("class", "majority-div")

     majority_div.append("i")
       .attr("class", "up-arrow");
     majority_div.append("div")
       .attr("id", "majority-info")
       .html("218 for Majority in the House");

   },
}
