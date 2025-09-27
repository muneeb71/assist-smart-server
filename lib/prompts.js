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
  approvedByOccupation,
  country,
  state
) => {
  const activities = Array.isArray(activityType) ? activityType : [activityType];
  const activityTypesText = activities.join(", ");
  
  return `You are an AI assistant that generates structured JSON for a Health & Safety Risk Assessment.

Using the following input:
- Industry: ${industry}
- Activity Types: ${activityTypesText}
- Location: ${location}
- Country: ${country}
- State: ${state || "Not specified"}
- Existing Control Measures: ${existingControlMeasures}
- Responsible Departments: ${responsibleDepartments}
- Prepared By: ${preparedBy} (${preparedByOccupation})
- Reviewed By: ${reviewedBy} (${reviewedByOccupation})
- Approved By: ${approvedBy} (${approvedByOccupation})

**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${industry}" industry and the following activities: ${activityTypesText}. Every detail, hazard, control measure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified industry and all activity types context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to ALL activities: ${activityTypesText} in the "${industry}" industry
- **MULTI-ACTIVITY COVERAGE**: Generate comprehensive content that covers hazards, control measures, and requirements for ALL specified activities
- **ACTIVITY-SPECIFIC HAZARDS**: Identify hazards specific to each activity type and common hazards across all activities
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- **COUNTRY-SPECIFIC REQUIREMENTS**: Include specific regulations, standards, and compliance requirements for "${country}" (e.g., UAE OSHAD, ADNOC, DEWA standards for UAE; OSHA, EPA, NFPA for USA; HSE, BS standards for UK; etc.)
- **LOCATION FIELD**: The location "${location}" is static data that should be used as-is in the workplace field (Industry + Location) - do not generate location-specific content
- **CONTROL MEASURES REQUIREMENTS**: Each hazard must have comprehensive control measures and separate further control measures specific to that hazard
- **HAZARD-SPECIFIC CONTROLS**: Further control measures must be tailored specifically to each individual hazard, not generic controls
- **DETAILED CONTROL MEASURES**: Each hazard's controlMeasures must include at least 4-6 specific control measures (e.g., PPE, procedures, equipment, training, monitoring, emergency response)
- **COMPREHENSIVE FURTHER CONTROLS**: Each hazard's furtherControlMeasures must include at least 4-6 additional advanced/supplementary controls that are completely different from the basic controlMeasures (e.g., engineering controls, administrative controls, advanced PPE, specialized training, monitoring systems, backup systems)
- **NO GENERIC CONTROLS**: Avoid generic statements like "follow safety procedures" or "use PPE" - be specific about what procedures, what type of PPE, what training, etc.

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting, no code blocks, no json markers, no backticks.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

1. "workplace": Industry + Location.
2. Add three additional fields after "workplace" which would be detailed at least 60-70 words:
   - "purpose": A clear statement describing the aim of this risk assessment for the activities: ${activityTypesText}.
   - "scope": A concise explanation of what areas, processes, departments, and activities are covered (including all specified activities).
   - "introduction": A brief overview of the assessment's objective, methods, and safety intent for all specified activities.
3. "activity": All Activity Types (${activityTypesText}).
4. "dateConducted": today's date (ISO format).
5. "preparedBy": name and occupation.
6. "reviewedBy": name and occupation.
7. "approvedBy": name and occupation.
8. "responsibleDepartments": array of departments.
9. "activities": object where each key is an activity name and value contains:
   - "hazards": array of at least 10 unique hazards for this specific activity, each with:
     - "name": specific hazard name relevant to the industry and this specific activity
     - "cause": detailed explanation of how the hazard occurs (8-12 words)
     - "effect": specific injury, damage, or harm that can result (8-12 words)
     - "riskLevel": "Low", "Medium", or "High" based on severity and probability
     - "controlMeasures": comprehensive control measures for this specific hazard (25-40 words) - must include multiple specific control measures
     - "furtherControlMeasures": additional specific control measures for this hazard (25-40 words) - must be completely different from controlMeasures and include advanced/supplementary controls
   - "atRisk": array, use only these values:
     - "E" = Employees
     - "C" = Contractors
     - "V" = Visitors
     - "P" = Public
     - "A" = All
   - "presentRisk": object with:
     - "severity": integer from 1 to 5
     - "probability": integer from 1 to 5
     - "riskLevel": one of "Low", "Medium", or "High"
   - "residualRisk": object with:
     - "severity": integer from 1 to 5 (must be lower than presentRisk.severity)
     - "probability": integer from 1 to 5 (must be lower than presentRisk.probability)
     - "riskLevel": one of "Low", "Medium", or "High" (must be lower than presentRisk.riskLevel)
   - "furtherControlMeasures": array of general additional controls and improvements for this specific activity - must include EXACTLY the same number of items as the hazards array (one for each hazard) - each item should be comprehensive control measures specific to the corresponding hazard
10. "existingControlMeasures": array of professional, rephrased versions of the given control measures.
11. "actionSupervision": array of departments or roles (e.g., "H&S Team", "Site Supervisors").
12. "preparedDate": today's date (ISO format).
13. "reviewDate": today's date (ISO format).
14. "approvedDate": today's date (ISO format).
15. "furtherActions": string for additional actions to be taken (not an array).
16. "additionalComments": string for any extra notes.
17. "glossary": array of objects, each containing:
    - "term": abbreviation used in the content
    - "definition": full expansion of the abbreviation (just the full form, no detailed explanation)

Schema example:
{
  "workplace": "Manufacturing Facility, Industrial Zone",
  "purpose": "purpose of report here",
  "scope": "scope of risk assessment report here",
  "introduction": "introduction to the report here",
  "activity": "${activityTypesText}",
  "dateConducted": "2024-01-15",
  "preparedBy": "Safety Officer (Name)",
  "reviewedBy": "H&S Manager (Name)",
  "approvedBy": "Director (Name)",
  "responsibleDepartments": ["Production", "Maintenance"],
  "activities": {
    "Activity 1": {
      "hazards": [
        {
          "name": "Wet Floor Surface",
          "cause": "Water spillage from cleaning activities or equipment operation",
          "effect": "Slips, trips, and falls causing musculoskeletal injuries",
          "riskLevel": "Medium",
          "controlMeasures": "Immediate cleanup procedures with absorbent materials, warning signs placement in multiple languages, non-slip footwear requirement with proper tread depth, regular floor inspections every 2 hours, designated cleaning schedules during low-traffic periods, proper drainage system maintenance",
          "furtherControlMeasures": "Anti-slip floor coatings application in high-risk areas, automated drainage system improvements with sensors, designated walkways with non-slip tape, emergency response procedures with first aid training, slip-resistant floor mats in critical areas, regular floor surface testing for slip resistance"
        },
        {
          "name": "Moving Machinery Parts",
          "cause": "Unguarded equipment during production operations",
          "effect": "Crushing injuries, amputations, and severe trauma",
          "riskLevel": "High",
          "controlMeasures": "Machine guards installation meeting ISO 14120 standards, lockout/tagout procedures with personal locks, comprehensive safety training programs with competency assessment, regular equipment inspections by certified technicians, emergency stop buttons within 3 meters of each operator, warning signs and safety barriers around machinery",
          "furtherControlMeasures": "Automated safety systems with light curtains and pressure mats, emergency stop mechanisms with redundant systems, operator certification requirements with annual renewal, predictive maintenance schedules using vibration analysis, interlocked safety systems preventing operation without guards, remote monitoring systems with real-time alerts"
        }
      ],
      "atRisk": ["E", "C"],
      "presentRisk": {
        "severity": 3,
        "probability": 4,
        "riskLevel": "High"
      },
      "residualRisk": {
        "severity": 2,
        "probability": 2,
        "riskLevel": "Medium"
      },
      "furtherControlMeasures": [
        "Advanced slip-resistant floor treatment with nanotechnology coating, automated moisture detection sensors with real-time alerts, designated pedestrian walkways with anti-slip tape, emergency response procedures with trained first aid personnel, slip-resistant floor mats in critical areas, regular floor surface testing for slip resistance using specialized equipment",
        "Automated safety systems with light curtains and pressure mats, emergency stop mechanisms with redundant systems, operator certification requirements with annual renewal, predictive maintenance schedules using vibration analysis, interlocked safety systems preventing operation without guards, remote monitoring systems with real-time alerts and automated shutdown capabilities"
      ]
    }
  },
  "existingControlMeasures": [
    "Wet floor signs placed promptly",
    "Regular cleaning schedules followed"
  ],
  "actionSupervision": [
    "H&S Team",
    "Site Supervisors"
  ],
  "preparedDate": "2024-01-15",
  "reviewDate": "2024-01-15",
  "approvedDate": "2024-01-15",
  "furtherActions": "Schedule safety training and review incident reports monthly",
  "additionalComments": "No further comments.",
  "glossary": [
    {
      "term": "PPE",
      "definition": "Personal Protective Equipment"
    },
    {
      "term": "LOTO",
      "definition": "Lockout/Tagout"
    },
    {
      "term": "HSE",
      "definition": "Health, Safety and Environment"
    },
    {
      "term": "SMS",
      "definition": "Safety Management System"
    },
    {
      "term": "ALARP",
      "definition": "As Low As Reasonably Practicable"
    }
  ]
}

**FINAL REMINDER**: 
- Generate content that is SPECIFICALLY about ALL activities: "${activityTypesText}" in the "${industry}" industry
- **EQUAL ACTIVITY TREATMENT**: ALL activities have the same priority and importance - no primary activity concept
- **COMPREHENSIVE ACTIVITY COVERAGE**: Ensure the risk assessment covers hazards and control measures for ALL specified activities equally
- **ACTIVITY-SPECIFIC CONTENT**: Each activity must have its own complete set of hazards, control measures, and risk assessments with equal detail
- **ACTIVITY-BASED STRUCTURE**: Generate separate data for each activity in the activities object - each activity should have at least 10 unique hazards
- **HAZARD-CONTROL MATCHING**: Each hazard must have corresponding control measures and further control measures specific to that hazard
- **FURTHER CONTROL MEASURES COUNT**: The activity-level "furtherControlMeasures" array must contain EXACTLY the same number of items as the "hazards" array - one comprehensive further control measure for each hazard
- **EQUAL COVERAGE**: ALL activities should have the same level of detail, same number of hazards (at least 10 per activity), and same structure
- **NO ACTIVITY HIERARCHY**: Do not prioritize any activity over others - treat all activities with equal importance and detail
- DO NOT use generic template content that could apply to any activity or industry
- Every field must contain information that is directly relevant to the specific activity and "${industry}"
- **CONTROL MEASURES QUALITY**: Each hazard must have detailed, specific, and comprehensive control measures. Avoid vague statements like "use safety equipment" - specify exactly what equipment, what procedures, what training, etc.
- **FURTHER CONTROL MEASURES**: Must be completely different from basic control measures and include advanced/supplementary controls specific to each hazard
- **MINIMUM REQUIREMENTS**: Each hazard must have at least 4-6 specific control measures and 4-6 specific further control measures
- **COUNT MATCHING**: If an activity has 10 hazards, the activity-level "furtherControlMeasures" array must have exactly 10 items (one for each hazard)
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- **COUNTRY AND STATE COMPLIANCE**: Ensure all content complies with "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } specific regulations, standards, and requirements
- **LOCATION USAGE**: Use the location "${location}" as static data in the workplace field (Industry + Location) - do not generate location-specific content
- **CONTROL MEASURES ENHANCEMENT**: Ensure each hazard has both comprehensive initial control measures and specific further control measures tailored to that hazard
- **HAZARD-SPECIFIC APPROACH**: Further control measures must address the specific risks and characteristics of each individual hazard
- **ACTIVITY STRUCTURE**: Each activity in the activities object should be a complete risk assessment with its own hazards, risks, and control measures
- **UNIFORM TREATMENT**: All activities must receive the same level of attention, detail, and comprehensive coverage
- **GLOSSARY REQUIREMENTS**: Generate a simple glossary of abbreviations that includes:
  - All abbreviations and acronyms used in the risk assessment content
  - Industry-specific abbreviations (OSHA, HSE, ISO, ANSI, etc.)
  - Safety management abbreviations (SMS, PPE, JSA, ALARP, etc.)
  - Technical abbreviations specific to the industry and activities
  - Each glossary entry must have: term (abbreviation) and definition (full expansion only)
- **NO MARKDOWN FORMATTING**: Do not wrap the JSON in 'json' code blocks or use any backticks
- **CLEAN OUTPUT**: Start directly with '{' and end with '}' - no other text before or after

**FINAL JSON VALIDATION CHECK**:
- Count all opening '{' and closing '}' braces - they must match
- Count all opening '[' and closing ']' brackets - they must match  
- Ensure no trailing commas after the last item in arrays or objects
- Verify all strings are properly quoted with double quotes
- Make sure the JSON is complete and can be parsed by JSON.parse()

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, formatting, code blocks, 'json' markers, or backticks. The response must be strictly machine-readable JSON.`;
};

