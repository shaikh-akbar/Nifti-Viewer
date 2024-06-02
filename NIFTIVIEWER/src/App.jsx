import React, { useState, useEffect } from 'react';
import * as nifti from 'nifti-reader-js';
import FileUpload from './components/Fileupload';
import SliceSlider from './components/Sliceslider';
import './App.css';

const App = () => {
  const [niftiHeader, setNiftiHeader] = useState(null);
  const [niftiImage, setNiftiImage] = useState(null);
  const [slice, setSlice] = useState(0);

  const handleFileSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      let buffer = event.target.result;
      if (nifti.isCompressed(buffer)) {
        buffer = nifti.decompress(buffer);
      }
      if (nifti.isNIFTI(buffer)) {
        const header = nifti.readHeader(buffer);
        const image = nifti.readImage(header, buffer);
        setNiftiHeader(header);
        setNiftiImage(image);
        setSlice(Math.floor(header.dims[3] / 2));  // Initialize to the middle slice
      } else {
        alert('The selected file is not a valid NIfTI file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getSliceData = (image, header, slice) => {
    const cols = header.dims[1];
    const rows = header.dims[2];
    const sliceSize = cols * rows;
    const sliceOffset = slice * sliceSize;
    const sliceData = new Uint8Array(image.slice(sliceOffset, sliceOffset + sliceSize));
    return { sliceData, cols, rows };
  };

  const drawSlice = (sliceData, cols, rows) => {
    const canvas = document.getElementById('niftiCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.createImageData(cols, rows);

    for (let i = 0; i < sliceData.length; i++) {
      imageData.data[i * 4] = sliceData[i];
      imageData.data[i * 4 + 1] = sliceData[i];
      imageData.data[i * 4 + 2] = sliceData[i];
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    if (niftiImage && niftiHeader) {
      const { sliceData, cols, rows } = getSliceData(niftiImage, niftiHeader, slice);
      drawSlice(sliceData, cols, rows);
    }
  }, [slice, niftiImage, niftiHeader]);

  return (
    <div className="container">
      <h1>NIFTI Image Viewer</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      {niftiHeader && (
        <>
          <canvas id="niftiCanvas" width={niftiHeader.dims[1]} height={niftiHeader.dims[2]}></canvas>
          <SliceSlider max={niftiHeader.dims[3] - 1} value={slice} onChange={setSlice} />
        </>
      )}
    </div>
  );
};

export default App;
