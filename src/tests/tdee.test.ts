import { describe, it, expect } from 'vitest';
import { calculateWeightEMA, calculateAdaptedTDEE, generateWeightTrend } from '../logic/tdee';

describe('TDEE Logic', () => {
  describe('calculateWeightEMA', () => {
    it('should return current weight if no previous EMA exists', () => {
      expect(calculateWeightEMA(80, null)).toBe(80);
    });

    it('should correctly calculate EMA for a stable weight', () => {
      const weight = 80;
      const prevEMA = 80;
      expect(calculateWeightEMA(weight, prevEMA)).toBe(80);
    });

    it('should smooth weight increases', () => {
      const weight = 81; // 1kg increase
      const prevEMA = 80;
      const result = calculateWeightEMA(weight, prevEMA, 20);
      // k = 2 / 21 = 0.0952
      // (81 - 80) * 0.0952 + 80 = 80.0952...
      expect(result).toBeGreaterThan(80);
      expect(result).toBeLessThan(80.1);
    });
  });

  describe('calculateAdaptedTDEE', () => {
    it('should maintain TDEE if weight is stable and intake equals TDEE', () => {
      const avgIntake = 2500;
      const weightDelta = 0;
      expect(calculateAdaptedTDEE(avgIntake, weightDelta)).toBe(2500);
    });

    it('should decrease TDEE if weight increased more than expected', () => {
      const avgIntake = 2500;
      const weightDelta = 0.5; // Gained 0.5kg in 14 days
      const result = calculateAdaptedTDEE(avgIntake, weightDelta, 14);
      // dailySurplus = (0.5 * 7700) / 14 = 275
      // newTDEE = 2500 - 275 = 2225
      expect(result).toBe(2225);
    });

    it('should increase TDEE if weight decreased more than expected', () => {
      const avgIntake = 2500;
      const weightDelta = -0.5; // Lost 0.5kg in 14 days
      const result = calculateAdaptedTDEE(avgIntake, weightDelta, 14);
      // dailySurplus = (-0.5 * 7700) / 14 = -275
      // newTDEE = 2500 - (-275) = 2775
      expect(result).toBe(2775);
    });
  });

  describe('generateWeightTrend', () => {
    it('should generate a series of EMA values', () => {
      const weights = [
        { value: 80, date: '2024-01-01' },
        { value: 81, date: '2024-01-02' },
        { value: 82, date: '2024-01-03' },
      ];
      const trend = generateWeightTrend(weights);
      expect(trend.length).toBe(3);
      expect(trend[0]).toBe(80);
      expect(trend[1]).toBeGreaterThan(80);
      expect(trend[2]).toBeGreaterThan(trend[1]);
    });
  });
});
