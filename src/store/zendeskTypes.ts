declare namespace Zendesk {
  interface Views {
    count: number;
    next_page: null;
    previous_page: null;
    views: View[];
  }

  interface View {
    url: string;
    id: number;
    title: string;
    active: boolean;
    updated_at: Date;
    created_at: Date;
    position: number;
    description: null;
    execution: Execution;
    conditions: Conditions;
    restriction: Restriction;
    watchable: boolean;
    raw_title: string;
  }

  interface Conditions {
    all: All[];
    any: any[];
  }

  interface All {
    field: string;
    operator: string;
    value: string;
  }

  type Order = "asc" | "desc";

  interface Execution {
    group_by: string | null;
    group_order: Order | null;
    sort_by: string;
    sort_order: Order;
    group: Group | null;
    sort: Group;
    columns: Column[];
    fields: Column[];
    custom_fields: any[];
    custom_statuses?: any[];
  }

  interface Group {
    id: string;
    title: string;
    order: Order;
  }

  interface Restriction {
    type: string;
    id: number;
  }

  interface Execution {
    columns: Column[];
    groups: any[];
    rows: Row[];
    view: { id: number };
    users: ExecutionUser[];
  }

  interface Column {
    id: ID;
    title: string;
  }

  type ID = number | string;

  interface ExecutionUser {
    id: number;
    name: string;
    url: string;
  }

  interface Row {
    group: number;
    locale: string;
    ticket: RowTicket;
  }

  interface RowTicket {
    id: number;
    subject: string;
    description: string;
    status: string;
    type: string;
    priority: null;
    url: string;
    last_comment: LastComment;
  }

  interface LastComment {
    id: number;
    body: string;
    created_at: Date;
    author_id: number;
    public: boolean;
  }

  interface ViewWithExecution extends View {
    execution: Execution;
  }
}
