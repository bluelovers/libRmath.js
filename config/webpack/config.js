'use strict';

const { resolve } = require('path');
const { lint, tsc } = require('./module/rules')
const { rm, uglify } = require('./plugins');
const { extensions, /* plugins*/ } = require('./resolve');
const { wPackN_Ext } = require('./externals');
//
module.exports = function() {
    const configs = [{
        target: "node",
        entry: {
            libR: resolve('src/lib/index.ts'),
            "libR.min": resolve('src/lib/index.ts')
        },
        output: {
            path: resolve('dist/lib'),
            filename: '[name].js',
            libraryTarget: 'umd2',
            library: 'libR'
        },
        node: {
            __dirname: false,
            __filename: false,
        },
        devtool: 'source-map',
        externals: [
            wPackN_Ext() //for examples see ./externals/index.js
        ],
        module: {
            rules: [
                lint(),
                tsc({ declaration: true })
            ]
        },
        plugins: [
            rm({ paths: ['lib'] })
        ],
        resolve: {
            extensions,
        },
    }];

   


    configs.forEach(conf => {
        conf.module.rules.forEach(rule => {
            rule.include = rule.include || [];
            rule.include.push(resolve('src/lib'));
        });
    });
    return configs;
}