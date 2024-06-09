var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fs from "fs-extra";
import path from "path";
import { getDirPath, getFilename } from "utils-js/path";
import { Retry } from "utils-js/retry";
import { readdir } from "utils-js/file";
import { HttpError } from "../common/errors.js";
export class HlsDownloadManager {
    async downloadSegment(url, headers, num, outDirPath) {
        const res = await this.requestSegment(url, headers);
        if (res.status >= 400) {
            throw new HttpError(res.status);
        }
        const filePath = path.resolve(outDirPath, `${num + 1}.ts`);
        const reader = res.body?.getReader();
        if (reader === undefined) {
            throw Error("reader is null");
        }
        let read = await reader.read();
        while (!read.done) {
            if (read.value !== undefined) {
                await fs.appendFile(filePath, read.value);
            }
            read = await reader.read();
        }
    }
    async requestSegment(url, headers) {
        return fetch(url, { method: 'GET', headers });
    }
    async concatTsFiles(outDirPath) {
        let files = await readdir(outDirPath);
        files.sort((a, b) => {
            const aa = parseInt(getDirPath(a.filename, "."));
            const bb = parseInt(getDirPath(b.filename, "."));
            if (isNaN(aa) || isNaN(bb)) {
                throw Error("parsed data is NaN");
            }
            return aa - bb;
        });
        const filename = getFilename(outDirPath) + ".ts";
        const filePath = path.resolve(outDirPath, "..", filename);
        for (const file of files) {
            const buffer = await fs.readFile(file.absPath);
            await fs.appendFile(filePath, buffer);
        }
    }
}
__decorate([
    Retry(3),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HlsDownloadManager.prototype, "requestSegment", null);
