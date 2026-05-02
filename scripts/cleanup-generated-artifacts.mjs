/**
 * Post–codegen cleanup: Kubb emits JSON Schemas and `.kubb` helpers we do not use.
 * Strips MSW + Faker re-exports from the generated barrel so the app bundle does
 * not side-effect import test-only code (import from `mocks/` and `msw/` directly
 * in tests that import those modules directly).
 * Invoked from `kubb.config.ts` via `hooks.done` after `pnpm generate`.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const paths = ["src/generated/schemas", "src/generated/.kubb"];

for (const rel of paths) {
	rmSync(join(root, rel), { recursive: true, force: true });
}

const generatedIndex = join(root, "src/generated/index.ts");
const indexSrc = readFileSync(generatedIndex, "utf8");
const pruned = indexSrc
	.split("\n")
	.filter(
		(line) =>
			!line.includes('from "./mocks/faker.ts"') &&
			!line.includes('from "./msw/msw.ts"'),
	)
	.join("\n");
writeFileSync(generatedIndex, pruned);
