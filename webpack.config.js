const pkg = require('./package.json');
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./lib/main/index.js",
    output: {
        filename: `lib/canonn-decryptor-${pkg.version}.js`,
        path: path.join(__dirname, "dist")
    },
    devtool: "hidden",
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                ecma: 5
            }
        }),
        new webpack.BannerPlugin(
            `${pkg.name} ${pkg.version}\n` +
            `Copyright (C) 2017 ${pkg.author.name} <${pkg.author.email}>\n` +
            `${pkg.repository.url}`
        ),
        new CopyWebpackPlugin([
            { from: "node_modules/core-js/client/shim.min.js", to: "lib/" },
            { from: "node_modules/zone.js/dist/zone.js", to: "lib/" },
            { from: "assets", to: "assets/", ignore: [ "fitness/input/**", "fitness/Makefile" ] },
            {
                from: "index.html", transform: content => content.toString()
                    .replace(/^\s*<script [\s\S]*<\/script>/m,
                        '    <script src="lib/shim.min.js"></script>\n' +
                        '    <script src="lib/zone.js"></script>')
                    .replace(/^\s*<\/body>/m,
                        `    <script src="lib/canonn-decryptor-${pkg.version}.js"></script>\n` +
                        '  </body>')
            }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [ "source-map-loader" ],
                enforce: "pre"
            }
        ]
    }
}
