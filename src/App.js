import React, { useEffect, useState, useRef } from "react";
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
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff' }}>
      <h1 style={{ fontFamily: 'Comic Sans MS', color: '#333' }}>i make u spin</h1>

      <button 
          onClick={captureFace} 
          style={{
            backgroundColor: '#0f0f0f', 
            color: '#fff', 
            padding: '10px 20px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            border: '2px solid #0aff0a', 
            borderRadius: '5px', 
            textShadow: '0 0 5px #0aff0a, 0 0 10px #0aff0a, 0 0 20px #0aff0a', 
            boxShadow: '0 0 5px #0aff0a, 0 0 10px #0aff0a, 0 0 20px #0aff0a',
            cursor: 'pointer',
            transition: '0.3s ease',
            fontFamily: 'Arial, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 10px #0aff0a, 0 0 20px #0aff0a, 0 0 30px #0aff0a';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 5px #0aff0a, 0 0 10px #0aff0a, 0 0 20px #0aff0a';
          }}
      >
        {'Try me'}
      </button>

      <div className="container" style={{ marginTop: '20px' }}>
        <video ref={videoRef} autoPlay style={{ display: capturing ? 'none' : 'block' }}></video>
        <div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
          {processedImage && (
            <div>
              <h2 style={{ 
                marginBottom: '40px',  // Increased margin to move it lower
                fontFamily: 'Comic Sans MS', 
                color: '#ff4081',
                fontSize: '36px', 
                textShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
                animation: 'bounce 1s ease infinite'
              }}>
                You Spin 🐸
              </h2>
              <img src={processedImage} alt="Processed" 
                className="spinning-image"
                style={{ width: '300px', height: '300px', animation: 'spin 1s linear infinite' }}
              />
            </div>
          )}
          <canvas ref={photoRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default App;
