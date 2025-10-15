# MiST4.0 Frontend — An Interactive Platform for Exploring Microbial Signal Transduction

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-757575?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![NgRx](https://img.shields.io/badge/NgRx-A100FF?style=for-the-badge&logo=reactivex&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)
![Custom Visualizations](https://img.shields.io/badge/Custom%20D3%20Visualizations-000000?style=for-the-badge&logo=visualstudio&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font%20Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white)


This is the frontend application of the MiST4.0 database, a comprehensive platform for the analysis and exploration of bacterial and archaeal signal transduction systems.

Built with modern technologies, the application delivers an intuitive and responsive user experience for biomedical researchers and bioinformaticians.

The web application is available at [mistdb.com](https://mistdb.com)

## Key Features:

- **RESTful API Integration**: Seamlessly connects to the MiST4.0 API, offering programmatic access to microbial genome and gene data. JSON responses support high-throughput analysis.

- **Smart Search System**: Allows querying microbial genomes and genes by various identifiers including organism names, taxonomy levels, RefSeq accessions, locus tags, and more—no need to specify identifier types.

- **Advanced Filtering**: Users can refine search results by taxonomy or genome assembly level via built-in filters or dropdown menus.

- **Detailed Genome and Gene Views**:
  - Genome detail pages show comprehensive information about the selected genome, Bioproject metadata, and signal transduction profiles as interactive graphs and tables.
  - Gene detail pages present domain architectures, feature annotations, and graphical gene neighborhoods.
  - The chemosensory systems table shows all the chemosensory pathways encoded in the given genome.

- **Scope Search**: Search genes and proteins within a specific genome context by setting a “scope” from search or genome detail pages.

- **Cart System**: Add genomes or genes to a cart for batch analysis or sequence download.

- **Dual Database Navigation**: Easily switch between Genomes and Metagenomes views using an integrated interface switcher, with distinct color themes and seamless backend routing.

- **Enhanced Visuals**: Protein domain diagrams are scaled proportionally with length indicators for visual comparison.

## Technologies:

Angular • Angular Material • TypeScript • JavaScript • NgRx • RxJS

D3.js and custom packages for data visualization

SCSS • PUG • HTML • Font Awesome

Explore the frontend powering a cutting-edge microbial informatics platform - designed for performance, clarity, and scientific insight.

## Development server

Run `npm start` or `yarn start` for a dev server. Navigate to `http://localhost:4300/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `./node_modules/.bin/webpack` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-p` flag for a production build.

<!--
## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.
-->
