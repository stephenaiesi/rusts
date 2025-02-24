import { Err, Ok } from "../result/index.js";
class ExitStatus {
    result;
    code;
    signal;
    error;
    constructor(result) {
        this.result = result;
        this.code = this.result.status;
        this.signal = this.result.signal;
        if (result.error !== undefined)
            this.error = this.result.error;
        else if (this.code !== null && this.code !== 0)
            this.error = new Error(`Process exited with code ${this.code}`);
    }
    exitOk() {
        return this.error ? new Err(new ExitStatusError(this)) : new Ok(null);
    }
}
class ExitStatusError extends Error {
    status;
    constructor(status) {
        if (status.error === undefined) {
            throw new Error("ExitStatusError must be constructed with an a failed ExitStatus");
        }
        super(status.error.message, { cause: status.error.cause });
        this.status = status;
        this.name = status.error.name;
        this.stack = status.error.stack;
    }
    code() {
        return this.status.code;
    }
    intoStatus() {
        return this.status;
    }
}
export { ExitStatus, ExitStatusError };
export default ExitStatus;
