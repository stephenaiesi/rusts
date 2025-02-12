import type { None } from "./none.js";
import type { Some } from "./some.js";

export type Option<T> = Some<T> | None<T>;

export type { None, Some };
