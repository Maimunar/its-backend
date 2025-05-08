import React, { useEffect, useState } from 'react'
import ItemsSorter from '../components/BrowsePage/ItemsSorter'
import ItemsList from '../components/BrowsePage/ItemsList'

const BrowsePage = ({ items }) => {

    const [itemsView, setItemsView] = useState(items)

    useEffect(() => setItemsView(items), [items])

    return (
        <div class="wishlist-container">
            <div class="wishlist-subcontainer">
                <ItemsSorter items={itemsView} setItems={setItemsView} />
                <ItemsList items={itemsView} />
            </div>
        </div>
    )
}

export default BrowsePage;