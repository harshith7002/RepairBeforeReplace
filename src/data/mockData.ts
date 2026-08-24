import { DiagnosticItem } from '../types';

export const WASHING_MACHINE_DEMO: DiagnosticItem = {
  id: 'wm-01-frontload',
  name: 'Front-Loading Washing Machine',
  category: 'Appliances',
  modelNumber: 'WM-8400-TURBO (Demo Unit)',
  thumbnailUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1200&auto=format&fit=crop',
  fullImageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1600&auto=format&fit=crop',
  symptoms: [
    'Unusual rattling & grinding vibration during drain cycle',
    'Incomplete water drainage at end of spin cycle',
    'Localized friction heat near lower access hatch'
  ],
  repairability: {
    partsAvailability: 88,
    repairComplexity: 65,
    costRatio: 92,
    productAccessibility: 83,
    totalScore: 82,
    verdict: 'Good candidate for repair'
  },
  primaryIssue: {
    name: 'Drain Pump Obstruction & Filter Clog',
    confidence: 87,
    description: 'Foreign object (coin/button) lodged inside lower pump housing, restricting impeller movement and creating cavitation noise during drain routine.',
    rootCause: 'Debris passed through coin trap mesh and jammed against motor impeller assembly.'
  },
  secondaryPossibilities: [
    {
      name: 'Filter Screen Blockage',
      confidence: 72,
      description: 'Lint and sediment buildup clogging the primary pre-filter chamber.',
      estimatedCost: '₹300 – ₹600'
    },
    {
      name: 'Pump Impeller Vane Fracture',
      confidence: 48,
      description: 'Physical plastic blade shear due to hard object impact requiring OEM pump replacement.',
      estimatedCost: '₹1,200 – ₹1,800'
    },
    {
      name: 'Corrugated Drain Hose Kink/Clog',
      confidence: 34,
      description: 'External discharge hose restricted behind rear wall cabinet panel.',
      estimatedCost: '₹0 – ₹400'
    }
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
      symptomDetected: 'Cavitation acoustic profile (87dB peak @ 120Hz)'
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
      status: 'nominal'
    },
    {
      id: 'drum-bearing',
      label: 'DRUM BEARING & SEAL',
      category: 'component',
      x: 28,
      y: 22,
      width: 42,
      height: 32,
      title: 'Stainless Drum Assembly',
      description: 'Minimal axial shaft play. Tub seal intact with no signs of water leakage into bearing raceway.',
      status: 'nominal'
    },
    {
      id: 'drain-path',
      label: 'DRAIN HOSE OUTLET',
      category: 'sensor',
      x: 82,
      y: 58,
      width: 14,
      height: 28,
      title: 'Discharge Water Route',
      description: 'Fluid pressure drops during drain command cycle. Flow velocity 40% below normal baseline.',
      status: 'warning',
      symptomDetected: 'Reduced fluid volume rate'
    }
  ],
  repairCostRange: '₹800 – ₹1,500',
  replaceCost: '₹18,000+',
  potentialSavings: '₹16,500+',
  estimatedTime: '30 – 60 min',
  difficulty: 'Moderate',
  toolsRequired: [
    { name: 'Phillips Screwdriver (#2)', spec: 'Standard crosshead' },
    { name: 'Pliers or Channel Locks', spec: 'For hose spring clamp' },
    { name: 'Shallow Drain Bucket / Towels', spec: 'To catch residual fluid' },
    { name: 'LED Inspection Light', spec: 'Clear chamber view' },
    { name: 'Small Cleaning Brush', spec: 'Debris removal' }
  ],
  safetyWarnings: [
    'ALWAYS disconnect the main 220V power plug from wall outlet before removing any service panel.',
    'Turn off the hot and cold water supply valves to prevent pressurized backflow.',
    'Residual water inside lower pump housing may be hot if machine ran a warm cycle recently.',
    'Wear cut-resistant gloves when reaching inside lower metal cabinet frames.'
  ],
  repairSteps: [
    {
      stepNumber: 1,
      title: 'Power & Fluid Isolation',
      subtitle: 'Safety prerequisite before inspection',
      description: 'Unplug the appliance power cord from the wall outlet. Turn off both water inlet valves located at the wall spigot behind the unit.',
      details: [
        'Verify display panel LEDs are completely unlit.',
        'Pull machine forward 6 inches to ensure hose tension is relaxed.',
        'Place thick absorbent towels around the lower front access hatch.'
      ],
      safetyNote: 'Do not touch internal electrical components with wet hands or while plugged in.',
      proTip: 'Tape the power plug to the upper lid so it cannot fall into water.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      highlightMarkerId: 'pump-filter'
    },
    {
      stepNumber: 2,
      title: 'Open Service Access Hatch & Drain Chamber',
      subtitle: 'Release residual water safely',
      description: 'Locate the small rectangular hatch on the bottom-right front panel. Press the release latch to expose the emergency drain hose and filter plug.',
      details: [
        'Unclip the small flexible emergency drain hose from its retaining bracket.',
        'Position shallow tray beneath hose end, remove plug, and allow standing water to drain completely.',
        'Re-plug emergency hose once water flow stops.'
      ],
      safetyNote: 'Water may release rapidly; keep bucket close to hatch level.',
      proTip: 'A shallow baking tray fits underneath better than a deep bucket.',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
      highlightMarkerId: 'pump-filter'
    },
    {
      stepNumber: 3,
      title: 'Unscrew Pump Filter & Inspect Chamber',
      subtitle: 'Identify and remove physical obstruction',
      description: 'Rotate the main filter handle counter-clockwise (approx. 4–6 full turns). Gently pull filter cylinder outward.',
      details: [
        'Shine LED light directly inside the exposed pump housing chamber.',
        'Inspect plastic impeller blades at the rear of the chamber.',
        'Check for trapped coins, hairpin wire, keyrings, or concentrated lint balls.'
      ],
      safetyNote: 'Impeller blades can be sharp if fractured; use pliers or gloved fingers.',
      proTip: 'Spin the rear impeller with your index finger; it should pulse cleanly between magnet poles.',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop',
      highlightMarkerId: 'pump-filter'
    },
    {
      stepNumber: 4,
      title: 'Clear Obstruction & Flush Filter Cylinder',
      subtitle: 'Clean seating threads and rubber O-ring seal',
      description: 'Extract foreign matter using pliers or brush. Wash filter cylinder under warm running water to remove lime scale and sludge.',
      details: [
        'Inspect rubber gasket O-ring on filter cap for cracks or distortion.',
        'Wipe female screw threads inside pump housing with microfiber cloth.',
        'Re-insert filter cylinder firmly and turn clockwise until tight seal mark aligns.'
      ],
      safetyNote: 'Under-tightening filter cap will result in water leakage during next wash cycle.',
      proTip: 'Apply a tiny drop of silicone grease to O-ring for easy future maintenance.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      highlightMarkerId: 'pump-filter'
    },
    {
      stepNumber: 5,
      title: 'Re-power & Execute Verification Test Cycle',
      subtitle: 'Confirm zero leaks and smooth pump operation',
      description: 'Close service access panel door. Reconnect main power plug and turn water supply valves back on.',
      details: [
        'Select 3-Minute "Rinse & Spin" or "Drain Only" program on selector dial.',
        'Listen closely to pump initiation sound: should be smooth steady hum without grinding.',
        'Check lower panel perimeter for any water moisture.'
      ],
      safetyNote: 'If grinding noise persists, pump motor bearings may need complete replacement.',
      proTip: 'Save this diagnosis record in your RepairBeforeReplace history!',
      imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1200&auto=format&fit=crop',
      highlightMarkerId: 'pump-filter'
    }
  ],
  impact: {
    materialSavedKg: 26.4,
    co2SavedKg: 84.5,
    eWasteDivertedPercent: 100,
    waterSavedLiters: 420
  },
  diagnosedDate: 'Today, 2:45 PM'
};

