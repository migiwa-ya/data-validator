import { describe, it, expect } from "vitest";
import { simpleValidate } from "../src/simpleValidate.js";
import schema from "./fixtures/schema.json";

describe("simpleValidate", () => {
  it("passes for valid data", () => {
    expect(() =>
      simpleValidate({ id: "a", name: "b" }, schema)
    ).not.toThrow();
  });

  it("throws on missing field", () => {
    expect(() =>
      simpleValidate({ id: "a" }, schema)
    ).toThrow(/Missing required field/);
  });
});
