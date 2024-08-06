import { vi, it, expect, describe, beforeEach } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/payment");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
// Partial mocking (only mocking sendEmail function)
vi.mock("../src/libs/email", async (importOriginal) => {
  const result = await importOriginal();
  return {
    ...result,
    sendEmail: vi.fn(),
  };
});

describe("test", () => {
  it("test case", () => {
    const greet = vi.fn();
    // mockReturnValue (return value)
    // mockResolvedValue (for promise)
    // mockImplementation
    greet.mockImplementation((name) => "hello " + name);

    const result = greet("dipesh");

    expect(greet).toHaveBeenCalledOnce();
  });

  it("should send text message", () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => `Your message is ${message}`);

    const result = sendText("Hi there");

    expect(sendText).toHaveBeenCalledWith("Hi there");
    expect(result).toMatch(/message/);
  });
});

// Mocking test
describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping info in target destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 5,
      estimatedDays: 1,
    });

    expect(getShippingInfo("USA")).toMatch(/shipping cost: \$5 \(1 days\)/i);
  });

  it("should return error in invalid target destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    expect(getShippingInfo("sf")).toMatch(/unavailable/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = {
    totalAmount: 200,
  };
  const creditCardInfo = {
    creditCardNumber: 2347892734,
  };

  it("should call charge", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCardInfo);

    expect(charge).toHaveBeenCalledWith(creditCardInfo, order.totalAmount);
  });

  it("should return success true when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCardInfo);

    expect(result.success).toBeTruthy();
  });

  it("should return success false when payment is failed", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCardInfo);

    expect(result).toHaveProperty("error");
    expect(result.success).toBeFalsy();
    expect(result.error).toMatch(/error/i);
  });
});

// Partial mocking
describe("signUp", () => {
  it("should return false if email is not valid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp("example@gmail.com");

    expect(result).toBe(true);
  });

  it("should welcome email if email is valid", async () => {
    await signUp("example@gmail.com");

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];

    expect(args[0]).toBe("example@gmail.com");
    expect(args[1]).toMatch(/welcome/i);
  });
});

// Spying function
describe("login", () => {
  it("should email the otp login code", async () => {
    const email = "name@domain.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value;

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode.toString());
  });
});

describe("isOnline", () => {
  it("should return false if current hour is outside opening hours", () => {
    vi.setSystemTime("2024-02-02 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-02-02 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour is within opening hours", () => {
    vi.setSystemTime("2024-02-02 08:59");

    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return 0 if not christmas day", () => {
    vi.setSystemTime("2024-11-24 10:00");
    expect(getDiscount()).toBe(0);
  });

  it("should return discount if it is a christmas day", () => {
    vi.setSystemTime("2024-12-25 07:00");
    const today = new Date();

    expect(getDiscount()).toBe(0.2);
  });
});
