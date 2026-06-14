// Список заклинаний класса «Изобретатель» (Tasha's Cauldron of Everything).
// linked — UUID заклинаний из SRD-паков dnd5e (имена локализуются переводом Babele/PHantom).
// unlinked — заклинания, отсутствующие в SRD; имя на русском + (English) для поиска при ручном добавлении.

export const ARTIFICER_SPELLS = {
  linked: [
    "Compendium.dnd5e.spells.Item.JLTQyqXEaJDrTXyW",
    "Compendium.dnd5e.spells.Item.CAxSzHWizrafT033",
    "Compendium.dnd5e.spells.Item.EOmsUcFQJTfG2oio",
    "Compendium.dnd5e.spells.Item.P7mF2MxSuVJwHRRY",
    "Compendium.dnd5e.spells.Item.Bnn9Nzajixvow9xi",
    "Compendium.dnd5e.spells.Item.Utk1OQRwYkMkFRD3",
    "Compendium.dnd5e.spells.Item.kjmjY0zlE6IEiQVL",
    "Compendium.dnd5e.spells.Item.icZokbgV1jIMpNCv",
    "Compendium.dnd5e.spells.Item.g2u9PYfqWQAyg9OI",
    "Compendium.dnd5e.spells.Item.udsLtG0BugXHR2JQ",
    "Compendium.dnd5e.spells.Item.ctW81uiX56xZR2c5",
    "Compendium.dnd5e.spells.Item.dl8YwvMboBqX2OC4",
    "Compendium.dnd5e.spells.Item.XvbiNhNqXXIFisIy",
    "Compendium.dnd5e.spells.Item.8zT7njvqbpXs4Cel",
    "Compendium.dnd5e.spells.Item.7p9IuWrSWFgfyQo2",
    "Compendium.dnd5e.spells.Item.uUWb1wZgtMou0TVP",
    "Compendium.dnd5e.spells.Item.ghXTfe7sgCbgf1Q8",
    "Compendium.dnd5e.spells.Item.A3q2gTNqG6fvNGrv",
    "Compendium.dnd5e.spells.Item.zPGohqJRir6MyQ3U",
    "Compendium.dnd5e.spells.Item.nqBDWkVOfcGZt4YU",
    "Compendium.dnd5e.spells.Item.7e3QXF10hLNDEdr6",
    "Compendium.dnd5e.spells.Item.pub0OWVEB71XQx1n",
    "Compendium.dnd5e.spells.Item.etgcR9wqmrhyZ0tx",
    "Compendium.dnd5e.spells.Item.3OZnNhunvRtPOQmH",
    "Compendium.dnd5e.spells.Item.ZrTc23tToJ0JpH2h",
    "Compendium.dnd5e.spells.Item.B0pnIcc52O6G8hi8",
    "Compendium.dnd5e.spells.Item.Kn7K5PtYUJAKZTTp",
    "Compendium.dnd5e.spells.Item.gvdA9nPuWLck4tBl",
    "Compendium.dnd5e.spells.Item.Opwh2PdX4runSBlm",
    "Compendium.dnd5e.spells.Item.8RTDOt80u8aBv9qx",
    "Compendium.dnd5e.spells.Item.8cse7rit0oswRPUP",
    "Compendium.dnd5e.spells.Item.UDUnlfPsOAbq2RSE",
    "Compendium.dnd5e.spells.Item.MK6gpQMeDFo0cP9f",
    "Compendium.dnd5e.spells.Item.hJ6ZiA3fpoY8v9cp",
    "Compendium.dnd5e.spells.Item.9eOZDBImVKxbeOyZ",
    "Compendium.dnd5e.spells.Item.WahI41a3goVUg0x1",
    "Compendium.dnd5e.spells.Item.2yHXEcrRbadZDr5M",
    "Compendium.dnd5e.spells.Item.1N8dDMMgZ1h1YJ3B",
    "Compendium.dnd5e.spells.Item.F0GsG0SJzsIOacwV",
    "Compendium.dnd5e.spells.Item.MRxldJd6C4bsBo3O",
    "Compendium.dnd5e.spells.Item.7v06rdmUakoTk1LQ",
    "Compendium.dnd5e.spells.Item.Sgjrf8qqv97CCWM4",
    "Compendium.dnd5e.spells.Item.MAxM77CDUu8dgIRQ",
    "Compendium.dnd5e.spells.Item.ap4dmtshjEbwU3Ts",
    "Compendium.dnd5e.spells.Item.DQzlB5Y3k791W5bH",
    "Compendium.dnd5e.spells.Item.KJRVzeMQXPj8Gtyx",
    "Compendium.dnd5e.spells.Item.UJJu9c2UvCzVljiP",
    "Compendium.dnd5e.spells.Item.GSvLWcdCZLQkilXT",
    "Compendium.dnd5e.spells.Item.BV0mpbHh29IbbIj5",
    "Compendium.dnd5e.spells.Item.15Fa6q1nH27XfbR8",
    "Compendium.dnd5e.spells.Item.yfbK8gZqESlaoY5t",
    "Compendium.dnd5e.spells.Item.2IWiZAJtOGDoKjiz",
    "Compendium.dnd5e.spells.Item.pB7XVYwdGNcUG935",
    "Compendium.dnd5e.spells.Item.Szvk5FEVQW3uhJi5",
    "Compendium.dnd5e.spells.Item.j8NtLXOOJ3GAKF8I",
    "Compendium.dnd5e.spells.Item.LmRHHMtplpxr9fX6",
    "Compendium.dnd5e.spells.Item.13uVuBQP6VaiSPvC",
    "Compendium.dnd5e.spells.Item.YBda6nLKjxdT1LbS",
    "Compendium.dnd5e.spells.Item.ew6GA8dJy2spQmFW",
    "Compendium.dnd5e.spells.Item.ImlCJQwR1VL40Qem",
    "Compendium.dnd5e.spells.Item.7Fw7Bf1k3xxDVr5L",
    "Compendium.dnd5e.spells.Item.da0a1t2FqaTjRZGT",
    "Compendium.dnd5e.spells.Item.QvGcdRUSNRKEQJlK",
    "Compendium.dnd5e.spells.Item.ReMbjfeOKoSj3O79",
    "Compendium.dnd5e.spells.Item.ATo0Eb63TDtnu6iA",
    "Compendium.dnd5e.spells.Item.lnaGnxMzpYnbw1uU",
    "Compendium.dnd5e.spells.Item.WzvJ7G3cqvIubsLk",
    "Compendium.dnd5e.spells.Item.NmoRmM1mhuM3pqnY"
  ],
  unlinked: [
    {
      "name": "Гулкий клинок (Booming Blade)",
      "en": "Booming Blade",
      "level": 0
    },
    {
      "name": "Сотворение костра (Create Bonfire)",
      "en": "Create Bonfire",
      "level": 0
    },
    {
      "name": "Обморожение (Frostbite)",
      "en": "Frostbite",
      "level": 0
    },
    {
      "name": "Клинок зелёного пламени (Green-Flame Blade)",
      "en": "Green-Flame Blade",
      "level": 0
    },
    {
      "name": "Манок молнии (Lightning Lure)",
      "en": "Lightning Lure",
      "level": 0
    },
    {
      "name": "Волшебный камень (Magic Stone)",
      "en": "Magic Stone",
      "level": 0
    },
    {
      "name": "Взрыв клинков (Sword Burst)",
      "en": "Sword Burst",
      "level": 0
    },
    {
      "name": "Терновый кнут (Thorn Whip)",
      "en": "Thorn Whip",
      "level": 0
    },
    {
      "name": "Раскат грома (Thunderclap)",
      "en": "Thunderclap",
      "level": 0
    },
    {
      "name": "Поглощение стихий (Absorb Elements)",
      "en": "Absorb Elements",
      "level": 1
    },
    {
      "name": "Катапульта (Catapult)",
      "en": "Catapult",
      "level": 1
    },
    {
      "name": "Силок (Snare)",
      "en": "Snare",
      "level": 1
    },
    {
      "name": "Едкое варево Таши (Tasha's Caustic Brew)",
      "en": "Tasha's Caustic Brew",
      "level": 1
    },
    {
      "name": "Пиротехника (Pyrotechnics)",
      "en": "Pyrotechnics",
      "level": 2
    },
    {
      "name": "Небесное послание (Skywrite)",
      "en": "Skywrite",
      "level": 2
    },
    {
      "name": "Кошачий сон (Catnap)",
      "en": "Catnap",
      "level": 3
    },
    {
      "name": "Стихийное оружие (Elemental Weapon)",
      "en": "Elemental Weapon",
      "level": 3
    },
    {
      "name": "Огненные стрелы (Flame Arrows)",
      "en": "Flame Arrows",
      "level": 3
    },
    {
      "name": "Крепость интеллекта (Intellect Fortress)",
      "en": "Intellect Fortress",
      "level": 3
    },
    {
      "name": "Крошечный слуга (Tiny Servant)",
      "en": "Tiny Servant",
      "level": 3
    },
    {
      "name": "Стихийная погибель (Elemental Bane)",
      "en": "Elemental Bane",
      "level": 4
    },
    {
      "name": "Тайный сундук Леомунда (Leomund's Secret Chest)",
      "en": "Leomund's Secret Chest",
      "level": 4
    },
    {
      "name": "Верный пёс Морденкайнена (Mordenkainen's Faithful Hound)",
      "en": "Mordenkainen's Faithful Hound",
      "level": 4
    },
    {
      "name": "Уединённое убежище Морденкайнена (Mordenkainen's Private Sanctum)",
      "en": "Mordenkainen's Private Sanctum",
      "level": 4
    },
    {
      "name": "Упругая сфера Отилюка (Otiluke's Resilient Sphere)",
      "en": "Otiluke's Resilient Sphere",
      "level": 4
    },
    {
      "name": "Призыв конструкта (Summon Construct)",
      "en": "Summon Construct",
      "level": 4
    },
    {
      "name": "Рука Бигби (Bigby's Hand)",
      "en": "Bigby's Hand",
      "level": 5
    },
    {
      "name": "Усиление навыка (Skill Empowerment)",
      "en": "Skill Empowerment",
      "level": 5
    },
    {
      "name": "Превращение камня (Transmute Rock)",
      "en": "Transmute Rock",
      "level": 5
    }
  ]
};
