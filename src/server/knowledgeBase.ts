import {
  ComponentMarker,
  DiagnosticCategory,
  ImpactMetrics,
  RepairStep,
  SecondaryPossibility,
} from '../types';

/**
 * The repair knowledge base backing the heuristic diagnosis engine (used whenever no
 * ANTHROPIC_API_KEY is configured, or as a safety net if the AI call fails/returns
 * something unusable). Each FailureProfile is a hand-authored, plausible failure mode for
 * a category of hardware, written in the same voice as the original product demo data.
 * The engine deterministically picks one of these based on the uploaded image + any
 * filename/notes hints, then fills in an id/photo/date to produce a full DiagnosticItem.
 */

export interface FailureProfile {
  key: string;
  category: DiagnosticCategory;
  objectName: string;
  modelNumber: string;
  keywords: string[]; // used to match filenames / user notes to this profile
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
  estimatedTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Professional Recommended';
  toolsRequired: { name: string; spec?: string }[];
  safetyWarnings: string[];
  repairSteps: Omit<RepairStep, 'imageUrl'>[];
  repairabilityBase: {
    partsAvailability: number;
    repairComplexity: number;
    costRatio: number;
    productAccessibility: number;
  };
  impactBase: ImpactMetrics;
  photoUrl: string;
}