export const MOCK_ITEMS: DiagnosticItem[] = [
  WASHING_MACHINE_DEMO,
  {
    id: 'laptop-thermal-02',
    name: 'Pro Performance Laptop (15-inch)',
    category: 'Electronics',
    modelNumber: 'XPS-PRO-15 (2021)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop',
    fullImageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop',
    symptoms: [
      'Thermal throttling under moderate CPU loads',
      'Fan spinning at maximum 6000 RPM continuously',
      'Bottom aluminum casing hot to touch (89°C)'
    ],
    repairability: {
      partsAvailability: 92,
      repairComplexity: 78,
      costRatio: 96,
      productAccessibility: 70,
      totalScore: 84,
      verdict: 'Excellent candidate for repair'
    },
    primaryIssue: {
      name: 'Thermal Paste Desiccation & Dust Accumulation',
      confidence: 91,
      description: 'Factory phase-change thermal compound degraded into dry crust. Dual radial blower heatsink fins blocked by fibrous dust mat.',
      rootCause: '3+ years of operation without thermal paste re-application.'
    },
    secondaryPossibilities: [
      {
        name: 'Cooling Fan Bearing Drag',
        confidence: 64,
        description: 'Left GPU fan experiencing friction resistance.',
        estimatedCost: '₹800 – ₹1,400'
      },
      {
        name: 'Heatpipe Vapor Chamber Depressurization',
        confidence: 22,
        description: 'Physical micro-crack in copper heatpipe.',
        estimatedCost: '₹2,500 – ₹3,800'
      }
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
        description: 'Thermal camera Delta T exceeds 45°C between silicon die and copper heatpipe.',
        status: 'critical',
        symptomDetected: 'Dry compound void areas'
      },
      {
        id: 'fan-assembly',
        label: 'DUAL RADIAL FANS',
        category: 'component',
        x: 20,
        y: 30,
        width: 18,
        height: 28,
        title: 'Blower Exhaust Fins',
        description: 'Exhaust grill fin pitch partially restricted by felt-like dust lint.',
        status: 'warning'
      }
    ],
    repairCostRange: '₹450 – ₹900',
    replaceCost: '₹65,000+',
    potentialSavings: '₹64,100+',
    estimatedTime: '25 – 40 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Torx T5 & Phillips #00 Screwdrivers', spec: 'Precision electronics bit' },
      { name: 'Isopropanol 99% & Microfiber', spec: 'Thermal clean' },
      { name: 'High-Performance Thermal Compound', spec: 'Arctic MX-6 or Noctua NT-H2' },
      { name: 'Plastic Spudger / Pry Tool', spec: 'Safety clip release' }
    ],
    safetyWarnings: [
      'ALWAYS disconnect internal battery connector clip before touching motherboard circuits.',
      'Use ESD anti-static wrist strap or touch grounded metal surface before handling PCB.'
    ],
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Remove Bottom Chassis Screws & Disconnect Battery',
        subtitle: 'De-energize motherboard circuits',
        description: 'Unscrew 8x Torx T5 perimeter screws and gently pop bottom panel retainers using plastic spudger.',
        details: [
          'Store screws in magnetic tray sorted by length.',
          'Slide battery power harness connector straight back out of socket.',
          'Hold laptop power button for 5 seconds to drain residual board capacitance.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop'
      },
      {
        stepNumber: 2,
        title: 'Remove Heatsink Assembly & Clean Old Paste',
        subtitle: 'Expose CPU and GPU silicon dies',
        description: 'Loosen captive heatsink screws in reverse numerical order (4-3-2-1). Lift copper heatpipe assembly straight up.',
        details: [
          'Apply 99% isopropyl alcohol to microfiber cloth and dissolve crusty gray paste.',
          'Clean copper contact cold-plate until shiny mirror finish appears.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1200&auto=format&fit=crop'
      },
      {
        stepNumber: 3,
        title: 'Repaste Silicon & Blow Out Fan Fins',
        subtitle: 'Restore 100% thermal transfer efficiency',
        description: 'Place a small pea-sized dot of premium thermal paste on CPU die and a thin line on GPU die. Use compressed air to blow dust out of fan heatsinks.',
        details: [
          'Hold fan blades still while blowing compressed air to prevent over-spinning bearing.',
          'Re-mount copper heatsink and torque screws in pattern (1-2-3-4).'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop'
      }
    ],
    impact: {
      materialSavedKg: 2.1,
      co2SavedKg: 310.0,
      eWasteDivertedPercent: 100
    },
    diagnosedDate: 'Yesterday'
  },
  {
    id: 'bike-chain-03',
    name: 'Mountain / Commuter Bicycle Drivetrain',
    category: 'Bicycles',
    modelNumber: 'Shimano Deore 10-Speed Setup',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop',
    fullImageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop',
    symptoms: [
      'Chain skips under high pedal torque on 4th & 5th cogs',
      'Sluggish downshifting response',
      'Clicking noise from rear derailleur jockey wheel'
    ],
    repairability: {
      partsAvailability: 98,
      repairComplexity: 85,
      costRatio: 98,
      productAccessibility: 95,
      totalScore: 94,
      verdict: 'Ideal candidate for DIY repair'
    },
    primaryIssue: {
      name: 'Shift Cable Barrel Tension Slack & Derailleur Hanger Alignment',
      confidence: 94,
      description: 'Cable stretch over time has caused indexing misalignment between shifter clicks and cassette cog spacing.',
      rootCause: 'Normal steel cable bedding-in and slight H-limit screw drift.'
    },
    secondaryPossibilities: [
      {
        name: 'Cassette Cog Tooth Wear',
        confidence: 45,
        description: 'Excessive wear on middle cogs due to unlubricated chain.',
        estimatedCost: '₹1,200 – ₹2,000'
      },
      {
        name: 'Stiff Chain Link Pin',
        confidence: 38,
        description: 'Single chain link tight pin preventing articulation over jockey pulley.',
        estimatedCost: '₹0 (manual flex)'
      }
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
        description: 'Cable tension insufficient by 1.5 full barrel turns.',
        status: 'critical'
      }
    ],
    repairCostRange: '₹150 – ₹400',
    replaceCost: '₹22,000+',
    potentialSavings: '₹21,600+',
    estimatedTime: '15 – 25 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Hex Allen Wrench (4mm / 5mm)', spec: 'Standard bike multitool' },
      { name: 'Chain Degreaser & Dry Lube', spec: 'Teflon dripless lube' },
      { name: 'Clean Rag', spec: 'Chain wipe down' }
    ],
    safetyWarnings: [
      'Keep fingers clear of turning chain teeth and rear wheel spokes when spinning pedals by hand.'
    ],
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Turn Shift Barrel Adjuster Counter-Clockwise',
        subtitle: 'Increase cable tension to realign guide pulley',
        description: 'Elevate rear wheel. Turn the rear derailleur barrel adjuster counter-clockwise 1/2 turn at a time while spinning pedals forward.',
        details: [
          'Listen for smooth snap into each gear cog.',
          'Verify guide pulley lines up perfectly center with corresponding cassette gear tooth.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop'
      }
    ],
    impact: {
      materialSavedKg: 14.2,
      co2SavedKg: 58.0,
      eWasteDivertedPercent: 100
    },
    diagnosedDate: '3 days ago'
  },
  {
    id: 'drill-motor-04',
    name: '18V Cordless Rotary Hammer Drill',
    category: 'Tools',
    modelNumber: 'HD-18V-BRUSHLESS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop',
    fullImageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1600&auto=format&fit=crop',
    symptoms: [
      'Intermittent motor rotation under load',
      'Visible electrical arcing sparks inside ventilation slots',
      'Burning ozone odor during heavy drilling'
    ],
    repairability: {
      partsAvailability: 85,
      repairComplexity: 72,
      costRatio: 90,
      productAccessibility: 88,
      totalScore: 84,
      verdict: 'Good candidate for repair'
    },
    primaryIssue: {
      name: 'Worn Motor Carbon Brushes & Commutator Oxidation',
      confidence: 89,
      description: 'Carbon block brushes worn down to minimum wear indicator mark, reducing spring contact force against copper commutator segments.',
      rootCause: 'Friction consumption over 500+ hours of masonry drilling duty.'
    },
    secondaryPossibilities: [
      {
        name: 'Trigger Variable Switch Contact Pit',
        confidence: 42,
        description: 'Internal MOSFET trigger contact pitting.',
        estimatedCost: '₹600 – ₹1,100'
      }
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
        status: 'critical'
      }
    ],
    repairCostRange: '₹350 – ₹700',
    replaceCost: '₹8,500',
    potentialSavings: '₹7,800+',
    estimatedTime: '20 – 30 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Flathead / Phillips Screwdriver Set', spec: 'Casing access' },
      { name: 'Replacement Carbon Brush Pair', spec: 'OEM matching spec' }
    ],
    safetyWarnings: [
      'Remove 18V Li-ion battery pack BEFORE unscrewing tool housing.'
    ],
    repairSteps: [
      {
        stepNumber: 1,
        title: 'Remove Battery & Unscrew Rear Motor Cap',
        subtitle: 'Access internal brush holders',
        description: 'Remove lithium battery pack. Unscrew rear 2x cap screws to reveal copper spring brush clips.',
        details: [
          'Pop out spring clip and lift old carbon block out.',
          'Insert new carbon brush set into brass guide sleeves.'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop'
      }
    ],
    impact: {
      materialSavedKg: 3.8,
      co2SavedKg: 42.0,
      eWasteDivertedPercent: 100
    },
    diagnosedDate: 'Last week'
  }
];
