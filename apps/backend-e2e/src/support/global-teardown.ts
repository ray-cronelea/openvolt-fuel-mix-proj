/* eslint-disable */

import path from 'path';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.

  try {
    await globalThis.__COMPOSE__.down({
      cwd: path.join(__dirname),
      commandOptions: [['--volumes'], ['--remove-orphans'], ['-t', '1']],
      callback: (chunk: Buffer) => {
        console.log('stopping: ', chunk.toString());
      },
    });

    console.log('Shutdown completed.');
  } catch (err) {
    console.log('Something went wrong during docker compose shutdown:', err.message);
  }

  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
