import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    '0x92b1399cFe294773fF7B2AE4F734E67233b5EF56'
);

export default instance;