import type { ChangelogConfig } from 'changelogen';

const Configuration: Partial<ChangelogConfig> = {
  templates: {
    commitMessage: 'release: v{{newVersion}}',
  },
};

module.exports = Configuration;
