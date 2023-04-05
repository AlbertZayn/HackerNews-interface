import React from "react";
import "./styles.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home.jsx";
import NewsItem from "./NewsItem.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/news/:id" component={NewsItem} />
          <Route exact path="/comment/:id" component={Comment} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
