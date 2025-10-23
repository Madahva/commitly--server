export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [2, "always", 200],
    "subject-case": [2, "never", ["start-case", "pascal-case"]],
  },
};
