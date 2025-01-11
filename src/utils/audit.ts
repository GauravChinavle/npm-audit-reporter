import { exec } from "child_process";
const MAX_BUFFER_SIZE = 1024 * 1000 * 50;

export default async function audit(): Promise<any> {
   return new Promise((resolve, reject) => {
      try {
         const auditCommand = "npm audit";
         exec(
            `${auditCommand} --json`,
            {
               maxBuffer: MAX_BUFFER_SIZE,
               cwd: process.cwd(),
            },
            (error, stdout, stderr) => {
               const auditReport: any = JSON.parse(stdout);

               if (auditReport.vulnerabilities) {
                  resolve({
                     vulnerabilities: auditReport.vulnerabilities,
                     metadata: auditReport.metadata,
                     auditReportVersion: auditReport.auditReportVersion
                  });
               } else if (auditReport.advisories) {
                  resolve({
                     vulnerabilities: auditReport.advisories,
                     metadata: auditReport.metadata,
                  });
               }

               if (auditReport.error) {
                  console.log(error);
               }
            },
         );
      } catch (parseError: any) {
         reject(`Error parsing JSON: ${parseError.message}`);
      }
   });
}
