const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@lib": path.resolve(__dirname, "src/lib/"),
      "@assets": path.resolve(__dirname, "src/assets/")
    }
  }
};
