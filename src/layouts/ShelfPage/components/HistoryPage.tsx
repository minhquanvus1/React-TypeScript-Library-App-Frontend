import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { HistoryModel } from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const HistoryPage = () => {

    const {authState} = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // History states
    const [histories, setHistories] = useState<HistoryModel[]>([]); // "histories": is a state variable that holds the list of histories

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // "currentPage": is a state variable that holds the current page number (1-based index)
    const [totalPages, setTotalPages] = useState(0); // "totalPages": is a state variable that holds the total number of pages

    useEffect(() => {
        const fetchUserHistory = async () => {
                if(authState && authState.isAuthenticated) {
                    const url: string = `http://localhost:8080/api/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const historyResponse = await fetch(url, requestOptions);
                    if(!historyResponse.ok) {
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

    if(isLoadingHistory) {
        return <SpinnerLoading/>
    }
    if(httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    // "paginate" arrow function: is used to: change the current page number (1-based index)
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }
    return ();
}