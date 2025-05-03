


import { useEffect, useRef, useState } from "react";

function AudioEmotionDetector() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  const [volume, setVolume] = useState(0);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContextRef.current = new AudioContext();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current.connect(analyserRef.current);

      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      const analyze = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const average = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
        setVolume(average);

        detectEmotion(average);

        requestAnimationFrame(analyze);
      };

      analyze();
    });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const detectEmotion = (volume) => {
    if (volume > 80) {
      setEmotion("Confident / Excited");
    } else if (volume > 50) {
      setEmotion("Calm / Normal");
    } else if (volume > 30) {
      setEmotion("Hesitant / Nervous");
    } else {
      setEmotion("Very Quiet / Uncertain");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>🎙️ Live Tone Analysis</h2>
      <p>Volume Level: {volume.toFixed(2)}</p>
      <p>Detected Emotion: <strong>{emotion}</strong></p>
    </div>
  );
}

export default AudioEmotionDetector;
