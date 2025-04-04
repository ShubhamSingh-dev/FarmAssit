import { Telegraf, Markup } from "telegraf";
import axios from "axios";
import "dotenv/config.js";
import { analyzeWithGemini } from "./gemini.js";

// Environment variables check
if (!process.env.TELEGRAM_BOT_TOKEN)
  throw new Error("❌ TELEGRAM_BOT_TOKEN missing");
if (!process.env.GEMINI_API_KEY) throw new Error("❌ GEMINI_API_KEY missing");
if (!process.env.WEATHER_API_KEY) throw new Error("❌ WEATHER_API_KEY missing");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Language options
const languages = {
  english: "🇬🇧 English",
  hindi: "🇮🇳 हिंदी",
  tamil: "🇮🇳 தமிழ்",
  malayalam: "🇮🇳 മലയാളം",
  marathi: "🇮🇳 मराठी",
  gujarati: "🇮🇳 ગુજરાતી",
  punjabi: "🇮🇳 ਪੰਜਾਬੀ",
};

// User language preferences
const userLanguage = {};

// Add this near the top with other constants
const MAX_CALLBACK_RESPONSE_TIME = 5000; // 5 seconds

// Government schemes data
const schemesData = {
  Gujarat: [
    "✅ Mukhyamantri Kisan Sahay Yojana - Crop insurance for farmers.",
    "✅ Soil Health Card Scheme - Free soil testing & guidance.",
    "✅ PM-KISAN - ₹6,000 yearly direct benefit.",
  ],
  "Uttar Pradesh": [
    "✅ PM-KISAN - ₹6,000/year for small farmers.",
    "✅ Kisan Rin Mochan Yojana - Loan waiver for eligible farmers.",
    "✅ Solar Pump Subsidy - Financial aid for solar irrigation pumps.",
  ],
  Punjab: [
    "✅ Punjab Smart Farming Initiative - Tech-based farming support.",
    "✅ Paddy Straw Management Subsidy - Eco-friendly disposal support.",
    "✅ PM-KISAN - ₹6,000 annual direct transfer.",
  ],
  Bihar: [
    "✅ Bihar Krishi Input Anudan - Subsidy on fertilizers & seeds.",
    "✅ PM-KISAN - ₹6,000 yearly support.",
    "✅ Organic Farming Subsidy - 50% subsidy for organic transition.",
  ],
  Maharashtra: [
    "✅ Maha Agri Subsidy - Financial aid for modern farming tools.",
    "✅ PM-KISAN - ₹6,000 yearly support.",
    "✅ Jalyukt Shivar Abhiyan - Water conservation program.",
  ],
  "Madhya Pradesh": [
    "✅ Mukhyamantri Krishi Vikas Yojana - Financial aid for farmers.",
    "✅ PM-KISAN - ₹6,000 yearly direct benefit.",
    "✅ Solar Pump Subsidy - Support for solar irrigation.",
  ],
  Rajasthan: [
    "✅ Rajasthan Kisan Loan Waiver - Loan relief for farmers.",
    "✅ Organic Farming Scheme - Grants for organic farmers.",
    "✅ PM-KISAN - ₹6,000 yearly support.",
  ],
  "Tamil Nadu": [
    "✅ Tamil Nadu Farmer's Welfare Fund - Insurance & financial aid.",
    "✅ PM-KISAN - ₹6,000 yearly benefit.",
    "✅ Agriculture Mechanization Scheme - Farming equipment discounts.",
  ],
};

// Crop database with seasonal tips
const cropDatabase = {
  wheat: {
    displayName: "🌾 Wheat",
    seasons: ["Rabi (Oct-Mar)"],
    tips: [
      "• Sow in well-drained loamy soil",
      "• Maintain 20-22°C temperature",
      "• Irrigate immediately after sowing",
      "• Apply 120:60:40 kg/ha NPK",
      "• Control weeds with Sulfosulfuron",
    ],
  },
  maize: {
    displayName: "🌽 Maize",
    seasons: ["Kharif (Jun-Sep)", "Rabi (Oct-Dec)"],
    tips: [
      "• Requires 21-27°C temperature",
      "• Sow 2-3 cm deep in rows",
      "• Apply 120:60:40 kg/ha NPK",
      "• Critical irrigation at tasseling",
      "• Control stem borer with Carbaryl",
    ],
  },
  rice: {
    displayName: "🍚 Rice",
    seasons: ["Kharif (Jun-Nov)"],
    tips: [
      "• Flood fields with 5-10 cm water",
      "• Maintain 25-35°C temperature",
      "• Apply 100:50:50 kg/ha NPK",
      "• Transplant 20-25 day old seedlings",
      "• Control blast disease with Tricyclazole",
    ],
  },
  potato: {
    displayName: "🥔 Potato",
    seasons: ["Rabi (Oct-Mar)"],
    tips: [
      "• Plant in loose, well-drained soil",
      "• Maintain 15-20°C temperature",
      "• Apply 150:100:100 kg/ha NPK",
      "• Earthing up after 30 days",
      "• Control late blight with Mancozeb",
    ],
  },
};

