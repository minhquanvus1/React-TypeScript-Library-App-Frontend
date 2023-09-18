import React from "react";
import { BookModel } from "../../models/BookModel";
import { Link } from "react-router-dom";
import { LeaveAReview } from "../utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewLeft: boolean;
  submitReview: any;
}> = (props) => {
  function buttonRender() {
    if (props.isAuthenticated) {
      if (!props.isCheckedOut && props.currentLoansCount < 5) {
        return (
          <button
            className="btn btn-success btn-lg"
            onClick={() => props.checkoutBook()}
          >
            Check out
          </button>
        );
      } else if (!props.isCheckedOut) {
        return <p className="text-danger">Too may books checked out</p>;
      } else if (props.isCheckedOut) {
        return (
          <p>
            <strong>Book checked out. Enjoy!</strong>
          </p>
        );
      }
    }
    return (
      <Link to="/login" className="btn btn-success btn-lg">
        Sign in
      </Link>
    );
  }

  function reviewRender() {
    if (props.isAuthenticated && !props.isReviewLeft) {
      return <LeaveAReview submitReview={props.submitReview} />;
    } else if (props.isAuthenticated && props.isReviewLeft) {
      return (
        <p>
          <b>Thank you for your review!</b>
        </p>
      );
    } else if (!props.isAuthenticated) {
      return (
        <div>
          <hr />
          <p>Sign in to be able to leave a review.</p>
        </div>
      );
    }
  }
  return (
    <div
      className={
        props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <strong>{props.currentLoansCount}/5 </strong>
            books checked out
          </p>
          <hr />
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait list</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <strong>{props.book?.copies} </strong>
              copies
            </p>
            <p className="col-6 lead">
              <strong>{props.book?.copiesAvailable} </strong>
              available
            </p>
          </div>
        </div>

        {buttonRender()}

        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
};
