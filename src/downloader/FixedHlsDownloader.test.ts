import {it} from "vitest";
import path from "path";
import {getRootPath} from "utils-js/path";
import {readFile} from "utils-js/file";
import {HlsParser} from "../parser/HlsParser.js";
import {FixedHlsDownloader} from "./FixedHlsDownloader.js";

it("test", async () => {
  const testPath = path.resolve(getRootPath(), "tests");
  const urlPath = path.resolve(testPath, "test_url.txt");
  const baseUrl = await readFile(urlPath);
  const parser = new HlsParser();
  const m3u8Path = path.resolve(testPath, "test_media.m3u8");
  const {segmentPaths, ext} = parser.parseMediaPlaylist(await readFile(m3u8Path), baseUrl);

  const urls = segmentPaths;
  const headers = {};
  const baseDirPath = testPath;
  const outName = "out";

  const downloader = new FixedHlsDownloader({urls, headers, baseDirPath, outName, ext});
  await downloader.download();
});
