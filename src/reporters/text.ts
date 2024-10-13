import { Table, chalk } from "../utils/requireHelper";
import { Vulnerability } from "../types";
const colorsForSeverity: Record<string, any> = {
   critical: chalk.hex("#d9534f"),
   high: chalk.hex("#f0ad4e"),
   moderate: chalk.hex("#f0e68c"),
   low: chalk.hex("#a2c4c9"),
};

const severityOrder: string[] = ["critical", "high", "moderate", "low"];

export default function textReporter(jsonAuditReport: any) {
   printTable(jsonAuditReport.vulnerabilities);
   printSummary(jsonAuditReport.metadata);
}

function printTable(vulnerabilities: any) {
   const table = new Table({
      head: [
         chalk.cyanBright("Severity"),
         chalk.cyanBright("Package"),
         chalk.cyanBright("Paths"),
         chalk.cyanBright("Title"),
         chalk.cyanBright("Patched In"),
      ],
      colWidths: [10, 20, 40, 50],
      wordWrap: true,
   });

   if (vulnerabilities) {
      const vulnerabilityList: Vulnerability[] = Object.values(vulnerabilities);

      vulnerabilityList.sort((a, b) => {
         return (
            severityOrder.indexOf(a.severity) -
            severityOrder.indexOf(b.severity)
         );
      });

      for (const vulnerability of vulnerabilityList) {
         const severityColor =
            colorsForSeverity[vulnerability.severity] || chalk.white;

         const paths = vulnerability.findings
            .map((finding) => finding.paths.join("\n"))
            .join("\n");

         table.push([
            severityColor(vulnerability.severity),
            vulnerability.module_name,
            paths,
            vulnerability.title,
            vulnerability.patched_versions,
         ]);
      }
   }

   console.log(table.toString());
}

function printSummary(metadata: any) {
   let lowCount = metadata.vulnerabilities.low;
   let moderateCount = metadata.vulnerabilities.moderate;
   let highCount = metadata.vulnerabilities.high;
   let criticalCount = metadata.vulnerabilities.critical;
   let vulnerabilitiesCount =
      lowCount + moderateCount + highCount + criticalCount;

   let strArr: string[] = [];
   if (criticalCount) {
      strArr.push(`${criticalCount} critical`);
   }
   if (highCount) {
      strArr.push(`${highCount} high`);
   }
   if (moderateCount) {
      strArr.push(`${moderateCount} moderate`);
   }
   if (lowCount) {
      strArr.push(`${lowCount} low`);
   }
   if (strArr.length) {
      console.log(
         `found ${vulnerabilitiesCount} vulnerabilities (${strArr.join(", ")}) in ${metadata.totalDependencies} scanned packages`,
      );
   } else {
      console.log(chalk.green("found 0 vulnerabilities"));
   }
}
