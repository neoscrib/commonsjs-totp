import {parseOtpUri, totp} from "../src/index";

describe("parseUrl", () => {
  it("parses a totp url", async () => {
    const result = parseOtpUri("otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30");
    expect(result).toEqual({
      account: 'john.doe@email.com',
      type: 'totp',
      key: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
      algorithm: 'SHA1',
      digits: 6,
      interval: 30,
      issuer: 'ACME Co'
    });

    expect(await totp({...result, timestamp: 1736638420})).toEqual("802423");
  });
});