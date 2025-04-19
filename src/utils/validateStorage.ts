import { formatErrorResponse, safeJson } from "../SafeApi";
import {
	ISafeStorage,
	localStorage,
	sessionStorage,
} from "../SafeApi/api/storages";
import { Safe } from "../SafeApi";
import { ArkError, BaseType } from "arktype";

export class ValidateStorage<
	Out extends Record<string, unknown>,
	T extends BaseType<Out>,
> {
	schema: T;
	#storage: ISafeStorage;

	constructor(storage: ISafeStorage, schema: T) {
		this.schema = schema;
		this.#storage = storage;
	}

	get length(): number {
		return this.#storage.length;
	}

	key(index: number): string | null {
		return this.#storage.key(index);
	}

	removeItem(key: string): void {
		return this.#storage.removeItem(key);
	}

	setItem(key: string, value: T["t"]): Safe<void> {
		const result = this.schema(value);

		if (result instanceof ArkError) {
			return formatErrorResponse(result, result.name);
		}

		const [isStringified, stringifiedData, error] = safeJson.stringify(
			JSON.stringify(value),
		);

		if (!isStringified) {
			return formatErrorResponse(error, "stringify error");
		}

		return this.#storage.setItem(key, stringifiedData);
	}

	getItem(key: string): string | null {
		const value = this.#storage.getItem(key);

		if (!value) {
			return null;
		}

		return value;
	}

	clear(): void {
		this.#storage.clear();
	}
}

function createValidateStorage<
	Out extends Record<string, unknown>,
	Schema extends BaseType<Out>,
>(store: ISafeStorage) {
	return (schema: Schema) => new ValidateStorage(store, schema);
}

export type ValidateStorageCb = ReturnType<typeof createValidateStorage>;

export const validateLocalStorage = createValidateStorage(localStorage);
export const validateSessionStorage = createValidateStorage(sessionStorage);
