import { useEffect, useState } from "react";
import { MessageModel } from "../../../models/MessageModel";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";

export const Messages = () => {
  const { authState } = useOktaAuth();
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
      if (authState && authState.isAuthenticated) {
        const url: string = `${
          process.env.REACT_APP_API
        }/messages/search/findByUserEmail?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=${messagesPerPage}`;
        const messagesResponse = await fetch(url);
        if (!messagesResponse.ok) {
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

  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case number {message.id} : {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} admin</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        <i>
                          Pending response from administration. Please be
                          patient
                        </i>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h5>All questions you submit will be shown here</h5>
        </>
      )}
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
