import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaComments } from "react-icons/fa";

const BULLET = "\u2022";

const HEALTH_KNOWLEDGE = [
  {
    id: "fever",
    title: "fever",
    keywords: ["fever", "temperature", "high temp", "body hot"],
    overview:
      "Fever is usually a sign that the body is responding to an infection, inflammation, dehydration, or another trigger.",
    symptoms: [
      "Chills, sweating, body aches, tiredness, headache, and reduced appetite are common.",
      "Some people also feel weak, dehydrated, or unusually sleepy.",
    ],
    precautions: [
      "Rest, drink water or ORS, wear light clothing, and monitor temperature regularly.",
      "Avoid dehydration and seek care early if the person is very young, elderly, pregnant, or immunocompromised.",
    ],
    medicines: [
      "Paracetamol or acetaminophen is commonly used for fever relief when taken according to the label.",
      "Avoid self-medicating too much if there is liver disease, pregnancy, or treatment is for a child without medical guidance.",
    ],
    food: ["Choose light meals like khichdi, soups, curd rice, fruit, toast, and plenty of fluids."],
    whenToSeeDoctor: [
      "Get urgent care for fever above 103 F, fever with confusion, seizure, stiff neck, breathing trouble, severe dehydration, or if it lasts more than 2 to 3 days.",
    ],
  },
  {
    id: "cold",
    title: "common cold",
    keywords: ["cold", "runny nose", "sneezing", "stuffy nose", "blocked nose"],
    overview:
      "A common cold is usually a mild viral infection affecting the nose and throat.",
    symptoms: ["Sneezing, sore throat, runny nose, nasal blockage, mild cough, and tiredness are common."],
    precautions: [
      "Warm fluids, rest, steam, saline rinse, and good hygiene usually help.",
      "Avoid close contact with others while symptoms are strong, and wash hands often.",
    ],
    medicines: [
      "Saline nasal spray, cetirizine, and paracetamol are commonly used depending on symptoms.",
      "Avoid taking multiple combination cold medicines at the same time unless you understand the ingredients.",
    ],
    food: ["Warm soups, tea, honey if appropriate, soft foods, and enough fluids can feel soothing."],
    whenToSeeDoctor: [
      "See a doctor if symptoms last more than 10 days, worsen suddenly, or include chest pain, high fever, or breathing trouble.",
    ],
  },
  {
    id: "cough",
    title: "cough",
    keywords: ["cough", "dry cough", "wet cough", "phlegm"],
    overview:
      "Cough may happen because of viral infection, allergy, asthma, reflux, smoke exposure, or throat irritation.",
    symptoms: ["Dry cough may feel irritating, while wet cough can bring mucus or heaviness in the chest."],
    precautions: [
      "Stay hydrated, avoid smoke and dust, and rest your throat.",
      "Steam may help some people, especially with mucus or throat irritation.",
    ],
    medicines: ["The right medicine depends on the cause, so avoid random antibiotics or steroid syrups without proper advice."],
    food: ["Warm water, soup, and soft foods may be easier than fried or very spicy food."],
    whenToSeeDoctor: [
      "Please get checked if cough lasts more than 2 weeks, causes wheezing, includes blood, chest pain, or breathing difficulty.",
    ],
  },
  {
    id: "diabetes",
    title: "diabetes",
    keywords: ["diabetes", "high sugar", "blood sugar", "glucose"],
    overview:
      "Diabetes is a long-term condition where blood sugar remains higher than normal over time.",
    symptoms: [
      "Common symptoms include increased thirst, frequent urination, tiredness, blurred vision, slow wound healing, and unexplained weight changes.",
    ],
    precautions: [
      "Track blood sugar if prescribed, keep meals balanced, stay active, sleep well, and do not skip follow-up appointments.",
    ],
    medicines: [
      "Medicines such as metformin or insulin are often used, but the right plan depends on age, test results, kidney function, and other conditions.",
    ],
    food: [
      "Focus on fiber-rich vegetables, pulses, lean protein, curd, nuts, and controlled portions of rice, roti, or other carbohydrates.",
      "Reduce sugary drinks, sweets, and frequent snacking on refined food.",
    ],
    whenToSeeDoctor: [
      "Seek medical help quickly if blood sugar is repeatedly very high or low, or if there is vomiting, confusion, severe weakness, or dehydration.",
    ],
  },
  {
    id: "hypertension",
    title: "high blood pressure",
    keywords: ["bp", "blood pressure", "hypertension", "high pressure"],
    overview:
      "High blood pressure often has no clear symptoms, which is why regular monitoring is important.",
    symptoms: ["Many people feel normal, but some may have headache, dizziness, or fatigue."],
    precautions: [
      "Limit excess salt, reduce processed food, exercise regularly, maintain a healthy weight, and avoid smoking.",
      "Stress management and regular BP checks are part of long-term control.",
    ],
    medicines: [
      "Common medicines include amlodipine, telmisartan, losartan, and others, but treatment should be individualized by a doctor.",
    ],
    food: ["Choose fruits, vegetables, oats, dal, curd, nuts, and less packaged salty food."],
    whenToSeeDoctor: [
      "Get urgent care if high BP comes with chest pain, severe headache, weakness on one side, or trouble breathing.",
    ],
  },
  {
    id: "headache",
    title: "headache",
    keywords: ["headache", "migraine", "head pain"],
    overview:
      "Headache can happen from stress, migraine, dehydration, poor sleep, vision strain, sinus issues, infection, or blood pressure problems.",
    symptoms: [
      "Some headaches are dull and mild, while migraines may cause throbbing pain, light sensitivity, nausea, or vomiting.",
    ],
    precautions: ["Hydration, regular meals, less screen strain, stress control, and enough sleep often help."],
    medicines: [
      "Paracetamol may help some mild headaches, but frequent headaches should be assessed instead of repeatedly self-medicating.",
    ],
    food: ["Do not skip meals, and keep hydration steady through the day."],
    whenToSeeDoctor: [
      "Seek urgent help for sudden severe headache, confusion, weakness, high fever, fainting, or changes in vision or speech.",
    ],
  },
  {
    id: "acidity",
    title: "acidity or reflux",
    keywords: ["acidity", "gas", "heartburn", "reflux", "indigestion"],
    overview:
      "Acidity or reflux usually causes a burning feeling in the chest or upper stomach after meals.",
    symptoms: ["Bloating, burping, sour taste in the mouth, nausea, and upper stomach discomfort are common."],
    precautions: [
      "Eat smaller meals, avoid lying down right after food, reduce oily and spicy meals, and avoid heavy late-night eating.",
    ],
    medicines: ["Antacids may provide short-term relief, but frequent symptoms need medical review."],
    food: ["Lighter meals such as banana, oats, curd, rice, toast, and simple home-cooked food may help."],
    whenToSeeDoctor: [
      "See a doctor if there is repeated vomiting, weight loss, black stool, trouble swallowing, or frequent symptoms despite precautions.",
    ],
  },
  {
    id: "asthma",
    title: "asthma",
    keywords: ["asthma", "wheezing", "breath tight", "chest tightness"],
    overview:
      "Asthma is a breathing condition where the airways become inflamed and narrow.",
    symptoms: ["Wheezing, cough, chest tightness, and shortness of breath are common symptoms."],
    precautions: [
      "Avoid smoke, dust, pollution, strong fragrances, and other known triggers.",
      "Use inhalers correctly and keep rescue medication available if prescribed.",
    ],
    medicines: ["Rescue inhalers and controller inhalers are commonly used, but dose and technique should be checked by a clinician."],
    food: ["A balanced diet and weight control can support overall breathing health, though food is usually not the main treatment."],
    whenToSeeDoctor: [
      "Get urgent help if someone cannot speak properly, lips look blue, or breathing is worsening fast.",
    ],
  },
  {
    id: "sore_throat",
    title: "sore throat",
    keywords: ["sore throat", "throat pain", "painful swallowing"],
    overview:
      "Sore throat can happen with viral infection, tonsillitis, allergy, acid reflux, dry air, or irritation from smoke.",
    symptoms: [
      "Pain while swallowing, scratchiness, fever, swollen glands, hoarse voice, or cough can occur.",
    ],
    precautions: [
      "Warm fluids, salt-water gargles, rest, hydration, and avoiding smoke may help.",
      "If symptoms are severe or recurring, medical assessment is more reliable than repeated self-treatment.",
    ],
    medicines: [
      "Simple pain relief may help some people, but antibiotics are only useful for specific bacterial causes.",
    ],
    food: ["Soft warm foods and fluids are often easier to tolerate than spicy, acidic, or fried food."],
    whenToSeeDoctor: [
      "Please seek care for trouble swallowing, drooling, high fever, breathing difficulty, or symptoms lasting beyond several days.",
    ],
  },
  {
    id: "diarrhea",
    title: "diarrhea",
    keywords: ["diarrhea", "loose motion", "loose motions", "watery stool"],
    overview:
      "Diarrhea is often caused by infection, food intolerance, medication side effects, or digestive conditions.",
    symptoms: [
      "Loose stool, stomach cramps, urgency, weakness, dehydration, nausea, or mild fever are common.",
    ],
    precautions: [
      "The main priority is fluids, ORS, rest, and light food.",
      "Avoid dehydration, especially in children, older adults, and pregnant people.",
    ],
    medicines: [
      "Medicine depends on the cause, so repeated antibiotic use without evaluation is not reliable or safe.",
    ],
    food: ["ORS, rice, banana, toast, curd, soup, and simple meals are often better tolerated."],
    whenToSeeDoctor: [
      "Get checked urgently for blood in stool, severe dehydration, high fever, strong abdominal pain, or diarrhea lasting more than a few days.",
    ],
  },
  {
    id: "nausea_vomiting",
    title: "nausea or vomiting",
    keywords: ["nausea", "vomiting", "vomit", "feeling sick"],
    overview:
      "Nausea and vomiting can result from infection, acidity, migraine, food poisoning, pregnancy, medicines, or dehydration.",
    symptoms: [
      "Some people also feel weakness, dizziness, stomach discomfort, poor appetite, or dehydration.",
    ],
    precautions: [
      "Sip fluids slowly, rest, avoid heavy oily meals, and watch urine output and dizziness.",
    ],
    medicines: [
      "Anti-nausea medicines can help in some cases, but persistent vomiting needs medical review to find the cause.",
    ],
    food: ["Small sips of water or ORS, toast, rice, banana, and bland foods are often easier to tolerate."],
    whenToSeeDoctor: [
      "Seek care for repeated vomiting, inability to keep fluids down, blood in vomit, severe pain, confusion, or dehydration.",
    ],
  },
  {
    id: "rash",
    title: "rash or skin eruption",
    keywords: ["rash", "red spots", "skin rash", "itchy rash"],
    overview:
      "A rash may be due to allergy, infection, heat, irritation, eczema, medicine reaction, or immune conditions.",
    symptoms: [
      "Itching, redness, bumps, scaling, burning, swelling, or spreading skin changes may occur.",
    ],
    precautions: [
      "Avoid scratching, harsh soaps, and unprescribed steroid creams until the cause is clearer.",
    ],
    medicines: [
      "The right treatment depends on whether the cause is allergic, infectious, or inflammatory.",
    ],
    food: ["Food is only relevant when a true allergy trigger is suspected."],
    whenToSeeDoctor: [
      "Please seek urgent care if the rash comes with breathing trouble, facial swelling, fever, blistering, or rapid spread.",
    ],
  },
  {
    id: "anemia",
    title: "anemia or low hemoglobin",
    keywords: ["anemia", "anaemia", "low hemoglobin", "low haemoglobin"],
    overview:
      "Anemia means the body has reduced oxygen-carrying capacity, often due to iron deficiency, blood loss, vitamin deficiency, or chronic disease.",
    symptoms: [
      "Common symptoms include fatigue, weakness, dizziness, pale skin, shortness of breath on exertion, and palpitations.",
    ],
    precautions: [
      "Persistent weakness should be investigated rather than ignored, especially if there are heavy periods, poor diet, or chronic illness.",
    ],
    medicines: [
      "Iron, folate, vitamin B12, or other treatment may be used, but only after identifying the likely cause.",
    ],
    food: [
      "Iron-rich foods include leafy greens, beans, lentils, meat, eggs, jaggery in moderation, and vitamin C-rich foods to support iron absorption.",
    ],
    whenToSeeDoctor: [
      "Please get checked if weakness is significant, there is breathlessness, chest discomfort, fainting, or ongoing blood loss.",
    ],
  },
];

