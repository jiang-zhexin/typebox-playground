import { initialize, transform } from "esbuild-wasm";
import esbuildWasmUrl from "esbuild-wasm/esbuild.wasm?url";
import { packages } from "@babel/standalone";

await initialize({ wasmURL: esbuildWasmUrl });

export async function compileCode(code: string): Promise<string> {
  const result = await transform(transformImports(code), {
    loader: "ts",
    format: "esm",
  });
  return result.code;
}

function transformImports(code: string) {
  const { parser, types, generator } = packages;
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["typescript"],
    sourceFilename: "example.ts",
  });

  const imports = ast.program.body.filter((it) =>
    types.isImportDeclaration(it)
  );
  if (imports.length === 0) {
    return code;
  }
  imports.forEach((it) => {
    it.source.value = `https://esm.sh/jsr/${it.source.value}`;
  });
  const newCode = generator.default(ast).code;
  return newCode;
}
