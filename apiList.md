# API

## Auth
- POST /signup
- POST /login
- POST /logout

## Profile
- GET /profile/view
- PATCH /profile/update
- PATCH /profile/password    // update password

## Request
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

## User
- GET user/requests
- GET user/connections
- GET user/feed


Status : interested, ignored, accepted, rejected