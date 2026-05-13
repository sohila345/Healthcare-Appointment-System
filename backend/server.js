require("dotenv").config();
require("./utils/SlotCleaner");

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const doctorRoutes = require("./routes/doctor");
const appointmentRoutes = require("./routes/appointment");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ─────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static("upload"));

// ─── DB ──────────────────────────────────────
connectDB();

// ─── ARABIC NORMALIZATION ─────────────────────────────────────────────────────
function normalizeArabic(text) {
  if (!text) return "";
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[^\u0600-\u06FF\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
 
// ─── STOP WORDS ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "في", "من", "على", "الى", "عن", "مع", "هذا", "هذه", "التي", "الذي",
  "كان", "كانت", "يكون", "وهو", "وهي", "انا", "هو", "هي", "لي", "لا",
  "ما", "كل", "قد", "او", "ان", "اي", "عند", "بعد", "قبل", "حتى",
  "لكن", "لو", "لم", "لن", "هل", "اذا", "وان", "وقد", "وكان", "وهذا",
  "وهذه", "عندي", "عندك", "عنده", "يوجد", "توجد", "اريد", "اعاني",
  "اشعر", "لدي", "لدى", "يمكن", "هناك", "هنا", "ايضا", "جدا", "منذ",
  "غير", "حيث", "بعض", "فقط", "اكثر", "اقل", "مثل", "نفس", "وقت",
]);
 
function tokenize(text) {
  return normalizeArabic(text)
    .split(" ")
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}
 
// ─── COSINE SIMILARITY ────────────────────────────────────────────────────────
function cosineSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const freqA = {}, freqB = {};
  tokensA.forEach((w) => (freqA[w] = (freqA[w] || 0) + 1));
  tokensB.forEach((w) => (freqB[w] = (freqB[w] || 0) + 1));
  const allWords = new Set([...tokensA, ...tokensB]);
  let dot = 0, magA = 0, magB = 0;
  allWords.forEach((w) => {
    const a = freqA[w] || 0;
    const b = freqB[w] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}
 
// ─── LOAD DATA ────────────────────────────────────────────────────────────────
let data = [];
let categories = [];
let catWords = {};

// pre-tokenized questions للسرعة
let tokenizedQuestions = []; 
const DATA_FILE       = "./clean_data.json";
const TOKENS_FILE     = "./tokenized_questions.json";
const CAT_WORDS_FILE  = "./cat_words.json";
const CAT_LIST_FILE   = "./categories.json";
 
try {
  console.log("📂 Loading data...");
  data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  console.log(`✅ Loaded ${data.length} records`);
} catch (err) {
  console.error("❌ Error loading JSON:", err.message);
  process.exit(1);
}
 
// ─── PRE-TOKENIZED QUESTIONS INDEX ───────────────────────────────────────────
if (fs.existsSync(TOKENS_FILE)) {
  console.log("⚡ Restoring tokenized questions...");
  tokenizedQuestions = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
  console.log("✅ Tokenized questions restored");
} else {
  console.log("⚙️  Tokenizing all questions...");
  tokenizedQuestions = data.map((item, i) => {
    if (i % 100000 === 0) console.log(`   → ${i} / ${data.length}`);
    return tokenize(item.question);
  });
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokenizedQuestions));
  console.log("✅ Tokenized questions saved");
}
 
// ─── CATEGORY WORD FREQUENCY INDEX ───────────────────────────────────────────
if (fs.existsSync(CAT_WORDS_FILE) && fs.existsSync(CAT_LIST_FILE)) {
  console.log("⚡ Restoring category index...");
  catWords = JSON.parse(fs.readFileSync(CAT_WORDS_FILE, "utf-8"));
  categories = JSON.parse(fs.readFileSync(CAT_LIST_FILE, "utf-8"));
  console.log(`✅ Category index restored — ${categories.length} specialties`);
} else {
  console.log("⚙️  Building category index...");
  data.forEach((item, i) => {
    const cat = item.category || "عام";
    if (!catWords[cat]) catWords[cat] = {};
    tokenizedQuestions[i].forEach((w) => {
      catWords[cat][w] = (catWords[cat][w] || 0) + 1;
    });
  });
  categories = Object.keys(catWords);
  fs.writeFileSync(CAT_WORDS_FILE, JSON.stringify(catWords));
  fs.writeFileSync(CAT_LIST_FILE, JSON.stringify(categories));
  console.log(`✅ Category index saved — ${categories.length} specialties`);
} 
// ─── MODE 1: البحث في الداتا سيت بـ Cosine Similarity ────────────────────────
const MATCH_THRESHOLD = 0.3; // score من 0 لـ 1
 
function searchDataset(query) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return { found: false }; 
  let bestScore = 0;
  let bestIndex = -1; 
  tokenizedQuestions.forEach((docTokens, i) => {
    const score = cosineSimilarity(queryTokens, docTokens);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }); 
  if (bestIndex !== -1 && bestScore >= MATCH_THRESHOLD) {
    return {
      found: true,
      answer: data[bestIndex].answer,
      matched_question: data[bestIndex].question,
      category: data[bestIndex].category,
      score: parseFloat(bestScore.toFixed(2)),
    };
  } 
  return { found: false, score: parseFloat(bestScore.toFixed(2)) };
}
// ─── MODE 2: تحديد التخصص بـ Word Frequency ──────────────────────────────────
function predictSpecialty(query) {
  const tokens = tokenize(query);
  if (!tokens.length) return null; 
  const scores = categories
    .map((cat) => {
      const words = catWords[cat];
      const total = Object.values(words).reduce((a, b) => a + b, 0);
      let score = 0;
      tokens.forEach((w) => {
        if (words[w]) score += words[w] / total;
      });
      return { specialty: cat, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  if (!scores.length) return null; 
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return scores.slice(0, 5).map((s) => ({
    specialty: s.specialty,
    percentage: parseFloat(((s.score / total) * 100).toFixed(1)),
  }));
}
// ─── CHAT ROUTE ───────────────────────────────────────────────────────────────
app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
   if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({
      success: false,
      message: "message مطلوب ولازم يكون نص",
    });
  } 
  // أولاً: ابحث في الداتا سيت
  const datasetResult = searchDataset(userMessage); 
  if (datasetResult.found) {
    // ─── Mode 1: إجابة مباشرة من الداتا ─────────────────────────────────────
    return res.json({
      reply: datasetResult.answer,
      category:datasetResult.category
    });
  }
  // ثانياً: حدد التخصص
  const specialties = predictSpecialty(userMessage); 
  if (!specialties || !specialties.length) {
    return res.json({
      reply: "مش قادر أحدد التخصص المناسب، ممكن تكتب الأعراض بشكل أوضح؟",
      note: "السؤال غير موجود في قاعدة البيانات",
    });} 
  const top = specialties[0];
  const others = specialties.slice(1); 
  let reply = `بناءً على الأعراض اللي ذكرتها، سؤالك على الأرجح يخص تخصص "${top.specialty}" بنسبة ${top.percentage}%.\n\n`;
  if (others.length) {
    reply += "احتمالات أخرى:\n";
    others.forEach((s) => {
      reply += `• ${s.specialty}: ${s.percentage}%\n`;
    });}
  reply += "\nينصح بمراجعة طبيب متخصص للتشخيص الدقيق."; 
  return res.json({
    reply,
    note: "السؤال غير موجود في قاعدة البيانات — النتيجة مبنية على تحليل الأعراض",
  });});
// ─── ROUTES ──────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// ─── ERROR HANDLING ─────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ─── START SERVER ───────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});