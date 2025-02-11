import Ordering from "../../../src/cmp/Ordering";
import { None, none } from "../../../src/option/none";
// import { Ok } from "../../../src/result/ok";
// import { Err } from "../../../src/result/err";
import { Some, some } from "../../../src/option/some";

test("some() factory function", () => {
	expect(some(1)).toBeInstanceOf(Some);
	expect(some(1).unwrap()).toBe(1);
});

describe("Some", () => {
	describe("Creation", () => {
		test("Some.constructor()", () => {
			expect(new Some(1)).toBeInstanceOf(Some);
		});

		test("Some.of() static factory method", () => {
			expect(Some.of(1)).toBeInstanceOf(Some);
		});
	});

	const a = new Some(1);
	const b = new Some(2);
	const c = new Some(3);

	describe("Querying The variant", () => {
		test("Some.isSome", () => {
			expect(a.isSome()).toBe(true);
		});

		test("Some.isSomeAnd()", () => {
			expect(a.isSomeAnd((v) => v === 1)).toBe(true);
			expect(a.isSomeAnd((v) => v === 2)).toBe(false);
		});

		test("Some.isNone()", () => {
			expect(a.isNone()).toBe(false);
		});

		test("Some.isNoneOr()", () => {
			expect(a.isNoneOr((v) => v === 1)).toBe(true);
			expect(a.isNoneOr((v) => v === 2)).toBe(false);
		});

		// Inspecting the contained value
		test("Some.peek()", () => {
			const result = a.peek((t) => {
				expect(t).toBe(1);
			});

			expect(result).toBe(a);
		});
	});

	describe("Extracting the contained value", () => {
		test("Some.expect()", () => {
			expect(a.expect("There was an error")).toBe(1);
		});

		test("Some.unwrap()", () => {
			expect(a.unwrap()).toBe(1);
		});

		test("Some.unwrapOr()", () => {
			expect(a.unwrapOr(2)).toBe(1);
		});

		test("Some.unwrapOrElse()", () => {
			expect(a.unwrapOrElse(() => 2)).toBe(1);
		});
	});

	// Transforming the contained value
	describe("Transforming the contained value", () => {
		const fns = {
			cb: (v: number) => v * 2,
		};

		const spy = vi.spyOn(fns, "cb");

		test("Some.map()", () => {
			const spy = vi.spyOn(fns, "cb");
			const mapped = new Some(1).map(fns.cb);
			expect(mapped).toBeInstanceOf(Some);
			expect(mapped.unwrap()).toBe(2);
			expect(spy).toHaveBeenCalledTimes(1);
		});

		test("Some.mapOr()", () => {
			const mappedOr = a.mapOr(11, fns.cb);
			expect(mappedOr).toBe(2);
			expect(spy).toHaveBeenCalledTimes(2);
		});

		test("Some.mapOrElse", () => {
			const mappedOrElse = a.mapOrElse(() => 11, fns.cb);
			expect(mappedOrElse).toBe(2);
			expect(spy).toHaveBeenCalledTimes(3);
		});

		test("Some.filter()", () => {
			expect(a.filter((v) => v === 1)).toBe(a);
			expect(a.filter((v) => v === 2)).toBe(none);
		});

		test("Some.flatten()", () => {
			const inner = new Some(1);
			const middle = new Some(inner);
			const outer = new Some(middle);

			expect(outer.flatten()).toBe(middle);
			expect(middle.flatten()).toBe(inner);
		});

		// it("can be transposed with result", () => {
		// 	const optOk = new Some(new Ok<number, string>(1));
		// 	const transposed = optOk.transpose();
		// 	const unwrapped = transposed.unwrap();

		// 	expect(transposed).toBeInstanceOf(Ok);
		// 	expect(unwrapped).toBeInstanceOf(Some);
		// 	expect(unwrapped.unwrap()).toBe(1);

		// 	const optErr = new Some(new Err<number, string>("something went wrong!"));
		// 	const errTransposed = optErr.transpose();

		// 	expect(errTransposed).toBeInstanceOf(Err);
		// 	expect(errTransposed.unwrapErr()).toBe("something went wrong!");
		// });

		// it("can be transformed into an Ok result", () => {
		// 	// okOr
		// 	const toOkOr = a.okOr(11);
		// 	expect(toOkOr).toBeInstanceOf(Ok);
		// 	expect(a.unwrap()).toBe(1);

		// 	// okOrElse
		// 	const toOkOrElse = a.okOrElse(() => 11);
		// 	expect(toOkOrElse).toBeInstanceOf(Ok);
		// 	expect(toOkOrElse.unwrap()).toBe(1); // TODO: transpose()
		// });
	});

	describe("Combining options", () => {
		const a = new Some(1);
		const b = new Some("a");

		test("Some.zip()", () => {
			const z = a.zip(b);
			expect(z).toBeInstanceOf(Some);
			expect(z.unwrap()).toStrictEqual([1, "a"]);
			expect(a.zip(none)).toBe(none);
		});

		test("Some.zipWith()", () => {
			const z2 = a.zipWith(b, (a, b) => a + b);
			expect(z2).toBeInstanceOf(Some);
			expect(z2.unwrap()).toBe("1a");
			expect(a.zipWith(none, (a, b) => a + b)).toBe(none);
		});

		test("Some.unzip()", () => {
			const z = a.zip(b);
			const unzipped = z.unzip();
			expect(unzipped).toBeInstanceOf(Array);
			expect(unzipped[0]).toBeInstanceOf(Some);
			expect(unzipped[0].unwrap()).toBe(1);
			expect(unzipped[1]).toBeInstanceOf(Some);
			expect(unzipped[1].unwrap()).toBe("a");
		});
	});

	describe("Boolean operations", () => {
		const a = new Some(1);
		const b = new Some(2);

		test("Some.and()", () => {
			expect(a.and(b)).toBe(b);
			expect(a.and(none)).toBe(none);
		});

		test("Some.andThen()", () => {
			const fmapped = a.andThen((a) => b.andThen((b) => new Some(a + b)));
			expect(fmapped).toBeInstanceOf(Some);
			expect(fmapped.unwrap()).toBe(3);
		});

		test("Some.or()", () => {
			expect(a.or(b)).toBe(a);
			expect(a.or(none)).toBe(a);
		});

		test("Some.orElse()", () => {
			const fmapped2 = a.orElse(() => b);
			expect(fmapped2).toBeInstanceOf(Some);
			expect(fmapped2.unwrap()).toBe(1);

			const fmapped3 = a.orElse(() => none);
			expect(fmapped3).toBeInstanceOf(Some);
			expect(fmapped3.unwrap()).toBe(1);
		});

		test("Some.xor()", () => {
			expect(a.xor(b)).toBe(none);
			expect(a.xor(none)).toBe(a);
		});
	});

	describe("Iteration", () => {
		test("Some.iter()", () => {
			const iter = a.iter();
			expect(iter.next()).toEqual({ value: 1, done: false });
			expect(iter.next()).toEqual({ value: undefined, done: true });
		});
	});

	describe("Creating new options from existing ones", () => {
		test("Some.inserted()", () => {
			const s = new Some(1);
			const b = s.inserted("a");
			expect(b).toBeInstanceOf(Some);
			expect(b.unwrap()).toBe("a");
			expect(s.unwrap()).toBe(1);
		});

		const original = { a: 1, b: { c: 2 } };
		const someOriginal = new Some(original);

		test("Some.copy()", () => {
			const someCopy = someOriginal.copy();

			// The top-level object should be a new object
			expect(someCopy.value).not.toBe(original);

			// However, the nested object 'b' should be the same reference
			expect(someCopy.value.b).toBe(original.b);

			// Modify the nested object in the original
			original.b.c = 42;
			// The change should be visible in the shallow copy
			expect(someCopy.value.b.c).toBe(42);
		});

		test("Some.clone()", () => {
			const original = { a: 1, b: { c: 2 } };
			const someOriginal = new Some(original);
			const someClone = someOriginal.clone();

			// The top-level object should be a new object
			expect(someClone.value).not.toBe(original);

			// The nested object 'b' should also be a new object (different reference)
			expect(someClone.value.b).not.toBe(original.b);

			// Modify the nested object in the original
			original.b.c = 42;
			// The deep clone's nested object should remain unchanged
			expect(someClone.value.b.c).toBe(2);
		});
	});

	/* Comparison Operators */
	describe("Comparison Operators", () => {
		test("Some.cmp()", () => {
			expect(a.cmp(a)).toEqual(Ordering.Equal);
			expect(a.cmp(a)).toEqual(Ordering.Equal);
			expect(a.cmp(b)).toEqual(Ordering.Less);
			expect(b.cmp(a)).toEqual(Ordering.Greater);
			expect(a.cmp(none)).toEqual(Ordering.Greater);
		});

		test("Some.eq()", () => {
			// eq()
			expect(a.eq(a)).toBe(true);
			expect(a.eq(b)).toBe(false);
			expect(a.eq(none)).toBe(false);
		});

		test("Some.ne()", () => {
			// ne()
			expect(a.ne(a)).toBe(false);
			expect(a.ne(b)).toBe(true);
			expect(a.ne(none)).toBe(true);
		});

		test("Some.lt()", () => {
			// lt()
			expect(a.lt(b)).toBe(true);
			expect(a.lt(a)).toBe(false);
			expect(b.lt(a)).toBe(false);
			expect(a.lt(none)).toBe(false);
		});

		test("Some.le()", () => {
			// le()
			expect(a.le(a)).toBe(true);
			expect(a.le(b)).toBe(true);
			expect(a.le(none)).toBe(false);
		});

		test("Some.gt()", () => {
			// gt()
			expect(a.gt(a)).toBe(false);
			expect(a.gt(b)).toBe(false);
			expect(b.gt(a)).toBe(true);
			expect(a.gt(none)).toBe(true);
		});

		test("Some.ge()", () => {
			// ge()
			expect(a.ge(a)).toBe(true);
			expect(a.ge(b)).toBe(false);
			expect(a.ge(none)).toBe(true);
		});

		test("max()", () => {
			expect(a.max(b)).toBe(b);
			expect(a.max(a)).toBe(a);
			expect(b.max(a)).toBe(b);
			expect(a.max(none)).toBe(a);
		});

		test("min()", () => {
			expect(a.min(b)).toBe(a);
			expect(b.min(a)).toBe(a);
			expect(a.min(none)).toBe(none);
		});

		test("clamp()", () => {
			expect(a.clamp(b, c)).toBe(b);
			expect(b.clamp(a, b)).toBe(b);
			expect(c.clamp(a, b)).toBe(b);
			expect(a.clamp(none, b)).toBe(a);
			expect(a.clamp(b, none)).toBe(b);
		});
	});
});
