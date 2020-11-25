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

function BookCard(props) {
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

  return (
    // <Paper className={classes.paper}>

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
              //   handleClickOpenForm();
              // handleClick();
            }}
          >
            Connect
          </Button>
          <Button
            size="small"
            color="primary"
            // id={_id}
            // onClick={() => getProfile(_id, isMentor, handleViewingProfile)}
          >
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Paper>
  );
}

BookCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BookCard);
