import { HlsDownloadManager } from "./HlsDownloadManager.js";
import { subListsWithIdx } from "utils-js/list";
import { log } from "jslog";
import path from "path";
import { exists } from "utils-js/file";
import fs from "fs-extra";
import { HttpError } from "../common/errors.js";
export class FixedHlsDownloader {
    args;
    manager = new HlsDownloadManager();
    constructor(args) {
        this.args = args;
    }
    async download() {
        let { urls, headers, baseDirPath, outName, ext, parallel } = this.args;
        ext = ext || "ts";
        parallel = parallel || 10;
        const subs = subListsWithIdx(urls, parallel);
        for (const sub of subs) {
            log.info(`${sub[0].idx}-${sub[0].idx + parallel}`);
            const tempDirPath = path.resolve(baseDirPath, outName);
            if (!await exists(tempDirPath)) {
                await fs.ensureDir(tempDirPath);
            }
            const promises = sub.map(elem => {
                return this.downloadSegment(elem.value, headers, elem.idx, tempDirPath);
            });
            await Promise.all(promises);
            await this.manager.concatTsFiles(tempDirPath, ext);
            await fs.remove(tempDirPath);
        }
    }
    async downloadSegment(url, headers, num, outDirPath) {
        const res = await this.manager.requestSegment(url, headers);
        if (res.status >= 400) {
            throw new HttpError(res);
        }
        await this.manager.writeTempFile(res, num, outDirPath);
    }
}
