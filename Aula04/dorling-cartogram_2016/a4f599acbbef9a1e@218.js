// https://observablehq.com/@harrystevens/circle-legend@218
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Circle Legend

To use in your notebook:

~~~js
import { legendCircle } from "@harrystevens/circle-legend";
~~~`
)});
  main.variable(observer("legend")).define("legend", ["legendCircle","d3","tickSize"], function(legendCircle,d3,tickSize){return(
legendCircle()
    .scale(
      d3.scaleSqrt()
          .domain([0, 500])
          .range([0, 40])
     )
    .tickValues([15, 150, 500])
    .tickFormat((d, i, e) => i === e.length - 1 ? d + " bushels of hay" : d)
    .tickSize(tickSize)
)});
  main.variable(observer("viewof tickSize")).define("viewof tickSize", ["slider"], function(slider){return(
slider({
  title: "Tick size",
  value: 5,
  min: 0,
  max: 100,
  step: 1,
  description: "What happens when you adjust this?"
})
)});
  main.variable(observer("tickSize")).define("tickSize", ["Generators", "viewof tickSize"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","DOM","tickSize","legend"], function(d3,DOM,tickSize,legend)
{
  const svg = d3.select(DOM.svg())
      .attr("height", 90)
      .attr("width", 180 + tickSize)
  
  // Call it on a g element
  svg.append("g")
      .call(legend);
  
  return svg.node();
}
);
  main.variable(observer("legendCircle")).define("legendCircle", function(){return(
function(context){
  let scale,
      tickValues,
      tickFormat = d => d,
      tickSize = 5;
  
  function legend(context){
    let g = context.select("g");
    if (!g._groups[0][0]){
      g = context.append("g");
    }
    g.attr("transform", `translate(${[1, 1]})`);
    
    const ticks = tickValues || scale.ticks();
    
    const max = ticks[ticks.length - 1];
    
    g.selectAll("circle")
        .data(ticks.slice().reverse())
      .enter().append("circle")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("cx", scale(max))
        .attr("cy", scale)
        .attr("r", scale);
    
    g.selectAll("line")
        .data(ticks)
      .enter().append("line")
        .attr("stroke", "currentColor")
        .attr("stroke-dasharray", "4, 2")
        .attr("x1", scale(max))
        .attr("x2", tickSize + scale(max) * 2)
        .attr("y1", d => scale(d) * 2)
        .attr("y2", d => scale(d) * 2);
    
    g.selectAll("text")
        .data(ticks)
      .enter().append("text")
        .attr("font-family", "'Helvetica Neue', sans-serif")
        .attr("font-size", 11)
        .attr("dx", 3)
        .attr("dy", 4)
        .attr("x", tickSize + scale(max) * 2)
        .attr("y", d => scale(d) * 2)
        .text(tickFormat);
  }
  
  legend.tickSize = function(_){
    return arguments.length ? (tickSize = +_, legend) : tickSize;
  }
  
  legend.scale = function(_){
    return arguments.length ? (scale = _, legend) : scale;
  }

  legend.tickFormat = function(_){
    return arguments.length ? (tickFormat = _, legend) : tickFormat;
  }
  
  legend.tickValues = function(_){
    return arguments.length ? (tickValues = _, legend) : tickValues;
  }
  
  return legend;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Todo
* Ensure circles are drawn biggest to smallest so they can be styled
* Make it work with a threshold scale
`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3-scale@3", "d3-selection@1")
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  return main;
}
