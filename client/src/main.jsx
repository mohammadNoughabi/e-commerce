import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import store from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppInitializer from "./components/App/AppInitializer";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AppInitializer>
        <App />
      </AppInitializer>
    </Provider>
  </BrowserRouter>
);
