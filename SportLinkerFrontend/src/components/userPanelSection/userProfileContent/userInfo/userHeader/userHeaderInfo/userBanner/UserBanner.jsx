import React, { useRef, useState, useEffect } from "react";
import "./userBanner.css";
import { LuCamera } from "react-icons/lu";
import { resolveImageUrl } from "../../../../../../../api/userService";
import { useToast } from "../../../../../../../context/ToastContext";

const UserBanner = ({ image, bannerImage, changeBackgroundImage }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [hasError, setHasError] = useState(false);
  const { showToast } = useToast();

  const sourceProp = image || bannerImage;

  useEffect(() => {
    setPreview(null);
    setHasError(false);
  }, [sourceProp]);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setHasError(false);

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

  const resolvedUrl = preview || resolveImageUrl(sourceProp);

  useEffect(() => {
    if (!resolvedUrl || preview) {
      setHasError(false);
      return;
    }

    let isMounted = true;
    const img = new Image();
    img.src = resolvedUrl;
    img.onload = () => {
      if (isMounted) setHasError(false);
    };
    img.onerror = () => {
      if (isMounted) {
        setHasError(true);
        showToast({
          severity: "warn",
          summary: "Zdjęcie w tle",
          detail: "Obrazek nie istnieje.",
          life: 3500,
        });
      }
    };

    return () => {
      isMounted = false;
    };
  }, [resolvedUrl, preview, showToast]);

  const currentBanner = hasError ? null : resolvedUrl;

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
