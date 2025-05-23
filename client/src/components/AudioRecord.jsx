// src/components/AudioEmotionDetector.jsx
import { useEffect, useState, useRef } from "react";
import Meyda from "meyda";

export default function AudioEmotionDetector({ listening, audioStream, onData }) {
  const [emotion, setEmotion] = useState("Listening...");
  const [startTime, setStartTime] = useState(null);
  const [spokenWords, setSpokenWords] = useState([]);
  const [rms, setRms] = useState(0);
  const analyzerRef = useRef(null);

  const updateEmotion = (features) => {
    const { rms, spectralCentroid } = features;
    if (rms > 0.2 && spectralCentroid > 3000) {
      setEmotion("Excited / Energetic");
    } else if (rms > 0.1 && spectralCentroid < 3000) {
      setEmotion("Calm / Confident");
    } else if (rms < 0.05) {
      setEmotion("Quiet / Nervous");
    } else {
      setEmotion("Neutral");
    }
  };

  useEffect(() => {
    if (!audioStream) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);

    analyzerRef.current = Meyda.createMeydaAnalyzer({
      audioContext,
      source,
      bufferSize: 512,
      featureExtractors: ["rms", "mfcc", "spectralCentroid"],
      callback: (features) => {
        setRms(features.rms || 0);
        updateEmotion(features);
      },
    });

    return () => analyzerRef.current?.stop();
  }, [audioStream]);

  useEffect(() => {
    if (listening) {
      setStartTime(Date.now());
      setSpokenWords([]);
      analyzerRef.current?.start();
    } else {
      analyzerRef.current?.stop();

      const durationMinutes = (Date.now() - startTime) / 60000;
      const wordCount = spokenWords.length;
      const wpm = durationMinutes > 0 ? Math.round(wordCount / durationMinutes) : 0;

      onData?.({
        emotion,
        volume: Number((rms * 100).toFixed(2)),
        wpm,
      });
    }
  }, [listening]);

  // Optional: allow InterviewSession to update word list
  useEffect(() => {
    if (!listening) return;
    const transcriptListener = (e) => {
      const words = e.detail.trim().split(/\s+/);
      setSpokenWords((prev) => [...prev, ...words]);
    };

    window.addEventListener("newTranscript", transcriptListener);
    return () => window.removeEventListener("newTranscript", transcriptListener);
  }, [listening]);

  return null;
}





// import { useEffect, useRef, useState } from "react";

// function AudioEmotionDetector() {
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const sourceRef = useRef(null);

//   const [volume, setVolume] = useState(0);
//   const [emotion, setEmotion] = useState("");

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//       audioContextRef.current = new AudioContext();
//       sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
//       analyserRef.current = audioContextRef.current.createAnalyser();
//       analyserRef.current.fftSize = 256;
      
//       sourceRef.current.connect(analyserRef.current);

//       dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

//       const analyze = () => {
//         if (!analyserRef.current) return;
//         analyserRef.current.getByteFrequencyData(dataArrayRef.current);
//         const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
//         setVolume(average);

//         detectEmotion(average);

//         requestAnimationFrame(analyze);
//       };

//       analyze();
//     });

//     return () => {
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//       }
//     };
//   }, []);

//   const detectEmotion = (volume) => {
//     if (volume > 80) {
//       setEmotion("Confident / Excited");
//     } else if (volume > 50) {
//       setEmotion("Calm / Normal");
//     } else if (volume > 30) {
//       setEmotion("Hesitant / Nervous");
//     } else {
//       setEmotion("Very Quiet / Uncertain");
//     }
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h2>🎙️ Live Tone Analysis</h2>
//       <p>Volume Level: {volume.toFixed(2)}</p>
//       <p>Detected Emotion: <strong>{emotion}</strong></p>
//     </div>
//   );
// }

// export default AudioEmotionDetector;
