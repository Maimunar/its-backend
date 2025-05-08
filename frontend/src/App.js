import './App.css';
import Navbar from './components/Navbar';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import BrowsePage from './pages/BrowsePage'
import AdminPanel from './pages/AdminPanel'
import WishlistPage from './pages/WishlistPage'
import LoginPage from './pages/LoginPage'
import ItemPage from './pages/ItemPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import LogoutPage from './pages/LogoutPage'
import { useEffect, useState } from 'react';
import axios from 'axios'
import config from './jwtconfig'
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  
  const [user, setUser] = useState()
  const [userType, setUserType] = useState('user')
  const [items, setItems] = useState([])

  const changeUserType = (newType) => {
    setUserType(newType)
  }

  const getItemNames = () => {
    axios.get('/api/items', config(localStorage.getItem('token')))
      .then((res) => {
        console.log(res.data)
        setItems(res.data)
        return res.data
      })
      .catch((err) => console.log(err))
  }

  useEffect(getItemNames, [])

  return (
    <Router>
      <div className="App">
        <Navbar user={user} userType={userType} />
        <div id="page-body">
          <Switch>
            <Route path="/" render={() => <BrowsePage items={items} />} exact />
            <ProtectedRoute user={user} path="/admin" items={items} setItems={setItems} 
            getItemNames={getItemNames} component={AdminPanel}/>
            <ProtectedRoute user={user} path="/chat" component={ChatPage}/>          
            <ProtectedRoute user={user} path="/wishlist" component={WishlistPage}/>
            <Route path="/login" render={() => <LoginPage changeUserType={changeUserType} setUser={setUser} />} />
            <Route path="/logout" render={() => <LogoutPage changeUserType={changeUserType} setUser={setUser} />} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/item/:itemName" component={ItemPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
