import Ordering from "../cmp/Ordering.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { ResultBase } from "./result.js";
import type { Err, Result } from "./types.js";

class Ok<T, E = never> extends ResultBase<T, E> {
	readonly kind = "ok";

	readonly value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	isOk(): this is Ok<T, E> {
		return true;
	}

	isOkAnd(predicate: (t: T) => boolean): boolean {
		return predicate(this.value);
	}

	isErr(): this is Err<T, E> {
		return false;
	}

	isErrAnd(_predicate: (e: E) => boolean): boolean {
		return false;
	}

	peek(fn: (t: T) => void): this {
		fn(this.value);
		return this;
	}

	peekErr(_fn: (e: E) => void): this {
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

	unwrapOrElse(_fn: (e: E) => T): T {
		return this.value;
	}

	expectErr(msg: string): never {
		throw new Error(msg);
	}

	unwrapErr(): never {
		this.expectErr("Tried to unwrappErr() an `Ok` value!");
	}

	map<U>(fn: (t: T) => U): Ok<U, E> {
		return new Ok(fn(this.value));
	}

	mapOr<U>(_fallback: U, fn: (t: T) => U): U {
		return fn(this.value);
	}

	mapOrElse<U>(_fallback: (e: never) => U, fn: (t: T) => U): U {
		return fn(this.value);
	}

	mapErr<F>(_fn: (e: E) => F): Ok<T, F> {
		return this as unknown as Ok<T, F>;
	}

	and<U, Rhs extends Result<U, E>>(other: Rhs): Rhs {
		return other;
	}

	andThen<U, Other extends Result<U, E>>(fn: (t: T) => Other): Other {
		return fn(this.value);
	}

	or<F>(_other: Result<T, F>): Ok<T, F> {
		return this as unknown as Ok<T, F>;
	}

	orElse<F>(_fn: (e: never) => Result<T, F>): Result<T, F> {
		return this as unknown as Result<T, F>;
	}

	*iter(): Iterator<T> {
		yield this.value;
	}

	copy(): Ok<T, E> {
		return new Ok<T, E>(shallowCopy(this.value));
	}

	clone(): Ok<T, E> {
		return new Ok<T, E>(deepCopy(this.value));
	}

	cmp(other: Result<T, E>): Ordering {
		if (other.isErr()) {
			return Ordering.Less;
		}
		return this.value > other.value
			? Ordering.Greater
			: this.value < other.value
				? Ordering.Less
				: Ordering.Equal;
	}
}

const ok = <T, E = never>(value: T = null as T) => new Ok<T, E>(value);

export { Ok, ok };
