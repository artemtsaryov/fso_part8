import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "../queries";

const Books = (props) => {
  const resultMe = useQuery(ME);

  const result = useQuery(ALL_BOOKS, {
    variables: resultMe.data
      ? { genre: resultMe.data.me.favouriteGenre }
      : null,
    skip: !resultMe.data,
  });

  if (resultMe.loading || result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre "{resultMe.data.me.favouriteGenre}"</p>
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
    </div>
  );
};

export default Books;
