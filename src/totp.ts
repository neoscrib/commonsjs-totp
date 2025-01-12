import {base32ToBinary, hexToBinary} from "./encoding";
import {hotp} from "./hotp";

export function totp({key, digits = 6, algorithm = "SHA-1", interval = 30, timestamp = Date.now() / 1000}: ITotpOptions): Promise<string> {
  const t = Math.floor(timestamp / interval);
  const thex = t.toString(16).padStart(16, "0");
  const dataBuffer = hexToBinary(thex);
  const keyBuffer = typeof key === "string" ? base32ToBinary(key) : key;
  return hotp(keyBuffer, dataBuffer, digits, algorithm);
}