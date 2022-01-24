import { Route, Routes } from "react-router-dom";
import HomeWrapper from './pages/home/home';
import SingleCart from "./pages/singleCart/singleCart";

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomeWrapper />}></Route>
        <Route path="/singleCart/:cartId" element={<SingleCart />}></Route>
      </Routes>
    </div>
  );
}

export default App;
