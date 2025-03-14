import { createWriteStream, WriteStream } from "fs";
import fs from "fs/promises";
import * as path from "path";
import * as colors from "colors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFileDir = path.join(__dirname, "..", "logs");
// Create a log stream
let logStream: WriteStream;

export async function initializeLogStream(logFileName: string) {
  const logFilePath = path.join(logFileDir, logFileName);
  await fs.mkdir(logFileDir, { recursive: true }).catch(() => {});
  logStream = createWriteStream(logFilePath, { flags: "a" });
}

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  logStream.write(formattedMessage);
}

const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  originalConsoleLog(...args);
  logToFile(args.map((arg) => String(arg)).join(" "));
};

console.error = (...args) => {
  originalConsoleError(...args);
  logToFile(colors.red(args.map((arg) => String(arg)).join(" ")));
};

console.warn = (...args) => {
  originalConsoleWarn(...args);
  logToFile(colors.yellow(args.map((arg) => String(arg)).join(" ")));
};

export function closeLogStream() {
  if (logStream) {
    logStream.end();
  }
}
