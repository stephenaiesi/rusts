import Ordering from "../cmp/Ordering.js";
import { OptionBase } from "./option.js";
import { Some } from "./some.js";
class None extends OptionBase {
    static instance = new None();
    static of() {
        return None.instance;
    }
    isSome() {
        return false;
    }
    isSomeAnd(_predicate) {
        return false;
    }
    isNone() {
        return true;
    }
    isNoneOr(_predicate) {
        return true;
    }
    expect(msg) {
        throw new Error(msg);
    }
    unwrap() {
        this.expect("Tried to unwrap a `None` value!");
    }
    unwrapOr(fallback) {
        return fallback;
    }
    unwrapOrElse(fn) {
        return fn();
    }
    peek(_fn) {
        return this;
    }
    map(_fn) {
        return this;
    }
    mapOr(fallback, _fn) {
        return fallback;
    }
    mapOrElse(fallback, _fn) {
        return fallback();
    }
    filter(_predicate) {
        return this;
    }
    flatten() {
        return this;
    }
    zip(_other) {
        return this;
    }
    zipWith(_other, _fn) {
        return this;
    }
    unzip() {
        return [this, this];
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
        return fn();
    }
    xor(other) {
        return other;
    }
    *iter() { }
    inserted(u) {
        return new Some(u);
    }
    copy() {
        return this;
    }
    clone() {
        return new None();
    }
    cmp(other) {
        return other.isSome() ? Ordering.Less : Ordering.Equal;
    }
}
const none = None.instance;
export { None, none };
