import React from "react";

export default function Cell(props) {
  const isFood = props.isFood;
  const isHead = props.isHead;
  const currDir = props.currDir;
  const isBody = props.isBody;

  return (
    <div
      style={{
        height: 20,
        width: 20,
        border: "1px solid black",
        "text-align": "center",
      }}
    >
      {isFood
        ? "o"
        : isHead
        ? currDir === "r"
          ? ">"
          : currDir === "l"
          ? "<"
          : currDir === "u"
          ? "^"
          : "v"
        : isBody
        ? "■"
        : ""}
    </div>
  );
}