const BODY_SYSTEMS = [
  {
    label: "stomach or digestion",
    keywords: ["stomach", "digestion", "digestion problem", "constipation", "diarrhea", "vomiting", "nausea"],
    insights: [
      "Digestive complaints can come from infection, acidity, food intolerance, dehydration, constipation, or stress.",
      "Meaningful first steps are hydration, light food, avoiding very oily or spicy meals, and watching for red flags like blood, severe pain, or persistent vomiting.",
    ],
  },
  {
    label: "skin health",
    keywords: ["skin", "rash", "itching", "pimples", "acne", "allergy"],
    insights: [
      "Skin issues are often linked with allergy, irritation, infection, hormones, stress, or hygiene habits.",
      "It helps to avoid harsh products, scratching, and self-use of steroid creams unless prescribed.",
    ],
  },
  {
    label: "sleep health",
    keywords: ["sleep", "insomnia", "can't sleep", "cant sleep", "poor sleep"],
    insights: [
      "Poor sleep can affect immunity, mood, blood sugar, appetite, and concentration.",
      "A consistent sleep schedule, lower caffeine late in the day, less screen exposure before bed, and a calm night routine are often useful.",
    ],
  },
  {
    label: "mental wellness",
    keywords: ["stress", "anxiety", "mental health", "depression", "overthinking"],
    insights: [
      "Stress and anxiety can also show up physically through headache, palpitations, stomach discomfort, fatigue, and poor sleep.",
      "Short breathing exercises, routine, movement, sunlight, and speaking to a trusted person or clinician can help.",
    ],
  },
  {
    label: "heart health",
    keywords: ["heart", "palpitations", "cholesterol", "cardiac"],
    insights: [
      "Heart health is strongly influenced by blood pressure, cholesterol, diabetes, smoking, sleep, stress, and physical activity.",
      "Useful prevention steps include regular movement, weight control, less trans fat and excess salt, and timely checkups for BP, sugar, and lipid levels.",
    ],
  },
  {
    label: "joint and bone health",
    keywords: ["joint", "knee", "back pain", "bone", "arthritis", "neck pain"],
    insights: [
      "Joint and bone complaints can be related to posture, strain, injury, inflammation, arthritis, weak muscles, or low vitamin D.",
      "Movement, stretching, posture correction, strength work, and weight management often matter as much as short-term pain relief.",
    ],
  },
  {
    label: "kidney and urinary health",
    keywords: ["kidney", "urine", "urinary", "uti", "burning urine", "frequent urine"],
    insights: [
      "Urinary symptoms can happen with dehydration, infection, stones, uncontrolled diabetes, or prostate and bladder issues.",
      "Hydration helps many mild cases, but fever, back pain, blood in urine, or persistent burning should be medically checked.",
    ],
  },
  {
    label: "immunity and recovery",
    keywords: ["immunity", "immune", "weakness", "recovery", "fatigue", "tired"],
    insights: [
      "Low energy and poor recovery can be linked with poor sleep, stress, anemia, thyroid problems, low calorie intake, infection, or vitamin deficiency.",
      "Balanced meals, hydration, sleep, and checking for underlying causes are often more useful than random supplements alone.",
    ],
  },
];

