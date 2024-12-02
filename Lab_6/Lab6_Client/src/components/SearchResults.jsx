import React from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const SearchResults = ({ data, type, titleField }) => {
    if (!data || data.length === 0) {
        return (
            <Box
                sx={{
                    mx: 'auto',
                    width: '50%',
                    mt: 3,
                    p: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <TableContainer component={Card}
                    sx={{
                        boxShadow: 3,
                        p: 2,
                        borderRadius: 2,
                    }}
                >
                    <Table sx={{ minWidth: 300 }} aria-label="simple table">
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    <Typography variant="body2">No results available.</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                mx: 'auto',
                width: '50%',
                mt: 3,
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}
        >
            <TableContainer component={Card}
                sx={{
                    boxShadow: 3,
                    p: 2,
                    borderRadius: 2,
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>{type === 'chapter' ? 'Chapter Title' : 'Name'}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <Link to={`/${type}/${item._id}`}>
                                        <Typography
                                            sx={{
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                            variant='h6'
                                            component='h3'
                                        >
                                            {item[titleField]}
                                        </Typography>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SearchResults;
