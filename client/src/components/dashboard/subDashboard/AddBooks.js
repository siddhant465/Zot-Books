import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

const useStyles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  titleBar: {
    borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
    borderBottomColor: "linear-gradient(315deg, #000000 0%, #414141 74%)",
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: "block",
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: "32px 16px",
    paddingBottom: "16px",
  },
  appBar: {},
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class AddBooks extends Component {
  state = {
    bookName: "",
    authorName: "",
    price: "",
    condition: "",
    address: "",
    zipCode: "",
    comments: "",
    // bookList: [{}],
    snackBarOpen: false,
    bookPostSuccess: false,
    user: this.props.user,
  };

  conditions = [
    {
      value: "Poor",
      label: "Poor",
    },
    {
      value: "Bad",
      label: "Bad",
    },
    {
      value: "Decent",
      label: "Decent",
    },
    {
      value: "Good",
      label: "Good",
    },
    {
      value: "Excellent",
      label: "Excellent",
    },
  ];

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onChangeDropDown = (e) => {
    this.setState({ condition: e.target.value });
  };

  handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  submitBook = () => {
    console.log("Submitting");
    const newBook = {
      bookName: this.state.bookName,
      authorName: this.state.authorName,
      price: this.state.price,
      owner: this.state.user.email,
      condition: this.state.condition,
      comments: this.state.comments,
      imageURL: this.state.imageURL,
      address: this.state.address,
      zipCode: this.state.zipCode,
    };

    axios
      .post(`http://localhost:5000/api/books/addBook`, newBook)
      .then((res) => {
        console.log(res);
        this.setState({ bookPostSuccess: true });
        this.setState({ snackBarOpen: true });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ bookPostSuccess: false });
        this.setState({ snackBarOpen: true });
      });
    // console.log(newBook);
  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <Paper>
          <AppBar
            className={classes.titleBar}
            position="static"
            color="transparent"
            elevation={0}
          >
            <Toolbar>
              <Grid
                container
                spacing={2}
                alignItems="center"
                style={{ marginTop: "5px" }}
              >
                <Grid item xs>
                  <Typography
                    variant="h3"
                    // color="primary"
                    style={{
                      color: "linear-gradient(315deg, #000000 0%, #414141 74%)",
                    }}
                  >
                    {" "}
                    Add Books{" "}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={classes.addUser}
                    onClick={this.submitBook}
                    // style={{
                    //   background:
                    //     "linear-gradient(315deg, #000000 0%, #414141 74%)",
                    // }}
                  >
                    Add Book
                  </Button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Grid
            container
            className={classes.contentWrapper}
            direction="row"
            // justify="space-evenly"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={3}>
              <TextField
                required
                label="Book Name"
                variant="outlined"
                name="bookName"
                autoFocus
                id="bookName"
                onChange={this.onChange}
                value={this.state.bookName}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="Author Name"
                variant="outlined"
                name="authorName"
                id="authorName"
                onChange={this.onChange}
                value={this.state.authorName}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                label="Price"
                variant="outlined"
                name="price"
                id="price"
                onChange={this.onChange}
                value={this.state.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                select
                label="Select condition of the book"
                value={this.state.condition}
                id="condition"
                defaultValue=""
                onChange={this.onChangeDropDown}
                variant="outlined"
                fullWidth
              >
                {this.conditions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                required
                label="Address"
                variant="outlined"
                name="address"
                id="address"
                onChange={this.onChange}
                value={this.state.address}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                required
                label="Zip Code"
                variant="outlined"
                id="zipCode"
                name="zipCode"
                onChange={this.onChange}
                value={this.state.zipCode}
              />
            </Grid>

            <Grid item xs={5}>
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  color="default"
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  <Typography color="textSecondary">Upload Picture</Typography>
                </Button>
              </label>
            </Grid>

            <Grid item xs={11}>
              <TextField
                required
                label="Additional Comments"
                variant="outlined"
                name="comments"
                id="comments"
                multiline
                fullWidth
                onChange={this.onChange}
                value={this.state.comments}
              />
            </Grid>
          </Grid>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message="Book Posted Successfully!"
        >
          {this.state.bookPostSuccess ? (
            <Alert onClose={this.handleCloseSnackBar} severity="info">
              Book Submitted Succesfully!
            </Alert>
          ) : (
            <Alert onClose={this.handleCloseSnackBar} severity="error">
              Something went wrong while submitting the book :(
            </Alert>
          )}
        </Snackbar>
      </>
    );
  }
}

AddBooks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(AddBooks);
