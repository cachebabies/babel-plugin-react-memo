'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrowFunctionExpressionVisitor = exports.wrapWithMemo = exports.updateReactImportNode = undefined;

var _babelTypes = require('babel-types');

var builder = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var updateReactImportNode = exports.updateReactImportNode = function updateReactImportNode(importPath) {
  var _importPath$node = importPath.node,
      specifiers = _importPath$node.specifiers,
      source = _importPath$node.source;


  if (source.value === 'react') {
    var updatedNode = builder.importSpecifier(builder.identifier('memo'), builder.identifier('memo'));

    specifiers.push(updatedNode);
  }
};

var wrapWithMemo = exports.wrapWithMemo = function wrapWithMemo(node) {
  var wrapper = builder.expressionStatement(builder.callExpression(builder.identifier('memo'), [node]));

  return wrapper;
};

var arrowFunctionExpressionVisitor = exports.arrowFunctionExpressionVisitor = function arrowFunctionExpressionVisitor(path) {
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
      var wrapped = wrapWithMemo(node);
      path.replaceWith(wrapped);
    }
  }
};