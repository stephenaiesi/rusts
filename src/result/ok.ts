import { ResultBase } from "./result";

class Ok<T> extends ResultBase<T, never> {}

// const ok = <T>(value: T) => new Ok<T>(value);

export { Ok };
