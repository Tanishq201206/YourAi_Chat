import React from 'react';
import '../CSS/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Home() {
  const nav = useNavigate();
  const { authenticated } = useAuth();

  return (
    <div className="home-root">
      {/* Header */}
      <header>
        <div>
          <strong>YourAI Chat</strong>
        </div>
        <nav aria-label="header-actions">
          {authenticated ? (
            <button onClick={() => nav('/app')}>Open App</button>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>

      </header>

      {/* Body: left rail + main */}
      <div>
        <main>
          {/* Hero */}
          <section aria-labelledby="hero-title">
            <p>September 2025 · Product</p>
            <h1 id="hero-title">Introducing YourAI Chat</h1>
            <div>
              <Link to="/app">Try Chat</Link>
            </div>
            <div>
              <Link to="/register">Register</Link>
            </div>
          </section>

          <hr />

          {/* Article-ish content */}
          <section id="research">
            <h2>Research</h2>
            <p>Our chatbot is powered by cutting-edge research in artificial intelligence and natural language processing. By leveraging advanced models and continuous learning, it adapts to provide accurate, context-aware, and human-like conversations. We actively explore new AI innovations to make interactions smarter, faster, and more reliable.</p>
          </section>

          <section id="safety">
            <h2>Safety</h2>
            <p>Safety is our top priority. The chatbot is designed with built-in safeguards to prevent misuse, ensure respectful interactions, and protect user data. All communications follow strict privacy guidelines, and sensitive information is handled securely to build trust and reliability.</p>
          </section>

          <section id="business">
            <h2>For Business</h2>
            <p>Boost customer engagement, streamline support, and improve efficiency with our AI-driven chatbot. Whether it’s answering queries, automating workflows, or providing instant assistance, our chatbot helps businesses reduce costs while enhancing customer satisfaction and productivity.</p>
          </section>

          <section id="developers">
            <h2>For Developers</h2>
            <p>Developers can seamlessly integrate the chatbot into websites, apps, or internal systems with our simple API and SDKs. We provide clear documentation, sample code, and customization options so you can tailor the chatbot to your unique use case and scale it effortlessly.</p>
          </section>
        </main>
      </div>

      {/* Footer (simple) */}
      <footer>
        <nav aria-label="footer">
          <ul>
            <li><a href="/company">Company</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/terms">Terms</a></li>
          </ul>
        </nav>
        <small aria-label="footer">© 2025 YourAI — All rights reserved</small>
      </footer>
    </div>
  );
}
