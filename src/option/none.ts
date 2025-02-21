import Ordering from "../cmp/Ordering.js";
import { OptionBase } from "./option.js";
import { Some } from "./some.js";
import type { Option } from "./types.js";
// import type { Result } from "../result/result";
// import { err } from "../result/err";
// import { ok } from "../result/ok";

class None<T = never> extends OptionBase<T> {
	public static readonly instance: None = new None();

	static of<T = never>(): None<T> {
		return None.instance;
	}

	isSome<T>(): this is Some<T> {
		return false;
	}

	isSomeAnd<T>(_predicate: (t: T) => boolean): boolean {
		return false;
	}

	isNone(): this is None<T> {
		return true;
	}

	isNoneOr(_predicate: (t: T) => boolean): boolean {
		return true;
	}

	expect(msg: string): never {
		throw new Error(msg);
	}

	unwrap(): never {
		this.expect("Tried to unwrap a `None` value!");
	}

	unwrapOr<T>(fallback: T): T {
		return fallback;
	}

	unwrapOrElse<T>(fn: () => T): T {
		return fn();
	}

	peek(_fn: (t: T) => void): this {
		return this;
	}

	map<U>(_fn: (t: T) => U): None<U> {
		return this as unknown as None<U>;
	}

	mapOr<U>(fallback: U, _fn: (t: T) => U): U {
		return fallback;
	}

	mapOrElse<U>(fallback: () => U, _fn: (t: T) => U): U {
		return fallback();
	}

	filter(_predicate: (t: T) => boolean): this {
		return this;
	}

	flatten<U, Inner extends Option<U>>(this: Option<Inner>): Inner {
		return this as unknown as Inner;
	}

	// transpose<U, E>(this: Option<Result<U, E>>): Result<Option<U>, E> {
	// 	return ok(none);
	// }

	// okOr<E>(e: E): Result<never, E> {
	// 	return err(e);
	// }

	// okOrElse<E>(fn: () => E): Result<never, E> {
	// 	return err(fn());
	// }

	zip<U>(_other: Option<U>): Option<[T, U]> {
		return this as None<[T, U]>;
	}

	zipWith<U, R>(_other: Option<U>, _fn: (t: T, u: U) => R): None<R> {
		return this as unknown as None<R>;
	}

	unzip<A, B>(this: Option<[A, B]>): [Option<A>, Option<B>] {
		return [this, this] as [None<A>, None<B>];
	}

	and<U>(_other: Option<U>): None<U> {
		return this as unknown as None<U>;
	}

	andThen<U>(_fn: (t: T) => Option<U>): None<U> {
		return this as unknown as None<U>;
	}

	or<U, Rhs extends Option<U>>(other: Rhs): Rhs {
		return other;
	}

	orElse<T, Rhs extends Option<T>>(fn: () => Rhs): Rhs {
		return fn();
	}

	xor<Rhs extends Option<T>>(other: Rhs): Option<T> {
		return other;
	}

	*iter(): Iterator<never> {}

	inserted<U>(u: U): Some<U> {
		return new Some(u);
	}

	copy(): None<T> {
		return this;
	}

	clone(): None<T> {
		return new None();
	}

	cmp<T>(this: Option<T>, other: Option<T>): Ordering {
		return other.isSome() ? Ordering.Less : Ordering.Equal;
	}
}

const none = None.instance;

export { None, none };
