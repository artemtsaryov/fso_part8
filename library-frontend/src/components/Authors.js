import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ setError, authorized }) => {
  const [born, setBorn] = useState();
  const [name, setName] = useState("");

  const result = useQuery(ALL_AUTHORS);

  const [updateAuthor, updateAuthorResult] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (
      updateAuthorResult.data &&
      updateAuthorResult.data.editAuthor === null
    ) {
      setError("author not found");
    }
  }, [updateAuthorResult.data]); // eslint-disable-line

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const handleUpdateAuthor = (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name, setBornTo: born } });

    setName("");
    setBorn();
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {authorized && (
        <>
          <br />
          <form onSubmit={handleUpdateAuthor}>
            <div>
              author
              <select onChange={(event) => setName(event.currentTarget.value)}>
                <option key={"default"} value={null}>
                  {"Please choose an author"}
                </option>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                type="number"
                value={born}
                onChange={(event) => setBorn(Number(event.currentTarget.value))}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
