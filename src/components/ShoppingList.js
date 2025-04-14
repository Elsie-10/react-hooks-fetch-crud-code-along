import React, {useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  //add use effect hook
  useEffect(() => {
    fetch("http://localhost:4000/items")
    .then((res) => res.json())
    .then((items) => setItems(items))
  }, [])

  function handleDeleteItem(deletedItem) {
    fetch(`http://localhost:4000/items/${deletedItem.id}`, {
      method: "DELETE",
    }).then(() => {
      const updatedItems = items.filter((item) => item.id !== deletedItem.id);
      setItems(updatedItems);
    });
  }

   // add this callback function
   function handleUpdateItem(updatedItem) {
    fetch(`http://localhost:4000/items/${updatedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((res) => res.json())
      .then((savedItem) => {
        const updatedItems = items.map((item) => {
          if (item.id === savedItem.id) {
            return savedItem;
          } else {
            return item;
          }
        });
        setItems(updatedItems);
      });
  }

  function handleAddItem(newItem) {
//console.log("In ShoppingList:", newItem);
fetch("http://localhost:4000/items", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newItem),
})
  .then((res) => res.json())
  .then((savedItem) => setItems([...items, savedItem]));
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem}/>
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item key={item.id} item={item} 
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
