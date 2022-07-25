import { useState, useEffect } from "react";
import { useSubscription, useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import LoginForm from "./components/LoginForm";

import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.id;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");

  const client = useApolloClient();

  useEffect(() => {
    const token = window.localStorage.getItem("library-user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded;
      notify(`${bookAdded.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, bookAdded);
    },
  });

  let toShow = null;
  switch (page) {
    case "authors":
      toShow = <Authors setError={notify} authorized={!!token} />;
      break;
    case "books":
      toShow = <Books setError={notify} />;
      break;
    case "add":
      toShow = <NewBook setError={notify} />;
      break;
    case "recommend":
      toShow = <Recommendations setError={notify} />;
      break;
    case "login":
      toShow = <LoginForm setError={notify} setToken={setToken} />;
      break;
    default:
      toShow = null;
      break;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      {toShow}
    </div>
  );
};

export default App;
