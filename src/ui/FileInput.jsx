import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const UploadArea = styled.div`
  border: 2px dashed var(--color-grey-300);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  text-align: center;
  transition: background-color 0.2s;

  background-color: ${(props) =>
    props.$isDragging ? "var(--color-grey-100)" : "transparent"};
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  border: none;
  background: var(--color-brand-600);
  color: white;
  padding: 0.8rem 1.6rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
`;

const RemoveButton = styled.button`
  display: block;
  margin: 1rem auto 0;
  border: none;
  background: transparent;
  color: var(--color-red-700);
  cursor: pointer;
`;

const Preview = styled.img`
  display: block;
  width: 12rem;
  height: 9rem;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  margin: 1.6rem auto 0;
`;

export default function FileInput({
  value,
  onChange,
  onBlur,
  name,
  error,
  maxSize = 5,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const inputRef = useRef(null);

  // Generate preview for File objects.
  // Existing Supabase image URLs can be used directly.
  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);

      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof value === "string" && value) {
      setPreviewUrl(value);
      return;
    }

    setPreviewUrl("");
  }, [value]);

  function handleFile(selectedFile) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`Image size must not exceed ${maxSize} MB.`);
      return;
    }

    onChange(selectedFile);

    // Allow selecting the same file again.
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <UploadArea
      $isDragging={isDragging}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);

        handleFile(event.dataTransfer.files[0]);
      }}
    >
      <HiddenInput
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={(event) => handleFile(event.target.files[0])}
        onBlur={onBlur}
      />

      <p>Drag and drop an image here</p>
      <p>or</p>

      <UploadButton type="button" onClick={() => inputRef.current?.click()}>
        Choose image
      </UploadButton>

      {previewUrl && (
        <>
          <Preview src={previewUrl} alt="Cabin preview" />

          <RemoveButton type="button" onClick={handleRemove}>
            Remove image
          </RemoveButton>
        </>
      )}

      {error && <p role="alert">{error}</p>}
    </UploadArea>
  );
}

FileInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  maxSize: PropTypes.number,
};
