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

export const getIncidentInvestigationReportPrompt = ({
  incidentCategory,
  description,
  immediateCausesUnsafeActs,
  immediateCausesUnsafeConditions,
  rootCausesPersonalFactors,
}) => {
  return `You are an AI assistant that generates structured JSON for an Incident Investigation Report document.

Using the following input:
- Incident Category: ${incidentCategory}
- Description: ${description}
- Immediate Causes (Unsafe Acts): ${immediateCausesUnsafeActs.join(", ")}
- Immediate Causes (Unsafe Conditions): ${immediateCausesUnsafeConditions.join(", ")}
- Root Causes (Personal Factors): ${rootCausesPersonalFactors.join(", ")}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "category": "string - incident category",
  "date": "string - incident date (YYYY-MM-DD)",
  "time": "string - incident time (HH:MM AM/PM)",
  "companyName": "string - company name",
  "documentControlNumber": "string - document control number",
  "leadInvestigator": "string - lead investigator name",
  "leadInvestigatorJobTitle": "string - lead investigator job title",
  "assistedBy": "string - assistant investigator name",
  "assistedByJobTitle": "string - assistant investigator job title",
  "investigationDate": "string - investigation start date (YYYY-MM-DD)",
  "investigationCloseOutDate": "string - investigation completion date (YYYY-MM-DD)",
  "building": "string - building or facility name",
  "eventDate": "string - event date (YYYY-MM-DD)",
  "locationOfEvent": "string - specific location of incident",
  "eventTime": "string - event time (HH:MM AM/PM)",
  "personInvolved": "string - person involved name",
  "personInvolvedJobTitle": "string - person involved job title",
  "personInvolvedAddress": "string - person involved address",
  "personInvolvedJoiningDate": "string - person joining date (YYYY-MM-DD)",
  "personInvolvedDaysAbsent": "string - days absent due to incident",
  "personInvolvedSupervisor": "string - supervisor name",
  "producedBy": "string - report producer name",
  "producedByDate": "string - production date (YYYY-MM-DD)",
  "approvedBy": "string - approver name",
  "approvedByDate": "string - approval date (YYYY-MM-DD)",
  "immediateCausesUnsafeActs": [
    "string - unsafe act 1",
    "string - unsafe act 2",
    "string - unsafe act 3",
    "string - unsafe act 4"
  ],
  "immediateCausesUnsafeConditions": [
    "string - unsafe condition 1",
    "string - unsafe condition 2",
    "string - unsafe condition 3",
    "string - unsafe condition 4"
  ],
  "rootCauses": [
    "string - root cause 1",
    "string - root cause 2",
    "string - root cause 3",
    "string - root cause 4",
    "string - root cause 5",
    "string - root cause 6"
  ],
  "fiveWhys": [
    {
      "level": 1,
      "question": "Why is it happening?",
      "answer": "string - level 1 answer"
    },
    {
      "level": 2,
      "question": "Why is that?",
      "answer": "string - level 2 answer"
    },
    {
      "level": 3,
      "question": "Why is that?",
      "answer": "string - level 3 answer"
    },
    {
      "level": 4,
      "question": "Why is that?",
      "answer": "string - level 4 answer"
    },
    {
      "level": 5,
      "question": "Why is that?",
      "answer": "string - level 5 answer"
    }
  ],
  "evidencePhotographs": "string - evidence description",
  "evidenceMedicalReports": "string - evidence description",
  "evidenceRiskAssessments": "string - evidence description",
  "evidenceDrawingsSketches": "string - evidence description",
  "evidenceWitnessStatements": "string - evidence description",
  "evidenceAccidentIncidentNearMissReport": "string - evidence description",
  "evidenceTrainingRecords": "string - evidence description",
  "evidenceMethodStatements": "string - evidence description",
  "evidenceOther": "string - evidence description"
}

Guidelines:
1. "category": Should be the incident category provided
2. "date" and "eventDate": Should be realistic dates (current or recent past)
3. "time" and "eventTime": Should be realistic working hours
4. "companyName": Should be a realistic company name for the industry
5. "documentControlNumber": Should follow a realistic format (e.g., "II-001", "INV-2024-001")
6. "leadInvestigator" and "assistedBy": Should be realistic names with appropriate job titles
7. "investigationDate" and "investigationCloseOutDate": Should be logical dates after the incident
8. "building" and "locationOfEvent": Should be specific and relevant to the incident type
9. "personInvolved": Should include realistic personal details and job information
10. "immediateCausesUnsafeActs": Should use the provided unsafe acts or generate relevant ones
11. "immediateCausesUnsafeConditions": Should use the provided unsafe conditions or generate relevant ones
12. "rootCauses": Should use the provided root causes or generate relevant systemic issues
13. "fiveWhys": Should follow the 5-Why analysis methodology with logical progression based on the incident
14. All evidence fields should describe realistic evidence that would be collected for the incident type
15. All dates should be logical (investigation dates after incident date, approval date after production date)

Example output:
{
  "category": "Fall from Height",
  "date": "2024-01-15",
  "time": "09:30 AM",
  "companyName": "ABC Construction Ltd",
  "documentControlNumber": "II-001",
  "leadInvestigator": "Sarah Johnson",
  "leadInvestigatorJobTitle": "Senior HSE Manager",
  "assistedBy": "Mike Thompson",
  "assistedByJobTitle": "Safety Officer",
  "investigationDate": "2024-01-16",
  "investigationCloseOutDate": "2024-01-20",
  "building": "Building A",
  "eventDate": "2024-01-15",
  "locationOfEvent": "Building A - Level 3",
  "eventTime": "09:30 AM",
  "personInvolved": "David Wilson",
  "personInvolvedJobTitle": "Construction Worker",
  "personInvolvedAddress": "123 Main Street, City",
  "personInvolvedJoiningDate": "2023-06-15",
  "personInvolvedDaysAbsent": "5",
  "personInvolvedSupervisor": "John Smith",
  "producedBy": "Sarah Johnson",
  "producedByDate": "2024-01-20",
  "approvedBy": "Robert Davis",
  "approvedByDate": "2024-01-21",
  "immediateCausesUnsafeActs": [
    "Worker not wearing fall protection equipment",
    "Worker working on wet surface without proper footwear",
    "Worker not following safety procedures for working at height",
    "Worker not using provided safety equipment"
  ],
  "immediateCausesUnsafeConditions": [
    "Wet surface conditions due to recent rain",
    "Missing safety barriers around work area",
    "Inadequate lighting in work area",
    "Lack of proper drainage system"
  ],
  "rootCauses": [
    "Insufficient risk assessment for weather conditions",
    "Inadequate supervision during adverse weather",
    "Lack of proper safety training for weather-related hazards",
    "Insufficient safety equipment provision",
    "Poor communication of weather-related risks",
    "Inadequate emergency response procedures"
  ],
  "fiveWhys": [
    {
      "level": 1,
      "question": "Why is it happening?",
      "answer": "Worker fell from height while performing window cleaning duties"
    },
    {
      "level": 2,
      "question": "Why is that?",
      "answer": "Worker was not wearing fall protection equipment"
    },
    {
      "level": 3,
      "question": "Why is that?",
      "answer": "Fall protection equipment was not provided or enforced"
    },
    {
      "level": 4,
      "question": "Why is that?",
      "answer": "Insufficient risk assessment for weather conditions"
    },
    {
      "level": 5,
      "question": "Why is that?",
      "answer": "Lack of proper safety management system"
    }
  ],
  "evidencePhotographs": "Scene photographs showing wet conditions and lack of fall protection equipment",
  "evidenceMedicalReports": "Medical examination report confirming minor injuries sustained in the fall",
  "evidenceRiskAssessments": "Previous risk assessment documents for the work area, dated 2023-12-01",
  "evidenceDrawingsSketches": "Site layout drawings showing work area and access points to the third floor",
  "evidenceWitnessStatements": "Written statements from John Smith and Mike Johnson confirming the incident details",
  "evidenceAccidentIncidentNearMissReport": "Initial incident report filed by site supervisor on 2024-01-15",
  "evidenceTrainingRecords": "Training records showing worker's safety training completion on 2023-07-15",
  "evidenceMethodStatements": "Method statement for window cleaning activities, approved on 2024-01-10",
  "evidenceOther": "Weather reports from the day of the incident showing rain conditions"
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
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

export const getMethodStatementPrompt = (
  activityType,
  industry
) => {
  return `You are an AI assistant that generates structured JSON for a Method Statement document.

Using the following input:
- Activity Type: ${activityType}
- Industry: ${industry}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "title": "string - activity type",
  "description": "string - comprehensive description of the activity and its importance",
  "approaches": [
    "string - approach method 1",
    "string - approach method 2",
    "string - approach method 3",
    "string - approach method 4",
    "string - approach method 5",
    "string - approach method 6",
    "string - approach method 7",
    "string - approach method 8"
  ],
  "purpose": "string - clear statement of the method statement's purpose and requirements",
  "scope": [
    "string - scope item 1",
    "string - scope item 2",
    "string - scope item 3"
  ],
  "standards": [
    "string - applicable safety standard 1"
  ],
  "ppe": [
    "string - PPE item 1",
    "string - PPE item 2",
    "string - PPE item 3",
    "string - PPE item 4",
    "string - PPE item 5",
    "string - PPE item 6"
  ],
  "protectionMethods": [
    "string - protection method 1 with brief description",
    "string - protection method 2 with brief description",
    "string - protection method 3 with brief description"
  ],
  "supportedExcavation": [
    "string - excavation step 1",
    "string - excavation step 2",
    "string - excavation step 3",
    "string - excavation step 4",
    "string - excavation step 5",
    "string - excavation step 6",
    "string - excavation step 7",
    "string - excavation step 8",
    "string - excavation step 9",
    "string - excavation step 10",
    "string - excavation step 11",
    "string - excavation step 12",
    "string - excavation step 13"
  ],
  "precautions": [
    "string - precaution 1",
    "string - precaution 2",
    "string - precaution 3",
    "string - precaution 4",
    "string - precaution 5",
    "string - precaution 6",
    "string - precaution 7",
    "string - precaution 8",
    "string - precaution 9",
    "string - precaution 10",
    "string - precaution 11",
    "string - precaution 12",
    "string - precaution 13",
    "string - precaution 14"
  ],
  "hazards": [
    "string - hazard 1",
    "string - hazard 2",
    "string - hazard 3",
    "string - hazard 4"
  ],
  "checklists": [
    "string - checklist item 1",
    "string - checklist item 2",
    "string - checklist item 3",
    "string - checklist item 4",
    "string - checklist item 5",
    "string - checklist item 6",
    "string - checklist item 7",
    "string - checklist item 8",
    "string - checklist item 9"
  ]
}

