const express = require("express");
const ABI = require("./abi.json");
const { ethers } = require("ethers");
require('dotenv').config()

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_ENDPOINT);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const signer = wallet.connect(provider);
const contract_address = process.env.FAUCET_CONTRACT_ADDRESS

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const address = req.query.address;
    console.log(address);
    let contract = new ethers.Contract(contract_address, ABI, signer);
    const isUserPaidBefore = await contract.paidAddresses(address);

    const time = await contract.timeLeftUntilNextRequest(address);
    console.log(time.toString());

    res
      .status(200)
      .json({
        paidAddresses: isUserPaidBefore,
        timeLeftUntilNextRequest: time.toString(),
      });
  } catch (error) {
    res.status(200).json({ error: error.reason });

    console.log(error.reason);
  }
});

router.post("/", async (req, res) => {
  try {
    const address = req.body.address;
    console.log(address);
    let contract = new ethers.Contract(contract_address, ABI, signer);

    const b = await contract.requestFaucet(address);
    console.log(JSON.parse(b.body));
    res.status(200).json(b);
  } catch (error) {
    res.status(200).json({ error: error.error });

    console.log(error.error);
  }
});

module.exports = router;
