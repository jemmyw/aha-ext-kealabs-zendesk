import { DateTime } from "luxon";
import React from "react";

export function idToData(id: Zendesk.ID | null, execution: Zendesk.Execution) {
  return (row: Zendesk.Row) => {
    if (!id) return null;

    switch (id) {
      case "created":
      case "updated":
        const date = new Date(row[id]);
        const relative = DateTime.fromJSDate(date).toRelative();
        return relative;
      case "requester":
      case "assignee":
        const user_id = row[`${id}_id`];
        const user = execution.users.find((u) => u.id === user_id);

        return user?.name;
      case "custom_status_id":
        const status = execution.custom_statuses?.find(
          (s) => s.id === row["custom_status_id"]
        );

        return status?.name;
    }

    return row[id];
  };
}

export function columnFormatter(
  column: Zendesk.Column | Zendesk.Group | null,
  execution: Zendesk.Execution,
  subdomain: string
): React.FC<{ row: Zendesk.Row }> {
  if (!column) return () => <></>;
  const idTransformer = idToData(column.id, execution);

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
          {idTransformer(row)}
        </a>
      );
  }

  return ({ row }) => <>{idTransformer(row)}</>;
}
