import React from "react";
import { useRecoilValue } from "recoil";
import { zendeskViewGroupSelector } from "../../store/zendesk";
import { columnFormatter } from "./columnFormatter";

export const Group: React.FC<{
  viewId: number;
  groupName: string;
  Formatter: ReturnType<typeof columnFormatter>;
  formatters: ReturnType<typeof columnFormatter>[];
}> = ({ viewId, groupName, Formatter, formatters }) => {
  const rows = useRecoilValue(zendeskViewGroupSelector({ viewId, groupName }));

  return (
    <tbody>
      {groupName && (
        <tr className="zendesk-ticket-group">
          <td
            colSpan={formatters.length}
            style={{
              backgroundColor: "var(--theme-tertiary-background)",
            }}
          >
            <Formatter row={rows[0]} />
          </td>
        </tr>
      )}
      {rows.map((row, rdx) => (
        <tr key={row.ticket.id} className="zendesk-ticket">
          {formatters.map((Formatter, cdx) => (
            <td
              key={`${rdx}-${cdx}`}
              colSpan={cdx === formatters.length - 1 ? 2 : 1}
            >
              <Formatter row={row} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
