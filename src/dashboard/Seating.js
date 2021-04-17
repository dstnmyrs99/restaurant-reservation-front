import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { formatDate, formatTime } from "../utils/date-time";
import {
  listTables,
  updateTable,
  readReservation,
  updateStatus,
} from "../utils/api";

export default function Seating() {
  const [formData, setFormData] = useState("Please Select a table");
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    async function loadDashboard() {
      const abortController = new AbortController();
      setTablesError(null);
      setReservationError(null);
      try {
        const listedTables = await listTables(abortController.signal);
        setTables(listedTables);
        const reserved = await readReservation(reservation_id);
        setReservation(reserved);
        setDate(formatDate(reserved.reservation_date));
        setTime(formatTime(reserved.reservation_time));
      } catch (err) {
        setTablesError(err);
        setReservationError(err);
      }
      return () => abortController.abort();
    }
    loadDashboard();
  }, [reservation_id]);

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
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <form
          action=""
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center"
        >
          <label htmlFor="table_id">
            <select
              id="table_id"
              name="table_id"
              onChange={handleChange}
              value={formData}
            >
              <option>Please Select a table</option>
              {tables.map((table) => {
                return table.capacity >= reservation.people &&
                  !table.occupied ? (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ) : null;
              })}
            </select>
          </label>
          <button type="submit" className="btn btn-sm btn-primary">
            Submit
          </button>
        </form>
        <button
          onClick={handleCancel}
          className="mb-5 mt-2 btn btn-sm btn-danger"
        >
          Cancel
        </button>
        {reservation && (
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">
                {reservation.first_name} {reservation.last_name}
              </h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {date}
                <br />
                {time}
              </h6>
              <h6>
                {reservation.people}{" "}
                {reservation.people > 1 ? "Guests" : "Guest"}
              </h6>
            </div>
          </div>
        )}
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={reservationError} />
      </div>
    </>
  );
}
