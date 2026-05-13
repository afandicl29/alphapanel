import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Files } from "./pages/Files";
import { Databases } from "./pages/Databases";
import { Domains } from "./pages/Domains";
import { Email } from "./pages/Email";
import { Ftp } from "./pages/Ftp";
import { Ssl } from "./pages/Ssl";
import { Cron } from "./pages/Cron";
import { Metrics } from "./pages/Metrics";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="files" element={<Files />} />
        <Route path="databases" element={<Databases />} />
        <Route path="domains" element={<Domains />} />
        <Route path="email" element={<Email />} />
        <Route path="ftp" element={<Ftp />} />
        <Route path="ssl" element={<Ssl />} />
        <Route path="cron" element={<Cron />} />
        <Route path="metrics" element={<Metrics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
