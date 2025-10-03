import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

//@ts-ignore
self.MonacoEnvironment = {
  //@ts-ignore
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

import typebox from "../raw_code/typebox/mod.ts?raw";
monaco.editor.createModel(
  typebox,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/index.ts"),
);
import certificate from "../raw_code/typebox/certificate.ts?raw";
monaco.editor.createModel(
  certificate,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/certificate.ts"),
);
import dns from "../raw_code/typebox/dns.ts?raw";
monaco.editor.createModel(
  dns,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/dns.ts"),
);
import endpoint from "../raw_code/typebox/endpoint.ts?raw";
monaco.editor.createModel(
  endpoint,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/endpoint.ts"),
);
import experimental from "../raw_code/typebox/experimental.ts?raw";
monaco.editor.createModel(
  experimental,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/experimental.ts"),
);
import inbound from "../raw_code/typebox/inbound.ts?raw";
monaco.editor.createModel(
  inbound,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/inbound.ts"),
);
import log from "../raw_code/typebox/log.ts?raw";
monaco.editor.createModel(
  log,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/log.ts"),
);
import ntp from "../raw_code/typebox/ntp.ts?raw";
monaco.editor.createModel(
  ntp,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/ntp.ts"),
);
import outbound from "../raw_code/typebox/outbound.ts?raw";
monaco.editor.createModel(
  outbound,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/outbound.ts"),
);
import route from "../raw_code/typebox/route.ts?raw";
monaco.editor.createModel(
  route,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/route.ts"),
);
import rule from "../raw_code/typebox/rule.ts?raw";
monaco.editor.createModel(
  rule,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/rule.ts"),
);
import service from "../raw_code/typebox/service.ts?raw";
monaco.editor.createModel(
  service,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/service.ts"),
);
import tls from "../raw_code/typebox/tls.ts?raw";
monaco.editor.createModel(
  tls,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/tls.ts"),
);
import transport from "../raw_code/typebox/transport.ts?raw";
monaco.editor.createModel(
  transport,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/transport.ts"),
);
import types from "../raw_code/typebox/types.ts?raw";
monaco.editor.createModel(
  types,
  "typescript",
  monaco.Uri.parse("node_modules/@zhexin/typebox/types.ts"),
);

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  allowSyntheticDefaultImports: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  allowNonTsExtensions: true,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  isolatedModules: true,
});
