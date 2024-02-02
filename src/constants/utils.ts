export const delayExecution = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });