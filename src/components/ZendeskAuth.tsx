import React from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { forceZendeskAuthState, zendeskAuthSelector } from "../store/zendesk";

export const ZendeskAuth: React.FC<{}> = ({ children }) => {
  const authState = useRecoilValue(zendeskAuthSelector);
  const forceAuth = useRecoilCallback(({ set }) => {
    return () => set(forceZendeskAuthState, true);
  });

  if (authState.state === "unauthed") {
    return (
      <aha-button type="primary" onClick={forceAuth}>
        Authenticate with Zendesk
      </aha-button>
    );
  }

  if (authState.state === "error") {
    return <div className="error">Authentication error: {authState.error}</div>;
  }

  return <>{children}</>;
};
