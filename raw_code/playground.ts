import { createTypebox } from "@zhexin/typebox";
import { createCertificate } from "@zhexin/typebox/certificate";
import { createDnsRule, createDnsServer, createDnsServers } from "@zhexin/typebox/dns";
import { createEndpoint, createEndpoints } from "@zhexin/typebox/endpoint";
import { createExperimental, createCacheFile, createClashApi, createV2rayApi } from "@zhexin/typebox/experimental";
import { createInbound, createInbounds } from "@zhexin/typebox/inbound";
import { createLog } from "@zhexin/typebox/log";
import { createNtp } from "@zhexin/typebox/ntp";
import { createOutbound, createOutbounds } from "@zhexin/typebox/outbound";
import { createRuleSet, createRule } from "@zhexin/typebox/route";
import { createService } from "@zhexin/typebox/service";

const ss_out = createOutbound({
  type: "shadowsocks",
  tag: "ss-out",
  method: "2022-blake3-aes-128-gcm",
  password: "",
  server: "",
  server_port: 0,
  multiplex: {
    enabled: true,
  },
});

const config = createTypebox({
  log: {},
  dns: {},
  endpoints: [],
  inbounds: [],
  outbounds: [ss_out],
  route: {},
  experimental: {},
});

// Do not delete this.
export default config;
