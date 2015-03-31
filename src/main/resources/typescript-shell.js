/*global process, require */

(function () {

    "use strict";
    var args = process.argv,
        fs = require("fs"),
        typescript = require("typescript"),
        mkdirp = require("mkdirp"),
        path = require("path");


    var SOURCE_FILE_MAPPINGS_ARG = 2;
    var TARGET_ARG = 3;
    var OPTIONS_ARG = 4;

    var sourceFileMappings = JSON.parse(args[SOURCE_FILE_MAPPINGS_ARG]);
    var target = args[TARGET_ARG];
    var options = JSON.parse(args[OPTIONS_ARG]);

    var sourcesToProcess = sourceFileMappings.length;
    var results = [];
    var problems = [];
    var opts = { noEmitOnError: true, noImplicitAny: true, target: typescript.ScriptTarget.ES5, module: typescript.ModuleKind.CommonJS };

    sourceFileMappings.forEach(function (mapping) {
        try {
            var filenames = [mapping[0]];
            var outputFile = mapping[1].replace('.ts', '.js');
            var output = path.join(target, outputFile);
            var host = typescript.createCompilerHost(opts);
            var program = typescript.createProgram(filenames, opts, host);
            var checker = typescript.createTypeChecker(program, /*produceDiagnostics*/ true);
            var result = checker.emitFiles();
            results.push({
                source: filenames[0],
                result: null
            });
        } catch (err) {
            console.log(err);
           problems.push({
                message: err.message,
                severity: "error",
                lineNumber: err.location.first_line,
                characterOffset: err.location.first_column,
                lineContent: contents.split("\n")[err.location.first_line],
                source: input
            });
            results.push({
                source: input,
                result: null
            });
        }
    });

    // function compileDone() {
    //     if (--sourcesToProcess === 0) {
    //         console.log("\u0010" + JSON.stringify({results: results, problems: problems}));
    //     }
    // }

    // function throwIfErr(e) {
    //     if (e) throw e;
    // }

    // function endsWith(str, suffix) {
    //     return str.indexOf(suffix, str.length - suffix.length) !== -1;
    // }

    // sourceFileMappings.forEach(function (sourceFileMapping) {

    //     var input = sourceFileMapping[0];
    //     options.literate = (endsWith(input, ".litcoffee"));
    //     var outputFile = sourceFileMapping[1].replace(options.literate ? ".litcoffee" : ".coffee", ".js");
    //     var output = path.join(target, outputFile);
    //     var sourceMapOutput = output + ".map";

    //     fs.readFile(input, "utf8", function (e, contents) {
    //         throwIfErr(e);

    //         if (options.sourceMap) {
    //             options.filename = input;
    //             options.generatedFile = path.basename(outputFile);
    //             options.sourceFiles = [path.basename(input)];
    //         }

    //         try {
    //             var compileResult = coffeeScript.compile(contents, options);

    //             mkdirp(path.dirname(output), function (e) {
    //                 throwIfErr(e);

    //                 var js = compileResult.js;
    //                 if (js === undefined) {
    //                     js = compileResult;
    //                 }
    //                 if (options.sourceMap) {
    //                     js = js + "\n//# sourceMappingURL=" + path.basename(sourceMapOutput) + "\n";
    //                 }

    //                 fs.writeFile(output, js, "utf8", function (e) {
    //                     throwIfErr(e);

    //                     if (options.sourceMap) {
    //                         fs.writeFile(sourceMapOutput, compileResult.v3SourceMap, "utf8", throwIfErr);
    //                     }

    //                     results.push({
    //                         source: input,
    //                         result: {
    //                             filesRead: [input],
    //                             filesWritten: options.sourceMap ? [output, sourceMapOutput] : [output]
    //                         }
    //                     });

    //                     compileDone();
    //                 });
    //             });

    //         } catch (err) {
    //             problems.push({
    //                 message: err.message,
    //                 severity: "error",
    //                 lineNumber: err.location.first_line,
    //                 characterOffset: err.location.first_column,
    //                 lineContent: contents.split("\n")[err.location.first_line],
    //                 source: input
    //             });
    //             results.push({
    //                 source: input,
    //                 result: null
    //             });

    //             compileDone();
    //         }
    //     });
    // });
})();