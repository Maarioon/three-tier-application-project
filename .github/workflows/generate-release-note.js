import { Octokit } from '@octokit/rest';

async function generateReleaseNotes() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data: releases } = await octokit.repos.listReleases({
      owner: process.env.GITHUB_REPOSITORY.split('/')[0],
      repo: process.env.GITHUB_REPOSITORY.split('/')[1]
    });

    console.log('# Release Notes');
    console.log(`Generated on: ${new Date().toISOString()}`);
    console.log('');

    if (releases.length > 0) {
      releases.slice(0, 5).forEach(release => {
        console.log(`## ${release.tag_name}`);
        console.log(`Created at: ${release.created_at}`);
        console.log(release.body || 'No description');
        console.log('');
      });
    } else {
      console.log('No previous releases found.');
    }
  } catch (error) {
    console.error('Error generating release notes:', error);
    process.exit(1);
  }
}

function retry(fn, retries = 3) {
  return fn().catch(err => retries > 1 ? retry(fn, retries - 1) : Promise.reject(err));
}

retry(generateReleaseNotes);
