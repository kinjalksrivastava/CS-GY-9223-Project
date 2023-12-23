const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

var input =  {
    language: 'Solidity',
    sources: {
        'Campaign.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

const output = {
    Campaign : {
        abi: JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].Campaign.abi,
        evm:  JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].Campaign.evm
    },
    CampaignFactory : {
        abi: JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory.abi,
        evm:  JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'].CampaignFactory.evm
    }
}

fs.ensureDirSync(buildPath);

for (let contracts in output){
    fs.outputJSONSync(
        path.resolve(buildPath, contracts.replace(':', '') + '.json'),
        output[contracts]
    )
}