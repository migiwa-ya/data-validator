import { describe, it, expect } from "vitest";
import { parseYaml, parseFrontmatter } from "../src/index.js";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

function read(p: string) {
  return fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", p),
    "utf8",
  );
}

describe("parsers", () => {
  it("parseYaml", () => {
    const data = parseYaml(read("sample.yml")) as any;
    expect(data).toEqual({ id: "shr-001", name: "Sample Shrine" });
  });

  it("parseFrontmatter", () => {
    const data = parseFrontmatter(read("sample1.md"));
    expect(data).toEqual({ id: "shr-001", name: "Frontmatter Shrine" });
  });
});
