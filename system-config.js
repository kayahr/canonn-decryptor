System.config({
    baseURL: "node_modules",
    packages: {
        "/": {
            defaultExtension: "js"
        }
    },
    packageConfigPaths: [ "@*/*/package.json", "*/package.json" ]
});
