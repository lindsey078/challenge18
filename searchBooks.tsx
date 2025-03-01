import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
// Other imports

const SearchBooks = () => {
  // State variables for search and books
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Setup save book mutation
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  // Save book IDs to local storage when they change
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Function to handle the form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // Use the Google Books API to get search results
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      // Format the book data
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Function to save a book to the database
  const handleSaveBook = async (bookId) => {
    // Find the book in the search results
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Get the token from local storage
    const token = localStorage.getItem('id_token');

    if (!token) {
      return false;
    }

    try {
      // Use the saveBook mutation
      const { data } = await saveBook({
        variables: { bookData: bookToSave }
      });

      // Save the book ID to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // Rest of your component code (JSX, etc.)
  // ...
};

export default SearchBooks;