"use client";
import { useState } from "react";
import { uploadFileToIPFS, uploadMetadataToIPFS } from "../../scripts/pinata";
import { ethers } from "ethers";
import Marketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { NFTMarketplaceAddress } from "../../scripts/config";
import { parseEther } from "viem";

export default function MintNFT() {
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  let signer = null;
  let provider;

  async function handleSubmit(e) {
    e.preventDefault();
    disableSubmitBtn();

    try {
      const fileUploadResponse = await uploadFile(file, nftData.name);
      if (fileUploadResponse.success) {
        const metadataUploadResponse = await uploadMetadata(
          fileUploadResponse.fileURL
        );
        if (metadataUploadResponse.success) {
          if (window.ethereum === null) {
            console.log("Please Install Metamask");
          } else {
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(
              NFTMarketplaceAddress,
              Marketplace.abi,
              signer
            );
            const NFTPrice = parseEther(nftData.price);
            let listingPrice = await contract.listingPrice();
            listingPrice = listingPrice.toString();

            //actually create the NFT
            let transaction = await contract.mintNFT(
              metadataUploadResponse.metadataURL,
              NFTPrice,
              { value: listingPrice }
            );
            await transaction.wait();
          }
        }
      }
    } catch (error) {}

    enableSubmitBtn();
  }

  function disableSubmitBtn() {
    const btn = document.getElementById("submit");
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    btn.style.opacity = 0.3;
  }

  function enableSubmitBtn() {
    const btn = document.getElementById("submit");
    btn.disabled = false;
    btn.style.cursor = "default";
    btn.style.opacity = 1;
  }

  async function uploadFile(file, fileName) {
    if (file !== null && fileName !== "") {
      setMsg("Uploading file to IPFS...");
      const res = await uploadFileToIPFS(file, nftData.name);
      if (!res.success) {
        setMsg(res.msg);
      }
      return res;
    } else {
      setMsg("Please fill up the required fields.");
      return {
        success: false,
        msg: "Please fill up the required fields.",
      };
    }
  }

  async function uploadMetadata(fileURL) {
    if (
      nftData.name !== "" &&
      nftData.description !== "" &&
      fileURL !== "" &&
      nftData.price !== ""
    ) {
      setMsg("Uploading metadata to IPFS...");
      const nftMetadata = { ...nftData, img: fileURL };
      const res = await uploadMetadataToIPFS(nftMetadata);
      if (res.success) {
        setMsg("Metadata uploaded successfully.");
      }
      return res;
    } else {
      setMsg("Please fill up the requires fields.");
    }
  }

  return (
    <div className="flex flex-col items-center py-10">
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
          <label
            htmlFor="description"
            className="text-xl font-bold text-sky-900"
          >
            NFT Description
          </label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
            className="min-w-full mt-3 rounded min-h-[35px] text-black p-2 border-2 border-sky-900"
            value={nftData.description}
            onChange={(e) =>
              setNftData({ ...nftData, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="flex flex-col justify-around items-start my-5 min-w-full">
          <label htmlFor="image" className="text-xl font-bold text-sky-900">
            Upload Image <span className="text-red-700">*</span>
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
            Price (in ether) <span className="text-red-700">*</span>
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
          <p>{msg}</p>
        </div>
        <div className="flex flex-col justify-around items-start mt-5 min-w-full">
          <button
            id="submit"
            className="rounded font-bold text-xl min-w-full min-h-[35px] bg-sky-900"
            type="submit"
          >
            Create NFT
          </button>
        </div>
      </form>
    </div>
  );
}
