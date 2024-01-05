"use client";
import { ethers, parseEther } from "ethers";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Image from "next/image";

export default function NFTCard(data) {
  let imgURL = "https://ipfs.io/ipfs/" + data.data.img;

  let buyNFT = async (id, price) => {
    try {
      if (window.ethereum === null) {
        console.log("Please Install MetaMask");
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
          throw new Error("Insufficient balance to buy this NFT");
        }

        const transaction = await contract.buyNFT(id, {
          value: NFTPriceInWei,
        });
        await transaction.wait();
      }
    } catch (error) {
      console.error("Error minting NFT", error.message);
    }
  };

  return (
    <div className="border-2 border-sky-900 rounded w-10/12">
      <div>
        <div className="relative h-[300px]">
          <Image src={imgURL} layout="fill" alt="Image of the NFT" />
        </div>
        <div className="p-3 text-black">
          <h1 className="font-bold text-xl">{data.data.name}</h1>
          <p className="text-base mt-2 font-medium">{data.data.price} ETH</p>
        </div>
      </div>
      <div className="py-3 mx-3">
        <button
          className="bg-blue-500 rounded p-2 w-full font-bold"
          onClick={() => buyNFT(data.data.id, data.data.price)}
        >
          Buy NFT
        </button>
      </div>
    </div>
  );
}
