import React from 'react'
import { Container, AppBar, Paper, Typography, Toolbar, IconButton, Box , Avatar, Button} from '@mui/material'
import {BookOnlineSharp} from '@mui/icons-material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useThemeContext } from '../context/ThemeContext'
import { useUserContext } from '../context/UserContext'



const Layout = ({children}: {children: React.ReactNode}) => {
    const {logout, user} = useUserContext()
    console.log(user)
    const {mode, toggleTheme}= useThemeContext()
  return (
    <Container maxWidth="lg" sx={{bgcolor: 'background.default'}}>
        <AppBar>
            <Toolbar disableGutters>
                <Paper elevation={0} sx={{display: 'flex', flexDirection: 'row',p:2, justifyContent: 'space-between', width: '100%', bgcolor: 'background.paper', borderRadius: 0}} >
                    <Box sx={{display: 'flex', alignItems: 'center'
                    }}>
                        <IconButton>
                            <BookOnlineSharp/>
                        </IconButton>
                         <Typography component='a'>JobTracker</Typography>
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Avatar>S</Avatar>
                        <Typography>{user?.name}</Typography>

                          <Button variant='outlined' sx={{color: 'text.primary', ml:2}} onClick={()=>logout()}>
                        Logout
                    </Button>

                    <IconButton onClick={toggleTheme}>{mode === 'light' ? <LightModeIcon/> : <DarkModeIcon/>}</IconButton>
                    </Box>
        
                   
                </Paper>
            </Toolbar>
        </AppBar>

        <Box>
            <Toolbar></Toolbar>
             {children}
        </Box>

       

    </Container>
   
  )
}

export default Layout
