import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";

export const PaymentPage = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(false);

    if(loadingFees) {
        return <SpinnerLoading/>
    }

    if(httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }
    return ();
}