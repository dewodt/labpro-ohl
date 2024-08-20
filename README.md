# Labpro OHL

## Description

Selection Assignment 3 Programming Laboratory Assistants 2024 ITB.

## Tools / Library Used

- [NestJS](https://nestjs.com/) v10.3.2 (Node.js Framework)
- [class-transformer](https://github.com/typestack/class-transformer) v0.5.1 (Class Utils)
- [class-validator](https://github.com/typestack/class-validatorbcryp) v0.14.1 (Validation Utils with Class)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) v5.1.1 (Password Hashing)
- [cloudinary](https://cloudinary.com/) v2.4.0 (Bucket SaaS)
- [handlebar](https://handlebarsjs.com/) v4.2.0 (Template Engine)
- [PostgreSQL](https://www.postgresql.org/) (SQL Database)
- [TypeORM](https://typeorm.io/) v10.0.0 (ORM)
- [TailwindCSS](https://tailwindcss.com/) v3.4.10 (CSS Library)
- [faker-js](https://fakerjs.dev/) v8.4.1 (Generate Data)
- [Docker](https://www.docker.com/) v27.1.2 (Container)
- [Railway](https://railway.app/) (Deployment)

## How To Run

### Deployed

1. For the monolith app, visit [https://labpro-ohl.dewodt.com/](https://labpro-ohl.dewodt.com/)

2. For the admin app, visit [https://labpro-fe.hmif.dev/](https://labpro-fe.hmif.dev/)

   - Enter [https://labpro-ohl.dewodt.com](https://labpro-ohl.dewodt.com) as the monolith app link
   - The default `ADMIN` account provided by production seeding is (`username=admin`, `password=admin123`)

3. Done!

### Docker

1.  Copy `.env.example` file then paste and rename it into `.env.development` and `.env.production` in the root project (also change NODE_ENV into the correct enviroment).

2.  Install dependencies (`tailwind --watch` or `make run-tw-dev` is not containerized)

    ```bash
    npm install
    ```

3.  Create a docker network

    ```bash
    make init-network
    ```

    or (if you don't have a makefile)

    ```bash
    docker network create labpro-ohl-network
    ```

4.  Run the local docker PostgreSQL database

    ```bash
    run-db-dev:
    ```

    or (if you don't have a makefile)

    ```bash
    docker compose up --build labpro-ohl-db-dev
    ```

5.  Seed the local database

    ```bash
    make run-seeder-dev
    ```

    or (if you don't have a makefile)

    ```bash
    docker compose up --build labpro-ohl-seeder-dev
    ```

6.  Run the app

    a. For Production (Recommended for Demo)

    ```bash
    make run-app-prod
    ```

    or (if you don't have a makefile)

    ```bash
    docker compose up --build labpro-ohl-app-prod
    ```

    This will build the NestJS project and also compile & minify the css and typescript files for the front-end in `./assets` save it into `./public`.

    b. For Development (with reloading on change)

    Run the NestJS development server,

    ```bash
    make run-app-dev
    ```

    Run the tailwind (in `./assets`) compiler with watch

    ```bash
    make run-tw-dev:
    ```

    Run the typescript (in `./assets`) compiler with watch

    ```bash
    make run-client-dev
    ```

    Or (if you don't have a makefile)

    ```bash
    docker compose up --build labpro-ohl-app-dev
    ```

    ```bash
    npm run build:tailwind:dev
    ```

    ```bash
    npm run build:client:dev
    ```

7.  To reset the docker and the database,

    ```bash
    make reset
    ```

    Or (if you don't have a makefile)

    ```bash
    docker compose down -v
    sudo rm -rf ./db-data
    sudo rm -rf ./dist
    ```

8.  To stop the container,

    ```bash
    make stop
    ```

    Or (if you don't have a makefile)

    ```bash
    docker compose down
    ```

### Important Notes

- Local docker build uses different database from deployed app (local uses local docker db, but deployed uses deployed postgres db in railway).

- Local docker build also uses different cloudinary enviroment from deployed app.

## Design Pattern Used

1. Decorator Pattern

   Decorator pattern is used in several ways. The built-in NestJS one is used to state which controller accepts which http request method, what the response is, etc. The custom one (made by yourself), is to easily indicate which routes are public (can be accessed by everyone), and also which role access (admin/regular) can access the endpoint.

2. Factory Pattern

   Factory pattern is used in creating response objects. Response objects have the same data structure in the specification (status, message, and data). Factory pattern is used to create several types of responses (success, and error).

3. Strategy Pattern

   Strategy patterns are used to easily implement a contract in various ways. In this project, the strategy pattern is used in creating Authentication Guard with the JWT strategy. The strategy pattern is also used to create custom validation pipes with serveral strategy.

## Endpoints

The complete endpoint documentation as well as their request & response can be seen from [https://labpro-ohl.dewodt.com/docs](https://labpro-ohl.dewodt.com/docs).

## Bonus

### 1. OWASP

- Broken Access Control

  Broken Access Control violation is prevented in this app. Since every `CREATE`, `UPDATE`, `DELETE` of `users` & `films` can only be done by the admin. This is possible by providing a authorization Guard `@UseGuards(JwtAuthGuard)` and also providing allowed roles decorator using `@Role(role.ADMIN)`. When regular users tries to access the API Endpoint authorized only for admin, it will give an http forbidden response.

  | ![Forbidden Response](./assets/readme/01-broken-access-control.jpeg?raw=true) |
  | :---------------------------------------------------------------------------: |
  |                              Forbidden Response                               |

- Insecure Design

  For the front end page, all of them are server side rendered (movies, my movies data, balance, ect). Thus by default there are no private data being exposed accidentally to the user (like through a GET end point) unless they are intentionally rendered into the page.

  For the back-end/REST API, all of the endpoints for mutating data (`CREATE`, `UPDATE`, `DELETE`) are already validated using authentication guards `@UseGuards(JwtAuthGuard)` and allowed roles decorator `@Role()`, thus unauthorized access is impossible. For the GET movie detail request, we also validate the user's role (if admin) or if the user has bought the film or not (if regular user), to return the video URL (because what's the point of buying a movie if you can access the link through the GET film detail api without buying it). For the front-end app, the JWT Token is stored in a HttpOnly cookie such that client-side scripts cannot get the data (preventing XSS, unlike storing it in localstorage). The cookie is also configured to have an expiration of 1 day to ensure auth authenticity.

  | ![SSR Architecture Design](./assets/readme/01-design.jpeg?raw=true) |
  | :-----------------------------------------------------------------: |
  |                       SSR Architecture Design                       |

- Injection

  The App uses TypeORM to communicate with the database. By default, TypeORMis safe from SQL injection because it uses parametrized queries under the hood. We can test this out by querying `'; DELETE FROM users; --` into the movies page (it uses serverside rendering, so the query params runs immediately on the server). To test this out, we logged the underlying sql result from the query. As you can see it uses parameterized queries (`$1`). After that, if we query the `users` table is still there!

  | ![SSR Architecture Design](./assets/readme/01-injection.jpeg?raw=true) |
  | :--------------------------------------------------------------------: |
  |                        SSR Architecture Design                         |

### 2. Deployment

- The app is deployed at[https://labpro-ohl.dewodt.com/movies](https://labpro-ohl.dewodt.com/movies) using railway.

- The database is also deployed at railway.

### 5. Lighthouse

These are the lighthouse scores on the public pages

- Login Page (mobile average: 95.75 > 95)

  | ![PageSpeed Login Page](./assets/readme/05-login-page.jpeg?raw=true) |
  | :------------------------------------------------------------------: |
  |                         PageSpeed Login Page                         |

- Register Page (mobile average: 95.75 > 95)

  | ![PageSpeed Register Page](./assets/readme/05-register-page.jpeg?raw=true) |
  | :------------------------------------------------------------------------: |
  |                          PageSpeed Register Page                           |

- Movies List Page (mobile average: 95.25 > 95)

  | ![PageSpeed Movies List Page](./assets/readme/05-movies-page.jpeg?raw=true) |
  | :-------------------------------------------------------------------------: |
  |                         PageSpeed Movies List Page                          |

- Movie Detail Page (mobile average 95.75 > 95)

  | ![PageSpeed Movies Detail Page](./assets/readme/05-movie-detail-page.jpeg?raw=true) |
  | :---------------------------------------------------------------------------------: |
  |                            PageSpeed Movies Detail Page                             |

### 6. Responsive Layout

Here are the pages in mobile and desktop view.

- Login Page

  | ![Desktop Login Page](./assets/readme/06-desktop-login.jpeg?raw=true) |
  | :-------------------------------------------------------------------: |
  |                          Desktop Login Page                           |

  | ![Mobile Login Page](./assets/readme/06-mobile-login.jpeg?raw=true) |
  | :-----------------------------------------------------------------: |
  |                          Mobile Login Page                          |

- Register Page

  | ![Desktop Register Page](./assets/readme/06-desktop-register.jpeg?raw=true) |
  | :-------------------------------------------------------------------------: |
  |                            Desktop Register Page                            |

  | ![Mobile Register Page](./assets/readme/06-mobile-register.jpeg?raw=true) |
  | :-----------------------------------------------------------------------: |
  |                           Mobile Register Page                            |

- Movie Lists Page

  | ![Desktop Avaiable Movie Lists Page](./assets/readme/06-desktop-movies.jpeg?raw=true) |
  | :-----------------------------------------------------------------------------------: |
  |                           Desktop Avaiable Movie Lists Page                           |

  | ![Mobile Avaiable Movie Lists Page](./assets/readme/06-mobile-movies.jpeg?raw=true) |
  | :---------------------------------------------------------------------------------: |
  |                          Mobile Avaiable Movie Lists Page                           |

- Movie Detail Page

  | ![PageSpeed Movies Detail Page](./assets/readme/06-desktop-movie-detail.jpeg?raw=true) |
  | :------------------------------------------------------------------------------------: |
  |                              PageSpeed Movies Detail Page                              |

  | ![PageSpeed Movies Detail Page](./assets/readme/06-mobile-movie-detail.jpeg?raw=true) |
  | :-----------------------------------------------------------------------------------: |
  |                             PageSpeed Movies Detail Page                              |

- My Movies Page

  | ![Desktop My Movies Page](./assets/readme/06-desktop-my-movies.jpeg?raw=true) |
  | :---------------------------------------------------------------------------: |
  |                            Desktop My Movies Page                             |

  | ![Mobile My Movies Page](./assets/readme/06-mobile-my-movies.jpeg?raw=true) |
  | :-------------------------------------------------------------------------: |
  |                            Mobile My Movies Page                            |

- Movie Detail Watch Page

  | ![Desktop Movie Detail Watch Page](./assets/readme/06-desktop-watch.jpeg?raw=true) |
  | :--------------------------------------------------------------------------------: |
  |                          Desktop Movie Detail Watch Page                           |

  | ![Mobile Movie Detail Watch Page](./assets/readme/06-mobile-watch.jpeg?raw=true) |
  | :------------------------------------------------------------------------------: |
  |                          Mobile Movie Detail Watch Page                          |

### 7. API Documentation

The API for this website is well documented and can be accessed from [https://labpro-ohl.dewodt.com/docs](https://labpro-ohl.dewodt.com/docs)

### 8. SOLID

- S: Single Responsibility

  One example of the single responsibility principle is that each class service or module is created for that module only. For example, a bucket. The bucket service has one responsibility, which is to perform basic operations on the bucket service (cloudinary).

- O: Open/Closed Principle

  The open/closed principle is used in creating the validation pipe (`validation.pipe.ts`). With the new validation needs, there is no need to change the existing code in NestJS, but we only need to extend and override some parts that need to be modified.

- L: Liskov Substitution Principle

  The Liskov substitution principle is used when creating the exception filter `RedirectUnauthorizedFilter`. The creation of this class implements an interface `ExceptionFilter` where with this, the new exception filter class can replace the base `ExceptionFilter` with `@UseFilters()` without any errors in the program.

- I: Interface Segregation Principle

  The interface segregation principle is applied to each dto response. Interface segregation states that the interface should be made as small as possible so as not to force a class to implement the interface and there are some unused methods/attributes. Each dto response data is specific to their needs.

- D: Dependency Inversion Principle

  By default NestJS uses a dependency injection system to use services between modules. This is done to improve modularity and also testability of each service (easy to do mocking). For example, the web module requires a service from the film module to render available movies, then we can inject the film service into the web module. And so on.

### 10. Additional Feature

- Light Mode / Dark Mode

  Default is lightmode. The theme setting is saved in localstorage.

  | ![Light Mode](./assets/readme/10-light-mode.jpeg?raw=true) |
  | :--------------------------------------------------------: |
  |                         Light Mode                         |

  | ![Dark Mode](./assets/readme/10-dark-mode.jpeg?raw=true) |
  | :------------------------------------------------------: |
  |                        Dark Mode                         |

### 11. Cloud

Movie cover images and videos are stored using cloudinary SaaS. Serveral important notes:

- Because i'm using [cloudinary free plan](https://cloudinary.com/pricing/compare-plans), maximum image file size is 10MB, and maximum video file size is 100MB.
- The cloudinary cloud for local docker build (which is in `.env.example`) is different with the one which is used for production (deployed).

## Author

|   NIM    |        Nama         |
| :------: | :-----------------: |
| 13522011 | Dewantoro Triatmojo |
