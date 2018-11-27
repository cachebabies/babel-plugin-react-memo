import * as builder from 'babel-types';
import { wrap } from 'module';
import { pathToFileURL } from 'url';

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


