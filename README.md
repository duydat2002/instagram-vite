# instagram-vite

This project is still under development 🔥🔥🔥

## Stack used

1. Vue 3
2. Vue router
3. Pinia
4. Typescript
5. Firebase
6. Other - date-fns, some lodash functions, fontawesome,...

## App Features

### Common

- Dark / light mode
- Splash loading
- Loading progress when change route
- Loading user / currentUser before render

### Auth

- Login / Register
- Unique username / email check
- Check your real phone number and email (currently disabled because api restricts usage)

### Nav

- Automatically return to the previous tab when deactivating add-on tabs: (Search, Notify, Bar)
- Automatically select the current tab according to the route
- Show tooltip when hover tab 1s in narrow mode
- Change nav when resizing to mobile

### Search

- Relative search (starts with) username and fullname using firebase's built-in functions
- Store search history
- Automatically sort the latest search to the top
- Delete 1 or clear all search history

### Profile

- Follow / unfollow other users
- Real-time follower / following count updates
- Show modal followers, followings, mutual followers, mutual first followers by route

### Other

- ...

## Recommended IDE Setup

1. Disable the built-in TypeScript Extension
   - Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   - Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Installation

1. npm install
2. npm run dev

## Notes

- Dự án này được thực hiện bởi Phạm Duy Đạt từ 25/6/2023. Do mới tiếp cận các ngôn ngữ trên nên còn nhiều thiếu sót.
