// https://observablehq.com/@anna/customizing-sankey-diagram-for-text-compression-project@305
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["sankey@3.csv",new URL("./files/11dee2133a9e015a4e34b88cb1a77a18045fbb201ef00bf327d2c0d551503df9d09c516766fd86edfece3dd6935894241b705289168f2407311f5947132e687a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Customizing Sankey Diagram for Text Compression Project

Useful links: D3 Sankey documentation can be found [here](https://github.com/d3/d3-sankey).
Some visual examples (without code) can be found [here](http://www.sankey-diagrams.com/).
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Wishlist -- fundamental 
* have solid colors for links. (want each link to have a color property. coins from the same sentence should have same color.) 
* un-normalize the lengths
* do indentations with long text
* correct the order of vertical lines
* figure out how to handle 'a' vs 'an'
* allow reading of null values. 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Wishlist -- other
* make the words bigger (proportionate to the size of the blocks now). 
> define a node.fixedValue property - sum of values for all links going max(into, out of) that node. 
* change the colors of the words. if the words are between two gradients, then make the color black. otherwise, make color same as its input or output link color.
> add a color property to node. if len(node.sourceLinks) or len(node.targetLinks) > 1, then make color black. else: let color = node.sourceLinks or node.targetLinks' color 
* when hover over link, have the link and all connecting links darken (for readability).
> example: https://www.data-to-viz.com/graph/sankey.html 
`
)});
  main.variable(observer("viewof edgeColor")).define("viewof edgeColor", ["html","URLSearchParams"], function(html,URLSearchParams){return(
Object.assign(html`<select>
  <option value=input>Color by input
  <option value=output>Color by output
  <option value=path selected>Color by input-output
  <option value=none>No color
</select>`, {
  value: new URLSearchParams(html`<a href>`.search).get("color") || "path"
})
)});
  main.variable(observer("edgeColor")).define("edgeColor", ["Generators", "viewof edgeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof align")).define("viewof align", ["html","URLSearchParams"], function(html,URLSearchParams){return(
Object.assign(html`<select>
  <option value=left>Left-aligned
  <option value=right>Right-aligned
  <option value=center>Centered
  <option value=justify selected>Justified
</select>`, {
  value: new URLSearchParams(html`<a href>`.search).get("align") || "justify"
})
)});
  main.variable(observer("align")).define("align", ["Generators", "viewof align"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","sankey","data","color","format","edgeColor","DOM"], function(d3,width,height,sankey,data,color,format,edgeColor,DOM)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey(data);

  svg.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name))
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
      .style("mix-blend-mode", "multiply");

  if (edgeColor === "path") {
    const gradient = link.append("linearGradient")
        .attr("id", d => (d.uid = DOM.uid("link")).id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => color(d.source.name));

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => color(d.target.name));
  }

  link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => edgeColor === "none" ? "#aaa"
          : edgeColor === "path" ? d.uid 
          : edgeColor === "input" ? color(d.source.name) 
          : color(d.target.name))
      .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
      .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  return svg.node();
}
);
  main.variable(observer("sankey")).define("sankey", ["d3","align","width","height"], function(d3,align,width,height)
{
  const sankey = d3.sankey()
      .nodeId(d => d.name)
      .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 5], [width - 1, height - 5]]);
  return ({nodes, links}) => sankey({
    nodes: nodes.map(d => Object.assign({}, d)),
    links: links.map(d => Object.assign({}, d))
  });
}
);
  main.variable(observer("format")).define("format", ["d3"], function(d3)
{
  const f = d3.format(",.0f");
  return d => `${f(d)} TWh`;
}
);
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return name => color(name.replace(/ .*/, ""));
}
);
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment)
{
  const links = d3.csvParse(await FileAttachment("sankey@3.csv").text(), d3.autoType);
  const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])), name => ({name}));
  return {nodes, links};
}
);
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-sankey@0.12")
)});
  return main;
}
