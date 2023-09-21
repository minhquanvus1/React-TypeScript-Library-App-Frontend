import { useEffect, useState } from "react";
import { BookModel } from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const ChangeQuantityofBooks = () => {

    const {authState} = useOktaAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // books states
    const [books, setBooks] = useState<BookModel[]>([]);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [booksPerPage] = useState(5);

    useEffect(() => {
        const fetchBooks = async () => {
            const url: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`;
            if(authState && authState.isAuthenticated) {
                const booksResponse = await fetch(url);
                if(!booksResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const booksResponseJson = await booksResponse.json();
                setBooks(booksResponseJson._embedded.books);
                setTotalAmountOfBooks(booksResponseJson.page.totalElements);
                setTotalPages(booksResponseJson.page.totalPages);
            }
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [authState, currentPage]);

    if(isLoading) {
        return <SpinnerLoading/>
    }
    if(httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>s
        </div>
    }
    const indexOfLastBook: number = currentPage * booksPerPage; // index of the last book on the current page (1-based index)
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage; // index of the first book on the current page (0-based index)
    const lastItem: number = currentPage * booksPerPage <= totalAmountOfBooks ? currentPage * booksPerPage : totalAmountOfBooks; // index of the last book on the current page (1-based index)
    const paginate = (pageNumber: number) {
        setCurrentPage(pageNumber);
    }

    return ();
}