import { safe } from "../safe";

type Fetch = typeof fetch;
type FetchArgs = Parameters<Fetch>;

export const safeFetch = async (url: FetchArgs[0], init?: FetchArgs[1]) => {
  return await safe(
    fetch(url, {
      ...(init ?? {}),
      credentials: "include",
    })
  );
};
