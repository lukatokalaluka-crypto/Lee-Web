import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebook,
  FaWhatsapp,
  FaMusic,
  FaVideo,
  FaTools,
  FaUser,
} from "react-icons/fa";
import leewayCf from "../assets/leewayCf.jpg";

export default function About() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: "160px" }} />

      <div className="container py-5">
        {/* Intro Section */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">About Your Soundtrack, Your Way</h2>
          <p className="lead text-muted">
            Your Soundtrack, Your Way is a platform dedicated to empower artist, amplifying voices and curating the soundtrack of tomorrow.
          </p>
          <hr className="w-25 mx-auto" />
        </div>

        {/* Profile Card */}
        <div className="card shadow-sm mb-5 border-0">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-3 mb-md-0">
                <img
                  src={leewayCf}
                  alt="Lukato Kalaluka"
                  className="img-fluid rounded-circle border border-3"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-8">
                <h3 className="card-title mb-3">
                  <FaUser className="me-2" />
                  About Me
                </h3>
                <p>
                  My name is <strong>Lukato Kalaluka</strong>, known in the artistic space as <strong>LeewayCf The Prod.</strong>.
                  I’m a multitalented creator, performer, and entrepreneur based in Zambia, driven by passion and purpose.
                  At the heart of my journey is <strong>Your Soundtrack, Your Way</strong>, where I serve as a
                  <strong> music producer</strong>, <strong>Musicasistant</strong>, and <strong>self song-writter</strong>.
                </p>
                <p>
                  With over <strong>three years of experience in repair services</strong>, I’ve built a reputation for precision and reliability—whether it’s fixing software installation, studio gear, or everyday devices.
                </p>
              </div>
            </div>

            {/* Services */}
            <h5 className="mt-4">Services I Offer</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <FaMusic className="me-2 text-primary" />
                Music Production – Crafting beats, recording, and mixing
              </li>
              <li className="list-group-item">
                <FaUser className="me-2 text-success" />
                Live vibe – Enhances energy and emotion to every stage
              </li>
              <li className="list-group-item">
                <FaVideo className="me-2 text-danger" />
                Content writer – Represent stories through visuals
              </li>
              <li className="list-group-item">
                <FaTools className="me-2 text-warning" />
                Repair Services – Restoring functionality with care
              </li>
            </ul>
            <p className="mt-3">
              As a music producer, I count on building a tie between talent and recreations.
              This platform is not only a blog—it’s a site for unity, sympathize, and create.
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="card bg-light border-0 mb-5">
          <div className="card-body">
            <h4 className="card-title mb-3">Contact Us</h4>
            <ul className="list-unstyled">
              <li>
                <FaEnvelope className="me-2 text-dark" />
                Email: <a href="mailto:chrisfanwell27@gmail.com">chrisfanwell27@gmail.com</a>
              </li>
              <li>
                <FaPhoneAlt className="me-2 text-dark" />
                Phone: <a href="tel:+260972941849">+260-0763464067</a>
              </li>
              <li>
                <FaWhatsapp className="me-2 text-success" />
                WhatsApp:{" "}
                <a
                  href="https://wa.me/260763464067"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat with LeewayCf
                </a>
              </li>
              <li>
                <FaFacebook className="me-2 text-primary" />
                Social: <strong>YOUR SOUNDTRACK YOUR WAY</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Testimonials */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body">
            <h4 className="card-title mb-4 text-center">💬 Testimonials</h4>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              <div className="col">
                <div className="border rounded p-3 h-100 bg-light">
                    <p className="mb-2">
                    “Working with LeewayCf was a game-changer. His beats are fresh, his energy is unmatched, and his professionalism is top-tier.”
                  </p>
                  <div className="text-end text-muted small">— Sichaliso Makandauko, Vocalist</div>
                </div>
              </div>
              <div className="col">
                <div className="border rounded p-3 h-100 bg-light">
                  <p className="mb-2">
                    “Your Soundtrack Your Way helped me bring my story to life. The visuals, the sound, the vibe — everything was on point.”
                  </p>
                  <div className="text-end text-muted small">— Mr Dean, Spoken Word Artist</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted small">
          <p>
            &copy; {currentYear} Your Soundtrack Your Way. Designed by{" "}
            <strong>Reutech Hub Innovations</strong>.
          </p>
        </footer>
      </div>
    </>
  );
}
