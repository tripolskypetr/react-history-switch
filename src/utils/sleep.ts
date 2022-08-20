export const sleep = (timeout = 1000) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), timeout))

export default sleep
