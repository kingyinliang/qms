module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  coverageDirectory: 'tests/unit/coverage',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
}
