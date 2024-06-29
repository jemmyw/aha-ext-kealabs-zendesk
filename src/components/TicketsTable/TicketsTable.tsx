import React from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { settingSelector } from "../../store/aha";
import {
  zendeskGroupSelector,
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
  const group = useRecoilValue(zendeskGroupSelector(viewId));
  const groups = useRecoilValue(zendeskViewGroupsSelector(viewId));
  const subdomain = useRecoilValue(settingSelector("subdomain")) as string;
  const { columns, rows } = execution;

  const refresh: React.MouseEventHandler<HTMLAnchorElement> = useRecoilCallback(
    ({ set }) =>
      (event) => {
        event.preventDefault();
        set(zendeskRefreshId, (n) => (n += 1));
      }
  );

  const groupFormatter = columnFormatter(group, execution, subdomain);

  const formatters = columns.map((column) =>
    columnFormatter(column, execution, subdomain)
  );

  return (
    <div>
      <div
        style={{
          // background: "var(--theme-secondary-background)",
          width: "100%",
        }}
      >
        <a
          style={{
            border: 0,
            background: "none",
            color: "var(--aha-blue-500)",
            paddingLeft: "10px",
            cursor: "pointer",
            fontSize: "10px",
          }}
          onClick={refresh}
        >
          Refresh
        </a>
      </div>
      <table className="record-table record-table--settings-page">
        <thead>
          <tr>
            {columns.map((col) => (
              <th style={{ position: "sticky", top: "0px" }} key={col.id}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        {rows.length === 0 && (
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>No tickets</td>
            </tr>
          </tbody>
        )}
        {groups.map((groupName) => (
          <Group
            viewId={viewId}
            groupName={groupName}
            Formatter={groupFormatter}
            formatters={formatters}
          />
        ))}
      </table>
    </div>
  );
};
