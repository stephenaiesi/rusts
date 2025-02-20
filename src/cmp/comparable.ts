import type { Option } from "../option/index.js";
import { Ordering } from "./Ordering.js";

import type { AbsConstructor } from "../types/index.js";

interface Comparable<T = never> {
	eq(other: T extends never ? this : T): boolean;

	ne(other: T extends never ? this : T): boolean;

	lt(other: T extends never ? this : T): boolean;

	le(other: T extends never ? this : T): boolean;

	gt(other: T extends never ? this : T): boolean;

	ge(other: T extends never ? this : T): boolean;

	max(other: T extends never ? this : T): T extends never ? this : T;

	min(other: T extends never ? this : T): T extends never ? this : T;

	clamp(
		min: T extends never ? this : T,
		max: T extends never ? this : T,
	): T extends never ? this : T;
}

function MComparable<TBase extends AbsConstructor>(Base?: TBase) {
	abstract class Comparable
		extends (Base ? Base : Object)
		implements Comparable
	{
		abstract cmp(other: this): Option<Ordering>;

		eq(other: this): boolean {
			return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Equal);
		}

		ne(other: this): boolean {
			return !this.eq(other);
		}

		lt(other: this): boolean {
			return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Less);
		}

		le(other: this): boolean {
			return this.cmp(other).mapOr(
				false,
				(ord) => ord === Ordering.Less || ord === Ordering.Equal,
			);
		}

		gt(other: this): boolean {
			return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Greater);
		}

		ge(other: this): boolean {
			return this.cmp(other).mapOr(
				false,
				(ord) => ord === Ordering.Greater || ord === Ordering.Equal,
			);
		}

		max(other: this): this {
			if (this.gt(other)) return this;
			return other;
		}

		min(other: this): this {
			if (this.lt(other)) return this;
			return other;
		}

		clamp(min: this, max: this): this {
			if (this.lt(min)) return min;
			if (this.gt(max)) return max;
			return this;
		}
	}
	return Comparable;
}

export type { Comparable };

export { MComparable };
