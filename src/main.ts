import "./style.css";
import * as monaco from "monaco-editor";
import { compileCode } from "./compile";

import defaultCode from "../raw_code/playground?raw";
const codeKey = "typebox-code";
const saveCode = localStorage.getItem(codeKey) ?? defaultCode;

const resetButten = document.getElementById("reset")!;
resetButten.onclick = () => {
  localStorage.removeItem(codeKey);
  editor.setValue(defaultCode);
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
    monaco.Uri.file("playground.ts")
  )
);

const result = monaco.editor.create(document.getElementById("result")!, {
  value: "{}",
  language: "json",
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  theme: "vs-dark",
  quickSuggestions: { strings: true },
  readOnly: true,
});

let worker: Worker;
function executeCode(code: string) {
  if (worker) worker.terminate();

  const blobUrl = URL.createObjectURL(
    new Blob([code], { type: "application/javascript" })
  );

  const print = URL.createObjectURL(
    new Blob(
      [
        `import config from "${blobUrl}";
config.$schema = "https://github.com/jiang-zhexin/typebox/releases/latest/download/schema.json";
postMessage(JSON.stringify(config, null, 2));
`,
      ],
      { type: "application/javascript" }
    )
  );
  worker = new Worker(print, { type: "module" });
  worker.onmessage = (e) => {
    result.setValue(e.data);
  };
}

window.addEventListener("keydown", async (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    const code = editor.getValue();
    localStorage.setItem(codeKey, code);
    executeCode(await compileCode(code));
  }
});
executeCode(await compileCode(editor.getValue()));
