const shallowCopy = <T>(obj: T): T => {
	if (typeof obj === "object" && obj !== null)
		return (Array.isArray(obj) ? [...obj] : { ...obj }) as T;
	return obj;
};

const deepCopy = <T>(obj: T): T => {
	return structuredClone(obj);
};

export { shallowCopy, deepCopy };
