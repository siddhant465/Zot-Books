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

export class AddBooks extends Component {
  state = {
    searchValue: "",
    // bookList: [{}],
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper} elevation={3}>
        <Grid
          className={classes.paper}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Toolbar align="center">asdasdasdsa</Toolbar>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

AddBooks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(AddBooks);
