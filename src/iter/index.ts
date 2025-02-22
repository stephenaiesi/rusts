import { None, type Option, Some } from "../option/index.js";
import { Err, Ok, type Result } from "../result/index.js";

abstract class Iter<T> implements Iterable<T> {
	abstract next(): Option<T>;

	static of<T>(
		iter: Iterable<T> | Iterator<T> | (() => Generator<T>),
	): IterIter<T> {
		return new IterIter(iter);
	}

	static range(start: number, stop?: number, step = 1): Range {
		return new Range(start, stop, step);
	}

	*[Symbol.iterator](): Iterator<T> {
		while (true) {
			const next = this.next();
			if (next.isSome()) {
				yield next.unwrap();
			} else {
				break;
			}
		}
	}

	nextChunk(n: number): Result<T[], T[]> {
		const arr: T[] = [];
		for (let i = 0; i < n; i++) {
			const next = this.next();
			if (next.isSome()) {
				arr.push(next.value);
			} else {
				return new Err(arr);
			}
		}
		return new Ok(arr);
	}

	count(): number {
		let count = 0;
		while (this.next().isSome()) {
			count++;
		}
		return count;
	}

	last(): Option<T> {
		let last: Option<T> = None.instance;

		while (true) {
			const next = this.next();
			if (next.isSome()) {
				last = next;
			} else {
				return last;
			}
		}
	}

	advanceBy(n: number): Result<null, number> {
		for (let i = n; i > 0; i--) {
			const next = this.next();
			if (next.isSome()) {
				continue;
			}
			return new Err(i);
		}
		return new Ok(null);
	}

	nth(n: number): Option<T> {
		return this.advanceBy(n).mapOrElse(
			(_e) => None.instance,
			(_t) => this.next(),
		);
	}

	stepBy(n: number): StepBy<T> {
		return new StepBy(this, n);
	}

	chain<B>(other: Iter<B>): Chain<T, B> {
		return new Chain(this, other);
	}

	zip<U>(other: Iter<U>): Iter<[T, U]> {
		return new Zip(this, other);
	}

	intersperse(sep: T): Intersperse<T> {
		return new Intersperse(this, sep);
	}

	intersperseWith(sep: () => T): IntersperseWith<T> {
		return new IntersperseWith(this, sep);
	}

	map<U>(fn: (t: T) => U): Mapped<T, U> {
		return new Mapped(this, fn);
	}

	fold<U>(fn: (acc: U, t: T) => U, acc: U): U {
		let initial = acc;

		for (const t of this) {
			initial = fn(initial, t);
		}

		return initial;
	}

	collect(): T[] {
		return [...this];
	}

	groupBy(n: number): Iter<T[]> {
		const self = this;

		return Iter.of<T[]>(function* () {
			while (true) {
				const chunk = self.nextChunk(n);
				if (chunk.isOk()) {
					yield chunk.unwrap();
				} else {
					yield chunk.unwrapErr();
					break;
				}
			}
		});
	}
}

export class IterIter<T> extends Iter<T> {
	iter: Iterator<T>;

	constructor(iter: Iterable<T> | Iterator<T> | (() => Generator<T>)) {
		super();
		if (typeof (iter as Iterator<T>).next === "function") {
			this.iter = iter as Iterator<T>;
		} else if (typeof iter === "function") {
			this.iter = (iter as () => Generator<T>)();
		} else {
			this.iter = (iter as Iterable<T>)[Symbol.iterator]();
		}
	}

	next(): Option<T> {
		const next = this.iter.next();
		return next.done ? None.instance : new Some(next.value);
	}
}

class StepBy<T> extends Iter<T> {
	started = false;

	constructor(
		private readonly iter: Iter<T>,
		private readonly step: number,
	) {
		super();
	}

	next(): Option<T> {
		if (!this.started) {
			this.started = true;
			return this.iter.next();
		}
		return this.iter.advanceBy(this.step - 1).mapOrElse(
			() => None.instance,
			() => this.iter.next(),
		);
	}
}

class Chain<A, B> extends Iter<A | B> {
	private firstActive = true;

	constructor(
		private first: Iter<A>,
		private second: Iter<B>,
	) {
		super();
	}

	next(): Option<A> | Option<B> {
		if (this.firstActive) {
			const next = this.first.next();
			if (next.isSome()) return next as Option<A>;
			this.firstActive = false;
		}
		return this.second.next() as Option<B>;
	}
}

class Zip<T, U> extends Iter<[T, U]> {
	constructor(
		private first: Iter<T>,
		private second: Iter<U>,
	) {
		super();
	}

	next(): Option<[T, U]> {
		return this.first
			.next()
			.andThen((a) => this.second.next().map((b) => [a, b]));
	}
}

class Intersperse<T> extends Iter<T> {
	private started = false;
	private iter: Iter<T>;
	private separator: T;
	private next_item: Option<T>;

	constructor(iter: Iter<T>, sep: T) {
		super();
		this.started = false;
		this.separator = sep;
		this.iter = iter;
		this.next_item = None.instance;
	}

	next(): Option<T> {
		if (this.started) {
			if (this.next_item.isSome()) {
				const nxt = this.next_item;
				this.next_item = None.instance;
				return nxt;
			}
			const next_item = this.iter.next();
			if (next_item.isSome()) {
				this.next_item = next_item;
				return new Some(this.separator);
			}
			return None.instance;
		}
		this.started = true;
		return this.iter.next();
	}
}

class IntersperseWith<T> extends Iter<T> {
	private started: boolean;
	private iter: Iter<T>;
	private separator: () => T;
	private next_item: Option<T>;

	constructor(iter: Iter<T>, separator: () => T) {
		super();
		this.started = false;
		this.separator = separator;
		this.iter = iter;
		this.next_item = None.instance;
	}

	next(): Option<T> {
		if (this.started) {
			if (this.next_item.isSome()) {
				const nxt = this.next_item;
				this.next_item = None.instance;
				return nxt;
			}
			const next_item = this.iter.next();
			if (next_item.isSome()) {
				this.next_item = next_item;
				return new Some(this.separator());
			}
			return None.instance;
		}
		this.started = true;
		return this.iter.next();
	}
}

class Mapped<T, U> extends Iter<U> {
	constructor(
		private readonly iter: Iter<T>,
		private readonly fn: (t: T) => U,
	) {
		super();
	}

	next(): Option<U> {
		return this.iter.next().map(this.fn);
	}
}

class Range extends Iter<number> {
	private index: number;
	private stop: number;
	private step: number;

	static from(start: number, stop: number, step = 1) {
		return new Range(start, stop, step);
	}

	static to(stop: number, step = 1) {
		return new Range(0, stop, step);
	}

	constructor(start: number, stop?: number, step = 1) {
		super();
		[this.index, this.stop] = stop === undefined ? [0, start] : [start, stop];
		this.step = step;
	}

	next(): Option<number> {
		if (this.index < this.stop) {
			const next = this.index;
			this.index += this.step;
			return new Some(next);
		}
		return None.instance;
	}
}

export { Iter, Range, StepBy };
