import {
  AuthState,
  ZendeskFetchOptions,
  ZendeskFetchDataOptions,
} from "./zendesk";

export async function zendeskFetch<T>(
  subdomain: string,
  authData: AuthState,
  options: ZendeskFetchOptions | ZendeskFetchDataOptions
) {
  const method = options.method || "GET";
  const path = options.path;

  if (!subdomain) {
    throw new aha.ConfigError(
      "Missing subdomain. Please configure a subdomain in the extension settings."
    );
  }

  if (authData.state !== "authed") {
    throw new aha.AuthError("Not authed to Zendesk");
  }

  let body = null;
  if (options.method === "POST" || options.method === "PUT") {
    body = JSON.stringify(options.data);
  }

  const response = await fetch(
    `https://${subdomain}.zendesk.com/api/v2${path}`,
    {
      method,
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
      body,
    }
  );

  if (response.status !== 200) {
    throw new Error(
      `Zendesk request failed: ${response.status} ${
        response.statusText
      }: ${await response.text()}`
    );
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result as T;
}
