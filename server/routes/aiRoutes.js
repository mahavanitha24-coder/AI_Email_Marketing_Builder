
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Only logged-in users can generate emails
router.use(authMiddleware);

// Generate AI marketing email using Google Gemini
router.post("/generate", async (req, res) => {
  try {
    const { product, audience, goal, tone } = req.body;

    // Validate inputs
    if (
      ![product, audience, goal, tone].every(
        (value) =>
          typeof value === "string" &&
          value.trim().length > 0
      )
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        message: "Gemini API key is not configured"
      });
    }

    // Load Google Gemini SDK
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // Start measuring Gemini generation time
    const startTime = Date.now();

    // Generate AI marketing email
    const response = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",

      input: `Write a professional marketing email.

Product: ${product.trim()}
Audience: ${audience.trim()}
Goal: ${goal.trim()}
Tone: ${tone.trim()}

Include a catchy subject, greeting, short engaging body,
clear call to action, and professional closing.

Use 100-130 words. Make it original and relevant.
Do not invent prices, discounts, features, or guarantees.
Return only the completed email.`
    });

    // Display Gemini generation time in backend terminal
    console.log(
      "Gemini generation time:",
      ((Date.now() - startTime) / 1000).toFixed(2),
      "seconds"
    );

    const generatedEmail = response.output_text;

    // Check generated response
    if (!generatedEmail) {
      return res.status(502).json({
        message: "Gemini did not generate an email"
      });
    }

    return res.status(200).json({
      message: "AI email generated successfully!",
      generatedEmail
    });

  } catch (error) {
    console.error("Gemini AI generation error:", error);

    const status = error.status || error.statusCode;

    if (status === 429) {
      return res.status(429).json({
        message: "Gemini API quota or rate limit reached. Please try again later."
      });
    }

    if (status === 401 || status === 403) {
      return res.status(status).json({
        message: "Gemini API authentication or permission error. Check your API key."
      });
    }

    return res.status(500).json({
      message: "Failed to generate AI email. Please check the backend terminal."
    });
  }
});

module.exports = router;
