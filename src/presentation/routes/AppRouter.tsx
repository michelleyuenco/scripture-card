import { Route, Routes } from 'react-router-dom';
import {
  AdminEditorPage,
  AdminPage,
  LandingPage,
  NotFoundPage,
  ReadingPage,
  SignInPage,
} from '@presentation/pages';
import { AdminGate } from '@presentation/components';

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/read/:month/:day" element={<ReadingPage />} />
    <Route path="/sign-in" element={<SignInPage />} />
    <Route
      path="/admin"
      element={
        <AdminGate>
          <AdminPage />
        </AdminGate>
      }
    />
    <Route
      path="/admin/:month/:day"
      element={
        <AdminGate>
          <AdminEditorPage />
        </AdminGate>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
