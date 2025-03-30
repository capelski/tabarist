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
      <div className="input-group mb-3">
        {props.text && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const nextText = '';
              setFilter(nextText);
              props.textSetter(nextText);
            }}
            type="button"
          >
            ❌
          </button>
        )}
        <input
          className="form-control"
          onChange={(event) => {
            const nextText = event.target.value;
            setFilter(nextText);
          }}
          placeholder="Title filter..."
          value={filter}
        />
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            props.textSetter(filter);
          }}
          type="button"
        >
          Search
        </button>
      </div>
    </span>
  );
};
