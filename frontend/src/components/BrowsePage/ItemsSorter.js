import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../../jwtconfig'

const ItemsSorter = ({ items, setItems }) => {
    const [allItems, setAllItems] = useState(items)
    const [bands, setBands] = useState()
    const [selectedBand, setSelectedBand] = useState('default')
    const [XS, setXS] = useState(false)
    const [S, setS] = useState(false)
    const [M, setM] = useState(false)
    const [L, setL] = useState(false)
    const [XL, setXL] = useState(false)
    const [priceFilter, setPriceFilter] = useState(0.00)
    const [maxPrice, setMaxPrice] = useState()

    const getBands = () => {
        if (allItems.length === 0) setAllItems(items)

        let bandsList = allItems.map(item => item.bandName)
        bandsList = [...new Set(bandsList)]
        setBands(bandsList)
    }

    const getSizes = () => {
        const tempSizes = { "XS": XS, "S": S, "M": M, "L": L, "XL": XL }
        let returnSizes = []
        for (const [key, value] of Object.entries(tempSizes)) {
            if (value) returnSizes.push(key)
        }
        return returnSizes
    }

    const sizesToString = (sizesToConvert) => {
        let returnString = "["
        sizesToConvert.forEach((size, index) => {
            returnString += `"${size}",`
        })
        returnString = returnString.slice(0, -1) + ']'
        return returnString
    }

    const filterItems = () => {
        let searchQuery = '?'
        let firstItemAdded = false
        //Sort by Band Check
        if (selectedBand !== 'default') {
            searchQuery += `band=${selectedBand}`
            firstItemAdded = true
        }
        let sizes = getSizes()
        if (sizes.length > 0) {
            if (firstItemAdded)
                searchQuery += `&sizes=${sizesToString(sizes)}`
            else {
                searchQuery += `sizes=${sizesToString(sizes)}`
                firstItemAdded = true
            }
        }
        if (priceFilter > 0) {
            if (firstItemAdded)
                searchQuery += `&price=${priceFilter}`
            else {
                searchQuery += `price=${priceFilter}`
                firstItemAdded = true
            }
        }

        axios.get('/api/items' + searchQuery, config(localStorage.getItem('token')))
            .then((res) => setItems(res.data))
            .catch((err) => console.log(err))
    }

    const getMaxPrice = () => {
        if (allItems.length === 0) setAllItems(items)
        let max = 0;
        allItems.forEach(item => {
            if (item.price > max) max = item.price
        })
        max = Math.floor(max)
        setMaxPrice(max)
    }

    useEffect(() => { if (allItems.length === 0) setAllItems(items) }, [items])
    useEffect(getMaxPrice, [allItems])
    useEffect(getBands, [allItems])
    useEffect(filterItems, [XS, S, M, L, XL, selectedBand, priceFilter])

    return (
        <div className="search-container">
            <h3>Search for a specific Item</h3>
            <div className="sort-by-band">
                <h4>Sort by band:</h4>
                <select name="bandsList" value={selectedBand} id="bandsList" onChange={(e) => setSelectedBand(e.target.value)} >
                    <option value="default">All Bands</option>
                    {bands ? bands.map((item, index) =>
                        <option value={item} key={index}>{item}</option>
                    ) : ""}
                </select>
            </div>
            <div className="sort-by-size">
                <h4>Find items in your size</h4>
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
            </div>
            <div className="sort-by-price">
                <h4>Find all items above this price:</h4>
                <div class="slidecontainer">
                    <input type="range" min="0" onMouseUp={(e) => setPriceFilter(e.target.value)}
                      defaultValue={0}  max={maxPrice} class="slider" id="myRange" />
                </div>
                <p id="priceTag">{priceFilter}</p>
            </div>
        </div>
    )
}

export default ItemsSorter;