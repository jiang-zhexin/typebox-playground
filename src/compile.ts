import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

export function compileCode(code: string): string {
  const result = transpileModule(code, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
    },
  });
  return result.outputText;
}
