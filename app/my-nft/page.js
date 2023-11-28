"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Marketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { NFTMarketplaceAddress } from "../../scripts/config";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "@/scripts/pinata";
import NFTCard from "@/components/NFTCard";

export default function MyNFT() {
  const [data, updateData] = useState([]);
  let provider;
  let signer = null;

  async function getMyNFTs() {
    if (window.ethereum === null) {
      console.log("Please Install Metamask");
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      console.log(signer);
      let contract = new ethers.Contract(
        NFTMarketplaceAddress,
        Marketplace.abi,
        signer
      );
      let transaction = await contract.getMyNFTs();
      let items = await Promise.all(
        transaction.map(async (item) => {
          let tokenURI = await contract.tokenURI(item.id);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          let NFT = {
            id: item.id,
            name: meta.name,
            description: meta.description,
            owner: item.owner,
            price: meta.price,
            img: meta.img,
          };
          return NFT;
        })
      );

      updateData(items);
    }
  }

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
