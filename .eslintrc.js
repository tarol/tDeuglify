module.exports = {
  plugins: ['html'],
  extends: ['eslint:recommended', 'tarol/es/strict'],
  rules: {
    camelcase: [
      2,
      {
        properties: 'never',
      },
    ],
    'id-length': 0,
    'no-unused-vars': 1,
  },
};
