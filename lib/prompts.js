export const getRiskAssessmentPrompt = (
  industry,
  activityType,
  location,
  existingControlMeasures,
  responsibleDepartments,
  preparedBy,
  preparedByOccupation,
  reviewedBy,
  reviewedByOccupation,
  approvedBy,
  approvedByOccupation
) => {
  return `You are an AI assistant that generates structured JSON for a Health & Safety Risk Assessment.

Using the following input:
- Industry: ${industry}
- Activity Type: ${activityType}
- Location: ${location}
- Existing Control Measures: ${existingControlMeasures}
- Responsible Departments: ${responsibleDepartments}
- Prepared By: ${preparedBy} (${preparedByOccupation})
- Reviewed By: ${reviewedBy} (${reviewedByOccupation})
- Approved By: ${approvedBy} (${approvedByOccupation})

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

1. "workplace": Industry + Location.
2. Add three additional fields after "workplace":
   - "purpose": A clear statement describing the aim of this risk assessment.
   - "scope": A concise explanation of what areas, processes, and departments are covered.
   - "introduction": A brief overview of the assessment's objective, methods, and safety intent.
3. "activity": Activity Type.
4. "dateConducted": today's date (ISO format).
5. "preparedBy": name and occupation.
6. "reviewedBy": name and occupation.
7. "approvedBy": name and occupation.
8. "responsibleDepartments": array of departments.
9. "hazards": at least 10 unique hazards, each with:
   - "name": short name of the hazard
   - "cause": how the hazard can happen (very brief 3–4 words)
   - "effect": what injury or harm it can cause (very brief 3–4 words)
10. "atRisk": array, use only these values:
    - "E" = Employees
    - "C" = Contractors
    - "V" = Visitors
    - "P" = Public
    - "A" = All
11. "existingControlMeasures": array of professional, rephrased versions of the given control measures.
12. "presentRisk": object with:
    - "severity": integer from 1 to 5
    - "probability": integer from 1 to 5
    - "riskLevel": one of "Low", "Medium", or "High"
13. "furtherControlMeasures": array of new, meaningful controls not listed above.
14. "residualRisk": object with:
    - "severity": integer from 1 to 5 (must be lower than presentRisk.severity)
    - "probability": integer from 1 to 5 (must be lower than presentRisk.probability)
    - "riskLevel": one of "Low", "Medium", or "High" (must be lower than presentRisk.riskLevel)
15. "actionSupervision": array of departments or roles (e.g., "H&S Team", "Site Supervisors").
16. "preparedDate": today's date (ISO format).
17. "reviewDate": today's date (ISO format).
18. "approvedDate": today's date (ISO format).
19. "furtherActions": array of additional actions to be taken.
20. "additionalComments": string for any extra notes.

Schema example:
{
  "workplace": "Food Factory, London",
  "purpose": "purpose of report here",
  "scope": "scope of risk assessment report ehre",
  "introduction": "introduction to the report here",
  "activity": "Food Production",
  "dateConducted": "today's Date",
  "preparedBy": "Jane Doe (Safety Officer)",
  "reviewedBy": "John Smith (H&S Manager)",
  "approvedBy": "Emily Brown (Director)",
  "responsibleDepartments": ["Production", "Maintenance"],
  "hazards": [
    {
      "name": "Slippery Floor",
      "cause": "Water spilled near entrance",
      "effect": "Employee could slip and injure back"
    }
  ],
  "atRisk": ["E", "C"],
  "existingControlMeasures": [
    "Wet floor signs placed promptly",
    "Regular cleaning schedules followed"
  ],
  "presentRisk": {
    "severity": 3,
    "probability": 4,
    "riskLevel": "High"
  },
  "furtherControlMeasures": [
    "Install anti-slip mats",
    "Increase inspection frequency"
  ],
  "residualRisk": {
    "severity": 2,
    "probability": 2,
    "riskLevel": "Medium"
  },
  "actionSupervision": [
    "H&S Team",
    "Site Supervisors"
  ],
  "preparedDate": "today's Date",
  "reviewDate": "today's Date",
  "approvedDate": "today's Date",
  "furtherActions": [
    "Schedule safety training",
    "Review incident reports monthly"
  ],
  "additionalComments": "No further comments."
}
Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

//   return `You are an AI assistant that generates structured JSON for a Health & Safety Risk Assessment document. Based on the following input fields:

// - industry: ${{ industry }}
// - activityType: ${{ activityType }}
// - location: ${{ location }}
// - existingControlMeasures: ${{ existingControlMeasures }}
// - responsibleDepartments: ${{ responsibleDepartments }}

// Generate a JSON response with the following structure. The output must be formatted as professional safety documentation content (e.g., factory and warehouse safety).

// Return **only JSON**. Do **not** include explanations.

// The JSON must follow this schema:

// {
//   "purpose": "Document purpose tailored to the industry and activity type.",
//   "scope": "Document scope tailored to the industry and location.",
//   "introduction": "Comprehensive introduction describing risk categories, objectives, and importance.",
//   "chapters": [
//     {
//       "chapterTitle": "Chapter – 01 (General Arrangements)",
//       "activities": [
//         {
//           "activity": "General Preparation & Arrangements",
//           "hazardAspect": "Slip, trip, fall; heat stress; inclement weather",
//           "riskImpact": "Personal injury, fatigue, fainting, delayed emergency response",
//           "probability": 4,
//           "severity": 3,
//           "riskLevel": "Medium",
//           "controlMeasures": "Personnel inducted and trained; PPE enforced; emergency contact info posted; fire extinguishers in place; cold water available; emergency team designated",
//           "residualRiskProbability": 1,
//           "residualRiskSeverity": 3,
//           "residualRiskLevel": "Low",
//           "actionSupervision": "H&S Team, Supervisors"
//         }
//       ]
//     },
//     {
//       "chapterTitle": "Chapter – 02 (Food Production Area)",
//       "activities": [ { ... } ]
//     },
//     ...
//   ],
//   "riskAssessmentMatrix": {
//     "1": {
//       "1": "Low",
//       "2": "Low",
//       ...
//     },
//     ...
//   }
// }`;

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

export const getIncidentInvestigationPrompt = ({
  incidentCategory,
  description,
  immediateCausesUnsafeActs,
  immediateCausesUnsafeConditions,
  rootCausesPersonalFactors,
}) => {
  return `You are an AI assistant generating content for a Health & Safety Incident Investigation Report.

Based on the following information:

- Incident Category: ${incidentCategory}
- Incident Description: ${description}
- Immediate Causes (Unsafe Acts): ${immediateCausesUnsafeActs.join(", ")}
- Immediate Causes (Unsafe Conditions): ${immediateCausesUnsafeConditions.join(
    ", "
  )}
- Root Causes (Personal Factors): ${rootCausesPersonalFactors.join(", ")}

Your tasks:

1. Rewrite the incident description in a clear, professional, and formal tone suitable for an official report (atleast 100 words).
2. Generate a complete and logical 5 Why Analysis with 5 levels. Use these exact questions for each level:
   - Level 1 question: "Why is it happening?"
   - Levels 2 to 5 question: "Why is that?"
   
   Provide an array of objects, each with:
   - level (1 to 5)
   - question (from above)
   - answer (the explanation or cause in only 5-6 words sentence at max)
   
3. Propose a corrective action plan that includes the following 4 fields:
   - actionsRequired
   - resourcesNeeded
   - responsibleParties
   - timeFrames

Return only valid and parsable **JSON** in the following structure:

{
  "description": "string",
  "fiveWhyAnalysis": [
    {
      "level": 1,
      "question": "Why is it happening?",
      "answer": "string"
    },
    {
      "level": 2,
      "question": "Why is that?",
      "answer": "string"
    },
    {
      "level": 3,
      "question": "Why is that?",
      "answer": "string"
    },
    {
      "level": 4,
      "question": "Why is that?",
      "answer": "string"
    },
    {
      "level": 5,
      "question": "Why is that?",
      "answer": "string"
    }
  ],
  "correctiveActionPlan": {
    "actionsRequired": ["string"],
    "resourcesNeeded": ["string"],
    "responsibleParties": ["string"],
    "timeFrames": ["string"]
  }
}

The response must start with '{' and end with '}'. Do not include any extra text, markdown, or code blocks.
`;
};

export const getIncidentReportPrompt = (
  incidentType,
  description,
  date,
  time,
  location
) => {
  return `This is a dummy prompt for incident report. Input fields:
- Incident Type: ${incidentType}
- Description: ${description}
- Date: ${date}
- Time: ${time}
- Location: ${location}

Return a valid JSON object with all these fields. This is a placeholder prompt.`;
};

export const getJobSafetyAnalysisPrompt = (
  activityType,
  assessedBy,
  date,
  designation,
  knownHazards,
  projectName
) => {
  return `You are an AI assistant that generates structured JSON for a Job Safety Analysis (JSA) document.

Using the following input:
- Activity Type: ${activityType}
- Assessed By: ${assessedBy}
- Date: ${date}
- Designation: ${designation}
- Known Hazards: ${knownHazards}
- Project Name: ${projectName}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "activities": [
    {
      "activity": "string - detailed activity name based on activityType",
      "hazards": [
        "string - specific hazard 1",
        "string - specific hazard 2",
        "string - specific hazard 3",
        "string - specific hazard 4",
        "string - specific hazard 5",
        "string - specific hazard 6",
        "string - specific hazard 7",
        "string - specific hazard 8",
        "string - specific hazard 9"
      ],
      "controlMeasures": [
        "string - specific control measure 1",
        "string - specific control measure 2",
        "string - specific control measure 3",
        "string - specific control measure 4",
        "string - specific control measure 5",
        "string - specific control measure 6",
        "string - specific control measure 7",
        "string - specific control measure 8"
      ]
    }
  ]
}

Guidelines:
1. "activity": Should be a detailed, specific activity name based on the activityType provided
2. "hazards": Should include at least 8-9 specific hazards relevant to the activity type, including:
   - Physical hazards (falls, trips, cuts, burns)
   - Environmental hazards (weather, temperature, soil conditions)
   - Chemical hazards (if applicable)
   - Electrical hazards (if applicable)
   - Mechanical hazards (if applicable)
   - Ergonomic hazards
   - Include the known hazards provided in the input
3. "controlMeasures": Should include at least 7-8 specific control measures that address the identified hazards and should be maximum 10 words each, such as:
   - PPE requirements
   - Work permits
   - Supervision requirements
   - Safety procedures
   - Equipment checks
   - Training requirements
   - Emergency procedures
   - Site-specific controls

Example output:
{
  "activities": [
    {
      "activity": "Excavation Work - Trenching and Foundation Preparation",
      "hazards": [
        "Cave-in and soil collapse",
        "Falling into excavation",
        "Underground utility strikes",
        "Equipment rollover",
        "Falling materials",
        "Poor ventilation in deep excavations",
        "Water accumulation",
        "Adjacent structure damage",
        "Weather-related instability"
      ],
      "controlMeasures": [
        "Obtain proper excavation permits",
        "Implement proper shoring and benching systems",
        "Call 811 for utility location before digging",
        "Maintain safe distances from excavation edges",
        "Use proper PPE including hard hats and safety vests",
        "Install proper ventilation for deep excavations",
        "Implement dewatering procedures if needed",
        "Regular inspection of excavation stability"
      ]
    }
  ]
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

// Dummy prompt for method statement
export const getMethodStatementPrompt = (
  activityName,
  toolsAndEquipment,
  numberOfPeople,
  activityBrief,
  safetyMeasures,
  staffPersons
) => {
  return `This is a dummy prompt for method statement. Input fields:
- Activity Name: ${activityName}
- Tools and Equipment: ${toolsAndEquipment}
- Number of People: ${numberOfPeople}
- Activity Brief: ${activityBrief}
- Safety Measures: ${safetyMeasures}
- Staff Persons: ${staffPersons}

Return a valid JSON object with all these fields. This is a placeholder prompt.`;
};

// Dummy prompt for response plan
export const getResponsePlanPrompt = (
  emergencyType,
  evacuationMaps,
  fireWardens,
  floorWardens
) => {
  return `This is a dummy prompt for response plan. Input fields:
- Emergency Type: ${emergencyType}
- Evacuation Maps: ${evacuationMaps}
- Fire Wardens: ${fireWardens}
- Floor Wardens: ${floorWardens}

Return a valid JSON object with all these fields. This is a placeholder prompt.`;
};

export const getLegalRegisterTableDataPrompt = ({
  country,
  category,
  year,
}) => {
  return `You are an expert legal database assistant.

Given the selected inputs:

- Country: "${country}"
- Category: "${category}"
- Year: "${year}"

Provide a JSON array of legal register entries strictly following this exact format (do not add or remove fields):

[
  {
    "regulation": "string - regulation code or ID",
    "description": "string - brief description of the regulation",
    "effectiveDate": "string - formatted date (e.g., 'May 25, 2018')",
    "category": "string - category name"
  },
  ...
]

Make sure the data is relevant to the specified country, category, and year, with at least 5-10 sample entries.
Make sure category is never a slug or lowercase, always use proper case.

Example output:

[
  {
    "regulation": "UAE-OHS-001",
    "description": "UAE Occupational Health and Safety Regulation 001, governing workplace safety standards.",
    "effectiveDate": "January 1, 2023",
    "category": "Health"
  },
  {
    "regulation": "UAE-ENV-005",
    "description": "Environmental protection law related to waste management and emissions.",
    "effectiveDate": "March 15, 2023",
    "category": "Environment"
  },
  {
    "regulation": "UAE-SAF-010",
    "description": "Safety standards for construction sites and equipment.",
    "effectiveDate": "June 20, 2023",
    "category": "Safety"
  }
]
  Make sure the output is valid JSON, parsable, and strictly adheres to the schema provided. Do not include any additional text, explanations, or formatting. The response must start with '[' and end with ']' to indicate a JSON array.`;
};

export function getDocumentPrompt(inputsJson, subcategory) {
  let inputs;
  try {
    inputs =
      typeof inputsJson === "string" ? JSON.parse(inputsJson) : inputsJson;
  } catch (e) {
    throw new Error(
      "Invalid inputsJson: must be a valid JSON string or object"
    );
  }

  switch (subcategory) {
    case "Risk Assessment":
      return getRiskAssessmentPrompt(
        inputs.industry,
        inputs.activityType,
        inputs.location,
        inputs.existingControlMeasures,
        inputs.responsibleDepartments,
        inputs.preparedBy,
        inputs.preparedByOccupation,
        inputs.reviewedBy,
        inputs.reviewedByOccupation,
        inputs.approvedBy,
        inputs.approvedByOccupation
      );
    case "Job Safety Analysis":
      return getJobSafetyAnalysisPrompt(
        inputs.activityType,
        inputs.assessedBy,
        inputs.date,
        inputs.designation,
        inputs.knownHazards,
        inputs.projectName
      );
    default:
      throw new Error(
        `No prompt function defined for subcategory: ${subcategory}`
      );
  }
}
