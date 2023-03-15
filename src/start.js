var express = require('express');
const ABI = require("./abi.json");
const { ethers } = require('ethers');
var app = express();
var port = process.env.PORT || 3000;

const provider = new ethers.providers.JsonRpcProvider('https://proud-serene-market.bsc-testnet.discover.quiknode.pro/d6a9a6a4bfb0d185fa4e4827c40e9136df997b82');
const wallet = new ethers.Wallet('4d1bcadd77b833e30e977454ce58bbd1b3c6ea8a5284773638e6cffa970ecb4a');
const signer = wallet.connect(provider);
const contract_address = "0xFAf06C04b9f64e5A13305e191739b01b92F6BFFe"
var address = "0xF9d8D97660e359f6147444fa00fDf998bfed74d9"



const main = async () => {

    let contract = new ethers.Contract(
        contract_address,
        ABI,
        signer
      )
      const a = await contract.paidAddresses(address)
      console.log(a)
      const c = await contract.minTimeBetweenRequests()
      console.log(c.toString())
      const d = await contract.timeLeftUntilNextRequest(address)
      console.log(d.toString())
      try {
        const b = await contract.requestFaucet(address)
        console.log(JSON.parse(b.body))
      } catch (error) {
            console.log(error.error.reason)
      }
 
    
    }


main()
app.listen(port);
console.log('listening on', port);