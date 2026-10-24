import { app, PORT } from './app.js';

app.listen(PORT, () => {
  console.log(`[NetFlow Server] Listening on http://localhost:${PORT}`);
});
