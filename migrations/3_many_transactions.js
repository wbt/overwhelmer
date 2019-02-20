const Overwhelmer = artifacts.require("Overwhelmer");

//Demonstrates Ganache's non-recovery from effective Denial-of-Service
//(overwhelming number of transactions).

module.exports = function(deployer) {
    var transactionsToRun = 5000; //3000 is usually enough on Ganache 1.3.0
    var overwrite = true;
    deployer.then(function() {
        return Overwhelmer.deployed();
    }).then(function(instance) {
        var transactionPromises = [];
        for (var sequence = 0; sequence < transactionsToRun; sequence++) {
            transactionPromises.push(kickoffTransaction(instance, sequence, overwrite));
        }
        console.log("Transactions have all been started.");
        return Promise.all(transactionPromises);
    }).then(function(results) {
        let successes = countZeroes(results);
        console.log("All transactions completed; "+successes+"/"+results.length+" without connection error.");
    }).catch(function(error) {
        console.log("Error processing transactions: "+error);
    });
};

countZeroes = function(arrayIn) {
    var count = 0;
    for(var i = 0; i < arrayIn.length; i++){
        if(arrayIn[i] == 0)
        count++;
    }
    return count;
};

kickoffTransaction = function(instance, sequence, overwrite = true) {
    return new Promise(function(resolve, reject) {
        return callFunction(instance, sequence, overwrite).then(function(result) {
            resolve(0);
        }).catch(function(error) {
            if(error.message.contains("Could not connect to your Ethereum client")) {
                console.log("Error: Could not connect. Proceeding anyway.");
                resolve(1);
            } else {
                console.log("Error starting transaction: "+error.message);
                reject(error);
            }
        });
    });
};

callFunction = function(instance, sequence, overwrite = true) {
    if(overwrite) {
        return instance.overwriteString(sequence+" transactions to overwrite this string have previously been issued.");
    } else {
        return instance.writeUniqueString(sequence, "Here is one copy of a string stored many times.");
    }
};
