## Architecture

The backend architecture was based on this [article](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Uncle Bob.

In short, each layer is closed, meaning that only a layer knows about itself. When a request enters the system, it can only go to a certain layer if it passes through a higher layer. For example, a request can only reach the data layer if it passes through the domain layer. An exception to this rule could be a utils layer, because multiple layers can use its components.

- Presentation: defines the client interface. This is where HTTP requests and errors are handled.
- Domain: defines the business logic and use cases (create course, list courses, update course, authentication, etc.). Only the business logic interfaces are defined here, not the actual implementation. No operational changes in the software (database, security, protocol, structure) should affect this layer.
- Data: implements the use cases defined in the Domain layer.
- Repositories: communicates with the external world (databases, HTTP requests). This layer is responsible for converting the data received from external sources into the format used by the rest of the application.
- Main: ties all the layers together. It's the only coupled layer and follows the `Composite` design pattern. If you want to explore the code, I suggest starting here, as it’s where all the system modules are instantiated and linked together.

Dependency Injection was used to make components not depend on concrete objects and insted depend on interfaces, making the code much more flexible and testable. For example, the `CreateCourseController` class depends on two interfaces: `SaveCourse` and `Validator`. The only thing this class knows is that when `SaveCourse` is executed it save the courses into some database, no matter what database it is (filesystem, SQL database, cache, etc...) and how it is being saved. The same applies to `Validator`: `CreateCourseController` does not care how the fields are being validated and what library it is being used.

I also used the `Facade` pattern to create an abstraction layer uppon the `jsonwebtoken` library. If another library is chosen is the future or some generation logic is changed, the only file being affected is `src/utils/jwt.ts`.

A custom error handler was also made to enable the creation of more meaningful errors, that can be treated differently based on their type. For example `AuthError` can be thrown by the application when some unauthorized operations happens or the login fails; `NotFoundError` can be used when a resorce is not found; `ValidationError` can be used when the input validation fails. These errors are defined in the file `src/presentation/protocols/errors.ts` and are treated on the end of the file `src/main/index.ts` (line 163). As you can see, each error receives a different treatment based on its type.

I understand that this architecture is an ideal model to follow, and in practice, it's easy to deviate from this clear division of layers. However, I believe it's important to master these concepts, which is why I tried to fully apply them in this application.

### Input validation

I created a base validator that is defined on the file `src/presentation/protocols/validator.ts`. It uses the `Zod` library to validate inputs. All specific validators are based on this class and are injected in the controllers via parameter in the main file. The specific schemas and validator are in the file `src/presentation/validators/`.

### Database

Unfortunetelly, I had a hard time setting up the database for this application. I tried to use SQLite and for some reason the migrations would not run inside the Docker container. Because I had spent a great deal of time trying to fix it, I opted for implementing my own database, emulating the basic SQL operators (SELECT, WHERE, DELETE, UPDATE) in code. The database is in-memory, meaning it resets every time the application restarts. The database implementation is in the file `src/database/index.ts`.

Despite not being able to run the database, I created my `docker-compose` file simulating the use of a SQLite container as the database server.

## Tests

I chose to implement automated tests only in the Presentation layer, as it’s the most complex part of this project and involves many use cases working together. To explore the tests, I suggest starting with the file `src/presentation/controllers/createCourse.spec.ts`, which is the most complex test. To run the tests, use the command `npm run test`

## Points for Improvement

Due to the limited time I had, I couldn't implement a few things that I would have liked to. These include:

- Integration tests for the Repositories layer
- Abstracting dependency creation in the Main module (factories and helpers)
- Observability and logging

## Running the Project

To set up the environment variables, create a file named `.env` and copy the contents of `.env.example` into it. I’ve already set the environment variables with the values I used.

Then, navigate to the root directory and run the command below to build the image:

`sudo docker-compose up --build`

There are some warnings popping up when running `docker-compose` but they are because of the `npm i` command.

### Environment Variables

JWT_SECRET: secret for token generation

PORT: server access port

## Observations

The GET /courses endpoint can receive the filters "title" and "instructor" as query params and they will match any record that is strictly equal to the filter.
