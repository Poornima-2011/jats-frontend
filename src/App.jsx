import { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import CandidateView from "./components/CandidateView";
import RecruiterView from "./components/RecruiterView";
import { getUser } from "./api";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginId, setLoginId] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const user = await getUser(loginId);
      setCurrentUser(user);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setLoginId("");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Application Tracking System</h1>
        {currentUser && (
          <div className="session-info">
            <span>{currentUser.name} · {currentUser.role} (id: {currentUser.id})</span>
            <button onClick={handleLogout}>Switch user</button>
          </div>
        )}
      </header>

      {!currentUser && (
        <div className="auth-section">
          <div className="auth-card">
            <h2>Log in with your user ID</h2>
            <form onSubmit={handleLogin}>
              <input
                type="number"
                placeholder="Enter your user id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
              <button type="submit">Log in</button>
            </form>
            {loginError && <p className="error-text">{loginError}</p>}
          </div>

          <div className="auth-card">
            <h2>New here? Register</h2>
            <RegisterForm onRegistered={setCurrentUser} />
          </div>
        </div>
      )}

      {currentUser && currentUser.role === "CANDIDATE" && (
        <CandidateView currentUser={currentUser} />
      )}

      {currentUser && currentUser.role === "RECRUITER" && (
        <RecruiterView currentUser={currentUser} />
      )}
    </div>
  );
}

export default App;