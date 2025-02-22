import {
	Command,
	ExitStatus,
	ExitStatusError,
} from "../../../src/process/index.js";
import { Err, Ok } from "../../../src/result/index.js";

describe("ExitStatus", () => {
	const command = Command.new("echo").arg("hello");
	const status = new ExitStatus(command.spawnSync());

	const errCommand = Command.new("ls").arg("--asdf");
	const errStatus = new ExitStatus(errCommand.spawnSync());

	const badCommand = Command.new("nonexistant_command");
	const badStatus = new ExitStatus(badCommand.spawnSync());

	test("properties", () => {
		expect(status.code).toBe(0);
		expect(status.signal).toBe(null);
		expect(status.error).toBe(undefined);

		expect(errStatus.code).toBe(1);
		expect(errStatus.signal).toBe(null);
		expect(errStatus.error).toBeInstanceOf(Error);

		expect(badStatus.code).toBe(null);
		expect(badStatus.signal).toBe(null);
		expect(badStatus.error).toBeInstanceOf(Error);
	});

	test("exitOk", () => {
		const exitOk = status.exitOk();

		const errExitOk = errStatus.exitOk();

		const badExitOk = badStatus.exitOk();

		expect(exitOk).toBeInstanceOf(Ok);
		expect(exitOk.unwrap()).toBe(null);

		expect(errExitOk).toBeInstanceOf(Err);
		expect(errExitOk.unwrapErr()).toBeInstanceOf(Error);

		expect(badExitOk).toBeInstanceOf(Err);
		expect(badExitOk.unwrapErr()).toBeInstanceOf(Error);
	});

	test("ExitStatusError", () => {
		const error = new ExitStatusError(errStatus);

		expect(error).toBeInstanceOf(ExitStatusError);
		expect(error.code()).toBe(1);
		expect(error.intoStatus()).toBe(errStatus);

		expect(() => new ExitStatusError(status)).toThrow();
	});
});
