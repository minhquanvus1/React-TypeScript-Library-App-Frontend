import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { MessageModel } from "../../../models/MessageModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Pagination } from "../../utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import { AdminMessageRequest } from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {
  const { authState } = useOktaAuth();

  // normal loading states
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [httpError, setHttpError] = useState(null);

  // messages states
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [btnSubmit, setBtnSubmit] = useState(false); // this is just a binary variable (only contains 2 states: true or false), and is used to trigger the useEffect below

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url: string = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;
        const messagesResponse = await fetch(url);
        if (!messagesResponse.ok) {
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
  }, [authState, currentPage, btnSubmit]); // this useEffect will be called again when btnSubmit state variable changes. So when the submit button is clicked, this will change the current state of btnSubmit state variable, and trigger this useEffect to run again to fetch the messages that have closed = false (didn't have admin response yet)

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

  async function submitResponseToQuestion(id: number, response: string) {
    const url: string = `http://localhost:8080/api/messages/secure/admin/message`;
    if (
      authState &&
      authState.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const messageAdminRequestModel: AdminMessageRequest =
        new AdminMessageRequest(id, response);
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageAdminRequestModel),
      };
      const messageAdminResponse = await fetch(url, requestOptions);
      if (!messageAdminResponse.ok) {
        throw new Error("Something went wrong!");
      }
      setBtnSubmit(!btnSubmit); // this will change the state of btnSubmit variable once the submit button is clicked
    }
  }
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <>
              <AdminMessage
                message={message}
                key={message.id}
                submitAdminResponse={submitResponseToQuestion}
              />
            </>
          ))}
        </>
      ) : (
        <>
          <h5>No pending Q/A</h5>
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
