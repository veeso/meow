import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";
import BootstrapImage from "react-bootstrap/Image";
import { DEFAULT_AVATAR_URI } from "../../lib/const";

const Image = styled(BootstrapImage)`
  height: 1.5em;
  margin-right: 8px;
`;

interface Props {
  uri?: string;
}

const Avatar = (props: Props) => {
  const uri = props.uri ? props.uri : DEFAULT_AVATAR_URI;

  return <Image roundedCircle src={uri} />;
};

export default hot(Avatar);
