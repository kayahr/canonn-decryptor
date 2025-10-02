import configs from "@kayahr/eslint-config";
import globals from "globals";

export default [
    {
        ignores: [
            "doc",
            "lib",
            "dist",
            "src/sandbox"
        ]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    ...configs,
    {
        rules: {
            // Currently broken in 5.12.0
            // "@typescript-eslint/no-unnecessary-type-arguments": "off",

            // Makes no sense in this project thanks to Frontier's sloppy property namings.
            "@typescript-eslint/naming-convention": "off"
        }
    }
];
