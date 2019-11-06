// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
      'assets/js/jquery.min.js',
      'assets/js/jquery-1.12.4.js',
      'assets/js/jquery-ui.js',
      'assets/js/bootstrap.min.js',
      'assets/js/jquery_004.js',
      'assets/css/bootstrap.css',
      'assets/css/jquery-ui.css',
      'assets/css/br-movie-theme.css',
      'assets/css/br-default-theme.css',
      'assets/css/fullcalendar.css',
      'assets/css/styles.css',
      'assets/images/banner.png',
      'assets/images/calbtn.gif',
      'assets/images/exit.png',
      'assets/images/fav.png',
      'assets/images/grid_topbg.jpeg',
      'assets/images/login.png',
      'assets/images/myprofile.png',
      'assets/images/search_up.jpg',      
      'assets/images/sign_in.png', 
      'assets/images/sign_up.png', 
  
    ],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    crossOriginAttribute: false
  });
};