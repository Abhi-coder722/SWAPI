import React from 'react';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import logo from '../images/logo.png';
import { Grid} from '@mui/material';

function Header() {
  return (
    <>

        <AppBar
          position="sticky"
          color="default"
          elevation={0}
          sx={{
            backgroundColor: '#FFFFFF',
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
              bgcolor:'#fafafa'
          }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <a href="https://www.starwars.com/">
              <img
                src={logo}
                style={{ height: '55px', paddingLeft: '0px', paddingTop: '0px', paddingRight: '0px' }}
                alt="Logo"
              />
            </a>

            <Grid item xs={12} sx={{ justifyContent: 'center', flexGrow: 1 }}>
              <Typography
                variant="h6"
                color="#777777"
                noWrap
                sx={{
                  fontSize: '12px',
                  marginTop: '6px',
                  lineHeight: '21px',
                  fontWeight: '400',
                  letterSpacing: '1.5px',
                }}>
                STAR WARS Characters 🚀
              </Typography>
            </Grid>
          </Toolbar>
        </AppBar>
    </>
  );
}

export default Header;
