import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../jwtconfig'

const ItemsForABandStatistics = ({ items }) => {
    const [bands, setBands] = useState()
    const [itemsText, setItemsText] = useState('Please pick a band to see the ammount of articles shown of it')
    const [selectedBand, setSelectedBand] = useState('default')
    
    const getBands = () => {
        let bandsList = items.map(item => item.bandName)
        bandsList = [...new Set(bandsList)]
        setBands(bandsList)
    }

    const getBandInfo = () => {
        if (selectedBand === 'default') return
        axios.get(`/api/items/perBand/${selectedBand}`, config(localStorage.getItem('token')))
            .then((res) => {
                if (res.status === 200)
                    setItemsText(res.data)
            })
            .catch((err) => console.log(err))
    }

    useEffect(getBands, [items])
    useEffect(getBandInfo, [selectedBand])

    return (
        <div className="statistics-panel">
            <h3>View Number of Items for a Band</h3>
            <p>Pick a band:</p>
            <select name="bandsList" value={selectedBand} id="bandsList" onChange={(e) => setSelectedBand(e.target.value)} >
                <option value="default" hidden>Choose Here:</option>
                {bands ? bands.map((item, index) =>
                    <option value={item} key={index}>{item}</option>
                ) : ""}
            </select>
            <p>{itemsText}</p>
        </div>
    )
}

export default ItemsForABandStatistics;