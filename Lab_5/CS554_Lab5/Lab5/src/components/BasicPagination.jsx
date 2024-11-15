import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BasicPagination({ page, totalPages, size, totalElements, attr }) {
    const navigate = useNavigate();
    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    return (
        // <TablePagination
        //     component="div"
        //     count={totalElements}
        //     page={page - 1}
        //     rowsPerPage={size}
        //     rowsPerPageOptions={[]}
        //     onPageChange={handleChangePage}
        // 
        <div>

            <h5>Page {page} of {totalPages}   |  Showing {attr} {((page - 1) * size) + 1} - {Math.min(page * size, totalElements)} of {totalElements}</h5>
            {page > 1 && <button onClick={() => navigate(`/${attr}/page/${parseInt(page) - 1}`)}>Previous</button>}
            {page < totalPages && <button onClick={() => navigate(`/${attr}/page/${parseInt(page) + 1}`)}>Next</button>}

        </div>

    );
}

export default BasicPagination;