// Helper functions
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&");
}

function getFarmingAdvice(weatherData) {
  const weather = weatherData.weather[0].main.toLowerCase();
  const temp = weatherData.main.temp;
  const wind = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;

  let advice = [];

  if (weather.includes("rain")) {
    advice.push("🌧️ Good time for natural irrigation");
    advice.push("⚠️ Avoid chemical spraying today");
    advice.push("🚜 Check for waterlogging in fields");
  }
  if (temp > 35) {
    advice.push("🔥 Water crops early morning/late evening");
    advice.push("🌿 Provide shade for sensitive plants");
  }
  if (temp < 10) {
    advice.push("❄️ Protect crops from frost damage");
    advice.push("⏳ Delay planting cold-sensitive crops");
  }
  if (wind > 15) {
    advice.push("💨 Secure loose items in fields");
    advice.push("🌱 Protect young plants from wind");
  }
  if (humidity > 80) {
    advice.push("🦠 Watch for fungal diseases");
  }

  return advice.length > 0
    ? "• " + advice.join("\n• ")
    : "🌤️ Normal weather - good for farming activities";
}

// Menu functions
function showMainMenu(ctx) {
  return ctx.reply(
    "👋 Welcome to the AI Farming Assistant! 🌾\nWhat would you like to do?",
    Markup.keyboard([
      ["📸 Crop Analysis", "💰 Gov Schemes"],
      ["🌤️ Weather Info", "📚 Farming Tips"],
    ])
      .resize()
      .oneTime()
  );
}

function showStateMenu(ctx) {
  return ctx.reply(
    "🌍 Select your state:",
    Markup.keyboard([
      ["Gujarat", "UP", "Punjab"],
      ["Bihar", "Maharashtra", "TN"],
      ["Other States", "🔙 Main Menu"],
    ])
      .resize()
      .oneTime()
  );
}

function showOtherStatesMenu(ctx) {
  const otherStates = Object.keys(schemesData).filter(
    (state) =>
      ![
        "Gujarat",
        "Uttar Pradesh",
        "Punjab",
        "Bihar",
        "Maharashtra",
        "Tamil Nadu",
      ].includes(state)
  );

  const buttons = [];
  for (let i = 0; i < otherStates.length; i += 3) {
    buttons.push(otherStates.slice(i, i + 3));
  }
  buttons.push(["🔙 Main Menu"]);

  return ctx.reply(
    "📜 Select your state:",
    Markup.keyboard(buttons).resize().oneTime()
  );
}

// Command handlers
bot.start((ctx) => {
  console.log("✅ Bot started");
  showMainMenu(ctx);
});

bot.hears("🔙 Main Menu", (ctx) => showMainMenu(ctx));

// Government schemes flow
bot.hears("💰 Gov Schemes", (ctx) => showStateMenu(ctx));
bot.hears("Other States", (ctx) => showOtherStatesMenu(ctx));
bot.hears(Object.keys(schemesData), async (ctx) => {
  const state = ctx.message.text;
  const schemes = schemesData[state];
  await ctx.reply(`🌍 ${state} Schemes:\n\n${schemes.join("\n")}`);
  showMainMenu(ctx);
});

// Updated Crop analysis flow with language selection
bot.hears("📸 Crop Analysis", (ctx) => {
  // Show language selection first
  const buttons = Object.entries(languages).map(([code, name]) => {
    return Markup.button.callback(name, `lang_${code}`);
  });

  // Split into rows of 2 buttons each
  const buttonRows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    buttonRows.push(buttons.slice(i, i + 2));
  }

  ctx.reply(
    "🌍 Please select your preferred language:",
    Markup.inlineKeyboard(buttonRows)
  );
});

