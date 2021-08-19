import React from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { settingSelector } from "../../store/aha";
import {
  zendeskRefreshId,
  zendeskViewGroupsSelector,
  zendeskViewSelector,
} from "../../store/zendesk";
import { columnFormatter } from "./columnFormatter";
import { Group } from "./Group";

export const TicketsTable: React.FC<{
  viewId: number;
}> = ({ viewId }) => {
  const { execution } = useRecoilValue(zendeskViewSelector(viewId));
  const groups = useRecoilValue(zendeskViewGroupsSelector(viewId));
  const subdomain = useRecoilValue(settingSelector("subdomain")) as string;
  const { columns, rows } = execution;

  const refresh = useRecoilCallback(({ set }) => () => {
    set(zendeskRefreshId, (n) => (n += 1));
  });

  const formatters = columns.map((column) =>
    columnFormatter(column, execution, subdomain)
  );

  return (
    <table className="record-table record-table--settings-page">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id}>{col.title}</th>
          ))}
          <th>
            <aha-button
              type="unstyled"
              onClick={refresh}
              style={{
                color: "var(--theme-tertiary-text)",
                textAlign: "right",
              }}
            >
              <aha-icon icon="fa-regular fa-refresh" />
            </aha-button>
          </th>
        </tr>
      </thead>
      {rows.length === 0 && (
        <tbody>
          <tr>
            <td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
              No tickets
            </td>
          </tr>
        </tbody>
      )}
      {groups.map((groupName) => (
        <Group viewId={viewId} groupName={groupName} formatters={formatters} />
      ))}
    </table>
  );
};
