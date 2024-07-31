import { it, describe, expect } from "vitest";
import { calculateDiscount, getCoupons, validateUserInput } from "../src/core";

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
  });

  it("should handle non-numeric input", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i); // regular expression to search for contain
  });

  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i); // regular expression to search for contain
  });

  it("should handle non-string discount code", () => {
    expect(calculateDiscount(-10, 10)).toMatch(/invalid/i); // regular expression to search for contain
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
