# jobads-webapp
Job Ads Text Mining Project Web app interface.

## Clone this repo

Use the command `git clone https://github.com/tpucci/jobads-webapp.git`.

## Wiki

A wiki is provided : check it [here](https://github.com/tpucci/jobads-webapp/wiki).

## Requirements

This project requires a NodeJS server `^6.9.2` and NPM `^3.10.9`.

## Development

### React app

You can build the React development app running `gulp watch`. Gulp watcher will refresh your local `public` directory every time you make a change.

### Backend

You need to restart the NodeJS Express server every time you make a change on the api source file :

```javascript
^C
npm start
```

## Build and deploy

You can build the React app running `gulp build`.
Flow is optimized by automatically deploying to staging using GitHub integratiopn on Heroku.
"For example whenever the master branch is updated on GitHub and continuous integration (CI) tests pass, staging can be auto-deployed."[Learn more](https://devcenter.heroku.com/articles/pipelines#github-sync)
