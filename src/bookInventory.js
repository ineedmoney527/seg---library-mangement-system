import React, { useState, useEffect } from "react";
import "./bookInventory.css"; // Import CSS styles here
// Import other images here

import { useNavigate } from "react-router-dom";
import AddNewBookPage from "./addBook";
import MenuBar from "./MenuBar";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Buffer } from "buffer";
import axios from "axios";
import {
  Tab,
  Tabs,
  TabContainer,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function BookInventory() {
  const [addBook, setAddBook] = useState(false);
  const [editBook, setEditBook] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [data, setData] = useState([]);
  const handleAddClick = () => {
    setAddBook(true);
  };
  const handleClose = () => {
    setAddBook(false);
  };
  const handleEditClick = (code) => {
    const ross = data.find((row) => row.book_code === code);

    setSelectedRow(ross);
    setEditBook(true);
  };

  const handleDeleteClick = async (code) => {
    // const rowData = params.row;
    // const code = rowData.book_code;

    if (
      window.confirm(
        `Are you sure you want to delete this book with code ${code}?`
      )
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/book/${code}`
        );
        alert(response.data.message);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("An error occurred while deleting the book.");
      }
    }
  };

  const deleteRows = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    try {
      const codes = selectedRows.map((row) => row.book_code).join(",");
      if (
        window.confirm(
          `Are you sure you want to delete selected books with ID ${codes}?`
        )
      ) {
        const response = await axios.delete(
          `http://localhost:5000/api/book/rows/${codes}`
        );
        alert("Books deleted successfully");
        fetchBooks();
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      alert(error.message);
    }

    setSelectedRows([]);
  };

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/book");
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [addBook, editBook]);
  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Books
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={deleteRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton onClick={handleAddClick}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <MenuBar></MenuBar>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selectedRows?.length} />
        <TableContainer>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={data}
              getRowId={(row) => row.book_code}
              checkboxSelection
              disableRowSelectionOnClick
              headerClassName="header-center"
              disableSelectionOnClick
              // onRowClick={(row) => {
              //   console.log("haha");
              // }}

              onRowSelectionModelChange={(codes) => {
                setSelectedRows(
                  codes.map((code) =>
                    data.find((row) => row.book_code === code)
                  )
                );
              }}
              pageSize={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              pagination
              autoHeight
              slots={{
                toolbar: GridToolbar,
              }}
              {...data}
              columns={[
                {
                  field: "image",
                  headerName: "Image",
                  width: 150,
                  align: "center",
                  headerAlign: "center",
                  renderCell: (params) => {
                    // Convert the Buffer array to a base64 string

                    const base64String = Buffer.from(params.value).toString(
                      "base64"
                    );

                    // Use the base64 string as the src attribute for the img tag
                    return (
                      <img
                        src={`data:image/png;base64,${base64String}`}
                        alt="Image"
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "80%",
                          height: "100%",
                        }}
                      />
                    );
                  },
                },
                {
                  field: "book_code",
                  headerName: "Code",
                  width: 100,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "isbn",
                  headerName: "ISBN",
                  width: 150,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "title",
                  headerName: "Title",
                  width: 200,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "location",
                  headerName: "Location",
                  width: 200,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "author_name",
                  headerName: "Author",
                  width: 150,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "edition",
                  headerName: "Edition",
                  width: 120,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "publisher_name",

                  headerName: "Publisher",
                  width: 150,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "country_name",
                  headerName: "Country",
                  width: 150,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "publish_year",
                  headerName: "Year",
                  width: 120,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "price",
                  headerName: "Price",
                  width: 120,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "pages",
                  headerName: "Pages",
                  width: 120,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "status",
                  headerName: "Status",
                  width: 120,
                  headerAlign: "center",
                  align: "center",
                  flex: 1,
                },
                {
                  field: "actions",
                  headerName: "Actions",
                  headerAlign: "center",
                  width: 100,
                  align: "center",
                  renderCell: (params) => (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          handleEditClick(params.row.book_code);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteClick(params.row.book_code)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ),
                  disableSelectionOnClick: false,
                },
                // Columns definition
              ]}
            />
          </div>
        </TableContainer>
      </Paper>
      {addBook && (
        <AddNewBookPage
          open={addBook}
          onClose={() => setAddBook(false)}
        ></AddNewBookPage>
      )}
      {editBook && (
        <AddNewBookPage
          open={editBook}
          onClose={() => setEditBook(false)}
          edit={true}
          selectedRowData={selectedRow}
        />
      )}
    </Box>
  );
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <BookInventory {...props} navigate={navigate} />;
}

export default WithNavigate;

// export default BookInventory;
// export default WithNavigate;
