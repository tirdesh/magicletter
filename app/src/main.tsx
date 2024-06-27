import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ValidationProvider } from "./context/validationContext";
import "./index.css";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ValidationProvider>
          <App />
        </ValidationProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
