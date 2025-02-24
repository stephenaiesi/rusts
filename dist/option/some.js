import { Ordering } from "../cmp/index.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { None } from "./none.js";
import { OptionBase } from "./option.js";
class Some extends OptionBase {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    static of(t) {
        return new Some(t);
    }
    isSome() {
        return true;
    }
    isSomeAnd(predicate) {
        return predicate(this.value);
    }
    isNone() {
        return false;
    }
    isNoneOr(predicate) {
        return predicate(this.value);
    }
    peek(fn) {
        fn(this.value);
        return this;
    }
    expect(_msg) {
        return this.value;
    }
    unwrap() {
        return this.value;
    }
    unwrapOr(_fallback) {
        return this.value;
    }
    unwrapOrElse(_fn) {
        return this.value;
    }
    map(fn) {
        return new Some(fn(this.value));
    }
    mapOr(_fallback, fn) {
        return fn(this.value);
    }
    mapOrElse(_fallback, fn) {
        return fn(this.value);
    }
    filter(predicate) {
        if (predicate(this.value))
            return this;
        return None.instance;
    }
    flatten() {
        return this.value;
    }
    zip(other) {
        if (other.isSome()) {
            return new Some([this.value, other.unwrap()]);
        }
        return None.instance;
    }
    zipWith(other, fn) {
        if (other.isSome()) {
            return new Some(fn(this.value, other.unwrap()));
        }
        return None.instance;
    }
    unzip() {
        return [
            new Some(this.value[0]),
            new Some(this.value[1]),
        ];
    }
    and(other) {
        return other;
    }
    andThen(fn) {
        return fn(this.value);
    }
    or(_other) {
        return this;
    }
    orElse(_fn) {
        return this;
    }
    xor(other) {
        if (other.isSome())
            return None.instance;
        return this;
    }
    *iter() {
        yield this.value;
    }
    inserted(u) {
        return new Some(u);
    }
    copy() {
        return new Some(shallowCopy(this.value));
    }
    clone() {
        return new Some(deepCopy(this.value));
    }
    cmp(other) {
        if (other.isNone())
            return Ordering.Greater;
        return this.value > other.value
            ? Ordering.Greater
            : this.value < other.value
                ? Ordering.Less
                : Ordering.Equal;
    }
}
const some = (value) => new Some(value);
export { Some, some };
