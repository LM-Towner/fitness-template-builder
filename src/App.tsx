import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { ClientProfile } from './pages/ClientProfile';
import WorkoutPlanner from './pages/WorkoutPlanner';
import { TemplateManagerPage } from './pages/TemplateManagerPage';
import { MainLayout } from './components/MainLayout';
import { ClientList } from './pages/ClientList';
import { ScheduleManager } from './pages/ScheduleManager';
import { AddClient } from './pages/AddClient';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <MainLayout>
                      <ClientList />
                    </MainLayout>
                  }
                />
                <Route
                  path="/clients/new"
                  element={
                    <MainLayout>
                      <AddClient />
                    </MainLayout>
                  }
                />
                <Route
                  path="/clients/:id"
                  element={
                    <MainLayout>
                      <ClientProfile />
                    </MainLayout>
                  }
                />
                <Route
                  path="/workout-planner"
                  element={
                    <MainLayout>
                      <WorkoutPlanner />
                    </MainLayout>
                  }
                />
                <Route
                  path="/templates"
                  element={
                    <MainLayout>
                      <TemplateManagerPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <MainLayout>
                      <ScheduleManager />
                    </MainLayout>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
