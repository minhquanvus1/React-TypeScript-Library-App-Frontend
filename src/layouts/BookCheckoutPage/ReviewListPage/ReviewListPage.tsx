import { useEffect, useState } from "react";
import { ReviewModel } from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // get bookId from the path variable ["api", "books", "bookId"]
    const bookId = window.location.pathname.split("/")[2];

    // get all reviews for the book (with Pagination support)
    useEffect(() => {
        const fetchBookReviews = async () => {
            // add "page", and "size" to support Pagination in the list of Reviews --> the returned response will have a "page" object
          const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size={reviewsPerPage}`;
          const responseReviews = await fetch(reviewUrl);
          if (!responseReviews.ok) {
            throw new Error("Something went wrong!");
          }
          const responseJsonReviews = await responseReviews.json();
          const responseData: ReviewModel[] = responseJsonReviews._embedded.reviews;
          setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
          setTotalPages(responseJsonReviews.page.totalPages);
    
          const loadedReviews: ReviewModel[] = [];
    
          
    
          for (const key in responseData) {
            loadedReviews.push({
              id: responseData[key].id,
              userEmail: responseData[key].userEmail,
              date: responseData[key].date,
              rating: responseData[key].rating,
              book_id: responseData[key].book_id,
              reviewDescription: responseData[key].reviewDescription,
            });
            
          }
          
          setReviews(loadedReviews);
          setIsLoading(false);
        };
        fetchBookReviews().catch((error: any) => {
          setIsLoading(false);
          setHttpError(error.message);
        });
      }, [currentPage]); // this useEffect will be called whenever the currentPage changes --> to get the reviews for the new currentPage

      if (
        isLoading
        
      ) {
        return <SpinnerLoading />;
      }
    
      if (httpError) {
        return (
          <div className="container m-5">
            <p>{httpError}</p>
          </div>
        );
      }

      // find index of the last review in the current page (given a particular reviewsPerPage) (1-based index)
      const indexOfLastReview: number = currentPage * reviewsPerPage;

     // find index of the first review in the current page (given a particular reviewsPerPage) (0-based index)
      const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

      let lastItem: number = currentPage * reviewsPerPage <= totalAmountOfReviews ? currentPage * reviewsPerPage : totalAmountOfReviews;

      const paginate = (pageNumber: number) => {
setCurrentPage(pageNumber);
      }
    return ();
}