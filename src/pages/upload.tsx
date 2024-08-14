import React, { DragEvent, useRef, useState, useEffect } from "react";
import axios from "axios";
import LayoutOne from "@/layouts/LayoutOne";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { FaCirclePlus } from "react-icons/fa6";
import { CgSpinner } from "react-icons/cg";
// web3 and contract interface
//@ts-ignore
import web3 from "../ethereum/web3";
import MusicNFTContract from "../ethereum/MusicNFT";
import { isWalletConnected, connectWallet } from "../ethereum/web3";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FaExternalLinkAlt } from "react-icons/fa";

type ipfsResData = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
};
type ipfsResponse = ipfsResData & FormData;

const Upload = () => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();
  const [audioDuration, setAudioDuration] = useState<number>();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [isuploading, setisuploading] = useState(false);
  const [isminting, setisminting] = useState(false);
  const [status, setStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState<undefined | number>(undefined);

  function createAxiosRequest(formData: FormData) {
    let axiosRequest = axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,

      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return axiosRequest;
  }

  async function jsonToIPFS(
    audioPointer: ipfsResponse,
    imagePointer: ipfsResponse,
    uploadType: "normal" | "mint"
  ) {
    // create json object

    let audioPtr = audioPointer as ipfsResData;
    let imagePtr = imagePointer as ipfsResData;
    console.log(JSON.stringify(audioPtr));
    console.log(JSON.stringify(imagePtr));

    let metaData = {
      name: songName + " by " + artistName, // Replace with your actual title
      description: "Description of the NFT", // Replace with your actual description
      image: `https://gateway.pinata.cloud/ipfs/${imagePtr.IpfsHash}`,
      animation_url: `https://gateway.pinata.cloud/ipfs/${audioPtr.IpfsHash}`,
      attributes: [
        {
          trait_type: "Artist",
          value: artistName, // Replace with actual artist name
        },
        {
          trait_type: "Song",
          value: songName, // Replace with actual song name
        },
      ],
    };

    console.log(metaData);

    // add duration to metadata before pushing it to db
    let metaDataWithDuration = { ...metaData, duration: audioDuration };
    try {
      // store the metadata in db
      setStatus("Saving metadata in db");
      let dbReq = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/addmetaData`,
        {
          metaDataWithDuration,
        }
      );
      setisuploading(() => false);
    } catch (e) {
      toast({ title: "Error : while createing a copy of metadata in db" });
    }

    if (uploadType == "mint") {
      try {
        // send the meta data to ipfs & get a cid
        setStatus("Uploading metadata to IPFS");
        let response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: metaData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "application/json",
          },
        });
        setStatus("Minting NFT");
        // console.log("contract below");
        // console.log(MusicNFTContract);
        //@ts-nocheck
        //@ts-ignore
        let uri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        //@ts-ignore
        const accounts = await web3.eth.getAccounts();
        //@ts-ignore
        const something = await MusicNFTContract.methods
          .mintArtistNFT(uri)
          .send({
            from: accounts[0],
          });
        setTransactionHash(something?.transactionHash);
        setToAddress(something?.to);
        setTokenId(something?.type?.substring(2));
        console.log(something);
        setisminting(false);
        setIsDialogOpen(true);
      } catch (e) {
        console.log(e);
        toast({
          title: "Error : calling mint function",
          description: "encountered an error while trying to mint the nft",
        });
      }
    }
    // console.log("got the response");
    // console.log(uri);
  }

  async function uploadToIPFS(uploadType: "normal" | "mint") {
    const audioformdata = new FormData();
    const imageformdata = new FormData();

    if (uploadType === "mint") {
      const walletConnected = await isWalletConnected();

      if (!walletConnected) {
        const connected = await connectWallet();

        // If the wallet is still not connected, stop further execution
        if (!connected) {
          toast({
            title: "Wallet Not Connected",
            description: "Connect your wallet first",
          });
          // alert("Please connect your MetaMask wallet to proceed.");
          return; // Stop further execution
        }
      }
    }

    if (imageFile && audioFile && songName && artistName) {
      imageformdata.append("file", imageFile);
      audioformdata.append("file", audioFile);
    }

    setStatus("Uploading files to IPFS");
    try {
      let [audioResponse, imageResponse] = await axios.all([
        createAxiosRequest(audioformdata),
        createAxiosRequest(imageformdata),
      ]);

      let [audioPointer, imagePointer] = [
        audioResponse.data,
        imageResponse.data,
      ] as ipfsResponse[];

      jsonToIPFS(audioPointer, imagePointer, uploadType);

      // make a console log
      console.log(audioPointer.IpfsHash);
      console.log(imagePointer.IpfsHash);
    } catch (_e) {
      let e: Error = _e as Error;
      toast({
        title: "Error : upload to IPFS",
        description: e.message,
      });
    }

    // try {
    //   let responseData = await
    //   // console.log(responseData);
    //   // console.log("https://gateway.pinata.cloud/ipfs/" + responseData);
    // } catch (_e) {
    //   let e: Error = _e as Error;
    //   toast({
    //     title: "Error : upload to IPFS",
    //     description: e.message,
    //   });
    //   console.log("Some error");
    // }
  }

  function durationCalculator(file: File) {
    console.log("duration calculator initiated =====");
    // audio element
    const audio = new Audio();

    // url for the file and set it to csource
    audio.src = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", function () {
      const duration = audio.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);

      setAudioDuration(duration);
      console.log(duration);
      console.log(minutes);
      console.log(seconds);
    });
  }

  function dropHandler(e: DragEvent) {
    e.preventDefault();

    if (e.dataTransfer?.items?.[0]?.kind === "file") {
      const file = e.dataTransfer.items[0].getAsFile() as File;

      try {
        const fileType = file.type.split("/")[0];
        if (fileType == "audio") {
          // handle audio file upload
          durationCalculator(file);
          toast({ title: "File Dropped", description: "Audio File dropped" });
          setAudioFile(file);
        } else if (fileType == "image") {
          // handle image file upload
          toast({ title: "File Dropped", description: "Image file dropped" });
          setImageFile(file);
        } else {
          throw new Error(
            "Cannot identify the file dropped, it doesnot have type(metadata) associated with it."
          );
        }
      } catch (e) {
        let error: Error = e as Error;
        toast({
          title: "File Drop Error",
          description: error.message,
        });
      }

      // uploadToIPFS(file);
      console.log(file);
    }
  }

  function dragOverHandler(e: DragEvent) {
    e.preventDefault();
  }

  return (
    <div className="text-xl text-white max-w-[700px] mx-auto bggreen-500 p-5 gap-5 w-[95%] mt-10 flex flex-col">
      {/* drop handler for audio */}
      <div
        className="bg-ink-500 w-full h-[280px] border-[5px] rounded-lg border-dashed border-purple-700  border-opacity-[98%] bg-white bg-opacity-[15%] content-center flex items-stretch justify-center"
        id="drop_zone"
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
      >
        <div className="flex flex-col justify-center items-center flex-auto">
          <FaCirclePlus className="text-6xl text-purple-800 mx-auto" />
          <p className="text-neutral-401 text-xl max-w-[300px] text-center mx-auto mt-7">
            Drop Audio & Image File
          </p>
        </div>

        <div></div>
      </div>
      <div className="text-nowrap flex mr-4 font-bold">
        Audio File :{" "}
        {audioFile ? (
          <p className="max-w-[280px] truncate ml-4 "> {audioFile.name}</p>
        ) : (
          "?"
        )}
      </div>
      <div className="text-nowrap flex mr-4 font-bold">
        Image File :{" "}
        {imageFile ? (
          <p className="max-w-[280px] truncate ml-4 "> {imageFile.name}</p>
        ) : (
          "?"
        )}
      </div>

      <div className="sm:w-[95%] flex flex-col gap-1 sm:flex-row  sm:items-center">
        <p className="text-nowrap mr-4 font-bold">Song Name : </p>
        <Input
          value={songName}
          onChange={(e) => {
            setSongName(e.target.value);
          }}
          className="bg-transparent text-xl font-bold"
        />
      </div>
      <div className="sm:w-[85%] flex flex-col gap-1 sm:flex-row  sm:items-center">
        <p className="text-nowrap mr-4 font-bold">Artist Name : </p>
        <Input
          value={artistName}
          onChange={(e) => {
            setArtistName(e.target.value);
          }}
          className="bg-transparent text-xl font-bold"
        />
      </div>

      <Button
        variant="secondary"
        className="sm:w-[32%] font-bold min-w-[280px] relative flex items-center justify-center overflow-hidden"
        onClick={() => {
          setisuploading(true);
          if (audioFile && imageFile && artistName && songName) {
            uploadToIPFS("normal");
          } else {
            toast({
              title: "Drop both files & Fill all the fileds",
            });
            setisuploading(false);
          }
        }}
      >
        {isuploading ? (
          <div className="flex items-center gap-2 justify-start w-full">
            <CgSpinner className="animate-spin text-2xl gradient-text " />
            <p className="gradient-text flex-auto text-center ">{status}</p>
          </div>
        ) : (
          <span className="gradient-text">Upload</span>
        )}
      </Button>

      <Button
        variant="secondary"
        className="sm:w-[32%]   font-bold min-w-[280px]
        "
        onClick={() => {
          setisminting(true);
          if (audioFile && imageFile && artistName && songName) {
            uploadToIPFS("mint");
          } else {
            toast({
              title: "Drop both thumbnail & audio file",
            });
            setisminting(false);
          }
        }}
      >
        {" "}
        {isminting ? (
          <div className="flex items-center gap-2 justify-start w-full">
            <CgSpinner className="animate-spin text-2xl" />{" "}
            <p className="gradient-text flex-auto">{status}</p>
          </div>
        ) : (
          <span className="gradient-text">Mint an NFT</span>
        )}
      </Button>
      {/* <Button
        onClick={() => {
          setIsDialogOpen((curr) => !curr);
        }}
      >
        toggle dialog box
      </Button> */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(val) => {
          setIsDialogOpen(val);
        }}
      >
        <DialogContent className="min-h-[320px]">
          <DialogHeader>
            <DialogTitle>
              {"NFT Creation Complete. Enjoy your masterpiece!"}
            </DialogTitle>
            <DialogDescription className="flex h-full flex-col gap-5 items-start justify-center">
              {imageFile && (
                <img
                  className="h-[240px] w-[240px] mt-10 mx-auto mb-5"
                  src={URL.createObjectURL(imageFile)}
                />
              )}
              <Link
                target="_blank"
                className="text-lg font-bold underline flex items-center gap-2"
                href={
                  transactionHash.length > 0
                    ? `https://sepolia.etherscan.io/tx/${transactionHash}`
                    : "#"
                }
              >
                <FaExternalLinkAlt />
                <img src="/etherscan.png" className="h-8 w-7" />
                View Transaction on Ethere Scan
              </Link>
              <Link
                target="_blank"
                className="text-lg font-bold underline flex gap-2 items-center"
                href={
                  toAddress.length > 1 && tokenId
                    ? `https://testnets.opensea.io/assets/sepolia/${toAddress}/${tokenId}`
                    : "#"
                }
              >
                <FaExternalLinkAlt />
                <img
                  src="https://testnets.opensea.io/static/images/logos/opensea-logo.svg"
                  className="w-6 h-6"
                />
                View NFT on OpenSea
              </Link>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;

Upload.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};
