import { spawn, spawnSync } from "node:child_process";
import { Iter } from "../iter/index.js";
import { None, type Option, Some } from "../option/index.js";
import { Err, Ok, type Result } from "../result/index.js";
import { Output } from "./output.js";
import { ExitStatus } from "./status.js";

class Command {
	private arguments: string[] = [];

	private inheritEnv = true;

	private environment: Record<string, string | null> = {};

	private opts = {
		cwd: process.cwd(),
		uid: undefined as number | undefined,
		gid: undefined as number | undefined,
	};

	private preExecCallbacks: (() => void)[] = [];

	constructor(private readonly program: string) {}

	public static new(program: string): Command {
		return new Command(program);
	}

	public arg(arg: string): this {
		this.arguments.push(arg);
		return this;
	}

	public args(args: Iterable<string>): this {
		for (const arg of args) {
			this.arguments.push(arg);
		}
		return this;
	}

	public env(key: string, val: string): this {
		this.environment[key] = val;
		return this;
	}

	public envs(envs: Record<string, string>): this {
		for (const [key, val] of Object.entries(envs)) {
			this.environment[key] = val;
		}
		return this;
	}

	public envRemove(key: string): this {
		this.environment[key] = null;
		return this;
	}

	public envClear(): this {
		this.environment = {};
		this.inheritEnv = false;
		return this;
	}

	public spawn() {
		const child = spawn(this.program, this.arguments, this.getSpawnOpts());
		return child;
	}

	public spawnSync() {
		const child = spawnSync(this.program, this.arguments, this.getSpawnOpts());
		return child;
	}

	private getSpawnOpts() {
		return {
			...this.opts,
			env: {
				...(this.inheritEnv && process.env),
				...this.getEnvs().fold(
					(acc, [key, val]) => {
						if (val.isSome()) acc[key] = val.unwrap();
						return acc;
					},
					{} as Record<string, string>,
				),
			},
		};
	}

	public output(): Output {
		const result = this.spawnSync();
		return new Output(result);
	}

	public status(): Result<ExitStatus, Error> {
		const result = this.spawnSync();
		return result.error
			? new Err(result.error)
			: new Ok(new ExitStatus(result));
	}

	public getProgram(): string {
		return this.program;
	}

	public getArgs(): Iter<string> {
		return Iter.of(this.arguments);
	}

	public getEnvs(): Iter<[string, Option<string>]> {
		const env = this.environment;

		return Iter.of<[string, Option<string>]>(function* () {
			for (const [key, val] of Object.entries(env)) {
				if (val === null) {
					yield [key, None.instance];
				} else {
					yield [key, Some.of(val)];
				}
			}
		});
	}

	public getCurrentDir(): string {
		return this.opts.cwd;
	}

	public uid(id: number): this {
		this.opts.uid = id;
		return this;
	}

	public gid(id: number): this {
		this.opts.gid = id;
		return this;
	}

	public preExec(cb: () => void) {
		this.preExecCallbacks.push(cb);
	}

	public exec() {
		for (const cb of this.preExecCallbacks) {
			cb();
		}
		const child = this.spawnSync();
		if (child.error) return child.error;
		return undefined;
	}
}

export { Command };

export default Command;
