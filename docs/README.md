# webpackerator

One `webpack.config.js` to rule them all!

## Why

Webpack configs are huge, and everyone seems to have their own.

## The idea

Place config settings nearby the modules/code that need them.

Resolve the config by taking in build parameters, and locating all these config files.

Show filenames and line numbers where settings were set.

Easy printing of resolved config.

Webpack config is now modular, and shareable.

## Working with legacy weback.config.js

Feed `webpackerator` all your configs!


```js
// webpackerator.js 

import w from 'webpackerator'
w.eat('webpack.config.base.js')
w.eat('webpack.config.development.js', {env: 'development'}) // 2nd parameter is the conditions in which this file is used.
w.eat('webpack.config.production.js', {env: 'production'})
w.eat('config/webpack') // a directory...or a glob...or an array of globs.
w.eat('node_modules/*/webpackerator.global.js') // we don't use `webpackerator.js` because it would be used to build the module.
w.merge('entry.main', 'yo')
w.merge('entry.main', 'yo')
```

Wrap all your webpack configs in this function signature, and any variables should be passed in through the `opts` parameter.

```js
module.exports = (webpack, opts) => {
  return {entry: opts.entryFile}
}
```

```js
w.opts({
  entryFile: './main.js',
})
```

Get config and do whatever with it...

```js
w.resolve()
```

Print it...

```js
w.print()
```

Built-in gulp tasks....

Add to `gulpfile.js`:

```js
// gulpfile.js

const gulp = require('gulp')
require('webpackerator/gulp')(gulp)
```

Looks for webpackerator config file in `[cwd]/webpackerator.js`.

---

Now anywhere you need this, it will look for the closest `webpackerator.js` file to get the config.

```js
import w from 'webpackerator'
w.resolve()
```

or...

```js
import {Config} from 'webpackerator'
const config = new Config
config.resolve()
```
