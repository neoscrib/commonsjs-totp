import {base32ToBinary, binaryToHex} from "../src/encoding";

describe("encoding", () => {
  describe("binaryToHex", () => {
    it("encodes binary input to a hex string", () => {
      const inputString = "hello world";
      const input = new Uint8Array([...inputString].map((c) => c.charCodeAt(0)));
      const result = binaryToHex(input);
      expect(result).toEqual("68656c6c6f20776f726c64")
    });
  });

  describe("base32ToBinary", () => {
    it("decodes a base-32 string to binary", () => {
      const result = base32ToBinary("JBSWY3DPEHPK3PXP");
      const resultHex = binaryToHex(result);
      expect(resultHex).toEqual("48656c6c6f21deadbeef");
    });
  });
});