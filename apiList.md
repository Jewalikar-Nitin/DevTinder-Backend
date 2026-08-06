# API

## Auth
- POST /signup
- POST /login
- POST /logout

## Profile
- GET /profile/view
- POST /profile/update

## Request
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## User
- GET user/requests
- GET user/connections
- GET user/feed


Status : interested, ignored, accepted, rejected