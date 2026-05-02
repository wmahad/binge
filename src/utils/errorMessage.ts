export function errorMessageFromUnknown(
	err: unknown,
	fallback: string,
): string {
	return err instanceof Error ? err.message : fallback;
}
