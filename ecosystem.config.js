module.exports = {
  apps : [{
    name      : 'API',
    script    : 'app.js',
    exec_mode : 'cluster',
    instances : '-1',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '163.172.147.209',
      ref  : 'origin/master',
      repo : 'git@github.com:keymetrics/pm2-masterclass.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
