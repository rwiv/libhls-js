export class M3u8ElemError extends Error {
    constructor(value = "", cause = undefined) {
        const msg = "invalid m3u8 element: " + value;
        super(msg, { cause });
    }
}
