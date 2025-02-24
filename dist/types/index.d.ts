type AbsConstructor<T = object> = abstract new (...args: any[]) => T;
type Constructor<T = object> = new (...args: any[]) => T;
type Class = AbsConstructor | Constructor;
export type { AbsConstructor, Constructor, Class };
