export class M3u8ElemError extends Error {
    constructor(value = "", cause = undefined) {
        const msg = "invalid m3u8 element: " + value;
        super(msg, { cause });
    }
}
export class HttpError extends Error {
    response;
    constructor(response, message = `Http Error: status=${response.status}`, cause = undefined) {
        super(message, { cause });
        this.response = response;
    }
}
