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
      setStatus("saving metadata in db");
      let dbReq = await axios.post("https://slf-dapp-backend.onrender.com/addmetaData", {
        metaDataWithDuration,
      });
    } catch (e) {
      toast({ title: "Error : while createing a copy of metadata in db" });
    }

    if (isuploading) setisuploading(false);

    if (uploadType == "mint") {
      try {
        // send the meta data to ipfs & get a cid
        setStatus("uploading metadata to ipfs");
        let response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: metaData,
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        toast({ title: "Error : uploading metadata to ipfs" });
      }

      try {
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
        console.log(something);
        if (isminting) setisminting(false);
      } catch (e) {
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

    if (imageFile && audioFile && songName && artistName) {
      imageformdata.append("file", imageFile);
      audioformdata.append("file", audioFile);
    }

    setStatus("Uploading files to ipfs");
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

    audio.addEventListener("loadedmetadata", function() {
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
        Audio File :{" "}
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
        className="sm:w-[32%]  font-bold "
        onClick={() => {
          setisuploading(true);
          if (audioFile && imageFile && artistName && songName) {
            uploadToIPFS("normal");
          } else {
            toast({
              title: "Drop both thumbnail & audio file",
            });
          }
        }}
      >
        {isuploading ? (
          <div className="flex items-center gap-2 justify-start">
            <CgSpinner className="animate-spin text-2xl" /> <p>{status}</p>
          </div>
        ) : (
          "Upload"
        )}
      </Button>
      <Button
        variant="secondary"
        className="sm:w-[32%]   font-bold "
        onClick={() => {
          setisminting(true);
          if (audioFile && imageFile && artistName && songName) {
            uploadToIPFS("mint");
          } else {
            toast({
              title: "Drop both thumbnail & audio file",
            });
          }
        }}
      >
        {" "}
        {isminting ? (
          <div className="flex items-center gap-2 justify-start">
            <CgSpinner className="animate-spin text-2xl" /> <p>{status}</p>
          </div>
        ) : (
          "Mint an NFT"
        )}
      </Button>
    </div>
  );
};

export default Upload;

Upload.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutOne>{page}</LayoutOne>;
};
