import {
  ComponentMarker,
  DiagnosticCategory,
  ImpactMetrics,
  RepairStep,
  SecondaryPossibility,
} from '../types';

export interface FailureProfile {
  key: string;
  category: DiagnosticCategory;
  objectName: string;
  modelNumber: string;
  keywords: string[];
  symptoms: string[];
  primaryIssue: {
    name: string;
    confidence: number;
    description: string;
    rootCause: string;
  };
  secondaryPossibilities: SecondaryPossibility[];
  markers: ComponentMarker[];
  repairCostRange: string;
  replaceCost: string;
  replaceText?: string;
  replacementDisposalNote?: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Professional Recommended';
  toolsRequired: { name: string; spec?: string }[];
  safetyWarnings: string[];
  safetyCautionType?: string;
  safetyCautionDesc?: string;
  repairSteps: Omit<RepairStep, 'imageUrl'>[];
  repairabilityBase: {
    partsAvailability: number;
    repairComplexity: number;
    costRatio: number;
    productAccessibility: number;
    partsNote?: string;
    complexityNote?: string;
    costRatioNote?: string;
    accessibilityNote?: string;
  };
  impactBase: ImpactMetrics;
  photoUrl: string;
}

export const CATEGORIES: DiagnosticCategory[] = [
  'Appliances',
  'Electronics',
  'Bicycles',
  'Tools',
  'Mechanical',
  'Furniture',
];

