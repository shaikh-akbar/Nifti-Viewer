// src/components/SliceSlider.js
import React from 'react';

const SliceSlider = ({ max, value, onChange }) => {
  return (
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
    />
  );
};

export default SliceSlider;
