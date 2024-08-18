"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Initialize socket connection to Miner Server
const socket = io("http://localhost:3002");

const Home = () => {
  const [wallet, setWallet] = useState<{ address: string; key: string } | null>(
    null
  );
  const [transaction, setTransaction] = useState("");
  const [amount, setAmount] = useState(0);

  const createWallet = async () => {
    try {
      const response = await fetch("http://localhost:5000/create-wallet");
      const data = await response.json();
      console.log("Wallet created:", data);
      setWallet(data);
    } catch (error) {
      console.log("Error creating wallet:", error);
    }
  };

  // Function to send a transaction
  const sendTransaction = () => {
    if (wallet) {
      const transactionData = {
        from: wallet.address,
        to: transaction,
        amount,
      };
      console.log("Sending transaction:", transactionData);
      socket.emit("mineBlock", transactionData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <h1 className="text-3xl font-bold">Bitcoin-like Wallet</h1>
      <Button onClick={createWallet}>Create Wallet</Button>
      {wallet && <div className="mt-2">Public Key: {wallet.address}</div>}
      <div className="w-[600px] mx-auto flex flex-col gap-2">
        <Input
          type="text"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          placeholder="Transaction data"
        />
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />
      </div>
      <Button onClick={sendTransaction} className="mt-2">
        Send Transaction
      </Button>
    </div>
  );
};

export default Home;
