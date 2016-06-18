# ![webpackerator](https://cloud.githubusercontent.com/assets/281413/15651676/75bd2886-26c4-11e6-8f2e-959ef7f1d6f0.jpg)

- Gulp tasks for common operations.
- Return different configs depending on different settings (env vars, cli, etc.)

## Usage

**webpackerator.js**

module.exports = function(webpack, opts) {
  return {
     context: __dirname + "/app",
     entry: "./entry",
     output: {
       path: __dirname + "/dist",
       filename: "bundle.js",
     },
   }
}

### Gulp

Webpackerator comes with gulp tasks.

**gulpfile.js**

```
const gulp = require('gulp')
require('webpackerator/defaults/gulp')(gulp)
```

- `webpackerator.js` is different to `webpack.config.js` in that it accepts a function with opts and returns a config. This allows you to return a different config depending on some settings (e.g. environment vars, cli args, etc.).
