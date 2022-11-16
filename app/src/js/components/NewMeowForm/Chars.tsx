import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import autosize from "autosize";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import BootstrapImage from "react-bootstrap/Image";
import ProgressBar from "react-bootstrap/ProgressBar";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  justify-content: space-between;
  text-align: right;
`;

const CharsProgressBar = styled(ProgressBar)`
  flex: 10;
  height: 2em;
`;

const CharsLabel = styled(Form.Text)`
  flex: 2;
`;

interface Props {
  chars: number;
  limit: number;
}

const Chars = (props: Props) => {
  const chars = `${props.chars} / ${props.limit}`;
  const progressBarVariant = props.chars > props.limit ? "danger" : "primary";

  return (
    <Container hidden={props.chars === 0}>
      <CharsProgressBar
        variant={progressBarVariant}
        now={props.chars}
        max={props.limit}
      />
      <CharsLabel className="text-muted">{chars}</CharsLabel>
    </Container>
  );
};

export default hot(Chars);
