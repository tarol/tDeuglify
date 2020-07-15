const path = require('path');
const rm = require('rimraf');
const util = require('util');

const beautify = require('js-beautify').js,
      fs = require('fs-extra');

const input = path.join(__dirname, '../dist/raw/index.js');
const output = path.join(__dirname, '../dist/output/beauty.js');

async function process() {
  await util.promisify(rm)(path.join(__dirname, '../dist/output'));
  const data = fs.readFileSync(input, {
    encoding : 'utf8',
  });

  fs.outputFileSync(
    output,
    beautify(data, {
      indent_size          : 2,
      space_in_empty_paren : true,
    })
  );
}

process();
