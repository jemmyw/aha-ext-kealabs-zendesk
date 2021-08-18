import React from "react";
import { RecoilRoot } from "recoil";
import { Spinner } from "../components/Spinner";
import { TicketsTable } from "../components/TicketsTable/TicketsTable";
import { ZendeskAuth } from "../components/ZendeskAuth";
import { IDENTIFIER, settings } from "../extension";
import { zendeskFetch } from "../store/zendeskFetch";

const panel = aha.getPanel(IDENTIFIER, "dashboardPanel", { name: "Zendesk" });

const Panel: React.FC<{ viewId: number }> = ({ viewId }) => {
  return (
    <React.Suspense fallback={<Spinner />}>
      <ZendeskAuth>
        <TicketsTable viewId={viewId} />
      </ZendeskAuth>
    </React.Suspense>
  );
};

panel.on(
  "render",
  ({
    props: {
      panel: { settings },
    },
  }) => {
    const viewId = settings.view;

    if (!viewId) {
      return <div>Please select a view in the panel settings.</div>;
    }

    return (
      <RecoilRoot>
        <Panel viewId={Number(viewId)} />
      </RecoilRoot>
    );
  }
);

panel.on({ action: "settings" }, () => {
  return [
    {
      key: "view",
      title: "View",
      type: "Select",
      options: async () => {
        const authData = await aha.auth("zendesk", {
          useCachedRetry: true,
          reAuth: true,
          parameters: { subdomain: settings.subdomain },
        });

        const response = await zendeskFetch<Zendesk.Views>(
          settings.subdomain,
          {
            state: "authed",
            token: authData.token,
          },
          { path: "/views" }
        );

        return response.views
          .filter((view) => view.active)
          .map((view) => ({
            value: view.id,
            text: view.title,
          }));
      },
    },
  ] as Aha.PanelSetting[];
});
