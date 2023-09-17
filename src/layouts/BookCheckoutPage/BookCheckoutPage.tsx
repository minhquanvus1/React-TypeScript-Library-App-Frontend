import { useState } from "react";
import { BookModel } from "../../models/BookModel";

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // create bookId variable, to get the bookId path parameter from the url
  const bookId = window.location.pathname.split("/")[2];
  return (
    <div>
      <h3>Hi world</h3>
    </div>
  );
};
