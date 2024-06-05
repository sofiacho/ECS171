import React, { useState, useEffect } from "react";

function CountableInput(props) {

  const featureName = props.feature;
  const displayName = props.name;
  const options = props.options;

  const [selection, setSelection] = useState(
    Math.floor(Math.random() * options.length)
  );

  function chooseItem(chosenItem) {
    setSelection(chosenItem);
    if (props.OnChoose) {
      props.OnChoose(featureName, chosenItem);
    }
  }

  useEffect(() => {chooseItem(selection)}, []);

  return (
    <div>
      <ul>
      {displayName}:
        {
          options.map((value, index) => (
            <button
              disabled= {selection === index}
              onClick={() => chooseItem(index)}
            >{value}</button>
          ))
        }
      </ul>
    </div>
  );
}

export default CountableInput;