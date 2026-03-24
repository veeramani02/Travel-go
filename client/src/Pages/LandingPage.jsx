import { useEffect, useState } from "react";
import "../Styles/LandingPage.css";
import { useNavigate } from "react-router-dom";
import img2 from "../assets/Family2.jpg";
import img1 from "../assets/Friends.png";
import img3 from "../assets/Couple.png";
import img4 from "../assets/solo.jpg";

function LandingPage() {

  const slides = [
    { image: img4, text: "Solo Traveller - Explore Your Freedom" },
    { image: img2, text: "Family Trips - Safe & Comfortable Rides" },
    { image: img1, text: "Friends Trip - Travel Together, Enjoy More" },
    { image: img3, text: "Couple Rides - Private & Romantic Journey" }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate(); 

  return (
    <div className="landing-container">

      <div
        className="hero"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="overlay">
          <h1>{slides[current].text}</h1>
          <button className="book-btn" onClick={()=>navigate("/login")}>Let's start your journey</button>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;
