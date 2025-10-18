import { createTypebox } from "@zhexin/typebox";
import { createCertificate } from "@zhexin/typebox/certificate";
import { createDnsRule, createDnsServer, createDnsServers } from "@zhexin/typebox/dns";
import { createEndpoint, createEndpoints } from "@zhexin/typebox/endpoint";
import { createCacheFile, createClashApi, createExperimental, createV2rayApi } from "@zhexin/typebox/experimental";
import { createInbound, createInbounds } from "@zhexin/typebox/inbound";
import { createLog } from "@zhexin/typebox/log";
import { createNtp } from "@zhexin/typebox/ntp";
import { createOutbound, createOutbounds } from "@zhexin/typebox/outbound";
import { createRule, createRuleSet } from "@zhexin/typebox/route";
import { createService } from "@zhexin/typebox/service";

const rule_set_block = createRuleSet({
  tag: "block",
  type: "remote",
  url: "",
  download_detour: "direct-out",
});

const rule_set_proxy = createRuleSet({
  tag: "proxy",
  type: "remote",
  url: "",
  // download_detour: 'unkown-outbound',
});
const rule_set_direct = createRuleSet({
  tag: "direct",
  type: "remote",
  url: "",
});

const ali_dns = createDnsServer({
  tag: "ali-dns",
  type: "https",
  server: "223.5.5.5",
});
const fakeip = createDnsServer({
  tag: "fakeip",
  type: "fakeip",
  inet4_range: "198.18.0.0/15",
  inet6_range: "fc00::/18",
});
const block_dns = createDnsServer({
  tag: "block-dns",
  address: "rcode://success",
});

const tun_in = createInbound({
  tag: "tun-in",
  type: "tun",
  interface_name: "sing-box",
  address: ["172.19.0.1/30", "fdfe:dcba:9876::1/126"],
  auto_route: true,
  stack: "system",
});

const direct_out = createOutbound({
  tag: "direct-out",
  type: "direct",
});

const ss_out = createOutbound({
  tag: "ss-out",
  type: "shadowsocks",
  method: "2022-blake3-aes-128-gcm",
  password: "",
  server: "",
  server_port: 0,
});

const final = createOutbound({
  tag: "final",
  type: "selector",
  outbounds: ["direct-out", "proxy"],
});

const proxy = createOutbound({
  tag: "proxy",
  type: "selector",
  outbounds: ["ss-out", "direct-out"],
});

const outbounds = createOutbounds([
  final,
  proxy,
  direct_out,
  ss_out,
]);

const rule_hijack_dns = createRule({
  port: 53,
  action: "hijack-dns",
});

const config = createTypebox({
  $schema: "https://github.com/jiang-zhexin/typebox/releases/latest/download/schema.json",
  log: {
    level: "warn",
    output: "stdout",
  },
  dns: {
    servers: [ali_dns, fakeip, block_dns],
    rules: [
      {
        outbound: "any",
        server: ali_dns.tag,
      },
      {
        rule_set: rule_set_block.tag,
        server: block_dns.tag,
      },
      // { // This error is used to check type safety
      //     rule_set: 'unkown-rule-set',
      //     server: 'unkown-dns-server',
      // },
      {
        rule_set: rule_set_direct.tag,
        server: ali_dns.tag,
      },
      {
        query_type: "HTTPS",
        rule_set: "proxy",
        server: block_dns.tag,
      },
      {
        query_type: ["A", "AAAA"],
        rule_set: "proxy",
        server: fakeip.tag,
      },
    ],
    final: ali_dns.tag,
  },
  route: {
    rule_set: [
      rule_set_block,
      rule_set_direct,
      // Here will be an error when download_detour is 'unkown-outbound'
      rule_set_proxy,
    ],
    rules: [
      rule_hijack_dns,
      {
        rule_set: "block",
        action: "reject",
      },
      // { // This error is used to check type safety
      //     rule_set: 'unkown-rule-set',
      //     action: 'reject',
      // },
      {
        rule_set: rule_set_direct.tag,
        outbound: direct_out.tag,
      },
      {
        rule_set: rule_set_proxy.tag,
        outbound: "proxy",
      },
    ],
    final: "final",
  },
  inbounds: [
    tun_in,
  ],
  outbounds: outbounds,
});

// Do not delete this.
export default config;
