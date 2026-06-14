// Сборка компендиума модуля «Изобретатель (Artificer) — RU».
// 1) Формирует документы Foundry (класс, подклассы, умения, инфузии, папки).
// 2) Пишет читаемые исходники в src/.
// 3) Компилирует LevelDB-пак в packs/izobretatel.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ClassicLevel } from "classic-level";
import { CLASS_FEATURES, INFUSIONS, SUBCLASSES } from "./content.mjs";
import { MECH } from "./mech.mjs";
import { ARTIFICER_SPELLS } from "./spells.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MODULE = "dnd5e-artificer-ru";
const PACK = "izobretatel";
const PACK_DIR = join(ROOT, "packs", PACK);
const JPACK = "izobretatel-zaklinaniya";
const JPACK_DIR = join(ROOT, "packs", JPACK);
const SRC_DIR = join(ROOT, "src");

const id = (seed) => createHash("md5").update(seed).digest("hex").slice(0, 16);
const uuid = (docId) => `Compendium.${MODULE}.${PACK}.Item.${docId}`;
const STATS = () => ({
  systemId: "dnd5e",
  systemVersion: "4.0.0",
  coreVersion: "13.0.0",
  createdTime: 0,
  modifiedTime: 0,
  lastModifiedBy: "artificerru00000",
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

// ---------- Активности / эффекты / заряды (схема dnd5e 5.x) ----------
const AE_MODE = { custom: 0, multiply: 1, add: 2, downgrade: 3, upgrade: 4, override: 5 };
const identSlug = (s) => (s || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "feat";

// system.uses (v5): { spent, max, recovery:[{period,type,formula?}] }
function mkUses(u) {
  if (!u) return { spent: 0, max: "", recovery: [] };
  const rec = (u.recovery == null ? [] : Array.isArray(u.recovery) ? u.recovery : [u.recovery]).map((r) =>
    typeof r === "string"
      ? { period: r, type: "recoverAll" }
      : { period: r.period, type: r.type || "recoverAll", ...(r.formula ? { formula: r.formula } : {}) });
  return { spent: 0, max: u.max ?? "", recovery: rec };
}

const SCALAR_ACT = new Set(["action", "bonus", "minute", "hour", "day"]);
const mkActivation = (a = "action") => ({ type: a, value: SCALAR_ACT.has(a) ? 1 : null, condition: "", override: false });

function mkConsumption(consume) {
  const targets = [];
  if (consume === true || consume === "itemUses")
    targets.push({ type: "itemUses", target: "", value: "1", scaling: { mode: "", formula: "" } });
  else if (consume === "activityUses")
    targets.push({ type: "activityUses", target: "", value: "1", scaling: { mode: "", formula: "" } });
  return { targets, scaling: { allowed: false, max: "" }, spellSlot: true };
}

function mkRange(r) {
  if (!r || r === "self") return { units: "self", special: "", override: false };
  if (r === "touch") return { units: "touch", special: "", override: false };
  return { value: String(r.value ?? ""), units: r.units ?? "ft", special: "", override: false };
}

function mkTarget(t) {
  const template = { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "ft" };
  let affects = { count: "", type: "", choice: false, special: "" };
  if (t === "self") affects.type = "self";
  else if (t === "creature") affects = { count: "1", type: "creature", choice: false, special: "" };
  else if (t && typeof t === "object") {
    if (t.template) Object.assign(template, t.template);
    affects = { count: String(t.count ?? ""), type: t.affects ?? "creature", choice: false, special: "" };
  }
  return { template, affects, prompt: true, override: false };
}

// DamageData-часть: {n,d} для кубов или {formula} для произвольной формулы
function dmgPart(p = {}) {
  const custom = p.formula ? { enabled: true, formula: p.formula } : { enabled: false, formula: "" };
  return {
    number: p.formula ? null : (p.n ?? null),
    denomination: p.formula ? null : (p.d ?? null),
    bonus: p.bonus || "",
    types: p.types || [],
    custom,
    scaling: { mode: p.scale || "", number: p.scaleN ?? null, formula: p.scaleFormula || "" }
  };
}

function mkActivity(featKey, idx, a) {
  const _id = id("ACT:" + featKey + ":" + idx);
  const base = {
    _id, type: a.kind, sort: a.sort || 0,
    ...(a.name ? { name: a.name } : {}),
    activation: mkActivation(a.activation),
    consumption: mkConsumption(a.consume),
    description: { chatFlavor: "" },
    duration: { concentration: !!a.concentration, value: String(a.durationValue ?? ""), units: a.durationUnits ?? "inst", special: "", override: false },
    effects: (a.effects || []).map((eid) => (a.kind === "save" ? { _id: eid, onSave: false } : { _id: eid })),
    range: mkRange(a.range),
    target: mkTarget(a.target),
    uses: mkUses(a.uses)
  };
  if (a.kind === "utility") {
    base.roll = { formula: a.roll || "", name: a.rollName || "", prompt: !!a.rollPrompt, visible: !!a.rollVisible };
  } else if (a.kind === "save") {
    base.damage = { onSave: a.onSave || "none", parts: (a.damage || []).map(dmgPart) };
    base.save = { ability: Array.isArray(a.ability) ? a.ability : [a.ability || "int"], dc: { calculation: a.dc || "spellcasting", formula: a.dcFormula || "" } };
  } else if (a.kind === "attack") {
    base.attack = { ability: a.attackAbility || "", bonus: a.attackBonus || "", critical: { threshold: null }, flat: false, type: { value: a.attackType || "melee", classification: a.attackClass || "weapon" } };
    base.damage = { critical: { bonus: "" }, includeBase: !!a.includeBase, parts: (a.damage || []).map(dmgPart) };
  } else if (a.kind === "damage") {
    base.damage = { critical: { allow: false, bonus: "" }, parts: (a.damage || []).map(dmgPart) };
  } else if (a.kind === "heal") {
    base.healing = dmgPart(a.healing || {});
  } else if (a.kind === "summon") {
    base.bonuses = { ac: a.bonuses?.ac || "", hd: a.bonuses?.hd || "", hp: a.bonuses?.hp || "", attackDamage: a.bonuses?.attackDamage || "", saveDamage: a.bonuses?.saveDamage || "", healing: a.bonuses?.healing || "" };
    base.creatureSizes = a.creatureSizes || [];
    base.creatureTypes = a.creatureTypes || [];
    base.match = { ability: a.match?.ability || "", attacks: !!(a.match && a.match.attacks), proficiency: !!(a.match && a.match.proficiency), saves: !!(a.match && a.match.saves) };
    base.profiles = (a.profiles || []).map((p, i) => ({ _id: id("SUMP:" + featKey + ":" + idx + ":" + i), count: String(p.count ?? ""), cr: String(p.cr ?? ""), level: { min: p.levelMin ?? null, max: p.levelMax ?? null }, name: p.name ?? "", types: p.types ?? [], uuid: p.uuid }));
    base.summon = { prompt: a.summonPrompt !== false, mode: a.summonMode || "", identifier: a.identifier || "" };
  }
  return [_id, base];
}

function mkEffect(featKey, idx, e) {
  const _id = id("AE:" + featKey + ":" + idx);
  return {
    _id,
    name: e.name,
    img: e.img || "icons/magic/symbols/runes-triangle-orange.webp",
    type: e.enchantment ? "enchantment" : "base",
    system: {},
    changes: (e.changes || []).map((c) => ({ key: c[0], mode: AE_MODE[c[1]] ?? 2, value: String(c[2]), priority: null })),
    disabled: e.enchantment ? true : !!e.disabled,
    transfer: e.enchantment ? false : (e.transfer ?? true),
    origin: null,
    duration: { startTime: null, seconds: null, combat: null, rounds: null, turns: null, startRound: null, startTurn: null },
    description: e.description || "",
    statuses: e.statuses || [],
    tint: "#ffffff",
    flags: e.flags || {},
    sort: 0,
    _stats: STATS()
  };
}

// ---------- Базовый предмет «умение» (feat) ----------
function featDoc(spec, { folderKey, subtype }) {
  const _id = id("FEAT:" + spec.key);
  const m = spec.mech || MECH[spec.mechKey ?? spec.key] || {};
  const activities = {};
  (m.activities || []).forEach((a, i) => { const [aid, obj] = mkActivity(spec.key, i, a); activities[aid] = obj; });
  const effects = (m.effects || []).map((e, i) => mkEffect(spec.key, i, e));
  return {
    _id,
    _key: `!items!${_id}`,
    name: spec.name,
    type: "feat",
    img: spec.img || "icons/sundries/scrolls/scroll-runed-brown.webp",
    system: {
      description: { value: spec.html, chat: "" },
      identifier: spec.identifier || identSlug(spec.key),
      source: { custom: "Tasha's Cauldron of Everything", book: "TCoE" },
      requirements: spec.requirements ?? "Изобретатель",
      type: { value: subtype, subtype: spec.subtype || "" },
      properties: m.properties || [],
      activities,
      uses: mkUses(m.uses)
    },
    effects,
    folder: folderId(folderKey),
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: STATS()
  };
}

// ---------- Инфузия (feat) ----------
function infusionDoc(inf) {
  return featDoc(
    { key: "INF:" + inf.key, mechKey: inf.key, identifier: identSlug(inf.key), name: `${inf.name} (${inf.en})`, img: inf.img || "icons/magic/symbols/runes-triangle-orange.webp", html: inf.html, requirements: "Инфузия изобретателя" },
    { folderKey: "folder-infusion", subtype: "class" }
  );
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
    advTrait("armor", 1, "Доспехи и оружие", { grants: ["armor:lgt", "armor:med", "armor:shl", "weapon:sim", "tool:thief", "tool:tinker"] }),
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

// ---------- Список заклинаний (JournalEntry, тип «spells») ----------
function spellListDocs() {
  const jid = id("JOURNAL:artificer-spells");
  const pid = id("JPAGE:artificer-spells");
  const page = {
    _id: pid,
    _key: `!journal.pages!${jid}.${pid}`,
    name: "Заклинания изобретателя",
    type: "spells",
    title: { show: false, level: 1 },
    image: {},
    video: { controls: true, volume: 0.5 },
    src: null,
    text: { format: 1, content: "" },
    system: {
      type: "class",
      identifier: "artificer",
      grouping: "level",
      description: { value: "<p>Список заклинаний класса «Изобретатель» (Tasha's Cauldron of Everything). Связанные заклинания берутся из компендиумов SRD системы dnd5e; отсутствующие в SRD перечислены отдельно — добавьте их вручную из своего источника при необходимости.</p>" },
      spells: ARTIFICER_SPELLS.linked,
      unlinkedSpells: ARTIFICER_SPELLS.unlinked.map((u) => ({
        _id: id("UNL:" + u.name),
        identifier: identSlug(u.name),
        name: u.name,
        system: { level: u.level, school: "" },
        source: { book: "TCoE", page: "", custom: "", uuid: "" }
      }))
    },
    sort: 0,
    ownership: { default: -1 },
    flags: {},
    category: null,
    _stats: STATS()
  };
  const journal = {
    _id: jid,
    _key: `!journal!${jid}`,
    name: "Заклинания изобретателя",
    pages: [pid],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    categories: [],
    _stats: STATS()
  };
  return { journal, page };
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
for (const d of docs) {
  // В LevelDB-паке встроенные ActiveEffect хранятся ОТДЕЛЬНЫМИ строками
  // (!items.effects!<itemId>.<effId>), а в самом предмете effects[] = массив id-строк.
  if (d._key.startsWith("!items!") && Array.isArray(d.effects) && d.effects.length) {
    const itemRow = { ...d, effects: d.effects.map((e) => e._id) };
    batch.put(d._key, itemRow);
    for (const eff of d.effects) {
      batch.put(`!items.effects!${d._id}.${eff._id}`, { ...eff, _key: `!items.effects!${d._id}.${eff._id}` });
    }
  } else {
    batch.put(d._key, d);
  }
}
await batch.write();
await db.close();

// Компиляция пака заклинаний (JournalEntry)
const { journal, page } = spellListDocs();
mkdirSync(join(SRC_DIR, "journal"), { recursive: true });
writeFileSync(join(SRC_DIR, "journal", `${journal._id}.json`), JSON.stringify({ ...journal, pages: [page] }, null, 2), "utf8");
rmSync(JPACK_DIR, { recursive: true, force: true });
mkdirSync(JPACK_DIR, { recursive: true });
const jdb = new ClassicLevel(JPACK_DIR, { keyEncoding: "utf8", valueEncoding: "json" });
const jbatch = jdb.batch();
jbatch.put(journal._key, journal);
jbatch.put(page._key, page);
await jbatch.write();
await jdb.close();

// Контроль: UUID страницы списка заклинаний должен быть прописан в module.json flags.dnd5e.spellLists
const pageUuid = `Compendium.${MODULE}.${JPACK}.JournalEntry.${journal._id}.JournalEntryPage.${page._id}`;
const manifest = JSON.parse(readFileSync(join(ROOT, "module.json"), "utf8"));
if (!(manifest.flags?.dnd5e?.spellLists || []).includes(pageUuid))
  console.warn("ВНИМАНИЕ: module.json flags.dnd5e.spellLists НЕ содержит UUID списка заклинаний:\n  " + pageUuid);
else console.log("Список заклинаний прописан в module.json:", pageUuid);

const counts = docs.reduce((a, d) => {
  const k = d._key.startsWith("!folders!") ? "folders" : d.type;
  a[k] = (a[k] || 0) + 1;
  return a;
}, {});
console.log("Собрано документов:", docs.length);
console.log("По типам:", counts);
console.log("Пак:", PACK_DIR);
