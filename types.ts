
export enum Industry {
  Manufacturing = 'Manufacturing',
  Technology = 'Technology',
  Retail = 'Retail',
  Logistics = 'Logistics',
  Construction = 'Construction'
}

export enum BusinessSize {
  Startup = '1-10',
  SME = '11-250',
  Enterprise = '250+'
}

export enum Location {
  EU = 'European Union',
  US = 'United States',
  Other = 'Global/Other'
}

export enum FleetType {
  Electric = '100% Electric',
  Hybrid = 'Hybrid Mix',
  ICE = 'Internal Combustion (Gas/Diesel)'
}

export interface OnboardingData {
  companyName: string;
  industry: Industry;
  size: BusinessSize;
  location: Location;
  monthlyKWh: number;
  wasteVolume: number; // kg per month
  fleetType: FleetType;
  sustainableMaterials: number; // 0 - 100 percentage
  annualRevenue: number;
  taxBracket: number; // percentage
}

export interface SustainabilityResult {
  score: number;
  energyScore: number;
  wasteScore: number;
  materialScore: number;
  estimatedTaxOffset: number;
  recommendations: string[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
}
