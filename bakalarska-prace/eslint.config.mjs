import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/exhaustive-deps":
        "off" /* z důvodu hlašení warningu při prázdném dependecy poli v useEffect, 
      kdy chci komponentu načíst pouze při prvním renderu */,
    },
  },
];

export default eslintConfig;
