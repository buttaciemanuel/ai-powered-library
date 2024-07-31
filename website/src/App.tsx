import { ThemeProvider } from '@mui/material';

import './styles/App.css';

import BooksPage from './pages/BooksPage';
import { theme } from './themes/defaultTheme';

function App() {
  return <ThemeProvider theme={theme}>
    <BooksPage />
  </ThemeProvider>;
}

export default App;
