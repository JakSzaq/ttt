import { Routes, Route } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import LobbyScreen from './pages/LobbyScreen';
import GameScreen from './pages/GameScreen';
import NotFoundScreen from './pages/NotFoundScreen';
import { ActionButton } from './components/ActionButton';
import { Footer } from './components/Footer';

function App(): JSX.Element {
  return (
      <Container p={0} pt={6} position='relative' maxW='full' h='100vh' bg='transparent'>
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/room" element={<GameScreen />} />
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
        <ActionButton type="themeSwitch"/>
        <Footer />
      </Container>
  )
}

export default App
