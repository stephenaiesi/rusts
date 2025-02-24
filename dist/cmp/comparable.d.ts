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
    clamp(min: T extends never ? this : T, max: T extends never ? this : T): T extends never ? this : T;
}
declare function MComparable<TBase extends AbsConstructor>(Base?: TBase): (abstract new (...args: any[]) => {
    cmp(other: any): Option<Ordering>;
    eq(other: any): boolean;
    ne(other: any): boolean;
    lt(other: any): boolean;
    le(other: any): boolean;
    gt(other: any): boolean;
    ge(other: any): boolean;
    max(other: any): any;
    min(other: any): any;
    clamp(min: any, max: any): any;
}) & (abstract new (value?: any) => {
    cmp(other: any): Option<Ordering>;
    eq(other: any): boolean;
    ne(other: any): boolean;
    lt(other: any): boolean;
    le(other: any): boolean;
    gt(other: any): boolean;
    ge(other: any): boolean;
    max(other: any): any;
    min(other: any): any;
    clamp(min: any, max: any): any;
});
export type { Comparable };
export { MComparable };
