import { defineConfig } from "vitest/config";

export default defineConfig(
{
    test: {
        include: [ "src/test/**/*.test.ts" ],
        reporters: [
            "default",
            [ "junit", { outputFile: "lib/test/junit.xml", suiteName: "unit tests" } ]
        ],
        env: {
            NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --expose-gc`
        },
        resolveSnapshotPath: (testPath, snapExtension) => testPath.replace(/\.test\.ts$/, "") + snapExtension,
        coverage: {
            enabled: true,
            reporter: [ "text-summary", "json", "lcov", "clover", "cobertura", "html" ],
            reportsDirectory: "lib/test/coverage",
            include: [ "src/main/**/*.ts" ]
        }
    }
});
