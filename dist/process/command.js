import { spawn, spawnSync } from "node:child_process";
import { Iter } from "../iter/index.js";
import { None, Some } from "../option/index.js";
import { Err, Ok } from "../result/index.js";
import { Output } from "./output.js";
import { ExitStatus } from "./status.js";
class Command {
    program;
    arguments = [];
    environment = {};
    defaultOpts = {
        cwd: process.cwd(),
        inheritEnv: true,
    };
    options = {
        ...this.defaultOpts,
    };
    preExecCallbacks = [];
    constructor(program) {
        this.program = program;
    }
    static new(program) {
        return new Command(program);
    }
    arg(arg) {
        this.arguments.push(arg);
        return this;
    }
    args(args) {
        for (const arg of args) {
            this.arguments.push(arg);
        }
        return this;
    }
    env(key, val) {
        this.environment[key] = val;
        return this;
    }
    envs(envs) {
        for (const [key, val] of Object.entries(envs)) {
            this.environment[key] = val;
        }
        return this;
    }
    envRemove(key) {
        this.environment[key] = null;
        return this;
    }
    envClear() {
        this.environment = {};
        this.options.inheritEnv = false;
        return this;
    }
    opt(key, val) {
        this.options[key] = val;
        return this;
    }
    opts(opts) {
        this.options = { ...this.options, ...opts };
        return this;
    }
    optRemove(key) {
        delete this.options[key];
        return this;
    }
    optsClear() {
        this.options = { ...this.defaultOpts };
        return this;
    }
    spawn() {
        const child = spawn(this.program, this.arguments, this.getSpawnOpts());
        return child;
    }
    spawnSync() {
        const child = spawnSync(this.program, this.arguments, this.getSpawnOpts());
        return child;
    }
    getSpawnOpts() {
        return {
            ...this.options,
            env: {
                ...(this.options.inheritEnv && process.env),
                ...this.getEnvs().fold((acc, [key, val]) => {
                    if (val.isSome())
                        acc[key] = val.unwrap();
                    return acc;
                }, {}),
            },
        };
    }
    output() {
        const result = this.spawnSync();
        return new Output(result);
    }
    status() {
        const result = this.spawnSync();
        return result.error
            ? new Err(result.error)
            : new Ok(new ExitStatus(result));
    }
    getProgram() {
        return this.program;
    }
    getArgs() {
        return Iter.of(this.arguments);
    }
    getEnvs() {
        const env = this.environment;
        return Iter.of(function* () {
            for (const [key, val] of Object.entries(env)) {
                if (val === null) {
                    yield [key, None.instance];
                }
                else {
                    yield [key, Some.of(val)];
                }
            }
        });
    }
    getOpts() {
        const self = this;
        return Iter.of(function* () {
            for (const key in self.options) {
                yield [key, self.options[key]];
            }
        });
    }
    getCurrentDir() {
        return this.options.cwd;
    }
    uid(id) {
        this.options.uid = id;
        return this;
    }
    gid(id) {
        this.options.gid = id;
        return this;
    }
    preExec(cb) {
        this.preExecCallbacks.push(cb);
    }
    exec() {
        for (const cb of this.preExecCallbacks) {
            cb();
        }
        const child = this.spawnSync();
        if (child.error)
            return child.error;
        return undefined;
    }
}
export { Command };
export default Command;