// Handle language selection
bot.action(/^lang_(.+)/, async (ctx) => {
  // Changed regex to capture properly
  try {
    const languageCode = ctx.match[1]; // Now correctly extracts after "lang_"
    console.log("Extracted language code:", languageCode); // Debug

    // Validate language exists
    if (!languages[languageCode]) {
      console.error(
        "Invalid language:",
        languageCode,
        "Available:",
        Object.keys(languages)
      );
      return ctx.answerCbQuery(`❌ Language not supported`);
    }

    // Store selection
    userLanguage[ctx.from.id] = languageCode;

    // Update message
    await ctx.editMessageText(
      `✅ Selected: ${languages[languageCode]}\n\n` +
        "📷 Please send a clear crop photo:",
      Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Change Language", "change_lang")],
      ])
    );

    await ctx.answerCbQuery();
  } catch (error) {
    console.error("Language selection error:", error);
    await ctx.answerCbQuery("⚠️ Error selecting language");
  }
});

// Handle change language request
bot.action("change_lang", async (ctx) => {
  const buttons = Object.entries(languages).map(([code, name]) => {
    return Markup.button.callback(name, `lang_${code}`);
  });

  const buttonRows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    buttonRows.push(buttons.slice(i, i + 2));
  }

  await ctx.editMessageText(
    "🌍 Please select your preferred language:",
    Markup.inlineKeyboard(buttonRows)
  );
  await ctx.answerCbQuery();
});

// Updated photo handler to use selected language
bot.on("photo", async (ctx) => {
  try {
    console.log("Photo received, starting analysis..."); // Debug log

    await ctx.replyWithChatAction("typing");

    // Get highest resolution photo
    const photo = ctx.message.photo.pop();
    console.log("Photo file_id:", photo.file_id); // Debug

    // Get file link
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    console.log("File URL:", fileLink.href); // Debug

    // Get language (default to english)
    const language = userLanguage[ctx.from.id] || "english";
    console.log("Using language:", language); // Debug

    // Analyze with Gemini
    const analysisResult = await analyzeWithGemini(fileLink.href, language);
    console.log("Analysis result:", analysisResult); // Debug

    await ctx.reply(
      analysisResult,
      Markup.keyboard([["📸 Analyze Another", "🔙 Main Menu"]])
        .resize()
        .oneTime()
    );
  } catch (error) {
    console.error("Full analysis error:", error); // Detailed error log

    await ctx.reply(
      "❌ Analysis failed. Please try again with a clearer photo.",
      Markup.keyboard([["🔙 Main Menu"]])
        .resize()
        .oneTime()
    );
  }
});

bot.hears("📸 Analyze Another", (ctx) => {
  ctx.reply(
    "📷 Send another crop photo:",
    Markup.keyboard([["🔙 Main Menu"]])
      .resize()
      .oneTime()
  );
});

// Weather flow
bot.hears("🌤️ Weather Info", (ctx) => {
  ctx.reply(
    "How to get weather info:",
    Markup.keyboard([
      [Markup.button.locationRequest("📍 Share Location")],
      ["🏘 Enter Location", "🔙 Main Menu"],
    ])
      .resize()
      .oneTime()
  );
});

bot.on("location", async (ctx) => {
  try {
    await ctx.replyWithChatAction("typing");
    const { latitude, longitude } = ctx.message.location;
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const w = weather.data;
    await ctx.replyWithMarkdown(
      `*🌦 ${w.name} Weather*\n` +
        `🌡 ${w.main.temp}°C (Feels ${w.main.feels_like}°C)\n` +
        `💧 ${w.main.humidity}% Humidity\n` +
        `🌬 ${w.wind.speed} km/h Wind\n` +
        `☁ ${w.weather[0].description}\n\n` +
        `*🧑‍🌾 Farming Advice:*\n${getFarmingAdvice(w)}`,
      Markup.keyboard([["🔙 Main Menu"]])
        .resize()
        .oneTime()
    );
  } catch (error) {
    console.error("Weather error:", error);
    ctx.reply(
      "❌ Weather data unavailable. Try again later.",
      Markup.keyboard([["🔙 Main Menu"]])
        .resize()
        .oneTime()
    );
  }
});

bot.hears("🏘 Enter Location", (ctx) => {
  ctx.reply(
    "Enter your city/village name:",
    Markup.keyboard([["🔙 Main Menu"]])
      .resize()
      .oneTime()
  );
});

