// Mock data for LCA Dashboard - Production-ready dummy data
export const mockInputs = {
  year: "2025",
  scenarioId: "baseline",
  processBoundary: "cradle-to-gate",
  materials: {
    Bauxite_kg: 4200,
    CausticSoda_kg: 350,
    CalcinedLime_kg: 180,
    Alumina_kg: 1950,
    CalcinedCoke_kg: 420,
    PetrolCoke_kg: 380,
    Anode_kg: 450,
    AlF3_kg: 25,
    Scrap_kg: 320,
  },
  energy: {
    Electricity_MJ_total: 54000,
    Alumina_MJ: 18000,
    Anode_MJ: 12000,
    Electrolysis_MJ: 24000,
  },
  resources: {
    FreshWater_m3: 180,
    Refractory_kg: 120,
    Steel_kg: 280,
  },
  dataSources: {
    materials: {
      Bauxite_kg: 'user' as const,
      CausticSoda_kg: 'user' as const,
      CalcinedLime_kg: 'ai' as const,
      Alumina_kg: 'user' as const,
      CalcinedCoke_kg: 'ai' as const,
      PetrolCoke_kg: 'user' as const,
      Anode_kg: 'ai' as const,
      AlF3_kg: 'ai' as const,
      Scrap_kg: 'user' as const,
    },
    energy: {
      Electricity_MJ_total: 'user' as const,
      Alumina_MJ: 'ai' as const,
      Anode_MJ: 'user' as const,
      Electrolysis_MJ: 'ai' as const,
    },
    resources: {
      FreshWater_m3: 'user' as const,
      Refractory_kg: 'ai' as const,
      Steel_kg: 'user' as const,
    },
  },
};

export const mockResults = {
  emissions: {
    CO2_kg_total: 1850,
    CO2_by_process: {
      alumina: 720,
      anode: 450,
      electrolysis: 680,
    },
    NOx_kg: 12.5,
    SO2_kg: 8.3,
    CF4_kg: 2.1,
    PAH_g: 180,
    NMVOC_kg: 3.4,
  },
  waste: {
    SolidWaste_BauxiteResidue_kg: 2800,
    AluminaWaste_kg: 150,
    RedMud_kg: 420,
  },
  energy: {
    WasteHeat_MJ: 8200,
  },
  chartData: {
    emissionsByProcess: [
      { name: "Alumina", value: 720, color: "#10b981" },
      { name: "Anode", value: 450, color: "#3b82f6" },
      { name: "Electrolysis", value: 680, color: "#f59e0b" },
    ],
    monthlyTrends: [
      { month: "Jan", CO2: 1800, NOx: 12, SO2: 8.1 },
      { month: "Feb", CO2: 1750, NOx: 11.8, SO2: 7.9 },
      { month: "Mar", CO2: 1820, NOx: 12.2, SO2: 8.3 },
      { month: "Apr", CO2: 1780, NOx: 11.9, SO2: 8.0 },
      { month: "May", CO2: 1850, NOx: 12.5, SO2: 8.3 },
      { month: "Jun", CO2: 1790, NOx: 12.0, SO2: 8.1 },
    ],
  },
};

export const mockScenarios = [
  {
    id: "baseline",
    name: "Coal-Heavy Baseline",
    description: "Current process with coal-based energy",
    metrics: {
      CO2_kg: 1850,
      cost_usd: 1200,
      efficiency: 0.82,
      renewable_percent: 15,
    },
  },
  {
    id: "renewable",
    name: "Renewable Transition",
    description: "50% renewable energy mix",
    metrics: {
      CO2_kg: 1280,
      cost_usd: 1350,
      efficiency: 0.84,
      renewable_percent: 50,
    },
  },
  {
    id: "optimized",
    name: "Fully Optimized",
    description: "100% renewable with recycling",
    metrics: {
      CO2_kg: 920,
      cost_usd: 1480,
      efficiency: 0.89,
      renewable_percent: 100,
    },
  },
];

export const mockBlockchainLog = [
  {
    step: "Bauxite Mining",
    timestamp: "2025-09-25T08:00:00Z",
    hash: "0xabc123def456789",
    verified: true,
    location: "Australia",
    quantity: "4200 kg",
  },
  {
    step: "Alumina Refining",
    timestamp: "2025-09-25T10:30:00Z",
    hash: "0xdef456abc789123",
    verified: true,
    location: "Queensland",
    quantity: "1950 kg",
  },
  {
    step: "Anode Production",
    timestamp: "2025-09-25T12:15:00Z",
    hash: "0x789123def456abc",
    verified: true,
    location: "Industrial Zone A",
    quantity: "450 kg",
  },
  {
    step: "Electrolysis Process",
    timestamp: "2025-09-25T14:45:00Z",
    hash: "0x456abc789123def",
    verified: true,
    location: "Smelter Facility",
    quantity: "1000 kg aluminum",
  },
  {
    step: "Quality Control",
    timestamp: "2025-09-25T16:20:00Z",
    hash: "0x123def456abc789",
    verified: true,
    location: "QC Lab",
    quantity: "1000 kg verified",
  },
];

export const mockEnvironmentalMetrics = {
  carbonIntensity: {
    current: 1.85, // kg CO2 per kg aluminum
    target: 1.2,
    industry_average: 2.1,
  },
  waterUsage: {
    current: 180, // m3 per tonne
    target: 150,
    industry_average: 220,
  },
  energyEfficiency: {
    current: 14.5, // MWh per tonne
    target: 13.0,
    industry_average: 15.2,
  },
  wasteReduction: {
    current: 78, // % recycled
    target: 85,
    industry_average: 65,
  },
};