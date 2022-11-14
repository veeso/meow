import * as React from "react";
import { hot } from "react-hot-loader/root";
import debounce from "lodash.debounce";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Popover from "react-bootstrap/Popover";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import SearchResult from "../lib/model/search";
import { Col, Row } from "react-bootstrap";
import Results from "./Search/Results";

const Container = styled.div`
  border: 1px solid dodgerblue;
  border-radius: 1em;

  input {
    border: 0;
    :focus {
      border: 0;
      box-shadow: inherit;
    }
  }
`;

const SearchIcon = styled.div`
  color: dodgerblue;
  display: inline-block;
  height: 100%;
  line-height: 3em;
  margin: 0 8px;
  vertical-align: middle;
`;

interface Props {
  onSearch: (subject: string) => Promise<Array<SearchResult>>;
}

const Search = (props: Props) => {
  const [query, setQuery] = React.useState<string>("");
  const [results, setResults] = React.useState<Array<SearchResult>>();
  const [error, setError] = React.useState<boolean>(false);

  const changeHandler = (event: React.FormEvent<EventTarget>) => {
    setQuery((event.target as HTMLInputElement).value);
  };

  const debouncedEventHandler = React.useMemo(
    () => debounce(changeHandler, 300),
    []
  );

  React.useEffect(() => {
    if (query.length > 0) {
      props
        .onSearch(query)
        .then((queryResults) => {
          setResults(queryResults);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [query]);

  React.useEffect(() => {
    if (results) {
      setError(false);
    }
  }, [results]);

  React.useEffect(() => {
    return () => {
      debouncedEventHandler.cancel();
    };
  }, []);

  return (
    <>
      <Container>
        <Form>
          <Form.Group controlId="search">
            <Row lg={12}>
              <Col lg={1}>
                <SearchIcon>
                  <MagnifyingGlassIcon width={24} />
                </SearchIcon>
              </Col>
              <Col lg={10}>
                <Form.Control
                  placeholder="Search..."
                  onChange={debouncedEventHandler}
                  size="lg"
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Container>
      <Popover hidden={results === undefined && !error} placement="bottom">
        <Popover.Header hidden={!error}>
          <Alert variant="danger">Unable to load search results</Alert>
        </Popover.Header>
        <Popover.Body>
          <Results entries={results} />
        </Popover.Body>
      </Popover>
    </>
  );
};

export default hot(Search);
