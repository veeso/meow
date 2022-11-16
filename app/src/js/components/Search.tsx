import * as React from "react";
import { hot } from "react-hot-loader/root";
import debounce from "lodash.debounce";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import SearchResult from "../lib/model/search";
import { Col, Row } from "react-bootstrap";
import Results from "./Search/Results";

const Container = styled.div`
  border: 1px solid dodgerblue;
  border-radius: 12px;
  margin: 8px 0;
  position: relative;

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
  margin: 0 8px;
  vertical-align: middle;
`;

const ResultsContainer = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  bot: 0;
  margin-top: 8px;
  position: absolute;
  width: 100%;
  z-index: 100;
`;

interface Props {
  onSearch: (subject: string) => Promise<Array<SearchResult>>;
}

const Search = (props: Props) => {
  const [text, setText] = React.useState<string>("");
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

  const onResultClicked = () => {
    setQuery("");
    setResults(undefined);
    setText("");
  };

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
    } else {
      setError(false);
      setResults(undefined);
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
                  onChange={(ev) => {
                    debouncedEventHandler(ev);
                    setText((ev.target as HTMLInputElement).value);
                  }}
                  size="lg"
                  style={{ width: "100%" }}
                  value={text}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <ResultsContainer hidden={results === undefined && !error}>
          <Alert hidden={!error} variant="danger">
            Unable to load search results
          </Alert>
          <Results onResultClicked={onResultClicked} entries={results} />
        </ResultsContainer>
      </Container>
    </>
  );
};

export default hot(Search);
