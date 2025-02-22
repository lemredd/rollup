const { promises: fs } = require('fs');
const { join } = require('path');
const { loader } = require('../../../utils.js');

const fsReadFile = fs.readFile;

module.exports = {
	description: 'maxParallelFileReads: fileRead error is forwarded',
	options: {
		input: 'main',
		plugins: loader({
			main: `import {foo} from './dep';`
		})
	},
	before() {
		fs.readFile = (path, options) => {
			if (path.endsWith('dep.js')) {
				throw new Error('broken');
			}

			fsReadFile(path, options);
		};
	},
	after() {
		fs.readFile = fsReadFile;
	},
	error: {
		message: `Could not load ${join(__dirname, 'dep.js')} (imported by main): broken`,
		watchFiles: ['main', join(__dirname, 'dep.js')]
	}
};
