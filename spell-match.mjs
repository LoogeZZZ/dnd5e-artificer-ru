import { ClassicLevel } from "classic-level";
const norm = s => s.toLowerCase().replace(/[''`]/g,"").replace(/\b(tasha s|tasha|mordenkainen s|leomund s|otiluke s|bigby s|evard s)\b/g,"").replace(/[^a-z0-9]+/g," ").trim();
async function index(dir){ const db=new ClassicLevel(dir,{keyEncoding:"utf8",valueEncoding:"json"}); const m=new Map(); for await(const[k,v]of db.iterator()){ if(k.startsWith("!items!")&&v.type==="spell"){ m.set(norm(v.name), {uuid:`Compendium.dnd5e.${dir.includes('24')?'spells24':'spells'}.Item.${v._id}`, name:v.name, level:v.system?.level}); } } await db.close(); return m; }
const s14=await index("./.tmp-spells"); const s24=await index("./.tmp-spells24");
console.log("spells(2014):",s14.size,"| spells24:",s24.size);
const LIST={
0:["Acid Splash","Booming Blade","Create Bonfire","Dancing Lights","Fire Bolt","Frostbite","Green-Flame Blade","Guidance","Light","Lightning Lure","Mage Hand","Magic Stone","Mending","Message","Poison Spray","Prestidigitation","Ray of Frost","Resistance","Shocking Grasp","Spare the Dying","Sword Burst","Thorn Whip","Thunderclap"],
1:["Absorb Elements","Alarm","Catapult","Cure Wounds","Detect Magic","Disguise Self","Expeditious Retreat","Faerie Fire","False Life","Feather Fall","Grease","Identify","Jump","Longstrider","Purify Food and Drink","Sanctuary","Snare","Tasha's Caustic Brew"],
2:["Aid","Alter Self","Arcane Lock","Blur","Continual Flame","Darkvision","Enhance Ability","Enlarge/Reduce","Heat Metal","Invisibility","Lesser Restoration","Levitate","Magic Mouth","Magic Weapon","Protection from Poison","Pyrotechnics","Rope Trick","See Invisibility","Skywrite","Spider Climb","Web"],
3:["Blink","Catnap","Create Food and Water","Dispel Magic","Elemental Weapon","Flame Arrows","Fly","Gaseous Form","Glyph of Warding","Haste","Intellect Fortress","Protection from Energy","Revivify","Tiny Servant","Water Breathing","Water Walk","Wind Wall"],
4:["Arcane Eye","Elemental Bane","Fabricate","Freedom of Movement","Leomund's Secret Chest","Mordenkainen's Faithful Hound","Mordenkainen's Private Sanctum","Otiluke's Resilient Sphere","Stone Shape","Stoneskin","Summon Construct"],
5:["Animate Objects","Bigby's Hand","Creation","Greater Restoration","Skill Empowerment","Transmute Rock","Wall of Stone"]
};
let linked=[], unlinked=[], total=0;
for(const lvl of Object.keys(LIST)){ for(const name of LIST[lvl]){ total++; const n=norm(name); const hit=s14.get(n)||s24.get(n); if(hit) linked.push(hit.uuid); else unlinked.push({name, level:Number(lvl)}); } }
console.log("TOTAL artificer spells:",total,"| LINKED:",linked.length,"| UNLINKED:",unlinked.length);
console.log("\nUNLINKED (not in SRD packs):");
unlinked.forEach(u=>console.log("  L"+u.level, u.name));
import("node:fs").then(fs=>{ fs.writeFileSync("./.spell-list.json", JSON.stringify({linked, unlinked, total}, null, 2)); console.log("\nsaved .spell-list.json"); });
