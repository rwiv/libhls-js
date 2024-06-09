import { HlsDownloadManager } from "./HlsDownloadManager.js";
import path from "path";
import { exists } from "utils-js/file";
import fs from "fs-extra";
import { HttpError, MultipleError } from "../common/errors.js";
import { logger } from "utils-js/logger";
export class ContinuousHlsDownloader {
    args;
    manager = new HlsDownloadManager();
    constructor(args) {
        this.args = args;
    }
    async download() {
        let { baseUrl, headers, baseDirPath, outName, getUrl, initNum, parallel } = this.args;
        initNum = initNum || 0;
        parallel = parallel || 10;
        let num = initNum;
        let msCnt = 0;
        while (true) {
            const outDirPath = path.resolve(baseDirPath, outName);
            if (!await exists(outDirPath)) {
                await fs.ensureDir(outDirPath);
            }
            const promises = [];
            for (let i = 0; i < parallel; i++) {
                const url = getUrl(num, baseUrl);
                const promise = this.downloadSegmentWrapper(url, headers, num, outDirPath);
                promises.push(promise);
                num++;
                msCnt++;
                if (msCnt === parallel) {
                    logger.info(`${num - parallel}-${num}`);
                    msCnt = 0;
                }
            }
            const result = await Promise.allSettled(promises);
            await this.manager.concatTsFiles(outDirPath);
            await fs.remove(outDirPath);
            const errors = result
                .filter(it => it.status === "rejected")
                .map(it => it.reason);
            if (errors.length > 0) {
                throw new MultipleError("download requests errors", errors);
            }
            const completes = result.filter(it => {
                return it.value === "COMPLETE";
            });
            if (completes.length > 0) {
                break;
            }
        }
    }
    async downloadSegmentWrapper(url, headers, num, outDirPath) {
        try {
            await this.manager.downloadSegment(url, headers, num, outDirPath);
            return "PROGRESS";
        }
        catch (err) {
            if (err instanceof HttpError) {
                if (err.status > 400) {
                    return "COMPLETE";
                }
                else {
                    throw err;
                }
            }
            else {
                throw err;
            }
        }
    }
}
