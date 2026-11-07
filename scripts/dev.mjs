// Sites supplies Vite-style host/port flags. Normalize them for the Next CLI.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const args = process.argv.slice(2).filter(a => a !== "--strictPort").map(a => a === "--host" ? "--hostname" : a);
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--webpack", ...args], { stdio: "inherit" });
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => child.kill(signal));
child.on("exit", code => process.exit(code ?? 1));
