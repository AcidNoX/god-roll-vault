import { validateGodRollDirectory } from "./validate.js";

const result = validateGodRollDirectory();

if (!result.success) {
  for (const issue of result.issues) {
    const location = issue.file ? `${issue.file}:` : "";
    console.error(`${location}${issue.path}: ${issue.message}`);
  }
  process.exit(1);
}

console.log(`Validated ${result.fileCount} god roll file(s).`);
