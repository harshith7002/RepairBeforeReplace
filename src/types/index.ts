export interface ComponentMarker {
  id: string;
  label: string;
  category: 'issue' | 'component' | 'sensor' | 'normal';
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width?: number; // percentage width
  height?: number; // percentage height
  title: string;
  description: string;
  status: 'critical' | 'warning' | 'nominal';
  symptomDetected?: string;
}

export interface SecondaryPossibility {
  name: string;
  confidence: number; // percentage (0-100)
  description: string;
  estimatedCost: string;
}

export interface RepairabilityBreakdown {
  partsAvailability: number; // 0-100
  repairComplexity: number;  // 0-100 (higher = easier/better)
  costRatio: number;         // 0-100 (higher = savings ratio)
  productAccessibility: number; // 0-100
  totalScore: number;        // 0-100
  verdict: string;
}

export interface RepairStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  safetyNote?: string;
  proTip?: string;
  imageUrl: string;
  highlightMarkerId?: string;
}

export interface ImpactMetrics {
  materialSavedKg: number;
  co2SavedKg: number;
  eWasteDivertedPercent: number;
  waterSavedLiters?: number;
}

export interface DiagnosticItem {
  id: string;
  name: string;
  category: 'Appliances' | 'Electronics' | 'Bicycles' | 'Tools' | 'Mechanical' | 'Furniture';
  modelNumber: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  annotatedImageUrl?: string;
  symptoms: string[];
  repairability: RepairabilityBreakdown;
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
  potentialSavings: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced' | 'Professional Recommended';
  toolsRequired: { name: string; icon?: string; spec?: string }[];
  safetyWarnings: string[];
  repairSteps: RepairStep[];
  impact: ImpactMetrics;
  diagnosedDate: string;
}
