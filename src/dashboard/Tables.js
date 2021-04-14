import { clearTable } from "../utils/api";

export default function Reservation({ table }) {
  const handleFinish = async () => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? \n \n \nThis cannot be undone."
      )
    ) {
      try {
        await clearTable(table.table_id);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-body">
          {table.reservation_id ? (
            <h4 data-table-id-status={table.table_id}>occupied</h4>
          ) : (
            <h4 data-table-id-status={table.table_id}>free</h4>
          )}
          <h5 className="card-title">Table {table.table_name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Capacity: {table.capacity}
          </h6>
          {table.reservation_id ? (
            <button
              data-table-id-finish={table.table_id}
              onClick={handleFinish}
            >
              Finish
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
