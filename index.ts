import {hmachex} from "./src/hmac.ts";
import {binaryToHex, base32ToBinary} from "./src/encoding.ts";
import {dynamicTruncation, hotp} from "./src/hotp.ts";
import {totp} from "./src/totp.ts";

window.exports = {
  hmachex,
  binaryToHex,
  base32ToBinary,
  dynamicTruncation,
  hotp,
  totp
};
