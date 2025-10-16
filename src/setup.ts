import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

//@ts-ignore
self.MonacoEnvironment = {
  //@ts-ignore
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    } else if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    } else {
      return new editorWorker();
    }
  },
};

import typebox from "../raw_code/typebox/mod.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  typebox,
  "file:///node_modules/@zhexin/typebox/index.ts",
);
import certificate from "../raw_code/typebox/certificate.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  certificate,
  "file:///node_modules/@zhexin/typebox/certificate.ts",
);
import dns from "../raw_code/typebox/dns.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  dns,
  "file:///node_modules/@zhexin/typebox/dns.ts",
);
import endpoint from "../raw_code/typebox/endpoint.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  endpoint,
  "file:///node_modules/@zhexin/typebox/endpoint.ts",
);
import experimental from "../raw_code/typebox/experimental.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  experimental,
  "file:///node_modules/@zhexin/typebox/experimental.ts",
);
import inbound from "../raw_code/typebox/inbound.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  inbound,
  "file:///node_modules/@zhexin/typebox/inbound.ts",
);
import log from "../raw_code/typebox/log.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  log,
  "file:///node_modules/@zhexin/typebox/log.ts",
);
import ntp from "../raw_code/typebox/ntp.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  ntp,
  "file:///node_modules/@zhexin/typebox/ntp.ts",
);
import outbound from "../raw_code/typebox/outbound.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  outbound,
  "file:///node_modules/@zhexin/typebox/outbound.ts",
);
import route from "../raw_code/typebox/route.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  route,
  "file:///node_modules/@zhexin/typebox/route.ts",
);
import rule from "../raw_code/typebox/rule.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  rule,
  "file:///node_modules/@zhexin/typebox/rule.ts",
);
import service from "../raw_code/typebox/service.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  service,
  "file:///node_modules/@zhexin/typebox/service.ts",
);
import tls from "../raw_code/typebox/tls.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  tls,
  "file:///node_modules/@zhexin/typebox/tls.ts",
);
import transport from "../raw_code/typebox/transport.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  transport,
  "file:///node_modules/@zhexin/typebox/transport.ts",
);
import types from "../raw_code/typebox/types.ts?raw";
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  types,
  "file:///node_modules/@zhexin/typebox/types.ts",
);

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  allowSyntheticDefaultImports: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  allowNonTsExtensions: true,
  isolatedModules: true,
});
