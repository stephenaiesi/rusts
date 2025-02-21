import type { spawnSync } from "node:child_process";
import { Err, Ok, type Result } from "../result/index.js";

class ExitStatus {
	public code: number | null;
	public signal: NodeJS.Signals | null;
	public error: Error | undefined;

	constructor(public result: ReturnType<typeof spawnSync>) {
		this.code = this.result.status;
		this.signal = this.result.signal;
		this.error = this.result.error;
	}

	public exit_ok(): Result<null, ExitStatusError> {
		return this.error ? new Err(new ExitStatusError(this)) : new Ok(null);
	}
}

class ExitStatusError extends Error {
	private status: ExitStatus;

	constructor(status: ExitStatus) {
		super();

		this.status = status;

		if (status.error) {
			this.name = status.error.name;
			this.message = status.error.message;
			this.stack = status.error.stack;
			this.cause = status.error.cause;
		} else {
			this.name = "ExitStatusError";
			this.message = `Process exited with code ${this.code}`;
		}
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
