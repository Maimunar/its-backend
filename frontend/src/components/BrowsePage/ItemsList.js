import React from 'react'
import ItemOnBrowse from './ItemOnBrowse'

const ItemsList = ({ items }) => {

    return (
        <div className="content-container">
            {items.map((item, key) =>
                <ItemOnBrowse key={key} item={item} />)}
        </div>
    )
}

export default ItemsList;