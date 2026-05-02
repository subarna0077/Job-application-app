import { useState } from 'react'
import { useGetPosts } from '../hooks/useGetPosts'
import { useDeletePost } from '../hooks/useDeletePost'
import { useAppStore } from '../features/applications/stores'
import type { FormInputType, JobApplication } from '../types/types'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  MenuItem,
  Menu,
} from '@mui/material'
import { Search, MoreHoriz, Add, Edit, Delete } from '@mui/icons-material'
import JobApplicationForm from '../components/JobApplicationForm'



// ─── Design tokens (import from your tokens.ts) ────────────────────────────────
const t = {
  bg: "#0d0f14",
  surface: "#13161e",
  border: "#1f2330",
  border2: "#2a2f42",
  accent: "#6366f1",
  accent2: "#818cf8",
  accentDim: "#6366f120",
  muted: "#3a3f52",
  text: "#e2e6f3",
  text2: "#8b91a8",
  text3: "#555c74",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
}

// ─── Status styles ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  interview: { bg: "#eab30815", color: "#fbbf24", dot: "#eab308" },
  applied: { bg: "#3b82f615", color: "#60a5fa", dot: "#3b82f6" },
  offer: { bg: "#22c55e15", color: "#4ade80", dot: "#22c55e" },
  rejected: { bg: "#ef444415", color: "#f87171", dot: "#ef4444" },
  saved: { bg: "#94a3b815", color: "#94a3b8", dot: "#94a3b8" },
} as const

type Status = keyof typeof STATUS_STYLES

// ─── Static data ───────────────────────────────────────────────────────────────

const FILTER_CHIPS = ["All", "saved", "applied", "interview", "offer", "rejected"] as const
type Filter = typeof FILTER_CHIPS[number]

// ─── Shared input sx ───────────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#0d0f14",
    borderRadius: "8px",
    fontSize: 13,
    color: "#e2e6f3",
    "& fieldset": { borderColor: "#2a2f42" },
    "&:hover fieldset": { borderColor: "#3a3f52" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& input::placeholder": { color: "#555c74", opacity: 1 },
}

// ─── StatusChip ───────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: Status }) {
  const s = STATUS_STYLES[status]
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: "5px", px: "9px", py: "3px", borderRadius: "99px", fontSize: 11, fontWeight: 500, bgcolor: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.dot, flexShrink: 0 }} />
      {status}
    </Box>
  )
}

