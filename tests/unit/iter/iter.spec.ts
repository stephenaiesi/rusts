import { Iter, Range } from "./../../../src/iter/index";
import { None, Some } from "./../../../src/option/index";

describe("Iter", () => {
	test("Iter.of() static method", () => {
		// construction with iterable
		const iterable = [1, 2, 3];
		const iter1 = Iter.of(iterable);

		expect(iter1.next()).toEqual(Some.of(1));
		expect(iter1.next()).toEqual(Some.of(2));
		expect(iter1.next()).toEqual(Some.of(3));
		expect(iter1.next()).toEqual(None.instance);

		// construction with iterator
		const iterator = iterable[Symbol.iterator]();
		const iter2 = Iter.of(iterator);

		expect(iter2.next()).toEqual(Some.of(1));
		expect(iter2.next()).toEqual(Some.of(2));
		expect(iter2.next()).toEqual(Some.of(3));
		expect(iter2.next()).toEqual(None.instance);

		// Construction with generator function
		const generator = function* () {
			yield 1;
			yield 2;
			yield 3;
		};
		const iter3 = Iter.of(generator);

		expect(iter3.next()).toEqual(Some.of(1));
		expect(iter3.next()).toEqual(Some.of(2));
		expect(iter3.next()).toEqual(Some.of(3));
		expect(iter3.next()).toEqual(None.instance);
	});

	test("Iter.range() static method", () => {
		const range = Iter.range(0, 5);
		expect(range).toBeInstanceOf(Range);
		expect(range).toStrictEqual(new Range(0, 5));
	});
});