const LIFESTYLE_GUIDES = {
  diet: [
    "Build meals around vegetables, protein, fiber, and moderate portions of carbohydrates.",
    "Useful staples include dal, beans, eggs, paneer, fish, curd, oats, fruit, nuts, and seasonal vegetables.",
    "Try to reduce sugary drinks, deep-fried foods, and heavily processed snacks.",
  ],
  routine: [
    "A steady routine includes waking at a regular time, morning light exposure, daily movement, balanced meals, and a fixed bedtime.",
    "Aim for 7 to 9 hours of sleep, enough water, and fewer long periods of continuous sitting.",
    "For stress control, try breathing exercises, stretching, journaling, meditation, or prayer for 10 minutes a day.",
  ],
  exercise: [
    "Aim for about 150 minutes of moderate exercise weekly unless a clinician has advised restrictions.",
    "Walking, cycling, yoga, stretching, and simple strength work are practical options for many people.",
    "Start slowly if you are inactive, and stop if you develop chest pain, severe dizziness, or marked breathlessness.",
  ],
  hydration: [
    "Drink water steadily through the day rather than waiting until you feel very thirsty.",
    "Needs vary by heat, activity, fever, diarrhea, and kidney or heart conditions.",
  ],
};

const RED_FLAG_KEYWORDS = [
  "chest pain",
  "trouble breathing",
  "difficulty breathing",
  "shortness of breath",
  "stroke",
  "fainting",
  "seizure",
  "unconscious",
  "blood vomiting",
  "vomiting blood",
  "suicidal",
  "severe bleeding",
  "one side weakness",
  "blue lips",
  "cannot breathe",
  "cant breathe",
  "passed out",
  "loss of consciousness",
];

