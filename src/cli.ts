#!/usr/bin/env node

import { program } from "commander";
import fs from "node:fs";
import path from "node:path";
import { globby } from "globby";
import { simpleValidate } from "./simpleValidate.js";
import { parseYaml } from "./parsers/yaml.js";
import { parseFrontmatter } from "./parsers/frontmatter.js";

program
  .name("validate")
  .description("Validate YAML / front-matter / JSON against a JSON-like schema")
  .argument("<patterns...>", "File(s) or glob pattern(s) to validate")
  .option("--schema <file>", "Schema JSON file", "schema.json")
  .parse();

const patterns = program.args
const { schema: schemaPath } = program.opts<{ schema: string }>();

// ---- load schema ----------------------------------------------------------
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

// ---- collect files --------------------------------------------------------
const files = await globby(patterns);

if (files.length === 0) {
  console.error("No matching files.");
  process.exit(1);
}

// ---- validate each file ---------------------------------------------------
let hasError = false;

for (const file of files) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    const ext = path.extname(file).toLowerCase();
    let data: unknown;

    switch (ext) {
      case ".md":
      case ".mdx":
        data = parseFrontmatter(raw);
        break;
      case ".yaml":
      case ".yml":
        data = parseYaml(raw);
        break;
      case ".json":
        data = JSON.parse(raw);
        break;
      default:
        console.warn(`skip unsupported: ${file}`);
        continue;
    }

    simpleValidate(data, schema, file); // throws on error
  } catch (err) {
    hasError = true;
    console.error(`${file}\n   ${(err as Error).message}\n`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`${files.length} files passed.`);
