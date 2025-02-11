import type { None } from "./none.js";
import type { Some } from "./some.js";

export type Option<T> = Some<T> | None<T>;

export type Flattened<T> = T extends Option<infer U> ? U : T;

export type IsNested<T extends Option<unknown>> = T extends Option<
	Option<unknown>
>
	? true
	: false;
