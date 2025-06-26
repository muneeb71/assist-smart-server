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
