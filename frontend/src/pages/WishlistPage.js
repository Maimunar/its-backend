import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import WishlistItem from '../components/WishlistPage/WishlistItem'
import config from '../jwtconfig'

const WishlistPage = ({ user }) => {
    const [wishlist, setWishlist] = useState([])

    const clearWishlist = (e) => {
        axios.post('/api/wishlist/clearWishlist/' + user, config(localStorage.getItem('token')))
            .then((res) => {
                console.log(res)
                setWishlist([])
            })
            .catch((err) => console.log(err))
    }

    const getWishlist = () => {
        axios.get('/api/wishlist/' + user, config(localStorage.getItem('token')))
            .then((res) => {
                setWishlist(res.data.wishlistItems)
            })
            .catch((err) => console.log(err))
    }

    const subscribeToItemDelete = () => {}

    useEffect(getWishlist, [subscribeToItemDelete])
    
    return (
        <div className="wishlist-container">
            <div className="wishlist-subcontainer">
                <div className="wishlist-title">
                    <h1>Your Wishlist</h1>
                    <button className="clear-wishlist-btn" onClick={clearWishlist}>Clear Wishlist</button>
                </div>
                <div className="wishlist-content">
                    {wishlist ? wishlist.map((item, key) =>
                        <WishlistItem item={item} key={key} subscribeToItemDelete={subscribeToItemDelete} />) : <p>Your Wishlist is empty! Consider adding some items?</p>}
                </div>
            </div>
        </div>
    )
}

export default withRouter(WishlistPage);
