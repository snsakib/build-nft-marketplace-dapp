import { NextResponse } from "next/server";

export async function POST(request) {
  let formData = await request.formData();
  const NFT_NAME = formData.get('name');
  const NFT_PRICE = formData.get('price');
  const NFT_FILE = formData.get('file');
  let nftImgCID = '';
  let nftMetadataCID = '';

  const JWT_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2YWUyZmFkMy0wNjdhLTRkN2ItOGVkNC1lNDk2MjAxNWM1NzUiLCJlbWFpbCI6InJzeWVkNDYwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGNkMzk1YzdiOWYzZjdkMDQzMGYiLCJzY29wZWRLZXlTZWNyZXQiOiJlYTZhNjk3NDQ2MWQ3YTkyZjg0ZGRkMmY2NWIxOTcyYmQwNzc3YjFjNDA4YWYxYzY3ZDBhMzFmOTJlYjJiNmFiIiwiaWF0IjoxNzAyOTI4NjYxfQ.prZcbbgpBoPY7Xwj108ZyB_1EzkUy_SXPjaYV5GodF0';
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
