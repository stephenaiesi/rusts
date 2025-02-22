import type { spawnSync } from "node:child_process";
import { Err, Ok, type Result } from "../result/index.js";

class ExitStatus {
	public code: number | null;
	public signal: NodeJS.Signals | null;
	public error?: Error;

	constructor(public result: ReturnType<typeof spawnSync>) {
		this.code = this.result.status;
		this.signal = this.result.signal;

		if (result.error !== undefined) this.error = this.result.error;
		else if (this.code !== null && this.code !== 0)
			this.error = new Error(`Process exited with code ${this.code}`);
	}

	public exitOk(): Result<null, ExitStatusError> {
		return this.error ? new Err(new ExitStatusError(this)) : new Ok(null);
	}
}

class ExitStatusError extends Error {
	private status: ExitStatus;

	constructor(status: ExitStatus) {
		if (status.error === undefined) {
			throw new Error(
				"ExitStatusError must be constructed with an a failed ExitStatus",
			);
		}

		super(status.error.message, { cause: status.error.cause });
		this.status = status;
		this.name = status.error.name;
		this.stack = status.error.stack;
	}

	code(): number | null {
		return this.status.code;
	}

	intoStatus(): ExitStatus {
		return this.status;
	}
}

export { ExitStatus, ExitStatusError };

export default ExitStatus;
