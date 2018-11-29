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
}

export const updateFunctionalComponent = (jsxPath) => {
    const parent = jsxPath.getFunctionParent();
    const { container: { type } } = parent;

    switch(type) {
        case 'VariableDeclarator': {
            const { node } = parent;
            const wrapped = wrapWithMemo(node);
            parent.node = wrapped;
        }
    }
}

export const variableDeclarationVisitor = (path) => {
    const { node } = path;
}

/**
 * for this one maybe we convert a function declaration into a fat arrow
 * then use the ArrowFunctionVisitor to update?
 */

export const functionDeclarationVisitor = (path) => {
    // console.log(path.node.body.body);
    const { node } = path;
    const body = path.node.body.body;
    const returnStatement = body.find(item => item.type === 'ReturnStatement');
    console.log(returnStatement);
    if(returnStatement.argument.type === 'JSXElement') {
        const wrapped = wrapWithMemo(node);
        path.replaceWith(wrapped);
    }
};

export const arrowFunctionExpressionVisitor = (path) => {
    const { 
        parent: { 
            type: parentType = '', 
            callee: { 
                name: calleeName = '' 
            } = {} 
        },
        node,
     } = path;
        
    const hasMemoCallExpression = parentType === 'CallExpression' && calleeName === 'memo';
    const body = node.body.body;
    const returnStatement = body.find(item => item.type === 'ReturnStatement');
    if(!hasMemoCallExpression && returnStatement.argument.type === 'JSXElement') {
        const wrapped = wrapWithMemo(node);
        path.replaceWith(wrapped);
    }
};


