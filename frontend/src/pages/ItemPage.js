import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../jwtconfig'

const ItemPage = ({ match }) => {

    const [item, setItem] = useState({
        itemName: "Item Name",
        bandName: "Band",
        type: "Item Type",
        description: "Description",
        price: 19.99,
        sizes: ["XS", "S", "M", "L", "XL"],
        linkToReseller: "https://www.impericon.com/en/"
    })
    const [errorMsg, setErrorMsg] = useState()
    const [successMsg, setSuccessMsg] = useState()

    const handleError = (errorString) => {
        setErrorMsg(errorString)
        setTimeout(() => setErrorMsg(), 5000)
    }

    const handleSuccess = (successString) => {
        setSuccessMsg(successString)
        setTimeout(() => setSuccessMsg(), 5000)
    }

    const getItem = () => {
        axios.get('/api/items/' + match.params.itemName, config(localStorage.getItem('token')))
            .then((res) => setItem(res.data))
            .catch((err) => console.log(err))
    }

    const addToWishlist = (e) => {
        if (localStorage.getItem('user')) {
            axios.post('/api/wishlist/' + localStorage.getItem('user'), {
                itemName: item.itemName,
                linkToReseller: item.linkToReseller,
                itemPicture: item.itemPicture
            }, config(localStorage.getItem('token')))
                .then((res) => {
                    console.log(res)
                    handleSuccess(res.data)
                })
                .catch((err) => {
                    if (err.response.status === 500)
                        handleError("Item Already in wishlist")
                    else
                        handleError("Error While Adding to Wishlist")
                })
        } else {
            handleError("Please log in first.")
        }
    }

    useEffect(getItem, [])
    
    return (
        <div className="wishlist-container">
            <div className="wishlist-subcontainer">
                <div className="wishlist-title">
                    <h1>{item.itemName}</h1>
                    {errorMsg ? <h2>{errorMsg}</h2> : ""}
                    {successMsg ? <h3>{successMsg}</h3> : ""}
                </div>
                <div className="product-content">
                    <div className="product-picture-container">
                        <img src={"/api/items/itemPicture/" + item.itemPicture} alt="Item" />
                    </div>
                    <h3 className="product-title">{item.bandName} {item.type}</h3>
                    <h4 className="product-description">{item.description}</h4>
                    <h4 className="product-price">Price: {item.price} $</h4>
                    <div className="product-sizes-container">
                        <label className="product-sizes-label">Available sizes:</label>
                        <select name="sizes" className="product-sizes">
                            {item.sizes.map((size, key) =>
                                <option value={size} key={key}>{size}</option>
                            )}
                        </select>
                    </div>
                    {localStorage.getItem('user') ? <p className="product-add-to-wishlist"><button className="btn-add-to-wishlist" onClick={addToWishlist}>Add to Wishlist</button></p> : ""}
                    <p className="product-buy-from"><a href={item.linkToReseller} target="_blank">Buy from Here</a></p>
                </div>
            </div>
        </div>
    )
}

export default ItemPage;
