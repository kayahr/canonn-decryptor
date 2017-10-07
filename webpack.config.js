const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./lib/main/index.js",
    output: {
        filename: "lib/canonn-decryptor.js",
        path: path.join(__dirname, "dist")
    },
    devtool: "source-map",
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            output: {
                comments: false
            }
        }),
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
                        '    <script src="lib/canonn-decryptor.js"></script>\n' +
                        '  </body>')
            }
        ])
    ]
}
