import Ordering from "../cmp/Ordering.js";
import { deepCopy, shallowCopy } from "../lib/utils.js";
import { ResultBase } from "./result.js";
class Ok extends ResultBase {
    kind = "ok";
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    isOk() {
        return true;
    }
    isOkAnd(predicate) {
        return predicate(this.value);
    }
    isErr() {
        return false;
    }
    isErrAnd(_predicate) {
        return false;
    }
    peek(fn) {
        fn(this.value);
        return this;
    }
    peekErr(_fn) {
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
    expectErr(msg) {
        throw new Error(msg);
    }
    unwrapErr() {
        this.expectErr("Tried to unwrappErr() an `Ok` value!");
    }
    map(fn) {
        return new Ok(fn(this.value));
    }
    mapOr(_fallback, fn) {
        return fn(this.value);
    }
    mapOrElse(_fallback, fn) {
        return fn(this.value);
    }
    mapErr(_fn) {
        return this;
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
    *iter() {
        yield this.value;
    }
    copy() {
        return new Ok(shallowCopy(this.value));
    }
    clone() {
        return new Ok(deepCopy(this.value));
    }
    cmp(other) {
        if (other.isErr()) {
            return Ordering.Less;
        }
        return this.value > other.value
            ? Ordering.Greater
            : this.value < other.value
                ? Ordering.Less
                : Ordering.Equal;
    }
}
const ok = (value = null) => new Ok(value);
export { Ok, ok };
