import { Ordering } from "../cmp/index.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { None } from "./none.js";
import { OptionBase } from "./option.js";
import type { Option } from "./types.js";

// import type { Result } from "../result/result";
// import { ok } from "../result/ok";

class Some<T> extends OptionBase<T> {
	value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	static of<T>(t: T): Some<T> {
		return new Some(t);
	}

	isSome(): this is Some<T> {
		return true;
	}

	isSomeAnd(predicate: (t: T) => boolean): boolean {
		return predicate(this.value);
	}

	isNone(): this is None {
		return false;
	}

	isNoneOr(predicate: (t: T) => boolean): boolean {
		return predicate(this.value);
	}

	peek(fn: (t: T) => void): this {
		fn(this.value);
		return this;
	}

	expect(_msg: string): T {
		return this.value;
	}

	unwrap(): T {
		return this.value;
	}

	unwrapOr(_fallback: T): T {
		return this.value;
	}

	unwrapOrElse(_fn: () => T): T {
		return this.value;
	}

	map<U>(fn: (t: T) => U): Some<U> {
		return new Some(fn(this.value));
	}

	mapOr<U>(_fallback: U, fn: (t: T) => U): U {
		return fn(this.value);
	}

	mapOrElse<U>(_fallback: () => U, fn: (t: T) => U): U {
		return fn(this.value);
	}

	filter(predicate: (t: T) => boolean): Option<T> {
		if (predicate(this.value)) return this;
		return None.instance;
	}

	flatten<U, Inner extends Option<U>>(this: Option<Inner>): Inner {
		return (this as Some<Inner>).value;
	}

	// transpose<U, E>(this: Some<Result<U, E>>): Result<Some<U>, E> {
	// 	const innerResult = this.unwrap();

	// 	if (innerResult.isOk()) {
	// 		return ok(new Some(innerResult.unwrap()));
	// 	}
	// 	return innerResult as Result<Some<U>, E>;
	// }

	// okOr<E>(_e: E): Result<T, E> {
	// 	return ok(this.value);
	// }

	// okOrElse<E>(_fn: () => E): Result<T, E> {
	// 	return ok(this.value);
	// }

	zip<U>(other: Option<U>): Option<[T, U]> {
		if (other.isSome()) {
			return new Some([this.value, other.unwrap()] as [T, U]);
		}
		return None.instance;
	}

	zipWith<U, R>(other: Option<U>, fn: (t: T, u: U) => R): Option<R> {
		if (other.isSome()) {
			return new Some(fn(this.value, other.unwrap()));
		}
		return None.instance;
	}

	unzip<A, B>(this: Option<[A, B]>): [Option<A>, Option<B>] {
		return [
			new Some((this as Some<[A, B]>).value[0]),
			new Some((this as Some<[A, B]>).value[1]),
		];
	}

	and<U, Rhs extends Option<U>>(other: Rhs): Rhs {
		return other;
	}

	andThen<U>(fn: (t: T) => Option<U>): Option<U> {
		return fn(this.value);
	}

	or(_other: Option<T>): Some<T> {
		return this;
	}

	orElse(_fn: () => Option<T>): Some<T> {
		return this;
	}

	xor<Rhs extends Option<T>>(other: Rhs): Option<T> {
		if (other.isSome()) return None.instance;
		return this;
	}

	*iter(): Iterator<T> {
		yield this.value;
	}

	inserted<U>(u: U): Some<U> {
		return new Some(u);
	}

	copy(): Some<T> {
		return new Some(shallowCopy(this.value));
	}

	clone(): Some<T> {
		return new Some(deepCopy(this.value));
	}

	cmp(other: Option<T>): Ordering {
		if (other.isNone()) return Ordering.Greater;
		return this.value > other.value
			? Ordering.Greater
			: this.value < other.value
				? Ordering.Less
				: Ordering.Equal;
	}
}

const some = <T>(value: T) => new Some<T>(value);

export { Some, some };
