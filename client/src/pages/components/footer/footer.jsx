import React from 'react';
import './footer.css'; // Import your CSS Module

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="footerCol">
            <h4>company</h4>
            <ul>
              <li><a href="/">about us</a></li>
              <li><a href="/">our services</a></li>
              <li><a href="/">privacy policy</a></li>
              <li><a href="/">affiliate program</a></li>
            </ul>
          </div>
         
          
          <div className="footerCol">
            <h4>follow us</h4>
            <div className="socialLinks">
              <a href="/"><i className="fab fa-facebook-f"></i></a>
              <a href="/"><i className="fab fa-twitter"></i></a>
              <a href="/"><i className="fab fa-instagram"></i></a>
              <a href="/"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
