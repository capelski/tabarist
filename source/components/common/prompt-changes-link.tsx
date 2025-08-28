import React, { PropsWithChildren, useContext } from 'react';
import { NavLink, To } from 'react-router';
import { ActionType, StateProvider } from '../../state';

export type PromptChangesLinkProps = PropsWithChildren<{
  className?: string;
  isTabDirty: boolean;
  to: To;
}>;

export const PromptChangesLink: React.FC<PromptChangesLinkProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  return (
    <NavLink
      className={props.className}
      onClick={(event) => {
        if (props.isTabDirty) {
          dispatch({ type: ActionType.discardChangesPrompt });
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      to={props.to}
    >
      {props.children}
    </NavLink>
  );
};
