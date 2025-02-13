import { Err } from "../../../src/result/err";

describe("Err", () => {
	const testErr: Err<number, string> = new Err("Oh no!");

	describe("Creation", () => {
		test("Err.constructor", () => {
			const a = new Err("Oh no!");
			expect(a).toBeInstanceOf(Err);
			expectTypeOf(a).toEqualTypeOf<Err<unknown, string>>();
			expect(a).not.toBe(new Err("Oh no!"));
		});
	});

	describe("Querying the variant", () => {
		test("Error.value", () => {
			expect(testErr.value).toBe("Oh no!");
		});

		test("Err.isOk", () => {
			expect(testErr.isOk()).toBe(false);
		});

		test("Err.isOkAnd()", () => {
			const successCb = vi.fn((t) => t === 1);
			const errorCb = vi.fn((t) => t === 2);

			expect(testErr.isOkAnd(successCb)).toBe(false);
			expect(testErr.isOkAnd(errorCb)).toBe(false);

			expect(successCb).not.toHaveBeenCalled();
			expect(errorCb).not.toHaveBeenCalled();
		});

		test("Err.isErr()", () => {
			expect(testErr.isErr()).toBe(true);
		});

		test("Err.isErrAnd()", () => {
			expect(testErr.isErrAnd((e) => e === "Oh no!")).toBe(true);
			expect(testErr.isErrAnd((e) => e === "Oh no!2")).toBe(false);
		});

		test("Err.peek()", () => {
			const fn = vi.fn();
			const result = testErr.peek(fn);
			expect(fn).not.toHaveBeenCalled();
			expect(result).toBe(testErr);
		});

		test("Err.peekErr()", () => {
			const fn = vi.fn();
			const result = testErr.peekErr(fn);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(result).toBe(testErr);
		});
	});

	describe("Extracting the contained value", () => {
		test("Err.expect()", () => {
			expect(() => testErr.expect("Expected Err")).toThrowError("Expected Err");
		});

		test("Err.unwrap()", () => {
			expect(() => testErr.unwrap()).toThrowError(
				"Tried to unwrap() an `Err` value!",
			);
		});

		test("Err.unwrapOr()", () => {
			expect(testErr.unwrapOr(2)).toBe(2);
		});

		test("Err.unwrapOrElse()", () => {
			const fn = vi.fn(() => 2);
			expect(testErr.unwrapOrElse(fn)).toBe(2);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		test("Err.unwrapErr()", () => {
			expect(testErr.unwrapErr()).toBe("Oh no!");
		});

		test("Err.expectErr()", () => {
			expect(testErr.expectErr("Expected Err")).toBe("Oh no!");
		});

		test("Err.unwrapErr()", () => {
			expect(testErr.unwrapErr()).toBe("Oh no!");
		});
	});

	describe("Transforming the contained value", () => {
		test("Err.map()", () => {
			const mapFn = vi.fn((t) => t * 2);
			const mapped = testErr.map(mapFn);
			expect(mapped).toBeInstanceOf(Err);
			expect(mapped.value).toBe("Oh no!");
			expect(mapFn).toHaveBeenCalledTimes(0);
		});

		test("Err.mapOr()", () => {
			const mapFn = vi.fn((t) => t * 2);
			const mappedOr = testErr.mapOr(11, mapFn);
			expect(mappedOr).toBe(11);
			expect(mapFn).not.toHaveBeenCalled();
		});

		test("Err.mapOrElse", () => {
			const fallbackFn = vi.fn((e) => e);
			const mapFn = vi.fn((t) => t * 2);
			const mappedOrElse = testErr.mapOrElse(fallbackFn, mapFn);
			expect(mappedOrElse).toBe("Oh no!");
			expect(fallbackFn).toHaveBeenCalledTimes(1);
			expect(fallbackFn).toHaveBeenCalledWith("Oh no!");
			expect(mapFn).not.toHaveBeenCalled();
		});

		test("Err.mapErr()", () => {
			const errMapper = vi.fn((e) => new Error(e));
			const errMapped = testErr.mapErr(errMapper);
			expect(errMapped).toBeInstanceOf(Err);
			expect(errMapped.unwrapErr()).toBeInstanceOf(Error);
			expect(errMapped.unwrapErr().message).toBe("Oh no!");
			expect(errMapper).toHaveBeenCalledTimes(1);
			expect(errMapper).toHaveBeenCalledWith("Oh no!");
		});
	});
});
