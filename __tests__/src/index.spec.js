import * as babel from 'babel-core';
import plugin from '../../src';

describe('index', () => {
  describe('ImportDeclaration', () => {
    it('should add named export to react default export', () => {
      const program = 'import React from \'react\'';
      const { code } = babel.transform(program, { plugins: [plugin] });
      expect(code).toMatchSnapshot();
    });

    it('should extend named exports', () => {
      const program = 'import React, { Component, Foo } from \'react\'';
      const { code } = babel.transform(program, { plugins: [plugin] });
      expect(code).toMatchSnapshot();
    });

    it('should not extend named exports if not react', () => {
      const program = 'import { isEqual } from \'lodash\'';
      const { code } = babel.transform(program, { plugins: [plugin] });
      expect(code).toMatchSnapshot();
    });
  });

  describe('ArrowFunctionExpression', () => {
    it('should wrap arrow function with memo', () => {
      const program = 'const fakeComponent = () => { return (<div>hello</div>); }';
      const { code } = babel.transform(program, {
        plugins: [plugin, 'syntax-jsx'],
      });
      expect(code).toMatchSnapshot();
    });

    it('should not wrap arrow function with memo within ClassProperty', () => {
      const program = 'class fakeComponent extends Component { jsxreturn() { return <div>hello</div> } render() { return (<div>hello</div>); } }';
      const { code } = babel.transform(program, {
        plugins: [plugin, 'syntax-jsx'],
      });
      expect(code).toMatchSnapshot();
    });

    it('should not wrap arrow function with memo within ClassBody', () => {
      const program = 'class fakeComponent extends Component { render() { const jsxreturn = () => { return (<div>hello</div>); } } }';
      const { code } = babel.transform(program, {
        plugins: [plugin, 'syntax-jsx'],
      });
      expect(code).toMatchSnapshot();
    });
  });
});
