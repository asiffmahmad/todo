import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Box, Typography, IconButton, 
  List, ListItem, ListItemText, ListItemButton, Divider,
  useTheme, useMediaQuery, InputBase, Button
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { fetchEntries, addEntry, deleteEntry, updateEntry } from '../features/journalSlice'

const Journal = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDark = theme.palette.mode === 'dark'
  
  const { entries, loading } = useSelector((state) => state.journal)

  const [selectedEntry, setSelectedEntry] = useState(null)
  
  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  
  // Mobile view state (false = show list, true = show editor)
  const [showMobileEditor, setShowMobileEditor] = useState(false)

  // iOS Notes Accent Color
  const accentColor = '#d4a017'

  useEffect(() => {
    dispatch(fetchEntries())
  }, [dispatch])

  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title || '')
      setContent(selectedEntry.content || '')
      if (isMobile) setShowMobileEditor(true)
    } else {
      setTitle('')
      setContent('')
    }
  }, [selectedEntry, isMobile])

  const handleNewEntry = () => {
    setSelectedEntry(null)
    setTitle('')
    setContent('')
    setShowMobileEditor(true)
  }

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (selectedEntry) {
      dispatch(updateEntry({ id: selectedEntry.id, data: { title, content, entryType: selectedEntry.entryType || 'DAILY_LOG', mood: selectedEntry.mood || '' } }))
    } else {
      // Create new
      dispatch(addEntry({ title, content, entryType: 'DAILY_LOG', mood: '' }))
    }
  }

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation()
    dispatch(deleteEntry(id))
    if (selectedEntry && selectedEntry.id === id) {
      setSelectedEntry(null)
      setShowMobileEditor(false)
    }
  }

  const handleBackToList = () => {
    setShowMobileEditor(false)
    setSelectedEntry(null) // optionally deselect when going back
  }

  // Common font family for iOS feel
  const iosFont = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

  // Dynamic Colors based on theme mode
  const sidebarBg = isDark ? '#1c1c1e' : '#f2f2f7'
  const editorBg = isDark ? '#000000' : '#ffffff'
  const borderColor = isDark ? '#38383a' : '#c6c6c8'
  const textColor = isDark ? '#ffffff' : '#000000'
  const secondaryTextColor = isDark ? '#98989d' : '#8e8e93'
  const selectedItemBg = isDark ? '#2c2c2e' : '#e5e5ea'
  const selectedItemHover = isDark ? '#3a3a3c' : '#d1d1d6'

  return (
    <Box sx={{ 
      display: 'flex', 
      height: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 120px)' }, 
      bgcolor: editorBg, 
      borderRadius: { xs: 0, md: 3 }, 
      overflow: 'hidden',
      boxShadow: { xs: 'none', md: '0 10px 30px rgba(0,0,0,0.05)' },
      border: { xs: 'none', md: `1px solid ${borderColor}` },
      fontFamily: iosFont
    }}>
      
      {/* LEFT SIDEBAR: List of Entries */}
      <Box sx={{ 
        width: { xs: '100%', md: 320 }, 
        display: (!isMobile || !showMobileEditor) ? 'flex' : 'none', 
        flexDirection: 'column', 
        bgcolor: sidebarBg,
        borderRight: { xs: 'none', md: `1px solid ${borderColor}` }
      }}>
        <Box sx={{ p: 2, pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: iosFont, letterSpacing: '-0.5px', color: textColor }}>
            Notes
          </Typography>
          <IconButton onClick={handleNewEntry} sx={{ color: accentColor }}>
            <CreateIcon />
          </IconButton>
        </Box>
        
        {loading && !entries.length ? (
          <Box p={4} textAlign="center" color={secondaryTextColor}>Loading...</Box>
        ) : entries.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: secondaryTextColor }}>
            <Typography variant="body1" fontFamily={iosFont}>No Notes</Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
            {entries.map(entry => (
              <React.Fragment key={entry.id}>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={selectedEntry?.id === entry.id}
                    onClick={() => {
                      setSelectedEntry(entry)
                      if (isMobile) setShowMobileEditor(true)
                    }}
                    sx={{ 
                      py: 1.5, px: 3,
                      bgcolor: selectedEntry?.id === entry.id ? selectedItemBg : 'transparent',
                      '&.Mui-selected': { bgcolor: selectedItemBg },
                      '&.Mui-selected:hover': { bgcolor: selectedItemHover },
                    }}
                  >
                    <ListItemText 
                      primary={entry.title || 'New Note'} 
                      primaryTypographyProps={{ 
                        fontWeight: 600, 
                        noWrap: true,
                        fontFamily: iosFont,
                        color: textColor
                      }}
                      secondary={
                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                           <Typography variant="caption" sx={{ color: secondaryTextColor, fontWeight: 500, fontFamily: iosFont }}>
                             {new Date(entry.createdAt).toLocaleDateString()}
                           </Typography>
                           <Typography variant="caption" sx={{ color: secondaryTextColor, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, fontFamily: iosFont }}>
                             {entry.content ? entry.content.substring(0, 30) : 'No additional text'}
                           </Typography>
                         </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ ml: 3, borderColor: borderColor }} />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* RIGHT MAIN: The Editor */}
      <Box sx={{ 
        flex: 1, 
        display: (!isMobile || showMobileEditor) ? 'flex' : 'none', 
        flexDirection: 'column', 
        bgcolor: editorBg
      }}>
        
        {/* Editor Toolbar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: `1px solid ${sidebarBg}`
        }}>
          {isMobile ? (
             <Button sx={{ color: accentColor, textTransform: 'none', fontSize: '1.1rem', fontFamily: iosFont }} startIcon={<ArrowBackIosNewIcon />} onClick={handleBackToList}>
               Notes
             </Button>
          ) : (
            <Box /> // Spacer
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedEntry && (
              <IconButton onClick={(e) => handleDelete(selectedEntry.id, e)} sx={{ color: accentColor }}>
                <DeleteOutlineIcon />
              </IconButton>
            )}
            <IconButton onClick={handleSave} sx={{ color: accentColor }}>
              <CheckCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Editor Body */}
        <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          {selectedEntry && (
             <Typography variant="caption" sx={{ color: secondaryTextColor, textAlign: 'center', mb: 4, fontFamily: iosFont, fontWeight: 500 }}>
               {new Date(selectedEntry.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
             </Typography>
          )}

          <InputBase
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            sx={{
              fontSize: '2rem',
              fontWeight: 700,
              fontFamily: iosFont,
              color: textColor,
              mb: 2,
              '& input': { p: 0 }
            }}
          />

          <InputBase
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            multiline
            sx={{
              flex: 1,
              alignItems: 'flex-start',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              fontFamily: iosFont,
              color: textColor,
              '& textarea': { p: 0, height: '100% !important' }
            }}
          />
        </Box>
      </Box>

    </Box>
  )
}

export default Journal
