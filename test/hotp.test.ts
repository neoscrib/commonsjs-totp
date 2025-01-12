import {dynamicTruncation, hotp} from "../src/hotp";
import {hexToBinary} from "../src/encoding";

describe("hotp", () => {
  describe("dynamic truncation", () => {
    it("returns the dynamically truncated number from the 20-byte input", () => {
      const input = new Uint8Array([
        0x1f, 0x86, 0x98, 0x69, 0x0e, 0x02, 0xca, 0x16, 0x61, 0x85, 0x50, 0xef, 0x7f, 0x19, 0xda, 0x8e, 0x94, 0x5b, 0x55, 0x5a
      ]);
      const result = dynamicTruncation(input);
      expect(result).toEqual(0x50ef7f19);
    });
  });

  describe("hotp", () => {
    const baseKey = [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30];
    const keyLengths = {
      "SHA-1": 20,
      "SHA-256": 32,
      "SHA-384": 48,
      "SHA-512": 64
    }

    for (const [t, alg, expected] of [
      ["0000000000000001", "SHA-1", "94287082"],
      ["0000000000000001", "SHA-256", "46119246"],
      ["0000000000000001", "SHA-512", "90693936"],
      ["00000000023523EC", "SHA-1", "07081804"]
    ] as [string, keyof typeof keyLengths, string][]) {
      it(`generates valid hmac-based one-time passwords for ${alg} at ${t}`, async () => {
        const keyLength = keyLengths[alg];
        const keyData = [...baseKey];
        while (keyData.length < keyLength) {
          keyData.push(baseKey[keyData.length % baseKey.length]);
        }

        const key = new Uint8Array(keyData);
        const data = hexToBinary(t);
        const result = await hotp(key, data, 8, alg);
        expect(result).toEqual(expected)
      });
    }
    
    it("generates valid hmac-based one-time passwords", async () => {
      const key = new Uint8Array([0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x30]);
      const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
      const result = await hotp(key, data, 8);
      expect(result).toEqual("94287082")
    });
  });
});