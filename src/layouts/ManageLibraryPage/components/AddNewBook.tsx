import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { AddBookRequest } from "../../../models/AddBookRequest";

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  // add new book states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // display state (warning, success)
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  // this function will be called once we upload an image file
  async function base64ConversionForImage(e: any) {
    if (e.target.files[0]) {
      // do something here
      getBase64(e.target.files[0]);
    }
  }

  // this function is to read content of a file, and convert its content into base64 encoded string, or log into console the error if the reading operation is failed
  function getBase64(file: any) {
    let reader = new FileReader(); // a FileReader object allows our React application to asynchronously read contents of a file stored in our computer's storage
    reader.readAsDataURL(file); // the readAsDataURL method is used to read the contents of the specified Blob or File

    // here, after reading content of the file, we convert the content to base64 encoded string
    // the onload property of the FileReader object is an event handler that is called when the reading operation is successfully completed
    reader.onload = function () {
      setSelectedImage(reader.result); // the result property of the FileReader object is the base64 encoded string of the file
    };
    // the onerror property of the FileReader object is an event handler that is called when the reading operation is failed
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  async function submitNewBook() {
    const url: string = `${process.env.REACT_APP_API}/admin/secure/add/book`;
    if (
      authState?.isAuthenticated &&
      title !== "" &&
      author !== "" &&
      description !== "" &&
      copies >= 0 &&
      category !== "Category"
    ) {
      const bookRequest: AddBookRequest = {
        title: title,
        author: author,
        description: description,
        copies: copies,
        category: category,
      };
      bookRequest.img = selectedImage;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookRequest),
      };
      const submitNewBookResponse = await fetch(url, requestOptions);
      if (!submitNewBookResponse.ok) {
        throw new Error("Something went wrong!");
      }
      setTitle("");
      setAuthor("");
      setDescription("");
      setCopies(0);
      setCategory("Category");
      setSelectedImage(null);
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }
  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Book added successfully!
        </div>
      )}
      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          All fields must be filed out!
        </div>
      )}

      <div className="card">
        <div className="card-header">Add a new book</div>
        <div className="card-body">
          <form method="POST">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <button
                  className="form-control btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </button>
                <ul
                  id="addNewBook"
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      onClick={() => categoryField("FE")}
                      className="dropdown-item"
                    >
                      Front-End
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("BE")}
                      className="dropdown-item"
                    >
                      Back-End
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("Data")}
                      className="dropdown-item"
                    >
                      Data
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("DevOps")}
                      className="dropdown-item"
                    >
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Copies</label>
              <input
                type="number"
                className="form-control"
                name="copies"
                required
                onChange={(e) => setCopies(+e.target.value)}
                value={copies}
              />
            </div>
            <input type="file" onChange={(e) => base64ConversionForImage(e)} />
            <div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => submitNewBook()}
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
