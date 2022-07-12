// tsconfig.json paths를 사용하기 위함
import "module-alias/register";
import "reflect-metadata";
import app from "@/app";

const { server, PORT } = app;

const init = () =>
  server.listen(PORT, () => console.log(`${PORT} Server Start!`));

init();
