import {it} from "vitest";
import {ContinuousHlsDownloader} from "./ContinuousHlsDownloader.js";
import path from "path";
import {getRootPath} from "utils-js/path";
import {readFile} from "utils-js/file";

it("test", async () => {
  const testPath = path.resolve(getRootPath(), "tests");
  const urlPath = path.resolve(testPath, "test_continuous_url.txt");

  const baseUrl = await readFile(urlPath);
  const headers = {};
  const baseDirPath = testPath;
  const outName = "out";

  const downloader = new ContinuousHlsDownloader({baseUrl, headers, baseDirPath, outName, getUrl});
  await downloader.download();
});

function getUrl(num: number, baseUrl: string) {
  throw Error("not implemented");
  return "";
}