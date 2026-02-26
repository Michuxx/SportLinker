import React, { useRef, useState } from "react";
import "./avatar.css";
import { LuUser, LuCamera } from "react-icons/lu";

const Avatar = ({ size, onImageSelected, image }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleOverlayClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelected(file);
    }
  };

  const iconSize = size * 7.5;
  const imageSource = preview || image;

  return (
    <div
      className="avatar-container"
      style={{ height: `${size}rem`, width: `${size}rem` }}
    >
      <div className="avatar-image-wrapper">
        {imageSource ? (
          <img src={imageSource} alt="profile" className="avatar-img" />
        ) : (
          <LuUser size={iconSize} color="white" />
        )}
      </div>
      {onImageSelected && (
        <div className="avatar-overlay" onClick={handleOverlayClick}>
          <LuCamera size={iconSize / 2.5} color="white" />
          <span className="overlay-text">Zmień</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Avatar;
