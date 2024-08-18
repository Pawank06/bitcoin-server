'use client'

import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002'); // Connect to Miner Server

const Home = () => {
    const [wallet, setWallet] = useState<{ publicKey: string; privateKey: string } | null>(null);
    const [transaction, setTransaction] = useState('');

    const createWallet = () => {
        const publicKey = 'fake-public-key'; // Replace with real key generation
        const privateKey = 'fake-private-key';
        setWallet({ publicKey, privateKey });
    };

    const sendTransaction = () => {
        if (wallet) {
            socket.emit('mineBlock', { from: wallet.publicKey, to: 'recipient-address', amount: 1 });
        }
    };

    return (
        <div>
            <h1>Bitcoin-like Wallet</h1>
            <button onClick={createWallet}>Create Wallet</button>
            {wallet && <div>Public Key: {wallet.publicKey}</div>}
            <input
                type="text"
                value={transaction}
                onChange={(e) => setTransaction(e.target.value)}
                placeholder="Transaction data"
            />
            <button onClick={sendTransaction}>Send Transaction</button>
        </div>
    );
};

export default Home;
