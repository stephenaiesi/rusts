import Ordering from "../cmp/Ordering.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { ResultBase } from "./result.js";
class Err extends ResultBase {
    kind = "err";
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    isOk() {
        return false;
    }
    isOkAnd(_predicate) {
        return false;
    }
    isErr() {
        return true;
    }
    isErrAnd(predicate) {
        return predicate(this.value);
    }
    peek(_fn) {
        return this;
    }
    peekErr(fn) {
        fn(this.value);
        return this;
    }
    expect(msg) {
        throw new Error(msg);
    }
    unwrap() {
        this.expect("Tried to unwrap() an `Err` value!");
    }
    unwrapOr(fallback) {
        return fallback;
    }
    unwrapOrElse(fn) {
        return fn(this.value);
    }
    expectErr(_msg) {
        return this.value;
    }
    unwrapErr() {
        return this.value;
    }
    map(_fn) {
        return new Err(this.value);
    }
    mapOr(fallback, _fn) {
        return fallback;
    }
    mapOrElse(fallback, _fn) {
        return fallback(this.value);
    }
    mapErr(fn) {
        return new Err(fn(this.value));
    }
    and(_other) {
        return this;
    }
    andThen(_fn) {
        return this;
    }
    or(other) {
        return other;
    }
    orElse(fn) {
        return fn(this.value);
    }
    *iter() { }
    copy() {
        return new Err(shallowCopy(this.value));
    }
    clone() {
        return new Err(deepCopy(this.value));
    }
    cmp(other) {
        if (other.isOk()) {
            return Ordering.Greater;
        }
        return this.value > other.value
            ? Ordering.Greater
            : this.value < other.value
                ? Ordering.Less
                : Ordering.Equal;
    }
}
const err = (e) => new Err(e);
export { Err, err };
