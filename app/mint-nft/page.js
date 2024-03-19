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
  const [loadingMsg, setLoadingMsg] = useState({
    text: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (window.ethereum === null) {
        setLoadingMsg({ text: "Please Install MetaMask", status: "error" });
      } else {
        setLoadingMsg({ text: "Minting NFT...", status: "pending" });

        let formData = new FormData();
        formData.append("name", nftData.name);
        formData.append("price", nftData.price);
        formData.append("file", file);

        let res = await axios.post("/api/mint-nft", formData);
        const NFT_URI = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;

        let provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        let address = await signer.getAddress();
        let balance = await provider.getBalance(address);

        if (balance < nftData.price) {
          setLoadingMsg({
            text: "Insufficient balance to mint NFT",
            status: "error",
          });
          throw new Error("Insufficient balance to mint NFT");
        }

        let contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS,
          NFTMarketplace.abi,
          signer
        );

        let NFTPriceInWei = parseEther(nftData.price);
        let listingPrice = await contract.listingPrice();
        listingPrice = listingPrice.toString();

        let transaction = await contract.mintNFT(NFT_URI, NFTPriceInWei, {
          value: listingPrice,
        });

        if (transaction) {
          setLoadingMsg({ text: "NFT Minted Successfully", status: "success" });
        }
      }
    } catch (error) {
      setLoadingMsg({
        text: error.message,
        status: "error",
      });
      console.error("Error minting NFT:", error.message);
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
        <div className="w-full text-center">
          {loadingMsg.status === "pending" && (
            <p className="bg-orange-400 text-black rounded font-bold p-2">
              {loadingMsg.text}
            </p>
          )}

          {loadingMsg.status === "success" && (
            <p className="bg-green-500 text-black rounded font-bold p-2">
              {loadingMsg.text}
            </p>
          )}

          {loadingMsg.status === "error" && (
            <p className="bg-rose-500 text-black rounded font-bold p-2">
              {loadingMsg.text}
            </p>
          )}
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
