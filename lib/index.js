'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var builder = _ref.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var _path$node = path.node,
            specifiers = _path$node.specifiers,
            source = _path$node.source;


        if (source.value === 'react') {
          var updatedNode = builder.importSpecifier(builder.identifier('memo'), builder.identifier('memo'));
          specifiers.push(updatedNode);
        }
      },
      ArrowFunctionExpression: function ArrowFunctionExpression(path) {
        var _path$parent = path.parent,
            parentType = _path$parent.type,
            _path$parent$callee = _path$parent.callee;
        _path$parent$callee = _path$parent$callee === undefined ? {} : _path$parent$callee;
        var calleeName = _path$parent$callee.name,
            node = path.node;


        var hasMemoCallExpression = parentType === 'CallExpression' && calleeName === 'memo';
        var body = node.body.body;

        var returnStatement = body.find(function (item) {
          return item.type === 'ReturnStatement';
        });

        if (path.parent.type !== 'ClassProperty' && path.getFunctionParent().parent.type !== 'ClassBody') {
          if (!hasMemoCallExpression && returnStatement.argument.type === 'JSXElement') {
            var wrapped = builder.expressionStatement(builder.callExpression(builder.identifier('memo'), [node]));
            path.replaceWith(wrapped);
          }
        }
      }
    }
  };
};

module.exports = exports['default'];