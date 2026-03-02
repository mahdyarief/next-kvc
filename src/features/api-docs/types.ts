export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export interface ApiEndpoint {
  category: string;
  method: HttpMethod;
  path: string;
  description: string;
  params: string;
  auth?: "SUPERADMIN" | "ADMIN" | "STAFF" | "USER" | "PUBLIC";
}
