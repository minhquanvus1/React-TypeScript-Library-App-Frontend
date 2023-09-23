import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { PaymentInfoRequest } from "../../models/PaymentInfoRequest";

export const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false); // this is used to set the "Pay fees" button to disabled or not. Initially, the button is ENABLED, the button is only disabled when the user has clicked "Pay fees" button ONCE
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFees] = useState(false);
  const elements = useElements(); // this is a hook from stripe, return Elements object, which is used to create and manage payment elements from stripe
  const stripe = useStripe(); // this is a hook from stripe, return Stripe object, which is used to make API request to Stripe to perform actions, such as, create PaymentIntent,...

  useEffect(() => {
    const fetchFees = async () => {
      if (authState && authState.isAuthenticated) {
        // this API call will return a Payment object (if the userEmail exists in payment table in database), OR a 404 NOT FOUND error (if the userEmail does not exist in payment table in database, which means: this user has not checked out any book yet)
        const url: string = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;

        const paymentResponse = await fetch(url);
        if (paymentResponse.ok) {
          // if this user exists in payment table (he's checked out a book), then the paymentResponse's status === 200 (ok), then convert the response (which is the Payment object of this user) to json
          const paymentResponseJson = await paymentResponse.json();
          setFees(paymentResponseJson.amount); // set the fees state to the amount of the Payment object of this user (if the user has returned the late-book but hasn't paid the fee yet, then amount will > 0. However, there is case that: the user has checked out a book (is borrowing, not return yet), and this book (as time passes) gets over due, and the user has not returned the book yet, so the user has not paid the fee yet, so the amount will be 0)
          setLoadingFees(false);
        } else if (paymentResponse.status === 404) {
          // if this user does not exist in payment table (he has not checked out any book yet), then the paymentResponse's status === 404 (not found)
          setFees(0); // set the fees state to 0
          setLoadingFees(false);
        } else {
          // if the paymentResponse's status is neither 200 (ok) nor 404 (not found), then throw an error
          throw new Error("Something went wrong!");
        }
      }
    };
    fetchFees().catch((error: any) => {
      setLoadingFees(false);
      setHttpError(error.message);
    });
  }, [authState]);
  if (loadingFees) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkout() {
    // check if stripe object is falsy, or elements object is falsy, or CardElement is falsy. Because they are required to make a payment (they are prerequisite to make a payment via Stripe, so if any of them is falsy, we will "return", means that: we will terminate this "checkout" function immediately)
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }
    setSubmitDisabled(true); // set the "Pay fees" button to disabled, to make sure that once the user clicks "Pay fees" button ONCE, he can't click it again, because the button will be disabled once he clicked the button

    // ------ create a PaymentIntent object on Stripe ------

    // create a PaymentInfoRequest object, containing the amount, currency, and user email, which are required to create a PaymentIntent object on the server side, because the server side will use these information to create a PaymentIntent object on Stripe, because the server side is the only one that has the secret key to create a PaymentIntent object on Stripe, because we don't want to expose the secret key to the client side, because if we do that, then anyone can use the secret key to create a PaymentIntent object on Stripe, and that's not good
    let paymentInfo = new PaymentInfoRequest(
      Math.round(fees * 100), // convert the fees to cents,  by multiplying it by 100 and rounding it to the nearest whole number. This is a common practice when working with currency to avoid precision issues with floating-point numbers.
      "USD",
      authState?.accessToken?.claims.sub
    );

    // send a POST request to the server side to create a PaymentIntent object on Stripe, and get back the client_secret of the PaymentIntent object, which is used to confirm the payment on the client side
    const url: string = `https://localhost:8443/api/payment/secure/payment-intent`; // this is the url of the endpoint on the server side that will create a PaymentIntent object on Stripe
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentInfo), // send the paymentInfo object to the server side
    };
    const stripeResponse = await fetch(url, requestOptions); // send POST request to server (including the body)

    // if the response's http status is not in the range of 200-299 (not ok), then throw an error
    if (!stripeResponse.ok) {
      setHttpError(true);
      setSubmitDisabled(false); // set the "Pay fees" button to enabled, so that the user can try again
      throw new Error("Something went wrong!");
    }
    // if the response's http status is in the range of 200-299 (ok), then convert the response (containing PaymentIntent object (including secret_key) returned from server) to json
    const stripeResponseJson = await stripeResponse.json();

    // ------ make a payment via Stripe (using secret key from PaymentIntent, and send this secret_key from frontend to Stripe server to make payment) ------
    stripe
      .confirmCardPayment(
        stripeResponseJson.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: authState?.accessToken?.claims.sub,
            },
          },
        },
        { handleActions: false }
      )
      .then(async function (result: any) {
        if (result.error) {
          setSubmitDisabled(false);
          alert("There was an error");
        } else {
          const url: string = `${process.env.REACT_APP_API}/payment/secure/payment-complete`;
          const requestOptions = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              "Content-Type": "application/json",
            },
          };
          const stripeResponse = await fetch(url, requestOptions);
          if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error("Something went wrong!");
          }
          setFees(0); // MANUALLY set the fees to 0 in the client side, because the user has paid the fees
          setSubmitDisabled(false); // enable the "Pay fees" button, because the user has paid the fees, and complete the payment, the user will be shown the "You have no fees" message, and the "Explore Top Books" button. So we need to set the "Pay fees" button to ENABLED (which is the default/initial state), so that if in the future, the user has some fees to pay, the button will be ENABLED
        }
      });

    setHttpError(false); // set the httpError to false, because the user has paid the fees successfully
  }
  return (
    <div className="container">
      {fees > 0 && (
        <div className="card mt-3">
          <h5 className="card-header">
            Fees pending : <span className="text-danger">${fees}</span>
          </h5>
          <div className="card-body">
            <h5 className="card-title mb-3">Credit Card:</h5>
            <CardElement id="card-element" />
            <button
              disabled={submitDisabled}
              type="button"
              className="btn btn-md main-color text-white mt-3"
              onClick={checkout}
            >
              Pay Fees
            </button>
          </div>
        </div>
      )}
      {fees === 0 && (
        <div className="mt-3">
          <h5>You have no fees</h5>
          <Link type="button" className="btn main-color text-white" to="search">
            Explore Top Books
          </Link>
        </div>
      )}
      {/* if the button is disabled (the user has clicked "pay fees" button, and waiting the payment to be processed, then display the spinnerloading) */}
      {submitDisabled && <SpinnerLoading />}
    </div>
  );
};
