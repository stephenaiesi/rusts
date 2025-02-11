// biome-ignore lint/suspicious/noExplicitAny: afaik ts mixins require this signature
type AbsConstructor<T = object> = abstract new (...args: any[]) => T;

// biome-ignore lint/suspicious/noExplicitAny: afaik ts mixins require this signature
type Constructor<T = object> = new (...args: any[]) => T;

type Class = AbsConstructor | Constructor;

export type { AbsConstructor, Constructor, Class };
