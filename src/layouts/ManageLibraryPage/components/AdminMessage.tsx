import React, { useState } from "react";
import { MessageModel } from "../../../models/MessageModel";

export const AdminMessage: React.FC<{ message: MessageModel }> = (props) => {
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");
  return (
    <div key={props.message.id}>
      <div className="card mt-2 shadow p-3 bg-body rounded">
        <h5>
          Case number {props.message.id} : {props.message.title}
        </h5>
        <h6>{props.message.userEmail}</h6>
        <p>{props.message.question}</p>
        <hr />
        <div>
          <h5>Response: </h5>
          <form method="PUT">
            {displayWarning && (
              <div className="alert alert-danger" role="alert">
                All fields must be filled out
              </div>
            )}
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextArea1"
                rows={3}
                onChange={(e) => setResponse(e.target.value)}
                value={response}
              ></textarea>
            </div>
            <div>
              <button type="button" className="btn btn-primary mt-3">
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
