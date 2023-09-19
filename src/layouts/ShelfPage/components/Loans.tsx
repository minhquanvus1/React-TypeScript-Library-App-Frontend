import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { ShelfCurrentLoans } from "../../../models/ShelfCurrentLoans";
import { error } from "console";

export const Loans = () => {

    const {authState} = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // loans state
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            
        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        });
        window.scrollTo(0, 0); // move to the top of the page, every time this useEffect is called
    }, [authState]); // this useEffect is called, every time authState changes, which is when the user logs in or logs out
    return();
}