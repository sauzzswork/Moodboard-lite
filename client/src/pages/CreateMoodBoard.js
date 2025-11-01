import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { GiphyFetch } from '@giphy/js-fetch-api';
import axios from 'axios';

const giphyFetch = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || 'YOUR_KEY');

const CreateMoodBoard = () => {
  const [formData, setFormData] = useState({
    emojis: [],
    imageUrl: '',
    color: '#FF6B6B',
    note: ''
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGiphySearch, setShowGiphySearch] = useState(false);
  const [giphySearchTerm, setGiphySearchTerm] = useState('');
  const [giphyResults, setGiphyResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmojiSelect = (emoji) => {
    if (formData.emojis.length < 5) {
      setFormData({
        ...formData,
        emojis: [...formData.emojis, emoji.native]
      });
    }
    setShowEmojiPicker(false);
  };

  const removeEmoji = (index) => {
    const newEmojis = formData.emojis.filter((_, i) => i !== index);
    setFormData({ ...formData, emojis: newEmojis });
  };

  const searchGiphy = async () => {
    try {
      const result = await giphyFetch.search(
        giphySearchTerm,
        { limit: 10 }
      );
      setGiphyResults(result.data);
    } catch (err) {
      console.error('Giphy search error:', err);
    }
  };

  const selectGif = (gif) => {
    setFormData({
      ...formData,
      imageUrl: gif.images.fixed_height.url
    });
    setShowGiphySearch(false);
    setGiphyResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.emojis.length === 0) {
      setError('Please select at least one emoji');
      return;
    }
    if (!formData.imageUrl) {
      setError('Please select a GIF or provide image URL');
      return;
    }
    if (formData.note.length > 200) {
      setError('Note must be 200 characters or less');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/moodboards`, // use env variable here
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to create MoodBoard'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-center">
      <div className="login-card">
        <h2 style={{ marginBottom: '1rem' }}>Create Your Daily MoodBoard</h2>
        {error && <div style={{
          color: "#d32f2f",
          marginBottom: "0.8rem",
          fontWeight: "bold",
          fontSize: "1rem"
        }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Emoji Selection */}
          <label>Select Emojis (up to 5)</label>
          <div style={{ display: 'flex', gap: '0.4em', marginBottom: '0.7em', flexWrap: 'wrap' }}>
            {formData.emojis.map((emoji, index) => (
              <span key={index} style={{
                fontSize: "1.8em", background: "#f3eefd", padding: "4px 8px",
                borderRadius: "1em", boxShadow: "0 0 4px #ccc", position: 'relative'
              }}>
                {emoji}
                <button
                  type="button"
                  onClick={() => removeEmoji(index)}
                  style={{
                    marginLeft: "2px",
                    fontSize: "0.9em",
                    color: "#d32f2f",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer"
                  }}
                  aria-label="Remove emoji"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn-secondary"
              style={{ marginLeft: "0.6em", padding: "0.4em 1.1em", borderRadius: "0.6em", background: "#e1e2fd", color: "#383989", fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              {showEmojiPicker ? 'Close Picker' : 'Add Emoji'}
            </button>
          </div>
          {showEmojiPicker && (
            <div style={{ marginBottom: '1em', background: "#fff", borderRadius: "1em", boxShadow: "0 2px 14px #bdbdbd22", padding: "1em" }}>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}

          {/* GIF/Image Selection */}
          <label>Select GIF or Image</label>
          <div style={{ marginBottom: '0.6em' }}>
            {formData.imageUrl && (
              <div style={{
                padding: "8px 0", marginBottom: "0.6em"
              }}>
                <img src={formData.imageUrl} alt="Selected GIF or Image" style={{
                  maxHeight: "120px", borderRadius: "0.7em", boxShadow: "0 1px 12px #bdbdbd30"
                }} />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowGiphySearch(!showGiphySearch)}
              className="btn-secondary"
              style={{ marginBottom: "0.3em", marginRight: "1.1em", background: "#ccecfb", color: "#2c4561", fontWeight: 600, border: "none", borderRadius: "0.5em", padding: "0.39em 1em", cursor: "pointer" }}
            >
              {showGiphySearch ? 'Close Giphy' : 'Search Giphy'}
            </button>
            {showGiphySearch && (
              <div style={{
                background: "#fafbff", margin: "0.5em 0", borderRadius: "0.7em", padding: "1em", boxShadow: "0 1px 14px #bdbdbd1a"
              }}>
                <input
                  type="text"
                  placeholder="Search for GIFs..."
                  value={giphySearchTerm}
                  onChange={(e) => setGiphySearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchGiphy()}
                  style={{ fontSize: "1em", padding: "0.7em 1em", marginRight: "0.7em", borderRadius: "0.4em", border: "1px solid #bdbdbd", width: "50%" }}
                />
                <button type="button" onClick={searchGiphy}
                  style={{ background: "#6c63ff", color: "#fff", border: "none", fontWeight: 600, borderRadius: "0.4em", padding: "0.6em 1.2em", cursor: "pointer" }}
                >Search</button>
                <div style={{ display: "flex", gap: "0.7em", marginTop: "1em", flexWrap: "wrap" }}>
                  {giphyResults.map((gif) => (
                    <img
                      key={gif.id}
                      src={gif.images.fixed_height_small.url}
                      alt={gif.title}
                      onClick={() => selectGif(gif)}
                      style={{ cursor: 'pointer', margin: '0.2em', borderRadius: "0.7em", boxShadow: "0 0 6px #c5c5fd" }}
                    />
                  ))}
                </div>
              </div>
            )}
            <label style={{ marginTop: "0.6em", display: "block" }}>Or paste image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageUrl: e.target.value
                })
              }
              placeholder="https://example.com/image.gif"
              style={{ fontSize: "1em", padding: "0.7em 1em", borderRadius: "0.4em", border: "1px solid #bdbdbd", width: "100%", marginBottom: "0.5em" }}
            />
          </div>

          {/* Color Selection */}
          <label>Choose a Color Theme</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8em", marginBottom: "0.8em" }}>
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  color: e.target.value
                })
              }
              className="color-picker"
              style={{ width: "2.3em", height: "2.3em", borderRadius: "1em", border: "none", boxShadow: "0 2px 8px #bdbdbd22" }}
            />
            <span style={{ fontWeight: "500", color: "#383989" }}>{formData.color}</span>
          </div>

          {/* Note */}
          <label>
            Write a Note ({formData.note.length}/200)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) =>
              setFormData({
                ...formData,
                note: e.target.value
              })
            }
            maxLength="200"
            placeholder="How are you feeling today?"
            rows="4"
            required
            style={{ width: "100%", padding: "1em", fontSize: "1.1em", borderRadius: "0.5em", border: "1px solid #bdbdbd", marginBottom: "1.1em" }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", fontSize: "1.2em", marginTop: "1em" }}
          >
            {loading ? 'Creating...' : 'Create MoodBoard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMoodBoard;
