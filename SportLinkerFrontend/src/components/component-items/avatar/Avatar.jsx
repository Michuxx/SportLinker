import React, { useRef, useState, useEffect } from "react";
import "./avatar.css";
import { LuUser, LuCamera } from "react-icons/lu";
import { resolveImageUrl } from "../../../api/userService";
import { useToast } from "../../../context/ToastContext";

const Avatar = ({ size, onImageSelected, image }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [hasError, setHasError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setPreview(null);
    setHasError(false);
  }, [image]);

  const handleOverlayClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setHasError(false);
      if (onImageSelected) {
        onImageSelected(file);
      }
    }
  };

  const handleImageError = () => {
    if (hasError) return;
    setHasError(true);
    showToast({
      severity: "warn",
      summary: "Zdjęcie profilowe",
      detail: "Obrazek nie istnieje.",
      life: 3500,
    });
  };

  const iconSize = size * 7.5;
  const rawImageSource = preview || resolveImageUrl(image);
  const imageSource = hasError ? null : rawImageSource;

  return (
    <div
      className="avatar-container"
      style={{ height: `${size}rem`, width: `${size}rem` }}
    >
      <div className="avatar-image-wrapper">
        {imageSource ? (
          <img
            src={imageSource}
            alt="profile"
            className="avatar-img"
            onError={handleImageError}
          />
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
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Avatar;
