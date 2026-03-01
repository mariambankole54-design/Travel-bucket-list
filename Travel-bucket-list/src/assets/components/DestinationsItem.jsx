function DestinationsItem({ destination, onDelete }) {
  return (
    <div className="card">
      <h3>{destination.name}</h3>
      <ul><strong>{destination.country}</strong></ul>
      <ul><strong>Notes: </strong>{destination.notes}</ul>
      <ul><strong>Budget: </strong>{destination.budget}</ul>
      <ul><strong>Currency: </strong>{destination.currency}</ul>
      <ul><strong>Status: </strong>{destination.status}</ul>
      <ul><strong>Year: </strong>{destination.year}</ul>
      <ul><strong>Travel Dates: </strong>{destination.traveldates}</ul>
      <ul><strong>Tips: </strong>{destination.tips}</ul>
      <ul><strong>Rating: </strong>{destination.rating}</ul>
      <p><strong>Description: </strong>{destination.description}</p>
      <button onClick={() => onDelete(destination.id)}>
        Delete
      </button>
    </div>
  )
}

export default DestinationsItem;