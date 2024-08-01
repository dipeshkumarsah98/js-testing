import {
  it,
  describe,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
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
  // Parameterized test
  it.each([
    { price: -100, min: 0, max: 100, result: false },
    { price: 200, min: 0, max: 100, result: false },
    { price: 200, min: 0, max: 300, result: true },
    { price: 0, min: 0, max: 300, result: true },
  ])(
    "should return $result when price is $price and range is $min to $max",
    ({ max, min, price, result }) => {
      expect(isPriceInRange(price, min, max)).toBe(result);
    }
  );
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
  // Parameterized tests
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 15, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])("should return $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });

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

describe("fetchData", () => {
  // Testing asynchronous code
  it("should return a promise that will resolve to an array of numbers", async () => {
    try {
      const result = await fetchData();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

describe("test suite", () => {
  beforeAll(() => {
    console.log("Before all called");
  });
  beforeEach(() => {
    console.log("Before reach called");
  });

  afterAll(() => {
    console.log("after all called");
  });
  afterEach(() => {
    console.log("after reach called");
  });

  it("test case 1", () => {});

  it("test case 2", () => {});
});

describe("stack", () => {
  let stack;

  // it will be run for each it block
  beforeEach(() => {
    stack = new Stack();
  });

  it("push should add an item to the stack", () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peek should return the top item from the stack without removing it", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("isEmpty should return true if stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it("isEmpty should return false if stack is not empty", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it("size should return items in a stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.size()).toBe(3);
  });

  it("clear should empty the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
  });
});
