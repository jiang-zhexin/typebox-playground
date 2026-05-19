import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { editor, Uri } from "monaco-editor";
import { compileCode } from "./compile.ts";
import * as C from "./constant.ts";
import "./setup.ts";
import "./style.css";

const getDefaultCode = (() => {
  let defaultCode: string;
  return async () => {
    defaultCode ??= await fetch("/playground.ts").then((resp) => resp.text());
    return defaultCode;
  };
})();

const lzcode = decompressFromEncodedURIComponent(
  globalThis.location.hash.slice(1),
);
const saveCode = lzcode ??
  localStorage.getItem(C.codeKey) ??
  await getDefaultCode();

const saveResult = lzcode
  ? undefined
  : (localStorage.getItem(C.resultKey) ?? undefined);

const resetButton = document.getElementById("reset")!;
resetButton.onclick = async () => {
  localStorage.removeItem(C.codeKey);
  localStorage.removeItem(C.resultKey);
  edit.setValue(await getDefaultCode());
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
  const url = new URL(globalThis.location.href);
  url.hash = compressToEncodedURIComponent(edit.getValue());
  navigator.clipboard.writeText(url.toString());

  const copied = document.getElementById("codied")!;
  copied.hidden = false;
  setTimeout(() => copied.hidden = true, 2000);
};

const edit = editor.create(document.getElementById("editor")!, {
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  theme: "vs-dark",
  quickSuggestions: true,
});

edit.setModel(
  editor.createModel(
    saveCode,
    "typescript",
    Uri.file("playground.ts"),
  ),
);

const result = editor.create(document.getElementById("result")!, {
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
      localStorage.setItem(C.resultKey, config);
      result.setValue(config);
    })
    .catch((e) => console.error(e));
}

globalThis.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    const code = edit.getValue();
    localStorage.setItem(C.codeKey, code);
    executeCode(compileCode(code));
  }
});

if (!saveResult) executeCode(compileCode(edit.getValue()));
