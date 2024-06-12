import { HlsDownloadManager } from "./HlsDownloadManager.js";
import path from "path";
import { exists } from "utils-js/file";
import fs from "fs-extra";
import { logger } from "utils-js/logger";
import { removeQueryString } from "utils-js/url";
import { getExt } from "utils-js/path";
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
        let ext = getExt(removeQueryString(baseUrl));
        if (ext === "") {
            ext = "ts";
        }
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
                const promise = this.downloadSegment(url, headers, num, outDirPath);
                promises.push(promise);
                num++;
                msCnt++;
                if (msCnt === parallel) {
                    logger.info(`${num - parallel}-${num}`);
                    msCnt = 0;
                }
            }
            const result = await Promise.all(promises);
            await this.manager.concatTsFiles(outDirPath, ext);
            await fs.remove(outDirPath);
            if (result.filter(it => it === "COMPLETE").length > 0) {
                break;
            }
        }
    }
    async downloadSegment(url, headers, num, outDirPath) {
        const res = await this.manager.requestSegment(url, headers);
        if (this.args.isComplete(res)) {
            return "COMPLETE";
        }
        await this.manager.writeTempFile(res, num, outDirPath);
        return "PROGRESS";
    }
}
