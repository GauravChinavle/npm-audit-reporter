import { ejs, fs, path } from "../utils/requireHelper";

export default function htmlReporter({
    vulnerabilities,
    metadata,
    auditReportVersion,
}: any) {
    const severityOrder: string[] = ["critical", "high", "moderate", "low"];
    const table: any = [];
    const summary: any = {};

    if (vulnerabilities) {
        const vulnerabilityList: any = Object.values(vulnerabilities);

        vulnerabilityList.sort((a: any, b: any) => {
            return (
                severityOrder.indexOf(a.severity) -
                severityOrder.indexOf(b.severity)
            );
        });

        for (const vulnerability of vulnerabilityList) {
            let paths: any = [];
            console.log(vulnerability.nodes);
            if (vulnerability.findings) {
                paths = vulnerability.findings.map((finding: any) =>
                    finding.paths.join("\n"),
                );
            } else {
                paths = vulnerability.nodes
                    .map((finding: any) => finding.replace("node_modules/", "")
                            ?.replaceAll("/node_modules/", ">"))
                    .join("\n");
            }

            const rowObject = {
                severity: vulnerability.severity,
                moduleName: vulnerability.module_name || vulnerability.name,
                paths,
                title: vulnerability.title,
                patchedVersion:
                    vulnerability.patched_versions ||
                    vulnerability?.fixAvailable?.version ||
                    "No fix available",
            };
            if (auditReportVersion === 2) {
                delete rowObject.title;
            }
            table.push(rowObject);
        }
    }

    if (metadata) {
        const totalDependencies =
            metadata.totalDependencies || metadata.dependencies.total;

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
            Math.round((totalVulnerabilityCount / totalDependencies) * 100) +
            "%";
        summary.lowCount = metadata.vulnerabilities.low;
    }

    let templatePath;
    if (auditReportVersion === 2) {
        templatePath = path.resolve(__dirname, "../templates/templateVersion2.ejs");
    } else {
        templatePath = path.resolve(__dirname, "../templates/template.ejs");
    }
    ejs.renderFile(
        templatePath,
        { table, summary },
        (err: any, result: any) => {
            if (err) {
                console.error(err);
            } else {
                fs.writeFileSync("npm-audit-report.html", result);
            }
        },
    );
}
