const express = require("express");
const { utils } = require("ethers");
const ABI = require("./abi.json");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = wallet.connect(provider);
const contract_address = process.env.FAUCET_CONTRACT_ADDRESS

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let contract = new ethers.Contract(contract_address, ABI, signer);
    const timeInMinutes = await contract.minTimeBetweenRequests();
    const contractFaucetAmount = await contract.faucetAmount();

    res.status(200).json({
      minTimeBetweenRequests: timeInMinutes.toString(),
      faucetAmount: utils.formatEther(contractFaucetAmount.toString()),
    });
  } catch (error) {
    res.status(200).json({ error: error.reason });

    console.log(error.reason);
  }
});

module.exports = router;
