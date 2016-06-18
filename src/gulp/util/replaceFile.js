// TODO(vjpr): Use https://github.com/slushjs/gulp-conflict/blob/master/index.js

const fs = require('fs')
const chalk = require('chalk')
const {log} = console
const path = require('path')
const cwd = require('cwd')

module.exports = (dest, newContents, done) => {
  const diff = require('diff')

  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, newContents, 'utf8')
    log('Created new file: %s', dest)
    log()
    log(chalk.green(newContents))
    log()
    return done()
  }

  const contents = fs.readFileSync(dest, 'utf8')

  const delta = diff.diffChars(contents, newContents)

  //log({contents, newContents, delta})
  if (delta.length <= 1) {
    log('Skipping ' + chalk.magenta(path.relative(cwd(), dest)) + ' (identical)')
    return done()
  }

  log('Proposed changes to:', dest)

  log()
  printDiff(delta)
  log()

  prompt([{type: 'confirm', name: 'confirm', message: 'Write?'}]).then(() => {
    fs.writeFileSync(dest, newContents, 'utf8')
    log(chalk.green('Wrote file.'))
    done()
  }, (e) => {
    console.log(e)
    done('Cancelled.')
  })

}

////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////

function prompt(qs) {
  const inquirer = require('inquirer')
  return new Promise((resolve, reject) => {
    inquirer.prompt(qs, (answers) => {
      resolve(answers)
    })
  })
}

function printDiff(delta) {
  //console.log(delta)
  delta.forEach(function (part) {
    // green for additions, red for deletions
    // grey for common parts
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey'
    process.stderr.write(chalk[color](part.value))
  })
}

function padlog(...args) {
  log()
  log(...args)
  log()
}

function logHeading(str) {
  log()
  log(c.underline(str))
  log()
}

////////////////////////////////////////////////////////////////////////////////
