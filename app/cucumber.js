module.exports = {
  default: {
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: ['test/e2e/steps/**/*.ts', 'test/e2e/world/**/*.ts'],
    format: ['progress-bar'],
    publishQuiet: true,
    paths: ['test/e2e/features/**/*.feature'],
  },
};
