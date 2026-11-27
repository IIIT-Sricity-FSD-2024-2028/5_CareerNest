// Data Flow (App.jsx):
// Presentational component receiving Redux-backed data and dispatch callbacks as props from its parent container.
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
