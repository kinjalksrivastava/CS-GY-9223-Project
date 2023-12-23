const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data : compiledFactory.evm.bytecode.object})
        .send({from : accounts[0], gas: '2000000'});

    await factory.methods.createCampaign('100').send({
        from : accounts[0], 
        gas: '1000000'
    });

    const addresses= await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns',()=>{
    it('deploys a factory and a campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async() =>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contrbute money and marks them as approvers',async ()=>{
        await campaign.methods.contribute().send({
            value: '200',
            from : accounts[1]
        });

        const isContributors = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributors);
    });

    it('it requires a minimum contributor', async ()=>{
        try{
            await campaign.methods.contribute().send({
                vslue: '50',
                from : accounts[2]
            }); 
            assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('allows a manager to make a payment requests', async ()=>{
        await campaign.methods.createRequest(
            'Buy Battries', '100', accounts[3]
        ).send({
            from : accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy Battries', request.description);
    });

    it('processes requests', async ()=>{

        let balance2 =  await web3.eth.getBalance(accounts[1]);
        balance2 = web3.utils.fromWei(balance2, 'ether');
        balance2 = parseFloat(balance2);

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            'Buy Battries', web3.utils.toWei('5', 'ether'), accounts[1]   
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > balance2 );
    });
});