const ABUSIVE_LANGUAGE_PATTERNS = [
  "fuck",
  "fuk",
  "shit",
  "bitch",
  "bastard",
  "asshole",
  "idiot",
  "stupid",
  "dumbass",
  "motherfucker",
  "choot",
  "chut",
  "mf",
  "bs",
  "madarchod",
  "madharchod",
  "bhenchod",
  "behenchod",
  "chutiya",
  "gandu",
  "harami",
  "lund",
  "chutiya",
  "kutta",
  "randi",
];

const QUICK_ACTIONS = [
  "Symptoms of fever",
  "Diet for diabetes",
  "Healthy routine",
  "Medicine safety",
  "Sleep tips",
  "What causes weakness",
];

const TOPIC_MEDICINE_LIBRARY = {
  fever: ["Paracetamol", "Acetaminophen"],
  cold: ["Paracetamol", "Cetirizine", "Saline nasal spray"],
  cough: ["Cough syrup may be used depending on dry or wet cough", "Steam inhalation support"],
  diabetes: ["Metformin", "Insulin"],
  hypertension: ["Amlodipine", "Telmisartan", "Losartan"],
  headache: ["Paracetamol", "Acetaminophen"],
  acidity: ["Antacids", "Pantoprazole"],
  asthma: ["Salbutamol inhaler", "Controller inhalers"],
  sore_throat: ["Paracetamol", "Simple pain relief tablets"],
  diarrhea: ["ORS", "Zinc in some cases"],
  nausea_vomiting: ["ORS", "Anti-nausea medicines may be advised by a doctor"],
  rash: ["Antihistamines", "Doctor-advised skin creams"],
  anemia: ["Iron tablets", "Folate", "Vitamin B12"],
};

const GREETING_ACTIONS = ["How are you", "Good morning", "Good night", "Need health help"];

const QUESTION_PATTERNS = {
  symptoms: ["symptom", "symptoms", "sign", "signs"],
  causes: ["cause", "causes", "reason", "why"],
  precautions: ["precaution", "precautions", "avoid", "care", "prevention", "prevent"],
  medicines: ["medicine", "medicines", "tablet", "drug", "treatment", "remedy"],
  food: ["food", "diet", "eat", "meal", "nutrition"],
  tests: ["test", "tests", "diagnosis", "scan", "blood test", "checkup"],
  routine: ["routine", "lifestyle", "habit", "daily plan", "sleep", "exercise", "fitness", "walk"],
};

const HEALTH_SIGNAL_WORDS = [
  ...HEALTH_KNOWLEDGE.flatMap((topic) => topic.keywords),
  ...BODY_SYSTEMS.flatMap((system) => system.keywords),
  ...Object.values(QUESTION_PATTERNS).flat(),
  "pain",
  "fever",
  "cough",
  "doctor",
  "medicine",
  "symptom",
  "disease",
  "hospital",
  "infection",
  "allergy",
  "health",
  "wellness",
  "diet",
  "exercise",
  "sleep",
  "body",
];

const createBotMessage = (text, suggestions = []) => ({
  sender: "bot",
  text,
  suggestions,
});

const normalizeText = (message) =>
  message
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[1!|]/g, "i")
    .replace(/[3]/g, "e")
    .replace(/[0]/g, "o")
    .replace(/[5$]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const containsAbusiveLanguage = (message) => {
  const normalized = ` ${normalizeText(message)} `;

  return ABUSIVE_LANGUAGE_PATTERNS.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    return normalized.includes(` ${normalizedKeyword} `) || normalized.includes(normalizedKeyword);
  });
};

const isGreetingMessage = (message) =>
  includesAny(message, [
    "good morning",
    "good afternoon",
    "good evening",
    "good night",
    "morning",
    "afternoon",
    "evening",
    "night",
    "hello",
    "hi",
    "hey",
  ]);

const isGeneralConversation = (message) =>
  includesAny(message, [
    "how are you",
    "who are you",
    "thank you",
    "thanks",
    "ok",
    "okay",
    "nice",
    "bye",
    "goodbye",
    "see you",
    "what can you do",
  ]);

