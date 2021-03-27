// https://observablehq.com/@neocartocnrs/dorling-cartogram@1352
import define1 from "./a4f599acbbef9a1e@218.js";
import define2 from "./78728694d293fe4e@171.js";
import define3 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Dorling Cartogram - (1960) CO2 emissions (metric tons per capita)`
)});
  main.variable(observer("viewof show")).define("viewof show", ["checkbox"], function(checkbox){return(
checkbox({
  options: [{ value: "show", label: "Show Legend" }],
  value: false
})
)});
  main.variable(observer("show")).define("show", ["Generators", "viewof show"], (G, _) => G.input(_));
  main.variable(observer("viewof k")).define("viewof k", ["slider"], function(slider){return(
slider({
  min: 1,
  max: 150,
  value: 75,
  step: 1,
  description: "To change the size of the circles"
})
)});
  main.variable(observer("k")).define("k", ["Generators", "viewof k"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["simulation","d3","width","height","sphere","path","topojson","world","data","radius","legend","show"], function(simulation,d3,width,height,sphere,path,topojson,world,data,radius,legend,show)
{
  for (let i = 0; i < 200; i++) {
    simulation.tick();
  }

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "auto");

  // Sphere

  svg
    .append("g")
    .append("path")
    .datum(sphere)
    .attr("class", "graticuleOutline")
    .attr("d", path)
    .style('fill', "#9ACBE3");

  // Graticule

  svg
    .append("g")
    .append("path")
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path)
    .attr("clip-path", "url(#clip)")
    .style('fill', "none")
    .style('stroke', "white")
    .style('stroke-width', .8)
    .style('stroke-opacity', .5)
    .style('stroke-dasharray', 2);

  // Countries

  svg
    .append("path")
    .datum(topojson.feature(world, world.objects.world_countries_data))
    .attr("fill", "white")
    .style('fill-opacity', .5)
    .attr("d", path);

  // Dorling circles

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", d => radius(d.value))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "#e04a28")
    .attr("fill-opacity", 0.9)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5);

  // Labels

  svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .text(d => d.id)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-family", function(d, i) {
      return i < 5 ? "serif" : "sans-serif";
    })
    .attr("fill", "white")
    .style("font-size", d => `${radius(d.value) * .8}px`);

  svg
    .append("g")
    .attr("transform", `translate(0, 10)`)
    .call(legend)
    .style("display", show === "show" ? "block" : "none");

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`# Appendix`
)});
  main.variable(observer("legend")).define("legend", ["legendCircle","d3","data","radius"], function(legendCircle,d3,data,radius){return(
legendCircle()
  .tickValues([50e6, 200e6, 500e6, d3.max(data, d => Math.round(d.value))])
  .tickFormat((d, i, e) => {
    const val =
      d >= 1e9 ? `${Math.round((d / 1e9) * 10) / 10}B` : `${d / 1e6}M`;
    const unit = i === e.length - 1 ? " people" : "";
    return `${val}${unit}`;
  })
  .scale(radius)
)});
  main.variable(observer("height")).define("height", ["d3","projection","width","sphere"], function(d3,projection,width,sphere)
{
  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width, sphere))
    .bounds(sphere);
  const dy = Math.ceil(y1 - y0),
    l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
  return dy;
}
);
  main.variable(observer("sphere")).define("sphere", function(){return(
{ type: "Sphere" }
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("projection")).define("projection", ["d3"], function(d3){return(
d3.geoBertin1953()
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",.0f")
)});
  main.variable(observer("radius")).define("radius", ["d3","data","k"], function(d3,data,k){return(
d3.scaleSqrt([0, d3.max(data, d => d.value)], [0, k])
)});
  main.variable(observer("simulation")).define("simulation", ["d3","data","projection","radius"], function(d3,data,projection,radius){return(
d3
  .forceSimulation(data)
  .force("x", d3.forceX(d => projection(d.coords)[0]))
  .force("y", d3.forceY(d => projection(d.coords)[1]))
  .force("collide", d3.forceCollide(d => 0.5 + radius(d.value)))
  .stop()
)});
  main.variable(observer("data")).define("data", ["pop","features"], function(pop,features){return(
pop
  .map(d => {
    const id = d.id;
    const feature = features.get(d.id);
    const pop = d.pop2019;
    return {
      id,
      coords: feature && feature.properties.centroid,
      name: feature && feature.properties.NAMEen,
      value: +pop
    };
  })
  .filter(d => d.name != undefined)
)});
  main.variable(observer("features")).define("features", ["topojson","world","d3","largestPolygon"], function(topojson,world,d3,largestPolygon){return(
new Map(
  topojson
    .feature(world, world.objects.world_countries_data)
    .features.map(d => {
      d.properties.centroid = d3.geoCentroid(
        d.geometry.type == "Polygon" ? d : largestPolygon(d)
      );
      return d;
    })
    .map(d => [d.properties.ISO3, d])
)
)});
  main.variable(observer()).define(["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.world_countries_data)
)});
  main.variable(observer("largestPolygon")).define("largestPolygon", ["d3"], function(d3){return(
function(d) {
  var best = {};
  var bestArea = 0;
  d.geometry.coordinates.forEach(function(coords) {
    var poly = { type: 'Polygon', coordinates: coords };
    var area = d3.geoArea(poly);
    if (area > bestArea) {
      bestArea = area;
      best = poly;
    }
  });
  return best;
}
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require('topojson')
)});
  const child1 = runtime.module(define1);
  main.import("legendCircle", child1);
  const child2 = runtime.module(define2);
  main.import("world", child2);
  main.import("pop", child2);
  const child3 = runtime.module(define3);
  main.import("slider", child3);
  main.import("checkbox", child3);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-force@2", "d3-geo-projection@2")
)});
  return main;
}
