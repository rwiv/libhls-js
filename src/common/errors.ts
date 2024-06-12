export class M3u8ElemError extends Error {
  constructor(
    value: string = "",
    cause: unknown | undefined = undefined,
  ) {
    const msg = "invalid m3u8 element: " + value;
    super(msg, {cause});
  }
}

export class HttpError extends Error {

  constructor(
    public readonly response: Response,
    message: string = `Http Error: status=${response.status}`,
    cause: unknown | undefined = undefined,
  ) {
    super(message, {cause});
  }
}
