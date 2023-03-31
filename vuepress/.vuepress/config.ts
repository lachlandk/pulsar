import { defineConfig } from "vuepress/config";

export default defineConfig({
    title: "Pulsar",
    description: "A data visualisation framework for the web. ",
    base: "/pulsar/",
    dest: "./docs/",
    themeConfig: {
        repo: "https://github.com/lachlandk/pulsar",
        nav: [{
                text: "Home",
                link: "/",
            }, {
                text: "Guide",
                link: "/guide/"
            }, {
                text: "API Reference",
                link: "/generated/"
        }],
        sidebar: {
            "/guide/": [{
                title: "Guide",
                collapsable: false,
                children: [
                    "/guide/"
                ]
            }, {
                title: "Generated",
                collapsable: false,
                children: [
                    ["/generated/", "API Reference"]
                ]
            }]
        },
    },
    plugins: {
        // TODO: remove dependency on this plugin to have more control over appearance of generated docs
        "vuepress-plugin-typedoc": {
            entryPoints: ["src/core/index.ts", "src/plotting/index.ts"],
            tsconfig: "tsconfig.json",
            out: "generated",
            readme: "none",
            excludeExternals: true,
            sort: "static-first"
        }
    }
});
