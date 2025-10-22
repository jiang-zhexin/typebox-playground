import { languages } from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import type { PacketMetadata, PacketVersionMetadata } from "./types";

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

const registry = "https://jsr.io";
const name = "@zhexin/typebox";
const prefix = "file:///node_modules";
const versionSelect = document.getElementById(
  "version-select",
)! as HTMLSelectElement;

const metadata: PacketMetadata = await fetch(`${registry}/${name}/meta.json`)
  .then((resp) => resp.json());

Object
  .entries(metadata.versions)
  .filter(([_, info]) => info.yanked !== true)
  .sort(([v1], [v2]) => {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      const p1 = parts1.at(i) ?? 0;
      const p2 = parts2.at(i) ?? 0;
      if (p1 > p2) return -1;
      if (p1 < p2) return 1;
    }
    return 0;
  })
  .map(([v]) => {
    const o = document.createElement("option");
    o.selected = v === metadata.latest;
    o.value = v;
    o.textContent = `v${v}`;
    versionSelect.appendChild(o);
  });

async function setLib() {
  const version = versionSelect.value;
  const vm: PacketVersionMetadata = await fetch(
    `${registry}/${name}/${version}_meta.json`,
  ).then((r) => r.json());

  const packetImport = Object.keys(vm.manifest).map((f) => ({
    s: `${registry}/${name}/${version}${f}`,
    d: `${prefix}/${name}${f === "/mod.ts" ? "/index.ts" : f}`,
  }));

  languages.typescript.typescriptDefaults.setExtraLibs(
    await Promise.all(
      packetImport.map(({ s, d }) =>
        fetch(s)
          .then((r) => r.text())
          .then((code) => ({
            content: code,
            filePath: d,
          }))
      ),
    ),
  );
}

versionSelect.onchange = setLib;

await setLib();

languages.typescript.typescriptDefaults.setCompilerOptions({
  target: languages.typescript.ScriptTarget.ESNext,
  module: languages.typescript.ModuleKind.ESNext,

  moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
  noEmit: true,

  strict: true,
  skipLibCheck: true,
  noFallthroughCasesInSwitch: true,

  noUnusedLocals: false,
  noUnusedParameters: false,
});
