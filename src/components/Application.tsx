import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

function Application(props: Props): React.ReactElement {
  return <div>{props.children}</div>;
}
export default Application;
