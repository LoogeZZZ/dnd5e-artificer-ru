// Сборка компендиума модуля «Изобретатель (Artificer) — RU».
// 1) Формирует документы Foundry (класс, подклассы, умения, инфузии, папки).
// 2) Пишет читаемые исходники в src/.
// 3) Компилирует LevelDB-пак в packs/izobretatel.
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ClassicLevel } from "classic-level";
import { CLASS_FEATURES, INFUSIONS, SUBCLASSES } from "./content.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MODULE = "dnd5e-artificer-ru";
const PACK = "izobretatel";
const PACK_DIR = join(ROOT, "packs", PACK);
const SRC_DIR = join(ROOT, "src");

const id = (seed) => createHash("md5").update(seed).digest("hex").slice(0, 16);
const uuid = (docId) => `Compendium.${MODULE}.${PACK}.Item.${docId}`;
const STATS = () => ({
  systemId: "dnd5e",
  systemVersion: "4.0.0",
  coreVersion: "13.0.0",
  createdTime: 0,
  modifiedTime: 0,
  lastModifiedBy: "artificerrubuilder",
  compendiumSource: null,
  duplicateSource: null
});

// ---------- Папки ----------
const FOLDERS = [
  { key: "folder-class", name: "Класс" },
  { key: "folder-subclass", name: "Подклассы" },
  { key: "folder-classfeat", name: "Классовые умения" },
  { key: "folder-subfeat", name: "Умения подклассов" },
  { key: "folder-infusion", name: "Инфузии" }
];
const folderId = (key) => id("FOLDER:" + key);

function folderDoc(f, sort) {
  const _id = folderId(f.key);
  return {
    _id,
    _key: `!folders!${_id}`,
    name: f.name,
    type: "Item",
    sorting: "m",
    folder: null,
    description: "",
    color: "#7a3b9e",
    sort,
    flags: {},
    _stats: STATS()
  };
}

// ---------- Базовый предмет «умение» (feat) ----------
function featDoc(spec, { folderKey, subtype }) {
  const _id = id("FEAT:" + spec.key);
  return {
    _id,
    _key: `!items!${_id}`,
    name: spec.name,
    type: "feat",
    img: spec.img || "icons/sundries/scrolls/scroll-runed-brown.webp",
    system: {
      description: { value: spec.html, chat: "" },
      source: { custom: "Tasha's Cauldron of Everything", book: "TCoE" },
      requirements: spec.requirements ?? "Изобретатель",
      type: { value: subtype, subtype: "" },
      properties: [],
      activation: { type: "", value: null, condition: "" },
      duration: { value: "", units: "" },
      target: { value: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "" }
    },
    effects: [],
    folder: folderId(folderKey),
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: STATS()
  };
}

// ---------- Инфузия (feat) ----------
function infusionDoc(inf) {
  const doc = featDoc(
    { key: "INF:" + inf.key, name: `${inf.name} (${inf.en})`, img: "icons/magic/symbols/runes-triangle-orange.webp", html: inf.html, requirements: "Инфузия изобретателя" },
    { folderKey: "folder-infusion", subtype: "class" }
  );
  return doc;
}

// ---------- Advancement-конструкторы ----------
const advHitPoints = () => ({
  _id: id("ADV:hp"),
  type: "HitPoints",
  configuration: {},
  value: {},
  title: "Хиты",
  icon: "",
  classRestriction: ""
});

const advASI = (level) => ({
  _id: id("ADV:asi:" + level),
  type: "AbilityScoreImprovement",
  configuration: { points: 2, fixed: {}, cap: 2 },
  value: {},
  level,
  title: "Увеличение характеристик",
  icon: ""
});

const advTrait = (key, level, title, configuration) => ({
  _id: id("ADV:trait:" + key),
  type: "Trait",
  configuration: { hint: "", mode: "default", allowReplacements: false, grants: [], choices: [], ...configuration },
  value: {},
  level,
  title,
  icon: ""
});

const advScale = (identifier, title, scale) => ({
  _id: id("ADV:scale:" + identifier),
  type: "ScaleValue",
  configuration: { identifier, type: "number", distance: { units: "" }, scale },
  value: {},
  title,
  icon: ""
});

const advSubclass = () => ({
  _id: id("ADV:subclass"),
  type: "Subclass",
  configuration: {},
  value: {},
  level: 3,
  title: "Специальность изобретателя",
  icon: ""
});

