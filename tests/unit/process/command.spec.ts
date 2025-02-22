import { ChildProcess, type SpawnSyncReturns } from "node:child_process";
import { expect } from "vitest";
import { Iter } from "../../../src/iter/index.js";
import { None, Some } from "../../../src/option/index.js";
import {
	Command,
	ExitStatus,
	type Options,
	Output,
} from "../../../src/process/index.js";
import { ResultBase } from "../../../src/result/index.js";

import { expectToBeSpawnSyncReturn } from "./util.js";

describe("Command", () => {
	test("constructor", () => {
		const command = Command.new("echo");
		expect(command).toBeInstanceOf(Command);
	});

	test("arg", () => {
		const command = Command.new("echo");
		command.arg("hello");
		expect(command.getArgs().collect()).toEqual(["hello"]);
		command.arg("world");
		expect(command.getArgs().collect()).toEqual(["hello", "world"]);
	});

	test("args, getArgs", () => {
		const command = Command.new("echo");
		command.args(["hello", "world"]);
		expect(command.getArgs().collect()).toEqual(["hello", "world"]);

		command.args(Iter.of(["one", "two"]));
		expect(command.getArgs().collect()).toEqual([
			"hello",
			"world",
			"one",
			"two",
		]);
	});

	test("env,envs,getEnvs,envRemove,envClear", () => {
		const command = Command.new("echo");

		command.env("hello", "world");

		expect(command.getEnvs().collect()).toEqual([["hello", Some.of("world")]]);

		command.envs({
			first: "one",
			second: "two",
		});

		expect(command.getEnvs().collect()).toEqual([
			["hello", Some.of("world")],
			["first", Some.of("one")],
			["second", Some.of("two")],
		]);

		command.envRemove("hello");

		expect(command.getEnvs().collect()).toEqual([
			["hello", None.instance],
			["first", Some.of("one")],
			["second", Some.of("two")],
		]);

		// @ts-expect-error
		expect(command.options.inheritEnv).toBe(true);

		command.envClear();

		expect(command.getEnvs().collect()).toEqual([]);

		// @ts-expect-error
		expect(command.options.inheritEnv).toBe(false);
	});

	test("opt, opts, optRemove, optClear, getOpts", () => {
		const command = Command.new("echo");

		const hasOpt = <T>(key: string, val: T) =>
			command
				.getOpts()
				.fold((acc, [K, v]) => (acc ? acc : K === key && v === val), false);

		const hasOpts = (opts: Partial<Options>) =>
			Object.entries(opts).every(([key, val]) => hasOpt(key, val));

		expect(
			hasOpts({
				cwd: process.cwd(),
				inheritEnv: true,
			}),
		).toBe(true);

		command.opt("uid", 1000);

		expect(hasOpt("uid", 1000)).toBe(true);

		command.optRemove("uid");

		expect(hasOpt("uid", 1000)).toBe(false);

		command.opts({
			gid: 1001,
			inheritEnv: false,
		});

		expect(hasOpts({ gid: 1001, inheritEnv: false })).toBe(true);

		expect(command.getOpts().collect()).toEqual([
			["cwd", process.cwd()],
			["inheritEnv", false],
			["gid", 1001],
		]);

		command.optsClear();

		expect(command.getOpts().collect()).toEqual([
			["cwd", process.cwd()],
			["inheritEnv", true],
		]);
	});

	test("spawn", async () => {
		const command = Command.new("echo");
		command.arg("hello");
		const child = command.spawn();

		expect(child).toBeInstanceOf(ChildProcess);
	});

	test("spawnSync", () => {
		const command = Command.new("echo").arg("hello").env("foo", "bar");

		const result = command.spawnSync();

		expectTypeOf(result).toEqualTypeOf<SpawnSyncReturns<Buffer>>();

		expectToBeSpawnSyncReturn(result);
	});

	test("output", () => {
		const command = Command.new("echo").arg("hello");

		const output = command.output();

		expect(output).toBeInstanceOf(Output);
	});

	test("status", () => {
		const command = Command.new("echo").arg("hello");

		const status = command.status();

		expect(status).toBeInstanceOf(ResultBase);
		expect(status.unwrap()).toBeInstanceOf(ExitStatus);

		const commandFail = Command.new("nonexistant_command");

		const statusFail = commandFail.status();

		expect(statusFail).toBeInstanceOf(ResultBase);

		expect(statusFail.unwrapErr()).toBeInstanceOf(Error);
	});

	test("getProgram", () => {
		const command = Command.new("echo");

		expect(command.getProgram()).toBe("echo");
	});

	test("getCurrentDir", () => {
		const command = Command.new("echo");

		expect(command.getCurrentDir()).toBe(process.cwd());

		command.opt("cwd", "/tmp");

		expect(command.getCurrentDir()).toBe("/tmp");
	});

	test("uid,gid", () => {
		const command = Command.new("echo");

		expect(command.getOpts().collect()).not.toContainEqual(["uid", 22]);

		command.uid(22);

		expect(command.getOpts().collect()).toContainEqual(["uid", 22]);

		expect(command.getOpts().collect()).not.toContainEqual(["gid", 22]);

		command.gid(22);

		expect(command.getOpts().collect()).toContainEqual(["gid", 22]);
	});

	test("preExec, exec", () => {
		const command = Command.new("echo");

		const cb = vi.fn();

		command.preExec(cb);

		expect(cb).not.toHaveBeenCalled();

		expect(command.exec()).toBeUndefined();

		expect(cb).toHaveBeenCalledTimes(1);

		const cb2 = vi.fn();

		command.preExec(cb2);

		expect(cb2).not.toHaveBeenCalled();

		expect(command.exec()).toBeUndefined();

		expect(cb).toHaveBeenCalledTimes(2);
		expect(cb2).toHaveBeenCalledTimes(1);

		const commandFail = Command.new("nonexistant_command");

		expect(commandFail.exec()).toBeInstanceOf(Error);
	});
});
