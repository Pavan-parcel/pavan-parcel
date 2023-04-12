import { Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import SetItem from './components/setItem/setItem';

function App() {
  
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/setting' element={<SetItem />} />
      </Routes>
      {/* <Login />  */}
      
    </div>
  );
}

export default App;