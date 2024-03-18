"use client";
import Image from "next/image";

export default function NFTCard(data) {
  let imgURL = "https://ipfs.io/ipfs/" + data.data.img;
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
        <button className="bg-blue-500 rounded p-2 w-full font-bold">
          Buy NFT
        </button>
      </div>
    </div>
  );
}
