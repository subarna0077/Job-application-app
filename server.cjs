const jsonServer = require('json-server');
const auth = require('json-server-auth');
const axios = require('axios');
const cors = require('cors')
require('dotenv').config();

const app = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

app.db = router.db;

// ✅ allow both local dev and Vercel
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(jsonServer.bodyParser);

app.get('/api/jobs', async (req, res) => {
  const {
    role = 'junior developer',
    location = 'united states',
    datePosted = 'week',
    country = 'us',
    page = '1',
    numPages = '1',
    remote = 'true',
    employmentType = '',
  } = req.query;

  try {
    const { data } = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${role} jobs in ${location}`,
        location,
        country,
        page,
        num_pages: numPages,
        date_posted: datePosted,
        work_from_home: remote === 'true' ? true : false,
        employment_types: employmentType ? employmentType : undefined
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });
    res.json({ jobs: data.data, cursor: data.cursor ?? null });
  } catch (error) {
    console.error(error?.response?.data ?? error.message)
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/job-detail', async (req, res) => {
  const { job_id, country = 'us' } = req.query;

  if (!job_id) {
    return res.status(400).json({ error: 'job_id is required' })
  }

  try {
    const { data } = await axios.get('https://jsearch.p.rapidapi.com/job-details', {
      params: { job_id, country },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });
    res.json({ jobs: data.data })
  } catch (error) {
    console.error(error?.response?.data ?? error.message)
    res.status(500).json({ error: 'Failed to fetch single job' })
  }
})

app.use(middlewares);
app.use(auth);
app.use(router);

// ✅ use Railway's dynamic PORT
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});