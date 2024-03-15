import { economy } from "./pressList/economy.js";
import { broadCast } from "./pressList/broadcast.js";
import { it } from "./pressList/IT.js";
import { english } from "./pressList/english.js";
import { sports } from "./pressList/sports.js";
import { magazine } from "./pressList/magazine.js";
import { local } from "./pressList/local.js";

export const pressData = [
  { category: "종합/경제", pressList: shufflePressList(economy) },
  { category: "방송/통신", pressList: shufflePressList(broadCast) },
  { category: "IT", pressList: shufflePressList(it) },
  { category: "영자지", pressList: shufflePressList(english) },
  { category: "스포츠/연예", pressList: shufflePressList(sports) },
  { category: "매거진/전문지", pressList: shufflePressList(magazine) },
  { category: "지역", pressList: shufflePressList(local) },
];

function shufflePressList(pressArr) {
  return pressArr.sort(() => Math.random() - 0.5);
}
