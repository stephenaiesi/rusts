import { type Option } from "../option/index.js";
import { type Result } from "../result/index.js";
declare abstract class Iter<T> implements Iterable<T> {
    abstract next(): Option<T>;
    static of<T>(iter: Iterable<T> | Iterator<T> | (() => Generator<T>)): IterIter<T>;
    static range(start: number, stop?: number, step?: number): Range;
    [Symbol.iterator](): Iterator<T>;
    nextChunk(n: number): Result<T[], T[]>;
    count(): number;
    last(): Option<T>;
    advanceBy(n: number): Result<null, number>;
    nth(n: number): Option<T>;
    stepBy(n: number): StepBy<T>;
    chain<B>(other: Iter<B>): Chain<T, B>;
    zip<U>(other: Iter<U>): Iter<[T, U]>;
    intersperse(sep: T): Intersperse<T>;
    intersperseWith(sep: () => T): IntersperseWith<T>;
    map<U>(fn: (t: T) => U): Mapped<T, U>;
    fold<U>(fn: (acc: U, t: T) => U, acc: U): U;
    collect(): T[];
    groupBy(n: number): Iter<T[]>;
}
export declare class IterIter<T> extends Iter<T> {
    iter: Iterator<T>;
    constructor(iter: Iterable<T> | Iterator<T> | (() => Generator<T>));
    next(): Option<T>;
}
declare class StepBy<T> extends Iter<T> {
    private readonly iter;
    private readonly step;
    started: boolean;
    constructor(iter: Iter<T>, step: number);
    next(): Option<T>;
}
declare class Chain<A, B> extends Iter<A | B> {
    private first;
    private second;
    private firstActive;
    constructor(first: Iter<A>, second: Iter<B>);
    next(): Option<A> | Option<B>;
}
declare class Intersperse<T> extends Iter<T> {
    private started;
    private iter;
    private separator;
    private next_item;
    constructor(iter: Iter<T>, sep: T);
    next(): Option<T>;
}
declare class IntersperseWith<T> extends Iter<T> {
    private started;
    private iter;
    private separator;
    private next_item;
    constructor(iter: Iter<T>, separator: () => T);
    next(): Option<T>;
}
declare class Mapped<T, U> extends Iter<U> {
    private readonly iter;
    private readonly fn;
    constructor(iter: Iter<T>, fn: (t: T) => U);
    next(): Option<U>;
}
declare class Range extends Iter<number> {
    private index;
    private stop;
    private step;
    static from(start: number, stop: number, step?: number): Range;
    static to(stop: number, step?: number): Range;
    constructor(start: number, stop?: number, step?: number);
    next(): Option<number>;
}
export { Iter, Range, StepBy };
