import { safe, type Safe } from "./safe";

export function safety<Args extends unknown[], ReturnData>(
  cb: (...args: Args) => ReturnData
) {
  return (...args: Args): Safe<ReturnData> => {
    return safe(() => cb(...args));
  };
}
