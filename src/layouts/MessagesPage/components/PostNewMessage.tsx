import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { MessageModel } from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    const url: string = `${process.env.REACT_APP_API}/messages/secure/add/message`;
    if (authState?.isAuthenticated && title !== "" && question !== "") {
      const messageModel: MessageModel = new MessageModel(title, question);
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageModel),
      };
      const submitNewQuestionResponse = await fetch(url, requestOptions);
      if (!submitNewQuestionResponse.ok) {
        throw new Error("Something went wrong!");
      }
      // if the question is submitted successfully, then, clear the title and question fields, and display the success alert
      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      // if the user has not filled out all the fields (title, and question), or not log in yet (not authenticated) when click the Submit Question button, then, display the warning alert
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className="card mt-3">
      {/* the alert displayed when the user has posted the question successfully */}
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Question added successfully!
        </div>
      )}
      <div className="card-header">Ask question to Luv2 Read admin</div>
      <div className="card-body">
        <form method="POST">
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextArea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={submitNewQuestion}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
