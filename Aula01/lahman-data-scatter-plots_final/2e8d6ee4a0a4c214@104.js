// https://observablehq.com/@credmond/lahman-data-scatter-plots@104
import define1 from "./a2166040e5fb39a6@229.js";
import define2 from "./7764a40fe6b83ca1@416.js";
import define3 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`Algoritmos de Redução de Dados`
)});
  main.variable(observer()).define(["vl","ruth"], function(vl,ruth){return(
vl.markPoint({size: 200,filled: true,stroke: "black"})
.title("Comparativo entre o SGPE e o GA: Acurácia vs Redução")
.width(500)
.data(ruth)
.encode(
  vl.x().fieldQ("reducao").scale({zero:false}).title("Redução"),
  vl.y().fieldQ("acuracia").title("Acurácia"),
  vl.tooltip(["reducao","acuracia","dataset"]),
  vl.color().fieldN("Algoritmo")
)
.render()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
---
## Appendix
`
)});
  const child1 = runtime.module(define1);
  main.import("printTable", child1);
  const child2 = runtime.module(define2);
  main.import("vl", child2);
  const child3 = runtime.module(define3);
  main.import("slider", child3);
  main.import("button", child3);
  main.import("select", child3);
  main.import("text", child3);
  main.import("radio", child3);
  main.import("checkbox", child3);
  main.import("number", child3);
  main.variable(observer("ruth")).define("ruth", function(){return(
[
  {
    "playerID": "ruthba01",
    "reducao": 0.97,
    "Algoritmo": "spge",
    "acuracia": 0.82,
    "dataset": "spambase"
  },  {
    "playerID": "ruthba01",
    "reducao": 0.79,
    "Algoritmo": "spge",
    "acuracia": 0.57,
    "dataset": "winequaliwhite"
  },  {
    "playerID": "ruthba01",
    "reducao": 0.77,
    "Algoritmo": "spge",
    "acuracia": 0.8,
    "dataset": "satimage"
  } ,{
    "playerID": "ruthba01",
    "reducao": 0.85,
    "Algoritmo": "spge",
    "acuracia": 0.96,
    "dataset": "thyroid"
  },  {
    "playerID": "ruthba01",
    "reducao": 0.9,
    "Algoritmo": "spge",
    "acuracia": 0.83,
    "dataset": "penbased"
  },  {
    "playerID": "ruthba01",
    "reducao": 0.95,
    "Algoritmo": "spge",
    "acuracia": 0.88,
    "dataset": "texture"
  } ,
  {
    "playerID": "ruthba01",
    "reducao": 0.90,
    "Algoritmo": "spge",
    "acuracia": 0.92,
    "dataset": "page_blocks"
  },  {
    "playerID": "ruthba01",
    "reducao": 0.95,
    "Algoritmo": "spge",
    "acuracia": 0.78,
    "dataset": "phoneme"
  } ,  { "playerID": "ruthba01",
  "reducao": 0.59,
  "Algoritmo": "spge",
  "acuracia": 0.90,
  "dataset": "optdigits"
},  {
  "playerID": "ruthba01",
  "reducao": 0.98,
  "Algoritmo": "spge",
  "acuracia": 0.69,
  "dataset": "ring"
},  {
  "playerID": "ruthba01",
  "reducao": 0.67,
  "Algoritmo": "spge",
  "acuracia": 0.86,
  "dataset": "glass"
},  {
  "playerID": "ruthba01",
  "reducao": 0.68,
  "Algoritmo": "ga",
  "acuracia": 0.80,
  "dataset": "spambase"
},  {
  "playerID": "ruthba01",
  "reducao": 0.52,
  "Algoritmo": "ga",
  "acuracia": 0.40,
  "dataset": "winequaliwhite"
},  {
  "playerID": "ruthba01",
  "reducao": 0.54,
  "Algoritmo": "ga",
  "acuracia": 0.86,
  "dataset": "satimage"
} ,{
  "playerID": "ruthba01",
  "reducao": 0.71,
  "Algoritmo": "ga",
  "acuracia": 0.94,
  "dataset": "thyroid"
},  {
  "playerID": "ruthba01",
  "reducao": 0.54,
  "Algoritmo": "ga",
  "acuracia": 0.95,
  "dataset": "penbased"
},  {
  "playerID": "ruthba01",
  "reducao": 0.71,
  "Algoritmo": "ga",
  "acuracia": 0.94,
  "dataset": "texture"
} ,
{
  "playerID": "ruthba01",
  "reducao": 0.65,
  "Algoritmo": "ga",
  "acuracia": 0.87,
  "dataset": "page_blocks"
},  {
  "playerID": "ruthba01",
  "reducao": 0.60,
  "Algoritmo": "ga",
  "acuracia": 0.74,
  "dataset": "phoneme"
} ,  { "playerID": "ruthba01",
"reducao": 0.54,
"Algoritmo": "ga",
"acuracia": 0.88,
"dataset": "optdigits"
},  {
"playerID": "ruthba01",
"reducao": 0.52,
"Algoritmo": "ga",
"acuracia": 0.75,
"dataset": "ring"
},  {
"playerID": "ruthba01",
"reducao": 0.83,
"Algoritmo": "ga",
"acuracia": 0.70,
"dataset": "glass"
}
]
)});
  return main;
}
