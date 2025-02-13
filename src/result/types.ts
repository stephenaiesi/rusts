import type { Err } from "./err.js";
import type { Ok } from "./ok.js";

type Result<T, E> = Ok<T, E> | Err<T, E>;

export type { Result, Ok, Err };
