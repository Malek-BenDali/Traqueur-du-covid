import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "../style/InfoBox.css";

function InfoBox({ title, cases, total, active, couleur, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        couleur==='rouge' && "infoBox--red"} ${couleur==='noir' && "infoBox--black"}`
      }
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox ${
        couleur==='noir' && "infoBox__cases--black"} ${couleur==='vert' && "infoBox__cases--green"} ${couleur==='rouge' && "infoBox__cases"}`
      }>
         {cases} <small> Aujourd'hui </small>
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
        Total: {total} 
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
