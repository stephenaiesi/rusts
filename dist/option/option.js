import { Ordering } from "../cmp/index.js";
class OptionBase {
    constructor() { }
    insertedWith(fn) {
        return this.inserted(fn());
    }
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
    min(other) {
        return this.cmp(other) === Ordering.Less ? this : other;
    }
    max(other) {
        return this.cmp(other) === Ordering.Greater ? this : other;
    }
    clamp(min, max) {
        if (this.lt(min))
            return min;
        if (this.gt(max))
            return max;
        return this;
    }
}
export { OptionBase };
