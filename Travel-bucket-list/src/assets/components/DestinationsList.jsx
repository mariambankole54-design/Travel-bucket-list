import { useState, useEffect } from "react"
import DestinationsItem from "./DestinationsItem"

function DestinationsList() {
  const [destinations, setDestinations] = useState([])
  const [newName, setNewName] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetch("http://localhost:5005/destinations")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setDestinations(data)
  })
  }, [])

  const handleAdd = (e) => {
    e.preventDefault()
    const newDestination = {
      name: newName
    }

    fetch("http://localhost:5005/destinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newDestination)
    })
      .then((res) => res.json())
      .then((data) => {
        setDestinations([...destinations, data])
        setNewName("")
      })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5005/destinations/${id}`, {
      method: "DELETE"
    }).then(() => {
      setDestinations(destinations.filter((item) => item.id !== id))
    })
  }

  const filteredDestinations = destinations.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>

      <input
        type="text"
        placeholder="New destination"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button type="submit">Add</button>

      <input
        type="text"
        placeholder="Search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filteredDestinations.map((item) => (
        <DestinationsItem
          key={item.id}
          destination={item}
          onDelete={handleDelete}
        />
      ))}

    </div>
  )
}

export default DestinationsList;