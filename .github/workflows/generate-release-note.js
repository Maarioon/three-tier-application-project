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
    // Enhanced error logging
    console.error('Error generating release notes:', error.message);
    console.error('Error stack trace:', error.stack);
    process.exit(1);
  }
}

generateReleaseNotes();
