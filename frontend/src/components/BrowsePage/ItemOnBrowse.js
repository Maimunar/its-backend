import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const ItemOnBrowse = ({ item }) => {
    
    const [defaultPic, setDefaultPic] = useState('./no-image-available.jpg')

    return (
        <Link to={'/item/' + item.itemName}>
            <div className="item-card">
                <div className='product-item-picture-container'>
                    <img src={"/api/items/itemPicture/" + item.itemPicture} alt="Product item" onError={(e) => e.target.src = defaultPic} />
                </div>
                <div className="product-item-title">
                    <h4>{item.itemName}</h4>
                </div>
                <div className="product-item-price">
                    <p>{item.price} $</p>
                </div>
            </div>
        </Link>
    )
}

export default ItemOnBrowse;