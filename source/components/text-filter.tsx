import React, { useState } from 'react';

export type TextFilterProps = {
  text: string;
  textSetter: (text: string) => void;
};

export const TextFilter: React.FC<TextFilterProps> = (props) => {
  const [filter, setFilter] = useState(props.text);

  return (
    <span>
      <span style={{ marginRight: 8 }}>🔎</span>
      <input
        onChange={(event) => {
          const nextText = event.target.value;
          setFilter(nextText);

          if (!WEBPACK_USE_FIREBASE) {
            props.textSetter(nextText);
          }
        }}
        value={filter}
      />
      {props.text && (
        <span
          onClick={() => {
            const nextText = '';
            setFilter(nextText);
            props.textSetter(nextText);
          }}
          style={{ cursor: 'pointer', marginLeft: 8 }}
        >
          ❌
        </span>
      )}
      {WEBPACK_USE_FIREBASE && (
        <button
          onClick={() => {
            props.textSetter(filter);
          }}
          style={{ marginLeft: 8 }}
          type="button"
        >
          Search
        </button>
      )}
    </span>
  );
};
