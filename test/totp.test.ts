import {base32decode} from "../src/encoding";
import {totp} from "../src/totp";
import {startPlaywright} from "./helper";

describe("totp", () => {
  describe("nodejs", () => {
    it("generates valid one-time passwords with base-32 input", async () => {
      const key = "TFB4UMWQIT4C5W7T2OJUPI2OHQJOX5G4";
      const result = await totp({key, timestamp: 1736638420});
      expect(result).toEqual("271579");
    });

    it("generates valid one-time passwords with binary input", async () => {
      const key = base32decode("TFB4UMWQIT4C5W7T2OJUPI2OHQJOX5G4");
      const result = await totp({key, timestamp: 1736638420});
      expect(result).toEqual("271579");
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
        const key = "TFB4UMWQIT4C5W7T2OJUPI2OHQJOX5G4";
        return window.exports.totp({key, timestamp: 1736638420});
      });
      expect(result).toEqual("271579");
    });

    it("generates valid one-time passwords with binary input", async () => {
      const result = await sut.page.evaluate(() => {
        const key = window.exports.base32decode("TFB4UMWQIT4C5W7T2OJUPI2OHQJOX5G4");
        return window.exports.totp({key, timestamp: 1736638420});
      });
      expect(result).toEqual("271579");
    });
  });
});