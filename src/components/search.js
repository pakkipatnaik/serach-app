import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

function SearchBar() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        if (inputValue === '') {
            setOptions([]);
            return;
        }

        setLoading(true);

        const fetchSuggestions = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/suggestions?query=${inputValue}`);
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [inputValue]);

    return (
        <Box sx={{ width: '100%', maxWidth: 400, margin: 'auto', paddingTop: 4 }} >
            <Typography variant="h5" className='searchBarHeading' sx={{ marginBottom: 3, fontWeight: 'bold', textAlign: "center" }}>
                Auto-suggestions Search Bar
            </Typography>
            <Autocomplete
                id="search-bar"
                open={open && inputValue !== '' && options.length > 0}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                getOptionSelected={(option, value) => option === value}
                getOptionLabel={(option) => option} 
                options={options}
                loading={loading}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.secondary.main, 
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main, 
                                },
                            },
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <Paper {...props} sx={{ marginBottom: '5px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: 3 }}>
                        <Typography>{option}</Typography>
                    </Paper>
                )}
                loadingText={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ marginRight: '10px' }} />
                        <Typography>Loading...</Typography>
                    </Box>
                }
            />
        </Box>
    );
}

export default SearchBar;
