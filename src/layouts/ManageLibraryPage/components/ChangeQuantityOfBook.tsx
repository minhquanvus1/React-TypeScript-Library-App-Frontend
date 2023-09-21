import React, { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfBook: React.FC<{
  book: BookModel;
  key: number;
  deleteBook: any;
}> = (props, key) => {
  const [quantity, setQuantity] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const { authState } = useOktaAuth();

  useEffect(() => {
    const fetchBookInState = () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

  async function increaseQuantity() {
    const url: string = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props.book.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const quantityUpdateResponse = await fetch(url, requestOptions);
    if (!quantityUpdateResponse.ok) {
      console.log("Error in updating quantity");
    }
    // increase the value of quantity, and remaining state variable by 1, and this new update will be shown in each book card
    // We MANUALLY/PHYSICALLY update the state variable, because we don't want to make another API call to get the updated value of quantity
    setQuantity(quantity + 1);
    setRemaining(remaining + 1);
  }

  async function decreaseQuantity() {
    const url: string = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props.book.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const quantityUpdateResponse = await fetch(url, requestOptions);
    if (!quantityUpdateResponse.ok) {
      console.log("Error in updating quantity");
    }
    // increase the value of quantity, and remaining state variable by 1, and this new update will be shown in each book card
    // We MANUALLY/PHYSICALLY update the state variable, because we don't want to make another API call to get the updated value of quantity
    setQuantity(quantity - 1);
    setRemaining(remaining - 1);
  }

  async function deleteBook() {
    const url: string = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props.book.id}`;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const updateResponse = await fetch(url, requestOptions);
    if (!updateResponse.ok) {
      console.log("Error in deleting book");
    }
    // call the deleteBook function in ManageLibraryPage.tsx to update the state variable bookDelete --> this will call the useEffect in ManageLibraryPage.tsx to fetch the latest list of books (after deleting this book) and re-render the page with this updated list of books
    // we don't want to setQuantity, and setRemaining to 0, because we want to delete the book card from the page, and not just set the quantity to 0
    props.deleteBook();
  }
  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">{props.book.description}</p>
          </div>
        </div>
        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-start">
            <button className="m-1 btn btn-md btn-danger" onClick={deleteBook}>
              Delete
            </button>
          </div>
        </div>
        <button
          className="m-1 btn btn-md main-color text-white"
          onClick={increaseQuantity}
        >
          Add Quantity
        </button>
        <button
          className="m-1 btn btn-md btn-warning"
          onClick={decreaseQuantity}
        >
          Decrease Quantity
        </button>
      </div>
    </div>
  );
};
