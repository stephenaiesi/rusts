const shallowCopy = (obj) => {
    if (typeof obj === "object" && obj !== null)
        return (Array.isArray(obj) ? [...obj] : { ...obj });
    return obj;
};
const deepCopy = (obj) => {
    return structuredClone(obj);
};
export { shallowCopy, deepCopy };
