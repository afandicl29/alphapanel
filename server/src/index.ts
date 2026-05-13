/**
 * Alphapanel API — jalan di Linux sebagai proses Node (systemd).
 * Fase berikutnya: auth, integrasi Apache/Nginx, MySQL, Dovecot, dll.
 */
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.ALPHAPANEL_PORT ?? 8787);

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "alphapanel-server", ts: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Alphapanel API listening on :${port}`);
});
