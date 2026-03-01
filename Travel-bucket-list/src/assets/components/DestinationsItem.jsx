function DestinationsItem({ destinations, onDelete }) {
  return (
    <div>
      <h3>{destinations.name}</h3>
      <button onClick={() => onDelete(destinations.id)}>
        Delete
      </button>
    </div>
  )
}

export default DestinationsItem