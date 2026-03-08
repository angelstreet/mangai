import { db } from './db'

const beastKing = {
  id: 'seed-beast-king',
  user_id: 'user_dev',
  title: 'Beast King',
  hook: `Humans exist in a dinosaur-dominated world where apex predators define the food chain.\nElite protectors called Beast Kings are humanity's only shield against extinction.\nOne boy with a hidden triple-soul will change what it means to protect — or to dominate.`,
  protagonists: JSON.stringify([
    { name: 'MC (Beast King Candidate)', pitch: "Village boy, secretly 3-soul, wants to protect not dominate." },
    { name: 'The Shaman', pitch: "Keeper of pact knowledge — her survival determines humanity's future." },
    { name: 'The Rival', pitch: "2-soul warrior from competing village, enemy turned reluctant ally." },
    { name: 'The Devourer', pitch: "Mirror villain who chose carnivore pact + weaving — what MC could become." },
    { name: 'The Seam King', pitch: "Weaver leader aiming for a 7-soul vessel to end humanity's prey status." }
  ]),
  sell_pitch: `In a world where power comes from ancient pacts with nature and beasts, the line between protector and predator is everything. Beast King is a shonen manga about earning strength through discipline and cooperation in a world that rewards domination. Dinosaurs are not the enemy — the humans who steal their power are.`,
  theme: 'Becoming a predator to protect prey — and the identity cost that comes with it.',
  twist: "The world may have been reset or engineered. The MC's rare 3-soul might be a deliberate design, not an accident.",
  storyline: 'Wall Expansion + Rite Hunt: expand safe human zones while recovering lost pact rites and protecting shamans.'
}

export async function seed(): Promise<void> {
  await db.execute({
    sql: `INSERT OR IGNORE INTO ideas
      (id, user_id, title, hook, protagonists, sell_pitch, theme, twist, storyline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      beastKing.id,
      beastKing.user_id,
      beastKing.title,
      beastKing.hook,
      beastKing.protagonists,
      beastKing.sell_pitch,
      beastKing.theme,
      beastKing.twist,
      beastKing.storyline,
    ],
  })
  // Fix existing records: user_id and title
  await db.execute({
    sql: `UPDATE ideas SET user_id = ? WHERE id = ? AND user_id = 'system'`,
    args: ['user_dev', beastKing.id],
  })
  await db.execute({
    sql: `UPDATE ideas SET title = ? WHERE id = ? AND (title IS NULL OR title = '')`,
    args: [beastKing.title, beastKing.id],
  })
}
