// Механика умений (активности / эффекты / заряды) для dnd5e 5.x.
// Карта: ключ умения (как в content.mjs / INFUSIONS[].key) -> описание механики.
// build.mjs разворачивает компактные описания в полную схему system.activities / effects / system.uses.
// Формат описания см. в README раздела «Пересборка» и в featDoc()/mkActivity()/mkEffect() в build.mjs.
// Кратко: { uses:{max,recovery}, properties:['trait'], activities:[{kind,...}], effects:[{name,changes:[[key,mode,val]]}] }

export const MECH = {
  "feat-magical-tinkering": {
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "touch",
        "target": "self"
      }
    ]
  },
  "feat-spellcasting": {},
  "feat-infuse-item": {},
  "feat-right-tool": {
    "properties": [
      "trait"
    ]
  },
  "feat-tool-expertise": {
    "properties": [
      "trait"
    ]
  },
  "feat-flash-of-genius": {
    "uses": {
      "max": "max(1, @abilities.int.mod)",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": "itemUses",
        "roll": "max(1, @abilities.int.mod)",
        "rollName": "Бонус к броску",
        "rollVisible": true,
        "range": {
          "value": 30,
          "units": "ft"
        },
        "target": "creature"
      }
    ]
  },
  "feat-magic-item-adept": {
    "properties": [
      "trait"
    ]
  },
  "feat-spell-storing-item": {
    "uses": {
      "max": "2 * @abilities.int.mod",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "feat-magic-item-savant": {
    "properties": [
      "trait"
    ]
  },
  "feat-magic-item-master": {
    "properties": [
      "trait"
    ]
  },
  "feat-soul-of-artifice": {
    "activities": [
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "inf-returning-weapon": {
    "effects": [
      {
        "name": "Возвращающееся оружие",
        "img": "icons/weapons/thrown/dagger-ringed-steel.webp",
        "transfer": true,
        "changes": [
          [
            "system.bonuses.mwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.mwak.damage",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.damage",
            "add",
            "+1"
          ]
        ]
      }
    ]
  },
  "inf-animated-armor": {
    "properties": [
      "trait"
    ]
  },
  "inf-armor-of-magical-strength": {
    "uses": {
      "max": "max(1, @abilities.int.mod)",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": true,
        "roll": "@abilities.int.mod",
        "rollName": "Бонус Интеллекта к Силе",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      },
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "inf-armor-of-resistance": {
    "effects": [
      {
        "name": "Доспех сопротивления",
        "img": "icons/equipment/chest/breastplate-banded-steel.webp",
        "transfer": true,
        "changes": [
          [
            "system.traits.dr.value",
            "add",
            "fire"
          ]
        ]
      }
    ]
  },
  "inf-radiant-weapon": {
    "uses": {
      "max": "4",
      "recovery": {
        "period": "dawn",
        "type": "formula",
        "formula": "1d4"
      }
    },
    "effects": [
      {
        "name": "Излучающее свет оружие",
        "img": "icons/weapons/swords/sword-runed-gold.webp",
        "transfer": true,
        "changes": [
          [
            "system.bonuses.mwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.mwak.damage",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.damage",
            "add",
            "+1"
          ]
        ]
      }
    ],
    "activities": [
      {
        "kind": "save",
        "activation": "reaction",
        "ability": [
          "con"
        ],
        "dc": "spellcasting",
        "onSave": "none",
        "range": {
          "value": 5,
          "units": "ft"
        },
        "target": "creature",
        "consume": true
      }
    ]
  },
  "inf-ring-of-spell-restoring": {
    "uses": {
      "max": "6",
      "recovery": {
        "period": "dawn",
        "type": "formula",
        "formula": "1d6"
      }
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "inf-replicate-magic-item": {},
  "inf-repulsion-shield": {
    "uses": {
      "max": "4",
      "recovery": {
        "period": "dawn",
        "type": "formula",
        "formula": "1d4"
      }
    },
    "effects": [
      {
        "name": "Отталкивающий щит",
        "img": "icons/equipment/shield/round-wooden-boss-steel-brown.webp",
        "transfer": true,
        "changes": [
          [
            "system.attributes.ac.bonus",
            "add",
            "+1"
          ]
        ]
      }
    ],
    "activities": [
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": {
          "value": 5,
          "units": "ft"
        },
        "target": "creature"
      }
    ]
  },
  "inf-repeating-shot": {
    "effects": [
      {
        "name": "Повторный выстрел",
        "img": "icons/weapons/crossbows/crossbow-loaded.webp",
        "transfer": true,
        "changes": [
          [
            "system.bonuses.rwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.damage",
            "add",
            "+1"
          ]
        ]
      }
    ]
  },
  "inf-boots-of-winding-path": {
    "activities": [
      {
        "kind": "utility",
        "activation": "bonus",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": {
          "value": 15,
          "units": "ft"
        },
        "target": "self"
      }
    ]
  },
  "inf-homunculus-servant": {
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "inf-enhanced-defense": {
    "effects": [
      {
        "name": "Улучшенная защита",
        "img": "icons/equipment/shield/heater-steel-worn-blue.webp",
        "transfer": true,
        "changes": [
          [
            "system.attributes.ac.bonus",
            "add",
            "+1"
          ]
        ]
      }
    ]
  },
  "inf-enhanced-spellcasting-focus": {
    "effects": [
      {
        "name": "Улучшенная магическая фокусировка",
        "img": "icons/magic/symbols/runes-star-blue.webp",
        "transfer": true,
        "changes": [
          [
            "system.bonuses.msak.attack",
            "add",
            "1"
          ],
          [
            "system.bonuses.rsak.attack",
            "add",
            "1"
          ]
        ]
      }
    ]
  },
  "inf-enhanced-weapon": {
    "effects": [
      {
        "name": "Улучшенное оружие",
        "img": "icons/weapons/swords/sword-broad-engraved.webp",
        "transfer": true,
        "changes": [
          [
            "system.bonuses.mwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.attack",
            "add",
            "+1"
          ],
          [
            "system.bonuses.mwak.damage",
            "add",
            "+1"
          ],
          [
            "system.bonuses.rwak.damage",
            "add",
            "+1"
          ]
        ]
      }
    ]
  },
  "inf-mind-sharpener": {
    "uses": {
      "max": "4",
      "recovery": {
        "period": "dawn",
        "type": "formula",
        "formula": "1d4"
      }
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": true,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "inf-helm-of-awareness": {
    "effects": [
      {
        "name": "Шлем осведомлённости",
        "img": "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
        "changes": [
          [
            "flags.dnd5e.initiativeAdv",
            "override",
            "1"
          ]
        ]
      }
    ]
  },
  "alch-tools": {
    "properties": [
      "trait"
    ]
  },
  "alch-spells": {
    "properties": [
      "trait"
    ]
  },
  "alch-elixir": {
    "uses": {
      "max": "1",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "bonus",
        "consume": true,
        "roll": "1d6",
        "rollName": "Эффект эликсира",
        "rollVisible": true,
        "range": "self",
        "target": "creature"
      },
      {
        "kind": "heal",
        "activation": "bonus",
        "healing": {
          "n": 2,
          "d": 4,
          "types": [
            "healing"
          ]
        },
        "range": "touch",
        "target": "creature",
        "consume": false
      }
    ]
  },
  "alch-savant": {
    "properties": [
      "trait"
    ]
  },
  "alch-reagents": {
    "uses": {
      "max": "max(1, @abilities.int.mod)",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": false,
        "range": {
          "value": 30,
          "units": "ft"
        },
        "target": "creature"
      },
      {
        "kind": "heal",
        "activation": "action",
        "healing": {
          "formula": "2d8 + @abilities.int.mod",
          "types": [
            "healing"
          ]
        },
        "range": "touch",
        "target": "creature",
        "consume": false
      }
    ]
  },
  "alch-mastery": {
    "effects": [
      {
        "name": "Химическое мастерство",
        "img": "icons/magic/death/skull-poison-green.webp",
        "transfer": true,
        "changes": [
          [
            "system.traits.dr.value",
            "add",
            "acid"
          ],
          [
            "system.traits.dr.value",
            "add",
            "poison"
          ]
        ]
      }
    ]
  },
  "arti-tools": {
    "properties": [
      "trait"
    ]
  },
  "arti-spells": {
    "properties": [
      "trait"
    ]
  },
  "arti-cannon": {
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": false,
        "range": {
          "value": 5,
          "units": "ft"
        },
        "target": "self"
      }
    ]
  },
  "arti-firearm": {
    "properties": [
      "trait"
    ]
  },
  "arti-explosive": {
    "properties": [
      "trait"
    ]
  },
  "arti-fortified": {
    "properties": [
      "trait"
    ]
  },
  "smith-tools": {
    "properties": [
      "trait"
    ]
  },
  "smith-spells": {
    "properties": [
      "trait"
    ]
  },
  "smith-ready": {
    "properties": [
      "trait"
    ]
  },
  "smith-defender": {
    "activities": [
      {
        "kind": "utility",
        "activation": "action",
        "consume": false,
        "roll": "",
        "rollName": "",
        "rollVisible": false,
        "range": "self",
        "target": "self"
      }
    ]
  },
  "smith-extra-attack": {
    "properties": [
      "trait"
    ]
  },
  "smith-jolt": {
    "uses": {
      "max": "max(1, @abilities.int.mod)",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "damage",
        "activation": "reaction",
        "damage": [
          {
            "n": 2,
            "d": 6,
            "types": [
              "force"
            ]
          }
        ],
        "range": {
          "value": 60,
          "units": "ft"
        },
        "target": "creature",
        "consume": true
      },
      {
        "kind": "heal",
        "activation": "reaction",
        "healing": {
          "n": 2,
          "d": 6,
          "types": [
            "healing"
          ]
        },
        "range": {
          "value": 60,
          "units": "ft"
        },
        "target": "creature",
        "consume": true
      }
    ]
  },
  "smith-improved": {
    "properties": [
      "trait"
    ]
  },
  "armr-tools": {},
  "armr-spells": {},
  "armr-arcane-armor": {
    "properties": [
      "trait"
    ]
  },
  "armr-model": {
    "uses": {
      "max": "max(1, @abilities.int.mod)",
      "recovery": "lr"
    },
    "activities": [
      {
        "kind": "save",
        "activation": "action",
        "ability": [
          "str"
        ],
        "dc": "spellcasting",
        "onSave": "none",
        "damage": [
          {
            "n": 1,
            "d": 8,
            "types": [
              "thunder"
            ]
          }
        ],
        "range": {
          "value": 5,
          "units": "ft"
        },
        "target": "creature",
        "consume": false
      },
      {
        "kind": "attack",
        "activation": "action",
        "attackType": "ranged",
        "attackClass": "spell",
        "attackAbility": "int",
        "damage": [
          {
            "n": 1,
            "d": 6,
            "types": [
              "lightning"
            ]
          }
        ],
        "range": {
          "value": 90,
          "units": "ft"
        },
        "target": "creature",
        "consume": false
      },
      {
        "kind": "utility",
        "activation": "reaction",
        "consume": true,
        "roll": "",
        "rollName": "",
        "rollVisible": false,
        "range": {
          "value": 30,
          "units": "ft"
        },
        "target": "creature"
      }
    ]
  },
  "armr-extra-attack": {
    "properties": [
      "trait"
    ]
  },
  "armr-modifications": {
    "properties": [
      "trait"
    ]
  },
  "armr-perfected": {
    "properties": [
      "trait"
    ]
  }
};
