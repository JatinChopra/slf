// import { useState, useEffect, useRef } from "react";

// function useAudioPlayer() {
//   const [duration, setDuration] = useState<number>(0);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);

//   // Type definitions for the refs
//   const audioContext = useRef<AudioContext | null>(null);
//   const source = useRef<AudioBufferSourceNode | null>(null);
//   const startTime = useRef<number>(0);
//   const pauseTime = useRef<number>(0);
//   const audioBuffer = useRef<AudioBuffer | null>(null);

//   useEffect(() => {
//     audioContext.current = new (window.AudioContext ||
//       //@ts-ignore
//       window?.webkitAudioContext)();
//     return () => {
//       if (audioContext.current) {
//         audioContext.current.close();
//       }
//     };
//   }, []);

//   const loadAudio = async (url: string) => {
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();
//     audioBuffer.current = await audioContext.current!.decodeAudioData(
//       arrayBuffer
//     );
//     setDuration(audioBuffer.current.duration);
//   };

//   const play = () => {
//     if (isPlaying) return;
//     source.current = audioContext.current!.createBufferSource();
//     source.current.buffer = audioBuffer.current;
//     source.current.connect(audioContext.current!.destination);

//     const offset = pauseTime.current;
//     startTime.current = audioContext.current!.currentTime - offset;
//     source.current.start(0, offset);
//     setIsPlaying(true);
//   };

//   const pause = () => {
//     if (!isPlaying) return;
//     source.current!.stop();
//     pauseTime.current = audioContext.current!.currentTime - startTime.current;
//     setIsPlaying(false);
//   };

//   const seek = (time: number) => {
//     if (isPlaying) {
//       pause();
//     }
//     pauseTime.current = time;
//     setCurrentTime(time);
//     if (isPlaying) {
//       play();
//     }
//   };

//   useEffect(() => {
//     let animationFrame: number;
//     const updateTime = () => {
//       if (isPlaying) {
//         setCurrentTime(audioContext.current!.currentTime - startTime.current);
//       }
//       animationFrame = requestAnimationFrame(updateTime);
//     };
//     updateTime();
//     return () => cancelAnimationFrame(animationFrame);
//   }, [isPlaying]);

//   return { duration, currentTime, isPlaying, loadAudio, play, pause, seek };
// }

// export default useAudioPlayer;
