import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as vite from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Lab Report Analysis
app.post('/api/analyze-lab-report', async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          parts: [
            { text: "Extract key biomarkers from this health screening report. Focus on Fasting Glucose, Cholesterol (Total, LDL, HDL), Triglycerides, and Blood Pressure. Provide a summary and a risk assessment. Return the data in JSON format." },
            { inlineData: { data: image, mimeType } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            biomarkers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  status: { type: Type.STRING, description: "Normal, High, Low" }
                },
                required: ["name", "value", "unit", "status"]
              }
            },
            summary: { type: Type.STRING },
            riskAssessment: { type: Type.STRING }
          },
          required: ["biomarkers", "summary", "riskAssessment"]
        }
      }
    });

    if (!response.text) {
      throw new Error('No response from AI');
    }
    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error('Lab Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Meal Analysis
app.post('/api/analyze-meal', async (req, res) => {
  try {
    const { image, mimeType, mealName } = req.body;
    
    const prompt = mealName 
      ? `Analyze the meal "${mealName}". Provide calorie estimation, macronutrients (Protein, Carbs, Fats), glycemic load (0-100), and sugar spike risk (Low, Medium, High). Return in JSON.`
      : `Analyze this meal image. Provide calorie estimation, macronutrients (Protein, Carbs, Fats), glycemic load (0-100), and sugar spike risk (Low, Medium, High). Return in JSON.`;

    const contents = mealName 
      ? [{ parts: [{ text: prompt }] }]
      : [{ parts: [{ text: prompt }, { inlineData: { data: image, mimeType } }] }];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            calories: { type: Type.INTEGER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            glycemicLoad: { type: Type.INTEGER },
            sugarSpikeRisk: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["mealName", "calories", "protein", "carbs", "fats", "glycemicLoad", "sugarSpikeRisk", "analysis"]
        }
      }
    });

    if (!response.text) {
      throw new Error('No response from AI');
    }
    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error('Meal Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware
if (process.env.NODE_ENV !== 'production') {
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(viteServer.middlewares);
  app.use('*', async (req, res, next) => {
    try {
      const template = await viteServer.transformIndexHtml(req.originalUrl, await (await import('fs')).promises.readFile(path.resolve(__dirname, 'index.html'), 'utf-8'));
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
