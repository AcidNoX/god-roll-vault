const exchangePromises = new Map<string, Promise<void>>();

export function runOAuthCallbackOnce(
  state: string,
  code: string,
  exchange: () => Promise<void>,
): Promise<void> {
  const key = `${state}:${code}`;
  const existing = exchangePromises.get(key);
  if (existing) {
    return existing;
  }

  const promise = exchange().finally(() => {
    exchangePromises.delete(key);
  });
  exchangePromises.set(key, promise);
  return promise;
}
