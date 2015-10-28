//region Imports
const fs = require('fs')
const diff = require('diff')
const confirm = require('inquirer-confirm')
const chalk = require('chalk')
//endregion

function printDiff(delta) {
  //console.log(delta)
  delta.forEach(function(part) {
    // green for additions, red for deletions
    // grey for common parts
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey'
    process.stderr.write(chalk[color](part.value))
  })
}

module.exports = (dest, newContents, done) => {

  let contents = ''
  if (fs.existsSync(dest)) {
    contents = fs.readFileSync(dest, 'utf8')
    fs.writeFileSync(dest, newContents, 'utf8')
    console.log('Created new file:', dest)
    return done()
  }

  const delta = diff.diffChars(contents, newContents)

  //console.log({contents, newContents, delta})
  //if (delta.length <= 1) return done()

  console.log('\n' + chalk.underline('Proposed changes to:'), dest)

  printDiff(delta)

  confirm('Write?').then(() => {
    fs.writeFileSync(dest, newContents, 'utf8')
    done()
  }, () => {
    done('Cancelled.')
  })

}
