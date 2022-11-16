import * as React from "react";
import styled from "styled-components";
import { hot } from "react-hot-loader/root";

const Container = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  z-index: 100;
`;

interface Props {
  children: JSX.Element;
  visible: boolean;
}

const Overlay = (props: Props) => {
  if (props.visible) {
    return (
      <Container>
        <div>{props.children}</div>
      </Container>
    );
  } else {
    return <></>;
  }
};

export default hot(Overlay);
