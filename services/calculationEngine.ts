
import { OnboardingData, SustainabilityResult } from '../types';
import { WEIGHTS, BASELINE_KWH, BASELINE_WASTE } from '../constants';

export const calculateSustainability = (data: OnboardingData): SustainabilityResult => {
  // 1. Energy Score (0-100)
  const baselineKWh = BASELINE_KWH[data.industry] || 5000;
  const energyEfficiency = Math.max(0, 1 - (data.monthlyKWh / (baselineKWh * 2)));
  const energyScore = energyEfficiency * 100;

  // 2. Waste Score (0-100)
  const baselineWaste = BASELINE_WASTE[data.industry] || 1000;
  const wasteEfficiency = Math.max(0, 1 - (data.wasteVolume / (baselineWaste * 2)));
  const wasteScore = wasteEfficiency * 100;

  // 3. Material Score (Directly from input)
  const materialScore = data.sustainableMaterials;

  // Total Score
  const totalScore = (energyScore * WEIGHTS.ENERGY) + (wasteScore * WEIGHTS.WASTE) + (materialScore * WEIGHTS.MATERIALS);

  // 4. Tax Offset (Simulation of 2026 Projected EU/US Standard)
  // Higher score = better tax credit (max 5% of revenue for high performance)
  let offsetRate = 0;
  if (totalScore > 85) offsetRate = 0.05;
  else if (totalScore > 70) offsetRate = 0.03;
  else if (totalScore > 50) offsetRate = 0.015;
  
  const estimatedTaxOffset = data.annualRevenue * offsetRate;

  // 5. Dynamic Recommendations
  const recommendations: string[] = [];
  if (energyScore < 60) recommendations.push("Upgrade to High-Efficiency Smart Lighting & HVAC systems.");
  if (wasteScore < 60) recommendations.push("Implement a Zero-Waste circular logistics program.");
  if (materialScore < 60) recommendations.push("Increase bio-sourced materials in your primary supply chain.");
  if (data.fleetType !== '100% Electric') recommendations.push("Transition core fleet to 100% EV by Q4 2026 for maximum credits.");

  if (recommendations.length === 0) recommendations.push("Excellent work! Consider applying for the Platinum EcoSeal 2026 Certification.");

  return {
    score: Math.round(totalScore),
    energyScore: Math.round(energyScore),
    wasteScore: Math.round(wasteScore),
    materialScore: Math.round(materialScore),
    estimatedTaxOffset,
    recommendations
  };
};
