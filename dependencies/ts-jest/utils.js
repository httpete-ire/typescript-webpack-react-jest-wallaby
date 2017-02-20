"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsc = require("typescript");
var path = require("path");
var fs = require("fs");
var assign = require("lodash.assign");
var normalize = require('jest-config').normalize;
var setFromArgv = require('jest-config/build/setFromArgv');
function parseConfig(argv) {
    if (argv.config && typeof argv.config === 'string') {
        if (argv.config[0] === '{' && argv.config[argv.config.length - 1] === '}') {
            return JSON.parse(argv.config);
        }
    }
    return argv.config;
}
function loadJestConfigFromFile(filePath, argv) {
    var config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    config.rootDir = config.rootDir ?
        path.resolve(path.dirname(filePath), config.rootDir) :
        process.cwd();
    return normalize(config, argv);
}
function loadJestConfigFromPackage(filePath, argv) {
    var R_OK = fs.constants && fs.constants.R_OK || fs['R_OK'];
    try {
        fs.accessSync(filePath, R_OK);
    }
    catch (e) {
        return null;
    }
    var packageData = require(filePath);
    var config = packageData.jest || {};
    var root = path.dirname(filePath);
    config.rootDir = config.rootDir ? path.resolve(root, config.rootDir) : root;
    return normalize(config, argv);
}
function readRawConfig(argv, root) {
    var rawConfig = parseConfig(argv);
    if (typeof rawConfig === 'string') {
        return loadJestConfigFromFile(path.resolve(process.cwd(), rawConfig), argv);
    }
    if (typeof rawConfig === 'object') {
        var config = assign({}, rawConfig);
        config.rootDir = config.rootDir || root;
        return normalize(config, argv);
    }
    var packageConfig = loadJestConfigFromPackage(path.join(root, 'package.json'), argv);
    return packageConfig || normalize({ rootDir: root }, argv);
}
function getJestConfig(root) {
    try {
        var yargs = require('yargs');
        var argv = yargs(process.argv.slice(2)).argv;
        var rawConfig = readRawConfig(argv, root);
        return Object.freeze(setFromArgv(rawConfig, argv));
    }
    catch (e) {
        return {};
    }
}
exports.getJestConfig = getJestConfig;
function getTSConfig(globals, collectCoverage) {
    if (collectCoverage === void 0) { collectCoverage = false; }
    var config = (globals && globals.__TS_CONFIG__) ? globals.__TS_CONFIG__ : undefined;
    if (config === undefined) {
        config = 'tsconfig.json';
    }
    if (typeof config === 'string') {
        var configPath = path.resolve(config);
        var external_1 = require(configPath);
        config = external_1.compilerOptions || {};
        if (typeof external_1.extends === 'string') {
            var parentConfigPath = path.join(path.dirname(configPath), external_1.extends);
            config = Object.assign({}, require(parentConfigPath).compilerOptions, config);
        }
    }
    config.module = config.module || tsc.ModuleKind.CommonJS;
    config.jsx = config.jsx || tsc.JsxEmit.React;
    if (collectCoverage) {
        if (config.sourceMap) {
            delete config.sourceMap;
        }
        config.inlineSourceMap = true;
        config.inlineSources = true;
    }
    return tsc.convertCompilerOptionsFromJson(config, undefined).options;
}
exports.getTSConfig = getTSConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBa0M7QUFDbEMsMkJBQTZCO0FBQzdCLHVCQUF5QjtBQUV6QixzQ0FBeUM7QUFDekMsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNuRCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUU3RCxxQkFBcUIsSUFBSTtJQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRW5ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMxRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixDQUFDO0FBRUQsZ0NBQWdDLFFBQVEsRUFBRSxJQUFJO0lBQzVDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5RCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxHQUFH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