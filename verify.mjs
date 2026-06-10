import { ClassicLevel } from "classic-level";

const db = new ClassicLevel("packs/izobretatel", { keyEncoding: "utf8", valueEncoding: "json" });
try {
  const items = new Map();
  for await (const [k, v] of db.iterator()) {
    if (k.startsWith("!items!"))
      items.set(`Compendium.dnd5e-artificer-ru.izobretatel.Item.${v._id}`, v.name);
  }

  let refs = 0, missing = 0;
  for await (const [k, v] of db.iterator()) {
    if (!k.startsWith("!items!")) continue;
    for (const a of (v.system?.advancement || [])) {
      const pool = [...(a.configuration?.items || []), ...(a.configuration?.pool || [])];
      for (const it of pool) {
        refs++;
        if (!items.has(it.uuid)) {
          missing++;
          console.log("MISSING ref в", v.name, "->", it.uuid);
        }
      }
    }
  }
  console.log(`Предметов: ${items.size}. Проверено ссылок advancement: ${refs}. Битых: ${missing}.`);
} finally {
  await db.close();
}
