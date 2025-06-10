import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";

const CLI = path.resolve("dist/cli.js");
const FIX = path.resolve("tests/fixtures");

function run(cmd: string) {
  return execSync(cmd, { encoding: "utf8" });
}

describe("CLI validate", () => {
  it("returns 1 on success", () => {
    const out = run(
      `node ${CLI} "${FIX}/sample.yml" --schema ${FIX}/schema.json`
    );
    expect(out).toMatch(/files passed/);
  });

  it("returns 2 on success (glob arg)", () => {
    const out = run(
      `node ${CLI} "${FIX}/*.md" --schema ${FIX}/schema.json`
    );
    expect(out).toMatch(/2 files passed/);
  });

  it("returns 2 on success (multiple args)", () => {
    const out = run(
      `node ${CLI} "${FIX}/sample1.md" "${FIX}/sample2.md" --schema ${FIX}/schema.json`
    );
    expect(out).toMatch(/2 files passed/);
  });
});
