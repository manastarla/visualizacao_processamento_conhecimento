// https://observablehq.com/@neocartocnrs/basemaps-data@171
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["world.topojson",new URL("./files/753a63cecc4b4e8f20d70343997f6c8c546122d8b5842700495427d75926687c02795cfe68e7f35e438b3aa0a300d6f0d536a62a49c5aa62e0c676a14b9db02e",import.meta.url)],["pop@1.csv",new URL("./files/35663fdefc6a06d285f7d82c5ec0cfd976dedfdec6416eb2c32b4a649e05663900f07a1765a23fe620dc659dc1f7ca22e039d2382614d4d57db95415829773a8",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Basemaps & data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**World Countries** (from http://magrit.cnrs.fr)`
)});
  main.variable(observer("countries")).define("countries", ["topojson","world"], function(topojson,world){return(
topojson.feature(world, world.objects.world_countries_data)
)});
  main.variable(observer("world")).define("world", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("world.topojson").json()
)});
  main.variable(observer()).define(["pop"], function(pop){return(
pop[0]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**World population** (from https://data.worldbank.org/indicator/SP.POP.TOTL)`
)});
  main.variable(observer("pop")).define("pop", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("pop@1.csv").text())
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require('topojson')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
