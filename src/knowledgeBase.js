/**
 * Mechanical Safety Knowledge Base
 * Contains standards, regulations, hazard categories, and compliance checklists.
 */

const STANDARDS = {
  ISO_12100: {
    id: 'ISO 12100:2010',
    title: 'Safety of machinery — General principles for design',
    description: 'Establishes general principles for designing safe machinery through risk assessment and risk reduction.',
    keyRequirements: [
      'Risk assessment methodology (hazard identification, risk estimation, risk evaluation)',
      'Three-step method: inherently safe design, safeguarding, information for use',
      'Iterative risk reduction process',
      'Documentation of risk assessment',
    ],
  },
  ISO_13849: {
    id: 'ISO 13849-1:2023',
    title: 'Safety of machinery — Safety-related parts of control systems',
    description: 'Provides requirements for safety-related parts of control systems (SRP/CS) including Performance Level (PL) determination.',
    keyRequirements: [
      'Performance Level (PL a–e) determination',
      'Category (B, 1–4) assignment',
      'Mean Time to Dangerous Failure (MTTFd) calculation',
      'Diagnostic Coverage (DC) assessment',
      'Common Cause Failure (CCF) analysis',
    ],
  },
  IEC_62061: {
    id: 'IEC 62061:2021',
    title: 'Safety of machinery — Functional safety of safety-related control systems',
    description: 'Specifies requirements for design and implementation of safety-related electrical control systems (SCS) with SIL determination.',
    keyRequirements: [
      'Safety Integrity Level (SIL 1–3) determination',
      'Hardware Fault Tolerance (HFT)',
      'Safe Failure Fraction (SFF)',
      'Probability of Dangerous Failure per Hour (PFHd)',
      'Systematic capability assessment',
    ],
  },
  ISO_13857: {
    id: 'ISO 13857:2019',
    title: 'Safety of machinery — Safety distances',
    description: 'Establishes values for safety distances to prevent danger zones from being reached by upper and lower limbs.',
    keyRequirements: [
      'Minimum safety distances for upper limbs',
      'Minimum safety distances for lower limbs',
      'Openings in guards calculations',
      'Age-related safety distances (adults vs. children)',
    ],
  },
  ISO_14119: {
    id: 'ISO 14119:2013',
    title: 'Safety of machinery — Interlocking devices',
    description: 'Provides principles for design and selection of interlocking devices associated with guards.',
    keyRequirements: [
      'Interlocking device types (1–4)',
      'Actuating system defeat resistance',
      'Escape and emergency release provisions',
      'Installation and mounting requirements',
    ],
  },
  OSHA_1910: {
    id: 'OSHA 29 CFR 1910 Subpart O',
    title: 'Machinery and Machine Guarding (USA)',
    description: 'US federal regulations covering machine guarding requirements in general industry.',
    keyRequirements: [
      '1910.212 — General machine guarding',
      '1910.213 — Woodworking machinery',
      '1910.217 — Mechanical power presses',
      '1910.219 — Mechanical power transmission',
      'Point of operation guarding',
    ],
  },
  MACHINERY_DIRECTIVE: {
    id: '2006/42/EC',
    title: 'EU Machinery Directive',
    description: 'European directive establishing essential health and safety requirements for machinery placed on the EU market.',
    keyRequirements: [
      'Essential Health and Safety Requirements (EHSRs)',
      'CE marking obligations',
      'Technical file preparation',
      'Declaration of Conformity',
      'Conformity assessment procedures',
    ],
  },
  ANSI_B11: {
    id: 'ANSI B11 Series',
    title: 'Machine Safety Standards (USA)',
    description: 'Series of American National Standards for machine safety risk assessment and safeguarding.',
    keyRequirements: [
      'B11.0 — General safety requirements and risk assessment',
      'B11.19 — Safeguarding methods',
      'B11.20 — Manufacturing systems/cells',
      'Risk assessment documentation',
      'Hierarchy of controls',
    ],
  },
};

