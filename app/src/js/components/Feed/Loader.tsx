import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Facebook } from "react-content-loader";

const Loader = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Facebook key={i} />
      ))}
    </>
  );
};

export default hot(Loader);
