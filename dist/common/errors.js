export class M3u8ElemError extends Error {
    constructor(value = "", cause = undefined) {
        const msg = "invalid m3u8 element: " + value;
        super(msg, { cause });
    }
}
export class HttpError extends Error {
    status;
    constructor(status, message = `Http Error: status=${status}`, cause = undefined) {
        super(message, { cause });
        this.status = status;
    }
}
export class MultipleError extends Error {
    errors;
    constructor(message, errors, cause = undefined) {
        super(message, { cause });
        this.errors = errors;
    }
}
