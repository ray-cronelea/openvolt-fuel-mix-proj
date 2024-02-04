import * as path from 'path';
import * as compose from 'docker-compose';


/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;
var __COMPOSE__: any;

module.exports = async function () {
  // Start services that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...');

  globalThis.__COMPOSE__ = compose;

  try {

    await globalThis.__COMPOSE__.pullAll({
      cwd: path.join(__dirname),
      callback: (chunk: Buffer) => {
        console.log('pulling images: ', chunk.toString());
      },
    });

    await globalThis.__COMPOSE__.upAll({
      cwd: path.join(__dirname),
      commandOptions: [['--build'], ['--force-recreate']],
      callback: (chunk: Buffer) => {
        console.log('starting: ', chunk.toString());
      },
    });

    console.log('Waiting 5 seconds for the services to warm-up')

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Boot-up completed.');
  } catch (err) {
    console.log('Something went wrong during docker compose boot-up:', err.message);
  }

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
