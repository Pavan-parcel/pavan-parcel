import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import SetItem from './components/setItem/setItem';
import SendPlacetable from './components/itemtable/sendPlacetable';
import ItemTable from './components/itemtable/itemTable';
import ColorTable from './components/itemtable/colorTable';
import HomePaid from './components/home/homePaid';
import HomeTopay from './components/home/homeTopay';
import { useEffect, useState } from 'react';
import { CONSTANTS } from './utils/contants';
import General from './components/general/general';


function App() {

  const navigate = useNavigate();
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const isUser = localStorage.getItem(CONSTANTS.BRANCH);
    if(isUser){
      setHasUser(true)
    } else {
      setHasUser(false)
      navigate("/login")
    }
  }, [])

  useEffect(() => {
    if(hasUser){
      navigate("/")
    } else {
      navigate("/login")
    }
  }, [hasUser])

  return (
    <div>
      <Header />
      
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        {/* <Route path='/paid' element={<HomePaid />} />
        <Route path='/topay' element={<HomeTopay />} /> */}

          <Route path='/general' element={<General />} />
          <Route path='/setting/items' element={<ItemTable />} />
          <Route path='/setting/color' element={<ColorTable />} />
          <Route path='/setting/sendplace' element={<SendPlacetable />} />
        
      </Routes>
      {/* <Login />  */}

    </div>
  );
}

export default App;