/** @type {import("@types/prettier").Options} */
module.exports = {
  printWidth: 100,
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