const hasHealthIntent = (message) => includesAny(message, HEALTH_SIGNAL_WORDS);

const formatBullets = (items) => items.map((item) => `${BULLET} ${item}`).join("\n");

const includesAny = (message, items) => items.some((item) => message.includes(item));

const findTopic = (message) =>
  HEALTH_KNOWLEDGE.find((topic) => topic.keywords.some((keyword) => message.includes(keyword)));

const findBodySystem = (message) =>
  BODY_SYSTEMS.find((system) => system.keywords.some((keyword) => message.includes(keyword)));

const detectQuestionFocus = (message) => {
  const active = Object.entries(QUESTION_PATTERNS)
    .filter(([, patterns]) => includesAny(message, patterns))
    .map(([key]) => key);

  if (active.length > 0) {
    return active;
  }

  return ["overview", "symptoms", "causes", "precautions", "medicines", "food"];
};

const buildTopicSections = (topic, focus) => {
  const sections = [`Here are some useful insights about ${topic.title}:`, "", `${BULLET} ${topic.overview}`];

  if (focus.includes("symptoms") && topic.symptoms?.length) {
    sections.push("", "Common symptoms:");
    sections.push(formatBullets(topic.symptoms));
  }

  if (focus.includes("causes")) {
    sections.push("", "Possible reasons:");
    sections.push(
      `${BULLET} The exact cause depends on history, severity, age, and associated symptoms, so a clinical evaluation may still be needed.`,
    );
  }

  if (focus.includes("precautions") && topic.precautions?.length) {
    sections.push("", "Precautions and care:");
    sections.push(formatBullets(topic.precautions));
  }

  if (focus.includes("medicines") && topic.medicines?.length) {
    const medicineNames = TOPIC_MEDICINE_LIBRARY[topic.id] || [];

    sections.push("", "Common medicine names:");
    if (medicineNames.length) {
      sections.push(formatBullets(medicineNames));
    } else {
      sections.push(`${BULLET} Medicine choice depends on the exact cause and severity.`);
    }

    sections.push("", "Medicine guidance:");
    sections.push(formatBullets(topic.medicines));
    sections.push(
      "",
      "Consultation note:",
      `${BULLET} Please consult a doctor or pharmacist before taking these medicines, especially for children, pregnancy, allergies, kidney or liver disease, or if you already take other medicines.`,
    );
  }

  if (focus.includes("food") && topic.food?.length) {
    sections.push("", "Food and lifestyle support:");
    sections.push(formatBullets(topic.food));
  }

  if (topic.whenToSeeDoctor?.length) {
    sections.push("", "When to seek medical care:");
    sections.push(formatBullets(topic.whenToSeeDoctor));
  }

  if (focus.includes("tests")) {
    sections.push("", "Medical evaluation may include:");
    sections.push(
      `${BULLET} A doctor may suggest examination, history taking, and tests based on symptoms rather than one fixed test for everyone.`,
    );
  }

  sections.push("", `${BULLET} This is general health education, not a diagnosis or prescription.`);
  return sections.join("\n");
};

const buildGeneralInsight = (label, insights) =>
  `${label}\n\n${formatBullets(insights)}\n\n${BULLET} If symptoms are severe, persistent, or unusual, a clinician should evaluate them.`;

const extractHealthSubject = (message) => {
  const cleaned = message
    .toLowerCase()
    .replace(/[?.,!]/g, " ")
    .replace(
      /\b(what|is|are|the|symptoms|signs|of|for|how|to|prevent|precautions|medicine|medicines|diet|food|cause|causes|reason|reasons|treatment|about|tell|me|give|advice|tips|healthy|health|related)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "";
  }

  return cleaned.split(" ").slice(0, 4).join(" ");
};

const buildUnknownTopicInsight = (subject, focus) => {
  const sections = [
    `Here are some general health insights about ${subject}:`,
    "",
    `${BULLET} I do not have a dedicated condition card for ${subject}, but I can still give safe general guidance.`,
  ];

  if (focus.includes("symptoms")) {
    sections.push("", "How to think about symptoms:");
    sections.push(
      formatBullets([
        "Note what symptoms are present, when they started, how severe they are, and what makes them better or worse.",
        "Associated symptoms like fever, weight loss, vomiting, swelling, rash, breathlessness, or pain can change how urgent the condition is.",
      ]),
    );
  }

  if (focus.includes("causes")) {
    sections.push("", "Possible causes:");
    sections.push(
      formatBullets([
        "Health complaints are often linked with infection, inflammation, allergy, stress, dehydration, nutrition gaps, hormonal changes, medication side effects, or chronic disease.",
        "Age, medical history, and the duration of symptoms matter when narrowing the cause.",
      ]),
    );
  }

  if (focus.includes("precautions")) {
    sections.push("", "Safe first precautions:");
    sections.push(
      formatBullets([
        "Rest, hydration, simple food, avoiding smoking or alcohol, and not overusing medicines are usually reasonable first steps.",
        "Track warning signs such as worsening pain, breathing difficulty, fainting, bleeding, confusion, or persistent symptoms.",
      ]),
    );
  }

  if (focus.includes("food")) {
    sections.push("", "Food and recovery support:");
    sections.push(
      formatBullets([
        "Balanced meals with vegetables, protein, fruit, and adequate fluids usually support recovery better than restrictive fad diets.",
        "If symptoms involve vomiting, diarrhea, acidity, or poor appetite, lighter meals may be easier to tolerate.",
      ]),
    );
  }

  if (focus.includes("medicines")) {
    sections.push("", "Medicine guidance:");
    sections.push(
      formatBullets([
        "The right medicine depends on the diagnosis, age, allergies, pregnancy status, kidney and liver health, and current prescriptions.",
        "Avoid antibiotics, steroids, or painkillers in repeated doses unless medically advised.",
      ]),
    );
  }

  if (focus.includes("tests")) {
    sections.push("", "Medical evaluation may include:");
    sections.push(
      formatBullets([
        "A clinician may use history, physical examination, blood tests, urine tests, imaging, or monitoring depending on the pattern of symptoms.",
        "One symptom can have many causes, so testing should be guided by a doctor rather than guessed.",
      ]),
    );
  }

  sections.push("", "When to get checked:");
  sections.push(
    formatBullets([
      "Please see a doctor if symptoms are severe, keep returning, last longer than expected, or interfere with daily life.",
      "Get urgent care for chest pain, trouble breathing, severe dehydration, blood loss, confusion, fainting, or one-sided weakness.",
    ]),
  );

  return sections.join("\n");
};

