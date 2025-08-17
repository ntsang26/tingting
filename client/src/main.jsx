import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { PhotoProvider } from "react-photo-view";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PhotoProvider>
      <App />
    </PhotoProvider>
  </BrowserRouter>
);
