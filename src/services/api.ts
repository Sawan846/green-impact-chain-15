// API service with mock data fallback
import {
  mockInputs,
  mockResults,
  mockScenarios,
  mockBlockchainLog,
  mockEnvironmentalMetrics,
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
    return mockResults;
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