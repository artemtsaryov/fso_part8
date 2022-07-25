import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const result = useQuery(ALL_BOOKS, {
    variables: genre ? { genre } : null,
  });

  useEffect(() => {
    if (result.data && genres.length === 0) {
      setGenres(
        Object.keys(
          books.reduce((allGenres, b) => {
            b.genres.forEach((g) => {
              if (!Object.hasOwnProperty(allGenres, g)) {
                allGenres[g] = true;
              }
            });

            return allGenres;
          }, {})
        )
      );
    }
  }, [result.data]); // eslint-disable-line

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <p>in genre "{genre ? genre : "all"}"</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <select onChange={(event) => setGenre(event.currentTarget.value)}>
        <option key={"all"} value={""}>
          {"all"}
        </option>
        {genres.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Books;