const advItemGrant = (key, level, uuids, title) => ({
  _id: id("ADV:grant:" + key),
  type: "ItemGrant",
  configuration: { items: uuids.map((u) => ({ uuid: u })), optional: false, spell: null },
  value: {},
  level,
  title,
  icon: ""
});

const advInfusionChoice = (poolUuids) => ({
  _id: id("ADV:infchoice"),
  type: "ItemChoice",
  configuration: {
    hint: "Выберите инфузии из списка изобретателя. На уровне можно заменить одну известную инфузию.",
    choices: {
      2: { count: 4, replacement: false },
      6: { count: 2, replacement: false },
      10: { count: 2, replacement: false },
      14: { count: 2, replacement: false },
      18: { count: 2, replacement: false }
    },
    allowDrops: true,
    type: "feat",
    pool: poolUuids.map((u) => ({ uuid: u })),
    restriction: {},
    spell: null
  },
  value: {},
  level: 0,
  title: "Известные инфузии",
  icon: ""
});

// ---------- Класс ----------
function classDoc() {
  const _id = id("CLASS:artificer");
  const featUuid = (k) => uuid(id("FEAT:" + k));
  const infPool = INFUSIONS.map((i) => uuid(id("FEAT:INF:" + i.key)));

  const grantsByLevel = {
    1: [["feat-magical-tinkering", "feat-spellcasting"], "Умения 1-го уровня"],
    2: [["feat-infuse-item"], "Инфузирование предмета"],
    3: [["feat-right-tool"], "Подходящий инструмент"],
    6: [["feat-tool-expertise"], "Компетентность во владении инструментами"],
    7: [["feat-flash-of-genius"], "Проблеск гениальности"],
    10: [["feat-magic-item-adept"], "Эксперт в обращении с магическими предметами"],
    11: [["feat-spell-storing-item"], "Хранящий заклинания предмет"],
    14: [["feat-magic-item-savant"], "Учёный по магическим предметам"],
    18: [["feat-magic-item-master"], "Мастер в обращении с магическими предметами"],
    20: [["feat-soul-of-artifice"], "Душа изобретения"]
  };

  const advancement = [
    advHitPoints(),
    advTrait("saves", 1, "Спасброски", { grants: ["saves:con", "saves:int"] }),
    advTrait("armor", 1, "Доспехи и оружие", { grants: ["armor:lgt", "armor:med", "armor:shield", "weapon:sim", "tool:thief", "tool:tinker"] }),
    advTrait("skills", 1, "Навыки", {
      choices: [{ count: 2, pool: ["skills:arc", "skills:his", "skills:inv", "skills:med", "skills:nat", "skills:prc", "skills:slt"] }]
    }),
    advScale("infusions-known", "Известные инфузии", { 2: { value: 4 }, 6: { value: 6 }, 10: { value: 8 }, 14: { value: 10 }, 18: { value: 12 } }),
    advScale("infused-items", "Влитые предметы", { 2: { value: 2 }, 6: { value: 3 }, 10: { value: 4 }, 14: { value: 5 }, 18: { value: 6 } }),
    advInfusionChoice(infPool),
    advSubclass(),
    ...[4, 8, 12, 16, 19].map(advASI),
    ...Object.entries(grantsByLevel).map(([lvl, [keys, title]]) =>
      advItemGrant("L" + lvl, Number(lvl), keys.map(featUuid), title))
  ];

  return {
    _id,
    _key: `!items!${_id}`,
    name: "Изобретатель",
    type: "class",
    img: "icons/tools/smithing/anvil.webp",
    system: {
      description: {
        value: `<p><em>Источник: Tasha's Cauldron of Everything.</em></p>
<p>Изобретатели — мастера изобретения. Они используют изобретательность и магию, чтобы раскрыть необычные возможности предметов. В глазах изобретателя весь мир — это механизм. Изобретатели овладевают магией прежде всего через инструменты, вливая магическую силу в обычные вещи и создавая удивительные изобретения и инфузии.</p>
<h3>Особенности класса</h3>
<ul>
<li><strong>Кость хитов:</strong> 1к8 за уровень изобретателя.</li>
<li><strong>Основная характеристика:</strong> Интеллект (заклинания, многие умения).</li>
<li><strong>Спасброски:</strong> Телосложение, Интеллект.</li>
<li><strong>Доспехи:</strong> лёгкие и средние доспехи, щиты.</li>
<li><strong>Оружие:</strong> простое оружие.</li>
<li><strong>Инструменты:</strong> воровские инструменты, инструменты ремесленника (тинкера) и один набор инструментов ремесленника по вашему выбору.</li>
<li><strong>Навыки:</strong> выберите два из: Магия, История, Анализ, Медицина, Природа, Внимательность, Ловкость рук.</li>
</ul>
<p>Изобретатель — заклинатель-«полукастер»: использует Интеллект, готовит заклинания, а в качестве фокусировки применяет инструменты ремесленника или воровские инструменты. На 2-м уровне открывается ключевое умение — <strong>Инфузирование предмета</strong>, на 3-м выбирается специальность (Алхимик, Артиллерист, Боевой кузнец или Бронник).</p>`,
        chat: ""
      },
      identifier: "artificer",
      levels: 1,
      hitDice: "d8",
      hitDiceUsed: 0,
      hd: { denomination: "d8", spent: 0 },
      source: { custom: "Tasha's Cauldron of Everything", book: "TCoE" },
      primaryAbility: { value: ["int"], all: true },
      spellcasting: {
        progression: "artificer",
        ability: "int",
        preparation: { formula: "" }
      },
      wealth: "5d4 * 10",
      advancement,
      startingEquipment: []
    },
    effects: [],
    folder: folderId("folder-class"),
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: STATS()
  };
}

