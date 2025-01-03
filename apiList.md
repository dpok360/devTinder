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

- POST /request/send/status/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:userId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /feed - gets you profile of others users

- GET /feed?page=1&limit=10 =>first 10 users 1-10
- GET /feed?page=2&limit=20 =>first 10 users 11-20

  Status: ignore, interested, accepted, rejected
