export const importPlugin = functionUnderTest => ({
  visitor: {
    ImportDeclaration(path) {
      functionUnderTest(path);
    },
  },
});

export const jsxPlugin = functionUnderTest => ({
  visitor: {
    JSXElement(path) {
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
