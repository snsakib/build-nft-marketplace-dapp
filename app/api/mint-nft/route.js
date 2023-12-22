import { NextResponse } from "next/server";

// Define Pinata API endpoints and headers
const PINATA_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_METADATA_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
let pinataHeaders = {
  Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
};

// Define an asynchronous function to pin a NFT data to IPFS
async function pinToIPFS(url, data, apiType) {
  try {
    if (apiType === "JSON") {
      pinataHeaders = {
        ...pinataHeaders,
        "Content-Type": "application/json",
      };
    }
    // Make a POST request to the specified URL with provided headers and form data
    const response = await fetch(url, {
      method: "POST",
      headers: { ...pinataHeaders },
      body: data,
    });

    // Check if the response is successful; otherwise, throw an error
    if (response.statusText !== "OK") {
      throw new Error(`Failed to pin to IPFS. Status: ${response.status}`);
    }

    // Parse the response JSON and return the IPFS hash
    const responseData = await response.json();
    return responseData.IpfsHash;
  } catch (error) {
    // Log and throw any errors that occur during the pinning process
    console.error("Error pinning to IPFS:", error.message);
    throw error;
  }
}

// Export an asynchronous function named POST to handle incoming HTTP POST requests
export async function POST(request) {
  try {
    // Parse the incoming form data from the HTTP request
    const formData = await request.formData();

    // Extract relevant data from the form fields
    const NFT_NAME = formData.get("name");
    const NFT_PRICE = formData.get("price");
    const NFT_FILE = formData.get("file");

    // Create a new FormData object for the NFT image and its metadata
    const fileData = new FormData();
    fileData.append("file", NFT_FILE);
    fileData.append("pinataMetadata", JSON.stringify({ name: NFT_NAME }));

    // Pin the NFT image to IPFS and get the resulting CID
    const nftImgCID = await pinToIPFS(PINATA_FILE_URL, fileData, "FILE");

    // Create metadata for the NFT, including the name, price, and image CID
    const nftMetadata = {
      name: NFT_NAME,
      price: NFT_PRICE,
      img: nftImgCID,
    };

    // Pin the NFT metadata to IPFS and get the resulting CID
    const nftMetadataCID = await pinToIPFS(
      PINATA_METADATA_URL,
      JSON.stringify(nftMetadata),
      "JSON"
    );

    // Log success message and return the metadata CID as JSON response
    console.log("Successfully pinned metadata:", nftMetadataCID);
    return NextResponse.json(nftMetadataCID);
  } catch (error) {
    // Log and return an error response if an exception occurs during processing
    console.error("Error processing NFT:", error.message);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
