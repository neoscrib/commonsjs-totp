import {binaryToHex} from "./encoding";

export async function hmachex(key: string, data: string, alg = "SHA-1"): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const dataBuffer = enc.encode(data);
  const signature = await hmac(keyData, dataBuffer, alg);
  return binaryToHex(signature);
  
}

export async function hmac(key: Uint8Array, data: Uint8Array, alg = "SHA-1"): Promise<Uint8Array> {
  let name = alg;
  const match = /^SHA-?(1|256|384|512)$/i.exec(name);
  if (match) {
    name = `SHA-${match[1]}`;
  }

  const cryptoKey = await crypto.subtle.importKey("raw", key, {name: "HMAC", hash: {name}}, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return new Uint8Array(signature);
}
