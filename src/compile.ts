import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

export async function compileCode(code: string): Promise<string> {
  const result = transpileModule(code, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ESNext,
    },
  });
  return result.outputText;
}
