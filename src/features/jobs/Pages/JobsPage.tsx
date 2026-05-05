import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Button,
  Divider,
  Stack,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import { useListJobs } from '../../../hooks/useListJobs';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JobFilters } from '../../../hooks/useListJobs';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const t = {
  bg: '#0d0f14',
  surface: '#13161e',
  surfaceHover: '#171b25',
  border: '#1f2330',
  border2: '#2a2f42',
  accent: '#6366f1',
  accent2: '#818cf8',
  accentDim: '#6366f115',
  text: '#e2e6f3',
  text2: '#8b91a8',
  text3: '#555c74',
  green: '#22c55e',
  greenDim: '#22c55e15',
  blue: '#3b82f6',
  yellow: '#eab308',
  orange: '#f97316',
};

const TYPE_COLOR: Record<string, { color: string; bg: string }> = {
  FULLTIME: { color: t.blue, bg: '#3b82f615' },
  PARTTIME: { color: t.yellow, bg: '#eab30815' },
  CONTRACTOR: { color: t.orange, bg: '#f9731615' },
  INTERN: { color: t.green, bg: t.greenDim },
};

const TYPE_LABEL: Record<string, string> = {
  FULLTIME: 'Full-time',
  PARTTIME: 'Part-time',
  CONTRACTOR: 'Contract',
  INTERN: 'Intern',
};

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Today';
  if (d === 1) return '1 day ago';
  if (d < 7) return `${d} days ago`;
  if (d < 14) return '1 week ago';
  return `${Math.floor(d / 7)} weeks ago`;
}

