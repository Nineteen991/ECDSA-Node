const express = require("express");
const secp = require('ethereum-cryptography/secp256k1')
const { toHex } = require('ethereum-cryptography/utils')
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x60a713d087a41556f50d": 100,
  "0x4f557a5ee4ab9aa2a2e8": 50,
  "0x3ea06218b847270c48ee": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  const [hashedMsg, signature, recoveryBit] = sender
  let approvedAddr

  const publicKey = secp.recoverPublicKey(
    hashedMsg,
    signature,
    recoveryBit
  )

  if (sender) {
    approvedAddr = `0x${toHex(publicKey).slice(-20)}`
    setInitialBalance(`0x${approvedAddr}`);
    setInitialBalance(recipient);
  }

  if (balances[approvedAddr] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[approvedAddr] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[approvedAddr] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}