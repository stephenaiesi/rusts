import { Ordering } from "../../../src/cmp/Ordering";
import { Err, err } from "../../../src/result/err";
import { Ok } from "../../../src/result/ok";

describe("Err", () => {
	const testErr: Err<number, string> = new Err("Oh no!");

	describe("Creation", () => {
		test("Err.constructor", () => {
			const a = new Err("Oh no!");
			expect(a).toBeInstanceOf(Err);
			expect(a).not.toBe(new Err("Oh no!"));
		});

		test("err() factory function", () => {
			const e = err("Oh no!");
			expect(e).toBeInstanceOf(Err);
			expect(e.unwrapErr()).toBe("Oh no!");
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

	describe("Boolean operations", () => {
		const errLow = new Err<number, number>(404);
		const errHigh = new Err<number, number>(500);
		const okVal = new Ok<number, number>(200);

		test("Err.and()", () => {
			expect(errLow.and(errHigh)).toBe(errLow);
			expect(errHigh.and(errLow)).toBe(errHigh);
			expect(errLow.and(okVal)).toBe(errLow);
		});

		test("Err.anddThen()", () => {
			const fn = vi.fn((_) => okVal);

			expect(errLow.andThen(fn)).toBe(errLow);
			expect(fn).not.toHaveBeenCalled();
		});

		test("Err.or()", () => {
			expect(errLow.or(errLow)).toBe(errLow);
			expect(errLow.or(errHigh)).toBe(errHigh);
			expect(errHigh.or(errLow)).toBe(errLow);
			expect(errLow.or(okVal)).toBe(okVal);
		});

		test("Err.orElse()", () => {
			const fn = vi.fn((e) => okVal);
			const orElse = errLow.orElse(fn);
			expect(orElse).toBe(okVal);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(404);
		});
	});

	describe("Iteration", () => {
		test("Err.iter()", () => {
			const iter = testErr.iter();
			expect(iter.next()).toEqual({ value: undefined, done: true });
		});
	});

	describe("Copying and Cloning", () => {
		type InnerType = {
			msg: string;
			data: {
				a: number;
				b: {
					c: number;
				};
			};
		};

		const originalInner: InnerType = {
			msg: "Something went wrong",

			data: {
				a: 1,
				b: {
					c: 2,
				},
			},
		};

		const originalErr = new Err<number, InnerType>(originalInner);

		test("Err.copy()", () => {
			const errCopy = originalErr.copy();
			expect(errCopy).not.toBe(originalErr);
			expect(errCopy).toBeInstanceOf(Err);

			// The top-level object should be a new object
			expect(errCopy.value).not.toBe(originalErr.value);

			// However, the nested object 'b' should be the same reference
			expect(errCopy.value.data.b).toBe(originalErr.value.data.b);

			// Modify the nested object in the original
			originalInner.data.b.c += 1;

			// The change should be visible in the shallow copy
			expect(errCopy.value.data.b.c).toEqual(originalInner.data.b.c);
		});

		test("Err.clone()", () => {
			const errClone = originalErr.clone();

			expect(errClone).not.toBe(originalErr);
			expect(errClone).toBeInstanceOf(Err);

			// The top-level object should be a new object
			expect(errClone.value).not.toBe(originalErr.value);

			// The deep clone's nested object should remain unchanged
			expect(errClone.value.data.b).not.toBe(originalErr.value.data.b);

			// Modify the nested object in the original
			originalInner.data.b.c += 1;

			// The nested object 'b' should also be a new object (different reference)
			expect(errClone.value.data.b).not.toBe(originalErr.value.data.b);
		});
	});

	describe("Comparison Operators", () => {
		const errLow = new Err<number, number>(404);
		const errHigh = new Err<number, number>(500);
		const okVal = new Ok<number, number>(200);

		test("Ok.cmp", () => {
			expect(errLow.cmp(errLow)).toBe(Ordering.Equal);
			expect(errLow.cmp(errHigh)).toBe(Ordering.Less);
			expect(errHigh.cmp(errLow)).toBe(Ordering.Greater);
			expect(errLow.cmp(okVal)).toBe(Ordering.Greater);
		});
	});
});
