# Changelog

## 3.21.0

### Minor Changes

- Add socket connection to update user's presence

## 3.20.0

### Minor Changes

- Allow to create membership profile manually

## 3.19.0

### Minor Changes

- Fix invitation and requesting to join as member. dont send invitation or dont join if you are the owner

## 3.18.0

### Minor Changes

- Request to join to others' entities. Approve or reject project member requests

## 3.17.0

### Minor Changes

- Approving and rejecting an invitation of an entity

## 3.16.0

### Minor Changes

- Invite multiple members at a time. Invite only members who are not already a member of the entity.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.15.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.14.1...v3.15.0) (2025-04-03)

### Features

- add invite member feature ([242ba99](https://github.com/ZeynalliZeynal/todoist-server/commit/242ba996f9f0534bd444c9e5252944d05afdec87))

### Bug Fixes

- add another handler in error-handler to handle CastError and duplicate value error from mongoose ([5f1f434](https://github.com/ZeynalliZeynal/todoist-server/commit/5f1f434667ce67accf9af1a05ecd288d731b7807))
- otpId is not set in payload ([39a998d](https://github.com/ZeynalliZeynal/todoist-server/commit/39a998da7934723ecf82fbdfe449319f9dd5de42))

### [3.14.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.14.0...v3.14.1) (2025-03-30)

### Bug Fixes

- remove userAgent middleware from profile controller ([70a2fff](https://github.com/ZeynalliZeynal/todoist-server/commit/70a2fff94258bbfb93ba104c3578016a3a6e13fb))

## [3.14.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.5.1...v3.14.0) (2025-03-29)

### Features

- implement notification settings router, controller, and services ([5d67302](https://github.com/ZeynalliZeynal/todoist-server/commit/5d67302f2d859926100cbd2910d6ce7d6284f29c))

## 3.13.0

### Minor Changes

- Enabling and disabling notifications

## 3.12.0

### Minor Changes

- don't create a new notification if it is disabled for the user.
- Update notification settings for all users when creating a new notification type

## 3.11.0

### Minor Changes

- Create notification settings on creating account

## 3.10.0

### Minor Changes

- Fix task overdue scheduler. It was creating notification for all users. It is resolved by not looping through the users and instead, passing user id from the task itself
- Do not return dates in notification type as it is not needed
- Implement notification type model
- Fix regex error in sending signup verification controller
- Update creating notifications

## 3.9.0

### Minor Changes

- Fix sending data property to createNotificationService. Data was empty due to the zod validation. Now it is set to .passthrough to read all properties. Data is sent after converting to a readable object.

## 3.8.0

### Minor Changes

- Create notifications on task actions
- Update deleting notification strategy: Deleting or clearing notifications is not actually deleting them from the database. Instead update a property called "dismissed", so the scheduler doesn't create new notification after deleting one.
- Create notifications on project actions

## 3.7.0

### Minor Changes

- Add a cron job to check every one minute whether a task is overdue or not for each user. If so, create a notification.

## 3.6.0

### Minor Changes

- Add all missing controllers and services specified in todo tasks
- Implement notification model

### Patch Changes

- Return notification count and notifications itself for each user in profile

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.5.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.5.0...v3.5.1) (2025-03-23)

### Bug Fixes

- update use of getUserAgent middleware to prevent unnecessary request to ipapi api ([6b8bb52](https://github.com/ZeynalliZeynal/todoist-server/commit/6b8bb521434311676b424ac37ac5eb7807de88c6))

## [3.5.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.4.1...v3.5.0) (2025-03-23)

### Features

- populate tasks in project model ([56a1b53](https://github.com/ZeynalliZeynal/todoist-server/commit/56a1b532ec7c13a353ba346cde5b93e28a2b3986))

### [3.4.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.4.0...v3.4.1) (2025-03-23)

### Bug Fixes

- change updating way of projects and tasks to trigger the save middleware of models ([0c6e01a](https://github.com/ZeynalliZeynal/todoist-server/commit/0c6e01a8126c79ef22773ed6f977d96f651c1f86))

## [3.4.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.2...v3.4.0) (2025-03-23)

### Features

- delete existing file from the storage when uploading a new one. If there is an existing avatar stored in s3 bucket, delete it before uploading new one. ([8bc3cb9](https://github.com/ZeynalliZeynal/todoist-server/commit/8bc3cb956651d0322d68e0d6c85c6eacc1c93b6a))

### [3.3.2](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.1...v3.3.2) (2025-03-22)

### Bug Fixes

- change ip api ([7b292ca](https://github.com/ZeynalliZeynal/todoist-server/commit/7b292ca6dbebad905e2c5ac1a2d0eae5686b1d51))
- validate name property in user model to accept only letters, not symbols ([9805f8b](https://github.com/ZeynalliZeynal/todoist-server/commit/9805f8b5fc0a57009a92d1b2f31a6d934b87494d))

### [3.3.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.0...v3.3.1) (2025-03-22)

### Bug Fixes

- update task default dueDate property ([fa8543c](https://github.com/ZeynalliZeynal/todoist-server/commit/fa8543c0613f2cc04868cd793a4006250ade24d1))

## [3.3.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.2.0...v3.3.0) (2025-03-22)

### Features

- add task to completed and remove from completed controllers ([1f89479](https://github.com/ZeynalliZeynal/todoist-server/commit/1f8947908d2c2af44bc8d281511fc20646a2cbe2))

## [3.2.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.1.0...v3.2.0) (2025-03-22)

### Features

- update task model ([91d18ed](https://github.com/ZeynalliZeynal/todoist-server/commit/91d18ed431cdd7d8f30f6b0535c582ba5316ab64))

## [3.1.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.0.0...v3.1.0) (2025-03-22)

### Features

- add a middleware to get user agent and location ([45d461b](https://github.com/ZeynalliZeynal/todoist-server/commit/45d461b1c6ca0c492b9d4f9563e384aabbec1527))

## [3.0.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.4.0...v3.0.0) (2025-03-16)

### ⚠ BREAKING CHANGES

- add task tag model, router, and controllers. When deleting a tag, it will also take that tag out of the tasks where it is used.

### Features

- add task tag model, router, and controllers. When deleting a tag, it will also take that tag out of the tasks where it is used. ([b80a40f](https://github.com/ZeynalliZeynal/todoist-server/commit/b80a40fc0600fcee05bd8e0331ff0465a15a333e))

## [2.4.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.3.0...v2.4.0) (2025-03-15)

### Features

- get sorted sessions ([1656f83](https://github.com/ZeynalliZeynal/todoist-server/commit/1656f83662e49b75ff00fa31f430ac58111c673a))
- send number of tasks and projects in profile ([758eb10](https://github.com/ZeynalliZeynal/todoist-server/commit/758eb1078c9881800cc02cbab48e5d52c109e5c8))

## [2.3.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.2...v2.3.0) (2025-03-14)

### Features

- add uploading a file to s3 bucket feature ([b1c0d72](https://github.com/ZeynalliZeynal/todoist-server/commit/b1c0d72a6533555035ef2b0bb6becf16ca947cc7))

### [2.2.2](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.1...v2.2.2) (2025-03-02)

### Bug Fixes

- add messages in responses, and let the user to create a unique named task in a single project, not including others ([9ad59dd](https://github.com/ZeynalliZeynal/todoist-server/commit/9ad59dd285a867bb3643ad5c4412f4e17200fd6e))

### [2.2.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.0...v2.2.1) (2025-03-02)

### Bug Fixes

- update favorite to false in removeProjectFromFavorites controller ([1cb507b](https://github.com/ZeynalliZeynal/todoist-server/commit/1cb507b479b9ec3fca6691ab978f26aeceea33da))

## [2.2.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.1.0...v2.2.0) (2025-03-02)

### Features

- add and remove favorite project features ([ff9e785](https://github.com/ZeynalliZeynal/todoist-server/commit/ff9e7855a85074215d95d8e154dc80bdea11f8df))

## [2.1.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.0.0...v2.1.0) (2025-02-19)

### Features

- add deleting and updating project functionalities. ([a234431](https://github.com/ZeynalliZeynal/todoist-server/commit/a234431c14a033ad4a006dae2789bdf2590684f3))

## [2.0.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v1.0.1...v2.0.0) (2025-02-16)

### ⚠ BREAKING CHANGES

- add project model. tasks must belong to a project. a task is linked to a project with project id - project property

### Features

- add project model. tasks must belong to a project. a task is linked to a project with project id - project property ([6381cbc](https://github.com/ZeynalliZeynal/todoist-server/commit/6381cbc88fb6cc2ac9e51157569fa004acbcba95))
- add vercel.json file ([52d8fa9](https://github.com/ZeynalliZeynal/todoist-server/commit/52d8fa95c86af58a585f936bc2e291fb2018eebf))

### Bug Fixes

- adapt cors based on the environment ([3dcb860](https://github.com/ZeynalliZeynal/todoist-server/commit/3dcb860050b8fe9ff1df1ae90ad5ebd65e75bc0b))
- resolve type bugs ([aa350f9](https://github.com/ZeynalliZeynal/todoist-server/commit/aa350f956c4e84da39f6d497d6c62b05b6f96146))

## 1.1.0

### Minor Changes

- Add features to enable users to get user's plan and tasks using query params

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.1 (2025-01-22)
