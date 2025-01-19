import {hotp, parseOtpUri, totp} from "../src/index";

describe("parseUrl", () => {
  it("parses a totp url", async () => {
    const result = parseOtpUri("otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA-256&digits=8&period=60");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'totp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA-256',
      digits: 8,
      period: 60,
      issuer: 'ACME Co'
    });

    expect(await totp({...result, timestamp: 1736638420})).toEqual({
      expires: 1736638440,
      token:"80187452",
      next: "68005190",
      previous: "12019689"
    });
  });

  it("uses issuer from params when not specified in path", () => {
    const result = parseOtpUri("otpauth://totp/john.doe@email.com?issuer=ACME%20Co&secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'totp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      issuer: 'ACME Co'
    });
  });

  it("ignores issuer param when path also has issuer", () => {
    const result = parseOtpUri("otpauth://totp/ACME%20Co:john.doe@email.com?issuer=8675309&secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'totp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      issuer: 'ACME Co'
    });
  });

  it("uses defaults for algorithm, digits, and period when not specified", () => {
    const result = parseOtpUri("otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'totp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      issuer: 'ACME Co'
    });
  });

  it("parses an hotp url", async () => {
    const result = parseOtpUri("otpauth://hotp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&counter=1");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'hotp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA1',
      digits: 6,
      counter: 1,
      issuer: 'ACME Co'
    });
  });

  it("throws when protocol is not otpauth", () => {
    expect(() => parseOtpUri("https://localhost/")).toThrow("Invalid OTP auth URI")
  });

  it("throws when no secret is supplied", () => {
    expect(() => parseOtpUri("otpauth://totp/ACME%20Co:john.doe@email.com?issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30"))
      .toThrow("OTP auth URI missing secret")
  });

  it("throws when type is hotp and counter is not specified", () => {
    expect(() => parseOtpUri("otpauth://hotp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6"))
      .toThrow("Counter param must be present when type is hotp");
  });
});