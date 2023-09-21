import { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // books states
  const [books, setBooks] = useState<BookModel[]>([]);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [booksPerPage] = useState(5);

  // bookDelete state
  const [bookDelete, setBookDelete] = useState(false); // this is just a binary variable (only contains 2 states: true or false), and is used to trigger the useEffect below

  useEffect(() => {
    const fetchBooks = async () => {
      const url: string = `${process.env.REACT_APP_API}/books?page=${
        currentPage - 1
      }&size=${booksPerPage}`;
      if (authState?.isAuthenticated) {
        const booksResponse = await fetch(url);
        if (!booksResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const responseJson = await booksResponse.json();
        setBooks(responseJson._embedded.books);
        setTotalAmountOfBooks(responseJson.page.totalElements);
        setTotalPages(responseJson.page.totalPages);

        //   setIsLoading(false);
        //   const responseData = responseJson._embedded.books;

        //   setTotalAmountOfBooks(responseJson.page.totalElements);
        //   setTotalPages(responseJson.page.totalPages);
        //   const loadedBooks: BookModel[] = [];

        //   for (const key in responseData) {
        //     loadedBooks.push({
        //       id: responseData[key].id,
        //       title: responseData[key].title,
        //       author: responseData[key].author,
        //       description: responseData[key].description,
        //       copies: responseData[key].copies,
        //       copiesAvailable: responseData[key].copiesAvailable,
        //       category: responseData[key].category,
        //       img: responseData[key].img,
        //     });
        //   }
        //setBooks(responseJson._embedded.books);
        setIsLoading(false);
      }
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [authState, currentPage, bookDelete]);

  // function to update the value of bookDelete state variable, this function will be passed to ChangeQuantityOfBook component, so that, when the delete button is clicked --> this will change the current state of bookDelete state variable, and trigger this useEffect to run again to fetch the latest/updated list of books (after deleting the book) --> the page is re-rendered with the updated list of books
  const deleteBook = () => {
    setBookDelete(!bookDelete);
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>s
      </div>
    );
  }
  const indexOfLastBook: number = currentPage * booksPerPage; // index of the last book on the current page (1-based index)
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage; // index of the first book on the current page (0-based index)
  const lastItem: number =
    currentPage * booksPerPage <= totalAmountOfBooks
      ? currentPage * booksPerPage
      : totalAmountOfBooks; // index of the last book on the current page (1-based index)
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      {totalAmountOfBooks > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: {totalAmountOfBooks}</h3>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>
          {/* VERY BE CAREFUL with using {} (must use "return" keyword so that contents will be displayed on UI) in lieu of () (we don't need to use "return" keyword)  */}
          {books.map((book) => (
            <ChangeQuantityOfBook
              key={book.id}
              book={book}
              deleteBook={deleteBook}
            />
          ))}
        </>
      ) : (
        <>
          <h5>Added a book before changing quantity</h5>
        </>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
