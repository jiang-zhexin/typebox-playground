import "./style.css";
import * as monaco from "monaco-editor";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { compileCode } from "./compile";

import defaultCode from "../raw_code/playground?raw";
const codeKey = "typebox-code";
const resultKey = "typebox-result";

const lzcode = decompressFromEncodedURIComponent(window.location.hash.slice(1));
const saveCode = lzcode ??
  localStorage.getItem(codeKey) ??
  defaultCode;

const saveResult = lzcode
  ? undefined
  : (localStorage.getItem(resultKey) ?? undefined);

const resetButten = document.getElementById("reset")!;
resetButten.onclick = () => {
  localStorage.removeItem(codeKey);
  localStorage.removeItem(resultKey);
  editor.setValue(defaultCode);
};

const downloadButten = document.getElementById("download")!;
downloadButten.onclick = () => {
  const configFile = result.getValue();
  const blob = new Blob([configFile], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sing-box-config.json";
  a.click();
  URL.revokeObjectURL(url);
};

const editor = monaco.editor.create(document.getElementById("editor")!, {
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  theme: "vs-dark",
  quickSuggestions: true,
});

editor.setModel(
  monaco.editor.createModel(
    saveCode,
    "typescript",
    monaco.Uri.file("playground.ts"),
  ),
);

const result = monaco.editor.create(document.getElementById("result")!, {
  value: saveResult,
  language: "json",
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  theme: "vs-dark",
  quickSuggestions: { strings: true },
  readOnly: true,
});

function executeCode(code: string) {
  const blobUrl = URL.createObjectURL(
    new Blob([code], { type: "application/javascript" }),
  );

  const print = URL.createObjectURL(
    new Blob(
      [
        `import config from "${blobUrl}";
postMessage(JSON.stringify(config, null, 2));
close();
`,
      ],
      { type: "application/javascript" },
    ),
  );
  const worker = new Worker(print, { type: "module" });
  worker.onmessage = (e) => {
    localStorage.setItem(resultKey, e.data);
    result.setValue(e.data);
  };
  worker.onerror = (e) => console.error(e);
}

window.addEventListener("keydown", async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    const code = editor.getValue();
    localStorage.setItem(codeKey, code);
    window.location.hash = compressToEncodedURIComponent(code);
    executeCode(await compileCode(code));
  }
});

if (!saveResult) executeCode(await compileCode(editor.getValue()));
