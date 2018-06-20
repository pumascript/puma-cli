const puma = require('pumascript');
const http = require('http');
const fs = require('fs');


let errorsLogs = [];


function readDependencyJsonFile(dir) {
    try {
        return JSON.parse(fs.readFileSync(dir, 'utf8'));
    } catch (e) {
        console.log('The file entered does not exist');
    }
    return undefined;
}


function readUrl(options, callback) {
    var req = http.get(options, function (res) {
        var bodyChunks = [];
        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            callback(body);
        })
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}



function createFile(dir, fileName, data) {
    fs.writeFileSync(dir + '/' + fileName, data);   
}

//Error object
function Error(url) {
    this.url = '' || url;
    this.listErrors = [];
}
Error.prototype.addError = function (line, colum, componentGeneratesError) {
    this.listErrors.push({
        line, colum, componentGeneratesError
    })
}


function testPuma(dataUrl, url) {
    console.info('********** Entering ', url, '****************************');
    var result = puma.evalPuma(dataUrl, 'test');
    let error = new Error();

    error.listErrors = [];
    if (result.success !== undefined) {
        if (result.success) {
            console.info('++++++++++++++ Successful injection ++++++++++++++++++');
            error.url = url;
        } else {
            console.error(`Error when interpreting the file, puma does not support any internal components.
            The error occurred in the line: ${result.pumaAst.loc.end.line}, column: ${result.pumaAst.loc.end.column}
            The component that generates error is the following: ${result.output}`);
            error.url = url;
            error.addError(result.pumaAst.loc.end.line, result.pumaAst.loc.end.column, result.output);
        }
    }
    else {
        console.error(`Error when interpreting the file, puma does not support any internal components.
        The error occurred in the line: ${result.loc.end.line}, column: ${result.loc.end.column}
        The component that generates error is the following: ${result.name}`);
        error.url = url;
        error.addError(result.loc.end.line, result.loc.end.column, result.name);
    }
    errorsLogs.push(error);
    console.info('*************************END INJECTION**********************************');
}


module.exports = function testIntegration(dependencyFile, dirOutputFile = '.', nameOutputFile = 'errorResult') {
    let dependency = readDependencyJsonFile(dependencyFile);
    if (dependency !== undefined) {
        for (let i = 0; i < dependency.length; i++) {
            let aux = dependency[i].url.split('/')
            let host = aux[2];
            let path = '';
            for (let i = 3; i < aux.length; i++) {
                path += '/' + aux[i];
            }//end for       
            let options = {
                host,
                path
            };
            readUrl(options, (body) => {
                testPuma(body, host + path);
                createFile(dirOutputFile, nameOutputFile + '.json', JSON.stringify(errorsLogs, null, 4));
            });
        }//end for  
    }

}