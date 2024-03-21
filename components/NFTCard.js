"use client";
import { ethers, parseEther } from "ethers";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NFTCard(data) {
  const [isOwner, setIsOwner] = useState(false);
  let imgURL = "https://ipfs.io/ipfs/" + data.data.img;

  let buyNFT = async (id, price) => {
    try {
      if (window.ethereum === null) {
        toast.error("Please Install MetaMask");
      } else {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();

        let address = await signer.getAddress();
        let balance = await provider.getBalance(address);
        let NFTPriceInWei = parseEther(price.toString());

        let contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
          NFTMarketplace.abi,
          signer
        );

        if (balance < NFTPriceInWei) {
          throw new Error("Insufficient balance to buy NFT");
        }

        const transaction = await contract.buyNFT(id, {
          value: NFTPriceInWei,
        });
        await transaction.wait();

        if (transaction) {
          toast.success("NFT purchased successfully!");
        }
      }
    } catch (error) {
      toast.error("Error buying NFT: " + error.message);
    }
  };

  useEffect(() => {
    const checkOwnership = async () => {
      if (window.ethereum) {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();

        let address = await signer.getAddress();
        setIsOwner(address === data.data.owner);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkOwnership);
      checkOwnership();

      return () =>
        window.ethereum.removeListener("accountsChanged", checkOwnership);
    }
  });

  return (
    <div className="border-2 border-sky-900 rounded w-10/12">
      <div>
        <div className="relative h-[300px]">
          <Image src={imgURL} fill alt="Image of the NFT" />
        </div>
        <div className="p-3 text-black">
          <h1 className="font-bold text-xl">{data.data.name}</h1>
          <p className="text-base mt-2 font-medium">
            <span className="font-semibold">Owner: </span>
            {data.data.owner.substring(0, 6) + "..."}
          </p>
          <p className="text-base mt-2 font-medium">
            <span className="font-semibold">Price: </span>
            {data.data.price} ETH
          </p>
        </div>
      </div>
      <div className="py-3 mx-3">
        {!isOwner ? (
          <button
            className="bg-blue-500 rounded p-2 w-full font-bold"
            onClick={() => buyNFT(data.data.id, data.data.price)}
          >
            Buy NFT
          </button>
        ) : (
          <button className="bg-blue-500 rounded p-2 w-full font-bold">
            Owned
          </button>
        )}
      </div>
    </div>
  );
}
