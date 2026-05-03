const jsonServer = require('json-server');
const auth = require('json-server-auth');
const axios = require('axios');
const cors = require('cors')
require('dotenv').config();

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.db = router.db; // required for json-server-auth to work

app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(jsonServer.bodyParser);

// JSearch proxy route

// Here we 

// when the user make a get request on localhost:3001/api/jobs?role=react&location=ne, then backend get the
// axios.get to talk to the server

/*
This prevent from leaking the actual api key to the browser.
*/

// Here we set the role = 'developer' , location = 'nepal" doesnt mean backend decides the valeue
// It mean use the frontend values if provided otherwise fallback to default
app.get('/api/jobs', async (req, res) => {
  const {
    role = 'junior developer',
    location = "united states",
    datePosted = "week",
    country = 'us',
    page = "1",
    numPages = "1",
    remote = "true",
    employmentType = '',
  } = req.query;


  console.log({role, location, datePosted, remote, employmentType})

  try {
    const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${role} jobs in ${location}`,
        location,
        country,
        page,
        num_pages: numPages,
        date_posted: datePosted,
        work_from_home: remote=== "true" ? true : false,
        employment_types: employmentType ? employmentType : undefined
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });
    res.json({jobs: data.data, cursor: data.cursor ?? null});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
    console.log(error)
  }
});

app.get('/api/job-detail', async (req, res) => {

  const {job_id, country="us"} = req.query;

  if(!job_id) {
    return res.status(400).json({error: 'job_id is required'})
  }
  try {
    const { data } = await axios.get('https://jsearch.p.rapidapi.com/job-details', {
      params: {
        job_id,
        country
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });
    res.json({jobs: data.data})
  }
  catch(error){
    res.status(500).json({error: 'Failed to fetch single job'})
  }
})

// auth must be before router
app.use(middlewares);

app.use(auth);
app.use(router);

app.listen(3001, () => {
  console.log('JSON Server Auth + Jobs proxy running on port 3001');
});