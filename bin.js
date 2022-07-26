#!/usr/bin/env node
import mojo from '@mojojs/core';

const app = mojo({detectImport: false});
app.start('create-lite-app', ...process.argv.slice(2));
