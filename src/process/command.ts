import { type SpawnOptions, spawn, spawnSync } from "node:child_process";
import { Iter } from "../iter/index.js";
import { None, type Option, Some } from "../option/index.js";
import { Err, Ok, type Result } from "../result/index.js";
import { Output } from "./output.js";
import { ExitStatus } from "./status.js";

type ObjectEntry<T> = [keyof T, T[keyof T]];

type Options = Omit<Parameters<typeof spawn>[2], "env"> & {
	inheritEnv: boolean;
};

type Environment = Record<string, string | null>;

class Command {
	private arguments: string[] = [];

	private environment: Environment = {};

	private readonly defaultOpts: Options = {
		cwd: process.cwd(),
		inheritEnv: true,
	};

	private options: Options = {
		...this.defaultOpts,
	};

	private preExecCallbacks: (() => void)[] = [];

	constructor(private readonly program: string) {}

	/**
	 * Constructs a new Command from a program string.
	 *
	 * @param program the program to run
	 * @returns a new Command
	 */

	public static new(program: string): Command {
		return new Command(program);
	}

	/**
	 * Adds an argument to the command.
	 *
	 * @param arg the argument to add
	 * @returns this
	 */
	public arg(arg: string): this {
		this.arguments.push(arg);
		return this;
	}

	/**
	 * Adds multiple arguments to the command.
	 *
	 * @param args the arguments to add
	 * @returns this
	 */
	public args(args: Iterable<string>): this {
		for (const arg of args) {
			this.arguments.push(arg);
		}
		return this;
	}

	/**
	 * Adds an environment variable to the command.
	 *
	 * @param key the environment variable's key
	 * @param val the environment variable's value
	 * @returns this
	 */
	public env(key: string, val: string): this {
		this.environment[key] = val;
		return this;
	}

	/**
	 * Adds multiple environment variables to the command.
	 *
	 * @param envs an object mapping environment variable names to their values
	 * @returns this
	 */
	public envs(envs: Record<string, string>): this {
		for (const [key, val] of Object.entries(envs)) {
			this.environment[key] = val;
		}
		return this;
	}

	/**
	 * Removes an environment variable from the command.
	 *
	 * @param key the key of the environment variable to remove
	 * @returns this
	 */
	public envRemove(key: string): this {
		this.environment[key] = null;
		return this;
	}

	/**
	 * Removes all environment variables from the command, and
	 * disables inheriting of environment variables from the parent
	 * process.
	 *
	 * @returns this
	 */
	public envClear(): this {
		this.environment = {};
		this.options.inheritEnv = false;
		return this;
	}

	/**
	 * Sets a command option.
	 *
	 * @param key the option key
	 * @param val the option value
	 * @returns this
	 */
	public opt<K extends keyof Options>(key: K, val: Options[K]): this {
		this.options[key] = val;
		return this;
	}

	/**
	 * Sets multiple command options at once.
	 *
	 * @param opts an object with option keys and values to set
	 * @returns this
	 */
	public opts(opts: Partial<Options>): this {
		this.options = { ...this.options, ...opts };
		return this;
	}

	/**
	 * Removes a command option.
	 *
	 * @param key the option key to remove
	 * @returns this
	 */
	public optRemove<K extends keyof Options>(key: K): this {
		delete this.options[key];
		return this;
	}

	/**
	 * Clears all command options, resetting them to their default values.
	 *
	 * @returns this
	 */

	public optsClear(): this {
		this.options = { ...this.defaultOpts };
		return this;
	}

	/**
	 * Runs the command and returns the spawned child process.
	 *
	 * @returns the spawned child process
	 */
	public spawn() {
		const child = spawn(this.program, this.arguments, this.getSpawnOpts());
		return child;
	}

	/**
	 * Runs the command synchronously and returns the result.
	 *
	 * @returns the spawn sync result
	 */
	public spawnSync() {
		const child = spawnSync(this.program, this.arguments, this.getSpawnOpts());
		return child;
	}

