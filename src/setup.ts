import { format, maxSatisfying, parse, parseRange } from "@std/semver";
import { typescript } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import * as C from "./constant.ts";
import type { PacketMetadata, PacketVersionMetadata } from "./types.ts";

self.MonacoEnvironment = {
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

const versionSelect = document.getElementById(
  "version-select",
)! as HTMLSelectElement;

const metadata: PacketMetadata = await fetch(
  `${C.registry}/${C.packageName}/meta.json`,
)
  .then((resp) => resp.json());

const versions = Object
  .entries(metadata.versions)
  .filter(([_, info]) => info.yanked !== true)
  .map(([v]) => parse(v));

versionSelect.replaceChildren(
  ...["1.14.x", "1.13.x", "1.12.x", "1.11.x", "1.10.x"]
    .map((v) => {
      const version = format(maxSatisfying(versions, parseRange(v))!);
      const o = document.createElement("option");
      o.value = version;
      o.textContent = `v${version}`;
      return o;
    }),
);

async function setLib() {
  const version = versionSelect.value;
  const vm: PacketVersionMetadata = await fetch(
    `${C.registry}/${C.packageName}/${version}_meta.json`,
  ).then((r) => r.json());

  const packetImport = Object.keys(vm.manifest).map((f) => ({
    s: `${C.registry}/${C.packageName}/${version}${f}`,
    d: `${C.prefix}/${C.packageName}${f === "/mod.ts" ? "/index.ts" : f}`,
  }));

  const libs = await Promise.all(
    packetImport.map(({ s, d }) =>
      fetch(s)
        .then((r) => r.text())
        .then((code) => ({ content: code, filePath: d }))
    ),
  );

  typescript.typescriptDefaults.setExtraLibs(libs);
}

versionSelect.onchange = setLib;

await setLib();

typescript.typescriptDefaults.setCompilerOptions({
  target: typescript.ScriptTarget.ESNext,
  module: typescript.ModuleKind.ESNext,

  moduleResolution: typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,

  strict: true,
  skipLibCheck: true,
  noFallthroughCasesInSwitch: true,

  noUnusedLocals: false,
  noUnusedParameters: false,
});
