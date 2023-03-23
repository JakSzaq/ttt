import React from 'react'
import { Button, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ThemeButton: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button w={[35,75]} h={[35,75]} borderRadius={50} size='sm' position='absolute' top={6} right={6} onClick={toggleColorMode}>
        {colorMode === 'light' ? <SunIcon w={[5,10]} h={[5,10]}/> : <MoonIcon w={[5,10]} h={[5,10]}/>}
    </Button>
  )
}

export default ThemeButton