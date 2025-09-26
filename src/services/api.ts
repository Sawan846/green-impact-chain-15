// API service with mock data fallback
import {
  mockInputs,
  mockResults,
  mockScenarios,
  mockBlockchainLog,
  mockEnvironmentalMetrics,
  mockLCCInputs,
  mockLCCResults,
  mockLCCPredictions,
} from "./mockData";

// Types for API responses
export interface LCAInputs {
  year: string;
  scenarioId: string;
  processBoundary: string;
  materials: Record<string, number>;
  energy: Record<string, number>;
  resources: Record<string, number>;
  dataSources?: {
    materials: Record<string, 'user' | 'ai'>;
    energy: Record<string, 'user' | 'ai'>;
    resources: Record<string, 'user' | 'ai'>;
  };
}

export interface LCAResults {
  emissions: {
    CO2_kg_total: number;
    CO2_by_process: Record<string, number>;
    NOx_kg: number;
    SO2_kg: number;
    CF4_kg: number;
    PAH_g: number;
    NMVOC_kg: number;
  };
  waste: Record<string, number>;
  energy: Record<string, number>;
  chartData?: any;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  metrics: Record<string, number>;
}

export interface BlockchainRecord {
  step: string;
  timestamp: string;
  hash: string;
  verified: boolean;
  location?: string;
  quantity?: string;
}

// LCC Types
export interface LCCInputs {
  state: string;
  energyPrice: number;
  mineWorkerWage: number;
  skilledLaborWage: number;
  excavatorCost: number;
  haulTruckCost: number;
  crusherCost: number;
  coalCost: number;
  ironOreCost: number;
  aluminumOreCost: number;
  limestoneCost: number;
  bauxiteCost: number;
  marbleCost: number;
  dieselTransportCost: number;
  railTransportCost: number;
  environmentalPenalty: number;
  regulatoryComplianceCost: number;
  mineWorkersCount: number;
  skilledWorkersCount: number;
  excavatorsCount: number;
  haulTrucksCount: number;
  crushersCount: number;
  dataSources?: {
    [K in keyof Omit<LCCInputs, 'dataSources'>]: 'user' | 'ai';
  };
}

export interface LCCResults {
  totalLaborCost: number;
  totalEquipmentCost: number;
  totalMaterialCost: number;
  totalEnvironmentalRegulatoryCost: number;
  totalOperatingCost: number;
  totalCostVirgin: number;
  totalCostRecycled: number;
  npvVirgin: number;
  npvRecycled: number;
  roiVirgin: number;
  roiRecycled: number;
  paybackPeriodVirgin: number;
  paybackPeriodRecycled: number;
  npvDifference: number;
  roiDifference: number;
  paybackDifference: number;
  chartData: {
    costBreakdown: Array<{ name: string; value: number; color: string }>;
    virginVsRecycled: Array<{ category: string; virgin: number; recycled: number }>;
    monthlyTrends: Array<{ month: string; totalCost: number; npv: number; roi: number }>;
  };
}

// API endpoints - switch between mock and real backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const USE_MOCK_DATA = !API_BASE_URL;

// Generic API helper
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    // Return mock data based on endpoint
    throw new Error("Mock data should be handled by individual functions");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Input management
export async function submitInputs(inputs: LCAInputs): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Inputs submitted successfully" };
  }

  return apiCall("/inputs", {
    method: "POST",
    body: JSON.stringify(inputs),
  });
}

export async function getInputs(): Promise<LCAInputs> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInputs;
  }

  return apiCall("/inputs");
}

// Results and predictions
export async function getResults(inputs?: LCAInputs): Promise<LCAResults> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Add randomness to results to avoid same values every time
    const randomizedResults = { ...mockResults };
    
    // Add ±10% randomness to emissions
    const variationFactor = 0.1;
    randomizedResults.emissions = {
      ...mockResults.emissions,
      CO2_kg_total: mockResults.emissions.CO2_kg_total * (1 + (Math.random() - 0.5) * variationFactor),
      NOx_kg: mockResults.emissions.NOx_kg * (1 + (Math.random() - 0.5) * variationFactor),
      SO2_kg: mockResults.emissions.SO2_kg * (1 + (Math.random() - 0.5) * variationFactor),
      CF4_kg: mockResults.emissions.CF4_kg * (1 + (Math.random() - 0.5) * variationFactor),
      PAH_g: mockResults.emissions.PAH_g * (1 + (Math.random() - 0.5) * variationFactor),
      NMVOC_kg: mockResults.emissions.NMVOC_kg * (1 + (Math.random() - 0.5) * variationFactor),
    };
    
    // Add randomness to waste values
    randomizedResults.waste = {
      SolidWaste_BauxiteResidue_kg: mockResults.waste.SolidWaste_BauxiteResidue_kg * (1 + (Math.random() - 0.5) * variationFactor),
      AluminaWaste_kg: mockResults.waste.AluminaWaste_kg * (1 + (Math.random() - 0.5) * variationFactor),
      RedMud_kg: mockResults.waste.RedMud_kg * (1 + (Math.random() - 0.5) * variationFactor),
    };
    
    // Add randomness to energy values
    randomizedResults.energy = {
      WasteHeat_MJ: mockResults.energy.WasteHeat_MJ * (1 + (Math.random() - 0.5) * variationFactor),
    };
    
    return randomizedResults;
  }

  return apiCall("/results", {
    method: "POST",
    body: JSON.stringify(inputs || {}),
  });
}

