import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../jwtconfig'

const WishlistItem = ({ item, subscribeToItemDelete }) => {

    const handleDelete = (e) => {
        axios.post('/api/wishlist/deleteItem/' + localStorage.getItem('user'),
         {itemName: item.itemName }, 
         config(localStorage.getItem('token')))
            .then((res) => {
            console.log(res);
            subscribeToItemDelete()
        })
            .catch((err) => console.log(err))
    }

    return (
        <div className="wishlist-item-container">
            <div className="wishlist-item-picture-container">
                <img src={"/api/items/itemPicture/" + item.itemPicture} alt="Wishlist product Item" />
            </div>
            <div className="wishlist-item-content-container">
                <h3>{item.itemName}</h3>
                <Link className="wishlist-details" to={'/item/' + item.itemName}>Get More Details</Link>
                <a className="wishlist-reseller" href={item.linkToReseller} target="_blank">Go to reseller</a>
            </div>
            <button className="delete-btn" onClick={handleDelete}><h3>X</h3></button>
        </div>
    )
}

export default WishlistItem
