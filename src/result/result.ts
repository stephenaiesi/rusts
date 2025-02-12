// import type { Option } from "../option/option.js";
// import type { Err } from "./err.js";
// import type { Ok } from "./ok.js";

abstract class ResultBase<_T, _E> {
	/***************************************************************************
	 *	Querying the variant
	 **************************************************************************/
	// abstract isOk(): this is Ok<T, E>;
	// abstract isOkAnd(predicate: (t: T) => boolean): boolean;
	// abstract isErr(): this is Err<T, E>;
	// abstract isErrAnd(predicate: (e: E) => boolean): boolean;
	// abstract peek(fn: (t: T) => void): this;
	// abstract peekErr(fn: (e: E) => void): this;
	// /******************************************************************
	//  *	Extracting the contained value
	//  ******************************************************************/
	// abstract expect(msg: string): T | never;
	// abstract unwrap(): T | never;
	// abstract expectErr(msg: string): E | never;
	// abstract unwrapErr(): E | never;
	// /******************************************************************
	//  *	Transforming the contained value
	//  ******************************************************************/
	// abstract map<U>(fn: (t: T) => U): Result<U, E>;
	// abstract mapOr<U>(fallback: U, fn: (t: T) => U): U;
	// abstract mapOrElse<U>(d: (e: E) => U, fn: (t: T) => U): U;
	// abstract mapErr<F>(fn: (e: E) => F): Result<T, F>;
	// abstract flatten(this: Result<Result<T, E>, E>): Result<T, E>;
	// // abstract ok(): Option<T>;
	// // abstract err(): Option<E>;
	// // abstract transpose(this: Result<Option<T>, E>): Option<Result<T, E>>;
	// abstract iter(): Iterator<T>;
	// abstract and<U>(other: Result<U, E>): Result<U, E>;
	// abstract andThen<U>(fn: (t: T) => Result<U, E>): Result<U, E>;
	// abstract or<F>(fallback: Result<T, F>): Result<T, F>;
	// abstract orElse<F>(fn: (e: E) => Result<T, F>): Result<T, F>;
	// abstract unwrapOr(fallback: T): T;
	// abstract unwrapOrElse(fn: (e: E) => T): T;
	// abstract copy(): Result<T, E>;
	// abstract clone(): Result<T, E>;
}

export { ResultBase };
