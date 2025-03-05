export { safe } from './safe'
export { safety } from './safety'
export { createCustomError } from './utils'

import * as SafeJson from './api/SafeJson'
import { safeFetch } from './api/SafeFetch'

export const safeApi = {
  SafeJson,
  safeFetch
} as const
