export default ({ types: builder }) => ({
  visitor: {
    ImportDeclaration(path) {
      const { node: { specifiers, source } } = path;

      if (source.value === 'react') {
        const updatedNode = builder.importSpecifier(
          builder.identifier('memo'),
          builder.identifier('memo')
        );
        specifiers.push(updatedNode);
      }
    },
    ArrowFunctionExpression(path) {
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

      const wrapped = builder.expressionStatement(
        builder.callExpression(builder.identifier('memo'), [node])
      );

      if (path.parent.type !== 'ClassProperty' && path.getFunctionParent().parent.type !== 'ClassBody') {
        if (node.body.type === 'JSXElement' && !hasMemoCallExpression) {
          path.replaceWith(wrapped);
        }

        if (node.body.type === 'BlockStatement') {
          const { body: { body } } = node;
          const returnStatement = body.find(item => (item.argument && item.argument.type === 'JSXElement')
              && item.type === 'ReturnStatement');

          if (returnStatement && !hasMemoCallExpression) {
            path.replaceWith(wrapped);
          }
        }
      }
    },
  },
});
