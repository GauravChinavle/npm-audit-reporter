import { jsonReporter, htmlReporter, textReporter } from "../reporters";

export default function report(commandLineInput: any, auditResult: any) {
   for (let input in commandLineInput) {
      switch (commandLineInput[input]) {
         case "json":
            jsonReporter(auditResult);
            break;
         case "html":
            htmlReporter(auditResult);
            break;
         case "text":
            textReporter(auditResult);
            break;
         default:
      }
   }
}
