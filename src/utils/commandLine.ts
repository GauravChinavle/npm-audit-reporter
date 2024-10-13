const commandListFlags: any = {
   "-r": "r",
   "--reporter": "r",
};

export default function commandLine(args: Array<string>) {
   const commandLineInput: any = {};
   for (let i = 2; i < args.length; i = i + 2) {
      const flag = commandListFlags[args[i]];
      if (flag && args[i + 1]) {
         commandLineInput[flag] = args[i + 1];
      }
   }
   return commandLineInput;
}
