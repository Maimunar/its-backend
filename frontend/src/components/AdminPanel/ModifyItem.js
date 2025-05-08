import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../jwtconfig'
import ErrorDisplay from '../ErrorDisplay';

const ModifyItem = ({ items, setItems, getItemNames }) => {
    const clothTypes = ["Shirt", "Sweatshirt", "Hat"]
    const [itemName, setItemName] = useState('');
    const [bandName, setBandName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [itemType, setItemType] = useState('default');
    const [itemReseller, setItemReseller] = useState('');
    const [itemPicture, setItemPicture] = useState(null);
    const [selectedItem, setSelectedItem] = useState('default')
    const [XS, setXS] = useState(false)
    const [S, setS] = useState(false)
    const [M, setM] = useState(false)
    const [L, setL] = useState(false)
    const [XL, setXL] = useState(false)
    let fileInput = React.createRef()
    const [selectedBtn, setSelectedBtn] = useState('')
    const [errorMsg, setErrorMsg] = useState()
    const [successMsg, setSuccessMsg] = useState()

    const handlePictureChange = (e) => {
        setItemPicture(e.target.files[0])
    }

    const handleSuccess = (successString) => {
        setSuccessMsg(successString)
        setTimeout(() => setSuccessMsg(), 5000)
    }

    const validateForm = () => {
        let errors = ''
        const foundError = (errorMessage) => {
            errors += `${errorMessage}\n`
        }

        if (selectedItem === 'default') {
            foundError('Please pick an item! ')
            setErrorMsg(errors)
            return false
        }

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

    const validateDelete = () => {
        if (selectedItem === 'default') {
            setErrorMsg('Please pick an item to delete!')
            return false
        }
        return true
    }

    const getSizes = () => {
        const tempSizes = { "XS": XS, "S": S, "M": M, "L": L, "XL": XL }
        let returnSizes = []
        for (const [key, value] of Object.entries(tempSizes)) {
            if (value) returnSizes.push(key)
        }
        return returnSizes
    }


    const setSizesObject = (sizesList) => {
        setXS(sizesList.includes('XS'))
        setS(sizesList.includes('S'))
        setM(sizesList.includes('M'))
        setL(sizesList.includes('L'))
        setXL(sizesList.includes('XL'))
    }

    const updateGUI = () => {
        let selected = items.find(item => item.itemName === selectedItem)
        console.log(selected)
        if (selected) {
            setItemName(selected.itemName)
            setBandName(selected.bandName)
            setDescription(selected.description)
            setPrice(selected.price)
            setItemType(selected.type)
            setItemReseller(selected.linkToReseller)
            setSizesObject(selected.sizes)
        } else {
            setItemName('')
            setBandName('')
            setDescription('')
            setPrice(0)
            setItemType('default')
            setItemReseller('')
            setSizesObject([])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedBtn === 'submitBtn') {
            if (validateForm()) {
                let form = new FormData()
                form.set('itemName', selectedItem)
                form.set('bandName', bandName)
                form.set('description', description)
                form.set('price', price)
                form.set('sizes', getSizes())
                form.set('type', itemType)
                form.set('linkToReseller', itemReseller)
                form.set('itemPicture', itemPicture)

                axios.put('/api/items/modifyItem', form, config(localStorage.getItem('token')))
                    .then((res) => console.log(res))
                    .then(() => getItemNames())
                    .then(() => {
                        setSelectedItem('default')
                        handleSuccess('Item Succesfully Modified!')
                        setErrorMsg('')
                    })
                    .catch((err) => console.log(err))
            }
        }
        if (selectedBtn === 'removeBtn') {
            if (validateDelete()) {
                let form = new FormData()
                form.append('itemName', itemName)

                axios.post('/api/items/deleteItem', form, config(localStorage.getItem('token')))
                    .then((res) => {
                        console.log(res)
                        console.log('Successfuly deleted')
                    })
                    .then(() => getItemNames())
                    .then(() => {
                        setSelectedItem('default')
                        handleSuccess('Item succesfully deleted')
                    })
                    .catch((err) => console.log)
            }
        }
    }

    useEffect(updateGUI, [selectedItem])

    return (
        <>
            <div className="item-form">
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="modify-item-form">
                        {successMsg ? <h5>{successMsg}</h5> : ""}
                        {errorMsg ? <ErrorDisplay errors={errorMsg} /> : ""}
                        <select name="itemsList" id="itemsList" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                            <option value="default" hidden>Choose an item to modify:</option>
                            {items.map((item, index) =>
                                <option value={item.itemName} key={index}>{item.itemName}</option>
                            )}
                        </select>
                        <input name="itemName" id="itemName" placeholder="Item Name" readOnly value={itemName} />
                        <input name="bandName" id="bandName" placeholder="Band Name" value={bandName} onChange={(e) => setBandName(e.target.value)} />
                        <textarea name="itemDescription" id="itemDescription" placeholder="Description" rows="5"
                            value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        <input name="itemPrice" id="itemPrice" placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        Available Sizes:
                        <div>
                            <input type="checkbox" id="XS" name="XS" checked={XS} onChange={(e) => setXS(e.currentTarget.checked)} />
                            <label>XS</label><br />
                            <input type="checkbox" id="S" name="S" checked={S} onChange={(e) => setS(e.currentTarget.checked)} />
                            <label>S</label><br />
                            <input type="checkbox" id="M" name="M" checked={M} onChange={(e) => setM(e.currentTarget.checked)} />
                            <label>M</label><br />
                            <input type="checkbox" id="L" name="L" checked={L} onChange={(e) => setL(e.currentTarget.checked)} />
                            <label>L</label><br />
                            <input type="checkbox" id="XL" name="XL" checked={XL} onChange={(e) => setXL(e.currentTarget.checked)} />
                            <label>XL</label><br />
                        </div> <br />
                        <label>Choose a clothing type: </label>
                        <select name="itemType" id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)} >
                            <option value="default" hidden>Choose an item type:</option>
                            {clothTypes.map((type, index) =>
                                <option key={index} value={type} >{type}</option>
                            )}
                        </select>
                        <input name="buyLink" id="buyLink" type="url" placeholder="Link to a Seller" value={itemReseller} onChange={(e) => setItemReseller(e.target.value)} />
                        <br />
                        <label>
                            <b>Update the Clothing Item's Picture</b>
                        </label>
                        <input name="itemPicture" type="file" id="itemPicture" ref={fileInput} onChange={handlePictureChange} />
                        <br />
                        <input type="submit" name="submitBtn" id="submitBtn" value="Modify Item" onClick={(e) => setSelectedBtn(e.target.name)} />
                        <input type="submit" name="removeBtn" id="removeBtn" value="Remove Item" onClick={(e) => setSelectedBtn(e.target.name)} />
                        <br />

                    </div>

                </form>
            </div>
        </>
    )
}

export default ModifyItem
