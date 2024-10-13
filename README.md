# NPM Audit Reporter

This project builds on top of the existing `npm audit` functionality by providing additional features and presenting audit reports in various formats such as HTML, JSON, and tables.

[![NPM](https://nodei.co/npm/npm-audit-reporter.png)](https://www.npmjs.com/package/npm-audit-reporter)

## Installation

    $ npm install --save npm-audit-reporter

or

    $ npm install -g npm-audit-reporter

<br />

## Usage

### Run global

```bash
npm-audit-reporter --reporter text
```

### Add into package scripts

```JSON
{
  "scripts": {
    "audit": "npm-audit-reporter --reporter text"
  }
}
```

Now you can run locally or in your CI pipeline:

```bash
npm run audit
```

### Screenshots

Output for `npm-audit-reporter --reporter text`:

<img src="./.README/text.png" alt="Text audit report in tabular format" />

Output for `npm-audit-reporter --reporter html`:

<img src="./.README/html.png" alt="HTML audit report" />
<br />

## Options

| Flag         | Short | Description                                                       |
| ------------ | ----- | ----------------------------------------------------------------- |
| `--reporter` | `-r`  | "text" for console output in tabuler format, "html" for html file |