// ---------- Подкласс ----------
function subclassDoc(sub) {
  const _id = id("SUBCLASS:" + sub.key);
  const byLevel = {};
  for (const f of sub.features) (byLevel[f.level] ??= []).push(f);
  const advancement = [
    ...Object.entries(byLevel).map(([lvl, feats]) =>
      advItemGrant("SUB:" + sub.key + ":L" + lvl, Number(lvl),
        feats.map((f) => uuid(id("FEAT:" + f.key))),
        "Умения " + lvl + "-го уровня"))
  ];
  return {
    _id,
    _key: `!items!${_id}`,
    name: sub.name,
    type: "subclass",
    img: sub.img,
    system: {
      description: { value: sub.html, chat: "" },
      identifier: sub.identifier,
      classIdentifier: "artificer",
      source: { custom: "Tasha's Cauldron of Everything", book: "TCoE" },
      advancement,
      spellcasting: { progression: "none", ability: "" }
    },
    effects: [],
    folder: folderId("folder-subclass"),
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: STATS()
  };
}

// ---------- Сборка ----------
const docs = [];
FOLDERS.forEach((f, i) => docs.push(folderDoc(f, (i + 1) * 100000)));
docs.push(classDoc());
for (const sub of SUBCLASSES) {
  docs.push(subclassDoc(sub));
  for (const f of sub.features) docs.push(featDoc(f, { folderKey: "folder-subfeat", subtype: "subclass" }));
}
for (const f of CLASS_FEATURES) docs.push(featDoc(f, { folderKey: "folder-classfeat", subtype: "class" }));
for (const inf of INFUSIONS) docs.push(infusionDoc(inf));

// Проверка уникальности _id
const seen = new Map();
for (const d of docs) {
  if (seen.has(d._id)) throw new Error(`Дубликат _id ${d._id}: «${d.name}» и «${seen.get(d._id)}»`);
  seen.set(d._id, d.name);
}

// Запись исходников в src/
rmSync(SRC_DIR, { recursive: true, force: true });
mkdirSync(SRC_DIR, { recursive: true });
const slug = (s) => s.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40);
for (const d of docs) {
  const kind = d._key.startsWith("!folders!") ? "folders" : d.type;
  const dir = join(SRC_DIR, kind);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${slug(d.name)}.${d._id}.json`), JSON.stringify(d, null, 2), "utf8");
}

// Компиляция LevelDB
rmSync(PACK_DIR, { recursive: true, force: true });
mkdirSync(PACK_DIR, { recursive: true });
const db = new ClassicLevel(PACK_DIR, { keyEncoding: "utf8", valueEncoding: "json" });
const batch = db.batch();
for (const d of docs) batch.put(d._key, d);
await batch.write();
await db.close();

const counts = docs.reduce((a, d) => {
  const k = d._key.startsWith("!folders!") ? "folders" : d.type;
  a[k] = (a[k] || 0) + 1;
  return a;
}, {});
console.log("Собрано документов:", docs.length);
console.log("По типам:", counts);
console.log("Пак:", PACK_DIR);
