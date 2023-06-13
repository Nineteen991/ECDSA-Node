import * as secp from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils'
import server from "./server";

const PRIVATE_KEY_1 = "4816b51a56ad0d3f5f16484e9184aeab6ee8b065cf08a7b84f3cc18f440bde43"
const PRIVATE_KEY_2 = "3d0ca779b25ae6995f8041c212eed46f3ab3926dd297e6446b28e38e300dfc1b"
const PRIVATE_KEY_3 = "50f80c76ae60447c9381548bf8254dc2b589f34b44c5e69769720104a2c5a5d8"

const wallets = [
  {
    address: "0x60a713d087a41556f50d",
    PRIVATE_KEY: PRIVATE_KEY_1
  },
  {
    address: "0x4f557a5ee4ab9aa2a2e8",
    PRIVATE_KEY: PRIVATE_KEY_2
  },
  {
    address: "0x3ea06218b847270c48ee", 
    PRIVATE_KEY: PRIVATE_KEY_3
  },
]

function hashMsg(msg) {
  const msgBytes = utf8ToBytes(msg)
  const hashedMsg = keccak256(msgBytes)
  return hashedMsg
}

function Wallet({ address, setAddress, balance, setBalance, setSignedMsg }) {
  // const pubAddr = toHex(secp.getPublicKey(wallets[2].PRIVATE_KEY)).slice(-20)
  // console.log(`0x${pubAddr}`)

  async function signMsg(wallet) {
    const hashedMsg = hashMsg('approved')
    const signed = await secp.sign(
      hashedMsg, 
      wallet.PRIVATE_KEY, 
      { recovered: true }
    )
    const signedArr = [toHex(hashedMsg), toHex(signed[0]), signed[1]]
    setSignedMsg(signedArr)
  }

  async function onChange(evt) {
    const address = evt.target.value;
    const wallet = wallets.filter(key => key.address === address)
    if(wallet.length === 0) {
      alert("Use 1 of the 3 addresses provided")
      throw new Error("Unknown wallet & unknown private key. Use 1 of the 3 addresses provided.")
    }
    signMsg(wallet[0])

    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <div>
        <h6>Use one of the below wallet addresses</h6>
        <h6>The private key will be approved behind the scenes</h6>
        <h6>I suppose I could have stored the private keys in a .env file</h6>
        <h6>0x60a713d087a41556f50d</h6>
        <h6>0x4f557a5ee4ab9aa2a2e8</h6>
        <h6>0x3ea06218b847270c48ee</h6>
      </div>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet