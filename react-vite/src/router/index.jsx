import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage/HomePage';
import Layout from './Layout';
import AllDecksPage from '../components/AllDecksPage/AllDecksPage';
import DeckDetails from '../components/DeckDetails/DeckDetails';
import LoggedinUserContent from '../components/LoggedinUserContent/LoggedinUserContent';
import Landing from '../components/LandingPage';
import AllEvents from '../components/AllEventsPage/AllEvents';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/home",
        element: <HomePage />
      },
      {
        path: 'decks',
        children: [
          {
            path: '',
            element: <AllDecksPage />
          },
          {
            path: ':deck_id',
            element: <DeckDetails />
          },

        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            element: <AllEvents />
          }
        ]
      },
      {
        path: 'userpage',
        element: <LoggedinUserContent />
      }
    ],
  },
]);
