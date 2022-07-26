import child_process from 'node:child_process';
import util from 'node:util';
import Path from '@mojojs/path';
import t from 'tap';

const execFile = util.promisify(child_process.execFile);

t.test('Create', async t => {
  const path = (await new Path('bin.js').realpath()).toString();

  await t.test('Help', async t => {
    const {stdout, stderr} = await execFile('node', [path, '-h']);
    t.match(stdout, /Usage: APPLICATION create-lite-app/s);
    t.equal(stderr, '');
  });

  await t.test('Defaults', async t => {
    const dir = await Path.tempDir();
    const cwd = process.cwd();
    process.chdir(dir.toString());

    const {stdout, stderr} = await execFile('node', [path]);
    t.match(stdout, /Generating single file application:/s);
    t.equal(stderr, '');
    t.ok(await dir.child('index.js').exists());
    t.ok(await dir.child('package.json').exists());
    t.match(await dir.child('index.js').readFile('utf8'), /app.start()/s);
    t.match(await dir.child('package.json').readFile('utf8'), /@mojojs/s);

    process.chdir(cwd);
  });

  await t.test('Custom name', async t => {
    const dir = await Path.tempDir();
    const cwd = process.cwd();
    process.chdir(dir.toString());

    const {stdout, stderr} = await execFile('node', [path, 'foo.js']);
    t.match(stdout, /Generating single file application:/s);
    t.equal(stderr, '');
    t.ok(await dir.child('foo.js').exists());
    t.ok(await dir.child('package.json').exists());

    process.chdir(cwd);
  });
});
