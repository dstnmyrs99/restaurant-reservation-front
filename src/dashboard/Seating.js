import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, updateTable, readReservation, updateStatus } from "../utils/api";

export default function Seating() {
  const [formData, setFormData] = useState("Please Select a table");
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setTablesError(null);
    setReservationError(null);
    listTables().then(setTables).catch(setTablesError);
    readReservation(reservation_id)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData === "Please Select a table")
        throw new Error("Please select a valid table");
      await updateTable(formData, { data: { reservation_id } });
      await updateStatus(reservation_id, { data: { status: "seated" } });
      history.push("/dashboard");
    } catch (error) {
      setTablesError(error);
    }
  };
  const handleChange = (event) => {
    setFormData(event.target.value);
  };
  const handleCancel = () => {
    setFormData("Please Select a table");
    history.goBack();
  };
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="table_id">
          Table number:
          <select
            id="table_id"
            name="table_id"
            onChange={handleChange}
            value={formData}
          >
            <option>Please Select a table</option>
            {tables.map((table) => {
              return table.capacity > reservation.people && (
                <option key={table.table_id} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              );
            })}
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleCancel}>Cancel</button>
      {reservation && (
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">
              {reservation.first_name} {reservation.last_name}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {reservation.reservation_time}
            </h6>
            <h6>
              {reservation.people} {reservation.people > 1 ? "Guests" : "Guest"}
            </h6>
          </div>
        </div>
      )}
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={reservationError} />
    </>
  );
}
