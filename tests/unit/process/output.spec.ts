import { Command, ExitStatus, Output } from "../../../src/process/index.js";

describe("Output", () => {
	const command = Command.new("echo").arg("hello");
	const result = command.spawnSync();
	const output = new Output(result);

	test("properties", () => {
		expect(output.exitStatus).toBeInstanceOf(ExitStatus);
		expect(output.stdout).toBe("hello\n");
		expect(output.stderr).toBe("");
	});
});
