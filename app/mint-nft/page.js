"use client";
import axios from "axios";
import { ethers, parseEther } from "ethers";
import { useState } from "react";
import NFTMarketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function MintNFT() {
  const [nftData, setNftData] = useState({
    name: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingMsg("Minting NFT...");

    try {
      let formData = new FormData();
      formData.append("name", nftData.name);
      formData.append("price", nftData.price);
      formData.append("file", file);

      let IPFSHash = await axios.post("/api/mint-nft", formData);

      if (window.ethereum === null) {
        setLoadingMsg("Please Install MetaMask");
      } else {
        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        
        let contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
            NFTMarketplace.abi,
            signer
        );
        let NFTPriceInWei = parseEther(nftData.price)
        let listingPrice = await contract.listingPrice();
        listingPrice = listingPrice.toString();

        let transaction = await contract.mintNFT(
          `https://gateway.pinata.cloud/ipfs/${IPFSHash}`,
          NFTPriceInWei,
          { value: listingPrice }
        )
        console.log(transaction)
      }
    } catch (error) {
      console.error("Error minting NFT", error.message);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center py-10 h-screen">
      <h1 className="text-3xl font-bold text-sky-900 mb-5">Create NFT</h1>
      <form
        className="border-2 border-sky-900 rounded-md flex flex-col justify-around items-center min-h-max p-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col justify-around items-start mb-5 min-w-full">
          <label htmlFor="name" className="text-xl font-bold text-sky-900">
            NFT Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="min-w-full mt-3 rounded min-h-[35px] text-black p-2 border-2 border-sky-900"
            value={nftData.name}
            onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col justify-around items-start my-5 min-w-full">
          <label htmlFor="image" className="text-xl font-bold text-sky-900">
            NFT Image <span className="text-red-700">*</span>
          </label>
          <input
            type="file"
            name="image"
            id="image"
            className="min-w-full mt-3 rounded min-h-[35px] text-black p-2 file:bg-white file:text-sky-900 file:font-semibold file:rounded file:mr-2 file:py-1 file:px-2 file:border-0 file:border-rounded"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <div className="flex flex-col justify-around items-start my-5 min-w-full">
          <label htmlFor="price" className="text-xl font-bold text-sky-900">
            NFT Price (ETH) <span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            name="price"
            id="price"
            className="min-w-full mt-3 rounded min-h-[35px] text-black p-2 border-2 border-sky-900"
            value={nftData.price}
            onChange={(e) => setNftData({ ...nftData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <p className="text-green-600 font-bold">{loadingMsg}</p>
        </div>
        <div className="flex flex-col justify-around items-start mt-5 min-w-full">
          <button
            id="submit"
            className="rounded font-bold text-xl min-w-full min-h-[35px] bg-blue-500"
            type="submit"
          >
            Create NFT
          </button>
        </div>
      </form>
    </div>
  );
}
