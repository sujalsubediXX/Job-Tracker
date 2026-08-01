import { Navigate, Route, Routes } from 'react-router-dom';
import { ApplicationListPage } from './pages/ApplicationListPage';
import { AddApplicationPage } from './pages/AddApplicationPage';
import { EditApplicationPage } from './pages/EditApplicationPage';
import { ViewApplicationPage } from './pages/ViewApplicationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ApplicationListPage />} />
      <Route path="/applications/new" element={<AddApplicationPage />} />
      <Route path="/applications/:id" element={<ViewApplicationPage />} />
      <Route path="/applications/:id/edit" element={<EditApplicationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;