import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage/HomePage';
import Layout from './Layout';
import AllDecksPage from '../components/AllDecksPage/AllDecksPage';
import DeckDetails from '../components/DeckDetails/DeckDetails';
import LoggedinUserContent from '../components/LoggedinUserContent/LoggedinUserContent';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
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
          {
            path: 'userpage',
            element: <LoggedinUserContent />
          }
        ]
      }
    ],
  },
]);
