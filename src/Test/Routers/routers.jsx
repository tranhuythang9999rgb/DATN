import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,  // Thay thế Switch bằng Routes
  Link,
  useParams,
} from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Home Page</h2>
    <p>Welcome to the home page!</p>
  </div>
);

const About = () => (
  <div>
    <h2>About Page</h2>
    <p>This is the about page.</p>
  </div>
);

const Contact = () => (
  <div>
    <h2>Contact Page</h2>
    <p>You can contact us here.</p>
  </div>
);

const UserProfile = () => {
  const { id } = useParams();
  return (
    <div>
      <h2>User Profile</h2>
      <p>User ID: {id}</p>
    </div>
  );
};

const NotFound = () => (
  <div>
    <h2>404 - Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/user/123">User Profile</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </Router>
);

export default AppRouter;
