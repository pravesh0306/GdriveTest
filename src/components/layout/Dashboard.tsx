import { Navigate } from 'react-router-dom';

// Redirect to Orders page as it now serves as the main dashboard
const Dashboard = () => {
  return <Navigate to="/orders" replace />;
};

export default Dashboard;
