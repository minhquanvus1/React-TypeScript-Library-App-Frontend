import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { ShelfCurrentLoans } from "../../../models/ShelfCurrentLoans";
import { error } from "console";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

export const Loans = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // loans state
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if(authState && authState.isAuthenticated) {
                const url: string = `http://localhost:8080/api/books/secure/currentloans`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const shelfCurrentLoansResponse = await fetch(url, requestOptions);
                if(!shelfCurrentLoansResponse.ok) {
                    throw new Error("Something went wrong");
                }
                const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
                setShelfCurrentLoans(shelfCurrentLoansResponseJson);
            }
            setIsLoadingUserLoans(false); 
        };
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0); // move to the top of the page, every time this useEffect is called
    }, [authState]); // this useEffect is called, every time authState changes, which is when the user logs in or logs out

    if(isLoadingUserLoans) {
        return <SpinnerLoading/>
    }
    if(httpError) {
        return <div className="container m-5"><p>{httpError}</p></div>
    }
    return();
}