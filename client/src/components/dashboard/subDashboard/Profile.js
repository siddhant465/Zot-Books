import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import avatarImage from "./../../../images/BlankProfile.png";
import Button from "@material-ui/core/Button";

import { relative } from "path";

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import CircularProgressComponent from "./../../layout/CircularProgressComponent";

import axios from "axios";

const useStyles = (theme) => ({
  paper: {
    maxWidth: 836,
    margin: "auto",
    // overflow: "hidden",
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
  // imageDiv: {
  //   position: "relative",
  //   height: "100px",
  //   width: "360px",
  // },
});

export class Profile extends Component {
    state = {
        openFormDialog: false,
        user: this.props.user,
        isLoading: true,
        userData: {},
        address: "",
        zipCode: "",
    }

    componentDidMount() {
        // console.log("from prfile", this.state.user.email)
        axios
          .get(`http://localhost:5000/api/users/getUserDetails?email=${this.state.user.email}`)
          .then((res) => {
            this.setState({ userData: res.data.result });
            this.setState({ isLoading: false });
            console.log(res.data.result);
            // this.setState({ isLoading: false });
          })
          .catch((error) => {
            console.log(error);
          });
        }

    handleClickOpenFormDialog = () => {
        this.setState({openFormDialog:true});
      };

      handleCloseFormDialog = () => {
        this.setState({openFormDialog:false});
      };

    updateAddress = () => {
      console.log("Updating address.")
      console.log(this.state.address)
      console.log(this.state.zipCode)
      
      const email = this.state.user.email
      const userDetails = {address: this.state.address, zipCode: this.state.zipCode}

      axios
      .put(`http://localhost:5000/api/users/updateUser`, {email, userDetails})
      .then((res) => {
        console.log(res);
        this.setState({ bookPutSuccess: true });
        this.setState({ snackBarOpen: true });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ bookPutSuccess: false });
        this.setState({ snackBarOpen: true });
      });
    }

    onChange = (e) => {
      this.setState({ [e.target.id]: e.target.value });
    };

  render() {
    const { classes } = this.props;
    const {firstName, lastName, email, address, zipCode} = this.state.userData
    // console.log(userData);
    // const { classes, userData } = this.props;
    // console.log(userData);
    if (this.state.isLoading) {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CircularProgressComponent style={{ margin: "auto" }} />
          </div>
        );
      } else{
    return (
      <>
        <Paper className={classes.paper}>
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
                justify="flex-start"
                style={{ marginTop: "5px" }}
              >
                <Grid item container direction="column" xs={6}>
                  <Grid item xs>
                    <Typography
                      variant="h4"
                      // color="primary"
                      style={{
                        color:
                          "linear-gradient(315deg, #000000 0%, #414141 74%)",
                      }}
                    >
                      {firstName} {lastName}
                    </Typography>
                  </Grid>

                  <Grid item xs>
                    <Typography
                      variant="h5"
                      // color="primary"
                      style={{
                        color:
                          "linear-gradient(315deg, #000000 0%, #414141 74%)",
                      }}
                    >
                      {email}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs>
                    <Link href="#">
                      <Typography
                        variant="h6"
                        // color="primary"
                        style={{
                          color:
                            "linear-gradient(315deg, #000000 0%, #414141 74%)",
                        }}
                      >
                        something
                      </Typography>
                    </Link>
                  </Grid> */}
                </Grid>

                <Grid item >
                  <div className={classes.imageDiv}>
                    <img
                      alt="Profile"
                        src= {avatarImage}
                      //   variant="square"
                      style={{
                        height: "150px",
                        width: "auto",
                        objectFit: "cover",
                        paddingTop: "10px",
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Grid
            container
            // className={classes.contentWrapper}

            // justify="space-evenly"
            // alignItems="center"
            spacing={3}
          >
            <Grid item xs={6} style={{ paddingLeft: "30px" }}>
            <Typography variant="h5">
                <br />
                     Address: 
              </Typography>
              <Typography variant="h6">
                    {address} - {zipCode}
              </Typography>
              
            </Grid>
            <Grid item xs={6}>
              <Grid item>
                <br />
                <br/>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => {
                        this.handleClickOpenFormDialog();
                      }}
                  >
                   Change Address
                  </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={this.state.openFormDialog} onClose={this.handleCloseFormDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Address Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new address you want to be associated with your account!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="New Address"
            fullWidth
            onChange={this.onChange}
            value={this.state.address}
          />
              <TextField
            margin="dense"
            id="zipCode"
            label="Zip Code"
            fullWidth
            onChange={this.onChange}
            value={this.state.zipCode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseFormDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={
            ()=>
            {
                this.updateAddress();
                this.handleCloseFormDialog()
            }}
            color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }}
}

export default withStyles(useStyles)(Profile);