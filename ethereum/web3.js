import Web3 from "web3";
 
let web3;
const ganacheProvider = "http://127.0.0.1:7545";
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //we are in the browser and metamask is running
    window.ethereum.request({method : 'eth_requestAccounts'});
    web3 =  new Web3(window.ethereum);
}else{
    //We are on the server or metmask not running 
    const provider = new Web3.providers.HttpProvider(ganacheProvider);
    web3 = new Web3(provider);
}

export default web3;
