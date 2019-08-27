module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'detectInactive0',
      script    : 'dist/server.js',
      interpreter : 'node@11.15.0',
      instances: 2,
      exec_mode: "cluster",
      cron_restart: "01 01 * * * *",
      restart_delay : "4000",
      watch: ['src'],
      increment_var : 'SLICEIDX',
      ignore_watch : ['node_modules'],
      watch_options: {
         followSymlinks: 'false'
      },
      env: {
        SLICEIDX: 0,
        SLACK_BOT_AUTH_TOKEN: 'blablablza'
      },
    },
  ],
};
