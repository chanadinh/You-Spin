import React, { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const photoRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target.result;
        setHasPhoto(true);
        setErrorMessage(""); // Clear previous error messages

        try {
          const response = await fetch("https://original-nomad-443602-g2-820509380648.us-central1.run.app/process-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageBase64 }),
          });

          if (response.ok) {
            const data = await response.json();
            setProcessedImage(`data:image/png;base64,${data.processed_image}`);
          } else {
            setErrorMessage("eeee i cant spin u. try again.");
          }
        } catch (error) {
          setErrorMessage("eeee i cant spin u. try again.");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div style={{ textAlign: "center", padding: "100px", backgroundColor: "#FDFD96" }}>
      <h1 style={{ fontFamily: "Comic Sans MS", color: "#333" }}>i make u spin</h1>
      
      <button
        onClick={handleButtonClick}
        style={{
          backgroundColor: "#0f0f0f",
          color: "#fff",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          border: "2px solid #0aff0a",
          borderRadius: "5px",
          textShadow: "0 0 5px #0aff0a, 0 0 10px #0aff0a, 0 0 20px #0aff0a",
          boxShadow: "0 0 5px #0aff0a, 0 0 10px #0aff0a, 0 0 20px #0aff0a",
          cursor: "pointer",
          transition: "0.3s ease",
          fontFamily: "Arial, sans-serif",
        }}
      >
        gimme ur selfie
      </button>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      <div className="container" style={{ marginTop: "20px" }}>
        {errorMessage && (
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "20px" }}>{errorMessage}</p>
        )}

        {hasPhoto && !processedImage && (
          <p style={{ color: "blue", fontWeight: "bold", marginBottom: "20px" }}>
            where is ur face? im tryna get it...
          </p>
        )}

        {processedImage && (
          <div>
            <h2
              style={{
                marginBottom: "40px",
                fontFamily: "Comic Sans MS",
                color: "#ff4081",
                fontSize: "36px",
                textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
                animation: "bounce 1s ease infinite",
              }}
            >
              You Spin 🐸
            </h2>
            <img
              src={processedImage}
              alt="Processed"
              className="spinning-image"
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "auto",
                maxHeight: "300px",
                animation: "spin 1s linear infinite",
              }}
            />
            <audio
              id="spinAudio"
              src="https://media.memesoundeffects.com/2024/11/Donald-Trump-Macarena.mp3"
              autoPlay
              loop
            ></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
