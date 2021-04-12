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
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="btn btn-primary btn-large">
              <a href={`/reservations/${reservation.reservation_id}/seat`}></a>
              Seat
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
