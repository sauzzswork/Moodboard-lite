import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [todayMoodBoard, setTodayMoodBoard] = useState(null);
  const [allMoodBoards, setAllMoodBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodBoards();
    // eslint-disable-next-line
  }, []);

  const fetchMoodBoards = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch today's moodboard
      try {
        const todayResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/moodboards/today`,
          { headers }
        );
        setTodayMoodBoard(todayResponse.data);
      } catch (err) {
        setTodayMoodBoard(null);
      }

      // Fetch all moodboards
      const allResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/moodboards`,
        { headers }
      );
      setAllMoodBoards(allResponse.data);
    } catch (err) {
      setError('Failed to load moodboards');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this MoodBoard?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/moodboards/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllMoodBoards(allMoodBoards.filter(mb => mb._id !== id));
        if (todayMoodBoard && todayMoodBoard._id === id) {
          setTodayMoodBoard(null);
        }
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your MoodBoard Dashboard</h1>
      {/* Today's MoodBoard Section */}
      <section className="today-section">
        <h2>Today's MoodBoard</h2>
        {todayMoodBoard ? (
          <div>
            <div>
              {todayMoodBoard.emojis.map((emoji, idx) => (
                <span key={idx}>{emoji}</span>
              ))}
            </div>
            <img src={todayMoodBoard.imageUrl} alt="Today's mood" />
            <p>{todayMoodBoard.note}</p>
            <button
              className="btn-delete"
              onClick={() => handleDelete(todayMoodBoard._id)}
            >
              Delete
            </button>
          </div>
        ) : (
          <div>
            <p>You haven't created a MoodBoard today yet!</p>
            <Link to="/create" className="btn-primary">
              Create Today's MoodBoard
            </Link>
          </div>
        )}
      </section>
      {/* Timeline Section */}
      <section className="timeline-section">
        <h2>Your MoodBoard Timeline</h2>
        {allMoodBoards.length > 0 ? (
          <div>
            {allMoodBoards.map((board) => (
              <div key={board._id} className="timeline-card">
                <div>{formatDate(board.date)}</div>
                <div>
                  <div>
                    {board.emojis.map((emoji, idx) => (
                      <span key={idx}>{emoji}</span>
                    ))}
                  </div>
                  <img src={board.imageUrl} alt="Mood" />
                  <p>{board.note}</p>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(board._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No MoodBoards yet. Start creating your daily mood journal!</p>
        )}
      </section>
      {error && <div style={{ color: "#d32f2f", fontWeight: "bold" }}>{error}</div>}
    </div>
  );
};

export default Dashboard;
