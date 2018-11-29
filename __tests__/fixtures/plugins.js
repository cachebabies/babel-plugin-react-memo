export const importPlugin = functionUnderTest => ({
  visitor: {
    ImportDeclaration(path) {
      functionUnderTest(path);
    },
  },
});

export const arrowFunctionPlugin = functionUnderTest => ({
  visitor: {
    ArrowFunctionExpression(path) {
      functionUnderTest(path);
    },
  },
});