Guidelines:
1. "title": Should be the activity type provided
2. "description": Should be a comprehensive description explaining the activity, its mechanism, and safety importance in the context of the industry
3. "approaches": Should include at least 8 different methods or approaches for conducting the activity in the specified industry
4. "purpose": Should clearly state the purpose and any specific requirements (e.g., depth limits, permits needed) relevant to the industry
5. "scope": Should include at least 3 scope items covering work methods, materials/equipment, and applicable standards for the industry
6. "standards": Should include relevant safety standards for the industry (e.g., OSHA standards, industry-specific regulations)
7. "ppe": Should include  at least 6 essential PPE items for the activity in the specified industry
8. "protectionMethods": Should include at least 3 protection methods with brief descriptions relevant to the industry
9. "supportedExcavation": Should include at least13 detailed steps for safe excavation procedures (adapt based on activity type)
10. "precautions": Should include at least 14 specific safety precautions and requirements relevant to the industry
11. "hazards": Should include at least 4 main hazards associated with the activity in the specified industry
12. "checklists": Should include at least 9 checklist items for pre-work verification in the industry context

Example output:
{
  "title": "Excavation",
  "description": "The Excavation is the mechanism of establishing space utilizing removing Earth and that Earth could be soil or rock to construct any structure. Various approaches are available to accomplish excavation. In all process, excavation safety has an essential and decisive execution.",
  "approaches": [
    "The open excavations structure.",
    "Thrust Boring",
    "Horizontal Directional Drilling (HDD)",
    "The Micro tunneling structure for Pipe Jacking",
    "The Pile foundations and diaphragm walls type",
    "The Vibro Stone Columns (VSC)",
    "Raise Boring Approach Type",
    "Tunneling"
  ],
  "purpose": "Any open excavation that is deeper than 1.5 meter needs side stability by sloping, benching or shoring. This method statement elaborates the excavation safety requirements and safe work procedure for all open excavations categories.",
  "scope": [
    "Safe and secure work method and technique for conducting open excavation activity",
    "Substance, materials, equipment, and tools required to conduct the excavation work",
    "Applicable appropriate required standards throughout the execution of the excavation project"
  ],
  "standards": ["Trenching and Excavation Safety (OSHA 2226-10R 2015)"],
  "ppe": [
    "Hard hat",
    "Safety boots",
    "High visibility vest",
    "Safety gloves",
    "Eye protection",
    "Hearing protection"
  ],
  "protectionMethods": [
    "Sloping the walls: Sloping of the walls for excavation preventive safety initiatives",
    "Bench Excavation: Benching technique for excavation safety",
    "Supported excavation: By shoring up the excavation walls with wood or metal supports"
  ],
  "supportedExcavation": [
    "Mechanically or manual finalize the excavation and soil removal method",
    "Locate underground services and installations like electric cables, Optical fiber cables, Pipeline etc. with detecting devices e.g., cable and pipe detectors.",
    "Make proper estimation for any possibility of chemical hazard or low oxygen levels",
    "Take permission as required from the underground services installation operator",
    "Obtain Permit to Work (PTW) for excavation activity",
    "Properly barricade the excavation area to keep vehicles, equipment, machinery and workforce away from the excavation",
    "Make appropriate arrangements for lighting.",
    "Examine and observe the arrangements with a skilled person prior start of excavation activity",
    "Carry out the manual excavation activity until exposure to underground services and installations.",
    "Allow mechanical excavation only after exposure to underground services and installations.",
    "Make appropriate safe and secure access & egress arrangements for workers, equipment, tools and machinery at least from two sides",
    "Excavation and its closed surrounding areas should be kept free from water. Water in an excavation can weaken the surfaces of the excavation. Use the dewatering system whenever water accumulates. If needed, put necessary shoring to protect workforce working.",
    "Conduct the balance excavation with machinery, for example, excavators."
  ],
  "precautions": [
    "Within the range of 2.0 meters' distance of excavation edge, permit only excavation equipment and tools.",
    "Don't allow any other equipment near the excavation edge because the weight of the machines can destruct trench walls.",
    "Cranes should maintain a maximum safe distance equal to the depth of excavation from the edge of the excavation",
    "Deposit excavated soil along with other materials or substances at least 0.61 meters from the edge. put soft barricades for pedestrians at least 1.0 meter from the edge. Scaffold posts, loose materials and or substances along with any loads shall be at a distance of 1.5 times excavation depth away from the edge. Provide proper hard barricades for vehicles at least 2.0 meter from the edge.",
    "Only authorized and permitted persons should enter in the excavation",
    "Keep flagman with a red flag in congested and risky areas to guide vehicles traffic",
    "Keep signalman to guide equipment operating properly and safely",
    "Utilize blinking warning lights where the pedestrian or vehicular traffic is expected.",
    "Provide extra bracing and shoring in the locality of the source of vibration such as Pile driving rigs to prevent slides, slips or cave-in where excavations.",
    "Provide one ladder per 15 meters of length and extend the ladder for one meter over the top of the cut",
    "Block the workforce/persons in the path of an excavator turning bucket",
    "Stop the lone workers without proper supervision",
    "Wherever the presence of pests and insects is possible, make proper arrangements for repellents, fumigation and first aid as required.",
    "Daily conduct earthwork inspection"
  ],
  "hazards": [
    "Soil muddy condition",
    "Becoming sidewalls unstable due to water content excessive rainfall",
    "Vibrations from nearby heavy machinery such as railroad and blasting",
    "The overload force by adjacent buildings"
  ],
  "checklists": [
    "Approved excavation drawing available",
    "Presence of underground services",
    "Barrication, safety signage, and lighting are properly in place",
    "Excavation slope prevention system finalization such as sloping, shoring or benching",
    "Proper entry and exit sources for the workforce, equipment and machinery",
    "Arrangements for dewatering system wherever water is expected.",
    "Flagmen are appointed at required areas to guide vehicular traffic",
    "Emergency procedures are in place",
    "Excavation Permit to Work (PTW) available"
  ]
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

// Dummy prompt for response plan
export const getResponsePlanPrompt = (
  emergencyType,
  projectName,
  industry
) => {
  return `You are an AI assistant that generates structured JSON for an Emergency Response Plan document.

Using the following input:
- Emergency Type: ${emergencyType}
- Project Name: ${projectName}
- Industry: ${industry}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "scope": "string - scope of the response plan",
  "objective": "string - objective of the response plan",
  "definition": "string - definition of the emergency type",
  "rolesAndResponsibilities": {
    "projectDirector": "string - project director responsibilities",
    "hseManager": "string - HSE manager responsibilities",
    "rescueTeam": "string - rescue team responsibilities",
    "employees": "string - employee responsibilities"
  },
  "suspensionTraumaEffects": "string - effects of suspension trauma",
  "symptoms": [
    "string - symptom 1",
    "string - symptom 2",
    "string - symptom 3",
    "string - symptom 4",
    "string - symptom 5",
    "string - symptom 6"
  ],
  "training": "string - training requirements",
  "generalPrecautions": "string - general precautions",
  "rescueProcedures": {
    "selfRescue": "string - self rescue procedure",
    "ladderRescue": "string - ladder rescue procedure",
    "rescueKit": "string - rescue kit procedure",
    "manBasket": "string - man basket procedure",
    "mewpRescue": "string - MEWP rescue procedure"
  },
  "records": "string - record keeping requirements"
}

Guidelines:
1. "scope": Should define the applicability of the plan to specific activities and project
2. "objective": Should clearly state the purpose and goals of the response plan
3. "definition": Should provide a detailed explanation of the emergency type and its effects
4. "rolesAndResponsibilities": Should include specific responsibilities for each role:
   - projectDirector: High-level oversight and resource management
   - hseManager: Safety coordination and training oversight
   - rescueTeam: Direct rescue operations and emergency response
   - employees: General safety duties and cooperation requirements
5. "suspensionTraumaEffects": Should explain the medical effects and urgency of response
6. "symptoms": Should include at least 6 symptoms that indicate the emergency condition
7. "training": Should emphasize the importance of training and practical demonstrations
8. "generalPrecautions": Should include key safety measures and time-critical factors
9. "rescueProcedures": Should include 5 different rescue methods:
   - selfRescue: When the person can rescue themselves
   - ladderRescue: Using ladders for rescue operations
   - rescueKit: Using specialized rescue equipment
   - manBasket: Using crane and basket for rescue
   - mewpRescue: Using Mobile Elevating Work Platform
10. "records": Should specify documentation and investigation requirements

Example output:
{
  "scope": "The plan is applicable to work at height activities of CSCEC Steel, during steel Structure erection at Hassyan Clean Coal Power Plant project.",
  "objective": "The objective of this plan is to rescue the person suspended in a safety harness after a fall from height in order to reduce the suspension time to prevent suspension trauma and comply the requirements of HEI HSE Management plan / Emergency response plan.",
  "definition": "Suspension Trauma: Suspension trauma (\"orthostatic shock while suspended\"), also known as harness hang syndrome (HHS), or orthostatic incompetence is an effect which occurs when the human body is held upright without any movement for a period of time. If the person is strapped into a harness or tied to an upright object they will eventually suffer the Central Ischemic Response (commonly known as fainting). If one faints but remains vertical, one risks death due to one's brain not receiving the oxygen it requires.",
  "rolesAndResponsibilities": {
    "projectDirector": "• Ensure rescue team and available for all working at height activities.\n• Ensure rescue training is provided.\n• Ensure rescue plan is revised on regular basis.\n• Ensure the efficiency of rescue response planning.\n• Ensure sufficient resources for rescue are in place.",
    "hseManager": "• To ensure rescue team is in place where working at height operation is ongoing.\n• Ensure adequate numbers of persons are trained.\n• Review the rescue response plan periodically.\n• Advise the team to identify the operations where rescue team should be present.\n• Arrange the required training for the rescue team.\n• Inform HEI ERT / HSE manager in any emergency situation.\n• Arrange rescue trainings for the rescue team and ensure resources.",
    "rescueTeam": "• Rescue team will be part of emergency response team of the CSCEC Steel.\n• Ensure that team is available whenever necessary.\n• Ensure rescue team is properly trained on rescue operations.\n• To understand the situation where the action is required.\n• Ensure first aiders are included in the emergency response / rescue team.\n• Report the rescue operations to the HSE Manager &Emergency controller.",
    "employees": "• Employees have general legal duties to take reasonable care of themselves and others who may be affected by their actions, and to co-operate with their employer to enable their health and safety duties and requirements to be complied with. For an employee, or those working under someone else's control, the law says they must.\n• Report any safety hazard they identify to their employer.\n• Use the equipment and safety devices supplied or given to them properly, in accordance with any training and instructions (unless they think that would be unsafe, in which case they should seek further instructions before continuing).\n• If (worker) have any good suggestion / know about the better options to discuss with foreman, supervisor, and engineer. Because hazards they notice may have some good, practical ideas on how to control the risks."
  },
  "suspensionTraumaEffects": "After a human fall occurs, suspending human in a vertical position on the harness more than 15 minutes can lead to fatal accident or serious injury because the orthostatic intolerance can occur due to suspension trauma. This instigates the need of proper plan to rescue the suspending person without causing any further injuries or worsening the condition. To adequately manage the rescue at Hassyan Clean Coal Power plant project adequate resources need to be in place such as required equipment and the competent person to carry out the rescue.",
  "symptoms": [
    "Light headache and palpitation.",
    "Faintness",
    "Poor concentration and fatigue.",
    "Nausea and dizziness.",
    "Breathlessness & paleness.",
    "Unusual low heart rate and blood pressure."
  ],
  "training": "Training is very important when we are planning to establish a plan for rescuing the hanging / tapped personnel on height. Workers involved in rescue team must know and have understanding on practical training to handle any unforeseen situation by assuming and practical demonstration must be ensured by involving / participating in the activity so that they were fully aware of the hazards and controls regarding rescue and practically realize / analysis the situation then they will be able to rescue a person with their full passion.",
  "generalPrecautions": "Rescue must do quickly to minimize the dangers of suspension trauma.\n• If the suspended person can rescue by himself (Self rescue) will be most preferable rescue method.\n• If self-rescue is not possible, the suspended employees must be guided by competent person or supervisor at all time.\n• Suspended person to be advised to move the legs upward and downward to maintain blood circulation.\nRegardless the rescue style-self or assisted by others time is most important is the time because the person must become faints within few minutes depends upon the health conditions and injuries.",
  "rescueProcedures": {
    "selfRescue": "Self-rescue is relatively easy and good option If a worker is suspended in an area where the ground level is near or there is any approachable structure and worker can access that area & he think that he can rescue himself by loosen leg strips or lifting himself up. For this purpose he need to consider the following.\n• Ensure his mental and body condition are good enough to perform self-rescue.\n• Ensure his self-rescuing efforts did not harm him anymore.\n• Make sure that there must be an easy access / support location nearby.\n• Suspended person will loosen the strips around his legs one by one.\n• After loosen leg strips open / loosen the chest strip.\n• Hold the lanyard firmly and lift his legs & free them from leg strips.\n• Hold lanyard move downward slowly until reached on the stable level / ground.\n• After safely reaching on ground seek first aid and ensure visit hospital for medical check to avoid any injury / ill-health due to suspension trauma.",
    "ladderRescue": "If an elevating work platform is not available, use ladders to rescue the fallen worker with the procedure outlined below.\n1. If the fallen worker is suspended from a lifeline, move the worker (if possible) to an area that rescuers can access safely with a ladder, make sure ladder is secured properly before climbing up.\n2. Set up the appropriate ladder(s) to reach the fallen worker.\n3. Rig separate lifelines for rescuers to use while carrying out the rescue from the ladder(s).\n4. If the fallen worker is not conscious or cannot reliably help with the rescue, at least two rescuers may be needed.\n5. If the fallen worker is suspended directly from a lanyard or a lifeline, securely attach a separate lowering line to the harness.\n6. Other rescuers on the ground (or closest work surface) should lower the fallen worker while the rescuer on the ladder guides the fallen worker to the ground (or work surface).\n7. Once the fallen worker has been brought to a safe location, administer first aid and treat the person for suspension trauma and any other injury. Arrange transportation to hospital if required.",
    "rescueKit": "Equipment required: 1 Gotcha Kit / High-rise rescue set, 1 pcs full body harness, 60 m Cladded core rope dynamic 10.3 mm, 20 kN, 2 pcs Tape sling 1.50 m, 22 kN, 15 pcs Tape sling 0.80 m, 22 kN, 15 pcs Twist lock- carabineer, 22 kN, black, 1 pcs Triple-Lock-carabineer, 24 kN, red, 1 pcs Y-lanyard, 1 pcs Rope bag, 54 l, 2 pair Gloves for technical assistance.\n\nProcedure:\n• Only appropriately trained personnel should attempt retrieval. At no stage is the rescuer(s) to compromise their own safety.\n• The rescue kit has to be lifted by carne or manual means to the location where the rescue act has to be done.\n• The rescue team has to be available on ground level or workers working in higher elevations need to be trained for rescue to act fast.",
    "manBasket": "Equipment required: rescue basket and mobile crane.\n\n• Man basket must be present nearby the working area.\n• Crane will be set as suitable to the incident location and on levelled ground other crane setting requirements must be followed.\n• Area must be barricaded and controlled by the emergency controller.\n• Two employees will be carried and manoeuvred the man basket to very near to the suspended person.\n• One person will maintain communication with emergency coordinator by the using mobile / walkie talkie or other means of communication.\n• As the man lift basket reaches to the point where the suspended employee will be transferred to the basket.\n• Once the suspended person safely come inside the basket the lanyard of harness will be detached from anchoring point.\n• Brings the person down for further first aid and necessary medical treatment.\n• Once the worker has been brought to a safe location, administer first aid and treat the person for suspension trauma and any other injury.\n• Arrange transportation to hospital if required.",
    "mewpRescue": "Equipment required: MEWP\n\n• The MEWP should be readily available for rescue.\n• The route for MEWP to be availed for the rescue should be clear and free from obstruction in order to ensure any delay in availing the manlift for rescue.\n• MEWP to be in good working order and checked prior to start (to reduce breakdowns) if MEWP designated to act as ER breaks down or in any way out of action.\n• In case of fall and subsequent suspension, the flagman of the MEWP near to the location to be alerted of the fall and avail the man lifts for the rescue.\n• The flag man should communicate with MEWP operator to move the MEWP to the location of the fall and suspension (The alert should be done by using whistle or horn).\n• The emergency action for rescue must be briefed to MEWP operator and flagman through POWRA / toolbox talks on regular basis.\n• The basket of the MEWP to be positioned to the suspended worker from side.\n• The basket must be elevated to the position where the foot of the suspended person levels with the platform of the MEWP.\n• Once the suspended person is located and stand on the basket the fall restraint system must be released so that the person is freely standing on the basket.\n• The basket should be lowered slowly to the ground level and the rescued worker should be treated as per the response discussed above.\n• The basket of the platform should be free from materials to accommodate the rescued worker."
  },
  "records": "All records will be maintained for any fall from height / suspension using incident / accident form. All incidents accidents will be investigated to device additional controls to prevent further recurrence of such kind of incident / accidents."
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
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
    case "Method Statement":
      return getMethodStatementPrompt(
        inputs.activityType,
        inputs.industry
      );
    case "Permit to Work":
      return getPermitToWorkPrompt(
        inputs.activityType,
        inputs.workDescription,
        inputs.workLocation,
        inputs.industry
      );
    case "Response Plan":
      return getResponsePlanPrompt(
        inputs.emergencyType,
        inputs.projectName,
        inputs.industry
      );
    case "Toolbox Talk":
      return getToolboxTalkPrompt(
        inputs.topic,
        inputs.projectName,
        inputs.workLocation,
        inputs.industry
      );
    case "Incident Investigation":
      return getIncidentInvestigationReportPrompt({
        incidentCategory: inputs.incidentCategory,
        description: inputs.description,
        immediateCausesUnsafeActs: inputs.immediateCausesUnsafeActs,
        immediateCausesUnsafeConditions: inputs.immediateCausesUnsafeConditions,
        rootCausesPersonalFactors: inputs.rootCausesPersonalFactors
      });
    default:
      throw new Error(
        `No prompt function defined for subcategory: ${subcategory}`
      );
  }
}

export const getPermitToWorkPrompt = (
  activityType,
  workDescription,
  workLocation,
  industry
) => {
  return `You are an AI assistant that generates structured JSON for a Permit to Work (PTW) document.

Using the following input:
- Activity Type: ${activityType}
- Work Description: ${workDescription}
- Work Location: ${workLocation}
- Industry: ${industry}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "companyName": "string - company name",
  "emailAddress": "string - email address",
  "applicantName": "string - applicant name",
  "designation": "string - applicant designation",
  "contactNo": "string - contact number",
  "workDescription": "string - detailed work description",
  "dateFrom": "string - start date (YYYY-MM-DD)",
  "dateTo": "string - end date (YYYY-MM-DD)",
  "timeFrom": "string - start time (HH:MM)",
  "timeTo": "string - end time (HH:MM)",
  "workLocation": "string - specific work location",
  "selectedLightWorks": [
    "string - light work type 1",
    "string - light work type 2"
  ],
  "selectedCriticalWorks": [
    "string - critical work type 1",
    "string - critical work type 2"
  ],
  "permitRenewalNumber": "string - permit number",
  "otherLightWork": "string - additional light work details",
  "otherCriticalWork": "string - additional critical work details",
  "impactFireAlarm": "string - Yes/No",
  "impactFireFighting": "string - Yes/No",
  "impactGasDistribution": "string - Yes/No",
  "fireAlarmRemarks": "string - fire alarm impact remarks",
  "fireFightingRemarks": "string - fire fighting impact remarks",
  "gasDistributionRemarks": "string - gas distribution impact remarks",
  "ppeEquipment": [
    "string - PPE item 1",
    "string - PPE item 2",
    "string - PPE item 3",
    "string - PPE item 4",
    "string - PPE item 5"
  ],
  "otherPpe": "string - additional PPE requirements",
  "equipmentRequired": [
    "string - equipment 1",
    "string - equipment 2"
  ],
  "otherEquipment": "string - additional equipment",
  "documentsToAttach": [
    "string - required document 1",
    "string - required document 2"
  ],
  "otherDocuments": "string - additional documents",
  "undertakingName": "string - undertaking person name",
  "undertakingSign": "string - undertaking signature",
  "undertakingDate": "string - undertaking date (YYYY-MM-DD)",
  "permitAuthorizerName": "string - authorizer name",
  "permitAuthorizerSign": "string - authorizer signature",
  "permitAuthorizerDate": "string - authorization date (YYYY-MM-DD)",
  "gmgSiteInChargeName": "string - site in charge name",
  "gmgSiteInChargeSign": "string - site in charge signature",
  "gmgSiteInChargeDate": "string - site in charge date (YYYY-MM-DD)",
  "hsRiskAssessmentName": "string - risk assessment person name",
  "hsRiskAssessmentDate": "string - risk assessment date (YYYY-MM-DD)",
  "hsRiskAssessmentSign": "string - risk assessment signature",
  "permitClosureContractorName": "string - contractor closure name",
  "permitClosureContractorDate": "string - contractor closure date (YYYY-MM-DD)",
  "permitClosureContractorSign": "string - contractor closure signature",
  "permitClosurePermitHolderName": "string - permit holder closure name",
  "permitClosurePermitHolderDate": "string - permit holder closure date (YYYY-MM-DD)",
  "permitClosurePermitHolderSign": "string - permit holder closure signature",
  "permitClosurePermitAuthorizerName": "string - authorizer closure name",
  "permitClosurePermitAuthorizerDate": "string - authorizer closure date (YYYY-MM-DD)",
  "permitClosurePermitAuthorizerSign": "string - authorizer closure signature"
}

Guidelines:
1. "companyName": Should be a realistic company name for the industry
2. "emailAddress": Should be a professional email format
3. "applicantName": Should be a realistic name for the activity type
4. "designation": Should be appropriate for the activity type and industry
5. "contactNo": Should be a realistic contact number format
6. "workDescription": Should be detailed and specific to the activity type and location
7. "dateFrom" and "dateTo": Should be realistic dates (current or future)
8. "timeFrom" and "timeTo": Should be realistic working hours
9. "workLocation": Should be specific and detailed
10. "selectedLightWorks": Should include at least 2 relevant light work types for the activity type and industry
11. "selectedCriticalWorks": Should include at least 2 relevant critical work types for the activity type and industry
12. "permitRenewalNumber": Should be a realistic permit number format
13. "impactFireAlarm/FireFighting/GasDistribution": Should be Yes/No based on activity type
14. "ppeEquipment": Should include at least 5 essential PPE items for the activity type
15. "equipmentRequired": Should include at least 2 relevant equipment items for the activity type
16. "documentsToAttach": Should include at least 2 essential documents for the activity type
17. All names and signatures should be realistic and consistent
18. All dates should be logical (authorization dates after undertaking, closure dates after authorization)

Example output:
{
  "companyName": "ABC Construction Ltd.",
  "emailAddress": "john.doe@abcconstruction.com",
  "applicantName": "John Doe",
  "designation": "Site Supervisor",
  "contactNo": "+971-50-123-4567",
  "workDescription": "Installation of new electrical panels and wiring in Building A, Level 2. This includes mounting of panels, cable routing, and connection to main power supply. All work will be conducted during non-operational hours to minimize disruption.",
  "dateFrom": "2024-01-15",
  "dateTo": "2024-01-20",
  "timeFrom": "08:00",
  "timeTo": "17:00",
  "workLocation": "Building A - Level 2 - Electrical Room",
  "selectedLightWorks": ["Minor repair works", "Light maintenance works"],
  "selectedCriticalWorks": ["Heavy Maintenance works", "Energized electrical work"],
  "permitRenewalNumber": "PTW-2023-089",
  "otherLightWork": "",
  "otherCriticalWork": "",
  "impactFireAlarm": "No",
  "impactFireFighting": "Yes",
  "impactGasDistribution": "No",
  "fireAlarmRemarks": "Temporary isolation required during testing",
  "fireFightingRemarks": "",
  "gasDistributionRemarks": "",
  "ppeEquipment": [
    "Safety helmet and safety shoes",
    "Ear plugs / mask / gloves",
    "Safety Vest",
    "Warning signs / safety barriers",
    "Eyes protection"
  ],
  "otherPpe": "Arc flash protection suit",
  "equipmentRequired": ["Mobile elevating work platform (MEWP)", "Scaffolding"],
  "otherEquipment": "Electrical testing equipment",
  "documentsToAttach": ["Method statement & risk assessment or JSA", "Drawings, layout plan"],
  "otherDocuments": "Electrical safety certificates",
  "undertakingName": "John Doe",
  "undertakingSign": "J. Doe",
  "undertakingDate": "2024-01-15",
  "permitAuthorizerName": "Sarah Johnson",
  "permitAuthorizerSign": "S. Johnson",
  "permitAuthorizerDate": "2024-01-16",
  "gmgSiteInChargeName": "Mike Wilson",
  "gmgSiteInChargeSign": "M. Wilson",
  "gmgSiteInChargeDate": "2024-01-16",
  "hsRiskAssessmentName": "Alice Brown",
  "hsRiskAssessmentDate": "2024-01-16",
  "hsRiskAssessmentSign": "A. Brown",
  "permitClosureContractorName": "John Doe",
  "permitClosureContractorDate": "2024-01-27",
  "permitClosureContractorSign": "J. Doe",
  "permitClosurePermitHolderName": "Jane Smith",
  "permitClosurePermitHolderDate": "2024-01-27",
  "permitClosurePermitHolderSign": "J. Smith",
  "permitClosurePermitAuthorizerName": "Robert Johnson",
  "permitClosurePermitAuthorizerDate": "2024-01-27",
  "permitClosurePermitAuthorizerSign": "R. Johnson"
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getToolboxTalkPrompt = (
  topic,
  projectName,
  workLocation,
  industry
) => {
  return `You are an AI assistant that generates structured JSON for a Toolbox Talk document.

Using the following input:
- Topic: ${topic}
- Project Name: ${projectName}
- Work Location: ${workLocation}
- Industry: ${industry}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "project": "string - project name",
  "workLocation": "string - specific work location",
  "disciplines": "string - relevant disciplines involved",
  "talkLocation": "string - location where talk was conducted",
  "time": "string - time of the talk (HH:MM AM/PM)",
  "workActivity": "string - comprehensive and professional description of the toolbox talk content",
  "comments": "string - professional summary of the session outcomes and participant engagement"
}

Guidelines:
1. "project": Should be the project name provided
2. "workLocation": Should be specific and detailed location information
3. "disciplines": Should include relevant trades or disciplines for the topic and industry
4. "talkLocation": Should be a realistic location where toolbox talks are typically conducted
5. "time": Should be a realistic time format (e.g., "08:00 AM", "14:30 PM")
6. "workActivity": Should be a comprehensive, professional description that includes:
   - Clear explanation of the safety topic
   - Key learning objectives
   - Specific safety procedures and protocols
   - Equipment and PPE requirements
   - Risk mitigation strategies
   - Emergency procedures if applicable
   - Use professional, technical language appropriate for the industry
7. "comments": Should be a professional summary that includes:
   - Session effectiveness and participant engagement
   - Understanding demonstrated by participants
   - Areas for improvement or additional training needs
   - Positive feedback and successful outcomes
   - Follow-up actions or recommendations
   - Use professional, objective language

Example output:
{
  "project": "ABC Construction Project",
  "workLocation": "Building A - 3rd Floor",
  "disciplines": "Electrical, Plumbing, HVAC",
  "talkLocation": "Site Office",
  "time": "08:00 AM",
  "workActivity": "This comprehensive toolbox talk session addressed critical safety protocols for elevated work environments. The presentation encompassed detailed procedures for fall protection equipment utilization, including proper harness fitting, anchor point selection, and lanyard inspection protocols. Participants were instructed on pre-work safety assessments, hazard identification methodologies, and emergency response procedures. Emphasis was placed on compliance with industry standards and regulatory requirements. The session included practical demonstrations of equipment inspection procedures and emergency evacuation protocols.",
  "comments": "The toolbox talk session demonstrated excellent participant engagement and comprehension of safety protocols. All attendees successfully completed the practical assessment components and demonstrated proficiency in equipment inspection procedures. Participant feedback indicated strong understanding of fall protection requirements and emergency response protocols. The session identified opportunities for advanced training in specialized equipment operation. Overall session effectiveness was rated highly, with positive feedback regarding the practical demonstration components and interactive elements."
}

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};
