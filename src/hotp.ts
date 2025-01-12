import {hmac} from "./hmac";

/**
 * @see https://datatracker.ietf.org/doc/html/rfc4226#section-5.3
 */
export const dynamicTruncation = (hs: Uint8Array): number => {
  const offset = hs[hs.length - 1] & 0xf;
  return (hs[offset] & 0x7f) << 24 | hs[offset + 1] << 16 | hs[offset + 2] << 8 | hs[offset + 3];
};

export const hotp = async (key: Uint8Array, data: Uint8Array, digits = 6, alg = "SHA-1"): Promise<string> => {
  const hash = await hmac(key, data, alg);
  const dt = dynamicTruncation(hash);
  return `${dt % Math.pow(10, digits)}`.padStart(digits, "0");
}