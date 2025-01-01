import React, { useEffect, useState } from "react";
import "./Gallery.css";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import PopUp from "../Modal/Modal"; //default import
const API_URL = "https://image-gallery-server-xi.vercel.app/api/images"
const BASE_URL = "http://localhost:3007/images";

export const Gallery = () => {
  const [imageName, setImageName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = async (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    if (!file) return; // Exit if no file selected

    // setImageFile(file);
    setImageName(file.name);

    const formData = new FormData();

    formData.append("upload_file", file); // Append the file to FormData

    try {
      const response = await axios(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/formdata",
        },
        data: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
       
      setImages(response.data.data);


      // Reset state after upload
      setUploadProgress(0);
      setImageName("");
    } catch (error) {
      alert(error.response.data.message);
      setImageName("");
      // Reset progress in case of an error
      setUploadProgress(0);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios(API_URL);

      setImages(response.data.data);
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <header>
        <div className="header">
          <h1> Photo Gallery </h1>
          <p> A picture is worth thousand words. </p>
        </div>
      </header>
      <section className="upload-section">
        <div>
          <label htmlFor="file-upload" className="upload-file">
            <img src={"/images/plusicon.png"} alt="" style={{width:"35px",height:"35px",backgroundColor:"gray",borderRadius:"50%"}}/>
          </label>

          <input
            id="file-upload"
            onChange={handleFileChange}
            type="file"
            style={{ display: "none" }}
          />

          {imageName && <p> {imageName} </p>}

          <Box sx={{ marginTop: "10px" }} className="progrss_bar">
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              style={{ color: "#acacac" }}
            />
          </Box>
        </div>
      </section>

      <section className="display-section">
        <div className="gallery">
          {images &&
            images.map((image) => {
              return (
                <img
                  key={image}
                  src={`${BASE_URL}/${image}`}
                  alt=""
                  onClick={() => setSelectedImage(`${BASE_URL}/${image}`)}
                />
              );
            })}
        </div>
      </section>

      {selectedImage && (
        <PopUp onClose={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="selected"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </PopUp>
      )}
    </div>
  );
};
