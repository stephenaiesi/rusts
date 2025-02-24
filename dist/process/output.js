import { ExitStatus } from "./status.js";
class Output {
    exitStatus;
    stdout;
    stderr;
    constructor(result) {
        this.exitStatus = new ExitStatus(result);
        this.stdout = result.stdout.toString();
        this.stderr = result.stderr.toString();
    }
}
export { Output };
export default Output;
