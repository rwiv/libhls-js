import {it} from "vitest";
import {getRootPath} from "utils-js/path";
import path from "path";
import {HlsParser} from "./HlsParser.js";
import {readFile} from "utils-js/file";

it("test master playlist", async () => {
  const p = path.resolve(getRootPath(), "tests", "test_master.m3u8");
  const parser = new HlsParser();
  const m3u8 = await readFile(p);
  const result = parser.parseMasterPlaylist(m3u8);
  console.log(result);
});

it("test media playlist", async () => {
  const p = path.resolve(getRootPath(), "tests", "test_media.m3u8");
  const parser = new HlsParser();
  const m3u8 = await readFile(p);
  const result = parser.parseMediaPlaylist(m3u8);
  console.log(result);
});
