import {hmachex} from "../src/hmac";

describe("hmac", () => {
  describe("hmachex", () => {    
    it("generates a valid hmac-sha-1", async () => {
      const actual = await hmachex("hello", "world");
      expect(actual).toEqual("8a3a84bcd0d0065e97f175d370447c7d02e00973");
    });

    it("generates a valid hmac-sha-256", async () => {
      const actual = await hmachex("hello", "world", "SHA-256");
      expect(actual).toEqual("f1ac9702eb5faf23ca291a4dc46deddeee2a78ccdaf0a412bed7714cfffb1cc4");
    });

    it("generates a valid hmac-sha-384", async () => {
      const actual = await hmachex("hello", "world", "SHA-384");
      expect(actual).toEqual("80d036d9974e6f71ceabe493ee897d00235edcc4c72e046ddfc8bf68e86a477d63b9f7d26ad5b990aae6ac17db57ddcf");
    });

    it("generates a valid hmac-sha-512", async () => {
      const actual = await hmachex("hello", "world", "SHA-512");
      expect(actual).toEqual("6668ed2f7d016c5f12d7808fc4f2d1dc4851622d7f15616de947a823b3ee67d761b953f09560da301f832902020dd1c64f496df37eb7ac4fd2feeeb67d77ba9b");
    });
  });
});
