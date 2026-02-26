/**
 * Converte as chaves de um objeto para camelCase recursivamente.
 */
export const toCamel = (obj: unknown): any => {
	if (Array.isArray(obj)) {
		return obj.map((v) => toCamel(v));
	}
	if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(obj)) {
			const camelKey = key.replace(/([-_][a-z])/gi, ($1) =>
				$1.toUpperCase().replace('-', '').replace('_', ''),
			);
			result[camelKey] = toCamel((obj as Record<string, any>)[key]);
		}
		return result;
	}
	return obj;
};

/**
 * Converte as chaves de um objeto para snake_case recursivamente.
 */
export const toSnake = (obj: unknown): any => {
	if (Array.isArray(obj)) {
		return obj.map((v) => toSnake(v));
	}
	if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(obj)) {
			const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
			result[snakeKey] = toSnake((obj as Record<string, any>)[key]);
		}
		return result;
	}
	return obj;
};
