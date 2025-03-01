import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Use the GET_ME query to get user data
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  // Setup the removeBook mutation
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Function to delete a book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the removeBook mutation
      const { data } = await removeBook({
        variables: { bookId }
      });

      // Remove the book ID from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // If data is still loading, show a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Rest of your component code (JSX, etc.)
  // ...
};

export default SavedBooks;