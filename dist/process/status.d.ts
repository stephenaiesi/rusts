import type { spawnSync } from "node:child_process";
import { type Result } from "../result/index.js";
declare class ExitStatus {
    result: ReturnType<typeof spawnSync>;
    code: number | null;
    signal: NodeJS.Signals | null;
    error?: Error;
    constructor(result: ReturnType<typeof spawnSync>);
    exitOk(): Result<null, ExitStatusError>;
}
declare class ExitStatusError extends Error {
    private status;
    constructor(status: ExitStatus);
    code(): number | null;
    intoStatus(): ExitStatus;
}
export { ExitStatus, ExitStatusError };
export default ExitStatus;