// Farming Tips Flow
bot.hears("📚 Farming Tips", (ctx) => {
  const buttons = Object.keys(cropDatabase).map((cropId) => {
    const crop = cropDatabase[cropId];
    return Markup.button.callback(crop.displayName, `crop_${cropId}`);
  });

  const buttonRows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    buttonRows.push(buttons.slice(i, i + 2));
  }

  ctx.reply(
    "🌱 Select your crop for seasonal farming advice:",
    Markup.inlineKeyboard(buttonRows)
  );
});

// Crop Selection Handler
bot.action(/^crop_/, async (ctx) => {
  try {
    const cropId = ctx.match[0].replace("crop_", "");
    const crop = cropDatabase[cropId];

    if (!crop) {
      throw new Error("Selected crop not found");
    }

    const responseText = `
*${crop.displayName} Farming Tips*

📅 *Best Seasons:* ${crop.seasons.join(", ")}

📝 *Recommendations:*
${crop.tips.join("\n")}

💡 *Pro Tip:* Rotate crops to maintain soil health
    `;

    await ctx.answerCbQuery();
    await ctx.editMessageText(responseText, {
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Back to Crop Selection", "back_to_crops")],
      ]),
    });
  } catch (error) {
    console.error("Crop selection error:", error);
    await ctx.answerCbQuery("⚠️ Failed to load crop information");
    await ctx.editMessageText(
      "❌ Sorry, we couldn't retrieve the farming tips. Please try again.",
      Markup.inlineKeyboard([
        [Markup.button.callback("🔄 Try Again", "retry_crops")],
      ])
    );
  }
});

// Handle back button
bot.action("back_to_crops", async (ctx) => {
  const buttons = Object.keys(cropDatabase).map((cropId) => {
    const crop = cropDatabase[cropId];
    return Markup.button.callback(crop.displayName, `crop_${cropId}`);
  });

  const buttonRows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    buttonRows.push(buttons.slice(i, i + 2));
  }

  await ctx.editMessageText(
    "🌱 Select your crop for seasonal farming advice:",
    Markup.inlineKeyboard(buttonRows)
  );
  await ctx.answerCbQuery();
});

// Handle retry button
bot.action("retry_crops", async (ctx) => {
  const buttons = Object.keys(cropDatabase).map((cropId) => {
    const crop = cropDatabase[cropId];
    return Markup.button.callback(crop.displayName, `crop_${cropId}`);
  });

  const buttonRows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    buttonRows.push(buttons.slice(i, i + 2));
  }

  await ctx.editMessageText(
    "🌱 Select your crop for seasonal farming advice:",
    Markup.inlineKeyboard(buttonRows)
  );
  await ctx.answerCbQuery();
});

// Handle text input for weather
bot.on("text", async (ctx) => {
  if (
    !["🔙 Main Menu", ...Object.keys(schemesData)].includes(ctx.message.text) &&
    !ctx.message.text.startsWith("🏘")
  ) {
    try {
      await ctx.replyWithChatAction("typing");
      const weather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${ctx.message.text}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

      const w = weather.data;
      await ctx.replyWithMarkdown(
        `*🌦 ${w.name} Weather*\n` +
          `🌡 ${w.main.temp}°C (Feels ${w.main.feels_like}°C)\n` +
          `💧 ${w.main.humidity}% Humidity\n` +
          `🌬 ${w.wind.speed} km/h Wind\n` +
          `☁ ${w.weather[0].description}\n\n` +
          `*🧑‍🌾 Farming Advice:*\n${getFarmingAdvice(w)}`,
        Markup.keyboard([["🔙 Main Menu"]])
          .resize()
          .oneTime()
      );
    } catch (error) {
      ctx.reply(
        "❌ Location not found. Try again with correct spelling.",
        Markup.keyboard([["🔙 Main Menu"]])
          .resize()
          .oneTime()
      );
    }
  }
});

// Error handling middleware
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);

  // Try to notify user
  ctx.reply("⚠️ An error occurred. Please try again.").catch((e) => {
    console.error("Failed to send error message:", e);
  });

  // For callback queries, attempt to answer
  if (ctx.callbackQuery) {
    ctx.answerCbQuery("Sorry, an error occurred").catch((e) => {
      console.error("Failed to answer callback query:", e);
    });
  }
});

// Start bot
bot.launch().then(() => console.log("🚀 Bot running"));
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
