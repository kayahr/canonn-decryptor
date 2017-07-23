System.config({
    baseURL: "node_modules",
    packages: {
        "/": {
            defaultExtension: "js",
            meta: { '*.json': { loader: 'systemjs-plugin-json' } }
        }
    },
    packageConfigPaths: [ "@*/*/package.json", "*/package.json" ]
});
