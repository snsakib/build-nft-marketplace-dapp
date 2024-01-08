"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import NFTMarketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import NFTCard from "@/components/NFTCard";

export default function MyNFT() {
  const [data, updateData] = useState([]);

  let getMyNFTs = async () => {
    try {
      if (window.ethereum === null) {
        console.log("Please Install Metamask");
      } else {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        let contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
          NFTMarketplace.abi,
          signer
        );
        let transaction = await contract.getMyNFTs();
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
  };

  useEffect(() => {
    getMyNFTs();
  }, []);

  return (
    <div className="grid grid-cols-1 min-[650px]:grid-cols-2 min-[950px]:grid-cols-3 min-[1250px]:grid-cols-4 gap-5 place-items-center p-5">
      {data.map((value, index) => {
        return <NFTCard data={value} key={index}></NFTCard>;
      })}
    </div>
  );
}
