import "./style.css";
import * as monaco from "monaco-editor";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import "./setup";
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

const resetButton = document.getElementById("reset")!;
resetButton.onclick = () => {
  localStorage.removeItem(codeKey);
  localStorage.removeItem(resultKey);
  editor.setValue(defaultCode);
};

const downloadButton = document.getElementById("download")!;
downloadButton.onclick = () => {
  const configFile = result.getValue();
  const blob = new Blob([configFile], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sing-box-config.json";
  a.click();
  URL.revokeObjectURL(url);
};

const shareButton = document.getElementById("share")!;
shareButton.onclick = () => {
  const url = new URL(window.location.href);
  url.hash = compressToEncodedURIComponent(editor.getValue());
  navigator.clipboard.writeText(url.toString());

  const copied = document.getElementById("codied")!;
  copied.hidden = false;
  setTimeout(() => copied.hidden = true, 2000);
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
  import(
    /* @vite-ignore */ URL.createObjectURL(
      new Blob([code], { type: "application/javascript" }),
    )
  )
    .then((code) => {
      const config = JSON.stringify(code.default, null, 2);
      localStorage.setItem(resultKey, config);
      result.setValue(config);
    })
    .catch((e) => console.error(e));
}

window.addEventListener("keydown", async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    const code = editor.getValue();
    localStorage.setItem(codeKey, code);
    executeCode(await compileCode(code));
  }
});

if (!saveResult) executeCode(await compileCode(editor.getValue()));
