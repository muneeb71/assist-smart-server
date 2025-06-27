export const getRiskAssessmentPrompt = (
  industry,
  activityType,
  location,
  existingControlMeasures,
  responsibleDepartments
) => {
  return `You are an AI assistant that generates structured JSON for a Health & Safety Risk Assessment document. Based on the following input fields:
 
- industry: ${{ industry }}
- activityType: ${{ activityType }}
- location: ${{ location }}
- existingControlMeasures: ${{ existingControlMeasures }}
- responsibleDepartments: ${{ responsibleDepartments }}
 
Generate a JSON response with the following structure. The output must be formatted as professional safety documentation content (e.g., factory and warehouse safety).
 
Return **only JSON**. Do **not** include explanations.
 
The JSON must follow this schema:
 
{
  "purpose": "Document purpose tailored to the industry and activity type.",
  "scope": "Document scope tailored to the industry and location.",
  "introduction": "Comprehensive introduction describing risk categories, objectives, and importance.",
  "chapters": [
    {
      "chapterTitle": "Chapter – 01 (General Arrangements)",
      "activities": [
        {
          "activity": "General Preparation & Arrangements",
          "hazardAspect": "Slip, trip, fall; heat stress; inclement weather",
          "riskImpact": "Personal injury, fatigue, fainting, delayed emergency response",
          "probability": 4,
          "severity": 3,
          "riskLevel": "Medium",
          "controlMeasures": "Personnel inducted and trained; PPE enforced; emergency contact info posted; fire extinguishers in place; cold water available; emergency team designated",
          "residualRiskProbability": 1,
          "residualRiskSeverity": 3,
          "residualRiskLevel": "Low",
          "actionSupervision": "H&S Team, Supervisors"
        }
      ]
    },
    {
      "chapterTitle": "Chapter – 02 (Food Production Area)",
      "activities": [ { ... } ]
    },
    ...
  ],
  "riskAssessmentMatrix": {
    "1": {
      "1": "Low",
      "2": "Low",
      ...
    },
    ...
  }
}`;
};

export const getRiskAssessmentStructurePrompt = (industry) => {
  return `Generate a detailed table of contents for a risk assessment document in the ${industry} industry, including:
- Glossary of terms
- Purpose
- Scope
- Introduction
- 6 chapters, each with a chapter name and a list of activity names (e.g., Chapter: Arrangement and Preparations, Activities: General Arrangement and Preparations, Delivery of raw products and food)
- A section for the Risk Assessment Matrix (RAM)

Return the result as a structured JSON object with keys: glossary, purpose, scope, introduction, chapters (array of {chapterName, activities}), and ram.`;
};

export const getRiskAssessmentChapterTablePrompt = (
  chapterName,
  activities
) => {
  return `You are an AI assistant that generates a detailed risk assessment table in JSON for a specific chapter of a Health & Safety Risk Assessment document. The chapter is: "${chapterName}". The activities to cover are:

${JSON.stringify(activities, null, 2)}

For each activity, generate a JSON object with the following fields:
- activity
- hazardAspect
- riskImpact
- probability (1-5)
- severity (1-5)
- riskLevel (Low/Medium/High)
- controlMeasures
- residualRiskProbability (1-5)
- residualRiskSeverity (1-5)
- residualRiskLevel (Low/Medium/High)
- actionSupervision

Return only JSON in this format:
{
  "chapterTitle": "${chapterName}",
  "activities": [
    {
      "activity": "...",
      "hazardAspect": "...",
      "riskImpact": "...",
      "probability": 3,
      "severity": 4,
      "riskLevel": "Medium",
      "controlMeasures": "...",
      "residualRiskProbability": 1,
      "residualRiskSeverity": 2,
      "residualRiskLevel": "Low",
      "actionSupervision": "..."
    },
    ...
  ]
}
`;
};
