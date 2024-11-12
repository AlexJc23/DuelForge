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
import EventDetails from '../components/EventDetails/EventDetails';
import CreateEvent from '../components/CreateEvent/CreateEvent';
import EditEvent from '../components/EditEvent/EditEvent';
import CreateDeck from '../components/CreateDeck';
import UpdateDeck from '../components/EditDeck';
import UserProfile from '../components/UserProfile';


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
          {
            path: 'create',
            element: <CreateDeck />
          },
          {
            path: ':deck_id/update',
            element: <UpdateDeck />
          }

        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            element: <AllEvents />
          },
          {
            path: ':event_id',
            element: <EventDetails />
          },
          {
            path: 'create',
            element: <CreateEvent />
          },
          {
            path: ':event_id/update',
            element: <EditEvent />
          }
        ]
      },
      {
        path: 'profile',
        element: <LoggedinUserContent />
      },
      {
        path: 'profile/:user_id',
        element: <UserProfile />
      }
    ],
  },
]);
