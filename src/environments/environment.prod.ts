import { RecoursesServerConfig, STSServerConfig } from "src/app/config/servers.config";

export const environment = {
  production: true,
  apiUrl: RecoursesServerConfig.PRODUCTION_APIs_URL,
  stsUrl: STSServerConfig.PRODUCTION_URL,
  version: 'Payroll-0.0.1',
  disableLogs: true,
  isProd: true
};
