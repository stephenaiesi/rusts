import { Ordering } from "./Ordering.js";
function MComparable(Base) {
    class Comparable extends (Base ? Base : Object) {
        eq(other) {
            return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Equal);
        }
        ne(other) {
            return !this.eq(other);
        }
        lt(other) {
            return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Less);
        }
        le(other) {
            return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Less || ord === Ordering.Equal);
        }
        gt(other) {
            return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Greater);
        }
        ge(other) {
            return this.cmp(other).mapOr(false, (ord) => ord === Ordering.Greater || ord === Ordering.Equal);
        }
        max(other) {
            if (this.gt(other))
                return this;
            return other;
        }
        min(other) {
            if (this.lt(other))
                return this;
            return other;
        }
        clamp(min, max) {
            if (this.lt(min))
                return min;
            if (this.gt(max))
                return max;
            return this;
        }
    }
    return Comparable;
}
export { MComparable };
