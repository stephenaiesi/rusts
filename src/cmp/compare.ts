// import type { Option } from "../option/option.js";
// // import { some } from "../option/some.js";
// // import { none } from "../option/none.js";
// import { Ordering } from "./Ordering";

// interface ImplComparable {
// 	cmp<Rhs = this>(other: Rhs): Ordering;
// }

// const canCompare = <T>(obj: T): obj is T & ImplComparable => {
// 	return typeof (obj as T & ImplComparable).cmp === "function";
// };

// const compare = <T>(a: T, b: T): Option<Ordering> => {
// 	if (canCompare(a)) return some(a.cmp(b));
// 	if (a < b) return some(Ordering.Less);
// 	if (a > b) return some(Ordering.Greater);
// 	if (a === b) return some(Ordering.Equal);
// 	return none;
// };

// export { compare, canCompare };
