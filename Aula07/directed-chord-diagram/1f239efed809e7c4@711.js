// https://observablehq.com/@d3/directed-chord-diagram@711
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["debt.csv",new URL("./files/fb478ddc59d580061fc5a6eb927e428912052c96cd4b44bbc4f484ff016ce6aace0409cf0bb8f172f46c41a9d41518e44e972c2136fa66b7e220329b9fbbf233",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Directed Chord Diagram

This chord diagram, inspired by Bill Marsh’s [overview of the 2011 Euro crisis](http://archive.nytimes.com/www.nytimes.com/interactive/2011/10/23/sunday-review/an-overview-of-the-euro-crisis.html), visualizes debts between countries.`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","chord","matrix","DOM","outerRadius","ribbon","color","names","formatValue","arc"], function(d3,width,height,chord,matrix,DOM,outerRadius,ribbon,color,names,formatValue,arc)
{
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const chords = chord(matrix);

  const textId = DOM.uid("text");

  svg.append("path")
      .attr("id", textId.id)
      .attr("fill", "none")
      .attr("d", d3.arc()({outerRadius, startAngle: 0, endAngle: 2 * Math.PI}));

  svg.append("g")
      .attr("fill-opacity", 0.75)
    .selectAll("g")
    .data(chords)
    .join("path")
      .attr("d", ribbon)
      .attr("fill", d => color(names[d.target.index]))
      .style("mix-blend-mode", "multiply")
    .append("title")
      .text(d => `${names[d.source.index]} owes ${names[d.target.index]} ${formatValue(d.source.value)}`);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 5)
    .selectAll("g")
    .data(chords.groups)
    .join("g")
      .call(g => g.append("path")
        .attr("d", arc)
        .attr("fill", d => color(names[d.index]))
        .attr("stroke", "#fff"))
      .call(g => g.append("text")
        .attr("dy", -3)
      .append("textPath")
        .attr("xlink:href", textId.href)
        .attr("startOffset", d => d.startAngle * outerRadius)
        .text(d => names[d.index]))
      .call(g => g.append("title")
        .text(d => `${names[d.index]}
owes ${formatValue(d3.sum(matrix[d.index]))}
is owed ${formatValue(d3.sum(matrix, row => row[d.index]))}`));

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("debt.csv").text(), d3.autoType)
)});
  main.variable(observer("names")).define("names", ["data"], function(data){return(
Array.from(new Set(data.flatMap(d => [d.source, d.target])))
)});
  main.variable(observer("matrix")).define("matrix", ["names","data"], function(names,data)
{
  const index = new Map(names.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(names.length).fill(0));
  for (const {source, target, value} of data) matrix[index.get(source)][index.get(target)] += value;
  return matrix;
}
);
  main.variable(observer("chord")).define("chord", ["d3","innerRadius"], function(d3,innerRadius){return(
d3.chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
)});
  main.variable(observer("arc")).define("arc", ["d3","innerRadius","outerRadius"], function(d3,innerRadius,outerRadius){return(
d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
)});
  main.variable(observer("ribbon")).define("ribbon", ["d3","innerRadius"], function(d3,innerRadius){return(
d3.ribbonArrow()
    .radius(innerRadius - 0.5)
    .padAngle(1 / innerRadius)
)});
  main.variable(observer("color")).define("color", ["d3","names"], function(d3,names){return(
d3.scaleOrdinal(names, d3.schemeCategory10)
)});
  main.variable(observer("formatValue")).define("formatValue", function(){return(
x => `${x.toFixed(0)}B`
)});
  main.variable(observer("outerRadius")).define("outerRadius", ["innerRadius"], function(innerRadius){return(
innerRadius + 6
)});
  main.variable(observer("innerRadius")).define("innerRadius", ["width","height"], function(width,height){return(
Math.min(width, height) * 0.5 - 20
)});
  main.variable(observer("width")).define("width", function(){return(
840
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
