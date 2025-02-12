import * as barrel from "../../../src/option/index";
import * as None from "../../../src/option/none";
import * as Option from "../../../src/option/option";
import * as Some from "../../../src/option/some";

const allKeys = Object.keys({ ...Option, ...Some, ...None });
const allEntries = { ...Option, ...Some, ...None };

describe("option/index", () => {
	test("exports", () => {
		expect(barrel).toMatchObject(allEntries);

		expect(Object.keys(barrel)).toEqual(allKeys);
	});
});
