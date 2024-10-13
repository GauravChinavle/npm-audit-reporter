type Finding = {
   version: string;
   paths: string[];
};

export type Vulnerability = {
   severity: string;
   module_name: string;
   title: string;
   patched_versions: string;
   findings: Finding[];
   via: string[];
};
