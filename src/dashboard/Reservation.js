import { Link } from "react-router-dom";

export default function Reservation({ reservation }) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4>{reservation.reservation_time}</h4>
          <h5 className="card-title">
            {reservation.first_name} {reservation.last_name}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {reservation.mobile_number}
          </h6>
          <h6>
            {reservation.people} {reservation.people > 1 ? "Guests" : "Guest"}
          </h6>
          <h5 data-reservation-id-status={reservation.reservation_id}>
            Status: {reservation.status}
          </h5>
          {reservation.status === "booked" ? (
            <Link
              to={`/reservations/${reservation.reservation_id}/seat`}
              className="btn btn-primary btn-lg"
            >
              Seat
            </Link>
          ) : <h5>Seated</h5>}
        </div>
      </div>
    </>
  );
}
