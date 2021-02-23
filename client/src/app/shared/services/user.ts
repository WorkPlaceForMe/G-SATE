export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  admin?: boolean;
  service_string?: string;
}
