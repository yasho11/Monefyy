import sequelize from "../config/db";
import Quest from "../models/Quest";
import questsData from "./questSeeds.json";

const seedQuests = async () => {
  try {
    await sequelize.sync(); // make sure DB tables exist

    await Quest.bulkCreate(questsData);

    console.log("✅ Quest seed completed from JSON!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding quests:", error);
    process.exit(1);
  }
};

seedQuests();