export const getIncidentInvestigationReportPrompt = ({
  incidentCategory,
  description,
  immediateCausesUnsafeActs,
  immediateCausesUnsafeConditions,
  rootCauses,
}) => {
  return `**CRITICAL REQUIREMENT**: Generate content based ONLY on the information provided by the user. Do NOT add any external details, specific locations, names, or information that was not explicitly provided in the input. Use ONLY the incident description and other user inputs to create the analysis.

**STRICT CONTENT REQUIREMENTS**:
- Use ONLY the information provided in the user inputs
- Do NOT add specific details like road names, company names, or locations unless provided
- Do NOT research or add external industry-specific information
- Base all analysis on the actual incident description provided
- Keep all content generic and focused on the provided incident details
- If any dates are mentioned in the description, format them as dd-mm-yyyy (e.g., 15-03-2024)

You are an AI assistant that generates structured JSON for an Incident Investigation Report document.

Using the following input:
- Incident Category: ${incidentCategory}
- Description: ${description}
- Immediate Causes (Unsafe Acts): ${immediateCausesUnsafeActs?.join(", ")}
- Immediate Causes (Unsafe Conditions): ${immediateCausesUnsafeConditions?.join(
    ", "
  )}
- Root Causes (Personal Factors): ${rootCauses?.join(", ")}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

The JSON must follow this structure:

{
  "description": "string - rephrased incident description,
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
  "correctiveActionPlan": [
    {
      "actionRequired": "string - specific action needed to prevent recurrence",
      "resourcesRequired": "string - resources needed to complete the action",
      "responsibility": "string - person or department responsible for the action",
      "timeframe": "string - timeframe for completion (e.g., 'Immediate', 'Within 7 days', 'Within 30 days')"
    }
  ]
}



Guidelines:
1. "description": Rephrase the following incident description in a formal, professional tone as an HSE (Health, Safety, and Environment) Manager would write it in an official report. Maintain all original facts without adding new information. Ensure clarity, precision, and objectivity, using industry-appropriate language.
2. "fiveWhys": Follow the 5-Why analysis methodology with logical progression based on the provided incident description. Each answer must be 10-15 words in length and be specific, concrete, and actionable. The final (5th) why should relate to the provided unsafe acts or unsafe conditions. Avoid vague statements like "requires further assessment" or "needs investigation". Focus on immediate, observable causes.
3. "correctiveActionPlan": Include exactly 1 specific, actionable item that addresses the root causes identified from the provided incident details only.
4. Each action should be realistic and achievable within the specified timeframe
5. Resources should be generic (e.g., "Safety equipment", "Training materials", "Engineering support") - do not specify brand names or specific locations
6. Responsibility should be generic roles (e.g., "HSE Manager", "Site Supervisor", "Training Department") - do not use specific names
7. Timeframes should be realistic and appropriate for the action type

Example output:
{
  "description": "Staff member sustained minor injury to left hand thumb while separating frozen chicken using handheld scraper in factory area.",
  "fiveWhys": [
    {
      "level": 1,
      "question": "Why is it happening?",
      "answer": "Thumb came into contact with handheld scraper during chicken separation"
    },
    {
      "level": 2,
      "question": "Why is that?",
      "answer": "Task required force and close proximity to sharp edges without control"
    },
    {
      "level": 3,
      "question": "Why is that?",
      "answer": "Frozen chicken pieces were difficult to separate requiring manual force"
    },
    {
      "level": 4,
      "question": "Why is that?",
      "answer": "Worker required more effort and was not focused on the task"
    },
    {
      "level": 5,
      "question": "Why is that?",
      "answer": "Lack of attention and concentration during manual task"
    }
  ],
  "correctiveActionPlan": [
    {
      "actionRequired": "Conduct briefing on safe working practices for all workers in similar activities",
      "resourcesRequired": "Training materials and safety guidelines",
      "responsibility": "Site Supervisor and Safety Team",
      "timeframe": "Immediate"
    }
  ]
}

**FINAL REMINDER**: 
- Use ONLY the information provided in the user inputs
- Do NOT add external details, specific locations, names, or information not provided
- Base all analysis on the actual incident description provided
- Keep content generic and focused on the provided incident details
- Do NOT research or add industry-specific information unless it was provided in the inputs
- Ensure 5-Why answers are specific, concrete, and actionable - avoid vague statements
- Format any dates mentioned in the description as dd-mm-yyyy (e.g., 15-03-2024)

**FINAL JSON VALIDATION CHECK**:
- Count all opening '{' and closing '}' braces - they must match
- Count all opening '[' and closing ']' brackets - they must match  
- Ensure no trailing commas after the last item in arrays or objects
- Verify all strings are properly quoted with double quotes
- Make sure the JSON is complete and can be parsed by JSON.parse()

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
  projectName,
  country,
  state
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${activityType}" activity and industry context. Every detail, hazard, control measure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified activity and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${activityType}" and industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- **COUNTRY-SPECIFIC REQUIREMENTS**: Include specific regulations, standards, and compliance requirements for "${country}" (e.g., UAE OSHAD, ADNOC, DEWA standards for UAE; OSHA, EPA, NFPA for USA; HSE, BS standards for UK; etc.)

You are an AI assistant that generates structured JSON for a Job Safety Analysis (JSA) document.

Using the following input:
- Activity Type: ${activityType}
- Assessed By: ${assessedBy}
- Date: ${date}
- Designation: ${designation}
- Known Hazards: ${knownHazards}
- Project Name: ${projectName}
- Country: ${country}
- State: ${state || "Not specified"}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

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
3. "controlMeasures": Should include at least 7-8 specific, practical control measures that address the identified hazards (should be maximum 15-20 words each). Each control measure must be:
   - SPECIFIC and ACTIONABLE (not generic)
   - Include exact equipment specifications when applicable (e.g., "CO2 fire extinguisher", "rubber hand gloves (Tested and Trademark)")
   - Mention specific personnel roles and responsibilities (e.g., "operator", "electrician", "driver")
   - Include daily procedures and checklists where relevant (e.g., "Daily check for equipment and checklist to be fulfilled daily")
   - Specify exact PPE requirements with types and standards (e.g., "nose mask for cement loading", "safety goggles")
   - Include documentation and permit requirements (e.g., "Documents to be checked and cleared 'OK' before entering site")
   - Mention specific safety equipment and their locations (e.g., "green sticker for machinery", "identification boards")
   - Include supervision and access control measures (e.g., "Only authorised operator to operate", "Unauthorised entry to be restricted")
   - Specify testing and certification requirements (e.g., "All machinery to be checked and certified")
   - Include traffic management and isolation procedures (e.g., "Movement area of machine to be isolated", "Access to be cleared from unwanted materials")

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
        "Entry to be restricted inside excavation area other than authorised personnel",
        "Only certified excavator operator to operate the machinery with valid licence",
        "Proper earthing to be given and all electrical connections through ELCB only",
        "Electrician to use rubber hand gloves (Tested and Trademark) during electrical work",
        "Identification boards and warning signs to be displayed around excavation area",
        "All machinery to be checked and certified by putting green sticker daily",
        "All moving parts to be guarded and no loose clothing allowed near machinery",
        "CO2 fire extinguisher to be provided at excavation site entrance"
      ]
    }
  ]
}

**FINAL REMINDER**: 
- Generate content that is SPECIFICALLY about "${activityType}" and industry context
- Control measures must be PRACTICAL and SPECIFIC like the example provided
- Include exact equipment names, personnel roles, daily procedures, and specific requirements
- Avoid generic safety statements - be specific about what, who, when, and where
- Include documentation requirements, testing procedures, and access controls
- Specify exact PPE types, safety equipment, and certification requirements
- DO NOT use generic template content that could apply to any activity or industry
- Every field must contain information that is directly relevant to "${activityType}" and industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- **COUNTRY AND STATE COMPLIANCE**: Ensure all content complies with "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } specific regulations, standards, and requirements

**FINAL JSON VALIDATION CHECK**:
- Count all opening '{' and closing '}' braces - they must match
- Count all opening '[' and closing ']' brackets - they must match  
- Ensure no trailing commas after the last item in arrays or objects
- Verify all strings are properly quoted with double quotes
- Make sure the JSON is complete and can be parsed by JSON.parse()

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getMethodStatementPrompt = (
  activityType,
  industry,
  country,
  state
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${activityType}" activity and "${industry}" industry context. Every detail, procedure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified activity and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${activityType}" and "${industry}" industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- **COUNTRY-SPECIFIC REQUIREMENTS**: Include specific regulations, standards, and compliance requirements for "${country}" (e.g., UAE OSHAD, ADNOC, DEWA standards for UAE; OSHA, EPA, NFPA for USA; HSE, BS standards for UK; etc.)
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details

You are an AI assistant that generates structured JSON for a Method Statement document.

Using the following input:
- Activity Type: ${activityType}
- Industry: ${industry}
- Country: ${country}
- State: ${state || "Not specified"}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

**DYNAMIC SECTION GENERATION**:
- Generate appropriate section titles and content based on the activity type and industry
- For each section, create titles that are relevant to the specific activity type (e.g., "Excavation", "Welding", "Scaffolding", etc.)
- Adapt all content to be relevant to the specific activity type and industry context
- Do NOT use generic or hardcoded activity-specific terms unless they apply to the given activity type
- DO NOT include specific real-world facts, locations, names, or coordinates
- Use generic, industry-appropriate examples and terminology
- Generate 8-12 sections that are most relevant to the activity type and industry

The JSON must follow this structure:

{
  "documentTitle": "string - document title based on activity type and industry",
  "industry": "string - industry name",
  "activityType": "string - activity type",
  "industryImage": "/static/industry.png",
  "sections": [
    {
      "id": "string - unique section id",
      "title": "string - appropriate title based on activity type",
      "type": "text|list|mixed",
      "content": "string - for text type",
      "items": ["string - for list type"],
      "mixedContent": {
        "text": "string - for mixed type",
        "description": "string - for mixed type",
        "items": ["string - for mixed type"]
      }
    }
  ]
}

**STRICT CONTENT REQUIREMENTS**:
- Generate 8-12 sections that are most relevant to the activity type and industry
- Each section should have appropriate content type (text, list, or mixed) based on the content
- Include sections such as:
  - Activity description and overview
  - Methods and approaches
  - Purpose and objectives
  - Scope and coverage
  - Safety standards and regulations
  - Personal protective equipment (PPE)
  - Safety measures and protection methods
  - Step-by-step procedures
  - Safety precautions
  - Potential hazards
  - Pre-work checklists
  - Quality control measures
- All content must be specific to the activity type and industry
- Include exact measurements, specifications, and procedures where applicable
- Include specific equipment names and safety requirements
- Include regulatory references and compliance standards

**FINAL REMINDER**: 
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- Make all content PRACTICAL and ACTIONABLE like the example provided
- **COUNTRY AND STATE COMPLIANCE**: Ensure all content complies with "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } specific regulations, standards, and requirements
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getResponsePlanPrompt = (
  activityType,
  projectName,
  industry,
  country,
  state
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${activityType}" activity type and "${industry}" industry context. Every detail, procedure, and requirement must reflect industry-specific practices, regulations, and operational protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified activity type and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${activityType}" and "${industry}" industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and operational protocols
- Use industry-specific training requirements and competency standards
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- **COUNTRY-SPECIFIC REQUIREMENTS**: Include specific regulations, standards, and compliance requirements for "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } (e.g., UAE OSHAD, ADNOC, DEWA standards for UAE; OSHA, EPA, NFPA for USA; HSE, BS standards for UK; etc.)
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details

You are an AI assistant that generates structured JSON for a Policies and Procedures document.

Using the following input:
- Activity Type: ${activityType}
- Project Name: ${projectName}
- Industry: ${industry}
- Country: ${country}
- State: ${state || "Not specified"}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

**DYNAMIC SECTION GENERATION**:
- Generate appropriate section titles and content based on the activity type
- For "operationalProcedures" section: Use appropriate title and content based on activity type (e.g., "Standard Operating Procedures", "Work Procedures", "Safety Procedures", etc.)
- For "implementationProcedures" section: Include procedures appropriate to the activity type (e.g., work procedures, safety protocols, quality control procedures, etc.)
- Adapt all content to be relevant to the specific activity type and industry context
- Do NOT use generic or hardcoded activity-specific terms unless they apply to the given activity type
- DO NOT include specific real-world facts, locations, names, or coordinates
- Use generic, industry-appropriate examples and terminology
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

The JSON must follow this structure:

{
  "documentTitle": "string - document title based on emergency type",
  "sections": [
    {
      "id": "scope",
      "title": "Scope",
      "type": "text",
      "content": "string - detailed scope description"
    },
    {
      "id": "objective",
      "title": "Objective",
      "type": "text",
      "content": "string - detailed objective description"
    },
    {
      "id": "definition",
      "title": "Definition",
      "type": "text",
      "content": "string - detailed definition of emergency type"
    },
    {
      "id": "rolesAndResponsibilities",
      "title": "Roles and Responsibilities",
      "type": "subsections",
      "subsections": [
        {
          "title": "string - role title",
          "content": "string - detailed responsibilities"
        }
      ]
    },
    {
      "id": "operationalProcedures",
      "title": "string - appropriate title based on activity type",
      "type": "mixed",
      "mixedContent": {
        "text": "string - detailed explanation of operational procedures",
        "subtitle": "string - appropriate subtitle",
        "description": "string - description",
        "items": ["string - procedure/requirement 1", "string - procedure/requirement 2"]
      }
    },
    {
      "id": "training",
      "title": "Training",
      "type": "text",
      "content": "string - detailed training requirements"
    },
    {
      "id": "generalPrecautions",
      "title": "General Precautions",
      "type": "text",
      "content": "string - detailed precautions"
    },
    {
      "id": "implementationProcedures",
      "title": "Implementation Procedures",
      "type": "subsections",
      "subsections": [
        {
          "title": "string - procedure title",
          "content": "string - detailed procedure"
        }
      ]
    },
    {
      "id": "records",
      "title": "Records",
      "type": "text",
      "content": "string - detailed records requirements"
    },
    {
      "id": "appendix",
      "title": "Appendix",
      "type": "text",
      "content": "string - appendix content"
    }
  ]
}

**STRICT CONTENT REQUIREMENTS**:
1. "scope": Should define the applicability of the policies and procedures to specific activities and project with exact project details, site locations, and specific work activities relevant to the activity type
2. "objective": Should clearly state the purpose and goals of the policies and procedures with specific regulatory compliance requirements and project-specific objectives
3. "definition": Should provide a detailed explanation of the activity type and its operational requirements with appropriate terminology and specific industry context
4. "rolesAndResponsibilities": Should include specific responsibilities for each role with exact duties, contact information, and project-specific requirements:
   - projectDirector: High-level oversight and resource management with specific project responsibilities
   - hseManager: Safety coordination and training oversight with specific regulatory compliance duties
   - operationalTeam: Direct operational activities with specific equipment and procedures
   - employees: General operational duties and cooperation requirements with specific project protocols
5. "operationalProcedures": Should explain the operational procedures and requirements with specific timeframes and relevant details appropriate to the activity type
6. "training": Should emphasize the importance of training and practical demonstrations with specific certification requirements and training schedules
7. "generalPrecautions": Should include key safety measures and operational factors with specific procedures, equipment requirements, and timeframes
8. "implementationProcedures": Should include appropriate implementation methods with specific equipment, procedures, and safety requirements based on the activity type:
   - Include 4-6 different implementation procedures appropriate to the activity type
   - Each procedure should have specific equipment, techniques, and safety protocols
   - Include specific roles, responsibilities, and communication protocols
   - Include specific equipment specifications and requirements
9. "records": Should specify documentation and compliance requirements with specific forms, reporting procedures, and regulatory compliance requirements

**FINAL REMINDER**: 
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- Make all content PRACTICAL and ACTIONABLE like the example provided
- **COUNTRY AND STATE COMPLIANCE**: Ensure all content complies with "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } specific regulations, standards, and requirements
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details

**FINAL JSON VALIDATION CHECK**:
- Count all opening '{' and closing '}' braces - they must match
- Count all opening '[' and closing ']' brackets - they must match  
- Ensure no trailing commas after the last item in arrays or objects
- Verify all strings are properly quoted with double quotes
- Make sure the JSON is complete and can be parsed by JSON.parse()

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getPoliciesAndProceduresPrompt = (
  activityType,
  projectName,
  industry,
  country,
  state
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${activityType}" activity type and "${industry}" industry context. Every detail, procedure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified activity type and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${activityType}" and "${industry}" industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- **COUNTRY-SPECIFIC REQUIREMENTS**: Include specific regulations, standards, and compliance requirements for "${country}" (e.g., UAE OSHAD, ADNOC, DEWA standards for UAE; OSHA, EPA, NFPA for USA; HSE, BS standards for UK; etc.)
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details

You are a professional Health and Safety expert that generates structured JSON for a Policies and Procedures document.

Using the following input:
- Activity Type: ${activityType}
- Project Name: ${projectName}
- Industry: ${industry}
- Country: ${country}
- State: ${state || "Not specified"}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

**DYNAMIC SECTION GENERATION**:
- Generate "tableOfContents", "purpose", "scope", "introduction", "arrangements", and "responsibilities" sections as specified
- Generate 7-9 additional relevant sections based on the activity type
- Create appropriate section titles and content that are relevant to the specific activity type
- Include sections such as risk assessment, emergency planning, training, etc.
- Adapt all content to be relevant to the specific activity type and industry context
- **TABLE OF CONTENTS FORMATTING**: 
  - Main sections: 1, 2, 3, 4, 5, etc.
  - Subsections: 1.1, 1.2, 1.3, 2.1, 2.2, etc.
  - NO section name prefixes in subsection titles (e.g., "Arrangements - Pre-Inspection" should be "3.1 Pre-Inspection")
  - Clean, hierarchical numbering structure
- Do NOT use generic or hardcoded activity-specific terms unless they apply to the given activity type
- DO NOT include specific real-world facts, locations, names, or coordinates
- Use generic, industry-appropriate examples and terminology
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

The JSON must follow this structure:

{
  "documentTitle": "string - professional document title based on activity type and industry",
  "sections": [
    {
      "id": "applicability",
      "title": "Applicability",
      "type": "text",
      "content": "string - 12-15 word description of who this document applies to, based on the activity type and industry context"
    },
    {
      "id": "tableOfContents",
      "title": "Table of Contents",
      "type": "list",
      "items": ["string - dynamically generated list of all headings and sub-headings with hierarchical numbering (1, 2, 3 for main sections; 1.1, 1.2, 1.3 for subsections)"]
    },
    {
      "id": "purpose",
      "title": "1. Purpose",
      "type": "text",
      "content": "string - detailed purpose description with regulatory compliance requirements"
    },
    {
      "id": "scope",
      "title": "2. Scope",
      "type": "text",
      "content": "string - detailed scope description specific to activity type and industry"
    },
    {
      "id": "introduction",
      "title": "3. Introduction",
      "type": "text",
      "content": "string - detailed explanation of the activity regarding policies and procedures, including background information and context"
    },
    {
      "id": "arrangements",
      "title": "4. Arrangements",
      "type": "subsections",
      "subsections": [
        {
          "title": "4.1 string - arrangement title (e.g., 'Fire Risk Assessment', 'Emergency Planning', 'Team Member Training', 'Safety Checks')",
          "content": "string - detailed description of the arrangement with responsibility assignment"
        }
      ]
    },
    {
      "id": "responsibilities",
      "title": "5. Responsibilities",
      "type": "subsections",
      "subsections": [
        {
          "title": "5.1 string - department name (e.g., 'HSE', 'Management', 'Employees', 'Contractors', 'Supervisors')",
          "content": "string - detailed responsibilities in bullet points format (at least 5-6 bullet points per department)"
        }
      ]
    }
    // Additional sections will be automatically generated based on the activity type
    // Each section should be relevant and specific to the activity type and industry context
    // Include appropriate subsections where relevant
  ]
}

**STRICT CONTENT REQUIREMENTS**:
1. "documentTitle": Should be a professional title that clearly identifies the type of policies and procedures document for the specific activity type and industry
2. "applicability": Should contain a 12-15 word description of who this document applies to, based on the activity type and industry context
3. "tableOfContents": Should list all generated headings and sub-headings in a logical order with proper hierarchical numbering:
   - Main sections: 1, 2, 3, 4, 5, etc.
   - Subsections: 1.1, 1.2, 1.3, 2.1, 2.2, etc.
   - NO section name prefixes in subsection titles
   - Clean, hierarchical structure for easy navigation
4. "purpose": Should clearly state the purpose and goals of the policies and procedures with specific regulatory compliance requirements and project-specific objectives (minimum 60-80 words)
5. "scope": Should define the applicability of the policies and procedures to specific activities and project with exact project details, site locations, and specific work activities relevant to the activity type (minimum 60-80 words)
6. "introduction": Should provide a detailed explanation of the activity regarding policies and procedures, including background information, context, and importance (minimum 60-80 words)
7. "arrangements": Should include 4-6 key arrangements specific to the activity type, each with:
   - Clear title (e.g., 'Fire Risk Assessment', 'Emergency Planning', 'Team Member Training', 'Safety Checks')
   - Detailed description of the arrangement (maximum 20 words per arrangement)
   - Responsibility assignment (e.g., "Responsibility: HSE")
8. "responsibilities": Should include 5-6 departments/roles with detailed responsibilities:
   - Each department should have at least 5-6 bullet points of specific responsibilities
   - Each bullet point should be detailed and specific (minimum 15-25 words per bullet point)
   - Use bullet point format for clear readability
   - Include departments such as HSE, Management, Employees, Contractors, Supervisors
9. **AUTO-GENERATED SECTIONS**: Generate 7-9 additional relevant sections based on the activity type, including:
   - Risk assessment and hazard identification
   - Emergency planning and response procedures
   - Training requirements and competency standards
   - Safety checks and monitoring procedures
   - Practice and review procedures
   - Recording and documentation requirements
   - Equipment and resource requirements
   - Regulatory compliance and standards
   - Quality assurance and continuous improvement
   - Any other sections relevant to the specific activity type
10. **CONTENT REQUIREMENTS**: Every section MUST contain substantial, detailed content:
   - NO empty or minimal content sections
   - Each section should have comprehensive, actionable information
   - Minimum word counts specified above must be met
   - Content should be specific, practical, and implementable

**PROFESSIONAL WRITING REQUIREMENTS**:
- Use formal, professional language appropriate for official health and safety documentation
- Include specific regulatory references and compliance standards for the country
- Provide detailed, actionable procedures with clear step-by-step instructions
- Include specific equipment requirements, PPE specifications, and safety measures
- Reference industry-specific standards and best practices
- Include emergency procedures and contingency plans where applicable
- Ensure all content is legally compliant and meets regulatory requirements
- Use technical terminology appropriate for health and safety professionals
- Include specific timeframes, measurements, and procedures where relevant
- Provide comprehensive coverage of all aspects related to the activity type
- **AUTO-GENERATION**: The AI should intelligently determine which sections are most relevant for the specific activity type and generate appropriate content
- **SECTION VARIETY**: Include different types of sections (text, list, mixed, subsections) based on content needs
- **COMPREHENSIVE COVERAGE**: Ensure the document covers all essential aspects of the activity type from introduction to implementation
- **CONTENT DEPTH**: Every section must contain substantial, detailed content - NO minimal or placeholder content
- **ACTIONABLE INFORMATION**: All content must be specific, practical, and immediately implementable

**FINAL REMINDER**: 
- Include specific regulatory references with exact codes and standards for "${country}"
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- Make all content PRACTICAL and ACTIONABLE like the example provided
- **COUNTRY AND STATE COMPLIANCE**: Ensure all content complies with "${country}"${
    state ? ` and specifically "${state}" state` : ""
  } specific regulations, standards, and requirements
- **CRITICAL**: Every section MUST contain substantial, detailed content - NO headings without content
- **MINIMUM REQUIREMENTS**: Purpose (60-80 words), Scope (60-80 words), Introduction (60-80 words), Arrangements (maximum 20 words each), Responsibilities (15-25 words per bullet point)
- **NO PLACEHOLDER CONTENT**: Generate comprehensive, actionable information for every section
- **TABLE OF CONTENTS STRUCTURE**: 
  - Use hierarchical numbering (1, 2, 3 for main sections; 1.1, 1.2, 1.3 for subsections)
  - NO section name prefixes in subsection titles
  - Clean, professional formatting
  - **SECTION TITLE NUMBERING**: All section titles must include proper numbering (e.g., "1. Purpose", "2. Scope", "3. Introduction", "4. Arrangements", "5. Responsibilities")
  - **SUBSECTION TITLE NUMBERING**: All subsection titles must include proper numbering (e.g., "4.1 Fire Risk Assessment", "4.2 Emergency Planning", "5.1 HSE Department", "5.2 Management")
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

**FINAL JSON VALIDATION CHECK**:
- Count all opening '{' and closing '}' braces - they must match
- Count all opening '[' and closing ']' brackets - they must match  
- Ensure no trailing commas after the last item in arrays or objects
- Verify all strings are properly quoted with double quotes
- Make sure the JSON is complete and can be parsed by JSON.parse()

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getLegalRegisterTableDataPrompt = ({
  country,
  category,
  year,
}) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${country}" country, "${category}" category, and "${year}" year. Every regulation, description, and detail must reflect actual legal requirements, standards, and compliance protocols specific to the country and category. Do NOT generate generic content - ensure everything is directly relevant to the specified country, category, and year context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${country}", "${category}", and "${year}"
- Research and use actual country-specific legal terminology, regulations, and compliance requirements
- Include specific country standards, permits, and compliance requirements
- Reference actual legal frameworks, materials, and methodologies used in this country
- Include country-specific legal requirements, risk factors, and compliance protocols
- Use country-specific training requirements and competency standards

You are an expert legal database assistant.

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
**FINAL REMINDER**: 
- Generate content that is SPECIFICALLY about "${country}", "${category}", and "${year}"
- DO NOT use generic template content that could apply to any country, category, or year
- Every field must contain information that is directly relevant to the combination of "${country}", "${category}", and "${year}"
- Research and use actual country-specific legal terminology, regulations, and compliance requirements

  Make sure the output is valid JSON, parsable, and strictly adheres to the schema provided. Do not include any additional text, explanations, or formatting. The response must start with '[' and end with ']' to indicate a JSON array.`;
};