const HAZARD_CATEGORIES = {
  MECHANICAL: {
    name: 'Mechanical Hazards',
    types: [
      'Crushing', 'Shearing', 'Cutting/severing', 'Entanglement',
      'Drawing-in/trapping', 'Impact', 'Stabbing/puncture', 'Friction/abrasion',
      'High-pressure fluid injection', 'Ejection of parts',
    ],
    controls: [
      'Fixed guards', 'Interlocked guards', 'Adjustable guards',
      'Self-adjusting guards', 'Safety distance calculations',
      'Two-hand control devices', 'Presence sensing devices',
    ],
  },
  ELECTRICAL: {
    name: 'Electrical Hazards',
    types: [
      'Electric shock (direct/indirect contact)', 'Short circuit', 'Overload',
      'Electrostatic discharge', 'Arc flash', 'Electromagnetic interference',
    ],
    controls: [
      'Isolation and lockout/tagout (LOTO)', 'Insulation', 'Enclosures (IP rating)',
      'Residual Current Devices (RCD)', 'Earthing/grounding', 'Arc flash PPE',
    ],
  },
  THERMAL: {
    name: 'Thermal Hazards',
    types: [
      'Burns from hot surfaces', 'Burns from hot fluids',
      'Scalding', 'Cold burns (cryogenic)', 'Fire and explosion',
    ],
    controls: [
      'Thermal insulation/barriers', 'Temperature limiting devices',
      'Warning signs', 'PPE (gloves, aprons)', 'Automatic temperature shutoff',
    ],
  },
  NOISE_VIBRATION: {
    name: 'Noise & Vibration Hazards',
    types: [
      'Noise-induced hearing loss (>85 dB(A))', 'Hand-arm vibration (HAV)',
      'Whole-body vibration (WBV)', 'Infrasound/ultrasound',
    ],
    controls: [
      'Engineering noise controls (enclosures, damping)', 'Hearing protection (PPE)',
      'Anti-vibration mounts', 'Exposure time limits', 'Health surveillance',
    ],
  },
  ERGONOMIC: {
    name: 'Ergonomic Hazards',
    types: [
      'Awkward posture', 'Repetitive motion', 'Manual handling/lifting',
      'Excessive force', 'Contact stress', 'Whole-body fatigue',
    ],
    controls: [
      'Workstation height adjustment', 'Mechanical lifting aids', 'Job rotation',
      'Anthropometric design', 'Force reduction tools', 'Break schedules',
    ],
  },
  CHEMICAL: {
    name: 'Chemical/Material Hazards',
    types: [
      'Exposure to coolants/lubricants', 'Metal dust inhalation',
      'Toxic fume generation', 'Skin sensitizers', 'Carcinogens',
    ],
    controls: [
      'Local exhaust ventilation (LEV)', 'Substitution of hazardous materials',
      'Enclosed systems', 'Respiratory PPE', 'SDS/MSDS compliance',
    ],
  },
};

