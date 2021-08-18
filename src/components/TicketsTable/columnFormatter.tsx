import { DateTime } from "luxon";
import React from "react";

export function columnFormatter(
  column: Zendesk.Column,
  execution: Zendesk.Execution,
  subdomain: string
): React.FC<{ row: Zendesk.Row }> {
  switch (column.id) {
    case "subject":
      return ({ row }) => (
        <a
          target="_blank"
          href={aha.sanitizeUrl(
            `https://${subdomain}.zendesk.com/agent/tickets/${row.ticket.id}`
          )}
          rel="noreferrer noopener"
        >
          {row[column.id]}
        </a>
      );
    case "created":
    case "updated":
      return ({ row }) => {
        const date = new Date(row[column.id]);
        const relative = DateTime.fromJSDate(date).toRelative();
        return <>{relative}</>;
      };
    case "requester":
      return ({ row }) => {
        const requester = execution.users.find(
          (u) => u.id === row["requester_id"]
        );

        return <>{requester?.name}</>;
      };
  }

  return ({ row }) => <>{row[column.id]}</>;
}
