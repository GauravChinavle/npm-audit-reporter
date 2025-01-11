#!/usr/bin/env node
import { commandLine, audit, report } from "./utils";

async function boot() {
   const args = process.argv;
   const commandLineInput = commandLine(args);
   const auditResult = await audit();
   report(commandLineInput, auditResult);
}

boot();
