import { describe, expect, it } from "vitest";
import { clientNetwork, visitorKey } from "./ratelimit";

describe("clientNetwork (what a visitor limit counts)", () => {
  it("keeps IPv4 and cuts IPv6 to its /64", () => {
    expect(clientNetwork("203.0.113.7")).toBe("203.0.113.7");
    expect(clientNetwork("2001:db8:85a3:12:abcd:1:2:3")).toBe("2001:db8:85a3:12::/64");
    expect(clientNetwork("2001:0db8:85a3:0012::9")).toBe("2001:db8:85a3:12::/64");
    expect(clientNetwork("2001:db8::1")).toBe("2001:db8:0:0::/64");
    expect(clientNetwork("[2001:db8:85a3:12::5]:443")).toBe("2001:db8:85a3:12::/64");
    expect(clientNetwork("fe80::1%eth0")).toBe("fe80:0:0:0::/64");
    expect(clientNetwork("::ffff:198.51.100.4")).toBe("198.51.100.4");
  });

  it("gives every address in one /64 the same visitor key, and other networks a different one", () => {
    const key = (ip: string) => visitorKey(new Headers({ "x-forwarded-for": ip }));
    expect(key("2001:db8:85a3:12::1")).toBe(key("2001:db8:85a3:12:ffff:ffff:ffff:fffe"));
    expect(key("2001:db8:85a3:12::1")).not.toBe(key("2001:db8:85a3:13::1"));
    expect(key("203.0.113.7")).not.toBe(key("203.0.113.8"));
  });
});