// ─── Add Application Modal ────────────────────────────────────────────────────
function AddApplicationModal({ title, open, onClose, data }: {title: string, open: boolean; onClose: () => void, data: JobApplication | null }) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { bgcolor: t.surface, border: `1px solid ${t.border2}`, borderRadius: "14px", boxShadow: "0 24px 60px #00000080", width: 380, m: 0 },
      }}
      BackdropProps={{ sx: { bgcolor: "#00000070" } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, color: t.text, pb: 0 }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: "18px !important", display: "flex", flexDirection: "column", gap: "14px" }}>
        <JobApplicationForm initialData = {data} />
      </DialogContent>
    </Dialog>
  )
}
// ─── Row action menu (··· button) ─────────────────────────────────────────────
function RowMenu({ appId, onDelete, initialData }: { appId: string, onDelete: (id: string) => void, initialData: JobApplication}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = ()=> {
    setModalOpen(true)
    setAnchor(null)
  }



  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: t.text3, "&:hover": { color: t.text2, bgcolor: t.border } }}>
        <MoreHoriz fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { bgcolor: t.surface, border: `1px solid ${t.border2}`, borderRadius: "10px", minWidth: 140, boxShadow: "0 8px 32px #00000060" } }}
      >
        {/* TODO: onClick → open edit modal with this appId's data */}
        <MenuItem onClick={() => handleEdit()} sx={{ fontSize: 13, color: t.text2, gap: 1, "&:hover": { bgcolor: t.border, color: t.text } }}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        {/* TODO: onClick → call delete mutation with appId */}
        <MenuItem onClick={() => onDelete(appId)} sx={{ fontSize: 13, color: t.red, gap: 1, "&:hover": { bgcolor: "#ef444415" } }}>
          <Delete fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      <AddApplicationModal title="Edit application" open={modalOpen} onClose={() => setModalOpen(false)} data={initialData} />

    </>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const Applications = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { sortBy } = useAppStore()
  const { data: applications = [] } = useGetPosts()
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { mutate: deletePost } = useDeletePost()
  console.log(activeFilter)


  const filteredApplications = () => {
    const matchesFilter = applications.filter(app => activeFilter === 'All' ? true : app.status === activeFilter)
    const matchesSearch = applications.filter(app => app.role.toLowerCase().includes(search.toLowerCase()) || app.company.toLowerCase().includes(search.toLowerCase()))


    // Here we want the intersection

    /* 
    If matches filter return a,b,d
    and if matchesSearch return b, d, e
    then the filter will show b,d

    that is include everything in a that also lies in b

    */

    const filtered = matchesFilter.filter(app => matchesSearch.includes(app))
    if (sortBy === 'Date') {
      filtered.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    }

    if (sortBy === 'A-Z') {
      filtered.sort((a, b) => a.role.localeCompare(b.role))
    }

    return filtered;

  }

  const filtered = filteredApplications()



  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* ── Filter bar ── */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          placeholder="Search company or role..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          size="small"
          // TODO 4: hook into filter logic
          sx={{
            flex: 1, minWidth: 180,
            "& .MuiOutlinedInput-root": { bgcolor: t.surface, borderRadius: "8px", fontSize: 13, color: t.text2, "& fieldset": { borderColor: t.border2 }, "&:hover fieldset": { borderColor: t.muted }, "&.Mui-focused fieldset": { borderColor: t.accent } },
            "& input::placeholder": { color: t.text3, opacity: 1 },
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: t.text3 }} /></InputAdornment> }}
        />

        {FILTER_CHIPS.map(chip => (
          <Box
            key={chip}
            onClick={() => setActiveFilter(chip)}
            // TODO 3: this already sets state, just wire up filtered list above
            component="span"
            sx={{
              px: "12px", py: "6px", borderRadius: "8px", fontSize: 12, fontWeight: 500, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
              border: `1px solid ${true ? t.accent : t.border2}`,
              bgcolor: true ? t.accentDim : t.surface,
              color: true ? t.accent2 : t.text2,
              "&:hover": { borderColor: t.accent, color: t.accent2 },
            }}
          >
            {chip}
          </Box>
        ))}

        {/* Add button — sits here OR in the Layout topbar, your choice */}
        <Button
          startIcon={<Add fontSize="small" />}
          onClick={() => setModalOpen(true)}
          sx={{ bgcolor: t.accent, color: "#fff", fontSize: 12.5, fontWeight: 500, px: "14px", py: "7px", borderRadius: "8px", textTransform: "none", "&:hover": { bgcolor: "#4f52d9" }, whiteSpace: "nowrap" }}
        >
          Add Application
        </Button>
      </Box>

      {/* ── Table ── */}
      <TableContainer sx={{ bgcolor: "transparent", flex: 1 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {["Role / Company", "Applied", "Status", "Updated", ""].map((h, i) => (
                <TableCell
                  key={i}
                  sx={{ borderBottom: `1px solid ${t.border}`, color: t.text3, fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", py: "8px", px: "12px", width: i === 0 ? "35%" : i === 4 ? "56px" : "auto" }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* TODO: show skeleton rows here when isLoading is true */}

            {filtered.map(app => <TableRow
              key={app.id}
              hover
              sx={{
                cursor: "pointer",
                "& td": { border: "none", py: "10px", px: "12px" },
                "&:hover": { bgcolor: t.surface },
              }}
            >
              {/* Role + Company */}

              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, borderRadius: "8px", flexShrink: 0 }}>
                    {app.role.slice(0, 1)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {app.role}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: t.text3 }}>{app.company}</Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Applied date */}
              <TableCell>
                <Typography sx={{ fontSize: 13, color: t.text2 }}>{app.appliedDate}</Typography>
              </TableCell>

              {/* Status */}
              <TableCell>
                <StatusChip status={app.status} />
              </TableCell>

              {/* Updated */}
              <TableCell>
                <Typography sx={{ fontSize: 12, color: t.text3 }}>{app.updatedAt}</Typography>
              </TableCell>

              {/* Actions menu */}
              {/* TODO: row click → navigate(`/applications/${app.id}`) */}
              <TableCell align="right">
                <RowMenu appId={app.id} onDelete={deletePost} initialData={app} />
              </TableCell>
            </TableRow>)}



            {/* TODO: show empty state when filtered.length === 0 */}

            <TableRow>
              <TableCell colSpan={5} sx={{ border: "none", textAlign: "center", py: 6 }}>
                <Typography sx={{ color: t.text3, fontSize: 14 }}>No applications found</Typography>
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Add Application Modal ── */}
      <AddApplicationModal title="Add application" open={modalOpen} onClose={() => setModalOpen(false)} data={null}  />
    </Box>
  )
}

export default Applications