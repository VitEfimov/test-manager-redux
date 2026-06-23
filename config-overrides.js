module.exports = function override(config, env) {
  // Add rule to disable strict fully specified imports for mjs/js files
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};
