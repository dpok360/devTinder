# DevTinder APIs

## authaRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:userId

- GET /user/connections
- GET /user/requests
- GET /feed - gets you profile of others users

  Status: ignore, interested, accepted, rejected
