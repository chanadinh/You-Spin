import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import "./App.css";

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);

  useEffect(() => {
    const startWebcam = async () => {
      if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
    };
    startWebcam();
  }, []);
  
  // Function to capture face and get the processed image from the backend
  const captureFace = async () => {
    setCapturing(true);
    takePhoto();
    setCapturing(false);
    setLoading(true);

  };

 const takePhoto = async () => {
    
  const width = 414;
  const height = width / (16/9);
  let video = videoRef.current;
  let photo = photoRef.current;
  photo.width = width;
  photo.height = height;
  let context = photo.getContext('2d');
  context.drawImage(video, 0, 0, width, height); 
  setHasPhoto(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: photo.toDataURL() }),
      });

      if (response.ok) {
        const data = await response.json();
        setProcessedImage(`data:image/png;base64,${data.processed_image}`);
      } else {
        console.error("Error processing image.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
 }



  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Spinning Image</h1>
      {/* Button to capture the image */}
      {/* <button onClick={captureFace} disabled={loading}> */}
      <button onClick={captureFace}>
        {/* {loading ? 'Capturing...' : 'Capture Face'} */}
        {'Capture Face'}
      </button>
     
      {/* Display the image with spinning animation */}
      {/* {imageUrl && ( */}
        {/* <div className = {'result' + (imageUrl ? 'hasPhoto' : '')}> */}
        <div className="container" style={{ marginTop: '20px' }}>
        <video ref={videoRef} autoPlay style={{ display: capturing ? 'none' : 'block' }}></video>
        <div className={'result' + (hasPhoto? 'hasPhoto':'')} >
        {processedImage && (
        <div>
          <h2>Processed Image:</h2>
          <img src={processedImage} alt="Processed" 
          className="spinning-image"
          style={{ width: '300px', height: '300px', animation: 'spin 1s linear infinite' }}
          />
        </div>
      )}
        <canvas ref={photoRef} ></canvas>
        </div>
        </div>
    </div>
  );
};

export default App;

