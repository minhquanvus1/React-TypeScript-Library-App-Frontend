import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { HistoryModel } from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../utils/Pagination";

export const HistoryPage = () => {
  const { authState } = useOktaAuth();
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // History states
  const [histories, setHistories] = useState<HistoryModel[]>([]); // "histories": is a state variable that holds the list of histories

  // Pagination
  const [currentPage, setCurrentPage] = useState(1); // "currentPage": is a state variable that holds the current page number (1-based index)
  const [totalPages, setTotalPages] = useState(0); // "totalPages": is a state variable that holds the total number of pages

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (authState && authState.isAuthenticated) {
        const url: string = `${
          process.env.REACT_APP_API
        }/histories/search/findBooksByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=5`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const historyResponse = await fetch(url, requestOptions);
        if (!historyResponse.ok) {
          throw new Error("Something went wrong!");
        }
        const historyResponseJson = await historyResponse.json();
        setHistories(historyResponseJson._embedded.histories);
        setTotalPages(historyResponseJson.page.totalPages);
      }
      setIsLoadingHistory(false);
    };
    fetchUserHistory().catch((error: any) => {
      setIsLoadingHistory(false);
      setHttpError(error.message);
    });
  }, [authState, currentPage]); // this useEffect will be called when the user is authenticated and the currentPage is changed

  if (isLoadingHistory) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  // "paginate" arrow function: is used to: change the current page number (1-based index)
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="mt-2">
      {histories.length > 0 ? (
        <>
          <h5>Recent History:</h5>
          {histories.map((history) => (
            <div key={history.id}>
              <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      {history.img ? (
                        <img
                          src={history.img}
                          width="123"
                          height="196"
                          alt="book"
                        />
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
                      {history.img ? (
                        <img
                          src={history.img}
                          width="123"
                          height="196"
                          alt="book"
                        />
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
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title">{history.author}</h5>
                      <h4>{history.title}</h4>
                      <p className="card-text">{history.description}</p>
                      <hr />
                      <p className="card-text">
                        Checked out on: {history.checkoutDate}
                      </p>
                      <p className="card-text">
                        Returned on: {history.returnedDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))}
        </>
      ) : (
        <>
          <h3 className="mt-3">Currently No History:</h3>
          <Link to={"search"} className="btn btn-primary">
            Search for a new book
          </Link>
        </>
      )}
      {/* show Pagination when there are more than 1 page (each page has 5 elements returned by the API, so if there are more than 5 elements, then there are more than 1 page) */}
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
