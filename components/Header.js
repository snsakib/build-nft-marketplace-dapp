"use client";
import Image from "next/image";
import Link from "next/link";
import { WalletContext } from "@/context/WalletContext";
import { useContext, useEffect } from "react";

export default function Header() {
  const { walletAddress, setWalletAddress } = useContext(WalletContext);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      setWalletAddress(accounts[0].caveats[0].value[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    const getConnectedWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Failed to fetch connected wallet:", error);
        }
      }
    };

    getConnectedWallet();
  }, []);

  return (
    <header className="flex flex-col min-[825px]:flex-row justify-between py-5 px-10 border-b-2 border-black">
      <div className="flex flex-row items-center mb-5 md:lg-0 md:mr-5">
        <Image src="/logo.svg" width={40} height={40} alt="Logo" />
        <h1 className="ml-5 text-xl font-bold min-[500px]:text-2xl text-black">
          NFT Marketplace
        </h1>
      </div>

      <div className="flex flex-col items-center max-[900px]:flex-1 min-[500px]:flex-row min-[500px]:justify-between md:text-xl">
        <div className="flex justify-between flex-1 text-md font-bold text-black">
          <Link href="/" className="min-[900px]:px-3">
            Home
          </Link>
          <Link href="/mint-nft" className="min-[900px]:px-3">
            Mint NFT
          </Link>
          <Link href="/my-nft" className="min-[900px]:px-3">
            My NFT
          </Link>
        </div>
        <button
          className="block py-1 px-3 ml-2 rounded-md font-bold text-lg bg-blue-500"
          onClick={connectWallet}
        >
          {walletAddress
            ? walletAddress.substring(0, 6) + "..."
            : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
