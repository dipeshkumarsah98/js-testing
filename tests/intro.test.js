import { describe, it, expect } from "vitest";
import { factorial, fizzBuzz, max } from "../src/intro";

describe("Max", () => {
  it("Should return the first argument if it is greater", () => {
    // AAA
    // Arrange ("should declare the dependence")
    const firstNumber = 20;
    const secondNumber = 10;

    // Act ("Perform the action")
    const result = max(firstNumber, secondNumber);

    // Assert ("Verify the action")
    expect(result).toBe(firstNumber);
  });

  it("Should return the second argument if it is greater", () => {
    // AAA
    // Arrange ("should declare the dependence")
    const firstNumber = 10;
    const secondNumber = 20;

    // Act ("Perform the action")
    const result = max(firstNumber, secondNumber);

    // Assert ("Verify the action")
    expect(result).toBe(secondNumber);
  });

  it("Should return the first argument if arguments are equal", () => {
    // AAA
    // Arrange ("should declare the dependence")
    const firstNumber = 20;
    const secondNumber = 20;

    // Act ("Perform the action")
    const result = max(firstNumber, secondNumber);

    // Assert ("Verify the action")
    expect(result).toBe(firstNumber);
  });
});

describe("FizzBuzz", () => {
  it("should return Fizz if argument is multiple of 3", () => {
    const number = 3;

    const result = fizzBuzz(number);

    expect(result).toBe("Fizz");
  });

  it("should return Buzz if argument is multiple of 5", () => {
    const number = 3;

    const result = fizzBuzz(number);

    expect(result).toBe("Fizz");
  });

  it("should return FizzBuzz if argument is multiple of 5 and 3", () => {
    const number = 15;

    const result = fizzBuzz(number);

    expect(result).toBe("FizzBuzz");
  });

  it("should return string argument if argument is multiple not multiple of any 5 or 3", () => {
    const number = 17;

    const result = fizzBuzz(number);

    expect(result).toBe(number.toString());
  });
});

describe("Factorial", () => {
  it("should return 1 if the argument is 0", () => {
    expect(factorial(0)).toBe(1);
  });

  it("should return 2 if the argument is 2", () => {
    expect(factorial(2)).toBe(2);
  });

  it("should return 5 if the argument is 3", () => {
    expect(factorial(3)).toBe(6);
  });
  it("should return undefined if the argument is negative number", () => {
    expect(factorial(-3)).toBeUndefined();
  });
});
