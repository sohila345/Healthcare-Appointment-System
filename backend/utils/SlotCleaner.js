const cron = require("node-cron");
const Slot = require("../models/Slot");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

// كل 10 دقيقة 
cron.schedule("*/10 * * * *", async () => {
  try {
    const now = dayjs();

    const slots = await Slot.find({
      isExpired: false,
    });

    for (const slot of slots) {
      const slotDateTime = dayjs(
        `${slot.date} ${slot.time}`,
        "YYYY-MM-DD hh:mm A"
      );

      if (slotDateTime.isBefore(now)) {
        slot.isExpired = true;

        await slot.save();
      }
    }

    console.log("Expired slots updated");
  } catch (err) {
    console.log("Cron error:", err.message);
  }
});