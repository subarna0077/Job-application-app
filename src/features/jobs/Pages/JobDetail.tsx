import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  Skeleton,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WifiIcon from '@mui/icons-material/Wifi';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useJobDetail } from '../../../hooks/useJobDetail';
import { useCreatePosts } from '../../../hooks/useCreatePosts';
import type { FormInputType } from '../../../types/types';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const t = {
  bg: '#0d0f14',
  surface: '#13161e',
  surface2: '#171b25',
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

// ─── Info row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, borderBottom: `1px solid ${t.border}` }}>
    <Box sx={{ color: t.text3, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Typography sx={{ fontSize: 13, color: t.text3, minWidth: 100 }}>{label}</Typography>
    <Typography sx={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{value}</Typography>
  </Box>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const JobDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const location = useLocation();

  const { mutate: createPost } = useCreatePosts()

  const passedJob = location.state?.job;
  const { data, isPending, error } = useJobDetail(id ?? '');
  console.log(data)

  if (isPending && !passedJob) return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: t.text2 }}>Loading...</Typography>
    </Box>
  )

  if (error && !passedJob) return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#ef4444' }}>Failed to load job.</Typography>
    </Box>
  )

  const job = passedJob ?? data?.[0]
  const jobData = {
    company: job?.employer_name as FormInputType['company'],
    role: job?.job_title as FormInputType['role'],
    status: 'saved' as FormInputType['status']
  }

  console.log(jobData)

  const typeStyle = TYPE_COLOR[job?.job_employment_type] ?? { color: t.text2, bg: t.border };



  console.log(job)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.bg, color: t.text, p: { xs: 2, md: 4 } }}>

      {/* ── Back button ────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: t.text2, bgcolor: t.surface, border: `1px solid ${t.border2}`, borderRadius: 2, '&:hover': { bgcolor: t.surface2 } }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, gap: 3, alignItems: 'start' }}>

        {/* ── Left column — main content ──────────────────────────────────── */}
        <Box>

          {/* Hero card */}
          <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 3, mb: 3 }}>
            {isPending && !passedJob ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rounded" width={64} height={64} sx={{ bgcolor: t.border2, borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: t.border2 }} />
                  <Skeleton variant="text" width="40%" sx={{ bgcolor: t.border2 }} />
                  <Skeleton variant="text" width="30%" sx={{ bgcolor: t.border2 }} />
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
                  <Avatar
                    src={job?.employer_logo ?? undefined}
                    sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: t.border2, fontSize: 22, fontWeight: 700 }}
                  >
                    {job?.employer_name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: 'Syne, sans-serif', lineHeight: 1.3, mb: 0.5 }}>
                      {job?.job_title}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: t.text2 }}>{job?.employer_name}</Typography>
                    {job?.employer_website && (
                      <Typography
                        component="a"
                        href={job.employer_website}
                        target="_blank"
                        sx={{ fontSize: 12, color: t.accent2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {job.employer_website}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={TYPE_LABEL[job?.job_employment_type] ?? job?.job_employment_type}
                    size="small"
                    sx={{ color: typeStyle.color, bgcolor: typeStyle.bg, fontWeight: 500, fontSize: 12, border: 'none' }}
                  />
                </Box>

                {/* Quick meta row */}
                <Stack direction="row" sx={{flexWrap: "wrap", gap:2}}>
                  {job?.job_city && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 15, color: t.text3 }} />
                      <Typography sx={{ fontSize: 13, color: t.text2 }}>
                        {job.job_city}, {job.job_country}
                      </Typography>
                    </Box>
                  )}
                  {job?.job_is_remote && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <WifiIcon sx={{ fontSize: 15, color: t.green }} />
                      <Typography sx={{ fontSize: 13, color: t.green }}>Remote</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <AccessTimeIcon sx={{ fontSize: 15, color: t.text3 }} />
                    <Typography sx={{ fontSize: 13, color: t.text3 }}>
                      {timeAgo(job?.job_posted_at_datetime_utc)}
                    </Typography>
                  </Box>
                </Stack>
              </>
            )}
          </Box>

          {/* Description */}
          <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 3, mb: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: t.text, mb: 2 }}>
              Job description
            </Typography>
            {isPending && !passedJob ? (
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} variant="text" width={i % 3 === 0 ? '70%' : '100%'} sx={{ bgcolor: t.border2, mb: 0.5 }} />
                ))}
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: 13,
                  color: t.text2,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                  '& ul': { pl: 2 },
                  '& li': { mb: 0.5 },
                }}
              >
                {job?.job_description ?? 'No description available.'}
              </Typography>
            )}
          </Box>

          {/* Highlights */}
          {job?.job_highlights && Object.keys(job.job_highlights).length > 0 && (
            <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 3 }}>
              {Object.entries(job.job_highlights).map(([section, items]) => (
                <Box key={section} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: t.text, mb: 1.5 }}>
                    {section}
                  </Typography>
                  <Stack spacing={1}>
                    {(items as string[]).map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: t.accent, mt: '6px', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 13, color: t.text2, lineHeight: 1.6 }}>{item}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ── Right column — sidebar ──────────────────────────────────────── */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>

          {/* Apply card */}
          <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 3, mb: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.text, mb: 2 }}>
              Ready to apply?
            </Typography>

            <Stack spacing={1.5}>
              {job?.job_salary_currency && (
                <Box sx={{ bgcolor: t.accentDim, borderRadius: 2, p: 1.5, textAlign: 'center', border: `1px solid ${t.accent}25` }}>
                  <Typography sx={{ fontSize: 11, color: t.text3, mb: 0.3 }}>Salary range</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: t.accent2 }}>
                    {job.job_salary_currency} {job.job_min_salary?.toLocaleString()} – {job.job_max_salary?.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: t.text3 }}>per {job.job_salary_period?.toLowerCase() ?? 'year'}</Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                href={job?.job_apply_link}
                target="_blank"
                endIcon={<OpenInNewIcon sx={{ fontSize: 15 }} />}
                sx={{
                  bgcolor: t.accent, color: '#fff', borderRadius: 2,
                  textTransform: 'none', fontWeight: 600, py: 1.2,
                  '&:hover': { bgcolor: '#4f46e5' },
                }}
              >
                Apply now
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => createPost(jobData)}
                sx={{
                  borderColor: t.border2, color: t.text2, borderRadius: 2,
                  textTransform: 'none', fontWeight: 500,
                  '&:hover': { borderColor: t.accent, color: t.accent2, bgcolor: t.accentDim },
                }}
              >
                Save to tracker
              </Button>
            </Stack>
          </Box>

          {/* Job info card */}
          <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 3, mb: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.text, mb: 1 }}>Job details</Typography>
            <InfoRow icon={<WorkOutlineOutlinedIcon sx={{ fontSize: 16 }} />} label="Type" value={TYPE_LABEL[job?.job_employment_type] ?? job?.job_employment_type ?? '—'} />
            <InfoRow icon={<LocationOnOutlinedIcon sx={{ fontSize: 16 }} />} label="Location" value={job?.job_city ? `${job.job_city}, ${job.job_country}` : job?.job_country ?? '—'} />
            <InfoRow icon={<WifiIcon sx={{ fontSize: 16 }} />} label="Remote" value={job?.job_is_remote ? 'Yes' : 'No'} />
            <InfoRow icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} label="Posted" value={timeAgo(job?.job_posted_at_datetime_utc)} />
            <InfoRow icon={<BusinessIcon sx={{ fontSize: 16 }} />} label="Company" value={job?.employer_name ?? '—'} />
          </Box>

          {/* Publisher */}
          {job?.job_publisher && (
            <Box sx={{ bgcolor: t.surface, border: `1px solid ${t.border}`, borderRadius: 3, p: 2 }}>
              <Typography sx={{ fontSize: 11, color: t.text3 }}>
                Listed on <Box component="span" sx={{ color: t.text2 }}>{job.job_publisher}</Box>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

