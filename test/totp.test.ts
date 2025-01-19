import {base32decode} from "../src/encoding";
import {totp} from "../src/totp";
import {startPlaywright} from "./helper";

describe("totp", () => {
  describe("nodejs", () => {
    it("generates valid one-time passwords with base-32 input", async () => {
      const key = "JBSWY3DPEHPK3PXP";
      const result = await totp({key, timestamp: 1736638420});

      expect(result).toEqual({
        expires: 1736638440,
        token: "482223",
        previous: "534333",
        next: "291802"
      });
    });

    it("generates valid one-time passwords with binary input", async () => {
      const key = base32decode("JBSWY3DPEHPK3PXP");
      const result = await totp({key, timestamp: 1736638420});

      expect(result).toEqual({
        expires: 1736638440,
        token: "482223",
        previous: "534333",
        next: "291802"
      });
    });
  });

  describe("browser", () => {
    let sut: Awaited<ReturnType<typeof startPlaywright>>;

    beforeAll(async () => {
      sut = await startPlaywright();
    });
    
    afterAll(async () => {
      await sut.close();
    });

    it("generates valid one-time passwords with base-32 input", async () => {
      const result = await sut.page.evaluate(() => {
        const key = "JBSWY3DPEHPK3PXP";
        return window.exports.totp({key, timestamp: 1736638420});
      });

      expect(result).toEqual({
        expires: 1736638440,
        token: "482223",
        previous: "534333",
        next: "291802"
      });
    });

    it("generates valid one-time passwords with binary input", async () => {
      const result = await sut.page.evaluate(() => {
        const key = window.exports.base32decode("JBSWY3DPEHPK3PXP");
        return window.exports.totp({key, timestamp: 1736638420});
      });

      expect(result).toEqual({
        expires: 1736638440,
        token: "482223",
        previous: "534333",
        next: "291802"
      });
    });
  });
});