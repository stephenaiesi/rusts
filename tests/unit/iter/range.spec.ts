import { Iter, Range, StepBy } from "../../../src/iter/index";
import { None, Some } from "../../../src/option";
import { Err, Ok } from "../../../src/result";

describe("Range", () => {
	test("Range.constructor()", () => {
		// With all arguments
		const range3 = new Range(0, 5, 1);
		expect(range3).toBeInstanceOf(Iter);
		expect(Range.from(0, 5)).toEqual(range3);

		// With two arguments
		const range2 = new Range(0, 5);
		expect(range2).toBeInstanceOf(Iter);
		expect(Range.to(5)).toEqual(range2);

		// With one argument
		const range1 = new Range(5);
		expect(range1).toBeInstanceOf(Iter);
		expect(Range.to(5)).toEqual(range1);
	});

	test("Range.next()", () => {
		const range = new Range(0, 5, 1);
		expect(range.next()).toEqual(Some.of(0));
		expect(range.next()).toEqual(Some.of(1));
		expect(range.next()).toEqual(Some.of(2));
		expect(range.next()).toEqual(Some.of(3));
		expect(range.next()).toEqual(Some.of(4));
		expect(range.next()).toEqual(None.instance);
	});

	test("Range.nextChunk()", () => {
		const range = new Range(0, 5, 1);
		expect(range.nextChunk(2)).toEqual(new Ok([0, 1]));
		expect(range.nextChunk(2)).toEqual(new Ok([2, 3]));
		expect(range.nextChunk(2)).toEqual(new Err([4]));
		expect(range.nextChunk(2)).toEqual(new Err([]));
	});

	test("Range.count()", () => {
		expect(new Range(0, 5).count()).toEqual(5);

		expect(new Range(0, 20, 2).count()).toEqual(10);
	});

	test("Range.last()", () => {
		expect(new Range(0, 5).last()).toEqual(new Some(4));
	});

	test("Range.advanceBy()", () => {
		const range = new Range(0, 5);
		expect(range.advanceBy(2)).toEqual(new Ok(null));
		expect(range.next()).toEqual(Some.of(2));
		expect(range.advanceBy(3)).toEqual(new Err(1));
		expect(range.next()).toEqual(None.instance);
	});

	test("Range.nth()", () => {
		expect(new Range(0, 5).nth(2)).toEqual(new Some(2));
		expect(new Range(0, 5).nth(5)).toEqual(None.instance);
	});

	test("Range.stepBy()", () => {
		const range = new Range(0, 5).stepBy(2);
		expect(range).toBeInstanceOf(StepBy);

		expect(range.next()).toEqual(Some.of(0));
		expect(range.next()).toEqual(Some.of(2));
		expect(range.next()).toEqual(Some.of(4));
		expect(range.next()).toEqual(None.instance);
	});

	test("Range.chain()", () => {
		const range = new Range(0, 3).chain(new Range(3, 5));

		expect(range.next()).toEqual(Some.of(0));
		expect(range.next()).toEqual(Some.of(1));
		expect(range.next()).toEqual(Some.of(2));
		expect(range.next()).toEqual(Some.of(3));
		expect(range.next()).toEqual(Some.of(4));
		expect(range.next()).toEqual(None.instance);
	});

	test("Range.zip()", () => {
		const range1 = new Range(0, 3);
		const range2 = new Range(3, 5);
		const rangeZipped = range1.zip(range2);

		expect(rangeZipped.next()).toEqual(Some.of([0, 3]));
		expect(rangeZipped.next()).toEqual(Some.of([1, 4]));
		expect(rangeZipped.next()).toEqual(None.instance);
	});

	test("Range.intersperse()", () => {
		const iter = new Range(0, 3).intersperse(42);

		expect(iter.next()).toEqual(Some.of(0));
		expect(iter.next()).toEqual(Some.of(42));
		expect(iter.next()).toEqual(Some.of(1));
		expect(iter.next()).toEqual(Some.of(42));
		expect(iter.next()).toEqual(Some.of(2));
		expect(iter.next()).toEqual(None.instance);
	});

	test("Range.IntersperseWith", () => {
		const iter = new Range(0, 3).intersperseWith(() => 42);

		expect(iter.next()).toEqual(Some.of(0));
		expect(iter.next()).toEqual(Some.of(42));
		expect(iter.next()).toEqual(Some.of(1));
		expect(iter.next()).toEqual(Some.of(42));
		expect(iter.next()).toEqual(Some.of(2));
		expect(iter.next()).toEqual(None.instance);
	});

	test("Range.map()", () => {
		const range = new Range(0, 3);
		const mapped = range.map((n) => n * 2);

		expect(mapped.next()).toEqual(Some.of(0));
		expect(mapped.next()).toEqual(Some.of(2));
		expect(mapped.next()).toEqual(Some.of(4));
		expect(mapped.next()).toEqual(None.instance);
	});

	test("Range.fold()", () => {
		const range = new Range(0, 3);
		const folded = range.fold((acc, n) => acc + n, 0);
		expect(folded).toEqual(3);

		const folded2 = Range.from(0, 3).fold((acc, n) => acc + n, 1);
		expect(folded2).toEqual(4);
	});

	test("Range.collect()", () => {
		expect(Range.from(0, 3).collect()).toEqual([0, 1, 2]);

		expect(Range.from(0, 20, 2).collect()).toEqual([
			0, 2, 4, 6, 8, 10, 12, 14, 16, 18,
		]);
	});

	test("Range.groupBy()", () => {
		expect(Range.from(0, 3).groupBy(2).collect()).toEqual([[0, 1], [2]]);
	});
});
