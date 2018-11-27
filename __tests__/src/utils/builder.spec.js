import * as babel from 'babel-core';
import { 
    updateReactImportNode,
    updateFunctionalComponent,
 } from '../../../src/utils/builder';
import { importPlugin, jsxPlugin } from '../../fixtures/plugins';

let program;

describe('utils', () => {
  describe('updateReactImportNode', () => {
    it('should add named export to react default export', () => {
      program = 'import React from \'react\'';
      const plugin = importPlugin(updateReactImportNode);
      const { code } = babel.transform(program, { plugins: [plugin] });
      expect(code).toMatchSnapshot();
    });

    it('should extend named exports', () => {
        program = 'import React, { Component, Foo } from \'react\'';
        const plugin = importPlugin(updateReactImportNode);
        const { code } = babel.transform(program, { plugins: [plugin] });
        expect(code).toMatchSnapshot();
      });
  });

  describe('updateFunctionalComponent', () => {
      it('should wrap variable declaration with memo', () => {
        program = `const fakeComponent = () => { return (<div>hello</div>); }`;
        const plugin = jsxPlugin(updateFunctionalComponent);
        const { code } = babel.transform(program, { 
            plugins: ["syntax-jsx", plugin],
        });
        expect(code).toMatchSnapshot();
      });
  });
});
