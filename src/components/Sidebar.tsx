// import {Drawer,Box,Typography,List, Avatar} from '@mui/material'


// export default Sidebar = ()=> {
//         return (
//             <Drawer
//                 variant="permanent"
//                 sx={{
//                     width: 220,
//                     flexShrink: 0,
//                     "& .MuiDrawer-paper": {
//                         width: 220,
//                         boxSizing: "border-box",

//                         height: "100%",
//                         overflow: "hidden",
//                     },
//                 }}
//             >
//                 {/* Logo */}
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: "18px", pt: "20px", pb: "24px" }}>
//                     <Box
//                         sx={{
//                             width: 28,
//                             height: 28,
                            
//                             borderRadius: "7px",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 13,
//                             fontWeight: 700,
//                             color: "#fff",
//                             flexShrink: 0,
//                         }}
//                     >
//                         J
//                     </Box>
//                     <Typography sx={{ fontWeight: 800, fontSize: 15, color: t.text, letterSpacing: "-0.02em" }}>
//                         JobTracker
//                     </Typography>
//                 </Box>

//                 {/* Nav label */}
//                 <Typography
//                     sx={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: t.text3, px: "18px", mb: "6px" }}
//                 >
//                     Menu
//                 </Typography>

//                 {/* Nav items */}
//                 <List disablePadding sx={{ px: "12px" }}>
                  
//                 </List>

//                 {/* Footer */}
//                 <Box sx={{ mt: "auto", borderTop: `1px solid ${t.border}`, pt: "14px", px: "12px", pb: "16px" }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: "10px", px: "10px", py: "8px", borderRadius: "8px", cursor: "pointer" }}>
//                         <Avatar
//                             sx={{
//                                 width: 30,
//                                 height: 30,
//                                 background: `linear-gradient(135deg, ${t.accent}, #a855f7)`,
//                                 fontSize: 12,
//                                 fontWeight: 700,
//                             }}
//                         >
//                             A
//                         </Avatar>
//                         <Box>
//                             <Typography sx={{ fontSize: 13, fontWeight: 500, color: t.text }}>Alex Dev</Typography>
//                             <Typography sx={{ fontSize: 11, color: t.text3 }}>Free plan</Typography>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Drawer>
//         );
//     }
