import { useState } from "react";
import { HistoryPage } from "./components/HistoryPage";
import { Loans } from "./components/Loans";

export const ShelfPage = () => {
  const [historyClick, setHistoryClick] = useState(false); // this state is used to trigger the HistoryPage component, when we click the button "your History". This states connect the ShelfPage component and the HistoryPage component (avoid the error that: when "your History" is clicked, the HistoryPage component is not displayed)
  return (
    <div className="container">
      <div className="mt-3">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              onClick={() => setHistoryClick(false)}
              className="nav-link active"
              id="nav-loans-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-loans"
              type="button"
              role="tab"
              aria-controls="nav-loans"
              aria-selected="true"
            >
              Loans
            </button>
            <button
              onClick={() => setHistoryClick(true)}
              className="nav-link"
              id="nav-history-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-history"
              type="button"
              role="tab"
              aria-controls="nav-history"
              aria-selected="false"
            >
              Your History
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-loans"
            role="tabpanel"
            aria-labelledby="nav-loans-tab"
          >
            <Loans />
          </div>
          <div
            className="tab-pane fade"
            id="nav-history"
            role="tabpanel"
            aria-labelledby="nav-history-tab"
          >
            {/* ONLY display the HistoryPage component when the historyClick state is true */}
            {historyClick ? <HistoryPage /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};
