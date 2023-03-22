import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LobbyScreen from './pages/LobbyScreen';
import GameScreen from './pages/GameScreen';
import { Container } from '@chakra-ui/react';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
      <Container p={0} pt={6} maxW='full' h='100vh' bg='transparent'>
        <Routes>
          <Route path="/" element={<LobbyScreen />} />
          <Route path="/room" element={<GameScreen />} />
        </Routes>
      </Container>
  )
}

export default App
