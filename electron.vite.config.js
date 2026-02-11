import { defineConfig } from "electron-vite";
import { resolve } from "path";
export default defineConfig({
    main: {
        entry: "electron/main.ts",
        build: {
            outDir: "dist/electron",
            rollupOptions: {
                external: ["electron"],
            },
        },
    },
    preload: {
        entry: "electron/preload.ts",
        build: {
            outDir: "dist/electron",
            rollupOptions: {
                external: ["electron"],
            },
        },
    },
    renderer: {
        root: "src/renderer",
        build: {
            outDir: "dist/renderer",
            rollupOptions: {
                input: "src/renderer/index.html",
            },
        },
    },
});
//# sourceMappingURL=electron.vite.config.js.map