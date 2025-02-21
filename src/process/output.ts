import type { spawnSync } from "node:child_process";
import { ExitStatus } from "./status.js";

class Output {
	public exitStatus: ExitStatus;
	public stdout: string;
	public stderr: string;

	constructor(result: ReturnType<typeof spawnSync>) {
		this.exitStatus = new ExitStatus(result);
		this.stdout = result.stdout.toString();
		this.stderr = result.stderr.toString();
	}
}

export { Output };

export default Output;
