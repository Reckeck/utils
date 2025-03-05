import { safe } from "../safe"

export const stringify = (data: unknown) => safe(() => JSON.stringify(data))
export const parse = (data: string) => safe<unknown>(() => JSON.parse(data))
