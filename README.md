# xSPIRE

## Running the application:
Use 'npm start'

## API endpoints:
### /course?search=:term
searches for a course containing the term.
### /schedules
#### GET
Get all schedules
#### POST
Make a new schedule, with name specified by body
### /schedules/:id
#### GET
Get schedule with specified id
#### POST
Update schedule with specified id by adding a course, specified by body
#### DELETE
Delete schedule with specified id, or a course within that schedule