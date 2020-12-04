import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { CardHeader } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from "axios";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
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
  root: {
    maxWidth: 365,
  },
  media: {
    background: "linear-gradient(315deg, #e7eff9 0%, #cfd6e6 74%)",
  },

  mediaImage: {
    maxWidth: "100%",
    // height: "140",
    maxHeight: "300px",
    // objectFit: "cover",
    margin: 0,
    // paddingTop: "56.25%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ListedBookCard(props) {
  const {
    classes,
    bookName,
    authorName,
    price,
    condition,
    comments,
    address,
    zipCode,
    owner,
    imageURL,
  } = props;

  const { user } = props; // Get user data

  // Snackbar hooks
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [emailSuccess, setEmailSuccess] = React.useState(false);

  //Form Dialog hooks
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [messageBody, setMessageBody] = React.useState("");

  const handleClickOpenFormDialog = () => {
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const emailOwner = (user, owner, bookName) => {
    console.log(user);
    const emailObj = {
      toEmail: owner,
      ccEmail: user.email,
      bookName,
      message: messageBody,
    };
    console.log("Email object check")
    console.log(emailObj);
    axios
      .post(`http://localhost:5000/api/users/emailOwner`, emailObj)
      .then((res) => {
        console.log(res);
        setEmailSuccess(true);
        setOpenSnackBar(true);
        // console.log(res.data);
      })
      .catch((error) => {
        setEmailSuccess(false);
        setOpenSnackBar(true);
        console.log(error);
      });
  };

  return (
    // <Paper className={classes.paper}>
    <>
      <Paper>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}

              // image={require("./images/temp_image.jpg")}
              // title="Contemplative Reptile"
            >
              <img className={classes.mediaImage} src={imageURL} />
            </CardMedia>
            <CardHeader title={bookName} subheader={authorName}></CardHeader>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                <b>Price:</b> {price}$ <br />
                <b>Condition:</b> {condition} <br />
                <b>Location:</b> {address}, {zipCode} <br />
                <b>Comments:</b> {comments} <br />
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              // id={_id}
              onClick={() => {
                // sendConnectionRequest(_id, startupName, user, email);
                handleClickOpenFormDialog();
                // handleClick();
              }}
            >
              <EditIcon/>{" "}Edit
            </Button>
            <Button
              size="small"
              color="secondary"
              // id={_id}
              // onClick={() => getProfile(_id, isMentor, handleViewingProfile)}
            >
             <DeleteIcon/>{" "}Delete
            </Button>
          </CardActions>
        </Card>
      </Paper>

      <Dialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Contact the Owner! </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the message that you'd like to send the owner! (Share
            your contact information, or decide on a pickup location.)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            onChange={(e) => setMessageBody(e.target.value)}
            value={messageBody}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              emailOwner(user, owner, bookName);
              handleCloseFormDialog();
            }}
            color="primary"
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        message="Email sent successfully!"
      >
        {emailSuccess ? (
          <Alert onClose={handleCloseSnackBar} severity="info">
            Email sent succesfully!
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackBar} severity="error">
            Something went wrong with the email :(
          </Alert>
        )}
      </Snackbar>
    </>
  );
}

ListedBookCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListedBookCard);
