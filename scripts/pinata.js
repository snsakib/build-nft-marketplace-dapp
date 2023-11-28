const key = "027eaa07c0f3b053d444";
const secret =
  "299cb1ee27f2812e635c0380c4bcf9e422ef2c9010a35cacdb8cd5cd05a88c0d";

const axios = require("axios");
const FormData = require("form-data");

export const uploadFileToIPFS = async (file, name) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append("file", file);

  const metadata = JSON.stringify({
    name: name,
  });
  data.append("pinataMetadata", metadata);

  return axios
    .post(url, data, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        fileURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        msg: "File uploaded successfully!",
      };
    })
    .catch(function (error) {
      return {
        success: false,
        msg: error.response.data.error.details,
      };
    });
};

export const uploadMetadataToIPFS = async (data) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, data, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        metadataURL:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        message: error.message,
      };
    });
};

export const GetIpfsUrlFromPinata = (pinataUrl) => {
  var IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
};
