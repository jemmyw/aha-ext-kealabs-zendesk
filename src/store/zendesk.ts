import { atom, noWait, selector, selectorFamily, waitForAll } from "recoil";
import { settingSelector } from "./aha";
import { zendeskFetch } from "./zendeskFetch";

export const forceZendeskAuthState = atom({
  key: "forceZendeskAuth",
  default: false,
});

interface AuthedState {
  state: "authed";
  token: string;
}
interface UnauthedState {
  state: "unauthed";
}
interface ErrorState {
  state: "error";
  error: string;
}
export type AuthState = AuthedState | UnauthedState | ErrorState;

export const zendeskAuthSelector = selector<AuthState>({
  key: "zendeskAuthToken",
  get: async ({ get }) => {
    const subdomain = get(settingSelector("subdomain"));
    const force = get(forceZendeskAuthState);

    try {
      const authData = await aha.auth("zendesk", {
        useCachedRetry: true,
        reAuth: force,
        parameters: { subdomain },
      });

      return { state: "authed", token: authData.token };
    } catch (error) {
      if (force) return { state: "error", error };
      return { state: "unauthed" };
    }
  },
});

export const zendeskRefreshId = atom({
  key: "zendeskRefreshId",
  default: 0,
});

export interface ZendeskFetchOptions {
  method?: "GET" | "HEAD" | "DELETE";
  path: string;
}
export interface ZendeskFetchDataOptions {
  method?: "PUT" | "POST";
  path: string;
  data?: any;
}

export const zendeskFetchSelector = selectorFamily<
  unknown,
  Readonly<ZendeskFetchOptions | ZendeskFetchDataOptions>
>({
  key: "zendeskFetch",
  get:
    (options) =>
    async ({ get }) => {
      const refreshId = get(zendeskRefreshId);
      const subdomain = get(settingSelector("subdomain")) as string;
      const authData = get(zendeskAuthSelector);

      return await zendeskFetch(subdomain, authData, options);
    },
  cachePolicy_UNSTABLE: {
    eviction: "lru",
    maxSize: 10,
  },
});

export const zendeskViewsSelector = selector({
  key: "zendeskViews",
  get: ({ get }) => {
    const response = get(
      zendeskFetchSelector({ path: "/views" })
    ) as Zendesk.Views;
    return response.views.filter((view) => view.active);
  },
});

export const zendeskViewSelector = selectorFamily({
  key: "zendeskView",
  get:
    (viewId: number) =>
    async ({ get }) => {
      const [view, execution] = get(
        waitForAll([
          zendeskFetchSelector({ path: `/views/${viewId}` }),
          zendeskFetchSelector({ path: `/views/${viewId}/execute` }),
        ])
      ) as [{ view: Zendesk.View }, Zendesk.Execution];

      return {
        ...view,
        execution,
      };
    },
});

export const zendeskViewGroupedDataSelector = selectorFamily<
  {
    [index: string]: Zendesk.Row[];
  },
  number
>({
  key: "zendeskViewGroups",
  get:
    (viewId: number) =>
    ({ get }) => {
      const { view, execution } = get(zendeskViewSelector(viewId));
      const group = view.execution.group;

      if (!group) {
        return { "": execution.rows };
      }

      const rows = execution.rows;
      if (execution.sort_by) {
        rows.sort((a, b) => {
          const aValue = a[execution.sort_by];
          const bValue = b[execution.sort_by];
          if (aValue < bValue) return -1;
          if (aValue > bValue) return 1;
          return 0;
        });

        if (execution.sort_order === "desc") {
          rows.reverse();
        }
      }

      return execution.rows.reduce((acc, row) => {
        const groupName = String(row[group.id]);
        return {
          ...acc,
          [groupName]: [...(acc[groupName] || []), row],
        };
      }, {});
    },
});

export const zendeskViewGroupsSelector = selectorFamily({
  key: "zendeskViewGroups",
  get:
    (viewId: number) =>
    ({ get }) => {
      const {
        view: { execution },
      } = get(zendeskViewSelector(viewId));
      const groupData = get(zendeskViewGroupedDataSelector(viewId));

      switch (execution.group?.order) {
        case "asc":
          return Object.keys(groupData).sort();
        case "desc":
          return Object.keys(groupData).sort().reverse();
        default:
          return Object.keys(groupData);
      }
    },
});

export const zendeskViewGroupSelector = selectorFamily<
  Zendesk.Row[],
  { viewId: number; groupName: string }
>({
  key: "zendeskViewGroup",
  get:
    ({ viewId, groupName }) =>
    ({ get }) =>
      get(zendeskViewGroupedDataSelector(viewId))[groupName],
});
