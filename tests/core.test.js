import { it, describe, expect } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";

describe("core", () => {
  it("should not return empty array", () => {
    const result = getCoupons();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return array with valid code", () => {
    const result = getCoupons();
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return array with valid discount", () => {
    const result = getCoupons();
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(coupon.discount).greaterThan(0);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid code", () => {
    const result = calculateDiscount(100, "SAVE10");
    expect(result).toBe(90);
    expect(calculateDiscount(100, "SAVE20")).toBe(80);
  });

  it("should handle non-numeric input", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i); // regular expression to search for contain
  });

  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i); // regular expression to search for contain
  });

  it("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i); // regular expression to search for contain
  });
});

describe("validateUserInput", () => {
  it("should return success for valid user input", () => {
    expect(validateUserInput("dipesh98", 20)).toMatch(/successful/i);
  });

  it("should return error for invalid user type and length", () => {
    expect(validateUserInput("dp", 20)).toMatch(/invalid/i);
    expect(validateUserInput(10, 20)).toMatch(/invalid/i);
  });

  it("should return error for invalid age input", () => {
    expect(validateUserInput("dipesh98", 10)).toMatch(/invalid/i);
    expect(validateUserInput("dipesh98", "20")).toMatch(/invalid/i);
  });

  it("should return error if username is more than 255 character", () => {
    expect(validateUserInput("A".repeat(300), 20)).toMatch(/invalid/i);
  });

  it("should return error if both username and age is invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it("should return false when the price is outside the range", () => {
    expect(isPriceInRange(-100, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });

  it("should return true when the price is equal to the min or to the max", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });

  it("should return true when the price is with in the range", () => {
    expect(isPriceInRange(20, 0, 100)).toBe(true);
  });
});

describe("isValidUsername", () => {
  it("should return true if username is valid", () => {
    expect(isValidUsername("dipesh")).toBe(true);
  });

  it("should return false if username is too short", () => {
    expect(isValidUsername("Dip")).toBe(false);
  });

  it("should return false if username is too long", () => {
    expect(isValidUsername("Dip".repeat(20))).toBe(false);
  });

  it("should return false for invalid input type", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("carDrive", () => {
  it("should return error if invalid country code is provided", () => {
    expect(canDrive(16, "USA")).toMatch(/invalid/i);
  });

  it("should return true if valid age and country code is provided", () => {
    expect(canDrive(16, "US")).toBe(true);
    expect(canDrive(17, "UK")).toBe(true);
  });

  it("should return false if invalid age and country code is provided", () => {
    expect(canDrive(12, "US")).toBe(false);
    expect(canDrive(10, "UK")).toBe(false);
  });

  it("should return error if invalid age data value is provided", () => {
    expect(canDrive("12", "US")).toMatch(/invalid/i);
  });
});
