import type { spawnSync } from "node:child_process";
import { ExitStatus } from "./status.js";
declare class Output {
    exitStatus: ExitStatus;
    stdout: string;
    stderr: string;
    constructor(result: ReturnType<typeof spawnSync>);
}
export { Output };
export default Output;