const getEmergencyReply = () =>
  "Your message includes symptoms that can be serious.\n\n" +
  `${BULLET} Please contact emergency care or go to the nearest hospital now.\n` +
  `${BULLET} Do not rely only on chatbot advice for chest pain, breathing trouble, seizure, fainting, stroke-like signs, or severe bleeding.\n` +
  `${BULLET} If possible, have someone stay with you and carry your current medicines and reports.`;

const getMedicineSafetyReply = () =>
  "Medicine safety guidance:\n\n" +
  `${BULLET} I can share general information about common medicines, but I should not prescribe treatment.\n` +
  `${BULLET} The right medicine depends on age, allergies, pregnancy, kidney or liver disease, and ongoing medicines.\n` +
  `${BULLET} If you tell me the symptom or health condition, I can explain common medicine categories, precautions, and when a doctor is needed.`;

const getRespectfulLanguageReply = () =>
  "I can help with health questions, but I cannot continue with abusive or offensive language.\n\n" +
  `${BULLET} Please ask your health question in a respectful way.\n` +
  `${BULLET} If you share the symptom, condition, duration, and severity, I will give a safer and more useful answer.`;

const getReliabilityReply = () =>
  "To keep the answer more reliable, please include a little detail when possible:\n\n" +
  `${BULLET} age group: child, adult, or older adult\n` +
  `${BULLET} main symptom or condition\n` +
  `${BULLET} how long it has been going on\n` +
  `${BULLET} how severe it is and whether there is fever, pain, vomiting, breathlessness, or weakness\n\n` +
  `${BULLET} I can then give more accurate general guidance, but I still do not replace a doctor or emergency care.`;

const getLifestyleReply = (label, items) =>
  `${label}\n\n${formatBullets(items)}\n\n${BULLET} If you already have a medical condition, personalize diet and exercise with your doctor.`;

const getWelcomeReply = () =>
  "Hello. I am your HealthNexus health assistant.\n\n" +
  "You can ask about diseases, symptoms, precautions, medicine basics, food suggestions, recovery habits, sleep, exercise, and daily wellness routines.\n\n" +
  `${BULLET} For emergencies like chest pain or breathing trouble, seek urgent medical care immediately.`;

const getGreetingReply = (message) => {
  if (message.includes("good morning") || message === "morning") {
    return createBotMessage(
      "Good morning. I am glad you are here.\n\nHow can I support you today? You can ask me anything about health, symptoms, food, medicines, or daily wellness.",
      GREETING_ACTIONS,
    );
  }

  if (message.includes("good afternoon") || message === "afternoon") {
    return createBotMessage(
      "Good afternoon. I hope your day is going smoothly.\n\nIf you need help, I can guide you with health questions, symptoms, precautions, or healthy routines.",
      GREETING_ACTIONS,
    );
  }

  if (message.includes("good evening") || message === "evening") {
    return createBotMessage(
      "Good evening. I am happy to help.\n\nYou can ask me about any health concern, medicines, food choices, or wellness habits.",
      GREETING_ACTIONS,
    );
  }

  if (message.includes("good night") || message === "night") {
    return createBotMessage(
      "Good night. I am here for you before you rest.\n\nIf something is worrying you about your health, feel free to ask and I will do my best to guide you safely.",
      GREETING_ACTIONS,
    );
  }

  return createBotMessage(
    "Hello. It is nice to hear from you.\n\nYou can chat normally with me, and whenever you need health guidance I can help with symptoms, conditions, food, medicines, and wellness tips.",
    GREETING_ACTIONS,
  );
};

