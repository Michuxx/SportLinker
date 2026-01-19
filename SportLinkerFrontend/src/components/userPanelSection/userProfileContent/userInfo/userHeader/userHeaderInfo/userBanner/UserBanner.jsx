import React, { useRef, useState, useEffect } from "react";
import "./userBanner.css";
import { LuCamera } from "react-icons/lu";

const UserBanner = ({ image, changeBackgroundImage }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (changeBackgroundImage) {
        changeBackgroundImage(file);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const currentBanner = preview || image;

  return (
    <div
      className="user-header-banner"
      style={{
        backgroundImage: currentBanner ? `url(${currentBanner})` : undefined,
      }}
    >
      {changeBackgroundImage && (
        <div className="banner-edit-overlay" onClick={handleEditClick}>
          <div className="banner-edit-button">
            <LuCamera size={24} />
            <span>Zmień zdjęcie w tle</span>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UserBanner;
