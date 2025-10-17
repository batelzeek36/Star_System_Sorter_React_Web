/**
 * Unit tests for Zod validation schemas
 */

import { describe, it, expect } from 'vitest';
import {
  BirthDataFormSchema,
  BirthDataAPIRequestSchema,
  HDExtractSchema,
} from './schemas';

describe('BirthDataFormSchema', () => {
  describe('valid inputs', () => {
    it('should validate correct date format MM/DD/YYYY', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '12:03 AM',
        location: 'Attleboro, MA',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('should validate correct time format HH:MM AM/PM', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '01/15/2000',
        time: '11:45 PM',
        location: 'New York',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(true);
    });

    it('should validate location with letters, spaces, commas, periods, hyphens', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '05/20/1985',
        time: '03:30 PM',
        location: 'St. Louis, Missouri',
        timeZone: 'America/Chicago',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid date format', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '1992-10-03',
        time: '12:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject date with month out of range', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '13/03/1992',
        time: '12:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject date with day out of range', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '02/30/1992',
        time: '12:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject year before 1900', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1899',
        time: '12:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject future year', () => {
      const futureYear = new Date().getFullYear() + 1;
      const result = BirthDataFormSchema.safeParse({
        date: `10/03/${futureYear}`,
        time: '12:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid time format', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '25:03',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject time with hours out of range', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '13:03 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject time with minutes out of range', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '12:60 AM',
        location: 'Attleboro',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject location shorter than 2 characters', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '12:03 AM',
        location: 'A',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject location longer than 100 characters', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '12:03 AM',
        location: 'A'.repeat(101),
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });

    it('should reject location with invalid characters', () => {
      const result = BirthDataFormSchema.safeParse({
        date: '10/03/1992',
        time: '12:03 AM',
        location: 'New York @#$',
        timeZone: 'America/New_York',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('BirthDataAPIRequestSchema', () => {
  it('should validate correct API request format', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
    });
    expect(result.success).toBe(true);
  });

  it('should validate with optional lat/lon', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 41.9445,
      lon: -71.2928,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid date format', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '10/03/1992',
      time: '00:03',
      timeZone: 'America/New_York',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid time format', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '1992-10-03',
      time: '12:03 AM',
      timeZone: 'America/New_York',
    });
    expect(result.success).toBe(false);
  });

  it('should reject latitude out of range', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 91,
      lon: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject longitude out of range', () => {
    const result = BirthDataAPIRequestSchema.safeParse({
      dateISO: '1992-10-03',
      time: '00:03',
      timeZone: 'America/New_York',
      lat: 0,
      lon: 181,
    });
    expect(result.success).toBe(false);
  });
});

describe('HDExtractSchema', () => {
  it('should validate correct HD extract data', () => {
    const result = HDExtractSchema.safeParse({
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: ['Sacral', 'Throat'],
      channels: [34, 57],
      gates: [1, 13, 25],
    });
    expect(result.success).toBe(true);
  });

  it('should validate with empty arrays', () => {
    const result = HDExtractSchema.safeParse({
      type: 'Reflector',
      authority: 'Lunar',
      profile: '6/3',
      centers: [],
      channels: [],
      gates: [],
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const result = HDExtractSchema.safeParse({
      type: 'Generator',
      authority: 'Sacral',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid data types', () => {
    const result = HDExtractSchema.safeParse({
      type: 'Generator',
      authority: 'Sacral',
      profile: '5/1',
      centers: 'Sacral',
      channels: [34, 57],
      gates: [1, 13, 25],
    });
    expect(result.success).toBe(false);
  });
});
