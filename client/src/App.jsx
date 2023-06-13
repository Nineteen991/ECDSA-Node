import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signedMsg, setSignedMsg] = useState()

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        setSignedMsg={ setSignedMsg }
      />
      <Transfer 
        setBalance={setBalance} 
        signedMsg={ signedMsg }
      />
    </div>
  );
}

export default App;
