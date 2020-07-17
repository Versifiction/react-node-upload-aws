import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    getPhotos();
  }, []);

  useEffect(() => {
    console.log("file ", file);
  }, [file]);

  function handleClick(e) {
    hiddenFileInput.current.click();
  }

  function deleteFile() {
    setFile();
  }

  function onFormSubmit(e) {
    e.preventDefault();

    setErrorMessage();
    setSuccessMessage();

    const formData = new FormData();

    formData.append("myImage", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post("http://localhost:3001/upload", formData, config)
      .then((response) => {
        setSuccessMessage("Le fichier a été uploadé !");
        setFile();
        getPhotos();
      })
      .catch((error) => {
        setErrorMessage("Le fichier n'a pas pu être uploadé !");
        console.log("err upload ", error);
      });
  }

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  function getPhotos() {
    axios
      .get("http://localhost:3001/photos")
      .then((response) => {
        console.log("res ", response);
        setPhotos(response.data);
      })
      .catch((error) => {
        setErrorMessage("Les photos uploadées n'ont pas pu être chargées !");
        console.log("err get photos ", error);
      });
  }

  return (
    <section className="container">
      <form method="post" encType="multipart/form-data" onSubmit={onFormSubmit}>
        <label htmlFor="file" className="label-file" onClick={handleClick}>
          Choisir une image
        </label>
        {file && (
          <div className="container-file">
            <p className="file-infos">
              {file.name} - {file.size / 1000000 + "Mo"}
            </p>
            <span className="delete-button" onClick={deleteFile}>
              X
            </span>
          </div>
        )}
        <input
          type="file"
          name="myImage"
          ref={hiddenFileInput}
          onChange={handleChange}
          className="input-file"
        />
        <button type="submit" className="submit-button">
          Upload
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="photos">
        <h2>Photos uploadées</h2>
        {photos &&
          photos.map((photo) => (
            <img
              src={`http://localhost:3001/photo/${photo}`}
              alt="Uploadée"
              key={photo}
              className="img"
            />
          ))}
      </div>
    </section>
  );
}

export default App;
