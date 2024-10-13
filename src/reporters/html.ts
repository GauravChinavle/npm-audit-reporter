import { Vulnerability } from "../types";
import { ejs, fs, path } from "../utils/requireHelper";

const templatePath = path.resolve(__dirname, "../templates/template.ejs");

export default function htmlReporter({ vulnerabilities, metadata }: any) {
   const severityOrder: string[] = ["critical", "high", "moderate", "low"];
   const table: any = [];
   const summary: any = {};

   if (vulnerabilities) {
      const vulnerabilityList: Vulnerability[] = Object.values(vulnerabilities);

      vulnerabilityList.sort((a, b) => {
         return (
            severityOrder.indexOf(a.severity) -
            severityOrder.indexOf(b.severity)
         );
      });

      for (const vulnerability of vulnerabilityList) {
         let paths: any = [];
         if (vulnerability.findings) {
            paths = vulnerability.findings.map((finding) =>
               finding.paths.join("\n"),
            );
         }

         table.push({
            severity: vulnerability.severity,
            moduleName: vulnerability.module_name,
            paths,
            title: vulnerability.title,
            patchedVersion: vulnerability.patched_versions,
         });
      }
   }

   if (metadata) {
      summary.lastUpdated = new Date().toISOString() + " UTC";
      summary.criticalCount = metadata.vulnerabilities.critical;
      summary.highCount = metadata.vulnerabilities.high;
      summary.moderateCount = metadata.vulnerabilities.moderate;
      summary.lowCount = metadata.vulnerabilities.low;
      const totalVulnerabilityCount =
         metadata.vulnerabilities.critical +
         metadata.vulnerabilities.high +
         metadata.vulnerabilities.moderate +
         metadata.vulnerabilities.low;
      summary.vulnerabilityPercentage =
         Math.round(
            (totalVulnerabilityCount / metadata.totalDependencies) * 100,
         ) + "%";
      summary.lowCount = metadata.vulnerabilities.low;
   }

   ejs.renderFile(templatePath, { table, summary }, (err: any, result: any) => {
      if (err) {
         console.error(err);
      } else {
         fs.writeFileSync("npm-audit-report.html", result);
      }
   });
}
