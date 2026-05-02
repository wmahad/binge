export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

export function isNullish(value: unknown): value is null | undefined {
	return value == null;
}
