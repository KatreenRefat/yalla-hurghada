// src/components/TravelGuide/TravelGuide.jsx
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./TravelGuide.css";

const API_URL = "http://localhost:5000/api"; // غيري حسب البورت بتاعك

export default function TravelGuide() {
  const [formData, setFormData] = useState({
    budget: 200,
    currency: "USD",
    duration: "3 أيام",
    location: "الغردقة",
    tripType: "عائلات",
    interests: [],
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const interestsList = [
    { id: "بحر", icon: "🏖️", label: "بحر وشواطئ" },
    { id: "صحراء", icon: "🏜️", label: "صحراء وسفاري" },
    { id: "تاريخي", icon: "🏛️", label: "تاريخي وآثار" },
    { id: "ترفيه", icon: "🎢", label: "ترفيه وأنشطة" },
    { id: "غطس", icon: "🤿", label: "غطس ورياضات بحرية" },
    { id: "تسوق", icon: "🛍️", label: "تسوق" },
  ];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/travel-guide/recommend`, {
        budget: Number(formData.budget),
        currency: formData.currency,
        duration: formData.duration,
        location: formData.location,
        tripType: formData.tripType,
        interests: formData.interests,
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "حدث خطأ في الاتصال بالخادم. حاولي مرة أخرى."
      );
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-guide-container">
      <div className="header">
        <h1>🌴 مرشدك السياحي الذكي - الغردقة</h1>
        <p>أدخلي ميزانيتك واهتماماتك، ونخططلك رحلة لا تُنسى!</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* الميزانية */}
        <div className="form-group">
          <label>💰 الميزانية</label>
          <div className="budget-input">
            <input
              type="number"
              min="1"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              required
            />
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
            >
              <option value="USD">$ دولار</option>
              <option value="EGP">ج.م جنيه مصري</option>
            </select>
          </div>
        </div>

        {/* مدة الرحلة */}
        <div className="form-group">
          <label>📅 مدة الرحلة</label>
          <select
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          >
            <option value="يوم واحد">يوم واحد</option>
            <option value="يومين">يومين</option>
            <option value="3 أيام">3 أيام</option>
            <option value="5 أيام">5 أيام</option>
            <option value="أسبوع">أسبوع</option>
          </select>
        </div>

        {/* نوع الرحلة */}
        <div className="form-group">
          <label>👥 نوع الرحلة</label>
          <div className="trip-type-buttons">
            {["عائلات", "أزواج", "أصدقاء", "سولو"].map((type) => (
              <button
                key={type}
                type="button"
                className={formData.tripType === type ? "active" : ""}
                onClick={() => setFormData({ ...formData, tripType: type })}
              >
                {type === "عائلات" && "👨‍👩‍👧‍👦"}
                {type === "أزواج" && "💑"}
                {type === "أصدقاء" && "👫"}
                {type === "سولو" && "🧳"} {type}
              </button>
            ))}
          </div>
        </div>

        {/* الاهتمامات */}
        <div className="form-group">
          <label>🎯 اهتماماتك</label>
          <div className="interests-grid">
            {interestsList.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  formData.interests.includes(item.id) ? "active" : ""
                }
                onClick={() => handleInterestToggle(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          className="submit-btn"
          disabled={loading || formData.interests.length === 0}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              جاري تخطيط رحلتك...
            </>
          ) : (
            "🎯 اقترح لي خطة!"
          )}
        </button>
      </form>

      {/* رسالة الخطأ */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* النتيجة */}
      {result?.success && (
        <div className="result-card">
          <h2>📋 خطتك السياحية المخصصة</h2>
          
          <div className="plan-content">
            <ReactMarkdown>{result.plan}</ReactMarkdown>
          </div>

          <div className="places-section">
            <h3>🏖️ الأماكن المقترحة</h3>
            <div className="places-grid">
              {result.places.map((place, index) => (
                <div key={index} className="place-card">
                  <div className="place-number">{index + 1}</div>
                  <div className="place-info">
                    <h4>{place.name}</h4>
                    <span className="category">{place.category}</span>
                    <span className="price">
                      {place.price === 0
                        ? "🆓 مجاني"
                        : place.price + " " + formData.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="total-estimate">
            <strong>💵 التكلفة التقديرية الإجمالية:</strong>{" "}
            {result.places.reduce((sum, p) => sum + (p.price || 0), 0)}{" "}
            {formData.currency}
          </div>
        </div>
      )}
    </div>
  );
}