// ─── Job Card Skeleton ─────────────────────────────────────────────────────────
const JobCardSkeleton = () => (
  <Card sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, boxShadow: 'none' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <Skeleton variant="rounded" width={42} height={42} sx={{ bgcolor: t.border2, borderRadius: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" sx={{ bgcolor: t.border2 }} />
          <Skeleton variant="text" width="40%" sx={{ bgcolor: t.border2 }} />
        </Box>
      </Box>
      <Skeleton variant="text" width="90%" sx={{ bgcolor: t.border2, mb: 1 }} />
      <Skeleton variant="text" width="60%" sx={{ bgcolor: t.border2 }} />
    </CardContent>
  </Card>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const JobsPage = () => {
  const navigate = useNavigate();

  const [draftFilter, setDraftFilter] = useState<JobFilters>({
    role: '',
    location: '',
    datePosted: 'week',
    remote: false,
    employmentType: 'FULLTIME',
  });
  const [filters, setFilters] = useState<JobFilters>(draftFilter);
  const sentinelRef = useRef<HTMLDivElement>(null)


  const { data, error, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useListJobs(filters);
  console.log(
    'Data from ui', data
  )
  const jobs = data?.pages.flatMap(page => page.jobs) ?? []

  const handleChange = <K extends keyof JobFilters>(value: JobFilters[K], key: K) => {
    setDraftFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => setFilters(draftFilter);

  const activeChips: string[] = [
    draftFilter.remote ? 'Remote' : '',
    draftFilter.employmentType ? TYPE_LABEL[draftFilter.employmentType] ?? '' : '',
    draftFilter.datePosted && draftFilter.datePosted !== 'all'
      ? { today: 'Today', '3days': 'Last 3 days', week: 'Last week', month: 'Last month' }[draftFilter.datePosted] ?? ''
      : '',
  ].filter(Boolean);

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return


    const observer = new IntersectionObserver((entries) => {
      console.log(entries[0].isIntersecting, isFetchingNextPage, hasNextPage)

      if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, { threshold: 0.1 })

    // const observer = new IntersectionObserver((entries) => {
    //   console.log('observer fired:', {
    //     isIntersecting: entries[0].isIntersecting,
    //     hasNextPage,
    //     isFetchingNextPage
    //   })
    //   if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
    //     fetchNextPage()
    //   }
    // }, { threshold: 0.1 })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.bg, color: t.text, p: { xs: 2, md: 4 } }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: t.text3, letterSpacing: '0.12em', fontSize: 11, display: 'block', mb: 0.5 }}
        >
          Job Board
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: t.text, fontFamily: 'Syne, sans-serif', mb: 0.5 }}>
              Find your next role
            </Typography>
            <Typography variant="body2" sx={{ color: t.text2 }}>
              {isPending ? 'Searching...' : `${jobs.length} jobs found`} · Updated just now
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Job title, keyword..."
          size="small"
          value={draftFilter.role}
          onChange={e => handleChange(e.target.value, 'role')}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: t.text3, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: 2, minWidth: 200,
            '& .MuiOutlinedInput-root': {
              bgcolor: t.surface, color: t.text, borderRadius: 2,
              '& fieldset': { borderColor: t.border2 },
              '&:hover fieldset': { borderColor: t.accent },
              '&.Mui-focused fieldset': { borderColor: t.accent },
            },
            '& input': { color: t.text, fontSize: 13 },
            '& input::placeholder': { color: t.text3 },
          }}
        />

        <TextField
          variant="outlined"
          placeholder="Location"
          size="small"
          value={draftFilter.location}
          onChange={e => handleChange(e.target.value, 'location')}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon sx={{ color: t.text3, fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: 1, minWidth: 140,
            '& .MuiOutlinedInput-root': {
              bgcolor: t.surface, color: t.text, borderRadius: 2,
              '& fieldset': { borderColor: t.border2 },
              '&:hover fieldset': { borderColor: t.accent },
              '&.Mui-focused fieldset': { borderColor: t.accent },
            },
            '& input': { color: t.text, fontSize: 13 },
            '& input::placeholder': { color: t.text3 },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={draftFilter.datePosted}
            onChange={e => handleChange(e.target.value as JobFilters['datePosted'], 'datePosted')}
            sx={{
              bgcolor: t.surface, color: t.text2, borderRadius: 2, fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border2 },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.accent },
              '& .MuiSvgIcon-root': { color: t.text3 },
            }}
          >
            <MenuItem value="all">Any time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="3days">Last 3 days</MenuItem>
            <MenuItem value="week">Last week</MenuItem>
            <MenuItem value="month">Last month</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={draftFilter.employmentType}
            displayEmpty
            onChange={e => handleChange(e.target.value as JobFilters['employmentType'], 'employmentType')}
            sx={{
              bgcolor: t.surface, color: t.text2, borderRadius: 2, fontSize: 13,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border2 },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.accent },
              '& .MuiSvgIcon-root': { color: t.text3 },
            }}
          >
            <MenuItem value="">All types</MenuItem>
            <MenuItem value="FULLTIME">Full-time</MenuItem>
            <MenuItem value="PARTTIME">Part-time</MenuItem>
            <MenuItem value="CONTRACTOR">Contract</MenuItem>
            <MenuItem value="INTERN">Intern</MenuItem>
          </Select>
        </FormControl>

        <Button
          onClick={handleSearch}
          variant="contained"
          sx={{
            bgcolor: t.accent, color: '#fff', fontWeight: 600,
            borderRadius: 2, textTransform: 'none', px: 3,
            '&:hover': { bgcolor: '#4f46e5' },
          }}
        >
          Search
        </Button>
      </Box>

      {/* ── Active filter chips ─────────────────────────────────────────────── */}
      {activeChips.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {activeChips.map(label => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                bgcolor: t.accentDim, color: t.accent2,
                border: `1px solid ${t.accent}40`, fontSize: 12,
              }}
            />
          ))}
        </Stack>
      )}

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <Box sx={{ p: 3, bgcolor: '#ef444415', border: '1px solid #ef444430', borderRadius: 2, mb: 3 }}>
          <Typography sx={{ color: '#ef4444', fontSize: 14 }}>{error.message}</Typography>
        </Box>
      )}

      {/* ── Job grid ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
          : jobs.map((job) => {
            const typeStyle = TYPE_COLOR[job.job_employment_type] ?? { color: t.text2, bg: t.border };
            return (
              <Card
                key={job.job_id}
                sx={{
                  bgcolor: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 3, boxShadow: 'none', display: 'flex', flexDirection: 'column',
                  transition: 'border-color .2s, transform .15s',
                  '&:hover': { borderColor: t.accent, transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 2.5, flex: 1 }}>

                  {/* Logo + title */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                    <Avatar
                      src={job.employer_logo ?? undefined}
                      sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: t.border2, fontSize: 16, fontWeight: 700, flexShrink: 0 }}
                    >
                      {job.employer_name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.3 }} noWrap>
                        {job.job_title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: t.text3, mt: 0.3 }}>
                        {job.employer_name}
                      </Typography>
                    </Box>
                    <Chip
                      label={TYPE_LABEL[job.job_employment_type] ?? job.job_employment_type}
                      size="small"
                      sx={{ fontSize: 11, fontWeight: 500, color: typeStyle.color, bgcolor: typeStyle.bg, border: 'none', height: 22, flexShrink: 0 }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: t.border, mb: 2 }} />

                  {/* Meta */}
                  <Stack spacing={0.8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 14, color: t.text3 }} />
                      <Typography sx={{ fontSize: 12, color: t.text2 }} noWrap>
                        {job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country}
                        {job.job_is_remote && (
                          <Box component="span" sx={{ ml: 1, color: t.green, fontSize: 11 }}>· Remote</Box>
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <WorkOutlineOutlinedIcon sx={{ fontSize: 14, color: t.text3 }} />
                      <Typography sx={{ fontSize: 12, color: t.text2 }}>
                        {job.job_salary_currency
                          ? `${job.job_salary_currency} ${job.job_min_salary ?? '?'} – ${job.job_max_salary ?? '?'}`
                          : 'Salary not listed'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: t.text3 }} />
                      <Typography sx={{ fontSize: 12, color: t.text3 }}>
                        {timeAgo(job.job_posted_at_datetime_utc)}
                      </Typography>
                    </Box>
                    {job.job_is_remote && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <WifiIcon sx={{ fontSize: 14, color: t.green }} />
                        <Typography sx={{ fontSize: 12, color: t.green }}>Remote available</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>

                {/* Actions */}
                <Box sx={{ px: 2.5, pb: 2.5, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/jobs/${job.job_id}`, { state: { job } })}
                    sx={{
                      borderColor: t.border2, color: t.text2, borderRadius: 2,
                      textTransform: 'none', fontSize: 13, fontWeight: 500,
                      '&:hover': { borderColor: t.accent, color: t.accent2, bgcolor: t.accentDim },
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {/* open your existing modal with job prefill */ }}
                    sx={{
                      bgcolor: t.accent, color: '#fff', borderRadius: 2,
                      textTransform: 'none', fontSize: 13, fontWeight: 500, px: 2,
                      '&:hover': { bgcolor: '#4f46e5' },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            );
          })}
      </Box>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {!isPending && !error && jobs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ color: t.text3, fontSize: 14 }}>No jobs found. Try a different role or location.</Typography>
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ height: 20 }} />

      {isFetchingNextPage && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2, mt: 2 }}> 

          {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </Box>
      )}





    </Box >
  );
};

export default JobsPage;