declare interface ITotpOptions {
  key: string | Uint8Array;
  digits?: number;
  algorithm?: string;
  interval?: number;
  timestamp?: number;
}