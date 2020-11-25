import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CircularProgressComponent() {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress style={{ margin: "auto" }} />
      </div>
      )
    </>
  );
}
