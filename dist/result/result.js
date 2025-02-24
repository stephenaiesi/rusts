import Ordering from "../cmp/Ordering.js";
class ResultBase {
    eq(other) {
        return this.cmp(other) === Ordering.Equal;
    }
    ne(other) {
        return this.cmp(other) !== Ordering.Equal;
    }
    lt(other) {
        return this.cmp(other) === Ordering.Less;
    }
    le(other) {
        return this.cmp(other) !== Ordering.Greater;
    }
    gt(other) {
        return this.cmp(other) === Ordering.Greater;
    }
    ge(other) {
        return this.cmp(other) !== Ordering.Less;
    }
    max(other) {
        return this.cmp(other) === Ordering.Less ? other : this;
    }
    min(other) {
        return this.cmp(other) === Ordering.Less ? this : other;
    }
    clamp(min, max) {
        if (this.lt(min))
            return min;
        if (this.gt(max))
            return max;
        return this;
    }
}
export { ResultBase };
