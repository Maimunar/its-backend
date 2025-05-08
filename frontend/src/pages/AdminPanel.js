import React, { useState } from 'react'
import AddItem from '../components/AdminPanel/AddItem'
import ModifyItem from '../components/AdminPanel/ModifyItem'
import ItemsStatistics from '../components/AdminPanel/ItemsForABandStatistics'
import { withRouter } from 'react-router-dom'

const AdminPanel = ({ items, setItems, getItemNames }) => {

    const [itemMode, setItemMode] = useState('add')

    const changeItemPanel = (e) => {
        setItemMode(e.target.value)
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-subcontainer">
                <div className="item-form" onChange={changeItemPanel}>
                    <h3>Add or Update Item</h3>
                    <input type="radio" name="rbModifier" value="add" id="add" defaultChecked />
                    <label >Add</label>
                    <input type="radio" name="rbModifier" value="update" id="update" />
                    <label >Update</label>
                </div> <br />
                {itemMode === 'add' ? <AddItem items={items} setItems={setItems} getItemNames={getItemNames} /> : <ModifyItem items={items} setItems={setItems} getItemNames={getItemNames} />}
                <ItemsStatistics items={items} />
            </div>
        </div>
    )
}

export default withRouter(AdminPanel);