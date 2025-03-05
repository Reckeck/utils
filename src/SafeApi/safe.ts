import { formatErrorResponse } from "./utils";

type BaseResponse<T> = [result: boolean, data: T, error?: string];
type SuccessResponse<T> = [result: true, data: T];
type ErrorResponse = [result: false, data: never, error?: string];

export type Safe<T> = BaseResponse<T> & (SuccessResponse<T> | ErrorResponse);

export function safe<T>(promise: Promise<T>, err?: string): Promise<Safe<T>>;
export function safe<T>(func: () => T, err?: string): Safe<T>;
export function safe<T>(
  promiseOrFunc: Promise<T> | (() => T),
  err?: string
): Promise<Safe<T>> | Safe<T> {
  if (promiseOrFunc instanceof Promise) {
    return safeAsync(promiseOrFunc, err);
  }

  return safeSync(promiseOrFunc, err);
}

export type UnwrapSafe<T> = T extends Safe<infer U> ? U : never;

async function safeAsync<T>(
  promise: Promise<T>,
  err?: string
): Promise<Safe<T>> {
  try {
    const data = await promise;
    return [true, data];
  } catch (e) {
    return formatErrorResponse(e, err);
  }
}

function safeSync<T>(func: () => T, err?: string): Safe<T> {
  try {
    const data = func();
    return [true, data]; 
  } catch (e) {
    return formatErrorResponse(e, err);
  }
}
