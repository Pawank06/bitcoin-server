"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

const AllBlocks = () => {
  const [getBlockchain, setGetBlockchain] = useState<any[]>([]);

  // Handle incoming blockchain data and new blocks
  useEffect(() => {
    // Handler for blockchain data
    const handleBlockchain = (blockchain: any[]) => {
      console.log("Received blockchain data:", blockchain);
      setGetBlockchain(blockchain);
    };

    // Handler for new block
    const handleBlockAdded = (block: any) => {
      console.log("New block added:", block);
      setGetBlockchain((prevBlockchain) => [...prevBlockchain, block]);
    };

    socket.on("blockchain", handleBlockchain);
    socket.on("blockAdded", handleBlockAdded);

    // Cleanup function to avoid memory leaks
    return () => {
      socket.off("blockchain", handleBlockchain);
      socket.off("blockAdded", handleBlockAdded);
    };
  }, []);

  // Log the current blockchain state
  useEffect(() => {
    console.log("Current blockchain state:", getBlockchain);
  }, [getBlockchain]);

  return (
    <div className="w-[600px] mx-auto mt-4">
      <h2 className="text-xl font-semibold">Blockchain</h2>
      {getBlockchain.length === 0 ? (
        <p>No blocks yet.</p>
      ) : (
        getBlockchain.map((block) => (
          <BlockCard key={block.index} block={block} />
        ))
      )}
    </div>
  );
};

const BlockCard = ({ block }: { block: any }) => (
  <div className="border p-4 mb-2 rounded shadow">
    <h3 className="text-xl font-semibold">Block #{block.index}</h3>
    <p>
      <strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}
    </p>
    <p>
      <strong>Prev Hash:</strong> {block.prevHash}
    </p>
    <p>
      <strong>Hash:</strong> {block.hash}
    </p>
    <p>
      <strong>Data:</strong>{" "}
      {typeof block.data === "object" ? JSON.stringify(block.data) : block.data}
    </p>
  </div>
);

export default AllBlocks;
