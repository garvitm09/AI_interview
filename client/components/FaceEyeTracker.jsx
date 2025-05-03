// import * as faceapi from 'face-api.js';

// // Now accept setFaceEmotion and setEyeContact
// export async function startInterviewAnalyzer(videoRef, canvasRef, setFaceEmotion, setEyeContact) {
//   // Load only necessary models
//   await Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//     faceapi.nets.faceExpressionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//   ]);

//   // Start webcam
//   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   videoRef.current.srcObject = stream;

//   // Adjust canvas
//   videoRef.current.addEventListener('playing', () => {
//     canvasRef.current.width = videoRef.current.videoWidth;
//     canvasRef.current.height = videoRef.current.videoHeight;
//   });

//   const mapExpressionToInterviewEmotion = (expression) => {
//     switch(expression) {
//       case 'happy':
//       case 'surprised':
//         return 'Confident';
//       case 'angry':
//       case 'fearful':
//       case 'sad':
//       case 'disgusted':
//         return 'Nervous';
//       case 'neutral':
//       default:
//         return 'Neutral';
//     }
//   };

//   setInterval(async () => {
//     if (videoRef.current.paused || videoRef.current.ended) return;

//     const detection = await faceapi
//       .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceExpressions();

//     const ctx = canvasRef.current.getContext('2d');
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     if (detection) {
//       const resized = faceapi.resizeResults(detection, {
//         width: canvasRef.current.width,
//         height: canvasRef.current.height
//       });


//       faceapi.draw.drawDetections(canvasRef.current, resized);
//       faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
//       faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
//       // (no drawing since you want clean video)

//       const expressions = detection.expressions;
//       const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

//       const interviewEmotion = mapExpressionToInterviewEmotion(maxExpression);
//       setFaceEmotion(interviewEmotion);  // 🧠 Update face emotion in App.jsx!

//       const leftEye = detection.landmarks.getLeftEye();
//       const rightEye = detection.landmarks.getRightEye();
//       const eyeContact = Math.abs(leftEye[0].y - rightEye[0].y) < 10;
//       setEyeContact(eyeContact ? "Good Eye Contact" : "Poor Eye Contact");  // 🧠 Update eye contact status!
//     } else {
//       setFaceEmotion("No face detected");
//       setEyeContact("No face detected");
//     }
//   }, 200);
// }








import * as faceapi from 'face-api.js';

export async function startInterviewAnalyzer(videoRef, canvasRef, emotionDisplayRef, eyeContactDisplayRef) {
  // Load only necessary models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  ]);

  // Start webcam
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = stream;

  // Adjust canvas
  videoRef.current.addEventListener('playing', () => {
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
  });
  const mapExpressionToInterviewEmotion = (expression) => {
    switch(expression) {
      case 'happy':
      case 'surprised':
        return 'Confident';
      case 'angry':
      case 'fearful':
      case 'sad':
      case 'disgusted':
        return 'Nervous';
      case 'neutral':
      default:
        return 'Neutral';
    }
  };

  setInterval(async () => {
    if (videoRef.current.paused || videoRef.current.ended) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (detection) {
      const resized = faceapi.resizeResults(detection, {
        width: canvasRef.current.width,
        height: canvasRef.current.height
      });

      // faceapi.draw.drawDetections(canvasRef.current, resized);
      // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);

      const expressions = detection.expressions;
      // const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
      // const mainEmotion = sorted[0][0];
      const maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

      // emotionDisplayRef.current.innerText = mainEmotion;
      const interviewEmotion = mapExpressionToInterviewEmotion(maxExpression);
      emotionDisplayRef.current.innerText = interviewEmotion;

      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      const eyeContact = Math.abs(leftEye[0].y - rightEye[0].y) < 10;
      eyeContactDisplayRef.current.innerText = eyeContact ? "Yes 👀" : "No 👀";
    } else {
      emotionDisplayRef.current.innerText = "No face detected";
      eyeContactDisplayRef.current.innerText = "No face detected";
    }
  }, 200);
}


