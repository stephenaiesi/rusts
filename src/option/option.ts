import { type Comparable, Ordering } from "../cmp/index.js";
import type { None, Option, Some } from "./types.js";

abstract class OptionBase<T> implements Comparable<Option<T>> {
	protected constructor() {}

	/***************************************************************************
	 *	Querying the variant
	 **************************************************************************/

	abstract isSome(): this is Some<T>;
	abstract isSomeAnd(predicate: (t: T) => boolean): boolean;
	abstract isNone(): this is None<T>;
	abstract isNoneOr(predicate: (t: T) => boolean): boolean;

	// inspect() is named peek() to avoid conflict with the test runner
	// TODO: possibly find a way to name this inspect()
	abstract peek(fn: (t: T) => void): this;

	// TODO: slice implementation?

	/******************************************************************
	 *	Extracting the contained value
	 ******************************************************************/

	abstract expect(msg: string): T;

	abstract unwrap(): T;

	abstract unwrapOr(fallback: T): T;
	abstract unwrapOrElse(fn: () => T): T;
	// TODO: possibly implement some form of default()

	/******************************************************************
	 *	Transforming the contained value
	 ******************************************************************/
	abstract map<U>(fn: (t: T) => U): Option<U>;
	abstract mapOr<U>(fallback: U, fn: (t: T) => U): U;
	abstract mapOrElse<U>(fallback: () => U, fn: (t: T) => U): U;
	abstract filter(predicate: (t: T) => boolean): Option<T>;
	// abstract flatten<U, Inner extends Option<U>>(this: Option<Inner>): Option<T>;
	abstract flatten<U, Inner extends Option<U>>(this: Option<Inner>): Inner;
	// abstract transpose<E>(this: Option<Result<T, E>>): Result<Option<T>, E>;
	// abstract okOr<E>(e: E): Result<T, E>;
	// abstract okOrElse<E>(fn: () => E): Result<T, E>;

	/******************************************************************
	 *	Combining Options
	 ******************************************************************/
	abstract zip<U>(other: Option<U>): Option<[T, U]>;
	abstract zipWith<U, R>(other: Option<U>, fn: (t: T, u: U) => R): Option<R>;
	abstract unzip<A, B>(this: Option<[A, B]>): [Option<A>, Option<B>];

	/******************************************************************
	 *	Boolean Operations
	 ******************************************************************/
	abstract and<U>(other: Option<U>): Option<U>;
	abstract andThen<U>(fn: (t: T) => Option<U>): Option<U>;
	abstract or(other: Option<T>): Option<T>;
	abstract orElse(fn: () => Option<T>): Option<T>;
	abstract xor(other: Option<T>): Option<T>;

	/******************************************************************
	 *	Iteration
	 ******************************************************************/
	abstract iter(): Iterator<T>;
	// Consider collect, product and sum operations

	/******************************************************************
	 *	Mutation functions: not supported with this implementation
	 ******************************************************************/
	// TODO: possibly implement some of these as factories instead of mutators
	// insert<U>(u: U): Option<U>;
	// getOrInsert<U>(u: U): Option<U> | Option<T>;
	// getOrInsertWith<U>(fn: () => U): Option<U> | Option<T>;
	// take(): Option<T>;
	// takeIf(predicate: (t: T) => boolean): Option<T>;
	// replace(t: T): Option<T>;

	/******************************************************************
	 *	Creating new options from existing ones
	 ******************************************************************/
	abstract inserted<U>(u: U): Some<U>;

	insertedWith<U>(fn: () => U): Some<U> {
		return this.inserted(fn());
	}

	abstract copy(): Option<T>;
	abstract clone(): Option<T>;

	/******************************************************************
	 *	Comparison Operations
	 ******************************************************************/
	abstract cmp(this: Option<T>, other: Option<T>): Ordering;

	eq<U>(this: Option<U>, other: Option<U>): boolean {
		return this.cmp(other) === Ordering.Equal;
	}

	ne(this: Option<T>, other: Option<T>): boolean {
		return this.cmp(other) !== Ordering.Equal;
	}

	lt(this: Option<T>, other: Option<T>): boolean {
		return this.cmp(other) === Ordering.Less;
	}

	le(this: Option<T>, other: Option<T>): boolean {
		return this.cmp(other) !== Ordering.Greater;
	}

	gt(this: Option<T>, other: Option<T>): boolean {
		return this.cmp(other) === Ordering.Greater;
	}

	ge(this: Option<T>, other: Option<T>): boolean {
		return this.cmp(other) !== Ordering.Less;
	}

	min(this: Option<T>, other: Option<T>): Option<T> {
		return this.cmp(other) === Ordering.Less ? this : other;
	}

	max(this: Option<T>, other: Option<T>): Option<T> {
		return this.cmp(other) === Ordering.Greater ? this : other;
	}

	clamp(this: Option<T>, min: Option<T>, max: Option<T>): Option<T> {
		if (this.lt(min)) return min;
		if (this.gt(max)) return max;
		return this;
	}
}

export { OptionBase };
