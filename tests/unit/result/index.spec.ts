import * as None from "../../../src/result/err";
import * as barrel from "../../../src/result/index";
import * as Some from "../../../src/result/ok";
import * as Option from "../../../src/result/result";

const allKeys = Object.keys({ ...Option, ...Some, ...None });
const allEntries = { ...Option, ...Some, ...None };

describe("option/index", () => {
	test("result/index exports", () => {
		expect(barrel).toMatchObject(allEntries);

		expect(Object.keys(barrel)).toEqual(allKeys);
	});
});
