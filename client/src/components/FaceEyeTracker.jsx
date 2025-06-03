import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function FaceEyeTracker({ listening, onFaceMetrics }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const emotionRef = useRef(null);
  const eyeContactRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const emotionStatsRef = useRef({
    Confident: 0,
    Nervous: 0,
    Neutral: 0,
    EyeContact: 0,
    TotalFrames: 0,
  });

  useEffect(() => {
    let intervalId;

    (async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.addEventListener("playing", () => {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      });

      const mapExpressionToInterviewEmotion = (expression) => {
        switch (expression) {
          case "happy":
          case "surprised":
            return "Confident";
          case "angry":
          case "fearful":
          case "sad":
          case "disgusted":
            return "Nervous";
          case "neutral":
          default:
            return "Neutral";
        }
      };

      intervalId = setInterval(async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (detection) {
          const resized = faceapi.resizeResults(detection, {
            width: canvasRef.current.width,
            height: canvasRef.current.height,
          });

          const expressions = detection.expressions;
          const maxExpression = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );

          const interviewEmotion = mapExpressionToInterviewEmotion(maxExpression);
          emotionRef.current.innerText = interviewEmotion;

          const leftEye = detection.landmarks.getLeftEye();
          const rightEye = detection.landmarks.getRightEye();
          const eyeContact = Math.abs(leftEye[0].y - rightEye[0].y) < 10;
          eyeContactRef.current.innerText = eyeContact ? "Yes 👀" : "No 👀";

          if (listening) {
            emotionStatsRef.current[interviewEmotion]++;
            if (eyeContact) emotionStatsRef.current.EyeContact++;
            emotionStatsRef.current.TotalFrames++;
          }
        } else {
          emotionRef.current.innerText = "No face detected";
          eyeContactRef.current.innerText = "No face detected";
        }
      }, 200);
    })();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      clearInterval(intervalId);
      faceapi.tf.engine().disposeVariables();
    };
  }, [listening]);

  useEffect(() => {
    if (!listening && emotionStatsRef.current.TotalFrames > 0) {
      const stats = emotionStatsRef.current;
      const total = stats.TotalFrames;
      const result = {
        Confident: +(100 * stats.Confident / total).toFixed(1),
        Nervous: +(100 * stats.Nervous / total).toFixed(1),
        Neutral: +(100 * stats.Neutral / total).toFixed(1),
        EyeContact: +(100 * stats.EyeContact / total).toFixed(1),
      };

      console.log("✅ Final face metrics:", result);

      if (onFaceMetrics) {
        onFaceMetrics({
          facialEmotionPercentages: {
            Confident: result.Confident,
            Nervous: result.Nervous,
            Neutral: result.Neutral,
          },
          eyeContactPercentage: result.EyeContact,
        });
      }

      // Reset stats
      emotionStatsRef.current = {
        Confident: 0,
        Nervous: 0,
        Neutral: 0,
        EyeContact: 0,
        TotalFrames: 0,
      };
    }
  }, [listening]);

  return (
    <div style={{ padding: 20, position: "relative", width: 640, margin: "0 auto", borderRadius: 4, }}>
      {!modelsLoaded && <p>Loading models...</p>}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: 640, transform: "scaleX(-1)" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 640,
        }}
      />
      {/* <div style={{ marginTop: 20, textAlign: "center" }}>
        <p>
          <strong>Emotion:</strong> <span ref={emotionRef}>--</span>
        </p>
        <p>
          <strong>Eye Contact:</strong> <span ref={eyeContactRef}>--</span>
        </p>
      </div> */}
    </div>
  );
}





// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";

// export default function FaceEyeTracker({ listening, onEmotionStats }) {
//   const emotionTimeRef = useRef({ Confident: 0, Nervous: 0, Neutral: 0 });
//   const lastTimestampRef = useRef(Date.now());
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const emotionRef = useRef(null);
//   const eyeContactRef = useRef(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     let intervalId;
//     (async () => {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//         faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//         faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       ]);
//       setModelsLoaded(true);

//       // Start webcam
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       // Resize canvas when video plays
//       videoRef.current.addEventListener("playing", () => {
//         canvasRef.current.width = videoRef.current.videoWidth;
//         canvasRef.current.height = videoRef.current.videoHeight;
//       });

//       const mapExpressionToInterviewEmotion = (expression) => {
//         switch (expression) {
//           case "happy":
//           case "surprised":
//             return "Confident";
//           case "angry":
//           case "fearful":
//           case "sad":
//           case "disgusted":
//             return "Nervous";
//           case "neutral":
//           default:
//             return "Neutral";
//         }
//       };
//       intervalId = setInterval(async () => {
//         if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

//         const detection = await faceapi
//           .detectSingleFace(
//             videoRef.current,
//             new faceapi.TinyFaceDetectorOptions()
//           )
//           .withFaceLandmarks()
//           .withFaceExpressions();
//       // faceapi.draw.drawDetections(canvasRef.current, resized);
//       // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
//       // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
//         const ctx = canvasRef.current.getContext("2d");
//         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//         if (detection) {
//           const resized = faceapi.resizeResults(detection, {
//             width: canvasRef.current.width,
//             height: canvasRef.current.height,
//           });

//           const expressions = detection.expressions;
//           const maxExpression = Object.keys(expressions).reduce((a, b) =>
//             expressions[a] > expressions[b] ? a : b
//           );
//           emotionRef.current.innerText = mapExpressionToInterviewEmotion(maxExpression);

//           const leftEye = detection.landmarks.getLeftEye();
//           const rightEye = detection.landmarks.getRightEye();
//           const eyeContact = Math.abs(leftEye[0].y - rightEye[0].y) < 10;
//           eyeContactRef.current.innerText = eyeContact ? "Yes 👀" : "No 👀";
//         } else {
//           emotionRef.current.innerText = "No face detected";
//           eyeContactRef.current.innerText = "No face detected";
//         }
//       }, 200);
//     })();

//     return () => {
//       // Stop webcam
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
//       }
//       // Clear interval
//       clearInterval(intervalId);
//       // Dispose face-api variables
//       faceapi.tf.engine().disposeVariables();
//     };
//   }, []);

//   return (
//     <div style={{ position: "relative", width: 640, margin: "0 auto" }}>
//       {!modelsLoaded && <p>Loading models...</p>}
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         style={{ width: 640, transform: "scaleX(-1)" }}
//       />
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: 640,
//         }}
//       />
//       <div style={{ marginTop: 20, textAlign: "center" }}>
//         <p>
//           <strong>Emotion:</strong>{" "}
//           <span ref={emotionRef}>--</span>
//         </p>
//         <p>
//           <strong>Eye Contact:</strong>{" "}
//           <span ref={eyeContactRef}>--</span>
//         </p>
//       </div>
//     </div>
//   );
// }
