import "./App.css";

import {Provider as AuthProvider} from './context/AuthContext.js';
import NavBar from "./components/Navbar";
import React from "react";
import { Router } from "react-router-dom";
import Routing from "./Routing";
import history from "./modules/history";

function App() {
  return (
    <AuthProvider>
    <Router history={history}>
      <NavBar />
      <Routing/>
    </Router>
    </AuthProvider>
  );
}

export default App;
