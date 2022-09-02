const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@c": path.resolve(__dirname, "src/components"),
        "@s": path.resolve(__dirname, "src/stores"),
      },
    },
  },
});