const getGeneralConversationReply = (message) => {
  if (includesAny(message, ["how are you"])) {
    return createBotMessage(
      "I am doing well, and I am ready to help you.\n\nIf you want, you can ask me a health question or just tell me what is bothering you.",
      GREETING_ACTIONS,
    );
  }

  if (includesAny(message, ["thank you", "thanks"])) {
    return createBotMessage(
      "You are always welcome.\n\nIf you have another health question or just want a simple wellness tip, I am here.",
      GREETING_ACTIONS,
    );
  }

  if (includesAny(message, ["bye", "goodbye", "see you"])) {
    return createBotMessage(
      "Take care of yourself.\n\nCome back anytime if you need help with a health question or wellness advice.",
      GREETING_ACTIONS,
    );
  }

  if (includesAny(message, ["who are you", "what can you do"])) {
    return createBotMessage(
      "I am your HealthNexus assistant.\n\nI can answer health-related questions about symptoms, common conditions, precautions, food, routines, medicine basics, and when to seek medical care.",
      QUICK_ACTIONS,
    );
  }

  return createBotMessage(
    "I can chat with you normally, and I am especially helpful for health-related questions.\n\nIf you want health guidance, tell me the symptom, condition, or goal you want help with.",
    GREETING_ACTIONS,
  );
};

const getContextualMedicineReply = (subjectLabel, medicineNames = []) => {
  const sections = [`Medicine support for ${subjectLabel}`];

  if (medicineNames.length) {
    sections.push("", "Common medicine names:");
    sections.push(formatBullets(medicineNames));
  }

  sections.push(
    "",
    "Safety note:",
    `${BULLET} I can share commonly used medicine names for general awareness, but I am not prescribing a personal treatment plan.`,
    `${BULLET} The right medicine and dose depend on age, allergies, pregnancy, kidney or liver problems, severity, and current medicines.`,
    `${BULLET} Please consult a doctor before starting any medicine, especially antibiotics, steroids, inhalers, or repeated painkillers.`,
    "",
    `${BULLET} If you want, I can also explain home care, food support, precautions, and warning signs for ${subjectLabel}.`,
  );

  return sections.join("\n");
};

const getFollowUpPromptReply = (subjectLabel) =>
  `I can continue from your earlier question about ${subjectLabel}.\n\n` +
  `${BULLET} Ask things like symptoms, causes, precautions, medicines, food, tests, or recovery tips.\n` +
  `${BULLET} You can also tell me age group, duration, and severity if you want a more meaningful general answer.`;

const isFollowUpHealthMessage = (message) =>
  includesAny(message, [
    "what should i do",
    "what to do",
    "what can i do",
    "what medicine",
    "which medicine",
    "prescribe",
    "medication",
    "medicine",
    "medicines",
    "tablet",
    "drug",
    "treatment",
    "remedy",
    "diet",
    "food",
    "eat",
    "avoid",
    "precaution",
    "precautions",
    "cause",
    "causes",
    "why",
    "test",
    "tests",
    "routine",
    "recovery",
    "is it serious",
  ]);

