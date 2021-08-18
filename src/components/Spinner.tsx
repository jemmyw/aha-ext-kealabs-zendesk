import React from "react";

export const Spinner: React.FC<{}> = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100px",
      }}
    >
      <aha-spinner size="48px" />
    </div>
  );
};
