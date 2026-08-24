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
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestID
- 

## User
- GET user/requests/received
- GET user/connections
- GET user/feed


Status : interested, ignored, accepted, rejected