import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router';

export type ButtonLinkProps = PropsWithChildren<{
  url?: string;
}>;

export const ButtonLink: React.FC<ButtonLinkProps> = (props) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-outline-secondary"
      disabled={!props.url}
      onClick={() => {
        if (props.url) {
          navigate(props.url);
        }
      }}
      type="button"
    >
      <a
        onClick={(event) => {
          event.preventDefault();
        }}
        href={props.url}
      >
        {props.children}
      </a>
    </button>
  );
};
