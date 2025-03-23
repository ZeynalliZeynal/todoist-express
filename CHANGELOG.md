# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.5.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.5.0...v3.5.1) (2025-03-23)


### Bug Fixes

* update use of getUserAgent middleware to prevent unnecessary request to ipapi api ([6b8bb52](https://github.com/ZeynalliZeynal/todoist-server/commit/6b8bb521434311676b424ac37ac5eb7807de88c6))

## [3.5.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.4.1...v3.5.0) (2025-03-23)


### Features

* populate tasks in project model ([56a1b53](https://github.com/ZeynalliZeynal/todoist-server/commit/56a1b532ec7c13a353ba346cde5b93e28a2b3986))

### [3.4.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.4.0...v3.4.1) (2025-03-23)


### Bug Fixes

* change updating way of projects and tasks to trigger the save middleware of models ([0c6e01a](https://github.com/ZeynalliZeynal/todoist-server/commit/0c6e01a8126c79ef22773ed6f977d96f651c1f86))

## [3.4.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.2...v3.4.0) (2025-03-23)


### Features

* delete existing file from the storage when uploading a new one. If there is an existing avatar stored in s3 bucket, delete it before uploading new one. ([8bc3cb9](https://github.com/ZeynalliZeynal/todoist-server/commit/8bc3cb956651d0322d68e0d6c85c6eacc1c93b6a))

### [3.3.2](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.1...v3.3.2) (2025-03-22)


### Bug Fixes

* change ip api ([7b292ca](https://github.com/ZeynalliZeynal/todoist-server/commit/7b292ca6dbebad905e2c5ac1a2d0eae5686b1d51))
* validate name property in user model to accept only letters, not symbols ([9805f8b](https://github.com/ZeynalliZeynal/todoist-server/commit/9805f8b5fc0a57009a92d1b2f31a6d934b87494d))

### [3.3.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.3.0...v3.3.1) (2025-03-22)


### Bug Fixes

* update task default dueDate property ([fa8543c](https://github.com/ZeynalliZeynal/todoist-server/commit/fa8543c0613f2cc04868cd793a4006250ade24d1))

## [3.3.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.2.0...v3.3.0) (2025-03-22)


### Features

* add task to completed and remove from completed controllers ([1f89479](https://github.com/ZeynalliZeynal/todoist-server/commit/1f8947908d2c2af44bc8d281511fc20646a2cbe2))

## [3.2.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.1.0...v3.2.0) (2025-03-22)


### Features

* update task model ([91d18ed](https://github.com/ZeynalliZeynal/todoist-server/commit/91d18ed431cdd7d8f30f6b0535c582ba5316ab64))

## [3.1.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v3.0.0...v3.1.0) (2025-03-22)


### Features

* add a middleware to get user agent and location ([45d461b](https://github.com/ZeynalliZeynal/todoist-server/commit/45d461b1c6ca0c492b9d4f9563e384aabbec1527))

## [3.0.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.4.0...v3.0.0) (2025-03-16)


### ⚠ BREAKING CHANGES

* add task tag model, router, and controllers. When deleting a tag, it will also take that tag out of the tasks where it is used.

### Features

* add task tag model, router, and controllers. When deleting a tag, it will also take that tag out of the tasks where it is used. ([b80a40f](https://github.com/ZeynalliZeynal/todoist-server/commit/b80a40fc0600fcee05bd8e0331ff0465a15a333e))

## [2.4.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.3.0...v2.4.0) (2025-03-15)


### Features

* get sorted sessions ([1656f83](https://github.com/ZeynalliZeynal/todoist-server/commit/1656f83662e49b75ff00fa31f430ac58111c673a))
* send number of tasks and projects in profile ([758eb10](https://github.com/ZeynalliZeynal/todoist-server/commit/758eb1078c9881800cc02cbab48e5d52c109e5c8))

## [2.3.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.2...v2.3.0) (2025-03-14)


### Features

* add uploading a file to s3 bucket feature ([b1c0d72](https://github.com/ZeynalliZeynal/todoist-server/commit/b1c0d72a6533555035ef2b0bb6becf16ca947cc7))

### [2.2.2](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.1...v2.2.2) (2025-03-02)


### Bug Fixes

* add messages in responses, and let the user to create a unique named task in a single project, not including others ([9ad59dd](https://github.com/ZeynalliZeynal/todoist-server/commit/9ad59dd285a867bb3643ad5c4412f4e17200fd6e))

### [2.2.1](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.2.0...v2.2.1) (2025-03-02)


### Bug Fixes

* update favorite to false in removeProjectFromFavorites controller ([1cb507b](https://github.com/ZeynalliZeynal/todoist-server/commit/1cb507b479b9ec3fca6691ab978f26aeceea33da))

## [2.2.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.1.0...v2.2.0) (2025-03-02)


### Features

* add and remove favorite project features ([ff9e785](https://github.com/ZeynalliZeynal/todoist-server/commit/ff9e7855a85074215d95d8e154dc80bdea11f8df))

## [2.1.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v2.0.0...v2.1.0) (2025-02-19)


### Features

* add deleting and updating project functionalities. ([a234431](https://github.com/ZeynalliZeynal/todoist-server/commit/a234431c14a033ad4a006dae2789bdf2590684f3))

## [2.0.0](https://github.com/ZeynalliZeynal/todoist-server/compare/v1.0.1...v2.0.0) (2025-02-16)


### ⚠ BREAKING CHANGES

* add project model. tasks must belong to a project. a task is linked to a project with project id - project property

### Features

* add project model. tasks must belong to a project. a task is linked to a project with project id - project property ([6381cbc](https://github.com/ZeynalliZeynal/todoist-server/commit/6381cbc88fb6cc2ac9e51157569fa004acbcba95))
* add vercel.json file ([52d8fa9](https://github.com/ZeynalliZeynal/todoist-server/commit/52d8fa95c86af58a585f936bc2e291fb2018eebf))


### Bug Fixes

* adapt cors based on the environment ([3dcb860](https://github.com/ZeynalliZeynal/todoist-server/commit/3dcb860050b8fe9ff1df1ae90ad5ebd65e75bc0b))
* resolve type bugs ([aa350f9](https://github.com/ZeynalliZeynal/todoist-server/commit/aa350f956c4e84da39f6d497d6c62b05b6f96146))

## 1.1.0

### Minor Changes

- Add features to enable users to get user's plan and tasks using query params

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.1 (2025-01-22)
