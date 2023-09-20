import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { MessageModel } from "../../../models/MessageModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const AdminMessages = () => {

    const {authState} = useOktaAuth();

    // normal loading states
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [httpError, setHttpError] = useState(null);

    // messages states
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if(authState && authState.isAuthenticated) {
                const url: string = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const messagesResponse = await fetch(url);
                if(!messagesResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);

        };
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage]);

    if(isLoadingMessages) {
        return <SpinnerLoading/>;
    }

    if(httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }
    return ();
}