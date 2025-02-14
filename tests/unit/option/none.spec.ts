import Ordering from "../../../src/cmp/Ordering";
import { None, none } from "../../../src/option/none";
import type { Option } from "../../../src/option/option";
// import { Ok } from "../../../src/result/ok";
// import { Err } from "../../../src/result/err";
import { Some } from "../../../src/option/some";

describe("None", () => {
	describe("Creation", () => {
		test("None.instance", () => {
			expect(None.instance).toBeInstanceOf(None);
		});

		test("`none` exported instance", () => {
			expect(none).toBeInstanceOf(None);
		});

		test("None.of() static factory method", () => {
			const inst = None.of();
			expect(inst).toBeInstanceOf(None);
			expectTypeOf(inst).toEqualTypeOf<None<never>>();

			const typeInst = None.of<number>();
			expect(typeInst).toBeInstanceOf(None);
			expectTypeOf(typeInst).toEqualTypeOf<None<number>>();
		});
	});

	const a = new Some(1);
	const b = new Some(2);
	const c = new Some(3);
	const n = None.instance;

	describe("Querying The variant", () => {
		test("None.isSome", () => {
			expect(n.isSome()).toBe(false);
		});

		test("None.isSomeAnd()", () => {
			expect(n.isSomeAnd((v) => v === 1)).toBe(false);
			expect(n.isSomeAnd((v) => v === 2)).toBe(false);
		});

		test("None.isNone()", () => {
			expect(n.isNone()).toBe(true);
		});

		test("None.isNoneOr()", () => {
			expect(n.isNoneOr((v) => v === 1)).toBe(true);
			expect(n.isNoneOr((v) => v === 2)).toBe(true);
		});

		// Inspecting the contained value
		test("None.peek()", () => {
			const cb = vi.fn(() => {});

			expect(n.peek(cb)).toBe(n);
			expect(cb).not.toHaveBeenCalled();
		});
	});

	describe("Extracting the contained value", () => {
		test("None.expect()", () => {
			expect(() => none.expect("Expected None")).toThrowError("Expected None");
		});

		test("None.unwrap()", () => {
			expect(() => none.unwrap()).toThrowError(
				"Tried to unwrap a `None` value!",
			);
		});

		test("None.unwrapOr()", () => {
			expect(none.unwrapOr(2)).toBe(2);
		});

		const fn = vi.fn(() => 2);

		test("None.unwrapOrElse()", () => {
			expect(none.unwrapOrElse(fn)).toBe(2);
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	// Transforming the contained value
	describe("Transforming the contained value", () => {
		const cb = vi.fn((t) => t * 2);

		test("None.map()", () => {
			const mapped = none.map(cb);
			expect(mapped).toBe(none);
			expectTypeOf(mapped).toEqualTypeOf<None<number>>();
			expect(cb).not.toHaveBeenCalled();
		});

		test("None.mapOr()", () => {
			const mappedOr = none.mapOr(11, cb);
			expect(mappedOr).toBe(11);
			expect(cb).not.toHaveBeenCalled();
		});

		test("None.mapOrElse", () => {
			const factoryFunc = vi.fn(() => 11);
			const mappedOrElse = none.mapOrElse(factoryFunc, cb);
			expect(factoryFunc).toHaveBeenCalledTimes(1);
			expect(mappedOrElse).toBe(11);
			expect(cb).not.toHaveBeenCalled();
		});

		test("None.filter()", () => {
			const d: Option<number> = none as Option<number>;
			expect(d.filter((v) => v === 1)).toBe(none);
			expect(d.filter((v) => v === 2)).toBe(none);
		});

		test("None.flatten()", () => {
			expect(none.flatten()).toBe(none);

			const nestedNone: None<None<None<string>>> =
				None.of<None<None<string>>>();

			expectTypeOf(nestedNone.flatten()).toEqualTypeOf<None<None<string>>>();

			expectTypeOf(nestedNone.flatten().flatten()).toEqualTypeOf<
				None<string>
			>();

			// const n = none.flatten()

			// const s = Some.of(Some.of(Some.of("a")));
			// const a = s.flatten().flatten().flatten();

			// const flattened = nestedNone.flatten().flatten();
			// const z = none.flatten().flatten();
			// const n = Some.of(None.of<string>()).flatten();
			// const inner = new Some(1);
			// const middle = new Some(inner);
			// const outer = new Some(middle);
			// expect(outer.flatten()).toBe(middle);
			// expect(middle.flatten()).toBe(inner);
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

		test("None.zip()", () => {
			const z = none.zip(a);
			expect(z).toBe(none);
		});

		test("None.zipWith()", () => {
			const zw = none.zipWith(Some.of(3), (a, b) => a + b);
			expect(zw).toBe(none);
		});

		test("Some.unzip()", () => {
			const z = none.zip(b);
			const unzipped = z.unzip();

			expect(unzipped).toBeInstanceOf(Array);
			expect(unzipped[0]).toBe(none);
			expect(unzipped[1]).toBe(none);
		});
	});

	describe("Boolean operations", () => {
		const a = new Some(1);

		test("None.and()", () => {
			expect(none.and(b)).toBe(none);
			expect(none.and(none)).toBe(none);
		});

		test("None.andThen()", () => {
			const fmap = none.andThen((t) => b);
			expect(fmap).toBe(none);
			const fmapped = none.andThen((t) => b.andThen((u) => new Some(t + u)));
			expect(fmapped).toBeInstanceOf(None);
			expectTypeOf(fmapped).toEqualTypeOf<None<number>>();
		});

		test("None.or()", () => {
			expect(none.or(a)).toBe(a);
			expect(a.or(none)).toBe(a);
		});

		test("None.orElse()", () => {
			const fmapped2 = none.orElse(() => b);
			expect(fmapped2).toBe(b);
		});

		test("None.xor()", () => {
			const n = none as None<number>;
			expect(n.xor(b)).toBe(b);
			expect(none.xor(none)).toBe(none);
		});
	});

	describe("Iteration", () => {
		test("None.iter()", () => {
			const iter = none.iter();
			expect(iter.next()).toEqual({ value: undefined, done: true });
		});
	});

	describe("Creating new options from existing ones", () => {
		test("None.inserted()", () => {
			const b = none.inserted("a");
			expect(b).toBeInstanceOf(Some);
			expect(b.unwrap()).toBe("a");
		});

		test("None.insertedWith()", () => {
			const fn = vi.fn(() => "a");
			const b = none.insertedWith(fn);
			expect(b).toBeInstanceOf(Some);
			expect(b.unwrap()).toBe("a");
			expect(fn).toHaveBeenCalledTimes(1);
		});

		const original = { a: 1, b: { c: 2 } };

		test("None.copy()", () => {
			const noneCopy = none.copy();
			expect(noneCopy).toBe(none);
		});

		test("None.clone()", () => {
			const noneClone = none.clone();
			expect(noneClone).toBeInstanceOf(None);
			expect(noneClone).not.toBe(none);
		});
	});

	/* Comparison Operators */
	describe("Comparison Operators", () => {
		test("None.cmp()", () => {
			expect(none.cmp(none)).toEqual(Ordering.Equal);
			expect(none.cmp(a)).toEqual(Ordering.Less);
		});

		test("None.eq()", () => {
			// eq()
			expect(none.eq(none)).toBe(true);
			expect(none.eq(None.of())).toBe(true);
			expect(none.eq(Some.of("a"))).toBe(false);
		});

		test("None.ne()", () => {
			// ne()
			expect(a.ne(a)).toBe(false);
			expect(a.ne(b)).toBe(true);
			expect(a.ne(none)).toBe(true);
		});

		test("None.lt()", () => {
			// lt()
			expect(a.lt(b)).toBe(true);
			expect(a.lt(a)).toBe(false);
			expect(b.lt(a)).toBe(false);
			expect(a.lt(none)).toBe(false);
		});

		test("None.le()", () => {
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
