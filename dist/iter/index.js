import { None, Some } from "../option/index.js";
import { Err, Ok } from "../result/index.js";
class Iter {
    static of(iter) {
        return new IterIter(iter);
    }
    static range(start, stop, step = 1) {
        return new Range(start, stop, step);
    }
    *[Symbol.iterator]() {
        while (true) {
            const next = this.next();
            if (next.isSome()) {
                yield next.unwrap();
            }
            else {
                break;
            }
        }
    }
    nextChunk(n) {
        const arr = [];
        for (let i = 0; i < n; i++) {
            const next = this.next();
            if (next.isSome()) {
                arr.push(next.value);
            }
            else {
                return new Err(arr);
            }
        }
        return new Ok(arr);
    }
    count() {
        let count = 0;
        while (this.next().isSome()) {
            count++;
        }
        return count;
    }
    last() {
        let last = None.instance;
        while (true) {
            const next = this.next();
            if (next.isSome()) {
                last = next;
            }
            else {
                return last;
            }
        }
    }
    advanceBy(n) {
        for (let i = n; i > 0; i--) {
            const next = this.next();
            if (next.isSome()) {
                continue;
            }
            return new Err(i);
        }
        return new Ok(null);
    }
    nth(n) {
        return this.advanceBy(n).mapOrElse((_e) => None.instance, (_t) => this.next());
    }
    stepBy(n) {
        return new StepBy(this, n);
    }
    chain(other) {
        return new Chain(this, other);
    }
    zip(other) {
        return new Zip(this, other);
    }
    intersperse(sep) {
        return new Intersperse(this, sep);
    }
    intersperseWith(sep) {
        return new IntersperseWith(this, sep);
    }
    map(fn) {
        return new Mapped(this, fn);
    }
    fold(fn, acc) {
        let initial = acc;
        for (const t of this) {
            initial = fn(initial, t);
        }
        return initial;
    }
    collect() {
        return [...this];
    }
    groupBy(n) {
        const self = this;
        return Iter.of(function* () {
            while (true) {
                const chunk = self.nextChunk(n);
                if (chunk.isOk()) {
                    yield chunk.unwrap();
                }
                else {
                    yield chunk.unwrapErr();
                    break;
                }
            }
        });
    }
}
export class IterIter extends Iter {
    iter;
    constructor(iter) {
        super();
        if (typeof iter.next === "function") {
            this.iter = iter;
        }
        else if (typeof iter === "function") {
            this.iter = iter();
        }
        else {
            this.iter = iter[Symbol.iterator]();
        }
    }
    next() {
        const next = this.iter.next();
        return next.done ? None.instance : new Some(next.value);
    }
}
class StepBy extends Iter {
    iter;
    step;
    started = false;
    constructor(iter, step) {
        super();
        this.iter = iter;
        this.step = step;
    }
    next() {
        if (!this.started) {
            this.started = true;
            return this.iter.next();
        }
        return this.iter.advanceBy(this.step - 1).mapOrElse(() => None.instance, () => this.iter.next());
    }
}
class Chain extends Iter {
    first;
    second;
    firstActive = true;
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }
    next() {
        if (this.firstActive) {
            const next = this.first.next();
            if (next.isSome())
                return next;
            this.firstActive = false;
        }
        return this.second.next();
    }
}
class Zip extends Iter {
    first;
    second;
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }
    next() {
        return this.first
            .next()
            .andThen((a) => this.second.next().map((b) => [a, b]));
    }
}
class Intersperse extends Iter {
    started = false;
    iter;
    separator;
    next_item;
    constructor(iter, sep) {
        super();
        this.started = false;
        this.separator = sep;
        this.iter = iter;
        this.next_item = None.instance;
    }
    next() {
        if (this.started) {
            if (this.next_item.isSome()) {
                const nxt = this.next_item;
                this.next_item = None.instance;
                return nxt;
            }
            const next_item = this.iter.next();
            if (next_item.isSome()) {
                this.next_item = next_item;
                return new Some(this.separator);
            }
            return None.instance;
        }
        this.started = true;
        return this.iter.next();
    }
}
class IntersperseWith extends Iter {
    started;
    iter;
    separator;
    next_item;
    constructor(iter, separator) {
        super();
        this.started = false;
        this.separator = separator;
        this.iter = iter;
        this.next_item = None.instance;
    }
    next() {
        if (this.started) {
            if (this.next_item.isSome()) {
                const nxt = this.next_item;
                this.next_item = None.instance;
                return nxt;
            }
            const next_item = this.iter.next();
            if (next_item.isSome()) {
                this.next_item = next_item;
                return new Some(this.separator());
            }
            return None.instance;
        }
        this.started = true;
        return this.iter.next();
    }
}
class Mapped extends Iter {
    iter;
    fn;
    constructor(iter, fn) {
        super();
        this.iter = iter;
        this.fn = fn;
    }
    next() {
        return this.iter.next().map(this.fn);
    }
}
class Range extends Iter {
    index;
    stop;
    step;
    static from(start, stop, step = 1) {
        return new Range(start, stop, step);
    }
    static to(stop, step = 1) {
        return new Range(0, stop, step);
    }
    constructor(start, stop, step = 1) {
        super();
        [this.index, this.stop] = stop === undefined ? [0, start] : [start, stop];
        this.step = step;
    }
    next() {
        if (this.index < this.stop) {
            const next = this.index;
            this.index += this.step;
            return new Some(next);
        }
        return None.instance;
    }
}
export { Iter, Range, StepBy };
