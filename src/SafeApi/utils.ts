import { Safe } from "./safe"

export function formatErrorResponse(error: unknown, errorName?: string): Safe<never> {
	if (errorName !== undefined) {
		return [false, undefined as never, errorName]
	}

	if (error instanceof Error) {
		return [false, undefined as never, error.message]
	}

	return [false, undefined as never, "error"]
}

export function createCustomError(name: string, message: string, options?: ErrorOptions) {
	return class CustomError extends Error {
		constructor() {
			super(`${name}: ${message}`, options)
		}
	}
}