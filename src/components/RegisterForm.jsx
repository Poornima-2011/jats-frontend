import { useState } from "react";
import { registerUser } from "../api";

function RegisterForm({ onRegistered }) {
  const [form, setForm] = useState({ name: "", email: "", role: "CANDIDATE" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await registerUser(form);
      onRegistered(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="CANDIDATE">Candidate</option>
        <option value="RECRUITER">Recruiter</option>
      </select>
      <button type="submit">Register</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

export default RegisterForm;