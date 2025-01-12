export const binaryToHex = (input: Uint8Array): string => {
  return [...input].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const hexToBinary = (input: string): Uint8Array => {
  const buffer = new Uint8Array(input.length / 2);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = parseInt(input.substring(i * 2, i * 2 + 2), 16) & 0xff;
  }
  return buffer;
};

const base32alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export const base32ToBinary = (input: string): Uint8Array => {
  let bits= [...input.toUpperCase().replace(/=/g, "")].map((c, i) => {
    const m = base32alphabet.indexOf(c);
    if (m < 0) {
      throw new Error(`Invalid base-32 character ${c}`);
    }
    return m.toString(2).padStart(5, "0");
  }).join("");
  const bitLength = Math.ceil(bits.length / 8) * 8;
  const byteLength = bitLength / 8;
  bits = bits.padStart(byteLength, "0");

  const binary = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    binary[i] = parseInt(bits.substring(i * 8, i * 8 + 8), 2) & 0xff;
  }

  return binary;
};
