import type { Err } from "./err.js";
import type { Ok } from "./ok.js";

type Result<T, E> = Ok<T> | Err<E>;

export type { Result, Ok, Err };
