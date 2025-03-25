# Todos

## Notification feature

Implement notification feature on the server.

### Variables

- _**name**_
- _**description**_
- _**type**_ - This is an `enum` type to indicate what sort of the notification is. For example, `task/overdue` or `project/deletion-process`
- _**data**_ - This is the `object` the notification is related to. It is the data which refers to one of the models, such as `User`, `Task`, or `Project`
- _**archived**_ - This is a `boolean` type which indicates whether the notification is archived or not
- _**value**_ - This `string` property stores the `id` of the `data` passed in case it might be needed
- _**user**_
- _**read**_ - `boolean` type property which indicates whether the notification is read or not

### Tasks

- _~~Model~~_
- _Controllers_
  - ~~get all notifications~~
  - ~~get notification~~
  - ~~create notification~~
  - ~~read, unread, unread all, and read all notifications~~
  - ~~archive, unarchive, unarchive all, and archive all notifications~~
  - ~~delete and clear notifications~~
- _Router_
- _Services_
