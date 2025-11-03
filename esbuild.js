import esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files"

const config = {
    entryPoints: [ "lib/main/index.js" ],
    outfile: "lib/package/lib/app.js",
    format: "esm",
    bundle: true,
    minify: false,
    preserveSymlinks: true,
    legalComments: "none",
    loader: {
        ".html": "text",
    },
    plugins: [
        copyStaticFiles({
            src: "assets/",
            dest: "lib/package/assets/",
            recursive: true,
            filter: path => !(path.endsWith("fitness") || path.endsWith(".html"))
        }),
        copyStaticFiles({ src: "assets/index.html", "dest": "lib/package/index.html" })
    ]
};

if (process.argv.includes("serve")) {
    const ctx = await esbuild.context({ ...config, define: { "process.env.ESBUILD_MODE": "'serve'" } });
    await ctx.watch();
    const server = await ctx.serve({
        servedir: "./lib/package",
        port: 8080
    });
    for (const host of server.hosts) {
        console.log(` > http://${host}:${server.port}/`);
    }
} else if (process.argv.includes("watch")) {
    const ctx = await esbuild.context({ ...config, define: { "process.env.ESBUILD_MODE": "'watch'" } });
    await ctx.watch();
} else {
    await esbuild.build({ ...config, minify: true, define: { "process.env.ESBUILD_MODE": "'build'" } });
}
