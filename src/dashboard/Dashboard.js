import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation } from "react-router-dom";
import { today, next, previous } from "../utils/date-time";
import Reservation from "./Reservation";
import Tables from "./Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  //let date = query.get("date") || today();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [date, setDate] = useState(query.get("date") || today());

  useEffect(loadDashboard, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables().then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={() => setDate(previous(date))}>Previous Day</button>
      <button onClick={() => setDate(today())}>Today</button>
      <button onClick={() => setDate(next(date))}>Next Day</button>
      <label htmlFor="reservation_date" className="form-label">
        Date:
        <input
          type="date"
          pattern="\d{4}-\d{2}-\d{2}"
          name="reservation_date"
          onChange={handleDateChange}
          value={date}
        />
      </label>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0" onClick={() => console.log(tables)}>
          Reservations for {date}
        </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="card-deck">
        {tables.map((table) => (
          <Tables key={table.table_id} table={table} />
        ))}
      </div>
      <div className="card-deck">
        {reservations.map((reservation) => (
          <Reservation
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