const getMedicalResponse = (rawInput, context = {}) => {
  const message = rawInput.toLowerCase().trim();
  const nextContext = {
    topic: null,
    bodySystem: null,
    subject: "",
    healthActive: false,
  };

  if (containsAbusiveLanguage(message)) {
    return { reply: createBotMessage(getRespectfulLanguageReply()), context: nextContext };
  }

  if (RED_FLAG_KEYWORDS.some((keyword) => message.includes(keyword))) {
    nextContext.healthActive = true;
    return { reply: createBotMessage(getEmergencyReply()), context: nextContext };
  }

  if (isGreetingMessage(message)) {
    return { reply: getGreetingReply(message), context: nextContext };
  }

  if (includesAny(message, ["help"])) {
    return { reply: createBotMessage(getWelcomeReply(), QUICK_ACTIONS), context: nextContext };
  }

  if (!hasHealthIntent(message) && isGeneralConversation(message)) {
    return { reply: getGeneralConversationReply(message), context: nextContext };
  }

  if (includesAny(message, ["accurate", "reliable", "not sure", "unclear", "confused"])) {
    return { reply: createBotMessage(getReliabilityReply(), QUICK_ACTIONS), context: nextContext };
  }

  const topic = findTopic(message);
  const focus = detectQuestionFocus(message);
  const followUpHealth = isFollowUpHealthMessage(message);
  const activeTopic = topic || context.topic || null;
  const activeBodySystem = !topic ? findBodySystem(message) || context.bodySystem || null : null;
  const extractedSubject = extractHealthSubject(message);
  const activeSubject =
    extractedSubject ||
    activeTopic?.title ||
    activeBodySystem?.label ||
    context.subject ||
    "";

  if (topic) {
    nextContext.topic = topic;
    nextContext.subject = topic.title;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(buildTopicSections(topic, focus), QUICK_ACTIONS),
      context: nextContext,
    };
  }

  const bodySystem = findBodySystem(message);
  if (bodySystem) {
    nextContext.bodySystem = bodySystem;
    nextContext.subject = bodySystem.label;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        buildGeneralInsight(`Here are some insights about ${bodySystem.label}:`, bodySystem.insights),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (activeTopic && includesAny(message, QUESTION_PATTERNS.medicines)) {
    nextContext.topic = activeTopic;
    nextContext.subject = activeTopic.title;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        getContextualMedicineReply(activeTopic.title, TOPIC_MEDICINE_LIBRARY[activeTopic.id] || []),
        [
        "Home care tips",
        "When to see doctor",
        "Food to take",
        "Common symptoms",
        ],
      ),
      context: nextContext,
    };
  }

  if (activeTopic && followUpHealth) {
    nextContext.topic = activeTopic;
    nextContext.subject = activeTopic.title;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(buildTopicSections(activeTopic, focus), QUICK_ACTIONS),
      context: nextContext,
    };
  }

  if (activeBodySystem && followUpHealth) {
    nextContext.bodySystem = activeBodySystem;
    nextContext.subject = activeBodySystem.label;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        buildGeneralInsight(`Continuing with ${activeBodySystem.label}:`, activeBodySystem.insights),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (includesAny(message, QUESTION_PATTERNS.medicines)) {
    if (activeSubject) {
      nextContext.subject = activeSubject;
      nextContext.healthActive = true;
      return {
        reply: createBotMessage(getContextualMedicineReply(activeSubject), [
          "Precautions",
          "Food guidance",
          "Warning signs",
          "Recovery tips",
        ]),
        context: nextContext,
      };
    }

    return {
      reply: createBotMessage(getMedicineSafetyReply(), QUICK_ACTIONS),
      context: nextContext,
    };
  }

  if (includesAny(message, ["food", "diet", "eat", "meal", "nutrition", "weight loss"])) {
    nextContext.subject = activeSubject || "healthy eating";
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(getLifestyleReply("Healthy food guidance:", LIFESTYLE_GUIDES.diet), QUICK_ACTIONS),
      context: nextContext,
    };
  }

  if (includesAny(message, ["routine", "lifestyle", "habit", "sleep", "stress"])) {
    nextContext.subject = activeSubject || "healthy routine";
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        getLifestyleReply("Healthy daily routine suggestions:", LIFESTYLE_GUIDES.routine),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (includesAny(message, ["exercise", "workout", "fitness", "walk", "gym"])) {
    nextContext.subject = activeSubject || "exercise";
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        getLifestyleReply("General movement and exercise guidance:", LIFESTYLE_GUIDES.exercise),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (includesAny(message, ["water", "hydration", "dehydration"])) {
    nextContext.subject = activeSubject || "hydration";
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        getLifestyleReply("Hydration guidance:", LIFESTYLE_GUIDES.hydration),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (includesAny(message, ["healthy", "health", "wellness", "immunity", "prevention"])) {
    const combinedGuidance = [
      ...LIFESTYLE_GUIDES.diet.slice(0, 2),
      ...LIFESTYLE_GUIDES.routine.slice(0, 2),
      ...LIFESTYLE_GUIDES.exercise.slice(0, 1),
    ];

    nextContext.subject = activeSubject || "general wellness";
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(
        getLifestyleReply("General healthy lifestyle insights:", combinedGuidance),
        QUICK_ACTIONS,
      ),
      context: nextContext,
    };
  }

  if (extractedSubject && hasHealthIntent(message)) {
    nextContext.subject = extractedSubject;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(buildUnknownTopicInsight(extractedSubject, focus), QUICK_ACTIONS),
      context: nextContext,
    };
  }

  if (context.healthActive && followUpHealth && activeSubject) {
    nextContext.topic = context.topic || null;
    nextContext.bodySystem = context.bodySystem || null;
    nextContext.subject = activeSubject;
    nextContext.healthActive = true;
    return {
      reply: createBotMessage(getFollowUpPromptReply(activeSubject), [
        "Symptoms",
        "Precautions",
        "Medicines",
        "Food guidance",
      ]),
      context: nextContext,
    };
  }

  return { reply: getGeneralConversationReply(message), context: nextContext };
};

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([createBotMessage(getWelcomeReply(), QUICK_ACTIONS)]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatContext, setChatContext] = useState({
    topic: null,
    bodySystem: null,
    subject: "",
    healthActive: false,
  });
  const messagesEndRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleBotReply = (userMessage) => {
    setIsTyping(true);

    window.setTimeout(() => {
      const response = getMedicalResponse(userMessage, chatContext);
      setMessages((currentMessages) => [...currentMessages, response.reply]);
      setChatContext(response.context);
      setIsTyping(false);
    }, 500);
  };

  const handleSend = (messageOverride) => {
    const nextMessage = (messageOverride ?? input).trim();

    if (!nextMessage || isTyping) {
      return;
    }

    setMessages((currentMessages) => [...currentMessages, { sender: "user", text: nextMessage }]);
    setInput("");
    handleBotReply(nextMessage);
  };

  return (
    <div className="chatbot">
      {!isOpen && (
        <button type="button" className="chatbot-btn" onClick={() => setIsOpen(true)}>
          <FaComments aria-hidden="true" />
          <span className="sr-only">Open chat assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h4>HealthNexus Assistant</h4>
              <p>Meaningful health guidance, precautions, food, and wellness tips</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)}>
              X
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`chat-msg ${message.sender === "user" ? "user-msg" : "bot-msg"}`}
              >
                <div className="chat-msg-text">
                  {message.text.split("\n").map((line, lineIndex) => (
                    <p key={`${index}-${lineIndex}`}>{line || "\u00A0"}</p>
                  ))}
                </div>

                {message.sender === "bot" && message.suggestions?.length ? (
                  <div className="chat-suggestions">
                    {message.suggestions.map((suggestion) => (
                      <button key={suggestion} type="button" onClick={() => handleSend(suggestion)}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {isTyping ? (
              <div className="chat-msg bot-msg typing-msg">
                <span />
                <span />
                <span />
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-wrap">
            <div className="chatbot-note">
              General guidance only. For severe, sudden, or worsening symptoms, contact a doctor.
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything related to health, symptoms, food, medicine, or routine..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
              />
              <button type="button" onClick={() => handleSend()} disabled={!canSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatbot;
