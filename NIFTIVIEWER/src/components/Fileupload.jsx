// src/components/FileUpload.js
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelect }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.nii, .nii.gz',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <p>Drag & drop a NIfTI file here, or click to select one</p>
    </div>
  );
};

export default FileUpload;
