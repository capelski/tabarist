import React, { PropsWithChildren } from 'react';

export const CenteredContent: React.FC<PropsWithChildren> = (props) => {
  return (
    <div
      style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', height: '100%' }}
    >
      <h3 style={{ textAlign: 'center' }}>{props.children}</h3>
    </div>
  );
};
