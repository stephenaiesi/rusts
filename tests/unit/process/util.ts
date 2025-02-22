import type { SpawnSyncReturns } from "node:child_process";

export type SpawnSyncReturn = SpawnSyncReturns<Buffer<ArrayBufferLike>>;

export function expectToBeSpawnSyncReturn(
	item: SpawnSyncReturn,
): asserts item is SpawnSyncReturn {
	expect(item).toHaveProperty("pid");
	expect(item).toHaveProperty("output");
	expect(item).toHaveProperty("stdout");
	expect(item).toHaveProperty("stderr");
	expect(item).toHaveProperty("status");
	expect(item).toHaveProperty("signal");

	if (item.error !== undefined) {
		// Optional error check
		expect(item.error).toBeInstanceOf(Error);
	} else {
		expect(item.error).toBeUndefined();
	}
}
