const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "breeze rich nature furnace charge lumber used insect protect chat picture bulk",
  "https://rinkeby.infura.io/v3/512c787773ce43d9ac472bfa37c1ac4a"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  //console.log(accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ gas: "3000000", from: accounts[0] });
  console.log("Contract deploy to", result.options.address);
  provider.engine.stop();
};
deploy();



//address of Deployment:  0xcff31e9d533563533Ad57727B247F2f83712d866