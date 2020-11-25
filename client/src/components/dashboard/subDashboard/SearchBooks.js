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

// import { withStyles } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";

import BookCard from "./BookCard";
// import bookList from "./TestBookData";

import axios from "axios";

const useStyles = (theme) => ({
  paper: {
    // maxWidth: 936,
    margin: "auto",
    // overflow: "hidden",
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
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
    margin: "40px 16px",
  },
});

export class SearchBooks extends Component {
  state = {
    searchValue: "",
    bookList: [{}],
  };

  sendSearchRequest = (searchValue) => {
    console.log("Sending request: ", searchValue);

    axios
      .get(`http://localhost:5000/api/books/searchBook`, {
        params: {
          searchString: searchValue,
        },
      })
      .then((res) => {
        this.setState({ bookList: res.data });

        console.log(res);
        // this.setState({ isLoading: false });
      });
  };

  getBookCard = (bookObj) => {
    return (
      <Grid item>
        <BookCard {...bookObj} />
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      // <Paper className={classes.paper}>
      <Grid className={classes.paper}>
        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <SearchBar
            value={this.state.searchValue}
            onChange={(newSearchValue) =>
              this.setState({ searchValue: newSearchValue })
            }
            onRequestSearch={() =>
              this.sendSearchRequest(this.state.searchValue)
            }
          />
        </Grid>
        <Grid container item spacing={5} justify="flex-start">
          {this.state.bookList.map((bookObj) => this.getBookCard(bookObj))}
          {/* {bookList.map((bookObj) => this.getBookCard(bookObj))} */}
        </Grid>
      </Grid>

      // </Paper>
    );
  }
}

SearchBooks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(SearchBooks);
