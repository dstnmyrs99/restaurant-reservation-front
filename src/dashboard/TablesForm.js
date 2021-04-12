import { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {createTable} from "../utils/api";

export default function Tables() {
  const history = useHistory();
  const initialState = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = useState({ ...initialState });
  const [tablesError, setTablesError] = useState(null);
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
    try {
      await createTable({ data: formData });
      setFormData({ ...initialState });
      history.push(`/dashboard`);
    } catch (err) {
      setTablesError(err);
    }
  };

  return (
    <>
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
            Table name:
            <input
              className="form-control"
              id="table_name"
              type="text"
              name="table_name"
              onChange={handleChange}
              value={formData.table_name}
              required
            />
          </label>
          <label htmlFor="people" className="form-label">
            capacity:
            <input
              className="form-control"
              id="capacity"
              type="number"
              min="1"
              max="22"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
              required
            />
          </label>
          <button type="submit">Submit</button>
          <button onClick={() => history.goBack()}>Cancel</button>
          <button onClick={() => setFormData(initialState)}>Reset</button>
        </form>
        <ErrorAlert error={tablesError} />
      </div>
    </>
  );
}
