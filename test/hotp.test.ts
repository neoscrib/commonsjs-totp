import {hotp} from "../src/hotp";
import {hexToBinary} from "../src/encoding";

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
      ["00000000023523EC", "SHA-1", "07081804"],
      ["00000000023523EC", "SHA-256", "68084774"],
      ["00000000023523EC", "SHA-512", "25091201"],
      ["00000000023523ED", "SHA-1", "14050471"],
      ["00000000023523ED", "SHA-256", "67062674"],
      ["00000000023523ED", "SHA-512", "99943326"],
      ["000000000273EF07", "SHA-1", "89005924"],
      ["000000000273EF07", "SHA-256", "91819424"],
      ["000000000273EF07", "SHA-512", "93441116"],
      ["0000000003F940AA", "SHA-1", "69279037"],
      ["0000000003F940AA", "SHA-256", "90698825"],
      ["0000000003F940AA", "SHA-512", "38618901"],
      ["0000000027BC86AA", "SHA-1", "65353130"],
      ["0000000027BC86AA", "SHA-256", "77737706"],
      ["0000000027BC86AA", "SHA-512", "47863826"]
    ] as [string, keyof typeof keyLengths, string][]) {
      /**
       * @see https://datatracker.ietf.org/doc/html/rfc6238#appendix-B
       */
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
});