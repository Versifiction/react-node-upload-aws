import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "./App.css";

function Page(props) {
  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState();
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

    formData.append("profileImage", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(
        `http://localhost:3001/upload/${props.match.params.username}`,
        formData,
        config
      )
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
      .get(`http://localhost:3001/photo/${props.match.params.username}`)
      .then((response) => {
        console.log("res ", response);
        setPhoto(response.data);
      })
      .catch((error) => {
        setErrorMessage("La photo uploadée n'a pas pu être chargée !");
        console.log("err get photos ", error);
      });
  }

  return (
    <section className="container">
      <form method="post" encType="multipart/form-data" onSubmit={onFormSubmit}>
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
        <div className="photo">
          {photo ? (
            <div className="pb">
              <img
                src={photo.fileUrl}
                alt="Uploadée"
                key={photo}
                className="img"
                onClick={handleClick}
              />
            </div>
          ) : (
            <div className="pb">
              <div className="grey" onClick={handleClick}>
                <i
                  className="fa fa-3x fa-camera img-icon"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="submit-button">
          Upload
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </section>
  );
}

export default Page;
