import axios from 'axios';
import React, { useState } from 'react'
import config from '../../jwtconfig'
import ErrorDisplay from '../ErrorDisplay';

const AddItem = ({ items, getItemNames }) => {
    const clothTypes = ["Shirt", "Sweatshirt", "Hat"]
    const [itemName, setItemName] = useState('')
    const [bandName, setBandName] = useState('')
    const [description, setDescription] = useState()
    const [price, setPrice] = useState();
    const [sizes, setSizes] = useState({
        "XS": false,
        "S": false,
        "M": false,
        "L": false,
        "XL": false
    })
    const [itemType, setItemType] = useState('default')
    const [itemReseller, setItemReseller] = useState()
    const [itemPicture, setItemPicture] = useState(null)
    const [errorMsg, setErrorMsg] = useState()
    const [successMsg, setSuccessMsg] = useState()
    let fileInput = React.createRef()

    const handlePictureChange = (e) => {
        setItemPicture(e.target.files[0])
    }

    const handleSuccess = (successString) => {
        setSuccessMsg(successString)
        setTimeout(() => setSuccessMsg(), 5000)
    }

    const handleCheckboxChange = (e) => {
        const target = e.target
        const value = target.checked
        const name = target.name
        const tempSizes = sizes
        tempSizes[name] = value
        setSizes(tempSizes)
    }

    const getSizes = () => {
        const tempSizes = ['XS', 'S', 'M', 'L', 'XL']
        let returnSizes = []
        tempSizes.forEach(size => {
            if (sizes[size]) returnSizes.push(size)
        })
        return returnSizes
    }

    const validateForm = () => {
        let errors = ''
        const foundError = (errorMessage) => {
            errors += `${errorMessage}\n`
        }

        if (!itemName || itemName.length === 0)
            foundError('Please fill in the item name!')

        const found = items.find(item => item.itemName === itemName)
        if (found)
            foundError('Item name taken!')

        if (!bandName || bandName.length === 0)
            foundError('Please fill in the band name!')

        if (!description || description.length === 0)
            foundError('Please fill in the description!')

        if (!price)
            foundError('Please add a price to the item!')

        if (getSizes().length === 0)
            foundError('Please add atleast one available size!')

        if (itemType === 'default')
            foundError('Please pick an item type')

        if (!itemReseller || itemReseller.length === 0)
            foundError('Please fill in the item reseller!')

        if (errors.length === 0) return true
        else {
            setErrorMsg(errors)
            return false
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            let form = new FormData()
            form.set('itemName', itemName)
            form.set('bandName', bandName)
            form.set('description', description)
            form.set('price', price)
            form.set('sizes', getSizes())
            form.set('type', itemType)
            form.set('linkToReseller', itemReseller)
            form.set('itemPicture', itemPicture)

            axios.post('/api/items/modifyItem', form, config(localStorage.getItem('token')))
                .then((res) => console.log(res))
                .then(() => {
                    getItemNames()
                    setErrorMsg('')
                    handleSuccess('Item Succesfully Added!')
                })
                .catch((err) => console.log(err))
        }
    }

    return (
        <>
            <div className="item-form">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="modify-item-form">
                        {successMsg ? <h5>{successMsg}</h5> : ""}
                        {errorMsg ? <ErrorDisplay errors={errorMsg} /> : ""}
                        <input name="itemName" id="itemName" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                        <input name="bandName" id="bandName" placeholder="Band Name" value={bandName} onChange={(e) => setBandName(e.target.value)} />
                        <textarea name="itemDescription" id="itemDescription" placeholder="Description" rows="5"
                            value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <input name="itemPrice" id="itemPrice" min="0.00" step="0.01" placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        Available Sizes:
                        <div>
                            <input type="checkbox" id="XS" name="XS" onChange={handleCheckboxChange} />
                            <label>XS</label><br />
                            <input type="checkbox" id="S" name="S" onChange={handleCheckboxChange} />
                            <label>S</label><br />
                            <input type="checkbox" id="M" name="M" onChange={handleCheckboxChange} />
                            <label>M</label><br />
                            <input type="checkbox" id="L" name="L" onChange={handleCheckboxChange} />
                            <label>L</label><br />
                            <input type="checkbox" id="XL" name="XL" onChange={handleCheckboxChange} />
                            <label>XL</label><br />
                        </div> <br />
                        <label>Choose a clothing type: </label>
                        <select name="itemType" value={itemType} id="itemType" onChange={(e) => setItemType(e.target.value)} >
                            <option value="default" hidden>Choose an item type:</option>
                            {clothTypes.map((type, index) =>
                                <option key={index} value={type} >{type}</option>
                            )}
                        </select>
                        <input name="buyLink" id="buyLink" type="url" placeholder="Link to a Seller" value={itemReseller} onChange={(e) => setItemReseller(e.target.value)} />
                        <br />
                        <label>
                            <b>Upload A Picture of the Clothing Item</b>
                        </label>
                        <input name="itemPicture" type="file" id="itemPicture" ref={fileInput} onChange={handlePictureChange} />
                        <br />
                        <input type="submit" name="submitBtn" id="submitBtn" /> <br />
                    </div>

                </form>
            </div>
        </>
    )
}

export default AddItem