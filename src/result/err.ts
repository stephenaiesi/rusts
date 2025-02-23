import Ordering from "../cmp/Ordering.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { ResultBase } from "./result.js";
import type { Ok, Result } from "./types.js";

class Err<T = never, E = unknown> extends ResultBase<T, E> {
	readonly kind = "err";

	readonly value: E;

	constructor(value: E) {
		super();
		this.value = value;
	}

	isOk(): this is Ok<T, E> {
		return false;
	}

	isOkAnd(_predicate: (t: never) => boolean): boolean {
		return false;
	}

	isErr(): this is Err<T, E> {
		return true;
	}

	isErrAnd(predicate: (e: E) => boolean): boolean {
		return predicate(this.value);
	}

	peek(_fn: (e: never) => void): this {
		return this;
	}

	peekErr(fn: (e: E) => void): this {
		fn(this.value);
		return this;
	}

	expect(msg: string): never {
		throw new Error(msg);
	}

	unwrap(): never {
		this.expect("Tried to unwrap() an `Err` value!");
	}

	unwrapOr(fallback: T): T {
		return fallback;
	}

	unwrapOrElse(fn: (e: E) => T): T {
		return fn(this.value);
	}

	expectErr(_msg: string): E {
		return this.value;
	}

	unwrapErr(): E {
		return this.value;
	}

	map<U>(_fn: (t: never) => U): Err<U, E> {
		return new Err(this.value);
	}

	mapOr<U>(fallback: U, _fn: (t: never) => U): U {
		return fallback;
	}

	mapOrElse<U>(fallback: (e: E) => U, _fn: (t: never) => U): U {
		return fallback(this.value);
	}

	mapErr<U>(fn: (e: E) => U): Err<T, U> {
		return new Err(fn(this.value));
	}

	and<U, Other extends Result<U, E>>(_other: Other): Err<U, E> {
		return this as unknown as Err<U, E>;
	}

	andThen<U>(_fn: (t: never) => Result<U, E>): Err<U, E> {
		return this as unknown as Err<U, E>;
	}

	or<F, Rhs extends Result<T, F>>(other: Rhs): Rhs {
		return other;
	}

	orElse<F, Other extends Result<T, F>>(fn: (e: E) => Other): Other {
		return fn(this.value);
	}

	*iter(): Iterator<never> {}

	copy(): Err<T, E> {
		return new Err<T, E>(shallowCopy(this.value));
	}

	clone(): Err<T, E> {
		return new Err<T, E>(deepCopy(this.value));
	}

	cmp(other: Result<T, E>): Ordering {
		if (other.isOk()) {
			return Ordering.Greater;
		}
		return this.value > other.value
			? Ordering.Greater
			: this.value < other.value
				? Ordering.Less
				: Ordering.Equal;
	}
}

const err = <E>(e: E): Err<E> => new Err(e);

export { Err, err };
