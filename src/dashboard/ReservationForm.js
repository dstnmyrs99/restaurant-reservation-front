import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";

function ReservationForm() {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  const [formData, setFormData] = useState({ ...initialState });
  const handleChange = ({ target }) => {
    const value =
      target.type === "number" ? Number(target.value) : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //make sure reservation date is not in the past or on non working day.
    let newDate = new Date(
      `${formData.reservation_date} ${formData.reservation_time}`
    );
    let currentDay = new Date();
    try {
      if (newDate.getDay() === 2)
        throw new Error("Restaurant is closed on Tuesdays!");
      if (newDate < currentDay) throw new Error("Fellow time traveler eh!");
      //check if reservation time is within working hours
      let time = Number(formData.reservation_time.replace(":", ""));
      if (time < 1030 || time > 2130)
        throw new Error(
          "Reservations are only valid from 10:30 AM to 9:30 PM."
        );
      await createReservation({ data: formData });
      setFormData({ ...initialState });
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (err) {
      setReservationsError(err);
    }
  };

  return (
    <div
      variant="outline-dark"
      className="container w-50"
      style={{
        border: "2px solid black",
        padding: "5px",
        boxShadow: "2px 2px white",
      }}
    >
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="first_name" className="form-label">
          First name:
          <input
            className="form-control"
            id="first_name"
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </label>
        <label htmlFor="last_name" className="form-label">
          Last name:
          <input
            className="form-control"
            id="last_name"
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </label>
        <label htmlFor="mobile_number" className="form-label">
          Phone number:
          <input
            className="form-control"
            id="mobile_number"
            type="tel"
            //pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          ></input>
        </label>
        <label htmlFor="reservation_date" className="form-label">
          Date:
          <input
            className="form-control"
            id="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </label>
        <label htmlFor="reservation_time" className="form-label">
          Time:
          <input
            className="form-control"
            id="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </label>
        <label htmlFor="people" className="form-label">
          Number of guests:
          <input
            className="form-control"
            id="people"
            type="number"
            min="1"
            max="22"
            name="people"
            onChange={handleChange}
            value={formData.people}
            required
          />
        </label>
        <button type="submit">Submit</button>
        <button onClick={() => history.goBack()}>Cancel</button>
        <button onClick={() => setFormData(initialState)}>Reset</button>
      </form>
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default ReservationForm;
