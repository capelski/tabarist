import React, { useEffect, useState } from 'react';

export type TextFilterProps = {
  text: string;
  textSetter: (text: string) => void;
};

export const TextFilter: React.FC<TextFilterProps> = (props) => {
  const [filter, setFilter] = useState(props.text);

  useEffect(() => {
    setFilter(props.text);
  }, [props.text]);

  return (
    <span>
      <span style={{ marginRight: 8 }}>🔎</span>
      <input
        onChange={(event) => {
          const nextText = event.target.value;
          setFilter(nextText);
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

      <button
        onClick={() => {
          props.textSetter(filter);
        }}
        style={{ marginLeft: 8 }}
        type="button"
      >
        Search
      </button>
    </span>
  );
};
