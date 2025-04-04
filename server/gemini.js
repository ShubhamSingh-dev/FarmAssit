import axios from "axios";

async function convertImageToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Image download failed:", error.message);
    throw new Error("Failed to process image. Please try again.");
  }
}

function formatResponse(text, language) {
  // Clean and standardize response format
  const bullets = {
    english: "•",
    hindi: "▪️",
    tamil: "•",
    marathi: "▪️",
    gujarati: "•",
  };

  return text
    .replace(/\*\*/g, "")
    .replace(/```/g, "")
    .replace(/\n\s*\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `${bullets[language] || "•"} ${line}`)
    .join("\n");
}

const languagePrompts = {
  english: `Analyze this crop photo and provide:
• Disease/Pest Risk: [brief list]
• Nutrient Status: [adequate/deficient]
• Growth Stage: [current phase]
• Recommended Actions:
  - [priority]
  - [secondary]
• Prevention Tips:
  - [tip 1]
  - [tip 2]
Keep response concise (under 400 characters).`,

  hindi: `इस फसल फोटो का विश्लेषण करें:
▪️ रोग/कीट जोखिम: [संक्षिप्त]
▪️ पोषक स्थिति: [पर्याप्त/कमी]
▪️ विकास अवस्था: [वर्तमान]
▪️ सिफारिशें:
  - [प्राथमिक]
  - [द्वितीयक]
▪️ रोकथाम सुझाव:
  - [सुझाव 1]
  - [सुझाव 2]
संक्षिप्त उत्तर दें (400 अक्षर से कम)।`,

  tamil: `இந்த பயிர் படத்தை பகுப்பாய்வு செய்ய:
• நோய்/பூச்சி அபாயம்: [சுருக்கமாக]
• ஊட்டச்சத்து நிலை: [போதுமான/குறைபாடு]
• வளர்ச்சி நிலை: [தற்போதைய]
• பரிந்துரைகள்:
  - [முன்னுரிமை]
  - [இரண்டாம் நிலை]
• தடுப்பு உதவிக்குறிப்புகள்:
  - [உதவிக்குறிப்பு 1]
  - [உதவிக்குறிப்பு 2]
சுருக்கமாக பதிலளிக்கவும் (400 எழுத்துகளுக்குள்).`,

  marathi: `या पिकाच्या फोटोचे विश्लेषण करा:
▪️ रोग/कीट धोका: [संक्षिप्त]
▪️ पोषक स्थिती: [पुरेशी/कमतरता]
▪️ वाढीचा टप्पा: [सध्याचा]
▪️ शिफारस:
  - [अग्रिमता]
  - [दुय्यम]
▪️ प्रतिबंध उपाय:
  - [उपाय 1]
  - [उपाय 2]
संक्षिप्त उत्तर द्या (400 अक्षरांपेक्षा कमी).`,

  gujarati: `આ પાકની ફોટોનું વિશ્લેષણ કરો:
• રોગ/કીટનો જોખમ: [સંક્ષિપ્ત]
• પોષક સ્થિતિ: [પર્યાપ્ત/ઉણપ]
• વિકાસની અવસ્થા: [વર્તમાન]
• ભલામણો:
  - [પ્રાથમિકતા]
  - [ગૌણ]
• અટકાવ ટીપ્સ:
  - [ટીપ 1]
  - [ટીપ 2]
સંક્ષિપ્ત જવાબ આપો (400 અક્ષરો以内).`,
};

const errorMessages = {
  english: "❌ Analysis failed. Please try again later.",
  hindi: "❌ विश्लेषण असफल। कृपया बाद में पुनः प्रयास करें।",
  tamil: "❌ பகுப்பாய்வு தோல்வியுற்றது. பிறகு முயற்சிக்கவும்.",
  marathi: "❌ विश्लेषण अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा.",
  gujarati: "❌ વિશ્લેષણ નિષ્ફળ. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
};

export async function analyzeWithGemini(imageUrl, language = "english") {
  try {
    // Validate language
    language = language.toLowerCase();
    if (!languagePrompts[language]) {
      console.warn(`Invalid language "${language}", defaulting to English`);
      language = "english";
    }

    const imageBase64 = await convertImageToBase64(imageUrl);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: languagePrompts[language] },
              { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            ],
          },
        ],
      },
      { timeout: 30000 }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    return formatResponse(rawText, language);
  } catch (error) {
    console.error("Analysis error:", error.response?.data || error.message);
    return errorMessages[language] || errorMessages.english;
  }
}
