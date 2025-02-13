import { Ok } from "../../../src/result/ok";

describe("Ok", () => {
	const testOk = new Ok(1);

	describe("Creation", () => {
		test("Ok.constructor()", () => {
			const a = new Ok(1);
			expect(a).toBeInstanceOf(Ok);
			expectTypeOf(a).toEqualTypeOf<Ok<number>>();
			expect(a).not.toBe(new Ok(1));
		});
	});

	describe("Querying the variant", () => {
		test("Ok.value", () => {
			expect(testOk.value).toBe(1);
		});

		test("Ok.isOk()", () => {
			expect(testOk.isOk()).toBe(true);
		});

		test("Ok.isOkAnd()", () => {
			expect(testOk.isOkAnd(() => true)).toBe(true);
			expect(testOk.isOkAnd(() => false)).toBe(false);
		});

		test("Ok.isErr()", () => {
			expect(testOk.isErr()).toBe(false);
		});

		test("Ok.isErrAnd()", () => {
			expect(testOk.isErrAnd((_) => true)).toBe(false);
			expect(testOk.isErrAnd((_) => false)).toBe(false);
		});

		test("Ok.peek()", () => {
			const fn = vi.fn((t) => {
				expect(t).toBe(1);
			});
			const result = testOk.peek(fn);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(1);
			expect(result).toBe(testOk);
		});

		test("Ok.peekErr()", () => {
			const fn = vi.fn();
			const result = testOk.peekErr(fn);
			expect(fn).not.toHaveBeenCalled();
			expect(result).toBe(testOk);
		});
	});

	describe("Extracting the contained value", () => {
		test("Ok.expect()", () => {
			expect(testOk.expect("Expected Ok")).toBe(1);
			expect(() => testOk.expect("Expected Ok")).not.toThrowError();
		});

		test("Ok.unwrap()", () => {
			expect(testOk.unwrap()).toBe(1);
			expect(() => testOk.unwrap()).not.toThrowError();
		});

		test("Ok.unwrapOr()", () => {
			expect(testOk.unwrapOr(2)).toBe(1);
		});

		test("Ok.unwrapOrElse()", () => {
			const fn = vi.fn(() => 2);
			expect(testOk.unwrapOrElse(fn)).toBe(1);
			expect(fn).not.toHaveBeenCalled();
		});

		test("Ok.expectErr()", () => {
			expect(() => testOk.expectErr("Expected Err")).toThrowError(
				"Expected Err",
			);
		});

		test("Ok.unwrapErr()", () => {
			expect(() => testOk.unwrapErr()).toThrowError(
				"Tried to unwrappErr() an `Ok` value!",
			);
		});
	});

	describe("Transforming the contained value", () => {
		test("Ok.map()", () => {
			const mapFn = vi.fn((t) => t * 2);
			const mapped = testOk.map(mapFn);
			expect(mapped).toBeInstanceOf(Ok);
			expect(mapped.value).toBe(2);
			expect(mapFn).toHaveBeenCalledTimes(1);
			expect(mapFn).toHaveBeenCalledWith(1);
		});

		test("Ok.mapOr()", () => {
			const mapFn = vi.fn((t) => t * 2);
			const mappedOr = testOk.mapOr(11, mapFn);
			expect(mappedOr).toBe(2);
			expect(mapFn).toHaveBeenCalledTimes(1);
			expect(mapFn).toHaveBeenCalledWith(1);
		});

		test("Ok.mapOrElse", () => {
			const fallbackFn = vi.fn((e) => e);
			const mapFn = vi.fn((t) => t * 2);
			const mappedOrElse = testOk.mapOrElse(fallbackFn, mapFn);
			expect(mappedOrElse).toBe(2);
			expect(fallbackFn).not.toHaveBeenCalled();
			expect(mapFn).toHaveBeenCalledTimes(1);
			expect(mapFn).toHaveBeenCalledWith(1);
		});

		test("Ok.mapErr()", () => {
			const errMapper = vi.fn((_) => new Error("A New Error!"));
			const mappedErr = testOk.mapErr(errMapper);
			expect(mappedErr).toBe(testOk);
			expectTypeOf(mappedErr).toEqualTypeOf<Ok<number, Error>>();
			expect(errMapper).toHaveBeenCalledTimes(0);
		});
	});
});
