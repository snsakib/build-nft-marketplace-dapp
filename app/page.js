"use client";
import { ethers } from "ethers";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { useEffect, useState } from "react";
import axios from "axios";
import NFTCard from "@/components/NFTCard";

export default function Home() {
  const [data, updateData] = useState([]);

  async function getAllNFTs() {
    try {
      if (window.ethereum === null) {
        console.error("Please Install Metamask");
      } else {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
          NFTMarketplace.abi,
          provider
        );
        let transaction = await contract.getAllNFTs();
        let items = await Promise.all(
          transaction.map(async (item) => {
            let tokenURI = await contract.tokenURI(item.id);
            let res = await axios.get(tokenURI);
            let metadata = res.data;
            let NFT = {
              id: item.id,
              name: metadata.name,
              owner: item.owner,
              price: metadata.price,
              img: metadata.img,
            };
            return NFT;
          })
        );
        updateData(items);
      }
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  }

  useEffect(() => {
    getAllNFTs();
  }, []);

  return (
    <div className="grid grid-cols-1 min-[650px]:grid-cols-2 min-[950px]:grid-cols-3 min-[1250px]:grid-cols-4 gap-5 place-items-center p-5">
      {data.map((value, index) => {
        return <NFTCard data={value} key={index}></NFTCard>;
      })}
    </div>
  );
}
