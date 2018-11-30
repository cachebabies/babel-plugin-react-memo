# babel-plugin-react-memo
-----

> Transforms React functional and stateless components to use React.memo()

## Prerequisites

1. `Requires React >= 16.6`
React introduced `React.memo()` in `v16.6`.  [View the v16.6 CHANGELOG](https://github.com/facebook/react/blob/master/CHANGELOG.md#1660-october-23-2018)

2. `ES6 JavaScript Syntax` namely the `ArrowFunctionDeclaration`

## Installation

```sh
npm i babel-plugin-react-memo --save-dev
```
## Example

### In

```javascript
// component.jsx
import React from 'react';

const component = () => (<div>foo</div>);
```

### Out

```javascript
// component.jsx

import React, { memo } from 'react';

const component = memo(() => (<div>foo</div>));
```

## Usage

### Via `.babelrc` (Recommended)


#### .babelrc

```json
{
  "plugins": ["react-memo"]   
}
```

### Via CLI

```sh
babel --plugins react-memo script.js
```

### Via Node API

```sh
require("babel-core").transform("code", {
  plugins: ["react-memo"]
});
```

### Notes

##### This plugin will `NOT` modify stateless components implemented within a `ClassBody` or `ClassMethod`

```javascript
// component.js
import React, { Component, Fragment } from 'react';

class MyComponent extends Component {
    getSubComponent = () => (<div>subComponent</div>);
    
    render() {
        const otherComponent = () => (<div>otherComponent</div>)
        return (
            <Fragment>
                { getSubComponent() }
                { otherComponent() }
            </Fragment>
        );
    }
}
```

##### This plugin will `NOT` modify component written as `FunctionDelcaration` e.g.

```javascript
// component.js

function component() {
    return (<div>not supported 😥 </div>);    
}
```

