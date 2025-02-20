import Ordering from "../cmp/Ordering.js";
// import type { Option } from "../option/option.js";
import type { Comparable } from "../cmp/comparable.js";
import type { Err, Ok, Result } from "./types.js";

abstract class ResultBase<T, E> implements Comparable<Result<T, E>> {
	abstract kind: "ok" | "err";

	abstract readonly value: T | E;

	/***************************************************************************
	 *	Querying the variant
	 **************************************************************************/
	abstract isOk(): this is Ok<T, E>;
	abstract isOkAnd(predicate: (t: T) => boolean): boolean;
	abstract isErr(): this is Err<T, E>;
	abstract isErrAnd(predicate: (e: E) => boolean): boolean;
	abstract peek(fn: (t: T) => void): this;
	abstract peekErr(fn: (e: E) => void): this;

	// /******************************************************************
	//  *	Extracting the contained value
	//  ******************************************************************/
	abstract expect(msg: string): T;
	abstract unwrap(): T | never;
	abstract unwrapOr(fallback: T): T;
	abstract unwrapOrElse(fn: (e: E) => T): T;
	abstract expectErr(msg: string): E | never;
	abstract unwrapErr(): E | never;

	// /******************************************************************
	//  *	Transforming the contained value
	//  ******************************************************************/
	abstract map<U>(fn: (t: T) => U): Result<U, E>;
	abstract mapOr<U>(fallback: U, fn: (t: T) => U): U;
	abstract mapOrElse<U>(d: (e: E) => U, fn: (t: T) => U): U;
	abstract mapErr<F>(fn: (e: E) => F): Result<T, F>;

	/******************************************************************
	 *	Boolean Operations
	 ******************************************************************/
	abstract and<U>(other: Result<U, E>): Result<U, E>;
	abstract andThen<U>(fn: (t: T) => Result<U, E>): Result<U, E>;
	abstract or<F>(fallback: Result<T, F>): Result<T, F>;
	abstract orElse<F>(fn: (e: E) => Result<T, F>): Result<T, F>;

	/******************************************************************
	 *	Iteration
	 ******************************************************************/
	abstract iter(): Iterator<T>;

	/******************************************************************
	 *	Copying & Cloning
	 ******************************************************************/
	abstract copy(): Result<T, E>;
	abstract clone(): Result<T, E>;

	/******************************************************************
	 *	Comparison Operations
	 ******************************************************************/
	abstract cmp(this: Result<T, E>, other: Result<T, E>): Ordering;

	eq(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) === Ordering.Equal;
	}

	ne(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) !== Ordering.Equal;
	}

	lt(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) === Ordering.Less;
	}

	le(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) !== Ordering.Greater;
	}

	gt(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) === Ordering.Greater;
	}

	ge(this: Result<T, E>, other: Result<T, E>): boolean {
		return this.cmp(other) !== Ordering.Less;
	}

	max(this: Result<T, E>, other: Result<T, E>): Result<T, E> {
		return this.cmp(other) === Ordering.Less ? other : this;
	}

	min(this: Result<T, E>, other: Result<T, E>): Result<T, E> {
		return this.cmp(other) === Ordering.Less ? this : other;
	}

	clamp(
		this: Result<T, E>,
		min: Result<T, E>,
		max: Result<T, E>,
	): Result<T, E> {
		if (this.lt(min)) return min;
		if (this.gt(max)) return max;
		return this;
	}
}

export { ResultBase };
