export default function Reservation({ table }) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 data-table-id-status={`${table.table_id}`}>
            {table.occupied ? "Occupide" : "Free"}
          </h4>
          <h5 className="card-title">Table {table.table_name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Capacity: {table.capacity}
          </h6>
        </div>
      </div>
    </>
  );
}