	/**
	 * Converts the command options and envs to a node.js spawn opts object.
	 *
	 * @returns the spawn opts object
	 * @private
	 */
	private getSpawnOpts(): SpawnOptions {
		return {
			...this.options,
			env: {
				...(this.options.inheritEnv && process.env),
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

	/**
	 * Runs the command synchronously and returns an Output object containing the result.
	 *
	 * @returns an Output object with the result of running the command
	 */
	public output(): Output {
		const result = this.spawnSync();
		return new Output(result);
	}

	/**
	 * Runs the command synchronously and returns a Result containing an ExitStatus if the command
	 * was successful, or an Error if the command failed.
	 *
	 * @returns a Result containing an ExitStatus if the command was successful, or an Error if the
	 * command failed
	 */
	public status(): Result<ExitStatus, Error> {
		const result = this.spawnSync();
		return result.error
			? new Err(result.error)
			: new Ok(new ExitStatus(result));
	}

	/**
	 * Gets the program name that this command will run.
	 *
	 * @returns the program name
	 */
	public getProgram(): string {
		return this.program;
	}

	/**
	 * Returns an iterator over the arguments that will be passed to the command.
	 *
	 * @returns an iterator over the arguments
	 */
	public getArgs(): Iter<string> {
		return Iter.of(this.arguments);
	}

	/**
	 * Returns an iterator over the environment variables that will be passed to the command.
	 *
	 * Each element of the iterator is a tuple containing the name of the environment variable
	 * and an Option containing the value of the environment variable. The Option will be `None` if
	 * the environment variable was explicitly set to be unset.
	 *
	 * @returns an iterator over the environment variables
	 */
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

	/**
	 * Returns an iterator over the current command options.
	 *
	 * Each element of the iterator is a tuple containing the option key and its corresponding value.
	 * This allows for iterating over all the options that have been set for the command.
	 *
	 * @returns an iterator over the option key-value pairs
	 */

	public getOpts(): Iter<ObjectEntry<Options>> {
		const self = this;

		return Iter.of<ObjectEntry<Options>>(function* () {
			for (const key in self.options) {
				yield [key as keyof Options, self.options[key as keyof Options]];
			}
		});
	}

	/**
	 * Returns the current working directory of the command, or undefined if it has not been set.
	 *
	 * @returns the current working directory of the command, or undefined if it has not been set
	 */
	public getCurrentDir() {
		return this.options.cwd;
	}

	/**
	 * Sets the user ID that will be used when running the command.
	 *
	 * This option is only available on Unix-like systems and is ignored on Windows.
	 *
	 * @param id the user ID to set
	 * @returns this
	 */
	public uid(id: number): this {
		this.options.uid = id;
		return this;
	}

	/**
	 * Sets the group ID that will be used when running the command.
	 *
	 * This option is only available on Unix-like systems and is ignored on Windows.
	 *
	 * @param id the group ID to set
	 * @returns this
	 */
	public gid(id: number): this {
		this.options.gid = id;
		return this;
	}

	/**
	 * Adds a callback to be executed before the exec command is run.
	 *
	 * The callback will be called with no arguments, and will be called in the order that they were added.
	 *
	 * @param cb the callback to add
	 */
	public preExec(cb: () => void) {
		this.preExecCallbacks.push(cb);
	}

	/**
	 * Executes the command synchronously, invoking any registered pre-execution callbacks.
	 *
	 * This method will first execute any callbacks that have been registered via `preExec`.
	 * It will then attempt to run the command synchronously.
	 *
	 * @returns an Error if the command execution fails, or `undefined` if it succeeds.
	 */

	public exec() {
		for (const cb of this.preExecCallbacks) {
			cb();
		}
		const child = this.spawnSync();
		if (child.error) return child.error;
		return undefined;
	}
}

export type { Options };

export { Command };

export default Command;
