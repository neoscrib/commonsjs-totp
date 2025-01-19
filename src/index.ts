export {totp} from "./totp";
export {hotp} from "./hotp";

export function parseOtpUri(uri: string): IOtpAuth {
  const parsed = new URL(uri);
  if (parsed.protocol !== "otpauth:") {
    throw new Error("Invalid OTP auth URI");
  }

  if (!parsed.searchParams.has("secret")) {
    throw new Error("OTP auth URI missing secret");
  }

  const type = parsed.hostname;
  if (type === "hotp" && !parsed.searchParams.has("counter")) {
    throw new Error("Counter param must be present when type is hotp");
  }

  let account: string;
  let issuer: string | undefined;
  const path = decodeURIComponent(parsed.pathname).replace(/^\//, "");
  if (path.includes(":")) {
    ([issuer, account] = path.split(":"));
  } else {
    account = path;
  }

  if (!issuer && parsed.searchParams.has("issuer")) {
    issuer = decodeURIComponent(parsed.searchParams.get("issuer")!);
  }

  const counter = type === "hotp" ? parseInt(parsed.searchParams.get("counter")!) : undefined;

  const result: IOtpAuth = {
    account,
    type,
    key: parsed.searchParams.get("secret")!,
    algorithm: parsed.searchParams.get("algorithm") ?? "SHA1",
    digits: parseInt(parsed.searchParams.get("digits") ?? "6")
  };

  if (type === "totp") {
    Object.assign(result, {period: parseInt(parsed.searchParams.get("period") ?? "30")})
  }

  if (issuer) {
    Object.assign(result, {issuer});
  }

  if (typeof counter === "number") {
    Object.assign(result, {counter});
  }

  return result;
}