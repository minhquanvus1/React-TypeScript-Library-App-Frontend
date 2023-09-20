import { useEffect, useState } from "react";
import { MessageModel } from "../../../models/MessageModel";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const Messages = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // Messages states
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // the current page (1-based index)
    const [totalPages, setTotalPages] = useState(0); // the total number of pages
    const [messagesPerPage, setMessagesPerPage] = useState(5); // the number of messages per page

    useEffect(() => {
        const fetchMessages = async () => {
            if(authState && authState.isAuthenticated) {
                const url: string = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const messagesResponse = await fetch(url);
                if(!messagesResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const messagesJson = await messagesResponse.json();
                setMessages(messagesJson._embedded.messages);
                setTotalPages(messagesJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        };
        fetchMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage]);

    if(isLoadingMessages) {
        return <SpinnerLoading/>
    }
    if(httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const paginate = (pageNumber: number) {
        setCurrentPage(pageNumber);
    }
    return ();
}