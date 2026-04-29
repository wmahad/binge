/**
 * Post–codegen cleanup: Kubb emits JSON Schemas and `.kubb` helpers we do not use.
 * Invoked from `kubb.config.ts` via `hooks.done` after `pnpm generate`.
 */
import { rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const paths = ["src/generated/schemas", "src/generated/.kubb"];

for (const rel of paths) {
	rmSync(join(root, rel), { recursive: true, force: true });
}
