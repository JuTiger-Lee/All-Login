// tsconfig.json paths를 사용하기 위함
import 'module-alias/register';
import app from '@/app';

const {server, port} = app;

const init = () => server.listen(port, () => console.log(`${port} Server Start!`));

init();
