# Master AI Studio Prompt: Closed-Loop Digital Therapeutic Ecosystem (NutriCare AI)

Copy and paste the following prompt into **Google AI Studio** (using Freeform or Chat mode) to generate the complete, production-ready single-file web application.

***

### Prompt to Paste into Google AI Studio:

```text
Act as an expert full-stack web developer and elite UI/UX engineer. Build a complete, fully functional, responsive single-file web application (HTML, Tailwind CSS, and vanilla JavaScript) for a closed-loop digital therapeutic ecosystem called "TheraLoop AI" / "NutriCare AI".

The application must include the following core features and interactive modules:

1. Profile Setup & Biometric Calculations:
   - Input fields for Name, Age, Gender, Weight (kg), Height (cm), Email, Contact Details, and Emergency Contact Person (Name & Phone).
   - Automatic calculation of BMR using the Mifflin-St Jeor equation ($BMR = 10 \times \text{weight} + 6.25 \times \text{height} - 5 \times \text{age} + s$), TDEE (factoring activity level multipliers), and BMI with category status (Underweight, Normal, Overweight, Obese).

2. Health Screening Report Scanner:
   - File upload interface and a "Simulate Lab Panel" demo option.
   - AI analysis displaying a healthy record summary extracting key biomarkers (Fasting Glucose, Cholesterol, Blood Pressure, Triglycerides, and Risk Assessment).

3. AI Meal & Glycemic Impact Scanner:
   - Image upload or preset meal selection (e.g., Grilled Salmon Bowl, Avocado Toast).
   - Estimation of calories, macronutrients (Protein, Carbs, Fats), glycemic load, and sugar spike risk.

4. Daily Calorie Balance & Scorecard:
   - Real-time display of Daily TDEE allowance, consumed calories today, remaining calorie balance, and a therapeutic wellness score (e.g., 0-100 scale).

5. Reward Feature:
   - Streak counter and achievement badges (e.g., "Calorie Guardian", "Glycemic Master") unlocked when users maintain their daily targets.

6. Over-Consumption Alert:
   - A prominent warning banner and status update if the user's consumed calories exceed their calculated TDEE limit.

7. Emergency SOS & Family Alarm:
   - An emergency SOS button at the top header that triggers a visual red flashing screen, synthesizes an emergency siren tone using the Web Audio API, and displays direct phone call/SMS links to the configured family member.

Technical Requirements:
- Use Tailwind CSS CDN for styling with a sleek dark medical theme (slate-900 background, emerald and teal accents).
- Embed Lucide icons for clean visual navigation.
- Store user profile and logged meals in `localStorage` so data persists across sessions.
- Ensure the code is self-contained in a single, robust HTML file with zero external build steps required.
```

***

## How to Use This in Google AI Studio:
1. Open [Google AI Studio](https://aistudio.google.com/).
2. Start a new **Chat** or **Freeform** prompt.
3. Paste the text block above into the prompt input.
4. Set the model to `gemini-3-flash-preview` and click **Run**. Gemini will generate the complete, production-ready HTML/JS application code.