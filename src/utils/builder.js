import * as builder from 'babel-types';

export const updateReactImportNode = (importPath) => {
  const { node: { specifiers, source } } = importPath;

  if (source.value === 'react') {
    const updatedNode = builder.importSpecifier(
      builder.identifier('memo'),
      builder.identifier('memo')
    );

    specifiers.push(updatedNode);
  }
};

export const wrapWithMemo = (node) => {
  const wrapper = builder.expressionStatement(
    builder.callExpression(builder.identifier('memo'), [node])
  );

  return wrapper;
};

export const arrowFunctionExpressionVisitor = (path) => {
  const {
    parent: {
      type: parentType,
      callee: {
        name: calleeName,
      } = {},
    },
    node,
  } = path;

  const hasMemoCallExpression = parentType === 'CallExpression' && calleeName === 'memo';
  const { body: { body } } = node;
  const returnStatement = body.find(item => item.type === 'ReturnStatement');
  if (path.parent.type !== 'ClassProperty' && path.getFunctionParent().parent.type !== 'ClassBody') {
    if (!hasMemoCallExpression && returnStatement.argument.type === 'JSXElement') {
      const wrapped = wrapWithMemo(node);
      path.replaceWith(wrapped);
    }
  }
};
