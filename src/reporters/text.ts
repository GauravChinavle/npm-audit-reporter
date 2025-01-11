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
    let vulnerabilities = extractVulnerabilities(jsonAuditReport);
    printTable(vulnerabilities, jsonAuditReport.auditReportVersion);
    printSummary(jsonAuditReport.metadata || calculateSummary(vulnerabilities));
}

function extractVulnerabilities(jsonAuditReport: any): any[] {
    if (jsonAuditReport.auditReportVersion === 2) {
        // For reports with "vulnerabilities"
        return Object.values(jsonAuditReport.vulnerabilities).map(
            (vulnerability: any) => ({
                severity: vulnerability.severity,
                module_name: vulnerability.name,
                findings: vulnerability.nodes,
                patched_versions:
                    vulnerability?.fixAvailable?.version || "No fix available",
            }),
        );
    } else if (jsonAuditReport.vulnerabilities) {
        // For reports with "advisories"
        return Object.values(jsonAuditReport.vulnerabilities).map(
            (vulnerability: any) => ({
                severity: vulnerability.severity,
                module_name: vulnerability.module_name,
                title: vulnerability.title,
                findings: vulnerability.findings,
                patched_versions: vulnerability.patched_versions,
            }),
        );
    }
    return [];
}

function calculateSummary(vulnerabilities: Vulnerability[]): any {
    const summary: any = {
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0,
    };

    for (const vulnerability of vulnerabilities) {
        summary[vulnerability.severity] += 1;
    }

    return {
        vulnerabilities: summary,
        totalDependencies: vulnerabilities.length, // Assuming a basic count
    };
}

function printTable( vulnerabilities: Vulnerability[], auditReportVersion: number ) {
    let headers = [
        chalk.cyanBright("Severity"),
        chalk.cyanBright("Package"),
        chalk.cyanBright("Paths"),
        chalk.cyanBright("Title"),
        chalk.cyanBright("Patched In"),
    ];
    if (auditReportVersion === 2) {
        headers.splice(3, 1);
    }
    const table = new Table({
        head: headers,
        colWidths: [10, 20, 40, 50],
        wordWrap: true,
    });

    vulnerabilities.sort((a, b) => {
        return (
            severityOrder.indexOf(a.severity) -
            severityOrder.indexOf(b.severity)
        );
    });

    for (const vulnerability of vulnerabilities) {
        const severityColor = colorsForSeverity[vulnerability.severity] || chalk.white;
        const paths = vulnerability.findings
            .map((finding: any) => {
                if (finding?.paths?.length) {
                    return finding.paths.join("\n");
                }
                return finding
                    .replace("node_modules/", "")
                    .replaceAll("/node_modules/", ">");
            })
            .join("\n");

        table.push([
            severityColor(vulnerability.severity),
            vulnerability.module_name,
            paths,
            vulnerability.patched_versions,
        ]);
    }
    if (table.length) {
        console.log(table.toString());
    }
}

function printSummary(metadata: any) {
    const { low, moderate, high, critical } = metadata.vulnerabilities;
    const totalDependencies = metadata.totalDependencies || metadata.dependencies.total
    const vulnerabilitiesCount = low + moderate + high + critical;

    let strArr: string[] = [];
    if (critical) {
        strArr.push(`${critical} critical`);
    }
    if (high) {
        strArr.push(`${high} high`);
    }
    if (moderate) {
        strArr.push(`${moderate} moderate`);
    }
    if (low) {
        strArr.push(`${low} low`);
    }
    if (strArr.length) {
        console.log(
            `found ${vulnerabilitiesCount} vulnerabilities (${strArr.join(", ")}) in ${totalDependencies} scanned packages`,
        );
    } else {
        console.log(chalk.green("found 0 vulnerabilities"));
    }
}
