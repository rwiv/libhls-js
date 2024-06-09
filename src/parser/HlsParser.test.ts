import {it} from "vitest";
import {getRootPath} from "utils-js/path";
import path from "path";
import {HlsParser} from "./HlsParser.js";
import {readFile} from "utils-js/file";

it("test master playlist", async () => {
  const p = path.resolve(getRootPath(), "tests", "test_master.m3u8");
  const parser = new HlsParser();
  const result = parser.parseMasterPlaylist(await readFile(p));
  console.log(result);
});

it("test media playlist", async () => {
  const p = path.resolve(getRootPath(), "tests", "test_media.m3u8");
  const parser = new HlsParser();
  const result = parser.parseMediaPlaylist(await readFile(p));
  console.log(result);
});
