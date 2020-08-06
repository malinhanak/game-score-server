# Game Score [Backend Project]

## Environmental Variables [ENV]

This project uses env's to work, following env need to be set:

- DB_URI: The DB uri (mongoDB)
- ADMIN_EMAIL: email address [1]
- ADMIN_PASS: password [1]
- ADMIN_NAME#1: name [1]
- SECRET_KEY: secret string of your choosing.

[1] The admin env's are necessary because when the server boots up it check if there is any admin
registered to the DB, if not it will attempt to create one. For that it needs an email, a password
and a name.
