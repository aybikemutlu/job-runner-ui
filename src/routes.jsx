import { createBrowserRouter } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import RunCommand from './pages/RunCommand';
import RunCrawler from './pages/RunCrawler';
import Runs from './pages/Runs';
import Urls from './pages/Urls';
import RunDetail from './pages/RunDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'run-command', element: <RunCommand /> },
      { path: 'run-crawler', element: <RunCrawler /> },
      { path: 'runs', element: <Runs /> },
      { path: 'runs/:id', element: <RunDetail /> },
      { path: 'urls', element: <Urls /> }
    ],
  },
]);
