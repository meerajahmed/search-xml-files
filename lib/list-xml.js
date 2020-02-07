const fse = require('fs-extra');
const fg = require('fast-glob');
const xml2js = require('xml2js');
const get = require('lodash.get');

const REGEX_RULE = /\/(remove_results_path_prefex)\/.*\w+/;
const PATH_TEMPLATE_NODE = 'object.node.path';
const PATH_PROPERTIES_NODE = 'object.node.path';
const FILE_SUFFIX = 'file_suffix.xml';

const parser = new xml2js.Parser();

module.exports = (cmd) => {
    const options = cmd.opts();
    debugger;
    const skipProperty = !options.property;
    const entries = fg.sync(options.file);
    const rules = [];
    const filtered = entries.filter(path => {
        let xmlFile = fse.readFileSync(path, 'utf-8');
        return parser.parseString(xmlFile, (error, result) => {
            if (error) {
                console.log(error);
                return false;
            }

            const templateId = get(result, PATH_TEMPLATE_NODE, '');

            if( templateId !== options.template ) {
                return false;
            }

            const properties = get(result, PATH_PROPERTIES_NODE, [])
                .filter(property => 'Boolean' in property)
                .reduce((acc, cur) => {
                    acc[cur.$.name] = cur.Boolean[0] === 'true';
                    return acc;
                }, {});

            debugger;

            const hasValue = skipProperty || properties[options.property];
            if(hasValue) {
                console.log(`--------------------------------------------`);

                if( skipProperty ) {
                    console.log('Skip property check');
                } else {
                    console.log(` ${options.property}: ${hasValue} `);
                }
                console.log(` Template: ${options.template} `);
                console.log(` Rule: ${path}\n`);
                path.replace(REGEX_RULE, (match) => {
                    rules.push(match.replace(FILE_SUFFIX,''));
                });

            }
            return  hasValue;
        });

    });

    console.log(rules)

};
