const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const html = require('remark-html');
const glob = require('glob');
const express = require('express');
const { WebSocketServer } = require('ws');
const chokidar = require('chokidar');

const profiles = require('./profiles-loader');

async function buildSite(profileKey) {
  const profile = profiles.getProfile(profileKey);
  const publicDir = profile.publicDir;
  const siteDir = profile.siteDir;

  const files = glob.sync(path.join(publicDir, '**/*.mdx'));
  const pages = [];

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const { data, content } = matter(raw);

    if (data.visibility !== 'public') continue;

    const processed = await remark().use(html).process(content);
    const bodyHtml = String(processed);
    const slug = data.slug;
    if (!slug) continue;

    const page = {
      ...data,
      slug,
      html: bodyHtml
    };

    await fs.outputJson(
      path.join(siteDir, 'api', 'pages', `${slug}.json`),
      page,
      { spaces: 2 }
    );

    const fullHtml = `<!doctype html>
