import { Link } from "react-router-dom";
import { updateStatus } from "../utils/api";

export default function Reservation({ reservation }) {
  const handleCancel = async () => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? \n \n \nThis cannot be undone."
      )
    ) {
      try {
        await updateStatus(reservation.reservation_id, {
          data: { status: "cancelled" },
        });
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="card mx-3 my-3" style={{ width: "18rem" }}>
        <div className="card-body">
          <h4>{reservation.reservation_date}</h4>
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
            <>
              <Link
                to={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-primary btn-sm"
              >
                Seat
              </Link>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                className="mx-3 btn btn-danger btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <Link
                to={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-success btn-sm"
              >
                Edit
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
