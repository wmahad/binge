import { isNullish } from "./guards";

export function parseFiniteNumber(raw: unknown): number | undefined {
	// Keep coercion semantics, but never throw on exotic inputs (e.g. Symbol).
	let parsed: number;
	try {
		parsed = Number(raw);
	} catch {
		return undefined;
	}
	return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatNumberOrEmpty(
	value: number | null | undefined,
	fractionDigits = 1,
): string {
	return !isNullish(value) ? value.toFixed(fractionDigits) : "";
}
