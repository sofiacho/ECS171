import React, { useState, useEffect } from "react";

function FloatInput(props) {

  const featureName = props.feature;
  const displayName = props.name;
  const minValue = props.minVal;
  const maxValue = props.maxVal;
  const stepSize = props.stepSize;
  const incrementSize = props.increment;

  const range = (maxValue - minValue)

  const [inValue, setValue] = useState(
    (Math.floor(Math.random() * (range / stepSize)) * stepSize) + minValue
  );

  function sendValue() {
    if (inValue >= minValue && inValue <= maxValue && props.onValueCommitted) {
      props.onValueCommitted(featureName, (inValue - minValue) / range);
    }
  }

  useEffect(() => {
    setValue(inValue);
    sendValue();
  }, []);

  return (
    <div>
      {displayName} 
      <input
        id="feature_input"
        type="number"
        value={inValue}
        placeholder="Enter a numeric value"
        min={minValue}
        max={maxValue}
        step={incrementSize}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (value >= minValue && value <= maxValue) {
            setValue(value);
          }
        }}
        onBlur={sendValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            sendValue();
          }
        }}
        className="value_input"
      />
      <input
        id="value-slider"
        type="range"
        min={minValue}
        max={maxValue}
        step={stepSize}
        value={inValue}
        onChange={(e) => {setValue(parseFloat(e.target.value))}}
        onMouseUp={sendValue}
      />
    </div>
  );
}

export default FloatInput;