export const FAILURE_PROFILES: FailureProfile[] = [
  // ───────────────────────────── APPLIANCES ─────────────────────────────
  {
    key: 'appliances-washer-drain-pump',
    category: 'Appliances',
    objectName: 'Front-Loading Washing Machine',
    modelNumber: 'WM-8400-TURBO',
    keywords: ['wash', 'laundry', 'drain', 'spin', 'drum', 'appliance', 'washer'],
    symptoms: [
      'Unusual rattling & grinding vibration during drain cycle',
      'Incomplete water drainage at end of spin cycle',
      'Localized friction heat near lower access hatch',
    ],
    primaryIssue: {
      name: 'Drain Pump Obstruction & Filter Clog',
      confidence: 87,
      description:
        'Foreign object (coin/button) lodged inside lower pump housing, restricting impeller movement and creating cavitation noise during drain routine.',
      rootCause: 'Debris passed through coin trap mesh and jammed against motor impeller assembly.',
    },
    secondaryPossibilities: [
      {
        name: 'Filter Screen Blockage',
        confidence: 72,
        description: 'Lint and sediment buildup clogging the primary pre-filter chamber.',
        estimatedCost: '₹300 – ₹600',
      },
      {
        name: 'Pump Impeller Vane Fracture',
        confidence: 48,
        description: 'Physical plastic blade shear due to hard object impact requiring OEM pump replacement.',
        estimatedCost: '₹1,200 – ₹1,800',
      },
    ],
    markers: [
      {
        id: 'pump-filter',
        label: 'DRAIN PUMP & FILTER',
        category: 'issue',
        x: 64,
        y: 72,
        width: 24,
        height: 20,
        title: 'Drain Pump Assembly',
        description: 'Noise source localized to impeller chamber. High probability of coin or debris friction.',
        status: 'critical',
        symptomDetected: 'Visual anomaly: Impeller rotation drag',
      },
      {
        id: 'motor-drive',
        label: 'DIRECT DRIVE MOTOR',
        category: 'component',
        x: 34,
        y: 56,
        width: 28,
        height: 24,
        title: 'BLDC Drum Motor',
        description: 'Motor stator coils and bearing tolerances nominal. Rotor torque output within factory spec.',
        status: 'nominal',
      },
    ],
    repairCostRange: '₹800 – ₹1,500',
    replaceCost: '₹18,000+',
    replaceText: 'Includes new appliance purchase, delivery & disposal fees',
    replacementDisposalNote: 'Creates 65+ kg of unnecessary electronic appliance waste',
    estimatedTime: '30 – 60 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Phillips Screwdriver (#2)', spec: 'Standard crosshead' },
      { name: 'Pliers or Channel Locks', spec: 'For hose spring clamp' },
      { name: 'Shallow Drain Bucket / Towels', spec: 'To catch residual fluid' },
    ],
    safetyWarnings: [
      'Disconnect main 220V power plug from wall outlet before removing service panel.',
      'Turn off hot and cold water supply valves to prevent pressurized backflow.',
      'Residual water inside lower pump housing may be hot if machine ran warm cycle recently.',
    ],
    safetyCautionType: 'High Voltage & Pressurized Liquid Caution',
    safetyCautionDesc: 'If damage involves frayed 220V high-voltage wiring, seek certified technician help.',
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Power & Fluid Isolation',
        subtitle: 'Safety prerequisite before inspection',
        description: 'Unplug the appliance power cord from the wall outlet. Turn off both water inlet valves.',
        details: [
          'Verify display panel LEDs are unlit.',
          'Place absorbent towels around the lower front access hatch.',
        ],
        safetyNote: 'Do not touch internal electrical components with wet hands or while plugged in.',
      },
      {
        stepNumber: 2,
        title: 'Unscrew Pump Filter & Clear Chamber',
        subtitle: 'Identify and remove physical obstruction',
        description: 'Rotate the main filter handle counter-clockwise. Gently pull filter cylinder outward and clean chamber.',
        details: ['Inspect plastic impeller blades at rear.', 'Extract coins or debris using pliers.'],
      },
    ],
    repairabilityBase: {
      partsAvailability: 88,
      repairComplexity: 65,
      costRatio: 92,
      productAccessibility: 83,
      partsNote: 'Standard OEM pump motor & filter caps readily available in regional supply hubs.',
      complexityNote: 'No specialized soldering required; accessible via standard hand tools.',
      costRatioNote: 'Repair cost represents under 7% of new replacement appliance retail price.',
      accessibilityNote: 'Front access panel door allows inspection without disassembling tub framework.',
    },
    impactBase: {
      materialSavedKg: 26.4,
      co2SavedKg: 84.5,
      eWasteDivertedPercent: 100,
      waterSavedLiters: 420,
      materialNote: 'Includes steel drum, copper motor wiring, and molded plastic casing.',
    },
    photoUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1600&auto=format&fit=crop',
  },

  // ───────────────────────────── BICYCLES ─────────────────────────────
  {
    key: 'bicycles-derailleur-cable-slack',
    category: 'Bicycles',
    objectName: 'Mountain / Commuter Bicycle Drivetrain',
    modelNumber: 'Shimano Deore 10-Speed Setup',
    keywords: ['bike', 'bicycle', 'chain', 'derailleur', 'pedal', 'gear', 'wheel', 'drivetrain', 'sprocked', 'cassette'],
    symptoms: [
      'Chain skips under high pedal torque on 4th & 5th cogs',
      'Sluggish downshifting response',
      'Clicking noise from rear derailleur jockey wheel',
    ],
    primaryIssue: {
      name: 'Shift Cable Barrel Tension Slack & Derailleur Alignment',
      confidence: 95,
      description:
        'Cable stretch over time has caused indexing misalignment between shifter clicks and cassette cog spacing.',
      rootCause: 'Normal steel cable bedding-in and slight limit-screw drift.',
    },
    secondaryPossibilities: [
      {
        name: 'Cassette Cog Tooth Wear',
        confidence: 45,
        description: 'Excessive wear on middle cogs due to unlubricated chain.',
        estimatedCost: '₹1,200 – ₹2,000',
      },
    ],
    markers: [
      {
        id: 'derailleur-cable',
        label: 'DERAILLEUR CABLE & BARREL',
        category: 'issue',
        x: 75,
        y: 65,
        width: 18,
        height: 22,
        title: 'Indexing Cable Adjuster',
        description: 'Cable tension insufficient by roughly 1.5 full barrel turns.',
        status: 'critical',
        symptomDetected: 'Visual anomaly: Cable slack',
      },
      {
        id: 'drive-chain',
        label: 'DRIVE CHAIN',
        category: 'component',
        x: 48,
        y: 58,
        width: 25,
        height: 18,
        title: 'Chain & Chainstay',
        description: 'Chain pitch wear within normal 0.75% stretch tolerance limit.',
        status: 'nominal',
      },
    ],
    repairCostRange: '₹150 – ₹400',
    replaceCost: '₹22,000+',
    replaceText: 'Includes new bicycle or complete drivetrain replacement',
    replacementDisposalNote: 'Creates 14+ kg of unnecessary metal & rubber scrap waste',
    estimatedTime: '15 – 25 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Hex Allen Wrench (4mm / 5mm)', spec: 'Standard bike multitool' },
      { name: 'Chain Degreaser & Dry Lube', spec: 'Teflon dripless lube' },
    ],
    safetyWarnings: [
      'Keep fingers clear of turning chain and rear wheel spokes while spinning pedals by hand.',
      'Ensure bicycle is securely mounted on repair stand or turned upside down before shifting.',
      'Shift into smallest cassette cog before adjusting cable tension.',
    ],
    safetyCautionType: 'Mechanical Pinch Point Caution',
    safetyCautionDesc: 'Professional bike shop service recommended if frame, wheel rim, or hydraulic brake rotor damage is detected.',
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Turn Shift Barrel Adjuster Counter-Clockwise',
        subtitle: 'Increase cable tension to realign guide pulley',
        description: 'Elevate rear wheel. Turn the rear derailleur barrel adjuster counter-clockwise 1/2 turn at a time while spinning pedals forward.',
        details: ['Listen for smooth snap into each gear cog.', 'Verify guide pulley lines up perfectly center with gear tooth.'],
      },
    ],
    repairabilityBase: {
      partsAvailability: 96,
      repairComplexity: 87,
      costRatio: 98,
      productAccessibility: 92,
      partsNote: 'Standard Shimano/SRAM 10-speed shift cable & barrel adjusters widely available in local bike shops.',
      complexityNote: 'No specialized tools needed; adjustable using standard 4mm/5mm hex Allen wrenches.',
      costRatioNote: 'Cable adjustment outlay is under 2% of comparable bicycle replacement price.',
      accessibilityNote: 'Rear derailleur barrel adjuster is externally exposed and easily accessible.',
    },
    impactBase: {
      materialSavedKg: 14.2,
      co2SavedKg: 58.0,
      eWasteDivertedPercent: 100,
      materialNote: 'Includes aluminum alloy frame, steel cassette cogs, rubber tires, and cable housing.',
    },
    photoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop',
  },

  // ───────────────────────────── ELECTRONICS ─────────────────────────────
  {
    key: 'electronics-laptop-thermal',
    category: 'Electronics',
    objectName: 'Pro Performance Laptop (15-inch)',
    modelNumber: 'XPS-PRO-15',
    keywords: ['laptop', 'computer', 'pc', 'thermal', 'fan', 'heat', 'cpu', 'screen', 'keyboard', 'electronics'],
    symptoms: [
      'Thermal throttling under moderate CPU loads',
      'Fan spinning at maximum 6000 RPM continuously',
      'Bottom aluminum casing hot to touch (89°C)',
    ],
    primaryIssue: {
      name: 'Thermal Paste Desiccation & Dust Accumulation',
      confidence: 91,
      description:
        'Factory thermal compound degraded into dry crust. Dual radial blower heatsink fins blocked by fibrous dust mat.',
      rootCause: '3+ years of operation without thermal paste re-application.',
    },
    secondaryPossibilities: [
      {
        name: 'Cooling Fan Bearing Drag',
        confidence: 64,
        description: 'Left GPU fan experiencing friction resistance.',
        estimatedCost: '₹800 – ₹1,400',
      },
    ],
    markers: [
      {
        id: 'cpu-gpu-die',
        label: 'CPU / GPU THERMAL DIE',
        category: 'issue',
        x: 42,
        y: 38,
        width: 22,
        height: 22,
        title: 'Processor Thermal Interface',
        description: 'Thermal interface Delta T exceeds 45°C between silicon die and copper heatpipe.',
        status: 'critical',
        symptomDetected: 'Dry compound void areas',
      },
    ],
    repairCostRange: '₹450 – ₹900',
    replaceCost: '₹65,000+',
    replaceText: 'Includes new high-performance laptop purchase & data migration',
    replacementDisposalNote: 'Creates 2.1 kg of lithium battery & e-waste electronics scrap',
    estimatedTime: '25 – 40 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Torx T5 & Phillips #00 Screwdrivers', spec: 'Precision electronics bit' },
      { name: 'Isopropanol 99% & Microfiber', spec: 'Thermal clean' },
    ],
    safetyWarnings: [
      'ALWAYS disconnect internal battery connector harness clip before touching motherboard circuits.',
      'Touch grounded metal surface before handling PCB to prevent static discharge ESD damage.',
    ],
    safetyCautionType: 'Electrostatic Discharge & Battery Caution',
    safetyCautionDesc: 'If battery casing appears swollen or punctured, stop immediately and consult an authorized service center.',
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Remove Bottom Chassis Screws & Disconnect Battery',
        subtitle: 'De-energize motherboard circuits',
        description: 'Unscrew perimeter screws and slide battery harness out.',
        details: ['Hold laptop power button for 5 seconds to drain residual capacitance.'],
      },
    ],
    repairabilityBase: {
      partsAvailability: 92,
      repairComplexity: 78,
      costRatio: 96,
      productAccessibility: 70,
      partsNote: 'Thermal paste & dual replacement radial blower fans readily available online.',
      complexityNote: 'Requires precision screwdrivers; no micro-soldering needed for thermal maintenance.',
      costRatioNote: 'Thermal paste maintenance cost is under 1% of new laptop price.',
      accessibilityNote: 'Bottom aluminum chassis panel removable via 8 captive Torx screws.',
    },
    impactBase: {
      materialSavedKg: 2.1,
      co2SavedKg: 310.0,
      eWasteDivertedPercent: 100,
      materialNote: 'Includes aluminum chassis, copper heatsinks, motherboard silicon, and lithium battery.',
    },
    photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop',
  },

  // ───────────────────────────── TOOLS ─────────────────────────────
  {
    key: 'tools-drill-carbon-brush',
    category: 'Tools',
    objectName: '18V Cordless Rotary Hammer Drill',
    modelNumber: 'HD-18V-BRUSHLESS',
    keywords: ['drill', 'tool', 'motor', 'spark', 'battery', 'saw', 'grinder', 'power tool'],
    symptoms: [
      'Intermittent motor rotation under load',
      'Visible electrical arcing sparks inside ventilation slots',
      'Burning ozone odor during heavy drilling',
    ],
    primaryIssue: {
      name: 'Worn Motor Carbon Brushes & Commutator Oxidation',
      confidence: 89,
      description:
        'Carbon block brushes worn down to minimum wear indicator mark, reducing spring contact force against copper commutator segments.',
      rootCause: 'Friction consumption over 500+ hours of masonry drilling duty.',
    },
    secondaryPossibilities: [
      {
        name: 'Trigger Variable Switch Contact Pit',
        confidence: 42,
        description: 'Internal MOSFET trigger contact pitting.',
        estimatedCost: '₹600 – ₹1,100',
      },
    ],
    markers: [
      {
        id: 'carbon-brush',
        label: 'MOTOR CARBON BRUSH HOUSING',
        category: 'issue',
        x: 52,
        y: 40,
        width: 20,
        height: 20,
        title: 'Brush Holder Assembly',
        description: 'Brush spring pressure low. Replace dual carbon block pair.',
        status: 'critical',
        symptomDetected: 'Visual anomaly: Commutator arcing',
      },
    ],
    repairCostRange: '₹350 – ₹700',
    replaceCost: '₹8,500',
    replaceText: 'Includes new 18V rotary drill purchase & battery kit',
    replacementDisposalNote: 'Creates 3.8 kg of heavy metal tool motor scrap',
    estimatedTime: '20 – 30 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Flathead / Phillips Screwdriver Set', spec: 'Casing access' },
      { name: 'Replacement Carbon Brush Pair', spec: 'OEM matching spec' },
    ],
    safetyWarnings: [
      'ALWAYS remove 18V Li-ion battery pack BEFORE unscrewing tool housing.',
      'Wear safety glasses to prevent carbon dust contact during brush cleaning.',
    ],
    safetyCautionType: 'Battery Isolation Caution',
    safetyCautionDesc: 'Never operate power tool casing opened with battery connected.',
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Remove Battery & Unscrew Rear Motor Cap',
        subtitle: 'Access internal brush holders',
        description: 'Remove lithium battery pack. Unscrew rear 2x cap screws to reveal copper spring brush clips.',
        details: ['Pop out spring clip and lift old carbon block out.'],
      },
    ],
    repairabilityBase: {
      partsAvailability: 85,
      repairComplexity: 72,
      costRatio: 90,
      productAccessibility: 88,
      partsNote: 'Replacement motor carbon brush blocks widely available online.',
      complexityNote: 'Simple cap removal; no gear housing disassembly required.',
      costRatioNote: 'Carbon brush set costs under 5% of new drill kit replacement.',
      accessibilityNote: 'Rear motor cap screws provide direct access to brush holders.',
    },
    impactBase: {
      materialSavedKg: 3.8,
      co2SavedKg: 42.0,
      eWasteDivertedPercent: 100,
      materialNote: 'Includes steel chuck, copper motor winding, and fiberglass housing.',
    },
    photoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1600&auto=format&fit=crop',
  },
];
