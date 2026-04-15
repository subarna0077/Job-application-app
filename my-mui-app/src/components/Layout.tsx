import React from 'react'
import { Container, AppBar, Stack, Typography, Toolbar, IconButton, Box , Avatar, Button} from '@mui/material'
import {BookOnlineSharp} from '@mui/icons-material'
import { useUserContext } from '../context/UserContext'


const Layout = ({children}: {children: React.ReactNode}) => {
    const {logout, user} = useUserContext()
  return (
    <Container maxWidth="lg" sx={{bgcolor: 'white'}}>
        <AppBar>
            <Toolbar>
                <Stack>
                    <Box sx={{display: 'flex', alignItems: 'center'
                    }}>
                        <IconButton>
                            <BookOnlineSharp/>
                        </IconButton>
                         <Typography component='a'>JobTracker</Typography>
                    </Box>

                    <Box sx={{display: 'flex'}}>
                        <Avatar>S</Avatar>
                        <Typography>{user?.name}</Typography>
                    </Box>

                    <Button variant='outlined' sx={{color: 'black'}} onClick={()=>logout()}>
                        Logout
                    </Button>
                   
                </Stack>
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