export const getEmergencyFireDrillPrompt = (inputs) => {
  const {
    scenarioDescription = "",
    section1Comments = "",
    section3Comments = "",
  } = inputs || {};

  const normalize = (v) =>
    Array.isArray(v) ? v.join(", ") : v === undefined ? "" : String(v);

  return `**EMERGENCY FIRE DRILL PROMPT - CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to emergency fire drill scenarios and industry context. Every detail, procedure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to emergency fire drill scenarios and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to emergency fire drill scenarios and industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

You are an AI assistant that improves the wording and professionalism of Emergency Fire Drill report sections.

Using the following provided inputs:
- Scenario Description: ${normalize(scenarioDescription)}
- Section 1 Comments: ${normalize(section1Comments)}
- Section 3 Comments: ${normalize(section3Comments)}

**CRITICAL FORMATTING RESTRICTIONS**:
- DO NOT include specific time measurements (e.g., "5 minutes 20 seconds", "12 minutes 30 seconds")
- DO NOT include specific location names (e.g., "Emergency Exit 4", "Muster Point 2", "utility corridor")
- DO NOT include specific regulatory codes (e.g., "ISO 45001:2018", "OSHA 1910.37")
- DO NOT include specific document references (e.g., "Section 4.3.1", "Project Emergency Response Plan")
- DO NOT include specific equipment names (e.g., "colored hard hat stickers", "portable radios")
- DO NOT include specific personnel titles (e.g., "Fire Wardens", "Incident Command Post")
- DO NOT include specific timeframes (e.g., "30 days", "next week")
- DO NOT include specific measurements or distances
- DO NOT include specific incident details or scenarios
- Use ONLY generic, professional terminology

Instructions:
1. Improve the wording and professionalism of the provided content
2. Make the language more formal and appropriate for official safety documentation
3. Ensure clarity and completeness while maintaining the original meaning
4. If a field is empty, generate realistic, professional content appropriate for a fire drill report
5. Use proper safety terminology and professional language
6. Keep all content generic and non-specific

Output JSON must follow this structure exactly:
{
  "scenarioDescription": "string - improved scenario description",
  "section1Comments": "string - improved section 1 comments",
  "section3Comments": "string - improved section 3 comments"
}

Example output:
{
  "scenarioDescription": "Simulated fire emergency scenario involving smoke detection in the main electrical room. Fire alarm system automatically activated, triggering evacuation procedures across all building levels. Emergency response team coordinated evacuation while fire department was notified per protocol.",
  "section1Comments": "Evacuation procedures were executed efficiently with all personnel accounted for within acceptable timeframes. Communication systems functioned properly, and designated personnel effectively guided staff to assembly points.",
  "section3Comments": "Employee response demonstrated excellent adherence to established emergency procedures. All designated staff members performed their assigned roles competently, ensuring safe and orderly evacuation."
}

**FINAL REMINDER**: 
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- Make all content PRACTICAL and ACTIONABLE like the example provided
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
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
        inputs.approvedByOccupation,
        inputs.country,
        inputs.states
      );
    case "Job Safety Analysis":
      return getJobSafetyAnalysisPrompt(
        inputs.activityType,
        inputs.assessedBy,
        inputs.date,
        inputs.designation,
        inputs.knownHazards,
        inputs.projectName,
        inputs.country,
        inputs.states
      );
    case "Method Planning":
      return getMethodStatementPrompt(
        inputs.activityType,
        inputs.industry,
        inputs.country,
        inputs.states
      );
    case "Ptws":
      return getPermitToWorkPrompt(
        inputs.generalInstructions,
        inputs.undertakingAndAffirmation,
        inputs.generalSafetyRequirements,
        inputs.hotWorkRequirements,
        inputs.workAtHeightRequirements,
        inputs.equipmentStatutoryRequirements,
        inputs.confinedSpaceRequirements,
        inputs.energizedElectricalWorkRequirements,
        inputs.industry,
        inputs.activityType
      );
    case "Policies Procedures1":
      return getResponsePlanPrompt(
        inputs.activityType,
        inputs.projectName,
        inputs.industry,
        inputs.country,
        inputs.states
      );
    case "Policies Procedures2":
      return getPoliciesAndProceduresPrompt(
        inputs.activityType,
        inputs.projectName,
        inputs.industry,
        inputs.country,
        inputs.states
      );
    case "Toolbox Talks":
      return getToolboxTalkPrompt(
        inputs.topic,
        inputs.projectName,
        inputs.workLocation,
        inputs.industry
      );
    case "Incident Report":
      return getIncidentInvestigationReportPrompt({
        incidentCategory: inputs.category,
        description: inputs.description,
        immediateCausesUnsafeActs: inputs.immediateCausesUnsafeActs,
        immediateCausesUnsafeConditions: inputs.immediateCausesUnsafeConditions,
        rootCauses: inputs.rootCauses,
      });
    case "Emergency Fire Drill":
      return getEmergencyFireDrillPrompt(inputs);
    default:
      throw new Error(
        `No prompt function defined for subcategory: ${subcategory}`
      );
  }
}

export const getPermitToWorkPrompt = (
  generalInstructions,
  undertakingAndAffirmation,
  generalSafetyRequirements,
  hotWorkRequirements,
  workAtHeightRequirements,
  equipmentStatutoryRequirements,
  confinedSpaceRequirements,
  energizedElectricalWorkRequirements,
  industry,
  activityType
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to permit to work scenarios for the "${industry}" industry and "${activityType}" activity. Every detail, requirement, and procedure must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to permit to work scenarios and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to permit to work scenarios for the "${industry}" industry and "${activityType}" activity
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards

You are an AI assistant that generates structured JSON for a Permit to Work (PTW) document.

Using the following input:
- Industry: ${industry}
- Activity Type: ${activityType}
- General Instructions: ${generalInstructions}
- Undertaking and Affirmation: ${undertakingAndAffirmation}
- General Safety Requirements: ${generalSafetyRequirements}
- Hot Work Requirements: ${hotWorkRequirements}
- Work at Height Requirements: ${workAtHeightRequirements}
- Equipment Statutory Requirements: ${equipmentStatutoryRequirements}
- Confined Space Requirements: ${confinedSpaceRequirements}
- Energized Electrical Work Requirements: ${energizedElectricalWorkRequirements}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

The JSON must follow this structure:

{
  "generalInstructions": "string - detailed general instructions based on input",
  "undertakingAndAffirmation": "string - undertaking and affirmation details based on input",
  "generalSafetyRequirements": "string - general safety requirements based on input",
  "hotWorkRequirements": "string - hot work requirements based on input",
  "workAtHeightRequirements": "string - work at height requirements based on input",
  "equipmentStatutoryRequirements": "string - equipment statutory requirements based on input",
  "confinedSpaceRequirements": "string - confined space requirements based on input",
  "energizedElectricalWorkRequirements": "string - energized electrical work requirements based on input"
}

Guidelines:
1. Each field should contain comprehensive, detailed information based on the corresponding input parameter and tailored to the "${industry}" industry and "${activityType}" activity
2. The content should be specific, actionable, and safety-focused for the specified industry and activity
3. Use professional safety terminology appropriate for permit to work documentation in the "${industry}" industry
4. Ensure all requirements are clear and enforceable for the specified activity
5. Include relevant safety measures, procedures, and precautions for each category specific to the industry and activity

Example output:
{
  "generalInstructions": "All personnel must follow site safety protocols. Work permits must be displayed at the work location. Emergency procedures must be understood before commencing work. All tools and equipment must be inspected before use.",
  "undertakingAndAffirmation": "I understand the risks associated with this work and confirm that I have received adequate training. I will follow all safety procedures and use appropriate PPE. I will stop work immediately if unsafe conditions arise.",
  "generalSafetyRequirements": "Safety helmets, safety shoes, and high-visibility vests must be worn at all times. Work areas must be properly barricaded and warning signs posted. Emergency contact numbers must be readily available.",
  "hotWorkRequirements": "Fire watch must be maintained for 30 minutes after completion of hot work. Fire extinguishers must be available within 10 meters of the work area. Combustible materials must be removed or protected within 15 meters.",
  "workAtHeightRequirements": "Fall protection equipment must be worn when working above 2 meters. Scaffolding must be inspected daily before use. Safety harnesses must be properly fitted and anchored to approved anchor points.",
  "equipmentStatutoryRequirements": "All equipment must have current inspection certificates. Lifting equipment must be tested and certified annually. Pressure vessels must comply with relevant safety regulations.",
  "confinedSpaceRequirements": "Atmospheric testing must be conducted before entry. Ventilation must be maintained during work. Rescue equipment must be available at the entrance. Entry permit must be completed before each entry.",
  "energizedElectricalWorkRequirements": "Live work permits must be obtained for energized electrical work. Appropriate PPE including insulated gloves and tools must be used. Work must be performed by qualified electrical personnel only."
}

**FINAL REMINDER**: 
- Generate content that is SPECIFICALLY about permit to work scenarios for the "${industry}" industry and "${activityType}" activity
- DO NOT use generic template content that could apply to any permit scenario or industry
- Every field must contain information that is directly relevant to permit to work scenarios for the specified industry and activity
- Research and use actual industry-specific terminology, equipment, procedures, and regulations

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};

export const getToolboxTalkPrompt = (
  activityType,
  projectName,
  workLocation,
  industry
) => {
  return `**CRITICAL REQUIREMENT**: All generated content MUST be specifically tailored to the "${activityType}" activity type and "${industry}" industry context. Every detail, procedure, and requirement must reflect industry-specific practices, regulations, and safety protocols. Do NOT generate generic content - ensure everything is directly relevant to the specified activity type and industry context.

**STRICT CONTENT REQUIREMENTS**:
- DO NOT use generic template content
- EVERY field must contain specific information related to "${activityType}" and "${industry}" industry context
- Research and use actual industry-specific terminology, equipment, procedures, and regulations
- Include specific industry standards, permits, and compliance requirements
- Reference actual equipment, materials, and methodologies used in this industry
- Include industry-specific hazards, risk factors, and safety protocols
- Use industry-specific training requirements and competency standards
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

You are an AI assistant that generates structured JSON for a Toolbox Talk document.

Using the following input:
- Activity Type: ${activityType}
- Project Name: ${projectName}
- Work Location: ${workLocation}
- Industry: ${industry}

Generate a JSON object only. The output **must strictly follow this schema** and return **only JSON** — no explanations, no markdown formatting.
Generate a **valid, parsable JSON object only**. Follow these rules strictly:

**CRITICAL JSON VALIDATION REQUIREMENTS**:
- The output MUST be valid, parseable JSON that starts with '{' and ends with '}'
- ALL arrays must have proper opening '[' and closing ']' brackets
- ALL objects must have proper opening '{' and closing '}' braces
- ALL strings must be properly quoted with double quotes
- NO trailing commas in arrays or objects
- NO unescaped quotes within string values
- The JSON structure must be complete and syntactically correct
- Test your JSON mentally before outputting - count all opening and closing brackets/braces

**DYNAMIC CONTENT GENERATION**:
- Generate appropriate content based on the activity type and industry
- Adapt all content to be relevant to the specific activity type and industry context
- Do NOT use generic or hardcoded activity-specific terms unless they apply to the given activity type
- DO NOT include specific real-world facts, locations, names, or coordinates
- Use generic, industry-appropriate examples and terminology

The JSON must follow this structure:

{
  "project": "string - generic project name based on industry",
  "workLocation": "string - generic work location based on industry",
  "disciplines": "string - relevant disciplines for activity type and industry",
  "talkLocation": "string - generic location where toolbox talks are conducted",
  "time": "string - generic time format (HH:MM AM/PM)",
  "workActivity": "string - comprehensive and professional description of the toolbox talk content specific to activity type and industry",
  "comments": "string - professional summary of the session outcomes and participant engagement"
}

**STRICT CONTENT REQUIREMENTS**:
1. "project": Should be a generic project name appropriate for the industry
2. "workLocation": Should be a generic work location relevant to the industry and activity type
3. "disciplines": Should include relevant trades or disciplines for the activity type and industry
4. "talkLocation": Should be a generic location where toolbox talks are typically conducted in the industry
5. "time": Should be a realistic time format (e.g., "08:00 AM", "14:30 PM")
6. "workActivity": Should be a comprehensive, professional description that includes:
   - Clear explanation of the safety activity type specific to the industry
   - Key learning objectives relevant to the activity type and industry
   - Specific safety procedures and protocols for the industry
   - Equipment and PPE requirements specific to the activity type and industry
   - Risk mitigation strategies relevant to the activity type
   - Emergency procedures if applicable to the activity type
   - Use professional, technical language appropriate for the industry
7. "comments": Should be a professional summary that includes:
   - Session effectiveness and participant engagement
   - Understanding demonstrated by participants
   - Areas for improvement or additional training needs
   - Positive feedback and successful outcomes
   - Follow-up actions or recommendations
   - Use professional, objective language

**FINAL REMINDER**: 
- Include specific regulatory references with exact codes and standards
- Include specific equipment models, specifications, and requirements
- Include exact timeframes, measurements, and procedures
- Include practical implementation details with specific steps and procedures
- Make all content PRACTICAL and ACTIONABLE like the example provided
- DO NOT include specific real-world facts such as:
  - Specific street names, addresses, or locations
  - Real coordinates or GPS coordinates
  - Specific real project names or company names
  - Specific real contact numbers or phone numbers
  - Specific real dates or timeframes
  - Specific real personnel names
  - Any other real-world specific data
- Use generic, industry-appropriate terminology and examples
- Focus on procedures, equipment, and safety protocols without specific real-world details
- DO NOT include markdown formatting, bold text (**), asterisks, or special formatting
- DO NOT include parentheses with timeframes or specifications in the content text
- Write content in plain text format only
- Keep content clean and professional without formatting symbols

Output only valid JSON (must start with '{' and end with '}'). Do not include any comments, markdown, explanation, or formatting. The response must be strictly machine-readable JSON.`;
};
