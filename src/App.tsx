import { AppRouter } from './router/AppRouter'
import { useAuthStore } from './context/userStore'
import {useEffect} from 'react'
//Implement the theme
// Complete the dashboard
// Work on the dataflow
// Work on the forms and validation
// Improve the form styling


//my confusion on apr 17
// learn how the errors work in typography -> behidn the scene
// what do useForm actually return here
// while destructuring, how do renaming the object key work
// learn the way how to direct login after register? Work on that
// Improve on error handling (deep dive)
// Learn about more ways of passing error rather than a single error we are passing at the moment.
// finish the stats bar

// after this phase 2 completed
// deploy tomorrow

// learn the concept of zustand/redux
// learn about the possibilties of more expansion of this project
// learn about how can we improve the ai integration and stuffs


function App() {
  const initialize = useAuthStore(set=> set.initialize)

  useEffect(()=>{
    initialize()
  })

  return (
      <AppRouter />
  )
}

export default App