const COMPLIANCE_CHECKLIST = [
  { id: 'CC-01', category: 'Risk Assessment',       item: 'Risk assessment conducted per ISO 12100',                   critical: true  },
  { id: 'CC-02', category: 'Risk Assessment',       item: 'All hazards identified and documented',                     critical: true  },
  { id: 'CC-03', category: 'Risk Assessment',       item: 'Risk reduction measures applied in hierarchy order',        critical: true  },
  { id: 'CC-04', category: 'Guards & Safeguards',   item: 'All danger zones guarded or safeguarded',                   critical: true  },
  { id: 'CC-05', category: 'Guards & Safeguards',   item: 'Safety distances meet ISO 13857 requirements',             critical: true  },
  { id: 'CC-06', category: 'Guards & Safeguards',   item: 'Interlocks meet ISO 14119 / Performance Level requirements',critical: true  },
  { id: 'CC-07', category: 'Control Systems',       item: 'Safety functions achieve required Performance Level (PL)',  critical: true  },
  { id: 'CC-08', category: 'Control Systems',       item: 'Emergency stop provided per ISO 13850',                    critical: true  },
  { id: 'CC-09', category: 'Control Systems',       item: 'Control system category verified (ISO 13849)',             critical: false },
  { id: 'CC-10', category: 'Electrical Safety',     item: 'Machinery complies with IEC 60204-1',                      critical: true  },
  { id: 'CC-11', category: 'Electrical Safety',     item: 'LOTO procedures documented',                               critical: true  },
  { id: 'CC-12', category: 'Noise & Vibration',     item: 'Noise levels measured and documented',                     critical: false },
  { id: 'CC-13', category: 'Noise & Vibration',     item: 'Vibration exposure within action/limit values',            critical: false },
  { id: 'CC-14', category: 'Documentation',         item: 'Technical file / Design documentation prepared',           critical: true  },
  { id: 'CC-15', category: 'Documentation',         item: 'Operators manual and safety instructions provided',        critical: true  },
  { id: 'CC-16', category: 'Documentation',         item: 'CE marking / Declaration of Conformity (EU market)',       critical: false },
  { id: 'CC-17', category: 'Maintenance & LOTO',    item: 'Safe maintenance access provisions made',                  critical: true  },
  { id: 'CC-18', category: 'Maintenance & LOTO',    item: 'Isolation points clearly labelled',                        critical: false },
  { id: 'CC-19', category: 'PPE & Ergonomics',      item: 'Ergonomic risk assessment completed',                      critical: false },
  { id: 'CC-20', category: 'PPE & Ergonomics',      item: 'Required PPE identified and communicated',                 critical: false },
];

/**
 * Look up a standard by keyword.
 * @param {string} keyword
 * @returns {object[]}
 */
function searchStandards(keyword) {
  const kw = keyword.toLowerCase();
  return Object.values(STANDARDS).filter(
    s =>
      s.id.toLowerCase().includes(kw) ||
      s.title.toLowerCase().includes(kw) ||
      s.description.toLowerCase().includes(kw)
  );
}

/**
 * Get hazard info by type keyword.
 */
function searchHazards(keyword) {
  const kw = keyword.toLowerCase();
  return Object.values(HAZARD_CATEGORIES).filter(
    h =>
      h.name.toLowerCase().includes(kw) ||
      h.types.some(t => t.toLowerCase().includes(kw)) ||
      h.controls.some(c => c.toLowerCase().includes(kw))
  );
}

/**
 * Build a formatted context string for injection into the LLM prompt.
 */
function buildKnowledgeContext(userQuery) {
  const qLower = userQuery.toLowerCase();

  const relevantStandards = Object.values(STANDARDS).filter(s =>
    s.id.toLowerCase().split(/[\s:\/]/).some(token => qLower.includes(token)) ||
    s.title.toLowerCase().split(' ').some(word => word.length > 4 && qLower.includes(word))
  );

  const relevantHazards = Object.values(HAZARD_CATEGORIES).filter(h =>
    h.name.toLowerCase().split(' ').some(word => word.length > 4 && qLower.includes(word)) ||
    h.types.some(t => t.toLowerCase().split(/[\s\/]/).some(tok => tok.length > 4 && qLower.includes(tok)))
  );

  let context = '';

  if (relevantStandards.length > 0) {
    context += '\n### Relevant Standards:\n';
    relevantStandards.forEach(s => {
      context += `**${s.id}** — ${s.title}\n${s.description}\nKey requirements: ${s.keyRequirements.join('; ')}\n\n`;
    });
  }

  if (relevantHazards.length > 0) {
    context += '\n### Relevant Hazard Information:\n';
    relevantHazards.forEach(h => {
      context += `**${h.name}**\nHazard types: ${h.types.slice(0, 5).join(', ')}\nTypical controls: ${h.controls.slice(0, 5).join(', ')}\n\n`;
    });
  }

  if (!context) {
    context = '\n### General Standards Reference:\nISO 12100, ISO 13849, IEC 62061, ISO 13857, ISO 14119, OSHA 29 CFR 1910, EU Machinery Directive 2006/42/EC, ANSI B11 series.\n';
  }

  return context;
}

module.exports = {
  STANDARDS,
  HAZARD_CATEGORIES,
  COMPLIANCE_CHECKLIST,
  searchStandards,
  searchHazards,
  buildKnowledgeContext,
};
