import { Link, NavLink } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../utils/SpinnerLoading";

export const Navbar = () => {
  const { oktaAuth, authState } = useOktaAuth();
  if (!authState) {
    return <SpinnerLoading />;
  }
  const handleLogout = async () => oktaAuth.signOut();
  console.log(authState);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
        <div className="container-fluid">
          <span className="navbar-brand">Luv 2 Read</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/search">
                  Search books
                </NavLink>
              </li>
              {/* ONLY authenticated user can see this nav item to ShelfPage */}
              {authState.isAuthenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/shelf">
                    Shelf Page
                  </NavLink>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {/* if user is NOT authenticated, then show Sign in button, else show
              Sign out button */}
              {!authState.isAuthenticated ? (
                <li className="nav-item m-1">
                  <Link
                    type="button"
                    className="btn btn-outline-light"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </li>
              ) : (
                <li>
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
