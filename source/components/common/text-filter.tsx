import React, { useEffect, useState } from 'react';

export type TextFilterProps = {
  initialValue: string;
  update: (text: string) => void;
};

export const TextFilter: React.FC<TextFilterProps> = (props) => {
  const [filter, setFilter] = useState(props.initialValue);

  useEffect(() => {
    if (props.initialValue !== filter) {
      setFilter(props.initialValue);
    }
  }, [props.initialValue]);

  return (
    <span>
      <div className="input-group mb-3">
        {props.initialValue && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const nextText = '';
              setFilter(nextText);
              props.update(nextText);
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
            props.update(filter);
          }}
          type="button"
        >
          Search
        </button>
      </div>
    </span>
  );
};
