// https://observablehq.com/@dmadisetti/toki-pona-radix-tree@526
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["toki_pona_dictionary.json",new URL("./files/66a33b4b60bebc85e03ae5baba029afe7cedbfb522143de84e2c27e45bba5035e59c58fb82956ba40a2df483c87df185a27ff2752dd9d2d4984592f2ca055275",import.meta.url)],["english_dictionary.json",new URL("./files/64bb44af0529b28a52b1a2b1b5211755d73c078b7e841ffefcdf4e00821e2c25a1dd80bfd9e01c1c63b4f52062eae65979eadc863475406b0fd72fecd70c37e8",import.meta.url)],["esperanto_dictionary.json",new URL("./files/66005de5f156cd4eee99847704a11ef9851ba6b2a01683ad767af63ec2725bc85ec04e711808f22cfa26cc102f017b4b227cd51214678e9da62ca8a8fb7e8deb",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("toki_pona")).define("toki_pona", ["md"], function(md){return(
md`# Deconstructing a language (toki pona)

[toki pona](https://en.wikipedia.org/wiki/Toki_Pona) (the language of good) is a language consisting of just 120 (ish) words, it was invented in 2003 by [Sonja Lang](https://tokipona.org/). Its simplicity means that we can eaily view the entire vocabulary in a [radix tree](https://en.wikipedia.org/wiki/Radix_tree). Using [out of the box d3 examples](https://next.observablehq.com/@d3/radial-tidy-tree), and a [publically available source of the toki pona vocabulary](https://jprogr.github.io/TokiPonaDictionary/), and we're cooking! I tried to style this graphic after \`pu\` [the offical book of toki pona](https://www.amazon.com/Toki-Pona-Language-Sonja-Lang/dp/0978292308/).

~~~
o musi e sona kasi pi toki pona
tawa jan Silan
~~~
`
)});
  main.variable(observer("toki_chart")).define("toki_chart", ["build_root","toki_dictionary","d3","radius","logo_scale","autoBox"], function(build_root,toki_dictionary,d3,radius,logo_scale,autoBox)
{
  const root = build_root(toki_dictionary);
  const svg = d3.create("svg");
  const fill = "#555";
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("stroke", d => (d.source.data.name == "" ? "none" : fill))
    .attr(
      "d",
      d3
        .linkRadial()
        .angle(d => d.x)
        .radius(d => d.y)
    );

  svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
    .attr(
      "transform",
      d => `
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `
    )
    .attr("fill", d =>
      d.data.name == "" ? "none" : d.data.leaf ? "#FFFF63" : fill
    )
    .attr("stroke", d => (d.data.name == "" ? "none" : "#009"))
    .attr("r", 2.5);

  if (radius > 200) {
    svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 1)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr(
        "transform",
        d => `
          rotate(${(d.x * 180) / Math.PI - 90}) 
          translate(${d.y},0) 
          rotate(${d.x >= Math.PI ? 180 : 0})
        `
      )
      .attr("dy", "0.31em")
      .attr("x", d => (d.x < Math.PI === !d.children ? 6 : -6))
      .attr("text-anchor", d =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .text(d => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke", d => "#e5e8f9");
  }
  let title = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("stroke-linejoin", "round")
    .attr('transform', `translate(-${radius}, -${radius})`);

  title
    .append("text")
    .attr("font-size", radius / 10)
    .text("toki pona radix tree");

  let legend = title
    .selectAll("g")
    .data(["commonly accepted word in toki pona", "word prefix"])
    .join("g")
    .attr(
      "transform",
      (_, i) => `translate(${radius / 32}, ${(radius / 20) * (2 + i * 2)})`
    );
  legend
    .append("circle")
    .attr("fill", (d, i) => (i == 0 ? "#FFFF63" : fill))
    .attr("r", 5)
    .attr("stroke", "#009");
  legend
    .append("text")
    .attr("text-anchor", "center")
    .attr("dy", "0.30em")
    .attr("x", 8)
    .text(d => d);

  let logo_size = radius * logo_scale;
  svg
    .append("image")
    .attr(
      'xlink:href',
      'https://upload.wikimedia.org/wikipedia/commons/8/8a/Toki_pona.svg'
    )
    .attr('transform', `translate(-${logo_size / 2}, -${logo_size / 2})`)
    .attr('width', logo_size)
    .attr('height', logo_size);

  return svg.attr("viewBox", autoBox).node();
}
);
  main.variable(observer("viewof logo_scale")).define("viewof logo_scale", ["slider"], function(slider){return(
slider({
  min: 0,
  max: 0.5,
  value: 0.25,
  step: 0.01,
  description: "Size of logo",
  title: "Logo scale"
})
)});
  main.variable(observer("logo_scale")).define("logo_scale", ["Generators", "viewof logo_scale"], (G, _) => G.input(_));
  main.variable(observer("viewof radius")).define("viewof radius", ["slider"], function(slider){return(
slider({min: 100, max: 1000, value:250, step: 1, description: "Radius", title:"Radius"})
)});
  main.variable(observer("radius")).define("radius", ["Generators", "viewof radius"], (G, _) => G.input(_));
  main.variable(observer("hm")).define("hm", ["md"], function(md){return(
md` ## hm
ok, but how small is toki pona? Conversational English uses between 10,000-20,000 words, using the top 20k words as per [Google n-grams](https://github.com/first20hours/google-10000-english), and cross referencing it with the standard [unix dictionary](https://en.wikipedia.org/wiki/Words_(Unix%29), we end up with \`14395\` words, which seems ball-park for a functional English usage. I also pull in some [Esperanto data](https://gist.github.com/dmadisetti/6cd25894ef1d5998640d1eeabaaa38b4) from [Wiktionary](https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Esperanto), as a sort of intermediate. How's all this stack up to toki pona? Well take a look:`
)});
  main.variable(observer("compare_chart")).define("compare_chart", ["d3","build_root","eng_dictionary","radius","toki_dictionary","relative_radius","esperanto_dictionary","relative_radius2","autoBox"], function(d3,build_root,eng_dictionary,radius,toki_dictionary,relative_radius,esperanto_dictionary,relative_radius2,autoBox)
{
  const svg = d3.create("svg");
  let base = svg
    .attr("style", "padding:20px")
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);
  function chart(container, root, fill, leaf) {
    container
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("stroke", d => (d.source.data.name == "" ? "none" : fill))
      .attr(
        "d",
        d3
          .linkRadial()
          .angle(d => d.x)
          .radius(d => d.y)
      );

    container
      .append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("stroke-width", .1)
      .attr(
        "transform",
        d => `
          rotate(${(d.x * 180) / Math.PI - 90})
          translate(${d.y},0)
        `
      )
      .attr("fill", d =>
        d.data.name == "" ? "none" : d.data.leaf ? leaf : fill
      )
      .attr("stroke", d => (d.data.name == "" ? "none" : fill))
      .attr("r", .2)
      .attr("z-index", d => (d.data.leaf ? 1 : -1));
  }
  chart(base.append("g"), build_root(eng_dictionary), "#00247D", "#CF142B");
  chart(
    base.append("g").attr('transform', `translate(${radius * 1.1}, ${radius * 0.3})`),
    build_root(toki_dictionary, relative_radius),
    "#FFFF63",
    "#009"
  );
  chart(
    base.append("g").attr('transform', `translate(${radius * 1.4}, -${radius * 0.3})`),
    build_root(esperanto_dictionary, relative_radius2),
    "#019b00",
    "#EFE"
  );


  let title = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("stroke-linejoin", "round")
    .attr('transform', `translate(-${radius}, -${radius})`);

  title
    .append("text")
    .attr("font-size", radius / 10)
    .text("common English vocabulary vs Esperanto vs toki pona");
  title
    .append("text")
    .attr("font-size", radius / 20)
    .attr('transform', `translate(0, ${radius / 10})`)
    .text("(size by ngram density)");

  let legend = title
    .selectAll("g")
    .data(["word", "prefix"])
    .join("g")
    .attr(
      "transform",
      (_, i) => `translate(${radius / 32}, ${(radius / 20) * (1 + i)})`
    );

  
  svg.append("path")
      .attr("d", `M${radius*0.75},${radius*0.55} T${radius*0.8},${radius*0.4} T${radius},${radius*0.3}`)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  svg.append("text")  
      .attr("font-size", radius / 20)
      .attr("class", "coords")
      .attr("transform", `translate(${radius*0.75}, ${radius*0.6})`)
      .append("tspan")
      .text("toki pona radix tree")

  
  svg.append("path")
      .attr("d", `M${radius*0.59},-${radius*0.81} T${radius*0.5},-${radius*0.78} T${radius*0.4},-${radius*0.55}`)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  svg.append("text")  
      .attr("font-size", radius / 20)
      .attr("class", "coords")
      .attr("transform", `translate(${radius*0.6}, -${radius*0.8})`)
      .append("tspan")
      .text("radix tree of common English  ")


  svg.append("path")
      .attr("d", `M${radius*1.6},${radius*0.77} T${radius*1.7},${radius*0.67} T${radius*1.7},${radius*0.15}`)
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  svg.append("text")  
      .attr("font-size", radius / 20)
      .attr("class", "coords")
      .attr("transform", `translate(${radius*0.85}, ${radius*0.8})`)
      .append("tspan")
      .text("radix tree of common Esperanto")
  
  return svg.attr("viewBox", autoBox).node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## imports etc..`
)});
  main.variable(observer("build_root")).define("build_root", ["radius","d3","radix"], function(radius,d3,radix){return(
function(dictionary, r){
  r = r || radius;
  const tree = d3
    .tree()
    .size([2 * Math.PI, r])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
  return tree(
    d3.hierarchy(radix(dictionary)).sort((a, b) => d3.ascending(a.data.name, b.data.name))
  );
}
)});
  main.variable(observer("relative_radius")).define("relative_radius", ["radius"], function(radius){return(
radius * Math.sqrt(166 / 17751)
)});
  main.variable(observer("relative_radius2")).define("relative_radius2", ["radius"], function(radius){return(
radius * Math.sqrt(8613 / 17751)
)});
  main.variable(observer("eng_dictionary")).define("eng_dictionary", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("english_dictionary.json").json()
)});
  main.variable(observer("toki_dictionary")).define("toki_dictionary", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("toki_pona_dictionary.json").json()
)});
  main.variable(observer("esperanto_dictionary")).define("esperanto_dictionary", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("esperanto_dictionary.json").json()
)});
  main.variable(observer("Node")).define("Node", function(){return(
class Node {
  constructor(visits, word, parent) {
    this.visits = visits;
    this.word = word;
    this.children = {};
    this.leaf = false;
    this.parent = parent || word.slice(0, -1);
  }
}
)});
  main.variable(observer("radix")).define("radix", ["trie"], function(trie){return(
function(dictionary) {
  let radix = { name: "", children: [] };
  let visited = { "_root": radix };
  let frontier = [trie(dictionary)];
  while (frontier.length) {
    let head = frontier.pop();
    let front = Object.values(head.children);
    frontier = frontier.concat(front);
    if (!head.leaf && front.length == 1) {
      front[0].parent = head.parent;
      continue;
    }
    visited[head.word] = { name: head.word, children: [], leaf: head.leaf };
    visited[head.parent].children.push(visited[head.word]);
  }
  console.log("size", Object.keys(visited).length);
  return radix.children[0];
}
)});
  main.variable(observer("trie")).define("trie", ["Node"], function(Node){return(
function(dictionary) {
  let data = {};
  let root = { name: "toki pona", children: [] };
  let trie = new Node(0, "", "_root");
  dictionary.forEach(word => {
    let trie_head = trie;
    let letters = word.word.split()[0];
    let ngram = "";
    letters.split("").forEach(letter => {
      ngram += letter
      if (!(letter in trie_head.children)) {
        trie_head.children[letter] = new Node(0, ngram);
      }
      trie_head.visits++;
      trie_head = trie_head.children[letter];
    });
    trie_head.leaf = true;
  });
  return trie;
}
)});
  main.variable(observer("autoBox")).define("autoBox", function(){return(
function autoBox() {
  document.body.appendChild(this);
  const {x, y, width, height} = this.getBBox();
  document.body.removeChild(this);
  return [x, y, width, height];
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.import("text", child1);
  main.variable(observer("defs")).define("defs", ["html"], function(html){return(
html`<span style="overflow:hidden"><svg>
  <defs>
    <marker
      id="arrow"
      markerUnits="strokeWidth"
      markerWidth="12"
      markerHeight="12"
      viewBox="0 0 12 12"
      refX="6"
      refY="6"
      orient="auto">
      <path d="M2,2 L10,6 L2,10 L2,2" style="fill: #000;"></path>
    </marker>
  </defs>
</svg></span>`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
svg {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 93%, rgba(207, 229, 240, 0.5) 93%, rgba(207, 229, 240, 0.5) 100%), linear-gradient(90deg, rgba(231, 241, 243, 0.4) 5%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0)), linear-gradient(rgba(231, 241, 243, 0.4) 5%, rgba(255, 255, 255, 0) 5%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0) 90%, rgba(214, 237, 243, 0.2) 90%, rgba(214, 237, 243, 0.2) 100%), linear-gradient(rgba(255, 255, 255, 0) 35%, rgba(221, 232, 234, 0.4) 35%, rgba(221, 232, 234, 0.4) 45%, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0) 55%, rgba(231, 241, 243, 0.4) 55%, rgba(231, 241, 243, 0.4) 70%, rgba(255, 255, 255, 0) 70%), linear-gradient(90deg, rgba(255, 255, 255, 0) 35%, rgba(221, 232, 234, 0.4) 35%, rgba(221, 232, 234, 0.4) 45%, rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0) 55%, rgba(231, 241, 243, 0.4) 55%, rgba(231, 241, 243, 0.4) 70%, rgba(255, 255, 255, 0) 70%), linear-gradient(rgba(255, 255, 255, 0) 55%, rgba(221, 232, 234, 0.4) 55%, rgba(221, 232, 234, 0.4) 60%, rgba(255, 255, 255, 0) 60%), linear-gradient(90deg, rgba(255, 255, 255, 0) 55%, rgba(221, 232, 234, 0.4) 55%, rgba(221, 232, 234, 0.4) 60%, rgba(255, 255, 255, 0) 60%), linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(207, 229, 240, 0.5) 20%, rgba(207, 229, 240, 0.5) 80%, rgba(255, 255, 255, 0) 80%), linear-gradient(90deg, rgba(255, 255, 255, 0) 20%, rgba(214, 237, 243, 0.2) 20%, rgba(214, 237, 243, 0.2) 80%, rgba(255, 255, 255, 0) 80%), linear-gradient(rgba(255, 255, 255, 0) 10%, rgba(231, 241, 243, 0.4) 10%, rgba(231, 241, 243, 0.4) 35%, rgba(255, 255, 255, 0) 35%), linear-gradient(90deg, rgba(255, 255, 255, 0) 10%, rgba(231, 241, 243, 0.4) 10%, rgba(231, 241, 243, 0.4) 35%, rgba(255, 255, 255, 0) 35%);
  background-size: 14em 14em;
  background-color: #DDE8EA;
  font: 10px/2 'Trebuchet MS', Verdana, sans-serif;
}
</style>`
)});
  return main;
}
