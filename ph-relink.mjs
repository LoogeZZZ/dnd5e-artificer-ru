import { ClassicLevel } from "classic-level";
import fs from "node:fs";
const norm = s => s.toLowerCase().replace(/[''`]/g,"").replace(/\b(tasha s|tasha|mordenkainen s|leomund s|otiluke s|bigby s|evard s|melf s)\b/g,"").replace(/[^a-z0-9]+/g," ").trim();
// PHantom: name "Русское [English]" -> map normalized-English -> {uuid, ru}
const db = new ClassicLevel("./.tmp-ph", { keyEncoding:"utf8", valueEncoding:"json" });
const phMap = new Map();
for await (const [k,v] of db.iterator()) {
  if (!k.startsWith("!items!") || v.type!=="spell") continue;
  const m = v.name.match(/^(.*?)\s*\[(.+?)\]\s*$/);
  const ru = m ? m[1].trim() : v.name;
  const en = m ? m[2].trim() : v.name;
  phMap.set(norm(en), { uuid:`Compendium.lomeo-dnd5e-phantom.zaklinaniya-srd-phantom.Item.${v._id}`, ru, en });
}
await db.close();
const LIST={0:["Acid Splash","Booming Blade","Create Bonfire","Dancing Lights","Fire Bolt","Frostbite","Green-Flame Blade","Guidance","Light","Lightning Lure","Mage Hand","Magic Stone","Mending","Message","Poison Spray","Prestidigitation","Ray of Frost","Resistance","Shocking Grasp","Spare the Dying","Sword Burst","Thorn Whip","Thunderclap"],1:["Absorb Elements","Alarm","Catapult","Cure Wounds","Detect Magic","Disguise Self","Expeditious Retreat","Faerie Fire","False Life","Feather Fall","Grease","Identify","Jump","Longstrider","Purify Food and Drink","Sanctuary","Snare","Tasha's Caustic Brew"],2:["Aid","Alter Self","Arcane Lock","Blur","Continual Flame","Darkvision","Enhance Ability","Enlarge/Reduce","Heat Metal","Invisibility","Lesser Restoration","Levitate","Magic Mouth","Magic Weapon","Protection from Poison","Pyrotechnics","Rope Trick","See Invisibility","Skywrite","Spider Climb","Web"],3:["Blink","Catnap","Create Food and Water","Dispel Magic","Elemental Weapon","Flame Arrows","Fly","Gaseous Form","Glyph of Warding","Haste","Intellect Fortress","Protection from Energy","Revivify","Tiny Servant","Water Breathing","Water Walk","Wind Wall"],4:["Arcane Eye","Elemental Bane","Fabricate","Freedom of Movement","Leomund's Secret Chest","Mordenkainen's Faithful Hound","Mordenkainen's Private Sanctum","Otiluke's Resilient Sphere","Stone Shape","Stoneskin","Summon Construct"],5:["Animate Objects","Bigby's Hand","Creation","Greater Restoration","Skill Empowerment","Transmute Rock","Wall of Stone"]};
const RU={'Booming Blade':'Гулкий клинок','Create Bonfire':'Сотворение костра','Frostbite':'Обморожение','Green-Flame Blade':'Клинок зелёного пламени','Lightning Lure':'Манок молнии','Magic Stone':'Волшебный камень','Sword Burst':'Взрыв клинков','Thorn Whip':'Терновый кнут','Thunderclap':'Раскат грома','Absorb Elements':'Поглощение стихий','Catapult':'Катапульта','Snare':'Силок',"Tasha's Caustic Brew":'Едкое варево Таши','Pyrotechnics':'Пиротехника','Skywrite':'Небесное послание','Catnap':'Кошачий сон','Elemental Weapon':'Стихийное оружие','Flame Arrows':'Огненные стрелы','Intellect Fortress':'Крепость интеллекта','Tiny Servant':'Крошечный слуга','Elemental Bane':'Стихийная погибель',"Leomund's Secret Chest":'Тайный сундук Леомунда',"Mordenkainen's Faithful Hound":'Верный пёс Морденкайнена',"Mordenkainen's Private Sanctum":'Уединённое убежище Морденкайнена',"Otiluke's Resilient Sphere":'Упругая сфера Отилюка','Summon Construct':'Призыв конструкта',"Bigby's Hand":'Рука Бигби','Skill Empowerment':'Усиление навыка','Transmute Rock':'Превращение камня'};
let linked=[], unlinked=[], total=0;
for(const lvl of Object.keys(LIST)) for(const name of LIST[lvl]){ total++; const hit=phMap.get(norm(name)); if(hit) linked.push(hit.uuid); else unlinked.push({name:(RU[name]||name)+' ('+name+')', en:name, level:Number(lvl)}); }
console.log("PHantom spells indexed:", phMap.size);
console.log("artificer total:",total,"| LINKED(PHantom RU):",linked.length,"| unlinked:",unlinked.length);
console.log("unlinked:", unlinked.map(u=>u.en).join(", ")||"(нет!)");
const body='// Список заклинаний класса «Изобретатель» (Tasha\'s Cauldron of Everything).\n'+
  '// linked — UUID русских заклинаний из перевода PHantom (lomeo-dnd5e-phantom, пак zaklinaniya-srd-phantom).\n'+
  '// unlinked — отсутствующие в переводе; имя на русском + (English) для ручного добавления.\n\n'+
  'export const ARTIFICER_SPELLS = {\n  linked: '+JSON.stringify(linked,null,2).replace(/\n/g,'\n  ')+',\n'+
  '  unlinked: '+JSON.stringify(unlinked,null,2).replace(/\n/g,'\n  ')+'\n};\n';
fs.writeFileSync('spells.mjs',body,'utf8');
console.log("spells.mjs пересобран на PHantom UUID");
