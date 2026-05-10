import { execFile, spawn } from "node:child_process";
import process from "node:process";

const port = process.env.PORT || "4173";
const host = process.env.HOST || "127.0.0.1";
const isWindows = process.platform === "win32";

function execFileAsync(command, args) {
  return new Promise((resolve) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout || "",
        stderr: stderr || "",
      });
    });
  });
}

async function findPidsByPort() {
  if (isWindows) {
    const result = await execFileAsync("netstat", ["-ano", "-p", "tcp"]);
    if (!result.ok) {
      return [];
    }

    return [
      ...new Set(
        result.stdout
          .split(/\r?\n/)
          .filter((line) => line.includes(`:${port}`) && line.toUpperCase().includes("LISTENING"))
          .map((line) => line.trim().split(/\s+/).at(-1))
          .filter(Boolean)
      ),
    ];
  }

  const result = await execFileAsync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"]);
  if (!result.ok) {
    return [];
  }

  return result.stdout.split(/\s+/).filter(Boolean);
}

async function stopProcess(pid, force = false) {
  if (isWindows) {
    const args = ["/PID", pid, "/T"];
    if (force) {
      args.push("/F");
    }
    await execFileAsync("taskkill", args);
    return;
  }

  await execFileAsync("kill", [force ? "-9" : "-TERM", pid]);
}

async function stopExistingServer() {
  const pids = await findPidsByPort();
  if (!pids.length) {
    console.log(`No process is listening on port ${port}.`);
    return;
  }

  console.log(`Stopping old dev server on port ${port}: ${pids.join(", ")}`);
  await Promise.all(pids.map((pid) => stopProcess(pid)));

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const remainingPids = await findPidsByPort();
  if (remainingPids.length) {
    console.log(`Force stopping remaining process on port ${port}: ${remainingPids.join(", ")}`);
    await Promise.all(remainingPids.map((pid) => stopProcess(pid, true)));
  }
}

await stopExistingServer();

console.log(`Starting TOPCENT dev server at http://localhost:${port}/`);

const npmCommand = isWindows ? "npm.cmd" : "npm";
const child = spawn(
  npmCommand,
  ["run", "dev", "--", "--host", host, "--port", port],
  {
    stdio: "inherit",
    shell: false,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
