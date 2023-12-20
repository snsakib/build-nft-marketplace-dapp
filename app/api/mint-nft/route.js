import { NextResponse } from "next/server";

export async function POST(request) {
  let formData = await request.formData();
  const NFT_NAME = formData.get('name');
  const NFT_PRICE = formData.get('price');
  const NFT_FILE = formData.get('file');
  let nftImgCID = '';
  let nftMetadataCID = '';

  const PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const PIN_METADATA_URL = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  let fileData = new FormData();
  fileData.append("file", NFT_FILE);

  let fileMetadata = JSON.stringify({
    name: NFT_NAME,
  });
  fileData.append("pinataMetadata", fileMetadata);

  let pinFileRes = await fetch(PIN_FILE_URL, {
    method: "POST",
    maxBodyLength: "Infinity",
    headers: {
      "Authorization": `Bearer ${process.env.PINATA_JWT_TOKEN}`,
    },
    body: fileData
  });

  if(pinFileRes.status === 200) {
    let pinFileResData = await pinFileRes.json();
    nftImgCID = pinFileResData.IpfsHash;

    let nftMetadata = {
      name: NFT_NAME,
      price: NFT_PRICE,
      img: nftImgCID
    }

    let jsonMetadata = JSON.stringify(nftMetadata);

    let pinMetadataRes = await fetch(PIN_METADATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${process.env.PINATA_JWT_TOKEN}`,
      },
      body: jsonMetadata
    });

    let pinMetadataResData = await pinMetadataRes.json();
    nftMetadataCID = pinMetadataResData.IpfsHash;
  
    console.log(pinMetadataResData)
  }


  return NextResponse.json(nftMetadataCID);
}