// Scenario management
export async function getScenarios(): Promise<Scenario[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockScenarios;
  }

  return apiCall("/scenarios");
}

export async function compareScenarios(scenarioIds: string[]): Promise<Scenario[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockScenarios.filter(scenario => scenarioIds.includes(scenario.id));
  }

  return apiCall("/scenarios/compare", {
    method: "POST",
    body: JSON.stringify({ scenarios: scenarioIds }),
  });
}

// Blockchain traceability
export async function getBlockchainLog(): Promise<BlockchainRecord[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBlockchainLog;
  }

  return apiCall("/blockchain/log");
}

// Environmental metrics and KPIs
export async function getEnvironmentalMetrics(): Promise<typeof mockEnvironmentalMetrics> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 350));
    return mockEnvironmentalMetrics;
  }

  return apiCall("/metrics/environmental");
}

// AI model predictions and imputation
export async function getAIImputations(partialInputs: Partial<LCAInputs>): Promise<LCAInputs> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 900));
    // Simulate AI imputation by filling missing/zero values with realistic estimates
    const filledInputs = { ...partialInputs };
    
    // Track data sources
    const dataSources = {
      materials: {} as Record<string, 'user' | 'ai'>,
      energy: {} as Record<string, 'user' | 'ai'>,
      resources: {} as Record<string, 'user' | 'ai'>,
    };
    
    // Fill materials - replace 0 values with mock data
    if (filledInputs.materials) {
      Object.keys(mockInputs.materials).forEach(key => {
        if (!filledInputs.materials![key] || filledInputs.materials![key] === 0) {
          filledInputs.materials![key] = mockInputs.materials[key];
          dataSources.materials[key] = 'ai';
        } else {
          dataSources.materials[key] = 'user';
        }
      });
    } else {
      filledInputs.materials = mockInputs.materials;
      Object.keys(mockInputs.materials).forEach(key => {
        dataSources.materials[key] = 'ai';
      });
    }
    
    // Fill energy - replace 0 values with mock data
    if (filledInputs.energy) {
      Object.keys(mockInputs.energy).forEach(key => {
        if (!filledInputs.energy![key] || filledInputs.energy![key] === 0) {
          filledInputs.energy![key] = mockInputs.energy[key];
          dataSources.energy[key] = 'ai';
        } else {
          dataSources.energy[key] = 'user';
        }
      });
    } else {
      filledInputs.energy = mockInputs.energy;
      Object.keys(mockInputs.energy).forEach(key => {
        dataSources.energy[key] = 'ai';
      });
    }
    
    // Fill resources - replace 0 values with mock data
    if (filledInputs.resources) {
      Object.keys(mockInputs.resources).forEach(key => {
        if (!filledInputs.resources![key] || filledInputs.resources![key] === 0) {
          filledInputs.resources![key] = mockInputs.resources[key];
          dataSources.resources[key] = 'ai';
        } else {
          dataSources.resources[key] = 'user';
        }
      });
    } else {
      filledInputs.resources = mockInputs.resources;
      Object.keys(mockInputs.resources).forEach(key => {
        dataSources.resources[key] = 'ai';
      });
    }
    
    return {
      ...mockInputs,
      ...filledInputs,
      dataSources,
    };
  }

  return apiCall("/ai/impute", {
    method: "POST",
    body: JSON.stringify(partialInputs),
  });
}

// LCC API Functions
export async function submitLCCInputs(inputs: LCCInputs): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'LCC inputs saved successfully (mock)' };
  }

  return apiCall('/api/lcc/inputs', {
    method: 'POST',
    body: JSON.stringify(inputs),
  });
}

export async function getLCCInputs(): Promise<LCCInputs> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLCCInputs;
  }

  return apiCall<LCCInputs>('/api/lcc/inputs');
}

export async function getLCCResults(inputs?: LCCInputs): Promise<LCCResults> {
  if (USE_MOCK_DATA) {
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockLCCResults;
  }

  const endpoint = inputs ? '/api/lcc/calculate' : '/api/lcc/results';
  const options = inputs ? {
    method: 'POST',
    body: JSON.stringify(inputs),
  } : undefined;
  
  return apiCall<LCCResults>(endpoint, options);
}

export async function getLCCAIImputations(partialInputs: Partial<LCCInputs>): Promise<LCCInputs> {
  if (USE_MOCK_DATA) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Merge user inputs with AI predictions
    const result = { ...mockLCCInputs };
    const dataSources = { ...result.dataSources };
    
    // Apply AI predictions for missing fields
    Object.entries(mockLCCPredictions).forEach(([key, value]) => {
      if (partialInputs[key as keyof LCCInputs] === undefined || partialInputs[key as keyof LCCInputs] === 0) {
        (result as any)[key] = value;
        (dataSources as any)[key] = 'ai';
      }
    });
    
    result.dataSources = dataSources;
    return result;
  }

  return apiCall<LCCInputs>('/api/lcc/ai-impute', {
    method: 'POST',
    body: JSON.stringify(partialInputs),
  });
}