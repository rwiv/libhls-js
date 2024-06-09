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
  public readonly status: number;

  constructor(
    status: number,
    message: string = `Http Error: status=${status}`,
    cause: unknown | undefined = undefined,
  ) {
    super(message, {cause});
    this.status = status;
  }
}

export class MultipleError extends Error {

  public readonly errors: any[];

  constructor(
    message: string,
    errors: any[],
    cause: unknown | undefined = undefined,
  ) {
    super(message, {cause});
    this.errors = errors;
  }
}
