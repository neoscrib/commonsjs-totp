declare interface ITotpOptions {
  /**
   * TOTP key in either base-32 or binary format
   */
  key: string | Uint8Array;
  /**
   * The number of digits to return; Default is 6.
   */
  digits?: number;
  /**
   * The hashing algorithm to use. One of SHA-1; SHA-256; SHA-384; or SHA-512. Default is SHA-1.
   */
  algorithm?: string;
  /**
   * The time interval. Default is 30 seconds.
   */
  interval?: number;
  /**
   * The timestamp to use. Default is now.
   */
  timestamp?: number;
}

declare interface IOtpAuth extends Exclude<ITotpOptions, "timestamp"> {
  type: string;
  account: string;
  issuer?: string;
  counter?: number;
}

declare module "@commonsjs/totp" {
  /**
   * Generates a time-based one-time password
   * @param options The TOTP options
   */
  export function totp(options: ITotpOptions): Promise<string>;
  /**
   * Generates a counter-based one-time password
   * @param key OTP key in binary format
   * @param data Counter value in binary format
   * @param digits The number of digits to return
   * @param alg The HMAC hash algorithm to use
   */
  export function hotp(key: Uint8Array, data: Uint8Array, digits?: number, alg?: string): Promise<string>;
  /**
   * Parses a OTP URI
   * @param uri The URI to parse
   */
  export function parseOtpUri(uri: string): IOtpAuth;
}