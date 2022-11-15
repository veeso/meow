import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import BootstrapImage from "react-bootstrap/Image";

const Image = styled(BootstrapImage)`
  height: 1.5em;
  margin-right: 8px;
`;

interface Props {
  uri: string;
}

const Avatar = (props: Props) => {
  return <Image roundedCircle src={props.uri} />;
};

export default hot(Avatar);
