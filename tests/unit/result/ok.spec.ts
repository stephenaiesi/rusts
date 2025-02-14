import Ordering from "../../../src/cmp/Ordering";
import { Err } from "../../../src/result/err";
import { Ok, ok } from "../../../src/result/ok";
import type { Result } from "../../../src/result/types";

describe("Ok", () => {
	const testOk = new Ok(1);

	describe("Creation", () => {
		test("ok() factory method", () => {
			const okVal = ok(1);
			expect(okVal).toBeInstanceOf(Ok);
			expect(okVal.value).toBe(1);
			expectTypeOf(okVal).toEqualTypeOf<Ok<number, never>>();
			expectTypeOf(ok<number, string>(1)).toEqualTypeOf<Ok<number, string>>();
		});

		test("Ok.constructor()", () => {
			const a = new Ok(1);
			expect(a).toBeInstanceOf(Ok);
			expect(a).not.toBe(new Ok(1));
			expect(a.value).toBe(1);
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

	describe("Boolean operations", () => {
		const okLow = new Ok<number, string>(1);
		const okHigh = new Ok<number, string>(3);
		const valueErr = new Err<number, string>("An error occurred");

		test("Ok.and()", () => {
			expect(okLow.and(okHigh)).toBe(okHigh);
			expect(okHigh.and(okLow)).toBe(okLow);
			expect(okLow.and(valueErr)).toBe(valueErr);
		});

		test("Ok.anddThen()", () => {
			const fn = vi.fn((_) => valueErr);
			const andThen = okLow.andThen(fn);
			expect(andThen).toBeInstanceOf(Err);
			expect(andThen.value).toBe("An error occurred");
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(1);
		});

		test("Ok.or()", () => {
			expect(okLow.or(okHigh)).toBe(okLow);
			expect(okHigh.or(okLow)).toBe(okHigh);
			expect(okLow.or(valueErr)).toBe(okLow);
		});

		test("Ok.orElse()", () => {
			const fn = vi.fn((_) => valueErr);
			const orElse = okLow.orElse(fn);
			expect(orElse).toBe(okLow);
			expect(fn).not.toHaveBeenCalledTimes;
		});
	});

	describe("Iteration", () => {
		test("Ok.iter()", () => {
			const iter = testOk.iter();
			expect(iter.next()).toEqual({ value: 1, done: false });
			expect(iter.next()).toEqual({ value: undefined, done: true });
		});
	});

	describe("Copying and Cloning", () => {
		type ValType = {
			a: number;
			b: { c: number };
		};
		const originalValue: ValType = { a: 1, b: { c: 2 } };
		const originalOk = new Ok<ValType, string>(originalValue);

		test("Ok.copy()", () => {
			const okCopy = originalOk.copy();

			// The top-level object should be a new object
			expect(okCopy.value).not.toBe(originalValue);

			// However, the nested object 'b' should be the same reference
			expect(okCopy.value.b).toBe(okCopy.value.b);

			// Modify the nested object in the original
			originalValue.b.c += 1;

			// The change should be visible in the shallow copy
			expect(okCopy.value.b.c).toEqual(originalValue.b.c);
		});

		test("Ok.clone()", () => {
			const okClone = originalOk.clone();

			// The top-level object should be a new object
			expect(okClone.value).not.toBe(originalValue);

			// The nested object 'b' should also be a new object (different reference)
			expect(okClone.value.b).not.toBe(originalValue.b);

			// Modify the nested object in the original
			originalValue.b.c += 1;

			// The deep clone's nested object should remain unchanged
			expect(okClone.value.b.c).not.toEqual(originalValue.b.c);
		});
	});

	describe("Compmarison Operators", () => {
		const okLow = new Ok<number, string>(1);
		const okHigh = new Ok<number, string>(3);
		const valueErr = new Err<number, string>("An error occurred");

		test("Ok.cmp", () => {
			expect(okLow.cmp(okLow)).toBe(Ordering.Equal);
			expect(okLow.cmp(okHigh)).toBe(Ordering.Less);
			expect(okHigh.cmp(okLow)).toBe(Ordering.Greater);
			expect(okLow.cmp(valueErr)).toBe(Ordering.Less);
		});

		test("Ok.eq()", () => {
			expect(okLow.eq(okLow)).toBe(true);
			expect(okLow.eq(okHigh)).toBe(false);
			expect(okLow.eq(valueErr)).toBe(false);
		});

		test("Ok.ne()", () => {
			expect(okLow.ne(okLow)).toBe(false);
			expect(okLow.ne(okHigh)).toBe(true);
			expect(okLow.ne(valueErr)).toBe(true);
		});

		test("Ok.lt()", () => {
			expect(okLow.lt(okHigh)).toBe(true);
			expect(okLow.lt(okLow)).toBe(false);
			expect(okLow.lt(valueErr)).toBe(true);
		});

		test("Ok.le()", () => {
			expect(okLow.le(okHigh)).toBe(true);
			expect(okLow.le(okLow)).toBe(true);
			expect(okLow.le(valueErr)).toBe(true);
		});

		test("Ok.gt()", () => {
			expect(okLow.gt(okHigh)).toBe(false);
			expect(okLow.gt(okLow)).toBe(false);
			expect(okLow.gt(valueErr)).toBe(false);
		});

		test("Ok.ge()", () => {
			expect(okLow.ge(okHigh)).toBe(false);
			expect(okLow.ge(okLow)).toBe(true);
			expect(okLow.ge(valueErr)).toBe(false);
		});

		test("Ok.max()", () => {
			expect(okLow.max(okHigh)).toBe(okHigh);
			expect(okLow.max(okLow)).toBe(okLow);
			expect(okLow.max(valueErr)).toBe(valueErr);
		});

		test("Ok.min()", () => {
			expect(okLow.min(okHigh)).toBe(okLow);
			expect(okLow.min(okLow)).toBe(okLow);
			expect(okLow.min(valueErr)).toBe(okLow);
		});

		test("Ok.clamp", () => {
			const okLow = new Ok<number, string>(1);
			const okMid = new Ok<number, string>(2);
			const okHigh = new Ok<number, string>(3);
			const errVal = new Err<number, string>("An error occurred");

			// x < min
			expect(okLow.clamp(okMid, okHigh)).toBe(okMid);

			// x > max
			expect(okHigh.clamp(okLow, okMid)).toBe(okMid);

			// min < x <max
			expect(okMid.clamp(okLow, okHigh)).toBe(okMid);
		});
	});
});
