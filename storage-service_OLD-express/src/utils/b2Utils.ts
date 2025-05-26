export const callB2WithBackOff = async <T>(
  requestFn: () => Promise<T>
): Promise<T> => {
  let delaySeconds = 1;
  const maxDelay = 64;
  while (true) {
    const response = await requestFn();
    const status = (response as any).status;
    const statusCode = (response as any).statusCode;
    if (status === 429 || status === 503 || statusCode === "ECONNRESET") {
      if (delaySeconds > maxDelay) {
        return response;
      }
      await sleepSeconds(delaySeconds);
      delaySeconds *= 2;
    } else {
      return response;
    }
  }
};

export const sleepSeconds = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const exponentialBackOff = async (retryCount: number): Promise<void> => {
  const waitTime = Math.pow(2, retryCount);
  await sleepSeconds(waitTime);
};