export const FAILURE_PROFILES: FailureProfile[] = [
  // ───────────────────────────── APPLIANCES ─────────────────────────────
  {
    key: 'appliances-washer-drain-pump',
    category: 'Appliances',
    objectName: 'Front-Loading Washing Machine',
    modelNumber: 'WM-8400-TURBO',
    keywords: ['wash', 'laundry', 'drain', 'spin', 'drum'],
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
      { name: 'Filter Screen Blockage', confidence: 72, description: 'Lint and sediment buildup clogging the primary pre-filter chamber.', estimatedCost: '₹300 – ₹600' },
      { name: 'Pump Impeller Vane Fracture', confidence: 48, description: 'Physical plastic blade shear due to hard object impact requiring OEM pump replacement.', estimatedCost: '₹1,200 – ₹1,800' },
    ],
    markers: [
      { id: 'pump-filter', label: 'DRAIN PUMP & FILTER', category: 'issue', x: 64, y: 72, width: 24, height: 20, title: 'Drain Pump Assembly', description: 'Noise source localized to impeller chamber. High probability of coin or debris friction.', status: 'critical', symptomDetected: 'Cavitation acoustic profile (87dB peak @ 120Hz)' },
      { id: 'motor-drive', label: 'DIRECT DRIVE MOTOR', category: 'component', x: 34, y: 56, width: 28, height: 24, title: 'BLDC Drum Motor', description: 'Motor stator coils and bearing tolerances nominal.', status: 'nominal' },
      { id: 'drain-path', label: 'DRAIN HOSE OUTLET', category: 'sensor', x: 82, y: 58, width: 14, height: 28, title: 'Discharge Water Route', description: 'Fluid pressure drops during drain command cycle.', status: 'warning', symptomDetected: 'Reduced fluid volume rate' },
    ],
    repairCostRange: '₹800 – ₹1,500',
    replaceCost: '₹18,000',
    estimatedTime: '30 – 60 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Phillips Screwdriver (#2)', spec: 'Standard crosshead' },
      { name: 'Pliers or Channel Locks', spec: 'For hose spring clamp' },
      { name: 'Shallow Drain Bucket / Towels', spec: 'To catch residual fluid' },
      { name: 'LED Inspection Light', spec: 'Clear chamber view' },
    ],
    safetyWarnings: [
      'ALWAYS disconnect the main power plug from the wall outlet before removing any service panel.',
      'Turn off the hot and cold water supply valves to prevent pressurized backflow.',
      'Residual water inside the lower pump housing may still be hot after a warm cycle.',
    ],
    repairSteps: [
      { stepNumber: 1, title: 'Power & Fluid Isolation', subtitle: 'Safety prerequisite before inspection', description: 'Unplug the appliance and turn off both water inlet valves behind the unit.', details: ['Verify display panel LEDs are unlit.', 'Pull the machine forward to relax hose tension.', 'Lay towels around the lower access hatch.'], safetyNote: 'Do not touch internal electrical components with wet hands.', proTip: 'Tape the power plug to the lid so it cannot fall into water.', highlightMarkerId: 'pump-filter' },
      { stepNumber: 2, title: 'Open Service Hatch & Drain Chamber', subtitle: 'Release residual water safely', description: 'Locate the small hatch on the lower front panel and drain the emergency hose into a tray.', details: ['Unclip the flexible emergency drain hose.', 'Drain fully, then re-plug the hose.'], safetyNote: 'Water may release quickly — keep a bucket close.', highlightMarkerId: 'pump-filter' },
      { stepNumber: 3, title: 'Unscrew Filter & Inspect Chamber', subtitle: 'Identify the obstruction', description: 'Rotate the filter handle counter-clockwise and pull the cylinder out.', details: ['Shine a light inside the pump housing.', 'Check for coins, hairpins, or lint balls trapped near the impeller.'], safetyNote: 'Fractured impeller blades can be sharp; use gloves.', highlightMarkerId: 'pump-filter' },
      { stepNumber: 4, title: 'Clear Obstruction & Flush Filter', subtitle: 'Clean seating threads and O-ring', description: 'Remove debris and rinse the filter cylinder under warm water.', details: ['Inspect the rubber O-ring for cracks.', 'Re-insert and tighten until the seal mark aligns.'], safetyNote: 'Under-tightening will cause leaks on the next wash.', proTip: 'A dab of silicone grease on the O-ring eases future maintenance.', highlightMarkerId: 'pump-filter' },
      { stepNumber: 5, title: 'Re-power & Verification Cycle', subtitle: 'Confirm smooth pump operation', description: 'Close the panel, restore power and water, then run a short rinse/spin cycle.', details: ['Listen for a smooth hum without grinding.', 'Check the lower panel perimeter for moisture.'], safetyNote: 'Persistent grinding may indicate worn pump bearings.', proTip: 'Log this repair in your diagnosis history!', highlightMarkerId: 'pump-filter' },
    ],
    repairabilityBase: { partsAvailability: 88, repairComplexity: 65, costRatio: 92, productAccessibility: 83 },
    impactBase: { materialSavedKg: 26.4, co2SavedKg: 84.5, eWasteDivertedPercent: 100, waterSavedLiters: 420 },
    photoUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'appliances-fridge-cooling',
    category: 'Appliances',
    objectName: 'Double-Door Refrigerator',
    modelNumber: 'FR-450-FROST-FREE',
    keywords: ['fridge', 'refrigerator', 'cooling', 'freezer'],
    symptoms: [
      'Fridge compartment barely cool while freezer stays cold',
      'Condenser coils caked in thick dust on rear panel',
      'Compressor running continuously without cycling off',
    ],
    primaryIssue: {
      name: 'Condenser Coil Fouling & Restricted Airflow',
      confidence: 83,
      description:
        'Heavy dust and pet-hair buildup on the rear condenser coils is preventing adequate heat rejection, forcing the compressor to run near-continuously and starving the fridge compartment of cold air.',
      rootCause: 'Coils not cleaned in over 12 months, restricting convective airflow across the condenser fins.',
    },
    secondaryPossibilities: [
      { name: 'Evaporator Fan Motor Weak', confidence: 51, description: 'Reduced fan RPM limiting cold air circulation into the fridge compartment.', estimatedCost: '₹900 – ₹1,600' },
      { name: 'Door Gasket Seal Leak', confidence: 33, description: 'Worn door gasket allowing warm air infiltration.', estimatedCost: '₹500 – ₹1,000' },
    ],
    markers: [
      { id: 'condenser-coil', label: 'CONDENSER COIL', category: 'issue', x: 30, y: 78, width: 30, height: 18, title: 'Rear Condenser Coil Bank', description: 'Dense dust matting significantly reduces heat dissipation surface area.', status: 'critical', symptomDetected: 'Elevated coil surface temperature' },
      { id: 'compressor', label: 'COMPRESSOR UNIT', category: 'component', x: 68, y: 82, width: 22, height: 16, title: 'Reciprocating Compressor', description: 'Compressor windings and start relay test within nominal spec.', status: 'nominal' },
      { id: 'thermostat', label: 'THERMOSTAT SENSOR', category: 'sensor', x: 50, y: 30, width: 16, height: 14, title: 'Cabinet Thermostat', description: 'Sensor reading drifted 4°C above compartment setpoint.', status: 'warning', symptomDetected: 'Delayed compressor cutoff response' },
    ],
    repairCostRange: '₹200 – ₹500',
    replaceCost: '₹32,000',
    estimatedTime: '20 – 35 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Coil Cleaning Brush', spec: 'Long-handled, narrow bristle' },
      { name: 'Vacuum with Crevice Nozzle', spec: 'Debris removal' },
      { name: 'Flathead Screwdriver', spec: 'Rear access panel' },
    ],
    safetyWarnings: [
      'Unplug the refrigerator from the wall outlet before pulling it away from the wall.',
      'Allow the compressor housing to cool before touching if it has been running.',
    ],
    repairSteps: [
      { stepNumber: 1, title: 'Unplug & Access Rear Panel', subtitle: 'Isolate power before cleaning', description: 'Unplug the unit and carefully pull it away from the wall to expose the rear condenser coils.', details: ['Remove the lower rear access panel screws.', 'Note original screw positions for reassembly.'], safetyNote: 'Wait for the compressor to cool before handling.', highlightMarkerId: 'condenser-coil' },
      { stepNumber: 2, title: 'Brush & Vacuum the Condenser Coils', subtitle: 'Restore heat dissipation surface', description: 'Use the coil brush to loosen dust between fins, then vacuum thoroughly.', details: ['Work top to bottom in long strokes.', 'Vacuum the floor beneath the coil bank too.'], proTip: 'Repeat this every 6 months to prevent recurrence.', highlightMarkerId: 'condenser-coil' },
      { stepNumber: 3, title: 'Reassemble & Verify Cooling', subtitle: 'Confirm compressor cycling returns to normal', description: 'Reattach the panel, push the unit back, plug in, and monitor over the next few hours.', details: ['Fridge compartment should reach setpoint within 3–4 hours.', 'Compressor should cycle off periodically, not run continuously.'], highlightMarkerId: 'compressor' },
    ],
    repairabilityBase: { partsAvailability: 95, repairComplexity: 90, costRatio: 97, productAccessibility: 78 },
    impactBase: { materialSavedKg: 38.0, co2SavedKg: 210.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-fridge/1600/1000',
  },

  // ───────────────────────────── ELECTRONICS ─────────────────────────────
  {
    key: 'electronics-laptop-thermal',
    category: 'Electronics',
    objectName: 'Pro Performance Laptop (15-inch)',
    modelNumber: 'XPS-PRO-15',
    keywords: ['laptop', 'notebook', 'thermal', 'fan', 'overheat'],
    symptoms: [
      'Thermal throttling under moderate CPU loads',
      'Fan spinning at maximum RPM continuously',
      'Bottom aluminum casing hot to the touch',
    ],
    primaryIssue: {
      name: 'Thermal Paste Desiccation & Dust Accumulation',
      confidence: 91,
      description:
        'Factory thermal compound has degraded into a dry crust, and the dual radial blower heatsink fins are blocked by a fibrous dust mat, both severely limiting heat transfer away from the CPU/GPU die.',
      rootCause: '3+ years of operation without thermal paste re-application.',
    },
    secondaryPossibilities: [
      { name: 'Cooling Fan Bearing Drag', confidence: 64, description: 'One fan experiencing friction resistance, reducing airflow.', estimatedCost: '₹800 – ₹1,400' },
      { name: 'Heatpipe Vapor Chamber Depressurization', confidence: 22, description: 'Physical micro-crack in the copper heatpipe.', estimatedCost: '₹2,500 – ₹3,800' },
    ],
    markers: [
      { id: 'cpu-gpu-die', label: 'CPU / GPU THERMAL DIE', category: 'issue', x: 42, y: 38, width: 22, height: 22, title: 'Processor Thermal Interface', description: 'Thermal delta exceeds 45°C between silicon die and copper heatpipe.', status: 'critical', symptomDetected: 'Dry compound void areas' },
      { id: 'fan-assembly', label: 'DUAL RADIAL FANS', category: 'component', x: 20, y: 30, width: 18, height: 28, title: 'Blower Exhaust Fins', description: 'Exhaust grill fin pitch partially restricted by dust lint.', status: 'warning' },
    ],
    repairCostRange: '₹450 – ₹900',
    replaceCost: '₹65,000',
    estimatedTime: '25 – 40 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Torx T5 & Phillips #00 Screwdrivers', spec: 'Precision electronics bit' },
      { name: 'Isopropanol 99% & Microfiber', spec: 'Thermal clean' },
      { name: 'High-Performance Thermal Compound', spec: 'e.g. Arctic MX-6 / Noctua NT-H2' },
      { name: 'Plastic Spudger / Pry Tool', spec: 'Safety clip release' },
    ],
    safetyWarnings: [
      'ALWAYS disconnect the internal battery connector before touching motherboard circuits.',
      'Use an ESD wrist strap or touch a grounded metal surface before handling the PCB.',
    ],
    repairSteps: [
      { stepNumber: 1, title: 'Remove Chassis Screws & Disconnect Battery', subtitle: 'De-energize the motherboard', description: 'Unscrew the perimeter screws and pop the bottom panel with a plastic spudger.', details: ['Store screws sorted by length.', 'Slide the battery connector straight out.', 'Hold the power button for 5 seconds to drain residual charge.'] },
      { stepNumber: 2, title: 'Remove Heatsink & Clean Old Paste', subtitle: 'Expose the CPU and GPU dies', description: 'Loosen the captive heatsink screws in reverse numerical order and lift the assembly off.', details: ['Dissolve the crusty paste with isopropyl alcohol.', 'Polish the copper contact plate to a mirror finish.'] },
      { stepNumber: 3, title: 'Repaste & Blow Out Fan Fins', subtitle: 'Restore full thermal transfer', description: 'Apply a pea-sized dot of thermal paste to the CPU and a thin line to the GPU, then blow dust from the fans.', details: ['Hold fan blades still while blowing compressed air.', 'Re-torque the heatsink screws in the correct pattern.'] },
    ],
    repairabilityBase: { partsAvailability: 92, repairComplexity: 78, costRatio: 96, productAccessibility: 70 },
    impactBase: { materialSavedKg: 2.1, co2SavedKg: 310.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'electronics-phone-battery',
    category: 'Electronics',
    objectName: 'Smartphone',
    modelNumber: 'Flagship Model (2022)',
    keywords: ['phone', 'smartphone', 'mobile', 'battery', 'charging'],
    symptoms: [
      'Rear panel visibly bulging near the camera module',
      'Battery percentage drops rapidly under light use',
      'Phone will not stay powered on when unplugged',
    ],
    primaryIssue: {
      name: 'Swollen Lithium-Ion Battery Cell',
      confidence: 89,
      description:
        'The battery has entered a degraded swelling state from repeated full-discharge cycles and age, pushing against the rear panel and screen assembly and causing unstable power delivery.',
      rootCause: 'Cumulative charge-cycle wear (500+ cycles) accelerating electrolyte gas buildup inside the cell.',
    },
    secondaryPossibilities: [
      { name: 'Charging Port Dust/Lint Blockage', confidence: 40, description: 'USB-C port contacts obstructed, causing intermittent charge connection.', estimatedCost: '₹0 – ₹200' },
      { name: 'Charging IC Failure', confidence: 18, description: 'Power management chip failing to regulate charge current.', estimatedCost: '₹1,800 – ₹2,800' },
    ],
    markers: [
      { id: 'battery-cell', label: 'BATTERY CELL', category: 'issue', x: 50, y: 55, width: 34, height: 40, title: 'Lithium-Ion Battery Pack', description: 'Visible pillowing deformation detected against rear housing.', status: 'critical', symptomDetected: 'Rear panel gap > 1.5mm' },
      { id: 'charging-port', label: 'USB-C CHARGE PORT', category: 'component', x: 50, y: 92, width: 16, height: 10, title: 'Charging Port Assembly', description: 'Port contacts test clean; no corrosion detected.', status: 'nominal' },
    ],
    repairCostRange: '₹1,500 – ₹2,800',
    replaceCost: '₹55,000',
    estimatedTime: '30 – 45 min',
    difficulty: 'Advanced',
    toolsRequired: [
      { name: 'Suction Cup & Plastic Opening Picks', spec: 'Screen removal' },
      { name: 'Pentalobe & Phillips #00 Driver Set', spec: 'Precision fasteners' },
      { name: 'Battery Adhesive Strips', spec: 'OEM replacement adhesive' },
      { name: 'Replacement Battery Cell', spec: 'OEM capacity match' },
    ],
    safetyWarnings: [
      'A swollen lithium battery is a fire risk — do not puncture, bend, or apply heat to the cell.',
      'Work on a fire-resistant, non-conductive surface and keep a Class D extinguisher nearby.',
      'If the swelling is severe, professional replacement is strongly recommended over DIY.',
    ],
    repairSteps: [
      { stepNumber: 1, title: 'Power Off & Heat-Soften Screen Adhesive', subtitle: 'Prepare for careful disassembly', description: 'Power the device fully off and gently warm the screen edges to soften the adhesive seal.', details: ['Use a low, even heat source — avoid concentrated hot spots.', 'Apply the suction cup near the bottom edge.'], safetyNote: 'Never pry near the battery — a punctured cell can ignite.' },
      { stepNumber: 2, title: 'Lift Screen & Disconnect Battery Connector', subtitle: 'Cut power to the pack immediately', description: 'Carefully lift the screen on its hinge and disconnect the battery ribbon connector first.', details: ['Use a plastic pick, never metal, near the cell.', 'Set the screen aside on a soft surface.'], safetyNote: 'Disconnecting power first prevents shorts during further work.' },
      { stepNumber: 3, title: 'Remove Swollen Cell & Install Replacement', subtitle: 'Handle the old cell with care', description: 'Gently pull the adhesive release tabs to free the swollen battery, then seat and adhere the new cell.', details: ['If a pull-tab snaps, stop and consult a professional rather than prying.', 'Reconnect the battery ribbon before closing the screen.'], safetyNote: 'Do not bend or compress the old battery when removing it.' },
    ],
    repairabilityBase: { partsAvailability: 80, repairComplexity: 45, costRatio: 94, productAccessibility: 55 },
    impactBase: { materialSavedKg: 0.4, co2SavedKg: 55.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-phone/1600/1000',
  },

  // ───────────────────────────── BICYCLES ─────────────────────────────
  {
    key: 'bicycles-drivetrain-index',
    category: 'Bicycles',
    objectName: 'Mountain / Commuter Bicycle Drivetrain',
    modelNumber: 'Shimano Deore 10-Speed Setup',
    keywords: ['bike', 'bicycle', 'cycle', 'chain', 'gear', 'derailleur'],
    symptoms: [
      'Chain skips under high pedal torque on 4th & 5th cogs',
      'Sluggish downshifting response',
      'Clicking noise from the rear derailleur jockey wheel',
    ],
    primaryIssue: {
      name: 'Shift Cable Tension Slack & Derailleur Alignment',
      confidence: 94,
      description: 'Cable stretch over time has caused indexing misalignment between shifter clicks and cassette cog spacing.',
      rootCause: 'Normal steel cable bedding-in and slight limit-screw drift.',
    },
    secondaryPossibilities: [
      { name: 'Cassette Cog Tooth Wear', confidence: 45, description: 'Excessive wear on middle cogs due to an unlubricated chain.', estimatedCost: '₹1,200 – ₹2,000' },
      { name: 'Stiff Chain Link Pin', confidence: 38, description: 'A single tight chain link preventing smooth articulation over the jockey pulley.', estimatedCost: '₹0 (manual flex)' },
    ],
    markers: [
      { id: 'derailleur-cable', label: 'DERAILLEUR CABLE & BARREL', category: 'issue', x: 75, y: 65, width: 18, height: 22, title: 'Indexing Cable Adjuster', description: 'Cable tension insufficient by roughly 1.5 full barrel turns.', status: 'critical' },
      { id: 'chain', label: 'DRIVE CHAIN', category: 'component', x: 50, y: 70, width: 20, height: 12, title: 'Roller Chain', description: 'Chain elongation within acceptable wear-gauge tolerance.', status: 'nominal' },
    ],
    repairCostRange: '₹150 – ₹400',
    replaceCost: '₹22,000',
    estimatedTime: '15 – 25 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Hex Allen Wrench (4mm / 5mm)', spec: 'Standard bike multitool' },
      { name: 'Chain Degreaser & Dry Lube', spec: 'Teflon dripless lube' },
      { name: 'Clean Rag', spec: 'Chain wipe down' },
    ],
    safetyWarnings: ['Keep fingers clear of the turning chain and rear wheel spokes while spinning pedals by hand.'],
    repairSteps: [
      { stepNumber: 1, title: 'Turn the Barrel Adjuster', subtitle: 'Increase cable tension incrementally', description: 'Elevate the rear wheel and turn the barrel adjuster counter-clockwise in half turns while spinning the pedals.', details: ['Listen for a smooth snap into each gear.', 'Confirm the jockey pulley lines up with each cog.'], highlightMarkerId: 'derailleur-cable' },
      { stepNumber: 2, title: 'Degrease & Lubricate the Chain', subtitle: 'Reduce friction across the drivetrain', description: 'Wipe the chain with degreaser, dry it, then apply lube one drop per link.', details: ['Backpedal while applying lube for even coverage.', 'Wipe off excess to avoid attracting grit.'], highlightMarkerId: 'chain' },
    ],
    repairabilityBase: { partsAvailability: 98, repairComplexity: 85, costRatio: 98, productAccessibility: 95 },
    impactBase: { materialSavedKg: 14.2, co2SavedKg: 58.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'bicycles-brake-pad-wear',
    category: 'Bicycles',
    objectName: 'Bicycle Disc Brake System',
    modelNumber: 'Hydraulic Disc Brake Set',
    keywords: ['brake', 'pad', 'tire', 'tyre', 'wheel', 'rim'],
    symptoms: [
      'High-pitched squealing when braking downhill',
      'Reduced stopping power in wet conditions',
      'Visible metal-on-metal scoring on the rotor',
    ],
    primaryIssue: {
      name: 'Worn Brake Pads Past Minimum Thickness',
      confidence: 90,
      description: 'Front brake pads have worn down to their backing plate, causing metal-to-metal contact with the rotor and severely reduced stopping power.',
      rootCause: 'Extended use without periodic pad-thickness inspection, accelerated by wet/gritty riding conditions.',
    },
    secondaryPossibilities: [
      { name: 'Rotor Warping', confidence: 42, description: 'Heat-induced rotor warp causing pulsing brake feel.', estimatedCost: '₹800 – ₹1,500' },
      { name: 'Air in Hydraulic Line', confidence: 25, description: 'Spongy lever feel from trapped air requiring a bleed.', estimatedCost: '₹400 – ₹700' },
    ],
    markers: [
      { id: 'brake-pad', label: 'BRAKE PAD ASSEMBLY', category: 'issue', x: 40, y: 50, width: 20, height: 18, title: 'Front Disc Brake Caliper', description: 'Pad material worn below 1mm minimum thickness.', status: 'critical', symptomDetected: 'Metallic contact scoring on rotor' },
      { id: 'rotor', label: 'BRAKE ROTOR', category: 'component', x: 65, y: 55, width: 22, height: 22, title: 'Disc Rotor', description: 'Rotor surface shows light scoring but is within re-usable spec.', status: 'warning' },
    ],
    repairCostRange: '₹300 – ₹700',
    replaceCost: '₹22,000',
    estimatedTime: '20 – 30 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Hex Allen Wrench Set', spec: '2mm – 6mm' },
      { name: 'Replacement Brake Pads', spec: 'OEM or compatible compound' },
      { name: 'Isopropyl Alcohol', spec: 'Rotor degreasing' },
      { name: 'Pad Spreader / Flat Tool', spec: 'Piston retraction' },
    ],
    safetyWarnings: ['Never operate the brake lever with the pads removed — the pistons can pop out.', 'Do not touch rotor or pad surfaces with bare skin; oils reduce braking friction.'],
    repairSteps: [
      { stepNumber: 1, title: 'Remove the Wheel & Old Pads', subtitle: 'Access the caliper', description: 'Remove the wheel, then slide out the pad retaining pin and lift the worn pads free.', details: ['Note the orientation of the pad spring clip.', 'Inspect the pistons for even retraction.'], highlightMarkerId: 'brake-pad' },
      { stepNumber: 2, title: 'Retract Pistons & Install New Pads', subtitle: 'Make room for full-thickness pads', description: 'Use a spreader tool to gently push the pistons back, then insert the new pads and spring clip.', details: ['Reinsert the retaining pin and secure it.', 'Wipe the rotor clean of any fingerprints with alcohol.'], highlightMarkerId: 'rotor' },
      { stepNumber: 3, title: 'Reinstall Wheel & Bed In', subtitle: 'Seat the new pads properly', description: 'Reinstall the wheel and perform 10-15 gentle stops from low speed to bed in the new pads.', details: ['Avoid one hard, prolonged stop which can glaze new pads.'], proTip: 'Squeaking usually disappears after the bed-in process.' },
    ],
    repairabilityBase: { partsAvailability: 96, repairComplexity: 88, costRatio: 97, productAccessibility: 92 },
    impactBase: { materialSavedKg: 12.6, co2SavedKg: 54.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-bike-brake/1600/1000',
  },

  // ───────────────────────────── TOOLS ─────────────────────────────
  {
    key: 'tools-drill-brushes',
    category: 'Tools',
    objectName: '18V Cordless Rotary Hammer Drill',
    modelNumber: 'HD-18V-BRUSHLESS',
    keywords: ['drill', 'driver', 'cordless'],
    symptoms: [
      'Intermittent motor rotation under load',
      'Visible electrical arcing sparks inside ventilation slots',
      'Burning ozone odor during heavy drilling',
    ],
    primaryIssue: {
      name: 'Worn Motor Carbon Brushes & Commutator Oxidation',
      confidence: 89,
      description: 'Carbon block brushes have worn down to their minimum wear indicator, reducing spring contact force against the copper commutator segments.',
      rootCause: 'Friction consumption over 500+ hours of masonry drilling duty.',
    },
    secondaryPossibilities: [
      { name: 'Trigger Variable Switch Contact Pit', confidence: 42, description: 'Internal trigger contact pitting causing intermittent power.', estimatedCost: '₹600 – ₹1,100' },
    ],
    markers: [
      { id: 'carbon-brush', label: 'MOTOR CARBON BRUSH HOUSING', category: 'issue', x: 52, y: 40, width: 20, height: 20, title: 'Brush Holder Assembly', description: 'Brush spring pressure low; both carbon blocks need replacement.', status: 'critical' },
    ],
    repairCostRange: '₹350 – ₹700',
    replaceCost: '₹8,500',
    estimatedTime: '20 – 30 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Flathead / Phillips Screwdriver Set', spec: 'Casing access' },
      { name: 'Replacement Carbon Brush Pair', spec: 'OEM matching spec' },
    ],
    safetyWarnings: ['Remove the battery pack BEFORE unscrewing the tool housing.'],
    repairSteps: [
      { stepNumber: 1, title: 'Remove Battery & Unscrew Rear Motor Cap', subtitle: 'Access internal brush holders', description: 'Remove the battery pack, then unscrew the rear cap screws to reveal the copper spring brush clips.', details: ['Pop out the spring clip and lift the old carbon block out.', 'Insert the new carbon brush into the brass guide sleeve.'] },
      { stepNumber: 2, title: 'Reassemble & Test Under Load', subtitle: 'Confirm smooth commutation', description: 'Reinstall the rear cap and battery, then run the drill briefly under light load.', details: ['Watch for arcing through the ventilation slots.', 'Motor should spin smoothly with no odor.'] },
    ],
    repairabilityBase: { partsAvailability: 85, repairComplexity: 72, costRatio: 90, productAccessibility: 88 },
    impactBase: { materialSavedKg: 3.8, co2SavedKg: 42.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1600&auto=format&fit=crop',
  },
  {
    key: 'tools-grinder-switch',
    category: 'Tools',
    objectName: 'Angle Grinder',
    modelNumber: '4.5-inch Corded Angle Grinder',
    keywords: ['grinder', 'angle', 'saw', 'cutter'],
    symptoms: [
      'Trigger switch feels loose and sometimes fails to start the motor',
      'Grinder occasionally cuts out mid-use',
      'Slight burning smell near the switch housing',
    ],
    primaryIssue: {
      name: 'Worn Trigger Switch Contacts',
      confidence: 85,
      description: 'The paddle switch internal contacts have pitted from years of dust ingress and arcing, causing intermittent power delivery to the motor.',
      rootCause: 'Abrasive dust intrusion into a non-sealed switch housing over extended use.',
    },
    secondaryPossibilities: [
      { name: 'Power Cord Strain Relief Fatigue', confidence: 30, description: 'Internal cord conductor fatigue near the strain relief grommet.', estimatedCost: '₹150 – ₹350' },
    ],
    markers: [
      { id: 'trigger-switch', label: 'TRIGGER SWITCH HOUSING', category: 'issue', x: 55, y: 60, width: 18, height: 16, title: 'Paddle Switch Assembly', description: 'Contact pitting detected; intermittent continuity under load.', status: 'critical' },
      { id: 'motor-body', label: 'MOTOR BODY', category: 'component', x: 35, y: 35, width: 24, height: 24, title: 'Universal Motor', description: 'Brushes and windings test within normal range.', status: 'nominal' },
    ],
    repairCostRange: '₹250 – ₹500',
    replaceCost: '₹3,200',
    estimatedTime: '15 – 25 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Phillips Screwdriver Set', spec: 'Casing access' },
      { name: 'Replacement Paddle Switch', spec: 'OEM matching spec' },
      { name: 'Multimeter', spec: 'Continuity testing' },
    ],
    safetyWarnings: ['Unplug the grinder from mains power before opening the housing.', 'Verify with a multimeter that no residual charge remains before handling internals.'],
    repairSteps: [
      { stepNumber: 1, title: 'Unplug & Open the Housing', subtitle: 'Isolate power first', description: 'Unplug the grinder and remove the housing screws to expose the switch wiring.', details: ['Photograph wire positions before disconnecting anything.'], safetyNote: 'Never work on a grinder that is still plugged in.', highlightMarkerId: 'trigger-switch' },
      { stepNumber: 2, title: 'Test & Replace the Switch', subtitle: 'Confirm the fault with a multimeter', description: 'Test switch continuity, then swap in the replacement paddle switch using the same wire positions.', details: ['Match wire colors and terminals exactly.', 'Reassemble the housing and reinstall screws.'], highlightMarkerId: 'trigger-switch' },
    ],
    repairabilityBase: { partsAvailability: 78, repairComplexity: 68, costRatio: 92, productAccessibility: 80 },
    impactBase: { materialSavedKg: 1.6, co2SavedKg: 18.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-grinder/1600/1000',
  },

  // ───────────────────────────── MECHANICAL ─────────────────────────────
  {
    key: 'mechanical-mower-wont-start',
    category: 'Mechanical',
    objectName: 'Push Lawn Mower',
    modelNumber: '4-Stroke Petrol Push Mower',
    keywords: ['mower', 'lawn', 'engine', 'petrol', 'gas'],
    symptoms: [
      'Engine will not start after several pull-cord attempts',
      'Fuel smells stale and slightly varnished',
      'Spark plug tip appears dry and clean',
    ],
    primaryIssue: {
      name: 'Stale Fuel & Clogged Carburetor Jet',
      confidence: 86,
      description: 'Fuel left in the tank over winter has degraded and gummed the small carburetor jet, preventing proper fuel-air mixture delivery to the cylinder.',
      rootCause: 'Ethanol-blended fuel left stored for 3+ months without a stabilizer.',
    },
    secondaryPossibilities: [
      { name: 'Fouled Spark Plug', confidence: 55, description: 'Carbon-fouled plug failing to produce a consistent spark.', estimatedCost: '₹100 – ₹250' },
      { name: 'Clogged Air Filter', confidence: 35, description: 'Restricted airflow starving the engine of oxygen.', estimatedCost: '₹150 – ₹300' },
    ],
    markers: [
      { id: 'carburetor', label: 'CARBURETOR ASSEMBLY', category: 'issue', x: 45, y: 50, width: 20, height: 18, title: 'Carburetor Jet & Bowl', description: 'Gummed residue detected inside the main fuel jet.', status: 'critical' },
      { id: 'spark-plug', label: 'SPARK PLUG', category: 'component', x: 65, y: 35, width: 12, height: 14, title: 'Ignition Spark Plug', description: 'Electrode gap and spark quality within normal range.', status: 'nominal' },
    ],
    repairCostRange: '₹300 – ₹600',
    replaceCost: '₹9,500',
    estimatedTime: '30 – 45 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Socket Wrench Set', spec: 'Carburetor bowl bolt' },
      { name: 'Carburetor Cleaner Spray', spec: 'Jet & passage flush' },
      { name: 'Fresh Fuel & Stabilizer', spec: 'Ethanol-safe blend' },
      { name: 'Small Wire / Needle', spec: 'Jet passage clearing' },
    ],
    safetyWarnings: ['Disconnect the spark plug wire before doing any work near the blade or fuel system.', 'Work in a well-ventilated area away from open flame when handling fuel.'],
    repairSteps: [
      { stepNumber: 1, title: 'Drain Stale Fuel', subtitle: 'Remove degraded fuel from the tank', description: 'Disconnect the spark plug wire, then drain the old fuel into an approved container.', details: ['Do not pour old fuel down a drain.'], safetyNote: 'Keep all ignition sources away from the fuel.', highlightMarkerId: 'carburetor' },
      { stepNumber: 2, title: 'Remove & Clean the Carburetor Bowl', subtitle: 'Clear the gummed jet', description: 'Unbolt the float bowl, remove the jet, and spray carburetor cleaner through each passage.', details: ['Use a fine wire to clear any stubborn blockage in the jet orifice.', 'Do not enlarge the jet hole.'], highlightMarkerId: 'carburetor' },
      { stepNumber: 3, title: 'Reassemble & Refuel with Fresh Fuel', subtitle: 'Restart and verify smooth idle', description: 'Reinstall the bowl and jet, add fresh stabilized fuel, reconnect the spark plug, and attempt to start.', details: ['Prime the carburetor bulb if equipped.', 'Engine should catch within 2-3 pulls.'], proTip: 'Add fuel stabilizer whenever storing for more than a month.' },
    ],
    repairabilityBase: { partsAvailability: 82, repairComplexity: 70, costRatio: 94, productAccessibility: 75 },
    impactBase: { materialSavedKg: 9.5, co2SavedKg: 46.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-mower/1600/1000',
  },
  {
    key: 'mechanical-pressure-washer-pump',
    category: 'Mechanical',
    objectName: 'Electric Pressure Washer',
    modelNumber: '135-Bar Electric Pressure Washer',
    keywords: ['pressure', 'washer', 'power washer', 'pump'],
    symptoms: [
      'Pressure fluctuates sharply instead of a steady stream',
      'Visible water weeping from the pump housing seam',
      'Motor runs but output pressure is noticeably weak',
    ],
    primaryIssue: {
      name: 'Worn Pump Inlet Valve & Seal Wear',
      confidence: 80,
      description: 'The pump inlet check valve and piston seals have worn enough to let pressure bleed back on each stroke, producing pulsing output and a slow external leak.',
      rootCause: 'Normal wear on rubber seal components after extended seasonal use.',
    },
    secondaryPossibilities: [
      { name: 'Clogged Inlet Water Filter', confidence: 48, description: 'Debris restricting water intake before the pump.', estimatedCost: '₹0 – ₹150' },
      { name: 'Nozzle Tip Wear', confidence: 30, description: 'Enlarged nozzle orifice reducing pressure at the wand.', estimatedCost: '₹200 – ₹400' },
    ],
    markers: [
      { id: 'pump-seal', label: 'PUMP SEAL ASSEMBLY', category: 'issue', x: 48, y: 55, width: 22, height: 18, title: 'Piston Seal & Inlet Valve', description: 'Seal wear visible at the housing seam with active weeping.', status: 'critical' },
      { id: 'inlet-filter', label: 'INLET WATER FILTER', category: 'sensor', x: 22, y: 40, width: 12, height: 12, title: 'Inlet Screen Filter', description: 'Minor sediment present but flow is largely unobstructed.', status: 'warning' },
    ],
    repairCostRange: '₹500 – ₹1,100',
    replaceCost: '₹11,000',
    estimatedTime: '35 – 50 min',
    difficulty: 'Moderate',
    toolsRequired: [
      { name: 'Socket & Wrench Set', spec: 'Pump housing bolts' },
      { name: 'Pump Seal Rebuild Kit', spec: 'OEM matching spec' },
      { name: 'Silicone Grease', spec: 'Seal lubrication on install' },
    ],
    safetyWarnings: ['Unplug the unit and release residual pressure by pulling the trigger before disassembly.', 'Never point the pump housing opening toward your face while inspecting.'],
    repairSteps: [
      { stepNumber: 1, title: 'Depressurize & Remove Pump Cover', subtitle: 'Safely relieve trapped pressure', description: 'Unplug the washer, squeeze the trigger to bleed residual pressure, then unbolt the pump cover.', details: ['Have a shallow tray ready to catch residual water.'], safetyNote: 'Trapped pressure can cause a sudden water jet — bleed it first.', highlightMarkerId: 'pump-seal' },
      { stepNumber: 2, title: 'Replace Seals & Inlet Valve', subtitle: 'Install the rebuild kit', description: 'Remove the worn seals and inlet valve, lightly grease the new ones, and seat them in the housing.', details: ['Ensure the valve orientation matches the original.', 'Torque the housing bolts evenly in a criss-cross pattern.'], highlightMarkerId: 'pump-seal' },
      { stepNumber: 3, title: 'Reassemble & Pressure Test', subtitle: 'Confirm steady, leak-free output', description: 'Reconnect the water supply, run the unit, and check for steady pressure with no weeping at the seam.', details: ['Watch the seam for the first minute of operation.'] },
    ],
    repairabilityBase: { partsAvailability: 75, repairComplexity: 60, costRatio: 88, productAccessibility: 70 },
    impactBase: { materialSavedKg: 6.2, co2SavedKg: 33.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-pressure-washer/1600/1000',
  },

  // ───────────────────────────── FURNITURE ─────────────────────────────
  {
    key: 'furniture-chair-wobble',
    category: 'Furniture',
    objectName: 'Wooden Dining Chair',
    modelNumber: 'Solid Wood Dining Chair',
    keywords: ['chair', 'wobbly', 'joint', 'wood', 'seat'],
    symptoms: [
      'Chair rocks noticeably when weight shifts side to side',
      'Audible creaking from the front leg joints',
      'Visible gap where the leg meets the seat frame',
    ],
    primaryIssue: {
      name: 'Loosened Mortise & Tenon Leg Joint',
      confidence: 88,
      description: 'The glued mortise-and-tenon joint connecting the front leg to the seat frame has loosened, letting the leg flex slightly under load and creating the wobble and creak.',
      rootCause: 'Original wood glue has dried and cracked from repeated humidity and load cycles over years of use.',
    },
    secondaryPossibilities: [
      { name: 'Split Seat Rail', confidence: 25, description: 'A hairline split in the seat rail near the joint.', estimatedCost: '₹200 – ₹500' },
      { name: 'Worn Leg Foot Levelers', confidence: 20, description: 'Uneven floor contact from worn plastic foot glides.', estimatedCost: '₹50 – ₹150' },
    ],
    markers: [
      { id: 'leg-joint', label: 'LEG-TO-SEAT JOINT', category: 'issue', x: 30, y: 60, width: 20, height: 24, title: 'Mortise & Tenon Joint', description: 'Visible gap and glue failure detected at the joint interface.', status: 'critical' },
      { id: 'seat-frame', label: 'SEAT FRAME', category: 'component', x: 55, y: 35, width: 30, height: 16, title: 'Seat Support Frame', description: 'Frame structure is sound with no cracking detected.', status: 'nominal' },
    ],
    repairCostRange: '₹100 – ₹300',
    replaceCost: '₹4,500',
    estimatedTime: '30 – 40 min (plus clamp drying time)',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Wood Glue (PVA)', spec: 'Interior furniture grade' },
      { name: 'Bar or Strap Clamps', spec: 'Even joint pressure' },
      { name: 'Small Wood Chisel', spec: 'Old glue removal' },
      { name: 'Clean Cloth', spec: 'Excess glue wipe-off' },
    ],
    safetyWarnings: ['Do not sit on the chair until the glue has fully cured (typically 24 hours).'],
    repairSteps: [
      { stepNumber: 1, title: 'Disassemble & Clean the Joint', subtitle: 'Remove old, failed glue', description: 'Gently work the leg free from the joint and scrape out old dried glue with a chisel.', details: ['Work slowly to avoid splintering the tenon.', 'Dry-fit the joint to confirm it still seats snugly.'], highlightMarkerId: 'leg-joint' },
      { stepNumber: 2, title: 'Apply Glue & Clamp', subtitle: 'Rebuild a strong bond', description: 'Apply wood glue evenly inside the mortise and on the tenon, reseat the leg, and clamp firmly.', details: ['Wipe away squeeze-out glue immediately with a damp cloth.', 'Check the chair sits level while the glue is still wet.'], safetyNote: 'Let the joint cure undisturbed for the full clamp time.', highlightMarkerId: 'leg-joint' },
      { stepNumber: 3, title: 'Cure & Test', subtitle: 'Confirm a solid, wobble-free joint', description: 'Leave clamped for the glue\'s full cure time, then remove clamps and test for wobble.', details: ['Rock the chair gently by hand before sitting on it.'], proTip: 'A cured PVA joint is often stronger than the surrounding wood.' },
    ],
    repairabilityBase: { partsAvailability: 100, repairComplexity: 82, costRatio: 96, productAccessibility: 90 },
    impactBase: { materialSavedKg: 7.0, co2SavedKg: 15.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-chair/1600/1000',
  },
  {
    key: 'furniture-drawer-slide',
    category: 'Furniture',
    objectName: 'Chest of Drawers',
    modelNumber: '5-Drawer Dresser',
    keywords: ['drawer', 'dresser', 'cabinet', 'slide'],
    symptoms: [
      'Drawer sticks and requires force to open or close',
      'Drawer sits crooked, lower on one side',
      'Scraping sound along the cabinet side panel',
    ],
    primaryIssue: {
      name: 'Misaligned or Worn Drawer Slide Track',
      confidence: 84,
      description: 'The drawer\'s side-mounted slide track has loosened from the cabinet frame, dropping the drawer slightly out of alignment and causing it to bind against the frame.',
      rootCause: 'Mounting screws worked loose over time from repeated opening and closing.',
    },
    secondaryPossibilities: [
      { name: 'Swollen Wood from Humidity', confidence: 35, description: 'Drawer sides have absorbed moisture and expanded slightly.', estimatedCost: '₹0 – ₹100' },
      { name: 'Broken Slide Roller Wheel', confidence: 22, description: 'A plastic roller wheel on the slide track has cracked.', estimatedCost: '₹150 – ₹350' },
    ],
    markers: [
      { id: 'slide-track', label: 'DRAWER SLIDE TRACK', category: 'issue', x: 68, y: 55, width: 20, height: 16, title: 'Side-Mount Slide Rail', description: 'Mounting screws backed out roughly 4-5mm from the frame.', status: 'critical' },
      { id: 'drawer-box', label: 'DRAWER BOX', category: 'component', x: 40, y: 40, width: 30, height: 20, title: 'Drawer Box Structure', description: 'Joinery is intact with no visible cracking.', status: 'nominal' },
    ],
    repairCostRange: '₹0 – ₹250',
    replaceCost: '₹9,000',
    estimatedTime: '15 – 20 min',
    difficulty: 'Easy',
    toolsRequired: [
      { name: 'Phillips Screwdriver', spec: 'Slide mounting screws' },
      { name: 'Wood Filler & Toothpicks', spec: 'Stripped screw hole repair' },
      { name: 'Silicone or Paraffin Wax', spec: 'Slide lubrication' },
    ],
    safetyWarnings: ['Fully empty the drawer before removing it to avoid dropped-item injury.'],
    repairSteps: [
      { stepNumber: 1, title: 'Remove the Drawer & Inspect the Track', subtitle: 'Locate the loose mounting points', description: 'Lift the drawer free of the track and check each mounting screw for looseness or stripped holes.', details: ['Tighten any screws that still bite into solid wood.', 'For a stripped hole, pack it with wood filler or toothpicks and glue before re-driving the screw.'], highlightMarkerId: 'slide-track' },
      { stepNumber: 2, title: 'Realign & Re-secure the Track', subtitle: 'Restore level, parallel travel', description: 'Hold the track level and square to the frame while re-driving the screws snugly.', details: ['Check both tracks are parallel by measuring front and back.'], highlightMarkerId: 'slide-track' },
      { stepNumber: 3, title: 'Lubricate & Test', subtitle: 'Confirm smooth glide', description: 'Rub a candle wax or silicone lubricant along the slide contact points and reinsert the drawer.', details: ['Drawer should open and close smoothly with no scraping.'], proTip: 'Paraffin wax works as well as silicone spray and lasts for months.' },
    ],
    repairabilityBase: { partsAvailability: 90, repairComplexity: 92, costRatio: 99, productAccessibility: 93 },
    impactBase: { materialSavedKg: 11.0, co2SavedKg: 20.0, eWasteDivertedPercent: 100 },
    photoUrl: 'https://picsum.photos/seed/rbr-drawer/1600/1000',
  },
];

export const CATEGORIES: DiagnosticCategory[] = [
  'Appliances',
  'Electronics',
  'Bicycles',
  'Tools',
  'Mechanical',
  'Furniture',
];
