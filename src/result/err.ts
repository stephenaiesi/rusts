import { ResultBase } from "./result";

class Err<E> extends ResultBase<never, E> {}

// const err = <E>(e: E): Err<E> => new Err(e);

export { Err };
