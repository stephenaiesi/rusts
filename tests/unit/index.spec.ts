import * as src from "../../src";
import * as lib from "../../src/lib";

describe("package lib", () => {
	it("should expose a logger ", () => {
		expect(lib.log).toBeDefined();
	});
});

describe("package index", () => {
	it("should expose an identity function", () => {
		expect(src.identity).toBeDefined();
		expect(src.identity(2)).toBe(2);
	});
});
